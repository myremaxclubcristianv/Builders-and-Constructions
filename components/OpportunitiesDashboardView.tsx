'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

type OpportunityItem = {
  company: {
    id: string;
    name: string;
    slug: string;
    type: string;
    location?: string | null;
    website?: string | null;
    website_status?: string | null;
    social_presence?: string | null;
    seo_status?: string | null;
    lead_generation_status?: string | null;
    created_at?: string;
  };
  opportunity_level: string;
  opportunity_score: number;
  score_reasons: string[];
  pipeline_status: string;
  signals: string[];
  recommended_services: string[];
  active_projects_count: number;
  next_action?: string | null;
  next_action_date?: string | null;
  assigned_user_id?: string | null;
  last_contacted_at?: string | null;
  updated_at?: string;
};

export function OpportunitiesDashboardView({
  metrics,
  opportunities
}: {
  metrics: {
    total: number;
    high: number;
    medium: number;
    low: number;
    new: number;
    contacted: number;
    followUp: number;
    proposals: number;
    won: number;
    todayFollowUps?: number;
    overdueFollowUps?: number;
  };
  opportunities: OpportunityItem[];
}) {
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<'all' | 'today' | 'overdue'>('all');
  const [search, setSearch] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const todayStr = new Date().toISOString().slice(0, 10);

  const filtered = useMemo(() => {
    return opportunities.filter(o => {
      if (levelFilter !== 'all' && o.opportunity_level !== levelFilter) return false;
      if (statusFilter !== 'all' && o.pipeline_status !== statusFilter) return false;
      if (typeFilter !== 'all' && !o.company.type.toLowerCase().includes(typeFilter.toLowerCase())) return false;
      if (actionFilter === 'today' && o.next_action_date !== todayStr) return false;
      if (actionFilter === 'overdue' && (!o.next_action_date || o.next_action_date >= todayStr || ['won', 'lost', 'not_a_fit'].includes(o.pipeline_status))) return false;
      if (search && !`${o.company.name} ${o.company.type} ${o.company.location || ''}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [opportunities, levelFilter, statusFilter, typeFilter, actionFilter, search, todayStr]);

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ marginBottom: 20 }}>
        <div className="eyebrow" style={{ color: '#c7a675', letterSpacing: '0.12em' }}>
          COMMERCIAL ENGINE · OPPORTUNITY RADAR
        </div>
        <h1 style={{ margin: '4px 0 6px 0', fontSize: 'clamp(1.7rem, 4vw, 2.3rem)', fontWeight: 800, color: '#f3f1eb' }}>
          OPPORTUNITIES & PROSPECTING
        </h1>
        <p className="admin-subtitle" style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(243,241,235,0.7)' }}>
          Verified Romanian market prospects sorted strictly by algorithmic opportunity score and verified triggers.
        </p>
      </div>

      {/* TODAY & ACTION METRICS BAR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
        <div
          onClick={() => setActionFilter(actionFilter === 'today' ? 'all' : 'today')}
          className="admin-card"
          style={{
            padding: 14,
            background: actionFilter === 'today' ? 'rgba(199, 166, 117, 0.15)' : 'rgba(13,16,15,0.9)',
            borderLeft: '3px solid #c7a675',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '0.6rem', color: '#c7a675', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', fontWeight: 700 }}>
            TODAY&apos;S FOLLOW-UPS
          </span>
          <strong style={{ fontSize: '1.4rem', display: 'block', marginTop: 2, color: '#f3f1eb', fontWeight: 800 }}>
            {metrics.todayFollowUps || 0}
          </strong>
        </div>

        <div
          onClick={() => setActionFilter(actionFilter === 'overdue' ? 'all' : 'overdue')}
          className="admin-card"
          style={{
            padding: 14,
            background: actionFilter === 'overdue' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(13,16,15,0.9)',
            borderLeft: (metrics.overdueFollowUps || 0) > 0 ? '3px solid #ef4444' : '3px solid rgba(244,242,235,0.1)',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '0.6rem', color: (metrics.overdueFollowUps || 0) > 0 ? '#ef4444' : 'rgba(243,241,235,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', fontWeight: 700 }}>
            OVERDUE ACTIONS
          </span>
          <strong style={{ fontSize: '1.4rem', display: 'block', marginTop: 2, color: (metrics.overdueFollowUps || 0) > 0 ? '#ef4444' : '#f3f1eb', fontWeight: 800 }}>
            {metrics.overdueFollowUps || 0}
          </strong>
        </div>

        <div className="admin-card" style={{ padding: 14, borderLeft: '3px solid #22c55e' }}>
          <span style={{ fontSize: '0.6rem', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', fontWeight: 700 }}>
            HIGH PRIORITY
          </span>
          <strong style={{ fontSize: '1.4rem', display: 'block', marginTop: 2, color: '#22c55e', fontWeight: 800 }}>
            {metrics.high}
          </strong>
        </div>

        <div className="admin-card" style={{ padding: 14, borderLeft: '3px solid #38bdf8' }}>
          <span style={{ fontSize: '0.6rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', fontWeight: 700 }}>
            ACTIVE PIPELINE
          </span>
          <strong style={{ fontSize: '1.4rem', display: 'block', marginTop: 2, color: '#38bdf8', fontWeight: 800 }}>
            {metrics.new + metrics.contacted + metrics.followUp + metrics.proposals}
          </strong>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="admin-card" style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 10, flex: '1 1 280px', flexWrap: 'wrap' }}>
            <input
              placeholder="Search company, type or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: '1 1 180px', background: '#070908', border: '1px solid rgba(244,242,235,0.12)', color: '#f3f1eb', padding: '10px 12px', fontSize: '0.8rem', borderRadius: 4, minHeight: 44 }}
            />
            <select
              value={levelFilter}
              onChange={e => setLevelFilter(e.target.value)}
              style={{ background: '#070908', border: '1px solid rgba(244,242,235,0.12)', color: '#f3f1eb', padding: '10px 12px', fontSize: '0.8rem', borderRadius: 4, minHeight: 44 }}
            >
              <option value="all">All Opportunity Tiers</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ background: '#070908', border: '1px solid rgba(244,242,235,0.12)', color: '#f3f1eb', padding: '10px 12px', fontSize: '0.8rem', borderRadius: 4, minHeight: 44 }}
            >
              <option value="all">All Pipeline Stages</option>
              <option value="new">New</option>
              <option value="researching">Researching</option>
              <option value="contacted">Contacted</option>
              <option value="follow_up">Follow Up</option>
              <option value="proposal">Proposal</option>
              <option value="won">Won</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              className="action-btn"
              style={{
                background: viewMode === 'cards' ? '#c7a675' : 'rgba(255,255,255,0.05)',
                color: viewMode === 'cards' ? '#070908' : '#f3f1eb',
                fontWeight: 700,
                fontSize: '0.72rem',
                minHeight: 40
              }}
              onClick={() => setViewMode('cards')}
            >
              Priority Cards
            </button>
            <button
              type="button"
              className="action-btn"
              style={{
                background: viewMode === 'table' ? '#c7a675' : 'rgba(255,255,255,0.05)',
                color: viewMode === 'table' ? '#070908' : '#f3f1eb',
                fontWeight: 700,
                fontSize: '0.72rem',
                minHeight: 40
              }}
              onClick={() => setViewMode('table')}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(243,241,235,0.5)' }}>
          No production opportunities match the active criteria.
        </div>
      ) : viewMode === 'cards' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map(opp => {
            const badgeBg =
              opp.opportunity_level === 'high'
                ? '#22c55e'
                : opp.opportunity_level === 'medium'
                ? '#eab308'
                : '#88857c';

            return (
              <div
                key={opp.company.id}
                className="admin-card"
                style={{
                  background: 'rgba(13,16,15,0.95)',
                  border: opp.opportunity_level === 'high' ? '1px solid rgba(199, 166, 117, 0.25)' : '1px solid rgba(244,242,235,0.08)',
                  borderRadius: 6,
                  padding: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                    <div>
                      <span className="badge" style={{ textTransform: 'uppercase', fontSize: '0.6rem' }}>
                        {opp.company.type.replaceAll('_', ' ')}
                      </span>
                      <h3 style={{ fontSize: '1.15rem', margin: '4px 0 2px 0', letterSpacing: '-0.02em', color: '#f3f1eb', fontWeight: 800 }}>
                        {opp.company.name}
                      </h3>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(243,241,235,0.6)' }}>
                        {opp.company.location || 'Romania'} · Stage:{' '}
                        <strong style={{ color: '#f3f1eb', textTransform: 'uppercase' }}>
                          {opp.pipeline_status.replaceAll('_', ' ')}
                        </strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        className="badge"
                        style={{
                          fontSize: '0.6rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          color: badgeBg,
                          borderColor: badgeBg
                        }}
                      >
                        {opp.opportunity_level}
                      </span>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#22c55e', marginTop: 2, lineHeight: 1 }}>
                        {opp.opportunity_score} <span style={{ fontSize: '0.65rem', color: 'rgba(243,241,235,0.4)', fontWeight: 400 }}>/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Why this is an opportunity */}
                  <div style={{ marginTop: 12, background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 4, border: '1px solid rgba(244,242,235,0.06)' }}>
                    <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', color: '#c7a675', fontWeight: 800, letterSpacing: '0.08em' }}>
                      VERIFIED OUTREACH TRIGGER:
                    </div>
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: 14, fontSize: '0.75rem', color: 'rgba(243,241,235,0.75)', lineHeight: 1.45 }}>
                      {opp.score_reasons.length > 0 ? (
                        opp.score_reasons.slice(0, 3).map((r, idx) => <li key={idx}>{r}</li>)
                      ) : (
                        <li>
                          {opp.company.website ? `Active website: ${opp.company.website}` : 'No verified website found'}
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Operational Facts */}
                  <div style={{ marginTop: 10, display: 'flex', gap: 12, fontSize: '0.72rem', color: 'rgba(243,241,235,0.5)' }}>
                    <span>Sites: <strong style={{ color: '#f3f1eb' }}>{opp.active_projects_count}</strong></span>
                    <span>Website: <strong style={{ color: '#f3f1eb' }}>{opp.company.website_status || 'Unknown'}</strong></span>
                  </div>
                </div>

                <div style={{ marginTop: 16, borderTop: '1px solid rgba(244,242,235,0.06)', paddingTop: 12 }}>
                  <Link
                    href={`/admin/companies/${opp.company.id}/acquisition`}
                    className="action-btn primary"
                    style={{ width: '100%', minHeight: 44, fontSize: '0.75rem', letterSpacing: '0.08em' }}
                  >
                    OPEN DOSSIER →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="admin-panel" style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Type</th>
                <th>Score</th>
                <th>Pipeline Stage</th>
                <th>Active Projects</th>
                <th>Website Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(opp => (
                <tr key={opp.company.id}>
                  <td>
                    <strong style={{ color: '#f3f1eb' }}>{opp.company.name}</strong>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(243,241,235,0.5)' }}>{opp.company.location || 'Romania'}</div>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{opp.company.type.replaceAll('_', ' ')}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: opp.opportunity_level === 'high' ? '#22c55e' : '#f3f1eb' }}>
                      {opp.opportunity_score}/100 ({opp.opportunity_level.toUpperCase()})
                    </span>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{opp.pipeline_status.replaceAll('_', ' ')}</td>
                  <td>{opp.active_projects_count}</td>
                  <td>{opp.company.website_status || 'Unknown'}</td>
                  <td>
                    <Link href={`/admin/companies/${opp.company.id}/acquisition`} className="link-arrow">
                      Dossier →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

