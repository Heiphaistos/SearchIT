import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isCategoryId } from '../shared/categories.js';
import type { CatalogFacets, CatalogListResponse, CatalogSort, CategoryId, ReferenceInfo } from '../shared/types.js';
import { normalizeText, tokenize } from '../search/normalize.js';
import { SPEC_KEYS, type CatalogProduct } from './types.js';

// Catalogue de référence : base de produits réels (caractéristiques, prix de lancement)
// chargée depuis src/catalog/data/*.ts. Sert à enrichir les résultats (fiche technique
// immédiate), l'autocomplétion, le comparateur, la page « Catalogue » et le mode démo.

const DATA_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data');
const VARIANTS = new Set(['ti', 'super', 'xt', 'xtx', 'pro', 'max', 'plus', 'ultra', 'mini', 'lite', 'fe', 'se', 'air', 'fold', 'flip', 'classic']);

interface Indexed {
  product: CatalogProduct;
  tokens: string[];
  tokenSet: Set<string>;
  text: string;
}

export class Catalog {
  readonly products: CatalogProduct[];
  private byId = new Map<string, CatalogProduct>();
  private indexed: Indexed[];

  constructor(products: CatalogProduct[]) {
    const seen = new Set<string>();
    this.products = products.filter((p) => {
      // Garde-fous : identifiant unique, catégorie connue, nom présent.
      if (!p?.id || !p.name || seen.has(p.id) || !isCategoryId(p.category)) return false;
      seen.add(p.id);
      return true;
    });
    for (const p of this.products) this.byId.set(p.id, p);
    this.indexed = this.products.map((product) => {
      const tokens = [...new Set(tokenize(product.name))];
      return { product, tokens, tokenSet: new Set(tokens), text: normalizeText(`${product.brand} ${product.name} ${product.family ?? ''}`) };
    });
  }

  get size(): number {
    return this.products.length;
  }

  get(id: string): CatalogProduct | undefined {
    return this.byId.get(id);
  }

  /**
   * Produit de référence correspondant à un titre d'offre (« Carte graphique NVIDIA GeForce
   * RTX 5070 12 Go » → « NVIDIA GeForce RTX 5070 »). Tous les mots du nom doivent figurer
   * dans le titre ; une déclinaison absente du nom (Ti, Pro, Max…) exclut le produit.
   */
  match(title: string, category?: CategoryId): CatalogProduct | undefined {
    const titleTokens = new Set(tokenize(title));
    let best: { item: Indexed; score: number } | undefined;
    for (const item of this.indexed) {
      if (category && category !== 'other' && item.product.category !== category) continue;
      if (!item.tokens.length || !item.tokens.every((t) => titleTokens.has(t))) continue;
      let extraVariants = 0;
      for (const t of titleTokens) if (VARIANTS.has(t) && !item.tokenSet.has(t)) extraVariants++;
      if (extraVariants) continue;
      // Plus le nom est spécifique (long), meilleure est la correspondance.
      const score = item.tokens.length;
      if (!best || score > best.score) best = { item, score };
    }
    return best?.item.product;
  }

  reference(title: string, category?: CategoryId): ReferenceInfo | undefined {
    const p = this.match(title, category);
    return p ? toReference(p) : undefined;
  }

  /** Noms de produits pour l'autocomplétion (le dernier mot saisi est un préfixe). */
  suggest(prefix: string, limit: number): string[] {
    const tokens = tokenize(prefix);
    if (!tokens.length) return [];
    const last = tokens[tokens.length - 1];
    const full = tokens.slice(0, -1);
    return this.indexed
      .filter((i) => {
        const all = tokenize(i.text);
        return full.every((t) => all.includes(t)) && all.some((t) => t.startsWith(last));
      })
      .sort((a, b) => (b.product.year ?? 0) - (a.product.year ?? 0) || a.product.name.length - b.product.name.length)
      .slice(0, limit)
      .map((i) => i.product.name);
  }

