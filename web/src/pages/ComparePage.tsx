import { getCategory } from '@shared/categories';
import type { ProductGroup } from '@shared/types';
import { ExternalLink, Scale, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CategoryIcon } from '../components/CategoryIcon';
import { EmptyState } from '../components/ui';
import { clearCompare, compareStore, removeFromCompare } from '../lib/compare';
import { formatPrice } from '../lib/format';

interface Sheet {
  found: boolean;
  image?: string;
  specs?: Array<{ group: string; items: Array<{ name: string; value: string }> }>;
}

function sheetQuery(g: ProductGroup): string | null {
  if (g.gtin) return `gtin=${g.gtin}`;
  const o = g.offers.find((x) => x.mpn && (x.brand || g.brand));
  return o ? new URLSearchParams({ brand: (o.brand ?? g.brand)!, mpn: o.mpn! }).toString() : null;
}

export function ComparePage() {
  const items = compareStore.use();
  const [sheets, setSheets] = useState<Record<string, Sheet>>({});
  const requested = useRef(new Set<string>());

  useEffect(() => {
    document.title = 'Comparer – SearchIT';
    for (const g of items) {
      const q = sheetQuery(g);
      if (!q || requested.current.has(g.key)) continue;
      requested.current.add(g.key);
      fetch(`/api/product-sheet?${q}`)
        .then((r) => r.json() as Promise<Sheet>)
        .then((s) => setSheets((prev) => ({ ...prev, [g.key]: s })), () => undefined);
    }
  }, [items]);

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState icon={<Scale className="size-6" />} title="Aucun produit à comparer">
          Cliquez sur la balance d’un produit dans les résultats (jusqu’à 4) pour les comparer côte à côte : prix neuf, reconditionné, occasion et caractéristiques.
        </EmptyState>
      </div>
    );
  }

  // Lignes de caractéristiques communes, dans l'ordre d'apparition.
  const specNames: string[] = [];
  const specValue = new Map<string, Map<string, string>>();
  for (const g of items) {
    const values = new Map<string, string>();
    for (const grp of sheets[g.key]?.specs ?? []) for (const it of grp.items) {
      values.set(it.name, it.value);
      if (!specNames.includes(it.name)) specNames.push(it.name);
    }
    specValue.set(g.key, values);
  }
  const shownSpecs = specNames.filter((n) => items.filter((g) => specValue.get(g.key)?.has(n)).length >= Math.min(2, items.length)).slice(0, 40);

  const priceRow = (label: string, pick: (g: ProductGroup) => number | undefined) => {
    const values = items.map(pick);
    const min = Math.min(...values.filter((v): v is number => v !== undefined));
    return (
      <tr>
        <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">{label}</th>
        {values.map((v, i) => (
          <td key={items[i].key} className={`px-3 py-2 text-center tabular-nums ${v === min && items.length > 1 ? 'font-bold text-emerald-600 dark:text-emerald-400' : ''}`}>
            {v === undefined ? '—' : formatPrice(v)}
          </td>
        ))}
      </tr>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Scale className="size-6 text-brand-500" /> Comparer {items.length} produits
        </h1>
        <button className="btn-ghost text-red-600 dark:text-red-400" onClick={clearCompare}>
          <Trash2 className="size-4" /> Tout retirer
        </button>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] table-fixed text-sm">
          <thead>
            <tr className="align-top">
              <th className="w-40 px-3 py-3" />
              {items.map((g) => (
                <th key={g.key} className="px-3 py-3 text-left font-normal">
                  <div className="relative">
                    <button onClick={() => removeFromCompare(g.key)} className="absolute -right-1 -top-1 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800" aria-label="Retirer">
                      <X className="size-4" />
                    </button>
                    <div className="mb-2 grid h-24 place-items-center overflow-hidden rounded-xl bg-white ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-800">
                      {(g.imageUrl ?? sheets[g.key]?.image) ? (
                        <img src={g.imageUrl ?? sheets[g.key]?.image} alt="" className="max-h-full object-contain p-2" referrerPolicy="no-referrer" />
                      ) : (
                        <CategoryIcon category={g.category} className="size-8 text-brand-500" />
                      )}
                    </div>
                    <div className="text-xs text-slate-500">{getCategory(g.category).label}</div>
                    <Link to={`/recherche?q=${encodeURIComponent(g.title)}`} className="line-clamp-3 pr-4 font-semibold leading-snug hover:text-brand-600">
                      {g.title}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {priceRow('Meilleur prix', (g) => g.bestOffer.totalPrice)}
            {priceRow('Neuf dès', (g) => g.bestNew?.totalPrice)}
            {priceRow('Reconditionné dès', (g) => g.bestRefurbished?.totalPrice)}
            {priceRow('Occasion dès', (g) => g.bestUsed?.totalPrice)}
            {items.some((g) => g.unitPrice) && (
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">Prix au To / Go</th>
                {items.map((g) => (
                  <td key={g.key} className="px-3 py-2 text-center tabular-nums">
                    {g.unitPrice ? `${formatPrice(g.unitPrice.value)}${g.unitPrice.unit.slice(1)}` : '—'}
                  </td>
                ))}
              </tr>
            )}
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">Marchands</th>
              {items.map((g) => (
                <td key={g.key} className="px-3 py-2 text-center">{g.merchantCount}</td>
              ))}
            </tr>
            {shownSpecs.map((name) => (
              <tr key={name}>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">{name}</th>
                {items.map((g) => (
                  <td key={g.key} className="px-3 py-2 text-center">{specValue.get(g.key)?.get(name) ?? '—'}</td>
                ))}
              </tr>
            ))}
            <tr>
              <th />
              {items.map((g) => (
                <td key={g.key} className="px-3 py-3 text-center">
                  <a href={g.bestOffer.url} target="_blank" rel="nofollow sponsored noopener noreferrer" className="btn-primary px-3 py-1.5 text-xs">
                    {g.bestOffer.merchantName} <ExternalLink className="size-3.5" />
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      {!shownSpecs.length && (
        <p className="mt-3 text-xs text-slate-500">Les caractéristiques techniques s’affichent lorsque les produits ont un code EAN connu dans le catalogue ouvert Icecat.</p>
      )}
    </div>
  );
}
