import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getPublishedProjects } from '@/lib/data';
import { CompanyIntelligencePreview } from '@/components/CompanyIntelligencePreview';
import { resolveVisualProvenanceBadge } from '@/lib/company-imagery';

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
    <div className="bg-white text-slate-900 min-h-screen selection:bg-amber-100 selection:text-amber-950">
      <SiteHeader />

      <main className="pt-24">
        {/* Page Hero */}
        <section className="py-12 md:py-16 border-b border-slate-200 bg-slate-50/70">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold block">
              Bază Națională de Date · Dosare Tehnice
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
              DOSARE PROIECTE ({filtered.length})
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl leading-relaxed">
              Urmăriți evoluția șantierelor verificate, suprafețele autorizate, fazele de execuție și echipele tehnice documentate din surse primare.
            </p>
          </div>
        </section>

        {/* Filter Controls Bar */}
        <section className="py-5 border-b border-slate-200 bg-white/95 sticky top-16 z-20 backdrop-blur-md shadow-xs">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <form method="GET" action="/projects" className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              <input
                name="q"
                defaultValue={q}
                className="flex-1 min-w-[200px] h-11 px-4 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                placeholder="Caută după nume proiect, oraș, dezvoltator..."
              />
              <select
                name="status"
                defaultValue={status}
                className="h-11 px-3 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-600"
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
                className="h-11 px-3 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-600"
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
                  className="flex-1 sm:flex-none h-11 px-6 bg-slate-950 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-800 active:scale-95 transition-all shadow-xs"
                >
                  Filtrează
                </button>
                {(status || type || q) && (
                  <Link
                    href="/projects"
                    className="h-11 px-4 flex items-center justify-center border border-slate-300 text-xs font-mono text-slate-600 hover:text-slate-900 hover:border-slate-400 rounded-lg"
                  >
                    Resetează
                  </Link>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Project Dossier Grid */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(p => {
                  const hasGenuineImage = Boolean(p.image && !p.image.includes('unsplash.com'));
                  const provenance = resolveVisualProvenanceBadge(p);

                  return (
                    <div
                      key={p.slug}
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
                            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-100 text-center border-b border-slate-200">
                              <svg className="w-10 h-10 text-slate-400 mb-2 stroke-[1.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 2" />
                                <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
                              </svg>
                              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold">
                                DOSAR TEHNIC VERIFICAT
                              </span>
                            </div>
                          )}

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
                            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md border border-slate-200 rounded-md text-[10px] font-mono text-slate-800 uppercase tracking-wider font-semibold shadow-xs">
                              {p.status}
                            </span>
                            <span className={`px-2 py-1 rounded-md text-[9px] font-mono uppercase tracking-wider font-bold shadow-xs ${provenance.badgeClass}`}>
                              {provenance.label}
                            </span>
                          </div>

                          {p.type && (
                            <div className="absolute bottom-3 left-3 z-10 px-2 py-0.5 bg-white/90 backdrop-blur-md rounded text-[9px] font-mono text-amber-800 uppercase tracking-wider font-bold shadow-xs">
                              {p.type}
                            </div>
                          )}
                        </div>

                        <div className="p-6 space-y-3">
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                            <Link href={`/projects/${p.slug}`}>
                              {p.name}
                            </Link>
                          </h3>

                          <p className="text-xs text-slate-500 font-medium">
                            {p.location}
                          </p>

                          <div className="text-xs text-slate-600 font-mono">
                            DEZVOLTATOR:{' '}
                            {p.developer_slug ? (
                              <CompanyIntelligencePreview
                                company={{
                                  name: p.developer || 'Dezvoltator',
                                  slug: p.developer_slug,
                                  type: p.developer_type
                                }}
                              >
                                <Link href={`/companies/${p.developer_slug}`} className="text-amber-800 font-bold hover:underline">
                                  {p.developer}
                                </Link>
                              </CompanyIntelligencePreview>
                            ) : (
                              <span className="text-slate-900 font-semibold">{p.developer || 'Nedivulgat oficial'}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                        <span>
                          {p.infrastructure_length_km
                            ? `LUNGIME: ${p.infrastructure_length_km} km`
                            : p.span_length_m
                            ? `DESCHIDERE: ${p.span_length_m.toLocaleString()} m`
                            : `SUPRAFAȚĂ: ${p.surface_area ? `${p.surface_area.toLocaleString()} m²` : 'Nedivulgat oficial'}`}
                        </span>
                        <Link href={`/projects/${p.slug}`} className="text-amber-800 font-bold hover:text-amber-950">
                          DESCHIDE DOSAR →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4">
                <p className="text-base text-slate-600">Niciun proiect verificat nu corespunde criteriilor de căutare selectate.</p>
                <Link
                  href="/projects"
                  className="inline-block px-6 py-3 bg-slate-950 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-800 transition-all shadow-xs"
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
