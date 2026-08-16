'use client';

import Link from 'next/link';

type Props = {
  companiesByType: Array<{ type: string; count: number }>;
  projectsByStatus: Array<{ status: string; count: number }>;
  marketByCity: Array<{ city: string; companiesCount: number; highOpportunityCount: number }>;
  digitalGaps: {
    missingWebsite: number;
    weakProjectPresentation: number;
    noLeadGen: number;
  };
};

export function MarketIntelligenceView({ companiesByType, projectsByStatus, marketByCity, digitalGaps }: Props) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            Built Environment Industry Distribution
          </div>
          <h1 className="admin-title" style={{ margin: '4px 0 0 0' }}>
            MARKET INTELLIGENCE & INDUSTRY SEGMENTS
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/campaigns" className="btn">
            Target Campaigns →
          </Link>
          <Link href="/admin/commercial" className="btn fill">
            Commercial Command Center →
          </Link>
        </div>
      </div>

      {/* Top Digital Gaps Bar */}
      <section className="admin-panel" style={{ marginBottom: 28, background: '#141715', border: '1px solid #262927' }}>
        <div className="eyebrow" style={{ color: '#d4af37' }}>
          Industry-Wide Digital Gaps (Commercial Transformation Opportunities)
        </div>
        <h2 style={{ fontSize: 20, margin: '6px 0 16px 0' }}>MARKET-WIDE DIGITAL DEFICITS</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div style={{ background: '#0d0f0e', padding: 18, borderRadius: 6, border: '1px solid #222' }}>
            <span className="eyebrow" style={{ color: '#fca5a5' }}>MISSING / OUTDATED WEBSITES</span>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginTop: 4 }}>{digitalGaps.missingWebsite}</div>
            <span style={{ fontSize: 11, color: '#888' }}>Practices without modern web presence</span>
          </div>

          <div style={{ background: '#0d0f0e', padding: 18, borderRadius: 6, border: '1px solid #222' }}>
            <span className="eyebrow" style={{ color: '#fde047' }}>WEAK PROJECT PRESENTATION</span>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginTop: 4 }}>{digitalGaps.weakProjectPresentation}</div>
            <span style={{ fontSize: 11, color: '#888' }}>No architectural photography / drone</span>
          </div>

          <div style={{ background: '#0d0f0e', padding: 18, borderRadius: 6, border: '1px solid #222' }}>
            <span className="eyebrow" style={{ color: '#d4af37' }}>ZERO LEAD GENERATION FUNNEL</span>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#d4af37', marginTop: 4 }}>{digitalGaps.noLeadGen}</div>
            <span style={{ fontSize: 11, color: '#888' }}>Missing direct inquiry capture</span>
          </div>
        </div>
      </section>

      {/* Grid: Companies by Type & Geographic Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, marginBottom: 28 }}>
        {/* Industry Segments */}
        <section className="admin-panel">
          <div className="eyebrow">Industry Sectors</div>
          <h3 style={{ fontSize: 18, margin: '6px 0 16px 0' }}>COMPANIES BY CLASSIFICATION</h3>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Sector</th>
                <th>Companies</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {companiesByType.map(t => (
                <tr key={t.type}>
                  <td><strong>{t.type}</strong></td>
                  <td>{t.count}</td>
                  <td>
                    <Link href={`/admin/prospects`} className="link-arrow">
                      View Segment →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Geographic Distribution */}
        <section className="admin-panel">
          <div className="eyebrow">Geographic Opportunity Map</div>
          <h3 style={{ fontSize: 18, margin: '6px 0 16px 0' }}>ROMANIA REGIONAL DISTRIBUTION</h3>

          <table className="admin-table">
            <thead>
              <tr>
                <th>City / Region</th>
                <th>Total Companies</th>
                <th>High Opportunity</th>
              </tr>
            </thead>
            <tbody>
              {marketByCity.map(c => (
                <tr key={c.city}>
                  <td><strong>{c.city}</strong></td>
                  <td>{c.companiesCount}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: c.highOpportunityCount > 0 ? '#86efac' : '#888' }}>
                      {c.highOpportunityCount} High
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {/* Projects Distribution */}
      <section className="admin-panel">
        <div className="eyebrow">Construction Activity</div>
        <h3 style={{ fontSize: 18, margin: '6px 0 16px 0' }}>PROJECTS BY CONSTRUCTION STATUS</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {projectsByStatus.map(st => (
            <div key={st.status} style={{ background: '#0d0f0e', padding: 16, borderRadius: 6, border: '1px solid #222' }}>
              <span className="eyebrow">{st.status.toUpperCase()}</span>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginTop: 4 }}>{st.count}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
