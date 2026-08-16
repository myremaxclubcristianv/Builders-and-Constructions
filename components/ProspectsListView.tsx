'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

type Prospect = {
  id: string;
  name: string;
  slug: string;
  type: string;
  location?: string | null;
  county?: string | null;
  city?: string | null;
  website?: string | null;
  website_status: string;
  research_state: string;
  content_state: string;
  opportunity_score: number;
  opportunity_level: string;
  active_projects_count: number;
  reasons: string[];
  recommended_services: string[];
  pipeline_status: string;
  created_at: string;
};

type Props = {
  bestToContact: Prospect[];
  prospects: Prospect[];
};

const COMPANY_TYPES = [
  'Developer',
  'Construction Company',
  'General Contractor',
  'Engineering',
  'Architecture',
  'Project Management',
  'Specialist Contractor',
  'Infrastructure'
];

const CITIES = [
  'Bucharest',
  'Cluj-Napoca',
  'Timișoara',
  'Iași',
  'Brașov',
  'Constanța',
  'Ilfov',
  'Sibiu',
  'Prahova'
];

export function ProspectsListView({ bestToContact: initialBest, prospects: initialProspects }: Props) {
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects);
  const [bestList, setBestList] = useState<Prospect[]>(initialBest);

  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filtered = useMemo(() => {
    return prospects.filter(p => {
      if (levelFilter !== 'all' && p.opportunity_level !== levelFilter) return false;
      if (typeFilter !== 'all' && !p.type.toLowerCase().includes(typeFilter.toLowerCase())) return false;
      if (cityFilter !== 'all' && !(p.city || p.location || '').toLowerCase().includes(cityFilter.toLowerCase())) return false;
      if (statusFilter !== 'all' && p.pipeline_status !== statusFilter) return false;
      if (search && !`${p.name} ${p.type} ${p.location || ''}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [prospects, levelFilter, typeFilter, cityFilter, statusFilter, search]);

  async function handleMarkNotAFit(id: string, name: string) {
    if (!window.confirm(`Mark "${name}" as Not A Fit? It will be archived from active prospecting.`)) return;

    await fetch(`/api/admin/companies/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ not_a_fit: true, not_a_fit_reason: 'Disqualified during prospect evaluation.' })
    });

    setProspects(prospects.filter(p => p.id !== id));
    setBestList(bestList.filter(b => b.id !== id));
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            Commercial Targeting & Shortlist
          </div>
          <h1 className="admin-title" style={{ margin: '4px 0 0 0' }}>
            PROSPECT DATABASE & OUTREACH TARGETS
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/campaigns" className="btn">
            Target Campaigns →
          </Link>
          <Link href="/admin/opportunities" className="btn">
            Sales Dashboard →
          </Link>
        </div>
      </div>

      {/* BEST COMPANIES TO CONTACT LEADERBOARD */}
      <section className="admin-panel" style={{ marginBottom: 32, background: '#141715', border: '1px solid #d4af37' }}>
        <div className="eyebrow" style={{ color: '#d4af37' }}>
          Prioritized Commercial Leaderboard
        </div>
        <h2 style={{ fontSize: 20, margin: '6px 0 16px 0' }}>
          ★ BEST COMPANIES TO CONTACT (HIGH CONSTRUCTION ACTIVITY + DIGITAL GAP)
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {bestList.slice(0, 3).map((comp, idx) => (
            <div
              key={comp.id}
              style={{
                background: '#0d0f0e',
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
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#d4af37' }}>
                    #{idx + 1} PRIORITY TARGET
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 3,
                      background: '#86efac',
                      color: '#000'
                    }}
                  >
                    {comp.opportunity_score}/100 HIGH
                  </span>
                </div>

                <h3 style={{ fontSize: 18, color: '#fff', margin: '8px 0 2px 0' }}>{comp.name}</h3>
                <div style={{ fontSize: 12, color: '#aaa9a1' }}>
                  {comp.type} · {comp.location || 'Romania'} · {comp.active_projects_count} Active Projects
                </div>

                <div style={{ marginTop: 12 }}>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>
                    Why Outreach Now:
                  </span>
                  <ul style={{ margin: '4px 0 0 0', paddingLeft: 16, fontSize: 12, color: '#d1cfc7', lineHeight: 1.5 }}>
                    {comp.reasons.slice(0, 3).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                  {comp.recommended_services.map((srv, i) => (
                    <span key={i} style={{ fontSize: 10, padding: '2px 6px', background: '#141715', border: '1px solid #333', color: '#d4af37', borderRadius: 3 }}>
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <Link href={`/admin/opportunities/${comp.id}`} className="btn fill" style={{ flex: 1, textAlign: 'center', fontSize: 11, padding: '8px 10px' }}>
                  Open Workstation →
                </Link>
                <button
                  type="button"
                  className="btn"
                  style={{ fontSize: 10, padding: '4px 8px', color: '#fca5a5' }}
                  onClick={() => handleMarkNotAFit(comp.id, comp.name)}
                >
                  Not a Fit
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Filters Toolbar */}
      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <div className="admin-toolbar" style={{ flexWrap: 'wrap', gap: 12 }}>
          <input
            placeholder="Search prospect by name, type, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200 }}
          />
          <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className="field">
            <option value="all">All Opportunity Levels</option>
            <option value="high">High Priority (60+)</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="field">
            <option value="all">All Company Types</option>
            {COMPANY_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="field">
            <option value="all">All Regions / Cities</option>
            {CITIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Prospects Table */}
      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Type</th>
              <th>City / Region</th>
              <th>Active Projects</th>
              <th>Opportunity Score</th>
              <th>Website Status</th>
              <th>Sales Stage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.name}</strong>
                    {p.website && <div style={{ fontSize: 11, color: '#888' }}>{p.website}</div>}
                  </td>
                  <td>{p.type}</td>
                  <td>{p.city || p.location || 'Romania'}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: p.active_projects_count > 0 ? '#86efac' : '#888' }}>
                      {p.active_projects_count}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 3,
                        background: p.opportunity_score >= 60 ? '#86efac' : p.opportunity_score >= 30 ? '#fde047' : '#94a3b8',
                        color: '#000'
                      }}
                    >
                      {p.opportunity_score}/100
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 11, color: p.website_status === 'no_website' ? '#fca5a5' : '#ccc' }}>
                      {p.website_status.replaceAll('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className="badge" style={{ textTransform: 'uppercase' }}>
                      {p.pipeline_status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <Link href={`/admin/opportunities/${p.id}`} className="link-arrow">
                        Sales →
                      </Link>
                      <button
                        type="button"
                        className="btn"
                        style={{ padding: '2px 6px', fontSize: 10, color: '#888' }}
                        onClick={() => handleMarkNotAFit(p.id, p.name)}
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="empty">
                  No prospects matching current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
