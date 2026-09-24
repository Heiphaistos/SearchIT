import { Bell, Flame, ListChecks, Menu, Moon, Scale, Search, Sun, X } from 'lucide-react';
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
    { to: '/bons-plans', label: 'Bons plans', icon: <Flame className="size-4 text-orange-500" /> },
    { to: '/suivis', label: 'Suivis', icon: <Bell className="size-4" />, badge: <Badge n={reached} tone="emerald" />, primary: true },
    { to: '/liste', label: 'Ma liste', icon: <ListChecks className="size-4" />, badge: <Badge n={listCount} />, primary: true },
    { to: '/sources', label: 'Marchands' },
    { to: '/developpeurs', label: 'API' },
  ];
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
    }`;

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:shadow">
        Aller au contenu
      </a>
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/80">
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

      <footer className="border-t border-slate-200 py-8 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            SearchIT compare les prix du high-tech neuf, reconditionné et d’occasion. Les prix et la disponibilité sont ceux communiqués par les marchands et
            peuvent évoluer : vérifiez toujours l’offre sur le site du vendeur.
          </p>
          <div className="flex shrink-0 flex-wrap gap-4">
            <Link to="/bons-plans" className="hover:text-slate-900 dark:hover:text-white">Bons plans</Link>
            <Link to="/comparer" className="hover:text-slate-900 dark:hover:text-white">Comparateur</Link>
            <Link to="/sources" className="hover:text-slate-900 dark:hover:text-white">Marchands</Link>
            <Link to="/developpeurs" className="hover:text-slate-900 dark:hover:text-white">API</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
