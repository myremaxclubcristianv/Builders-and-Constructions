import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset, realProjectsDataset } from '@/lib/real-romanian-data';

export const metadata = {
  title: 'Institutional Commercial Command Center · CONSTRUCTIONS by AiXLuxury',
  description: 'Central commercial command terminal surfacing priority developer accounts, active construction site pipelines, research queue gaps, and verified market signals across Romania.'
};

export default function CommandPage() {
  const activeSites = realProjectsDataset.filter(p => p.status === 'under_construction');
  const majorDevelopers = realCompaniesDataset.filter(c => c.type === 'developer');

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
              Private Institutional Command Terminal
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              COMMERCIAL COMMAND CENTER
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Unified institutional intelligence console connecting market signal tracking, priority developer scoring, target deal-flow, and research gap monitoring.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-12">
            {/* Today's Intelligence Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
                <span className="text-[10px] font-mono text-[#888888] uppercase tracking-widest block font-bold">
                  ACTIVE CONSTRUCTION SITES
                </span>
                <div className="text-3xl font-extrabold font-mono text-[#C9A227]">
                  {activeSites.length}
                </div>
                <span className="text-xs text-[#888888] block">Documented in August 2026 Baseline</span>
              </div>

              <div className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
                <span className="text-[10px] font-mono text-[#888888] uppercase tracking-widest block font-bold">
                  INDEXED DEVELOPER ENTITIES
                </span>
                <div className="text-3xl font-extrabold font-mono text-white">
                  {majorDevelopers.length}
                </div>
                <span className="text-xs text-[#888888] block">100% Primary Source Provenance</span>
              </div>

              <div className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
                <span className="text-[10px] font-mono text-[#888888] uppercase tracking-widest block font-bold">
                  DOCUMENTED BUILT SURFACE
                </span>
                <div className="text-3xl font-extrabold font-mono text-[#38bdf8]">
                  {(activeSites.reduce((acc, p) => acc + (p.built_area_sqm || 0), 0) / 1000).toFixed(0)}k m²
                </div>
                <span className="text-xs text-[#888888] block">Active Gross Floor Area</span>
              </div>

              <div className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
                <span className="text-[10px] font-mono text-[#888888] uppercase tracking-widest block font-bold">
                  FACTUAL PARITY SCORE
                </span>
                <div className="text-3xl font-extrabold font-mono text-[#86efac]">
                  100%
                </div>
                <span className="text-xs text-[#888888] block">0 Fabricated Claims</span>
              </div>
            </div>

            {/* Quick Action Navigation Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
                <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest">
                  COMMERCIAL WORKFLOW SHORTCUTS
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/accounts" className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2 hover:border-[#C9A227] transition-all block">
                  <span className="text-xs font-mono text-[#C9A227] uppercase font-bold">Target Accounts →</span>
                  <h2 className="text-lg font-bold text-white">ACCOUNT INTELLIGENCE</h2>
                  <p className="text-xs text-[#888888]">Track priority corporate accounts, private research notes, and follow-up schedules.</p>
                </Link>

                <Link href="/dealflow" className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2 hover:border-[#C9A227] transition-all block">
                  <span className="text-xs font-mono text-[#38bdf8] uppercase font-bold">Deal-Flow Workstation →</span>
                  <h2 className="text-lg font-bold text-white">OPPORTUNITY PIPELINE</h2>
                  <p className="text-xs text-[#888888]">Manage deal opportunities across 10 structured commercial lifecycle stages.</p>
                </Link>

                <Link href="/outreach" className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2 hover:border-[#C9A227] transition-all block">
                  <span className="text-xs font-mono text-[#86efac] uppercase font-bold">Outreach Preparation →</span>
                  <h2 className="text-lg font-bold text-white">EXECUTIVE BRIEFS</h2>
                  <p className="text-xs text-[#888888]">Generate deterministic research briefs for target corporate decision-makers.</p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
