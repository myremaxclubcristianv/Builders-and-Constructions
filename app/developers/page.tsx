import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset } from '@/lib/real-romanian-data';

export const metadata: Metadata = {
  title: 'Real Estate Developers Directory | CONSTRUCTIONS by AiXLuxury',
  description: 'Verified public-source directory of real estate developers, property investors, and urban regeneration firms operating in Romania.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/developers'
  }
};

export default function DevelopersPage() {
  const developers = realCompaniesDataset.filter(c => c.type === 'developer');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Real Estate Developers Directory',
    description: 'Verified directory of real estate developers in Romania.',
    url: 'https://constructions.cristianvaduva.com/developers',
    numberOfItems: developers.length
  };

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <main className="pt-24 pb-20">
        <section className="border-b border-[#1A1D1B] bg-[#0B0B0B] py-12 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C9A227]">
              <span>MARKET TAXONOMY</span>
              <span>·</span>
              <span className="text-white font-bold">{developers.length} VERIFIED DEVELOPERS</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              REAL ESTATE DEVELOPERS
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-3xl leading-relaxed font-mono">
              Independent intelligence directory covering property developers, green residential investors, commercial builders, and urban regeneration groups across Romania.
            </p>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-4 md:px-8 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developers.map(dev => (
              <div
                key={dev.id}
                className="bg-[#0B0B0B] border border-[#1A1D1B] hover:border-[#C9A227]/50 transition-all rounded-xl p-6 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30 text-[10px] font-mono font-bold uppercase rounded">
                      DEVELOPER
                    </span>
                    <span className="text-[10px] font-mono text-[#888888]">
                      Founded {dev.founded_year || 'N/A'}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-white group-hover:text-[#C9A227] transition-colors leading-snug">
                    <Link href={`/companies/${dev.slug}`}>
                      {dev.name}
                    </Link>
                  </h2>

                  <p className="text-xs text-[#A0A0A0] font-sans line-clamp-3 leading-relaxed">
                    {dev.description}
                  </p>

                  <div className="pt-2 text-[11px] font-mono text-[#888888] space-y-1">
                    <div>📍 <span className="text-[#C5C5C5]">{dev.location}</span></div>
                    <div>🏢 Projects: <span className="text-[#C9A227] font-bold">{dev.projects_count}</span> ({dev.active_projects_count} Active)</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1A1D1B] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#666666]">
                    VERIFIED SOURCE
                  </span>
                  <Link
                    href={`/companies/${dev.slug}`}
                    className="text-xs font-mono font-bold text-[#C9A227] hover:underline flex items-center gap-1"
                  >
                    <span>VIEW DOSSIER</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Independent Platform Disclaimer */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-[#1A1D1B]">
          <div className="p-6 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-mono space-y-2">
            <span className="text-[#C9A227] uppercase font-bold block">INDEPENDENT PLATFORM DISCLOSURE</span>
            <p className="text-[#A0A0A0] leading-relaxed">
              CONSTRUCTIONS is an independent information and research platform. Inclusion of a real estate developer does not imply representation, endorsement, partnership, or commercial relationship with that entity.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
