// « Recherche vivante » : démonstration animée de SearchIT (frappe d'une requête, offres qui arrivent
// en cascade puis se classent par prix). Chargée à la demande depuis l'accueil (React.lazy).
import { ArrowRight, BadgeCheck, Loader2, Recycle, Search, Tag, Users } from 'lucide-react';
import { AnimatePresence, LayoutGroup, LazyMotion, MotionConfig, domMax, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import * as m from 'motion/react-m';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Condition = 'neuf' | 'reconditionné' | 'occasion';
interface Offer {
  id: string;
  seller: string;
  condition: Condition;
  price: number;
}

// Marchands et prix FICTIFS : l'animation illustre le fonctionnement, elle n'affiche pas de vraies offres.
const SCENARIOS: { query: string; offers: Offer[] }[] = [
  {
    query: 'SSD NVMe 2 To',
    offers: [
      { id: 'a', seller: 'Grande enseigne', condition: 'neuf', price: 139 },
      { id: 'b', seller: 'Spécialiste PC', condition: 'neuf', price: 124 },
      { id: 'c', seller: 'Place de marché', condition: 'occasion', price: 92 },
      { id: 'd', seller: 'Boutique en ligne', condition: 'neuf', price: 129 },
      { id: 'e', seller: 'Reconditionneur', condition: 'reconditionné', price: 104 },
    ],
  },
  {
    query: 'iPhone 15 reconditionné',
    offers: [
      { id: 'a', seller: 'Reconditionneur', condition: 'reconditionné', price: 579 },
      { id: 'b', seller: 'Place de marché', condition: 'occasion', price: 529 },
      { id: 'c', seller: 'Grande enseigne', condition: 'reconditionné', price: 615 },
      { id: 'd', seller: 'Spécialiste mobile', condition: 'reconditionné', price: 559 },
    ],
  },
  {
    query: 'Carte graphique 16 Go',
    offers: [
      { id: 'a', seller: 'Spécialiste PC', condition: 'neuf', price: 489 },
      { id: 'b', seller: 'Grande enseigne', condition: 'neuf', price: 519 },
      { id: 'c', seller: 'Boutique en ligne', condition: 'neuf', price: 474 },
      { id: 'd', seller: 'Place de marché', condition: 'occasion', price: 399 },
      { id: 'e', seller: 'Reconditionneur', condition: 'reconditionné', price: 429 },
    ],
  },
];

const CONDITION_STYLE: Record<Condition, { icon: typeof Tag; className: string }> = {
  neuf: { icon: Tag, className: 'bg-sky-500/10 text-sky-700 dark:text-sky-300' },
  reconditionné: { icon: Recycle, className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' },
  occasion: { icon: Users, className: 'bg-amber-500/10 text-amber-700 dark:text-amber-300' },
};

type Phase = 'typing' | 'searching' | 'arriving' | 'sorted' | 'leaving';
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const euro = (n: number) => `${n.toLocaleString('fr-FR')} €`;

/** Bouton « magnétique » : il suit légèrement le pointeur (souris seulement), ressort à la sortie. */
function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });
  const reduced = useReducedMotion();
  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    // Attraction plafonnée à 10 px : sur un bouton large, l'effet reste discret.
    const clamp = (v: number) => Math.max(-10, Math.min(10, v));
    x.set(clamp((e.clientX - r.left - r.width / 2) * strength));
    y.set(clamp((e.clientY - r.top - r.height / 2) * strength));
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <m.span ref={ref} className="inline-flex" style={{ x: sx, y: sy }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </m.span>
  );
}

