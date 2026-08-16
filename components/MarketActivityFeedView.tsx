'use client';

import { useState } from 'react';
import Link from 'next/link';

type Signal = {
  id: string;
  entity_type: string;
  entity_name: string;
  signal_type: string;
  summary: string;
  confidence?: string | null;
  created_at: string;
};

export function MarketActivityFeedView({ signals: initialSignals }: { signals: Signal[] }) {
  const [signals] = useState<Signal[]>(initialSignals);
  const [filter, setFilter] = useState<string>('all');

  const filtered = signals.filter(s => {
    if (filter !== 'all' && s.signal_type !== filter) return false;
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            Real-Time Market Activity Monitor
          </div>
          <h1 className="admin-title" style={{ margin: '4px 0 0 0' }}>
            MARKET ACTIVITY & CONSTRUCTION SIGNALS
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/market" className="btn">
            Market Intelligence →
          </Link>
          <Link href="/admin/prospects/activation" className="btn fill">
            Prospect Activation →
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <div className="admin-toolbar" style={{ flexWrap: 'wrap', gap: 8 }}>
          <button
            type="button"
            className="btn"
            style={{ background: filter === 'all' ? '#d4af37' : '#141715', color: filter === 'all' ? '#000' : '#fff' }}
            onClick={() => setFilter('all')}
          >
            All Signals ({signals.length})
          </button>
          <button
            type="button"
            className="btn"
            style={{ background: filter === 'project_update' ? '#d4af37' : '#141715', color: filter === 'project_update' ? '#000' : '#fff' }}
            onClick={() => setFilter('project_update')}
          >
            Project Updates
          </button>
          <button
            type="button"
            className="btn"
            style={{ background: filter === 'company_update' ? '#d4af37' : '#141715', color: filter === 'company_update' ? '#000' : '#fff' }}
            onClick={() => setFilter('company_update')}
          >
            Company Updates
          </button>
          <button
            type="button"
            className="btn"
            style={{ background: filter === 'new_project' ? '#d4af37' : '#141715', color: filter === 'new_project' ? '#000' : '#fff' }}
            onClick={() => setFilter('new_project')}
          >
            New Projects
          </button>
        </div>
      </div>

      {/* Activity Signals Feed List */}
      <div className="admin-panel">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.length > 0 ? (
            filtered.map(sig => (
              <div
                key={sig.id}
                style={{
                  background: '#0d0f0e',
                  border: '1px solid #222',
                  borderRadius: 6,
                  padding: 16,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 16
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <span className="badge" style={{ textTransform: 'uppercase', color: '#d4af37' }}>
                      {sig.signal_type.replaceAll('_', ' ')}
                    </span>
                    <span style={{ fontSize: 11, color: '#888' }}>
                      {new Date(sig.created_at).toLocaleString()}
                    </span>
                    <span style={{ fontSize: 10, padding: '1px 6px', background: '#141715', color: '#86efac', borderRadius: 3, border: '1px solid #333' }}>
                      {sig.confidence || 'verified'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 16, color: '#fff', margin: '4px 0 6px 0' }}>
                    {sig.entity_name} ({sig.entity_type})
                  </h3>
                  <p style={{ fontSize: 13, color: '#ccc', margin: 0, lineHeight: 1.5 }}>
                    {sig.summary}
                  </p>
                </div>

                <Link href="/admin/prospects/activation" className="btn" style={{ fontSize: 11, padding: '6px 12px', whiteSpace: 'nowrap' }}>
                  Evaluate Prospect →
                </Link>
              </div>
            ))
          ) : (
            <div className="empty">
              No recent market activity signals recorded.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
