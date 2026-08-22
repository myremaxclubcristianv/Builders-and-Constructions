'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CompanyIntelligencePreview } from '@/components/CompanyIntelligencePreview';
import { calculateSignalFreshness } from '@/lib/data';

type Signal = {
  id: string;
  entity_type: string;
  entity_name: string;
  company_id?: string;
  company_name?: string;
  company_slug?: string;
  project_id?: string;
  project_name?: string;
  project_slug?: string;
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
        return '#c7a675';
      default:
        return '#38bdf8';
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="eyebrow" style={{ color: '#c7a675', letterSpacing: '0.12em' }}>
              REAL-TIME MARKET FEED · PRODUCTION INTELLIGENCE
            </div>
            <h1 style={{ margin: '4px 0 6px 0', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, color: '#f3f1eb' }}>
              MARKET ACTIVITY FEED
            </h1>
            <p className="admin-subtitle" style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(243,241,235,0.7)' }}>
              Verified Romanian construction permits, structural milestones, public tender awards, and company events.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/admin/executive" className="action-btn secondary" style={{ minHeight: 40, fontSize: '0.78rem' }}>
              Briefing
            </Link>
            <Link href="/admin/acquisition/radar" className="action-btn primary" style={{ minHeight: 40, fontSize: '0.78rem' }}>
              Radar →
            </Link>
          </div>
        </div>
      </div>

      {/* Signal Filter Bar */}
      <div className="admin-card" style={{ padding: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SIGNAL_CATEGORIES.map(cat => {
            const active = filter === cat.key;
            return (
              <button
                type="button"
                key={cat.key}
                onClick={() => setFilter(cat.key)}
                style={{
                  fontSize: '0.72rem',
                  padding: '8px 12px',
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: active ? '#c7a675' : 'rgba(244,242,235,0.1)',
                  background: active ? 'rgba(199,166,117,0.15)' : 'transparent',
                  color: active ? '#c7a675' : 'rgba(243,241,235,0.6)',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  minHeight: 40
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Activity Signals Feed List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length > 0 ? (
          filtered.map(sig => {
            const relColor = getRelevanceColor(sig.commercial_relevance);
            const freshness = calculateSignalFreshness(sig.event_date || sig.created_at);
            const freshnessColor = freshness === 'FRESH' ? '#38bdf8' : freshness === 'RECENT' ? '#c7a675' : '#888';

            return (
              <div
                key={sig.id}
                className="admin-card"
                style={{
                  padding: '18px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 16,
                  flexWrap: 'wrap',
                  background: 'rgba(13,16,15,0.95)',
                  borderLeft: `3px solid ${relColor}`
                }}
              >
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                    <span
                      className="status-pill"
                      style={{
                        fontSize: '0.6rem',
                        fontWeight: 800,
                        padding: '2px 6px',
                        color: relColor,
                        borderColor: relColor,
                        background: 'transparent'
                      }}
                    >
                      {sig.signal_type.replace(/_/g, ' ')}
                    </span>

                    {freshness && (
                      <span
                        style={{
                          fontSize: '0.58rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: 2,
                          border: `1px solid ${freshnessColor}`,
                          color: freshnessColor
                        }}
                      >
                        {freshness}
                      </span>
                    )}

                    <span style={{ fontSize: '0.7rem', color: 'rgba(243,241,235,0.5)' }}>
                      Date: <strong style={{ color: '#f3f1eb' }}>{sig.event_date || new Date(sig.created_at).toLocaleDateString()}</strong>
                    </span>

                    <span className="status-pill verified" style={{ fontSize: '0.58rem', padding: '2px 6px' }}>
                      {sig.verification_state?.replace(/_/g, ' ') || 'VERIFIED'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', color: '#f3f1eb', margin: '0 0 6px 0', fontWeight: 800 }}>
                    {sig.event_name || sig.entity_name}
                  </h3>

                  <p style={{ fontSize: '0.82rem', color: 'rgba(243,241,235,0.8)', margin: '0 0 10px 0', lineHeight: 1.5 }}>
                    {sig.summary}
                  </p>

                  <div style={{ display: 'flex', gap: 14, fontSize: '0.75rem', color: 'rgba(243,241,235,0.6)', flexWrap: 'wrap' }}>
                    {sig.company_name && (
                      <div>
                        Company:{' '}
                        {sig.company_slug ? (
                          <CompanyIntelligencePreview
                            company={{
                              name: sig.company_name,
                              slug: sig.company_slug
                            }}
                          >
                            <Link href={`/companies/${sig.company_slug}`} style={{ color: '#f3f1eb', fontWeight: 700 }}>
                              {sig.company_name}
                            </Link>
                          </CompanyIntelligencePreview>
                        ) : (
                          <strong style={{ color: '#f3f1eb' }}>{sig.company_name}</strong>
                        )}
                      </div>
                    )}

                    {sig.project_name && (
                      <div>
                        Project:{' '}
                        {sig.project_slug ? (
                          <Link href={`/projects/${sig.project_slug}`} style={{ color: '#38bdf8', fontWeight: 700 }}>
                            {sig.project_name}
                          </Link>
                        ) : (
                          <strong style={{ color: '#38bdf8' }}>{sig.project_name}</strong>
                        )}
                      </div>
                    )}

                    {sig.source && (
                      <div>
                        Source: <span style={{ color: 'rgba(243,241,235,0.7)' }}>{sig.source}</span>
                        {sig.source_url && (
                          <a href={sig.source_url} target="_blank" rel="noreferrer" style={{ marginLeft: 4, color: '#c7a675' }}>
                            ↗ Citation
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 150, width: '100%', maxWidth: 180 }}>
                  {sig.company_id && (
                    <Link
                      href={`/admin/companies/${sig.company_id}/acquisition`}
                      className="action-btn primary"
                      style={{ fontSize: '0.72rem', textAlign: 'center', minHeight: 40 }}
                    >
                      Dossier →
                    </Link>
                  )}
                  {sig.company_id && (
                    <Link
                      href={`/admin/acquisition/outreach/${sig.company_id}`}
                      className="action-btn secondary"
                      style={{ fontSize: '0.72rem', textAlign: 'center', minHeight: 40 }}
                    >
                      Draft Outreach →
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="admin-card" style={{ textAlign: 'center', padding: '32px', color: 'rgba(243,241,235,0.5)' }}>
            No construction activity signals matching the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
