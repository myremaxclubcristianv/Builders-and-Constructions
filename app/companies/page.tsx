import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getPublishedCompanies } from '@/lib/data';
import { CompanyIntelligencePreview } from '@/components/CompanyIntelligencePreview';

export const metadata = {
  title: 'Companies Directory & Market Intelligence',
  description: 'Explore verified construction companies, developers, contractors and architectural practices across Romania.'
};

const COMPANY_TYPES = [
  { value: '', label: 'All Company Types' },
  { value: 'developer', label: 'Developer' },
  { value: 'construction_company', label: 'Construction Company' },
  { value: 'general_contractor', label: 'General Contractor' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'project_management', label: 'Project Management' },
  { value: 'specialized_contractor', label: 'Specialist Contractor' },
  { value: 'infrastructure', label: 'Infrastructure' }
];

const LOCATIONS = [
  { value: '', label: 'All Locations' },
  { value: 'Bucharest', label: 'Bucharest' },
  { value: 'Cluj', label: 'Cluj' },
  { value: 'Timiș', label: 'Timiș' },
  { value: 'Iași', label: 'Iași' },
  { value: 'Brașov', label: 'Brașov' },
  { value: 'Constanța', label: 'Constanța' },
  { value: 'Ilfov', label: 'Ilfov' }
];

const FRESHNESS_OPTIONS = [
  { value: '', label: 'All Signal Freshness' },
  { value: 'FRESH', label: 'Fresh (< 14 days)' },
  { value: 'RECENT', label: 'Recent (< 45 days)' },
  { value: 'AGING', label: 'Aging (< 90 days)' },
  { value: 'STALE', label: 'Stale (>= 90 days)' }
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
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        {/* Page Hero */}
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
              Verified Corporate Intelligence
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              COMPANIES DIRECTORY ({filtered.length})
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Discover verified Romanian developers, general contractors, structural engineers, and architectural practices with ONRC/ANAF primary-source records.
            </p>
          </div>
        </section>

        {/* Filter Controls Bar */}
        <section className="py-6 border-b border-[#1A1D1B] bg-[#050505] sticky top-16 z-20 backdrop-blur-md bg-[#050505]/90">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <form method="GET" action="/companies" className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              <input
                name="q"
                defaultValue={q}
                className="flex-1 min-w-[200px] h-11 px-4 bg-[#111111] border border-[#1A1D1B] rounded-lg text-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#C9A227]/50"
                placeholder="Search company name, CUI, specialism..."
              />
              <select
                name="type"
                defaultValue={type}
                className="h-11 px-3 bg-[#111111] border border-[#1A1D1B] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#C9A227]/50"
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
                className="h-11 px-3 bg-[#111111] border border-[#1A1D1B] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#C9A227]/50"
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
                className="h-11 px-3 bg-[#111111] border border-[#1A1D1B] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#C9A227]/50"
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
                  className="flex-1 sm:flex-none h-11 px-5 bg-[#C9A227] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#E4C58F] active:scale-95 transition-all"
                >
                  Filter
                </button>
                {(type || location || freshness || q) && (
                  <Link
                    href="/companies"
                    className="h-11 px-4 flex items-center justify-center border border-[#1A1D1B] text-xs font-mono text-[#888888] hover:text-white rounded-lg"
                  >
                    Reset
                  </Link>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Company Dossier Grid */}
        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((c, i) => (
                  <div
                    key={c.slug}
                    className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl flex flex-col justify-between space-y-4 hover:border-[#C9A227]/50 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#888888]">
                          {String(i + 1).padStart(2, '0')} · {c.type}
                        </span>
                        {c.signal_freshness && (
                          <span
                            className={`px-2 py-0.5 border rounded text-[9px] font-mono uppercase font-semibold ${
                              c.signal_freshness === 'FRESH'
                                ? 'bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/40'
                                : c.signal_freshness === 'RECENT'
                                ? 'bg-[#C9A227]/10 text-[#C9A227] border-[#C9A227]/40'
                                : 'bg-[#111111] text-[#888888] border-[#1A1D1B]'
                            }`}
                          >
                            {c.signal_freshness}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-white">
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
                          <Link href={`/companies/${c.slug}`} className="hover:text-[#C9A227] transition-colors">
                            {c.name}
                          </Link>
                        </CompanyIntelligencePreview>
                      </h3>

                      <p className="text-xs text-[#A0A0A0] line-clamp-3 leading-relaxed">
                        {c.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-xs font-mono">
                        <div>
                          <span className="text-[9px] text-[#666666] uppercase block">ACTIVE PROJECTS</span>
                          <span className="text-white font-bold text-sm">
                            {c.active_projects_count !== null && c.active_projects_count !== undefined
                              ? c.active_projects_count
                              : 'Not Disclosed'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-[#666666] uppercase block">MARKET SIGNALS</span>
                          <span className="text-[#C9A227] font-bold text-sm">
                            {c.market_signals_count !== null && c.market_signals_count !== undefined
                              ? c.market_signals_count
                              : 'Not Disclosed'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#1A1D1B] flex items-center justify-between text-xs">
                      <span className="text-[#888888] font-mono text-[11px]">{c.location}</span>
                      <Link
                        href={`/companies/${c.slug}`}
                        className="font-mono text-xs font-semibold text-[#C9A227] hover:text-[#E4C58F] tracking-wider"
                      >
                        OPEN DOSSIER →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4">
                <p className="text-base text-[#A0A0A0]">No verified companies match your current filter parameters.</p>
                <Link
                  href="/companies"
                  className="inline-block px-5 py-2.5 bg-[#C9A227] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider rounded-lg"
                >
                  Reset Company Filters
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
