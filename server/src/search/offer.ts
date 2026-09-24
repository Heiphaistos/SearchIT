import { createHash } from 'node:crypto';
import type { CategoryId, Condition, Offer } from '../shared/types.js';
import { detectCategory, detectCondition, normalizeGtin } from './normalize.js';

export interface OfferInput {
  merchantId: string;
  merchantName: string;
  sourceId?: string;
  title: string;
  url: string;
  price: number;
  currency?: string;
  shipping?: number | null;
  imageUrl?: string;
  condition?: Condition;
  conditionGrade?: string;
  inStock?: boolean | null;
  brand?: string;
  gtin?: unknown;
  mpn?: string;
  category?: CategoryId | null;
  categoryHint?: string;
  rating?: number;
  reviewCount?: number;
  seller?: string;
  isDemo?: boolean;
  via?: string;
  updatedAt?: string;
}

export function makeOffer(input: OfferInput): Offer {
  const title = input.title.replace(/\s+/g, ' ').trim();
  const shipping = input.shipping ?? null;
  const id = input.sourceId
    ? `${input.merchantId}:${input.sourceId}`
    : `${input.merchantId}:${createHash('sha1').update(`${input.url}|${title}|${input.price}`).digest('hex').slice(0, 16)}`;
  return {
    id,
    merchantId: input.merchantId,
    merchantName: input.merchantName,
    title,
    url: input.url,
    imageUrl: input.imageUrl || undefined,
    price: round2(input.price),
    currency: input.currency ?? 'EUR',
    shipping: shipping === null ? null : round2(shipping),
    totalPrice: round2(input.price + (shipping ?? 0)),
    condition: input.condition ?? detectCondition(title, input.conditionGrade),
    conditionGrade: input.conditionGrade || undefined,
    inStock: input.inStock ?? null,
    brand: input.brand || undefined,
    gtin: normalizeGtin(input.gtin),
    mpn: input.mpn || undefined,
    category: input.category ?? detectCategory(title, input.categoryHint) ?? 'other',
    rating: input.rating,
    reviewCount: input.reviewCount,
    seller: input.seller || undefined,
    isDemo: input.isDemo || undefined,
    via: input.via,
    updatedAt: input.updatedAt ?? new Date().toISOString(),
  };
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
