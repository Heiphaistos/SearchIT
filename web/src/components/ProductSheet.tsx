import { ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Spinner } from './ui';

interface Sheet {
  found: boolean;
  title?: string;
  brand?: string;
  mpn?: string;
  image?: string;
  gallery?: string[];
  summary?: string;
  specs?: Array<{ group: string; items: Array<{ name: string; value: string }> }>;
  url?: string;
}

/** Fiche technique (Open Icecat) chargée à la demande. */
export function ProductSheetPanel({ query }: { query: string }) {
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/product-sheet?${query}`, { signal: controller.signal })
      .then((r) => r.json() as Promise<Sheet>)
      .then(setSheet, () => !controller.signal.aborted && setSheet({ found: false }));
    return () => controller.abort();
  }, [query]);

  if (!sheet) return <Spinner label="Recherche de la fiche technique…" />;
  if (!sheet.found) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Aucune fiche technique ouverte n’est disponible pour ce produit.</p>;
  }

  const groups = showAll ? sheet.specs ?? [] : (sheet.specs ?? []).slice(0, 4);
  return (
    <div className="grid gap-5 md:grid-cols-[200px_1fr]">
      {sheet.image && (
        <div className="grid aspect-square place-items-center rounded-xl bg-white p-3 ring-1 ring-slate-100 dark:ring-slate-800">
          <img src={sheet.image} alt={sheet.title ?? ''} loading="lazy" className="max-h-full object-contain" />
        </div>
      )}
      <div className="min-w-0">
        <h4 className="font-semibold">{sheet.title}</h4>
        {sheet.mpn && <p className="text-xs text-slate-500">Réf. fabricant : {sheet.mpn}</p>}
        {sheet.summary && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{sheet.summary}</p>}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {groups.map((g) => (
            <div key={g.group}>
              <h5 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{g.group}</h5>
              <dl className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
                {g.items.slice(0, 10).map((it) => (
                  <div key={it.name} className="flex justify-between gap-3 py-1">
                    <dt className="text-slate-500 dark:text-slate-400">{it.name}</dt>
                    <dd className="text-right font-medium">{it.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          {(sheet.specs?.length ?? 0) > 4 && (
            <button onClick={() => setShowAll((v) => !v)} className="font-medium text-brand-600 hover:underline dark:text-brand-400">
              {showAll ? 'Moins de caractéristiques' : `Toutes les caractéristiques (${sheet.specs!.length} groupes)`}
            </button>
          )}
          {sheet.url && (
            <a href={sheet.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300">
              Données Open Icecat <ExternalLink className="size-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
