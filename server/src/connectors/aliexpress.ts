import { createHmac } from 'node:crypto';
import { env } from '../config.js';
import type { MerchantDefinition } from '../merchants.js';
import { makeOffer } from '../search/offer.js';
import { parsePrice } from '../search/normalize.js';
import type { Offer } from '../shared/types.js';
import { fetchJson, type Connector, type ConnectorQuery } from './types.js';

// AliExpress Open Platform — aliexpress.affiliate.product.query
// https://openservice.aliexpress.com/doc/api.htm#/api?cid=21407&path=aliexpress.affiliate.product.query

const ENDPOINT = 'https://api-sg.aliexpress.com/sync';

/** Signature « business API » : HMAC-SHA256 de clé1valeur1clé2valeur2… (clés triées), en hex majuscule. */
export function signAliExpress(params: Record<string, string>, secret: string): string {
  const base = Object.keys(params)
    .sort()
    .map((k) => `${k}${params[k]}`)
    .join('');
  return createHmac('sha256', secret).update(base, 'utf8').digest('hex').toUpperCase();
}

interface AliProduct {
  product_id: number | string;
  product_title: string;
  product_main_image_url?: string;
  target_sale_price?: string;
  target_sale_price_currency?: string;
  target_original_price?: string;
  promotion_link?: string;
  product_detail_url?: string;
  evaluate_rate?: string;
  lastest_volume?: number;
  shop_name?: string;
}

interface AliResponse {
  aliexpress_affiliate_product_query_response?: {
    resp_result?: { resp_code?: number; resp_msg?: string; result?: { products?: { product?: AliProduct[] } } };
  };
  error_response?: { code: string; msg: string };
}

export function createAliExpressConnector(merchant: MerchantDefinition): Connector {
  const appKey = env('ALIEXPRESS_APP_KEY');
  const appSecret = env('ALIEXPRESS_APP_SECRET');
  const trackingId = env('ALIEXPRESS_TRACKING_ID');

  return {
    id: 'aliexpress',
    merchantId: merchant.id,
    enabled: () => Boolean(appKey && appSecret && trackingId),
    async search(query: ConnectorQuery, signal: AbortSignal): Promise<Offer[]> {
      // AliExpress ne vend (quasiment) que du neuf.
      if (query.conditions?.length && !query.conditions.includes('new')) return [];
      const params: Record<string, string> = {
        app_key: appKey!,
        method: 'aliexpress.affiliate.product.query',
        sign_method: 'sha256',
        timestamp: String(Date.now()),
        keywords: query.q,
        page_size: String(Math.min(50, query.limit)),
        target_currency: 'EUR',
        target_language: 'FR',
        ship_to_country: 'FR',
        tracking_id: trackingId!,
        sort: 'LAST_VOLUME_DESC',
      };
      if (query.minPrice) params.min_sale_price = String(Math.round(query.minPrice * 100));
      if (query.maxPrice) params.max_sale_price = String(Math.round(query.maxPrice * 100));
      params.sign = signAliExpress(params, appSecret!);
      const data = await fetchJson<AliResponse>(ENDPOINT, {
        method: 'POST',
        signal,
        headers: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
        body: new URLSearchParams(params).toString(),
      });
      if (data.error_response) throw new Error(`${data.error_response.code}: ${data.error_response.msg}`);
      const products = data.aliexpress_affiliate_product_query_response?.resp_result?.result?.products?.product ?? [];
      return products.flatMap((p) => mapAliProduct(p, merchant));
    },
  };
}

export function mapAliProduct(p: AliProduct, merchant: MerchantDefinition): Offer[] {
  const price = parsePrice(p.target_sale_price);
  const url = p.promotion_link ?? p.product_detail_url;
  if (price === null || !url) return [];
  const rate = p.evaluate_rate ? Number.parseFloat(p.evaluate_rate) : NaN;
  return [
    makeOffer({
      merchantId: merchant.id,
      merchantName: merchant.name,
      sourceId: String(p.product_id),
      title: p.product_title,
      url,
      price,
      currency: p.target_sale_price_currency ?? 'EUR',
      shipping: null,
      imageUrl: p.product_main_image_url,
      condition: 'new',
      inStock: true,
      rating: Number.isFinite(rate) ? Math.round((rate / 20) * 10) / 10 : undefined,
      reviewCount: p.lastest_volume,
      seller: p.shop_name,
    }),
  ];
}
