/**
 * MONO — GSAP Animation Presets
 * Reusable animation configurations for consistent luxury feel.
 */

import {
  LUXURY_EASE,
  REVEAL_EASE,
  SOFT_EASE,
  ENTRANCE_EASE,
  DURATION_BASE,
  DURATION_SLOW,
  DURATION_FAST,
  DURATION_HERO,
  STAGGER_BASE,
  STAGGER_TIGHT,
} from './constants';

export interface AnimationPreset {
  from: gsap.TweenVars;
  to: gsap.TweenVars;
}

/** Default section content reveal — slides up and fades in */
export const fadeUp: AnimationPreset = {
  from: {
    y: 60,
    opacity: 0,
  },
  to: {
    y: 0,
    opacity: 1,
    duration: DURATION_BASE,
    ease: LUXURY_EASE,
  },
};

/** Subtle element appearance */
export const fadeIn: AnimationPreset = {
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
    duration: DURATION_BASE,
    ease: SOFT_EASE,
  },
};

/** Image/placeholder mask reveal from bottom */
export const maskReveal: AnimationPreset = {
  from: {
    clipPath: 'inset(100% 0% 0% 0%)',
  },
  to: {
    clipPath: 'inset(0% 0% 0% 0%)',
    duration: DURATION_SLOW,
    ease: REVEAL_EASE,
  },
};

/** Hero headline text reveal — per-line y translation */
export const textReveal: AnimationPreset = {
  from: {
    y: '110%',
    opacity: 0,
  },
  to: {
    y: '0%',
    opacity: 1,
    duration: DURATION_SLOW,
    ease: ENTRANCE_EASE,
    stagger: STAGGER_TIGHT,
  },
};

/** Cards and modal scale-in */
export const scaleIn: AnimationPreset = {
  from: {
    scale: 0.95,
    opacity: 0,
  },
  to: {
    scale: 1,
    opacity: 1,
    duration: DURATION_BASE,
    ease: LUXURY_EASE,
  },
};

/** Grid items stagger up */
export const staggerUp: AnimationPreset = {
  from: {
    y: 40,
    opacity: 0,
  },
  to: {
    y: 0,
    opacity: 1,
    duration: DURATION_BASE,
    ease: LUXURY_EASE,
    stagger: STAGGER_BASE,
  },
};

/** Fast fade out for exiting elements */
export const fadeOut: AnimationPreset = {
  from: {
    opacity: 1,
  },
  to: {
    opacity: 0,
    duration: DURATION_FAST,
    ease: SOFT_EASE,
  },
};

/** Hero-specific slow reveal */
export const heroReveal: AnimationPreset = {
  from: {
    y: 80,
    opacity: 0,
  },
  to: {
    y: 0,
    opacity: 1,
    duration: DURATION_HERO,
    ease: ENTRANCE_EASE,
    stagger: STAGGER_TIGHT,
  },
};
