import fs from 'node:fs';
import path from 'node:path';
import { normalizeText, tokenize } from '../search/normalize.js';
import type { CatalogProduct } from './types.js';

/**
 * Photos des produits du catalogue de référence, sans clé d'API :
 * 1. l'image d'une offre réelle déjà relevée par SearchIT pour ce produit (historique des prix) ;
 * 2. sinon la vignette de l'article Wikipédia du produit, seulement si son titre contient le modèle exact.
 * Résultats (y compris « pas d'image ») mis en cache sur disque.
 */

export interface CatalogImage {
  url: string;
  source: 'offre' | 'wikipedia';
  page?: string;
}

interface CacheEntry {
  img: CatalogImage | null;
  at: number;
}

const FOUND_TTL = 30 * 86_400_000;
const MISS_TTL = 7 * 86_400_000;
const WIKI_TIMEOUT = 6000;
// Politesse envers Wikipédia : 2 recherches simultanées et 300 par heure au plus (au-delà : réessai plus tard).
const WIKI_CONCURRENCY = 2;
const WIKI_PER_HOUR = 300;
const UA = 'SearchIT/1.4 (+https://searchit.heiphaistos.org; catalogue images)';

/** Jetons distinctifs d'un nom (contenant un chiffre) : « 9800x3d », « s24 », « ax210 »… */
function modelTokens(name: string): string[] {
  return tokenize(name).filter((t) => /\d/.test(t) && t.length >= 2);
}

export function matchesProduct(product: Pick<CatalogProduct, 'name'>, title: string): boolean {
  if (!modelTokens(product.name).length) return false;
  // Tous les jetons du nom (dont au moins un jeton « modèle ») doivent figurer dans le titre de l'offre.
  const words = new Set(tokenize(title));
  return tokenize(product.name).every((t) => words.has(t));
}

export class CatalogImages {
  private cache = new Map<string, CacheEntry>();
  private inflight = new Map<string, Promise<CatalogImage | null | undefined>>();
  private saveTimer: NodeJS.Timeout | null = null;
  private wikiActive = 0;
  private waiting: Array<() => void> = [];
  private wikiWindow = { start: 0, count: 0 };

  constructor(
    private file: string | null,
    private offerImages: () => Array<{ title: string; image: string }>,
    private fetchImpl: typeof fetch = fetch,
  ) {
    if (!file) return;
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, CacheEntry>;
      for (const [k, v] of Object.entries(data)) this.cache.set(k, v);
    } catch {
      // premier démarrage
    }
  }

  /** Image du produit ; `null` = aucune image connue ; `undefined` = pas encore cherchée (quota Wikipédia). */
  async get(product: CatalogProduct): Promise<CatalogImage | null | undefined> {
    const hit = this.cache.get(product.id);
    if (hit && Date.now() - hit.at < (hit.img ? FOUND_TTL : MISS_TTL)) return hit.img;
    // Une image d'offre réelle est gratuite à chercher : toujours retentée.
    const fromOffer = this.fromOffers(product);
    if (fromOffer) return this.store(product.id, fromOffer);
    let pending = this.inflight.get(product.id);
    if (!pending) {
      if (!this.takeWikiSlot()) return undefined; // quota atteint : rien n'est mis en cache, on réessaiera
      pending = this.acquire()
        .then(() => this.fromWikipedia(product))
        // Wikipédia injoignable : rien n'est mis en cache, on réessaiera à la prochaine demande.
        .then((img) => this.store(product.id, img), () => undefined)
        .finally(() => {
          this.release();
          this.inflight.delete(product.id);
        });
      this.inflight.set(product.id, pending);
    }
    return pending;
  }

  private takeWikiSlot(): boolean {
    const now = Date.now();
    if (now - this.wikiWindow.start > 3_600_000) this.wikiWindow = { start: now, count: 0 };
    if (this.wikiWindow.count >= WIKI_PER_HOUR || this.waiting.length >= 100) return false;
    this.wikiWindow.count++;
    return true;
  }

  private acquire(): Promise<void> {
    if (this.wikiActive < WIKI_CONCURRENCY) {
      this.wikiActive++;
      return Promise.resolve();
    }
    return new Promise((resolve) => this.waiting.push(resolve));
  }

  private release(): void {
    const next = this.waiting.shift();
    if (next) next(); // le créneau passe directement au suivant
    else this.wikiActive--;
  }

  private fromOffers(product: CatalogProduct): CatalogImage | null {
    for (const o of this.offerImages()) if (matchesProduct(product, o.title)) return { url: o.image, source: 'offre' };
    return null;
  }

  private async fromWikipedia(product: CatalogProduct): Promise<CatalogImage | null> {
    const models = modelTokens(product.name);
    if (!models.length) return null;
    for (const lang of ['fr', 'en']) {
      const params = new URLSearchParams({
        action: 'query', format: 'json', formatversion: '2', generator: 'search', gsrsearch: product.name, gsrlimit: '3',
        prop: 'pageimages', piprop: 'thumbnail', pithumbsize: '480', origin: '*',
      });
      const res = await this.fetchImpl(`https://${lang}.wikipedia.org/w/api.php?${params}`, {
        headers: { 'user-agent': UA, accept: 'application/json' },
        signal: AbortSignal.timeout(WIKI_TIMEOUT),
      });
      if (!res.ok) continue;
      const data = (await res.json()) as { query?: { pages?: Array<{ title: string; index?: number; thumbnail?: { source: string } }> } };
      const pages = (data.query?.pages ?? []).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
      for (const page of pages) {
        const title = normalizeText(page.title);
        const url = page.thumbnail?.source;
        // Le titre de l'article doit nommer ce modèle précis (pas une liste ou la marque).
        if (url && /^https:\/\//.test(url) && models.every((m) => title.includes(m))) {
          return { url, source: 'wikipedia', page: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}` };
        }
      }
    }
    return null;
  }

  private store(id: string, img: CatalogImage | null): CatalogImage | null {
    this.cache.set(id, { img, at: Date.now() });
    this.scheduleSave();
    return img;
  }

  private scheduleSave(): void {
    if (!this.file || this.saveTimer) return;
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      try {
        fs.mkdirSync(path.dirname(this.file!), { recursive: true });
        fs.writeFileSync(this.file!, JSON.stringify(Object.fromEntries(this.cache)));
      } catch {
        // disque en lecture seule : cache mémoire uniquement
      }
    }, 5000);
    this.saveTimer.unref?.();
  }
}
