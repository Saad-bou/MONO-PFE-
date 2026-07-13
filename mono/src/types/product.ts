export interface ColorVariant {
  name: string;
  hex: string;
  imageIndex: number;
}

export interface Size {
  label: string;
  available: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  currency: string;
  description: string;
  category: 'men' | 'women' | 'unisex';
  collection: string;
  colors: ColorVariant[];
  sizes: Size[];
  tags: string[];
  isNew: boolean;
  isFeatured: boolean;
  createdAt: string;
}
