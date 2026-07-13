'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Article } from '@/types/journal';
import { JournalPlaceholder } from '@/components/placeholders/JournalPlaceholder';
import { Typography } from '@/components/ui/Typography';
import { gsap } from '@/animations/gsap.config';

import Image from 'next/image';

interface JournalCardProps {
  article: Article;
}

export function JournalCard({ article }: JournalCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imageRef.current) return;

    gsap.to(imageRef.current, {
      scale: isHovered ? 1.03 : 1,
      duration: 0.6,
      ease: 'power2.out',
    });
  }, [isHovered]);

  const heightClass = {
    tall: 'aspect-[3/4]',
    medium: 'aspect-square',
    short: 'aspect-[4/3]'
  }[article.height];

  return (
    <article
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className={`overflow-hidden mb-4 ${heightClass} relative bg-mono-light`}>
        <div ref={imageRef} className="w-full h-full relative">
          <Image
            src={article.image}
            alt={`${article.title} - Editorial fashion photography`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 mb-3">
        <Typography variant="label" gold>
          {article.category}
        </Typography>
        <span className="w-1 h-1 rounded-full bg-mono-border" />
        <Typography variant="caption" muted>
          {article.readTime}
        </Typography>
      </div>

      {/* Title */}
      <Typography variant="h4" className="mb-2 group-hover:text-mono-gray transition-colors duration-300">
        {article.title}
      </Typography>

      {/* Excerpt */}
      <Typography variant="body" muted className="text-[14px] leading-[22px]">
        {article.excerpt}
      </Typography>
    </article>
  );
}
