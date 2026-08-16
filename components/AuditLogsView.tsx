'use client';

import { useState } from 'react';
import Link from 'next/link';

type AuditLog = {
  id: string;
  actor: string;
  actor_role?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
};

export function AuditLogsView({ logs: initialLogs }: { logs: AuditLog[] }) {
  const [logs] = useState<AuditLog[]>(initialLogs);
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterEntity, setFilterEntity] = useState<string>('all');

  const filtered = logs.filter(log => {
    if (filterAction !== 'all' && !log.action.toLowerCase().includes(filterAction.toLowerCase())) return false;
    if (filterEntity !== 'all' && log.entity_type.toLowerCase() !== filterEntity.toLowerCase()) return false;
    return true;
  });

  const getActionColor = (action: string) => {
    if (action.includes('SENT') || action.includes('WON') || action.includes('APPROVED')) return '#22c55e';
    if (action.includes('UPDATE') || action.includes('VERIFY')) return '#38bdf8';
    if (action.includes('DELETE') || action.includes('ARCHIVE')) return '#ef4444';
    return '#d4af37';
  };

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            OPERATIONAL AUDIT TRAIL · PHASE 11
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            SYSTEM AUDIT & COMPLIANCE LOGS
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Immutable chronological record of all operational mutations, outreach approvals, verifications, and data merges.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/system" className="action-btn secondary">
            System Health →
          </Link>
          <Link href="/admin/system/data" className="action-btn secondary">
            Data Health →
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card" style={{ padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <label style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#888', marginRight: 8 }}>Filter Action:</label>
          <select
            value={filterAction}
            onChange={e => setFilterAction(e.target.value)}
            style={{ padding: '6px 10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4, fontSize: '0.75rem' }}
          >
            <option value="all">All Actions</option>
            <option value="OUTREACH">Outreach Actions</option>
            <option value="VERIFY">Verification Actions</option>
            <option value="UPDATE">Update Actions</option>
            <option value="CREATE">Create Actions</option>
            <option value="MERGE">Merge Actions</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#888', marginRight: 8 }}>Filter Entity:</label>
          <select
            value={filterEntity}
            onChange={e => setFilterEntity(e.target.value)}
            style={{ padding: '6px 10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4, fontSize: '0.75rem' }}
          >
            <option value="all">All Entity Types</option>
            <option value="company">Company</option>
            <option value="project">Project</option>
            <option value="decision_maker">Decision Maker</option>
            <option value="outreach_draft">Outreach Draft</option>
            <option value="lead">Lead</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Entity ID</th>
              <th>Metadata Context</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map(log => {
                const color = getActionColor(log.action);
                return (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.75rem', color: '#888', whiteSpace: 'nowrap' }}>
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td>
                      <strong style={{ color: '#fff', fontSize: '0.78rem' }}>{log.actor}</strong>
                      {log.actor_role && (
                        <span style={{ fontSize: '0.65rem', color: '#888', display: 'block' }}>
                          Role: {log.actor_role}
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 3,
                          color,
                          background: `${color}15`,
                          border: `1px solid ${color}33`,
                          letterSpacing: '0.04em'
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td>
                      <span className="badge" style={{ textTransform: 'uppercase' }}>
                        {log.entity_type}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.72rem', color: '#888', fontFamily: 'monospace' }}>
                      {log.entity_id ? log.entity_id.slice(0, 8) + '…' : '—'}
                    </td>
                    <td style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                      {log.metadata ? (
                        <pre style={{ margin: 0, fontSize: '0.7rem', color: '#aaa', maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {JSON.stringify(log.metadata)}
                        </pre>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#888' }}>
                  No audit log entries matching the selected criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
