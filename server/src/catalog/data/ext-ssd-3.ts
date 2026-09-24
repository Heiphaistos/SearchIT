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
const M2S = 'M.2 2280 (SATA)';
const G3 = 'PCIe 3.0 x4 NVMe';
const G4 = 'PCIe 4.0 x4 NVMe';
const G5 = 'PCIe 5.0 x4 NVMe';

const CR = 'Crucial';
const KG = 'Kingston';
const T3 = 'TLC 3D';
const Q3 = 'QLC 3D';
const DR = 'Oui';
const NO = 'Non';
const HMB = 'Non (HMB)';
const cons = ['bureautique', 'budget'];
const game = ['gaming', 'creation'];
const ent = ['serveur', 'pro'];
const HS = 'M.2 2280 avec dissipateur';

/** Crucial et Kingston : SATA, NVMe grand public et entreprise. */
export const PRODUCTS: CatalogProduct[] = [
  // ─── Crucial SATA ───
  ...line({ brand: CR, model: 'MX300', family: 'Crucial MX', year: 2016, iface: SATA, format: F25, nand: T3, dram: DR, tags: cons, refurb: true },
    [[275, 530, 500, 80], [525, 530, 510, 160], [750, 530, 510, 220], [1050, 530, 510, 360], [2050, 530, 510, 400]]),
  ...line({ brand: CR, model: 'MX500', family: 'Crucial MX', year: 2018, iface: SATA, format: F25, nand: T3, dram: DR, tags: cons, refurb: true },
    [[250, 560, 510, 100, 69], [500, 560, 510, 180, 109], [4000, 560, 510, 1000, 0, 2020]]),
  ...line({ brand: CR, model: 'MX500 M.2', family: 'Crucial MX', year: 2018, iface: SATA, format: M2S, nand: T3, dram: DR, tags: cons, refurb: true },
    [[250, 560, 510, 100], [500, 560, 510, 180], [1000, 560, 510, 360], [2000, 560, 510, 700]]),
  ...line({ brand: CR, model: 'BX500', family: 'Crucial BX', year: 2018, iface: SATA, format: F25, nand: T3, dram: NO, tags: cons, refurb: true },
    [[120, 540, 500, 40, 29], [240, 540, 500, 80, 39], [480, 540, 500, 120, 59], [1000, 540, 500, 360, 0, 2019], [2000, 540, 500, 720, 0, 2020]]),

  // ─── Crucial NVMe ───
  ...line({ brand: CR, model: 'P1', family: 'Crucial P', year: 2018, iface: G3, format: M2, nand: Q3, dram: DR, tags: cons, refurb: true },
    [[500, 1900, 950, 100], [1000, 2000, 1700, 200], [2000, 2000, 1700, 400, 0, 2019]]),
  ...line({ brand: CR, model: 'P2', family: 'Crucial P', year: 2020, iface: G3, format: M2, dram: NO, tags: cons, refurb: true },
    [[250, 2100], [500, 2300], [1000, 2400], [2000, 2400]]),
  ...line({ brand: CR, model: 'P3', family: 'Crucial P', year: 2022, iface: G3, format: M2, nand: Q3, dram: NO, tags: cons, refurb: true },
    [[500, 3500, 1900, 110], [1000, 3500, 3000, 220], [2000, 3500, 3000, 440], [4000, 3500, 3000, 800]]),
  ...line({ brand: CR, model: 'P3 Plus', family: 'Crucial P', year: 2022, iface: G4, format: M2, nand: Q3, dram: NO, tags: ['bureautique', 'budget', 'gaming'], refurb: true },
    [[500, 4700, 1900, 110], [4000, 4800, 4100, 800]]),
  ...line({ brand: CR, model: 'P5', family: 'Crucial P', year: 2020, iface: G3, format: M2, nand: T3, dram: DR, tags: game, refurb: true },
    [[250, 3400, 1400, 150], [500, 3400, 3000, 300], [1000, 3400, 3000, 600], [2000, 3400, 3000, 1200, 0, 2021]]),
  ...line({ brand: CR, model: 'P5 Plus', family: 'Crucial P', year: 2021, iface: G4, format: M2, nand: T3, dram: DR, tags: game, refurb: true },
    [[500, 6600, 4000, 300], [1000, 6600, 5000, 600], [2000, 6600, 5000, 1200]]),
  ...line({ brand: CR, model: 'P310', family: 'Crucial P', year: 2024, iface: G4, format: 'M.2 2230', dram: HMB, tags: ['gaming', 'mobile'] },
    [[500, 5000], [1000, 7100], [2000, 7100]]),
  ...line({ brand: CR, model: 'T500', family: 'Crucial T', year: 2023, iface: G4, format: M2, nand: T3, dram: DR, tags: game },
    [[500, 7200, 5700, 300], [4000, 7400, 7000, 2400, 0, 2024]]),
  ...line({ brand: CR, model: 'T500 Heatsink', family: 'Crucial T', year: 2023, iface: G4, format: HS, nand: T3, dram: DR, tags: game },
    [[1000, 7300, 6800, 600], [2000, 7400, 7000, 1200]]),
  ...line({ brand: CR, model: 'T700', family: 'Crucial T', year: 2023, iface: G5, format: M2, nand: T3, dram: DR, tags: game },
    [[4000, 12400, 11800, 2400]]),
  ...line({ brand: CR, model: 'T700 Heatsink', family: 'Crucial T', year: 2023, iface: G5, format: HS, nand: T3, dram: DR, tags: game },
    [[1000, 11700, 9500, 600], [2000, 12400, 11800, 1200], [4000, 12400, 11800, 2400]]),
  ...line({ brand: CR, model: 'T705', family: 'Crucial T', year: 2024, iface: G5, format: M2, nand: T3, dram: DR, tags: game },
    [[4000, 14500, 12700, 2400]]),
  ...line({ brand: CR, model: 'T705 Heatsink', family: 'Crucial T', year: 2024, iface: G5, format: HS, nand: T3, dram: DR, tags: game },
    [[1000, 13600, 10200, 600], [2000, 14500, 12700, 1200], [4000, 14500, 12700, 2400]]),

  // ─── Kingston SATA ───
  ...line({ brand: KG, model: 'UV500', family: 'Kingston UV', year: 2018, iface: SATA, format: F25, nand: T3, dram: DR, tags: cons, refurb: true },
    [[120, 520], [240, 520], [480, 520], [960, 520], [1920, 520]]),
  ...line({ brand: KG, model: 'A400', family: 'Kingston A400', year: 2017, iface: SATA, format: F25, nand: 'TLC', dram: NO, tags: cons, refurb: true },
    [[120, 500, 320, 40, 29], [240, 500, 350, 80, 35], [480, 500, 450, 160, 59], [960, 500, 450, 300, 0, 2018], [1920, 500, 450, 600, 0, 2019]]),
  ...line({ brand: KG, model: 'A400 M.2', family: 'Kingston A400', year: 2019, iface: SATA, format: M2S, nand: 'TLC', dram: NO, tags: cons, refurb: true },
    [[240, 500, 350, 80], [480, 500, 450, 160], [960, 500, 450, 300]]),
  ...line({ brand: KG, model: 'KC600', family: 'Kingston KC', year: 2019, iface: SATA, format: F25, nand: T3, dram: DR, tags: ['bureautique', 'pro'], refurb: true },
    [[256, 550, 500, 150], [512, 550, 520, 300], [1000, 550, 520, 600], [2000, 550, 520, 1200]]),

  // ─── Kingston NVMe ───
  ...line({ brand: KG, model: 'A2000', family: 'Kingston A', year: 2019, iface: G3, format: M2, nand: T3, dram: DR, tags: cons, refurb: true },
    [[250, 2000, 1100, 150], [500, 2200, 2000, 350], [1000, 2200, 2000, 600]]),
  ...line({ brand: KG, model: 'KC2500', family: 'Kingston KC', year: 2020, iface: G3, format: M2, nand: T3, dram: DR, tags: ['bureautique', 'pro'], refurb: true },
    [[250, 3500, 1200, 150], [500, 3500, 2500, 300], [1000, 3500, 2900, 600], [2000, 3500, 2900, 1200]]),
  ...line({ brand: KG, model: 'NV1', family: 'Kingston NV', year: 2021, iface: G3, format: M2, dram: NO, tags: cons, refurb: true },
    [[500, 2100, 1700], [1000, 2100, 1700], [2000, 2100, 1700]]),
  ...line({ brand: KG, model: 'NV2', family: 'Kingston NV', year: 2022, iface: G4, format: M2, dram: NO, tags: cons, refurb: true },
    [[250, 3000, 1300, 80], [500, 3500, 2100, 160], [1000, 3500, 2100, 320], [2000, 3500, 2800, 640], [4000, 3500, 2800, 1280]]),
  ...line({ brand: KG, model: 'NV3', family: 'Kingston NV', year: 2024, iface: G4, format: M2, dram: NO, tags: cons },
    [[500, 5000, 3000, 160], [4000, 6000, 5000, 1280]]),
  ...line({ brand: KG, model: 'KC3000', family: 'Kingston KC', year: 2021, iface: G4, format: M2, nand: T3, dram: DR, tags: game, refurb: true },
    [[512, 7000, 3900, 400], [4000, 7000, 7000, 3200]]),
  ...line({ brand: KG, model: 'Fury Renegade', family: 'Kingston Fury', year: 2021, iface: G4, format: M2, nand: T3, dram: DR, tags: game, refurb: true },
    [[500, 7300, 3900, 500], [4000, 7300, 7000, 4000]]),
  ...line({ brand: KG, model: 'Fury Renegade Heatsink', family: 'Kingston Fury', year: 2022, iface: G4, format: HS, nand: T3, dram: DR, tags: game },
    [[1000, 7300, 6000, 1000], [2000, 7300, 7000, 2000], [4000, 7300, 7000, 4000]]),
  ...line({ brand: KG, model: 'Fury Renegade G5', family: 'Kingston Fury', year: 2025, iface: G5, format: M2, nand: T3, dram: DR, tags: game },
    [[1000], [2000], [4000]]),

  // ─── Kingston entreprise ───
  ...line({ brand: KG, model: 'DC600M', family: 'Kingston Data Center', year: 2023, iface: SATA, format: F25, nand: T3, dram: DR, tags: ent },
    [[480, 560], [960, 560], [1920, 560], [3840, 560], [7680, 560]]),
];
