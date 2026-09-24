import type { CatalogProduct } from '../types.js';

type Preset = { brand: string; family: string; year?: number; socket?: string; mem?: string; node?: string; tags: string[] };
/** [cœurs, threads, base GHz, boost GHz, cache L3 Mo, TDP W, graphiques intégrés (null = aucun)] */
type Spec = [number, number, number | undefined, number | undefined, number | undefined, number | undefined, (string | null)?];
type Opt = { year?: number; tags?: string[]; socket?: string; mem?: string; node?: string; refurb?: boolean; family?: string };

const fr = (v: number) => String(v).replace('.', ',');
const slug = (s: string) => s.toLowerCase().replace(/\+/g, ' plus').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function c(p: Preset, name: string, msrp: number | undefined, s: Spec, o: Opt = {}): CatalogProduct {
  const [cores, threads, base, boost, l3, tdp, igpu] = s;
  const specs: Record<string, string | number> = { 'Cœurs': cores, 'Threads': threads };
  if (base !== undefined) specs['Fréquence de base'] = `${fr(base)} GHz`;
  if (boost !== undefined) specs['Fréquence boost'] = `${fr(boost)} GHz`;
  if (l3 !== undefined) specs['Cache L3'] = `${fr(l3)} Mo`;
  if (tdp !== undefined) specs['TDP'] = `${tdp} W`;
  const socket = o.socket ?? p.socket;
  if (socket) specs['Socket'] = socket;
  const mem = o.mem ?? p.mem;
  if (mem) specs['Mémoire'] = mem;
  if (igpu !== undefined) specs['Graphiques intégrés'] = igpu === null ? 'Aucun' : igpu;
  const node = o.node ?? p.node;
  if (node) specs['Gravure'] = node;
  const year = o.year ?? p.year;
  const prod: CatalogProduct = { id: `cpu-${slug(name)}`, category: 'cpu', brand: p.brand, name, family: o.family ?? p.family, refurbishable: o.refurb ?? true, tags: o.tags ?? p.tags, specs };
  if (year !== undefined) prod.year = year;
  if (msrp !== undefined) prod.msrp = msrp;
  return prod;
}

const I = 'Intel';
const CML: Preset = { brand: I, family: 'Core 10e gén. (Comet Lake)', year: 2020, socket: 'LGA1200', mem: 'DDR4', node: '14 nm', tags: ['gaming'] };
const RKL: Preset = { brand: I, family: 'Core 11e gén. (Rocket Lake)', year: 2021, socket: 'LGA1200', mem: 'DDR4', node: '14 nm', tags: ['gaming'] };
const ADL: Preset = { brand: I, family: 'Core 12e gén. (Alder Lake)', year: 2022, socket: 'LGA1700', mem: 'DDR5 / DDR4', node: 'Intel 7', tags: ['gaming'] };
const RPL: Preset = { brand: I, family: 'Core 13e gén. (Raptor Lake)', year: 2023, socket: 'LGA1700', mem: 'DDR5 / DDR4', node: 'Intel 7', tags: ['gaming', 'creation'] };
const RPLR: Preset = { brand: I, family: 'Core 14e gén. (Raptor Lake Refresh)', year: 2024, socket: 'LGA1700', mem: 'DDR5 / DDR4', node: 'Intel 7', tags: ['gaming', 'creation'] };
const ARL: Preset = { brand: I, family: 'Core Ultra 200S (Arrow Lake)', year: 2025, socket: 'LGA1851', mem: 'DDR5', node: 'TSMC N3B', tags: ['gaming', 'creation'] };
const SKLX: Preset = { brand: I, family: 'Core X (Skylake-X)', year: 2017, socket: 'LGA2066', mem: 'DDR4 (4 canaux)', node: '14 nm', tags: ['creation', 'pro'] };
const SKLX9: Preset = { brand: I, family: 'Core X 9e gén. (Skylake-X Refresh)', year: 2018, socket: 'LGA2066', mem: 'DDR4 (4 canaux)', node: '14 nm', tags: ['creation', 'pro'] };
const CSLX: Preset = { brand: I, family: 'Core X 10e gén. (Cascade Lake-X)', year: 2019, socket: 'LGA2066', mem: 'DDR4 (4 canaux)', node: '14 nm', tags: ['creation', 'pro'] };

