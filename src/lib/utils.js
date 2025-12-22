import { clsx } from 'clsx';

/**
 * Utility function to merge class names
 * Combines clsx functionality for conditional classes
 */
export function cn(...inputs) {
  return clsx(inputs);
}

