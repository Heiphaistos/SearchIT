import type { CategoryId, Condition, ProductGroup } from '@shared/types';
import { createStore } from './store';

// « Ma liste » : un panier de comparaison (ex. tous les composants d'un PC).
// Le calcul du meilleur total passe par /api/lookup, le même endpoint que le configurateur.

export interface ListItem {
  ref: string;
  query: string;
  title: string;
  category: CategoryId;
  gtin?: string;
  imageUrl?: string;
  quantity: number;
  conditions?: Condition[];
  /** Prix au moment de l'ajout, pour info. */
  priceWhenAdded: number;
  addedAt: string;
}

export const listStore = createStore<ListItem[]>('searchit:list', []);

export function addGroupToList(group: ProductGroup): void {
  listStore.set((items) => {
    const existing = items.find((i) => i.ref === group.key);
    if (existing) return items.map((i) => (i.ref === group.key ? { ...i, quantity: i.quantity + 1 } : i));
    return [
      ...items,
      {
        ref: group.key,
        query: group.title,
        title: group.title,
        category: group.category,
        gtin: group.gtin,
        imageUrl: group.imageUrl,
        quantity: 1,
        priceWhenAdded: group.bestOffer.totalPrice,
        addedAt: new Date().toISOString(),
      },
    ];
  });
}

export function updateListItem(ref: string, patch: Partial<ListItem>): void {
  listStore.set((items) => items.map((i) => (i.ref === ref ? { ...i, ...patch } : i)));
}

export function removeListItem(ref: string): void {
  listStore.set((items) => items.filter((i) => i.ref !== ref));
}

export function clearList(): void {
  listStore.set([]);
}
