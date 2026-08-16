'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type Props = {
  registeredSources: Array<{ id: string; name: string; type: string; tier: string; url: string }>;
};

export function LiveMarketDiscoveryView({ registeredSources }: Props) {
  const [activeTab, setActiveTab] = useState<'sources' | 'pipeline' | 'intake'>('sources');

  const sourceTiers = [
    {
      tier: 'PRIMARY SOURCES',
      badge: 'TIER 1 · AUTHORITATIVE',
      color: '#22c55e',
      desc: 'Official company websites, project sites, municipal PMB cadastre/urbanism registers, SEAP/SICAP procurement notices, ONRC Trade Register filings.',
      authority: 'Eligible for Direct Entity & Relationship Verification'
    },
    {
      tier: 'SECONDARY SOURCES',
      badge: 'TIER 2 · PRESS & MEDIA',
      color: '#38bdf8',
      desc: 'Reputable construction journals (Arena Construcțiilor, ZF Construcții), verified press releases, industry associations.',
      authority: 'Eligible for Discovery Corroboration'
    },
    {
      tier: 'TERTIARY SOURCES',
      badge: 'TIER 3 · DISCOVERY HINTS',
      color: '#eab308',
      desc: 'Commercial directories, aggregator listings, search engine snippets.',
      authority: 'Discovery Hints Only (Never establishes verification)'
    }
  ];

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            SOURCE PROVENANCE & INTAKE · PHASE 16
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            LIVE MARKET DISCOVERY WORKSTATION
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Legitimate public source intake pipeline: Discovered → Normalized → Duplicate Check → Researching → Verified.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/sources" className="action-btn secondary">
            Source Registry
          </Link>
          <Link href="/admin/market/discovery" className="action-btn primary">
            Staging Execution →
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid var(--line)', paddingBottom: 12 }}>
        <button
          className={`action-btn ${activeTab === 'sources' ? 'primary' : 'secondary'}`}
          onClick={() => setActiveTab('sources')}
          style={{ fontSize: '0.78rem' }}
        >
          Source Hierarchy & Tiers
        </button>
        <button
          className={`action-btn ${activeTab === 'pipeline' ? 'primary' : 'secondary'}`}
          onClick={() => setActiveTab('pipeline')}
          style={{ fontSize: '0.78rem' }}
        >
          Verification Pipeline Stages
        </button>
      </div>

      {activeTab === 'sources' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sourceTiers.map((st, idx) => (
            <div key={idx} className="admin-card" style={{ padding: 20, borderLeft: `4px solid ${st.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: '#fff' }}>{st.tier}</h2>
                <span className="badge" style={{ color: st.color, borderColor: st.color, fontSize: '0.65rem' }}>{st.badge}</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: '0 0 10px 0', lineHeight: 1.5 }}>{st.desc}</p>
              <div style={{ fontSize: '0.72rem', color: '#888' }}>
                <strong style={{ color: '#fff' }}>Authority Rule: </strong>{st.authority}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <section className="admin-card" style={{ padding: 20 }}>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 12px 0', fontWeight: 700 }}>
            Strict 10-Stage Entity Verification Pipeline
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#888', margin: '0 0 20px 0' }}>
            No stage may be skipped. Zero promotion from unverified discovery hints to public or outreach states.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { num: '01', title: 'DISCOVERED', desc: 'Raw record scraped or ingested from public gazette or register.' },
              { num: '02', title: 'NORMALIZED', desc: 'Romanian CUI/CIF format sanitized, phone normalized (+40), clean domain.' },
              { num: '03', title: 'DUPLICATE CHECK', desc: 'Cross-referenced against existing CUI, domain, and legal name.' },
              { num: '04', title: 'RESEARCHING', desc: 'Assigned to editorial queue for manual evidence collection.' },
              { num: '05', title: 'SOURCE VERIFIED', desc: 'Primary source URL authenticated with timestamp.' },
              { num: '06', title: 'ENTITY VERIFIED', desc: 'Official trade registry (ONRC) active status confirmed.' },
              { num: '07', title: 'RELATIONSHIP VERIFIED', desc: 'Building permit or tender award confirms contractor role.' },
              { num: '08', title: 'DECISION MAKER VERIFIED', desc: 'Level 03 domain email or Level 04 direct confirmation.' },
              { num: '09', title: 'CONTACT READY', desc: 'All acquisition criteria met, ready for fact-based outreach.' },
              { num: '10', title: 'ACTIVATED', desc: 'Direct executive commercial outreach initiated.' }
            ].map((step, idx) => (
              <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#d4af37' }}>{step.num}</div>
                <div>
                  <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{step.title}</strong>
                  <span style={{ fontSize: '0.72rem', color: '#888', display: 'block' }}>{step.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
