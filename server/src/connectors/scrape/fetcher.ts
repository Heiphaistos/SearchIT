import type { ScrapeState } from '../../shared/types.js';
import { isAllowed, parseRobots, type RobotsRule } from './robots.js';

// Lecture polie des pages de recherche publiques des marchands :
//  - robots.txt lu et respecté (relu toutes les 24 h) ;
//  - User-Agent honnête qui identifie SearchIT ;
//  - une seule requête à la fois par domaine, au moins 2 s entre deux requêtes, 8 s maximum ;
//  - aucun contournement : un 403/429 ou une page de défi met le domaine en pause (backoff).

export const SCRAPE_USER_AGENT = 'SearchIT/1.2 (+https://searchit.heiphaistos.org; comparateur de prix)';
const MIN_GAP_MS = 2_000;
const TIMEOUT_MS = 8_000;
const ROBOTS_TTL_MS = 24 * 3_600_000;
const BASE_PAUSE_MS = 30 * 60_000;
const MAX_PAUSE_MS = 24 * 3_600_000;

// Pages de défi anti-robot connues (Cloudflare, DataDome, Akamai, PerimeterX, captchas).
const CHALLENGE = /cf-chl|challenge-platform|just a moment|datadome|captcha-delivery|px-captcha|_incapsula_|g-recaptcha|hcaptcha/i;

export class ScrapeRefused extends Error {
  constructor(readonly state: ScrapeState) {
    super(state.detail ?? state.status);
    this.name = 'ScrapeRefused';
  }
}

interface Domain {
  chain: Promise<unknown>;
  lastAt: number;
  robots?: { rules: RobotsRule[]; at: number; blocked?: string };
  pausedUntil: number;
  failures: number;
  state?: ScrapeState;
}

const domains = new Map<string, Domain>();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function domainOf(origin: string): Domain {
  let d = domains.get(origin);
  if (!d) {
    d = { chain: Promise.resolve(), lastAt: 0, pausedUntil: 0, failures: 0 };
    domains.set(origin, d);
  }
  return d;
}

/** Dernier état connu d'un domaine (page « Marchands »). */
export function domainState(origin: string): ScrapeState | undefined {
  const d = domains.get(origin);
  if (!d) return undefined;
  if (d.pausedUntil > Date.now()) return d.state;
  return d.state?.status === 'robots' ? d.state : { status: 'active' };
}

/** Réservé aux tests. */
export function resetDomains(): void {
  domains.clear();
}

function pause(d: Domain, detail: string): ScrapeRefused {
  const ms = Math.min(MAX_PAUSE_MS, BASE_PAUSE_MS * 2 ** d.failures);
  d.failures += 1;
  d.pausedUntil = Date.now() + ms;
  d.state = { status: 'blocked', detail, pausedUntil: new Date(d.pausedUntil).toISOString() };
  return new ScrapeRefused(d.state);
}

/** Requête sérialisée par domaine, espacée d'au moins 2 s. */
function queued<T>(d: Domain, task: () => Promise<T>): Promise<T> {
  const run = d.chain.then(async () => {
    const wait = d.lastAt + MIN_GAP_MS - Date.now();
    if (wait > 0) await sleep(wait);
    try {
      return await task();
    } finally {
      d.lastAt = Date.now();
    }
  });
  d.chain = run.catch(() => undefined);
  return run;
}

async function get(url: string, signal?: AbortSignal): Promise<Response> {
  const timeout = AbortSignal.timeout(TIMEOUT_MS);
  return fetch(url, {
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    headers: { 'user-agent': SCRAPE_USER_AGENT, accept: 'text/html,application/xhtml+xml', 'accept-language': 'fr-FR,fr;q=0.9' },
  });
}

async function robotsFor(d: Domain, origin: string, signal?: AbortSignal): Promise<RobotsRule[]> {
  if (d.robots && Date.now() - d.robots.at < ROBOTS_TTL_MS) {
    if (d.robots.blocked) throw pause(d, d.robots.blocked);
    return d.robots.rules;
  }
  const res = await queued(d, () => get(`${origin}/robots.txt`, signal));
  // RFC 9309 : 4xx = pas de restriction ; 5xx = tout interdit. Un 401/403/429 est ici l'anti-robot lui-même.
  if ([401, 403, 429].includes(res.status)) {
    d.robots = { rules: [], at: Date.now(), blocked: `HTTP ${res.status} dès robots.txt : protection anti-robot` };
    throw pause(d, d.robots.blocked!);
  }
  const text = res.ok ? await res.text() : '';
  const rules = res.status >= 500 ? parseRobots('User-agent: *\nDisallow: /', 'searchit') : parseRobots(text, 'searchit');
  d.robots = { rules, at: Date.now() };
  return rules;
}

function checkRobots(d: Domain, rules: RobotsRule[], url: URL): void {
  if (isAllowed(rules, url.pathname + url.search)) return;
  d.state = { status: 'robots', detail: `robots.txt interdit ${url.pathname}` };
  throw new ScrapeRefused(d.state);
}

/** Page HTML de `url`, dans le respect des règles ci-dessus. */
export async function politeFetch(url: string, signal?: AbortSignal): Promise<{ html: string; finalUrl: string }> {
  const target = new URL(url);
  const d = domainOf(target.origin);
  if (d.pausedUntil > Date.now()) throw new ScrapeRefused(d.state!);
  const rules = await robotsFor(d, target.origin, signal);
  checkRobots(d, rules, target);
  const res = await queued(d, () => get(url, signal));
  const html = await res.text();
  if ([403, 429, 503].includes(res.status) || CHALLENGE.test(html.slice(0, 20_000))) {
    throw pause(d, res.ok ? 'Page de défi anti-robot' : `HTTP ${res.status} : protection anti-robot ou limite de débit`);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} sur ${target.pathname}`);
  // Redirection vers une page interdite (ex. recherche générique) : on n'exploite pas la réponse.
  const final = new URL(res.url || url);
  if (final.origin === target.origin) checkRobots(d, rules, final);
  d.failures = 0;
  d.state = { status: 'active' };
  return { html, finalUrl: final.href };
}
