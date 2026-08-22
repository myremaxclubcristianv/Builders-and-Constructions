import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getIndustryHubData } from '@/lib/data';
import { CompanyIntelligencePreview } from '@/components/CompanyIntelligencePreview';

export const metadata = {
  title: 'Romanian Construction Industry Market Intelligence',
  description: 'Executive intelligence platform detailing companies, projects, market signals, sector dynamics and geographic activity across Romania.'
};

export default async function IndustryPage() {
  const { metrics, marketActivity, sectors, geography, topActiveCompanies } = await getIndustryHubData();

  const formattedUpdateDate = metrics.last_verified_at
    ? new Date(metrics.last_verified_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'NOT AVAILABLE';

  return (
    <>
      <SiteHeader />
      <main className="shell">
        {/* Industry Hero & Header */}
        <section className="page-hero" style={{ paddingBottom: 32 }}>
          <div className="eyebrow" style={{ color: '#c7a675', letterSpacing: '0.12em' }}>
            ROMANIAN CONSTRUCTION MARKET INTELLIGENCE
          </div>
          <h1>CONSTRUCTION INDUSTRY</h1>
          <p style={{ maxWidth: 780, fontSize: '1.1rem', lineHeight: 1.6, color: '#d8d6ce' }}>
            Verified production intelligence tracking active developers, general contractors, engineering practices,
            construction site milestones, and investment signals across Romania.
          </p>

          {/* Metrics Terminal Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 12,
              marginTop: 32,
              padding: 20,
              background: '#0d100f',
              border: '1px solid #262927',
              borderRadius: 6
            }}
          >
            <div>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700, letterSpacing: '0.08em' }}>VERIFIED COMPANIES</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginTop: 4 }}>
                {metrics.verified_companies !== null ? metrics.verified_companies : 'INSUFFICIENT DATA'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700, letterSpacing: '0.08em' }}>VERIFIED PROJECTS</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginTop: 4 }}>
                {metrics.verified_projects !== null ? metrics.verified_projects : 'INSUFFICIENT DATA'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700, letterSpacing: '0.08em' }}>ACTIVE SIGNALS</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#c7a675', marginTop: 4 }}>
                {metrics.active_signals !== null ? metrics.active_signals : 'INSUFFICIENT DATA'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700, letterSpacing: '0.08em' }}>COVERED LOCATIONS</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginTop: 4 }}>
                {metrics.covered_locations !== null ? metrics.covered_locations : 'INSUFFICIENT DATA'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700, letterSpacing: '0.08em' }}>LAST VERIFIED</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8', marginTop: 8 }}>
                {formattedUpdateDate}
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: WHAT IS MOVING (Verified Market Signals Feed) */}
        <section className="section">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>Real-time Intelligence Feed</div>
              <h2>WHAT IS MOVING</h2>
            </div>
            <Link href="/companies" className="link-arrow" style={{ fontSize: 13 }}>
              Explore All Companies →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {marketActivity.length > 0 ? (
              marketActivity.map(sig => (
                <article
                  key={sig.id}
                  style={{
                    padding: '20px 24px',
                    background: '#141715',
                    border: '1px solid #262927',
                    borderRadius: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          letterSpacing: '0.08em',
                          padding: '3px 8px',
                          borderRadius: 3,
                          background: sig.commercial_relevance === 'CRITICAL' ? 'rgba(239,68,68,0.15)' : 'rgba(56,189,248,0.15)',
                          color: sig.commercial_relevance === 'CRITICAL' ? '#ef4444' : '#38bdf8',
                          border: `1px solid ${sig.commercial_relevance === 'CRITICAL' ? '#ef4444' : '#38bdf8'}`
                        }}
                      >
                        {sig.signal_type.replaceAll('_', ' ')}
                      </span>
                      <span style={{ fontSize: 12, color: '#888' }}>
                        VERIFIED: {sig.event_date ? new Date(sig.event_date).toLocaleDateString('en-GB') : 'RECENT'}
                      </span>
                      <span style={{ fontSize: 11, color: '#86efac', border: '1px solid #86efac', padding: '1px 6px', borderRadius: 2 }}>
                        {sig.verification_state || 'VERIFIED'}
                      </span>
                    </div>

                    {sig.source_url && (
                      <a
                        href={sig.source_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: 12, color: '#c7a675', textDecoration: 'none', fontWeight: 600 }}
                      >
                        Evidence Citation ↗
                      </a>
                    )}
                  </div>

                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>
                    {sig.title}
                  </h3>

                  <p style={{ fontSize: 14, color: '#c4c2b9', margin: 0, lineHeight: 1.5 }}>
                    {sig.summary}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, borderTop: '1px solid #222523', paddingTop: 12, marginTop: 4 }}>
                    <div style={{ display: 'flex', gap: 16, fontSize: 13, flexWrap: 'wrap' }}>
                      {sig.company_name && (
                        <div>
                          <span style={{ color: '#888' }}>Company: </span>
                          {sig.company_slug ? (
                            <CompanyIntelligencePreview
                              company={{
                                name: sig.company_name,
                                slug: sig.company_slug,
                                location: sig.location || undefined,
                                latest_signal: sig.title
                              }}
                            >
                              <Link href={`/companies/${sig.company_slug}`} style={{ color: '#fff', fontWeight: 700 }}>
                                {sig.company_name}
                              </Link>
                            </CompanyIntelligencePreview>
                          ) : (
                            <strong style={{ color: '#fff' }}>{sig.company_name}</strong>
                          )}
                        </div>
                      )}

                      {sig.project_name && (
                        <div>
                          <span style={{ color: '#888' }}>Project: </span>
                          {sig.project_slug ? (
                            <Link href={`/projects/${sig.project_slug}`} style={{ color: '#38bdf8', fontWeight: 700 }}>
                              {sig.project_name}
                            </Link>
                          ) : (
                            <strong style={{ color: '#38bdf8' }}>{sig.project_name}</strong>
                          )}
                        </div>
                      )}

                      {sig.location && (
                        <div>
                          <span style={{ color: '#888' }}>Location: </span>
                          <strong style={{ color: '#ccc' }}>{sig.location}</strong>
                        </div>
                      )}
                    </div>

                    <div style={{ fontSize: 12, color: '#c7a675', fontWeight: 600 }}>
                      WHY IT MATTERS: {sig.why_it_matters || 'Commercial activity indicator'}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div style={{ padding: 32, textAlign: 'center', background: '#141715', borderRadius: 6, color: '#888' }}>
                INSUFFICIENT DATA FOR MARKET ACTIVITY FEED
              </div>
            )}
          </div>
        </section>

        {/* Section 2: MARKET SECTORS & CATEGORIES */}
        <section className="section">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>Sector Intelligence</div>
              <h2>MARKET SECTORS</h2>
            </div>
          </div>

          <div className="company-grid">
            {sectors.map(sec => (
              <Link
                key={sec.sector}
                href={`/projects?type=${sec.sector}`}
                className="company"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <span className="company-num" style={{ color: '#c7a675' }}>SECTOR INTELLIGENCE</span>
                  <h3>{sec.label}</h3>
                  <p style={{ marginTop: 8 }}>
                    {sec.projects_count !== null
                      ? `${sec.projects_count} verified projects recorded in production.`
                      : 'Sector metrics under continuous verification.'}
                  </p>
                </div>
                <footer style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span>
                    COMPANIES: {sec.companies_count !== null ? sec.companies_count : 'NOT AVAILABLE'}
                  </span>
                  <span style={{ color: '#c7a675', fontWeight: 700 }}>
                    EXPLORE →
                  </span>
                </footer>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 3: GEOGRAPHIC INTELLIGENCE */}
        <section className="section">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>Regional Concentration</div>
              <h2>GEOGRAPHIC INTELLIGENCE</h2>
            </div>
          </div>

          <div style={{ overflowX: 'auto', background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #262927', background: '#0d100f', color: '#888', fontSize: 11 }}>
                  <th style={{ padding: '14px 16px' }}>REGION</th>
                  <th style={{ padding: '14px 16px' }}>COMPANIES</th>
                  <th style={{ padding: '14px 16px' }}>PROJECTS</th>
                  <th style={{ padding: '14px 16px' }}>SIGNALS</th>
                  <th style={{ padding: '14px 16px' }}>STATUS</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {geography.map(geo => (
                  <tr key={geo.region} style={{ borderBottom: '1px solid #1c201e' }}>
                    <td style={{ padding: '16px', fontWeight: 800, color: '#fff' }}>
                      {geo.region}
                    </td>
                    <td style={{ padding: '16px', color: '#ccc' }}>
                      {geo.companies_count !== null ? geo.companies_count : 'INSUFFICIENT DATA'}
                    </td>
                    <td style={{ padding: '16px', color: '#ccc' }}>
                      {geo.projects_count !== null ? geo.projects_count : 'INSUFFICIENT DATA'}
                    </td>
                    <td style={{ padding: '16px', color: '#c7a675', fontWeight: 700 }}>
                      {geo.signals_count !== null ? geo.signals_count : 'INSUFFICIENT DATA'}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ fontSize: 11, color: '#38bdf8', border: '1px solid #38bdf8', padding: '2px 6px', borderRadius: 2 }}>
                        {geo.last_activity ? 'ACTIVE MARKET' : 'MONITORED'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <Link href={`/companies?location=${encodeURIComponent(geo.region)}`} style={{ color: '#c7a675', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                        FILTER REGION →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: TOP ACTIVE COMPANIES SPOTLIGHT */}
        <section className="section" style={{ marginBottom: 60 }}>
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>Active Companies</div>
              <h2>KEY MARKET PARTICIPANTS</h2>
            </div>
            <Link href="/companies" className="link-arrow" style={{ fontSize: 13 }}>
              View Complete Directory →
            </Link>
          </div>

          <div className="company-grid">
            {topActiveCompanies.length > 0 ? (
              topActiveCompanies.map((c, i) => (
                <div className="company" key={c.slug} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span className="company-num">
                      {String(i + 1).padStart(2, '0')} · {c.type}
                    </span>
                    <h3>
                      <CompanyIntelligencePreview
                        company={{
                          name: c.name,
                          slug: c.slug,
                          type: c.type,
                          location: c.location,
                          active_projects_count: c.active_projects_count,
                          market_signals_count: c.market_signals_count,
                          last_activity_date: c.last_activity_date,
                          signal_freshness: c.signal_freshness
                        }}
                      >
                        <Link href={`/companies/${c.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>
                          {c.name}
                        </Link>
                      </CompanyIntelligencePreview>
                    </h3>
                    <p style={{ marginTop: 6 }}>{c.description}</p>
                  </div>

                  <footer style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #1a1e1c', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                    <span>{c.location}</span>
                    <Link href={`/companies/${c.slug}`} style={{ color: '#c7a675', fontWeight: 700, textDecoration: 'none' }}>
                      DOSSIER →
                    </Link>
                  </footer>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: 32, textAlign: 'center', color: '#888' }}>
                INSUFFICIENT DATA FOR COMPANY DIRECTORY SPOTLIGHT
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
