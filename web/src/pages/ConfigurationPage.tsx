import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { EmptyState, ErrorBox } from '../components/ui';
import { ENGINEPC_URL, importConfiguration, parseConfiguration } from '../lib/enginepc';
import { usePageMeta } from '../lib/meta';

// Point d'entrée des liens « Comparer les prix » du configurateur EnginePC.
export function ConfigurationPage() {
  const [qs] = useSearchParams();
  const data = qs.get('data');
  const result = useMemo(() => {
    try {
      return { parsed: parseConfiguration(data) };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Configuration invalide.' };
    }
  }, [data]);
  usePageMeta('Import de configuration', 'Importez une configuration EnginePC pour comparer le prix de chaque composant.');

  const [imported, setImported] = useState(false);

  useEffect(() => {
    if (!data || !result.parsed) return;
    importConfiguration(data, result.parsed);
    setImported(true);
  }, [data, result]);

  if (imported) return <Navigate to="/liste" replace />;
  if (result.parsed) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-16">
      <ErrorBox message={result.error ?? 'Configuration invalide.'} />
      <EmptyState title="Impossible d’importer cette configuration">
        Le lien est peut-être incomplet ou tronqué. Recopiez-le depuis EnginePC, ou recherchez les composants un par un.
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <a href={ENGINEPC_URL} className="btn-primary">
            Ouvrir EnginePC
          </a>
          <Link to="/" className="btn-outline">
            Rechercher des produits
          </Link>
        </div>
      </EmptyState>
    </div>
  );
}
