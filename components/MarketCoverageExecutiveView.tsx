'use client';

import React from 'react';
import Link from 'next/link';

type Props = {
  data: {
    totalVerifiedCompanies: number;
    totalVerifiedProjects: number;
    totalActiveSignals: number;
    totalWonRevenue: number;
    territories: Array<{
      county: string;
      verifiedCompanies: number;
      verifiedProjects: number;
      activeSignals: number;
      wonRevenue: number;
    }>;
  };
};

export function MarketCoverageExecutiveView({ data }: Props) {
  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#38bdf8' }}>
            REGIONAL CONSTRUCTION FOOTPRINT · PHASE 19
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            ROMANIAN MARKET COVERAGE BY TERRITORY
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Real production density: verified companies, active construction sites, and won revenue by county.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/market/golden-dataset" className="action-btn secondary">
            Golden Dataset →
          </Link>
          <Link href="/admin/executive" className="action-btn primary">
            Executive Briefing
          </Link>
        </div>
      </div>

      {/* Top Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #38bdf8' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>VERIFIED COMPANIES</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8', margin: '4px 0' }}>{data.totalVerifiedCompanies}</div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Authoritative Registry Records</div>
        </div>

        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #22c55e' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>VERIFIED PROJECTS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#22c55e', margin: '4px 0' }}>{data.totalVerifiedProjects}</div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Permit & Inspection Backed</div>
        </div>

        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #a855f7' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>ACTIVE MARKET SIGNALS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#a855f7', margin: '4px 0' }}>{data.totalActiveSignals}</div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Permits & Tender Awards</div>
        </div>

        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #d4af37' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>TOTAL WON REVENUE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#d4af37', margin: '4px 0' }}>€{data.totalWonRevenue.toLocaleString()}</div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Traceable Won Deals</div>
        </div>
      </div>

      {/* Regional Table */}
      <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>County / Territory</th>
              <th>Verified Companies</th>
              <th>Verified Projects</th>
              <th>Active Signals</th>
              <th>Won Revenue (€)</th>
            </tr>
          </thead>
          <tbody>
            {data.territories.map(t => (
              <tr key={t.county}>
                <td><strong style={{ color: '#fff', fontSize: '0.85rem' }}>{t.county}</strong></td>
                <td><span style={{ color: '#38bdf8', fontWeight: 700 }}>{t.verifiedCompanies}</span></td>
                <td><span style={{ color: '#22c55e', fontWeight: 700 }}>{t.verifiedProjects}</span></td>
                <td><span style={{ color: '#a855f7', fontWeight: 700 }}>{t.activeSignals}</span></td>
                <td>
                  <strong style={{ color: t.wonRevenue > 0 ? '#22c55e' : '#888', fontSize: '0.9rem' }}>
                    {t.wonRevenue > 0 ? `€${t.wonRevenue.toLocaleString()}` : '€0'}
                  </strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
