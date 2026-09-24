import { useEffect } from 'react';

const DEFAULT_DESCRIPTION =
  'SearchIT compare les prix du high-tech neuf, reconditionné et d’occasion chez les marchands français : composants PC, smartphones, PC portables, NAS, serveurs et accessoires.';

function setMeta(selector: string, value: string): void {
  document.head.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', value);
}

/** Titre et description de la page (onglet, moteurs de recherche, aperçus de partage). */
export function usePageMeta(title: string, description = DEFAULT_DESCRIPTION): void {
  useEffect(() => {
    const full = title ? `${title} – SearchIT` : 'SearchIT – Comparateur de prix high-tech neuf et reconditionné';
    document.title = full;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', full);
    setMeta('meta[property="og:description"]', description);
  }, [title, description]);
}
