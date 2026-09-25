import type { CatalogItem, CatalogListResponse, Category, CategoryGroup, CategoryId, Deal, LookupRequest, ReferenceInfo, LookupResponse, MerchantInfo, ProductGroup, SearchParams, SearchResponse } from '@shared/types';

export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new ApiError(data.error ?? `Erreur ${res.status}`, res.status);
  return data as T;
}

export function searchParamsToQuery(p: SearchParams): URLSearchParams {
  const qs = new URLSearchParams();
  if (p.q) qs.set('q', p.q);
  if (p.category) qs.set('category', p.category);
  if (p.conditions?.length) qs.set('conditions', p.conditions.join(','));
  if (p.merchants?.length) qs.set('merchants', p.merchants.join(','));
  if (p.minPrice !== undefined) qs.set('minPrice', String(p.minPrice));
  if (p.maxPrice !== undefined) qs.set('maxPrice', String(p.maxPrice));
  if (p.inStockOnly) qs.set('inStock', 'true');
  if (p.hideAccessories === false) qs.set('hideAccessories', 'false');
  if (p.sort && p.sort !== 'relevance') qs.set('sort', p.sort);
  if (p.page && p.page > 1) qs.set('page', String(p.page));
  return qs;
}

export const api = {
  search: (p: SearchParams, signal?: AbortSignal) => request<SearchResponse>(`/api/search?${searchParamsToQuery(p)}`, { signal }),
  lookup: (body: LookupRequest) =>
    request<LookupResponse>('/api/lookup', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }),
  /** Aperçu d'un produit : prix relus chez les marchands si le relevé est ancien. */
  refresh: (p: { q: string; category?: string; key: string; title: string }, signal?: AbortSignal) => {
    const qs = new URLSearchParams({ q: p.q, key: p.key, title: p.title });
    if (p.category) qs.set('category', p.category);
    return request<{ group: ProductGroup | null; refreshedAt: string }>(`/api/refresh?${qs}`, { signal });
  },
  health: () => request<{ status: string; demo: boolean }>('/api/health'),
  merchants: () => request<{ demo: boolean; merchants: Array<MerchantInfo & { details?: Record<string, unknown> }> }>('/api/merchants'),
  catalog: (params: Record<string, string | number | undefined>, signal?: AbortSignal) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') qs.set(k, String(v));
    return request<CatalogListResponse>(`/api/catalog?${qs}`, { signal });
  },
  catalogItem: (id: string) => request<{ product: CatalogItem; reference: ReferenceInfo; similar: CatalogItem[] }>(`/api/catalog/${encodeURIComponent(id)}`),
  catalogStats: () => request<{ products: number; categories: Array<{ id: CategoryId; count: number }>; brands: number }>('/api/catalog/stats'),
  deals: (category?: string) => request<{ deals: Deal[]; demo: boolean }>(`/api/deals${category ? `?category=${category}` : ''}`),
  adminStats: (token: string) => request<Record<string, unknown>>('/api/admin/stats', { headers: { 'x-admin-token': token } }),
  categories: () => request<{ groups: Record<CategoryGroup, string>; categories: Omit<Category, 'keywords'>[] }>('/api/categories'),
};
