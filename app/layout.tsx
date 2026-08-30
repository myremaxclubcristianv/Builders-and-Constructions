import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
