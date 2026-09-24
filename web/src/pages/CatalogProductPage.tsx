import { getCategory } from '@shared/categories';
import type { CatalogItem, ReferenceInfo } from '@shared/types';
import { ArrowLeft, CalendarDays, Recycle, Search, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CatalogCard } from '../components/CatalogCard';
import { CategoryIcon } from '../components/CategoryIcon';
import { EmptyState, SpecTable, Spinner } from '../components/ui';
import { api } from '../lib/api';
import { formatPrice } from '../lib/format';
import { GROUP_STYLE } from '../lib/groups';

export function CatalogProductPage() {
  const { id = '' } = useParams();
  const [data, setData] = useState<{ product: CatalogItem; reference: ReferenceInfo; similar: CatalogItem[] } | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    setData(null);
    setMissing(false);
    api.catalogItem(id).then(
      (d) => {
        setData(d);
        document.title = `${d.product.name} – Caractéristiques et prix – SearchIT`;
      },
      () => setMissing(true),
    );
  }, [id]);

  if (missing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="Produit introuvable">
          <Link to="/catalogue" className="btn-primary mt-4">Retour au catalogue</Link>
        </EmptyState>
      </div>
    );
  }
  if (!data) return <Spinner />;
  const { product: p, reference, similar } = data;
  const cat = getCategory(p.category);
  const style = GROUP_STYLE[cat.group];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link to={`/catalogue?category=${p.category}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white">
        <ArrowLeft className="size-4" /> {cat.label}
      </Link>

      <div className={`card mt-4 overflow-hidden bg-gradient-to-br ${style.tile}`}>
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
          <span className={`grid size-20 shrink-0 place-items-center rounded-3xl shadow-xl ${style.icon}`}>
            <CategoryIcon category={p.category} className="size-10" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {p.brand}
              {p.family && ` · ${p.family}`}
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{p.name}</h1>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {p.year && (
                <span className="chip bg-white/80 py-1 text-slate-700 ring-1 ring-slate-200 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10">
                  <CalendarDays className="size-3.5" /> Sortie en {p.year}
                </span>
              )}
              {p.msrp && (
                <span className="chip bg-white/80 py-1 text-slate-700 ring-1 ring-slate-200 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10">
                  <Tag className="size-3.5" /> Prix de lancement {formatPrice(p.msrp)}
                </span>
              )}
              {p.refurbishable && (
                <span className="chip bg-emerald-100 py-1 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
                  <Recycle className="size-3.5" /> Existe en reconditionné
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:w-56">
            <Link to={`/recherche?q=${encodeURIComponent(p.name)}`} className="btn-primary py-3 text-base">
              <Search className="size-4" /> Voir les prix
            </Link>
            {p.refurbishable && (
              <Link to={`/recherche?q=${encodeURIComponent(p.name)}&conditions=refurbished,used`} className="btn-outline">
                Reconditionné / occasion
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <section className="card p-6">
          <h2 className="mb-3 text-lg font-semibold">Caractéristiques techniques</h2>
          <SpecTable specs={reference.specs} columns={2} />
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Caractéristiques du modèle de référence ; elles peuvent varier selon les versions constructeurs. Le prix de lancement est indicatif.
          </p>
        </section>
        <aside>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Produits similaires</h2>
          <div className="space-y-3">
            {similar.slice(0, 5).map((s) => (
              <CatalogCard key={s.id} product={s} compact />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
