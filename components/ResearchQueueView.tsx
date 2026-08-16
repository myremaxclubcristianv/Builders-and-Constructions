'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

type QueueItem = {
  id: string;
  name: string;
  slug: string;
  type: string;
  location?: string | null;
  status?: string;
  research_state: string;
  content_state: string;
  website_verification?: string;
  status_verification?: string;
  completeness: number;
  opportunity_score?: number;
  activity_score?: number;
  assigned_researcher_email?: string | null;
  updated_at: string;
};

type Props = {
  companies: QueueItem[];
  projects: QueueItem[];
  metrics: {
    unresearched: number;
    researching: number;
    verifying: number;
    ready: number;
    published: number;
  };
};

export function ResearchQueueView({ companies, projects, metrics }: Props) {
  const [activeTab, setActiveTab] = useState<'all' | 'unresearched' | 'researching' | 'verifying' | 'ready' | 'published'>('all');
  const [entityFilter, setEntityFilter] = useState<'all' | 'companies' | 'projects'>('all');
  const [search, setSearch] = useState('');

  const allItems = useMemo(() => {
    const list: Array<QueueItem & { entity: 'company' | 'project' }> = [];
    if (entityFilter === 'all' || entityFilter === 'companies') {
      companies.forEach(c => list.push({ ...c, entity: 'company' }));
    }
    if (entityFilter === 'all' || entityFilter === 'projects') {
      projects.forEach(p => list.push({ ...p, entity: 'project' }));
    }

    return list.filter(item => {
      if (activeTab === 'published' && item.content_state !== 'published') return false;
      if (activeTab !== 'all' && activeTab !== 'published' && item.research_state !== activeTab) return false;
      if (search && !`${item.name} ${item.type} ${item.location || ''}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [companies, projects, activeTab, entityFilter, search]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            Central Construction Intelligence Pipeline
          </div>
          <h1 className="admin-title" style={{ margin: '4px 0 0 0' }}>
            RESEARCH QUEUE & VERIFICATION
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/companies/research" className="btn fill">
            + Research Company
          </Link>
          <Link href="/admin/projects/research" className="btn">
            + Research Project
          </Link>
          <Link href="/admin/import" className="btn">
            Import CSV
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: 24 }}>
        <div
          className="metric"
          onClick={() => setActiveTab('all')}
          style={{ cursor: 'pointer', background: activeTab === 'all' ? '#222' : undefined }}
        >
          <span className="eyebrow">ALL QUEUE</span>
          <strong>{companies.length + projects.length}</strong>
        </div>
        <div
          className="metric"
          onClick={() => setActiveTab('unresearched')}
          style={{ cursor: 'pointer', background: activeTab === 'unresearched' ? '#222' : undefined }}
        >
          <span className="eyebrow">UNRESEARCHED</span>
          <strong>{metrics.unresearched}</strong>
        </div>
        <div
          className="metric"
          onClick={() => setActiveTab('researching')}
          style={{ cursor: 'pointer', background: activeTab === 'researching' ? '#222' : undefined }}
        >
          <span className="eyebrow">RESEARCHING</span>
          <strong>{metrics.researching}</strong>
        </div>
        <div
          className="metric"
          onClick={() => setActiveTab('verifying')}
          style={{ cursor: 'pointer', borderColor: '#fde047', background: activeTab === 'verifying' ? '#222' : undefined }}
        >
          <span className="eyebrow" style={{ color: '#fde047' }}>VERIFYING</span>
          <strong style={{ color: '#fde047' }}>{metrics.verifying}</strong>
        </div>
        <div
          className="metric"
          onClick={() => setActiveTab('ready')}
          style={{ cursor: 'pointer', borderColor: '#86efac', background: activeTab === 'ready' ? '#222' : undefined }}
        >
          <span className="eyebrow" style={{ color: '#86efac' }}>READY TO PUBLISH</span>
          <strong style={{ color: '#86efac' }}>{metrics.ready}</strong>
        </div>
        <div
          className="metric"
          onClick={() => setActiveTab('published')}
          style={{ cursor: 'pointer', borderColor: '#d4af37', background: activeTab === 'published' ? '#222' : undefined }}
        >
          <span className="eyebrow" style={{ color: '#d4af37' }}>PUBLISHED</span>
          <strong style={{ color: '#d4af37' }}>{metrics.published}</strong>
        </div>
      </div>

      {/* Toolbar */}
      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <div className="admin-toolbar" style={{ flexWrap: 'wrap', gap: 12 }}>
          <input
            placeholder="Search records in queue..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 220 }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn"
              style={{ background: entityFilter === 'all' ? '#d4af37' : '#141715', color: entityFilter === 'all' ? '#000' : '#fff' }}
              onClick={() => setEntityFilter('all')}
            >
              All Entities
            </button>
            <button
              type="button"
              className="btn"
              style={{ background: entityFilter === 'companies' ? '#d4af37' : '#141715', color: entityFilter === 'companies' ? '#000' : '#fff' }}
              onClick={() => setEntityFilter('companies')}
            >
              Companies ({companies.length})
            </button>
            <button
              type="button"
              className="btn"
              style={{ background: entityFilter === 'projects' ? '#d4af37' : '#141715', color: entityFilter === 'projects' ? '#000' : '#fff' }}
              onClick={() => setEntityFilter('projects')}
            >
              Projects ({projects.length})
            </button>
          </div>
        </div>
      </div>

      {/* Queue Table */}
      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Record</th>
              <th>Type / Scope</th>
              <th>Research State</th>
              <th>Completeness</th>
              <th>Opportunity / Activity</th>
              <th>Assigned</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allItems.length > 0 ? (
              allItems.map(item => (
                <tr key={`${item.entity}-${item.id}`}>
                  <td>
                    <span className="badge" style={{ textTransform: 'uppercase', marginRight: 6 }}>
                      {item.entity}
                    </span>
                    <strong>{item.name}</strong>
                    <div style={{ fontSize: 11, color: '#888' }}>{item.location || 'Romania'}</div>
                  </td>
                  <td>{item.type}</td>
                  <td>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: 3,
                        background:
                          item.research_state === 'ready'
                            ? 'rgba(16,185,129,0.2)'
                            : item.research_state === 'researching'
                            ? 'rgba(253,224,71,0.2)'
                            : '#222',
                        color:
                          item.research_state === 'ready'
                            ? '#86efac'
                            : item.research_state === 'researching'
                            ? '#fde047'
                            : '#aaa'
                      }}
                    >
                      {item.research_state}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 60, height: 6, background: '#222', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${item.completeness}%`, height: '100%', background: item.completeness >= 80 ? '#86efac' : '#d4af37' }} />
                      </div>
                      <span style={{ fontSize: 11 }}>{item.completeness}%</span>
                    </div>
                  </td>
                  <td>
                    {item.entity === 'company' ? (
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#d4af37' }}>
                        {item.opportunity_score ?? 50}/100 Opp
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#86efac' }}>
                        {item.activity_score ?? 50}/100 Act
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: 11, color: '#888' }}>
                    {item.assigned_researcher_email ? item.assigned_researcher_email.split('@')[0] : 'Unassigned'}
                  </td>
                  <td>
                    {item.entity === 'company' ? (
                      <Link href={`/admin/companies/${item.id}/edit`} className="link-arrow">
                        Research →
                      </Link>
                    ) : (
                      <Link href={`/admin/projects/${item.id}/edit`} className="link-arrow">
                        Research →
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="empty">
                  No records found in this queue state.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
