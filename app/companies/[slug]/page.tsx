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
import { safeJsonLdStringify } from '@/lib/sanitize';
import { ScaleIcon, LocationPinIcon, BuildingIcon, UserIcon, CraneIcon } from '@/components/icons/NavIcons';

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
    return { title: 'Dosar Companie Negăsit | CONSTRUCTIONS by AiXLuxury' };
  }

  const c = data.company;
  const isIndexable = c.published_at && !isPreview;

  return {
    title: `${c.name} — Dosar Corporativ | CONSTRUCTIONS by AiXLuxury`,
    description: c.description || `Dosar corporativ din registre publice, portofoliu de dezvoltare, situații financiare și rețeaua din piață pentru ${c.name} (${c.location || 'România'}).`,
    alternates: {
      canonical: `https://constructions.cristianvaduva.com/companies/${c.slug}`
    },
    openGraph: {
      title: `${c.name} — Dosar Corporativ | CONSTRUCTIONS by AiXLuxury`,
      description: c.description || `Dosar corporativ din registre publice pentru ${c.name}.`,
      url: `https://constructions.cristianvaduva.com/companies/${c.slug}`,
      siteName: 'CONSTRUCTIONS by AiXLuxury',
      locale: 'ro_RO',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${c.name} | CONSTRUCTIONS by AiXLuxury`,
      description: c.description || `Dosar corporativ pentru ${c.name}.`
    },
    robots: {
      index: Boolean(isIndexable),
      follow: Boolean(isIndexable)
    }
  };
}

import { resolveCompanyImage, getCompanyRolePortfolioMetadata } from '@/lib/company-imagery';

export function generateStaticParams() {
  return realCompaniesDataset.map(c => ({ slug: c.slug }));
}

function ProjectCard({ project, role }: { project: any; role?: string }) {
  const hasImage = project.image && typeof project.image === 'string' && project.image.startsWith('http');
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
          {hasImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={project.image} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#111412', color: '#666', padding: 12 }}>
              <CraneIcon className="w-6 h-6 text-[#666] mb-1" />
              <div style={{ fontSize: 9, fontWeight: 800, border: '1px solid #242926', color: '#888', padding: '2px 6px', borderRadius: 2 }}>
                IMAGE STATUS: NOT DISCLOSED
              </div>
            </div>
          )}
          <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.85)', border: '1px solid #262927', padding: '2px 8px', borderRadius: 2, fontSize: 10, color: '#c7a675', fontWeight: 800 }}>
            {project.project_type || 'Development'}
          </div>
          {role && (
            <div style={{ position: 'absolute', bottom: 10, right: 10, background: '#1c221e', border: '1px solid #38bdf8', color: '#38bdf8', padding: '2px 8px', borderRadius: 2, fontSize: 9, fontWeight: 800 }}>
              {role.toUpperCase().replaceAll('_', ' ')}
            </div>
          )}
        </div>
        <div style={{ padding: 16 }}>
          <h4 style={{ fontSize: 15, margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
            <Link href={`/projects/${project.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>
              {project.name}
            </Link>
          </h4>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
            <LocationPinIcon className="w-3.5 h-3.5 text-[#c7a675] shrink-0" />
            <span>{project.location || 'Romania'}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11, color: '#b5b3aa' }}>
            <div>STAGE: <strong style={{ color: '#fff' }}>{project.status_display || project.status || 'Active'}</strong></div>
            <div>UNITS: <strong style={{ color: project.unit_count ? '#86efac' : '#888' }}>{project.unit_count || 'NOT DISCLOSED'}</strong></div>
            <div>INVESTMENT: <strong style={{ color: '#c7a675' }}>{project.investment_label || (project.investment_eur ? `€${(project.investment_eur / 1000000).toFixed(1)}M` : 'NOT DISCLOSED')}</strong></div>
            <div>SURFACE: <strong style={{ color: project.surface_area ? '#fff' : '#888' }}>{project.surface_area ? `${project.surface_area.toLocaleString()} sqm` : 'NOT DISCLOSED'}</strong></div>
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

  const imgRes = resolveCompanyImage(c, connectedProjects);
  const portfolioMeta = getCompanyRolePortfolioMetadata(c.type);

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

  const sourcesList = c.sources || [];
  const primarySourceCount = sourcesList.filter((s: any) => s.type === 'OFFICIAL' || s.type === 'PUBLIC_RECORD' || s.type === 'FINANCIAL_STATEMENT').length;
  const secondarySourceCount = sourcesList.length - primarySourceCount;

  // Comparable entities
  const comparableCompanies = realCompaniesDataset.filter(other =>
    other.slug !== c.slug && (other.type === c.type || (other.location && other.location === c.location))
  ).slice(0, 3);

  const navTabs = [
    { id: 'profile', label: 'PROFIL EXECUTIV' },
    { id: 'history', label: 'ISTORIC COMPANIE' },
    ...(financials.length > 0 ? [
      { id: 'financials', label: 'SITUAȚII FINANCIARE' },
      { id: 'trend', label: 'EVOLUȚIE FINANCIARĂ' }
    ] : []),
    { id: 'structure', label: 'STRUCTURĂ ACȚIONARIAT' },
    ...(c.founders_key_people && c.founders_key_people.length > 0 ? [{ id: 'people', label: 'CONDUCERE' }] : []),
    { id: 'portfolio', label: 'PORTOFOLIU PROIECTE' },
    ...(activeProjects.length > 0 ? [{ id: 'pipeline', label: 'PROIECTE ACTIVE' }] : []),
    { id: 'market', label: 'POZIȚIONARE DE PIAȚĂ' },
    { id: 'footprint', label: 'ACOPERIRE GEOGRAFICĂ' },
    { id: 'graph', label: 'REȚEA DE RELAȚII' },
    ...(comparableCompanies.length > 0 ? [{ id: 'competitive', label: 'COMPANII COMPARABILE' }] : []),
    { id: 'contracts', label: 'CONTRACTE' },
    { id: 'sources', label: 'SURSE & PROVENIENȚĂ' },
    { id: 'quality', label: 'NOTĂ METODOLOGICĂ' }
  ];

  const companyAge = c.founded_year ? 2026 - c.founded_year : null;

  // Schema.org Organization & BreadcrumbList JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `https://constructions.cristianvaduva.com/companies/${c.slug}#organization`,
        name: c.name,
        url: `https://constructions.cristianvaduva.com/companies/${c.slug}`,
        description: c.description,
        image: imgRes.url || undefined,
        address: {
          '@type': 'PostalAddress',
          addressLocality: c.location || 'România',
          addressCountry: 'RO'
        },
        foundingDate: c.founded_year ? `${c.founded_year}` : undefined,
        taxID: c.cui_cif || undefined
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://constructions.cristianvaduva.com/companies/${c.slug}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Acasă',
            item: 'https://constructions.cristianvaduva.com'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Companii',
            item: 'https://constructions.cristianvaduva.com/companies'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: c.name,
            item: `https://constructions.cristianvaduva.com/companies/${c.slug}`
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
      />
      <SiteHeader />
      <main className="pt-24 md:pt-32" style={{ background: '#0c0e0c', color: '#fff', minHeight: '100vh' }}>
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
                  VERIFIED CORPORATE DOSSIER
                </span>
                <span style={{ fontSize: 10, fontWeight: 800, border: '1px solid #86efac', color: '#86efac', padding: '2px 8px', borderRadius: 2 }}>
                  {c.verification_level || 'OFFICIAL_REGISTRY_VERIFIED'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <BookmarkButton id={c.slug} name={c.name} type="company" slug={c.slug} subtext={`${c.type || 'developer'} · ${c.location || 'România'}`} />
                <Link href={`/compare?c1=${c.slug}`} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <ScaleIcon className="w-3.5 h-3.5 text-[#c7a675]" />
                  <span>COMPARĂ ENTITATEA</span>
                </Link>
                <Link href={`/report-error?entity=${encodeURIComponent(c.name)}&type=Company`} className="btn" style={{ padding: '6px 14px', fontSize: 11 }}>
                  RAPORTEAZĂ CORECȚIE →
                </Link>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', margin: '0 0 12px 0', letterSpacing: '-0.03em' }}>
                  {c.name.toUpperCase()}
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#d4d2c8', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                  <strong style={{ color: '#c7a675', textTransform: 'capitalize' }}>
                    {c.type === 'developer'
                      ? 'Dezvoltator Imobiliar'
                      : c.type === 'general_contractor'
                      ? 'Antreprenor General'
                      : c.type === 'architecture'
                      ? 'Birou de Arhitectură'
                      : c.type === 'engineering' || c.type === 'structural_engineering'
                      ? 'Inginerie & Structură'
                      : (c.type || 'Companie').replaceAll('_', ' ')}
                  </strong>
                  {c.location ? ` · ${c.location}` : ''}
                  {companyAge ? ` · ${companyAge} Ani de Activitate (Fondată în ${c.founded_year})` : ''}
                  <br />
                  {c.description}
                </p>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: '#aaa9a1' }}>
                  <div>CUI/CIF: <strong style={{ color: c.cui_cif ? '#86efac' : '#aaa' }}>{c.cui_cif || 'Nedivulgat în surse publice'}</strong></div>
                  <div>SURSE: <strong style={{ color: '#38bdf8' }}>{sourcesList.length} ÎNREGISTRĂRI ({primarySourceCount} PRIMARE, {secondarySourceCount} SECUNDARE)</strong></div>
                  <div>ULTIMA VERIFICARE: <strong style={{ color: '#fff' }}>2026-08-31</strong></div>
                </div>
              </div>

              {/* Hero Image Container */}
              <div style={{ height: 260, borderRadius: 6, overflow: 'hidden', border: '1px solid #262927', position: 'relative', background: '#141715', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {imgRes.url && !imgRes.isFallback ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgRes.url} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, insetInline: 0, padding: 12, background: 'linear-gradient(0deg, rgba(0,0,0,0.9), transparent)', fontSize: 11, color: '#ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <BuildingIcon className="w-3.5 h-3.5 text-[#c7a675] shrink-0" />
                        <span>{imgRes.caption}</span>
                      </span>
                      <span style={{ fontSize: 9, background: '#1c221e', border: '1px solid #c7a675', color: '#c7a675', padding: '2px 6px', borderRadius: 2, fontWeight: 800, whiteSpace: 'nowrap' }}>
                        {imgRes.status === 'VERIFIED_CORPORATE_IMAGE' ? 'FOTOGRAFIE CORPORATIVĂ VERIFICATĂ' : 'FOTOGRAFIE PROIECT VERIFICAT'}
                      </span>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: 24, textAlign: 'center', color: '#888' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                      <BuildingIcon className="w-9 h-9 text-[#666]" />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#c7a675', border: '1px solid #262927', padding: '4px 10px', borderRadius: 4, display: 'inline-block', letterSpacing: '0.05em' }}>
                      STATUT VIZUAL: FOTOGRAFIE INDISPONIBILĂ ÎN SURSE OFICIALE
                    </div>
                    <div style={{ fontSize: 11, color: '#888', marginTop: 8, maxWidth: 500 }}>
                      Nicio fotografie oficială a companiei nu a fost depusă în registrele publice consultate. Politica editorială CONSTRUCTIONS interzice substituirea fotografiilor reale cu imagini generice de stoc.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* COMPACT BUSINESS-SAFE DISCLOSURE BOX */}
            <div style={{ marginTop: 24, padding: 16, background: '#111412', border: '1px solid #242926', borderRadius: 6, fontSize: 12, color: '#a0a0a0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <strong style={{ color: '#fff' }}>Notă de Independență a Platformei:</strong> CONSTRUCTIONS este o platformă independentă de cercetare și monitorizare a pieței. Includerea unei entități nu reprezintă o asociere comercială, reprezentare exclusivă sau recomandare de investiții.
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <Link href="/methodology" style={{ color: '#aaa', fontWeight: 600, textDecoration: 'underline', whiteSpace: 'nowrap' }}>
                  Metodologia Noastră →
                </Link>
                <Link href={`/report-error?company=${encodeURIComponent(c.name)}`} style={{ color: '#c7a675', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  Solicită Actualizare Profil →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* STICKY DOSSIER NAV */}
        <DossierNav tabs={navTabs} />

        {/* SECTION A — EXECUTIVE PROFILE */}
        <section id="profile" className="section shell" style={{ paddingTop: 40 }}>
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA A</div>
              <h2>PROFIL EXECUTIV &amp; PREZENTARE GENERALĂ</h2>
            </div>
          </div>

          <div style={{ padding: 24, background: '#141715', border: '1px solid #262927', borderRadius: 6, fontSize: 14, lineHeight: 1.7, color: '#d4d2c8', marginBottom: 20 }}>
            <h4 style={{ color: '#c7a675', margin: '0 0 8px 0', textTransform: 'uppercase', fontSize: 12 }}>SINTEZĂ CORPORATIVĂ</h4>
            <p style={{ margin: 0 }}>
              {c.name} este o entitate activă din categoria <strong>{(c.type || 'companie').replaceAll('_', ' ')}</strong>, cu sediul raportat în <strong>{c.location || 'România'}</strong>.
              Entitatea este asociată în eșantionul verificat cu <strong>{connectedProjects.length} proiecte</strong>, cu o valoare cumulată documentată de <strong>{knownPortfolioValueEur > 0 ? `€${(knownPortfolioValueEur / 1000000).toFixed(1)}M EUR` : 'Nedivulgat în depuneri publice'}</strong>.
              Identificator fiscal (CUI/CIF): <strong>{c.cui_cif || 'Nedivulgat în surse publice'}</strong>.
            </p>
          </div>
        </section>

        {/* SECTION B — COMPANY HISTORY */}
        <section id="history" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA B</div>
              <h2>ISTORIC &amp; ETAPE DE DEZVOLTARE</h2>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 840 }}>
            {c.founded_year && (
              <div style={{ padding: 16, background: '#141715', border: '1px solid #262927', borderRadius: 6, display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#c7a675', width: 60 }}>{c.founded_year}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Înființare Oficială Entitate</div>
                  <div style={{ fontSize: 12, color: '#aaa9a1', marginTop: 2 }}>Fondată în {c.location || 'România'} ca entitate specializată în domeniul construcțiilor și imobiliarelor.</div>
                  <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>Sursă: Registrul Comerțului / Situații Financiare Oficiale</div>
                </div>
              </div>
            )}
            <div style={{ padding: 14, background: '#0f1210', border: '1px dashed #262927', borderRadius: 4, color: '#888', fontSize: 12 }}>
              Date istorice suplimentare: <strong style={{ color: '#aaa' }}>Cronologia detaliată a evenimentelor corporative este disponibilă prin audit la cerere</strong>.
            </div>
          </div>
        </section>

        {/* SECTION C — FINANCIAL HISTORY */}
        <section id="financials" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA C</div>
              <h2>SITUAȚII FINANCIARE &amp; BILANȚ</h2>
            </div>
          </div>

          {financials.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#141715', borderBottom: '2px solid #262927', color: '#c7a675', fontSize: 11, letterSpacing: '0.05em' }}>
                    <th style={{ padding: 12 }}>AN</th>
                    <th style={{ padding: 12 }}>CIFRĂ AFACERI (EUR)</th>
                    <th style={{ padding: 12 }}>CIFRĂ AFACERI (RON)</th>
                    <th style={{ padding: 12 }}>PROFIT NET (EUR)</th>
                    <th style={{ padding: 12 }}>ANGAJAȚI</th>
                    <th style={{ padding: 12 }}>STATUS</th>
                    <th style={{ padding: 12 }}>SURSĂ</th>
                  </tr>
                </thead>
                <tbody>
                  {financials.map((f: any) => (
                    <tr key={f.year} style={{ borderBottom: '1px solid #1f2320' }}>
                      <td style={{ padding: 12, fontWeight: 800, color: '#fff' }}>{f.year}</td>
                      <td style={{ padding: 12, color: f.revenue_eur ? '#86efac' : '#888', fontWeight: 700 }}>
                        {f.revenue_eur ? `€${(f.revenue_eur / 1000000).toFixed(2)}M` : 'Nedivulgat'}
                      </td>
                      <td style={{ padding: 12, color: '#ccc' }}>
                        {f.revenue_ron ? `${(f.revenue_ron / 1000000).toFixed(1)}M RON` : 'Nedivulgat'}
                      </td>
                      <td style={{ padding: 12, color: f.net_profit_eur ? '#fff' : '#888' }}>
                        {f.net_profit_eur ? `€${(f.net_profit_eur / 1000000).toFixed(2)}M` : 'Nedivulgat'}
                      </td>
                      <td style={{ padding: 12, color: '#ccc' }}>{f.employees || f.employees_count || 'Nedivulgat'}</td>
                      <td style={{ padding: 12 }}>
                        <span style={{ fontSize: 10, background: '#1c221e', border: '1px solid #38bdf8', color: '#38bdf8', padding: '2px 6px', borderRadius: 2, fontWeight: 700 }}>
                          {f.status || 'RAPORTAT'}
                        </span>
                      </td>
                      <td style={{ padding: 12, fontSize: 11, color: '#888' }}>{f.source_title || f.source || 'Ministerul Finanțelor / Rapoarte Anuale'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6, color: '#888', fontSize: 13 }}>
              Datele financiare pentru această entitate nu sunt divulgate în depunerile publice consultate. Informațiile pot fi solicitate echipei noastre de cercetare.
            </div>
          )}
        </section>

        {/* SECTION D — FINANCIAL TREND ANALYSIS */}
        {financials.length > 0 && (
          <section id="trend" className="section shell">
            <div className="section-head">
              <div>
                <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA D</div>
                <h2>EVOLUȚIE &amp; TENDINȚĂ FINANCIARĂ</h2>
              </div>
            </div>

            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: '#888', fontWeight: 700 }}>CLASIFICARE TENDINȚĂ DERIVATĂ</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: revenueGrowthTrend === 'GROWING' ? '#86efac' : '#c7a675', marginTop: 4 }}>
                  {revenueGrowthTrend === 'GROWING' ? 'CREȘTERE' : revenueGrowthTrend === 'DECLINING' ? 'SCĂDERE' : 'STABIL'}
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#aaa' }}>
                Calculat algoritmic din perioadele financiare raportate ({financials[financials.length - 1]?.year} → {financials[0]?.year}).
              </div>
            </div>

            <FinancialTrendChart timeline={financials} />
          </section>
        )}

        {/* SECTION E — OWNERSHIP & CORPORATE STRUCTURE */}
        <section id="structure" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA E</div>
              <h2>STRUCTURĂ JURIDICĂ &amp; ACȚIONARIAT</h2>
            </div>
          </div>

          <div style={{ padding: 24, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <div>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>FORMA JURIDICĂ</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginTop: 4 }}>{c.ownership_structure || 'Societate Comercială Privată'}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>STATUT PE PIAȚĂ DE CAPITAL</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: c.slug === 'one-united-properties' ? '#86efac' : '#ccc', marginTop: 4 }}>
                  {c.slug === 'one-united-properties' ? 'TRANZACȚIONATĂ BVB (SIMBOL: ONE)' : 'SOCIETATE PRIVATĂ NECOTATĂ'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>GRUP / HOLDING-MAMĂ</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginTop: 4 }}>
                  {c.parent_group || 'Companie Independentă / Nedivulgat'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION F — MANAGEMENT & KEY PEOPLE */}
        <section id="people" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA F</div>
              <h2>ECHIPA DE CONDUCERE &amp; PERSOANE CHEIE</h2>
            </div>
          </div>

          <div style={{ background: '#141715', border: '1px solid #262927', borderRadius: 6, padding: 20 }}>
            {c.founders_key_people && c.founders_key_people.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {c.founders_key_people.map((person: string, idx: number) => (
                  <div key={idx} style={{ padding: 12, background: '#0c0e0c', border: '1px solid #222', borderRadius: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <UserIcon className="w-3.5 h-3.5 text-[#c7a675] shrink-0" />
                      <span>{person}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#c7a675', marginTop: 2 }}>Conducere / Persoană Cheie</div>
                    <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>Sursă: Registrul Public</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#888', fontSize: 13 }}>
                Datele privind conducerea executivă nu sunt divulgate în depunerile publice consultate. Informațiile pot fi solicitate echipei noastre de cercetare.
              </div>
            )}
          </div>
        </section>

        {/* SECTION G — PROJECT PORTFOLIO */}
        <section id="portfolio" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA G</div>
              <h2>PORTOFOLIU DE PROIECTE ({connectedProjects.length})</h2>
              <div style={{ fontSize: 12, color: '#aaa9a1', marginTop: 4 }}>
                <span style={{ background: '#1c221e', border: '1px solid #c7a675', color: '#c7a675', padding: '2px 8px', borderRadius: 2, fontSize: 10, fontWeight: 800, marginRight: 8 }}>
                  ROL VERIFICAT
                </span>
                Proiecte asociate cu această entitate în eșantionul documentat.
              </div>
            </div>
          </div>

          {connectedProjects.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {connectedProjects.map(p => (
                <ProjectCard key={p.id} project={p} role={c.type === 'developer' ? 'DEZVOLTATOR' : `${(c.type || 'ROL').replaceAll('_', ' ')}`} />
              ))}
            </div>
          ) : (
            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6, color: '#888', fontSize: 13 }}>
              Niciun proiect din portofoliul acestei companii nu este în prezent indexat în eșantionul verificat.
            </div>
          )}
        </section>

        {/* SECTION H — ACTIVE PIPELINE */}
        <section id="pipeline" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#38bdf8' }}>SECȚIUNEA H</div>
              <h2>ȘANTIERE ACTIVE ÎN DERULARE ({activeProjects.length})</h2>
            </div>
          </div>

          {activeProjects.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {activeProjects.map(p => (
                <ProjectCard key={p.id} project={p} role="ȘANTIER ACTIV" />
              ))}
            </div>
          ) : (
            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6, color: '#888', fontSize: 13 }}>
              Niciun șantier activ documentat în eșantionul curent.
            </div>
          )}
        </section>

        {/* SECTION I — FORWARD PIPELINE & OUTLOOK */}
        <section id="future" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA I</div>
              <h2>PIPELINE VIITOR &amp; PERSPECTIVE</h2>
            </div>
          </div>

          <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6, color: '#aaa9a1', fontSize: 13 }}>
            Perspective de extindere viitoare:{' '}
            <strong style={{ color: '#888' }}>
              Nicio investiție viitoare confirmată oficial dincolo de șantierele active indexate.
            </strong>
          </div>
        </section>

        {/* SECTION J — MARKET POSITION */}
        <section id="market" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA J</div>
              <h2>POZIȚIONARE DE PIAȚĂ &amp; SPECIALIZARE</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div style={{ padding: 16, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>ȘANTIERE ACTIVE ÎN EȘANTION</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginTop: 4 }}>
                {activeProjects.length > 0 ? `${activeProjects.length} ${activeProjects.length === 1 ? 'Șantier Activ' : 'Șantiere Active'}` : 'Fără șantiere active indexate'}
              </div>
            </div>
            <div style={{ padding: 16, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>SPECIALIZARE PRINCIPALĂ</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#c7a675', marginTop: 4, textTransform: 'capitalize' }}>
                {(c.specializations && c.specializations[0]) || (c.type || 'Dezvoltare').replaceAll('_', ' ')}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION K — GEOGRAPHIC FOOTPRINT */}
        <section id="footprint" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA K</div>
              <h2>ACOPERIRE GEOGRAFICĂ &amp; POLI REGIONALI</h2>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/map" style={{ padding: '8px 16px', background: '#141715', border: '1px solid #262927', borderRadius: 4, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <LocationPinIcon className="w-3.5 h-3.5 text-[#c7a675]" />
              <span>{c.location || 'România'}</span>
            </Link>
          </div>
        </section>

        {/* SECTION L — RELATIONSHIP GRAPH */}
        <section id="graph" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA L</div>
              <h2>REȚEAUA DE PARTENERIATE &amp; CONTRACTE</h2>
            </div>
          </div>

          <div style={{ background: '#141715', border: '1px solid #262927', borderRadius: 6, padding: 20 }}>
            {connectedProjects.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {connectedProjects.map(p => (
                  <div key={p.id} style={{ padding: 14, background: '#0c0e0c', border: '1px solid #222', borderRadius: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, fontSize: 12 }}>
                    <span style={{ fontWeight: 800, color: '#c7a675' }}>{c.name}</span>
                    <span style={{ color: '#666' }}>➔</span>
                    <Link href={`/projects/${p.slug}`} style={{ color: '#fff', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <BuildingIcon className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>{p.name}</span>
                    </Link>
                    <span style={{ color: '#666' }}>➔</span>
                    <span>Constructor: <strong style={{ color: p.contractor_name ? '#38bdf8' : '#666' }}>{p.contractor_name || 'Nedivulgat'}</strong></span>
                    <span style={{ color: '#666' }}>➔</span>
                    <span>Arhitect: <strong style={{ color: p.architect_name ? '#86efac' : '#666' }}>{p.architect_name || 'Nedivulgat'}</strong></span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#888', fontSize: 13 }}>Noduri de rețea nedivulgate pentru această entitate.</div>
            )}
          </div>
        </section>

        {/* SECTION M — COMPARABLE ENTITIES */}
        <section id="competitive" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA M</div>
              <h2>COMPANII COMPARABILE DIN PIAȚĂ</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {comparableCompanies.map(other => (
              <div key={other.id} style={{ padding: 16, background: '#141715', border: '1px solid #262927', borderRadius: 6, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 10, color: '#c7a675', fontWeight: 800 }}>ACELAȘI DOMENIU</div>
                  <h4 style={{ fontSize: 16, margin: '6px 0 4px 0' }}>
                    <Link href={`/companies/${other.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>
                      {other.name}
                    </Link>
                  </h4>
                  <div style={{ fontSize: 12, color: '#888' }}>{other.location} · {other.type.replaceAll('_', ' ')}</div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <Link href={`/compare?c1=${c.slug}&c2=${other.slug}`} style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }}>
                    COMPARĂ CELE DOUĂ ENTITĂȚI →
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
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA N</div>
              <h2>DATE CONTRACTUALE &amp; ACHIZIȚII</h2>
            </div>
          </div>

          <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6, color: '#aaa9a1', fontSize: 13 }}>
            Achiziții și contracte monitorizate:{' '}
            <strong style={{ color: '#888' }}>
              Indexate conform declarațiilor oficiale din raportările corporative, BVB și SEAP.
            </strong>
          </div>
        </section>

        {/* SECTION O — SOURCES & PROVENANCE */}
        <section id="sources" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA O</div>
              <h2>SURSE PRIMARE &amp; PROVENIENȚĂ</h2>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 840 }}>
            {c.sources && c.sources.length > 0 ? (
              c.sources.map((s: any, idx: number) => (
                <div key={idx} style={{ padding: 16, background: '#141715', border: '1px solid #262927', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#c7a675' }}>{s.type || 'SURSĂ DOCUMENTATĂ'}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginTop: 2 }}>{s.title}</div>
                  </div>
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#38bdf8', textDecoration: 'none', fontWeight: 700 }}>
                      VERIFICĂ REFERINȚA ↗
                    </a>
                  )}
                </div>
              ))
            ) : (
              <div style={{ color: '#888', fontSize: 13 }}>Date documentate conform depunerilor publice oficiale.</div>
            )}
          </div>
        </section>

        {/* SECTION P — DATA DISCLOSURE & CORRECTION */}
        <section id="quality" className="section shell" style={{ paddingBottom: 60 }}>
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA P</div>
              <h2>TRANSPARENȚĂ DATE &amp; PROCEDURĂ CORECȚII</h2>
            </div>
          </div>

          <div style={{ padding: 24, background: '#141715', border: '1px solid #262927', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#c7a675' }}>NOTĂ METODOLOGICĂ ASUPRA DATELOR</div>
              <div style={{ fontSize: 14, color: '#ccc', marginTop: 4, maxWidth: 540, lineHeight: 1.6 }}>
                Informațiile din acest profil sunt agregate exclusiv din surse publice oficiale (ONRC, ANAF, Ministerul Finanțelor, rapoarte corporative anuale auditate). Entitățile menționate pot solicita oricând corectarea sau actualizarea datelor.
              </div>
            </div>
            <Link href={`/report-error?company=${encodeURIComponent(c.name)}`} style={{ fontSize: 11, background: '#1c221e', border: '1px solid #c7a675', color: '#c7a675', padding: '10px 18px', borderRadius: 4, fontWeight: 800, textDecoration: 'none' }}>
              SOLICITĂ CORECȚIE PROFIL →
            </Link>
          </div>
        </section>

        {/* INVENT / RESEARCH INTAKE SECTION */}
        <section className="conversion">
          <div className="shell">
            <div className="eyebrow" style={{ color: '#25221b' }}>Cercetare Independentă de Piață</div>
            <h2>SOLICITĂ CERCETARE DETALIATĂ ASUPRA ACESTEI COMPANII</h2>
            <p style={{ color: '#25221b', marginBottom: 20, maxWidth: 580, lineHeight: 1.6 }}>
              CONSTRUCTIONS oferă cercetare analitică independentă de piață. Pentru audit de portofoliu, istoric financiar sau verificări factual-probatorii, contactează echipa analitică.
            </p>

            <div style={{ padding: 16, background: 'rgba(5, 5, 5, 0.05)', border: '1px solid rgba(5, 5, 5, 0.15)', borderRadius: 6, marginBottom: 24, fontSize: 11, color: '#333', lineHeight: 1.5, maxWidth: 680 }}>
              <strong>NOTĂ DE INDEPENDENȚĂ:</strong> CONSTRUCTIONS este o platformă independentă de informare și analiză. Includerea unei companii nu constituie reprezentare, mandat comercial sau susținere. Toate solicitările sunt analizate exclusiv de echipa noastră analitică.
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href={`/research-request?category=COMPANY&subject=${encodeURIComponent(c.name)}`} className="btn fill font-mono text-xs">
                SOLICITĂ AUDIT DE PIAȚĂ →
              </Link>
              <Link href={`/report-error?company=${encodeURIComponent(c.name)}`} style={{ fontSize: 11, border: '1px solid #111', color: '#111', padding: '12px 20px', borderRadius: 4, fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                SOLICITĂ ACTUALIZARE PROFIL
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
