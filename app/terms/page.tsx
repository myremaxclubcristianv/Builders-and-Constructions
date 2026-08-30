import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Terms & Conditions | CONSTRUCTIONS by AiXLuxury',
  description: 'Terms of service and legal disclosures for CONSTRUCTIONS by AiXLuxury.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/terms'
  },
  openGraph: {
    title: 'Terms & Conditions | CONSTRUCTIONS by AiXLuxury',
    description: 'Terms of service and legal disclosures for CONSTRUCTIONS by AiXLuxury.',
    url: 'https://constructions.cristianvaduva.com/terms',
    siteName: 'CONSTRUCTIONS by AiXLuxury',
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms & Conditions | CONSTRUCTIONS by AiXLuxury',
    description: 'Terms of service and legal disclosures for CONSTRUCTIONS by AiXLuxury.'
  }
};

export default function TermsPage() {
  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />
      <main className="max-w-[1000px] mx-auto px-4 md:px-8 pt-32 pb-24 space-y-8">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">
            LEGAL DISCLOSURES
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
            TERMS & CONDITIONS
          </h1>
          <p className="text-xs font-mono text-[#888888] mt-2">
            Effective Date: August 30, 2026 · CONSTRUCTIONS by AiXLuxury
          </p>
        </div>

        <div className="space-y-6 text-sm text-[#A0A0A0] leading-relaxed border-t border-[#1A1D1B] pt-8">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Platform Nature & Scope</h2>
            <p>
              CONSTRUCTIONS by AiXLuxury (&quot;the Platform&quot;) is an independent construction market intelligence service.
              Information published on this platform is compiled from publicly accessible official registries (including ANCPI, ONRC, ANAF, Ministry of Finance, and Bucharest Stock Exchange disclosures) and official corporate publications.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Third-Party Corporate Information</h2>
            <p>
              Profiles of corporate entities, construction projects, developers, general contractors, architectural practices, and engineering firms are created for research and market intelligence purposes. Publication of factual data does not imply that any entity has endorsed, sponsored, verified, or partnered with the Platform, unless explicitly marked as a verified corporate partner.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Data Accuracy & Corrections</h2>
            <p>
              The Platform uses rigorous source-provenance methodology. However, public records may change or contain historical lag. Authorized company representatives may submit requests for data updates or corrections at any time via our dedicated <a href="/report-error" className="text-[#C9A227] underline">Data Correction Request Form</a>. Factual corrections are evaluated against primary source evidence and do not require commercial partnership.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Commercial Services & Partnerships</h2>
            <p>
              The Platform offers optional commercial presentation and partnership services for corporate entities seeking enhanced visibility. Commercial options are visually separated from public factual dossiers and do not alter underlying historical facts or verified primary records.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">5. Intellectual Property</h2>
            <p>
              All proprietary compilation design, editorial content, software code, data schemas, and visual interfaces are the property of AiXLuxury. Third-party entity names, logos, trademarks, and public domain register data remain the property of their respective legal owners.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
