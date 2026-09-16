import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Find Ya Flava — Build your spoonful',
  description: 'Build your ideal spoonful and find the closest flavour in this Dr. Bombay selection.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Find Ya Flava',
    description: 'Build your spoonful. Find your pint.',
    images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: 'Find Ya Flava — Build your spoonful. Find your pint.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Ya Flava',
    description: 'Build your spoonful. Find your pint.',
    images: [`${siteUrl}/og.png`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
