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
  const [rescheduleDays] = useState(3);
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
        setStatusMessage(`Action logged for ${item.name}. Next touchpoint set for ${nextDateStr}.`);
        setActiveActionCompanyId(null);
        setActionNotes('');

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
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color, fontFamily: 'DM Mono' }}>[{badgePrefix}]</span>
          <h2 style={{ fontSize: '1.05rem', margin: 0, letterSpacing: '0.04em', color, fontWeight: 800 }}>
            {title} ({items.length})
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {items.map(item => (
            <div
              key={item.id}
              className="admin-card"
              style={{
                borderLeft: `3px solid ${color}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '14px 16px',
                background: 'rgba(13,16,15,0.92)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 10 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>
                      <Link href={`/admin/companies/${item.id}/acquisition`} style={{ color: '#f3f1eb', textDecoration: 'none' }}>
                        {item.name}
                      </Link>
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(243,241,235,0.6)', marginTop: 2 }}>
                      {item.type} · {item.city || item.location || 'Romania'}
                    </div>
                  </div>
                  <span className="status-pill" style={{ color, borderColor: color, fontSize: '0.68rem', fontWeight: 700 }}>
                    Score {item.opportunity_score}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#f3f1eb', margin: '8px 0', background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 4, border: '1px solid rgba(244,242,235,0.06)' }}>
                  <div><strong>Action:</strong> {item.next_action}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(243,241,235,0.5)', marginTop: 2 }}>Due: {item.next_action_date}</div>
                </div>

                {item.primary_contact ? (
                  <div style={{ fontSize: '0.78rem', color: '#38bdf8', marginBottom: 10 }}>
                    Contact: <strong>{item.primary_contact.name}</strong> ({item.primary_contact.role})
                    {item.primary_contact.phone && <div style={{ color: 'rgba(243,241,235,0.6)', fontSize: '0.72rem' }}>Tel: {item.primary_contact.phone}</div>}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.72rem', color: '#eab308', marginBottom: 10 }}>
                    Executive contact resolution pending
                  </div>
                )}
              </div>

              {/* Action Buttons & Completion Drawer */}
              <div>
                {activeActionCompanyId === item.id ? (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(244,242,235,0.08)' }}>
                    <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'rgba(243,241,235,0.5)', display: 'block', marginBottom: 4 }}>
                      Outreach Outcome
                    </label>
                    <select
                      value={actionOutcome}
                      onChange={e => setActionOutcome(e.target.value)}
                      style={{ width: '100%', padding: '8px', background: '#070908', color: '#f3f1eb', border: '1px solid rgba(244,242,235,0.15)', borderRadius: 4, fontSize: '0.78rem', marginBottom: 8 }}
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
                      placeholder="Brief conversation notes..."
                      value={actionNotes}
                      onChange={e => setActionNotes(e.target.value)}
                      style={{ width: '100%', padding: '8px', background: '#070908', color: '#f3f1eb', border: '1px solid rgba(244,242,235,0.15)', borderRadius: 4, fontSize: '0.78rem', marginBottom: 8 }}
                    />

                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => setActiveActionCompanyId(null)}
                        className="action-btn secondary"
                        style={{ padding: '6px 12px', fontSize: '0.72rem', minHeight: 38 }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMarkDone(item)}
                        disabled={isSubmitting}
                        className="action-btn primary"
                        style={{ padding: '6px 14px', fontSize: '0.72rem', minHeight: 38 }}
                      >
                        Log Activity
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10, borderTop: '1px solid rgba(244,242,235,0.06)', paddingTop: 10 }}>
                    {(() => {
                      const hasPhone = Boolean(item.primary_contact?.phone);
                      const isLevel03Or04 = item.primary_contact?.role && (
                        item.primary_contact.role.toLowerCase().includes('director') ||
                        item.primary_contact.role.toLowerCase().includes('ceo') ||
                        item.primary_contact.role.toLowerCase().includes('head') ||
                        item.primary_contact.role.toLowerCase().includes('manager')
                      );
                      const canCallNow = hasPhone && isLevel03Or04 && item.pipeline_status !== 'not_a_fit';

                      if (canCallNow && item.primary_contact?.phone) {
                        return (
                          <a
                            href={`tel:${item.primary_contact.phone}`}
                            className="action-btn primary"
                            style={{ padding: '6px 12px', fontSize: '0.72rem', minHeight: 44, fontWeight: 800, background: '#22c55e', color: '#000' }}
                          >
                            📞 CALL NOW
                          </a>
                        );
                      }

                      return (
                        <Link
                          href={`/admin/companies/${item.id}/decision-makers`}
                          className="action-btn secondary"
                          style={{ padding: '6px 10px', fontSize: '0.72rem', minHeight: 44, color: '#eab308', borderColor: '#eab308' }}
                        >
                          CONTACT VERIFICATION REQUIRED
                        </Link>
                      );
                    })()}
                    <Link
                      href={`/admin/acquisition/outreach/${item.id}`}
                      className="action-btn secondary"
                      style={{ padding: '6px 10px', fontSize: '0.72rem', minHeight: 44 }}
                    >
                      Email
                    </Link>
                    <button
                      type="button"
                      onClick={() => setActiveActionCompanyId(item.id)}
                      className="action-btn secondary"
                      style={{ padding: '6px 12px', fontSize: '0.72rem', minHeight: 44 }}
                    >
                      ✓ Mark Done
                    </button>
                    <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
                      <button
                        type="button"
                        onClick={() => handleQuickReschedule(item, 1)}
                        title="Reschedule +1 day"
                        className="action-btn secondary"
                        style={{ padding: '4px 8px', fontSize: '0.68rem', minHeight: 44 }}
                      >
                        +1d
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickReschedule(item, 3)}
                        title="Reschedule +3 days"
                        className="action-btn secondary"
                        style={{ padding: '4px 8px', fontSize: '0.68rem', minHeight: 44 }}
                      >
                        +3d
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickReschedule(item, 7)}
                        title="Reschedule +7 days"
                        className="action-btn secondary"
                        style={{ padding: '4px 8px', fontSize: '0.68rem', minHeight: 44 }}
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
      <div className="admin-header" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="eyebrow" style={{ color: '#c7a675' }}>
              DAILY SALES QUEUE · ACTION PRIORITIES
            </div>
            <h1 style={{ margin: '4px 0 6px 0', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, color: '#f3f1eb' }}>
              WHO SHOULD I CONTACT TODAY?
            </h1>
            <p className="admin-subtitle" style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(243,241,235,0.7)' }}>
              Prioritized verified companies and projects derived from verified market signals. Direct calls reserved for Level 03+ verified contacts.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link href="/admin/executive" className="action-btn secondary" style={{ minHeight: 40, fontSize: '0.78rem' }}>
              ← Briefing
            </Link>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="admin-card" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34,197,94,0.4)', color: '#22c55e', padding: '10px 14px', marginBottom: 16, fontSize: '0.8rem' }}>
          ✓ {statusMessage}
        </div>
      )}

      {totalActions === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <h2 style={{ fontSize: '1.2rem', margin: '0 0 8px 0', color: '#22c55e', fontWeight: 800 }}>✓ Daily Queue Completed</h2>
          <p style={{ color: 'rgba(243,241,235,0.6)', margin: '0 0 20px 0', fontSize: '0.85rem', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
            No pending calls or emails overdue for today. Check the Acquisition Pipeline for high-value targets to approach next.
          </p>
          <Link href="/admin/acquisition" className="action-btn primary" style={{ minHeight: 44, fontSize: '0.78rem' }}>
            Browse Pipeline Prospects →
          </Link>
        </div>
      ) : (
        <>
          {renderQueueSection('Overdue Touchpoints', queue.overdue, '#ef4444', 'OVERDUE')}
          {renderQueueSection('Calls Scheduled Today', queue.callToday, '#22c55e', 'CALL')}
          {renderQueueSection('Emails / Direct Outreach', queue.emailToday, '#38bdf8', 'EMAIL')}
          {renderQueueSection('Meetings Today', queue.meetingToday, '#a855f7', 'MEETING')}
          {renderQueueSection('Proposals Negotiation', queue.proposalToday, '#eab308', 'PROPOSAL')}
          {renderQueueSection('Follow-up Actions', queue.followUpToday, '#94a3b8', 'FOLLOW-UP')}
        </>
      )}
    </div>
  );
}

