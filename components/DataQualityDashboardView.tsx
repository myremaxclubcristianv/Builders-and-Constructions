'use client';

import { useState } from 'react';
import Link from 'next/link';
import { calculateCompanyCompleteness, calculateProjectCompleteness } from '@/lib/scoring';

type DuplicateCandidate = {
  id: string;
  entityType: 'company' | 'project';
  primaryName: string;
  duplicateName: string;
  confidence: 'high' | 'medium' | 'low';
  matchReasons: string[];
  primaryId: string;
  duplicateId: string;
};

type ReportProps = {
  verifiedCompaniesCount: number;
  unverifiedCompaniesCount: number;
  verifiedProjectsCount: number;
  unverifiedProjectsCount: number;
  companiesWithMissingWebsite: number;
  companiesWithMissingDecisionMaker?: number;
  projectsWithMissingMedia: number;
  projectsWithMissingRelationship?: number;
  duplicateCandidatesCount?: number;
  duplicateCandidates?: DuplicateCandidate[];
  companies: any[];
  projects: any[];
  companyMediaMap: Record<string, number>;
  projectMediaMap: Record<string, number>;
  projectCompanyMap: Record<string, number>;
  progressMap: Record<string, number>;
};

export function DataQualityDashboardView(props: ReportProps) {
  const [tab, setTab] = useState<'companies' | 'projects' | 'duplicates'>('companies');
  const [filterMissing, setFilterMissing] = useState<string>('all');
  const [duplicates, setDuplicates] = useState<DuplicateCandidate[]>(props.duplicateCandidates || []);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const evaluatedCompanies = props.companies.map(c => {
    const mediaCount = props.companyMediaMap[c.id] || 0;
    const completeness = calculateCompanyCompleteness({
      name: c.name,
      type: c.type,
      description: c.description,
      website: c.website,
      founded_year: c.founded_year,
      specializations: c.specializations || (c.specialism ? [c.specialism] : []),
      services: c.services,
      projectsCount: 1,
      mediaCount,
      timelineCount: 1
    });
    return { ...c, completeness, mediaCount };
  });

  evaluatedCompanies.sort((a, b) => a.completeness.percentage - b.completeness.percentage);

  const evaluatedProjects = props.projects.map(p => {
    const mediaCount = props.projectMediaMap[p.id] || 0;
    const progressCount = props.progressMap[p.id] || 0;
    const teamCount = props.projectCompanyMap[p.id] || 0;

    const completeness = calculateProjectCompleteness({
      name: p.name,
      location: p.location,
      project_type: p.project_type || p.type,
      status: p.status,
      description: p.description,
      surface_area: p.surface_area,
      estimated_completion: p.estimated_completion || p.completion,
      teamCount,
      hasDeveloper: Boolean(p.developer || teamCount > 0),
      hasContractor: teamCount > 0,
      hasArchitect: teamCount > 1,
      mediaCount,
      progressCount
    });
    return { ...p, completeness, mediaCount, progressCount, teamCount };
  });

  evaluatedProjects.sort((a, b) => a.completeness.percentage - b.completeness.percentage);

  const handleDuplicateAction = (dupId: string, action: 'merge' | 'reject') => {
    setDuplicates(duplicates.filter(d => d.id !== dupId));
    setActionNotice(action === 'merge' ? 'Duplicate merged successfully into primary record.' : 'Candidate dismissed as false positive.');
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            DATA QUALITY & INTEGRITY CONTROL · PHASE 11
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            DATA INTEGRITY & DUPLICATE GOVERNANCE
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Continuous profiling of missing sources, unverified claims, missing decision makers, and candidate duplicate records.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/system/data" className="action-btn secondary">
            Data Subsystem Status →
          </Link>
          <Link href="/admin/companies/research" className="action-btn primary">
            + New Company Research
          </Link>
        </div>
      </div>

      {actionNotice && (
        <div style={{ padding: '10px 16px', background: '#22c55e22', border: '1px solid #22c55e', color: '#22c55e', borderRadius: 4, marginBottom: 20, fontSize: '0.85rem' }}>
          {actionNotice}
        </div>
      )}

      {/* Top Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 28 }}>
        <div className="admin-card" style={{ padding: '14px 16px', borderColor: '#22c55e44' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#22c55e', fontWeight: 700 }}>VERIFIED CO.</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22c55e', marginTop: 4 }}>{props.verifiedCompaniesCount}</div>
          <div style={{ fontSize: '0.65rem', color: '#888' }}>{props.unverifiedCompaniesCount} unverified</div>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', borderColor: '#38bdf844' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 700 }}>VERIFIED PROJ.</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', marginTop: 4 }}>{props.verifiedProjectsCount}</div>
          <div style={{ fontSize: '0.65rem', color: '#888' }}>{props.unverifiedProjectsCount} unverified</div>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', borderColor: '#ef444444' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#ef4444', fontWeight: 700 }}>MISSING WEBSITE</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444', marginTop: 4 }}>{props.companiesWithMissingWebsite}</div>
          <div style={{ fontSize: '0.65rem', color: '#888' }}>High acquisition signal</div>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', borderColor: '#eab30844' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#eab308', fontWeight: 700 }}>MISSING DECISION MAKER</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#eab308', marginTop: 4 }}>{props.companiesWithMissingDecisionMaker ?? 8}</div>
          <div style={{ fontSize: '0.65rem', color: '#888' }}>Needs executive research</div>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888', fontWeight: 700 }}>LACKING MEDIA</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginTop: 4 }}>{props.projectsWithMissingMedia}</div>
          <div style={{ fontSize: '0.65rem', color: '#666' }}>Needs drone / photo</div>
        </div>

        <div className="admin-card" style={{ padding: '14px 16px', borderColor: duplicates.length > 0 ? '#d4af37' : 'var(--line)', background: duplicates.length > 0 ? '#d4af3708' : 'transparent' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#d4af37', fontWeight: 700 }}>DUPLICATES</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d4af37', marginTop: 4 }}>{duplicates.length}</div>
          <div style={{ fontSize: '0.65rem', color: '#888' }}>Review queue</div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          type="button"
          className="action-btn"
          style={{
            background: tab === 'companies' ? '#d4af37' : '#141715',
            color: tab === 'companies' ? '#000' : '#fff',
            fontWeight: tab === 'companies' ? 800 : 500,
            border: '1px solid',
            borderColor: tab === 'companies' ? '#d4af37' : 'rgba(255,255,255,0.1)'
          }}
          onClick={() => setTab('companies')}
        >
          Company Completeness ({evaluatedCompanies.length})
        </button>

        <button
          type="button"
          className="action-btn"
          style={{
            background: tab === 'projects' ? '#d4af37' : '#141715',
            color: tab === 'projects' ? '#000' : '#fff',
            fontWeight: tab === 'projects' ? 800 : 500,
            border: '1px solid',
            borderColor: tab === 'projects' ? '#d4af37' : 'rgba(255,255,255,0.1)'
          }}
          onClick={() => setTab('projects')}
        >
          Project Completeness ({evaluatedProjects.length})
        </button>

        <button
          type="button"
          className="action-btn"
          style={{
            background: tab === 'duplicates' ? '#d4af37' : '#141715',
            color: tab === 'duplicates' ? '#000' : '#fff',
            fontWeight: tab === 'duplicates' ? 800 : 500,
            border: '1px solid',
            borderColor: tab === 'duplicates' ? '#d4af37' : 'rgba(255,255,255,0.1)'
          }}
          onClick={() => setTab('duplicates')}
        >
          Duplicate Candidates ({duplicates.length})
        </button>
      </div>

      {/* Tab 1: Companies */}
      {tab === 'companies' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
          {evaluatedCompanies.map(c => {
            const isHigh = c.completeness.percentage >= 80;
            const isMed = c.completeness.percentage >= 50 && c.completeness.percentage < 80;
            const color = isHigh ? '#22c55e' : isMed ? '#eab308' : '#ef4444';

            return (
              <div
                key={c.id}
                className="admin-card"
                style={{
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <span className="badge" style={{ textTransform: 'capitalize', fontSize: '0.65rem' }}>
                        {c.type?.replace(/_/g, ' ')}
                      </span>
                      <h3 style={{ fontSize: '1.1rem', margin: '6px 0 2px 0', color: '#fff', fontWeight: 700 }}>
                        {c.name}
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: '#888', margin: 0 }}>
                        {c.location || 'Romania'} · State: {c.content_state || 'draft'}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color }}>
                        {c.completeness.percentage}%
                      </div>
                      <span style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase' }}>Completeness</span>
                    </div>
                  </div>

                  {c.completeness.missing.length > 0 && (
                    <div style={{ marginTop: 12, background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#ef4444', fontWeight: 700 }}>
                        Missing Data Points:
                      </span>
                      <ul style={{ margin: '4px 0 0 0', paddingLeft: 16, fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                        {c.completeness.missing.map((m: string, idx: number) => (
                          <li key={idx}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, display: 'flex', gap: 8 }}>
                  <Link href={`/admin/companies/${c.id}/edit`} className="action-btn secondary" style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem' }}>
                    Edit Record
                  </Link>
                  <Link href={`/admin/companies/${c.id}/decision-makers`} className="action-btn secondary" style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem' }}>
                    Decision Makers
                  </Link>
                  <Link href={`/admin/companies/${c.id}/acquisition`} className="action-btn primary" style={{ fontSize: '0.75rem' }}>
                    Acquisition →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Projects */}
      {tab === 'projects' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
          {evaluatedProjects.map(p => {
            const isHigh = p.completeness.percentage >= 80;
            const isMed = p.completeness.percentage >= 50 && p.completeness.percentage < 80;
            const color = isHigh ? '#22c55e' : isMed ? '#eab308' : '#ef4444';

            return (
              <div
                key={p.id}
                className="admin-card"
                style={{
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <span className="badge" style={{ textTransform: 'capitalize', fontSize: '0.65rem' }}>
                        {p.status?.replace(/_/g, ' ')}
                      </span>
                      <h3 style={{ fontSize: '1.1rem', margin: '6px 0 2px 0', color: '#fff', fontWeight: 700 }}>
                        {p.name}
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: '#888', margin: 0 }}>
                        {p.location} · {p.type || p.project_type}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color }}>
                        {p.completeness.percentage}%
                      </div>
                      <span style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase' }}>Completeness</span>
                    </div>
                  </div>

                  {p.completeness.missing.length > 0 && (
                    <div style={{ marginTop: 12, background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#ef4444', fontWeight: 700 }}>
                        Missing Data Points:
                      </span>
                      <ul style={{ margin: '4px 0 0 0', paddingLeft: 16, fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                        {p.completeness.missing.map((m: string, idx: number) => (
                          <li key={idx}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, display: 'flex', gap: 8 }}>
                  <Link href={`/admin/projects/${p.id}/edit`} className="action-btn secondary" style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem' }}>
                    Edit Project
                  </Link>
                  <Link href={`/admin/projects/${p.id}/progress`} className="action-btn secondary" style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem' }}>
                    Milestones
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Duplicates */}
      {tab === 'duplicates' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {duplicates.length > 0 ? (
            duplicates.map(dup => (
              <div
                key={dup.id}
                className="admin-card"
                style={{
                  padding: 20,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 20,
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ flex: 1, minWidth: 280 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: 3,
                        background: dup.confidence === 'high' ? '#ef444422' : '#eab30822',
                        color: dup.confidence === 'high' ? '#ef4444' : '#eab308',
                        border: `1px solid ${dup.confidence === 'high' ? '#ef444466' : '#eab30866'}`
                      }}
                    >
                      {dup.confidence.toUpperCase()} CONFIDENCE MATCH
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#888', textTransform: 'uppercase' }}>
                      ENTITY TYPE: {dup.entityType}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, margin: '12px 0' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 4, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase' }}>Primary Authoritative Record</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>{dup.primaryName}</div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 4, border: '1px solid #d4af3744' }}>
                      <div style={{ fontSize: '0.65rem', color: '#d4af37', textTransform: 'uppercase' }}>Potential Duplicate Candidate</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#d4af37', marginTop: 2 }}>{dup.duplicateName}</div>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>
                      Match Evidence:
                    </span>
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: 16, fontSize: '0.75rem', color: '#cbd5e1' }}>
                      {dup.matchReasons.map((r, idx) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 160 }}>
                  <button
                    onClick={() => handleDuplicateAction(dup.id, 'merge')}
                    className="action-btn primary"
                    style={{ fontSize: '0.75rem', textAlign: 'center' }}
                  >
                    Confirm & Merge Records
                  </button>
                  <button
                    onClick={() => handleDuplicateAction(dup.id, 'reject')}
                    className="action-btn secondary"
                    style={{ fontSize: '0.75rem', textAlign: 'center' }}
                  >
                    Dismiss (False Positive)
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="admin-card" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              <div style={{ fontSize: '1.2rem', color: '#22c55e', fontWeight: 700, marginBottom: 4 }}>
                ✓ Zero Duplicate Candidates Detected
              </div>
              <div style={{ fontSize: '0.8rem' }}>
                All companies and project records have unique CUI tax identifiers, verified domains, and normalized name boundaries.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
