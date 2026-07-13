'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { Collection } from '@/types/collection';
import Image from 'next/image';
import { Typography } from '@/components/ui/Typography';
import { gsap } from '@/animations/gsap.config';

interface CollectionCardProps {
  collection: Collection;
  href?: string;
}

export function CollectionCard({ collection, href }: CollectionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imageRef.current) return;

    gsap.to(imageRef.current, {
      scale: isHovered ? 1.04 : 1,
      duration: 0.7,
      ease: 'power2.out',
    });
  }, [isHovered]);

  const cardContent = (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden mb-5">
        <div ref={imageRef}>
          <Image
            src={`/assets/collections/${collection.slug}.webp`}
            alt={`${collection.name} editorial campaign`}
            width={1200}
            height={1600}
            className="w-full h-auto object-cover aspect-[3/4]"
          />
        </div>

        {/* Overlay with collection info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-6 sm:p-8">
          <div>
            <Typography
              variant="label"
              className="!text-white/70 mb-2"
            >
              {collection.season} — {collection.productCount} Pieces
            </Typography>
            <Typography
              variant="h3"
              className="!text-white !font-display"
            >
              {collection.name}
            </Typography>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <Typography variant="caption" muted>
        {collection.tagline}
      </Typography>
    </div>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}
