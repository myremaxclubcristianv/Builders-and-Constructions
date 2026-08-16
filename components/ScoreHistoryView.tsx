'use client';

import React from 'react';
import Link from 'next/link';

type Props = {
  history: Array<{
    id: string;
    companyName: string;
    eventDate: string;
    trigger: string;
    previousScore: number;
    newScore: number;
    scoreDelta: number;
    explanation: string;
  }>;
};

export function ScoreHistoryView({ history }: Props) {
  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            MATHEMATICAL SCORE AUDIT · PHASE 18
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            ACQUISITION SCORE EVOLUTION HISTORY
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Deterministic priority shifts: every single score movement is tied to a verified signal, permit, or commercial gap.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/acquisition" className="action-btn secondary">
            Acquisition Hub
          </Link>
          <Link href="/admin/executive" className="action-btn primary">
            Executive Briefing →
          </Link>
        </div>
      </div>

      <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Company Entity</th>
              <th>Trigger Event</th>
              <th>Previous Score</th>
              <th>Delta</th>
              <th>New Score</th>
              <th>Deterministic Explanation</th>
            </tr>
          </thead>
          <tbody>
            {history.map(h => (
              <tr key={h.id}>
                <td style={{ fontSize: '0.78rem', color: '#888' }}>{h.eventDate}</td>
                <td><strong style={{ color: '#fff', fontSize: '0.85rem' }}>{h.companyName}</strong></td>
                <td><span className="badge" style={{ fontSize: '0.65rem' }}>{h.trigger}</span></td>
                <td style={{ fontSize: '0.85rem', color: '#888' }}>{h.previousScore}</td>
                <td>
                  <strong style={{ fontSize: '0.85rem', color: h.scoreDelta >= 0 ? '#22c55e' : '#eab308' }}>
                    {h.scoreDelta >= 0 ? `+${h.scoreDelta}` : h.scoreDelta}
                  </strong>
                </td>
                <td>
                  <strong style={{ fontSize: '1rem', color: '#fff' }}>{h.newScore}</strong>
                </td>
                <td style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>{h.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
