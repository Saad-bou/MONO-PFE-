import { create } from 'zustand';
import { TryOnSession } from '@/types/tryon';

interface TryOnState {
  session: TryOnSession;

  // Actions
  setUploadedImage: (image: string) => void;
  setStatus: (status: TryOnSession['status']) => void;
  selectProduct: (productId: string) => void;
  setResult: (resultImage: string) => void;
  reset: () => void;
}

const initialSession: TryOnSession = {
  id: '',
  status: 'idle',
  uploadedImage: null,
  resultImage: null,
  selectedProductId: null,
};

export const useTryOnStore = create<TryOnState>((set) => ({
  session: { ...initialSession },

  setUploadedImage: (image) =>
    set((state) => ({
      session: {
        ...state.session,
        uploadedImage: image,
        status: 'uploading',
      },
    })),

  setStatus: (status) =>
    set((state) => ({
      session: { ...state.session, status },
    })),

  selectProduct: (productId) =>
    set((state) => ({
      session: { ...state.session, selectedProductId: productId },
    })),

  setResult: (resultImage) =>
    set((state) => ({
      session: {
        ...state.session,
        resultImage,
        status: 'complete',
      },
    })),

  reset: () => set({ session: { ...initialSession } }),
}));
