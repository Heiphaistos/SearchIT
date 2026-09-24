import { useSyncExternalStore } from 'react';

// Petit store persistant dans localStorage, partagé entre composants (et onglets).
export function createStore<T>(key: string, initial: T) {
  let state: T = initial;
  try {
    const raw = localStorage.getItem(key);
    if (raw) state = JSON.parse(raw) as T;
  } catch {
    // Stockage indisponible (navigation privée…) : on garde l'état en mémoire.
  }
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());

  const set = (updater: T | ((prev: T) => T)) => {
    state = typeof updater === 'function' ? (updater as (prev: T) => T)(state) : updater;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore
    }
    emit();
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key !== key || e.newValue === null) return;
      try {
        state = JSON.parse(e.newValue) as T;
        emit();
      } catch {
        // ignore
      }
    });
  }

  const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  };

  return {
    get: () => state,
    set,
    use: () => useSyncExternalStore(subscribe, () => state),
  };
}
