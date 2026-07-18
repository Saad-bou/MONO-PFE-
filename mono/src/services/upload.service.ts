import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';

const uploadFile = (endpoint: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post<ApiResponse<Record<string, unknown>>>(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const uploadAvatar = (file: File) => uploadFile('/upload/avatar', file);

export const uploadProductImage = (file: File) => uploadFile('/upload/product', file);

export const uploadTryOnImage = (file: File) => uploadFile('/upload/try-on', file);
