import type { CatalogProduct } from '../types.js';

/**
 * Catalogue étendu : tablettes Apple iPad Pro (toutes générations) (déclinaisons stockage et Wi-Fi / Cellular).
 * Poids indiqué pour les modèles Wi-Fi uniquement ; clé omise quand la valeur n'est pas certaine.
 */

/** [stockage, prix Wi-Fi, prix Cellular, RAM spécifique] — null : prix inconnu, false : déclinaison inexistante. */
type V = [string, number | null | false, number | null | false, string?];

interface Base {
  id: string;
  name: string;
  family: string;
  year: number;
  tags: string[];
  wifi: string;
  cell: string;
  specs: Record<string, string>;
}

function slug(s: string): string {
  return s.toLowerCase().replace(/\s+/g, '');
}

function ipad(b: Base, variants: V[]): CatalogProduct[] {
  const out: CatalogProduct[] = [];
  for (const [storage, wifiPrice, cellPrice, ram] of variants) {
    for (const cellular of [false, true]) {
      const price = cellular ? cellPrice : wifiPrice;
      if (price === false) continue;
      const specs: Record<string, string> = { ...b.specs };
      if (ram) specs['RAM'] = ram;
      specs['Stockage'] = storage;
      specs['Connectivité'] = cellular ? b.cell : b.wifi;
      if (cellular) delete specs['Poids'];
      // Ordre d'affichage conforme à SPEC_KEYS
      const order = ['Écran', 'Définition', 'Processeur', 'RAM', 'Stockage', 'Batterie', 'Stylet', 'Connectivité', 'Système', 'Poids'];
      const sorted: Record<string, string> = {};
      for (const k of order) if (specs[k] !== undefined) sorted[k] = specs[k];
      const p: CatalogProduct = {
        id: `${b.id}-${slug(storage)}-${cellular ? 'cellular' : 'wifi'}`,
        category: 'tablet',
        brand: 'Apple',
        name: `${b.name} ${storage} ${cellular ? 'Wi-Fi + Cellular' : 'Wi-Fi'}`,
        family: b.family,
        year: b.year,
        refurbishable: true,
        tags: b.tags,
        specs: sorted,
      };
      if (price !== null) p.msrp = price;
      out.push(p);
    }
  }
  return out;
}

const EXISTING = new Set([
  'tablet-apple-ipad-pro-11-m2-128go-wifi', 'tablet-apple-ipad-pro-12-9-m2-128go-wifi',
  'tablet-apple-ipad-pro-11-m4-256go-wifi', 'tablet-apple-ipad-pro-13-m4-256go-wifi',
]);

const T = ['creation', 'pro', 'mobile'];
const TI = ['creation', 'pro', 'ia'];

