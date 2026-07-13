'use client';

import React, { useRef, useEffect } from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Typography } from '@/components/ui/Typography';
import { JournalCard } from '@/components/cards/JournalCard';
import { articles } from '@/data/journal';
import { gsap } from '@/animations/gsap.config';
import { SCROLL_START, LUXURY_EASE, STAGGER_BASE } from '@/animations/constants';

export function Journal() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title
      const title = sectionRef.current?.querySelector('.journal-title');
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

      // Cards stagger
      const cards = sectionRef.current?.querySelectorAll('.journal-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: LUXURY_EASE,
            stagger: STAGGER_BASE,
            scrollTrigger: { trigger: cards[0], start: SCROLL_START },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="journal" spacing="large" ref={sectionRef}>
      <Container>
        {/* Section header */}
        <div className="journal-title flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16 lg:mb-20">
          <div>
            <Typography variant="label" muted className="mb-4">
              Editorial
            </Typography>
            <Typography variant="h1">
              The <span className="italic">Journal</span>
            </Typography>
          </div>
          <button className="font-nav text-[11px] uppercase tracking-[0.12em] font-bold text-mono-black hover:text-mono-gray transition-colors duration-300 pb-1 border-b border-mono-black hover:border-mono-gray cursor-pointer">
            View All Articles
          </button>
        </div>

        {/* Masonry-style grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-8">
          {articles.map((article) => (
            <div
              key={article.id}
              className="journal-card break-inside-avoid mb-8 sm:mb-10"
            >
              <JournalCard article={article} />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
