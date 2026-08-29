import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset, realProjectsDataset } from '@/lib/real-romanian-data';

export const metadata = {
  title: 'Romanian Structural & MEP Engineering Companies · CONSTRUCTIONS by AiXLuxury',
  description: 'Verified directory of structural engineering consultancies, seismic engineers, and MEP engineering practices in Romania.'
};

export default function EngineersPage() {
  const engineers = realCompaniesDataset.filter(
    c => c.type === 'engineering' || c.type === 'structural_engineering' || c.type === 'mep'
  );

  return (
    <>
      <main>
        <div className="hero" style={{ paddingBottom: 50 }}>
          <SiteHeader />
          <div className="shell hero-content">
            <div className="eyebrow" style={{ color: '#c7a675' }}>Structural & Technical Engineering</div>
            <h1>ROMANIAN ENGINEERING PRACTICES</h1>
            <p>Verified profile database of structural engineering consultancies, seismic design experts, MEP engineers, and civil engineering institutes in Romania.</p>
          </div>
        </div>

        <section className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>Verified Engineering Consultancies</div>
              <h2>STRUCTURAL & CIVIL ENGINEERS ({engineers.length})</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {engineers.map(comp => {
              const engineeredProjects = realProjectsDataset.filter(p => p.engineering_slug === comp.slug);

              return (
                <div
                  key={comp.slug}
                  style={{
                    background: '#141715',
                    border: '1px solid #262927',
                    borderRadius: 6,
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 10, color: '#c7a675', fontWeight: 800, letterSpacing: '0.08em' }}>
                      {comp.type.replaceAll('_', ' ').toUpperCase()}
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, margin: '6px 0 10px', color: '#fff' }}>
                      <Link href={`/companies/${comp.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>{comp.name}</Link>
                    </h3>
                    <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.5, marginBottom: 16 }}>{comp.description}</p>
                    
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                      {comp.specializations.map(spec => (
                        <span key={spec} style={{ fontSize: 10, background: '#222523', color: '#ccc', padding: '3px 8px', borderRadius: 3 }}>
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #222523', paddingTop: 14 }}>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 10 }}>
                      Engineered Projects Tracked: <strong style={{ color: '#fff' }}>{engineeredProjects.length}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <a href={comp.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#c7a675', textDecoration: 'underline' }}>
                        Official Practice Site →
                      </a>
                      <Link className="btn" href={`/companies/${comp.slug}`} style={{ fontSize: 11, minHeight: 32, padding: '0 12px' }}>
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
