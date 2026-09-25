import { describe, expect, it } from 'vitest';
import type { Connector } from '../src/connectors/types.js';
import { SearchEngine } from '../src/search/engine.js';
import { detectModel } from '../src/search/models.js';
import { makeOffer } from '../src/search/offer.js';
import { performanceIndex, valueScore } from '../src/search/performance.js';
import { prepareQuery, relevance, MIN_RELEVANCE } from '../src/search/relevance.js';
import type { ProductGroup } from '../src/shared/types.js';

describe('requêtes courtes sur une puce', () => {
  it.each([
    ['5090', 'gpu', 'RTX 5090', 'rtx 5090'],
    ['rtx 5070', 'gpu', 'RTX 5070', 'rtx 5070'],
    ['4070 super', 'gpu', 'RTX 4070 Super', 'rtx 4070 super'],
    ['NVIDIA GeForce RTX 4070 Ti Super', 'gpu', 'RTX 4070 Ti Super', 'rtx 4070 ti super'],
    ['9070 xt', 'gpu', 'RX 9070 XT', 'rx 9070 xt'],
    ['7800', 'gpu', 'RX 7800 XT', 'rx 7800 xt'],
    ['rx 7600', 'gpu', 'RX 7600', 'rx 7600'],
    ['b580', 'gpu', 'Arc B580', 'arc b580'],
    ['9800x3d', 'cpu', 'AMD Ryzen 7 9800X3D', '9800x3d'],
    ['AMD Ryzen 7 7800X3D', 'cpu', 'AMD Ryzen 7 7800X3D', '7800x3d'],
    ['9600', 'cpu', 'AMD Ryzen 5 9600', '9600'],
    ['14600k', 'cpu', 'Intel Core i5-14600K', '14600k'],
    ['i9-14900k', 'cpu', 'Intel Core i9-14900K', '14900k'],
    ['265k', 'cpu', 'Intel Core Ultra 7 265K', '265k'],
  ])('« %s » → %s %s', (q, category, label, match) => {
    expect(detectModel(q)).toMatchObject({ category, label, match });
  });

  it('enrichit le texte envoyé aux moteurs généralistes', () => {
    expect(detectModel('5090')?.searchText).toBe('carte graphique RTX 5090');
    expect(detectModel('9800x3d')?.searchText).toBe('processeur AMD Ryzen 7 9800X3D');
  });

  it('ignore les requêtes ambiguës ou plus précises', () => {
    expect(detectModel('7600')).toBeNull(); // Radeon RX 7600 ou Ryzen 5 7600
    expect(detectModel('asus tuf 5090')).toBeNull();
    expect(detectModel('iphone 16')).toBeNull();
    expect(detectModel('ssd 2to')).toBeNull();
  });
});

describe('variantes de puce', () => {
  const ok = (q: string, title: string) => relevance(prepareQuery(q), title) >= MIN_RELEVANCE;

  it('ne mélange pas Ti, Super, XT au modèle demandé', () => {
    expect(ok('rtx 5070', 'MSI GeForce RTX 5070 VENTUS 2X OC 12G')).toBe(true);
    expect(ok('rtx 5070', 'MSI GeForce RTX 5070 Ti VENTUS 3X OC 16G')).toBe(false);
    expect(ok('rtx 5070', 'Carte graphique RTX5070Ti Gaming')).toBe(false);
    expect(ok('rtx 4070 super', 'ASUS Dual RTX 4070 SUPER OC')).toBe(true);
    expect(ok('rtx 4070 super', 'ASUS TUF RTX 4070 Ti SUPER OC')).toBe(false);
    expect(ok('rtx 4070 ti', 'ASUS TUF RTX 4070 Ti SUPER OC')).toBe(false);
    expect(ok('rx 9070', 'Sapphire PULSE Radeon RX 9070 XT')).toBe(false);
    expect(ok('rx 9070 xt', 'Sapphire PULSE Radeon RX 9070 XT 16GB')).toBe(true);
    expect(ok('rtx 5090', 'MSI GeForce RTX 5090 D 32G')).toBe(false);
  });

  it('distingue les suffixes de processeur', () => {
    expect(ok('9600', 'AMD Ryzen 5 9600X')).toBe(false);
    expect(ok('9600', 'AMD Ryzen 5 9600 (3.8 GHz / 5.2 GHz)')).toBe(true);
    expect(ok('14600k', 'Intel Core i5-14600KF')).toBe(false);
    expect(ok('14600k', 'Intel Core i5-14600K (3.5 GHz / 5.3 GHz)')).toBe(true);
  });
});

