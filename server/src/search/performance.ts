import type { ProductGroup, ValueScore } from '../shared/types.js';
import { normalizeText } from './normalize.js';

// Indices de performance publics, un seul chiffre par puce, relevés le 2026-09-25 :
//  - cartes graphiques : PassMark G3D Mark, https://www.videocardbenchmark.net/high_end_gpus.html
//    (et mid_range_gpus.html, high_mid_range_gpus.html) ;
//  - processeurs : PassMark CPU Mark, https://www.cpubenchmark.net/high_end_cpus.html
//    (et mid_range_cpus.html, high_mid_range_cpus.html).
// Puces publiées en plusieurs versions mémoire notées différemment (RTX 5060 Ti 8/16 Go,
// RX 9060 XT 8/16 Go, RTX 3050 6/8 Go) : volontairement absentes, faute de chiffre unique.

const GPU_MARKS: Record<string, number> = {
  'rtx 3060': 16882, 'rtx 3060 ti': 20217, 'rtx 3070': 22072, 'rtx 3070 ti': 23168, 'rtx 3080': 24977, 'rtx 3080 ti': 26742,
  'rtx 3090': 26475, 'rtx 3090 ti': 29209, 'rtx 4060': 19486, 'rtx 4060 ti': 22595, 'rtx 4070': 26855, 'rtx 4070 super': 29940,
  'rtx 4070 ti': 31515, 'rtx 4070 ti super': 31841, 'rtx 4080': 34435, 'rtx 4080 super': 34203, 'rtx 4090': 38038,
  'rtx 5050': 16761, 'rtx 5060': 20624, 'rtx 5070': 28651, 'rtx 5070 ti': 32331, 'rtx 5080': 35634, 'rtx 5090': 39016,
  'rx 7600': 16449, 'rx 7600 xt': 17344, 'rx 7700 xt': 22745, 'rx 7800 xt': 24470, 'rx 7900 gre': 27450, 'rx 7900 xt': 29120,
  'rx 7900 xtx': 31459, 'rx 9070': 25361, 'rx 9070 xt': 26911, 'arc b570': 14187, 'arc b580': 16083,
};

const CPU_MARKS: Record<string, number> = {
  '5500': 19253, '5500x3d': 20322, '5600': 21489, '5600f': 19236, '5600g': 19621, '5600x': 21822, '5600x3d': 21887,
  '7400f': 25632, '7500f': 26517, '7500x3d': 24973, '7600': 26968, '7600x': 28270, '7600x3d': 25864, '9500f': 28087,
  '9600': 29315, '9600x': 30048, '5700': 24194, '5700g': 24216, '5700x': 26550, '5700x3d': 26307, '5800x': 27657,
  '5800x3d': 28286, '7700': 34320, '7700x': 35479, '7800x3d': 34279, '9700f': 36396, '9700x': 36938, '9800x3d': 39923,
  '9850x3d': 41303, '5900x': 38887, '5950x': 45250, '7900': 48013, '7900x': 51217, '7900x3d': 50201, '7950x': 62131,
  '7950x3d': 62297, '9900x': 54307, '9900x3d': 56048, '9950x': 65709, '9950x3d': 70093,
  '225': 30467, '225f': 31007, '245k': 43049, '245kf': 43047, '265': 49686, '265f': 49450, '265k': 58571, '265kf': 58454,
  '285': 57750, '285k': 67225,
  '12100f': 13953, '13100f': 14653, '14100': 15085, '14100f': 15402, '12400': 18821, '12400f': 19542, '13400': 23890,
  '13400f': 24878, '14400': 25036, '14400f': 25421, '12600k': 27501, '12600kf': 27504, '13600k': 37454, '13600kf': 37307,
  '14500': 30709, '14600k': 38372, '14600kf': 38250, '12700k': 34243, '12700kf': 33918, '13700k': 45591, '13700kf': 45529,
  '14700': 40225, '14700f': 41275, '14700k': 51924, '14700kf': 51932, '12900k': 41103, '12900kf': 40470, '13900k': 58071,
  '13900kf': 57437, '14900k': 58203, '14900kf': 58067, '14900ks': 59883,
};

/** Indice PassMark de la puce nommée dans le titre, ou `undefined`. */
export function performanceIndex(title: string, category: string): number | undefined {
  const t = ` ${normalizeText(title).replace(/-/g, ' ')} `;
  if (category === 'gpu') {
    const m = t.match(/ (rtx|rx|arc) ?(\d{4}|b5[78]0)((?: (?:ti|super|xtx|xt|gre|d))*) /) ?? t.match(/ (rtx|rx) ?(\d{4})(ti|xtx|xt) /);
    if (!m) return undefined;
    return GPU_MARKS[`${m[1]} ${m[2]}${m[3].startsWith(' ') ? m[3] : m[3] ? ` ${m[3]}` : ''}`];
  }
  if (category === 'cpu') {
    // Ryzen « 9800x3d », Intel « 14600k » (après « i5 »), Core Ultra « 265k » (après « ultra 7 »).
    const m = t.match(/ ryzen [3579] (\d{4}[a-z0-9]*) /) ?? t.match(/ i[3579] (1[234]\d{3}[a-z]*) /) ?? t.match(/ ultra [579] (2\d5[a-z]*) /);
    return m ? CPU_MARKS[m[1]] : undefined;
  }
  return undefined;
}

/** Rapport qualité-prix d'un produit (pour 100 € du meilleur prix total). */
export function valueScore(group: ProductGroup): ValueScore | undefined {
  const price = group.bestOffer.totalPrice;
  if (price <= 0) return undefined;
  const perf = performanceIndex(group.title, group.category);
  if (perf) return { method: 'performance', basis: perf, score: Math.round((perf / price) * 100 * 10) / 10 };
  // Repli : note moyenne pondérée par le nombre d'avis de chaque offre.
  let reviews = 0;
  let weighted = 0;
  for (const o of group.offers) {
    if (o.rating === undefined || !o.reviewCount) continue;
    reviews += o.reviewCount;
    weighted += o.rating * o.reviewCount;
  }
  if (!reviews) return undefined;
  const rating = weighted / reviews;
  return {
    method: 'rating',
    basis: Math.round(rating * 10) / 10,
    reviews,
    score: Math.round(((rating * Math.log10(1 + reviews)) / price) * 100 * 100) / 100,
  };
}
