'use client';

import React from 'react';
import Link from 'next/link';

type Props = {
  items: Array<{
    id: string;
    name: string;
    city: string;
    county: string;
    type: string;
    cuiCif: string;
    priorityScore: number;
    contactReadiness: { score: number; isReady: boolean; tier: string };
    decisionMaker: any;
    status: string;
    sourcesCount: number;
    activeProjectsCount: number;
  }>;
};

export function GoldenDatasetExecutionBoardView({ items }: Props) {
  const total = 50;
  const verified = items.filter(i => i.status === 'VERIFIED' || i.status === 'ACTIVATED' || i.status === 'CONTACT READY').length;
  const contactReady = items.filter(i => i.contactReadiness.isReady).length;
  const highPriority = items.filter(i => i.priorityScore >= 75).length;
  const contacted = items.filter(i => i.status === 'ACTIVATED').length;

  const stages = [
    { name: '01 · TARGET POOL', count: total, color: '#94a3b8', desc: '50 Golden Dataset Target Entities' },
    { name: '02 · VERIFIED & SOURCED', count: verified, color: '#38bdf8', desc: 'Identity & Source Evidence Verified' },
    { name: '03 · CONTACT READY', count: contactReady, color: '#d4af37', desc: 'Executive Contact Channel Verified' },
    { name: '04 · HIGH PRIORITY', count: highPriority, color: '#22c55e', desc: 'Opportunity Score ≥ 75' },
    { name: '05 · ACTIVE OUTREACH', count: contacted, color: '#a855f7', desc: 'Direct Executive Pipeline Active' }
  ];

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            COMMERCIAL EXECUTION PIPELINE · PHASE 15
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            GOLDEN DATASET EXECUTION BOARD
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Real-world acquisition conversion from 50 target companies to verified commercial revenue.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/market/golden-dataset" className="action-btn secondary">
            ← Activation Table
          </Link>
          <Link href="/admin/analytics/revenue" className="action-btn primary">
            Revenue Analytics →
          </Link>
        </div>
      </div>

      {/* Stage Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
        {stages.map((st, idx) => (
          <div key={idx} className="admin-card" style={{ padding: 16, borderLeft: `3px solid ${st.color}` }}>
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: st.color, fontWeight: 700 }}>
              {st.name}
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>
              {st.count}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#888' }}>
              {st.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Execution Target List */}
      <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>Company Entity</th>
              <th>Territory</th>
              <th>Sector</th>
              <th>Decision Maker</th>
              <th>Contact Readiness</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>
                  <strong style={{ color: '#fff', fontSize: '0.85rem', display: 'block' }}>{item.name}</strong>
                  <span style={{ fontSize: '0.7rem', color: '#888' }}>CUI: {item.cuiCif}</span>
                </td>
                <td style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>{item.city}, {item.county}</td>
                <td><span className="badge" style={{ fontSize: '0.65rem' }}>{item.type}</span></td>
                <td>
                  {item.decisionMaker ? (
                    <div>
                      <strong style={{ fontSize: '0.78rem', color: '#fff', display: 'block' }}>{item.decisionMaker.name}</strong>
                      <span style={{ fontSize: '0.68rem', color: '#38bdf8' }}>{item.decisionMaker.role}</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.7rem', color: '#eab308' }}>Pending DM</span>
                  )}
                </td>
                <td>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: item.contactReadiness.isReady ? '#22c55e' : '#eab308' }}>
                    {item.contactReadiness.score}% ({item.contactReadiness.tier})
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: item.priorityScore >= 75 ? '#22c55e' : '#eab308' }}>
                    {item.priorityScore}
                  </span>
                </td>
                <td>
                  <span className="status-pill verified" style={{ fontSize: '0.65rem' }}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <Link href={`/admin/companies/${item.id}/acquisition`} className="action-btn primary" style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
                    Executive Brief →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
