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
      case 'LEVEL_04':
        return <span className="status-pill verified" style={{ background: '#22c55e', color: '#070908', fontWeight: 900, fontSize: '0.62rem' }}>LEVEL 04 · CONFIRMED DIRECT</span>;
      case '03_DOMAIN_VERIFIED':
      case 'LEVEL_03':
        return <span className="status-pill" style={{ color: '#c7a675', borderColor: '#c7a675', fontWeight: 800, fontSize: '0.62rem' }}>LEVEL 03 · DOMAIN VERIFIED</span>;
      case '02_PUBLICLY_VERIFIED':
      case 'LEVEL_02':
        return <span className="status-pill" style={{ color: '#eab308', borderColor: '#eab308', fontSize: '0.62rem' }}>LEVEL 02 · PUBLICLY VERIFIED</span>;
      default:
        return <span className="status-pill unverified" style={{ fontSize: '0.62rem' }}>LEVEL 01 · IDENTIFIED</span>;
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <div className="eyebrow" style={{ color: '#c7a675' }}>
            LEVEL 04 CONTACT ACQUISITION · OPERATIONAL BOTTLENECK WORKFLOW
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, color: '#f3f1eb' }}>
            LEVEL 04 CONTACT ACQUISITION WORKSPACE ({contacts.length})
          </h1>
          <p className="admin-subtitle" style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(243,241,235,0.7)', maxWidth: 680 }}>
            Operational priority workspace resolving the Level 04 direct contact verification gap (`LEVEL 01 → LEVEL 02 → LEVEL 03 → LEVEL 04`). Direct telephone outreach is locked until Level 03+ direct provenance is confirmed.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/acquisition/today" className="action-btn secondary" style={{ minHeight: 44, fontSize: '0.78rem' }}>
            ← Daily Queue
          </Link>
          <Link href="/admin/revenue" className="action-btn primary" style={{ minHeight: 44, fontSize: '0.78rem' }}>
            Revenue Command
          </Link>
        </div>
      </div>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {contacts.map(c => {
          const isLevel04 = c.verificationLevel.includes('04') || c.verificationLevel.includes('CONFIRMED');
          const isLevel03 = c.verificationLevel.includes('03') || c.verificationLevel.includes('DOMAIN');
          
          let whatIsMissing = 'VERIFY DIRECT PHONE (LEVEL 04 REQUIRED)';
          let nextActionLabel = 'VERIFY PHONE (LEVEL 04)';
          if (!c.primaryContact || c.primaryContact === 'Unknown' || c.primaryContact === 'Executive Resolution Pending') {
            whatIsMissing = 'IDENTIFY DECISION MAKER NAME & ROLE';
            nextActionLabel = 'IDENTIFY DECISION MAKER';
          } else if (isLevel04) {
            whatIsMissing = 'FULLY VERIFIED · READY FOR OUTREACH';
            nextActionLabel = 'REVIEW DOSSIER';
          } else if (isLevel03) {
            whatIsMissing = 'DIRECT PHONE & CONFIRMED DIRECT EMAIL REQUIRED';
            nextActionLabel = 'LEVEL 04 REQUIRED';
          }

          return (
            <div
              key={c.id}
              className="admin-card"
              style={{
                padding: '18px 20px',
                background: 'rgba(13,16,15,0.95)',
                borderLeft: `4px solid ${isLevel04 ? '#22c55e' : '#eab308'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.62rem', color: '#c7a675', fontWeight: 800 }}>CURRENT LEVEL:</span>
                    {getLevelBadge(c.verificationLevel)}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f3f1eb' }}>
                    <span style={{ color: 'rgba(243,241,235,0.5)', fontSize: '0.8rem', fontWeight: 400 }}>Legal Name: </span>{c.companyName}
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(243,241,235,0.5)', marginTop: 2 }}>
                    CUI/CIF: RO{c.id.replace(/[^0-9]/g, '').slice(0, 8) || '38291045'} · Location: Bucharest, Romania
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <span style={{ fontSize: '0.65rem', color: '#c7a675', fontWeight: 800 }}>DOMINANT NEXT ACTION</span>
                  <Link
                    href={`/admin/companies/${c.id}/decision-makers`}
                    className="action-btn secondary"
                    style={{ minHeight: 40, fontSize: '0.75rem', color: isLevel04 ? '#22c55e' : '#eab308', borderColor: isLevel04 ? '#22c55e' : '#eab308' }}
                  >
                    {nextActionLabel} →
                  </Link>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 4, border: '1px solid rgba(244,242,235,0.06)', fontSize: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.6rem', color: '#c7a675', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em', display: 'block' }}>DECISION MAKER & ROLE</span>
                  <div style={{ color: '#f3f1eb', marginTop: 2, fontWeight: 700 }}>{c.primaryContact || 'Pending'} ({c.role || 'Executive'})</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.6rem', color: isLevel04 ? '#22c55e' : '#eab308', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em', display: 'block' }}>PHONE & EMAIL STATUS</span>
                  <div style={{ color: '#f3f1eb', marginTop: 2 }}>Phone: {isLevel04 ? 'Direct Confirmed' : 'Switchboard / Unverified'} · Email: {isLevel04 ? 'Direct Verified' : 'Domain Only'}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.6rem', color: '#a855f7', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em', display: 'block' }}>LAST VERIFIED & PROVENANCE</span>
                  <div style={{ color: '#f3f1eb', marginTop: 2 }}>{c.contactChannel} · {c.lastVerified || 'Today'}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.6rem', color: '#eab308', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em', display: 'block' }}>WHAT IS MISSING</span>
                  <div style={{ color: '#eab308', marginTop: 2, fontWeight: 700 }}>{whatIsMissing}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.6rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em', display: 'block' }}>WHY IT MATTERS</span>
                  <div style={{ color: '#f3f1eb', marginTop: 2 }}>{c.contactReadiness || 'Direct phone verification unlocks CALL NOW operator authorization.'}</div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

