import { ListChecks, Moon, Search, Sun } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { listStore } from '../lib/list';
import { themeStore, toggleTheme } from '../lib/theme';
import { SearchBar } from './SearchBar';

const NAV = [
  { to: '/liste', label: 'Ma liste' },
  { to: '/sources', label: 'Marchands' },
  { to: '/developpeurs', label: 'API' },
];

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 text-white shadow-md shadow-brand-500/30">
        <Search className="size-4" strokeWidth={2.6} />
      </span>
      <span className="text-lg">
        Search<span className="gradient-text">IT</span>
      </span>
    </Link>
  );
}

export function Layout() {
  const theme = themeStore.use();
  const list = listStore.use();
  const location = useLocation();
  const [params] = useSearchParams();
  const isHome = location.pathname === '/';
  const listCount = list.reduce((n, i) => n + i.quantity, 0);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Logo />
          <div className="hidden flex-1 md:block">{!isHome && <div className="max-w-xl"><SearchBar key={params.get('q')} initialQuery={params.get('q') ?? ''} /></div>}</div>
          <nav className="ml-auto flex items-center gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  } ${item.to === '/liste' ? '' : 'hidden sm:block'}`
                }
              >
                {item.to === '/liste' ? (
                  <span className="flex items-center gap-1.5">
                    <ListChecks className="size-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                    {listCount > 0 && <span className="chip bg-brand-600 px-1.5 text-white">{listCount}</span>}
                  </span>
                ) : (
                  item.label
                )}
              </NavLink>
            ))}
            <button onClick={toggleTheme} className="btn-ghost size-9 p-0" aria-label={theme === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre'}>
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
          </nav>
        </div>
        {!isHome && (
          <div className="px-4 pb-3 md:hidden">
            <SearchBar key={params.get('q')} initialQuery={params.get('q') ?? ''} />
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 py-8 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            SearchIT compare les prix du high-tech neuf, reconditionné et d’occasion. Les prix et la disponibilité sont ceux communiqués par les marchands et
            peuvent évoluer : vérifiez toujours l’offre sur le site du vendeur.
          </p>
          <div className="flex shrink-0 gap-4">
            <Link to="/sources" className="hover:text-slate-900 dark:hover:text-white">Marchands</Link>
            <Link to="/developpeurs" className="hover:text-slate-900 dark:hover:text-white">API</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
