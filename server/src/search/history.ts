import fs from 'node:fs';
import path from 'node:path';
import type { CategoryId, Deal, PriceHistory, PricePoint, ProductGroup } from '../shared/types.js';
import { normalizeText } from './normalize.js';

// Historique des prix et recherches populaires, persistés dans un simple fichier JSON
// (un point par produit et par jour). Seules les offres réelles sont enregistrées :
// les prix fictifs du mode démo ne polluent jamais l'historique.

const MAX_DAYS = 365;
const MAX_PRODUCTS = 50_000;
const MAX_QUERIES = 5_000;
const SPARKLINE_DAYS = 90;

/** Métadonnées minimales d'un produit suivi (pour la page « Bons plans »). */
export interface ProductMeta {
  t: string;
  c: CategoryId;
  i?: string;
  q?: string;
}

interface Data {
  products: Record<string, PricePoint[]>;
  meta?: Record<string, ProductMeta>;
  queries: Record<string, { q: string; count: number; last: number }>;
}

const today = () => new Date().toISOString().slice(0, 10);

function minDefined(a: number | undefined, b: number | undefined): number | undefined {
  if (a === undefined) return b;
  if (b === undefined) return a;
  return Math.min(a, b);
}

export class HistoryStore {
  private products = new Map<string, PricePoint[]>();
  private meta = new Map<string, ProductMeta>();
  private queries = new Map<string, { q: string; count: number; last: number }>();
  private timer: NodeJS.Timeout | null = null;

  constructor(private file: string | null) {
    if (!file) return;
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8')) as Data;
      this.products = new Map(Object.entries(data.products ?? {}));
      this.meta = new Map(Object.entries(data.meta ?? {}));
      this.queries = new Map(Object.entries(data.queries ?? {}));
    } catch {
      // premier démarrage
    }
  }

  /** Enregistre le meilleur prix du jour de chaque produit (offres réelles uniquement). */
  record(groups: ProductGroup[], day = today()): void {
    let changed = false;
    for (const g of groups) {
      const real = g.offers.filter((o) => !o.isDemo && o.inStock !== false);
      if (!real.length) continue;
      const min = (cond?: string) => {
        const list = cond ? real.filter((o) => o.condition === cond) : real;
        return list.length ? Math.min(...list.map((o) => o.totalPrice)) : undefined;
      };
      const point: PricePoint = { d: day, min: min()!, new: min('new'), refurb: min('refurbished') };
      const points = this.products.get(g.key) ?? [];
      const last = points[points.length - 1];
      if (last?.d === day) {
        last.min = Math.min(last.min, point.min);
        last.new = minDefined(last.new, point.new);
        last.refurb = minDefined(last.refurb, point.refurb);
      } else {
        points.push(point);
        if (points.length > MAX_DAYS) points.splice(0, points.length - MAX_DAYS);
      }
      this.products.set(g.key, points);
      this.meta.set(g.key, { t: g.title, c: g.category, i: g.imageUrl });
      changed = true;
    }
    if (this.products.size > MAX_PRODUCTS) {
      // On oublie les produits les moins récemment vus.
      const sorted = [...this.products.entries()].sort((a, b) => (a[1].at(-1)?.d ?? '').localeCompare(b[1].at(-1)?.d ?? ''));
      for (const [key] of sorted.slice(0, this.products.size - MAX_PRODUCTS)) {
        this.products.delete(key);
        this.meta.delete(key);
      }
    }
    if (changed) this.scheduleSave();
  }

  /** Compte une recherche ayant donné des résultats (pour l'autocomplétion « populaire »). */
  recordQuery(q: string): void {
    const key = normalizeText(q);
    if (key.length < 2 || key.length > 60) return;
    const entry = this.queries.get(key) ?? { q: q.trim(), count: 0, last: 0 };
    entry.count++;
    entry.last = Date.now();
    this.queries.set(key, entry);
    if (this.queries.size > MAX_QUERIES) {
      const weakest = [...this.queries.entries()].sort((a, b) => a[1].count - b[1].count || a[1].last - b[1].last)[0];
      this.queries.delete(weakest[0]);
    }
    this.scheduleSave();
  }

  popularQueries(prefix: string, limit: number): string[] {
    const p = normalizeText(prefix);
    return [...this.queries.entries()]
      .filter(([k]) => !p || k.startsWith(p) || k.includes(` ${p}`))
      .sort((a, b) => b[1].count - a[1].count || b[1].last - a[1].last)
      .slice(0, limit)
      .map(([, v]) => v.q);
  }

  points(key: string): PricePoint[] {
    return this.products.get(key) ?? [];
  }

  /** Résumé compact joint à chaque produit dans les résultats. */
  summary(key: string): PriceHistory | undefined {
    const points = this.products.get(key);
    if (!points?.length) return undefined;
    let lowest = points[0];
    for (const p of points) if (p.min <= lowest.min) lowest = p;
    const first = points[0];
    const days = Math.round((Date.parse(points[points.length - 1].d) - Date.parse(first.d)) / 86_400_000) + 1;
    return { lowest: lowest.min, lowestDate: lowest.d, since: first.d, days, points: points.slice(-SPARKLINE_DAYS) };
  }

  /**
   * Bons plans : produits vus récemment dont le prix actuel est nettement sous la
   * moyenne de leurs 30 jours précédents. Uniquement des prix réellement relevés.
   */
  deals(opts: { category?: CategoryId; limit?: number; minDrop?: number; now?: number } = {}): Deal[] {
    const now = opts.now ?? Date.now();
    const minDrop = opts.minDrop ?? 5;
    const out: Deal[] = [];
    for (const [key, points] of this.products) {
      const meta = this.meta.get(key);
      if (!meta || (opts.category && meta.c !== opts.category) || points.length < 3) continue;
      const last = points[points.length - 1];
      if (now - Date.parse(last.d) > 3 * 86_400_000) continue; // prix trop ancien
      const window = points.slice(0, -1).filter((p) => now - Date.parse(p.d) <= 31 * 86_400_000);
      if (window.length < 2) continue;
      const average = window.reduce((sum, p) => sum + p.min, 0) / window.length;
      const dropPercent = Math.round(((average - last.min) / average) * 1000) / 10;
      if (dropPercent < minDrop) continue;
      const lowest = Math.min(...points.map((p) => p.min));
      out.push({
        key,
        title: meta.t,
        category: meta.c,
        imageUrl: meta.i,
        current: last.min,
        average: Math.round(average * 100) / 100,
        dropPercent,
        atLowest: last.min <= lowest + 0.01,
        points: points.slice(-31),
      });
    }
    return out.sort((a, b) => b.dropPercent - a.dropPercent).slice(0, opts.limit ?? 48);
  }

  topQueries(limit: number): Array<{ q: string; count: number; last: string }> {
    return [...this.queries.values()]
      .sort((a, b) => b.count - a.count || b.last - a.last)
      .slice(0, limit)
      .map((v) => ({ q: v.q, count: v.count, last: new Date(v.last).toISOString() }));
  }

  stats(): { products: number; queries: number } {
    return { products: this.products.size, queries: this.queries.size };
  }

  private scheduleSave(): void {
    if (!this.file || this.timer) return;
    this.timer = setTimeout(() => {
      this.timer = null;
      this.flush();
    }, 5_000);
    this.timer.unref?.();
  }

  flush(): void {
    if (!this.file) return;
    const data: Data = { products: Object.fromEntries(this.products), meta: Object.fromEntries(this.meta), queries: Object.fromEntries(this.queries) };
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    const tmp = `${this.file}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(data));
    fs.renameSync(tmp, this.file);
  }
}
