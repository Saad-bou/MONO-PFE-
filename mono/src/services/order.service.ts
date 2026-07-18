import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';

export type PaymentMethod = 'CASH_ON_DELIVERY';

export interface CheckoutPayload {
  shippingAddress: string;
  paymentMethod: PaymentMethod;
}

export interface UpdateOrderStatusPayload {
  status: string;
}

export const checkout = (payload: CheckoutPayload) =>
  api.post<ApiResponse<Record<string, unknown>>>('/orders/checkout', payload);

export const getMyOrders = () =>
  api.get<ApiResponse<unknown[]>>('/orders');

export const getOrderById = (id: string) =>
  api.get<ApiResponse<Record<string, unknown>>>(`/orders/${id}`);

export const getAllOrders = () =>
  api.get<ApiResponse<unknown[]>>('/orders/admin');

export const updateOrderStatus = (id: string, payload: UpdateOrderStatusPayload) =>
  api.patch<ApiResponse<Record<string, unknown>>>(`/orders/${id}/status`, payload);
