'use client';

import React, { useRef, useEffect } from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Typography } from '@/components/ui/Typography';
import { pressItems } from '@/data/press';
import { gsap } from '@/animations/gsap.config';
import { SCROLL_START, LUXURY_EASE, STAGGER_BASE } from '@/animations/constants';

export function Press() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title
      const title = sectionRef.current?.querySelector('.press-title');
      if (title) {
        gsap.fromTo(
          title,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: LUXURY_EASE,
            scrollTrigger: { trigger: title, start: SCROLL_START },
          }
        );
      }

      // Logos stagger fade
      const logos = sectionRef.current?.querySelectorAll('.press-logo');
      if (logos && logos.length > 0) {
        gsap.fromTo(
          logos,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.6,
            ease: LUXURY_EASE,
            stagger: STAGGER_BASE,
            scrollTrigger: { trigger: logos[0], start: SCROLL_START },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="press" spacing="default" ref={sectionRef}>
      <Container>
        <div className="press-title text-center mb-12 sm:mb-16">
          <Typography variant="label" muted>
            As Featured In
          </Typography>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-12">
          {pressItems.map((item) => (
            <div
              key={item.slug}
              className="press-logo flex items-center justify-center py-4 group cursor-pointer"
            >
              <span className="font-display text-[20px] sm:text-[24px] font-bold text-mono-black/20 group-hover:text-mono-black/60 transition-all duration-500 select-none tracking-wide">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
