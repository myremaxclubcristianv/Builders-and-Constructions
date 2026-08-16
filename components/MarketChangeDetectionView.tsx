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
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#38bdf8' }}>
            MARKET TELEMETRY & DELTA AUDIT · PHASE 18
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            WHAT CHANGED IN THE ROMANIAN CONSTRUCTION MARKET?
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Continuous verified market change stream with mathematical priority score deltas and source provenance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/intelligence/timeline" className="action-btn secondary">
            Intelligence Timeline →
          </Link>
          <Link href="/admin/executive" className="action-btn primary">
            Executive Briefing
          </Link>
        </div>
      </div>

      <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
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
                    className="action-btn secondary"
                    style={{ fontSize: '0.7rem', padding: '3px 8px' }}
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
                    👁 View Evidence
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
