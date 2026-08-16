'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

type DiscoveryJob = {
  id: string;
  name: string;
  target_entity: string;
  geography?: string | null;
  company_type?: string | null;
  status: string;
  results_count: number;
  discovered_count: number;
  duplicate_count: number;
  created_at: string;
};

type DiscoveryItem = {
  id: string;
  job_id: string;
  entity_type: string;
  raw_data: Record<string, any>;
  normalized_data: Record<string, any>;
  duplicate_confidence: string;
  review_status: string;
  created_at: string;
};

type Props = {
  jobs: DiscoveryJob[];
  companyItems: DiscoveryItem[];
  projectItems: DiscoveryItem[];
};

export function DiscoveryJobsView({ jobs: initialJobs, companyItems: initialCompanies, projectItems: initialProjects }: Props) {
  const [jobs, setJobs] = useState<DiscoveryJob[]>(initialJobs);
  const [companies, setCompanies] = useState<DiscoveryItem[]>(initialCompanies);
  const [projects, setProjects] = useState<DiscoveryItem[]>(initialProjects);

  const [activeTab, setActiveTab] = useState<'jobs' | 'companies' | 'projects'>('companies');
  const [showNewJob, setShowNewJob] = useState(false);

  // Form for initiating discovery
  const [jobName, setJobName] = useState('');
  const [targetEntity, setTargetEntity] = useState<'company' | 'project'>('company');
  const [geography, setGeography] = useState('Bucharest');
  const [rawText, setRawText] = useState(`name,website,location,type
Bog'Art,https://bogart.ro,Bucharest,General Contractor
Strabag Romania,https://strabag.ro,Bucharest,General Contractor
Porr Construct,https://porr.ro,Bucharest,Infrastructure`);

  const [notice, setNotice] = useState('');

  async function handleCreateJob(e: FormEvent) {
    e.preventDefault();
    if (!jobName.trim()) return;

    setNotice('Initiating discovery ingestion and normalization pipeline…');
    const lines = rawText.trim().split('\n');
    if (lines.length < 2) return;

    const headers = lines[0].split(',').map(h => h.trim());
    const rawItems = lines.slice(1).map(line => {
      const vals = line.split(',').map(v => v.trim());
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h] = vals[i] || '';
      });
      return obj;
    });

    const res = await fetch('/api/admin/discovery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: jobName.trim(),
        targetEntity,
        geography,
        rawItems
      })
    });

    if (res.ok) {
      const data = await res.json();
      setNotice(`Job created! ${data.discoveredCount} new items staged for review.`);
      setShowNewJob(false);
      setJobName('');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  async function handleReviewAction(itemId: string, action: 'approve' | 'ignore' | 'not_a_fit') {
    await fetch('/api/admin/discovery/items', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, action })
    });

    setCompanies(companies.filter(c => c.id !== itemId));
    setProjects(projects.filter(p => p.id !== itemId));
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            Multi-Source Ingestion & Duplicate Gatekeeper
          </div>
          <h1 className="admin-title" style={{ margin: '4px 0 0 0' }}>
            MARKET DISCOVERY & INGESTION STAGING
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            className="btn fill"
            onClick={() => setShowNewJob(!showNewJob)}
          >
            {showNewJob ? 'Cancel' : '+ Run Discovery Job'}
          </button>
          <Link href="/admin/sources" className="btn">
            Source Registry →
          </Link>
        </div>
      </div>

      {notice && (
        <div style={{ padding: '10px 14px', marginBottom: 20, borderRadius: 4, background: 'rgba(212, 175, 55, 0.15)', color: '#d4af37', border: '1px solid rgba(212, 175, 55, 0.3)', fontSize: 13 }}>
          {notice}
        </div>
      )}

      {showNewJob && (
        <form onSubmit={handleCreateJob} className="form-grid admin-panel" style={{ marginBottom: 28, background: '#141715', border: '1px solid #d4af37' }}>
          <div className="full">
            <span className="form-label">Discovery Job Title *</span>
            <input value={jobName} onChange={e => setJobName(e.target.value)} placeholder="e.g. Bucharest Commercial Contractors Intake" required />
          </div>

          <label>
            <span className="form-label">Target Entity</span>
            <select value={targetEntity} onChange={e => setTargetEntity(e.target.value as any)}>
              <option value="company">Companies</option>
              <option value="project">Projects</option>
            </select>
          </label>

          <label>
            <span className="form-label">Target Geography</span>
            <input value={geography} onChange={e => setGeography(e.target.value)} />
          </label>

          <label className="full">
            <span className="form-label">Raw Discovery Input (CSV Format with Headers)</span>
            <textarea value={rawText} onChange={e => setRawText(e.target.value)} rows={6} style={{ fontFamily: 'monospace', fontSize: 12 }} required />
          </label>

          <div className="full">
            <button type="submit" className="btn fill">
              Stage Discovery Records →
            </button>
          </div>
        </form>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button
          type="button"
          className="btn"
          style={{ background: activeTab === 'companies' ? '#d4af37' : '#141715', color: activeTab === 'companies' ? '#000' : '#fff', fontWeight: 700 }}
          onClick={() => setActiveTab('companies')}
        >
          Discovered Companies ({companies.length})
        </button>
        <button
          type="button"
          className="btn"
          style={{ background: activeTab === 'projects' ? '#d4af37' : '#141715', color: activeTab === 'projects' ? '#000' : '#fff', fontWeight: 700 }}
          onClick={() => setActiveTab('projects')}
        >
          Discovered Projects ({projects.length})
        </button>
        <button
          type="button"
          className="btn"
          style={{ background: activeTab === 'jobs' ? '#d4af37' : '#141715', color: activeTab === 'jobs' ? '#000' : '#fff', fontWeight: 700 }}
          onClick={() => setActiveTab('jobs')}
        >
          Discovery Jobs ({jobs.length})
        </button>
      </div>

      {/* Discovered Companies Staging Table */}
      {activeTab === 'companies' && (
        <div className="admin-panel">
          <div className="eyebrow">Staged Companies</div>
          <h2 style={{ fontSize: 18, margin: '4px 0 16px 0' }}>REVIEW & NORMALIZE BEFORE DRAFT CREATION</h2>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Discovered Entity</th>
                <th>Normalized Name & Type</th>
                <th>City / Location</th>
                <th>Duplicate Check</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.length > 0 ? (
                companies.map(item => {
                  const norm = item.normalized_data || {};
                  return (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.raw_data.name || 'Unknown'}</strong>
                        {norm.website && (
                          <div style={{ fontSize: 11, color: '#888' }}>
                            <a href={norm.website} target="_blank" rel="noreferrer" style={{ color: '#d4af37' }}>
                              {norm.website} ↗
                            </a>
                          </div>
                        )}
                      </td>
                      <td>
                        <div>{norm.name}</div>
                        <span className="badge" style={{ fontSize: 10 }}>{norm.type}</span>
                      </td>
                      <td>{norm.city || 'Romania'}</td>
                      <td>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: 3,
                            background: item.duplicate_confidence === 'high' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)',
                            color: item.duplicate_confidence === 'high' ? '#fca5a5' : '#86efac'
                          }}
                        >
                          {item.duplicate_confidence === 'high' ? 'Possible Duplicate' : 'Unique Record'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            type="button"
                            className="btn fill"
                            style={{ padding: '3px 8px', fontSize: 11, background: '#86efac', color: '#000', fontWeight: 700 }}
                            onClick={() => handleReviewAction(item.id, 'approve')}
                          >
                            ✓ Create Draft
                          </button>
                          <button
                            type="button"
                            className="btn"
                            style={{ padding: '3px 8px', fontSize: 11 }}
                            onClick={() => handleReviewAction(item.id, 'ignore')}
                          >
                            Ignore
                          </button>
                          <button
                            type="button"
                            className="btn"
                            style={{ padding: '3px 8px', fontSize: 11, color: '#fca5a5' }}
                            onClick={() => handleReviewAction(item.id, 'not_a_fit')}
                          >
                            Not a Fit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="empty">
                    No pending discovered companies in staging queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Discovered Projects Staging Table */}
      {activeTab === 'projects' && (
        <div className="admin-panel">
          <div className="eyebrow">Staged Projects</div>
          <h2 style={{ fontSize: 18, margin: '4px 0 16px 0' }}>REVIEW & NORMALIZE DISCOVERED DEVELOPMENTS</h2>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Type & Status</th>
                <th>Location</th>
                <th>Duplicate Check</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 ? (
                projects.map(item => {
                  const norm = item.normalized_data || {};
                  return (
                    <tr key={item.id}>
                      <td><strong>{norm.name}</strong></td>
                      <td>
                        {norm.type} · <span style={{ color: '#86efac' }}>{norm.status}</span>
                      </td>
                      <td>{norm.location}</td>
                      <td>
                        <span className="badge">{item.duplicate_confidence}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            type="button"
                            className="btn fill"
                            style={{ padding: '3px 8px', fontSize: 11, background: '#86efac', color: '#000' }}
                            onClick={() => handleReviewAction(item.id, 'approve')}
                          >
                            ✓ Create Draft
                          </button>
                          <button
                            type="button"
                            className="btn"
                            style={{ padding: '3px 8px', fontSize: 11 }}
                            onClick={() => handleReviewAction(item.id, 'ignore')}
                          >
                            Ignore
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="empty">
                    No pending discovered projects in staging queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Discovery Jobs History Table */}
      {activeTab === 'jobs' && (
        <div className="admin-panel">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Target</th>
                <th>Geography</th>
                <th>Results</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.id}>
                  <td><strong>{j.name}</strong></td>
                  <td>{j.target_entity}</td>
                  <td>{j.geography || 'Romania'}</td>
                  <td>
                    {j.discovered_count} new · {j.duplicate_count} dup
                  </td>
                  <td>
                    <span className="badge" style={{ textTransform: 'uppercase' }}>{j.status}</span>
                  </td>
                  <td style={{ fontSize: 12, color: '#888' }}>
                    {new Date(j.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
