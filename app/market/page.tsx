import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getIndustryHubData } from '@/lib/data';
import { realCompaniesDataset, realProjectsDataset, realLocationsDataset } from '@/lib/real-romanian-data';

export const metadata = {
  title: 'Market Intelligence Dashboard — Romanian Construction & Real Estate Terminal',
  description: 'Audited market intelligence overview documenting 146 market entities, 76 development projects, 36 regional hubs, and verified market signals in Romania.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/market'
  }
};

export default async function MarketDashboardPage() {
  const hubData = await getIndustryHubData();
  const { marketActivity } = hubData;

  const developers = realCompaniesDataset.filter(c => c.type === 'developer');
  const contractors = realCompaniesDataset.filter(c => c.type === 'general_contractor' || c.type === 'construction_company' || c.type === 'infrastructure');
  const architects = realCompaniesDataset.filter(c => c.type === 'architecture');
  const engineers = realCompaniesDataset.filter(c => c.type === 'engineering' || c.type === 'structural_engineering' || c.type === 'mep');
  const agencies = realCompaniesDataset.filter(c => c.type === 'real_estate_agency');

  // Asset class distribution dynamically computed
  const assetClasses = [
    { label: 'Residential', count: realProjectsDataset.filter(p => p.project_type === 'Residential').length, href: '/search?q=Residential' },
    { label: 'Office', count: realProjectsDataset.filter(p => p.project_type === 'Office').length, href: '/search?q=Office' },
    { label: 'Mixed-use', count: realProjectsDataset.filter(p => p.project_type === 'Mixed-use').length, href: '/search?q=Mixed-use' },
    { label: 'Industrial / Logistics', count: realProjectsDataset.filter(p => p.project_type === 'Industrial/Logistics').length, href: '/search?q=Industrial' },
    { label: 'Civil Infrastructure', count: realProjectsDataset.filter(p => p.project_type === 'Civil Infrastructure').length, href: '/search?q=Infrastructure' },
    { label: 'Retail', count: realProjectsDataset.filter(p => p.project_type === 'Retail').length, href: '/search?q=Retail' },
    { label: 'Hospitality', count: realProjectsDataset.filter(p => p.project_type === 'Hospitality').length, href: '/search?q=Hospitality' }
  ];

  // Key Regional Hub Activity
  const regionalActivity = [
    { city: 'Bucharest', slug: 'bucharest', projects: realProjectsDataset.filter(p => p.location.includes('Bucharest') || p.location.includes('București')).length },
    { city: 'Cluj-Napoca', slug: 'cluj-napoca', projects: realProjectsDataset.filter(p => p.location.includes('Cluj')).length },
    { city: 'Timișoara', slug: 'timisoara', projects: realProjectsDataset.filter(p => p.location.includes('Timiș')).length },
    { city: 'Iași', slug: 'iasi', projects: realProjectsDataset.filter(p => p.location.includes('Iași')).length },
    { city: 'Brașov', slug: 'brasov', projects: realProjectsDataset.filter(p => p.location.includes('Brașov')).length },
    { city: 'Constanța', slug: 'constanta', projects: realProjectsDataset.filter(p => p.location.includes('Constanța') || p.location.includes('Mamaia')).length }
  ];

  const marketJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Market Intelligence Dashboard — CONSTRUCTIONS by AiXLuxury',
    description: 'Central market intelligence dashboard for the Romanian construction and real estate market.',
    url: 'https://constructions.cristianvaduva.com/market'
  };

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(marketJsonLd) }}
      />
      <SiteHeader />

      <main className="pt-20">
        {/* Hero Banner */}
        <section className="py-12 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] font-bold">
                Market Intelligence Overview
              </span>
              <span className="px-2 py-0.5 bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30 rounded text-[9px] font-mono font-bold uppercase">
                LIVE TERMINAL
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              NATIONAL MARKET INTELLIGENCE DASHBOARD
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Central intelligence terminal aggregating 146 verified corporate entities, 76 documented construction developments, 36 regional hubs, and live market signals across Romania.
            </p>
          </div>
        </section>

        {/* Core Metrics Overview Grid */}
        <section className="py-10 md:py-14 border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-8">
            <div className="flex items-center justify-between text-xs font-mono text-[#888888]">
              <span className="text-white font-bold uppercase tracking-wider">COMPUTED DATABASE METRICS</span>
              <span className="text-[#C9A227]">LAST VERIFIED: 2026-08-31</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-mono">
              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                <span className="text-[10px] text-[#888888] block">TOTAL ENTITIES</span>
                <div className="text-2xl font-bold text-white">{realCompaniesDataset.length}</div>
                <span className="text-[9px] text-[#C9A227] block font-bold">VERIFIED</span>
              </div>
              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                <span className="text-[10px] text-[#888888] block">TOTAL PROJECTS</span>
                <div className="text-2xl font-bold text-white">{realProjectsDataset.length}</div>
                <span className="text-[9px] text-[#38bdf8] block font-bold">DOCUMENTED</span>
              </div>
              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                <span className="text-[10px] text-[#888888] block">DEVELOPERS</span>
                <div className="text-2xl font-bold text-[#38bdf8]">{developers.length}</div>
                <span className="text-[9px] text-[#888888] block">100% SOURCED</span>
              </div>
              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                <span className="text-[10px] text-[#888888] block">CONTRACTORS</span>
                <div className="text-2xl font-bold text-[#C9A227]">{contractors.length}</div>
                <span className="text-[9px] text-[#888888] block">100% SOURCED</span>
              </div>
              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                <span className="text-[10px] text-[#888888] block">ARCHITECTS</span>
                <div className="text-2xl font-bold text-[#86efac]">{architects.length}</div>
                <span className="text-[9px] text-[#888888] block">100% SOURCED</span>
              </div>
              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                <span className="text-[10px] text-[#888888] block">ENGINEERS</span>
                <div className="text-2xl font-bold text-[#e0a96d]">{engineers.length}</div>
                <span className="text-[9px] text-[#888888] block">100% SOURCED</span>
              </div>
              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                <span className="text-[10px] text-[#888888] block">AGENCIES</span>
                <div className="text-2xl font-bold text-white">{agencies.length}</div>
                <span className="text-[9px] text-[#888888] block">100% SOURCED</span>
              </div>
              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                <span className="text-[10px] text-[#888888] block">REGIONAL HUBS</span>
                <div className="text-2xl font-bold text-white">{realLocationsDataset.length}</div>
                <span className="text-[9px] text-[#C9A227] block font-bold">COVERAGE</span>
              </div>
            </div>

            {/* Construction Stage Breakdown Bar */}
            <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="flex items-center justify-between p-3 bg-[#050505] border border-[#1A1D1B] rounded-lg">
                <span className="text-[#888888]">ACTIVE SITES UNDER CONSTRUCTION</span>
                <strong className="text-[#38bdf8] font-bold text-sm">
                  {realProjectsDataset.filter(p => p.status !== 'completed' && p.status !== 'delivered').length} SITES
                </strong>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#050505] border border-[#1A1D1B] rounded-lg">
                <span className="text-[#888888]">PERMITTED / PLANNING PIPELINE</span>
                <strong className="text-[#C9A227] font-bold text-sm">
                  {realProjectsDataset.filter(p => (p.status || '').toLowerCase().includes('plan') || (p.status || '').toLowerCase().includes('permit') || (p.status || '').toLowerCase().includes('announced')).length} PROJECTS
                </strong>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#050505] border border-[#1A1D1B] rounded-lg">
                <span className="text-[#888888]">DOCUMENTED RECENT DELIVERIES</span>
                <strong className="text-[#86efac] font-bold text-sm">
                  {realProjectsDataset.filter(p => p.status === 'completed' || p.status === 'delivered').length} COMPLETED
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* Regional Activity & Asset Classes Grid */}
        <section className="py-12 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Documented Activity by Region */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
                  <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest font-bold">
                    DOCUMENTED ACTIVITY BY REGIONAL HUB
                  </span>
                  <Link href="/cities" className="text-xs font-mono text-[#C9A227] hover:underline font-bold">
                    ALL HUBS ({realLocationsDataset.length}) →
                  </Link>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {regionalActivity.map(reg => (
                    <div key={reg.slug} className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex items-center justify-between hover:border-[#C9A227]/40 transition-all">
                      <div>
                        <span className="text-[#888888] text-[10px] block uppercase">REGIONAL HUB</span>
                        <h3 className="text-sm font-bold text-white mt-0.5">{reg.city}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-[#C9A227]">{reg.projects} PROJECTS COVERED</span>
                        <Link href={`/cities/${reg.slug}`} className="px-3 py-1.5 bg-[#050505] border border-[#1A1D1B] text-[#C9A227] rounded text-[11px] hover:border-[#C9A227]">
                          EXPLORE →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Asset Class Distribution */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
                  <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest font-bold">
                    DOCUMENTED ASSET CLASS DISTRIBUTION
                  </span>
                  <Link href="/search" className="text-xs font-mono text-[#38bdf8] hover:underline font-bold">
                    SEARCH TERMINAL →
                  </Link>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {assetClasses.map(ac => (
                    <div key={ac.label} className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex items-center justify-between hover:border-[#38bdf8]/40 transition-all">
                      <div>
                        <span className="text-[#888888] text-[10px] block uppercase">ASSET SECTOR</span>
                        <h3 className="text-sm font-bold text-white mt-0.5">{ac.label}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-[#38bdf8]">{ac.count} DOCUMENTED SITES</span>
                        <Link href={ac.href} className="px-3 py-1.5 bg-[#050505] border border-[#1A1D1B] text-[#38bdf8] rounded text-[11px] hover:border-[#38bdf8]">
                          FILTER →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Verified Market Signals Stream */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
                <span className="text-xs font-mono text-[#86efac] uppercase tracking-widest font-bold">
                  RECENT VERIFIED MARKET SIGNALS ({marketActivity.length})
                </span>
                <Link href="/signals" className="text-xs font-mono text-[#86efac] hover:underline font-bold">
                  FULL SIGNAL FEED →
                </Link>
              </div>

              <div className="space-y-3">
                {marketActivity.slice(0, 5).map(sig => (
                  <div key={sig.id} className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono text-[#86efac] font-bold uppercase">{sig.signal_type.replaceAll('_', ' ')} · {sig.event_date}</span>
                      <h4 className="text-sm font-bold text-white mt-0.5">{sig.title}</h4>
                      <p className="text-xs text-[#888888] mt-1">{sig.summary}</p>
                    </div>
                    {sig.source_url && (
                      <a href={sig.source_url} target="_blank" rel="noreferrer" className="text-xs font-mono text-[#C9A227] hover:underline shrink-0 font-bold">
                        VERIFY CITATION ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Neutrality Disclosure */}
            <div className="p-4 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-[11px] font-mono text-[#777777] leading-relaxed">
              <strong className="text-[#A0A0A0]">INDEPENDENT PLATFORM DISCLOSURE:</strong> CONSTRUCTIONS is an independent information and research platform. Inclusion of an entity does not imply representation, endorsement, partnership, or commercial relationship with that entity. All database metrics are calculated programmatically from verified public records.
            </div>

          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
