'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type OutreachChannel = 'executive_email' | 'linkedin' | 'whatsapp' | 'phone';

type OutreachDraft = {
  id?: string;
  channel: OutreachChannel;
  channelTitle: string;
  subject?: string;
  message: string;
  whyThisMessage: string;
  factsUsed: string[];
  sourcesUsed: string[];
  cta: string;
  approval_state?: 'draft' | 'ready_for_review' | 'approved' | 'sent' | 'cancelled';
  approved_by?: string | null;
  approved_at?: string | null;
  sent_at?: string | null;
};

export function OutreachDraftingWorkstation({
  company,
  initialDrafts,
  savedDrafts = []
}: {
  company: { id: string; name: string; slug: string; city?: string; type?: string };
  initialDrafts: Record<OutreachChannel, OutreachDraft>;
  savedDrafts?: any[];
}) {
  const [activeChannel, setActiveChannel] = useState<OutreachChannel>('executive_email');
  const [drafts, setDrafts] = useState<Record<OutreachChannel, OutreachDraft>>(initialDrafts);
  const [savedHistory, setSavedHistory] = useState<any[]>(savedDrafts);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const currentDraft = drafts[activeChannel];

  const handleMessageChange = (newText: string) => {
    setDrafts(prev => ({
      ...prev,
      [activeChannel]: {
        ...prev[activeChannel],
        message: newText
      }
    }));
  };

  const handleSubjectChange = (newSubject: string) => {
    setDrafts(prev => ({
      ...prev,
      [activeChannel]: {
        ...prev[activeChannel],
        subject: newSubject
      }
    }));
  };

  const handleCopy = () => {
    const textToCopy = currentDraft.subject
      ? `Subject: ${currentDraft.subject}\n\n${currentDraft.message}`
      : currentDraft.message;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveState = async (targetState: 'draft' | 'ready_for_review' | 'approved' | 'sent' | 'cancelled') => {
    setIsSubmitting(true);
    setStatusMessage(null);

    const payload = {
      id: currentDraft.id,
      company_id: company.id,
      channel: activeChannel,
      subject: currentDraft.subject || null,
      body: currentDraft.message,
      approval_state: targetState,
      metadata: {
        facts_used: currentDraft.factsUsed,
        sources_used: currentDraft.sourcesUsed,
        why_this_message: currentDraft.whyThisMessage,
        cta: currentDraft.cta
      }
    };

    try {
      const res = await fetch('/api/admin/outreach-drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const updated = await res.json();
        setDrafts(prev => ({
          ...prev,
          [activeChannel]: {
            ...prev[activeChannel],
            id: updated.id,
            approval_state: updated.approval_state,
            approved_by: updated.approved_by,
            approved_at: updated.approved_at,
            sent_at: updated.sent_at
          }
        }));

        setSavedHistory(prev => [updated, ...prev.filter(d => d.id !== updated.id)]);

        if (targetState === 'sent') {
          setStatusMessage(`Outreach successfully marked as SENT via ${currentDraft.channelTitle} and logged to sales history.`);
        } else if (targetState === 'approved') {
          setStatusMessage(`Outreach message APPROVED. Ready for delivery.`);
        } else {
          setStatusMessage(`Draft saved with status: ${targetState.toUpperCase()}.`);
        }
      } else {
        const errData = await res.json();
        alert(`Failed to update outreach draft: ${errData.error || 'Server error'}`);
      }
    } catch (e: any) {
      console.error('Error saving draft:', e);
      alert('Failed to save outreach draft.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getApprovalBadge = (state?: string) => {
    switch (state) {
      case 'approved':
        return <span className="status-pill verified" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', fontWeight: 700 }}>✓ APPROVED</span>;
      case 'ready_for_review':
        return <span className="status-pill" style={{ color: '#38bdf8', borderColor: '#38bdf8' }}>READY FOR REVIEW</span>;
      case 'sent':
        return <span className="status-pill" style={{ background: '#3b82f6', color: '#fff', fontWeight: 700 }}>● SENT</span>;
      case 'cancelled':
        return <span className="status-pill unverified">CANCELLED</span>;
      default:
        return <span className="status-pill secondary">DRAFT</span>;
    }
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '0.25rem' }}>
              FACT-BASED OUTREACH ENGINE · ZERO ASSUMPTIONS
            </div>
            <h1 style={{ margin: '0 0 0.35rem 0', fontSize: '1.85rem', fontWeight: 700 }}>
              {company.name} · Multi-Channel Outreach
            </h1>
            <p className="admin-subtitle" style={{ margin: 0 }}>
              Fact-based, executive-level correspondence generated exclusively from verified project involvement.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link href={`/admin/companies/${company.id}/acquisition`} className="action-btn secondary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}>
              ← Sales Briefing
            </Link>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="admin-card" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', color: '#22c55e', padding: '0.75rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          ✓ {statusMessage}
        </div>
      )}

      {/* Channel Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
        {[
          { key: 'executive_email', label: '✉️ Executive Email' },
          { key: 'linkedin', label: '🔗 LinkedIn InMail' },
          { key: 'whatsapp', label: '💬 WhatsApp Direct' },
          { key: 'phone', label: '📞 Phone Script' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveChannel(tab.key as OutreachChannel)}
            className={`filter-chip ${activeChannel === tab.key ? 'active' : ''}`}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: activeChannel === tab.key ? '#fff' : 'transparent',
              color: activeChannel === tab.key ? '#000' : '#888',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 2fr) minmax(280px, 1fr)', gap: '1.5rem' }}>
        {/* Editor Area */}
        <div className="admin-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>
              {currentDraft.channelTitle}
            </h2>
            <div>{getApprovalBadge(currentDraft.approval_state)}</div>
          </div>

          {currentDraft.subject !== undefined && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: '#888', marginBottom: '0.35rem' }}>
                Subject Line
              </label>
              <input
                type="text"
                value={currentDraft.subject}
                onChange={e => handleSubjectChange(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.75rem', background: '#0a0d13', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', fontSize: '0.9rem' }}
              />
            </div>
          )}

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: '#888', marginBottom: '0.35rem' }}>
              Message Body (Editable)
            </label>
            <textarea
              rows={12}
              value={currentDraft.message}
              onChange={e => handleMessageChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#0a0d13',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                borderRadius: '4px',
                fontSize: '0.88rem',
                lineHeight: 1.6,
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Action Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
            <button
              onClick={handleCopy}
              className="action-btn secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              {copied ? '✓ Copied to Clipboard!' : '📋 Copy Message'}
            </button>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleSaveState('draft')}
                disabled={isSubmitting}
                className="action-btn secondary"
                style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
              >
                Save Draft
              </button>

              <button
                onClick={() => handleSaveState('ready_for_review')}
                disabled={isSubmitting}
                className="action-btn secondary"
                style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', color: '#38bdf8' }}
              >
                Ready for Review
              </button>

              <button
                onClick={() => handleSaveState('approved')}
                disabled={isSubmitting}
                className="action-btn primary"
                style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem', background: '#22c55e', color: '#000', fontWeight: 700 }}
              >
                ✓ Mark Approved
              </button>

              {currentDraft.approval_state === 'approved' && (
                <button
                  onClick={() => handleSaveState('sent')}
                  disabled={isSubmitting}
                  className="action-btn primary"
                  style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem', background: '#3b82f6', color: '#fff', fontWeight: 700 }}
                >
                  🚀 Mark Sent & Log
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Intelligence Sidebar: Facts & Why */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Why this message */}
          <div className="admin-card">
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: '0.5rem', fontWeight: 600 }}>
              STRATEGIC RATIONALE
            </div>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
              {currentDraft.whyThisMessage}
            </p>
          </div>

          {/* Facts Used */}
          <div className="admin-card">
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: '0.5rem', fontWeight: 600 }}>
              VERIFIED FACTS REFERENCED
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.8rem', color: '#aaa', lineHeight: 1.6 }}>
              {currentDraft.factsUsed.map((fact, idx) => (
                <li key={idx}>✓ {fact}</li>
              ))}
            </ul>
          </div>

          {/* Target CTA */}
          <div className="admin-card">
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: '0.5rem', fontWeight: 600 }}>
              RECOMMENDED CTA
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8' }}>
              &quot;{currentDraft.cta}&quot;
            </div>
          </div>

          {/* Compliance & Approval Barrier Notice */}
          <div className="admin-card" style={{ background: 'rgba(255,255,255,0.02)', fontSize: '0.75rem', color: '#666', lineHeight: 1.4 }}>
            🔒 <strong>Approval Barrier:</strong> Only messages in <em>APPROVED</em> state may be marked as SENT. All outreach events automatically generate permanent audit trails.
          </div>
        </div>
      </div>
    </div>
  );
}
