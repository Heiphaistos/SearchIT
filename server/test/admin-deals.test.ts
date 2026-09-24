import { describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { config } from '../src/config.js';
import type { Connector } from '../src/connectors/types.js';
import { HistoryStore } from '../src/search/history.js';
import { makeOffer } from '../src/search/offer.js';
import type { ProductGroup } from '../src/shared/types.js';

const day = (n: number) => new Date(Date.UTC(2026, 8, 1 + n)).toISOString().slice(0, 10);
const NOW = Date.UTC(2026, 8, 20, 12);

function group(key: string, price: number, category: ProductGroup['category'] = 'gpu'): ProductGroup {
  const offer = makeOffer({ merchantId: 'm', merchantName: 'M', title: key, url: 'https://m.test', price, shipping: 0, category });
  return { key, title: `Produit ${key}`, category, offers: [offer] } as unknown as ProductGroup;
}

describe('bons plans', () => {
  it('détecte les fortes baisses par rapport à la moyenne des 30 jours', () => {
    const h = new HistoryStore(null);
    for (let i = 0; i < 10; i++) h.record([group('a', 500), group('b', 100), group('c', 50, 'ssd')], day(i));
    h.record([group('a', 400), group('b', 98), group('c', 40, 'ssd')], day(18));
    const deals = h.deals({ now: NOW });
    expect(deals.map((d) => d.key)).toEqual(['a', 'c']); // b ne baisse que de 2 %
    expect(deals[0]).toMatchObject({ title: 'Produit a', current: 400, average: 500, dropPercent: 20, atLowest: true });
    expect(h.deals({ now: NOW, category: 'ssd' }).map((d) => d.key)).toEqual(['c']);
    // Prix trop ancien : ignoré.
    expect(h.deals({ now: NOW + 10 * 86_400_000 })).toEqual([]);
  });
});

describe('administration', () => {
  it('est désactivée sans ADMIN_TOKEN, protégée par jeton sinon', async () => {
    const connector: Connector = { id: 'x', merchantId: 'x', enabled: () => true, search: async () => { throw new Error('boom'); } };
    const previous = config.adminToken;
    const app = await buildApp({ serveWeb: false, historyFile: null, registry: { connectors: [connector], merchants: [], merchantInfo: () => [] } });
    try {
      config.adminToken = null;
      expect((await app.inject({ url: '/api/admin/stats' })).statusCode).toBe(404);
      config.adminToken = 'secret-token';
      expect((await app.inject({ url: '/api/admin/stats', headers: { 'x-admin-token': 'nope' } })).statusCode).toBe(401);
      await app.inject({ url: '/api/search?q=test' });
      const res = await app.inject({ url: '/api/admin/stats', headers: { 'x-admin-token': 'secret-token' } });
      expect(res.statusCode).toBe(200);
      const body = res.json();
      expect(body.engine.searches).toBe(1);
      expect(body.engine.recentErrors[0]).toMatchObject({ connector: 'x', status: 'error', error: 'boom' });
      expect(body.sources[0]).toMatchObject({ id: 'x', enabled: true });
    } finally {
      config.adminToken = previous;
      await app.close();
    }
  });

  it('expose /api/deals', async () => {
    const app = await buildApp({ serveWeb: false, historyFile: null });
    const body = (await app.inject({ url: '/api/deals?category=gpu' })).json();
    expect(body).toMatchObject({ deals: [], demo: true });
    await app.close();
  });
});
