import type { CategoryId, UnitPrice } from '../shared/types.js';
import { tokenize } from './normalize.js';

const PER_TB: ReadonlySet<CategoryId> = new Set(['ssd', 'hdd', 'external-storage', 'memory-card']);

/** Plus grande capacité citée dans le titre, en Go (« 2 To » → 2000, kit « 32 Go (2 x 16 Go) » → 32). */
export function capacityGb(title: string): number | null {
  let max = 0;
  for (const t of tokenize(title)) {
    const m = /^(\d+(?:\.\d+)?)(go|to)$/.exec(t);
    if (!m) continue;
    const gb = Number.parseFloat(m[1]) * (m[2] === 'to' ? 1000 : 1);
    if (gb > max) max = gb;
  }
  return max > 0 ? max : null;
}

/** Prix au To pour le stockage, au Go pour la mémoire vive. */
export function unitPriceFor(category: CategoryId, title: string, totalPrice: number): UnitPrice | undefined {
  if (!PER_TB.has(category) && category !== 'ram') return undefined;
  const gb = capacityGb(title);
  if (!gb) return undefined;
  if (category === 'ram') return { value: Math.round((totalPrice / gb) * 100) / 100, unit: '€/Go' };
  return { value: Math.round((totalPrice / (gb / 1000)) * 100) / 100, unit: '€/To' };
}
