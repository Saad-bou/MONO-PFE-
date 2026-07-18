'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Typography } from '@/components/ui/Typography';
import { CollectionCard } from '@/components/cards/CollectionCard';
import { getCollections } from '@/services/collection.service';
import { gsap } from '@/animations/gsap.config';
import { SCROLL_START, LUXURY_EASE, STAGGER_BASE } from '@/animations/constants';

export function FeaturedCollections() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getCollections({ isFeatured: true, limit: 4 });
        const data: any[] = (response.data as any).data || [];
        const featured = data.filter((c: any) => c.isFeatured).slice(0, 4);
        setCollections(featured);
      } catch (err) {
        setError('Failed to load featured campaigns.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  useEffect(() => {
    if (isLoading || error || collections.length === 0) return;

    const ctx = gsap.context(() => {
      // Title reveal
      const title = sectionRef.current?.querySelector('.collections-title');
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

      // Cards stagger reveal
      const cards = sectionRef.current?.querySelectorAll('.collection-card');
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
  }, [isLoading, error, collections]);

  return (
    <Section id="collections" spacing="large" ref={sectionRef}>
      <Container>
        {/* Section header */}
        <div className="collections-title flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16 lg:mb-20">
          <div>
            <Typography variant="label" muted className="mb-4">
              Collections
            </Typography>
            <Typography variant="h1">
              Featured <span className="italic">Campaigns</span>
            </Typography>
          </div>
          <Typography variant="caption" muted className="sm:mb-2">
            {collections.length} Collections
          </Typography>
        </div>

        {/* Collection grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Typography variant="body" muted>Loading featured campaigns...</Typography>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20 text-red-500">
            <Typography variant="body">{error}</Typography>
          </div>
        ) : collections.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Typography variant="body" muted>No featured campaigns found.</Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {collections.map((collection) => (
              <div key={collection.id} className="collection-card">
                <CollectionCard collection={collection} href={`/men/${collection.slug}`} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
