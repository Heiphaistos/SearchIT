import type { CategoryId } from '../shared/types.js';
import { normalizeText } from './normalize.js';

// Requêtes courtes sur une puce (« 5090 », « 9800x3d », « 4070 super ») :
// on reconnaît le modèle, on fixe la catégorie et on enrichit la requête.

export interface ModelQuery {
  category: Extract<CategoryId, 'gpu' | 'cpu'>;
  /** Nom canonique (« RTX 5090 », « Ryzen 7 9800X3D »). */
  label: string;
  /** Requête de pertinence (mots attendus dans les titres). */
  match: string;
  /** Texte envoyé aux moteurs de recherche généralistes (Google Shopping). */
  searchText: string;
}

// Suffixes qui changent de puce : « 5070 » ≠ « 5070 Ti », « 9600 » ≠ « 9600X ».
const VARIANT_LABELS: Record<string, string> = { ti: 'Ti', super: 'Super', xt: 'XT', xtx: 'XTX', gre: 'GRE', d: 'D' };
export const GPU_VARIANTS = new Set(Object.keys(VARIANT_LABELS));
export const CPU_SUFFIXES = new Set(['x', 'x3d', 'f', 'g', 'k', 'kf', 'ks', 't']);

const FILLER = new Set(['nvidia', 'geforce', 'rtx', 'gtx', 'amd', 'radeon', 'rx', 'intel', 'arc', 'core', 'ultra', 'ryzen', 'carte', 'graphique', 'processeur', 'cpu', 'gpu', 'i3', 'i5', 'i7', 'i9']);

const NVIDIA = /^(20[5-8]0|30[5-9]0|40[5-9]0|50[5-9]0)$/;
const RADEON = /^(6[6-9][05]0|7[6-9]00|90[67]0)$/;
// Numéros partagés avec un Ryzen de bureau (Ryzen 5 7600, Ryzen 7 7700, Ryzen 9 7900).
const RADEON_AMBIGUOUS = new Set(['7600', '7700', '7900']);
// Radeon qui n'existent qu'en XT : « 7800 » = RX 7800 XT.
const RADEON_XT_ONLY = new Set(['7800', '9060']);
const ARC = /^b5[78]0$/;
const RYZEN = /^([579])([5-9])\d{2}(x3d|x|f|g)?$/;
const INTEL = /^1[234](\d)\d{2}(k|kf|f|ks|t)?$/;
const CORE_ULTRA = /^2([2-9])5(k|kf|f)?$/;

const upper = (s: string) => s.toUpperCase();

/** Reconnaît une requête qui ne contient qu'un modèle de puce, sinon `null`. */
export function detectModel(query: string): ModelQuery | null {
  const words = normalizeText(query).split(/[\s-]+/).filter(Boolean);
  const has = (w: string) => words.includes(w);
  const cpuBrand = has('ryzen') || has('ultra');
  const gpuBrand = has('rx') || has('radeon');
  const rest = words.filter((w) => !FILLER.has(w) && !(cpuBrand && /^[3579]$/.test(w)));
  const variants = rest.slice(1);
  const model = rest[0];
  if (!model || !variants.every((v) => GPU_VARIANTS.has(v))) return null;
  const variantLabel = variants.map((v) => VARIANT_LABELS[v]).join(' ');
  const gpu = (label: string): ModelQuery => {
    const full = variantLabel ? `${label} ${variantLabel}` : label;
    return { category: 'gpu', label: full, match: normalizeText(full), searchText: `carte graphique ${full}` };
  };
  const cpu = (label: string): ModelQuery | null =>
    variants.length ? null : { category: 'cpu', label, match: model, searchText: `processeur ${label}` };

  if (NVIDIA.test(model) && !gpuBrand) return gpu(`RTX ${model}`);
  if (ARC.test(model)) return gpu(`Arc ${upper(model)}`);
  if (RADEON.test(model) && (gpuBrand || variants.length || !RADEON_AMBIGUOUS.has(model)) && !cpuBrand) {
    if (!variants.length && RADEON_XT_ONLY.has(model)) return gpu(`RX ${model} XT`);
    return gpu(`RX ${model}`);
  }
  if (gpuBrand) return null;
  const ryzen = model.match(RYZEN);
  if (ryzen && (ryzen[3] || cpuBrand || !RADEON_AMBIGUOUS.has(model))) {
    const tier = ryzen[2] <= '6' ? 5 : ryzen[2] <= '8' ? 7 : 9;
    return cpu(`AMD Ryzen ${tier} ${upper(model)}`);
  }
  const intel = model.match(INTEL);
  if (intel) {
    const tier = intel[1] === '1' ? 3 : intel[1] <= '6' ? 5 : intel[1] === '7' ? 7 : 9;
    return cpu(`Intel Core i${tier}-${upper(model)}`);
  }
  const ultra = model.match(CORE_ULTRA);
  if (ultra && (ultra[2] || has('ultra'))) {
    const tier = ultra[1] <= '4' ? 5 : ultra[1] <= '6' ? 7 : 9;
    return cpu(`Intel Core Ultra ${tier} ${upper(model)}`);
  }
  return null;
}
