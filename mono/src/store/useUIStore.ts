import { create } from 'zustand';

interface UIState {
  /** Whether the navbar has transitioned to solid white */
  isNavSolid: boolean;
  /** Mobile hamburger menu open state */
  isMobileMenuOpen: boolean;
  /** Currently active modal identifier */
  activeModal: string | null;
  /** Search query string */
  searchQuery: string;
  /** Fullscreen search overlay open state */
  isSearchOpen: boolean;

  // Actions
  setNavSolid: (solid: boolean) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  setSearchQuery: (query: string) => void;
  openSearch: () => void;
  closeSearch: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isNavSolid: false,
  isMobileMenuOpen: false,
  activeModal: null,
  searchQuery: '',
  isSearchOpen: false,

  setNavSolid: (solid) => set({ isNavSolid: solid }),
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  openSearch: () => set({ isSearchOpen: true, searchQuery: '' }),
  closeSearch: () => set({ isSearchOpen: false, searchQuery: '' }),
}));
