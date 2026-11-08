import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getPublishedProjects } from '@/lib/data';
import { CompanyIntelligencePreview } from '@/components/CompanyIntelligencePreview';

export const metadata: Metadata = {
  title: 'Bază de Date Proiecte & Șantiere de Construcții din România · CONSTRUCTIONS by AiXLuxury',
  description: 'Explorează dosarele proiectelor de construcții verificate faptic din România: suprafețe desfășurate, stadii fizice, antreprenori generali și parametri urbanistici.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/projects'
  },
  openGraph: {
    title: 'Bază de Date Proiecte & Șantiere de Construcții din România · CONSTRUCTIONS by AiXLuxury',
    description: 'Explorează dosarele proiectelor de construcții verificate faptic din România: suprafețe desfășurate, stadii fizice, antreprenori generali și parametri urbanistici.',
    url: 'https://constructions.cristianvaduva.com/projects',
    siteName: 'CONSTRUCTIONS by AiXLuxury',
    locale: 'ro_RO',
    type: 'website'
  }
};

const PROJECT_STATUSES = [
  { value: '', label: 'Toate Stadiile' },
  { value: 'under_construction', label: 'În Construcție (Activ)' },
  { value: 'completed', label: 'Finalizat / Livrat' },
  { value: 'upcoming', label: 'Planificare / Autorizare' }
];

const PROJECT_TYPES = [
  { value: '', label: 'Toate Categoriile' },
  { value: 'residential', label: 'Rezidențial' },
  { value: 'office', label: 'Birouri & Spații Comerciale' },
  { value: 'mixed_use', label: 'Mix Comercial / Multifuncțional' },
  { value: 'retail', label: 'Retail & Galerii' },
  { value: 'hospitality', label: 'Hoteluri & Ospitalitate' },
  { value: 'industrial', label: 'Industrial & Producție' },
  { value: 'logistics', label: 'Logistică & Depozitare' },
  { value: 'infrastructure', label: 'Infrastructură Civilă' }
];

