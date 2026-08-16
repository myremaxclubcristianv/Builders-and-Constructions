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
      <div className="admin-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '0.25rem' }}>
              EXECUTIVE CONTACTS REGISTRY · PHASE 10
            </div>
            <h1 style={{ margin: '0 0 0.35rem 0', fontSize: '1.85rem', fontWeight: 700 }}>
              {company.name} · Decision Makers
            </h1>
            <p className="admin-subtitle" style={{ margin: 0 }}>
              Verified leadership, directors, founders, and commercial authority contacts.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link href={`/admin/companies/${company.id}/acquisition`} className="action-btn secondary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}>
              ← Sales Briefing
            </Link>
            {!isAdding && !isEditing && (
              <button
                onClick={() => setIsAdding(true)}
                className="action-btn primary"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
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
          <div className="admin-card" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#888' }}>
            No decision makers registered for this company yet. Click &quot;+ Add Decision Maker&quot; to index executive contacts.
          </div>
        ) : (
          decisionMakers.map(dm => (
            <div
              key={dm.id || dm.name}
              className="admin-card"
              style={{
                borderLeft: `4px solid ${dm.is_primary ? '#22c55e' : '#64748b'}`,
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                      {dm.name}
                    </h3>
                    <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>
                      {dm.role}
                    </span>
                    {dm.is_primary && (
                      <span className="status-pill verified" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', fontWeight: 700 }}>
                        ★ PRIMARY DECISION MAKER
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.82rem', color: '#888', marginTop: '0.35rem' }}>
                    {dm.phone && <span>📞 <strong>{dm.phone}</strong></span>}
                    {dm.email && <span>✉️ <strong>{dm.email}</strong></span>}
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

              {/* Source & Notes */}
              {(dm.source || dm.notes) && (
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '4px', margin: '0.75rem 0', fontSize: '0.8rem', color: '#cbd5e1' }}>
                  {dm.source && (
                    <div style={{ marginBottom: dm.notes ? '0.35rem' : 0 }}>
                      <strong style={{ color: '#888' }}>Source:</strong> {dm.source}{' '}
                      {dm.source_url && (
                        <a href={dm.source_url} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>
                          [link]
                        </a>
                      )}
                      {dm.verified_at && <span style={{ color: '#666', marginLeft: '0.5rem' }}>(Verified: {new Date(dm.verified_at).toLocaleDateString()})</span>}
                    </div>
                  )}
                  {dm.notes && <div><strong style={{ color: '#888' }}>Notes:</strong> {dm.notes}</div>}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
                {!dm.is_primary && (
                  <button
                    onClick={() => handleSetPrimary(dm)}
                    className="action-btn secondary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                  >
                    ★ Set as Primary
                  </button>
                )}
                <button
                  onClick={() => startEdit(dm)}
                  className="action-btn secondary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                >
                  ✎ Edit
                </button>
                <button
                  onClick={() => handleArchive(dm)}
                  className="action-btn secondary"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: '#ef4444' }}
                >
                  ✕ Archive
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
