'use client';

import React from 'react';
import { SearchOverlay } from '@/components/sections/SearchOverlay';

/**
 * Client-side providers and global overlays.
 * Rendered inside the root layout to provide search overlay across all pages.
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SearchOverlay />
    </>
  );
}
