'use client';

import Link from 'next/link';

type Props = {
  totals: {
    discovered: number;
    researched: number;
    verified: number;
    published: number;
    highOpportunity: number;
    contactReady: number;
  };
  byGeography: Array<{
    city: string;
    total: number;
    published: number;
    highOpp: number;
    coveragePct: string;
  }>;
  bySector: Array<{
    sector: string;
    total: number;
    published: number;
    highOpp: number;
  }>;
};

export function MarketCoverageView({ totals, byGeography, bySector }: Props) {
  function handleExport(type: string) {
    window.location.href = `/api/admin/export?type=${type}`;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            National Construction Database Density
          </div>
          <h1 className="admin-title" style={{ margin: '4px 0 0 0' }}>
            MARKET COVERAGE & DATA GAPS
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/market" className="btn">
            Market Intelligence →
          </Link>
          <Link href="/admin/prospects/activation" className="btn fill">
            Activate Prospects →
          </Link>
        </div>
      </div>

      {/* Coverage Funnel */}
      <section className="admin-panel" style={{ marginBottom: 28 }}>
        <div className="eyebrow" style={{ color: '#d4af37' }}>
          Intelligence Maturity Funnel
        </div>
        <h2 style={{ fontSize: 20, margin: '6px 0 20px 0' }}>DATA DENSITY & QUALIFICATION STAGES</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          <div style={{ background: '#0d0f0e', padding: 16, borderRadius: 6, border: '1px solid #222', textAlign: 'center' }}>
            <span className="eyebrow">DISCOVERED</span>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginTop: 4 }}>{totals.discovered}</div>
            <span style={{ fontSize: 10, color: '#888' }}>Entities Ingested</span>
          </div>

          <div style={{ background: '#0d0f0e', padding: 16, borderRadius: 6, border: '1px solid #222', textAlign: 'center' }}>
            <span className="eyebrow">RESEARCHED</span>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#d4af37', marginTop: 4 }}>{totals.researched}</div>
            <span style={{ fontSize: 10, color: '#888' }}>Structured Dossiers</span>
          </div>

          <div style={{ background: '#0d0f0e', padding: 16, borderRadius: 6, border: '1px solid #222', textAlign: 'center' }}>
            <span className="eyebrow">VERIFIED</span>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#86efac', marginTop: 4 }}>{totals.verified}</div>
            <span style={{ fontSize: 10, color: '#888' }}>Primary Source Proof</span>
          </div>

          <div style={{ background: '#0d0f0e', padding: 16, borderRadius: 6, border: '1px solid #222', textAlign: 'center' }}>
            <span className="eyebrow">PUBLISHED</span>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginTop: 4 }}>{totals.published}</div>
            <span style={{ fontSize: 10, color: '#888' }}>Editorial Live</span>
          </div>

          <div style={{ background: '#0d0f0e', padding: 16, borderRadius: 6, border: '1px solid #d4af37', textAlign: 'center' }}>
            <span className="eyebrow" style={{ color: '#d4af37' }}>HIGH OPPORTUNITY</span>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#d4af37', marginTop: 4 }}>{totals.highOpportunity}</div>
            <span style={{ fontSize: 10, color: '#d4af37' }}>Score 60+</span>
          </div>

          <div style={{ background: '#0d0f0e', padding: 16, borderRadius: 6, border: '1px solid #86efac', textAlign: 'center' }}>
            <span className="eyebrow" style={{ color: '#86efac' }}>CONTACT READY</span>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#86efac', marginTop: 4 }}>{totals.contactReady}</div>
            <span style={{ fontSize: 10, color: '#86efac' }}>Approved Outreach</span>
          </div>
        </div>
      </section>

      {/* Grid: Geography & Sector Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, marginBottom: 28 }}>
        <section className="admin-panel">
          <div className="eyebrow">Regional Coverage Density</div>
          <h3 style={{ fontSize: 18, margin: '6px 0 16px 0' }}>COVERAGE BY GEOGRAPHY</h3>

          <table className="admin-table">
            <thead>
              <tr>
                <th>City / Region</th>
                <th>Discovered</th>
                <th>Published</th>
                <th>High Opp</th>
                <th>Coverage</th>
              </tr>
            </thead>
            <tbody>
              {byGeography.map(g => (
                <tr key={g.city}>
                  <td><strong>{g.city}</strong></td>
                  <td>{g.total}</td>
                  <td>{g.published}</td>
                  <td>
                    <span style={{ color: '#d4af37', fontWeight: 700 }}>{g.highOpp}</span>
                  </td>
                  <td>
                    <span className="badge">{g.coveragePct}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="admin-panel">
          <div className="eyebrow">Industry Sectors</div>
          <h3 style={{ fontSize: 18, margin: '6px 0 16px 0' }}>COVERAGE BY SECTOR</h3>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Sector</th>
                <th>Discovered</th>
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
                  <td>
                    <span style={{ color: '#d4af37', fontWeight: 700 }}>{s.highOpp}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {/* Role-Protected Data Exports */}
      <section className="admin-panel" style={{ background: '#141715', border: '1px solid #262927' }}>
        <div className="eyebrow" style={{ color: '#d4af37' }}>
          Authorized Data Exports (CSV)
        </div>
        <h2 style={{ fontSize: 18, margin: '6px 0 16px 0' }}>STRUCTURED INTELLIGENCE EXPORTS</h2>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button type="button" className="btn" onClick={() => handleExport('companies')}>
            Export Companies CSV
          </button>
          <button type="button" className="btn" onClick={() => handleExport('projects')}>
            Export Projects CSV
          </button>
          <button type="button" className="btn" onClick={() => handleExport('prospects')}>
            Export Prospects CSV
          </button>
          <button type="button" className="btn" onClick={() => handleExport('opportunities')}>
            Export Opportunities CSV
          </button>
          <button type="button" className="btn" onClick={() => handleExport('campaigns')}>
            Export Campaigns CSV
          </button>
        </div>
      </section>
    </div>
  );
}
