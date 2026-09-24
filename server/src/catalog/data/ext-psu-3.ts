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

const B = 'be quiet!';
const CM = 'Cooler Master';
const F = 'Fractal Design';
export const PRODUCTS: CatalogProduct[] = [
  // ─── be quiet! ───
  ...serie({ brand: B, family: 'System Power 9', year: 2018, cert: 'Bronze', mod: 'N', fan: '120 mm' }, 'be quiet! System Power 9 #W', 'be-quiet-system-power-9-#w', [[400, 45], [500, 55], [600, 65], [700, 75]]),
  ...serie({ brand: B, family: 'System Power 10', year: 2021, cert: 'Bronze', mod: 'N', fan: '120 mm' }, 'be quiet! System Power 10 #W', 'be-quiet-system-power-10-#w', [[450, 50], [550, 60], [650, 70], [750, 80]]),
  ...serie({ brand: B, family: 'Pure Power 11', year: 2018, cert: 'Gold', mod: 'N', fan: '120 mm' }, 'be quiet! Pure Power 11 #W', 'be-quiet-pure-power-11-#w', [[400, 60], [500, 70], [600, 80], [700, 90]]),
  ...serie({ brand: B, family: 'Pure Power 11 CM', year: 2018, cert: 'Gold', mod: 'S', fan: '120 mm' }, 'be quiet! Pure Power 11 CM #W', 'be-quiet-pure-power-11-cm-#w', [[500, 80], [600, 90], [700, 100]]),
  ...serie({ brand: B, family: 'Pure Power 11 FM', year: 2021, cert: 'Gold', mod: 'F', fan: '120 mm' }, 'be quiet! Pure Power 11 FM #W', 'be-quiet-pure-power-11-fm-#w', [[550, 90], [650, 100], [750, 115], [850, 130], [1000, 170]]),
  ...serie({ brand: B, family: 'Pure Power 12 M', year: 2022, cert: 'Gold', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)', fan: '120 mm' }, 'be quiet! Pure Power 12 M #W', 'be-quiet-pure-power-12-m-#w', [[550, 95], [650, 105], [850, 135], [1000, 170], [1200, 210]]),
  ...serie({ brand: B, family: 'Straight Power 11', year: 2018, cert: 'Gold', mod: 'F', fan: '135 mm' }, 'be quiet! Straight Power 11 #W', 'be-quiet-straight-power-11-#w', [[450, 95], [550, 105], [650, 115], [750, 130], [850, 145], [1000, 185]]),
  ...serie({ brand: B, family: 'Straight Power 11 Platinum', year: 2020, cert: 'Platinum', mod: 'F', fan: '135 mm' }, 'be quiet! Straight Power 11 Platinum #W', 'be-quiet-straight-power-11-platinum-#w', [[750, 150], [850, 165], [1000, 200], [1200, 240]]),
  ...serie({ brand: B, family: 'Straight Power 12', year: 2022, cert: 'Platinum', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)', fan: '135 mm' }, 'be quiet! Straight Power 12 #W', 'be-quiet-straight-power-12-#w', [[750, 160], [850, 180], [1200, 270], [1500, 330]]),
  ...serie({ brand: B, family: 'Dark Power 11', year: 2017, cert: 'Platinum', mod: '?', fan: '135 mm' }, 'be quiet! Dark Power 11 #W', 'be-quiet-dark-power-11-#w', [[550, 150], [650, 165], [750, 180], [850, 200], [1000, 240]]),
  ...serie({ brand: B, family: 'Dark Power 12', year: 2021, cert: 'Titanium', mod: 'F', fan: '135 mm' }, 'be quiet! Dark Power 12 #W', 'be-quiet-dark-power-12-#w', [[750, 230], [850, 250]]),
  ...serie({ brand: B, family: 'Dark Power 13', year: 2022, cert: 'Titanium', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)', fan: '135 mm' }, 'be quiet! Dark Power 13 #W', 'be-quiet-dark-power-13-#w', [[750, 240], [850, 270]]),
  ...serie({ brand: B, family: 'Dark Power Pro 11', year: 2016, cert: 'Platinum', mod: 'F', fan: '135 mm' }, 'be quiet! Dark Power Pro 11 #W', 'be-quiet-dark-power-pro-11-#w', [[1000, 250], [1200, 290]]),
  ...serie({ brand: B, family: 'Dark Power Pro 12', year: 2020, cert: 'Titanium', mod: 'F', fan: '135 mm' }, 'be quiet! Dark Power Pro 12 #W', 'be-quiet-dark-power-pro-12-#w', [[1200, 400], [1500, 470]]),
  ...serie({ brand: B, family: 'Dark Power Pro 13', year: 2023, cert: 'Titanium', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)', fan: '135 mm' }, 'be quiet! Dark Power Pro 13 #W', 'be-quiet-dark-power-pro-13-#w', [[1300, 470], [1600, 550]]),
  ...serie({ brand: B, family: 'Power Zone 2', year: 2023, cert: 'Platinum', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)', fan: '135 mm' }, 'be quiet! Power Zone 2 #W', 'be-quiet-power-zone-2-#w', [[750, 140], [850, 160], [1000, 190]]),
  ...serie({ brand: B, family: 'SFX L Power', year: 2017, cert: 'Gold', mod: 'F', norme: 'SFX-L', fan: '120 mm' }, 'be quiet! SFX L Power #W', 'be-quiet-sfx-l-power-#w', [[500, 100], [600, 120]]),
  ...serie({ brand: B, family: 'SFX Power 3', year: 2019, cert: 'Bronze', mod: 'N', norme: 'SFX', fan: '80 mm' }, 'be quiet! SFX Power 3 #W', 'be-quiet-sfx-power-3-#w', [[300, 60], [450, 75]]),
  // ─── Cooler Master ───
  ...serie({ brand: CM, family: 'MWE Bronze V2', year: 2020, cert: 'Bronze', mod: 'N', fan: '120 mm' }, 'Cooler Master MWE # Bronze V2', 'cooler-master-mwe-#-bronze-v2', [[450, 50], [550, 55], [650, 65], [750, 75]]),
  ...serie({ brand: CM, family: 'MWE White V2', year: 2020, cert: 'White', mod: 'N', fan: '120 mm' }, 'Cooler Master MWE # White V2', 'cooler-master-mwe-#-white-v2', [[450, 40], [550, 45], [650, 55]]),
  ...serie({ brand: CM, family: 'MWE Gold V2', year: 2020, cert: 'Gold', mod: 'F', fan: '120 mm' }, 'Cooler Master MWE Gold # V2 Full Modular', 'cooler-master-mwe-gold-#-v2-fm', [[650, 85], [750, 95], [850, 110], [1050, 160]]),
  ...serie({ brand: CM, family: 'V Gold V2', year: 2020, cert: 'Gold', mod: 'F', fan: '135 mm' }, 'Cooler Master V# Gold V2', 'cooler-master-v#-gold-v2', [[550, 95], [650, 105], [750, 120], [850, 135]]),
  ...serie({ brand: CM, family: 'V SFX Gold', year: 2019, cert: 'Gold', mod: 'F', norme: 'SFX', fan: '92 mm' }, 'Cooler Master V# SFX Gold', 'cooler-master-v#-sfx-gold', [[550, 110], [650, 125], [750, 140]]),
  ...serie({ brand: CM, family: 'V SFX Platinum', year: 2023, cert: 'Platinum', mod: 'F', norme: 'SFX', conn: 'Oui (12VHPWR)', fan: '92 mm' }, 'Cooler Master V# SFX Platinum', 'cooler-master-v#-sfx-platinum', [[1100, 280]]),
  ...serie({ brand: CM, family: 'V Platinum', year: 2019, cert: 'Platinum', mod: 'F', fan: '135 mm' }, 'Cooler Master V# Platinum', 'cooler-master-v#-platinum', [[1300, 300]]),
  ...serie({ brand: CM, family: 'GX III Gold', year: 2023, cert: 'Gold', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)' }, 'Cooler Master GX III Gold #', 'cooler-master-gx-iii-gold-#', [[750, 110], [850, 125]]),
  ...serie({ brand: CM, family: 'XG Plus Platinum', year: 2021, cert: 'Platinum', mod: 'F', fan: '135 mm' }, 'Cooler Master XG# Plus Platinum', 'cooler-master-xg#-plus-platinum', [[650, 160], [750, 180], [850, 200]]),
  ...serie({ brand: CM, family: 'MasterWatt', year: 2017, cert: 'Bronze', mod: 'S', fan: '120 mm' }, 'Cooler Master MasterWatt #', 'cooler-master-masterwatt-#', [[450, 60], [550, 70], [650, 80], [750, 90]]),
  // ─── Fractal Design ───
  ...serie({ brand: F, family: 'Ion+', year: 2018, cert: 'Platinum', mod: 'F', fan: '140 mm' }, 'Fractal Design Ion+ #P', 'fractal-design-ion-plus-#p', [[560, 120], [660, 135], [760, 150], [860, 170]]),
  ...serie({ brand: F, family: 'Ion+ 2', year: 2021, cert: 'Platinum', mod: 'F', fan: '140 mm' }, 'Fractal Design Ion+ 2 Platinum #W', 'fractal-design-ion-plus-2-platinum-#w', [[660, 140], [760, 155]]),
  ...serie({ brand: F, family: 'Ion Gold', year: 2021, cert: 'Gold', mod: 'F', fan: '140 mm' }, 'Fractal Design Ion Gold #', 'fractal-design-ion-gold-#', [[550, 95], [650, 105], [750, 120]]),
  ...serie({ brand: F, family: 'Ion SFX', year: 2020, cert: 'Gold', mod: 'F', norme: 'SFX' }, 'Fractal Design Ion SFX #G', 'fractal-design-ion-sfx-#g', [[500, 110], [650, 130]]),
  ...serie({ brand: F, family: 'Integra M', year: 2019, cert: 'Bronze', mod: 'S', fan: '120 mm' }, 'Fractal Design Integra M #W', 'fractal-design-integra-m-#w', [[450, 60], [550, 70], [650, 80], [750, 90]]),
];
