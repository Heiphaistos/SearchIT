import { CATEGORIES, CATEGORY_GROUPS } from '@shared/categories';
import type { CatalogItem, CategoryGroup, CategoryId, MerchantInfo } from '@shared/types';
import { ArrowRight, BadgePercent, Bell, Clock, CodeXml, Database, Flame, Layers, Recycle, Scale, Search, Sparkles, Store, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CatalogCard } from '../components/CatalogCard';
import { CategoryIcon } from '../components/CategoryIcon';
import { SearchBar } from '../components/SearchBar';
import { api } from '../lib/api';
import { GROUP_STYLE } from '../lib/groups';
import { clearRecentSearches, recentStore } from '../lib/recent';

const QUICK_SEARCHES = ['RTX 5070', 'iPhone 15 reconditionné', 'Ryzen 7 9800X3D', 'NAS Synology', 'SSD 2 To', 'MacBook Air M4', 'Pâte thermique', 'Serveur Dell PowerEdge', 'Chargeur GaN 65W', 'Disque dur NAS'];

const GROUP_ORDER: CategoryGroup[] = ['components', 'devices', 'infrastructure', 'peripherals', 'accessories'];

const PILLARS = [
  { icon: Tag, title: 'Neuf', text: 'Grandes enseignes et spécialistes : Amazon, Fnac, LDLC, Materiel.net, Boulanger, Leclerc, Cdiscount…', className: 'from-sky-500 to-blue-600' },
  { icon: Recycle, title: 'Reconditionné', text: 'Back Market, refurbed, Certideal, 1fotrade, Visiodirect, Amazon Seconde Vie : jusqu’à 50 % moins cher.', className: 'from-emerald-500 to-teal-600' },
  { icon: BadgePercent, title: 'Occasion', text: 'Les places de marché (eBay, Rakuten) pour dénicher les meilleures affaires entre particuliers.', className: 'from-amber-500 to-orange-600' },
];

const STEPS = [
  { icon: Search, title: 'Cherchez', text: 'Un modèle précis, une catégorie ou un besoin : « SSD 2 To », « NAS 4 baies », « iPhone reconditionné ».' },
  { icon: Layers, title: 'Comparez', text: 'Toutes les offres d’un même produit sont regroupées : neuf, reconditionné et occasion, frais de port inclus.' },
  { icon: Bell, title: 'Suivez', text: 'Fixez un prix cible : SearchIT surveille les prix et vous prévient quand l’affaire se présente.' },
];

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold tracking-tight sm:text-3xl">{value}</div>
      <div className="mt-0.5 text-xs text-slate-500 sm:text-sm dark:text-slate-400">{label}</div>
    </div>
  );
}

