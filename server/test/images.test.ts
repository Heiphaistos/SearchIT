import { describe, expect, it, vi } from 'vitest';
import { CatalogImages, matchesProduct } from '../src/catalog/images.js';
import type { CatalogProduct } from '../src/catalog/types.js';
import { detectCategory } from '../src/search/normalize.js';

const product = (name: string, id = 'x'): CatalogProduct => ({ id, name, brand: name.split(' ')[0], category: 'cpu', specs: {} });

describe('images du catalogue', () => {
  it('reconnaît une offre du même modèle, pas d’un modèle voisin', () => {
    const p = product('AMD Ryzen 7 9800X3D');
    expect(matchesProduct(p, 'Processeur AMD Ryzen 7 9800X3D (4,7 GHz / 5,2 GHz) Box')).toBe(true);
    expect(matchesProduct(p, 'AMD Ryzen 7 7800X3D')).toBe(false);
    expect(matchesProduct(p, 'AMD Ryzen 9 9800X3D')).toBe(false);
    expect(matchesProduct(product('Apple Magic Mouse'), 'Apple Magic Mouse')).toBe(false); // aucun jeton « modèle »
  });

  it('prend d’abord l’image d’une offre réelle, sans appeler Wikipédia', async () => {
    const fetchImpl = vi.fn();
    const images = new CatalogImages(null, () => [{ title: 'Intel Wi-Fi 6E AX210 NGW', image: 'https://img.example/ax210.jpg' }], fetchImpl as unknown as typeof fetch);
    expect(await images.get(product('Intel Wi-Fi 6E AX210'))).toEqual({ url: 'https://img.example/ax210.jpg', source: 'offre' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('n’accepte une vignette Wikipédia que si le titre nomme le modèle', async () => {
    const pages = [
      { title: 'Liste des processeurs AMD Ryzen', index: 1, thumbnail: { source: 'https://upload.wikimedia.org/liste.png' } },
      { title: 'iPhone 16', index: 2, thumbnail: { source: 'https://upload.wikimedia.org/iphone16.png' } },
    ];
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ query: { pages } })));
    const images = new CatalogImages(null, () => [], fetchImpl as unknown as typeof fetch);
    const img = await images.get(product('Apple iPhone 16', 'smartphone-apple-iphone-16'));
    expect(img?.url).toBe('https://upload.wikimedia.org/iphone16.png');
    expect(img?.source).toBe('wikipedia');
    // Mis en cache : pas de second appel.
    await images.get(product('Apple iPhone 16', 'smartphone-apple-iphone-16'));
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('ne met rien en cache quand Wikipédia est injoignable', async () => {
    const fetchImpl = vi.fn(async () => { throw new Error('offline'); });
    const images = new CatalogImages(null, () => [], fetchImpl as unknown as typeof fetch);
    expect(await images.get(product('AMD Ryzen 5 7600'))).toBeUndefined();
    await images.get(product('AMD Ryzen 5 7600'));
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
});

describe('cartes et antennes Wi-Fi', () => {
  it('classe les adaptateurs, cartes et antennes Wi-Fi en réseau', () => {
    expect(detectCategory('Adaptateur Wi-Fi USB TP-Link Archer T3U Plus')).toBe('network');
    expect(detectCategory('Carte Wi-Fi PCIe ASUS PCE-AXE59BT')).toBe('network');
    expect(detectCategory('Antenne Wi-Fi 8 dBi RP-SMA')).toBe('network');
    expect(detectCategory('Adaptateur USB-C vers HDMI')).toBe('cable');
  });
});
