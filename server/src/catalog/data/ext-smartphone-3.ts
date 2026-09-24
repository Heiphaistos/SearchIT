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

/**
 * Catalogue de référence (extension) : Xiaomi (Mi / Xiaomi / T), Redmi et Poco.
 * Clé omise quand la valeur n'est pas certaine.
 */
export const PRODUCTS: CatalogProduct[] = [
  // ───────────────────────────── Xiaomi Mi 9 → Mi 11 ─────────────────────────────
  ...m('xiaomi-mi-9', 'Xiaomi', 'Xiaomi Mi 9', 'Xiaomi Mi 9', 2019,
    s('6,39 pouces AMOLED', '2340 x 1080', '60 Hz', 'Qualcomm Snapdragon 855', '6 Go', '3 300 mAh', '27 W', '48 Mpx', false, A, '173 g'),
    [['64 Go', 449], ['128 Go', 499]]),
  ...m('xiaomi-mi-9t', 'Xiaomi', 'Xiaomi Mi 9T', 'Xiaomi Mi 9', 2019,
    s('6,39 pouces AMOLED', '2340 x 1080', '60 Hz', 'Qualcomm Snapdragon 730', '6 Go', '4 000 mAh', '18 W', '48 Mpx', false, A, '191 g'),
    [['64 Go', 329], ['128 Go', 369]], ['mobile', 'budget']),
  ...m('xiaomi-mi-9t-pro', 'Xiaomi', 'Xiaomi Mi 9T Pro', 'Xiaomi Mi 9', 2019,
    s('6,39 pouces AMOLED', '2340 x 1080', '60 Hz', 'Qualcomm Snapdragon 855', '6 Go', '4 000 mAh', '27 W', '48 Mpx', false, A, '191 g'),
    [['64 Go', 399], ['128 Go', 449]]),
  ...m('xiaomi-mi-10-5g', 'Xiaomi', 'Xiaomi Mi 10 5G', 'Xiaomi Mi 10', 2020,
    s('6,67 pouces AMOLED', '2340 x 1080', '90 Hz', 'Qualcomm Snapdragon 865', '8 Go', '4 780 mAh', '30 W', '108 Mpx', true, A, '208 g'),
    [['128 Go', 799], ['256 Go', 899]], ['mobile', 'photo']),
  ...m('xiaomi-mi-10-pro-5g', 'Xiaomi', 'Xiaomi Mi 10 Pro 5G', 'Xiaomi Mi 10', 2020,
    s('6,67 pouces AMOLED', '2340 x 1080', '90 Hz', 'Qualcomm Snapdragon 865', '8 Go', '4 500 mAh', '50 W', '108 Mpx', true, A, '208 g'),
    [['256 Go', 999]], ['mobile', 'photo']),
  ...m('xiaomi-mi-10t-5g', 'Xiaomi', 'Xiaomi Mi 10T 5G', 'Xiaomi Mi 10', 2020,
    s('6,67 pouces LCD', '2400 x 1080', '144 Hz', 'Qualcomm Snapdragon 865', '6 Go', '5 000 mAh', '33 W', '64 Mpx', true, A, '216 g'),
    [['128 Go', 499]]),
  ...m('xiaomi-mi-10t-pro-5g', 'Xiaomi', 'Xiaomi Mi 10T Pro 5G', 'Xiaomi Mi 10', 2020,
    s('6,67 pouces LCD', '2400 x 1080', '144 Hz', 'Qualcomm Snapdragon 865', '8 Go', '5 000 mAh', '33 W', '108 Mpx', true, A, '218 g'),
    [['128 Go', 599], ['256 Go', 649]]),
  ...m('xiaomi-mi-10t-lite-5g', 'Xiaomi', 'Xiaomi Mi 10T Lite 5G', 'Xiaomi Mi 10', 2020,
    s('6,67 pouces LCD', '2400 x 1080', '120 Hz', 'Qualcomm Snapdragon 750G', '6 Go', '4 820 mAh', '33 W', '64 Mpx', true, A, '214 g'),
    [['64 Go', 279], ['128 Go', 329]], ['mobile', 'budget']),
  ...m('xiaomi-mi-11-5g', 'Xiaomi', 'Xiaomi Mi 11 5G', 'Xiaomi Mi 11', 2021,
    s('6,81 pouces AMOLED', '3200 x 1440', '120 Hz', 'Qualcomm Snapdragon 888', '8 Go', '4 600 mAh', '55 W', '108 Mpx', true, A, '196 g'),
    [['128 Go', 749], ['256 Go', 799]], ['mobile', 'photo']),
  ...m('xiaomi-mi-11-ultra', 'Xiaomi', 'Xiaomi Mi 11 Ultra', 'Xiaomi Mi 11', 2021,
    s('6,81 pouces AMOLED', '3200 x 1440', '120 Hz', 'Qualcomm Snapdragon 888', '12 Go', '5 000 mAh', '67 W', '50 Mpx', true, A, '234 g'),
    [['256 Go', 1199]], ['mobile', 'photo', 'pro']),
  ...m('xiaomi-mi-11-lite-5g', 'Xiaomi', 'Xiaomi Mi 11 Lite 5G', 'Xiaomi Mi 11', 2021,
    s('6,55 pouces AMOLED', '2400 x 1080', '90 Hz', 'Qualcomm Snapdragon 780G', '6 Go', '4 250 mAh', '33 W', '64 Mpx', true, A, '159 g'),
    [['128 Go', 369]], ['mobile', 'budget']),

  // ───────────────────────────── Xiaomi 11T → 15T ─────────────────────────────
  ...m('xiaomi-11t', 'Xiaomi', 'Xiaomi 11T', 'Xiaomi 11', 2021,
    s('6,67 pouces AMOLED', '2400 x 1080', '120 Hz', 'MediaTek Dimensity 1200-Ultra', '8 Go', '5 000 mAh', '67 W', '108 Mpx', true, A, '203 g'),
    [['128 Go', 549], ['256 Go', 599]]),
  ...m('xiaomi-11t-pro', 'Xiaomi', 'Xiaomi 11T Pro', 'Xiaomi 11', 2021,
    s('6,67 pouces AMOLED', '2400 x 1080', '120 Hz', 'Qualcomm Snapdragon 888', '8 Go', '5 000 mAh', '120 W', '108 Mpx', true, A, '204 g'),
    [['128 Go', 649], ['256 Go', 699]]),
  ...m('xiaomi-11-lite-5g-ne', 'Xiaomi', 'Xiaomi 11 Lite 5G NE', 'Xiaomi 11', 2021,
    s('6,55 pouces AMOLED', '2400 x 1080', '90 Hz', 'Qualcomm Snapdragon 778G', '8 Go', '4 250 mAh', '33 W', '64 Mpx', true, A, '158 g'),
    [['128 Go', 369]], ['mobile', 'budget']),
  ...m('xiaomi-12', 'Xiaomi', 'Xiaomi 12', 'Xiaomi 12', 2022,
    s('6,28 pouces AMOLED', '2400 x 1080', '120 Hz', 'Qualcomm Snapdragon 8 Gen 1', '8 Go', '4 500 mAh', '67 W', '50 Mpx', true, A, '180 g'),
    [['256 Go']]),
  ...m('xiaomi-12-pro', 'Xiaomi', 'Xiaomi 12 Pro', 'Xiaomi 12', 2022,
    s('6,73 pouces AMOLED', '3200 x 1440', '120 Hz', 'Qualcomm Snapdragon 8 Gen 1', '12 Go', '4 600 mAh', '120 W', '50 Mpx', true, A, '205 g'),
    [['256 Go']], ['mobile', 'photo']),
  ...m('xiaomi-12-lite', 'Xiaomi', 'Xiaomi 12 Lite', 'Xiaomi 12', 2022,
    s('6,55 pouces AMOLED', '2400 x 1080', '120 Hz', 'Qualcomm Snapdragon 778G', '8 Go', '4 300 mAh', '67 W', '108 Mpx', true, A, '173 g'),
    [['128 Go']], ['mobile', 'budget']),
  ...m('xiaomi-12t', 'Xiaomi', 'Xiaomi 12T', 'Xiaomi 12', 2022,
    s('6,67 pouces AMOLED', '2712 x 1220', '120 Hz', 'MediaTek Dimensity 8100-Ultra', '8 Go', '5 000 mAh', '120 W', '108 Mpx', true, A, '202 g'),
    [['128 Go', 649], ['256 Go', 699]]),
  ...m('xiaomi-12t-pro', 'Xiaomi', 'Xiaomi 12T Pro', 'Xiaomi 12', 2022,
    s('6,67 pouces AMOLED', '2712 x 1220', '120 Hz', 'Qualcomm Snapdragon 8+ Gen 1', '8 Go', '5 000 mAh', '120 W', '200 Mpx', true, A, '205 g'),
    [['256 Go', 849]], ['mobile', 'photo']),
  ...m('xiaomi-13-lite', 'Xiaomi', 'Xiaomi 13 Lite', 'Xiaomi 13', 2023,
    s('6,55 pouces AMOLED', '2400 x 1080', '120 Hz', 'Qualcomm Snapdragon 7 Gen 1', '8 Go', '4 500 mAh', '67 W', '50 Mpx', true, A, '171 g'),
    [['128 Go'], ['256 Go']], ['mobile', 'budget']),
  ...m('xiaomi-14', 'Xiaomi', 'Xiaomi 14', 'Xiaomi 14', 2024,
    s('6,36 pouces AMOLED', '2670 x 1200', '120 Hz', 'Qualcomm Snapdragon 8 Gen 3', '12 Go', '4 610 mAh', '90 W', '50 Mpx', true, A, '193 g'),
    [['256 Go', 999]], ['mobile', 'photo']),
  ...m('xiaomi-14t', 'Xiaomi', 'Xiaomi 14T', 'Xiaomi 14', 2024,
    s('6,67 pouces AMOLED', '2712 x 1220', '144 Hz', 'MediaTek Dimensity 8300-Ultra', '12 Go', '5 000 mAh', '67 W', '50 Mpx', true, A, '195 g'),
    [['512 Go']]),
  ...m('xiaomi-14t-pro', 'Xiaomi', 'Xiaomi 14T Pro', 'Xiaomi 14', 2024,
    s('6,67 pouces AMOLED', '2712 x 1220', '144 Hz', 'MediaTek Dimensity 9300+', '12 Go', '5 000 mAh', '120 W', '50 Mpx', true, A, '209 g'),
    [['256 Go'], ['1 To']], ['mobile', 'gaming']),
  ...m('xiaomi-15', 'Xiaomi', 'Xiaomi 15', 'Xiaomi 15', 2025,
    s('6,36 pouces AMOLED', '2670 x 1200', '120 Hz', 'Qualcomm Snapdragon 8 Elite', '12 Go', '5 240 mAh', '90 W', '50 Mpx', true, A, '191 g'),
    [['256 Go', 999]], ['mobile', 'photo']),
  ...m('xiaomi-15t', 'Xiaomi', 'Xiaomi 15T', 'Xiaomi 15', 2025,
    s('6,83 pouces AMOLED', null, '120 Hz', 'MediaTek Dimensity 8400-Ultra', '12 Go', '5 500 mAh', '67 W', '50 Mpx', true, A, null),
    [['256 Go'], ['512 Go']]),
  ...m('xiaomi-15t-pro', 'Xiaomi', 'Xiaomi 15T Pro', 'Xiaomi 15', 2025,
    s('6,83 pouces AMOLED', null, '144 Hz', 'MediaTek Dimensity 9400+', '12 Go', '5 500 mAh', '90 W', '50 Mpx', true, A, null),
    [['256 Go'], ['512 Go']], ['mobile', 'photo']),

  // ───────────────────────────── Redmi Note 7 → Note 11 ─────────────────────────────
  ...m('xiaomi-redmi-note-7', 'Xiaomi', 'Xiaomi Redmi Note 7', 'Redmi Note 7', 2019,
    s('6,3 pouces LCD', '2340 x 1080', '60 Hz', 'Qualcomm Snapdragon 660', '4 Go', '4 000 mAh', '18 W', '48 Mpx', false, A, '186 g'),
    [['64 Go', 199]], ['mobile', 'budget']),
  ...m('xiaomi-redmi-note-8', 'Xiaomi', 'Xiaomi Redmi Note 8', 'Redmi Note 8', 2019,
    s('6,3 pouces LCD', '2340 x 1080', '60 Hz', 'Qualcomm Snapdragon 665', '4 Go', '4 000 mAh', '18 W', '48 Mpx', false, A, '190 g'),
    [['64 Go', 179], ['128 Go', 229]], ['mobile', 'budget']),
  ...m('xiaomi-redmi-note-8t', 'Xiaomi', 'Xiaomi Redmi Note 8T', 'Redmi Note 8', 2019,
    s('6,3 pouces LCD', '2340 x 1080', '60 Hz', 'Qualcomm Snapdragon 665', '4 Go', '4 000 mAh', '18 W', '48 Mpx', false, A, '200 g'),
    [['64 Go', 199]], ['mobile', 'budget']),
  ...m('xiaomi-redmi-note-8-pro', 'Xiaomi', 'Xiaomi Redmi Note 8 Pro', 'Redmi Note 8', 2019,
    s('6,53 pouces LCD', '2340 x 1080', '60 Hz', 'MediaTek Helio G90T', '6 Go', '4 500 mAh', '18 W', '64 Mpx', false, A, '200 g'),
    [['64 Go', 249], ['128 Go', 279]], ['mobile', 'budget']),
  ...m('xiaomi-redmi-note-9', 'Xiaomi', 'Xiaomi Redmi Note 9', 'Redmi Note 9', 2020,
    s('6,53 pouces LCD', '2340 x 1080', '60 Hz', 'MediaTek Helio G85', '3 Go', '5 020 mAh', '18 W', '48 Mpx', false, A, '199 g'),
    [['64 Go', 199], ['128 Go', 249, '4 Go']], ['mobile', 'budget']),
  ...m('xiaomi-redmi-note-9s', 'Xiaomi', 'Xiaomi Redmi Note 9S', 'Redmi Note 9', 2020,
    s('6,67 pouces LCD', '2400 x 1080', '60 Hz', 'Qualcomm Snapdragon 720G', '4 Go', '5 020 mAh', '18 W', '48 Mpx', false, A, '209 g'),
    [['64 Go', 249]], ['mobile', 'budget']),
  ...m('xiaomi-redmi-note-9-pro', 'Xiaomi', 'Xiaomi Redmi Note 9 Pro', 'Redmi Note 9', 2020,
    s('6,67 pouces LCD', '2400 x 1080', '60 Hz', 'Qualcomm Snapdragon 720G', '6 Go', '5 020 mAh', '30 W', '64 Mpx', false, A, '209 g'),
    [['64 Go', 269], ['128 Go', 299]], ['mobile', 'budget']),
  ...m('xiaomi-redmi-note-10', 'Xiaomi', 'Xiaomi Redmi Note 10', 'Redmi Note 10', 2021,
    s('6,43 pouces AMOLED', '2400 x 1080', '60 Hz', 'Qualcomm Snapdragon 678', '4 Go', '5 000 mAh', '33 W', '48 Mpx', false, A, '178 g'),
    [['64 Go', 199], ['128 Go', 229]], ['mobile', 'budget']),
  ...m('xiaomi-redmi-note-10-5g', 'Xiaomi', 'Xiaomi Redmi Note 10 5G', 'Redmi Note 10', 2021,
    s('6,5 pouces LCD', '2400 x 1080', '90 Hz', 'MediaTek Dimensity 700', '4 Go', '5 000 mAh', '18 W', '48 Mpx', true, A, '190 g'),
    [['64 Go', 199], ['128 Go', 229]], ['mobile', 'budget']),
  ...m('xiaomi-redmi-note-10-pro', 'Xiaomi', 'Xiaomi Redmi Note 10 Pro', 'Redmi Note 10', 2021,
    s('6,67 pouces AMOLED', '2400 x 1080', '120 Hz', 'Qualcomm Snapdragon 732G', '6 Go', '5 020 mAh', '33 W', '108 Mpx', false, A, '193 g'),
    [['64 Go', 279], ['128 Go', 299]], ['mobile', 'budget']),
  ...m('xiaomi-redmi-note-11', 'Xiaomi', 'Xiaomi Redmi Note 11', 'Redmi Note 11', 2022,
    s('6,43 pouces AMOLED', '2400 x 1080', '90 Hz', 'Qualcomm Snapdragon 680', '4 Go', '5 000 mAh', '33 W', '50 Mpx', false, A, '179 g'),
    [['64 Go', 199], ['128 Go', 229]], ['mobile', 'budget']),
  ...m('xiaomi-redmi-note-11s', 'Xiaomi', 'Xiaomi Redmi Note 11S', 'Redmi Note 11', 2022,
    s('6,43 pouces AMOLED', '2400 x 1080', '90 Hz', 'MediaTek Helio G96', '6 Go', '5 000 mAh', '33 W', '108 Mpx', false, A, '179 g'),
    [['128 Go', 279]], ['mobile', 'budget']),
  ...m('xiaomi-redmi-note-11-pro-5g', 'Xiaomi', 'Xiaomi Redmi Note 11 Pro 5G', 'Redmi Note 11', 2022,
    s('6,67 pouces AMOLED', '2400 x 1080', '120 Hz', 'Qualcomm Snapdragon 695', '6 Go', '5 000 mAh', '67 W', '108 Mpx', true, A, '202 g'),
    [['64 Go', 329], ['128 Go', 349]], ['mobile', 'budget']),
  ...m('xiaomi-redmi-note-11-pro-plus-5g', 'Xiaomi', 'Xiaomi Redmi Note 11 Pro Plus 5G', 'Redmi Note 11', 2022,
    s('6,67 pouces AMOLED', '2400 x 1080', '120 Hz', 'MediaTek Dimensity 920', '8 Go', '4 500 mAh', '120 W', '108 Mpx', true, A, '204 g'),
    [['128 Go'], ['256 Go']], ['mobile', 'budget']),

  // ───────────────────────────── Redmi Note 12 → Note 14 (autres versions) ─────────────────────────────
  ...m('xiaomi-redmi-note-12-5g', 'Xiaomi', 'Xiaomi Redmi Note 12 5G', 'Redmi Note 12', 2023,
    s('6,67 pouces AMOLED', '2400 x 1080', '120 Hz', 'Qualcomm Snapdragon 4 Gen 1', '4 Go', '5 000 mAh', '33 W', '48 Mpx', true, A, '188 g'),
    [['128 Go']], ['mobile', 'budget']),
  ...m('xiaomi-redmi-note-12-pro-5g', 'Xiaomi', 'Xiaomi Redmi Note 12 Pro 5G', 'Redmi Note 12', 2023,
    s('6,67 pouces OLED', '2400 x 1080', '120 Hz', 'MediaTek Dimensity 1080', '8 Go', '5 000 mAh', '67 W', '50 Mpx', true, A, '187 g'),
    [['256 Go']], ['mobile', 'budget']),
  ...m('xiaomi-redmi-note-13-5g', 'Xiaomi', 'Xiaomi Redmi Note 13 5G', 'Redmi Note 13', 2024,
    s('6,67 pouces AMOLED', '2400 x 1080', '120 Hz', 'MediaTek Dimensity 6080', '6 Go', '5 000 mAh', '33 W', '108 Mpx', true, A, '174 g'),
    [['128 Go'], ['256 Go', null, '8 Go']], ['mobile', 'budget']),
  ...m('xiaomi-redmi-note-13-pro', 'Xiaomi', 'Xiaomi Redmi Note 13 Pro', 'Redmi Note 13', 2024,
    s('6,67 pouces AMOLED', '2400 x 1080', '120 Hz', 'MediaTek Helio G99-Ultra', '8 Go', '5 000 mAh', '67 W', '200 Mpx', false, A, '188 g'),
    [['256 Go']], ['mobile', 'budget']),
  ...m('xiaomi-redmi-note-13-pro-5g', 'Xiaomi', 'Xiaomi Redmi Note 13 Pro 5G', 'Redmi Note 13', 2024,
    s('6,67 pouces AMOLED', '2712 x 1220', '120 Hz', 'Qualcomm Snapdragon 7s Gen 2', '12 Go', '5 100 mAh', '67 W', '200 Mpx', true, A, '187 g'),
    [['512 Go']], ['mobile', 'budget']),
  ...m('redmi-note-13-pro-plus-5g', 'Xiaomi', 'Xiaomi Redmi Note 13 Pro Plus 5G', 'Redmi Note 13', 2024,
    s('6,67 pouces AMOLED', '2712 x 1220', '120 Hz', 'MediaTek Dimensity 7200-Ultra', '8 Go', '5 000 mAh', '120 W', '200 Mpx', true, A, '204 g'),
    [['256 Go'], ['512 Go', null, '12 Go']], ['mobile', 'budget']),
  ...m('xiaomi-redmi-note-14-5g', 'Xiaomi', 'Xiaomi Redmi Note 14 5G', 'Redmi Note 14', 2025,
    s('6,67 pouces AMOLED', '2400 x 1080', '120 Hz', 'MediaTek Dimensity 7025-Ultra', '8 Go', '5 110 mAh', '45 W', '108 Mpx', true, A, '190 g'),
    [['256 Go']], ['mobile', 'budget']),
  ...m('redmi-note-14-pro-plus-5g', 'Xiaomi', 'Xiaomi Redmi Note 14 Pro Plus 5G', 'Redmi Note 14', 2025,
    s('6,67 pouces AMOLED', '2712 x 1220', '120 Hz', 'Qualcomm Snapdragon 7s Gen 3', '8 Go', '5 110 mAh', '120 W', '50 Mpx', true, A, '205 g'),
    [['256 Go'], ['512 Go', null, '12 Go']], ['mobile', 'budget']),

  // ───────────────────────────── Redmi (série numérotée) ─────────────────────────────
  ...m('xiaomi-redmi-9a', 'Xiaomi', 'Xiaomi Redmi 9A', 'Redmi', 2020,
    s('6,53 pouces LCD', '1600 x 720', '60 Hz', 'MediaTek Helio G25', '2 Go', '5 000 mAh', null, '13 Mpx', false, A, '194 g'),
    [['32 Go', 99]], ['mobile', 'budget']),
  ...m('xiaomi-redmi-10', 'Xiaomi', 'Xiaomi Redmi 10', 'Redmi', 2021,
    s('6,5 pouces LCD', '2400 x 1080', '90 Hz', 'MediaTek Helio G88', '4 Go', '5 000 mAh', '18 W', '50 Mpx', false, A, '181 g'),
    [['64 Go', 179], ['128 Go', 199]], ['mobile', 'budget']),
  ...m('xiaomi-redmi-12', 'Xiaomi', 'Xiaomi Redmi 12', 'Redmi', 2023,
    s('6,79 pouces LCD', '2460 x 1080', '90 Hz', 'MediaTek Helio G88', '4 Go', '5 000 mAh', '18 W', '50 Mpx', false, A, '198 g'),
    [['128 Go', 199]], ['mobile', 'budget']),
  ...m('xiaomi-redmi-13c', 'Xiaomi', 'Xiaomi Redmi 13C', 'Redmi', 2023,
    s('6,74 pouces LCD', '1600 x 720', '90 Hz', 'MediaTek Helio G85', '4 Go', '5 000 mAh', '18 W', '50 Mpx', false, A, '192 g'),
    [['128 Go']], ['mobile', 'budget']),
  ...m('xiaomi-redmi-13', 'Xiaomi', 'Xiaomi Redmi 13', 'Redmi', 2024,
    s('6,79 pouces LCD', '2460 x 1080', '90 Hz', 'MediaTek Helio G91-Ultra', null, '5 030 mAh', '33 W', '108 Mpx', false, A, '205 g'),
    [['128 Go'], ['256 Go']], ['mobile', 'budget']),
  ...m('xiaomi-redmi-14c', 'Xiaomi', 'Xiaomi Redmi 14C', 'Redmi', 2024,
    s('6,88 pouces LCD', '1640 x 720', '120 Hz', 'MediaTek Helio G81-Ultra', '4 Go', '5 160 mAh', '18 W', '50 Mpx', false, A, '211 g'),
    [['128 Go']], ['mobile', 'budget']),
  ...m('xiaomi-redmi-a3', 'Xiaomi', 'Xiaomi Redmi A3', 'Redmi', 2024,
    s('6,71 pouces LCD', '1650 x 720', '90 Hz', 'MediaTek Helio G36', '3 Go', '5 000 mAh', '10 W', '8 Mpx', false, A, '193 g'),
    [['64 Go']], ['mobile', 'budget']),

  // ───────────────────────────── Poco ─────────────────────────────
  ...m('poco-pocophone-f1', 'Poco', 'Xiaomi Pocophone F1', 'Poco F', 2018,
    s('6,18 pouces LCD', '2246 x 1080', '60 Hz', 'Qualcomm Snapdragon 845', '6 Go', '4 000 mAh', '18 W', '12 Mpx', false, A, '182 g'),
    [['64 Go', 329], ['128 Go', 399]], ['mobile', 'gaming', 'budget']),
  ...m('poco-f2-pro', 'Poco', 'Poco F2 Pro', 'Poco F', 2020,
    s('6,67 pouces AMOLED', '2400 x 1080', '60 Hz', 'Qualcomm Snapdragon 865', '6 Go', '4 700 mAh', '30 W', '64 Mpx', true, A, '219 g'),
    [['128 Go', 499], ['256 Go', 599, '8 Go']], ['mobile', 'gaming']),
  ...m('poco-f3', 'Poco', 'Poco F3', 'Poco F', 2021,
    s('6,67 pouces AMOLED', '2400 x 1080', '120 Hz', 'Qualcomm Snapdragon 870', '6 Go', '4 520 mAh', '33 W', '48 Mpx', true, A, '196 g'),
    [['128 Go', 349], ['256 Go', 399, '8 Go']], ['mobile', 'gaming', 'budget']),
  ...m('poco-f4-5g', 'Poco', 'Poco F4 5G', 'Poco F', 2022,
    s('6,67 pouces AMOLED', '2400 x 1080', '120 Hz', 'Qualcomm Snapdragon 870', '6 Go', '4 500 mAh', '67 W', '64 Mpx', true, A, '195 g'),
    [['128 Go', 429], ['256 Go', 499, '8 Go']], ['mobile', 'gaming']),
  ...m('xiaomi-poco-f6', 'Poco', 'Poco F6', 'Poco F', 2024,
    s('6,67 pouces AMOLED', '2712 x 1220', '120 Hz', 'Qualcomm Snapdragon 8s Gen 3', '12 Go', '5 000 mAh', '90 W', '50 Mpx', true, A, '179 g'),
    [['512 Go']], ['mobile', 'gaming']),
  ...m('xiaomi-poco-f6-pro', 'Poco', 'Poco F6 Pro', 'Poco F', 2024,
    s('6,67 pouces AMOLED', '3200 x 1440', '120 Hz', 'Qualcomm Snapdragon 8 Gen 2', '12 Go', '5 000 mAh', '120 W', '50 Mpx', true, A, '209 g'),
    [['512 Go']], ['mobile', 'gaming']),
  ...m('poco-f7', 'Poco', 'Poco F7', 'Poco F', 2025,
    s('6,83 pouces AMOLED', '2772 x 1280', '120 Hz', 'Qualcomm Snapdragon 8s Gen 4', '12 Go', '6 500 mAh', '90 W', '50 Mpx', true, A, '215 g'),
    [['256 Go'], ['512 Go']], ['mobile', 'gaming']),
  ...m('poco-x3-nfc', 'Poco', 'Poco X3 NFC', 'Poco X', 2020,
    s('6,67 pouces LCD', '2400 x 1080', '120 Hz', 'Qualcomm Snapdragon 732G', '6 Go', '5 160 mAh', '33 W', '64 Mpx', false, A, '215 g'),
    [['64 Go', 229], ['128 Go', 269]], ['mobile', 'budget']),
  ...m('poco-x3-pro', 'Poco', 'Poco X3 Pro', 'Poco X', 2021,
    s('6,67 pouces LCD', '2400 x 1080', '120 Hz', 'Qualcomm Snapdragon 860', '6 Go', '5 160 mAh', '33 W', '48 Mpx', false, A, '215 g'),
    [['128 Go', 249], ['256 Go', 299, '8 Go']], ['mobile', 'gaming', 'budget']),
  ...m('poco-x4-pro-5g', 'Poco', 'Poco X4 Pro 5G', 'Poco X', 2022,
    s('6,67 pouces AMOLED', '2400 x 1080', '120 Hz', 'Qualcomm Snapdragon 695', '6 Go', '5 000 mAh', '67 W', '108 Mpx', true, A, '205 g'),
    [['128 Go'], ['256 Go', null, '8 Go']], ['mobile', 'budget']),
  ...m('poco-x5-pro-5g', 'Poco', 'Poco X5 Pro 5G', 'Poco X', 2023,
    s('6,67 pouces AMOLED', '2400 x 1080', '120 Hz', 'Qualcomm Snapdragon 778G', '6 Go', '5 000 mAh', '67 W', '108 Mpx', true, A, '181 g'),
    [['128 Go'], ['256 Go', null, '8 Go']], ['mobile', 'budget']),
  ...m('xiaomi-poco-x6-pro', 'Poco', 'Poco X6 Pro', 'Poco X', 2024,
    s('6,67 pouces AMOLED', '2712 x 1220', '120 Hz', 'MediaTek Dimensity 8300-Ultra', '12 Go', '5 000 mAh', '67 W', '64 Mpx', true, A, '186 g'),
    [['512 Go']], ['mobile', 'gaming', 'budget']),
  ...m('poco-x7', 'Poco', 'Poco X7', 'Poco X', 2025,
    s('6,67 pouces AMOLED', '2712 x 1220', '120 Hz', 'MediaTek Dimensity 7300-Ultra', '8 Go', '5 500 mAh', '45 W', '50 Mpx', true, A, '190 g'),
    [['256 Go'], ['512 Go', null, '12 Go']], ['mobile', 'budget']),
  ...m('poco-x7-pro', 'Poco', 'Poco X7 Pro', 'Poco X', 2025,
    s('6,67 pouces AMOLED', '2712 x 1220', '120 Hz', 'MediaTek Dimensity 8400-Ultra', '8 Go', '6 000 mAh', '90 W', '50 Mpx', true, A, '195 g'),
    [['256 Go'], ['512 Go', null, '12 Go']], ['mobile', 'gaming', 'budget']),
  ...m('poco-c65', 'Poco', 'Poco C65', 'Poco C', 2023,
    s('6,74 pouces LCD', '1600 x 720', '90 Hz', 'MediaTek Helio G85', null, '5 000 mAh', '18 W', '50 Mpx', false, A, '192 g'),
    [['128 Go'], ['256 Go']], ['mobile', 'budget']),
];
