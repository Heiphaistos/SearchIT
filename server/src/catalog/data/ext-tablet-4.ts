import type { CatalogProduct } from '../types.js';

/**
 * Catalogue étendu : tablettes Microsoft Surface Pro, Surface Pro X et Surface Go (configurations processeur / RAM / stockage).
 * Clé omise quand la valeur n'est pas certaine.
 */

/** [processeur (tel qu'affiché dans le nom), RAM Go, stockage Go, prix de lancement, LTE/5G] */
type V = [string, number, number, number?, string?];

interface Base {
  id: string;
  name: string;
  family: string;
  year: number;
  tags: string[];
  cpuPrefix: string;
  wifi: string;
  specs: Record<string, string>;
}

const ORDER = ['Écran', 'Définition', 'Processeur', 'RAM', 'Stockage', 'Batterie', 'Stylet', 'Connectivité', 'Système', 'Poids'];

function slug(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function surface(b: Base, variants: V[]): CatalogProduct[] {
  return variants.map(([cpu, ram, storage, msrp, cell]) => {
    const st = storage >= 1000 ? '1 To' : `${storage} Go`;
    const specs: Record<string, string> = {
      ...b.specs,
      'Processeur': `${b.cpuPrefix}${cpu}`,
      'RAM': `${ram} Go`,
      'Stockage': `${st} ${b.id.includes('surface-go') && !b.id.endsWith('go-4') && storage === 64 ? 'eMMC' : 'SSD'}`,
      'Connectivité': cell ? `${b.wifi} + ${cell}` : b.wifi,
    };
    const sorted: Record<string, string> = {};
    for (const k of ORDER) if (specs[k] !== undefined) sorted[k] = specs[k];
    const p: CatalogProduct = {
      id: `${b.id}-${slug(cpu)}-${ram}go-${storage >= 1000 ? '1to' : `${storage}go`}${cell ? `-${slug(cell)}` : ''}`,
      category: 'tablet',
      brand: 'Microsoft',
      name: `${b.name} ${cpu} ${ram} Go ${st}${cell ? ` ${cell}` : ''}`,
      family: b.family,
      year: b.year,
      refurbishable: true,
      tags: b.tags,
      specs: sorted,
    };
    if (msrp) p.msrp = msrp;
    return p;
  });
}

const PRO = ['pro', 'bureautique', 'mobile'];
const GO = ['bureautique', 'mobile', 'etudiant'];

export const PRODUCTS: CatalogProduct[] = [
  // ─── Surface Pro 3 / 4 ────────────────────────────────────────────────────
  ...surface({ id: 'tablet-microsoft-surface-pro-3', name: 'Microsoft Surface Pro 3', family: 'Surface Pro', year: 2014, tags: PRO, cpuPrefix: 'Intel ', wifi: 'Wi-Fi 5',
    specs: { 'Écran': '12 pouces ClearType Full HD+', 'Définition': '2160 x 1440', 'Batterie': '42 Wh', 'Stylet': 'Surface Pen inclus', 'Système': 'Windows 8.1 / Windows 10', 'Poids': '800 g' } },
    [['Core i3-4020Y', 4, 64, 819], ['Core i5-4300U', 4, 128, 999], ['Core i5-4300U', 8, 256, 1299], ['Core i7-4650U', 8, 256, 1599], ['Core i7-4650U', 8, 512, 1949]]),
  ...surface({ id: 'tablet-microsoft-surface-pro-4', name: 'Microsoft Surface Pro 4', family: 'Surface Pro', year: 2015, tags: PRO, cpuPrefix: 'Intel ', wifi: 'Wi-Fi 5',
    specs: { 'Écran': '12,3 pouces PixelSense', 'Définition': '2736 x 1824', 'Batterie': '38,2 Wh', 'Stylet': 'Surface Pen inclus', 'Système': 'Windows 10', 'Poids': '786 g' } },
    [['Core m3-6Y30', 4, 128, 999], ['Core i5-6300U', 4, 128, 1099], ['Core i5-6300U', 8, 256, 1399], ['Core i7-6650U', 8, 256, 1799], ['Core i7-6650U', 16, 256, 1999], ['Core i7-6650U', 16, 512, 2399]]),

  // ─── Surface Pro (2017) / Pro 6 / Pro 7 / Pro 7+ ──────────────────────────
  ...surface({ id: 'tablet-microsoft-surface-pro-2017', name: 'Microsoft Surface Pro (2017)', family: 'Surface Pro', year: 2017, tags: PRO, cpuPrefix: 'Intel ', wifi: 'Wi-Fi 5',
    specs: { 'Écran': '12,3 pouces PixelSense', 'Définition': '2736 x 1824', 'Batterie': '45 Wh', 'Stylet': 'Surface Pen (en option)', 'Système': 'Windows 10', 'Poids': '770 g' } },
    [['Core m3-7Y30', 4, 128, 949], ['Core i5-7300U', 4, 128, 1149], ['Core i5-7300U', 8, 256, 1449], ['Core i7-7660U', 8, 256, 1849], ['Core i7-7660U', 16, 512, 2449], ['Core i7-7660U', 16, 1000, 2999],
      ['Core i5-7300U', 4, 128, undefined, 'LTE'], ['Core i5-7300U', 8, 256, undefined, 'LTE']]),
  ...surface({ id: 'tablet-microsoft-surface-pro-6', name: 'Microsoft Surface Pro 6', family: 'Surface Pro', year: 2018, tags: PRO, cpuPrefix: 'Intel ', wifi: 'Wi-Fi 5',
    specs: { 'Écran': '12,3 pouces PixelSense', 'Définition': '2736 x 1824', 'Batterie': '45 Wh', 'Stylet': 'Surface Pen (en option)', 'Système': 'Windows 10', 'Poids': '775 g' } },
    [['Core i5-8250U', 8, 128, 1049], ['Core i5-8250U', 8, 256, 1349], ['Core i7-8650U', 8, 256, 1749], ['Core i7-8650U', 16, 512, 2249], ['Core i7-8650U', 16, 1000, 2749]]),
  ...surface({ id: 'tablet-microsoft-surface-pro-7', name: 'Microsoft Surface Pro 7', family: 'Surface Pro', year: 2019, tags: PRO, cpuPrefix: 'Intel ', wifi: 'Wi-Fi 6',
    specs: { 'Écran': '12,3 pouces PixelSense', 'Définition': '2736 x 1824', 'Batterie': '43,2 Wh', 'Stylet': 'Surface Pen (en option)', 'Système': 'Windows 10', 'Poids': '775 g' } },
    [['Core i3-1005G1', 4, 128, 899], ['Core i5-1035G4', 8, 128, 1099], ['Core i5-1035G4', 8, 256, 1349], ['Core i7-1065G7', 16, 256, 1649], ['Core i7-1065G7', 16, 512, 2099], ['Core i7-1065G7', 16, 1000, 2599]]),
  ...surface({ id: 'tablet-microsoft-surface-pro-7-plus', name: 'Microsoft Surface Pro 7+', family: 'Surface Pro', year: 2021, tags: PRO, cpuPrefix: 'Intel ', wifi: 'Wi-Fi 6',
    specs: { 'Écran': '12,3 pouces PixelSense', 'Définition': '2736 x 1824', 'Batterie': '50,4 Wh', 'Stylet': 'Surface Pen (en option)', 'Système': 'Windows 10 Pro', 'Poids': '770 g' } },
    [['Core i5-1135G7', 8, 128], ['Core i5-1135G7', 8, 256], ['Core i5-1135G7', 16, 256], ['Core i7-1165G7', 16, 256], ['Core i7-1165G7', 16, 512], ['Core i5-1135G7', 8, 256, undefined, 'LTE']]),

  // ─── Surface Pro 8 / 9 / 10 / 11 ──────────────────────────────────────────
  ...surface({ id: 'tablet-microsoft-surface-pro-8', name: 'Microsoft Surface Pro 8', family: 'Surface Pro', year: 2021, tags: PRO, cpuPrefix: 'Intel ', wifi: 'Wi-Fi 6',
    specs: { 'Écran': '13 pouces PixelSense Flow, 120 Hz', 'Définition': '2880 x 1920', 'Batterie': '51,5 Wh', 'Stylet': 'Surface Slim Pen 2 (en option)', 'Système': 'Windows 11', 'Poids': '891 g' } },
    [['Core i5-1135G7', 8, 128, 1179], ['Core i5-1135G7', 8, 256, 1399], ['Core i5-1135G7', 16, 256], ['Core i7-1185G7', 16, 256], ['Core i7-1185G7', 16, 512], ['Core i7-1185G7', 16, 1000], ['Core i7-1185G7', 32, 1000]]),
  ...surface({ id: 'tablet-microsoft-surface-pro-9', name: 'Microsoft Surface Pro 9', family: 'Surface Pro', year: 2022, tags: PRO, cpuPrefix: 'Intel ', wifi: 'Wi-Fi 6E',
    specs: { 'Écran': '13 pouces PixelSense Flow, 120 Hz', 'Définition': '2880 x 1920', 'Batterie': '47,7 Wh', 'Stylet': 'Surface Slim Pen 2 (en option)', 'Système': 'Windows 11', 'Poids': '879 g' } },
    [['Core i5-1235U', 8, 128], ['Core i5-1235U', 16, 256], ['Core i7-1255U', 16, 256], ['Core i7-1255U', 16, 512], ['Core i7-1255U', 32, 1000]]),
  ...surface({ id: 'tablet-microsoft-surface-pro-9-5g', name: 'Microsoft Surface Pro 9', family: 'Surface Pro', year: 2022, tags: PRO, cpuPrefix: 'Microsoft ', wifi: 'Wi-Fi 6E',
    specs: { 'Écran': '13 pouces PixelSense Flow, 120 Hz', 'Définition': '2880 x 1920', 'Batterie': '47,7 Wh', 'Stylet': 'Surface Slim Pen 2 (en option)', 'Système': 'Windows 11 (Arm)', 'Poids': '883 g' } },
    [['SQ3', 8, 128, undefined, '5G'], ['SQ3', 16, 256, undefined, '5G']]),
  ...surface({ id: 'tablet-microsoft-surface-pro-10', name: 'Microsoft Surface Pro 10', family: 'Surface Pro', year: 2024, tags: [...PRO, 'ia'], cpuPrefix: 'Intel ', wifi: 'Wi-Fi',
    specs: { 'Écran': '13 pouces PixelSense Flow, 120 Hz', 'Définition': '2880 x 1920', 'Stylet': 'Surface Slim Pen 2 (en option)', 'Système': 'Windows 11 Pro' } },
    [['Core Ultra 5 135U', 8, 256], ['Core Ultra 5 135U', 16, 512], ['Core Ultra 7 165U', 16, 512], ['Core Ultra 7 165U', 32, 1000]]),
  ...surface({ id: 'tablet-microsoft-surface-pro-11', name: 'Microsoft Surface Pro 11', family: 'Surface Pro', year: 2024, tags: [...PRO, 'ia'], cpuPrefix: 'Qualcomm ', wifi: 'Wi-Fi 7',
    specs: { 'Écran': '13 pouces PixelSense Flow, 120 Hz', 'Définition': '2880 x 1920', 'Stylet': 'Surface Slim Pen (en option)', 'Système': 'Windows 11 (Arm)', 'Poids': '895 g' } },
    [['Snapdragon X Plus', 16, 512], ['Snapdragon X Elite', 16, 512], ['Snapdragon X Elite', 16, 1000], ['Snapdragon X Elite', 32, 1000]]),
  ...surface({ id: 'tablet-microsoft-surface-pro-12-pouces', name: 'Microsoft Surface Pro 12 pouces', family: 'Surface Pro', year: 2025, tags: [...PRO, 'ia'], cpuPrefix: 'Qualcomm ', wifi: 'Wi-Fi 7',
    specs: { 'Écran': '12 pouces PixelSense LCD, 90 Hz', 'Définition': '2196 x 1464', 'Stylet': 'Surface Pen (en option)', 'Système': 'Windows 11 (Arm)', 'Poids': '686 g' } },
    [['Snapdragon X Plus', 16, 256], ['Snapdragon X Plus', 16, 512]]),

  // ─── Surface Pro X ────────────────────────────────────────────────────────
  ...surface({ id: 'tablet-microsoft-surface-pro-x', name: 'Microsoft Surface Pro X', family: 'Surface Pro X', year: 2019, tags: PRO, cpuPrefix: 'Microsoft ', wifi: 'Wi-Fi 5',
    specs: { 'Écran': '13 pouces PixelSense', 'Définition': '2880 x 1920', 'Stylet': 'Surface Slim Pen (en option)', 'Système': 'Windows 10 (Arm)', 'Poids': '774 g' } },
    [['SQ1', 8, 128, 1149, 'LTE'], ['SQ1', 8, 256, 1399, 'LTE'], ['SQ1', 16, 256, 1649, 'LTE'], ['SQ1', 16, 512, 1999, 'LTE'], ['SQ2', 16, 256, undefined, 'LTE'], ['SQ2', 16, 512, undefined, 'LTE']]),

  // ─── Surface Go ───────────────────────────────────────────────────────────
  ...surface({ id: 'tablet-microsoft-surface-go', name: 'Microsoft Surface Go', family: 'Surface Go', year: 2018, tags: GO, cpuPrefix: 'Intel ', wifi: 'Wi-Fi 5',
    specs: { 'Écran': '10 pouces PixelSense', 'Définition': '1800 x 1200', 'Stylet': 'Surface Pen (en option)', 'Système': 'Windows 10 S', 'Poids': '522 g' } },
    [['Pentium Gold 4415Y', 4, 64, 449], ['Pentium Gold 4415Y', 8, 128, 599], ['Pentium Gold 4415Y', 8, 128, undefined, 'LTE']]),
  ...surface({ id: 'tablet-microsoft-surface-go-2', name: 'Microsoft Surface Go 2', family: 'Surface Go', year: 2020, tags: GO, cpuPrefix: 'Intel ', wifi: 'Wi-Fi 6',
    specs: { 'Écran': '10,5 pouces PixelSense', 'Définition': '1920 x 1280', 'Stylet': 'Surface Pen (en option)', 'Système': 'Windows 10 S', 'Poids': '544 g' } },
    [['Pentium Gold 4425Y', 4, 64, 449], ['Pentium Gold 4425Y', 8, 128, 629], ['Core m3-8100Y', 8, 128, 749], ['Core m3-8100Y', 8, 128, undefined, 'LTE']]),
  ...surface({ id: 'tablet-microsoft-surface-go-3', name: 'Microsoft Surface Go 3', family: 'Surface Go', year: 2021, tags: GO, cpuPrefix: 'Intel ', wifi: 'Wi-Fi 6',
    specs: { 'Écran': '10,5 pouces PixelSense', 'Définition': '1920 x 1280', 'Stylet': 'Surface Pen (en option)', 'Système': 'Windows 11 S', 'Poids': '544 g' } },
    [['Pentium Gold 6500Y', 4, 64, 459], ['Pentium Gold 6500Y', 8, 128, 629], ['Core i3-10100Y', 8, 128], ['Core i3-10100Y', 8, 128, undefined, 'LTE']]),
  ...surface({ id: 'tablet-microsoft-surface-go-4', name: 'Microsoft Surface Go 4', family: 'Surface Go', year: 2023, tags: [...GO, 'pro'], cpuPrefix: 'Intel ', wifi: 'Wi-Fi 6',
    specs: { 'Écran': '10,5 pouces PixelSense', 'Définition': '1920 x 1280', 'Stylet': 'Surface Pen (en option)', 'Système': 'Windows 11 Pro' } },
    [['N200', 8, 64], ['N200', 8, 128], ['N200', 8, 256]]),
];
