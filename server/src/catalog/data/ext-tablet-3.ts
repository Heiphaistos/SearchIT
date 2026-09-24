import type { CatalogProduct } from '../types.js';

/**
 * Catalogue étendu : tablettes Samsung Galaxy Tab (S, A, Active) — déclinaisons RAM / stockage / Wi-Fi / 4G / 5G.
 * Poids indiqué pour les modèles Wi-Fi uniquement ; clé omise quand la valeur n'est pas certaine.
 */

type Conn = 'wifi' | '4g' | '5g';
/** [RAM Go, stockage Go, connectivité, prix de lancement] */
type V = [number, number, Conn, number?];

interface Base {
  id: string;
  name: string;
  family: string;
  year: number;
  tags: string[];
  refurb?: boolean;
  wifi: string;
  specs: Record<string, string>;
}

const ORDER = ['Écran', 'Définition', 'Processeur', 'RAM', 'Stockage', 'Batterie', 'Stylet', 'Connectivité', 'Système', 'Poids'];

function gal(b: Base, variants: V[]): CatalogProduct[] {
  return variants.map(([ram, storage, conn, msrp]) => {
    const st = storage >= 1000 ? '1 To' : `${storage} Go`;
    const stId = storage >= 1000 ? '1to' : `${storage}go`;
    const specs: Record<string, string> = { ...b.specs, 'RAM': `${ram} Go`, 'Stockage': st, 'Connectivité': conn === 'wifi' ? b.wifi : `${b.wifi} + ${conn.toUpperCase()}` };
    if (conn !== 'wifi') delete specs['Poids'];
    const sorted: Record<string, string> = {};
    for (const k of ORDER) if (specs[k] !== undefined) sorted[k] = specs[k];
    const p: CatalogProduct = {
      id: `${b.id}-${ram}go-${stId}${conn === 'wifi' ? '' : `-${conn}`}`,
      category: 'tablet',
      brand: 'Samsung',
      name: `${b.name} ${ram} Go ${st} ${conn === 'wifi' ? 'Wi-Fi' : conn.toUpperCase()}`,
      family: b.family,
      year: b.year,
      refurbishable: b.refurb ?? true,
      tags: b.tags,
      specs: sorted,
    };
    if (msrp) p.msrp = msrp;
    return p;
  });
}

const A = 'Android';

