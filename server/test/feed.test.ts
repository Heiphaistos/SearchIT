import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { detectFormat, OfferIndex, parseFeed, recordToOffer } from '../src/connectors/feed.js';
import type { MerchantDefinition } from '../src/merchants.js';
import type { Offer } from '../src/shared/types.js';

const fixtures = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');
const read = (name: string) => fs.readFileSync(path.join(fixtures, name), 'utf8');

const merchant = (overrides: Partial<MerchantDefinition> = {}): MerchantDefinition => ({
  id: 'test',
  name: 'Test Shop',
  website: 'https://example.test',
  country: 'FR',
  refurbished: true,
  kind: 'feed',
  searchUrl: 'https://example.test/search?q={q}',
  ...overrides,
});

function offersFrom(file: string, m = merchant(), keepAll = false): Offer[] {
  return parseFeed(read(file))
    .map((r) => recordToOffer(r, m, keepAll))
    .filter((o): o is Offer => o !== null);
}

describe('parseFeed', () => {
  it('détecte le format', () => {
    expect(detectFormat(read('awin.csv'))).toBe('csv');
    expect(detectFormat(read('google.xml'))).toBe('xml');
    expect(detectFormat(read('products.json'))).toBe('json');
  });

  it('lit un flux CSV Awin et ignore les produits non high-tech', () => {
    const offers = offersFrom('awin.csv');
    expect(offers.map((o) => o.title)).toEqual([
      'Samsung SSD 990 PRO 2 To NVMe M.2',
      'Apple iPhone 15 128 Go Noir - Reconditionné, Très bon état',
      'Pâte thermique Arctic MX-6 4g',
    ]);
    const [ssd, iphone, paste] = offers;
    expect(ssd).toMatchObject({ price: 169.9, shipping: 0, totalPrice: 169.9, category: 'ssd', condition: 'new', inStock: true, brand: 'Samsung' });
    expect(iphone).toMatchObject({ price: 529, shipping: 4.99, totalPrice: 533.99, category: 'smartphone', condition: 'refurbished' });
    expect(paste).toMatchObject({ category: 'thermal-paste', inStock: false, shipping: null });
  });

  it('garde tout le flux avec keepAll', () => {
    expect(offersFrom('awin.csv', merchant(), true)).toHaveLength(4);
  });

  it('lit un flux XML Google Merchant (prix promo, livraison imbriquée, GTIN)', () => {
    const offers = offersFrom('google.xml');
    expect(offers).toHaveLength(2);
    expect(offers[0]).toMatchObject({
      title: 'iPhone 13 128 Go - Minuit - Débloqué',
      price: 379,
      shipping: 0,
      condition: 'new',
      gtin: '00194252707340',
      imageUrl: 'https://img.example/iphone13.jpg',
      inStock: true,
    });
    expect(offers[1]).toMatchObject({ price: 19.99, category: 'charger', inStock: false });
  });

  it('requalifie « new » en reconditionné pour un marchand 100 % reconditionné', () => {
    const offers = offersFrom('google.xml', merchant({ refurbishedOnly: true }));
    expect(offers[0].condition).toBe('refurbished');
  });

  it('trouve les produits dans un JSON imbriqué', () => {
    const offers = offersFrom('products.json');
    expect(offers).toHaveLength(2);
    expect(offers[0]).toMatchObject({ price: 2190, category: 'server', condition: 'refurbished', inStock: true, brand: 'Dell' });
    expect(offers[1]).toMatchObject({ price: 21.9, category: 'network', inStock: false });
  });
});

describe('OfferIndex', () => {
  const index = new OfferIndex(offersFrom('awin.csv'));

  it('exige tous les mots et accepte les préfixes', () => {
    expect(index.search('990 pro', 10).map((o) => o.title)).toEqual(['Samsung SSD 990 PRO 2 To NVMe M.2']);
    expect(index.search('sams 990', 10)).toHaveLength(1);
    expect(index.search('990 pro 4 to', 10)).toHaveLength(0);
  });

  it('trie par prix total', () => {
    const idx = new OfferIndex([...offersFrom('awin.csv'), ...offersFrom('google.xml')]);
    const prices = idx.search('iphone', 10).map((o) => o.totalPrice);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});
