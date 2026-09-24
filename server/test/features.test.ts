import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { config } from '../src/config.js';
import type { Connector } from '../src/connectors/types.js';
import { HistoryStore } from '../src/search/history.js';
import { makeOffer } from '../src/search/offer.js';
import { capacityGb, unitPriceFor } from '../src/search/unit-price.js';
import type { ProductGroup, SearchResponse, SuggestResponse } from '../src/shared/types.js';

describe('prix unitaire', () => {
  it('lit la capacité', () => {
    expect(capacityGb('SSD Samsung 990 Pro 2 To')).toBe(2000);
    expect(capacityGb('Kingston NV3 1TB')).toBe(1000);
    expect(capacityGb('Corsair Vengeance DDR5 32 Go (2 x 16 Go) 6000 MHz')).toBe(32);
    expect(capacityGb('Pâte thermique 4 g')).toBeNull();
  });

  it('calcule le prix au To et au Go', () => {
    expect(unitPriceFor('hdd', 'Seagate IronWolf 8 To', 200)).toEqual({ value: 25, unit: '€/To' });
    expect(unitPriceFor('ssd', 'SSD 512 Go', 40)).toEqual({ value: 78.13, unit: '€/To' });
    expect(unitPriceFor('ram', 'DDR5 32 Go', 96)).toEqual({ value: 3, unit: '€/Go' });
    expect(unitPriceFor('laptop', 'MacBook 16 Go 512 Go', 999)).toBeUndefined();
  });
});

describe('historique des prix', () => {
  const group = (key: string, prices: Array<[number, 'new' | 'refurbished', boolean?]>): ProductGroup => {
    const offers = prices.map(([price, condition, isDemo], i) =>
      makeOffer({ merchantId: `m${i}`, merchantName: 'M', title: 'X', url: 'https://x.test', price, shipping: 0, condition, isDemo }),
    );
    return { key, offers } as unknown as ProductGroup;
  };

  it('garde le meilleur prix du jour et ignore la démo', () => {
    const h = new HistoryStore(null);
    h.record([group('a', [[100, 'new'], [80, 'refurbished'], [10, 'new', true]])], '2026-09-01');
    h.record([group('a', [[95, 'new']])], '2026-09-01');
    h.record([group('a', [[90, 'new'], [85, 'refurbished']])], '2026-09-10');
    expect(h.points('a')).toEqual([
      { d: '2026-09-01', min: 80, new: 95, refurb: 80 },
      { d: '2026-09-10', min: 85, new: 90, refurb: 85 },
    ]);
    expect(h.summary('a')).toMatchObject({ lowest: 80, lowestDate: '2026-09-01', since: '2026-09-01', days: 10 });
    h.record([group('demo', [[5, 'new', true]])]);
    expect(h.summary('demo')).toBeUndefined();
  });

  it('classe les recherches populaires', () => {
    const h = new HistoryStore(null);
    for (let i = 0; i < 3; i++) h.recordQuery('RTX 5070');
    h.recordQuery('rtx 5080');
    h.recordQuery('iPhone 15');
    expect(h.popularQueries('rtx', 5)).toEqual(['RTX 5070', 'rtx 5080']);
    expect(h.popularQueries('', 1)).toEqual(['RTX 5070']);
  });
});

describe('routes', () => {
  let app: FastifyInstance;
  beforeAll(async () => {
    app = await buildApp({ serveWeb: false, historyFile: null });
  });
  afterAll(async () => {
    await app.close();
  });

  it('propose des suggestions (titres + catégories)', async () => {
    const body = (await app.inject({ url: '/api/suggest?q=rtx%2050' })).json<SuggestResponse>();
    expect(body.queries.some((q) => /RTX 50/.test(q))).toBe(true);
    const cats = (await app.inject({ url: '/api/suggest?q=pate' })).json<SuggestResponse>();
    expect(cats.categories.map((c) => c.id)).toContain('thermal-paste');
  });

  it('trie par prix au To', async () => {
    const body = (await app.inject({ url: '/api/search?category=hdd&sort=unit-price' })).json<SearchResponse>();
    const values = body.groups.map((g) => g.unitPrice?.value ?? Infinity);
    expect(values[0]).toBeLessThan(Infinity);
    expect(values).toEqual([...values].sort((a, b) => a - b));
  });

  it('envoie les en-têtes de sécurité', async () => {
    const res = await app.inject({ url: '/api/health' });
    expect(res.headers['content-security-policy']).toContain("script-src 'self'");
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('publie robots.txt et sitemap.xml', async () => {
    expect((await app.inject({ url: '/robots.txt' })).body).toContain('Sitemap: https://searchit.heiphaistos.org/sitemap.xml');
    const sitemap = (await app.inject({ url: '/sitemap.xml' })).body;
    expect(sitemap).toContain('<loc>https://searchit.heiphaistos.org/recherche?category=nas</loc>');
  });
});

describe('historique branché sur la recherche', () => {
  let app: FastifyInstance;
  beforeAll(async () => {
    const real: Connector = {
      id: 'shop',
      merchantId: 'shop',
      enabled: () => true,
      search: async () => [makeOffer({ merchantId: 'shop', merchantName: 'Shop', title: 'Disque dur Seagate IronWolf 8 To', url: 'https://s.test', price: 199.9, shipping: 0 })],
    };
    app = await buildApp({ serveWeb: false, historyFile: null, registry: { connectors: [real], merchants: [], merchantInfo: () => [] } });
  });
  afterAll(async () => {
    await app.close();
  });

  it('renvoie le résumé d’historique et le prix au To', async () => {
    const body = (await app.inject({ url: '/api/search?q=ironwolf%208%20to' })).json<SearchResponse>();
    const g = body.groups[0];
    expect(g.history).toMatchObject({ lowest: 199.9, days: 1 });
    expect(g.unitPrice).toEqual({ value: 24.99, unit: '€/To' });
    const hist = (await app.inject({ url: `/api/history/${encodeURIComponent(g.key)}` })).json();
    expect(hist.points).toHaveLength(1);
    const suggest = (await app.inject({ url: '/api/suggest?q=iron' })).json<SuggestResponse>();
    expect(suggest.queries[0]).toBe('ironwolf 8 to');
  });
});

describe('limite de débit', () => {
  it('répond 429 au-delà du quota par IP', async () => {
    const previous = config.rateLimitPerMinute;
    config.rateLimitPerMinute = 2;
    const app = await buildApp({ serveWeb: false, historyFile: null });
    try {
      const codes = [];
      for (let i = 0; i < 3; i++) codes.push((await app.inject({ url: '/api/search?q=ssd' })).statusCode);
      expect(codes).toEqual([200, 200, 429]);
    } finally {
      config.rateLimitPerMinute = previous;
      await app.close();
    }
  });
});
