'use client';

import { useState } from 'react';
import Link from 'next/link';

type Company = {
  id: string;
  name: string;
  slug: string;
  type: string;
  location?: string | null;
  website?: string | null;
  description?: string | null;
};

type Opportunity = {
  opportunity_score?: number | null;
  score_reasons?: string[] | null;
  recommended_services?: string[] | null;
  digital_audit?: Record<string, { status: 'good' | 'needs_improvement' | 'missing'; recommendation?: string }> | null;
};

const AUDIT_SECTIONS = [
  { key: 'website', label: '01 · Corporate Website & Digital Experience', evidence: 'Direct browser inspection, load speed, responsive framework.' },
  { key: 'social', label: '02 · Social & Executive Presence', evidence: 'LinkedIn corporate follower count, post frequency, thought leadership.' },
  { key: 'seo', label: '03 · Search Engine Authority', evidence: 'Google indexation for regional construction and developer terms.' },
  { key: 'project_presentation', label: '04 · Project Portfolio Presentation', evidence: 'Detailed project galleries, architectural specifications, masterplans.' },
  { key: 'photography', label: '05 · Architectural & Site Photography', evidence: 'Resolution, professional color grading, golden-hour captures.' },
  { key: 'video', label: '06 · Drone & Milestone Video', evidence: 'Licensed 4K aerial footage and documentary construction updates.' },
  { key: 'branding', label: '07 · Brand Authority & Typography', evidence: 'Visual guidelines, typography consistency, investor pitch decks.' },
  { key: 'lead_gen', label: '08 · Inbound Procurement Lead Funnel', evidence: 'Dedicated commercial inquiry capture workflows and CRM routing.' }
];

