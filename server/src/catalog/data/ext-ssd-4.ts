import type { CatalogProduct } from '../types.js';

/** Gamme de SSD : caractéristiques communes à toutes les capacités. */
interface Line {
  brand: string;
  /** Nom commercial sans la marque ni la capacité. */
  model: string;
  family: string;
  year: number;
  iface: string;
  format: string;
  nand?: string;
  dram?: string;
  tags: string[];
  refurb?: boolean;
  /** Suffixe ajouté après la capacité (ex. « U.2 »). */
  suffix?: string;
}

/** Variante : [capacité en Go, lecture Mo/s, écriture Mo/s, endurance To écrits, prix de lancement €, année]. 0 = inconnu. */
type V = [number, number?, number?, number?, number?, number?];

const num = (x: number): string => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const capLabel = (go: number): string =>
  go < 1000 || go === 1050 || go === 2050 ? `${go} Go` : `${String(go / 1000).replace('.', ',')} To`;
const capSlug = (go: number): string =>
  go < 1000 || go === 1050 || go === 2050 ? `${go}go` : `${String(go / 1000).replace('.', '-')}to`;
const slug = (s: string): string =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function line(l: Line, variants: V[]): CatalogProduct[] {
  return variants.map(([cap, read, write, tbw, msrp, year]) => {
    const specs: Record<string, string | number> = { 'Capacité': capLabel(cap), 'Interface': l.iface, 'Format': l.format };
    if (read) specs['Lecture séquentielle'] = `${num(read)} Mo/s`;
    if (write) specs['Écriture séquentielle'] = `${num(write)} Mo/s`;
    if (tbw) specs['Endurance'] = `${num(tbw)} To écrits`;
    if (l.nand) specs['Type de NAND'] = l.nand;
    if (l.dram) specs['Cache DRAM'] = l.dram;
    const p: CatalogProduct = {
      id: `ssd-${slug(l.brand)}-${slug(l.model)}-${capSlug(cap)}${l.suffix ? '-' + slug(l.suffix) : ''}`,
      category: 'ssd',
      brand: l.brand,
      name: `${l.brand} ${l.model} ${capLabel(cap)}${l.suffix ? ' ' + l.suffix : ''}`,
      family: l.family,
      year: year || l.year,
      specs,
      tags: l.tags,
    };
    if (msrp) p.msrp = msrp;
    if (l.refurb) p.refurbishable = true;
    return p;
  });
}

const SATA = 'SATA III 6 Gb/s';
const F25 = '2,5 pouces';
const M2 = 'M.2 2280';
const G3 = 'PCIe 3.0 x4 NVMe';
const G4 = 'PCIe 4.0 x4 NVMe';
const G5 = 'PCIe 5.0 x4 NVMe';

const SG = 'Seagate';
const MI = 'Micron';
const IN = 'Intel';
const SO = 'Solidigm';
const T3 = 'TLC 3D';
const Q3 = 'QLC 3D';
const DR = 'Oui';
const cons = ['bureautique', 'budget'];
const game = ['gaming', 'creation'];
const ent = ['serveur', 'pro'];
const nas = ['nas', 'homelab'];
const HS = 'M.2 2280 avec dissipateur';
const U2 = 'U.2 2,5 pouces';
const U3 = 'U.3 2,5 pouces';

