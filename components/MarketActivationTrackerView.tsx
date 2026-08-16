'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type CompanyTrackerItem = {
  rank: number;
  id: string;
  name: string;
  legalName: string;
  cuiCif: string;
  city: string;
  county: string;
  type: string;
  website?: string | null;
  websiteVerification: string;
  activeProjectsCount: number;
  completedProjectsCount: number;
  decisionMaker: {
    name: string;
    role: string;
    verificationState: string;
  } | null;
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
  lastResearchedAt: string;
  status: 'DISCOVERED' | 'RESEARCHING' | 'VERIFYING' | 'VERIFIED' | 'READY' | 'PUBLISHED' | 'ACTIVATED';
};

export function MarketActivationTrackerView({ items: initialItems }: { items: CompanyTrackerItem[] }) {
  const [items] = useState<CompanyTrackerItem[]>(initialItems);
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = items.filter(item => {
    if (regionFilter !== 'ALL' && !item.county?.toLowerCase().includes(regionFilter.toLowerCase()) && !item.city?.toLowerCase().includes(regionFilter.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'ALL' && item.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const getStatusColor = (st: string) => {
    switch (st) {
      case 'ACTIVATED':
        return '#22c55e';
      case 'READY':
        return '#38bdf8';
      case 'VERIFIED':
        return '#d4af37';
      case 'VERIFYING':
      case 'RESEARCHING':
        return '#eab308';
      default:
        return '#94a3b8';
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            GOLDEN DATASET ACTIVATION · PHASE 13
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            ROMANIAN MARKET ACTIVATION TRACKER
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Operational tracking of genuine verified construction practices, developer portfolios, decision makers, and acquisition readiness.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/admin/system/activation" className="action-btn secondary">
            Activation Log →
          </Link>
          <Link href="/admin/acquisition" className="action-btn primary">
            Acquisition Hub →
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="admin-card" style={{ padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <label style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#888', marginRight: 8 }}>Region / County:</label>
          <select
            value={regionFilter}
            onChange={e => setRegionFilter(e.target.value)}
            style={{ padding: '6px 10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4, fontSize: '0.75rem' }}
          >
            <option value="ALL">All Territories</option>
            <option value="Bucharest">București</option>
            <option value="Ilfov">Ilfov</option>
            <option value="Cluj">Cluj</option>
            <option value="Timiș">Timiș</option>
            <option value="Iași">Iași</option>
            <option value="Brașov">Brașov</option>
            <option value="Constanța">Constanța</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#888', marginRight: 8 }}>Activation Status:</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '6px 10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4, fontSize: '0.75rem' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVATED">Activated (Contact Ready)</option>
            <option value="READY">Ready for Activation</option>
            <option value="VERIFIED">Verified</option>
            <option value="RESEARCHING">Researching</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#888' }}>
          Showing <strong style={{ color: '#fff' }}>{filtered.length}</strong> of {items.length} verified companies
        </div>
      </div>

      {/* Main Activation Table */}
      <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Company Entity</th>
                <th>Territory</th>
                <th>Sector</th>
                <th>Projects</th>
                <th>Primary Decision Maker</th>
                <th>Opp. Score</th>
                <th>Contact Readiness</th>
                <th>Priority</th>
                <th>Sources</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((item) => {
                  const statusColor = getStatusColor(item.status);
                  return (
                    <tr key={item.id}>
                      <td style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d4af37', fontFamily: 'monospace' }}>
                        #{item.rank}
                      </td>
                      <td>
                        <strong style={{ color: '#fff', fontSize: '0.85rem', display: 'block' }}>
                          {item.name}
                        </strong>
                        <span style={{ fontSize: '0.7rem', color: '#888' }}>
                          {item.legalName} · <span style={{ fontFamily: 'monospace' }}>{item.cuiCif}</span>
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                          {item.city}, {item.county}
                        </span>
                      </td>
                      <td>
                        <span className="badge" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                          {item.type}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', color: item.activeProjectsCount > 0 ? '#22c55e' : '#cbd5e1', fontWeight: 600 }}>
                          {item.activeProjectsCount} active
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#888', display: 'block' }}>
                          {item.completedProjectsCount} built
                        </span>
                      </td>
                      <td>
                        {item.decisionMaker ? (
                          <div>
                            <strong style={{ fontSize: '0.78rem', color: '#fff', display: 'block' }}>
                              {item.decisionMaker.name}
                            </strong>
                            <span style={{ fontSize: '0.68rem', color: '#38bdf8' }}>
                              {item.decisionMaker.role}
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: '#eab308' }}>Pending DM</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.85rem', fontWeight: 700, color: item.opportunityScore >= 70 ? '#22c55e' : '#eab308' }}>
                        {item.opportunityScore}/100
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <strong style={{ fontSize: '0.85rem', color: item.contactReadiness.isReady ? '#22c55e' : '#eab308' }}>
                            {item.contactReadiness.score}%
                          </strong>
                          <span
                            style={{
                              fontSize: '0.6rem',
                              padding: '1px 4px',
                              borderRadius: 3,
                              background: item.contactReadiness.isReady ? '#22c55e15' : '#eab30815',
                              color: item.contactReadiness.isReady ? '#22c55e' : '#eab308',
                              border: `1px solid ${item.contactReadiness.isReady ? '#22c55e33' : '#eab30833'}`
                            }}
                          >
                            {item.contactReadiness.tier}
                          </span>
                        </div>
                        {item.contactReadiness.missingRequirements.length > 0 && (
                          <span style={{ fontSize: '0.65rem', color: '#888', display: 'block', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            Missing: {item.contactReadiness.missingRequirements[0]}
                          </span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.95rem', fontWeight: 800, color: item.priorityScore >= 75 ? '#22c55e' : '#eab308' }}>
                        {item.priorityScore}
                      </td>
                      <td style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                        {item.sourcesCount} citations
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: 3,
                            color: statusColor,
                            background: `${statusColor}15`,
                            border: `1px solid ${statusColor}44`,
                            letterSpacing: '0.04em'
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Link
                            href={`/admin/companies/${item.id}/acquisition`}
                            className="action-btn secondary"
                            style={{ fontSize: '0.7rem', padding: '3px 8px' }}
                          >
                            Briefing
                          </Link>
                          <Link
                            href={`/admin/acquisition/outreach/${item.id}`}
                            className="action-btn primary"
                            style={{ fontSize: '0.7rem', padding: '3px 8px' }}
                          >
                            Outreach →
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={12} style={{ textAlign: 'center', padding: '32px', color: '#888' }}>
                    No companies found matching the selected territorial filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
