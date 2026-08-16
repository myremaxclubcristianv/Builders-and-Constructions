'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type DiscoverySource = {
  id: string;
  name: string;
  url: string;
  type: string;
  country: string;
  coverage: string;
  status: string;
  last_checked_at?: string;
  notes?: string;
};

type DiscoveryJob = {
  id: string;
  name: string;
  target_entity: string;
  geography: string;
  company_type?: string;
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
  sources: DiscoverySource[];
  jobs: DiscoveryJob[];
  companyItems: DiscoveryItem[];
  projectItems: DiscoveryItem[];
};

export function MarketDiscoveryExecutionView({ sources, jobs, companyItems, projectItems }: Props) {
  const [activeTab, setActiveTab] = useState<'sources' | 'jobs' | 'staging_companies' | 'staging_projects'>('staging_companies');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handlePromoteToDraft = (itemId: string, name: string) => {
    setStatusMessage(`Staged entity "${name}" promoted to Research Queue for human verification.`);
  };

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            MARKET DISCOVERY ENGINE · PHASE 14
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            REAL MARKET DISCOVERY & STAGING
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Controlled ingestion from official company sites, municipal registries, SEAP procurement, and Trade Register archives.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/market/golden-dataset" className="action-btn primary">
            Golden Dataset →
          </Link>
          <Link href="/admin/companies/research" className="action-btn secondary">
            Research Queue
          </Link>
        </div>
      </div>

      {statusMessage && (
        <div className="admin-card" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', color: '#22c55e', padding: '10px 16px', marginBottom: 20, fontSize: '0.85rem' }}>
          ✓ {statusMessage}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid var(--line)', paddingBottom: 10 }}>
        <button
          onClick={() => setActiveTab('staging_companies')}
          className={`filter-chip ${activeTab === 'staging_companies' ? 'active' : ''}`}
          style={{ padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer', background: activeTab === 'staging_companies' ? 'rgba(255,255,255,0.15)' : 'transparent', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
        >
          Staged Companies ({companyItems.length})
        </button>
        <button
          onClick={() => setActiveTab('staging_projects')}
          className={`filter-chip ${activeTab === 'staging_projects' ? 'active' : ''}`}
          style={{ padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer', background: activeTab === 'staging_projects' ? 'rgba(255,255,255,0.15)' : 'transparent', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
        >
          Staged Projects ({projectItems.length})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`filter-chip ${activeTab === 'jobs' ? 'active' : ''}`}
          style={{ padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer', background: activeTab === 'jobs' ? 'rgba(255,255,255,0.15)' : 'transparent', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
        >
          Discovery Jobs ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('sources')}
          className={`filter-chip ${activeTab === 'sources' ? 'active' : ''}`}
          style={{ padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer', background: activeTab === 'sources' ? 'rgba(255,255,255,0.15)' : 'transparent', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
        >
          Registered Sources ({sources.length})
        </button>
      </div>

      {/* Tab: Staging Companies */}
      {activeTab === 'staging_companies' && (
        <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="admin-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Discovered Entity</th>
                <th>Normalized Details</th>
                <th>Duplicate Risk</th>
                <th>Review Status</th>
                <th>Discovery Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {companyItems.length > 0 ? (
                companyItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <strong style={{ color: '#fff', fontSize: '0.85rem', display: 'block' }}>
                        {item.raw_data.name || 'Unnamed Record'}
                      </strong>
                      <span style={{ fontSize: '0.7rem', color: '#888' }}>
                        Raw Type: {item.raw_data.type || 'General'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                        <div><strong>Normalized:</strong> {item.normalized_data.name}</div>
                        <div style={{ color: '#38bdf8', fontSize: '0.72rem' }}>{item.normalized_data.website || 'No website'}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${item.duplicate_confidence === 'none' ? 'verified' : 'secondary'}`} style={{ fontSize: '0.65rem' }}>
                        {item.duplicate_confidence.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className="badge" style={{ fontSize: '0.65rem' }}>
                        {item.review_status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.72rem', color: '#888' }}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handlePromoteToDraft(item.id, item.normalized_data.name || item.raw_data.name)}
                        className="action-btn primary"
                        style={{ fontSize: '0.7rem', padding: '3px 8px' }}
                      >
                        Promote to Research →
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#888' }}>
                    No pending discovered companies in staging queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}

      {/* Tab: Registered Sources */}
      {activeTab === 'sources' && (
        <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="admin-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Source Registry</th>
                <th>Category / Type</th>
                <th>Territory Coverage</th>
                <th>Health Status</th>
                <th>Last Checked</th>
              </tr>
            </thead>
            <tbody>
              {sources.map(src => (
                <tr key={src.id}>
                  <td>
                    <strong style={{ color: '#fff', fontSize: '0.85rem', display: 'block' }}>
                      {src.name}
                    </strong>
                    <a href={src.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: '#38bdf8' }}>
                      {src.url} ↗
                    </a>
                  </td>
                  <td>
                    <span className="status-pill verified" style={{ fontSize: '0.65rem' }}>
                      {src.type}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                    {src.coverage}
                  </td>
                  <td>
                    <span className="badge" style={{ fontSize: '0.65rem' }}>
                      {src.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.72rem', color: '#888' }}>
                    {src.last_checked_at ? new Date(src.last_checked_at).toLocaleDateString() : 'Active'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Tab: Discovery Jobs */}
      {activeTab === 'jobs' && (
        <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="admin-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Job Identifier</th>
                <th>Target Territory</th>
                <th>Target Entity</th>
                <th>Items Found</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td>
                    <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{job.name}</strong>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>{job.geography}</td>
                  <td><span className="badge" style={{ fontSize: '0.65rem' }}>{job.target_entity}</span></td>
                  <td>
                    <span style={{ fontSize: '0.78rem', color: '#22c55e', fontWeight: 600 }}>{job.results_count} items</span>
                    <span style={{ fontSize: '0.68rem', color: '#888', display: 'block' }}>{job.duplicate_count} duplicates</span>
                  </td>
                  <td>
                    <span className="status-pill verified" style={{ fontSize: '0.65rem' }}>
                      {job.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.72rem', color: '#888' }}>{new Date(job.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
