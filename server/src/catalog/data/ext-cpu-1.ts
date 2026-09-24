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
const SNB: Preset = { brand: I, family: 'Core 2e gén. (Sandy Bridge)', socket: 'LGA1155', mem: 'DDR3', node: '32 nm', tags: ['bureautique', 'budget'] };
const SNBE: Preset = { brand: I, family: 'Core i7 Sandy Bridge-E', socket: 'LGA2011', mem: 'DDR3 (4 canaux)', node: '32 nm', tags: ['creation', 'gaming'] };
const IVB: Preset = { brand: I, family: 'Core 3e gén. (Ivy Bridge)', year: 2012, socket: 'LGA1155', mem: 'DDR3', node: '22 nm', tags: ['bureautique', 'budget'] };
const IVBE: Preset = { brand: I, family: 'Core i7 Ivy Bridge-E', year: 2013, socket: 'LGA2011', mem: 'DDR3 (4 canaux)', node: '22 nm', tags: ['creation', 'gaming'] };
const HSW: Preset = { brand: I, family: 'Core 4e gén. (Haswell)', year: 2013, socket: 'LGA1150', mem: 'DDR3', node: '22 nm', tags: ['bureautique', 'budget'] };
const HSWE: Preset = { brand: I, family: 'Core i7 Haswell-E', year: 2014, socket: 'LGA2011-3', mem: 'DDR4 (4 canaux)', node: '22 nm', tags: ['creation', 'gaming'] };
const BDW: Preset = { brand: I, family: 'Core 5e gén. (Broadwell)', year: 2015, socket: 'LGA1150', mem: 'DDR3', node: '14 nm', tags: ['gaming'] };
const BDWE: Preset = { brand: I, family: 'Core i7 Broadwell-E', year: 2016, socket: 'LGA2011-3', mem: 'DDR4 (4 canaux)', node: '14 nm', tags: ['creation', 'gaming'] };
const SKL: Preset = { brand: I, family: 'Core 6e gén. (Skylake)', year: 2015, socket: 'LGA1151', mem: 'DDR4 / DDR3L', node: '14 nm', tags: ['bureautique', 'budget'] };
const KBL: Preset = { brand: I, family: 'Core 7e gén. (Kaby Lake)', year: 2017, socket: 'LGA1151', mem: 'DDR4 / DDR3L', node: '14 nm', tags: ['bureautique', 'budget'] };
const CFL: Preset = { brand: I, family: 'Core 8e gén. (Coffee Lake)', year: 2017, socket: 'LGA1151 (300)', mem: 'DDR4', node: '14 nm', tags: ['bureautique', 'gaming'] };
const CFLR: Preset = { brand: I, family: 'Core 9e gén. (Coffee Lake Refresh)', year: 2019, socket: 'LGA1151 (300)', mem: 'DDR4', node: '14 nm', tags: ['gaming'] };
const CML: Preset = { brand: I, family: 'Core 10e gén. (Comet Lake)', year: 2020, socket: 'LGA1200', mem: 'DDR4', node: '14 nm', tags: ['gaming', 'bureautique'] };

const hd2 = 'Intel HD 2000', hd3 = 'Intel HD 3000', hd25 = 'Intel HD 2500', hd4 = 'Intel HD 4000', hd44 = 'Intel HD 4400', hd46 = 'Intel HD 4600';
const hd510 = 'Intel HD 510', hd530 = 'Intel HD 530', hd610 = 'Intel HD 610', hd630 = 'Intel HD 630', u610 = 'Intel UHD 610', u630 = 'Intel UHD 630';
const G = ['gaming'], BB = ['bureautique', 'budget'], CG = ['creation', 'gaming'];

