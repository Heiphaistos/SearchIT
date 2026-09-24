import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { parse as parseCsv } from 'csv-parse/sync';
import { XMLParser } from 'fast-xml-parser';
import { config, env } from '../config.js';
import type { MerchantDefinition } from '../merchants.js';
import { detectCategory, normalizeText, parseBoolean, parseCondition, parsePrice, tokenize } from '../search/normalize.js';
import { makeOffer } from '../search/offer.js';
import type { Offer } from '../shared/types.js';
import type { Connector, ConnectorQuery } from './types.js';

// Connecteur générique pour flux produits d'affiliation :
// - CSV Awin / Effinity / Kwanko / Kelkoo (séparateur détecté automatiquement)
// - XML Google Merchant (RSS 2.0 / Atom, champs g:*) ou XML quelconque
// - JSON (tableau d'objets, ou objet contenant un tableau)
// Les champs sont reconnus via des alias (FR/EN) et les flux gzip sont décompressés.

type RawRecord = Record<string, unknown>;

const FIELD_ALIASES = {
  id: ['id', 'aw_product_id', 'merchant_product_id', 'product_id', 'sku', 'offer_id', 'identifiant'],
  title: ['title', 'product_name', 'name', 'nom', 'titre', 'product_title', 'libelle', 'designation'],
  url: ['aw_deep_link', 'deeplink', 'deep_link', 'tracking_url', 'link', 'url', 'product_url', 'producturl', 'lien', 'merchant_deep_link'],
  salePrice: ['sale_price', 'prix_promo', 'promo_price', 'search_price', 'display_price'],
  price: ['price', 'prix', 'store_price', 'current_price', 'price_eur', 'prix_ttc', 'rrp_price', 'base_price'],
  shipping: ['delivery_cost', 'shipping', 'shipping_cost', 'shipping_price', 'frais_de_port', 'frais_port', 'delivery_price'],
  image: ['image_link', 'merchant_image_url', 'aw_image_url', 'large_image', 'image_url', 'imageurl', 'image', 'picture'],
  condition: ['condition', 'etat', 'product_condition', 'item_condition'],
  grade: ['condition_grade', 'grade', 'etat_detail', 'refurbished_grade'],
  brand: ['brand', 'brand_name', 'marque', 'manufacturer', 'fabricant'],
  gtin: ['gtin', 'ean', 'ean13', 'upc', 'product_gtin', 'isbn', 'gtin13'],
  mpn: ['mpn', 'model_number', 'reference', 'ref_fabricant', 'manufacturer_part_number'],
  category: ['product_type', 'merchant_category', 'category_name', 'category', 'categorie', 'google_product_category', 'merchant_product_category_path'],
  availability: ['availability', 'in_stock', 'stock_status', 'disponibilite', 'is_in_stock'],
  stockQty: ['stock_quantity', 'quantity', 'stock', 'qty'],
  currency: ['currency', 'devise'],
} as const;

type Field = keyof typeof FIELD_ALIASES;

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/^[a-z]+:/, '').replace(/[\s-]+/g, '_');
}

function flattenValue(value: unknown): unknown {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    if ('#text' in obj) return obj['#text'];
    // g:shipping { g:country, g:price } → prix
    for (const [k, v] of Object.entries(obj)) if (normalizeKey(k) === 'price') return v;
  }
  if (Array.isArray(value)) return flattenValue(value[0]);
  return value;
}

function normalizeRecord(record: RawRecord): Map<string, unknown> {
  const out = new Map<string, unknown>();
  for (const [k, v] of Object.entries(record)) {
    const key = normalizeKey(k);
    if (!out.has(key)) out.set(key, flattenValue(v));
  }
  return out;
}

function pick(rec: Map<string, unknown>, field: Field): string | undefined {
  for (const alias of FIELD_ALIASES[field]) {
    const v = rec.get(alias);
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
  }
  return undefined;
}

// Mots signalant un rayon high-tech dans la catégorie marchande (pour filtrer les flux généralistes).
const TECH_HINT = /informatique|high.?tech|telephon|smartphone|tablette|ordinateur|composant|electroni|computer|stockage|reseau|peripherique|gaming|image et son|audio|connecte|electronics|phones|video games|jeux video|consoles/;

export function isTechRecord(offerCategory: string, categoryHint: string | undefined): boolean {
  if (offerCategory !== 'other') return true;
  return categoryHint ? TECH_HINT.test(normalizeText(categoryHint)) : false;
}

/** Les marchands 100 % reconditionné déclarent souvent « new » dans leurs flux Google. */
function conditionFor(merchant: MerchantDefinition, parsed: Offer['condition']): Offer['condition'] {
  return merchant.refurbishedOnly && parsed === 'new' ? 'refurbished' : parsed;
}

