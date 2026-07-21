'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { Product } from '@/types/product';
import { ProductPlaceholder } from '@/components/placeholders/ProductPlaceholder';
import Image from 'next/image';
import { ColorSwatch } from '@/components/ui/ColorSwatch';
import { SizeSelector } from '@/components/ui/SizeSelector';
import { Badge } from '@/components/ui/Badge';
import { Typography } from '@/components/ui/Typography';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';
import { gsap } from '@/animations/gsap.config';
import { HOVER_IMAGE_SCALE, HOVER_DURATION } from '@/animations/constants';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [activeColor, setActiveColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);

  const { toggleItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  // Hover animations
  useEffect(() => {
    if (!imageRef.current || !sizeRef.current) return;

    if (isHovered) {
      gsap.to(imageRef.current, {
        scale: HOVER_IMAGE_SCALE,
        duration: HOVER_DURATION,
        ease: 'power2.out',
      });
      gsap.to(sizeRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out',
      });
    } else {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: HOVER_DURATION,
        ease: 'power2.out',
      });
      gsap.to(sizeRef.current, {
        y: 10,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      });
    }
  }, [isHovered]);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
  };

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden mb-4 aspect-[3/4] bg-mono-light">
          <div ref={imageRef} className="absolute inset-0 w-full h-full">
            {product.colors && product.colors.length > 0 ? (
              (() => {
                const colorName = product.colors[activeColor]?.name?.toLowerCase() || '';
                const isMainColor = activeColor === 0;
                
                const displayImage = 
                  product.images?.find(img => img.toLowerCase().includes(`main-${colorName}`)) ??
                  product.images?.find(img => img.toLowerCase().includes(`gallery-${colorName}`)) ??
                  (isMainColor ? product.images?.[0] : null) ?? 
                  '';
                  
                const hoverImage = 
                  product.images?.find(img => img.toLowerCase().includes(`hover-${colorName}`)) ?? 
                  (isMainColor && product.images && product.images.length > 1 ? product.images[1] : null);

                return (
                  <>
                    {displayImage && (
                      <Image
                        src={displayImage}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className={cn(
                          "object-cover transition-opacity duration-500 ease-out",
                          isHovered && hoverImage ? "opacity-0" : "opacity-100"
                        )}
                      />
                    )}
                    {hoverImage && (
                      <Image
                        src={hoverImage}
                        alt={`${product.name} hover`}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className={cn(
                          "object-cover transition-opacity duration-500 ease-out",
                          isHovered ? "opacity-100" : "opacity-0"
                        )}
                      />
                    )}
                  </>
                );
              })()
            ) : (
              <ProductPlaceholder />
            )}
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && <Badge variant="new">New</Badge>}
            {product.originalPrice && <Badge variant="sale">Sale</Badge>}
          </div>

          {/* Wishlist heart */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hover:bg-white"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 20 20"
              fill={inWishlist ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-mono-black"
            >
              <path d="M10 17s-7-4.35-7-8.5A3.5 3.5 0 0 1 10 5.97 3.5 3.5 0 0 1 17 8.5C17 12.65 10 17 10 17z" />
            </svg>
          </button>

          {/* Size selector — slides up on hover */}
          <div
            ref={sizeRef}
            className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-3 opacity-0 translate-y-[10px]"
          >
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSelect={setSelectedSize}
            />
          </div>
        </div>
      </Link>

      {/* Product info */}
      <Link href={`/product/${product.slug}`} className="block">
        <div className="flex flex-col gap-2">
          {/* Color swatches */}
          {product.colors.length > 1 && (
            <div className="flex items-center gap-2">
              {product.colors.map((color, index) => (
                <ColorSwatch
                  key={color.name}
                  color={color.hex}
                  name={color.name}
                  isActive={activeColor === index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveColor(index);
                  }}
                />
              ))}
            </div>
          )}

          <Typography variant="caption" className="font-medium !text-mono-black">
            {product.name}
          </Typography>

          <div className="flex items-center gap-2">
            <Typography
              variant="caption"
              className={cn(product.originalPrice && 'text-mono-gold')}
            >
              {formatPrice(product.price, product.currency)}
            </Typography>
            {product.originalPrice && (
              <Typography variant="caption" muted className="line-through">
                {formatPrice(product.originalPrice, product.currency)}
              </Typography>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
