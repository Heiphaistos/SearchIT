import type { Condition, LookupResponse } from '@shared/types';
import { Check, Download, ExternalLink, Link2, ListChecks, Minus, Plus, RefreshCw, Store, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CategoryIcon } from '../components/CategoryIcon';
import { ConditionBadge, DemoBanner, EmptyState, ErrorBox } from '../components/ui';
import { api } from '../lib/api';
import { formatPrice, plural } from '../lib/format';
import { clearList, decodeShared, importItems, listStore, removeListItem, shareUrl, updateListItem, type ListItem } from '../lib/list';

const CONDITION_CHOICES: Array<{ id: string; label: string; value: Condition[] }> = [
  { id: 'new-refurb', label: 'Neuf ou reconditionné', value: ['new', 'refurbished'] },
  { id: 'new', label: 'Neuf uniquement', value: ['new'] },
  { id: 'refurb', label: 'Reconditionné uniquement', value: ['refurbished'] },
  { id: 'all', label: 'Tout, occasion comprise', value: ['new', 'refurbished', 'used'] },
];

function exportCsv(items: ListItem[], result: LookupResponse | null) {
  const byRef = new Map(result?.results.map((r) => [r.ref, r]));
  // Les titres viennent des marchands : on neutralise les formules (« =… ») à l'ouverture dans Excel.
  const cell = (v: unknown) => {
    const text = String(v ?? '');
    return `"${(/^[=+\-@\t\r]/.test(text) ? `'${text}` : text).replace(/"/g, '""')}"`;
  };
  const num = (n: number | undefined | null) => (n === undefined || n === null ? '' : n.toFixed(2).replace('.', ','));
  const rows = [
    ['Produit', 'Quantité', 'Marchand', 'État', 'Prix unitaire (€)', 'Livraison (€)', 'Total ligne (€)', 'Lien'],
    ...items.map((i) => {
      const r = byRef.get(i.ref);
      return [i.title, i.quantity, r?.best?.merchantName, r?.best?.condition, num(r?.best?.price), num(r?.best?.shipping), num(r?.found ? r.lineTotal : null), r?.best?.url];
    }),
    ['Total', '', '', '', '', '', num(result?.bestTotal), ''],
  ];
  // Point-virgule + BOM : ouverture directe dans Excel en français.
  const csv = '\uFEFF' + rows.map((r) => r.map(cell).join(';')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: `searchit-liste-${new Date().toISOString().slice(0, 10)}.csv` });
  a.click();
  URL.revokeObjectURL(url);
}

function ImportBanner() {
  const [qs, setQs] = useSearchParams();
  const data = qs.get('import');
  const shared = data ? decodeShared(data) : null;
  if (!data) return null;
  const done = (mode?: 'replace' | 'merge') => {
    if (mode && shared) importItems(shared, mode);
    qs.delete('import');
    setQs(qs, { replace: true });
  };
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm dark:border-brand-500/30 dark:bg-brand-500/10">
      {shared ? (
        <>
          <p>
            On vous a partagé une liste de <strong>{plural(shared.length, 'produit')}</strong> : {shared.slice(0, 3).map((i) => i.title).join(', ')}
            {shared.length > 3 ? '…' : ''}
          </p>
          <div className="flex gap-2">
            <button className="btn-primary" onClick={() => done('replace')}>Remplacer ma liste</button>
            <button className="btn-outline" onClick={() => done('merge')}>Ajouter</button>
            <button className="btn-ghost" onClick={() => done()}>Ignorer</button>
          </div>
        </>
      ) : (
        <>
          <p>Ce lien de partage est invalide.</p>
          <button className="btn-ghost" onClick={() => done()}>Fermer</button>
        </>
      )}
    </div>
  );
}

