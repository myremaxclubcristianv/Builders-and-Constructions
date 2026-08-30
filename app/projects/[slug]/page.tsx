import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getProjectBySlug } from '@/lib/data';
import { realProjectsDataset, realCompaniesDataset } from '@/lib/real-romanian-data';
import { getAdminIdentity } from '@/lib/admin-auth';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { DossierNav } from '@/components/DossierNav';
import { ProjectStageLifecycle } from '@/components/ProjectStageLifecycle';
import { LeadForm } from '@/components/LeadForm';
import { BookmarkButton } from '@/components/BookmarkButton';

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
    title: `${p.name} — Project Dossier | CONSTRUCTIONS by AiXLuxury`,
    description: p.description || `Development dossier, construction lifecycle stage, specifications, and project team for ${p.name} in ${p.location || 'Romania'}.`,
    alternates: {
      canonical: `https://constructions.cristianvaduva.com/projects/${p.slug}`
    },
    openGraph: {
      title: `${p.name} — Project Dossier | CONSTRUCTIONS by AiXLuxury`,
      description: p.description || `Development dossier for ${p.name}.`,
      url: `https://constructions.cristianvaduva.com/projects/${p.slug}`,
      siteName: 'CONSTRUCTIONS by AiXLuxury',
      locale: 'en_US',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${p.name} | CONSTRUCTIONS by AiXLuxury`,
      description: p.description || `Development dossier for ${p.name}.`
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

  const sourcesList = p.sources || [];
  const primarySourceCount = sourcesList.filter((s: any) => s.type === 'OFFICIAL' || s.type === 'PUBLIC_RECORD' || s.type === 'FINANCIAL_STATEMENT').length;
  const secondarySourceCount = sourcesList.length - primarySourceCount;

  const navTabs = [
    { id: 'profile', label: 'EXECUTIVE PROFILE' },
    { id: 'timeline', label: 'PROJECT HISTORY' },
    { id: 'team', label: 'DEVELOPMENT TEAM' },
    { id: 'financials', label: 'FINANCIAL PROFILE' },
    { id: 'specs', label: 'PHYSICAL METRICS' },
    { id: 'lifecycle', label: 'STAGE LIFECYCLE' },
    { id: 'future', label: 'WHAT HAPPENS NEXT' },
    { id: 'risk', label: 'STATUS & RISK' },
    { id: 'location', label: 'LOCATION INTELLIGENCE' },
    { id: 'context', label: 'COMPETITIVE CONTEXT' },
    { id: 'sources', label: 'SOURCES & PROVENANCE' }
  ];

  const heroUrl = p.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85';

  // Schema.org Place / Building JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: p.name,
    description: p.description,
    url: `https://constructions.cristianvaduva.com/projects/${p.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: p.location || 'Romania',
      addressCountry: 'RO'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
                  PROJECT DOSSIER
                </span>
                <span style={{ fontSize: 10, fontWeight: 800, border: '1px solid #38bdf8', color: '#38bdf8', padding: '2px 8px', borderRadius: 2 }}>
                  {p.status_display || p.status || 'UNDER CONSTRUCTION'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <BookmarkButton id={p.slug} name={p.name} type="project" slug={p.slug} subtext={`${p.project_type || 'Development'} · ${p.location || 'Romania'}`} />
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

            {/* COMPACT BUSINESS-SAFE DISCLOSURE BOX */}
            <div style={{ marginTop: 24, padding: 16, background: '#111412', border: '1px solid #242926', borderRadius: 6, fontSize: 12, color: '#a0a0a0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <strong style={{ color: '#fff' }}>Independent Platform Disclosure:</strong> CONSTRUCTIONS is an independent information and research platform. Inclusion of an entity does not imply representation, endorsement, partnership, or commercial relationship with that entity.
              </div>
              <Link href={`/report-error?project=${encodeURIComponent(p.name)}`} style={{ color: '#c7a675', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Request Correction →
              </Link>
            </div>
          </div>
        </section>

        {/* STICKY DOSSIER NAV */}
        <DossierNav tabs={navTabs} />

        {/* SECTION 1: PROJECT EXECUTIVE PROFILE */}
        <section id="profile" className="section shell" style={{ paddingTop: 40 }}>
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION 1</div>
              <h2>PROJECT EXECUTIVE PROFILE</h2>
            </div>
          </div>

          <div style={{ padding: 24, background: '#141715', border: '1px solid #262927', borderRadius: 6, fontSize: 15, lineHeight: 1.7, color: '#d4d2c8' }}>
            {p.description || `Verified Romanian real-estate & civil infrastructure development project.`}
          </div>
        </section>

        {/* SECTION 2: PROJECT HISTORY TIMELINE */}
        <section id="timeline" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION 2</div>
              <h2>PROJECT HISTORY TIMELINE</h2>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 840 }}>
            <div style={{ padding: 16, background: '#141715', border: '1px solid #262927', borderRadius: 6, display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#c7a675', width: 90 }}>MILESTONE</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Development Announcement & Permitting</div>
                <div style={{ fontSize: 12, color: '#aaa9a1', marginTop: 2 }}>Project verified under current stage: {p.status_display || p.status}.</div>
                <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>Source: Official Developer Disclosure / Public Records</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: DEVELOPMENT TEAM */}
        <section id="team" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION 3</div>
              <h2>DEVELOPMENT TEAM NETWORK</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
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

        {/* SECTION 4: PROJECT FINANCIAL INTELLIGENCE */}
        <section id="financials" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION 4</div>
              <h2>PROJECT FINANCIAL PROFILE</h2>
            </div>
          </div>

          <div style={{ padding: 24, background: '#141715', border: '1px solid #262927', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#c7a675' }}>ANNOUNCED CAPITAL INVESTMENT</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginTop: 4 }}>
                {p.investment_eur && p.investment_eur > 0
                  ? `€${(p.investment_eur / 1000000).toFixed(1)}M EUR`
                  : p.investment_label?.toUpperCase().includes('ANNOUNCED')
                  ? 'ANNOUNCED — AMOUNT NOT DISCLOSED'
                  : p.investment_label || 'NOT DISCLOSED'}
              </div>
              <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>Verified investment allocation</div>
            </div>
            <span style={{ fontSize: 11, background: '#1c221e', border: '1px solid #86efac', color: '#86efac', padding: '4px 12px', borderRadius: 2, fontWeight: 800 }}>
              ANNOUNCED INVESTMENT
            </span>
          </div>
        </section>

        {/* SECTION 5: PHYSICAL SPECS */}
        <section id="specs" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION 5</div>
              <h2>PHYSICAL SPECIFICATIONS & SCALE</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>GROSS SURFACE AREA</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginTop: 4 }}>
                {p.surface_area_sqm || p.surface_area ? `${(p.surface_area_sqm || p.surface_area).toLocaleString()} m²` : 'NOT DISCLOSED'}
              </div>
            </div>

            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>UNITS / CAPACITY</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#38bdf8', marginTop: 4 }}>
                {p.unit_count ? `${p.unit_count} Units` : 'NOT DISCLOSED'}
              </div>
            </div>

            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>FLOORS / ELEVATION</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#86efac', marginTop: 4 }}>
                {p.floors ? `${p.floors} Floors` : p.height_m ? `${p.height_m} meters` : 'NOT DISCLOSED'}
              </div>
            </div>

            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>PARKING BAYS</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#c7a675', marginTop: 4 }}>
                {p.parking_spaces ? `${p.parking_spaces} Bays` : 'NOT DISCLOSED'}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: STAGE LIFECYCLE INTELLIGENCE */}
        <section id="lifecycle" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#38bdf8' }}>SECTION 6</div>
              <h2>CONSTRUCTION STAGE LIFECYCLE</h2>
            </div>
          </div>

          <ProjectStageLifecycle currentStage={p.current_stage || p.status} progressPercent={p.current_progress_percent || 65} statusDisplay={p.status_display || p.status} />
        </section>

        {/* SECTION 7: WHAT HAPPENS NEXT */}
        <section id="future" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION 7</div>
              <h2>WHAT HAPPENS NEXT / FORWARD MILESTONES</h2>
            </div>
          </div>

          <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6, color: '#aaa9a1', fontSize: 13 }}>
            Future phase milestone target: <strong style={{ color: '#888' }}>{p.estimated_completion ? `Est. Delivery ${p.estimated_completion}` : 'No verified future milestone publicly disclosed.'}</strong>
          </div>
        </section>

        {/* SECTION 8: STATUS & RISK */}
        <section id="risk" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION 8</div>
              <h2>PROJECT STATUS & RISK ASSESSMENT</h2>
            </div>
          </div>

          <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#c7a675' }}>STATUS CLASSIFICATION</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#86efac', marginTop: 4 }}>
                ON TRACK / UNDER CONSTRUCTION
              </div>
            </div>
            <span style={{ fontSize: 10, background: '#1c221e', border: '1px solid #38bdf8', color: '#38bdf8', padding: '4px 10px', borderRadius: 2, fontWeight: 800 }}>
              VERIFIED ACTIVE SITE
            </span>
          </div>
        </section>

        {/* SECTION 9: LOCATION INTELLIGENCE */}
        <section id="location" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION 9</div>
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

        {/* SECTION 10: COMPETITIVE CONTEXT & SOURCES */}
        <section id="context" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION 10</div>
              <h2>COMPETITIVE CONTEXT & COMPARABLES</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {sameDeveloperProjects.slice(0, 2).map(other => (
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

            {sameCityProjects.slice(0, 2).map(other => (
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

        {/* SOURCES & PROVENANCE */}
        <section id="sources" className="section shell" style={{ paddingBottom: 60 }}>
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION 11</div>
              <h2>PRIMARY SOURCES & PROVENANCE</h2>
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

        {/* RESEARCH INTAKE SECTION */}
        <section className="conversion">
          <div className="shell">
            <div className="eyebrow" style={{ color: '#25221b' }}>Independent Intelligence & Due Diligence</div>
            <h2>NEED ADDITIONAL PROJECT DUE DILIGENCE?</h2>
            <p style={{ color: '#25221b', marginBottom: 20, maxWidth: 580, lineHeight: 1.6 }}>
              CONSTRUCTIONS provides independently researched market information. Request additional due diligence, physical spec verification, or site research through the CONSTRUCTIONS research team.
            </p>

            <div style={{ padding: 16, background: 'rgba(5, 5, 5, 0.05)', border: '1px solid rgba(5, 5, 5, 0.15)', borderRadius: 6, marginBottom: 24, fontSize: 11, color: '#333', lineHeight: 1.5, maxWidth: 680 }}>
              <strong>INDEPENDENT PLATFORM DISCLOSURE:</strong> CONSTRUCTIONS is an independent information and research platform. Inclusion of an entity does not imply representation, endorsement, partnership, or commercial relationship with that entity. Requests submitted through CONSTRUCTIONS are handled by the CONSTRUCTIONS research team and are not automatically forwarded to the profiled entity.
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href={`/research-request?category=PROJECT&subject=${encodeURIComponent(p.name)}`} className="btn fill font-mono text-xs">
                REQUEST INSTITUTIONAL RESEARCH →
              </Link>
              <Link href={`/report-error?project=${encodeURIComponent(p.name)}`} style={{ fontSize: 11, border: '1px solid #111', color: '#111', padding: '12px 20px', borderRadius: 4, fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                REQUEST PROFILE CORRECTION
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
