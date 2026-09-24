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

const E = 'Eaton';
const HOME = ['bureautique', 'budget'];

/** Onduleurs Eaton grand public (Ellipse ECO/PRO/MAX, Protection Station) et anciennes gammes (5110, 5130, 9130, Evolution). */
export const PRODUCTS: CatalogProduct[] = [
  ...line({ brand: E, family: 'Ellipse ECO', topo: OFF, tags: HOME, year: 2012 }, [
    ['Eaton Ellipse ECO 500 FR', 500, 300, 'FR'],
    ['Eaton Ellipse ECO 800 FR', 800, 500, 'FR'],
    ['Eaton Ellipse ECO 500 DIN', 500, 300, 'Schuko'],
    ['Eaton Ellipse ECO 650 DIN', 650, 400, 'Schuko'],
    ['Eaton Ellipse ECO 800 DIN', 800, 500, 'Schuko'],
    ['Eaton Ellipse ECO 500 IEC', 500, 300, 'IEC C13'],
  ]),
  ...line({ brand: E, family: 'Ellipse ECO', topo: OFF, iface: 'USB', tags: HOME, year: 2012 }, [
    ['Eaton Ellipse ECO 500 USB FR', 500, 300, 'FR'],
    ['Eaton Ellipse ECO 650 USB FR', 650, 400, 'FR'],
    ['Eaton Ellipse ECO 800 USB FR', 800, 500, 'FR'],
    ['Eaton Ellipse ECO 1200 USB FR', 1200, 750, 'FR'],
    ['Eaton Ellipse ECO 1600 USB FR', 1600, 1000, 'FR'],
    ['Eaton Ellipse ECO 650 USB DIN', 650, 400, 'Schuko'],
    ['Eaton Ellipse ECO 800 USB DIN', 800, 500, 'Schuko'],
    ['Eaton Ellipse ECO 1200 USB DIN', 1200, 750, 'Schuko'],
    ['Eaton Ellipse ECO 1600 USB DIN', 1600, 1000, 'Schuko'],
    ['Eaton Ellipse ECO 650 USB IEC', 650, 400, 'IEC C13'],
    ['Eaton Ellipse ECO 800 USB IEC', 800, 500, 'IEC C13'],
    ['Eaton Ellipse ECO 1200 USB IEC', 1200, 750, 'IEC C13'],
    ['Eaton Ellipse ECO 1600 USB IEC', 1600, 1000, 'IEC C13'],
  ]),
  ...line({ brand: E, family: 'Ellipse PRO', topo: AVR, iface: 'USB', tags: ['bureautique', 'homelab'], year: 2013 }, [
    ['Eaton Ellipse PRO 650 FR', 650, 400, 'FR'],
    ['Eaton Ellipse PRO 1200 FR', 1200, 750, 'FR'],
    ['Eaton Ellipse PRO 1600 FR', 1600, 1000, 'FR'],
    ['Eaton Ellipse PRO 650 DIN', 650, 400, 'Schuko'],
    ['Eaton Ellipse PRO 850 DIN', 850, 510, 'Schuko'],
    ['Eaton Ellipse PRO 1200 DIN', 1200, 750, 'Schuko'],
    ['Eaton Ellipse PRO 1600 DIN', 1600, 1000, 'Schuko'],
    ['Eaton Ellipse PRO 650 IEC', 650, 400, 'IEC C13'],
    ['Eaton Ellipse PRO 850 IEC', 850, 510, 'IEC C13'],
    ['Eaton Ellipse PRO 1200 IEC', 1200, 750, 'IEC C13'],
    ['Eaton Ellipse PRO 1600 IEC', 1600, 1000, 'IEC C13'],
  ]),
  ...line({ brand: E, family: 'Protection Station', topo: OFF, iface: 'USB', tags: HOME, year: 2012 }, [
    ['Eaton Protection Station 500 FR', 500, 250, 'FR'],
    ['Eaton Protection Station 650 FR', 650, 400, 'FR'],
    ['Eaton Protection Station 800 FR', 800, 500, 'FR'],
    ['Eaton Protection Station 500 DIN', 500, 250, 'Schuko'],
    ['Eaton Protection Station 650 DIN', 650, 400, 'Schuko'],
    ['Eaton Protection Station 800 DIN', 800, 500, 'Schuko'],
  ]),
  ...line({ brand: E, family: 'Ellipse MAX', topo: AVR, iface: 'USB', tags: HOME, prises: 'FR' }, [
    ['Eaton Ellipse MAX 600 FR', 600],
    ['Eaton Ellipse MAX 850 FR', 850],
    ['Eaton Ellipse MAX 1100 FR', 1100],
    ['Eaton Ellipse MAX 1500 FR', 1500],
  ]),
  ...line({ brand: E, family: 'Eaton 5110', topo: AVR, iface: 'USB, série', tags: ['bureautique', 'budget'], prises: 'IEC C13' }, [
    ['Eaton 5110 500', 500, 300],
    ['Eaton 5110 1000', 1000, 600],
    ['Eaton 5110 1500', 1500, 900],
  ]),
  ...line({ brand: E, family: 'Eaton 5130', topo: SIN, iface: 'USB, série', tags: ['pro', 'serveur', 'homelab'] }, [
    ['Eaton 5130 1250 Rack/Tower', 1250, 1150, 'IEC C13'],
    ['Eaton 5130 1750 Rack/Tower', 1750, 1600, 'IEC C13'],
    ['Eaton 5130 2500 Rack/Tower', 2500, 2250, 'IEC C13/C19'],
    ['Eaton 5130 3000 Rack/Tower', 3000, 2700, 'IEC C13/C19'],
  ]),
  ...line({ brand: E, family: 'Eaton 9130', topo: ONL, iface: 'USB, série', tags: ['pro', 'serveur', 'homelab'] }, [
    ['Eaton 9130 700 Tower', 700, 630, 'IEC C13'],
    ['Eaton 9130 1000 Tower', 1000, 900, 'IEC C13'],
    ['Eaton 9130 1500 Tower', 1500, 1350, 'IEC C13'],
    ['Eaton 9130 2000 Tower', 2000, 1800, 'IEC C13'],
    ['Eaton 9130 3000 Tower', 3000, 2700, 'IEC C13/C19'],
  ]),
  ...line({ brand: E, family: 'Evolution', topo: SIN, iface: 'USB, série', tags: ['pro', 'bureautique'], prises: 'IEC C13' }, [
    ['Eaton Evolution 650', 650, 420],
    ['Eaton Evolution 850', 850, 600],
    ['Eaton Evolution 1150', 1150, 770],
    ['Eaton Evolution 1550', 1550, 1100],
  ]),
];
