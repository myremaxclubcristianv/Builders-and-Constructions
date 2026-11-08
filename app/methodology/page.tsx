import type { Metadata } from 'next';
import Link from 'next/link';
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

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">3. Verification Status Taxonomy</h2>
            <p>
              To maintain absolute transparency, every factual claim, metric, and entity dossier in CONSTRUCTIONS is assigned a distinct verification state:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#111111] border border-[#22c55e]/40 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                  <span className="text-xs font-mono font-bold text-[#22c55e] uppercase">VERIFIED / CONFIRMAT</span>
                </div>
                <p className="text-xs text-[#d4d2c8]">
                  Independently confirmed via official registry filing (ONRC, ANAF, ANCPI), municipal building permit, statutory stock exchange release (BVB), or primary audited documentation.
                </p>
              </div>

              <div className="p-4 bg-[#111111] border border-[#38bdf8]/40 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                  <span className="text-xs font-mono font-bold text-[#38bdf8] uppercase">REPORTED / RAPORTAT</span>
                </div>
                <p className="text-xs text-[#d4d2c8]">
                  Publicly disclosed directly by the corporate entity, developer release, or established financial media, pending statutory registry cross-validation.
                </p>
              </div>

              <div className="p-4 bg-[#111111] border border-[#eab308]/40 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#eab308]" />
                  <span className="text-xs font-mono font-bold text-[#eab308] uppercase">ESTIMATED / ESTIMAT</span>
                </div>
                <p className="text-xs text-[#d4d2c8]">
                  Derived mathematical projection based on documented gross surfaces, typical construction benchmarks, or published timelines. Never presented as achieved fact.
                </p>
              </div>

              <div className="p-4 bg-[#111111] border border-[#888888]/40 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#888888]" />
                  <span className="text-xs font-mono font-bold text-[#888888] uppercase">NOT DISCLOSED / NEVERIFICAT</span>
                </div>
                <p className="text-xs text-[#d4d2c8]">
                  Explicit indicator where specific contracts, CUI, engineering partners, or financial metrics have not been made available in primary public sources.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Curated Scope & Platform Boundaries</h2>
            <p>
              CONSTRUCTIONS by AiXLuxury operates on the principle of <em>verified depth over unsupported market-wide claims</em>. The database currently documents <strong>76 verified development projects</strong> and <strong>143 commercial corporate entities</strong> across Romania.
            </p>
            <p>
              This dataset constitutes an expanding, curated institutional intelligence index and does not claim to represent 100% of active construction or all small residential structures across Romania. Physical dimensions (surface areas, unit counts, infrastructure lengths) are categorized explicitly by scope: Land Area, Gross Built Area, GLA, Masterplan Area, and Phase Area.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Public Corrections & Profile Update Policy</h2>
            <p>
              Authorized corporate representatives, architects, engineers, and general contractors may request updates or corrections to public dossiers at any time. We operate a transparent, evidence-based review desk:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#CCCCCC]">
              <li>Submit factual corrections via the dedicated <Link href="/report-error" className="text-[#C9A227] underline">Correction & Request Desk</Link>.</li>
              <li>Provide primary source citations (official website link, registration document, regulatory filing, or permit reference).</li>
              <li>Direct anonymous modifications of public dossiers are prohibited; all submissions undergo review prior to inclusion in the canonical dataset.</li>
              <li>Inquiries and requests are evaluated in order of receipt and verified strictly against primary sources.</li>
            </ul>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
