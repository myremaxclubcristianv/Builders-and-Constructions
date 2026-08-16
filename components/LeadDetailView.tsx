'use client';

import {FormEvent, useState} from 'react';
import Link from 'next/link';

type LeadNote = {
  id: string;
  lead_id: string;
  author_id?: string | null;
  author_name?: string | null;
  body: string;
  created_at: string;
  updated_at?: string | null;
};

type Lead = {
  id: string;
  lead_type: string;
  request_type?: string | null;
  name: string;
  company_name?: string | null;
  email: string;
  phone?: string | null;
  message?: string | null;
  source: string;
  status: string;
  company_id?: string | null;
  project_id?: string | null;
  assigned_to?: string | null;
  last_contacted_at?: string | null;
  next_action?: string | null;
  created_at: string;
};

const LEAD_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'converted', label: 'Converted' },
  { value: 'closed', label: 'Closed' }
];

type ConnectedCompany = {
  id: string;
  name: string;
  slug: string;
  type: string;
  location?: string | null;
};

type ConnectedOpportunity = {
  opportunity?: string | null;
  opportunity_score?: number | null;
  pipeline_status?: string | null;
  recommended_services?: string[] | null;
  signals?: string[] | null;
};

export function LeadDetailView({
  initialLead,
  initialNotes,
  connectedCompany,
  connectedOpportunity
}: {
  initialLead: Lead;
  initialNotes: LeadNote[];
  connectedCompany?: ConnectedCompany | null;
  connectedOpportunity?: ConnectedOpportunity | null;
}) {
  const [lead, setLead] = useState<Lead>(initialLead);
  const [notes, setNotes] = useState<LeadNote[]>(initialNotes);
  const [newNoteBody, setNewNoteBody] = useState('');
  const [editingNote, setEditingNote] = useState<LeadNote | null>(null);
  const [notice, setNotice] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; msg: string }>({
    type: 'idle',
    msg: ''
  });

  async function updateStatus(newStatus: string) {
    setNotice({ type: 'loading', msg: 'Updating pipeline status…' });
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          last_contacted_at: newStatus === 'contacted' ? new Date().toISOString() : lead.last_contacted_at
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: 'error', msg: data.error || 'Failed to update status.' });
        return;
      }
      setLead({ ...lead, status: newStatus });
      setNotice({ type: 'success', msg: `Lead status updated to ${newStatus.toUpperCase()}.` });
    } catch {
      setNotice({ type: 'error', msg: 'Network error updating lead status.' });
    }
  }

  async function updateLeadDetails(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const lastContacted = f.get('lastContacted') ? new Date(String(f.get('lastContacted'))).toISOString() : null;
    const nextAction = String(f.get('nextAction') || '');
    const assignedTo = String(f.get('assignedTo') || '') || null;

    setNotice({ type: 'loading', msg: 'Saving lead details…' });
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          last_contacted_at: lastContacted,
          next_action: nextAction,
          assigned_to: assignedTo
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: 'error', msg: data.error || 'Failed to save changes.' });
        return;
      }
      setLead({
        ...lead,
        last_contacted_at: lastContacted,
        next_action: nextAction,
        assigned_to: assignedTo
      });
      setNotice({ type: 'success', msg: 'Lead details updated.' });
    } catch {
      setNotice({ type: 'error', msg: 'Failed to update lead details.' });
    }
  }

  async function handleAddNote(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newNoteBody.trim()) return;

    setNotice({ type: 'loading', msg: 'Adding private note…' });
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNoteBody })
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: 'error', msg: data.error || 'Failed to add note.' });
        return;
      }
      setNotes([data, ...notes]);
      setNewNoteBody('');
      setNotice({ type: 'success', msg: 'Private note saved.' });
    } catch {
      setNotice({ type: 'error', msg: 'Network error adding note.' });
    }
  }

  async function handleSaveEditedNote(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingNote) return;

    setNotice({ type: 'loading', msg: 'Updating note…' });
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/notes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId: editingNote.id, content: editingNote.body })
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: 'error', msg: data.error || 'Failed to update note.' });
        return;
      }
      setNotes(notes.map(n => (n.id === editingNote.id ? { ...n, ...data } : n)));
      setEditingNote(null);
      setNotice({ type: 'success', msg: 'Note updated.' });
    } catch {
      setNotice({ type: 'error', msg: 'Failed to update note.' });
    }
  }

  async function handleDeleteNote(note: LeadNote) {
    if (!window.confirm('Delete this private note?')) return;
    setNotice({ type: 'loading', msg: 'Deleting note…' });
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/notes?noteId=${note.id}`, { method: 'DELETE' });
      if (!res.ok) {
        setNotice({ type: 'error', msg: 'Failed to delete note.' });
        return;
      }
      setNotes(notes.filter(n => n.id !== note.id));
      setNotice({ type: 'success', msg: 'Note removed.' });
    } catch {
      setNotice({ type: 'error', msg: 'Network error.' });
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Link href="/admin/leads" className="btn">
          ← Back to All Leads
        </Link>
      </div>

      <div className="eyebrow">Lead Management & CRM</div>
      <h1 className="admin-title" style={{ marginBottom: 8 }}>
        {lead.name.toUpperCase()}
      </h1>
      <p style={{ color: '#aaa9a1', fontSize: 14, marginBottom: 20 }}>
        {lead.company_name ? `${lead.company_name} · ` : ''}Source: {lead.source.replaceAll('_', ' ')} · Created{' '}
        {new Date(lead.created_at).toLocaleDateString()}
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

      {/* Visual Pipeline Bar */}
      <section className="admin-panel" style={{ marginBottom: 24 }}>
        <div className="eyebrow">Pipeline Status</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          {LEAD_STATUSES.map(st => {
            const active = lead.status === st.value;
            return (
              <button
                key={st.value}
                type="button"
                className="btn"
                style={{
                  background: active ? '#d4af37' : '#141715',
                  color: active ? '#000' : '#fff',
                  fontWeight: active ? 700 : 500,
                  borderColor: active ? '#d4af37' : '#333'
                }}
                onClick={() => updateStatus(st.value)}
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* How Did This Lead Arrive & Connected Opportunity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>
        {/* Source Attribution Panel */}
        <div style={{ background: '#141715', border: '1px solid #262927', borderRadius: 8, padding: 20 }}>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            Inbound Attribution & Journey
          </div>
          <h3 style={{ fontSize: 16, margin: '6px 0 10px 0', textTransform: 'uppercase' }}>
            HOW DID THIS LEAD ARRIVE?
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 4,
                background: 'rgba(212, 175, 55, 0.15)',
                color: '#d4af37',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                textTransform: 'uppercase'
              }}
            >
              {lead.source.replaceAll('_', ' ')}
            </span>
          </div>
          <p style={{ fontSize: 12, color: '#aaa9a1', marginTop: 10, marginBottom: 0, lineHeight: 1.5 }}>
            {lead.source === 'promote_company'
              ? 'Converted via public /promote-company capability intake.'
              : lead.source === 'promote_project'
              ? 'Converted via public /promote-project stakeholder showcase.'
              : lead.source === 'claim_profile'
              ? 'Submitted profile claim and stakeholder verification.'
              : lead.source === 'work_with_company'
              ? `Inquired directly on company profile page for ${lead.company_name || 'practice'}.`
              : 'Direct inbound organic submission.'}
          </p>
        </div>

        {/* Connected Opportunity Panel */}
        {connectedCompany && (
          <div
            style={{
              background: '#141715',
              border: '1px solid rgba(212, 175, 55, 0.5)',
              borderRadius: 8,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div className="eyebrow" style={{ color: '#86efac' }}>
                Sales Opportunity Intelligence
              </div>
              <h3 style={{ fontSize: 16, margin: '6px 0 6px 0' }}>
                CONNECTED TO: {connectedCompany.name.toUpperCase()}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: 3,
                    background: connectedOpportunity?.opportunity === 'high' ? '#86efac' : '#fde047',
                    color: '#000'
                  }}
                >
                  {connectedOpportunity?.opportunity?.toUpperCase() || 'HIGH'} OPPORTUNITY
                </span>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>
                  {connectedOpportunity?.opportunity_score ?? 80} / 100
                </span>
              </div>

              {connectedOpportunity?.recommended_services && connectedOpportunity.recommended_services.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                  {connectedOpportunity.recommended_services.map((srv, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 10,
                        padding: '2px 6px',
                        background: '#0d0f0e',
                        border: '1px solid #333',
                        color: '#d4af37',
                        borderRadius: 3
                      }}
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: 14 }}>
              <Link href={`/admin/opportunities/${connectedCompany.id}`} className="btn fill" style={{ fontSize: 11, padding: '8px 14px' }}>
                OPEN OPPORTUNITY WORKSTATION →
              </Link>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {/* Contact Info & Details */}
        <section className="admin-panel">
          <div className="eyebrow">Contact Information</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
            <div>
              <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#888', display: 'block' }}>Email</span>
              <a href={`mailto:${lead.email}`} style={{ color: '#d4af37', fontSize: 14 }}>
                {lead.email}
              </a>
            </div>
            {lead.phone && (
              <div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#888', display: 'block' }}>Phone</span>
                <a href={`tel:${lead.phone}`} style={{ color: '#fff', fontSize: 14 }}>
                  {lead.phone}
                </a>
              </div>
            )}
            <div>
              <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#888', display: 'block' }}>
                Lead Type
              </span>
              <span className="tag" style={{ textTransform: 'none' }}>
                {lead.lead_type.replaceAll('_', ' ')}
              </span>
            </div>
            {lead.message && (
              <div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 4 }}>
                  Submitted Message
                </span>
                <div style={{ background: '#0a0c0b', padding: 12, borderRadius: 4, fontSize: 13, color: '#e5e5e5', lineHeight: 1.6 }}>
                  {lead.message}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={updateLeadDetails} style={{ marginTop: 24, borderTop: '1px solid #222', paddingTop: 16 }}>
            <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: '#fff', marginBottom: 12 }}>Sales Follow-up</h4>
            <div className="form-grid">
              <label>
                <span className="form-label">Next Action</span>
                <input name="nextAction" defaultValue={lead.next_action || ''} placeholder="e.g. Schedule call" />
              </label>
              <label>
                <span className="form-label">Last Contacted Date</span>
                <input
                  name="lastContacted"
                  type="date"
                  defaultValue={lead.last_contacted_at ? lead.last_contacted_at.slice(0, 10) : ''}
                />
              </label>
              <div className="full">
                <button type="submit" className="btn fill" disabled={notice.type === 'loading'}>
                  Update Follow-up Info
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Private Notes Section */}
        <section className="admin-panel">
          <div className="eyebrow">Internal Collaboration</div>
          <h2 style={{ marginTop: 6, marginBottom: 14 }}>PRIVATE NOTES (ADMIN & SALES ONLY)</h2>

          {/* Add Note Form */}
          <form onSubmit={handleAddNote} style={{ marginBottom: 20 }}>
            <label>
              <span className="form-label">Add Note</span>
              <textarea
                value={newNoteBody}
                onChange={e => setNewNoteBody(e.target.value)}
                placeholder="Log call summary, client requirements, or next steps…"
                rows={3}
                required
              />
            </label>
            <div style={{ marginTop: 8 }}>
              <button type="submit" className="btn fill" disabled={!newNoteBody.trim() || notice.type === 'loading'}>
                Save Note
              </button>
            </div>
          </form>

          {/* Notes Feed */}
          {notes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {notes.map(n => (
                <div
                  key={n.id}
                  style={{
                    background: '#141715',
                    border: '1px solid #262927',
                    borderRadius: 6,
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#d4af37' }}>
                      {n.author_name || 'Sales Team'}
                    </span>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#888' }}>
                        {new Date(n.created_at).toLocaleString()}
                      </span>
                      <button
                        type="button"
                        className="btn"
                        style={{ padding: '2px 6px', fontSize: 10 }}
                        onClick={() => setEditingNote(n)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn"
                        style={{ padding: '2px 6px', fontSize: 10, color: '#fca5a5' }}
                        onClick={() => handleDeleteNote(n)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: '#e5e5e5', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    {n.body}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty" style={{ padding: '16px 0' }}>
              No private notes recorded for this lead yet.
            </p>
          )}

          {/* Edit Note Modal */}
          {editingNote && (
            <div style={{ marginTop: 16, background: '#1a1d1b', padding: 14, borderRadius: 6, border: '1px solid #333' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: 13, color: '#fff' }}>Edit Note</h4>
              <form onSubmit={handleSaveEditedNote}>
                <textarea
                  value={editingNote.body}
                  onChange={e => setEditingNote({ ...editingNote, body: e.target.value })}
                  rows={3}
                  required
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button type="submit" className="btn fill" style={{ fontSize: 12 }}>
                    Save Changes
                  </button>
                  <button type="button" className="btn" style={{ fontSize: 12 }} onClick={() => setEditingNote(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