export const PRODUCTS: CatalogProduct[] = [
  // ─── Galaxy Tab S (anciennes générations) ─────────────────────────────────
  ...gal({ id: 'tablet-samsung-galaxy-tab-s3', name: 'Samsung Galaxy Tab S3', family: 'Galaxy Tab S3', year: 2017, tags: ['mobile', 'creation'], wifi: 'Wi-Fi 5',
    specs: { 'Écran': '9,7 pouces Super AMOLED', 'Définition': '2048 x 1536', 'Processeur': 'Qualcomm Snapdragon 820', 'Batterie': '6000 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '429 g' } },
    [[4, 32, 'wifi', 679], [4, 32, '4g', 769]]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-s4', name: 'Samsung Galaxy Tab S4', family: 'Galaxy Tab S4', year: 2018, tags: ['mobile', 'creation'], wifi: 'Wi-Fi 5',
    specs: { 'Écran': '10,5 pouces Super AMOLED', 'Définition': '2560 x 1600', 'Processeur': 'Qualcomm Snapdragon 835', 'Batterie': '7300 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '482 g' } },
    [[4, 64, 'wifi', 699], [4, 64, '4g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-s5e', name: 'Samsung Galaxy Tab S5e', family: 'Galaxy Tab S5e', year: 2019, tags: ['mobile'], wifi: 'Wi-Fi 5',
    specs: { 'Écran': '10,5 pouces Super AMOLED', 'Définition': '2560 x 1600', 'Processeur': 'Qualcomm Snapdragon 670', 'Batterie': '7040 mAh', 'Stylet': 'Non', 'Système': A, 'Poids': '400 g' } },
    [[4, 64, 'wifi', 449], [4, 64, '4g'], [6, 128, 'wifi']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-s6', name: 'Samsung Galaxy Tab S6', family: 'Galaxy Tab S6', year: 2019, tags: ['mobile', 'creation'], wifi: 'Wi-Fi 5',
    specs: { 'Écran': '10,5 pouces Super AMOLED', 'Définition': '2560 x 1600', 'Processeur': 'Qualcomm Snapdragon 855', 'Batterie': '7040 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '420 g' } },
    [[6, 128, 'wifi', 699], [6, 128, '4g'], [8, 256, 'wifi'], [8, 256, '4g']]),

  // ─── Galaxy Tab S6 Lite ───────────────────────────────────────────────────
  ...gal({ id: 'tablet-samsung-galaxy-tab-s6-lite', name: 'Samsung Galaxy Tab S6 Lite', family: 'Galaxy Tab S6 Lite', year: 2020, tags: ['etudiant', 'mobile', 'budget'], wifi: 'Wi-Fi 5',
    specs: { 'Écran': '10,4 pouces TFT LCD', 'Définition': '2000 x 1200', 'Processeur': 'Samsung Exynos 9611', 'Batterie': '7040 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '465 g' } },
    [[4, 64, 'wifi'], [4, 64, '4g'], [4, 128, 'wifi'], [4, 128, '4g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-s6-lite-2022', name: 'Samsung Galaxy Tab S6 Lite (2022)', family: 'Galaxy Tab S6 Lite', year: 2022, tags: ['etudiant', 'mobile', 'budget'], wifi: 'Wi-Fi 5',
    specs: { 'Écran': '10,4 pouces TFT LCD', 'Définition': '2000 x 1200', 'Processeur': 'Qualcomm Snapdragon 720G', 'Batterie': '7040 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '465 g' } },
    [[4, 64, 'wifi'], [4, 64, '4g'], [4, 128, 'wifi'], [4, 128, '4g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-s6-lite-2024', name: 'Samsung Galaxy Tab S6 Lite (2024)', family: 'Galaxy Tab S6 Lite', year: 2024, tags: ['etudiant', 'mobile', 'budget'], wifi: 'Wi-Fi 5',
    specs: { 'Écran': '10,4 pouces TFT LCD', 'Définition': '2000 x 1200', 'Processeur': 'Samsung Exynos 1280', 'Batterie': '7040 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '465 g' } },
    [[4, 64, 'wifi'], [4, 64, '4g'], [4, 128, 'wifi'], [4, 128, '4g']]),

  // ─── Galaxy Tab S7 ────────────────────────────────────────────────────────
  ...gal({ id: 'tablet-samsung-galaxy-tab-s7', name: 'Samsung Galaxy Tab S7', family: 'Galaxy Tab S7', year: 2020, tags: ['mobile', 'creation'], wifi: 'Wi-Fi 6',
    specs: { 'Écran': '11 pouces LTPS LCD, 120 Hz', 'Définition': '2560 x 1600', 'Processeur': 'Qualcomm Snapdragon 865+', 'Batterie': '8000 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '498 g' } },
    [[6, 128, 'wifi', 699], [6, 128, '4g'], [8, 256, 'wifi'], [8, 256, '4g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-s7-plus', name: 'Samsung Galaxy Tab S7+', family: 'Galaxy Tab S7', year: 2020, tags: ['mobile', 'creation'], wifi: 'Wi-Fi 6',
    specs: { 'Écran': '12,4 pouces Super AMOLED, 120 Hz', 'Définition': '2800 x 1752', 'Processeur': 'Qualcomm Snapdragon 865+', 'Batterie': '10090 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '575 g' } },
    [[6, 128, 'wifi', 899], [6, 128, '5g'], [8, 256, 'wifi'], [8, 256, '5g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-s7-fe', name: 'Samsung Galaxy Tab S7 FE', family: 'Galaxy Tab S7', year: 2021, tags: ['mobile', 'etudiant'], wifi: 'Wi-Fi 5',
    specs: { 'Écran': '12,4 pouces TFT LCD', 'Définition': '2560 x 1600', 'Processeur': 'Qualcomm Snapdragon 750G', 'Batterie': '10090 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '608 g' } },
    [[4, 64, 'wifi'], [4, 64, '5g'], [6, 128, 'wifi'], [6, 128, '5g']]),

  // ─── Galaxy Tab S8 ────────────────────────────────────────────────────────
  ...gal({ id: 'tablet-samsung-galaxy-tab-s8', name: 'Samsung Galaxy Tab S8', family: 'Galaxy Tab S8', year: 2022, tags: ['mobile', 'creation'], wifi: 'Wi-Fi 6E',
    specs: { 'Écran': '11 pouces LTPS LCD, 120 Hz', 'Définition': '2560 x 1600', 'Processeur': 'Qualcomm Snapdragon 8 Gen 1', 'Batterie': '8000 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '503 g' } },
    [[8, 128, 'wifi'], [8, 128, '5g'], [8, 256, 'wifi'], [8, 256, '5g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-s8-plus', name: 'Samsung Galaxy Tab S8+', family: 'Galaxy Tab S8', year: 2022, tags: ['mobile', 'creation'], wifi: 'Wi-Fi 6E',
    specs: { 'Écran': '12,4 pouces Super AMOLED, 120 Hz', 'Définition': '2800 x 1752', 'Processeur': 'Qualcomm Snapdragon 8 Gen 1', 'Batterie': '10090 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '567 g' } },
    [[8, 128, 'wifi'], [8, 128, '5g'], [8, 256, 'wifi'], [8, 256, '5g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-s8-ultra', name: 'Samsung Galaxy Tab S8 Ultra', family: 'Galaxy Tab S8', year: 2022, tags: ['creation', 'pro'], wifi: 'Wi-Fi 6E',
    specs: { 'Écran': '14,6 pouces Super AMOLED, 120 Hz', 'Définition': '2960 x 1848', 'Processeur': 'Qualcomm Snapdragon 8 Gen 1', 'Batterie': '11200 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '726 g' } },
    [[8, 128, 'wifi'], [12, 256, 'wifi'], [16, 512, 'wifi']]),

  // ─── Galaxy Tab S9 ────────────────────────────────────────────────────────
  ...gal({ id: 'tablet-samsung-galaxy-tab-s9', name: 'Samsung Galaxy Tab S9', family: 'Galaxy Tab S9', year: 2023, tags: ['creation', 'mobile'], wifi: 'Wi-Fi 6E',
    specs: { 'Écran': '11 pouces Dynamic AMOLED 2X, 120 Hz', 'Définition': '2560 x 1600', 'Processeur': 'Qualcomm Snapdragon 8 Gen 2 for Galaxy', 'Batterie': '8400 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '498 g' } },
    [[12, 256, 'wifi'], [8, 128, '5g'], [12, 256, '5g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-s9-plus', name: 'Samsung Galaxy Tab S9+', family: 'Galaxy Tab S9', year: 2023, tags: ['creation', 'mobile'], wifi: 'Wi-Fi 6E',
    specs: { 'Écran': '12,4 pouces Dynamic AMOLED 2X, 120 Hz', 'Définition': '2800 x 1752', 'Processeur': 'Qualcomm Snapdragon 8 Gen 2 for Galaxy', 'Batterie': '10090 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '581 g' } },
    [[12, 512, 'wifi'], [12, 256, '5g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-s9-ultra', name: 'Samsung Galaxy Tab S9 Ultra', family: 'Galaxy Tab S9', year: 2023, tags: ['creation', 'pro'], wifi: 'Wi-Fi 6E',
    specs: { 'Écran': '14,6 pouces Dynamic AMOLED 2X, 120 Hz', 'Définition': '2960 x 1848', 'Processeur': 'Qualcomm Snapdragon 8 Gen 2 for Galaxy', 'Batterie': '11200 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '732 g' } },
    [[12, 512, 'wifi'], [16, 1000, 'wifi'], [12, 256, '5g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-s9-fe', name: 'Samsung Galaxy Tab S9 FE', family: 'Galaxy Tab S9', year: 2023, tags: ['etudiant', 'mobile'], wifi: 'Wi-Fi 6',
    specs: { 'Écran': '10,9 pouces LCD, 90 Hz', 'Définition': '2304 x 1440', 'Processeur': 'Samsung Exynos 1380', 'Batterie': '8000 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '523 g' } },
    [[8, 256, 'wifi'], [6, 128, '5g'], [8, 256, '5g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-s9-fe-plus', name: 'Samsung Galaxy Tab S9 FE+', family: 'Galaxy Tab S9', year: 2023, tags: ['etudiant', 'mobile'], wifi: 'Wi-Fi 6',
    specs: { 'Écran': '12,4 pouces LCD, 90 Hz', 'Définition': '2560 x 1600', 'Processeur': 'Samsung Exynos 1380', 'Batterie': '10090 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '627 g' } },
    [[12, 256, 'wifi'], [8, 128, '5g']]),

  // ─── Galaxy Tab S10 ───────────────────────────────────────────────────────
  ...gal({ id: 'tablet-samsung-galaxy-tab-s10-plus', name: 'Samsung Galaxy Tab S10+', family: 'Galaxy Tab S10', year: 2024, tags: ['creation', 'mobile', 'ia'], wifi: 'Wi-Fi 6E',
    specs: { 'Écran': '12,4 pouces Dynamic AMOLED 2X, 120 Hz', 'Définition': '2800 x 1752', 'Processeur': 'MediaTek Dimensity 9300+', 'Batterie': '10090 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '571 g' } },
    [[12, 512, 'wifi'], [12, 256, '5g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-s10-ultra', name: 'Samsung Galaxy Tab S10 Ultra', family: 'Galaxy Tab S10', year: 2024, tags: ['creation', 'pro', 'ia'], wifi: 'Wi-Fi 7',
    specs: { 'Écran': '14,6 pouces Dynamic AMOLED 2X, 120 Hz', 'Définition': '2960 x 1848', 'Processeur': 'MediaTek Dimensity 9300+', 'Batterie': '11200 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '718 g' } },
    [[12, 512, 'wifi'], [16, 1000, 'wifi'], [12, 256, '5g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-s10-fe', name: 'Samsung Galaxy Tab S10 FE', family: 'Galaxy Tab S10', year: 2025, refurb: false, tags: ['etudiant', 'mobile'], wifi: 'Wi-Fi 6',
    specs: { 'Écran': '10,9 pouces LCD, 90 Hz', 'Définition': '2304 x 1440', 'Processeur': 'Samsung Exynos 1580', 'Batterie': '8000 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '497 g' } },
    [[8, 256, 'wifi'], [8, 128, '5g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-s10-fe-plus', name: 'Samsung Galaxy Tab S10 FE+', family: 'Galaxy Tab S10', year: 2025, refurb: false, tags: ['etudiant', 'mobile'], wifi: 'Wi-Fi 6',
    specs: { 'Écran': '13,1 pouces LCD, 90 Hz', 'Définition': '2880 x 1800', 'Processeur': 'Samsung Exynos 1580', 'Batterie': '10090 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '664 g' } },
    [[8, 128, 'wifi'], [12, 256, 'wifi'], [8, 128, '5g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-s10-lite', name: 'Samsung Galaxy Tab S10 Lite', family: 'Galaxy Tab S10', year: 2025, refurb: false, tags: ['etudiant', 'mobile', 'budget'], wifi: 'Wi-Fi 6',
    specs: { 'Écran': '10,9 pouces LCD, 90 Hz', 'Définition': '2304 x 1440', 'Processeur': 'Samsung Exynos 1380', 'Batterie': '8000 mAh', 'Stylet': 'S Pen inclus', 'Système': A } },
    [[6, 128, 'wifi'], [8, 256, 'wifi'], [6, 128, '5g']]),

  // ─── Galaxy Tab S11 ───────────────────────────────────────────────────────
  ...gal({ id: 'tablet-samsung-galaxy-tab-s11', name: 'Samsung Galaxy Tab S11', family: 'Galaxy Tab S11', year: 2025, refurb: false, tags: ['creation', 'mobile', 'ia'], wifi: 'Wi-Fi',
    specs: { 'Écran': '11 pouces Dynamic AMOLED 2X, 120 Hz', 'Définition': '2560 x 1600', 'Processeur': 'MediaTek Dimensity 9400+', 'Batterie': '8400 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '469 g' } },
    [[12, 128, 'wifi'], [12, 256, 'wifi'], [12, 512, 'wifi']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-s11-ultra', name: 'Samsung Galaxy Tab S11 Ultra', family: 'Galaxy Tab S11', year: 2025, refurb: false, tags: ['creation', 'pro', 'ia'], wifi: 'Wi-Fi',
    specs: { 'Écran': '14,6 pouces Dynamic AMOLED 2X, 120 Hz', 'Définition': '2960 x 1848', 'Processeur': 'MediaTek Dimensity 9400+', 'Batterie': '11600 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '692 g' } },
    [[12, 256, 'wifi'], [12, 512, 'wifi'], [16, 1000, 'wifi']]),

  // ─── Galaxy Tab A ─────────────────────────────────────────────────────────
  ...gal({ id: 'tablet-samsung-galaxy-tab-a-10-1-2019', name: 'Samsung Galaxy Tab A 10.1 (2019)', family: 'Galaxy Tab A', year: 2019, tags: ['budget', 'mobile'], wifi: 'Wi-Fi 5',
    specs: { 'Écran': '10,1 pouces TFT LCD', 'Définition': '1920 x 1200', 'Processeur': 'Samsung Exynos 7904', 'Batterie': '6150 mAh', 'Stylet': 'Non', 'Système': A, 'Poids': '469 g' } },
    [[2, 32, 'wifi'], [2, 32, '4g'], [3, 64, 'wifi'], [3, 64, '4g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-a-8-0-2019', name: 'Samsung Galaxy Tab A 8.0 (2019)', family: 'Galaxy Tab A', year: 2019, tags: ['budget', 'mobile'], wifi: 'Wi-Fi',
    specs: { 'Écran': '8 pouces TFT LCD', 'Définition': '1280 x 800', 'Processeur': 'Qualcomm Snapdragon 429', 'Batterie': '5100 mAh', 'Stylet': 'Non', 'Système': A, 'Poids': '345 g' } },
    [[2, 32, 'wifi'], [2, 32, '4g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-a7', name: 'Samsung Galaxy Tab A7', family: 'Galaxy Tab A', year: 2020, tags: ['budget', 'mobile', 'etudiant'], wifi: 'Wi-Fi 5',
    specs: { 'Écran': '10,4 pouces TFT LCD', 'Définition': '2000 x 1200', 'Processeur': 'Qualcomm Snapdragon 662', 'Batterie': '7040 mAh', 'Stylet': 'Non', 'Système': A, 'Poids': '476 g' } },
    [[3, 32, 'wifi'], [3, 32, '4g'], [3, 64, 'wifi'], [3, 64, '4g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-a7-lite', name: 'Samsung Galaxy Tab A7 Lite', family: 'Galaxy Tab A', year: 2021, tags: ['budget', 'mobile'], wifi: 'Wi-Fi 5',
    specs: { 'Écran': '8,7 pouces TFT LCD', 'Définition': '1340 x 800', 'Processeur': 'MediaTek Helio P22T', 'Batterie': '5100 mAh', 'Stylet': 'Non', 'Système': A, 'Poids': '366 g' } },
    [[3, 32, 'wifi'], [3, 32, '4g'], [4, 64, 'wifi']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-a8', name: 'Samsung Galaxy Tab A8', family: 'Galaxy Tab A', year: 2022, tags: ['budget', 'mobile', 'etudiant'], wifi: 'Wi-Fi 5',
    specs: { 'Écran': '10,5 pouces TFT LCD', 'Définition': '1920 x 1200', 'Processeur': 'Unisoc T618', 'Batterie': '7040 mAh', 'Stylet': 'Non', 'Système': A, 'Poids': '508 g' } },
    [[3, 32, 'wifi'], [3, 32, '4g'], [4, 64, 'wifi'], [4, 64, '4g'], [4, 128, 'wifi']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-a9', name: 'Samsung Galaxy Tab A9', family: 'Galaxy Tab A', year: 2023, tags: ['budget', 'mobile'], wifi: 'Wi-Fi 5',
    specs: { 'Écran': '8,7 pouces LCD', 'Définition': '1340 x 800', 'Processeur': 'MediaTek Helio G99', 'Batterie': '5100 mAh', 'Stylet': 'Non', 'Système': A, 'Poids': '332 g' } },
    [[8, 128, 'wifi'], [4, 64, '4g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-a9-plus', name: 'Samsung Galaxy Tab A9+', family: 'Galaxy Tab A', year: 2023, tags: ['budget', 'mobile', 'etudiant'], wifi: 'Wi-Fi 5',
    specs: { 'Écran': '11 pouces LCD, 90 Hz', 'Définition': '1920 x 1200', 'Processeur': 'Qualcomm Snapdragon 695', 'Batterie': '7040 mAh', 'Stylet': 'Non', 'Système': A, 'Poids': '480 g' } },
    [[8, 128, 'wifi'], [4, 64, '5g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-a11', name: 'Samsung Galaxy Tab A11', family: 'Galaxy Tab A', year: 2025, refurb: false, tags: ['budget', 'mobile'], wifi: 'Wi-Fi 5',
    specs: { 'Écran': '8,7 pouces LCD, 90 Hz', 'Définition': '1340 x 800', 'Processeur': 'MediaTek Helio G99', 'Batterie': '5100 mAh', 'Stylet': 'Non', 'Système': A } },
    [[4, 64, 'wifi'], [8, 128, 'wifi']]),

  // ─── Galaxy Tab Active (durcies) ──────────────────────────────────────────
  ...gal({ id: 'tablet-samsung-galaxy-tab-active2', name: 'Samsung Galaxy Tab Active2', family: 'Galaxy Tab Active', year: 2017, tags: ['robuste', 'pro'], wifi: 'Wi-Fi 5',
    specs: { 'Écran': '8 pouces TFT LCD', 'Définition': '1280 x 800', 'Processeur': 'Samsung Exynos 7880', 'Batterie': '4450 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '415 g' } },
    [[3, 16, 'wifi'], [3, 16, '4g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-active3', name: 'Samsung Galaxy Tab Active3', family: 'Galaxy Tab Active', year: 2020, tags: ['robuste', 'pro'], wifi: 'Wi-Fi 6',
    specs: { 'Écran': '8 pouces TFT LCD', 'Définition': '1920 x 1200', 'Processeur': 'Samsung Exynos 9810', 'Batterie': '5050 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '426 g' } },
    [[4, 64, 'wifi'], [4, 64, '4g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-active4-pro', name: 'Samsung Galaxy Tab Active4 Pro', family: 'Galaxy Tab Active', year: 2022, tags: ['robuste', 'pro'], wifi: 'Wi-Fi 6',
    specs: { 'Écran': '10,1 pouces TFT LCD', 'Définition': '1920 x 1200', 'Processeur': 'Qualcomm Snapdragon 778G', 'Batterie': '7600 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '674 g' } },
    [[4, 64, 'wifi'], [6, 128, '5g']]),
  ...gal({ id: 'tablet-samsung-galaxy-tab-active5', name: 'Samsung Galaxy Tab Active5', family: 'Galaxy Tab Active', year: 2024, tags: ['robuste', 'pro'], wifi: 'Wi-Fi 6',
    specs: { 'Écran': '8 pouces TFT LCD', 'Définition': '1920 x 1200', 'Processeur': 'Samsung Exynos 1380', 'Batterie': '5050 mAh', 'Stylet': 'S Pen inclus', 'Système': A, 'Poids': '433 g' } },
    [[6, 128, 'wifi'], [6, 128, '5g']]),
];
