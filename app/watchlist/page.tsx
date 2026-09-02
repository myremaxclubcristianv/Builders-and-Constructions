import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getIndustryHubData } from '@/lib/data';
import { resolveEntityRoute } from '@/lib/entity-resolver';
import { WatchlistViewer } from '@/components/WatchlistViewer';

export const metadata = {
  title: 'Market Watchlist & Monitoring · CONSTRUCTIONS by AiXLuxury',
  description: 'Institutional monitoring terminal tracking newly verified information, construction status transitions, and data freshness across Romania.'
};

export default async function WatchlistPage() {
  const hubData = await getIndustryHubData();
  const { marketActivity } = hubData;

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block font-bold">
              Institutional Monitoring Terminal
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              MARKET WATCHLIST & MONITORING
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Track newly verified project status transitions, financial disclosures, and data freshness. Entries are explicitly labeled by last research verification timestamp.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-12">
            
            {/* Dynamic Client-Side Local Storage Watchlist */}
            <WatchlistViewer />

            <div className="space-y-4 pt-6 border-t border-[#1A1D1B]">
              <h2 className="text-xs font-mono text-[#C9A227] uppercase tracking-widest">
                VERIFIED MONITORING STREAM ({marketActivity.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {marketActivity.map(act => {
                  const resolvedProj = act.project_slug ? resolveEntityRoute('project', act.project_slug, act.project_name) : null;
                  const resolvedComp = act.company_slug ? resolveEntityRoute('company', act.company_slug, act.company_name) : null;

                  return (
                    <div key={act.id} className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-3 font-mono">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="px-2 py-0.5 bg-[#C9A227]/10 text-[#C9A227] rounded uppercase font-bold">
                          {act.signal_type.replaceAll('_', ' ')}
                        </span>
                        <span className="text-[#888888]">{act.event_date}</span>
                      </div>

                      <h3 className="text-base font-bold text-white">
                        {act.title}
                      </h3>
                      <p className="text-xs text-[#A0A0A0] leading-relaxed font-sans">
                        {act.summary}
                      </p>

                      <div className="pt-2 border-t border-[#1A1D1B] flex items-center justify-between text-xs text-[#888888]">
                        <span>📍 {act.location}</span>
                        {resolvedProj && resolvedProj.isResolvable ? (
                          <Link href={resolvedProj.href} className="text-[#C9A227] font-bold hover:underline">
                            VIEW PROJECT →
                          </Link>
                        ) : resolvedComp && resolvedComp.isResolvable ? (
                          <Link href={resolvedComp.href} className="text-[#C9A227] font-bold hover:underline">
                            VIEW COMPANY →
                          </Link>
                        ) : null}
                      </div>
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
