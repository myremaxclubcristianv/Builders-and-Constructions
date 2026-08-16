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
  const [typeFilter, setTypeFilter] = useState<string>('all');
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
    <div>
      <div className="eyebrow">Commercial Engine & Lead Generation</div>
      <h1 className="admin-title">SALES OPPORTUNITIES & PROSPECTING</h1>

      {/* TODAY & ACTION METRICS BAR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div
          onClick={() => setActionFilter(actionFilter === 'today' ? 'all' : 'today')}
          style={{
            padding: 16,
            borderRadius: 6,
            background: actionFilter === 'today' ? 'rgba(212, 175, 55, 0.2)' : '#141715',
            border: '1px solid #d4af37',
            cursor: 'pointer'
          }}
        >
          <span className="eyebrow" style={{ color: '#d4af37' }}>TODAY&apos;S FOLLOW-UPS</span>
          <strong style={{ fontSize: 24, display: 'block', marginTop: 4, color: '#fff' }}>
            {metrics.todayFollowUps || 0}
          </strong>
        </div>

        <div
          onClick={() => setActionFilter(actionFilter === 'overdue' ? 'all' : 'overdue')}
          style={{
            padding: 16,
            borderRadius: 6,
            background: actionFilter === 'overdue' ? 'rgba(239, 68, 68, 0.2)' : '#141715',
            border: (metrics.overdueFollowUps || 0) > 0 ? '1px solid #ef4444' : '1px solid #333',
            cursor: 'pointer'
          }}
        >
          <span className="eyebrow" style={{ color: (metrics.overdueFollowUps || 0) > 0 ? '#fca5a5' : '#888' }}>
            OVERDUE FOLLOW-UPS
          </span>
          <strong style={{ fontSize: 24, display: 'block', marginTop: 4, color: (metrics.overdueFollowUps || 0) > 0 ? '#fca5a5' : '#fff' }}>
            {metrics.overdueFollowUps || 0}
          </strong>
        </div>

        <div style={{ padding: 16, borderRadius: 6, background: '#141715', border: '1px solid #262927' }}>
          <span className="eyebrow" style={{ color: '#86efac' }}>HIGH OPPORTUNITIES</span>
          <strong style={{ fontSize: 24, display: 'block', marginTop: 4, color: '#86efac' }}>
            {metrics.high}
          </strong>
        </div>

        <div style={{ padding: 16, borderRadius: 6, background: '#141715', border: '1px solid #262927' }}>
          <span className="eyebrow">ACTIVE IN PIPELINE</span>
          <strong style={{ fontSize: 24, display: 'block', marginTop: 4, color: '#fff' }}>
            {metrics.new + metrics.contacted + metrics.followUp + metrics.proposals}
          </strong>
        </div>
      </div>

      {/* Pipeline Stage Bar */}
      <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', marginBottom: 28 }}>
        <div className="metric" onClick={() => setStatusFilter('all')} style={{ cursor: 'pointer', background: statusFilter === 'all' ? '#222' : undefined }}>
          <span className="eyebrow">ALL</span>
          <strong>{metrics.total}</strong>
        </div>
        <div className="metric" onClick={() => setStatusFilter('new')} style={{ cursor: 'pointer', background: statusFilter === 'new' ? '#222' : undefined }}>
          <span className="eyebrow">NEW</span>
          <strong>{metrics.new}</strong>
        </div>
        <div className="metric" onClick={() => setStatusFilter('contacted')} style={{ cursor: 'pointer', background: statusFilter === 'contacted' ? '#222' : undefined }}>
          <span className="eyebrow">CONTACTED</span>
          <strong>{metrics.contacted}</strong>
        </div>
        <div className="metric" onClick={() => setStatusFilter('follow_up')} style={{ cursor: 'pointer', background: statusFilter === 'follow_up' ? '#222' : undefined }}>
          <span className="eyebrow">FOLLOW-UP</span>
          <strong>{metrics.followUp}</strong>
        </div>
        <div className="metric" onClick={() => setStatusFilter('proposal')} style={{ cursor: 'pointer', background: statusFilter === 'proposal' ? '#222' : undefined }}>
          <span className="eyebrow">PROPOSAL</span>
          <strong>{metrics.proposals}</strong>
        </div>
        <div className="metric" onClick={() => setStatusFilter('won')} style={{ cursor: 'pointer', borderColor: '#d4af37', background: statusFilter === 'won' ? '#222' : undefined }}>
          <span className="eyebrow" style={{ color: '#d4af37' }}>WON</span>
          <strong style={{ color: '#d4af37' }}>{metrics.won}</strong>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="admin-panel" style={{ marginBottom: 24 }}>
        <div className="admin-toolbar" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 280, flexWrap: 'wrap' }}>
            <input
              placeholder="Search company or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 180 }}
            />
            <select
              value={levelFilter}
              onChange={e => setLevelFilter(e.target.value)}
              className="field"
              style={{ padding: '10px 14px' }}
            >
              <option value="all">All Opportunity Tiers</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="field"
              style={{ padding: '10px 14px' }}
            >
              <option value="all">All Pipeline Stages</option>
              <option value="new">New</option>
              <option value="researching">Researching</option>
              <option value="contacted">Contacted</option>
              <option value="follow_up">Follow Up</option>
              <option value="proposal">Proposal</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              className="btn"
              style={{
                background: viewMode === 'cards' ? '#d4af37' : '#141715',
                color: viewMode === 'cards' ? '#000' : '#fff',
                fontWeight: viewMode === 'cards' ? 700 : 500,
                padding: '8px 14px'
              }}
              onClick={() => setViewMode('cards')}
            >
              Priority Cards
            </button>
            <button
              type="button"
              className="btn"
              style={{
                background: viewMode === 'table' ? '#d4af37' : '#141715',
                color: viewMode === 'table' ? '#000' : '#fff',
                fontWeight: viewMode === 'table' ? 700 : 500,
                padding: '8px 14px'
              }}
              onClick={() => setViewMode('table')}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      {/* Section Header: Top Opportunities ("Who should we contact?") */}
      <div className="section-head" style={{ marginBottom: 18 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            Who Should We Contact? (Sorted by Opportunity Score)
          </div>
          <h2>TOP PROSPECT OPPORTUNITIES ({filtered.length})</h2>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">No sales opportunities match the selected filters.</div>
      ) : viewMode === 'cards' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
          {filtered.map(opp => {
            const badgeBg =
              opp.opportunity_level === 'high'
                ? '#86efac'
                : opp.opportunity_level === 'medium'
                ? '#fde047'
                : '#94a3b8';

            return (
              <div
                key={opp.company.id}
                style={{
                  background: '#141715',
                  border: opp.opportunity_level === 'high' ? '1px solid rgba(212, 175, 55, 0.6)' : '1px solid #262927',
                  borderRadius: 8,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div>
                      <span className="badge" style={{ textTransform: 'capitalize' }}>
                        {opp.company.type.replaceAll('_', ' ')}
                      </span>
                      <h3 style={{ fontSize: 22, margin: '8px 0 4px 0', letterSpacing: '-0.02em', color: '#fff' }}>
                        {opp.company.name}
                      </h3>
                      <p style={{ fontSize: 12, color: '#aaa9a1', margin: 0 }}>
                        {opp.company.location || 'Romania'} · Pipeline:{' '}
                        <strong style={{ color: '#fff', textTransform: 'uppercase' }}>
                          {opp.pipeline_status.replaceAll('_', ' ')}
                        </strong>
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: 11,
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          padding: '3px 8px',
                          borderRadius: 4,
                          background: badgeBg,
                          color: '#000'
                        }}
                      >
                        {opp.opportunity_level}
                      </span>
                      <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginTop: 4 }}>
                        {opp.opportunity_score} <span style={{ fontSize: 13, color: '#888' }}>/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Why this is an opportunity */}
                  <div style={{ marginTop: 16, background: '#0a0c0b', padding: '12px 14px', borderRadius: 6, border: '1px solid #1f2120' }}>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#d4af37', fontWeight: 700, letterSpacing: '0.05em' }}>
                      Why Outreach This Company:
                    </span>
                    <ul style={{ margin: '6px 0 0 0', paddingLeft: 16, fontSize: 12, color: '#d1cfc7', lineHeight: 1.5 }}>
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
                  <div style={{ marginTop: 14, display: 'flex', gap: 16, fontSize: 12, color: '#aaa9a1' }}>
                    <span>Active Projects: <strong style={{ color: '#fff' }}>{opp.active_projects_count}</strong></span>
                    <span>Website: <strong style={{ color: '#fff' }}>{opp.company.website_status || 'Unknown'}</strong></span>
                  </div>

                  {/* Recommended Services */}
                  {opp.recommended_services.length > 0 && (
                    <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {opp.recommended_services.map(srv => (
                        <span
                          key={srv}
                          style={{
                            fontSize: 10,
                            padding: '3px 7px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            color: '#86efac',
                            borderRadius: 3
                          }}
                        >
                          {srv}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 22, borderTop: '1px solid #222', paddingTop: 14 }}>
                  <Link
                    href={`/admin/opportunities/${opp.company.id}`}
                    className="btn fill"
                    style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
                  >
                    OPEN OPPORTUNITY →
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
                    <strong style={{ color: '#fff' }}>{opp.company.name}</strong>
                    <div style={{ fontSize: 11, color: '#777' }}>{opp.company.location || 'Romania'}</div>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{opp.company.type.replaceAll('_', ' ')}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: opp.opportunity_level === 'high' ? '#86efac' : '#fff' }}>
                      {opp.opportunity_score}/100 ({opp.opportunity_level.toUpperCase()})
                    </span>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{opp.pipeline_status.replaceAll('_', ' ')}</td>
                  <td>{opp.active_projects_count}</td>
                  <td>{opp.company.website_status || 'Unknown'}</td>
                  <td>
                    <Link href={`/admin/opportunities/${opp.company.id}`} className="link-arrow">
                      Manage →
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
