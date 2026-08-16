'use client';

import Link from 'next/link';

type PriorityItem = {
  id: string;
  name: string;
  slug: string;
  type: string;
  location?: string | null;
  priority_score: number;
  priority_reasons: string[];
  opportunity_score: number;
  active_projects_count: number;
  website_status: string;
  next_action: string;
  next_action_date: string;
  recommended_services: string[];
  pipeline_status: string;
};

type Props = {
  metrics: {
    todayActionCount: number;
    overdueCount: number;
    highOpportunityCount: number;
    newLeadsCount: number;
    activeFollowUpsCount: number;
    proposalsCount: number;
    wonCount: number;
    revenuePipeline: number;
  };
  todayPriorities: PriorityItem[];
  funnel: {
    prospects: number;
    contacted: number;
    connected: number;
    meetings: number;
    proposals: number;
    won: number;
    lost: number;
  };
  lossAnalysis: Array<{ reason: string; count: number }>;
};

export function CommercialCommandCenterView({ metrics, todayPriorities, funnel, lossAnalysis }: Props) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            Daily Sales Operating System
          </div>
          <h1 className="admin-title" style={{ margin: '4px 0 0 0' }}>
            COMMERCIAL COMMAND CENTER
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/commercial/today" className="btn fill">
            Today&apos;s Outreach Queue →
          </Link>
          <Link href="/admin/market" className="btn">
            Market Intelligence →
          </Link>
          <Link href="/admin/campaigns" className="btn">
            Campaigns →
          </Link>
        </div>
      </div>

      {/* Top Executive Metrics Bar */}
      <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: 28 }}>
        <div className="metric" style={{ borderColor: '#d4af37' }}>
          <span className="eyebrow" style={{ color: '#d4af37' }}>TODAY&apos;S ACTIONS</span>
          <strong style={{ color: '#fff' }}>{metrics.todayActionCount}</strong>
        </div>
        <div className="metric" style={{ borderColor: metrics.overdueCount > 0 ? '#ef4444' : '#333' }}>
          <span className="eyebrow" style={{ color: metrics.overdueCount > 0 ? '#fca5a5' : '#888' }}>OVERDUE</span>
          <strong style={{ color: metrics.overdueCount > 0 ? '#fca5a5' : '#fff' }}>{metrics.overdueCount}</strong>
        </div>
        <div className="metric">
          <span className="eyebrow">NEW INBOUND</span>
          <strong>{metrics.newLeadsCount}</strong>
        </div>
        <div className="metric">
          <span className="eyebrow">FOLLOW-UPS</span>
          <strong>{metrics.activeFollowUpsCount}</strong>
        </div>
        <div className="metric">
          <span className="eyebrow">PROPOSALS</span>
          <strong>{metrics.proposalsCount}</strong>
        </div>
        <div className="metric" style={{ borderColor: '#86efac' }}>
          <span className="eyebrow" style={{ color: '#86efac' }}>WON CLIENTS</span>
          <strong style={{ color: '#86efac' }}>{metrics.wonCount}</strong>
        </div>
        <div className="metric" style={{ borderColor: '#d4af37' }}>
          <span className="eyebrow" style={{ color: '#d4af37' }}>PIPELINE VALUE</span>
          <strong style={{ color: '#d4af37' }}>€{metrics.revenuePipeline.toLocaleString()}</strong>
        </div>
      </div>

      {/* WHO SHOULD I CONTACT TODAY? Prioritized Leaderboard */}
      <section className="admin-panel" style={{ marginBottom: 32, background: '#141715', border: '1px solid #d4af37' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div>
            <div className="eyebrow" style={{ color: '#d4af37' }}>
              Dynamic Priority Engine
            </div>
            <h2 style={{ fontSize: 22, margin: '4px 0 0 0' }}>
              ★ WHO SHOULD I CONTACT TODAY? (TOP OUTREACH PRIORITIES)
            </h2>
          </div>
          <Link href="/admin/commercial/today" className="link-arrow">
            Open Full Daily Queue →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {todayPriorities.map((item, idx) => (
            <div
              key={item.id}
              style={{
                background: '#0d0f0e',
                border: '1px solid #262927',
                borderRadius: 8,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#d4af37' }}>
                    0{idx + 1} · PRIORITY {item.priority_score}/100
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 3,
                      background: '#86efac',
                      color: '#000'
                    }}
                  >
                    {item.opportunity_score}/100 OPP
                  </span>
                </div>

                <h3 style={{ fontSize: 18, color: '#fff', margin: '8px 0 2px 0' }}>{item.name}</h3>
                <div style={{ fontSize: 12, color: '#aaa9a1' }}>
                  {item.type} {item.location ? `· ${item.location}` : ''} · {item.active_projects_count} Active Projects
                </div>

                <div style={{ marginTop: 12, background: '#141715', padding: 10, borderRadius: 6, border: '1px solid #222' }}>
                  <span className="eyebrow" style={{ fontSize: 9, color: '#d4af37' }}>SCHEDULED NEXT ACTION</span>
                  <div style={{ fontSize: 13, color: '#fff', fontWeight: 600, marginTop: 2 }}>{item.next_action}</div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Due: {item.next_action_date}</div>
                </div>

                <div style={{ marginTop: 10 }}>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>Why This Company:</span>
                  <ul style={{ margin: '4px 0 0 0', paddingLeft: 16, fontSize: 12, color: '#d1cfc7', lineHeight: 1.5 }}>
                    {item.priority_reasons.slice(0, 3).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <Link href={`/admin/opportunities/${item.id}`} className="btn fill" style={{ flex: 1, textAlign: 'center', fontSize: 11, padding: '8px 12px' }}>
                  Open Workstation →
                </Link>
                <Link href={`/admin/companies/${item.id}/audit`} className="btn" style={{ fontSize: 11, padding: '8px 12px' }}>
                  Audit Gap →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Commercial Conversion Funnel */}
      <section className="admin-panel" style={{ marginBottom: 28 }}>
        <div className="eyebrow" style={{ color: '#d4af37' }}>
          End-to-End Operating Metrics
        </div>
        <h2 style={{ fontSize: 20, margin: '6px 0 20px 0' }}>COMMERCIAL OPERATING FUNNEL</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
          <div style={{ background: '#0d0f0e', padding: 16, borderRadius: 6, border: '1px solid #222', textAlign: 'center' }}>
            <span className="eyebrow">01 · PROSPECTS</span>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginTop: 4 }}>{funnel.prospects}</div>
            <span style={{ fontSize: 10, color: '#888' }}>Qualified Universe</span>
          </div>

          <div style={{ background: '#0d0f0e', padding: 16, borderRadius: 6, border: '1px solid #222', textAlign: 'center' }}>
            <span className="eyebrow">02 · CONTACTED</span>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#d4af37', marginTop: 4 }}>{funnel.contacted}</div>
            <span style={{ fontSize: 10, color: '#888' }}>Outreach Sent</span>
          </div>

          <div style={{ background: '#0d0f0e', padding: 16, borderRadius: 6, border: '1px solid #222', textAlign: 'center' }}>
            <span className="eyebrow">03 · CONNECTED</span>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginTop: 4 }}>{funnel.connected}</div>
            <span style={{ fontSize: 10, color: '#888' }}>Dialogue Active</span>
          </div>

          <div style={{ background: '#0d0f0e', padding: 16, borderRadius: 6, border: '1px solid #222', textAlign: 'center' }}>
            <span className="eyebrow">04 · MEETINGS</span>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#fde047', marginTop: 4 }}>{funnel.meetings}</div>
            <span style={{ fontSize: 10, color: '#888' }}>Briefings Held</span>
          </div>

          <div style={{ background: '#0d0f0e', padding: 16, borderRadius: 6, border: '1px solid #222', textAlign: 'center' }}>
            <span className="eyebrow">05 · PROPOSALS</span>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginTop: 4 }}>{funnel.proposals}</div>
            <span style={{ fontSize: 10, color: '#888' }}>Scopes Sent</span>
          </div>

          <div style={{ background: '#0d0f0e', padding: 16, borderRadius: 6, border: '1px solid #86efac', textAlign: 'center' }}>
            <span className="eyebrow" style={{ color: '#86efac' }}>06 · WON</span>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#86efac', marginTop: 4 }}>{funnel.won}</div>
            <span style={{ fontSize: 10, color: '#86efac' }}>Closed Clients</span>
          </div>
        </div>
      </section>
    </div>
  );
}
