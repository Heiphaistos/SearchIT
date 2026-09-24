import type { CatalogProduct } from '../types.js';

/** Alimentations : un produit par puissance. Clé omise quand la valeur n'est pas certaine. */
type Mod = 'F' | 'S' | 'N' | '?';
interface Serie { brand: string; family: string; year: number; cert: string; mod: Mod; norme?: string; conn?: string; fan?: string; tags?: string[] }
/** [puissance, prix de lancement, jeton remplaçant « # » (défaut : la puissance)] */
type Item = number | [number, number?, string?];
const MOD: Record<string, string> = { F: 'Entièrement modulaire', S: 'Semi-modulaire', N: 'Non modulaire' };

function serie(s: Serie, name: string, id: string, items: Item[]): CatalogProduct[] {
  return items.map((it) => {
    const [w, msrp, tok] = typeof it === 'number' ? [it, undefined, undefined] : it;
    const t = tok ?? String(w);
    const specs: Record<string, string | number> = { 'Puissance': `${w} W` };
    specs['Certification'] = s.cert === 'Aucune' ? 'Non certifiée' : s.cert === 'White' ? '80 PLUS' : `80 PLUS ${s.cert}`;
    if (s.mod !== '?') specs['Modulaire'] = MOD[s.mod];
    const norme = s.norme ?? 'ATX12V';
    specs['Norme'] = norme;
    specs['Connecteur 12V-2x6'] = s.conn ?? (norme.startsWith('ATX 3') ? 'Oui' : 'Non');
    if (s.fan) specs['Ventilateur'] = s.fan;
    const low = ['Aucune', 'White', 'Bronze'].includes(s.cert);
    const tags = new Set<string>(s.tags ?? []);
    if (w <= 550 || low) tags.add('bureautique');
    if (low) tags.add('budget');
    if (w >= 550) tags.add('gaming');
    if (w >= 1000) tags.add('creation');
    if (w >= 1200) tags.add('ia');
    if (norme.startsWith('SFX')) tags.add('homelab');
    const p: CatalogProduct = {
      id: 'psu-' + id.replace(/#/g, t.toLowerCase()),
      category: 'psu',
      brand: s.brand,
      name: name.replace(/#/g, t),
      family: s.family,
      year: s.year,
      refurbishable: s.year <= 2022,
      specs,
      tags: [...tags],
    };
    if (msrp) p.msrp = msrp;
    return p;
  });
}

const C = 'Corsair';
export const PRODUCTS: CatalogProduct[] = [
  ...serie({ brand: C, family: 'CV', year: 2021, cert: 'Bronze', mod: 'N', fan: '120 mm' }, 'Corsair CV#', 'corsair-cv#', [[450, 50], [550, 60], [650, 70], [750, 80]]),
  ...serie({ brand: C, family: 'CX', year: 2017, cert: 'Bronze', mod: 'N', fan: '120 mm' }, 'Corsair CX# (2017)', 'corsair-cx#-2017', [[450, 55], [550, 65], [650, 75], [750, 90]]),
  ...serie({ brand: C, family: 'CX-M', year: 2015, cert: 'Bronze', mod: 'S', fan: '120 mm' }, 'Corsair CX#M', 'corsair-cx#m', [[450, 60], [550, 70], [650, 80], [750, 95]]),
  ...serie({ brand: C, family: 'CX-F RGB', year: 2020, cert: 'Bronze', mod: 'F', fan: '120 mm RGB' }, 'Corsair CX#F RGB', 'corsair-cx#f-rgb', [[550, 80], [650, 90], [750, 100]]),
  ...serie({ brand: C, family: 'VS', year: 2018, cert: 'White', mod: 'N', fan: '120 mm' }, 'Corsair VS#', 'corsair-vs#', [[450, 45], [550, 50], [650, 60]]),
  ...serie({ brand: C, family: 'TX-M', year: 2017, cert: 'Gold', mod: 'S', fan: '120 mm' }, 'Corsair TX#M', 'corsair-tx#m', [[550, 85], [650, 95], [750, 110], [850, 125]]),
  ...serie({ brand: C, family: 'RM', year: 2013, cert: 'Gold', mod: 'F' }, 'Corsair RM# (2013)', 'corsair-rm#-2013', [[450, 90], [550, 100], [650, 110], [750, 125], [850, 145], [1000, 190]]),
  ...serie({ brand: C, family: 'RMx', year: 2018, cert: 'Gold', mod: 'F', fan: '135 mm' }, 'Corsair RM#x (2018)', 'corsair-rm#x-2018', [[550, 100], [650, 110], [750, 125], [850, 145]]),
  ...serie({ brand: C, family: 'RMx', year: 2019, cert: 'Gold', mod: 'F', fan: '135 mm' }, 'Corsair RM#x White', 'corsair-rm#x-white', [[750, 135], [850, 155]]),
  ...serie({ brand: C, family: 'RMx', year: 2021, cert: 'Gold', mod: 'F', fan: '135 mm' }, 'Corsair RM#x (2021)', 'corsair-rm#x-2021', [[550, 100], [650, 115], [750, 130], [850, 150], [1000, 190]]),
  ...serie({ brand: C, family: 'RMx', year: 2024, cert: 'Gold', mod: 'F', norme: 'ATX 3.1', fan: '135 mm' }, 'Corsair RM#x (ATX 3.1)', 'corsair-rm#x-2024', [[750, 135]]),
  ...serie({ brand: C, family: 'RMx Shift', year: 2023, cert: 'Gold', mod: 'F', norme: 'ATX 3.0', fan: '140 mm' }, 'Corsair RM#x Shift', 'corsair-rm#x-shift', [[750, 160], [850, 180], [1000, 220], [1200, 260]]),
  ...serie({ brand: C, family: 'RMe', year: 2024, cert: 'Gold', mod: 'F', norme: 'ATX 3.1', fan: '120 mm' }, 'Corsair RM#e (ATX 3.1)', 'corsair-rm#e-2024', [[650, 95], [750, 110], [850, 125], [1000, 170]]),
  ...serie({ brand: C, family: 'RMi', year: 2016, cert: 'Gold', mod: 'F', fan: '135 mm' }, 'Corsair RM#i', 'corsair-rm#i', [[650, 130], [750, 145], [850, 165], [1000, 210]]),
  ...serie({ brand: C, family: 'HX', year: 2017, cert: 'Platinum', mod: 'F', fan: '135 mm' }, 'Corsair HX# (2017)', 'corsair-hx#-2017', [[750, 160], [850, 180], [1000, 220], [1200, 260]]),
  ...serie({ brand: C, family: 'HXi', year: 2017, cert: 'Platinum', mod: 'F', fan: '135 mm' }, 'Corsair HX#i (2017)', 'corsair-hx#i-2017', [[750, 180], [850, 200], [1000, 240], [1200, 290]]),
  ...serie({ brand: C, family: 'HXi', year: 2022, cert: 'Platinum', mod: 'F', norme: 'ATX 3.0', fan: '140 mm' }, 'Corsair HX#i (2022)', 'corsair-hx#i-2022', [[1000, 280], [1200, 330]]),
  ...serie({ brand: C, family: 'AXi', year: 2013, cert: 'Platinum', mod: 'F', fan: '140 mm' }, 'Corsair AX#i', 'corsair-ax#i', [[760, 200], [860, 230]]),
  ...serie({ brand: C, family: 'AXi', year: 2012, cert: 'Platinum', mod: 'F', fan: '140 mm' }, 'Corsair AX#i', 'corsair-ax#i', [[1200, 330]]),
  ...serie({ brand: C, family: 'AXi', year: 2014, cert: 'Titanium', mod: 'F', fan: '140 mm' }, 'Corsair AX#i', 'corsair-ax#i', [[1500, 450]]),
  ...serie({ brand: C, family: 'AXi', year: 2018, cert: 'Titanium', mod: 'F', fan: '140 mm' }, 'Corsair AX#i', 'corsair-ax#i', [[1600, 500]]),
  ...serie({ brand: C, family: 'SF', year: 2017, cert: 'Gold', mod: 'F', norme: 'SFX', fan: '92 mm' }, 'Corsair SF# Gold', 'corsair-sf#-gold', [[450, 100], [600, 120]]),
  ...serie({ brand: C, family: 'SF', year: 2019, cert: 'Platinum', mod: 'F', norme: 'SFX', fan: '92 mm' }, 'Corsair SF# Platinum', 'corsair-sf#-platinum', [[600, 140]]),
  ...serie({ brand: C, family: 'SF', year: 2024, cert: 'Platinum', mod: 'F', norme: 'SFX', conn: 'Oui', fan: '92 mm' }, 'Corsair SF# (ATX 3.1)', 'corsair-sf#-2024', [[1000, 260]]),
  ...serie({ brand: C, family: 'SF-L', year: 2022, cert: 'Gold', mod: 'F', norme: 'SFX-L', fan: '120 mm' }, 'Corsair SF#L', 'corsair-sf#l', [[850, 180], [1000, 220]]),
];
