import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';

export interface CategoryPayload {
  name: string;
}

export const getCategories = () =>
  api.get<ApiResponse<unknown[]>>('/categories');

export const getCategoryById = (id: string) =>
  api.get<ApiResponse<Record<string, unknown>>>(`/categories/${id}`);

export const createCategory = (payload: CategoryPayload) =>
  api.post<ApiResponse<Record<string, unknown>>>('/categories', payload);

export const updateCategory = (id: string, payload: CategoryPayload) =>
  api.put<ApiResponse<Record<string, unknown>>>(`/categories/${id}`, payload);

export const deleteCategory = (id: string) =>
  api.delete<ApiResponse<{ id: string }>>(`/categories/${id}`);
