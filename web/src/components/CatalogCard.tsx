import { getCategory } from '@shared/categories';
import type { CatalogItem } from '@shared/types';
import { ArrowUpRight, Recycle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/format';
import { GROUP_STYLE } from '../lib/groups';
import { CategoryIcon } from './CategoryIcon';

/** Carte d'un produit du catalogue de référence (quelques caractéristiques clés). */
export function CatalogCard({ product, compact = false }: { product: CatalogItem; compact?: boolean }) {
  const cat = getCategory(product.category);
  const style = GROUP_STYLE[cat.group];
  const specs = Object.entries(product.specs).slice(0, compact ? 2 : 4);
  return (
    <Link to={`/catalogue/${product.id}`} className="card card-hover group flex flex-col overflow-hidden">
      <div className={`relative flex items-center gap-3 bg-gradient-to-br p-4 ${style.tile}`}>
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl shadow-md ${style.icon}`}>
          <CategoryIcon category={product.category} className="size-5" />
        </span>
        <div className="min-w-0">
          <div className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
            {product.brand}
            {product.family ? ` · ${product.family}` : ''}
          </div>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{product.name}</h3>
        </div>
        <ArrowUpRight className="absolute right-3 top-3 size-4 text-slate-400 opacity-0 transition group-hover:opacity-100" />
      </div>
      {!compact && specs.length > 0 && (
        <dl className="flex-1 space-y-1 px-4 py-3 text-xs">
          {specs.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3">
              <dt className="text-slate-500 dark:text-slate-400">{k}</dt>
              <dd className="truncate text-right font-medium">{String(v)}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-4 py-2.5 text-xs dark:border-white/[0.06]">
        <span className="text-slate-500 dark:text-slate-400">
          {product.year ?? '—'}
          {product.refurbishable && <Recycle className="ml-1.5 inline size-3.5 text-emerald-500" aria-label="Existe en reconditionné" />}
        </span>
        {product.msrp ? (
          <span className="text-slate-500 dark:text-slate-400">
            Lancement <strong className="font-semibold text-slate-800 dark:text-slate-100">{formatPrice(product.msrp)}</strong>
          </span>
        ) : (
          <span className="text-slate-400">{cat.label}</span>
        )}
      </div>
    </Link>
  );
}
