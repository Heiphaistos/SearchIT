import { Activity, KeyRound, LogOut, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { ErrorBox } from '../components/ui';
import { api } from '../lib/api';
import { createStore } from '../lib/store';

// Tableau de bord d'exploitation (jeton ADMIN_TOKEN du serveur, conservé dans ce navigateur).
const tokenStore = createStore<string>('searchit:admin-token', '');

interface Stats {
  now: string;
  uptimeSeconds: number;
  memoryMb: number;
  node: string;
  demo: boolean;
  engine: { searches: number; lookups: number; startedAt: string; recentErrors: Array<{ at: string; connector: string; status: string; error: string }> };
  history: { products: number; queries: number };
  currencies: { currencies: number; fetchedAt: string | null };
  topQueries: Array<{ q: string; count: number; last: string }>;
  sources: Array<{ id: string; merchantId: string; enabled: boolean; details: Record<string, unknown> | null }>;
}

const fmtDate = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleString('fr-FR') : '—');
const uptime = (s: number) => `${Math.floor(s / 86400)} j ${Math.floor((s % 86400) / 3600)} h ${Math.floor((s % 3600) / 60)} min`;

function Tile({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card p-4">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

export function AdminPage() {
  const token = tokenStore.use();
  const [draft, setDraft] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      setStats((await api.adminStats(token)) as unknown as Stats);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setStats(null);
    }
  }, [token]);

  useEffect(() => {
    document.title = 'Administration – SearchIT';
    void load();
  }, [load]);

  if (!token || (error && !stats)) {
    const submit = (e: FormEvent) => {
      e.preventDefault();
      tokenStore.set(draft.trim());
    };
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <form onSubmit={submit} className="card p-6">
          <h1 className="flex items-center gap-2 text-lg font-semibold">
            <KeyRound className="size-5 text-brand-500" /> Administration
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Saisissez le jeton défini par ADMIN_TOKEN dans le fichier .env du serveur.</p>
          {error && (
            <div className="mt-4">
              <ErrorBox message={error} />
            </div>
          )}
          <input type="password" className="input mt-4" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Jeton d’administration" autoComplete="current-password" />
          <button className="btn-primary mt-3 w-full" type="submit">
            Se connecter
          </button>
        </form>
      </div>
    );
  }

  if (!stats) return null;
  const gs = stats.sources.find((s) => s.id === 'google-shopping')?.details as { providers?: Array<{ id: string; usedToday: number; dailyLimit: number }> } | null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Activity className="size-6 text-brand-500" /> Tableau de bord
        </h1>
        <div className="flex gap-2">
          <button className="btn-outline" onClick={() => void load()}>
            <RefreshCw className="size-4" /> Actualiser
          </button>
          <button className="btn-ghost" onClick={() => tokenStore.set('')}>
            <LogOut className="size-4" /> Déconnexion
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Recherches depuis le démarrage" value={stats.engine.searches.toLocaleString('fr-FR')} sub={`${stats.engine.lookups} appels lookup (configurateur, listes)`} />
        <Tile label="Produits dans l’historique" value={stats.history.products.toLocaleString('fr-FR')} sub={`${stats.history.queries} recherches distinctes`} />
        <Tile label="En service depuis" value={uptime(stats.uptimeSeconds)} sub={`${stats.memoryMb} Mo de RAM · Node ${stats.node}`} />
        <Tile label="Mode" value={stats.demo ? 'Démo' : 'Réel'} sub={`Taux BCE : ${fmtDate(stats.currencies.fetchedAt)}`} />
      </div>

      {gs?.providers && gs.providers.length > 0 && (
        <div className="card mt-6 p-5">
          <h2 className="text-sm font-semibold">Quotas Google Shopping (aujourd’hui)</h2>
          <div className="mt-3 space-y-3">
            {gs.providers.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between text-sm">
                  <span>{p.id}</span>
                  <span className="tabular-nums">
                    {p.usedToday} / {p.dailyLimit}
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className={`h-full rounded-full ${p.usedToday >= p.dailyLimit ? 'bg-red-500' : 'bg-brand-500'}`} style={{ width: `${Math.min(100, (p.usedToday / p.dailyLimit) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <h2 className="border-b border-slate-100 px-5 py-3 text-sm font-semibold dark:border-slate-800">Recherches populaires</h2>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats.topQueries.map((q) => (
                <tr key={q.q}>
                  <td className="px-5 py-2">{q.q}</td>
                  <td className="px-5 py-2 text-right tabular-nums text-slate-500">{q.count}</td>
                </tr>
              ))}
              {!stats.topQueries.length && (
                <tr>
                  <td className="px-5 py-4 text-slate-500">Aucune recherche enregistrée pour l’instant.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card overflow-hidden">
          <h2 className="border-b border-slate-100 px-5 py-3 text-sm font-semibold dark:border-slate-800">Erreurs récentes des sources</h2>
          <ul className="max-h-96 divide-y divide-slate-100 overflow-y-auto text-sm dark:divide-slate-800">
            {stats.engine.recentErrors.map((e, i) => (
              <li key={i} className="px-5 py-2">
                <div className="flex justify-between gap-2 text-xs text-slate-500">
                  <span className="font-medium text-slate-700 dark:text-slate-200">{e.connector}</span>
                  <span>{fmtDate(e.at)}</span>
                </div>
                <div className="mt-0.5 break-words text-red-600 dark:text-red-400">{e.error}</div>
              </li>
            ))}
            {!stats.engine.recentErrors.length && <li className="px-5 py-4 text-slate-500">Aucune erreur depuis le démarrage.</li>}
          </ul>
        </div>
      </div>

      <div className="card mt-6 overflow-x-auto">
        <h2 className="border-b border-slate-100 px-5 py-3 text-sm font-semibold dark:border-slate-800">Sources</h2>
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-2 font-medium">Source</th>
              <th className="px-5 py-2 font-medium">Active</th>
              <th className="px-5 py-2 font-medium">Détails</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {stats.sources.map((s) => (
              <tr key={s.id} className="align-top">
                <td className="px-5 py-2 font-medium">{s.id}</td>
                <td className="px-5 py-2">{s.enabled ? '✅' : '—'}</td>
                <td className="px-5 py-2 font-mono text-xs text-slate-500">{s.details ? JSON.stringify(s.details) : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
