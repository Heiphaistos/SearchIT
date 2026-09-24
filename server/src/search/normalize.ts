import { CATEGORIES } from '../shared/categories.js';
import type { CategoryId, Condition } from '../shared/types.js';

/** Minuscules, sans accents, ponctuation → espaces (on garde . + - utiles aux modèles). */
export function normalizeText(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’`]/g, ' ')
    .replace(/[^a-z0-9.+-]+/g, ' ')
    .replace(/(^|\s)[.+-]+|[.+-]+(?=\s|$)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Unités de capacité unifiées : « 128 Go », « 128GB », « 128 gb » → « 128go ».
const UNIT_RE = /\b(\d+(?:[.,]\d+)?)\s?(go|gb|gio|to|tb|tio|mo|mb|w|hz|mhz|ghz|mm|mah)\b/g;
const UNIT_MAP: Record<string, string> = { gb: 'go', gio: 'go', tb: 'to', tio: 'to', mb: 'mo' };

export function unifyUnits(normalized: string): string {
  return normalized.replace(UNIT_RE, (_, num: string, unit: string) => `${num.replace(',', '.')}${UNIT_MAP[unit] ?? unit}`);
}

const STOP_WORDS = new Set([
  'de', 'du', 'des', 'la', 'le', 'les', 'l', 'd', 'un', 'une', 'et', 'ou', 'a', 'au', 'aux', 'en', 'pour', 'avec', 'sans', 'sur', 'par',
  'the', 'for', 'with', 'and', 'or', 'of', 'in', 'to', 'by', '-', '+',
]);

const CONDITION_WORDS = new Set([
  'neuf', 'new', 'reconditionne', 'reconditionnee', 'refurbished', 'renewed', 'occasion', 'used', 'grade', 'etat', 'tres', 'bon',
  'excellent', 'parfait', 'correct', 'comme', 'debloque', 'unlocked', 'garantie', 'an', 'ans', 'mois', 'reconditionnes',
]);

const COLOR_WORDS = new Set([
  'noir', 'blanc', 'bleu', 'rouge', 'vert', 'rose', 'gris', 'argent', 'or', 'violet', 'jaune', 'graphite', 'minuit', 'lumiere', 'stellaire',
  'black', 'white', 'blue', 'red', 'green', 'pink', 'gray', 'grey', 'silver', 'gold', 'purple', 'yellow', 'midnight', 'starlight',
  'sideral', 'titane', 'titanium', 'naturel', 'natural', 'sidereal', 'space',
]);

export function tokenize(text: string): string[] {
  const out: string[] = [];
  for (const t of unifyUnits(normalizeText(text)).split(' ')) {
    if (!t || STOP_WORDS.has(t)) continue;
    out.push(t);
    // « i5-14600k » est aussi indexé en « i5 » et « 14600k ».
    if (t.includes('-')) for (const part of t.split('-')) if (part && !STOP_WORDS.has(part)) out.push(part);
  }
  return out;
}

/** Empreinte stable d'un titre pour regrouper les offres d'un même produit. */
export function fingerprintTokens(title: string): string[] {
  const tokens = tokenize(title).filter((t) => !CONDITION_WORDS.has(t) && !COLOR_WORDS.has(t) && !/^[abc]$/.test(t));
  return [...new Set(tokens)].sort();
}

export function fingerprint(title: string): string {
  return fingerprintTokens(title).join(' ');
}

export function numericTokens(tokens: string[]): string[] {
  return tokens.filter((t) => /\d/.test(t));
}

export function jaccard(a: string[], b: string[]): number {
  if (!a.length && !b.length) return 1;
  const sa = new Set(a);
  const sb = new Set(b);
  let inter = 0;
  for (const t of sa) if (sb.has(t)) inter++;
  return inter / (sa.size + sb.size - inter);
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const keywordRegexCache = new Map<string, RegExp>();
function keywordRegex(keyword: string): RegExp {
  let re = keywordRegexCache.get(keyword);
  if (!re) {
    re = new RegExp(`(?:^|[^a-z0-9])${escapeRegExp(keyword)}(?=$|[^a-z0-9])`);
    keywordRegexCache.set(keyword, re);
  }
  return re;
}

function findKeyword(normalized: string, keyword: string): number {
  const m = keywordRegex(keyword).exec(normalized);
  return m ? m.index : -1;
}

// Mots qui indiquent sans ambiguïté un accessoire, où qu'ils soient dans le titre
// (« Coque iPhone 15 », « Câble USB-C pour MacBook »).
const STRONG_ACCESSORY: Array<[string, CategoryId]> = [
  ['pate thermique', 'thermal-paste'], ['thermal paste', 'thermal-paste'], ['thermal pad', 'thermal-paste'], ['pad thermique', 'thermal-paste'],
  ['coque', 'accessory'], ['housse', 'accessory'], ['etui', 'accessory'], ['protection ecran', 'accessory'], ['verre trempe', 'accessory'],
  ['film protecteur', 'accessory'], ['screen protector', 'accessory'], ['phone case', 'accessory'], ['silicone case', 'accessory'],
  ['case for', 'accessory'], ['cover for', 'accessory'], ['sacoche', 'accessory'],
  ['cable', 'cable'], ['cordon', 'cable'], ['adaptateur', 'cable'], ['adapter', 'cable'],
  ['chargeur', 'charger'], ['charger', 'charger'], ['power bank', 'charger'], ['batterie externe', 'charger'],
];

/**
 * Détecte la catégorie d'un titre produit ou d'une requête.
 * 1) un mot d'accessoire explicite l'emporte ; 2) sinon le mot-clé qui apparaît
 * le plus tôt (les titres commencent en général par le type de produit),
 * à égalité le plus long (plus spécifique).
 */
export function detectCategory(text: string, hint?: string): CategoryId | null {
  const normalized = normalizeText(text);
  for (const [kw, cat] of STRONG_ACCESSORY) {
    if (findKeyword(normalized, kw) >= 0) return cat;
  }
  let best: { cat: CategoryId; pos: number; len: number } | null = null;
  for (const category of CATEGORIES) {
    for (const kw of category.keywords) {
      const pos = findKeyword(normalized, kw);
      if (pos < 0) continue;
      if (!best || pos < best.pos || (pos === best.pos && kw.length > best.len)) {
        best = { cat: category.id, pos, len: kw.length };
      }
    }
  }
  if (best) return best.cat;
  return hint ? detectCategory(hint) : null;
}

const REFURB_PATTERNS = ['reconditionne', 'refurbished', 'renewed', 'remis a neuf', 'grade a', 'grade b', 'grade c', 'comme neuf', 'tres bon etat', 'etat correct', 'bon etat', 'certified refurbished', 'reconditionnee'];
const USED_PATTERNS = ['occasion', 'used', 'pre-owned', 'seconde main', 'second hand'];

export function detectCondition(...texts: Array<string | undefined | null>): Condition {
  const normalized = normalizeText(texts.filter(Boolean).join(' '));
  if (REFURB_PATTERNS.some((p) => findKeyword(normalized, p) >= 0)) return 'refurbished';
  if (USED_PATTERNS.some((p) => findKeyword(normalized, p) >= 0)) return 'used';
  return 'new';
}

/** Mappe une valeur de condition « libre » (flux, API) vers notre énumération. */
export function parseCondition(value: string | undefined | null, fallbackText?: string): Condition {
  if (!value) return detectCondition(fallbackText);
  const v = normalizeText(value);
  if (/refurb|recond|renew|remanufact/.test(v)) return 'refurbished';
  if (/used|occasion|pre-owned|seconde/.test(v)) return 'used';
  if (/new|neuf/.test(v)) return detectCondition(fallbackText) === 'refurbished' ? 'refurbished' : 'new';
  return detectCondition(value, fallbackText);
}

/** « 1 299,99 € », « 12.99 EUR », « 1.299,00 » → nombre. */
export function parsePrice(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;
  let s = value.replace(/[^\d.,-]/g, '');
  if (!s) return null;
  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');
  if (lastComma >= 0 && lastDot >= 0) {
    const decimalSep = lastComma > lastDot ? ',' : '.';
    const thousandSep = decimalSep === ',' ? '.' : ',';
    s = s.split(thousandSep).join('').replace(decimalSep, '.');
  } else {
    // Un seul type de séparateur : « 1,299 » / « 1.299.000 » = milliers, sinon décimal.
    const sep = lastComma >= 0 ? ',' : lastDot >= 0 ? '.' : '';
    if (sep) {
      const thousands = new RegExp(`^-?\\d{1,3}(\\${sep}\\d{3})+$`);
      const parts = s.split(sep);
      s = thousands.test(s) ? parts.join('') : `${parts.slice(0, -1).join('')}.${parts[parts.length - 1]}`;
    }
  }
  const n = Number.parseFloat(s);
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : null;
}

/** Normalise un GTIN/EAN/UPC sur 14 chiffres, ou `undefined` si invalide. */
export function normalizeGtin(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  const digits = String(value).replace(/\D/g, '');
  if (![8, 12, 13, 14].includes(digits.length)) return undefined;
  const padded = digits.padStart(14, '0');
  if (/^0+$/.test(padded)) return undefined;
  let sum = 0;
  for (let i = 0; i < 13; i++) sum += Number(padded[i]) * (i % 2 === 0 ? 3 : 1);
  const check = (10 - (sum % 10)) % 10;
  return check === Number(padded[13]) ? padded : undefined;
}

export function parseBoolean(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value;
  if (value === null || value === undefined || value === '') return null;
  const v = normalizeText(String(value));
  if (/^(1|true|yes|oui|in stock|instock|en stock|disponible|available|y)$/.test(v) || v.includes('in stock') || v.includes('en stock')) return true;
  if (/^(0|false|no|non|out of stock|outofstock|rupture|indisponible|n)$/.test(v) || v.includes('out of stock') || v.includes('rupture')) return false;
  return null;
}
