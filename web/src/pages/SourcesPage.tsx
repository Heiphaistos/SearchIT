import type { MerchantInfo } from '@shared/types';
import { CircleCheck, CircleX, ExternalLink, Recycle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DemoBanner, ErrorBox, Spinner } from '../components/ui';
import { api } from '../lib/api';

type Merchant = MerchantInfo & { details?: Record<string, unknown> };

const CONNECTION_LABELS: Record<MerchantInfo['connection'], string> = {
  api: 'API officielle',
  'affiliate-feed': 'Flux d’affiliation',
  'public-store': 'Boutique (catalogue public)',
  aggregator: 'Agrégateur multi-marchands',
  demo: 'Démo',
};

// Sources gratuites, de la plus rentable à la plus spécialisée.
const FREE_SOURCES = [
  {
    name: 'Serper.dev – Google Shopping',
    env: 'SERPER_API_KEY',
    url: 'https://serper.dev',
    effort: '2 min · e-mail',
    free: '2 500 requêtes offertes',
    text: 'La source la plus rentable : une seule clé remonte les prix de centaines de marchands français (Fnac, LDLC, Boulanger, Darty, Back Market, Leclerc…).',
    highlight: true,
  },
  { name: 'SearchApi.io – Google Shopping', env: 'SEARCHAPI_API_KEY', url: 'https://www.searchapi.io', effort: '2 min · e-mail', free: '100 requêtes offertes', text: 'Fournisseur de secours quand le quota Serper est atteint.' },
  { name: 'SerpApi – Google Shopping', env: 'SERPAPI_API_KEY', url: 'https://serpapi.com', effort: '2 min · e-mail', free: 'Offre gratuite mensuelle', text: 'Second fournisseur de secours, mêmes données.' },
  { name: 'eBay Browse API', env: 'EBAY_CLIENT_ID + EBAY_CLIENT_SECRET', url: 'https://developer.ebay.com', effort: '10 min', free: '5 000 appels / jour', text: 'Neuf, reconditionné certifié et occasion sur eBay.fr. Ajouter EBAY_CAMPAIGN_ID (eBay Partner Network) pour être commissionné.' },
  { name: 'AliExpress Affiliate API', env: 'ALIEXPRESS_APP_KEY + _APP_SECRET + _TRACKING_ID', url: 'https://portals.aliexpress.com', effort: '1-3 jours (validation)', free: 'Gratuit', text: 'Câbles, chargeurs, pâte thermique, accessoires à petit prix.' },
  { name: 'Open Icecat', env: 'ICECAT_USERNAME (facultatif)', url: 'https://icecat.biz', effort: 'Aucun (actif)', free: 'Gratuit', text: 'Fiches techniques et photos par EAN – déjà actif avec le compte public.' },
  { name: 'Taux de change BCE', env: '—', url: 'https://www.ecb.europa.eu', effort: 'Aucun (actif)', free: 'Gratuit', text: 'Conversion automatique en euros des offres en dollars ou livres – déjà actif.' },
  { name: 'Boutiques Shopify / WooCommerce', env: 'SHOPIFY_STORES / WOOCOMMERCE_STORES', url: 'https://github.com/Heiphaistos/SearchIT#sources-gratuites', effort: '1 ligne par boutique', free: 'Gratuit, sans clé', text: 'Catalogue public de n’importe quelle boutique Shopify ou WooCommerce, synchronisé automatiquement.' },
  { name: 'Réseaux d’affiliation (Awin, Effinity, Kwanko)', env: 'FEED_<MARCHAND>_URL', url: 'https://www.awin.com/fr', effort: 'Inscription + validation par marchand', free: 'Gratuit', text: 'Catalogues complets de Fnac, Darty, Boulanger, Cdiscount, Rakuten, Back Market… avec liens commissionnés.' },
];

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

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Sources gratuites à activer</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Inscris-toi, puis colle la clé dans le fichier <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">.env</code> du serveur et redémarre SearchIT.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FREE_SOURCES.map((src) => (
            <a
              key={src.name}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`card flex flex-col p-4 transition hover:-translate-y-0.5 hover:shadow-md ${src.highlight ? 'ring-2 ring-brand-500/60' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold leading-snug">{src.name}</h3>
                <ExternalLink className="size-3.5 shrink-0 text-slate-400" />
              </div>
              <p className="mt-1.5 flex-1 text-sm text-slate-600 dark:text-slate-400">{src.text}</p>
              <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                <span className="chip bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">{src.free}</span>
                <span className="chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{src.effort}</span>
              </div>
              <code className="mt-2 block truncate text-xs text-slate-500">{src.env}</code>
            </a>
          ))}
        </div>
      </section>

      <h2 className="mt-10 text-lg font-semibold">État des connexions</h2>
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
                    <td className="hidden px-4 py-3 sm:table-cell">
                      {CONNECTION_LABELS[m.connection]}
                      {Array.isArray(m.details?.providers) &&
                        (m.details.providers as Array<{ id: string; usedToday: number; dailyLimit: number }>).map((p) => (
                          <div key={p.id} className="text-xs text-slate-500">
                            {p.id} : {p.usedToday}/{p.dailyLimit} requêtes aujourd’hui
                          </div>
                        ))}
                    </td>
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
                        {m.connection === 'public-store' && <span className="text-xs text-slate-500">Aucune (catalogue public)</span>}
                      {m.connection === 'aggregator' && <span className="mb-1 block text-xs text-slate-500">Une seule suffit :</span>}
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
