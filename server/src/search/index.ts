import type { Offer } from '../shared/types.js';
import { categoryTerms } from '../shared/categories.js';
import { tokenize } from './normalize.js';

/** Index plein texte en mémoire sur des offres (flux, catalogues de boutiques, démo). */
export class OfferIndex {
  private offers: Offer[] = [];
  private tokens = new Map<string, number[]>();
  private gtins = new Map<string, number[]>();

  constructor(offers: Offer[] = []) {
    this.load(offers);
  }

  get size(): number {
    return this.offers.length;
  }

  load(offers: Offer[]): void {
    this.offers = offers;
    this.tokens = new Map();
    this.gtins = new Map();
    offers.forEach((offer, i) => {
      for (const t of new Set(tokenize(`${offer.title} ${offer.brand ?? ''} ${offer.mpn ?? ''} ${categoryTerms(offer.category)}`))) {
        const list = this.tokens.get(t);
        if (list) list.push(i);
        else this.tokens.set(t, [i]);
      }
      if (offer.gtin) {
        const list = this.gtins.get(offer.gtin);
        if (list) list.push(i);
        else this.gtins.set(offer.gtin, [i]);
      }
    });
  }

  private postings(token: string): Set<number> {
    const exact = this.tokens.get(token);
    const out = new Set<number>(exact ?? []);
    // Préfixe pour les mots ≥ 3 caractères (« rtx » ⊂ « rtx5070 », « ryz » ⊂ « ryzen »).
    if (token.length >= 3) {
      for (const [key, list] of this.tokens) {
        if (key !== token && key.startsWith(token)) for (const i of list) out.add(i);
      }
    }
    return out;
  }

  /** Offres d'une catégorie, les moins chères d'abord. */
  byCategory(category: string, limit: number): Offer[] {
    return this.offers
      .filter((o) => o.category === category)
      .sort((a, b) => a.totalPrice - b.totalPrice)
      .slice(0, limit);
  }

  /** Titres distincts correspondant à une saisie partielle (le dernier mot est un préfixe). */
  suggestTitles(prefix: string, limit: number): string[] {
    const tokens = tokenize(prefix);
    if (!tokens.length) return [];
    const last = tokens[tokens.length - 1];
    const full = tokens.slice(0, -1);
    const lastSet = new Set<number>();
    for (const [key, list] of this.tokens) if (key.startsWith(last)) for (const i of list) lastSet.add(i);
    let result = lastSet;
    for (const t of full) {
      const s = this.postings(t);
      result = new Set([...result].filter((i) => s.has(i)));
    }
    const titles = new Set<string>();
    for (const i of result) {
      titles.add(this.offers[i].title);
      if (titles.size >= limit * 3) break;
    }
    // Les titres les plus courts sont les plus « génériques » : on les propose d'abord.
    return [...titles].sort((a, b) => a.length - b.length).slice(0, limit);
  }

  search(q: string, limit: number, gtin?: string): Offer[] {
    if (gtin) {
      const hits = this.gtins.get(gtin);
      if (hits?.length) return hits.slice(0, limit).map((i) => this.offers[i]);
    }
    const tokens = tokenize(q);
    if (!tokens.length) return [];
    // On exige tous les mots (en commençant par le plus rare pour réduire l'ensemble).
    const sets = tokens.map((t) => this.postings(t)).sort((a, b) => a.size - b.size);
    let result = sets[0];
    for (const s of sets.slice(1)) {
      result = new Set([...result].filter((i) => s.has(i)));
      if (!result.size) break;
    }
    return [...result]
      .map((i) => this.offers[i])
      .sort((a, b) => a.totalPrice - b.totalPrice)
      .slice(0, limit);
  }
}