describe('rapport qualité-prix', () => {
  it('lit la puce dans le titre', () => {
    expect(performanceIndex('Gigabyte GeForce RTX 5070 EAGLE OC SFF', 'gpu')).toBe(28651);
    expect(performanceIndex('MSI GeForce RTX 4070 Ti SUPER 16G', 'gpu')).toBe(31841);
    expect(performanceIndex('Sapphire Radeon RX 9070 XT', 'gpu')).toBe(26911);
    expect(performanceIndex('AMD Ryzen 7 9800X3D', 'cpu')).toBe(39923);
    expect(performanceIndex('Intel Core i5-14600K', 'cpu')).toBe(38372);
    expect(performanceIndex('Intel Core Ultra 7 265K', 'cpu')).toBe(58571);
    // Chiffre non unique (8 ou 16 Go) : pas d'indice plutôt qu'un indice inventé.
    expect(performanceIndex('MSI GeForce RTX 5060 Ti 16G', 'gpu')).toBeUndefined();
  });

  const group = (title: string, category: ProductGroup['category'], price: number, ratings: Array<[number, number]> = []): ProductGroup => {
    const offers = [
      makeOffer({ merchantId: 'm', merchantName: 'M', title, url: 'https://m.test', price, shipping: 0, category }),
      ...ratings.map(([rating, reviewCount], i) =>
        makeOffer({ merchantId: `r${i}`, merchantName: 'R', title, url: `https://r${i}.test`, price: price + 10, category, rating, reviewCount }),
      ),
    ];
    return { title, category, offers, bestOffer: offers[0] } as unknown as ProductGroup;
  };

  it('performance / prix pour les GPU et CPU, note × avis / prix sinon', () => {
    expect(valueScore(group('RTX 5070 Dual', 'gpu', 600))).toEqual({ method: 'performance', basis: 28651, score: 4775.2 });
    const headset = valueScore(group('Casque X', 'headset', 100, [[4, 100], [5, 300]]));
    expect(headset).toMatchObject({ method: 'rating', basis: 4.8, reviews: 400 });
    expect(headset!.score).toBeCloseTo((4.75 * Math.log10(401)) / 100 * 100, 1);
    expect(valueScore(group('Casque sans avis', 'headset', 100))).toBeUndefined();
  });
});

describe('recherche « 5090 »', () => {
  const offer = (title: string, price: number, shipping: number | null = 0) =>
    makeOffer({ merchantId: `m-${title}`, merchantName: 'M', title, url: `https://m.test/${encodeURIComponent(title)}`, price, shipping });
  const connector = (queries: string[]): Connector => ({
    id: 'fake',
    merchantId: 'fake',
    aggregator: true,
    enabled: () => true,
    async search(q) {
      queries.push(`${q.q}|${q.searchText ?? ''}`);
      return [
        offer('ASUS ROG Astral GeForce RTX 5090 32GB', 3200, 10),
        offer('Gigabyte GeForce RTX 5090 WINDFORCE OC 32G', 2500, null),
        offer('MSI GeForce RTX 5090 D 32G', 2400),
        offer('PC Gamer Ryzen 9 RTX 5090 64 Go', 4500),
        offer('Batterie externe 5090mAh', 20),
      ];
    },
  });

  it('ne garde que les cartes RTX 5090, triables par prix total et par rapport qualité-prix', async () => {
    const queries: string[] = [];
    const engine = new SearchEngine([connector(queries)], { timeoutMs: 1000, cacheTtlMs: 1000, merchantNames: new Map() });
    const asc = await engine.search({ q: '5090', sort: 'price-asc' });
    expect(queries[0]).toBe('rtx 5090|carte graphique RTX 5090');
    expect(asc.detectedCategory).toBe('gpu');
    // Ni PC complet, ni batterie « 5090mAh », ni RTX 5090 D (puce chinoise distincte).
    expect(asc.groups.map((g) => g.bestOffer.totalPrice)).toEqual([2500, 3210]);
    const desc = await engine.search({ q: '5090', sort: 'price-desc' });
    expect(desc.groups.map((g) => g.bestOffer.totalPrice)).toEqual([3210, 2500]);
    const value = await engine.search({ q: '5090', sort: 'value' });
    expect(value.groups.map((g) => g.bestOffer.totalPrice)).toEqual([2500, 3210]);
    expect(value.groups[0].value?.method).toBe('performance');
  });
});

describe('aperçu temps réel', () => {
  it('relit les sources en direct et renvoie le même produit', async () => {
    let calls = 0;
    const live: Connector = {
      id: 'scrape:x',
      merchantId: 'x',
      live: true,
      enabled: () => true,
      async search(q) {
        calls += 1;
        expect(q.maxAgeMs === undefined || q.maxAgeMs === 60_000).toBe(true);
        return [makeOffer({ merchantId: 'x', merchantName: 'X', sourceId: '1', title: 'MSI GeForce RTX 5070 VENTUS 2X OC', url: 'https://x.test/1', price: 600 + calls })];
      },
    };
    const engine = new SearchEngine([live], { timeoutMs: 1000, cacheTtlMs: 600_000, merchantNames: new Map() });
    const first = await engine.search({ q: 'rtx 5070' });
    await engine.search({ q: 'rtx 5070' });
    expect(calls).toBe(1);
    const group = await engine.refreshGroup({ q: 'rtx 5070' }, first.groups[0].key, first.groups[0].title, 60_000);
    expect(calls).toBe(2);
    expect(group?.bestOffer.price).toBe(602);
  });
});