export const PRODUCTS: CatalogProduct[] = [
  // ─── Sandy Bridge (2011) ───
  c(SNB, 'Intel Core i7-2700K', 330, [4, 8, 3.5, 3.9, 8, 95, hd3], { tags: G }),
  c(SNB, 'Intel Core i7-2600K', 290, [4, 8, 3.4, 3.8, 8, 95, hd3], { tags: G }),
  c(SNB, 'Intel Core i7-2600', 270, [4, 8, 3.4, 3.8, 8, 95, hd2]),
  c(SNB, 'Intel Core i5-2500K', 200, [4, 4, 3.3, 3.7, 6, 95, hd3], { tags: G }),
  c(SNB, 'Intel Core i5-2500', 190, [4, 4, 3.3, 3.7, 6, 95, hd2]),
  c(SNB, 'Intel Core i5-2400', 170, [4, 4, 3.1, 3.4, 6, 95, hd2]),
  c(SNB, 'Intel Core i5-2300', 160, [4, 4, 2.8, 3.1, 6, 95, hd2]),
  c(SNB, 'Intel Core i3-2100', 110, [2, 4, 3.1, undefined, 3, 65, hd2]),
  c(SNB, 'Intel Core i3-2120', 120, [2, 4, 3.3, undefined, 3, 65, hd2]),
  c(SNB, 'Intel Pentium G620', 60, [2, 2, 2.6, undefined, 3, 65, 'Intel HD']),
  c(SNB, 'Intel Pentium G840', 70, [2, 2, 2.8, undefined, 3, 65, 'Intel HD']),
  c(SNB, 'Intel Pentium G850', 75, [2, 2, 2.9, undefined, 3, 65, 'Intel HD']),
  c(SNB, 'Intel Celeron G530', 45, [2, 2, 2.4, undefined, 2, 65, 'Intel HD']),
  c(SNBE, 'Intel Core i7-3960X', 1000, [6, 12, 3.3, 3.9, 15, 130, null]),
  c(SNBE, 'Intel Core i7-3930K', 560, [6, 12, 3.2, 3.8, 12, 130, null]),
  c(SNBE, 'Intel Core i7-3820', 300, [4, 8, 3.6, 3.8, 10, 130, null], { year: 2012 }),
  c(SNBE, 'Intel Core i7-3970X', 1000, [6, 12, 3.5, 4.0, 15, 150, null], { year: 2012 }),

  // ─── Ivy Bridge (2012) ───
  c(IVB, 'Intel Core i7-3770K', 320, [4, 8, 3.5, 3.9, 8, 77, hd4], { tags: G }),
  c(IVB, 'Intel Core i7-3770', 290, [4, 8, 3.4, 3.9, 8, 77, hd4]),
  c(IVB, 'Intel Core i7-3770S', undefined, [4, 8, 3.1, 3.9, 8, 65, hd4]),
  c(IVB, 'Intel Core i5-3570K', 210, [4, 4, 3.4, 3.8, 6, 77, hd4], { tags: G }),
  c(IVB, 'Intel Core i5-3570', 190, [4, 4, 3.4, 3.8, 6, 77, hd25]),
  c(IVB, 'Intel Core i5-3550', 190, [4, 4, 3.3, 3.7, 6, 77, hd25]),
  c(IVB, 'Intel Core i5-3470', 180, [4, 4, 3.2, 3.6, 6, 77, hd25]),
  c(IVB, 'Intel Core i5-3450', 175, [4, 4, 3.1, 3.5, 6, 77, hd25]),
  c(IVB, 'Intel Core i5-3330', 170, [4, 4, 3.0, 3.2, 6, 77, hd25]),
  c(IVB, 'Intel Core i5-3470S', undefined, [4, 4, 2.9, 3.6, 6, 65, hd25]),
  c(IVB, 'Intel Core i3-3220', 115, [2, 4, 3.3, undefined, 3, 55, hd25]),
  c(IVB, 'Intel Core i3-3240', 125, [2, 4, 3.4, undefined, 3, 55, hd25]),
  c(IVB, 'Intel Core i3-3225', 130, [2, 4, 3.3, undefined, 3, 55, hd4]),
  c(IVB, 'Intel Pentium G2020', 60, [2, 2, 2.9, undefined, 3, 55, 'Intel HD'], { year: 2013 }),
  c(IVB, 'Intel Pentium G2030', 65, [2, 2, 3.0, undefined, 3, 55, 'Intel HD'], { year: 2013 }),
  c(IVB, 'Intel Pentium G2120', 85, [2, 2, 3.1, undefined, 3, 55, 'Intel HD']),
  c(IVB, 'Intel Celeron G1610', 40, [2, 2, 2.6, undefined, 2, 55, 'Intel HD'], { year: 2013 }),
  c(IVBE, 'Intel Core i7-4960X', 1000, [6, 12, 3.6, 4.0, 15, 130, null]),
  c(IVBE, 'Intel Core i7-4930K', 560, [6, 12, 3.4, 3.9, 12, 130, null]),
  c(IVBE, 'Intel Core i7-4820K', 320, [4, 8, 3.7, 3.9, 10, 130, null]),

  // ─── Haswell (2013) / Devil's Canyon (2014) ───
  c(HSW, 'Intel Core i7-4790K', 330, [4, 8, 4.0, 4.4, 8, 88, hd46], { year: 2014, tags: G, family: 'Core 4e gén. (Devil\'s Canyon)' }),
  c(HSW, 'Intel Core i7-4790', 300, [4, 8, 3.6, 4.0, 8, 84, hd46], { year: 2014 }),
  c(HSW, 'Intel Core i7-4790S', undefined, [4, 8, 3.2, 4.0, 8, 65, hd46], { year: 2014 }),
  c(HSW, 'Intel Core i7-4770K', 320, [4, 8, 3.5, 3.9, 8, 84, hd46], { tags: G }),
  c(HSW, 'Intel Core i7-4770', 290, [4, 8, 3.4, 3.9, 8, 84, hd46]),
  c(HSW, 'Intel Core i7-4770S', undefined, [4, 8, 3.1, 3.9, 8, 65, hd46]),
  c(HSW, 'Intel Core i5-4690K', 230, [4, 4, 3.5, 3.9, 6, 88, hd46], { year: 2014, tags: G, family: 'Core 4e gén. (Devil\'s Canyon)' }),
  c(HSW, 'Intel Core i5-4690', 210, [4, 4, 3.5, 3.9, 6, 84, hd46], { year: 2014 }),
  c(HSW, 'Intel Core i5-4670K', 220, [4, 4, 3.4, 3.8, 6, 84, hd46], { tags: G }),
  c(HSW, 'Intel Core i5-4670', 200, [4, 4, 3.4, 3.8, 6, 84, hd46]),
  c(HSW, 'Intel Core i5-4590', 190, [4, 4, 3.3, 3.7, 6, 84, hd46], { year: 2014 }),
  c(HSW, 'Intel Core i5-4570', 185, [4, 4, 3.2, 3.6, 6, 84, hd46]),
  c(HSW, 'Intel Core i5-4460', 170, [4, 4, 3.2, 3.4, 6, 84, hd46], { year: 2014 }),
  c(HSW, 'Intel Core i5-4440', 170, [4, 4, 3.1, 3.3, 6, 84, hd46]),
  c(HSW, 'Intel Core i5-4590S', undefined, [4, 4, 3.0, 3.7, 6, 65, hd46], { year: 2014 }),
  c(HSW, 'Intel Core i3-4130', 115, [2, 4, 3.4, undefined, 3, 54, hd44]),
  c(HSW, 'Intel Core i3-4150', 115, [2, 4, 3.5, undefined, 3, 54, hd44], { year: 2014 }),
  c(HSW, 'Intel Core i3-4160', 115, [2, 4, 3.6, undefined, 3, 54, hd44], { year: 2014 }),
  c(HSW, 'Intel Core i3-4330', 135, [2, 4, 3.5, undefined, 4, 54, hd46]),
  c(HSW, 'Intel Pentium G3258', 70, [2, 2, 3.2, undefined, 3, 53, 'Intel HD'], { year: 2014, tags: ['gaming', 'budget'], family: 'Pentium Anniversary Edition' }),
  c(HSW, 'Intel Pentium G3220', 60, [2, 2, 3.0, undefined, 3, 54, 'Intel HD']),
  c(HSW, 'Intel Pentium G3250', 65, [2, 2, 3.2, undefined, 3, 53, 'Intel HD'], { year: 2014 }),
  c(HSW, 'Intel Pentium G3420', 75, [2, 2, 3.2, undefined, 3, 54, 'Intel HD']),
  c(HSW, 'Intel Pentium G3440', 80, [2, 2, 3.3, undefined, 3, 54, 'Intel HD'], { year: 2014 }),
  c(HSW, 'Intel Celeron G1820', 40, [2, 2, 2.7, undefined, 2, 53, 'Intel HD'], { year: 2014 }),
  c(HSW, 'Intel Celeron G1840', 45, [2, 2, 2.8, undefined, 2, 53, 'Intel HD'], { year: 2014 }),
  c(HSWE, 'Intel Core i7-5960X', 1050, [8, 16, 3.0, 3.5, 20, 140, null]),
  c(HSWE, 'Intel Core i7-5930K', 600, [6, 12, 3.5, 3.7, 15, 140, null]),
  c(HSWE, 'Intel Core i7-5820K', 400, [6, 12, 3.3, 3.6, 15, 140, null]),
  c(BDW, 'Intel Core i7-5775C', 380, [4, 8, 3.3, 3.7, 6, 65, 'Intel Iris Pro 6200']),
  c(BDW, 'Intel Core i5-5675C', 290, [4, 4, 3.1, 3.6, 4, 65, 'Intel Iris Pro 6200']),
  c(BDWE, 'Intel Core i7-6950X', 1750, [10, 20, 3.0, 3.5, 25, 140, null]),
  c(BDWE, 'Intel Core i7-6900K', 1100, [8, 16, 3.2, 3.7, 20, 140, null]),
  c(BDWE, 'Intel Core i7-6850K', 650, [6, 12, 3.6, 3.8, 15, 140, null]),
  c(BDWE, 'Intel Core i7-6800K', 450, [6, 12, 3.4, 3.6, 15, 140, null]),

  // ─── Skylake (2015) ───
  c(SKL, 'Intel Core i7-6700K', 380, [4, 8, 4.0, 4.2, 8, 91, hd530], { tags: G }),
  c(SKL, 'Intel Core i7-6700', 340, [4, 8, 3.4, 4.0, 8, 65, hd530]),
  c(SKL, 'Intel Core i7-6700T', undefined, [4, 8, 2.8, 3.6, 8, 35, hd530]),
  c(SKL, 'Intel Core i5-6600K', 270, [4, 4, 3.5, 3.9, 6, 91, hd530], { tags: G }),
  c(SKL, 'Intel Core i5-6600', 250, [4, 4, 3.3, 3.9, 6, 65, hd530]),
  c(SKL, 'Intel Core i5-6500', 220, [4, 4, 3.2, 3.6, 6, 65, hd530]),
  c(SKL, 'Intel Core i5-6400', 200, [4, 4, 2.7, 3.3, 6, 65, hd530]),
  c(SKL, 'Intel Core i5-6500T', undefined, [4, 4, 2.5, 3.1, 6, 35, hd530]),
  c(SKL, 'Intel Core i3-6100', 130, [2, 4, 3.7, undefined, 3, 51, hd530]),
  c(SKL, 'Intel Core i3-6300', 160, [2, 4, 3.8, undefined, 4, 51, hd530]),
  c(SKL, 'Intel Pentium G4400', 70, [2, 2, 3.3, undefined, 3, 54, hd510]),
  c(SKL, 'Intel Pentium G4500', 85, [2, 2, 3.5, undefined, 3, 51, hd530]),
  c(SKL, 'Intel Celeron G3900', 45, [2, 2, 2.8, undefined, 2, 51, hd510]),

  // ─── Kaby Lake (2017) ───
  c(KBL, 'Intel Core i7-7700K', 380, [4, 8, 4.2, 4.5, 8, 91, hd630], { tags: G }),
  c(KBL, 'Intel Core i7-7700', 340, [4, 8, 3.6, 4.2, 8, 65, hd630]),
  c(KBL, 'Intel Core i7-7700T', undefined, [4, 8, 2.9, 3.8, 8, 35, hd630]),
  c(KBL, 'Intel Core i5-7600K', 260, [4, 4, 3.8, 4.2, 6, 91, hd630], { tags: G }),
  c(KBL, 'Intel Core i5-7600', 240, [4, 4, 3.5, 4.1, 6, 65, hd630]),
  c(KBL, 'Intel Core i5-7500', 220, [4, 4, 3.4, 3.8, 6, 65, hd630]),
  c(KBL, 'Intel Core i5-7400', 200, [4, 4, 3.0, 3.5, 6, 65, hd630]),
  c(KBL, 'Intel Core i5-7500T', undefined, [4, 4, 2.7, 3.3, 6, 35, hd630]),
  c(KBL, 'Intel Core i3-7100', 130, [2, 4, 3.9, undefined, 3, 51, hd630]),
  c(KBL, 'Intel Core i3-7300', 160, [2, 4, 4.0, undefined, 4, 51, hd630]),
  c(KBL, 'Intel Core i3-7350K', 180, [2, 4, 4.2, undefined, 4, 60, hd630], { tags: G }),
  c(KBL, 'Intel Pentium G4560', 70, [2, 4, 3.5, undefined, 3, 54, hd610], { tags: ['budget', 'gaming'] }),
  c(KBL, 'Intel Pentium G4600', 90, [2, 4, 3.6, undefined, 3, 51, hd630]),
  c(KBL, 'Intel Celeron G3930', 45, [2, 2, 2.9, undefined, 2, 51, hd610]),

  // ─── Coffee Lake 8e gén. (2017-2018) ───
  c(CFL, 'Intel Core i7-8700K', 420, [6, 12, 3.7, 4.7, 12, 95, u630], { tags: G }),
  c(CFL, 'Intel Core i7-8086K', 480, [6, 12, 4.0, 5.0, 12, 95, u630], { year: 2018, tags: G }),
  c(CFL, 'Intel Core i7-8700', 340, [6, 12, 3.2, 4.6, 12, 65, u630]),
  c(CFL, 'Intel Core i5-8600K', 280, [6, 6, 3.6, 4.3, 9, 95, u630], { tags: G }),
  c(CFL, 'Intel Core i5-8600', 250, [6, 6, 3.1, 4.3, 9, 65, u630], { year: 2018 }),
  c(CFL, 'Intel Core i5-8500', 220, [6, 6, 3.0, 4.1, 9, 65, u630], { year: 2018 }),
  c(CFL, 'Intel Core i5-8400', 200, [6, 6, 2.8, 4.0, 9, 65, u630], { tags: ['gaming', 'budget'] }),
  c(CFL, 'Intel Core i5-8500T', undefined, [6, 6, 2.1, 3.5, 9, 35, u630], { year: 2018, tags: BB }),
  c(CFL, 'Intel Core i3-8100', 130, [4, 4, 3.6, undefined, 6, 65, u630], { tags: BB }),
  c(CFL, 'Intel Core i3-8350K', 190, [4, 4, 4.0, undefined, 8, 91, u630], { tags: G }),
  c(CFL, 'Intel Core i3-8300', 160, [4, 4, 3.7, undefined, 8, 62, u630], { year: 2018 }),
  c(CFL, 'Intel Pentium Gold G5400', 70, [2, 4, 3.7, undefined, 4, 58, u610], { year: 2018, tags: BB }),
  c(CFL, 'Intel Pentium Gold G5500', 90, [2, 4, 3.8, undefined, 4, 54, u630], { year: 2018, tags: BB }),
  c(CFL, 'Intel Celeron G4900', 50, [2, 2, 3.1, undefined, 2, 54, u610], { year: 2018, tags: BB }),

  // ─── Coffee Lake Refresh 9e gén. (2018-2019) ───
  c(CFLR, 'Intel Core i9-9900K', 530, [8, 16, 3.6, 5.0, 16, 95, u630], { year: 2018 }),
  c(CFLR, 'Intel Core i9-9900KF', 520, [8, 16, 3.6, 5.0, 16, 95, null]),
  c(CFLR, 'Intel Core i9-9900KS', 580, [8, 16, 4.0, 5.0, 16, 127, u630]),
  c(CFLR, 'Intel Core i9-9900', 470, [8, 16, 3.1, 5.0, 16, 65, u630]),
  c(CFLR, 'Intel Core i7-9700K', 420, [8, 8, 3.6, 4.9, 12, 95, u630], { year: 2018 }),
  c(CFLR, 'Intel Core i7-9700KF', 410, [8, 8, 3.6, 4.9, 12, 95, null]),
  c(CFLR, 'Intel Core i7-9700', 360, [8, 8, 3.0, 4.7, 12, 65, u630]),
  c(CFLR, 'Intel Core i7-9700F', 350, [8, 8, 3.0, 4.7, 12, 65, null]),
  c(CFLR, 'Intel Core i5-9600K', 270, [6, 6, 3.7, 4.6, 9, 95, u630], { year: 2018 }),
  c(CFLR, 'Intel Core i5-9600KF', 260, [6, 6, 3.7, 4.6, 9, 95, null]),
  c(CFLR, 'Intel Core i5-9500', 220, [6, 6, 3.0, 4.4, 9, 65, u630], { tags: ['bureautique'] }),
  c(CFLR, 'Intel Core i5-9400', 200, [6, 6, 2.9, 4.1, 9, 65, u630], { tags: ['bureautique', 'gaming'] }),
  c(CFLR, 'Intel Core i5-9400F', 170, [6, 6, 2.9, 4.1, 9, 65, null], { tags: ['gaming', 'budget'] }),
  c(CFLR, 'Intel Core i3-9100F', 90, [4, 4, 3.6, 4.2, 6, 65, null], { tags: ['gaming', 'budget'] }),
  c(CFLR, 'Intel Core i3-9100', 130, [4, 4, 3.6, 4.2, 6, 65, u630], { tags: BB }),
  c(CFLR, 'Intel Core i3-9350K', 190, [4, 4, 4.0, 4.6, 8, 91, u630]),
  c(CFLR, 'Intel Pentium Gold G5420', 75, [2, 4, 3.8, undefined, 4, 54, u610], { tags: BB }),
  c(CFLR, 'Intel Celeron G4930', 50, [2, 2, 3.2, undefined, 2, 54, u610], { tags: BB }),
];

// Constantes utilitaires non utilisées dans ce fichier (conservées pour homogénéité).
void [CML];

void CG;
