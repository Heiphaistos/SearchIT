import type { ProductGroup } from '@shared/types';
import { createStore } from './store';

// Sélection de produits à comparer côte à côte (4 maximum), conservée dans le navigateur.
export const MAX_COMPARE = 4;
export const compareStore = createStore<ProductGroup[]>('searchit:compare', []);

export function toggleCompare(group: ProductGroup): boolean {
  let added = false;
  compareStore.set((items) => {
    if (items.some((g) => g.key === group.key)) return items.filter((g) => g.key !== group.key);
    if (items.length >= MAX_COMPARE) return items;
    added = true;
    // On ne garde que les 8 meilleures offres pour limiter la taille stockée.
    return [...items, { ...group, offers: group.offers.slice(0, 8) }];
  });
  return added;
}

export function removeFromCompare(key: string): void {
  compareStore.set((items) => items.filter((g) => g.key !== key));
}

export function clearCompare(): void {
  compareStore.set([]);
}
