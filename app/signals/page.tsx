import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getIndustryHubData } from '@/lib/data';

export const metadata = {
  title: 'Market Signals & Activity Stream · CONSTRUCTIONS by AiXLuxury',
  description: 'Chronological timeline of verified construction milestones, official disclosures, pre-leasing announcements, and financial filings in Romania.'
};

export default async function SignalsPage() {
  const hubData = await getIndustryHubData();
  const { marketActivity } = hubData;

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
              Evidence-Backed Signal Stream
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              VERIFIED MARKET SIGNALS
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Real-time audit stream documenting structural milestones, official regulatory filings, pre-leasing thresholds, and corporate financial disclosures across Romania.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-4">
              <span className="text-xs font-mono text-[#888888] uppercase">
                Showing {marketActivity.length} Verified Activity Events
              </span>
              <span className="text-xs font-mono text-[#C9A227]">
                100% Tier 1/2 Provenance Verified
              </span>
            </div>

            <div className="space-y-4">
              {marketActivity.map(act => (
                <div
                  key={act.id}
                  className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#C9A227]/40 transition-all"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] rounded text-[10px] font-mono uppercase">
                        {act.signal_type.replaceAll('_', ' ')}
                      </span>
                      <span className="text-xs font-mono text-[#888888]">{act.event_date}</span>
                    </div>

                    <h2 className="text-lg font-bold text-white">
                      {act.title}
                    </h2>

                    <p className="text-xs text-[#A0A0A0] leading-relaxed">
                      {act.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-[#888888]">
                      {act.company_slug && (
                        <Link href={`/companies/${act.company_slug}`} className="text-[#C9A227] hover:underline">
                          🏢 {act.company_name}
                        </Link>
                      )}
                      {act.project_slug && (
                        <Link href={`/projects/${act.project_slug}`} className="text-[#38bdf8] hover:underline">
                          🏗️ {act.project_name}
                        </Link>
                      )}
                      <span>📍 {act.location}</span>
                    </div>
                  </div>

                  {act.source_url && (
                    <a
                      href={act.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-[#050505] border border-[#1A1D1B] text-xs font-mono text-[#C9A227] rounded-lg hover:border-[#C9A227]/50 shrink-0 self-start md:self-center"
                    >
                      VERIFY CITATION ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
