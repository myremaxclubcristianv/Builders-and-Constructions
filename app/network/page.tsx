import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset, realProjectsDataset } from '@/lib/real-romanian-data';

export const metadata = {
  title: 'Professional Relationship Network Explorer · CONSTRUCTIONS by AiXLuxury',
  description: 'Bi-directional relationship graph connecting developers, general contractors, lead architects, structural engineers, and regional city hubs in Romania.'
};

export default function NetworkPage() {
  const contractors = realCompaniesDataset.filter(c => c.type === 'general_contractor');
  const developers = realCompaniesDataset.filter(c => c.type === 'developer');

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
              Bi-Directional Graph Discovery
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              PROFESSIONAL NETWORK GRAPH
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Explore documented connections between real estate developers, general contractors, structural design practices, and major project developments.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-12">
            {/* General Contractors Network */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
                <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest">
                  GENERAL CONTRACTOR NETWORK ({contractors.length} INDEXED)
                </span>
                <span className="text-[10px] font-mono text-[#888888]">100% VERIFIED DISCLOSURES</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contractors.map(c => {
                  const projectsAsGC = realProjectsDataset.filter(p => p.contractor_slug === c.slug);
                  return (
                    <div key={c.slug} className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#C9A227]">GENERAL CONTRACTOR</span>
                        <span className="text-[10px] font-mono text-[#888888]">{projectsAsGC.length} PROJECTS</span>
                      </div>

                      <h2 className="text-base font-bold text-white">
                        <Link href={`/companies/${c.slug}`} className="hover:text-[#C9A227] transition-colors">
                          {c.name}
                        </Link>
                      </h2>

                      <p className="text-xs text-[#888888]">
                        HQ: {c.location} · Specializations: {c.specializations?.slice(0, 2).join(', ') || 'General Construction'}
                      </p>

                      <div className="pt-2 border-t border-[#1A1D1B] space-y-1 text-xs font-mono">
                        <span className="text-[10px] text-[#666666] uppercase block">CONNECTED PROJECTS:</span>
                        {projectsAsGC.length > 0 ? (
                          <div className="space-y-1">
                            {projectsAsGC.map(p => (
                              <Link key={p.slug} href={`/projects/${p.slug}`} className="text-[#38bdf8] hover:underline block truncate">
                                🏗️ {p.name}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[#666666] text-[10px]">NO SPECIFIC PROJECTS INDEXED</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Developer Network */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
                <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest">
                  DEVELOPER NETWORK ({developers.length} INDEXED)
                </span>
                <span className="text-[10px] font-mono text-[#888888]">100% VERIFIED DISCLOSURES</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {developers.slice(0, 6).map(dev => {
                  const devProjects = realProjectsDataset.filter(p => p.developer_slug === dev.slug);
                  return (
                    <div key={dev.slug} className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
                      <span className="text-[10px] font-mono text-[#38bdf8]">DEVELOPER ENTITY</span>
                      <h3 className="text-sm font-bold text-white">
                        <Link href={`/companies/${dev.slug}`} className="hover:text-[#C9A227]">
                          {dev.name}
                        </Link>
                      </h3>
                      <p className="text-xs text-[#888888] font-mono">{devProjects.length} Projects Indexed in {dev.location}</p>
                    </div>
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
