import {notFound} from 'next/navigation';
import Link from 'next/link';
import type {Metadata} from 'next';
import {getProjectBySlug, demoProjects} from '@/lib/data';
import {getAdminIdentity} from '@/lib/admin-auth';
import {getPublicStorageUrl} from '@/components/MediaManager';
import {ROLE_LABELS} from '@/components/RelationshipEditor';
import {STAGES} from '@/components/ProjectProgressEditor';
import {SiteHeader} from '@/components/SiteHeader';
import {SiteFooter} from '@/components/SiteFooter';

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
    return { title: 'Project Not Found' };
  }

  const p = data.project;
  const isIndexable = p.published_at && !isPreview;

  return {
    title: p.name,
    description: p.description || `Verified developments, project team and progress for ${p.name}.`,
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
  return demoProjects.map(p => ({ slug: p.slug }));
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
  if (!data?.project) notFound();

  const { project: p, team, media, heroMedia, progress, latestProgress, articles } = data;
  const heroUrl = heroMedia ? getPublicStorageUrl(heroMedia.storage_key) : p.image;

  return (
    <>
      <SiteHeader />
      <main>
        {isPreviewAllowed && (
          <div style={{ background: '#d4af37', color: '#000', padding: '10px 24px', textAlign: 'center', fontWeight: 700, fontSize: 13, letterSpacing: '0.05em' }}>
            ADMIN PREVIEW MODE — DRAFT RECORD (NOT VISIBLE ANONYMOUSLY)
          </div>
        )}

        {/* Hero Section */}
        <section className="hero" style={{ minHeight: 680 }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(0deg,rgba(12,14,12,.92),rgba(12,14,12,.25)),url('${heroUrl}') center/cover`
            }}
          />
          <div className="shell hero-content">
            <div className="eyebrow">Verified project intelligence</div>
            <span className="tag">{p.status}</span>
            <h1 style={{ fontSize: 'clamp(52px,8vw,110px)', marginTop: 18 }}>{p.name.toUpperCase()}</h1>
            <p>
              {p.location}
              <br />
              {p.type} {p.developer ? `· ${p.developer}` : ''}
            </p>
          </div>
        </section>

        {/* Project Facts & Verification */}
        <section className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow">Project Intelligence</div>
              <h2>SPECIFICATIONS & METRICS</h2>
            </div>
          </div>
          <div className="company-grid">
            {p.status && (
              <div className="company">
                <span className="company-num">Current Status</span>
                <h3>{p.status}</h3>
                <p>Tracked and verified</p>
              </div>
            )}
            {p.completion && (
              <div className="company">
                <span className="company-num">Estimated Completion</span>
                <h3>{p.completion}</h3>
                <p>Verified timeline target</p>
              </div>
            )}
            {p.surface_area && (
              <div className="company">
                <span className="company-num">Surface Area</span>
                <h3>{p.surface_area.toLocaleString()} m²</h3>
                <p>Gross built area</p>
              </div>
            )}
            {p.unit_count && (
              <div className="company">
                <span className="company-num">Units / Volume</span>
                <h3>{p.unit_count.toLocaleString()}</h3>
                <p>Confirmed capacity</p>
              </div>
            )}
          </div>

          {p.description && (
            <p style={{ color: '#b9b6ae', maxWidth: 700, lineHeight: 1.8, marginTop: 36, fontSize: 16 }}>
              {p.description}
            </p>
          )}
        </section>

        {/* Project Team (Only rendered if relationships exist - Premium Empty State) */}
        {team.length > 0 && (
          <section className="section shell">
            <div className="section-head">
              <div>
                <div className="eyebrow">Project Consortium</div>
                <h2>PROJECT TEAM</h2>
              </div>
            </div>
            <div className="company-grid">
              {team.map(member => (
                <Link href={`/companies/${member.slug}`} className="company" key={`${member.id}-${member.role}`}>
                  <span className="company-num" style={{ textTransform: 'uppercase' }}>
                    {ROLE_LABELS[member.role] || member.role.replaceAll('_', ' ')}
                  </span>
                  <div>
                    <h3>{member.name}</h3>
                    <p>{member.type || 'Practice'}</p>
                  </div>
                  <footer>
                    <span>View company profile →</span>
                    {member.verified_at && <span style={{ color: '#86efac', marginLeft: 8 }}>· Verified</span>}
                  </footer>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Verified Construction Progress & Timeline */}
        {latestProgress && (
          <section className="section shell">
            <div className="section-head">
              <div>
                <div className="eyebrow">Verified Construction Progress</div>
                <h2>CURRENT MILESTONE & TIMELINE</h2>
              </div>
            </div>

            {/* Latest Progress Highlight */}
            <div
              style={{
                background: '#141715',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                borderRadius: 8,
                padding: '24px 28px',
                marginBottom: 32,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 20
              }}
            >
              <div>
                <span style={{ fontSize: 12, textTransform: 'uppercase', color: '#d4af37', fontWeight: 700, letterSpacing: '0.05em' }}>
                  Latest Verified Milestone
                </span>
                <h3 style={{ fontSize: 28, color: '#fff', margin: '6px 0 8px 0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                  {STAGES.find(s => s.value === latestProgress.stage)?.label || latestProgress.stage}
                </h3>
                {latestProgress.note && <p style={{ fontSize: 14, color: '#b9b6ae', margin: 0 }}>{latestProgress.note}</p>}
                {latestProgress.progress_date && (
                  <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
                    Verified on {latestProgress.progress_date} {latestProgress.source ? `· Source: ${latestProgress.source}` : ''}
                  </div>
                )}
              </div>

              {latestProgress.percentage !== null && latestProgress.percentage !== undefined && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 48, fontWeight: 800, color: '#d4af37', lineHeight: 1 }}>
                    {latestProgress.percentage}%
                  </div>
                  <span style={{ fontSize: 12, color: '#aaa9a1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Completion
                  </span>
                </div>
              )}
            </div>

            {/* Visual Timeline of Verified Updates */}
            {progress.length > 1 && (
              <div style={{ marginTop: 24 }}>
                <div className="eyebrow" style={{ marginBottom: 14 }}>
                  Verified Historical Milestones
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 640 }}>
                  {progress.map(item => (
                    <div
                      key={item.id}
                      style={{
                        padding: '14px 18px',
                        background: '#0d0f0e',
                        border: '1px solid #222',
                        borderRadius: 6,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 12
                      }}
                    >
                      <div>
                        <span style={{ fontSize: 11, color: '#d4af37', fontWeight: 600 }}>
                          {item.progress_date || 'Milestone date confirmed'}
                        </span>
                        <h4 style={{ margin: '3px 0 0 0', fontSize: 15, color: '#fff', textTransform: 'capitalize' }}>
                          {STAGES.find(s => s.value === item.stage)?.label || item.stage}
                        </h4>
                        {item.note && <p style={{ fontSize: 12, color: '#aaa9a1', margin: '4px 0 0 0' }}>{item.note}</p>}
                      </div>
                      {item.percentage !== null && item.percentage !== undefined && (
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#d4af37', whiteSpace: 'nowrap' }}>
                          {item.percentage}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Media Gallery */}
        {media.length > 0 && (
          <section className="section shell">
            <div className="section-head">
              <div>
                <div className="eyebrow">Project Imagery</div>
                <h2>GALLERY & ASSETS</h2>
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
                    <div style={{ height: 220, background: '#0a0c0b' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={item.alt_text || p.name}
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

        {/* Related Editorial Stories */}
        {articles.length > 0 && (
          <section className="section shell">
            <div className="section-head">
              <div>
                <div className="eyebrow">Editorial Intelligence</div>
                <h2>RELATED STORIES</h2>
              </div>
            </div>
            <div className="editorial">
              {articles.map((art: any) => (
                <Link href={`/editorial/${art.slug}`} className="story" key={art.id}>
                  <div className="eyebrow">{art.category || 'Architecture & Development'}</div>
                  <h3>{art.title}</h3>
                  <p>{art.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Project Presentation & Involvement Actions */}
        <section className="section shell" style={{ borderTop: '1px solid var(--line)', paddingTop: 60, paddingBottom: 60 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div style={{ padding: 24, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div className="eyebrow" style={{ color: '#d4af37' }}>Project Presentation</div>
              <h3 style={{ fontSize: 20, margin: '8px 0 10px 0', textTransform: 'uppercase' }}>
                WANT THIS PROJECT PRESENTED AT ITS FULL POTENTIAL?
              </h3>
              <p style={{ fontSize: 13, color: '#aaa9a1', marginBottom: 20 }}>
                Engage AiXLuxury to document construction milestones, produce architectural drone cinematography, and develop investor presentations.
              </p>
              <Link href="/promote-project" className="btn">
                PROMOTE PROJECT →
              </Link>
            </div>

            <div style={{ padding: 24, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div className="eyebrow" style={{ color: '#d4af37' }}>Stakeholder Attribution</div>
              <h3 style={{ fontSize: 20, margin: '8px 0 10px 0', textTransform: 'uppercase' }}>
                HAVE INFORMATION OR REPRESENT THIS PROJECT?
              </h3>
              <p style={{ fontSize: 13, color: '#aaa9a1', marginBottom: 20 }}>
                Did your practice contribute to this development as developer, general contractor, architect, or structural engineer? Submit verified attribution.
              </p>
              <Link href="/companies" className="btn">
                CLAIM INVOLVEMENT →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
