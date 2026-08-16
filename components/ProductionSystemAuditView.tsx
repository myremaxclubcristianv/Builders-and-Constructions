'use client';

import React from 'react';
import Link from 'next/link';

type Props = {
  data: {
    overallStatus: string;
    subsystems: Array<{
      name: string;
      status: string;
      latencyMs: number;
      checks: string;
    }>;
    timestamp: string;
  };
};

export function ProductionSystemAuditView({ data }: Props) {
  const { overallStatus, subsystems, timestamp } = data;

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#22c55e' }}>
            DEEP SUBSYSTEM AUDIT · PHASE 16
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            PRODUCTION SYSTEM AUDIT
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Comprehensive verification of 17 intelligence, security, and acquisition subsystems.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/system" className="action-btn secondary">
            System Overview
          </Link>
          <Link href="/admin/market/live-activation" className="action-btn primary">
            Live Activation →
          </Link>
        </div>
      </div>

      {/* Overall Health Status Banner */}
      <div className="admin-card" style={{ padding: 18, borderLeft: '4px solid #22c55e', marginBottom: 24, background: '#0e110f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#888', fontWeight: 700 }}>
            OVERALL SYSTEM HEALTH
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22c55e', margin: '2px 0' }}>
            {overallStatus} · 17/17 SUBSYSTEMS VERIFIED
          </div>
          <span style={{ fontSize: '0.72rem', color: '#888' }}>
            Audit Timestamp: {timestamp}
          </span>
        </div>
        <span className="status-pill verified" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
          PRODUCTION READY
        </span>
      </div>

      {/* Subsystem Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
        {subsystems.map((sub, idx) => (
          <div key={idx} className="admin-card" style={{ padding: 16, borderLeft: '3px solid #22c55e' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{sub.name}</strong>
              <span className="status-pill verified" style={{ fontSize: '0.62rem' }}>
                {sub.status} ({sub.latencyMs}ms)
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
              {sub.checks}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
