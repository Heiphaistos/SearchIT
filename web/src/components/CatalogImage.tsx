import { useState, type ReactNode } from 'react';

/**
 * Photo d'un produit du catalogue (/api/catalog/:id/image : offre réelle relevée ou Wikipédia).
 * Tant qu'elle n'est pas chargée, ou en l'absence d'image, on affiche `fallback` (icône de catégorie).
 */
export function CatalogImage({ id, alt, className = '', fallback }: { id: string; alt: string; className?: string; fallback: ReactNode }) {
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
  if (state === 'error') return <>{fallback}</>;
  return (
    <>
      {state === 'loading' && fallback}
      <img
        src={`/api/catalog/${encodeURIComponent(id)}/image`}
        alt={alt}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setState('ok')}
        onError={() => setState('error')}
        className={`${className} ${state === 'ok' ? '' : 'hidden'}`}
      />
    </>
  );
}
