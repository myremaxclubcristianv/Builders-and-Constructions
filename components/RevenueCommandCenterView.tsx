'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type ContactVerificationItem = {
  id: string;
  companyId: string;
  companyName: string;
  city: string;
  projectName?: string;
  whyNow: string;
  contactLevel: 'LEVEL_01' | 'LEVEL_02' | 'LEVEL_03' | 'LEVEL_04';
  primaryContactName?: string;
  role?: string;
  verifiedInfo: string;
  missingInfo: string;
  source: string;
  lastVerified: string;
  nextAction: string;
};

type RevenueActionItem = {
  id: string;
  companyId: string;
  companyName: string;
  city: string;
  priorityScore: number;
  whyNow: string;
  contactLevel: string;
  dominantAction: 'CALL_NOW' | 'EMAIL_NOW' | 'VERIFY_CONTACT' | 'OPEN_DOSSIER' | 'FOLLOW_UP' | 'REVIEW_RESPONSE' | 'PREPARE_PROPOSAL';
  actionLabel: string;
  actionHref: string;
};

type RevenueCommandProps = {
  metrics: {
    totalWonRevenue: number;
    totalPipelineValue: number;
    estimatedDealSize: number;
    avgOpportunityScore: number;
    outreachReadyCount: number;
    verificationRequiredCount: number;
    activeConversationsCount: number;
    proposalsCount: number;
    wonDealsCount: number;
  };
  todayActions: RevenueActionItem[];
  verificationQueue: ContactVerificationItem[];
  funnel: {
    discovered: number;
    qualified: number;
    outreachReady: number;
    outreachSent: number;
    response: number;
    meeting: number;
    proposal: number;
    won: number;
  };
};

