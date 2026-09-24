import type { ProductGroup } from '@shared/types';
import { Bell, BellRing } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { formatPrice } from '../lib/format';
import { setTarget, unwatch, watchGroup, watchStore } from '../lib/watch';

/** Bouton « Suivre le prix » avec choix du prix cible. */
export function WatchButton({ group }: { group: ProductGroup }) {
  const watched = watchStore.use().find((w) => w.ref === group.key);
  const [open, setOpen] = useState(false);
  const current = group.bestOffer.totalPrice;
  const [target, setTargetValue] = useState(() => String(watched?.target ?? Math.floor(current * 0.9)));
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !boxRef.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const value = Number(target.replace(',', '.'));
    if (!Number.isFinite(value) || value <= 0) return;
    if (watched) setTarget(group.key, value);
    else watchGroup(group, value);
    setOpen(false);
    // Autorisation des notifications demandée au moment où elle a du sens.
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') await Notification.requestPermission().catch(() => undefined);
  };

  return (
    <div ref={boxRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`btn-outline px-3 ${watched ? 'text-amber-600 dark:text-amber-400' : ''}`}
        title={watched ? `Suivi – alerte à ${formatPrice(watched.target)}` : 'Suivre le prix'}
        aria-expanded={open}
      >
        {watched ? <BellRing className="size-4" /> : <Bell className="size-4" />}
        <span className="sr-only">{watched ? 'Prix suivi' : 'Suivre le prix'}</span>
      </button>
      {open && (
        <form
          onSubmit={submit}
          className="absolute right-0 top-full z-30 mt-2 w-72 animate-fade-in rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xl dark:border-slate-700 dark:bg-slate-900"
        >
          <h4 className="text-sm font-semibold">{watched ? 'Modifier l’alerte' : 'Suivre le prix'}</h4>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Prix actuel : <strong>{formatPrice(current)}</strong>. SearchIT vous prévient quand le meilleur prix passe sous votre cible.
          </p>
          <label className="mt-3 block text-xs font-medium text-slate-600 dark:text-slate-300" htmlFor={`target-${group.key}`}>
            Prix cible (€)
          </label>
          <div className="mt-1 flex gap-2">
            <input id={`target-${group.key}`} className="input" inputMode="decimal" value={target} onChange={(e) => setTargetValue(e.target.value)} autoFocus />
            <button type="submit" className="btn-primary shrink-0">
              {watched ? 'Enregistrer' : 'Suivre'}
            </button>
          </div>
          <div className="mt-2 flex gap-1.5">
            {[5, 10, 20].map((pct) => (
              <button key={pct} type="button" onClick={() => setTargetValue(String(Math.floor(current * (1 - pct / 100))))} className="chip bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300">
                −{pct} %
              </button>
            ))}
          </div>
          {watched && (
            <button
              type="button"
              onClick={() => {
                unwatch(group.key);
                setOpen(false);
              }}
              className="mt-3 text-xs font-medium text-red-600 hover:underline dark:text-red-400"
            >
              Ne plus suivre
            </button>
          )}
        </form>
      )}
    </div>
  );
}
