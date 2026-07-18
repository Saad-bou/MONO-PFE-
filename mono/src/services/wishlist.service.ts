import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';

export interface AddWishlistItemPayload {
  productId: string;
}

export const getWishlist = () =>
  api.get<ApiResponse<unknown>>('/wishlist');

export const addWishlistItem = (payload: AddWishlistItemPayload) =>
  api.post<ApiResponse<unknown>>('/wishlist', payload);

export const removeWishlistItem = (productId: string) =>
  api.delete<ApiResponse<unknown>>(`/wishlist/${productId}`);

export const clearWishlist = () =>
  api.delete<ApiResponse<unknown>>('/wishlist');
