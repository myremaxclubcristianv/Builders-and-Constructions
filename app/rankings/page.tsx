import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset, realProjectsDataset } from '@/lib/real-romanian-data';

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
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-24">
        {/* Page Hero */}
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
              METODOLOGIE TRANSPARENTĂ · EȘANTION INDEXAT
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              CLASAMENTE DEZVOLTATORI & PROIECTE ÎN EȘANTIONUL VERIFICAT
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-3xl leading-relaxed">
              Ierarhii factuale calculate direct din documentații de urbanism, autorizații de construire și raportări statutare depuse la registrele publice și la Bursa de Valori.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs text-[#888]">
              <span className="px-2.5 py-1 bg-[#141715] border border-[#262A27] rounded text-[#C9A227]">
                Eșantion: n={developers.length} dezvoltatori · n={realProjectsDataset.length} proiecte
              </span>
              <span>Data de referință a indexului: August 2026</span>
            </div>
          </div>
        </section>

        {/* Methodology Note */}
        <section className="py-6 border-b border-[#1A1D1B] bg-[#050505]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="p-4 md:p-6 bg-[#111111] border border-[#C9A227]/40 rounded-xl space-y-2">
              <div className="text-[10px] font-mono text-[#C9A227] uppercase tracking-widest font-bold">
                DECLARAȚIE METODOLOGICĂ ASUPRA LIMITELOR EȘANTIONULUI
              </div>
              <p className="text-xs text-[#A0A0A0] leading-relaxed">
                Clasamentele prezentate reflectă exclusiv numărul de șantiere active și proiecte verificate <strong>în cadrul eșantionului propriu indexat</strong> (n={realProjectsDataset.length} proiecte, n={realCompaniesDataset.length} companii) și nu pretind a constitui un recensământ exhaustiv al întregii piețe de construcții din România. Pozițiile sunt ordonate matematic după numărul de șantiere active în execuție. Pentru detalii complete, consultați{' '}
                <Link href="/methodology" className="text-[#C9A227] underline hover:text-white transition-colors">
                  Cadrul Metodologic Oficial →
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Top Active Developers */}
        <section className="py-10 md:py-16 border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-1">
                  Indicator de Activitate în Șantier
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  CEI MAI ACTIVI DEZVOLTATORI ÎN EȘANTIONUL VERIFICAT
                </h2>
              </div>
              <span className="text-xs font-mono text-[#888888]">
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
                    className="p-4 md:p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#C9A227]/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-xl md:text-2xl font-mono font-extrabold w-10 ${idx < 3 ? 'text-[#C9A227]' : 'text-[#666666]'}`}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="text-base md:text-lg font-bold text-white">
                          <Link href={`/companies/${dev.slug}`} className="hover:text-[#C9A227] transition-colors">
                            {dev.name}
                          </Link>
                        </h3>
                        <p className="text-xs text-[#888888] font-mono mt-0.5">
                          Sediul: {dev.location} · Piețe: {dev.markets.slice(0, 3).join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-[#1A1D1B]">
                      <div className="text-left sm:text-right">
                        <span className="text-[9px] font-mono text-[#666666] uppercase block">ȘANTIERE ACTIVE</span>
                        <span className="text-base font-bold text-[#C9A227] font-mono">{activeCount} Obiective</span>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[9px] font-mono text-[#666666] uppercase block">PORTOFOLIU INDEXAT</span>
                        <span className="text-base font-bold text-white font-mono">{totalCount} Proiecte</span>
                      </div>

                      <Link
                        href={`/companies/${dev.slug}`}
                        className="px-3.5 py-1.5 bg-[#050505] border border-[#1A1D1B] text-[#C9A227] hover:bg-[#C9A227] hover:text-[#050505] font-mono text-xs uppercase tracking-wider rounded-lg transition-all"
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
        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="mb-8">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-1">
                Obiective de Relevanță Majoră
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                PROIECTE DE REFERINȚĂ ÎN EȘANTIONUL VERIFICAT
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {premiumProjects.slice(0, 6).map(p => {
                const hasGenuineImage = p.image && !p.image.includes('unsplash.com') && p.image_verified;

                return (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className="bg-[#111111] border border-[#1A1D1B] rounded-2xl overflow-hidden group hover:border-[#C9A227]/50 transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#0B0B0B]">
                      {hasGenuineImage ? (
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#121413] to-[#0A0B0A] text-center border-b border-[#1A1D1B]">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A227] font-semibold">
                            DOSAR TEHNIC VERIFICAT
                          </span>
                          <span className="text-[9px] font-mono text-[#666] mt-1">
                            Imagine indisponibilă în surse oficiale
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-85" />
                      <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                        <span className="px-2.5 py-1 bg-[#C9A227] text-[#050505] font-mono font-bold text-[10px] uppercase tracking-wider rounded-md">
                          {p.status_display}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#C9A227] transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-xs text-[#A0A0A0]">
                        {p.location} · {p.developer_name}
                      </p>
                      <div className="pt-3 border-t border-[#1A1D1B] flex items-center justify-between text-[11px] font-mono text-[#888888]">
                        <span>{p.project_type}</span>
                        {p.unit_count && <span className="text-[#C9A227]">{p.unit_count} Unități</span>}
                      </div>
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
