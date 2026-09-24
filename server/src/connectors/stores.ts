import type { MerchantDefinition } from '../merchants.js';
import { detectCategory, parseCondition, parsePrice } from '../search/normalize.js';
import { makeOffer } from '../search/offer.js';
import type { Offer } from '../shared/types.js';
import { createCatalogConnector } from './catalog.js';
import { isTechRecord } from './feed.js';
import type { Connector } from './types.js';

// Boutiques en ligne dont le catalogue est public, sans clé d'API :
//  - Shopify     : /products.json (catalogue paginé) + /cart.js (devise de la boutique)
//  - WooCommerce : Store API /wp-json/wc/store/v1/products
// Le catalogue complet est synchronisé périodiquement (poliment : une page à la fois).

const USER_AGENT = 'SearchIT/1.0 (+https://searchit.heiphaistos.org; comparateur de prix)';
const MAX_PAGES = 40;
const PAGE_DELAY_MS = 400;
const MAX_VARIANTS = 12;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function baseUrl(store: string): string {
  const url = /^https?:\/\//.test(store) ? store : `https://${store}`;
  return url.replace(/\/+$/, '');
}

async function getJson<T>(url: string, signal: AbortSignal): Promise<{ data: T; headers: Headers }> {
  const res = await fetch(url, { signal, headers: { 'user-agent': USER_AGENT, accept: 'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} sur ${new URL(url).pathname}`);
  return { data: (await res.json()) as T, headers: res.headers };
}

// ---------- Shopify ----------

export interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  vendor?: string;
  product_type?: string;
  tags?: string[] | string;
  images?: Array<{ src: string }>;
  variants: Array<{
    id: number;
    title: string;
    price: string;
    available?: boolean;
    sku?: string;
    barcode?: string | null;
    featured_image?: { src: string } | null;
  }>;
}

export function shopifyProductToOffers(p: ShopifyProduct, merchant: MerchantDefinition, currency: string, keepAll = false): Offer[] {
  const base = baseUrl(merchant.storeUrl ?? merchant.website);
  const tags = Array.isArray(p.tags) ? p.tags.join(' ') : (p.tags ?? '');
  const hint = `${p.product_type ?? ''} ${tags}`;
  const category = detectCategory(p.title) ?? detectCategory(hint) ?? 'other';
  if (!keepAll && !isTechRecord(category, hint)) return [];
  const variants = p.variants.slice(0, MAX_VARIANTS);
  const multi = variants.length > 1;
  return variants.flatMap((v) => {
    const price = parsePrice(v.price);
    if (price === null || price <= 0) return [];
    const title = multi && v.title && v.title !== 'Default Title' ? `${p.title} - ${v.title}` : p.title;
    const condition = parseCondition(undefined, `${title} ${tags}`);
    return [
      makeOffer({
        merchantId: merchant.id,
        merchantName: merchant.name,
        sourceId: `${p.id}-${v.id}`,
        title,
        url: `${base}/products/${p.handle}${multi ? `?variant=${v.id}` : ''}`,
        price,
        currency,
        shipping: null,
        imageUrl: v.featured_image?.src ?? p.images?.[0]?.src,
        condition: merchant.refurbishedOnly && condition === 'new' ? 'refurbished' : condition,
        inStock: v.available ?? null,
        brand: p.vendor,
        gtin: v.barcode ?? undefined,
        mpn: v.sku || undefined,
        category,
      }),
    ];
  });
}

export function createShopifyConnector(merchant: MerchantDefinition): Connector {
  const base = baseUrl(merchant.storeUrl ?? merchant.website);
  const details: Record<string, unknown> = { store: base, platform: 'shopify' };
  return createCatalogConnector({
    id: `shopify:${merchant.id}`,
    merchantId: merchant.id,
    enabled: () => Boolean(merchant.storeUrl ?? merchant.website),
    details,
    async load(signal) {
      let currency = merchant.currency ?? 'EUR';
      try {
        currency = (await getJson<{ currency?: string }>(`${base}/cart.js`, signal)).data.currency ?? currency;
      } catch {
        // cart.js indisponible : devise déclarée dans la configuration
      }
      details.currency = currency;
      const offers: Offer[] = [];
      for (let page = 1; page <= MAX_PAGES; page++) {
        const { data } = await getJson<{ products: ShopifyProduct[] }>(`${base}/products.json?limit=250&page=${page}`, signal);
        if (!data.products?.length) break;
        for (const p of data.products) offers.push(...shopifyProductToOffers(p, merchant, currency, merchant.keepAll));
        if (data.products.length < 250) break;
        await sleep(PAGE_DELAY_MS);
      }
      return offers;
    },
  });
}

// ---------- WooCommerce ----------

export interface WooProduct {
  id: number;
  name: string;
  permalink: string;
  sku?: string;
  short_description?: string;
  prices: { price: string; currency_code: string; currency_minor_unit: number };
  images?: Array<{ src: string }>;
  is_in_stock?: boolean;
  is_purchasable?: boolean;
  categories?: Array<{ name: string }>;
  tags?: Array<{ name: string }>;
  brands?: Array<{ name: string }>;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export function wooProductToOffer(p: WooProduct, merchant: MerchantDefinition, keepAll = false): Offer | null {
  const minor = p.prices?.currency_minor_unit ?? 2;
  const raw = Number.parseInt(p.prices?.price ?? '', 10);
  if (!Number.isFinite(raw) || raw <= 0) return null;
  const title = decodeEntities(p.name);
  const hint = [...(p.categories ?? []), ...(p.tags ?? [])].map((c) => decodeEntities(c.name)).join(' ');
  const category = detectCategory(title) ?? detectCategory(hint) ?? 'other';
  if (!keepAll && !isTechRecord(category, hint)) return null;
  const condition = parseCondition(undefined, `${title} ${hint}`);
  return makeOffer({
    merchantId: merchant.id,
    merchantName: merchant.name,
    sourceId: String(p.id),
    title,
    url: p.permalink,
    price: raw / 10 ** minor,
    currency: p.prices.currency_code,
    shipping: null,
    imageUrl: p.images?.[0]?.src,
    condition: merchant.refurbishedOnly && condition === 'new' ? 'refurbished' : condition,
    inStock: p.is_in_stock ?? null,
    brand: p.brands?.[0]?.name,
    mpn: p.sku || undefined,
    category,
  });
}

export function createWooCommerceConnector(merchant: MerchantDefinition): Connector {
  const base = baseUrl(merchant.storeUrl ?? merchant.website);
  return createCatalogConnector({
    id: `woocommerce:${merchant.id}`,
    merchantId: merchant.id,
    enabled: () => Boolean(merchant.storeUrl ?? merchant.website),
    details: { store: base, platform: 'woocommerce' },
    async load(signal) {
      const offers: Offer[] = [];
      for (let page = 1; page <= MAX_PAGES; page++) {
        const { data, headers } = await getJson<WooProduct[]>(`${base}/wp-json/wc/store/v1/products?per_page=100&page=${page}`, signal);
        if (!Array.isArray(data) || !data.length) break;
        for (const p of data) {
          const offer = wooProductToOffer(p, merchant, merchant.keepAll);
          if (offer) offers.push(offer);
        }
        const totalPages = Number(headers.get('x-wp-totalpages') ?? 0);
        if ((totalPages && page >= totalPages) || data.length < 100) break;
        await sleep(PAGE_DELAY_MS);
      }
      return offers;
    },
  });
}
