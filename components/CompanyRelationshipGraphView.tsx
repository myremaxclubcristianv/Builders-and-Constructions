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
      case 'PROPOSAL':
      case 'REVENUE': return '#22c55e';
      default: return '#cbd5e1';
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#22c55e' }}>
            PRODUCTION PROVENANCE GRAPH · PHASE 19
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            {companyName} — Relationship Graph
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Traceable node provenance: Company → Project → Signal → Decision Maker → Commercial Gap → Outreach → Proposal → Revenue.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href={`/admin/companies/${companyId}/acquisition`} className="action-btn secondary">
            Acquisition Profile →
          </Link>
          <Link href="/admin/executive" className="action-btn primary">
            Executive Briefing
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <span style={{ fontSize: '0.8rem', color: '#888' }}>PROVENANCE INTEGRITY:</span>
        <span className="badge" style={{
          color: overallIntegrity === 'VERIFIED_CHAIN' ? '#22c55e' : '#eab308',
          borderColor: overallIntegrity === 'VERIFIED_CHAIN' ? '#22c55e' : '#eab308',
          fontWeight: 800
        }}>
          {overallIntegrity}
        </span>
      </div>

      {/* Nodes Visualizer */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
        {nodes.map(node => (
          <div key={node.id} className="admin-card" style={{ padding: 16, borderLeft: `3px solid ${getNodeColor(node.type, node.status)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span className="badge" style={{ fontSize: '0.62rem' }}>{node.type}</span>
              <span style={{ fontSize: '0.65rem', color: node.status === 'VERIFIED' ? '#22c55e' : '#888' }}>{node.status}</span>
            </div>
            <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block' }}>{node.label}</strong>
            {node.sublabel && <span style={{ fontSize: '0.72rem', color: '#888', display: 'block', marginTop: 2 }}>{node.sublabel}</span>}
            {node.evidenceUrl && (
              <a href={node.evidenceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.68rem', color: '#38bdf8', marginTop: 6, display: 'inline-block' }}>
                Source Provenance ↗
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
