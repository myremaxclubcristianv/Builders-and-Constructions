import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset, realProjectsDataset } from '@/lib/real-romanian-data';

export const metadata = {
  title: 'Romanian General Contractors & Construction Companies · CONSTRUCTIONS by AiXLuxury',
  description: 'Verified general contractors, civil engineering companies, and construction execution firms shaping major projects in Romania.'
};

export default function ContractorsPage() {
  const contractors = realCompaniesDataset.filter(
    c => c.type === 'general_contractor' || c.type === 'construction_company' || c.type === 'infrastructure'
  );

  return (
    <>
      <main>
        <div className="hero" style={{ paddingBottom: 50 }}>
          <SiteHeader />
          <div className="shell hero-content">
            <div className="eyebrow" style={{ color: '#c7a675' }}>Construction Ecosystem</div>
            <h1>ROMANIAN GENERAL CONTRACTORS & BUILDERS</h1>
            <p>Verified profile database of general contractors, structural builders, and civil infrastructure companies executing major residential, commercial, and public works projects in Romania.</p>
          </div>
        </div>

        <section className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>Verified Entities</div>
              <h2>GENERAL CONTRACTORS ({contractors.length})</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {contractors.map(comp => {
              const executedProjects = realProjectsDataset.filter(p => p.contractor_slug === comp.slug);

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
                      Executed Projects Tracked: <strong style={{ color: '#fff' }}>{executedProjects.length}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <a href={comp.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#c7a675', textDecoration: 'underline' }}>
                        Official Website →
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
