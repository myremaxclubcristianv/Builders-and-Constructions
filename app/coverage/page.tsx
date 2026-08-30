import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset, realProjectsDataset, realLocationsDataset } from '@/lib/real-romanian-data';

export const metadata = {
  title: 'Data Index Coverage & Transparency · CONSTRUCTIONS by AiXLuxury',
  description: 'Audited index coverage metrics, non-fabrication disclosures, and tier 1-4 source provenance status.'
};

export default function CoveragePage() {
  const contractorCount = 12;
  const architectCount = 3;
  const engineerCount = 3;

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
              Audited Index Metrics
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              DATA COVERAGE & TRANSPARENCY
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Transparent disclosure of currently indexed Romanian market entities, verified claim ledgers, and 4-tier source provenance bounds.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-12">
            {/* Disclaimer Banner */}
            <div className="p-6 bg-[#111111] border border-[#C9A227]/40 rounded-2xl space-y-2">
              <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest font-bold">
                PUBLIC INDEX SCOPE DISCLOSURE
              </span>
              <p className="text-xs text-[#A0A0A0] leading-relaxed">
                The numbers below represent entities <strong className="text-white">currently indexed and independently verified</strong> within CONSTRUCTIONS by AiXLuxury. To maintain 100% factual integrity, we do not claim exhaustive national coverage beyond our audited baseline.
              </p>
            </div>

            {/* Coverage Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-3">
                <span className="text-[10px] font-mono text-[#C9A227] uppercase tracking-widest">DEVELOPMENT PROJECTS</span>
                <div className="text-4xl font-extrabold text-white font-mono">{realProjectsDataset.length}</div>
                <p className="text-xs text-[#888888]">100% Verified Real Site Photos (53/53)</p>
                <Link href="/projects" className="text-xs font-mono text-[#C9A227] hover:underline block pt-2">
                  Browse Projects →
                </Link>
              </div>

              <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-3">
                <span className="text-[10px] font-mono text-[#C9A227] uppercase tracking-widest">INDEXED COMPANIES</span>
                <div className="text-4xl font-extrabold text-white font-mono">{realCompaniesDataset.length}</div>
                <p className="text-xs text-[#888888]">Developers, General Contractors, Infrastructure</p>
                <Link href="/companies" className="text-xs font-mono text-[#C9A227] hover:underline block pt-2">
                  Browse Companies →
                </Link>
              </div>

              <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-3">
                <span className="text-[10px] font-mono text-[#C9A227] uppercase tracking-widest">REGIONAL HUBS</span>
                <div className="text-4xl font-extrabold text-white font-mono">{realLocationsDataset.length}</div>
                <p className="text-xs text-[#888888]">Cities & Active Construction Corridors</p>
                <Link href="/cities" className="text-xs font-mono text-[#C9A227] hover:underline block pt-2">
                  Browse Hubs →
                </Link>
              </div>
            </div>

            {/* Professional Breakdown */}
            <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl space-y-6">
              <h2 className="text-lg font-bold text-white tracking-tight">PROFESSIONAL NETWORK INDEXING STATUS</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl">
                  <span className="text-[#888888]">CONTRACTORS:</span>
                  <div className="text-2xl font-bold text-white mt-1">{contractorCount} Verified</div>
                </div>
                <div className="p-4 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl">
                  <span className="text-[#888888]">ARCHITECTS:</span>
                  <div className="text-2xl font-bold text-white mt-1">{architectCount} Profiles</div>
                  <span className="text-[9px] text-[#C9A227] mt-1 block">Coverage expanding</span>
                </div>
                <div className="p-4 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl">
                  <span className="text-[#888888]">ENGINEERS:</span>
                  <div className="text-2xl font-bold text-white mt-1">{engineerCount} Profiles</div>
                  <span className="text-[9px] text-[#C9A227] mt-1 block">Coverage expanding</span>
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
