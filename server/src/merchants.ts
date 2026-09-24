import fs from 'node:fs';
import { config, env } from './config.js';

export type MerchantKind = 'amazon' | 'aliexpress' | 'ebay' | 'feed';

export interface MerchantDefinition {
  id: string;
  name: string;
  website: string;
  country: string;
  refurbished: boolean;
  /** Ne vend que du reconditionné (les offres « neuves » de son flux sont requalifiées). */
  refurbishedOnly?: boolean;
  kind: MerchantKind;
  /** Pour kind = feed : URL (http(s)://, file:// ou chemin local) du flux produits. */
  feedUrl?: string;
  feedFormat?: 'auto' | 'csv' | 'xml' | 'json';
  /** Modèle d'URL de recherche sur le site marchand, utilisé par le catalogue de démo. */
  searchUrl: string;
  notes?: string;
}

/**
 * Marchands connus. Les flux d'affiliation (Awin, Effinity, Kwanko, Kelkoo, Google Merchant…)
 * s'activent en renseignant FEED_<ID>_URL (id en majuscules, « - » → « _ »).
 */
const BUILTIN: MerchantDefinition[] = [
  { id: 'amazon', name: 'Amazon.fr', website: 'https://www.amazon.fr', country: 'FR', refurbished: true, kind: 'amazon', searchUrl: 'https://www.amazon.fr/s?k={q}', notes: 'Product Advertising API 5.0 (compte Partenaires Amazon requis). Inclut Amazon Seconde Vie / Renewed.' },
  { id: 'aliexpress', name: 'AliExpress', website: 'https://fr.aliexpress.com', country: 'CN', refurbished: false, kind: 'aliexpress', searchUrl: 'https://fr.aliexpress.com/w/wholesale-{q}.html', notes: 'AliExpress Open Platform – API Affiliate (app key + secret + tracking id).' },
  { id: 'ebay', name: 'eBay', website: 'https://www.ebay.fr', country: 'FR', refurbished: true, kind: 'ebay', searchUrl: 'https://www.ebay.fr/sch/i.html?_nkw={q}', notes: 'eBay Browse API (OAuth client credentials). Neuf, reconditionné certifié et occasion.' },
  { id: 'backmarket', refurbishedOnly: true, name: 'Back Market', website: 'https://www.backmarket.fr', country: 'FR', refurbished: true, kind: 'feed', searchUrl: 'https://www.backmarket.fr/fr-fr/search?q={q}', notes: 'Flux produits via programme d’affiliation Back Market.' },
  { id: 'fnac', name: 'Fnac', website: 'https://www.fnac.com', country: 'FR', refurbished: true, kind: 'feed', searchUrl: 'https://www.fnac.com/SearchResult/ResultList.aspx?Search={q}', notes: 'Flux Awin / Effinity.' },
  { id: 'ldlc', name: 'LDLC', website: 'https://www.ldlc.com', country: 'FR', refurbished: false, kind: 'feed', searchUrl: 'https://www.ldlc.com/recherche/{q}/', notes: 'Flux via plateforme d’affiliation LDLC.' },
  { id: 'leclerc', name: 'E.Leclerc', website: 'https://www.e.leclerc', country: 'FR', refurbished: true, kind: 'feed', searchUrl: 'https://www.e.leclerc/recherche?q={q}', notes: 'Flux via réseau d’affiliation.' },
  { id: 'cdiscount', name: 'Cdiscount', website: 'https://www.cdiscount.com', country: 'FR', refurbished: true, kind: 'feed', searchUrl: 'https://www.cdiscount.com/search/10/{q}.html', notes: 'Flux Cdiscount (affiliation).' },
  { id: 'rakuten', name: 'Rakuten', website: 'https://fr.shopping.rakuten.com', country: 'FR', refurbished: true, kind: 'feed', searchUrl: 'https://fr.shopping.rakuten.com/search/{q}', notes: 'Flux Rakuten Advertising.' },
  { id: 'boulanger', name: 'Boulanger', website: 'https://www.boulanger.com', country: 'FR', refurbished: true, kind: 'feed', searchUrl: 'https://www.boulanger.com/resultats?tr={q}' },
  { id: 'darty', name: 'Darty', website: 'https://www.darty.com', country: 'FR', refurbished: true, kind: 'feed', searchUrl: 'https://www.darty.com/nav/recherche?text={q}' },
  { id: 'materielnet', name: 'Materiel.net', website: 'https://www.materiel.net', country: 'FR', refurbished: false, kind: 'feed', searchUrl: 'https://www.materiel.net/recherche/{q}/' },
  { id: 'topachat', name: 'TopAchat', website: 'https://www.topachat.com', country: 'FR', refurbished: false, kind: 'feed', searchUrl: 'https://www.topachat.com/pages/recherche.php?mc={q}' },
  { id: 'rueducommerce', name: 'Rue du Commerce', website: 'https://www.rueducommerce.fr', country: 'FR', refurbished: true, kind: 'feed', searchUrl: 'https://www.rueducommerce.fr/r/{q}.html' },
  { id: 'grosbill', name: 'Grosbill', website: 'https://www.grosbill.com', country: 'FR', refurbished: false, kind: 'feed', searchUrl: 'https://www.grosbill.com/catv2.cgi?mode=recherche&recherche={q}' },
  { id: 'visiodirect', name: 'Visiodirect', website: 'https://www.visiodirect.net', country: 'FR', refurbished: true, kind: 'feed', searchUrl: 'https://www.visiodirect.net/recherche?search_query={q}' },
  { id: '1fotrade', name: '1fotrade', website: 'https://www.1fotrade.com', country: 'FR', refurbished: true, kind: 'feed', searchUrl: 'https://www.1fotrade.com/recherche?controller=search&s={q}', notes: 'Spécialiste du matériel informatique reconditionné.' },
  { id: 'certideal', refurbishedOnly: true, name: 'Certideal', website: 'https://www.certideal.com', country: 'FR', refurbished: true, kind: 'feed', searchUrl: 'https://www.certideal.com/recherche?search_query={q}' },
  { id: 'refurbed', refurbishedOnly: true, name: 'refurbed', website: 'https://www.refurbed.fr', country: 'FR', refurbished: true, kind: 'feed', searchUrl: 'https://www.refurbed.fr/search/?query={q}' },
];

