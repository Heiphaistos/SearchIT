import { createStore } from './store';

export type Theme = 'light' | 'dark';

function systemTheme(): Theme {
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Le script inline de index.html applique déjà le thème avant le rendu.
export const themeStore = createStore<Theme>('searchit:theme', document.documentElement.classList.contains('dark') ? 'dark' : systemTheme());

export function toggleTheme(): void {
  themeStore.set((t) => {
    const next = t === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    return next;
  });
}
