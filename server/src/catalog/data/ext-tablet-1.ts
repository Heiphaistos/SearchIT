import type { CatalogProduct } from '../types.js';

/**
 * Catalogue étendu : tablettes Apple iPad, iPad mini et iPad Air (déclinaisons stockage et Wi-Fi / Cellular).
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
  'tablet-apple-ipad-9-64go-wifi', 'tablet-apple-ipad-9-256go-wifi', 'tablet-apple-ipad-10-64go-wifi', 'tablet-apple-ipad-10-256go-wifi',
  'tablet-apple-ipad-a16-128go-wifi', 'tablet-apple-ipad-a16-256go-wifi', 'tablet-apple-ipad-mini-6-64go-wifi',
  'tablet-apple-ipad-mini-7-a17-pro-128go-wifi', 'tablet-apple-ipad-air-5-m1-64go-wifi', 'tablet-apple-ipad-air-11-m2-128go-wifi',
  'tablet-apple-ipad-air-13-m2-128go-wifi', 'tablet-apple-ipad-air-11-m3-128go-wifi', 'tablet-apple-ipad-air-13-m3-128go-wifi',
]);

const ALL: CatalogProduct[] = [
  // ─── iPad (gamme standard) ────────────────────────────────────────────────
  ...ipad({ id: 'tablet-apple-ipad-5', name: 'Apple iPad 9,7 pouces (5e génération)', family: 'iPad', year: 2017, tags: ['budget', 'etudiant', 'mobile'], wifi: 'Wi-Fi 5', cell: 'Wi-Fi 5 + 4G',
    specs: { 'Écran': '9,7 pouces Retina', 'Définition': '2048 x 1536', 'Processeur': 'Apple A9', 'RAM': '2 Go', 'Batterie': '32,4 Wh', 'Stylet': 'Non', 'Système': 'iPadOS', 'Poids': '469 g' } },
    [['32 Go', 409, 549], ['128 Go', 509, 649]]),
  ...ipad({ id: 'tablet-apple-ipad-6', name: 'Apple iPad 9,7 pouces (6e génération)', family: 'iPad', year: 2018, tags: ['budget', 'etudiant', 'mobile'], wifi: 'Wi-Fi 5', cell: 'Wi-Fi 5 + 4G',
    specs: { 'Écran': '9,7 pouces Retina', 'Définition': '2048 x 1536', 'Processeur': 'Apple A10 Fusion', 'RAM': '2 Go', 'Batterie': '32,4 Wh', 'Stylet': 'Apple Pencil (1re génération)', 'Système': 'iPadOS', 'Poids': '469 g' } },
    [['32 Go', 359, 499], ['128 Go', 449, 589]]),
  ...ipad({ id: 'tablet-apple-ipad-7', name: 'Apple iPad 10,2 pouces (7e génération)', family: 'iPad', year: 2019, tags: ['budget', 'etudiant', 'mobile'], wifi: 'Wi-Fi 5', cell: 'Wi-Fi 5 + 4G',
    specs: { 'Écran': '10,2 pouces Retina', 'Définition': '2160 x 1620', 'Processeur': 'Apple A10 Fusion', 'RAM': '3 Go', 'Batterie': '32,4 Wh', 'Stylet': 'Apple Pencil (1re génération)', 'Système': 'iPadOS', 'Poids': '483 g' } },
    [['32 Go', 389, 529], ['128 Go', 489, 629]]),
  ...ipad({ id: 'tablet-apple-ipad-8', name: 'Apple iPad 10,2 pouces (8e génération)', family: 'iPad', year: 2020, tags: ['budget', 'etudiant', 'mobile'], wifi: 'Wi-Fi 5', cell: 'Wi-Fi 5 + 4G',
    specs: { 'Écran': '10,2 pouces Retina', 'Définition': '2160 x 1620', 'Processeur': 'Apple A12 Bionic', 'RAM': '3 Go', 'Batterie': '32,4 Wh', 'Stylet': 'Apple Pencil (1re génération)', 'Système': 'iPadOS', 'Poids': '490 g' } },
    [['32 Go', 389, 529], ['128 Go', 489, 629]]),
  ...ipad({ id: 'tablet-apple-ipad-9', name: 'Apple iPad 10,2 pouces (9e génération)', family: 'iPad', year: 2021, tags: ['budget', 'etudiant', 'mobile'], wifi: 'Wi-Fi', cell: 'Wi-Fi + 4G',
    specs: { 'Écran': '10,2 pouces Retina', 'Définition': '2160 x 1620', 'Processeur': 'Apple A13 Bionic', 'RAM': '3 Go', 'Batterie': '32,4 Wh', 'Stylet': 'Apple Pencil (1re génération)', 'Système': 'iPadOS', 'Poids': '487 g' } },
    [['64 Go', 389, 529], ['256 Go', 559, 699]]),
  ...ipad({ id: 'tablet-apple-ipad-10', name: 'Apple iPad 10,9 pouces (10e génération)', family: 'iPad', year: 2022, tags: ['etudiant', 'mobile'], wifi: 'Wi-Fi 6', cell: 'Wi-Fi 6 + 5G',
    specs: { 'Écran': '10,9 pouces Liquid Retina', 'Définition': '2360 x 1640', 'Processeur': 'Apple A14 Bionic', 'RAM': '4 Go', 'Batterie': '28,6 Wh', 'Stylet': 'Apple Pencil (1re génération, USB-C)', 'Système': 'iPadOS', 'Poids': '477 g' } },
    [['64 Go', 589, 789], ['256 Go', 769, 969]]),
  ...ipad({ id: 'tablet-apple-ipad-a16', name: 'Apple iPad 11 pouces A16', family: 'iPad', year: 2025, tags: ['budget', 'etudiant', 'mobile'], wifi: 'Wi-Fi 6', cell: 'Wi-Fi 6 + 5G',
    specs: { 'Écran': '11 pouces Liquid Retina', 'Définition': '2360 x 1640', 'Processeur': 'Apple A16', 'RAM': '6 Go', 'Batterie': '28,93 Wh', 'Stylet': 'Apple Pencil (USB-C) / 1re génération', 'Système': 'iPadOS', 'Poids': '477 g' } },
    [['128 Go', 409, 579], ['256 Go', 539, 709], ['512 Go', 789, 959]]),

  // ─── iPad mini ────────────────────────────────────────────────────────────
  ...ipad({ id: 'tablet-apple-ipad-mini-4', name: 'Apple iPad mini 4', family: 'iPad mini', year: 2015, tags: ['mobile'], wifi: 'Wi-Fi 5', cell: 'Wi-Fi 5 + 4G',
    specs: { 'Écran': '7,9 pouces Retina', 'Définition': '2048 x 1536', 'Processeur': 'Apple A8', 'RAM': '2 Go', 'Batterie': '19,1 Wh', 'Stylet': 'Non', 'Système': 'iPadOS', 'Poids': '299 g' } },
    [['16 Go', 389, 519], ['32 Go', null, null], ['64 Go', 489, 619], ['128 Go', 589, 719]]),
  ...ipad({ id: 'tablet-apple-ipad-mini-5', name: 'Apple iPad mini (5e génération)', family: 'iPad mini', year: 2019, tags: ['mobile'], wifi: 'Wi-Fi 5', cell: 'Wi-Fi 5 + 4G',
    specs: { 'Écran': '7,9 pouces Retina, True Tone', 'Définition': '2048 x 1536', 'Processeur': 'Apple A12 Bionic', 'RAM': '3 Go', 'Batterie': '19,1 Wh', 'Stylet': 'Apple Pencil (1re génération)', 'Système': 'iPadOS', 'Poids': '300,5 g' } },
    [['64 Go', 459, 599], ['256 Go', 629, 769]]),
  ...ipad({ id: 'tablet-apple-ipad-mini-6', name: 'Apple iPad mini (6e génération)', family: 'iPad mini', year: 2021, tags: ['mobile'], wifi: 'Wi-Fi 6', cell: 'Wi-Fi 6 + 5G',
    specs: { 'Écran': '8,3 pouces Liquid Retina', 'Définition': '2266 x 1488', 'Processeur': 'Apple A15 Bionic', 'RAM': '4 Go', 'Batterie': '19,3 Wh', 'Stylet': 'Apple Pencil (2e génération)', 'Système': 'iPadOS', 'Poids': '293 g' } },
    [['64 Go', 559, 729], ['256 Go', 729, 899]]),
  ...ipad({ id: 'tablet-apple-ipad-mini-7-a17-pro', name: 'Apple iPad mini A17 Pro (7e génération)', family: 'iPad mini', year: 2024, tags: ['mobile', 'ia'], wifi: 'Wi-Fi 6E', cell: 'Wi-Fi 6E + 5G',
    specs: { 'Écran': '8,3 pouces Liquid Retina', 'Définition': '2266 x 1488', 'Processeur': 'Apple A17 Pro', 'RAM': '8 Go', 'Batterie': '19,3 Wh', 'Stylet': 'Apple Pencil Pro / USB-C', 'Système': 'iPadOS', 'Poids': '293 g' } },
    [['128 Go', 609, 779], ['256 Go', 739, 909], ['512 Go', 999, 1169]]),

  // ─── iPad Air ─────────────────────────────────────────────────────────────
  ...ipad({ id: 'tablet-apple-ipad-air-2', name: 'Apple iPad Air 2', family: 'iPad Air', year: 2014, tags: ['mobile'], wifi: 'Wi-Fi 5', cell: 'Wi-Fi 5 + 4G',
    specs: { 'Écran': '9,7 pouces Retina', 'Définition': '2048 x 1536', 'Processeur': 'Apple A8X', 'RAM': '2 Go', 'Batterie': '27,3 Wh', 'Stylet': 'Non', 'Système': 'iPadOS', 'Poids': '437 g' } },
    [['16 Go', 489, 609], ['32 Go', null, null], ['64 Go', 589, 709], ['128 Go', 689, 809]]),
  ...ipad({ id: 'tablet-apple-ipad-air-3', name: 'Apple iPad Air 10,5 pouces (3e génération)', family: 'iPad Air', year: 2019, tags: ['mobile', 'etudiant'], wifi: 'Wi-Fi 5', cell: 'Wi-Fi 5 + 4G',
    specs: { 'Écran': '10,5 pouces Retina, True Tone', 'Définition': '2224 x 1668', 'Processeur': 'Apple A12 Bionic', 'RAM': '3 Go', 'Batterie': '30,2 Wh', 'Stylet': 'Apple Pencil (1re génération)', 'Système': 'iPadOS', 'Poids': '456 g' } },
    [['64 Go', 549, 689], ['256 Go', 719, 859]]),
  ...ipad({ id: 'tablet-apple-ipad-air-4', name: 'Apple iPad Air (4e génération)', family: 'iPad Air', year: 2020, tags: ['mobile', 'etudiant', 'creation'], wifi: 'Wi-Fi 6', cell: 'Wi-Fi 6 + 4G',
    specs: { 'Écran': '10,9 pouces Liquid Retina', 'Définition': '2360 x 1640', 'Processeur': 'Apple A14 Bionic', 'RAM': '4 Go', 'Batterie': '28,6 Wh', 'Stylet': 'Apple Pencil (2e génération)', 'Système': 'iPadOS', 'Poids': '458 g' } },
    [['64 Go', 669, 809], ['256 Go', 839, 979]]),
  ...ipad({ id: 'tablet-apple-ipad-air-5-m1', name: 'Apple iPad Air (5e génération) M1', family: 'iPad Air', year: 2022, tags: ['mobile', 'etudiant', 'creation'], wifi: 'Wi-Fi 6', cell: 'Wi-Fi 6 + 5G',
    specs: { 'Écran': '10,9 pouces Liquid Retina', 'Définition': '2360 x 1640', 'Processeur': 'Apple M1', 'RAM': '8 Go', 'Batterie': '28,6 Wh', 'Stylet': 'Apple Pencil (2e génération)', 'Système': 'iPadOS', 'Poids': '461 g' } },
    [['64 Go', 699, 889], ['256 Go', 889, 1079]]),
  ...ipad({ id: 'tablet-apple-ipad-air-11-m2', name: 'Apple iPad Air 11 pouces M2', family: 'iPad Air', year: 2024, tags: ['mobile', 'creation', 'ia'], wifi: 'Wi-Fi 6E', cell: 'Wi-Fi 6E + 5G',
    specs: { 'Écran': '11 pouces Liquid Retina', 'Définition': '2360 x 1640', 'Processeur': 'Apple M2', 'RAM': '8 Go', 'Batterie': '28,93 Wh', 'Stylet': 'Apple Pencil Pro / USB-C', 'Système': 'iPadOS', 'Poids': '462 g' } },
    [['128 Go', 719, 889], ['256 Go', 849, 1019], ['512 Go', 1099, 1269], ['1 To', 1349, 1519]]),
  ...ipad({ id: 'tablet-apple-ipad-air-13-m2', name: 'Apple iPad Air 13 pouces M2', family: 'iPad Air', year: 2024, tags: ['mobile', 'creation', 'ia'], wifi: 'Wi-Fi 6E', cell: 'Wi-Fi 6E + 5G',
    specs: { 'Écran': '13 pouces Liquid Retina', 'Définition': '2732 x 2048', 'Processeur': 'Apple M2', 'RAM': '8 Go', 'Batterie': '36,59 Wh', 'Stylet': 'Apple Pencil Pro / USB-C', 'Système': 'iPadOS', 'Poids': '617 g' } },
    [['128 Go', 969, 1139], ['256 Go', 1099, 1269], ['512 Go', 1349, 1519], ['1 To', 1599, 1769]]),
  ...ipad({ id: 'tablet-apple-ipad-air-11-m3', name: 'Apple iPad Air 11 pouces M3', family: 'iPad Air', year: 2025, tags: ['mobile', 'creation', 'ia'], wifi: 'Wi-Fi 6E', cell: 'Wi-Fi 6E + 5G',
    specs: { 'Écran': '11 pouces Liquid Retina', 'Définition': '2360 x 1640', 'Processeur': 'Apple M3', 'RAM': '8 Go', 'Batterie': '28,93 Wh', 'Stylet': 'Apple Pencil Pro / USB-C', 'Système': 'iPadOS', 'Poids': '460 g' } },
    [['128 Go', 719, 889], ['256 Go', 849, 1019], ['512 Go', 1099, 1269], ['1 To', 1349, 1519]]),
  ...ipad({ id: 'tablet-apple-ipad-air-13-m3', name: 'Apple iPad Air 13 pouces M3', family: 'iPad Air', year: 2025, tags: ['mobile', 'creation', 'ia'], wifi: 'Wi-Fi 6E', cell: 'Wi-Fi 6E + 5G',
    specs: { 'Écran': '13 pouces Liquid Retina', 'Définition': '2732 x 2048', 'Processeur': 'Apple M3', 'RAM': '8 Go', 'Batterie': '36,59 Wh', 'Stylet': 'Apple Pencil Pro / USB-C', 'Système': 'iPadOS', 'Poids': '616 g' } },
    [['128 Go', 969, 1139], ['256 Go', 1099, 1269], ['512 Go', 1349, 1519], ['1 To', 1599, 1769]]),
];

export const PRODUCTS: CatalogProduct[] = ALL.filter((p) => !EXISTING.has(p.id));
