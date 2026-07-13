export interface NavItem {
  label: string;
  href: string;
  position: 'left' | 'right';
}

export interface NavIconItem {
  label: string;
  href: string;
  icon: 'profile' | 'search' | 'bag';
}

export const navItems: NavItem[] = [
  { label: 'Men', href: '/men', position: 'left' },
  { label: 'Women', href: '/women', position: 'left' },
  { label: 'Sale', href: '/sale', position: 'right' },
  { label: 'Our Story', href: '/story', position: 'right' },
];

export const navIconItems: NavIconItem[] = [
  { label: 'Profile', href: '/profile', icon: 'profile' },
  { label: 'Search', href: '/search', icon: 'search' },
  { label: 'Bag', href: '/bag', icon: 'bag' },
];
