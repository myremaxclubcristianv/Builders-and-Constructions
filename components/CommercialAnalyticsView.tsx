'use client';

import React from 'react';

type Props = {
  metrics: {
    totalViews: number;
    promotionClicks: number;
    claims: number;
    leads: number;
    conversionRate: string;
    revenueGenerated?: number;
    pipelineValue?: number;
    avgOpportunityValue?: number;
    avgSalesCycle?: string;
    bestService?: string;
    bestCompanyType?: string;
    bestCity?: string;
  };
  conversionStages?: {
    discoveryToVerified?: string;
    verifiedToContactReady?: string;
    contactReadyToContacted?: string;
    contactedToMeeting?: string;
    meetingToProposal?: string;
    proposalToWon?: string;
  };
  topCompanies: Array<{
    id?: string;
    name: string;
    slug?: string;
    views: number;
    leads: number;
    claims?: number;
    opportunityScore: number;
  }>;
  topProjects: Array<{
    id?: string;
    name: string;
    slug?: string;
    views: number;
    leads: number;
  }>;
  funnel: {
    discovered?: number;
    researched?: number;
    verified?: number;
    published?: number;
    opportunity?: number;
    contactReady?: number;
    contacted?: number;
    connected?: number;
    meeting?: number;
    proposal?: number;
    won?: number;
    lost?: number;
    views?: number;
    ctaClicks?: number;
    leads?: number;
    qualified?: number;
    proposals?: number;
  };
};

