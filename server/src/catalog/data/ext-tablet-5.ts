import type { CatalogProduct } from '../types.js';

/**
 * Catalogue étendu : tablettes Android Lenovo, Xiaomi / Redmi, Huawei, Honor, OnePlus, Realme et Nokia
 * (déclinaisons RAM / stockage, versions Wi-Fi). Clé omise quand la valeur n'est pas certaine.
 */

/** [RAM Go, stockage Go, prix de lancement] */
type V = [number, number, number?];

interface Base {
  brand: string;
  id: string;
  name: string;
  family: string;
  year: number;
  tags: string[];
  refurb?: boolean;
  specs: Record<string, string>;
}

const ORDER = ['Écran', 'Définition', 'Processeur', 'RAM', 'Stockage', 'Batterie', 'Stylet', 'Connectivité', 'Système', 'Poids'];

function tab(b: Base, variants: V[]): CatalogProduct[] {
  return variants.map(([ram, storage, msrp]) => {
    const specs: Record<string, string> = { ...b.specs, 'RAM': `${ram} Go`, 'Stockage': `${storage} Go` };
    const sorted: Record<string, string> = {};
    for (const k of ORDER) if (specs[k] !== undefined) sorted[k] = specs[k];
    const p: CatalogProduct = {
      id: `${b.id}-${ram}go-${storage}go`,
      category: 'tablet',
      brand: b.brand,
      name: `${b.name} ${ram} Go ${storage} Go`,
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
const BUD = ['budget', 'mobile', 'etudiant'];
const MID = ['mobile', 'etudiant'];

export const PRODUCTS: CatalogProduct[] = [
  // ─── Lenovo Tab M ─────────────────────────────────────────────────────────
  ...tab({ brand: 'Lenovo', id: 'tablet-lenovo-tab-m10-hd-gen-2', name: 'Lenovo Tab M10 HD (2e génération)', family: 'Lenovo Tab M', year: 2020, tags: BUD,
    specs: { 'Écran': '10,1 pouces IPS LCD', 'Définition': '1280 x 800', 'Processeur': 'MediaTek Helio P22T', 'Batterie': '5000 mAh', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi 5', 'Système': A, 'Poids': '420 g' } },
    [[2, 32], [4, 64]]),
  ...tab({ brand: 'Lenovo', id: 'tablet-lenovo-tab-m10-fhd-plus-gen-2', name: 'Lenovo Tab M10 FHD Plus (2e génération)', family: 'Lenovo Tab M', year: 2020, tags: BUD,
    specs: { 'Écran': '10,3 pouces IPS LCD', 'Définition': '1920 x 1200', 'Processeur': 'MediaTek Helio P22T', 'Batterie': '5000 mAh', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi 5', 'Système': A, 'Poids': '460 g' } },
    [[4, 64], [4, 128]]),
  ...tab({ brand: 'Lenovo', id: 'tablet-lenovo-tab-m10-plus-gen-3', name: 'Lenovo Tab M10 Plus (3e génération)', family: 'Lenovo Tab M', year: 2022, tags: BUD,
    specs: { 'Écran': '10,61 pouces IPS LCD', 'Définition': '2000 x 1200', 'Processeur': 'MediaTek Helio G80', 'Batterie': '7700 mAh', 'Connectivité': 'Wi-Fi 5', 'Système': A, 'Poids': '465 g' } },
    [[4, 64], [4, 128]]),
  ...tab({ brand: 'Lenovo', id: 'tablet-lenovo-tab-m10-gen-3', name: 'Lenovo Tab M10 (3e génération)', family: 'Lenovo Tab M', year: 2022, tags: BUD,
    specs: { 'Écran': '10,1 pouces IPS LCD', 'Définition': '1920 x 1200', 'Processeur': 'Unisoc T610', 'Batterie': '5100 mAh', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi 5', 'Système': A } },
    [[3, 32], [4, 64]]),
  ...tab({ brand: 'Lenovo', id: 'tablet-lenovo-tab-m8-gen-4', name: 'Lenovo Tab M8 (4e génération)', family: 'Lenovo Tab M', year: 2022, tags: ['budget', 'mobile'],
    specs: { 'Écran': '8 pouces IPS LCD', 'Définition': '1280 x 800', 'Processeur': 'MediaTek Helio A22', 'Batterie': '5100 mAh', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi 5', 'Système': A } },
    [[2, 32], [3, 32]]),
  ...tab({ brand: 'Lenovo', id: 'tablet-lenovo-tab-m9', name: 'Lenovo Tab M9', family: 'Lenovo Tab M', year: 2023, tags: ['budget', 'mobile'],
    specs: { 'Écran': '9 pouces IPS LCD', 'Définition': '1340 x 800', 'Processeur': 'MediaTek Helio G80', 'Batterie': '5100 mAh', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi 5', 'Système': A, 'Poids': '344 g' } },
    [[3, 32], [4, 64]]),
  ...tab({ brand: 'Lenovo', id: 'tablet-lenovo-tab-m11', name: 'Lenovo Tab M11', family: 'Lenovo Tab', year: 2024, tags: BUD,
    specs: { 'Écran': '11 pouces LCD, 90 Hz', 'Définition': '1920 x 1200', 'Processeur': 'MediaTek Helio G88', 'Batterie': '7040 mAh', 'Stylet': 'Lenovo Tab Pen', 'Système': A } },
    [[4, 64], [8, 128]]),

  // ─── Lenovo Tab P / Tab Plus / Idea Tab ───────────────────────────────────
  ...tab({ brand: 'Lenovo', id: 'tablet-lenovo-tab-p11', name: 'Lenovo Tab P11', family: 'Lenovo Tab P', year: 2020, tags: MID,
    specs: { 'Écran': '11 pouces IPS LCD', 'Définition': '2000 x 1200', 'Processeur': 'Qualcomm Snapdragon 662', 'Batterie': '7700 mAh', 'Stylet': 'Lenovo Precision Pen 2 (en option)', 'Connectivité': 'Wi-Fi 5', 'Système': A, 'Poids': '490 g' } },
    [[4, 64], [4, 128]]),
  ...tab({ brand: 'Lenovo', id: 'tablet-lenovo-tab-p11-plus', name: 'Lenovo Tab P11 Plus', family: 'Lenovo Tab P', year: 2021, tags: MID,
    specs: { 'Écran': '11 pouces IPS LCD', 'Définition': '2000 x 1200', 'Processeur': 'MediaTek Helio G90T', 'Batterie': '7700 mAh', 'Stylet': 'Lenovo Precision Pen 2 (en option)', 'Connectivité': 'Wi-Fi 5', 'Système': A, 'Poids': '490 g' } },
    [[4, 64], [6, 128]]),
  ...tab({ brand: 'Lenovo', id: 'tablet-lenovo-tab-p11-pro', name: 'Lenovo Tab P11 Pro', family: 'Lenovo Tab P', year: 2020, tags: ['mobile', 'creation'],
    specs: { 'Écran': '11,5 pouces OLED', 'Définition': '2560 x 1600', 'Processeur': 'Qualcomm Snapdragon 730G', 'Batterie': '8600 mAh', 'Stylet': 'Lenovo Precision Pen 2 (en option)', 'Connectivité': 'Wi-Fi 5', 'Système': A, 'Poids': '485 g' } },
    [[4, 128], [6, 128]]),
  ...tab({ brand: 'Lenovo', id: 'tablet-lenovo-tab-p11-gen-2', name: 'Lenovo Tab P11 (2e génération)', family: 'Lenovo Tab P', year: 2023, tags: MID,
    specs: { 'Écran': '11,5 pouces IPS LCD, 120 Hz', 'Définition': '2000 x 1200', 'Processeur': 'MediaTek Helio G99', 'Batterie': '7700 mAh', 'Stylet': 'Lenovo Precision Pen 2 (en option)', 'Connectivité': 'Wi-Fi 6', 'Système': A, 'Poids': '520 g' } },
    [[4, 128], [6, 128]]),
  ...tab({ brand: 'Lenovo', id: 'tablet-lenovo-tab-p11-pro-gen-2', name: 'Lenovo Tab P11 Pro (2e génération)', family: 'Lenovo Tab P', year: 2022, tags: ['mobile', 'creation'],
    specs: { 'Écran': '11,2 pouces OLED, 120 Hz', 'Définition': '2560 x 1536', 'Processeur': 'MediaTek Kompanio 1300T', 'Batterie': '8000 mAh', 'Stylet': 'Lenovo Precision Pen 3 (en option)', 'Connectivité': 'Wi-Fi 6', 'Système': A, 'Poids': '480 g' } },
    [[8, 256]]),
  ...tab({ brand: 'Lenovo', id: 'tablet-lenovo-tab-p12-pro', name: 'Lenovo Tab P12 Pro', family: 'Lenovo Tab P', year: 2021, tags: ['mobile', 'creation'],
    specs: { 'Écran': '12,6 pouces AMOLED, 120 Hz', 'Définition': '2560 x 1600', 'Processeur': 'Qualcomm Snapdragon 870', 'Batterie': '10200 mAh', 'Stylet': 'Lenovo Precision Pen 3 inclus', 'Connectivité': 'Wi-Fi 6', 'Système': A, 'Poids': '565 g' } },
    [[6, 128], [8, 256]]),
  ...tab({ brand: 'Lenovo', id: 'tablet-lenovo-tab-plus', name: 'Lenovo Tab Plus', family: 'Lenovo Tab', year: 2024, tags: MID,
    specs: { 'Écran': '11,5 pouces IPS LCD, 90 Hz', 'Définition': '2000 x 1200', 'Processeur': 'MediaTek Helio G99', 'Batterie': '8600 mAh', 'Connectivité': 'Wi-Fi 5', 'Système': A, 'Poids': '650 g' } },
    [[8, 128], [8, 256]]),
  ...tab({ brand: 'Lenovo', id: 'tablet-lenovo-idea-tab-pro', name: 'Lenovo Idea Tab Pro', family: 'Lenovo Idea Tab', year: 2024, tags: MID,
    specs: { 'Écran': '12,7 pouces LCD, 144 Hz', 'Définition': '2944 x 1840', 'Processeur': 'MediaTek Dimensity 8300', 'Batterie': '10200 mAh', 'Stylet': 'Lenovo Tab Pen Plus inclus', 'Système': A, 'Poids': '620 g' } },
    [[8, 128], [8, 256]]),

  // ─── Lenovo Yoga Tab ──────────────────────────────────────────────────────
  ...tab({ brand: 'Lenovo', id: 'tablet-lenovo-yoga-tab-11', name: 'Lenovo Yoga Tab 11', family: 'Yoga Tab', year: 2021, tags: ['mobile'],
    specs: { 'Écran': '11 pouces LCD', 'Définition': '2000 x 1200', 'Processeur': 'MediaTek Helio G90T', 'Batterie': '7500 mAh', 'Stylet': 'Lenovo Precision Pen 2 (en option)', 'Système': A, 'Poids': '650 g' } },
    [[8, 256]]),
  ...tab({ brand: 'Lenovo', id: 'tablet-lenovo-yoga-tab-13', name: 'Lenovo Yoga Tab 13', family: 'Yoga Tab', year: 2021, tags: ['mobile'],
    specs: { 'Écran': '13 pouces LTPS LCD', 'Définition': '2160 x 1350', 'Processeur': 'Qualcomm Snapdragon 870', 'Batterie': '10000 mAh', 'Connectivité': 'Wi-Fi 6', 'Système': A, 'Poids': '830 g' } },
    [[8, 128]]),
  ...tab({ brand: 'Lenovo', id: 'tablet-lenovo-yoga-tab-plus', name: 'Lenovo Yoga Tab Plus', family: 'Yoga Tab', year: 2024, tags: ['mobile', 'creation', 'ia'],
    specs: { 'Écran': '12,7 pouces LCD, 144 Hz', 'Définition': '2944 x 1840', 'Processeur': 'Qualcomm Snapdragon 8 Gen 3', 'Batterie': '10200 mAh', 'Stylet': 'Lenovo Tab Pen Pro inclus', 'Connectivité': 'Wi-Fi 7', 'Système': A, 'Poids': '640 g' } },
    [[16, 256]]),

  // ─── Xiaomi Pad ───────────────────────────────────────────────────────────
  ...tab({ brand: 'Xiaomi', id: 'tablet-xiaomi-pad-5', name: 'Xiaomi Pad 5', family: 'Xiaomi Pad', year: 2021, tags: MID,
    specs: { 'Écran': '11 pouces LCD, 120 Hz', 'Définition': '2560 x 1600', 'Processeur': 'Qualcomm Snapdragon 860', 'Batterie': '8720 mAh', 'Stylet': 'Xiaomi Smart Pen (en option)', 'Connectivité': 'Wi-Fi 5', 'Système': 'Android (MIUI for Pad)', 'Poids': '511 g' } },
    [[6, 128, 399], [6, 256, 449]]),
  ...tab({ brand: 'Xiaomi', id: 'tablet-xiaomi-pad-6', name: 'Xiaomi Pad 6', family: 'Xiaomi Pad', year: 2023, tags: MID,
    specs: { 'Écran': '11 pouces LCD, 144 Hz', 'Définition': '2880 x 1800', 'Processeur': 'Qualcomm Snapdragon 870', 'Batterie': '8840 mAh', 'Stylet': 'Xiaomi Smart Pen (en option)', 'Connectivité': 'Wi-Fi 6', 'Système': 'Android (MIUI Pad)', 'Poids': '490 g' } },
    [[8, 256, 449]]),
  ...tab({ brand: 'Xiaomi', id: 'tablet-xiaomi-pad-6s-pro-12-4', name: 'Xiaomi Pad 6S Pro 12.4', family: 'Xiaomi Pad', year: 2024, tags: ['mobile', 'creation'],
    specs: { 'Écran': '12,4 pouces LCD, 144 Hz', 'Définition': '3048 x 2032', 'Processeur': 'Qualcomm Snapdragon 8 Gen 2', 'Batterie': '10000 mAh', 'Stylet': 'Xiaomi Smart Pen 2 (en option)', 'Système': 'Android (HyperOS)', 'Poids': '590 g' } },
    [[8, 256, 699], [12, 512]]),
  ...tab({ brand: 'Xiaomi', id: 'tablet-xiaomi-pad-7', name: 'Xiaomi Pad 7', family: 'Xiaomi Pad', year: 2025, refurb: false, tags: MID,
    specs: { 'Écran': '11,2 pouces LCD, 144 Hz', 'Définition': '3200 x 2136', 'Processeur': 'Qualcomm Snapdragon 7+ Gen 3', 'Batterie': '8850 mAh', 'Stylet': 'Xiaomi Focus Pen (en option)', 'Système': 'Android (HyperOS)' } },
    [[8, 256]]),
  ...tab({ brand: 'Xiaomi', id: 'tablet-xiaomi-pad-7-pro', name: 'Xiaomi Pad 7 Pro', family: 'Xiaomi Pad', year: 2025, refurb: false, tags: ['mobile', 'creation'],
    specs: { 'Écran': '11,2 pouces LCD, 144 Hz', 'Définition': '3200 x 2136', 'Processeur': 'Qualcomm Snapdragon 8s Gen 3', 'Batterie': '8850 mAh', 'Stylet': 'Xiaomi Focus Pen (en option)', 'Système': 'Android (HyperOS)' } },
    [[8, 256]]),

  // ─── Redmi Pad ────────────────────────────────────────────────────────────
  ...tab({ brand: 'Xiaomi', id: 'tablet-xiaomi-redmi-pad', name: 'Xiaomi Redmi Pad', family: 'Redmi Pad', year: 2022, tags: BUD,
    specs: { 'Écran': '10,61 pouces LCD, 90 Hz', 'Définition': '2000 x 1200', 'Processeur': 'MediaTek Helio G99', 'Batterie': '8000 mAh', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi 5', 'Système': 'Android (MIUI Pad)', 'Poids': '465 g' } },
    [[3, 64], [4, 128]]),
  ...tab({ brand: 'Xiaomi', id: 'tablet-xiaomi-redmi-pad-se', name: 'Xiaomi Redmi Pad SE', family: 'Redmi Pad', year: 2023, tags: BUD,
    specs: { 'Écran': '11 pouces LCD, 90 Hz', 'Définition': '1920 x 1200', 'Processeur': 'Qualcomm Snapdragon 680', 'Batterie': '8000 mAh', 'Stylet': 'Non', 'Système': A, 'Poids': '478 g' } },
    [[6, 128], [8, 256]]),
  ...tab({ brand: 'Xiaomi', id: 'tablet-xiaomi-redmi-pad-se-8-7', name: 'Xiaomi Redmi Pad SE 8.7', family: 'Redmi Pad', year: 2024, tags: ['budget', 'mobile'],
    specs: { 'Écran': '8,7 pouces LCD, 90 Hz', 'Définition': '1340 x 800', 'Processeur': 'MediaTek Helio G85', 'Batterie': '6650 mAh', 'Stylet': 'Non', 'Système': A, 'Poids': '373 g' } },
    [[4, 64], [4, 128]]),
  ...tab({ brand: 'Xiaomi', id: 'tablet-xiaomi-redmi-pad-pro', name: 'Xiaomi Redmi Pad Pro', family: 'Redmi Pad', year: 2024, tags: BUD,
    specs: { 'Écran': '12,1 pouces LCD, 120 Hz', 'Définition': '2560 x 1600', 'Processeur': 'Qualcomm Snapdragon 7s Gen 2', 'Batterie': '10000 mAh', 'Système': A, 'Poids': '571 g' } },
    [[8, 256]]),
  ...tab({ brand: 'Xiaomi', id: 'tablet-xiaomi-redmi-pad-2', name: 'Xiaomi Redmi Pad 2', family: 'Redmi Pad', year: 2025, refurb: false, tags: BUD,
    specs: { 'Écran': '11 pouces LCD, 90 Hz', 'Définition': '2560 x 1600', 'Processeur': 'MediaTek Helio G100-Ultra', 'Batterie': '9000 mAh', 'Système': 'Android (HyperOS)' } },
    [[4, 128], [8, 256]]),

  // ─── Huawei MediaPad / MatePad ────────────────────────────────────────────
  ...tab({ brand: 'Huawei', id: 'tablet-huawei-mediapad-m5-10-8', name: 'Huawei MediaPad M5 10,8 pouces', family: 'MediaPad', year: 2018, tags: ['mobile'],
    specs: { 'Écran': '10,8 pouces IPS LCD', 'Définition': '2560 x 1600', 'Processeur': 'HiSilicon Kirin 960', 'Batterie': '7500 mAh', 'Connectivité': 'Wi-Fi 5', 'Système': 'Android', 'Poids': '498 g' } },
    [[4, 64]]),
  ...tab({ brand: 'Huawei', id: 'tablet-huawei-mediapad-m5-lite-10', name: 'Huawei MediaPad M5 lite 10', family: 'MediaPad', year: 2018, tags: ['budget', 'mobile'],
    specs: { 'Écran': '10,1 pouces IPS LCD', 'Définition': '1920 x 1200', 'Processeur': 'HiSilicon Kirin 659', 'Batterie': '7500 mAh', 'Système': 'Android' } },
    [[3, 32]]),
  ...tab({ brand: 'Huawei', id: 'tablet-huawei-mediapad-t5-10', name: 'Huawei MediaPad T5 10', family: 'MediaPad', year: 2018, tags: ['budget', 'mobile'],
    specs: { 'Écran': '10,1 pouces IPS LCD', 'Définition': '1920 x 1200', 'Processeur': 'HiSilicon Kirin 659', 'Stylet': 'Non', 'Système': 'Android' } },
    [[3, 32]]),
  ...tab({ brand: 'Huawei', id: 'tablet-huawei-matepad-10-4', name: 'Huawei MatePad 10,4 pouces', family: 'MatePad', year: 2020, tags: ['budget', 'mobile'],
    specs: { 'Écran': '10,4 pouces IPS LCD', 'Définition': '2000 x 1200', 'Processeur': 'HiSilicon Kirin 810', 'Batterie': '7250 mAh', 'Système': 'Android (EMUI, sans services Google)', 'Poids': '450 g' } },
    [[4, 64]]),
  ...tab({ brand: 'Huawei', id: 'tablet-huawei-matepad-pro-10-8', name: 'Huawei MatePad Pro 10,8 pouces', family: 'MatePad Pro', year: 2020, tags: ['mobile', 'creation'],
    specs: { 'Écran': '10,8 pouces IPS LCD', 'Définition': '2560 x 1600', 'Processeur': 'HiSilicon Kirin 990', 'Batterie': '7250 mAh', 'Stylet': 'Huawei M-Pencil (en option)', 'Système': 'Android (EMUI, sans services Google)', 'Poids': '460 g' } },
    [[6, 128]]),
  ...tab({ brand: 'Huawei', id: 'tablet-huawei-matepad-11-2021', name: 'Huawei MatePad 11 (2021)', family: 'MatePad', year: 2021, tags: MID,
    specs: { 'Écran': '10,95 pouces IPS LCD, 120 Hz', 'Définition': '2560 x 1600', 'Processeur': 'Qualcomm Snapdragon 865', 'Batterie': '7250 mAh', 'Stylet': 'Huawei M-Pencil (en option)', 'Connectivité': 'Wi-Fi 6', 'Système': 'HarmonyOS', 'Poids': '485 g' } },
    [[6, 128]]),
  ...tab({ brand: 'Huawei', id: 'tablet-huawei-matepad-pro-12-6', name: 'Huawei MatePad Pro 12,6 pouces', family: 'MatePad Pro', year: 2021, tags: ['mobile', 'creation'],
    specs: { 'Écran': '12,6 pouces OLED', 'Définition': '2560 x 1600', 'Processeur': 'HiSilicon Kirin 9000E', 'Batterie': '10050 mAh', 'Stylet': 'Huawei M-Pencil (en option)', 'Connectivité': 'Wi-Fi 6', 'Système': 'HarmonyOS', 'Poids': '609 g' } },
    [[8, 256]]),
  ...tab({ brand: 'Huawei', id: 'tablet-huawei-matepad-se-10-4', name: 'Huawei MatePad SE 10,4 pouces', family: 'MatePad', year: 2022, tags: ['budget', 'mobile'],
    specs: { 'Écran': '10,4 pouces IPS LCD', 'Définition': '2000 x 1200', 'Processeur': 'Qualcomm Snapdragon 680', 'Batterie': '5100 mAh', 'Stylet': 'Non', 'Système': 'HarmonyOS', 'Poids': '440 g' } },
    [[3, 32], [4, 64]]),
  ...tab({ brand: 'Huawei', id: 'tablet-huawei-matepad-11-5', name: 'Huawei MatePad 11,5 pouces', family: 'MatePad', year: 2023, tags: MID,
    specs: { 'Écran': '11,5 pouces IPS LCD, 120 Hz', 'Définition': '2200 x 1440', 'Processeur': 'Qualcomm Snapdragon 7 Gen 1', 'Batterie': '7700 mAh', 'Système': 'HarmonyOS', 'Poids': '499 g' } },
    [[6, 128]]),
  ...tab({ brand: 'Huawei', id: 'tablet-huawei-matepad-pro-13-2', name: 'Huawei MatePad Pro 13,2 pouces', family: 'MatePad Pro', year: 2023, tags: ['mobile', 'creation', 'pro'],
    specs: { 'Écran': '13,2 pouces OLED, 144 Hz', 'Définition': '2880 x 1920', 'Processeur': 'HiSilicon Kirin 9000S', 'Batterie': '10100 mAh', 'Stylet': 'Huawei M-Pencil (3e génération) inclus', 'Système': 'HarmonyOS', 'Poids': '580 g' } },
    [[12, 256]]),
  ...tab({ brand: 'Huawei', id: 'tablet-huawei-matepad-11-5-s', name: 'Huawei MatePad 11,5 S', family: 'MatePad', year: 2024, tags: MID,
    specs: { 'Écran': '11,5 pouces LCD PaperMatte, 144 Hz', 'Définition': '2800 x 1840', 'Processeur': 'HiSilicon Kirin 9000WL', 'Batterie': '8800 mAh', 'Système': 'HarmonyOS', 'Poids': '510 g' } },
    [[8, 256]]),

  // ─── Honor Pad ────────────────────────────────────────────────────────────
  ...tab({ brand: 'Honor', id: 'tablet-honor-pad-8', name: 'Honor Pad 8', family: 'Honor Pad', year: 2022, tags: BUD,
    specs: { 'Écran': '12 pouces IPS LCD', 'Définition': '2000 x 1200', 'Processeur': 'Qualcomm Snapdragon 680', 'Batterie': '7250 mAh', 'Stylet': 'Non', 'Système': 'Android (Magic UI)', 'Poids': '520 g' } },
    [[4, 128], [6, 128]]),
  ...tab({ brand: 'Honor', id: 'tablet-honor-pad-9', name: 'Honor Pad 9', family: 'Honor Pad', year: 2024, tags: MID,
    specs: { 'Écran': '12,1 pouces LCD, 120 Hz', 'Définition': '2560 x 1600', 'Processeur': 'Qualcomm Snapdragon 6 Gen 1', 'Batterie': '8300 mAh', 'Système': 'Android (MagicOS)', 'Poids': '555 g' } },
    [[8, 256]]),
  ...tab({ brand: 'Honor', id: 'tablet-honor-pad-x8', name: 'Honor Pad X8', family: 'Honor Pad', year: 2022, tags: ['budget', 'mobile'],
    specs: { 'Écran': '10,1 pouces IPS LCD', 'Définition': '1920 x 1200', 'Processeur': 'MediaTek Helio G80', 'Batterie': '5100 mAh', 'Stylet': 'Non', 'Système': 'Android (Magic UI)', 'Poids': '460 g' } },
    [[3, 32], [4, 64]]),
  ...tab({ brand: 'Honor', id: 'tablet-honor-pad-x9', name: 'Honor Pad X9', family: 'Honor Pad', year: 2023, tags: BUD,
    specs: { 'Écran': '11,5 pouces LCD, 120 Hz', 'Définition': '2000 x 1200', 'Processeur': 'Qualcomm Snapdragon 685', 'Batterie': '7250 mAh', 'Stylet': 'Non', 'Système': 'Android (MagicOS)', 'Poids': '495 g' } },
    [[4, 128]]),

  // ─── OnePlus Pad ──────────────────────────────────────────────────────────
  ...tab({ brand: 'OnePlus', id: 'tablet-oneplus-pad', name: 'OnePlus Pad', family: 'OnePlus Pad', year: 2023, tags: ['mobile'],
    specs: { 'Écran': '11,61 pouces LCD, 144 Hz', 'Définition': '2800 x 2000', 'Processeur': 'MediaTek Dimensity 9000', 'Batterie': '9510 mAh', 'Stylet': 'OnePlus Stylo (en option)', 'Système': 'Android (OxygenOS)', 'Poids': '552 g' } },
    [[12, 256, 549]]),
  ...tab({ brand: 'OnePlus', id: 'tablet-oneplus-pad-2', name: 'OnePlus Pad 2', family: 'OnePlus Pad', year: 2024, tags: ['mobile', 'creation'],
    specs: { 'Écran': '12,1 pouces LCD, 144 Hz', 'Définition': '3000 x 2120', 'Processeur': 'Qualcomm Snapdragon 8 Gen 3', 'Batterie': '9510 mAh', 'Stylet': 'OnePlus Stylo 2 (en option)', 'Système': 'Android (OxygenOS)', 'Poids': '584 g' } },
    [[8, 128]]),
  ...tab({ brand: 'OnePlus', id: 'tablet-oneplus-pad-go', name: 'OnePlus Pad Go', family: 'OnePlus Pad', year: 2023, tags: BUD,
    specs: { 'Écran': '11,35 pouces LCD, 90 Hz', 'Définition': '2408 x 1720', 'Processeur': 'MediaTek Helio G99', 'Batterie': '8000 mAh', 'Stylet': 'Non', 'Système': 'Android (OxygenOS)', 'Poids': '532 g' } },
    [[8, 128]]),
  ...tab({ brand: 'OnePlus', id: 'tablet-oneplus-pad-3', name: 'OnePlus Pad 3', family: 'OnePlus Pad', year: 2025, refurb: false, tags: ['mobile', 'creation', 'ia'],
    specs: { 'Écran': '13,2 pouces LCD, 144 Hz', 'Définition': '3392 x 2400', 'Processeur': 'Qualcomm Snapdragon 8 Elite', 'Batterie': '12140 mAh', 'Stylet': 'OnePlus Stylo 2 (en option)', 'Système': 'Android (OxygenOS)' } },
    [[12, 256]]),

  // ─── Realme Pad ───────────────────────────────────────────────────────────
  ...tab({ brand: 'Realme', id: 'tablet-realme-pad', name: 'Realme Pad', family: 'Realme Pad', year: 2021, tags: BUD,
    specs: { 'Écran': '10,4 pouces IPS LCD', 'Définition': '2000 x 1200', 'Processeur': 'MediaTek Helio G80', 'Batterie': '7100 mAh', 'Stylet': 'Non', 'Système': A, 'Poids': '440 g' } },
    [[3, 32], [4, 64]]),
  ...tab({ brand: 'Realme', id: 'tablet-realme-pad-mini', name: 'Realme Pad Mini', family: 'Realme Pad', year: 2022, tags: ['budget', 'mobile'],
    specs: { 'Écran': '8,7 pouces IPS LCD', 'Définition': '1340 x 800', 'Processeur': 'Unisoc T616', 'Batterie': '6400 mAh', 'Stylet': 'Non', 'Système': A, 'Poids': '372 g' } },
    [[3, 32], [4, 64]]),
  ...tab({ brand: 'Realme', id: 'tablet-realme-pad-2', name: 'Realme Pad 2', family: 'Realme Pad', year: 2023, tags: BUD,
    specs: { 'Écran': '11,5 pouces LCD, 120 Hz', 'Définition': '2000 x 1200', 'Processeur': 'MediaTek Helio G99', 'Batterie': '8360 mAh', 'Stylet': 'Non', 'Système': A, 'Poids': '518 g' } },
    [[6, 128], [8, 256]]),

  // ─── Nokia ────────────────────────────────────────────────────────────────
  ...tab({ brand: 'Nokia', id: 'tablet-nokia-t20', name: 'Nokia T20', family: 'Nokia T', year: 2021, tags: BUD,
    specs: { 'Écran': '10,4 pouces IPS LCD', 'Définition': '2000 x 1200', 'Processeur': 'Unisoc T610', 'Batterie': '8200 mAh', 'Stylet': 'Non', 'Système': A, 'Poids': '465 g' } },
    [[3, 32], [4, 64]]),
  ...tab({ brand: 'Nokia', id: 'tablet-nokia-t21', name: 'Nokia T21', family: 'Nokia T', year: 2022, tags: BUD,
    specs: { 'Écran': '10,36 pouces IPS LCD', 'Définition': '2000 x 1200', 'Processeur': 'Unisoc T612', 'Batterie': '8200 mAh', 'Stylet': 'Non', 'Système': A, 'Poids': '465 g' } },
    [[4, 64]]),
];
