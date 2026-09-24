import type { Condition } from '@shared/types';
import { Info, LoaderCircle, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CONDITION_META } from '../lib/format';

export function ConditionBadge({ condition, grade }: { condition: Condition; grade?: string }) {
  const meta = CONDITION_META[condition];
  return (
    <span className={`chip ${meta.className}`} title={grade}>
      {meta.label}
      {grade && condition !== 'new' && <span className="font-normal opacity-80">· {grade}</span>}
    </span>
  );
}

export function Spinner({ label = 'Chargement…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-slate-500" role="status">
      <LoaderCircle className="size-5 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function EmptyState({ icon, title, children }: { icon?: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      {icon && <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800">{icon}</div>}
      <h3 className="text-base font-semibold">{title}</h3>
      {children && <div className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{children}</div>}
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
      <TriangleAlert className="mt-0.5 size-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}

/** Bandeau global affiché sur toutes les pages tant que le serveur tourne en mode démo. */
export function DemoBanner() {
  return (
    <div role="note" className="border-b border-amber-300 bg-amber-100 text-sm text-amber-950 dark:border-amber-800/60 dark:bg-amber-950 dark:text-amber-100">
      <div className="mx-auto flex max-w-7xl items-start gap-2 px-4 py-2 sm:px-6">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>
          <strong>Données de démonstration : prix fictifs, aucun marchand connecté.</strong> Les produits existent, mais leurs prix sont inventés et les
          boutons « Chercher » ouvrent seulement la recherche du marchand.{' '}
          <Link to="/sources" className="font-medium underline underline-offset-2">
            En savoir plus
          </Link>
        </p>
      </div>
    </div>
  );
}
