'use client';

import React from 'react';
import Link from 'next/link';

type Props = {
  items: Array<{
    id: string;
    name: string;
    city: string;
    county: string;
    type: string;
    cuiCif: string;
    websiteVerification: string;
    activeProjectsCount: number;
    completedProjectsCount: number;
    decisionMaker: any;
    digitalAuditScore: number;
    opportunityScore: number;
    priorityScore: number;
    contactReadiness: {
      score: number;
      isReady: boolean;
      tier: string;
      missingRequirements: string[];
    };
    sourcesCount: number;
    status: string;
  }>;
};

export function GoldenDatasetQualityGateView({ items }: Props) {
  const total = items.length;
  const verifiedIdentity = items.filter(i => i.websiteVerification === 'verified' || i.websiteVerification === 'company_verified').length;
  const withProjects = items.filter(i => i.activeProjectsCount > 0 || i.completedProjectsCount > 0).length;
  const withDecisionMaker = items.filter(i => Boolean(i.decisionMaker)).length;
  const withSources = items.filter(i => i.sourcesCount > 0).length;
  const contactReady = items.filter(i => i.contactReadiness.isReady).length;
  const activated = items.filter(i => i.status === 'ACTIVATED' || i.status === 'CONTACT READY' || i.status === 'VERIFIED').length;

  const gates = [
    { title: 'Identity & Legal Entity Verification', count: verifiedIdentity, target: total, pass: verifiedIdentity >= total * 0.8 },
    { title: 'Primary / Secondary Source Provenance', count: withSources, target: total, pass: withSources >= total * 0.9 },
    { title: 'Verified Project & Asset Relationships', count: withProjects, target: total, pass: withProjects >= total * 0.75 },
    { title: 'Executive Decision Maker Identified', count: withDecisionMaker, target: total, pass: withDecisionMaker >= total * 0.6 },
    { title: 'Contact Readiness Threshold (≥70%)', count: contactReady, target: total, pass: contactReady >= total * 0.5 }
  ];

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            QUALITY GATEWAY · PHASE 14
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            GOLDEN DATASET QUALITY GATE
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Automated verification checks protecting production from unverified claims and ensuring zero fabrication.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/market/golden-dataset" className="action-btn primary">
            ← Golden Dataset Workstation
          </Link>
          <Link href="/admin/system/data" className="action-btn secondary">
            Subsystems Health
          </Link>
        </div>
      </div>

      {/* Hero Metric */}
      <div className="admin-card" style={{ padding: 24, marginBottom: 24, borderLeft: '4px solid #22c55e', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', letterSpacing: '0.08em' }}>
            AUTHORITATIVE GOLDEN DATASET COMPLETION
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#22c55e', margin: '4px 0' }}>
            {activated} <span style={{ fontSize: '1.4rem', color: '#888', fontWeight: 500 }}>/ 50 QUALIFIED</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
            {activated >= 50
              ? '✓ Full 50-target Golden Dataset is production verified and contact ready.'
              : `Strict truth metric: ${50 - activated} additional verified Romanian entities required to complete the golden dataset.`}
          </p>
        </div>

        <div style={{ background: '#0d0f0e', padding: '12px 20px', borderRadius: 6, border: '1px solid var(--line)', textAlign: 'right' }}>
          <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#888' }}>FABRICATION TOLERANCE</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38bdf8' }}>0.00% (STRICT ZERO)</div>
        </div>
      </div>

      {/* Quality Gate Dimensions */}
      <h2 style={{ fontSize: '1.15rem', margin: '0 0 14px 0', fontWeight: 700 }}>
        Verification Gate Criteria
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 30 }}>
        {gates.map((gate, idx) => (
          <div key={idx} className="admin-card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <strong style={{ fontSize: '0.9rem', color: '#fff' }}>{gate.title}</strong>
              <span className={`status-pill ${gate.pass ? 'verified' : 'secondary'}`} style={{ fontSize: '0.65rem' }}>
                {gate.pass ? 'PASSED' : 'IN PROGRESS'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#888', marginBottom: 6 }}>
              <span>Verified count:</span>
              <strong style={{ color: '#cbd5e1' }}>{gate.count} / {gate.target}</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  background: gate.pass ? '#22c55e' : '#eab308',
                  height: '100%',
                  width: `${Math.min(100, (gate.count / (gate.target || 1)) * 100)}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
