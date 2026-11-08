import type { Metadata, Viewport } from 'next';
import { Manrope, DM_Mono, Playfair_Display } from 'next/font/google';
import { Suspense } from 'react';
import { headers } from 'next/headers';
import { VisitorIntelligenceProvider } from '@/components/VisitorIntelligenceProvider';
import { LanguageProvider } from '@/lib/language-context';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

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
    default: 'CONSTRUCTIONS by AiXLuxury · Inteligență în Construcții & Real Estate România',
    template: '%s'
  },
  description: 'Platformă independentă de inteligență, transparență și analiză faptică în construcții și real estate din România. Dosare structurate pentru dezvoltatori, antreprenori generali, ingineri și proiecte majore.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com'
  },
  openGraph: {
    type: 'website',
    siteName: 'CONSTRUCTIONS by AiXLuxury',
    locale: 'ro_RO',
    url: 'https://constructions.cristianvaduva.com',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CONSTRUCTIONS by AiXLuxury — Inteligență în Construcții & Real Estate România'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CONSTRUCTIONS by AiXLuxury',
    description: 'Platformă independentă de inteligență, transparență și analiză faptică în construcții și real estate din România.',
    images: ['/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || undefined;

  return (
    <html lang="ro" className={`${manrope.variable} ${dmMono.variable} ${playfair.variable}`}>
      <body nonce={nonce}>
        <Suspense fallback={null}>
          <VisitorIntelligenceProvider />
        </Suspense>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
