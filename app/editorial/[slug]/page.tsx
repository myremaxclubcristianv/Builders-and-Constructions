import {notFound} from 'next/navigation';
import Link from 'next/link';
import type {Metadata} from 'next';
import {getArticleBySlug} from '@/lib/data';
import {getAdminIdentity} from '@/lib/admin-auth';
import {sanitizeHtml} from '@/lib/sanitize';
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
  const data = await getArticleBySlug(slug, isPreview);

  if (!data?.article) {
    return { title: 'Article Not Found' };
  }

  const art = data.article;
  const isIndexable = art.published_at && !isPreview;

  return {
    title: art.seo_title || art.title,
    description: art.seo_description || art.excerpt || 'Editorial reporting on the built environment.',
    alternates: {
      canonical: `https://constructions.aixluxury.com/editorial/${art.slug}`
    },
    robots: {
      index: Boolean(isIndexable),
      follow: Boolean(isIndexable)
    }
  };
}

export default async function EditorialStoryPage({
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

  const data = await getArticleBySlug(slug, isPreviewAllowed);
  if (!data?.article) notFound();

  const { article: art, relatedCompanies, relatedProjects } = data;
  const safeBody = sanitizeHtml(art.body || '');

  return (
    <>
      <SiteHeader />
      <main>
        {isPreviewAllowed && (
          <div style={{ background: '#d4af37', color: '#000', padding: '10px 24px', textAlign: 'center', fontWeight: 700, fontSize: 13, letterSpacing: '0.05em' }}>
            ADMIN PREVIEW MODE — DRAFT EDITORIAL PIECE (NOT VISIBLE ANONYMOUSLY)
          </div>
        )}

        <article className="shell" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 840, margin: '0 auto' }}>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            {art.category || 'Architecture & Development'}
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', letterSpacing: '-0.04em', lineHeight: 1.1, margin: '12px 0 20px 0' }}>
            {art.title}
          </h1>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 13, color: '#aaa9a1', marginBottom: 32, flexWrap: 'wrap' }}>
            <span>By {art.author || 'Editorial Team'}</span>
            {art.published_at && (
              <span>· Published {new Date(art.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            )}
          </div>

          {art.cover_image && (
            <div style={{ marginBottom: 40, borderRadius: 8, overflow: 'hidden', background: '#0a0c0b' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={art.cover_image}
                alt={art.title}
                style={{ width: '100%', maxHeight: 480, objectFit: 'cover' }}
              />
            </div>
          )}

          {art.excerpt && (
            <p style={{ fontSize: 20, lineHeight: 1.6, color: '#e5e5e5', fontStyle: 'italic', marginBottom: 36, borderLeft: '2px solid #d4af37', paddingLeft: 20 }}>
              {art.excerpt}
            </p>
          )}

          {safeBody ? (
            <div
              className="editorial-body"
              style={{
                fontSize: 16,
                lineHeight: 1.85,
                color: '#d1cfc7'
              }}
              dangerouslySetInnerHTML={{ __html: safeBody }}
            />
          ) : (
            <p style={{ color: '#888' }}>Article narrative in preparation.</p>
          )}

          {/* Related Companies mentioned */}
          {relatedCompanies.length > 0 && (
            <div style={{ marginTop: 60, borderTop: '1px solid #262927', paddingTop: 30 }}>
              <div className="eyebrow">Featured Entities</div>
              <h3 style={{ fontSize: 18, marginTop: 4, marginBottom: 14 }}>COMPANIES IN THIS STORY</h3>
              <div className="company-grid">
                {relatedCompanies.map(c => (
                  <Link href={`/companies/${c.slug}`} className="company" key={c.id}>
                    <span className="company-num">{c.type?.replaceAll('_', ' ')}</span>
                    <h3>{c.name}</h3>
                    <p>View company profile →</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div style={{ marginTop: 40, borderTop: '1px solid #262927', paddingTop: 30 }}>
              <div className="eyebrow">Project References</div>
              <h3 style={{ fontSize: 18, marginTop: 4, marginBottom: 14 }}>CONNECTED DEVELOPMENTS</h3>
              <div className="company-grid">
                {relatedProjects.map(p => (
                  <Link href={`/projects/${p.slug}`} className="company" key={p.id}>
                    <span className="company-num" style={{ textTransform: 'capitalize' }}>
                      {p.status?.replaceAll('_', ' ')}
                    </span>
                    <h3>{p.name}</h3>
                    <p>View project intelligence →</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
