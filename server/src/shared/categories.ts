import type { Category, CategoryGroup, CategoryId } from './types.js';

// Mots-clés normalisés (minuscules, sans accents). L'ordre compte : les catégories
// les plus spécifiques (accessoires, pâte thermique…) passent avant les génériques.
export const CATEGORIES: Category[] = [
  { id: 'thermal-paste', label: 'Pâte thermique', group: 'accessories', keywords: ['pate thermique', 'thermal paste', 'thermal grease', 'thermal pad', 'pad thermique', 'mx-4', 'mx-6', 'kryonaut', 'nt-h1', 'nt-h2', 'mastergel', 'liquid metal', 'metal liquide'] },
  { id: 'cable', label: 'Câbles & adaptateurs', group: 'accessories', keywords: ['cable', 'cordon', 'adaptateur', 'adapter', 'rallonge', 'hdmi', 'displayport', 'rj45', 'sata cable', 'dongle', 'hub usb', 'dock', 'station d accueil'] },
  { id: 'charger', label: 'Chargeurs & batteries', group: 'accessories', keywords: ['chargeur', 'charger', 'alimentation secteur', 'power bank', 'batterie externe', 'powerbank', 'gan', 'magsafe', 'bloc secteur'] },
  { id: 'memory-card', label: 'Cartes mémoire & clés USB', group: 'accessories', keywords: ['carte sd', 'microsd', 'micro sd', 'sdxc', 'sdhc', 'cle usb', 'usb flash', 'compactflash', 'cfexpress'] },
  { id: 'accessory', label: 'Autres accessoires', group: 'accessories', keywords: ['coque', 'housse', 'etui', 'protection ecran', 'verre trempe', 'film protecteur', 'sacoche', 'sac a dos', 'support', 'stylet', 'bracelet', 'tapis de souris', 'kit de nettoyage', 'bombe a air'] },
  { id: 'nas', label: 'NAS', group: 'infrastructure', keywords: ['nas', 'synology', 'qnap', 'diskstation', 'terramaster', 'asustor', 'ugreen nas', 'truenas'] },
  { id: 'server', label: 'Serveurs', group: 'infrastructure', keywords: ['serveur', 'server', 'poweredge', 'proliant', 'thinksystem', 'rack 1u', 'rack 2u', 'xeon', 'epyc', 'supermicro', 'primergy'] },
  { id: 'ups', label: 'Onduleurs', group: 'infrastructure', keywords: ['onduleur', 'ups', 'back-ups', 'smart-ups', 'eaton'] },
  { id: 'network', label: 'Réseau', group: 'infrastructure', keywords: ['routeur', 'router', 'switch', 'point d acces', 'access point', 'wifi 7', 'wifi 6', 'mesh', 'carte reseau', 'ubiquiti', 'unifi', 'mikrotik', 'cpl', 'modem', 'sfp'] },
  { id: 'cpu', label: 'Processeurs', group: 'components', keywords: ['processeur', 'cpu', 'ryzen', 'core i3', 'core i5', 'core i7', 'core i9', 'core ultra', 'threadripper', 'pentium', 'celeron'] },
  { id: 'gpu', label: 'Cartes graphiques', group: 'components', keywords: ['carte graphique', 'gpu', 'geforce', 'rtx', 'gtx', 'radeon', 'rx 7', 'rx 9', 'arc b', 'arc a', 'quadro'] },
  { id: 'motherboard', label: 'Cartes mères', group: 'components', keywords: ['carte mere', 'motherboard', 'am5', 'am4', 'lga1700', 'lga1851', 'b650', 'b850', 'x870', 'x670', 'z790', 'z890', 'b760', 'b860'] },
  { id: 'ram', label: 'Mémoire RAM', group: 'components', keywords: ['ram', 'ddr4', 'ddr5', 'memoire vive', 'so-dimm', 'sodimm', 'dimm', 'vengeance', 'fury beast', 'trident'] },
  { id: 'ssd', label: 'SSD', group: 'components', keywords: ['ssd', 'nvme', 'm.2', 'm2 2280', '990 pro', '980 pro', 'sn850', 'sn770', 'mp600'] },
  { id: 'hdd', label: 'Disques durs', group: 'components', keywords: ['disque dur', 'hdd', 'hard drive', 'ironwolf', 'wd red', 'barracuda', 'exos', 'ultrastar', 'toshiba n300', '7200 tr', '5400 tr'] },
  { id: 'external-storage', label: 'Stockage externe', group: 'peripherals', keywords: ['disque dur externe', 'ssd externe', 'external', 'portable ssd', 't7 shield', 'my passport', 'extreme portable'] },
  { id: 'psu', label: 'Alimentations PC', group: 'components', keywords: ['alimentation', 'psu', '80 plus', '80+', 'atx 3', 'modulaire', 'rm850', 'focus gx'] },
  { id: 'case', label: 'Boîtiers PC', group: 'components', keywords: ['boitier', 'case', 'moyen tour', 'mid tower', 'mini-itx', 'lian li', 'fractal', 'nzxt h', 'o11'] },
  { id: 'cooling', label: 'Refroidissement', group: 'components', keywords: ['ventirad', 'watercooling', 'aio', 'refroidissement', 'cooler', 'noctua nh', 'dark rock', 'kraken', 'liquid freezer', 'peerless assassin'] },
  { id: 'fan', label: 'Ventilateurs', group: 'components', keywords: ['ventilateur', 'fan', '120mm', '140mm', 'p12', 'nf-a12'] },
  { id: 'smartwatch', label: 'Montres connectées', group: 'devices', keywords: ['montre connectee', 'smartwatch', 'apple watch', 'galaxy watch', 'pixel watch', 'garmin'] },
  { id: 'tablet', label: 'Tablettes', group: 'devices', keywords: ['tablette', 'tablet', 'ipad', 'galaxy tab', 'surface pro', 'xiaomi pad', 'lenovo tab'] },
  { id: 'smartphone', label: 'Smartphones', group: 'devices', keywords: ['smartphone', 'telephone', 'iphone', 'galaxy s', 'galaxy a', 'galaxy z', 'pixel', 'xiaomi', 'redmi', 'oneplus', 'fairphone', 'nothing phone', 'poco'] },
  { id: 'laptop', label: 'PC portables', group: 'devices', keywords: ['pc portable', 'ordinateur portable', 'laptop', 'notebook', 'macbook', 'thinkpad', 'zenbook', 'vivobook', 'xps', 'latitude', 'elitebook', 'rog strix g', 'legion', 'chromebook'] },
  { id: 'desktop', label: 'PC fixes', group: 'devices', keywords: ['pc fixe', 'pc de bureau', 'ordinateur de bureau', 'tour gamer', 'desktop', 'mac mini', 'mac studio', 'imac', 'optiplex', 'prodesk', 'thinkcentre', 'mini pc'] },
  { id: 'console', label: 'Consoles', group: 'devices', keywords: ['console', 'playstation', 'ps5', 'xbox', 'nintendo switch', 'steam deck', 'rog ally'] },
  { id: 'monitor', label: 'Écrans', group: 'peripherals', keywords: ['ecran', 'moniteur', 'monitor', 'oled', '144hz', '240hz', '4k uhd', 'ultrawide', 'odyssey'] },
  { id: 'keyboard', label: 'Claviers', group: 'peripherals', keywords: ['clavier', 'keyboard', 'mecanique', 'azerty'] },
  { id: 'mouse', label: 'Souris', group: 'peripherals', keywords: ['souris', 'mouse', 'mx master', 'g pro'] },
  { id: 'headset', label: 'Casques & audio', group: 'peripherals', keywords: ['casque', 'headset', 'ecouteurs', 'airpods', 'enceinte', 'barre de son', 'micro'] },
  { id: 'webcam', label: 'Webcams', group: 'peripherals', keywords: ['webcam', 'camera usb', 'brio'] },
  { id: 'printer', label: 'Imprimantes', group: 'peripherals', keywords: ['imprimante', 'printer', 'cartouche', 'toner', 'scanner', 'imprimante 3d'] },
  { id: 'software', label: 'Logiciels', group: 'peripherals', keywords: ['windows 11', 'office', 'licence', 'antivirus'] },
  { id: 'other', label: 'Autres', group: 'accessories', keywords: [] },
];

export const CATEGORY_GROUPS: Record<CategoryGroup, string> = {
  components: 'Composants PC',
  devices: 'Appareils',
  infrastructure: 'Serveurs, NAS & réseau',
  peripherals: 'Périphériques',
  accessories: 'Accessoires',
};

const byId = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getCategory(id: CategoryId): Category {
  return byId.get(id) ?? byId.get('other')!;
}

export function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === 'string' && byId.has(value as CategoryId);
}

/** Catégories « appareil » : pour elles, les accessoires sont masqués par défaut. */
export const DEVICE_CATEGORIES: ReadonlySet<CategoryId> = new Set<CategoryId>([
  'smartphone', 'tablet', 'laptop', 'desktop', 'smartwatch', 'console', 'server', 'nas',
  'cpu', 'gpu', 'motherboard', 'monitor',
]);

/** Catégories d'accessoires qui polluent souvent les résultats d'une recherche d'appareil. */
export const ACCESSORY_CATEGORIES: ReadonlySet<CategoryId> = new Set<CategoryId>([
  'accessory', 'cable', 'charger', 'thermal-paste', 'memory-card',
]);
