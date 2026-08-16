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
      case 'DECISION_MAKER': return '#d4af37';
      case 'COMMERCIAL_GAP': return '#f97316';
      case 'OUTREACH': return '#38bdf8';
      case 'PROPOSAL':
      case 'REVENUE': return '#22c55e';
      default: return '#cbd5e1';
    }
  };

  const getStatusPill = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="status-pill verified">VERIFIED</span>;
      case 'PARTIALLY_VERIFIED':
        return <span className="status-pill" style={{ color: '#eab308', borderColor: 'rgba(234,179,8,0.4)', background: 'rgba(234,179,8,0.08)' }}>PARTIAL</span>;
      case 'REJECTED':
        return <span className="status-pill unverified">REJECTED</span>;
      default:
        return <span className="status-pill unknown">UNKNOWN</span>;
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <div className="eyebrow" style={{ color: '#22c55e' }}>
            PRODUCTION PROVENANCE GRAPH · PHASE 22
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: 'clamp(1.6rem, 3.5vw, 2rem)', fontWeight: 800 }}>
            {companyName}
          </h1>
          <p className="admin-subtitle" style={{ margin: 0, fontSize: '0.85rem' }}>
            Vertical relationship timeline: Company → Project → Market Signal → Decision Maker → Commercial Gap → Outreach → Proposal → Revenue.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: '100%', maxWidth: 'max-content' }}>
          <Link href={`/admin/companies/${companyId}/acquisition`} className="action-btn secondary" style={{ flex: '1 1 auto', minHeight: 44 }}>
            Acquisition Profile →
          </Link>
          <Link href="/admin/executive" className="action-btn primary" style={{ flex: '1 1 auto', minHeight: 44 }}>
            Executive Briefing
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 4, width: 'fit-content' }}>
        <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>PROVENANCE INTEGRITY:</span>
        <span className="badge" style={{
          color: overallIntegrity === 'VERIFIED_CHAIN' ? '#22c55e' : '#eab308',
          borderColor: overallIntegrity === 'VERIFIED_CHAIN' ? '#22c55e' : '#eab308',
          fontWeight: 800,
          fontSize: '0.72rem'
        }}>
          {overallIntegrity}
        </span>
      </div>

      {/* Vertical Mobile-Friendly Timeline Graph */}
      <div style={{ position: 'relative', paddingLeft: 28, borderLeft: '2px solid rgba(255,255,255,0.1)', maxWidth: 720 }}>
        {nodes.map((node, idx) => (
          <div key={node.id || idx} style={{ position: 'relative', marginBottom: 20 }}>
            {/* Timeline Node Point */}
            <div style={{
              position: 'absolute',
              left: -35,
              top: 14,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: getNodeColor(node.type, node.status),
              border: '2px solid #0c0e0c',
              boxShadow: `0 0 8px ${getNodeColor(node.type, node.status)}`
            }} />

            {/* Timeline Card */}
            <div className="admin-card" style={{ padding: 14, borderLeft: `3px solid ${getNodeColor(node.type, node.status)}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
                <span className="badge" style={{ fontSize: '0.62rem' }}>{node.type}</span>
                {getStatusPill(node.status)}
              </div>

              <strong style={{ color: '#fff', fontSize: '0.92rem', display: 'block' }}>{node.label}</strong>
              {node.sublabel && <span style={{ fontSize: '0.75rem', color: '#cbd5e1', display: 'block', marginTop: 2 }}>{node.sublabel}</span>}

              {node.evidenceUrl && (
                <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <a
                    href={node.evidenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.72rem', color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: 4 }}
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
