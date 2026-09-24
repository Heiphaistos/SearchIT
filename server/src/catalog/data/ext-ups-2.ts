import type { CatalogProduct } from '../types.js';

// Helpers locaux : une ligne = un modèle réel (référence constructeur dans le nom).
const OFF = 'Off-line (standby)';
const AVR = 'Line-interactive (AVR)';
const SIN = 'Line-interactive, sinusoïde pure';
const ONL = 'On-line double conversion';
void [OFF, AVR, SIN, ONL];

/** [nom, VA, W, prises, année, prix de lancement] */
type Row = [string, number, number?, string?, number?, number?];
interface Line { brand: string; family: string; topo: string; iface?: string; tags: string[]; year?: number; refurb?: boolean; prises?: string }

const fmt = (n: number, u: string): string => (n >= 10000 ? `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${u}` : `${n} ${u}`);
const slug = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function line(l: Line, rows: Row[]): CatalogProduct[] {
  return rows.map(([name, va, w, prises, year, msrp]) => {
    const specs: Record<string, string> = { 'Puissance': fmt(va, 'VA') };
    if (w) specs['Puissance active'] = fmt(w, 'W');
    specs['Topologie'] = l.topo;
    const p = prises ?? l.prises;
    if (p) specs['Prises'] = p;
    if (l.iface) specs['Interface'] = l.iface;
    const y = year ?? l.year;
    const prod: CatalogProduct = { id: `ups-${slug(name)}`, category: 'ups', brand: l.brand, name, family: l.family, specs, tags: l.tags };
    if (y) prod.year = y;
    if (msrp) prod.msrp = msrp;
    prod.refurbishable = l.refurb ?? true;
    return prod;
  });
}

const APC = 'APC';
const PRO = ['pro', 'serveur'];
const RACK = ['pro', 'serveur', 'homelab'];

