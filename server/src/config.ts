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

export type DemoMode = 'auto' | 'on' | 'off';

export const config = {
  port: int('PORT', 8787),
  host: process.env.HOST ?? '0.0.0.0',
  /** Origines autorisées (CORS). Vide ou « * » = toutes, utile pour brancher le configurateur. */
  corsOrigins: list('CORS_ORIGINS'),
  /** Clés d'API optionnelles exigées sur /api/v1/* (en-tête x-api-key). Vide = accès libre. */
  apiKeys: list('API_KEYS'),
  /** auto : démo active seulement si aucune source réelle n'est configurée. */
  demoMode: (['auto', 'on', 'off'].includes(process.env.DEMO_MODE ?? '') ? process.env.DEMO_MODE : 'auto') as DemoMode,
  searchTimeoutMs: int('SEARCH_TIMEOUT_MS', 8000),
  cacheTtlSeconds: int('CACHE_TTL_SECONDS', 600),
  feedRefreshMinutes: int('FEED_REFRESH_MINUTES', 360),
  cacheDir: path.resolve(SERVER_ROOT, process.env.CACHE_DIR ?? '.cache'),
  customMerchantsFile: path.resolve(SERVER_ROOT, process.env.CUSTOM_MERCHANTS_FILE ?? 'config/custom-merchants.json'),
  publicStoresFile: path.resolve(SERVER_ROOT, process.env.PUBLIC_STORES_FILE ?? 'config/public-stores.json'),
  webDist: path.resolve(SERVER_ROOT, '../web/dist'),
};

export function env(name: string): string | undefined {
  const v = process.env[name]?.trim();
  return v ? v : undefined;
}
