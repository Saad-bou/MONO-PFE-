import { create } from 'zustand';
import { CartItem } from '@/types/cart';
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartApi,
  transformCartItem,
} from '@/services/cart.service';
import { TOKEN_KEY } from '@/lib/axios';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** True if the user has a valid auth token — cart mutations require auth */
const isAuthenticated = () =>
  typeof window !== 'undefined' && !!localStorage.getItem(TOKEN_KEY);

/** Silently fire a backend mutation; never throws so UI is never blocked */
const fireAndForget = (fn: () => Promise<unknown>) => {
  fn().catch(() => {/* backend sync failure — UI state already updated */});
};

// ── State ─────────────────────────────────────────────────────────────────────

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  isSyncing: boolean;

  // ── Actions (public interface unchanged from original) ──
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, color: string, size: string) => void;
  updateQuantity: (productId: string, color: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // ── Backend sync ──
  syncFromBackend: () => Promise<void>;

  // ── Computed ──
  getTotal: () => number;
  getCount: () => number;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isCartOpen: false,
  isSyncing: false,

  // ── syncFromBackend ────────────────────────────────────────────────────────
  // Fetches the server cart and replaces local state.
  // Called on app boot (after auth resolves) and after login.
  syncFromBackend: async () => {
    if (!isAuthenticated()) return;
    set({ isSyncing: true });
    try {
      const res = await getCart();
      const data: any = (res.data as any).data || {};
      const rawItems: any[] = data.items || [];
      const items = rawItems.map(transformCartItem);
      set({ items });
    } catch {
      // server unreachable — keep local state as-is
    } finally {
      set({ isSyncing: false });
    }
  },

  // ── addItem ───────────────────────────────────────────────────────────────
  addItem: (item) => {
    // 1. Optimistic local update
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
    });

    // 2. Backend sync (only if variantId is available and user is authed)
    if (item.variantId && isAuthenticated()) {
      const existingItem = get().items.find(
        (i) => i.variantId === item.variantId
      );
      fireAndForget(() =>
        addCartItem({ variantId: item.variantId!, quantity: item.quantity })
      );
    }
  },

  // ── removeItem ────────────────────────────────────────────────────────────
  removeItem: (productId, color, size) => {
    // Find variantId before removing from state
    const target = get().items.find(
      (i) => i.productId === productId && i.color === color && i.size === size
    );

    // 1. Optimistic local update
    set((state) => ({
      items: state.items.filter(
        (i) =>
          !(i.productId === productId && i.color === color && i.size === size)
      ),
    }));

    // 2. Backend sync
    if (target?.variantId && isAuthenticated()) {
      fireAndForget(() => removeCartItem(target.variantId!));
    }
  },

  // ── updateQuantity ────────────────────────────────────────────────────────
  updateQuantity: (productId, color, size, quantity) => {
    // Find variantId before mutation
    const target = get().items.find(
      (i) => i.productId === productId && i.color === color && i.size === size
    );

    // 1. Optimistic local update
    set((state) => ({
      items: state.items
        .map((i) =>
          i.productId === productId && i.color === color && i.size === size
            ? { ...i, quantity: Math.max(0, quantity) }
            : i
        )
        .filter((i) => i.quantity > 0),
    }));

    // 2. Backend sync
    if (target?.variantId && isAuthenticated()) {
      if (quantity <= 0) {
        fireAndForget(() => removeCartItem(target.variantId!));
      } else {
        fireAndForget(() => updateCartItem(target.variantId!, { quantity }));
      }
    }
  },

  // ── clearCart ─────────────────────────────────────────────────────────────
  clearCart: () => {
    set({ items: [] });
    if (isAuthenticated()) {
      fireAndForget(() => clearCartApi());
    }
  },

  // ── UI toggle ─────────────────────────────────────────────────────────────
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  // ── Computed ──────────────────────────────────────────────────────────────
  getTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getCount: () => {
    const { items } = get();
    return items.reduce((count, item) => count + item.quantity, 0);
  },
}));
