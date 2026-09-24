import { env } from '../config.js';
import type { MerchantDefinition } from '../merchants.js';
import { makeOffer } from '../search/offer.js';
import { parseCondition } from '../search/normalize.js';
import type { CategoryId, Offer } from '../shared/types.js';
import { signV4 } from './sigv4.js';
import { fetchJson, type Connector, type ConnectorQuery } from './types.js';

// Amazon Product Advertising API 5.0 — opération SearchItems.
// https://webservices.amazon.com/paapi5/documentation/search-items.html

const MARKETPLACES: Record<string, { host: string; region: string }> = {
  'www.amazon.fr': { host: 'webservices.amazon.fr', region: 'eu-west-1' },
  'www.amazon.de': { host: 'webservices.amazon.de', region: 'eu-west-1' },
  'www.amazon.es': { host: 'webservices.amazon.es', region: 'eu-west-1' },
  'www.amazon.it': { host: 'webservices.amazon.it', region: 'eu-west-1' },
  'www.amazon.co.uk': { host: 'webservices.amazon.co.uk', region: 'eu-west-1' },
  'www.amazon.com': { host: 'webservices.amazon.com', region: 'us-east-1' },
};

const SEARCH_INDEX: Partial<Record<CategoryId, string>> = {
  cpu: 'Computers', gpu: 'Computers', motherboard: 'Computers', ram: 'Computers', ssd: 'Computers', hdd: 'Computers',
  psu: 'Computers', case: 'Computers', cooling: 'Computers', fan: 'Computers', 'thermal-paste': 'Computers',
  laptop: 'Computers', desktop: 'Computers', server: 'Computers', nas: 'Computers', monitor: 'Computers',
  keyboard: 'Computers', mouse: 'Computers', network: 'Computers', 'external-storage': 'Computers',
  smartphone: 'Electronics', tablet: 'Computers', smartwatch: 'Electronics', headset: 'Electronics', cable: 'Electronics',
  charger: 'Electronics', 'memory-card': 'Electronics', console: 'VideoGames', printer: 'OfficeProducts', software: 'Software',
};

const RESOURCES = [
  'Images.Primary.Medium',
  'ItemInfo.Title',
  'ItemInfo.ByLineInfo',
  'ItemInfo.ExternalIds',
  'ItemInfo.ManufactureInfo',
  'Offers.Listings.Price',
  'Offers.Listings.Condition',
  'Offers.Listings.Condition.SubCondition',
  'Offers.Listings.Availability.Type',
  'Offers.Listings.DeliveryInfo.IsFreeShippingEligible',
  'Offers.Listings.MerchantInfo',
  'CustomerReviews.StarRating',
  'CustomerReviews.Count',
];

interface PaapiItem {
  ASIN: string;
  DetailPageURL: string;
  Images?: { Primary?: { Medium?: { URL: string } } };
  ItemInfo?: {
    Title?: { DisplayValue: string };
    ByLineInfo?: { Brand?: { DisplayValue: string } };
    ExternalIds?: { EANs?: { DisplayValues: string[] }; UPCs?: { DisplayValues: string[] } };
    ManufactureInfo?: { Model?: { DisplayValue: string } };
  };
  Offers?: {
    Listings?: Array<{
      Price?: { Amount: number; Currency: string };
      Condition?: { Value: string; SubCondition?: { Value: string } };
      Availability?: { Type: string };
      DeliveryInfo?: { IsFreeShippingEligible?: boolean };
      MerchantInfo?: { Name?: string };
    }>;
  };
  CustomerReviews?: { StarRating?: { Value: number }; Count?: number };
}

interface PaapiResponse {
  SearchResult?: { Items?: PaapiItem[] };
  Errors?: Array<{ Code: string; Message: string }>;
}

