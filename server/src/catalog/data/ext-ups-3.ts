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
const PRO = ['pro', 'serveur'];
const RACK = ['pro', 'serveur', 'homelab'];

/** Onduleurs Eaton : 3S, 5E (et Gen2), 5S, 5SC, 5P, 5PX, 9E, 9SX, 9PX. */
export const PRODUCTS: CatalogProduct[] = [
  ...line({ brand: E, family: 'Eaton 3S', topo: OFF, iface: 'USB', tags: ['bureautique', 'budget'], year: 2013 }, [
    ['Eaton 3S 450 FR', 450, 270, 'FR'],
    ['Eaton 3S 550 FR', 550, 330, 'FR'],
    ['Eaton 3S 700 FR', 700, 420, 'FR'],
    ['Eaton 3S 450 DIN', 450, 270, 'Schuko'],
    ['Eaton 3S 550 DIN', 550, 330, 'Schuko'],
    ['Eaton 3S 700 DIN', 700, 420, 'Schuko'],
  ]),
  ...line({ brand: E, family: 'Eaton 5E', topo: AVR, iface: 'USB', tags: ['bureautique', 'budget'], year: 2014 }, [
    ['Eaton 5E 500i', 500, 300, 'IEC C13'],
    ['Eaton 5E 650i', 650, 360, 'IEC C13'],
    ['Eaton 5E 1500i', 1500, 900, 'IEC C13'],
    ['Eaton 5E 2000i', 2000, 1200, 'IEC C13'],
    ['Eaton 5E 650i USB DIN', 650, 360, 'Schuko'],
    ['Eaton 5E 850i USB DIN', 850, 480, 'Schuko'],
    ['Eaton 5E 1100i USB DIN', 1100, 660, 'Schuko'],
    ['Eaton 5E 1500i USB DIN', 1500, 900, 'Schuko'],
  ]),
  ...line({ brand: E, family: 'Eaton 5E Gen2', topo: AVR, iface: 'USB', tags: ['bureautique', 'homelab'], year: 2022 }, [
    ['Eaton 5E 700 USB IEC Gen2 (5E700UI)', 700, 360, 'IEC C13'],
    ['Eaton 5E 900 USB IEC Gen2 (5E900UI)', 900, 480, 'IEC C13'],
    ['Eaton 5E 1200 USB IEC Gen2 (5E1200UI)', 1200, 660, 'IEC C13'],
    ['Eaton 5E 1600 USB IEC Gen2 (5E1600UI)', 1600, 900, 'IEC C13'],
    ['Eaton 5E 2200 USB IEC Gen2 (5E2200UI)', 2200, 1200, 'IEC C13'],
    ['Eaton 5E 900 USB DIN Gen2 (5E900UD)', 900, 480, 'Schuko'],
    ['Eaton 5E 1200 USB DIN Gen2 (5E1200UD)', 1200, 660, 'Schuko'],
    ['Eaton 5E 1600 USB DIN Gen2 (5E1600UD)', 1600, 900, 'Schuko'],
  ]),
  ...line({ brand: E, family: 'Eaton 5S', topo: AVR, iface: 'USB', tags: ['bureautique', 'homelab'], prises: 'IEC C13', year: 2013 }, [
    ['Eaton 5S 550i', 550, 330],
    ['Eaton 5S 1000i', 1000, 600],
  ]),
  ...line({ brand: E, family: 'Eaton 5SC', topo: SIN, iface: 'USB, série', tags: ['pro', 'homelab'], year: 2015 }, [
    ['Eaton 5SC 500i', 500, 350, 'IEC C13'],
    ['Eaton 5SC 750i', 750, 525, 'IEC C13'],
    ['Eaton 5SC 2200i', 2200, 1980, 'IEC C13/C19'],
    ['Eaton 5SC 3000i', 3000, 2700, 'IEC C13/C19'],
    ['Eaton 5SC 1000i Rack 2U (5SC1000IR)', 1000, undefined, 'IEC C13'],
    ['Eaton 5SC 1500i Rack 2U (5SC1500IR)', 1500, undefined, 'IEC C13'],
    ['Eaton 5SC 2200i Rack/Tower (5SC2200IRT)', 2200, 1980, 'IEC C13/C19'],
    ['Eaton 5SC 3000i Rack/Tower (5SC3000IRT)', 3000, 2700, 'IEC C13/C19'],
  ]),
  ...line({ brand: E, family: 'Eaton 5P', topo: SIN, iface: 'USB, série', tags: PRO, prises: 'IEC C13', year: 2012 }, [
    ['Eaton 5P 650i', 650, 420],
    ['Eaton 5P 850i', 850, 600],
    ['Eaton 5P 1150i', 1150, 770],
    ['Eaton 5P 1550i', 1550, 1100],
    ['Eaton 5P 650iR', 650, 420],
    ['Eaton 5P 850iR', 850, 600],
    ['Eaton 5P 1150iR', 1150, 770],
    ['Eaton 5P 1550iR', 1550, 1100],
  ]),
  ...line({ brand: E, family: 'Eaton 5P Gen2', topo: SIN, iface: 'USB, série', tags: PRO, prises: 'IEC C13', year: 2020 }, [
    ['Eaton 5P 650i G2', 650],
    ['Eaton 5P 850i G2', 850],
    ['Eaton 5P 1150i G2', 1150],
    ['Eaton 5P 1550i G2', 1550],
  ]),
  ...line({ brand: E, family: 'Eaton 5PX', topo: SIN, iface: 'USB, série', tags: RACK, year: 2012 }, [
    ['Eaton 5PX 1500i RT2U', 1500, 1350, 'IEC C13'],
    ['Eaton 5PX 2200i RT2U', 2200, 1980, 'IEC C13/C19'],
    ['Eaton 5PX 3000i RT2U', 3000, 2700, 'IEC C13/C19'],
    ['Eaton 5PX 3000i RT3U', 3000, 2700, 'IEC C13/C19'],
  ]),
  ...line({ brand: E, family: 'Eaton 5PX Gen2', topo: SIN, iface: 'USB, série', tags: RACK, year: 2019 }, [
    ['Eaton 5PX 1000i RT2U G2', 1000, 1000, 'IEC C13'],
    ['Eaton 5PX 1500i RT2U G2', 1500, 1500, 'IEC C13'],
    ['Eaton 5PX 2200i RT2U G2', 2200, 2200, 'IEC C13/C19'],
    ['Eaton 5PX 3000i RT2U G2', 3000, 3000, 'IEC C13/C19'],
  ]),
  ...line({ brand: E, family: 'Eaton 9E', topo: ONL, iface: 'USB, série', tags: PRO, year: 2016 }, [
    ['Eaton 9E 1000i', 1000, 800, 'IEC C13'],
    ['Eaton 9E 2000i', 2000, 1600, 'IEC C13'],
    ['Eaton 9E 3000i', 3000, 2400, 'IEC C13/C19'],
    ['Eaton 9E 6000i (9E6Ki)', 6000, 4800],
    ['Eaton 9E 10000i (9E10Ki)', 10000, 8000],
    ['Eaton 9E 1000iR', 1000, 800, 'IEC C13'],
    ['Eaton 9E 2000iR', 2000, 1600, 'IEC C13'],
    ['Eaton 9E 3000iR', 3000, 2400, 'IEC C13/C19'],
  ]),
  ...line({ brand: E, family: 'Eaton 9SX', topo: ONL, iface: 'USB, série', tags: PRO, year: 2016 }, [
    ['Eaton 9SX 700i', 700, 630, 'IEC C13'],
    ['Eaton 9SX 1000i', 1000, 900, 'IEC C13'],
    ['Eaton 9SX 1500i', 1500, 1350, 'IEC C13'],
    ['Eaton 9SX 2000i', 2000, 1800, 'IEC C13'],
    ['Eaton 9SX 3000i', 3000, 2700, 'IEC C13/C19'],
    ['Eaton 9SX 5000i (9SX5Ki)', 5000, 4500],
    ['Eaton 9SX 6000i (9SX6Ki)', 6000, 5400],
    ['Eaton 9SX 8000i (9SX8Ki)', 8000, 7200],
    ['Eaton 9SX 11000i (9SX11Ki)', 11000, 10000],
    ['Eaton 9SX 1000i Rack 2U (9SX1000IR)', 1000, 900, 'IEC C13'],
    ['Eaton 9SX 1500i Rack 2U (9SX1500IR)', 1500, 1350, 'IEC C13'],
    ['Eaton 9SX 2000i Rack 2U (9SX2000IR)', 2000, 1800, 'IEC C13'],
    ['Eaton 9SX 3000i Rack 2U (9SX3000IR)', 3000, 2700, 'IEC C13/C19'],
  ]),
  ...line({ brand: E, family: 'Eaton 9PX', topo: ONL, iface: 'USB, série', tags: RACK, year: 2013 }, [
    ['Eaton 9PX 1000i RT2U', 1000, 900, 'IEC C13'],
    ['Eaton 9PX 1500i RT2U', 1500, 1350, 'IEC C13'],
    ['Eaton 9PX 2200i RT2U', 2200, 1980, 'IEC C13/C19'],
    ['Eaton 9PX 3000i RT2U', 3000, 2700, 'IEC C13/C19'],
    ['Eaton 9PX 5000i RT3U (9PX5KiRT)', 5000, 4500],
    ['Eaton 9PX 6000i RT3U (9PX6KiRT)', 6000, 5400],
    ['Eaton 9PX 8000i RT6U (9PX8KiRT)', 8000, 7200],
    ['Eaton 9PX 11000i RT6U (9PX11KiRT)', 11000, 10000],
  ]),
];
