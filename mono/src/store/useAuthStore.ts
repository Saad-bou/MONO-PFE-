import { create } from 'zustand';
import { login as loginService, register as registerService, getMe, LoginPayload, RegisterPayload } from '@/services/auth.service';
import { TOKEN_KEY } from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';

interface AuthState {
  user: Record<string, unknown> | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginPayload) => Promise<Record<string, any>>;
  register: (credentials: RegisterPayload) => Promise<Record<string, any>>;
  logout: () => void;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  error: null,

  initializeAuth: async () => {
    if (typeof window === 'undefined') return;
    
    set({ isInitializing: true });
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      set({ isInitializing: false });
      return;
    }

    set({ token });

    try {
      const response = await getMe();
      const user = response.data.data;
      set({
        user,
        isAuthenticated: true,
        isInitializing: false,
      });
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isInitializing: false,
      });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginService(credentials);
      const { token, user } = response.data.data;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
      }
      
      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Sync server cart into Zustand after login
      useCartStore.getState().syncFromBackend();

      return user;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || error.message || 'An error occurred during login' 
      });
      throw error;
    }
  },

  register: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await registerService(credentials);
      const { token, user } = response.data.data;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
      }
      
      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Sync server cart into Zustand after registration
      useCartStore.getState().syncFromBackend();

      return user;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || error.message || 'An error occurred during registration' 
      });
      throw error;
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
    // Clear local cart so next user starts fresh
    useCartStore.getState().clearCart();
  },


  clearError: () => set({ error: null }),
}));
