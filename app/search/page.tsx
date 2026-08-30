import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { searchIntelligenceGlobal, getIndustryHubData } from '@/lib/data';
import { realCompaniesDataset, realProjectsDataset, realLocationsDataset } from '@/lib/real-romanian-data';
import { SearchDiscoveryTerminal } from '@/components/SearchDiscoveryTerminal';

export const metadata = {
  title: 'Market Discovery Terminal — Romanian Construction & Real Estate Intelligence',
  description: 'Search and filter 146 verified construction companies, 76 development projects, regional hubs, and market signals in Romania.'
};

export default async function Search({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const hubData = await getIndustryHubData();
  const { marketActivity } = hubData;

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block font-bold">
              Market Intelligence Terminal
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              GLOBAL MARKET DISCOVERY TERMINAL
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Diacritic-insensitive search & dynamic filtering across 146 market entities, 76 verified construction projects, 36 regional hubs, and live market signals.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <SearchDiscoveryTerminal
              initialQuery={q.trim()}
              companies={realCompaniesDataset}
              projects={realProjectsDataset}
              signals={marketActivity}
              locations={realLocationsDataset}
            />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
