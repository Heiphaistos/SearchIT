import { fromExternalCategory } from './shared/categories.js';
import type { LookupItem, LookupRequest, LookupResponse, Offer } from './shared/types.js';

// Contrat d'intégration avec le configurateur EnginePC (https://enginepc.heiphaistos.org).
// POST /api/v1/prices/lookup : { currency, country, items: [{ id, name, category, ean?, mpn? }] }
// → { results: [{ id, best?, offers }] } ; les produits introuvables sont omis.

export const ENGINEPC_MAX_ITEMS = 50;

export class ContractError extends Error {}

export interface EnginePcOffer {
  merchant: string;
  price: number;
  currency: string;
  url: string;
  inStock: boolean;
  shipping?: number;
  updatedAt?: string;
  /** Extension SearchIT : vrai si le prix est fictif (catalogue de démonstration). */
  demo?: boolean;
}

export interface EnginePcResult {
  id: string;
  best?: EnginePcOffer;
  offers: EnginePcOffer[];
}

function text(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string' && typeof value !== 'number') return undefined;
  const s = String(value).trim().slice(0, max);
  return s || undefined;
}

/** Convertit le corps EnginePC en requête du moteur (occasion exclue par défaut). */
export function parseEnginePcRequest(body: unknown): LookupRequest {
  if (!body || typeof body !== 'object') throw new ContractError('Corps JSON attendu');
  const { items } = body as Record<string, unknown>;
  if (!Array.isArray(items) || !items.length) throw new ContractError('« items » doit être un tableau non vide');
  if (items.length > ENGINEPC_MAX_ITEMS) throw new ContractError(`${ENGINEPC_MAX_ITEMS} articles maximum par requête`);
  const parsed: LookupItem[] = items.map((raw, i) => {
    const it = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
    const id = text(it.id, 200);
    if (!id) throw new ContractError(`items[${i}] : « id » requis`);
    const name = text(it.name, 200) ?? '';
    const gtin = text(it.ean, 20);
    const mpn = text(it.mpn, 80);
    if (!name && !gtin && !mpn) throw new ContractError(`items[${i}] : « name », « ean » ou « mpn » requis`);
    // Catégorie inconnue : ignorée (la catégorie est alors détectée d'après le nom).
    return { ref: id, query: name, category: fromExternalCategory(it.category), gtin, mpn };
  });
  return { items: parsed, conditions: ['new', 'refurbished'], alternatives: 5 };
}

function toEnginePcOffer(o: Offer): EnginePcOffer {
  return {
    merchant: o.merchantName,
    price: o.price,
    currency: o.currency,
    url: o.url,
    inStock: o.inStock !== false,
    ...(o.shipping !== null && { shipping: o.shipping }),
    updatedAt: o.updatedAt,
    ...(o.isDemo && { demo: true }),
  };
}

export function toEnginePcResponse(res: LookupResponse): { results: EnginePcResult[]; demo: boolean } {
  return {
    results: res.results.flatMap((r) =>
      r.best ? [{ id: r.ref, best: toEnginePcOffer(r.best), offers: [r.best, ...r.alternatives].map(toEnginePcOffer) }] : [],
    ),
    demo: res.demo,
  };
}
