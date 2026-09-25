import type { Condition } from '../shared/types.js';
import { CPU_SUFFIXES, GPU_VARIANTS } from './models.js';
import { normalizeText, numericTokens, tokenize } from './normalize.js';

const CONDITION_INTENTS: Array<[RegExp, Condition]> = [
  [/\b(reconditionnee?s?|refurbished|renewed|remis a neuf|seconde vie)\b/g, 'refurbished'],
  [/\b(d occasion|occasion|used|seconde main)\b/g, 'used'],
  [/\b(neufs?|neuves?|new)\b/g, 'new'],
];

/**
 * Extrait l'intention d'état d'une requête (« iphone 15 reconditionné »)
 * et renvoie la requête nettoyée.
 */
export function extractConditionIntent(q: string): { query: string; conditions: Condition[] } {
  let text = normalizeText(q);
  const conditions: Condition[] = [];
  for (const [re, condition] of CONDITION_INTENTS) {
    if (re.test(text)) {
      conditions.push(condition);
      text = text.replace(re, ' ');
    }
    re.lastIndex = 0;
  }
  return { query: text.replace(/\s+/g, ' ').trim() || normalizeText(q), conditions };
}

// Déclinaisons d'un modèle : « RTX 5070 » ≠ « RTX 5070 Ti », « iPhone 16 » ≠ « iPhone 16 Pro ».
export const VARIANT_TOKENS = new Set(['ti', 'super', 'xt', 'xtx', 'pro', 'max', 'plus', 'ultra', 'mini', 'lite', 'fe', 'se', 'air', 'x3d']);

// Marques de puces que les marchands omettent souvent (« ASUS Dual RTX 5070 » sans « NVIDIA GeForce »).
const OPTIONAL_TOKENS = new Set(['nvidia', 'geforce', 'amd', 'radeon', 'intel', 'arc']);

export interface PreparedQuery {
  tokens: string[];
  numeric: string[];
}

export function prepareQuery(q: string): PreparedQuery {
  // Les mots composés (« i5-14600k ») sont remplacés par leurs parties, déjà présentes.
  const all = tokenize(q);
  const parts = all.filter((t) => !t.includes('-'));
  const tokens = [...new Set(parts.length ? parts : all)];
  return { tokens, numeric: numericTokens(tokens) };
}

/**
 * Score de pertinence entre 0 et 1.
 * - couverture : part des mots de la requête présents dans le titre (préfixe accepté) ;
 * - tous les mots contenant un chiffre (références, capacités) doivent être présents ;
 * - léger bonus pour les titres courts (« iPhone 15 » avant « Coque iPhone 15 Pro Max »).
 */
export function relevance(query: PreparedQuery, title: string, extra = ''): number {
  if (!query.tokens.length) return 0;
  const titleTokens = tokenize(`${title} ${extra}`);
  const titleSet = new Set(titleTokens);
  let matched = 0;
  let counted = 0;
  for (const t of query.tokens) {
    counted += 1;
    if (titleSet.has(t)) matched += 1;
    // Marque de la puce (« NVIDIA », « GeForce »…) : souvent absente des titres marchands, on ne la pénalise pas.
    else if (OPTIONAL_TOKENS.has(t)) counted -= 1;
    else if (t.length >= 2 && titleTokens.some((tt) => tt.startsWith(t) && (!/\d$/.test(t) || !/^\d/.test(tt.slice(t.length))))) matched += 0.85;
    // « 16go » dans la requête et « 16 go » éclaté ailleurs : déjà unifié par tokenize.
  }
  if (!counted) return 0;
  const coverage = matched / counted;
  const numericOk = query.numeric.every((n) => titleSet.has(n) || titleTokens.some((tt) => tt.startsWith(n) && !/^\d/.test(tt.slice(n.length))));
  const querySet = new Set(query.tokens);
  if (!numericOk || otherChip(query.numeric, titleTokens, querySet) || chinaEdition(query.numeric, title)) return coverage * 0.3;
  const concision = Math.min(1, query.tokens.length / Math.max(1, titleSet.size));
  let variants = 0;
  for (const t of titleSet) if (VARIANT_TOKENS.has(t) && !querySet.has(t)) variants++;
  return Math.round((coverage * 0.88 + concision * 0.12 - variants * 0.06) * 1000) / 1000;
}

/**
 * Déclinaison de puce absente de la requête : « 5070 » face à « 5070 Ti » ou « 5070ti »,
 * « 9600 » face à « 9600X », « 14600k » face à « 14600kf ». C'est un autre produit.
 */
function otherChip(numeric: string[], titleTokens: string[], querySet: Set<string>): boolean {
  for (const n of numeric) {
    const bare = /^\d+$/.test(n);
    for (let i = 0; i < titleTokens.length; i++) {
      const t = titleTokens[i];
      if (t === n) {
        for (let j = i + 1; bare && j < titleTokens.length && GPU_VARIANTS.has(titleTokens[j]); j++) if (!querySet.has(titleTokens[j])) return true;
      } else if (t.startsWith(n) && !querySet.has(t)) {
        const suffix = t.slice(n.length);
        if (bare ? GPU_VARIANTS.has(suffix) || CPU_SUFFIXES.has(suffix) : /^\d+[a-z]/.test(n) && /^[a-z0-9]+$/.test(suffix)) return true;
      }
    }
  }
  return false;
}

/** « RTX 5090 D » (édition chinoise) : « d » est un mot vide pour tokenize, on le cherche dans le texte brut. */
function chinaEdition(numeric: string[], title: string): boolean {
  const text = ` ${normalizeText(title)} `;
  return numeric.some((n) => /^\d{4}$/.test(n) && text.includes(` ${n} d `));
}

export const MIN_RELEVANCE = 0.72;
