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

const D = 'Dell';
const E5_26 = 'Intel Xeon E5-2600 / E5-2600 v2';
const E5_24 = 'Intel Xeon E5-2400 / E5-2400 v2';
const E5_46 = 'Intel Xeon E5-4600 / E5-4600 v2';
const V34 = 'Intel Xeon E5-2600 v3/v4';
const SP12 = 'Intel Xeon Scalable 1re/2e génération';
const SP3 = 'Intel Xeon Scalable 3e génération';
const SP45 = 'Intel Xeon Scalable 4e/5e génération';
const X6 = 'Intel Xeon 6';
const EPYC23 = 'AMD EPYC 7002/7003';
const EPYC4 = 'AMD EPYC 9004';
const EPYC5 = 'AMD EPYC 9005';
const R = 'Redondante';

/** Dell PowerEdge 12G à 17G : rack, tour, lames, modulaires, haute densité, edge et GPU. */
export const PRODUCTS: CatalogProduct[] = [
  // ─── 12G ───
  s(D, 'PowerEdge R220', 'PowerEdge 12G', 2014, 'Rack 1U', 'Intel Xeon E3-1200 v3', 1, '12G', { baies: '2 x 3,5"' }),
  s(D, 'PowerEdge R320', 'PowerEdge 12G', 2012, 'Rack 1U', 'Intel Xeon E5-2400 / E5-1400', 1, '12G', { baies: 'jusqu’à 8 x 2,5" ou 4 x 3,5"' }),
  s(D, 'PowerEdge R420', 'PowerEdge 12G', 2012, 'Rack 1U', E5_24, 2, '12G', { baies: 'jusqu’à 8 x 2,5" ou 4 x 3,5"' }),
  s(D, 'PowerEdge R520', 'PowerEdge 12G', 2012, 'Rack 2U', E5_24, 2, '12G', { baies: 'jusqu’à 8 x 3,5"' }),
  s(D, 'PowerEdge R620', 'PowerEdge 12G', 2012, 'Rack 1U', E5_26, 2, '12G', { ram: '24 slots DDR3', baies: 'jusqu’à 10 x 2,5" ou 4 x 3,5"', psu: R }),
  s(D, 'PowerEdge R720', 'PowerEdge 12G', 2012, 'Rack 2U', E5_26, 2, '12G', { ram: '24 slots DDR3', baies: 'jusqu’à 16 x 2,5" ou 8 x 3,5"', psu: R }),
  s(D, 'PowerEdge R720xd', 'PowerEdge 12G', 2012, 'Rack 2U', E5_26, 2, '12G', { ram: '24 slots DDR3', baies: 'jusqu’à 26 x 2,5" ou 12 x 3,5" (+ 2 x 2,5" arrière)', psu: R }),
  s(D, 'PowerEdge R820', 'PowerEdge 12G', 2012, 'Rack 2U', E5_46, 4, '12G', { ram: '48 slots DDR3', psu: R }),
  s(D, 'PowerEdge R920', 'PowerEdge 12G', 2014, 'Rack 4U', 'Intel Xeon E7-4800/8800 v2', 4, '12G', { ram: '96 slots DDR3', psu: R }),
  s(D, 'PowerEdge T20', 'PowerEdge 12G', 2014, 'Tour', 'Intel Xeon E3-1225 v3 / Pentium G3220', 1, '12G', { ram: '32 Go (4 slots DDR3 ECC)', baies: 'jusqu’à 4 x 3,5"', msrp: 400 }),
  s(D, 'PowerEdge T320', 'PowerEdge 12G', 2012, 'Tour', 'Intel Xeon E5-2400 / E5-1400', 1, '12G', { baies: 'jusqu’à 8 x 3,5"' }),
  s(D, 'PowerEdge T420', 'PowerEdge 12G', 2012, 'Tour', E5_24, 2, '12G', { baies: 'jusqu’à 8 x 3,5"' }),
  s(D, 'PowerEdge T620', 'PowerEdge 12G', 2012, 'Tour (convertible rack 5U)', E5_26, 2, '12G', { ram: '24 slots DDR3', baies: 'jusqu’à 32 x 2,5" ou 12 x 3,5"' }),
  s(D, 'PowerEdge M420', 'PowerEdge 12G', 2012, 'Lame quart de hauteur (M1000e)', E5_24, 2, '12G'),
  s(D, 'PowerEdge M520', 'PowerEdge 12G', 2012, 'Lame demi-hauteur (M1000e/VRTX)', E5_24, 2, '12G'),
  s(D, 'PowerEdge M620', 'PowerEdge 12G', 2012, 'Lame demi-hauteur (M1000e/VRTX)', E5_26, 2, '12G'),
  s(D, 'PowerEdge M820', 'PowerEdge 12G', 2012, 'Lame pleine hauteur (M1000e)', E5_46, 4, '12G'),
  s(D, 'PowerEdge C6220', 'PowerEdge C', 2012, 'Rack 2U (4 nœuds)', 'Intel Xeon E5-2600', 2, '12G'),
  s(D, 'PowerEdge C6220 II', 'PowerEdge C', 2013, 'Rack 2U (4 nœuds)', 'Intel Xeon E5-2600 v2', 2, '12G'),
  s(D, 'PowerEdge VRTX', 'PowerEdge VRTX', 2013, 'Tour / rack 5U (châssis 4 lames)', 'Lames M520 / M620 / M630', undefined, '12G', { baies: 'jusqu’à 25 x 2,5" ou 12 x 3,5" partagées', tags: ['serveur', 'pro'] }),
  s(D, 'PowerEdge M1000e', 'PowerEdge M', 2012, 'Châssis lames 10U (16 lames)', undefined, undefined, undefined, { psu: '6 alimentations redondantes', tags: ['serveur', 'pro'] }),

  // ─── 13G ───
  s(D, 'PowerEdge R230', 'PowerEdge 13G', 2016, 'Rack 1U', 'Intel Xeon E3-1200 v5/v6', 1, '13G', { ram: '64 Go (4 slots DDR4 ECC)', baies: 'jusqu’à 4 x 3,5"' }),
  s(D, 'PowerEdge R330', 'PowerEdge 13G', 2016, 'Rack 1U', 'Intel Xeon E3-1200 v5/v6', 1, '13G', { ram: '64 Go (4 slots DDR4 ECC)', baies: 'jusqu’à 8 x 2,5" ou 4 x 3,5"', psu: R }),
  s(D, 'PowerEdge R430', 'PowerEdge 13G', 2014, 'Rack 1U', V34, 2, '13G', { ram: '12 slots DDR4', baies: 'jusqu’à 10 x 2,5" ou 4 x 3,5"' }),
  s(D, 'PowerEdge R530', 'PowerEdge 13G', 2014, 'Rack 2U', V34, 2, '13G', { ram: '12 slots DDR4', baies: 'jusqu’à 8 x 3,5"' }),
  s(D, 'PowerEdge R830', 'PowerEdge 13G', 2016, 'Rack 2U', 'Intel Xeon E5-4600 v4', 4, '13G', { ram: '48 slots DDR4', psu: R }),
  s(D, 'PowerEdge R930', 'PowerEdge 13G', 2015, 'Rack 4U', 'Intel Xeon E7-4800/8800 v3/v4', 4, '13G', { ram: '96 slots DDR4', psu: R }),
  s(D, 'PowerEdge T30', 'PowerEdge 13G', 2016, 'Tour', 'Intel Xeon E3-1225 v5 / Pentium G4400', 1, '13G', { ram: '64 Go (4 slots DDR4 ECC)', baies: 'jusqu’à 4 x 3,5"', msrp: 450 }),
  s(D, 'PowerEdge T130', 'PowerEdge 13G', 2016, 'Tour', 'Intel Xeon E3-1200 v5/v6', 1, '13G', { ram: '64 Go (4 slots DDR4 ECC)', baies: 'jusqu’à 4 x 3,5"' }),
  s(D, 'PowerEdge T330', 'PowerEdge 13G', 2016, 'Tour', 'Intel Xeon E3-1200 v5/v6', 1, '13G', { ram: '64 Go (4 slots DDR4 ECC)', baies: 'jusqu’à 8 x 3,5"' }),
  s(D, 'PowerEdge T430', 'PowerEdge 13G', 2014, 'Tour (convertible rack 5U)', V34, 2, '13G', { ram: '12 slots DDR4', baies: 'jusqu’à 16 x 2,5" ou 8 x 3,5"' }),
  s(D, 'PowerEdge T630', 'PowerEdge 13G', 2014, 'Tour (convertible rack 5U)', V34, 2, '13G', { ram: '24 slots DDR4', baies: 'jusqu’à 32 x 2,5" ou 18 x 3,5"' }),
  s(D, 'PowerEdge M630', 'PowerEdge 13G', 2014, 'Lame demi-hauteur (M1000e/VRTX)', V34, 2, '13G'),
  s(D, 'PowerEdge M830', 'PowerEdge 13G', 2015, 'Lame pleine hauteur (M1000e)', 'Intel Xeon E5-4600 v3/v4', 4, '13G'),
  s(D, 'PowerEdge FC430', 'PowerEdge FX', 2015, 'Nœud quart de largeur (châssis FX2)', V34, 2, '13G'),
  s(D, 'PowerEdge FC630', 'PowerEdge FX', 2014, 'Nœud demi-largeur (châssis FX2)', V34, 2, '13G'),
  s(D, 'PowerEdge FC830', 'PowerEdge FX', 2015, 'Nœud pleine largeur (châssis FX2)', 'Intel Xeon E5-4600 v3/v4', 4, '13G'),
  s(D, 'PowerEdge FX2s', 'PowerEdge FX', 2014, 'Châssis modulaire 2U', undefined, undefined, '13G', { tags: ['serveur', 'pro'] }),
  s(D, 'PowerEdge C4130', 'PowerEdge C', 2015, 'Rack 1U (4 GPU)', V34, 2, '13G', { tags: ['serveur', 'pro', 'ia'] }),
  s(D, 'PowerEdge C6320', 'PowerEdge C', 2015, 'Rack 2U (4 nœuds)', V34, 2, '13G'),

  // ─── 14G ───
  s(D, 'PowerEdge R240', 'PowerEdge 14G', 2018, 'Rack 1U', 'Intel Xeon E-2100/E-2200', 1, '14G', { ram: '64 Go (4 slots DDR4 ECC)', baies: 'jusqu’à 4 x 3,5"' }),
  s(D, 'PowerEdge R340', 'PowerEdge 14G', 2018, 'Rack 1U', 'Intel Xeon E-2100/E-2200', 1, '14G', { ram: '64 Go (4 slots DDR4 ECC)', baies: 'jusqu’à 8 x 2,5" ou 4 x 3,5"', psu: R }),
  s(D, 'PowerEdge R440', 'PowerEdge 14G', 2017, 'Rack 1U', SP12, 2, '14G', { ram: '16 slots DDR4', baies: 'jusqu’à 10 x 2,5" ou 4 x 3,5"' }),
  s(D, 'PowerEdge R540', 'PowerEdge 14G', 2017, 'Rack 2U', SP12, 2, '14G', { ram: '16 slots DDR4', baies: 'jusqu’à 14 x 3,5"' }),
  s(D, 'PowerEdge R740xd2', 'PowerEdge 14G', 2018, 'Rack 2U (stockage)', SP12, 2, '14G', { ram: '16 slots DDR4', baies: '26 x 3,5"', tags: ['serveur', 'pro', 'nas'] }),
  s(D, 'PowerEdge R840', 'PowerEdge 14G', 2018, 'Rack 2U', SP12, 4, '14G', { ram: '48 slots DDR4', psu: R }),
  s(D, 'PowerEdge R940', 'PowerEdge 14G', 2017, 'Rack 3U', SP12, 4, '14G', { ram: '48 slots DDR4', psu: R }),
  s(D, 'PowerEdge R940xa', 'PowerEdge 14G', 2018, 'Rack 4U (GPU)', SP12, 4, '14G', { ram: '48 slots DDR4', tags: ['serveur', 'pro', 'ia'] }),
  s(D, 'PowerEdge R6415', 'PowerEdge 14G', 2018, 'Rack 1U', 'AMD EPYC 7001', 1, '14G', { ram: '16 slots DDR4' }),
  s(D, 'PowerEdge R7415', 'PowerEdge 14G', 2018, 'Rack 2U', 'AMD EPYC 7001', 1, '14G', { ram: '16 slots DDR4', baies: 'jusqu’à 24 x 2,5" ou 12 x 3,5"' }),
  s(D, 'PowerEdge R7425', 'PowerEdge 14G', 2018, 'Rack 2U', 'AMD EPYC 7001', 2, '14G', { ram: '32 slots DDR4', baies: 'jusqu’à 24 x 2,5" ou 12 x 3,5"' }),
  s(D, 'PowerEdge R6515', 'PowerEdge 14G', 2019, 'Rack 1U', 'AMD EPYC 7002/7003', 1, '14G', { ram: '16 slots DDR4' }),
  s(D, 'PowerEdge R7515', 'PowerEdge 14G', 2019, 'Rack 2U', 'AMD EPYC 7002/7003', 1, '14G', { ram: '16 slots DDR4', baies: 'jusqu’à 24 x 2,5" ou 12 x 3,5"' }),
  s(D, 'PowerEdge T40', 'PowerEdge 14G', 2019, 'Tour', 'Intel Xeon E-2224G', 1, '14G', { ram: '64 Go (4 slots DDR4 ECC)', baies: 'jusqu’à 3 x 3,5"', msrp: 500 }),
  s(D, 'PowerEdge T140', 'PowerEdge 14G', 2018, 'Tour', 'Intel Xeon E-2100/E-2200', 1, '14G', { ram: '64 Go (4 slots DDR4 ECC)', baies: 'jusqu’à 4 x 3,5"' }),
  s(D, 'PowerEdge T640', 'PowerEdge 14G', 2017, 'Tour (convertible rack 5U)', SP12, 2, '14G', { ram: '24 slots DDR4', baies: 'jusqu’à 32 x 2,5" ou 18 x 3,5"' }),
  s(D, 'PowerEdge M640', 'PowerEdge 14G', 2017, 'Lame demi-hauteur (M1000e/VRTX)', SP12, 2, '14G'),
  s(D, 'PowerEdge MX740c', 'PowerEdge MX', 2018, 'Lame simple largeur (châssis MX7000)', SP12, 2, '14G'),
  s(D, 'PowerEdge MX840c', 'PowerEdge MX', 2018, 'Lame double largeur (châssis MX7000)', SP12, 4, '14G'),
  s(D, 'PowerEdge MX7000', 'PowerEdge MX', 2018, 'Châssis modulaire 7U (8 lames)', undefined, undefined, undefined, { tags: ['serveur', 'pro'] }),
  s(D, 'PowerEdge C6420', 'PowerEdge C', 2017, 'Nœud (châssis C6400 2U 4 nœuds)', SP12, 2, '14G'),
  s(D, 'PowerEdge C4140', 'PowerEdge C', 2017, 'Rack 1U (4 GPU)', SP12, 2, '14G', { tags: ['serveur', 'pro', 'ia'] }),
  s(D, 'PowerEdge XE2420', 'PowerEdge XE', 2020, 'Rack 2U faible profondeur (edge)', 'Intel Xeon Scalable 2e génération', 2, '14G'),

  // ─── 15G ───
  s(D, 'PowerEdge R250', 'PowerEdge 15G', 2021, 'Rack 1U', 'Intel Xeon E-2300 / Pentium G6405T', 1, '15G', { ram: '128 Go (4 slots DDR4 ECC)', baies: 'jusqu’à 4 x 3,5"' }),
  s(D, 'PowerEdge R350', 'PowerEdge 15G', 2021, 'Rack 1U', 'Intel Xeon E-2300 / Pentium G6405T', 1, '15G', { ram: '128 Go (4 slots DDR4 ECC)', baies: 'jusqu’à 8 x 2,5" ou 4 x 3,5"', psu: R }),
  s(D, 'PowerEdge R450', 'PowerEdge 15G', 2021, 'Rack 1U', SP3, 2, '15G', { ram: '16 slots DDR4', baies: 'jusqu’à 8 x 2,5" ou 4 x 3,5"' }),
  s(D, 'PowerEdge R550', 'PowerEdge 15G', 2021, 'Rack 2U', SP3, 2, '15G', { ram: '16 slots DDR4', baies: 'jusqu’à 16 x 2,5" ou 8 x 3,5"' }),
  s(D, 'PowerEdge R650xs', 'PowerEdge 15G', 2021, 'Rack 1U', SP3, 2, '15G', { ram: '16 slots DDR4' }),
  s(D, 'PowerEdge R750xs', 'PowerEdge 15G', 2021, 'Rack 2U', SP3, 2, '15G', { ram: '16 slots DDR4' }),
  s(D, 'PowerEdge R750xa', 'PowerEdge 15G', 2021, 'Rack 2U (GPU)', SP3, 2, '15G', { ram: '32 slots DDR4', tags: ['serveur', 'pro', 'ia'] }),
  s(D, 'PowerEdge R6525', 'PowerEdge 15G', 2020, 'Rack 1U', EPYC23, 2, '15G', { ram: '32 slots DDR4', baies: 'jusqu’à 10 x 2,5"' }),
  s(D, 'PowerEdge R7525', 'PowerEdge 15G', 2020, 'Rack 2U', EPYC23, 2, '15G', { ram: '32 slots DDR4', baies: 'jusqu’à 24 x 2,5" ou 12 x 3,5"' }),
  s(D, 'PowerEdge T150', 'PowerEdge 15G', 2021, 'Tour', 'Intel Xeon E-2300 / Pentium G6405T', 1, '15G', { ram: '128 Go (4 slots DDR4 ECC)', baies: 'jusqu’à 4 x 3,5"' }),
  s(D, 'PowerEdge MX750c', 'PowerEdge MX', 2021, 'Lame simple largeur (châssis MX7000)', SP3, 2, '15G'),
  s(D, 'PowerEdge C6520', 'PowerEdge C', 2021, 'Nœud (châssis C6400 2U 4 nœuds)', SP3, 2, '15G'),
  s(D, 'PowerEdge C6525', 'PowerEdge C', 2020, 'Nœud (châssis C6400 2U 4 nœuds)', EPYC23, 2, '15G'),
  s(D, 'PowerEdge XE8545', 'PowerEdge XE', 2021, 'Rack 4U (4 GPU NVIDIA A100 SXM)', EPYC23, 2, '15G', { tags: ['serveur', 'pro', 'ia'] }),
  s(D, 'PowerEdge XR11', 'PowerEdge XR', 2021, 'Rack 1U durci (edge)', SP3, 1, '15G', { tags: ['serveur', 'pro', 'robuste'] }),
  s(D, 'PowerEdge XR12', 'PowerEdge XR', 2021, 'Rack 2U durci (edge)', SP3, 1, '15G', { tags: ['serveur', 'pro', 'robuste'] }),

  // ─── 16G ───
  s(D, 'PowerEdge R260', 'PowerEdge 16G', 2024, 'Rack 1U', 'Intel Xeon E-2400', 1, '16G', { ram: '128 Go (4 slots DDR5 ECC)', baies: 'jusqu’à 4 x 3,5"' }),
  s(D, 'PowerEdge R360', 'PowerEdge 16G', 2024, 'Rack 1U', 'Intel Xeon E-2400', 1, '16G', { ram: '128 Go (4 slots DDR5 ECC)', baies: 'jusqu’à 8 x 2,5" ou 4 x 3,5"', psu: R }),
  s(D, 'PowerEdge R660xs', 'PowerEdge 16G', 2023, 'Rack 1U', SP45, 2, '16G', { ram: '16 slots DDR5' }),
  s(D, 'PowerEdge R760xs', 'PowerEdge 16G', 2023, 'Rack 2U', SP45, 2, '16G', { ram: '16 slots DDR5' }),
  s(D, 'PowerEdge R760xd2', 'PowerEdge 16G', 2023, 'Rack 2U (stockage)', SP45, undefined, '16G', { tags: ['serveur', 'pro', 'nas'] }),
  s(D, 'PowerEdge R760xa', 'PowerEdge 16G', 2023, 'Rack 2U (GPU)', SP45, 2, '16G', { ram: '32 slots DDR5', tags: ['serveur', 'pro', 'ia'] }),
  s(D, 'PowerEdge R860', 'PowerEdge 16G', 2023, 'Rack 2U', SP45, 4, '16G', { ram: '64 slots DDR5' }),
  s(D, 'PowerEdge R960', 'PowerEdge 16G', 2023, 'Rack 4U', SP45, 4, '16G', { ram: '64 slots DDR5' }),
  s(D, 'PowerEdge R6615', 'PowerEdge 16G', 2023, 'Rack 1U', EPYC4, 1, '16G', { ram: '12 slots DDR5' }),
  s(D, 'PowerEdge R7615', 'PowerEdge 16G', 2023, 'Rack 2U', EPYC4, 1, '16G', { ram: '12 slots DDR5' }),
  s(D, 'PowerEdge R6625', 'PowerEdge 16G', 2023, 'Rack 1U', EPYC4, 2, '16G', { ram: '24 slots DDR5' }),
  s(D, 'PowerEdge R7625', 'PowerEdge 16G', 2023, 'Rack 2U', EPYC4, 2, '16G', { ram: '24 slots DDR5' }),
  s(D, 'PowerEdge T160', 'PowerEdge 16G', 2024, 'Tour compacte', 'Intel Xeon E-2400', 1, '16G', { ram: '128 Go (4 slots DDR5 ECC)', baies: 'jusqu’à 4 x 3,5"' }),
  s(D, 'PowerEdge T360', 'PowerEdge 16G', 2024, 'Tour', 'Intel Xeon E-2400', 1, '16G', { ram: '128 Go (4 slots DDR5 ECC)', baies: 'jusqu’à 8 x 3,5"' }),
  s(D, 'PowerEdge T560', 'PowerEdge 16G', 2023, 'Tour (convertible rack 5U)', SP45, 2, '16G', { ram: '16 slots DDR5' }),
  s(D, 'PowerEdge MX760c', 'PowerEdge MX', 2023, 'Lame simple largeur (châssis MX7000)', SP45, 2, '16G'),
  s(D, 'PowerEdge C6620', 'PowerEdge C', 2023, 'Nœud (châssis C6600 2U 4 nœuds)', SP45, 2, '16G'),
  s(D, 'PowerEdge HS5610', 'PowerEdge HS', 2023, 'Rack 1U (cloud)', SP45, 2, '16G'),
  s(D, 'PowerEdge HS5620', 'PowerEdge HS', 2023, 'Rack 2U (cloud)', SP45, 2, '16G'),
  s(D, 'PowerEdge XE9680', 'PowerEdge XE', 2023, 'Rack 6U (8 GPU SXM)', SP45, 2, '16G', { ram: '32 slots DDR5', tags: ['serveur', 'pro', 'ia'] }),
  s(D, 'PowerEdge XE8640', 'PowerEdge XE', 2023, 'Rack 4U (4 GPU NVIDIA H100 SXM)', SP45, 2, '16G', { tags: ['serveur', 'pro', 'ia'] }),
  s(D, 'PowerEdge XE9640', 'PowerEdge XE', 2023, 'Rack 2U refroidi par liquide (4 GPU)', SP45, 2, '16G', { tags: ['serveur', 'pro', 'ia'] }),
  s(D, 'PowerEdge XR5610', 'PowerEdge XR', 2023, 'Rack 1U durci (edge)', SP45, 1, '16G', { tags: ['serveur', 'pro', 'robuste'] }),
  s(D, 'PowerEdge XR7620', 'PowerEdge XR', 2023, 'Rack 2U durci (edge)', SP45, 2, '16G', { tags: ['serveur', 'pro', 'robuste'] }),
  s(D, 'PowerEdge XR8000', 'PowerEdge XR', 2023, 'Châssis 2U edge (traîneaux XR8610t/XR8620t)', SP45, undefined, '16G', { tags: ['serveur', 'pro', 'robuste', 'reseau'] }),
  s(D, 'PowerEdge XR4000', 'PowerEdge XR', 2023, 'Châssis edge compact (traîneaux XR4510c/XR4520c)', 'Intel Xeon D-2700', 1, '16G', { tags: ['serveur', 'pro', 'robuste'] }),

  // ─── 17G ───
  s(D, 'PowerEdge R470', 'PowerEdge 17G', 2025, 'Rack 1U', X6, 2, '17G'),
  s(D, 'PowerEdge R570', 'PowerEdge 17G', 2025, 'Rack 2U', X6, 2, '17G'),
  s(D, 'PowerEdge R670', 'PowerEdge 17G', 2025, 'Rack 1U', X6, 2, '17G'),
  s(D, 'PowerEdge R770', 'PowerEdge 17G', 2025, 'Rack 2U', X6, 2, '17G'),
  s(D, 'PowerEdge R6715', 'PowerEdge 17G', 2025, 'Rack 1U', EPYC5, 1, '17G'),
  s(D, 'PowerEdge R7715', 'PowerEdge 17G', 2025, 'Rack 2U', EPYC5, 1, '17G'),
  s(D, 'PowerEdge R6725', 'PowerEdge 17G', 2025, 'Rack 1U', EPYC5, 2, '17G'),
  s(D, 'PowerEdge R7725', 'PowerEdge 17G', 2025, 'Rack 2U', EPYC5, 2, '17G'),
  s(D, 'PowerEdge XE7745', 'PowerEdge XE', 2025, 'Rack 4U (8 GPU PCIe)', EPYC5, 2, '17G', { tags: ['serveur', 'pro', 'ia'] }),
  s(D, 'PowerEdge XE9780', 'PowerEdge XE', 2025, 'Rack (8 GPU NVIDIA Blackwell Ultra)', X6, 2, '17G', { tags: ['serveur', 'pro', 'ia'] }),
  s(D, 'PowerEdge XE9785', 'PowerEdge XE', 2025, 'Rack (8 GPU AMD Instinct MI355X)', EPYC5, 2, '17G', { tags: ['serveur', 'pro', 'ia'] }),
  s(D, 'PowerEdge XE9712', 'PowerEdge XE', 2025, 'Rack complet NVIDIA GB200 NVL72', 'NVIDIA Grace (GB200)', undefined, '17G', { tags: ['serveur', 'pro', 'ia'] }),
  s(D, 'PowerEdge M7725', 'PowerEdge M', 2025, 'Nœud haute densité (rack IR7000)', EPYC5, 2, '17G'),
];
