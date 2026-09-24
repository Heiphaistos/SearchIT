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

const SAM = 'Samsung';
const TV = 'TLC V-NAND';
const MV = 'MLC V-NAND';
const QV = 'QLC V-NAND';
const DR = 'Oui';
const HMB = 'Non (HMB)';
const cons = ['bureautique', 'budget'];
const game = ['gaming', 'creation'];
const ent = ['serveur', 'pro'];

/** Samsung : SSD SATA et NVMe grand public, OEM et entreprise. */
export const PRODUCTS: CatalogProduct[] = [
  // ─── SATA grand public ───
  ...line({ brand: SAM, model: '840 EVO', family: '840 EVO', year: 2013, iface: SATA, format: F25, nand: 'TLC planaire', dram: DR, tags: cons, refurb: true },
    [[120, 540, 410, 0, 99], [250, 540, 520, 0, 169], [500, 540, 520, 0, 319], [750, 540, 520, 0, 449], [1000, 540, 520, 0, 569]]),
  ...line({ brand: SAM, model: '840 PRO', family: '840 PRO', year: 2012, iface: SATA, format: F25, nand: 'MLC planaire', dram: DR, tags: cons, refurb: true },
    [[128, 540, 390], [256, 540, 520], [512, 540, 520]]),
  ...line({ brand: SAM, model: '850 EVO', family: '850 EVO', year: 2014, iface: SATA, format: F25, nand: TV, dram: DR, tags: cons, refurb: true },
    [[120, 540, 520, 75, 79], [250, 540, 520, 75, 119], [500, 540, 520, 150, 219], [1000, 540, 520, 150, 449], [2000, 540, 520, 300, 799, 2015], [4000, 540, 520, 300, 1599, 2016]]),
  ...line({ brand: SAM, model: '850 EVO M.2', family: '850 EVO', year: 2015, iface: SATA, format: M2S, nand: TV, dram: DR, tags: cons, refurb: true },
    [[250, 540, 500, 75], [500, 540, 500, 150], [1000, 540, 500, 150]]),
  ...line({ brand: SAM, model: '850 PRO', family: '850 PRO', year: 2014, iface: SATA, format: F25, nand: MV, dram: DR, tags: ['bureautique', 'creation'], refurb: true },
    [[128, 550, 470, 150], [256, 550, 520, 150], [512, 550, 520, 300], [1000, 550, 520, 300], [2000, 550, 520, 300, 0, 2015], [4000, 550, 520, 300, 0, 2016]]),
  ...line({ brand: SAM, model: '860 EVO', family: '860 EVO', year: 2018, iface: SATA, format: F25, nand: TV, dram: DR, tags: cons, refurb: true },
    [[250, 550, 520, 150, 89], [500, 550, 520, 300, 149], [1000, 550, 520, 600, 299], [2000, 550, 520, 1200, 599], [4000, 550, 520, 2400, 1399]]),
  ...line({ brand: SAM, model: '860 EVO M.2', family: '860 EVO', year: 2018, iface: SATA, format: M2S, nand: TV, dram: DR, tags: cons, refurb: true },
    [[250, 550, 520, 150], [500, 550, 520, 300], [1000, 550, 520, 600], [2000, 550, 520, 1200]]),
  ...line({ brand: SAM, model: '860 PRO', family: '860 PRO', year: 2018, iface: SATA, format: F25, nand: MV, dram: DR, tags: ['bureautique', 'creation'], refurb: true },
    [[256, 560, 530, 300], [512, 560, 530, 600], [1000, 560, 530, 1200], [2000, 560, 530, 2400], [4000, 560, 530, 4800]]),
  ...line({ brand: SAM, model: '860 QVO', family: '860 QVO', year: 2018, iface: SATA, format: F25, nand: QV, dram: DR, tags: ['bureautique', 'budget', 'homelab'], refurb: true },
    [[1000, 550, 520, 360, 149], [2000, 550, 520, 720, 279], [4000, 550, 520, 1440, 559]]),
  ...line({ brand: SAM, model: '870 EVO', family: '870 EVO', year: 2021, iface: SATA, format: F25, nand: TV, dram: DR, tags: cons, refurb: true },
    [[250, 560, 530, 150, 49], [500, 560, 530, 300, 79], [4000, 560, 530, 2400, 469]]),
  ...line({ brand: SAM, model: '870 QVO', family: '870 QVO', year: 2020, iface: SATA, format: F25, nand: QV, dram: DR, tags: ['bureautique', 'budget', 'homelab'], refurb: true },
    [[1000, 560, 530, 360, 129], [2000, 560, 530, 720, 239], [4000, 560, 530, 1440, 469], [8000, 560, 530, 2880, 899]]),

  // ─── NVMe grand public ───
  ...line({ brand: SAM, model: '950 PRO', family: '950 PRO', year: 2015, iface: G3, format: M2, nand: MV, dram: DR, tags: game, refurb: true },
    [[256, 2200, 900, 200], [512, 2500, 1500, 400]]),
  ...line({ brand: SAM, model: '960 EVO', family: '960 EVO', year: 2016, iface: G3, format: M2, nand: TV, dram: DR, tags: game, refurb: true },
    [[250, 3200, 1500, 100], [500, 3200, 1800, 200], [1000, 3200, 1900, 400]]),
  ...line({ brand: SAM, model: '960 PRO', family: '960 PRO', year: 2016, iface: G3, format: M2, nand: MV, dram: DR, tags: game, refurb: true },
    [[512, 3500, 2100, 400], [1000, 3500, 2100, 800], [2000, 3500, 2100, 1200]]),
  ...line({ brand: SAM, model: '970 EVO', family: '970 EVO', year: 2018, iface: G3, format: M2, nand: TV, dram: DR, tags: game, refurb: true },
    [[250, 3400, 1500, 150], [500, 3400, 2300, 300], [1000, 3400, 2500, 600], [2000, 3500, 2500, 1200]]),
  ...line({ brand: SAM, model: '970 PRO', family: '970 PRO', year: 2018, iface: G3, format: M2, nand: MV, dram: DR, tags: game, refurb: true },
    [[512, 3500, 2300, 600], [1000, 3500, 2700, 1200]]),
  ...line({ brand: SAM, model: '970 EVO Plus', family: '970 EVO Plus', year: 2019, iface: G3, format: M2, nand: TV, dram: DR, tags: game, refurb: true },
    [[250, 3500, 2300, 150, 89], [500, 3500, 3200, 300, 139], [1000, 3500, 3300, 600, 249], [2000, 3500, 3300, 1200, 529]]),
  ...line({ brand: SAM, model: '980', family: '980', year: 2021, iface: G3, format: M2, nand: TV, dram: HMB, tags: ['gaming', 'bureautique', 'budget'], refurb: true },
    [[250, 2900, 1300, 150, 59], [500, 3100, 2600, 300, 79], [1000, 3500, 3000, 600, 139]]),
  ...line({ brand: SAM, model: '980 PRO', family: '980 PRO', year: 2020, iface: G4, format: M2, nand: TV, dram: DR, tags: game, refurb: true },
    [[250, 6400, 2700, 150, 89], [500, 6900, 5000, 300, 149], [1000, 7000, 5000, 600, 229], [2000, 7000, 5100, 1200, 429, 2021]]),
  ...line({ brand: SAM, model: '980 PRO Heatsink', family: '980 PRO', year: 2021, iface: G4, format: 'M.2 2280 avec dissipateur', nand: TV, dram: DR, tags: game, refurb: true },
    [[1000, 7000, 5000, 600], [2000, 7000, 5100, 1200]]),
  ...line({ brand: SAM, model: '990 PRO Heatsink', family: '990 PRO', year: 2022, iface: G4, format: 'M.2 2280 avec dissipateur', nand: TV, dram: 'Oui (LPDDR4)', tags: game },
    [[1000, 7450, 6900, 600, 219], [2000, 7450, 6900, 1200, 349], [4000, 7450, 6900, 2400, 0, 2023]]),
  ...line({ brand: SAM, model: '990 EVO', family: '990 EVO', year: 2024, iface: 'PCIe 4.0 x4 / 5.0 x2 NVMe', format: M2, nand: TV, dram: HMB, tags: ['gaming', 'budget'] },
    [[1000, 5000, 4200, 600, 129], [2000, 5000, 4200, 1200, 219]]),
  ...line({ brand: SAM, model: '990 EVO Plus', family: '990 EVO Plus', year: 2024, iface: 'PCIe 4.0 x4 / 5.0 x2 NVMe', format: M2, nand: TV, dram: HMB, tags: ['gaming', 'budget'] },
    [[4000, 7250, 6300, 2400, 350]]),
  ...line({ brand: SAM, model: '9100 PRO', family: '9100 PRO', year: 2025, iface: G5, format: M2, nand: TV, dram: 'Oui (LPDDR4X)', tags: game },
    [[4000, 14800, 13400, 2400, 599], [8000, 14800, 13400, 4800]]),
  ...line({ brand: SAM, model: '9100 PRO Heatsink', family: '9100 PRO', year: 2025, iface: G5, format: 'M.2 2280 avec dissipateur', nand: TV, dram: 'Oui (LPDDR4X)', tags: game },
    [[1000, 14700, 13300, 600], [2000, 14700, 13400, 1200], [4000, 14800, 13400, 2400]]),

  // ─── OEM (PC portables et fixes de marque, très présents en reconditionné) ───
  ...line({ brand: SAM, model: 'PM981', family: 'OEM', year: 2017, iface: G3, format: M2, nand: TV, dram: DR, tags: ['bureautique'], refurb: true },
    [[256], [512], [1000]]),
  ...line({ brand: SAM, model: 'PM981a', family: 'OEM', year: 2019, iface: G3, format: M2, nand: TV, dram: DR, tags: ['bureautique'], refurb: true },
    [[256], [512], [1000]]),
  ...line({ brand: SAM, model: 'PM9A1', family: 'OEM', year: 2020, iface: G4, format: M2, nand: TV, dram: DR, tags: ['bureautique', 'gaming'], refurb: true },
    [[256], [512], [1000], [2000]]),

  // ─── Entreprise ───
  ...line({ brand: SAM, model: 'PM883', family: 'Datacenter SATA', year: 2018, iface: SATA, format: F25, nand: TV, dram: DR, tags: ent, refurb: true },
    [[240, 550], [480, 550, 520], [960, 550, 520], [1920, 550, 520], [3840, 550, 520], [7680, 550, 520]]),
  ...line({ brand: SAM, model: 'PM893', family: 'Datacenter SATA', year: 2021, iface: SATA, format: F25, nand: TV, dram: DR, tags: ent, refurb: true },
    [[240, 550], [480, 550, 530], [960, 550, 530], [1920, 550, 530], [3840, 550, 530], [7680, 550, 530]]),
  ...line({ brand: SAM, model: 'PM9A3', family: 'Datacenter NVMe', year: 2021, iface: G4, format: 'U.2 2,5 pouces 7 mm', nand: TV, dram: DR, tags: ent, refurb: true, suffix: 'U.2' },
    [[960], [1920], [7680]]),
  ...line({ brand: SAM, model: 'PM9A3', family: 'Datacenter NVMe', year: 2021, iface: G4, format: 'M.2 22110', nand: TV, dram: DR, tags: ent, refurb: true, suffix: 'M.2' },
    [[960], [1920], [3840]]),
];
