import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';

export interface CreateTryOnPayload {
  productId: string;
  userImage: string;
}

export const createTryOn = (payload: CreateTryOnPayload) =>
  api.post<ApiResponse<Record<string, unknown>>>('/ai-try-on', payload, {
    timeout: 120_000, // AI generation is synchronous on backend — may take up to ~60s
  });

export const getMyTryOns = () =>
  api.get<ApiResponse<unknown[]>>('/ai-try-on');

export const getTryOnById = (id: string) =>
  api.get<ApiResponse<Record<string, unknown>>>(`/ai-try-on/${id}`);

export const deleteTryOn = (id: string) =>
  api.delete<ApiResponse<unknown>>(`/ai-try-on/${id}`);
