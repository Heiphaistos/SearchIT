import { env } from '../../config.js';
import type { MerchantDefinition } from '../../merchants.js';
import { detectCategory, normalizeText } from '../../search/normalize.js';
import { makeOffer } from '../../search/offer.js';
import type { Offer, ScrapeState } from '../../shared/types.js';
import type { Connector, ConnectorQuery } from '../types.js';
import { domainState, politeFetch, ScrapeRefused } from './fetcher.js';
import type { ScrapeSite } from './sites.js';

// Connecteur « page de recherche publique » : une requête sur le site du marchand,
// produits lus dans les données de la page, liens directs vers ses fiches produit.

export const scrapeEnabled = () => env('SCRAPE') !== 'off';
const cacheMs = () => (Number.parseInt(env('SCRAPE_CACHE_MINUTES') ?? '', 10) || 60) * 60_000;
const MAX_ENTRIES = 500;

export interface ScrapeConnector extends Connector {
  state(): ScrapeState;
}

export function createScrapeConnector(site: ScrapeSite, merchant: MerchantDefinition): ScrapeConnector {
  const origin = new URL(site.searchUrl).origin;
  const cache = new Map<string, { at: number; offers: Offer[] }>();
  const inFlight = new Map<string, Promise<Offer[]>>();

  const load = async (q: string, signal: AbortSignal): Promise<Offer[]> => {
    const url = site.searchUrl.replace('{q}', encodeURIComponent(q));
    const { html, finalUrl } = await politeFetch(url, signal);
    const at = new Date().toISOString();
    return site.extract!(html, finalUrl).map((item) =>
      makeOffer({
        merchantId: merchant.id,
        merchantName: merchant.name,
        sourceId: item.sourceId,
        title: item.title,
        url: item.url,
        price: item.price,
        imageUrl: item.imageUrl,
        condition: merchant.refurbishedOnly ? 'refurbished' : undefined,
        inStock: item.inStock ?? null,
        category: detectCategory(item.title),
        rating: item.rating,
        reviewCount: item.reviews,
        updatedAt: at,
      }),
    );
  };

  return {
    id: `scrape:${merchant.id}`,
    merchantId: merchant.id,
    live: true,
    enabled: () => scrapeEnabled() && !site.disabled && Boolean(site.extract),
    state: () =>
      site.disabled ?? (scrapeEnabled() ? (domainState(origin) ?? { status: 'active' }) : { status: 'unavailable', detail: 'Collecte désactivée (SCRAPE=off)' }),
    describe: () => ({ searchUrl: site.searchUrl, cachedQueries: cache.size }),
    async search(query: ConnectorQuery, signal: AbortSignal): Promise<Offer[]> {
      // La navigation par catégorie n'a pas de requête à transmettre au marchand.
      if (query.browse) return [];
      const key = normalizeText(query.q);
      if (key.length < 2) return [];
      const hit = cache.get(key);
      const maxAge = Math.min(cacheMs(), query.maxAgeMs ?? Infinity);
      if (hit && Date.now() - hit.at < maxAge) return hit.offers;
      let pending = inFlight.get(key);
      if (!pending) {
        pending = load(key, signal).finally(() => inFlight.delete(key));
        inFlight.set(key, pending);
      }
      try {
        const offers = await pending;
        if (cache.size >= MAX_ENTRIES) cache.delete(cache.keys().next().value!);
        cache.set(key, { at: Date.now(), offers });
        return offers;
      } catch (err) {
        // Site en pause (anti-robot) ou chemin interdit : la source se tait, son état est
        // affiché sur la page « Marchands ». Une réponse ancienne reste utilisable.
        if (err instanceof ScrapeRefused) return hit?.offers ?? [];
        throw err;
      }
    },
  };
}
