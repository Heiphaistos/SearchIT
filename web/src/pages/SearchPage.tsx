import { fromExternalCategory, getCategory } from '@shared/categories';
import type { Condition, SearchParams, SearchResponse, SortKey } from '@shared/types';
import { PackageSearch, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filters } from '../components/Filters';
import { ProductCard } from '../components/ProductCard';
import { EmptyState, ErrorBox } from '../components/ui';
import { api, searchParamsToQuery } from '../lib/api';
import { plural } from '../lib/format';
import { usePageMeta } from '../lib/meta';

const SORTS: Array<{ id: SortKey; label: string }> = [
  { id: 'relevance', label: 'Pertinence' },
  { id: 'price-asc', label: 'Prix croissant' },
  { id: 'price-desc', label: 'Prix décroissant' },
  { id: 'savings', label: 'Plus gros écarts de prix' },
  { id: 'offers', label: 'Nombre d’offres' },
  { id: 'unit-price', label: 'Prix au To / au Go' },
];

function ResultSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Interrogation des marchands…">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="card flex animate-pulse gap-4 p-5">
          <div className="size-24 shrink-0 rounded-xl bg-slate-200 dark:bg-slate-800 sm:size-28" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="flex gap-2">
              <div className="h-5 w-28 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-5 w-36 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
          <div className="hidden w-40 space-y-2 py-1 sm:block">
            <div className="ml-auto h-3 w-20 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="ml-auto h-7 w-28 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
      <p className="text-center text-sm text-slate-500">Interrogation des marchands…</p>
    </div>
  );
}

function readParams(qs: URLSearchParams): SearchParams {
  const list = (key: string) => qs.get(key)?.split(',').filter(Boolean);
  const num = (key: string) => (qs.get(key) !== null && qs.get(key) !== '' && !Number.isNaN(Number(qs.get(key))) ? Number(qs.get(key)) : undefined);
  // Liens entrants (ex. EnginePC) : catégories externes converties, EAN utilisé si « q » est vide.
  return {
    q: (qs.get('q') || qs.get('ean') || '').trim().slice(0, 200),
    category: fromExternalCategory(qs.get('category')),
    conditions: list('conditions')?.filter((c): c is Condition => c === 'new' || c === 'refurbished' || c === 'used'),
    merchants: list('merchants'),
    minPrice: num('minPrice'),
    maxPrice: num('maxPrice'),
    inStockOnly: qs.get('inStock') === 'true' || undefined,
    hideAccessories: qs.get('hideAccessories') === 'false' ? false : undefined,
    sort: SORTS.find((s) => s.id === qs.get('sort'))?.id ?? 'relevance',
    page: num('page') ?? 1,
  };
}

