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
import { safeJsonLdStringify } from '@/lib/sanitize';
import { ScaleIcon, LocationPinIcon, BuildingIcon, RulerIcon, CogIcon, CraneIcon, ChartBarIcon } from '@/components/icons/NavIcons';

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
    return { title: 'Dosar Proiect Negăsit | CONSTRUCTIONS by AiXLuxury' };
  }

  const p = data.project;
  const isIndexable = p.published_at && !isPreview;

  return {
    title: `${p.name} — Dosar Proiect | CONSTRUCTIONS by AiXLuxury`,
    description: p.description || `Dosar executiv, stadiu de execuție, specificații tehnice și echipa de dezvoltare pentru ${p.name} (${p.location || 'România'}).`,
    alternates: {
      canonical: `https://constructions.cristianvaduva.com/projects/${p.slug}`
    },
    openGraph: {
      title: `${p.name} — Dosar Proiect | CONSTRUCTIONS by AiXLuxury`,
      description: p.description || `Dosar de cercetare de piață pentru ${p.name}.`,
      url: `https://constructions.cristianvaduva.com/projects/${p.slug}`,
      siteName: 'CONSTRUCTIONS by AiXLuxury',
      locale: 'ro_RO',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${p.name} | CONSTRUCTIONS by AiXLuxury`,
      description: p.description || `Dosar proiect pentru ${p.name}.`
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
    { id: 'profile', label: 'PROFIL EXECUTIV' },
    { id: 'timeline', label: 'CRONOLOGIE PROIECT' },
    { id: 'team', label: 'ECHIPA DE DEZVOLTARE' },
    { id: 'financials', label: 'PROFIL FINANCIAR' },
    { id: 'specs', label: 'METRICI FIZICE' },
    { id: 'lifecycle', label: 'CICLU DE VIAȚĂ' },
    { id: 'future', label: 'ETAPE VIITOARE' },
    { id: 'risk', label: 'STATUS & EVALUARE' },
    { id: 'location', label: 'LOCALIZARE GEOGRAFICĂ' },
    { id: 'context', label: 'CONTEXT DE PIAȚĂ' },
    { id: 'sources', label: 'SURSE & PROVENIENȚĂ' }
  ];

  // Schema.org Place / Building & BreadcrumbList JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Place',
        '@id': `https://constructions.cristianvaduva.com/projects/${p.slug}#place`,
        name: p.name,
        description: p.description,
        url: `https://constructions.cristianvaduva.com/projects/${p.slug}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: p.location || 'România',
          addressCountry: 'RO'
        }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://constructions.cristianvaduva.com/projects/${p.slug}#breadcrumb`,
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
            name: 'Proiecte',
            item: 'https://constructions.cristianvaduva.com/projects'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: p.name,
            item: `https://constructions.cristianvaduva.com/projects/${p.slug}`
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
            ADMIN PREVIEW MODE — DRAFT RECORD (NOT VISIBLE ANONYMOUSLY)
          </div>
        )}

        {/* HERO SECTION */}
        <section style={{ minHeight: 520, position: 'relative', display: 'flex', alignItems: 'flex-end', borderBottom: '1px solid #262927' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at top, #151a16 0%, #0c0e0c 100%)'
            }}
          />
          <div className="shell hero-content" style={{ position: 'relative', zIndex: 2, paddingBottom: 40, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="eyebrow" style={{ color: '#c7a675', margin: 0 }}>
                  DOSAR PROIECT
                </span>
                <span style={{ fontSize: 10, fontWeight: 800, border: '1px solid #38bdf8', color: '#38bdf8', padding: '2px 8px', borderRadius: 2 }}>
                  {p.status_display || p.status || 'ÎN EXECUȚIE'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <BookmarkButton id={p.slug} name={p.name} type="project" slug={p.slug} subtext={`${p.project_type || 'Dezvoltare'} · ${p.location || 'România'}`} />
                <Link href={`/compare?p1=${p.slug}`} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <ScaleIcon className="w-3.5 h-3.5 text-[#c7a675]" />
                  <span>COMPARĂ PROIECTUL</span>
                </Link>
                <Link href={`/report-error?entity=${encodeURIComponent(p.name)}&type=Project`} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4, color: '#C9A227', borderColor: '#C9A227' }}>
                  <span>✎ RAPORTEAZĂ CORECȚIE</span>
                </Link>
                <Link href="/pipeline" className="btn" style={{ padding: '6px 14px', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <ChartBarIcon className="w-3.5 h-3.5 text-[#fff]" />
                  <span>VEZI ÎN PIPELINE →</span>
                </Link>
              </div>
            </div>

            <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)', margin: '8px 0 12px 0', textTransform: 'uppercase', letterSpacing: '-0.03em' }}>
              {p.name}
            </h1>

            <p style={{ fontSize: '1.2rem', color: '#d8d6ce', maxWidth: 800, margin: 0, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
              <span className="inline-flex items-center gap-1">
                <LocationPinIcon className="w-4 h-4 text-[#c7a675] shrink-0" />
                <span>{p.location || 'România'}</span>
              </span>
              <span>·</span>
              <strong style={{ color: '#c7a675' }}>{p.project_type || 'Dezvoltare'}</strong>
              {p.developer_name && (
                <span>
                  {' '}· Dezvoltator:{' '}
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

            {/* HERO IMAGE CONTAINER */}
            <div style={{ marginTop: 24, height: 320, borderRadius: 6, overflow: 'hidden', border: '1px solid #262927', position: 'relative', background: '#141715', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              {p.image && typeof p.image === 'string' && p.image.startsWith('http') && !p.image.includes('unsplash.com') && !p.image.includes('stock') && p.image_verified ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, insetInline: 0, padding: 12, background: 'linear-gradient(0deg, rgba(0,0,0,0.9), transparent)', fontSize: 11, color: '#ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <CraneIcon className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>{p.name} — Fotografie Oficială Proiect</span>
                    </span>
                    <span style={{ fontSize: 9, background: '#1c221e', border: '1px solid #38bdf8', color: '#38bdf8', padding: '2px 6px', borderRadius: 2, fontWeight: 800 }}>
                      MEDIA VERIFICATĂ
                    </span>
                  </div>
                </>
              ) : (
                <div style={{ padding: 24, textAlign: 'center', color: '#888' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                    <CraneIcon className="w-9 h-9 text-[#666]" />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#c7a675', border: '1px solid #262927', padding: '4px 10px', borderRadius: 4, display: 'inline-block', letterSpacing: '0.05em' }}>
                    STATUT VIZUAL: FOTOGRAFIE INDISPONIBILĂ ÎN SURSE OFICIALE
                  </div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 8, maxWidth: 520 }}>
                    Nicio fotografie oficială de șantier confirmată în depunerile publice pentru acest proiect. Politica editorială CONSTRUCTIONS interzice substituirea fotografiilor reale cu imagini generice de stoc.
                  </div>
                </div>
              )}
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
                <Link href={`/report-error?project=${encodeURIComponent(p.name)}`} style={{ color: '#c7a675', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  Solicită Actualizare Profil →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* STICKY DOSSIER NAV */}
        <DossierNav tabs={navTabs} />

        {/* SECTION 1: PROJECT EXECUTIVE PROFILE */}
        <section id="profile" className="section shell" style={{ paddingTop: 40 }}>
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA 1</div>
              <h2>PROFIL EXECUTIV PROIECT</h2>
            </div>
          </div>

          <div style={{ padding: 24, background: '#141715', border: '1px solid #262927', borderRadius: 6, fontSize: 15, lineHeight: 1.7, color: '#d4d2c8' }}>
            {p.description || `Proiect documentat din surse publice și rapoarte corporative oficiale din piața construcțiilor din România.`}
          </div>
        </section>

        {/* SECTION 2: PROJECT HISTORY TIMELINE */}
        <section id="timeline" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA 2</div>
              <h2>CRONOLOGIE &amp; ETAPE DE EXECUȚIE</h2>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 840 }}>
            <div style={{ padding: 16, background: '#141715', border: '1px solid #262927', borderRadius: 6, display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#c7a675', width: 110 }}>STADIU CURENT</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
                  {p.status_display || (p.status === 'completed' ? 'Proiect Livrat' : 'În Curs de Execuție')}
                </div>
                <div style={{ fontSize: 12, color: '#aaa9a1', marginTop: 2 }}>
                  {p.estimated_completion
                    ? `Orizont estimat de finalizare: ${p.estimated_completion}`
                    : 'Stadiu verificat conform raportărilor publice.'}
                </div>
                <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>
                  Sursă: Rapoarte Oficiale ale Dezvoltatorului / Registre Tehnice
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: DEVELOPMENT TEAM */}
        <section id="team" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA 3</div>
              <h2>REȚEAUA ECHIPEI DE PROIECT</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>DEZVOLTATOR</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#c7a675', marginTop: 6 }}>
                {devComp ? (
                  <Link href={`/companies/${devComp.slug}`} style={{ color: '#c7a675', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <BuildingIcon className="w-3.5 h-3.5 text-[#c7a675]" />
                    <span>{devComp.name} →</span>
                  </Link>
                ) : (
                  p.developer_name || 'Nedivulgat în surse publice'
                )}
              </div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Dezvoltator &amp; investitor imobiliar</div>
            </div>

            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>ANTREPRENOR GENERAL</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#38bdf8', marginTop: 6 }}>
                {gcComp ? (
                  <Link href={`/companies/${gcComp.slug}`} style={{ color: '#38bdf8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <CraneIcon className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>{gcComp.name} →</span>
                  </Link>
                ) : (
                  p.contractor_name || 'Nedivulgat în surse publice'
                )}
              </div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Constructor general / Antrepriză</div>
            </div>

            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>BIROU DE ARHITECTURĂ</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#86efac', marginTop: 6 }}>
                {archComp ? (
                  <Link href={`/companies/${archComp.slug}`} style={{ color: '#86efac', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <RulerIcon className="w-3.5 h-3.5 text-[#86efac]" />
                    <span>{archComp.name} →</span>
                  </Link>
                ) : (
                  p.architect_name || 'Nedivulgat în surse publice'
                )}
              </div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Birou de proiectare de arhitectură</div>
            </div>

            <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>INGINERIE STRUCTURALĂ</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#e879f9', marginTop: 6 }}>
                {engComp ? (
                  <Link href={`/companies/${engComp.slug}`} style={{ color: '#e879f9', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <CogIcon className="w-3.5 h-3.5 text-[#e879f9]" />
                    <span>{engComp.name} →</span>
                  </Link>
                ) : (
                  p.engineering_name || 'Nedivulgat în surse publice'
                )}
              </div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Birou proiectare de rezistență / MEP</div>
            </div>
          </div>
        </section>

        {/* SECTION 4: PROJECT FINANCIAL INTELLIGENCE */}
        <section id="financials" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA 4</div>
              <h2>PROFIL FINANCIAR &amp; INVESTIȚII</h2>
            </div>
          </div>

          <div style={{ padding: 24, background: '#141715', border: '1px solid #262927', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#c7a675' }}>INVESTIȚIE DE CAPITAL ANUNȚATĂ</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginTop: 4 }}>
                {p.investment_eur && p.investment_eur > 0
                  ? `€${(p.investment_eur / 1000000).toFixed(1)}M EUR`
                  : p.investment_label?.toUpperCase().includes('ANNOUNCED')
                  ? 'ANUNȚAT — VALOARE NEDIVULGATĂ'
                  : p.investment_label || 'Nedivulgat în raportări publice'}
              </div>
              <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>Alocare financiară declarată în surse oficiale</div>
            </div>
            <span style={{ fontSize: 11, background: '#1c221e', border: '1px solid #86efac', color: '#86efac', padding: '4px 12px', borderRadius: 2, fontWeight: 800 }}>
              CAPEX ANUNȚAT
            </span>
          </div>
        </section>

        {/* SECTION 5: PHYSICAL SPECS — DIFFERENTIATED BY TYPOLOGY */}
        <section id="specs" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA 5</div>
              <h2>SPECIFICAȚII TEHNICE &amp; ANVERGURĂ</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {/* Core Surface Area / Infrastructure Length */}
            {p.infrastructure_length_km ? (
              <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>LUNGIME INFRASTRUCTURĂ</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginTop: 4 }}>
                  {p.infrastructure_length_km} km
                </div>
              </div>
            ) : p.span_length_m ? (
              <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>DESCHIDERE CENTRALĂ / LUNGIME</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginTop: 4 }}>
                  {p.span_length_m.toLocaleString('ro-RO')} m
                </div>
              </div>
            ) : (p.surface_area_sqm || p.surface_area) ? (
              <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>
                  {p.project_type?.toLowerCase().includes('office') || p.project_type?.toLowerCase().includes('birouri')
                    ? 'SUPRAFAȚĂ ÎNCHIRIABILĂ (GLA)'
                    : p.project_type?.toLowerCase().includes('residential') || p.project_type?.toLowerCase().includes('rezidențial')
                    ? 'SUPRAFAȚĂ CONSTRUITĂ DESFĂȘURATĂ'
                    : 'SUPRAFAȚĂ TOTALĂ'}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginTop: 4 }}>
                  {(p.surface_area_sqm || p.surface_area).toLocaleString('ro-RO')} m²
                </div>
              </div>
            ) : null}

            {/* Industrial & Logistics Specifics */}
            {p.operational_gla_sqm && (
              <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>GLA OPERAȚIONAL CONSTRUIT</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#38bdf8', marginTop: 4 }}>
                  {p.operational_gla_sqm.toLocaleString('ro-RO')} m²
                </div>
              </div>
            )}

            {p.masterplan_gla_sqm && (
              <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>CAPACITATE TOTALĂ MASTERPLAN</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#86efac', marginTop: 4 }}>
                  {p.masterplan_gla_sqm.toLocaleString('ro-RO')} m²
                </div>
              </div>
            )}

            {p.land_area_ha && (
              <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>SUPRAFAȚĂ TEREN</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#c7a675', marginTop: 4 }}>
                  {p.land_area_ha} ha
                </div>
              </div>
            )}

            {/* Residential / Arena Units & Capacity */}
            {p.unit_count ? (
              <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>UNITĂȚI LOCATIVE</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#38bdf8', marginTop: 4 }}>
                  {p.unit_count.toLocaleString('ro-RO')} Apartamente
                </div>
              </div>
            ) : p.capacity_seats ? (
              <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>CAPACITATE SPECTATORI</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#38bdf8', marginTop: 4 }}>
                  {p.capacity_seats.toLocaleString('ro-RO')} Locuri
                </div>
              </div>
            ) : null}

            {/* Floors / Height */}
            {(p.floors || p.height_m) && (
              <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>REGIM DE ÎNĂLȚIME</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#86efac', marginTop: 4 }}>
                  {p.floors ? `${p.floors}` : `${p.height_m} m`}
                </div>
              </div>
            )}

            {/* Parking bays */}
            {p.parking_spaces ? (
              <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>LOCURI DE PARCARE</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#c7a675', marginTop: 4 }}>
                  {p.parking_spaces.toLocaleString('ro-RO')} Locuri
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* SECTION 6: STAGE LIFECYCLE INTELLIGENCE */}
        <section id="lifecycle" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#38bdf8' }}>SECȚIUNEA 6</div>
              <h2>CICLU DE VIAȚĂ &amp; STADIU FIZIC</h2>
            </div>
          </div>

          <ProjectStageLifecycle
            currentStage={p.current_stage || p.status}
            progressPercent={p.current_progress_percent}
            statusDisplay={p.status_display || p.status}
          />
        </section>

        {/* SECTION 7: WHAT HAPPENS NEXT */}
        <section id="future" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA 7</div>
              <h2>ETAPE VIITOARE &amp; ORIZONT DE LIVRARE</h2>
            </div>
          </div>

          <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6, color: '#aaa9a1', fontSize: 13 }}>
            Orizont de finalizare / livrare raportat:{' '}
            <strong style={{ color: '#fff' }}>
              {p.estimated_completion ? p.estimated_completion : 'Termen viitor nedivulgat în documentația publică.'}
            </strong>
          </div>
        </section>

        {/* SECTION 8: STATUS & RISK */}
        <section id="risk" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA 8</div>
              <h2>STATUS &amp; EVALUARE DE ETAPĂ</h2>
            </div>
          </div>

          <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#c7a675' }}>CLASIFICARE STATUT</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: p.status === 'completed' || p.status === 'delivered' ? '#86efac' : '#38bdf8', marginTop: 4 }}>
                {p.status_display || (p.status === 'completed' || p.status === 'delivered' ? 'LIVRAT / OPERAȚIONAL' : 'ÎN CURS DE EXECUȚIE')}
              </div>
            </div>
            <span style={{ fontSize: 10, background: '#1c221e', border: p.status === 'completed' || p.status === 'delivered' ? '1px solid #86efac' : '1px solid #38bdf8', color: p.status === 'completed' || p.status === 'delivered' ? '#86efac' : '#38bdf8', padding: '4px 10px', borderRadius: 2, fontWeight: 800 }}>
              {p.status === 'completed' || p.status === 'delivered' ? 'PROIECT FINALIZAT' : 'ȘANTIER ÎNREGISTRAT'}
            </span>
          </div>
        </section>

        {/* SECTION 9: LOCATION INTELLIGENCE */}
        <section id="location" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA 9</div>
              <h2>LOCALIZARE GEOGRAFICĂ</h2>
            </div>
          </div>

          <div style={{ padding: 20, background: '#141715', border: '1px solid #262927', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 4 }}>
                <LocationPinIcon className="w-4 h-4 text-[#c7a675] shrink-0" />
                <span>{p.location || 'România'}</span>
              </div>
              <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>
                Județ: {p.county || 'București / Ilfov'} · Localitate: {p.locality || p.location || 'București'}
              </div>
            </div>
            <Link href="/map" className="btn-secondary" style={{ fontSize: 11 }}>
              VEZI PE HARTA NAȚIONALĂ →
            </Link>
          </div>
        </section>

        {/* SECTION 10: COMPETITIVE CONTEXT & SOURCES */}
        <section id="context" className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA 10</div>
              <h2>CONTEXT DE PIAȚĂ &amp; PROIECTE COMPARABILE</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {sameDeveloperProjects.slice(0, 2).map(other => (
              <div key={other.id} style={{ padding: 16, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: '#c7a675', fontWeight: 800 }}>ACELAȘI DEZVOLTATOR</div>
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
                <div style={{ fontSize: 10, color: '#38bdf8', fontWeight: 800 }}>ACELAȘI ORAȘ</div>
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
              <div className="eyebrow" style={{ color: '#c7a675' }}>SECȚIUNEA 11</div>
              <h2>SURSE PRIMARE &amp; PROVENIENȚĂ</h2>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 840 }}>
            {p.sources && p.sources.length > 0 ? (
              p.sources.map((s: any, idx: number) => (
                <div key={idx} style={{ padding: 16, background: '#141715', border: '1px solid #262927', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#c7a675' }}>
                      {s.type === 'OFFICIAL' ? 'SURSĂ OFICIALĂ' : s.type === 'PUBLIC_RECORD' ? 'REGISTRU PUBLIC' : s.type || 'SURSĂ DOCUMENTATĂ'}
                    </div>
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
              <div style={{ color: '#888', fontSize: 13 }}>Date documentate conform registrelor tehnice publice.</div>
            )}
          </div>
        </section>

        {/* RESEARCH INTAKE SECTION */}
        <section className="conversion">
          <div className="shell">
            <div className="eyebrow" style={{ color: '#25221b' }}>Cercetare Independentă de Piață &amp; Due Diligence</div>
            <h2>SOLICITĂ CERCETARE SUPLIMENTARĂ PENTRU ACEST PROIECT</h2>
            <p style={{ color: '#25221b', marginBottom: 20, maxWidth: 580, lineHeight: 1.6 }}>
              CONSTRUCTIONS oferă analize structurate independente. Dacă ai nevoie de verificare fizică de șantier, audit tehnic sau date extinse, contactează echipa noastră de cercetare.
            </p>

            <div style={{ padding: 16, background: 'rgba(5, 5, 5, 0.05)', border: '1px solid rgba(5, 5, 5, 0.15)', borderRadius: 6, marginBottom: 24, fontSize: 11, color: '#333', lineHeight: 1.5, maxWidth: 680 }}>
              <strong>NOTĂ DE INDEPENDENȚĂ:</strong> CONSTRUCTIONS este o platformă independentă de informare și cercetare. Includerea unei entități nu implică afiliere, mandat comercial sau susținere. Solicitările trimise sunt gestionate exclusiv de echipa analitică CONSTRUCTIONS.
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href={`/research-request?category=PROJECT&subject=${encodeURIComponent(p.name)}`} className="btn fill font-mono text-xs">
                SOLICITĂ AUDIT DE PIAȚĂ →
              </Link>
              <Link href={`/report-error?project=${encodeURIComponent(p.name)}`} style={{ fontSize: 11, border: '1px solid #111', color: '#111', padding: '12px 20px', borderRadius: 4, fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
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
