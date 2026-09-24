import type { FastifyInstance } from 'fastify';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { config } from '../src/config.js';
import { parseEnginePcRequest, type EnginePcResult } from '../src/enginepc.js';
import { fromExternalCategory } from '../src/shared/categories.js';

// Contrat du configurateur EnginePC, sur le catalogue de démonstration.
let app: FastifyInstance;

beforeAll(async () => {
  app = await buildApp({ serveWeb: false, historyFile: null });
});

afterAll(async () => {
  await app.close();
});

afterEach(() => {
  config.apiKeys.length = 0;
});

const lookup = (payload: unknown, headers: Record<string, string> = {}) =>
  app.inject({ method: 'POST', url: '/api/v1/prices/lookup', payload: payload as object, headers });

describe('POST /api/v1/prices/lookup (EnginePC)', () => {
  it('mappe id/name/category et renvoie best + offers au format EnginePC', async () => {
    const res = await lookup({
      currency: 'EUR',
      country: 'FR',
      items: [
        { id: 'amd-ryzen-7-9800x3d', name: 'AMD Ryzen 7 9800X3D', category: 'cpu' },
        { id: 'nvidia-rtx-5070', name: 'NVIDIA GeForce RTX 5070', category: 'gpu' },
        { id: 'noctua-nh-d15-g2', name: 'Noctua NH-D15 G2', category: 'cooler' },
        { id: 'introuvable', name: 'zzzz produit inexistant', category: 'cpu' },
      ],
    });
    expect(res.statusCode).toBe(200);
    const { results } = res.json<{ results: EnginePcResult[] }>();
    // Produit introuvable : omis.
    expect(results.map((r) => r.id)).toEqual(['amd-ryzen-7-9800x3d', 'nvidia-rtx-5070', 'noctua-nh-d15-g2']);
    for (const r of results) {
      expect(r.best).toBeDefined();
      expect(r.offers[0]).toEqual(r.best);
      for (const o of r.offers) {
        expect(o).toMatchObject({ currency: 'EUR', demo: true });
        expect(typeof o.merchant).toBe('string');
        expect(typeof o.price).toBe('number');
        expect(typeof o.inStock).toBe('boolean');
        expect(o.url).toMatch(/^https:\/\//);
      }
    }
    // Pas d'occasion par défaut.
    expect(parseEnginePcRequest({ items: [{ id: 'a', name: 'b' }] }).conditions).toEqual(['new', 'refurbished']);
  });

  it('ignore les catégories inconnues au lieu de renvoyer 400', async () => {
    const res = await lookup({ items: [{ id: 'x', name: 'RTX 5080', category: 'soundcard-inconnue' }] });
    expect(res.statusCode).toBe(200);
    expect(res.json<{ results: EnginePcResult[] }>().results[0].id).toBe('x');
  });

  it('valide le corps et limite à 50 articles', async () => {
    expect((await lookup({})).statusCode).toBe(400);
    expect((await lookup({ items: [{ name: 'sans id' }] })).statusCode).toBe(400);
    expect((await lookup({ items: [{ id: 'a' }] })).statusCode).toBe(400);
    const items = Array.from({ length: 51 }, (_, i) => ({ id: `i${i}`, name: 'SSD' }));
    const res = await lookup({ items });
    expect(res.statusCode).toBe(400);
    expect(res.json().error).toMatch(/50/);
  });

  it('accepte la clé en Bearer ou en x-api-key quand API_KEYS est défini', async () => {
    config.apiKeys.push('secret-test');
    const body = { items: [{ id: 'cpu', name: 'Ryzen 5 7600X', category: 'cpu' }] };
    expect((await lookup(body)).statusCode).toBe(401);
    expect((await lookup(body, { authorization: 'Bearer mauvaise' })).statusCode).toBe(401);
    expect((await lookup(body, { authorization: 'Bearer secret-test' })).statusCode).toBe(200);
    expect((await lookup(body, { 'x-api-key': 'secret-test' })).statusCode).toBe(200);
    expect((await app.inject({ url: '/api/v1/search?q=ssd', headers: { authorization: 'Bearer secret-test' } })).statusCode).toBe(200);
  });

  it('expose le catalogue de référence sur /api/v1/catalog', async () => {
    const body = (await app.inject({ url: '/api/v1/catalog?category=cpu&pageSize=2' })).json();
    expect(body.products.length).toBeGreaterThan(0);
  });
});

describe('catégories EnginePC', () => {
  it('convertit les catégories et types d’appareils', () => {
    expect(fromExternalCategory('cooler')).toBe('cooling');
    expect(fromExternalCategory('phone')).toBe('smartphone');
    expect(fromExternalCategory('CPU')).toBe('cpu');
    expect(fromExternalCategory('laptop')).toBe('laptop');
    expect(fromExternalCategory('storage')).toBeUndefined();
    expect(fromExternalCategory('constructor')).toBeUndefined();
    expect(fromExternalCategory(42)).toBeUndefined();
  });
});

describe('sécurité HTTP', () => {
  it('limite le débit sur /api par IP réelle (X-Forwarded-For du proxy local)', async () => {
    // Les tests désactivent la limite (vitest.config.ts) : on la réactive le temps de ce test.
    const previous = config.rateLimitPerMinute;
    config.rateLimitPerMinute = 3;
    const limited = await buildApp({ serveWeb: false, historyFile: null });
    try {
      let last = 0;
      for (let i = 0; i <= 3; i++) {
        // 127.0.0.1 est un proxy de confiance : chaque IP transmise a son propre compteur.
        last = (await limited.inject({ url: '/api/search?q=ssd', headers: { 'x-forwarded-for': '203.0.113.7' } })).statusCode;
      }
      expect(last).toBe(429);
      expect((await limited.inject({ url: '/api/search?q=ssd', headers: { 'x-forwarded-for': '203.0.113.8' } })).statusCode).toBe(200);
    } finally {
      config.rateLimitPerMinute = previous;
      await limited.close();
    }
  });

  it('refuse les corps trop volumineux', async () => {
    const res = await lookup({ items: [{ id: 'a', name: 'x'.repeat(300 * 1024) }] });
    expect(res.statusCode).toBe(413);
  });
});
