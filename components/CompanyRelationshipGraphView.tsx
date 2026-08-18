'use client';

import React from 'react';
import Link from 'next/link';
import { GraphNode } from '@/lib/relationship-graph';

type Props = {
  companyName: string;
  companyId: string;
  nodes: GraphNode[];
  overallIntegrity: string;
};

export function CompanyRelationshipGraphView({ companyName, companyId, nodes, overallIntegrity }: Props) {
  const getNodeColor = (type: string, status: string) => {
    if (status === 'UNKNOWN' || status === 'REJECTED') return '#ef4444';
    if (status === 'PARTIALLY_VERIFIED') return '#eab308';
    switch (type) {
      case 'COMPANY': return '#38bdf8';
      case 'PROJECT': return '#22c55e';
      case 'SIGNAL': return '#a855f7';
      case 'DECISION_MAKER': return '#c7a675';
      case 'COMMERCIAL_GAP': return '#f97316';
      case 'OUTREACH': return '#38bdf8';
      case 'PROPOSAL':
      case 'REVENUE': return '#22c55e';
      default: return 'rgba(243,241,235,0.6)';
    }
  };

  const getStatusPill = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="status-pill verified" style={{ fontSize: '0.6rem' }}>VERIFIED</span>;
      case 'PARTIALLY_VERIFIED':
        return <span className="status-pill" style={{ color: '#eab308', borderColor: 'rgba(234,179,8,0.4)', background: 'rgba(234,179,8,0.08)', fontSize: '0.6rem' }}>PARTIAL</span>;
      case 'REJECTED':
        return <span className="status-pill unverified" style={{ fontSize: '0.6rem' }}>REJECTED</span>;
      default:
        return <span className="status-pill unknown" style={{ fontSize: '0.6rem' }}>UNKNOWN</span>;
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="eyebrow" style={{ color: '#22c55e', letterSpacing: '0.12em' }}>
              8-NODE PROVENANCE CHAIN · PRODUCTION TRUTH
            </div>
            <h1 style={{ margin: '4px 0 6px 0', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, color: '#f3f1eb' }}>
              {companyName}
            </h1>
            <p className="admin-subtitle" style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(243,241,235,0.7)', maxWidth: 640 }}>
              Forensic intelligence timeline: Company → Project → Signal → Decision Maker → Gap → Outreach → Proposal → Revenue.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: '100%', maxWidth: 'max-content' }}>
            <Link href={`/admin/companies/${companyId}/acquisition`} className="action-btn secondary" style={{ flex: '1 1 auto', minHeight: 44, fontSize: '0.78rem' }}>
              Dossier →
            </Link>
            <Link href="/admin/executive" className="action-btn primary" style={{ flex: '1 1 auto', minHeight: 44, fontSize: '0.78rem' }}>
              Briefing
            </Link>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 6, border: '1px solid rgba(244,242,235,0.08)', width: 'fit-content' }}>
        <span style={{ fontSize: '0.7rem', color: 'rgba(243,241,235,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>PROVENANCE CHAIN:</span>
        <span className="badge" style={{
          color: overallIntegrity === 'VERIFIED_CHAIN' ? '#22c55e' : '#eab308',
          borderColor: overallIntegrity === 'VERIFIED_CHAIN' ? 'rgba(34,197,94,0.4)' : 'rgba(234,179,8,0.4)',
          fontWeight: 800,
          fontSize: '0.68rem'
        }}>
          {overallIntegrity}
        </span>
      </div>

      {/* Vertical Mobile-Friendly Timeline Graph */}
      <div style={{ position: 'relative', paddingLeft: 24, borderLeft: '2px solid rgba(244,242,235,0.12)', maxWidth: 720, marginLeft: 8 }}>
        {nodes.map((node, idx) => (
          <div key={node.id || idx} style={{ position: 'relative', marginBottom: 20 }}>
            {/* Timeline Node Point */}
            <div style={{
              position: 'absolute',
              left: -31,
              top: 14,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: getNodeColor(node.type, node.status),
              border: '2px solid #070908',
              boxShadow: `0 0 10px ${getNodeColor(node.type, node.status)}`
            }} />

            {/* Timeline Card */}
            <div className="admin-card" style={{ padding: 16, borderLeft: `3px solid ${getNodeColor(node.type, node.status)}`, background: 'rgba(13,16,15,0.95)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
                <span className="badge" style={{ fontSize: '0.6rem', color: '#f3f1eb', borderColor: 'rgba(244,242,235,0.15)' }}>{node.type}</span>
                {getStatusPill(node.status)}
              </div>

              <strong style={{ color: '#f3f1eb', fontSize: '0.95rem', display: 'block', fontWeight: 800 }}>{node.label}</strong>
              {node.sublabel && <span style={{ fontSize: '0.78rem', color: 'rgba(243,241,235,0.65)', display: 'block', marginTop: 3 }}>{node.sublabel}</span>}

              {node.evidenceUrl && (
                <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(244,242,235,0.06)' }}>
                  <a
                    href={node.evidenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.72rem', color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600 }}
                  >
                    View Official Evidence ↗
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

