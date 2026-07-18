import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';

export interface CollectionPayload {
  name: string;
  isFeatured?: boolean;
}

export interface CollectionQuery {
  isFeatured?: boolean;
  limit?: number;
}

// ── Adapter: normalize backend collection to the shape the UI expects ──
// Backend has: id, name, slug, description, image, isFeatured, createdAt, updatedAt
// UI (men/women pages) also accesses: season, productCount, tagline
export const transformCollection = (c: any) => {
  if (!c) return c;
  return {
    ...c,
    id: c.id || '',
    name: c.name || '',
    slug: c.slug || '',
    description: c.description || '',
    image: c.image || null,
    isFeatured: c.isFeatured ?? false,
    // ── Fields absent from backend — safe UI fallbacks ──
    tagline: c.tagline || c.description || '',
    season: c.season || 'SS26',
    productCount: c.productCount ?? 0,
    category: c.category || 'all',
    featuredProductIds: c.featuredProductIds || [],
  };
};

const transformListResponse = (res: any) => {
  const raw = res.data?.data || res.data || [];
  if (Array.isArray(raw)) {
    if (res.data?.data) {
      res.data.data = raw.map(transformCollection);
    } else {
      res.data = raw.map(transformCollection);
    }
  }
  return res;
};

export const getCollections = (params?: CollectionQuery) =>
  api.get<ApiResponse<unknown[]>>('/collections', { params }).then(transformListResponse);

export const getCollectionById = (id: string) =>
  api.get<ApiResponse<Record<string, unknown>>>(`/collections/${id}`);

export const createCollection = (payload: CollectionPayload) =>
  api.post<ApiResponse<Record<string, unknown>>>('/collections', payload);

export const updateCollection = (id: string, payload: CollectionPayload) =>
  api.put<ApiResponse<Record<string, unknown>>>(`/collections/${id}`, payload);

export const deleteCollection = (id: string) =>
  api.delete<ApiResponse<{ id: string }>>(`/collections/${id}`);

