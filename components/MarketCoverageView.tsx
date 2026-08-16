'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type CountyCoverage = {
  county: string;
  region: string;
  tier: number;
  companies: number;
  projects: number;
  activeProjects: number;
  verifiedCompanies: number;
  highOpp: number;
  contactReady: number;
  densityScore: number;
};

type Props = {
  totals: {
    counties: number;
    cities: number;
    companies: number;
    projects: number;
    verifiedCompanies: number;
    verifiedProjects: number;
    activeProjects: number;
    upcomingProjects: number;
    highOpportunity: number;
    contactReady: number;
    discovered?: number;
    researched?: number;
    verified?: number;
    published?: number;
  };
  countiesCoverage: CountyCoverage[];
  bySector: Array<{
    sector: string;
    total: number;
    published: number;
    highOpp: number;
  }>;
};

export function MarketCoverageView({ totals, countiesCoverage, bySector }: Props) {
  const [filterRegion, setFilterRegion] = useState<string>('all');

  const filteredCounties = filterRegion === 'all'
    ? countiesCoverage
    : countiesCoverage.filter(c => c.region.toLowerCase() === filterRegion.toLowerCase());

  function handleExport(type: string) {
    window.location.href = `/api/admin/export?type=${type}`;
  }

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            NATIONAL MARKET INTELLIGENCE · PHASE 11
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            ROMANIAN MARKET COVERAGE & DENSITY
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Verified construction intelligence density across Romanian counties, active developments, and contact-ready opportunities.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/admin/market/activity" className="action-btn secondary">
            Activity Signals →
          </Link>
          <Link href="/admin/acquisition" className="action-btn primary">
            Acquisition Hub →
          </Link>
        </div>
      </div>

      {/* 10 Core Market Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
        <div className="admin-card" style={{ padding: '14px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888', fontWeight: 700 }}>COUNTIES</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginTop: 4 }}>{totals.counties}</div>
          <div style={{ fontSize: '0.65rem', color: '#666' }}>Active Regions</div>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888', fontWeight: 700 }}>CITIES</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginTop: 4 }}>{totals.cities}</div>
          <div style={{ fontSize: '0.65rem', color: '#666' }}>Urban Hubs</div>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888', fontWeight: 700 }}>COMPANIES</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginTop: 4 }}>{totals.companies}</div>
          <div style={{ fontSize: '0.65rem', color: '#666' }}>Documented</div>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888', fontWeight: 700 }}>PROJECTS</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginTop: 4 }}>{totals.projects}</div>
          <div style={{ fontSize: '0.65rem', color: '#666' }}>Developments</div>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', textAlign: 'center', borderColor: '#22c55e44' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#22c55e', fontWeight: 700 }}>VERIFIED CO.</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22c55e', marginTop: 4 }}>{totals.verifiedCompanies}</div>
          <div style={{ fontSize: '0.65rem', color: '#22c55e88' }}>Primary Source</div>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', textAlign: 'center', borderColor: '#38bdf844' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 700 }}>VERIFIED PROJ.</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', marginTop: 4 }}>{totals.verifiedProjects}</div>
          <div style={{ fontSize: '0.65rem', color: '#38bdf888' }}>Confirmed Specs</div>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#eab308', fontWeight: 700 }}>ACTIVE SITES</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#eab308', marginTop: 4 }}>{totals.activeProjects}</div>
          <div style={{ fontSize: '0.65rem', color: '#eab30888' }}>Under Construction</div>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888', fontWeight: 700 }}>UPCOMING</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginTop: 4 }}>{totals.upcomingProjects}</div>
          <div style={{ fontSize: '0.65rem', color: '#666' }}>Planned / Permitting</div>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', textAlign: 'center', borderColor: '#d4af3744' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#d4af37', fontWeight: 700 }}>HIGH OPP.</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d4af37', marginTop: 4 }}>{totals.highOpportunity}</div>
          <div style={{ fontSize: '0.65rem', color: '#d4af3788' }}>Score ≥ 60</div>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', textAlign: 'center', borderColor: '#22c55e66', background: 'rgba(34,197,94,0.04)' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#22c55e', fontWeight: 700 }}>CONTACT READY</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22c55e', marginTop: 4 }}>{totals.contactReady}</div>
          <div style={{ fontSize: '0.65rem', color: '#22c55e88' }}>Verified DM Found</div>
        </div>
      </div>

      {/* Regional Density Table */}
      <section className="admin-card" style={{ marginBottom: 28, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>COUNTY COVERAGE & MARKET DENSITY</h2>
            <div style={{ fontSize: '0.75rem', color: '#888', marginTop: 2 }}>Breakdown across active Romanian construction territories</div>
          </div>

          {/* Region Filter */}
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'Muntenia', 'Transilvania', 'Banat', 'Moldova', 'Dobrogea'].map(reg => (
              <button
                key={reg}
                onClick={() => setFilterRegion(reg)}
                style={{
                  fontSize: '0.7rem',
                  padding: '4px 8px',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: filterRegion === reg ? '#d4af37' : 'rgba(255,255,255,0.1)',
                  background: filterRegion === reg ? '#d4af3722' : 'transparent',
                  color: filterRegion === reg ? '#d4af37' : '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                {reg.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <table className="admin-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>County / Hub</th>
              <th>Region</th>
              <th>Tier</th>
              <th>Companies</th>
              <th>Projects</th>
              <th>Active Sites</th>
              <th>Verified Co.</th>
              <th>High Opp</th>
              <th>Contact Ready</th>
              <th>Market Density</th>
            </tr>
          </thead>
          <tbody>
            {filteredCounties.map(c => (
              <tr key={c.county}>
                <td><strong style={{ color: '#fff' }}>{c.county}</strong></td>
                <td><span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{c.region}</span></td>
                <td><span className="badge">Tier {c.tier}</span></td>
                <td>{c.companies}</td>
                <td>{c.projects}</td>
                <td><strong style={{ color: '#eab308' }}>{c.activeProjects}</strong></td>
                <td><span style={{ color: '#22c55e' }}>{c.verifiedCompanies}</span></td>
                <td><span style={{ color: '#d4af37', fontWeight: 700 }}>{c.highOpp}</span></td>
                <td>
                  <span style={{ color: c.contactReady > 0 ? '#22c55e' : '#64748b', fontWeight: 700 }}>
                    {c.contactReady}
                  </span>
                </td>
                <td style={{ minWidth: 120 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${c.densityScore}%`, height: '100%', background: c.densityScore > 80 ? '#22c55e' : c.densityScore > 60 ? '#d4af37' : '#38bdf8' }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#888', width: 28, textAlign: 'right' }}>{c.densityScore}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Sector Breakdown & Authorized Exports */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
        <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 700 }}>COVERAGE BY SECTOR</h3>
          </div>
          <table className="admin-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Sector</th>
                <th>Total</th>
                <th>Published</th>
                <th>High Opp</th>
              </tr>
            </thead>
            <tbody>
              {bySector.map(s => (
                <tr key={s.sector}>
                  <td><strong>{s.sector}</strong></td>
                  <td>{s.total}</td>
                  <td>{s.published}</td>
                  <td><strong style={{ color: '#d4af37' }}>{s.highOpp}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="admin-card" style={{ padding: '18px 20px' }}>
          <div className="eyebrow" style={{ color: '#d4af37' }}>Structured Export Center</div>
          <h3 style={{ fontSize: '0.95rem', margin: '4px 0 12px 0', fontWeight: 700 }}>AUTHORITATIVE INTELLIGENCE EXPORTS</h3>
          <p style={{ fontSize: '0.78rem', color: '#888', marginBottom: 16 }}>
            Download verified datasets for offline executive analysis, CRM synchronization, and regional prospecting.
          </p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" className="action-btn secondary" onClick={() => handleExport('companies')}>
              Export Companies CSV
            </button>
            <button type="button" className="action-btn secondary" onClick={() => handleExport('projects')}>
              Export Projects CSV
            </button>
            <button type="button" className="action-btn secondary" onClick={() => handleExport('prospects')}>
              Export Prospects CSV
            </button>
            <button type="button" className="action-btn secondary" onClick={() => handleExport('opportunities')}>
              Export Opportunities CSV
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
