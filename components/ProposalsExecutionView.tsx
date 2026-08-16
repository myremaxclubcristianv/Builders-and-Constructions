'use client';

import React from 'react';
import Link from 'next/link';

type Props = {
  proposals: Array<{
    id: string;
    company_name: string;
    opportunity_title: string;
    service_bundle: string;
    total_amount: number;
    status: string;
    created_at: string;
    sent_at: string | null;
    won_at: string | null;
    last_viewed_at: string | null;
    client_name: string;
  }>;
};

export function ProposalsExecutionView({ proposals }: Props) {
  const wonProposals = proposals.filter(p => p.status === 'won');
  const wonRevenue = wonProposals.reduce((sum, p) => sum + p.total_amount, 0);
  const pipelineValue = proposals.reduce((sum, p) => sum + p.total_amount, 0);

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            COMMERCIAL PIPELINE · PHASE 16
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            PROPOSALS & CONTRACT WORKSTATION
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Active proposals, pricing, contract negotiation, and closed won revenue attributions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/analytics/revenue" className="action-btn secondary">
            Revenue Attribution →
          </Link>
          <Link href="/admin/acquisition" className="action-btn primary">
            Acquisition Hub
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #22c55e' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>CLOSED WON REVENUE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#22c55e', margin: '4px 0' }}>
            €{wonRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>{wonProposals.length} Contracts Signed</div>
        </div>

        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #38bdf8' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>ACTIVE PIPELINE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8', margin: '4px 0' }}>
            €{pipelineValue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>{proposals.length} Total Proposals</div>
        </div>
      </div>

      {/* Proposals List */}
      <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>Client Entity</th>
              <th>Deliverable Scope</th>
              <th>Executive Contact</th>
              <th>Deal Value (€)</th>
              <th>Status</th>
              <th>Created / Won Date</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map(p => (
              <tr key={p.id}>
                <td>
                  <strong style={{ color: '#fff', fontSize: '0.85rem', display: 'block' }}>{p.company_name}</strong>
                  <span style={{ fontSize: '0.68rem', color: '#888' }}>Proposal ID: {p.id}</span>
                </td>
                <td>
                  <strong style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block' }}>{p.service_bundle}</strong>
                  <span style={{ fontSize: '0.68rem', color: '#888' }}>{p.opportunity_title}</span>
                </td>
                <td style={{ fontSize: '0.78rem', color: '#fff' }}>{p.client_name}</td>
                <td>
                  <strong style={{ color: p.status === 'won' ? '#22c55e' : '#38bdf8', fontSize: '1.05rem' }}>
                    €{p.total_amount.toLocaleString()}
                  </strong>
                </td>
                <td>
                  <span className={`status-pill ${p.status === 'won' ? 'verified' : p.status === 'negotiation' ? 'warning' : 'draft'}`} style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                    {p.status}
                  </span>
                </td>
                <td style={{ fontSize: '0.75rem', color: '#888' }}>
                  {p.status === 'won' ? `Won: ${p.won_at}` : `Created: ${p.created_at}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
