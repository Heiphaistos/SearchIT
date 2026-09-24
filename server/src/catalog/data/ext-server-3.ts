import type { CatalogProduct } from '../types.js';

interface Opt { ram?: string; baies?: string; net?: string; psu?: string; tags?: string[]; msrp?: number; refurb?: boolean }

const slug = (t: string): string =>
  t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\+/g, '-plus').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Construit une fiche serveur : m = nom sans la marque (« PowerEdge R620 »). */
function s(brand: string, m: string, family: string, year: number, fmt: string, cpu: string | undefined, sockets: number | undefined, gen: string | undefined, o: Opt = {}): CatalogProduct {
  const refurb = o.refurb ?? year <= 2020;
  const specs: Record<string, string | number> = { 'Format': fmt };
  if (cpu) specs['Processeurs'] = cpu;
  if (sockets !== undefined) specs['Sockets'] = sockets;
  if (o.ram) specs['RAM max'] = o.ram;
  if (o.baies) specs['Baies disques'] = o.baies;
  if (o.net) specs['Réseau'] = o.net;
  if (o.psu) specs['Alimentation'] = o.psu;
  if (gen) specs['Génération'] = gen;
  const small = /Tour|1U|2U|Ultra-compact|Mini/.test(fmt);
  const tags = o.tags ?? (refurb && small ? ['serveur', 'pro', 'homelab'] : ['serveur', 'pro']);
  const p: CatalogProduct = { id: 'server-' + slug(`${brand} ${m}`), category: 'server', brand, name: `${brand} ${m}`, family, year, refurbishable: refurb, tags, specs };
  if (o.msrp) p.msrp = o.msrp;
  return p;
}

const L = 'Lenovo';
const I = 'IBM';
const E5_26 = 'Intel Xeon E5-2600 / E5-2600 v2';
const E5_24 = 'Intel Xeon E5-2400 / E5-2400 v2';
const V34 = 'Intel Xeon E5-2600 v3/v4';
const SP12 = 'Intel Xeon Scalable 1re/2e génération';
const SP3 = 'Intel Xeon Scalable 3e génération';
const SP45 = 'Intel Xeon Scalable 4e/5e génération';
const X6 = 'Intel Xeon 6';
const EPYC23 = 'AMD EPYC 7002/7003';
const EPYC4 = 'AMD EPYC 9004';
const AI = { tags: ['serveur', 'pro', 'ia'] };
const EDGE = { tags: ['serveur', 'pro', 'robuste'] };

