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

const A = 'AMD';
const FX: Preset = { brand: A, family: 'AMD FX (Piledriver)', year: 2012, socket: 'AM3+', mem: 'DDR3', node: '32 nm', tags: ['gaming', 'budget'] };
const APU: Preset = { brand: A, family: 'AMD A-Series APU', year: 2014, socket: 'FM2+', mem: 'DDR3', node: '28 nm', tags: ['bureautique', 'budget'] };
const R1: Preset = { brand: A, family: 'Ryzen 1000', year: 2017, socket: 'AM4', mem: 'DDR4', node: '14 nm', tags: ['gaming'] };
const RR: Preset = { brand: A, family: 'Ryzen 2000G (Raven Ridge)', year: 2018, socket: 'AM4', mem: 'DDR4', node: '14 nm', tags: ['bureautique', 'budget'] };
const R2: Preset = { brand: A, family: 'Ryzen 2000', year: 2018, socket: 'AM4', mem: 'DDR4', node: '12 nm', tags: ['gaming'] };
const R3: Preset = { brand: A, family: 'Ryzen 3000', year: 2019, socket: 'AM4', mem: 'DDR4', node: '7 nm', tags: ['gaming'] };
const R3G: Preset = { brand: A, family: 'Ryzen 3000G (Picasso)', year: 2019, socket: 'AM4', mem: 'DDR4', node: '12 nm', tags: ['bureautique', 'budget'] };
const R4: Preset = { brand: A, family: 'Ryzen 4000', year: 2022, socket: 'AM4', mem: 'DDR4', node: '7 nm', tags: ['bureautique', 'budget'] };
const R5: Preset = { brand: A, family: 'Ryzen 5000', year: 2024, socket: 'AM4', mem: 'DDR4', node: '7 nm', tags: ['gaming', 'budget'] };
const R7: Preset = { brand: A, family: 'Ryzen 7000', year: 2024, socket: 'AM5', mem: 'DDR5', node: '5 nm', tags: ['gaming'] };
const R8: Preset = { brand: A, family: 'Ryzen 8000G', year: 2024, socket: 'AM5', mem: 'DDR5', node: '4 nm', tags: ['gaming'] };
const R9: Preset = { brand: A, family: 'Ryzen 9000', year: 2026, socket: 'AM5', mem: 'DDR5', node: '4 nm', tags: ['gaming'] };
const TR1: Preset = { brand: A, family: 'Ryzen Threadripper 1000', year: 2017, socket: 'TR4', mem: 'DDR4 (4 canaux)', node: '14 nm', tags: ['creation', 'pro'] };
const TR2: Preset = { brand: A, family: 'Ryzen Threadripper 2000', year: 2018, socket: 'TR4', mem: 'DDR4 (4 canaux)', node: '12 nm', tags: ['creation', 'pro'] };
const TR3: Preset = { brand: A, family: 'Ryzen Threadripper 3000', year: 2019, socket: 'sTRX4', mem: 'DDR4 (4 canaux)', node: '7 nm', tags: ['creation', 'pro'] };
const TRP3: Preset = { brand: A, family: 'Ryzen Threadripper PRO 3000WX', year: 2020, socket: 'sWRX8', mem: 'DDR4 (8 canaux)', node: '7 nm', tags: ['creation', 'pro', 'ia'] };
const TRP5: Preset = { brand: A, family: 'Ryzen Threadripper PRO 5000WX', year: 2022, socket: 'sWRX8', mem: 'DDR4 (8 canaux)', node: '7 nm', tags: ['creation', 'pro', 'ia'] };
const TRP7: Preset = { brand: A, family: 'Ryzen Threadripper PRO 7000WX', year: 2023, socket: 'sTR5', mem: 'DDR5 (8 canaux)', node: '5 nm', tags: ['creation', 'pro', 'ia'] };
const TR9: Preset = { brand: A, family: 'Ryzen Threadripper 9000', year: 2025, socket: 'sTR5', mem: 'DDR5 (4 canaux)', node: '4 nm', tags: ['creation', 'pro', 'ia'] };
const TRP9: Preset = { brand: A, family: 'Ryzen Threadripper PRO 9000WX', year: 2025, socket: 'sTR5', mem: 'DDR5 (8 canaux)', node: '4 nm', tags: ['creation', 'pro', 'ia'] };

