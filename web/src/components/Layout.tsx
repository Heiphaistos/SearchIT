import { Bell, Database, Flame, ListChecks, Menu, Moon, Scale, Search, Sun, X } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { clearCompare, compareStore } from '../lib/compare';
import { listStore } from '../lib/list';
import { themeStore, toggleTheme } from '../lib/theme';
import { scheduleWatchCheck, watchStore } from '../lib/watch';
import { SearchBar } from './SearchBar';

export function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
      <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 text-white shadow-md shadow-brand-500/30">
        <Search className="size-4" strokeWidth={2.6} />
      </span>
      <span className="text-lg">
        Search<span className="gradient-text">IT</span>
      </span>
    </Link>
  );
}

function Badge({ n, tone = 'brand' }: { n: number; tone?: 'brand' | 'emerald' }) {
  if (!n) return null;
  return <span className={`chip px-1.5 text-white ${tone === 'emerald' ? 'bg-emerald-600' : 'bg-brand-600'}`}>{n}</span>;
}

/** Barre flottante du comparateur, visible dès qu'un produit est sélectionné. */
function CompareBar() {
  const items = compareStore.use();
  const location = useLocation();
  if (!items.length || location.pathname === '/comparer') return null;
  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="flex animate-fade-in items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-2 pl-4 shadow-2xl shadow-slate-900/20 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
        <Scale className="size-4 text-brand-500" />
        <span className="text-sm font-medium">
          {items.length} produit{items.length > 1 ? 's' : ''} à comparer
        </span>
        <Link to="/comparer" className="btn-primary px-3 py-1.5">
          Comparer
        </Link>
        <button onClick={clearCompare} className="btn-ghost size-8 p-0" aria-label="Vider le comparateur">
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<[string, string]> }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map(([to, label]) => (
          <li key={to}>
            {to.startsWith('/api/') ? (
              <a href={to} className="text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                {label}
              </a>
            ) : (
              <Link to={to} className="text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Layout() {
  const theme = themeStore.use();
  const list = listStore.use();
  const watch = watchStore.use();
  const location = useLocation();
  const [params] = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = location.pathname === '/';
  const listCount = list.reduce((n, i) => n + i.quantity, 0);
  const reached = watch.filter((w) => w.reached).length;

  // Vérification des prix suivis en arrière-plan (au plus toutes les 6 h).
  useEffect(() => scheduleWatchCheck(), []);
  // Le menu mobile se referme à chaque navigation.
  useEffect(() => setMenuOpen(false), [location.pathname, location.search]);

  const nav: Array<{ to: string; label: string; icon?: ReactNode; badge?: ReactNode; primary?: boolean }> = [
    { to: '/catalogue', label: 'Catalogue', icon: <Database className="size-4" /> },
    { to: '/bons-plans', label: 'Bons plans', icon: <Flame className="size-4 text-orange-500" /> },
    { to: '/suivis', label: 'Suivis', icon: <Bell className="size-4" />, badge: <Badge n={reached} tone="emerald" />, primary: true },
    { to: '/liste', label: 'Ma liste', icon: <ListChecks className="size-4" />, badge: <Badge n={listCount} />, primary: true },
    { to: '/sources', label: 'Marchands' },
    { to: '/developpeurs', label: 'API' },
  ];
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white'
    }`;

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:shadow">
        Aller au contenu
      </a>
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl backdrop-saturate-150 dark:border-white/[0.06] dark:bg-[#070b17]/75">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Logo />
          <div className="hidden min-w-0 flex-1 md:block">
            {!isHome && (
              <div className="max-w-xl">
                <SearchBar key={params.get('q')} initialQuery={params.get('q') ?? ''} />
              </div>
            )}
          </div>
          <nav className="ml-auto flex items-center gap-0.5" aria-label="Navigation principale">
            {nav.map((item) => (
              <NavLink key={item.to} to={item.to} className={(s) => `${linkClass(s)} ${item.primary ? '' : 'hidden lg:flex'}`} title={item.label}>
                {item.icon}
                <span className={item.icon ? 'hidden xl:inline' : ''}>{item.label}</span>
                {item.badge}
              </NavLink>
            ))}
            <button onClick={toggleTheme} className="btn-ghost size-9 p-0" aria-label={theme === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre'}>
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <button onClick={() => setMenuOpen((o) => !o)} className="btn-ghost size-9 p-0 lg:hidden" aria-label="Menu" aria-expanded={menuOpen}>
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </nav>
        </div>
        {menuOpen && (
          <nav className="animate-fade-in border-t border-slate-200/70 px-4 py-2 lg:hidden dark:border-slate-800/70" aria-label="Menu mobile">
            {[...nav, { to: '/comparer', label: 'Comparateur', icon: <Scale className="size-4" /> }].map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.icon}
                {item.label}
                {'badge' in item ? item.badge : null}
              </NavLink>
            ))}
          </nav>
        )}
        {!isHome && (
          <div className="px-4 pb-3 md:hidden">
            <SearchBar key={params.get('q')} initialQuery={params.get('q') ?? ''} />
          </div>
        )}
      </header>

      <main id="contenu" className="flex-1">
        <Outlet />
      </main>

      <CompareBar />

      <footer className="mt-8 border-t border-slate-200/70 bg-white/50 dark:border-white/[0.06] dark:bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-slate-500 dark:text-slate-400">
              Le comparateur de prix du high-tech neuf, reconditionné et d’occasion. Des centaines de marchands, un seul endroit.
            </p>
          </div>
          <FooterColumn title="Explorer" links={[['/catalogue', 'Catalogue'], ['/bons-plans', 'Bons plans'], ['/comparer', 'Comparateur'], ['/suivis', 'Suivis de prix'], ['/liste', 'Ma liste']]} />
          <FooterColumn
            title="Catégories"
            links={[['/recherche?category=gpu', 'Cartes graphiques'], ['/recherche?category=smartphone', 'Smartphones'], ['/recherche?category=laptop', 'PC portables'], ['/recherche?category=nas', 'NAS'], ['/recherche?category=server', 'Serveurs']]}
          />
          <FooterColumn title="SearchIT" links={[['/sources', 'Marchands & sources'], ['/developpeurs', 'API développeurs'], ['/api/v1/openapi.json', 'Spécification OpenAPI']]} />
        </div>
        <div className="border-t border-slate-200/70 dark:border-white/[0.06]">
          <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-slate-500 sm:px-6 dark:text-slate-400">
            Les prix et la disponibilité sont ceux communiqués par les marchands et peuvent évoluer : vérifiez toujours l’offre sur le site du vendeur. Certains liens
            peuvent être affiliés. Caractéristiques techniques indicatives.
          </p>
        </div>
      </footer>
    </div>
  );
}
