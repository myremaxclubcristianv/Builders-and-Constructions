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

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            OPERATIONAL COMMAND · PHASE 18
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '2rem', fontWeight: 900 }}>
            WHAT SHOULD I DO TODAY?
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Executive daily briefing: verified contact priorities, follow-up actions, recent market signals, and live revenue attribution.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/acquisition/today" className="action-btn secondary">
            Daily Sales Queue →
          </Link>
          <Link href="/admin/market/changes" className="action-btn primary">
            Market Changes
          </Link>
        </div>
      </div>

      {/* Top Revenue Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #22c55e' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>VERIFIED WON REVENUE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#22c55e', margin: '2px 0' }}>
            €{revenueMetrics.totalWonRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>{revenueMetrics.wonDealsCount} Closed Contracts</div>
        </div>

        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #38bdf8' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>ACTIVE PIPELINE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8', margin: '2px 0' }}>
            €{revenueMetrics.totalPipelineValue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Proposals Outstanding</div>
        </div>

        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #d4af37' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>CONTACT NOW TARGETS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#d4af37', margin: '2px 0' }}>
            {contactNow.length}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>High Priority (Score ≥ 80)</div>
        </div>

        <div className="admin-card" style={{ padding: 16, borderLeft: '3px solid #a855f7' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>CONVERSION RATE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#a855f7', margin: '2px 0' }}>
            {revenueMetrics.conversionRate.toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Proposal to Won Ratio</div>
        </div>
      </div>

      {/* Grid: 01 Contact Now & 02 Follow Up */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20, marginBottom: 24 }}>
        {/* Section 01: Contact Now */}
        <section className="admin-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, color: '#22c55e' }}>
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
                  <Link href={`/admin/companies/${c.id}/acquisition`} className="action-btn primary" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                    Brief →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 02: Follow Up */}
        <section className="admin-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, color: '#d4af37' }}>
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
                  <Link href={`/admin/companies/${f.id}/acquisition`} className="action-btn secondary" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                    Open →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Grid: 03 New Signals & 04 Proposals Action */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
        {/* Section 03: New Market Signals */}
        <section className="admin-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, color: '#38bdf8' }}>
              03 · NEW MARKET SIGNALS
            </h2>
            <Link href="/admin/market/changes" className="action-btn secondary" style={{ fontSize: '0.65rem' }}>
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
        <section className="admin-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, color: '#a855f7' }}>
              04 · PROPOSALS REQUIRING ACTION
            </h2>
            <Link href="/admin/proposals" className="action-btn secondary" style={{ fontSize: '0.65rem' }}>
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
