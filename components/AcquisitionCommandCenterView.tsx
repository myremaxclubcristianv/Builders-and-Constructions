'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type ProspectItem = {
  id: string;
  name: string;
  slug: string;
  type: string;
  city: string;
  county?: string;
  opportunityScore: number;
  priorityScore: number;
  tier: 'HIGH' | 'MEDIUM' | 'LOW';
  whyNow: string[];
  activeProjectsCount: number;
  activeProjects: Array<{ id: string; name: string; status: string; projectType?: string }>;
  primaryDecisionMaker: {
    name: string;
    role: string;
    phone?: string | null;
    email?: string | null;
    verificationState?: string | null;
    source?: string | null;
  } | null;
  recommendedServices: Array<{
    serviceKey: string;
    name: string;
    category: string;
    priority: string;
    estimatedValue: number;
    reason: string;
  }>;
  nextAction: string;
  nextActionDate: string;
  estimatedCommercialValue: number;
};

type AcquisitionData = {
  topProspects: ProspectItem[];
  allProspects: ProspectItem[];
  metrics: {
    totalEvaluated: number;
    highPriorityCount: number;
    mediumPriorityCount: number;
    contactReadyCount: number;
    totalPipelineValue: number;
  };
};

export function AcquisitionCommandCenterView({ initialData }: { initialData: AcquisitionData }) {
  const [filterTier, setFilterTier] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const displayedProspects = initialData.allProspects.filter(p => {
    const matchesTier = filterTier === 'ALL' || p.tier === filterTier;
    const matchesSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'HIGH':
        return <span className="status-pill verified" style={{ background: 'rgba(34, 197, 94, 0.15)', fontWeight: 700 }}>HIGH PRIORITY</span>;
      case 'MEDIUM':
        return <span className="status-pill" style={{ color: '#eab308', borderColor: '#eab308' }}>MEDIUM PRIORITY</span>;
      default:
        return <span className="status-pill secondary">LOW PRIORITY</span>;
    }
  };

  return (
    <div className="admin-container">
      {/* Executive Hero */}
      <div className="admin-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent, #94a3b8)', marginBottom: '0.25rem' }}>
              EXECUTIVE ACQUISITION ENGINE · PHASE 10
            </div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              WHO SHOULD I CONTACT TODAY?
            </h1>
            <p className="admin-subtitle" style={{ margin: 0, fontSize: '1rem', color: '#888' }}>
              The highest-value construction companies and developers to approach now, backed by verified project activity.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link href="/admin/acquisition/today" className="action-btn primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}>
              ⚡ Open Daily Queue →
            </Link>
            <Link href="/admin/acquisition/radar" className="action-btn secondary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}>
              📡 Market Radar
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="admin-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>High Priority Targets</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#22c55e', marginTop: '0.25rem' }}>
            {initialData.metrics.highPriorityCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#666' }}>Score &gt;= 75 / 100</div>
        </div>

        <div className="admin-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Decision Makers Ready</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#38bdf8', marginTop: '0.25rem' }}>
            {initialData.metrics.contactReadyCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#666' }}>Verified executive contact</div>
        </div>

        <div className="admin-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Medium Priority</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#eab308', marginTop: '0.25rem' }}>
            {initialData.metrics.mediumPriorityCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#666' }}>Nurture & research</div>
        </div>

        <div className="admin-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Total Pipeline Value</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.25rem' }}>
            €{initialData.metrics.totalPipelineValue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#666' }}>Deterministic package value</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(tier => (
            <button
              key={tier}
              onClick={() => setFilterTier(tier)}
              className={`filter-chip ${filterTier === tier ? 'active' : ''}`}
              style={{
                padding: '0.4rem 0.85rem',
                fontSize: '0.8rem',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: filterTier === tier ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: filterTier === tier ? '#fff' : '#888',
                cursor: 'pointer'
              }}
            >
              {tier} PRIORITY
            </button>
          ))}
        </div>

        <div>
          <input
            type="text"
            placeholder="Search company, city, or sector..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.85rem',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '4px',
              color: '#fff',
              minWidth: '260px'
            }}
          />
        </div>
      </div>

      {/* Prioritized Prospects List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {displayedProspects.length === 0 ? (
          <div className="admin-card" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#888' }}>
            No companies matching the selected priority filters.
          </div>
        ) : (
          displayedProspects.map(prospect => (
            <div
              key={prospect.id}
              className="admin-card"
              style={{
                borderLeft: `4px solid ${
                  prospect.tier === 'HIGH' ? '#22c55e' : prospect.tier === 'MEDIUM' ? '#eab308' : '#64748b'
                }`,
                padding: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                    <h2 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 700 }}>
                      <Link href={`/admin/companies/${prospect.id}/acquisition`} style={{ color: '#fff', textDecoration: 'none' }}>
                        {prospect.name}
                      </Link>
                    </h2>
                    {getTierBadge(prospect.tier)}
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>
                      {prospect.type} · {prospect.city}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#aaa', display: 'flex', gap: '1.5rem' }}>
                    <span>🏗️ <strong>{prospect.activeProjectsCount}</strong> Active Projects</span>
                    <span>⭐ Opportunity Index: <strong>{prospect.opportunityScore}/100</strong></span>
                    <span>💼 Pipeline Value: <strong>€{prospect.estimatedCommercialValue.toLocaleString()}</strong></span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: prospect.tier === 'HIGH' ? '#22c55e' : '#eab308' }}>
                    {prospect.priorityScore} <span style={{ fontSize: '0.9rem', color: '#888', fontWeight: 400 }}>/ 100</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#666', letterSpacing: '0.05em' }}>
                    Deterministic Priority
                  </div>
                </div>
              </div>

              {/* Grid: Why Now + Recommended Services + Decision Maker */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '4px', marginBottom: '1.25rem' }}>
                {/* 1. WHY NOW */}
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: '0.5rem', fontWeight: 600 }}>
                    WHY NOW
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.82rem', color: '#ccc', lineHeight: 1.5 }}>
                    {prospect.whyNow.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>

                {/* 2. RECOMMENDED SERVICES */}
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: '0.5rem', fontWeight: 600 }}>
                    RECOMMENDED COMMERCIAL SERVICES
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {prospect.recommendedServices.map((svc, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.75rem',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '3px',
                          color: '#e2e8f0'
                        }}
                      >
                        {svc.name.split(' ')[0]} {svc.name.split(' ')[1]} (€{svc.estimatedValue})
                      </span>
                    ))}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '0.5rem' }}>
                    {prospect.recommendedServices[0]?.reason}
                  </div>
                </div>

                {/* 3. DECISION MAKER & NEXT ACTION */}
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: '0.5rem', fontWeight: 600 }}>
                    PRIMARY CONTACT & NEXT ACTION
                  </div>
                  {prospect.primaryDecisionMaker ? (
                    <div style={{ fontSize: '0.82rem', color: '#fff', marginBottom: '0.35rem' }}>
                      👤 <strong>{prospect.primaryDecisionMaker.name}</strong> · {prospect.primaryDecisionMaker.role}
                      {prospect.primaryDecisionMaker.phone && (
                        <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '0.15rem' }}>
                          📞 {prospect.primaryDecisionMaker.phone}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: '#eab308', marginBottom: '0.35rem' }}>
                      ⚠️ No primary decision maker verified yet
                    </div>
                  )}
                  <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '0.4rem' }}>
                    Next Action: <strong style={{ color: '#fff' }}>{prospect.nextAction}</strong> (Due: {prospect.nextActionDate})
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link
                  href={`/admin/companies/${prospect.id}/decision-makers`}
                  className="action-btn secondary"
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
                >
                  Decision Makers
                </Link>
                <Link
                  href={`/admin/acquisition/outreach/${prospect.id}`}
                  className="action-btn secondary"
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
                >
                  Draft Outreach
                </Link>
                <Link
                  href={`/admin/companies/${prospect.id}/acquisition`}
                  className="action-btn primary"
                  style={{ padding: '0.45rem 1.1rem', fontSize: '0.8rem', fontWeight: 600 }}
                >
                  OPEN WORKSTATION →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
