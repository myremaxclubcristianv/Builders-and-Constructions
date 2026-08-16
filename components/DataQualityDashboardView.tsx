'use client';

import { useState } from 'react';
import Link from 'next/link';
import { calculateCompanyCompleteness, calculateProjectCompleteness } from '@/lib/scoring';

type ReportProps = {
  verifiedCompaniesCount: number;
  unverifiedCompaniesCount: number;
  verifiedProjectsCount: number;
  unverifiedProjectsCount: number;
  companiesWithMissingWebsite: number;
  projectsWithMissingMedia: number;
  companies: any[];
  projects: any[];
  companyMediaMap: Record<string, number>;
  projectMediaMap: Record<string, number>;
  projectCompanyMap: Record<string, number>;
  progressMap: Record<string, number>;
};

export function DataQualityDashboardView(props: ReportProps) {
  const [tab, setTab] = useState<'companies' | 'projects'>('companies');

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

  return (
    <div>
      <div className="eyebrow" style={{ color: '#d4af37' }}>
        Database Integrity & Institutional Trust
      </div>
      <h1 className="admin-title">DATA QUALITY & PROFILE COMPLETENESS</h1>

      {/* Top Metrics Row */}
      <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 28 }}>
        <div className="metric" style={{ borderColor: '#86efac' }}>
          <span className="eyebrow" style={{ color: '#86efac' }}>VERIFIED COMPANIES</span>
          <strong style={{ color: '#86efac' }}>{props.verifiedCompaniesCount}</strong>
          <span style={{ fontSize: 11, color: '#aaa9a1' }}>{props.unverifiedCompaniesCount} unverified</span>
        </div>

        <div className="metric" style={{ borderColor: '#86efac' }}>
          <span className="eyebrow" style={{ color: '#86efac' }}>VERIFIED PROJECTS</span>
          <strong style={{ color: '#86efac' }}>{props.verifiedProjectsCount}</strong>
          <span style={{ fontSize: 11, color: '#aaa9a1' }}>{props.unverifiedProjectsCount} unverified</span>
        </div>

        <div className="metric" style={{ borderColor: '#fca5a5' }}>
          <span className="eyebrow" style={{ color: '#fca5a5' }}>MISSING WEBSITE</span>
          <strong style={{ color: '#fca5a5' }}>{props.companiesWithMissingWebsite}</strong>
          <span style={{ fontSize: 11, color: '#aaa9a1' }}>High outreach signals</span>
        </div>

        <div className="metric" style={{ borderColor: '#fde047' }}>
          <span className="eyebrow" style={{ color: '#fde047' }}>PROJECTS LACKING MEDIA</span>
          <strong style={{ color: '#fde047' }}>{props.projectsWithMissingMedia}</strong>
          <span style={{ fontSize: 11, color: '#aaa9a1' }}>Needs photography/drone</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button
          type="button"
          className="btn"
          style={{
            background: tab === 'companies' ? '#d4af37' : '#141715',
            color: tab === 'companies' ? '#000' : '#fff',
            fontWeight: tab === 'companies' ? 700 : 500
          }}
          onClick={() => setTab('companies')}
        >
          Company Completeness ({evaluatedCompanies.length})
        </button>
        <button
          type="button"
          className="btn"
          style={{
            background: tab === 'projects' ? '#d4af37' : '#141715',
            color: tab === 'projects' ? '#000' : '#fff',
            fontWeight: tab === 'projects' ? 700 : 500
          }}
          onClick={() => setTab('projects')}
        >
          Project Completeness ({evaluatedProjects.length})
        </button>
      </div>

      {/* Content List */}
      {tab === 'companies' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
          {evaluatedCompanies.map(c => {
            const isHigh = c.completeness.percentage >= 80;
            const isMed = c.completeness.percentage >= 50 && c.completeness.percentage < 80;
            const color = isHigh ? '#86efac' : isMed ? '#fde047' : '#fca5a5';

            return (
              <div
                key={c.id}
                style={{
                  background: '#141715',
                  border: '1px solid #262927',
                  borderRadius: 8,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="badge" style={{ textTransform: 'capitalize' }}>
                        {c.type?.replaceAll('_', ' ')}
                      </span>
                      <h3 style={{ fontSize: 20, margin: '8px 0 4px 0', color: '#fff' }}>{c.name}</h3>
                      <p style={{ fontSize: 12, color: '#aaa9a1', margin: 0 }}>
                        {c.location || 'Romania'} · Status: {c.content_state || 'draft'}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 26, fontWeight: 800, color }}>
                        {c.completeness.percentage}%
                      </div>
                      <span style={{ fontSize: 11, color: '#777', textTransform: 'uppercase' }}>Complete</span>
                    </div>
                  </div>

                  {/* Missing checklist */}
                  {c.completeness.missing.length > 0 && (
                    <div style={{ marginTop: 16, background: '#0d0f0e', padding: '12px 14px', borderRadius: 6 }}>
                      <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#fca5a5', fontWeight: 700 }}>
                        Missing Information:
                      </span>
                      <ul style={{ margin: '6px 0 0 0', paddingLeft: 16, fontSize: 12, color: '#b9b6ae', lineHeight: 1.5 }}>
                        {c.completeness.missing.map((m: string, idx: number) => (
                          <li key={idx}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 20, borderTop: '1px solid #222', paddingTop: 14 }}>
                  <Link href={`/admin/companies/${c.id}/edit`} className="btn fill" style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}>
                    Edit & Complete Profile →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
          {evaluatedProjects.map(p => {
            const isHigh = p.completeness.percentage >= 80;
            const isMed = p.completeness.percentage >= 50 && p.completeness.percentage < 80;
            const color = isHigh ? '#86efac' : isMed ? '#fde047' : '#fca5a5';

            return (
              <div
                key={p.id}
                style={{
                  background: '#141715',
                  border: '1px solid #262927',
                  borderRadius: 8,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="badge" style={{ textTransform: 'capitalize' }}>
                        {p.status?.replaceAll('_', ' ')}
                      </span>
                      <h3 style={{ fontSize: 20, margin: '8px 0 4px 0', color: '#fff' }}>{p.name}</h3>
                      <p style={{ fontSize: 12, color: '#aaa9a1', margin: 0 }}>
                        {p.location} · {p.type || p.project_type}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 26, fontWeight: 800, color }}>
                        {p.completeness.percentage}%
                      </div>
                      <span style={{ fontSize: 11, color: '#777', textTransform: 'uppercase' }}>Complete</span>
                    </div>
                  </div>

                  {/* Missing checklist */}
                  {p.completeness.missing.length > 0 && (
                    <div style={{ marginTop: 16, background: '#0d0f0e', padding: '12px 14px', borderRadius: 6 }}>
                      <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#fca5a5', fontWeight: 700 }}>
                        Missing Information:
                      </span>
                      <ul style={{ margin: '6px 0 0 0', paddingLeft: 16, fontSize: 12, color: '#b9b6ae', lineHeight: 1.5 }}>
                        {p.completeness.missing.map((m: string, idx: number) => (
                          <li key={idx}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 20, borderTop: '1px solid #222', paddingTop: 14 }}>
                  <Link href={`/admin/projects/${p.id}/edit`} className="btn fill" style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}>
                    Edit & Complete Project →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
