import type { CatalogProduct } from '../types.js';

type V = string | null;
/** Specs smartwatch : [Écran, Autonomie, GPS, Étanchéité, Compatibilité, Capteurs] — null = clé omise. */
function w(
  slug: string, brand: string, name: string, family: string, year: number, msrp: number | null,
  s: [V, V, V, V, V, V], tags: string[] = ['mobile', 'sport'], refurbishable = true,
): CatalogProduct {
  const keys = ['Écran', 'Autonomie', 'GPS', 'Étanchéité', 'Compatibilité', 'Capteurs'];
  const specs: Record<string, string> = {};
  s.forEach((v, i) => { if (v !== null) specs[keys[i]] = v; });
  const p: CatalogProduct = { id: `smartwatch-${slug}`, category: 'smartwatch', brand, name, family, year, refurbishable, tags, specs };
  if (msrp !== null) p.msrp = msrp;
  return p;
}

const AI = 'Android, iOS';
const AN = 'Android';
const IO = 'iOS';
const R = ['mobile', 'sport', 'robuste'];

/** Apple Watch : une entrée par taille de boîtier et par connectivité (GPS / GPS + Cellular). */
function aw(
  gen: string, slugGen: string, family: string, size: number, cell: boolean, year: number, msrp: number | null,
  ecran: string, autonomie: string, gps: string, etanch: string, capteurs: string, material = '', slugMat = '',
): CatalogProduct {
  const conn = cell ? 'GPS + Cellular' : 'GPS';
  const mat = material ? ` ${material}` : '';
  return w(`apple-watch-${slugGen}${slugMat ? '-' + slugMat : ''}-${size}mm-${cell ? 'gps-cellular' : 'gps'}`, 'Apple',
    `Apple Watch ${gen}${mat} ${size} mm ${conn}`, family, year, msrp,
    [`${size} mm ${ecran}`, autonomie, gps, etanch, IO, capteurs]);
}

const H18 = "Jusqu'à 18 h";
const C3 = 'Cardio optique, altimètre barométrique';
const C4 = 'Cardio optique et électrique (ECG), détection des chutes, altimètre barométrique';
const C5 = 'Cardio optique et électrique (ECG), boussole, détection des chutes, altimètre toujours activé';
const C6 = 'Cardio optique et électrique (ECG), oxymètre (SpO2), boussole, altimètre toujours activé';
const C8 = 'Cardio optique et électrique (ECG), oxymètre (SpO2), température, détection des accidents';
const CSE = 'Cardio optique, boussole, détection des chutes, altimètre toujours activé';
const CSE2 = 'Cardio optique, boussole, détection des chutes et des accidents';
const CSE3 = 'Cardio optique, température, détection des chutes et des accidents';

