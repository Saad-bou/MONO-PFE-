export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  slug: string;
  image: string;
  height: 'tall' | 'medium' | 'short';
}
