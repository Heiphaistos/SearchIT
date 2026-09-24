import type { CatalogProduct } from '../types.js';

/*
 * Smartphones et montres connectées de référence.
 * Les caractéristiques incertaines sont volontairement omises plutôt que devinées.
 */

type Opt = string | number | null | undefined;
type SpecMap = Record<string, string | number>;

const PHONE_KEYS = ['Écran', 'Définition', 'Rafraîchissement', 'Processeur', 'RAM', 'Stockage', 'Batterie', 'Charge rapide', 'Appareil photo', '5G', 'Système', 'Poids'] as const;
const WATCH_KEYS = ['Écran', 'Autonomie', 'GPS', 'Étanchéité', 'Compatibilité', 'Capteurs'] as const;

function build(keys: readonly string[], values: Opt[]): SpecMap {
  const out: SpecMap = {};
  keys.forEach((k, i) => {
    const v = values[i];
    if (v !== null && v !== undefined && v !== '') out[k] = v;
  });
  return out;
}

/** Specs smartphone dans l'ordre de SPEC_KEYS ; null = inconnu (omis). */
function ps(
  ecran: Opt, def: Opt, hz: Opt, soc: Opt, ram: Opt, stockage: Opt,
  batterie: Opt, charge: Opt, photo: Opt, g5: boolean | null, sys: Opt, poids: Opt,
): SpecMap {
  return build(PHONE_KEYS, [ecran, def, hz, soc, ram, stockage, batterie, charge, photo, g5 === null ? null : g5 ? 'Oui' : 'Non', sys, poids]);
}

/** Specs montre dans l'ordre de SPEC_KEYS ; null = inconnu (omis). */
function ws(ecran: Opt, autonomie: Opt, gps: Opt, etanche: Opt, compat: Opt, capteurs: Opt): SpecMap {
  return build(WATCH_KEYS, [ecran, autonomie, gps, etanche, compat, capteurs]);
}

function phone(
  slug: string, brand: string, name: string, family: string, year: number,
  msrp: number | null, specs: SpecMap, tags: string[] = ['mobile'],
): CatalogProduct {
  const p: CatalogProduct = { id: `smartphone-${slug}`, category: 'smartphone', brand, name, family, year, refurbishable: true, tags, specs };
  if (msrp !== null) p.msrp = msrp;
  return p;
}

function watch(
  slug: string, brand: string, name: string, family: string, year: number,
  msrp: number | null, specs: SpecMap, tags: string[] = ['mobile', 'sport'],
): CatalogProduct {
  const p: CatalogProduct = { id: `smartwatch-${slug}`, category: 'smartwatch', brand, name, family, year, refurbishable: true, tags, specs };
  if (msrp !== null) p.msrp = msrp;
  return p;
}

const A = 'Android';
const I = 'iOS';

