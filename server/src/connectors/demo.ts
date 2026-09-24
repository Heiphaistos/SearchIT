import { createHash } from 'node:crypto';
import { getMerchantDefinitions, searchUrlFor, type MerchantDefinition } from '../merchants.js';
import { makeOffer, round2 } from '../search/offer.js';
import type { CategoryId, Offer } from '../shared/types.js';
import { DEMO_CATALOG } from './demo-catalog.js';
import { OfferIndex } from '../search/index.js';
import type { Connector, ConnectorQuery } from './types.js';

// Génère un catalogue d'offres DÉTERMINISTE et FICTIF à partir de DEMO_CATALOG.
// Les liens pointent vers la page de recherche réelle du marchand (pas vers une fiche inventée).

const COMPONENTS: CategoryId[] = ['cpu', 'gpu', 'motherboard', 'ram', 'ssd', 'hdd', 'psu', 'case', 'cooling', 'fan', 'thermal-paste'];
const DEVICES: CategoryId[] = ['laptop', 'desktop', 'smartphone', 'tablet', 'smartwatch', 'console'];
const PERIPHERALS: CategoryId[] = ['monitor', 'keyboard', 'mouse', 'headset', 'webcam', 'printer', 'external-storage', 'memory-card'];
const ACCESSORIES: CategoryId[] = ['cable', 'charger', 'accessory', 'thermal-paste', 'memory-card'];
const INFRA: CategoryId[] = ['server', 'nas', 'network', 'ups'];

const CATALOGS: Record<string, CategoryId[]> = {
  amazon: [...COMPONENTS, ...DEVICES, ...PERIPHERALS, ...ACCESSORIES, 'nas', 'network', 'ups'],
  aliexpress: ['ram', 'ssd', 'fan', 'cooling', 'thermal-paste', 'cable', 'charger', 'accessory', 'memory-card', 'network', 'keyboard', 'mouse'],
  ebay: [...COMPONENTS, ...DEVICES, ...PERIPHERALS, ...ACCESSORIES, ...INFRA],
  backmarket: ['smartphone', 'tablet', 'laptop', 'desktop', 'smartwatch', 'console', 'headset', 'monitor'],
  fnac: [...DEVICES, ...PERIPHERALS, ...ACCESSORIES, 'nas', 'network', 'ssd', 'hdd'],
  ldlc: [...COMPONENTS, 'laptop', 'desktop', 'smartphone', 'tablet', ...PERIPHERALS, ...ACCESSORIES, ...INFRA],
  leclerc: ['smartphone', 'tablet', 'laptop', 'console', 'smartwatch', 'headset', 'cable', 'charger', 'accessory', 'memory-card', 'external-storage', 'printer'],
  cdiscount: [...COMPONENTS, ...DEVICES, ...PERIPHERALS, ...ACCESSORIES, 'nas', 'network', 'ups'],
  rakuten: [...COMPONENTS, ...DEVICES, ...PERIPHERALS, ...ACCESSORIES, 'nas'],
  boulanger: [...DEVICES, ...PERIPHERALS, 'cable', 'charger', 'accessory', 'network'],
  darty: [...DEVICES, ...PERIPHERALS, 'cable', 'charger', 'accessory', 'network'],
  materielnet: [...COMPONENTS, 'laptop', 'desktop', ...PERIPHERALS, ...ACCESSORIES, 'nas', 'network', 'ups'],
  topachat: [...COMPONENTS, 'laptop', 'desktop', ...PERIPHERALS, 'cable', 'thermal-paste', 'nas'],
  rueducommerce: [...COMPONENTS, ...DEVICES, ...PERIPHERALS, ...ACCESSORIES, ...INFRA],
  grosbill: [...COMPONENTS, 'laptop', 'desktop', 'monitor', 'nas', 'cable', 'thermal-paste'],
  visiodirect: ['laptop', 'desktop', 'server', 'monitor', 'network', 'ups', 'hdd', 'nas', 'keyboard', 'mouse', 'ram'],
  '1fotrade': ['laptop', 'desktop', 'server', 'monitor', 'network', 'ram', 'hdd', 'ssd', 'keyboard', 'mouse', 'charger', 'tablet'],
  certideal: ['smartphone', 'tablet', 'laptop', 'smartwatch'],
  refurbed: ['smartphone', 'tablet', 'laptop', 'desktop', 'smartwatch', 'monitor', 'headset', 'console'],
};

