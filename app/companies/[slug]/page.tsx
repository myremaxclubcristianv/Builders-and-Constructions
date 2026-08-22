import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getCompanyBySlug, demoCompanies, ConnectedProject, MarketSignalItem } from '@/lib/data';
import { getAdminIdentity } from '@/lib/admin-auth';
import { getPublicStorageUrl } from '@/components/MediaManager';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { LeadForm } from '@/components/LeadForm';
import { CompanyIntelligencePreview } from '@/components/CompanyIntelligencePreview';

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
    return { title: 'Company Not Found' };
  }

  const c = data.company;
  const isIndexable = c.published_at && !isPreview;

  return {
    title: `${c.name} — Romanian Construction Dossier`,
    description: c.description || `Verified corporate dossier, active development portfolio, and market activity for ${c.name} in ${c.location || 'Romania'}.`,
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
  return demoCompanies.map(c => ({ slug: c.slug }));
}

function ProjectSubGrid({ title, eyebrow, list }: { title: string; eyebrow: string; list: ConnectedProject[] }) {
  if (!list.length) return null;
  return (
    <div style={{ marginTop: 36 }}>
      <div className="eyebrow" style={{ color: '#c7a675' }}>
        {eyebrow}
      </div>
      <h3 style={{ fontSize: 20, letterSpacing: '-0.03em', textTransform: 'uppercase', marginTop: 4, marginBottom: 16 }}>
        {title}
      </h3>
      <div className="company-grid">
        {list.map(p => (
          <div className="company" key={`${p.id}-${p.role}`} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="company-num" style={{ textTransform: 'capitalize' }}>
                Role: {p.role.replaceAll('_', ' ')}
              </span>
              <h3 style={{ marginTop: 4 }}>
                <Link href={`/projects/${p.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>
                  {p.name}
                </Link>
              </h3>
              <p style={{ marginTop: 6 }}>{p.project_type || 'Development'}</p>

              <div style={{ display: 'flex', gap: 12, marginTop: 12, fontSize: 11, color: '#888' }}>
                <div>
                  SURFACE: <strong style={{ color: '#fff' }}>{p.surface_area ? `${p.surface_area.toLocaleString()} m²` : 'NOT AVAILABLE'}</strong>
                </div>
                <div>
                  UNITS: <strong style={{ color: '#fff' }}>{p.unit_count ? `${p.unit_count}` : 'NOT AVAILABLE'}</strong>
                </div>
              </div>
            </div>

            <footer style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #1a1e1c', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ textTransform: 'capitalize', fontSize: 12, color: '#ccc' }}>{p.status.replaceAll('_', ' ')}</span>
              <Link href={`/projects/${p.slug}`} style={{ color: '#c7a675', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                PROJECT DOSSIER →
              </Link>
            </footer>
          </div>
        ))}
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
  if (!data?.company) notFound();

  const { company: c, builtProjects, buildingProjects, upcomingProjects, timeline, signals, media, articles } = data;
  const hasConnectedWork = builtProjects.length > 0 || buildingProjects.length > 0 || upcomingProjects.length > 0;
  const totalProjects = builtProjects.length + buildingProjects.length + upcomingProjects.length;

  const formattedLastActivity = c.last_activity_date
    ? new Date(c.last_activity_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()
    : 'NOT AVAILABLE';

  return (
    <>
      <SiteHeader />
      <main>
        {isPreviewAllowed && (
          <div style={{ background: '#c7a675', color: '#000', padding: '10px 24px', textAlign: 'center', fontWeight: 800, fontSize: 12, letterSpacing: '0.08em' }}>
            ADMIN EXECUTIVE DOSSIER VIEW — CONFIDENTIAL COMMERCIAL INTELLIGENCE ENABLED
          </div>
        )}

        {/* First Viewport Terminal Card */}
        <section className="page-hero shell">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
            <div className="eyebrow" style={{ color: '#c7a675', margin: 0 }}>
              EXECUTIVE DOSSIER · {c.verification_level || 'VERIFIED'}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {c.signal_freshness && (
                <span style={{ fontSize: 10, fontWeight: 800, border: '1px solid #38bdf8', color: '#38bdf8', padding: '2px 8px', borderRadius: 2 }}>
                  {c.signal_freshness} ACTIVITY
                </span>
              )}
              <span style={{ fontSize: 10, fontWeight: 800, border: '1px solid #86efac', color: '#86efac', padding: '2px 8px', borderRadius: 2 }}>
                VERIFIED IDENTITY
              </span>
            </div>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', margin: '0 0 12px 0' }}>{c.name.toUpperCase()}</h1>

          <p style={{ maxWidth: 800, fontSize: '1.1rem', color: '#d4d2c8', lineHeight: 1.6, margin: '0 0 24px 0' }}>
            {c.type} {c.location ? `· ${c.location}` : ''}
            {c.founded_year ? ` · Founded ${c.founded_year}` : ''}
            <br />
            {c.description}
          </p>

          {/* First Viewport Executive Summary Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
              padding: 20,
              background: '#0d100f',
              border: '1px solid #262927',
              borderRadius: 6
            }}
          >
            <div>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>WHY THIS COMPANY MATTERS</div>
              <div style={{ fontSize: 13, color: '#fff', marginTop: 4, fontWeight: 600, lineHeight: 1.4 }}>
                {totalProjects > 0
                  ? `Active developer with ${totalProjects} verified projects in target market.`
                  : `Monitored company entity in ${c.location || 'Romania'}.`}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>IDENTIFICATION & CUI</div>
              <div style={{ fontSize: 13, color: c.cui_cif ? '#86efac' : '#aaa', marginTop: 4, fontWeight: 700 }}>
                {c.cui_cif ? `CUI: ${c.cui_cif}` : 'CUI / REGISTRATION EVIDENCE NOT AVAILABLE'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 700 }}>LAST VERIFIED ACTIVITY</div>
              <div style={{ fontSize: 13, color: '#38bdf8', marginTop: 4, fontWeight: 700 }}>
                {formattedLastActivity}
              </div>
            </div>

            {isPreviewAllowed && (
              <div>
                <div style={{ fontSize: 10, color: '#c7a675', fontWeight: 700 }}>COMMERCIAL GAP</div>
                <div style={{ fontSize: 13, color: '#fff', marginTop: 4, fontWeight: 600 }}>
                  High-converting digital audit deficiency detected.
                </div>
              </div>
            )}
          </div>

          {c.website && (
            <div style={{ marginTop: 20 }}>
              <a href={c.website} target="_blank" rel="noreferrer" className="link-arrow" style={{ fontSize: 14 }}>
                Official Corporate Website ({c.website}) ↗
              </a>
            </div>
          )}
        </section>

        {/* Section 1: Company Overview & Verified Metrics */}
        <section className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>Corporate Credentials</div>
              <h2>COMPANY OVERVIEW</h2>
            </div>
          </div>

          <div className="company-grid">
            <div className="company">
              <span className="company-num">Verified Portfolio</span>
              <h3>{totalProjects > 0 ? `${totalProjects} Projects` : 'INSUFFICIENT DATA'}</h3>
              <p>Confirmed building associations in database</p>
            </div>

            <div className="company">
              <span className="company-num">Market Signals</span>
              <h3>{signals.length > 0 ? `${signals.length} Signals` : 'INSUFFICIENT DATA'}</h3>
              <p>Tracked milestones and structural events</p>
            </div>

            <div className="company">
              <span className="company-num">Specialisation</span>
              <h3>{c.specialism || 'General Construction'}</h3>
              <p>Core sector focus & operational capabilities</p>
            </div>
          </div>
        </section>

        {/* Section 2: Chronological Market Signals & Activity Timeline */}
        {signals.length > 0 && (
          <section className="section shell">
            <div className="section-head">
              <div>
                <div className="eyebrow" style={{ color: '#c7a675' }}>Verified Activity Stream</div>
                <h2>MARKET SIGNALS & TIMELINE</h2>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 840 }}>
              {signals.map(sig => (
                <div
                  key={sig.id}
                  style={{
                    padding: '16px 20px',
                    background: '#141715',
                    border: '1px solid #262927',
                    borderRadius: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#c7a675', letterSpacing: '0.08em' }}>
                      {sig.signal_type.replaceAll('_', ' ')}
                    </span>
                    <span style={{ fontSize: 11, color: '#888' }}>
                      {sig.event_date ? new Date(sig.event_date).toLocaleDateString('en-GB') : 'RECENT'}
                    </span>
                  </div>

                  <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: 0 }}>
                    {sig.title}
                  </h4>

                  {sig.summary && <p style={{ fontSize: 13, color: '#b5b3aa', margin: 0 }}>{sig.summary}</p>}

                  {sig.source_url && (
                    <div style={{ marginTop: 4, fontSize: 11 }}>
                      <a href={sig.source_url} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none' }}>
                        Source Citation ↗
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 3: Connected Projects */}
        {hasConnectedWork && (
          <section className="section shell">
            <div className="section-head">
              <div>
                <div className="eyebrow" style={{ color: '#c7a675' }}>Project Relationships</div>
                <h2>CONNECTED WORK</h2>
              </div>
            </div>

            <ProjectSubGrid title="WHAT THEY ARE BUILDING" eyebrow="Active Construction" list={buildingProjects} />
            <ProjectSubGrid title="WHAT THEY BUILT" eyebrow="Delivered / Completed" list={builtProjects} />
            <ProjectSubGrid title="WHAT'S NEXT" eyebrow="Upcoming Pipeline" list={upcomingProjects} />
          </section>
        )}

        {/* Section 4: Visual Media Gallery */}
        {media.length > 0 && (
          <section className="section shell">
            <div className="section-head">
              <div>
                <div className="eyebrow" style={{ color: '#c7a675' }}>Visual Archives</div>
                <h2>PORTFOLIO & ASSETS</h2>
              </div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 16
              }}
            >
              {media.map((item, i) => {
                const url = getPublicStorageUrl(item.storage_key);
                if (!url) return null;
                return (
                  <figure
                    key={item.id || i}
                    style={{
                      margin: 0,
                      background: '#141715',
                      border: '1px solid #262927',
                      borderRadius: 6,
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ height: 200, background: '#0a0c0b' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={item.alt_text || c.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    {(item.caption || item.credit) && (
                      <figcaption style={{ padding: 12, fontSize: 12, color: '#aaa9a1' }}>
                        {item.caption && <div style={{ color: '#fff', marginBottom: 2 }}>{item.caption}</div>}
                        {item.credit && <div style={{ color: '#777' }}>Photo: {item.credit}</div>}
                      </figcaption>
                    )}
                  </figure>
                );
              })}
            </div>
          </section>
        )}

        {/* Section 5: Institutional Representation CTAs */}
        <section className="section shell" style={{ borderTop: '1px solid var(--line)', paddingTop: 60, paddingBottom: 60 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div style={{ padding: 24, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div className="eyebrow" style={{ color: '#c7a675' }}>Official Representation</div>
              <h3 style={{ fontSize: 20, margin: '8px 0 10px 0', textTransform: 'uppercase' }}>
                DO YOU REPRESENT THIS COMPANY?
              </h3>
              <p style={{ fontSize: 13, color: '#aaa9a1', marginBottom: 20 }}>
                Claim your company profile to review verified information, document active projects, and maintain executive credentials.
              </p>
              <Link href={`/companies/${c.slug}/claim`} className="btn">
                CLAIM PROFILE →
              </Link>
            </div>

            <div style={{ padding: 24, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div className="eyebrow" style={{ color: '#c7a675' }}>Commercial Mandate</div>
              <h3 style={{ fontSize: 20, margin: '8px 0 10px 0', textTransform: 'uppercase' }}>
                LOOKING TO WORK WITH THIS COMPANY?
              </h3>
              <p style={{ fontSize: 13, color: '#aaa9a1', marginBottom: 20 }}>
                Engage AiXLuxury for architectural websites, drone progress media, and development investor presentations.
              </p>
              <Link href="/work-with-us" className="btn">
                WORK WITH THIS COMPANY →
              </Link>
            </div>
          </div>
        </section>

        {/* Section 6: Inquiry Form */}
        <section className="conversion">
          <div className="shell">
            <div className="eyebrow" style={{ color: '#25221b' }}>
              Company Inquiry & Commercial Contact
            </div>
            <h2>
              INTERESTED IN WORKING
              <br />
              WITH THIS COMPANY?
            </h2>
            <p style={{ color: '#25221b', marginBottom: 28, maxWidth: 540 }}>
              Initiate a direct conversation regarding procurement, sub-contracting, development partnerships or architectural mandates.
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
