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
const m = (family: string, year: number, node: string, mem: string, tags = ['mobile', 'bureautique']): Preset => ({ brand: I, family, year, socket: 'BGA (soudé)', mem, node, tags });
const SKLU = m('Core 6e gén. mobile (Skylake)', 2015, '14 nm', 'DDR4 / LPDDR3');
const KBLU = m('Core 7e gén. mobile (Kaby Lake)', 2016, '14 nm', 'DDR4 / LPDDR3');
const KBLR = m('Core 8e gén. mobile (Kaby Lake R)', 2017, '14 nm', 'DDR4 / LPDDR3');
const WHL = m('Core 8e gén. mobile (Whiskey Lake)', 2018, '14 nm', 'DDR4 / LPDDR3');
const CMLU = m('Core 10e gén. mobile (Comet Lake)', 2019, '14 nm', 'DDR4 / LPDDR3');
const TGL = m('Core 11e gén. mobile (Tiger Lake)', 2020, '10 nm SuperFin', 'DDR4 / LPDDR4X');
const ADLM = m('Core 12e gén. mobile (Alder Lake)', 2022, 'Intel 7', 'DDR5 / DDR4 / LPDDR5');
const RPLM = m('Core 13e gén. mobile (Raptor Lake)', 2023, 'Intel 7', 'DDR5 / DDR4 / LPDDR5');
const HQ = m('Core mobile H (hautes performances)', 2015, '14 nm', 'DDR4', ['mobile', 'gaming']);
const HX = m('Core HX (Raptor Lake)', 2023, 'Intel 7', 'DDR5 / DDR4', ['mobile', 'gaming', 'creation']);
const MTL = m('Core Ultra 100 (Meteor Lake)', 2023, 'Intel 4', 'DDR5 / LPDDR5X', ['mobile', 'bureautique', 'ia']);
const LNL = m('Core Ultra 200V (Lunar Lake)', 2024, 'TSMC N3B', 'LPDDR5X intégrée', ['mobile', 'bureautique', 'ia']);
const ARLH = m('Core Ultra 200H (Arrow Lake)', 2025, 'TSMC N3B', 'DDR5 / LPDDR5X', ['mobile', 'creation', 'ia']);
const ARLHX = m('Core Ultra 200HX (Arrow Lake)', 2025, 'TSMC N3B', 'DDR5', ['mobile', 'gaming', 'creation']);

const hd520 = 'Intel HD 520', hd620 = 'Intel HD 620', u620 = 'Intel UHD 620', uhd = 'Intel UHD', xe = 'Intel Iris Xe', arc = 'Intel Arc';
const MG = ['mobile', 'gaming'];

const APPLE = (family: string, year: number, node: string, mem: string): Preset => ({ brand: 'Apple', family, year, socket: 'SoC soudé', mem, node, tags: ['mobile', 'creation', 'ia'] });
const M1 = APPLE('Apple M1', 2020, '5 nm', 'LPDDR4X unifiée');
const M1P = APPLE('Apple M1', 2021, '5 nm', 'LPDDR5 unifiée');
const M2 = APPLE('Apple M2', 2022, '5 nm', 'LPDDR5 unifiée');
const M3 = APPLE('Apple M3', 2023, '3 nm', 'LPDDR5 unifiée');
const M4 = APPLE('Apple M4', 2024, '3 nm', 'LPDDR5X unifiée');
const QC: Preset = { brand: 'Qualcomm', family: 'Snapdragon X', year: 2024, socket: 'SoC soudé', mem: 'LPDDR5X', node: '4 nm', tags: ['mobile', 'bureautique', 'ia'] };

