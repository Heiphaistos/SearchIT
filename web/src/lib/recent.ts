import { createStore } from './store';

// Recherches récentes de ce navigateur (8 max), affichées dans l'autocomplétion et sur l'accueil.
export const recentStore = createStore<string[]>('searchit:recent', []);

export function addRecentSearch(q: string): void {
  const query = q.trim();
  if (!query) return;
  recentStore.set((list) => [query, ...list.filter((x) => x.toLowerCase() !== query.toLowerCase())].slice(0, 8));
}

export function clearRecentSearches(): void {
  recentStore.set([]);
}
