import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'GDPR & Data Protection | CONSTRUCTIONS by AiXLuxury',
  description: 'GDPR compliance, data protection standards, and data subject rights.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/gdpr'
  },
  openGraph: {
    title: 'GDPR & Data Protection | CONSTRUCTIONS by AiXLuxury',
    description: 'GDPR compliance, data protection standards, and data subject rights.',
    url: 'https://constructions.cristianvaduva.com/gdpr',
    siteName: 'CONSTRUCTIONS by AiXLuxury',
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GDPR & Data Protection | CONSTRUCTIONS by AiXLuxury',
    description: 'GDPR compliance, data protection standards, and data subject rights.'
  }
};

export default function GdprPage() {
  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />
      <main className="max-w-[1000px] mx-auto px-4 md:px-8 pt-32 pb-24 space-y-8">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">
            EUROPEAN REGULATION COMPLIANCE
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
            GDPR & DATA PROTECTION
          </h1>
          <p className="text-xs font-mono text-[#888888] mt-2">
            EU General Data Protection Regulation (GDPR 2016/679) Policy
          </p>
        </div>

        <div className="space-y-6 text-sm text-[#A0A0A0] leading-relaxed border-t border-[#1A1D1B] pt-8">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Data Subject Rights</h2>
            <p>
              Under Regulation (EU) 2016/679 (GDPR), individuals whose personal data is processed by the Platform hold the following rights:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Right of Access (Art. 15):</strong> Request confirmation of processing and a copy of personal data.</li>
              <li><strong>Right to Rectification (Art. 16):</strong> Request immediate correction of inaccurate personal details.</li>
              <li><strong>Right to Erasure (Art. 17):</strong> Request deletion of personal data where legal grounds apply.</li>
              <li><strong>Right to Restriction (Art. 18):</strong> Request restricted processing pending data verification.</li>
              <li><strong>Right to Data Portability (Art. 20):</strong> Receive submitted data in a structured, machine-readable format.</li>
              <li><strong>Right to Object (Art. 21):</strong> Object to processing based on legitimate interests.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Public Register Data vs. Personal Data</h2>
            <p>
              The Platform indexes corporate entity data, municipal construction permits, cadastral records, and public financial statements (Ministry of Finance / Trade Register ONRC). Factual information relating to legal entities (S.R.L., S.A.) is public business data. Where executive names appear as public record disclosures (e.g. registered company directors), processing is strictly limited to verified public register disclosures.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Exercising Your Rights</h2>
            <p>
              To exercise any data subject right, or to submit an official data request, contact our Data Protection Officer via our <a href="/report-error" className="text-[#C9A227] underline">Data Correction & Request Desk</a> or email <code className="text-white">gdpr@aixluxury.com</code>.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