export function ListPage() {
  const items = listStore.use();
  const [copied, setCopied] = useState(false);
  const [choice, setChoice] = useState(CONDITION_CHOICES[0].id);
  const [result, setResult] = useState<LookupResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const itemsKey = items.map((i) => `${i.ref}:${i.quantity}`).join('|');

  const compute = useCallback(async () => {
    const current = listStore.get();
    if (!current.length) {
      setResult(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const conditions = CONDITION_CHOICES.find((c) => c.id === choice)!.value;
      setResult(
        await api.lookup({
          items: current.map((i) => ({
            ref: i.ref,
            query: i.query,
            // « other » n'est pas un filtre utile : on laisse le serveur détecter la catégorie.
            category: i.category === 'other' ? undefined : i.category,
            gtin: i.gtin,
            quantity: i.quantity,
          })),
          conditions,
          alternatives: 5,
        }),
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [choice]);

  useEffect(() => {
    document.title = 'Ma liste – SearchIT';
    void compute();
  }, [compute, itemsKey]);

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ImportBanner />
        <EmptyState icon={<ListChecks className="size-6" />} title="Votre liste est vide">
          Ajoutez des produits depuis les résultats de recherche (bouton « Liste ») pour calculer le meilleur prix total, par exemple pour tous les composants d’un PC.
          <div className="mt-5">
            <Link to="/" className="btn-primary">
              Rechercher des produits
            </Link>
          </div>
        </EmptyState>
      </div>
    );
  }

  const byRef = new Map(result?.results.map((r) => [r.ref, r]));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Ma liste</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {plural(items.length, 'produit')} · les prix sont recalculés en direct chez tous les marchands.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={choice} onChange={(e) => setChoice(e.target.value)} className="input w-auto cursor-pointer" aria-label="États acceptés">
            {CONDITION_CHOICES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              void navigator.clipboard?.writeText(shareUrl(items)).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              });
            }}
            className="btn-outline"
            title="Copier un lien qui recrée cette liste"
          >
            {copied ? <Check className="size-4 text-emerald-600" /> : <Link2 className="size-4" />} {copied ? 'Lien copié' : 'Partager'}
          </button>
          <button onClick={() => exportCsv(items, result)} className="btn-outline" title="Exporter en CSV (Excel)">
            <Download className="size-4" /> CSV
          </button>
          <button onClick={() => void compute()} disabled={loading} className="btn-outline">
            <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} /> Actualiser
          </button>
          <button
            onClick={() => {
              if (confirm('Vider la liste ?')) clearList();
            }}
            className="btn-ghost text-red-600 dark:text-red-400"
          >
            <Trash2 className="size-4" /> Vider
          </button>
        </div>
      </div>

      <ImportBanner />
      {result?.demo && (
        <div className="mb-5">
          <DemoBanner />
        </div>
      )}
      {error && (
        <div className="mb-5">
          <ErrorBox message={error} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {items.map((item) => {
            const r = byRef.get(item.ref);
            return (
              <div key={item.ref} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800">
                  <CategoryIcon category={item.category} className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium leading-snug">{item.title}</h3>
                  {r?.best ? (
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Store className="size-3.5" /> {r.best.merchantName}
                      <ConditionBadge condition={r.best.condition} grade={r.best.conditionGrade} />
                      {r.alternatives.length > 0 && <span className="text-xs">· {plural(r.alternatives.length, 'autre offre', 'autres offres')}</span>}
                    </div>
                  ) : (
                    result && !loading && <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">Aucune offre disponible avec ces critères.</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700">
                    <button className="btn-ghost size-8 p-0" aria-label="Diminuer" onClick={() => (item.quantity > 1 ? updateListItem(item.ref, { quantity: item.quantity - 1 }) : removeListItem(item.ref))}>
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm tabular-nums">{item.quantity}</span>
                    <button className="btn-ghost size-8 p-0" aria-label="Augmenter" onClick={() => updateListItem(item.ref, { quantity: item.quantity + 1 })}>
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <div className="w-24 text-right">
                    <div className="font-semibold tabular-nums">{r?.found ? formatPrice(r.lineTotal) : '—'}</div>
                    {r?.best && item.quantity > 1 && <div className="text-xs text-slate-500">{formatPrice(r.best.price)} / u.</div>}
                  </div>
                  {r?.best ? (
                    <a href={r.best.url} target="_blank" rel="nofollow sponsored noopener noreferrer" className="btn-primary size-9 p-0" aria-label="Voir l’offre">
                      <ExternalLink className="size-4" />
                    </a>
                  ) : (
                    <span className="size-9" />
                  )}
                  <button onClick={() => removeListItem(item.ref)} className="btn-ghost size-9 p-0 text-slate-400 hover:text-red-600" aria-label="Retirer">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="card p-5">
            <div className="text-sm text-slate-500 dark:text-slate-400">Total optimal (multi-marchands)</div>
            <div className="mt-1 text-3xl font-bold tabular-nums tracking-tight">{result ? formatPrice(result.bestTotal) : '…'}</div>
            {result && result.missing.length > 0 && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">{plural(result.missing.length, 'produit')} sans offre, non compté.</p>
            )}
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Chaque produit au meilleur prix, frais de port inclus, en achetant chez plusieurs marchands.</p>
          </div>

          {result && result.byMerchant.length > 0 && (
            <div className="card p-5">
              <h2 className="text-sm font-semibold">Tout acheter chez un seul marchand</h2>
              <ul className="mt-3 space-y-2">
                {result.byMerchant.slice(0, 8).map((m) => {
                  const complete = m.covered === items.length;
                  return (
                    <li key={m.merchantId} className="flex items-center justify-between gap-2 text-sm">
                      <span className="flex min-w-0 items-center gap-2">
                        <Store className="size-3.5 shrink-0 text-slate-400" />
                        <span className="truncate">{m.merchantName}</span>
                        {!complete && (
                          <span className="chip bg-slate-100 text-slate-500 dark:bg-slate-800">
                            {m.covered}/{items.length}
                          </span>
                        )}
                      </span>
                      <span className={`tabular-nums ${complete ? 'font-semibold' : 'text-slate-500'}`}>{formatPrice(m.total)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
