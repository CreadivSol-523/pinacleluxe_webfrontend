import { Inter } from 'next/font/google';

// Optimize Inter font with next/font
// Using subset='latin' reduces font file size significantly
export const interRegular = Inter({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-inter-regular',
  preload: true,
});

export const interMedium = Inter({
  subsets: ['latin'],
  weight: '500',
  display: 'swap',
  variable: '--font-inter-medium',
  preload: true,
});

export const interSemiBold = Inter({
  subsets: ['latin'],
  weight: '600',
  display: 'swap',
  variable: '--font-inter-semibold',
  preload: true,
});