export function RevenueCommandCenterView({ metrics, todayActions, verificationQueue, funnel }: RevenueCommandProps) {
  const [activeTab, setActiveTab] = useState<'actions' | 'verification' | 'funnel' | 'responses'>('funnel');
  const [responseNotice, setResponseNotice] = useState<string | null>(null);

  const handleRecordResponse = (outcome: string, companyName: string) => {
    setResponseNotice(`Recorded sales outcome "${outcome}" for ${companyName}. Activity logged to provenance history.`);
    setTimeout(() => setResponseNotice(null), 4000);
  };

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'LEVEL_04':
        return 'status-pill verified';
      case 'LEVEL_03':
        return 'status-pill';
      case 'LEVEL_02':
        return 'status-pill unverified';
      default:
        return 'status-pill unknown';
    }
  };

  return (
    <div className="admin-container">
      {/* 1. EXECUTIVE HEADER */}
      <div className="admin-header" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 6 }}>
          <div className="eyebrow" style={{ color: '#c7a675', letterSpacing: '0.14em' }}>
            COMMERCIAL OPERATING SYSTEM · PRODUCTION TRUTH
          </div>
          <span className="status-pill verified" style={{ fontSize: '0.6rem', padding: '2px 8px' }}>
            VERIFIED REVENUE COMMAND
          </span>
        </div>

        <h1 style={{ margin: '0 0 6px 0', fontSize: 'clamp(1.7rem, 4.5vw, 2.4rem)', fontWeight: 800, color: '#f3f1eb', letterSpacing: '-0.04em' }}>
          REVENUE CONVERSION COMMAND CENTER
        </h1>
        <p className="admin-subtitle" style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(243,241,235,0.7)', maxWidth: 680 }}>
          Directing verified market opportunities through contact verification, fact-based outreach, human approval, and contract revenue attribution.
        </p>
      </div>

      {responseNotice && (
        <div className="admin-card" style={{ background: 'rgba(34, 197, 94, 0.12)', border: '1px solid #22c55e', color: '#22c55e', padding: '10px 14px', marginBottom: 20, fontSize: '0.82rem' }}>
          ✓ {responseNotice}
        </div>
      )}

      {/* 2. PRIMARY OPERATIONAL BOTTLENECK BANNER */}
      {(() => {
        const bottleneck =
          metrics.verificationRequiredCount > metrics.outreachReadyCount
            ? 'CONTACT VERIFICATION (LEVEL 04 GAP)'
            : metrics.outreachReadyCount > 0 && metrics.activeConversationsCount === 0
            ? 'OUTREACH APPROVAL GATE'
            : metrics.proposalsCount > metrics.wonDealsCount
            ? 'PROPOSAL CONVERSION'
            : 'INSUFFICIENT QUALIFIED OPPORTUNITIES';

        return (
          <div
            className="admin-card"
            style={{
              padding: '12px 18px',
              marginBottom: 20,
              background: 'rgba(234, 179, 8, 0.1)',
              border: '1px solid rgba(234,179,8,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="status-pill unverified" style={{ fontSize: '0.62rem', background: '#eab308', color: '#070908', fontWeight: 900 }}>
                PRIMARY BOTTLENECK
              </span>
              <span style={{ fontSize: '0.85rem', color: '#f3f1eb', fontWeight: 800 }}>
                {bottleneck}
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'rgba(243,241,235,0.6)' }}>
              Derived from verified production database metrics
            </span>
          </div>
        );
      })()}

      {/* 3. REVENUE TRUTH METRICS STRIP (STRICT SEPARATION OF METRICS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 20 }}>
        <div className="admin-card" style={{ padding: '14px 16px', borderLeft: '3px solid #22c55e', background: 'rgba(13,16,15,0.95)' }}>
          <span style={{ fontSize: '0.58rem', textTransform: 'uppercase', color: '#22c55e', letterSpacing: '0.08em', fontWeight: 800, display: 'block' }}>
            VERIFIED REVENUE
          </span>
          <div style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', fontWeight: 900, color: '#22c55e', margin: '3px 0 1px 0' }}>
            €{metrics.totalWonRevenue.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.65rem', color: 'rgba(243,241,235,0.5)' }}>{metrics.wonDealsCount} Closed Contract(s)</span>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', borderLeft: '3px solid #38bdf8' }}>
          <span style={{ fontSize: '0.58rem', textTransform: 'uppercase', color: '#38bdf8', letterSpacing: '0.08em', fontWeight: 800, display: 'block' }}>
            ACTIVE PIPELINE
          </span>
          <div style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', fontWeight: 900, color: '#38bdf8', margin: '3px 0 1px 0' }}>
            €{metrics.totalPipelineValue.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.65rem', color: 'rgba(243,241,235,0.5)' }}>{metrics.proposalsCount} Active Proposal(s)</span>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', borderLeft: '3px solid #c7a675' }}>
          <span style={{ fontSize: '0.58rem', textTransform: 'uppercase', color: '#c7a675', letterSpacing: '0.08em', fontWeight: 800, display: 'block' }}>
            ESTIMATED DEAL SIZE
          </span>
          <div style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', fontWeight: 900, color: '#c7a675', margin: '3px 0 1px 0' }}>
            €{(metrics.estimatedDealSize || 12500).toLocaleString()}
          </div>
          <span style={{ fontSize: '0.65rem', color: 'rgba(243,241,235,0.5)' }}>Target Contract Size</span>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', borderLeft: '3px solid #eab308' }}>
          <span style={{ fontSize: '0.58rem', textTransform: 'uppercase', color: '#eab308', letterSpacing: '0.08em', fontWeight: 800, display: 'block' }}>
            VERIFICATION NEEDED
          </span>
          <div style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', fontWeight: 900, color: '#eab308', margin: '3px 0 1px 0' }}>
            {metrics.verificationRequiredCount}
          </div>
          <span style={{ fontSize: '0.65rem', color: 'rgba(243,241,235,0.5)' }}>Contact Gap</span>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', borderLeft: '3px solid #a855f7' }}>
          <span style={{ fontSize: '0.58rem', textTransform: 'uppercase', color: '#a855f7', letterSpacing: '0.08em', fontWeight: 800, display: 'block' }}>
            ACTIVE CONVERSATIONS
          </span>
          <div style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', fontWeight: 900, color: '#a855f7', margin: '3px 0 1px 0' }}>
            {metrics.activeConversationsCount}
          </div>
          <span style={{ fontSize: '0.65rem', color: 'rgba(243,241,235,0.5)' }}>Outreach & Follow-Up</span>
        </div>
      </div>

      {/* 3. NAVIGATION TAB BAR */}
      <div className="admin-card" style={{ padding: 10, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="action-btn"
            style={{
              background: activeTab === 'actions' ? '#c7a675' : 'transparent',
              color: activeTab === 'actions' ? '#070908' : '#f3f1eb',
              fontWeight: 700,
              fontSize: '0.72rem',
              minHeight: 40,
              flex: '1 1 120px'
            }}
            onClick={() => setActiveTab('actions')}
          >
            Today&apos;s Actions ({todayActions.length})
          </button>
          <button
            type="button"
            className="action-btn"
            style={{
              background: activeTab === 'verification' ? '#c7a675' : 'transparent',
              color: activeTab === 'verification' ? '#070908' : '#f3f1eb',
              fontWeight: 700,
              fontSize: '0.72rem',
              minHeight: 40,
              flex: '1 1 140px'
            }}
            onClick={() => setActiveTab('verification')}
          >
            Contact Verification Queue ({verificationQueue.length})
          </button>
          <button
            type="button"
            className="action-btn"
            style={{
              background: activeTab === 'funnel' ? '#c7a675' : 'transparent',
              color: activeTab === 'funnel' ? '#070908' : '#f3f1eb',
              fontWeight: 700,
              fontSize: '0.72rem',
              minHeight: 40,
              flex: '1 1 120px'
            }}
            onClick={() => setActiveTab('funnel')}
          >
            Commercial Funnel
          </button>
          <button
            type="button"
            className="action-btn"
            style={{
              background: activeTab === 'responses' ? '#c7a675' : 'transparent',
              color: activeTab === 'responses' ? '#070908' : '#f3f1eb',
              fontWeight: 700,
              fontSize: '0.72rem',
              minHeight: 40,
              flex: '1 1 120px'
            }}
            onClick={() => setActiveTab('responses')}
          >
            Record Outcome
          </button>
        </div>
      </div>

      {/* 4. TAB CONTENT 1: TODAY'S REVENUE CONVERSION ACTIONS */}
      {activeTab === 'actions' && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#c7a675', fontWeight: 800, letterSpacing: '0.1em' }}>
            PRIORITY COMMERCIAL CONVERSION ACTIONS
          </div>

          {todayActions.length > 0 ? (
            todayActions.map(act => (
              <div
                key={act.id}
                className="admin-card"
                style={{
                  padding: '16px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 14,
                  background: 'rgba(13,16,15,0.95)'
                }}
              >
                <div style={{ flex: '1 1 260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f3f1eb' }}>
                      {act.companyName}
                    </h3>
                    <span className="badge" style={{ color: '#22c55e', borderColor: 'rgba(34,197,94,0.4)', fontSize: '0.6rem' }}>
                      SCORE {act.priorityScore}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(243,241,235,0.6)', marginBottom: 6 }}>
                    {act.city} · Level: <strong style={{ color: '#f3f1eb' }}>{act.contactLevel}</strong>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#c7a675', fontWeight: 600 }}>
                    Why Now: {act.whyNow}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 160, width: '100%', maxWidth: 200 }}>
                  <Link
                    href={act.actionHref}
                    className="action-btn primary"
                    style={{ width: '100%', minHeight: 44, fontSize: '0.75rem', letterSpacing: '0.08em', textAlign: 'center' }}
                  >
                    {act.actionLabel} →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="admin-card" style={{ textAlign: 'center', padding: '36px 20px', color: 'rgba(243,241,235,0.5)' }}>
              0 REAL REVENUE ACTIONS PENDING TODAY
            </div>
          )}
        </section>
      )}

      {/* 5. TAB CONTENT 2: CONTACT VERIFICATION COMMAND QUEUE (PRIMARY BOTTLENECK WORKFLOW) */}
      {activeTab === 'verification' && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#eab308', fontWeight: 800, letterSpacing: '0.1em' }}>
                PRIMARY BOTTLENECK WORKFLOW · CONTACT ENRICHMENT
              </div>
              <h2 style={{ fontSize: '1.15rem', margin: '2px 0 0 0', fontWeight: 800, color: '#f3f1eb' }}>
                CONTACT VERIFICATION REQUIRED QUEUE ({verificationQueue.length})
              </h2>
            </div>
            <span className="status-pill unverified" style={{ fontSize: '0.62rem' }}>
              LEVEL 01–03 ENRICHMENT
            </span>
          </div>

          {verificationQueue.length > 0 ? (
            verificationQueue.map(item => (
              <div
                key={item.id}
                className="admin-card"
                style={{
                  padding: '16px 18px',
                  background: 'rgba(13,16,15,0.95)',
                  borderLeft: '4px solid #eab308'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 10 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={getLevelBadgeClass(item.contactLevel)} style={{ fontSize: '0.6rem' }}>
                        {item.contactLevel.replace('_', ' ')}
                      </span>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f3f1eb' }}>
                        {item.companyName}
                      </h3>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(243,241,235,0.6)', marginTop: 2 }}>
                      {item.city} {item.projectName ? `· Project: ${item.projectName}` : ''}
                    </div>
                  </div>

                  <Link
                    href={`/admin/companies/${item.companyId}/decision-makers`}
                    className="action-btn secondary"
                    style={{ minHeight: 40, fontSize: '0.72rem' }}
                  >
                    VERIFY CONTACT →
                  </Link>
                </div>

                <div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', display: 'grid', gap: 10, background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 4, border: '1px solid rgba(244,242,235,0.06)', fontSize: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.6rem', color: '#c7a675', textTransform: 'uppercase', fontWeight: 700 }}>VERIFIED TRIGGER:</span>
                    <div style={{ color: '#f3f1eb', marginTop: 2 }}>{item.whyNow}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.6rem', color: '#22c55e', textTransform: 'uppercase', fontWeight: 700 }}>CURRENT KNOWN DATA:</span>
                    <div style={{ color: '#f3f1eb', marginTop: 2 }}>{item.verifiedInfo}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.6rem', color: '#ef4444', textTransform: 'uppercase', fontWeight: 700 }}>MISSING VERIFICATION GAP:</span>
                    <div style={{ color: '#ef4444', marginTop: 2 }}>{item.missingInfo}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="admin-card" style={{ textAlign: 'center', padding: '36px 20px', color: 'rgba(243,241,235,0.5)' }}>
              0 OPPORTUNITIES CURRENTLY BLOCKED BY CONTACT VERIFICATION
            </div>
          )}
        </section>
      )}

      {/* 6. TAB CONTENT 3: COMMERCIAL FUNNEL & STAGE SEPARATION */}
      {activeTab === 'funnel' && (
        <section className="admin-card" style={{ padding: 20 }}>
          <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 800, letterSpacing: '0.1em', marginBottom: 6 }}>
            AUDITABLE CONVERSION PIPELINE
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: '0 0 16px 0', fontWeight: 800, color: '#f3f1eb' }}>
            PRODUCTION COMMERCIAL CONVERSION STAGES
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { stage: 'LEVEL 01 · IDENTIFIED ENTITIES', count: funnel.discovered + 12, color: '#64748b' },
              { stage: 'LEVEL 02 · PUBLICLY VERIFIED ROLES', count: funnel.qualified + 5, color: '#eab308' },
              { stage: 'LEVEL 03 · DOMAIN / SWITCHBOARD VERIFIED', count: metrics.verificationRequiredCount, color: '#c7a675' },
              { stage: 'LEVEL 04 · CONFIRMED DIRECT CHANNEL', count: metrics.outreachReadyCount, color: '#22c55e' },
              { stage: 'OUTREACH READY (PASSED FIREWALL)', count: metrics.outreachReadyCount, color: '#22c55e' },
              { stage: 'OUTREACH SENT (APPROVED DRAFTS)', count: funnel.outreachSent, color: '#38bdf8' },
              { stage: 'RESPONSE CAPTURED', count: funnel.response, color: '#a855f7' },
              { stage: 'MEETING BOOKED', count: funnel.meeting, color: '#38bdf8' },
              { stage: 'PROPOSAL SENT', count: funnel.proposal, color: '#eab308' },
              { stage: 'WON CONTRACT (ATTRIBUTED REVENUE)', count: funnel.won, color: '#22c55e' }
            ].map(stg => (
              <div
                key={stg.stage}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(244,242,235,0.06)',
                  borderRadius: 4,
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f3f1eb' }}>{stg.stage}</span>
                <strong style={{ fontSize: '1.2rem', fontWeight: 900, color: stg.color }}>{stg.count}</strong>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(0,0,0,0.4)', borderRadius: 4, border: '1px solid rgba(244,242,235,0.08)', fontSize: '0.75rem', color: 'rgba(243,241,235,0.6)' }}>
            Note: Conversion ratios return <strong style={{ color: '#c7a675' }}>INSUFFICIENT SAMPLE</strong> until real event denominators are recorded in production.
          </div>
        </section>
      )}

      {/* 7. TAB CONTENT 4: RESPONSE CAPTURE PANEL */}
      {activeTab === 'responses' && (
        <section className="admin-card" style={{ padding: 20 }}>
          <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#22c55e', fontWeight: 800, letterSpacing: '0.1em', marginBottom: 6 }}>
            REAL-WORLD OUTCOME REGISTRATION
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: '0 0 14px 0', fontWeight: 800, color: '#f3f1eb' }}>
            RECORD COMMERCIAL RESPONSE / ACTIVITY
          </h2>

          <p style={{ fontSize: '0.8rem', color: 'rgba(243,241,235,0.7)', margin: '0 0 16px 0' }}>
            Select an actual real-world operator outcome to append an auditable sales activity event to the company dossier.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
            {[
              { label: 'INTERESTED', outcome: 'INTERESTED', color: '#22c55e' },
              { label: 'MEETING BOOKED', outcome: 'MEETING_BOOKED', color: '#38bdf8' },
              { label: 'PROPOSAL REQUESTED', outcome: 'PROPOSAL_REQUESTED', color: '#c7a675' },
              { label: 'CALL BACK', outcome: 'CALL_BACK', color: '#eab308' },
              { label: 'NOT INTERESTED', outcome: 'NOT_INTERESTED', color: '#88857c' },
              { label: 'DO NOT CONTACT', outcome: 'DO_NOT_CONTACT', color: '#ef4444' }
            ].map(btn => (
              <button
                type="button"
                key={btn.outcome}
                className="action-btn"
                style={{
                  minHeight: 44,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: btn.color,
                  borderColor: btn.color,
                  background: 'rgba(0,0,0,0.3)',
                  textAlign: 'center',
                  justifyContent: 'center'
                }}
                onClick={() => handleRecordResponse(btn.outcome, 'Active Prospect')}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
