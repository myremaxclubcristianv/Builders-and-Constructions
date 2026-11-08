import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset, realProjectsDataset } from '@/lib/real-romanian-data';
import { resolveVisualProvenanceBadge } from '@/lib/company-imagery';

export const metadata: Metadata = {
  title: 'Clasamente Dezvoltatori și Proiecte · Eșantion Verificat | CONSTRUCTIONS by AiXLuxury',
  description: 'Clasamente documentate pe baza eșantionului verificat de dezvoltatori imobiliari și mari proiecte de construcții din România. Transparență metodologică și surse oficiale.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/rankings'
  },
  openGraph: {
    title: 'Clasamente Dezvoltatori și Proiecte · Eșantion Verificat | CONSTRUCTIONS by AiXLuxury',
    description: 'Clasamente documentate pe baza eșantionului verificat de dezvoltatori imobiliari și mari proiecte de construcții din România. Transparență metodologică și surse oficiale.',
    url: 'https://constructions.cristianvaduva.com/rankings',
    siteName: 'CONSTRUCTIONS by AiXLuxury',
    locale: 'ro_RO',
    type: 'website'
  }
};

export default function RankingsPage() {
  const developers = realCompaniesDataset.filter(c => c.type === 'developer');

  const sortedByActive = [...developers].sort((a, b) => {
    const aActive = realProjectsDataset.filter(p => p.developer_slug === a.slug && p.status === 'under_construction').length;
    const bActive = realProjectsDataset.filter(p => p.developer_slug === b.slug && p.status === 'under_construction').length;
    return bActive - aActive;
  });

  const premiumProjects = realProjectsDataset.filter(p => p.is_featured);

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-amber-100 selection:text-amber-950">
      <SiteHeader />

      <main className="pt-24">
        {/* Page Hero */}
        <section className="py-12 md:py-16 border-b border-slate-200 bg-slate-50/70">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold block">
              METODOLOGIE TRANSPARENTĂ · EȘANTION INDEXAT
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
              CLASAMENTE DEZVOLTATORI &amp; PROIECTE ÎN EȘANTIONUL VERIFICAT
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-3xl leading-relaxed">
              Ierarhii factuale calculate direct din documentații de urbanism, autorizații de construire și raportări statutare depuse la registrele publice și la Bursa de Valori.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs text-slate-500">
              <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded text-amber-800 font-semibold">
                Eșantion: n={developers.length} dezvoltatori · n={realProjectsDataset.length} proiecte
              </span>
              <span>Data de referință a indexului: Noiembrie 2026</span>
            </div>
          </div>
        </section>

        {/* Methodology Note */}
        <section className="py-6 border-b border-slate-200 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="p-6 bg-slate-50 border border-amber-200 rounded-2xl space-y-2">
              <div className="text-[10px] font-mono text-amber-800 uppercase tracking-widest font-bold">
                DECLARAȚIE METODOLOGICĂ ASUPRA LIMITELOR EȘANTIONULUI
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clasamentele prezentate reflectă exclusiv numărul de șantiere active și proiecte verificate <strong>în cadrul eșantionului propriu indexat</strong> (n={realProjectsDataset.length} proiecte, n={realCompaniesDataset.length} companii) și nu pretind a constitui un recensământ exhaustiv al întregii piețe de construcții din România. Pozițiile sunt ordonate matematic după numărul de șantiere active în execuție. Pentru detalii complete, consultați{' '}
                <Link href="/methodology" className="text-amber-800 underline font-semibold hover:text-amber-950 transition-colors">
                  Cadrul Metodologic Oficial →
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Top Active Developers */}
        <section className="py-12 md:py-16 border-b border-slate-200 bg-slate-50/40">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold block mb-1">
                  Indicator de Activitate în Șantier
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight">
                  CEI MAI ACTIVI DEZVOLTATORI ÎN EȘANTIONUL VERIFICAT
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500 font-medium">
                Clasificare după șantiere active documentate
              </span>
            </div>

            <div className="space-y-3">
              {sortedByActive.slice(0, 10).map((dev, idx) => {
                const activeCount = realProjectsDataset.filter(p => p.developer_slug === dev.slug && p.status === 'under_construction').length;
                const totalCount = realProjectsDataset.filter(p => p.developer_slug === dev.slug).length;

                return (
                  <div
                    key={dev.slug}
                    className="p-5 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500 hover:shadow-xs transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-xl md:text-2xl font-mono font-extrabold w-10 ${idx < 3 ? 'text-amber-800' : 'text-slate-400'}`}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="text-base md:text-lg font-bold text-slate-900">
                          <Link href={`/companies/${dev.slug}`} className="hover:text-amber-800 transition-colors">
                            {dev.name}
                          </Link>
                        </h3>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          Sediul: {dev.location} · Piețe: {dev.markets.slice(0, 3).join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <span className="text-[9px] font-mono text-slate-500 uppercase font-semibold block">ȘANTIERE ACTIVE</span>
                        <span className="text-base font-bold text-amber-800 font-mono">{activeCount} Obiective</span>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[9px] font-mono text-slate-500 uppercase font-semibold block">PORTOFOLIU INDEXAT</span>
                        <span className="text-base font-bold text-slate-900 font-mono">{totalCount} Proiecte</span>
                      </div>

                      <Link
                        href={`/companies/${dev.slug}`}
                        className="px-4 py-2 bg-slate-950 text-white hover:bg-slate-800 font-mono text-xs uppercase tracking-wider rounded-lg transition-all shadow-xs"
                      >
                        Dosar →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Projects Ranking */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="mb-8">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold block mb-1">
                Obiective de Relevanță Majoră
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight">
                PROIECTE DE REFERINȚĂ ÎN EȘANTIONUL VERIFICAT
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {premiumProjects.slice(0, 6).map(p => {
                const provenance = resolveVisualProvenanceBadge(p);
                const hasGenuineImage = Boolean(p.image && !p.image.includes('unsplash.com'));

                return (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden group hover:border-amber-500 hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        {hasGenuineImage && p.image ? (
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-100 text-center">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold">
                              DOSAR TEHNIC VERIFICAT
                            </span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
                          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md border border-slate-200 rounded-md text-[10px] font-mono text-slate-800 uppercase tracking-wider font-semibold shadow-xs">
                            {p.status_display || p.status}
                          </span>
                          <span className={`px-2 py-1 rounded-md text-[9px] font-mono uppercase tracking-wider font-bold shadow-xs ${provenance.badgeClass}`}>
                            {provenance.label}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 space-y-2">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                          {p.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {p.location} · {p.developer_name}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                      <span>{p.project_type}</span>
                      {p.unit_count && <span className="text-amber-800 font-semibold">{p.unit_count} Unități</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
