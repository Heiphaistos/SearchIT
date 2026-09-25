import type { Catalog } from '../catalog/index.js';
import { config } from '../config.js';
import { getMerchantDefinitions, requiredEnvFor, type MerchantDefinition } from '../merchants.js';
import type { MerchantInfo } from '../shared/types.js';
import { createAliExpressConnector } from './aliexpress.js';
import { createAmazonConnector } from './amazon.js';
import { createDemoConnector } from './demo.js';
import { createEbayConnector } from './ebay.js';
import { createFeedConnector } from './feed.js';
import { createGoogleShoppingConnector } from './google-shopping.js';
import { createScrapeConnector, type ScrapeConnector } from './scrape/index.js';
import { SCRAPE_SITES } from './scrape/sites.js';
import { createShopifyConnector, createWooCommerceConnector } from './stores.js';
import type { Connector } from './types.js';

const CONNECTIONS: Record<MerchantDefinition['kind'], MerchantInfo['connection']> = {
  amazon: 'api',
  aliexpress: 'api',
  ebay: 'api',
  feed: 'affiliate-feed',
  shopify: 'public-store',
  woocommerce: 'public-store',
  'google-shopping': 'aggregator',
  scrape: 'public-search',
};

// Connecteur neutre des enseignes sans flux : leurs offres viennent de la collecte (connectors/scrape).
const noConnector = (m: MerchantDefinition): Connector => ({ id: `none:${m.id}`, merchantId: m.id, enabled: () => false, search: async () => [] });

function createConnector(m: MerchantDefinition): Connector {
  switch (m.kind) {
    case 'amazon':
      return createAmazonConnector(m);
    case 'aliexpress':
      return createAliExpressConnector(m);
    case 'ebay':
      return createEbayConnector(m);
    case 'feed':
      return createFeedConnector(m);
    case 'shopify':
      return createShopifyConnector(m);
    case 'woocommerce':
      return createWooCommerceConnector(m);
    case 'google-shopping':
      return createGoogleShoppingConnector();
    case 'scrape':
      return noConnector(m);
  }
}

export interface Registry {
  connectors: Connector[];
  merchants: MerchantDefinition[];
  merchantInfo(): MerchantInfo[];
}

export function createRegistry(catalog?: Catalog): Registry {
  const merchants = getMerchantDefinitions();
  const real = merchants.map(createConnector);
  const scrapers = new Map<string, ScrapeConnector>();
  for (const site of SCRAPE_SITES) {
    const merchant = merchants.find((m) => m.id === site.merchantId);
    if (merchant) scrapers.set(merchant.id, createScrapeConnector(site, merchant));
  }
  // En mode « auto », la démo reste active tant qu'aucune grande source (Google Shopping,
  // API marchande, flux d'affiliation) n'est configurée : les seules boutiques publiques
  // ne suffisent pas à remplir le site. Chaque offre de démo est marquée comme telle.
  const broad = real.filter((_, i) => merchants[i].kind !== 'shopify' && merchants[i].kind !== 'woocommerce');
  const demoEnabled = () => config.demoMode === 'on' || (config.demoMode === 'auto' && ![...broad, ...scrapers.values()].some((c) => c.enabled()));
  const connectors = [...real, ...scrapers.values(), createDemoConnector(demoEnabled, catalog)];

  return {
    connectors,
    merchants,
    merchantInfo: () =>
      merchants.map((m, i) => ({
        id: m.id,
        name: m.name,
        website: m.website,
        country: m.country,
        refurbished: m.refurbished,
        connection: CONNECTIONS[m.kind],
        enabled: real[i].enabled() || Boolean(scrapers.get(m.id)?.enabled()),
        requiredEnv: requiredEnvFor(m),
        notes: m.notes,
        searchUrl: m.searchUrl.includes('{q}') && !['shopify', 'woocommerce', 'google-shopping'].includes(m.kind) ? m.searchUrl : undefined,
        scrape: scrapers.get(m.id)?.state(),
      })),
  };
}
