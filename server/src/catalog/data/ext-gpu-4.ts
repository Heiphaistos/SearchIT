import type { CatalogProduct } from '../types.js';
import { series } from './ext-gpu-1.js';

/**
 * Extension du catalogue GPU (4/5) : cartes partenaires GeForce RTX 20, GTX 16, GeForce 10
 * et GTX 900, très recherchées sur le marché de l'occasion.
 */
export const PRODUCTS: CatalogProduct[] = [
  // ─── GeForce RTX 20 ───────────────────────────────────────────────────────
  ...series('ASUS', 'ROG Strix {gpu} OC', ['rtx2080ti', 'rtx2070s', 'rtx2060']),
  ...series('MSI', '{gpu} Gaming X Trio', ['rtx2080ti', 'rtx2080s', 'rtx2070s']),
  ...series('MSI', '{gpu} Ventus OC', ['rtx2060s', 'rtx2060']),
  ...series('Gigabyte', '{gpu} Gaming OC', ['rtx2080ti', 'rtx2070s', 'rtx2060s', 'rtx2060']),
  ...series('EVGA', '{gpu} XC Ultra Gaming', ['rtx2080ti', 'rtx2070s', 'rtx2060']),
  ...series('Zotac', 'Gaming {gpu} AMP', ['rtx2070s']),

  // ─── GeForce GTX 16 ───────────────────────────────────────────────────────
  ...series('ASUS', 'TUF Gaming {gpu} OC', ['gtx1660s', 'gtx1650']),
  ...series('ASUS', 'Dual {gpu} OC', ['gtx1660ti', 'gtx1660s']),
  ...series('MSI', '{gpu} Gaming X', ['gtx1660ti', 'gtx1660s', 'gtx1650s']),
  ...series('MSI', '{gpu} Ventus XS OC', ['gtx1660s', 'gtx1660', 'gtx1650']),
  ...series('Gigabyte', '{gpu} Gaming OC', ['gtx1660ti', 'gtx1660s', 'gtx1650']),
  ...series('Gigabyte', '{gpu} OC', ['gtx1660s', 'gtx1650']),
  ...series('Zotac', 'Gaming {gpu} Twin Fan', ['gtx1660s']),
  ...series('Palit', '{gpu} StormX', ['gtx1650']),

  // ─── GeForce 10 ───────────────────────────────────────────────────────────
  ...series('ASUS', 'ROG Strix {gpu} OC', ['gtx1080ti', 'gtx1070', 'gtx1060-6']),
  ...series('ASUS', 'Dual {gpu} OC', ['gtx1060-6', 'gtx1050ti']),
  ...series('ASUS', 'Phoenix {gpu}', ['gtx1050ti']),
  ...series('MSI', '{gpu} Gaming X', ['gtx1080ti', 'gtx1080', 'gtx1070', 'gtx1060-6', 'gtx1050ti']),
  ...series('MSI', '{gpu} Armor OC', ['gtx1060-6']),
  ...series('MSI', '{gpu} Aero ITX OC', ['gtx1050ti']),
  ...series('MSI', '{gpu} LP OC', ['gt1030']),
  ...series('Gigabyte', 'Aorus {gpu}', ['gtx1080ti']),
  ...series('Gigabyte', '{gpu} G1 Gaming', ['gtx1070', 'gtx1060-6']),
  ...series('Gigabyte', '{gpu} Windforce OC', ['gtx1060-3', 'gtx1050ti']),
  ...series('Gigabyte', '{gpu} OC Low Profile', ['gtx1050ti']),
  ...series('Gigabyte', '{gpu} Low Profile', ['gt1030']),
  ...series('EVGA', '{gpu} FTW3 Gaming', ['gtx1080ti']),
  ...series('EVGA', '{gpu} SC Gaming', ['gtx1070', 'gtx1060-6', 'gtx1050ti']),
  ...series('Zotac', '{gpu} Mini', ['gtx1080ti', 'gtx1070', 'gtx1060-6', 'gtx1050ti']),
  ...series('Palit', '{gpu} KalmX', ['gtx1050ti']),

  // ─── GeForce GTX 900 ──────────────────────────────────────────────────────
  ...series('MSI', '{gpu} Gaming', ['gtx980ti', 'gtx970', 'gtx960-2']),
  ...series('ASUS', 'Strix {gpu}', ['gtx970']),
  ...series('Gigabyte', '{gpu} G1 Gaming', ['gtx970']),
  ...series('EVGA', '{gpu} SC Gaming ACX 2.0', ['gtx970']),
];
