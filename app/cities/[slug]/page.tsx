import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realLocationsDataset, realProjectsDataset, realCompaniesDataset } from '@/lib/real-romanian-data';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loc = realLocationsDataset.find(l => l.slug === slug);
  if (!loc) return { title: 'City Not Found' };
  return {
    title: `Construction Intelligence ${loc.name} · CONSTRUCTIONS by AiXLuxury`,
    description: `Verified projects under construction, active developers, contractors, and market pipeline in ${loc.name}, Romania.`
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

  const developerSlugs = Array.from(new Set(cityProjects.map(p => p.developer_slug)));
  const cityDevelopers = realCompaniesDataset.filter(c => developerSlugs.includes(c.slug));

  return (
    <>
      <main>
        <div className="hero" style={{ paddingBottom: 50 }}>
          <SiteHeader />
          <div className="shell hero-content">
            <div className="eyebrow" style={{ color: '#c7a675' }}>{loc.county.toUpperCase()} COUNTY INTELLIGENCE</div>
            <h1>{loc.name.toUpperCase()}</h1>
            <p>Verified construction ecosystem intelligence in {loc.name}. Track real projects under construction, active developers, general contractors, architectural designs, and official source disclosures.</p>
            
            <div style={{ display: 'flex', gap: 20, marginTop: 24, flexWrap: 'wrap' }}>
              <div style={{ background: '#141715', padding: '12px 20px', border: '1px solid #262927', borderRadius: 4 }}>
                <span style={{ fontSize: 11, color: '#888', fontWeight: 700 }}>TOTAL PROJECTS</span>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{cityProjects.length}</div>
              </div>
              <div style={{ background: '#141715', padding: '12px 20px', border: '1px solid #262927', borderRadius: 4 }}>
                <span style={{ fontSize: 11, color: '#888', fontWeight: 700 }}>ACTIVE SITES</span>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#c7a675' }}>{activeProjects.length}</div>
              </div>
              <div style={{ background: '#141715', padding: '12px 20px', border: '1px solid #262927', borderRadius: 4 }}>
                <span style={{ fontSize: 11, color: '#888', fontWeight: 700 }}>DELIVERED</span>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{completedProjects.length}</div>
              </div>
              <div style={{ background: '#141715', padding: '12px 20px', border: '1px solid #262927', borderRadius: 4 }}>
                <span style={{ fontSize: 11, color: '#888', fontWeight: 700 }}>ACTIVE DEVELOPERS</span>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{cityDevelopers.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Pipeline */}
        <section className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>Construction Sites</div>
              <h2>UNDER CONSTRUCTION IN {loc.name.toUpperCase()}</h2>
            </div>
            <Link className="link-arrow" href="/pipeline">View all pipeline →</Link>
          </div>

          {activeProjects.length === 0 ? (
            <div style={{ padding: 40, background: '#141715', border: '1px solid #262927', textAlign: 'center', color: '#888' }}>
              No active construction sites currently recorded for {loc.name}. Check planned or completed projects.
            </div>
          ) : (
            <div className="project-grid">
              {activeProjects.map(p => (
                <Link
                  href={`/projects/${p.slug}`}
                  className="project-card"
                  key={p.slug}
                  style={{ '--bg': `url('${p.image}')` } as React.CSSProperties}
                >
                  <span className="tag" style={{ background: '#c7a675', color: '#000' }}>{p.status_display}</span>
                  <h3>{p.name}</h3>
                  <p>{p.developer_name}</p>
                  <div className="card-meta">
                    <span>{p.project_type}</span>
                    {p.unit_count && <span>{p.unit_count} Units</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Active Developers in City */}
        <section className="section shell" style={{ borderTop: '1px solid var(--line)', paddingTop: 48 }}>
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>Developer Presence</div>
              <h2>ACTIVE DEVELOPERS IN {loc.name.toUpperCase()}</h2>
            </div>
            <Link className="link-arrow" href="/companies">Explore all developers →</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {cityDevelopers.map(dev => (
              <Link
                href={`/companies/${dev.slug}`}
                key={dev.slug}
                style={{
                  padding: 24,
                  background: '#141715',
                  border: '1px solid #262927',
                  borderRadius: 6,
                  textDecoration: 'none',
                  color: '#fff',
                  display: 'block'
                }}
              >
                <div style={{ fontSize: 10, color: '#c7a675', fontWeight: 700, letterSpacing: '0.08em' }}>VERIFIED DEVELOPER</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: '6px 0 10px', color: '#fff' }}>{dev.name}</h3>
                <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.5, marginBottom: 14 }}>{dev.description.slice(0, 110)}...</p>
                <div style={{ fontSize: 11, color: '#888', borderTop: '1px solid #222523', paddingTop: 10 }}>
                  Founded: <strong>{dev.founded_year}</strong> · Headquartered: <strong>{dev.location}</strong>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Completed Projects in City */}
        {completedProjects.length > 0 && (
          <section className="section shell" style={{ borderTop: '1px solid var(--line)', paddingTop: 48 }}>
            <div className="section-head">
              <div>
                <div className="eyebrow" style={{ color: '#c7a675' }}>Historical Portfolio</div>
                <h2>DELIVERED PROJECTS IN {loc.name.toUpperCase()}</h2>
              </div>
            </div>
            <div className="project-grid">
              {completedProjects.map(p => (
                <Link
                  href={`/projects/${p.slug}`}
                  className="project-card"
                  key={p.slug}
                  style={{ '--bg': `url('${p.image}')` } as React.CSSProperties}
                >
                  <span className="tag">Delivered</span>
                  <h3>{p.name}</h3>
                  <p>{p.developer_name}</p>
                  <div className="card-meta">
                    <span>{p.project_type}</span>
                    {p.actual_delivery && <span>Delivered {p.actual_delivery}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
