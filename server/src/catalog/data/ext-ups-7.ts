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
    if (l.topo) specs['Topologie'] = l.topo;
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

const VE = 'Vertiv';
const TL = 'Tripp Lite';
const HOME = ['bureautique', 'budget'];
const PRO = ['pro', 'serveur'];
const RACK = ['pro', 'serveur', 'homelab'];

/** Onduleurs Vertiv Liebert, Tripp Lite, Ubiquiti UniFi et marques d'entrée de gamme (Green Cell, Armac, NJOY, FSP). */
export const PRODUCTS: CatalogProduct[] = [
  // ─── Vertiv Liebert ────────────────────────────────────────────────────────
  ...line({ brand: VE, family: 'Liebert PSA', topo: AVR, iface: 'USB', tags: HOME, prises: 'Schuko', year: 2017 }, [
    ['Vertiv Liebert PSA 500 VA (PSA500MT3-230U)', 500, 300],
    ['Vertiv Liebert PSA 650 VA (PSA650MT3-230U)', 650, 390],
    ['Vertiv Liebert PSA 1000 VA (PSA1000MT3-230U)', 1000, 600],
    ['Vertiv Liebert PSA 1500 VA (PSA1500MT3-230U)', 1500, 900],
  ]),
  ...line({ brand: VE, family: 'Liebert itON', topo: AVR, tags: HOME, year: 2017 }, [
    ['Vertiv Liebert itON 600 VA', 600],
    ['Vertiv Liebert itON 800 VA', 800],
  ]),
  ...line({ brand: VE, family: 'Liebert EDGE', topo: SIN, iface: 'USB, série', tags: ['pro', 'homelab'], prises: 'IEC C13', year: 2020 }, [
    ['Vertiv Liebert EDGE 750 VA (EDGE-750IMT)', 750],
    ['Vertiv Liebert EDGE 1000 VA (EDGE-1000IMT)', 1000],
    ['Vertiv Liebert EDGE 1500 VA (EDGE-1500IMT)', 1500],
  ]),
  ...line({ brand: VE, family: 'Liebert PSI5', topo: SIN, iface: 'USB, série', tags: RACK, prises: 'IEC C13', year: 2019 }, [
    ['Vertiv Liebert PSI5 750 VA Rack/Tower (PSI5-750RT230)', 750, 675],
    ['Vertiv Liebert PSI5 1100 VA Rack/Tower (PSI5-1100RT230)', 1100, 990],
    ['Vertiv Liebert PSI5 1500 VA Rack/Tower (PSI5-1500RT230)', 1500, 1350],
    ['Vertiv Liebert PSI5 2200 VA Rack/Tower (PSI5-2200RT230)', 2200, 1980],
    ['Vertiv Liebert PSI5 3000 VA Rack/Tower (PSI5-3000RT230)', 3000, 2700],
  ]),
  ...line({ brand: VE, family: 'Liebert GXT4', topo: ONL, iface: 'USB, série', tags: RACK }, [
    ['Vertiv Liebert GXT4 700 VA (GXT4-700RT230E)', 700],
    ['Vertiv Liebert GXT4 1000 VA (GXT4-1000RT230E)', 1000],
    ['Vertiv Liebert GXT4 1500 VA (GXT4-1500RT230E)', 1500],
    ['Vertiv Liebert GXT4 2000 VA (GXT4-2000RT230E)', 2000],
    ['Vertiv Liebert GXT4 3000 VA (GXT4-3000RT230E)', 3000],
  ]),
  ...line({ brand: VE, family: 'Liebert GXT5', topo: ONL, iface: 'USB, série, carte réseau', tags: RACK, year: 2018 }, [
    ['Vertiv Liebert GXT5 1000 VA (GXT5-1000IRT2UXL)', 1000, 1000, 'IEC C13'],
    ['Vertiv Liebert GXT5 1500 VA (GXT5-1500IRT2UXL)', 1500, 1500, 'IEC C13'],
    ['Vertiv Liebert GXT5 2000 VA (GXT5-2000IRT2UXL)', 2000, 2000, 'IEC C13'],
    ['Vertiv Liebert GXT5 3000 VA (GXT5-3000IRT2UXL)', 3000, 3000, 'IEC C13/C19'],
    ['Vertiv Liebert GXT5 5000 VA (GXT5-5000IRT5UXLE)', 5000, 5000],
    ['Vertiv Liebert GXT5 6000 VA (GXT5-6000IRT5UXLE)', 6000, 6000],
  ]),

  // ─── Tripp Lite ────────────────────────────────────────────────────────────
  ...line({ brand: TL, family: 'SmartPro', topo: SIN, iface: 'USB, série', tags: PRO }, [
    ['Tripp Lite SmartPro SMART1500LCDT', 1500, 900],
    ['Tripp Lite SmartPro SMART1500LCD', 1500, 900],
    ['Tripp Lite SmartPro SMART1500RM2U', 1500],
    ['Tripp Lite SmartPro SMART3000RM2U', 3000],
    ['Tripp Lite SmartPro SMX1500LCDT', 1500],
    ['Tripp Lite SmartPro SMX1500RM2U', 1500],
  ]),
  ...line({ brand: TL, family: 'SmartOnline', topo: ONL, iface: 'USB, série', tags: RACK }, [
    ['Tripp Lite SmartOnline SU1500RTXLCD2U', 1500],
    ['Tripp Lite SmartOnline SU2200RTXLCD2U', 2200],
    ['Tripp Lite SmartOnline SU3000RTXLCD3U', 3000],
  ]),
  ...line({ brand: TL, family: 'OmniVS', topo: AVR, iface: 'USB', tags: ['bureautique'] }, [
    ['Tripp Lite OmniVS OMNIVS1500', 1500, 940],
  ]),

  // ─── Ubiquiti ──────────────────────────────────────────────────────────────
  ...line({ brand: 'Ubiquiti', family: 'UniFi UPS', topo: '', tags: ['reseau', 'homelab', 'pro'], year: 2024, refurb: false }, [
    ['Ubiquiti UniFi UPS 2U (UPS-2U)', 1500],
    ['Ubiquiti UniFi UPS Tower (UPS-Tower)', 1500],
  ]),

  // ─── Entrée de gamme ───────────────────────────────────────────────────────
  ...line({ brand: 'Green Cell', family: 'Green Cell UPS', topo: AVR, iface: 'USB', tags: HOME, prises: 'Schuko', refurb: false }, [
    ['Green Cell UPS01LCD 600 VA', 600, 360],
    ['Green Cell UPS02 800 VA', 800, 480],
    ['Green Cell UPS03 1000 VA', 1000, 600],
    ['Green Cell UPS04 1500 VA', 1500, 900],
  ]),
  ...line({ brand: 'Armac', family: 'Armac Home / Office', topo: AVR, tags: HOME, prises: 'Schuko', refurb: false }, [
    ['Armac Home H/650E/LED', 650],
    ['Armac Home H/850E/LED', 850],
    ['Armac Office O/1000E/LCD', 1000],
    ['Armac Office O/1500E/LCD', 1500],
  ]),
  ...line({ brand: 'NJOY', family: 'NJOY', topo: AVR, iface: 'USB', tags: HOME, refurb: false }, [
    ['NJOY Keen 600 USB', 600],
    ['NJOY Keen 800 USB', 800],
    ['NJOY Horus Plus 1000', 1000],
    ['NJOY Horus Plus 1500', 1500],
    ['NJOY Horus Plus 2000', 2000],
  ]),
  ...line({ brand: 'FSP', family: 'FSP Champ', topo: ONL, iface: 'USB, série', tags: PRO, refurb: false }, [
    ['FSP Champ 1K Tower', 1000],
    ['FSP Champ 2K Tower', 2000],
    ['FSP Champ 3K Tower', 3000],
  ]),
];
