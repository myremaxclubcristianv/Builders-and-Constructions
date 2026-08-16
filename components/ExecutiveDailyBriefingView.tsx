'use client';

import React from 'react';
import Link from 'next/link';

type Props = {
  data: {
    contactNow: Array<{
      id: string;
      name: string;
      city: string;
      priorityScore: number;
      confidence: string;
      activeProjectsCount: number;
      decisionMaker: any;
      nextAction: string;
    }>;
    followUp: Array<{
      id: string;
      name: string;
      city: string;
      priorityScore: number;
      decisionMaker: any;
      nextAction: string;
    }>;
    newSignals: Array<{
      id: string;
      companyName: string;
      changeCategory: string;
      title: string;
      scoreDelta: number;
      sourceTier: string;
    }>;
    proposalsRequiringAction: Array<{
      id: string;
      company_name: string;
      service_bundle: string;
      total_amount: number;
      status: string;
    }>;
    revenueMetrics: {
      totalWonRevenue: number;
      totalPipelineValue: number;
      wonDealsCount: number;
      conversionRate: number;
    };
  };
};

export function ExecutiveDailyBriefingView({ data }: Props) {
  const { contactNow, followUp, newSignals, proposalsRequiringAction, revenueMetrics } = data;
  const topOpportunities = contactNow.slice(0, 5);

  return (
    <div className="admin-container">
      {/* Executive Command Header */}
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            OPERATIONAL COMMAND · PHASE 20
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 900, letterSpacing: '-0.06em' }}>
            WHAT SHOULD I DO TODAY?
          </h1>
          <p className="admin-subtitle" style={{ margin: 0, fontSize: '0.88rem' }}>
            Verified executive daily briefing: real contact priorities, follow-up actions, recent market changes, and verified revenue.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: '100%', maxWidth: 'max-content' }}>
          <Link href="/admin/acquisition/today" className="action-btn secondary" style={{ flex: '1 1 auto', minHeight: 44 }}>
            🎯 Daily Queue →
          </Link>
          <Link href="/admin/market/changes" className="action-btn primary" style={{ flex: '1 1 auto', minHeight: 44 }}>
            📡 Market Changes
          </Link>
        </div>
      </div>

      {/* Top Revenue Summary (4 Executive Metric Tiles) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: 20 }}>
        <div className="admin-card" style={{ padding: '14px 16px', borderLeft: '3px solid #22c55e' }}>
          <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', color: '#888', letterSpacing: '0.06em' }}>VERIFIED WON REVENUE</div>
          <div style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 900, color: '#22c55e', margin: '2px 0' }}>
            €{revenueMetrics.totalWonRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>{revenueMetrics.wonDealsCount} Closed Contracts</div>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', borderLeft: '3px solid #38bdf8' }}>
          <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', color: '#888', letterSpacing: '0.06em' }}>ACTIVE PIPELINE</div>
          <div style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 900, color: '#38bdf8', margin: '2px 0' }}>
            €{revenueMetrics.totalPipelineValue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>Proposals Outstanding</div>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', borderLeft: '3px solid #d4af37' }}>
          <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', color: '#888', letterSpacing: '0.06em' }}>CONTACT NOW</div>
          <div style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 900, color: '#d4af37', margin: '2px 0' }}>
            {contactNow.length}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>High Priority (Score ≥ 80)</div>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', borderLeft: '3px solid #a855f7' }}>
          <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', color: '#888', letterSpacing: '0.06em' }}>CONVERSION</div>
          <div style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 900, color: '#a855f7', margin: '2px 0' }}>
            {revenueMetrics.conversionRate > 0 ? `${revenueMetrics.conversionRate.toFixed(1)}%` : 'N/A'}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>Proposal to Won Ratio</div>
        </div>
      </div>

      {/* TOP 5 OPPORTUNITIES TODAY (Mobile-First Executive Dossier Stack) */}
      <section className="admin-card" style={{ padding: 18, marginBottom: 20, border: '1px solid rgba(199,166,117,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#d4af37', fontWeight: 800 }}>
              EXECUTIVE ACTION PRIORITY
            </div>
            <h2 style={{ fontSize: '1.2rem', margin: '2px 0 0 0', fontWeight: 800 }}>
              TOP OPPORTUNITIES TODAY
            </h2>
          </div>
          <Link href="/admin/acquisition/today" className="action-btn secondary" style={{ fontSize: '0.72rem', minHeight: 38 }}>
            View All ({contactNow.length}) →
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {topOpportunities.map((op, idx) => (
            <div
              key={op.id}
              style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 6,
                padding: '14px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: 12
              }}
            >
              <div style={{ flex: '1 1 240px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#d4af37', fontFamily: 'DM Mono' }}>#{idx + 1}</span>
                  <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{op.name}</strong>
                  <span className="badge" style={{ fontSize: '0.6rem' }}>{op.confidence}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginBottom: 6 }}>
                  {op.city} · {op.activeProjectsCount} verified development site(s)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span className="badge" style={{ color: '#22c55e', borderColor: '#22c55e', fontSize: '0.65rem' }}>
                    {op.nextAction}
                  </span>
                  {op.decisionMaker?.name && (
                    <span style={{ fontSize: '0.72rem', color: '#888' }}>
                      Contact: <strong style={{ color: '#fff' }}>{op.decisionMaker.name}</strong> ({op.decisionMaker.role})
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', minHeight: 60, gap: 8 }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#22c55e', display: 'block', lineHeight: 1 }}>
                    {op.priorityScore}
                  </span>
                  <span style={{ fontSize: '0.62rem', color: '#888', textTransform: 'uppercase' }}>Score</span>
                </div>

                <Link
                  href={`/admin/companies/${op.id}/acquisition`}
                  className="action-btn primary"
                  style={{ fontSize: '0.72rem', minHeight: 36, padding: '6px 12px' }}
                >
                  Open Dossier →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Grid: 01 Contact Now & 02 Follow Up */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 20 }}>
        {/* Section 01: Contact Now */}
        <section className="admin-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 800, color: '#22c55e' }}>
              01 · CONTACT NOW
            </h2>
            <span className="badge" style={{ fontSize: '0.65rem' }}>{contactNow.length} Targets</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {contactNow.map(c => (
              <div key={c.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 14px', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{c.name}</strong>
                  <span style={{ fontSize: '0.7rem', color: '#888', display: 'block' }}>{c.city} · {c.activeProjectsCount} active project(s)</span>
                  <span style={{ fontSize: '0.68rem', color: '#38bdf8', marginTop: 2, display: 'block' }}>
                    Action: {c.nextAction}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#22c55e', display: 'block' }}>{c.priorityScore}</span>
                  <Link href={`/admin/companies/${c.id}/acquisition`} className="action-btn primary" style={{ fontSize: '0.65rem', padding: '4px 8px', minHeight: 32 }}>
                    Brief →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 02: Follow Up */}
        <section className="admin-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 800, color: '#d4af37' }}>
              02 · FOLLOW UP QUEUE
            </h2>
            <span className="badge" style={{ fontSize: '0.65rem' }}>{followUp.length} Due</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {followUp.map(f => (
              <div key={f.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 14px', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{f.name}</strong>
                  <span style={{ fontSize: '0.7rem', color: '#888', display: 'block' }}>{f.city}</span>
                  <span style={{ fontSize: '0.68rem', color: '#eab308', marginTop: 2, display: 'block' }}>
                    {f.nextAction}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#eab308', display: 'block' }}>{f.priorityScore}</span>
                  <Link href={`/admin/companies/${f.id}/acquisition`} className="action-btn secondary" style={{ fontSize: '0.65rem', padding: '4px 8px', minHeight: 32 }}>
                    Open →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Grid: 03 New Signals & 04 Proposals Action */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {/* Section 03: New Market Signals */}
        <section className="admin-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 800, color: '#38bdf8' }}>
              03 · NEW MARKET SIGNALS
            </h2>
            <Link href="/admin/market/changes" className="action-btn secondary" style={{ fontSize: '0.65rem', minHeight: 32 }}>
              All Changes →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {newSignals.map(s => (
              <div key={s.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#fff', fontSize: '0.82rem' }}>{s.companyName}</strong>
                  <span style={{ color: '#22c55e', fontWeight: 800, fontSize: '0.8rem' }}>+{s.scoreDelta} Pts</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#cbd5e1', margin: '2px 0 0 0' }}>{s.title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 04: Proposals Requiring Action */}
        <section className="admin-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 800, color: '#a855f7' }}>
              04 · PROPOSALS REQUIRING ACTION
            </h2>
            <Link href="/admin/proposals" className="action-btn secondary" style={{ fontSize: '0.65rem', minHeight: 32 }}>
              Proposals →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {proposalsRequiringAction.map(p => (
              <div key={p.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#fff', fontSize: '0.82rem' }}>{p.company_name}</strong>
                  <span style={{ fontSize: '0.7rem', color: '#888', display: 'block' }}>{p.service_bundle}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ color: '#38bdf8', fontSize: '0.95rem' }}>€{p.total_amount.toLocaleString()}</strong>
                  <span className="badge" style={{ fontSize: '0.6rem', display: 'block', marginTop: 2 }}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
