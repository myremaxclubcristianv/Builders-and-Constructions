/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realProjectsDataset, realCompaniesDataset, realLocationsDataset } from '@/lib/real-romanian-data';

export const metadata = {
  title: 'What Is Being Built Right Now in Romania · CONSTRUCTIONS by AiXLuxury',
  description: 'Live construction pipeline database in Romania. Filter active construction sites by city, developer, project type, and expected delivery date.'
};

export default async function PipelinePage({
  searchParams
}: {
  searchParams: Promise<{ city?: string; type?: string; status?: string; dev?: string }>
}) {
  const { city, type, status, dev } = await searchParams;

  let filteredProjects = realProjectsDataset;

  if (city) {
    filteredProjects = filteredProjects.filter(p => p.location_slug === city || p.county.toLowerCase() === city.toLowerCase());
  }
  if (type) {
    filteredProjects = filteredProjects.filter(p => p.project_type.toLowerCase().includes(type.toLowerCase()));
  }
  if (status) {
    filteredProjects = filteredProjects.filter(p => p.status === status || p.status_display.toLowerCase().includes(status.toLowerCase()));
  }
  if (dev) {
    filteredProjects = filteredProjects.filter(p => p.developer_slug === dev);
  }

  const activeUnderConstruction = realProjectsDataset.filter(p => p.status === 'under_construction');

  return (
    <>
      <main>
        <div className="hero" style={{ paddingBottom: 50 }}>
          <SiteHeader />
          <div className="shell hero-content">
            <div className="eyebrow" style={{ color: '#c7a675' }}>Live Construction Pipeline</div>
            <h1>WHAT IS BEING BUILT RIGHT NOW?</h1>
            <p>Real-time tracking of active construction sites, structural stage progress, expected delivery dates, and project teams across Romania.</p>
            
            <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
              <div style={{ background: '#141715', padding: '12px 20px', border: '1px solid #262927', borderRadius: 4 }}>
                <span style={{ fontSize: 11, color: '#888', fontWeight: 700 }}>UNDER CONSTRUCTION</span>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#c7a675' }}>{activeUnderConstruction.length} Sites</div>
              </div>
              <div style={{ background: '#141715', padding: '12px 20px', border: '1px solid #262927', borderRadius: 4 }}>
                <span style={{ fontSize: 11, color: '#888', fontWeight: 700 }}>TOTAL PIPELINE UNITS</span>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>
                  {activeUnderConstruction.reduce((acc, p) => acc + (p.unit_count || 0), 0).toLocaleString()} Units
                </div>
              </div>
              <div style={{ background: '#141715', padding: '12px 20px', border: '1px solid #262927', borderRadius: 4 }}>
                <span style={{ fontSize: 11, color: '#888', fontWeight: 700 }}>GROSS SURFACE AREA</span>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>
                  {(activeUnderConstruction.reduce((acc, p) => acc + (p.surface_area_sqm || 0), 0) / 1000).toFixed(0)}k sqm
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="section shell">
          {/* Interactive Filters Bar */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              padding: 16,
              background: '#141715',
              border: '1px solid #262927',
              borderRadius: 6,
              marginBottom: 32,
              flexWrap: 'wrap',
              alignItems: 'center'
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: '#c7a675', marginRight: 8 }}>FILTER PIPELINE:</div>
            
            <Link
              href="/pipeline"
              className={`btn ${!city && !type && !status && !dev ? 'fill' : ''}`}
              style={{ fontSize: 11, minHeight: 34, padding: '0 12px' }}
            >
              All Projects ({realProjectsDataset.length})
            </Link>
            
            <Link
              href="/pipeline?status=under_construction"
              className={`btn ${status === 'under_construction' ? 'fill' : ''}`}
              style={{ fontSize: 11, minHeight: 34, padding: '0 12px' }}
            >
              Under Construction ({activeUnderConstruction.length})
            </Link>

            <Link
              href="/pipeline?type=Residential"
              className={`btn ${type === 'Residential' ? 'fill' : ''}`}
              style={{ fontSize: 11, minHeight: 34, padding: '0 12px' }}
            >
              Residential
            </Link>

            <Link
              href="/pipeline?type=Office"
              className={`btn ${type === 'Office' ? 'fill' : ''}`}
              style={{ fontSize: 11, minHeight: 34, padding: '0 12px' }}
            >
              Office
            </Link>

            <Link
              href="/pipeline?type=Mixed-use"
              className={`btn ${type === 'Mixed-use' ? 'fill' : ''}`}
              style={{ fontSize: 11, minHeight: 34, padding: '0 12px' }}
            >
              Mixed-use
            </Link>

            <Link
              href="/pipeline?type=Industrial"
              className={`btn ${type === 'Industrial' ? 'fill' : ''}`}
              style={{ fontSize: 11, minHeight: 34, padding: '0 12px' }}
            >
              Industrial & Logistics
            </Link>
          </div>

          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>Verified Active Records</div>
              <h2>CONSTRUCTION PROJECTS PIPELINE ({filteredProjects.length})</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {filteredProjects.map(p => (
              <div
                key={p.slug}
                style={{
                  background: '#141715',
                  border: '1px solid #262927',
                  borderRadius: 6,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: p.status === 'under_construction' ? '#c7a675' : p.status === 'completed' ? '#22c55e' : '#3b82f6',
                      color: p.status === 'under_construction' ? '#000' : '#fff',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: 3,
                      textTransform: 'uppercase'
                    }}
                  >
                    {p.status_display}
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 12,
                      left: 12,
                      background: 'rgba(0,0,0,0.75)',
                      color: '#fff',
                      fontSize: 11,
                      padding: '3px 8px',
                      borderRadius: 3
                    }}
                  >
                    {p.location}
                  </span>
                </div>

                <div style={{ padding: 20, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#c7a675', fontWeight: 700 }}>{p.project_type.toUpperCase()}</div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, margin: '4px 0 8px', color: '#fff' }}>
                      <Link href={`/projects/${p.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>{p.name}</Link>
                    </h3>
                    <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.4, marginBottom: 16 }}>{p.description}</p>
                  </div>

                  <div style={{ borderTop: '1px solid #222523', paddingTop: 12, fontSize: 11, color: '#888' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>Developer:</span>
                      <strong style={{ color: '#fff' }}>{p.developer_name}</strong>
                    </div>
                    {p.contractor_name && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span>Contractor:</span>
                        <strong style={{ color: '#fff' }}>{p.contractor_name}</strong>
                      </div>
                    )}
                    {p.unit_count && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span>Scale:</span>
                        <strong style={{ color: '#fff' }}>{p.unit_count} Units</strong>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 6, borderTop: '1px dashed #222523' }}>
                      <span>Verified Source:</span>
                      <a href={p.sources[0]?.url || '#'} target="_blank" rel="noopener noreferrer" style={{ color: '#c7a675', textDecoration: 'underline' }}>
                        {p.sources[0]?.type || 'OFFICIAL'} DISCLOSURE
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
