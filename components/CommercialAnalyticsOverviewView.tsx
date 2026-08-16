'use client';

import React from 'react';
import Link from 'next/link';

type Props = {
  data: {
    verifiedOpportunities: number;
    contactReady: number;
    contacted: number;
    meetingsBooked: number;
    proposalsSent: number;
    wonDeals: number;
    winRate: number;
    pipelineValue: number;
    wonRevenue: number;
    avgDealSize: number;
    avgDaysToClose: number;
  };
};

export function CommercialAnalyticsOverviewView({ data }: Props) {
  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#22c55e' }}>
            COMMERCIAL PERFORMANCE & CONVERSION FUNNEL · PHASE 19
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            COMMERCIAL PIPELINE & ACQUISITION ANALYTICS
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Full funnel metrics derived exclusively from production-verified opportunities, proposals, and closed deals.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/analytics/attribution" className="action-btn secondary">
            Attribution Chains →
          </Link>
          <Link href="/admin/executive" className="action-btn primary">
            Executive Briefing
          </Link>
        </div>
      </div>

      {/* Top Financials */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #22c55e' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>VERIFIED WON REVENUE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#22c55e', margin: '4px 0' }}>€{data.wonRevenue.toLocaleString()}</div>
          <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>{data.wonDeals} Closed Deal(s)</div>
        </div>

        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #38bdf8' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>ACTIVE PIPELINE VALUE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8', margin: '4px 0' }}>€{data.pipelineValue.toLocaleString()}</div>
          <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Proposals Under Review</div>
        </div>

        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #d4af37' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>AVERAGE DEAL SIZE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#d4af37', margin: '4px 0' }}>€{data.avgDealSize.toLocaleString()}</div>
          <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Per Closed Contract</div>
        </div>

        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #a855f7' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>SALES VELOCITY</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#a855f7', margin: '4px 0' }}>{data.avgDaysToClose} Days</div>
          <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Average Days to Close</div>
        </div>
      </div>

      {/* Funnel Progress Visualizer */}
      <section className="admin-card" style={{ padding: 20 }}>
        <h2 style={{ fontSize: '1.05rem', margin: '0 0 16px 0', fontWeight: 800 }}>
          CONVERSION FUNNEL STAGES
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 4, textAlign: 'center' }}>
            <span style={{ fontSize: '0.65rem', color: '#888', display: 'block', textTransform: 'uppercase' }}>1. Opportunities</span>
            <strong style={{ fontSize: '1.4rem', color: '#fff' }}>{data.verifiedOpportunities}</strong>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 4, textAlign: 'center' }}>
            <span style={{ fontSize: '0.65rem', color: '#888', display: 'block', textTransform: 'uppercase' }}>2. Contact Ready</span>
            <strong style={{ fontSize: '1.4rem', color: '#38bdf8' }}>{data.contactReady}</strong>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 4, textAlign: 'center' }}>
            <span style={{ fontSize: '0.65rem', color: '#888', display: 'block', textTransform: 'uppercase' }}>3. Contacted</span>
            <strong style={{ fontSize: '1.4rem', color: '#a855f7' }}>{data.contacted}</strong>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 4, textAlign: 'center' }}>
            <span style={{ fontSize: '0.65rem', color: '#888', display: 'block', textTransform: 'uppercase' }}>4. Meetings</span>
            <strong style={{ fontSize: '1.4rem', color: '#eab308' }}>{data.meetingsBooked}</strong>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 4, textAlign: 'center' }}>
            <span style={{ fontSize: '0.65rem', color: '#888', display: 'block', textTransform: 'uppercase' }}>5. Proposals</span>
            <strong style={{ fontSize: '1.4rem', color: '#f97316' }}>{data.proposalsSent}</strong>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 4, textAlign: 'center', border: '1px solid #22c55e' }}>
            <span style={{ fontSize: '0.65rem', color: '#22c55e', display: 'block', textTransform: 'uppercase', fontWeight: 800 }}>6. Won</span>
            <strong style={{ fontSize: '1.4rem', color: '#22c55e' }}>{data.wonDeals}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
