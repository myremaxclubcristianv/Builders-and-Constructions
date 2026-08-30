import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Data Methodology & Source Hierarchy | CONSTRUCTIONS by AiXLuxury',
  description: 'Source provenance hierarchy, verification classifications, and data methodology.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/methodology'
  },
  openGraph: {
    title: 'Data Methodology & Source Hierarchy | CONSTRUCTIONS by AiXLuxury',
    description: 'Source provenance hierarchy, verification classifications, and data methodology.',
    url: 'https://constructions.cristianvaduva.com/methodology',
    siteName: 'CONSTRUCTIONS by AiXLuxury',
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Data Methodology & Source Hierarchy | CONSTRUCTIONS by AiXLuxury',
    description: 'Source provenance hierarchy, verification classifications, and data methodology.'
  }
};

export default function MethodologyPage() {
  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />
      <main className="max-w-[1000px] mx-auto px-4 md:px-8 pt-32 pb-24 space-y-8">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">
            INSTITUTIONAL RESEARCH FRAMEWORK
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
            DATA METHODOLOGY & PROVENANCE
          </h1>
          <p className="text-xs font-mono text-[#888888] mt-2">
            Independent Verification Standards · Continuous Expansion Framework
          </p>
        </div>

        <div className="space-y-8 text-sm text-[#A0A0A0] leading-relaxed border-t border-[#1A1D1B] pt-8">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Core Verification Philosophy</h2>
            <p>
              CONSTRUCTIONS by AiXLuxury compiles structured intelligence on Romania&apos;s construction and real estate development sector. Factual data is derived strictly from public registers, official regulatory filings, municipal urban planning documentation, and official corporate disclosures.
            </p>
            <p>
              Where information cannot be independently verified from authoritative primary sources, it is explicitly classified as <code className="text-[#C9A227]">NOT_DISCLOSED</code> or <code className="text-[#C9A227]">ANNOUNCED</code> rather than interpolated or estimated.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">2. Four-Tier Source Hierarchy</h2>
            
            <div className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
              <span className="text-xs font-mono font-bold text-[#86efac] uppercase">TIER 1 — PRIMARY AUTHORITATIVE REGISTRIES</span>
              <p className="text-xs text-[#CCCCCC]">
                Official state registers and statutory institutions: Agenția Națională de Cadastru și Publicitate Imobiliară (ANCPI / OCPI), Oficiul Național al Registrului Comerțului (ONRC), Agenția Națională de Administrare Fiscală (ANAF), Ministerul Finanțelor, Bucharest Stock Exchange (BVB) regulatory filings, and official municipal urban planning permits.
              </p>
            </div>

            <div className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
              <span className="text-xs font-mono font-bold text-[#38bdf8] uppercase">TIER 2 — OFFICIAL CORPORATE DISCLOSURES</span>
              <p className="text-xs text-[#CCCCCC]">
                Official developer, general contractor, and architectural practice annual reports, audited financial disclosures, official corporate press announcements, and statutory shareholder releases.
              </p>
            </div>

            <div className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
              <span className="text-xs font-mono font-bold text-[#eab308] uppercase">TIER 3 — REPUTABLE INDUSTRY PUBLICATIONS</span>
              <p className="text-xs text-[#CCCCCC]">
                Established financial news organs, recognized business journals, and documented construction sector publications with attributed editorial sources.
              </p>
            </div>

            <div className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2 opacity-60">
              <span className="text-xs font-mono font-bold text-[#ef4444] uppercase">TIER 4 — UNSUITABLE / REJECTED SOURCES</span>
              <p className="text-xs text-[#CCCCCC]">
                Unverified real estate portals, anonymous blogs, promotional aggregators without original citations, social media posts, and unbacked market claims are explicitly excluded.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Qualification & Scope Preservation</h2>
            <p>
              Source qualifiers are strictly preserved across UI renderings and metadata. Future completion estimates are marked as <code className="text-[#C9A227]">ANNOUNCED</code> rather than achieved facts. Specific development phase metrics (Phase 1 vs Total Site) are demarcated to prevent scope confusion.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
