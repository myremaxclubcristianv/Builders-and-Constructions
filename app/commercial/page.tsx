import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Commercial Intelligence Funnel · CONSTRUCTIONS by AiXLuxury',
  description: 'Institutional commercial funnel monitoring conversion events across discovery, research, decisions, actions, and research requests with zero PII collection.',
  robots: {
    index: false,
    follow: false
  }
};

export default function CommercialDashboardPage() {
  const funnelSteps = [
    { step: '01', name: 'SEARCH & DISCOVERY', status: 'ACTIVE', count: 'OBSERVED', ratio: 'NOT YET MEASURED' },
    { step: '02', name: 'ENTITY & SIGNAL DOSSIERS', status: 'ACTIVE', count: 'OBSERVED', ratio: 'NOT YET MEASURED' },
    { step: '03', name: 'RESEARCH & DECISION CREATION', status: 'ACTIVE', count: 'OBSERVED', ratio: 'NOT YET MEASURED' },
    { step: '04', name: 'ACTION QUEUE & ACCOUNT 360', status: 'ACTIVE', count: 'OBSERVED', ratio: 'NOT YET MEASURED' },
    { step: '05', name: 'DEAL FLOW & OUTREACH BRIEF', status: 'ACTIVE', count: 'OBSERVED', ratio: 'NOT YET MEASURED' },
    { step: '06', name: 'CUSTOM RESEARCH REQUEST', status: 'ACTIVE', count: 'OBSERVED', ratio: 'NOT YET MEASURED' }
  ];

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
                Internal Commercial Instrumentation
              </span>
              <span className="px-2 py-0.5 bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 rounded text-[9px] font-mono font-bold uppercase">
                NOINDEX · PRIVATE SURFACE
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              COMMERCIAL FUNNEL DASHBOARD
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Privacy-safe commercial funnel monitoring real institutional research demand, decision creation, private action conversions, and custom research requests without storing PII.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-10">
            {/* Principles Note */}
            <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl text-xs font-mono space-y-2">
              <span className="text-[#C9A227] uppercase font-bold block">COMMERCIAL INTEGRITY DIRECTIVE</span>
              <p className="text-[#A0A0A0] leading-relaxed">
                Ratios are marked <strong className="text-white">NOT YET MEASURED</strong> until live production traffic volume accumulates. Zero synthetic data, zero fake conversion benchmarks, zero pay-to-play factual ranking.
              </p>
            </div>

            {/* Funnel Steps */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3 text-xs font-mono">
                <span className="text-[#C9A227] uppercase font-bold">INSTITUTIONAL CONVERSION STEPS</span>
                <span className="text-[#888888]">6-STAGE PIPELINE</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {funnelSteps.map(f => (
                  <div key={f.step} className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[#C9A227] font-bold">STAGE {f.step}</span>
                      <span className="px-2 py-0.5 bg-[#C9A227]/10 text-[#C9A227] text-[10px] font-mono font-bold rounded">
                        {f.status}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-white">{f.name}</h2>

                    <div className="pt-2 border-t border-[#1A1D1B] space-y-1 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-[#888888]">VOLUME:</span>
                        <span className="text-white font-bold">{f.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#888888]">CONVERSION:</span>
                        <span className="text-[#38bdf8] font-bold">{f.ratio}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Quick Links */}
            <div className="pt-6 border-t border-[#1A1D1B] flex flex-wrap items-center gap-4 text-xs font-mono">
              <Link href="/research-request" className="px-4 py-2 bg-[#C9A227] text-[#050505] font-bold rounded hover:bg-[#E4C58F]">
                INTAKE QUEUE →
              </Link>
              <Link href="/product-health" className="px-4 py-2 bg-[#111111] border border-[#1A1D1B] text-white rounded hover:border-[#C9A227]">
                PRODUCT HEALTH →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
