'use client';

import {FormEvent, useState} from 'react';

export type ProgressItem = {
  id: string;
  project_id: string;
  stage: string;
  percentage?: number | null;
  note?: string | null;
  progress_date?: string | null;
  image_url?: string | null;
  source?: string | null;
  verification: 'unknown' | 'unverified' | 'verified';
  verified_at?: string | null;
  created_at: string;
};

export const STAGES = [
  { value: 'planning', label: 'Planning' },
  { value: 'permits', label: 'Permits & Approvals' },
  { value: 'foundation', label: 'Foundation & Earthwork' },
  { value: 'structure', label: 'Structural Framing' },
  { value: 'facade', label: 'Facade & Enclosure' },
  { value: 'mep', label: 'MEP (Mechanical, Electrical, Plumbing)' },
  { value: 'finishing', label: 'Interior & Finishing' },
  { value: 'delivered', label: 'Delivered / Completed' }
];

export function ProjectProgressEditor({
  projectId,
  initialHistory = []
}: {
  projectId: string;
  initialHistory: ProgressItem[];
}) {
  const [history, setHistory] = useState<ProgressItem[]>(initialHistory);
  const [notice, setNotice] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; msg: string }>({
    type: 'idle',
    msg: ''
  });
  const [editingItem, setEditingItem] = useState<ProgressItem | null>(null);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);

    const payload = {
      stage: f.get('stage'),
      percentage: Number(f.get('percentage') || 0),
      note: f.get('note'),
      progressDate: f.get('progressDate') || null,
      imageUrl: f.get('imageUrl') || null,
      source: f.get('source') || null,
      verification: f.get('verification')
    };

    setNotice({ type: 'loading', msg: 'Adding progress update…' });
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: 'error', msg: data.error || 'Failed to add progress update.' });
        return;
      }

      setHistory([data, ...history]);
      setNotice({ type: 'success', msg: 'Progress update recorded.' });
      e.currentTarget.reset();
    } catch {
      setNotice({ type: 'error', msg: 'Network error submitting progress.' });
    }
  }

  async function handleUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingItem) return;

    setNotice({ type: 'loading', msg: 'Updating progress entry…' });
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/progress`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progressId: editingItem.id,
          stage: editingItem.stage,
          percentage: editingItem.percentage,
          note: editingItem.note,
          progressDate: editingItem.progress_date,
          imageUrl: editingItem.image_url,
          source: editingItem.source,
          verification: editingItem.verification
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: 'error', msg: data.error || 'Failed to update progress.' });
        return;
      }

      setHistory(history.map(item => (item.id === editingItem.id ? { ...item, ...data } : item)));
      setEditingItem(null);
      setNotice({ type: 'success', msg: 'Progress record updated.' });
    } catch {
      setNotice({ type: 'error', msg: 'Network error updating progress.' });
    }
  }

  async function handleDelete(item: ProgressItem) {
    if (!window.confirm(`Delete ${item.stage.toUpperCase()} milestone (${item.percentage}%)?`)) {
      return;
    }

    setNotice({ type: 'loading', msg: 'Deleting milestone…' });
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/progress?progressId=${item.id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        const data = await res.json();
        setNotice({ type: 'error', msg: data.error || 'Failed to delete.' });
        return;
      }

      setHistory(history.filter(x => x.id !== item.id));
      setNotice({ type: 'success', msg: 'Milestone deleted from history.' });
    } catch {
      setNotice({ type: 'error', msg: 'Network error deleting milestone.' });
    }
  }

  return (
    <section className="admin-panel" style={{ marginTop: 24 }}>
      <div className="section-head">
        <div>
          <div className="eyebrow">Construction Timeline</div>
          <h2 style={{ marginTop: 6 }}>PROJECT PROGRESS HISTORY</h2>
        </div>
      </div>

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

      {/* Historical Updates List */}
      {history.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {history.map(item => {
            const isVerified = item.verification === 'verified';
            return (
              <div
                key={item.id}
                style={{
                  background: '#141715',
                  border: isVerified ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #262927',
                  borderRadius: 6,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: '#fff',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {STAGES.find(s => s.value === item.stage)?.label || item.stage}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        background: '#222',
                        color: '#d4af37',
                        padding: '2px 8px',
                        borderRadius: 3
                      }}
                    >
                      {item.percentage}% Complete
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: isVerified ? '#86efac' : item.verification === 'unverified' ? '#fde047' : '#aaa9a1'
                      }}
                    >
                      {isVerified ? '● Verified (Public)' : '○ Admin Only (Unverified)'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      className="btn"
                      style={{ padding: '3px 8px', fontSize: 11 }}
                      onClick={() => setEditingItem(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn"
                      style={{ padding: '3px 8px', fontSize: 11, color: '#fca5a5' }}
                      onClick={() => handleDelete(item)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: 13, color: '#b9b6ae', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {item.progress_date && (
                    <span>
                      <strong>Date:</strong> {item.progress_date}
                    </span>
                  )}
                  {item.source && (
                    <span>
                      <strong>Source:</strong> {item.source}
                    </span>
                  )}
                </div>

                {item.note && (
                  <p style={{ margin: 0, fontSize: 13, color: '#e5e5e5', lineHeight: 1.5, background: '#0a0c0b', padding: '8px 12px', borderRadius: 4 }}>
                    {item.note}
                  </p>
                )}

                {item.image_url && (
                  <div style={{ marginTop: 4 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image_url}
                      alt="Milestone proof"
                      style={{ maxHeight: 120, borderRadius: 4, objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="empty" style={{ padding: '16px 0' }}>
          No historical progress updates recorded yet for this project.
        </p>
      )}

      {/* Edit Form Modal */}
      {editingItem && (
        <div
          style={{
            background: '#1a1d1b',
            border: '1px solid #333',
            borderRadius: 6,
            padding: 20,
            marginBottom: 24
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h4 style={{ margin: 0, fontSize: 15, color: '#fff' }}>Edit Progress Update</h4>
            <button
              type="button"
              className="btn"
              style={{ padding: '2px 8px', fontSize: 11 }}
              onClick={() => setEditingItem(null)}
            >
              Close
            </button>
          </div>
          <form onSubmit={handleUpdate} className="form-grid">
            <label>
              <span className="form-label">Stage</span>
              <select
                value={editingItem.stage}
                onChange={e => setEditingItem({ ...editingItem, stage: e.target.value })}
              >
                {STAGES.map(s => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="form-label">Percentage (0 - 100)</span>
              <input
                type="number"
                min="0"
                max="100"
                value={editingItem.percentage ?? ''}
                onChange={e => setEditingItem({ ...editingItem, percentage: Number(e.target.value) })}
              />
            </label>
            <label>
              <span className="form-label">Progress Date</span>
              <input
                type="date"
                value={editingItem.progress_date || ''}
                onChange={e => setEditingItem({ ...editingItem, progress_date: e.target.value })}
              />
            </label>
            <label>
              <span className="form-label">Verification State</span>
              <select
                value={editingItem.verification}
                onChange={e =>
                  setEditingItem({
                    ...editingItem,
                    verification: e.target.value as 'unknown' | 'unverified' | 'verified'
                  })
                }
              >
                <option value="verified">Verified (Eligible for public project page)</option>
                <option value="unverified">Unverified (Admin only)</option>
                <option value="unknown">Unknown</option>
              </select>
            </label>
            <label className="full">
              <span className="form-label">Description / Note</span>
              <textarea
                value={editingItem.note || ''}
                onChange={e => setEditingItem({ ...editingItem, note: e.target.value })}
                rows={3}
              />
            </label>
            <label>
              <span className="form-label">Image URL</span>
              <input
                value={editingItem.image_url || ''}
                onChange={e => setEditingItem({ ...editingItem, image_url: e.target.value })}
                placeholder="https://…"
              />
            </label>
            <label>
              <span className="form-label">Source Attribution</span>
              <input
                value={editingItem.source || ''}
                onChange={e => setEditingItem({ ...editingItem, source: e.target.value })}
                placeholder="Official site, permit document, inspection"
              />
            </label>
            <div className="full" style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button type="submit" className="btn fill" disabled={notice.type === 'loading'}>
                Save Changes
              </button>
              <button type="button" className="btn" onClick={() => setEditingItem(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Progress Update Form */}
      <form onSubmit={handleCreate} className="form-grid" style={{ borderTop: '1px solid #222', paddingTop: 20 }}>
        <div className="full">
          <h3 style={{ fontSize: 14, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12, color: '#e5e5e5' }}>
            Record New Progress Milestone
          </h3>
        </div>
        <label>
          <span className="form-label">Construction Stage</span>
          <select name="stage" defaultValue="structure">
            {STAGES.map(s => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="form-label">Completion Percentage (0-100)</span>
          <input name="percentage" type="number" min="0" max="100" defaultValue="50" required />
        </label>
        <label>
          <span className="form-label">Progress Date</span>
          <input name="progressDate" type="date" />
        </label>
        <label>
          <span className="form-label">Verification State</span>
          <select name="verification" defaultValue="verified">
            <option value="verified">Verified (Display publicly)</option>
            <option value="unverified">Unverified (Admin internal only)</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
        <label className="full">
          <span className="form-label">Milestone Notes & Description</span>
          <textarea name="note" placeholder="Specific structural or finishing updates" rows={3} />
        </label>
        <label>
          <span className="form-label">Progress Image URL (Optional)</span>
          <input name="imageUrl" placeholder="https://…" />
        </label>
        <label>
          <span className="form-label">Verified Source Attribution</span>
          <input name="source" placeholder="Official announcement, site visit, developer report" />
        </label>
        <div className="full" style={{ marginTop: 8 }}>
          <button type="submit" className="btn fill" disabled={notice.type === 'loading'}>
            {notice.type === 'loading' ? 'Recording…' : 'Record Progress Milestone'}
          </button>
        </div>
      </form>
    </section>
  );
}
