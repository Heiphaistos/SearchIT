import type { CatalogProduct } from '../types.js';

/**
 * Extension du catalogue GPU (1/5) : table des puces graphiques (partagée avec ext-gpu-2..5)
 * et cartes de référence manquantes (GeForce GTX 900/10/16, RTX 20, Radeon RX 400/500/Vega/5000,
 * Intel Arc, cartes pro et data center).
 */

export interface GpuChip {
  vendor: string;
  /** Libellé commercial sans le fabricant ni la VRAM : « GeForce RTX 4070 Super ». */
  label: string;
  family: string;
  year: number;
  vram: number;
  mem: string;
  bus: string;
  units: string;
  iface: string;
  boost?: string;
  tdp?: string;
  psu?: string;
  msrp?: number;
  tags: string[];
  refurb?: boolean;
  /** true : produire la carte de référence dans ce fichier (absente du catalogue de base). */
  ref?: boolean;
  /** Nom de la carte de référence si différent de « vendor label ». */
  refName?: string;
}

const cuda = (n: number) => `${n} cœurs CUDA`;
const cu = (n: number) => `${n} CU (${n * 64} processeurs de flux)`;
const xe = (n: number) => `${n} cœurs Xe`;
const xe2 = (n: number) => `${n} cœurs Xe2`;
const G = ['gaming'];
const GB = ['gaming', 'budget'];
const GI = ['gaming', 'ia'];
const GIC = ['gaming', 'ia', 'creation'];
const PRO = ['pro', 'creation'];
const PROIA = ['pro', 'creation', 'ia'];
const DC = ['ia', 'serveur', 'pro'];

