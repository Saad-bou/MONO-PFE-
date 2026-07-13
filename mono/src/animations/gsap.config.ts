'use client';

/**
 * MONO — GSAP Configuration
 * Registers GSAP plugins for use across the application.
 * Must be imported once in the root layout or a top-level provider.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Set GSAP defaults for luxury feel
gsap.defaults({
  ease: 'power3.out',
  duration: 0.8,
});

// Configure ScrollTrigger defaults
ScrollTrigger.defaults({
  toggleActions: 'play none none none',
});

export { gsap, ScrollTrigger };
