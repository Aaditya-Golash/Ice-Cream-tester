import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Find Ya Flava | Build your spoonful',
  description: 'Build your ideal spoonful and find the closest flavour in this Dr. Bombay selection.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Find Ya Flava',
    description: 'Build your spoonful. Find your pint.',
    images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: 'Find Ya Flava | Build your spoonful. Find your pint.' }],
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;800;900&family=Shrikhand&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#1a0b2e] text-[#fff8f0] antialiased selection:bg-[#ff7b00] selection:text-black font-['Plus_Jakarta_Sans',sans-serif]">
        {children}
      </body>
    </html>
  );
}
