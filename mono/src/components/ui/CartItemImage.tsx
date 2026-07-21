import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProductPlaceholder } from '@/components/placeholders/ProductPlaceholder';

export function CartItemImage({ item }: { item: any }) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  
  useEffect(() => {
    if (item.image) {
      setImgSrc(item.image);
      return;
    }

    const slug = item.name.toLowerCase().replace(/ /g, '-');
    const color = item.color.toLowerCase();
    
    // We assume men category for now based on current catalog structure.
    const basePath = `/assets/products/${slug}-men/${slug}-men`;
    const mainImg = `${basePath}-main-${color}.webp`;
    const galleryImg = `${basePath}-gallery-${color}.webp`;
    
    const img = new window.Image();
    img.src = mainImg;
    img.onload = () => setImgSrc(mainImg);
    img.onerror = () => {
      const fallbackImg = new window.Image();
      fallbackImg.src = galleryImg;
      fallbackImg.onload = () => setImgSrc(galleryImg);
      fallbackImg.onerror = () => setImgSrc(null);
    };
  }, [item]);

  if (!imgSrc) return <ProductPlaceholder />;
  
  return (
    <div className="relative aspect-[3/4] w-full bg-mono-light overflow-hidden">
      <Image src={imgSrc} alt={item.name} fill className="object-cover" />
    </div>
  );
}
