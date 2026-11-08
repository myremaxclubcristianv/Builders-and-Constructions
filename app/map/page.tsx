import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realProjectsDataset, realLocationsDataset } from '@/lib/real-romanian-data';
import { NationalConstructionMap } from '@/components/NationalConstructionMap';

export const metadata = {
  title: 'Harta Națională a Construcțiilor din România · CONSTRUCTIONS by AiXLuxury',
  description: 'Hartă interactivă națională a șantierelor active, proiectelor finalizate și densității dezvoltării imobiliare din București, Cluj, Timișoara, Iași, Brașov și principalele centre urbane.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/map'
  }
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
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block font-bold">
              INTELIGENȚĂ GEOGRAFICĂ & DENSITATE URBANĂ
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              HARTA NAȚIONALĂ A CONSTRUCȚIILOR DIN ROMÂNIA
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-3xl leading-relaxed">
              Distribuția spațială a șantierelor verificate faptic, amprentei dezvoltatorilor activi și densității dezvoltării imobiliare din București, Ilfov, Cluj-Napoca, Timișoara, Iași, Brașov, Constanța și polii regionali de investiții.
            </p>
          </div>
        </section>

        {/* Interactive Map Core Experience */}
        <section className="py-8 md:py-12 border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <NationalConstructionMap />
          </div>
        </section>

        {/* Map Hub Distribution */}
        <section className="py-10 md:py-16 border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1D1B] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#C9A227] uppercase tracking-wider block">POLI REGIONALI</span>
                  <h2 className="text-xl font-bold text-white mt-0.5">DISTRIBUȚIE GEOGRAFICĂ PE ORAȘE</h2>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-2 text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C9A227]" /> Active ({activeUnderConstruction.length})
                  </span>
                  <span className="flex items-center gap-2 text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" /> Livrate ({completedProjects.length})
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
                        <span className="text-sm font-extrabold text-[#C9A227] block">{count} Proiecte</span>
                        <span className="text-[10px] text-[#22c55e] block">{active} Active</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
