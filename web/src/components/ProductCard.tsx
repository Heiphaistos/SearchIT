import { getCategory } from '@shared/categories';
import type { Condition, Offer, ProductGroup } from '@shared/types';
import { Check, ChevronDown, ExternalLink, ListPlus, Star, Store, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import { CONDITION_META, formatPrice, formatShipping, plural } from '../lib/format';
import { addGroupToList, listStore } from '../lib/list';
import { CategoryIcon } from './CategoryIcon';
import { ConditionBadge } from './ui';

function ProductImage({ group }: { group: ProductGroup }) {
  const [failed, setFailed] = useState(false);
  if (group.imageUrl && !failed) {
    return (
      <img
        src={group.imageUrl}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="size-full object-contain p-2 mix-blend-multiply dark:mix-blend-normal"
      />
    );
  }
  return (
    <div className="grid size-full place-items-center bg-gradient-to-br from-brand-50 to-cyan-50 text-brand-500 dark:from-brand-500/10 dark:to-cyan-500/10 dark:text-brand-300">
      <CategoryIcon category={group.category} className="size-9" />
    </div>
  );
}

function BestByCondition({ group }: { group: ProductGroup }) {
  const rows: Array<[Condition, Offer | undefined]> = [
    ['new', group.bestNew],
    ['refurbished', group.bestRefurbished],
    ['used', group.bestUsed],
  ];
  return (
    <div className="flex flex-wrap gap-1.5">
      {rows
        .filter(([, o]) => o)
        .map(([c, o]) => (
          <span key={c} className={`chip ${CONDITION_META[c].className}`}>
            {CONDITION_META[c].label} dès <strong className="font-semibold">{formatPrice(o!.totalPrice)}</strong>
          </span>
        ))}
    </div>
  );
}

export function OffersTable({ offers, bestId }: { offers: Offer[]; bestId: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <th className="px-3 py-2 font-medium">Marchand</th>
            <th className="px-3 py-2 font-medium">État</th>
            <th className="px-3 py-2 font-medium">Disponibilité</th>
            <th className="px-3 py-2 text-right font-medium">Prix total</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {offers.map((o) => (
            <tr key={o.id} className={o.id === bestId ? 'bg-emerald-50/60 dark:bg-emerald-500/5' : ''}>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-2 font-medium">
                  <Store className="size-3.5 text-slate-400" />
                  {o.merchantName}
                  {o.id === bestId && <span className="chip bg-emerald-600 text-white">Meilleur prix</span>}
                </div>
                {o.seller && o.seller !== o.merchantName && <div className="text-xs text-slate-500">Vendeur : {o.seller}</div>}
                {o.rating !== undefined && (
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Star className="size-3 fill-amber-400 text-amber-400" /> {o.rating.toFixed(1)}
                    {o.reviewCount ? <span>({o.reviewCount.toLocaleString('fr-FR')})</span> : null}
                  </div>
                )}
              </td>
              <td className="px-3 py-2.5">
                <ConditionBadge condition={o.condition} grade={o.conditionGrade} />
              </td>
              <td className="px-3 py-2.5 text-xs">
                {o.inStock === true && <span className="text-emerald-600 dark:text-emerald-400">En stock</span>}
                {o.inStock === false && <span className="text-red-600 dark:text-red-400">Rupture</span>}
                {o.inStock === null && <span className="text-slate-500">Non précisée</span>}
              </td>
              <td className="px-3 py-2.5 text-right">
                <div className="font-semibold tabular-nums">{formatPrice(o.totalPrice, o.currency)}</div>
                <div className="text-xs text-slate-500">
                  {formatPrice(o.price, o.currency)} · {formatShipping(o.shipping)}
                </div>
              </td>
              <td className="px-3 py-2.5 text-right">
                <a href={o.url} target="_blank" rel="nofollow sponsored noopener noreferrer" className="btn-outline px-3 py-1.5 text-xs">
                  Voir <ExternalLink className="size-3.5" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProductCard({ group }: { group: ProductGroup }) {
  const [open, setOpen] = useState(false);
  const inList = listStore.use().some((i) => i.ref === group.key);
  const best = group.bestOffer;

  return (
    <article className="card animate-fade-in overflow-hidden">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
        <div className="size-24 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-800 sm:size-28">
          <ProductImage group={group} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <CategoryIcon category={group.category} className="size-3.5" />
              {getCategory(group.category).label}
            </span>
            {group.brand && <span>· {group.brand}</span>}
          </div>
          <h3 className="text-base font-semibold leading-snug">{group.title}</h3>
          <div className="mt-2.5">
            <BestByCondition group={group} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span>
              {plural(group.offers.length, 'offre')} chez {plural(group.merchantCount, 'marchand')}
            </span>
            {group.savingsPercent >= 5 && group.offers.length > 1 && (
              <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingDown className="size-3.5" /> jusqu’à {group.savingsPercent} % d’écart de prix
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-row items-end justify-between gap-3 sm:w-48 sm:flex-col sm:items-end">
          <div className="sm:text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400">Meilleur prix</div>
            <div className="text-2xl font-bold tabular-nums tracking-tight">{formatPrice(best.totalPrice, best.currency)}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              chez <span className="font-medium text-slate-700 dark:text-slate-200">{best.merchantName}</span> · {CONDITION_META[best.condition].label.toLowerCase()}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => addGroupToList(group)}
              className={inList ? 'btn-outline px-3 text-emerald-600 dark:text-emerald-400' : 'btn-outline px-3'}
              title="Ajouter à ma liste"
            >
              {inList ? <Check className="size-4" /> : <ListPlus className="size-4" />}
              <span className="sr-only sm:not-sr-only">{inList ? 'Ajouté' : 'Liste'}</span>
            </button>
            <a href={best.url} target="_blank" rel="nofollow sponsored noopener noreferrer" className="btn-primary px-3">
              Voir <ExternalLink className="size-4" />
            </a>
          </div>
        </div>
      </div>

      {group.offers.length > 1 && (
        <>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="flex w-full items-center justify-center gap-1.5 border-t border-slate-100 py-2.5 text-sm font-medium text-brand-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-brand-400 dark:hover:bg-slate-800/50"
          >
            {open ? 'Masquer les offres' : `Comparer les ${group.offers.length} offres`}
            <ChevronDown className={`size-4 transition ${open ? 'rotate-180' : ''}`} />
          </button>
          {open && (
            <div className="border-t border-slate-100 px-1 pb-2 dark:border-slate-800 sm:px-3">
              <OffersTable offers={group.offers} bestId={best.id} />
            </div>
          )}
        </>
      )}
    </article>
  );
}
