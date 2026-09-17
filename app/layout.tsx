import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Find Ya Flava | Dr. Bombay Matcher',
  description: 'Build your ideal spoonful and find the closest flavour in the Dr. Bombay lineup.',
  metadataBase: new URL(siteUrl),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;800;900&family=Shrikhand&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
