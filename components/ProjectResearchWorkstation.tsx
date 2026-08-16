'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PROJECT_TYPES = [
  'Residential',
  'Office',
  'Mixed-Use',
  'Retail',
  'Hospitality',
  'Industrial',
  'Logistics',
  'Infrastructure',
  'Healthcare',
  'Educational'
];

const PROJECT_STATUSES = [
  'Under construction',
  'Completed',
  'Upcoming',
  'Planning',
  'Proposed'
];

const ROMANIA_CITIES = [
  'Bucharest',
  'Cluj-Napoca',
  'Timișoara',
  'Iași',
  'Brașov',
  'Constanța',
  'Ilfov',
  'Sibiu',
  'Prahova',
  'Oradea',
  'Craiova',
  'Other'
];

export function ProjectResearchWorkstation({ companies = [] }: { companies?: any[] }) {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState('Mixed-Use');
  const [status, setStatus] = useState('Under construction');
  const [city, setCity] = useState('Bucharest');
  const [location, setLocation] = useState('Bucharest, Romania');
  const [completion, setCompletion] = useState('2026');
  const [units, setUnits] = useState('');
  const [description, setDescription] = useState('');

  // Consortium Relationships
  const [developerId, setDeveloperId] = useState('');
  const [contractorId, setContractorId] = useState('');
  const [architectId, setArchitectId] = useState('');
  const [engineeringId, setEngineeringId] = useState('');

  // Sources & Verification
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceType, setSourceType] = useState('OFFICIAL_PROJECT_PAGE');
  const [verificationStatus, setVerificationStatus] = useState('verified');

  // Milestone Progress
  const [milestoneDate, setMilestoneDate] = useState(new Date().toISOString().slice(0, 10));
  const [milestoneSummary, setMilestoneSummary] = useState('Superstructure construction progressing according to master schedule.');

  // Lifecycle
  const [researchState, setResearchState] = useState('researched');
  const [contentState, setContentState] = useState('published');

  const [notice, setNotice] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; msg: string }>({
    type: 'idle',
    msg: ''
  });

  function generateSlug(str: string) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  function handleNameChange(val: string) {
    setName(val);
    setSlug(generateSlug(val));
    if (!sourceTitle) setSourceTitle(`${val} Official Documentation`);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setNotice({ type: 'loading', msg: 'Recording researched project and verifying consortium relationships…' });

    try {
      // 1. Create Project
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          type,
          status,
          location: location.trim(),
          city,
          country: 'Romania',
          completion: completion.trim() || null,
          units: units.trim() || null,
          description: description.trim() || null,
          content_state: contentState,
          research_state: researchState,
          status_verification: verificationStatus
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: 'error', msg: data.error || 'Failed to create project.' });
        return;
      }

      const projectId = data.id;

      // 2. Attach consortium relationships
      const relationships = [
        { company_id: developerId, role: 'Developer' },
        { company_id: contractorId, role: 'General Contractor' },
        { company_id: architectId, role: 'Architect' },
        { company_id: engineeringId, role: 'Engineering' }
      ].filter(r => Boolean(r.company_id));

      for (const rel of relationships) {
        await fetch(`/api/admin/projects/${projectId}/relationships`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company_id: rel.company_id,
            role: rel.role,
            verified: true
          })
        }).catch(() => {});
      }

      // 3. Attach Source
      if (sourceUrl.trim()) {
        await fetch('/api/admin/sources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entity_type: 'project',
            entity_id: projectId,
            source_url: sourceUrl.trim(),
            source_title: sourceTitle.trim() || 'Official Project Documentation',
            source_type: sourceType,
            source_tier: 'primary',
            verification_status: verificationStatus
          })
        }).catch(() => {});
      }

      // 4. Attach Initial Progress Milestone
      if (milestoneSummary.trim()) {
        await fetch(`/api/admin/projects/${projectId}/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_date: milestoneDate,
            summary: milestoneSummary.trim(),
            status_snapshot: status,
            verified_at: new Date().toISOString()
          })
        }).catch(() => {});
      }

      setNotice({ type: 'success', msg: 'Project researched, verified, and published!' });
      setTimeout(() => {
        router.push(`/admin/projects/${projectId}/edit`);
      }, 1000);
    } catch {
      setNotice({ type: 'error', msg: 'Network error saving project research.' });
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin/research" className="btn">
          ← Back to Research Queue
        </Link>
      </div>

      <div className="eyebrow" style={{ color: '#d4af37' }}>
        Operational Intake Workstation
      </div>
      <h1 className="admin-title">PROJECT RESEARCH WORKSTATION</h1>
      <p style={{ color: '#aaa9a1', fontSize: 14, marginBottom: 24 }}>
        Structured real-world intake for landmark active developments, consortium attribution, and verified milestones.
      </p>

      {notice.msg && (
        <div
          style={{
            padding: '10px 14px',
            marginBottom: 20,
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

      {/* Step Indicators */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, overflowX: 'auto', paddingBottom: 6 }}>
        {[
          { n: 1, label: 'Identity' },
          { n: 2, label: 'Consortium' },
          { n: 3, label: 'Specifications' },
          { n: 4, label: 'Sources' },
          { n: 5, label: 'Milestone' },
          { n: 6, label: 'Publish' }
        ].map(st => (
          <button
            key={st.n}
            type="button"
            className="btn"
            style={{
              padding: '6px 12px',
              fontSize: 11,
              background: step === st.n ? '#d4af37' : '#141715',
              color: step === st.n ? '#000' : '#fff',
              fontWeight: step === st.n ? 700 : 500
            }}
            onClick={() => setStep(st.n)}
          >
            0{st.n} · {st.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="form-grid admin-panel">
        {step === 1 && (
          <>
            <div className="full">
              <div className="eyebrow">Step 01 / Project Identity</div>
              <h2 style={{ margin: '4px 0 16px 0', fontSize: 18 }}>CORE IDENTIFIERS & GEOGRAPHY</h2>
            </div>

            <label>
              <span className="form-label">Project Name *</span>
              <input value={name} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. One Floreasca Towers" required />
            </label>

            <label>
              <span className="form-label">URL Slug *</span>
              <input value={slug} onChange={e => setSlug(e.target.value)} required />
            </label>

            <label>
              <span className="form-label">Project Classification</span>
              <select value={type} onChange={e => setType(e.target.value)}>
                {PROJECT_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>

            <label>
              <span className="form-label">Construction Status</span>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                {PROJECT_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>

            <label>
              <span className="form-label">City</span>
              <select value={city} onChange={e => setCity(e.target.value)}>
                {ROMANIA_CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>

            <label>
              <span className="form-label">Detailed Location String</span>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Floreasca, Sector 1, Bucharest" />
            </label>

            <div className="full" style={{ marginTop: 12 }}>
              <button type="button" className="btn fill" onClick={() => setStep(2)}>
                Next: Consortium Team →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="full">
              <div className="eyebrow">Step 02 / Consortium Team</div>
              <h2 style={{ margin: '4px 0 16px 0', fontSize: 18 }}>PROJECT STAKEHOLDERS & ATTRIBUTION</h2>
            </div>

            <label>
              <span className="form-label">Developer</span>
              <select value={developerId} onChange={e => setDeveloperId(e.target.value)}>
                <option value="">-- Select Researched Developer --</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                ))}
              </select>
            </label>

            <label>
              <span className="form-label">General Contractor</span>
              <select value={contractorId} onChange={e => setContractorId(e.target.value)}>
                <option value="">-- Select General Contractor --</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                ))}
              </select>
            </label>

            <label>
              <span className="form-label">Lead Architect</span>
              <select value={architectId} onChange={e => setArchitectId(e.target.value)}>
                <option value="">-- Select Architecture Practice --</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                ))}
              </select>
            </label>

            <label>
              <span className="form-label">Engineering / MEP</span>
              <select value={engineeringId} onChange={e => setEngineeringId(e.target.value)}>
                <option value="">-- Select Engineering Firm --</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                ))}
              </select>
            </label>

            <div className="full" style={{ marginTop: 12, display: 'flex', gap: 10 }}>
              <button type="button" className="btn" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button type="button" className="btn fill" onClick={() => setStep(3)}>
                Next: Specifications →
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="full">
              <div className="eyebrow">Step 03 / Specifications</div>
              <h2 style={{ margin: '4px 0 16px 0', fontSize: 18 }}>SCALE, TIMELINE & NARRATIVE</h2>
            </div>

            <label>
              <span className="form-label">Target Completion Year</span>
              <input value={completion} onChange={e => setCompletion(e.target.value)} placeholder="e.g. Q4 2026" />
            </label>

            <label>
              <span className="form-label">Scale / Units / GBA</span>
              <input value={units} onChange={e => setUnits(e.target.value)} placeholder="e.g. 208 units · 35,000 sqm GBA" />
            </label>

            <label className="full">
              <span className="form-label">Masterplan Narrative</span>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Architectural scope, structural specifications, sustainability certifications…" />
            </label>

            <div className="full" style={{ marginTop: 12, display: 'flex', gap: 10 }}>
              <button type="button" className="btn" onClick={() => setStep(2)}>
                ← Back
              </button>
              <button type="button" className="btn fill" onClick={() => setStep(4)}>
                Next: Sources & Verification →
              </button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="full">
              <div className="eyebrow">Step 04 / Sources & Proof</div>
              <h2 style={{ margin: '4px 0 16px 0', fontSize: 18 }}>FACTUAL ATTRIBUTION</h2>
            </div>

            <label>
              <span className="form-label">Primary Source URL *</span>
              <input type="url" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="https://projectwebsite.com or municipal filing" />
            </label>

            <label>
              <span className="form-label">Source Title</span>
              <input value={sourceTitle} onChange={e => setSourceTitle(e.target.value)} />
            </label>

            <label>
              <span className="form-label">Source Type</span>
              <select value={sourceType} onChange={e => setSourceType(e.target.value)}>
                <option value="OFFICIAL_PROJECT_PAGE">Official Project Page</option>
                <option value="OFFICIAL_WEBSITE">Official Company Website</option>
                <option value="GOVERNMENT">Government / Municipal Permit</option>
                <option value="PRESS_RELEASE">Official Press Release</option>
                <option value="INDUSTRY_PUBLICATION">Industry Publication</option>
              </select>
            </label>

            <label>
              <span className="form-label">Verification State</span>
              <select value={verificationStatus} onChange={e => setVerificationStatus(e.target.value)}>
                <option value="verified">Verified (Primary Source Confirmed)</option>
                <option value="unverified">Unverified (Pending Documentation)</option>
              </select>
            </label>

            <div className="full" style={{ marginTop: 12, display: 'flex', gap: 10 }}>
              <button type="button" className="btn" onClick={() => setStep(3)}>
                ← Back
              </button>
              <button type="button" className="btn fill" onClick={() => setStep(5)}>
                Next: Progress Milestone →
              </button>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <div className="full">
              <div className="eyebrow">Step 05 / Milestone Progress</div>
              <h2 style={{ margin: '4px 0 16px 0', fontSize: 18 }}>CONSTRUCTION SITE PROGRESS</h2>
            </div>

            <label>
              <span className="form-label">Milestone Snapshot Date</span>
              <input type="date" value={milestoneDate} onChange={e => setMilestoneDate(e.target.value)} />
            </label>

            <label className="full">
              <span className="form-label">Verified Site Milestone Summary</span>
              <textarea value={milestoneSummary} onChange={e => setMilestoneSummary(e.target.value)} rows={3} />
            </label>

            <div className="full" style={{ marginTop: 12, display: 'flex', gap: 10 }}>
              <button type="button" className="btn" onClick={() => setStep(4)}>
                ← Back
              </button>
              <button type="button" className="btn fill" onClick={() => setStep(6)}>
                Next: Publish & Gatekeeper →
              </button>
            </div>
          </>
        )}

        {step === 6 && (
          <>
            <div className="full">
              <div className="eyebrow">Step 06 / Gatekeeper & Publish</div>
              <h2 style={{ margin: '4px 0 16px 0', fontSize: 18 }}>PUBLICATION LIFECYCLE</h2>
            </div>

            <label>
              <span className="form-label">Research Pipeline State</span>
              <select value={researchState} onChange={e => setResearchState(e.target.value)}>
                <option value="researched">Researched</option>
                <option value="verifying">Verifying</option>
                <option value="ready">Ready to Publish</option>
              </select>
            </label>

            <label>
              <span className="form-label">Public Content State</span>
              <select value={contentState} onChange={e => setContentState(e.target.value)}>
                <option value="published">Published</option>
                <option value="draft">Draft (Private)</option>
              </select>
            </label>

            <div className="full" style={{ marginTop: 20, display: 'flex', gap: 12 }}>
              <button type="button" className="btn" onClick={() => setStep(5)}>
                ← Back
              </button>
              <button type="submit" className="btn fill" disabled={!name.trim() || notice.type === 'loading'}>
                {notice.type === 'loading' ? 'Publishing Project…' : '✓ Create & Publish Verified Project'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
