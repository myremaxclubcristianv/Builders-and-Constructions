'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type QueueCardItem = {
  id: string;
  name: string;
  slug: string;
  type: string;
  location?: string;
  city?: string;
  opportunity_score: number;
  active_projects_count: number;
  next_action: string;
  next_action_date: string;
  pipeline_status: string;
  recommended_services: Array<string | { name: string; serviceKey: string }>;
  primary_contact?: {
    name: string;
    role: string;
    phone?: string | null;
    email?: string | null;
  } | null;
};

type DailyQueueData = {
  callToday: QueueCardItem[];
  emailToday: QueueCardItem[];
  followUpToday: QueueCardItem[];
  meetingToday: QueueCardItem[];
  proposalToday: QueueCardItem[];
  overdue: QueueCardItem[];
};

export function DailyAcquisitionQueueView({ initialData }: { initialData: DailyQueueData }) {
  const [queue, setQueue] = useState<DailyQueueData>(initialData);
  const [activeActionCompanyId, setActiveActionCompanyId] = useState<string | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [actionOutcome, setActionOutcome] = useState('connected');
  const [rescheduleDays, setRescheduleDays] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleMarkDone = async (item: QueueCardItem) => {
    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + rescheduleDays);
      const nextDateStr = nextDate.toISOString().slice(0, 10);

      const res = await fetch('/api/admin/sales-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: item.id,
          activity_type: item.next_action.toLowerCase().includes('call') ? 'call' : 'email',
          summary: `Completed scheduled action: ${item.next_action}`,
          details: actionNotes || `Completed action with outcome: ${actionOutcome}`,
          outcome: actionOutcome,
          next_action: actionOutcome === 'meeting_booked' ? 'Prepare commercial presentation' : 'Follow up on proposal inquiry',
          next_action_date: nextDateStr
        })
      });

      if (res.ok) {
        setStatusMessage(`Action logged for ${item.name}. Scheduled next touchpoint for ${nextDateStr}.`);
        setActiveActionCompanyId(null);
        setActionNotes('');
        
        // Optimistically remove from today's list
        setQueue(prev => ({
          callToday: prev.callToday.filter(i => i.id !== item.id),
          emailToday: prev.emailToday.filter(i => i.id !== item.id),
          followUpToday: prev.followUpToday.filter(i => i.id !== item.id),
          meetingToday: prev.meetingToday.filter(i => i.id !== item.id),
          proposalToday: prev.proposalToday.filter(i => i.id !== item.id),
          overdue: prev.overdue.filter(i => i.id !== item.id)
        }));
      }
    } catch (err) {
      console.error('Failed to log sales activity:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickReschedule = async (item: QueueCardItem, days: number) => {
    setIsSubmitting(true);
    try {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + days);
      const nextDateStr = nextDate.toISOString().slice(0, 10);

      const res = await fetch('/api/admin/sales-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: item.id,
          activity_type: 'follow_up',
          summary: `Rescheduled follow-up to ${nextDateStr} (+${days}d)`,
          next_action: item.next_action,
          next_action_date: nextDateStr
        })
      });

      if (res.ok) {
        setStatusMessage(`Rescheduled ${item.name} for ${nextDateStr}.`);
        setQueue(prev => ({
          callToday: prev.callToday.filter(i => i.id !== item.id),
          emailToday: prev.emailToday.filter(i => i.id !== item.id),
          followUpToday: prev.followUpToday.filter(i => i.id !== item.id),
          meetingToday: prev.meetingToday.filter(i => i.id !== item.id),
          proposalToday: prev.proposalToday.filter(i => i.id !== item.id),
          overdue: prev.overdue.filter(i => i.id !== item.id)
        }));
      }
    } catch (e) {
      console.error('Failed to reschedule:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQueueSection = (title: string, items: QueueCardItem[], color: string, badgePrefix: string) => {
    if (items.length === 0) return null;

    return (
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color, fontFamily: 'monospace' }}>[{badgePrefix}]</span>
          <h2 style={{ fontSize: '1.15rem', margin: 0, letterSpacing: '0.05em', color }}>
            {title} ({items.length})
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {items.map(item => (
            <div
              key={item.id}
              className="admin-card"
              style={{
                borderLeft: `3px solid ${color}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.25rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>
                      <Link href={`/admin/companies/${item.id}/acquisition`} style={{ color: '#fff', textDecoration: 'none' }}>
                        {item.name}
                      </Link>
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#888' }}>
                      {item.type} · {item.city || item.location || 'Romania'}
                    </div>
                  </div>
                  <span className="status-pill" style={{ color, borderColor: color, fontSize: '0.75rem' }}>
                    Score {item.opportunity_score}
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#ccc', margin: '0.75rem 0', background: 'rgba(0,0,0,0.2)', padding: '0.6rem', borderRadius: '4px' }}>
                  <div><strong>Next Action:</strong> {item.next_action}</div>
                  <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem' }}>Due Date: {item.next_action_date}</div>
                </div>

                {item.primary_contact ? (
                  <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginBottom: '0.75rem' }}>
                    Contact: <strong>{item.primary_contact.name}</strong> ({item.primary_contact.role})
                    {item.primary_contact.phone && <div style={{ color: '#aaa', fontSize: '0.75rem' }}>Phone: {item.primary_contact.phone}</div>}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.75rem', color: '#eab308', marginBottom: '0.75rem' }}>
                    Executive contact pending
                  </div>
                )}
              </div>

              {/* Action Buttons & Completion Drawer */}
              <div>
                {activeActionCompanyId === item.id ? (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <label style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '0.25rem' }}>
                      Call / Outreach Outcome
                    </label>
                    <select
                      value={actionOutcome}
                      onChange={e => setActionOutcome(e.target.value)}
                      style={{ width: '100%', padding: '0.35rem', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '4px', fontSize: '0.8rem', marginBottom: '0.5rem' }}
                    >
                      <option value="connected">Connected / Discussed</option>
                      <option value="meeting_booked">Meeting Booked</option>
                      <option value="call_back">Call Back Requested</option>
                      <option value="no_answer">No Answer / Left Voicemail</option>
                      <option value="not_interested">Not Interested Currently</option>
                      <option value="not_a_fit">Not a Fit (Disqualify)</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Brief notes from conversation..."
                      value={actionNotes}
                      onChange={e => setActionNotes(e.target.value)}
                      style={{ width: '100%', padding: '0.35rem', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '4px', fontSize: '0.8rem', marginBottom: '0.5rem' }}
                    />

                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setActiveActionCompanyId(null)}
                        className="action-btn secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleMarkDone(item)}
                        disabled={isSubmitting}
                        className="action-btn primary"
                        style={{ padding: '0.35rem 0.9rem', fontSize: '0.75rem' }}
                      >
                        Confirm & Log Activity
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
                    {item.primary_contact?.phone && (
                      <a
                        href={`tel:${item.primary_contact.phone}`}
                        className="action-btn secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', textDecoration: 'none' }}
                      >
                        Call
                      </a>
                    )}
                    <Link
                      href={`/admin/acquisition/outreach/${item.id}`}
                      className="action-btn secondary"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', textDecoration: 'none' }}
                    >
                      Email
                    </Link>
                    <button
                      onClick={() => setActiveActionCompanyId(item.id)}
                      className="action-btn primary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                    >
                      ✓ Mark Done
                    </button>
                    <div style={{ display: 'flex', gap: '0.2rem', marginLeft: 'auto' }}>
                      <button
                        onClick={() => handleQuickReschedule(item, 1)}
                        title="Reschedule +1 day"
                        className="action-btn secondary"
                        style={{ padding: '0.35rem 0.45rem', fontSize: '0.7rem' }}
                      >
                        +1d
                      </button>
                      <button
                        onClick={() => handleQuickReschedule(item, 3)}
                        title="Reschedule +3 days"
                        className="action-btn secondary"
                        style={{ padding: '0.35rem 0.45rem', fontSize: '0.7rem' }}
                      >
                        +3d
                      </button>
                      <button
                        onClick={() => handleQuickReschedule(item, 7)}
                        title="Reschedule +7 days"
                        className="action-btn secondary"
                        style={{ padding: '0.35rem 0.45rem', fontSize: '0.7rem' }}
                      >
                        +7d
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const totalActions =
    queue.callToday.length +
    queue.emailToday.length +
    queue.followUpToday.length +
    queue.meetingToday.length +
    queue.proposalToday.length +
    queue.overdue.length;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="eyebrow" style={{ color: '#d4af37' }}>
              DAILY SALES EXECUTION · PHASE 12
            </div>
            <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
              DAILY ACQUISITION QUEUE
            </h1>
            <p className="admin-subtitle" style={{ margin: 0 }}>
              Active pipeline touchpoints, calls, emails, and follow-ups scheduled for today.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link href="/admin/acquisition" className="action-btn secondary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}>
              ← Command Center
            </Link>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="admin-card" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', color: '#22c55e', padding: '0.75rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          ✓ {statusMessage}
        </div>
      )}

      {totalActions === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0', color: '#22c55e' }}>✓ Daily Queue Completed</h2>
          <p style={{ color: '#888', margin: '0 0 1.5rem 0', fontSize: '0.9rem' }}>
            No pending calls or emails overdue for today. Check the Acquisition Command Center for high-value targets to approach next.
          </p>
          <Link href="/admin/acquisition" className="action-btn primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
            Browse Top Prospects →
          </Link>
        </div>
      ) : (
        <>
          {renderQueueSection('Overdue Follow-ups', queue.overdue, '#ef4444', 'OVERDUE')}
          {renderQueueSection('Calls Scheduled Today', queue.callToday, '#22c55e', 'CALL')}
          {renderQueueSection('Emails / Messages Today', queue.emailToday, '#38bdf8', 'EMAIL')}
          {renderQueueSection('Meetings Today', queue.meetingToday, '#a855f7', 'MEETING')}
          {renderQueueSection('Proposals in Negotiation', queue.proposalToday, '#eab308', 'PROPOSAL')}
          {renderQueueSection('General Follow-ups', queue.followUpToday, '#94a3b8', 'FOLLOW-UP')}
        </>
      )}
    </div>
  );
}
