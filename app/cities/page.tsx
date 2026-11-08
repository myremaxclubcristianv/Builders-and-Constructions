import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realLocationsDataset, realProjectsDataset, realCompaniesDataset } from '@/lib/real-romanian-data';

export const metadata = {
  title: 'Poli Regionali & Orașe de Construcții din România · CONSTRUCTIONS by AiXLuxury',
  description: 'Explorează șantierele de construcții verificate, dezvoltatorii activi și proiectele în execuție din București, Cluj, Timișoara, Iași, Brașov și principalele orașe din România.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/cities'
  }
};

export default function CitiesPage() {
  // Aggregate stats per county/city
  const citiesMap = new Map<string, { name: string; slug: string; county: string; projectsCount: number; companiesCount: number; activeProjects: number }>();

  realLocationsDataset.forEach(loc => {
    const cityName = loc.county === 'Bucharest' || loc.county === 'Ilfov' ? loc.name : loc.name;
    const key = loc.slug;
    
    const cityProjects = realProjectsDataset.filter(p => p.location.toLowerCase().includes(loc.name.toLowerCase()) || p.location.toLowerCase().includes(loc.city.toLowerCase()));
    const cityDevs = new Set(cityProjects.map(p => p.developer_slug));

    citiesMap.set(key, {
      name: cityName,
      slug: loc.slug,
      county: loc.county,
      projectsCount: cityProjects.length,
      companiesCount: cityDevs.size,
      activeProjects: cityProjects.filter(p => p.status === 'under_construction').length
    });
  });

  const cityList = Array.from(citiesMap.values()).sort((a, b) => b.projectsCount - a.projectsCount);

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-amber-100 selection:text-amber-950">
      <SiteHeader />

      <main className="pt-24">
        {/* Page Hero */}
        <section className="py-12 md:py-16 border-b border-slate-200 bg-slate-50/70">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold block">
              Inteligență Urbană &amp; Regională
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
              CONSTRUCȚII PE ORAȘE ȘI POLI REGIONALI
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-3xl leading-relaxed">
              Acoperire documentară a activității imobiliare, șantierelor în execuție și dezvoltatorilor activi din București, Ilfov, Cluj-Napoca, Timișoara, Iași, Brașov, Constanța, Sibiu, Oradea și principalele hub-uri de creștere din România.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold block mb-1">
                  Hartă de Acoperire
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight">
                  PIEȚE PRIMARE DE DEZVOLTARE
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500 font-medium">
                {cityList.length} Orașe &amp; Subpiețe Verificate
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {cityList.map(city => (
                <Link
                  href={`/cities/${city.slug}`}
                  key={city.slug}
                  className="p-6 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between hover:border-amber-500 hover:shadow-lg transition-all group"
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                      JUDEȚUL {city.county.toUpperCase()}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-800 transition-colors mt-1 mb-4">
                      {city.name}
                    </h3>
                  </div>

                  <div className="border-t border-slate-100 pt-3.5 mt-2 flex items-center justify-between text-xs font-mono text-slate-500">
                    <div>
                      <span>Proiecte: </span>
                      <strong className="text-slate-900 font-bold">{city.projectsCount}</strong>
                    </div>
                    <div>
                      <span>Active: </span>
                      <strong className="text-emerald-700 font-bold">{city.activeProjects}</strong>
                    </div>
                    <div>
                      <span>Dezvoltatori: </span>
                      <strong className="text-slate-900 font-bold">{city.companiesCount}</strong>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
