'use client';

import {FormEvent, useState} from 'react';
import {ROLE_LABELS} from './RelationshipEditor';

type Project = { id: string; name: string; status: string };
type Relation = {
  project_id: string;
  role: string;
  verified_at?: string | null;
  projects?: { id?: string; name: string; status: string } | null;
};

export function CompanyProjectsEditor({
  companyId,
  projects,
  relations
}: {
  companyId: string;
  projects: Project[];
  relations: Relation[];
}) {
  const [items, setItems] = useState<Relation[]>(relations);
  const [notice, setNotice] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; msg: string }>({
    type: 'idle',
    msg: ''
  });
  const [editingItem, setEditingItem] = useState<Relation | null>(null);
  const [newRole, setNewRole] = useState('');
  const [newVerified, setNewVerified] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const projectId = String(f.get('projectId'));
    const role = String(f.get('role'));
    const verified = f.get('verified') === 'on';

    if (!projectId || !role) {
      setNotice({ type: 'error', msg: 'Please select a project and role.' });
      return;
    }

    const existing = items.find(x => x.project_id === projectId && x.role === role);
    if (existing) {
      setNotice({ type: 'error', msg: 'This company already has that role on this project.' });
      return;
    }

    setNotice({ type: 'loading', msg: 'Connecting project…' });
    try {
      const r = await fetch(`/api/admin/companies/${companyId}/relationships`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, role, verified })
      });
      const j = await r.json();
      if (!r.ok) {
        setNotice({ type: 'error', msg: j.error || 'Failed to connect project.' });
        return;
      }
      const p = projects.find(x => x.id === projectId);
      setItems([
        ...items,
        {
          project_id: projectId,
          role,
          verified_at: verified ? new Date().toISOString() : null,
          projects: { id: projectId, name: p?.name || 'Project', status: p?.status || 'upcoming' }
        }
      ]);
      setNotice({ type: 'success', msg: 'Project connected successfully.' });
      e.currentTarget.reset();
    } catch {
      setNotice({ type: 'error', msg: 'Network error. Please try again.' });
    }
  }

  async function saveRoleChange(item: Relation) {
    if (!newRole) return;
    setNotice({ type: 'loading', msg: 'Updating role…' });
    try {
      const r = await fetch(`/api/admin/companies/${companyId}/relationships`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: item.project_id,
          oldRole: item.role,
          newRole,
          verified: newVerified
        })
      });
      const j = await r.json();
      if (!r.ok) {
        setNotice({ type: 'error', msg: j.error || 'Failed to update role.' });
        return;
      }
      setItems(
        items.map(x =>
          x.project_id === item.project_id && x.role === item.role
            ? { ...x, role: newRole, verified_at: newVerified ? new Date().toISOString() : null }
            : x
        )
      );
      setEditingItem(null);
      setNotice({ type: 'success', msg: 'Role updated successfully.' });
    } catch {
      setNotice({ type: 'error', msg: 'Failed to update role.' });
    }
  }

  async function remove(item: Relation) {
    const projName = item.projects?.name || 'this project';
    if (!window.confirm(`Disconnect ${projName} (${ROLE_LABELS[item.role] || item.role}) from this company?`)) {
      return;
    }
    setNotice({ type: 'loading', msg: 'Removing…' });
    try {
      const r = await fetch(`/api/admin/companies/${companyId}/relationships`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: item.project_id, role: item.role })
      });
      if (r.ok) {
        setItems(items.filter(x => !(x.project_id === item.project_id && x.role === item.role)));
        setNotice({ type: 'success', msg: 'Project disconnected.' });
      } else {
        const j = await r.json();
        setNotice({ type: 'error', msg: j.error || 'Could not disconnect project.' });
      }
    } catch {
      setNotice({ type: 'error', msg: 'Network error.' });
    }
  }

  return (
    <section className="admin-panel" style={{ marginTop: 24 }}>
      <div className="section-head">
        <div>
          <div className="eyebrow">Portfolio & Projects</div>
          <h2 style={{ marginTop: 6 }}>CONNECTED PROJECTS</h2>
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

      {items.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Role</th>
                <th>Project Status</th>
                <th>Verification</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const isEditing = editingItem?.project_id === item.project_id && editingItem?.role === item.role;
                return (
                  <tr key={`${item.project_id}-${item.role}`}>
                    <td style={{ fontWeight: 600 }}>{item.projects?.name || item.project_id}</td>
                    <td>
                      {isEditing ? (
                        <select
                          value={newRole}
                          onChange={e => setNewRole(e.target.value)}
                          style={{ padding: '4px 8px', fontSize: 13 }}
                        >
                          {Object.entries(ROLE_LABELS).map(([k, v]) => (
                            <option key={k} value={k}>
                              {v}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="tag" style={{ textTransform: 'none', letterSpacing: 0 }}>
                          {ROLE_LABELS[item.role] || item.role.replaceAll('_', ' ')}
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: 13, textTransform: 'capitalize', color: '#b9b6ae' }}>
                        {item.projects?.status?.replaceAll('_', ' ') || '—'}
                      </span>
                    </td>
                    <td>
                      {isEditing ? (
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                          <input
                            type="checkbox"
                            checked={newVerified}
                            onChange={e => setNewVerified(e.target.checked)}
                          />
                          Verified
                        </label>
                      ) : (
                        <span style={{ color: item.verified_at ? '#86efac' : '#aaa9a1', fontSize: 13 }}>
                          {item.verified_at ? '● Verified' : '○ Unverified'}
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {isEditing ? (
                        <div style={{ display: 'inline-flex', gap: 8 }}>
                          <button
                            type="button"
                            className="btn"
                            style={{ padding: '4px 10px', fontSize: 12 }}
                            onClick={() => saveRoleChange(item)}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="btn"
                            style={{ padding: '4px 10px', fontSize: 12, opacity: 0.7 }}
                            onClick={() => setEditingItem(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'inline-flex', gap: 8 }}>
                          <button
                            type="button"
                            className="btn"
                            style={{ padding: '4px 10px', fontSize: 12 }}
                            onClick={() => {
                              setEditingItem(item);
                              setNewRole(item.role);
                              setNewVerified(Boolean(item.verified_at));
                            }}
                          >
                            Change role
                          </button>
                          <button
                            type="button"
                            className="btn"
                            style={{ padding: '4px 10px', fontSize: 12, color: '#fca5a5' }}
                            onClick={() => remove(item)}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty" style={{ padding: '20px 0' }}>
          No projects connected to this company yet.
        </p>
      )}

      <form className="form-grid" onSubmit={submit} style={{ marginTop: 24, borderTop: '1px solid #222', paddingTop: 20 }}>
        <div className="full">
          <h3 style={{ fontSize: 14, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12, color: '#e5e5e5' }}>
            Connect Project
          </h3>
        </div>
        <label>
          <span className="form-label">Select Project</span>
          <select name="projectId" required defaultValue="">
            <option value="" disabled>
              Select existing project
            </option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.status?.replaceAll('_', ' ')})
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="form-label">Company Role in Project</span>
          <select name="role" defaultValue="general_contractor">
            {Object.entries(ROLE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 26 }}>
          <input name="verified" type="checkbox" />
          <span className="form-label" style={{ margin: 0 }}>
            Mark as verified relationship
          </span>
        </label>
        <div className="full" style={{ marginTop: 8 }}>
          <button className="btn fill" type="submit" disabled={notice.type === 'loading'}>
            {notice.type === 'loading' ? 'Connecting…' : 'Connect project'}
          </button>
        </div>
      </form>
    </section>
  );
}