export function CompanyDigitalAuditView({ company, opportunity }: { company: Company; opportunity: Opportunity | null }) {
  const [clientMode, setClientMode] = useState(false);

  const auditData = opportunity?.digital_audit || {};
  const oppScore = opportunity?.opportunity_score ?? 82;

  return (
    <div>
      {/* Header Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <Link href={`/admin/opportunities/${company.id}`} className="btn">
          ← Back to Sales Workstation
        </Link>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            className="btn"
            style={{ background: clientMode ? '#d4af37' : '#141715', color: clientMode ? '#000' : '#fff', fontWeight: 700 }}
            onClick={() => setClientMode(!clientMode)}
          >
            {clientMode ? '✓ Client Presentation Mode (Active)' : 'Toggle Client-Facing Presentation'}
          </button>
          <button type="button" className="btn" onClick={() => window.print()}>
            Print / Export PDF
          </button>
        </div>
      </div>

      {/* Main Report Body */}
      <div style={{ background: '#0a0c0b', border: '1px solid #d4af37', borderRadius: 8, padding: 36 }}>
        {/* Title */}
        <div style={{ borderBottom: '1px solid #262927', paddingBottom: 24, marginBottom: 32 }}>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            CONSTRUCTIONS by AiXLuxury · Commercial Intelligence
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', margin: '8px 0 6px 0', letterSpacing: '-0.02em' }}>
            DIGITAL PRESENCE & TRANSFORMATION AUDIT
          </h1>
          <p style={{ color: '#aaa9a1', fontSize: 15, margin: 0 }}>
            Prepared for: <strong style={{ color: '#fff' }}>{company.name.toUpperCase()}</strong> ({company.type} {company.location ? `· ${company.location}` : ''})
          </p>
        </div>

        {/* Executive Summary Box */}
        <div style={{ display: 'grid', gridTemplateColumns: clientMode ? '1fr' : '2fr 1fr', gap: 24, marginBottom: 36 }}>
          <div style={{ background: '#141715', padding: 24, borderRadius: 6, border: '1px solid #262927' }}>
            <span className="eyebrow" style={{ color: '#d4af37' }}>Executive Summary</span>
            <h3 style={{ fontSize: 18, color: '#fff', margin: '6px 0 10px 0' }}>COMMERCIAL POSITIONING ASSESSMENT</h3>
            <p style={{ fontSize: 14, color: '#d1cfc7', lineHeight: 1.7, margin: 0 }}>
              {company.name} possesses a proven track record of engineering execution and real-world construction delivery. However, its current online visibility does not adequately represent its capability to prospective institutional developers, foreign funds, and private procurement teams.
            </p>
          </div>

          {!clientMode && (
            <div style={{ background: '#141715', padding: 24, borderRadius: 6, border: '1px solid #d4af37', textAlign: 'center' }}>
              <span className="eyebrow" style={{ color: '#d4af37' }}>INTERNAL OPPORTUNITY SCORE</span>
              <div style={{ fontSize: 44, fontWeight: 800, color: '#fff', marginTop: 8 }}>
                {oppScore} <span style={{ fontSize: 20, color: '#888' }}>/ 100</span>
              </div>
              <span className="badge" style={{ background: '#86efac', color: '#000', fontWeight: 800, marginTop: 6 }}>
                HIGH CONVERSION POTENTIAL
              </span>
            </div>
          )}
        </div>

        {/* WHAT THEY HAVE VS WHAT THEY COULD HAVE */}
        <section style={{ marginBottom: 40 }}>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            Comparative Transformation Blueprint
          </div>
          <h2 style={{ fontSize: 22, margin: '6px 0 20px 0' }}>WHAT THE PRACTICE HAS vs WHAT COULD BE DIGITALLY</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {/* Left: What they have */}
            <div style={{ background: '#141715', padding: 24, borderRadius: 6, border: '1px solid rgba(239, 68, 68, 0.4)' }}>
              <span style={{ fontSize: 12, textTransform: 'uppercase', color: '#fca5a5', fontWeight: 800, letterSpacing: '0.05em' }}>
                CURRENT DIGITAL STATE (EXISTING)
              </span>
              <ul style={{ margin: '14px 0 0 0', paddingLeft: 20, fontSize: 13, color: '#aaa9a1', lineHeight: 1.8 }}>
                <li>{company.website ? `Website: ${company.website}` : 'No verified official website'}</li>
                <li>Unstructured project portfolio without architectural photography</li>
                <li>Zero 4K drone construction site video documentation</li>
                <li>Missing inbound procurement inquiry funnel</li>
                <li>Offline prestige not reflected in search results</li>
              </ul>
            </div>

            {/* Right: What they could have */}
            <div style={{ background: '#141715', padding: 24, borderRadius: 6, border: '1px solid rgba(134, 239, 172, 0.4)' }}>
              <span style={{ fontSize: 12, textTransform: 'uppercase', color: '#86efac', fontWeight: 800, letterSpacing: '0.05em' }}>
                FUTURE TRANSFORMED STATE (WITH CONSTRUCTIONS)
              </span>
              <ul style={{ margin: '14px 0 0 0', paddingLeft: 20, fontSize: 13, color: '#e5e5e5', lineHeight: 1.8 }}>
                <li>Bespoke architectural web infrastructure & visual identity</li>
                <li>Dedicated project microsites with verified consortium attribution</li>
                <li>High-resolution interior/exterior photography and drone site films</li>
                <li>Direct high-intent commercial inquiry capture workflow</li>
                <li>Search engine dominance for regional developer tenders</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 8-Dimension Audit Breakdown */}
        <section>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            Comprehensive Gap Analysis (8 Dimensions)
          </div>
          <h2 style={{ fontSize: 22, margin: '6px 0 20px 0' }}>AUDIT DIMENSIONS & STRATEGIC RECOMMENDATIONS</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {AUDIT_SECTIONS.map(sec => {
              const secData = auditData[sec.key] || { status: 'missing', recommendation: 'Upgrade and establish bespoke infrastructure.' };
              const statusColor = secData.status === 'good' ? '#86efac' : secData.status === 'needs_improvement' ? '#fde047' : '#fca5a5';

              return (
                <div key={sec.key} style={{ background: '#141715', border: '1px solid #262927', padding: 20, borderRadius: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: 14, color: '#fff' }}>{sec.label}</h4>
                    <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: statusColor }}>
                      {secData.status.replaceAll('_', ' ')}
                    </span>
                  </div>

                  <p style={{ fontSize: 12, color: '#888', marginTop: 8, marginBottom: 8, lineHeight: 1.4 }}>
                    Evidence: {sec.evidence}
                  </p>

                  <div style={{ background: '#0d0f0e', padding: 10, borderRadius: 4, border: '1px solid #222', marginTop: 8 }}>
                    <span style={{ fontSize: 10, textTransform: 'uppercase', color: '#d4af37', fontWeight: 600 }}>
                      RECOMMENDED ACTION:
                    </span>
                    <p style={{ fontSize: 12, color: '#ccc', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                      {secData.recommendation || 'Deploy bespoke digital infrastructure.'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
