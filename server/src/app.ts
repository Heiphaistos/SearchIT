import { timingSafeEqual } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import Fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import { config } from './config.js';
import { loadCatalog, toReference, type Catalog } from './catalog/index.js';
import { getProductSheet } from './connectors/icecat.js';
import { createRegistry, type Registry } from './connectors/registry.js';
import { ContractError, parseEnginePcRequest, toEnginePcResponse } from './enginepc.js';
import { openApiSpec } from './openapi.js';
import { ratesInfo, refreshRates } from './search/currency.js';
import { SearchEngine } from './search/engine.js';
import { HistoryStore } from './search/history.js';
import { CATEGORIES, CATEGORY_GROUPS, isCategoryId } from './shared/categories.js';
import type { CatalogSort, CategoryId, Condition, LookupItem, LookupRequest, SearchParams, SortKey } from './shared/types.js';

const CONDITIONS: Condition[] = ['new', 'refurbished', 'used'];
const SORTS: SortKey[] = ['relevance', 'price-asc', 'price-desc', 'savings', 'offers', 'unit-price', 'value'];

class BadRequest extends Error {}

function csv(value: unknown): string[] | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const list = (Array.isArray(value) ? value : String(value).split(',')).map((s) => String(s).trim()).filter(Boolean);
  return list.length ? list : undefined;
}

function num(value: unknown, name: string): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) throw new BadRequest(`Paramètre « ${name} » invalide`);
  return n;
}

function bool(value: unknown): boolean | undefined {
  if (value === undefined || value === '') return undefined;
  return value === true || value === 'true' || value === '1';
}

function parseConditions(value: unknown): Condition[] | undefined {
  const list = csv(value);
  if (!list) return undefined;
  const bad = list.filter((c) => !CONDITIONS.includes(c as Condition));
  if (bad.length) throw new BadRequest(`État inconnu : ${bad.join(', ')} (attendu : ${CONDITIONS.join(', ')})`);
  return list as Condition[];
}

export function parseSearchParams(query: Record<string, unknown>): SearchParams {
  const q = String(query.q ?? '').trim();
  if (!q && !query.category) throw new BadRequest('Le paramètre « q » (ou « category ») est requis');
  if (q.length > 200) throw new BadRequest('Requête trop longue (200 caractères max.)');
  const category = query.category ? String(query.category) : undefined;
  if (category && !isCategoryId(category)) throw new BadRequest(`Catégorie inconnue : ${category}`);
  const sort = (query.sort ? String(query.sort) : 'relevance') as SortKey;
  if (!SORTS.includes(sort)) throw new BadRequest(`Tri inconnu : ${sort}`);
  return {
    q,
    category: category as SearchParams['category'],
    conditions: parseConditions(query.conditions),
    merchants: csv(query.merchants),
    minPrice: num(query.minPrice, 'minPrice'),
    maxPrice: num(query.maxPrice, 'maxPrice'),
    inStockOnly: bool(query.inStock),
    hideAccessories: bool(query.hideAccessories),
    sort,
    page: num(query.page, 'page'),
    pageSize: num(query.pageSize, 'pageSize'),
  };
}

