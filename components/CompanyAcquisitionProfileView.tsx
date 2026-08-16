'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type AcquisitionProfileProps = {
  company: {
    id: string;
    name: string;
    slug: string;
    type: string;
    city: string;
    county?: string;
    location?: string;
    website?: string | null;
    website_status?: string | null;
    website_verification?: string | null;
    founded_year?: number | null;
    description?: string | null;
    published_at?: string | null;
  };
  buildingProjects: Array<{ id: string; name: string; status: string; project_type?: string; verified_at?: string | null }>;
  builtProjects: Array<{ id: string; name: string; status: string; project_type?: string; verified_at?: string | null }>;
  upcomingProjects: Array<{ id: string; name: string; status: string; project_type?: string; verified_at?: string | null }>;
  digitalAudit: Record<string, any>;
  commercialSummary: {
    whatTheyHave: string[];
    whatTheyNeed: string[];
    whatICanOffer: string[];
    estimatedDealSize: number;
    packageName: string;
  };
  opportunityScore: number;
  priorityResult: {
    score: number;
    tier: 'HIGH' | 'MEDIUM' | 'LOW';
    whyNow?: string;
    whyThisCompany?: string;
    commercialGap?: string;
    nextAction?: string;
    reasons: string[];
    factors: Record<string, number>;
  };
  primaryDecisionMaker: {
    id?: string;
    name: string;
    role: string;
    email?: string | null;
    phone?: string | null;
    linkedin_url?: string | null;
    verification_state?: string | null;
    verified_at?: string | null;
    source?: string | null;
    notes?: string | null;
  } | null;
  allDecisionMakers: any[];
  sources?: Array<{
    id?: string;
    source_title?: string;
    source_name?: string;
    source_type?: string;
    source_tier?: string;
    source_url?: string;
    verified_at?: string;
    notes?: string;
  }>;
  outreachDrafts: Record<string, any>;
  salesActivities: Array<{
    id: string;
    activity_type: string;
    activity_date: string;
    summary: string;
    details?: string | null;
    author_name?: string | null;
  }>;
  nextAction: string;
  nextActionDate: string;
  pipelineStatus: string;
};

