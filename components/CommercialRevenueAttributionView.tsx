'use client';

import React from 'react';
import Link from 'next/link';

type Props = {
  data: {
    totalPipelineValue: number;
    totalWonRevenue: number;
    proposalsCount: number;
    wonDealsCount: number;
    conversionRate: number;
    averageDealSize: number;
    territoryRevenue: Array<{ territory: string; wonRevenue: number; pipelineValue: number; deals: number }>;
    serviceRevenue: Array<{ service: string; wonRevenue: number; count: number }>;
    signalAttribution: Array<{ signalType: string; dealsCount: number; revenue: number; label: string }>;
  };
};

export function CommercialRevenueAttributionView({ data }: Props) {
  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            COMMERCIAL REVENUE ATTRIBUTION · PHASE 15
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            REVENUE ATTRIBUTION & SIGNAL ROI
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Traceable revenue attribution chain: Market Source → Activity Signal → Company → Opportunity → Outreach → Won Revenue.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/export" className="action-btn secondary">
            Export Report →
          </Link>
          <Link href="/admin/acquisition" className="action-btn primary">
            Acquisition Hub
          </Link>
        </div>
      </div>

      {/* Top KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
        <div className="admin-card" style={{ padding: 18, borderLeft: '4px solid #22c55e' }}>
          <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#888' }}>TOTAL WON REVENUE</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#22c55e', margin: '4px 0' }}>
            €{data.totalWonRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>{data.wonDealsCount} Closed Won Contracts</div>
        </div>

        <div className="admin-card" style={{ padding: 18, borderLeft: '4px solid #38bdf8' }}>
          <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#888' }}>ACTIVE PIPELINE VALUE</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#38bdf8', margin: '4px 0' }}>
            €{data.totalPipelineValue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>{data.proposalsCount} Active Proposals</div>
        </div>

        <div className="admin-card" style={{ padding: 18, borderLeft: '4px solid #d4af37' }}>
          <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#888' }}>CONVERSION RATE</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#d4af37', margin: '4px 0' }}>
            {data.conversionRate.toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Proposal to Won Ratio</div>
        </div>

        <div className="admin-card" style={{ padding: 18, borderLeft: '4px solid #a855f7' }}>
          <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#888' }}>AVERAGE DEAL SIZE</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#a855f7', margin: '4px 0' }}>
            €{Math.round(data.averageDealSize).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Per Closed Contract</div>
        </div>
      </div>

      {/* Grid: Signal Attribution & Service Revenue */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20, marginBottom: 24 }}>
        {/* Signal Attribution */}
        <section className="admin-card" style={{ padding: 20 }}>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 12px 0', fontWeight: 700 }}>
            Revenue by Market Signal Trigger
          </h2>
          <p style={{ fontSize: '0.78rem', color: '#888', margin: '0 0 16px 0' }}>
            Which real-world construction signals generate closed contracts:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.signalAttribution.map((sig, idx) => (
              <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 14px', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{sig.label}</strong>
                  <span style={{ fontSize: '0.7rem', color: '#888', display: 'block' }}>{sig.dealsCount} won deal(s)</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ color: '#22c55e', fontSize: '1.05rem' }}>€{sig.revenue.toLocaleString()}</strong>
                  <span style={{ fontSize: '0.68rem', color: '#888', display: 'block' }}>Attributed Revenue</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Territory Revenue */}
        <section className="admin-card" style={{ padding: 20 }}>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 12px 0', fontWeight: 700 }}>
            Revenue by Territory
          </h2>
          <p style={{ fontSize: '0.78rem', color: '#888', margin: '0 0 16px 0' }}>
            Closed won and active pipeline distribution across Romanian counties:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.territoryRevenue.map((t, idx) => (
              <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 14px', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{t.territory}</strong>
                  <span style={{ fontSize: '0.7rem', color: '#888', display: 'block' }}>Pipeline: €{t.pipelineValue.toLocaleString()}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ color: '#22c55e', fontSize: '1.05rem' }}>€{t.wonRevenue.toLocaleString()}</strong>
                  <span style={{ fontSize: '0.68rem', color: '#38bdf8', display: 'block' }}>{t.deals} Closed Won</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Service Revenue Table */}
      <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)' }}>
          <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>Revenue by Deliverable Service Package</h2>
        </div>
        <table className="admin-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>Service Deliverable</th>
              <th>Contracts Won</th>
              <th>Won Revenue (€)</th>
              <th>Share of Revenue</th>
            </tr>
          </thead>
          <tbody>
            {data.serviceRevenue.map((srv, idx) => (
              <tr key={idx}>
                <td><strong style={{ color: '#fff' }}>{srv.service}</strong></td>
                <td><span style={{ color: '#38bdf8', fontWeight: 600 }}>{srv.count} deals</span></td>
                <td><span style={{ color: '#22c55e', fontWeight: 800 }}>€{srv.wonRevenue.toLocaleString()}</span></td>
                <td>
                  <span style={{ color: '#cbd5e1' }}>
                    {data.totalWonRevenue > 0 ? ((srv.wonRevenue / data.totalWonRevenue) * 100).toFixed(1) : 0}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
