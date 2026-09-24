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

const SA = 'Salicru';
const IN = 'Infosec';
const PW = 'PowerWalker';
const SO = 'Socomec';
const HOME = ['bureautique', 'budget'];
const PRO = ['pro', 'serveur'];
const RACK = ['pro', 'serveur', 'homelab'];

/** Onduleurs Salicru, Infosec, PowerWalker (BlueWalker) et Socomec. */
export const PRODUCTS: CatalogProduct[] = [
  // ─── Salicru ───────────────────────────────────────────────────────────────
  ...line({ brand: SA, family: 'SPS ONE', topo: AVR, iface: 'USB', tags: HOME }, [
    ['Salicru SPS 500 ONE', 500],
    ['Salicru SPS 700 ONE', 700],
    ['Salicru SPS 900 ONE', 900],
    ['Salicru SPS 1100 ONE', 1100],
    ['Salicru SPS 1500 ONE', 1500],
    ['Salicru SPS 2000 ONE', 2000],
  ]),
  ...line({ brand: SA, family: 'SPS SOHO+', topo: AVR, iface: 'USB', tags: ['bureautique'] }, [
    ['Salicru SPS 500 SOHO+', 500],
    ['Salicru SPS 650 SOHO+', 650],
    ['Salicru SPS 850 SOHO+', 850],
    ['Salicru SPS 1200 SOHO+', 1200],
    ['Salicru SPS 1600 SOHO+', 1600],
  ]),
  ...line({ brand: SA, family: 'SPS ADVANCE RT2', topo: SIN, iface: 'USB, série', tags: RACK }, [
    ['Salicru SPS 800 ADV RT2', 800],
    ['Salicru SPS 1100 ADV RT2', 1100],
    ['Salicru SPS 1500 ADV RT2', 1500],
    ['Salicru SPS 2000 ADV RT2', 2000],
    ['Salicru SPS 3000 ADV RT2', 3000],
  ]),
  ...line({ brand: SA, family: 'SLC TWIN PRO2', topo: ONL, iface: 'USB, série', tags: PRO }, [
    ['Salicru SLC 700 TWIN PRO2', 700],
    ['Salicru SLC 1000 TWIN PRO2', 1000],
    ['Salicru SLC 1500 TWIN PRO2', 1500],
    ['Salicru SLC 2000 TWIN PRO2', 2000],
    ['Salicru SLC 3000 TWIN PRO2', 3000],
  ]),
  ...line({ brand: SA, family: 'SLC TWIN RT2', topo: ONL, iface: 'USB, série', tags: RACK }, [
    ['Salicru SLC 1000 TWIN RT2', 1000],
    ['Salicru SLC 1500 TWIN RT2', 1500],
    ['Salicru SLC 2000 TWIN RT2', 2000],
    ['Salicru SLC 3000 TWIN RT2', 3000],
  ]),

  // ─── Infosec ───────────────────────────────────────────────────────────────
  ...line({ brand: IN, family: 'E3 Neo', topo: AVR, iface: 'USB', tags: HOME, prises: 'FR' }, [
    ['Infosec E3 Neo 500 FR', 500],
    ['Infosec E3 Neo 650 FR', 650],
    ['Infosec E3 Neo 800 FR', 800],
  ]),
  ...line({ brand: IN, family: 'X3 EX', topo: ONL, iface: 'USB, série', tags: PRO }, [
    ['Infosec X3 EX 1000', 1000],
    ['Infosec X3 EX 2000', 2000],
    ['Infosec X3 EX 3000', 3000],
  ]),

  // ─── PowerWalker (BlueWalker) ──────────────────────────────────────────────
  ...line({ brand: PW, family: 'VI SB', topo: AVR, tags: HOME }, [
    ['PowerWalker VI 650 SB FR', 650, 360, 'FR'],
    ['PowerWalker VI 850 SB FR', 850, 480, 'FR'],
  ]),
  ...line({ brand: PW, family: 'VI SE', topo: AVR, iface: 'USB', tags: HOME, prises: 'IEC C13' }, [
    ['PowerWalker VI 650 SE', 650, 360],
    ['PowerWalker VI 850 SE', 850, 480],
  ]),
  ...line({ brand: PW, family: 'VI STL', topo: AVR, iface: 'USB', tags: HOME, prises: 'FR' }, [
    ['PowerWalker VI 600 STL FR', 600],
    ['PowerWalker VI 800 STL FR', 800],
  ]),
  ...line({ brand: PW, family: 'VI SHL', topo: AVR, iface: 'USB', tags: ['bureautique', 'homelab'], prises: 'FR' }, [
    ['PowerWalker VI 1200 SHL FR', 1200, 720],
    ['PowerWalker VI 2000 SHL FR', 2000, 1200],
  ]),
  ...line({ brand: PW, family: 'VI CSW', topo: SIN, iface: 'USB', tags: ['homelab', 'nas'], prises: 'FR' }, [
    ['PowerWalker VI 750 CSW FR', 750],
    ['PowerWalker VI 1000 CSW FR', 1000],
    ['PowerWalker VI 1500 CSW FR', 1500],
  ]),
  ...line({ brand: PW, family: 'VI RLE', topo: AVR, iface: 'USB, série', tags: RACK, prises: 'IEC C13' }, [
    ['PowerWalker VI 1000 RLE', 1000],
    ['PowerWalker VI 1500 RLE', 1500],
    ['PowerWalker VI 2000 RLE', 2000],
    ['PowerWalker VI 3000 RLE', 3000],
  ]),
  ...line({ brand: PW, family: 'VFI CG PF1', topo: ONL, iface: 'USB, série', tags: PRO }, [
    ['PowerWalker VFI 1000 CG PF1', 1000, 1000],
    ['PowerWalker VFI 2000 CG PF1', 2000, 2000],
    ['PowerWalker VFI 3000 CG PF1', 3000, 3000],
  ]),
  ...line({ brand: PW, family: 'VFI RMG PF1', topo: ONL, iface: 'USB, série', tags: RACK }, [
    ['PowerWalker VFI 1000 RMG PF1', 1000, 1000],
    ['PowerWalker VFI 2000 RMG PF1', 2000, 2000],
    ['PowerWalker VFI 3000 RMG PF1', 3000, 3000],
  ]),

  // ─── Socomec ───────────────────────────────────────────────────────────────
  ...line({ brand: SO, family: 'NeTYS PL', topo: OFF, tags: HOME, prises: 'FR' }, [
    ['Socomec NeTYS PL 600', 600],
    ['Socomec NeTYS PL 800', 800],
  ]),
  ...line({ brand: SO, family: 'NeTYS PE', topo: AVR, iface: 'USB', tags: ['bureautique'] }, [
    ['Socomec NeTYS PE 600', 600],
    ['Socomec NeTYS PE 850', 850],
    ['Socomec NeTYS PE 1500', 1500],
    ['Socomec NeTYS PE 2000', 2000],
  ]),
  ...line({ brand: SO, family: 'NeTYS PR', topo: SIN, iface: 'USB, série', tags: ['pro', 'homelab'] }, [
    ['Socomec NeTYS PR Tower 1000', 1000],
    ['Socomec NeTYS PR Tower 1500', 1500],
    ['Socomec NeTYS PR Tower 2200', 2200],
    ['Socomec NeTYS PR Tower 3000', 3000],
    ['Socomec NeTYS PR RT 1100', 1100],
    ['Socomec NeTYS PR RT 1700', 1700],
    ['Socomec NeTYS PR RT 2200', 2200],
    ['Socomec NeTYS PR RT 3000', 3000],
  ]),
  ...line({ brand: SO, family: 'NeTYS RT', topo: ONL, iface: 'USB, série', tags: RACK }, [
    ['Socomec NeTYS RT 1100', 1100],
    ['Socomec NeTYS RT 1700', 1700],
    ['Socomec NeTYS RT 2200', 2200],
    ['Socomec NeTYS RT 3000', 3000],
  ]),
  ...line({ brand: SO, family: 'ITYS', topo: ONL, iface: 'USB, série', tags: PRO }, [
    ['Socomec ITYS 1000', 1000],
    ['Socomec ITYS 2000', 2000],
    ['Socomec ITYS 3000', 3000],
    ['Socomec ITYS 6000', 6000],
    ['Socomec ITYS 10000', 10000],
  ]),
];
