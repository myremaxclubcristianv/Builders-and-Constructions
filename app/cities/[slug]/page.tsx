import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realLocationsDataset, realProjectsDataset, realCompaniesDataset } from '@/lib/real-romanian-data';
import { resolveVisualProvenanceBadge } from '@/lib/company-imagery';
import { safeJsonLdStringify } from '@/lib/sanitize';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loc = realLocationsDataset.find(l => l.slug === slug);
  if (!loc) return { title: 'Oraș Negăsit | CONSTRUCTIONS by AiXLuxury' };
  return {
    title: `Intelligence Construcții ${loc.name} · CONSTRUCTIONS by AiXLuxury`,
    description: `Proiecte verificate în construcție, dezvoltatori activi, constructori și evoluția pieței de real estate din ${loc.name}, România.`
  };
}

export default async function CityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loc = realLocationsDataset.find(l => l.slug === slug);
  if (!loc) notFound();

  const cityProjects = realProjectsDataset.filter(p => p.location.toLowerCase().includes(loc.name.toLowerCase()) || p.location.toLowerCase().includes(loc.city.toLowerCase()));
  const activeProjects = cityProjects.filter(p => p.status === 'under_construction');
  const completedProjects = cityProjects.filter(p => p.status === 'completed');
  const upcomingProjects = cityProjects.filter(p => p.status === 'upcoming');
  const partiallyDeliveredProjects = cityProjects.filter(p => p.status === 'partially_delivered');

  const developerSlugs = Array.from(new Set(cityProjects.map(p => p.developer_slug)));
  const cityDevelopers = realCompaniesDataset.filter(c => developerSlugs.includes(c.slug));

  const cityJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AdministrativeArea',
        '@id': `https://constructions.cristianvaduva.com/cities/${loc.slug}#area`,
        name: loc.name,
        description: `Date verificate de piață pentru ${loc.name}, județul ${loc.county}, România.`,
        url: `https://constructions.cristianvaduva.com/cities/${loc.slug}`,
        containedInPlace: {
          '@type': 'Country',
          name: 'România'
        }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://constructions.cristianvaduva.com/cities/${loc.slug}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Acasă',
            item: 'https://constructions.cristianvaduva.com'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Orașe',
            item: 'https://constructions.cristianvaduva.com/cities'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: loc.name,
            item: `https://constructions.cristianvaduva.com/cities/${loc.slug}`
          }
        ]
      }
    ]
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-amber-100 selection:text-amber-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(cityJsonLd) }}
      />
      <SiteHeader />

      <main className="pt-24">
        {/* City Hero */}
        <section className="py-12 md:py-16 border-b border-slate-200 bg-slate-50/70">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-[11px] font-mono uppercase tracking-wider font-semibold">
              JUDEȚUL {loc.county.toUpperCase()} · POL DE DEZVOLTARE
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
              {loc.name.toUpperCase()}
            </h1>
            <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
              Ecosistemul documentat al construcțiilor din {loc.name}. Urmărește proiectele reale în execuție, dezvoltatorii activi, antreprenorii generali și sursele primare de verificare.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block">TOTAL PROIECTE</span>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{cityProjects.length}</div>
              </div>
              <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block">ȘANTIERE ACTIVE</span>
                <div className="text-2xl font-bold font-mono text-amber-800 mt-1">{activeProjects.length}</div>
              </div>
              <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block">FINALIZATE / LIVRATE</span>
                <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">{completedProjects.length}</div>
              </div>
              <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block">DEZVOLTATORI ACTIVI</span>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{cityDevelopers.length}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Pipeline */}
        <section className="py-12 md:py-16 bg-white border-b border-slate-200">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold block mb-1">
                  Șantiere în Execuție
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight">
                  PROIECTE ACTIVE ÎN {loc.name.toUpperCase()}
                </h2>
              </div>
              <Link className="text-xs font-mono font-semibold text-amber-800 hover:text-amber-950" href="/pipeline">
                Vezi tot pipeline-ul național →
              </Link>
            </div>

            {activeProjects.length === 0 ? (
              <div className="p-8 bg-slate-50 border border-slate-200 rounded-xl text-center text-sm text-slate-600">
                Nu există șantiere active înregistrate în prezent pentru {loc.name}. Consultați proiectele planificate sau finalizate.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeProjects.map(p => {
                  const provenance = resolveVisualProvenanceBadge(p);
                  const hasImage = Boolean(p.image && !p.image.includes('unsplash.com'));

                  return (
                    <Link
                      href={`/projects/${p.slug}`}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-amber-500 hover:shadow-lg transition-all flex flex-col justify-between group"
                      key={p.slug}
                    >
                      <div>
                        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                          {hasImage && p.image ? (
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
                              {p.status_display || 'În execuție'}
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
                          <p className="text-xs text-slate-500 font-mono">
                            {p.developer_name || 'Dezvoltator Divulgat'}
                          </p>
                        </div>
                      </div>

                      <div className="p-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                        <span>{p.project_type || 'Dezvoltare'}</span>
                        <span className="text-amber-800 font-bold">DESCHIDE DOSAR →</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Active Developers in City */}
        <section className="py-12 md:py-16 bg-slate-50/60 border-b border-slate-200">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold block mb-1">
                  Prezență Dezvoltatori
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight">
                  DEZVOLTATORI ACTIVI ÎN {loc.name.toUpperCase()}
                </h2>
              </div>
              <Link className="text-xs font-mono font-semibold text-amber-800 hover:text-amber-950" href="/companies">
                Explorează toți dezvoltatorii →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityDevelopers.map(dev => (
                <Link
                  href={`/companies/${dev.slug}`}
                  key={dev.slug}
                  className="p-6 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between hover:border-amber-500 hover:shadow-lg transition-all"
                >
                  <div>
                    <span className="text-[10px] font-mono text-amber-800 uppercase font-bold block">
                      DEZVOLTATOR VERIFICAT
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">
                      {dev.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {dev.description}
                    </p>
                  </div>
                  <div className="text-xs font-mono text-slate-500 border-t border-slate-100 pt-3 flex justify-between items-center">
                    <span>Fondat: <strong className="text-slate-900">{dev.founded_year || 'Nedivulgat'}</strong></span>
                    <span className="text-amber-800 font-bold">DOSAR EXECUTIV →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Completed Projects in City */}
        {completedProjects.length > 0 && (
          <section className="py-12 md:py-16 bg-white">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8">
              <div className="mb-8">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  Portofoliu Istoric
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight">
                  PROIECTE FINALIZATE ÎN {loc.name.toUpperCase()}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedProjects.map(p => (
                  <Link
                    href={`/projects/${p.slug}`}
                    className="p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:border-amber-500 hover:shadow-xs transition-all"
                    key={p.slug}
                  >
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-mono uppercase font-bold">
                      FINALIZAT / LIVRAT
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2 mb-1">{p.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">{p.developer_name}</p>
                    <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between text-xs font-mono text-slate-500">
                      <span>{p.project_type}</span>
                      <span className="text-amber-800 font-bold">DETALII →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
