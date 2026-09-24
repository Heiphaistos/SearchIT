import { Search, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  initialQuery?: string;
  size?: 'md' | 'lg';
  autoFocus?: boolean;
}

export function SearchBar({ initialQuery = '', size = 'md', autoFocus }: Props) {
  const [q, setQ] = useState(initialQuery);
  const navigate = useNavigate();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (query) navigate(`/recherche?q=${encodeURIComponent(query)}`);
  };

  const large = size === 'lg';
  return (
    <form onSubmit={submit} role="search" className="relative w-full">
      <Search className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 ${large ? 'size-5' : 'size-4'}`} />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus={autoFocus}
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
    </form>
  );
}
