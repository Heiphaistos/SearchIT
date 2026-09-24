import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { buildApp } from '../src/app.js';
import { createGoogleShoppingConnector, parseDelivery, shoppingItemToOffer } from '../src/connectors/google-shopping.js';
import { createRegistry } from '../src/connectors/registry.js';
import { mapIcecat } from '../src/connectors/icecat.js';
import { shopifyProductToOffers, wooProductToOffer, type ShopifyProduct, type WooProduct } from '../src/connectors/stores.js';
import type { Connector } from '../src/connectors/types.js';
import { getMerchantDefinitions, resolveMerchant, type MerchantDefinition } from '../src/merchants.js';
import { parseEcbXml, setRates, toEur } from '../src/search/currency.js';
import { parsePrice } from '../src/search/normalize.js';
import { makeOffer } from '../src/search/offer.js';
import type { SearchResponse } from '../src/shared/types.js';

const store = (overrides: Partial<MerchantDefinition> = {}): MerchantDefinition => ({
  id: 'boutique',
  name: 'Boutique Test',
  website: 'https://boutique.test',
  storeUrl: 'https://boutique.test',
  country: 'FR',
  refurbished: false,
  kind: 'shopify',
  searchUrl: 'https://boutique.test/search?q={q}',
  ...overrides,
});

