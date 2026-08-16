'use client';

import React from 'react';
import Link from 'next/link';

type Props = {
  chains: Array<{
    id: string;
    companyName: string;
    service: string;
    dealAmount: number;
    territory: string;
    originSignal: string;
    signalDate: string;
    firstContactDate: string;
    meetingDate: string;
    proposalDate: string;
    wonDate: string;
    daysToClose: number;
  }>;
};

export function RevenueAttributionExecutiveView({ chains }: Props) {
  const totalRevenue = chains.reduce((sum, c) => sum + c.dealAmount, 0);
  const avgDaysToClose = chains.length > 0 ? Math.round(chains.reduce((sum, c) => sum + c.daysToClose, 0) / chains.length) : 0;

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#22c55e' }}>
            REVENUE ORIGIN ATTRIBUTION · PHASE 18
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            REVENUE ATTRIBUTION CHAINS & SALES VELOCITY
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Every closed won contract traced back to its originating construction permit, tender award, or milestone event.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/analytics/revenue" className="action-btn secondary">
            Revenue Dashboard
          </Link>
          <Link href="/admin/executive" className="action-btn primary">
            Executive Briefing →
          </Link>
        </div>
      </div>

      {/* Top Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #22c55e' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>TOTAL ATTRIBUTED REVENUE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#22c55e', margin: '4px 0' }}>
            €{totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>100% Provenance Backed</div>
        </div>

        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #38bdf8' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>AVERAGE SALES VELOCITY</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8', margin: '4px 0' }}>
            {avgDaysToClose} Days
          </div>
          <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Signal to Won Contract</div>
        </div>
      </div>

      {/* Attribution Chains Table */}
      <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>Client Entity</th>
              <th>Service Package</th>
              <th>Originating Market Signal</th>
              <th>Touchpoint Dates (Signal → Contact → Proposal → Won)</th>
              <th>Velocity</th>
              <th>Contract Value (€)</th>
            </tr>
          </thead>
          <tbody>
            {chains.map(c => (
              <tr key={c.id}>
                <td>
                  <strong style={{ color: '#fff', fontSize: '0.85rem', display: 'block' }}>{c.companyName}</strong>
                  <span style={{ fontSize: '0.7rem', color: '#888' }}>{c.territory}</span>
                </td>
                <td style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{c.service}</td>
                <td>
                  <span className="badge" style={{ fontSize: '0.65rem', color: '#22c55e', borderColor: '#22c55e' }}>
                    {c.originSignal}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#888', display: 'block', marginTop: 2 }}>{c.signalDate}</span>
                </td>
                <td style={{ fontSize: '0.72rem', color: '#888' }}>
                  <span>Sig: {c.signalDate}</span> → <span>Contact: {c.firstContactDate}</span> → <span>Prop: {c.proposalDate}</span> → <strong style={{ color: '#22c55e' }}>Won: {c.wonDate}</strong>
                </td>
                <td>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>{c.daysToClose}d</span>
                </td>
                <td>
                  <strong style={{ fontSize: '1.05rem', color: '#22c55e' }}>€{c.dealAmount.toLocaleString()}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
