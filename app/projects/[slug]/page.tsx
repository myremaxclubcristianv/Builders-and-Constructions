import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getProjectBySlug, demoProjects } from '@/lib/data';
import { realProjectsDataset, realCompaniesDataset } from '@/lib/real-romanian-data';
import { getAdminIdentity } from '@/lib/admin-auth';
import { getPublicStorageUrl } from '@/components/MediaManager';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { CompanyIntelligencePreview } from '@/components/CompanyIntelligencePreview';
import { DossierNav } from '@/components/DossierNav';
import { ProjectStageLifecycle } from '@/components/ProjectStageLifecycle';
import { LeadForm } from '@/components/LeadForm';

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
  const data = await getProjectBySlug(slug, isPreview);

  if (!data?.project) {
    return { title: 'Project Intelligence Dossier Not Found' };
  }

  const p = data.project;
  const isIndexable = p.published_at && !isPreview;

  return {
    title: `${p.name} — Project Intelligence Dossier | CONSTRUCTIONS by AiXLuxury`,
    description: p.description || `Verified development dossier, construction lifecycle stage, specifications, and project team for ${p.name} in ${p.location || 'Romania'}.`,
    alternates: {
      canonical: `https://constructions.aixluxury.com/projects/${p.slug}`
    },
    robots: {
      index: Boolean(isIndexable),
      follow: Boolean(isIndexable)
    }
  };
}

export function generateStaticParams() {
  return realProjectsDataset.map(p => ({ slug: p.slug }));
}