/** IBM/Lenovo System x, Lenovo ThinkServer et ThinkSystem (V1 à V4). */
export const PRODUCTS: CatalogProduct[] = [
  // ─── IBM System x / Flex / NeXtScale ───
  s(I, 'System x3100 M4', 'System x', 2012, 'Tour', 'Intel Xeon E3-1200 v2', 1, 'M4'),
  s(I, 'System x3100 M5', 'System x', 2014, 'Tour', 'Intel Xeon E3-1200 v3', 1, 'M5'),
  s(I, 'System x3250 M4', 'System x', 2012, 'Rack 1U', 'Intel Xeon E3-1200 v2', 1, 'M4'),
  s(I, 'System x3250 M5', 'System x', 2014, 'Rack 1U', 'Intel Xeon E3-1200 v3', 1, 'M5'),
  s(I, 'System x3300 M4', 'System x', 2012, 'Tour', E5_24, 2, 'M4'),
  s(I, 'System x3500 M4', 'System x', 2012, 'Tour (convertible rack 5U)', E5_26, 2, 'M4'),
  s(I, 'System x3530 M4', 'System x', 2012, 'Rack 1U', E5_24, 2, 'M4'),
  s(I, 'System x3550 M4', 'System x', 2012, 'Rack 1U', E5_26, 2, 'M4', { ram: '24 slots DDR3' }),
  s(I, 'System x3630 M4', 'System x', 2012, 'Rack 2U (stockage)', E5_24, 2, 'M4', { baies: 'jusqu’à 14 x 3,5"' }),
  s(I, 'System x3650 M4', 'System x', 2012, 'Rack 2U', E5_26, 2, 'M4', { ram: '24 slots DDR3', baies: 'jusqu’à 16 x 2,5" ou 6 x 3,5"' }),
  s(I, 'System x3650 M4 BD', 'System x', 2013, 'Rack 2U (stockage)', E5_26, 2, 'M4', { baies: 'jusqu’à 14 x 3,5"' }),
  s(I, 'System x3750 M4', 'System x', 2012, 'Rack 2U', 'Intel Xeon E5-4600 / E5-4600 v2', 4, 'M4', { ram: '48 slots DDR3' }),
  s(I, 'System x3850 X6', 'System x', 2014, 'Rack 4U', 'Intel Xeon E7-4800/8800 v2', 4, 'X6'),
  s(I, 'System x3950 X6', 'System x', 2014, 'Rack 8U', 'Intel Xeon E7-8800 v2', 8, 'X6'),
  s(I, 'Flex System x240', 'Flex System', 2012, 'Nœud de calcul (châssis Flex Enterprise)', E5_26, 2, undefined),
  s(I, 'Flex System x440', 'Flex System', 2013, 'Nœud de calcul double largeur (châssis Flex Enterprise)', 'Intel Xeon E5-4600 / E5-4600 v2', 4, undefined),
  s(I, 'NeXtScale nx360 M4', 'NeXtScale', 2013, 'Nœud 1U demi-largeur (châssis n1200)', 'Intel Xeon E5-2600 v2', 2, 'M4'),
  s(L, 'System x3250 M6', 'System x', 2016, 'Rack 1U', 'Intel Xeon E3-1200 v5', 1, 'M6'),
  s(L, 'System x3500 M5', 'System x', 2014, 'Tour (convertible rack 5U)', V34, 2, 'M5'),
  s(L, 'System x3550 M5', 'System x', 2014, 'Rack 1U', V34, 2, 'M5', { ram: '24 slots DDR4', baies: 'jusqu’à 10 x 2,5" ou 4 x 3,5"' }),
  s(L, 'System x3650 M5', 'System x', 2014, 'Rack 2U', V34, 2, 'M5', { ram: '24 slots DDR4', baies: 'jusqu’à 26 x 2,5" ou 14 x 3,5"' }),
  s(L, 'Flex System x240 M5', 'Flex System', 2014, 'Nœud de calcul (châssis Flex Enterprise)', V34, 2, 'M5'),
  s(L, 'NeXtScale nx360 M5', 'NeXtScale', 2014, 'Nœud 1U demi-largeur (châssis n1200)', V34, 2, 'M5'),

  // ─── ThinkServer ───
  s(L, 'ThinkServer TS130', 'ThinkServer', 2012, 'Tour', 'Intel Xeon E3-1200 v2 / Pentium', 1, undefined),
  s(L, 'ThinkServer TS430', 'ThinkServer', 2012, 'Tour', 'Intel Xeon E3-1200 v2', 1, undefined),
  s(L, 'ThinkServer TS140', 'ThinkServer', 2013, 'Tour', 'Intel Xeon E3-1200 v3 / Core i3 / Pentium', 1, undefined, { ram: '32 Go (4 slots DDR3 ECC)', baies: 'jusqu’à 4 x 3,5"' }),
  s(L, 'ThinkServer TS440', 'ThinkServer', 2013, 'Tour', 'Intel Xeon E3-1200 v3', 1, undefined, { ram: '32 Go (4 slots DDR3 ECC)', baies: 'jusqu’à 8 x 3,5"' }),
  s(L, 'ThinkServer TS150', 'ThinkServer', 2016, 'Tour', 'Intel Xeon E3-1200 v5 / Core i3 / Pentium', 1, undefined, { ram: '64 Go (4 slots DDR4 ECC)', baies: 'jusqu’à 4 x 3,5"' }),
  s(L, 'ThinkServer TS460', 'ThinkServer', 2016, 'Tour', 'Intel Xeon E3-1200 v5/v6', 1, undefined, { ram: '64 Go (4 slots DDR4 ECC)', baies: 'jusqu’à 8 x 3,5"' }),
  s(L, 'ThinkServer TD330', 'ThinkServer', 2012, 'Tour', E5_24, 2, undefined),
  s(L, 'ThinkServer TD340', 'ThinkServer', 2013, 'Tour', 'Intel Xeon E5-2400 v2', 2, undefined),
  s(L, 'ThinkServer TD350', 'ThinkServer', 2014, 'Tour', V34, 2, undefined),
  s(L, 'ThinkServer RD330', 'ThinkServer', 2012, 'Rack 1U', E5_24, 2, undefined),
  s(L, 'ThinkServer RD430', 'ThinkServer', 2012, 'Rack 2U', E5_24, 2, undefined),
  s(L, 'ThinkServer RD530', 'ThinkServer', 2012, 'Rack 1U', E5_26, 2, undefined),
  s(L, 'ThinkServer RD630', 'ThinkServer', 2012, 'Rack 2U', E5_26, 2, undefined),
  s(L, 'ThinkServer RD340', 'ThinkServer', 2013, 'Rack 1U', 'Intel Xeon E5-2400 v2', 2, undefined),
  s(L, 'ThinkServer RD440', 'ThinkServer', 2013, 'Rack 2U', 'Intel Xeon E5-2400 v2', 2, undefined),
  s(L, 'ThinkServer RD540', 'ThinkServer', 2013, 'Rack 1U', 'Intel Xeon E5-2600 v2', 2, undefined),
  s(L, 'ThinkServer RD640', 'ThinkServer', 2013, 'Rack 2U', 'Intel Xeon E5-2600 v2', 2, undefined),
  s(L, 'ThinkServer RD350', 'ThinkServer', 2014, 'Rack 1U', V34, 2, undefined),
  s(L, 'ThinkServer RD450', 'ThinkServer', 2014, 'Rack 2U', V34, 2, undefined),
  s(L, 'ThinkServer RD550', 'ThinkServer', 2014, 'Rack 1U', V34, 2, undefined),
  s(L, 'ThinkServer RD650', 'ThinkServer', 2014, 'Rack 2U', V34, 2, undefined),
  s(L, 'ThinkServer RS140', 'ThinkServer', 2014, 'Rack 1U', 'Intel Xeon E3-1200 v3', 1, undefined),
  s(L, 'ThinkServer RS160', 'ThinkServer', 2016, 'Rack 1U', 'Intel Xeon E3-1200 v5', 1, undefined),

  // ─── ThinkSystem V1 ───
  s(L, 'ThinkSystem SR530', 'ThinkSystem', 2017, 'Rack 1U', SP12, 2, 'V1', { ram: '12 slots DDR4' }),
  s(L, 'ThinkSystem SR550', 'ThinkSystem', 2017, 'Rack 2U', SP12, 2, 'V1', { ram: '12 slots DDR4' }),
  s(L, 'ThinkSystem SR570', 'ThinkSystem', 2018, 'Rack 1U', SP12, 2, 'V1', { ram: '16 slots DDR4' }),
  s(L, 'ThinkSystem SR590', 'ThinkSystem', 2018, 'Rack 2U', SP12, 2, 'V1', { ram: '16 slots DDR4' }),
  s(L, 'ThinkSystem SR850', 'ThinkSystem', 2017, 'Rack 2U', SP12, 4, 'V1', { ram: '48 slots DDR4' }),
  s(L, 'ThinkSystem SR860', 'ThinkSystem', 2017, 'Rack 4U', SP12, 4, 'V1', { ram: '48 slots DDR4' }),
  s(L, 'ThinkSystem SR950', 'ThinkSystem', 2017, 'Rack 4U', SP12, 8, 'V1', { ram: '96 slots DDR4' }),
  s(L, 'ThinkSystem SR250', 'ThinkSystem', 2018, 'Rack 1U', 'Intel Xeon E-2100/E-2200', 1, 'V1', { ram: '64 Go (4 slots DDR4 ECC)' }),
  s(L, 'ThinkSystem SR635', 'ThinkSystem', 2019, 'Rack 1U', EPYC23, 1, 'V1', { ram: '16 slots DDR4' }),
  s(L, 'ThinkSystem SR655', 'ThinkSystem', 2019, 'Rack 2U', EPYC23, 1, 'V1', { ram: '16 slots DDR4' }),
  s(L, 'ThinkSystem SR645', 'ThinkSystem', 2020, 'Rack 1U', EPYC23, 2, 'V1', { ram: '32 slots DDR4' }),
  s(L, 'ThinkSystem SR665', 'ThinkSystem', 2020, 'Rack 2U', EPYC23, 2, 'V1', { ram: '32 slots DDR4' }),
  s(L, 'ThinkSystem SR670', 'ThinkSystem', 2018, 'Rack 2U (4 GPU)', SP12, 2, 'V1', AI),
  s(L, 'ThinkSystem ST50', 'ThinkSystem', 2018, 'Tour', 'Intel Xeon E-2100/E-2200 / Pentium', 1, 'V1', { ram: '32 Go (4 slots DDR4 ECC)', baies: 'jusqu’à 4 x 3,5"' }),
  s(L, 'ThinkSystem SD530', 'ThinkSystem', 2017, 'Nœud demi-largeur (châssis D2 2U 4 nœuds)', SP12, 2, 'V1'),
  s(L, 'ThinkSystem SD650', 'ThinkSystem', 2018, 'Plateau 1U refroidi par eau (2 nœuds)', SP12, 2, 'V1'),
  s(L, 'ThinkSystem SE350', 'ThinkSystem', 2019, 'Serveur edge compact', 'Intel Xeon D-2100', 1, 'V1', EDGE),

  // ─── ThinkSystem V2 ───
  s(L, 'ThinkSystem SR850 V2', 'ThinkSystem', 2021, 'Rack 2U', 'Intel Xeon Scalable 3e génération (Cooper Lake)', 4, 'V2', { ram: '48 slots DDR4' }),
  s(L, 'ThinkSystem SR860 V2', 'ThinkSystem', 2020, 'Rack 4U', 'Intel Xeon Scalable 3e génération (Cooper Lake)', 4, 'V2', { ram: '48 slots DDR4' }),
  s(L, 'ThinkSystem SR670 V2', 'ThinkSystem', 2021, 'Rack 3U (GPU)', SP3, 2, 'V2', AI),
  s(L, 'ThinkSystem SR250 V2', 'ThinkSystem', 2021, 'Rack 1U', 'Intel Xeon E-2300', 1, 'V2', { ram: '128 Go (4 slots DDR4 ECC)' }),
  s(L, 'ThinkSystem ST50 V2', 'ThinkSystem', 2021, 'Tour', 'Intel Xeon E-2300 / Pentium', 1, 'V2', { ram: '128 Go (4 slots DDR4 ECC)', baies: 'jusqu’à 4 x 3,5"' }),
  s(L, 'ThinkSystem ST250 V2', 'ThinkSystem', 2021, 'Tour', 'Intel Xeon E-2300', 1, 'V2', { ram: '128 Go (4 slots DDR4 ECC)', baies: 'jusqu’à 8 x 3,5"' }),
  s(L, 'ThinkSystem ST650 V2', 'ThinkSystem', 2021, 'Tour (convertible rack 4U)', SP3, 2, 'V2', { ram: '32 slots DDR4' }),
  s(L, 'ThinkSystem SD650 V2', 'ThinkSystem', 2021, 'Plateau 1U refroidi par eau (2 nœuds)', SP3, 2, 'V2'),
  s(L, 'ThinkSystem SD630 V2', 'ThinkSystem', 2021, 'Nœud 1U demi-largeur (châssis DA240)', SP3, 2, 'V2'),
  s(L, 'ThinkEdge SE450', 'ThinkEdge', 2021, 'Serveur edge 2U faible profondeur', SP3, 1, 'V2', EDGE),

  // ─── ThinkSystem V3 ───
  s(L, 'ThinkSystem SR635 V3', 'ThinkSystem', 2023, 'Rack 1U', EPYC4, 1, 'V3', { ram: '12 slots DDR5' }),
  s(L, 'ThinkSystem SR655 V3', 'ThinkSystem', 2023, 'Rack 2U', EPYC4, 1, 'V3', { ram: '12 slots DDR5' }),
  s(L, 'ThinkSystem SR645 V3', 'ThinkSystem', 2023, 'Rack 1U', EPYC4, 2, 'V3', { ram: '24 slots DDR5' }),
  s(L, 'ThinkSystem SR665 V3', 'ThinkSystem', 2023, 'Rack 2U', EPYC4, 2, 'V3', { ram: '24 slots DDR5' }),
  s(L, 'ThinkSystem SR675 V3', 'ThinkSystem', 2023, 'Rack 3U (jusqu’à 8 GPU)', EPYC4, 2, 'V3', AI),
  s(L, 'ThinkSystem SR850 V3', 'ThinkSystem', 2023, 'Rack 2U', SP45, 4, 'V3', { ram: '64 slots DDR5' }),
  s(L, 'ThinkSystem SR860 V3', 'ThinkSystem', 2023, 'Rack 4U', SP45, 4, 'V3', { ram: '64 slots DDR5' }),
  s(L, 'ThinkSystem SR950 V3', 'ThinkSystem', 2023, 'Rack 8U', SP45, 8, 'V3', { ram: '128 slots DDR5' }),
  s(L, 'ThinkSystem SR250 V3', 'ThinkSystem', 2023, 'Rack 1U', 'Intel Xeon E-2400', 1, 'V3', { ram: '128 Go (4 slots DDR5 ECC)' }),
  s(L, 'ThinkSystem ST50 V3', 'ThinkSystem', 2023, 'Tour', 'Intel Xeon E-2400', 1, 'V3', { ram: '128 Go (4 slots DDR5 ECC)', baies: 'jusqu’à 4 x 3,5"' }),
  s(L, 'ThinkSystem ST250 V3', 'ThinkSystem', 2023, 'Tour', 'Intel Xeon E-2400', 1, 'V3', { ram: '128 Go (4 slots DDR5 ECC)', baies: 'jusqu’à 8 x 3,5"' }),
  s(L, 'ThinkSystem ST650 V3', 'ThinkSystem', 2023, 'Tour (convertible rack 4U)', SP45, 2, 'V3', { ram: '32 slots DDR5' }),
  s(L, 'ThinkSystem ST45 V3', 'ThinkSystem', 2024, 'Tour compacte', 'AMD EPYC 4004 / Ryzen', 1, 'V3', { ram: '4 slots DDR5 ECC', baies: 'jusqu’à 4 x 3,5"' }),
  s(L, 'ThinkSystem SD650 V3', 'ThinkSystem', 2023, 'Plateau 1U refroidi par eau (2 nœuds)', SP45, 2, 'V3'),
  s(L, 'ThinkSystem SD665 V3', 'ThinkSystem', 2023, 'Plateau 1U refroidi par eau (2 nœuds)', EPYC4, 2, 'V3'),
  s(L, 'ThinkSystem SR680a V3', 'ThinkSystem', 2024, 'Rack 8U (8 GPU SXM)', SP45, 2, 'V3', AI),
  s(L, 'ThinkSystem SR780a V3', 'ThinkSystem', 2024, 'Rack 5U refroidi par eau (8 GPU SXM)', SP45, 2, 'V3', AI),
  s(L, 'ThinkEdge SE350 V2', 'ThinkEdge', 2023, 'Serveur edge compact', 'Intel Xeon D-2700', 1, 'V2', EDGE),
  s(L, 'ThinkEdge SE360 V2', 'ThinkEdge', 2023, 'Serveur edge compact', 'Intel Xeon D-2700', 1, 'V2', EDGE),
  s(L, 'ThinkEdge SE455 V3', 'ThinkEdge', 2023, 'Serveur edge 2U faible profondeur', 'AMD EPYC 8004', 1, 'V3', EDGE),

  // ─── ThinkSystem V4 ───
  s(L, 'ThinkSystem SR630 V4', 'ThinkSystem', 2025, 'Rack 1U', X6, 2, 'V4'),
  s(L, 'ThinkSystem SR650 V4', 'ThinkSystem', 2025, 'Rack 2U', X6, 2, 'V4'),
  s(L, 'ThinkSystem SR650a V4', 'ThinkSystem', 2025, 'Rack 2U (GPU)', X6, 2, 'V4', AI),
];
