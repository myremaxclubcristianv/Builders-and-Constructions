import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Privacy Policy | CONSTRUCTIONS by AiXLuxury',
  description: 'Privacy policy and data processing practices for CONSTRUCTIONS by AiXLuxury.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/privacy'
  },
  openGraph: {
    title: 'Privacy Policy | CONSTRUCTIONS by AiXLuxury',
    description: 'Privacy policy and data processing practices for CONSTRUCTIONS by AiXLuxury.',
    url: 'https://constructions.cristianvaduva.com/privacy',
    siteName: 'CONSTRUCTIONS by AiXLuxury',
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | CONSTRUCTIONS by AiXLuxury',
    description: 'Privacy policy and data processing practices for CONSTRUCTIONS by AiXLuxury.'
  }
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />
      <main className="max-w-[1000px] mx-auto px-4 md:px-8 pt-32 pb-24 space-y-8">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">
            PRIVACY STATEMENT
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
            PRIVACY POLICY
          </h1>
          <p className="text-xs font-mono text-[#888888] mt-2">
            Effective Date: August 30, 2026 · CONSTRUCTIONS by AiXLuxury
          </p>
        </div>

        <div className="space-y-6 text-sm text-[#A0A0A0] leading-relaxed border-t border-[#1A1D1B] pt-8">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Data Controller Identity</h2>
            <p>
              CONSTRUCTIONS by AiXLuxury acts as data controller for user interaction data, inquiry submissions, and data correction requests collected through this platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Information We Collect</h2>
            <p>
              We collect minimal necessary personal data:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Contact Inquiries:</strong> Name, professional email, phone number, and organization submitted via inquiry or correction forms.</li>
              <li><strong>Technical Logs:</strong> Anonymous IP address, browser user-agent, and aggregate route analytics to ensure system security and operational integrity.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Purpose & Legal Basis</h2>
            <p>
              We process data for the following purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Responding to partnership inquiries and commercial requests (Contract performance / Legitimate interest).</li>
              <li>Verifying entity ownership and processing factual data corrections (Legitimate interest in published accuracy).</li>
              <li>Maintaining security and preventing abuse (Legitimate interest).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Cookies & Analytics</h2>
            <p>
              We utilize essential technical session cookies and anonymized analytics. We do not sell user data to third-party data brokers.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