export const PRODUCTS: CatalogProduct[] = [
  // ───────────────────────────── Apple iPhone ─────────────────────────────
  phone('apple-iphone-11-64go', 'Apple', 'Apple iPhone 11 64 Go', 'iPhone 11', 2019, 809,
    ps('6,1 pouces LCD', '1792 x 828', '60 Hz', 'Apple A13 Bionic', '4 Go', '64 Go', '3 110 mAh', null, '12 Mpx', false, I, '194 g')),
  phone('apple-iphone-11-pro-64go', 'Apple', 'Apple iPhone 11 Pro 64 Go', 'iPhone 11', 2019, 1159,
    ps('5,8 pouces OLED', '2436 x 1125', '60 Hz', 'Apple A13 Bionic', '4 Go', '64 Go', '3 046 mAh', null, '12 Mpx', false, I, '188 g'), ['mobile', 'photo']),
  phone('apple-iphone-11-pro-max-64go', 'Apple', 'Apple iPhone 11 Pro Max 64 Go', 'iPhone 11', 2019, 1259,
    ps('6,5 pouces OLED', '2688 x 1242', '60 Hz', 'Apple A13 Bionic', '4 Go', '64 Go', '3 969 mAh', null, '12 Mpx', false, I, '226 g'), ['mobile', 'photo']),
  phone('apple-iphone-se-2-64go', 'Apple', 'Apple iPhone SE (2e génération) 64 Go', 'iPhone SE', 2020, 489,
    ps('4,7 pouces LCD', '1334 x 750', '60 Hz', 'Apple A13 Bionic', '3 Go', '64 Go', '1 821 mAh', null, '12 Mpx', false, I, '148 g'), ['mobile', 'budget']),
  phone('apple-iphone-12-mini-64go', 'Apple', 'Apple iPhone 12 mini 64 Go', 'iPhone 12', 2020, 809,
    ps('5,4 pouces OLED', '2340 x 1080', '60 Hz', 'Apple A14 Bionic', '4 Go', '64 Go', '2 227 mAh', null, '12 Mpx', true, I, '133 g')),
  phone('apple-iphone-12-64go', 'Apple', 'Apple iPhone 12 64 Go', 'iPhone 12', 2020, 909,
    ps('6,1 pouces OLED', '2532 x 1170', '60 Hz', 'Apple A14 Bionic', '4 Go', '64 Go', '2 815 mAh', null, '12 Mpx', true, I, '164 g')),
  phone('apple-iphone-12-pro-128go', 'Apple', 'Apple iPhone 12 Pro 128 Go', 'iPhone 12', 2020, 1159,
    ps('6,1 pouces OLED', '2532 x 1170', '60 Hz', 'Apple A14 Bionic', '6 Go', '128 Go', '2 815 mAh', null, '12 Mpx', true, I, '189 g'), ['mobile', 'photo']),
  phone('apple-iphone-12-pro-max-128go', 'Apple', 'Apple iPhone 12 Pro Max 128 Go', 'iPhone 12', 2020, 1259,
    ps('6,7 pouces OLED', '2778 x 1284', '60 Hz', 'Apple A14 Bionic', '6 Go', '128 Go', '3 687 mAh', null, '12 Mpx', true, I, '228 g'), ['mobile', 'photo']),
  phone('apple-iphone-13-mini-128go', 'Apple', 'Apple iPhone 13 mini 128 Go', 'iPhone 13', 2021, 809,
    ps('5,4 pouces OLED', '2340 x 1080', '60 Hz', 'Apple A15 Bionic', '4 Go', '128 Go', '2 406 mAh', null, '12 Mpx', true, I, '140 g')),
  phone('apple-iphone-13-128go', 'Apple', 'Apple iPhone 13 128 Go', 'iPhone 13', 2021, 909,
    ps('6,1 pouces OLED', '2532 x 1170', '60 Hz', 'Apple A15 Bionic', '4 Go', '128 Go', '3 240 mAh', null, '12 Mpx', true, I, '173 g')),
  phone('apple-iphone-13-pro-128go', 'Apple', 'Apple iPhone 13 Pro 128 Go', 'iPhone 13', 2021, 1159,
    ps('6,1 pouces OLED', '2532 x 1170', '120 Hz', 'Apple A15 Bionic', '6 Go', '128 Go', '3 095 mAh', null, '12 Mpx', true, I, '203 g'), ['mobile', 'photo']),
  phone('apple-iphone-13-pro-max-128go', 'Apple', 'Apple iPhone 13 Pro Max 128 Go', 'iPhone 13', 2021, 1259,
    ps('6,7 pouces OLED', '2778 x 1284', '120 Hz', 'Apple A15 Bionic', '6 Go', '128 Go', '4 352 mAh', null, '12 Mpx', true, I, '238 g'), ['mobile', 'photo']),
  phone('apple-iphone-se-3-64go', 'Apple', 'Apple iPhone SE (3e génération) 64 Go', 'iPhone SE', 2022, 529,
    ps('4,7 pouces LCD', '1334 x 750', '60 Hz', 'Apple A15 Bionic', '4 Go', '64 Go', '2 018 mAh', null, '12 Mpx', true, I, '144 g'), ['mobile', 'budget']),
  phone('apple-iphone-14-128go', 'Apple', 'Apple iPhone 14 128 Go', 'iPhone 14', 2022, 1019,
    ps('6,1 pouces OLED', '2532 x 1170', '60 Hz', 'Apple A15 Bionic', '6 Go', '128 Go', '3 279 mAh', null, '12 Mpx', true, I, '172 g')),
  phone('apple-iphone-14-plus-128go', 'Apple', 'Apple iPhone 14 Plus 128 Go', 'iPhone 14', 2022, 1169,
    ps('6,7 pouces OLED', '2778 x 1284', '60 Hz', 'Apple A15 Bionic', '6 Go', '128 Go', '4 325 mAh', null, '12 Mpx', true, I, '203 g')),
  phone('apple-iphone-14-pro-128go', 'Apple', 'Apple iPhone 14 Pro 128 Go', 'iPhone 14', 2022, 1329,
    ps('6,1 pouces OLED', '2556 x 1179', '120 Hz', 'Apple A16 Bionic', '6 Go', '128 Go', '3 200 mAh', null, '48 Mpx', true, I, '206 g'), ['mobile', 'photo']),
  phone('apple-iphone-14-pro-max-128go', 'Apple', 'Apple iPhone 14 Pro Max 128 Go', 'iPhone 14', 2022, 1479,
    ps('6,7 pouces OLED', '2796 x 1290', '120 Hz', 'Apple A16 Bionic', '6 Go', '128 Go', '4 323 mAh', null, '48 Mpx', true, I, '240 g'), ['mobile', 'photo']),
  phone('apple-iphone-15-128go', 'Apple', 'Apple iPhone 15 128 Go', 'iPhone 15', 2023, 969,
    ps('6,1 pouces OLED', '2556 x 1179', '60 Hz', 'Apple A16 Bionic', '6 Go', '128 Go', '3 349 mAh', null, '48 Mpx', true, I, '171 g')),
  phone('apple-iphone-15-256go', 'Apple', 'Apple iPhone 15 256 Go', 'iPhone 15', 2023, 1099,
    ps('6,1 pouces OLED', '2556 x 1179', '60 Hz', 'Apple A16 Bionic', '6 Go', '256 Go', '3 349 mAh', null, '48 Mpx', true, I, '171 g')),
  phone('apple-iphone-15-plus-128go', 'Apple', 'Apple iPhone 15 Plus 128 Go', 'iPhone 15', 2023, 1119,
    ps('6,7 pouces OLED', '2796 x 1290', '60 Hz', 'Apple A16 Bionic', '6 Go', '128 Go', '4 383 mAh', null, '48 Mpx', true, I, '201 g')),
  phone('apple-iphone-15-pro-128go', 'Apple', 'Apple iPhone 15 Pro 128 Go', 'iPhone 15', 2023, 1229,
    ps('6,1 pouces OLED', '2556 x 1179', '120 Hz', 'Apple A17 Pro', '8 Go', '128 Go', '3 274 mAh', null, '48 Mpx', true, I, '187 g'), ['mobile', 'photo', 'gaming']),
  phone('apple-iphone-15-pro-256go', 'Apple', 'Apple iPhone 15 Pro 256 Go', 'iPhone 15', 2023, 1359,
    ps('6,1 pouces OLED', '2556 x 1179', '120 Hz', 'Apple A17 Pro', '8 Go', '256 Go', '3 274 mAh', null, '48 Mpx', true, I, '187 g'), ['mobile', 'photo', 'gaming']),
  phone('apple-iphone-15-pro-max-256go', 'Apple', 'Apple iPhone 15 Pro Max 256 Go', 'iPhone 15', 2023, 1479,
    ps('6,7 pouces OLED', '2796 x 1290', '120 Hz', 'Apple A17 Pro', '8 Go', '256 Go', '4 441 mAh', null, '48 Mpx', true, I, '221 g'), ['mobile', 'photo', 'gaming']),
  phone('apple-iphone-16-128go', 'Apple', 'Apple iPhone 16 128 Go', 'iPhone 16', 2024, 969,
    ps('6,1 pouces OLED', '2556 x 1179', '60 Hz', 'Apple A18', '8 Go', '128 Go', '3 561 mAh', null, '48 Mpx', true, I, '170 g')),
  phone('apple-iphone-16-256go', 'Apple', 'Apple iPhone 16 256 Go', 'iPhone 16', 2024, 1099,
    ps('6,1 pouces OLED', '2556 x 1179', '60 Hz', 'Apple A18', '8 Go', '256 Go', '3 561 mAh', null, '48 Mpx', true, I, '170 g')),
  phone('apple-iphone-16-plus-128go', 'Apple', 'Apple iPhone 16 Plus 128 Go', 'iPhone 16', 2024, 1119,
    ps('6,7 pouces OLED', '2796 x 1290', '60 Hz', 'Apple A18', '8 Go', '128 Go', '4 674 mAh', null, '48 Mpx', true, I, '199 g')),
  phone('apple-iphone-16-pro-128go', 'Apple', 'Apple iPhone 16 Pro 128 Go', 'iPhone 16', 2024, 1229,
    ps('6,3 pouces OLED', '2622 x 1206', '120 Hz', 'Apple A18 Pro', '8 Go', '128 Go', '3 582 mAh', null, '48 Mpx', true, I, '199 g'), ['mobile', 'photo', 'gaming']),
  phone('apple-iphone-16-pro-256go', 'Apple', 'Apple iPhone 16 Pro 256 Go', 'iPhone 16', 2024, 1359,
    ps('6,3 pouces OLED', '2622 x 1206', '120 Hz', 'Apple A18 Pro', '8 Go', '256 Go', '3 582 mAh', null, '48 Mpx', true, I, '199 g'), ['mobile', 'photo', 'gaming']),
  phone('apple-iphone-16-pro-max-256go', 'Apple', 'Apple iPhone 16 Pro Max 256 Go', 'iPhone 16', 2024, 1479,
    ps('6,9 pouces OLED', '2868 x 1320', '120 Hz', 'Apple A18 Pro', '8 Go', '256 Go', '4 685 mAh', null, '48 Mpx', true, I, '227 g'), ['mobile', 'photo', 'gaming']),
  phone('apple-iphone-16e-128go', 'Apple', 'Apple iPhone 16e 128 Go', 'iPhone 16', 2025, 719,
    ps('6,1 pouces OLED', '2532 x 1170', '60 Hz', 'Apple A18', '8 Go', '128 Go', '4 005 mAh', null, '48 Mpx', true, I, '167 g')),
  phone('apple-iphone-17-256go', 'Apple', 'Apple iPhone 17 256 Go', 'iPhone 17', 2025, 969,
    ps('6,3 pouces OLED', '2622 x 1206', '120 Hz', 'Apple A19', '8 Go', '256 Go', null, null, '48 Mpx', true, I, '177 g')),
  phone('apple-iphone-air-256go', 'Apple', 'Apple iPhone Air 256 Go', 'iPhone 17', 2025, 1229,
    ps('6,5 pouces OLED', null, '120 Hz', 'Apple A19 Pro', '12 Go', '256 Go', null, null, '48 Mpx', true, I, '165 g')),
  phone('apple-iphone-17-pro-256go', 'Apple', 'Apple iPhone 17 Pro 256 Go', 'iPhone 17', 2025, 1329,
    ps('6,3 pouces OLED', '2622 x 1206', '120 Hz', 'Apple A19 Pro', '12 Go', '256 Go', null, null, '48 Mpx', true, I, '204 g'), ['mobile', 'photo', 'gaming']),
  phone('apple-iphone-17-pro-max-256go', 'Apple', 'Apple iPhone 17 Pro Max 256 Go', 'iPhone 17', 2025, 1479,
    ps('6,9 pouces OLED', '2868 x 1320', '120 Hz', 'Apple A19 Pro', '12 Go', '256 Go', null, null, '48 Mpx', true, I, '231 g'), ['mobile', 'photo', 'gaming']),

  // ───────────────────────────── Samsung Galaxy S ─────────────────────────────
  phone('samsung-galaxy-s21-128go', 'Samsung', 'Samsung Galaxy S21 5G 128 Go', 'Galaxy S21', 2021, 859,
    ps('6,2 pouces Dynamic AMOLED 2X', '2400 x 1080', '120 Hz', 'Samsung Exynos 2100', '8 Go', '128 Go', '4 000 mAh', '25 W', '12 Mpx', true, A, '169 g')),
  phone('samsung-galaxy-s21-plus-128go', 'Samsung', 'Samsung Galaxy S21+ 5G 128 Go', 'Galaxy S21', 2021, 1059,
    ps('6,7 pouces Dynamic AMOLED 2X', '2400 x 1080', '120 Hz', 'Samsung Exynos 2100', '8 Go', '128 Go', '4 800 mAh', '25 W', '12 Mpx', true, A, '200 g')),
  phone('samsung-galaxy-s21-ultra-128go', 'Samsung', 'Samsung Galaxy S21 Ultra 5G 128 Go', 'Galaxy S21', 2021, 1259,
    ps('6,8 pouces Dynamic AMOLED 2X', '3200 x 1440', '120 Hz', 'Samsung Exynos 2100', '12 Go', '128 Go', '5 000 mAh', '25 W', '108 Mpx', true, A, '227 g'), ['mobile', 'photo']),
  phone('samsung-galaxy-s21-fe-128go', 'Samsung', 'Samsung Galaxy S21 FE 5G 128 Go', 'Galaxy S21', 2022, 759,
    ps('6,4 pouces Dynamic AMOLED 2X', '2340 x 1080', '120 Hz', 'Samsung Exynos 2100', '6 Go', '128 Go', '4 500 mAh', '25 W', '12 Mpx', true, A, '177 g')),
  phone('samsung-galaxy-s22-128go', 'Samsung', 'Samsung Galaxy S22 128 Go', 'Galaxy S22', 2022, 859,
    ps('6,1 pouces Dynamic AMOLED 2X', '2340 x 1080', '120 Hz', 'Samsung Exynos 2200', '8 Go', '128 Go', '3 700 mAh', '25 W', '50 Mpx', true, A, '167 g')),
  phone('samsung-galaxy-s22-plus-128go', 'Samsung', 'Samsung Galaxy S22+ 128 Go', 'Galaxy S22', 2022, 1059,
    ps('6,6 pouces Dynamic AMOLED 2X', '2340 x 1080', '120 Hz', 'Samsung Exynos 2200', '8 Go', '128 Go', '4 500 mAh', '45 W', '50 Mpx', true, A, '195 g')),
  phone('samsung-galaxy-s22-ultra-128go', 'Samsung', 'Samsung Galaxy S22 Ultra 128 Go', 'Galaxy S22', 2022, 1259,
    ps('6,8 pouces Dynamic AMOLED 2X', '3088 x 1440', '120 Hz', 'Samsung Exynos 2200', '8 Go', '128 Go', '5 000 mAh', '45 W', '108 Mpx', true, A, '228 g'), ['mobile', 'photo', 'pro']),
  phone('samsung-galaxy-s23-128go', 'Samsung', 'Samsung Galaxy S23 128 Go', 'Galaxy S23', 2023, 959,
    ps('6,1 pouces Dynamic AMOLED 2X', '2340 x 1080', '120 Hz', 'Qualcomm Snapdragon 8 Gen 2 for Galaxy', '8 Go', '128 Go', '3 900 mAh', '25 W', '50 Mpx', true, A, '168 g')),
  phone('samsung-galaxy-s23-256go', 'Samsung', 'Samsung Galaxy S23 256 Go', 'Galaxy S23', 2023, 1019,
    ps('6,1 pouces Dynamic AMOLED 2X', '2340 x 1080', '120 Hz', 'Qualcomm Snapdragon 8 Gen 2 for Galaxy', '8 Go', '256 Go', '3 900 mAh', '25 W', '50 Mpx', true, A, '168 g')),
  phone('samsung-galaxy-s23-plus-256go', 'Samsung', 'Samsung Galaxy S23+ 256 Go', 'Galaxy S23', 2023, 1219,
    ps('6,6 pouces Dynamic AMOLED 2X', '2340 x 1080', '120 Hz', 'Qualcomm Snapdragon 8 Gen 2 for Galaxy', '8 Go', '256 Go', '4 700 mAh', '45 W', '50 Mpx', true, A, '196 g')),
  phone('samsung-galaxy-s23-ultra-256go', 'Samsung', 'Samsung Galaxy S23 Ultra 256 Go', 'Galaxy S23', 2023, 1419,
    ps('6,8 pouces Dynamic AMOLED 2X', '3088 x 1440', '120 Hz', 'Qualcomm Snapdragon 8 Gen 2 for Galaxy', '8 Go', '256 Go', '5 000 mAh', '45 W', '200 Mpx', true, A, '234 g'), ['mobile', 'photo', 'pro']),
  phone('samsung-galaxy-s23-fe-128go', 'Samsung', 'Samsung Galaxy S23 FE 128 Go', 'Galaxy S23', 2023, 699,
    ps('6,4 pouces Dynamic AMOLED 2X', '2340 x 1080', '120 Hz', 'Samsung Exynos 2200', '8 Go', '128 Go', '4 500 mAh', '25 W', '50 Mpx', true, A, '209 g')),
  phone('samsung-galaxy-s24-128go', 'Samsung', 'Samsung Galaxy S24 128 Go', 'Galaxy S24', 2024, 899,
    ps('6,2 pouces Dynamic AMOLED 2X', '2340 x 1080', '120 Hz', 'Samsung Exynos 2400', '8 Go', '128 Go', '4 000 mAh', '25 W', '50 Mpx', true, A, '167 g')),
  phone('samsung-galaxy-s24-256go', 'Samsung', 'Samsung Galaxy S24 256 Go', 'Galaxy S24', 2024, 959,
    ps('6,2 pouces Dynamic AMOLED 2X', '2340 x 1080', '120 Hz', 'Samsung Exynos 2400', '8 Go', '256 Go', '4 000 mAh', '25 W', '50 Mpx', true, A, '167 g')),
  phone('samsung-galaxy-s24-plus-256go', 'Samsung', 'Samsung Galaxy S24+ 256 Go', 'Galaxy S24', 2024, 1169,
    ps('6,7 pouces Dynamic AMOLED 2X', '3120 x 1440', '120 Hz', 'Samsung Exynos 2400', '12 Go', '256 Go', '4 900 mAh', '45 W', '50 Mpx', true, A, '196 g')),
  phone('samsung-galaxy-s24-ultra-256go', 'Samsung', 'Samsung Galaxy S24 Ultra 256 Go', 'Galaxy S24', 2024, 1469,
    ps('6,8 pouces Dynamic AMOLED 2X', '3120 x 1440', '120 Hz', 'Qualcomm Snapdragon 8 Gen 3 for Galaxy', '12 Go', '256 Go', '5 000 mAh', '45 W', '200 Mpx', true, A, '232 g'), ['mobile', 'photo', 'pro', 'gaming']),
  phone('samsung-galaxy-s24-fe-128go', 'Samsung', 'Samsung Galaxy S24 FE 128 Go', 'Galaxy S24', 2024, 799,
    ps('6,7 pouces Dynamic AMOLED 2X', '2340 x 1080', '120 Hz', 'Samsung Exynos 2400e', '8 Go', '128 Go', '4 700 mAh', '25 W', '50 Mpx', true, A, '213 g')),
  phone('samsung-galaxy-s25-128go', 'Samsung', 'Samsung Galaxy S25 128 Go', 'Galaxy S25', 2025, 899,
    ps('6,2 pouces Dynamic AMOLED 2X', '2340 x 1080', '120 Hz', 'Qualcomm Snapdragon 8 Elite for Galaxy', '12 Go', '128 Go', '4 000 mAh', '25 W', '50 Mpx', true, A, '162 g')),
  phone('samsung-galaxy-s25-256go', 'Samsung', 'Samsung Galaxy S25 256 Go', 'Galaxy S25', 2025, 959,
    ps('6,2 pouces Dynamic AMOLED 2X', '2340 x 1080', '120 Hz', 'Qualcomm Snapdragon 8 Elite for Galaxy', '12 Go', '256 Go', '4 000 mAh', '25 W', '50 Mpx', true, A, '162 g')),
  phone('samsung-galaxy-s25-plus-256go', 'Samsung', 'Samsung Galaxy S25+ 256 Go', 'Galaxy S25', 2025, 1169,
    ps('6,7 pouces Dynamic AMOLED 2X', '3120 x 1440', '120 Hz', 'Qualcomm Snapdragon 8 Elite for Galaxy', '12 Go', '256 Go', '4 900 mAh', '45 W', '50 Mpx', true, A, '190 g')),
  phone('samsung-galaxy-s25-ultra-256go', 'Samsung', 'Samsung Galaxy S25 Ultra 256 Go', 'Galaxy S25', 2025, 1469,
    ps('6,9 pouces Dynamic AMOLED 2X', '3120 x 1440', '120 Hz', 'Qualcomm Snapdragon 8 Elite for Galaxy', '12 Go', '256 Go', '5 000 mAh', '45 W', '200 Mpx', true, A, '218 g'), ['mobile', 'photo', 'pro', 'gaming']),
  phone('samsung-galaxy-s25-edge-256go', 'Samsung', 'Samsung Galaxy S25 Edge 256 Go', 'Galaxy S25', 2025, 1249,
    ps('6,7 pouces Dynamic AMOLED 2X', '3120 x 1440', '120 Hz', 'Qualcomm Snapdragon 8 Elite for Galaxy', '12 Go', '256 Go', '3 900 mAh', '25 W', '200 Mpx', true, A, '163 g')),
  phone('samsung-galaxy-s25-fe-128go', 'Samsung', 'Samsung Galaxy S25 FE 128 Go', 'Galaxy S25', 2025, null,
    ps('6,7 pouces Dynamic AMOLED 2X', '2340 x 1080', '120 Hz', 'Samsung Exynos 2400', '8 Go', '128 Go', '4 900 mAh', '45 W', '50 Mpx', true, A, '190 g')),

  // ───────────────────────────── Samsung Galaxy Z ─────────────────────────────
  phone('samsung-galaxy-z-flip5-256go', 'Samsung', 'Samsung Galaxy Z Flip5 256 Go', 'Galaxy Z', 2023, 1199,
    ps('6,7 pouces Dynamic AMOLED 2X pliable', '2640 x 1080', '120 Hz', 'Qualcomm Snapdragon 8 Gen 2 for Galaxy', '8 Go', '256 Go', '3 700 mAh', '25 W', '12 Mpx', true, A, '187 g')),
  phone('samsung-galaxy-z-fold5-256go', 'Samsung', 'Samsung Galaxy Z Fold5 256 Go', 'Galaxy Z', 2023, 1899,
    ps('7,6 pouces Dynamic AMOLED 2X pliable', '2176 x 1812', '120 Hz', 'Qualcomm Snapdragon 8 Gen 2 for Galaxy', '12 Go', '256 Go', '4 400 mAh', '25 W', '50 Mpx', true, A, '253 g'), ['mobile', 'pro']),
  phone('samsung-galaxy-z-flip6-256go', 'Samsung', 'Samsung Galaxy Z Flip6 256 Go', 'Galaxy Z', 2024, 1199,
    ps('6,7 pouces Dynamic AMOLED 2X pliable', '2640 x 1080', '120 Hz', 'Qualcomm Snapdragon 8 Gen 3 for Galaxy', '12 Go', '256 Go', '4 000 mAh', '25 W', '50 Mpx', true, A, '187 g')),
  phone('samsung-galaxy-z-fold6-256go', 'Samsung', 'Samsung Galaxy Z Fold6 256 Go', 'Galaxy Z', 2024, 1999,
    ps('7,6 pouces Dynamic AMOLED 2X pliable', '2160 x 1856', '120 Hz', 'Qualcomm Snapdragon 8 Gen 3 for Galaxy', '12 Go', '256 Go', '4 400 mAh', '25 W', '50 Mpx', true, A, '239 g'), ['mobile', 'pro']),
  phone('samsung-galaxy-z-flip7-256go', 'Samsung', 'Samsung Galaxy Z Flip7 256 Go', 'Galaxy Z', 2025, null,
    ps('6,9 pouces Dynamic AMOLED 2X pliable', '2520 x 1080', '120 Hz', 'Samsung Exynos 2500', '12 Go', '256 Go', '4 300 mAh', '25 W', '50 Mpx', true, A, '188 g')),
  phone('samsung-galaxy-z-fold7-256go', 'Samsung', 'Samsung Galaxy Z Fold7 256 Go', 'Galaxy Z', 2025, 2099,
    ps('8 pouces Dynamic AMOLED 2X pliable', '2184 x 1968', '120 Hz', 'Qualcomm Snapdragon 8 Elite for Galaxy', '12 Go', '256 Go', '4 400 mAh', '25 W', '200 Mpx', true, A, '215 g'), ['mobile', 'pro', 'photo']),

  // ───────────────────────────── Samsung Galaxy A ─────────────────────────────
  phone('samsung-galaxy-a15-5g-128go', 'Samsung', 'Samsung Galaxy A15 5G 128 Go', 'Galaxy A', 2023, null,
    ps('6,5 pouces Super AMOLED', '2340 x 1080', '90 Hz', 'MediaTek Dimensity 6100+', '4 Go', '128 Go', '5 000 mAh', '25 W', '50 Mpx', true, A, null), ['mobile', 'budget']),
  phone('samsung-galaxy-a16-5g-128go', 'Samsung', 'Samsung Galaxy A16 5G 128 Go', 'Galaxy A', 2024, null,
    ps('6,7 pouces Super AMOLED', '2340 x 1080', '90 Hz', 'Samsung Exynos 1330', '4 Go', '128 Go', '5 000 mAh', '25 W', '50 Mpx', true, A, '192 g'), ['mobile', 'budget']),
  phone('samsung-galaxy-a25-5g-128go', 'Samsung', 'Samsung Galaxy A25 5G 128 Go', 'Galaxy A', 2023, null,
    ps('6,5 pouces Super AMOLED', '2340 x 1080', '120 Hz', 'Samsung Exynos 1280', '6 Go', '128 Go', '5 000 mAh', '25 W', '50 Mpx', true, A, '197 g'), ['mobile', 'budget']),
  phone('samsung-galaxy-a35-5g-128go', 'Samsung', 'Samsung Galaxy A35 5G 128 Go', 'Galaxy A', 2024, 399,
    ps('6,6 pouces Super AMOLED', '2340 x 1080', '120 Hz', 'Samsung Exynos 1380', '6 Go', '128 Go', '5 000 mAh', '25 W', '50 Mpx', true, A, '209 g'), ['mobile', 'budget']),
  phone('samsung-galaxy-a55-5g-128go', 'Samsung', 'Samsung Galaxy A55 5G 128 Go', 'Galaxy A', 2024, null,
    ps('6,6 pouces Super AMOLED', '2340 x 1080', '120 Hz', 'Samsung Exynos 1480', '8 Go', '128 Go', '5 000 mAh', '25 W', '50 Mpx', true, A, '213 g')),
  phone('samsung-galaxy-a36-5g-128go', 'Samsung', 'Samsung Galaxy A36 5G 128 Go', 'Galaxy A', 2025, 379,
    ps('6,7 pouces Super AMOLED', '2340 x 1080', '120 Hz', 'Qualcomm Snapdragon 6 Gen 3', '6 Go', '128 Go', '5 000 mAh', '45 W', '50 Mpx', true, A, '195 g'), ['mobile', 'budget']),
  phone('samsung-galaxy-a56-5g-128go', 'Samsung', 'Samsung Galaxy A56 5G 128 Go', 'Galaxy A', 2025, null,
    ps('6,7 pouces Super AMOLED', '2340 x 1080', '120 Hz', 'Samsung Exynos 1580', '8 Go', '128 Go', '5 000 mAh', '45 W', '50 Mpx', true, A, '198 g')),

  // ───────────────────────────── Google Pixel ─────────────────────────────
  phone('google-pixel-6-128go', 'Google', 'Google Pixel 6 128 Go', 'Pixel 6', 2021, 649,
    ps('6,4 pouces OLED', '2400 x 1080', '90 Hz', 'Google Tensor', '8 Go', '128 Go', '4 614 mAh', null, '50 Mpx', true, A, '207 g')),
  phone('google-pixel-6-pro-128go', 'Google', 'Google Pixel 6 Pro 128 Go', 'Pixel 6', 2021, 899,
    ps('6,7 pouces OLED', '3120 x 1440', '120 Hz', 'Google Tensor', '12 Go', '128 Go', '5 003 mAh', null, '50 Mpx', true, A, '210 g'), ['mobile', 'photo']),
  phone('google-pixel-6a-128go', 'Google', 'Google Pixel 6a 128 Go', 'Pixel 6', 2022, 459,
    ps('6,1 pouces OLED', '2400 x 1080', '60 Hz', 'Google Tensor', '6 Go', '128 Go', '4 410 mAh', null, '12,2 Mpx', true, A, '178 g'), ['mobile', 'budget']),
  phone('google-pixel-7-128go', 'Google', 'Google Pixel 7 128 Go', 'Pixel 7', 2022, 649,
    ps('6,3 pouces OLED', '2400 x 1080', '90 Hz', 'Google Tensor G2', '8 Go', '128 Go', '4 355 mAh', null, '50 Mpx', true, A, '197 g')),
  phone('google-pixel-7-pro-128go', 'Google', 'Google Pixel 7 Pro 128 Go', 'Pixel 7', 2022, 899,
    ps('6,7 pouces OLED', '3120 x 1440', '120 Hz', 'Google Tensor G2', '12 Go', '128 Go', '5 000 mAh', null, '50 Mpx', true, A, '212 g'), ['mobile', 'photo']),
  phone('google-pixel-7a-128go', 'Google', 'Google Pixel 7a 128 Go', 'Pixel 7', 2023, 509,
    ps('6,1 pouces OLED', '2400 x 1080', '90 Hz', 'Google Tensor G2', '8 Go', '128 Go', '4 385 mAh', null, '64 Mpx', true, A, '193 g'), ['mobile', 'budget']),
  phone('google-pixel-fold-256go', 'Google', 'Google Pixel Fold 256 Go', 'Pixel Fold', 2023, null,
    ps('7,6 pouces OLED pliable', '2208 x 1840', '120 Hz', 'Google Tensor G2', '12 Go', '256 Go', '4 821 mAh', null, '48 Mpx', true, A, '283 g'), ['mobile', 'pro']),
  phone('google-pixel-8-128go', 'Google', 'Google Pixel 8 128 Go', 'Pixel 8', 2023, 799,
    ps('6,2 pouces OLED', '2400 x 1080', '120 Hz', 'Google Tensor G3', '8 Go', '128 Go', '4 575 mAh', null, '50 Mpx', true, A, '187 g')),
  phone('google-pixel-8-pro-128go', 'Google', 'Google Pixel 8 Pro 128 Go', 'Pixel 8', 2023, 1099,
    ps('6,7 pouces OLED', '2992 x 1344', '120 Hz', 'Google Tensor G3', '12 Go', '128 Go', '5 050 mAh', null, '50 Mpx', true, A, '213 g'), ['mobile', 'photo']),
  phone('google-pixel-8a-128go', 'Google', 'Google Pixel 8a 128 Go', 'Pixel 8', 2024, 549,
    ps('6,1 pouces OLED', '2400 x 1080', '120 Hz', 'Google Tensor G3', '8 Go', '128 Go', '4 492 mAh', null, '64 Mpx', true, A, '188 g')),
  phone('google-pixel-9-128go', 'Google', 'Google Pixel 9 128 Go', 'Pixel 9', 2024, 899,
    ps('6,3 pouces OLED', '2424 x 1080', '120 Hz', 'Google Tensor G4', '12 Go', '128 Go', '4 700 mAh', null, '50 Mpx', true, A, '198 g')),
  phone('google-pixel-9-pro-128go', 'Google', 'Google Pixel 9 Pro 128 Go', 'Pixel 9', 2024, 1099,
    ps('6,3 pouces OLED', '2856 x 1280', '120 Hz', 'Google Tensor G4', '16 Go', '128 Go', '4 700 mAh', null, '50 Mpx', true, A, '199 g'), ['mobile', 'photo']),
  phone('google-pixel-9-pro-xl-128go', 'Google', 'Google Pixel 9 Pro XL 128 Go', 'Pixel 9', 2024, 1199,
    ps('6,8 pouces OLED', '2992 x 1344', '120 Hz', 'Google Tensor G4', '16 Go', '128 Go', '5 060 mAh', null, '50 Mpx', true, A, '221 g'), ['mobile', 'photo']),
  phone('google-pixel-9-pro-fold-256go', 'Google', 'Google Pixel 9 Pro Fold 256 Go', 'Pixel 9', 2024, 1899,
    ps('8 pouces OLED pliable', '2152 x 2076', '120 Hz', 'Google Tensor G4', '16 Go', '256 Go', '4 650 mAh', null, '48 Mpx', true, A, '257 g'), ['mobile', 'pro']),
  phone('google-pixel-9a-128go', 'Google', 'Google Pixel 9a 128 Go', 'Pixel 9', 2025, 549,
    ps('6,3 pouces OLED', '2424 x 1080', '120 Hz', 'Google Tensor G4', '8 Go', '128 Go', '5 100 mAh', null, '48 Mpx', true, A, '186 g')),
  phone('google-pixel-10-128go', 'Google', 'Google Pixel 10 128 Go', 'Pixel 10', 2025, 899,
    ps('6,3 pouces OLED', null, '120 Hz', 'Google Tensor G5', '12 Go', '128 Go', null, null, '48 Mpx', true, A, null)),
  phone('google-pixel-10-pro-128go', 'Google', 'Google Pixel 10 Pro 128 Go', 'Pixel 10', 2025, 1099,
    ps('6,3 pouces OLED', null, '120 Hz', 'Google Tensor G5', '16 Go', '128 Go', null, null, '50 Mpx', true, A, null), ['mobile', 'photo']),
  phone('google-pixel-10-pro-xl-256go', 'Google', 'Google Pixel 10 Pro XL 256 Go', 'Pixel 10', 2025, null,
    ps('6,8 pouces OLED', null, '120 Hz', 'Google Tensor G5', '16 Go', '256 Go', null, null, '50 Mpx', true, A, null), ['mobile', 'photo']),
  phone('google-pixel-10-pro-fold-256go', 'Google', 'Google Pixel 10 Pro Fold 256 Go', 'Pixel 10', 2025, null,
    ps('8 pouces OLED pliable', null, '120 Hz', 'Google Tensor G5', '16 Go', '256 Go', null, null, null, true, A, null), ['mobile', 'pro']),

  // ───────────────────────────── Xiaomi ─────────────────────────────
  phone('xiaomi-13-256go', 'Xiaomi', 'Xiaomi 13 256 Go', 'Xiaomi 13', 2023, 999,
    ps('6,36 pouces AMOLED', '2400 x 1080', '120 Hz', 'Qualcomm Snapdragon 8 Gen 2', '8 Go', '256 Go', '4 500 mAh', '67 W', '50 Mpx', true, A, '185 g')),
  phone('xiaomi-13-pro-256go', 'Xiaomi', 'Xiaomi 13 Pro 256 Go', 'Xiaomi 13', 2023, 1299,
    ps('6,73 pouces AMOLED', '3200 x 1440', '120 Hz', 'Qualcomm Snapdragon 8 Gen 2', '12 Go', '256 Go', '4 820 mAh', '120 W', '50 Mpx', true, A, '229 g'), ['mobile', 'photo']),
  phone('xiaomi-13t-256go', 'Xiaomi', 'Xiaomi 13T 256 Go', 'Xiaomi 13', 2023, 649,
    ps('6,67 pouces AMOLED', '2712 x 1220', '144 Hz', 'MediaTek Dimensity 8200-Ultra', '8 Go', '256 Go', '5 000 mAh', '67 W', '50 Mpx', true, A, '197 g')),
  phone('xiaomi-13t-pro-512go', 'Xiaomi', 'Xiaomi 13T Pro 512 Go', 'Xiaomi 13', 2023, 799,
    ps('6,67 pouces AMOLED', '2712 x 1220', '144 Hz', 'MediaTek Dimensity 9200+', '12 Go', '512 Go', '5 000 mAh', '120 W', '50 Mpx', true, A, '200 g'), ['mobile', 'gaming']),
  phone('xiaomi-14-512go', 'Xiaomi', 'Xiaomi 14 512 Go', 'Xiaomi 14', 2024, 999,
    ps('6,36 pouces AMOLED', '2670 x 1200', '120 Hz', 'Qualcomm Snapdragon 8 Gen 3', '12 Go', '512 Go', '4 610 mAh', '90 W', '50 Mpx', true, A, '193 g'), ['mobile', 'photo']),
  phone('xiaomi-14-ultra-512go', 'Xiaomi', 'Xiaomi 14 Ultra 512 Go', 'Xiaomi 14', 2024, 1499,
    ps('6,73 pouces AMOLED', '3200 x 1440', '120 Hz', 'Qualcomm Snapdragon 8 Gen 3', '16 Go', '512 Go', '5 000 mAh', '90 W', '50 Mpx', true, A, '219 g'), ['mobile', 'photo', 'pro']),
  phone('xiaomi-14t-256go', 'Xiaomi', 'Xiaomi 14T 256 Go', 'Xiaomi 14', 2024, 649,
    ps('6,67 pouces AMOLED', '2712 x 1220', '144 Hz', 'MediaTek Dimensity 8300-Ultra', '12 Go', '256 Go', '5 000 mAh', '67 W', '50 Mpx', true, A, '195 g')),
  phone('xiaomi-14t-pro-512go', 'Xiaomi', 'Xiaomi 14T Pro 512 Go', 'Xiaomi 14', 2024, null,
    ps('6,67 pouces AMOLED', '2712 x 1220', '144 Hz', 'MediaTek Dimensity 9300+', '12 Go', '512 Go', '5 000 mAh', '120 W', '50 Mpx', true, A, '209 g'), ['mobile', 'gaming']),
  phone('xiaomi-15-512go', 'Xiaomi', 'Xiaomi 15 512 Go', 'Xiaomi 15', 2025, null,
    ps('6,36 pouces AMOLED', '2670 x 1200', '120 Hz', 'Qualcomm Snapdragon 8 Elite', '12 Go', '512 Go', '5 240 mAh', '90 W', '50 Mpx', true, A, '191 g'), ['mobile', 'photo']),
  phone('xiaomi-15-ultra-512go', 'Xiaomi', 'Xiaomi 15 Ultra 512 Go', 'Xiaomi 15', 2025, 1499,
    ps('6,73 pouces AMOLED', '3200 x 1440', '120 Hz', 'Qualcomm Snapdragon 8 Elite', '16 Go', '512 Go', '5 410 mAh', '90 W', '50 Mpx', true, A, null), ['mobile', 'photo', 'pro']),

  // ───────────────────────────── Xiaomi Redmi Note ─────────────────────────────
  phone('xiaomi-redmi-note-12-128go', 'Xiaomi', 'Xiaomi Redmi Note 12 128 Go', 'Redmi Note 12', 2023, null,
    ps('6,67 pouces AMOLED', '2400 x 1080', '120 Hz', 'Qualcomm Snapdragon 685', '4 Go', '128 Go', '5 000 mAh', '33 W', '50 Mpx', false, A, '183 g'), ['mobile', 'budget']),
  phone('xiaomi-redmi-note-12-pro-5g-128go', 'Xiaomi', 'Xiaomi Redmi Note 12 Pro 5G 128 Go', 'Redmi Note 12', 2023, null,
    ps('6,67 pouces OLED', '2400 x 1080', '120 Hz', 'MediaTek Dimensity 1080', '6 Go', '128 Go', '5 000 mAh', '67 W', '50 Mpx', true, A, '187 g'), ['mobile', 'budget']),
  phone('xiaomi-redmi-note-12-pro-plus-5g-256go', 'Xiaomi', 'Xiaomi Redmi Note 12 Pro+ 5G 256 Go', 'Redmi Note 12', 2023, null,
    ps('6,67 pouces OLED', '2400 x 1080', '120 Hz', 'MediaTek Dimensity 1080', '8 Go', '256 Go', '5 000 mAh', '120 W', '200 Mpx', true, A, '208 g'), ['mobile', 'budget']),
  phone('xiaomi-redmi-note-13-128go', 'Xiaomi', 'Xiaomi Redmi Note 13 128 Go', 'Redmi Note 13', 2024, null,
    ps('6,67 pouces AMOLED', '2400 x 1080', '120 Hz', 'Qualcomm Snapdragon 685', null, '128 Go', '5 000 mAh', '33 W', '108 Mpx', false, A, '188 g'), ['mobile', 'budget']),
  phone('xiaomi-redmi-note-13-pro-5g-256go', 'Xiaomi', 'Xiaomi Redmi Note 13 Pro 5G 256 Go', 'Redmi Note 13', 2024, null,
    ps('6,67 pouces AMOLED', '2712 x 1220', '120 Hz', 'Qualcomm Snapdragon 7s Gen 2', '8 Go', '256 Go', '5 100 mAh', '67 W', '200 Mpx', true, A, '187 g'), ['mobile', 'budget']),
  phone('xiaomi-redmi-note-13-pro-plus-5g-256go', 'Xiaomi', 'Xiaomi Redmi Note 13 Pro+ 5G 256 Go', 'Redmi Note 13', 2024, null,
    ps('6,67 pouces AMOLED', '2712 x 1220', '120 Hz', 'MediaTek Dimensity 7200-Ultra', '8 Go', '256 Go', '5 000 mAh', '120 W', '200 Mpx', true, A, '204 g'), ['mobile', 'budget']),
  phone('xiaomi-redmi-note-14-128go', 'Xiaomi', 'Xiaomi Redmi Note 14 128 Go', 'Redmi Note 14', 2025, null,
    ps('6,67 pouces AMOLED', '2400 x 1080', '120 Hz', 'MediaTek Helio G99-Ultra', null, '128 Go', '5 500 mAh', '33 W', '108 Mpx', false, A, '196 g'), ['mobile', 'budget']),
  phone('xiaomi-redmi-note-14-pro-5g-256go', 'Xiaomi', 'Xiaomi Redmi Note 14 Pro 5G 256 Go', 'Redmi Note 14', 2025, null,
    ps('6,67 pouces AMOLED', '2712 x 1220', '120 Hz', 'MediaTek Dimensity 7300-Ultra', '8 Go', '256 Go', '5 110 mAh', '45 W', '200 Mpx', true, A, '190 g'), ['mobile', 'budget']),
  phone('xiaomi-redmi-note-14-pro-plus-5g-256go', 'Xiaomi', 'Xiaomi Redmi Note 14 Pro+ 5G 256 Go', 'Redmi Note 14', 2025, null,
    ps('6,67 pouces AMOLED', '2712 x 1220', '120 Hz', 'Qualcomm Snapdragon 7s Gen 3', '8 Go', '256 Go', '5 110 mAh', '120 W', '50 Mpx', true, A, '205 g'), ['mobile', 'budget']),

  // ───────────────────────────── Poco ─────────────────────────────
  phone('xiaomi-poco-f5-256go', 'Poco', 'Poco F5 256 Go', 'Poco F', 2023, null,
    ps('6,67 pouces AMOLED', '2400 x 1080', '120 Hz', 'Qualcomm Snapdragon 7+ Gen 2', '8 Go', '256 Go', '5 000 mAh', '67 W', '64 Mpx', true, A, '181 g'), ['mobile', 'gaming']),
  phone('xiaomi-poco-f5-pro-256go', 'Poco', 'Poco F5 Pro 256 Go', 'Poco F', 2023, null,
    ps('6,67 pouces AMOLED', '3200 x 1440', '120 Hz', 'Qualcomm Snapdragon 8+ Gen 1', null, '256 Go', '5 160 mAh', '67 W', '64 Mpx', true, A, '204 g'), ['mobile', 'gaming']),
  phone('xiaomi-poco-f6-256go', 'Poco', 'Poco F6 256 Go', 'Poco F', 2024, null,
    ps('6,67 pouces AMOLED', '2712 x 1220', '120 Hz', 'Qualcomm Snapdragon 8s Gen 3', '8 Go', '256 Go', '5 000 mAh', '90 W', '50 Mpx', true, A, '179 g'), ['mobile', 'gaming']),
  phone('xiaomi-poco-f6-pro-256go', 'Poco', 'Poco F6 Pro 256 Go', 'Poco F', 2024, null,
    ps('6,67 pouces AMOLED', '3200 x 1440', '120 Hz', 'Qualcomm Snapdragon 8 Gen 2', '12 Go', '256 Go', '5 000 mAh', '120 W', '50 Mpx', true, A, '209 g'), ['mobile', 'gaming']),
  phone('xiaomi-poco-f7-pro-256go', 'Poco', 'Poco F7 Pro 256 Go', 'Poco F', 2025, null,
    ps('6,67 pouces AMOLED', '3200 x 1440', '120 Hz', 'Qualcomm Snapdragon 8 Gen 3', '12 Go', '256 Go', '6 000 mAh', '90 W', '50 Mpx', true, A, '206 g'), ['mobile', 'gaming']),
  phone('xiaomi-poco-f7-ultra-256go', 'Poco', 'Poco F7 Ultra 256 Go', 'Poco F', 2025, null,
    ps('6,67 pouces AMOLED', '3200 x 1440', '120 Hz', 'Qualcomm Snapdragon 8 Elite', '12 Go', '256 Go', '5 300 mAh', '120 W', '50 Mpx', true, A, '212 g'), ['mobile', 'gaming']),
  phone('xiaomi-poco-x6-5g-256go', 'Poco', 'Poco X6 5G 256 Go', 'Poco X', 2024, null,
    ps('6,67 pouces AMOLED', '2712 x 1220', '120 Hz', 'Qualcomm Snapdragon 7s Gen 2', null, '256 Go', '5 100 mAh', '67 W', '64 Mpx', true, A, '181 g'), ['mobile', 'budget']),
  phone('xiaomi-poco-x6-pro-256go', 'Poco', 'Poco X6 Pro 256 Go', 'Poco X', 2024, null,
    ps('6,67 pouces AMOLED', '2712 x 1220', '120 Hz', 'MediaTek Dimensity 8300-Ultra', '8 Go', '256 Go', '5 000 mAh', '67 W', '64 Mpx', true, A, '186 g'), ['mobile', 'gaming', 'budget']),

  // ───────────────────────────── OnePlus ─────────────────────────────
  phone('oneplus-11-128go', 'OnePlus', 'OnePlus 11 128 Go', 'OnePlus 11', 2023, 849,
    ps('6,7 pouces AMOLED', '3216 x 1440', '120 Hz', 'Qualcomm Snapdragon 8 Gen 2', '8 Go', '128 Go', '5 000 mAh', '80 W', '50 Mpx', true, A, '205 g')),
  phone('oneplus-12-256go', 'OnePlus', 'OnePlus 12 256 Go', 'OnePlus 12', 2024, 969,
    ps('6,82 pouces AMOLED', '3168 x 1440', '120 Hz', 'Qualcomm Snapdragon 8 Gen 3', '12 Go', '256 Go', '5 400 mAh', '80 W', '50 Mpx', true, A, '220 g'), ['mobile', 'gaming']),
  phone('oneplus-12r-128go', 'OnePlus', 'OnePlus 12R 128 Go', 'OnePlus 12', 2024, 699,
    ps('6,78 pouces AMOLED', '2780 x 1264', '120 Hz', 'Qualcomm Snapdragon 8 Gen 2', '8 Go', '128 Go', '5 500 mAh', '80 W', '50 Mpx', true, A, '207 g'), ['mobile', 'gaming']),
  phone('oneplus-13-256go', 'OnePlus', 'OnePlus 13 256 Go', 'OnePlus 13', 2025, 1149,
    ps('6,82 pouces AMOLED', '3168 x 1440', '120 Hz', 'Qualcomm Snapdragon 8 Elite', '12 Go', '256 Go', '6 000 mAh', '80 W', '50 Mpx', true, A, '213 g'), ['mobile', 'gaming', 'photo']),
  phone('oneplus-13r-256go', 'OnePlus', 'OnePlus 13R 256 Go', 'OnePlus 13', 2025, 699,
    ps('6,78 pouces AMOLED', '2780 x 1264', '120 Hz', 'Qualcomm Snapdragon 8 Gen 3', '12 Go', '256 Go', '6 000 mAh', '80 W', '50 Mpx', true, A, '206 g'), ['mobile', 'gaming']),
  phone('oneplus-nord-3-5g-128go', 'OnePlus', 'OnePlus Nord 3 5G 128 Go', 'OnePlus Nord', 2023, 449,
    ps('6,74 pouces AMOLED', '2772 x 1240', '120 Hz', 'MediaTek Dimensity 9000', '8 Go', '128 Go', '5 000 mAh', '80 W', '50 Mpx', true, A, '193 g'), ['mobile', 'budget']),
  phone('oneplus-nord-4-256go', 'OnePlus', 'OnePlus Nord 4 256 Go', 'OnePlus Nord', 2024, null,
    ps('6,74 pouces AMOLED', '2772 x 1240', '120 Hz', 'Qualcomm Snapdragon 7+ Gen 3', null, '256 Go', '5 500 mAh', '100 W', '50 Mpx', true, A, '199 g'), ['mobile', 'budget']),
  phone('oneplus-nord-ce4-128go', 'OnePlus', 'OnePlus Nord CE4 128 Go', 'OnePlus Nord', 2024, null,
    ps('6,7 pouces AMOLED', null, '120 Hz', 'Qualcomm Snapdragon 7 Gen 3', '8 Go', '128 Go', '5 500 mAh', '100 W', '50 Mpx', true, A, '186 g'), ['mobile', 'budget']),

  // ───────────────────────────── Nothing / CMF ─────────────────────────────
  phone('nothing-phone-1-128go', 'Nothing', 'Nothing Phone (1) 128 Go', 'Nothing Phone', 2022, 469,
    ps('6,55 pouces OLED', '2400 x 1080', '120 Hz', 'Qualcomm Snapdragon 778G+', '8 Go', '128 Go', '4 500 mAh', '33 W', '50 Mpx', true, A, '193,5 g')),
  phone('nothing-phone-2-128go', 'Nothing', 'Nothing Phone (2) 128 Go', 'Nothing Phone', 2023, 679,
    ps('6,7 pouces OLED', '2412 x 1080', '120 Hz', 'Qualcomm Snapdragon 8+ Gen 1', '8 Go', '128 Go', '4 700 mAh', '45 W', '50 Mpx', true, A, '201 g')),
  phone('nothing-phone-2a-128go', 'Nothing', 'Nothing Phone (2a) 128 Go', 'Nothing Phone', 2024, 329,
    ps('6,7 pouces AMOLED', '2412 x 1084', '120 Hz', 'MediaTek Dimensity 7200 Pro', '8 Go', '128 Go', '5 000 mAh', '45 W', '50 Mpx', true, A, '190 g'), ['mobile', 'budget']),
  phone('nothing-phone-3a-128go', 'Nothing', 'Nothing Phone (3a) 128 Go', 'Nothing Phone', 2025, 349,
    ps('6,77 pouces AMOLED', '2392 x 1080', '120 Hz', 'Qualcomm Snapdragon 7s Gen 3', '8 Go', '128 Go', '5 000 mAh', '50 W', '50 Mpx', true, A, '201 g'), ['mobile', 'budget']),
  phone('nothing-phone-3a-pro-256go', 'Nothing', 'Nothing Phone (3a) Pro 256 Go', 'Nothing Phone', 2025, null,
    ps('6,77 pouces AMOLED', '2392 x 1080', '120 Hz', 'Qualcomm Snapdragon 7s Gen 3', null, '256 Go', '5 000 mAh', '50 W', '50 Mpx', true, A, '211 g')),
  phone('nothing-phone-3-256go', 'Nothing', 'Nothing Phone (3) 256 Go', 'Nothing Phone', 2025, 799,
    ps('6,67 pouces AMOLED', '2800 x 1260', '120 Hz', 'Qualcomm Snapdragon 8s Gen 4', '12 Go', '256 Go', '5 150 mAh', '65 W', '50 Mpx', true, A, '218 g')),
  phone('cmf-phone-1-128go', 'CMF by Nothing', 'CMF Phone 1 128 Go', 'CMF Phone', 2024, null,
    ps('6,67 pouces AMOLED', '2400 x 1080', '120 Hz', 'MediaTek Dimensity 7300', null, '128 Go', '5 000 mAh', '33 W', '50 Mpx', true, A, '197 g'), ['mobile', 'budget']),
  phone('cmf-phone-2-pro-128go', 'CMF by Nothing', 'CMF Phone 2 Pro 128 Go', 'CMF Phone', 2025, null,
    ps('6,77 pouces AMOLED', null, '120 Hz', 'MediaTek Dimensity 7300 Pro', null, '128 Go', '5 000 mAh', '33 W', '50 Mpx', true, A, '185 g'), ['mobile', 'budget']),

  // ───────────────────────────── Fairphone ─────────────────────────────
  phone('fairphone-4-128go', 'Fairphone', 'Fairphone 4 128 Go', 'Fairphone', 2021, 579,
    ps('6,3 pouces LCD', '2340 x 1080', '60 Hz', 'Qualcomm Snapdragon 750G', '6 Go', '128 Go', '3 905 mAh', null, '48 Mpx', true, A, '225 g')),
  phone('fairphone-5-256go', 'Fairphone', 'Fairphone 5 256 Go', 'Fairphone', 2023, 699,
    ps('6,46 pouces OLED', '2770 x 1224', '90 Hz', 'Qualcomm QCM6490', '8 Go', '256 Go', '4 200 mAh', null, '50 Mpx', true, A, '212 g')),
  phone('fairphone-gen-6-256go', 'Fairphone', 'Fairphone (Gen. 6) 256 Go', 'Fairphone', 2025, 599,
    ps('6,31 pouces OLED', null, '120 Hz', 'Qualcomm Snapdragon 7s Gen 3', '8 Go', '256 Go', '4 415 mAh', null, '50 Mpx', true, A, '193 g')),

  // ───────────────────────────── Sony Xperia ─────────────────────────────
  phone('sony-xperia-1-v-256go', 'Sony', 'Sony Xperia 1 V 256 Go', 'Xperia 1', 2023, 1399,
    ps('6,5 pouces OLED', '3840 x 1644', '120 Hz', 'Qualcomm Snapdragon 8 Gen 2', '12 Go', '256 Go', '5 000 mAh', null, '48 Mpx', true, A, '187 g'), ['mobile', 'photo', 'pro']),
  phone('sony-xperia-1-vi-256go', 'Sony', 'Sony Xperia 1 VI 256 Go', 'Xperia 1', 2024, 1399,
    ps('6,5 pouces OLED', '2340 x 1080', '120 Hz', 'Qualcomm Snapdragon 8 Gen 3', '12 Go', '256 Go', '5 000 mAh', null, '48 Mpx', true, A, '192 g'), ['mobile', 'photo', 'pro']),
  phone('sony-xperia-1-vii-256go', 'Sony', 'Sony Xperia 1 VII 256 Go', 'Xperia 1', 2025, null,
    ps('6,5 pouces OLED', null, '120 Hz', 'Qualcomm Snapdragon 8 Elite', '12 Go', '256 Go', '5 000 mAh', null, '48 Mpx', true, A, null), ['mobile', 'photo', 'pro']),
  phone('sony-xperia-10-v-128go', 'Sony', 'Sony Xperia 10 V 128 Go', 'Xperia 10', 2023, 449,
    ps('6,1 pouces OLED', '2520 x 1080', '60 Hz', 'Qualcomm Snapdragon 695', '6 Go', '128 Go', '5 000 mAh', null, '48 Mpx', true, A, '159 g')),
  phone('sony-xperia-10-vi-128go', 'Sony', 'Sony Xperia 10 VI 128 Go', 'Xperia 10', 2024, 399,
    ps('6,1 pouces OLED', '2520 x 1080', '60 Hz', 'Qualcomm Snapdragon 6 Gen 1', '8 Go', '128 Go', '5 000 mAh', null, '48 Mpx', true, A, '164 g')),

  // ───────────────────────────── Motorola ─────────────────────────────
  phone('motorola-edge-40-pro-256go', 'Motorola', 'Motorola Edge 40 Pro 256 Go', 'Motorola Edge', 2023, null,
    ps('6,67 pouces pOLED', '2400 x 1080', '165 Hz', 'Qualcomm Snapdragon 8 Gen 2', '12 Go', '256 Go', '4 600 mAh', '125 W', '50 Mpx', true, A, '199 g')),
  phone('motorola-edge-50-pro-256go', 'Motorola', 'Motorola Edge 50 Pro 256 Go', 'Motorola Edge', 2024, null,
    ps('6,7 pouces pOLED', '2712 x 1220', '144 Hz', 'Qualcomm Snapdragon 7 Gen 3', null, '256 Go', '4 500 mAh', '125 W', '50 Mpx', true, A, '186 g')),
  phone('motorola-edge-50-ultra-512go', 'Motorola', 'Motorola Edge 50 Ultra 512 Go', 'Motorola Edge', 2024, null,
    ps('6,7 pouces pOLED', null, '144 Hz', 'Qualcomm Snapdragon 8s Gen 3', '12 Go', '512 Go', '4 500 mAh', '125 W', '50 Mpx', true, A, '197 g'), ['mobile', 'photo']),
  phone('motorola-razr-40-ultra-256go', 'Motorola', 'Motorola Razr 40 Ultra 256 Go', 'Motorola Razr', 2023, 1199,
    ps('6,9 pouces pOLED pliable', '2640 x 1080', '165 Hz', 'Qualcomm Snapdragon 8+ Gen 1', '8 Go', '256 Go', '3 800 mAh', '30 W', '12 Mpx', true, A, '188,5 g')),
  phone('motorola-razr-50-256go', 'Motorola', 'Motorola Razr 50 256 Go', 'Motorola Razr', 2024, null,
    ps('6,9 pouces pOLED pliable', null, '120 Hz', 'MediaTek Dimensity 7300X', '8 Go', '256 Go', '4 200 mAh', '30 W', '50 Mpx', true, A, '188 g')),
  phone('motorola-razr-50-ultra-512go', 'Motorola', 'Motorola Razr 50 Ultra 512 Go', 'Motorola Razr', 2024, 1199,
    ps('6,9 pouces pOLED pliable', null, '165 Hz', 'Qualcomm Snapdragon 8s Gen 3', '12 Go', '512 Go', '4 000 mAh', '45 W', '50 Mpx', true, A, '189 g')),

  // ───────────────────────────── Oppo ─────────────────────────────
  phone('oppo-find-x5-pro-256go', 'Oppo', 'Oppo Find X5 Pro 256 Go', 'Oppo Find X', 2022, 1299,
    ps('6,7 pouces AMOLED', '3216 x 1440', '120 Hz', 'Qualcomm Snapdragon 8 Gen 1', '12 Go', '256 Go', '5 000 mAh', '80 W', '50 Mpx', true, A, '218 g'), ['mobile', 'photo']),
  phone('oppo-find-x8-256go', 'Oppo', 'Oppo Find X8 256 Go', 'Oppo Find X', 2024, null,
    ps('6,59 pouces AMOLED', '2760 x 1256', '120 Hz', 'MediaTek Dimensity 9400', '12 Go', '256 Go', '5 630 mAh', '80 W', '50 Mpx', true, A, '193 g'), ['mobile', 'photo']),
  phone('oppo-find-x8-pro-512go', 'Oppo', 'Oppo Find X8 Pro 512 Go', 'Oppo Find X', 2024, null,
    ps('6,78 pouces AMOLED', '2780 x 1264', '120 Hz', 'MediaTek Dimensity 9400', '16 Go', '512 Go', '5 910 mAh', '80 W', '50 Mpx', true, A, '215 g'), ['mobile', 'photo', 'pro']),
  phone('oppo-reno12-pro-5g-512go', 'Oppo', 'Oppo Reno12 Pro 5G 512 Go', 'Oppo Reno', 2024, null,
    ps('6,7 pouces AMOLED', null, '120 Hz', 'MediaTek Dimensity 7300-Energy', '12 Go', '512 Go', '5 000 mAh', '80 W', '50 Mpx', true, A, '180 g')),

  // ───────────────────────────── Honor ─────────────────────────────
  phone('honor-magic5-pro-512go', 'Honor', 'Honor Magic5 Pro 512 Go', 'Honor Magic', 2023, 1199,
    ps('6,81 pouces OLED', '2848 x 1312', '120 Hz', 'Qualcomm Snapdragon 8 Gen 2', '12 Go', '512 Go', '5 100 mAh', '66 W', '50 Mpx', true, A, '219 g'), ['mobile', 'photo']),
  phone('honor-magic6-pro-512go', 'Honor', 'Honor Magic6 Pro 512 Go', 'Honor Magic', 2024, 1299,
    ps('6,8 pouces OLED', '2800 x 1280', '120 Hz', 'Qualcomm Snapdragon 8 Gen 3', '12 Go', '512 Go', '5 600 mAh', '80 W', '50 Mpx', true, A, '225 g'), ['mobile', 'photo']),
  phone('honor-magic7-pro-512go', 'Honor', 'Honor Magic7 Pro 512 Go', 'Honor Magic', 2025, 1299,
    ps('6,8 pouces OLED', null, '120 Hz', 'Qualcomm Snapdragon 8 Elite', '12 Go', '512 Go', null, '100 W', '50 Mpx', true, A, '223 g'), ['mobile', 'photo']),
  phone('honor-magic-v3-512go', 'Honor', 'Honor Magic V3 512 Go', 'Honor Magic', 2024, 1999,
    ps('7,92 pouces OLED pliable', null, '120 Hz', 'Qualcomm Snapdragon 8 Gen 3', '12 Go', '512 Go', '5 150 mAh', '66 W', '50 Mpx', true, A, '226 g'), ['mobile', 'pro']),

  // ───────────────────────────── Crosscall (durcis) ─────────────────────────────
  phone('crosscall-core-z5-128go', 'Crosscall', 'Crosscall Core-Z5 128 Go', 'Crosscall Core', 2023, null,
    ps(null, null, null, 'Qualcomm QCM6490', null, '128 Go', null, null, null, true, A, null), ['mobile', 'robuste', 'pro']),
  phone('crosscall-stellar-x5-128go', 'Crosscall', 'Crosscall Stellar-X5 128 Go', 'Crosscall Stellar', 2023, null,
    ps(null, null, null, null, null, '128 Go', null, null, null, true, A, null), ['mobile', 'robuste']),
  phone('crosscall-core-x5-64go', 'Crosscall', 'Crosscall Core-X5 64 Go', 'Crosscall Core', 2022, null,
    ps(null, null, null, 'Qualcomm QCM6490', null, '64 Go', null, null, null, true, A, null), ['mobile', 'robuste', 'pro']),

  // ═════════════════════════════ Montres connectées ═════════════════════════════
  // Apple Watch
  watch('apple-watch-se-2-40mm-gps', 'Apple', 'Apple Watch SE (2e génération) 40 mm GPS', 'Apple Watch SE', 2022, 299,
    ws('40 mm OLED Retina', "Jusqu'à 18 h", 'Oui', '50 m', I, 'Cardio optique, détection des chutes et des accidents')),
  watch('apple-watch-se-3-40mm-gps', 'Apple', 'Apple Watch SE 3 40 mm GPS', 'Apple Watch SE', 2025, null,
    ws('40 mm OLED Retina toujours activé', null, 'Oui', '50 m', I, 'Cardio optique, température')),
  watch('apple-watch-series-8-41mm-gps', 'Apple', 'Apple Watch Series 8 41 mm GPS', 'Apple Watch Series', 2022, 499,
    ws('41 mm OLED Retina LTPO toujours activé', "Jusqu'à 18 h", 'Oui', '50 m', I, 'Cardio optique, ECG, oxymètre (SpO2), température')),
  watch('apple-watch-series-9-41mm-gps', 'Apple', 'Apple Watch Series 9 41 mm GPS', 'Apple Watch Series', 2023, 449,
    ws('41 mm OLED Retina LTPO toujours activé', "Jusqu'à 18 h", 'Oui', '50 m', I, 'Cardio optique, ECG, oxymètre (SpO2), température')),
  watch('apple-watch-series-10-42mm-gps', 'Apple', 'Apple Watch Series 10 42 mm GPS', 'Apple Watch Series', 2024, 449,
    ws('42 mm OLED Retina LTPO3 toujours activé', "Jusqu'à 18 h", 'Oui', '50 m', I, 'Cardio optique, ECG, température, profondeur')),
  watch('apple-watch-series-11-42mm-gps', 'Apple', 'Apple Watch Series 11 42 mm GPS', 'Apple Watch Series', 2025, 449,
    ws('42 mm OLED Retina LTPO3 toujours activé', "Jusqu'à 24 h", 'Oui', '50 m', I, 'Cardio optique, ECG, température')),
  watch('apple-watch-ultra-49mm', 'Apple', 'Apple Watch Ultra 49 mm', 'Apple Watch Ultra', 2022, 999,
    ws('49 mm OLED Retina LTPO toujours activé', "Jusqu'à 36 h", 'Oui (bifréquence L1/L5)', '100 m', I, 'Cardio optique, ECG, oxymètre (SpO2), température, profondimètre'), ['mobile', 'sport', 'robuste']),
  watch('apple-watch-ultra-2-49mm', 'Apple', 'Apple Watch Ultra 2 49 mm', 'Apple Watch Ultra', 2023, 899,
    ws('49 mm OLED Retina LTPO toujours activé', "Jusqu'à 36 h", 'Oui (bifréquence L1/L5)', '100 m', I, 'Cardio optique, ECG, oxymètre (SpO2), température, profondimètre'), ['mobile', 'sport', 'robuste']),
  watch('apple-watch-ultra-3-49mm', 'Apple', 'Apple Watch Ultra 3 49 mm', 'Apple Watch Ultra', 2025, 899,
    ws('49 mm OLED Retina LTPO3 toujours activé', "Jusqu'à 42 h", 'Oui (bifréquence L1/L5)', '100 m', I, 'Cardio optique, ECG, température, profondimètre'), ['mobile', 'sport', 'robuste']),

  // Samsung Galaxy Watch
  watch('samsung-galaxy-watch5-40mm', 'Samsung', 'Samsung Galaxy Watch5 40 mm Bluetooth', 'Galaxy Watch', 2022, 299,
    ws('1,2 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', A, 'BioActive (cardio, ECG, bio-impédance), température')),
  watch('samsung-galaxy-watch5-pro-45mm', 'Samsung', 'Samsung Galaxy Watch5 Pro 45 mm Bluetooth', 'Galaxy Watch', 2022, 499,
    ws('1,4 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', A, 'BioActive (cardio, ECG, bio-impédance), température'), ['mobile', 'sport', 'robuste']),
  watch('samsung-galaxy-watch6-40mm', 'Samsung', 'Samsung Galaxy Watch6 40 mm Bluetooth', 'Galaxy Watch', 2023, 319,
    ws('1,3 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', A, 'BioActive (cardio, ECG, bio-impédance), température')),
  watch('samsung-galaxy-watch6-classic-43mm', 'Samsung', 'Samsung Galaxy Watch6 Classic 43 mm Bluetooth', 'Galaxy Watch', 2023, 419,
    ws('1,3 pouce Super AMOLED', null, 'Oui', '5 ATM, IP68', A, 'BioActive (cardio, ECG, bio-impédance), température')),
  watch('samsung-galaxy-watch7-40mm', 'Samsung', 'Samsung Galaxy Watch7 40 mm Bluetooth', 'Galaxy Watch', 2024, 319,
    ws('1,3 pouce Super AMOLED', null, 'Oui (bifréquence)', '5 ATM, IP68', A, 'BioActive (cardio, ECG, bio-impédance), température')),
  watch('samsung-galaxy-watch-ultra-47mm', 'Samsung', 'Samsung Galaxy Watch Ultra 47 mm LTE', 'Galaxy Watch', 2024, 699,
    ws('1,5 pouce Super AMOLED', "Jusqu'à 100 h", 'Oui (bifréquence)', '10 ATM, IP68', A, 'BioActive (cardio, ECG, bio-impédance), température'), ['mobile', 'sport', 'robuste']),
  watch('samsung-galaxy-watch8-40mm', 'Samsung', 'Samsung Galaxy Watch8 40 mm Bluetooth', 'Galaxy Watch', 2025, null,
    ws(null, null, 'Oui (bifréquence)', '5 ATM, IP68', A, 'BioActive (cardio, ECG, bio-impédance), température')),
  watch('samsung-galaxy-watch8-classic-46mm', 'Samsung', 'Samsung Galaxy Watch8 Classic 46 mm Bluetooth', 'Galaxy Watch', 2025, null,
    ws(null, null, 'Oui (bifréquence)', '5 ATM, IP68', A, 'BioActive (cardio, ECG, bio-impédance), température')),

  // Google Pixel Watch
  watch('google-pixel-watch-2-41mm', 'Google', 'Google Pixel Watch 2 41 mm Wi-Fi', 'Pixel Watch', 2023, 399,
    ws('41 mm AMOLED', "Jusqu'à 24 h", 'Oui', '5 ATM', A, 'Cardio multi-trajets, ECG, oxymètre (SpO2), température cutanée')),
  watch('google-pixel-watch-3-41mm', 'Google', 'Google Pixel Watch 3 41 mm Wi-Fi', 'Pixel Watch', 2024, 399,
    ws('41 mm AMOLED', "Jusqu'à 24 h", 'Oui', '5 ATM', A, 'Cardio multi-trajets, ECG, oxymètre (SpO2), température cutanée')),
  watch('google-pixel-watch-3-45mm', 'Google', 'Google Pixel Watch 3 45 mm Wi-Fi', 'Pixel Watch', 2024, 449,
    ws('45 mm AMOLED', "Jusqu'à 24 h", 'Oui', '5 ATM', A, 'Cardio multi-trajets, ECG, oxymètre (SpO2), température cutanée')),
  watch('google-pixel-watch-4-41mm', 'Google', 'Google Pixel Watch 4 41 mm Wi-Fi', 'Pixel Watch', 2025, null,
    ws('41 mm AMOLED', "Jusqu'à 30 h", 'Oui (bifréquence)', '5 ATM', A, 'Cardio multi-trajets, ECG, oxymètre (SpO2), température cutanée')),

  // Garmin
  watch('garmin-forerunner-165', 'Garmin', 'Garmin Forerunner 165', 'Forerunner', 2024, 280,
    ws('1,2 pouce AMOLED', "Jusqu'à 11 jours", 'Oui', '5 ATM', 'Android, iOS', 'Cardio optique Elevate, oxymètre (SpO2), baromètre')),
  watch('garmin-forerunner-265', 'Garmin', 'Garmin Forerunner 265', 'Forerunner', 2023, 450,
    ws('1,3 pouce AMOLED', "Jusqu'à 13 jours", 'Oui (multi-bandes)', '5 ATM', 'Android, iOS', 'Cardio optique Elevate, oxymètre (SpO2), baromètre')),
  watch('garmin-forerunner-965', 'Garmin', 'Garmin Forerunner 965', 'Forerunner', 2023, 650,
    ws('1,4 pouce AMOLED', "Jusqu'à 23 jours", 'Oui (multi-bandes)', '5 ATM', 'Android, iOS', 'Cardio optique Elevate, oxymètre (SpO2), baromètre, boussole')),
  watch('garmin-fenix-7-47mm', 'Garmin', 'Garmin Fenix 7 47 mm', 'Fenix', 2022, 700,
    ws('1,3 pouce MIP transflectif', "Jusqu'à 18 jours", 'Oui', '10 ATM', 'Android, iOS', 'Cardio optique Elevate, oxymètre (SpO2), altimètre barométrique, boussole'), ['mobile', 'sport', 'robuste']),
  watch('garmin-fenix-8-47mm-amoled', 'Garmin', 'Garmin Fenix 8 47 mm AMOLED', 'Fenix', 2024, 1000,
    ws('1,4 pouce AMOLED', "Jusqu'à 16 jours", 'Oui (multi-bandes)', '10 ATM', 'Android, iOS', 'Cardio optique Elevate, ECG, oxymètre (SpO2), altimètre barométrique, boussole'), ['mobile', 'sport', 'robuste']),
  watch('garmin-venu-3-45mm', 'Garmin', 'Garmin Venu 3 45 mm', 'Venu', 2023, 450,
    ws('1,4 pouce AMOLED', "Jusqu'à 14 jours", 'Oui', '5 ATM', 'Android, iOS', 'Cardio optique Elevate, ECG, oxymètre (SpO2)')),
  watch('garmin-instinct-2-45mm', 'Garmin', 'Garmin Instinct 2 45 mm', 'Instinct', 2022, 350,
    ws('0,9 pouce MIP monochrome', "Jusqu'à 28 jours", 'Oui', '10 ATM', 'Android, iOS', 'Cardio optique, oxymètre (SpO2), altimètre barométrique, boussole'), ['mobile', 'sport', 'robuste']),
  watch('garmin-instinct-3-45mm-amoled', 'Garmin', 'Garmin Instinct 3 AMOLED 45 mm', 'Instinct', 2025, 450,
    ws('1,2 pouce AMOLED', "Jusqu'à 24 jours", 'Oui (multi-bandes)', '10 ATM', 'Android, iOS', 'Cardio optique, oxymètre (SpO2), altimètre barométrique, boussole'), ['mobile', 'sport', 'robuste']),

  // Withings
  watch('withings-scanwatch-2-42mm', 'Withings', 'Withings ScanWatch 2 42 mm', 'ScanWatch', 2023, 349,
    ws('Écran PMOLED + aiguilles analogiques', "Jusqu'à 30 jours", 'Connecté (via smartphone)', '5 ATM', 'Android, iOS', 'Cardio, ECG, oxymètre (SpO2), température'), ['mobile', 'sport']),

  // Huawei
  watch('huawei-watch-gt-4-46mm', 'Huawei', 'Huawei Watch GT 4 46 mm', 'Watch GT', 2023, 249,
    ws('1,43 pouce AMOLED', "Jusqu'à 14 jours", 'Oui', '5 ATM', 'Android, iOS', 'Cardio optique, oxymètre (SpO2), température')),
  watch('huawei-watch-gt-5-46mm', 'Huawei', 'Huawei Watch GT 5 46 mm', 'Watch GT', 2024, 249,
    ws('1,43 pouce AMOLED', "Jusqu'à 14 jours", 'Oui', '5 ATM', 'Android, iOS', 'Cardio optique, oxymètre (SpO2), température')),
];
