import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { searchIntelligenceGlobal } from '@/lib/data';
import { CompanyIntelligencePreview } from '@/components/CompanyIntelligencePreview';

export const metadata = {
  title: 'Intelligence Search — Romanian Construction Market',
  description: 'Search published construction companies, development projects, market signals, evidence and editorial analysis in Romania.'
};

export default async function Search({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const term = q.trim();
  const { matchingCompanies, matchingProjects, matchingSignals, matchingArticles } = await searchIntelligenceGlobal(term);

  return (
    <>
      <SiteHeader />
      <main className="shell">
        <section className="page-hero">
          <div className="eyebrow" style={{ color: '#c7a675' }}>Global Intelligence Search</div>
          <h1>SEARCH</h1>
          <form className="filterbar" action="/search" method="GET">
            <input
              className="field"
              name="q"
              defaultValue={q}
              placeholder="Search company name, project, CUI, location or market signal..."
              autoFocus
              style={{ flex: 1 }}
            />
            <button className="btn fill" type="submit">
              Search Terminal
            </button>
          </form>
        </section>

        {!term ? (
          <section className="section">
            <p style={{ color: '#bdbbb4', fontSize: 16 }}>
              Search across published construction companies, development projects, verified market activity signals, and editorial intelligence.
            </p>
          </section>
        ) : (
          <section className="section">
            <div className="section-head">
              <div>
                <div className="eyebrow" style={{ color: '#c7a675' }}>Search Results For</div>
                <h2>&quot;{q}&quot;</h2>
              </div>
            </div>

            {/* Companies */}
            <h3 className="eyebrow" style={{ marginTop: 24, color: '#c7a675', letterSpacing: '0.08em' }}>COMPANIES</h3>
            <div className="search-results">
              {matchingCompanies.length ? (
                matchingCompanies.map((c: any) => (
                  <div className="company" key={c.slug} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span className="company-num">{c.type}</span>
                      <h3 style={{ marginTop: 4 }}>
                        <CompanyIntelligencePreview company={{ name: c.name, slug: c.slug, type: c.type, location: c.location }}>
                          <Link href={`/companies/${c.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>
                            {c.name}
                          </Link>
                        </CompanyIntelligencePreview>
                      </h3>
                      <p style={{ marginTop: 6 }}>{c.description}</p>
                    </div>
                    <footer style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid #1a1e1c', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span>{c.location}</span>
                      <Link href={`/companies/${c.slug}`} style={{ color: '#c7a675', fontWeight: 700, textDecoration: 'none' }}>
                        DOSSIER →
                      </Link>
                    </footer>
                  </div>
                ))
              ) : (
                <div className="empty">No published company profiles found matching &quot;{term}&quot;.</div>
              )}
            </div>

            {/* Projects */}
            <h3 className="eyebrow" style={{ marginTop: 45, color: '#c7a675', letterSpacing: '0.08em' }}>PROJECTS</h3>
            <div className="search-results">
              {matchingProjects.length ? (
                matchingProjects.map((p: any) => (
                  <div className="company" key={p.slug} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span className="company-num">{p.status}</span>
                      <h3 style={{ marginTop: 4 }}>
                        <Link href={`/projects/${p.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>
                          {p.name}
                        </Link>
                      </h3>
                      <p style={{ marginTop: 6 }}>{p.type} · {p.location}</p>
                    </div>
                    <footer style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid #1a1e1c', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span>{p.location}</span>
                      <Link href={`/projects/${p.slug}`} style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }}>
                        PROJECT DOSSIER →
                      </Link>
                    </footer>
                  </div>
                ))
              ) : (
                <div className="empty">No published project profiles found matching &quot;{term}&quot;.</div>
              )}
            </div>

            {/* Market Signals */}
            {matchingSignals.length > 0 && (
              <>
                <h3 className="eyebrow" style={{ marginTop: 45, color: '#c7a675', letterSpacing: '0.08em' }}>MARKET SIGNALS & EVIDENCE</h3>
                <div className="search-results">
                  {matchingSignals.map((s: any) => (
                    <div className="company" key={s.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <span className="company-num" style={{ color: '#38bdf8' }}>{s.signal_type.replaceAll('_', ' ')}</span>
                        <h3 style={{ marginTop: 4, color: '#fff', fontSize: 18 }}>{s.title}</h3>
                        {s.summary && <p style={{ marginTop: 6 }}>{s.summary}</p>}
                      </div>
                      <footer style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid #1a1e1c', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                        <span>
                          {s.company_name ? `Company: ${s.company_name}` : 'Market event'}
                        </span>
                        {s.source_url && (
                          <a href={s.source_url} target="_blank" rel="noreferrer" style={{ color: '#c7a675', fontWeight: 700, textDecoration: 'none' }}>
                            CITATION ↗
                          </a>
                        )}
                      </footer>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Articles */}
            {matchingArticles.length > 0 && (
              <>
                <h3 className="eyebrow" style={{ marginTop: 45, color: '#c7a675', letterSpacing: '0.08em' }}>EDITORIAL STORIES</h3>
                <div className="search-results">
                  {matchingArticles.map((a: any) => (
                    <Link className="company" href={`/editorial/${a.slug}`} key={a.slug}>
                      <span className="company-num">{a.category}</span>
                      <h3>{a.title}</h3>
                      <p>{a.excerpt || 'View article'}</p>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {!matchingCompanies.length && !matchingProjects.length && !matchingSignals.length && !matchingArticles.length && (
              <div className="actions" style={{ marginTop: 40 }}>
                <Link href="/promote" className="btn fill">
                  Can&apos;t find your company? Get featured
                </Link>
              </div>
            )}
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
