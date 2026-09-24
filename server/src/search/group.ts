import type { Offer, ProductGroup } from '../shared/types.js';
import { fingerprintTokens, jaccard, numericTokens } from './normalize.js';
import { VARIANT_TOKENS } from './relevance.js';

export interface ScoredOffer {
  offer: Offer;
  relevance: number;
}

const CONDITION_SUFFIX = /\s*[-–|,(]\s*(reconditionn[ée]e?|refurbished|renewed|occasion|used|grade [abc]|remis à neuf)(?![a-z]).*$/i;

export function cleanTitle(title: string): string {
  return title.replace(CONDITION_SUFFIX, '').replace(/\s+(reconditionn[ée]e?|occasion)$/i, '').trim();
}

interface Bucket {
  key: string;
  gtin?: string;
  tokens: string[];
  numeric: string;
  items: ScoredOffer[];
}

/**
 * Regroupe les offres d'un même produit :
 * 1) même GTIN/EAN ; 2) même empreinte de titre ;
 * 3) titres très proches (Jaccard ≥ 0.8) avec exactement les mêmes nombres (capacité, modèle).
 */
export function groupOffers(scored: ScoredOffer[]): ProductGroup[] {
  const buckets: Bucket[] = [];
  const byGtin = new Map<string, Bucket>();
  const byPrint = new Map<string, Bucket>();

  for (const item of scored) {
    const tokens = fingerprintTokens(cleanTitle(item.offer.title));
    const print = `${item.offer.category}|${tokens.join(' ')}`;
    const numeric = numericTokens(tokens).join(' ');
    let bucket = (item.offer.gtin && byGtin.get(item.offer.gtin)) || byPrint.get(print);
    if (!bucket) {
      bucket = buckets.find(
        (b) =>
          b.numeric === numeric &&
          b.items[0].offer.category === item.offer.category &&
          sameVariants(b.tokens, tokens) &&
          jaccard(b.tokens, tokens) >= 0.8,
      );
    }
    if (!bucket) {
      bucket = { key: item.offer.gtin ?? print, gtin: item.offer.gtin, tokens, numeric, items: [] };
      buckets.push(bucket);
    }
    bucket.items.push(item);
    byPrint.set(print, bucket);
    if (item.offer.gtin) {
      byGtin.set(item.offer.gtin, bucket);
      bucket.gtin ??= item.offer.gtin;
    }
  }

  return buckets.map(toGroup);
}

/** Offre la moins chère, en privilégiant celles qui ne sont pas en rupture. */
/** « RTX 5070 » et « RTX 5070 Ti » (ou iPhone 16 / 16 Pro) ne sont jamais le même produit. */
function sameVariants(a: string[], b: string[]): boolean {
  const va = a.filter((t) => VARIANT_TOKENS.has(t)).sort().join(' ');
  const vb = b.filter((t) => VARIANT_TOKENS.has(t)).sort().join(' ');
  return va === vb;
}

function cheapest(offers: Offer[]): Offer | undefined {
  const available = offers.filter((o) => o.inStock !== false);
  let best: Offer | undefined;
  for (const o of available.length ? available : offers) {
    // À prix égal, on préfère une offre en stock.
    if (!best || o.totalPrice < best.totalPrice || (o.totalPrice === best.totalPrice && o.inStock && !best.inStock)) best = o;
  }
  return best;
}

function toGroup(bucket: Bucket): ProductGroup {
  const offers = bucket.items.map((i) => i.offer).sort((a, b) => a.totalPrice - b.totalPrice);
  const bestOffer = cheapest(offers)!;
  const top = bucket.items.reduce((a, b) => (b.relevance > a.relevance ? b : a));
  const titleSource = offers.find((o) => o.condition === 'new') ?? top.offer;
  const minPrice = offers[0].totalPrice;
  const maxPrice = offers[offers.length - 1].totalPrice;
  return {
    key: bucket.key,
    title: cleanTitle(titleSource.title),
    brand: offers.find((o) => o.brand)?.brand,
    category: top.offer.category,
    imageUrl: offers.find((o) => o.imageUrl)?.imageUrl,
    gtin: bucket.gtin,
    offers,
    bestOffer,
    bestNew: cheapest(offers.filter((o) => o.condition === 'new')),
    bestRefurbished: cheapest(offers.filter((o) => o.condition === 'refurbished')),
    bestUsed: cheapest(offers.filter((o) => o.condition === 'used')),
    minPrice,
    maxPrice,
    savingsPercent: maxPrice > 0 ? Math.round(((maxPrice - minPrice) / maxPrice) * 100) : 0,
    merchantCount: new Set(offers.map((o) => o.merchantId)).size,
    relevance: top.relevance,
  };
}
