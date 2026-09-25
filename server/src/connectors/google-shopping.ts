import fs from 'node:fs';
import path from 'node:path';
import { config, env } from '../config.js';
import { resolveMerchant } from '../merchants.js';
import { normalizeText, parseCondition, parsePrice } from '../search/normalize.js';
import { makeOffer } from '../search/offer.js';
import type { Offer } from '../shared/types.js';
import { ConnectorError, fetchJson, type Connector, type ConnectorQuery } from './types.js';

// Google Shopping via une API SERP (offres gratuites) : un seul appel renvoie les prix
// de tous les marchands référencés par Google en France (Fnac, LDLC, Boulanger,
// Back Market, Leclerc, Cdiscount, Darty…), neuf comme reconditionné.
//
// Fournisseurs gérés (le premier configuré est utilisé, les suivants servent de secours) :
//   - Serper.dev    SERPER_API_KEY      2 500 requêtes offertes à l'inscription
//   - SearchApi.io  SEARCHAPI_API_KEY   100 requêtes offertes
//   - SerpApi       SERPAPI_API_KEY     offre gratuite mensuelle
// Un quota journalier et un cache disque de 24 h évitent d'épuiser les crédits. Ces offres sont
// gratuites mais non renouvelables : une fois les crédits épuisés, la source se tait et le site
// continue avec les autres (boutiques publiques, pages de recherche des marchands).

export interface ShoppingItem {
  title: string;
  merchant: string;
  url: string;
  price: unknown;
  extractedPrice?: number;
  delivery?: string;
  imageUrl?: string;
  condition?: string;
  rating?: number;
  reviews?: number;
  productId?: string;
}

interface Provider {
  id: 'serper' | 'searchapi' | 'serpapi';
  key: string | undefined;
  dailyLimit: number;
  fetch(q: string, signal: AbortSignal): Promise<ShoppingItem[]>;
}

const GL = () => env('SERPER_GL') ?? env('GOOGLE_SHOPPING_COUNTRY') ?? 'fr';
const HL = () => env('SERPER_HL') ?? env('GOOGLE_SHOPPING_LANGUAGE') ?? 'fr';

interface SerperResponse {
  shopping?: Array<{ title: string; source: string; link: string; price: string; delivery?: string; imageUrl?: string; rating?: number; ratingCount?: number; productId?: string }>;
}

interface SerpApiLikeResponse {
  error?: string;
  shopping_results?: Array<{
    title: string;
    source?: string;
    seller?: string;
    link?: string;
    product_link?: string;
    price?: string;
    extracted_price?: number;
    delivery?: string;
    thumbnail?: string;
    second_hand_condition?: string;
    condition?: string;
    rating?: number;
    reviews?: number;
    product_id?: string;
  }>;
}

function fromSerpApiLike(data: SerpApiLikeResponse): ShoppingItem[] {
  if (data.error) throw new Error(data.error);
  return (data.shopping_results ?? []).map((r) => ({
    title: r.title,
    merchant: r.source ?? r.seller ?? '',
    url: r.link ?? r.product_link ?? '',
    price: r.price,
    extractedPrice: r.extracted_price,
    delivery: r.delivery,
    imageUrl: r.thumbnail,
    condition: r.second_hand_condition ?? r.condition,
    rating: r.rating,
    reviews: r.reviews,
    productId: r.product_id,
  }));
}