export function recordToOffer(record: RawRecord, merchant: MerchantDefinition, keepAll = false): Offer | null {
  const rec = normalizeRecord(record);
  const title = pick(rec, 'title');
  const url = pick(rec, 'url');
  const basePrice = parsePrice(pick(rec, 'price'));
  const salePrice = parsePrice(pick(rec, 'salePrice'));
  const price = salePrice !== null && (basePrice === null || salePrice <= basePrice) ? salePrice : basePrice;
  if (!title || !url || price === null || price <= 0) return null;

  const categoryHint = pick(rec, 'category');
  const category = detectCategory(title) ?? (categoryHint ? detectCategory(categoryHint) : null) ?? 'other';
  if (!keepAll && !isTechRecord(category, categoryHint)) return null;

  const availability = pick(rec, 'availability');
  const qty = pick(rec, 'stockQty');
  let inStock = parseBoolean(availability);
  if (inStock === null && qty !== undefined && Number.isFinite(Number(qty))) inStock = Number(qty) > 0;
  const shippingRaw = pick(rec, 'shipping');
  const rawPrice = pick(rec, 'price') ?? '';
  const currency = pick(rec, 'currency') ?? (/[A-Z]{3}/.exec(rawPrice)?.[0] ?? 'EUR');
  const grade = pick(rec, 'grade');

  return makeOffer({
    merchantId: merchant.id,
    merchantName: merchant.name,
    sourceId: pick(rec, 'id'),
    title,
    url,
    price,
    currency,
    shipping: shippingRaw !== undefined ? parsePrice(shippingRaw) : null,
    imageUrl: pick(rec, 'image'),
    condition: conditionFor(merchant, parseCondition(pick(rec, 'condition'), `${title} ${grade ?? ''}`)),
    conditionGrade: grade,
    inStock,
    brand: pick(rec, 'brand'),
    gtin: pick(rec, 'gtin'),
    mpn: pick(rec, 'mpn'),
    category,
  });
}

// ---------- Parsing ----------

export function detectFormat(content: string): 'csv' | 'xml' | 'json' {
  const head = content.trimStart().slice(0, 1);
  if (head === '<') return 'xml';
  if (head === '[' || head === '{') return 'json';
  return 'csv';
}

function detectDelimiter(content: string): string {
  const firstLine = content.slice(0, content.indexOf('\n') > 0 ? content.indexOf('\n') : 2000);
  const candidates = [',', ';', '\t', '|'];
  return candidates.reduce((best, d) => (firstLine.split(d).length > firstLine.split(best).length ? d : best), ',');
}

/** Trouve le plus grand tableau d'objets dans une structure JSON/XML arbitraire. */
function findRecords(node: unknown, depth = 0): RawRecord[] {
  if (depth > 8 || !node || typeof node !== 'object') return [];
  if (Array.isArray(node)) {
    if (node.length && node.every((x) => x && typeof x === 'object' && !Array.isArray(x))) return node as RawRecord[];
    return [];
  }
  let best: RawRecord[] = [];
  for (const value of Object.values(node as Record<string, unknown>)) {
    const found = findRecords(value, depth + 1);
    if (found.length > best.length) best = found;
  }
  // Un unique <item> est parsé comme objet et non tableau.
  if (!best.length && depth > 0) {
    const obj = node as Record<string, unknown>;
    const values = Object.values(obj);
    if (values.length > 2 && values.every((v) => typeof v !== 'object' || v === null || '#text' in (v as object))) return [obj];
  }
  return best;
}

export function parseFeed(content: string, format: MerchantDefinition['feedFormat'] = 'auto'): RawRecord[] {
  const fmt = format === 'auto' || !format ? detectFormat(content) : format;
  if (fmt === 'json') return findRecords(JSON.parse(content));
  if (fmt === 'xml') {
    const parser = new XMLParser({ ignoreAttributes: true, parseTagValue: false, trimValues: true, isArray: (name) => name === 'item' || name === 'entry' || name === 'product' });
    return findRecords(parser.parse(content));
  }
  return parseCsv(content.replace(/^﻿/, ''), {
    columns: true,
    delimiter: detectDelimiter(content),
    skip_empty_lines: true,
    relax_column_count: true,
    relax_quotes: true,
    trim: true,
  }) as RawRecord[];
}

async function readSource(source: string, signal?: AbortSignal): Promise<string> {
  let buffer: Buffer;
  if (/^https?:\/\//i.test(source)) {
    const res = await fetch(source, { signal, headers: { 'accept-encoding': 'gzip, deflate' } });
    if (!res.ok) throw new Error(`HTTP ${res.status} en téléchargeant le flux`);
    buffer = Buffer.from(await res.arrayBuffer());
  } else {
    const file = source.startsWith('file://') ? fileURLToPath(source) : path.resolve(source);
    buffer = await fs.readFile(file);
  }
  if (buffer[0] === 0x1f && buffer[1] === 0x8b) buffer = gunzipSync(buffer);
  return buffer.toString('utf8');
}

