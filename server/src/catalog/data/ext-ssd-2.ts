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

const WD = 'WD';
const SD = 'SanDisk';
const T3 = 'TLC 3D';
const DR = 'Oui';
const NO = 'Non';
const HMB = 'Non (HMB)';
const cons = ['bureautique', 'budget'];
const game = ['gaming', 'creation'];
const nas = ['nas', 'homelab'];
const HS = 'M.2 2280 avec dissipateur';

/** Western Digital et SanDisk : SATA, NVMe grand public, NAS et OEM. */
export const PRODUCTS: CatalogProduct[] = [
  // ─── WD Blue / Green SATA ───
  ...line({ brand: WD, model: 'Blue 3D NAND', family: 'WD Blue SATA', year: 2017, iface: SATA, format: F25, nand: T3, dram: DR, tags: cons, refurb: true },
    [[250, 550, 525, 100, 89], [500, 560, 530, 200, 159], [1000, 560, 530, 400, 309], [2000, 560, 530, 500, 699], [4000, 560, 530, 600, 0, 2019]]),
  ...line({ brand: WD, model: 'Blue 3D NAND M.2', family: 'WD Blue SATA', year: 2017, iface: SATA, format: M2S, nand: T3, dram: DR, tags: cons, refurb: true },
    [[250, 550, 525, 100], [500, 560, 530, 200], [1000, 560, 530, 400], [2000, 560, 530, 500]]),
  ...line({ brand: WD, model: 'Blue SA510', family: 'WD Blue SATA', year: 2022, iface: SATA, format: F25, nand: T3, tags: cons, refurb: true },
    [[250, 555, 440], [500, 560, 510], [1000, 560, 520], [2000, 560, 520]]),
  ...line({ brand: WD, model: 'Green SN350', family: 'WD Green NVMe', year: 2021, iface: G3, format: M2, dram: HMB, tags: cons, refurb: true },
    [[240, 2400], [480, 2400], [1000, 3200], [2000, 3200]]),

  // ─── WD Blue NVMe ───
  ...line({ brand: WD, model: 'Blue SN500', family: 'WD Blue NVMe', year: 2019, iface: 'PCIe 3.0 x2 NVMe', format: M2, nand: T3, dram: HMB, tags: cons, refurb: true },
    [[250, 1700, 1300, 150], [500, 1700, 1450, 300]]),
  ...line({ brand: WD, model: 'Blue SN550', family: 'WD Blue NVMe', year: 2020, iface: G3, format: M2, nand: T3, dram: HMB, tags: cons, refurb: true },
    [[250, 2400, 950, 150, 55], [500, 2400, 1750, 300, 69], [1000, 2400, 1950, 600, 119], [2000, 2600, 1800, 900, 0, 2021]]),
  ...line({ brand: WD, model: 'Blue SN570', family: 'WD Blue NVMe', year: 2021, iface: G3, format: M2, nand: T3, dram: HMB, tags: ['bureautique', 'budget', 'gaming'], refurb: true },
    [[250, 3300, 1200, 150, 49], [500, 3500, 2300, 300, 69], [1000, 3500, 3000, 600, 119], [2000, 3500, 3500, 900, 0, 2022]]),
  ...line({ brand: WD, model: 'Blue SN580', family: 'WD Blue NVMe', year: 2023, iface: G4, format: M2, nand: T3, dram: HMB, tags: ['bureautique', 'budget', 'gaming'], refurb: true },
    [[250, 4000, 2000, 150], [500, 4000, 3600, 300]]),
  ...line({ brand: WD, model: 'Blue SN5000', family: 'WD Blue NVMe', year: 2024, iface: G4, format: M2, dram: HMB, tags: ['bureautique', 'gaming'] },
    [[500, 5000], [1000, 5150], [2000, 5150], [4000, 5500]]),

  // ─── WD Black ───
  ...line({ brand: WD, model: 'Black SN750', family: 'WD Black NVMe', year: 2019, iface: G3, format: M2, nand: T3, dram: DR, tags: game, refurb: true },
    [[250, 3100, 1600, 200, 79], [500, 3470, 2600, 300, 129], [1000, 3470, 3000, 600, 249], [2000, 3400, 2900, 1200, 499], [4000, 3400, 3100, 2400, 0, 2020]]),
  ...line({ brand: WD, model: 'Black SN770', family: 'WD Black NVMe', year: 2022, iface: G4, format: M2, nand: T3, dram: HMB, tags: ['gaming', 'budget'], refurb: true },
    [[250, 4000, 2000, 200, 69], [500, 5000, 4000, 300, 89], [2000, 5150, 4850, 1200, 269]]),
  ...line({ brand: WD, model: 'Black SN770M', family: 'WD Black NVMe', year: 2023, iface: G4, format: 'M.2 2230', nand: T3, dram: HMB, tags: ['gaming', 'mobile'] },
    [[500, 5000, 4000, 300], [1000, 5150, 4900, 600], [2000, 5150, 4850, 1200]]),
  ...line({ brand: WD, model: 'Black SN850', family: 'WD Black NVMe', year: 2020, iface: G4, format: M2, nand: T3, dram: DR, tags: game, refurb: true },
    [[500, 7000, 4100, 300, 149], [1000, 7000, 5300, 600, 229], [2000, 7000, 5100, 1200, 459]]),
  ...line({ brand: WD, model: 'Black SN850 Heatsink', family: 'WD Black NVMe', year: 2021, iface: G4, format: HS, nand: T3, dram: DR, tags: game, refurb: true },
    [[1000, 7000, 5300, 600], [2000, 7000, 5100, 1200]]),
  ...line({ brand: WD, model: 'Black SN850X', family: 'WD Black NVMe', year: 2024, iface: G4, format: M2, nand: T3, dram: DR, tags: game },
    [[8000, 7200]]),
  ...line({ brand: WD, model: 'Black SN850X Heatsink', family: 'WD Black NVMe', year: 2022, iface: G4, format: HS, nand: T3, dram: DR, tags: game, refurb: true },
    [[1000, 7300, 6300, 600], [2000, 7300, 6600, 1200], [4000, 7300, 6600, 2400, 0, 2023]]),
  ...line({ brand: WD, model: 'Black SN850P', family: 'WD Black NVMe', year: 2023, iface: G4, format: HS, nand: T3, dram: DR, tags: ['gaming'] },
    [[1000, 7300, 6300], [2000, 7300, 6600], [4000, 7300, 6600]]),
  ...line({ brand: WD, model: 'Black SN7100', family: 'WD Black NVMe', year: 2024, iface: G4, format: M2, nand: T3, dram: HMB, tags: ['gaming'] },
    [[500, 6800, 5800, 300], [4000, 7250, 6900, 2400]]),
  ...line({ brand: WD, model: 'Black SN8100', family: 'WD Black NVMe', year: 2025, iface: G5, format: M2, nand: T3, dram: DR, tags: game },
    [[1000, 14900], [2000, 14900], [4000, 14900]]),

  // ─── WD Red (NAS) ───
  ...line({ brand: WD, model: 'Red SA500', family: 'WD Red SSD', year: 2019, iface: SATA, format: F25, nand: T3, dram: DR, tags: nas, refurb: true },
    [[500, 560, 530, 350], [1000, 560, 530, 600], [2000, 560, 530, 1300], [4000, 560, 530, 2500]]),
  ...line({ brand: WD, model: 'Red SN700', family: 'WD Red SSD', year: 2021, iface: G3, format: M2, nand: T3, dram: DR, tags: nas, refurb: true },
    [[250, 3100, 1600, 500], [500, 3430, 2600, 1000], [4000, 3430, 3100, 5100]]),

  // ─── OEM (PC portables de marque) ───
  ...line({ brand: WD, model: 'PC SN530', family: 'WD OEM', year: 2020, iface: 'PCIe 3.0 x4 NVMe', format: 'M.2 2280 / 2242 / 2230', dram: HMB, tags: ['bureautique'], refurb: true },
    [[256], [512], [1000]]),
  ...line({ brand: WD, model: 'PC SN730', family: 'WD OEM', year: 2019, iface: G3, format: M2, dram: DR, tags: ['bureautique'], refurb: true },
    [[256], [512], [1000]]),
  ...line({ brand: WD, model: 'PC SN740', family: 'WD OEM', year: 2021, iface: G4, format: 'M.2 2280 / 2242 / 2230', dram: HMB, tags: ['bureautique', 'mobile'], refurb: true },
    [[256], [512], [1000], [2000]]),

  // ─── SanDisk ───
  ...line({ brand: SD, model: 'Ultra 3D', family: 'SanDisk Ultra', year: 2017, iface: SATA, format: F25, nand: T3, dram: DR, tags: cons, refurb: true },
    [[250, 550, 525, 100], [500, 560, 530, 200], [1000, 560, 530, 400], [2000, 560, 530, 500], [4000, 560, 530, 600, 0, 2019]]),
  ...line({ brand: SD, model: 'SSD Plus', family: 'SanDisk SSD Plus', year: 2015, iface: SATA, format: F25, dram: NO, tags: cons, refurb: true },
    [[120], [240], [480], [1000, 0, 0, 0, 0, 2019], [2000, 0, 0, 0, 0, 2020]]),
];
