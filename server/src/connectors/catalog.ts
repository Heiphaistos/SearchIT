import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from '../config.js';
import { OfferIndex } from '../search/index.js';
import type { Offer } from '../shared/types.js';
import type { Connector, ConnectorQuery } from './types.js';

// Connecteur générique « catalogue complet » : on télécharge périodiquement tout le
// catalogue d'une source (flux d'affiliation, boutique Shopify/WooCommerce…),
// on l'indexe en mémoire et on le met en cache sur disque. Les recherches sont
// alors instantanées et ne sollicitent pas le marchand.

export interface CatalogSource {
  id: string;
  merchantId: string;
  enabled(): boolean;
  load(signal: AbortSignal): Promise<Offer[]>;
  /** Détails supplémentaires pour la page « Marchands ». */
  details?: Record<string, unknown>;
  refreshMinutes?: number;
}

export function createCatalogConnector(source: CatalogSource): Connector {
  const index = new OfferIndex();
  const refreshMs = (source.refreshMinutes ?? config.feedRefreshMinutes) * 60_000;
  const cacheFile = path.join(config.cacheDir, 'catalogs', `${source.id.replace(/[^a-z0-9._-]/gi, '_')}.json`);
  let loadedAt: Date | null = null;
  let lastError: string | null = null;
  let loading: Promise<void> | null = null;
  let timer: NodeJS.Timeout | null = null;

  async function refresh(): Promise<void> {
    try {
      const offers = await source.load(AbortSignal.timeout(10 * 60_000));
      index.load(offers);
      loadedAt = new Date();
      lastError = null;
      await fs.mkdir(path.dirname(cacheFile), { recursive: true });
      await fs.writeFile(cacheFile, JSON.stringify({ loadedAt, offers }));
      console.log(`[${source.id}] ${offers.length} offres indexées`);
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.error(`[${source.id}] échec du chargement: ${lastError}`);
    }
  }

  async function loadFromCache(): Promise<boolean> {
    try {
      const data = JSON.parse(await fs.readFile(cacheFile, 'utf8')) as { loadedAt: string; offers: Offer[] };
      index.load(data.offers);
      loadedAt = new Date(data.loadedAt);
      return Date.now() - loadedAt.getTime() < refreshMs;
    } catch {
      return false;
    }
  }

  function ensureLoaded(): Promise<void> {
    loading ??= (async () => {
      const fresh = await loadFromCache();
      if (!fresh) {
        // Cache périmé mais présent : on le sert et on rafraîchit en arrière-plan.
        if (index.size) void refresh();
        else await refresh();
      }
      if (!timer) {
        timer = setInterval(() => void refresh(), refreshMs);
        timer.unref();
      }
    })();
    return loading;
  }

  return {
    id: source.id,
    merchantId: source.merchantId,
    enabled: source.enabled,
    warmup: ensureLoaded,
    describe: () => ({ ...source.details, offers: index.size, loadedAt, lastError }),
    async search(query: ConnectorQuery): Promise<Offer[]> {
      await ensureLoaded();
      // Catalogue indisponible : pas d'erreur à chaque recherche, l'état est visible sur la page « Marchands ».
      if (!index.size) return [];
      if (query.browse && query.category) return index.byCategory(query.category, query.limit * 4);
      return index.search(query.q, query.limit, query.gtin);
    },
  };
}
