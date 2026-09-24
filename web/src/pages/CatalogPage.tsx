import { CATEGORIES, CATEGORY_GROUPS, getCategory, isCategoryId } from '@shared/categories';
import type { CatalogListResponse, CategoryGroup, CategoryId } from '@shared/types';
import { Database, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CatalogCard } from '../components/CatalogCard';
import { CategoryIcon } from '../components/CategoryIcon';
import { EmptyState, ErrorBox, PageHeader } from '../components/ui';
import { api } from '../lib/api';
import { plural } from '../lib/format';

const GROUPS: CategoryGroup[] = ['components', 'devices', 'infrastructure', 'peripherals', 'accessories'];
const SORTS = [
  { id: 'recent', label: 'Plus récents' },
  { id: 'name', label: 'Nom (A → Z)' },
  { id: 'msrp-asc', label: 'Prix de lancement croissant' },
  { id: 'msrp-desc', label: 'Prix de lancement décroissant' },
];
const TAG_LABELS: Record<string, string> = {
  gaming: 'Gaming', ia: 'IA', bureautique: 'Bureautique', creation: 'Création', serveur: 'Serveur', homelab: 'Homelab', nas: 'NAS', pro: 'Pro',
  budget: 'Petit budget', mobile: 'Mobilité', photo: 'Photo', sport: 'Sport', robuste: 'Robuste', reseau: 'Réseau', etudiant: 'Étudiant',
};

export function CatalogPage() {
  const [qs, setQs] = useSearchParams();
  const category = isCategoryId(qs.get('category')) ? (qs.get('category') as CategoryId) : undefined;
  const brand = qs.get('brand') ?? '';
  const tag = qs.get('tag') ?? '';
  const sort = qs.get('sort') ?? 'recent';
  const page = Number(qs.get('page')) || 1;
  const q = qs.get('q') ?? '';
  const [draft, setDraft] = useState(q);
  const [data, setData] = useState<CatalogListResponse | null>(null);
  const [counts, setCounts] = useState<Map<CategoryId, number>>(new Map());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = `${category ? getCategory(category).label + ' – ' : ''}Catalogue – SearchIT`;
    const controller = new AbortController();
    api.catalog({ category, brand, tag, sort, page, q, pageSize: 48 }, controller.signal).then(setData, (e: Error) => !controller.signal.aborted && setError(e.message));
    return () => controller.abort();
  }, [category, brand, tag, sort, page, q]);

  useEffect(() => {
    api.catalogStats().then((s) => setCounts(new Map(s.categories.map((c) => [c.id, c.count]))), () => undefined);
  }, []);

  const set = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(qs);
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    if (!('page' in patch)) next.delete('page');
    setQs(next);
    if ('page' in patch) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const total = useMemo(() => [...counts.values()].reduce((a, b) => a + b, 0), [counts]);
  const pages = data ? Math.ceil(data.total / data.pageSize) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader
        icon={<Database className="size-6" />}
        title={category ? getCategory(category).label : 'Catalogue'}
        subtitle={`Base de référence de ${plural(total, 'produit')} réels : caractéristiques techniques, génération et prix de lancement. Cliquez sur un produit pour voir ses prix du moment.`}
      />

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="min-w-0 space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              set({ q: draft.trim() || undefined });
            }}
            className="relative"
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9" placeholder="Filtrer le catalogue…" value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="Filtrer le catalogue" />
          </form>
          <nav className="flex gap-2 overflow-x-auto pb-1 scrollbar-none lg:block lg:space-y-5 lg:overflow-visible">
            <button onClick={() => set({ category: undefined, brand: undefined })} className={`shrink-0 rounded-lg px-3 py-1.5 text-left text-sm font-medium lg:w-full ${!category ? 'bg-brand-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-white/[0.06]'}`}>
              Tout le catalogue <span className="opacity-70">({total})</span>
            </button>
            {GROUPS.map((g) => (
              <div key={g} className="contents lg:block">
                <div className="mb-1 hidden px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 lg:block">{CATEGORY_GROUPS[g]}</div>
                {CATEGORIES.filter((c) => c.group === g && counts.get(c.id)).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => set({ category: c.id, brand: undefined })}
                    className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm lg:w-full ${
                      category === c.id ? 'bg-brand-50 font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    <CategoryIcon category={c.id} className="size-4 shrink-0 opacity-70" />
                    <span className="flex-1 whitespace-nowrap">{c.label}</span>
                    <span className="text-xs tabular-nums text-slate-400">{counts.get(c.id)}</span>
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        <section className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <select className="input w-auto cursor-pointer" value={sort} onChange={(e) => set({ sort: e.target.value })} aria-label="Trier">
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            {data && data.facets.brands.length > 1 && (
              <select className="input w-auto cursor-pointer" value={brand} onChange={(e) => set({ brand: e.target.value || undefined })} aria-label="Marque">
                <option value="">Toutes les marques</option>
                {data.facets.brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.id} ({b.count})
                  </option>
                ))}
              </select>
            )}
            <span className="ml-auto text-sm text-slate-500">{data && plural(data.total, 'produit')}</span>
          </div>
          {data && data.facets.tags.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-1.5">
              {data.facets.tags.slice(0, 12).map((t) => (
                <button
                  key={t.id}
                  onClick={() => set({ tag: tag === t.id ? undefined : t.id })}
                  className={`chip py-1 transition ${tag === t.id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-white/10'}`}
                >
                  {TAG_LABELS[t.id] ?? t.id} <span className="opacity-60">{t.count}</span>
                </button>
              ))}
              {(q || tag || brand) && (
                <button onClick={() => { setDraft(''); set({ q: undefined, tag: undefined, brand: undefined }); }} className="chip py-1 text-slate-500 hover:text-slate-800">
                  <X className="size-3" /> Réinitialiser
                </button>
              )}
            </div>
          )}
          {error && <ErrorBox message={error} />}
          {!data && !error && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} className="card h-48 p-4">
                  <div className="skeleton h-10 w-2/3" />
                  <div className="skeleton mt-4 h-3 w-full" />
                  <div className="skeleton mt-2 h-3 w-5/6" />
                  <div className="skeleton mt-2 h-3 w-4/6" />
                </div>
              ))}
            </div>
          )}
          {data && !data.products.length && <EmptyState title="Aucun produit">Essayez un autre filtre ou une autre catégorie.</EmptyState>}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data?.products.map((p) => <CatalogCard key={p.id} product={p} />)}
          </div>
          {pages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
              <button className="btn-outline" disabled={page <= 1} onClick={() => set({ page: String(page - 1) })}>
                Précédent
              </button>
              <span className="px-2 text-sm text-slate-500">
                Page {page} / {pages}
              </span>
              <button className="btn-outline" disabled={page >= pages} onClick={() => set({ page: String(page + 1) })}>
                Suivant
              </button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
