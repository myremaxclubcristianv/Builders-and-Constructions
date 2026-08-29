import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getProjectBySlug, demoProjects, MarketSignalItem } from '@/lib/data';
import { getAdminIdentity } from '@/lib/admin-auth';
import { getPublicStorageUrl } from '@/components/MediaManager';
import { ROLE_LABELS } from '@/components/RelationshipEditor';
import { STAGES } from '@/components/ProjectProgressEditor';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
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
  const data = await getProjectBySlug(slug, isPreview);

  if (!data?.project) {
    return { title: 'Project Not Found' };
  }

  const p = data.project;
  const isIndexable = p.published_at && !isPreview;

  return {
    title: `${p.name} — Romanian Development Project Dossier`,
    description: p.description || `Verified developments, project team, structural specifications and progress for ${p.name} in ${p.location || 'Romania'}.`,
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

  const { project: p, team, media, heroMedia, progress, latestProgress, signals, articles } = data;
  const heroUrl = heroMedia ? getPublicStorageUrl((heroMedia as any).storage_key) : p.image;

  return (
    <>
      <SiteHeader />
      <main>
        {isPreviewAllowed && (
          <div style={{ background: '#c7a675', color: '#000', padding: '10px 24px', textAlign: 'center', fontWeight: 800, fontSize: 12, letterSpacing: '0.08em' }}>
            ADMIN PREVIEW MODE — DRAFT RECORD (NOT VISIBLE ANONYMOUSLY)
          </div>
        )}

        {/* Hero Section */}
        <section className="hero" style={{ minHeight: 640, position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(0deg,rgba(12,14,12,.94),rgba(12,14,12,.3)),url('${heroUrl}') center/cover`
            }}
          />
          <div className="shell hero-content" style={{ position: 'relative', zIndex: 2 }}>
            <div className="eyebrow" style={{ color: '#c7a675' }}>Verified Project Dossier & Construction Intelligence</div>
            <span className="tag">{p.status}</span>
            <h1 style={{ fontSize: 'clamp(42px,7vw,96px)', marginTop: 16, textTransform: 'uppercase' }}>{p.name}</h1>
            <p style={{ fontSize: '1.2rem', color: '#d8d6ce' }}>
              {p.location}
              <br />
              {p.type}{' '}
              {p.developer_slug ? (
                <span>
                  · Developer:{' '}
                  <CompanyIntelligencePreview
                    company={{
                      name: p.developer || 'Developer',
                      slug: p.developer_slug,
                      type: p.developer_type
                    }}
                  >
                    <Link href={`/companies/${p.developer_slug}`} style={{ color: '#c7a675', fontWeight: 800, textDecoration: 'none' }}>
                      {p.developer}
                    </Link>
                  </CompanyIntelligencePreview>
                </span>
              ) : (
                p.developer ? `· ${p.developer}` : ''
              )}
            </p>
          </div>
        </section>

        {/* Project Specifications & Verification */}
        <section className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>Project Intelligence</div>
              <h2>SPECIFICATIONS & METRICS</h2>
            </div>
          </div>
          <div className="company-grid">
            <div className="company">
              <span className="company-num">Current Status</span>
              <h3>{p.status}</h3>
              <p>Tracked and verified</p>
            </div>

            <div className="company">
              <span className="company-num">Estimated Completion</span>
              <h3>{p.completion || 'INSUFFICIENT DATA'}</h3>
              <p>Verified timeline target</p>
            </div>

            <div className="company">
              <span className="company-num">Surface Area</span>
              <h3>{p.surface_area ? `${p.surface_area.toLocaleString()} m²` : 'NOT AVAILABLE'}</h3>
              <p>Gross built area</p>
            </div>

            <div className="company">
              <span className="company-num">Units / Capacity</span>
              <h3>{p.unit_count ? `${p.unit_count.toLocaleString()}` : 'NOT AVAILABLE'}</h3>
              <p>Confirmed volume</p>
            </div>
          </div>

          {p.description && (
            <p style={{ color: '#b9b6ae', maxWidth: 740, lineHeight: 1.8, marginTop: 36, fontSize: 16 }}>
              {p.description}
            </p>
          )}
        </section>

        {/* Project Team & Consortium */}
        {team.length > 0 && (
          <section className="section shell">
            <div className="section-head">
              <div>
                <div className="eyebrow" style={{ color: '#c7a675' }}>Project Consortium</div>
                <h2>PROJECT TEAM & STAKEHOLDERS</h2>
              </div>
            </div>
            <div className="company-grid">
              {team.map(member => (
                <div className="company" key={`${member.id}-${member.role}`} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span className="company-num" style={{ textTransform: 'uppercase', color: '#c7a675' }}>
                      {ROLE_LABELS[member.role] || member.role.replaceAll('_', ' ')}
                    </span>
                    <h3 style={{ marginTop: 4 }}>
                      <CompanyIntelligencePreview
                        company={{
                          name: member.name,
                          slug: member.slug,
                          type: member.type,
                          location: member.location
                        }}
                      >
                        <Link href={`/companies/${member.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>
                          {member.name}
                        </Link>
                      </CompanyIntelligencePreview>
                    </h3>
                    <p style={{ marginTop: 6 }}>{member.type || 'Practice'}</p>
                  </div>
                  <footer style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #1a1e1c', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span>{member.location || 'Romania'}</span>
                    <Link href={`/companies/${member.slug}`} style={{ color: '#c7a675', fontWeight: 700, textDecoration: 'none' }}>
                      COMPANY DOSSIER →
                    </Link>
                  </footer>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Verified Signals & Milestone Progress */}
        {(latestProgress || signals.length > 0) && (
          <section className="section shell">
            <div className="section-head">
              <div>
                <div className="eyebrow" style={{ color: '#c7a675' }}>Verified Activity Stream</div>
                <h2>MILESTONES & MARKET SIGNALS</h2>
              </div>
            </div>

            {latestProgress && (
              <div
                style={{
                  background: '#141715',
                  border: '1px solid rgba(199, 166, 117, 0.4)',
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
                  <span style={{ fontSize: 12, textTransform: 'uppercase', color: '#c7a675', fontWeight: 800, letterSpacing: '0.08em' }}>
                    Latest Construction Progress Update
                  </span>
                  <h3 style={{ fontSize: 28, color: '#fff', margin: '6px 0 8px 0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                    {STAGES.find(s => s.value === latestProgress.stage)?.label || latestProgress.stage}
                  </h3>
                  {latestProgress.note && <p style={{ fontSize: 14, color: '#b9b6ae', margin: 0 }}>{latestProgress.note}</p>}
                  {latestProgress.progress_date && (
                    <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
                      Verified on {latestProgress.progress_date} {(latestProgress as any).source ? `· Source: ${(latestProgress as any).source}` : ''}
                    </div>
                  )}
                </div>

                {latestProgress.percentage !== null && latestProgress.percentage !== undefined && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 48, fontWeight: 800, color: '#c7a675', lineHeight: 1 }}>
                      {latestProgress.percentage}%
                    </div>
                    <span style={{ fontSize: 12, color: '#aaa9a1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Completion
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Signals List */}
            {signals.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 800 }}>
                {signals.map(s => (
                  <div
                    key={s.id}
                    style={{
                      padding: '14px 18px',
                      background: '#141715',
                      border: '1px solid #262927',
                      borderRadius: 6,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 12
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: '#38bdf8' }}>{s.signal_type.replaceAll('_', ' ')}</span>
                        <span style={{ fontSize: 11, color: '#888' }}>{s.event_date ? new Date(s.event_date).toLocaleDateString('en-GB') : 'RECENT'}</span>
                      </div>
                      <h4 style={{ margin: 0, fontSize: 15, color: '#fff', fontWeight: 700 }}>{s.title}</h4>
                      {s.summary && <p style={{ fontSize: 13, color: '#b5b3aa', margin: '4px 0 0 0' }}>{s.summary}</p>}
                    </div>

                    {s.source_url && (
                      <a href={s.source_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#c7a675', textDecoration: 'none', fontWeight: 700 }}>
                        Citation ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Media Gallery */}
        {media.length > 0 && (
          <section className="section shell">
            <div className="section-head">
              <div>
                <div className="eyebrow" style={{ color: '#c7a675' }}>Project Imagery</div>
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
              {media.map((item: any, i: number) => {
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

        {/* Related Stories */}
        {articles.length > 0 && (
          <section className="section shell">
            <div className="section-head">
              <div>
                <div className="eyebrow" style={{ color: '#c7a675' }}>Editorial Intelligence</div>
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

        {/* Presentation & Involvement Actions */}
        <section className="section shell" style={{ borderTop: '1px solid var(--line)', paddingTop: 60, paddingBottom: 60 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div style={{ padding: 24, background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <div className="eyebrow" style={{ color: '#c7a675' }}>Project Presentation</div>
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
              <div className="eyebrow" style={{ color: '#c7a675' }}>Stakeholder Attribution</div>
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
