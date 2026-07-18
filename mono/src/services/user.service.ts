import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const getProfile = () =>
  api.get<ApiResponse<Record<string, unknown>>>('/users/me');

export const updateProfile = (payload: UpdateProfilePayload) =>
  api.patch<ApiResponse<Record<string, unknown>>>('/users/me', payload);

export const changePassword = (payload: ChangePasswordPayload) =>
  api.patch<ApiResponse<unknown>>('/users/change-password', payload);
