import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { signAliExpress } from '../src/connectors/aliexpress.js';
import { conditionFromEbayId } from '../src/connectors/ebay.js';
import { signV4 } from '../src/connectors/sigv4.js';
import { groupOffers } from '../src/search/group.js';
import { makeOffer } from '../src/search/offer.js';
import type { LookupResponse, SearchResponse } from '../src/shared/types.js';

// Aucun identifiant marchand n'est défini en test : l'API tourne sur le catalogue de démo.
let app: FastifyInstance;

beforeAll(async () => {
  app = await buildApp({ serveWeb: false });
});

afterAll(async () => {
  await app.close();
});

describe('GET /api/search', () => {
  it('regroupe les offres d’un même produit et calcule les meilleurs prix', async () => {
    const res = await app.inject({ url: '/api/search?q=iphone%2015' });
    expect(res.statusCode).toBe(200);
    const body = res.json<SearchResponse>();
    expect(body.demo).toBe(true);
    expect(body.detectedCategory).toBe('smartphone');
    const group = body.groups[0];
    expect(group.title).toBe('Apple iPhone 15 128 Go');
    expect(group.merchantCount).toBeGreaterThan(3);
    expect(group.bestOffer.totalPrice).toBe(Math.min(...group.offers.filter((o) => o.inStock !== false).map((o) => o.totalPrice)));
    expect(group.offers.every((o) => o.isDemo)).toBe(true);
  });

  it('masque les accessoires lors d’une recherche d’appareil', async () => {
    const body = (await app.inject({ url: '/api/search?q=iphone%2016' })).json<SearchResponse>();
    expect(body.groups.map((g) => g.category)).not.toContain('accessory');
    const all = (await app.inject({ url: '/api/search?q=iphone%2016&hideAccessories=false' })).json<SearchResponse>();
    expect(all.groups.map((g) => g.category)).toContain('accessory');
  });

  it('comprend « reconditionné » dans la requête', async () => {
    const body = (await app.inject({ url: '/api/search?q=' + encodeURIComponent('macbook air m4 reconditionné') })).json<SearchResponse>();
    expect(body.groups.length).toBeGreaterThan(0);
    for (const g of body.groups) for (const o of g.offers) expect(o.condition).toBe('refurbished');
  });

  it('applique filtres et tri', async () => {
    const body = (await app.inject({ url: '/api/search?q=ssd&sort=price-asc&maxPrice=150&conditions=new&merchants=ldlc,amazon' })).json<SearchResponse>();
    const prices = body.groups.map((g) => g.bestOffer.totalPrice);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    for (const g of body.groups) {
      for (const o of g.offers) {
        expect(o.totalPrice).toBeLessThanOrEqual(150);
        expect(o.condition).toBe('new');
        expect(['ldlc', 'amazon']).toContain(o.merchantId);
      }
    }
    expect(body.facets.merchants.length).toBeGreaterThan(2);
  });

  it('trouve les accessoires (pâte thermique, câbles, chargeurs)', async () => {
    for (const [q, cat] of [['pate thermique', 'thermal-paste'], ['cable hdmi', 'cable'], ['chargeur gan', 'charger']]) {
      const body = (await app.inject({ url: `/api/search?q=${encodeURIComponent(q)}` })).json<SearchResponse>();
      expect(body.groups.length, q).toBeGreaterThan(0);
      expect(body.groups[0].category).toBe(cat);
    }
  });

  it('valide les paramètres', async () => {
    expect((await app.inject({ url: '/api/search' })).statusCode).toBe(400);
    expect((await app.inject({ url: '/api/search?q=x&category=frigo' })).statusCode).toBe(400);
    expect((await app.inject({ url: '/api/search?q=x&conditions=cassé' })).statusCode).toBe(400);
    expect((await app.inject({ url: '/api/search?q=x&minPrice=-3' })).statusCode).toBe(400);
  });
});

describe('POST /api/v1/lookup (configurateur)', () => {
  it('renvoie la meilleure offre par composant et les totaux', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/lookup',
      payload: {
        items: [
          { ref: 'cpu', query: 'Ryzen 7 7800X3D', category: 'cpu' },
          { ref: 'gpu', query: 'RTX 5070', category: 'gpu' },
          { ref: 'hdd', query: 'IronWolf 8 To', quantity: 2 },
          { ref: 'nope', query: 'zzzz introuvable' },
        ],
      },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json<LookupResponse>();
    const [cpu, gpu, hdd, nope] = body.results;
    expect(cpu.best?.title).toMatch(/7800X3D/);
    expect(gpu.best?.title).toMatch(/RTX 5070(?! Ti)/);
    expect(hdd.lineTotal).toBeCloseTo(hdd.best!.price * 2 + (hdd.best!.shipping ?? 0), 2);
    expect(nope.found).toBe(false);
    expect(body.missing).toEqual(['nope']);
    // Pas d'occasion par défaut pour le configurateur.
    for (const r of body.results) if (r.best) expect(r.best.condition).not.toBe('used');
    expect(body.bestTotal).toBeCloseTo(cpu.lineTotal + gpu.lineTotal + hdd.lineTotal, 2);
    expect(body.byMerchant[0].covered).toBeGreaterThanOrEqual(body.byMerchant.at(-1)!.covered);
  });

  it('valide le corps de la requête', async () => {
    expect((await app.inject({ method: 'POST', url: '/api/v1/lookup', payload: {} })).statusCode).toBe(400);
    expect((await app.inject({ method: 'POST', url: '/api/v1/lookup', payload: { items: [{ ref: 'a' }] } })).statusCode).toBe(400);
  });

  it('publie la spécification OpenAPI', async () => {
    const res = await app.inject({ url: '/api/v1/openapi.json' });
    expect(res.json().paths['/lookup']).toBeDefined();
  });
});

