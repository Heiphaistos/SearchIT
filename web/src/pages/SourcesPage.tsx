import type { MerchantInfo } from '@shared/types';
import { CircleCheck, CircleX, ExternalLink, Recycle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DemoBanner, ErrorBox, Spinner } from '../components/ui';
import { api } from '../lib/api';

type Merchant = MerchantInfo & { details?: Record<string, unknown> };

export function SourcesPage() {
  const [data, setData] = useState<{ demo: boolean; merchants: Merchant[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Marchands – SearchIT';
    api.merchants().then(setData, (e: Error) => setError(e.message));
  }, []);

  const active = data?.merchants.filter((m) => m.enabled).length ?? 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Marchands &amp; sources de prix</h1>
      <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-400">
        SearchIT se branche sur les <strong>API officielles</strong> (Amazon, eBay, AliExpress) et sur les <strong>flux produits d’affiliation</strong> fournis par
        les enseignes (Fnac, LDLC, Leclerc, Back Market, Cdiscount…) via Awin, Effinity, Kwanko ou leur propre programme. Chaque source s’active en
        renseignant ses identifiants dans le fichier <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">.env</code> du serveur.
      </p>

      {error && (
        <div className="mt-6">
          <ErrorBox message={error} />
        </div>
      )}
      {!data && !error && <Spinner />}
      {data && (
        <>
          <div className="mt-6">{data.demo ? <DemoBanner /> : <p className="text-sm font-medium text-emerald-600">{active} source(s) connectée(s).</p>}</div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Marchand</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Connexion</th>
                  <th className="px-4 py-3 font-medium">État</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">Variables à définir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900/50">
                {data.merchants.map((m) => (
                  <tr key={m.id} className="align-top">
                    <td className="px-4 py-3">
                      <a href={m.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium hover:text-brand-600">
                        {m.name} <ExternalLink className="size-3 text-slate-400" />
                      </a>
                      {m.refurbished && (
                        <span className="ml-2 inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                          <Recycle className="size-3" /> reconditionné
                        </span>
                      )}
                      {m.notes && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{m.notes}</p>}
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">{m.connection === 'api' ? 'API officielle' : 'Flux d’affiliation'}</td>
                    <td className="px-4 py-3">
                      {m.enabled ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <CircleCheck className="size-4" /> Actif
                          {typeof m.details?.offers === 'number' && <span className="text-xs text-slate-500">({m.details.offers.toLocaleString('fr-FR')} offres)</span>}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400">
                          <CircleX className="size-4" /> Non configuré
                        </span>
                      )}
                      {typeof m.details?.lastError === 'string' && <p className="mt-1 text-xs text-red-600">{m.details.lastError}</p>}
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {m.requiredEnv.map((v) => (
                          <code key={v} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">
                            {v}
                          </code>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Un autre marchand ? Ajoutez-le dans <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">server/config/custom-merchants.json</code> avec l’URL de
            son flux produits : il apparaîtra automatiquement ici et dans les résultats.
          </p>
        </>
      )}
    </div>
  );
}
