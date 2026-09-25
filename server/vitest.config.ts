import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Construire l'application charge tout le catalogue de référence : 5-10 s ne suffisent pas sur une machine chargée.
    hookTimeout: 60_000,
    testTimeout: 30_000,
    // Pas d'appels réseau vers les boutiques publiques ni les pages de recherche des marchands pendant les tests.
    env: { PUBLIC_STORES: 'off', SCRAPE: 'off', DEMO_MODE: 'auto', HISTORY_FILE: 'off', RATE_LIMIT_PER_MINUTE: '0' },
  },
});
