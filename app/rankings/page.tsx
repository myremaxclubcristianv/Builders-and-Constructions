import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset, realProjectsDataset } from '@/lib/real-romanian-data';

export const metadata = {
  title: 'Romanian Developer & Project Rankings · CONSTRUCTIONS by AiXLuxury',
  description: 'Data-driven rankings of active real estate developers and landmark construction projects in Romania based on verified public disclosures.'
};

export default function RankingsPage() {
  // Methodology: Data-Based Ranking by Active Projects & Total Portfolio Count
  const developers = realCompaniesDataset.filter(c => c.type === 'developer');
  
  const sortedByActive = [...developers].sort((a, b) => {
    const aActive = realProjectsDataset.filter(p => p.developer_slug === a.slug && p.status === 'under_construction').length;
    const bActive = realProjectsDataset.filter(p => p.developer_slug === b.slug && p.status === 'under_construction').length;
    return bActive - aActive;
  });

  const sortedByTotalPortfolio = [...developers].sort((a, b) => (b.projects_count || 0) - (a.projects_count || 0));

  const premiumProjects = realProjectsDataset.filter(p => p.is_featured);

  return (
    <>
      <main>
        <div className="hero" style={{ paddingBottom: 50 }}>
          <SiteHeader />
          <div className="shell hero-content">
            <div className="eyebrow" style={{ color: '#c7a675' }}>Transparent Methodology & Data Rankings</div>
            <h1>ROMANIAN DEVELOPER & PROJECT RANKINGS</h1>
            <p>Objective data-based rankings evaluating real estate developers, general contractors, and major construction pipelines across Romania based on verified public records.</p>
          </div>
        </div>

        {/* Methodology Note */}
        <section className="section shell" style={{ paddingTop: 0 }}>
          <div
            style={{
              padding: 24,
              background: '#141715',
              border: '1px solid #c7a675',
              borderRadius: 6,
              color: '#d4d4d4',
              lineHeight: 1.6
            }}
          >
            <div style={{ fontSize: 11, color: '#c7a675', fontWeight: 800, letterSpacing: '0.08em', marginBottom: 6 }}>
              DATA-BASED METHODOLOGY DISCLOSURE
            </div>
            <p style={{ margin: 0, fontSize: 13 }}>
              Rankings on this platform are computed directly from publicly verified records, official company reports, stock exchange disclosures (BVB, Euronext, JSE), and building permits. Data-based rankings reflect the <strong>count of active construction sites under development</strong> and <strong>total verified delivered portfolio units</strong>. Editorial selections are explicitly demarcated to preserve data integrity.
            </p>
          </div>
        </section>

        {/* Top Active Developers */}
        <section className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>Data Ranking</div>
              <h2>MOST ACTIVE DEVELOPERS BY ACTIVE CONSTRUCTION SITES</h2>
            </div>
            <span style={{ fontSize: 12, color: '#888' }}>Methodology: Count of verified sites currently under construction</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sortedByActive.slice(0, 10).map((dev, idx) => {
              const activeCount = realProjectsDataset.filter(p => p.developer_slug === dev.slug && p.status === 'under_construction').length;
              const totalCount = realProjectsDataset.filter(p => p.developer_slug === dev.slug).length;

              return (
                <div
                  key={dev.slug}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 24px',
                    background: '#141715',
                    border: '1px solid #262927',
                    borderRadius: 6,
                    flexWrap: 'wrap',
                    gap: 16
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <span style={{ fontSize: 24, fontWeight: 900, color: idx < 3 ? '#c7a675' : '#555', width: 36 }}>
                      0{idx + 1}
                    </span>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
                        <Link href={`/companies/${dev.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>{dev.name}</Link>
                      </h3>
                      <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                        HQ: {dev.location} · Active Markets: {dev.markets.join(', ')}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>ACTIVE SITES</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#c7a675' }}>{activeCount} Active</div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>TRACKED PORTFOLIO</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{totalCount} Projects</div>
                    </div>

                    <Link className="btn" href={`/companies/${dev.slug}`} style={{ fontSize: 11, minHeight: 34, padding: '0 14px' }}>
                      Profile →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Featured Projects Ranking */}
        <section className="section shell" style={{ borderTop: '1px solid var(--line)', paddingTop: 48 }}>
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>Editorial & Scale Ranking</div>
              <h2>SIGNIFICANT CONSTRUCTION DEVELOPMENTS IN ROMANIA</h2>
            </div>
          </div>

          <div className="project-grid">
            {premiumProjects.slice(0, 6).map(p => (
              <Link
                href={`/projects/${p.slug}`}
                className="project-card"
                key={p.slug}
                style={{ '--bg': `url('${p.image}')` } as React.CSSProperties}
              >
                <span className="tag" style={{ background: '#c7a675', color: '#000' }}>{p.status_display}</span>
                <h3>{p.name}</h3>
                <p>{p.location} · {p.developer_name}</p>
                <div className="card-meta">
                  <span>{p.project_type}</span>
                  {p.unit_count && <span>{p.unit_count} Units</span>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
