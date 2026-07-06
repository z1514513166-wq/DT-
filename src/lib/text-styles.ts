import { TextStyle } from '@/types';

const SIZE_CLASSES: Record<string, string> = {
  small: 'text-sm md:text-base',
  base: 'text-base md:text-lg',
  large: 'text-lg md:text-xl',
  xl: 'text-xl md:text-2xl',
  '2xl': 'text-2xl md:text-4xl',
  '3xl': 'text-3xl md:text-5xl',
  '4xl': 'text-4xl md:text-6xl',
};

export function applyTextStyle(style?: TextStyle): string {
  if (!style) return '';
  const classes: string[] = [];
  if (style.size) classes.push(SIZE_CLASSES[style.size] || '');
  if (style.bold) classes.push('font-bold');
  return classes.filter(Boolean).join(' ');
}

export const SIZE_OPTIONS = [
  { value: '', label: '默认' },
  { value: 'small', label: 'S' },
  { value: 'base', label: 'M' },
  { value: 'large', label: 'L' },
  { value: 'xl', label: 'XL' },
  { value: '2xl', label: '2XL' },
  { value: '3xl', label: '3XL' },
  { value: '4xl', label: '4XL' },
];
