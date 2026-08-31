import type { Metadata } from 'next';
import { Manrope, DM_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap'
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-playfair',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://constructions.cristianvaduva.com'),
  title: {
    default: 'CONSTRUCTIONS by AiXLuxury',
    template: '%s | CONSTRUCTIONS by AiXLuxury'
  },
  description: 'Construction intelligence for Romania\'s evolving built environment. Structured intelligence on verified developers, construction companies, engineers, and architectural practices.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com'
  },
  openGraph: {
    type: 'website',
    siteName: 'CONSTRUCTIONS by AiXLuxury',
    locale: 'en_US',
    url: 'https://constructions.cristianvaduva.com'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CONSTRUCTIONS by AiXLuxury',
    description: 'Construction intelligence for Romania\'s evolving built environment. Structured intelligence on verified developers, construction companies, engineers, and architectural practices.'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${dmMono.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
