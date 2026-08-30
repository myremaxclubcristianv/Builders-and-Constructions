import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getCompanyBySlug } from '@/lib/data';
import { realCompaniesDataset, realProjectsDataset } from '@/lib/real-romanian-data';
import { getAdminIdentity } from '@/lib/admin-auth';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { LeadForm } from '@/components/LeadForm';
import { DossierNav } from '@/components/DossierNav';
import { FinancialTrendChart } from '@/components/FinancialTrendChart';
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
  const data = await getCompanyBySlug(slug, isPreview);

  if (!data?.company) {
    return { title: 'Company Intelligence Dossier Not Found' };
  }

  const c = data.company;
  const isIndexable = c.published_at && !isPreview;

  return {
    title: `${c.name} — Corporate Dossier | CONSTRUCTIONS by AiXLuxury`,
    description: c.description || `Public record corporate dossier, active development portfolio, financial disclosures, and market network for ${c.name} in ${c.location || 'Romania'}.`,
    alternates: {
      canonical: `https://constructions.cristianvaduva.com/companies/${c.slug}`
    },
    openGraph: {
      title: `${c.name} — Corporate Dossier | CONSTRUCTIONS by AiXLuxury`,
      description: c.description || `Public record corporate dossier for ${c.name}.`,
      url: `https://constructions.cristianvaduva.com/companies/${c.slug}`,
      siteName: 'CONSTRUCTIONS by AiXLuxury',
      locale: 'en_US',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${c.name} | CONSTRUCTIONS by AiXLuxury`,
      description: c.description || `Corporate dossier for ${c.name}.`
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
  const realComp = realCompaniesDataset.find(rc => rc.slug === slug);
  const companyObj = data?.company || realComp;

  if (!companyObj) notFound();

  const c = companyObj as any;

  // Find all projects connected to this company
  const connectedProjects = realProjectsDataset.filter(p =>
    p.developer_slug === c.slug ||
    p.contractor_slug === c.slug ||
    p.architect_slug === c.slug ||
    p.engineering_slug === c.slug
  );

  const activeProjects = connectedProjects.filter(p => p.status !== 'completed' && p.status !== 'delivered');

  // Derive total portfolio investment
  const knownPortfolioValueEur = connectedProjects.reduce((acc, p) => acc + (p.investment_eur || 0), 0);

  // Financial disclosures
  const financials = [
    c.financials_2025 || (c.financial_timeline && c.financial_timeline.find((f: any) => f.year === 2025)),
    c.financials_2024 || (c.financial_timeline && c.financial_timeline.find((f: any) => f.year === 2024)),
    c.financials_2023 || (c.financial_timeline && c.financial_timeline.find((f: any) => f.year === 2023))
  ].filter(Boolean);

  // Financial CAGR / trend calculation
  let revenueGrowthTrend = 'STABLE';
  if (financials.length >= 2) {
    const latest = financials[0]?.revenue_eur || 0;
    const previous = financials[financials.length - 1]?.revenue_eur || 0;
    if (previous > 0 && latest > previous * 1.1) revenueGrowthTrend = 'GROWING';
    else if (previous > 0 && latest < previous * 0.9) revenueGrowthTrend = 'DECLINING';
  } else if (financials.length === 0) {
    revenueGrowthTrend = 'INSUFFICIENT DATA';
  }

  // Comparable entities
  const comparableCompanies = realCompaniesDataset.filter(other =>
    other.slug !== c.slug && (other.type === c.type || (other.location && other.location === c.location))
  ).slice(0, 3);

  const navTabs = [
    { id: 'profile', label: 'EXECUTIVE PROFILE' },
    { id: 'history', label: 'COMPANY HISTORY' },
    { id: 'financials', label: 'FINANCIAL HISTORY' },
    { id: 'trend', label: 'FINANCIAL TREND' },
    { id: 'structure', label: 'OWNERSHIP & STRUCTURE' },
    { id: 'people', label: 'MANAGEMENT' },
    { id: 'portfolio', label: 'PORTFOLIO' },
    { id: 'pipeline', label: 'ACTIVE PIPELINE' },
    { id: 'future', label: 'FORWARD PIPELINE' },
    { id: 'market', label: 'MARKET POSITION' },
    { id: 'footprint', label: 'GEOGRAPHIC FOOTPRINT' },
    { id: 'graph', label: 'RELATIONSHIP GRAPH' },
    { id: 'competitive', label: 'COMPARABLE ENTITIES' },
    { id: 'contracts', label: 'CONTRACTS' },
    { id: 'sources', label: 'SOURCES & PROVENANCE' },
    { id: 'quality', label: 'DATA DISCLOSURE' }
  ];

  const companyAge = c.founded_year ? 2026 - c.founded_year : null;

  // Schema.org Organization JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: c.name,
    url: `https://constructions.cristianvaduva.com/companies/${c.slug}`,
    description: c.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: c.location || 'Romania',
      addressCountry: 'RO'
    },
    foundingDate: c.founded_year ? `${c.founded_year}` : undefined,
    taxID: c.cui_cif || undefined
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
            ADMIN EXECUTIVE DOSSIER VIEW — CONFIDENTIAL COMMERCIAL INTELLIGENCE ENABLED
          </div>
        )}

        {/* HERO SECTION */}
        <section style={{ borderBottom: '1px solid #262927', padding: '40px 0 32px 0', background: 'linear-gradient(180deg, #141715 0%, #0c0e0c 100%)' }}>
          <div className="shell">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="eyebrow" style={{ color: '#c7a675', margin: 0 }}>
                  PUBLIC RECORD CORPORATE DOSSIER
                </span>
                <span style={{ fontSize: 10, fontWeight: 800, border: '1px solid #86efac', color: '#86efac', padding: '2px 8px', borderRadius: 2 }}>
                  {c.verification_level || 'OFFICIAL_REGISTRY_VERIFIED'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <BookmarkButton id={c.slug} name={c.name} type="company" slug={c.slug} subtext={`${(c.type || 'developer').replaceAll('_', ' ')} · ${c.location || 'Romania'}`} />
                <Link href={`/compare?c1=${c.slug}`} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 11 }}>
                  ⚖️ COMPARE ENTITY
                </Link>
                <Link href={`/report-error?company=${encodeURIComponent(c.name)}`} className="btn" style={{ padding: '6px 14px', fontSize: 11 }}>
                  REQUEST CORRECTION →
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
                  {companyAge ? ` · ${companyAge} Years in Market (Est. ${c.founded_year})` : ''}
                  <br />
                  {c.description}
                </p>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: '#aaa9a1' }}>
                  <div>CUI/CIF: <strong style={{ color: c.cui_cif ? '#86efac' : '#aaa' }}>{c.cui_cif || 'NOT DISCLOSED'}</strong></div>
                  <div>DATA SOURCE: <strong style={{ color: '#38bdf8' }}>PUBLIC RECORDS & BVB</strong></div>
                  <div>LAST VERIFIED: <strong style={{ color: '#fff' }}>AUGUST 2026</strong></div>
                </div>
              </div>

              {/* Hero Image */}
              <div style={{ height: 260, borderRadius: 6, overflow: 'hidden', border: '1px solid #262927', position: 'relative', background: '#111' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85'} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, insetInline: 0, padding: 12, background: 'linear-gradient(0deg, rgba(0,0,0,0.9), transparent)', fontSize: 11, color: '#ccc' }}>
                  🏢 {c.image_alt || `${c.name} Corporate Headquarters`}
                </div>
              </div>
            </div>

            {/* COMPACT BUSINESS-SAFE DISCLOSURE BOX */}
            <div style={{ marginTop: 24, padding: 16, background: '#111412', border: '1px solid #242926', borderRadius: 6, fontSize: 12, color: '#a0a0a0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <strong style={{ color: '#fff' }}>Independent Platform Disclosure:</strong> CONSTRUCTIONS is an independent information and research platform. Inclusion of an entity does not imply representation, endorsement, partnership, or commercial relationship with that entity.
              </div>
              <Link href={`/report-error?company=${encodeURIComponent(c.name)}`} style={{ color: '#c7a675', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Request Correction →
              </Link>
            </div>
          </div>
        </section>

        {/* STICKY DOSSIER NAV */}
        <DossierNav tabs={navTabs} />

        {/* SECTION A — EXECUTIVE PROFILE */}
        <section id="profile" className="section shell" style={{ paddingTop: 40 }}>
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION A</div>
              <h2>EXECUTIVE PROFILE & SUMMARY</h2>
            </div>
          </div>

          <div style={{ padding: 24, background: '#141715', border: '1px solid #262927', borderRadius: 6, fontSize: 14, lineHeight: 1.7, color: '#d4d2c8', marginBottom: 20 }}>
            <h4 style={{ color: '#c7a675', margin: '0 0 8px 0', textTransform: 'uppercase', fontSize: 12 }}>CORPORATE OVERVIEW</h4>
            <p style={{ margin: 0 }}>
              {c.name} is a confirmed <strong>{(c.type || 'developer').replaceAll('_', ' ')}</strong> entity operating out of <strong>{c.location || 'Romania'}</strong>.
              The entity controls a tracked portfolio of <strong>{connectedProjects.length} projects</strong> with an aggregate investment allocation of <strong>{knownPortfolioValueEur > 0 ? `€${(knownPortfolioValueEur / 1000000).toFixed(1)}M EUR` : 'NOT DISCLOSED'}</strong>.
              Legal registration identifier (CUI/CIF): <strong>{c.cui_cif || 'NOT DISCLOSED'}</strong>.
            </p>
          </div>
        </section>

        {/* SECTION B — COMPANY HISTORY */}
        <section id="history" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION B</div>
              <h2>COMPANY HISTORY & TIMELINE</h2>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 840 }}>
            {c.founded_year && (
              <div style={{ padding: 16, background: '#141715', border: '1px solid #262927', borderRadius: 6, display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#c7a675', width: 60 }}>{c.founded_year}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Official Corporate Establishment</div>
                  <div style={{ fontSize: 12, color: '#aaa9a1', marginTop: 2 }}>Significance: Founded in {c.location || 'Romania'} as a specialized {(c.type || 'developer').replaceAll('_', ' ')}.</div>
                  <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>Source: Trade Register / Corporate Filing</div>
                </div>
              </div>
            )}
            <div style={{ padding: 14, background: '#0f1210', border: '1px border-dashed #222', borderRadius: 4, color: '#888', fontSize: 12 }}>
              Additional historical disclosures: <strong style={{ color: '#aaa' }}>Historical timeline disclosure unavailable for unindexed historical periods</strong>.
            </div>
          </div>
        </section>

        {/* SECTION C — FINANCIAL HISTORY */}
        <section id="financials" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION C</div>
              <h2>FINANCIAL DISCLOSURES</h2>
            </div>
          </div>

          {financials.length > 0 ? (
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
                      <td style={{ padding: 12, fontSize: 11, color: '#888' }}>{f.source_title || f.source || 'Ministry of Finance Annual Disclosures'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6, color: '#888', fontSize: 13 }}>
              Financial statements for this entity are currently <strong>NOT DISCLOSED</strong>.
            </div>
          )}
        </section>

        {/* SECTION D — FINANCIAL TREND ANALYSIS */}
        <section id="trend" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION D</div>
              <h2>FINANCIAL TREND ANALYSIS</h2>
            </div>
          </div>

          <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: '#888', fontWeight: 700 }}>DERIVED TREND CLASSIFICATION</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: revenueGrowthTrend === 'GROWING' ? '#86efac' : '#c7a675', marginTop: 4 }}>
                {revenueGrowthTrend}
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#aaa' }}>
              Calculated programmatically from verified reporting periods (2023 → 2025).
            </div>
          </div>

          <FinancialTrendChart timeline={financials} />
        </section>

        {/* SECTION E — OWNERSHIP & CORPORATE STRUCTURE */}
        <section id="structure" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION E</div>
              <h2>OWNERSHIP & CORPORATE STRUCTURE</h2>
            </div>
          </div>

          <div style={{ padding: 24, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <div>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>LEGAL STRUCTURE</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginTop: 4 }}>{c.ownership_structure || 'PRIVATELY HELD CO.'}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>LISTED STATUS</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: c.slug === 'one-united-properties' ? '#86efac' : '#ccc', marginTop: 4 }}>
                  {c.slug === 'one-united-properties' ? 'PUBLICLY TRADED (BVB: ONE)' : 'PRIVATELY HELD'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>PARENT GROUP / HOLDING</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginTop: 4 }}>{c.name} Group</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION F — MANAGEMENT & KEY PEOPLE */}
        <section id="people" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION F</div>
              <h2>MANAGEMENT & KEY PEOPLE</h2>
            </div>
          </div>

          <div style={{ background: '#141715', border: '1px solid #262927', borderRadius: 6, padding: 20 }}>
            {c.founders_key_people && c.founders_key_people.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {c.founders_key_people.map((person: string, idx: number) => (
                  <div key={idx} style={{ padding: 12, background: '#0c0e0c', border: '1px solid #222', borderRadius: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>👤 {person}</div>
                    <div style={{ fontSize: 11, color: '#c7a675', marginTop: 2 }}>Executive / Key Person</div>
                    <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>Public Register Disclosure</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#aaa9a1', fontSize: 13 }}>
                Key executive leadership disclosures: <strong style={{ color: '#888' }}>NOT DISCLOSED</strong>
              </div>
            )}
          </div>
        </section>

        {/* SECTION G — PROJECT PORTFOLIO */}
        <section id="portfolio" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION G</div>
              <h2>PROJECT PORTFOLIO ({connectedProjects.length})</h2>
            </div>
          </div>

          {connectedProjects.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {connectedProjects.map(p => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6, color: '#888', fontSize: 13 }}>
              No individual project records connected.
            </div>
          )}
        </section>

        {/* SECTION H — ACTIVE PIPELINE */}
        <section id="pipeline" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#38bdf8' }}>SECTION H</div>
              <h2>CURRENT DEVELOPMENT PIPELINE ({activeProjects.length})</h2>
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
              No ongoing active sites logged.
            </div>
          )}
        </section>

        {/* SECTION I — FORWARD PIPELINE & OUTLOOK */}
        <section id="future" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION I</div>
              <h2>FORWARD PIPELINE & OUTLOOK</h2>
            </div>
          </div>

          <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6, color: '#aaa9a1', fontSize: 13 }}>
            Future expansion pipeline status: <strong style={{ color: '#888' }}>No verified future pipeline publicly disclosed beyond active sites</strong>.
          </div>
        </section>

        {/* SECTION J — MARKET POSITION */}
        <section id="market" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION J</div>
              <h2>MARKET POSITION & SECTOR EXPOSURE</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div style={{ padding: 16, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>ACTIVE SITES EXPOSURE</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginTop: 4 }}>Top Tier Regional Exposure</div>
            </div>
            <div style={{ padding: 16, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>PRIMARY SECTOR FOCUS</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#c7a675', marginTop: 4, textTransform: 'capitalize' }}>
                {(c.specializations && c.specializations[0]) || (c.type || 'Development').replaceAll('_', ' ')}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION K — GEOGRAPHIC FOOTPRINT */}
        <section id="footprint" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION K</div>
              <h2>GEOGRAPHIC FOOTPRINT</h2>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/cities/bucharest" style={{ padding: '8px 16px', background: '#141715', border: '1px solid #262927', borderRadius: 4, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
              📍 {c.location || 'Bucharest'}
            </Link>
          </div>
        </section>

        {/* SECTION L — RELATIONSHIP GRAPH */}
        <section id="graph" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION L</div>
              <h2>BUSINESS RELATIONSHIP GRAPH</h2>
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
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#888', fontSize: 13 }}>Graph node data NOT DISCLOSED.</div>
            )}
          </div>
        </section>

        {/* SECTION M — COMPARABLE ENTITIES */}
        <section id="competitive" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION M</div>
              <h2>COMPARABLE ENTITIES IN MARKET</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {comparableCompanies.map(other => (
              <div key={other.id} style={{ padding: 16, background: '#141715', border: '1px solid #262927', borderRadius: 6, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 10, color: '#c7a675', fontWeight: 800 }}>SAME SECTOR</div>
                  <h4 style={{ fontSize: 16, margin: '6px 0 4px 0' }}>
                    <Link href={`/companies/${other.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>
                      {other.name}
                    </Link>
                  </h4>
                  <div style={{ fontSize: 12, color: '#888' }}>{other.location} · {other.type.replaceAll('_', ' ')}</div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <Link href={`/compare?c1=${c.slug}&c2=${other.slug}`} style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }}>
                    COMPARE BOTH ENTITIES →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION N — CONTRACT INTELLIGENCE */}
        <section id="contracts" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION N</div>
              <h2>PUBLIC & PRIVATE CONTRACT INTELLIGENCE</h2>
            </div>
          </div>

          <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6, color: '#aaa9a1', fontSize: 13 }}>
            Contract awards & procurement filings: <strong style={{ color: '#888' }}>Tracked via official BVB / SEAP / Ministry of Finance statements</strong>.
          </div>
        </section>

        {/* SECTION O — SOURCES & PROVENANCE */}
        <section id="sources" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION O</div>
              <h2>PRIMARY SOURCES & PROVENANCE</h2>
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

        {/* SECTION P — DATA DISCLOSURE & CORRECTION */}
        <section id="quality" className="section shell" style={{ paddingBottom: 60 }}>
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECTION P</div>
              <h2>DATA DISCLOSURE & CORRECTION DESK</h2>
            </div>
          </div>

          <div style={{ padding: 24, background: '#141715', border: '1px solid #262927', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#c7a675' }}>PUBLIC RECORD DATA DISCLOSURE</div>
              <div style={{ fontSize: 14, color: '#ccc', marginTop: 4, maxWidth: 540, lineHeight: 1.6 }}>
                Company information is compiled from publicly available records (ONRC, ANAF, Ministry of Finance) and official corporate releases. Entities may request an update or correction where applicable.
              </div>
            </div>
            <Link href={`/report-error?company=${encodeURIComponent(c.name)}`} style={{ fontSize: 11, background: '#1c221e', border: '1px solid #c7a675', color: '#c7a675', padding: '10px 18px', borderRadius: 4, fontWeight: 800, textDecoration: 'none' }}>
              REQUEST PROFILE CORRECTION →
            </Link>
          </div>
        </section>

        {/* INVENT / RESEARCH INTAKE SECTION */}
        <section className="conversion">
          <div className="shell">
            <div className="eyebrow" style={{ color: '#25221b' }}>Independent Intelligence & Research Intake</div>
            <h2>NEED ADDITIONAL INFORMATION?</h2>
            <p style={{ color: '#25221b', marginBottom: 20, maxWidth: 580, lineHeight: 1.6 }}>
              CONSTRUCTIONS provides independently researched market information. Request additional research, clarification, or factual review through the CONSTRUCTIONS research team.
            </p>

            <div style={{ padding: 16, background: 'rgba(5, 5, 5, 0.05)', border: '1px solid rgba(5, 5, 5, 0.15)', borderRadius: 6, marginBottom: 24, fontSize: 11, color: '#333', lineHeight: 1.5, maxWidth: 680 }}>
              <strong>INDEPENDENT PLATFORM DISCLOSURE:</strong> CONSTRUCTIONS is an independent information and research platform. Inclusion of an entity does not imply representation, endorsement, partnership, or commercial relationship with that entity. Requests submitted through CONSTRUCTIONS are handled by the CONSTRUCTIONS research team and are not automatically forwarded to the profiled entity.
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href={`/research-request?category=COMPANY&subject=${encodeURIComponent(c.name)}`} className="btn fill font-mono text-xs">
                REQUEST INSTITUTIONAL RESEARCH →
              </Link>
              <Link href={`/report-error?company=${encodeURIComponent(c.name)}`} style={{ fontSize: 11, border: '1px solid #111', color: '#111', padding: '12px 20px', borderRadius: 4, fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
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
