'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RealCompany, RealProject } from '@/lib/real-romanian-data';

interface CompareWorkstationProps {
  companies: RealCompany[];
  projects: RealProject[];
  initialCompanies: RealCompany[];
}

export function CompareWorkstation({ companies, projects, initialCompanies }: CompareWorkstationProps) {
  const [mode, setMode] = useState<'companies' | 'projects'>('companies');
  const [selectedCompanySlugs, setSelectedCompanySlugs] = useState<string[]>(
    initialCompanies.map(c => c.slug)
  );
  const [selectedProjectSlugs, setSelectedProjectSlugs] = useState<string[]>(
    projects.slice(0, 3).map(p => p.slug)
  );

  const selectedCompanies = selectedCompanySlugs
    .map(slug => companies.find(c => c.slug === slug))
    .filter(Boolean) as RealCompany[];

  const selectedProjects = selectedProjectSlugs
    .map(slug => projects.find(p => p.slug === slug))
    .filter(Boolean) as RealProject[];

  const handleCompanySelect = (index: number, newSlug: string) => {
    const next = [...selectedCompanySlugs];
    next[index] = newSlug;
    setSelectedCompanySlugs(next);
  };

  const handleProjectSelect = (index: number, newSlug: string) => {
    const next = [...selectedProjectSlugs];
    next[index] = newSlug;
    setSelectedProjectSlugs(next);
  };

  const addCompanyColumn = () => {
    if (selectedCompanySlugs.length < 4) {
      const unused = companies.find(c => !selectedCompanySlugs.includes(c.slug));
      if (unused) setSelectedCompanySlugs([...selectedCompanySlugs, unused.slug]);
    }
  };

  const removeCompanyColumn = (index: number) => {
    if (selectedCompanySlugs.length > 2) {
      setSelectedCompanySlugs(selectedCompanySlugs.filter((_, i) => i !== index));
    }
  };

  const addProjectColumn = () => {
    if (selectedProjectSlugs.length < 4) {
      const unused = projects.find(p => !selectedProjectSlugs.includes(p.slug));
      if (unused) setSelectedProjectSlugs([...selectedProjectSlugs, unused.slug]);
    }
  };

  const removeProjectColumn = (index: number) => {
    if (selectedProjectSlugs.length > 2) {
      setSelectedProjectSlugs(selectedProjectSlugs.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      {/* Mode Switcher */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <button
          className={`btn ${mode === 'companies' ? 'fill' : ''}`}
          onClick={() => setMode('companies')}
          style={{ fontSize: 13, padding: '10px 20px' }}
        >
          Compare Corporate Entities ({companies.length})
        </button>
        <button
          className={`btn ${mode === 'projects' ? 'fill' : ''}`}
          onClick={() => setMode('projects')}
          style={{ fontSize: 13, padding: '10px 20px' }}
        >
          Compare Construction Projects ({projects.length})
        </button>
      </div>

      {mode === 'companies' ? (
        <div>
          {/* Company Selector Controls */}
          <div
            style={{
              padding: 20,
              background: '#141715',
              border: '1px solid #262927',
              borderRadius: 6,
              marginBottom: 32
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: '#c7a675', marginBottom: 12 }}>
              DYNAMIC COMPANY SELECTOR ({selectedCompanies.length} ACTIVE COLUMNS):
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              {selectedCompanySlugs.map((slug, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <select
                    value={slug}
                    onChange={e => handleCompanySelect(idx, e.target.value)}
                    style={{
                      background: '#0e110f',
                      color: '#fff',
                      border: '1px solid #333',
                      padding: '8px 12px',
                      borderRadius: 4,
                      fontSize: 13
                    }}
                  >
                    {companies.map(c => (
                      <option key={c.slug} value={c.slug}>
                        {c.name} ({c.type.replaceAll('_', ' ')})
                      </option>
                    ))}
                  </select>
                  {selectedCompanySlugs.length > 2 && (
                    <button
                      onClick={() => removeCompanyColumn(idx)}
                      style={{ background: 'none', border: '1px solid #444', color: '#ff4d4d', borderRadius: 4, padding: '6px 10px', cursor: 'pointer' }}
                      title="Remove column"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              {selectedCompanySlugs.length < 4 && (
                <button
                  onClick={addCompanyColumn}
                  className="btn"
                  style={{ fontSize: 12, borderColor: '#c7a675', color: '#c7a675' }}
                >
                  + Add Entity
                </button>
              )}
            </div>
          </div>

          {/* Side-by-Side Companies Matrix */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #262927' }}>
                  <th style={{ padding: 16, textAlign: 'left', fontSize: 12, color: '#888', width: '22%' }}>METRIC / ATTRIBUTE</th>
                  {selectedCompanies.map(c => (
                    <th key={c.slug} style={{ padding: 16, textAlign: 'left' }}>
                      <div style={{ fontSize: 10, color: '#c7a675', fontWeight: 800 }}>{c.type.replaceAll('_', ' ').toUpperCase()}</div>
                      <div style={{ fontSize: 18, color: '#fff', fontWeight: 700, margin: '4px 0' }}>
                        <Link href={`/companies/${c.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>{c.name}</Link>
                      </div>
                      <div style={{ fontSize: 11, color: '#888' }}>{c.headquarters}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #222523' }}>
                  <td style={{ padding: 14, fontSize: 12, color: '#aaa', fontWeight: 700 }}>2025 REVENUE / TURNOVER</td>
                  {selectedCompanies.map(c => (
                    <td key={c.slug} style={{ padding: 14, fontSize: 16, fontWeight: 800, color: c.financials_2025?.revenue_eur ? '#86efac' : '#888' }}>
                      {c.financials_2025?.revenue_eur ? `€${(c.financials_2025.revenue_eur / 1000000).toFixed(1)}M` : 'NOT DISCLOSED'}
                      <div style={{ fontSize: 10, color: '#777', marginTop: 2 }}>{c.financials_2025?.status || 'N/D'}</div>
                    </td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid #222523' }}>
                  <td style={{ padding: 14, fontSize: 12, color: '#aaa', fontWeight: 700 }}>2025 NET PROFIT</td>
                  {selectedCompanies.map(c => (
                    <td key={c.slug} style={{ padding: 14, fontSize: 15, fontWeight: 700, color: c.financials_2025?.net_profit_eur ? '#38bdf8' : '#888' }}>
                      {c.financials_2025?.net_profit_eur ? `€${(c.financials_2025.net_profit_eur / 1000000).toFixed(1)}M` : 'NOT DISCLOSED'}
                    </td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid #222523' }}>
                  <td style={{ padding: 14, fontSize: 12, color: '#aaa', fontWeight: 700 }}>YoY REVENUE GROWTH</td>
                  {selectedCompanies.map(c => (
                    <td key={c.slug} style={{ padding: 14, fontSize: 14, fontWeight: 700, color: c.revenue_growth_yoy && c.revenue_growth_yoy > 0 ? '#22c55e' : '#fff' }}>
                      {c.revenue_growth_yoy ? `+${c.revenue_growth_yoy}%` : 'N/D'}
                    </td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid #222523' }}>
                  <td style={{ padding: 14, fontSize: 12, color: '#aaa', fontWeight: 700 }}>EMPLOYEE HEADCOUNT</td>
                  {selectedCompanies.map(c => (
                    <td key={c.slug} style={{ padding: 14, fontSize: 14, fontWeight: 700, color: '#fff' }}>
                      {c.employees_count ? `${c.employees_count.toLocaleString()} People` : 'N/D'}
                    </td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid #222523' }}>
                  <td style={{ padding: 14, fontSize: 12, color: '#aaa', fontWeight: 700 }}>ACTIVE CONSTRUCTION SITES</td>
                  {selectedCompanies.map(c => {
                    const activeCount = projects.filter(p => (p.developer_slug === c.slug || p.contractor_slug === c.slug) && p.status === 'under_construction').length;
                    return (
                      <td key={c.slug} style={{ padding: 14, fontSize: 15, fontWeight: 800, color: '#c7a675' }}>
                        {activeCount} Active Sites
                      </td>
                    );
                  })}
                </tr>

                <tr style={{ borderBottom: '1px solid #222523' }}>
                  <td style={{ padding: 14, fontSize: 12, color: '#aaa', fontWeight: 700 }}>CUI / IDENTIFIER</td>
                  {selectedCompanies.map(c => (
                    <td key={c.slug} style={{ padding: 14, fontSize: 12, color: '#86efac', fontWeight: 700 }}>
                      {c.cui_cif || 'N/D'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td style={{ padding: 14, fontSize: 12, color: '#aaa', fontWeight: 700 }}>VERIFICATION SCORE</td>
                  {selectedCompanies.map(c => (
                    <td key={c.slug} style={{ padding: 14, fontSize: 14, fontWeight: 800, color: c.completeness_score > 90 ? '#86efac' : '#c7a675' }}>
                      {c.completeness_score}% Verified
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          {/* Project Selector Controls */}
          <div
            style={{
              padding: 20,
              background: '#141715',
              border: '1px solid #262927',
              borderRadius: 6,
              marginBottom: 32
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: '#c7a675', marginBottom: 12 }}>
              DYNAMIC PROJECT SELECTOR ({selectedProjects.length} ACTIVE COLUMNS):
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              {selectedProjectSlugs.map((slug, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <select
                    value={slug}
                    onChange={e => handleProjectSelect(idx, e.target.value)}
                    style={{
                      background: '#0e110f',
                      color: '#fff',
                      border: '1px solid #333',
                      padding: '8px 12px',
                      borderRadius: 4,
                      fontSize: 13
                    }}
                  >
                    {projects.map(p => (
                      <option key={p.slug} value={p.slug}>
                        {p.name} ({p.project_type})
                      </option>
                    ))}
                  </select>
                  {selectedProjectSlugs.length > 2 && (
                    <button
                      onClick={() => removeProjectColumn(idx)}
                      style={{ background: 'none', border: '1px solid #444', color: '#ff4d4d', borderRadius: 4, padding: '6px 10px', cursor: 'pointer' }}
                      title="Remove column"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              {selectedProjectSlugs.length < 4 && (
                <button
                  onClick={addProjectColumn}
                  className="btn"
                  style={{ fontSize: 12, borderColor: '#c7a675', color: '#c7a675' }}
                >
                  + Add Project
                </button>
              )}
            </div>
          </div>

          {/* Side-by-Side Projects Matrix */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #262927' }}>
                  <th style={{ padding: 16, textAlign: 'left', fontSize: 12, color: '#888', width: '22%' }}>PROJECT ATTRIBUTE</th>
                  {selectedProjects.map(p => (
                    <th key={p.slug} style={{ padding: 16, textAlign: 'left' }}>
                      <div style={{ fontSize: 10, color: '#c7a675', fontWeight: 800 }}>{p.project_type.toUpperCase()}</div>
                      <div style={{ fontSize: 18, color: '#fff', fontWeight: 700, margin: '4px 0' }}>
                        <Link href={`/projects/${p.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>{p.name}</Link>
                      </div>
                      <div style={{ fontSize: 11, color: '#888' }}>{p.location}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #222523' }}>
                  <td style={{ padding: 14, fontSize: 12, color: '#aaa', fontWeight: 700 }}>STATUS</td>
                  {selectedProjects.map(p => (
                    <td key={p.slug} style={{ padding: 14, fontSize: 14, fontWeight: 800, color: p.status === 'under_construction' ? '#c7a675' : '#22c55e' }}>
                      {p.status_display}
                    </td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid #222523' }}>
                  <td style={{ padding: 14, fontSize: 12, color: '#aaa', fontWeight: 700 }}>INVESTMENT VALUE</td>
                  {selectedProjects.map(p => (
                    <td key={p.slug} style={{ padding: 14, fontSize: 16, fontWeight: 800, color: p.investment_eur ? '#86efac' : '#888' }}>
                      {p.investment_eur ? `€${(p.investment_eur / 1000000).toFixed(1)}M` : 'NOT DISCLOSED'}
                    </td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid #222523' }}>
                  <td style={{ padding: 14, fontSize: 12, color: '#aaa', fontWeight: 700 }}>SURFACE AREA / GLA</td>
                  {selectedProjects.map(p => (
                    <td key={p.slug} style={{ padding: 14, fontSize: 14, fontWeight: 700, color: '#fff' }}>
                      {p.surface_area_sqm ? `${p.surface_area_sqm.toLocaleString()} m²` : 'NOT DISCLOSED'}
                    </td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid #222523' }}>
                  <td style={{ padding: 14, fontSize: 12, color: '#aaa', fontWeight: 700 }}>DEVELOPER</td>
                  {selectedProjects.map(p => (
                    <td key={p.slug} style={{ padding: 14, fontSize: 13, fontWeight: 700, color: '#c7a675' }}>
                      <Link href={`/companies/${p.developer_slug}`} style={{ color: '#c7a675', textDecoration: 'none' }}>
                        {p.developer_name}
                      </Link>
                    </td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid #222523' }}>
                  <td style={{ padding: 14, fontSize: 12, color: '#aaa', fontWeight: 700 }}>GENERAL CONTRACTOR</td>
                  {selectedProjects.map(p => (
                    <td key={p.slug} style={{ padding: 14, fontSize: 13, color: '#fff' }}>
                      {p.contractor_slug ? (
                        <Link href={`/companies/${p.contractor_slug}`} style={{ color: '#fff', textDecoration: 'none' }}>
                          {p.contractor_name}
                        </Link>
                      ) : (
                        p.contractor_name || 'NOT DISCLOSED'
                      )}
                    </td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid #222523' }}>
                  <td style={{ padding: 14, fontSize: 12, color: '#aaa', fontWeight: 700 }}>ARCHITECT / STRUCTURAL ENGINEER</td>
                  {selectedProjects.map(p => (
                    <td key={p.slug} style={{ padding: 14, fontSize: 12, color: '#aaa' }}>
                      {p.architect_name || 'N/D'} / {p.engineering_name || 'N/D'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td style={{ padding: 14, fontSize: 12, color: '#aaa', fontWeight: 700 }}>COMPLEETNESS SCORE</td>
                  {selectedProjects.map(p => (
                    <td key={p.slug} style={{ padding: 14, fontSize: 14, fontWeight: 800, color: p.completeness_score > 90 ? '#86efac' : '#c7a675' }}>
                      {p.completeness_score}% Verified
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
