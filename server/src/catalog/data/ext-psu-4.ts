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

const E = 'EVGA';
const N = 'NZXT';
const T = 'Thermaltake';
export const PRODUCTS: CatalogProduct[] = [
  // ─── EVGA ───
  ...serie({ brand: E, family: 'N1 / W1', year: 2014, cert: 'Aucune', mod: 'N', fan: '120 mm' }, 'EVGA # N1', 'evga-#-n1', [[400, 40]]),
  ...serie({ brand: E, family: 'N1 / W1', year: 2014, cert: 'White', mod: 'N', fan: '120 mm' }, 'EVGA # W1', 'evga-#-w1', [[500, 45], [600, 55]]),
  ...serie({ brand: E, family: 'BR', year: 2016, cert: 'Bronze', mod: 'N', fan: '120 mm' }, 'EVGA # BR', 'evga-#-br', [[450, 45], [500, 50], [600, 60], [700, 70]]),
  ...serie({ brand: E, family: 'BQ', year: 2016, cert: 'Bronze', mod: 'S', fan: '120 mm' }, 'EVGA # BQ', 'evga-#-bq', [[500, 55], [600, 65], [650, 70], [750, 80], [850, 95]]),
  ...serie({ brand: E, family: 'SuperNOVA GQ', year: 2014, cert: 'Gold', mod: 'S', fan: '135 mm' }, 'EVGA SuperNOVA # GQ', 'evga-supernova-#-gq', [[650, 90], [750, 100], [850, 115], [1000, 160]]),
  ...serie({ brand: E, family: 'SuperNOVA B5', year: 2018, cert: 'Bronze', mod: 'F', fan: '135 mm' }, 'EVGA SuperNOVA # B5', 'evga-supernova-#-b5', [[550, 70], [650, 80], [750, 90], [850, 100]]),
  ...serie({ brand: E, family: 'SuperNOVA G2', year: 2013, cert: 'Gold', mod: 'F', fan: '140 mm' }, 'EVGA SuperNOVA # G2', 'evga-supernova-#-g2', [[550, 90], [650, 100], [750, 115], [850, 135], [1000, 180], [1300, 230], [1600, 300]]),
  ...serie({ brand: E, family: 'SuperNOVA G3', year: 2017, cert: 'Gold', mod: 'F', fan: '130 mm' }, 'EVGA SuperNOVA # G3', 'evga-supernova-#-g3', [[550, 95], [650, 105], [750, 120], [850, 140], [1000, 190]]),
  ...serie({ brand: E, family: 'SuperNOVA G5', year: 2019, cert: 'Gold', mod: 'F', fan: '135 mm' }, 'EVGA SuperNOVA # G5', 'evga-supernova-#-g5', [[650, 110], [750, 125], [850, 145], [1000, 190]]),
  ...serie({ brand: E, family: 'SuperNOVA G6', year: 2021, cert: 'Gold', mod: 'F', fan: '135 mm' }, 'EVGA SuperNOVA # G6', 'evga-supernova-#-g6', [[650, 115], [750, 130], [850, 150], [1000, 200]]),
  ...serie({ brand: E, family: 'SuperNOVA GT', year: 2021, cert: 'Gold', mod: 'F', fan: '135 mm' }, 'EVGA SuperNOVA # GT', 'evga-supernova-#-gt', [[650, 100], [750, 115], [850, 130], [1000, 175]]),
  ...serie({ brand: E, family: 'SuperNOVA GA', year: 2020, cert: 'Gold', mod: 'F', fan: '135 mm' }, 'EVGA SuperNOVA # GA', 'evga-supernova-#-ga', [[550, 90], [650, 100], [750, 115], [850, 130]]),
  ...serie({ brand: E, family: 'SuperNOVA GM', year: 2020, cert: 'Gold', mod: 'F', norme: 'SFX', fan: '92 mm' }, 'EVGA SuperNOVA # GM', 'evga-supernova-#-gm', [[450, 100], [550, 115], [650, 130]]),
  ...serie({ brand: E, family: 'SuperNOVA P2', year: 2014, cert: 'Platinum', mod: 'F', fan: '140 mm' }, 'EVGA SuperNOVA # P2', 'evga-supernova-#-p2', [[650, 130], [750, 145], [850, 165], [1000, 210], [1200, 260], [1600, 350]]),
  ...serie({ brand: E, family: 'SuperNOVA P6', year: 2021, cert: 'Platinum', mod: 'F', fan: '135 mm' }, 'EVGA SuperNOVA # P6', 'evga-supernova-#-p6', [[650, 130], [750, 145], [850, 165]]),
  ...serie({ brand: E, family: 'SuperNOVA T2', year: 2014, cert: 'Titanium', mod: 'F', fan: '140 mm' }, 'EVGA SuperNOVA # T2', 'evga-supernova-#-t2', [[750, 200], [850, 230], [1000, 270], [1600, 420]]),
  // ─── NZXT ───
  ...serie({ brand: N, family: 'E', year: 2017, cert: 'Gold', mod: 'F', fan: '120 mm' }, 'NZXT E#', 'nzxt-e#', [[500, 125], [650, 145], [850, 175]]),
  ...serie({ brand: N, family: 'C Gold', year: 2019, cert: 'Gold', mod: 'F', fan: '135 mm' }, 'NZXT C# Gold (2019)', 'nzxt-c#-gold-2019', [[650, 100], [750, 115], [850, 130]]),
  ...serie({ brand: N, family: 'C Gold V2', year: 2022, cert: 'Gold', mod: 'F', fan: '135 mm' }, 'NZXT C# Gold V2', 'nzxt-c#-gold-v2', [[650, 100], [750, 115], [850, 130]]),
  ...serie({ brand: N, family: 'C Gold', year: 2024, cert: 'Gold', mod: 'F', norme: 'ATX 3.1', fan: '120 mm' }, 'NZXT C# Gold (ATX 3.1)', 'nzxt-c#-gold-atx31', [[850, 130], [1000, 170], [1200, 210]]),
  ...serie({ brand: N, family: 'C Platinum', year: 2023, cert: 'Platinum', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)', fan: '140 mm' }, 'NZXT C# Platinum', 'nzxt-c#-platinum', [[1500, 400]]),
  // ─── Thermaltake ───
  ...serie({ brand: T, family: 'Smart', year: 2014, cert: 'White', mod: 'N', fan: '120 mm' }, 'Thermaltake Smart #W', 'thermaltake-smart-#w', [[430, 40], [500, 45], [600, 55], [700, 65]]),
  ...serie({ brand: T, family: 'Smart BX1', year: 2018, cert: 'Bronze', mod: 'N', fan: '120 mm' }, 'Thermaltake Smart BX1 #W', 'thermaltake-smart-bx1-#w', [[550, 55], [650, 65], [750, 75]]),
  ...serie({ brand: T, family: 'Smart RGB', year: 2017, cert: 'White', mod: 'N', fan: '120 mm RGB' }, 'Thermaltake Smart RGB #W', 'thermaltake-smart-rgb-#w', [[500, 50], [600, 60], [700, 70]]),
  ...serie({ brand: T, family: 'Toughpower GF1', year: 2019, cert: 'Gold', mod: 'F', fan: '140 mm' }, 'Thermaltake Toughpower GF1 #W', 'thermaltake-toughpower-gf1-#w', [[650, 100], [750, 115], [850, 130], [1000, 170]]),
  ...serie({ brand: T, family: 'Toughpower GF3', year: 2022, cert: 'Gold', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)' }, 'Thermaltake Toughpower GF3 #W', 'thermaltake-toughpower-gf3-#w', [[750, 130], [850, 150], [1000, 190], [1200, 240], [1350, 280], [1650, 350]]),
  ...serie({ brand: T, family: 'Toughpower GF A3', year: 2023, cert: 'Gold', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)' }, 'Thermaltake Toughpower GF A3 #W', 'thermaltake-toughpower-gf-a3-#w', [[650, 95], [750, 105], [850, 120], [1050, 160], [1200, 200]]),
  ...serie({ brand: T, family: 'Toughpower PF1', year: 2020, cert: 'Platinum', mod: 'F', fan: '140 mm' }, 'Thermaltake Toughpower PF1 #W', 'thermaltake-toughpower-pf1-#w', [[750, 160], [850, 180], [1050, 230], [1200, 270]]),
];