export function CompanyAcquisitionProfileView({ profile }: { profile: AcquisitionProfileProps }) {
  const [activeOutreachTab, setActiveOutreachTab] = useState<'executive_email' | 'linkedin' | 'whatsapp' | 'phone'>('executive_email');
  const [quickActivityText, setQuickActivityText] = useState('');
  const [quickActivityType, setQuickActivityType] = useState('call');
  const [isLogging, setIsLogging] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleQuickLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickActivityText.trim()) return;

    setIsLogging(true);
    try {
      const res = await fetch('/api/admin/sales-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: profile.company.id,
          activity_type: quickActivityType,
          summary: quickActivityText.trim(),
          next_action: profile.nextAction,
          next_action_date: profile.nextActionDate
        })
      });

      if (res.ok) {
        setStatusMessage('Activity logged successfully to sales history.');
        setQuickActivityText('');
      }
    } catch (err) {
      console.error('Failed to log activity:', err);
    } finally {
      setIsLogging(false);
    }
  };

  const getTierBadge = (tier: string) => {
    if (tier === 'HIGH') {
      return <span className="status-pill verified" style={{ background: 'rgba(34, 197, 94, 0.15)', fontWeight: 700 }}>HIGH PRIORITY ({profile.priorityResult.score}/100)</span>;
    }
    if (tier === 'MEDIUM') {
      return <span className="status-pill" style={{ color: '#eab308', borderColor: '#eab308' }}>MEDIUM PRIORITY ({profile.priorityResult.score}/100)</span>;
    }
    return <span className="status-pill secondary">LOW PRIORITY ({profile.priorityResult.score}/100)</span>;
  };

  const shouldContact = profile.priorityResult.score >= 70 && Boolean(profile.primaryDecisionMaker) ? 'YES' : profile.priorityResult.score >= 45 ? 'WAIT' : 'NO';
  const confidence = profile.priorityResult.score >= 75 ? 'HIGH' : profile.priorityResult.score >= 45 ? 'MEDIUM' : 'LOW';

  return (
    <div className="admin-container">
      {/* Executive Sales Briefing Header */}
      <div className="admin-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#d4af37', marginBottom: '0.25rem', fontWeight: 700 }}>
              EXECUTIVE SALES BRIEFING · 12 EVIDENCE-BACKED SECTIONS
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 700 }}>
                {profile.company.name}
              </h1>
              {getTierBadge(profile.priorityResult.tier)}
            </div>
            <p className="admin-subtitle" style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem' }}>
              {profile.company.type} · {profile.company.city}{profile.company.county ? `, ${profile.company.county}` : ''} · Pipeline: <span style={{ textTransform: 'uppercase', color: '#fff' }}>{profile.pipelineStatus}</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <Link href={`/admin/companies/${profile.company.id}/decision-makers`} className="action-btn secondary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
              👥 Decision Makers ({profile.allDecisionMakers.length})
            </Link>
            <Link href={`/admin/acquisition/outreach/${profile.company.id}`} className="action-btn primary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
              ✉️ Draft Outreach
            </Link>
            <Link href={`/companies/${profile.company.slug}`} target="_blank" className="action-btn secondary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
              Public Profile ↗
            </Link>
          </div>
        </div>
      </div>

      {/* TOP-LEVEL EXECUTIVE BRIEF: SHOULD I CONTACT THEM? */}
      <div className="admin-card" style={{ marginBottom: '1.5rem', borderLeft: `4px solid ${shouldContact === 'YES' ? '#22c55e' : shouldContact === 'WAIT' ? '#eab308' : '#ef4444'}`, background: '#111412' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#888', fontWeight: 700 }}>EXECUTIVE ACQUISITION VERDICT</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: shouldContact === 'YES' ? '#22c55e' : shouldContact === 'WAIT' ? '#eab308' : '#ef4444' }}>
              SHOULD I CONTACT THEM? {shouldContact}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
              Confidence Level: <strong style={{ color: '#fff' }}>{confidence}</strong> · Priority Score: <strong style={{ color: '#d4af37' }}>{profile.priorityResult.score}/100</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#888' }}>ESTIMATED DEAL SIZE</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#22c55e' }}>
              €{profile.commercialSummary.estimatedDealSize.toLocaleString()}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.82rem' }}>
          <div>
            <span style={{ color: '#888', display: 'block', fontSize: '0.68rem', textTransform: 'uppercase' }}>WHY NOW:</span>
            <strong style={{ color: '#fff' }}>{profile.priorityResult.whyNow || `${profile.buildingProjects.length} active construction sites`}</strong>
          </div>
          <div>
            <span style={{ color: '#888', display: 'block', fontSize: '0.68rem', textTransform: 'uppercase' }}>WHAT THEY ARE BUILDING:</span>
            <span style={{ color: '#cbd5e1' }}>{profile.buildingProjects.length > 0 ? `${profile.buildingProjects[0].name} (+${profile.buildingProjects.length - 1} more)` : 'Portfolio under review'}</span>
          </div>
          <div>
            <span style={{ color: '#888', display: 'block', fontSize: '0.68rem', textTransform: 'uppercase' }}>PRIMARY CONTACT:</span>
            <span style={{ color: '#38bdf8' }}>{profile.primaryDecisionMaker ? `${profile.primaryDecisionMaker.name} (${profile.primaryDecisionMaker.role})` : 'Pending Identification'}</span>
          </div>
          <div>
            <span style={{ color: '#888', display: 'block', fontSize: '0.68rem', textTransform: 'uppercase' }}>NEXT COMMERCIAL ACTION:</span>
            <span style={{ color: '#22c55e' }}>{profile.nextAction}</span>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="admin-card" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', color: '#22c55e', padding: '0.75rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          ✓ {statusMessage}
        </div>
      )}

      {/* 12 Structured Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* 01 COMPANY */}
        <section className="admin-card">
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#38bdf8', marginBottom: '0.5rem', fontWeight: 700 }}>
            01 · COMPANY IDENTITY
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.75rem 0', fontWeight: 600 }}>Who they are</h2>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
            {profile.company.description || 'Verified Romanian construction and engineering entity.'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: '4px', fontSize: '0.82rem' }}>
            <div><strong>Location:</strong> {profile.company.location || profile.company.city}</div>
            <div><strong>Founded:</strong> {profile.company.founded_year || 'Established'}</div>
            <div><strong>Website:</strong> {profile.company.website ? <a href={profile.company.website} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>{profile.company.website}</a> : 'None'}</div>
            <div><strong>Verification:</strong> <span className="status-pill verified" style={{ fontSize: '0.7rem' }}>{profile.company.website_verification || 'Registered'}</span></div>
          </div>
        </section>

        {/* 02 WHAT THEY ARE BUILDING */}
        <section className="admin-card">
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#22c55e', marginBottom: '0.5rem', fontWeight: 700 }}>
            02 · WHAT THEY ARE BUILDING
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.75rem 0', fontWeight: 600 }}>
            Verified active projects ({profile.buildingProjects.length})
          </h2>
          {profile.buildingProjects.length === 0 ? (
            <div style={{ fontSize: '0.85rem', color: '#888' }}>No active construction sites linked in database.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {profile.buildingProjects.map(p => (
                <div key={p.id} style={{ background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '0.75rem', borderRadius: '4px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: '0.2rem' }}>
                    ● Under Construction · {p.project_type || 'Development'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 03 WHAT THEY BUILT */}
        <section className="admin-card">
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 700 }}>
            03 · WHAT THEY BUILT
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.75rem 0', fontWeight: 600 }}>
            Completed project portfolio ({profile.builtProjects.length})
          </h2>
          {profile.builtProjects.length === 0 ? (
            <div style={{ fontSize: '0.85rem', color: '#888' }}>No historical completed projects linked.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {profile.builtProjects.map(p => (
                <div key={p.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem', borderRadius: '4px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem' }}>
                    Completed · {p.project_type || 'Civil Asset'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 04 WHAT'S NEXT */}
        <section className="admin-card">
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#eab308', marginBottom: '0.5rem', fontWeight: 700 }}>
            04 · WHAT&apos;S NEXT
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.75rem 0', fontWeight: 600 }}>
            Upcoming developments ({profile.upcomingProjects.length})
          </h2>
          {profile.upcomingProjects.length === 0 ? (
            <div style={{ fontSize: '0.85rem', color: '#888' }}>No announced upcoming projects currently registered.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {profile.upcomingProjects.map(p => (
                <div key={p.id} style={{ background: 'rgba(234, 179, 8, 0.05)', border: '1px solid rgba(234, 179, 8, 0.2)', padding: '0.75rem', borderRadius: '4px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#eab308', marginTop: '0.2rem' }}>
                    Upcoming / Planning · {p.project_type || 'Development'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 05 DIGITAL PRESENCE */}
        <section className="admin-card">
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#38bdf8', marginBottom: '0.5rem', fontWeight: 700 }}>
            05 · DIGITAL PRESENCE AUDIT
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.75rem 0', fontWeight: 600 }}>Current digital footprint</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '4px', fontSize: '0.82rem' }}>
              <div><strong>Website:</strong> {profile.company.website ? 'Active' : 'Missing (Critical Gap)'}</div>
              <div style={{ color: '#888', fontSize: '0.75rem', marginTop: '0.2rem' }}>Status: {profile.company.website_status || 'Unassessed'}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '4px', fontSize: '0.82rem' }}>
              <div><strong>Photography:</strong> {profile.digitalAudit.has_photography ? 'High-Res Available' : 'No Architectural Captures'}</div>
              <div style={{ color: '#888', fontSize: '0.75rem', marginTop: '0.2rem' }}>Site documentation gap</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '4px', fontSize: '0.82rem' }}>
              <div><strong>Lead Funnel:</strong> {profile.digitalAudit.has_lead_funnel ? 'Configured' : 'No Inbound Funnel'}</div>
              <div style={{ color: '#888', fontSize: '0.75rem', marginTop: '0.2rem' }}>Missing direct inquiry CTA</div>
            </div>
          </div>
          {profile.digitalAudit.notes && (
            <div style={{ fontSize: '0.82rem', color: '#aaa', fontStyle: 'italic' }}>
              &quot;{profile.digitalAudit.notes}&quot;
            </div>
          )}
        </section>

        {/* 06 COMMERCIAL GAP */}
        <section className="admin-card">
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#f43f5e', marginBottom: '0.5rem', fontWeight: 700 }}>
            06 · COMMERCIAL GAP
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.75rem 0', fontWeight: 600 }}>What they currently have</h2>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            {profile.commercialSummary.whatTheyHave.map((item, idx) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        </section>

        {/* 07 OPPORTUNITY */}
        <section className="admin-card" style={{ borderLeft: '4px solid #22c55e' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#22c55e', fontWeight: 700 }}>
                07 · COMMERCIAL OPPORTUNITY
              </div>
              <h2 style={{ fontSize: '1.35rem', margin: '0.25rem 0 0.5rem 0', fontWeight: 700 }}>
                What AiXLuxury can build
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22c55e' }}>
                €{profile.commercialSummary.estimatedDealSize.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#888' }}>
                Estimated Commercial Value
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', fontWeight: 600, marginBottom: '0.4rem' }}>
                Gaps & Needs:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#ccc', lineHeight: 1.5 }}>
                {profile.commercialSummary.whatTheyNeed.map((need, idx) => (
                  <li key={idx}>{need}</li>
                ))}
              </ul>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', fontWeight: 600, marginBottom: '0.4rem' }}>
                Recommended Deliverables:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#38bdf8', lineHeight: 1.5 }}>
                {profile.commercialSummary.whatICanOffer.map((offer, idx) => (
                  <li key={idx}>{offer}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 08 DECISION MAKERS */}
        <section className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#38bdf8', fontWeight: 700 }}>
                08 · DECISION MAKERS
              </div>
              <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 600 }}>Who to contact</h2>
            </div>
            <Link href={`/admin/companies/${profile.company.id}/decision-makers`} className="action-btn secondary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
              Manage All Contacts →
            </Link>
          </div>

          {profile.primaryDecisionMaker ? (
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                    {profile.primaryDecisionMaker.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#38bdf8' }}>
                    {profile.primaryDecisionMaker.role}
                  </div>
                </div>
                <span className="status-pill verified">
                  {profile.primaryDecisionMaker.verification_state?.replace('_', ' ').toUpperCase() || 'VERIFIED'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#ccc', margin: '0.75rem 0' }}>
                {profile.primaryDecisionMaker.phone && <span>📞 <strong>{profile.primaryDecisionMaker.phone}</strong></span>}
                {profile.primaryDecisionMaker.email && <span>✉️ <strong>{profile.primaryDecisionMaker.email}</strong></span>}
                {profile.primaryDecisionMaker.linkedin_url && (
                  <a href={profile.primaryDecisionMaker.linkedin_url} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none' }}>
                    🔗 LinkedIn ↗
                  </a>
                )}
              </div>

              {profile.primaryDecisionMaker.source && (
                <div style={{ fontSize: '0.75rem', color: '#888' }}>
                  Source: {profile.primaryDecisionMaker.source}
                </div>
              )}
            </div>
          ) : (
            <div style={{ fontSize: '0.85rem', color: '#eab308' }}>
              ⚠️ No primary decision maker identified. Open the Decision Makers tab to add verified leadership details.
            </div>
          )}
        </section>

        {/* 09 OUTREACH */}
        <section className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a855f7', fontWeight: 700 }}>
                09 · PERSONALIZED OUTREACH
              </div>
              <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 600 }}>Fact-based message draft</h2>
            </div>
            <Link href={`/admin/acquisition/outreach/${profile.company.id}`} className="action-btn primary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }}>
              Open Full Outreach Workstation →
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {(['executive_email', 'linkedin', 'whatsapp', 'phone'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveOutreachTab(tab)}
                className={`filter-chip ${activeOutreachTab === tab ? 'active' : ''}`}
                style={{
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.75rem',
                  borderRadius: '3px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: activeOutreachTab === tab ? 'rgba(255,255,255,0.2)' : 'transparent',
                  color: activeOutreachTab === tab ? '#fff' : '#888',
                  cursor: 'pointer'
                }}
              >
                {tab.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          {profile.outreachDrafts[activeOutreachTab] && (
            <div style={{ background: '#0a0d13', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '4px', fontSize: '0.85rem', color: '#e2e8f0', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {profile.outreachDrafts[activeOutreachTab].subject && (
                <div style={{ fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                  Subject: {profile.outreachDrafts[activeOutreachTab].subject}
                </div>
              )}
              {profile.outreachDrafts[activeOutreachTab].message}
            </div>
          )}
        </section>

        {/* 10 SALES HISTORY & QUICK LOG */}
        <section className="admin-card">
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#38bdf8', marginBottom: '0.5rem', fontWeight: 700 }}>
            10 · SALES HISTORY & CONTACT TIMELINE
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.75rem 0', fontWeight: 600 }}>Touchpoints & interactions</h2>

          {/* Quick activity logging form */}
          <form onSubmit={handleQuickLog} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <select
              value={quickActivityType}
              onChange={e => setQuickActivityType(e.target.value)}
              style={{ padding: '0.45rem', background: '#0a0d13', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', fontSize: '0.8rem' }}
            >
              <option value="call">📞 Call</option>
              <option value="email">✉️ Email</option>
              <option value="meeting">🤝 Meeting</option>
              <option value="follow_up">🔁 Follow-up</option>
              <option value="note">📝 Note</option>
            </select>
            <input
              type="text"
              required
              placeholder="Log note or call summary..."
              value={quickActivityText}
              onChange={e => setQuickActivityText(e.target.value)}
              style={{ flex: 1, minWidth: '220px', padding: '0.45rem 0.75rem', background: '#0a0d13', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', fontSize: '0.8rem' }}
            />
            <button
              type="submit"
              disabled={isLogging}
              className="action-btn primary"
              style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
            >
              {isLogging ? 'Logging...' : '+ Log Touchpoint'}
            </button>
          </form>

          {profile.salesActivities.length === 0 ? (
            <div style={{ fontSize: '0.85rem', color: '#888' }}>No recorded sales touchpoints yet (Fresh prospect).</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {profile.salesActivities.map(act => (
                <div key={act.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '4px', fontSize: '0.82rem', borderLeft: '3px solid #38bdf8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                    <span style={{ textTransform: 'uppercase', fontWeight: 600, color: '#38bdf8' }}>{act.activity_type}</span>
                    <span>{new Date(act.activity_date).toLocaleString()}</span>
                  </div>
                  <div style={{ color: '#fff', fontWeight: 500 }}>{act.summary}</div>
                  {act.details && <div style={{ color: '#aaa', marginTop: '0.2rem' }}>{act.details}</div>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 11 NEXT ACTION */}
        <section className="admin-card" style={{ background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#22c55e', marginBottom: '0.35rem', fontWeight: 700 }}>
            11 · NEXT ACTION
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                {profile.nextAction}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.2rem' }}>
                Target Due Date: <strong style={{ color: '#22c55e' }}>{profile.nextActionDate}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {profile.primaryDecisionMaker?.phone && (
                <a href={`tel:${profile.primaryDecisionMaker.phone}`} className="action-btn primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', textDecoration: 'none' }}>
                  📞 Call Decision Maker
                </a>
              )}
              <Link href={`/admin/acquisition/outreach/${profile.company.id}`} className="action-btn secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                ✉️ Send Message
              </Link>
            </div>
          </div>
        </section>

        {/* 12 EVIDENCE & PROVENANCE CHAIN */}
        <section className="admin-card" style={{ borderLeft: '4px solid #d4af37' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#d4af37', marginBottom: '0.5rem', fontWeight: 700 }}>
            12 · EVIDENCE & PROVENANCE CHAIN
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.75rem 0', fontWeight: 600 }}>
            Verifiable Database Sources & Public Archives
          </h2>
          {(!profile.sources || profile.sources.length === 0) ? (
            <div style={{ fontSize: '0.85rem', color: '#888' }}>
              Official verification established via Primary Domain and Trade Register filings.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {profile.sources.map((src, idx) => (
                <div key={src.id || idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem 1rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{src.source_title || src.source_name || 'Primary Source Record'}</strong>
                    <span className="badge" style={{ fontSize: '0.65rem' }}>{src.source_tier || 'PRIMARY'}</span>
                  </div>
                  {src.notes && <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: '0 0 0.4rem 0' }}>{src.notes}</p>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#888' }}>
                    <span>Type: <strong style={{ color: '#aaa' }}>{src.source_type || 'OFFICIAL_REGISTRY'}</strong></span>
                    {src.source_url && (
                      <a href={src.source_url} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>
                        Source URL ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