export const CHIPS: Record<string, GpuChip> = {
  // ─── NVIDIA GeForce GTX 900 (Maxwell) ─────────────────────────────────────
  'gtx950': { vendor: 'NVIDIA', label: 'GeForce GTX 950', family: 'GeForce GTX 900', year: 2015, vram: 2, mem: 'GDDR5', bus: '128 bits', units: cuda(768), iface: 'PCIe 3.0 x16', boost: '1,19 GHz', tdp: '90 W', msrp: 169, tags: GB, refurb: true, ref: true },
  'gtx960-2': { vendor: 'NVIDIA', label: 'GeForce GTX 960', family: 'GeForce GTX 900', year: 2015, vram: 2, mem: 'GDDR5', bus: '128 bits', units: cuda(1024), iface: 'PCIe 3.0 x16', boost: '1,18 GHz', tdp: '120 W', msrp: 219, tags: GB, refurb: true, ref: true, refName: 'NVIDIA GeForce GTX 960 2 Go' },
  'gtx960-4': { vendor: 'NVIDIA', label: 'GeForce GTX 960', family: 'GeForce GTX 900', year: 2015, vram: 4, mem: 'GDDR5', bus: '128 bits', units: cuda(1024), iface: 'PCIe 3.0 x16', boost: '1,18 GHz', tdp: '120 W', tags: GB, refurb: true, ref: true, refName: 'NVIDIA GeForce GTX 960 4 Go' },
  'gtx970': { vendor: 'NVIDIA', label: 'GeForce GTX 970', family: 'GeForce GTX 900', year: 2014, vram: 4, mem: 'GDDR5', bus: '256 bits', units: cuda(1664), iface: 'PCIe 3.0 x16', boost: '1,18 GHz', tdp: '145 W', psu: '500 W', msrp: 349, tags: GB, refurb: true, ref: true },
  'gtx980': { vendor: 'NVIDIA', label: 'GeForce GTX 980', family: 'GeForce GTX 900', year: 2014, vram: 4, mem: 'GDDR5', bus: '256 bits', units: cuda(2048), iface: 'PCIe 3.0 x16', boost: '1,22 GHz', tdp: '165 W', psu: '500 W', msrp: 549, tags: G, refurb: true, ref: true },
  'gtx980ti': { vendor: 'NVIDIA', label: 'GeForce GTX 980 Ti', family: 'GeForce GTX 900', year: 2015, vram: 6, mem: 'GDDR5', bus: '384 bits', units: cuda(2816), iface: 'PCIe 3.0 x16', boost: '1,08 GHz', tdp: '250 W', psu: '600 W', msrp: 739, tags: G, refurb: true, ref: true },
  'titanx': { vendor: 'NVIDIA', label: 'GeForce GTX Titan X', family: 'GeForce GTX 900', year: 2015, vram: 12, mem: 'GDDR5', bus: '384 bits', units: cuda(3072), iface: 'PCIe 3.0 x16', boost: '1,08 GHz', tdp: '250 W', psu: '600 W', msrp: 1149, tags: ['gaming', 'creation'], refurb: true, ref: true },

  // ─── NVIDIA GeForce 10 (Pascal) ───────────────────────────────────────────
  'gt1030': { vendor: 'NVIDIA', label: 'GeForce GT 1030', family: 'GeForce 10', year: 2017, vram: 2, mem: 'GDDR5', bus: '64 bits', units: cuda(384), iface: 'PCIe 3.0 x4', boost: '1,47 GHz', tdp: '30 W', psu: '300 W', msrp: 79, tags: ['bureautique', 'budget'], refurb: true, ref: true },
  'gtx1050': { vendor: 'NVIDIA', label: 'GeForce GTX 1050', family: 'GeForce 10', year: 2016, vram: 2, mem: 'GDDR5', bus: '128 bits', units: cuda(640), iface: 'PCIe 3.0 x16', boost: '1,46 GHz', tdp: '75 W', psu: '300 W', msrp: 129, tags: GB, refurb: true, ref: true },
  'gtx1050ti': { vendor: 'NVIDIA', label: 'GeForce GTX 1050 Ti', family: 'GeForce 10', year: 2016, vram: 4, mem: 'GDDR5', bus: '128 bits', units: cuda(768), iface: 'PCIe 3.0 x16', boost: '1,39 GHz', tdp: '75 W', psu: '300 W', msrp: 159, tags: GB, refurb: true, ref: true },
  'gtx1060-3': { vendor: 'NVIDIA', label: 'GeForce GTX 1060', family: 'GeForce 10', year: 2016, vram: 3, mem: 'GDDR5', bus: '192 bits', units: cuda(1152), iface: 'PCIe 3.0 x16', boost: '1,71 GHz', tdp: '120 W', psu: '400 W', msrp: 219, tags: GB, refurb: true, ref: true, refName: 'NVIDIA GeForce GTX 1060 3 Go' },
  'gtx1060-6': { vendor: 'NVIDIA', label: 'GeForce GTX 1060', family: 'GeForce 10', year: 2016, vram: 6, mem: 'GDDR5', bus: '192 bits', units: cuda(1280), iface: 'PCIe 3.0 x16', boost: '1,71 GHz', tdp: '120 W', psu: '400 W', msrp: 279, tags: GB, refurb: true, ref: true, refName: 'NVIDIA GeForce GTX 1060 6 Go' },
  'gtx1070': { vendor: 'NVIDIA', label: 'GeForce GTX 1070', family: 'GeForce 10', year: 2016, vram: 8, mem: 'GDDR5', bus: '256 bits', units: cuda(1920), iface: 'PCIe 3.0 x16', boost: '1,68 GHz', tdp: '150 W', psu: '500 W', msrp: 499, tags: G, refurb: true, ref: true },
  'gtx1070ti': { vendor: 'NVIDIA', label: 'GeForce GTX 1070 Ti', family: 'GeForce 10', year: 2017, vram: 8, mem: 'GDDR5', bus: '256 bits', units: cuda(2432), iface: 'PCIe 3.0 x16', boost: '1,68 GHz', tdp: '180 W', psu: '500 W', msrp: 469, tags: G, refurb: true, ref: true },
  'gtx1080': { vendor: 'NVIDIA', label: 'GeForce GTX 1080', family: 'GeForce 10', year: 2016, vram: 8, mem: 'GDDR5X', bus: '256 bits', units: cuda(2560), iface: 'PCIe 3.0 x16', boost: '1,73 GHz', tdp: '180 W', psu: '500 W', msrp: 789, tags: G, refurb: true, ref: true },
  'gtx1080ti': { vendor: 'NVIDIA', label: 'GeForce GTX 1080 Ti', family: 'GeForce 10', year: 2017, vram: 11, mem: 'GDDR5X', bus: '352 bits', units: cuda(3584), iface: 'PCIe 3.0 x16', boost: '1,58 GHz', tdp: '250 W', psu: '600 W', msrp: 824, tags: G, refurb: true, ref: true },
  'titanxp': { vendor: 'NVIDIA', label: 'Titan Xp', family: 'GeForce 10', year: 2017, vram: 12, mem: 'GDDR5X', bus: '384 bits', units: cuda(3840), iface: 'PCIe 3.0 x16', boost: '1,58 GHz', tdp: '250 W', psu: '600 W', msrp: 1349, tags: ['gaming', 'creation'], refurb: true, ref: true },
  'titanv': { vendor: 'NVIDIA', label: 'Titan V', family: 'Titan', year: 2017, vram: 12, mem: 'HBM2', bus: '3072 bits', units: cuda(5120), iface: 'PCIe 3.0 x16', boost: '1,46 GHz', tdp: '250 W', psu: '600 W', msrp: 3100, tags: ['ia', 'creation'], refurb: true, ref: true },

  // ─── NVIDIA GeForce GTX 16 (Turing) ───────────────────────────────────────
  'gtx1630': { vendor: 'NVIDIA', label: 'GeForce GTX 1630', family: 'GeForce GTX 16', year: 2022, vram: 4, mem: 'GDDR6', bus: '64 bits', units: cuda(512), iface: 'PCIe 3.0 x16', boost: '1,79 GHz', tdp: '75 W', psu: '300 W', tags: ['bureautique', 'budget'], refurb: true, ref: true },
  'gtx1650': { vendor: 'NVIDIA', label: 'GeForce GTX 1650', family: 'GeForce GTX 16', year: 2019, vram: 4, mem: 'GDDR5', bus: '128 bits', units: cuda(896), iface: 'PCIe 3.0 x16', boost: '1,67 GHz', tdp: '75 W', psu: '300 W', msrp: 159, tags: GB, refurb: true, ref: true },
  'gtx1650-d6': { vendor: 'NVIDIA', label: 'GeForce GTX 1650 GDDR6', family: 'GeForce GTX 16', year: 2020, vram: 4, mem: 'GDDR6', bus: '128 bits', units: cuda(896), iface: 'PCIe 3.0 x16', boost: '1,59 GHz', tdp: '75 W', psu: '300 W', tags: GB, refurb: true, ref: true },
  'gtx1650s': { vendor: 'NVIDIA', label: 'GeForce GTX 1650 Super', family: 'GeForce GTX 16', year: 2019, vram: 4, mem: 'GDDR6', bus: '128 bits', units: cuda(1280), iface: 'PCIe 3.0 x16', boost: '1,73 GHz', tdp: '100 W', psu: '350 W', msrp: 169, tags: GB, refurb: true, ref: true },
  'gtx1660': { vendor: 'NVIDIA', label: 'GeForce GTX 1660', family: 'GeForce GTX 16', year: 2019, vram: 6, mem: 'GDDR5', bus: '192 bits', units: cuda(1408), iface: 'PCIe 3.0 x16', boost: '1,79 GHz', tdp: '120 W', psu: '450 W', msrp: 229, tags: GB, refurb: true, ref: true },
  'gtx1660s': { vendor: 'NVIDIA', label: 'GeForce GTX 1660 Super', family: 'GeForce GTX 16', year: 2019, vram: 6, mem: 'GDDR6', bus: '192 bits', units: cuda(1408), iface: 'PCIe 3.0 x16', boost: '1,79 GHz', tdp: '125 W', psu: '450 W', msrp: 239, tags: GB, refurb: true, ref: true },
  'gtx1660ti': { vendor: 'NVIDIA', label: 'GeForce GTX 1660 Ti', family: 'GeForce GTX 16', year: 2019, vram: 6, mem: 'GDDR6', bus: '192 bits', units: cuda(1536), iface: 'PCIe 3.0 x16', boost: '1,77 GHz', tdp: '120 W', psu: '450 W', msrp: 279, tags: GB, refurb: true, ref: true },

  // ─── NVIDIA GeForce RTX 20 (Turing) ───────────────────────────────────────
  'rtx2060': { vendor: 'NVIDIA', label: 'GeForce RTX 2060', family: 'GeForce RTX 20', year: 2019, vram: 6, mem: 'GDDR6', bus: '192 bits', units: cuda(1920), iface: 'PCIe 3.0 x16', boost: '1,68 GHz', tdp: '160 W', psu: '500 W', msrp: 369, tags: G, refurb: true, ref: true, refName: 'NVIDIA GeForce RTX 2060 6 Go' },
  'rtx2060-12': { vendor: 'NVIDIA', label: 'GeForce RTX 2060', family: 'GeForce RTX 20', year: 2021, vram: 12, mem: 'GDDR6', bus: '192 bits', units: cuda(2176), iface: 'PCIe 3.0 x16', boost: '1,65 GHz', tdp: '184 W', psu: '500 W', tags: G, refurb: true, ref: true, refName: 'NVIDIA GeForce RTX 2060 12 Go' },
  'rtx2060s': { vendor: 'NVIDIA', label: 'GeForce RTX 2060 Super', family: 'GeForce RTX 20', year: 2019, vram: 8, mem: 'GDDR6', bus: '256 bits', units: cuda(2176), iface: 'PCIe 3.0 x16', boost: '1,65 GHz', tdp: '175 W', psu: '550 W', msrp: 419, tags: G, refurb: true, ref: true },
  'rtx2070': { vendor: 'NVIDIA', label: 'GeForce RTX 2070', family: 'GeForce RTX 20', year: 2018, vram: 8, mem: 'GDDR6', bus: '256 bits', units: cuda(2304), iface: 'PCIe 3.0 x16', boost: '1,62 GHz', tdp: '175 W', psu: '550 W', msrp: 519, tags: G, refurb: true, ref: true },
  'rtx2070s': { vendor: 'NVIDIA', label: 'GeForce RTX 2070 Super', family: 'GeForce RTX 20', year: 2019, vram: 8, mem: 'GDDR6', bus: '256 bits', units: cuda(2560), iface: 'PCIe 3.0 x16', boost: '1,77 GHz', tdp: '215 W', psu: '650 W', msrp: 519, tags: G, refurb: true, ref: true },
  'rtx2080': { vendor: 'NVIDIA', label: 'GeForce RTX 2080', family: 'GeForce RTX 20', year: 2018, vram: 8, mem: 'GDDR6', bus: '256 bits', units: cuda(2944), iface: 'PCIe 3.0 x16', boost: '1,71 GHz', tdp: '215 W', psu: '650 W', msrp: 849, tags: G, refurb: true, ref: true },
  'rtx2080s': { vendor: 'NVIDIA', label: 'GeForce RTX 2080 Super', family: 'GeForce RTX 20', year: 2019, vram: 8, mem: 'GDDR6', bus: '256 bits', units: cuda(3072), iface: 'PCIe 3.0 x16', boost: '1,82 GHz', tdp: '250 W', psu: '650 W', msrp: 739, tags: G, refurb: true, ref: true },
  'rtx2080ti': { vendor: 'NVIDIA', label: 'GeForce RTX 2080 Ti', family: 'GeForce RTX 20', year: 2018, vram: 11, mem: 'GDDR6', bus: '352 bits', units: cuda(4352), iface: 'PCIe 3.0 x16', boost: '1,55 GHz', tdp: '250 W', psu: '650 W', msrp: 1259, tags: GI, refurb: true, ref: true },
  'titanrtx': { vendor: 'NVIDIA', label: 'Titan RTX', family: 'Titan', year: 2018, vram: 24, mem: 'GDDR6', bus: '384 bits', units: cuda(4608), iface: 'PCIe 3.0 x16', boost: '1,77 GHz', tdp: '280 W', psu: '650 W', msrp: 2699, tags: ['ia', 'creation'], refurb: true, ref: true },

  // ─── NVIDIA GeForce RTX 30 (Ampere) ───────────────────────────────────────
  'rtx3050-6': { vendor: 'NVIDIA', label: 'GeForce RTX 3050', family: 'GeForce RTX 30', year: 2024, vram: 6, mem: 'GDDR6', bus: '96 bits', units: cuda(2304), iface: 'PCIe 4.0 x8', boost: '1,47 GHz', tdp: '70 W', psu: '300 W', tags: GB, refurb: true, ref: true, refName: 'NVIDIA GeForce RTX 3050 6 Go' },
  'rtx3050-8': { vendor: 'NVIDIA', label: 'GeForce RTX 3050', family: 'GeForce RTX 30', year: 2022, vram: 8, mem: 'GDDR6', bus: '128 bits', units: cuda(2560), iface: 'PCIe 4.0 x8', tags: GB, refurb: true },
  'rtx3060-8': { vendor: 'NVIDIA', label: 'GeForce RTX 3060', family: 'GeForce RTX 30', year: 2022, vram: 8, mem: 'GDDR6', bus: '128 bits', units: cuda(3584), iface: 'PCIe 4.0 x16', boost: '1,78 GHz', tdp: '170 W', psu: '550 W', tags: GB, refurb: true, ref: true, refName: 'NVIDIA GeForce RTX 3060 8 Go' },
  'rtx3060-12': { vendor: 'NVIDIA', label: 'GeForce RTX 3060', family: 'GeForce RTX 30', year: 2021, vram: 12, mem: 'GDDR6', bus: '192 bits', units: cuda(3584), iface: 'PCIe 4.0 x16', tags: ['gaming', 'ia', 'budget'], refurb: true },
  'rtx3060ti': { vendor: 'NVIDIA', label: 'GeForce RTX 3060 Ti', family: 'GeForce RTX 30', year: 2020, vram: 8, mem: 'GDDR6', bus: '256 bits', units: cuda(4864), iface: 'PCIe 4.0 x16', tags: G, refurb: true },
  'rtx3060ti-x': { vendor: 'NVIDIA', label: 'GeForce RTX 3060 Ti GDDR6X', family: 'GeForce RTX 30', year: 2022, vram: 8, mem: 'GDDR6X', bus: '256 bits', units: cuda(4864), iface: 'PCIe 4.0 x16', boost: '1,67 GHz', tdp: '200 W', psu: '600 W', tags: G, refurb: true, ref: true },
  'rtx3070': { vendor: 'NVIDIA', label: 'GeForce RTX 3070', family: 'GeForce RTX 30', year: 2020, vram: 8, mem: 'GDDR6', bus: '256 bits', units: cuda(5888), iface: 'PCIe 4.0 x16', tags: G, refurb: true },
  'rtx3070ti': { vendor: 'NVIDIA', label: 'GeForce RTX 3070 Ti', family: 'GeForce RTX 30', year: 2021, vram: 8, mem: 'GDDR6X', bus: '256 bits', units: cuda(6144), iface: 'PCIe 4.0 x16', tags: G, refurb: true },
  'rtx3080-10': { vendor: 'NVIDIA', label: 'GeForce RTX 3080', family: 'GeForce RTX 30', year: 2020, vram: 10, mem: 'GDDR6X', bus: '320 bits', units: cuda(8704), iface: 'PCIe 4.0 x16', tags: GI, refurb: true },
  'rtx3080-12': { vendor: 'NVIDIA', label: 'GeForce RTX 3080', family: 'GeForce RTX 30', year: 2022, vram: 12, mem: 'GDDR6X', bus: '384 bits', units: cuda(8960), iface: 'PCIe 4.0 x16', boost: '1,71 GHz', tdp: '350 W', psu: '750 W', tags: GI, refurb: true, ref: true, refName: 'NVIDIA GeForce RTX 3080 12 Go' },
  'rtx3080ti': { vendor: 'NVIDIA', label: 'GeForce RTX 3080 Ti', family: 'GeForce RTX 30', year: 2021, vram: 12, mem: 'GDDR6X', bus: '384 bits', units: cuda(10240), iface: 'PCIe 4.0 x16', tags: GI, refurb: true },
  'rtx3090': { vendor: 'NVIDIA', label: 'GeForce RTX 3090', family: 'GeForce RTX 30', year: 2020, vram: 24, mem: 'GDDR6X', bus: '384 bits', units: cuda(10496), iface: 'PCIe 4.0 x16', tags: GIC, refurb: true },
  'rtx3090ti': { vendor: 'NVIDIA', label: 'GeForce RTX 3090 Ti', family: 'GeForce RTX 30', year: 2022, vram: 24, mem: 'GDDR6X', bus: '384 bits', units: cuda(10752), iface: 'PCIe 4.0 x16', tags: GIC, refurb: true },

  // ─── NVIDIA GeForce RTX 40 (Ada) ──────────────────────────────────────────
  'rtx4060': { vendor: 'NVIDIA', label: 'GeForce RTX 4060', family: 'GeForce RTX 40', year: 2023, vram: 8, mem: 'GDDR6', bus: '128 bits', units: cuda(3072), iface: 'PCIe 4.0 x8', tags: GB, refurb: true },
  'rtx4060ti-8': { vendor: 'NVIDIA', label: 'GeForce RTX 4060 Ti', family: 'GeForce RTX 40', year: 2023, vram: 8, mem: 'GDDR6', bus: '128 bits', units: cuda(4352), iface: 'PCIe 4.0 x8', tags: G, refurb: true },
  'rtx4060ti-16': { vendor: 'NVIDIA', label: 'GeForce RTX 4060 Ti', family: 'GeForce RTX 40', year: 2023, vram: 16, mem: 'GDDR6', bus: '128 bits', units: cuda(4352), iface: 'PCIe 4.0 x8', tags: GI, refurb: true },
  'rtx4070': { vendor: 'NVIDIA', label: 'GeForce RTX 4070', family: 'GeForce RTX 40', year: 2023, vram: 12, mem: 'GDDR6X', bus: '192 bits', units: cuda(5888), iface: 'PCIe 4.0 x16', tags: G, refurb: true },
  'rtx4070s': { vendor: 'NVIDIA', label: 'GeForce RTX 4070 Super', family: 'GeForce RTX 40', year: 2024, vram: 12, mem: 'GDDR6X', bus: '192 bits', units: cuda(7168), iface: 'PCIe 4.0 x16', tags: G, refurb: true },
  'rtx4070ti': { vendor: 'NVIDIA', label: 'GeForce RTX 4070 Ti', family: 'GeForce RTX 40', year: 2023, vram: 12, mem: 'GDDR6X', bus: '192 bits', units: cuda(7680), iface: 'PCIe 4.0 x16', tags: G, refurb: true },
  'rtx4070tis': { vendor: 'NVIDIA', label: 'GeForce RTX 4070 Ti Super', family: 'GeForce RTX 40', year: 2024, vram: 16, mem: 'GDDR6X', bus: '256 bits', units: cuda(8448), iface: 'PCIe 4.0 x16', tags: GI, refurb: true },
  'rtx4080': { vendor: 'NVIDIA', label: 'GeForce RTX 4080', family: 'GeForce RTX 40', year: 2022, vram: 16, mem: 'GDDR6X', bus: '256 bits', units: cuda(9728), iface: 'PCIe 4.0 x16', tags: GIC, refurb: true },
  'rtx4080s': { vendor: 'NVIDIA', label: 'GeForce RTX 4080 Super', family: 'GeForce RTX 40', year: 2024, vram: 16, mem: 'GDDR6X', bus: '256 bits', units: cuda(10240), iface: 'PCIe 4.0 x16', tags: GIC, refurb: true },
  'rtx4090': { vendor: 'NVIDIA', label: 'GeForce RTX 4090', family: 'GeForce RTX 40', year: 2022, vram: 24, mem: 'GDDR6X', bus: '384 bits', units: cuda(16384), iface: 'PCIe 4.0 x16', tags: GIC, refurb: true },

  // ─── NVIDIA GeForce RTX 50 (Blackwell) ────────────────────────────────────
  'rtx5050': { vendor: 'NVIDIA', label: 'GeForce RTX 5050', family: 'GeForce RTX 50', year: 2025, vram: 8, mem: 'GDDR6', bus: '128 bits', units: cuda(2560), iface: 'PCIe 5.0 x8', tags: GB },
  'rtx5060': { vendor: 'NVIDIA', label: 'GeForce RTX 5060', family: 'GeForce RTX 50', year: 2025, vram: 8, mem: 'GDDR7', bus: '128 bits', units: cuda(3840), iface: 'PCIe 5.0 x8', tags: GB },
  'rtx5060ti-8': { vendor: 'NVIDIA', label: 'GeForce RTX 5060 Ti', family: 'GeForce RTX 50', year: 2025, vram: 8, mem: 'GDDR7', bus: '128 bits', units: cuda(4608), iface: 'PCIe 5.0 x8', tags: G },
  'rtx5060ti-16': { vendor: 'NVIDIA', label: 'GeForce RTX 5060 Ti', family: 'GeForce RTX 50', year: 2025, vram: 16, mem: 'GDDR7', bus: '128 bits', units: cuda(4608), iface: 'PCIe 5.0 x8', tags: GI },
  'rtx5070': { vendor: 'NVIDIA', label: 'GeForce RTX 5070', family: 'GeForce RTX 50', year: 2025, vram: 12, mem: 'GDDR7', bus: '192 bits', units: cuda(6144), iface: 'PCIe 5.0 x16', tags: GI },
  'rtx5070ti': { vendor: 'NVIDIA', label: 'GeForce RTX 5070 Ti', family: 'GeForce RTX 50', year: 2025, vram: 16, mem: 'GDDR7', bus: '256 bits', units: cuda(8960), iface: 'PCIe 5.0 x16', tags: GI },
  'rtx5080': { vendor: 'NVIDIA', label: 'GeForce RTX 5080', family: 'GeForce RTX 50', year: 2025, vram: 16, mem: 'GDDR7', bus: '256 bits', units: cuda(10752), iface: 'PCIe 5.0 x16', tags: GIC },
  'rtx5090': { vendor: 'NVIDIA', label: 'GeForce RTX 5090', family: 'GeForce RTX 50', year: 2025, vram: 32, mem: 'GDDR7', bus: '512 bits', units: cuda(21760), iface: 'PCIe 5.0 x16', tags: GIC },

  // ─── AMD Radeon RX 400 / 500 (Polaris) ────────────────────────────────────
  'rx460-2': { vendor: 'AMD', label: 'Radeon RX 460', family: 'Radeon RX 400', year: 2016, vram: 2, mem: 'GDDR5', bus: '128 bits', units: cu(14), iface: 'PCIe 3.0 x8', boost: '1,20 GHz', tdp: '75 W', tags: GB, refurb: true, ref: true, refName: 'AMD Radeon RX 460 2 Go' },
  'rx460-4': { vendor: 'AMD', label: 'Radeon RX 460', family: 'Radeon RX 400', year: 2016, vram: 4, mem: 'GDDR5', bus: '128 bits', units: cu(14), iface: 'PCIe 3.0 x8', boost: '1,20 GHz', tdp: '75 W', tags: GB, refurb: true, ref: true, refName: 'AMD Radeon RX 460 4 Go' },
  'rx470-4': { vendor: 'AMD', label: 'Radeon RX 470', family: 'Radeon RX 400', year: 2016, vram: 4, mem: 'GDDR5', bus: '256 bits', units: cu(32), iface: 'PCIe 3.0 x16', boost: '1,21 GHz', tdp: '120 W', psu: '450 W', tags: GB, refurb: true, ref: true, refName: 'AMD Radeon RX 470 4 Go' },
  'rx480-4': { vendor: 'AMD', label: 'Radeon RX 480', family: 'Radeon RX 400', year: 2016, vram: 4, mem: 'GDDR5', bus: '256 bits', units: cu(36), iface: 'PCIe 3.0 x16', boost: '1,27 GHz', tdp: '150 W', psu: '500 W', msrp: 219, tags: GB, refurb: true, ref: true, refName: 'AMD Radeon RX 480 4 Go' },
  'rx480-8': { vendor: 'AMD', label: 'Radeon RX 480', family: 'Radeon RX 400', year: 2016, vram: 8, mem: 'GDDR5', bus: '256 bits', units: cu(36), iface: 'PCIe 3.0 x16', boost: '1,27 GHz', tdp: '150 W', psu: '500 W', msrp: 269, tags: GB, refurb: true, ref: true, refName: 'AMD Radeon RX 480 8 Go' },
  'rx550-2': { vendor: 'AMD', label: 'Radeon RX 550', family: 'Radeon RX 500', year: 2017, vram: 2, mem: 'GDDR5', bus: '128 bits', units: cu(8), iface: 'PCIe 3.0 x8', boost: '1,18 GHz', tdp: '50 W', tags: ['bureautique', 'budget'], refurb: true, ref: true, refName: 'AMD Radeon RX 550 2 Go' },
  'rx550-4': { vendor: 'AMD', label: 'Radeon RX 550', family: 'Radeon RX 500', year: 2017, vram: 4, mem: 'GDDR5', bus: '128 bits', units: cu(8), iface: 'PCIe 3.0 x8', boost: '1,18 GHz', tdp: '50 W', tags: ['bureautique', 'budget'], refurb: true, ref: true, refName: 'AMD Radeon RX 550 4 Go' },
  'rx560-4': { vendor: 'AMD', label: 'Radeon RX 560', family: 'Radeon RX 500', year: 2017, vram: 4, mem: 'GDDR5', bus: '128 bits', units: cu(16), iface: 'PCIe 3.0 x8', boost: '1,28 GHz', tdp: '80 W', tags: GB, refurb: true, ref: true, refName: 'AMD Radeon RX 560 4 Go' },
  'rx570-4': { vendor: 'AMD', label: 'Radeon RX 570', family: 'Radeon RX 500', year: 2017, vram: 4, mem: 'GDDR5', bus: '256 bits', units: cu(32), iface: 'PCIe 3.0 x16', boost: '1,24 GHz', tdp: '150 W', psu: '450 W', tags: GB, refurb: true, ref: true, refName: 'AMD Radeon RX 570 4 Go' },
  'rx570-8': { vendor: 'AMD', label: 'Radeon RX 570', family: 'Radeon RX 500', year: 2017, vram: 8, mem: 'GDDR5', bus: '256 bits', units: cu(32), iface: 'PCIe 3.0 x16', boost: '1,24 GHz', tdp: '150 W', psu: '450 W', tags: GB, refurb: true, ref: true, refName: 'AMD Radeon RX 570 8 Go' },
  'rx580-4': { vendor: 'AMD', label: 'Radeon RX 580', family: 'Radeon RX 500', year: 2017, vram: 4, mem: 'GDDR5', bus: '256 bits', units: cu(36), iface: 'PCIe 3.0 x16', boost: '1,34 GHz', tdp: '185 W', psu: '500 W', msrp: 229, tags: GB, refurb: true, ref: true, refName: 'AMD Radeon RX 580 4 Go' },
  'rx580-8': { vendor: 'AMD', label: 'Radeon RX 580', family: 'Radeon RX 500', year: 2017, vram: 8, mem: 'GDDR5', bus: '256 bits', units: cu(36), iface: 'PCIe 3.0 x16', boost: '1,34 GHz', tdp: '185 W', psu: '500 W', msrp: 269, tags: GB, refurb: true, ref: true, refName: 'AMD Radeon RX 580 8 Go' },
  'rx590': { vendor: 'AMD', label: 'Radeon RX 590', family: 'Radeon RX 500', year: 2018, vram: 8, mem: 'GDDR5', bus: '256 bits', units: cu(36), iface: 'PCIe 3.0 x16', boost: '1,55 GHz', tdp: '225 W', psu: '500 W', msrp: 279, tags: GB, refurb: true, ref: true },

  // ─── AMD Radeon Vega / VII ────────────────────────────────────────────────
  'vega56': { vendor: 'AMD', label: 'Radeon RX Vega 56', family: 'Radeon RX Vega', year: 2017, vram: 8, mem: 'HBM2', bus: '2048 bits', units: cu(56), iface: 'PCIe 3.0 x16', boost: '1,47 GHz', tdp: '210 W', psu: '650 W', msrp: 419, tags: G, refurb: true, ref: true },
  'vega64': { vendor: 'AMD', label: 'Radeon RX Vega 64', family: 'Radeon RX Vega', year: 2017, vram: 8, mem: 'HBM2', bus: '2048 bits', units: cu(64), iface: 'PCIe 3.0 x16', boost: '1,55 GHz', tdp: '295 W', psu: '750 W', msrp: 509, tags: G, refurb: true, ref: true },
  'radeon7': { vendor: 'AMD', label: 'Radeon VII', family: 'Radeon RX Vega', year: 2019, vram: 16, mem: 'HBM2', bus: '4096 bits', units: cu(60), iface: 'PCIe 3.0 x16', boost: '1,75 GHz', tdp: '300 W', psu: '750 W', msrp: 739, tags: ['gaming', 'creation'], refurb: true, ref: true },

  // ─── AMD Radeon RX 5000 (RDNA) ────────────────────────────────────────────
  'rx5500xt-4': { vendor: 'AMD', label: 'Radeon RX 5500 XT', family: 'Radeon RX 5000', year: 2019, vram: 4, mem: 'GDDR6', bus: '128 bits', units: cu(22), iface: 'PCIe 4.0 x8', boost: '1,85 GHz', tdp: '130 W', psu: '450 W', tags: GB, refurb: true, ref: true, refName: 'AMD Radeon RX 5500 XT 4 Go' },
  'rx5500xt-8': { vendor: 'AMD', label: 'Radeon RX 5500 XT', family: 'Radeon RX 5000', year: 2019, vram: 8, mem: 'GDDR6', bus: '128 bits', units: cu(22), iface: 'PCIe 4.0 x8', boost: '1,85 GHz', tdp: '130 W', psu: '450 W', tags: GB, refurb: true, ref: true, refName: 'AMD Radeon RX 5500 XT 8 Go' },
  'rx5600xt': { vendor: 'AMD', label: 'Radeon RX 5600 XT', family: 'Radeon RX 5000', year: 2020, vram: 6, mem: 'GDDR6', bus: '192 bits', units: cu(36), iface: 'PCIe 4.0 x16', tdp: '150 W', psu: '550 W', msrp: 299, tags: GB, refurb: true, ref: true },
  'rx5700': { vendor: 'AMD', label: 'Radeon RX 5700', family: 'Radeon RX 5000', year: 2019, vram: 8, mem: 'GDDR6', bus: '256 bits', units: cu(36), iface: 'PCIe 4.0 x16', boost: '1,73 GHz', tdp: '180 W', psu: '600 W', msrp: 369, tags: G, refurb: true, ref: true },
  'rx5700xt': { vendor: 'AMD', label: 'Radeon RX 5700 XT', family: 'Radeon RX 5000', year: 2019, vram: 8, mem: 'GDDR6', bus: '256 bits', units: cu(40), iface: 'PCIe 4.0 x16', boost: '1,91 GHz', tdp: '225 W', psu: '600 W', msrp: 419, tags: G, refurb: true, ref: true },

  // ─── AMD Radeon RX 6000 / 7000 / 9000 ─────────────────────────────────────
  'rx6400': { vendor: 'AMD', label: 'Radeon RX 6400', family: 'Radeon RX 6000', year: 2022, vram: 4, mem: 'GDDR6', bus: '64 bits', units: cu(12), iface: 'PCIe 4.0 x4', boost: '2,32 GHz', tdp: '53 W', psu: '350 W', tags: ['bureautique', 'budget'], refurb: true, ref: true },
  'rx6500xt': { vendor: 'AMD', label: 'Radeon RX 6500 XT', family: 'Radeon RX 6000', year: 2022, vram: 4, mem: 'GDDR6', bus: '64 bits', units: cu(16), iface: 'PCIe 4.0 x4', boost: '2,82 GHz', tdp: '107 W', psu: '400 W', msrp: 219, tags: GB, refurb: true, ref: true },
  'rx6600': { vendor: 'AMD', label: 'Radeon RX 6600', family: 'Radeon RX 6000', year: 2021, vram: 8, mem: 'GDDR6', bus: '128 bits', units: cu(28), iface: 'PCIe 4.0 x8', tags: GB, refurb: true },
  'rx6600xt': { vendor: 'AMD', label: 'Radeon RX 6600 XT', family: 'Radeon RX 6000', year: 2021, vram: 8, mem: 'GDDR6', bus: '128 bits', units: cu(32), iface: 'PCIe 4.0 x8', tags: GB, refurb: true },
  'rx6650xt': { vendor: 'AMD', label: 'Radeon RX 6650 XT', family: 'Radeon RX 6000', year: 2022, vram: 8, mem: 'GDDR6', bus: '128 bits', units: cu(32), iface: 'PCIe 4.0 x8', tags: GB, refurb: true },
  'rx6700xt': { vendor: 'AMD', label: 'Radeon RX 6700 XT', family: 'Radeon RX 6000', year: 2021, vram: 12, mem: 'GDDR6', bus: '192 bits', units: cu(40), iface: 'PCIe 4.0 x16', tags: G, refurb: true },
  'rx6750xt': { vendor: 'AMD', label: 'Radeon RX 6750 XT', family: 'Radeon RX 6000', year: 2022, vram: 12, mem: 'GDDR6', bus: '192 bits', units: cu(40), iface: 'PCIe 4.0 x16', tags: G, refurb: true },
  'rx6800': { vendor: 'AMD', label: 'Radeon RX 6800', family: 'Radeon RX 6000', year: 2020, vram: 16, mem: 'GDDR6', bus: '256 bits', units: cu(60), iface: 'PCIe 4.0 x16', tags: G, refurb: true },
  'rx6800xt': { vendor: 'AMD', label: 'Radeon RX 6800 XT', family: 'Radeon RX 6000', year: 2020, vram: 16, mem: 'GDDR6', bus: '256 bits', units: cu(72), iface: 'PCIe 4.0 x16', tags: G, refurb: true },
  'rx6900xt': { vendor: 'AMD', label: 'Radeon RX 6900 XT', family: 'Radeon RX 6000', year: 2020, vram: 16, mem: 'GDDR6', bus: '256 bits', units: cu(80), iface: 'PCIe 4.0 x16', tags: G, refurb: true },
  'rx6950xt': { vendor: 'AMD', label: 'Radeon RX 6950 XT', family: 'Radeon RX 6000', year: 2022, vram: 16, mem: 'GDDR6', bus: '256 bits', units: cu(80), iface: 'PCIe 4.0 x16', tags: G, refurb: true },
  'rx7600': { vendor: 'AMD', label: 'Radeon RX 7600', family: 'Radeon RX 7000', year: 2023, vram: 8, mem: 'GDDR6', bus: '128 bits', units: cu(32), iface: 'PCIe 4.0 x8', tags: GB, refurb: true },
  'rx7600xt': { vendor: 'AMD', label: 'Radeon RX 7600 XT', family: 'Radeon RX 7000', year: 2024, vram: 16, mem: 'GDDR6', bus: '128 bits', units: cu(32), iface: 'PCIe 4.0 x8', tags: GB, refurb: true },
  'rx7700xt': { vendor: 'AMD', label: 'Radeon RX 7700 XT', family: 'Radeon RX 7000', year: 2023, vram: 12, mem: 'GDDR6', bus: '192 bits', units: cu(54), iface: 'PCIe 4.0 x16', tags: G, refurb: true },
  'rx7800xt': { vendor: 'AMD', label: 'Radeon RX 7800 XT', family: 'Radeon RX 7000', year: 2023, vram: 16, mem: 'GDDR6', bus: '256 bits', units: cu(60), iface: 'PCIe 4.0 x16', tags: G, refurb: true },
  'rx7900gre': { vendor: 'AMD', label: 'Radeon RX 7900 GRE', family: 'Radeon RX 7000', year: 2024, vram: 16, mem: 'GDDR6', bus: '256 bits', units: cu(80), iface: 'PCIe 4.0 x16', tags: G, refurb: true },
  'rx7900xt': { vendor: 'AMD', label: 'Radeon RX 7900 XT', family: 'Radeon RX 7000', year: 2022, vram: 20, mem: 'GDDR6', bus: '320 bits', units: cu(84), iface: 'PCIe 4.0 x16', tags: G, refurb: true },
  'rx7900xtx': { vendor: 'AMD', label: 'Radeon RX 7900 XTX', family: 'Radeon RX 7000', year: 2022, vram: 24, mem: 'GDDR6', bus: '384 bits', units: cu(96), iface: 'PCIe 4.0 x16', tags: GI, refurb: true },
  'rx9060xt-8': { vendor: 'AMD', label: 'Radeon RX 9060 XT', family: 'Radeon RX 9000', year: 2025, vram: 8, mem: 'GDDR6', bus: '128 bits', units: cu(32), iface: 'PCIe 5.0 x16', tags: GB },
  'rx9060xt-16': { vendor: 'AMD', label: 'Radeon RX 9060 XT', family: 'Radeon RX 9000', year: 2025, vram: 16, mem: 'GDDR6', bus: '128 bits', units: cu(32), iface: 'PCIe 5.0 x16', tags: G },
  'rx9070': { vendor: 'AMD', label: 'Radeon RX 9070', family: 'Radeon RX 9000', year: 2025, vram: 16, mem: 'GDDR6', bus: '256 bits', units: cu(56), iface: 'PCIe 5.0 x16', tags: G },
  'rx9070xt': { vendor: 'AMD', label: 'Radeon RX 9070 XT', family: 'Radeon RX 9000', year: 2025, vram: 16, mem: 'GDDR6', bus: '256 bits', units: cu(64), iface: 'PCIe 5.0 x16', tags: G },

  // ─── Intel Arc ────────────────────────────────────────────────────────────
  'a310': { vendor: 'Intel', label: 'Arc A310', family: 'Arc A', year: 2022, vram: 4, mem: 'GDDR6', bus: '64 bits', units: xe(6), iface: 'PCIe 4.0 x8', tdp: '75 W', tags: ['bureautique', 'budget', 'homelab'], refurb: true, ref: true },
  'a380': { vendor: 'Intel', label: 'Arc A380', family: 'Arc A', year: 2022, vram: 6, mem: 'GDDR6', bus: '96 bits', units: xe(8), iface: 'PCIe 4.0 x8', boost: '2,00 GHz', tdp: '75 W', tags: ['budget', 'homelab'], refurb: true, ref: true },
  'a580': { vendor: 'Intel', label: 'Arc A580', family: 'Arc A', year: 2023, vram: 8, mem: 'GDDR6', bus: '256 bits', units: xe(24), iface: 'PCIe 4.0 x16', boost: '2,00 GHz', tdp: '185 W', tags: GB, refurb: true, ref: true },
  'a750': { vendor: 'Intel', label: 'Arc A750', family: 'Arc A', year: 2022, vram: 8, mem: 'GDDR6', bus: '256 bits', units: xe(28), iface: 'PCIe 4.0 x16', tags: GB, refurb: true },
  'a770-8': { vendor: 'Intel', label: 'Arc A770', family: 'Arc A', year: 2022, vram: 8, mem: 'GDDR6', bus: '256 bits', units: xe(32), iface: 'PCIe 4.0 x16', boost: '2,10 GHz', tdp: '225 W', tags: GB, refurb: true, ref: true, refName: 'Intel Arc A770 8 Go' },
  'a770-16': { vendor: 'Intel', label: 'Arc A770', family: 'Arc A', year: 2022, vram: 16, mem: 'GDDR6', bus: '256 bits', units: xe(32), iface: 'PCIe 4.0 x16', tags: ['gaming', 'creation'], refurb: true },
  'b570': { vendor: 'Intel', label: 'Arc B570', family: 'Arc B', year: 2025, vram: 10, mem: 'GDDR6', bus: '160 bits', units: xe2(18), iface: 'PCIe 4.0 x8', tags: GB },
  'b580': { vendor: 'Intel', label: 'Arc B580', family: 'Arc B', year: 2024, vram: 12, mem: 'GDDR6', bus: '192 bits', units: xe2(20), iface: 'PCIe 4.0 x8', tags: GB },

  // ─── Cartes pro NVIDIA ────────────────────────────────────────────────────
  'p400': { vendor: 'NVIDIA', label: 'Quadro P400', family: 'Quadro Pascal', year: 2017, vram: 2, mem: 'GDDR5', bus: '64 bits', units: cuda(256), iface: 'PCIe 3.0 x16', tdp: '30 W', tags: ['pro', 'bureautique'], refurb: true, ref: true },
  'p620': { vendor: 'NVIDIA', label: 'Quadro P620', family: 'Quadro Pascal', year: 2018, vram: 2, mem: 'GDDR5', bus: '128 bits', units: cuda(512), iface: 'PCIe 3.0 x16', tdp: '40 W', tags: ['pro', 'bureautique'], refurb: true, ref: true },
  'p1000': { vendor: 'NVIDIA', label: 'Quadro P1000', family: 'Quadro Pascal', year: 2017, vram: 4, mem: 'GDDR5', bus: '128 bits', units: cuda(640), iface: 'PCIe 3.0 x16', tdp: '47 W', tags: ['pro', 'homelab'], refurb: true, ref: true },
  'p2000': { vendor: 'NVIDIA', label: 'Quadro P2000', family: 'Quadro Pascal', year: 2017, vram: 5, mem: 'GDDR5', bus: '160 bits', units: cuda(1024), iface: 'PCIe 3.0 x16', tdp: '75 W', tags: ['pro', 'homelab'], refurb: true, ref: true },
  'p2200': { vendor: 'NVIDIA', label: 'Quadro P2200', family: 'Quadro Pascal', year: 2019, vram: 5, mem: 'GDDR5X', bus: '160 bits', units: cuda(1280), iface: 'PCIe 3.0 x16', tdp: '75 W', tags: ['pro', 'homelab'], refurb: true, ref: true },
  'p4000': { vendor: 'NVIDIA', label: 'Quadro P4000', family: 'Quadro Pascal', year: 2017, vram: 8, mem: 'GDDR5', bus: '256 bits', units: cuda(1792), iface: 'PCIe 3.0 x16', tdp: '105 W', tags: PRO, refurb: true, ref: true },
  'p5000': { vendor: 'NVIDIA', label: 'Quadro P5000', family: 'Quadro Pascal', year: 2016, vram: 16, mem: 'GDDR5X', bus: '256 bits', units: cuda(2560), iface: 'PCIe 3.0 x16', tdp: '180 W', tags: PRO, refurb: true, ref: true },
  'p6000': { vendor: 'NVIDIA', label: 'Quadro P6000', family: 'Quadro Pascal', year: 2016, vram: 24, mem: 'GDDR5X', bus: '384 bits', units: cuda(3840), iface: 'PCIe 3.0 x16', tdp: '250 W', tags: PRO, refurb: true, ref: true },
  't400-2': { vendor: 'NVIDIA', label: 'T400', family: 'Quadro Turing', year: 2021, vram: 2, mem: 'GDDR6', bus: '64 bits', units: cuda(384), iface: 'PCIe 3.0 x16', tdp: '30 W', tags: ['pro', 'bureautique'], refurb: true, ref: true, refName: 'NVIDIA T400 2 Go' },
  't400-4': { vendor: 'NVIDIA', label: 'T400', family: 'Quadro Turing', year: 2021, vram: 4, mem: 'GDDR6', bus: '64 bits', units: cuda(384), iface: 'PCIe 3.0 x16', tdp: '30 W', tags: ['pro', 'bureautique'], refurb: true, ref: true, refName: 'NVIDIA T400 4 Go' },
  't600': { vendor: 'NVIDIA', label: 'T600', family: 'Quadro Turing', year: 2021, vram: 4, mem: 'GDDR6', bus: '128 bits', units: cuda(640), iface: 'PCIe 3.0 x16', tdp: '40 W', tags: ['pro', 'homelab'], refurb: true, ref: true },
  't1000-4': { vendor: 'NVIDIA', label: 'T1000', family: 'Quadro Turing', year: 2021, vram: 4, mem: 'GDDR6', bus: '128 bits', units: cuda(896), iface: 'PCIe 3.0 x16', tdp: '50 W', tags: ['pro', 'homelab'], refurb: true, ref: true, refName: 'NVIDIA T1000 4 Go' },
  't1000-8': { vendor: 'NVIDIA', label: 'T1000', family: 'Quadro Turing', year: 2021, vram: 8, mem: 'GDDR6', bus: '128 bits', units: cuda(896), iface: 'PCIe 3.0 x16', tdp: '50 W', tags: ['pro', 'homelab'], refurb: true, ref: true, refName: 'NVIDIA T1000 8 Go' },
  'qrtx4000': { vendor: 'NVIDIA', label: 'Quadro RTX 4000', family: 'Quadro RTX', year: 2018, vram: 8, mem: 'GDDR6', bus: '256 bits', units: cuda(2304), iface: 'PCIe 3.0 x16', tdp: '160 W', tags: PRO, refurb: true, ref: true },
  'qrtx5000': { vendor: 'NVIDIA', label: 'Quadro RTX 5000', family: 'Quadro RTX', year: 2018, vram: 16, mem: 'GDDR6', bus: '256 bits', units: cuda(3072), iface: 'PCIe 3.0 x16', tdp: '230 W', tags: PROIA, refurb: true, ref: true },
  'qrtx6000': { vendor: 'NVIDIA', label: 'Quadro RTX 6000', family: 'Quadro RTX', year: 2018, vram: 24, mem: 'GDDR6', bus: '384 bits', units: cuda(4608), iface: 'PCIe 3.0 x16', tdp: '295 W', tags: PROIA, refurb: true, ref: true },
  'qrtx8000': { vendor: 'NVIDIA', label: 'Quadro RTX 8000', family: 'Quadro RTX', year: 2018, vram: 48, mem: 'GDDR6', bus: '384 bits', units: cuda(4608), iface: 'PCIe 3.0 x16', tdp: '295 W', tags: PROIA, refurb: true, ref: true },
  'a400': { vendor: 'NVIDIA', label: 'RTX A400', family: 'RTX Ampere pro', year: 2024, vram: 4, mem: 'GDDR6', bus: '64 bits', units: cuda(768), iface: 'PCIe 4.0 x8', tdp: '50 W', tags: ['pro', 'bureautique'], ref: true },
  'a1000': { vendor: 'NVIDIA', label: 'RTX A1000', family: 'RTX Ampere pro', year: 2024, vram: 8, mem: 'GDDR6', bus: '128 bits', units: cuda(2304), iface: 'PCIe 4.0 x8', tdp: '50 W', tags: ['pro', 'creation', 'homelab'], ref: true },
  'a2000-6': { vendor: 'NVIDIA', label: 'RTX A2000', family: 'RTX Ampere pro', year: 2021, vram: 6, mem: 'GDDR6', bus: '192 bits', units: cuda(3328), iface: 'PCIe 4.0 x16', tdp: '70 W', tags: ['pro', 'creation', 'homelab'], refurb: true, ref: true, refName: 'NVIDIA RTX A2000 6 Go' },
  'a4500': { vendor: 'NVIDIA', label: 'RTX A4500', family: 'RTX Ampere pro', year: 2021, vram: 20, mem: 'GDDR6 ECC', bus: '320 bits', units: cuda(7168), iface: 'PCIe 4.0 x16', tdp: '200 W', tags: PROIA, refurb: true, ref: true },
  'a5500': { vendor: 'NVIDIA', label: 'RTX A5500', family: 'RTX Ampere pro', year: 2022, vram: 24, mem: 'GDDR6 ECC', bus: '384 bits', units: cuda(10240), iface: 'PCIe 4.0 x16', tdp: '230 W', tags: PROIA, refurb: true, ref: true },
  'rtx4000sffada': { vendor: 'NVIDIA', label: 'RTX 4000 SFF Ada Generation', family: 'RTX Ada pro', year: 2023, vram: 20, mem: 'GDDR6 ECC', bus: '160 bits', units: cuda(6144), iface: 'PCIe 4.0 x16', tdp: '70 W', tags: ['pro', 'creation', 'ia', 'homelab'], ref: true },
  'rtx4500ada': { vendor: 'NVIDIA', label: 'RTX 4500 Ada Generation', family: 'RTX Ada pro', year: 2023, vram: 24, mem: 'GDDR6 ECC', bus: '192 bits', units: cuda(7680), iface: 'PCIe 4.0 x16', tdp: '210 W', tags: PROIA, ref: true },
  'rtx5000ada': { vendor: 'NVIDIA', label: 'RTX 5000 Ada Generation', family: 'RTX Ada pro', year: 2023, vram: 32, mem: 'GDDR6 ECC', bus: '256 bits', units: cuda(12800), iface: 'PCIe 4.0 x16', tdp: '250 W', tags: PROIA, ref: true },
  'rtxpro4000': { vendor: 'NVIDIA', label: 'RTX PRO 4000 Blackwell', family: 'RTX PRO Blackwell', year: 2025, vram: 24, mem: 'GDDR7 ECC', bus: '192 bits', units: cuda(8960), iface: 'PCIe 5.0 x16', tdp: '140 W', tags: PROIA, ref: true },
  'rtxpro4500': { vendor: 'NVIDIA', label: 'RTX PRO 4500 Blackwell', family: 'RTX PRO Blackwell', year: 2025, vram: 32, mem: 'GDDR7 ECC', bus: '256 bits', units: cuda(10496), iface: 'PCIe 5.0 x16', tdp: '200 W', tags: PROIA, ref: true },
  'rtxpro5000': { vendor: 'NVIDIA', label: 'RTX PRO 5000 Blackwell', family: 'RTX PRO Blackwell', year: 2025, vram: 48, mem: 'GDDR7 ECC', bus: '384 bits', units: cuda(14080), iface: 'PCIe 5.0 x16', tdp: '300 W', tags: PROIA, ref: true },
  'rtxpro6000': { vendor: 'NVIDIA', label: 'RTX PRO 6000 Blackwell', family: 'RTX PRO Blackwell', year: 2025, vram: 96, mem: 'GDDR7 ECC', bus: '512 bits', units: cuda(24064), iface: 'PCIe 5.0 x16', tdp: '600 W', tags: PROIA, ref: true },

  // ─── Cartes pro AMD / Intel ───────────────────────────────────────────────
  'w5700': { vendor: 'AMD', label: 'Radeon Pro W5700', family: 'Radeon Pro', year: 2019, vram: 8, mem: 'GDDR6', bus: '256 bits', units: cu(36), iface: 'PCIe 4.0 x16', tdp: '205 W', tags: PRO, refurb: true, ref: true },
  'w6600': { vendor: 'AMD', label: 'Radeon Pro W6600', family: 'Radeon Pro', year: 2021, vram: 8, mem: 'GDDR6', bus: '128 bits', units: cu(28), iface: 'PCIe 4.0 x8', tdp: '100 W', tags: PRO, refurb: true, ref: true },
  'w6800': { vendor: 'AMD', label: 'Radeon Pro W6800', family: 'Radeon Pro', year: 2021, vram: 32, mem: 'GDDR6 ECC', bus: '256 bits', units: cu(60), iface: 'PCIe 4.0 x16', tdp: '250 W', tags: PROIA, refurb: true, ref: true },
  'w7600': { vendor: 'AMD', label: 'Radeon Pro W7600', family: 'Radeon Pro', year: 2023, vram: 8, mem: 'GDDR6', bus: '128 bits', units: cu(32), iface: 'PCIe 4.0 x8', tdp: '130 W', tags: PRO, ref: true },
  'w7700': { vendor: 'AMD', label: 'Radeon Pro W7700', family: 'Radeon Pro', year: 2023, vram: 16, mem: 'GDDR6 ECC', bus: '256 bits', units: cu(48), iface: 'PCIe 4.0 x16', tdp: '190 W', tags: PRO, ref: true },
  'w7800': { vendor: 'AMD', label: 'Radeon Pro W7800', family: 'Radeon Pro', year: 2023, vram: 32, mem: 'GDDR6 ECC', bus: '256 bits', units: cu(70), iface: 'PCIe 4.0 x16', tdp: '260 W', tags: PROIA, ref: true },
  'w7900': { vendor: 'AMD', label: 'Radeon Pro W7900', family: 'Radeon Pro', year: 2023, vram: 48, mem: 'GDDR6 ECC', bus: '384 bits', units: cu(96), iface: 'PCIe 4.0 x16', tdp: '295 W', tags: PROIA, ref: true },
  'r9700': { vendor: 'AMD', label: 'Radeon AI PRO R9700', family: 'Radeon AI PRO', year: 2025, vram: 32, mem: 'GDDR6', bus: '256 bits', units: cu(64), iface: 'PCIe 5.0 x16', tdp: '300 W', tags: ['ia', 'pro', 'creation'], ref: true },
  'mi210': { vendor: 'AMD', label: 'Instinct MI210', family: 'Instinct', year: 2022, vram: 64, mem: 'HBM2e ECC', bus: '4096 bits', units: cu(104), iface: 'PCIe 4.0 x16', tdp: '300 W', tags: DC, ref: true },
  'mi300x': { vendor: 'AMD', label: 'Instinct MI300X', family: 'Instinct', year: 2023, vram: 192, mem: 'HBM3', bus: '8192 bits', units: cu(304), iface: 'OAM', tdp: '750 W', tags: DC, ref: true },
  'arcproa40': { vendor: 'Intel', label: 'Arc Pro A40', family: 'Arc Pro', year: 2022, vram: 6, mem: 'GDDR6', bus: '96 bits', units: xe(8), iface: 'PCIe 4.0 x8', tdp: '50 W', tags: ['pro', 'bureautique'], ref: true },
  'arcproa50': { vendor: 'Intel', label: 'Arc Pro A50', family: 'Arc Pro', year: 2022, vram: 6, mem: 'GDDR6', bus: '96 bits', units: xe(8), iface: 'PCIe 4.0 x8', tdp: '75 W', tags: PRO, ref: true },
  'arcproa60': { vendor: 'Intel', label: 'Arc Pro A60', family: 'Arc Pro', year: 2023, vram: 12, mem: 'GDDR6', bus: '192 bits', units: xe(16), iface: 'PCIe 4.0 x16', tdp: '130 W', tags: PRO, ref: true },
  'arcprob50': { vendor: 'Intel', label: 'Arc Pro B50', family: 'Arc Pro', year: 2025, vram: 16, mem: 'GDDR6', bus: '128 bits', units: xe2(16), iface: 'PCIe 5.0 x8', tdp: '70 W', tags: ['pro', 'creation', 'ia'], ref: true },
  'arcprob60': { vendor: 'Intel', label: 'Arc Pro B60', family: 'Arc Pro', year: 2025, vram: 24, mem: 'GDDR6', bus: '192 bits', units: xe2(20), iface: 'PCIe 5.0 x8', tags: ['pro', 'ia'], ref: true },

  // ─── Data center NVIDIA ───────────────────────────────────────────────────
  'k80': { vendor: 'NVIDIA', label: 'Tesla K80', family: 'Data Center Kepler', year: 2014, vram: 24, mem: 'GDDR5', bus: '2x 384 bits', units: cuda(4992), iface: 'PCIe 3.0 x16', tdp: '300 W', tags: ['serveur', 'homelab', 'budget'], refurb: true, ref: true },
  'm40': { vendor: 'NVIDIA', label: 'Tesla M40 24 Go', family: 'Data Center Maxwell', year: 2015, vram: 24, mem: 'GDDR5', bus: '384 bits', units: cuda(3072), iface: 'PCIe 3.0 x16', tdp: '250 W', tags: ['ia', 'serveur', 'homelab', 'budget'], refurb: true, ref: true, refName: 'NVIDIA Tesla M40 24 Go' },
  'p4': { vendor: 'NVIDIA', label: 'Tesla P4', family: 'Data Center Pascal', year: 2016, vram: 8, mem: 'GDDR5', bus: '256 bits', units: cuda(2560), iface: 'PCIe 3.0 x16', tdp: '75 W', tags: ['serveur', 'homelab'], refurb: true, ref: true },
  'p100': { vendor: 'NVIDIA', label: 'Tesla P100 PCIe 16 Go', family: 'Data Center Pascal', year: 2016, vram: 16, mem: 'HBM2', bus: '4096 bits', units: cuda(3584), iface: 'PCIe 3.0 x16', tdp: '250 W', tags: ['ia', 'serveur', 'homelab'], refurb: true, ref: true, refName: 'NVIDIA Tesla P100 PCIe 16 Go' },
  'v100-16': { vendor: 'NVIDIA', label: 'Tesla V100 PCIe 16 Go', family: 'Data Center Volta', year: 2017, vram: 16, mem: 'HBM2', bus: '4096 bits', units: cuda(5120), iface: 'PCIe 3.0 x16', tdp: '250 W', tags: DC, refurb: true, ref: true, refName: 'NVIDIA Tesla V100 PCIe 16 Go' },
  'v100-32': { vendor: 'NVIDIA', label: 'Tesla V100 PCIe 32 Go', family: 'Data Center Volta', year: 2018, vram: 32, mem: 'HBM2', bus: '4096 bits', units: cuda(5120), iface: 'PCIe 3.0 x16', tdp: '250 W', tags: DC, refurb: true, ref: true, refName: 'NVIDIA Tesla V100 PCIe 32 Go' },
  'a2': { vendor: 'NVIDIA', label: 'A2', family: 'Data Center Ampere', year: 2021, vram: 16, mem: 'GDDR6', bus: '128 bits', units: cuda(1280), iface: 'PCIe 4.0 x8', tdp: '60 W', tags: ['ia', 'serveur', 'homelab'], refurb: true, ref: true, refName: 'NVIDIA A2 16 Go' },
  'a10': { vendor: 'NVIDIA', label: 'A10', family: 'Data Center Ampere', year: 2021, vram: 24, mem: 'GDDR6', bus: '384 bits', units: cuda(9216), iface: 'PCIe 4.0 x16', tdp: '150 W', tags: DC, refurb: true, ref: true, refName: 'NVIDIA A10 24 Go' },
  'a16': { vendor: 'NVIDIA', label: 'A16', family: 'Data Center Ampere', year: 2021, vram: 64, mem: 'GDDR6', bus: '4x 128 bits', units: cuda(5120), iface: 'PCIe 4.0 x16', tdp: '250 W', tags: ['serveur', 'pro'], ref: true, refName: 'NVIDIA A16 64 Go' },
  'a30': { vendor: 'NVIDIA', label: 'A30', family: 'Data Center Ampere', year: 2021, vram: 24, mem: 'HBM2', bus: '3072 bits', units: cuda(3584), iface: 'PCIe 4.0 x16', tdp: '165 W', tags: DC, refurb: true, ref: true, refName: 'NVIDIA A30 24 Go' },
  'a40': { vendor: 'NVIDIA', label: 'A40', family: 'Data Center Ampere', year: 2020, vram: 48, mem: 'GDDR6 ECC', bus: '384 bits', units: cuda(10752), iface: 'PCIe 4.0 x16', tdp: '300 W', tags: DC, refurb: true, ref: true, refName: 'NVIDIA A40 48 Go' },
  'a100-40': { vendor: 'NVIDIA', label: 'A100 PCIe', family: 'Data Center Ampere', year: 2020, vram: 40, mem: 'HBM2', bus: '5120 bits', units: cuda(6912), iface: 'PCIe 4.0 x16', tdp: '250 W', tags: DC, refurb: true, ref: true, refName: 'NVIDIA A100 PCIe 40 Go' },
  'a100-80': { vendor: 'NVIDIA', label: 'A100 PCIe', family: 'Data Center Ampere', year: 2021, vram: 80, mem: 'HBM2e', bus: '5120 bits', units: cuda(6912), iface: 'PCIe 4.0 x16', tdp: '300 W', tags: DC, refurb: true, ref: true, refName: 'NVIDIA A100 PCIe 80 Go' },
  'a100sxm-80': { vendor: 'NVIDIA', label: 'A100 SXM4', family: 'Data Center Ampere', year: 2020, vram: 80, mem: 'HBM2e', bus: '5120 bits', units: cuda(6912), iface: 'SXM4', tdp: '400 W', tags: DC, ref: true, refName: 'NVIDIA A100 SXM4 80 Go' },
  'l4': { vendor: 'NVIDIA', label: 'L4', family: 'Data Center Ada', year: 2023, vram: 24, mem: 'GDDR6', bus: '192 bits', units: cuda(7424), iface: 'PCIe 4.0 x16', tdp: '72 W', tags: ['ia', 'serveur', 'homelab'], ref: true, refName: 'NVIDIA L4 24 Go' },
  'l40': { vendor: 'NVIDIA', label: 'L40', family: 'Data Center Ada', year: 2022, vram: 48, mem: 'GDDR6 ECC', bus: '384 bits', units: cuda(18176), iface: 'PCIe 4.0 x16', tdp: '300 W', tags: DC, ref: true, refName: 'NVIDIA L40 48 Go' },
  'h100sxm': { vendor: 'NVIDIA', label: 'H100 SXM5', family: 'Data Center Hopper', year: 2022, vram: 80, mem: 'HBM3', bus: '5120 bits', units: cuda(16896), iface: 'SXM5', tdp: '700 W', tags: DC, ref: true, refName: 'NVIDIA H100 SXM5 80 Go' },
  'h100nvl': { vendor: 'NVIDIA', label: 'H100 NVL', family: 'Data Center Hopper', year: 2023, vram: 94, mem: 'HBM3', bus: '6144 bits', units: cuda(16896), iface: 'PCIe 5.0 x16', tdp: '400 W', tags: DC, ref: true, refName: 'NVIDIA H100 NVL 94 Go' },
  'h200sxm': { vendor: 'NVIDIA', label: 'H200 SXM', family: 'Data Center Hopper', year: 2024, vram: 141, mem: 'HBM3e', bus: '6144 bits', units: cuda(16896), iface: 'SXM5', tdp: '700 W', tags: DC, ref: true, refName: 'NVIDIA H200 SXM 141 Go' },
  'h200nvl': { vendor: 'NVIDIA', label: 'H200 NVL', family: 'Data Center Hopper', year: 2024, vram: 141, mem: 'HBM3e', bus: '6144 bits', units: cuda(16896), iface: 'PCIe 5.0 x16', tdp: '600 W', tags: DC, ref: true, refName: 'NVIDIA H200 NVL 141 Go' },
};