const BB = ['bureautique', 'budget'], GB = ['gaming', 'budget'], BH = ['bureautique', 'homelab', 'pro'];

export const PRODUCTS: CatalogProduct[] = [
  // ─── AMD FX (AM3+) ───
  c(FX, 'AMD FX-8150', 250, [8, 8, 3.6, 4.2, 8, 125, null], { family: 'AMD FX (Bulldozer)', year: undefined, node: '32 nm' }),
  c(FX, 'AMD FX-9590', 800, [8, 8, 4.7, 5.0, 8, 220, null], { year: 2013 }),
  c(FX, 'AMD FX-8370', 200, [8, 8, 4.0, 4.3, 8, 125, null], { year: 2014 }),
  c(FX, 'AMD FX-8350', 190, [8, 8, 4.0, 4.2, 8, 125, null]),
  c(FX, 'AMD FX-8320', 160, [8, 8, 3.5, 4.0, 8, 125, null]),
  c(FX, 'AMD FX-8320E', 150, [8, 8, 3.2, 4.0, 8, 95, null], { year: 2014 }),
  c(FX, 'AMD FX-8300', 130, [8, 8, 3.3, 4.2, 8, 95, null]),
  c(FX, 'AMD FX-6350', 130, [6, 6, 3.9, 4.2, 8, 125, null], { year: 2013 }),
  c(FX, 'AMD FX-6300', 110, [6, 6, 3.5, 4.1, 8, 95, null]),
  c(FX, 'AMD FX-4300', 100, [4, 4, 3.8, 4.0, 4, 95, null]),

  // ─── APU A-Series / Athlon (FM2, FM2+, AM4) ───
  c(APU, 'AMD A10-5800K', 120, [4, 4, 3.8, 4.2, undefined, 100, 'Radeon HD 7660D'], { year: 2012, socket: 'FM2', node: '32 nm', family: 'AMD A-Series (Trinity)' }),
  c(APU, 'AMD A10-6800K', 140, [4, 4, 4.1, 4.4, undefined, 100, 'Radeon HD 8670D'], { year: 2013, socket: 'FM2', node: '32 nm', family: 'AMD A-Series (Richland)' }),
  c(APU, 'AMD A10-7850K', 170, [4, 4, 3.7, 4.0, undefined, 95, 'Radeon R7'], { family: 'AMD A-Series (Kaveri)' }),
  c(APU, 'AMD A10-7860K', 110, [4, 4, 3.6, 4.0, undefined, 65, 'Radeon R7'], { year: 2016, family: 'AMD A-Series (Kaveri)' }),
  c(APU, 'AMD A8-7600', 100, [4, 4, 3.1, 3.8, undefined, 65, 'Radeon R7'], { family: 'AMD A-Series (Kaveri)' }),
  c(APU, 'AMD Athlon X4 860K', 80, [4, 4, 3.7, 4.0, undefined, 95, null], { family: 'AMD Athlon X4 (Kaveri)' }),
  c(APU, 'AMD A12-9800', undefined, [4, 4, 3.8, 4.2, undefined, 65, 'Radeon R7'], { year: 2016, socket: 'AM4', mem: 'DDR4', family: 'AMD A-Series (Bristol Ridge)' }),

  // ─── Ryzen 1000 (Zen) ───
  c(R1, 'AMD Ryzen 7 1800X', 559, [8, 16, 3.6, 4.0, 16, 95, null], { tags: ['gaming', 'creation'] }),
  c(R1, 'AMD Ryzen 7 1700X', 439, [8, 16, 3.4, 3.8, 16, 95, null], { tags: ['gaming', 'creation'] }),
  c(R1, 'AMD Ryzen 7 1700', 359, [8, 16, 3.0, 3.7, 16, 65, null], { tags: ['gaming', 'creation', 'homelab'] }),
  c(R1, 'AMD Ryzen 5 1600X', 269, [6, 12, 3.6, 4.0, 16, 95, null]),
  c(R1, 'AMD Ryzen 5 1600', 239, [6, 12, 3.2, 3.6, 16, 65, null]),
  c(R1, 'AMD Ryzen 5 1600 AF', 95, [6, 12, 3.2, 3.6, 16, 65, null], { year: 2019, node: '12 nm', tags: GB }),
  c(R1, 'AMD Ryzen 5 1500X', 199, [4, 8, 3.5, 3.7, 16, 65, null]),
  c(R1, 'AMD Ryzen 5 1400', 175, [4, 8, 3.2, 3.4, 8, 65, null], { tags: GB }),
  c(R1, 'AMD Ryzen 3 1300X', 139, [4, 4, 3.5, 3.7, 8, 65, null], { tags: GB }),
  c(R1, 'AMD Ryzen 3 1200', 119, [4, 4, 3.1, 3.4, 8, 65, null], { tags: BB }),
  c(RR, 'AMD Ryzen 5 2400G', 179, [4, 8, 3.6, 3.9, 4, 65, 'Radeon Vega 11']),
  c(RR, 'AMD Ryzen 3 2200G', 109, [4, 4, 3.5, 3.7, 4, 65, 'Radeon Vega 8']),
  c(RR, 'AMD Athlon 200GE', 60, [2, 4, 3.2, undefined, 4, 35, 'Radeon Vega 3']),
  c(RR, 'AMD Athlon 3000G', 55, [2, 4, 3.5, undefined, 4, 35, 'Radeon Vega 3'], { year: 2019, node: '12 nm' }),

  // ─── Ryzen 2000 (Zen+) ───
  c(R2, 'AMD Ryzen 7 2700X', 339, [8, 16, 3.7, 4.3, 16, 105, null], { tags: ['gaming', 'creation'] }),
  c(R2, 'AMD Ryzen 7 2700', 309, [8, 16, 3.2, 4.1, 16, 65, null]),
  c(R2, 'AMD Ryzen 5 2600X', 239, [6, 12, 3.6, 4.2, 16, 95, null]),
  c(R2, 'AMD Ryzen 5 2600', 199, [6, 12, 3.4, 3.9, 16, 65, null], { tags: GB }),

  // ─── Ryzen 3000 (Zen 2) ───
  c(R3, 'AMD Ryzen 9 3950X', 799, [16, 32, 3.5, 4.7, 64, 105, null], { tags: ['creation', 'gaming'] }),
  c(R3, 'AMD Ryzen 9 3900X', 529, [12, 24, 3.8, 4.6, 64, 105, null], { tags: ['creation', 'gaming'] }),
  c(R3, 'AMD Ryzen 9 3900XT', 529, [12, 24, 3.8, 4.7, 64, 105, null], { year: 2020, tags: ['creation', 'gaming'] }),
  c(R3, 'AMD Ryzen 7 3800X', 419, [8, 16, 3.9, 4.5, 32, 105, null]),
  c(R3, 'AMD Ryzen 7 3800XT', 419, [8, 16, 3.9, 4.7, 32, 105, null], { year: 2020 }),
  c(R3, 'AMD Ryzen 7 3700X', 349, [8, 16, 3.6, 4.4, 32, 65, null], { tags: ['gaming', 'creation'] }),
  c(R3, 'AMD Ryzen 5 3600X', 259, [6, 12, 3.8, 4.4, 32, 95, null]),
  c(R3, 'AMD Ryzen 5 3600XT', 259, [6, 12, 3.8, 4.5, 32, 95, null], { year: 2020 }),
  c(R3, 'AMD Ryzen 5 3600', 209, [6, 12, 3.6, 4.2, 32, 65, null], { tags: GB }),
  c(R3, 'AMD Ryzen 3 3300X', 129, [4, 8, 3.8, 4.3, 16, 65, null], { year: 2020, tags: GB }),
  c(R3, 'AMD Ryzen 3 3100', 109, [4, 8, 3.6, 3.9, 16, 65, null], { year: 2020, tags: GB }),
  c(R3G, 'AMD Ryzen 5 3400G', 169, [4, 8, 3.7, 4.2, 4, 65, 'Radeon Vega 11']),
  c(R3G, 'AMD Ryzen 3 3200G', 109, [4, 4, 3.6, 4.0, 4, 65, 'Radeon Vega 8']),

  // ─── Ryzen 4000 / PRO G (AM4) ───
  c(R4, 'AMD Ryzen 7 PRO 4750G', undefined, [8, 16, 3.6, 4.4, 8, 65, 'Radeon Vega 8'], { year: 2020, tags: BH, family: 'Ryzen PRO 4000G' }),
  c(R4, 'AMD Ryzen 5 PRO 4650G', undefined, [6, 12, 3.7, 4.2, 8, 65, 'Radeon Vega 7'], { year: 2020, tags: BH, family: 'Ryzen PRO 4000G' }),
  c(R4, 'AMD Ryzen 5 4600G', 169, [6, 12, 3.7, 4.2, 8, 65, 'Radeon Vega 7']),
  c(R4, 'AMD Ryzen 5 4500', 139, [6, 12, 3.6, 4.1, 8, 65, null], { tags: GB }),
  c(R4, 'AMD Ryzen 3 4100', 109, [4, 8, 3.8, 4.0, 4, 65, null], { tags: GB }),

  // ─── Ryzen 5000 (compléments AM4) ───
  c(R5, 'AMD Ryzen 5 5600X3D', 249, [6, 12, 3.3, 4.4, 96, 105, null], { year: 2023, tags: ['gaming'] }),
  c(R5, 'AMD Ryzen 7 5700', 199, [8, 16, 3.7, 4.6, 16, 65, null], { year: 2022 }),
  c(R5, 'AMD Ryzen 5 5600XT', 169, [6, 12, 3.7, 4.7, 32, 65, null]),
  c(R5, 'AMD Ryzen 5 5600T', 159, [6, 12, 3.5, 4.5, 32, 65, null]),
  c(R5, 'AMD Ryzen 5 5600GT', 149, [6, 12, 3.6, 4.6, 16, 65, 'Radeon Vega 7'], { tags: BB }),
  c(R5, 'AMD Ryzen 5 5500GT', 139, [6, 12, 3.6, 4.4, 16, 65, 'Radeon Vega 7'], { tags: BB }),
  c(R5, 'AMD Ryzen 7 PRO 5750G', undefined, [8, 16, 3.8, 4.6, 16, 65, 'Radeon Vega 8'], { year: 2021, tags: BH, family: 'Ryzen PRO 5000G' }),
  c(R5, 'AMD Ryzen 5 PRO 5650G', undefined, [6, 12, 3.9, 4.4, 16, 65, 'Radeon Vega 7'], { year: 2021, tags: BH, family: 'Ryzen PRO 5000G' }),

  // ─── AM5 (compléments) ───
  c(R7, 'AMD Ryzen 5 7600X3D', 329, [6, 12, 4.1, 4.7, 96, 65, 'AMD Radeon (2 CU)']),
  c(R7, 'AMD Ryzen 5 7400F', 129, [6, 12, 3.7, 4.7, 32, 65, null], { year: 2025, tags: GB }),
  c(R8, 'AMD Ryzen 7 8700F', 299, [8, 16, 4.1, 5.0, 16, 65, null]),
  c(R9, 'AMD Ryzen 7 9850X3D', undefined, [8, 16, undefined, 5.6, 96, 120, 'AMD Radeon (2 CU)']),

  // ─── Threadripper ───
  c(TR1, 'AMD Ryzen Threadripper 1950X', 1030, [16, 32, 3.4, 4.0, 32, 180, null]),
  c(TR1, 'AMD Ryzen Threadripper 1920X', 820, [12, 24, 3.5, 4.0, 32, 180, null]),
  c(TR1, 'AMD Ryzen Threadripper 1900X', 560, [8, 16, 3.8, 4.0, 16, 180, null]),
  c(TR2, 'AMD Ryzen Threadripper 2990WX', 1850, [32, 64, 3.0, 4.2, 64, 250, null]),
  c(TR2, 'AMD Ryzen Threadripper 2970WX', 1350, [24, 48, 3.0, 4.2, 64, 250, null]),
  c(TR2, 'AMD Ryzen Threadripper 2950X', 950, [16, 32, 3.5, 4.4, 32, 180, null]),
  c(TR2, 'AMD Ryzen Threadripper 2920X', 680, [12, 24, 3.5, 4.3, 32, 180, null]),
  c(TR3, 'AMD Ryzen Threadripper 3990X', 4200, [64, 128, 2.9, 4.3, 256, 280, null], { year: 2020 }),
  c(TR3, 'AMD Ryzen Threadripper 3970X', 2100, [32, 64, 3.7, 4.5, 128, 280, null]),
  c(TR3, 'AMD Ryzen Threadripper 3960X', 1500, [24, 48, 3.8, 4.5, 128, 280, null]),
  c(TRP3, 'AMD Ryzen Threadripper PRO 3995WX', undefined, [64, 128, 2.7, 4.2, 256, 280, null]),
  c(TRP3, 'AMD Ryzen Threadripper PRO 3975WX', undefined, [32, 64, 3.5, 4.2, 128, 280, null]),
  c(TRP5, 'AMD Ryzen Threadripper PRO 5995WX', undefined, [64, 128, 2.7, 4.5, 256, 280, null]),
  c(TRP5, 'AMD Ryzen Threadripper PRO 5975WX', undefined, [32, 64, 3.6, 4.5, 128, 280, null]),
  c(TRP5, 'AMD Ryzen Threadripper PRO 5965WX', undefined, [24, 48, 3.8, 4.5, 128, 280, null]),
  c(TRP7, 'AMD Ryzen Threadripper PRO 7975WX', undefined, [32, 64, 4.0, 5.3, 128, 350, null]),
  c(TRP7, 'AMD Ryzen Threadripper PRO 7965WX', undefined, [24, 48, 4.2, 5.3, 128, 350, null]),
  c(TRP7, 'AMD Ryzen Threadripper PRO 7955WX', undefined, [16, 32, 4.5, 5.3, 64, 350, null]),
  c(TR9, 'AMD Ryzen Threadripper 9980X', undefined, [64, 128, 3.2, 5.4, 256, 350, null], { refurb: false }),
  c(TR9, 'AMD Ryzen Threadripper 9970X', undefined, [32, 64, 4.0, 5.4, 128, 350, null], { refurb: false }),
  c(TR9, 'AMD Ryzen Threadripper 9960X', undefined, [24, 48, 4.2, 5.4, 128, 350, null], { refurb: false }),
  c(TRP9, 'AMD Ryzen Threadripper PRO 9995WX', undefined, [96, 192, 2.5, 5.4, 384, 350, null], { refurb: false }),
  c(TRP9, 'AMD Ryzen Threadripper PRO 9985WX', undefined, [64, 128, 3.2, 5.4, 256, 350, null], { refurb: false }),
  c(TRP9, 'AMD Ryzen Threadripper PRO 9975WX', undefined, [32, 64, 4.0, 5.4, 128, 350, null], { refurb: false }),
];
