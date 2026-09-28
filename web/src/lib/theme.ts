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

/** Couleurs d'accent : chacune remplace la palette « brand » (voir index.css). */
export const ACCENTS = [
  { id: 'indigo', label: 'Indigo', color: '#6366f1' },
  { id: 'violet', label: 'Violet', color: '#8b5cf6' },
  { id: 'blue', label: 'Bleu', color: '#3b82f6' },
  { id: 'cyan', label: 'Cyan', color: '#06b6d4' },
  { id: 'emerald', label: 'Émeraude', color: '#10b981' },
  { id: 'amber', label: 'Ambre', color: '#f59e0b' },
  { id: 'rose', label: 'Rose', color: '#f43f5e' },
] as const;
export type Accent = (typeof ACCENTS)[number]['id'];

export const accentStore = createStore<Accent>('searchit:accent', 'indigo');

export function setAccent(accent: Accent): void {
  document.documentElement.dataset.accent = accent;
  accentStore.set(accent);
}
