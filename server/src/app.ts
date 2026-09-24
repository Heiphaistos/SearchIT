import { timingSafeEqual } from 'node:crypto';
import fs from 'node:fs';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import Fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import { config } from './config.js';
import { getProductSheet } from './connectors/icecat.js';
import { createRegistry, type Registry } from './connectors/registry.js';
import { ContractError, parseEnginePcRequest, toEnginePcResponse } from './enginepc.js';
import { openApiSpec } from './openapi.js';
import { ratesInfo, refreshRates } from './search/currency.js';
import { SearchEngine } from './search/engine.js';
import { CATEGORIES, CATEGORY_GROUPS, isCategoryId } from './shared/categories.js';
import type { Condition, LookupItem, LookupRequest, SearchParams, SortKey } from './shared/types.js';

const CONDITIONS: Condition[] = ['new', 'refurbished', 'used'];
const SORTS: SortKey[] = ['relevance', 'price-asc', 'price-desc', 'savings', 'offers'];

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

// CSP du front Vite : scripts et styles servis par l'app (le style inline reste autorisé
// pour les attributs style de React), images marchandes externes en HTTPS.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

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
  logger?: boolean;
  serveWeb?: boolean;
}

export async function buildApp(options: AppOptions = {}): Promise<FastifyInstance> {
  const registry = options.registry ?? createRegistry();
  const engine = new SearchEngine(registry.connectors, {
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
  await app.register(rateLimit, {
    max: config.rateLimitPerMinute,
    timeWindow: '1 minute',
    allowList: (req) => !req.url.startsWith('/api/'),
    errorResponseBuilder: (_req, ctx) => ({ statusCode: 429, error: `Trop de requêtes : réessayez dans ${Math.ceil(ctx.ttl / 1000)} s` }),
  });
  app.addHook('onSend', async (req, reply) => {
    if (!req.url.startsWith('/api/')) reply.header('content-security-policy', CSP);
  });
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

  // Lots jusqu'à 50 articles : limite plus stricte que le reste de l'API.
  const heavy = { rateLimit: { max: Math.max(1, Math.ceil(config.rateLimitPerMinute / 4)), timeWindow: '1 minute' } };
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
  app.get('/api/product-sheet', sheetHandler);
  app.get('/api/v1/product-sheet', { preHandler: requireKey }, sheetHandler);

  app.get('/api/search', searchHandler);
  app.post('/api/lookup', { config: heavy }, lookupHandler);

  // API publique versionnée, pour le configurateur de PC et les intégrations.
  app.get('/api/v1/search', { preHandler: requireKey }, searchHandler);
  app.post('/api/v1/lookup', { preHandler: requireKey, config: heavy }, lookupHandler);
  app.get('/api/v1/merchants', { preHandler: requireKey }, async () => ({ merchants: registry.merchantInfo() }));
  app.get('/api/v1/openapi.json', async () => openApiSpec);

  // Contrat du configurateur EnginePC.
  app.post('/api/v1/prices/lookup', { preHandler: requireKey, config: heavy }, async (req) =>
    toEnginePcResponse(await engine.lookup(parseEnginePcRequest(req.body))),
  );
  // SearchIT ne tient pas de catalogue de caractéristiques : EnginePC garde le sien.
  app.get('/api/v1/catalog', { preHandler: requireKey }, async () => ({ components: [], devices: [] }));

  // Taux de change BCE + préchargement des catalogues en arrière-plan.
  void refreshRates();
  // Précharge les flux en arrière-plan pour que la première recherche soit rapide.
  for (const c of registry.connectors) if (c.enabled() && c.warmup) void c.warmup().catch(() => undefined);

  if (options.serveWeb !== false && fs.existsSync(config.webDist)) {
    await app.register(fastifyStatic, { root: config.webDist, wildcard: false });
    app.setNotFoundHandler((req, reply) => {
      if (req.url.startsWith('/api/')) return reply.status(404).send({ error: 'Route inconnue' });
      return reply.sendFile('index.html');
    });
  }

  return app;
}
