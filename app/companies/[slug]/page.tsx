import {notFound} from 'next/navigation';
import Link from 'next/link';
import type {Metadata} from 'next';
import {getCompanyBySlug, demoCompanies, ConnectedProject} from '@/lib/data';
import {getAdminIdentity} from '@/lib/admin-auth';
import {getPublicStorageUrl} from '@/components/MediaManager';
import {SiteHeader} from '@/components/SiteHeader';
import {SiteFooter} from '@/components/SiteFooter';
import {LeadForm} from '@/components/LeadForm';

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
    title: c.name,
    description: c.description || `Discover verified portfolio and services for ${c.name}.`,
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
      <div className="eyebrow" style={{ color: '#d4af37' }}>
        {eyebrow}
      </div>
      <h3 style={{ fontSize: 20, letterSpacing: '-0.03em', textTransform: 'uppercase', marginTop: 4, marginBottom: 16 }}>
        {title}
      </h3>
      <div className="company-grid">
        {list.map(p => (
          <Link href={`/projects/${p.slug}`} className="company" key={`${p.id}-${p.role}`}>
            <span className="company-num" style={{ textTransform: 'capitalize' }}>
              Role: {p.role.replaceAll('_', ' ')}
            </span>
            <div>
              <h3>{p.name}</h3>
              <p>{p.project_type || 'Development'}</p>
            </div>
            <footer>
              <span style={{ textTransform: 'capitalize' }}>{p.status.replaceAll('_', ' ')}</span>
              {p.verified_at && <span style={{ color: '#86efac', marginLeft: 8 }}>· Verified role</span>}
            </footer>
          </Link>
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

  const { company: c, builtProjects, buildingProjects, upcomingProjects, timeline, media, articles } = data;
  const hasConnectedWork = builtProjects.length > 0 || buildingProjects.length > 0 || upcomingProjects.length > 0;
  const totalProjects = builtProjects.length + buildingProjects.length + upcomingProjects.length;

  return (
    <>
      <SiteHeader />
      <main>
        {isPreviewAllowed && (
          <div style={{ background: '#d4af37', color: '#000', padding: '10px 24px', textAlign: 'center', fontWeight: 700, fontSize: 13, letterSpacing: '0.05em' }}>
            ADMIN PREVIEW MODE — DRAFT RECORD (NOT VISIBLE ANONYMOUSLY)
          </div>
        )}

        <section className="page-hero shell">
          <div className="eyebrow">
            {c.website_verification === 'verified' ? 'Verified partner profile' : 'Company profile'}
          </div>
          <h1>{c.name.toUpperCase()}</h1>
          <p>
            {c.type} {c.location ? `· ${c.location}` : ''}
            {c.founded_year ? ` · Founded ${c.founded_year}` : ''}
            <br />
            <br />
            {c.description}
          </p>
          {c.website && (
            <div style={{ marginTop: 16 }}>
              <a href={c.website} target="_blank" rel="noreferrer" className="link-arrow" style={{ fontSize: 14 }}>
                Visit official company website ↗
              </a>
            </div>
          )}
        </section>

        {/* Company Overview & Verified Metrics */}
        <section className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow">Verified Overview</div>
              <h2>PRACTICE & EXPERTISE</h2>
            </div>
          </div>
          <div className="company-grid">
            {totalProjects > 0 && (
              <div className="company">
                <span className="company-num">Connected Portfolio</span>
                <h3>{totalProjects}</h3>
                <p>Verified project associations</p>
              </div>
            )}
            {c.specialism && (
              <div className="company">
                <span className="company-num">Primary Focus</span>
                <h3>{c.specialism}</h3>
                <p>Public profile information</p>
              </div>
            )}
            {c.status && (
              <div className="company">
                <span className="company-num">Verification Status</span>
                <h3>{c.status}</h3>
                <p>Confirmed data and credentials</p>
              </div>
            )}
          </div>
        </section>

        {/* Connected Projects (Categorized by status) */}
        {hasConnectedWork && (
          <section className="section shell">
            <div className="section-head">
              <div>
                <div className="eyebrow">Project Portfolio</div>
                <h2>CONNECTED WORK</h2>
              </div>
            </div>

            <ProjectSubGrid title="WHAT THEY ARE BUILDING" eyebrow="Active Construction" list={buildingProjects} />
            <ProjectSubGrid title="WHAT THEY BUILT" eyebrow="Delivered / Completed" list={builtProjects} />
            <ProjectSubGrid title="WHAT'S NEXT" eyebrow="Upcoming Pipeline" list={upcomingProjects} />
          </section>
        )}

        {/* Visual Media Gallery */}
        {media.length > 0 && (
          <section className="section shell">
            <div className="section-head">
              <div>
                <div className="eyebrow">Visual Archives</div>
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

        {/* Verified Timeline */}
        {timeline.length > 0 && (
          <section className="section shell">
            <div className="section-head">
              <div>
                <div className="eyebrow">Corporate History</div>
                <h2>TIMELINE & MILESTONES</h2>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640 }}>
              {timeline.map((t: any) => (
                <div
                  key={t.id}
                  style={{
                    padding: '16px 20px',
                    background: '#141715',
                    border: '1px solid #262927',
                    borderRadius: 6
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#d4af37' }}>{t.event_year}</span>
                  <h4 style={{ fontSize: 16, color: '#fff', margin: '4px 0 6px 0' }}>{t.title}</h4>
                  {t.description && <p style={{ fontSize: 13, color: '#b9b6ae', margin: 0 }}>{t.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Stories */}
        {articles.length > 0 && (
          <section className="section shell">
            <div className="section-head">
              <div>
                <div className="eyebrow">Editorial Coverage</div>
                <h2>RELATED STORIES</h2>
              </div>
            </div>
            <div className="editorial">
              {articles.map((art: any) => (
                <Link href={`/editorial/${art.slug}`} className="story" key={art.id}>
                  <div className="eyebrow">{art.category || 'Industry Intelligence'}</div>
                  <h3>{art.title}</h3>
                  <p>{art.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Institutional Representation & Presentation CTAs */}
        <section className="section shell" style={{ borderTop: '1px solid var(--line)', paddingTop: 60, paddingBottom: 60 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div style={{ padding: 24, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div className="eyebrow" style={{ color: '#d4af37' }}>Official Representation</div>
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
              <div className="eyebrow" style={{ color: '#d4af37' }}>Commercial Showcase</div>
              <h3 style={{ fontSize: 20, margin: '8px 0 10px 0', textTransform: 'uppercase' }}>
                LOOKING TO PRESENT YOUR WORK PROFESSIONALLY?
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

        {/* Conversion / Inquiry */}
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