export const PRODUCTS: CatalogProduct[] = [
  // ─── Intel mobile U / P (portables bureautiques, très présents en reconditionné) ───
  c(SKLU, 'Intel Core i5-6200U', undefined, [2, 4, 2.3, 2.8, 3, 15, hd520]),
  c(SKLU, 'Intel Core i7-6500U', undefined, [2, 4, 2.5, 3.1, 4, 15, hd520]),
  c(KBLU, 'Intel Core i5-7200U', undefined, [2, 4, 2.5, 3.1, 3, 15, hd620]),
  c(KBLU, 'Intel Core i7-7500U', undefined, [2, 4, 2.7, 3.5, 4, 15, hd620]),
  c(KBLR, 'Intel Core i5-8250U', undefined, [4, 8, 1.6, 3.4, 6, 15, u620]),
  c(KBLR, 'Intel Core i5-8350U', undefined, [4, 8, 1.7, 3.6, 6, 15, u620]),
  c(KBLR, 'Intel Core i7-8550U', undefined, [4, 8, 1.8, 4.0, 8, 15, u620]),
  c(KBLR, 'Intel Core i7-8650U', undefined, [4, 8, 1.9, 4.2, 8, 15, u620]),
  c(WHL, 'Intel Core i5-8265U', undefined, [4, 8, 1.6, 3.9, 6, 15, u620]),
  c(WHL, 'Intel Core i5-8365U', undefined, [4, 8, 1.6, 4.1, 6, 15, u620], { year: 2019 }),
  c(WHL, 'Intel Core i7-8665U', undefined, [4, 8, 1.9, 4.8, 8, 15, u620], { year: 2019 }),
  c(CMLU, 'Intel Core i5-10210U', undefined, [4, 8, 1.6, 4.2, 6, 15, uhd]),
  c(CMLU, 'Intel Core i5-10310U', undefined, [4, 8, 1.7, 4.4, 6, 15, uhd], { year: 2020 }),
  c(CMLU, 'Intel Core i7-10510U', undefined, [4, 8, 1.8, 4.9, 8, 15, uhd]),
  c(CMLU, 'Intel Core i7-10610U', undefined, [4, 8, 1.8, 4.9, 8, 15, uhd], { year: 2020 }),
  c(TGL, 'Intel Core i5-1135G7', undefined, [4, 8, 2.4, 4.2, 8, 28, xe]),
  c(TGL, 'Intel Core i5-1145G7', undefined, [4, 8, 2.6, 4.4, 8, 28, xe], { year: 2021 }),
  c(TGL, 'Intel Core i7-1165G7', undefined, [4, 8, 2.8, 4.7, 12, 28, xe]),
  c(TGL, 'Intel Core i7-1185G7', undefined, [4, 8, 3.0, 4.8, 12, 28, xe]),
  c(ADLM, 'Intel Core i5-1235U', undefined, [10, 12, 1.3, 4.4, 12, 15, xe]),
  c(ADLM, 'Intel Core i5-1245U', undefined, [10, 12, 1.6, 4.4, 12, 15, xe]),
  c(ADLM, 'Intel Core i7-1255U', undefined, [10, 12, 1.7, 4.7, 12, 15, xe]),
  c(ADLM, 'Intel Core i7-1265U', undefined, [10, 12, 1.8, 4.8, 12, 15, xe]),
  c(ADLM, 'Intel Core i5-1240P', undefined, [12, 16, 1.7, 4.4, 12, 28, xe]),
  c(ADLM, 'Intel Core i7-1260P', undefined, [12, 16, 2.1, 4.7, 18, 28, xe]),
  c(RPLM, 'Intel Core i5-1335U', undefined, [10, 12, 1.3, 4.6, 12, 15, xe]),
  c(RPLM, 'Intel Core i5-1345U', undefined, [10, 12, 1.6, 4.7, 12, 15, xe]),
  c(RPLM, 'Intel Core i7-1355U', undefined, [10, 12, 1.7, 5.0, 12, 15, xe]),
  c(RPLM, 'Intel Core i7-1365U', undefined, [10, 12, 1.8, 5.2, 12, 15, xe]),

  // ─── Intel mobile H / HX (portables gaming et création) ───
  c(HQ, 'Intel Core i7-6700HQ', undefined, [4, 8, 2.6, 3.5, 6, 45, 'Intel HD 530']),
  c(HQ, 'Intel Core i7-7700HQ', undefined, [4, 8, 2.8, 3.8, 6, 45, 'Intel HD 630'], { year: 2017 }),
  c(HQ, 'Intel Core i7-8750H', undefined, [6, 12, 2.2, 4.1, 9, 45, 'Intel UHD 630'], { year: 2018 }),
  c(HQ, 'Intel Core i7-9750H', undefined, [6, 12, 2.6, 4.5, 12, 45, 'Intel UHD 630'], { year: 2019 }),
  c(HQ, 'Intel Core i5-10300H', undefined, [4, 8, 2.5, 4.5, 8, 45, 'Intel UHD'], { year: 2020 }),
  c(HQ, 'Intel Core i7-10750H', undefined, [6, 12, 2.6, 5.0, 12, 45, 'Intel UHD'], { year: 2020 }),
  c(HQ, 'Intel Core i5-11400H', undefined, [6, 12, 2.7, 4.5, 12, 45, 'Intel UHD'], { year: 2021, node: '10 nm SuperFin' }),
  c(HQ, 'Intel Core i7-11800H', undefined, [8, 16, 2.3, 4.6, 24, 45, 'Intel UHD'], { year: 2021, node: '10 nm SuperFin' }),
  c(ADLM, 'Intel Core i5-12450H', undefined, [8, 12, 2.0, 4.4, 12, 45, uhd], { tags: MG }),
  c(ADLM, 'Intel Core i5-12500H', undefined, [12, 16, 2.5, 4.5, 18, 45, xe], { tags: MG }),
  c(ADLM, 'Intel Core i7-12700H', undefined, [14, 20, 2.3, 4.7, 24, 45, xe], { tags: MG }),
  c(ADLM, 'Intel Core i9-12900H', undefined, [14, 20, 2.5, 5.0, 24, 45, xe], { tags: MG }),
  c(RPLM, 'Intel Core i5-13420H', undefined, [8, 12, 2.1, 4.6, 12, 45, uhd], { tags: MG }),
  c(RPLM, 'Intel Core i5-13500H', undefined, [12, 16, 2.6, 4.7, 18, 45, xe], { tags: MG }),
  c(RPLM, 'Intel Core i7-13620H', undefined, [10, 16, 2.4, 4.9, 24, 45, uhd], { tags: MG }),
  c(RPLM, 'Intel Core i7-13700H', undefined, [14, 20, 2.4, 5.0, 24, 45, xe], { tags: MG }),
  c(RPLM, 'Intel Core i9-13900H', undefined, [14, 20, 2.6, 5.4, 24, 45, xe], { tags: MG }),
  c(HX, 'Intel Core i5-13450HX', undefined, [10, 16, 2.4, 4.6, 20, 55, uhd]),
  c(HX, 'Intel Core i7-13650HX', undefined, [14, 20, 2.6, 4.9, 24, 55, uhd]),
  c(HX, 'Intel Core i9-13980HX', undefined, [24, 32, 2.2, 5.6, 36, 55, uhd]),
  c(HX, 'Intel Core i7-14650HX', undefined, [16, 24, 2.2, 5.2, 30, 55, uhd], { year: 2024, family: 'Core HX (Raptor Lake Refresh)' }),
  c(HX, 'Intel Core i7-14700HX', undefined, [20, 28, 2.1, 5.5, 33, 55, uhd], { year: 2024, family: 'Core HX (Raptor Lake Refresh)' }),
  c(HX, 'Intel Core i9-14900HX', undefined, [24, 32, 2.2, 5.8, 36, 55, uhd], { year: 2024, family: 'Core HX (Raptor Lake Refresh)' }),

  // ─── Intel Core Ultra mobile ───
  c(MTL, 'Intel Core Ultra 5 125U', undefined, [12, 14, undefined, 4.3, 12, 15, 'Intel Graphics']),
  c(MTL, 'Intel Core Ultra 7 155U', undefined, [12, 14, undefined, 4.8, 12, 15, 'Intel Graphics']),
  c(MTL, 'Intel Core Ultra 5 125H', undefined, [14, 18, undefined, 4.5, 18, 28, arc]),
  c(MTL, 'Intel Core Ultra 7 155H', undefined, [16, 22, undefined, 4.8, 24, 28, arc]),
  c(MTL, 'Intel Core Ultra 7 165H', undefined, [16, 22, undefined, 5.0, 24, 28, arc]),
  c(MTL, 'Intel Core Ultra 9 185H', undefined, [16, 22, undefined, 5.1, 24, 45, arc]),
  c(LNL, 'Intel Core Ultra 5 226V', undefined, [8, 8, undefined, 4.5, 12, 17, 'Intel Arc 130V']),
  c(LNL, 'Intel Core Ultra 5 228V', undefined, [8, 8, undefined, 4.5, 12, 17, 'Intel Arc 130V']),
  c(LNL, 'Intel Core Ultra 7 256V', undefined, [8, 8, undefined, 4.8, 12, 17, 'Intel Arc 140V']),
  c(LNL, 'Intel Core Ultra 7 258V', undefined, [8, 8, undefined, 4.8, 12, 17, 'Intel Arc 140V']),
  c(LNL, 'Intel Core Ultra 9 288V', undefined, [8, 8, undefined, 5.1, 12, 30, 'Intel Arc 140V']),
  c(ARLH, 'Intel Core Ultra 5 225H', undefined, [14, 14, undefined, 4.9, 18, 28, 'Intel Arc 130T']),
  c(ARLH, 'Intel Core Ultra 7 255H', undefined, [16, 16, undefined, 5.1, 24, 28, 'Intel Arc 140T']),
  c(ARLH, 'Intel Core Ultra 9 285H', undefined, [16, 16, undefined, 5.4, 24, 45, 'Intel Arc 140T']),
  c(ARLHX, 'Intel Core Ultra 7 255HX', undefined, [20, 20, undefined, 5.2, 30, 55, 'Intel Graphics']),
  c(ARLHX, 'Intel Core Ultra 9 275HX', undefined, [24, 24, undefined, 5.4, 36, 55, 'Intel Graphics']),

  // ─── Apple Silicon ───
  c(M1, 'Apple M1', undefined, [8, 8, undefined, 3.2, undefined, undefined, 'GPU Apple jusqu’à 8 cœurs']),
  c(M1P, 'Apple M1 Pro', undefined, [10, 10, undefined, 3.2, undefined, undefined, 'GPU Apple jusqu’à 16 cœurs']),
  c(M1P, 'Apple M1 Max', undefined, [10, 10, undefined, 3.2, undefined, undefined, 'GPU Apple jusqu’à 32 cœurs']),
  c(M1P, 'Apple M1 Ultra', undefined, [20, 20, undefined, 3.2, undefined, undefined, 'GPU Apple jusqu’à 64 cœurs'], { year: 2022 }),
  c(M2, 'Apple M2', undefined, [8, 8, undefined, 3.5, undefined, undefined, 'GPU Apple jusqu’à 10 cœurs']),
  c(M2, 'Apple M2 Pro', undefined, [12, 12, undefined, 3.5, undefined, undefined, 'GPU Apple jusqu’à 19 cœurs'], { year: 2023 }),
  c(M2, 'Apple M2 Max', undefined, [12, 12, undefined, undefined, undefined, undefined, 'GPU Apple jusqu’à 38 cœurs'], { year: 2023 }),
  c(M2, 'Apple M2 Ultra', undefined, [24, 24, undefined, 3.5, undefined, undefined, 'GPU Apple jusqu’à 76 cœurs'], { year: 2023 }),
  c(M3, 'Apple M3', undefined, [8, 8, undefined, 4.05, undefined, undefined, 'GPU Apple jusqu’à 10 cœurs']),
  c(M3, 'Apple M3 Pro', undefined, [12, 12, undefined, 4.05, undefined, undefined, 'GPU Apple jusqu’à 18 cœurs']),
  c(M3, 'Apple M3 Max', undefined, [16, 16, undefined, 4.05, undefined, undefined, 'GPU Apple jusqu’à 40 cœurs']),
  c(M3, 'Apple M3 Ultra', undefined, [32, 32, undefined, 4.05, undefined, undefined, 'GPU Apple jusqu’à 80 cœurs'], { year: 2025 }),
  c(M4, 'Apple M4', undefined, [10, 10, undefined, 4.4, undefined, undefined, 'GPU Apple jusqu’à 10 cœurs']),
  c(M4, 'Apple M4 Pro', undefined, [14, 14, undefined, 4.5, undefined, undefined, 'GPU Apple jusqu’à 20 cœurs']),
  c(M4, 'Apple M4 Max', undefined, [16, 16, undefined, 4.5, undefined, undefined, 'GPU Apple jusqu’à 40 cœurs']),

  // ─── Qualcomm Snapdragon X (PC Windows ARM) ───
  c(QC, 'Qualcomm Snapdragon X Elite X1E-84-100', undefined, [12, 12, 3.8, 4.2, undefined, undefined, 'Adreno X1-85']),
  c(QC, 'Qualcomm Snapdragon X Elite X1E-80-100', undefined, [12, 12, 3.4, 4.0, undefined, undefined, 'Adreno X1-85']),
  c(QC, 'Qualcomm Snapdragon X Elite X1E-78-100', undefined, [12, 12, 3.4, undefined, undefined, undefined, 'Adreno X1-85']),
  c(QC, 'Qualcomm Snapdragon X Plus X1P-64-100', undefined, [10, 10, 3.4, undefined, undefined, undefined, 'Adreno X1-85']),
  c(QC, 'Qualcomm Snapdragon X Plus X1P-42-100', undefined, [8, 8, 3.2, 3.4, undefined, undefined, 'Adreno X1-45']),
];
