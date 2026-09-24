import fs from 'node:fs';
import path from 'node:path';
import type { PriceHistory, PricePoint, ProductGroup } from '../shared/types.js';
import { normalizeText } from './normalize.js';

// Historique des prix et recherches populaires, persistés dans un simple fichier JSON
// (un point par produit et par jour). Seules les offres réelles sont enregistrées :
// les prix fictifs du mode démo ne polluent jamais l'historique.

const MAX_DAYS = 365;
const MAX_PRODUCTS = 50_000;
const MAX_QUERIES = 5_000;
const SPARKLINE_DAYS = 90;

interface Data {
  products: Record<string, PricePoint[]>;
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
  private queries = new Map<string, { q: string; count: number; last: number }>();
  private timer: NodeJS.Timeout | null = null;

  constructor(private file: string | null) {
    if (!file) return;
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8')) as Data;
      this.products = new Map(Object.entries(data.products ?? {}));
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
      changed = true;
    }
    if (this.products.size > MAX_PRODUCTS) {
      // On oublie les produits les moins récemment vus.
      const sorted = [...this.products.entries()].sort((a, b) => (a[1].at(-1)?.d ?? '').localeCompare(b[1].at(-1)?.d ?? ''));
      for (const [key] of sorted.slice(0, this.products.size - MAX_PRODUCTS)) this.products.delete(key);
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
    const data: Data = { products: Object.fromEntries(this.products), queries: Object.fromEntries(this.queries) };
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    const tmp = `${this.file}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(data));
    fs.renameSync(tmp, this.file);
  }
}