function createProviders(): Provider[] {
  const limit = (name: string, fallback: number) => Number.parseInt(env(name) ?? '', 10) || fallback;
  return [
    {
      id: 'serper',
      key: env('SERPER_API_KEY'),
      dailyLimit: limit('SERPER_DAILY_LIMIT', 40),
      async fetch(q, signal) {
        const data = await fetchJson<SerperResponse>('https://google.serper.dev/shopping', {
          method: 'POST',
          signal,
          headers: { 'X-API-KEY': this.key!, 'content-type': 'application/json' },
          body: JSON.stringify({ q, gl: GL(), hl: HL(), num: 40 }),
        });
        return (data.shopping ?? []).map((r) => ({
          title: r.title,
          merchant: r.source,
          url: r.link,
          price: r.price,
          delivery: r.delivery,
          imageUrl: r.imageUrl,
          rating: r.rating,
          reviews: r.ratingCount,
          productId: r.productId,
        }));
      },
    },
    {
      id: 'searchapi',
      key: env('SEARCHAPI_API_KEY'),
      dailyLimit: limit('SEARCHAPI_DAILY_LIMIT', 3),
      async fetch(q, signal) {
        const params = new URLSearchParams({ engine: 'google_shopping', q, gl: GL(), hl: HL(), api_key: this.key! });
        return fromSerpApiLike(await fetchJson<SerpApiLikeResponse>(`https://www.searchapi.io/api/v1/search?${params}`, { signal }));
      },
    },
    {
      id: 'serpapi',
      key: env('SERPAPI_API_KEY'),
      dailyLimit: limit('SERPAPI_DAILY_LIMIT', 3),
      async fetch(q, signal) {
        const params = new URLSearchParams({ engine: 'google_shopping', q, gl: GL(), hl: HL(), google_domain: `google.${GL()}`, api_key: this.key! });
        return fromSerpApiLike(await fetchJson<SerpApiLikeResponse>(`https://serpapi.com/search.json?${params}`, { signal }));
      },
    },
  ];
}

/** « Livraison gratuite », « + 4,99 € de livraison », « Free delivery » → frais de port. */
export function parseDelivery(delivery: string | undefined): number | null {
  if (!delivery) return null;
  const d = normalizeText(delivery);
  if (/gratuit|offert|free/.test(d)) return 0;
  return /\d/.test(delivery) ? parsePrice(delivery) : null;
}

/** Places de marché de revente entre particuliers : leurs annonces sont de l'occasion, même sans mention. */
const RESALE_MARKETS = /\b(stockx|vinted|leboncoin|selency|label emma[uü]s)\b/i;
const NON_LATIN_TITLE = /[Ѐ-ӿ֐-ۿ぀-ヿ一-鿿가-힯]/;

export function shoppingItemToOffer(item: ShoppingItem, fetchedAt?: number): Offer | null {
  const price = item.extractedPrice ?? parsePrice(item.price);
  if (!item.title || !item.url || price === null || price <= 0) return null;
  // Annonce en arabe, hébreu, cyrillique ou CJK : marchand étranger, souvent une pièce détachée mal décrite.
  if (NON_LATIN_TITLE.test(item.title)) return null;
  const merchant = resolveMerchant(item.merchant || 'Google Shopping');
  const currency = typeof item.price === 'string' ? (/\$|USD/.test(item.price) ? 'USD' : /£|GBP/.test(item.price) ? 'GBP' : 'EUR') : 'EUR';
  const parsedCondition = RESALE_MARKETS.test(item.merchant ?? '') ? 'used' : parseCondition(item.condition, item.title);
  return makeOffer({
    merchantId: merchant.id,
    merchantName: merchant.name,
    sourceId: item.productId ? `gs-${item.productId}` : undefined,
    title: item.title,
    url: item.url,
    price,
    currency,
    shipping: parseDelivery(item.delivery),
    imageUrl: item.imageUrl,
    condition: merchant.refurbishedOnly && parsedCondition === 'new' ? 'refurbished' : parsedCondition,
    conditionGrade: item.condition && parsedCondition !== 'new' ? item.condition : undefined,
    inStock: null,
    rating: item.rating,
    reviewCount: item.reviews,
    via: 'google-shopping',
    updatedAt: fetchedAt ? new Date(fetchedAt).toISOString() : undefined,
  });
}

/** Cache disque des réponses (clé = requête normalisée) pour économiser les crédits. */
class DiskCache {
  private data = new Map<string, { at: number; items: ShoppingItem[] }>();
  private writeTimer: NodeJS.Timeout | null = null;

