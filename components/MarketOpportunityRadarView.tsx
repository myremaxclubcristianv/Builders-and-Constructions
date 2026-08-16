'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type RadarItem = {
  id: string;
  name: string;
  slug: string;
  city: string;
  activeProjectsCount: number;
  activityScore?: number;
  digitalGap: string;
  opportunityScore: number;
  priorityScore: number;
  contactReadiness?: string;
  tier?: string;
  recommendedServices: Array<{ serviceKey: string; name: string }>;
};

type RadarData = {
  highActivityLowDigital: RadarItem[];
  noWebsiteWithProjects: RadarItem[];
  strongPortfolioWeakPresentation: RadarItem[];
  multipleDevelopmentsNoLeadGen: RadarItem[];
  recentSignals: Array<{
    id: string;
    entity_name: string;
    signal_type: string;
    summary: string;
    confidence: string;
    created_at: string;
    entity_id?: string;
  }>;
};

export function MarketOpportunityRadarView({ initialData }: { initialData: RadarData }) {
  const [activeTab, setActiveTab] = useState<'high_activity' | 'no_website' | 'weak_presentation' | 'no_lead_gen' | 'signals'>('high_activity');

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '0.25rem' }}>
              MARKET DISCREPANCY & SIGNAL RADAR · PHASE 10
            </div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 700 }}>
              MARKET OPPORTUNITY RADAR
            </h1>
            <p className="admin-subtitle" style={{ margin: 0 }}>
              Automated detection of commercial gaps where real-world construction volume outpaces digital presence.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link href="/admin/acquisition" className="action-btn secondary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}>
              ← Command Center
            </Link>
          </div>
        </div>
      </div>

      {/* Signal Alert Banner (if signals exist) */}
      {initialData.recentSignals.length > 0 && (
        <div
          className="admin-card"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid #38bdf8',
            marginBottom: '2rem',
            padding: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>⚡</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#38bdf8' }}>
                NEW COMMERCIAL SIGNAL DETECTED
              </span>
            </div>
            <span className="status-pill verified" style={{ fontSize: '0.7rem' }}>
              CONFIDENCE: {initialData.recentSignals[0].confidence.toUpperCase()}
            </span>
          </div>

          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>
            {initialData.recentSignals[0].entity_name}
          </div>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '0 0 0.75rem 0', lineHeight: 1.4 }}>
            {initialData.recentSignals[0].summary}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
            <span>Signal Type: {initialData.recentSignals[0].signal_type.replace('_', ' ')}</span>
            {initialData.recentSignals[0].entity_id && (
              <Link
                href={`/admin/companies/${initialData.recentSignals[0].entity_id}/acquisition`}
                className="action-btn primary"
                style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
              >
                OPEN OPPORTUNITY →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Radar Pattern Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('high_activity')}
          className={`filter-chip ${activeTab === 'high_activity' ? 'active' : ''}`}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.8rem',
            borderRadius: '4px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: activeTab === 'high_activity' ? '#22c55e' : 'transparent',
            color: activeTab === 'high_activity' ? '#000' : '#fff',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          High Activity + Digital Gap ({initialData.highActivityLowDigital.length})
        </button>

        <button
          onClick={() => setActiveTab('no_website')}
          className={`filter-chip ${activeTab === 'no_website' ? 'active' : ''}`}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.8rem',
            borderRadius: '4px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: activeTab === 'no_website' ? '#38bdf8' : 'transparent',
            color: activeTab === 'no_website' ? '#000' : '#fff',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Active Projects + No Website ({initialData.noWebsiteWithProjects.length})
        </button>

        <button
          onClick={() => setActiveTab('weak_presentation')}
          className={`filter-chip ${activeTab === 'weak_presentation' ? 'active' : ''}`}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.8rem',
            borderRadius: '4px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: activeTab === 'weak_presentation' ? '#eab308' : 'transparent',
            color: activeTab === 'weak_presentation' ? '#000' : '#fff',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Strong Portfolio + Weak Showcase ({initialData.strongPortfolioWeakPresentation.length})
        </button>

        <button
          onClick={() => setActiveTab('no_lead_gen')}
          className={`filter-chip ${activeTab === 'no_lead_gen' ? 'active' : ''}`}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.8rem',
            borderRadius: '4px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: activeTab === 'no_lead_gen' ? '#a855f7' : 'transparent',
            color: activeTab === 'no_lead_gen' ? '#fff' : '#fff',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Developments + No Lead Funnel ({initialData.multipleDevelopmentsNoLeadGen.length})
        </button>

        <button
          onClick={() => setActiveTab('signals')}
          className={`filter-chip ${activeTab === 'signals' ? 'active' : ''}`}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.8rem',
            borderRadius: '4px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: activeTab === 'signals' ? '#f43f5e' : 'transparent',
            color: activeTab === 'signals' ? '#fff' : '#fff',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          All Activity Signals ({initialData.recentSignals.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'signals' ? (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="admin-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Entity</th>
                <th>Signal Type</th>
                <th>Verified Event Details</th>
                <th>Confidence</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {initialData.recentSignals.map(sig => (
                <tr key={sig.id}>
                  <td style={{ fontWeight: 600 }}>{sig.entity_name}</td>
                  <td>
                    <span className="status-pill secondary">{sig.signal_type.replace('_', ' ')}</span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#ccc' }}>{sig.summary}</td>
                  <td>
                    <span className="status-pill verified">{sig.confidence}</span>
                  </td>
                  <td style={{ fontSize: '0.75rem', color: '#888' }}>
                    {new Date(sig.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    {sig.entity_id ? (
                      <Link href={`/admin/companies/${sig.entity_id}/acquisition`} className="action-btn secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
                        View →
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {(() => {
            const list =
              activeTab === 'high_activity'
                ? initialData.highActivityLowDigital
                : activeTab === 'no_website'
                ? initialData.noWebsiteWithProjects
                : activeTab === 'weak_presentation'
                ? initialData.strongPortfolioWeakPresentation
                : initialData.multipleDevelopmentsNoLeadGen;

            if (list.length === 0) {
              return (
                <div className="admin-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: '#888' }}>
                  No companies currently matching this discrepancy pattern.
                </div>
              );
            }

            return list.map(item => (
              <div key={item.id} className="admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
                      <Link href={`/admin/companies/${item.id}/acquisition`} style={{ color: '#fff', textDecoration: 'none' }}>
                        {item.name}
                      </Link>
                    </h3>
                    <span className="status-pill verified" style={{ fontSize: '0.75rem' }}>
                      Priority {item.priorityScore}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.75rem' }}>
                    Location: <strong>{item.city}</strong> · Active Projects: <strong>{item.activeProjectsCount}</strong>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '4px', marginBottom: '0.75rem', fontSize: '0.82rem', color: '#cbd5e1' }}>
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600, marginBottom: '0.25rem' }}>
                      Commercial Gap Identified:
                    </div>
                    {item.digitalGap || 'Lacks modern project case studies and institutional visibility architecture.'}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>
                    Opportunity: {item.opportunityScore}/100
                  </span>
                  <Link href={`/admin/companies/${item.id}/acquisition`} className="action-btn primary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }}>
                    Open Briefing →
                  </Link>
                </div>
              </div>
            ));
          })()}
        </div>
      )}
    </div>
  );
}
