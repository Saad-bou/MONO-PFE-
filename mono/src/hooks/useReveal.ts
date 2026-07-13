'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/animations/gsap.config';
import { AnimationPreset } from '@/animations/presets';
import { SCROLL_START } from '@/animations/constants';

interface UseRevealOptions {
  preset: AnimationPreset;
  trigger?: string;
  start?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

/**
 * GSAP ScrollTrigger reveal hook.
 * Animates elements into view when they enter the viewport.
 */
export function useReveal<T extends HTMLElement>({
  preset,
  trigger,
  start = SCROLL_START,
  delay = 0,
  stagger,
  once = true,
}: UseRevealOptions) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const targets = trigger ? element.querySelectorAll(trigger) : element;

    gsap.set(targets, preset.from);

    const animation = gsap.to(targets, {
      ...preset.to,
      delay,
      ...(stagger !== undefined && { stagger }),
      scrollTrigger: {
        trigger: element,
        start,
        once,
      },
    });

    return () => {
      animation.kill();
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === element)
        .forEach((st) => st.kill());
    };
  }, [preset, trigger, start, delay, stagger, once]);

  return ref;
}
