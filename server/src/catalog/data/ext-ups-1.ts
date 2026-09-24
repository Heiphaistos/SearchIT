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
const HOME = ['bureautique', 'budget'];
const HL = ['bureautique', 'homelab'];

/** Onduleurs APC (Schneider Electric) grand public : Back-UPS ES, BX, BVX, BV, Back-UPS Pro, CS. */
export const PRODUCTS: CatalogProduct[] = [
  ...line({ brand: APC, family: 'Back-UPS ES', topo: OFF, iface: 'USB', tags: HOME, prises: 'FR' }, [
    ['APC Back-UPS ES 400 (BE400-FR)', 400, 240, undefined, 2014, 69],
    ['APC Back-UPS ES 550 (BE550G-FR)', 550, 330, undefined, 2014, 99],
    ['APC Back-UPS ES 650 (BE650G2-FR)', 650, 400, undefined, 2019, 119],
    ['APC Back-UPS ES 850 (BE850G2-FR)', 850, 520, undefined, 2019, 159],
  ]),
  ...line({ brand: APC, family: 'Back-UPS ES', topo: OFF, iface: 'USB', tags: HOME, prises: 'Schuko' }, [
    ['APC Back-UPS ES 400 (BE400-GR)', 400, 240, undefined, 2014],
    ['APC Back-UPS ES 550 (BE550G-GR)', 550, 330, undefined, 2014],
    ['APC Back-UPS ES 650 (BE650G2-GR)', 650, 400, undefined, 2019],
    ['APC Back-UPS ES 700 (BE700G-GR)', 700, 405, undefined, 2014],
    ['APC Back-UPS ES 850 (BE850G2-GR)', 850, 520, undefined, 2019],
  ]),
  ...line({ brand: APC, family: 'Back-UPS BX', topo: AVR, iface: 'USB', tags: HOME, prises: 'FR', year: 2020 }, [
    ['APC Back-UPS BX500MI-FR', 500, 300, undefined, undefined, 79],
    ['APC Back-UPS BX750MI-FR', 750, 410, undefined, undefined, 109],
    ['APC Back-UPS BX950MI-FR', 950, 520, undefined, undefined, 139],
    ['APC Back-UPS BX1200MI-FR', 1200, 650, undefined, undefined, 179],
    ['APC Back-UPS BX1600MI-FR', 1600, 900, undefined, undefined, 229],
    ['APC Back-UPS BX2200MI-FR', 2200, 1200, undefined, undefined, 319],
  ]),
  ...line({ brand: APC, family: 'Back-UPS BX', topo: AVR, iface: 'USB', tags: HOME, prises: 'Schuko', year: 2020 }, [
    ['APC Back-UPS BX500MI-GR', 500, 300],
    ['APC Back-UPS BX750MI-GR', 750, 410],
    ['APC Back-UPS BX950MI-GR', 950, 520],
    ['APC Back-UPS BX1200MI-GR', 1200, 650],
    ['APC Back-UPS BX1600MI-GR', 1600, 900],
    ['APC Back-UPS BX2200MI-GR', 2200, 1200],
  ]),
  ...line({ brand: APC, family: 'Back-UPS BX', topo: AVR, iface: 'USB', tags: HL, prises: 'IEC C13', year: 2020 }, [
    ['APC Back-UPS BX500MI', 500, 300],
    ['APC Back-UPS BX750MI', 750, 410],
    ['APC Back-UPS BX950MI', 950, 520],
    ['APC Back-UPS BX1200MI', 1200, 650],
    ['APC Back-UPS BX1600MI', 1600, 900],
    ['APC Back-UPS BX2200MI', 2200, 1200],
  ]),
  ...line({ brand: APC, family: 'Back-UPS BX', topo: AVR, iface: 'USB', tags: HOME, year: 2016 }, [
    ['APC Back-UPS BX700UI', 700, 390, 'IEC C13'],
    ['APC Back-UPS BX950UI', 950, 520, 'IEC C13'],
    ['APC Back-UPS BX1400UI', 1400, 700, 'IEC C13'],
    ['APC Back-UPS BX700U-GR', 700, 390, 'Schuko'],
    ['APC Back-UPS BX950U-GR', 950, 520, 'Schuko'],
    ['APC Back-UPS BX1400U-GR', 1400, 700, 'Schuko'],
  ]),
  ...line({ brand: APC, family: 'Back-UPS BX', topo: AVR, tags: HOME, prises: 'IEC C13' }, [
    ['APC Back-UPS BX500CI', 500, 300, undefined, 2012],
    ['APC Back-UPS BX650LI', 650, 325, undefined, 2019],
    ['APC Back-UPS BX800LI', 800, 415, undefined, 2019],
    ['APC Back-UPS BX1100LI', 1100, 550, undefined, 2019],
  ]),
  ...line({ brand: APC, family: 'Back-UPS BVX', topo: AVR, tags: HOME, prises: 'IEC C13', year: 2021 }, [
    ['APC Back-UPS BVX700LI', 700, 360, undefined, undefined, 99],
    ['APC Back-UPS BVX900LI', 900, 480, undefined, undefined, 119],
    ['APC Back-UPS BVX1200LI', 1200, 650, undefined, undefined, 159],
    ['APC Back-UPS BVX1600LI', 1600, 900, undefined, undefined, 209],
  ]),
  ...line({ brand: APC, family: 'Back-UPS BVX', topo: AVR, tags: HOME, prises: 'Schuko', year: 2021 }, [
    ['APC Back-UPS BVX700LI-GR', 700, 360],
    ['APC Back-UPS BVX900LI-GR', 900, 480],
    ['APC Back-UPS BVX1200LI-GR', 1200, 650],
    ['APC Back-UPS BVX1600LI-GR', 1600, 900],
  ]),
  ...line({ brand: APC, family: 'Easy UPS BV', topo: AVR, tags: HOME, prises: 'IEC C13', year: 2019 }, [
    ['APC Easy UPS BV500I', 500, 300],
    ['APC Easy UPS BV650I', 650, 375],
    ['APC Easy UPS BV800I', 800, 450],
    ['APC Easy UPS BV1000I', 1000, 600],
  ]),
  ...line({ brand: APC, family: 'Easy UPS BV', topo: AVR, tags: HOME, prises: 'Schuko', year: 2019 }, [
    ['APC Easy UPS BV500I-GR', 500, 300],
    ['APC Easy UPS BV650I-GR', 650, 375],
    ['APC Easy UPS BV800I-GR', 800, 450],
    ['APC Easy UPS BV1000I-GR', 1000, 600],
  ]),
  ...line({ brand: APC, family: 'Back-UPS Pro', topo: AVR, iface: 'USB', tags: ['homelab', 'pro'] }, [
    ['APC Back-UPS Pro 550 (BR550GI)', 550, 330, 'IEC C13', 2013],
    ['APC Back-UPS Pro 900 (BR900GI)', 900, 540, 'IEC C13', 2013],
    ['APC Back-UPS Pro 900 (BR900G-GR)', 900, 540, 'Schuko', 2013],
    ['APC Back-UPS Pro 1200 (BR1200G-FR)', 1200, 720, 'FR', 2013, 239],
    ['APC Back-UPS Pro 1200 (BR1200GI)', 1200, 720, 'IEC C13', 2013],
    ['APC Back-UPS Pro 1200 (BR1200G-GR)', 1200, 720, 'Schuko', 2013],
    ['APC Back-UPS Pro 1500 (BR1500GI)', 1500, 865, 'IEC C13', 2013],
    ['APC Back-UPS Pro 1500 (BR1500G-GR)', 1500, 865, 'Schuko', 2013],
  ]),
  ...line({ brand: APC, family: 'Back-UPS Pro', topo: SIN, iface: 'USB', tags: ['homelab', 'pro', 'nas'], prises: 'IEC C13' }, [
    ['APC Back-UPS Pro 1200 (BR1200SI)', 1200, 720, undefined, 2016],
    ['APC Back-UPS Pro 650 (BR650MI)', 650, 390, undefined, 2021, 179],
    ['APC Back-UPS Pro 900 (BR900MI)', 900, 540, undefined, 2021, 229],
    ['APC Back-UPS Pro 1600 (BR1600MI)', 1600, 960, undefined, 2021, 349],
  ]),
  ...line({ brand: APC, family: 'Back-UPS CS', topo: OFF, iface: 'USB, série', tags: HOME, prises: 'IEC C13' }, [
    ['APC Back-UPS CS 350 (BK350EI)', 350, 210],
    ['APC Back-UPS CS 500 (BK500EI)', 500, 300],
    ['APC Back-UPS CS 650 (BK650EI)', 650, 400],
  ]),
];
