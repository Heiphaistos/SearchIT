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

const SS = 'SilverStone';
const CH = 'Chieftec';
const AC = 'Aerocool';
const EN = 'Enermax';
const X = 'XPG';
const MT = 'Montech';
const ED = 'Endorfy';
const PH = 'Phanteks';
export const PRODUCTS: CatalogProduct[] = [
  // ─── SilverStone ───
  ...serie({ brand: SS, family: 'SX Gold', year: 2016, cert: 'Gold', mod: 'F', norme: 'SFX', fan: '92 mm' }, 'SilverStone SX#-G', 'silverstone-sx#-g', [[500, 100], [650, 130, '650']]),
  ...serie({ brand: SS, family: 'SX Platinum', year: 2020, cert: 'Platinum', mod: 'F', norme: 'SFX', fan: '92 mm' }, 'SilverStone SX#-PT', 'silverstone-sx#-pt', [[750, 170]]),
  ...serie({ brand: SS, family: 'SX-L Platinum', year: 2016, cert: 'Platinum', mod: 'F', norme: 'SFX-L', fan: '120 mm' }, 'SilverStone SX#-LPT', 'silverstone-sx#-lpt', [[700, 160]]),
  ...serie({ brand: SS, family: 'SX-L Platinum', year: 2019, cert: 'Platinum', mod: 'F', norme: 'SFX-L', fan: '120 mm' }, 'SilverStone SX#-LPT', 'silverstone-sx#-lpt', [[1000, 250]]),
  ...serie({ brand: SS, family: 'Strider Gold S', year: 2015, cert: 'Gold', mod: 'F', fan: '120 mm' }, 'SilverStone Strider Gold S ST#F-GS', 'silverstone-strider-st#f-gs', [[550, 90, '55'], [650, 100, '65'], [750, 115, '75'], [850, 130, '85']]),
  ...serie({ brand: SS, family: 'Strider Platinum', year: 2017, cert: 'Platinum', mod: 'F' }, 'SilverStone Strider Platinum ST#-PTS', 'silverstone-strider-st#-pts', [[1000, 220]]),
  ...serie({ brand: SS, family: 'Strider Platinum', year: 2014, cert: 'Platinum', mod: 'F' }, 'SilverStone Strider Platinum ST#-PT', 'silverstone-strider-st#-pt', [[1200, 260]]),
  ...serie({ brand: SS, family: 'HELA', year: 2020, cert: 'Platinum', mod: 'F', fan: '135 mm' }, 'SilverStone HELA #', 'silverstone-hela-#', [[2050, 450]]),
  ...serie({ brand: SS, family: 'DA Gold', year: 2021, cert: 'Gold', mod: 'F' }, 'SilverStone DA#-G', 'silverstone-da#-g', [[650, 100], [750, 115], [850, 130]]),
  ...serie({ brand: SS, family: 'Essential', year: 2018, cert: 'Bronze', mod: 'N' }, 'SilverStone Essential ET#-B', 'silverstone-essential-et#-b', [[550, 55], [650, 65]]),
  // ─── Chieftec ───
  ...serie({ brand: CH, family: 'A-80', year: 2016, cert: 'Gold', mod: 'F' }, 'Chieftec A-80 CTG-#C', 'chieftec-a-80-ctg-#c', [[550, 80], [650, 90], [750, 100]]),
  ...serie({ brand: CH, family: 'Polaris', year: 2020, cert: 'Gold', mod: 'F' }, 'Chieftec Polaris PPS-#FC', 'chieftec-polaris-pps-#fc', [[550, 85], [650, 95], [750, 110], [850, 125], [1050, 170]]),
  // ─── Aerocool ───
  ...serie({ brand: AC, family: 'Aero Bronze', year: 2017, cert: 'Bronze', mod: 'S', fan: '120 mm' }, 'Aerocool Aero Bronze #M', 'aerocool-aero-bronze-#m', [[500, 50], [650, 60], [750, 70]]),
  // ─── Enermax ───
  ...serie({ brand: EN, family: 'Revolution D.F.', year: 2018, cert: 'Gold', mod: 'F' }, 'Enermax Revolution D.F. #W', 'enermax-revolution-df-#w', [[650, 110], [750, 125], [850, 140]]),
  ...serie({ brand: EN, family: 'Revolution D.F. 2', year: 2022, cert: 'Gold', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)' }, 'Enermax Revolution D.F. 2 #W', 'enermax-revolution-df-2-#w', [[850, 150], [1050, 190], [1200, 230]]),
  ...serie({ brand: EN, family: 'Revolution DF.X', year: 2020, cert: 'Gold', mod: 'F' }, 'Enermax Revolution DF.X #W', 'enermax-revolution-dfx-#w', [[650, 100], [750, 115], [850, 130], [1050, 170], [1200, 210]]),
  ...serie({ brand: EN, family: 'Platimax D.F.', year: 2017, cert: 'Platinum', mod: 'F' }, 'Enermax Platimax D.F. #W', 'enermax-platimax-df-#w', [[500, 110], [600, 125], [750, 145], [850, 165], ]),
  ...serie({ brand: EN, family: 'MaxTytan', year: 2017, cert: 'Titanium', mod: 'F' }, 'Enermax MaxTytan #W', 'enermax-maxtytan-#w', [[800, 230], [1050, 290]]),
  // ─── XPG ───
  ...serie({ brand: X, family: 'Core Reactor', year: 2020, cert: 'Gold', mod: 'F', fan: '120 mm' }, 'XPG Core Reactor #W', 'xpg-core-reactor-#w', [[650, 100], [750, 115], [850, 130]]),
  ...serie({ brand: X, family: 'Core Reactor II', year: 2023, cert: 'Gold', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)', fan: '120 mm' }, 'XPG Core Reactor II #W', 'xpg-core-reactor-ii-#w', [[650, 95], [750, 110], [850, 125]]),
  ...serie({ brand: X, family: 'Core Reactor II VE', year: 2023, cert: 'Gold', mod: 'N', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)', fan: '120 mm' }, 'XPG Core Reactor II VE #W', 'xpg-core-reactor-ii-ve-#w', [[650, 80], [750, 90], [850, 105]]),
  ...serie({ brand: X, family: 'Pylon', year: 2020, cert: 'Bronze', mod: 'N', fan: '120 mm' }, 'XPG Pylon #W', 'xpg-pylon-#w', [[450, 45], [550, 50], [650, 60], [750, 70]]),
  ...serie({ brand: X, family: 'Kyber', year: 2022, cert: 'Gold', mod: 'N', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)', fan: '120 mm' }, 'XPG Kyber #W', 'xpg-kyber-#w', [[650, 80], [750, 90], [850, 105]]),
  ...serie({ brand: X, family: 'Cybercore II', year: 2023, cert: 'Platinum', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)' }, 'XPG Cybercore II #W', 'xpg-cybercore-ii-#w', [[1000, 220], [1300, 280]]),
  ...serie({ brand: X, family: 'Fusion', year: 2023, cert: 'Titanium', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)' }, 'XPG Fusion #W', 'xpg-fusion-#w', [[1600, 550]]),
  // ─── Montech ───
  ...serie({ brand: MT, family: 'Century', year: 2021, cert: 'Gold', mod: 'F', fan: '120 mm' }, 'Montech Century #', 'montech-century-#', [[650, 85], [750, 95], [850, 110]]),
  ...serie({ brand: MT, family: 'Century II', year: 2023, cert: 'Gold', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)', fan: '120 mm' }, 'Montech Century II #W', 'montech-century-ii-#w', [[850, 110], [1050, 150]]),
  // ─── Endorfy ───
  ...serie({ brand: ED, family: 'Supremo FM5', year: 2022, cert: 'Gold', mod: 'F', fan: '135 mm' }, 'Endorfy Supremo FM5 Gold #W', 'endorfy-supremo-fm5-gold-#w', [[550, 85], [650, 95], [750, 105], [850, 120], [1000, 160]]),
  // ─── Phanteks ───
  ...serie({ brand: PH, family: 'AMP v2', year: 2023, cert: 'Gold', mod: 'F', norme: 'ATX 3.0', conn: 'Oui (12VHPWR)', fan: '135 mm' }, 'Phanteks AMP v2 #W', 'phanteks-amp-v2-#w', [[650, 95], [750, 110], [850, 125], [1000, 165]]),
];