/** Seagate, Micron, Intel et Solidigm : grand public, NAS et datacenter. */
export const PRODUCTS: CatalogProduct[] = [
  // ─── Seagate grand public ───
  ...line({ brand: SG, model: 'BarraCuda SSD', family: 'BarraCuda SSD', year: 2019, iface: SATA, format: F25, nand: T3, dram: DR, tags: cons, refurb: true },
    [[250, 560, 540], [500, 560, 540], [1000, 560, 540], [2000, 560, 540]]),
  ...line({ brand: SG, model: 'BarraCuda Q5', family: 'BarraCuda SSD', year: 2020, iface: G3, format: M2, nand: Q3, tags: cons, refurb: true },
    [[500, 2300], [1000, 2400], [2000, 2400]]),
  ...line({ brand: SG, model: 'FireCuda 520', family: 'FireCuda SSD', year: 2019, iface: G4, format: M2, nand: T3, dram: DR, tags: game, refurb: true },
    [[500, 5000, 2500, 850], [1000, 5000, 4400, 1800], [2000, 5000, 4400, 3600]]),
  ...line({ brand: SG, model: 'FireCuda 530', family: 'FireCuda SSD', year: 2021, iface: G4, format: M2, nand: T3, dram: DR, tags: game, refurb: true },
    [[500, 7000, 3000, 640], [1000, 7300, 6000, 1275], [2000, 7300, 6900, 2550], [4000, 7300, 6900, 5100]]),
  ...line({ brand: SG, model: 'FireCuda 530 Heatsink', family: 'FireCuda SSD', year: 2021, iface: G4, format: HS, nand: T3, dram: DR, tags: game, refurb: true },
    [[1000, 7300, 6000, 1275], [2000, 7300, 6900, 2550], [4000, 7300, 6900, 5100]]),
  ...line({ brand: SG, model: 'FireCuda 540', family: 'FireCuda SSD', year: 2023, iface: G5, format: M2, nand: T3, dram: DR, tags: game },
    [[1000, 10000, 0, 1000], [2000, 10000, 10000, 2000]]),

  // ─── Seagate NAS ───
  ...line({ brand: SG, model: 'IronWolf 110', family: 'IronWolf SSD', year: 2019, iface: SATA, format: F25, nand: T3, dram: DR, tags: nas, refurb: true },
    [[240, 560], [480, 560], [960, 560], [1920, 560], [3840, 560]]),
  ...line({ brand: SG, model: 'IronWolf 125', family: 'IronWolf SSD', year: 2020, iface: SATA, format: F25, nand: T3, dram: DR, tags: nas, refurb: true },
    [[250, 560, 540, 350], [500, 560, 540, 700], [1000, 560, 540, 1400], [2000, 560, 540, 2800], [4000, 560, 540, 5600]]),
  ...line({ brand: SG, model: 'IronWolf 525', family: 'IronWolf SSD', year: 2021, iface: G4, format: M2, nand: T3, dram: DR, tags: nas },
    [[500]]),

  // ─── Micron OEM / grand public ───
  ...line({ brand: MI, model: '2300', family: 'Micron OEM', year: 2019, iface: G3, format: M2, nand: T3, dram: DR, tags: ['bureautique'], refurb: true },
    [[256], [512], [1000], [2000]]),

  // ─── Micron datacenter ───
  ...line({ brand: MI, model: '5400 PRO', family: 'Micron 5400', year: 2022, iface: SATA, format: F25, nand: T3, dram: DR, tags: ent, refurb: true },
    [[240, 540], [480, 540], [960, 540], [1920, 540], [3840, 540], [7680, 540]]),
  ...line({ brand: MI, model: '7450 PRO', family: 'Micron 7450', year: 2022, iface: G4, format: U3, nand: T3, dram: DR, tags: ent, refurb: true, suffix: 'U.3' },
    [[960], [1920], [7680], [15360]]),

  // ─── Intel grand public ───
  ...line({ brand: IN, model: 'SSD 545s', family: 'Intel SATA', year: 2017, iface: SATA, format: F25, nand: T3, dram: DR, tags: cons, refurb: true },
    [[128, 550], [256, 550, 500], [512, 550, 500]]),
  ...line({ brand: IN, model: 'SSD 760p', family: 'Intel NVMe', year: 2018, iface: G3, format: M2, nand: T3, dram: DR, tags: cons, refurb: true },
    [[128, 1640], [256, 3210], [512, 3230], [1000, 3230], [2000, 3230]]),
  ...line({ brand: IN, model: 'SSD 660p', family: 'Intel NVMe', year: 2018, iface: G3, format: M2, nand: Q3, dram: DR, tags: cons, refurb: true },
    [[512, 1500, 1000, 100], [1000, 1800, 1800, 200], [2000, 1800, 1800, 400]]),
  ...line({ brand: IN, model: 'SSD 665p', family: 'Intel NVMe', year: 2019, iface: G3, format: M2, nand: Q3, dram: DR, tags: cons, refurb: true },
    [[1000, 2000], [2000, 2000]]),
  ...line({ brand: IN, model: 'SSD 670p', family: 'Intel NVMe', year: 2021, iface: G3, format: M2, nand: Q3, dram: DR, tags: cons, refurb: true },
    [[512, 3000, 1600, 185], [1000, 3500, 2500, 370], [2000, 3500, 2500, 740]]),
  ...line({ brand: IN, model: 'Optane SSD 900P', family: 'Intel Optane', year: 2017, iface: G3, format: 'Carte PCIe HHHL', nand: '3D XPoint', tags: ['creation', 'homelab'], refurb: true },
    [[280, 2500, 2000], [480, 2500, 2000]]),
  ...line({ brand: IN, model: 'Optane SSD 905P', family: 'Intel Optane', year: 2018, iface: G3, format: 'Carte PCIe HHHL', nand: '3D XPoint', tags: ['creation', 'homelab'], refurb: true },
    [[480, 2600, 2200], [960, 2600, 2200], [1500, 2600, 2200]]),

  // ─── Intel datacenter ───
  ...line({ brand: IN, model: 'SSD DC P4510', family: 'Intel DC NVMe', year: 2018, iface: G3, format: U2, nand: T3, dram: DR, tags: ent, refurb: true, suffix: 'U.2' },
    [[1000], [2000], [4000], [8000]]),

  // ─── Solidigm ───
  ...line({ brand: SO, model: 'P41 Plus', family: 'Solidigm P4', year: 2022, iface: G4, format: M2, nand: Q3, dram: 'Non (HMB)', tags: cons },
    [[512, 4125], [1000, 4125], [2000, 4125]]),
  ...line({ brand: SO, model: 'P44 Pro', family: 'Solidigm P4', year: 2022, iface: G4, format: M2, nand: T3, dram: DR, tags: game },
    [[512]]),
  ...line({ brand: SO, model: 'D3-S4520', family: 'Solidigm D3', year: 2021, iface: SATA, format: F25, nand: T3, dram: DR, tags: ent, refurb: true },
    [[240, 550], [480, 550], [960, 550], [1920, 550], [3840, 550], [7680, 550]]),
  ...line({ brand: SO, model: 'D7-P5520', family: 'Solidigm D7', year: 2021, iface: G4, format: U2, nand: T3, dram: DR, tags: ent, refurb: true, suffix: 'U.2' },
    [[1920], [3840], [7680], [15360]]),
];
