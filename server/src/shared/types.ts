// Types partagés entre l'API SearchIT, le frontend et les clients externes
// (ex. le configurateur de PC). Toute modification ici est un changement de contrat d'API.

export type Condition = 'new' | 'refurbished' | 'used';

export type CategoryId =
  | 'cpu'
  | 'gpu'
  | 'motherboard'
  | 'ram'
  | 'ssd'
  | 'hdd'
  | 'psu'
  | 'case'
  | 'cooling'
  | 'thermal-paste'
  | 'fan'
  | 'desktop'
  | 'laptop'
  | 'smartphone'
  | 'tablet'
  | 'smartwatch'
  | 'server'
  | 'nas'
  | 'monitor'
  | 'keyboard'
  | 'mouse'
  | 'headset'
  | 'webcam'
  | 'network'
  | 'cable'
  | 'charger'
  | 'external-storage'
  | 'memory-card'
  | 'printer'
  | 'console'
  | 'ups'
  | 'software'
  | 'accessory'
  | 'other';

export type CategoryGroup = 'components' | 'devices' | 'infrastructure' | 'peripherals' | 'accessories';

export interface Category {
  id: CategoryId;
  label: string;
  group: CategoryGroup;
  /** Mots-clés (sans accents, en minuscules) utilisés pour détecter la catégorie. */
  keywords: string[];
}

export type ConnectionType = 'api' | 'affiliate-feed' | 'public-store' | 'aggregator' | 'demo';

export interface MerchantInfo {
  id: string;
  name: string;
  website: string;
  country: string;
  /** Vend du reconditionné / de l'occasion. */
  refurbished: boolean;
  connection: ConnectionType;
  /** Source active (clés/flux configurés) pour ce marchand. */
  enabled: boolean;
  /** Variables d'environnement nécessaires pour activer le marchand. */
  requiredEnv: string[];
  notes?: string;
}

export interface Offer {
  id: string;
  merchantId: string;
  merchantName: string;
  title: string;
  url: string;
  imageUrl?: string;
  /** Prix TTC de l'article, hors livraison. */
  price: number;
  currency: string;
  /** Frais de port ; `null` si inconnus. */
  shipping: number | null;
  /** price + shipping (shipping inconnu compté 0). */
  totalPrice: number;
  condition: Condition;
  /** Grade de reconditionnement (ex. « Très bon état », « Grade A »). */
  conditionGrade?: string;
  inStock: boolean | null;
  brand?: string;
  gtin?: string;
  mpn?: string;
  category: CategoryId;
  rating?: number;
  reviewCount?: number;
  seller?: string;
  /** Vrai si l'offre provient du catalogue de démonstration (prix fictifs). */
  isDemo?: boolean;
  /** Devise et prix d'origine quand le prix a été converti en euros (taux BCE). */
  originalCurrency?: string;
  originalPrice?: number;
  /** Source agrégée d'où provient l'offre (ex. « google-shopping »). */
  via?: string;
  updatedAt: string;
}

export interface ProductGroup {
  key: string;
  title: string;
  brand?: string;
  category: CategoryId;
  imageUrl?: string;
  gtin?: string;
  offers: Offer[];
  bestOffer: Offer;
  bestNew?: Offer;
  bestRefurbished?: Offer;
  bestUsed?: Offer;
  minPrice: number;
  maxPrice: number;
  /** Économie max en % entre l'offre la plus chère et la moins chère. */
  savingsPercent: number;
  merchantCount: number;
  relevance: number;
}

export type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'savings' | 'offers';

export interface SearchParams {
  /** Mots-clés. Peut être vide si `category` est fourni (navigation par catégorie). */
  q: string;
  category?: CategoryId;
  conditions?: Condition[];
  merchants?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  /** Masque coques, housses, câbles… quand on cherche un appareil. Défaut : true. */
  hideAccessories?: boolean;
  sort?: SortKey;
  page?: number;
  pageSize?: number;
}

export interface SourceStatus {
  merchantId: string;
  connector: string;
  status: 'ok' | 'error' | 'timeout' | 'skipped';
  count: number;
  ms: number;
  error?: string;
}

export interface Facet<T extends string = string> {
  id: T;
  label: string;
  count: number;
}

export interface SearchResponse {
  query: string;
  detectedCategory: CategoryId | null;
  total: number;
  page: number;
  pageSize: number;
  groups: ProductGroup[];
  facets: {
    categories: Facet<CategoryId>[];
    merchants: Facet[];
    conditions: Facet<Condition>[];
    price: { min: number; max: number };
  };
  sources: SourceStatus[];
  demo: boolean;
  tookMs: number;
}

// ---- API « lookup » par lot, pensée pour le configurateur de PC ----

export interface LookupItem {
  /** Identifiant libre côté client (ex. « cpu », « slot-gpu-1 »). Renvoyé tel quel. */
  ref: string;
  /** Nom du composant, ex. « AMD Ryzen 7 7800X3D ». */
  query: string;
  category?: CategoryId;
  gtin?: string;
  mpn?: string;
  quantity?: number;
  conditions?: Condition[];
  maxPrice?: number;
}

export interface LookupRequest {
  items: LookupItem[];
  conditions?: Condition[];
  merchants?: string[];
  /** Nombre d'offres alternatives renvoyées par article (défaut 3, max 20). */
  alternatives?: number;
}

export interface LookupResult {
  ref: string;
  query: string;
  quantity: number;
  found: boolean;
  best?: Offer;
  bestNew?: Offer;
  bestRefurbished?: Offer;
  alternatives: Offer[];
  /** Prix du meilleur choix × quantité. */
  lineTotal: number;
}

export interface MerchantBasket {
  merchantId: string;
  merchantName: string;
  /** Nombre d'articles disponibles chez ce marchand. */
  covered: number;
  total: number;
}

export interface LookupResponse {
  results: LookupResult[];
  /** Somme des meilleures offres, tous marchands confondus. */
  bestTotal: number;
  /** Totaux si tout est acheté chez un seul marchand (articles disponibles uniquement). */
  byMerchant: MerchantBasket[];
  missing: string[];
  demo: boolean;
  tookMs: number;
}
