import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset, realProjectsDataset, realLocationsDataset } from '@/lib/real-romanian-data';

export const metadata = {
  title: 'Data Index Coverage & Transparency · CONSTRUCTIONS by AiXLuxury',
  description: 'Audited index coverage metrics, non-fabrication disclosures, and tier 1-4 source provenance status.'
};

export default function CoveragePage() {
  const contractors = realCompaniesDataset.filter(c => c.type === 'general_contractor' || c.type === 'construction_company' || c.type === 'infrastructure');
  const architects = realCompaniesDataset.filter(c => c.type === 'architecture');
  const engineers = realCompaniesDataset.filter(c => c.type === 'engineering' || c.type === 'structural_engineering' || c.type === 'mep');
  const developers = realCompaniesDataset.filter(c => c.type === 'developer');
  const agencies = realCompaniesDataset.filter(c => c.type === 'real_estate_agency');

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
              Audited Index Metrics & Transparency
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              MARKET COVERAGE & DATA TRANSPARENCY
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Transparent disclosure of indexed Romanian market entities, verified claim ledgers, and areas with strong coverage versus regions where data remains under audit.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-12">
            {/* Disclaimer Banner */}
            <div className="p-6 bg-[#111111] border border-[#C9A227]/40 rounded-2xl space-y-2">
              <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest font-bold">
                PUBLIC INDEX SCOPE & NON-FABRICATION DISCLOSURE
              </span>
              <p className="text-xs text-[#A0A0A0] leading-relaxed">
                The numbers below represent entities <strong className="text-white">currently indexed and independently verified</strong> within CONSTRUCTIONS by AiXLuxury. To maintain 100% factual integrity, we do not fabricate figures or project exhaustiveness beyond our audited primary-source baseline.
              </p>
            </div>

            {/* Coverage Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-3">
                <span className="text-[10px] font-mono text-[#C9A227] uppercase tracking-widest">DEVELOPMENT PROJECTS</span>
                <div className="text-4xl font-extrabold text-white font-mono">{realProjectsDataset.length}</div>
                <p className="text-xs text-[#888888]">100% Sourced Real Project Photographs</p>
                <Link href="/projects" className="text-xs font-mono text-[#C9A227] hover:underline block pt-2 font-bold">
                  Browse Projects ({realProjectsDataset.length}) →
                </Link>
              </div>

              <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-3">
                <span className="text-[10px] font-mono text-[#C9A227] uppercase tracking-widest">INDEXED MARKET ENTITIES</span>
                <div className="text-4xl font-extrabold text-white font-mono">{realCompaniesDataset.length}</div>
                <p className="text-xs text-[#888888]">Developers, Agencies, Contractors, Architects, Engineers</p>
                <Link href="/companies" className="text-xs font-mono text-[#C9A227] hover:underline block pt-2 font-bold">
                  Browse Companies ({realCompaniesDataset.length}) →
                </Link>
              </div>

              <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-3">
                <span className="text-[10px] font-mono text-[#C9A227] uppercase tracking-widest">REGIONAL HUBS</span>
                <div className="text-4xl font-extrabold text-white font-mono">{realLocationsDataset.length}</div>
                <p className="text-xs text-[#888888]">Cities & Active Construction Corridors</p>
                <Link href="/cities" className="text-xs font-mono text-[#C9A227] hover:underline block pt-2 font-bold">
                  Browse Hubs ({realLocationsDataset.length}) →
                </Link>
              </div>
            </div>

            {/* Professional Breakdown */}
            <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl space-y-6">
              <h2 className="text-lg font-bold text-white tracking-tight">TAXONOMY INDEXING STATUS</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs font-mono">
                <div className="p-4 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl">
                  <span className="text-[#888888]">DEVELOPERS:</span>
                  <div className="text-2xl font-bold text-[#38bdf8] mt-1">{developers.length}</div>
                  <span className="text-[9px] text-[#888888] mt-1 block">STRONG COVERAGE</span>
                </div>
                <div className="p-4 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl">
                  <span className="text-[#888888]">CONTRACTORS:</span>
                  <div className="text-2xl font-bold text-[#C9A227] mt-1">{contractors.length}</div>
                  <span className="text-[9px] text-[#888888] mt-1 block">STRONG COVERAGE</span>
                </div>
                <div className="p-4 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl">
                  <span className="text-[#888888]">ARCHITECTS:</span>
                  <div className="text-2xl font-bold text-[#86efac] mt-1">{architects.length}</div>
                  <span className="text-[9px] text-[#888888] mt-1 block font-bold">STRONG COVERAGE</span>
                </div>
                <div className="p-4 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl">
                  <span className="text-[#888888]">ENGINEERS:</span>
                  <div className="text-2xl font-bold text-[#e0a96d] mt-1">{engineers.length}</div>
                  <span className="text-[9px] text-[#888888] mt-1 block font-bold">STRONG COVERAGE</span>
                </div>
                <div className="p-4 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl">
                  <span className="text-[#888888]">AGENCIES:</span>
                  <div className="text-2xl font-bold text-white mt-1">{agencies.length}</div>
                  <span className="text-[9px] text-[#888888] mt-1 block font-bold">STRONG COVERAGE</span>
                </div>
              </div>
            </div>

            {/* Coverage Limits Transparency */}
            <div className="p-6 bg-[#0B0B0B] border border-[#1A1D1B] rounded-2xl space-y-4 font-mono text-xs">
              <span className="text-[#C9A227] font-bold block">COVERAGE BOUNDARIES & LIMITATIONS TRANSPARENCY:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                  <span className="text-white font-bold block">HIGH COVERAGE REGIONS:</span>
                  <p className="text-[#888888] text-[11px] leading-relaxed">
                    Bucharest (Sectors 1, 2, 3, 4, 5, 6), Ilfov County, Cluj-Napoca, Timișoara, Iași, Brașov, Constanța, Sibiu, Oradea.
                  </p>
                </div>
                <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                  <span className="text-white font-bold block">COVERAGE UNDER AUDIT / EXPANSION:</span>
                  <p className="text-[#888888] text-[11px] leading-relaxed">
                    Secondary municipal centers (Tulcea, Mehedinți, Gorj, Harghita). National metric completeness: <span className="text-[#C9A227] font-bold">NOT YET MEASURED</span> until primary audit is complete.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