export function HomePage() {
  const [merchants, setMerchants] = useState<MerchantInfo[]>([]);
  const [stats, setStats] = useState<{ products: number; brands: number; counts: Map<CategoryId, number> } | null>(null);
  const [featured, setFeatured] = useState<CatalogItem[]>([]);
  const recent = recentStore.use();

  useEffect(() => {
    document.title = 'SearchIT – Comparateur de prix high-tech neuf et reconditionné';
    api.merchants().then((r) => setMerchants(r.merchants), () => undefined);
    api.catalogStats().then((s) => setStats({ products: s.products, brands: s.brands, counts: new Map(s.categories.map((c) => [c.id, c.count])) }), () => undefined);
    api.catalog({ sort: 'recent', pageSize: 8, tag: 'gaming' }).then((r) => setFeatured(r.products), () => undefined);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 -z-10" />
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-[10%] h-[420px] w-[420px] animate-float rounded-full bg-brand-500/25 blur-3xl dark:bg-brand-600/25" />
          <div className="absolute -top-20 right-[8%] h-[380px] w-[380px] animate-float rounded-full bg-cyan-400/20 blur-3xl [animation-delay:-6s] dark:bg-cyan-500/15" />
          <div className="absolute top-40 left-1/2 h-[300px] w-[500px] -translate-x-1/2 animate-float rounded-full bg-violet-500/15 blur-3xl [animation-delay:-12s]" />
        </div>
        <div className="mx-auto max-w-4xl px-4 pb-16 pt-16 text-center sm:pt-24">
          <span className="chip mb-6 bg-white/70 py-1 pl-1 text-slate-700 ring-1 ring-slate-200 backdrop-blur dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
            <span className="chip bg-brand-600 text-white">
              <Sparkles className="size-3" /> Nouveau
            </span>
            Suivis de prix, bons plans et catalogue de référence
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-6xl">
            Le meilleur prix du <span className="gradient-text">high-tech</span>, partout.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 text-balance sm:text-lg dark:text-slate-300">
            Composants PC, portables, smartphones, serveurs, NAS, câbles, pâte thermique… SearchIT interroge les marchands en temps réel et regroupe toutes les offres
            neuves, reconditionnées et d’occasion.
          </p>
          <div className="mx-auto mt-9 max-w-2xl">
            <SearchBar size="lg" autoFocus />
          </div>
          {recent.length > 0 && (
            <div className="mx-auto mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 text-slate-500">
                <Clock className="size-3.5" /> Récemment :
              </span>
              {recent.slice(0, 5).map((q) => (
                <Link key={q} to={`/recherche?q=${encodeURIComponent(q)}`} className="rounded-full bg-brand-50 px-3 py-1 font-medium text-brand-700 transition hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-300 dark:hover:bg-brand-500/25">
                  {q}
                </Link>
              ))}
              <button onClick={clearRecentSearches} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                Effacer
              </button>
            </div>
          )}
          <div className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-2">
            {QUICK_SEARCHES.map((q) => (
              <Link
                key={q}
                to={`/recherche?q=${encodeURIComponent(q)}`}
                className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-sm text-slate-600 backdrop-blur transition hover:border-brand-300 hover:text-brand-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-brand-500/50 dark:hover:text-brand-300"
              >
                {q}
              </Link>
            ))}
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 rounded-2xl border border-slate-200/70 bg-white/60 px-6 py-5 backdrop-blur sm:grid-cols-4 dark:border-white/10 dark:bg-white/[0.03]">
            <Stat value={stats ? stats.products.toLocaleString('fr-FR') : '…'} label="produits référencés" />
            <Stat value={stats ? String(stats.brands) : '…'} label="marques" />
            <Stat value={merchants.length ? `${merchants.length}+` : '…'} label="marchands" />
            <Stat value={String(CATEGORIES.length - 1)} label="catégories" />
          </div>
        </div>
      </section>

      {/* Neuf / reconditionné / occasion */}
      <section className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3">
        {PILLARS.map((p) => (
          <div key={p.title} className="card card-hover p-6">
            <div className={`mb-4 grid size-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg ${p.className}`}>
              <p.icon className="size-5" />
            </div>
            <h2 className="text-lg font-semibold">{p.title}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{p.text}</p>
          </div>
        ))}
      </section>

      {/* Catégories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Parcourir par catégorie</h2>
            <p className="mt-1 text-slate-600 dark:text-slate-400">Tout ce qui touche à l’informatique et à la technologie.</p>
          </div>
          <Link to="/catalogue" className="btn-outline">
            <Database className="size-4" /> Tout le catalogue
          </Link>
        </div>
        <div className="mt-10 space-y-10">
          {GROUP_ORDER.map((group) => {
            const style = GROUP_STYLE[group];
            return (
              <div key={group}>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{CATEGORY_GROUPS[group]}</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {CATEGORIES.filter((c) => c.group === group && c.id !== 'other').map((c) => (
                    <Link
                      key={c.id}
                      to={`/recherche?category=${c.id}`}
                      className={`card card-hover group flex flex-col gap-3 bg-gradient-to-br p-4 ring-1 ring-transparent ${style.tile} ${style.ring}`}
                    >
                      <span className={`grid size-10 place-items-center rounded-xl shadow-md transition group-hover:scale-110 ${style.icon}`}>
                        <CategoryIcon category={c.id} className="size-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold leading-tight">{c.label}</span>
                        {stats?.counts.get(c.id) ? <span className="text-xs text-slate-500 dark:text-slate-400">{stats.counts.get(c.id)} modèles</span> : null}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="border-y border-slate-200/70 bg-white/50 py-16 dark:border-white/[0.06] dark:bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">Comment ça marche</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-lg shadow-brand-500/30">
                  <s.icon className="size-6" />
                </div>
                <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">Étape {i + 1}</div>
                <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
                <p className="mx-auto mt-1 max-w-xs text-sm text-slate-600 dark:text-slate-400">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/bons-plans" className="btn-outline">
              <Flame className="size-4 text-orange-500" /> Bons plans
            </Link>
            <Link to="/suivis" className="btn-outline">
              <Bell className="size-4" /> Mes suivis
            </Link>
            <Link to="/comparer" className="btn-outline">
              <Scale className="size-4" /> Comparateur
            </Link>
          </div>
        </div>
      </section>

      {/* Sélection du catalogue */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Nouveautés gaming</h2>
              <p className="mt-1 text-slate-600 dark:text-slate-400">Les derniers modèles du catalogue, avec leurs caractéristiques clés.</p>
            </div>
            <Link to="/catalogue?tag=gaming" className="btn-ghost">
              Voir tout <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <CatalogCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Marchands */}
      {merchants.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <div className="card p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{merchants.length} marchands et sources comparés</h2>
                <p className="mt-1 text-slate-600 dark:text-slate-400">API officielles, Google Shopping et flux produits, mis à jour en continu.</p>
              </div>
              <Link to="/sources" className="btn-outline">
                État des connexions <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {merchants.map((m) => (
                <span key={m.id} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium dark:border-white/10 dark:bg-white/[0.03]">
                  <Store className="size-4 text-slate-400" />
                  {m.name}
                  {m.refurbished && <Recycle className="size-3.5 text-emerald-500" aria-label="Reconditionné" />}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* API / configurateur */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="relative isolate flex flex-col items-start gap-5 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-violet-700 to-indigo-900 p-8 text-white shadow-2xl shadow-brand-900/30 sm:flex-row sm:items-center sm:p-10">
          <div className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-40" />
          <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
            <CodeXml className="size-7" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold sm:text-2xl">Une API prête pour votre configurateur de PC</h2>
            <p className="mt-1 text-white/80">Meilleur prix de chaque composant, total optimal, total par marchand et catalogue de référence en un appel.</p>
          </div>
          <Link to="/developpeurs" className="btn bg-white text-brand-700 shadow-lg hover:bg-brand-50">
            Documentation <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
