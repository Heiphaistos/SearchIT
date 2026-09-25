import { getCategory } from '@shared/categories';
import type { Condition, Offer, ProductGroup } from '@shared/types';
import { Check, ChevronDown, Eye, ExternalLink, FileText, Gauge, ListPlus, Scale, Star, Store, TrendingDown } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { CONDITION_META, formatPrice, formatShipping, plural } from '../lib/format';
import { compareStore, MAX_COMPARE, toggleCompare } from '../lib/compare';
import { addGroupToList, listStore } from '../lib/list';
import { CategoryIcon } from './CategoryIcon';
import { PriceHistoryBadge } from './PriceHistory';
import { OfferPreview } from './OfferPreview';
import { ProductSheetPanel } from './ProductSheet';
import { Link } from 'react-router-dom';
import { GROUP_STYLE } from '../lib/groups';
import { ConditionBadge, SpecTable } from './ui';
import { WatchButton } from './WatchButton';

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
    <div className={`grid size-full place-items-center bg-gradient-to-br ${GROUP_STYLE[getCategory(group.category).group].tile}`}>
      <span className={`grid size-12 place-items-center rounded-2xl shadow-lg ${GROUP_STYLE[getCategory(group.category).group].icon}`}>
        <CategoryIcon category={group.category} className="size-6" />
      </span>
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
                  {o.isDemo && <span className="chip bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300" title="Prix fictif (catalogue de démonstration)">Démo</span>}
                </div>
                {o.via === 'google-shopping' && <div className="text-xs text-slate-400">via Google Shopping</div>}
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
                {o.originalCurrency && o.originalPrice !== undefined && (
                  <div className="text-xs text-slate-400" title="Converti au taux de référence de la BCE">
                    soit {formatPrice(o.originalPrice, o.originalCurrency)}
                  </div>
                )}
              </td>
              <td className="px-3 py-2.5 text-right">
                <a
                  href={o.url}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="btn-outline px-3 py-1.5 text-xs"
                  title={o.isDemo ? 'Prix fictif : ouvre la recherche du marchand, pas une offre réelle' : undefined}
                >
                  {o.isDemo ? 'Chercher' : 'Voir'} <ExternalLink className="size-3.5" />
                  <span className="sr-only">chez {o.merchantName}</span>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PanelButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-expanded={active}
      className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition hover:bg-slate-50 dark:hover:bg-slate-800/50 [&+&]:border-l [&+&]:border-slate-100 dark:[&+&]:border-slate-800 ${
        active ? 'text-brand-700 dark:text-brand-300' : 'text-brand-600 dark:text-brand-400'
      }`}
    >
      {children}
      <ChevronDown className={`size-4 transition ${active ? 'rotate-180' : ''}`} />
    </button>
  );
}

function sheetQueryFor(group: ProductGroup): string | null {
  if (group.gtin) return `gtin=${group.gtin}`;
  const withMpn = group.offers.find((o) => o.mpn && (o.brand || group.brand));
  if (withMpn) return new URLSearchParams({ brand: (withMpn.brand ?? group.brand)!, mpn: withMpn.mpn! }).toString();
  return null;
}

/** `query` : recherche d'origine, relancée par l'aperçu pour actualiser les prix. */
export function ProductCard({ group, query, category }: { group: ProductGroup; query?: string; category?: string }) {
  const [panel, setPanel] = useState<'offers' | 'sheet' | null>(null);
  const [preview, setPreview] = useState(false);
  const sheetQuery = sheetQueryFor(group);
  const hasSheet = Boolean(group.reference || sheetQuery);
  const inList = listStore.use().some((i) => i.ref === group.key);
  const compared = compareStore.use();
  const inCompare = compared.some((g) => g.key === group.key);
  const compareFull = compared.length >= MAX_COMPARE;
  const best = group.bestOffer;

  return (
    <article className="card animate-fade-in transition hover:shadow-(--shadow-lift)">
      {preview && <OfferPreview group={group} query={query ?? group.title} category={category} onClose={() => setPreview(false)} />}
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
          {group.reference && (
            <div className="mt-1.5 flex flex-wrap gap-1.5 text-xs">
              {group.reference.specs.slice(0, 3).map((s) => (
                <span key={s.name} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300" title={s.name}>
                  {s.value}
                </span>
              ))}
              {group.reference.msrp && (
                <span className="rounded-md px-1.5 py-0.5 text-slate-500 dark:text-slate-400">
                  Lancement {formatPrice(group.reference.msrp)}
                  {group.bestOffer.totalPrice < group.reference.msrp * 0.95 && (
                    <strong className="ml-1 text-emerald-600 dark:text-emerald-400">
                      −{Math.round((1 - group.bestOffer.totalPrice / group.reference.msrp) * 100)} %
                    </strong>
                  )}
                </span>
              )}
            </div>
          )}
          <div className="mt-2.5">
            <BestByCondition group={group} />
          </div>
          {group.history && !best.isDemo && (
            <div className="mt-2">
              <PriceHistoryBadge history={group.history} current={best.totalPrice} />
            </div>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span>
              {plural(group.offers.length, 'offre')} chez {plural(group.merchantCount, 'marchand')}
            </span>
            {group.value && (
              <span
                className="inline-flex items-center gap-1"
                title={
                  group.value.method === 'performance'
                    ? `Indice PassMark de la puce (${group.value.basis.toLocaleString('fr-FR')}) pour 100 € du meilleur prix`
                    : `Note moyenne ${group.value.basis.toLocaleString('fr-FR')}/5 sur ${group.value.reviews?.toLocaleString('fr-FR')} avis, pondérée, pour 100 €`
                }
              >
                <Gauge className="size-3.5" /> qualité-prix {group.value.score.toLocaleString('fr-FR')}
                {group.value.method === 'performance' ? ' pts PassMark / 100 €' : ' (avis) / 100 €'}
              </span>
            )}
            {group.savingsPercent >= 5 && group.offers.length > 1 && (
              <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingDown className="size-3.5" /> jusqu’à {group.savingsPercent} % d’écart de prix
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-end justify-between gap-3 sm:flex-col sm:flex-nowrap sm:items-end">
          <div className="sm:text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Meilleur prix{best.isDemo && <span className="ml-1 font-medium text-amber-600 dark:text-amber-400">· fictif (démo)</span>}
            </div>
            <div className="text-2xl font-bold tabular-nums tracking-tight">{formatPrice(best.totalPrice, best.currency)}</div>
            {group.unitPrice && (
              <div className="text-xs font-medium text-brand-600 dark:text-brand-400" title="Calculé sur la capacité indiquée dans le titre">
                soit {formatPrice(group.unitPrice.value)}{group.unitPrice.unit.slice(1)}
              </div>
            )}
            <div className="text-xs text-slate-500 dark:text-slate-400">
              chez <span className="font-medium text-slate-700 dark:text-slate-200">{best.merchantName}</span> · {CONDITION_META[best.condition].label.toLowerCase()}
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2 sm:flex-nowrap">
            <button
              onClick={() => toggleCompare(group)}
              disabled={!inCompare && compareFull}
              className={`btn-outline px-3 ${inCompare ? 'text-brand-600 ring-2 ring-brand-500/40 dark:text-brand-400' : ''}`}
              title={inCompare ? 'Retirer du comparateur' : compareFull ? 'Comparateur plein (4 produits)' : 'Comparer ce produit'}
              aria-pressed={inCompare}
            >
              <Scale className="size-4" />
              <span className="sr-only">Comparer</span>
            </button>
            <button onClick={() => setPreview(true)} className="btn-outline px-3" title="Aperçu de toutes les offres, prix actualisés">
              <Eye className="size-4" />
              <span className="sr-only xl:not-sr-only">Aperçu</span>
            </button>
            <WatchButton group={group} />
            <button
              onClick={() => addGroupToList(group)}
              className={inList ? 'btn-outline px-3 text-emerald-600 dark:text-emerald-400' : 'btn-outline px-3'}
              title="Ajouter à ma liste"
            >
              {inList ? <Check className="size-4" /> : <ListPlus className="size-4" />}
              <span className="sr-only xl:not-sr-only">{inList ? 'Ajouté' : 'Liste'}</span>
            </button>
            <a
              href={best.url}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="btn-primary px-3"
              title={best.isDemo ? 'Prix fictif : ouvre la recherche du marchand, pas une offre réelle' : undefined}
            >
              {best.isDemo ? 'Chercher' : 'Voir'} <ExternalLink className="size-4" />
              <span className="sr-only">chez {best.merchantName}</span>
            </a>
          </div>
        </div>
      </div>

      {(group.offers.length > 1 || hasSheet) && (
        <>
          <div className="flex overflow-hidden rounded-b-2xl border-t border-slate-100 dark:border-slate-800">
            {group.offers.length > 1 && (
              <PanelButton active={panel === 'offers'} onClick={() => setPanel((p) => (p === 'offers' ? null : 'offers'))}>
                {panel === 'offers' ? 'Masquer les offres' : `Comparer les ${group.offers.length} offres`}
              </PanelButton>
            )}
            {hasSheet && (
              <PanelButton active={panel === 'sheet'} onClick={() => setPanel((p) => (p === 'sheet' ? null : 'sheet'))}>
                <FileText className="size-4" /> Fiche technique
              </PanelButton>
            )}
          </div>
          {panel === 'offers' && (
            <div className="border-t border-slate-100 px-1 pb-2 dark:border-slate-800 sm:px-3">
              <OffersTable offers={group.offers} bestId={best.id} />
            </div>
          )}
          {panel === 'sheet' && hasSheet && (
            <div className="border-t border-slate-100 p-4 dark:border-slate-800 sm:p-5">
              {group.reference ? (
                <div>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-semibold">{group.reference.name}</h4>
                    <Link to={`/catalogue/${group.reference.id}`} className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">
                      Fiche complète du catalogue →
                    </Link>
                  </div>
                  <SpecTable specs={group.reference.specs} columns={2} />
                </div>
              ) : (
                <ProductSheetPanel query={sheetQuery!} />
              )}
            </div>
          )}
        </>
      )}
    </article>
  );
}
