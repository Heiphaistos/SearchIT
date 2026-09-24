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

const SM = 'Supermicro';
const F = 'Fujitsu';
const E5_26 = 'Intel Xeon E5-2600 / E5-2600 v2';
const V34 = 'Intel Xeon E5-2600 v3/v4';
const SP12 = 'Intel Xeon Scalable 1re/2e génération';
const SP2 = 'Intel Xeon Scalable 2e génération';
const SP3 = 'Intel Xeon Scalable 3e génération';
const SP45 = 'Intel Xeon Scalable 4e/5e génération';
const EPYC23 = 'AMD EPYC 7002/7003';
const EPYC4 = 'AMD EPYC 9004';
const AI = { tags: ['serveur', 'pro', 'ia'] };
const ST = { tags: ['serveur', 'pro', 'nas'] };
const HL = { tags: ['serveur', 'homelab', 'reseau'] };

/** Supermicro (SuperServer, A+ Server, SuperStorage, GPU) et Fujitsu PRIMERGY. */
export const PRODUCTS: CatalogProduct[] = [
  // ─── Supermicro : embarqué / Xeon D / entrée de gamme ───
  s(SM, 'SuperServer 5018A-FTN4', 'SuperServer Embedded', 2014, 'Rack 1U faible profondeur', 'Intel Atom C2758 (8 cœurs, intégré)', 1, undefined, { net: '4 x 1 GbE', ...HL }),
  s(SM, 'SuperServer 5018D-FN4T', 'SuperServer Embedded', 2015, 'Rack 1U faible profondeur', 'Intel Xeon D-1541 (8 cœurs, intégré)', 1, undefined, { ram: '128 Go (DDR4 ECC)', net: '2 x 10GBase-T + 2 x 1 GbE', ...HL }),
  s(SM, 'SuperServer 5018D-FN8T', 'SuperServer Embedded', 2016, 'Rack 1U faible profondeur', 'Intel Xeon D-1518 (4 cœurs, intégré)', 1, undefined, { ram: '128 Go (DDR4 ECC)', net: '2 x 10G SFP+ + 6 x 1 GbE', ...HL }),
  s(SM, 'SuperServer E300-8D', 'SuperServer Embedded', 2016, 'Mini 1U (embarqué)', 'Intel Xeon D-1518 (4 cœurs, intégré)', 1, undefined, { ram: '128 Go (DDR4 ECC)', net: '2 x 10G SFP+ + 6 x 1 GbE', ...HL }),
  s(SM, 'SuperServer E300-9D-4CN8TP', 'SuperServer Embedded', 2018, 'Mini 1U (embarqué)', 'Intel Xeon D-2123IT (4 cœurs, intégré)', 1, undefined, { ram: '512 Go (DDR4 ECC)', ...HL }),
  s(SM, 'SuperServer E301-9D-8CN4', 'SuperServer Embedded', 2018, 'Mini 1U (embarqué)', 'Intel Xeon D-2146NT (8 cœurs, intégré)', 1, undefined, HL),
  s(SM, 'SuperServer E302-9D', 'SuperServer Embedded', 2019, 'Mini 1U (embarqué)', 'Intel Xeon D-2123IT (4 cœurs, intégré)', 1, undefined, { net: '2 x 10G SFP+ + 2 x 10GBase-T + 4 x 1 GbE', ...HL }),
  s(SM, 'SuperServer 5019D-4C-FN8TP', 'SuperServer Embedded', 2018, 'Rack 1U faible profondeur', 'Intel Xeon D-2123IT (4 cœurs, intégré)', 1, undefined, HL),
  s(SM, 'SuperServer 5017C-MTF', 'SuperServer Mainstream', 2012, 'Rack 1U', 'Intel Xeon E3-1200 / E3-1200 v2', 1, undefined, { baies: '4 x 3,5"' }),
  s(SM, 'SuperServer 5019C-M', 'SuperServer Mainstream', 2018, 'Rack 1U', 'Intel Xeon E-2100/E-2200', 1, undefined, { baies: '4 x 3,5"' }),
  s(SM, 'SuperServer 5019C-MR', 'SuperServer Mainstream', 2018, 'Rack 1U', 'Intel Xeon E-2100/E-2200', 1, undefined, { baies: '4 x 3,5"', psu: 'Redondante' }),
  s(SM, 'SuperServer 510T-MR', 'SuperServer Mainstream', 2021, 'Rack 1U', 'Intel Xeon E-2300', 1, undefined, { baies: '4 x 3,5"', psu: 'Redondante' }),

  // ─── Supermicro : bi-socket Intel ───
  s(SM, 'SuperServer 6017R-WRF', 'SuperServer', 2012, 'Rack 1U', E5_26, 2, 'X9'),
  s(SM, 'SuperServer 6027R-TRF', 'SuperServer', 2012, 'Rack 2U', E5_26, 2, 'X9', { baies: '8 x 3,5"' }),
  s(SM, 'SuperServer 6018R-WTR', 'SuperServer', 2014, 'Rack 1U', V34, 2, 'X10', { baies: '4 x 3,5"' }),
  s(SM, 'SuperServer 1028R-WTR', 'SuperServer', 2014, 'Rack 1U', V34, 2, 'X10', { baies: '8 x 2,5"' }),
  s(SM, 'SuperServer 6028R-TR', 'SuperServer', 2014, 'Rack 2U', V34, 2, 'X10', { baies: '8 x 3,5"' }),
  s(SM, 'SuperServer 1028U-TR4+', 'SuperServer Ultra', 2014, 'Rack 1U', V34, 2, 'X10', { baies: '10 x 2,5"' }),
  s(SM, 'SuperServer 2028U-TR4+', 'SuperServer Ultra', 2014, 'Rack 2U', V34, 2, 'X10', { baies: '24 x 2,5"' }),
  s(SM, 'SuperServer 6028U-TR4T+', 'SuperServer Ultra', 2014, 'Rack 2U', V34, 2, 'X10', { baies: '12 x 3,5"', net: '4 x 10GBase-T' }),
  s(SM, 'SuperServer 6019P-WTR', 'SuperServer', 2017, 'Rack 1U', SP12, 2, 'X11', { baies: '4 x 3,5"' }),
  s(SM, 'SuperServer 1029P-WTR', 'SuperServer', 2017, 'Rack 1U', SP12, 2, 'X11', { baies: '8 x 2,5"' }),
  s(SM, 'SuperServer 6029P-TR', 'SuperServer', 2017, 'Rack 2U', SP12, 2, 'X11', { baies: '8 x 3,5"' }),
  s(SM, 'SuperServer 1029U-TR4', 'SuperServer Ultra', 2017, 'Rack 1U', SP12, 2, 'X11', { baies: '10 x 2,5"' }),
  s(SM, 'SuperServer 2029U-TR4', 'SuperServer Ultra', 2017, 'Rack 2U', SP12, 2, 'X11', { baies: '24 x 2,5"' }),
  s(SM, 'SuperServer 6029U-TR4', 'SuperServer Ultra', 2017, 'Rack 2U', SP12, 2, 'X11', { baies: '12 x 3,5"' }),
  s(SM, 'SuperServer 110P-WTR', 'SuperServer CloudDC', 2021, 'Rack 1U', SP3, 1, 'X12'),
  s(SM, 'SuperServer 120U-TNR', 'SuperServer Ultra', 2021, 'Rack 1U', SP3, 2, 'X12', { baies: '12 x 2,5" NVMe/SAS/SATA' }),
  s(SM, 'SuperServer 220U-TNR', 'SuperServer Ultra', 2021, 'Rack 2U', SP3, 2, 'X12', { baies: '24 x 2,5" NVMe/SAS/SATA' }),
  s(SM, 'SuperServer 121H-TNR', 'SuperServer Hyper', 2023, 'Rack 1U', SP45, 2, 'X13'),
  s(SM, 'SuperServer 221H-TNR', 'SuperServer Hyper', 2023, 'Rack 2U', SP45, 2, 'X13'),
  s(SM, 'SuperServer 621C-TN12R', 'SuperServer CloudDC', 2023, 'Rack 2U', SP45, 2, 'X13', { baies: '12 x 3,5"' }),

  // ─── Supermicro : multi-nœuds ───
  s(SM, 'SuperServer 6027TR-HTRF', 'SuperServer Twin', 2012, 'Rack 2U (4 nœuds)', E5_26, 2, 'X9'),
  s(SM, 'SuperServer 6028TP-HTR', 'SuperServer TwinPro', 2014, 'Rack 2U (4 nœuds)', V34, 2, 'X10'),
  s(SM, 'SuperServer 2028TP-HC1R', 'SuperServer TwinPro', 2014, 'Rack 2U (4 nœuds)', V34, 2, 'X10'),
  s(SM, 'SuperServer 6029TP-HTR', 'SuperServer TwinPro', 2017, 'Rack 2U (4 nœuds)', SP12, 2, 'X11'),
  s(SM, 'SuperServer 2029TP-HC0R', 'SuperServer TwinPro', 2017, 'Rack 2U (4 nœuds)', SP12, 2, 'X11'),
  s(SM, 'SuperServer 2029BT-HNR', 'SuperServer BigTwin', 2017, 'Rack 2U (4 nœuds)', SP12, 2, 'X11'),

  // ─── Supermicro : AMD EPYC (A+ Server) ───
  s(SM, 'A+ Server 1014S-WTRT', 'A+ Server', 2020, 'Rack 1U', EPYC23, 1, 'H12', { baies: '4 x 3,5"' }),
  s(SM, 'A+ Server 1114S-WTRT', 'A+ Server', 2020, 'Rack 1U', EPYC23, 1, 'H12', { baies: '10 x 2,5"' }),
  s(SM, 'A+ Server 1124US-TNRP', 'A+ Server', 2021, 'Rack 1U', EPYC23, 2, 'H12'),
  s(SM, 'A+ Server 2124US-TNRP', 'A+ Server', 2021, 'Rack 2U', EPYC23, 2, 'H12'),
  s(SM, 'A+ Server 1115HS-TNR', 'A+ Server Hyper', 2023, 'Rack 1U', EPYC4, 1, 'H13'),
  s(SM, 'A+ Server 1125HS-TNR', 'A+ Server Hyper', 2023, 'Rack 1U', EPYC4, 2, 'H13'),
  s(SM, 'A+ Server 2125HS-TNR', 'A+ Server Hyper', 2023, 'Rack 2U', EPYC4, 2, 'H13'),

  // ─── Supermicro : stockage ───
  s(SM, 'SuperStorage 6028R-E1CR12L', 'SuperStorage', 2015, 'Rack 2U (stockage)', V34, 2, 'X10', { baies: '12 x 3,5"', ...ST }),
  s(SM, 'SuperStorage 6048R-E1CR36L', 'SuperStorage', 2015, 'Rack 4U (stockage)', V34, 2, 'X10', { baies: '36 x 3,5"', ...ST }),
  s(SM, 'SuperStorage 6048R-E1CR60L', 'SuperStorage', 2016, 'Rack 4U chargement par le haut', V34, 2, 'X10', { baies: '60 x 3,5"', ...ST }),
  s(SM, 'SuperStorage 6029P-E1CR12L', 'SuperStorage', 2017, 'Rack 2U (stockage)', SP12, 2, 'X11', { baies: '12 x 3,5"', ...ST }),
  s(SM, 'SuperStorage 6049P-E1CR36L', 'SuperStorage', 2017, 'Rack 4U (stockage)', SP12, 2, 'X11', { baies: '36 x 3,5"', ...ST }),
  s(SM, 'SuperStorage 6049P-E1CR60L', 'SuperStorage', 2017, 'Rack 4U chargement par le haut', SP12, 2, 'X11', { baies: '60 x 3,5"', ...ST }),
  s(SM, 'SuperStorage 1029P-NES32R', 'SuperStorage', 2018, 'Rack 1U (32 SSD EDSFF)', SP12, 2, 'X11', { baies: '32 x EDSFF NVMe', ...ST }),
  s(SM, 'SuperStorage 540P-E1CTR45L', 'SuperStorage', 2021, 'Rack 4U (stockage)', SP3, 1, 'X12', { baies: '45 x 3,5"', ...ST }),

  // ─── Supermicro : GPU / IA ───
  s(SM, 'SuperServer 4028GR-TRT', 'SuperServer GPU', 2015, 'Rack 4U (8 GPU PCIe)', V34, 2, 'X10', AI),
  s(SM, 'SuperServer 1029GQ-TRT', 'SuperServer GPU', 2017, 'Rack 1U (4 GPU PCIe)', SP12, 2, 'X11', AI),
  s(SM, 'SuperServer 4029GP-TRT', 'SuperServer GPU', 2017, 'Rack 4U (8 GPU PCIe)', SP12, 2, 'X11', AI),
  s(SM, 'SuperServer 4029GP-TRT2', 'SuperServer GPU', 2017, 'Rack 4U (10 GPU PCIe)', SP12, 2, 'X11', AI),
  s(SM, 'SuperServer 4029GP-TVRT', 'SuperServer GPU', 2018, 'Rack 4U (8 GPU NVIDIA V100 SXM2)', SP12, 2, 'X11', AI),
  s(SM, 'SuperServer 420GP-TNR', 'SuperServer GPU', 2021, 'Rack 4U (10 GPU PCIe)', SP3, 2, 'X12', AI),
  s(SM, 'SuperServer 420GP-TNAR', 'SuperServer GPU', 2021, 'Rack 4U (NVIDIA HGX A100 8 GPU)', SP3, 2, 'X12', AI),
  s(SM, 'A+ Server 4124GS-TNR', 'A+ Server GPU', 2020, 'Rack 4U (8 GPU PCIe)', EPYC23, 2, 'H12', AI),
  s(SM, 'A+ Server 4124GO-NART', 'A+ Server GPU', 2020, 'Rack 4U (NVIDIA HGX A100 8 GPU)', EPYC23, 2, 'H12', AI),
  s(SM, 'SuperServer 421GE-TNRT', 'SuperServer GPU', 2023, 'Rack 4U (10 GPU PCIe)', SP45, 2, 'X13', AI),
  s(SM, 'SuperServer 521GE-TNRT', 'SuperServer GPU', 2023, 'Rack 5U (10 GPU PCIe)', SP45, 2, 'X13', AI),
  s(SM, 'SuperServer 741GE-TNRT', 'SuperServer GPU', 2023, 'Tour / rack 4U (4 GPU)', SP45, 2, 'X13', AI),
  s(SM, 'SuperServer 821GE-TNHR', 'SuperServer GPU', 2023, 'Rack 8U (NVIDIA HGX H100/H200 8 GPU)', SP45, 2, 'X13', AI),
  s(SM, 'A+ Server 4125GS-TNRT', 'A+ Server GPU', 2023, 'Rack 4U (10 GPU PCIe)', EPYC4, 2, 'H13', AI),
  s(SM, 'A+ Server 8125GS-TNHR', 'A+ Server GPU', 2023, 'Rack 8U (NVIDIA HGX H100/H200 8 GPU)', EPYC4, 2, 'H13', AI),
  s(SM, 'A+ Server 8125GS-TNMR2', 'A+ Server GPU', 2024, 'Rack 8U (8 GPU AMD Instinct MI300X)', EPYC4, 2, 'H13', AI),
  s(SM, 'ARS-111GL-NHR', 'Grace Hopper', 2023, 'Rack 1U (NVIDIA GH200 Grace Hopper)', 'NVIDIA Grace (Arm, 72 cœurs)', 1, undefined, AI),
  s(SM, 'SuperServer A21GE-NBRT', 'SuperServer GPU', 2024, 'Rack 10U (NVIDIA HGX B200 8 GPU)', SP45, 2, 'X13', AI),

  // ─── Fujitsu PRIMERGY RX (rack) ───
  s(F, 'PRIMERGY RX100 S7', 'PRIMERGY RX', 2012, 'Rack 1U', 'Intel Xeon E3-1200 / E3-1200 v2', 1, 'S7'),
  s(F, 'PRIMERGY RX100 S8', 'PRIMERGY RX', 2013, 'Rack 1U', 'Intel Xeon E3-1200 v3', 1, 'S8'),
  s(F, 'PRIMERGY RX200 S7', 'PRIMERGY RX', 2012, 'Rack 1U', 'Intel Xeon E5-2600', 2, 'S7'),
  s(F, 'PRIMERGY RX200 S8', 'PRIMERGY RX', 2013, 'Rack 1U', 'Intel Xeon E5-2600 v2', 2, 'S8'),
  s(F, 'PRIMERGY RX300 S7', 'PRIMERGY RX', 2012, 'Rack 2U', 'Intel Xeon E5-2600', 2, 'S7'),
  s(F, 'PRIMERGY RX300 S8', 'PRIMERGY RX', 2013, 'Rack 2U', 'Intel Xeon E5-2600 v2', 2, 'S8'),
  s(F, 'PRIMERGY RX350 S7', 'PRIMERGY RX', 2012, 'Rack 4U', 'Intel Xeon E5-2600', 2, 'S7'),
  s(F, 'PRIMERGY RX350 S8', 'PRIMERGY RX', 2013, 'Rack 4U', 'Intel Xeon E5-2600 v2', 2, 'S8'),
  s(F, 'PRIMERGY RX500 S7', 'PRIMERGY RX', 2012, 'Rack 2U', 'Intel Xeon E5-4600', 4, 'S7'),
  s(F, 'PRIMERGY RX1330 M1', 'PRIMERGY RX', 2014, 'Rack 1U', 'Intel Xeon E3-1200 v3', 1, 'M1'),
  s(F, 'PRIMERGY RX1330 M2', 'PRIMERGY RX', 2016, 'Rack 1U', 'Intel Xeon E3-1200 v5', 1, 'M2'),
  s(F, 'PRIMERGY RX1330 M3', 'PRIMERGY RX', 2017, 'Rack 1U', 'Intel Xeon E3-1200 v6', 1, 'M3'),
  s(F, 'PRIMERGY RX1330 M4', 'PRIMERGY RX', 2019, 'Rack 1U', 'Intel Xeon E-2100/E-2200', 1, 'M4'),
  s(F, 'PRIMERGY RX1330 M5', 'PRIMERGY RX', 2021, 'Rack 1U', 'Intel Xeon E-2300', 1, 'M5'),
  s(F, 'PRIMERGY RX2510 M2', 'PRIMERGY RX', 2016, 'Rack 2U', 'Intel Xeon E5-2600 v4', 2, 'M2'),
  s(F, 'PRIMERGY RX2520 M1', 'PRIMERGY RX', 2014, 'Rack 2U', 'Intel Xeon E5-2400 v2', 2, 'M1'),
  s(F, 'PRIMERGY RX2520 M4', 'PRIMERGY RX', 2017, 'Rack 2U', SP12, 2, 'M4'),
  s(F, 'PRIMERGY RX2520 M5', 'PRIMERGY RX', 2019, 'Rack 2U', SP2, 2, 'M5'),
  s(F, 'PRIMERGY RX2530 M1', 'PRIMERGY RX', 2014, 'Rack 1U', 'Intel Xeon E5-2600 v3', 2, 'M1'),
  s(F, 'PRIMERGY RX2530 M2', 'PRIMERGY RX', 2016, 'Rack 1U', 'Intel Xeon E5-2600 v4', 2, 'M2'),
  s(F, 'PRIMERGY RX2530 M4', 'PRIMERGY RX', 2017, 'Rack 1U', SP12, 2, 'M4'),
  s(F, 'PRIMERGY RX2530 M5', 'PRIMERGY RX', 2019, 'Rack 1U', SP2, 2, 'M5'),
  s(F, 'PRIMERGY RX2530 M6', 'PRIMERGY RX', 2021, 'Rack 1U', SP3, 2, 'M6'),
  s(F, 'PRIMERGY RX2530 M7', 'PRIMERGY RX', 2023, 'Rack 1U', SP45, 2, 'M7'),
  s(F, 'PRIMERGY RX2540 M1', 'PRIMERGY RX', 2014, 'Rack 2U', 'Intel Xeon E5-2600 v3', 2, 'M1'),
  s(F, 'PRIMERGY RX2540 M2', 'PRIMERGY RX', 2016, 'Rack 2U', 'Intel Xeon E5-2600 v4', 2, 'M2'),
  s(F, 'PRIMERGY RX2540 M6', 'PRIMERGY RX', 2021, 'Rack 2U', SP3, 2, 'M6'),
  s(F, 'PRIMERGY RX2540 M7', 'PRIMERGY RX', 2023, 'Rack 2U', SP45, 2, 'M7'),
  s(F, 'PRIMERGY RX2560 M1', 'PRIMERGY RX', 2014, 'Rack 2U', 'Intel Xeon E5-2600 v3', 2, 'M1'),
  s(F, 'PRIMERGY RX2560 M2', 'PRIMERGY RX', 2016, 'Rack 2U', 'Intel Xeon E5-2600 v4', 2, 'M2'),
  s(F, 'PRIMERGY RX2450 M1', 'PRIMERGY RX', 2021, 'Rack 2U', 'AMD EPYC 7003', 2, 'M1'),
  s(F, 'PRIMERGY RX4770 M1', 'PRIMERGY RX', 2014, 'Rack 4U', 'Intel Xeon E7-4800/8800 v2', 4, 'M1'),
  s(F, 'PRIMERGY RX4770 M2', 'PRIMERGY RX', 2015, 'Rack 4U', 'Intel Xeon E7-4800/8800 v3', 4, 'M2'),
  s(F, 'PRIMERGY RX4770 M3', 'PRIMERGY RX', 2016, 'Rack 4U', 'Intel Xeon E7-4800/8800 v4', 4, 'M3'),
  s(F, 'PRIMERGY RX4770 M4', 'PRIMERGY RX', 2017, 'Rack 2U', 'Intel Xeon Scalable 1re génération', 4, 'M4'),
  s(F, 'PRIMERGY RX4770 M5', 'PRIMERGY RX', 2019, 'Rack 2U', SP2, 4, 'M5'),
  s(F, 'PRIMERGY RX4770 M6', 'PRIMERGY RX', 2021, 'Rack 2U', 'Intel Xeon Scalable 3e génération (Cooper Lake)', 4, 'M6'),
  s(F, 'PRIMERGY RX4770 M7', 'PRIMERGY RX', 2023, 'Rack 2U', SP45, 4, 'M7'),
  s(F, 'PRIMERGY GX2460 M1', 'PRIMERGY GX', 2021, 'Rack 2U (GPU)', EPYC23, 2, 'M1', AI),
  s(F, 'PRIMERGY GX2570 M6', 'PRIMERGY GX', 2021, 'Rack 4U (NVIDIA HGX A100 8 GPU)', SP3, 2, 'M6', AI),
];
