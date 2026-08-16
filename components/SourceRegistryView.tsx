'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

type Source = {
  id: string;
  name: string;
  url: string;
  type: string;
  country: string;
  coverage?: string | null;
  status: string;
  last_checked_at?: string | null;
  notes?: string | null;
};

export function SourceRegistryView({ sources: initialSources }: { sources: Source[] }) {
  const [sources, setSources] = useState<Source[]>(initialSources);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('OFFICIAL_WEBSITE');
  const [coverage, setCoverage] = useState('National');
  const [notes, setNotes] = useState('');
  const [notice, setNotice] = useState('');

  async function handleAddSource(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    setNotice('Registering verified source…');
    const res = await fetch('/api/admin/discovery-sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        url: url.trim(),
        type,
        coverage: coverage.trim() || null,
        notes: notes.trim() || null
      })
    });

    if (res.ok) {
      const created = await res.json();
      setSources([created, ...sources]);
      setName('');
      setUrl('');
      setNotes('');
      setShowAdd(false);
      setNotice('Source registered successfully.');
      setTimeout(() => setNotice(''), 3000);
    }
  }

  async function handleToggleStatus(id: string, currentStatus: string) {
    const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
    await fetch('/api/admin/discovery-sources', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: nextStatus })
    });
    setSources(sources.map(s => (s.id === id ? { ...s, status: nextStatus } : s)));
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            Authoritative Intelligence Sources
          </div>
          <h1 className="admin-title" style={{ margin: '4px 0 0 0' }}>
            VERIFIED SOURCE REGISTRY
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            className="btn fill"
            onClick={() => setShowAdd(!showAdd)}
          >
            {showAdd ? 'Cancel' : '+ Register New Source'}
          </button>
          <Link href="/admin/discovery" className="btn">
            Discovery Jobs →
          </Link>
        </div>
      </div>

      {notice && (
        <div style={{ padding: '10px 14px', marginBottom: 20, borderRadius: 4, background: 'rgba(212, 175, 55, 0.15)', color: '#d4af37', border: '1px solid rgba(212, 175, 55, 0.3)', fontSize: 13 }}>
          {notice}
        </div>
      )}

      {showAdd && (
        <form onSubmit={handleAddSource} className="form-grid admin-panel" style={{ marginBottom: 28, background: '#141715', border: '1px solid #d4af37' }}>
          <div className="full">
            <span className="form-label">Source Name *</span>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Cluj-Napoca Municipal Planning Portal" required />
          </div>

          <label>
            <span className="form-label">Source URL *</span>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://primariaclujnapoca.ro/urbanism" required />
          </label>

          <label>
            <span className="form-label">Source Classification</span>
            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="OFFICIAL_WEBSITE">Official Company Website</option>
              <option value="OFFICIAL_PROJECT_PAGE">Official Project Page</option>
              <option value="GOVERNMENT_REGISTRY">Government / Municipal Registry</option>
              <option value="PUBLIC_PROCUREMENT">Public Procurement Portal</option>
              <option value="INDUSTRY_PUBLICATION">Industry Publication</option>
              <option value="PRESS_RELEASE">Official Press Release</option>
              <option value="BUSINESS_DIRECTORY">Business Directory</option>
            </select>
          </label>

          <label>
            <span className="form-label">Geographic Coverage</span>
            <input value={coverage} onChange={e => setCoverage(e.target.value)} placeholder="e.g. Cluj County, Bucharest, National" />
          </label>

          <label className="full">
            <span className="form-label">Verification Notes & Collection Parameters</span>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Publicly accessible permit registry with monthly updates…" />
          </label>

          <div className="full">
            <button type="submit" className="btn fill">
              Save Verified Source
            </button>
          </div>
        </form>
      )}

      {/* Sources Table */}
      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Source Name</th>
              <th>Classification</th>
              <th>Coverage</th>
              <th>Status</th>
              <th>Last Checked</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sources.length > 0 ? (
              sources.map(s => (
                <tr key={s.id}>
                  <td>
                    <strong>{s.name}</strong>
                    <div style={{ fontSize: 11, color: '#888' }}>
                      <a href={s.url} target="_blank" rel="noreferrer" style={{ color: '#d4af37' }}>
                        {s.url} ↗
                      </a>
                    </div>
                  </td>
                  <td>{s.type.replaceAll('_', ' ')}</td>
                  <td>{s.coverage || 'Romania'}</td>
                  <td>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '2px 6px',
                        borderRadius: 3,
                        background: s.status === 'active' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                        color: s.status === 'active' ? '#86efac' : '#fca5a5'
                      }}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: '#888' }}>
                    {s.last_checked_at ? new Date(s.last_checked_at).toLocaleDateString() : 'Pending verification'}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn"
                      style={{ padding: '3px 8px', fontSize: 11 }}
                      onClick={() => handleToggleStatus(s.id, s.status)}
                    >
                      {s.status === 'active' ? 'Pause' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="empty">
                  No verified sources registered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
