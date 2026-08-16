'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type ActivationLog = {
  id: string;
  actor: string;
  timestamp: string;
  entity: string;
  action: string;
  source: string;
  result: string;
  metadata?: Record<string, any>;
};

export function SystemActivationLogView({ logs: initialLogs }: { logs: ActivationLog[] }) {
  const [logs] = useState<ActivationLog[]>(initialLogs);
  const [actionFilter, setActionFilter] = useState('ALL');

  const filtered = logs.filter(log => {
    if (actionFilter !== 'ALL' && !log.action.toLowerCase().includes(actionFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            PRODUCTION ACTIVATION AUDIT · PHASE 13
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            MARKET INGESTION & ACTIVATION AUDIT LOG
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Immutable chronological register of discovery ingestion, normalization, duplicate reviews, and entity verifications.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/market/activation" className="action-btn primary">
            Market Tracker →
          </Link>
          <Link href="/admin/system/data" className="action-btn secondary">
            Data Health →
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="admin-card" style={{ padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <label style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#888', marginRight: 8 }}>Filter Action Type:</label>
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            style={{ padding: '6px 10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4, fontSize: '0.75rem' }}
          >
            <option value="ALL">All Ingestion Actions</option>
            <option value="ACTIVATION">Commercial Activation</option>
            <option value="VERIFICATION">Relationship Verification</option>
            <option value="NORMALIZATION">Normalization & Tax Verify</option>
            <option value="DISCOVERY">Discovery Jobs</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#888' }}>
          Total logged events: <strong style={{ color: '#fff' }}>{filtered.length}</strong>
        </div>
      </div>

      {/* Log Table */}
      <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Entity Target</th>
              <th>Source Provenance</th>
              <th>Ingestion Result</th>
              <th>Metadata</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map(log => (
                <tr key={log.id}>
                  <td style={{ fontSize: '0.72rem', color: '#888', whiteSpace: 'nowrap' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td>
                    <strong style={{ color: '#fff', fontSize: '0.78rem' }}>{log.actor}</strong>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 3,
                        color: '#d4af37',
                        background: '#d4af3715',
                        border: '1px solid #d4af3733',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 600 }}>
                      {log.entity}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.72rem', color: '#38bdf8' }}>
                      {log.source}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 600 }}>
                      {log.result}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.7rem', color: '#888' }}>
                    {log.metadata ? (
                      <pre style={{ margin: 0, fontSize: '0.68rem', color: '#aaa', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {JSON.stringify(log.metadata)}
                      </pre>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#888' }}>
                  No activation log entries matching the selected criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
