import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getIndustryHubData } from '@/lib/data';
import { realCompaniesDataset, realProjectsDataset, realLocationsDataset } from '@/lib/real-romanian-data';
import { OFFICIAL_SERVICES } from '@/lib/services-config';
import { SearchDiscoveryTerminal } from '@/components/SearchDiscoveryTerminal';

export const metadata = {
  title: 'Terminal de Căutare & Descoperire · CONSTRUCTIONS by AiXLuxury',
  description: 'Căutare și filtrare în baza de date cu 143 companii verificate, 76 proiecte mari de dezvoltare, 13 servicii oficiale de consultanță, hub-uri regionale și semnale de piață din România.'
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
    <div className="bg-white text-slate-900 min-h-screen flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-12 md:py-16 border-b border-slate-200 bg-linear-to-b from-slate-50 to-white">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-xs font-mono font-semibold text-amber-800 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
              Terminal de Intelligence Imobiliar
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 uppercase tracking-tight">
              TERMINAL DE CĂUTARE &amp; DESCOPERIRE
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl leading-relaxed">
              Căutare insensibilă la diacritice și filtrare dinamică în rândul dezvoltatorilor verificați, constructorilor generali, proiectelor în curs, serviciilor oficiale, polilor regionali și semnalelor de piață.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <SearchDiscoveryTerminal
              initialQuery={q.trim()}
              companies={realCompaniesDataset}
              projects={realProjectsDataset}
              services={OFFICIAL_SERVICES}
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
