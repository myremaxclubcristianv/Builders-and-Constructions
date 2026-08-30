import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realProjectsDataset, realLocationsDataset } from '@/lib/real-romanian-data';

export const metadata = {
  title: 'National Construction Map Romania · CONSTRUCTIONS by AiXLuxury',
  description: 'Interactive national map of active construction sites, completed developments, and urban regeneration projects across Romanian cities.'
};

export default function ConstructionMapPage() {
  const activeUnderConstruction = realProjectsDataset.filter(p => p.status === 'under_construction');
  const completedProjects = realProjectsDataset.filter(p => p.status === 'completed');

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        {/* Map Hero */}
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
              Geographic Market Intelligence
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              NATIONAL CONSTRUCTION DENSITY MAP
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Geographic distribution of verified construction sites, active developer footprints, and development density across Bucharest, Ilfov, Cluj, Timișoara, Iași, Brașov, and regional hubs.
            </p>
          </div>
        </section>

        {/* Map Hub Distribution */}
        <section className="py-10 md:py-16 border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1D1B] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#C9A227] uppercase tracking-wider block">NATIONAL HUBS</span>
                  <h2 className="text-xl font-bold text-white mt-0.5">GEOGRAPHIC DISTRIBUTION BY CITY</h2>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-2 text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C9A227]" /> Active ({activeUnderConstruction.length})
                  </span>
                  <span className="flex items-center gap-2 text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" /> Delivered ({completedProjects.length})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {realLocationsDataset.slice(0, 12).map(loc => {
                  const count = realProjectsDataset.filter(p => p.location.toLowerCase().includes(loc.name.toLowerCase()) || p.location.toLowerCase().includes(loc.city.toLowerCase())).length;
                  const active = realProjectsDataset.filter(p => (p.location.toLowerCase().includes(loc.name.toLowerCase()) || p.location.toLowerCase().includes(loc.city.toLowerCase())) && p.status === 'under_construction').length;

                  return (
                    <Link
                      key={loc.slug}
                      href={`/cities/${loc.slug}`}
                      className="p-4 bg-[#050505] border border-[#1A1D1B] rounded-xl hover:border-[#C9A227]/50 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-[#C9A227] transition-colors">{loc.name}</h3>
                        <p className="text-[11px] text-[#666666] font-mono">{loc.county} County</p>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-sm font-extrabold text-[#C9A227] block">{count} Projects</span>
                        <span className="text-[10px] text-[#888888]">{active} Active</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* All Geocoded Sites Grid */}
        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="mb-8">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-1">
                Geocoded Sites Index
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                ALL RECORDED CONSTRUCTION LOCATIONS ({realProjectsDataset.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {realProjectsDataset.map(p => (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl hover:border-[#C9A227]/50 transition-all group flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className={`font-bold ${p.status === 'under_construction' ? 'text-[#C9A227]' : 'text-[#22c55e]'}`}>
                        {p.status_display.toUpperCase()}
                      </span>
                      <span className="text-[#888888]">{p.location}</span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#C9A227] transition-colors">
                      {p.name}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-[#1A1D1B] flex items-center justify-between text-xs font-mono text-[#888888]">
                    <span>{p.developer_name}</span>
                    <span>{p.project_type}</span>
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
