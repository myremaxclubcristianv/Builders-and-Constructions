import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getPublishedCompanies } from '@/lib/data';
import { CompanyIntelligencePreview } from '@/components/CompanyIntelligencePreview';

export const metadata: Metadata = {
  title: 'Catalog Companii & Dosare Corporative Construcții · CONSTRUCTIONS by AiXLuxury',
  description: 'Descoperă companiile de construcții, dezvoltatorii imobiliari, antreprenorii generali și birourile de proiectare verificate din România cu date ONRC/ANAF.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/companies'
  },
  openGraph: {
    title: 'Catalog Companii & Dosare Corporative Construcții · CONSTRUCTIONS by AiXLuxury',
    description: 'Descoperă companiile de construcții, dezvoltatorii imobiliari, antreprenorii generali și birourile de proiectare verificate din România cu date ONRC/ANAF.',
    url: 'https://constructions.cristianvaduva.com/companies',
    siteName: 'CONSTRUCTIONS by AiXLuxury',
    locale: 'ro_RO',
    type: 'website'
  }
};

const COMPANY_TYPES = [
  { value: '', label: 'Toate Tipurile' },
  { value: 'developer', label: 'Dezvoltator Imobiliar' },
  { value: 'construction_company', label: 'Companie de Construcții' },
  { value: 'general_contractor', label: 'Antreprenor General' },
  { value: 'engineering', label: 'Inginerie & Proiectare' },
  { value: 'architecture', label: 'Arhitectură & Urbanism' },
  { value: 'project_management', label: 'Management de Proiect' },
  { value: 'specialized_contractor', label: 'Subantreprenor Specializat' },
  { value: 'infrastructure', label: 'Infrastructură' }
];

const LOCATIONS = [
  { value: '', label: 'Toate Județele / Orașele' },
  { value: 'Bucharest', label: 'București' },
  { value: 'Ilfov', label: 'Ilfov' },
  { value: 'Cluj', label: 'Cluj' },
  { value: 'Timiș', label: 'Timiș' },
  { value: 'Iași', label: 'Iași' },
  { value: 'Brașov', label: 'Brașov' },
  { value: 'Constanța', label: 'Constanța' }
];

const FRESHNESS_OPTIONS = [
  { value: '', label: 'Toate Nivelurile de Actualizare' },
  { value: 'FRESH', label: 'Recent (< 14 zile)' },
  { value: 'RECENT', label: 'Înregistrat (< 45 zile)' },
  { value: 'AGING', label: 'Arhivă (< 90 zile)' },
  { value: 'STALE', label: 'Arhivă Istorică (>= 90 zile)' }
];

export default async function Companies({
  searchParams
}: {
  searchParams: Promise<{ type?: string; location?: string; freshness?: string; q?: string }>;
}) {
  const { type = '', location = '', freshness = '', q = '' } = await searchParams;
  const allCompanies = await getPublishedCompanies();

  const filtered = allCompanies.filter(c => {
    if (type && !c.type.toLowerCase().includes(type.toLowerCase().replace('_', ' '))) return false;
    if (location && !c.location?.toLowerCase().includes(location.toLowerCase())) return false;
    if (freshness && c.signal_freshness !== freshness) return false;
    if (q && !`${c.name} ${c.type} ${c.location} ${c.specialism} ${c.description}`.toLowerCase().includes(q.toLowerCase())) return false;
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
              Intelligence Corporativ · Înregistrări Verificate
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
              CATALOG COMPANII ({filtered.length})
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl leading-relaxed">
              Descoperiți dezvoltatori, constructori generali, ingineri de structură și birouri de arhitectură din România, cu dosare documentate din registre oficiale.
            </p>
          </div>
        </section>

        {/* Filter Controls Bar */}
        <section className="py-5 border-b border-slate-200 bg-white/95 sticky top-16 z-20 backdrop-blur-md shadow-xs">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <form method="GET" action="/companies" className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              <input
                name="q"
                defaultValue={q}
                className="flex-1 min-w-[200px] h-11 px-4 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                placeholder="Caută după denumire companie, CUI, specializare..."
              />
              <select
                name="type"
                defaultValue={type}
                className="h-11 px-3 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-600"
              >
                {COMPANY_TYPES.map(t => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <select
                name="location"
                defaultValue={location}
                className="h-11 px-3 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-600"
              >
                {LOCATIONS.map(l => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
              <select
                name="freshness"
                defaultValue={freshness}
                className="h-11 px-3 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-600"
              >
                {FRESHNESS_OPTIONS.map(f => (
                  <option key={f.value} value={f.value}>
                    {f.label}
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
                {(type || location || freshness || q) && (
                  <Link
                    href="/companies"
                    className="h-11 px-4 flex items-center justify-center border border-slate-300 text-xs font-mono text-slate-600 hover:text-slate-900 hover:border-slate-400 rounded-lg"
                  >
                    Resetează
                  </Link>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Company Dossier Grid */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((c, i) => (
                  <div
                    key={c.slug}
                    className="p-6 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4 hover:border-amber-500 hover:shadow-lg transition-all"
                  >
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-500 font-semibold">
                          {String(i + 1).padStart(2, '0')} · {c.type}
                        </span>
                        {c.signal_freshness && (
                          <span
                            className={`px-2.5 py-1 border rounded-md text-[9px] font-mono uppercase font-bold shadow-xs ${
                              c.signal_freshness === 'FRESH'
                                ? 'bg-sky-50 text-sky-800 border-sky-200'
                                : c.signal_freshness === 'RECENT'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            {c.signal_freshness === 'FRESH'
                              ? 'ACTIVITATE RECENTĂ'
                              : c.signal_freshness === 'RECENT'
                              ? 'ACTUALIZAT'
                              : 'ARHIVĂ'}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-slate-900">
                        <CompanyIntelligencePreview
                          company={{
                            name: c.name,
                            slug: c.slug,
                            type: c.type,
                            location: c.location,
                            active_projects_count: c.active_projects_count,
                            market_signals_count: c.market_signals_count,
                            last_activity_date: c.last_activity_date,
                            signal_freshness: c.signal_freshness,
                            latest_signal: c.latest_signal
                          }}
                        >
                          <Link href={`/companies/${c.slug}`} className="hover:text-amber-800 transition-colors">
                            {c.name}
                          </Link>
                        </CompanyIntelligencePreview>
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {c.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase font-semibold block">PROIECTE ACTIVE</span>
                          <span className="text-slate-900 font-bold text-base">
                            {c.active_projects_count !== null && c.active_projects_count !== undefined
                              ? c.active_projects_count
                              : 'Nedivulgat'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase font-semibold block">SEMNALE DE PIAȚĂ</span>
                          <span className="text-amber-800 font-bold text-base">
                            {c.market_signals_count !== null && c.market_signals_count !== undefined
                              ? c.market_signals_count
                              : 'Nedivulgat'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-mono text-[11px]">{c.location}</span>
                      <Link
                        href={`/companies/${c.slug}`}
                        className="font-mono text-xs font-bold text-amber-800 hover:text-amber-950 tracking-wider"
                      >
                        DESCHIDE DOSAR →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4">
                <p className="text-base text-slate-600">Nicio companie verificată nu corespunde filtrelor selectate.</p>
                <Link
                  href="/companies"
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