export function SearchPage() {
  const [qs, setQs] = useSearchParams();
  const params = useMemo(() => readParams(qs), [qs]);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const heading = params.q || (params.category ? getCategory(params.category).label : '');
  usePageMeta(heading ? `Prix ${heading}` : 'Recherche', heading ? `Comparez les prix de « ${heading} » en neuf, reconditionné et occasion chez les marchands français.` : undefined);

  useEffect(() => {
    if (!params.q && !params.category) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    api
      .search(params, controller.signal)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (controller.signal.aborted) return;
        setError(err.message);
        setLoading(false);
      });
    return () => controller.abort();
  }, [params]);

  const update = (patch: Partial<SearchParams>) => {
    setQs(searchParamsToQuery({ ...params, ...patch, page: patch.page ?? 1 }));
    if (patch.page) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!params.q && !params.category) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState icon={<PackageSearch className="size-6" />} title="Que cherchez-vous ?">
          Tapez un produit dans la barre de recherche : composant, smartphone, NAS, câble…
        </EmptyState>
      </div>
    );
  }

  // Le tri au To / au Go n'a de sens que pour le stockage et la mémoire.
  const showUnitSort = Boolean(data?.groups.some((g) => g.unitPrice));
  const failed = data?.sources.filter((s) => s.status !== 'ok') ?? [];
  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0;
  const activeFilters = [
    params.category && params.q && { key: 'category', label: getCategory(params.category).label, clear: { category: undefined } },
    ...(params.conditions ?? []).map((c) => ({ key: c, label: { new: 'Neuf', refurbished: 'Reconditionné', used: 'Occasion' }[c], clear: { conditions: params.conditions!.filter((x) => x !== c) } })),
    (params.minPrice !== undefined || params.maxPrice !== undefined) && {
      key: 'price',
      label: `${params.minPrice ?? 0} € – ${params.maxPrice ?? '∞'} €`,
      clear: { minPrice: undefined, maxPrice: undefined },
    },
    ...(params.merchants ?? []).map((m) => ({
      key: m,
      label: data?.facets.merchants.find((f) => f.id === m)?.label ?? m,
      clear: { merchants: params.merchants!.filter((x) => x !== m) },
    })),
  ].filter(Boolean) as Array<{ key: string; label: string; clear: Partial<SearchParams> }>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {params.q ? (
              <>
                Résultats pour « <span className="gradient-text">{params.q}</span> »
              </>
            ) : (
              <span className="gradient-text">{getCategory(params.category!).label}</span>
            )}
          </h1>
          {data && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {plural(data.total, 'produit')} · {plural(data.groups.reduce((n, g) => n + g.offers.length, 0), 'offre')} sur cette page ·{' '}
              {plural(data.sources.filter((s) => s.status === 'ok').length, 'source')} interrogée{data.sources.filter((s) => s.status === 'ok').length > 1 ? 's' : ''} en{' '}
              {data.tookMs} ms
              {data.detectedCategory && !params.category && <> · catégorie détectée : {getCategory(data.detectedCategory).label}</>}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters((s) => !s)} className="btn-outline lg:hidden">
            <SlidersHorizontal className="size-4" /> Filtres
          </button>
          <label className="sr-only" htmlFor="sort">
            Trier par
          </label>
          <select id="sort" value={params.sort} onChange={(e) => update({ sort: e.target.value as SortKey })} className="input w-auto cursor-pointer pr-8">
            {SORTS.filter((s) => s.id !== 'unit-price' || showUnitSort || params.sort === 'unit-price').map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {activeFilters.map((f) => (
            <button key={f.key} onClick={() => update(f.clear)} className="chip bg-brand-50 py-1 text-brand-700 hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-300">
              {f.label} <X className="size-3" />
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="lg:sticky lg:top-20">
            <Filters params={params} facets={data?.facets} onChange={update} />
          </div>
        </aside>

        <section className="min-w-0 space-y-4" aria-busy={loading}>
          {failed.length > 0 && (
            <ErrorBox
              message={`${plural(failed.length, 'source')} n’a pas répondu : ${failed.map((s) => `${s.merchantId} (${s.error ?? s.status})`).join(', ')}. Les résultats peuvent être incomplets.`}
            />
          )}
          {error && <ErrorBox message={error} />}
          {loading && !data && <ResultSkeleton />}
          <div className={`space-y-4 transition ${loading && data ? 'opacity-50' : ''}`}>
            {data?.groups.map((g) => <ProductCard key={g.key} group={g} />)}
          </div>
          {data && !data.groups.length && !loading && (
            <EmptyState icon={<PackageSearch className="size-6" />} title="Aucun produit trouvé">
              Essayez une recherche plus courte (ex. « RTX 5070 » plutôt que le titre complet), retirez des filtres ou activez les accessoires.
            </EmptyState>
          )}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 pt-2" aria-label="Pagination">
              <button className="btn-outline" disabled={params.page === 1} onClick={() => update({ page: (params.page ?? 1) - 1 })}>
                Précédent
              </button>
              <span className="px-2 text-sm text-slate-500">
                Page {params.page} / {totalPages}
              </span>
              <button className="btn-outline" disabled={(params.page ?? 1) >= totalPages} onClick={() => update({ page: (params.page ?? 1) + 1 })}>
                Suivant
              </button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
