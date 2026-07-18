import { create } from 'zustand';
import { TryOnSession } from '@/types/tryon';
import { uploadTryOnImage } from '@/services/upload.service';
import { createTryOn } from '@/services/aiTryOn.service';

const getBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  return apiUrl.replace('/api', '');
};

const resolveImageUrl = (url: string) => {
  if (!url) return url;
  if (url.startsWith('/uploads')) {
    return `${getBaseUrl()}${url}`;
  }
  return url;
};

interface TryOnState {
  session: TryOnSession;
  error: string | null;

  // Actions
  setUploadedImage: (image: string) => void;
  setStatus: (status: TryOnSession['status']) => void;
  selectProduct: (productId: string) => void;
  setResult: (resultImage: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  // Real API flow: upload file → call AI → update session
  submitTryOn: (file: File) => Promise<void>;
}

const initialSession: TryOnSession = {
  id: '',
  status: 'idle',
  uploadedImage: null,
  resultImage: null,
  selectedProductId: null,
};

export const useTryOnStore = create<TryOnState>((set, get) => ({
  session: { ...initialSession },
  error: null,

  setUploadedImage: (image) =>
    set((state) => ({
      session: { ...state.session, uploadedImage: image, status: 'uploading' },
    })),

  setStatus: (status) =>
    set((state) => ({ session: { ...state.session, status } })),

  selectProduct: (productId) =>
    set((state) => ({ session: { ...state.session, selectedProductId: productId } })),

  setResult: (resultImage) =>
    set((state) => ({
      session: { ...state.session, resultImage, status: 'complete' },
    })),

  setError: (error) => set({ error }),

  reset: () => set({ session: { ...initialSession }, error: null }),

  submitTryOn: async (file: File) => {
    const { session } = get();

    if (!session.selectedProductId) {
      set({ error: 'No product selected. Please try again from a product page.' });
      return;
    }

    // ── Phase 1: Upload ────────────────────────────────────────────────────
    set((state) => ({
      session: { ...state.session, status: 'uploading' },
      error: null,
    }));

    let uploadedImageUrl: string;
    try {
      const uploadRes = await uploadTryOnImage(file);
      // Backend returns { success, data: { url } }
      uploadedImageUrl =
        (uploadRes.data?.data as Record<string, string>)?.url ?? '';

      uploadedImageUrl = resolveImageUrl(uploadedImageUrl);

      if (!uploadedImageUrl) throw new Error('Upload response did not contain an image URL.');

      set((state) => ({
        session: { ...state.session, uploadedImage: uploadedImageUrl },
      }));
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err as Error)?.message ??
        'Image upload failed. Please try again.';
      set((state) => ({
        session: { ...state.session, status: 'error' },
        error: msg,
      }));
      return;
    }

    // ── Phase 2: AI Processing ─────────────────────────────────────────────
    set((state) => ({
      session: { ...state.session, status: 'processing' },
    }));

    try {
      const aiRes = await createTryOn({
        productId: session.selectedProductId,
        userImage: uploadedImageUrl,
      });

      const record = aiRes.data?.data as Record<string, unknown> | undefined;
      let generatedImage = (record?.generatedImage as string) ?? '';
      const backendStatus = (record?.status as string) ?? '';

      generatedImage = resolveImageUrl(generatedImage);

      if (backendStatus === 'FAILED' || !generatedImage) {
        throw new Error('AI generation failed. Please try with a different photo.');
      }

      set((state) => ({
        session: {
          ...state.session,
          id: (record?.id as string) ?? '',
          resultImage: generatedImage,
          status: 'complete',
        },
      }));
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err as Error)?.message ??
        'AI generation failed. Please try again.';
      set((state) => ({
        session: { ...state.session, status: 'error' },
        error: msg,
      }));
    }
  },
}));
