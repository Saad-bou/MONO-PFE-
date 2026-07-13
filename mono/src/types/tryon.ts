export interface TryOnSession {
  id: string;
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  uploadedImage: string | null;
  resultImage: string | null;
  selectedProductId: string | null;
}
