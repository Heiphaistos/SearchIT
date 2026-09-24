import type { Offer } from '../shared/types.js';
import { round2 } from './offer.js';

// Taux de change de référence de la Banque centrale européenne : gratuits, sans clé,
// publiés chaque jour ouvré (≈ 16 h CET). Tous les prix sont ramenés en euros pour
// pouvoir être comparés.
const ECB_URL = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';
const REFRESH_MS = 6 * 60 * 60_000;

/** Unités de devise par euro (ex. USD → 1.08). */
let rates = new Map<string, number>([['EUR', 1]]);
let fetchedAt = 0;
let lastSuccess = 0;
let pending: Promise<void> | null = null;

export function parseEcbXml(xml: string): Map<string, number> {
  const out = new Map<string, number>([['EUR', 1]]);
  for (const m of xml.matchAll(/currency=['"]([A-Z]{3})['"]\s+rate=['"]([\d.]+)['"]/g)) {
    const rate = Number.parseFloat(m[2]);
    if (rate > 0) out.set(m[1], rate);
  }
  return out;
}

export function setRates(next: Map<string, number>): void {
  rates = new Map([...next, ['EUR', 1]]);
  fetchedAt = Date.now();
  lastSuccess = fetchedAt;
}

export async function refreshRates(): Promise<void> {
  if (Date.now() - fetchedAt < REFRESH_MS) return;
  pending ??= (async () => {
    try {
      const res = await fetch(ECB_URL, { signal: AbortSignal.timeout(10_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const parsed = parseEcbXml(await res.text());
      if (parsed.size > 10) setRates(parsed);
    } catch (err) {
      console.error(`[bce] taux de change indisponibles: ${err instanceof Error ? err.message : err}`);
      fetchedAt = Date.now() - REFRESH_MS + 10 * 60_000; // nouvel essai dans 10 min
    } finally {
      pending = null;
    }
  })();
  return pending;
}

export function ratesInfo(): { currencies: number; fetchedAt: string | null } {
  return { currencies: rates.size, fetchedAt: lastSuccess ? new Date(lastSuccess).toISOString() : null };
}

/**
 * Convertit une offre en euros. Renvoie `null` si la devise est inconnue
 * (l'offre ne peut alors pas être comparée).
 */
export function toEur(offer: Offer): Offer | null {
  const currency = (offer.currency || 'EUR').toUpperCase();
  if (currency === 'EUR') return offer;
  const rate = rates.get(currency);
  if (!rate) return null;
  const conv = (n: number) => round2(n / rate);
  return {
    ...offer,
    price: conv(offer.price),
    shipping: offer.shipping === null ? null : conv(offer.shipping),
    totalPrice: conv(offer.totalPrice),
    currency: 'EUR',
    originalCurrency: currency,
    originalPrice: offer.price,
  };
}
