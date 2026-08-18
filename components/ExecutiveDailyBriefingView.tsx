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
  const primaryTarget = contactNow[0] || null;

  return (
    <div className="admin-container">
      {/* 1. FIRST VIEWPORT HEADER & OPERATIONAL SUMMARY */}
      <div className="admin-header" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
          <div className="eyebrow" style={{ color: '#c7a675', letterSpacing: '0.14em' }}>
            OPERATIONAL COMMAND · PRODUCTION TRUTH
          </div>
          <span className="status-pill verified" style={{ fontSize: '0.62rem', padding: '3px 8px' }}>
            VERIFIED REALITY
          </span>
        </div>

        <h1 style={{ margin: '0 0 8px 0', fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1.05, color: '#f3f1eb' }}>
          WHAT MATTERS TODAY
        </h1>
        <p className="admin-subtitle" style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(243,241,235,0.7)', maxWidth: 640 }}>
          Executive intelligence briefing derived exclusively from production data, verified market signals, and active closed contracts.
        </p>
      </div>

      {/* 2. PRIMARY EXECUTIVE DIRECTIVE CARD (WHAT MATTERS NOW / WHY NOW / NEXT ACTION) */}
      {primaryTarget && (
        <section
          className="admin-card"
          style={{
            padding: 20,
            marginBottom: 20,
            background: 'linear-gradient(135deg, rgba(13,16,15,0.95) 0%, rgba(20,24,22,0.9) 100%)',
            border: '1px solid rgba(199, 166, 117, 0.25)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#c7a675', fontWeight: 800 }}>
              #1 EXECUTIVE ACTION PRIORITY
            </span>
            <span className="badge" style={{ color: '#22c55e', borderColor: 'rgba(34,197,94,0.4)', background: 'rgba(34,197,94,0.08)', fontWeight: 700 }}>
              SCORE {primaryTarget.priorityScore} / 100
            </span>
          </div>

          <div style={{ marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 'clamp(1.3rem, 3.5vw, 1.7rem)', fontWeight: 800, color: '#f3f1eb', letterSpacing: '-0.03em' }}>
              {primaryTarget.name}
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'rgba(243,241,235,0.65)', marginTop: 2 }}>
              {primaryTarget.city} · {primaryTarget.activeProjectsCount} verified development site(s)
            </div>
          </div>

          <div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', display: 'grid', gap: 12, marginBottom: 16, background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 6, border: '1px solid rgba(244,242,235,0.06)' }}>
            <div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(243,241,235,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>WHY NOW</div>
              <div style={{ fontSize: '0.78rem', color: '#f3f1eb', fontWeight: 600, marginTop: 2 }}>
                Verified construction signal & direct decision maker availability.
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(243,241,235,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>RECOMMENDED NEXT ACTION</div>
              <div style={{ fontSize: '0.78rem', color: '#22c55e', fontWeight: 700, marginTop: 2 }}>
                {primaryTarget.nextAction}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link
              href={`/admin/companies/${primaryTarget.id}/acquisition`}
              className="action-btn primary"
              style={{ flex: '1 1 180px', minHeight: 44, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}
            >
              Open Dossier →
            </Link>
            <Link
              href="/admin/acquisition/today"
              className="action-btn secondary"
              style={{ flex: '1 1 180px', minHeight: 44, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}
            >
              Action Queue ({contactNow.length}) →
            </Link>
          </div>
        </section>
      )}

      {/* 3. VERIFIED METRIC TILES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
        <div className="admin-card" style={{ padding: '14px 16px', borderLeft: '3px solid #22c55e' }}>
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'rgba(243,241,235,0.5)', letterSpacing: '0.08em' }}>VERIFIED WON REVENUE</div>
          <div style={{ fontSize: 'clamp(1.3rem, 2.8vw, 1.7rem)', fontWeight: 800, color: '#22c55e', margin: '3px 0' }}>
            €{revenueMetrics.totalWonRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'rgba(243,241,235,0.6)' }}>{revenueMetrics.wonDealsCount} Closed Contracts</div>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', borderLeft: '3px solid #38bdf8' }}>
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'rgba(243,241,235,0.5)', letterSpacing: '0.08em' }}>ACTIVE PIPELINE</div>
          <div style={{ fontSize: 'clamp(1.3rem, 2.8vw, 1.7rem)', fontWeight: 800, color: '#38bdf8', margin: '3px 0' }}>
            €{revenueMetrics.totalPipelineValue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'rgba(243,241,235,0.6)' }}>Proposals Outstanding</div>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', borderLeft: '3px solid #c7a675' }}>
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'rgba(243,241,235,0.5)', letterSpacing: '0.08em' }}>CONTACT NOW</div>
          <div style={{ fontSize: 'clamp(1.3rem, 2.8vw, 1.7rem)', fontWeight: 800, color: '#c7a675', margin: '3px 0' }}>
            {contactNow.length}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'rgba(243,241,235,0.6)' }}>High Priority (Score ≥ 80)</div>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', borderLeft: '3px solid #a855f7' }}>
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'rgba(243,241,235,0.5)', letterSpacing: '0.08em' }}>CONVERSION RATE</div>
          <div style={{ fontSize: 'clamp(1.3rem, 2.8vw, 1.7rem)', fontWeight: 800, color: '#a855f7', margin: '3px 0' }}>
            {revenueMetrics.conversionRate > 0 ? `${revenueMetrics.conversionRate.toFixed(1)}%` : 'N/A'}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'rgba(243,241,235,0.6)' }}>Proposal to Won Ratio</div>
        </div>
      </div>

      {/* 4. TOP OPPORTUNITIES TODAY (Mobile-First Card Stack) */}
      <section className="admin-card" style={{ padding: 18, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#c7a675', fontWeight: 800 }}>
              EXECUTIVE SELECTION
            </div>
            <h2 style={{ fontSize: '1.15rem', margin: '2px 0 0 0', fontWeight: 800, color: '#f3f1eb' }}>
              TOP OPPORTUNITIES TODAY
            </h2>
          </div>
          <Link href="/admin/acquisition/today" className="action-btn secondary" style={{ fontSize: '0.7rem', minHeight: 36 }}>
            View Full Queue ({contactNow.length}) →
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topOpportunities.map((op, idx) => (
            <div
              key={op.id}
              style={{
                background: 'rgba(0,0,0,0.35)',
                border: '1px solid rgba(244,242,235,0.08)',
                borderRadius: 6,
                padding: '14px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12
              }}
            >
              <div style={{ flex: '1 1 220px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#c7a675', fontFamily: 'DM Mono' }}>#{idx + 1}</span>
                  <strong style={{ color: '#f3f1eb', fontSize: '0.92rem' }}>{op.name}</strong>
                  <span className="status-pill verified" style={{ fontSize: '0.58rem', padding: '2px 6px' }}>{op.confidence}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(243,241,235,0.65)', marginBottom: 6 }}>
                  {op.city} · {op.activeProjectsCount} verified site(s)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span className="badge" style={{ color: '#22c55e', borderColor: 'rgba(34,197,94,0.4)', fontSize: '0.62rem' }}>
                    {op.nextAction}
                  </span>
                  {op.decisionMaker?.name && (
                    <span style={{ fontSize: '0.7rem', color: 'rgba(243,241,235,0.5)' }}>
                      Key Exec: <strong style={{ color: '#f3f1eb' }}>{op.decisionMaker.name}</strong> ({op.decisionMaker.role})
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#22c55e', display: 'block', lineHeight: 1 }}>
                    {op.priorityScore}
                  </span>
                  <span style={{ fontSize: '0.6rem', color: 'rgba(243,241,235,0.4)', textTransform: 'uppercase' }}>Score</span>
                </div>

                <Link
                  href={`/admin/companies/${op.id}/acquisition`}
                  className="action-btn primary"
                  style={{ fontSize: '0.7rem', minHeight: 36, padding: '6px 12px' }}
                >
                  Open Dossier →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. GRID: CONTACT NOW & FOLLOW UP QUEUE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 20 }}>
        {/* Contact Now */}
        <section className="admin-card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: '1rem', margin: 0, fontWeight: 800, color: '#22c55e' }}>
              01 · CONTACT NOW
            </h2>
            <span className="badge" style={{ fontSize: '0.62rem' }}>{contactNow.length} Verified Targets</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {contactNow.map(c => (
              <div key={c.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#f3f1eb', fontSize: '0.85rem' }}>{c.name}</strong>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(243,241,235,0.5)', display: 'block' }}>{c.city} · {c.activeProjectsCount} active site(s)</span>
                  <span style={{ fontSize: '0.65rem', color: '#38bdf8', marginTop: 2, display: 'block' }}>
                    Action: {c.nextAction}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#22c55e', display: 'block' }}>{c.priorityScore}</span>
                  <Link href={`/admin/companies/${c.id}/acquisition`} className="action-btn primary" style={{ fontSize: '0.62rem', padding: '4px 8px', minHeight: 30 }}>
                    Brief →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Follow Up */}
        <section className="admin-card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: '1rem', margin: 0, fontWeight: 800, color: '#c7a675' }}>
              02 · FOLLOW UP QUEUE
            </h2>
            <span className="badge" style={{ fontSize: '0.62rem' }}>{followUp.length} Action Due</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {followUp.map(f => (
              <div key={f.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#f3f1eb', fontSize: '0.85rem' }}>{f.name}</strong>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(243,241,235,0.5)', display: 'block' }}>{f.city}</span>
                  <span style={{ fontSize: '0.65rem', color: '#eab308', marginTop: 2, display: 'block' }}>
                    {f.nextAction}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#eab308', display: 'block' }}>{f.priorityScore}</span>
                  <Link href={`/admin/companies/${f.id}/acquisition`} className="action-btn secondary" style={{ fontSize: '0.62rem', padding: '4px 8px', minHeight: 30 }}>
                    Open →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 6. GRID: SIGNALS & PROPOSALS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {/* New Signals */}
        <section className="admin-card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: '1rem', margin: 0, fontWeight: 800, color: '#38bdf8' }}>
              03 · MARKET SIGNALS
            </h2>
            <Link href="/admin/market/changes" className="action-btn secondary" style={{ fontSize: '0.62rem', minHeight: 30 }}>
              All Changes →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {newSignals.map(s => (
              <div key={s.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#f3f1eb', fontSize: '0.82rem' }}>{s.companyName}</strong>
                  <span style={{ color: '#22c55e', fontWeight: 800, fontSize: '0.78rem' }}>+{s.scoreDelta} Pts</span>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'rgba(243,241,235,0.65)', margin: '2px 0 0 0' }}>{s.title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Proposals Action */}
        <section className="admin-card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: '1rem', margin: 0, fontWeight: 800, color: '#a855f7' }}>
              04 · PROPOSALS ACTION
            </h2>
            <Link href="/admin/proposals" className="action-btn secondary" style={{ fontSize: '0.62rem', minHeight: 30 }}>
              Proposals →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {proposalsRequiringAction.map(p => (
              <div key={p.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#f3f1eb', fontSize: '0.82rem' }}>{p.company_name}</strong>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(243,241,235,0.5)', display: 'block' }}>{p.service_bundle}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ color: '#38bdf8', fontSize: '0.92rem' }}>€{p.total_amount.toLocaleString()}</strong>
                  <span className="badge" style={{ fontSize: '0.58rem', display: 'block', marginTop: 2 }}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

