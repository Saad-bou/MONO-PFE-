'use client';

import React, { useRef, useEffect } from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Typography } from '@/components/ui/Typography';
import { Divider } from '@/components/ui/Divider';
import { gsap } from '@/animations/gsap.config';
import { SCROLL_START, LUXURY_EASE, STAGGER_LOOSE } from '@/animations/constants';

const pillars = [
  {
    number: '01',
    title: 'Craftsmanship',
    description:
      'Every stitch, every seam, every detail is considered. We partner with artisan manufacturers who share our obsession with quality.',
  },
  {
    number: '02',
    title: 'Minimalism',
    description:
      'We believe in the power of less. Each piece is distilled to its essential form — nothing added, nothing wasted.',
  },
  {
    number: '03',
    title: 'Technology',
    description:
      'From AI-powered try-on to intelligent fabric selection, technology enhances every step of the MONO experience.',
  },
  {
    number: '04',
    title: 'Sustainability',
    description:
      'Fewer, better things. Our approach to fashion is inherently sustainable — creating timeless pieces that last.',
  },
];

export function AboutMono() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title
      const title = sectionRef.current?.querySelector('.about-title');
      if (title) {
        gsap.fromTo(
          title,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: LUXURY_EASE,
            scrollTrigger: { trigger: title, start: SCROLL_START },
          }
        );
      }

      // Pillar cards stagger
      const items = sectionRef.current?.querySelectorAll('.about-pillar');
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: LUXURY_EASE,
            stagger: STAGGER_LOOSE,
            scrollTrigger: { trigger: items[0], start: SCROLL_START },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="about" spacing="large" ref={sectionRef}>
      <Container size="narrow">
        {/* Section header */}
        <div className="about-title text-center mb-16 sm:mb-20 lg:mb-24">
          <Typography variant="label" muted className="mb-4">
            Our Philosophy
          </Typography>
          <Typography variant="h1" className="mb-6">
            The MONO <span className="italic">Way</span>
          </Typography>
          <Typography variant="bodyLarge" muted className="max-w-[520px] mx-auto">
            We exist at the intersection of luxury and restraint.
            Every decision serves a single purpose — to create
            the most refined essentials for the modern individual.
          </Typography>
        </div>

        {/* Pillars */}
        <div className="flex flex-col">
          {pillars.map((pillar, index) => (
            <div key={pillar.number} className="about-pillar">
              {index === 0 && <Divider className="mb-0" />}
              <div className="py-8 sm:py-10 grid grid-cols-12 gap-4 items-start">
                {/* Number */}
                <div className="col-span-2 sm:col-span-1">
                  <Typography variant="caption" muted>
                    {pillar.number}
                  </Typography>
                </div>

                {/* Title */}
                <div className="col-span-10 sm:col-span-3">
                  <Typography variant="h4">{pillar.title}</Typography>
                </div>

                {/* Description */}
                <div className="col-span-12 sm:col-span-8">
                  <Typography variant="body" muted>
                    {pillar.description}
                  </Typography>
                </div>
              </div>
              <Divider />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
