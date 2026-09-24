import type { Condition } from '@shared/types';

const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

export function formatPrice(value: number, currency = 'EUR'): string {
  if (currency === 'EUR') return eur.format(value);
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(value);
}

export function formatShipping(shipping: number | null): string {
  if (shipping === null) return 'Livraison non précisée';
  if (shipping === 0) return 'Livraison offerte';
  return `+ ${formatPrice(shipping)} de livraison`;
}

export const CONDITION_META: Record<Condition, { label: string; short: string; className: string }> = {
  new: { label: 'Neuf', short: 'Neuf', className: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300' },
  refurbished: { label: 'Reconditionné', short: 'Recond.', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300' },
  used: { label: 'Occasion', short: 'Occasion', className: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300' },
};

export function plural(n: number, singular: string, pluralForm = `${singular}s`): string {
  return `${n.toLocaleString('fr-FR')} ${n > 1 ? pluralForm : singular}`;
}
