import { create } from 'zustand';
import { CartItem } from '@/types/cart';

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, color: string, size: string) => void;
  updateQuantity: (productId: string, color: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed
  getTotal: () => number;
  getCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isCartOpen: false,

  addItem: (item) =>
    set((state) => {
      const existingIndex = state.items.findIndex(
        (i) =>
          i.productId === item.productId &&
          i.color === item.color &&
          i.size === item.size
      );

      if (existingIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + item.quantity,
        };
        return { items: updatedItems };
      }

      return { items: [...state.items, item] };
    }),

  removeItem: (productId, color, size) =>
    set((state) => ({
      items: state.items.filter(
        (i) =>
          !(i.productId === productId && i.color === color && i.size === size)
      ),
    })),

  updateQuantity: (productId, color, size, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId && i.color === color && i.size === size
          ? { ...i, quantity: Math.max(0, quantity) }
          : i
      ).filter((i) => i.quantity > 0),
    })),

  clearCart: () => set({ items: [] }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  getTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getCount: () => {
    const { items } = get();
    return items.reduce((count, item) => count + item.quantity, 0);
  },
}));
