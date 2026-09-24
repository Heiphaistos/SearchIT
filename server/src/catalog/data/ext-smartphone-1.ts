import type { CatalogProduct } from '../types.js';

type Opt = string | null;
type Specs = Record<string, string | number>;

/** Caractéristiques communes d'un modèle (hors stockage), dans l'ordre de SPEC_KEYS smartphone ; null = inconnu. */
function s(
  ecran: Opt, def: Opt, hz: Opt, soc: Opt, ram: Opt, batterie: Opt, charge: Opt,
  photo: Opt, g5: boolean | null, sys: Opt, poids: Opt,
): Specs {
  const out: Specs = {};
  const vals: [string, Opt][] = [
    ['Écran', ecran], ['Définition', def], ['Rafraîchissement', hz], ['Processeur', soc], ['RAM', ram],
    ['Batterie', batterie], ['Charge rapide', charge], ['Appareil photo', photo],
    ['5G', g5 === null ? null : g5 ? 'Oui' : 'Non'], ['Système', sys], ['Poids', poids],
  ];
  for (const [k, v] of vals) if (v !== null && v !== '') out[k] = v;
  return out;
}

/** Variante de stockage : [stockage, prix de lancement (null = inconnu), RAM propre à la variante]. */
type V = [string, (number | null)?, string?];

const ORDER = ['Écran', 'Définition', 'Rafraîchissement', 'Processeur', 'RAM', 'Stockage', 'Batterie', 'Charge rapide', 'Appareil photo', '5G', 'Système', 'Poids'];

/** Une fiche par variante de stockage d'un même modèle. */
function m(
  slug: string, brand: string, name: string, family: string, year: number,
  specs: Specs, variants: V[], tags: string[] = ['mobile'], refurbishable = true,
): CatalogProduct[] {
  return variants.map(([storage, msrp, ram]) => {
    const merged: Specs = { ...specs };
    if (storage) merged['Stockage'] = storage;
    if (ram) merged['RAM'] = ram;
    const ordered: Specs = {};
    for (const k of ORDER) if (merged[k] !== undefined) ordered[k] = merged[k];
    const suffix = storage ? '-' + storage.toLowerCase().replace(/\s+/g, '') : '';
    const p: CatalogProduct = {
      id: `smartphone-${slug}${suffix}`,
      category: 'smartphone',
      brand,
      name: storage ? `${name} ${storage}` : name,
      family,
      year,
      refurbishable,
      tags,
      specs: ordered,
    };
    if (msrp !== null && msrp !== undefined) p.msrp = msrp;
    return p;
  });
}

const A = 'Android';
const I = 'iOS';

/**
 * Catalogue de référence (extension) : Apple iPhone depuis l'iPhone 8 et Samsung Galaxy S / Note / Fold
 * dans leurs différentes capacités de stockage. Clé omise quand la valeur n'est pas certaine.
 */
