import { createHash } from 'node:crypto';
import { getMerchantDefinitions, searchUrlFor, type MerchantDefinition } from '../merchants.js';
import { makeOffer, round2 } from '../search/offer.js';
import type { CategoryId, Offer } from '../shared/types.js';
import type { Catalog } from '../catalog/index.js';
import { DEMO_CATALOG, type DemoProduct } from './demo-catalog.js';
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

const MAX_DEMO_MERCHANTS = 7;

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

/**
 * Produits de démonstration : tout le catalogue de référence qui a un prix de lancement,
 * complété par les entrées historiques de DEMO_CATALOG absentes du catalogue.
 */
export function demoProducts(catalog?: Catalog): DemoProduct[] {
  if (!catalog?.size) return DEMO_CATALOG;
  const year = new Date().getFullYear();
  const median = (values: number[]) => {
    if (!values.length) return undefined;
    const sorted = [...values].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  };
  // Prix de référence pour les produits sans prix de lancement : même gamme, sinon même
  // catégorie, sinon ancien catalogue de démo, sinon valeur par défaut (prix FICTIFS).
  const byFamily = new Map<string, number[]>();
  const byCategory = new Map<string, number[]>();
  for (const p of catalog.products) {
    if (!p.msrp) continue;
    if (p.family) byFamily.set(p.family, [...(byFamily.get(p.family) ?? []), p.msrp]);
    byCategory.set(p.category, [...(byCategory.get(p.category) ?? []), p.msrp]);
  }
  // Ancien catalogue de démo rattaché au catalogue de référence (une seule passe).
  const legacyById = new Map<string, number>();
  const legacy: DemoProduct[] = [];
  for (const entry of DEMO_CATALOG) {
    const match = catalog.match(entry[2], entry[0]);
    if (match) legacyById.set(match.id, entry[3]);
    else legacy.push(entry);
  }
  const fromCatalog: DemoProduct[] = catalog.products.map((p) => {
    const reference =
      p.msrp ??
      legacyById.get(p.id) ??
      (p.family ? median(byFamily.get(p.family) ?? []) : undefined) ??
      median(byCategory.get(p.category) ?? []) ??
      DEFAULT_PRICE[p.category] ??
      50;
    // Décote avec l'âge : un produit sorti il y a 4 ans ne se vend plus au prix de lancement.
    const age = Math.max(0, year - (p.year ?? year));
    const price = reference * Math.max(0.5, 1 - 0.09 * age);
    return [p.category, p.brand, p.name, Math.round(price), p.refurbishable ?? age >= 2];
  });
  return [...fromCatalog, ...legacy];
}

const DEFAULT_PRICE: Partial<Record<CategoryId, number>> = {
  cpu: 250, gpu: 500, motherboard: 180, ram: 90, ssd: 100, hdd: 150, psu: 110, case: 100, cooling: 60, 'thermal-paste': 12, fan: 20,
  smartphone: 500, tablet: 450, laptop: 1000, desktop: 700, smartwatch: 300, server: 2500, nas: 450, monitor: 300, keyboard: 90,
  mouse: 70, headset: 150, webcam: 90, network: 120, cable: 20, charger: 40, 'external-storage': 120, 'memory-card': 25, printer: 200,
  console: 450, ups: 250, accessory: 30,
};

export function buildDemoOffers(merchants: MerchantDefinition[] = getMerchantDefinitions(), products: DemoProduct[] = DEMO_CATALOG): Offer[] {
  const offers: Offer[] = [];
  const updatedAt = new Date().toISOString();
  for (const [category, brand, title, refPrice, refurbable] of products) {
    // Au plus MAX_DEMO_MERCHANTS marchands par produit (choix déterministe) : garde un
    // volume d'offres raisonnable avec un catalogue de plusieurs milliers de produits.
    const eligible = merchants
      .filter((m) => CATALOGS[m.id]?.includes(category))
      .sort((a, b) => hash(`${a.id}|${title}`).localeCompare(hash(`${b.id}|${title}`)))
      .slice(0, MAX_DEMO_MERCHANTS);
    for (const merchant of eligible) {
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

export function createDemoConnector(isEnabled: () => boolean, catalog?: Catalog): Connector {
  let index: OfferIndex | null = null;
  const getIndex = () => (index ??= new OfferIndex(buildDemoOffers(getMerchantDefinitions(), demoProducts(catalog))));
  return {
    id: 'demo',
    merchantId: 'demo',
    enabled: isEnabled,
    describe: () => ({ offers: getIndex().size, products: DEMO_CATALOG.length }),
    suggest: (prefix, limit) => getIndex().suggestTitles(prefix, limit),
    async search(query: ConnectorQuery): Promise<Offer[]> {
      if (query.browse && query.category) return getIndex().byCategory(query.category, query.limit * 8);
      return getIndex().search(query.q, query.limit * 4);
    },
  };
}
