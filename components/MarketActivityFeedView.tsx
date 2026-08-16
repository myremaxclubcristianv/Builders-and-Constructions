'use client';

import { useState } from 'react';
import Link from 'next/link';

type Signal = {
  id: string;
  entity_type: string;
  entity_name: string;
  company_id?: string;
  company_name?: string;
  project_id?: string;
  project_name?: string;
  signal_type: string;
  event_name?: string;
  event_date?: string;
  summary: string;
  source?: string;
  source_type?: string;
  source_url?: string;
  verification_state?: string;
  commercial_relevance?: string;
  confidence?: string | null;
  created_at: string;
};

const SIGNAL_CATEGORIES = [
  { key: 'all', label: 'All Signals' },
  { key: 'NEW_PROJECT', label: 'New Projects' },
  { key: 'ACTIVE_CONSTRUCTION', label: 'Active Construction' },
  { key: 'CONTRACT_AWARD', label: 'Contract Awards' },
  { key: 'STRUCTURAL_PROGRESS', label: 'Milestones & Progress' },
  { key: 'PERMIT', label: 'Permits & Planning' },
  { key: 'COMPLETION', label: 'Completions & Delivery' }
];

export function MarketActivityFeedView({ signals: initialSignals }: { signals: Signal[] }) {
  const [signals] = useState<Signal[]>(initialSignals);
  const [filter, setFilter] = useState<string>('all');

  const filtered = signals.filter(s => {
    if (filter === 'all') return true;
    return s.signal_type === filter || (filter === 'STRUCTURAL_PROGRESS' && ['STRUCTURAL_PROGRESS', 'RECENT_MILESTONE', 'FACADE', 'MEP'].includes(s.signal_type));
  });

  const getRelevanceColor = (rel?: string) => {
    switch (rel) {
      case 'CRITICAL':
        return '#ef4444';
      case 'HIGH':
        return '#d4af37';
      default:
        return '#38bdf8';
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            VERIFIED MARKET SIGNALS · PHASE 11
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            CONSTRUCTION ACTIVITY & MARKET SIGNALS
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Real-world construction milestones, public tender awards, building permits, and architectural progress.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/admin/acquisition/radar" className="action-btn secondary">
            Opportunity Radar →
          </Link>
          <Link href="/admin/acquisition" className="action-btn primary">
            Acquisition Hub →
          </Link>
        </div>
      </div>

      {/* Signal Filter Bar */}
      <div className="admin-card" style={{ padding: '12px 16px', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SIGNAL_CATEGORIES.map(cat => {
            const active = filter === cat.key;
            return (
              <button
                type="button"
                key={cat.key}
                onClick={() => setFilter(cat.key)}
                style={{
                  fontSize: '0.75rem',
                  padding: '6px 12px',
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: active ? '#d4af37' : 'rgba(255,255,255,0.1)',
                  background: active ? '#d4af3722' : 'transparent',
                  color: active ? '#d4af37' : '#94a3b8',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Activity Signals Feed List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.length > 0 ? (
          filtered.map(sig => {
            const relColor = getRelevanceColor(sig.commercial_relevance);
            return (
              <div
                key={sig.id}
                className="admin-card"
                style={{
                  padding: '18px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 20,
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ flex: 1, minWidth: 280 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: 3,
                        background: `${relColor}15`,
                        color: relColor,
                        border: `1px solid ${relColor}44`,
                        letterSpacing: '0.05em'
                      }}
                    >
                      {sig.signal_type.replace(/_/g, ' ')}
                    </span>

                    <span style={{ fontSize: '0.72rem', color: '#888' }}>
                      Event Date: <strong style={{ color: '#ccc' }}>{sig.event_date || new Date(sig.created_at).toLocaleDateString()}</strong>
                    </span>

                    <span
                      style={{
                        fontSize: '0.65rem',
                        padding: '1px 6px',
                        background: 'rgba(34, 197, 94, 0.1)',
                        color: '#22c55e',
                        borderRadius: 3,
                        border: '1px solid rgba(34, 197, 94, 0.3)'
                      }}
                    >
                      {sig.verification_state?.replace(/_/g, ' ') || 'VERIFIED'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', color: '#fff', margin: '2px 0 6px 0', fontWeight: 700 }}>
                    {sig.event_name || sig.entity_name}
                  </h3>

                  <p style={{ fontSize: '0.82rem', color: '#e2e8f0', margin: '0 0 10px 0', lineHeight: 1.5 }}>
                    {sig.summary}
                  </p>

                  <div style={{ display: 'flex', gap: 16, fontSize: '0.72rem', color: '#888', flexWrap: 'wrap' }}>
                    {sig.company_name && (
                      <div>
                        Company: <strong style={{ color: '#fff' }}>{sig.company_name}</strong>
                      </div>
                    )}
                    {sig.project_name && (
                      <div>
                        Project: <strong style={{ color: '#38bdf8' }}>{sig.project_name}</strong>
                      </div>
                    )}
                    {sig.source && (
                      <div>
                        Source: <span style={{ color: '#bbb' }}>{sig.source}</span>
                        {sig.source_url && (
                          <a href={sig.source_url} target="_blank" rel="noreferrer" style={{ marginLeft: 4, color: '#d4af37' }}>
                            ↗
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 160 }}>
                  {sig.company_id && (
                    <Link
                      href={`/admin/companies/${sig.company_id}/acquisition`}
                      className="action-btn primary"
                      style={{ fontSize: '0.75rem', textAlign: 'center' }}
                    >
                      Acquisition Profile →
                    </Link>
                  )}
                  {sig.company_id && (
                    <Link
                      href={`/admin/acquisition/outreach/${sig.company_id}`}
                      className="action-btn secondary"
                      style={{ fontSize: '0.75rem', textAlign: 'center' }}
                    >
                      Draft Outreach →
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="admin-card" style={{ textAlign: 'center', padding: '32px', color: '#888' }}>
            No construction activity signals matching the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