export const PRODUCTS: CatalogProduct[] = [
  // ───────────────────────────── Apple iPhone 8 / X ─────────────────────────────
  ...m('apple-iphone-8', 'Apple', 'Apple iPhone 8', 'iPhone 8', 2017,
    s('4,7 pouces LCD', '1334 x 750', '60 Hz', 'Apple A11 Bionic', '2 Go', '1 821 mAh', null, '12 Mpx', false, I, '148 g'),
    [['64 Go', 809], ['256 Go', 979]], ['mobile', 'budget']),
  ...m('apple-iphone-8-plus', 'Apple', 'Apple iPhone 8 Plus', 'iPhone 8', 2017,
    s('5,5 pouces LCD', '1920 x 1080', '60 Hz', 'Apple A11 Bionic', '3 Go', '2 691 mAh', null, '12 Mpx', false, I, '202 g'),
    [['64 Go', 919], ['256 Go', 1089]], ['mobile', 'budget']),
  ...m('apple-iphone-x', 'Apple', 'Apple iPhone X', 'iPhone X', 2017,
    s('5,8 pouces OLED', '2436 x 1125', '60 Hz', 'Apple A11 Bionic', '3 Go', '2 716 mAh', null, '12 Mpx', false, I, '174 g'),
    [['64 Go', 1159], ['256 Go', 1329]]),
  ...m('apple-iphone-xr', 'Apple', 'Apple iPhone XR', 'iPhone XR', 2018,
    s('6,1 pouces LCD', '1792 x 828', '60 Hz', 'Apple A12 Bionic', '3 Go', '2 942 mAh', null, '12 Mpx', false, I, '194 g'),
    [['64 Go', 859], ['128 Go', 919], ['256 Go', 1029]], ['mobile', 'budget']),
  ...m('apple-iphone-xs', 'Apple', 'Apple iPhone XS', 'iPhone XS', 2018,
    s('5,8 pouces OLED', '2436 x 1125', '60 Hz', 'Apple A12 Bionic', '4 Go', '2 658 mAh', null, '12 Mpx', false, I, '177 g'),
    [['64 Go', 1159], ['256 Go', 1329], ['512 Go', 1559]]),
  ...m('apple-iphone-xs-max', 'Apple', 'Apple iPhone XS Max', 'iPhone XS', 2018,
    s('6,5 pouces OLED', '2688 x 1242', '60 Hz', 'Apple A12 Bionic', '4 Go', '3 174 mAh', null, '12 Mpx', false, I, '208 g'),
    [['64 Go', 1259], ['256 Go', 1429], ['512 Go', 1659]]),

  // ───────────────────────────── Apple iPhone 11 / SE 2 ─────────────────────────────
  ...m('apple-iphone-11', 'Apple', 'Apple iPhone 11', 'iPhone 11', 2019,
    s('6,1 pouces LCD', '1792 x 828', '60 Hz', 'Apple A13 Bionic', '4 Go', '3 110 mAh', null, '12 Mpx', false, I, '194 g'),
    [['128 Go', 859], ['256 Go', 979]]),
  ...m('apple-iphone-11-pro', 'Apple', 'Apple iPhone 11 Pro', 'iPhone 11', 2019,
    s('5,8 pouces OLED', '2436 x 1125', '60 Hz', 'Apple A13 Bionic', '4 Go', '3 046 mAh', null, '12 Mpx', false, I, '188 g'),
    [['256 Go', 1329], ['512 Go', 1559]], ['mobile', 'photo']),
  ...m('apple-iphone-11-pro-max', 'Apple', 'Apple iPhone 11 Pro Max', 'iPhone 11', 2019,
    s('6,5 pouces OLED', '2688 x 1242', '60 Hz', 'Apple A13 Bionic', '4 Go', '3 969 mAh', null, '12 Mpx', false, I, '226 g'),
    [['256 Go', 1429], ['512 Go', 1659]], ['mobile', 'photo']),
  ...m('apple-iphone-se-2', 'Apple', 'Apple iPhone SE (2e génération)', 'iPhone SE', 2020,
    s('4,7 pouces LCD', '1334 x 750', '60 Hz', 'Apple A13 Bionic', '3 Go', '1 821 mAh', null, '12 Mpx', false, I, '148 g'),
    [['128 Go', 539], ['256 Go', 659]], ['mobile', 'budget']),

  // ───────────────────────────── Apple iPhone 12 ─────────────────────────────
  ...m('apple-iphone-12-mini', 'Apple', 'Apple iPhone 12 mini', 'iPhone 12', 2020,
    s('5,4 pouces OLED', '2340 x 1080', '60 Hz', 'Apple A14 Bionic', '4 Go', '2 227 mAh', null, '12 Mpx', true, I, '133 g'),
    [['128 Go', 859], ['256 Go', 979]]),
  ...m('apple-iphone-12', 'Apple', 'Apple iPhone 12', 'iPhone 12', 2020,
    s('6,1 pouces OLED', '2532 x 1170', '60 Hz', 'Apple A14 Bionic', '4 Go', '2 815 mAh', null, '12 Mpx', true, I, '164 g'),
    [['128 Go', 959], ['256 Go', 1079]]),
  ...m('apple-iphone-12-pro', 'Apple', 'Apple iPhone 12 Pro', 'iPhone 12', 2020,
    s('6,1 pouces OLED', '2532 x 1170', '60 Hz', 'Apple A14 Bionic', '6 Go', '2 815 mAh', null, '12 Mpx', true, I, '189 g'),
    [['256 Go', 1279], ['512 Go', 1509]], ['mobile', 'photo']),
  ...m('apple-iphone-12-pro-max', 'Apple', 'Apple iPhone 12 Pro Max', 'iPhone 12', 2020,
    s('6,7 pouces OLED', '2778 x 1284', '60 Hz', 'Apple A14 Bionic', '6 Go', '3 687 mAh', null, '12 Mpx', true, I, '228 g'),
    [['256 Go', 1379], ['512 Go', 1609]], ['mobile', 'photo']),

  // ───────────────────────────── Apple iPhone 13 / SE 3 ─────────────────────────────
  ...m('apple-iphone-13-mini', 'Apple', 'Apple iPhone 13 mini', 'iPhone 13', 2021,
    s('5,4 pouces OLED', '2340 x 1080', '60 Hz', 'Apple A15 Bionic', '4 Go', '2 406 mAh', null, '12 Mpx', true, I, '140 g'),
    [['256 Go', 929], ['512 Go', 1159]]),
  ...m('apple-iphone-13', 'Apple', 'Apple iPhone 13', 'iPhone 13', 2021,
    s('6,1 pouces OLED', '2532 x 1170', '60 Hz', 'Apple A15 Bionic', '4 Go', '3 240 mAh', null, '12 Mpx', true, I, '173 g'),
    [['256 Go', 1029], ['512 Go', 1259]]),
  ...m('apple-iphone-13-pro', 'Apple', 'Apple iPhone 13 Pro', 'iPhone 13', 2021,
    s('6,1 pouces OLED', '2532 x 1170', '120 Hz', 'Apple A15 Bionic', '6 Go', '3 095 mAh', null, '12 Mpx', true, I, '203 g'),
    [['256 Go', 1279], ['512 Go', 1509], ['1 To', 1739]], ['mobile', 'photo']),
  ...m('apple-iphone-13-pro-max', 'Apple', 'Apple iPhone 13 Pro Max', 'iPhone 13', 2021,
    s('6,7 pouces OLED', '2778 x 1284', '120 Hz', 'Apple A15 Bionic', '6 Go', '4 352 mAh', null, '12 Mpx', true, I, '238 g'),
    [['256 Go', 1379], ['512 Go', 1609], ['1 To', 1839]], ['mobile', 'photo']),
  ...m('apple-iphone-se-3', 'Apple', 'Apple iPhone SE (3e génération)', 'iPhone SE', 2022,
    s('4,7 pouces LCD', '1334 x 750', '60 Hz', 'Apple A15 Bionic', '4 Go', '2 018 mAh', null, '12 Mpx', true, I, '144 g'),
    [['128 Go', 579], ['256 Go', 699]], ['mobile', 'budget']),

  // ───────────────────────────── Apple iPhone 14 ─────────────────────────────
  ...m('apple-iphone-14', 'Apple', 'Apple iPhone 14', 'iPhone 14', 2022,
    s('6,1 pouces OLED', '2532 x 1170', '60 Hz', 'Apple A15 Bionic', '6 Go', '3 279 mAh', null, '12 Mpx', true, I, '172 g'),
    [['256 Go', 1149], ['512 Go', 1409]]),
  ...m('apple-iphone-14-plus', 'Apple', 'Apple iPhone 14 Plus', 'iPhone 14', 2022,
    s('6,7 pouces OLED', '2778 x 1284', '60 Hz', 'Apple A15 Bionic', '6 Go', '4 325 mAh', null, '12 Mpx', true, I, '203 g'),
    [['256 Go', 1299], ['512 Go', 1559]]),
  ...m('apple-iphone-14-pro', 'Apple', 'Apple iPhone 14 Pro', 'iPhone 14', 2022,
    s('6,1 pouces OLED', '2556 x 1179', '120 Hz', 'Apple A16 Bionic', '6 Go', '3 200 mAh', null, '48 Mpx', true, I, '206 g'),
    [['256 Go', 1459], ['512 Go', 1719], ['1 To', 1979]], ['mobile', 'photo']),
  ...m('apple-iphone-14-pro-max', 'Apple', 'Apple iPhone 14 Pro Max', 'iPhone 14', 2022,
    s('6,7 pouces OLED', '2796 x 1290', '120 Hz', 'Apple A16 Bionic', '6 Go', '4 323 mAh', null, '48 Mpx', true, I, '240 g'),
    [['256 Go', 1609], ['512 Go', 1869], ['1 To', 2129]], ['mobile', 'photo']),

  // ───────────────────────────── Apple iPhone 15 ─────────────────────────────
  ...m('apple-iphone-15', 'Apple', 'Apple iPhone 15', 'iPhone 15', 2023,
    s('6,1 pouces OLED', '2556 x 1179', '60 Hz', 'Apple A16 Bionic', '6 Go', '3 349 mAh', null, '48 Mpx', true, I, '171 g'),
    [['512 Go', 1349]]),
  ...m('apple-iphone-15-plus', 'Apple', 'Apple iPhone 15 Plus', 'iPhone 15', 2023,
    s('6,7 pouces OLED', '2796 x 1290', '60 Hz', 'Apple A16 Bionic', '6 Go', '4 383 mAh', null, '48 Mpx', true, I, '201 g'),
    [['256 Go', 1249], ['512 Go', 1499]]),
  ...m('apple-iphone-15-pro', 'Apple', 'Apple iPhone 15 Pro', 'iPhone 15', 2023,
    s('6,1 pouces OLED', '2556 x 1179', '120 Hz', 'Apple A17 Pro', '8 Go', '3 274 mAh', null, '48 Mpx', true, I, '187 g'),
    [['512 Go', 1479], ['1 To', 1729]], ['mobile', 'photo', 'gaming']),
  ...m('apple-iphone-15-pro-max', 'Apple', 'Apple iPhone 15 Pro Max', 'iPhone 15', 2023,
    s('6,7 pouces OLED', '2796 x 1290', '120 Hz', 'Apple A17 Pro', '8 Go', '4 441 mAh', null, '48 Mpx', true, I, '221 g'),
    [['512 Go', 1729], ['1 To', 1979]], ['mobile', 'photo', 'gaming']),

  // ───────────────────────────── Apple iPhone 16 ─────────────────────────────
  ...m('apple-iphone-16', 'Apple', 'Apple iPhone 16', 'iPhone 16', 2024,
    s('6,1 pouces OLED', '2556 x 1179', '60 Hz', 'Apple A18', '8 Go', '3 561 mAh', null, '48 Mpx', true, I, '170 g'),
    [['512 Go', 1219]]),
  ...m('apple-iphone-16-plus', 'Apple', 'Apple iPhone 16 Plus', 'iPhone 16', 2024,
    s('6,7 pouces OLED', '2796 x 1290', '60 Hz', 'Apple A18', '8 Go', '4 674 mAh', null, '48 Mpx', true, I, '199 g'),
    [['256 Go', 1249], ['512 Go', 1499]]),
  ...m('apple-iphone-16-pro', 'Apple', 'Apple iPhone 16 Pro', 'iPhone 16', 2024,
    s('6,3 pouces OLED', '2622 x 1206', '120 Hz', 'Apple A18 Pro', '8 Go', '3 582 mAh', null, '48 Mpx', true, I, '199 g'),
    [['512 Go', 1479], ['1 To', 1729]], ['mobile', 'photo', 'gaming']),
  ...m('apple-iphone-16-pro-max', 'Apple', 'Apple iPhone 16 Pro Max', 'iPhone 16', 2024,
    s('6,9 pouces OLED', '2868 x 1320', '120 Hz', 'Apple A18 Pro', '8 Go', '4 685 mAh', null, '48 Mpx', true, I, '227 g'),
    [['512 Go', 1729], ['1 To', 1979]], ['mobile', 'photo', 'gaming']),
  ...m('apple-iphone-16e', 'Apple', 'Apple iPhone 16e', 'iPhone 16', 2025,
    s('6,1 pouces OLED', '2532 x 1170', '60 Hz', 'Apple A18', '8 Go', '4 005 mAh', null, '48 Mpx', true, I, '167 g'),
    [['256 Go', 839], ['512 Go', 1079]]),

  // ───────────────────────────── Apple iPhone 17 / Air ─────────────────────────────
  ...m('apple-iphone-17', 'Apple', 'Apple iPhone 17', 'iPhone 17', 2025,
    s('6,3 pouces OLED', '2622 x 1206', '120 Hz', 'Apple A19', '8 Go', null, null, '48 Mpx', true, I, '177 g'),
    [['512 Go', 1219]]),
  ...m('apple-iphone-air', 'Apple', 'Apple iPhone Air', 'iPhone 17', 2025,
    s('6,5 pouces OLED', null, '120 Hz', 'Apple A19 Pro', '12 Go', null, null, '48 Mpx', true, I, '165 g'),
    [['512 Go', 1479], ['1 To', 1729]]),
  ...m('apple-iphone-17-pro', 'Apple', 'Apple iPhone 17 Pro', 'iPhone 17', 2025,
    s('6,3 pouces OLED', '2622 x 1206', '120 Hz', 'Apple A19 Pro', '12 Go', null, null, '48 Mpx', true, I, '204 g'),
    [['512 Go', 1579], ['1 To', 1829]], ['mobile', 'photo', 'gaming']),
  ...m('apple-iphone-17-pro-max', 'Apple', 'Apple iPhone 17 Pro Max', 'iPhone 17', 2025,
    s('6,9 pouces OLED', '2868 x 1320', '120 Hz', 'Apple A19 Pro', '12 Go', null, null, '48 Mpx', true, I, '231 g'),
    [['512 Go', 1729], ['1 To', 1979], ['2 To', 2479]], ['mobile', 'photo', 'gaming']),

  // ───────────────────────────── Samsung Galaxy S9 / Note9 / S10 / Note10 ─────────────────────────────
  ...m('samsung-galaxy-s9', 'Samsung', 'Samsung Galaxy S9', 'Galaxy S9', 2018,
    s('5,8 pouces Super AMOLED', '2960 x 1440', '60 Hz', 'Samsung Exynos 9810', '4 Go', '3 000 mAh', '15 W', '12 Mpx', false, A, '163 g'),
    [['64 Go', 859]]),
  ...m('samsung-galaxy-s9-plus', 'Samsung', 'Samsung Galaxy S9 Plus', 'Galaxy S9', 2018,
    s('6,2 pouces Super AMOLED', '2960 x 1440', '60 Hz', 'Samsung Exynos 9810', '6 Go', '3 500 mAh', '15 W', '12 Mpx', false, A, '189 g'),
    [['64 Go', 959]]),
  ...m('samsung-galaxy-note9', 'Samsung', 'Samsung Galaxy Note9', 'Galaxy Note', 2018,
    s('6,4 pouces Super AMOLED', '2960 x 1440', '60 Hz', 'Samsung Exynos 9810', '6 Go', '4 000 mAh', '15 W', '12 Mpx', false, A, '201 g'),
    [['128 Go', 1009], ['512 Go', 1259, '8 Go']], ['mobile', 'pro']),
  ...m('samsung-galaxy-s10e', 'Samsung', 'Samsung Galaxy S10e', 'Galaxy S10', 2019,
    s('5,8 pouces Dynamic AMOLED', '2280 x 1080', '60 Hz', 'Samsung Exynos 9820', '6 Go', '3 100 mAh', '15 W', '12 Mpx', false, A, '150 g'),
    [['128 Go', 759]]),
  ...m('samsung-galaxy-s10', 'Samsung', 'Samsung Galaxy S10', 'Galaxy S10', 2019,
    s('6,1 pouces Dynamic AMOLED', '3040 x 1440', '60 Hz', 'Samsung Exynos 9820', '8 Go', '3 400 mAh', '15 W', '12 Mpx', false, A, '157 g'),
    [['128 Go', 909], ['512 Go', 1159]]),
  ...m('samsung-galaxy-s10-plus', 'Samsung', 'Samsung Galaxy S10 Plus', 'Galaxy S10', 2019,
    s('6,4 pouces Dynamic AMOLED', '3040 x 1440', '60 Hz', 'Samsung Exynos 9820', '8 Go', '4 100 mAh', '15 W', '12 Mpx', false, A, '175 g'),
    [['128 Go', 1009], ['512 Go', 1259]]),
  ...m('samsung-galaxy-note10', 'Samsung', 'Samsung Galaxy Note10', 'Galaxy Note', 2019,
    s('6,3 pouces Dynamic AMOLED', '2280 x 1080', '60 Hz', 'Samsung Exynos 9825', '8 Go', '3 500 mAh', '25 W', '12 Mpx', false, A, '168 g'),
    [['256 Go', 959]], ['mobile', 'pro']),
  ...m('samsung-galaxy-note10-plus', 'Samsung', 'Samsung Galaxy Note10 Plus', 'Galaxy Note', 2019,
    s('6,8 pouces Dynamic AMOLED', '3040 x 1440', '60 Hz', 'Samsung Exynos 9825', '12 Go', '4 300 mAh', '45 W', '12 Mpx', false, A, '196 g'),
    [['256 Go', 1109], ['512 Go', 1209]], ['mobile', 'pro']),

  // ───────────────────────────── Samsung Galaxy S20 / Note20 ─────────────────────────────
  ...m('samsung-galaxy-s20', 'Samsung', 'Samsung Galaxy S20', 'Galaxy S20', 2020,
    s('6,2 pouces Dynamic AMOLED 2X', '3200 x 1440', '120 Hz', 'Samsung Exynos 990', '8 Go', '4 000 mAh', '25 W', '12 Mpx', null, A, '163 g'),
    [['128 Go', 909]]),
  ...m('samsung-galaxy-s20-plus', 'Samsung', 'Samsung Galaxy S20 Plus', 'Galaxy S20', 2020,
    s('6,7 pouces Dynamic AMOLED 2X', '3200 x 1440', '120 Hz', 'Samsung Exynos 990', '8 Go', '4 500 mAh', '25 W', '12 Mpx', null, A, '186 g'),
    [['128 Go', 1009]]),
  ...m('samsung-galaxy-s20-ultra-5g', 'Samsung', 'Samsung Galaxy S20 Ultra 5G', 'Galaxy S20', 2020,
    s('6,9 pouces Dynamic AMOLED 2X', '3200 x 1440', '120 Hz', 'Samsung Exynos 990', '12 Go', '5 000 mAh', '45 W', '108 Mpx', true, A, '220 g'),
    [['128 Go', 1359]], ['mobile', 'photo']),
  ...m('samsung-galaxy-s20-fe', 'Samsung', 'Samsung Galaxy S20 FE', 'Galaxy S20', 2020,
    s('6,5 pouces Super AMOLED', '2400 x 1080', '120 Hz', null, '6 Go', '4 500 mAh', '25 W', '12 Mpx', null, A, '190 g'),
    [['128 Go', 659]]),
  ...m('samsung-galaxy-note20', 'Samsung', 'Samsung Galaxy Note20', 'Galaxy Note', 2020,
    s('6,7 pouces Super AMOLED Plus', '2400 x 1080', '60 Hz', 'Samsung Exynos 990', '8 Go', '4 300 mAh', '25 W', '12 Mpx', null, A, '192 g'),
    [['256 Go', 959]], ['mobile', 'pro']),
  ...m('samsung-galaxy-note20-ultra-5g', 'Samsung', 'Samsung Galaxy Note20 Ultra 5G', 'Galaxy Note', 2020,
    s('6,9 pouces Dynamic AMOLED 2X', '3088 x 1440', '120 Hz', 'Samsung Exynos 990', '12 Go', '4 500 mAh', '25 W', '108 Mpx', true, A, '208 g'),
    [['256 Go', 1309]], ['mobile', 'pro', 'photo']),

  // ───────────────────────────── Samsung Galaxy S21 / S22 ─────────────────────────────
  ...m('samsung-galaxy-s21', 'Samsung', 'Samsung Galaxy S21 5G', 'Galaxy S21', 2021,
    s('6,2 pouces Dynamic AMOLED 2X', '2400 x 1080', '120 Hz', 'Samsung Exynos 2100', '8 Go', '4 000 mAh', '25 W', '12 Mpx', true, A, '169 g'),
    [['256 Go', 909]]),
  ...m('samsung-galaxy-s21-plus', 'Samsung', 'Samsung Galaxy S21 Plus 5G', 'Galaxy S21', 2021,
    s('6,7 pouces Dynamic AMOLED 2X', '2400 x 1080', '120 Hz', 'Samsung Exynos 2100', '8 Go', '4 800 mAh', '25 W', '12 Mpx', true, A, '200 g'),
    [['128 Go', 1059], ['256 Go', 1109]]),
  ...m('samsung-galaxy-s21-ultra', 'Samsung', 'Samsung Galaxy S21 Ultra 5G', 'Galaxy S21', 2021,
    s('6,8 pouces Dynamic AMOLED 2X', '3200 x 1440', '120 Hz', 'Samsung Exynos 2100', '12 Go', '5 000 mAh', '25 W', '108 Mpx', true, A, '227 g'),
    [['256 Go', 1309], ['512 Go', 1439, '16 Go']], ['mobile', 'photo']),
  ...m('samsung-galaxy-s22', 'Samsung', 'Samsung Galaxy S22', 'Galaxy S22', 2022,
    s('6,1 pouces Dynamic AMOLED 2X', '2340 x 1080', '120 Hz', 'Samsung Exynos 2200', '8 Go', '3 700 mAh', '25 W', '50 Mpx', true, A, '167 g'),
    [['256 Go', 909]]),
  ...m('samsung-galaxy-s22-plus', 'Samsung', 'Samsung Galaxy S22 Plus', 'Galaxy S22', 2022,
    s('6,6 pouces Dynamic AMOLED 2X', '2340 x 1080', '120 Hz', 'Samsung Exynos 2200', '8 Go', '4 500 mAh', '45 W', '50 Mpx', true, A, '195 g'),
    [['128 Go', 1059], ['256 Go', 1109]]),
  ...m('samsung-galaxy-s22-ultra', 'Samsung', 'Samsung Galaxy S22 Ultra', 'Galaxy S22', 2022,
    s('6,8 pouces Dynamic AMOLED 2X', '3088 x 1440', '120 Hz', 'Samsung Exynos 2200', '12 Go', '5 000 mAh', '45 W', '108 Mpx', true, A, '228 g'),
    [['256 Go', 1359], ['512 Go', 1459]], ['mobile', 'photo', 'pro']),

  // ───────────────────────────── Samsung Galaxy S23 / S24 / S25 ─────────────────────────────
  ...m('samsung-galaxy-s23-plus', 'Samsung', 'Samsung Galaxy S23 Plus', 'Galaxy S23', 2023,
    s('6,6 pouces Dynamic AMOLED 2X', '2340 x 1080', '120 Hz', 'Qualcomm Snapdragon 8 Gen 2 for Galaxy', '8 Go', '4 700 mAh', '45 W', '50 Mpx', true, A, '196 g'),
    [['256 Go', 1219], ['512 Go', 1339]]),
  ...m('samsung-galaxy-s23-ultra', 'Samsung', 'Samsung Galaxy S23 Ultra', 'Galaxy S23', 2023,
    s('6,8 pouces Dynamic AMOLED 2X', '3088 x 1440', '120 Hz', 'Qualcomm Snapdragon 8 Gen 2 for Galaxy', '12 Go', '5 000 mAh', '45 W', '200 Mpx', true, A, '234 g'),
    [['512 Go', 1539], ['1 To', 1779]], ['mobile', 'photo', 'pro']),
  ...m('samsung-galaxy-s23-fe', 'Samsung', 'Samsung Galaxy S23 FE', 'Galaxy S23', 2023,
    s('6,4 pouces Dynamic AMOLED 2X', '2340 x 1080', '120 Hz', 'Samsung Exynos 2200', '8 Go', '4 500 mAh', '25 W', '50 Mpx', true, A, '209 g'),
    [['256 Go', 759]]),
  ...m('samsung-galaxy-s24-plus', 'Samsung', 'Samsung Galaxy S24 Plus', 'Galaxy S24', 2024,
    s('6,7 pouces Dynamic AMOLED 2X', '3120 x 1440', '120 Hz', 'Samsung Exynos 2400', '12 Go', '4 900 mAh', '45 W', '50 Mpx', true, A, '196 g'),
    [['256 Go', 1169], ['512 Go', 1289]]),
  ...m('samsung-galaxy-s24-ultra', 'Samsung', 'Samsung Galaxy S24 Ultra', 'Galaxy S24', 2024,
    s('6,8 pouces Dynamic AMOLED 2X', '3120 x 1440', '120 Hz', 'Qualcomm Snapdragon 8 Gen 3 for Galaxy', '12 Go', '5 000 mAh', '45 W', '200 Mpx', true, A, '232 g'),
    [['512 Go', 1589], ['1 To', 1829]], ['mobile', 'photo', 'pro', 'gaming']),
  ...m('samsung-galaxy-s24-fe', 'Samsung', 'Samsung Galaxy S24 FE', 'Galaxy S24', 2024,
    s('6,7 pouces Dynamic AMOLED 2X', '2340 x 1080', '120 Hz', 'Samsung Exynos 2400e', '8 Go', '4 700 mAh', '25 W', '50 Mpx', true, A, '213 g'),
    [['256 Go', 859]]),
  ...m('samsung-galaxy-s25-plus', 'Samsung', 'Samsung Galaxy S25 Plus', 'Galaxy S25', 2025,
    s('6,7 pouces Dynamic AMOLED 2X', '3120 x 1440', '120 Hz', 'Qualcomm Snapdragon 8 Elite for Galaxy', '12 Go', '4 900 mAh', '45 W', '50 Mpx', true, A, '190 g'),
    [['256 Go', 1169], ['512 Go', 1289]]),
  ...m('samsung-galaxy-s25-ultra', 'Samsung', 'Samsung Galaxy S25 Ultra', 'Galaxy S25', 2025,
    s('6,9 pouces Dynamic AMOLED 2X', '3120 x 1440', '120 Hz', 'Qualcomm Snapdragon 8 Elite for Galaxy', '12 Go', '5 000 mAh', '45 W', '200 Mpx', true, A, '218 g'),
    [['512 Go', 1579], ['1 To', 1819, '16 Go']], ['mobile', 'photo', 'pro', 'gaming']),
  ...m('samsung-galaxy-s25-edge', 'Samsung', 'Samsung Galaxy S25 Edge', 'Galaxy S25', 2025,
    s('6,7 pouces Dynamic AMOLED 2X', '3120 x 1440', '120 Hz', 'Qualcomm Snapdragon 8 Elite for Galaxy', '12 Go', '3 900 mAh', '25 W', '200 Mpx', true, A, '163 g'),
    [['512 Go', 1379]]),
  ...m('samsung-galaxy-s25-fe', 'Samsung', 'Samsung Galaxy S25 FE', 'Galaxy S25', 2025,
    s('6,7 pouces Dynamic AMOLED 2X', '2340 x 1080', '120 Hz', 'Samsung Exynos 2400', '8 Go', '4 900 mAh', '45 W', '50 Mpx', true, A, '190 g'),
    [['256 Go']]),
];
