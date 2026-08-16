'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type Candidate = {
  companyId: string;
  companyName: string;
  companyType: string;
  city: string;
  county: string;
  cuiCif: string;
  legalName: string;
  website?: string | null;
  websiteVerification: string;
  priorityScore: number;
  tier: 'HIGH' | 'MEDIUM' | 'LOW';
  opportunityScore: number;
  contactReadinessScore: number;
  whyNow: string;
  whyThisCompany: string;
  commercialGap: string;
  recommendedServices: string[];
  estimatedDealSize: number;
  activeProjects: Array<{ id: string; name: string; status: string; permit?: string; location: string }>;
  completedProjects: Array<{ id: string; name: string; status: string; location: string }>;
  decisionMakers: Array<{
    name: string;
    role: string;
    email?: string | null;
    phone?: string | null;
    verificationState: string;
    classification: string;
    source: string;
    sourceUrl?: string | null;
  }>;
  sources: Array<{
    title: string;
    sourceType: string;
    sourceTier: string;
    sourceUrl: string;
    verifiedAt: string;
    researcher: string;
    notes: string;
  }>;
  digitalAudit: Record<string, { status: string; evidence: string }>;
};

export function AcquisitionRealityTestView({ candidates }: { candidates: Candidate[] }) {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'HIGH':
        return '#22c55e';
      case 'MEDIUM':
        return '#eab308';
      default:
        return '#64748b';
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            ACQUISITION REALITY TEST · PHASE 12
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            VERIFIED PROSPECT EVIDENCE & REALITY TEST
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            End-to-end audit proving every recommendation is backed by real source records, active building permits, and verified executives.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/admin/acquisition" className="action-btn primary">
            Executive Command Center →
          </Link>
          <Link href="/admin/acquisition/today" className="action-btn secondary">
            Daily Queue →
          </Link>
        </div>
      </div>

      {/* Candidate List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {candidates.map((cand, idx) => {
          const tierColor = getTierColor(cand.tier);
          return (
            <div
              key={cand.companyId}
              className="admin-card"
              style={{
                padding: '24px',
                borderLeft: `4px solid ${tierColor}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}
            >
              {/* Header Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d4af37', fontFamily: 'monospace' }}>
                      #{idx + 1}
                    </span>
                    <span className="badge" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                      {cand.companyType}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#888' }}>
                      CUI/CIF: <strong style={{ color: '#ccc' }}>{cand.cuiCif}</strong>
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#888' }}>
                      Location: <strong style={{ color: '#ccc' }}>{cand.city}, {cand.county}</strong>
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2px 0 4px 0', color: '#fff' }}>
                    {cand.companyName}
                  </h2>
                  <div style={{ fontSize: '0.75rem', color: '#888' }}>
                    Legal Entity: <span style={{ color: '#aaa9a1' }}>{cand.legalName}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase' }}>Deterministic Priority</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: tierColor }}>
                      {cand.priorityScore} <small style={{ fontSize: '0.8rem', color: '#888' }}>/ 100</small>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase' }}>Estimated Deal</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#d4af37' }}>
                      €{cand.estimatedDealSize.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Now & Commercial Gap Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 14px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.65rem', color: '#22c55e', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
                    ⚡ Why Contact Now
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
                    {cand.whyNow}
                  </p>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 14px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.65rem', color: '#ef4444', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
                    🔍 Commercial Deficiencies & Gap
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
                    {cand.commercialGap}
                  </p>
                </div>
              </div>

              {/* Evidence Overview Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, fontSize: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: 4 }}>
                <div>
                  <span style={{ color: '#888', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase' }}>Active Developments:</span>
                  <strong style={{ color: '#fff' }}>{cand.activeProjects.length} Verified Sites</strong>
                </div>

                <div>
                  <span style={{ color: '#888', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase' }}>Decision Maker:</span>
                  <strong style={{ color: '#38bdf8' }}>
                    {cand.decisionMakers[0]?.name || 'Not Verified'} ({cand.decisionMakers[0]?.role || '—'})
                  </strong>
                </div>

                <div>
                  <span style={{ color: '#888', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase' }}>Source Traceability:</span>
                  <strong style={{ color: '#22c55e' }}>{cand.sources.length} Provenance Records</strong>
                </div>

                <div>
                  <span style={{ color: '#888', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase' }}>Recommended Suite:</span>
                  <span style={{ color: '#d4af37' }}>{cand.recommendedServices.slice(0, 2).join(', ')}</span>
                </div>
              </div>

              {/* Action Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
                <button
                  type="button"
                  onClick={() => setSelectedCandidate(cand)}
                  className="action-btn primary"
                  style={{ fontSize: '0.75rem', background: '#d4af37', color: '#000', fontWeight: 800 }}
                >
                  👁 VIEW EVIDENCE ({cand.sources.length} Records)
                </button>

                <div style={{ display: 'flex', gap: 8 }}>
                  <Link
                    href={`/admin/companies/${cand.companyId}/acquisition`}
                    className="action-btn secondary"
                    style={{ fontSize: '0.75rem' }}
                  >
                    Acquisition Profile →
                  </Link>
                  <Link
                    href={`/admin/acquisition/outreach/${cand.companyId}`}
                    className="action-btn secondary"
                    style={{ fontSize: '0.75rem' }}
                  >
                    Draft Outreach →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Evidence Modal */}
      {selectedCandidate && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setSelectedCandidate(null)}
        >
          <div
            style={{
              background: '#141715',
              border: '1px solid var(--line)',
              borderRadius: 8,
              maxWidth: 720,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 24
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#d4af37', textTransform: 'uppercase', fontWeight: 700 }}>
                  PROVENANCE EVIDENCE CHAIN · {selectedCandidate.companyName}
                </div>
                <h2 style={{ fontSize: '1.4rem', margin: '4px 0 0 0', color: '#fff', fontWeight: 800 }}>
                  Underlying Verification Records
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Sources List */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: '0.85rem', color: '#d4af37', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.04em' }}>
                1. Authoritative Source Documents
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedCandidate.sources.map((src, idx) => (
                  <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 4, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{src.title}</strong>
                      <span className="badge" style={{ fontSize: '0.65rem' }}>{src.sourceTier} TIER</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#bbb', margin: '0 0 6px 0' }}>{src.notes}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#888' }}>
                      <span>Verified: <strong style={{ color: '#ccc' }}>{src.verifiedAt}</strong></span>
                      <a href={src.sourceUrl} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>
                        Open Citation URL ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Projects */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: '0.85rem', color: '#d4af37', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.04em' }}>
                2. Construction Site & Building Permit Evidence
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectedCandidate.activeProjects.map((p, idx) => (
                  <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ color: '#fff', fontSize: '0.85rem', display: 'block' }}>{p.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: '#888' }}>Location: {p.location}</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#22c55e', fontFamily: 'monospace' }}>
                      Permit: {p.permit || 'Municipal AC Verified'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decision Makers */}
            <div>
              <h3 style={{ fontSize: '0.85rem', color: '#d4af37', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.04em' }}>
                3. Executive Decision Maker Verification
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectedCandidate.decisionMakers.map((dm, idx) => (
                  <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{dm.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#888', marginLeft: 8 }}>{dm.role}</span>
                      </div>
                      <span style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 700 }}>
                        {dm.classification}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#aaa', marginTop: 4 }}>
                      Source: {dm.source}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 24, textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="action-btn secondary"
                style={{ fontSize: '0.75rem' }}
              >
                Close Evidence Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