export const PRODUCTS: CatalogProduct[] = [
  // ─── Apple Watch (1re génération), Series 1, Series 2 ────────────────────
  w('apple-watch-1st-gen-38mm', 'Apple', 'Apple Watch (1re génération) 38 mm', 'Apple Watch', 2015, 399, ['38 mm OLED Retina', H18, 'Non (via iPhone)', 'IPX7', IO, 'Cardio optique']),
  w('apple-watch-1st-gen-42mm', 'Apple', 'Apple Watch (1re génération) 42 mm', 'Apple Watch', 2015, 449, ['42 mm OLED Retina', H18, 'Non (via iPhone)', 'IPX7', IO, 'Cardio optique']),
  w('apple-watch-series-1-38mm', 'Apple', 'Apple Watch Series 1 38 mm', 'Apple Watch Series 1', 2016, 319, ['38 mm OLED Retina', H18, 'Non (via iPhone)', 'IPX7', IO, 'Cardio optique']),
  w('apple-watch-series-1-42mm', 'Apple', 'Apple Watch Series 1 42 mm', 'Apple Watch Series 1', 2016, 349, ['42 mm OLED Retina', H18, 'Non (via iPhone)', 'IPX7', IO, 'Cardio optique']),
  w('apple-watch-series-2-38mm', 'Apple', 'Apple Watch Series 2 38 mm', 'Apple Watch Series 2', 2016, 419, ['38 mm OLED Retina', H18, 'Oui', '50 m', IO, 'Cardio optique']),
  w('apple-watch-series-2-42mm', 'Apple', 'Apple Watch Series 2 42 mm', 'Apple Watch Series 2', 2016, 449, ['42 mm OLED Retina', H18, 'Oui', '50 m', IO, 'Cardio optique']),

  // ─── Series 3 → 7, SE ────────────────────────────────────────────────────
  aw('Series 3', 'series-3', 'Apple Watch Series 3', 38, false, 2017, 369, 'OLED Retina', H18, 'Oui', '50 m', C3),
  aw('Series 3', 'series-3', 'Apple Watch Series 3', 42, false, 2017, 399, 'OLED Retina', H18, 'Oui', '50 m', C3),
  aw('Series 3', 'series-3', 'Apple Watch Series 3', 38, true, 2017, 469, 'OLED Retina', H18, 'Oui', '50 m', C3),
  aw('Series 3', 'series-3', 'Apple Watch Series 3', 42, true, 2017, 499, 'OLED Retina', H18, 'Oui', '50 m', C3),
  aw('Series 4', 'series-4', 'Apple Watch Series 4', 40, false, 2018, 429, 'LTPO OLED Retina', H18, 'Oui', '50 m', C4),
  aw('Series 4', 'series-4', 'Apple Watch Series 4', 44, false, 2018, 459, 'LTPO OLED Retina', H18, 'Oui', '50 m', C4),
  aw('Series 4', 'series-4', 'Apple Watch Series 4', 40, true, 2018, 529, 'LTPO OLED Retina', H18, 'Oui', '50 m', C4),
  aw('Series 4', 'series-4', 'Apple Watch Series 4', 44, true, 2018, 559, 'LTPO OLED Retina', H18, 'Oui', '50 m', C4),
  aw('Series 5', 'series-5', 'Apple Watch Series 5', 40, false, 2019, 449, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m', C5),
  aw('Series 5', 'series-5', 'Apple Watch Series 5', 44, false, 2019, 479, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m', C5),
  aw('Series 5', 'series-5', 'Apple Watch Series 5', 40, true, 2019, 549, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m', C5),
  aw('Series 5', 'series-5', 'Apple Watch Series 5', 44, true, 2019, 579, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m', C5),
  aw('Series 6', 'series-6', 'Apple Watch Series 6', 40, false, 2020, 439, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m', C6),
  aw('Series 6', 'series-6', 'Apple Watch Series 6', 44, false, 2020, 469, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m', C6),
  aw('Series 6', 'series-6', 'Apple Watch Series 6', 40, true, 2020, 539, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m', C6),
  aw('Series 6', 'series-6', 'Apple Watch Series 6', 44, true, 2020, 569, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m', C6),
  aw('SE (1re génération)', 'se-1', 'Apple Watch SE', 40, false, 2020, 299, 'LTPO OLED Retina', H18, 'Oui', '50 m', CSE),
  aw('SE (1re génération)', 'se-1', 'Apple Watch SE', 44, false, 2020, 329, 'LTPO OLED Retina', H18, 'Oui', '50 m', CSE),
  aw('SE (1re génération)', 'se-1', 'Apple Watch SE', 40, true, 2020, 349, 'LTPO OLED Retina', H18, 'Oui', '50 m', CSE),
  aw('SE (1re génération)', 'se-1', 'Apple Watch SE', 44, true, 2020, 379, 'LTPO OLED Retina', H18, 'Oui', '50 m', CSE),
  aw('Series 7', 'series-7', 'Apple Watch Series 7', 41, false, 2021, 429, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m, IP6X', C6),
  aw('Series 7', 'series-7', 'Apple Watch Series 7', 45, false, 2021, 459, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m, IP6X', C6),
  aw('Series 7', 'series-7', 'Apple Watch Series 7', 41, true, 2021, 529, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m, IP6X', C6),
  aw('Series 7', 'series-7', 'Apple Watch Series 7', 45, true, 2021, 559, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m, IP6X', C6),
  aw('Series 7', 'series-7', 'Apple Watch Series 7', 41, true, 2021, 749, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m, IP6X', C6, 'acier inoxydable', 'acier'),
  aw('Series 7', 'series-7', 'Apple Watch Series 7', 45, true, 2021, 799, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m, IP6X', C6, 'acier inoxydable', 'acier'),

  // ─── Series 8, SE 2 ──────────────────────────────────────────────────────
  aw('Series 8', 'series-8', 'Apple Watch Series 8', 45, false, 2022, 529, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m, IP6X', C8),
  aw('Series 8', 'series-8', 'Apple Watch Series 8', 41, true, 2022, 619, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m, IP6X', C8),
  aw('Series 8', 'series-8', 'Apple Watch Series 8', 45, true, 2022, 649, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m, IP6X', C8),
  aw('Series 8', 'series-8', 'Apple Watch Series 8', 41, true, 2022, 799, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m, IP6X', C8, 'acier inoxydable', 'acier'),
  aw('Series 8', 'series-8', 'Apple Watch Series 8', 45, true, 2022, 849, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m, IP6X', C8, 'acier inoxydable', 'acier'),
  aw('SE (2e génération)', 'se-2', 'Apple Watch SE', 44, false, 2022, 329, 'OLED Retina', H18, 'Oui', '50 m', CSE2),
  aw('SE (2e génération)', 'se-2', 'Apple Watch SE', 40, true, 2022, 349, 'OLED Retina', H18, 'Oui', '50 m', CSE2),
  aw('SE (2e génération)', 'se-2', 'Apple Watch SE', 44, true, 2022, 379, 'OLED Retina', H18, 'Oui', '50 m', CSE2),

  // ─── Series 9 ────────────────────────────────────────────────────────────
  aw('Series 9', 'series-9', 'Apple Watch Series 9', 45, false, 2023, 479, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m, IP6X', C8),
  aw('Series 9', 'series-9', 'Apple Watch Series 9', 41, true, 2023, 569, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m, IP6X', C8),
  aw('Series 9', 'series-9', 'Apple Watch Series 9', 45, true, 2023, 599, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m, IP6X', C8),
  aw('Series 9', 'series-9', 'Apple Watch Series 9', 41, true, 2023, 799, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m, IP6X', C8, 'acier inoxydable', 'acier'),
  aw('Series 9', 'series-9', 'Apple Watch Series 9', 45, true, 2023, 849, 'LTPO OLED Retina toujours activé', H18, 'Oui', '50 m, IP6X', C8, 'acier inoxydable', 'acier'),

  // ─── Series 10 ───────────────────────────────────────────────────────────
  aw('Series 10', 'series-10', 'Apple Watch Series 10', 46, false, 2024, 479, 'LTPO3 OLED grand angle', H18, 'Oui', '50 m, IP6X', C8),
  aw('Series 10', 'series-10', 'Apple Watch Series 10', 42, true, 2024, 569, 'LTPO3 OLED grand angle', H18, 'Oui', '50 m, IP6X', C8),
  aw('Series 10', 'series-10', 'Apple Watch Series 10', 46, true, 2024, 599, 'LTPO3 OLED grand angle', H18, 'Oui', '50 m, IP6X', C8),
  aw('Series 10', 'series-10', 'Apple Watch Series 10', 42, true, 2024, 799, 'LTPO3 OLED grand angle', H18, 'Oui', '50 m, IP6X', C8, 'titane', 'titane'),
  aw('Series 10', 'series-10', 'Apple Watch Series 10', 46, true, 2024, 849, 'LTPO3 OLED grand angle', H18, 'Oui', '50 m, IP6X', C8, 'titane', 'titane'),

  // ─── Series 11, SE 3 ─────────────────────────────────────────────────────
  aw('Series 11', 'series-11', 'Apple Watch Series 11', 46, false, 2025, 479, 'LTPO3 OLED grand angle', "Jusqu'à 24 h", 'Oui', '50 m, IP6X', C8),
  aw('Series 11', 'series-11', 'Apple Watch Series 11', 42, true, 2025, 569, 'LTPO3 OLED grand angle', "Jusqu'à 24 h", 'Oui', '50 m, IP6X', C8),
  aw('Series 11', 'series-11', 'Apple Watch Series 11', 46, true, 2025, 599, 'LTPO3 OLED grand angle', "Jusqu'à 24 h", 'Oui', '50 m, IP6X', C8),
  aw('Series 11', 'series-11', 'Apple Watch Series 11', 42, true, 2025, 799, 'LTPO3 OLED grand angle', "Jusqu'à 24 h", 'Oui', '50 m, IP6X', C8, 'titane', 'titane'),
  aw('Series 11', 'series-11', 'Apple Watch Series 11', 46, true, 2025, 849, 'LTPO3 OLED grand angle', "Jusqu'à 24 h", 'Oui', '50 m, IP6X', C8, 'titane', 'titane'),
  aw('SE 3', 'se-3', 'Apple Watch SE', 44, false, 2025, 299, 'LTPO OLED toujours activé', "Jusqu'à 32 h", 'Oui', '50 m, IP6X', CSE3),
  aw('SE 3', 'se-3', 'Apple Watch SE', 40, true, 2025, 319, 'LTPO OLED toujours activé', "Jusqu'à 32 h", 'Oui', '50 m, IP6X', CSE3),
  aw('SE 3', 'se-3', 'Apple Watch SE', 44, true, 2025, 349, 'LTPO OLED toujours activé', "Jusqu'à 32 h", 'Oui', '50 m, IP6X', CSE3),

  // ─── Samsung Gear (Tizen) ────────────────────────────────────────────────
  w('samsung-gear-2', 'Samsung', 'Samsung Gear 2', 'Gear', 2014, 299, ['1,63 pouce Super AMOLED', null, 'Non', 'IP67', AN, 'Cardio optique']),
  w('samsung-gear-2-neo', 'Samsung', 'Samsung Gear 2 Neo', 'Gear', 2014, 199, ['1,63 pouce Super AMOLED', null, 'Non', 'IP67', AN, 'Cardio optique']),
  w('samsung-gear-fit', 'Samsung', 'Samsung Gear Fit', 'Gear Fit', 2014, 199, ['1,84 pouce Super AMOLED incurvé', null, 'Non', 'IP67', AN, 'Cardio optique']),
  w('samsung-gear-s', 'Samsung', 'Samsung Gear S', 'Gear', 2014, 399, ['2 pouces Super AMOLED incurvé', null, 'Oui', 'IP67', AN, 'Cardio optique, baromètre']),
  w('samsung-gear-fit2', 'Samsung', 'Samsung Gear Fit2', 'Gear Fit', 2016, 199, ['1,5 pouce Super AMOLED incurvé', null, 'Oui', 'IP68', AI, 'Cardio optique, baromètre']),
  w('samsung-gear-fit2-pro', 'Samsung', 'Samsung Gear Fit2 Pro', 'Gear Fit', 2017, 229, ['1,5 pouce Super AMOLED incurvé', null, 'Oui', '5 ATM', AI, 'Cardio optique, baromètre']),
  w('samsung-gear-s2', 'Samsung', 'Samsung Gear S2', 'Gear S', 2015, 299, ['1,2 pouce Super AMOLED', "Jusqu'à 3 jours", 'Non', 'IP68', AI, 'Cardio optique, baromètre']),
  w('samsung-gear-s2-classic', 'Samsung', 'Samsung Gear S2 Classic', 'Gear S', 2015, 349, ['1,2 pouce Super AMOLED', "Jusqu'à 3 jours", 'Non', 'IP68', AI, 'Cardio optique, baromètre']),
  w('samsung-gear-s3-frontier', 'Samsung', 'Samsung Gear S3 Frontier', 'Gear S', 2016, 399, ['1,3 pouce Super AMOLED', "Jusqu'à 4 jours", 'Oui', 'IP68', AI, 'Cardio optique, altimètre, baromètre'], R),
  w('samsung-gear-s3-classic', 'Samsung', 'Samsung Gear S3 Classic', 'Gear S', 2016, 399, ['1,3 pouce Super AMOLED', "Jusqu'à 4 jours", 'Oui', 'IP68', AI, 'Cardio optique, altimètre, baromètre']),
  w('samsung-gear-sport', 'Samsung', 'Samsung Gear Sport', 'Gear', 2017, 349, ['1,2 pouce Super AMOLED', "Jusqu'à 3 jours", 'Oui', '5 ATM', AI, 'Cardio optique, baromètre']),

  // ─── Samsung Galaxy Watch (Tizen) ────────────────────────────────────────
  w('samsung-galaxy-watch-42mm-bluetooth', 'Samsung', 'Samsung Galaxy Watch 42 mm Bluetooth', 'Galaxy Watch', 2018, 309, ['1,2 pouce Super AMOLED', "Jusqu'à 3 jours", 'Oui', '5 ATM, IP68', AI, 'Cardio optique, baromètre']),
  w('samsung-galaxy-watch-46mm-bluetooth', 'Samsung', 'Samsung Galaxy Watch 46 mm Bluetooth', 'Galaxy Watch', 2018, 329, ['1,3 pouce Super AMOLED', "Jusqu'à 4 jours", 'Oui', '5 ATM, IP68', AI, 'Cardio optique, baromètre']),
  w('samsung-galaxy-watch-42mm-lte', 'Samsung', 'Samsung Galaxy Watch 42 mm 4G', 'Galaxy Watch', 2018, 359, ['1,2 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AI, 'Cardio optique, baromètre']),
  w('samsung-galaxy-watch-46mm-lte', 'Samsung', 'Samsung Galaxy Watch 46 mm 4G', 'Galaxy Watch', 2018, 379, ['1,3 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AI, 'Cardio optique, baromètre']),
  w('samsung-galaxy-watch-active-40mm', 'Samsung', 'Samsung Galaxy Watch Active 40 mm', 'Galaxy Watch Active', 2019, 249, ['1,1 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AI, 'Cardio optique, baromètre']),
  w('samsung-galaxy-watch-active2-40mm-bluetooth', 'Samsung', 'Samsung Galaxy Watch Active2 40 mm Bluetooth', 'Galaxy Watch Active', 2019, 299, ['1,2 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AI, 'Cardio optique, ECG, baromètre']),
  w('samsung-galaxy-watch-active2-44mm-bluetooth', 'Samsung', 'Samsung Galaxy Watch Active2 44 mm Bluetooth', 'Galaxy Watch Active', 2019, 319, ['1,4 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AI, 'Cardio optique, ECG, baromètre']),
  w('samsung-galaxy-watch-active2-40mm-lte', 'Samsung', 'Samsung Galaxy Watch Active2 40 mm 4G', 'Galaxy Watch Active', 2019, 399, ['1,2 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AI, 'Cardio optique, ECG, baromètre']),
  w('samsung-galaxy-watch-active2-44mm-lte', 'Samsung', 'Samsung Galaxy Watch Active2 44 mm 4G', 'Galaxy Watch Active', 2019, 419, ['1,4 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AI, 'Cardio optique, ECG, baromètre']),
  w('samsung-galaxy-watch3-41mm-bluetooth', 'Samsung', 'Samsung Galaxy Watch3 41 mm Bluetooth', 'Galaxy Watch', 2020, 419, ['1,2 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AI, 'Cardio optique, ECG, oxymètre (SpO2), baromètre']),
  w('samsung-galaxy-watch3-45mm-bluetooth', 'Samsung', 'Samsung Galaxy Watch3 45 mm Bluetooth', 'Galaxy Watch', 2020, 449, ['1,4 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AI, 'Cardio optique, ECG, oxymètre (SpO2), baromètre']),
  w('samsung-galaxy-watch3-41mm-lte', 'Samsung', 'Samsung Galaxy Watch3 41 mm 4G', 'Galaxy Watch', 2020, 469, ['1,2 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AI, 'Cardio optique, ECG, oxymètre (SpO2), baromètre']),
  w('samsung-galaxy-watch3-45mm-lte', 'Samsung', 'Samsung Galaxy Watch3 45 mm 4G', 'Galaxy Watch', 2020, 499, ['1,4 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AI, 'Cardio optique, ECG, oxymètre (SpO2), baromètre']),

  // ─── Samsung Galaxy Watch (Wear OS) ──────────────────────────────────────
  w('samsung-galaxy-watch4-40mm-bluetooth', 'Samsung', 'Samsung Galaxy Watch4 40 mm Bluetooth', 'Galaxy Watch', 2021, 269, ['1,2 pouce Super AMOLED', "Jusqu'à 40 h", 'Oui', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance)']),
  w('samsung-galaxy-watch4-44mm-bluetooth', 'Samsung', 'Samsung Galaxy Watch4 44 mm Bluetooth', 'Galaxy Watch', 2021, 299, ['1,4 pouce Super AMOLED', "Jusqu'à 40 h", 'Oui', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance)']),
  w('samsung-galaxy-watch4-40mm-lte', 'Samsung', 'Samsung Galaxy Watch4 40 mm 4G', 'Galaxy Watch', 2021, 319, ['1,2 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance)']),
  w('samsung-galaxy-watch4-44mm-lte', 'Samsung', 'Samsung Galaxy Watch4 44 mm 4G', 'Galaxy Watch', 2021, 349, ['1,4 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance)']),
  w('samsung-galaxy-watch4-classic-42mm-bluetooth', 'Samsung', 'Samsung Galaxy Watch4 Classic 42 mm Bluetooth', 'Galaxy Watch', 2021, 369, ['1,2 pouce Super AMOLED', "Jusqu'à 40 h", 'Oui', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance)']),
  w('samsung-galaxy-watch4-classic-46mm-bluetooth', 'Samsung', 'Samsung Galaxy Watch4 Classic 46 mm Bluetooth', 'Galaxy Watch', 2021, 399, ['1,4 pouce Super AMOLED', "Jusqu'à 40 h", 'Oui', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance)']),
  w('samsung-galaxy-watch4-classic-42mm-lte', 'Samsung', 'Samsung Galaxy Watch4 Classic 42 mm 4G', 'Galaxy Watch', 2021, 419, ['1,2 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance)']),
  w('samsung-galaxy-watch4-classic-46mm-lte', 'Samsung', 'Samsung Galaxy Watch4 Classic 46 mm 4G', 'Galaxy Watch', 2021, 449, ['1,4 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance)']),
  w('samsung-galaxy-watch5-44mm-bluetooth', 'Samsung', 'Samsung Galaxy Watch5 44 mm Bluetooth', 'Galaxy Watch', 2022, 329, ['1,4 pouce Super AMOLED', "Jusqu'à 50 h", 'Oui', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance), température']),
  w('samsung-galaxy-watch5-40mm-lte', 'Samsung', 'Samsung Galaxy Watch5 40 mm 4G', 'Galaxy Watch', 2022, 349, ['1,2 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance), température']),
  w('samsung-galaxy-watch5-44mm-lte', 'Samsung', 'Samsung Galaxy Watch5 44 mm 4G', 'Galaxy Watch', 2022, 379, ['1,4 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance), température']),
  w('samsung-galaxy-watch5-pro-45mm-lte', 'Samsung', 'Samsung Galaxy Watch5 Pro 45 mm 4G', 'Galaxy Watch', 2022, 519, ['1,4 pouce Super AMOLED', "Jusqu'à 80 h", 'Oui', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance), température'], R),
  w('samsung-galaxy-watch6-44mm-bluetooth', 'Samsung', 'Samsung Galaxy Watch6 44 mm Bluetooth', 'Galaxy Watch', 2023, 349, ['1,5 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance), température']),
  w('samsung-galaxy-watch6-40mm-lte', 'Samsung', 'Samsung Galaxy Watch6 40 mm 4G', 'Galaxy Watch', 2023, 369, ['1,3 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance), température']),
  w('samsung-galaxy-watch6-44mm-lte', 'Samsung', 'Samsung Galaxy Watch6 44 mm 4G', 'Galaxy Watch', 2023, 399, ['1,5 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance), température']),
  w('samsung-galaxy-watch6-classic-47mm-bluetooth', 'Samsung', 'Samsung Galaxy Watch6 Classic 47 mm Bluetooth', 'Galaxy Watch', 2023, 449, ['1,5 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance), température']),
  w('samsung-galaxy-watch6-classic-43mm-lte', 'Samsung', 'Samsung Galaxy Watch6 Classic 43 mm 4G', 'Galaxy Watch', 2023, 469, ['1,3 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance), température']),
  w('samsung-galaxy-watch6-classic-47mm-lte', 'Samsung', 'Samsung Galaxy Watch6 Classic 47 mm 4G', 'Galaxy Watch', 2023, 499, ['1,5 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance), température']),
  w('samsung-galaxy-watch7-44mm-bluetooth', 'Samsung', 'Samsung Galaxy Watch7 44 mm Bluetooth', 'Galaxy Watch', 2024, 349, ['1,5 pouce Super AMOLED', null, 'Oui (bifréquence)', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance), température']),
  w('samsung-galaxy-watch7-40mm-lte', 'Samsung', 'Samsung Galaxy Watch7 40 mm 4G', 'Galaxy Watch', 2024, 369, ['1,3 pouce Super AMOLED', null, 'Oui (bifréquence)', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance), température']),
  w('samsung-galaxy-watch7-44mm-lte', 'Samsung', 'Samsung Galaxy Watch7 44 mm 4G', 'Galaxy Watch', 2024, 399, ['1,5 pouce Super AMOLED', null, 'Oui (bifréquence)', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance), température']),
  w('samsung-galaxy-watch-fe-40mm-bluetooth', 'Samsung', 'Samsung Galaxy Watch FE 40 mm Bluetooth', 'Galaxy Watch', 2024, 199, ['1,2 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance)'], ['mobile', 'sport', 'budget']),
  w('samsung-galaxy-watch-fe-40mm-lte', 'Samsung', 'Samsung Galaxy Watch FE 40 mm 4G', 'Galaxy Watch', 2024, 249, ['1,2 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance)'], ['mobile', 'sport', 'budget']),
  w('samsung-galaxy-watch8-44mm-bluetooth', 'Samsung', 'Samsung Galaxy Watch8 44 mm Bluetooth', 'Galaxy Watch', 2025, 399, [null, null, 'Oui (bifréquence)', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance), température']),
  w('samsung-galaxy-watch8-40mm-lte', 'Samsung', 'Samsung Galaxy Watch8 40 mm 4G', 'Galaxy Watch', 2025, 419, [null, null, 'Oui (bifréquence)', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance), température']),
  w('samsung-galaxy-watch8-44mm-lte', 'Samsung', 'Samsung Galaxy Watch8 44 mm 4G', 'Galaxy Watch', 2025, 449, [null, null, 'Oui (bifréquence)', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance), température']),
  w('samsung-galaxy-watch8-classic-46mm-lte', 'Samsung', 'Samsung Galaxy Watch8 Classic 46 mm 4G', 'Galaxy Watch', 2025, 549, [null, null, 'Oui (bifréquence)', '5 ATM, IP68', AN, 'BioActive (cardio, ECG, bio-impédance), température']),

  // ─── Samsung Galaxy Fit ──────────────────────────────────────────────────
  w('samsung-galaxy-fit', 'Samsung', 'Samsung Galaxy Fit', 'Galaxy Fit', 2019, 99, ['0,95 pouce AMOLED', "Jusqu'à 7 jours", 'Non', '5 ATM', AI, 'Cardio optique'], ['mobile', 'sport', 'budget']),
  w('samsung-galaxy-fit-e', 'Samsung', 'Samsung Galaxy Fit e', 'Galaxy Fit', 2019, 39, ['0,74 pouce PMOLED', "Jusqu'à 7 jours", 'Non', '5 ATM', AI, 'Cardio optique'], ['mobile', 'sport', 'budget']),
  w('samsung-galaxy-fit2', 'Samsung', 'Samsung Galaxy Fit2', 'Galaxy Fit', 2020, 59, ['1,1 pouce AMOLED', "Jusqu'à 15 jours", 'Non', '5 ATM', AI, 'Cardio optique'], ['mobile', 'sport', 'budget']),
  w('samsung-galaxy-fit3', 'Samsung', 'Samsung Galaxy Fit3', 'Galaxy Fit', 2024, 69, ['1,6 pouce AMOLED', "Jusqu'à 13 jours", 'Non', '5 ATM, IP68', AN, 'Cardio optique, oxymètre (SpO2)'], ['mobile', 'sport', 'budget']),
];
