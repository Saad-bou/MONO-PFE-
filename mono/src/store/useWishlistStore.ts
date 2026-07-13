import { create } from 'zustand';

interface WishlistState {
  productIds: string[];

  // Actions
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;

  // Computed
  getCount: () => number;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  productIds: [],

  addItem: (productId) =>
    set((state) => {
      if (state.productIds.includes(productId)) return state;
      return { productIds: [...state.productIds, productId] };
    }),

  removeItem: (productId) =>
    set((state) => ({
      productIds: state.productIds.filter((id) => id !== productId),
    })),

  toggleItem: (productId) => {
    const { productIds } = get();
    if (productIds.includes(productId)) {
      set({ productIds: productIds.filter((id) => id !== productId) });
    } else {
      set({ productIds: [...productIds, productId] });
    }
  },

  isInWishlist: (productId) => {
    return get().productIds.includes(productId);
  },

  clearWishlist: () => set({ productIds: [] }),

  getCount: () => get().productIds.length,
}));