function feedEnvKey(id: string): string {
  return `FEED_${id.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
}

function loadCustomMerchants(): MerchantDefinition[] {
  if (!fs.existsSync(config.customMerchantsFile)) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(config.customMerchantsFile, 'utf8')) as Array<Partial<MerchantDefinition>>;
    return raw
      .filter((m) => m.id && m.name)
      .map((m) => ({
        id: String(m.id),
        name: String(m.name),
        website: m.website ?? '',
        country: m.country ?? 'FR',
        refurbished: Boolean(m.refurbished),
        refurbishedOnly: Boolean(m.refurbishedOnly),
        kind: 'feed' as const,
        feedUrl: m.feedUrl,
        feedFormat: m.feedFormat ?? 'auto',
        searchUrl: m.searchUrl ?? (m.website ? `${m.website.replace(/\/$/, '')}/search?q={q}` : ''),
        notes: m.notes,
      }));
  } catch (err) {
    console.error(`[merchants] ${config.customMerchantsFile} illisible:`, err);
    return [];
  }
}

let cached: MerchantDefinition[] | null = null;

export function getMerchantDefinitions(): MerchantDefinition[] {
  if (cached) return cached;
  const custom = loadCustomMerchants();
  const merged = new Map<string, MerchantDefinition>();
  for (const m of [...BUILTIN, ...custom]) merged.set(m.id, { ...merged.get(m.id), ...m });
  cached = [...merged.values()].map((m) => {
    if (m.kind !== 'feed') return m;
    const key = feedEnvKey(m.id);
    const format = env(`${key}_FORMAT`) as MerchantDefinition['feedFormat'] | undefined;
    return { ...m, feedUrl: env(`${key}_URL`) ?? m.feedUrl, feedFormat: format ?? m.feedFormat ?? 'auto' };
  });
  return cached;
}

export function requiredEnvFor(m: MerchantDefinition): string[] {
  switch (m.kind) {
    case 'amazon':
      return ['AMAZON_ACCESS_KEY', 'AMAZON_SECRET_KEY', 'AMAZON_PARTNER_TAG'];
    case 'aliexpress':
      return ['ALIEXPRESS_APP_KEY', 'ALIEXPRESS_APP_SECRET', 'ALIEXPRESS_TRACKING_ID'];
    case 'ebay':
      return ['EBAY_CLIENT_ID', 'EBAY_CLIENT_SECRET'];
    case 'feed':
      return [`${feedEnvKey(m.id)}_URL`];
  }
}

export function searchUrlFor(m: MerchantDefinition, q: string): string {
  return m.searchUrl.replace('{q}', encodeURIComponent(q));
}

/** Réservé aux tests. */
export function resetMerchantCache(): void {
  cached = null;
}