const GRADES: Array<[string, number]> = [
  ['Parfait état', 0.84],
  ['Très bon état', 0.76],
  ['Bon état', 0.68],
  ['État correct', 0.6],
];

function rng(seed: string): () => number {
  let h = createHash('md5').update(seed).digest().readUInt32LE(0);
  return () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Prix « psychologique » : 1234.56 → 1229.99, 23.4 → 22.99. */
function charmPrice(n: number): number {
  if (n >= 100) return Math.floor(n / 10) * 10 + 9.99 - 10;
  return Math.max(0.99, Math.floor(n) - 0.01);
}

export function buildDemoOffers(merchants: MerchantDefinition[] = getMerchantDefinitions()): Offer[] {
  const offers: Offer[] = [];
  const updatedAt = new Date().toISOString();
  for (const [category, brand, title, refPrice, refurbable] of DEMO_CATALOG) {
    for (const merchant of merchants) {
      const categories = CATALOGS[merchant.id];
      if (!categories?.includes(category)) continue;
      const rand = rng(`${merchant.id}|${title}`);
      const base = { merchantId: merchant.id, merchantName: merchant.name, brand, category, isDemo: true, updatedAt };
      const url = searchUrlFor(merchant, title.replace(/^(Processeur|Carte graphique|Carte mère|Mémoire RAM|SSD|Disque dur|Alimentation|Boîtier PC|Ventirad|PC portable( gamer)?|PC de bureau|Serveur|NAS|Écran PC|Pâte thermique)\s+/i, ''));
      const shipping = (price: number) => (price >= 50 || rand() < 0.4 ? 0 : round2(3.99 + Math.floor(rand() * 3) * 1.5));

      // Offre neuve
      if (!merchant.refurbishedOnly && rand() < 0.72) {
        const factor = merchant.id === 'aliexpress' ? 0.72 + rand() * 0.2 : 0.9 + rand() * 0.17;
        const price = charmPrice(refPrice * factor);
        offers.push(makeOffer({ ...base, sourceId: `n-${hash(title)}`, title, url, price, shipping: shipping(price), condition: 'new', inStock: rand() < 0.88, rating: round1(3.8 + rand() * 1.2), reviewCount: Math.floor(rand() * 2400) }));
      }
      // Offre reconditionnée
      if (refurbable && merchant.refurbished && (merchant.refurbishedOnly || rand() < 0.45)) {
        const [grade, gradeFactor] = GRADES[Math.floor(rand() * GRADES.length)];
        const price = charmPrice(refPrice * (gradeFactor + (rand() - 0.5) * 0.08));
        offers.push(makeOffer({ ...base, sourceId: `r-${hash(title)}`, title: `${title} - Reconditionné`, url, price, shipping: shipping(price), condition: 'refurbished', conditionGrade: grade, inStock: rand() < 0.93, rating: round1(4 + rand()), reviewCount: Math.floor(rand() * 900) }));
      }
      // Occasion (places de marché)
      if (refurbable && (merchant.id === 'ebay' || merchant.id === 'rakuten') && rand() < 0.7) {
        const price = charmPrice(refPrice * (0.45 + rand() * 0.25));
        offers.push(makeOffer({ ...base, sourceId: `u-${hash(title)}`, title: `${title} - Occasion`, url, price, shipping: shipping(price), condition: 'used', conditionGrade: 'Vendeur particulier', inStock: true }));
      }
    }
  }
  return offers;
}

function hash(s: string): string {
  return createHash('sha1').update(s).digest('hex').slice(0, 10);
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function createDemoConnector(isEnabled: () => boolean): Connector {
  let index: OfferIndex | null = null;
  const getIndex = () => (index ??= new OfferIndex(buildDemoOffers()));
  return {
    id: 'demo',
    merchantId: 'demo',
    enabled: isEnabled,
    describe: () => ({ offers: getIndex().size, products: DEMO_CATALOG.length }),
    async search(query: ConnectorQuery): Promise<Offer[]> {
      if (query.browse && query.category) return getIndex().byCategory(query.category, query.limit * 8);
      return getIndex().search(query.q, query.limit * 4);
    },
  };
}
