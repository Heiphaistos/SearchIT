import { Bell, Bot, Cpu, ExternalLink, Flame, Scale, Search, Wrench, type LucideIcon } from 'lucide-react';
import { ENGINEPC_URL } from '../lib/enginepc';
import { usePageMeta } from '../lib/meta';

const INVITE_URL = (import.meta.env.VITE_DISCORD_INVITE_URL as string | undefined)?.trim();

const COMMANDS: Array<{ icon: LucideIcon; cmd: string; example: string; text: string }> = [
  { icon: Search, cmd: '/pc price', example: '/pc price query:RTX 5070 condition:Reconditionné', text: 'Meilleurs prix neuf, reconditionné et occasion, nombre de marchands, économie possible et plus bas prix relevé.' },
  { icon: Scale, cmd: '/pc compare', example: '/pc compare a:RTX 5070 b:RX 9070 XT', text: 'Jusqu’à 4 produits côte à côte : caractéristiques du catalogue et meilleures offres.' },
  { icon: Cpu, cmd: '/pc specs', example: '/pc specs query:Intel Wi-Fi 7 BE200', text: 'Fiche technique du catalogue de référence SearchIT.' },
  { icon: Wrench, cmd: '/pc build', example: '/pc build link:https://enginepc.heiphaistos.org/partage/…', text: 'Chiffre une configuration EnginePC pièce par pièce : total multi-marchands et total chez un seul marchand.' },
  { icon: Bell, cmd: '/pc watch add', example: '/pc watch add query:Ryzen 7 9800X3D target:399', text: 'Alerte dans un salon ou en message privé dès que le prix passe sous la cible.' },
  { icon: Flame, cmd: '/pc deals', example: '/pc deals category:gpu', text: 'Plus fortes baisses réellement relevées. Publication automatique possible dans un salon.' },
];

export function DiscordPage() {
  usePageMeta('Bot Discord et EnginePC', 'SearchIT est relié au bot Discord HeiphaisBot et au configurateur EnginePC : prix, comparaisons, suivis et configurations depuis Discord.');

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center gap-4">
        <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/30">
          <Bot className="size-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">SearchIT sur Discord</h1>
          <p className="text-slate-600 dark:text-slate-400">Le bot HeiphaisBot relie SearchIT et le configurateur EnginePC à votre serveur Discord.</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {INVITE_URL && /^https:\/\//.test(INVITE_URL) && (
          <a href={INVITE_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <Bot className="size-4" /> Ajouter le bot à mon serveur
          </a>
        )}
        <a href={ENGINEPC_URL} target="_blank" rel="noopener noreferrer" className="btn-outline">
          <Cpu className="size-4" /> Ouvrir EnginePC <ExternalLink className="size-3.5" />
        </a>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {COMMANDS.map(({ icon: Icon, cmd, example, text }) => (
          <article key={cmd} className="card p-5">
            <div className="flex items-center gap-2">
              <Icon className="size-4 text-brand-600 dark:text-brand-400" />
              <h2 className="font-mono text-sm font-semibold">{cmd}</h2>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{text}</p>
            <code className="mt-3 block overflow-x-auto whitespace-nowrap rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-700 dark:bg-white/5 dark:text-slate-300">{example}</code>
          </article>
        ))}
      </div>

      <section className="card mt-10 p-6">
        <h2 className="text-lg font-semibold">Comment les trois applications sont reliées</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li>
            <strong>EnginePC</strong> génère ou vérifie une configuration, puis demande les prix live à SearchIT (<code>POST /api/v1/prices/lookup</code>).
          </li>
          <li>
            Le bouton « Envoyer au comparateur » d’EnginePC ouvre la configuration dans <strong>Ma liste</strong> de SearchIT ; « Copier pour Discord » prépare la
            commande <code>/pc build</code>.
          </li>
          <li>
            <strong>HeiphaisBot</strong> interroge l’API SearchIT (<code>/api/v1/search</code>, <code>/api/v1/lookup</code>, <code>/api/v1/catalog</code>,{' '}
            <code>/api/deals</code>) et l’index du catalogue EnginePC pour répondre dans Discord, suivre les prix et publier les bons plans.
          </li>
        </ol>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Côté bot : variables <code>SEARCHIT_URL</code>, <code>SEARCHIT_API_KEY</code> (une valeur de <code>API_KEYS</code>) et <code>ENGINEPC_URL</code>, ou
          paramètres du module « PC &amp; prix » dans le panel.
        </p>
      </section>
    </div>
  );
}
