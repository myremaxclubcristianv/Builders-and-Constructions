import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Cristian Văduva — Institutional Profile & Luxury Real Estate Expert',
  description: 'Official institutional profile of Cristian Văduva: Luxury Real Estate Expert specializing in Monaco, Dubai, Bucharest, and premier European destinations.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/about/cristian-vaduva'
  }
};

export default function CristianVaduvaProfilePage() {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Cristian Văduva',
    jobTitle: 'Luxury Real Estate Expert',
    url: 'https://cristianvaduva.com',
    sameAs: [
      'https://linktr.ee/cristianvaduvarealestate',
      'https://aixluxury.com'
    ],
    knowsAbout: [
      'Luxury Real Estate',
      'Financial Markets',
      'Property Negotiation',
      'High-End Residential',
      'Historical Landmarks'
    ]
  };

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <SiteHeader />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] font-bold">
                INSTITUTIONAL PROFILE
              </span>
              <span className="px-2 py-0.5 bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30 rounded text-[9px] font-mono font-bold uppercase">
                VERIFIED OFFICIAL SOURCE
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
              CRISTIAN VĂDUVA
            </h1>
            <p className="text-lg md:text-xl text-[#C9A227] font-mono tracking-wide">
              LUXURY REAL ESTATE EXPERT · CONSULTANT · AGENT
            </p>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-3xl leading-relaxed">
              Specialized in high-value property representation, luxury residences, historical landmarks, and strategic real estate advisory across Monaco, Dubai, Bucharest, Europe, and premier international destinations.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-[#777777]">
              <span>GEOGRAPHIC FOCUS: MONACO · DUBAI · BUCHAREST · EUROPE</span>
            </div>
          </div>
        </section>

        {/* Core Profile & Background */}
        <section className="py-12 md:py-16 border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              <div className="space-y-4">
                <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest font-bold block">
                  PROFESSIONAL BACKGROUND
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Expertise in Sales, Financial Markets & Real Estate Advisory
                </h2>
                <div className="space-y-4 text-sm text-[#A0A0A0] leading-relaxed">
                  <p>
                    Cristian Văduva has built a distinguished professional career spanning sales, financial markets, and luxury real estate representation. 
                    His work centers on representing high-net-worth buyers and sellers in complex, high-value real estate transactions requiring structured negotiation and strategic market insight.
                  </p>
                  <p>
                    Combining extensive knowledge of international financial mechanisms with real estate advisory, he delivers rigorous representation across residential developments, penthouses, historical landmarks, castles, mansions, and premier European estate assets.
                  </p>
                </div>
              </div>

              {/* Education & Credentials */}
              <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl space-y-6">
                <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest font-bold block">
                  ACADEMIC & PROFESSIONAL CREDENTIALS
                </span>
                <div className="space-y-6 font-mono text-xs">
                  <div>
                    <span className="text-[#888888] block text-[10px] uppercase">THREE DEGREES</span>
                    <ul className="mt-1 space-y-1 text-white font-bold">
                      <li className="flex items-center gap-2">
                        <span className="text-[#C9A227]">▪</span> Economics Degree
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#C9A227]">▪</span> Ecology Degree
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#C9A227]">▪</span> Law Degree
                      </li>
                    </ul>
                  </div>

                  <div className="border-t border-[#1A1D1B] pt-4">
                    <span className="text-[#888888] block text-[10px] uppercase">THREE MASTER&apos;S DEGREES</span>
                    <ul className="mt-1 space-y-1 text-white font-bold">
                      <li className="flex items-center gap-2">
                        <span className="text-[#C9A227]">▪</span> Financial Management Master&apos;s
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#C9A227]">▪</span> Environmental Impact Assessment Master&apos;s
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#C9A227]">▪</span> Information & Private Security Law Master&apos;s
                      </li>
                    </ul>
                  </div>

                  <div className="border-t border-[#1A1D1B] pt-4">
                    <span className="text-[#888888] block text-[10px] uppercase">INTERNATIONAL ACADEMIC STUDIES</span>
                    <p className="mt-1 text-white font-bold">
                      Academic & Specialized Studies in Madrid, France, and Malta
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Specialization & Property Categories */}
            <div className="space-y-6 pt-6 border-t border-[#1A1D1B]">
              <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest font-bold block">
                SPECIALIZATION PORTFOLIO CATEGORIES
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-xs">
                <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                  <span className="text-[10px] text-[#888888] block">CATEGORY</span>
                  <div className="font-bold text-white">Luxury Villas</div>
                </div>
                <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                  <span className="text-[10px] text-[#888888] block">CATEGORY</span>
                  <div className="font-bold text-white">Penthouses</div>
                </div>
                <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                  <span className="text-[10px] text-[#888888] block">CATEGORY</span>
                  <div className="font-bold text-white">Historic Landmarks</div>
                </div>
                <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                  <span className="text-[10px] text-[#888888] block">CATEGORY</span>
                  <div className="font-bold text-white">Castles & Palaces</div>
                </div>
                <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                  <span className="text-[10px] text-[#888888] block">DESTINATION</span>
                  <div className="font-bold text-[#C9A227]">Monaco & Dubai</div>
                </div>
                <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                  <span className="text-[10px] text-[#888888] block">DESTINATION</span>
                  <div className="font-bold text-[#C9A227]">Bucharest</div>
                </div>
              </div>
            </div>

            {/* Professional Strengths & Philosophy */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-[#1A1D1B]">
              <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl space-y-4 font-mono text-xs">
                <span className="text-[#C9A227] font-bold block uppercase tracking-wider text-[11px]">
                  STATED PROFESSIONAL STRENGTHS
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#050505] border border-[#1A1D1B] rounded">
                    <span className="text-[#888888] text-[9px] block">CORE SKILL</span>
                    <strong className="text-white">Leadership & Communication</strong>
                  </div>
                  <div className="p-3 bg-[#050505] border border-[#1A1D1B] rounded">
                    <span className="text-[#888888] text-[9px] block">CORE SKILL</span>
                    <strong className="text-white">Structured Negotiation</strong>
                  </div>
                  <div className="p-3 bg-[#050505] border border-[#1A1D1B] rounded">
                    <span className="text-[#888888] text-[9px] block">CORE SKILL</span>
                    <strong className="text-white">Ethical Excellence</strong>
                  </div>
                  <div className="p-3 bg-[#050505] border border-[#1A1D1B] rounded">
                    <span className="text-[#888888] text-[9px] block">CORE SKILL</span>
                    <strong className="text-white">Market Insight</strong>
                  </div>
                  <div className="p-3 bg-[#050505] border border-[#1A1D1B] rounded">
                    <span className="text-[#888888] text-[9px] block">CORE SKILL</span>
                    <strong className="text-white">Financial & Legal Knowledge</strong>
                  </div>
                  <div className="p-3 bg-[#050505] border border-[#1A1D1B] rounded">
                    <span className="text-[#888888] text-[9px] block">CORE SKILL</span>
                    <strong className="text-white">Ecological Impact Insight</strong>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl space-y-4">
                <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest font-bold block">
                  PROFESSIONAL PHILOSOPHY & ADVISORY APPROACH
                </span>
                <p className="text-xs text-[#A0A0A0] leading-relaxed">
                  Every client engagement is built upon strict principles of transparency, discretion, exclusivity, and professional rigor. Real estate acquisition and disposition are executed as strategic long-term investments supported by comprehensive legal and financial due diligence.
                </p>
                <div className="pt-2 font-mono text-xs text-[#777777] space-y-1">
                  <div>DISCRETION · PRIVACY · BESPOKE ADVISORY · LONG-TERM VALUE</div>
                </div>
              </div>
            </div>

            {/* Verified Official Contact & Channels */}
            <div className="p-6 bg-[#0B0B0B] border border-[#1A1D1B] rounded-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-4">
                <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest font-bold">
                  VERIFIED OFFICIAL CONTACT & DIGITAL CHANNELS
                </span>
                <span className="text-[10px] font-mono text-[#777777]">SOURCE: CRISTIANVADUVA.COM</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#888888] uppercase block">OFFICIAL TELEPHONE</span>
                  <a href="tel:+40767110439" className="text-white font-bold hover:text-[#C9A227] block text-sm">
                    +40 767 110 439
                  </a>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#888888] uppercase block">WHATSAPP / INTERNATIONAL</span>
                  <a href="https://wa.me/436509536345" target="_blank" rel="noreferrer" className="text-white font-bold hover:text-[#C9A227] block text-sm">
                    +43 650 953 6345 ↗
                  </a>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#888888] uppercase block">OFFICIAL EMAIL</span>
                  <a href="mailto:contact@cristianvaduva.com" className="text-[#C9A227] font-bold hover:underline block text-sm">
                    contact@cristianvaduva.com
                  </a>
                  <span className="text-[10px] text-[#777777] block">Alt: cristianvaduva@duck.com</span>
                </div>
              </div>

              <div className="border-t border-[#1A1D1B] pt-4 flex flex-wrap gap-4 text-xs font-mono">
                <a href="https://linktr.ee/cristianvaduvarealestate" target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-[#111111] border border-[#1A1D1B] text-[#C9A227] rounded hover:border-[#C9A227]">
                  OFFICIAL LINKTREE ↗
                </a>
                <a href="https://cristianvaduva.com" target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-[#111111] border border-[#1A1D1B] text-[#C9A227] rounded hover:border-[#C9A227]">
                  CRISTIANVADUVA.COM ↗
                </a>
                <a href="https://aixluxury.com" target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-[#111111] border border-[#1A1D1B] text-[#C9A227] rounded hover:border-[#C9A227]">
                  AIXLUXURY.COM ↗
                </a>
              </div>
            </div>

            {/* Brand Relationship Notice */}
            <div className="p-4 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-[11px] font-mono text-[#777777] leading-relaxed">
              <strong className="text-[#A0A0A0]">PLATFORM BRAND RELATIONSHIP DISCLOSURE:</strong> CONSTRUCTIONS is an independent construction and real estate market research platform. AiXLuxury is the luxury real estate platform referenced on official brand properties. Cristian Văduva is the individual professional represented by cristianvaduva.com and aixluxury.com. Inclusion of third-party corporate entities or projects in the CONSTRUCTIONS database does not imply representation, endorsement, or commercial agency.
            </div>

          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
