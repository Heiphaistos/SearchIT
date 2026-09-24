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

const CP = 'CyberPower';
const RI = 'Riello';
const LG = 'Legrand';
const HOME = ['bureautique', 'budget'];
const PRO = ['pro', 'serveur'];
const RACK = ['pro', 'serveur', 'homelab'];

/** Onduleurs CyberPower, Riello UPS et Legrand Keor. */
export const PRODUCTS: CatalogProduct[] = [
  // ─── CyberPower ────────────────────────────────────────────────────────────
  ...line({ brand: CP, family: 'Value Pro', topo: AVR, iface: 'USB', tags: HOME, year: 2016 }, [
    ['CyberPower Value Pro VP700EILCD', 700, 390, 'IEC C13'],
    ['CyberPower Value Pro VP1000EILCD', 1000, 550, 'IEC C13'],
    ['CyberPower Value Pro VP1200EILCD', 1200, 720, 'IEC C13'],
    ['CyberPower Value Pro VP1600EILCD', 1600, 960, 'IEC C13'],
    ['CyberPower Value Pro VP700ELCD', 700, 390, 'Schuko'],
    ['CyberPower Value Pro VP1000ELCD', 1000, 550, 'Schuko'],
    ['CyberPower Value Pro VP1200ELCD', 1200, 720, 'Schuko'],
    ['CyberPower Value Pro VP1600ELCD', 1600, 960, 'Schuko'],
  ]),
  ...line({ brand: CP, family: 'Value', topo: AVR, iface: 'USB', tags: HOME, year: 2014 }, [
    ['CyberPower Value 800EILCD', 800, 480, 'IEC C13'],
    ['CyberPower Value 1200EILCD', 1200, 720, 'IEC C13'],
    ['CyberPower Value 1500EILCD', 1500, 900, 'IEC C13'],
    ['CyberPower Value 2200EILCD', 2200, 1320, 'IEC C13'],
    ['CyberPower Value 800ELCD', 800, 480, 'Schuko'],
    ['CyberPower Value 1200ELCD', 1200, 720, 'Schuko'],
    ['CyberPower Value 1500ELCD', 1500, 900, 'Schuko'],
  ]),
  ...line({ brand: CP, family: 'BR', topo: AVR, iface: 'USB', tags: HOME, year: 2018 }, [
    ['CyberPower BR700ELCD', 700, 420, 'Schuko'],
    ['CyberPower BR1000ELCD', 1000, 600, 'Schuko'],
    ['CyberPower BR1200ELCD', 1200, 720, 'Schuko'],
    ['CyberPower BR700ELCD-FR', 700, 420, 'FR'],
    ['CyberPower BR1000ELCD-FR', 1000, 600, 'FR'],
    ['CyberPower BR1200ELCD-FR', 1200, 720, 'FR'],
  ]),
  ...line({ brand: CP, family: 'CP PFC Sinewave', topo: SIN, iface: 'USB', tags: ['homelab', 'nas', 'gaming'], year: 2015 }, [
    ['CyberPower CP1300EPFCLCD', 1300, 780, 'Schuko'],
  ]),
  ...line({ brand: CP, family: 'UT', topo: AVR, iface: 'USB', tags: HOME, prises: 'Schuko', year: 2016 }, [
    ['CyberPower UT650EG', 650, 360],
    ['CyberPower UT850EG', 850, 425],
    ['CyberPower UT1050EG', 1050, 630],
    ['CyberPower UT1200EG', 1200, 720],
  ]),
  ...line({ brand: CP, family: 'OR', topo: SIN, iface: 'USB, série', tags: RACK, prises: 'IEC C13', year: 2016 }, [
    ['CyberPower OR600ERM1U', 600, 360],
    ['CyberPower OR1000ERM1U', 1000, 600],
  ]),
  ...line({ brand: CP, family: 'OLS', topo: ONL, iface: 'USB, série', tags: PRO, year: 2016 }, [
    ['CyberPower OLS1000EA', 1000, 900, 'IEC C13'],
    ['CyberPower OLS1500EA', 1500, 1350, 'IEC C13'],
    ['CyberPower OLS2000EA', 2000, 1800, 'IEC C13'],
    ['CyberPower OLS3000EA', 3000, 2700, 'IEC C13/C19'],
  ]),
  ...line({ brand: CP, family: 'OL', topo: ONL, iface: 'USB, série', tags: RACK, year: 2016 }, [
    ['CyberPower OL1000ERTXL2U', 1000, 900, 'IEC C13'],
    ['CyberPower OL1500ERTXL2U', 1500, 1350, 'IEC C13'],
    ['CyberPower OL2000ERTXL2U', 2000, 1800, 'IEC C13'],
    ['CyberPower OL3000ERTXL2U', 3000, 2700, 'IEC C13/C19'],
    ['CyberPower OL6KERTHD', 6000],
    ['CyberPower OL10KERTHD', 10000],
  ]),
  ...line({ brand: CP, family: 'PR', topo: SIN, iface: 'USB, série', tags: PRO, year: 2014 }, [
    ['CyberPower PR750ELCD', 750, 675, 'IEC C13'],
    ['CyberPower PR1000ELCD', 1000, 900, 'IEC C13'],
    ['CyberPower PR1500ELCD', 1500, 1350, 'IEC C13'],
    ['CyberPower PR2200ELCDSL', 2200, 1980, 'IEC C13/C19'],
    ['CyberPower PR3000ELCDSL', 3000, 2700, 'IEC C13/C19'],
    ['CyberPower PR750ERT2U', 750, 675, 'IEC C13'],
    ['CyberPower PR1000ERT2U', 1000, 900, 'IEC C13'],
    ['CyberPower PR1500ERT2U', 1500, 1350, 'IEC C13'],
    ['CyberPower PR2200ERT2U', 2200, 1980, 'IEC C13/C19'],
    ['CyberPower PR3000ERT2U', 3000, 2700, 'IEC C13/C19'],
  ]),

  // ─── Riello UPS ────────────────────────────────────────────────────────────
  ...line({ brand: RI, family: 'iPlug', topo: OFF, iface: 'USB', tags: HOME, year: 2014 }, [
    ['Riello iPlug IPG 600', 600, 360],
    ['Riello iPlug IPG 800', 800, 480],
  ]),
  ...line({ brand: RI, family: 'iDialog', topo: AVR, iface: 'USB', tags: HOME, year: 2014 }, [
    ['Riello iDialog IDG 400', 400, 240],
    ['Riello iDialog IDG 600', 600, 360],
    ['Riello iDialog IDG 1200', 1200, 720],
    ['Riello iDialog IDG 1600', 1600, 960],
  ]),
  ...line({ brand: RI, family: 'Net Power', topo: AVR, iface: 'USB', tags: ['bureautique', 'homelab'], year: 2014 }, [
    ['Riello Net Power NPW 600', 600, 360],
    ['Riello Net Power NPW 800', 800, 480],
    ['Riello Net Power NPW 1000', 1000, 600],
    ['Riello Net Power NPW 1500', 1500, 900],
    ['Riello Net Power NPW 2000', 2000, 1200],
  ]),
  ...line({ brand: RI, family: 'Vision', topo: SIN, iface: 'USB, série', tags: ['pro', 'homelab'] }, [
    ['Riello Vision VST 800', 800, 560],
    ['Riello Vision VST 1100', 1100, 770],
    ['Riello Vision VST 1500', 1500, 1050],
    ['Riello Vision VST 2000', 2000, 1400],
    ['Riello Vision VST 3000', 3000, 2100],
  ]),
  ...line({ brand: RI, family: 'Vision Dual', topo: SIN, iface: 'USB, série', tags: RACK }, [
    ['Riello Vision Dual VSD 1100', 1100],
    ['Riello Vision Dual VSD 1500', 1500],
    ['Riello Vision Dual VSD 2200', 2200],
    ['Riello Vision Dual VSD 3000', 3000],
  ]),
  ...line({ brand: RI, family: 'Sentinel Pro', topo: ONL, iface: 'USB, série', tags: PRO }, [
    ['Riello Sentinel Pro SEP 700', 700],
    ['Riello Sentinel Pro SEP 1000', 1000],
    ['Riello Sentinel Pro SEP 1500', 1500],
    ['Riello Sentinel Pro SEP 2200', 2200],
    ['Riello Sentinel Pro SEP 3000', 3000],
  ]),
  ...line({ brand: RI, family: 'Sentinel Dual', topo: ONL, iface: 'USB, série', tags: RACK }, [
    ['Riello Sentinel Dual SDU 1000', 1000],
    ['Riello Sentinel Dual SDU 1500', 1500],
    ['Riello Sentinel Dual SDU 2200', 2200],
    ['Riello Sentinel Dual SDU 3000', 3000],
    ['Riello Sentinel Dual SDU 4000', 4000],
    ['Riello Sentinel Dual SDU 5000', 5000],
    ['Riello Sentinel Dual SDU 6000', 6000],
    ['Riello Sentinel Dual SDU 10000', 10000],
  ]),

  // ─── Legrand Keor ──────────────────────────────────────────────────────────
  ...line({ brand: LG, family: 'Keor Multiplug', topo: OFF, iface: 'USB', tags: HOME, prises: 'FR' }, [
    ['Legrand Keor Multiplug 600 VA', 600],
    ['Legrand Keor Multiplug 800 VA', 800],
  ]),
  ...line({ brand: LG, family: 'Keor SP', topo: AVR, iface: 'USB', tags: ['bureautique'], prises: 'FR' }, [
    ['Legrand Keor SP 600 VA FR', 600],
    ['Legrand Keor SP 800 VA FR', 800],
    ['Legrand Keor SP 1000 VA FR', 1000],
    ['Legrand Keor SP 1500 VA FR', 1500],
    ['Legrand Keor SP 2000 VA FR', 2000],
  ]),
  ...line({ brand: LG, family: 'Keor SPE', topo: SIN, iface: 'USB, série', tags: ['pro', 'bureautique'] }, [
    ['Legrand Keor SPE Tour 750 VA', 750],
    ['Legrand Keor SPE Tour 1000 VA', 1000],
    ['Legrand Keor SPE Tour 1500 VA', 1500],
    ['Legrand Keor SPE Tour 2000 VA', 2000],
    ['Legrand Keor SPE Tour 3000 VA', 3000],
    ['Legrand Keor SPE RT 750 VA', 750],
    ['Legrand Keor SPE RT 1000 VA', 1000],
    ['Legrand Keor SPE RT 1500 VA', 1500],
    ['Legrand Keor SPE RT 2000 VA', 2000],
    ['Legrand Keor SPE RT 3000 VA', 3000],
  ]),
  ...line({ brand: LG, family: 'Keor Line RT', topo: SIN, iface: 'USB, série', tags: RACK }, [
    ['Legrand Keor Line RT 1000 VA', 1000],
    ['Legrand Keor Line RT 1500 VA', 1500],
    ['Legrand Keor Line RT 2200 VA', 2200],
    ['Legrand Keor Line RT 3000 VA', 3000],
  ]),
  ...line({ brand: LG, family: 'Keor LP', topo: ONL, iface: 'USB, série', tags: PRO }, [
    ['Legrand Keor LP 1000 VA', 1000],
    ['Legrand Keor LP 2000 VA', 2000],
    ['Legrand Keor LP 3000 VA', 3000],
  ]),
];
