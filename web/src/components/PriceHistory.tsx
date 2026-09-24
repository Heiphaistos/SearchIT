import type { PriceHistory as History } from '@shared/types';
import { TrendingDown } from 'lucide-react';
import { formatPrice } from '../lib/format';

const dateFr = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

/** Mini-graphique du meilleur prix relevé chaque jour. */
export function Sparkline({ history, className = '' }: { history: History; className?: string }) {
  const values = history.points.map((p) => p.min);
  if (values.length < 2) return null;
  const w = 96;
  const h = 28;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - 3 - ((v - min) / span) * (h - 6)] as const);
  const path = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className={className} role="img" aria-label={`Évolution du prix sur ${history.days} jours`}>
      <path d={`${path} L${w},${h} L0,${h} Z`} className="fill-brand-500/10" />
      <path d={path} fill="none" className="stroke-brand-500" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lx} cy={ly} r="2.5" className="fill-brand-500" />
    </svg>
  );
}

/** Badge « prix le plus bas » + mini-graphique, affiché quand SearchIT suit le produit depuis au moins 2 jours. */
export function PriceHistoryBadge({ history, current }: { history?: History; current: number }) {
  if (!history || history.days < 2) return null;
  const atLowest = current <= history.lowest + 0.01;
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <Sparkline history={history} />
      {atLowest ? (
        <span className="chip bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
          <TrendingDown className="size-3" /> Prix le plus bas depuis {history.days} jours
        </span>
      ) : (
        <span className="text-slate-500 dark:text-slate-400">
          Plus bas relevé : <strong className="font-semibold text-slate-700 dark:text-slate-200">{formatPrice(history.lowest)}</strong> le {dateFr(history.lowestDate)}
        </span>
      )}
    </div>
  );
}
