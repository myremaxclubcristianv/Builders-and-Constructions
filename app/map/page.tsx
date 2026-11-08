import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realProjectsDataset, getVerifiedHubStatistics } from '@/lib/real-romanian-data';
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
  const verifiedHubs = getVerifiedHubStatistics();

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-amber-100 selection:text-amber-950">
      <SiteHeader />

      <main className="pt-24">
        {/* Map Hero */}
        <section className="py-12 md:py-16 border-b border-slate-200 bg-slate-50/70">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 block font-bold">
              INTELIGENȚĂ GEOGRAFICĂ &amp; DENSITATE URBANĂ
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
              HARTA NAȚIONALĂ A CONSTRUCȚIILOR DIN ROMÂNIA
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-3xl leading-relaxed">
              Distribuția spațială a șantierelor verificate faptic, amprentei dezvoltatorilor activi și densității dezvoltării imobiliare din București, Ilfov, Cluj-Napoca, Timișoara, Iași, Brașov, Constanța și polii regionali de investiții.
            </p>
          </div>
        </section>

        {/* Interactive Map Core Experience */}
        <section className="py-8 md:py-12 border-b border-slate-200 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <NationalConstructionMap />
          </div>
        </section>

        {/* Map Hub Distribution */}
        <section className="py-12 md:py-16 bg-slate-50/60">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="p-8 bg-white border border-slate-200 rounded-2xl space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-amber-800 uppercase tracking-wider font-bold block">POLI REGIONALI</span>
                  <h2 className="text-2xl font-bold text-slate-950 mt-1">DISTRIBUȚIE GEOGRAFICĂ PE ORAȘE</h2>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-2 text-slate-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600" /> Active ({activeUnderConstruction.length})
                  </span>
                  <span className="flex items-center gap-2 text-slate-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Livrate ({completedProjects.length})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {verifiedHubs.map(hub => (
                  <Link
                    key={hub.slug}
                    href={`/projects?q=${encodeURIComponent(hub.query)}`}
                    className="p-5 bg-slate-50 border border-slate-200 rounded-xl hover:border-amber-500 hover:shadow-xs transition-all flex items-center justify-between group"
                  >
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors">{hub.name}</h3>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{hub.county}</p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-base font-extrabold text-amber-800 block">{hub.indexedCount} Proiecte</span>
                      <span className="text-[11px] text-emerald-700 font-semibold block">{hub.activeCount} Active</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
