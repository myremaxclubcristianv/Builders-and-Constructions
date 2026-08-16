'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EvidenceViewer } from './EvidenceViewer';

type Props = {
  changes: Array<{
    id: string;
    companyName: string;
    projectName: string;
    changeCategory: string;
    title: string;
    location: string;
    sourceUrl: string;
    sourceTier: string;
    previousPriority: number;
    newPriority: number;
    scoreDelta: number;
    commercialRelevance: string;
    recommendedAction: string;
    eventTimestamp: string;
  }>;
};

export function MarketChangeDetectionView({ changes }: Props) {
  const [selectedEvidence, setSelectedEvidence] = useState<any | null>(null);

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <div className="eyebrow" style={{ color: '#38bdf8' }}>
            MARKET TELEMETRY & DELTA AUDIT · PHASE 22
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: 'clamp(1.6rem, 3.5vw, 2rem)', fontWeight: 900, letterSpacing: '-0.05em' }}>
            WHAT CHANGED IN THE MARKET?
          </h1>
          <p className="admin-subtitle" style={{ margin: 0, fontSize: '0.85rem' }}>
            Continuous verified market change stream with mathematical priority score deltas and source provenance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: '100%', maxWidth: 'max-content' }}>
          <Link href="/admin/intelligence/timeline" className="action-btn secondary" style={{ flex: '1 1 auto', minHeight: 44 }}>
            Intelligence Timeline →
          </Link>
          <Link href="/admin/executive" className="action-btn primary" style={{ flex: '1 1 auto', minHeight: 44 }}>
            Executive Briefing
          </Link>
        </div>
      </div>

      {/* Mobile Card Feed View (visible on <= 800px) */}
      <div className="market-changes-mobile-stack" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {changes.map(ch => (
          <div
            key={ch.id}
            className="admin-card"
            style={{
              padding: '14px 16px',
              borderLeft: '3px solid #38bdf8',
              background: 'var(--panel)',
              borderRadius: 6
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
              <span className="badge" style={{ fontSize: '0.62rem', textTransform: 'uppercase' }}>
                {ch.changeCategory}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>{ch.previousPriority}</span>
                <span style={{ color: '#888' }}>→</span>
                <strong style={{ fontSize: '0.85rem', color: '#22c55e' }}>{ch.newPriority}</strong>
                <span style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 800 }}>(+{ch.scoreDelta} PTS)</span>
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block' }}>{ch.companyName}</strong>
              <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>{ch.projectName} · {ch.location}</span>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#f3f1eb', margin: '0 0 10px 0', lineHeight: 1.4 }}>
              {ch.title}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="badge" style={{ fontSize: '0.65rem', color: '#d4af37', borderColor: '#d4af37' }}>
                ACTION: {ch.recommendedAction}
              </span>

              <button
                type="button"
                className="action-btn secondary"
                style={{ fontSize: '0.7rem', padding: '6px 12px', minHeight: 36 }}
                onClick={() => setSelectedEvidence({
                  fact: ch.title,
                  sourceTitle: `${ch.sourceTier} Provenance Registry`,
                  sourceType: ch.changeCategory,
                  sourceTier: ch.sourceTier as any,
                  sourceUrl: ch.sourceUrl,
                  date: ch.eventTimestamp.slice(0, 10),
                  verificationState: 'VERIFIED',
                  entityName: ch.companyName,
                  relationshipType: ch.projectName,
                  notes: `Verified market change event recorded at ${ch.eventTimestamp}.`
                })}
              >
                Inspect Evidence →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View (visible on > 800px) */}
      <section className="admin-card market-changes-desktop-table" style={{ padding: 0, overflow: 'hidden', marginTop: 16 }}>
        <table className="admin-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>Event Category</th>
              <th>Company & Project</th>
              <th>Territory</th>
              <th>Event Summary</th>
              <th>Score Evolution</th>
              <th>Action</th>
              <th>Evidence</th>
            </tr>
          </thead>
          <tbody>
            {changes.map(ch => (
              <tr key={ch.id}>
                <td>
                  <span className="badge" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                    {ch.changeCategory}
                  </span>
                </td>
                <td>
                  <strong style={{ color: '#fff', fontSize: '0.85rem', display: 'block' }}>{ch.companyName}</strong>
                  <span style={{ fontSize: '0.7rem', color: '#888' }}>{ch.projectName}</span>
                </td>
                <td style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>{ch.location}</td>
                <td>
                  <strong style={{ fontSize: '0.8rem', color: '#fff', display: 'block' }}>{ch.title}</strong>
                  <span style={{ fontSize: '0.68rem', color: '#888' }}>Tier: {ch.sourceTier}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>{ch.previousPriority}</span>
                    <span style={{ color: '#888' }}>→</span>
                    <strong style={{ fontSize: '0.9rem', color: '#22c55e' }}>{ch.newPriority}</strong>
                    <span style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 800 }}>(+{ch.scoreDelta})</span>
                  </div>
                </td>
                <td>
                  <span className="badge" style={{ fontSize: '0.65rem', color: '#d4af37', borderColor: '#d4af37' }}>
                    {ch.recommendedAction}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="action-btn secondary"
                    style={{ fontSize: '0.7rem', padding: '4px 10px', minHeight: 34 }}
                    onClick={() => setSelectedEvidence({
                      fact: ch.title,
                      sourceTitle: `${ch.sourceTier} Provenance Registry`,
                      sourceType: ch.changeCategory,
                      sourceTier: ch.sourceTier as any,
                      sourceUrl: ch.sourceUrl,
                      date: ch.eventTimestamp.slice(0, 10),
                      verificationState: 'VERIFIED',
                      entityName: ch.companyName,
                      relationshipType: ch.projectName,
                      notes: `Verified market change event recorded at ${ch.eventTimestamp}.`
                    })}
                  >
                    Inspect Evidence
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {selectedEvidence && (
        <EvidenceViewer
          evidenceList={[selectedEvidence]}
          isOpen={true}
          onClose={() => setSelectedEvidence(null)}
          title="Market Event Provenance Chain"
        />
      )}
    </div>
  );
}
