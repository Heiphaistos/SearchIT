import { beforeAll, describe, expect, it } from 'vitest';
import { loadCatalog, type Catalog } from '../src/catalog/index.js';
import { isCategoryId } from '../src/shared/categories.js';

let catalog: Catalog;
beforeAll(async () => {
  catalog = await loadCatalog();
});

describe('catalogue de référence', () => {
  it('contient une base conséquente et cohérente', () => {
    expect(catalog.size).toBeGreaterThan(1000);
    const names = new Set<string>();
    for (const p of catalog.products) {
      expect(isCategoryId(p.category), p.id).toBe(true);
      expect(p.id.startsWith(`${p.category}-`), p.id).toBe(true);
      expect(p.id, p.id).toMatch(/^[a-z0-9-]+$/);
      expect(p.brand.trim(), p.id).not.toBe('');
      if (p.year !== undefined) expect(p.year, p.id).toBeGreaterThanOrEqual(2010);
      if (p.year !== undefined) expect(p.year, p.id).toBeLessThanOrEqual(2026);
      if (p.msrp !== undefined) expect(p.msrp, p.id).toBeGreaterThan(0);
      if (p.msrp !== undefined) expect(p.msrp, p.id).toBeLessThan(60_000);
      for (const [k, v] of Object.entries(p.specs)) expect(String(v).trim(), `${p.id} ${k}`).not.toBe('');
      const key = `${p.category}|${p.name.toLowerCase()}`;
      expect(names.has(key), `nom en double : ${p.name}`).toBe(false);
      names.add(key);
    }
  });

  it('reconnaît les produits dans des titres marchands', () => {
    expect(catalog.match('Carte graphique NVIDIA GeForce RTX 5070 12 Go GDDR7', 'gpu')?.name).toBe('NVIDIA GeForce RTX 5070');
    expect(catalog.match('Carte graphique NVIDIA GeForce RTX 5070 Ti 16 Go', 'gpu')?.name).toBe('NVIDIA GeForce RTX 5070 Ti');
    expect(catalog.match('Processeur AMD Ryzen 7 7800X3D (4.2 GHz) AM5', 'cpu')?.name).toBe('AMD Ryzen 7 7800X3D');
    expect(catalog.match('Carte graphique inconnue XYZ 9000', 'gpu')).toBeUndefined();
  });

  it('liste, filtre et pagine', () => {
    const gpus = catalog.list({ category: 'gpu', sort: 'msrp-desc', pageSize: 5 });
    expect(gpus.total).toBeGreaterThan(40);
    expect(gpus.products).toHaveLength(5);
    const prices = gpus.products.map((p) => p.msrp ?? -1);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
    expect(catalog.list({ q: 'ryzen 9800x3d' }).products[0]?.name).toMatch(/9800X3D/);
    expect(catalog.suggest('synol', 5).every((n) => /Synology/.test(n))).toBe(true);
  });
});
