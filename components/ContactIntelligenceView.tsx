'use client';

import React from 'react';
import Link from 'next/link';

type Props = {
  contacts: Array<{
    id: string;
    companyName: string;
    primaryContact: string;
    role: string;
    verificationLevel: string;
    contactChannel: string;
    lastVerified: string;
    contactReadiness: string;
    coolingPeriod: string;
  }>;
};

export function ContactIntelligenceView({ contacts }: Props) {
  const getLevelBadge = (lvl: string) => {
    switch (lvl) {
      case '04_CONFIRMED':
        return <span className="badge" style={{ color: '#22c55e', borderColor: '#22c55e', fontWeight: 800 }}>04 · CONFIRMED</span>;
      case '03_DOMAIN_VERIFIED':
        return <span className="badge" style={{ color: '#38bdf8', borderColor: '#38bdf8' }}>03 · DOMAIN VERIFIED</span>;
      case '02_PUBLICLY_VERIFIED':
        return <span className="badge" style={{ color: '#eab308', borderColor: '#eab308' }}>02 · PUBLICLY VERIFIED</span>;
      default:
        return <span className="badge" style={{ color: '#888' }}>01 · IDENTIFIED</span>;
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#22c55e' }}>
            EXECUTIVE CONTACT VERIFICATION MATRIX · PHASE 19
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            CONTACT INTELLIGENCE & READINESS
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            4-Level Verification Governance: strictly enforces that only direct domain or confirmed contacts can receive outreach.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/acquisition/today" className="action-btn secondary">
            Daily Queue →
          </Link>
          <Link href="/admin/executive" className="action-btn primary">
            Executive Briefing
          </Link>
        </div>
      </div>

      <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>Company</th>
              <th>Executive Decision Maker</th>
              <th>Role</th>
              <th>Verification Level</th>
              <th>Channel Provenance</th>
              <th>Readiness</th>
              <th>Verified At</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(c => (
              <tr key={c.id}>
                <td>
                  <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{c.companyName}</strong>
                </td>
                <td style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <strong style={{ color: '#fff' }}>{c.primaryContact}</strong>
                </td>
                <td style={{ fontSize: '0.78rem', color: '#888' }}>{c.role}</td>
                <td>{getLevelBadge(c.verificationLevel)}</td>
                <td style={{ fontSize: '0.78rem', color: '#38bdf8' }}>{c.contactChannel}</td>
                <td>
                  <span className="badge" style={{ fontSize: '0.65rem', color: c.contactReadiness.includes('READY') ? '#22c55e' : '#888' }}>
                    {c.contactReadiness}
                  </span>
                </td>
                <td style={{ fontSize: '0.75rem', color: '#888' }}>{c.lastVerified}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
