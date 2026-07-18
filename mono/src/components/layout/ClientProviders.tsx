'use client';

import React, { useEffect } from 'react';
import { SearchOverlay } from '@/components/sections/SearchOverlay';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';

/**
 * Client-side providers and global overlays.
 * Rendered inside the root layout to provide search overlay across all pages.
 * Also bootstraps auth and syncs the server cart into Zustand on load.
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const syncFromBackend = useCartStore((state) => state.syncFromBackend);

  useEffect(() => {
    // 1. Restore auth session from stored token
    // 2. Once resolved, sync server cart into Zustand
    initializeAuth().then(() => {
      syncFromBackend();
    });
  }, [initializeAuth, syncFromBackend]);

  return (
    <>
      {children}
      <SearchOverlay />
    </>
  );
}
