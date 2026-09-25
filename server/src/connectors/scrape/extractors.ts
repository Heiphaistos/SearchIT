import { parsePrice } from '../../search/normalize.js';

// Extraction des produits d'une page de recherche marchande, à partir des données
// que la page embarque elle-même (état d'hydratation, appels analytics, balisage HTML en dernier recours).

export interface ScrapedItem {
  sourceId: string;
  title: string;
  url: string;
  price: number;
  inStock?: boolean | null;
  imageUrl?: string;
  rating?: number;
  reviews?: number;
}

export type Extractor = (html: string, pageUrl: string) => ScrapedItem[];

/** Chaîne littérale JS/JSON (« < », « \" ») → texte. */
function unescapeLiteral(s: string): string {
  try {
    return JSON.parse(`"${s.replace(/\\'/g, "'")}"`) as string;
  } catch {
    return s;
  }
}

const decodeEntities = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

const text = (html: string) => decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

const absolute = (href: string, base: string) => new URL(decodeEntities(href), base).href;

/**
 * TopAchat (SvelteKit) : la liste est embarquée dans l'état d'hydratation de la page,
 * `products:[{ref:"…",label:"…",offer:{…price_final:…},reviews:{…},url_product:"…"}]`.
 */
export const topachat: Extractor = (html, pageUrl) => {
  const items: ScrapedItem[] = [];
  const re = /\{ref:"([^"]+)",label:"((?:[^"\\]|\\.)*)"[\s\S]*?url_product:"([^"]+)"/g;
  for (const m of html.matchAll(re)) {
    const body = m[0];
    // Une fiche sans url_product ferait déborder la capture sur la suivante : ignorée.
    if (body.indexOf('{ref:"', 1) >= 0) continue;
    const price = Number(body.match(/price_final:([\d.]+)/)?.[1]);
    if (!Number.isFinite(price) || price <= 0) continue;
    const availability = body.match(/availability:\{code:"([^"]+)"/)?.[1];
    const reviews = body.match(/count_rating:(\d+),average_rating:([\d.]+)/);
    items.push({
      sourceId: m[1],
      title: unescapeLiteral(m[2]),
      url: absolute(unescapeLiteral(m[3]), pageUrl),
      price,
      inStock: availability ? availability === 'available' : null,
      rating: reviews && Number(reviews[1]) > 0 ? Number(reviews[2]) : undefined,
      reviews: reviews && Number(reviews[1]) > 0 ? Number(reviews[1]) : undefined,
    });
  }
  return items;
};

/**
 * Cybertek : chaque produit porte l'appel analytics
 * `GTMEvents.addToCart('réf', 'nom', 'marque', 'catégorie', prix)` suivi de l'URL de la fiche.
 */
export const cybertek: Extractor = (html, pageUrl) => {
  const items: ScrapedItem[] = [];
  const str = String.raw`'((?:[^'\\]|\\.)*)'`;
  const re = new RegExp(String.raw`GTMEvents\.addToCart\(\s*${str},\s*${str},\s*${str},\s*${str},\s*([\d.]+)\s*\);\s*trackProductClick\(\s*'[^']*?[?&]url=([^&']+)`, 'g');
  for (const m of html.matchAll(re)) {
    const price = Number(m[5]);
    if (!Number.isFinite(price) || price <= 0) continue;
    const name = decodeEntities(unescapeLiteral(m[2]));
    const brand = decodeEntities(unescapeLiteral(m[3]));
    items.push({
      sourceId: m[1],
      title: brand && !name.toLowerCase().startsWith(brand.toLowerCase()) ? `${brand} ${name}` : name,
      url: absolute(decodeURIComponent(m[6]), pageUrl),
      price,
    });
  }
  return items;
};

/** Alternate : pas de données structurées ; balisage des cartes produit (dernier recours). */
export const alternate: Extractor = (html, pageUrl) => {
  const items: ScrapedItem[] = [];
  const re = /<a href="([^"]+)" class="card[^"]*\bproductBox\b[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
  for (const m of html.matchAll(re)) {
    const card = m[2];
    const title = text(card.match(/class="product-name[^"]*">([\s\S]*?)<\/div>/)?.[1] ?? '');
    const price = parsePrice(card.match(/class="price[^"]*">([^<]+)</)?.[1]);
    if (!title || price === null || price <= 0) continue;
    const url = absolute(m[1], pageUrl);
    const image = card.match(/<img src="([^"]+)"/)?.[1];
    items.push({
      sourceId: url.match(/\/product\/(\d+)/)?.[1] ?? url,
      title,
      url,
      price,
      inStock: /availability-GREEN/.test(card) ? true : /availability-RED/.test(card) ? false : null,
      imageUrl: image ? absolute(image, pageUrl) : undefined,
    });
  }
  return items;
};