/** Onduleurs APC professionnels : Easy UPS SMV/SRV, Smart-UPS SMT/SMX/SMC/SRT/SMTL/SRC et Smart-UPS SUA (ancienne génération). */
export const PRODUCTS: CatalogProduct[] = [
  ...line({ brand: APC, family: 'Easy UPS SMV', topo: SIN, iface: 'USB, série, SmartSlot', tags: ['pro', 'homelab'], prises: 'IEC C13', year: 2019 }, [
    ['APC Easy UPS SMV 750 (SMV750CAI)', 750, 525],
    ['APC Easy UPS SMV 1000 (SMV1000CAI)', 1000, 700],
    ['APC Easy UPS SMV 1500 (SMV1500CAI)', 1500, 1050],
    ['APC Easy UPS SMV 2000 (SMV2000CAI)', 2000, 1400],
    ['APC Easy UPS SMV 3000 (SMV3000CAI)', 3000, 2100],
  ]),
  ...line({ brand: APC, family: 'Easy UPS On-Line SRV', topo: ONL, iface: 'USB, série', tags: PRO, year: 2017 }, [
    ['APC Easy UPS On-Line SRV 1000 (SRV1KI)', 1000, 800, 'IEC C13'],
    ['APC Easy UPS On-Line SRV 2000 (SRV2KI)', 2000, 1600, 'IEC C13'],
    ['APC Easy UPS On-Line SRV 3000 (SRV3KI)', 3000, 2400, 'IEC C13/C19'],
    ['APC Easy UPS On-Line SRV 6000 (SRV6KI)', 6000, 6000],
    ['APC Easy UPS On-Line SRV 10000 (SRV10KI)', 10000, 10000],
    ['APC Easy UPS On-Line SRV 1000 autonomie étendue (SRV1KIL)', 1000, 800, 'IEC C13'],
    ['APC Easy UPS On-Line SRV 2000 autonomie étendue (SRV2KIL)', 2000, 1600, 'IEC C13'],
    ['APC Easy UPS On-Line SRV 3000 autonomie étendue (SRV3KIL)', 3000, 2400, 'IEC C13/C19'],
    ['APC Easy UPS On-Line SRV 1000 Rack (SRV1KRI)', 1000, 800, 'IEC C13'],
    ['APC Easy UPS On-Line SRV 2000 Rack (SRV2KRI)', 2000, 1600, 'IEC C13'],
    ['APC Easy UPS On-Line SRV 3000 Rack (SRV3KRI)', 3000, 2400, 'IEC C13/C19'],
  ]),
  ...line({ brand: APC, family: 'Smart-UPS SMT', topo: SIN, iface: 'USB, série, SmartSlot', tags: PRO, year: 2012 }, [
    ['APC Smart-UPS 750 (SMT750I)', 750, 500, 'IEC C13', undefined, 449],
    ['APC Smart-UPS 1000 (SMT1000I)', 1000, 670, 'IEC C13', undefined, 569],
    ['APC Smart-UPS 1500 (SMT1500I)', 1500, 1000, 'IEC C13', undefined, 749],
    ['APC Smart-UPS 2200 (SMT2200I)', 2200, 1980, 'IEC C13/C19', undefined, 1199],
    ['APC Smart-UPS 3000 (SMT3000I)', 3000, 2700, 'IEC C13/C19', undefined, 1599],
    ['APC Smart-UPS 750 Rack 2U (SMT750RMI2U)', 750, 500, 'IEC C13'],
    ['APC Smart-UPS 1000 Rack 2U (SMT1000RMI2U)', 1000, 700, 'IEC C13'],
    ['APC Smart-UPS 1500 Rack 2U (SMT1500RMI2U)', 1500, 1000, 'IEC C13'],
    ['APC Smart-UPS 2200 Rack 2U (SMT2200RMI2U)', 2200, 1980, 'IEC C13/C19'],
    ['APC Smart-UPS 3000 Rack 2U (SMT3000RMI2U)', 3000, 2700, 'IEC C13/C19'],
  ]),
  ...line({ brand: APC, family: 'Smart-UPS SMT', topo: SIN, iface: 'USB, série, SmartConnect', tags: PRO, year: 2017 }, [
    ['APC Smart-UPS 1000 (SMT1000IC)', 1000, 670, 'IEC C13'],
    ['APC Smart-UPS 2200 (SMT2200IC)', 2200, 1980, 'IEC C13/C19'],
    ['APC Smart-UPS 3000 (SMT3000IC)', 3000, 2700, 'IEC C13/C19'],
    ['APC Smart-UPS 750 Rack 2U (SMT750RMI2UC)', 750, 500, 'IEC C13'],
    ['APC Smart-UPS 1000 Rack 2U (SMT1000RMI2UC)', 1000, 700, 'IEC C13'],
    ['APC Smart-UPS 2200 Rack 2U (SMT2200RMI2UC)', 2200, 1980, 'IEC C13/C19'],
    ['APC Smart-UPS 3000 Rack 2U (SMT3000RMI2UC)', 3000, 2700, 'IEC C13/C19'],
  ]),
  ...line({ brand: APC, family: 'Smart-UPS SMT', topo: SIN, iface: 'USB, série, carte réseau', tags: RACK, year: 2014 }, [
    ['APC Smart-UPS 1500 Rack 2U réseau (SMT1500RMI2UNC)', 1500, 1000, 'IEC C13'],
    ['APC Smart-UPS 3000 Rack 2U réseau (SMT3000RMI2UNC)', 3000, 2700, 'IEC C13/C19'],
  ]),
  ...line({ brand: APC, family: 'Smart-UPS SMX', topo: SIN, iface: 'USB, série, SmartSlot', tags: RACK, year: 2012 }, [
    ['APC Smart-UPS X 750 Rack/Tower (SMX750I)', 750, 600, 'IEC C13'],
    ['APC Smart-UPS X 1000 Rack/Tower (SMX1000I)', 1000, 800, 'IEC C13'],
    ['APC Smart-UPS X 1500 Rack/Tower 2U (SMX1500RMI2U)', 1500, 1200, 'IEC C13'],
    ['APC Smart-UPS X 1500 Rack/Tower 2U réseau (SMX1500RMI2UNC)', 1500, 1200, 'IEC C13'],
    ['APC Smart-UPS X 2200 Rack/Tower (SMX2200HV)', 2200, 1980, 'IEC C13/C19'],
    ['APC Smart-UPS X 2200 Rack/Tower 2U (SMX2200RMHV2U)', 2200, 1980, 'IEC C13/C19'],
    ['APC Smart-UPS X 3000 Rack/Tower (SMX3000HV)', 3000, 2700, 'IEC C13/C19'],
    ['APC Smart-UPS X 3000 Rack/Tower réseau (SMX3000HVNC)', 3000, 2700, 'IEC C13/C19'],
    ['APC Smart-UPS X 3000 Rack/Tower 2U (SMX3000RMHV2U)', 3000, 2700, 'IEC C13/C19'],
    ['APC Smart-UPS X 3000 Rack/Tower 2U réseau (SMX3000RMHV2UNC)', 3000, 2700, 'IEC C13/C19'],
  ]),
  ...line({ brand: APC, family: 'Smart-UPS C', topo: SIN, iface: 'USB, série', tags: ['pro', 'bureautique'], year: 2013 }, [
    ['APC Smart-UPS C 1000 (SMC1000I)', 1000, 600, 'IEC C13', undefined, 399],
    ['APC Smart-UPS C 2000 (SMC2000I)', 2000, 1300, 'IEC C13/C19'],
    ['APC Smart-UPS C 3000 (SMC3000I)', 3000, 2100, 'IEC C13/C19'],
    ['APC Smart-UPS C 1000 Rack 2U (SMC1000I-2U)', 1000, 600, 'IEC C13'],
    ['APC Smart-UPS C 1500 Rack 2U (SMC1500I-2U)', 1500, 900, 'IEC C13'],
    ['APC Smart-UPS C 3000 Rack 2U (SMC3000RMI2U)', 3000, 2100, 'IEC C13/C19'],
  ]),
  ...line({ brand: APC, family: 'Smart-UPS C', topo: SIN, iface: 'USB, série, SmartConnect', tags: ['pro', 'bureautique'], year: 2018 }, [
    ['APC Smart-UPS C 1000 (SMC1000IC)', 1000, 600, 'IEC C13'],
    ['APC Smart-UPS C 1500 (SMC1500IC)', 1500, 900, 'IEC C13'],
    ['APC Smart-UPS C 1000 Rack 2U (SMC1000I-2UC)', 1000, 600, 'IEC C13'],
    ['APC Smart-UPS C 1500 Rack 2U (SMC1500I-2UC)', 1500, 900, 'IEC C13'],
  ]),
  ...line({ brand: APC, family: 'Smart-UPS SRT', topo: ONL, iface: 'USB, série, SmartSlot', tags: PRO, year: 2012 }, [
    ['APC Smart-UPS SRT 1500 (SRT1500XLI)', 1500, 1500, 'IEC C13'],
    ['APC Smart-UPS SRT 2200 (SRT2200XLI)', 2200, 1980, 'IEC C13/C19'],
    ['APC Smart-UPS SRT 3000 (SRT3000XLI)', 3000, 2700, 'IEC C13/C19'],
    ['APC Smart-UPS SRT 5000 (SRT5KXLI)', 5000, 4500, 'IEC C13/C19'],
    ['APC Smart-UPS SRT 6000 (SRT6KXLI)', 6000, 6000, 'IEC C13/C19'],
    ['APC Smart-UPS SRT 8000 (SRT8KXLI)', 8000, 8000, 'IEC C13/C19'],
    ['APC Smart-UPS SRT 10000 (SRT10KXLI)', 10000, 10000, 'IEC C13/C19'],
    ['APC Smart-UPS SRT 1000 Rack 2U (SRT1000RMXLI)', 1000, 1000, 'IEC C13'],
    ['APC Smart-UPS SRT 1500 Rack 2U (SRT1500RMXLI)', 1500, 1500, 'IEC C13'],
    ['APC Smart-UPS SRT 2200 Rack 2U (SRT2200RMXLI)', 2200, 1980, 'IEC C13/C19'],
    ['APC Smart-UPS SRT 3000 Rack 2U (SRT3000RMXLI)', 3000, 2700, 'IEC C13/C19'],
    ['APC Smart-UPS SRT 5000 Rack (SRT5KRMXLI)', 5000, 4500, 'IEC C13/C19'],
    ['APC Smart-UPS SRT 6000 Rack (SRT6KRMXLI)', 6000, 6000, 'IEC C13/C19'],
    ['APC Smart-UPS SRT 8000 Rack (SRT8KRMXLI)', 8000, 8000, 'IEC C13/C19'],
    ['APC Smart-UPS SRT 10000 Rack (SRT10KRMXLI)', 10000, 10000, 'IEC C13/C19'],
  ]),
  ...line({ brand: APC, family: 'Smart-UPS Lithium-ion', topo: SIN, iface: 'USB, série, SmartConnect', tags: RACK, prises: 'IEC C13', year: 2019 }, [
    ['APC Smart-UPS Lithium-ion 750 Rack 2U (SMTL750RMI2UC)', 750],
    ['APC Smart-UPS Lithium-ion 1000 Rack 2U (SMTL1000RMI2UC)', 1000],
    ['APC Smart-UPS Lithium-ion 1500 Rack 2U (SMTL1500RMI2UC)', 1500],
    ['APC Smart-UPS Lithium-ion 2200 Rack 2U (SMTL2200RMI2UC)', 2200],
    ['APC Smart-UPS Lithium-ion 3000 Rack 2U (SMTL3000RMI2UC)', 3000],
  ]),
  ...line({ brand: APC, family: 'Smart-UPS RC', topo: ONL, iface: 'USB, série', tags: PRO, year: 2014 }, [
    ['APC Smart-UPS RC 1000 (SRC1KI)', 1000, undefined, 'IEC C13'],
    ['APC Smart-UPS RC 2000 (SRC2KI)', 2000, undefined, 'IEC C13'],
    ['APC Smart-UPS RC 3000 (SRC3KI)', 3000, undefined, 'IEC C13/C19'],
  ]),
  ...line({ brand: APC, family: 'Smart-UPS SUA', topo: SIN, iface: 'USB, série, SmartSlot', tags: ['pro', 'serveur', 'homelab', 'budget'] }, [
    ['APC Smart-UPS 750 (SUA750I)', 750, 500, 'IEC C13'],
    ['APC Smart-UPS 1000 (SUA1000I)', 1000, 670, 'IEC C13'],
    ['APC Smart-UPS 1500 (SUA1500I)', 1500, 980, 'IEC C13'],
    ['APC Smart-UPS 2200 (SUA2200I)', 2200, 1980, 'IEC C13/C19'],
    ['APC Smart-UPS 3000 (SUA3000I)', 3000, 2700, 'IEC C13/C19'],
    ['APC Smart-UPS 750 Rack 2U (SUA750RMI2U)', 750, 500, 'IEC C13'],
    ['APC Smart-UPS 1000 Rack 2U (SUA1000RMI2U)', 1000, 670, 'IEC C13'],
    ['APC Smart-UPS 1500 Rack 2U (SUA1500RMI2U)', 1500, 980, 'IEC C13'],
    ['APC Smart-UPS 2200 Rack 2U (SUA2200RMI2U)', 2200, 1980, 'IEC C13/C19'],
    ['APC Smart-UPS 3000 Rack 2U (SUA3000RMI2U)', 3000, 2700, 'IEC C13/C19'],
  ]),
];
