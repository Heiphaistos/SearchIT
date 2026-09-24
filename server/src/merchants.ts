import fs from 'node:fs';
import { config, env } from './config.js';
import { normalizeText } from './search/normalize.js';

export type MerchantKind = 'amazon' | 'aliexpress' | 'ebay' | 'feed' | 'shopify' | 'woocommerce' | 'google-shopping';

const STORE_KINDS = ['feed', 'shopify', 'woocommerce'] as const;

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
  /** Pour kind = shopify | woocommerce : adresse de la boutique (catalogue public, sans clé). */
  storeUrl?: string;
  /** Devise de la boutique si elle ne peut pas être détectée. */
  currency?: string;
  /** Garder tout le catalogue, même hors high-tech. */
  keepAll?: boolean;
  /** Modèle d'URL de recherche sur le site marchand, utilisé par le catalogue de démo. */
  searchUrl: string;
  notes?: string;
}

/**
 * Marchands connus. Les flux d'affiliation (Awin, Effinity, Kwanko, Kelkoo, Google Merchant…)
 * s'activent en renseignant FEED_<ID>_URL (id en majuscules, « - » → « _ »).
 */
const BUILTIN: MerchantDefinition[] = [
  { id: 'google-shopping', name: 'Google Shopping (tous marchands)', website: 'https://shopping.google.com', country: 'FR', refurbished: true, kind: 'google-shopping', searchUrl: 'https://www.google.fr/search?tbm=shop&q={q}', notes: 'Agrège les prix de centaines de marchands français (Fnac, LDLC, Boulanger, Back Market, Darty…) via Serper.dev, SearchApi.io ou SerpApi – offres gratuites.' },
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
        kind: (STORE_KINDS as readonly string[]).includes(m.kind ?? '') ? (m.kind as MerchantKind) : 'feed',
        feedUrl: m.feedUrl,
        storeUrl: m.storeUrl,
        currency: m.currency,
        keepAll: m.keepAll,
        feedFormat: m.feedFormat ?? 'auto',
        searchUrl: m.searchUrl ?? (m.website ? `${m.website.replace(/\/$/, '')}/search?q={q}` : ''),
        notes: m.notes,
      }));
  } catch (err) {
    console.error(`[merchants] ${config.customMerchantsFile} illisible:`, err);
    return [];
  }
}

function slugFromHost(url: string): string {
  const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^(www|shop|store|boutique)\./, '');
  return host.replace(/\.[a-z]+$/, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}

/**
 * Boutiques déclarées par variable d'environnement :
 *   SHOPIFY_STORES=boutique.fr|Ma Boutique|refurb,autre-shop.com
 *   WOOCOMMERCE_STORES=exemple.fr|Exemple
 */
function storesFromEnv(): MerchantDefinition[] {
  const out: MerchantDefinition[] = [];
  for (const [name, kind] of [['SHOPIFY_STORES', 'shopify'], ['WOOCOMMERCE_STORES', 'woocommerce']] as const) {
    for (const entry of (env(name) ?? '').split(',').map((s) => s.trim()).filter(Boolean)) {
      const [url, label, flag] = entry.split('|').map((s) => s.trim());
      const storeUrl = /^https?:\/\//.test(url) ? url : `https://${url}`;
      out.push({
        id: slugFromHost(storeUrl),
        name: label || slugFromHost(storeUrl),
        website: storeUrl,
        country: 'FR',
        refurbished: flag === 'refurb',
        refurbishedOnly: flag === 'refurb',
        kind,
        storeUrl,
        searchUrl: kind === 'shopify' ? `${storeUrl}/search?q={q}` : `${storeUrl}/?s={q}&post_type=product`,
      });
    }
  }
  return out;
}

/** Liste de boutiques publiques fournie avec SearchIT (désactivable avec PUBLIC_STORES=off). */
function loadPublicStores(): MerchantDefinition[] {
  if (env('PUBLIC_STORES') === 'off' || !fs.existsSync(config.publicStoresFile)) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(config.publicStoresFile, 'utf8')) as Array<Partial<MerchantDefinition>>;
    return raw
      .filter((m) => m.storeUrl && m.name && (m.kind === 'shopify' || m.kind === 'woocommerce'))
      .map((m) => ({
        id: m.id ?? slugFromHost(m.storeUrl!),
        name: m.name!,
        website: m.website ?? m.storeUrl!,
        country: m.country ?? 'FR',
        refurbished: Boolean(m.refurbished),
        refurbishedOnly: Boolean(m.refurbishedOnly),
        kind: m.kind!,
        storeUrl: m.storeUrl,
        currency: m.currency,
        searchUrl: m.searchUrl ?? `${m.storeUrl!.replace(/\/$/, '')}/search?q={q}`,
        notes: m.notes,
      }));
  } catch (err) {
    console.error(`[merchants] ${config.publicStoresFile} illisible:`, err);
    return [];
  }
}

let cached: MerchantDefinition[] | null = null;

export function getMerchantDefinitions(): MerchantDefinition[] {
  if (cached) return cached;
  const merged = new Map<string, MerchantDefinition>();
  for (const m of [...BUILTIN, ...loadPublicStores(), ...loadCustomMerchants(), ...storesFromEnv()]) merged.set(m.id, { ...merged.get(m.id), ...m });
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
    case 'google-shopping':
      return ['SERPER_API_KEY', 'SEARCHAPI_API_KEY', 'SERPAPI_API_KEY'];
    case 'shopify':
    case 'woocommerce':
      return [];
  }
}

export function searchUrlFor(m: MerchantDefinition, q: string): string {
  return m.searchUrl.replace('{q}', encodeURIComponent(q));
}

/** Réservé aux tests. */
export function resetMerchantCache(): void {
  cached = null;
}

// ---------- Marchands découverts dynamiquement (agrégateurs type Google Shopping) ----------

function merchantKey(name: string): string {
  return normalizeText(name)
    .replace(/[^a-z0-9]/g, '')
    .replace(/(com|fr|net|eu|shop|store|officiel)+$/, '');
}

export interface ResolvedMerchant {
  id: string;
  name: string;
  refurbishedOnly: boolean;
}

const REFURB_NAME = /recond|refurb|remade|swappie|seconde ?vie|occasion|certideal|backmarket|back market|recommerce|largo/i;

/**
 * Associe un nom de vendeur libre (« Fnac.com », « LDLC.com », « Back Market »…)
 * à un marchand connu, ou crée un identifiant stable pour un nouveau vendeur.
 */
export function resolveMerchant(rawName: string): ResolvedMerchant {
  const name = rawName.replace(/\s+/g, ' ').trim();
  const key = merchantKey(name);
  for (const m of getMerchantDefinitions()) {
    if (m.kind === 'google-shopping') continue;
    const keys = [m.id, merchantKey(m.name)];
    if (keys.some((k) => k === key || (k.length >= 4 && key.startsWith(k)))) {
      return { id: m.id, name: m.name, refurbishedOnly: Boolean(m.refurbishedOnly) };
    }
  }
  return { id: key || 'inconnu', name: name || 'Vendeur inconnu', refurbishedOnly: REFURB_NAME.test(name) };
}
