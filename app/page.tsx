import Link from 'next/link';
import Image from 'next/image';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getPublishedCompanies, getPublishedProjects, getIndustryHubData } from '@/lib/data';
import { CompanyIntelligencePreview } from '@/components/CompanyIntelligencePreview';

export default async function Home() {
  const [companyList, projectList, industryData] = await Promise.all([
    getPublishedCompanies(),
    getPublishedProjects(),
    getIndustryHubData()
  ]);

  const featuredProjects = projectList.slice(0, 6);
  const featuredCompanies = companyList.slice(0, 6);
  const { metrics, marketActivity } = industryData;

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen selection:bg-[#C9A227] selection:text-[#050505]">
      <SiteHeader />

      <main className="pt-20">
        {/* 01 — HERO EXPERIENCE */}
        <section className="relative pt-12 pb-16 md:pt-24 md:pb-28 overflow-hidden border-b border-[#1A1D1B]">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
            <div className="max-w-3xl space-y-6 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] border border-[#C9A227]/30 rounded-full text-[10px] font-mono tracking-widest text-[#C9A227] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse" />
                National Construction Intelligence Platform
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
                NATIONAL CONSTRUCTION <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F3F1EB] to-[#C9A227]">
                  INTELLIGENCE
                </span>
              </h1>

              <p className="text-sm md:text-base text-[#A0A0A0] leading-relaxed max-w-xl font-normal">
                Verified institutional intelligence documenting the developers, construction companies, engineers, and architectural practices shaping Romania&apos;s built environment.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/projects"
                  className="px-6 py-3.5 bg-[#C9A227] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#E4C58F] active:scale-95 transition-all text-center min-w-[140px]"
                >
                  Explore Projects
                </Link>
                <Link
                  href="/companies"
                  className="px-6 py-3.5 bg-[#111111] border border-[#1A1D1B] text-white font-mono text-xs font-semibold uppercase tracking-wider rounded-lg hover:border-[#C9A227]/50 active:scale-95 transition-all text-center min-w-[140px]"
                >
                  Explore Companies
                </Link>
                <Link
                  href="/map"
                  className="px-4 py-3.5 text-[#C9A227] hover:text-[#E4C58F] font-mono text-xs font-medium uppercase tracking-wider transition-colors flex items-center gap-1"
                >
                  <span>Interactive Map</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 02 — INTELLIGENCE COUNTERS */}
        <section className="bg-[#0B0B0B] border-b border-[#1A1D1B] py-8">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider">VERIFIED PROJECTS</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">53</span>
                  <span className="text-[10px] font-mono text-[#C9A227]">100% PASS</span>
                </div>
              </div>

              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider">VERIFIED COMPANIES</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">40</span>
                  <span className="text-[10px] font-mono text-[#C9A227]">ONRC/ANAF</span>
                </div>
              </div>

              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider">LOCATIONS COVERED</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">36</span>
                  <span className="text-[10px] font-mono text-[#C9A227]">CITIES</span>
                </div>
              </div>

              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider">CONTRACTORS</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">12</span>
                  <span className="text-[10px] font-mono text-[#C9A227]">TOP SECTOR</span>
                </div>
              </div>

              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider">ARCHITECTS</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">3</span>
                  <span className="text-[10px] font-mono text-[#C9A227]">PRACTICES</span>
                </div>
              </div>

              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider">ENGINEERS</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">3</span>
                  <span className="text-[10px] font-mono text-[#C9A227]">SPECIALISTS</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 — FEATURED PROJECTS */}
        <section className="py-12 md:py-20 border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-1">
                  Project Dossiers
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                  FEATURED CONSTRUCTION DOSSIERS
                </h2>
              </div>
              <Link href="/projects" className="text-xs font-mono text-[#C9A227] hover:text-[#E4C58F] uppercase tracking-wider flex items-center gap-1">
                <span>View all 53 projects</span>
                <span>→</span>
              </Link>
            </div>

            <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto pb-4 lg:pb-0 scrollbar-none snap-x snap-mandatory">
              {featuredProjects.map(p => (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="min-w-[85vw] sm:min-w-[400px] lg:min-w-0 snap-center bg-[#111111] border border-[#1A1D1B] rounded-2xl overflow-hidden group hover:border-[#C9A227]/50 transition-all flex flex-col"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#0B0B0B]">
                    {p.image && (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80" />
                    <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                      <span className="px-2.5 py-1 bg-[#050505]/80 backdrop-blur-md border border-[#1A1D1B] rounded-md text-[10px] font-mono text-white uppercase tracking-wider">
                        {p.status}
                      </span>
                      <span className="px-2 py-1 bg-[#C9A227]/20 border border-[#C9A227]/40 rounded-md text-[9px] font-mono text-[#C9A227] uppercase tracking-wider font-semibold">
                        VERIFIED
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#C9A227] transition-colors line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="text-xs text-[#A0A0A0] mt-1 font-medium">
                        {p.location}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1A1D1B] flex items-center justify-between text-[11px] font-mono text-[#888888]">
                      <span>{p.developer || 'Developer Disclosed'}</span>
                      <span className="text-[#C9A227]">DOSSIER →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 04 — EXPLORE BY INTELLIGENCE */}
        <section className="py-12 md:py-20 bg-[#0B0B0B] border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="mb-8">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-1">
                Navigation Directory
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                EXPLORE NATIONAL INTELLIGENCE
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/projects"
                className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl hover:border-[#C9A227]/50 transition-all group flex flex-col justify-between h-36"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#C9A227]">01 / DOSSIERS</span>
                  <span className="text-xs text-[#888888] group-hover:text-[#C9A227] transition-colors">→</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#C9A227] transition-colors">Projects</h3>
                  <p className="text-xs text-[#888888] mt-0.5">53 Verified Projects</p>
                </div>
              </Link>

              <Link
                href="/companies"
                className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl hover:border-[#C9A227]/50 transition-all group flex flex-col justify-between h-36"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#C9A227]">02 / CORPORATE</span>
                  <span className="text-xs text-[#888888] group-hover:text-[#C9A227] transition-colors">→</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#C9A227] transition-colors">Companies</h3>
                  <p className="text-xs text-[#888888] mt-0.5">40 Verified Profiles</p>
                </div>
              </Link>

              <Link
                href="/cities"
                className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl hover:border-[#C9A227]/50 transition-all group flex flex-col justify-between h-36"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#C9A227]">03 / GEOGRAPHIC</span>
                  <span className="text-xs text-[#888888] group-hover:text-[#C9A227] transition-colors">→</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#C9A227] transition-colors">Locations</h3>
                  <p className="text-xs text-[#888888] mt-0.5">36 Cities & Hubs</p>
                </div>
              </Link>

              <Link
                href="/rankings"
                className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl hover:border-[#C9A227]/50 transition-all group flex flex-col justify-between h-36"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#C9A227]">04 / LEADERSHIP</span>
                  <span className="text-xs text-[#888888] group-hover:text-[#C9A227] transition-colors">→</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#C9A227] transition-colors">Rankings</h3>
                  <p className="text-xs text-[#888888] mt-0.5">Industry Leaders</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* 05 — FEATURED COMPANIES */}
        <section className="py-12 md:py-20 border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-1">
                  Executive Dossiers
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                  VERIFIED INDUSTRY PLAYERS
                </h2>
              </div>
              <Link href="/companies" className="text-xs font-mono text-[#C9A227] hover:text-[#E4C58F] uppercase tracking-wider flex items-center gap-1">
                <span>View all 40 companies</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCompanies.map((c, idx) => (
                <div
                  key={c.slug}
                  className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl flex flex-col justify-between space-y-4 hover:border-[#C9A227]/50 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#888888]">0{idx + 1} · {c.type}</span>
                      <span className="px-2 py-0.5 bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30 rounded text-[9px] font-mono uppercase">
                        ONRC VERIFIED
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white">
                      <CompanyIntelligencePreview
                        company={{
                          name: c.name,
                          slug: c.slug,
                          type: c.type,
                          location: c.location,
                          active_projects_count: c.active_projects_count,
                          market_signals_count: c.market_signals_count,
                          last_activity_date: c.last_activity_date,
                          signal_freshness: c.signal_freshness
                        }}
                      >
                        <Link href={`/companies/${c.slug}`} className="hover:text-[#C9A227] transition-colors">
                          {c.name}
                        </Link>
                      </CompanyIntelligencePreview>
                    </h3>

                    <p className="text-xs text-[#A0A0A0] line-clamp-3 leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#1A1D1B] flex items-center justify-between text-xs">
                    <span className="text-[#888888] font-mono text-[11px]">{c.location}</span>
                    <Link
                      href={`/companies/${c.slug}`}
                      className="font-mono text-xs font-semibold text-[#C9A227] hover:text-[#E4C58F] tracking-wider"
                    >
                      DOSSIER →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 06 — LATEST ACTIVITY FEED */}
        <section className="py-12 md:py-20 bg-[#0B0B0B] border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="mb-8">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-1">
                Market Activity Stream
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                REAL-TIME VERIFIED SIGNALS
              </h2>
            </div>

            <div className="space-y-3">
              {marketActivity.slice(0, 5).map((act, i) => (
                <div
                  key={i}
                  className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#C9A227]/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
                    <div>
                      <h4 className="text-sm font-semibold text-white">{act.title}</h4>
                      <p className="text-xs text-[#888888] mt-0.5">{act.summary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-[#888888]">
                    <span>{act.event_date}</span>
                    <span className="px-2 py-0.5 bg-[#050505] border border-[#1A1D1B] rounded text-[10px] text-[#C9A227]">
                      {act.signal_type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 07 — FINAL CONVERSION CTA */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-[#111111] via-[#0B0B0B] to-[#050505]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 text-center space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">
              INSTITUTIONAL EXPOSURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
              ELEVATE YOUR ENTITY IN THE NATIONAL INTELLIGENCE DATASET
            </h2>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-xl mx-auto">
              Join leading Romanian developers, general contractors, and engineering practices documented in our verified institutional database.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/promote-company"
                className="px-6 py-3.5 bg-[#C9A227] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#E4C58F] active:scale-95 transition-all"
              >
                Promote My Company
              </Link>
              <Link
                href="/promote-project"
                className="px-6 py-3.5 bg-[#111111] border border-[#1A1D1B] text-white font-mono text-xs font-semibold uppercase tracking-wider rounded-lg hover:border-[#C9A227]/50 active:scale-95 transition-all"
              >
                Promote A Project
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