export default async function Projects({
  searchParams
}: {
  searchParams: Promise<{ status?: string; type?: string; q?: string }>;
}) {
  const { status = '', type = '', q = '' } = await searchParams;
  const allProjects = await getPublishedProjects();

  const filtered = allProjects.filter(p => {
    if (status && !p.status.toLowerCase().replace(/[\s-]/g, '_').includes(status.toLowerCase())) return false;
    if (type && !p.type?.toLowerCase().replace(/[\s-]/g, '_').includes(type.toLowerCase())) return false;
    if (q && !`${p.name} ${p.type} ${p.location} ${p.developer} ${p.description}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-24">
        {/* Page Hero */}
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
              Bază Națională de Date · Dosare Tehnice
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              DOSARE PROIECTE ({filtered.length})
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Urmăriți evoluția șantierelor verificate, suprafețele autorizate, fazele de execuție și echipele tehnice documentate din surse primare.
            </p>
          </div>
        </section>

        {/* Filter Controls Bar */}
        <section className="py-6 border-b border-[#1A1D1B] bg-[#050505] sticky top-16 z-20 backdrop-blur-md bg-[#050505]/90">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <form method="GET" action="/projects" className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              <input
                name="q"
                defaultValue={q}
                className="flex-1 min-w-[200px] h-11 px-4 bg-[#111111] border border-[#1A1D1B] rounded-lg text-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#C9A227]/50"
                placeholder="Caută după nume proiect, oraș, dezvoltator..."
              />
              <select
                name="status"
                defaultValue={status}
                className="h-11 px-3 bg-[#111111] border border-[#1A1D1B] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#C9A227]/50"
              >
                {PROJECT_STATUSES.map(st => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
              <select
                name="type"
                defaultValue={type}
                className="h-11 px-3 bg-[#111111] border border-[#1A1D1B] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#C9A227]/50"
              >
                {PROJECT_TYPES.map(pt => (
                  <option key={pt.value} value={pt.value}>
                    {pt.label}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 sm:flex-none h-11 px-5 bg-[#C9A227] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#E4C58F] active:scale-95 transition-all"
                >
                  Filtrează
                </button>
                {(status || type || q) && (
                  <Link
                    href="/projects"
                    className="h-11 px-4 flex items-center justify-center border border-[#1A1D1B] text-xs font-mono text-[#888888] hover:text-white rounded-lg"
                  >
                    Resetează
                  </Link>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Project Dossier Grid */}
        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(p => {
                  const hasGenuineImage = Boolean(p.image && !p.image.includes('unsplash.com'));

                  return (
                    <div
                      key={p.slug}
                      className="bg-[#111111] border border-[#1A1D1B] rounded-2xl overflow-hidden group hover:border-[#C9A227]/50 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-[16/10] overflow-hidden bg-[#0B0B0B]">
                          {hasGenuineImage && p.image ? (
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
                            <span className="px-2.5 py-1 bg-[#050505]/80 backdrop-blur-md border border-[#1A1D1B] rounded-md text-[10px] font-mono text-white uppercase tracking-wider">
                              {p.status}
                            </span>
                            {p.sources && p.sources.length > 0 ? (
                              <span className="px-2 py-1 bg-[#22c55e]/20 border border-[#22c55e]/40 rounded-md text-[9px] font-mono text-[#22c55e] uppercase tracking-wider font-semibold">
                                VERIFICAT FAPTIC
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-[#38bdf8]/20 border border-[#38bdf8]/40 rounded-md text-[9px] font-mono text-[#38bdf8] uppercase tracking-wider font-semibold">
                                RAPORTAT OFICIAL
                              </span>
                            )}
                          </div>
                          {p.type && (
                            <div className="absolute bottom-3 left-3 z-10 text-[10px] font-mono text-[#C9A227] uppercase tracking-wider font-semibold">
                              {p.type}
                            </div>
                          )}
                        </div>

                        <div className="p-5 space-y-3">
                          <h3 className="text-xl font-bold text-white group-hover:text-[#C9A227] transition-colors">
                            <Link href={`/projects/${p.slug}`}>
                              {p.name}
                            </Link>
                          </h3>

                          <p className="text-xs text-[#A0A0A0] font-medium">
                            {p.location}
                          </p>

                          <div className="text-xs text-[#888888] font-mono">
                            DEZVOLTATOR:{' '}
                            {p.developer_slug ? (
                              <CompanyIntelligencePreview
                                company={{
                                  name: p.developer || 'Dezvoltator',
                                  slug: p.developer_slug,
                                  type: p.developer_type
                                }}
                              >
                                <Link href={`/companies/${p.developer_slug}`} className="text-[#C9A227] font-semibold hover:underline">
                                  {p.developer}
                                </Link>
                              </CompanyIntelligencePreview>
                            ) : (
                              <span className="text-white font-semibold">{p.developer || 'Nedivulgat'}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-5 pt-3 border-t border-[#1A1D1B] flex items-center justify-between text-xs font-mono text-[#888888]">
                        <span>
                          {p.infrastructure_length_km
                            ? `LUNGIME: ${p.infrastructure_length_km} km`
                            : p.span_length_m
                            ? `DESCHIDERE: ${p.span_length_m.toLocaleString()} m`
                            : `SUPRAFAȚĂ: ${p.surface_area ? `${p.surface_area.toLocaleString()} m²` : 'Nedivulgat'}`}
                        </span>
                        <Link href={`/projects/${p.slug}`} className="text-[#C9A227] font-semibold hover:text-[#E4C58F]">
                          DESCHIDE DOSAR →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4">
                <p className="text-base text-[#A0A0A0]">Niciun proiect verificat nu corespunde criteriilor de căutare selectate.</p>
                <Link
                  href="/projects"
                  className="inline-block px-5 py-2.5 bg-[#C9A227] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider rounded-lg"
                >
                  Resetează Filtrele
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
