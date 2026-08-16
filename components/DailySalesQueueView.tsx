'use client';

import { useState } from 'react';
import Link from 'next/link';

type QueueItem = {
  id: string;
  name: string;
  slug: string;
  type: string;
  location?: string | null;
  opportunity_score: number;
  active_projects_count: number;
  next_action: string;
  next_action_date: string;
  pipeline_status: string;
  recommended_services: string[];
  primary_contact?: {
    name: string;
    role: string;
    phone?: string | null;
    email?: string | null;
  } | null;
};

type Props = {
  callToday: QueueItem[];
  emailToday: QueueItem[];
  followUpToday: QueueItem[];
  meetingToday: QueueItem[];
  proposalToday: QueueItem[];
  overdue: QueueItem[];
};

export function DailySalesQueueView(props: Props) {
  const [activeTab, setActiveTab] = useState<'all' | 'call' | 'email' | 'followup' | 'meeting' | 'proposal' | 'overdue'>('all');
  const [notice, setNotice] = useState<string>('');

  const allItems = [
    ...props.callToday,
    ...props.emailToday,
    ...props.followUpToday,
    ...props.meetingToday,
    ...props.proposalToday,
    ...props.overdue
  ];

  async function handleReschedule(companyId: string, daysToAdd: number) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysToAdd);
    const dateStr = targetDate.toISOString().slice(0, 10);

    setNotice(`Rescheduling next action to ${dateStr}…`);
    await fetch(`/api/admin/private_opportunity_scores/${companyId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ next_action_date: dateStr })
    });

    setNotice(`Rescheduled next action to ${dateStr}.`);
    setTimeout(() => setNotice(''), 3000);
  }

  async function handleMarkDone(companyId: string, currentAction: string) {
    setNotice('Logging completed action and advancing sales history…');
    await fetch('/api/admin/sales-activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_id: companyId,
        activity_type: 'follow_up',
        summary: `Completed action: ${currentAction}`,
        outcome: 'connected'
      })
    });

    // Advance next action date by +7 days
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 7);
    await fetch(`/api/admin/private_opportunity_scores/${companyId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        next_action: 'Scheduled check-in / follow-up',
        next_action_date: nextDate.toISOString().slice(0, 10),
        last_contacted_at: new Date().toISOString()
      })
    });

    setNotice('Action completed and logged to sales timeline.');
    setTimeout(() => setNotice(''), 3000);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            Daily Execution Queue
          </div>
          <h1 className="admin-title" style={{ margin: '4px 0 0 0' }}>
            TODAY&apos;S OUTREACH & FOLLOW-UP QUEUE
          </h1>
        </div>
        <Link href="/admin/commercial" className="btn">
          ← Back to Commercial Command Center
        </Link>
      </div>

      {notice && (
        <div style={{ padding: '10px 14px', marginBottom: 16, borderRadius: 4, background: 'rgba(212, 175, 55, 0.15)', color: '#d4af37', border: '1px solid rgba(212, 175, 55, 0.3)', fontSize: 13 }}>
          {notice}
        </div>
      )}

      {/* Queue Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 6 }}>
        <button
          type="button"
          className="btn"
          style={{ background: activeTab === 'all' ? '#d4af37' : '#141715', color: activeTab === 'all' ? '#000' : '#fff', fontWeight: 700 }}
          onClick={() => setActiveTab('all')}
        >
          All Actions ({allItems.length})
        </button>
        <button
          type="button"
          className="btn"
          style={{ background: activeTab === 'call' ? '#d4af37' : '#141715', color: activeTab === 'call' ? '#000' : '#fff', fontWeight: 700 }}
          onClick={() => setActiveTab('call')}
        >
          Calls ({props.callToday.length})
        </button>
        <button
          type="button"
          className="btn"
          style={{ background: activeTab === 'email' ? '#d4af37' : '#141715', color: activeTab === 'email' ? '#000' : '#fff', fontWeight: 700 }}
          onClick={() => setActiveTab('email')}
        >
          Emails ({props.emailToday.length})
        </button>
        <button
          type="button"
          className="btn"
          style={{ background: activeTab === 'followup' ? '#d4af37' : '#141715', color: activeTab === 'followup' ? '#000' : '#fff', fontWeight: 700 }}
          onClick={() => setActiveTab('followup')}
        >
          Follow-ups ({props.followUpToday.length})
        </button>
        <button
          type="button"
          className="btn"
          style={{ background: activeTab === 'meeting' ? '#d4af37' : '#141715', color: activeTab === 'meeting' ? '#000' : '#fff', fontWeight: 700 }}
          onClick={() => setActiveTab('meeting')}
        >
          Meetings ({props.meetingToday.length})
        </button>
        <button
          type="button"
          className="btn"
          style={{ background: activeTab === 'overdue' ? '#ef4444' : '#141715', color: activeTab === 'overdue' ? '#fff' : '#fca5a5', fontWeight: 700 }}
          onClick={() => setActiveTab('overdue')}
        >
          Overdue ({props.overdue.length})
        </button>
      </div>

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {allItems.length > 0 ? (
          allItems.map(item => (
            <div
              key={item.id}
              style={{
                background: '#141715',
                border: '1px solid #262927',
                borderRadius: 8,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge" style={{ textTransform: 'uppercase', color: '#d4af37' }}>
                    {item.type}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#86efac' }}>
                    {item.opportunity_score}/100 OPP
                  </span>
                </div>

                <h3 style={{ fontSize: 18, color: '#fff', margin: '8px 0 2px 0' }}>{item.name}</h3>
                <div style={{ fontSize: 12, color: '#aaa9a1' }}>
                  {item.location || 'Romania'} · {item.active_projects_count} Active Projects
                </div>

                {/* Primary Contact Details */}
                {item.primary_contact && (
                  <div style={{ background: '#0d0f0e', padding: 10, borderRadius: 6, border: '1px solid #222', marginTop: 10 }}>
                    <span className="eyebrow" style={{ fontSize: 9 }}>PRIMARY DECISION MAKER</span>
                    <div style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>
                      {item.primary_contact.name} · {item.primary_contact.role}
                    </div>
                    {item.primary_contact.phone && (
                      <a href={`tel:${item.primary_contact.phone}`} style={{ fontSize: 12, color: '#d4af37', display: 'block', marginTop: 2 }}>
                        TEL: {item.primary_contact.phone}
                      </a>
                    )}
                  </div>
                )}

                {/* Next Action Box */}
                <div style={{ background: '#0a0c0b', padding: 10, borderRadius: 6, border: '1px solid #222', marginTop: 10 }}>
                  <span className="eyebrow" style={{ fontSize: 9, color: '#d4af37' }}>ACTION DUE</span>
                  <div style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{item.next_action}</div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Due: {item.next_action_date}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Link href={`/admin/opportunities/${item.id}`} className="btn fill" style={{ flex: 1, textAlign: 'center', fontSize: 11, minHeight: 44, padding: '10px 14px' }}>
                    Open Workstation →
                  </Link>
                  <button
                    type="button"
                    className="btn"
                    style={{ fontSize: 11, minHeight: 44, padding: '10px 14px', background: '#86efac', color: '#000', fontWeight: 700 }}
                    onClick={() => handleMarkDone(item.id, item.next_action)}
                  >
                    Done
                  </button>
                </div>

                {/* Reschedule Presets */}
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, color: '#888', textTransform: 'uppercase' }}>Reschedule:</span>
                  <button type="button" className="btn" style={{ padding: '6px 8px', fontSize: 10, minHeight: 32 }} onClick={() => handleReschedule(item.id, 1)}>
                    +1d
                  </button>
                  <button type="button" className="btn" style={{ padding: '6px 8px', fontSize: 10, minHeight: 32 }} onClick={() => handleReschedule(item.id, 3)}>
                    +3d
                  </button>
                  <button type="button" className="btn" style={{ padding: '6px 8px', fontSize: 10, minHeight: 32 }} onClick={() => handleReschedule(item.id, 7)}>
                    +7d
                  </button>
                  <button type="button" className="btn" style={{ padding: '6px 8px', fontSize: 10, minHeight: 32 }} onClick={() => handleReschedule(item.id, 14)}>
                    +14d
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty" style={{ gridColumn: '1 / -1' }}>
            No sales actions scheduled for today.
          </div>
        )}
      </div>
    </div>
  );
}
