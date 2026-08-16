'use client';

import React from 'react';
import Link from 'next/link';

export function AdminExportWorkstationView() {
  const exportDatasets = [
    { key: 'golden-dataset', name: 'Golden Dataset Entities', desc: 'Verified 50 Romanian construction-market targets with CUI, city, and classification.' },
    { key: 'companies', name: 'All Registered Companies', desc: 'Complete companies directory with verification state and locations.' },
    { key: 'projects', name: 'Active & Built Projects', desc: 'Construction projects, building permit references, and status.' },
    { key: 'decision-makers', name: 'Verified Decision Makers', desc: 'Identified and contact-verified executive leadership records.' },
    { key: 'acquisition-priorities', name: 'Acquisition Priorities & Scores', desc: 'Deterministic priority indices, next actions, and pipeline status.' },
    { key: 'revenue-attributions', name: 'Revenue Attributions & Closed Deals', desc: 'Traceable deal values, won dates, and market signal triggers.' },
    { key: 'sales-activities', name: 'Sales Touchpoints & Audit History', desc: 'Calls, meetings, follow-ups, and recorded author timestamps.' }
  ];

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            SECURE DATA EXPORT · PHASE 15
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            GOVERNED DATA EXPORT WORKSTATION
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Authorized CSV dataset downloads. Every export operation is cryptographically logged to audit trails.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/system/audit" className="action-btn secondary">
            Audit Logs
          </Link>
          <Link href="/admin/acquisition" className="action-btn primary">
            Acquisition Hub →
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {exportDatasets.map((ds) => (
          <div key={ds.key} className="admin-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#d4af37', fontWeight: 700, marginBottom: 4 }}>
                DATASET EXPORT
              </div>
              <h2 style={{ fontSize: '1.15rem', margin: '0 0 8px 0', color: '#fff', fontWeight: 700 }}>
                {ds.name}
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                {ds.desc}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
              <span style={{ fontSize: '0.7rem', color: '#888' }}>Format: UTF-8 CSV</span>
              <a
                href={`/api/admin/export?type=${ds.key}`}
                className="action-btn primary"
                style={{ fontSize: '0.75rem', padding: '5px 12px', textDecoration: 'none' }}
              >
                ⬇ Download CSV
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
