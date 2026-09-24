import fs from 'node:fs';
import path from 'node:path';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import Fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import { config } from './config.js';
import { getProductSheet } from './connectors/icecat.js';
import { createRegistry, type Registry } from './connectors/registry.js';
import { openApiSpec } from './openapi.js';
import { ratesInfo, refreshRates } from './search/currency.js';
import { SearchEngine } from './search/engine.js';
import { HistoryStore } from './search/history.js';
import { CATEGORIES, CATEGORY_GROUPS, isCategoryId } from './shared/categories.js';
import type { Condition, LookupItem, LookupRequest, SearchParams, SortKey } from './shared/types.js';

const CONDITIONS: Condition[] = ['new', 'refurbished', 'used'];
const SORTS: SortKey[] = ['relevance', 'price-asc', 'price-desc', 'savings', 'offers', 'unit-price'];

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

export interface AppOptions {
  registry?: Registry;
  /** Fichier d'historique ; `null` pour un historique en mémoire (tests). */
  historyFile?: string | null;
  logger?: boolean;
  serveWeb?: boolean;
}

export async function buildApp(options: AppOptions = {}): Promise<FastifyInstance> {
  const registry = options.registry ?? createRegistry();
  const history = new HistoryStore(options.historyFile === undefined ? config.historyFile : options.historyFile);
  const engine = new SearchEngine(registry.connectors, {
    history,
    timeoutMs: config.searchTimeoutMs,
    cacheTtlMs: config.cacheTtlSeconds * 1000,
    merchantNames: new Map(registry.merchants.map((m) => [m.id, m.name])),
  });

  const app = Fastify({ logger: options.logger ?? false, trustProxy: config.trustProxy });

  // En-têtes de sécurité. Les images viennent des marchands : img-src ouvert.
  await app.register(helmet, {
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ['*', 'data:'],
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

  // Limite de débit par IP sur les routes qui interrogent les marchands (protège aussi
  // les crédits gratuits Google Shopping contre les robots). Les clés d'API en sont exemptées.
  await app.register(rateLimit, {
    global: false,
    allowList: (req) => config.apiKeys.length > 0 && config.apiKeys.includes(String(req.headers['x-api-key'] ?? '')),
    errorResponseBuilder: (_req, ctx) => ({
      statusCode: 429,
      error: `Trop de requêtes : réessayez dans ${Math.ceil(ctx.ttl / 1000)} s.`,
    }),
  });
  const limited = (perMinute: number) =>
    config.rateLimitPerMinute > 0 ? { config: { rateLimit: { max: Math.max(1, Math.round(perMinute)), timeWindow: '1 minute' } } } : {};

  app.addHook('onClose', async () => history.flush());

  await app.register(cors, {
    origin: !config.corsOrigins.length || config.corsOrigins.includes('*') ? true : config.corsOrigins,
  });

  app.setErrorHandler((error: Error & { statusCode?: number }, _req, reply) => {
    if (error instanceof BadRequest) return reply.status(400).send({ error: error.message });
    if (error.statusCode && error.statusCode < 500) return reply.status(error.statusCode).send({ error: error.message });
    app.log.error(error);
    return reply.status(500).send({ error: 'Erreur interne' });
  });

  // Clé d'API optionnelle pour l'API publique /api/v1 (configurateur, partenaires).
  const requireKey = async (req: FastifyRequest, reply: FastifyReply) => {
    if (!config.apiKeys.length) return;
    const key = req.headers['x-api-key'];
    if (typeof key !== 'string' || !config.apiKeys.includes(key)) {
      return reply.status(401).send({ error: 'Clé d’API manquante ou invalide (en-tête x-api-key)' });
    }
  };

  app.get('/api/health', async () => ({
    status: 'ok',
    demo: engine.isDemo(),
    sources: engine.activeConnectors().map((c) => c.id),
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
  const rl = config.rateLimitPerMinute;
  app.get('/api/product-sheet', limited(rl), sheetHandler);
  app.get('/api/v1/product-sheet', { preHandler: requireKey, ...limited(rl) }, sheetHandler);

  app.get('/api/search', limited(rl), searchHandler);
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

  app.get('/api/history/:key', async (req) => {
    const { key } = req.params as { key: string };
    return { key, points: history.points(key), summary: history.summary(key) ?? null };
  });

  // API publique versionnée, pour le configurateur de PC et les intégrations.
  app.get('/api/v1/search', { preHandler: requireKey, ...limited(rl) }, searchHandler);
  app.post('/api/v1/lookup', { preHandler: requireKey, ...limited(rl / 3) }, lookupHandler);
  app.get('/api/v1/merchants', { preHandler: requireKey }, async () => ({ merchants: registry.merchantInfo() }));
  app.get('/api/v1/openapi.json', async () => openApiSpec);

  // Taux de change BCE + préchargement des catalogues en arrière-plan.
  void refreshRates();
  // Précharge les flux en arrière-plan pour que la première recherche soit rapide.
  for (const c of registry.connectors) if (c.enabled() && c.warmup) void c.warmup().catch(() => undefined);

  // Référencement : robots.txt et plan du site (pages, catégories, recherches populaires).
  app.get('/robots.txt', async (_req, reply) => {
    reply.type('text/plain; charset=utf-8');
    return `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${config.publicUrl}/sitemap.xml\n`;
  });
  app.get('/sitemap.xml', async (_req, reply) => {
    const urls = [
      '/',
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
      return reply.header('cache-control', 'no-cache').sendFile('index.html');
    });
  }

  return app;
}
