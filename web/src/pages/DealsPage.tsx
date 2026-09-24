import { CATEGORIES } from '@shared/categories';
import type { Deal } from '@shared/types';
import { Flame, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CategoryIcon } from '../components/CategoryIcon';
import { Sparkline } from '../components/PriceHistory';
import { EmptyState, ErrorBox, PageHeader } from '../components/ui';
import { api } from '../lib/api';
import { formatPrice } from '../lib/format';

function DealCard({ deal }: { deal: Deal }) {
  const history = { lowest: deal.current, lowestDate: '', since: deal.points[0]?.d ?? '', days: deal.points.length, points: deal.points };
  return (
    <Link to={`/recherche?q=${encodeURIComponent(deal.title)}`} className="card card-hover group flex flex-col p-4">
      <div className="flex items-start gap-3">
        <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800">
          {deal.imageUrl ? <img src={deal.imageUrl} alt="" loading="lazy" referrerPolicy="no-referrer" className="size-full object-contain p-1" /> : <CategoryIcon category={deal.category} className="size-6" />}
        </div>
        <h3 className="line-clamp-3 flex-1 text-sm font-medium leading-snug group-hover:text-brand-600">{deal.title}</h3>
      </div>
      <div className="mt-4 flex items-end justify-between gap-2">
        <div>
          <div className="text-xl font-bold tabular-nums">{formatPrice(deal.current)}</div>
          <div className="text-xs text-slate-500 line-through">{formatPrice(deal.average)}</div>
        </div>
        <Sparkline history={history} />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="chip bg-emerald-600 text-white">
          <TrendingDown className="size-3" /> −{deal.dropPercent.toLocaleString('fr-FR')} %
        </span>
        {deal.atLowest && <span className="chip bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">Prix le plus bas</span>}
      </div>
    </Link>
  );
}

export function DealsPage() {
  const [qs, setQs] = useSearchParams();
  const category = qs.get('category') ?? '';
  const [data, setData] = useState<{ deals: Deal[]; demo: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Bons plans – SearchIT';
    api.deals(category || undefined).then(setData, (e: Error) => setError(e.message));
  }, [category]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <PageHeader
        icon={<Flame className="size-6" />}
        title="Bons plans"
        subtitle="Les plus fortes baisses par rapport à la moyenne des 30 derniers jours, calculées sur les prix réellement relevés par SearchIT."
        actions={
        <select className="input w-auto cursor-pointer" value={category} onChange={(e) => setQs(e.target.value ? { category: e.target.value } : {})} aria-label="Catégorie">
          <option value="">Toutes les catégories</option>
          {CATEGORIES.filter((c) => c.id !== 'other').map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        }
      />
      {error && <ErrorBox message={error} />}
      {data && !data.deals.length && (
        <EmptyState icon={<Flame className="size-6" />} title="Pas encore de bons plans détectés">
          {data.demo
            ? 'Les bons plans sont calculés à partir des vrais prix relevés au fil des recherches. Connectez une source de prix (par exemple Google Shopping) pour les voir apparaître.'
            : 'SearchIT a besoin de quelques jours d’historique pour repérer les vraies baisses de prix. Revenez bientôt !'}
        </EmptyState>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data?.deals.map((d) => <DealCard key={d.key} deal={d} />)}
      </div>
    </div>
  );
}
