'use client';

import {FormEvent, useState} from 'react';
import Link from 'next/link';

type Claim = {
  id: string;
  company_slug: string;
  claimant_name: string;
  claimant_company?: string | null;
  email: string;
  phone?: string | null;
  role?: string | null;
  website?: string | null;
  message?: string | null;
  claim_status?: string | null;
  status?: string | null;
  reviewer_notes?: string | null;
  reviewed_at?: string | null;
  created_at: string;
};

type Company = {
  id: string;
  name: string;
  slug: string;
};

export function ClaimDetailView({
  initialClaim,
  company
}: {
  initialClaim: Claim;
  company: Company | null;
}) {
  const [claim, setClaim] = useState<Claim>(initialClaim);
  const [reviewerNotes, setReviewerNotes] = useState(claim.reviewer_notes || '');
  const [notice, setNotice] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; msg: string }>({
    type: 'idle',
    msg: ''
  });

  const currentStatus = claim.claim_status || claim.status || 'new';

  async function updateClaimStatus(newStatus: string) {
    if (newStatus === 'rejected' && !window.confirm('Are you sure you want to reject this profile claim?')) {
      return;
    }
    if (newStatus === 'approved' && !window.confirm(`Approve claim and grant ownership of ${company?.name || claim.company_slug}?`)) {
      return;
    }

    setNotice({ type: 'loading', msg: `Updating claim to ${newStatus.toUpperCase()}…` });
    try {
      const res = await fetch(`/api/admin/profile_claims/${claim.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claim_status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewer_notes: reviewerNotes
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: 'error', msg: data.error || 'Failed to update claim.' });
        return;
      }
      setClaim({ ...claim, claim_status: newStatus, reviewed_at: new Date().toISOString() });
      setNotice({ type: 'success', msg: `Claim status changed to ${newStatus.toUpperCase().replace('_', ' ')}.` });
    } catch {
      setNotice({ type: 'error', msg: 'Network error updating claim.' });
    }
  }

  async function saveNotes(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNotice({ type: 'loading', msg: 'Saving review notes…' });
    try {
      const res = await fetch(`/api/admin/profile_claims/${claim.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewer_notes: reviewerNotes })
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: 'error', msg: data.error || 'Failed to save review notes.' });
        return;
      }
      setClaim({ ...claim, reviewer_notes: reviewerNotes });
      setNotice({ type: 'success', msg: 'Review notes recorded.' });
    } catch {
      setNotice({ type: 'error', msg: 'Network error.' });
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin/claims" className="btn">
          ← Back to All Profile Claims
        </Link>
        {company && (
          <a
            href={`/companies/${company.slug}`}
            target="_blank"
            rel="noreferrer"
            className="btn"
            style={{ fontSize: 13 }}
          >
            View Company Profile ↗
          </a>
        )}
      </div>

      <div className="eyebrow">Profile Ownership Verification</div>
      <h1 className="admin-title" style={{ marginBottom: 8 }}>
        CLAIM FOR {company?.name?.toUpperCase() || claim.company_slug.toUpperCase()}
      </h1>
      <p style={{ color: '#aaa9a1', fontSize: 14, marginBottom: 24 }}>
        Submitted on {new Date(claim.created_at).toLocaleDateString()} by {claim.claimant_name}
      </p>

      {notice.msg && (
        <div
          style={{
            padding: '10px 14px',
            marginBottom: 16,
            fontSize: 13,
            borderRadius: 4,
            background: notice.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            color: notice.type === 'error' ? '#fca5a5' : '#86efac',
            border: `1px solid ${notice.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
          }}
        >
          {notice.msg}
        </div>
      )}

      {/* Actions Workflow Bar */}
      <section className="admin-panel" style={{ marginBottom: 24 }}>
        <div className="eyebrow">Claim Decision Workflow</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn"
            style={{
              background: currentStatus === 'under_review' ? '#3b82f6' : '#141715',
              color: '#fff',
              borderColor: currentStatus === 'under_review' ? '#3b82f6' : '#333'
            }}
            onClick={() => updateClaimStatus('under_review')}
          >
            Mark Under Review
          </button>
          <button
            type="button"
            className="btn"
            style={{
              background: currentStatus === 'approved' ? '#10b981' : '#141715',
              color: '#fff',
              borderColor: currentStatus === 'approved' ? '#10b981' : '#333'
            }}
            onClick={() => updateClaimStatus('approved')}
          >
            ✓ Approve Claim
          </button>
          <button
            type="button"
            className="btn"
            style={{
              background: currentStatus === 'rejected' ? '#ef4444' : '#141715',
              color: '#fff',
              borderColor: currentStatus === 'rejected' ? '#ef4444' : '#333'
            }}
            onClick={() => updateClaimStatus('rejected')}
          >
            ✕ Reject Claim
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setReviewerNotes(prev => (prev ? `${prev}\n[Requested more verification details]` : '[Requested more verification details]'));
              updateClaimStatus('under_review');
            }}
          >
            Request Information
          </button>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {/* Claimant Info */}
        <section className="admin-panel">
          <div className="eyebrow">Claimant Details</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
            <div>
              <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#888', display: 'block' }}>
                Full Name & Role
              </span>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>
                {claim.claimant_name} {claim.role ? `· ${claim.role}` : ''}
              </div>
            </div>
            <div>
              <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#888', display: 'block' }}>Official Email</span>
              <a href={`mailto:${claim.email}`} style={{ color: '#d4af37', fontSize: 14 }}>
                {claim.email}
              </a>
            </div>
            {claim.phone && (
              <div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#888', display: 'block' }}>Phone</span>
                <a href={`tel:${claim.phone}`} style={{ color: '#fff', fontSize: 14 }}>
                  {claim.phone}
                </a>
              </div>
            )}
            {claim.website && (
              <div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#888', display: 'block' }}>
                  Submitted Website / Proof URL
                </span>
                <a href={claim.website} target="_blank" rel="noreferrer" style={{ color: '#d4af37', fontSize: 14 }}>
                  {claim.website} ↗
                </a>
              </div>
            )}
            {claim.message && (
              <div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 4 }}>
                  Verification Statement / Message
                </span>
                <div style={{ background: '#0a0c0b', padding: 12, borderRadius: 4, fontSize: 13, color: '#e5e5e5', lineHeight: 1.6 }}>
                  {claim.message}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Reviewer Internal Notes */}
        <section className="admin-panel">
          <div className="eyebrow">Audit & Verification Notes</div>
          <h2 style={{ marginTop: 6, marginBottom: 14 }}>INTERNAL REVIEW NOTES</h2>

          <form onSubmit={saveNotes}>
            <label>
              <span className="form-label">Review Log</span>
              <textarea
                value={reviewerNotes}
                onChange={e => setReviewerNotes(e.target.value)}
                placeholder="Record domain email check, company registry match, or phone verification call results…"
                rows={6}
              />
            </label>
            <div style={{ marginTop: 12 }}>
              <button type="submit" className="btn fill" disabled={notice.type === 'loading'}>
                Save Review Notes
              </button>
            </div>
          </form>

          {claim.reviewed_at && (
            <div style={{ marginTop: 20, fontSize: 12, color: '#888', borderTop: '1px solid #222', paddingTop: 12 }}>
              Last reviewed: {new Date(claim.reviewed_at).toLocaleString()}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
