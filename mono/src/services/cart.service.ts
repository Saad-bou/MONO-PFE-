import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { CartItem } from '@/types/cart';

export interface AddCartItemPayload {
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

// ── Adapter: normalize a backend cart item into the UI CartItem shape ──
// Backend shape per item:
//   { variantId, quantity, unitPrice, lineTotal,
//     variant: { id, color: { name }, size: { name },
//       product: { id, name, price, images: [{ url }] } } }
export const transformCartItem = (item: any): CartItem => ({
  variantId: item.variantId || item.variant?.id || '',
  productId: item.variant?.product?.id || '',
  name: item.variant?.product?.name || '',
  color: item.variant?.color?.name || '',
  size: item.variant?.size?.name || '',
  price: Number(item.unitPrice ?? item.variant?.product?.price ?? 0),
  quantity: item.quantity,
  image: item.variant?.product?.images?.[0]?.url || null,
});

export const getCart = () => api.get<ApiResponse<unknown>>('/cart');

export const addCartItem = (payload: AddCartItemPayload) =>
  api.post<ApiResponse<unknown>>('/cart', payload);

export const updateCartItem = (variantId: string, payload: UpdateCartItemPayload) =>
  api.put<ApiResponse<unknown>>(`/cart/${variantId}`, payload);

export const removeCartItem = (variantId: string) =>
  api.delete<ApiResponse<unknown>>(`/cart/${variantId}`);

export const clearCart = () => api.delete<ApiResponse<unknown>>('/cart');
