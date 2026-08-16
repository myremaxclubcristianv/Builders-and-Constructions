'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EvidenceViewer, EvidenceItem } from './EvidenceViewer';

export type GoldenCompanyItem = {
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
  evidenceList: EvidenceItem[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  nextAction: string;
  lastResearchedAt: string;
  status: 'DISCOVERED' | 'RESEARCHING' | 'VERIFYING' | 'PARTIALLY VERIFIED' | 'VERIFIED' | 'CONTACT READY' | 'ACTIVATED' | 'DISQUALIFIED';
};

export function GoldenDatasetActivationView({ items: initialItems }: { items: GoldenCompanyItem[] }) {
  const [items] = useState<GoldenCompanyItem[]>(initialItems);
  const [selectedEvidence, setSelectedEvidence] = useState<{ list: EvidenceItem[]; title: string } | null>(null);
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
      case 'CONTACT READY':
        return '#22c55e';
      case 'VERIFIED':
        return '#38bdf8';
      case 'PARTIALLY VERIFIED':
        return '#d4af37';
      case 'DISQUALIFIED':
        return '#ef4444';
      default:
        return '#94a3b8';
    }
  };

  const verifiedCount = items.filter(i => i.status === 'ACTIVATED' || i.status === 'CONTACT READY' || i.status === 'VERIFIED').length;

  return (
    <div className="admin-container">
      {/* Evidence Modal */}
      {selectedEvidence && (
        <EvidenceViewer
          evidenceList={selectedEvidence.list}
          isOpen={true}
          onClose={() => setSelectedEvidence(null)}
          title={selectedEvidence.title}
        />
      )}

      {/* Header */}
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            ROMANIAN GOLDEN DATASET · PHASE 14
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            GOLDEN DATASET ACTIVATION WORKSTATION
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Strict verification, active projects linkage, and executive readiness gating for the first 50 Romanian market targets.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ background: '#141715', border: '1px solid var(--line)', padding: '6px 14px', borderRadius: 4, textAlign: 'right' }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888' }}>GOLDEN DATASET VERIFIED</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#22c55e' }}>{verifiedCount} / 50</div>
          </div>
          <Link href="/admin/market/golden-dataset/quality" className="action-btn secondary">
            Quality Gate →
          </Link>
          <Link href="/admin/acquisition" className="action-btn primary">
            Acquisition Hub →
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="admin-card" style={{ padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <label style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#888', marginRight: 8 }}>County / Territory:</label>
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
          <label style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#888', marginRight: 8 }}>Verification Status:</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '6px 10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4, fontSize: '0.75rem' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVATED">Activated</option>
            <option value="CONTACT READY">Contact Ready</option>
            <option value="VERIFIED">Verified</option>
            <option value="PARTIALLY VERIFIED">Partially Verified</option>
            <option value="RESEARCHING">Researching</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#888' }}>
          Displaying <strong style={{ color: '#fff' }}>{filtered.length}</strong> evaluated records
        </div>
      </div>

      {/* Main Table */}
      <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Company & Legal Entity</th>
                <th>CUI / CIF</th>
                <th>Territory</th>
                <th>Sector</th>
                <th>Projects</th>
                <th>Primary Decision Maker</th>
                <th>Digital Audit</th>
                <th>Contact Readiness</th>
                <th>Priority</th>
                <th>Evidence</th>
                <th>Status</th>
                <th>Next Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map(item => {
                  const statusColor = getStatusColor(item.status);
                  return (
                    <tr key={item.id}>
                      <td style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d4af37', fontFamily: 'monospace' }}>
                        #{item.rank}
                      </td>
                      <td>
                        <strong style={{ color: '#fff', fontSize: '0.85rem', display: 'block' }}>
                          <Link href={`/admin/companies/${item.id}/acquisition`} style={{ color: '#fff', textDecoration: 'none' }}>
                            {item.name}
                          </Link>
                        </strong>
                        <span style={{ fontSize: '0.7rem', color: '#888' }}>
                          {item.legalName}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#cbd5e1' }}>
                        {item.cuiCif}
                      </td>
                      <td style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                        {item.city}, {item.county}
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
                            <span style={{ fontSize: '0.62rem', color: '#888', display: 'block' }}>
                              Level: {item.decisionMaker.verificationState}
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: '#eab308' }}>Pending DM</span>
                        )}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: item.digitalAuditScore >= 70 ? '#22c55e' : '#eab308' }}>
                          {item.digitalAuditScore}/100
                        </span>
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
                              color: item.contactReadiness.isReady ? '#22c55e' : '#eab308'
                            }}
                          >
                            {item.contactReadiness.tier}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.95rem', fontWeight: 800, color: item.priorityScore >= 75 ? '#22c55e' : '#eab308' }}>
                        {item.priorityScore}
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => setSelectedEvidence({ list: item.evidenceList, title: `Evidence Chain · ${item.name}` })}
                          className="action-btn secondary"
                          style={{ fontSize: '0.68rem', padding: '3px 8px' }}
                        >
                          👁 {item.sourcesCount} Proofs
                        </button>
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
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <Link
                            href={`/admin/acquisition/outreach/${item.id}`}
                            className="action-btn primary"
                            style={{ fontSize: '0.7rem', padding: '3px 8px', whiteSpace: 'nowrap' }}
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
                  <td colSpan={13} style={{ textAlign: 'center', padding: '32px', color: '#888' }}>
                    No golden dataset candidates match the selected filters.
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
