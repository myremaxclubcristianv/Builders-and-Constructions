'use client';

import React from 'react';
import Link from 'next/link';

type Props = {
  resolutions: Array<{
    id: string;
    canonicalName: string;
    matchedCandidateName: string;
    matchedCui: string;
    matchedDomain: string;
    resolutionMethod: string;
    confidence: number;
    mergeDecision: string;
    resolvedAt: string;
  }>;
};

export function EntityResolutionView({ resolutions }: Props) {
  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            CANONICAL DEDUPLICATION & RESOLUTION · PHASE 19
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            ENTITY RESOLUTION & IDENTITY FIREWALL
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Deterministic matching hierarchy: CUI/CIF → Exact Legal Name → Official Domain → Normalized Identity.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/quality" className="action-btn secondary">
            Data Quality Hub →
          </Link>
          <Link href="/admin/companies" className="action-btn primary">
            Companies
          </Link>
        </div>
      </div>

      <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>Canonical Production Entity</th>
              <th>Matched Candidate / Alias</th>
              <th>Matched CUI / Domain</th>
              <th>Method</th>
              <th>Confidence</th>
              <th>Merge Decision</th>
              <th>Resolved At</th>
            </tr>
          </thead>
          <tbody>
            {resolutions.map(r => (
              <tr key={r.id}>
                <td>
                  <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{r.canonicalName}</strong>
                </td>
                <td style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                  {r.matchedCandidateName}
                </td>
                <td style={{ fontSize: '0.75rem', color: '#888' }}>
                  <span>{r.matchedCui}</span> · <span>{r.matchedDomain}</span>
                </td>
                <td>
                  <span className="badge" style={{ fontSize: '0.65rem' }}>{r.resolutionMethod}</span>
                </td>
                <td>
                  <strong style={{ color: r.confidence >= 0.9 ? '#22c55e' : '#eab308', fontSize: '0.85rem' }}>
                    {(r.confidence * 100).toFixed(0)}%
                  </strong>
                </td>
                <td>
                  <span className="badge" style={{ fontSize: '0.65rem', color: '#22c55e', borderColor: '#22c55e' }}>
                    {r.mergeDecision}
                  </span>
                </td>
                <td style={{ fontSize: '0.75rem', color: '#888' }}>
                  {r.resolvedAt.slice(0, 10)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
