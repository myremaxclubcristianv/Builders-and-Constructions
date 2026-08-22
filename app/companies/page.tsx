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
    <>
      <SiteHeader />
      <main className="shell">
        <section className="page-hero">
          <div className="eyebrow" style={{ color: '#c7a675' }}>Intelligence Objects & Market Participants</div>
          <h1>COMPANIES</h1>
          <p>
            Discover verified Romanian developers, general contractors, structural engineers and architectural practices.
            Explore active portfolios, project density, market activity freshness and verified credentials.
          </p>
        </section>

        {/* Intelligence Filterbar */}
        <form className="filterbar" method="GET" action="/companies" style={{ flexWrap: 'wrap', gap: 10 }}>
          <input
            name="q"
            defaultValue={q}
            className="field"
            placeholder="Search company, CUI, specialism..."
            style={{ flex: '1 1 200px' }}
          />
          <select name="type" defaultValue={type} className="field" style={{ flex: '1 1 150px' }}>
            {COMPANY_TYPES.map(t => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <select name="location" defaultValue={location} className="field" style={{ flex: '1 1 150px' }}>
            {LOCATIONS.map(l => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
          <select name="freshness" defaultValue={freshness} className="field" style={{ flex: '1 1 150px' }}>
            {FRESHNESS_OPTIONS.map(f => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          <button type="submit" className="btn fill">
            Filter Directory
          </button>
          {(type || location || freshness || q) && (
            <Link href="/companies" className="btn" style={{ borderColor: '#555', color: '#aaa' }}>
              Clear
            </Link>
          )}
        </form>

        {/* Intelligence Company Cards */}
        <div className="company-grid" style={{ marginBottom: 90 }}>
          {filtered.length > 0 ? (
            filtered.map((c, i) => {
              const formattedDate = c.last_activity_date
                ? new Date(c.last_activity_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()
                : 'NOT AVAILABLE';

              return (
                <div
                  className="company"
                  key={c.slug}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: 24,
                    background: '#141715',
                    border: '1px solid #262927',
                    borderRadius: 6
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span className="company-num" style={{ margin: 0 }}>
                        {String(i + 1).padStart(2, '0')} · {c.type}
                      </span>

                      {c.signal_freshness && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 800,
                            letterSpacing: '0.08em',
                            padding: '2px 6px',
                            borderRadius: 2,
                            border: `1px solid ${c.signal_freshness === 'FRESH' ? '#38bdf8' : c.signal_freshness === 'RECENT' ? '#c7a675' : '#777'}`,
                            color: c.signal_freshness === 'FRESH' ? '#38bdf8' : c.signal_freshness === 'RECENT' ? '#c7a675' : '#888'
                          }}
                        >
                          {c.signal_freshness}
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '4px 0 8px 0' }}>
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
                        <Link href={`/companies/${c.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>
                          {c.name}
                        </Link>
                      </CompanyIntelligencePreview>
                    </h3>

                    <p style={{ fontSize: 13, color: '#b5b3aa', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                      {c.description}
                    </p>

                    {/* Metrics Bar */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 8,
                        padding: '10px 12px',
                        background: '#0d100f',
                        border: '1px solid #1c201e',
                        borderRadius: 4,
                        marginBottom: 16,
                        fontSize: 11
                      }}
                    >
                      <div>
                        <div style={{ color: '#777', fontSize: 9, fontWeight: 700 }}>ACTIVE PROJECTS</div>
                        <div style={{ color: '#fff', fontWeight: 800, marginTop: 2 }}>
                          {c.active_projects_count !== null && c.active_projects_count !== undefined
                            ? `${c.active_projects_count}`
                            : 'NOT AVAILABLE'}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: '#777', fontSize: 9, fontWeight: 700 }}>MARKET SIGNALS</div>
                        <div style={{ color: '#c7a675', fontWeight: 800, marginTop: 2 }}>
                          {c.market_signals_count !== null && c.market_signals_count !== undefined
                            ? `${c.market_signals_count}`
                            : 'NOT AVAILABLE'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <footer
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: 11,
                      color: '#888',
                      borderTop: '1px solid #1a1e1c',
                      paddingTop: 12
                    }}
                  >
                    <span>
                      {c.location} · {c.status}
                    </span>
                    <Link
                      href={`/companies/${c.slug}`}
                      style={{ color: '#c7a675', fontWeight: 700, textDecoration: 'none' }}
                    >
                      OPEN DOSSIER →
                    </Link>
                  </footer>
                </div>
              );
            })
          ) : (
            <div className="empty full" style={{ gridColumn: '1 / -1', padding: '40px 20px', textAlign: 'center' }}>
              <p style={{ color: '#e5e5e5', fontSize: 16, marginBottom: 12 }}>
                No published companies match your selected filters.
              </p>
              <Link href="/companies" className="btn">
                Reset Filters
              </Link>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
