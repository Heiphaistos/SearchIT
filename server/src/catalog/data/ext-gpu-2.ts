import type { CatalogProduct } from '../types.js';
import { series } from './ext-gpu-1.js';

/**
 * Extension du catalogue GPU (2/5) : cartes partenaires GeForce RTX 50 vendues en France
 * (ASUS, MSI, Gigabyte, Zotac, PNY, Palit, Gainward, Inno3D) et cartes Intel Arc
 * (ASRock, Sparkle, Acer).
 */
export const PRODUCTS: CatalogProduct[] = [
  // ─── GeForce RTX 50 ───────────────────────────────────────────────────────
  ...series('ASUS', 'ROG Astral {gpu} OC', ['rtx5090', 'rtx5080']),
  ...series('ASUS', 'TUF Gaming {gpu} OC', ['rtx5090', 'rtx5080', 'rtx5070ti', 'rtx5070']),
  ...series('ASUS', 'Prime {gpu} OC', ['rtx5070ti', 'rtx5070', 'rtx5060ti-16']),
  ...series('ASUS', 'Dual {gpu} OC', ['rtx5060ti-16', 'rtx5060ti-8', 'rtx5060']),
  ...series('MSI', '{gpu} Suprim Liquid SOC', ['rtx5090']),
  ...series('MSI', '{gpu} Suprim SOC', ['rtx5080']),
  ...series('MSI', '{gpu} Gaming Trio OC', ['rtx5090', 'rtx5080', 'rtx5070ti', 'rtx5070']),
  ...series('MSI', '{gpu} Ventus 3X OC', ['rtx5080', 'rtx5070ti']),
  ...series('MSI', '{gpu} Ventus 2X OC', ['rtx5070', 'rtx5060ti-16', 'rtx5060ti-8', 'rtx5060', 'rtx5050']),
  ...series('Gigabyte', 'Aorus {gpu} Master', ['rtx5090', 'rtx5080']),
  ...series('Gigabyte', '{gpu} Gaming OC', ['rtx5090', 'rtx5080', 'rtx5070ti', 'rtx5070', 'rtx5060ti-16']),
  ...series('Gigabyte', '{gpu} Windforce OC SFF', ['rtx5080', 'rtx5070ti', 'rtx5070', 'rtx5060ti-16', 'rtx5060']),
  ...series('Gigabyte', '{gpu} Eagle OC', ['rtx5070ti', 'rtx5070']),
  ...series('Zotac', 'Gaming {gpu} AMP Extreme Infinity', ['rtx5090']),
  ...series('Zotac', 'Gaming {gpu} Solid OC', ['rtx5080']),
  ...series('Zotac', 'Gaming {gpu} Solid', ['rtx5070ti']),
  ...series('Zotac', 'Gaming {gpu} Twin Edge OC', ['rtx5070', 'rtx5060ti-16', 'rtx5060']),
  ...series('PNY', '{gpu} OC Triple Fan', ['rtx5080', 'rtx5070ti', 'rtx5070']),
  ...series('Palit', '{gpu} GameRock', ['rtx5080', 'rtx5070ti']),
  ...series('Palit', '{gpu} GamingPro', ['rtx5080', 'rtx5070ti']),
  ...series('Palit', '{gpu} Infinity 3', ['rtx5070']),
  ...series('Palit', '{gpu} Dual', ['rtx5060ti-16', 'rtx5060']),
  ...series('Gainward', '{gpu} Phantom GS', ['rtx5090']),
  ...series('Gainward', '{gpu} Python III', ['rtx5070ti', 'rtx5070']),
  ...series('Gainward', '{gpu} Ghost', ['rtx5060ti-16', 'rtx5060']),
  ...series('Inno3D', '{gpu} iChill X3', ['rtx5090', 'rtx5080']),
  ...series('Inno3D', '{gpu} X3', ['rtx5070ti']),
  ...series('Inno3D', '{gpu} Twin X2', ['rtx5070', 'rtx5060ti-16']),

  // ─── Intel Arc ────────────────────────────────────────────────────────────
  ...series('ASRock', '{gpu} Challenger OC', ['b580', 'b570', 'a580']),
  ...series('ASRock', '{gpu} Challenger D OC', ['a750']),
  ...series('ASRock', '{gpu} Steel Legend OC', ['b580']),
  ...series('ASRock', '{gpu} Phantom Gaming D OC', ['a770-16']),
  ...series('ASRock', '{gpu} Low Profile', ['a380', 'a310']),
  ...series('Sparkle', '{gpu} Titan OC', ['b580', 'a770-16']),
  ...series('Acer', 'Predator BiFrost {gpu} OC', ['a770-16']),
  ...series('Acer', 'Nitro {gpu} OC', ['b580']),
];