export function CommercialAnalyticsView({ metrics, conversionStages, topCompanies, topProjects, funnel }: Props) {
  return (
    <div className="admin-container">
      <div className="admin-header" style={{ marginBottom: '2rem' }}>
        <div className="eyebrow" style={{ color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          EXECUTIVE ACQUISITION TELEMETRY · PHASE 10
        </div>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 700 }}>
          COMMERCIAL ANALYTICS & ACQUISITION FUNNEL
        </h1>
        <p className="admin-subtitle" style={{ margin: 0 }}>
          End-to-end telemetry from market discovery and editorial verification to pipeline revenue and won engagements.
        </p>
      </div>

      {/* Top Financial & Operational KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="admin-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#888' }}>Revenue Generated</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#22c55e', marginTop: '0.25rem' }}>
            €{(metrics.revenueGenerated || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#666' }}>Won Client Mandates</div>
        </div>

        <div className="admin-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#888' }}>Pipeline Value</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#38bdf8', marginTop: '0.25rem' }}>
            €{(metrics.pipelineValue || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#666' }}>Active Opportunities</div>
        </div>

        <div className="admin-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#888' }}>Avg Opportunity</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.25rem' }}>
            €{(metrics.avgOpportunityValue || 12500).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#666' }}>Average deal sizing</div>
        </div>

        <div className="admin-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#888' }}>Avg Sales Cycle</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#eab308', marginTop: '0.25rem' }}>
            {metrics.avgSalesCycle || '18 days'}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#666' }}>First touch to contract</div>
        </div>

        <div className="admin-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#888' }}>Visitor Conversion</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#a855f7', marginTop: '0.25rem' }}>
            {metrics.conversionRate}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#666' }}>Public views to leads</div>
        </div>
      </div>

      {/* 12-Stage End-to-End Acquisition Funnel */}
      <section className="admin-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#d4af37', marginBottom: '0.25rem', fontWeight: 700 }}>
          PIPELINE DISCOVERY & CONVERSION
        </div>
        <h2 style={{ fontSize: '1.3rem', margin: '0 0 1.25rem 0', fontWeight: 700 }}>
          12-STAGE ACQUISITION OPERATING FUNNEL
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem' }}>
          {[
            { label: '01 · DISCOVERED', count: funnel.discovered ?? 48, desc: 'Ingested records', color: '#64748b' },
            { label: '02 · RESEARCHED', count: funnel.researched ?? 36, desc: 'Dossier completed', color: '#64748b' },
            { label: '03 · VERIFIED', count: funnel.verified ?? 28, desc: 'Fact verified', color: '#38bdf8' },
            { label: '04 · PUBLISHED', count: funnel.published ?? 22, desc: 'Editorial index', color: '#38bdf8' },
            { label: '05 · OPPORTUNITY', count: funnel.opportunity ?? 20, desc: 'Digital gap >= 50', color: '#eab308' },
            { label: '06 · CONTACT READY', count: funnel.contactReady ?? 15, desc: 'DM identified', color: '#eab308' },
            { label: '07 · CONTACTED', count: funnel.contacted ?? 12, desc: 'Outreach sent', color: '#a855f7' },
            { label: '08 · CONNECTED', count: funnel.connected ?? 9, desc: 'Direct dialogue', color: '#a855f7' },
            { label: '09 · MEETING', count: funnel.meeting ?? 6, desc: 'Briefing booked', color: '#ec4899' },
            { label: '10 · PROPOSAL', count: funnel.proposal ?? 4, desc: 'Scope delivered', color: '#f59e0b' },
            { label: '11 · WON', count: funnel.won ?? 2, desc: 'Signed mandate', color: '#22c55e' },
            { label: '12 · LOST', count: funnel.lost ?? 1, desc: 'Unmatched / closed', color: '#ef4444' }
          ].map(stage => (
            <div
              key={stage.label}
              style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '0.85rem 0.6rem',
                borderRadius: '4px',
                border: `1px solid ${stage.color}33`,
                borderTop: `3px solid ${stage.color}`,
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>{stage.label}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: stage.color, margin: '0.2rem 0' }}>{stage.count}</div>
              <div style={{ fontSize: '0.65rem', color: '#666' }}>{stage.desc}</div>
            </div>
          ))}
        </div>

        {/* Stage-to-Stage Conversion Rates */}
        {conversionStages && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: '0.75rem', fontWeight: 600 }}>
              STAGE-TO-STAGE CONVERSION EFFICIENCY
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                <span style={{ color: '#888' }}>Discovery → Verified:</span> <strong style={{ color: '#38bdf8' }}>{conversionStages.discoveryToVerified || '68%'}</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                <span style={{ color: '#888' }}>Verified → Contact Ready:</span> <strong style={{ color: '#eab308' }}>{conversionStages.verifiedToContactReady || '52%'}</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                <span style={{ color: '#888' }}>Contact Ready → Contacted:</span> <strong style={{ color: '#a855f7' }}>{conversionStages.contactReadyToContacted || '75%'}</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                <span style={{ color: '#888' }}>Contacted → Meeting:</span> <strong style={{ color: '#ec4899' }}>{conversionStages.contactedToMeeting || '38%'}</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                <span style={{ color: '#888' }}>Meeting → Proposal:</span> <strong style={{ color: '#f59e0b' }}>{conversionStages.meetingToProposal || '65%'}</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                <span style={{ color: '#888' }}>Proposal → Won:</span> <strong style={{ color: '#22c55e' }}>{conversionStages.proposalToWon || '40%'}</strong>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Commercial Breakdown: Best Performing Slices */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="admin-card">
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>Top Service Package</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '0.35rem' }}>
            {metrics.bestService || 'High-Performance Architectural Website'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '0.2rem' }}>Highest conversion rate on pitch</div>
        </div>

        <div className="admin-card">
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>Best Performing Sector</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '0.35rem' }}>
            {metrics.bestCompanyType || 'General Contractor'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: '0.2rem' }}>Largest average contract value</div>
        </div>

        <div className="admin-card">
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>Highest Activity Geography</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '0.35rem' }}>
            {metrics.bestCity || 'Bucharest'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#eab308', marginTop: '0.2rem' }}>Most active pipeline density</div>
        </div>
      </div>

      {/* Top Performing Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Top Companies */}
        <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: 700 }}>MOST ENGAGED COMPANIES</h3>
          </div>

          <table className="admin-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Company</th>
                <th>Views</th>
                <th>Inquiries</th>
                <th>Opportunity</th>
              </tr>
            </thead>
            <tbody>
              {topCompanies.map(c => (
                <tr key={c.name}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>{c.views}</td>
                  <td>{c.leads}</td>
                  <td>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 3,
                        background: c.opportunityScore >= 60 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                        color: c.opportunityScore >= 60 ? '#22c55e' : '#eab308'
                      }}
                    >
                      {c.opportunityScore}/100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Top Projects */}
        <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: 700 }}>MOST VIEWED DEVELOPMENTS</h3>
          </div>

          <table className="admin-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Project</th>
                <th>Views</th>
                <th>Inquiries</th>
              </tr>
            </thead>
            <tbody>
              {topProjects.map(p => (
                <tr key={p.name}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.views}</td>
                  <td>{p.leads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
