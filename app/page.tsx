import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getPublishedCompanies, getPublishedProjects, getIndustryHubData } from '@/lib/data';
import { CompanyIntelligencePreview } from '@/components/CompanyIntelligencePreview';

export default async function Home() {
  const [companyList, projectList, industryData] = await Promise.all([
    getPublishedCompanies(),
    getPublishedProjects(),
    getIndustryHubData()
  ]);

  const featuredProjects = projectList.slice(0, 3);
  const featuredCompanies = companyList.slice(0, 3);
  const { metrics, marketActivity } = industryData;

  return (
    <>
      <main>
        <div className="hero">
          <SiteHeader />
          <div className="shell hero-content">
            <div className="eyebrow" style={{ color: '#c7a675' }}>AiXLuxury · Romanian Construction Intelligence</div>
            <h1>THE COMPANIES<br />BUILDING WHAT COMES NEXT.</h1>
            <p>Discover the developers, construction companies, engineers and architectural practices shaping Romania. Verified production intelligence across companies, projects and market activity.</p>
            <div className="actions">
              <Link className="btn fill" href="/companies">Explore Companies</Link>
              <Link className="btn" href="/projects">Explore Projects</Link>
              <Link className="btn" href="/industry">Industry Intelligence</Link>
              <Link className="btn" href="/promote-company">Promote Your Company</Link>
            </div>
            <div className="ticker">
              <span>Independent Industry Platform</span>
              <span>Companies · Projects · Signals</span>
              <span>By AiXLuxury</span>
            </div>
          </div>
        </div>

        {/* Compact Market Intelligence Section */}
        <section className="section shell" style={{ borderBottom: '1px solid var(--line)', paddingBottom: 48 }}>
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>Market Overview</div>
              <h2>ROMANIAN CONSTRUCTION INTELLIGENCE</h2>
            </div>
            <Link className="link-arrow" href="/industry">Explore Full Hub →</Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 16,
              padding: 24,
              background: '#141715',
              border: '1px solid #262927',
              borderRadius: 6
            }}
          >
            <div>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700, letterSpacing: '0.08em' }}>VERIFIED COMPANIES</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginTop: 4 }}>
                {metrics.verified_companies !== null ? metrics.verified_companies : 'INSUFFICIENT DATA'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700, letterSpacing: '0.08em' }}>VERIFIED PROJECTS</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginTop: 4 }}>
                {metrics.verified_projects !== null ? metrics.verified_projects : 'INSUFFICIENT DATA'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700, letterSpacing: '0.08em' }}>ACTIVE SIGNALS</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#c7a675', marginTop: 4 }}>
                {metrics.active_signals !== null ? metrics.active_signals : 'INSUFFICIENT DATA'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700, letterSpacing: '0.08em' }}>COVERED REGIONS</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginTop: 4 }}>
                {metrics.covered_locations !== null ? metrics.covered_locations : 'INSUFFICIENT DATA'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
            <Link className="btn fill" href="/industry" style={{ fontSize: 12, minHeight: 40 }}>
              EXPLORE INDUSTRY →
            </Link>
            <Link className="btn" href="/companies" style={{ fontSize: 12, minHeight: 40 }}>
              EXPLORE COMPANIES →
            </Link>
            <Link className="btn" href="/projects" style={{ fontSize: 12, minHeight: 40 }}>
              EXPLORE PROJECTS →
            </Link>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>Project Intelligence</div>
              <h2>WHAT&apos;S BEING BUILT</h2>
            </div>
            <Link className="link-arrow" href="/projects">View all projects →</Link>
          </div>
          <div className="project-grid">
            {featuredProjects.map(p => (
              <Link
                href={`/projects/${p.slug}`}
                className="project-card"
                key={p.slug}
                style={{ '--bg': `url('${p.image}')` } as React.CSSProperties}
              >
                <span className="tag">{p.status}</span>
                <h3>{p.name}</h3>
                <p>{p.location}</p>
                <div className="card-meta">
                  <span>{p.type}</span>
                  {p.completion && <span>{p.completion}</span>}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Companies */}
        <section className="companies section">
          <div className="shell">
            <div className="section-head">
              <div>
                <div className="eyebrow" style={{ color: '#c7a675' }}>Selected Profiles</div>
                <h2>COMPANIES TO KNOW</h2>
              </div>
              <Link className="link-arrow" href="/companies">Discover companies →</Link>
            </div>
            <div className="company-grid">
              {featuredCompanies.map((c, i) => (
                <div className="company" key={c.slug} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span className="company-num">0{i + 1} · {c.type}</span>
                    <h3 style={{ marginTop: 4 }}>
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
                  <footer style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid #1a1e1c', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span>{c.location}</span>
                    <Link href={`/companies/${c.slug}`} style={{ color: '#c7a675', fontWeight: 700, textDecoration: 'none' }}>
                      DOSSIER →
                    </Link>
                  </footer>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Editorial Stories */}
        <section className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>Reporting the Built Environment</div>
              <h2>DISCOVER THE INDUSTRY</h2>
            </div>
            <Link className="link-arrow" href="/industry">All industry stories →</Link>
          </div>
          <div className="editorial">
            {[
              { title: 'Development & investment', href: '/projects?type=residential' },
              { title: 'Construction & infrastructure', href: '/projects?type=infrastructure' },
              { title: 'Engineering & technology', href: '/companies?type=engineering' },
              { title: 'Architecture & design', href: '/companies?type=architecture' }
            ].map((item, i) => (
              <Link className="story" key={item.title} href={item.href} style={{ textDecoration: 'none' }}>
                <div className="eyebrow" style={{ color: '#c7a675' }}>0{i + 1} / Intelligence</div>
                <h3>{item.title}</h3>
                <p>Clear, useful context on the forces shaping Romania&apos;s next built environment.</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Conversion Section */}
        <section className="conversion">
          <div className="shell">
            <div className="eyebrow" style={{ color: '#25221b' }}>For companies shaping the future</div>
            <h2>YOUR WORK DESERVES<br />TO BE SEEN.</h2>
            <p>We help construction companies, developers and engineering firms turn their projects and experience into powerful digital brands.</p>
            <div className="actions" style={{ marginTop: 24 }}>
              <Link className="btn" href="/promote-company" style={{ borderColor: '#191914' }}>
                Promote My Company
              </Link>
              <Link className="btn" href="/promote-project" style={{ borderColor: '#191914', background: 'transparent' }}>
                Promote A Project
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
