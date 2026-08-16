'use client';

import React from 'react';
import Link from 'next/link';

type Props = {
  data: {
    metrics: {
      totalTarget: number;
      verifiedCompaniesCount: number;
      contactReadyCount: number;
      highPriorityCount: number;
      activeOutreachCount: number;
      activeProjectsCount: number;
      completedProjectsCount: number;
      decisionMakersCount: number;
      sourcesCount: number;
      activeSignalsCount: number;
      totalPipelineValue: number;
      totalWonRevenue: number;
      proposalsCount: number;
      wonDealsCount: number;
    };
    guards: Record<string, string>;
    topProspects: Array<{
      rank: number;
      id: string;
      name: string;
      city: string;
      county: string;
      type: string;
      cuiCif: string;
      priorityScore: number;
      contactReadiness: { score: number; isReady: boolean; tier: string };
      decisionMaker: any;
      activeProjectsCount: number;
      confidence: string;
      nextAction: string;
    }>;
  };
};

export function LiveMarketActivationView({ data }: Props) {
  const { metrics, guards, topProspects } = data;

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            OPERATIONAL ACTIVATION · PHASE 16
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            LIVE MARKET ACTIVATION CONTROL CENTER
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Live telemetry of verified Romanian market data, golden dataset progress, active construction sites, and revenue attribution.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/system/production-audit" className="action-btn secondary">
            System Audit →
          </Link>
          <Link href="/admin/acquisition" className="action-btn primary">
            Acquisition Hub
          </Link>
        </div>
      </div>

      {/* Production Integrity Firewall Status */}
      <div className="admin-card" style={{ padding: 18, marginBottom: 24, borderLeft: '4px solid #22c55e', background: '#0e110f' }}>
        <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#888', fontWeight: 700, marginBottom: 8 }}>
          PRODUCTION INTEGRITY & AUTHORITY GUARDS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12, fontSize: '0.78rem' }}>
          <div>
            <span style={{ color: '#888', display: 'block', fontSize: '0.65rem' }}>DATABASE AUTHORITY:</span>
            <strong style={{ color: '#22c55e' }}>{guards.productionAuthority}</strong>
          </div>
          <div>
            <span style={{ color: '#888', display: 'block', fontSize: '0.65rem' }}>MOCK FALLBACK:</span>
            <strong style={{ color: '#38bdf8' }}>{guards.mockFallback}</strong>
          </div>
          <div>
            <span style={{ color: '#888', display: 'block', fontSize: '0.65rem' }}>FABRICATION PROTECTION:</span>
            <strong style={{ color: '#22c55e' }}>{guards.fabricationProtection}</strong>
          </div>
          <div>
            <span style={{ color: '#888', display: 'block', fontSize: '0.65rem' }}>OUTREACH APPROVAL:</span>
            <strong style={{ color: '#d4af37' }}>{guards.outreachApproval}</strong>
          </div>
          <div>
            <span style={{ color: '#888', display: 'block', fontSize: '0.65rem' }}>PUBLICATION GATE:</span>
            <strong style={{ color: '#22c55e' }}>{guards.publicationGate}</strong>
          </div>
        </div>
      </div>

      {/* Live Market KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #d4af37' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>GOLDEN DATASET</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#d4af37', margin: '2px 0' }}>
            {metrics.verifiedCompaniesCount} <span style={{ fontSize: '1rem', color: '#888', fontWeight: 500 }}>/ {metrics.totalTarget}</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Verified Entities</div>
        </div>

        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #22c55e' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>CONTACT READY</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#22c55e', margin: '2px 0' }}>
            {metrics.contactReadyCount}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Leadership Sourced</div>
        </div>

        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #38bdf8' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>ACTIVE PROJECTS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8', margin: '2px 0' }}>
            {metrics.activeProjectsCount}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Under Construction</div>
        </div>

        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #a855f7' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>WON REVENUE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#a855f7', margin: '2px 0' }}>
            €{metrics.totalWonRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>{metrics.wonDealsCount} Closed Deals</div>
        </div>
      </div>

      {/* Top Verified Acquisition Targets */}
      <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>
            Top Active Acquisition Priorities (Production Verified)
          </h2>
          <Link href="/admin/acquisition" className="action-btn secondary" style={{ fontSize: '0.72rem' }}>
            View Full Leaderboard →
          </Link>
        </div>

        <table className="admin-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Company Entity</th>
              <th>Territory</th>
              <th>Active Sites</th>
              <th>Primary Contact</th>
              <th>Readiness</th>
              <th>Priority</th>
              <th>Confidence</th>
              <th>Next Action</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {topProspects.length > 0 ? (
              topProspects.map(p => (
                <tr key={p.id}>
                  <td style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d4af37' }}>#{p.rank}</td>
                  <td>
                    <strong style={{ color: '#fff', fontSize: '0.85rem', display: 'block' }}>{p.name}</strong>
                    <span style={{ fontSize: '0.68rem', color: '#888' }}>CUI: {p.cuiCif}</span>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>{p.city}, {p.county}</td>
                  <td>
                    <span style={{ color: p.activeProjectsCount > 0 ? '#22c55e' : '#888', fontWeight: 600, fontSize: '0.8rem' }}>
                      {p.activeProjectsCount} active
                    </span>
                  </td>
                  <td>
                    {p.decisionMaker ? (
                      <div>
                        <strong style={{ color: '#fff', fontSize: '0.78rem', display: 'block' }}>{p.decisionMaker.name}</strong>
                        <span style={{ color: '#38bdf8', fontSize: '0.68rem' }}>{p.decisionMaker.role}</span>
                      </div>
                    ) : (
                      <span style={{ color: '#eab308', fontSize: '0.7rem' }}>Pending DM</span>
                    )}
                  </td>
                  <td>
                    <span style={{ color: p.contactReadiness.isReady ? '#22c55e' : '#eab308', fontWeight: 700, fontSize: '0.8rem' }}>
                      {p.contactReadiness.score}%
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: p.priorityScore >= 75 ? '#22c55e' : '#eab308' }}>
                      {p.priorityScore}
                    </span>
                  </td>
                  <td>
                    <span className="badge" style={{ fontSize: '0.65rem' }}>{p.confidence}</span>
                  </td>
                  <td style={{ fontSize: '0.75rem', color: '#cbd5e1', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.nextAction}
                  </td>
                  <td>
                    <Link href={`/admin/companies/${p.id}/acquisition`} className="action-btn primary" style={{ fontSize: '0.7rem', padding: '3px 8px', whiteSpace: 'nowrap' }}>
                      Brief →
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '32px', color: '#888' }}>
                  NO CONTACT-READY PROSPECTS AVAILABLE IN PRODUCTION DATASET
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
