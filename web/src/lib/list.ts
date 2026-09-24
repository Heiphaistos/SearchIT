import { isCategoryId } from '@shared/categories';
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

// ---------- Partage & export ----------

interface SharedItem {
  q: string;
  t: string;
  c: CategoryId;
  n: number;
  g?: string;
}

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(data: string): string {
  const bin = atob(data.replace(/-/g, '+').replace(/_/g, '/'));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

/** Lien qui recrée la liste chez quelqu'un d'autre (rien n'est stocké sur le serveur). */
export function shareUrl(items: ListItem[]): string {
  const payload: SharedItem[] = items.map((i) => ({ q: i.query, t: i.title, c: i.category, n: i.quantity, g: i.gtin }));
  return `${window.location.origin}/liste?import=${toBase64Url(JSON.stringify(payload))}`;
}

export function decodeShared(data: string): ListItem[] | null {
  try {
    const parsed = JSON.parse(fromBase64Url(data)) as SharedItem[];
    if (!Array.isArray(parsed)) return null;
    return parsed.slice(0, 50).map((s, i) => ({
      ref: `partage-${i}-${String(s.q).slice(0, 60)}`,
      query: String(s.q).slice(0, 200),
      title: String(s.t ?? s.q).slice(0, 200),
      // Lien venu de l'extérieur : on ne fait confiance à aucune valeur.
      category: isCategoryId(s.c) ? s.c : 'other',
      gtin: typeof s.g === 'string' && /^\d{8,14}$/.test(s.g) ? s.g : undefined,
      quantity: Math.max(1, Math.min(99, Number(s.n) || 1)),
      priceWhenAdded: 0,
      addedAt: new Date().toISOString(),
    }));
  } catch {
    return null;
  }
}

export function importItems(items: ListItem[], mode: 'replace' | 'merge'): void {
  listStore.set((current) => {
    if (mode === 'replace') return items;
    const refs = new Set(current.map((i) => i.ref));
    return [...current, ...items.filter((i) => !refs.has(i.ref))];
  });
}
