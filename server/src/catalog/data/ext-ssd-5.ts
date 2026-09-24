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

const SB = 'Sabrent';
const CO = 'Corsair';
const LX = 'Lexar';
const SK = 'SK hynix';
const KX = 'Kioxia';
const TO = 'Toshiba';
const T3 = 'TLC 3D';
const Q3 = 'QLC 3D';
const DR = 'Oui';
const NO = 'Non';
const HMB = 'Non (HMB)';
const cons = ['bureautique', 'budget'];
const game = ['gaming', 'creation'];
const ent = ['serveur', 'pro'];

/** Sabrent, Corsair, Lexar, SK hynix, Kioxia et Toshiba/OCZ. */
export const PRODUCTS: CatalogProduct[] = [
  // ─── Sabrent ───
  ...line({ brand: SB, model: 'Rocket 4.0', family: 'Rocket', year: 2019, iface: G4, format: M2, nand: T3, dram: DR, tags: game, refurb: true },
    [[500, 5000], [1000, 5000], [2000, 5000], [4000, 0, 0, 0, 0, 2020]]),
  ...line({ brand: SB, model: 'Rocket 4 Plus', family: 'Rocket', year: 2021, iface: G4, format: M2, nand: T3, dram: DR, tags: game },
    [[4000, 7100], [8000, 7100]]),
  ...line({ brand: SB, model: 'Rocket Q', family: 'Rocket Q', year: 2020, iface: G3, format: M2, nand: Q3, tags: ['bureautique', 'homelab'], refurb: true },
    [[500], [1000], [2000], [4000], [8000]]),
  ...line({ brand: SB, model: 'Rocket 5', family: 'Rocket', year: 2024, iface: G5, format: M2, nand: T3, dram: DR, tags: game },
    [[1000], [2000], [4000]]),

  // ─── Corsair ───
  ...line({ brand: CO, model: 'Force MP510', family: 'Force MP', year: 2018, iface: G3, format: M2, nand: T3, dram: DR, tags: game, refurb: true },
    [[240, 3100], [480, 3480], [960, 3480], [1920, 3480]]),
  ...line({ brand: CO, model: 'Force MP600', family: 'MP600', year: 2019, iface: G4, format: 'M.2 2280 avec dissipateur', nand: T3, dram: DR, tags: game, refurb: true },
    [[500, 4950, 2500, 850], [1000, 4950, 4250, 1800], [2000, 4950, 4250, 3600]]),
  ...line({ brand: CO, model: 'MP600 PRO', family: 'MP600', year: 2021, iface: G4, format: 'M.2 2280 avec dissipateur', nand: T3, dram: DR, tags: game, refurb: true },
    [[1000, 7000], [2000, 7000]]),
  ...line({ brand: CO, model: 'MP600 PRO XT', family: 'MP600', year: 2021, iface: G4, format: 'M.2 2280 avec dissipateur', nand: T3, dram: DR, tags: game },
    [[1000, 7100], [2000, 7100], [4000, 7100]]),
  ...line({ brand: CO, model: 'MP600 PRO LPX', family: 'MP600', year: 2021, iface: G4, format: 'M.2 2280 avec dissipateur', nand: T3, dram: DR, tags: game },
    [[500, 7100, 3700], [4000, 7100, 6800]]),
  ...line({ brand: CO, model: 'MP600 CORE', family: 'MP600', year: 2021, iface: G4, format: 'M.2 2280 avec dissipateur', nand: Q3, tags: ['gaming', 'budget'] },
    [[1000, 4700], [2000, 4950], [4000, 4950]]),
  ...line({ brand: CO, model: 'MP600 CORE XT', family: 'MP600', year: 2022, iface: G4, format: M2, nand: Q3, dram: NO, tags: ['gaming', 'budget'] },
    [[1000, 5000], [2000, 5000], [4000, 5000]]),
  ...line({ brand: CO, model: 'MP600 ELITE', family: 'MP600', year: 2023, iface: G4, format: M2, nand: T3, dram: NO, tags: ['gaming'] },
    [[1000, 7000], [2000, 7000]]),
  ...line({ brand: CO, model: 'MP700', family: 'MP700', year: 2023, iface: G5, format: 'M.2 2280 avec dissipateur', nand: T3, dram: DR, tags: game },
    [[1000, 9500, 8500], [2000, 10000, 10000]]),
  ...line({ brand: CO, model: 'MP700 PRO', family: 'MP700', year: 2023, iface: G5, format: 'M.2 2280 avec dissipateur', nand: T3, dram: DR, tags: game },
    [[1000, 11700], [2000, 12400], [4000, 12400]]),
  ...line({ brand: CO, model: 'MP700 ELITE', family: 'MP700', year: 2024, iface: G5, format: M2, nand: T3, dram: NO, tags: game },
    [[1000], [2000], [4000]]),

  // ─── Lexar ───
  ...line({ brand: LX, model: 'NM620', family: 'Lexar NM', year: 2021, iface: G3, format: M2, dram: HMB, tags: cons, refurb: true },
    [[256], [512], [1000], [2000]]),
  ...line({ brand: LX, model: 'NM710', family: 'Lexar NM', year: 2022, iface: G4, format: M2, dram: HMB, tags: ['gaming', 'budget'] },
    [[500, 5000], [1000, 5000], [2000, 5000]]),
  ...line({ brand: LX, model: 'NM800 PRO', family: 'Lexar NM', year: 2022, iface: G4, format: M2, nand: T3, dram: DR, tags: game },
    [[512, 7500], [1000, 7500], [2000, 7500]]),
  ...line({ brand: LX, model: 'NM790', family: 'Lexar NM', year: 2023, iface: G4, format: M2, nand: T3, dram: HMB, tags: ['gaming', 'budget'] },
    [[512, 7200, 4400], [4000, 7400, 6500]]),
  ...line({ brand: LX, model: 'NM1090', family: 'Lexar NM', year: 2024, iface: G5, format: M2, nand: T3, tags: game },
    [[1000], [2000], [4000]]),

  // ─── SK hynix ───
  ...line({ brand: SK, model: 'Gold S31', family: 'Gold', year: 2019, iface: SATA, format: F25, nand: T3, dram: DR, tags: cons, refurb: true },
    [[250, 560, 525], [500, 560, 525], [1000, 560, 525]]),
  ...line({ brand: SK, model: 'Gold P31', family: 'Gold', year: 2020, iface: G3, format: M2, nand: T3, dram: DR, tags: ['gaming', 'bureautique'], refurb: true },
    [[500, 3500, 3100, 500], [1000, 3500, 3200, 750], [2000, 3500, 3200, 1200, 0, 2022]]),
  ...line({ brand: SK, model: 'Platinum P41', family: 'Platinum', year: 2022, iface: G4, format: M2, nand: T3, dram: DR, tags: game, refurb: true },
    [[500, 7000, 4700, 500], [1000, 7000, 6500, 750], [2000, 7000, 6500, 1200]]),
  ...line({ brand: SK, model: 'Platinum P51', family: 'Platinum', year: 2025, iface: G5, format: M2, nand: T3, dram: DR, tags: game },
    [[1000], [2000]]),
  ...line({ brand: SK, model: 'PC711', family: 'SK hynix OEM', year: 2020, iface: G3, format: M2, nand: T3, dram: DR, tags: ['bureautique'], refurb: true },
    [[256], [512], [1000]]),
  ...line({ brand: SK, model: 'PC801', family: 'SK hynix OEM', year: 2021, iface: G4, format: M2, nand: T3, dram: DR, tags: ['bureautique'], refurb: true },
    [[512], [1000]]),

  // ─── Kioxia ───
  ...line({ brand: KX, model: 'Exceria SATA', family: 'Exceria', year: 2020, iface: SATA, format: F25, nand: 'TLC BiCS', dram: NO, tags: cons },
    [[240, 555], [480, 555], [960, 555]]),
  ...line({ brand: KX, model: 'Exceria', family: 'Exceria', year: 2020, iface: G3, format: M2, nand: 'TLC BiCS', dram: HMB, tags: cons, refurb: true },
    [[250, 1700], [500, 1700], [1000, 1700]]),
  ...line({ brand: KX, model: 'Exceria Plus', family: 'Exceria', year: 2020, iface: G3, format: M2, nand: 'TLC BiCS', dram: DR, tags: ['gaming'], refurb: true },
    [[500, 3400], [1000, 3400], [2000, 3400]]),
  ...line({ brand: KX, model: 'Exceria Plus G3', family: 'Exceria', year: 2023, iface: G4, format: M2, nand: 'TLC BiCS', tags: ['gaming', 'budget'] },
    [[1000, 5000], [2000, 5000]]),
  ...line({ brand: KX, model: 'Exceria Pro', family: 'Exceria', year: 2023, iface: G4, format: M2, nand: 'TLC BiCS', dram: DR, tags: game },
    [[1000, 7300], [2000, 7300]]),
  ...line({ brand: KX, model: 'BG5', family: 'Kioxia OEM', year: 2021, iface: G4, format: 'M.2 2230', nand: 'TLC BiCS', dram: HMB, tags: ['bureautique', 'mobile'], refurb: true },
    [[256], [512], [1000]]),
  ...line({ brand: KX, model: 'CD6-R', family: 'Kioxia CD6', year: 2020, iface: G4, format: 'U.3 2,5 pouces', nand: 'TLC BiCS', dram: DR, tags: ent, refurb: true, suffix: 'U.3' },
    [[1920], [3840], [7680]]),

  // ─── Toshiba / OCZ ───
  ...line({ brand: TO, model: 'OCZ TR200', family: 'OCZ', year: 2017, iface: SATA, format: F25, nand: 'TLC BiCS', dram: NO, tags: cons, refurb: true },
    [[240, 555], [480, 555], [960, 555]]),
  ...line({ brand: TO, model: 'RC500', family: 'Toshiba NVMe', year: 2019, iface: G3, format: M2, nand: 'TLC BiCS', dram: HMB, tags: cons, refurb: true },
    [[250, 1700], [500, 1700]]),
  ...line({ brand: TO, model: 'RD500', family: 'Toshiba NVMe', year: 2019, iface: G3, format: M2, nand: 'TLC BiCS', dram: DR, tags: ['gaming'], refurb: true },
    [[500, 3400], [1000, 3400], [2000, 3400]]),
];