  constructor(private file: string, private ttlMs: number) {
    try {
      const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, { at: number; items: ShoppingItem[] }>;
      for (const [k, v] of Object.entries(raw)) if (Date.now() - v.at < ttlMs) this.data.set(k, v);
    } catch {
      // pas encore de cache
    }
  }

  get(key: string): { at: number; items: ShoppingItem[] } | undefined {
    const hit = this.data.get(key);
    return hit && Date.now() - hit.at < this.ttlMs ? hit : undefined;
  }

  set(key: string, entry: { at: number; items: ShoppingItem[] }): void {
    this.data.set(key, entry);
    this.writeTimer ??= setTimeout(() => {
      this.writeTimer = null;
      for (const [k, v] of this.data) if (Date.now() - v.at >= this.ttlMs) this.data.delete(k);
      fs.mkdirSync(path.dirname(this.file), { recursive: true });
      fs.writeFile(this.file, JSON.stringify(Object.fromEntries(this.data)), () => undefined);
    }, 2_000);
    this.writeTimer.unref?.();
  }
}

export function createGoogleShoppingConnector(): Connector {
  const providers = createProviders().filter((p) => p.key);
  const cacheHours = Number.parseInt(env('SERPER_CACHE_HOURS') ?? env('GOOGLE_SHOPPING_CACHE_HOURS') ?? '', 10) || 24;
  const cache = new DiskCache(path.join(config.cacheDir, 'google-shopping.json'), cacheHours * 3_600_000);
  const usage = new Map<string, { day: string; count: number }>();
  // Requêtes identiques en vol (ex. plusieurs articles d'un même lot) : un seul appel payant.
  const inFlight = new Map<string, Promise<ShoppingItem[] | null>>();

  /** `null` : tous les fournisseurs ont épuisé leur quota ou leurs crédits (pas une panne). */
  const fetchItems = async (q: string, signal: AbortSignal): Promise<ShoppingItem[] | null> => {
    const errors: string[] = [];
    for (const provider of providers) {
      if (used(provider) >= provider.dailyLimit) continue;
      usage.set(provider.id, { day: today(), count: used(provider) + 1 });
      try {
        return await provider.fetch(q, signal);
      } catch (err) {
        // Crédits gratuits épuisés : fournisseur mis de côté jusqu'au lendemain.
        if (err instanceof ConnectorError && [400, 401, 402, 403, 429].includes(err.status ?? 0) && /credit|quota|balance|limit/i.test(err.message)) {
          usage.set(provider.id, { day: today(), count: provider.dailyLimit });
          continue;
        }
        errors.push(`${provider.id} : ${err instanceof Error ? err.message : err}`);
        if (signal.aborted) break;
      }
    }
    if (errors.length) throw new Error(errors.join(' ; '));
    return null;
  };

  const today = () => new Date().toISOString().slice(0, 10);
  const used = (p: Provider) => {
    const u = usage.get(p.id);
    return u && u.day === today() ? u.count : 0;
  };

  return {
    id: 'google-shopping',
    merchantId: 'google-shopping',
    aggregator: true,
    enabled: () => providers.length > 0,
    describe: () => ({
      providers: providers.map((p) => ({ id: p.id, usedToday: used(p), dailyLimit: p.dailyLimit })),
      cacheHours,
    }),
    async search(query: ConnectorQuery, signal: AbortSignal): Promise<Offer[]> {
      const q = (query.searchText ?? query.q).trim();
      const key = normalizeText(q);
      if (key.length < 2) return [];
      let entry = cache.get(key);
      if (!entry) {
        let pending = inFlight.get(key);
        if (!pending) {
          pending = fetchItems(q, signal).finally(() => inFlight.delete(key));
          inFlight.set(key, pending);
        }
        const items = await pending;
        if (!items) return [];
        entry = { at: Date.now(), items };
        cache.set(key, entry);
      }
      const at = entry.at;
      return entry.items.map((item) => shoppingItemToOffer(item, at)).filter((o): o is Offer => o !== null);
    },
  };
}