export function parseLookupRequest(body: unknown): LookupRequest {
  if (!body || typeof body !== 'object') throw new BadRequest('Corps JSON attendu');
  const b = body as Record<string, unknown>;
  if (!Array.isArray(b.items) || !b.items.length) throw new BadRequest('« items » doit être un tableau non vide');
  if (b.items.length > 50) throw new BadRequest('50 articles maximum par requête');
  const items: LookupItem[] = b.items.map((raw, i) => {
    const it = (raw ?? {}) as Record<string, unknown>;
    const query = String(it.query ?? it.name ?? '').trim();
    if (!query && !it.gtin && !it.mpn) throw new BadRequest(`items[${i}] : « query », « gtin » ou « mpn » requis`);
    const category = it.category ? String(it.category) : undefined;
    if (category && !isCategoryId(category)) throw new BadRequest(`items[${i}] : catégorie inconnue ${category}`);
    return {
      ref: String(it.ref ?? it.id ?? i),
      query,
      category: category as LookupItem['category'],
      gtin: it.gtin ? String(it.gtin) : undefined,
      mpn: it.mpn ? String(it.mpn) : undefined,
      quantity: num(it.quantity, `items[${i}].quantity`),
      conditions: parseConditions(it.conditions),
      maxPrice: num(it.maxPrice, `items[${i}].maxPrice`),
    };
  });
  return {
    items,
    conditions: parseConditions(b.conditions),
    merchants: csv(b.merchants),
    alternatives: num(b.alternatives, 'alternatives'),
  };
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Clé d'API d'une requête : en-tête x-api-key ou Authorization: Bearer <clé>. */
export function apiKeyFrom(headers: FastifyRequest['headers']): string | undefined {
  const key = headers['x-api-key'];
  if (typeof key === 'string' && key) return key;
  const match = /^Bearer\s+(\S+)$/i.exec(headers.authorization ?? '');
  return match?.[1];
}

export interface AppOptions {
  registry?: Registry;
  catalog?: Catalog;
  /** Fichier d'historique ; `null` pour un historique en mémoire (tests). */
  historyFile?: string | null;
  logger?: boolean;
  serveWeb?: boolean;
}

export async function buildApp(options: AppOptions = {}): Promise<FastifyInstance> {
  const catalog = options.catalog ?? (await loadCatalog());
  const registry = options.registry ?? createRegistry(catalog);
  const history = new HistoryStore(options.historyFile === undefined ? config.historyFile : options.historyFile);
  const engine = new SearchEngine(registry.connectors, {
    history,
    catalog,
    timeoutMs: config.searchTimeoutMs,
    cacheTtlMs: config.cacheTtlSeconds * 1000,
    merchantNames: new Map(registry.merchants.map((m) => [m.id, m.name])),
  });

  const app = Fastify({
    logger: options.logger ?? false,
    // Derrière nginx : seuls le proxy local et les réseaux privés (Docker) sont de confiance
    // pour X-Forwarded-For, sinon n'importe qui pourrait choisir son IP et contourner le rate limit.
    trustProxy: config.trustProxy,
    bodyLimit: 256 * 1024,
  });

  // En-têtes de sécurité. Les images viennent des marchands : toute origine HTTPS.
  await app.register(helmet, {
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        manifestSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  });

  // Limite de débit par IP sur tout /api/* (protège aussi les crédits gratuits Google Shopping
  // contre les robots) ; les routes qui interrogent les marchands ont un quota plus strict
  // via `limited()`. Les clés d'API valides en sont exemptées, RATE_LIMIT_PER_MINUTE=0 désactive tout.
  const rl = config.rateLimitPerMinute;
  const hasValidKey = (req: FastifyRequest) => {
    const key = apiKeyFrom(req.headers);
    return !!key && config.apiKeys.some((k) => safeEqual(k, key));
  };
  await app.register(rateLimit, {
    max: Math.max(1, rl * 4),
    timeWindow: '1 minute',
    allowList: (req) => rl <= 0 || !req.url.startsWith('/api/') || hasValidKey(req),
    errorResponseBuilder: (_req, ctx) => ({
      statusCode: 429,
      error: `Trop de requêtes : réessayez dans ${Math.ceil(ctx.ttl / 1000)} s.`,
    }),
  });
  const limited = (perMinute: number) =>
    rl > 0 ? { config: { rateLimit: { max: Math.max(1, Math.round(perMinute)), timeWindow: '1 minute' } } } : {};

  app.addHook('onClose', async () => history.flush());

  await app.register(cors, {
    origin: !config.corsOrigins.length || config.corsOrigins.includes('*') ? true : config.corsOrigins,
  });

  app.setErrorHandler((error: Error & { statusCode?: number }, _req, reply) => {
    if (error instanceof BadRequest || error instanceof ContractError) return reply.status(400).send({ error: error.message });
    if (error.statusCode && error.statusCode < 500) return reply.status(error.statusCode).send({ error: error.message });
    app.log.error(error);
    return reply.status(500).send({ error: 'Erreur interne' });
  });

  // Clé d'API optionnelle pour l'API publique /api/v1 (configurateur, partenaires).
  const requireKey = async (req: FastifyRequest, reply: FastifyReply) => {
    if (!config.apiKeys.length) return;
    const key = apiKeyFrom(req.headers);
    if (!key || !config.apiKeys.some((k) => safeEqual(k, key))) {
      return reply.status(401).send({ error: 'Clé d’API manquante ou invalide (en-tête x-api-key ou Authorization: Bearer)' });
    }
  };

  app.get('/api/health', async () => ({
    status: 'ok',
    demo: engine.isDemo(),
    sources: engine.activeConnectors().map((c) => c.id),
    catalog: catalog.size,
    currencies: ratesInfo(),
  }));

  app.get('/api/categories', async () => ({ groups: CATEGORY_GROUPS, categories: CATEGORIES.map(({ keywords: _k, ...c }) => c) }));

  app.get('/api/merchants', async () => {
    const connectors = new Map(registry.connectors.map((c) => [c.merchantId, c]));
    return {
      demo: engine.isDemo(),
      merchants: registry.merchantInfo().map((m) => ({ ...m, details: connectors.get(m.id)?.describe?.() })),
    };
  });

  const searchHandler = async (req: FastifyRequest) => engine.search(parseSearchParams(req.query as Record<string, unknown>));
  const lookupHandler = async (req: FastifyRequest) => engine.lookup(parseLookupRequest(req.body));

  // Fiche technique (Open Icecat) par EAN ou marque + référence fabricant.
  const sheetHandler = async (req: FastifyRequest) => {
    const q = req.query as Record<string, string | undefined>;
    if (!q.gtin && !(q.brand && q.mpn)) throw new BadRequest('« gtin » ou « brand » + « mpn » requis');
    try {
      return await getProductSheet({ gtin: q.gtin, brand: q.brand, mpn: q.mpn, lang: q.lang });
    } catch {
      return { found: false, source: 'Icecat' };
    }
  };
  app.get('/api/product-sheet', limited(rl), sheetHandler);
  app.get('/api/v1/product-sheet', { preHandler: requireKey, ...limited(rl) }, sheetHandler);

  app.get('/api/search', limited(rl), searchHandler);
  // Aperçu d'un produit : prix relus chez les marchands si le relevé a plus de SCRAPE_REFRESH_MINUTES.
  const refreshMs = (Number.parseInt(process.env.SCRAPE_REFRESH_MINUTES ?? '', 10) || 15) * 60_000;
  app.get('/api/refresh', limited(rl), async (req) => {
    const query = req.query as Record<string, unknown>;
    const key = String(query.key ?? '');
    const title = String(query.title ?? '');
    if (!key || key.length > 400 || title.length > 400) throw new BadRequest('« key » (et « title ») requis, 400 caractères max.');
    const params = parseSearchParams({ q: query.q, category: query.category });
    return { group: await engine.refreshGroup(params, key, title, refreshMs), refreshedAt: new Date().toISOString() };
  });
  // Lots jusqu'à 50 articles : quota plus strict que la recherche.
  app.post('/api/lookup', limited(rl / 3), lookupHandler);

  app.get('/api/suggest', limited(rl * 4), async (req) => {
    const q = String((req.query as Record<string, unknown>).q ?? '').slice(0, 80);
    return engine.suggest(q);
  });

  // Suggestions au format OpenSearch (barre d'adresse du navigateur).
  app.get('/api/opensearch-suggest', limited(rl * 4), async (req, reply) => {
    const q = String((req.query as Record<string, unknown>).q ?? '').slice(0, 80);
    reply.type('application/x-suggestions+json');
    return [q, engine.suggest(q).queries];
  });

  // Bons plans : fortes baisses de prix réellement relevées.
  app.get('/api/deals', async (req) => {
    const q = req.query as Record<string, string | undefined>;
    const category = q.category && isCategoryId(q.category) ? q.category : undefined;
    return { deals: history.deals({ category, limit: Math.min(100, Number(q.limit) || 48) }), demo: engine.isDemo() };
  });

  // Tableau de bord d'administration (jeton ADMIN_TOKEN, comparaison à temps constant).
  app.get('/api/admin/stats', limited(20), async (req, reply) => {
    if (!config.adminToken) return reply.status(404).send({ error: 'Administration désactivée : définissez ADMIN_TOKEN dans .env' });
    const given = Buffer.from(String(req.headers['x-admin-token'] ?? ''));
    const expected = Buffer.from(config.adminToken);
    if (given.length !== expected.length || !timingSafeEqual(given, expected)) return reply.status(401).send({ error: 'Jeton invalide' });
    const mem = process.memoryUsage();
    return {
      now: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      memoryMb: Math.round(mem.rss / 1_048_576),
      node: process.version,
      demo: engine.isDemo(),
      engine: engine.stats(),
      history: history.stats(),
      currencies: ratesInfo(),
      topQueries: history.topQueries(30),
      sources: registry.connectors.map((c) => ({ id: c.id, merchantId: c.merchantId, enabled: c.enabled(), details: c.describe?.() ?? null })),
    };
  });

  // Catalogue de référence : base de produits réels avec caractéristiques.
  const catalogList = async (req: FastifyRequest) => {
    const q = req.query as Record<string, string | undefined>;
    if (q.category && !isCategoryId(q.category)) throw new BadRequest(`Catégorie inconnue : ${q.category}`);
    const sort = (['recent', 'name', 'msrp-asc', 'msrp-desc'] as CatalogSort[]).includes(q.sort as CatalogSort) ? (q.sort as CatalogSort) : 'recent';
    return catalog.list({
      category: q.category as CategoryId | undefined,
      q: q.q?.slice(0, 100),
      brand: q.brand,
      tag: q.tag,
      sort,
      page: Number(q.page) || 1,
      pageSize: Number(q.pageSize) || 48,
    });
  };
  const catalogItem = async (req: FastifyRequest, reply: FastifyReply) => {
    const product = catalog.get((req.params as { id: string }).id);
    if (!product) return reply.status(404).send({ error: 'Produit inconnu' });
    return { product, reference: toReference(product), similar: catalog.similar(product) };
  };
  app.get('/api/catalog', limited(rl * 2), catalogList);
  app.get('/api/catalog/stats', async () => catalog.stats());
  app.get('/api/catalog/:id', limited(rl * 2), catalogItem);
  app.get('/api/v1/catalog', { preHandler: requireKey, ...limited(rl * 2) }, catalogList);
  app.get('/api/v1/catalog/:id', { preHandler: requireKey, ...limited(rl * 2) }, catalogItem);

  app.get('/api/history/:key', async (req) => {
    const { key } = req.params as { key: string };
    return { key, points: history.points(key), summary: history.summary(key) ?? null };
  });

  // API publique versionnée, pour le configurateur de PC et les intégrations.
  app.get('/api/v1/search', { preHandler: requireKey, ...limited(rl) }, searchHandler);
  app.post('/api/v1/lookup', { preHandler: requireKey, ...limited(rl / 3) }, lookupHandler);
  app.get('/api/v1/merchants', { preHandler: requireKey }, async () => ({ merchants: registry.merchantInfo() }));
  app.get('/api/v1/openapi.json', async () => openApiSpec);

  // Contrat du configurateur EnginePC (le catalogue de caractéristiques est /api/v1/catalog ci-dessus).
  app.post('/api/v1/prices/lookup', { preHandler: requireKey, ...limited(rl / 3) }, async (req) =>
    toEnginePcResponse(await engine.lookup(parseEnginePcRequest(req.body))),
  );

  // Taux de change BCE + préchargement des catalogues en arrière-plan.
  void refreshRates();
  // Précharge les flux en arrière-plan pour que la première recherche soit rapide.
  for (const c of registry.connectors) if (c.enabled() && c.warmup) void c.warmup().catch(() => undefined);

  // Référencement : robots.txt et plan du site (pages, catégories, recherches populaires).
  app.get('/robots.txt', async (_req, reply) => {
    reply.type('text/plain; charset=utf-8');
    return `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin\nDisallow: /configuration\nDisallow: /liste\nSitemap: ${config.publicUrl}/sitemap.xml\n`;
  });
  app.get('/sitemap.xml', async (_req, reply) => {
    const urls = [
      '/',
      '/bons-plans',
      '/catalogue',
      ...catalog.products.map((p) => `/catalogue/${p.id}`),
      '/sources',
      '/developpeurs',
      ...CATEGORIES.filter((c) => c.id !== 'other').map((c) => `/recherche?category=${c.id}`),
      ...history.popularQueries('', 200).map((q) => `/recherche?q=${encodeURIComponent(q)}`),
    ];
    const esc = (u: string) => u.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    reply.type('application/xml; charset=utf-8').header('cache-control', 'public, max-age=3600');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((u) => `  <url><loc>${esc(config.publicUrl + u)}</loc></url>`)
      .join('\n')}\n</urlset>\n`;
  });

  if (options.serveWeb !== false && fs.existsSync(config.webDist)) {
    await app.register(fastifyStatic, {
      root: config.webDist,
      wildcard: false,
      // Fichiers versionnés par Vite : cache long ; le reste (index.html…) toujours revalidé.
      setHeaders: (res, filePath) => {
        res.header('cache-control', filePath.includes(`${path.sep}assets${path.sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache');
      },
    });
    app.setNotFoundHandler((req, reply) => {
      if (req.url.startsWith('/api/')) return reply.status(404).send({ error: 'Route inconnue' });
      // Fichier versionné disparu (ancien onglet après un déploiement) : vrai 404, pas la page HTML.
      if (req.url.startsWith('/assets/')) return reply.status(404).type('text/plain').send('Not found');
      return reply.header('cache-control', 'no-cache').sendFile('index.html');
    });
  }

  return app;
}
