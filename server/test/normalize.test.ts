import { describe, expect, it } from 'vitest';
import {
  detectCategory,
  detectCondition,
  fingerprint,
  normalizeGtin,
  normalizeText,
  parseBoolean,
  parseCondition,
  parsePrice,
  tokenize,
} from '../src/search/normalize.js';
import { extractConditionIntent, prepareQuery, relevance, MIN_RELEVANCE } from '../src/search/relevance.js';

describe('normalizeText / tokenize', () => {
  it('supprime accents et ponctuation', () => {
    expect(normalizeText('Pâte Thermique « Arctic » MX-6 !')).toBe('pate thermique arctic mx-6');
  });

  it('unifie les unités de capacité', () => {
    expect(tokenize('SSD 2 TB')).toContain('2to');
    expect(tokenize('iPhone 15 128GB')).toContain('128go');
    expect(tokenize('iPhone 15 128 Go')).toContain('128go');
  });

  it('découpe les références composées', () => {
    expect(tokenize('Core i5-14600K')).toEqual(expect.arrayContaining(['i5-14600k', 'i5', '14600k']));
  });
});

describe('parsePrice', () => {
  it.each([
    ['1 299,99 €', 1299.99],
    ['12.99 EUR', 12.99],
    ['1.299,00', 1299],
    ['1,299.50', 1299.5],
    ['1.299', 1299],
    ['529,00', 529],
    ['19,9', 19.9],
    [42, 42],
  ])('%s → %s', (input, expected) => {
    expect(parsePrice(input)).toBe(expected);
  });

  it('rejette les valeurs non numériques', () => {
    expect(parsePrice('gratuit')).toBeNull();
    expect(parsePrice(undefined)).toBeNull();
  });
});

describe('detectCategory', () => {
  it.each([
    ['Apple iPhone 15 128 Go', 'smartphone'],
    ['Coque Spigen pour iPhone 15', 'accessory'],
    ['Câble USB-C vers Lightning Apple', 'cable'],
    ['PC portable gamer ASUS ROG Strix G16 RTX 5070 Ti', 'laptop'],
    ['Carte graphique MSI GeForce RTX 5070', 'gpu'],
    ['Ventirad Noctua NH-D15 compatible Ryzen AM5', 'cooling'],
    ['Pâte thermique Arctic MX-6', 'thermal-paste'],
    ['NAS Synology DS224+', 'nas'],
    ['Serveur Dell PowerEdge R740', 'server'],
    ['Disque dur Seagate IronWolf 8 To', 'hdd'],
    ['Chargeur Anker 65W GaN', 'charger'],
    ['Samsung Galaxy Tab S10', 'tablet'],
  ])('%s → %s', (title, expected) => {
    expect(detectCategory(title)).toBe(expected);
  });

  it('renvoie null si rien ne correspond', () => {
    expect(detectCategory('Le Petit Prince')).toBeNull();
  });
});

describe('conditions', () => {
  it('détecte reconditionné / occasion / neuf', () => {
    expect(detectCondition('iPhone 13 - Reconditionné - Très bon état')).toBe('refurbished');
    expect(detectCondition('MacBook Air occasion')).toBe('used');
    expect(detectCondition('RTX 5070 Founders Edition')).toBe('new');
  });

  it('interprète les valeurs de flux', () => {
    expect(parseCondition('refurbished')).toBe('refurbished');
    expect(parseCondition('Used')).toBe('used');
    expect(parseCondition('new', 'iPhone 12 reconditionné grade A')).toBe('refurbished');
    expect(parseCondition(undefined, 'Galaxy S24')).toBe('new');
  });

  it('extrait l’intention d’état de la requête', () => {
    expect(extractConditionIntent('iphone 15 reconditionné')).toEqual({ query: 'iphone 15', conditions: ['refurbished'] });
    expect(extractConditionIntent('thinkpad d’occasion')).toEqual({ query: 'thinkpad', conditions: ['used'] });
    expect(extractConditionIntent('rtx 5070')).toEqual({ query: 'rtx 5070', conditions: [] });
  });
});

describe('normalizeGtin / parseBoolean', () => {
  it('valide la clé de contrôle et normalise sur 14 chiffres', () => {
    expect(normalizeGtin('4006381333931')).toBe('04006381333931');
    expect(normalizeGtin('4006381333932')).toBeUndefined();
    expect(normalizeGtin('abc')).toBeUndefined();
  });

  it('comprend les disponibilités FR/EN', () => {
    expect(parseBoolean('in stock')).toBe(true);
    expect(parseBoolean('En stock')).toBe(true);
    expect(parseBoolean('rupture de stock')).toBe(false);
    expect(parseBoolean('0')).toBe(false);
    expect(parseBoolean('')).toBeNull();
  });
});

describe('relevance', () => {
  const q = prepareQuery('rtx 5070');

  it('écarte les déclinaisons du modèle demandé (RTX 5070 ≠ RTX 5070 Ti)', () => {
    const exact = relevance(q, 'Carte graphique NVIDIA GeForce RTX 5070 12 Go');
    const ti = relevance(q, 'Carte graphique NVIDIA GeForce RTX 5070 Ti 16 Go');
    expect(exact).toBeGreaterThanOrEqual(MIN_RELEVANCE);
    expect(ti).toBeLessThan(MIN_RELEVANCE);
  });

  it('ne pénalise pas la marque de la puce absente du titre marchand', () => {
    const full = prepareQuery('NVIDIA GeForce RTX 5070');
    expect(relevance(full, 'ASUS Dual GeForce RTX 5070 OC')).toBeGreaterThanOrEqual(MIN_RELEVANCE);
    expect(relevance(full, 'MSI RTX 5070 12G SHADOW 2X OC')).toBeGreaterThanOrEqual(MIN_RELEVANCE);
    expect(relevance(prepareQuery('AMD Ryzen 7 9800X3D'), 'Processeur Ryzen 7 9800X3D')).toBeGreaterThanOrEqual(MIN_RELEVANCE);
    expect(relevance(full, 'MSI RTX 5080 16G')).toBeLessThan(MIN_RELEVANCE);
  });

  it('exige les nombres de la requête', () => {
    expect(relevance(q, 'Carte graphique NVIDIA GeForce RTX 5080')).toBeLessThan(MIN_RELEVANCE);
    expect(relevance(prepareQuery('iphone 15'), 'Apple iPhone 150')).toBeLessThan(MIN_RELEVANCE);
  });

  it('accepte les préfixes et les références composées', () => {
    expect(relevance(prepareQuery('ryz 7800x3d'), 'AMD Ryzen 7 7800X3D')).toBeGreaterThanOrEqual(MIN_RELEVANCE);
    expect(relevance(prepareQuery('i5-14600k'), 'Intel Core i5 14600K')).toBeGreaterThanOrEqual(MIN_RELEVANCE);
  });
});

describe('fingerprint', () => {
  it('ignore état, couleur et ordre des mots', () => {
    expect(fingerprint('Apple iPhone 15 128 Go Noir - Reconditionné Très bon état')).toBe(fingerprint('iPhone 15 Apple 128GB'));
  });
});