export function createAmazonConnector(merchant: MerchantDefinition): Connector {
  const accessKey = env('AMAZON_ACCESS_KEY');
  const secretKey = env('AMAZON_SECRET_KEY');
  const partnerTag = env('AMAZON_PARTNER_TAG');
  const marketplace = env('AMAZON_MARKETPLACE') ?? 'www.amazon.fr';
  const mp = MARKETPLACES[marketplace] ?? MARKETPLACES['www.amazon.fr'];

  return {
    id: 'amazon',
    merchantId: merchant.id,
    enabled: () => Boolean(accessKey && secretKey && partnerTag),
    describe: () => ({ marketplace, host: mp.host }),
    async search(query: ConnectorQuery, signal: AbortSignal): Promise<Offer[]> {
      const payload: Record<string, unknown> = {
        Keywords: query.q,
        PartnerTag: partnerTag,
        PartnerType: 'Associates',
        Marketplace: marketplace,
        Resources: RESOURCES,
        ItemCount: Math.min(10, query.limit),
        SearchIndex: (query.category && SEARCH_INDEX[query.category]) || 'All',
      };
      // PA-API attend des prix en centimes (plus petite unité monétaire).
      if (query.minPrice) payload.MinPrice = Math.round(query.minPrice * 100);
      if (query.maxPrice) payload.MaxPrice = Math.round(query.maxPrice * 100);
      if (query.conditions?.length === 1) {
        payload.Condition = { new: 'New', refurbished: 'Refurbished', used: 'Used' }[query.conditions[0]];
      }
      const body = JSON.stringify(payload);
      const path = '/paapi5/searchitems';
      const headers = signV4({
        accessKey: accessKey!,
        secretKey: secretKey!,
        region: mp.region,
        service: 'ProductAdvertisingAPI',
        host: mp.host,
        path,
        body,
        headers: {
          'content-encoding': 'amz-1.0',
          'content-type': 'application/json; charset=utf-8',
          'x-amz-target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
        },
      });
      const data = await fetchJson<PaapiResponse>(`https://${mp.host}${path}`, { method: 'POST', headers, body, signal });
      if (data.Errors?.length && !data.SearchResult) {
        // « NoResults » n'est pas une erreur pour nous.
        if (data.Errors.every((e) => e.Code === 'NoResults')) return [];
        throw new Error(data.Errors.map((e) => `${e.Code}: ${e.Message}`).join('; '));
      }
      return (data.SearchResult?.Items ?? []).flatMap((item) => mapItem(item, merchant));
    },
  };
}

export function mapItem(item: PaapiItem, merchant: MerchantDefinition): Offer[] {
  const title = item.ItemInfo?.Title?.DisplayValue;
  const listing = item.Offers?.Listings?.[0];
  if (!title || !listing?.Price) return [];
  const conditionValue = listing.Condition?.Value;
  return [
    makeOffer({
      merchantId: merchant.id,
      merchantName: merchant.name,
      sourceId: item.ASIN,
      title,
      url: item.DetailPageURL,
      price: listing.Price.Amount,
      currency: listing.Price.Currency,
      shipping: listing.DeliveryInfo?.IsFreeShippingEligible ? 0 : null,
      imageUrl: item.Images?.Primary?.Medium?.URL,
      condition: parseCondition(conditionValue, title),
      conditionGrade: listing.Condition?.SubCondition?.Value && listing.Condition.SubCondition.Value !== 'Unknown' ? listing.Condition.SubCondition.Value : undefined,
      inStock: listing.Availability?.Type ? listing.Availability.Type === 'Now' : null,
      brand: item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue,
      gtin: item.ItemInfo?.ExternalIds?.EANs?.DisplayValues?.[0] ?? item.ItemInfo?.ExternalIds?.UPCs?.DisplayValues?.[0],
      mpn: item.ItemInfo?.ManufactureInfo?.Model?.DisplayValue,
      rating: item.CustomerReviews?.StarRating?.Value,
      reviewCount: item.CustomerReviews?.Count,
      seller: listing.MerchantInfo?.Name,
    }),
  ];
}
