import type { CategoryId } from '../shared/types.js';

/**
 * Produit du catalogue de référence SearchIT : un vrai produit du marché avec ses
 * caractéristiques techniques. Ce ne sont PAS des offres : aucun prix de vente réel ici,
 * seulement un prix de lancement indicatif (msrp) quand il est connu.
 */
export interface CatalogProduct {
  /** Identifiant unique, en minuscules, préfixé par la catégorie : « cpu-amd-ryzen-7-7800x3d ». */
  id: string;
  category: CategoryId;
  brand: string;
  /** Nom commercial complet, tel qu'on le cherche : « AMD Ryzen 7 7800X3D ». */
  name: string;
  /** Gamme / génération : « Ryzen 7000 », « GeForce RTX 50 », « iPhone 16 ». */
  family?: string;
  /** Année de sortie. */
  year?: number;
  /** Prix de lancement indicatif en euros TTC (France), arrondi. */
  msrp?: number;
  /** Se trouve couramment en reconditionné / occasion. */
  refurbishable?: boolean;
  /** Caractéristiques, clés en français (voir SPEC_KEYS), valeurs avec unité. */
  specs: Record<string, string | number>;
  /** Usages : gaming, ia, bureautique, creation, serveur, homelab, nas, mobile, pro… */
  tags?: string[];
}

/** Clés de caractéristiques recommandées par catégorie (ordre d'affichage). */
export const SPEC_KEYS: Partial<Record<CategoryId, string[]>> = {
  cpu: ['Cœurs', 'Threads', 'Fréquence de base', 'Fréquence boost', 'Cache L3', 'TDP', 'Socket', 'Mémoire', 'Graphiques intégrés', 'Gravure'],
  gpu: ['VRAM', 'Type de mémoire', 'Bus mémoire', 'Unités de calcul', 'Fréquence boost', 'TDP', 'Alimentation recommandée', 'Interface', 'Sorties'],
  motherboard: ['Socket', 'Chipset', 'Format', 'Mémoire', 'Slots M.2', 'PCIe', 'Wi-Fi', 'Ethernet', 'USB'],
  ram: ['Type', 'Capacité', 'Kit', 'Fréquence', 'Latence', 'Tension', 'Format', 'RGB'],
  ssd: ['Capacité', 'Interface', 'Format', 'Lecture séquentielle', 'Écriture séquentielle', 'Endurance', 'Type de NAND', 'Cache DRAM'],
  hdd: ['Capacité', 'Vitesse de rotation', 'Cache', 'Interface', 'Usage', 'Technologie', 'Garantie'],
  psu: ['Puissance', 'Certification', 'Modulaire', 'Norme', 'Connecteur 12V-2x6', 'Ventilateur'],
  case: ['Format', 'Cartes mères', 'Longueur GPU max', 'Hauteur ventirad max', 'Ventilateurs inclus', 'Radiateur max', 'Façade'],
  cooling: ['Type', 'Taille', 'TDP supporté', 'Hauteur', 'Ventilateurs', 'Sockets'],
  'thermal-paste': ['Type', 'Conductivité', 'Contenance'],
  fan: ['Taille', 'Vitesse max', 'Débit d’air', 'Niveau sonore', 'Connecteur', 'RGB'],
  smartphone: ['Écran', 'Définition', 'Rafraîchissement', 'Processeur', 'RAM', 'Stockage', 'Batterie', 'Charge rapide', 'Appareil photo', '5G', 'Système', 'Poids'],
  tablet: ['Écran', 'Définition', 'Processeur', 'RAM', 'Stockage', 'Batterie', 'Stylet', 'Connectivité', 'Système', 'Poids'],
  laptop: ['Processeur', 'RAM', 'Stockage', 'Écran', 'Carte graphique', 'Autonomie', 'Poids', 'Système'],
  desktop: ['Processeur', 'RAM', 'Stockage', 'Carte graphique', 'Format', 'Système'],
  smartwatch: ['Écran', 'Autonomie', 'GPS', 'Étanchéité', 'Compatibilité', 'Capteurs'],
  server: ['Format', 'Processeurs', 'Sockets', 'RAM max', 'Baies disques', 'Réseau', 'Alimentation', 'Génération'],
  nas: ['Baies', 'Processeur', 'RAM', 'RAM max', 'Réseau', 'Cache M.2', 'Capacité max', 'Système'],
  network: ['Type', 'Norme', 'Débit', 'Ports', 'PoE', 'Bandes'],
  ups: ['Puissance', 'Puissance active', 'Topologie', 'Prises', 'Interface'],
  monitor: ['Taille', 'Dalle', 'Définition', 'Fréquence', 'Temps de réponse', 'HDR', 'Connectique'],
  console: ['Processeur', 'Stockage', 'Définition max', 'Portable'],
};
