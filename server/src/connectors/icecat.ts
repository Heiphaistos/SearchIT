import { env } from '../config.js';
import { TtlCache } from '../search/cache.js';
import { normalizeGtin } from '../search/normalize.js';

// Fiches techniques via Open Icecat : catalogue ouvert et gratuit de plusieurs millions
// de produits high-tech (images, caractéristiques), interrogeable par EAN ou par
// marque + référence fabricant. ICECAT_USERNAME = compte gratuit sur icecat.biz
// (le compte public de démonstration « openIcecat-live » est utilisé par défaut).

export interface ProductSheet {
  found: boolean;
  source: 'Icecat';
  title?: string;
  brand?: string;
  mpn?: string;
  image?: string;
  gallery?: string[];
  summary?: string;
  specs?: Array<{ group: string; items: Array<{ name: string; value: string }> }>;
  url?: string;
}

interface IcecatResponse {
  msg?: string;
  data?: {
    GeneralInfo?: {
      Title?: string;
      Brand?: string;
      BrandPartCode?: string;
      IcecatId?: number;
      SummaryDescription?: { ShortSummaryDescription?: string; LongSummaryDescription?: string };
    };
    Image?: { HighPic?: string; Pic500x500?: string };
    Gallery?: Array<{ Pic?: string; Pic500x500?: string }>;
    FeaturesGroups?: Array<{
      FeatureGroup?: { Name?: { Value?: string } };
      Features?: Array<{ Feature?: { Name?: { Value?: string } }; PresentationValue?: string }>;
    }>;
  };
}

export function mapIcecat(data: IcecatResponse): ProductSheet {
  const d = data.data;
  if (!d?.GeneralInfo) return { found: false, source: 'Icecat' };
  const info = d.GeneralInfo;
  const specs = (d.FeaturesGroups ?? [])
    .map((g) => ({
      group: g.FeatureGroup?.Name?.Value ?? 'Caractéristiques',
      items: (g.Features ?? [])
        .map((f) => ({ name: f.Feature?.Name?.Value ?? '', value: f.PresentationValue ?? '' }))
        .filter((f) => f.name && f.value),
    }))
    .filter((g) => g.items.length);
  return {
    found: true,
    source: 'Icecat',
    title: info.Title,
    brand: info.Brand,
    mpn: info.BrandPartCode,
    image: d.Image?.Pic500x500 || d.Image?.HighPic,
    gallery: (d.Gallery ?? []).map((g) => g.Pic500x500 || g.Pic).filter((u): u is string => Boolean(u)).slice(0, 8),
    summary: info.SummaryDescription?.LongSummaryDescription || info.SummaryDescription?.ShortSummaryDescription,
    specs,
    url: info.IcecatId ? `https://icecat.biz/p/${info.IcecatId}.html` : undefined,
  };
}

const cache = new TtlCache<ProductSheet>(7 * 24 * 3_600_000, 2_000);

export async function getProductSheet(input: { gtin?: string; brand?: string; mpn?: string; lang?: string }): Promise<ProductSheet> {
  const gtin = normalizeGtin(input.gtin);
  const lang = input.lang ?? 'fr';
  const params = new URLSearchParams({ UserName: env('ICECAT_USERNAME') ?? 'openIcecat-live', Language: lang });
  if (gtin) params.set('GTIN', gtin.replace(/^0+(?=\d{13}$)/, ''));
  else if (input.brand && input.mpn) {
    params.set('Brand', input.brand);
    params.set('ProductCode', input.mpn);
  } else return { found: false, source: 'Icecat' };

  const key = params.toString();
  const hit = cache.get(key);
  if (hit) return hit;
  const res = await fetch(`https://live.icecat.biz/api?${params}`, { signal: AbortSignal.timeout(8_000) });
  // Icecat répond 4xx quand le produit n'est pas dans le catalogue ouvert.
  const sheet = res.ok ? mapIcecat((await res.json()) as IcecatResponse) : { found: false, source: 'Icecat' as const };
  cache.set(key, sheet);
  return sheet;
}
