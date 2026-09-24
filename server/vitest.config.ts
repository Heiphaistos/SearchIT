import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Pas d'appels réseau vers les boutiques publiques pendant les tests.
    env: { PUBLIC_STORES: 'off', DEMO_MODE: 'auto', HISTORY_FILE: 'off', RATE_LIMIT_PER_MINUTE: '0' },
  },
});