export default function LiveSearchDemo() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(reduced ? SCENARIOS[0].query : '');
  const [phase, setPhase] = useState<Phase>(reduced ? 'sorted' : 'typing');
  const [shown, setShown] = useState<Offer[]>(reduced ? [...SCENARIOS[0].offers].sort((a, b) => a.price - b.price) : []);
  const running = useRef(true);
  const wake = useRef<(() => void) | null>(null);

  // Pause hors écran et onglet caché : la boucle attend au prochain point de reprise.
  useEffect(() => {
    if (reduced) return;
    let inView = false;
    const update = () => {
      running.current = inView && !document.hidden;
      if (running.current) {
        wake.current?.();
        wake.current = null;
      }
    };
    const io = new IntersectionObserver((entries) => {
      inView = entries[entries.length - 1].isIntersecting;
      update();
    });
    if (rootRef.current) io.observe(rootRef.current);
    document.addEventListener('visibilitychange', update);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    const step = async (ms: number) => {
      await wait(ms);
      while (!running.current && !cancelled) await new Promise<void>((r) => (wake.current = r));
    };
    (async () => {
      for (let i = 0; !cancelled; i = (i + 1) % SCENARIOS.length) {
        const { query, offers } = SCENARIOS[i];
        setIndex(i);
        setPhase('typing');
        for (let c = 1; c <= query.length && !cancelled; c++) {
          setTyped(query.slice(0, c));
          await step(55 + Math.random() * 60);
        }
        setPhase('searching');
        await step(700);
        setPhase('arriving');
        for (const o of offers) {
          if (cancelled) return;
          setShown((s) => [...s, o]);
          await step(260);
        }
        await step(900);
        setPhase('sorted');
        setShown((s) => [...s].sort((a, b) => a.price - b.price));
        await step(3200);
        setPhase('leaving');
        setShown([]);
        await step(450);
        for (let c = query.length - 1; c >= 0 && !cancelled; c -= 3) {
          setTyped(query.slice(0, c));
          await step(25);
        }
      }
    })();
    return () => {
      cancelled = true;
      wake.current?.();
    };
  }, [reduced]);

  const scenario = SCENARIOS[index];
  const best = phase === 'sorted' ? shown[0]?.id : undefined;
  const sources = phase === 'searching' ? 'Interrogation des marchands…' : shown.length ? `${shown.length} offre${shown.length > 1 ? 's' : ''} trouvée${shown.length > 1 ? 's' : ''}` : ' ';

  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">
        <div ref={rootRef} className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">Recherche vivante</div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-balance sm:text-3xl">Une requête, toutes les offres, classées en direct.</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Tapez un produit : les marchands répondent les uns après les autres, puis SearchIT range neuf, reconditionné et occasion par prix total.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Magnetic>
                <Link to={`/recherche?q=${encodeURIComponent(scenario.query)}`} className="btn-primary px-5 py-2.5">
                  <Search className="size-4" /> Essayer « {scenario.query} »
                </Link>
              </Magnetic>
              <Magnetic strength={0.22}>
                <Link to="/sources" className="btn-outline px-5 py-2.5">
                  Voir les sources <ArrowRight className="size-4" />
                </Link>
              </Magnetic>
            </div>
          </div>

          <div className="card relative min-w-0 overflow-hidden p-4 sm:p-5" aria-hidden="true">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.03]">
              <Search className="size-4 shrink-0 text-slate-400" />
              <span className="min-w-0 flex-1 truncate text-sm sm:text-base">
                {typed}
                {phase === 'typing' && <span className="live-caret ml-px inline-block h-[1.1em] w-px translate-y-[0.15em] bg-brand-500" />}
              </span>
              <span className="grid size-7 place-items-center rounded-lg bg-brand-600 text-white">
                {phase === 'searching' ? <Loader2 className="size-3.5 animate-spin" /> : <Search className="size-3.5" />}
              </span>
            </div>
            <div className="mt-3 flex h-5 items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{sources}</span>
              {phase === 'sorted' && (
                <m.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="font-medium text-brand-600 dark:text-brand-400">
                  Tri : prix total ↑
                </m.span>
              )}
            </div>
            <LayoutGroup>
              <m.ul layout className="mt-2 flex min-h-[19.5rem] flex-col gap-2">
                <AnimatePresence mode="popLayout">
                  {shown.map((o, i) => {
                    const c = CONDITION_STYLE[o.condition];
                    const isBest = o.id === best;
                    return (
                      <m.li
                        key={`${index}-${o.id}`}
                        layout
                        initial={{ opacity: 0, y: 18, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -24, transition: { duration: 0.22, delay: i * 0.03 } }}
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="relative flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 dark:border-white/[0.07] dark:bg-slate-900/70"
                      >
                        {isBest && (
                          <m.span
                            layoutId="best-ring"
                            className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-brand-500"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                        <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${c.className}`}>
                          <c.icon className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{o.seller}</span>
                          <span className="block text-xs capitalize text-slate-500 dark:text-slate-400">{o.condition}</span>
                        </span>
                        {isBest && (
                          <m.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="chip hidden bg-brand-600 text-white sm:inline-flex">
                            <BadgeCheck className="size-3" /> Meilleur prix
                          </m.span>
                        )}
                        <span className={`text-right text-sm font-bold tabular-nums sm:text-base ${isBest ? 'text-brand-600 dark:text-brand-400' : ''}`}>{euro(o.price)}</span>
                      </m.li>
                    );
                  })}
                </AnimatePresence>
              </m.ul>
            </LayoutGroup>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Animation de démonstration : vendeurs et prix fictifs.</p>
          </div>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
