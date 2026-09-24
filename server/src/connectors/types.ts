import type { CategoryId, Condition, Offer } from '../shared/types.js';

export interface ConnectorQuery {
  q: string;
  category: CategoryId | null;
  conditions?: Condition[];
  minPrice?: number;
  maxPrice?: number;
  gtin?: string;
  /** Nombre max d'offres souhaitées. */
  limit: number;
}

export interface Connector {
  /** Identifiant unique de la source (ex. « amazon », « feed:ldlc », « demo »). */
  id: string;
  /** Marchand principal couvert (« demo » pour le catalogue de démonstration). */
  merchantId: string;
  enabled(): boolean;
  search(query: ConnectorQuery, signal: AbortSignal): Promise<Offer[]>;
  /** Préchargement (ex. téléchargement d'un flux). Optionnel. */
  warmup?(): Promise<void>;
  /** Informations de diagnostic affichées sur la page « Sources ». */
  describe?(): Record<string, unknown>;
}

export class ConnectorError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'ConnectorError';
  }
}

export async function fetchJson<T>(url: string, init: RequestInit & { signal: AbortSignal }): Promise<T> {
  const res = await fetch(url, init);
  const text = await res.text();
  if (!res.ok) {
    throw new ConnectorError(`HTTP ${res.status} ${res.statusText}: ${text.slice(0, 300)}`, res.status);
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ConnectorError(`Réponse JSON invalide: ${text.slice(0, 200)}`);
  }
}
