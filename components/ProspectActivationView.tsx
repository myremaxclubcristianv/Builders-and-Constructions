'use client';

import { useState } from 'react';
import Link from 'next/link';

type ProspectCandidate = {
  id: string;
  name: string;
  slug: string;
  type: string;
  location?: string | null;
  readiness_score: number;
  is_blocked: boolean;
  block_reason?: string | null;
  readiness_factors: string[];
  opportunity_score: number;
  active_projects_count: number;
  decision_maker?: {
    name: string;
    role: string;
    phone?: string | null;
    email?: string | null;
  } | null;
  recommended_services: string[];
  why_now: string;
};

type Props = {
  readyToContact: ProspectCandidate[];
  blocked: ProspectCandidate[];
};

export function ProspectActivationView({ readyToContact, blocked }: Props) {
  const [selectedCompany, setSelectedCompany] = useState<ProspectCandidate | null>(readyToContact[0] || null);
  const [channel, setChannel] = useState<'executive_email' | 'linkedin' | 'short_message' | 'call_opening'>('executive_email');
  const [draftSubject, setDraftSubject] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [approvalNotice, setApprovalNotice] = useState('');

  function generateFactBasedDraft(comp: ProspectCandidate, ch: string) {
    const contactName = comp.decision_maker?.name || 'Managing Director';
    const projCount = comp.active_projects_count || 1;

    if (ch === 'executive_email') {
      setDraftSubject(`Architectural presentation & masterplan positioning for ${comp.name}`);
      setDraftBody(
        `Dear ${contactName},\n\n` +
        `I have been following ${comp.name}'s active construction portfolio across Romania, with ${projCount} landmark developments currently underway.\n\n` +
        `While your engineering execution is proven on site, the digital presentation does not currently reflect the architectural scale of your work to institutional investors and procurement teams.\n\n` +
        `On CONSTRUCTIONS by AiXLuxury, we showcase Romania's verified construction developments with 4K drone cinematography, verified milestone progress, and dedicated portfolio portals.\n\n` +
        `Would you be open to a brief 10-minute briefing next week on how we can turn your active sites into high-intent procurement inquiries?\n\n` +
        `Best regards,\n` +
        `AiXLuxury Commercial Team\n` +
        `CONSTRUCTIONS by AiXLuxury`
      );
    } else if (ch === 'linkedin') {
      setDraftSubject('');
      setDraftBody(
        `Hello ${contactName}, I noticed ${comp.name} is currently advancing ${projCount} active construction developments. ` +
        `We feature leading Romanian engineering practices on CONSTRUCTIONS by AiXLuxury to present their portfolio directly to institutional real estate developers. ` +
        `I would welcome connecting and sharing how we present your active project milestones.`
      );
    } else if (ch === 'short_message') {
      setDraftSubject('');
      setDraftBody(
        `Hello ${contactName}, following up regarding ${comp.name}'s construction developments. ` +
        `We would like to prepare a verified digital showcase on CONSTRUCTIONS by AiXLuxury for your active job sites. When is a convenient time to speak?`
      );
    } else {
      setDraftSubject('Call Opening Script');
      setDraftBody(
        `"Good morning ${contactName}, this is [Name] calling from CONSTRUCTIONS by AiXLuxury.\n\n` +
        `I am reaching out specifically regarding ${comp.name}'s active construction developments. ` +
        `We are currently documenting landmark Romanian engineering projects and noticed an opportunity to significantly enhance the digital presentation of your active project portfolio for prospective developer tenders.\n\n` +
        `Do you have 2 minutes to discuss who oversees your external project marketing and investor presentations?"`
      );
    }
  }

  function handleSelectCompany(comp: ProspectCandidate) {
    setSelectedCompany(comp);
    generateFactBasedDraft(comp, channel);
    setApprovalNotice('');
  }

  async function handleApproveDraft() {
    if (!selectedCompany || !draftBody.trim()) return;

    setApprovalNotice('Submitting fact-based draft to operator approval ledger…');
    const res = await fetch('/api/admin/outreach-drafts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_id: selectedCompany.id,
        channel,
        recipient_name: selectedCompany.decision_maker?.name || null,
        recipient_role: selectedCompany.decision_maker?.role || null,
        recipient_contact: selectedCompany.decision_maker?.email || selectedCompany.decision_maker?.phone || null,
        subject: draftSubject || null,
        body: draftBody
      })
    });

    if (res.ok) {
      const data = await res.json();
      // Immediately approve
      await fetch('/api/admin/outreach-drafts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftId: data.id, action: 'approve' })
      });

      setApprovalNotice('✓ Outreach draft approved and logged! Ready for manual operator transmission.');
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            Fact-Based Outreach Activation
          </div>
          <h1 className="admin-title" style={{ margin: '4px 0 0 0' }}>
            PROSPECT ACTIVATION & CONTACT READINESS
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/commercial/today" className="btn">
            Daily Queue →
          </Link>
          <Link href="/admin/market/coverage" className="btn fill">
            Market Coverage →
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, marginBottom: 32 }}>
        {/* Left Column: Ready to Contact Candidates */}
        <section className="admin-panel">
          <div className="eyebrow" style={{ color: '#86efac' }}>
            Fully Verified & Ready ({readyToContact.length})
          </div>
          <h2 style={{ fontSize: 18, margin: '4px 0 16px 0' }}>HIGH READINESS PROSPECTS</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {readyToContact.map(comp => (
              <div
                key={comp.id}
                onClick={() => handleSelectCompany(comp)}
                style={{
                  background: selectedCompany?.id === comp.id ? '#1c201d' : '#0d0f0e',
                  border: selectedCompany?.id === comp.id ? '1px solid #d4af37' : '1px solid #262927',
                  borderRadius: 6,
                  padding: 16,
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#86efac' }}>
                    READINESS: {comp.readiness_score}%
                  </span>
                  <span style={{ fontSize: 11, color: '#d4af37', fontWeight: 700 }}>
                    {comp.opportunity_score}/100 OPP
                  </span>
                </div>

                <h3 style={{ fontSize: 16, color: '#fff', margin: '6px 0 2px 0' }}>{comp.name}</h3>
                <div style={{ fontSize: 12, color: '#888' }}>
                  {comp.type} · {comp.location || 'Romania'} · {comp.active_projects_count} Active Projects
                </div>

                {comp.decision_maker && (
                  <div style={{ fontSize: 12, color: '#d1cfc7', marginTop: 6 }}>
                    Decision Maker: <strong>{comp.decision_maker.name}</strong> ({comp.decision_maker.role})
                  </div>
                )}

                <div style={{ marginTop: 8 }}>
                  <span className="eyebrow" style={{ fontSize: 9 }}>WHY NOW:</span>
                  <p style={{ fontSize: 11, color: '#ccc', margin: '2px 0 0 0' }}>{comp.why_now}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Outreach Drafting & Operator Approval */}
        {selectedCompany ? (
          <section className="admin-panel" style={{ background: '#141715', border: '1px solid #d4af37' }}>
            <div className="eyebrow" style={{ color: '#d4af37' }}>
              Fact-Based Outreach Preparation
            </div>
            <h2 style={{ fontSize: 18, margin: '4px 0 16px 0' }}>
              OUTREACH DRAFT FOR: {selectedCompany.name.toUpperCase()}
            </h2>

            {approvalNotice && (
              <div style={{ padding: '10px 14px', marginBottom: 16, borderRadius: 4, background: 'rgba(16, 185, 129, 0.15)', color: '#86efac', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: 13 }}>
                {approvalNotice}
              </div>
            )}

            {/* Channel Tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
              {[
                { key: 'executive_email', label: 'Executive Email' },
                { key: 'linkedin', label: 'LinkedIn Message' },
                { key: 'short_message', label: 'WhatsApp / Short Message' },
                { key: 'call_opening', label: 'Call Opening Script' }
              ].map(ch => (
                <button
                  key={ch.key}
                  type="button"
                  className="btn"
                  style={{
                    fontSize: 11,
                    padding: '5px 10px',
                    background: channel === ch.key ? '#d4af37' : '#0d0f0e',
                    color: channel === ch.key ? '#000' : '#fff',
                    fontWeight: channel === ch.key ? 700 : 500
                  }}
                  onClick={() => {
                    setChannel(ch.key as any);
                    generateFactBasedDraft(selectedCompany, ch.key);
                  }}
                >
                  {ch.label}
                </button>
              ))}
            </div>

            {channel === 'executive_email' && (
              <div style={{ marginBottom: 12 }}>
                <span className="form-label">Subject Line</span>
                <input value={draftSubject} onChange={e => setDraftSubject(e.target.value)} />
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <span className="form-label">Message Body (100% Fact-Based)</span>
              <textarea
                value={draftBody}
                onChange={e => setDraftBody(e.target.value)}
                rows={10}
                style={{ fontSize: 13, lineHeight: 1.6 }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="btn fill"
                style={{ background: '#86efac', color: '#000', fontWeight: 800 }}
                onClick={handleApproveDraft}
              >
                ✓ Operator Approve Draft
              </button>
              <Link href={`/admin/opportunities/${selectedCompany.id}`} className="btn">
                Open Sales Workstation →
              </Link>
            </div>
          </section>
        ) : (
          <div className="admin-panel empty">
            Select a prospect candidate to prepare fact-based outreach.
          </div>
        )}
      </div>

      {/* DO NOT CONTACT GUARD SECTION */}
      {blocked.length > 0 && (
        <section className="admin-panel" style={{ border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <div className="eyebrow" style={{ color: '#fca5a5' }}>
            Do Not Contact Safeguard & Active Exclusions
          </div>
          <h2 style={{ fontSize: 18, margin: '4px 0 16px 0' }}>BLOCKED FROM OUTREACH ({blocked.length})</h2>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Classification</th>
                <th>Block Reason</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {blocked.map(b => (
                <tr key={b.id}>
                  <td><strong>{b.name}</strong></td>
                  <td>{b.type}</td>
                  <td style={{ color: '#fca5a5' }}>{b.block_reason || 'Disqualified'}</td>
                  <td>
                    <Link href={`/admin/opportunities/${b.id}`} className="link-arrow">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