// ---------- Index de recherche ----------

export class OfferIndex {
  private offers: Offer[] = [];
  private tokens = new Map<string, number[]>();
  private gtins = new Map<string, number[]>();

  constructor(offers: Offer[] = []) {
    this.load(offers);
  }

  get size(): number {
    return this.offers.length;
  }

  load(offers: Offer[]): void {
    this.offers = offers;
    this.tokens = new Map();
    this.gtins = new Map();
    offers.forEach((offer, i) => {
      for (const t of new Set(tokenize(`${offer.title} ${offer.brand ?? ''} ${offer.mpn ?? ''}`))) {
        const list = this.tokens.get(t);
        if (list) list.push(i);
        else this.tokens.set(t, [i]);
      }
      if (offer.gtin) {
        const list = this.gtins.get(offer.gtin);
        if (list) list.push(i);
        else this.gtins.set(offer.gtin, [i]);
      }
    });
  }

  private postings(token: string): Set<number> {
    const exact = this.tokens.get(token);
    const out = new Set<number>(exact ?? []);
    // Préfixe pour les mots ≥ 3 caractères (« rtx » ⊂ « rtx5070 », « ryz » ⊂ « ryzen »).
    if (token.length >= 3) {
      for (const [key, list] of this.tokens) {
        if (key !== token && key.startsWith(token)) for (const i of list) out.add(i);
      }
    }
    return out;
  }

  search(q: string, limit: number, gtin?: string): Offer[] {
    if (gtin) {
      const hits = this.gtins.get(gtin);
      if (hits?.length) return hits.slice(0, limit).map((i) => this.offers[i]);
    }
    const tokens = tokenize(q);
    if (!tokens.length) return [];
    // On exige tous les mots (en commençant par le plus rare pour réduire l'ensemble).
    const sets = tokens.map((t) => this.postings(t)).sort((a, b) => a.size - b.size);
    let result = sets[0];
    for (const s of sets.slice(1)) {
      result = new Set([...result].filter((i) => s.has(i)));
      if (!result.size) break;
    }
    return [...result]
      .map((i) => this.offers[i])
      .sort((a, b) => a.totalPrice - b.totalPrice)
      .slice(0, limit);
  }
}

// ---------- Connecteur ----------

export function createFeedConnector(merchant: MerchantDefinition): Connector {
  const index = new OfferIndex();
  const keepAll = env(`FEED_${merchant.id.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_KEEP_ALL`) === 'true';
  const cacheFile = path.join(config.cacheDir, 'feeds', `${merchant.id}.json`);
  let loadedAt: Date | null = null;
  let lastError: string | null = null;
  let loading: Promise<void> | null = null;
  let timer: NodeJS.Timeout | null = null;

  async function refresh(): Promise<void> {
    if (!merchant.feedUrl) return;
    try {
      const content = await readSource(merchant.feedUrl, AbortSignal.timeout(5 * 60_000));
      const offers = parseFeed(content, merchant.feedFormat)
        .map((r) => recordToOffer(r, merchant, keepAll))
        .filter((o): o is Offer => o !== null);
      index.load(offers);
      loadedAt = new Date();
      lastError = null;
      await fs.mkdir(path.dirname(cacheFile), { recursive: true });
      await fs.writeFile(cacheFile, JSON.stringify({ loadedAt, offers }));
      console.log(`[feed:${merchant.id}] ${offers.length} offres high-tech indexées`);
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.error(`[feed:${merchant.id}] échec du chargement: ${lastError}`);
    }
  }

  async function loadFromCache(): Promise<boolean> {
    try {
      const data = JSON.parse(await fs.readFile(cacheFile, 'utf8')) as { loadedAt: string; offers: Offer[] };
      index.load(data.offers);
      loadedAt = new Date(data.loadedAt);
      return Date.now() - loadedAt.getTime() < config.feedRefreshMinutes * 60_000;
    } catch {
      return false;
    }
  }

  function ensureLoaded(): Promise<void> {
    loading ??= (async () => {
      const fresh = await loadFromCache();
      if (!fresh) {
        // Cache périmé mais présent : on sert le cache et on rafraîchit en arrière-plan.
        if (index.size) void refresh();
        else await refresh();
      }
      if (!timer) {
        timer = setInterval(() => void refresh(), config.feedRefreshMinutes * 60_000);
        timer.unref();
      }
    })();
    return loading;
  }

  return {
    id: `feed:${merchant.id}`,
    merchantId: merchant.id,
    enabled: () => Boolean(merchant.feedUrl),
    warmup: ensureLoaded,
    describe: () => ({ offers: index.size, loadedAt, lastError, format: merchant.feedFormat }),
    async search(query: ConnectorQuery): Promise<Offer[]> {
      await ensureLoaded();
      if (!index.size && lastError) throw new Error(lastError);
      return index.search(query.q, query.limit, query.gtin);
    },
  };
}
