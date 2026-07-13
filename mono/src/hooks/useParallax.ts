'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/animations/gsap.config';
import { PARALLAX_AMOUNT } from '@/animations/constants';

interface UseParallaxOptions {
  amount?: number;
  start?: string;
  end?: string;
}

/**
 * Subtle parallax effect on scroll.
 * Moves the element vertically based on scroll position.
 */
export function useParallax<T extends HTMLElement>({
  amount = PARALLAX_AMOUNT,
  start = 'top bottom',
  end = 'bottom top',
}: UseParallaxOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const animation = gsap.fromTo(
      element,
      { y: -amount },
      {
        y: amount,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start,
          end,
          scrub: true,
        },
      }
    );

    return () => {
      animation.kill();
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === element)
        .forEach((st) => st.kill());
    };
  }, [amount, start, end]);

  return ref;
}