const u630 = 'Intel UHD 630', u610 = 'Intel UHD 610', u750 = 'Intel UHD 750', u730 = 'Intel UHD 730', u770 = 'Intel UHD 770', u710 = 'Intel UHD 710';
const xe4 = 'Intel Graphics (4 cœurs Xe)';
const BB = ['bureautique', 'budget'], GB = ['gaming', 'budget'], BU = ['bureautique'];

export const PRODUCTS: CatalogProduct[] = [
  // ─── Comet Lake (2020) ───
  c(CML, 'Intel Core i9-10900K', 530, [10, 20, 3.7, 5.3, 20, 125, u630]),
  c(CML, 'Intel Core i9-10900KF', 510, [10, 20, 3.7, 5.3, 20, 125, null]),
  c(CML, 'Intel Core i9-10850K', 470, [10, 20, 3.6, 5.2, 20, 125, u630]),
  c(CML, 'Intel Core i9-10900', 470, [10, 20, 2.8, 5.2, 20, 65, u630]),
  c(CML, 'Intel Core i9-10900F', 450, [10, 20, 2.8, 5.2, 20, 65, null]),
  c(CML, 'Intel Core i7-10700K', 400, [8, 16, 3.8, 5.1, 16, 125, u630]),
  c(CML, 'Intel Core i7-10700KF', 380, [8, 16, 3.8, 5.1, 16, 125, null]),
  c(CML, 'Intel Core i7-10700', 350, [8, 16, 2.9, 4.8, 16, 65, u630], { tags: ['gaming', 'bureautique'] }),
  c(CML, 'Intel Core i7-10700F', 330, [8, 16, 2.9, 4.8, 16, 65, null]),
  c(CML, 'Intel Core i5-10600K', 280, [6, 12, 4.1, 4.8, 12, 125, u630]),
  c(CML, 'Intel Core i5-10600KF', 260, [6, 12, 4.1, 4.8, 12, 125, null]),
  c(CML, 'Intel Core i5-10600', 240, [6, 12, 3.3, 4.8, 12, 65, u630]),
  c(CML, 'Intel Core i5-10500', 220, [6, 12, 3.1, 4.5, 12, 65, u630], { tags: BU }),
  c(CML, 'Intel Core i5-10400', 190, [6, 12, 2.9, 4.3, 12, 65, u630], { tags: ['gaming', 'bureautique'] }),
  c(CML, 'Intel Core i5-10400F', 160, [6, 12, 2.9, 4.3, 12, 65, null], { tags: GB }),
  c(CML, 'Intel Core i3-10100', 130, [4, 8, 3.6, 4.3, 6, 65, u630], { tags: BB }),
  c(CML, 'Intel Core i3-10100F', 90, [4, 8, 3.6, 4.3, 6, 65, null], { tags: GB }),
  c(CML, 'Intel Core i3-10105', 130, [4, 8, 3.7, 4.4, 6, 65, u630], { year: 2021, tags: BB }),
  c(CML, 'Intel Core i3-10105F', 90, [4, 8, 3.7, 4.4, 6, 65, null], { year: 2021, tags: GB }),
  c(CML, 'Intel Core i3-10300', 150, [4, 8, 3.7, 4.4, 8, undefined, u630], { tags: BB }),
  c(CML, 'Intel Pentium Gold G6400', 75, [2, 4, 4.0, undefined, 4, 58, u610], { tags: BB }),
  c(CML, 'Intel Celeron G5900', 50, [2, 2, 3.4, undefined, 2, 58, u610], { tags: BB }),

  // ─── Rocket Lake (2021) ───
  c(RKL, 'Intel Core i9-11900K', 580, [8, 16, 3.5, 5.3, 16, 125, u750]),
  c(RKL, 'Intel Core i9-11900KF', 560, [8, 16, 3.5, 5.3, 16, 125, null]),
  c(RKL, 'Intel Core i9-11900', 460, [8, 16, 2.5, 5.2, 16, 65, u750]),
  c(RKL, 'Intel Core i9-11900F', 440, [8, 16, 2.5, 5.2, 16, 65, null]),
  c(RKL, 'Intel Core i7-11700K', 420, [8, 16, 3.6, 5.0, 16, 125, u750]),
  c(RKL, 'Intel Core i7-11700KF', 400, [8, 16, 3.6, 5.0, 16, 125, null]),
  c(RKL, 'Intel Core i7-11700', 350, [8, 16, 2.5, 4.9, 16, 65, u750]),
  c(RKL, 'Intel Core i7-11700F', 330, [8, 16, 2.5, 4.9, 16, 65, null]),
  c(RKL, 'Intel Core i5-11600K', 280, [6, 12, 3.9, 4.9, 12, 125, u750]),
  c(RKL, 'Intel Core i5-11600KF', 260, [6, 12, 3.9, 4.9, 12, 125, null]),
  c(RKL, 'Intel Core i5-11600', 240, [6, 12, 2.8, 4.8, 12, 65, u750]),
  c(RKL, 'Intel Core i5-11500', 220, [6, 12, 2.7, 4.6, 12, 65, u750], { tags: BU }),
  c(RKL, 'Intel Core i5-11400', 200, [6, 12, 2.6, 4.4, 12, 65, u730], { tags: ['gaming', 'bureautique'] }),
  c(RKL, 'Intel Core i5-11400F', 170, [6, 12, 2.6, 4.4, 12, 65, null], { tags: GB }),

  // ─── Alder Lake (2022) ───
  c(ADL, 'Intel Core i9-12900KS', 800, [16, 24, 3.4, 5.5, 30, 150, u770]),
  c(ADL, 'Intel Core i9-12900', 560, [16, 24, 2.4, 5.1, 30, 65, u770], { tags: ['gaming', 'creation'] }),
  c(ADL, 'Intel Core i9-12900F', 540, [16, 24, 2.4, 5.1, 30, 65, null], { tags: ['gaming', 'creation'] }),
  c(ADL, 'Intel Core i7-12700', 390, [12, 20, 2.1, 4.9, 25, 65, u770]),
  c(ADL, 'Intel Core i7-12700F', 370, [12, 20, 2.1, 4.9, 25, 65, null]),
  c(ADL, 'Intel Core i5-12600', 260, [6, 12, 3.3, 4.8, 18, 65, u770]),
  c(ADL, 'Intel Core i5-12500', 230, [6, 12, 3.0, 4.6, 18, 65, u770], { tags: ['gaming', 'bureautique'] }),
  c(ADL, 'Intel Core i3-12300', 160, [4, 8, 3.5, 4.4, 12, 60, u730], { tags: BB }),
  c(ADL, 'Intel Pentium Gold G7400', 90, [2, 4, 3.7, undefined, 6, 46, u710], { tags: BB }),
  c(ADL, 'Intel Celeron G6900', 60, [2, 2, 3.4, undefined, 4, 46, u710], { tags: BB }),

  // ─── Raptor Lake (2023) ───
  c(RPL, 'Intel Core i9-13900', 600, [24, 32, 2.0, 5.6, 36, 65, u770]),
  c(RPL, 'Intel Core i9-13900F', 580, [24, 32, 2.0, 5.6, 36, 65, null]),
  c(RPL, 'Intel Core i7-13700', 440, [16, 24, 2.1, 5.2, 30, 65, u770]),
  c(RPL, 'Intel Core i7-13700F', 420, [16, 24, 2.1, 5.2, 30, 65, null]),
  c(RPL, 'Intel Core i5-13600', 300, [14, 20, 2.7, 5.0, 24, 65, u770]),
  c(RPL, 'Intel Core i5-13500', 270, [14, 20, 2.5, 4.8, 24, 65, u770], { tags: ['gaming', 'bureautique', 'homelab'] }),

  // ─── Raptor Lake Refresh (2024) ───
  c(RPLR, 'Intel Core i9-14900F', 580, [24, 32, 2.0, 5.8, 36, 65, null]),
  c(RPLR, 'Intel Core i7-14700F', 420, [20, 28, 2.1, 5.4, 33, 65, null]),
  c(RPLR, 'Intel Core i5-14600', 300, [14, 20, 2.7, 5.2, 24, 65, u770], { tags: ['gaming', 'bureautique'] }),
  c(RPLR, 'Intel Processor 300', 100, [2, 4, 3.9, undefined, 6, 46, u710], { tags: BB, family: 'Intel Processor (Raptor Lake)', year: 2023 }),

  // ─── Arrow Lake (2025) ───
  c(ARL, 'Intel Core Ultra 9 285', 580, [24, 24, 2.5, 5.6, 36, 65, xe4]),
  c(ARL, 'Intel Core Ultra 7 265', 400, [20, 20, 2.4, 5.3, 30, 65, xe4]),
  c(ARL, 'Intel Core Ultra 7 265F', 380, [20, 20, 2.4, 5.3, 30, 65, null]),
  c(ARL, 'Intel Core Ultra 5 245', 300, [14, 14, 3.5, 5.1, 24, 65, xe4], { tags: ['gaming', 'bureautique'] }),
  c(ARL, 'Intel Core Ultra 5 235', 260, [14, 14, 3.4, 5.0, 24, 65, xe4], { tags: ['gaming', 'bureautique'] }),

  // ─── HEDT : Core X (LGA2066) ───
  c(SKLX, 'Intel Core i9-7980XE', 2100, [18, 36, 2.6, 4.2, 24.75, 165, null]),
  c(SKLX, 'Intel Core i9-7960X', 1800, [16, 32, 2.8, 4.2, 22, 165, null]),
  c(SKLX, 'Intel Core i9-7940X', 1500, [14, 28, 3.1, 4.3, 19.25, 165, null]),
  c(SKLX, 'Intel Core i9-7920X', 1250, [12, 24, 2.9, 4.3, 16.5, 140, null]),
  c(SKLX, 'Intel Core i9-7900X', 1050, [10, 20, 3.3, 4.3, 13.75, 140, null]),
  c(SKLX, 'Intel Core i7-7820X', 630, [8, 16, 3.6, 4.3, 11, 140, null]),
  c(SKLX, 'Intel Core i7-7800X', 420, [6, 12, 3.5, 4.0, 8.25, 140, null]),
  c(SKLX, 'Intel Core i7-7740X', 370, [4, 8, 4.3, 4.5, 8, 112, null], { family: 'Core X (Kaby Lake-X)' }),
  c(SKLX9, 'Intel Core i9-9980XE', 2100, [18, 36, 3.0, 4.4, 24.75, 165, null]),
  c(SKLX9, 'Intel Core i9-9820X', 950, [10, 20, 3.3, 4.1, 16.5, 165, null]),
  c(SKLX9, 'Intel Core i7-9800X', 650, [8, 16, 3.8, 4.4, 16.5, 165, null]),
  c(CSLX, 'Intel Core i9-10980XE', 1050, [18, 36, 3.0, 4.6, 24.75, 165, null]),
  c(CSLX, 'Intel Core i9-10940X', 850, [14, 28, 3.3, 4.6, 19.25, 165, null]),
  c(CSLX, 'Intel Core i9-10920X', 720, [12, 24, 3.5, 4.6, 19.25, 165, null]),
  c(CSLX, 'Intel Core i9-10900X', 620, [10, 20, 3.7, 4.5, 19.25, 165, null]),
];
