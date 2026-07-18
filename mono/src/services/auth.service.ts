import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthData {
  token: string;
  user: Record<string, unknown>;
}

export const register = (payload: RegisterPayload) =>
  api.post<ApiResponse<AuthData>>('/auth/register', payload);

export const login = (payload: LoginPayload) =>
  api.post<ApiResponse<AuthData>>('/auth/login', payload);

export const getMe = () => api.get<ApiResponse<Record<string, unknown>>>('/auth/me');
