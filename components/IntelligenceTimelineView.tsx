'use client';

import React from 'react';
import Link from 'next/link';

type Props = {
  events: Array<{
    id: string;
    companyName: string;
    projectName: string;
    changeCategory: string;
    title: string;
    location: string;
    scoreDelta: number;
    recommendedAction: string;
    eventTimestamp: string;
  }>;
};

export function IntelligenceTimelineView({ events }: Props) {
  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#22c55e' }}>
            CHRONOLOGICAL PROVENANCE STREAM · PHASE 18
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            INTELLIGENCE TIMELINE
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Chronological log of verified building permits, tender awards, structural progress milestones, and score deltas.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/acquisition/score-history" className="action-btn secondary">
            Score History →
          </Link>
          <Link href="/admin/executive" className="action-btn primary">
            Executive Briefing
          </Link>
        </div>
      </div>

      <div style={{ position: 'relative', paddingLeft: 24, borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
        {events.map((ev, idx) => (
          <div key={ev.id || idx} style={{ position: 'relative', marginBottom: 24 }}>
            {/* Timeline Node */}
            <div style={{
              position: 'absolute',
              left: -31,
              top: 4,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#22c55e',
              border: '2px solid #000'
            }} />

            <div className="admin-card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div>
                  <span className="badge" style={{ fontSize: '0.62rem', marginRight: 8 }}>{ev.changeCategory}</span>
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>{ev.eventTimestamp}</span>
                </div>
                <span style={{ color: '#22c55e', fontWeight: 800, fontSize: '0.85rem' }}>+{ev.scoreDelta} Priority</span>
              </div>

              <h2 style={{ fontSize: '1rem', margin: '4px 0', color: '#fff', fontWeight: 700 }}>
                {ev.title}
              </h2>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: 8 }}>
                <strong style={{ color: '#fff' }}>{ev.companyName}</strong> · {ev.projectName} ({ev.location})
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
                <span style={{ fontSize: '0.72rem', color: '#d4af37' }}>Action: {ev.recommendedAction}</span>
                <Link href="/admin/acquisition" className="action-btn secondary" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                  Acquisition Hub →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
