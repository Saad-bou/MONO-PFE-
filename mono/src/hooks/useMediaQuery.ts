'use client';

import { useEffect, useState } from 'react';
import { breakpoints, Breakpoint } from '@/config/breakpoints';

/**
 * Media query hook for responsive behavior.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

/**
 * Breakpoint-specific hooks.
 */
export function useIsMobile(): boolean {
  return !useMediaQuery(`(min-width: ${breakpoints.mobile}px)`);
}

export function useIsTablet(): boolean {
  return useMediaQuery(
    `(min-width: ${breakpoints.mobile}px) and (max-width: ${breakpoints.tablet - 1}px)`
  );
}

export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${breakpoints.tablet}px)`);
}
