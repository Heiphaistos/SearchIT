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

const AN = 'Antec';
const AS = 'ASUS';
const G = 'Gigabyte';
const D = 'DeepCool';
const FS = 'FSP';
const LL = 'Lian Li';
const SF = 'Super Flower';
export const PRODUCTS: CatalogProduct[] = [
  // ─── Antec ───
  ...serie({ brand: AN, family: 'VP Plus', year: 2019, cert: 'White', mod: 'N', fan: '120 mm' }, 'Antec VP#P Plus', 'antec-vp#p-plus', [[450, 40], [500, 45], [550, 50], [600, 55]]),
  ...serie({ brand: AN, family: 'Earthwatts Gold Pro', year: 2019, cert: 'Gold', mod: 'S', fan: '120 mm' }, 'Antec EA#G Pro', 'antec-ea#g-pro', [[550, 75], [650, 85], [750, 95]]),
  ...serie({ brand: AN, family: 'High Current Gamer Gold', year: 2017, cert: 'Gold', mod: 'F', fan: '135 mm' }, 'Antec HCG# Gold', 'antec-hcg#-gold', [[650, 100], [750, 115], [850, 130]]),
  ...serie({ brand: AN, family: 'Signature', year: 2021, cert: 'Titanium', mod: 'F', fan: '135 mm' }, 'Antec Signature ST#', 'antec-signature-st#', [[1000, 300]]),
  ...serie({ brand: AN, family: 'Signature', year: 2021, cert: 'Platinum', mod: 'F', fan: '135 mm' }, 'Antec Signature SP#', 'antec-signature-sp#', [[1300, 330]]),
  // ─── ASUS ───
  ...serie({ brand: AS, family: 'ROG Thor', year: 2019, cert: 'Platinum', mod: 'F', fan: '135 mm' }, 'ASUS ROG Thor #P', 'asus-rog-thor-#p', [[850, 230], [1200, 330]]),
  ...serie({ brand: AS, family: 'ROG Thor II', year: 2022, cert: 'Platinum', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)', fan: '135 mm' }, 'ASUS ROG Thor #P2', 'asus-rog-thor-#p2', [[1000, 330], [1200, 380]]),
  ...serie({ brand: AS, family: 'ROG Thor II', year: 2023, cert: 'Titanium', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)', fan: '135 mm' }, 'ASUS ROG Thor #T', 'asus-rog-thor-#t', [[1600, 580]]),
  ...serie({ brand: AS, family: 'ROG Strix Gold', year: 2020, cert: 'Gold', mod: 'F', fan: '135 mm' }, 'ASUS ROG Strix #G', 'asus-rog-strix-#g', [[550, 110], [650, 125], [750, 140], [850, 160]]),
  ...serie({ brand: AS, family: 'ROG Strix Gold Aura', year: 2023, cert: 'Gold', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)', fan: '135 mm' }, 'ASUS ROG Strix #W Gold Aura Edition', 'asus-rog-strix-#w-gold-aura', [[1000, 230], [1200, 270]]),
  ...serie({ brand: AS, family: 'ROG Loki', year: 2022, cert: 'Platinum', mod: 'F', norme: 'SFX-L', conn: 'Oui (12VHPWR)', fan: '120 mm' }, 'ASUS ROG Loki SFX-L #W Platinum', 'asus-rog-loki-sfx-l-#w-platinum', [[750, 200], [850, 230], [1000, 280]]),
  ...serie({ brand: AS, family: 'ROG Loki', year: 2022, cert: 'Titanium', mod: 'F', norme: 'SFX-L', conn: 'Oui (12VHPWR)', fan: '120 mm' }, 'ASUS ROG Loki SFX-L #W Titanium', 'asus-rog-loki-sfx-l-#w-titanium', [[1200, 380]]),
  ...serie({ brand: AS, family: 'TUF Gaming Bronze', year: 2021, cert: 'Bronze', mod: 'N', fan: '135 mm' }, 'ASUS TUF Gaming #B', 'asus-tuf-gaming-#b', [[550, 65], [650, 75], [750, 85]]),
  ...serie({ brand: AS, family: 'TUF Gaming Gold', year: 2023, cert: 'Gold', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)', fan: '135 mm' }, 'ASUS TUF Gaming #W Gold', 'asus-tuf-gaming-#w-gold', [[750, 120], [850, 135], [1000, 180], [1200, 220]]),
  // ─── Gigabyte ───
  ...serie({ brand: G, family: 'P-B', year: 2019, cert: 'Bronze', mod: 'N', fan: '120 mm' }, 'Gigabyte P#B', 'gigabyte-p#b', [[450, 45], [550, 55], [650, 65]]),
  ...serie({ brand: G, family: 'P-GM', year: 2019, cert: 'Gold', mod: 'F', fan: '120 mm' }, 'Gigabyte P#GM', 'gigabyte-p#gm', [[750, 100], [850, 115]]),
  ...serie({ brand: G, family: 'UD-GM PG5', year: 2022, cert: 'Gold', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)', fan: '120 mm' }, 'Gigabyte UD#GM PG5', 'gigabyte-ud#gm-pg5', [[750, 110], [850, 125], [1000, 170], [1300, 230]]),
  ...serie({ brand: G, family: 'AORUS', year: 2020, cert: 'Gold', mod: 'F', fan: '135 mm' }, 'Gigabyte AORUS P#W', 'gigabyte-aorus-p#w', [[850, 170]]),
  ...serie({ brand: G, family: 'AORUS', year: 2020, cert: 'Platinum', mod: 'F', fan: '135 mm' }, 'Gigabyte AORUS P#W', 'gigabyte-aorus-p#w', [[1200, 280]]),
  // ─── DeepCool ───
  ...serie({ brand: D, family: 'PK-D', year: 2021, cert: 'Bronze', mod: 'N', fan: '120 mm' }, 'DeepCool PK#D', 'deepcool-pk#d', [[450, 45], [550, 50], [650, 60], [750, 70]]),
  ...serie({ brand: D, family: 'PQ-M', year: 2021, cert: 'Gold', mod: 'F', fan: '120 mm' }, 'DeepCool PQ#M', 'deepcool-pq#m', [[650, 90], [750, 100], [850, 115], [1000, 150]]),
  ...serie({ brand: D, family: 'PX-G', year: 2023, cert: 'Gold', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)', fan: '120 mm' }, 'DeepCool PX#G', 'deepcool-px#g', [[850, 120], [1000, 150], [1200, 190]]),
  ...serie({ brand: D, family: 'PX-P', year: 2023, cert: 'Platinum', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)', fan: '135 mm' }, 'DeepCool PX#P', 'deepcool-px#p', [[1300, 250]]),
  ...serie({ brand: D, family: 'DQ-M-V2L', year: 2019, cert: 'Gold', mod: 'F', fan: '120 mm' }, 'DeepCool DQ#-M-V2L', 'deepcool-dq#-m-v2l', [[650, 90], [750, 100], [850, 115]]),
  ...serie({ brand: D, family: 'PN-M', year: 2024, cert: 'Gold', mod: 'F', norme: 'ATX 3.1', fan: '120 mm' }, 'DeepCool PN#M', 'deepcool-pn#m', [[650, 80], [750, 90], [850, 105]]),
  // ─── FSP ───
  ...serie({ brand: FS, family: 'Hydro G Pro', year: 2019, cert: 'Gold', mod: 'F', fan: '135 mm' }, 'FSP Hydro G Pro #W', 'fsp-hydro-g-pro-#w', [[650, 100], [750, 115], [850, 130], [1000, 170]]),
  ...serie({ brand: FS, family: 'Hydro PTM Pro', year: 2020, cert: 'Platinum', mod: 'F', fan: '135 mm' }, 'FSP Hydro PTM Pro #W', 'fsp-hydro-ptm-pro-#w', [[850, 170], [1000, 210], [1200, 250]]),
  ...serie({ brand: FS, family: 'Dagger Pro', year: 2019, cert: 'Gold', mod: 'F', norme: 'SFX', fan: '92 mm' }, 'FSP Dagger Pro #W', 'fsp-dagger-pro-#w', [[550, 110], [650, 125], [750, 145], [850, 165]]),
  ...serie({ brand: FS, family: 'Hydro K Pro', year: 2020, cert: 'Bronze', mod: 'N', fan: '120 mm' }, 'FSP Hydro K Pro #W', 'fsp-hydro-k-pro-#w', [[500, 55], [600, 60], [750, 75]]),
  ...serie({ brand: FS, family: 'Hydro GT Pro', year: 2021, cert: 'Gold', mod: 'F', fan: '120 mm' }, 'FSP Hydro GT Pro #W', 'fsp-hydro-gt-pro-#w', [[650, 95], [850, 120], [1000, 160]]),
  // ─── Lian Li ───
  ...serie({ brand: LL, family: 'SP', year: 2022, cert: 'Gold', mod: 'F', norme: 'SFX', fan: '92 mm' }, 'Lian Li SP#', 'lian-li-sp#', [[750, 140], [850, 160]]),
  ...serie({ brand: LL, family: 'EDGE', year: 2023, cert: 'Platinum', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)' }, 'Lian Li EDGE EG#', 'lian-li-edge-eg#', [[1000, 250], [1200, 290], [1300, 320]]),
  // ─── Super Flower ───
  ...serie({ brand: SF, family: 'Leadex III Gold', year: 2017, cert: 'Gold', mod: 'F', fan: '130 mm' }, 'Super Flower Leadex III Gold #W', 'super-flower-leadex-iii-gold-#w', [[550, 90], [650, 100], [750, 110], [850, 125]]),
  ...serie({ brand: SF, family: 'Leadex Platinum SE', year: 2019, cert: 'Platinum', mod: 'F' }, 'Super Flower Leadex Platinum SE #W', 'super-flower-leadex-platinum-se-#w', [[1000, 200], [1200, 240]]),
  ...serie({ brand: SF, family: 'Leadex Titanium', year: 2016, cert: 'Titanium', mod: 'F' }, 'Super Flower Leadex Titanium #W', 'super-flower-leadex-titanium-#w', [[850, 220], [1000, 260], [1600, 400]]),
  ...serie({ brand: SF, family: 'Leadex VII XG', year: 2023, cert: 'Gold', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)' }, 'Super Flower Leadex VII XG #W', 'super-flower-leadex-vii-xg-#w', [[850, 150], [1000, 190], [1300, 260]]),
];
