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

const H = 'HPE';
const E5_26 = 'Intel Xeon E5-2600 / E5-2600 v2';
const E5_24 = 'Intel Xeon E5-2400 / E5-2400 v2';
const V34 = 'Intel Xeon E5-2600 v3/v4';
const SP12 = 'Intel Xeon Scalable 1re/2e génération';
const SP3 = 'Intel Xeon Scalable 3e génération';
const SP45 = 'Intel Xeon Scalable 4e/5e génération';
const X6 = 'Intel Xeon 6';
const EPYC23 = 'AMD EPYC 7002/7003';
const EPYC4 = 'AMD EPYC 9004';
const EPYC5 = 'AMD EPYC 9005';
const AI = { tags: ['serveur', 'pro', 'ia'] };
const ST = { tags: ['serveur', 'pro', 'nas'] };

/** HPE ProLiant Gen8 à Gen12, BladeSystem, Synergy, Apollo, Cray et Alletra. */
export const PRODUCTS: CatalogProduct[] = [
  // ─── Gen8 ───
  s(H, 'ProLiant DL320e Gen8', 'ProLiant DL', 2012, 'Rack 1U', 'Intel Xeon E3-1200 v2', 1, 'Gen8', { baies: 'jusqu’à 4 x 3,5"' }),
  s(H, 'ProLiant DL320e Gen8 v2', 'ProLiant DL', 2013, 'Rack 1U', 'Intel Xeon E3-1200 v3', 1, 'Gen8', { baies: 'jusqu’à 4 x 3,5"' }),
  s(H, 'ProLiant DL360e Gen8', 'ProLiant DL', 2012, 'Rack 1U', E5_24, 2, 'Gen8'),
  s(H, 'ProLiant DL360p Gen8', 'ProLiant DL', 2012, 'Rack 1U', E5_26, 2, 'Gen8', { ram: '24 slots DDR3', baies: 'jusqu’à 8 x 2,5" ou 4 x 3,5"' }),
  s(H, 'ProLiant DL380e Gen8', 'ProLiant DL', 2012, 'Rack 2U', E5_24, 2, 'Gen8', { baies: 'jusqu’à 25 x 2,5" ou 14 x 3,5"' }),
  s(H, 'ProLiant DL380p Gen8', 'ProLiant DL', 2012, 'Rack 2U', E5_26, 2, 'Gen8', { ram: '24 slots DDR3', baies: 'jusqu’à 25 x 2,5" ou 12 x 3,5"' }),
  s(H, 'ProLiant DL385p Gen8', 'ProLiant DL', 2012, 'Rack 2U', 'AMD Opteron 6200/6300', 2, 'Gen8', { ram: '24 slots DDR3' }),
  s(H, 'ProLiant DL160 Gen8', 'ProLiant DL', 2012, 'Rack 1U', E5_26, 2, 'Gen8'),
  s(H, 'ProLiant DL560 Gen8', 'ProLiant DL', 2012, 'Rack 2U', 'Intel Xeon E5-4600 / E5-4600 v2', 4, 'Gen8', { ram: '48 slots DDR3' }),
  s(H, 'ProLiant DL580 Gen8', 'ProLiant DL', 2014, 'Rack 4U', 'Intel Xeon E7-4800/8800 v2', 4, 'Gen8', { ram: '96 slots DDR3' }),
  s(H, 'ProLiant ML310e Gen8', 'ProLiant ML', 2012, 'Tour', 'Intel Xeon E3-1200 v2', 1, 'Gen8', { baies: 'jusqu’à 4 x 3,5" ou 8 x 2,5"' }),
  s(H, 'ProLiant ML310e Gen8 v2', 'ProLiant ML', 2013, 'Tour', 'Intel Xeon E3-1200 v3', 1, 'Gen8', { baies: 'jusqu’à 4 x 3,5" ou 8 x 2,5"' }),
  s(H, 'ProLiant ML350e Gen8', 'ProLiant ML', 2012, 'Tour', E5_24, 2, 'Gen8'),
  s(H, 'ProLiant ML350p Gen8', 'ProLiant ML', 2012, 'Tour (convertible rack 5U)', E5_26, 2, 'Gen8', { ram: '24 slots DDR3' }),
  s(H, 'ProLiant MicroServer Gen8', 'ProLiant MicroServer', 2013, 'Ultra-compact', 'Intel Celeron G1610T / Pentium G2020T / Xeon E3-1200 v2', 1, 'Gen8', { ram: '16 Go (2 slots DDR3 ECC)', baies: '4 x 3,5"', net: '2 x 1 GbE', tags: ['serveur', 'homelab', 'nas'] }),
  s(H, 'ProLiant ML10', 'ProLiant ML', 2014, 'Tour', 'Intel Xeon E3-1200 v3 / Pentium', 1, 'Gen8', { ram: '32 Go (4 slots DDR3 ECC)', baies: 'jusqu’à 4 x 3,5"' }),
  s(H, 'ProLiant ML10 v2', 'ProLiant ML', 2015, 'Tour', 'Intel Xeon E3-1200 v3 / Pentium G3240', 1, 'Gen8', { ram: '32 Go (4 slots DDR3 ECC)', baies: 'jusqu’à 4 x 3,5"' }),
  s(H, 'ProLiant BL460c Gen8', 'BladeSystem', 2012, 'Lame demi-hauteur (c7000/c3000)', E5_26, 2, 'Gen8'),
  s(H, 'ProLiant BL660c Gen8', 'BladeSystem', 2013, 'Lame pleine hauteur (c7000/c3000)', 'Intel Xeon E5-4600 / E5-4600 v2', 4, 'Gen8'),
  s(H, 'ProLiant SL230s Gen8', 'ProLiant SL', 2012, 'Nœud demi-largeur 1U (châssis s6500)', E5_26, 2, 'Gen8'),
  s(H, 'ProLiant SL4540 Gen8', 'ProLiant SL', 2013, 'Rack 4,3U (stockage)', E5_24, 2, 'Gen8', { baies: 'jusqu’à 60 x 3,5"', ...ST }),
  s(H, 'BladeSystem c7000', 'BladeSystem', 2012, 'Châssis lames 10U (16 lames)', undefined, undefined, undefined, { tags: ['serveur', 'pro'] }),

  // ─── Gen9 ───
  s(H, 'ProLiant DL20 Gen9', 'ProLiant DL', 2016, 'Rack 1U (faible profondeur)', 'Intel Xeon E3-1200 v5/v6', 1, 'Gen9', { ram: '64 Go (4 slots DDR4 ECC)', baies: 'jusqu’à 4 x 2,5" ou 2 x 3,5"' }),
  s(H, 'ProLiant DL60 Gen9', 'ProLiant DL', 2014, 'Rack 1U', V34, 2, 'Gen9'),
  s(H, 'ProLiant DL80 Gen9', 'ProLiant DL', 2014, 'Rack 2U', V34, 2, 'Gen9', { baies: 'jusqu’à 12 x 3,5"' }),
  s(H, 'ProLiant DL120 Gen9', 'ProLiant DL', 2014, 'Rack 1U', V34, 1, 'Gen9'),
  s(H, 'ProLiant DL160 Gen9', 'ProLiant DL', 2014, 'Rack 1U', V34, 2, 'Gen9'),
  s(H, 'ProLiant DL180 Gen9', 'ProLiant DL', 2014, 'Rack 2U', V34, 2, 'Gen9', { baies: 'jusqu’à 12 x 3,5"' }),
  s(H, 'ProLiant DL560 Gen9', 'ProLiant DL', 2015, 'Rack 2U', 'Intel Xeon E5-4600 v3/v4', 4, 'Gen9', { ram: '48 slots DDR4' }),
  s(H, 'ProLiant DL580 Gen9', 'ProLiant DL', 2015, 'Rack 4U', 'Intel Xeon E7-4800/8800 v3/v4', 4, 'Gen9', { ram: '96 slots DDR4' }),
  s(H, 'ProLiant ML30 Gen9', 'ProLiant ML', 2016, 'Tour', 'Intel Xeon E3-1200 v5/v6', 1, 'Gen9', { ram: '64 Go (4 slots DDR4 ECC)', baies: 'jusqu’à 4 x 3,5" ou 8 x 2,5"' }),
  s(H, 'ProLiant ML110 Gen9', 'ProLiant ML', 2014, 'Tour', V34, 1, 'Gen9'),
  s(H, 'ProLiant ML150 Gen9', 'ProLiant ML', 2014, 'Tour', V34, 2, 'Gen9'),
  s(H, 'ProLiant ML350 Gen9', 'ProLiant ML', 2014, 'Tour (convertible rack 5U)', V34, 2, 'Gen9', { ram: '24 slots DDR4', baies: 'jusqu’à 48 x 2,5" ou 24 x 3,5"' }),
  s(H, 'ProLiant BL460c Gen9', 'BladeSystem', 2014, 'Lame demi-hauteur (c7000/c3000)', V34, 2, 'Gen9'),
  s(H, 'ProLiant BL660c Gen9', 'BladeSystem', 2015, 'Lame pleine hauteur (c7000/c3000)', 'Intel Xeon E5-4600 v3/v4', 4, 'Gen9'),
  s(H, 'Apollo 4200 Gen9', 'Apollo', 2015, 'Rack 2U (stockage)', V34, 2, 'Gen9', { baies: 'jusqu’à 28 x 3,5"', ...ST }),
  s(H, 'Apollo 4510 Gen9', 'Apollo', 2015, 'Rack 4U (stockage)', V34, 2, 'Gen9', { baies: 'jusqu’à 68 x 3,5"', ...ST }),
  s(H, 'ProLiant XL170r Gen9', 'Apollo 2000', 2015, 'Nœud 1U demi-largeur (châssis Apollo r2000)', V34, 2, 'Gen9'),
  s(H, 'ProLiant XL190r Gen9', 'Apollo 2000', 2015, 'Nœud 2U demi-largeur (GPU, châssis Apollo r2000)', V34, 2, 'Gen9', AI),
  s(H, 'ProLiant XL230a Gen9', 'Apollo 6000', 2014, 'Plateau (châssis Apollo a6000)', V34, 2, 'Gen9'),
  s(H, 'ProLiant XL270d Gen9', 'Apollo 6500', 2016, 'Plateau 2U (8 GPU, châssis Apollo 6500)', V34, 2, 'Gen9', AI),
  s(H, 'Synergy 480 Gen9', 'Synergy', 2016, 'Module de calcul demi-hauteur (cadre Synergy 12000)', V34, 2, 'Gen9'),
  s(H, 'Synergy 660 Gen9', 'Synergy', 2016, 'Module de calcul pleine hauteur (cadre Synergy 12000)', 'Intel Xeon E5-4600 v4', 4, 'Gen9'),
  s(H, 'Synergy 12000 Frame', 'Synergy', 2016, 'Cadre composable 10U (12 modules)', undefined, undefined, undefined, { tags: ['serveur', 'pro'] }),

  // ─── Gen10 ───
  s(H, 'ProLiant DL20 Gen10', 'ProLiant DL', 2018, 'Rack 1U (faible profondeur)', 'Intel Xeon E-2100/E-2200', 1, 'Gen10', { ram: '64 Go (4 slots DDR4 ECC)' }),
  s(H, 'ProLiant DL160 Gen10', 'ProLiant DL', 2017, 'Rack 1U', SP12, 2, 'Gen10'),
  s(H, 'ProLiant DL180 Gen10', 'ProLiant DL', 2017, 'Rack 2U', SP12, 2, 'Gen10'),
  s(H, 'ProLiant DL325 Gen10', 'ProLiant DL', 2018, 'Rack 1U', 'AMD EPYC 7001/7002', 1, 'Gen10', { ram: '16 slots DDR4' }),
  s(H, 'ProLiant DL385 Gen10', 'ProLiant DL', 2017, 'Rack 2U', 'AMD EPYC 7001/7002', 2, 'Gen10', { ram: '32 slots DDR4' }),
  s(H, 'ProLiant DL560 Gen10', 'ProLiant DL', 2017, 'Rack 2U', SP12, 4, 'Gen10', { ram: '48 slots DDR4' }),
  s(H, 'ProLiant DL580 Gen10', 'ProLiant DL', 2017, 'Rack 4U', SP12, 4, 'Gen10', { ram: '48 slots DDR4' }),
  s(H, 'ProLiant MicroServer Gen10', 'ProLiant MicroServer', 2017, 'Ultra-compact', 'AMD Opteron X3216 / X3421', 1, 'Gen10', { ram: '32 Go (2 slots DDR4 ECC)', baies: '4 x 3,5"', tags: ['serveur', 'homelab', 'nas'] }),
  s(H, 'ProLiant BL460c Gen10', 'BladeSystem', 2017, 'Lame demi-hauteur (c7000/c3000)', SP12, 2, 'Gen10'),
  s(H, 'Synergy 480 Gen10', 'Synergy', 2017, 'Module de calcul demi-hauteur (cadre Synergy 12000)', SP12, 2, 'Gen10'),
  s(H, 'Synergy 660 Gen10', 'Synergy', 2017, 'Module de calcul pleine hauteur (cadre Synergy 12000)', SP12, 4, 'Gen10'),
  s(H, 'Apollo 4200 Gen10', 'Apollo', 2018, 'Rack 2U (stockage)', SP12, 2, 'Gen10', { baies: 'jusqu’à 28 x 3,5"', ...ST }),
  s(H, 'Apollo 4510 Gen10', 'Apollo', 2018, 'Rack 4U (stockage)', SP12, 2, 'Gen10', { baies: 'jusqu’à 60 x 3,5"', ...ST }),
  s(H, 'ProLiant XL170r Gen10', 'Apollo 2000', 2017, 'Nœud 1U demi-largeur (châssis Apollo r2000)', SP12, 2, 'Gen10'),
  s(H, 'ProLiant XL190r Gen10', 'Apollo 2000', 2017, 'Nœud 2U demi-largeur (GPU, châssis Apollo r2000)', SP12, 2, 'Gen10', AI),
  s(H, 'Apollo 6500 Gen10', 'Apollo 6500', 2018, 'Rack 4U (8 GPU, nœud XL270d Gen10)', SP12, 2, 'Gen10', AI),

  // ─── Gen10 Plus ───
  s(H, 'ProLiant DL20 Gen10 Plus', 'ProLiant DL', 2021, 'Rack 1U (faible profondeur)', 'Intel Xeon E-2300', 1, 'Gen10 Plus', { ram: '128 Go (4 slots DDR4 ECC)' }),
  s(H, 'ProLiant DL110 Gen10 Plus', 'ProLiant DL', 2021, 'Rack 1U (télécom/edge)', SP3, 1, 'Gen10 Plus'),
  s(H, 'ProLiant DL325 Gen10 Plus', 'ProLiant DL', 2019, 'Rack 1U', EPYC23, 1, 'Gen10 Plus', { ram: '16 slots DDR4' }),
  s(H, 'ProLiant DL325 Gen10 Plus v2', 'ProLiant DL', 2021, 'Rack 1U', 'AMD EPYC 7003', 1, 'Gen10 Plus', { ram: '16 slots DDR4' }),
  s(H, 'ProLiant DL345 Gen10 Plus', 'ProLiant DL', 2021, 'Rack 2U', EPYC23, 1, 'Gen10 Plus', { ram: '16 slots DDR4' }),
  s(H, 'ProLiant DL365 Gen10 Plus', 'ProLiant DL', 2021, 'Rack 1U', EPYC23, 2, 'Gen10 Plus', { ram: '32 slots DDR4' }),
  s(H, 'ProLiant DL385 Gen10 Plus', 'ProLiant DL', 2019, 'Rack 2U', EPYC23, 2, 'Gen10 Plus', { ram: '32 slots DDR4' }),
  s(H, 'ProLiant DL385 Gen10 Plus v2', 'ProLiant DL', 2021, 'Rack 2U', 'AMD EPYC 7003', 2, 'Gen10 Plus', { ram: '32 slots DDR4' }),
  s(H, 'ProLiant ML30 Gen10 Plus', 'ProLiant ML', 2021, 'Tour', 'Intel Xeon E-2300 / Pentium', 1, 'Gen10 Plus', { ram: '128 Go (4 slots DDR4 ECC)', baies: 'jusqu’à 4 x 3,5" ou 8 x 2,5"' }),
  s(H, 'ProLiant ML110 Gen10 Plus', 'ProLiant ML', 2021, 'Tour', SP3, 1, 'Gen10 Plus'),
  s(H, 'Apollo 6500 Gen10 Plus', 'Apollo 6500', 2020, 'Rack (8 GPU, nœuds XL645d/XL675d)', EPYC23, 2, 'Gen10 Plus', AI),
  s(H, 'ProLiant XL675d Gen10 Plus', 'Apollo 6500', 2020, 'Nœud pleine largeur (8 GPU, châssis Apollo 6500 Gen10 Plus)', EPYC23, 2, 'Gen10 Plus', AI),
  s(H, 'ProLiant XL645d Gen10 Plus', 'Apollo 6500', 2020, 'Nœud demi-largeur (4 GPU, châssis Apollo 6500 Gen10 Plus)', EPYC23, 1, 'Gen10 Plus', AI),
  s(H, 'Apollo 4200 Gen10 Plus', 'Apollo', 2021, 'Rack 2U (stockage)', SP3, 2, 'Gen10 Plus', ST),
  s(H, 'Synergy 480 Gen10 Plus', 'Synergy', 2021, 'Module de calcul demi-hauteur (cadre Synergy 12000)', SP3, 2, 'Gen10 Plus'),
  s(H, 'ProLiant XL220n Gen10 Plus', 'Apollo 2000', 2021, 'Nœud 1U demi-largeur (châssis Apollo n2600)', SP3, 2, 'Gen10 Plus'),
  s(H, 'ProLiant XL225n Gen10 Plus', 'Apollo 2000', 2021, 'Nœud 1U demi-largeur (châssis Apollo n2600)', 'AMD EPYC 7003', 2, 'Gen10 Plus'),

  // ─── Gen11 ───
  s(H, 'ProLiant DL20 Gen11', 'ProLiant DL', 2023, 'Rack 1U (faible profondeur)', 'Intel Xeon E-2400', 1, 'Gen11', { ram: '128 Go (4 slots DDR5 ECC)' }),
  s(H, 'ProLiant DL110 Gen11', 'ProLiant DL', 2023, 'Rack 1U (télécom/edge)', SP45, 1, 'Gen11'),
  s(H, 'ProLiant DL320 Gen11', 'ProLiant DL', 2023, 'Rack 1U', SP45, 1, 'Gen11', { ram: '16 slots DDR5' }),
  s(H, 'ProLiant DL325 Gen11', 'ProLiant DL', 2023, 'Rack 1U', EPYC4, 1, 'Gen11', { ram: '12 slots DDR5' }),
  s(H, 'ProLiant DL345 Gen11', 'ProLiant DL', 2023, 'Rack 2U', EPYC4, 1, 'Gen11', { ram: '12 slots DDR5' }),
  s(H, 'ProLiant DL365 Gen11', 'ProLiant DL', 2023, 'Rack 1U', EPYC4, 2, 'Gen11', { ram: '24 slots DDR5' }),
  s(H, 'ProLiant DL385 Gen11', 'ProLiant DL', 2023, 'Rack 2U', EPYC4, 2, 'Gen11', { ram: '24 slots DDR5' }),
  s(H, 'ProLiant DL380a Gen11', 'ProLiant DL', 2023, 'Rack 4U (GPU)', SP45, 2, 'Gen11', { ram: '32 slots DDR5', ...AI }),
  s(H, 'ProLiant DL560 Gen11', 'ProLiant DL', 2023, 'Rack 2U', SP45, 4, 'Gen11', { ram: '64 slots DDR5' }),
  s(H, 'ProLiant DL145 Gen11', 'ProLiant DL', 2024, 'Rack 2U faible profondeur (edge)', 'AMD EPYC 8004', 1, 'Gen11'),
  s(H, 'ProLiant RL300 Gen11', 'ProLiant RL', 2022, 'Rack 1U', 'Ampere Altra / Altra Max (Arm)', 1, 'Gen11', { ram: '16 slots DDR4' }),
  s(H, 'ProLiant ML30 Gen11', 'ProLiant ML', 2023, 'Tour', 'Intel Xeon E-2400', 1, 'Gen11', { ram: '128 Go (4 slots DDR5 ECC)', baies: 'jusqu’à 4 x 3,5" ou 8 x 2,5"' }),
  s(H, 'ProLiant ML110 Gen11', 'ProLiant ML', 2023, 'Tour', SP45, 1, 'Gen11', { ram: '16 slots DDR5' }),
  s(H, 'ProLiant ML350 Gen11', 'ProLiant ML', 2023, 'Tour (convertible rack 5U)', SP45, 2, 'Gen11', { ram: '32 slots DDR5' }),
  s(H, 'Synergy 480 Gen11', 'Synergy', 2023, 'Module de calcul demi-hauteur (cadre Synergy 12000)', SP45, 2, 'Gen11'),
  s(H, 'Alletra Storage Server 4110', 'Alletra 4000', 2023, 'Rack 1U (stockage NVMe)', 'Intel Xeon Scalable 4e génération', 2, 'Gen11', ST),
  s(H, 'Alletra Storage Server 4140', 'Alletra 4000', 2023, 'Rack 2U (stockage)', 'Intel Xeon Scalable 4e génération', 2, 'Gen11', ST),
  s(H, 'Cray XD670', 'Cray XD', 2023, 'Rack 5U (8 GPU NVIDIA H100 SXM)', SP45, 2, undefined, AI),
  s(H, 'Edgeline EL8000', 'Edgeline', 2020, 'Châssis edge 5U durci (4 lames)', undefined, undefined, undefined, { tags: ['serveur', 'pro', 'robuste'] }),

  // ─── Gen12 ───
  s(H, 'ProLiant Compute DL320 Gen12', 'ProLiant Compute', 2025, 'Rack 1U', X6, 1, 'Gen12'),
  s(H, 'ProLiant Compute DL340 Gen12', 'ProLiant Compute', 2025, 'Rack 2U', X6, 1, 'Gen12'),
  s(H, 'ProLiant Compute DL360 Gen12', 'ProLiant Compute', 2025, 'Rack 1U', X6, 2, 'Gen12'),
  s(H, 'ProLiant Compute DL380 Gen12', 'ProLiant Compute', 2025, 'Rack 2U', X6, 2, 'Gen12'),
  s(H, 'ProLiant Compute DL380a Gen12', 'ProLiant Compute', 2025, 'Rack 4U (GPU)', X6, 2, 'Gen12', AI),
  s(H, 'ProLiant Compute ML350 Gen12', 'ProLiant Compute', 2025, 'Tour (convertible rack 5U)', X6, 2, 'Gen12'),
  s(H, 'ProLiant Compute DL325 Gen12', 'ProLiant Compute', 2025, 'Rack 1U', EPYC5, 1, 'Gen12'),
  s(H, 'ProLiant Compute DL345 Gen12', 'ProLiant Compute', 2025, 'Rack 2U', EPYC5, 1, 'Gen12'),
  s(H, 'ProLiant Compute DL365 Gen12', 'ProLiant Compute', 2025, 'Rack 1U', EPYC5, 2, 'Gen12'),
  s(H, 'ProLiant Compute DL385 Gen12', 'ProLiant Compute', 2025, 'Rack 2U', EPYC5, 2, 'Gen12'),
  s(H, 'Synergy 480 Gen12', 'Synergy', 2025, 'Module de calcul demi-hauteur (cadre Synergy 12000)', X6, 2, 'Gen12'),
  s(H, 'ProLiant Compute XD685', 'ProLiant Compute XD', 2024, 'Rack 5U (8 GPU)', EPYC5, 2, undefined, AI),
  s(H, 'ProLiant Compute XD680', 'ProLiant Compute XD', 2024, 'Rack (8 accélérateurs Intel Gaudi 3)', 'Intel Xeon Scalable 5e génération', 2, undefined, AI),
  s(H, 'Superdome Flex', 'Superdome', 2017, 'Châssis 5U modulaire (jusqu’à 32 sockets)', SP12, 4, undefined, { tags: ['serveur', 'pro'] }),
  s(H, 'Superdome Flex 280', 'Superdome', 2020, 'Châssis 5U modulaire (jusqu’à 8 sockets)', 'Intel Xeon Scalable 2e/3e génération', undefined, undefined, { tags: ['serveur', 'pro'] }),
];
