import type { MerchantInfo, Offer, ProductGroup } from '@shared/types';
import { ExternalLink, RefreshCw, Search, Star, Store, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';
import { formatPrice, formatShipping, plural } from '../lib/format';
import { ConditionBadge } from './ui';

// Liste des marchands chargée une fois pour toute la session (liens « Chercher chez … »).
let merchantsPromise: Promise<MerchantInfo[]> | null = null;
function loadMerchants(): Promise<MerchantInfo[]> {
  merchantsPromise ??= api.merchants().then(
    (r) => r.merchants,
    () => {
      merchantsPromise = null;
      return [];
    },
  );
  return merchantsPromise;
}

function ago(iso: string, now = Date.now()): string {
  const min = Math.max(0, Math.round((now - Date.parse(iso)) / 60_000));
  if (min < 1) return 'à l’instant';
  if (min < 60) return `il y a ${min} min`;
  if (min < 48 * 60) return `il y a ${Math.round(min / 60)} h`;
  return `il y a ${Math.round(min / 1440)} j`;
}

function OfferRow({ offer, best }: { offer: Offer; best: boolean }) {
  return (
    <li className={`flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5 px-3 py-3 ${best ? 'bg-emerald-50/60 dark:bg-emerald-500/5' : ''}`}>
      <div className="min-w-0 flex-1 basis-48">
        <div className="flex flex-wrap items-center gap-1.5 font-medium">
          <Store className="size-3.5 shrink-0 text-slate-400" />
          <span className="break-words">{offer.merchantName}</span>
          {best && <span className="chip bg-emerald-600 text-white">Meilleur prix</span>}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          <ConditionBadge condition={offer.condition} grade={offer.conditionGrade} />
          {offer.inStock === true && <span className="text-emerald-600 dark:text-emerald-400">En stock</span>}
          {offer.inStock === false && <span className="text-red-600 dark:text-red-400">Rupture</span>}
          <span>{formatShipping(offer.shipping)}</span>
          {offer.rating !== undefined && (
            <span className="inline-flex items-center gap-0.5">
              <Star className="size-3 fill-amber-400 text-amber-400" /> {offer.rating.toFixed(1)}
              {offer.reviewCount ? ` (${plural(offer.reviewCount, 'avis', 'avis')})` : ''}
            </span>
          )}
          <span>
            prix relevé {ago(offer.updatedAt)}
            {offer.via === 'google-shopping' && ' via Google Shopping'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="font-semibold tabular-nums">{formatPrice(offer.totalPrice, offer.currency)}</div>
          {offer.shipping ? <div className="text-xs text-slate-500">{formatPrice(offer.price, offer.currency)} + port</div> : null}
        </div>
        <a href={offer.url} target="_blank" rel="nofollow sponsored noopener noreferrer" className="btn-outline px-3 py-1.5 text-xs">
          Voir <ExternalLink className="size-3.5" />
          <span className="sr-only">chez {offer.merchantName}</span>
        </a>
      </div>
    </li>
  );
}

/**
 * Aperçu d'un produit : toutes ses offres triées par prix total. À l'ouverture, les pages de
 * recherche des marchands sont relues côté serveur si le relevé est ancien (SCRAPE_REFRESH_MINUTES).
 */
export function OfferPreview({ group: initial, query, category, onClose }: { group: ProductGroup; query: string; category?: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [group, setGroup] = useState(initial);
  const [status, setStatus] = useState<'refreshing' | 'done' | 'failed'>('refreshing');
  const [merchants, setMerchants] = useState<MerchantInfo[]>([]);

  useEffect(() => {
    dialog.current?.showModal();
    const controller = new AbortController();
    api.refresh({ q: query, category, key: initial.key, title: initial.title }, controller.signal).then(
      (r) => {
        if (r.group) setGroup(r.group);
        setStatus('done');
      },
      () => !controller.signal.aborted && setStatus('failed'),
    );
    void loadMerchants().then(setMerchants);
    return () => controller.abort();
  }, [initial.key, initial.title, query, category]);

  const offers = [...group.offers].sort((a, b) => a.totalPrice - b.totalPrice);
  const present = new Set(offers.map((o) => o.merchantId));
  const searchable = merchants
    .filter((m) => m.searchUrl)
    .sort((a, b) => Number(present.has(b.id)) - Number(present.has(a.id)) || a.name.localeCompare(b.name));
  const newest = offers.reduce((t, o) => Math.max(t, Date.parse(o.updatedAt)), 0);

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && dialog.current.close()}
      aria-labelledby="preview-title"
      className="m-auto max-h-[92dvh] w-[min(46rem,calc(100vw-1rem))] overflow-y-auto rounded-2xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/60 dark:bg-slate-900 dark:text-slate-100"
    >
      <div className="sticky top-0 z-10 flex items-start gap-3 border-b border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        {group.imageUrl && (
          <img src={group.imageUrl} alt="" referrerPolicy="no-referrer" className="size-16 shrink-0 rounded-lg bg-white object-contain p-1 ring-1 ring-slate-100 dark:ring-slate-800" />
        )}
        <div className="min-w-0 flex-1">
          <h2 id="preview-title" className="font-semibold leading-snug break-words">
            {group.title}
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400" role="status">
            <RefreshCw className={`size-3 ${status === 'refreshing' ? 'animate-spin' : ''}`} />
            {status === 'refreshing' && 'Actualisation des prix chez les marchands…'}
            {status === 'done' && `${plural(offers.length, 'offre')} · dernier relevé ${newest ? ago(new Date(newest).toISOString()) : 'inconnu'}`}
            {status === 'failed' && 'Actualisation impossible : prix du dernier relevé.'}
          </p>
        </div>
        <button onClick={() => dialog.current?.close()} className="btn-outline shrink-0 px-2" aria-label="Fermer l’aperçu" autoFocus>
          <X className="size-4" />
        </button>
      </div>

      <ul className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
        {offers.map((o) => (
          <OfferRow key={o.id} offer={o} best={o.id === group.bestOffer.id} />
        ))}
      </ul>

      <div className="border-t border-slate-100 p-4 text-sm dark:border-slate-800">
        <a
          href={`https://www.google.fr/search?tbm=shop&q=${encodeURIComponent(group.title)}`}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="btn-outline px-3 py-1.5 text-xs"
        >
          Voir sur Google Shopping <ExternalLink className="size-3.5" />
        </a>
        {searchable.length > 0 && (
          <>
            <h3 className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Chercher directement chez</h3>
            <div className="flex flex-wrap gap-1.5">
              {searchable.map((m) => (
                <a
                  key={m.id}
                  href={m.searchUrl!.replace('{q}', encodeURIComponent(group.title))}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className={`chip gap-1 py-1 ring-1 ring-slate-200 hover:bg-slate-50 dark:ring-slate-700 dark:hover:bg-slate-800 ${present.has(m.id) ? 'font-semibold' : ''}`}
                >
                  <Search className="size-3" /> {m.name}
                  <span className="sr-only"> : chercher ce produit</span>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
