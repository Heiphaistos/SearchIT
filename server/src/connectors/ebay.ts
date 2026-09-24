import { env } from '../config.js';
import type { MerchantDefinition } from '../merchants.js';
import { makeOffer } from '../search/offer.js';
import { parsePrice } from '../search/normalize.js';
import type { Condition, Offer } from '../shared/types.js';
import { ConnectorError, fetchJson, type Connector, type ConnectorQuery } from './types.js';

// eBay Browse API — item_summary/search.
// https://developer.ebay.com/api-docs/buy/browse/resources/item_summary/methods/search

const CONDITION_IDS: Record<Condition, string[]> = {
  new: ['1000', '1500'],
  refurbished: ['2000', '2010', '2020', '2030', '2500'],
  used: ['3000', '4000', '5000', '6000'],
};

interface EbayItem {
  itemId: string;
  title: string;
  price?: { value: string; currency: string };
  image?: { imageUrl: string };
  itemWebUrl: string;
  itemAffiliateWebUrl?: string;
  condition?: string;
  conditionId?: string;
  shippingOptions?: Array<{ shippingCost?: { value: string } }>;
  seller?: { username?: string; feedbackPercentage?: string };
  epid?: string;
}

interface EbaySearchResponse {
  itemSummaries?: EbayItem[];
}

export function conditionFromEbayId(id: string | undefined): Condition {
  if (!id) return 'used';
  if (CONDITION_IDS.new.includes(id)) return 'new';
  if (CONDITION_IDS.refurbished.includes(id)) return 'refurbished';
  return 'used';
}

export function createEbayConnector(merchant: MerchantDefinition): Connector {
  const clientId = env('EBAY_CLIENT_ID');
  const clientSecret = env('EBAY_CLIENT_SECRET');
  const marketplaceId = env('EBAY_MARKETPLACE_ID') ?? 'EBAY_FR';
  const campaignId = env('EBAY_CAMPAIGN_ID');
  const apiBase = env('EBAY_SANDBOX') === 'true' ? 'https://api.sandbox.ebay.com' : 'https://api.ebay.com';
  let token: { value: string; expiresAt: number } | null = null;

  async function getToken(signal: AbortSignal): Promise<string> {
    if (token && token.expiresAt > Date.now() + 60_000) return token.value;
    const res = await fetch(`${apiBase}/identity/v1/oauth2/token`, {
      method: 'POST',
      signal,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({ grant_type: 'client_credentials', scope: 'https://api.ebay.com/oauth/api_scope' }),
    });
    if (!res.ok) throw new ConnectorError(`OAuth eBay: HTTP ${res.status}`, res.status);
    const data = (await res.json()) as { access_token: string; expires_in: number };
    token = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
    return token.value;
  }

  return {
    id: 'ebay',
    merchantId: merchant.id,
    enabled: () => Boolean(clientId && clientSecret),
    describe: () => ({ marketplaceId, affiliate: Boolean(campaignId) }),
    async search(query: ConnectorQuery, signal: AbortSignal): Promise<Offer[]> {
      const accessToken = await getToken(signal);
      const filters = ['buyingOptions:{FIXED_PRICE}', 'deliveryCountry:FR'];
      if (query.conditions?.length) {
        filters.push(`conditionIds:{${query.conditions.flatMap((c) => CONDITION_IDS[c]).join('|')}}`);
      }
      if (query.minPrice || query.maxPrice) {
        filters.push(`price:[${query.minPrice ?? ''}..${query.maxPrice ?? ''}]`, 'priceCurrency:EUR');
      }
      const params = new URLSearchParams({ q: query.q, limit: String(Math.min(50, query.limit)), filter: filters.join(',') });
      if (query.gtin) params.set('gtin', query.gtin.replace(/^0+(?=\d{13}$)/, ''));
      const headers: Record<string, string> = {
        authorization: `Bearer ${accessToken}`,
        'X-EBAY-C-MARKETPLACE-ID': marketplaceId,
        'Accept-Language': 'fr-FR',
      };
      if (campaignId) headers['X-EBAY-C-ENDUSERCTX'] = `affiliateCampaignId=${campaignId}`;
      const data = await fetchJson<EbaySearchResponse>(`${apiBase}/buy/browse/v1/item_summary/search?${params}`, { headers, signal });
      return (data.itemSummaries ?? []).flatMap((item) => mapEbayItem(item, merchant));
    },
  };
}

export function mapEbayItem(item: EbayItem, merchant: MerchantDefinition): Offer[] {
  const price = parsePrice(item.price?.value);
  if (price === null) return [];
  const shippingRaw = item.shippingOptions?.[0]?.shippingCost?.value;
  const condition = conditionFromEbayId(item.conditionId);
  return [
    makeOffer({
      merchantId: merchant.id,
      merchantName: merchant.name,
      sourceId: item.itemId,
      title: item.title,
      url: item.itemAffiliateWebUrl ?? item.itemWebUrl,
      price,
      currency: item.price?.currency,
      shipping: shippingRaw !== undefined ? parsePrice(shippingRaw) : null,
      imageUrl: item.image?.imageUrl,
      condition,
      conditionGrade: condition !== 'new' ? item.condition : undefined,
      inStock: true,
      seller: item.seller?.username,
    }),
  ];
}
