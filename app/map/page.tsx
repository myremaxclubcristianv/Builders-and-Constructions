import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realProjectsDataset, realLocationsDataset } from '@/lib/real-romanian-data';

export const metadata = {
  title: 'National Construction Map Romania · CONSTRUCTIONS by AiXLuxury',
  description: 'Interactive national map of active construction sites, completed developments, and urban regeneration projects across Romanian cities.'
};

export default function ConstructionMapPage() {
  const activeUnderConstruction = realProjectsDataset.filter(p => p.status === 'under_construction');
  const completedProjects = realProjectsDataset.filter(p => p.status === 'completed');

  return (
    <>
      <main>
        <div className="hero" style={{ paddingBottom: 40 }}>
          <SiteHeader />
          <div className="shell hero-content">
            <div className="eyebrow" style={{ color: '#c7a675' }}>Geographic Market Intelligence</div>
            <h1>ROMANIAN NATIONAL CONSTRUCTION MAP</h1>
            <p>Visual map of verified construction sites, active developer footprints, and development density across Bucharest, Ilfov, Cluj, Timișoara, Iași, Brașov, Constanța, and regional hubs.</p>
          </div>
        </div>

        <section className="section shell">
          {/* Map Visual Container */}
          <div
            style={{
              background: '#0e110f',
              border: '1px solid #262927',
              borderRadius: 8,
              padding: 24,
              marginBottom: 40
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <span style={{ fontSize: 11, color: '#c7a675', fontWeight: 800 }}>LIVE GEOGRAPHIC DISTRIBUTION</span>
                <h2 style={{ fontSize: 22, fontWeight: 700, margin: '2px 0 0', color: '#fff' }}>ROMANIA CONSTRUCTION DENSITY</h2>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#c7a675' }}></span> Active Construction ({activeUnderConstruction.length})
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }}></span> Delivered ({completedProjects.length})
                </span>
              </div>
            </div>

            {/* City Distribution Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {realLocationsDataset.slice(0, 12).map(loc => {
                const count = realProjectsDataset.filter(p => p.location_slug === loc.slug || p.county === loc.county).length;
                const active = realProjectsDataset.filter(p => (p.location_slug === loc.slug || p.county === loc.county) && p.status === 'under_construction').length;

                return (
                  <Link
                    href={`/cities/${loc.slug}`}
                    key={loc.slug}
                    style={{
                      padding: 16,
                      background: '#141715',
                      border: '1px solid #222523',
                      borderRadius: 6,
                      textDecoration: 'none',
                      color: '#fff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{loc.name}</div>
                      <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{loc.county} County</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: active > 0 ? '#c7a675' : '#fff' }}>{count} Projects</div>
                      <div style={{ fontSize: 10, color: '#888' }}>{active} Active Sites</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Active Projects List */}
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>Geocoded Sites</div>
              <h2>ALL RECORDED CONSTRUCTION LOCATIONS</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {realProjectsDataset.map(p => (
              <Link
                href={`/projects/${p.slug}`}
                key={p.slug}
                style={{
                  padding: 20,
                  background: '#141715',
                  border: '1px solid #262927',
                  borderRadius: 6,
                  textDecoration: 'none',
                  color: '#fff',
                  display: 'block'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: p.status === 'under_construction' ? '#c7a675' : '#22c55e' }}>
                    {p.status_display.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 11, color: '#888' }}>{p.location}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 6px', color: '#fff' }}>{p.name}</h3>
                <p style={{ fontSize: 12, color: '#aaa', margin: 0 }}>{p.developer_name} · {p.project_type}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
