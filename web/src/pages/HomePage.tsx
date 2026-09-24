import { CATEGORIES, CATEGORY_GROUPS } from '@shared/categories';
import type { CategoryGroup, MerchantInfo } from '@shared/types';
import { ArrowRight, BadgePercent, CodeXml, Recycle, Sparkles, Store, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CategoryIcon } from '../components/CategoryIcon';
import { SearchBar } from '../components/SearchBar';
import { api } from '../lib/api';

const QUICK_SEARCHES = ['RTX 5070', 'iPhone 15 reconditionné', 'Ryzen 7 7800X3D', 'NAS Synology', 'SSD 2 To', 'MacBook Air M4', 'Pâte thermique', 'Serveur Dell PowerEdge', 'Chargeur GaN 65W', 'Disque dur NAS'];

const GROUP_ORDER: CategoryGroup[] = ['components', 'devices', 'infrastructure', 'peripherals', 'accessories'];

const PILLARS = [
  { icon: Tag, title: 'Neuf', text: 'Les grandes enseignes et spécialistes : Amazon, Fnac, LDLC, Materiel.net, Leclerc, Cdiscount…', className: 'from-sky-500 to-blue-600' },
  { icon: Recycle, title: 'Reconditionné', text: 'Back Market, refurbed, Certideal, 1fotrade, Visiodirect, Amazon Seconde Vie : jusqu’à 50 % moins cher.', className: 'from-emerald-500 to-teal-600' },
  { icon: BadgePercent, title: 'Occasion', text: 'Les places de marché (eBay, Rakuten) pour dénicher les meilleures affaires entre particuliers.', className: 'from-amber-500 to-orange-600' },
];

export function HomePage() {
  const [merchants, setMerchants] = useState<MerchantInfo[]>([]);

  useEffect(() => {
    document.title = 'SearchIT – Comparateur de prix high-tech neuf et reconditionné';
    api.merchants().then((r) => setMerchants(r.merchants), () => undefined);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-400/25 via-violet-400/20 to-cyan-400/25 blur-3xl dark:from-brand-600/20 dark:via-violet-600/15 dark:to-cyan-600/15" />
        </div>
        <div className="mx-auto max-w-4xl px-4 pb-14 pt-16 text-center sm:pt-24">
          <span className="chip mb-5 bg-white/70 py-1 text-brand-700 ring-1 ring-brand-200 backdrop-blur dark:bg-slate-900/70 dark:text-brand-300 dark:ring-brand-500/30">
            <Sparkles className="size-3.5" /> Neuf · Reconditionné · Occasion
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            Le meilleur prix du <span className="gradient-text">high-tech</span>, partout.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 text-balance sm:text-lg dark:text-slate-300">
            Composants PC, PC portables, smartphones, tablettes, serveurs, NAS, câbles, chargeurs, pâte thermique… SearchIT interroge les marchands en temps réel et
            regroupe toutes les offres pour chaque produit.
          </p>
          <div className="mx-auto mt-8 max-w-2xl">
            <SearchBar size="lg" autoFocus />
          </div>
          <div className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-2">
            {QUICK_SEARCHES.map((q) => (
              <Link
                key={q}
                to={`/recherche?q=${encodeURIComponent(q)}`}
                className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-sm text-slate-600 backdrop-blur transition hover:border-brand-300 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-brand-500/50 dark:hover:text-brand-300"
              >
                {q}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Neuf / reconditionné / occasion */}
      <section className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3">
        {PILLARS.map((p) => (
          <div key={p.title} className="card p-5">
            <div className={`mb-3 grid size-10 place-items-center rounded-xl bg-gradient-to-br text-white shadow-md ${p.className}`}>
              <p.icon className="size-5" />
            </div>
            <h2 className="font-semibold">{p.title}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{p.text}</p>
          </div>
        ))}
      </section>

      {/* Catégories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight">Parcourir par catégorie</h2>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Tout ce qui touche à l’informatique et à la technologie.</p>
        <div className="mt-8 space-y-8">
          {GROUP_ORDER.map((group) => (
            <div key={group}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{CATEGORY_GROUPS[group]}</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {CATEGORIES.filter((c) => c.group === group && c.id !== 'other').map((c) => (
                  <Link
                    key={c.id}
                    to={`/recherche?category=${c.id}`}
                    className="card group flex items-center gap-3 p-3 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md dark:hover:border-brand-500/40"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600 transition group-hover:bg-brand-600 group-hover:text-white dark:bg-slate-800 dark:text-slate-300">
                      <CategoryIcon category={c.id} className="size-4.5" />
                    </span>
                    <span className="text-sm font-medium leading-tight">{c.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Marchands */}
      {merchants.length > 0 && (
        <section className="border-y border-slate-200 bg-white/60 py-12 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{merchants.length} marchands comparés</h2>
                <p className="mt-1 text-slate-600 dark:text-slate-400">API officielles et flux produits d’affiliation, mis à jour en continu.</p>
              </div>
              <Link to="/sources" className="btn-outline">
                État des connexions <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {merchants.map((m) => (
                <span key={m.id} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium dark:border-slate-700 dark:bg-slate-900">
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
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="card flex flex-col items-start gap-5 overflow-hidden bg-gradient-to-br from-brand-600 to-violet-700 p-8 text-white sm:flex-row sm:items-center dark:from-brand-700 dark:to-violet-900">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/15">
            <CodeXml className="size-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">Une API prête pour votre configurateur de PC</h2>
            <p className="mt-1 text-white/80">
              Envoyez la liste des composants d’une configuration, SearchIT renvoie le meilleur prix de chacun, le total optimal et le total par marchand.
            </p>
          </div>
          <Link to="/developpeurs" className="btn bg-white text-brand-700 hover:bg-brand-50">
            Documentation <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
