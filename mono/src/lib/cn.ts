import { clsx, type ClassValue } from 'clsx';

/**
 * Merge class names with clsx.
 * Utility for conditional and composed Tailwind class names.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
