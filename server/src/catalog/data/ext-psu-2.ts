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

const S = 'Seasonic';
const M = 'MSI';
export const PRODUCTS: CatalogProduct[] = [
  // ─── Seasonic ───
  ...serie({ brand: S, family: 'S12III', year: 2019, cert: 'Bronze', mod: 'N', fan: '120 mm' }, 'Seasonic S12III-#', 'seasonic-s12iii-#', [[500, 55], [550, 60], [650, 70]]),
  ...serie({ brand: S, family: 'G12 GC', year: 2021, cert: 'Gold', mod: 'N', fan: '120 mm' }, 'Seasonic G12 GC-#', 'seasonic-g12-gc-#', [[550, 70], [650, 80], [750, 90], [850, 105]]),
  ...serie({ brand: S, family: 'G12 GM', year: 2021, cert: 'Gold', mod: 'S', fan: '120 mm' }, 'Seasonic G12 GM-#', 'seasonic-g12-gm-#', [[550, 80], [650, 90], [750, 100], [850, 115]]),
  ...serie({ brand: S, family: 'Core GC', year: 2021, cert: 'Gold', mod: 'N', fan: '120 mm' }, 'Seasonic Core GC-#', 'seasonic-core-gc-#', [[500, 65], [650, 75]]),
  ...serie({ brand: S, family: 'Core GM', year: 2021, cert: 'Gold', mod: 'S', fan: '120 mm' }, 'Seasonic Core GM-#', 'seasonic-core-gm-#', [[500, 70], [650, 85]]),
  ...serie({ brand: S, family: 'Focus Plus Gold', year: 2017, cert: 'Gold', mod: 'F', fan: '120 mm' }, 'Seasonic Focus Plus Gold #', 'seasonic-focus-plus-gold-#', [[550, 90], [650, 100], [750, 115], [850, 130]]),
  ...serie({ brand: S, family: 'Focus Plus Platinum', year: 2017, cert: 'Platinum', mod: 'F', fan: '120 mm' }, 'Seasonic Focus Plus Platinum #', 'seasonic-focus-plus-platinum-#', [[550, 110], [650, 120], [750, 135], [850, 150]]),
  ...serie({ brand: S, family: 'Focus GX', year: 2019, cert: 'Gold', mod: 'F', fan: '120 mm' }, 'Seasonic Focus GX-#', 'seasonic-focus-gx-#', [[550, 95], [650, 105], [750, 120], [850, 135], [1000, 180]]),
  ...serie({ brand: S, family: 'Focus GX', year: 2023, cert: 'Gold', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)', fan: '120 mm' }, 'Seasonic Focus GX-# ATX 3.0', 'seasonic-focus-gx-#-atx3', [[1000, 190]]),
  ...serie({ brand: S, family: 'Focus GM', year: 2019, cert: 'Gold', mod: 'S', fan: '120 mm' }, 'Seasonic Focus GM-#', 'seasonic-focus-gm-#', [[550, 85], [650, 95], [750, 110]]),
  ...serie({ brand: S, family: 'Focus PX', year: 2019, cert: 'Platinum', mod: 'F', fan: '120 mm' }, 'Seasonic Focus PX-#', 'seasonic-focus-px-#', [[550, 115], [650, 125], [750, 140], [850, 160]]),
  ...serie({ brand: S, family: 'Focus SGX', year: 2019, cert: 'Gold', mod: 'F', norme: 'SFX-L', fan: '120 mm' }, 'Seasonic Focus SGX-#', 'seasonic-focus-sgx-#', [[500, 120], [650, 140]]),
  ...serie({ brand: S, family: 'Prime TX', year: 2018, cert: 'Titanium', mod: 'F', fan: '135 mm' }, 'Seasonic Prime TX-#', 'seasonic-prime-tx-#', [[650, 200], [750, 220], [850, 250]]),
  ...serie({ brand: S, family: 'Prime TX', year: 2023, cert: 'Titanium', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)', fan: '135 mm' }, 'Seasonic Prime TX-#', 'seasonic-prime-tx-#', [[1300, 400], [1600, 500]]),
  ...serie({ brand: S, family: 'Prime PX', year: 2018, cert: 'Platinum', mod: 'F', fan: '135 mm' }, 'Seasonic Prime PX-#', 'seasonic-prime-px-#', [[650, 160], [750, 175], [850, 195], [1000, 240]]),
  ...serie({ brand: S, family: 'Prime PX', year: 2020, cert: 'Platinum', mod: 'F', fan: '135 mm' }, 'Seasonic Prime PX-#', 'seasonic-prime-px-#', [[1300, 300]]),
  ...serie({ brand: S, family: 'Prime PX', year: 2023, cert: 'Platinum', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)', fan: '135 mm' }, 'Seasonic Prime PX-#', 'seasonic-prime-px-#', [[1600, 450]]),
  ...serie({ brand: S, family: 'Prime GX', year: 2018, cert: 'Gold', mod: 'F', fan: '135 mm' }, 'Seasonic Prime GX-#', 'seasonic-prime-gx-#', [[650, 140], [750, 155], [850, 175], [1000, 210]]),
  ...serie({ brand: S, family: 'Prime GX', year: 2020, cert: 'Gold', mod: 'F', fan: '135 mm' }, 'Seasonic Prime GX-#', 'seasonic-prime-gx-#', [[1300, 270]]),
  ...serie({ brand: S, family: 'Prime Fanless', year: 2017, cert: 'Titanium', mod: 'F', fan: 'Passif (sans ventilateur)', tags: ['creation'] }, 'Seasonic Prime Fanless TX-#', 'seasonic-prime-fanless-tx-#', [[700, 270]]),
  ...serie({ brand: S, family: 'Prime Fanless', year: 2017, cert: 'Platinum', mod: 'F', fan: 'Passif (sans ventilateur)', tags: ['creation'] }, 'Seasonic Prime Fanless PX-#', 'seasonic-prime-fanless-px-#', [[450, 150], [500, 170]]),
  ...serie({ brand: S, family: 'Vertex GX', year: 2022, cert: 'Gold', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)' }, 'Seasonic Vertex GX-#', 'seasonic-vertex-gx-#', [[750, 150], [850, 170], [1200, 270]]),
  ...serie({ brand: S, family: 'Vertex PX', year: 2022, cert: 'Platinum', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)' }, 'Seasonic Vertex PX-#', 'seasonic-vertex-px-#', [[750, 170], [850, 190], [1000, 240]]),
  // ─── MSI ───
  ...serie({ brand: M, family: 'MAG A-BN', year: 2020, cert: 'Bronze', mod: 'N', fan: '120 mm' }, 'MSI MAG A#BN', 'msi-mag-a#bn', [[550, 55], [650, 65], [750, 75]]),
  ...serie({ brand: M, family: 'MPG A-GF', year: 2020, cert: 'Gold', mod: 'F', fan: '140 mm' }, 'MSI MPG A#GF', 'msi-mpg-a#gf', [[650, 100], [750, 115], [850, 135]]),
  ...serie({ brand: M, family: 'MAG A-GL', year: 2023, cert: 'Gold', mod: 'F', norme: 'ATX 3.0', fan: '120 mm' }, 'MSI MAG A#GL PCIE5', 'msi-mag-a#gl-pcie5', [[650, 85], [750, 100]]),
  ...serie({ brand: M, family: 'MPG A-G', year: 2022, cert: 'Gold', mod: 'F', norme: 'ATX 3.0', fan: '135 mm' }, 'MSI MPG A#G PCIE5', 'msi-mpg-a#g-pcie5', [[750, 140], [850, 160]]),
  ...serie({ brand: M, family: 'MEG Ai-P', year: 2022, cert: 'Platinum', mod: 'F', norme: 'ATX 3.0', fan: '135 mm' }, 'MSI MEG Ai#P PCIE5', 'msi-meg-ai#p-pcie5', [[1000, 280], [1300, 360]]),
];
