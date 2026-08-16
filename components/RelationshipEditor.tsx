'use client';

import {FormEvent, useState} from 'react';

export const ROLE_LABELS: Record<string, string> = {
  developer: 'Developer',
  general_contractor: 'General Contractor',
  construction_company: 'Construction Company',
  architect: 'Architect',
  structural_engineer: 'Structural Engineer',
  engineer: 'Engineering',
  mep: 'MEP (Mechanical, Electrical, Plumbing)',
  project_manager: 'Project Manager',
  supplier: 'Supplier',
  other: 'Other Partner'
};

type Company = { id: string; name: string };
type Relation = {
  company_id: string;
  role: string;
  verified_at?: string | null;
  companies?: { id?: string; name: string } | null;
};

export function RelationshipEditor({
  projectId,
  companies,
  relations
}: {
  projectId: string;
  companies: Company[];
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
    const companyId = String(f.get('companyId'));
    const role = String(f.get('role'));
    const verified = f.get('verified') === 'on';

    if (!companyId || !role) {
      setNotice({ type: 'error', msg: 'Please select a company and role.' });
      return;
    }

    const existing = items.find(x => x.company_id === companyId && x.role === role);
    if (existing) {
      setNotice({ type: 'error', msg: 'This company already has that role on this project.' });
      return;
    }

    setNotice({ type: 'loading', msg: 'Adding team member…' });
    try {
      const r = await fetch(`/api/admin/projects/${projectId}/relationships`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, role, verified })
      });
      const j = await r.json();
      if (!r.ok) {
        setNotice({ type: 'error', msg: j.error || 'Failed to add relationship.' });
        return;
      }
      const c = companies.find(x => x.id === companyId);
      setItems([
        ...items,
        {
          company_id: companyId,
          role,
          verified_at: verified ? new Date().toISOString() : null,
          companies: { id: companyId, name: c?.name || 'Company' }
        }
      ]);
      setNotice({ type: 'success', msg: 'Team member added successfully.' });
      e.currentTarget.reset();
    } catch {
      setNotice({ type: 'error', msg: 'Network error. Please try again.' });
    }
  }

  async function saveRoleChange(item: Relation) {
    if (!newRole) return;
    setNotice({ type: 'loading', msg: 'Updating role…' });
    try {
      const r = await fetch(`/api/admin/projects/${projectId}/relationships`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: item.company_id,
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
          x.company_id === item.company_id && x.role === item.role
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
    const compName = item.companies?.name || 'this company';
    if (!window.confirm(`Remove ${compName} (${ROLE_LABELS[item.role] || item.role}) from this project?`)) {
      return;
    }
    setNotice({ type: 'loading', msg: 'Removing…' });
    try {
      const r = await fetch(`/api/admin/projects/${projectId}/relationships`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: item.company_id, role: item.role })
      });
      if (r.ok) {
        setItems(items.filter(x => !(x.company_id === item.company_id && x.role === item.role)));
        setNotice({ type: 'success', msg: 'Relationship removed.' });
      } else {
        const j = await r.json();
        setNotice({ type: 'error', msg: j.error || 'Could not remove relationship.' });
      }
    } catch {
      setNotice({ type: 'error', msg: 'Network error.' });
    }
  }

  return (
    <section className="admin-panel" style={{ marginTop: 24 }}>
      <div className="section-head">
        <div>
          <div className="eyebrow">Project Team</div>
          <h2 style={{ marginTop: 6 }}>CONNECTED COMPANIES & ROLES</h2>
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
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const isEditing = editingItem?.company_id === item.company_id && editingItem?.role === item.role;
                return (
                  <tr key={`${item.company_id}-${item.role}`}>
                    <td style={{ fontWeight: 600 }}>{item.companies?.name || item.company_id}</td>
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
          No companies connected to this project team yet.
        </p>
      )}

      <form className="form-grid" onSubmit={submit} style={{ marginTop: 24, borderTop: '1px solid #222', paddingTop: 20 }}>
        <div className="full">
          <h3 style={{ fontSize: 14, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12, color: '#e5e5e5' }}>
            Add Company to Project Team
          </h3>
        </div>
        <label>
          <span className="form-label">Select Company</span>
          <select name="companyId" required defaultValue="">
            <option value="" disabled>
              Select existing company
            </option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="form-label">Role in Project</span>
          <select name="role" defaultValue="developer">
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
            {notice.type === 'loading' ? 'Adding…' : 'Add to project team'}
          </button>
        </div>
      </form>
    </section>
  );
}
