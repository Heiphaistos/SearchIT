import { getCategory } from '@shared/categories';
import type { CategoryId, SuggestResponse } from '@shared/types';
import { Clock, Search, TrendingUp, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { addRecentSearch, recentStore } from '../lib/recent';
import { CategoryIcon } from './CategoryIcon';

interface Props {
  initialQuery?: string;
  size?: 'md' | 'lg';
  autoFocus?: boolean;
}

type Item = { kind: 'recent' | 'query'; text: string } | { kind: 'category'; id: CategoryId; text: string };

export function SearchBar({ initialQuery = '', size = 'md', autoFocus }: Props) {
  const [q, setQ] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  // Suggestions mémorisées avec la saisie qui les a produites, pour ne jamais afficher d'anciennes réponses.
  const [suggest, setSuggest] = useState<{ q: string; data: SuggestResponse } | null>(null);
  const recent = recentStore.use();
  const navigate = useNavigate();
  const listId = useId();
  const boxRef = useRef<HTMLFormElement>(null);

  // Suggestions serveur, avec un léger délai pour ne pas interroger à chaque frappe.
  useEffect(() => {
    const query = q.trim();
    if (query.length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/suggest?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((r) => (r.ok ? (r.json() as Promise<SuggestResponse>) : null))
        .then((data) => data && setSuggest({ q: query, data }), () => undefined);
    }, 150);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const query = q.trim();
  const fresh = suggest?.q === query ? suggest.data : null;
  const items: Item[] =
    query.length < 2
      ? recent.map((text) => ({ kind: 'recent' as const, text }))
      : [
          ...(fresh?.categories ?? []).map((c) => ({ kind: 'category' as const, id: c.id, text: c.label })),
          ...(fresh?.queries ?? []).filter((s) => s.toLowerCase() !== query.toLowerCase()).map((text) => ({ kind: 'query' as const, text })),
        ].slice(0, 9);

  const go = (item?: Item) => {
    setOpen(false);
    setActive(-1);
    if (item?.kind === 'category') {
      navigate(`/recherche?category=${item.id}`);
      return;
    }
    const text = (item?.text ?? q).trim();
    if (!text) return;
    setQ(text);
    addRecentSearch(text);
    navigate(`/recherche?q=${encodeURIComponent(text)}`);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    go(active >= 0 ? items[active] : undefined);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i <= 0 ? items.length - 1 : i - 1));
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActive(-1);
    }
  };

  const large = size === 'lg';
  const showList = open && items.length > 0;
  return (
    <form ref={boxRef} onSubmit={submit} role="search" className="relative w-full">
      <Search className={`pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400 ${large ? 'size-5' : 'size-4'}`} />
      <input
        type="search"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        autoComplete="off"
        enterKeyHint="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        placeholder={large ? 'RTX 5070, iPhone 15 reconditionné, pâte thermique, NAS 4 baies…' : 'Rechercher un produit…'}
        aria-label="Rechercher un produit"
        className={`w-full rounded-2xl border border-slate-200 bg-white pl-11 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/15 dark:border-slate-700 dark:bg-slate-900 [&::-webkit-search-cancel-button]:hidden ${
          large ? 'h-14 pr-36 text-base shadow-lg shadow-brand-500/5 sm:h-16 sm:text-lg' : 'h-10 pr-10 text-sm'
        }`}
      />
      {q && !large && (
        <button type="button" onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label="Effacer">
          <X className="size-4" />
        </button>
      )}
      {large && (
        <button type="submit" className="btn-primary absolute right-2 top-1/2 h-10 -translate-y-1/2 px-5 sm:h-12 sm:px-6">
          Comparer
        </button>
      )}

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 text-left shadow-xl shadow-slate-900/10 animate-fade-in dark:border-slate-700 dark:bg-slate-900"
        >
          {query.length < 2 && <li className="px-4 pb-1 pt-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">Recherches récentes</li>}
          {items.map((item, i) => (
            <li
              key={`${item.kind}-${item.text}`}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                go(item);
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center gap-3 px-4 py-2 text-sm ${i === active ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
            >
              {item.kind === 'recent' && <Clock className="size-4 shrink-0 text-slate-400" />}
              {item.kind === 'query' && <TrendingUp className="size-4 shrink-0 text-slate-400" />}
              {item.kind === 'category' && <CategoryIcon category={item.id} className="size-4 shrink-0 text-brand-500" />}
              <span className="truncate">
                {item.kind === 'category' ? (
                  <>
                    Catégorie <strong className="font-semibold">{getCategory(item.id).label}</strong>
                  </>
                ) : (
                  item.text
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
