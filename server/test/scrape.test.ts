import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { alternate, cybertek, topachat } from '../src/connectors/scrape/extractors.js';
import { resetDomains, SCRAPE_USER_AGENT } from '../src/connectors/scrape/fetcher.js';
import { createScrapeConnector } from '../src/connectors/scrape/index.js';
import { isAllowed, parseRobots } from '../src/connectors/scrape/robots.js';
import type { MerchantDefinition } from '../src/merchants.js';

const fixture = (name: string) => fs.readFileSync(path.join(import.meta.dirname, 'fixtures', 'scrape', `${name}.html`), 'utf8');

describe('robots.txt', () => {
  const rules = parseRobots(
    ['User-agent: *', 'Disallow: /recherche/', 'Disallow: /*?search_query=', 'Allow: /recherche/aide$', '', 'User-agent: SearchIT', 'Disallow: /prive'].join('\n'),
    'searchit',
  );
  const generic = parseRobots(['User-agent: *', 'Disallow: /recherche/', 'Disallow: /*?search_query=', 'Allow: /recherche/aide$'].join('\n'), 'searchit');

  it('applique le groupe propre à SearchIT quand il existe', () => {
    expect(isAllowed(rules, '/recherche/rtx/')).toBe(true);
    expect(isAllowed(rules, '/prive/x')).toBe(false);
  });

  it('respecte préfixes, jokers, ancrage et règle la plus longue', () => {
    expect(isAllowed(generic, '/recherche/rtx%205070/')).toBe(false);
    expect(isAllowed(generic, '/fr/liste?search_query=rtx')).toBe(false);
    expect(isAllowed(generic, '/recherche/aide')).toBe(true);
    expect(isAllowed(generic, '/recherche/aide/x')).toBe(false);
    expect(isAllowed(generic, '/search/rtx')).toBe(true);
    expect(isAllowed(parseRobots('User-agent: *\nDisallow:', 'searchit'), '/tout')).toBe(true);
  });
});

describe('extraction des pages de recherche', () => {
  it('TopAchat : état d’hydratation SvelteKit', () => {
    const items = topachat(fixture('topachat'), 'https://www.topachat.com/pages/liste.html');
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      sourceId: 'in20027608',
      title: 'Gigabyte GeForce RTX 5070 EAGLE OC SFF',
      price: 969.99,
      inStock: true,
      rating: 4.3,
      reviews: 3,
      url: 'https://www.topachat.com/pages/detail2_cat_est_micro_puis_rubrique_est_wgfx_pcie_puis_ref_est_in20027608.html',
    });
  });

  it('Cybertek : appel analytics addToCart et URL de la fiche', () => {
    const items = cybertek(fixture('cybertek'), 'https://www.cybertek.fr/boutique/produit.aspx?q=rtx');
    expect(items).toHaveLength(2);
    expect(items[1]).toMatchObject({
      sourceId: '00602404',
      title: 'Asus PRIME GeForce RTX 5070 12GB GDDR7 OC Edition',
      price: 849.95,
      url: 'https://cybertek.fr/carte-graphique/asus-prime-geforce-rtx-5070-12gb-gddr7-oc-edition-151450.aspx',
    });
  });

  it('Alternate : cartes produit (balisage HTML)', () => {
    const items = alternate(fixture('alternate'), 'https://www.alternate.fr/listing.xhtml?q=rtx');
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      sourceId: '100115970',
      title: 'PNY GeForce RTX 5070 ARGB OC, Carte graphique',
      price: 825,
      inStock: true,
      url: 'https://www.alternate.fr/PNY/GeForce-RTX-5070-ARGB-OC-Carte-graphique/html/product/100115970',
    });
    expect(items[0].imageUrl).toMatch(/^https:\/\/www\.alternate\.fr\/p\//);
  });
});

