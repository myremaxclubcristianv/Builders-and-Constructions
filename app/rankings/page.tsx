import Link from 'next/link';
import Image from 'next/image';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset, realProjectsDataset } from '@/lib/real-romanian-data';

export const metadata = {
  title: 'Romanian Developer & Project Rankings · CONSTRUCTIONS by AiXLuxury',
  description: 'Data-driven rankings of active real estate developers and landmark construction projects in Romania based on verified public disclosures.'
};

export default function RankingsPage() {
  const developers = realCompaniesDataset.filter(c => c.type === 'developer');

  const sortedByActive = [...developers].sort((a, b) => {
    const aActive = realProjectsDataset.filter(p => p.developer_slug === a.slug && p.status === 'under_construction').length;
    const bActive = realProjectsDataset.filter(p => p.developer_slug === b.slug && p.status === 'under_construction').length;
    return bActive - aActive;
  });

  const premiumProjects = realProjectsDataset.filter(p => p.is_featured);

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        {/* Page Hero */}
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
              Transparent Methodology & Data Rankings
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              NATIONAL DEVELOPER & PROJECT RANKINGS
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Objective data-driven rankings evaluating real estate developers, general contractors, and major construction pipelines across Romania based on verified primary disclosures.
            </p>
          </div>
        </section>

        {/* Methodology Note */}
        <section className="py-6 border-b border-[#1A1D1B] bg-[#050505]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="p-4 md:p-6 bg-[#111111] border border-[#C9A227]/40 rounded-xl space-y-2">
              <div className="text-[10px] font-mono text-[#C9A227] uppercase tracking-widest font-bold">
                DATA-BASED METHODOLOGY DISCLOSURE
              </div>
              <p className="text-xs text-[#A0A0A0] leading-relaxed">
                Rankings on this platform are computed directly from publicly verified records, official company reports, stock exchange disclosures (BVB, Euronext, JSE), and building permits. Data-based rankings reflect the <strong className="text-white">count of active construction sites under development</strong> and <strong className="text-white">total verified delivered portfolio units</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Top Active Developers */}
        <section className="py-10 md:py-16 border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-1">
                  Developer Benchmark
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  MOST ACTIVE DEVELOPERS BY SITES
                </h2>
              </div>
              <span className="text-xs font-mono text-[#888888]">Verified sites currently under construction</span>
            </div>

            <div className="space-y-3">
              {sortedByActive.slice(0, 10).map((dev, idx) => {
                const activeCount = realProjectsDataset.filter(p => p.developer_slug === dev.slug && p.status === 'under_construction').length;
                const totalCount = realProjectsDataset.filter(p => p.developer_slug === dev.slug).length;

                return (
                  <div
                    key={dev.slug}
                    className="p-4 md:p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#C9A227]/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-xl md:text-2xl font-mono font-extrabold w-10 ${idx < 3 ? 'text-[#C9A227]' : 'text-[#666666]'}`}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="text-base md:text-lg font-bold text-white">
                          <Link href={`/companies/${dev.slug}`} className="hover:text-[#C9A227] transition-colors">
                            {dev.name}
                          </Link>
                        </h3>
                        <p className="text-xs text-[#888888] font-mono mt-0.5">
                          HQ: {dev.location} · Markets: {dev.markets.slice(0, 3).join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-[#1A1D1B]">
                      <div className="text-left sm:text-right">
                        <span className="text-[9px] font-mono text-[#666666] uppercase block">ACTIVE SITES</span>
                        <span className="text-base font-bold text-[#C9A227] font-mono">{activeCount} Sites</span>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[9px] font-mono text-[#666666] uppercase block">PORTFOLIO</span>
                        <span className="text-base font-bold text-white font-mono">{totalCount} Projects</span>
                      </div>

                      <Link
                        href={`/companies/${dev.slug}`}
                        className="px-3.5 py-1.5 bg-[#050505] border border-[#1A1D1B] text-[#C9A227] hover:bg-[#C9A227] hover:text-[#050505] font-mono text-xs uppercase tracking-wider rounded-lg transition-all"
                      >
                        Profile →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Projects Ranking */}
        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="mb-8">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-1">
                Editorial & Scale Ranking
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                SIGNIFICANT DEVELOPMENTS IN ROMANIA
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {premiumProjects.slice(0, 6).map(p => (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="bg-[#111111] border border-[#1A1D1B] rounded-2xl overflow-hidden group hover:border-[#C9A227]/50 transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#0B0B0B]">
                    {p.image && (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-85" />
                    <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                      <span className="px-2.5 py-1 bg-[#C9A227] text-[#050505] font-mono font-bold text-[10px] uppercase tracking-wider rounded-md">
                        {p.status_display}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-[#C9A227] transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-[#A0A0A0]">
                      {p.location} · {p.developer_name}
                    </p>
                    <div className="pt-3 border-t border-[#1A1D1B] flex items-center justify-between text-[11px] font-mono text-[#888888]">
                      <span>{p.project_type}</span>
                      {p.unit_count && <span className="text-[#C9A227]">{p.unit_count} Units</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
