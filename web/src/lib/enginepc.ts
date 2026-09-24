import { fromExternalCategory } from '@shared/categories';
import type { CategoryId } from '@shared/types';
import { listStore, type ListItem } from './list';
import { createStore } from './store';

// Import d'une configuration du configurateur EnginePC dans « Ma liste ».
// Lien reçu : /configuration?data=<base64url(JSON)>&source=enginepc

export const ENGINEPC_URL = 'https://enginepc.heiphaistos.org';
const MAX_DATA_LENGTH = 16_000;
const MAX_PARTS = 50;
const REF_PREFIX = 'enginepc:';
const SLOT_ID = /^[a-z0-9][a-z0-9._-]{0,119}$/i;

export interface EnginePcImport {
  name: string;
  /** Chaîne base64url d'origine, pour revenir modifier la configuration dans EnginePC. */
  data: string;
}

/** Dernière configuration importée (affichée en tête de « Ma liste »). */
export const enginePcStore = createStore<EnginePcImport | null>('searchit:enginepc', null);

export function enginePcEditUrl(data: string): string {
  return `${ENGINEPC_URL}/partage/${data}`;
}

function decodeBase64Url(data: string): string {
  if (!/^[A-Za-z0-9_-]+={0,2}$/.test(data)) throw new Error('Lien de configuration invalide (encodage).');
  const b64 = data.replace(/-/g, '+').replace(/_/g, '/').replace(/=+$/, '');
  const bytes = Uint8Array.from(atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4)), (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

/** « amd-ryzen-7-9800x3d » → « amd ryzen 7 9800x3d ». */
export function slotIdToQuery(id: string): string {
  return id.replace(/[-_]+/g, ' ').trim();
}

// Slot EnginePC → catégorie SearchIT. « storage » reste générique (SSD ou disque dur).
function slotCategory(slot: string): CategoryId {
  return fromExternalCategory(slot) ?? 'other';
}

export interface ParsedConfiguration {
  name: string;
  items: ListItem[];
}

/** Décode et valide une configuration EnginePC. Lève une Error au message affichable. */
export function parseConfiguration(data: string | null): ParsedConfiguration {
  if (!data) throw new Error('Aucune configuration à importer : le paramètre « data » est absent.');
  if (data.length > MAX_DATA_LENGTH) throw new Error('Configuration trop volumineuse.');
  let raw: unknown;
  try {
    raw = JSON.parse(decodeBase64Url(data));
  } catch (err) {
    throw new Error(err instanceof Error && err.message.startsWith('Lien') ? err.message : 'Lien de configuration illisible (JSON invalide).');
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Configuration invalide.');
  const cfg = raw as Record<string, unknown>;
  const slots = cfg.slots && typeof cfg.slots === 'object' && !Array.isArray(cfg.slots) ? (cfg.slots as Record<string, unknown>) : {};
  const ramKits = Number(slots.ramKits);
  const now = new Date().toISOString();
  const items = new Map<string, ListItem>();

  for (const [slot, value] of Object.entries(slots)) {
    if (slot === 'ramKits') continue;
    for (const id of Array.isArray(value) ? value : [value]) {
      if (typeof id !== 'string' || !SLOT_ID.test(id)) continue;
      const ref = `${REF_PREFIX}${slot}:${id}`;
      const existing = items.get(ref);
      if (existing) {
        existing.quantity += 1;
        continue;
      }
      if (items.size >= MAX_PARTS) break;
      const query = slotIdToQuery(id);
      const quantity = slot === 'ram' && Number.isInteger(ramKits) && ramKits > 1 && ramKits <= 8 ? ramKits : 1;
      items.set(ref, { ref, query, title: query, category: slotCategory(slot), quantity, priceWhenAdded: 0, addedAt: now });
    }
  }
  if (!items.size) throw new Error('Cette configuration ne contient aucun composant.');
  const name = typeof cfg.name === 'string' && cfg.name.trim() ? cfg.name.trim().slice(0, 120) : 'Configuration EnginePC';
  return { name, items: [...items.values()] };
}

/** Remplace la configuration EnginePC précédente dans la liste (les ajouts manuels sont conservés). */
export function importConfiguration(data: string, parsed: ParsedConfiguration): void {
  listStore.set((items) => [...items.filter((i) => !i.ref.startsWith(REF_PREFIX)), ...parsed.items]);
  enginePcStore.set({ name: parsed.name, data });
}
