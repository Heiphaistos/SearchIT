import { config } from '../config.js';
import { getMerchantDefinitions, requiredEnvFor, type MerchantDefinition } from '../merchants.js';
import type { MerchantInfo } from '../shared/types.js';
import { createAliExpressConnector } from './aliexpress.js';
import { createAmazonConnector } from './amazon.js';
import { createDemoConnector } from './demo.js';
import { createEbayConnector } from './ebay.js';
import { createFeedConnector } from './feed.js';
import type { Connector } from './types.js';

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
  const demoEnabled = () => config.demoMode === 'on' || (config.demoMode === 'auto' && !real.some((c) => c.enabled()));
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
        connection: m.kind === 'feed' ? 'affiliate-feed' : 'api',
        enabled: real[i].enabled(),
        requiredEnv: requiredEnvFor(m),
        notes: m.notes,
      })),
  };
}
