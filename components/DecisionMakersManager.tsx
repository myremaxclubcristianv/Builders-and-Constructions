'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type DecisionMakerRecord = {
  id?: string;
  company_id: string;
  name: string;
  role: string;
  email?: string | null;
  phone?: string | null;
  linkedin_url?: string | null;
  source?: string | null;
  source_url?: string | null;
  verification_state: 'unverified' | 'publicly_verified' | 'company_verified' | 'confirmed_by_contact';
  verified_at?: string | null;
  notes?: string | null;
  is_primary?: boolean;
  status: 'active' | 'archived';
};

const ROLES_LIST = [
  'Managing Director',
  'CEO',
  'Founder',
  'Commercial Director',
  'Development Director',
  'Project Director',
  'Marketing Director',
  'Business Development',
  'General Counsel',
  'Other'
];

export function DecisionMakersManager({
  company,
  initialDecisionMakers
}: {
  company: { id: string; name: string; slug: string; city?: string };
  initialDecisionMakers: DecisionMakerRecord[];
}) {
  const [decisionMakers, setDecisionMakers] = useState<DecisionMakerRecord[]>(initialDecisionMakers);
  const [isEditing, setIsEditing] = useState<DecisionMakerRecord | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('Managing Director');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formLinkedIn, setFormLinkedIn] = useState('');
  const [formSource, setFormSource] = useState('');
  const [formSourceUrl, setFormSourceUrl] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formVerificationState, setFormVerificationState] = useState<DecisionMakerRecord['verification_state']>('unverified');
  const [formIsPrimary, setFormIsPrimary] = useState(false);

  const resetForm = () => {
    setFormName('');
    setFormRole('Managing Director');
    setFormEmail('');
    setFormPhone('');
    setFormLinkedIn('');
    setFormSource('');
    setFormSourceUrl('');
    setFormNotes('');
    setFormVerificationState('unverified');
    setFormIsPrimary(false);
    setIsEditing(null);
    setIsAdding(false);
  };

  const startEdit = (dm: DecisionMakerRecord) => {
    setIsEditing(dm);
    setIsAdding(false);
    setFormName(dm.name);
    setFormRole(dm.role);
    setFormEmail(dm.email || '');
    setFormPhone(dm.phone || '');
    setFormLinkedIn(dm.linkedin_url || '');
    setFormSource(dm.source || '');
    setFormSourceUrl(dm.source_url || '');
    setFormNotes(dm.notes || '');
    setFormVerificationState(dm.verification_state || 'unverified');
    setFormIsPrimary(Boolean(dm.is_primary));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    const payload = {
      id: isEditing?.id,
      company_id: company.id,
      name: formName.trim(),
      role: formRole,
      email: formEmail.trim() || null,
      phone: formPhone.trim() || null,
      linkedin_url: formLinkedIn.trim() || null,
      source: formSource.trim() || null,
      source_url: formSourceUrl.trim() || null,
      notes: formNotes.trim() || null,
      verification_state: formVerificationState,
      verified_at: formVerificationState !== 'unverified' ? new Date().toISOString() : null,
      is_primary: formIsPrimary,
      status: 'active'
    };

    try {
      const res = await fetch('/api/admin/decision-makers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const saved = await res.json();
        if (isEditing) {
          setDecisionMakers(prev => prev.map(item => (item.id === saved.id ? saved : formIsPrimary ? { ...item, is_primary: false } : item)));
          setStatusMessage(`Updated decision maker: ${saved.name}`);
        } else {
          setDecisionMakers(prev => [saved, ...(formIsPrimary ? prev.map(p => ({ ...p, is_primary: false })) : prev)]);
          setStatusMessage(`Added decision maker: ${saved.name}`);
        }
        resetForm();
      } else {
        const errData = await res.json();
        alert(`Error saving decision maker: ${errData.error || 'Request failed'}`);
      }
    } catch (err: any) {
      console.error('Error saving decision maker:', err);
      alert('Failed to save decision maker. Check network and database connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetPrimary = async (dm: DecisionMakerRecord) => {
    if (!dm.id) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/decision-makers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dm,
          is_primary: true
        })
      });
      if (res.ok) {
        setDecisionMakers(prev =>
          prev.map(item => ({
            ...item,
            is_primary: item.id === dm.id
          }))
        );
        setStatusMessage(`Set ${dm.name} as Primary Decision Maker.`);
      }
    } catch (e) {
      console.error('Failed to set primary:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchive = async (dm: DecisionMakerRecord) => {
    if (!dm.id || !confirm(`Archive decision maker ${dm.name}?`)) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/decision-makers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dm,
          status: 'archived'
        })
      });
      if (res.ok) {
        setDecisionMakers(prev => prev.filter(item => item.id !== dm.id));
        setStatusMessage(`Archived ${dm.name}.`);
      }
    } catch (e) {
      console.error('Failed to archive:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVerificationBadge = (state: string) => {
    switch (state) {
      case 'confirmed_by_contact':
        return <span className="status-pill verified" style={{ background: 'rgba(34, 197, 94, 0.15)' }}>CONFIRMED BY CONTACT</span>;
      case 'company_verified':
        return <span className="status-pill verified">COMPANY VERIFIED</span>;
      case 'publicly_verified':
        return <span className="status-pill" style={{ color: '#38bdf8', borderColor: '#38bdf8' }}>PUBLICLY VERIFIED</span>;
      default:
        return <span className="status-pill unverified">UNVERIFIED</span>;
    }
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#c7a675', fontWeight: 800 }}>
              CONTACT VERIFICATION WORKBENCH · LEVEL 04 ENRICHMENT
            </div>
            <h1 style={{ margin: '4px 0 6px 0', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, color: '#f3f1eb' }}>
              {company.name} · Decision Maker Verification
            </h1>
            <p className="admin-subtitle" style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(243,241,235,0.7)' }}>
              Deterministic 4-level contact verification workflow (`LEVEL 01 → LEVEL 02 → LEVEL 03 → LEVEL 04`). Direct outreach requires confirmed Level 03+ provenance.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link href={`/admin/companies/${company.id}/acquisition`} className="action-btn secondary" style={{ minHeight: 44, fontSize: '0.78rem' }}>
              ← Sales Briefing
            </Link>
            {!isAdding && !isEditing && (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="action-btn primary"
                style={{ minHeight: 44, fontSize: '0.78rem' }}
              >
                + Add Decision Maker
              </button>
            )}
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="admin-card" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', color: '#22c55e', padding: '0.75rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          ✓ {statusMessage}
        </div>
      )}

      {/* Add / Edit Form Modal/Drawer */}
      {(isAdding || isEditing) && (
        <div className="admin-card" style={{ background: '#131922', border: '1px solid #38bdf8', marginBottom: '2rem', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', margin: '0 0 1.25rem 0', fontWeight: 700 }}>
            {isEditing ? `Edit Decision Maker: ${isEditing.name}` : 'Add New Decision Maker'}
          </h2>

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', marginBottom: '0.35rem' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cristian Erbașu"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', background: '#0a0d13', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', marginBottom: '0.35rem' }}>
                  Executive Role *
                </label>
                <select
                  value={formRole}
                  onChange={e => setFormRole(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', background: '#0a0d13', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px' }}
                >
                  {ROLES_LIST.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', marginBottom: '0.35rem' }}>
                  Direct Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+40 21 232 3000"
                  value={formPhone}
                  onChange={e => setFormPhone(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', background: '#0a0d13', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', marginBottom: '0.35rem' }}>
                  Executive Email
                </label>
                <input
                  type="email"
                  placeholder="office@company.ro"
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', background: '#0a0d13', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', marginBottom: '0.35rem' }}>
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/profile"
                  value={formLinkedIn}
                  onChange={e => setFormLinkedIn(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', background: '#0a0d13', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', marginBottom: '0.35rem' }}>
                  Verification State
                </label>
                <select
                  value={formVerificationState}
                  onChange={e => setFormVerificationState(e.target.value as any)}
                  style={{ width: '100%', padding: '0.5rem', background: '#0a0d13', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px' }}
                >
                  <option value="unverified">UNVERIFIED (Internal research only)</option>
                  <option value="publicly_verified">PUBLICLY VERIFIED (LinkedIn, Press, Registry)</option>
                  <option value="company_verified">COMPANY VERIFIED (Official Website, Corporate filing)</option>
                  <option value="confirmed_by_contact">CONFIRMED BY CONTACT (Direct Call / Discussion)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', marginBottom: '0.35rem' }}>
                  Evidence Source Citation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Official Corporate Registry / Press Release"
                  value={formSource}
                  onChange={e => setFormSource(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', background: '#0a0d13', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', marginBottom: '0.35rem' }}>
                  Source URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formSourceUrl}
                  onChange={e => setFormSourceUrl(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', background: '#0a0d13', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', marginBottom: '0.35rem' }}>
                Executive Intelligence Notes
              </label>
              <textarea
                rows={2}
                placeholder="Key context, commercial authority, preferred contact times..."
                value={formNotes}
                onChange={e => setFormNotes(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', background: '#0a0d13', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formIsPrimary}
                  onChange={e => setFormIsPrimary(e.target.checked)}
                />
                <span>Set as <strong>Primary Decision Maker</strong> for this company</span>
              </label>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={resetForm}
                  className="action-btn secondary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="action-btn primary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Decision Maker'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Decision Makers List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {decisionMakers.length === 0 ? (
          <div className="admin-card" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(243,241,235,0.6)' }}>
            No decision makers registered for this company yet. Click &quot;+ Add Decision Maker&quot; to index executive contacts.
          </div>
        ) : (
          decisionMakers.map(dm => {
            const hasPhone = Boolean(dm.phone);
            const hasEmail = Boolean(dm.email);
            const isConfirmed = dm.verification_state === 'confirmed_by_contact';
            const isCompanyVerified = dm.verification_state === 'company_verified';
            const isPubliclyVerified = dm.verification_state === 'publicly_verified';

            let currentLevel = 'LEVEL 01';
            let nextRequiredLevel = 'LEVEL 02 REQUIRED';
            if (isConfirmed || (hasPhone && hasEmail && isCompanyVerified)) {
              currentLevel = 'LEVEL 04';
              nextRequiredLevel = 'FULLY VERIFIED (LEVEL 04)';
            } else if (hasPhone || hasEmail || isCompanyVerified) {
              currentLevel = 'LEVEL 03';
              nextRequiredLevel = 'LEVEL 04 REQUIRED (CONFIRMED DIRECT CHANNEL)';
            } else if (isPubliclyVerified) {
              currentLevel = 'LEVEL 02';
              nextRequiredLevel = 'LEVEL 03 REQUIRED (COMPANY VERIFICATION)';
            }

            return (
              <div
                key={dm.id || dm.name}
                className="admin-card"
                style={{
                  borderLeft: `4px solid ${dm.is_primary ? '#22c55e' : '#c7a675'}`,
                  padding: '1.25rem',
                  background: 'rgba(13,16,15,0.95)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <span className="status-pill verified" style={{ fontSize: '0.62rem', background: currentLevel === 'LEVEL 04' ? '#22c55e' : '#c7a675', color: '#070908', fontWeight: 900 }}>
                        {currentLevel}
                      </span>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#f3f1eb' }}>
                        {dm.name}
                      </h3>
                      <span style={{ fontSize: '0.85rem', color: 'rgba(243,241,235,0.7)', fontWeight: 600 }}>
                        {dm.role}
                      </span>
                      {dm.is_primary && (
                        <span className="status-pill verified" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', fontWeight: 800, fontSize: '0.6rem' }}>
                          ★ PRIMARY DECISION MAKER
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: 'rgba(243,241,235,0.8)', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                      <span>📞 Phone: {dm.phone ? <strong style={{ color: '#22c55e' }}>{dm.phone}</strong> : <span style={{ color: '#eab308' }}>NOT AVAILABLE (LEVEL 04 GAP)</span>}</span>
                      <span>✉️ Email: {dm.email ? <strong style={{ color: '#38bdf8' }}>{dm.email}</strong> : <span style={{ color: '#eab308' }}>NOT AVAILABLE</span>}</span>
                      {dm.linkedin_url && (
                        <a href={dm.linkedin_url} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none' }}>
                          🔗 LinkedIn Profile ↗
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    {getVerificationBadge(dm.verification_state)}
                  </div>
                </div>

                {/* Provenance & Gap Diagnostics */}
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '4px', margin: '0.75rem 0', fontSize: '0.78rem', border: '1px solid rgba(244,242,235,0.06)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
                    <div>
                      <strong style={{ color: '#c7a675', display: 'block', fontSize: '0.62rem', textTransform: 'uppercase' }}>PROVENANCE SOURCE:</strong>
                      <span style={{ color: '#f3f1eb' }}>{dm.source || 'Primary Corporate Filing / Registry'}</span>
                      {dm.source_url && (
                        <a href={dm.source_url} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', marginLeft: 6 }}>
                          [evidence]
                        </a>
                      )}
                    </div>
                    <div>
                      <strong style={{ color: '#eab308', display: 'block', fontSize: '0.62rem', textTransform: 'uppercase' }}>VERIFICATION GAP:</strong>
                      <span style={{ color: currentLevel === 'LEVEL 04' ? '#22c55e' : '#eab308', fontWeight: 700 }}>
                        {nextRequiredLevel}
                      </span>
                    </div>
                    <div>
                      <strong style={{ color: '#a855f7', display: 'block', fontSize: '0.62rem', textTransform: 'uppercase' }}>LAST VERIFIED:</strong>
                      <span style={{ color: '#f3f1eb' }}>{dm.verified_at ? new Date(dm.verified_at).toLocaleDateString() : 'Pending verification audit'}</span>
                    </div>
                  </div>
                  {dm.notes && <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid rgba(244,242,235,0.06)', color: 'rgba(243,241,235,0.7)' }}><strong>Notes:</strong> {dm.notes}</div>}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem', borderTop: '1px solid rgba(244,242,235,0.06)', paddingTop: '0.75rem' }}>
                  {!dm.is_primary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(dm)}
                      className="action-btn secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', minHeight: 38 }}
                    >
                      ★ Set as Primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => startEdit(dm)}
                    className="action-btn secondary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', minHeight: 38 }}
                  >
                    ✎ Edit / Verify
                  </button>
                  <button
                    type="button"
                    onClick={() => handleArchive(dm)}
                    className="action-btn secondary"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: '#ef4444', minHeight: 38 }}
                  >
                    ✕ Archive
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