describe('Google Shopping', () => {
  it('associe les vendeurs aux marchands connus', () => {
    expect(resolveMerchant('Fnac.com')).toMatchObject({ id: 'fnac', name: 'Fnac' });
    expect(resolveMerchant('LDLC.com')).toMatchObject({ id: 'ldlc' });
    expect(resolveMerchant('Back Market')).toMatchObject({ id: 'backmarket', refurbishedOnly: true });
    expect(resolveMerchant('E.Leclerc')).toMatchObject({ id: 'leclerc' });
    expect(resolveMerchant('Amazon.fr - Seller')).toMatchObject({ id: 'amazon' });
    expect(resolveMerchant('Infomax Paris')).toMatchObject({ id: 'infomaxparis', name: 'Infomax Paris', refurbishedOnly: false });
    expect(resolveMerchant('Recommerce').refurbishedOnly).toBe(true);
  });

  it('interprète la livraison', () => {
    expect(parseDelivery('Livraison gratuite')).toBe(0);
    expect(parseDelivery('Free delivery')).toBe(0);
    expect(parseDelivery('+ 4,99 € de frais de livraison')).toBe(4.99);
    expect(parseDelivery(undefined)).toBeNull();
  });

  it('transforme un résultat en offre', () => {
    const offer = shoppingItemToOffer({
      title: 'Apple iPhone 15 128 Go Noir',
      merchant: 'Back Market',
      url: 'https://www.backmarket.fr/fr-fr/p/iphone-15',
      price: '529,00 €',
      delivery: 'Livraison gratuite',
      imageUrl: 'https://img.test/1.jpg',
      rating: 4.5,
      reviews: 1200,
      productId: '123',
    })!;
    expect(offer).toMatchObject({
      merchantId: 'backmarket',
      merchantName: 'Back Market',
      price: 529,
      shipping: 0,
      totalPrice: 529,
      condition: 'refurbished',
      category: 'smartphone',
      via: 'google-shopping',
      currency: 'EUR',
    });
    expect(shoppingItemToOffer({ title: 'x', merchant: 'y', url: '', price: '10 €' })).toBeNull();
    expect(shoppingItemToOffer({ title: 'RTX 5070', merchant: 'Newegg', url: 'https://n.test', price: '$549.99' })!.currency).toBe('USD');
  });

  it('lit les prix au format français (espaces insécables compris)', () => {
    expect(parsePrice('374,00 €')).toBe(374);
    expect(parsePrice('1 234,56 €')).toBe(1234.56);
    expect(parsePrice('1 234,56 €')).toBe(1234.56);
    expect(parsePrice('1 234,56 €')).toBe(1234.56);
    expect(parsePrice('Prix indisponible')).toBeNull();
  });

  it('interroge Serper (fetch simulé), garde le nom du marchand et dédoublonne les appels', async () => {
    vi.stubEnv('SERPER_API_KEY', 'cle-de-test');
    const fetchMock = vi.fn(async (_url: string | URL | Request, _init?: RequestInit) =>
      new Response(
        JSON.stringify({
          shopping: [
            { title: 'AMD Ryzen 7 9800X3D', source: 'Cdiscount', link: 'https://www.google.com/shopping/product/1', price: '1 234,56 €', productId: 'p1' },
            { title: 'AMD Ryzen 7 9800X3D reconditionné', source: 'ConfigGaming', link: 'https://www.google.com/shopping/product/2', price: '374,00 €' },
            { title: 'Prix cassé', source: 'X', link: 'https://www.google.com/shopping/product/3', price: 'n/a' },
          ],
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);
    try {
      const connector = createGoogleShoppingConnector();
      expect(connector.enabled()).toBe(true);
      const q = `ryzen 9800x3d test ${Date.now()}`;
      const signal = new AbortController().signal;
      const [a, b] = await Promise.all([connector.search({ q, category: null, limit: 10 }, signal), connector.search({ q, category: null, limit: 10 }, signal)]);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('https://google.serper.dev/shopping');
      expect(JSON.parse(String(init?.body))).toMatchObject({ q, gl: 'fr', hl: 'fr', num: 40 });
      expect(a.map((o) => o.id)).toEqual(b.map((o) => o.id));
      expect(a.map((o) => [o.merchantName, o.price, o.condition])).toEqual([
        ['Cdiscount', 1234.56, 'new'],
        ['ConfigGaming', 374, 'refurbished'],
      ]);
      // Cache : pas de second appel ; requête trop courte : aucun appel.
      await connector.search({ q, category: null, limit: 10 }, signal);
      expect(await connector.search({ q: 'a', category: null, limit: 10 }, signal)).toEqual([]);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    } finally {
      vi.unstubAllGlobals();
      vi.unstubAllEnvs();
    }
  });

  it('désactive la démo dès que Serper est configuré (DEMO_MODE=auto)', () => {
    vi.stubEnv('SERPER_API_KEY', 'cle-de-test');
    try {
      const demo = createRegistry().connectors.find((c) => c.id === 'demo');
      expect(demo?.enabled()).toBe(false);
    } finally {
      vi.unstubAllEnvs();
    }
    expect(createRegistry().connectors.find((c) => c.id === 'demo')?.enabled()).toBe(true);
  });

  it('est déclarée comme source agrégée', () => {
    const gs = getMerchantDefinitions().find((m) => m.id === 'google-shopping');
    expect(gs?.kind).toBe('google-shopping');
  });
});

describe('Boutiques publiques', () => {
  const product: ShopifyProduct = {
    id: 1,
    title: 'Fairphone 5',
    handle: 'fairphone-5',
    vendor: 'Fairphone',
    product_type: 'Smartphone',
    tags: ['reconditionné'],
    images: [{ src: 'https://cdn.test/fp5.jpg' }],
    variants: [
      { id: 11, title: '256 Go / Noir', price: '499.00', available: true, sku: 'FP5-256', barcode: '4006381333931' },
      { id: 12, title: '256 Go / Bleu', price: '499.00', available: false },
    ],
  };

  it('lit un produit Shopify (une offre par variante)', () => {
    const offers = shopifyProductToOffers(product, store(), 'EUR');
    expect(offers).toHaveLength(2);
    expect(offers[0]).toMatchObject({
      title: 'Fairphone 5 - 256 Go / Noir',
      url: 'https://boutique.test/products/fairphone-5?variant=11',
      price: 499,
      inStock: true,
      brand: 'Fairphone',
      gtin: '04006381333931',
      mpn: 'FP5-256',
      category: 'smartphone',
      condition: 'refurbished',
    });
    expect(offers[1].inStock).toBe(false);
  });

  it('ignore les produits non high-tech', () => {
    const tshirt: ShopifyProduct = { id: 2, title: 'T-shirt logo', handle: 't', product_type: 'Vêtements', variants: [{ id: 1, title: 'M', price: '25.00' }] };
    expect(shopifyProductToOffers(tshirt, store(), 'EUR')).toHaveLength(0);
  });

  it('lit un produit WooCommerce (prix en unités mineures)', () => {
    const p: WooProduct = {
      id: 7,
      name: 'Disque dur Seagate IronWolf 8 To &#8211; NAS',
      permalink: 'https://boutique.test/produit/ironwolf-8',
      sku: 'ST8000VN004',
      prices: { price: '18990', currency_code: 'EUR', currency_minor_unit: 2 },
      is_in_stock: true,
      categories: [{ name: 'Stockage' }],
    };
    expect(wooProductToOffer(p, store({ kind: 'woocommerce' }))).toMatchObject({
      title: 'Disque dur Seagate IronWolf 8 To – NAS',
      price: 189.9,
      category: 'hdd',
      inStock: true,
      mpn: 'ST8000VN004',
    });
  });
});

describe('Devises (BCE)', () => {
  it('lit le XML de la BCE et convertit en euros', () => {
    const rates = parseEcbXml(`<Cube><Cube time="2026-09-24"><Cube currency='USD' rate='1.10'/><Cube currency='GBP' rate='0.85'/></Cube></Cube>`);
    expect(rates.get('USD')).toBe(1.1);
    setRates(rates);
    const usd = makeOffer({ merchantId: 'x', merchantName: 'X', title: 'SSD', url: 'https://x.test', price: 110, shipping: 11, currency: 'USD' });
    expect(toEur(usd)).toMatchObject({ price: 100, shipping: 10, totalPrice: 110, currency: 'EUR', originalCurrency: 'USD', originalPrice: 110 });
    expect(toEur({ ...usd, currency: 'XXX' })).toBeNull();
  });
});

describe('Icecat', () => {
  it('extrait image, résumé et caractéristiques', () => {
    const sheet = mapIcecat({
      msg: 'OK',
      data: {
        GeneralInfo: { Title: 'Samsung 990 PRO 2 To', Brand: 'Samsung', BrandPartCode: 'MZ-V9P2T0BW', IcecatId: 42, SummaryDescription: { LongSummaryDescription: 'SSD NVMe' } },
        Image: { Pic500x500: 'https://images.icecat.biz/1.jpg' },
        FeaturesGroups: [{ FeatureGroup: { Name: { Value: 'Stockage' } }, Features: [{ Feature: { Name: { Value: 'Capacité' } }, PresentationValue: '2 To' }, { Feature: { Name: { Value: 'Vide' } } }] }],
      },
    });
    expect(sheet).toMatchObject({ found: true, brand: 'Samsung', image: 'https://images.icecat.biz/1.jpg', url: 'https://icecat.biz/p/42.html' });
    expect(sheet.specs).toEqual([{ group: 'Stockage', items: [{ name: 'Capacité', value: '2 To' }] }]);
    expect(mapIcecat({ msg: 'Not found' }).found).toBe(false);
  });
});

describe('moteur avec une source agrégée', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    setRates(new Map([['USD', 1.1]]));
    const mk = (merchantId: string, merchantName: string, price: number, currency = 'EUR') =>
      makeOffer({ merchantId, merchantName, title: 'Carte graphique NVIDIA GeForce RTX 5070 12 Go', url: `https://${merchantId}.test`, price, shipping: 0, currency, via: 'google-shopping' });
    const aggregator: Connector = {
      id: 'google-shopping',
      merchantId: 'google-shopping',
      aggregator: true,
      enabled: () => true,
      search: async () => [mk('fnac', 'Fnac', 579), mk('infomaxparis', 'Infomax Paris', 569), mk('newegg', 'Newegg', 605, 'USD')],
    };
    app = await buildApp({ serveWeb: false, registry: { connectors: [aggregator], merchants: [], merchantInfo: () => [] } });
  });

  afterAll(async () => {
    await app.close();
  });

  it('regroupe les vendeurs, convertit les devises et nomme les nouveaux marchands', async () => {
    const body = (await app.inject({ url: '/api/search?q=rtx%205070' })).json<SearchResponse>();
    expect(body.demo).toBe(false);
    const group = body.groups[0];
    expect(group.merchantCount).toBe(3);
    expect(group.bestOffer.merchantName).toBe('Newegg');
    expect(group.bestOffer).toMatchObject({ totalPrice: 550, originalCurrency: 'USD' });
    expect(body.facets.merchants.map((f) => f.label)).toContain('Infomax Paris');
  });

  it('applique le filtre marchand offre par offre', async () => {
    const body = (await app.inject({ url: '/api/search?q=rtx%205070&merchants=fnac' })).json<SearchResponse>();
    expect(body.groups[0].offers.map((o) => o.merchantId)).toEqual(['fnac']);
  });
});
