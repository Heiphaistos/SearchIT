import type { Connector, ConnectorQuery } from '../connectors/types.js';
import { ACCESSORY_CATEGORIES, DEVICE_CATEGORIES, getCategory } from '../shared/categories.js';
import type {
  CategoryId,
  Condition,
  Facet,
  LookupItem,
  LookupRequest,
  LookupResponse,
  LookupResult,
  MerchantBasket,
  Offer,
  ProductGroup,
  SearchParams,
  SearchResponse,
  SourceStatus,
} from '../shared/types.js';
import { TtlCache } from './cache.js';
import { groupOffers, type ScoredOffer } from './group.js';
import { detectCategory, normalizeGtin, normalizeText } from './normalize.js';
import { round2 } from './offer.js';
import { MIN_RELEVANCE, extractConditionIntent, prepareQuery, relevance } from './relevance.js';

const DEFAULT_LOOKUP_CONDITIONS: Condition[] = ['new', 'refurbished'];

const CONDITION_LABELS: Record<Condition, string> = { new: 'Neuf', refurbished: 'Reconditionné', used: 'Occasion' };

export interface EngineOptions {
  timeoutMs: number;
  cacheTtlMs: number;
  merchantNames: Map<string, string>;
}

interface FetchResult {
  offers: Offer[];
  sources: SourceStatus[];
}

export class SearchEngine {
  private cache: TtlCache<Offer[]>;

  constructor(private connectors: Connector[], private options: EngineOptions) {
    this.cache = new TtlCache(options.cacheTtlMs);
  }

  activeConnectors(): Connector[] {
    return this.connectors.filter((c) => c.enabled());
  }

  isDemo(): boolean {
    return this.activeConnectors().some((c) => c.id === 'demo');
  }

  clearCache(): void {
    this.cache.clear();
  }