describe('connecteur de page de recherche', () => {
  const merchant = (host: string): MerchantDefinition => ({ id: host, name: host, website: `https://${host}`, country: 'FR', refurbished: false, kind: 'scrape', searchUrl: '' });
  const q = { q: 'rtx 5070', category: null, limit: 60 };
  let calls: Array<{ url: string; ua: string | null; at: number }>;

  const mockFetch = (responder: (url: string) => Response) => {
    calls = [];
    vi.stubGlobal('fetch', vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      calls.push({ url, ua: new Headers(init?.headers).get('user-agent'), at: Date.now() });
      return responder(url);
    }));
  };

  beforeEach(() => {
    process.env.SCRAPE = 'on';
    resetDomains();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    process.env.SCRAPE = 'off';
  });

  it('lit robots.txt, s’identifie, espace ses requêtes de 2 s et met en cache', async () => {
    mockFetch((url) => new Response(url.endsWith('/robots.txt') ? 'User-agent: *\nDisallow: /panier' : fixture('alternate')));
    const c = createScrapeConnector({ merchantId: 'a.test', searchUrl: 'https://a.test/listing?q={q}', extract: alternate }, merchant('a.test'));
    const offers = await c.search(q, AbortSignal.timeout(10_000));
    expect(offers).toHaveLength(2);
    expect(offers[0]).toMatchObject({ merchantId: 'a.test', category: 'gpu', url: expect.stringContaining('/product/100115970') });
    expect(calls.map((x) => x.url)).toEqual(['https://a.test/robots.txt', 'https://a.test/listing?q=rtx%205070']);
    expect(calls.every((x) => x.ua === SCRAPE_USER_AGENT)).toBe(true);
    expect(calls[1].at - calls[0].at).toBeGreaterThanOrEqual(1_950);
    await c.search(q, AbortSignal.timeout(10_000));
    expect(calls).toHaveLength(2);
    // Aperçu : relevé trop ancien → nouvelle lecture.
    await c.search({ ...q, maxAgeMs: 0 }, AbortSignal.timeout(10_000));
    expect(calls).toHaveLength(3);
    expect(c.state()).toEqual({ status: 'active' });
  }, 15_000);

  it('renonce quand robots.txt interdit la recherche', async () => {
    mockFetch((url) => new Response(url.endsWith('/robots.txt') ? 'User-agent: *\nDisallow: /listing' : 'jamais lu'));
    const c = createScrapeConnector({ merchantId: 'b.test', searchUrl: 'https://b.test/listing?q={q}', extract: alternate }, merchant('b.test'));
    expect(await c.search(q, AbortSignal.timeout(10_000))).toEqual([]);
    expect(calls).toHaveLength(1);
    expect(c.state()).toMatchObject({ status: 'robots' });
  });

  it('se met en pause sur un 403 (anti-robot) sans insister', async () => {
    mockFetch((url) => (url.endsWith('/robots.txt') ? new Response('') : new Response('Forbidden', { status: 403 })));
    const c = createScrapeConnector({ merchantId: 'c.test', searchUrl: 'https://c.test/s?q={q}', extract: alternate }, merchant('c.test'));
    expect(await c.search(q, AbortSignal.timeout(10_000))).toEqual([]);
    const state = c.state();
    expect(state.status).toBe('blocked');
    expect(Date.parse(state.pausedUntil!)).toBeGreaterThan(Date.now() + 25 * 60_000);
    expect(await c.search({ ...q, q: 'autre' }, AbortSignal.timeout(10_000))).toEqual([]);
    expect(calls).toHaveLength(2);
  }, 15_000);

  it('reste éteint quand la source est écartée ou la collecte désactivée', () => {
    const disabled = createScrapeConnector({ merchantId: 'd.test', searchUrl: 'https://d.test/?q={q}', disabled: { status: 'robots', detail: 'robots.txt interdit /' } }, merchant('d.test'));
    expect(disabled.enabled()).toBe(false);
    expect(disabled.state().status).toBe('robots');
    process.env.SCRAPE = 'off';
    expect(createScrapeConnector({ merchantId: 'e.test', searchUrl: 'https://e.test/?q={q}', extract: alternate }, merchant('e.test')).enabled()).toBe(false);
  });
});
