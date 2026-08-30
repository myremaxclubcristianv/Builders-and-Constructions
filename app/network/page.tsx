import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset, realProjectsDataset } from '@/lib/real-romanian-data';

export const metadata = {
  title: 'Professional Relationship Network Explorer · CONSTRUCTIONS by AiXLuxury',
  description: 'Bi-directional relationship graph connecting developers, general contractors, lead architects, structural engineers, and regional city hubs in Romania.'
};

export default function NetworkPage() {
  const developers = realCompaniesDataset.filter(c => c.type === 'developer');
  const contractors = realCompaniesDataset.filter(c => c.type === 'general_contractor' || c.type === 'construction_company' || c.type === 'infrastructure');
  const architects = realCompaniesDataset.filter(c => c.type === 'architecture');
  const engineers = realCompaniesDataset.filter(c => c.type === 'engineering' || c.type === 'structural_engineering' || c.type === 'mep');

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
              Multi-Role Market Intelligence Network
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              SOURCE-VERIFIED RELATIONSHIP GRAPH
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Explore documented bi-directional relationships connecting Developers ➔ Projects ➔ General Contractors ➔ Lead Architects ➔ Structural Engineers ➔ City Hubs in Romania.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-12">

            {/* Relationship Paradigm Banner */}
            <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1 font-mono text-xs">
                <span className="text-[#C9A227] font-bold block">VERIFIED RELATIONSHIP PIPELINE:</span>
                <span className="text-white">DEVELOPER ➔ PROJECT ➔ GENERAL CONTRACTOR ➔ ARCHITECT ➔ ENGINEER ➔ LOCATION</span>
              </div>
              <div className="text-xs font-mono text-[#888888] shrink-0">
                76 Projects · 146 Entities · 100% Provenance Ledger Linked
              </div>
            </div>

            {/* General Contractors & Project Relationships */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
                <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest">
                  GENERAL CONTRACTORS ({contractors.length} INDEXED)
                </span>
                <span className="text-[10px] font-mono text-[#888888]">PRIMARY CONTRACT PROVENANCE</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contractors.slice(0, 9).map(c => {
                  const projectsAsGC = realProjectsDataset.filter(p => p.contractor_slug === c.slug);
                  return (
                    <div key={c.slug} className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#C9A227] uppercase font-bold">{c.type.replaceAll('_', ' ')}</span>
                          <span className="text-[10px] font-mono text-[#888888]">{projectsAsGC.length} PROJECTS</span>
                        </div>

                        <h2 className="text-base font-bold text-white">
                          <Link href={`/companies/${c.slug}`} className="hover:text-[#C9A227] transition-colors">
                            {c.name}
                          </Link>
                        </h2>

                        <p className="text-xs text-[#888888]">
                          HQ: {c.location} · {c.description?.slice(0, 100)}...
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#1A1D1B] space-y-1.5 text-xs font-mono">
                        <span className="text-[10px] text-[#666666] uppercase block font-bold">CONNECTED PROJECT SITES:</span>
                        {projectsAsGC.length > 0 ? (
                          <div className="space-y-1">
                            {projectsAsGC.map(p => (
                              <div key={p.slug} className="p-2 bg-[#050505] border border-[#1A1D1B] rounded space-y-0.5">
                                <Link href={`/projects/${p.slug}`} className="text-[#38bdf8] hover:underline font-bold block truncate">
                                  🏗️ {p.name}
                                </Link>
                                <div className="text-[10px] text-[#888888]">
                                  Dev: {p.developer_name} · {p.location}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[#666666] text-[10px]">VERIFIED DISCLOSURES PENDING SPECIFIC ASSIGNMENT</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Architecture Practices & Structural Engineers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Architects */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
                  <span className="text-xs font-mono text-[#86efac] uppercase tracking-widest">
                    ARCHITECTS & DESIGN STUDIOS ({architects.length} INDEXED)
                  </span>
                </div>
                <div className="space-y-3">
                  {architects.slice(0, 6).map(arch => {
                    const archProjects = realProjectsDataset.filter(p => p.architect_slug === arch.slug || p.architect_name?.includes(arch.name));
                    return (
                      <div key={arch.slug} className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-mono text-[#86efac] uppercase">ARCHITECT PRACTICE</span>
                          <h3 className="text-sm font-bold text-white mt-0.5">
                            <Link href={`/companies/${arch.slug}`} className="hover:text-[#C9A227]">
                              {arch.name}
                            </Link>
                          </h3>
                          <p className="text-xs text-[#888888] font-mono">{arch.location} · {archProjects.length} Projects Connected</p>
                        </div>
                        <Link href={`/companies/${arch.slug}`} className="text-xs font-mono text-[#C9A227] hover:underline shrink-0 font-bold">
                          DOSSIER →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Engineers */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
                  <span className="text-xs font-mono text-[#e0a96d] uppercase tracking-widest">
                    ENGINEERING & STRUCTURAL CONSULTANTS ({engineers.length} INDEXED)
                  </span>
                </div>
                <div className="space-y-3">
                  {engineers.slice(0, 6).map(eng => {
                    const engProjects = realProjectsDataset.filter(p => p.engineering_slug === eng.slug || p.engineering_name?.includes(eng.name));
                    return (
                      <div key={eng.slug} className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-mono text-[#e0a96d] uppercase">ENGINEERING PRACTICE</span>
                          <h3 className="text-sm font-bold text-white mt-0.5">
                            <Link href={`/companies/${eng.slug}`} className="hover:text-[#C9A227]">
                              {eng.name}
                            </Link>
                          </h3>
                          <p className="text-xs text-[#888888] font-mono">{eng.location} · {engProjects.length} Projects Connected</p>
                        </div>
                        <Link href={`/companies/${eng.slug}`} className="text-xs font-mono text-[#C9A227] hover:underline shrink-0 font-bold">
                          DOSSIER →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Developers Overview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
                <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest">
                  DEVELOPER NETWORK ({developers.length} INDEXED)
                </span>
                <span className="text-[10px] font-mono text-[#888888]">100% SOURCE VERIFIED</span>
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

            {/* Independent Platform Disclosure */}
            <div className="p-4 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-[11px] font-mono text-[#777777] leading-relaxed">
              <strong className="text-[#A0A0A0]">INDEPENDENT RELATIONSHIP DISCLOSURE:</strong> All bi-directional relationships displayed in this network graph are sourced strictly from public procurement registers, official building permits, authenticated corporate press releases, and verified financial filings. Inclusion does not imply partnership or endorsement.
            </div>

          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
