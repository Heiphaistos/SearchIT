import type { CatalogProduct } from '../types.js';
import { series } from './ext-gpu-1.js';

/**
 * Extension du catalogue GPU (3/5) : cartes partenaires GeForce RTX 40 et RTX 30
 * (neuf et marché de l'occasion / reconditionné).
 */
export const PRODUCTS: CatalogProduct[] = [
  // ─── GeForce RTX 40 ───────────────────────────────────────────────────────
  ...series('ASUS', 'ROG Strix {gpu} OC', ['rtx4090', 'rtx4080s', 'rtx4070tis', 'rtx4070s']),
  ...series('ASUS', 'TUF Gaming {gpu} OC', ['rtx4090', 'rtx4080s', 'rtx4070tis', 'rtx4070ti', 'rtx4070s']),
  ...series('ASUS', 'Dual {gpu} OC', ['rtx4070s', 'rtx4070', 'rtx4060ti-16', 'rtx4060ti-8', 'rtx4060']),
  ...series('MSI', '{gpu} Suprim X', ['rtx4090', 'rtx4080s']),
  ...series('MSI', '{gpu} Gaming X Trio', ['rtx4090', 'rtx4080', 'rtx4070ti']),
  ...series('MSI', '{gpu} Gaming X Slim', ['rtx4080s', 'rtx4070tis', 'rtx4070s']),
  ...series('MSI', '{gpu} Ventus 3X OC', ['rtx4090', 'rtx4080s', 'rtx4070tis', 'rtx4070s']),
  ...series('MSI', '{gpu} Ventus 2X OC', ['rtx4070s', 'rtx4070', 'rtx4060ti-16', 'rtx4060ti-8', 'rtx4060']),
  ...series('MSI', '{gpu} Gaming X', ['rtx4060']),
  ...series('Gigabyte', 'Aorus {gpu} Master', ['rtx4090', 'rtx4080s']),
  ...series('Gigabyte', '{gpu} Gaming OC', ['rtx4090', 'rtx4080', 'rtx4080s', 'rtx4070tis', 'rtx4070ti', 'rtx4070s', 'rtx4070', 'rtx4060ti-8', 'rtx4060']),
  ...series('Gigabyte', '{gpu} Eagle OC', ['rtx4070s', 'rtx4060ti-8', 'rtx4060']),
  ...series('Gigabyte', '{gpu} Windforce OC', ['rtx4070tis', 'rtx4070s', 'rtx4070']),
  ...series('Gigabyte', '{gpu} Aero OC', ['rtx4060ti-16']),
  ...series('Zotac', 'Gaming {gpu} Trinity OC', ['rtx4090', 'rtx4070ti']),
  ...series('Zotac', 'Gaming {gpu} AMP Airo', ['rtx4070tis']),
  ...series('Zotac', 'Gaming {gpu} Twin Edge OC', ['rtx4070s', 'rtx4070', 'rtx4060ti-8', 'rtx4060']),
  ...series('PNY', '{gpu} Verto Dual Fan', ['rtx4070', 'rtx4060']),
  ...series('Palit', '{gpu} GameRock OC', ['rtx4090']),
  ...series('Palit', '{gpu} JetStream OC', ['rtx4070s']),
  ...series('Palit', '{gpu} Dual', ['rtx4070', 'rtx4060']),
  ...series('Gainward', '{gpu} Phantom GS', ['rtx4090']),
  ...series('Gainward', '{gpu} Ghost', ['rtx4070', 'rtx4060']),
  ...series('Inno3D', '{gpu} Twin X2 OC', ['rtx4070s', 'rtx4060']),

  // ─── GeForce RTX 30 ───────────────────────────────────────────────────────
  ...series('ASUS', 'ROG Strix {gpu} OC', ['rtx3090', 'rtx3080-10', 'rtx3070', 'rtx3060ti']),
  ...series('ASUS', 'TUF Gaming {gpu} OC', ['rtx3090', 'rtx3080ti', 'rtx3080-10', 'rtx3070', 'rtx3060ti', 'rtx3060-12']),
  ...series('ASUS', 'Dual {gpu} OC', ['rtx3060ti', 'rtx3060-12', 'rtx3050-8']),
  ...series('MSI', '{gpu} Suprim X', ['rtx3090', 'rtx3080-10']),
  ...series('MSI', '{gpu} Gaming X Trio', ['rtx3090', 'rtx3080ti', 'rtx3080-10', 'rtx3070']),
  ...series('MSI', '{gpu} Ventus 3X OC', ['rtx3080-10', 'rtx3070', 'rtx3060ti']),
  ...series('MSI', '{gpu} Ventus 2X OC', ['rtx3060ti', 'rtx3060-12', 'rtx3050-8']),
  ...series('Gigabyte', 'Aorus {gpu} Master', ['rtx3090', 'rtx3080-10']),
  ...series('Gigabyte', '{gpu} Gaming OC', ['rtx3090', 'rtx3080-10', 'rtx3070', 'rtx3060ti', 'rtx3060-12']),
  ...series('Gigabyte', '{gpu} Eagle OC', ['rtx3080-10', 'rtx3070', 'rtx3060ti', 'rtx3060-12', 'rtx3050-8']),
  ...series('Gigabyte', '{gpu} Vision OC', ['rtx3080-10']),
  ...series('Zotac', 'Gaming {gpu} Trinity', ['rtx3090', 'rtx3080-10']),
  ...series('Zotac', 'Gaming {gpu} Twin Edge OC', ['rtx3070', 'rtx3060ti', 'rtx3060-12']),
  ...series('EVGA', '{gpu} FTW3 Ultra Gaming', ['rtx3090', 'rtx3080-10']),
  ...series('EVGA', '{gpu} XC3 Ultra Gaming', ['rtx3080-10', 'rtx3070']),
  ...series('EVGA', '{gpu} XC Gaming', ['rtx3060-12']),
  ...series('Palit', '{gpu} GamingPro OC', ['rtx3080-10', 'rtx3070']),
  ...series('Palit', '{gpu} Dual OC', ['rtx3060-12']),
  ...series('Gainward', '{gpu} Phoenix GS', ['rtx3080-10']),
  ...series('Gainward', '{gpu} Ghost', ['rtx3060-12']),
  ...series('Inno3D', '{gpu} Twin X2 OC', ['rtx3060-12']),
];
