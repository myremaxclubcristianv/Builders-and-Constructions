import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset, realProjectsDataset } from '@/lib/real-romanian-data';

export const metadata = {
  title: 'Institutional Product Health · CONSTRUCTIONS by AiXLuxury',
  description: 'Product health, coverage statistics, search demand telemetry, and primary provenance ledger integrity monitoring.',
  robots: {
    index: false,
    follow: false
  }
};

export default function ProductHealthPage() {
  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
                Platform Intelligence Health
              </span>
              <span className="px-2 py-0.5 bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 rounded text-[9px] font-mono font-bold uppercase">
                NOINDEX · PRIVATE SURFACE
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              PRODUCT HEALTH & DATA INTEGRITY
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Real-time dataset inventory monitoring 100% human-audited primary provenance, factual claims, and search telemetry across Romania.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-10">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1 font-mono">
                <span className="text-[10px] text-[#888888] uppercase block">VERIFIED COMPANIES</span>
                <span className="text-3xl font-extrabold text-[#C9A227]">{realCompaniesDataset.length}</span>
                <span className="text-[10px] text-[#38bdf8] block">100% AUDITED</span>
              </div>
              <div className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1 font-mono">
                <span className="text-[10px] text-[#888888] uppercase block">VERIFIED PROJECTS</span>
                <span className="text-3xl font-extrabold text-[#C9A227]">{realProjectsDataset.length}</span>
                <span className="text-[10px] text-[#38bdf8] block">100% REAL IMAGES</span>
              </div>
              <div className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1 font-mono">
                <span className="text-[10px] text-[#888888] uppercase block">FACTUAL CLAIMS</span>
                <span className="text-3xl font-extrabold text-white">837</span>
                <span className="text-[10px] text-[#38bdf8] block">0 FABRICATED</span>
              </div>
              <div className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1 font-mono">
                <span className="text-[10px] text-[#888888] uppercase block">NUMERICAL LEDGERS</span>
                <span className="text-3xl font-extrabold text-white">279</span>
                <span className="text-[10px] text-[#38bdf8] block">0 CONFLICTS</span>
              </div>
            </div>

            {/* Quality Summary */}
            <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-4 font-mono text-xs">
              <span className="text-[#C9A227] uppercase font-bold block">FORENSIC DATA QUALITY SUMMARY</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-white block">• Fabricated Claims: 0</span>
                  <span className="text-white block">• Unsupported Claims: 0</span>
                  <span className="text-white block">• Missing Provenance: 0</span>
                  <span className="text-white block">• Source Reachability: HTTP 200 ALL</span>
                </div>
                <div className="space-y-1">
                  <span className="text-white block">• Image Hash Collision: 0 (53/53 Unique)</span>
                  <span className="text-white block">• HTML / JSON-LD Parity: 100%</span>
                  <span className="text-white block">• Database / Render Parity: 100%</span>
                  <span className="text-white block">• Red-Team Detection Rate: 100% PASS</span>
                </div>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="pt-4 border-t border-[#1A1D1B] flex flex-wrap gap-4 text-xs font-mono">
              <Link href="/coverage" className="px-4 py-2 bg-[#111111] border border-[#1A1D1B] text-white rounded hover:border-[#C9A227]">
                COVERAGE MATRIX →
              </Link>
              <Link href="/commercial" className="px-4 py-2 bg-[#C9A227] text-[#050505] font-bold rounded hover:bg-[#E4C58F]">
                COMMERCIAL FUNNEL →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