  private async fetchAll(query: ConnectorQuery, merchants?: string[]): Promise<FetchResult> {
    const connectors = this.activeConnectors().filter((c) => c.merchantId === 'demo' || !merchants?.length || merchants.includes(c.merchantId));
    const sources: SourceStatus[] = [];
    const results = await Promise.all(
      connectors.map(async (connector): Promise<Offer[]> => {
        const started = Date.now();
        const cacheKey = `${connector.id}|${normalizeText(query.q)}|${query.gtin ?? ''}|${query.category ?? ''}|${(query.conditions ?? []).join(',')}|${query.minPrice ?? ''}|${query.maxPrice ?? ''}`;
        const cached = this.cache.get(cacheKey);
        if (cached) {
          sources.push({ merchantId: connector.merchantId, connector: connector.id, status: 'ok', count: cached.length, ms: 0 });
          return cached;
        }
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.options.timeoutMs);
        try {
          const offers = await connector.search(query, controller.signal);
          this.cache.set(cacheKey, offers);
          sources.push({ merchantId: connector.merchantId, connector: connector.id, status: 'ok', count: offers.length, ms: Date.now() - started });
          return offers;
        } catch (err) {
          const timedOut = controller.signal.aborted;
          sources.push({
            merchantId: connector.merchantId,
            connector: connector.id,
            status: timedOut ? 'timeout' : 'error',
            count: 0,
            ms: Date.now() - started,
            error: timedOut ? `Délai de ${this.options.timeoutMs} ms dépassé` : err instanceof Error ? err.message : String(err),
          });
          return [];
        } finally {
          clearTimeout(timer);
        }
      }),
    );
    // Dédoublonnage des offres (même id) provenant de plusieurs sources.
    const seen = new Map<string, Offer>();
    for (const offer of results.flat()) if (!seen.has(offer.id)) seen.set(offer.id, offer);
    return { offers: [...seen.values()], sources };
  }

  async search(params: SearchParams): Promise<SearchResponse> {
    const started = Date.now();
    const intent = extractConditionIntent(params.q);
    const q = intent.query;
    const conditions = params.conditions?.length ? params.conditions : intent.conditions.length ? intent.conditions : undefined;
    let detectedCategory = params.category ?? detectCategory(params.q);
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 24));

    const { offers, sources } = await this.fetchAll(
      { q, category: detectedCategory, conditions, minPrice: params.minPrice, maxPrice: params.maxPrice, limit: 60 },
      params.merchants,
    );

    // 1) Pertinence. La catégorie détectée donne un léger bonus ; sans mot-clé de
    //    catégorie dans la requête (« i5-14600k »), on retient la catégorie majoritaire.
    const prepared = prepareQuery(q);
    const scored: ScoredOffer[] = [];
    for (const offer of offers) {
      const score = relevance(prepared, offer.title, `${offer.brand ?? ''} ${offer.mpn ?? ''}`);
      if (score >= MIN_RELEVANCE) scored.push({ offer, relevance: score });
    }
    detectedCategory ??= dominantCategory(scored);
    for (const s of scored) if (s.offer.category === detectedCategory) s.relevance = Math.round((s.relevance + 0.05) * 1000) / 1000;

    // Masquage des accessoires (coques, câbles…) pour une recherche d'appareil.
    const hideAccessories = (params.hideAccessories ?? true) && !params.category && detectedCategory !== null && DEVICE_CATEGORIES.has(detectedCategory);
    const relevant = hideAccessories ? scored.filter((s) => !ACCESSORY_CATEGORIES.has(s.offer.category)) : scored;

    // 2) Facettes calculées avant les filtres utilisateur.
    const facets = buildFacets(relevant.map((r) => r.offer), this.options.merchantNames);

    // 3) Filtres utilisateur.
    const filtered = relevant.filter(({ offer }) => {
      if (params.category && offer.category !== params.category) return false;
      if (conditions?.length && !conditions.includes(offer.condition)) return false;
      if (params.merchants?.length && !params.merchants.includes(offer.merchantId)) return false;
      if (params.minPrice !== undefined && offer.totalPrice < params.minPrice) return false;
      if (params.maxPrice !== undefined && offer.totalPrice > params.maxPrice) return false;
      if (params.inStockOnly && offer.inStock === false) return false;
      return true;
    });

    const groups = sortGroups(groupOffers(filtered), params.sort ?? 'relevance');
    return {
      query: params.q,
      detectedCategory,
      total: groups.length,
      page,
      pageSize,
      groups: groups.slice((page - 1) * pageSize, page * pageSize),
      facets,
      sources: sources.sort((a, b) => a.merchantId.localeCompare(b.merchantId)),
      demo: this.isDemo(),
      tookMs: Date.now() - started,
    };
  }

  /** Recherche du meilleur prix pour une liste de composants (API du configurateur). */
  async lookup(request: LookupRequest): Promise<LookupResponse> {
    const started = Date.now();
    const alternatives = Math.min(20, Math.max(0, request.alternatives ?? 3));
    const items = request.items.slice(0, 50);
    const results: LookupResult[] = [];
    const chosenGroups: Array<ProductGroup | undefined> = [];

    // Concurrence limitée pour ménager les API marchandes.
    const queue = items.map((item, i) => ({ item, i }));
    const workers = Array.from({ length: Math.min(4, queue.length) }, async () => {
      for (let next = queue.shift(); next; next = queue.shift()) {
        const { result, group } = await this.lookupOne(next.item, request, alternatives);
        results[next.i] = result;
        chosenGroups[next.i] = group;
      }
    });
    await Promise.all(workers);

    const byMerchant = new Map<string, MerchantBasket>();
    items.forEach((item, i) => {
      const group = chosenGroups[i];
      if (!group) return;
      const quantity = Math.max(1, item.quantity ?? 1);
      const perMerchant = new Map<string, Offer>();
      for (const offer of group.offers) {
        if (offer.inStock === false) continue;
        const current = perMerchant.get(offer.merchantId);
        if (!current || offer.totalPrice < current.totalPrice) perMerchant.set(offer.merchantId, offer);
      }
      for (const [merchantId, offer] of perMerchant) {
        const basket = byMerchant.get(merchantId) ?? { merchantId, merchantName: offer.merchantName, covered: 0, total: 0 };
        basket.covered += 1;
        basket.total = round2(basket.total + offer.price * quantity + (offer.shipping ?? 0));
        byMerchant.set(merchantId, basket);
      }
    });

    return {
      results,
      bestTotal: round2(results.reduce((sum, r) => sum + r.lineTotal, 0)),
      byMerchant: [...byMerchant.values()].sort((a, b) => b.covered - a.covered || a.total - b.total),
      missing: results.filter((r) => !r.found).map((r) => r.ref),
      demo: this.isDemo(),
      tookMs: Date.now() - started,
    };
  }

  private async lookupOne(item: LookupItem, request: LookupRequest, alternatives: number): Promise<{ result: LookupResult; group?: ProductGroup }> {
    const quantity = Math.max(1, Math.floor(item.quantity ?? 1));
    const gtin = normalizeGtin(item.gtin);
    // Par défaut, le configurateur ne propose pas d'occasion entre particuliers.
    const conditions = item.conditions ?? request.conditions ?? DEFAULT_LOOKUP_CONDITIONS;
    const response = await this.search({
      q: item.query || item.mpn || item.gtin || '',
      category: item.category && getCategory(item.category).id === item.category ? item.category : undefined,
      conditions,
      merchants: request.merchants,
      maxPrice: item.maxPrice,
      inStockOnly: true,
      sort: 'relevance',
      pageSize: 10,
    });
    const byRelevance = [...response.groups].sort((a, b) => b.relevance - a.relevance || a.bestOffer.totalPrice - b.bestOffer.totalPrice);
    const group = (gtin && response.groups.find((g) => g.gtin === gtin)) || byRelevance[0];
    if (!group) {
      return { result: { ref: item.ref, query: item.query, quantity, found: false, alternatives: [], lineTotal: 0 } };
    }
    const best = group.bestOffer;
    return {
      group,
      result: {
        ref: item.ref,
        query: item.query,
        quantity,
        found: true,
        best,
        bestNew: group.bestNew,
        bestRefurbished: group.bestRefurbished,
        alternatives: group.offers.filter((o) => o.id !== best.id).slice(0, alternatives),
        lineTotal: round2(best.price * quantity + (best.shipping ?? 0)),
      },
    };
  }
}

