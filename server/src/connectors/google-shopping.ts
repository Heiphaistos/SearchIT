import fs from 'node:fs';
import path from 'node:path';
import { config, env } from '../config.js';
import { resolveMerchant } from '../merchants.js';
import { normalizeText, parseCondition, parsePrice } from '../search/normalize.js';
import { makeOffer } from '../search/offer.js';
import type { Offer } from '../shared/types.js';
import { fetchJson, type Connector, type ConnectorQuery } from './types.js';

// Google Shopping via une API SERP (offres gratuites) : un seul appel renvoie les prix
// de tous les marchands référencés par Google en France (Fnac, LDLC, Boulanger,
// Back Market, Leclerc, Cdiscount, Darty…), neuf comme reconditionné.
//
// Fournisseurs gérés (le premier configuré est utilisé, les suivants servent de secours) :
//   - Serper.dev    SERPER_API_KEY      2 500 requêtes offertes à l'inscription
//   - SearchApi.io  SEARCHAPI_API_KEY   100 requêtes offertes
//   - SerpApi       SERPAPI_API_KEY     offre gratuite mensuelle
// Un quota journalier et un cache disque de 24 h évitent d'épuiser les crédits.

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

const GL = () => env('GOOGLE_SHOPPING_COUNTRY') ?? 'fr';
const HL = () => env('GOOGLE_SHOPPING_LANGUAGE') ?? 'fr';

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
      dailyLimit: limit('SERPER_DAILY_LIMIT', 80),
      async fetch(q, signal) {
        const data = await fetchJson<SerperResponse>('https://google.serper.dev/shopping', {
          method: 'POST',
          signal,
          headers: { 'X-API-KEY': this.key!, 'content-type': 'application/json' },
          body: JSON.stringify({ q, gl: GL(), hl: HL() }),
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

export function shoppingItemToOffer(item: ShoppingItem): Offer | null {
  const price = item.extractedPrice ?? parsePrice(item.price);
  if (!item.title || !item.url || price === null || price <= 0) return null;
  const merchant = resolveMerchant(item.merchant || 'Google Shopping');
  const currency = typeof item.price === 'string' ? (/\$|USD/.test(item.price) ? 'USD' : /£|GBP/.test(item.price) ? 'GBP' : 'EUR') : 'EUR';
  const parsedCondition = parseCondition(item.condition, item.title);
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

  get(key: string): ShoppingItem[] | undefined {
    const hit = this.data.get(key);
    return hit && Date.now() - hit.at < this.ttlMs ? hit.items : undefined;
  }

  set(key: string, items: ShoppingItem[]): void {
    this.data.set(key, { at: Date.now(), items });
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
  const cacheHours = Number.parseInt(env('GOOGLE_SHOPPING_CACHE_HOURS') ?? '', 10) || 24;
  const cache = new DiskCache(path.join(config.cacheDir, 'google-shopping.json'), cacheHours * 3_600_000);
  const usage = new Map<string, { day: string; count: number }>();

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
      const q = query.q.trim();
      const key = normalizeText(q);
      let items = cache.get(key);
      if (!items) {
        const errors: string[] = [];
        for (const provider of providers) {
          if (used(provider) >= provider.dailyLimit) {
            errors.push(`${provider.id} : quota journalier atteint (${provider.dailyLimit})`);
            continue;
          }
          usage.set(provider.id, { day: today(), count: used(provider) + 1 });
          try {
            items = await provider.fetch(q, signal);
            break;
          } catch (err) {
            errors.push(`${provider.id} : ${err instanceof Error ? err.message : err}`);
            if (signal.aborted) break;
          }
        }
        if (!items) throw new Error(errors.join(' ; ') || 'Aucun fournisseur disponible');
        cache.set(key, items);
      }
      return items.map(shoppingItemToOffer).filter((o): o is Offer => o !== null);
    },
  };
}
