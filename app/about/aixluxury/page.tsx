import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'AiXLuxury — Luxury Real Estate Platform Powered by Cristian Văduva',
  description: 'Official institutional platform profile for AiXLuxury: Luxury Real Estate Powered by Cristian Văduva, focusing on Monaco, Dubai, Bucharest, and premier European destinations.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/about/aixluxury'
  }
};

export default function AiXLuxuryProfilePage() {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AiXLuxury',
    url: 'https://aixluxury.com',
    email: 'contact@aixluxury.com',
    telephone: '+43 650 953 6345',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bucharest',
      addressCountry: 'Romania'
    },
    description: 'Luxury real estate platform focused on Monaco, Dubai, Bucharest, and premier European destinations.'
  };

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <SiteHeader />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] font-bold">
                INSTITUTIONAL PLATFORM PROFILE
              </span>
              <span className="px-2 py-0.5 bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30 rounded text-[9px] font-mono font-bold uppercase">
                VERIFIED OFFICIAL SOURCE
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
              AiXLUXURY
            </h1>
            <p className="text-lg md:text-xl text-[#C9A227] font-mono tracking-wide">
              LUXURY REAL ESTATE POWERED BY CRISTIAN VĂDUVA
            </p>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-3xl leading-relaxed">
              Bespoke real estate platform dedicated to luxury property acquisition, seller representation, market intelligence, asset protection strategy, and high-value international property portfolios across Monaco, Dubai, Bucharest, and premier European destinations.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-[#777777]">
              <span>GEOGRAPHIC HUB: MONACO · DUBAI · BUCHAREST · EUROPE & BEYOND</span>
            </div>
          </div>
        </section>

        {/* Corporate Positioning & Mission */}
        <section className="py-12 md:py-16 border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-4">
                <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest font-bold block">
                  CORPORATE POSITIONING & MISSION
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Redefining Luxury Real Estate Representation & Asset Protection
                </h2>
                <div className="space-y-4 text-sm text-[#A0A0A0] leading-relaxed">
                  <p>
                    AiXLuxury operates as a high-end real estate platform focused on redefining luxury real estate advisory through bespoke client service, privacy, discretion, and technical rigor.
                  </p>
                  <p>
                    The platform bridges premier real estate markets in Monaco, Dubai, and Bucharest with high-net-worth investors and private clients looking for exceptional residential properties, historic landmarks, penthouses, and strategic asset protection.
                  </p>
                </div>
              </div>

              {/* Geographical Hub Card */}
              <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl space-y-6">
                <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest font-bold block">
                  INTERNATIONAL GEOGRAPHIC HUB
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="p-4 bg-[#050505] border border-[#1A1D1B] rounded-xl space-y-1">
                    <span className="text-[10px] text-[#888888] block">PRIMARY MARKET</span>
                    <strong className="text-white text-sm block">MONACO</strong>
                    <span className="text-[10px] text-[#C9A227] block font-bold">LUXURY HUB</span>
                  </div>
                  <div className="p-4 bg-[#050505] border border-[#1A1D1B] rounded-xl space-y-1">
                    <span className="text-[10px] text-[#888888] block">PRIMARY MARKET</span>
                    <strong className="text-white text-sm block">DUBAI</strong>
                    <span className="text-[10px] text-[#C9A227] block font-bold">INTERNATIONAL HUB</span>
                  </div>
                  <div className="p-4 bg-[#050505] border border-[#1A1D1B] rounded-xl space-y-1">
                    <span className="text-[10px] text-[#888888] block">PRIMARY MARKET</span>
                    <strong className="text-white text-sm block">BUCHAREST</strong>
                    <span className="text-[10px] text-[#C9A227] block font-bold">REGIONAL HQ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Matrix */}
            <div className="space-y-6 pt-6 border-t border-[#1A1D1B]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest font-bold">
                  PUBLISHED SERVICES MATRIX (01 — 06)
                </span>
                <span className="text-[10px] font-mono text-[#777777]">SOURCE: AIXLUXURY.COM</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
                
                {/* 01 Buyer Representation */}
                <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl space-y-3">
                  <span className="text-[#C9A227] font-bold block text-sm">01 — BUYER REPRESENTATION</span>
                  <p className="text-[#888888] text-[11px] leading-relaxed">
                    Market analysis, offer filtering, price negotiation, legal support, technical due diligence, exclusive buyer assistance, off-market opportunities.
                  </p>
                </div>

                {/* 02 Seller Representation */}
                <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl space-y-3">
                  <span className="text-[#C9A227] font-bold block text-sm">02 — SELLER REPRESENTATION</span>
                  <p className="text-[#888888] text-[11px] leading-relaxed">
                    Customized marketing plan, property positioning, buyer qualification, home staging, professional photo/video preparation, international exposure.
                  </p>
                </div>

                {/* 03 Luxury Real Estate */}
                <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl space-y-3">
                  <span className="text-[#C9A227] font-bold block text-sm">03 — LUXURY REAL ESTATE</span>
                  <p className="text-[#888888] text-[11px] leading-relaxed">
                    Luxury residences, premium apartments, villas, penthouses, historic properties, Monaco, Dubai, prestigious European destinations.
                  </p>
                </div>

                {/* 04 Insurance / Asset Protection */}
                <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl space-y-3">
                  <span className="text-[#C9A227] font-bold block text-sm">04 — ASSET PROTECTION ADVISORY</span>
                  <p className="text-[#888888] text-[11px] leading-relaxed">
                    Strategic consulting and insurance brokerage alignment structured as part of long-term asset value protection and risk mitigation.
                  </p>
                </div>

                {/* 05 Real Estate Data / Market Insights */}
                <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl space-y-3">
                  <span className="text-[#C9A227] font-bold block text-sm">05 — MARKET DATA & INSIGHTS</span>
                  <p className="text-[#888888] text-[11px] leading-relaxed">
                    Real estate statistics, yield reports, price-per-square-meter analysis, ROI studies, asset-value evolution, market intelligence.
                  </p>
                </div>

                {/* 06 Investments */}
                <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl space-y-3">
                  <span className="text-[#C9A227] font-bold block text-sm">06 — INVESTMENTS & UHNW NETWORK</span>
                  <p className="text-[#888888] text-[11px] leading-relaxed">
                    Investments (Yachts, Supercars and More) alongside connection to qualified private investor networks and UHNW advisory channels.
                  </p>
                </div>

              </div>
            </div>

            {/* From Acquisition to Full Protection */}
            <div className="p-8 bg-[#0B0B0B] border border-[#1A1D1B] rounded-2xl space-y-4">
              <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest font-bold block">
                CORE PHILOSOPHY: FROM ACQUISITION TO FULL PROTECTION
              </span>
              <h3 className="text-xl font-bold text-white">
                Selecting · Positioning · Negotiating · Protecting · Maintaining Long-Term Value
              </h3>
              <p className="text-xs text-[#A0A0A0] leading-relaxed max-w-4xl">
                A luxury property transaction is treated not merely as a purchase, but as an integral asset acquisition within a broader wealth preservation strategy. AiXLuxury structures every transaction from initial site selection and price negotiation through asset protection and ongoing value performance.
              </p>
            </div>

            {/* Verified Official Contact */}
            <div className="p-6 bg-[#0B0B0B] border border-[#1A1D1B] rounded-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-4">
                <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest font-bold">
                  VERIFIED OFFICIAL CONTACT
                </span>
                <span className="text-[10px] font-mono text-[#777777]">LOCATION: BUCHAREST, ROMANIA</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#888888] uppercase block">OFFICIAL EMAIL</span>
                  <a href="mailto:contact@aixluxury.com" className="text-[#C9A227] font-bold hover:underline block text-sm">
                    contact@aixluxury.com
                  </a>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#888888] uppercase block">OFFICIAL TELEPHONE</span>
                  <a href="tel:+436509536345" className="text-white font-bold hover:text-[#C9A227] block text-sm">
                    +43 650 953 6345
                  </a>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#888888] uppercase block">OFFICIAL DOMAIN</span>
                  <a href="https://aixluxury.com" target="_blank" rel="noreferrer" className="text-white font-bold hover:text-[#C9A227] block text-sm">
                    https://aixluxury.com ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Brand Relationship Notice */}
            <div className="p-4 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-[11px] font-mono text-[#777777] leading-relaxed">
              <strong className="text-[#A0A0A0]">PLATFORM BRAND RELATIONSHIP DISCLOSURE:</strong> CONSTRUCTIONS by AiXLuxury is an independent market research platform. AiXLuxury is the luxury real estate platform referenced on official website properties. Inclusion of third-party corporate entities or projects in the CONSTRUCTIONS database does not imply commercial representation, endorsement, or sales agency.
            </div>

          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
