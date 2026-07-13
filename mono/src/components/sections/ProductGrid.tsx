'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Typography } from '@/components/ui/Typography';
import { ProductCard } from '@/components/cards/ProductCard';
import { products } from '@/data/products';
import { gsap } from '@/animations/gsap.config';
import { SCROLL_START, LUXURY_EASE, STAGGER_TIGHT } from '@/animations/constants';

type FilterCategory = 'all' | 'men' | 'women';

export function ProductGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  const filteredProducts =
    activeFilter === 'all'
      ? products.filter((p) => p.isFeatured)
      : products.filter((p) => p.category === activeFilter && p.isFeatured);

  const filters: { label: string; value: FilterCategory }[] = [
    { label: 'All', value: 'all' },
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      const title = sectionRef.current?.querySelector('.grid-title');
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

      // Product cards stagger
      const cards = sectionRef.current?.querySelectorAll('.product-card-item');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: LUXURY_EASE,
            stagger: STAGGER_TIGHT,
            scrollTrigger: { trigger: cards[0], start: SCROLL_START },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [activeFilter]);

  return (
    <Section id="products" spacing="large" ref={sectionRef}>
      <Container>
        {/* Section header */}
        <div className="grid-title flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <Typography variant="label" muted className="mb-4">
              Curated Selection
            </Typography>
            <Typography variant="h1">
              Featured <span className="italic">Pieces</span>
            </Typography>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-6">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`
                  font-nav text-[11px] uppercase tracking-[0.14em] font-bold
                  pb-1 border-b-[1.5px] transition-all duration-300 cursor-pointer
                  ${
                    activeFilter === filter.value
                      ? 'text-mono-black border-mono-black'
                      : 'text-mono-muted border-transparent hover:text-mono-gray'
                  }
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 sm:gap-y-12">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card-item">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
