import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const SERVER_ROOT = path.resolve(here, '..');

function int(name: string, fallback: number): number {
  const v = Number.parseInt(process.env[name] ?? '', 10);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

function list(name: string): string[] {
  return (process.env[name] ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function trustProxy(): boolean | string[] {
  const v = list('TRUST_PROXY');
  if (v.length === 1 && v[0] === 'false') return false;
  if (!v.length || (v.length === 1 && v[0] === 'true')) return ['127.0.0.1', '::1', '10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'];
  return v;
}

export type DemoMode = 'auto' | 'on' | 'off';

export const config = {
  port: int('PORT', 8787),
  host: process.env.HOST ?? '0.0.0.0',
  /** Origines autorisées (CORS). Vide ou « * » = toutes, utile pour brancher le configurateur. */
  corsOrigins: list('CORS_ORIGINS'),
  /** Clés d'API optionnelles exigées sur /api/v1/* (x-api-key ou Authorization: Bearer). Vide = accès libre. */
  apiKeys: list('API_KEYS'),
  /** auto : démo active seulement si aucune source réelle n'est configurée. */
  demoMode: (['auto', 'on', 'off'].includes(process.env.DEMO_MODE ?? '') ? process.env.DEMO_MODE : 'auto') as DemoMode,
  /**
   * Proxys de confiance pour X-Forwarded-For. Vide ou « true » : local + réseaux privés (Docker),
   * jamais « tout le monde », sinon n'importe qui choisirait son IP et contournerait le rate limit.
   * « false » : SearchIT exposé directement. Sinon liste d'adresses/CIDR séparées par des virgules.
   */
  trustProxy: trustProxy(),
  searchTimeoutMs: int('SEARCH_TIMEOUT_MS', 8000),
  cacheTtlSeconds: int('CACHE_TTL_SECONDS', 600),
  feedRefreshMinutes: int('FEED_REFRESH_MINUTES', 360),
  cacheDir: path.resolve(SERVER_ROOT, process.env.CACHE_DIR ?? '.cache'),
  customMerchantsFile: path.resolve(SERVER_ROOT, process.env.CUSTOM_MERCHANTS_FILE ?? 'config/custom-merchants.json'),
  publicStoresFile: path.resolve(SERVER_ROOT, process.env.PUBLIC_STORES_FILE ?? 'config/public-stores.json'),
  webDist: path.resolve(SERVER_ROOT, '../web/dist'),
  /** Adresse publique du site (sitemap, liens absolus). */
  publicUrl: (process.env.PUBLIC_URL ?? 'https://searchit.heiphaistos.org').replace(/\/+$/, ''),
  /** Historique des prix (« off » pour désactiver). */
  historyFile: process.env.HISTORY_FILE === 'off' ? null : path.resolve(SERVER_ROOT, process.env.HISTORY_FILE ?? '.cache/history.json'),
  /** Recherches autorisées par minute et par IP (0 = illimité) ; le reste de /api/* a 4× ce quota. */
  rateLimitPerMinute: Number.parseInt(process.env.RATE_LIMIT_PER_MINUTE ?? '', 10) >= 0 && process.env.RATE_LIMIT_PER_MINUTE ? Number.parseInt(process.env.RATE_LIMIT_PER_MINUTE, 10) : 60,
  /** Jeton du tableau de bord /admin (vide = administration désactivée). */
  adminToken: process.env.ADMIN_TOKEN?.trim() || null,
};

export function env(name: string): string | undefined {
  const v = process.env[name]?.trim();
  return v ? v : undefined;
}
