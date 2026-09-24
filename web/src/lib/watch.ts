import type { CategoryId, ProductGroup } from '@shared/types';
import { api } from './api';
import { createStore } from './store';

// Suivi de prix : produits surveillés avec un prix cible. Tout reste dans le navigateur ;
// les prix sont revérifiés via /api/lookup à l'ouverture du site (au plus toutes les 6 h)
// ou à la demande, avec une notification du navigateur quand la cible est atteinte.

export interface WatchItem {
  ref: string;
  title: string;
  query: string;
  category: CategoryId;
  gtin?: string;
  imageUrl?: string;
  target: number;
  priceWhenAdded: number;
  lastPrice?: number;
  lowestSeen?: number;
  merchant?: string;
  url?: string;
  reached?: boolean;
  addedAt: string;
  lastChecked?: string;
}

export const watchStore = createStore<WatchItem[]>('searchit:watch', []);
export const watchMetaStore = createStore<{ lastRun?: string }>('searchit:watch-meta', {});

const CHECK_EVERY_MS = 6 * 3_600_000;

export function isWatched(ref: string): boolean {
  return watchStore.get().some((w) => w.ref === ref);
}

export function watchGroup(group: ProductGroup, target: number): void {
  const price = group.bestOffer.totalPrice;
  watchStore.set((items) => [
    ...items.filter((w) => w.ref !== group.key),
    {
      ref: group.key,
      title: group.title,
      query: group.title,
      category: group.category,
      gtin: group.gtin,
      imageUrl: group.imageUrl,
      target,
      priceWhenAdded: price,
      lastPrice: price,
      lowestSeen: price,
      merchant: group.bestOffer.merchantName,
      url: group.bestOffer.url,
      reached: price <= target,
      addedAt: new Date().toISOString(),
      lastChecked: new Date().toISOString(),
    },
  ]);
}

export function unwatch(ref: string): void {
  watchStore.set((items) => items.filter((w) => w.ref !== ref));
}

export function setTarget(ref: string, target: number): void {
  watchStore.set((items) => items.map((w) => (w.ref === ref ? { ...w, target, reached: w.lastPrice !== undefined && w.lastPrice <= target } : w)));
}

function notify(items: WatchItem[]): void {
  if (!items.length || typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  for (const w of items.slice(0, 3)) {
    new Notification('SearchIT : prix cible atteint', {
      body: `${w.title} — ${w.lastPrice?.toFixed(2).replace('.', ',')} € chez ${w.merchant ?? 'un marchand'}`,
      icon: '/icon-192.png',
      tag: `searchit-${w.ref}`,
    });
  }
}

/** Revérifie tous les prix suivis. Renvoie les produits qui viennent d'atteindre leur cible. */
export async function checkWatchlist(): Promise<WatchItem[]> {
  const items = watchStore.get();
  watchMetaStore.set({ lastRun: new Date().toISOString() });
  if (!items.length) return [];
  const res = await api.lookup({
    items: items.map((w) => ({ ref: w.ref, query: w.query, category: w.category === 'other' ? undefined : w.category, gtin: w.gtin })),
    alternatives: 0,
  });
  const byRef = new Map(res.results.map((r) => [r.ref, r]));
  const newlyReached: WatchItem[] = [];
  const now = new Date().toISOString();
  watchStore.set((current) =>
    current.map((w) => {
      const best = byRef.get(w.ref)?.best;
      if (!best) return { ...w, lastChecked: now };
      const reached = best.totalPrice <= w.target;
      const next: WatchItem = {
        ...w,
        lastPrice: best.totalPrice,
        lowestSeen: Math.min(w.lowestSeen ?? best.totalPrice, best.totalPrice),
        merchant: best.merchantName,
        url: best.url,
        reached,
        lastChecked: now,
      };
      if (reached && !w.reached) newlyReached.push(next);
      return next;
    }),
  );
  notify(newlyReached);
  return newlyReached;
}

/** Vérification en arrière-plan au chargement du site, au plus toutes les 6 h. */
export function scheduleWatchCheck(): void {
  const last = watchMetaStore.get().lastRun;
  if (!watchStore.get().length || (last && Date.now() - Date.parse(last) < CHECK_EVERY_MS)) return;
  setTimeout(() => void checkWatchlist().catch(() => undefined), 3_000);
}