export function slug(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\+/g, ' plus ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function chipSpecs(c: GpuChip, full: boolean): Record<string, string> {
  const s: Record<string, string> = {
    'VRAM': `${c.vram} Go`,
    'Type de mémoire': c.mem,
    'Bus mémoire': c.bus,
    'Unités de calcul': c.units,
  };
  if (full && c.boost) s['Fréquence boost'] = c.boost;
  if (full && c.tdp) s['TDP'] = c.tdp;
  if (full && c.psu) s['Alimentation recommandée'] = c.psu;
  s['Interface'] = c.iface;
  return s;
}

/**
 * Carte partenaire : `pattern` contient `{gpu}` (remplacé par le libellé de la puce) ;
 * le nom final est « Marque pattern VRAM ». Fréquence et TDP (propres à chaque modèle usine)
 * ne sont pas repris.
 */
export function board(brand: string, pattern: string, chipKey: string, extra: Partial<CatalogProduct> = {}): CatalogProduct {
  const c = CHIPS[chipKey];
  if (!c) throw new Error(`Puce GPU inconnue : ${chipKey}`);
  const name = `${brand} ${pattern.replace('{gpu}', c.label)} ${c.vram} Go`;
  return {
    id: `gpu-${slug(name)}`,
    category: 'gpu',
    brand,
    name,
    family: c.family,
    year: c.year,
    ...(c.refurb ? { refurbishable: true } : {}),
    tags: [...c.tags],
    specs: chipSpecs(c, false),
    ...extra,
  };
}

/** Construit une série de cartes partenaires pour une même gamme. */
export function series(brand: string, pattern: string, chipKeys: string[]): CatalogProduct[] {
  return chipKeys.map((k) => board(brand, pattern, k));
}

function reference(_key: string, c: GpuChip): CatalogProduct {
  const name = c.refName ?? `${c.vendor} ${c.label}`;
  return {
    id: `gpu-${slug(name)}`,
    category: 'gpu',
    brand: c.vendor,
    name,
    family: c.family,
    year: c.year,
    ...(c.msrp ? { msrp: c.msrp } : {}),
    ...(c.refurb ? { refurbishable: true } : {}),
    tags: [...c.tags],
    specs: chipSpecs(c, true),
  };
}

export const PRODUCTS: CatalogProduct[] = Object.entries(CHIPS)
  .filter(([, c]) => c.ref)
  .map(([k, c]) => reference(k, c));