  list(params: { category?: CategoryId; q?: string; brand?: string; tag?: string; sort?: CatalogSort; page?: number; pageSize?: number }): CatalogListResponse {
    const q = params.q ? tokenize(params.q) : [];
    const base = this.indexed.filter((i) => {
      if (params.category && i.product.category !== params.category) return false;
      if (q.length) {
        const all = tokenize(i.text);
        if (!q.every((t) => all.some((a) => a === t || (t.length >= 2 && a.startsWith(t))))) return false;
      }
      return true;
    });
    const facets = buildFacets(base.map((i) => i.product));
    let filtered = base.map((i) => i.product);
    if (params.brand) filtered = filtered.filter((p) => p.brand === params.brand);
    if (params.tag) filtered = filtered.filter((p) => p.tags?.includes(params.tag!));
    const sorters: Record<CatalogSort, (a: CatalogProduct, b: CatalogProduct) => number> = {
      recent: (a, b) => (b.year ?? 0) - (a.year ?? 0) || a.name.localeCompare(b.name),
      name: (a, b) => a.name.localeCompare(b.name, 'fr'),
      'msrp-asc': (a, b) => (a.msrp ?? Infinity) - (b.msrp ?? Infinity),
      'msrp-desc': (a, b) => (b.msrp ?? -1) - (a.msrp ?? -1),
    };
    filtered.sort(sorters[params.sort ?? 'recent']);
    const pageSize = Math.min(96, Math.max(1, params.pageSize ?? 48));
    const page = Math.max(1, params.page ?? 1);
    return { total: filtered.length, page, pageSize, products: filtered.slice((page - 1) * pageSize, page * pageSize), facets };
  }

  /** Produits proches : même gamme d'abord, puis même catégorie et marque. */
  similar(p: CatalogProduct, limit = 8): CatalogProduct[] {
    return this.products
      .filter((o) => o.id !== p.id && o.category === p.category)
      .map((o) => ({ o, score: (o.family && o.family === p.family ? 3 : 0) + (o.brand === p.brand ? 1 : 0) - Math.abs((o.year ?? 0) - (p.year ?? 0)) * 0.2 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.o);
  }

  stats(): { products: number; categories: Array<{ id: CategoryId; count: number }>; brands: number } {
    const byCat = new Map<CategoryId, number>();
    for (const p of this.products) byCat.set(p.category, (byCat.get(p.category) ?? 0) + 1);
    return {
      products: this.products.length,
      categories: [...byCat.entries()].map(([id, count]) => ({ id, count })).sort((a, b) => b.count - a.count),
      brands: new Set(this.products.map((p) => p.brand)).size,
    };
  }
}

export function toReference(p: CatalogProduct): ReferenceInfo {
  // Caractéristiques dans l'ordre recommandé pour la catégorie, puis les autres.
  const order = SPEC_KEYS[p.category] ?? [];
  const keys = [...order.filter((k) => k in p.specs), ...Object.keys(p.specs).filter((k) => !order.includes(k))];
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    family: p.family,
    year: p.year,
    msrp: p.msrp,
    tags: p.tags,
    specs: keys.map((k) => ({ name: k, value: String(p.specs[k]) })),
  };
}

function buildFacets(products: CatalogProduct[]): CatalogFacets {
  const count = (values: string[]) => {
    const m = new Map<string, number>();
    for (const v of values) m.set(v, (m.get(v) ?? 0) + 1);
    return [...m.entries()].map(([id, n]) => ({ id, count: n })).sort((a, b) => b.count - a.count);
  };
  return {
    categories: count(products.map((p) => p.category)) as CatalogFacets['categories'],
    brands: count(products.map((p) => p.brand)),
    tags: count(products.flatMap((p) => p.tags ?? [])),
  };
}

let loaded: Promise<Catalog> | null = null;

/** Charge tous les fichiers de src/catalog/data (une seule fois). */
export function loadCatalog(dir = DATA_DIR): Promise<Catalog> {
  loaded ??= (async () => {
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /\.(ts|js)$/.test(f) && !f.endsWith('.d.ts')).sort() : [];
    const products: CatalogProduct[] = [];
    for (const file of files) {
      try {
        const mod = (await import(pathToFileURL(path.join(dir, file)).href)) as { PRODUCTS?: CatalogProduct[] };
        if (Array.isArray(mod.PRODUCTS)) products.push(...mod.PRODUCTS);
      } catch (err) {
        console.error(`[catalogue] ${file} illisible :`, err);
      }
    }
    return new Catalog(products);
  })();
  return loaded;
}
