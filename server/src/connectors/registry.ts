import { config } from '../config.js';
import { getMerchantDefinitions, requiredEnvFor, type MerchantDefinition } from '../merchants.js';
import type { MerchantInfo } from '../shared/types.js';
import { createAliExpressConnector } from './aliexpress.js';
import { createAmazonConnector } from './amazon.js';
import { createDemoConnector } from './demo.js';
import { createEbayConnector } from './ebay.js';
import { createFeedConnector } from './feed.js';
import { createGoogleShoppingConnector } from './google-shopping.js';
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
};

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
  }
}

export interface Registry {
  connectors: Connector[];
  merchants: MerchantDefinition[];
  merchantInfo(): MerchantInfo[];
}

export function createRegistry(): Registry {
  const merchants = getMerchantDefinitions();
  const real = merchants.map(createConnector);
  // En mode « auto », la démo reste active tant qu'aucune grande source (Google Shopping,
  // API marchande, flux d'affiliation) n'est configurée : les seules boutiques publiques
  // ne suffisent pas à remplir le site. Chaque offre de démo est marquée comme telle.
  const broad = real.filter((_, i) => merchants[i].kind !== 'shopify' && merchants[i].kind !== 'woocommerce');
  const demoEnabled = () => config.demoMode === 'on' || (config.demoMode === 'auto' && !broad.some((c) => c.enabled()));
  const connectors = [...real, createDemoConnector(demoEnabled)];

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
        enabled: real[i].enabled(),
        requiredEnv: requiredEnvFor(m),
        notes: m.notes,
      })),
  };
}
