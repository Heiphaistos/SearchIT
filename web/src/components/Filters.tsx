import type { CategoryId, Condition, SearchParams, SearchResponse } from '@shared/types';
import { useState, type ReactNode } from 'react';
import { CONDITION_META } from '../lib/format';

interface Props {
  params: SearchParams;
  facets: SearchResponse['facets'] | undefined;
  onChange: (patch: Partial<SearchParams>) => void;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-slate-100 py-4 last:border-0 dark:border-slate-800">
      <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</h3>
      {children}
    </section>
  );
}

function CheckRow({ checked, onChange, label, count }: { checked: boolean; onChange: () => void; label: ReactNode; count?: number }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-1 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60">
      <input type="checkbox" checked={checked} onChange={onChange} className="size-4 rounded accent-brand-600" />
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-xs tabular-nums text-slate-400">{count}</span>}
    </label>
  );
}

function toggle<T>(list: T[] | undefined, value: T): T[] | undefined {
  const next = list?.includes(value) ? list.filter((v) => v !== value) : [...(list ?? []), value];
  return next.length ? next : undefined;
}

function PriceRange({ params, facets, onChange }: Props) {
  const [min, setMin] = useState(params.minPrice?.toString() ?? '');
  const [max, setMax] = useState(params.maxPrice?.toString() ?? '');
  const apply = () => {
    const toNum = (s: string) => (s.trim() === '' || Number.isNaN(Number(s.replace(',', '.'))) ? undefined : Math.max(0, Number(s.replace(',', '.'))));
    const minPrice = toNum(min);
    const maxPrice = toNum(max);
    if (minPrice !== params.minPrice || maxPrice !== params.maxPrice) onChange({ minPrice, maxPrice });
  };
  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
    >
      <input className="input px-2.5" inputMode="decimal" placeholder={facets ? String(facets.price.min) : 'Min'} value={min} onChange={(e) => setMin(e.target.value)} onBlur={apply} aria-label="Prix minimum" />
      <span className="text-slate-400">–</span>
      <input className="input px-2.5" inputMode="decimal" placeholder={facets ? String(facets.price.max) : 'Max'} value={max} onChange={(e) => setMax(e.target.value)} onBlur={apply} aria-label="Prix maximum" />
    </form>
  );
}

export function Filters({ params, facets, onChange }: Props) {
  const conditionCounts = new Map(facets?.conditions.map((f) => [f.id, f.count]));
  const conditions: Condition[] = ['new', 'refurbished', 'used'];

  return (
    <div className="card px-4 py-1">
      <Section title="État">
        {conditions.map((c) => (
          <CheckRow
            key={c}
            checked={params.conditions?.includes(c) ?? false}
            onChange={() => onChange({ conditions: toggle(params.conditions, c) })}
            label={
              <span className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${c === 'new' ? 'bg-sky-500' : c === 'refurbished' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {CONDITION_META[c].label}
              </span>
            }
            count={conditionCounts.get(c) ?? 0}
          />
        ))}
      </Section>

      <Section title="Prix total (€)">
        <PriceRange key={`${params.minPrice}-${params.maxPrice}`} params={params} facets={facets} onChange={onChange} />
      </Section>

      {facets && facets.categories.length > 1 && (
        <Section title="Catégorie">
          <div className="max-h-60 overflow-y-auto">
            {facets.categories.map((f) => (
              <CheckRow
                key={f.id}
                checked={params.category === f.id}
                onChange={() => onChange({ category: params.category === f.id ? undefined : (f.id as CategoryId) })}
                label={f.label}
                count={f.count}
              />
            ))}
          </div>
        </Section>
      )}

      {facets && facets.merchants.length > 0 && (
        <Section title="Marchands">
          <div className="max-h-72 overflow-y-auto">
            {facets.merchants.map((f) => (
              <CheckRow key={f.id} checked={params.merchants?.includes(f.id) ?? false} onChange={() => onChange({ merchants: toggle(params.merchants, f.id) })} label={f.label} count={f.count} />
            ))}
          </div>
        </Section>
      )}

      <Section title="Options">
        <CheckRow checked={params.inStockOnly ?? false} onChange={() => onChange({ inStockOnly: !params.inStockOnly || undefined })} label="En stock uniquement" />
        <CheckRow
          checked={params.hideAccessories === false}
          onChange={() => onChange({ hideAccessories: params.hideAccessories === false ? undefined : false })}
          label="Inclure les accessoires (coques, câbles…)"
        />
      </Section>
    </div>
  );
}
