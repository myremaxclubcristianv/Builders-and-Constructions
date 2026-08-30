import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset, realProjectsDataset } from '@/lib/real-romanian-data';

export const metadata = {
  title: 'Derived Opportunity Intelligence · CONSTRUCTIONS by AiXLuxury',
  description: 'Evidence-backed commercial opportunities derived strictly from verified project developments, company portfolio expansion, and professional network gaps.'
};

export default function OpportunitiesPage() {
  // Derive opportunities strictly from verified data
  const activeDevelopers = realCompaniesDataset.filter(c => {
    const devProjects = realProjectsDataset.filter(p => p.developer_slug === c.slug && p.status === 'under_construction');
    return devProjects.length >= 2;
  });

  const projectsWithUnspecifiedContractor = realProjectsDataset.filter(p => p.status === 'under_construction' && (!p.contractor_name || p.contractor_name === 'NOT DISCLOSED'));

  const majorProjects = realProjectsDataset.filter(p => (p.built_area_sqm || 0) >= 50000);

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
              Derived Market Intelligence
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              OPPORTUNITY INTELLIGENCE
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Commercial signals derived strictly from documented construction site activity, multi-project developer pipelines, and supply-chain network gaps.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-10">
            {/* Multi-Site Developer Expansion */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
                <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest">
                  DOCUMENTED PIPELINE EXPANSION (MULTI-SITE DEVELOPERS)
                </span>
                <span className="text-[10px] font-mono text-[#888888]">{activeDevelopers.length} ENTITIES DISCOVERED</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeDevelopers.map(dev => {
                  const sites = realProjectsDataset.filter(p => p.developer_slug === dev.slug && p.status === 'under_construction');
                  return (
                    <div key={dev.slug} className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-[#C9A227]/10 text-[#C9A227] rounded text-[10px] font-mono font-bold uppercase">
                          ACTIVE EXPANSION SIGNAL
                        </span>
                        <span className="text-[10px] font-mono text-[#888888]">VERIFIED TIER 1/2</span>
                      </div>

                      <h2 className="text-base font-bold text-white">
                        <Link href={`/companies/${dev.slug}`} className="hover:text-[#C9A227] transition-colors">
                          {dev.name}
                        </Link>
                      </h2>

                      <p className="text-xs text-[#A0A0A0]">
                        Documented with <strong className="text-white font-mono">{sites.length} active construction sites</strong> under development in {dev.location}.
                      </p>

                      <div className="pt-2 border-t border-[#1A1D1B] flex items-center justify-between text-xs font-mono">
                        <span className="text-[#888888]">Active Sites: {sites.map(s => s.name).join(', ')}</span>
                        <Link href={`/companies/${dev.slug}`} className="text-[#C9A227] font-semibold hover:underline">
                          RESEARCH DEVELOPER →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* General Contractor Gaps */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
                <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest">
                  PROJECTS WITH UNINDEXED CONTRACTOR PARTICIPATION
                </span>
                <span className="text-[10px] font-mono text-[#888888]">{projectsWithUnspecifiedContractor.length} PROJECTS DISCOVERED</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectsWithUnspecifiedContractor.map(p => (
                  <div key={p.slug} className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-[#38bdf8]/10 text-[#38bdf8] rounded text-[10px] font-mono font-bold uppercase">
                        NETWORK RESEARCH GAP
                      </span>
                      <span className="text-[10px] font-mono text-[#888888]">STATUS: {p.status_display}</span>
                    </div>

                    <h3 className="text-base font-bold text-white">
                      <Link href={`/projects/${p.slug}`} className="hover:text-[#C9A227] transition-colors">
                        {p.name}
                      </Link>
                    </h3>

                    <p className="text-xs text-[#A0A0A0]">
                      Developer: {p.developer_name} · Location: {p.location}. General contractor field is currently marked <strong className="text-white font-mono">NOT DISCLOSED</strong> in public records.
                    </p>

                    <div className="pt-2 border-t border-[#1A1D1B] flex items-center justify-between text-xs font-mono">
                      <span className="text-[#888888]">Built Area: {p.built_area_sqm ? `${p.built_area_sqm.toLocaleString()} m²` : 'NOT DISCLOSED'}</span>
                      <Link href={`/projects/${p.slug}`} className="text-[#38bdf8] font-semibold hover:underline">
                        INSPECT DOSSIER →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Landmark Scale Developments */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
                <span className="text-xs font-mono text-[#86efac] uppercase tracking-widest">
                  LANDMARK SCALE DEVELOPMENTS (&gt;= 50,000 M²)
                </span>
                <span className="text-[10px] font-mono text-[#888888]">{majorProjects.length} PROJECTS DISCOVERED</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {majorProjects.map(p => (
                  <div key={p.slug} className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
                    <span className="text-[10px] font-mono text-[#86efac]">LANDMARK SCALE</span>
                    <h4 className="text-sm font-bold text-white">
                      <Link href={`/projects/${p.slug}`} className="hover:text-[#C9A227]">
                        {p.name}
                      </Link>
                    </h4>
                    <p className="text-xs font-mono text-[#C9A227]">{p.built_area_sqm?.toLocaleString()} m² Built Area</p>
                  </div>
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
