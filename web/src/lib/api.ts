import type { Category, CategoryGroup, LookupRequest, LookupResponse, MerchantInfo, SearchParams, SearchResponse } from '@shared/types';

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
  merchants: () => request<{ demo: boolean; merchants: Array<MerchantInfo & { details?: Record<string, unknown> }> }>('/api/merchants'),
  categories: () => request<{ groups: Record<CategoryGroup, string>; categories: Omit<Category, 'keywords'>[] }>('/api/categories'),
};