const ALL: CatalogProduct[] = [
  // ─── iPad Pro 9,7 / 10,5 / 12,9 (A9X, A10X) ───────────────────────────────
  ...ipad({ id: 'tablet-apple-ipad-pro-9-7', name: 'Apple iPad Pro 9,7 pouces', family: 'iPad Pro', year: 2016, tags: T, wifi: 'Wi-Fi 5', cell: 'Wi-Fi 5 + 4G',
    specs: { 'Écran': '9,7 pouces Retina, True Tone', 'Définition': '2048 x 1536', 'Processeur': 'Apple A9X', 'RAM': '2 Go', 'Batterie': '27,5 Wh', 'Stylet': 'Apple Pencil (1re génération)', 'Système': 'iPadOS', 'Poids': '437 g' } },
    [['32 Go', 689, 839], ['128 Go', 869, 1019], ['256 Go', 1049, 1199]]),
  ...ipad({ id: 'tablet-apple-ipad-pro-12-9-1', name: 'Apple iPad Pro 12,9 pouces (1re génération)', family: 'iPad Pro', year: 2015, tags: T, wifi: 'Wi-Fi 5', cell: 'Wi-Fi 5 + 4G',
    specs: { 'Écran': '12,9 pouces Retina', 'Définition': '2732 x 2048', 'Processeur': 'Apple A9X', 'RAM': '4 Go', 'Batterie': '38,5 Wh', 'Stylet': 'Apple Pencil (1re génération)', 'Système': 'iPadOS', 'Poids': '713 g' } },
    [['32 Go', 919, false], ['128 Go', 1099, 1249], ['256 Go', null, null]]),
  ...ipad({ id: 'tablet-apple-ipad-pro-10-5', name: 'Apple iPad Pro 10,5 pouces', family: 'iPad Pro', year: 2017, tags: T, wifi: 'Wi-Fi 5', cell: 'Wi-Fi 5 + 4G',
    specs: { 'Écran': '10,5 pouces Retina, 120 Hz ProMotion', 'Définition': '2224 x 1668', 'Processeur': 'Apple A10X Fusion', 'RAM': '4 Go', 'Batterie': '30,4 Wh', 'Stylet': 'Apple Pencil (1re génération)', 'Système': 'iPadOS', 'Poids': '469 g' } },
    [['64 Go', 729, 889], ['256 Go', 839, 999], ['512 Go', 1059, 1219]]),
  ...ipad({ id: 'tablet-apple-ipad-pro-12-9-2', name: 'Apple iPad Pro 12,9 pouces (2e génération)', family: 'iPad Pro', year: 2017, tags: T, wifi: 'Wi-Fi 5', cell: 'Wi-Fi 5 + 4G',
    specs: { 'Écran': '12,9 pouces Retina, 120 Hz ProMotion', 'Définition': '2732 x 2048', 'Processeur': 'Apple A10X Fusion', 'RAM': '4 Go', 'Batterie': '41 Wh', 'Stylet': 'Apple Pencil (1re génération)', 'Système': 'iPadOS', 'Poids': '677 g' } },
    [['64 Go', 889, 1049], ['256 Go', 999, 1159], ['512 Go', 1219, 1379]]),

  // ─── iPad Pro 2018 (A12X) ─────────────────────────────────────────────────
  ...ipad({ id: 'tablet-apple-ipad-pro-11-2018', name: 'Apple iPad Pro 11 pouces (1re génération, 2018)', family: 'iPad Pro', year: 2018, tags: T, wifi: 'Wi-Fi 5', cell: 'Wi-Fi 5 + 4G',
    specs: { 'Écran': '11 pouces Liquid Retina, 120 Hz ProMotion', 'Définition': '2388 x 1668', 'Processeur': 'Apple A12X Bionic', 'RAM': '4 Go', 'Batterie': '29,37 Wh', 'Stylet': 'Apple Pencil (2e génération)', 'Système': 'iPadOS', 'Poids': '468 g' } },
    [['64 Go', 899, 1069], ['256 Go', 1069, 1239], ['512 Go', 1289, 1459], ['1 To', 1729, 1899, '6 Go']]),
  ...ipad({ id: 'tablet-apple-ipad-pro-12-9-3', name: 'Apple iPad Pro 12,9 pouces (3e génération, 2018)', family: 'iPad Pro', year: 2018, tags: T, wifi: 'Wi-Fi 5', cell: 'Wi-Fi 5 + 4G',
    specs: { 'Écran': '12,9 pouces Liquid Retina, 120 Hz ProMotion', 'Définition': '2732 x 2048', 'Processeur': 'Apple A12X Bionic', 'RAM': '4 Go', 'Batterie': '36,71 Wh', 'Stylet': 'Apple Pencil (2e génération)', 'Système': 'iPadOS', 'Poids': '631 g' } },
    [['64 Go', 1119, 1289], ['256 Go', 1289, 1459], ['512 Go', 1509, 1679], ['1 To', 1949, 2119, '6 Go']]),

  // ─── iPad Pro 2020 (A12Z) ─────────────────────────────────────────────────
  ...ipad({ id: 'tablet-apple-ipad-pro-11-2020', name: 'Apple iPad Pro 11 pouces (2e génération, 2020)', family: 'iPad Pro', year: 2020, tags: T, wifi: 'Wi-Fi 6', cell: 'Wi-Fi 6 + 4G',
    specs: { 'Écran': '11 pouces Liquid Retina, 120 Hz ProMotion', 'Définition': '2388 x 1668', 'Processeur': 'Apple A12Z Bionic', 'RAM': '6 Go', 'Batterie': '28,65 Wh', 'Stylet': 'Apple Pencil (2e génération)', 'Système': 'iPadOS', 'Poids': '471 g' } },
    [['128 Go', 899, 1069], ['256 Go', 1009, 1179], ['512 Go', 1229, 1399], ['1 To', 1449, 1619]]),
  ...ipad({ id: 'tablet-apple-ipad-pro-12-9-4', name: 'Apple iPad Pro 12,9 pouces (4e génération, 2020)', family: 'iPad Pro', year: 2020, tags: T, wifi: 'Wi-Fi 6', cell: 'Wi-Fi 6 + 4G',
    specs: { 'Écran': '12,9 pouces Liquid Retina, 120 Hz ProMotion', 'Définition': '2732 x 2048', 'Processeur': 'Apple A12Z Bionic', 'RAM': '6 Go', 'Batterie': '36,71 Wh', 'Stylet': 'Apple Pencil (2e génération)', 'Système': 'iPadOS', 'Poids': '641 g' } },
    [['128 Go', 1119, 1289], ['256 Go', 1229, 1399], ['512 Go', 1449, 1619], ['1 To', 1669, 1839]]),

  // ─── iPad Pro M1 (2021) ───────────────────────────────────────────────────
  ...ipad({ id: 'tablet-apple-ipad-pro-11-m1', name: 'Apple iPad Pro 11 pouces M1 (3e génération)', family: 'iPad Pro', year: 2021, tags: TI, wifi: 'Wi-Fi 6', cell: 'Wi-Fi 6 + 5G',
    specs: { 'Écran': '11 pouces Liquid Retina, 120 Hz ProMotion', 'Définition': '2388 x 1668', 'Processeur': 'Apple M1', 'RAM': '8 Go', 'Batterie': '28,65 Wh', 'Stylet': 'Apple Pencil (2e génération)', 'Système': 'iPadOS', 'Poids': '466 g' } },
    [['128 Go', 899, 1069], ['256 Go', 1009, 1179], ['512 Go', 1229, 1399], ['1 To', 1669, 1839, '16 Go'], ['2 To', 2109, 2279, '16 Go']]),
  ...ipad({ id: 'tablet-apple-ipad-pro-12-9-m1', name: 'Apple iPad Pro 12,9 pouces M1 (5e génération)', family: 'iPad Pro', year: 2021, tags: TI, wifi: 'Wi-Fi 6', cell: 'Wi-Fi 6 + 5G',
    specs: { 'Écran': '12,9 pouces Liquid Retina XDR mini-LED, 120 Hz ProMotion', 'Définition': '2732 x 2048', 'Processeur': 'Apple M1', 'RAM': '8 Go', 'Batterie': '40,88 Wh', 'Stylet': 'Apple Pencil (2e génération)', 'Système': 'iPadOS', 'Poids': '682 g' } },
    [['128 Go', 1219, 1389], ['256 Go', 1329, 1499], ['512 Go', 1549, 1719], ['1 To', 1989, 2159, '16 Go'], ['2 To', 2429, 2599, '16 Go']]),

  // ─── iPad Pro M2 (2022) ───────────────────────────────────────────────────
  ...ipad({ id: 'tablet-apple-ipad-pro-11-m2', name: 'Apple iPad Pro 11 pouces M2', family: 'iPad Pro', year: 2022, tags: TI, wifi: 'Wi-Fi 6E', cell: 'Wi-Fi 6E + 5G',
    specs: { 'Écran': '11 pouces Liquid Retina, 120 Hz ProMotion', 'Définition': '2388 x 1668', 'Processeur': 'Apple M2', 'RAM': '8 Go', 'Batterie': '28,65 Wh', 'Stylet': 'Apple Pencil (2e génération, survol)', 'Système': 'iPadOS', 'Poids': '466 g' } },
    [['128 Go', 1069, 1269], ['256 Go', 1209, 1409], ['512 Go', 1479, 1679], ['1 To', 2019, 2219, '16 Go'], ['2 To', 2559, 2759, '16 Go']]),
  ...ipad({ id: 'tablet-apple-ipad-pro-12-9-m2', name: 'Apple iPad Pro 12,9 pouces M2', family: 'iPad Pro', year: 2022, tags: TI, wifi: 'Wi-Fi 6E', cell: 'Wi-Fi 6E + 5G',
    specs: { 'Écran': '12,9 pouces Liquid Retina XDR mini-LED, 120 Hz ProMotion', 'Définition': '2732 x 2048', 'Processeur': 'Apple M2', 'RAM': '8 Go', 'Batterie': '40,88 Wh', 'Stylet': 'Apple Pencil (2e génération, survol)', 'Système': 'iPadOS', 'Poids': '682 g' } },
    [['128 Go', 1469, 1669], ['256 Go', 1609, 1809], ['512 Go', 1879, 2079], ['1 To', 2419, 2619, '16 Go'], ['2 To', 2959, 3159, '16 Go']]),

  // ─── iPad Pro M4 (2024) ───────────────────────────────────────────────────
  ...ipad({ id: 'tablet-apple-ipad-pro-11-m4', name: 'Apple iPad Pro 11 pouces M4', family: 'iPad Pro', year: 2024, tags: TI, wifi: 'Wi-Fi 6E', cell: 'Wi-Fi 6E + 5G',
    specs: { 'Écran': '11 pouces Ultra Retina XDR OLED Tandem, 120 Hz ProMotion', 'Définition': '2420 x 1668', 'Processeur': 'Apple M4', 'RAM': '8 Go', 'Batterie': '31,29 Wh', 'Stylet': 'Apple Pencil Pro / USB-C', 'Système': 'iPadOS', 'Poids': '444 g' } },
    [['256 Go', 1219, 1469], ['512 Go', 1469, 1719], ['1 To', 1949, 2199, '16 Go'], ['2 To', 2429, 2679, '16 Go']]),
  ...ipad({ id: 'tablet-apple-ipad-pro-13-m4', name: 'Apple iPad Pro 13 pouces M4', family: 'iPad Pro', year: 2024, tags: TI, wifi: 'Wi-Fi 6E', cell: 'Wi-Fi 6E + 5G',
    specs: { 'Écran': '13 pouces Ultra Retina XDR OLED Tandem, 120 Hz ProMotion', 'Définition': '2752 x 2064', 'Processeur': 'Apple M4', 'RAM': '8 Go', 'Batterie': '38,99 Wh', 'Stylet': 'Apple Pencil Pro / USB-C', 'Système': 'iPadOS', 'Poids': '579 g' } },
    [['256 Go', 1569, 1819], ['512 Go', 1819, 2069], ['1 To', 2299, 2549, '16 Go'], ['2 To', 2779, 3029, '16 Go']]),

  // ─── iPad Pro M5 (2025) ───────────────────────────────────────────────────
  ...ipad({ id: 'tablet-apple-ipad-pro-11-m5', name: 'Apple iPad Pro 11 pouces M5', family: 'iPad Pro', year: 2025, tags: TI, wifi: 'Wi-Fi 7', cell: 'Wi-Fi 7 + 5G',
    specs: { 'Écran': '11 pouces Ultra Retina XDR OLED Tandem, 120 Hz ProMotion', 'Définition': '2420 x 1668', 'Processeur': 'Apple M5', 'RAM': '12 Go', 'Batterie': '31,29 Wh', 'Stylet': 'Apple Pencil Pro / USB-C', 'Système': 'iPadOS', 'Poids': '444 g' } },
    [['256 Go', null, null], ['512 Go', null, null], ['1 To', null, null, '16 Go'], ['2 To', null, null, '16 Go']]),
  ...ipad({ id: 'tablet-apple-ipad-pro-13-m5', name: 'Apple iPad Pro 13 pouces M5', family: 'iPad Pro', year: 2025, tags: TI, wifi: 'Wi-Fi 7', cell: 'Wi-Fi 7 + 5G',
    specs: { 'Écran': '13 pouces Ultra Retina XDR OLED Tandem, 120 Hz ProMotion', 'Définition': '2752 x 2064', 'Processeur': 'Apple M5', 'RAM': '12 Go', 'Batterie': '38,99 Wh', 'Stylet': 'Apple Pencil Pro / USB-C', 'Système': 'iPadOS', 'Poids': '579 g' } },
    [['256 Go', null, null], ['512 Go', null, null], ['1 To', null, null, '16 Go'], ['2 To', null, null, '16 Go']]),
];

export const PRODUCTS: CatalogProduct[] = ALL.filter((p) => !EXISTING.has(p.id));