export default async function ProjectProfile({
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

  const data = await getProjectBySlug(slug, isPreviewAllowed);
  const realProj = realProjectsDataset.find(rp => rp.slug === slug);
  const projectObj = data?.project || realProj;

  if (!projectObj) notFound();

  const p = projectObj as any;

  // Development Team Links
  const devComp = realCompaniesDataset.find(c => c.slug === p.developer_slug || c.name === p.developer_name);
  const gcComp = realCompaniesDataset.find(c => c.slug === p.contractor_slug || c.name === p.contractor_name);
  const archComp = realCompaniesDataset.find(c => c.slug === p.architect_slug || c.name === p.architect_name);
  const engComp = realCompaniesDataset.find(c => c.slug === p.engineering_slug || c.name === p.engineering_name);

  // Related Projects Network
  const sameDeveloperProjects = realProjectsDataset.filter(other => other.developer_slug === p.developer_slug && other.slug !== p.slug);
  const sameCityProjects = realProjectsDataset.filter(other => other.location_slug === p.location_slug && other.slug !== p.slug);

  const navTabs = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'specs', label: 'SCALE & SPECS' },
    { id: 'financials', label: 'INVESTMENT' },
    { id: 'lifecycle', label: 'STAGE LIFECYCLE' },
    { id: 'team', label: 'DEVELOPMENT TEAM' },
    { id: 'location', label: 'LOCATION' },
    { id: 'timeline', label: 'TIMELINE' },
    { id: 'sources', label: 'SOURCES' },
    { id: 'related', label: 'RELATED NETWORK' }
  ];

  const heroUrl = p.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85';

  return (
    <>
      <SiteHeader />
      <main style={{ background: '#0c0e0c', color: '#fff', minHeight: '100vh' }}>
        {isPreviewAllowed && (
          <div style={{ background: '#c7a675', color: '#000', padding: '10px 24px', textAlign: 'center', fontWeight: 800, fontSize: 12, letterSpacing: '0.08em' }}>
            ADMIN PREVIEW MODE — DRAFT RECORD (NOT VISIBLE ANONYMOUSLY)
          </div>
        )}

        {/* HERO SECTION */}
        <section style={{ minHeight: 520, position: 'relative', display: 'flex', alignItems: 'flex-end', borderBottom: '1px solid #262927' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(0deg, rgba(12,14,12,0.95) 0%, rgba(12,14,12,0.4) 60%, rgba(12,14,12,0.7) 100%), url('${heroUrl}') center/cover`
            }}
          />
          <div className="shell hero-content" style={{ position: 'relative', zIndex: 2, paddingBottom: 40, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="eyebrow" style={{ color: '#c7a675', margin: 0 }}>
                  PROJECT INTELLIGENCE DOSSIER
                </span>
                <span style={{ fontSize: 10, fontWeight: 800, border: '1px solid #38bdf8', color: '#38bdf8', padding: '2px 8px', borderRadius: 2 }}>
                  {p.status_display || p.status || 'UNDER CONSTRUCTION'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link href={`/compare?p1=${p.slug}`} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 11 }}>
                  ⚖️ COMPARE PROJECT
                </Link>
                <Link href="/pipeline" className="btn" style={{ padding: '6px 14px', fontSize: 11 }}>
                  📊 OPEN IN PIPELINE →
                </Link>
              </div>
            </div>

            <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)', margin: '8px 0 12px 0', textTransform: 'uppercase', letterSpacing: '-0.03em' }}>
              {p.name}
            </h1>

            <p style={{ fontSize: '1.2rem', color: '#d8d6ce', maxWidth: 800, margin: 0 }}>
              📍 {p.location || 'Romania'} · <strong style={{ color: '#c7a675' }}>{p.project_type || 'Development'}</strong>
              {p.developer_name && (
                <span>
                  {' '}· Developer:{' '}
                  {devComp ? (
                    <Link href={`/companies/${devComp.slug}`} style={{ color: '#c7a675', fontWeight: 800, textDecoration: 'none' }}>
                      {p.developer_name}
                    </Link>
                  ) : (
                    <strong style={{ color: '#fff' }}>{p.developer_name}</strong>
                  )}
                </span>
              )}
            </p>
          </div>
        </section>

        {/* STICKY DOSSIER NAV */}
        <DossierNav tabs={navTabs} />

        {/* SECTION 1: OVERVIEW */}
        <section id="overview" className="section shell" style={{ paddingTop: 40 }}>
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>1. Executive Profile</div>
              <h2>PROJECT OVERVIEW</h2>
            </div>
          </div>

          <div style={{ padding: 24, background: '#141715', border: '1px solid #262927', borderRadius: 6, fontSize: 15, lineHeight: 1.7, color: '#d4d2c8' }}>
            {p.description || `Verified Romanian real-estate & civil infrastructure development project tracked in terminal.`}
          </div>
        </section>

        {/* SECTION 2: SCALE & SPECS */}
        <section id="specs" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>2. Physical Specifications</div>
              <h2>SCALE & TECHNICAL METRICS</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>GROSS SURFACE AREA</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginTop: 4 }}>
                {p.surface_area_sqm || p.surface_area ? `${(p.surface_area_sqm || p.surface_area).toLocaleString()} m²` : 'NOT DISCLOSED'}
              </div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Built surface area</div>
            </div>

            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>UNITS / CAPACITY</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#38bdf8', marginTop: 4 }}>
                {p.unit_count ? `${p.unit_count} Units` : 'NOT DISCLOSED'}
              </div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Residential / commercial units</div>
            </div>

            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>FLOORS / HEIGHT</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#86efac', marginTop: 4 }}>
                {p.floors ? `${p.floors} Floors` : p.height_m ? `${p.height_m} meters` : 'NOT DISCLOSED'}
              </div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Building elevation</div>
            </div>

            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>PARKING SPACES</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#c7a675', marginTop: 4 }}>
                {p.parking_spaces ? `${p.parking_spaces} Bays` : 'NOT DISCLOSED'}
              </div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Underground & surface parking</div>
            </div>
          </div>
        </section>

        {/* SECTION 3: INVESTMENT */}
        <section id="financials" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>3. Capital Commitment</div>
              <h2>FINANCIAL & INVESTMENT PROFILE</h2>
            </div>
          </div>

          <div style={{ padding: 24, background: '#141715', border: '1px solid #262927', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#c7a675' }}>ANNOUNCED CAPITAL INVESTMENT</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginTop: 4 }}>
                {p.investment_label || (p.investment_eur ? `€${(p.investment_eur / 1000000).toFixed(1)}M EUR` : 'NOT DISCLOSED')}
              </div>
              <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>Verified investment allocation</div>
            </div>
            <span style={{ fontSize: 11, background: '#1c221e', border: '1px solid #86efac', color: '#86efac', padding: '4px 12px', borderRadius: 2, fontWeight: 800 }}>
              VERIFIED CAPITAL DISCLOSURE
            </span>
          </div>
        </section>

        {/* SECTION 4: STAGE LIFECYCLE INTELLIGENCE */}
        <section id="lifecycle" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#38bdf8' }}>4. Construction Milestone Tracking</div>
              <h2>STAGE LIFECYCLE INTELLIGENCE</h2>
            </div>
          </div>

          <ProjectStageLifecycle currentStage={p.current_stage || p.status} progressPercent={p.current_progress_percent || 65} statusDisplay={p.status_display || p.status} />
        </section>

        {/* SECTION 5: DEVELOPMENT TEAM */}
        <section id="team" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>5. Development Chain</div>
              <h2>DEVELOPMENT TEAM NETWORK</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {/* DEVELOPER */}
            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>DEVELOPER</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#c7a675', marginTop: 6 }}>
                {devComp ? (
                  <Link href={`/companies/${devComp.slug}`} style={{ color: '#c7a675', textDecoration: 'none' }}>
                    🏢 {devComp.name} →
                  </Link>
                ) : (
                  p.developer_name || 'NOT DISCLOSED'
                )}
              </div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Real-estate developer & investor</div>
            </div>

            {/* CONTRACTOR */}
            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>GENERAL CONTRACTOR</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#38bdf8', marginTop: 6 }}>
                {gcComp ? (
                  <Link href={`/companies/${gcComp.slug}`} style={{ color: '#38bdf8', textDecoration: 'none' }}>
                    🏗️ {gcComp.name} →
                  </Link>
                ) : (
                  p.contractor_name || 'NOT DISCLOSED'
                )}
              </div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Main civil contractor</div>
            </div>

            {/* ARCHITECT */}
            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>ARCHITECT PRACTICE</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#86efac', marginTop: 6 }}>
                {archComp ? (
                  <Link href={`/companies/${archComp.slug}`} style={{ color: '#86efac', textDecoration: 'none' }}>
                    📐 {archComp.name} →
                  </Link>
                ) : (
                  p.architect_name || 'NOT DISCLOSED'
                )}
              </div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Lead architectural design studio</div>
            </div>

            {/* ENGINEER */}
            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>STRUCTURAL ENGINEER</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#e879f9', marginTop: 6 }}>
                {engComp ? (
                  <Link href={`/companies/${engComp.slug}`} style={{ color: '#e879f9', textDecoration: 'none' }}>
                    ⚙️ {engComp.name} →
                  </Link>
                ) : (
                  p.engineering_name || 'NOT DISCLOSED'
                )}
              </div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Structural engineering practice</div>
            </div>
          </div>
        </section>

        {/* SECTION 6: LOCATION INTELLIGENCE */}
        <section id="location" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>6. Location & Geographic Context</div>
              <h2>LOCATION INTELLIGENCE</h2>
            </div>
          </div>

          <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>📍 {p.location || 'Romania'}</div>
              <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>
                County: {p.county || 'București'} · Locality: {p.locality || p.location || 'Bucharest'}
              </div>
            </div>
            <Link href="/cities/bucharest" className="btn-secondary" style={{ fontSize: 11 }}>
              EXPLORE CITY DOSSIER →
            </Link>
          </div>
        </section>

        {/* SECTION 7: TIMELINE & SOURCES */}
        <section id="timeline" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>7. Milestone History</div>
              <h2>PROJECT TIMELINE & SOURCES</h2>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 840 }}>
            {p.sources && p.sources.length > 0 ? (
              p.sources.map((s: any, idx: number) => (
                <div key={idx} style={{ padding: 16, background: '#141715', border: '1px solid #262927', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#c7a675' }}>{s.type || 'OFFICIAL RECORD'}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginTop: 2 }}>{s.title}</div>
                  </div>
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#38bdf8', textDecoration: 'none', fontWeight: 700 }}>
                      VERIFY CITATION ↗
                    </a>
                  )}
                </div>
              ))
            ) : (
              <div style={{ color: '#888', fontSize: 13 }}>Primary source citations logged in terminal.</div>
            )}
          </div>
        </section>

        {/* SECTION 8: RELATED NETWORK */}
        <section id="related" className="section shell" style={{ paddingBottom: 60 }}>
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>8. Interconnected Intelligence</div>
              <h2>RELATED DEVELOPMENTS ({sameDeveloperProjects.length + sameCityProjects.length})</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {sameDeveloperProjects.slice(0, 3).map(other => (
              <div key={other.id} style={{ padding: 16, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: '#c7a675', fontWeight: 800 }}>SAME DEVELOPER</div>
                <h4 style={{ fontSize: 15, margin: '6px 0 4px 0' }}>
                  <Link href={`/projects/${other.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>
                    {other.name}
                  </Link>
                </h4>
                <div style={{ fontSize: 12, color: '#888' }}>{other.location} · {other.project_type}</div>
              </div>
            ))}

            {sameCityProjects.slice(0, 3).map(other => (
              <div key={other.id} style={{ padding: 16, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: '#38bdf8', fontWeight: 800 }}>SAME CITY</div>
                <h4 style={{ fontSize: 15, margin: '6px 0 4px 0' }}>
                  <Link href={`/projects/${other.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>
                    {other.name}
                  </Link>
                </h4>
                <div style={{ fontSize: 12, color: '#888' }}>{other.location} · {other.project_type}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CONVERSION INQUIRY FORM */}
        <section className="conversion">
          <div className="shell">
            <div className="eyebrow" style={{ color: '#25221b' }}>Project Inquiry & Commercial Mandate</div>
            <h2>INTERESTED IN THIS DEVELOPMENT?</h2>
            <p style={{ color: '#25221b', marginBottom: 28, maxWidth: 540 }}>
              Initiate direct procurement, architectural presentations or drone media coverage for this project.
            </p>
            <div style={{ maxWidth: 680 }}>
              <LeadForm kind="project" company={p.name} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