describe('GET /api/merchants', () => {
  it('liste les marchands et les variables à configurer', async () => {
    const body = (await app.inject({ url: '/api/merchants' })).json();
    const ids = body.merchants.map((m: { id: string }) => m.id);
    for (const id of ['amazon', 'aliexpress', 'ebay', 'backmarket', 'fnac', 'ldlc', 'leclerc', 'visiodirect', '1fotrade']) expect(ids).toContain(id);
    const ldlc = body.merchants.find((m: { id: string }) => m.id === 'ldlc');
    expect(ldlc).toMatchObject({ connection: 'affiliate-feed', enabled: false, requiredEnv: ['FEED_LDLC_URL'] });
  });
});

describe('connecteurs', () => {
  it('signe les requêtes PA-API (SigV4)', () => {
    const headers = signV4({
      accessKey: 'AKID',
      secretKey: 'SECRET',
      region: 'eu-west-1',
      service: 'ProductAdvertisingAPI',
      host: 'webservices.amazon.fr',
      path: '/paapi5/searchitems',
      body: '{}',
      headers: { 'content-type': 'application/json' },
      date: new Date('2026-01-02T03:04:05Z'),
    });
    expect(headers['x-amz-date']).toBe('20260102T030405Z');
    expect(headers.authorization).toMatch(
      /^AWS4-HMAC-SHA256 Credential=AKID\/20260102\/eu-west-1\/ProductAdvertisingAPI\/aws4_request, SignedHeaders=content-type;host;x-amz-date, Signature=[0-9a-f]{64}$/,
    );
  });

  it('signe les requêtes AliExpress (clés triées, HMAC-SHA256 majuscule)', () => {
    const a = signAliExpress({ b: '2', a: '1' }, 's');
    expect(a).toMatch(/^[0-9A-F]{64}$/);
    expect(a).toBe(signAliExpress({ a: '1', b: '2' }, 's'));
  });

  it('mappe les états eBay', () => {
    expect(conditionFromEbayId('1000')).toBe('new');
    expect(conditionFromEbayId('2010')).toBe('refurbished');
    expect(conditionFromEbayId('3000')).toBe('used');
  });

  it('regroupe par GTIN même si les titres diffèrent', () => {
    const base = { merchantName: 'X', url: 'https://x.test', category: 'ssd' as const };
    const groups = groupOffers([
      { offer: makeOffer({ ...base, merchantId: 'a', title: 'Samsung 990 Pro 2TB', price: 170, gtin: '4006381333931' }), relevance: 1 },
      { offer: makeOffer({ ...base, merchantId: 'b', title: 'SSD interne M.2 NVMe Samsung MZ-V9P2T0', price: 160, gtin: '4006381333931' }), relevance: 0.8 },
      { offer: makeOffer({ ...base, merchantId: 'c', title: 'Samsung 990 Pro 4TB', price: 300 }), relevance: 0.9 },
    ]);
    expect(groups).toHaveLength(2);
    expect(groups[0]).toMatchObject({ merchantCount: 2, minPrice: 160, maxPrice: 170, savingsPercent: 6 });
  });
});

describe('navigation par catégorie', () => {
  it('liste une catégorie sans mots-clés', async () => {
    const body = (await app.inject({ url: '/api/search?category=nas' })).json<SearchResponse>();
    expect(body.total).toBeGreaterThanOrEqual(5);
    for (const g of body.groups) expect(g.category).toBe('nas');
  });
});

describe('regroupement des déclinaisons', () => {
  it('ne fusionne jamais un modèle et sa version Ti / Pro', async () => {
    const { groupOffers } = await import('../src/search/group.js');
    const { makeOffer } = await import('../src/search/offer.js');
    const o = (title: string) => ({ offer: makeOffer({ merchantId: 'm', merchantName: 'M', title, url: 'https://m.test', price: 500, category: 'gpu' }), relevance: 1 });
    const groups = groupOffers([o('NVIDIA GeForce RTX 5070'), o('NVIDIA GeForce RTX 5070 Ti'), o('Carte graphique NVIDIA GeForce RTX 5070')]);
    expect(groups.map((g) => g.offers.length).sort()).toEqual([1, 2]);
  });
});

describe('GET /api/catalog', () => {
  it('liste le catalogue, renvoie une fiche et rattache les résultats de recherche', async () => {
    const list = (await app.inject({ url: '/api/catalog?category=nas&sort=name&pageSize=3' })).json();
    expect(list.total).toBeGreaterThan(10);
    expect(list.products).toHaveLength(3);
    const item = (await app.inject({ url: `/api/catalog/${list.products[0].id}` })).json();
    expect(item.reference.specs.length).toBeGreaterThan(2);
    expect(item.similar.length).toBeGreaterThan(0);
    expect((await app.inject({ url: '/api/catalog/inconnu' })).statusCode).toBe(404);
    expect((await app.inject({ url: '/api/catalog?category=frigo' })).statusCode).toBe(400);
    const search = (await app.inject({ url: '/api/search?q=rtx%205070&pageSize=100' })).json<SearchResponse>();
    expect(search.groups.find((g) => g.reference?.name === 'NVIDIA GeForce RTX 5070')).toBeDefined();
    // « RTX 5070 » n'inclut plus les 5070 Ti : autre puce, autre recherche.
    expect(search.groups.find((g) => g.reference?.name === 'NVIDIA GeForce RTX 5070 Ti')).toBeUndefined();
    const ti = (await app.inject({ url: '/api/search?q=rtx%205070%20ti&pageSize=100' })).json<SearchResponse>();
    expect(ti.groups.find((g) => g.reference?.name === 'NVIDIA GeForce RTX 5070 Ti')).toBeDefined();
  });
});
