import { Bell, BellRing, ExternalLink, RefreshCw, Trash2, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CategoryIcon } from '../components/CategoryIcon';
import { EmptyState, ErrorBox } from '../components/ui';
import { formatPrice, plural } from '../lib/format';
import { checkWatchlist, setTarget, unwatch, watchMetaStore, watchStore } from '../lib/watch';

const timeAgo = (iso?: string) => {
  if (!iso) return 'jamais';
  const min = Math.round((Date.now() - Date.parse(iso)) / 60_000);
  if (min < 1) return 'à l’instant';
  if (min < 60) return `il y a ${min} min`;
  const h = Math.round(min / 60);
  return h < 24 ? `il y a ${h} h` : `il y a ${Math.round(h / 24)} j`;
};

export function WatchPage() {
  const items = watchStore.use();
  const meta = watchMetaStore.use();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState(typeof Notification === 'undefined' ? 'unsupported' : Notification.permission);

  useEffect(() => {
    document.title = 'Suivis de prix – SearchIT';
  }, []);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      await checkWatchlist();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState icon={<Bell className="size-6" />} title="Aucun prix suivi">
          Cliquez sur la cloche d’un produit pour choisir un prix cible : SearchIT revérifie les prix chez tous les marchands et vous prévient quand la cible est atteinte.
          <div className="mt-5">
            <Link to="/bons-plans" className="btn-primary">
              Voir les bons plans
            </Link>
          </div>
        </EmptyState>
      </div>
    );
  }

  const reached = items.filter((w) => w.reached);
  const sorted = [...items].sort((a, b) => Number(b.reached) - Number(a.reached) || a.title.localeCompare(b.title));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Suivis de prix</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {plural(items.length, 'produit suivi', 'produits suivis')} · {reached.length} cible{reached.length > 1 ? 's' : ''} atteinte{reached.length > 1 ? 's' : ''} · dernière
            vérification {timeAgo(meta.lastRun)}
          </p>
        </div>
        <div className="flex gap-2">
          {permission === 'default' && (
            <button className="btn-outline" onClick={() => void Notification.requestPermission().then(setPermission)}>
              <BellRing className="size-4" /> Activer les notifications
            </button>
          )}
          <button className="btn-primary" onClick={() => void refresh()} disabled={loading}>
            <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} /> Vérifier maintenant
          </button>
        </div>
      </div>
      {error && (
        <div className="mb-4">
          <ErrorBox message={error} />
        </div>
      )}
      <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
        Les prix sont revérifiés automatiquement à chaque visite (au plus toutes les 6 h). Les suivis sont enregistrés dans ce navigateur uniquement.
      </p>

      <div className="space-y-3">
        {sorted.map((w) => {
          const diff = w.lastPrice !== undefined ? w.lastPrice - w.priceWhenAdded : 0;
          return (
            <div key={w.ref} className={`card flex flex-col gap-4 p-4 sm:flex-row sm:items-center ${w.reached ? 'ring-2 ring-emerald-500/60' : ''}`}>
              <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800">
                {w.imageUrl ? <img src={w.imageUrl} alt="" className="size-full object-contain p-1" referrerPolicy="no-referrer" /> : <CategoryIcon category={w.category} className="size-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <Link to={`/recherche?q=${encodeURIComponent(w.query)}`} className="font-medium leading-snug hover:text-brand-600">
                  {w.title}
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                  {w.reached ? (
                    <span className="chip bg-emerald-600 text-white">Cible atteinte</span>
                  ) : (
                    <span>
                      Encore {formatPrice(Math.max(0, (w.lastPrice ?? w.priceWhenAdded) - w.target))} à gagner
                    </span>
                  )}
                  {diff < 0 && (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <TrendingDown className="size-3" /> {formatPrice(-diff)} depuis le suivi
                    </span>
                  )}
                  {w.lowestSeen !== undefined && <span>Plus bas vu : {formatPrice(w.lowestSeen)}</span>}
                  <span>Vérifié {timeAgo(w.lastChecked)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="text-xs text-slate-500">
                  Cible
                  <input
                    className="input mt-0.5 w-24 px-2 py-1 text-right"
                    inputMode="decimal"
                    defaultValue={w.target}
                    onBlur={(e) => {
                      const v = Number(e.target.value.replace(',', '.'));
                      if (Number.isFinite(v) && v > 0) setTarget(w.ref, v);
                    }}
                  />
                </label>
                <div className="w-24 text-right">
                  <div className="text-xs text-slate-500">Actuel</div>
                  <div className="font-semibold tabular-nums">{w.lastPrice !== undefined ? formatPrice(w.lastPrice) : '—'}</div>
                  {w.merchant && <div className="truncate text-xs text-slate-500">{w.merchant}</div>}
                </div>
                {w.url ? (
                  <a href={w.url} target="_blank" rel="nofollow sponsored noopener noreferrer" className="btn-primary size-9 p-0" aria-label="Voir l’offre">
                    <ExternalLink className="size-4" />
                  </a>
                ) : (
                  <span className="size-9" />
                )}
                <button onClick={() => unwatch(w.ref)} className="btn-ghost size-9 p-0 text-slate-400 hover:text-red-600" aria-label="Ne plus suivre">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
