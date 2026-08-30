import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getIndustryHubData } from '@/lib/data';
import { SignalsFeed } from '@/components/SignalsFeed';

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
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <SignalsFeed signals={marketActivity} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
