'use client';

import {FormEvent, useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {LightweightContentEditor} from './LightweightContentEditor';

type Company = { id: string; name: string };
type Project = { id: string; name: string };

type ArticleData = {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  body?: string | null;
  category?: string | null;
  cover_image?: string | null;
  author?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  related_companies?: string[] | null;
  related_projects?: string[] | null;
  content_state?: 'draft' | 'review' | 'published' | 'archived' | string;
  published_at?: string | null;
};

export function EditorialEditor({
  initialArticle,
  companies = [],
  projects = []
}: {
  initialArticle?: ArticleData;
  companies: Company[];
  projects: Project[];
}) {
  const router = useRouter();
  const isNew = !initialArticle?.id;

  const [title, setTitle] = useState(initialArticle?.title || '');
  const [slug, setSlug] = useState(initialArticle?.slug || '');
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt || '');
  const [body, setBody] = useState(initialArticle?.body || '');
  const [category, setCategory] = useState(initialArticle?.category || 'Architecture & Development');
  const [coverImage, setCoverImage] = useState(initialArticle?.cover_image || '');
  const [author, setAuthor] = useState(initialArticle?.author || 'Editorial Desk');
  const [seoTitle, setSeoTitle] = useState(initialArticle?.seo_title || '');
  const [seoDesc, setSeoDesc] = useState(initialArticle?.seo_description || '');
  const [relatedCompanies, setRelatedCompanies] = useState<string[]>(initialArticle?.related_companies || []);
  const [relatedProjects, setRelatedProjects] = useState<string[]>(initialArticle?.related_projects || []);
  const [status, setStatus] = useState<string>(initialArticle?.content_state || 'draft');

  const [notice, setNotice] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; msg: string }>({
    type: 'idle',
    msg: ''
  });

  function autoSlug(text: string) {
    setTitle(text);
    if (isNew && !slug) {
      setSlug(text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }

  function toggleCompany(id: string) {
    if (relatedCompanies.includes(id)) {
      setRelatedCompanies(relatedCompanies.filter(x => x !== id));
    } else {
      setRelatedCompanies([...relatedCompanies, id]);
    }
  }

  function toggleProject(id: string) {
    if (relatedProjects.includes(id)) {
      setRelatedProjects(relatedProjects.filter(x => x !== id));
    } else {
      setRelatedProjects([...relatedProjects, id]);
    }
  }

  async function handleSave(desiredStatus?: string) {
    const nextStatus = desiredStatus || status;
    if (!title.trim() || !slug.trim()) {
      setNotice({ type: 'error', msg: 'Title and Slug are required.' });
      return;
    }

    if (desiredStatus === 'archived' && !window.confirm('Archive this article? It will no longer be visible publicly.')) {
      return;
    }

    setNotice({ type: 'loading', msg: 'Saving editorial article…' });

    const payload = {
      title,
      slug,
      excerpt,
      body,
      category,
      cover_image: coverImage || null,
      author,
      seo_title: seoTitle || title,
      seo_description: seoDesc || excerpt || null,
      related_companies: relatedCompanies,
      related_projects: relatedProjects,
      content_state: nextStatus
    };

    try {
      if (isNew) {
        const res = await fetch('/api/admin/editorial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) {
          setNotice({ type: 'error', msg: data.error || 'Failed to create article.' });
          return;
        }
        setNotice({ type: 'success', msg: 'Article created successfully. Redirecting…' });
        router.push(`/admin/editorial/${data.id}/edit`);
      } else {
        const res = await fetch(`/api/admin/editorial_content/${initialArticle.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) {
          setNotice({ type: 'error', msg: data.error || 'Failed to update article.' });
          return;
        }
        setStatus(nextStatus);
        setNotice({
          type: 'success',
          msg: `Article saved with status: ${nextStatus.toUpperCase()}.`
        });
      }
    } catch {
      setNotice({ type: 'error', msg: 'Network error saving article.' });
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <Link href="/admin/editorial" className="btn">
          ← Back to All Articles
        </Link>
        {!isNew && (
          <div style={{ display: 'flex', gap: 8 }}>
            <a
              href={`/editorial/${slug}?preview=true`}
              target="_blank"
              rel="noreferrer"
              className="btn"
              style={{ borderColor: '#d4af37', color: '#d4af37' }}
            >
              Preview Draft ↗
            </a>
          </div>
        )}
      </div>

      <div className="eyebrow">{isNew ? 'New Editorial Piece' : 'Edit Article'}</div>
      <h1 className="admin-title" style={{ marginBottom: 8 }}>
        {isNew ? 'CREATE EDITORIAL STORY' : title.toUpperCase()}
      </h1>
      <p style={{ color: '#aaa9a1', fontSize: 14, marginBottom: 20 }}>
        Current State:{' '}
        <span className="tag" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {status}
        </span>
      </p>

      {notice.msg && (
        <div
          style={{
            padding: '10px 14px',
            marginBottom: 16,
            fontSize: 13,
            borderRadius: 4,
            background: notice.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            color: notice.type === 'error' ? '#fca5a5' : '#86efac',
            border: `1px solid ${notice.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
          }}
        >
          {notice.msg}
        </div>
      )}

      {/* Action Workflow Buttons */}
      <section className="admin-panel" style={{ marginBottom: 24 }}>
        <div className="eyebrow">Publication Workflow</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn"
            style={{
              background: status === 'draft' ? '#444' : '#141715',
              color: '#fff',
              fontWeight: 600
            }}
            onClick={() => handleSave('draft')}
          >
            Save as Draft
          </button>
          <button
            type="button"
            className="btn"
            style={{
              background: status === 'review' ? '#3b82f6' : '#141715',
              color: '#fff',
              borderColor: status === 'review' ? '#3b82f6' : '#333'
            }}
            onClick={() => handleSave('review')}
          >
            Submit for Review
          </button>
          <button
            type="button"
            className="btn"
            style={{
              background: status === 'published' ? '#10b981' : '#141715',
              color: '#fff',
              borderColor: status === 'published' ? '#10b981' : '#333',
              fontWeight: 700
            }}
            onClick={() => handleSave('published')}
          >
            ✓ Publish Live
          </button>
          {status === 'published' && (
            <button
              type="button"
              className="btn"
              style={{ color: '#fde047' }}
              onClick={() => handleSave('draft')}
            >
              Unpublish to Draft
            </button>
          )}
          <button
            type="button"
            className="btn"
            style={{ color: '#fca5a5' }}
            onClick={() => handleSave('archived')}
          >
            Archive Article
          </button>
        </div>
      </section>

      {/* Form Fields */}
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          handleSave();
        }}
        className="form-grid admin-panel"
      >
        <label className="full">
          <span className="form-label">Article Title</span>
          <input
            value={title}
            onChange={e => autoSlug(e.target.value)}
            required
            placeholder="e.g. Inside the Structural Feats of Modern Urban Ensembles"
          />
        </label>

        <label>
          <span className="form-label">URL Slug</span>
          <input
            value={slug}
            onChange={e => setSlug(e.target.value)}
            required
            placeholder="inside-structural-feats"
          />
        </label>

        <label>
          <span className="form-label">Editorial Category</span>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="Architecture & Development">Architecture & Development</option>
            <option value="Engineering Insights">Engineering Insights</option>
            <option value="Market Intelligence">Market Intelligence</option>
            <option value="Project Showcase">Project Showcase</option>
            <option value="Material & Craft">Material & Craft</option>
          </select>
        </label>

        <label>
          <span className="form-label">Author / Byline</span>
          <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Editorial Desk" />
        </label>

        <label>
          <span className="form-label">Cover Image URL</span>
          <input
            value={coverImage}
            onChange={e => setCoverImage(e.target.value)}
            placeholder="https://images.unsplash.com/…"
          />
        </label>

        <label className="full">
          <span className="form-label">Excerpt / Executive Summary</span>
          <textarea
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            rows={3}
            placeholder="Short editorial summary introducing the narrative…"
          />
        </label>

        {/* Rich Content Editor */}
        <div className="full" style={{ marginTop: 12 }}>
          <span className="form-label">Article Narrative & Rich Content</span>
          <LightweightContentEditor value={body} onChange={setBody} />
        </div>

        {/* Related Entities */}
        <div className="full" style={{ marginTop: 16 }}>
          <span className="form-label">Related Companies (Mentioned / Featured)</span>
          <div
            style={{
              maxHeight: 180,
              overflowY: 'auto',
              border: '1px solid #262927',
              padding: 12,
              borderRadius: 6,
              background: '#141715',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 8
            }}
          >
            {companies.map(c => {
              const checked = relatedCompanies.includes(c.id);
              return (
                <label
                  key={c.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggleCompany(c.id)} />
                  <span style={{ color: checked ? '#d4af37' : '#e5e5e5' }}>{c.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="full" style={{ marginTop: 10 }}>
          <span className="form-label">Related Projects</span>
          <div
            style={{
              maxHeight: 180,
              overflowY: 'auto',
              border: '1px solid #262927',
              padding: 12,
              borderRadius: 6,
              background: '#141715',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 8
            }}
          >
            {projects.map(p => {
              const checked = relatedProjects.includes(p.id);
              return (
                <label
                  key={p.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggleProject(p.id)} />
                  <span style={{ color: checked ? '#d4af37' : '#e5e5e5' }}>{p.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* SEO Meta */}
        <label className="full" style={{ marginTop: 14 }}>
          <span className="form-label">Custom SEO Title</span>
          <input
            value={seoTitle}
            onChange={e => setSeoTitle(e.target.value)}
            placeholder={title || 'Search title'}
          />
        </label>

        <label className="full">
          <span className="form-label">Custom SEO Meta Description</span>
          <textarea
            value={seoDesc}
            onChange={e => setSeoDesc(e.target.value)}
            rows={2}
            placeholder={excerpt || 'Search description'}
          />
        </label>

        <div className="full" style={{ marginTop: 16 }}>
          <button type="submit" className="btn fill" disabled={notice.type === 'loading'}>
            {notice.type === 'loading' ? 'Saving…' : 'Save Article'}
          </button>
        </div>
      </form>
    </div>
  );
}