function dominantCategory(scored: ScoredOffer[]): CategoryId | null {
  const counts = new Map<CategoryId, number>();
  for (const { offer } of scored) if (offer.category !== 'other') counts.set(offer.category, (counts.get(offer.category) ?? 0) + 1);
  let best: CategoryId | null = null;
  for (const [cat, n] of counts) if (!best || n > counts.get(best)!) best = cat;
  return best;
}

function sortGroups(groups: ProductGroup[], sort: NonNullable<SearchParams['sort']>): ProductGroup[] {
  const byPrice = (a: ProductGroup, b: ProductGroup) => a.bestOffer.totalPrice - b.bestOffer.totalPrice;
  switch (sort) {
    case 'price-asc':
      return groups.sort(byPrice);
    case 'price-desc':
      return groups.sort((a, b) => -byPrice(a, b));
    case 'savings':
      return groups.sort((a, b) => b.savingsPercent - a.savingsPercent || byPrice(a, b));
    case 'offers':
      return groups.sort((a, b) => b.offers.length - a.offers.length || byPrice(a, b));
    default:
      // Pertinence d'abord ; à pertinence quasi égale, les produits les plus proposés puis les moins chers.
      return groups.sort((a, b) => {
        const d = Math.round((b.relevance - a.relevance) * 20) / 20;
        return d || b.merchantCount - a.merchantCount || byPrice(a, b);
      });
  }
}

function buildFacets(offers: Offer[], merchantNames: Map<string, string>): SearchResponse['facets'] {
  const count = <K extends string>(key: (o: Offer) => K) => {
    const m = new Map<K, number>();
    for (const o of offers) m.set(key(o), (m.get(key(o)) ?? 0) + 1);
    return m;
  };
  const toFacets = <K extends string>(m: Map<K, number>, label: (k: K) => string): Facet<K>[] =>
    [...m.entries()].map(([id, c]) => ({ id, label: label(id), count: c })).sort((a, b) => b.count - a.count);

  const prices = offers.map((o) => o.totalPrice);
  return {
    categories: toFacets(count((o) => o.category), (id: CategoryId) => getCategory(id).label),
    merchants: toFacets(count((o) => o.merchantId), (id) => merchantNames.get(id) ?? id),
    conditions: toFacets(count((o) => o.condition), (id: Condition) => CONDITION_LABELS[id]),
    price: { min: prices.length ? Math.floor(Math.min(...prices)) : 0, max: prices.length ? Math.ceil(Math.max(...prices)) : 0 },
  };
}
