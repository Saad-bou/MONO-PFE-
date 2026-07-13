export interface Collection {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  season: string;
  productCount: number;
  category: 'men' | 'women' | 'all';
  featuredProductIds: string[];
}
