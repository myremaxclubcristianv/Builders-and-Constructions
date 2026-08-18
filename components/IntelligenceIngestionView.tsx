'use client';

import React from 'react';
import Link from 'next/link';

type Props = {
  jobs: Array<{
    id: string;
    sourceName: string;
    sourceTier: string;
    sourceUrl: string;
    status: string;
    recordsDiscovered: number;
    recordsAccepted: number;
    recordsRejected: number;
    verificationFailures: number;
    duplicateCandidates: number;
    durationMs: number;
    startedAt: string;
  }>;
};

export function IntelligenceIngestionView({ jobs }: Props) {
  const totalDiscovered = jobs.reduce((s, j) => s + j.recordsDiscovered, 0);
  const totalAccepted = jobs.reduce((s, j) => s + j.recordsAccepted, 0);
  const totalRejected = jobs.reduce((s, j) => s + j.recordsRejected, 0);

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#38bdf8' }}>
            CONTROLLED MARKET INGESTION · PHASE 24
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: 'clamp(1.6rem, 3.5vw, 2rem)', fontWeight: 800 }}>
            PRODUCTION MARKET INGESTION & SOURCE PIPELINE
          </h1>
          <p className="admin-subtitle" style={{ margin: 0, fontSize: '0.85rem' }}>
            Automated verification of official Romanian urbanism permits, SEAP tenders, and corporate announcements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/admin/sources" className="action-btn secondary" style={{ minHeight: 44 }}>
            Source Registry →
          </Link>
          <Link href="/admin/market/changes" className="action-btn primary" style={{ minHeight: 44 }}>
            Market Changes
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #38bdf8' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>DISCOVERED RAW FACTS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8', margin: '4px 0' }}>{totalDiscovered}</div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Primary & Secondary feeds</div>
        </div>

        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #22c55e' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>VERIFIED & ACCEPTED</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#22c55e', margin: '4px 0' }}>{totalAccepted}</div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Promoted to Staging</div>
        </div>

        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #ef4444' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>REJECTED / UNVERIFIED</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ef4444', margin: '4px 0' }}>{totalRejected}</div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Provenance Failures</div>
        </div>
      </div>

      {/* Ingestion Jobs Table */}
      <section className="admin-card" style={{ padding: 0, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className="admin-table" style={{ margin: 0, minWidth: 600 }}>
          <thead>
            <tr>
              <th>Source / Registry Feed</th>
              <th>Tier</th>
              <th>Status</th>
              <th>Discovered</th>
              <th>Accepted</th>
              <th>Rejected</th>
              <th>Duration</th>
              <th>Executed At</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(j => (
              <tr key={j.id}>
                <td>
                  <strong style={{ color: '#fff', fontSize: '0.85rem', display: 'block' }}>{j.sourceName}</strong>
                  <a href={j.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.7rem', color: '#38bdf8' }}>
                    {j.sourceUrl} ↗
                  </a>
                </td>
                <td>
                  <span className="badge" style={{ fontSize: '0.65rem' }}>{j.sourceTier}</span>
                </td>
                <td>
                  <span className="badge" style={{ fontSize: '0.65rem', color: '#22c55e', borderColor: '#22c55e' }}>{j.status}</span>
                </td>
                <td style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{j.recordsDiscovered}</td>
                <td><strong style={{ color: '#22c55e', fontSize: '0.85rem' }}>{j.recordsAccepted}</strong></td>
                <td><strong style={{ color: '#ef4444', fontSize: '0.85rem' }}>{j.recordsRejected}</strong></td>
                <td style={{ fontSize: '0.78rem', color: '#888' }}>{j.durationMs}ms</td>
                <td style={{ fontSize: '0.75rem', color: '#888' }}>{j.startedAt.slice(0, 16).replace('T', ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
