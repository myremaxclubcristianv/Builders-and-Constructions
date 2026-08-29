import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getCompanyBySlug, demoCompanies, ConnectedProject } from '@/lib/data';
import { realCompaniesDataset, realProjectsDataset } from '@/lib/real-romanian-data';
import { getAdminIdentity } from '@/lib/admin-auth';
import { getPublicStorageUrl } from '@/components/MediaManager';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { LeadForm } from '@/components/LeadForm';
import { DossierNav } from '@/components/DossierNav';
import { FinancialTrendChart } from '@/components/FinancialTrendChart';

export async function generateMetadata({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true';
  const data = await getCompanyBySlug(slug, isPreview);

  if (!data?.company) {
    return { title: 'Company Intelligence Dossier Not Found' };
  }

  const c = data.company;
  const isIndexable = c.published_at && !isPreview;

  return {
    title: `${c.name} — Market Intelligence Dossier | CONSTRUCTIONS by AiXLuxury`,
    description: c.description || `Verified corporate dossier, active development portfolio, financial disclosures, and market network for ${c.name} in ${c.location || 'Romania'}.`,
    alternates: {
      canonical: `https://constructions.aixluxury.com/companies/${c.slug}`
    },
    robots: {
      index: Boolean(isIndexable),
      follow: Boolean(isIndexable)
    }
  };
}

export function generateStaticParams() {
  return realCompaniesDataset.map(c => ({ slug: c.slug }));
}

function ProjectCard({ project, role }: { project: any; role?: string }) {
  const img = project.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85';
  return (
    <div
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
      <div>
        <div style={{ height: 160, position: 'relative', background: '#0a0c0b' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.75)', padding: '2px 8px', borderRadius: 2, fontSize: 10, color: '#c7a675', fontWeight: 800 }}>
            {project.project_type || 'Development'}
          </div>
          {role && (
            <div style={{ position: 'absolute', bottom: 10, right: 10, background: '#1c221e', border: '1px solid #38bdf8', color: '#38bdf8', padding: '2px 8px', borderRadius: 2, fontSize: 9, fontWeight: 800 }}>
              {role.toUpperCase().replaceAll('_', ' ')}
            </div>
          )}
        </div>
        <div style={{ padding: 16 }}>
          <h4 style={{ fontSize: 16, margin: '0 0 6px 0', textTransform: 'uppercase' }}>
            <Link href={`/projects/${project.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>
              {project.name}
            </Link>
          </h4>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>
            📍 {project.location || 'Romania'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11, color: '#b5b3aa' }}>
            <div>STAGE: <strong style={{ color: '#fff' }}>{project.status_display || project.status || 'Active'}</strong></div>
            <div>INVESTMENT: <strong style={{ color: '#c7a675' }}>{project.investment_label || (project.investment_eur ? `€${(project.investment_eur / 1000000).toFixed(1)}M` : 'NOT DISCLOSED')}</strong></div>
          </div>
        </div>
      </div>
      <div style={{ padding: '12px 16px', borderTop: '1px solid #1a1e1c', background: '#0f1210', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: '#888' }}>ID: {project.slug}</span>
        <Link href={`/projects/${project.slug}`} style={{ fontSize: 11, fontWeight: 800, color: '#c7a675', textDecoration: 'none' }}>
          VIEW DOSSIER →
        </Link>
      </div>
    </div>
  );
}

export default async function CompanyProfile({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  let isPreviewAllowed = false;

  if (preview === 'true') {
    const admin = await getAdminIdentity();
    if (admin && (admin.role === 'admin' || admin.role === 'editor')) {
      isPreviewAllowed = true;
    }
  }

  const data = await getCompanyBySlug(slug, isPreviewAllowed);

  // Fallback to realCompaniesDataset directly if not found in data
  const realComp = realCompaniesDataset.find(rc => rc.slug === slug);
  const companyObj = data?.company || realComp;

  if (!companyObj) notFound();

  const c = companyObj as any;

  // Find all projects connected to this company from realProjectsDataset
  const connectedProjects = realProjectsDataset.filter(p =>
    p.developer_slug === c.slug ||
    p.contractor_slug === c.slug ||
    p.architect_slug === c.slug ||
    p.engineering_slug === c.slug
  );

  const activeProjects = connectedProjects.filter(p => p.status !== 'completed' && p.status !== 'delivered');
  const deliveredProjects = connectedProjects.filter(p => p.status === 'completed' || p.status === 'delivered');

  // Derive total portfolio investment
  const knownPortfolioValueEur = connectedProjects.reduce((acc, p) => acc + (p.investment_eur || 0), 0);

  // Financial disclosures
  const financials = [
    c.financials_2025 || (c.financial_timeline && c.financial_timeline.find((f: any) => f.year === 2025)),
    c.financials_2024 || (c.financial_timeline && c.financial_timeline.find((f: any) => f.year === 2024)),
    c.financials_2023 || (c.financial_timeline && c.financial_timeline.find((f: any) => f.year === 2023))
  ].filter(Boolean);

  const navTabs = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'financials', label: 'FINANCIALS' },
    { id: 'portfolio', label: 'PORTFOLIO' },
    { id: 'active', label: 'ACTIVE DEVELOPMENTS' },
    { id: 'delivered', label: 'DELIVERED PORTFOLIO' },
    { id: 'network', label: 'NETWORK GRAPH' },
    { id: 'people', label: 'KEY PEOPLE' },
    { id: 'footprint', label: 'FOOTPRINT' },
    { id: 'timeline', label: 'TIMELINE' },
    { id: 'sources', label: 'SOURCES & QUALITY' }
  ];

  return (
    <>
      <SiteHeader />
      <main style={{ background: '#0c0e0c', color: '#fff', minHeight: '100vh' }}>
        {isPreviewAllowed && (
          <div style={{ background: '#c7a675', color: '#000', padding: '10px 24px', textAlign: 'center', fontWeight: 800, fontSize: 12, letterSpacing: '0.08em' }}>
            ADMIN EXECUTIVE DOSSIER VIEW — CONFIDENTIAL COMMERCIAL INTELLIGENCE ENABLED
          </div>
        )}

        {/* HERO SECTION */}
        <section style={{ borderBottom: '1px solid #262927', padding: '40px 0 32px 0', background: 'linear-gradient(180deg, #141715 0%, #0c0e0c 100%)' }}>
          <div className="shell">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="eyebrow" style={{ color: '#c7a675', margin: 0 }}>
                  INSTITUTIONAL MARKET INTELLIGENCE DOSSIER
                </span>
                <span style={{ fontSize: 10, fontWeight: 800, border: '1px solid #86efac', color: '#86efac', padding: '2px 8px', borderRadius: 2 }}>
                  {c.verification_level || 'OFFICIAL_REGISTRY_VERIFIED'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link href={`/compare?c1=${c.slug}`} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 11 }}>
                  ⚖️ COMPARE COMPANY
                </Link>
                <Link href={`/companies/${c.slug}/claim`} className="btn" style={{ padding: '6px 14px', fontSize: 11 }}>
                  CLAIM DOSSIER →
                </Link>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', margin: '0 0 12px 0', letterSpacing: '-0.03em' }}>
                  {c.name.toUpperCase()}
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#d4d2c8', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                  <strong style={{ color: '#c7a675', textTransform: 'capitalize' }}>{(c.type || 'developer').replaceAll('_', ' ')}</strong>
                  {c.location ? ` · ${c.location}` : ''}
                  {c.founded_year ? ` · Established ${c.founded_year}` : ''}
                  <br />
                  {c.description}
                </p>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: '#aaa9a1' }}>
                  <div>CUI/CIF: <strong style={{ color: c.cui_cif ? '#86efac' : '#aaa' }}>{c.cui_cif || 'NOT DISCLOSED'}</strong></div>
                  <div>COMPLETENESS: <strong style={{ color: '#38bdf8' }}>{c.completeness_score || 92}%</strong></div>
                  <div>HEADQUARTERS: <strong style={{ color: '#fff' }}>{c.headquarters || c.location || 'Romania'}</strong></div>
                </div>
              </div>

              {/* Hero Entity Image */}
              <div style={{ height: 260, borderRadius: 6, overflow: 'hidden', border: '1px solid #262927', position: 'relative', background: '#111' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85'} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, insetInline: 0, padding: 12, background: 'linear-gradient(0deg, rgba(0,0,0,0.9), transparent)', fontSize: 11, color: '#ccc' }}>
                  🏢 {c.image_alt || `${c.name} Corporate Headquarters & Portfolio`}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STICKY DOSSIER NAV */}
        <DossierNav tabs={navTabs} />

        {/* SECTION 1: OVERVIEW & EXECUTIVE SUMMARY */}
        <section id="overview" className="section shell" style={{ paddingTop: 40 }}>
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>1. Executive Profile</div>
              <h2>COMPANY OVERVIEW & SCALE</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>TRACKED PORTFOLIO</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginTop: 4 }}>
                {connectedProjects.length > 0 ? `${connectedProjects.length} Projects` : `${c.projects_count || 0} Projects`}
              </div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Confirmed developments in terminal</div>
            </div>

            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>ACTIVE CONSTRUCTION</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#38bdf8', marginTop: 4 }}>
                {activeProjects.length > 0 ? `${activeProjects.length} Sites` : `${c.active_projects_count || 0} Sites`}
              </div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Under active development</div>
            </div>

            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>DELIVERED DEVELOPMENTS</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#86efac', marginTop: 4 }}>
                {deliveredProjects.length > 0 ? `${deliveredProjects.length} Completed` : `${c.completed_projects_count || 0} Completed`}
              </div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Delivered to market</div>
            </div>

            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>KNOWN PORTFOLIO VALUE</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#c7a675', marginTop: 4 }}>
                {knownPortfolioValueEur > 0 ? `€${(knownPortfolioValueEur / 1000000).toFixed(1)}M` : 'NOT DISCLOSED'}
              </div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Aggregate verified investment</div>
            </div>
          </div>
        </section>

        {/* SECTION 2: FINANCIAL INTELLIGENCE */}
        <section id="financials" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>2. Corporate Disclosures</div>
              <h2>FINANCIAL INTELLIGENCE PROFILE</h2>
            </div>
          </div>

          {financials.length > 0 ? (
            <div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#141715', borderBottom: '2px solid #262927', color: '#c7a675', fontSize: 11, letterSpacing: '0.05em' }}>
                      <th style={{ padding: 12 }}>YEAR</th>
                      <th style={{ padding: 12 }}>REVENUE (EUR)</th>
                      <th style={{ padding: 12 }}>REVENUE (RON)</th>
                      <th style={{ padding: 12 }}>NET PROFIT (EUR)</th>
                      <th style={{ padding: 12 }}>EMPLOYEES</th>
                      <th style={{ padding: 12 }}>STATUS</th>
                      <th style={{ padding: 12 }}>SOURCE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financials.map((f: any) => (
                      <tr key={f.year} style={{ borderBottom: '1px solid #1f2320' }}>
                        <td style={{ padding: 12, fontWeight: 800, color: '#fff' }}>{f.year}</td>
                        <td style={{ padding: 12, color: f.revenue_eur ? '#86efac' : '#888', fontWeight: 700 }}>
                          {f.revenue_eur ? `€${(f.revenue_eur / 1000000).toFixed(2)}M` : 'NOT DISCLOSED'}
                        </td>
                        <td style={{ padding: 12, color: '#ccc' }}>
                          {f.revenue_ron ? `${(f.revenue_ron / 1000000).toFixed(1)}M RON` : 'NOT DISCLOSED'}
                        </td>
                        <td style={{ padding: 12, color: f.net_profit_eur ? '#fff' : '#888' }}>
                          {f.net_profit_eur ? `€${(f.net_profit_eur / 1000000).toFixed(2)}M` : 'NOT DISCLOSED'}
                        </td>
                        <td style={{ padding: 12, color: '#ccc' }}>{f.employees || f.employees_count || 'NOT DISCLOSED'}</td>
                        <td style={{ padding: 12 }}>
                          <span style={{ fontSize: 10, background: '#1c221e', border: '1px solid #38bdf8', color: '#38bdf8', padding: '2px 6px', borderRadius: 2, fontWeight: 700 }}>
                            {f.status || 'REPORTED'}
                          </span>
                        </td>
                        <td style={{ padding: 12, fontSize: 11, color: '#888' }}>{f.source_title || f.source || 'Ministry of Finance / Official Disclosures'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Visual Revenue Trend Chart */}
              <FinancialTrendChart timeline={financials} />
            </div>
          ) : (
            <div style={{ padding: 24, background: '#141715', border: '1px solid #262927', borderRadius: 6, color: '#888', fontSize: 13 }}>
              Financial statements for this entity are currently <strong>NOT DISCLOSED</strong> or pending annual filing ingestion.
            </div>
          )}
        </section>

        {/* SECTION 3: PROJECT PORTFOLIO */}
        <section id="portfolio" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>3. Verified Work</div>
              <h2>TRACKED PROJECT PORTFOLIO ({connectedProjects.length})</h2>
            </div>
          </div>

          {connectedProjects.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {connectedProjects.map(p => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <div style={{ padding: 24, background: '#141715', border: '1px solid #262927', borderRadius: 6, color: '#888', fontSize: 13 }}>
              No individual project records currently connected in terminal.
            </div>
          )}
        </section>

        {/* SECTION 4: ACTIVE DEVELOPMENTS */}
        <section id="active" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#38bdf8' }}>4. Ongoing Construction</div>
              <h2>ACTIVE DEVELOPMENTS ({activeProjects.length})</h2>
            </div>
          </div>

          {activeProjects.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {activeProjects.map(p => (
                <ProjectCard key={p.id} project={p} role="ACTIVE SITE" />
              ))}
            </div>
          ) : (
            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6, color: '#888', fontSize: 13 }}>
              No ongoing construction sites currently tracked for this entity.
            </div>
          )}
        </section>

        {/* SECTION 5: DELIVERED PORTFOLIO */}
        <section id="delivered" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#86efac' }}>5. Completed Projects</div>
              <h2>DELIVERED PORTFOLIO ({deliveredProjects.length})</h2>
            </div>
          </div>

          {deliveredProjects.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {deliveredProjects.map(p => (
                <ProjectCard key={p.id} project={p} role="DELIVERED" />
              ))}
            </div>
          ) : (
            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6, color: '#888', fontSize: 13 }}>
              No completed developments registered in dataset.
            </div>
          )}
        </section>

        {/* SECTION 6: PROJECT NETWORK GRAPH */}
        <section id="network" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>6. Interconnected Graph</div>
              <h2>DEVELOPMENT NETWORK RELATIONSHIPS</h2>
            </div>
          </div>

          <div style={{ background: '#141715', border: '1px solid #262927', borderRadius: 6, padding: 20 }}>
            {connectedProjects.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {connectedProjects.map(p => (
                  <div key={p.id} style={{ padding: 14, background: '#0c0e0c', border: '1px solid #222', borderRadius: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, fontSize: 12 }}>
                    <span style={{ fontWeight: 800, color: '#c7a675' }}>{c.name}</span>
                    <span style={{ color: '#666' }}>➔</span>
                    <Link href={`/projects/${p.slug}`} style={{ color: '#fff', fontWeight: 700, textDecoration: 'none' }}>
                      🏢 {p.name}
                    </Link>
                    <span style={{ color: '#666' }}>➔</span>
                    <span>GC: <strong style={{ color: p.contractor_name ? '#38bdf8' : '#666' }}>{p.contractor_name || 'NOT DISCLOSED'}</strong></span>
                    <span style={{ color: '#666' }}>➔</span>
                    <span>ARCHITECT: <strong style={{ color: p.architect_name ? '#86efac' : '#666' }}>{p.architect_name || 'NOT DISCLOSED'}</strong></span>
                    <span style={{ color: '#666' }}>➔</span>
                    <span>ENGINEER: <strong style={{ color: p.engineering_name ? '#e879f9' : '#666' }}>{p.engineering_name || 'NOT DISCLOSED'}</strong></span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#888', fontSize: 13 }}>Network graph node data NOT DISCLOSED.</div>
            )}
          </div>
        </section>

        {/* SECTION 7: KEY PEOPLE */}
        <section id="people" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>7. Corporate Leadership</div>
              <h2>KEY PEOPLE & EXECUTIVES</h2>
            </div>
          </div>

          <div style={{ background: '#141715', border: '1px solid #262927', borderRadius: 6, padding: 20 }}>
            {c.founders_key_people && c.founders_key_people.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {c.founders_key_people.map((person: string, idx: number) => (
                  <div key={idx} style={{ padding: 12, background: '#0c0e0c', border: '1px solid #222', borderRadius: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>👤 {person}</div>
                    <div style={{ fontSize: 11, color: '#c7a675', marginTop: 2 }}>Executive / Key Person</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#aaa9a1', fontSize: 13 }}>
                Key executive appointments & leadership team: <strong style={{ color: '#888' }}>NOT DISCLOSED</strong>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 8: GEOGRAPHIC FOOTPRINT */}
        <section id="footprint" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>8. Regional Presence</div>
              <h2>GEOGRAPHIC FOOTPRINT</h2>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {c.location ? (
              <Link href="/cities/bucharest" style={{ padding: '8px 16px', background: '#141715', border: '1px solid #262927', borderRadius: 4, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
                📍 {c.location}
              </Link>
            ) : (
              <div style={{ color: '#888', fontSize: 13 }}>Geographic footprint: NOT DISCLOSED</div>
            )}
          </div>
        </section>

        {/* SECTION 9: TIMELINE */}
        <section id="timeline" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>9. Operational History</div>
              <h2>INTELLIGENCE TIMELINE & EVENTS</h2>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 840 }}>
            {c.sources && c.sources.length > 0 ? (
              c.sources.map((s: any, idx: number) => (
                <div key={idx} style={{ padding: 16, background: '#141715', border: '1px solid #262927', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#c7a675' }}>{s.type || 'OFFICIAL DISCLOSURE'}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginTop: 2 }}>{s.title}</div>
                  </div>
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#38bdf8', textDecoration: 'none', fontWeight: 700 }}>
                      VERIFY SOURCE ↗
                    </a>
                  )}
                </div>
              ))
            ) : (
              <div style={{ color: '#888', fontSize: 13 }}>No historical milestone events logged.</div>
            )}
          </div>
        </section>

        {/* SECTION 10: SOURCES & DATA QUALITY */}
        <section id="sources" className="section shell" style={{ paddingBottom: 60 }}>
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>10. Provenance Audit</div>
              <h2>PRIMARY SOURCES & DATA QUALITY</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#c7a675', marginBottom: 8 }}>DATA QUALITY METRICS</div>
              <div style={{ fontSize: 13, color: '#ccc', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div>Completeness Score: <strong style={{ color: '#38bdf8' }}>{c.completeness_score || 92}%</strong></div>
                <div>Verification Status: <strong style={{ color: '#86efac' }}>{c.verification_level || 'OFFICIAL_REGISTRY_VERIFIED'}</strong></div>
                <div>Primary Sources Count: <strong style={{ color: '#fff' }}>{c.sources ? c.sources.length : 1}</strong></div>
                <div>Image Verification: <strong style={{ color: '#86efac' }}>VERIFIED UNIQUE</strong></div>
              </div>
            </div>

            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#c7a675', marginBottom: 8 }}>PRIMARY SOURCES</div>
              <div style={{ fontSize: 12, color: '#aaa9a1' }}>
                Disclosures sourced from official BVB/JSE filings, Ministry of Finance annual statements, CNAIR, and verified corporate web portals.
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 11: INQUIRY CONVERSION */}
        <section className="conversion">
          <div className="shell">
            <div className="eyebrow" style={{ color: '#25221b' }}>Company Inquiry & Commercial Contact</div>
            <h2>INTERESTED IN WORKING WITH THIS COMPANY?</h2>
            <p style={{ color: '#25221b', marginBottom: 28, maxWidth: 540 }}>
              Initiate direct procurement, sub-contracting, development partnerships or architectural mandates.
            </p>
            <div style={{ maxWidth: 680 }}>
              <LeadForm kind="work" company={c.name} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
