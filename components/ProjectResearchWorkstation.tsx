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
  'Industrial & Logistics',
  'Infrastructure & Civil',
  'Healthcare',
  'Educational'
];

const PROJECT_STATUSES = [
  'Under construction',
  'Completed',
  'Planned',
  'Permitting',
  'On Hold'
];

const ROMANIAN_COUNTIES = [
  'Bucharest', 'Ilfov', 'Cluj', 'Timiș', 'Iași', 'Brașov', 'Constanța', 'Sibiu', 'Prahova',
  'Bihor', 'Arad', 'Dolj', 'Galați', 'Bacău', 'Mureș', 'Argeș', 'Suceava', 'Dâmbovița'
];

const VERIFICATION_STATES = [
  { value: 'unverified', label: '01 · UNVERIFIED (Internal draft only)' },
  { value: 'publicly_verified', label: '02 · PUBLICLY VERIFIED (Public sources / permit notice)' },
  { value: 'company_verified', label: '03 · COMPANY VERIFIED (Official developer/contractor site)' },
  { value: 'confirmed_by_contact', label: '04 · CONFIRMED BY CONTACT (Direct stakeholder confirmation)' }
];

const SOURCE_TYPES = [
  'Official Project Website',
  'Official Developer Website',
  'Official General Contractor Portfolio',
  'Municipal Building Permit / Urbanism Archive',
  'Public Procurement / SEAP / SICAP Notice',
  'Credible Construction Industry Publication',
  'Official Press Release'
];

export function ProjectResearchWorkstation({ companies = [] }: { companies?: any[] }) {
  const router = useRouter();

  // 01 PROJECT IDENTITY
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [cadastreNumber, setCadastreNumber] = useState('');
  const [surfaceArea, setSurfaceArea] = useState<number | ''>('');
  const [unitCount, setUnitCount] = useState<number | ''>('');
  const [description, setDescription] = useState('');

  // 02 LOCATION
  const [county, setCounty] = useState('Bucharest');
  const [city, setCity] = useState('Bucharest');
  const [addressStreet, setAddressStreet] = useState('');

  // 03–07 STAKEHOLDER ATTRIBUTION
  const [developerId, setDeveloperId] = useState('');
  const [contractorId, setContractorId] = useState('');
  const [architectId, setArchitectId] = useState('');
  const [structuralEngineer, setStructuralEngineer] = useState('');
  const [mepEngineer, setMepEngineer] = useState('');

  // 08 PROJECT TYPE & 09 STATUS
  const [type, setType] = useState('Mixed-Use');
  const [status, setStatus] = useState('Under construction');

  // 10 CONSTRUCTION ACTIVITY & 11 TIMELINE
  const [buildingPermitNumber, setBuildingPermitNumber] = useState('');
  const [buildingPermitDate, setBuildingPermitDate] = useState('');
  const [constructionMilestone, setConstructionMilestone] = useState('Superstructure & concrete pouring in progress.');
  const [completionYear, setCompletionYear] = useState('2026');

  // 12 MEDIA
  const [imageUrl, setImageUrl] = useState('');
  const [mediaCredit, setMediaCredit] = useState('');

  // 13 SOURCES & 14 VERIFICATION
  const [sourceType, setSourceType] = useState(SOURCE_TYPES[0]);
  const [sourceUrl, setSourceUrl] = useState('');
  const [verificationEvidence, setVerificationEvidence] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('publicly_verified');

  // 15 PUBLICATION
  const [contentState, setContentState] = useState<'draft' | 'published'>('draft');

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
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(val));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setNotice({ type: 'error', msg: 'Project name is required.' });
      return;
    }

    setNotice({ type: 'loading', msg: 'Recording project dossier & verified discipline attribution…' });

    try {
      // 1. Create Project
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || generateSlug(name),
          type,
          status,
          county,
          city: city.trim() || county,
          location: `${city.trim() || county}, ${county}`,
          address_street: addressStreet.trim() || null,
          cadastre_number: cadastreNumber.trim() || null,
          surface_area: surfaceArea ? Number(surfaceArea) : null,
          unit_count: unitCount ? Number(unitCount) : null,
          completion: completionYear.trim() || null,
          description: description.trim() || null,
          image: imageUrl.trim() || null,
          structural_engineer: structuralEngineer.trim() || null,
          mep_engineer: mepEngineer.trim() || null,
          building_permit_number: buildingPermitNumber.trim() || null,
          building_permit_date: buildingPermitDate || null,
          content_state: contentState,
          research_state: 'researched',
          website_verification: verificationStatus === 'unverified' ? 'unverified' : 'verified',
          last_researched_at: new Date().toISOString()
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create project');
      }

      const created = await res.json();
      const projectId = created.id;

      // 2. Link Stakeholders
      const linkPromises = [];
      if (developerId) {
        linkPromises.push(
          fetch(`/api/admin/projects/${projectId}/relationships`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ company_id: developerId, role: 'developer', verified_at: new Date().toISOString() })
          }).catch(() => null)
        );
      }
      if (contractorId) {
        linkPromises.push(
          fetch(`/api/admin/projects/${projectId}/relationships`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ company_id: contractorId, role: 'general_contractor', verified_at: new Date().toISOString() })
          }).catch(() => null)
        );
      }
      if (architectId) {
        linkPromises.push(
          fetch(`/api/admin/projects/${projectId}/relationships`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ company_id: architectId, role: 'architect', verified_at: new Date().toISOString() })
          }).catch(() => null)
        );
      }

      // 3. Record Source Citation
      if (sourceUrl.trim()) {
        linkPromises.push(
          fetch('/api/admin/sources', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: `${sourceType} for ${name}`,
              url: sourceUrl.trim(),
              source_type: sourceType,
              verification_state: verificationStatus,
              target_entity_type: 'project',
              target_entity_id: projectId
            })
          }).catch(() => null)
        );
      }

      // 4. Record Construction Milestone Progress
      if (constructionMilestone.trim()) {
        linkPromises.push(
          fetch(`/api/admin/projects/${projectId}/progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              stage: status === 'Completed' ? 'completed' : 'structure',
              summary: constructionMilestone.trim(),
              percentage: status === 'Completed' ? 100 : 45,
              update_date: new Date().toISOString().slice(0, 10),
              source_url: sourceUrl.trim() || null
            })
          }).catch(() => null)
        );
      }

      await Promise.all(linkPromises);

      setNotice({ type: 'success', msg: `Project "${name}" recorded with verified relationships. Redirecting…` });
      setTimeout(() => {
        router.push(`/projects/${created.slug || slug}`);
      }, 1000);
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Error recording project' });
    }
  }

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            PROJECT RESEARCH WORKSTATION · PHASE 11
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            PROJECT INTELLIGENCE & DISCIPLINE ATTRIBUTION
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            15-section structured development protocol. Every company relationship (Developer, Contractor, Architect, Engineering, MEP) must be explicitly verified.
          </p>
        </div>

        <Link href="/admin/projects" className="action-btn secondary">
          ← Back to Projects
        </Link>
      </div>

      {notice.type !== 'idle' && (
        <div
          style={{
            padding: '12px 18px',
            marginBottom: 20,
            borderRadius: 4,
            fontSize: '0.85rem',
            background: notice.type === 'error' ? '#ef444422' : notice.type === 'success' ? '#22c55e22' : '#eab30822',
            border: `1px solid ${notice.type === 'error' ? '#ef4444' : notice.type === 'success' ? '#22c55e' : '#eab308'}`,
            color: notice.type === 'error' ? '#ef4444' : notice.type === 'success' ? '#22c55e' : '#eab308'
          }}
        >
          {notice.msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* 01 PROJECT IDENTITY */}
            <section className="admin-card">
              <div className="eyebrow" style={{ color: '#d4af37' }}>SECTION 01</div>
              <h2 style={{ fontSize: '1.1rem', margin: '4px 0 16px 0', fontWeight: 700 }}>PROJECT IDENTITY & SPECIFICATIONS</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Project Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => handleNameChange(e.target.value)}
                    placeholder="e.g. One Floreasca Towers, Atelier Residence"
                    required
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div>
                  <label className="form-label">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    placeholder="project-slug"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div>
                  <label className="form-label">Cadastre Number (CF)</label>
                  <input
                    type="text"
                    value={cadastreNumber}
                    onChange={e => setCadastreNumber(e.target.value)}
                    placeholder="e.g. CF 123456 Sector 1"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div>
                  <label className="form-label">Gross Built Area (GBA m²)</label>
                  <input
                    type="number"
                    value={surfaceArea}
                    onChange={e => setSurfaceArea(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 45000"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div>
                  <label className="form-label">Unit Count / Volume</label>
                  <input
                    type="number"
                    value={unitCount}
                    onChange={e => setUnitCount(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 210 units"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Project Description & Architecture Brief</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe architectural concept, structural features, and development intent."
                    rows={4}
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>
              </div>
            </section>

            {/* 02 LOCATION */}
            <section className="admin-card">
              <div className="eyebrow" style={{ color: '#d4af37' }}>SECTION 02</div>
              <h2 style={{ fontSize: '1.1rem', margin: '4px 0 16px 0', fontWeight: 700 }}>LOCATION & JURISDICTION</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="form-label">County (Territory)</label>
                  <select
                    value={county}
                    onChange={e => setCounty(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  >
                    {ROMANIAN_COUNTIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">City / Municipality</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Bucharest"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Site Street Address</label>
                  <input
                    type="text"
                    value={addressStreet}
                    onChange={e => setAddressStreet(e.target.value)}
                    placeholder="e.g. Calea Floreasca 160"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>
              </div>
            </section>

            {/* 03–07 STAKEHOLDERS & CONSORTIUM ATTRIBUTION */}
            <section className="admin-card">
              <div className="eyebrow" style={{ color: '#d4af37' }}>SECTIONS 03 TO 07</div>
              <h2 style={{ fontSize: '1.1rem', margin: '4px 0 16px 0', fontWeight: 700 }}>STAKEHOLDERS & DISCIPLINE ATTRIBUTION</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="form-label">03 · Developer / Sponsor</label>
                  <select
                    value={developerId}
                    onChange={e => setDeveloperId(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  >
                    <option value="">-- Select Registered Developer --</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">04 · General Contractor</label>
                  <select
                    value={contractorId}
                    onChange={e => setContractorId(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  >
                    <option value="">-- Select General Contractor --</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">05 · Lead Architect / Studio</label>
                  <select
                    value={architectId}
                    onChange={e => setArchitectId(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  >
                    <option value="">-- Select Architect --</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">06 · Structural Engineering Consultant</label>
                  <input
                    type="text"
                    value={structuralEngineer}
                    onChange={e => setStructuralEngineer(e.target.value)}
                    placeholder="e.g. Popp & Asociații"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">07 · MEP Engineering Consultant</label>
                  <input
                    type="text"
                    value={mepEngineer}
                    onChange={e => setMepEngineer(e.target.value)}
                    placeholder="e.g. MC General Construct, Buro Happold"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>
              </div>
            </section>

            {/* 08 PROJECT TYPE, 09 STATUS, 10 ACTIVITY & 11 TIMELINE */}
            <section className="admin-card">
              <div className="eyebrow" style={{ color: '#d4af37' }}>SECTIONS 08 TO 11</div>
              <h2 style={{ fontSize: '1.1rem', margin: '4px 0 16px 0', fontWeight: 700 }}>TYPE, STATUS, PERMIT & TIMELINE</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="form-label">08 · Project Asset Class</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  >
                    {PROJECT_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">09 · Construction Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  >
                    {PROJECT_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">10 · Building Permit Number</label>
                  <input
                    type="text"
                    value={buildingPermitNumber}
                    onChange={e => setBuildingPermitNumber(e.target.value)}
                    placeholder="e.g. AC 452 / 14.06.2024"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div>
                  <label className="form-label">Building Permit Issue Date</label>
                  <input
                    type="date"
                    value={buildingPermitDate}
                    onChange={e => setBuildingPermitDate(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div>
                  <label className="form-label">11 · Target Completion Year</label>
                  <input
                    type="text"
                    value={completionYear}
                    onChange={e => setCompletionYear(e.target.value)}
                    placeholder="e.g. Q4 2026"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Current Construction Milestone Summary</label>
                  <input
                    type="text"
                    value={constructionMilestone}
                    onChange={e => setConstructionMilestone(e.target.value)}
                    placeholder="e.g. Excavation complete, slurry walls finished, concrete foundation pouring active"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>
              </div>
            </section>

            {/* 12 MEDIA, 13 SOURCES & 14 VERIFICATION */}
            <section className="admin-card">
              <div className="eyebrow" style={{ color: '#d4af37' }}>SECTIONS 12 TO 14</div>
              <h2 style={{ fontSize: '1.1rem', margin: '4px 0 16px 0', fontWeight: 700 }}>MEDIA, SOURCES & EVIDENCE</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">12 · Hero Image URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div>
                  <label className="form-label">13 · Source Type</label>
                  <select
                    value={sourceType}
                    onChange={e => setSourceType(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  >
                    {SOURCE_TYPES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Source URL Citation *</label>
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={e => setSourceUrl(e.target.value)}
                    placeholder="https://..."
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">14 · Verification State & Evidence</label>
                  <select
                    value={verificationStatus}
                    onChange={e => setVerificationStatus(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  >
                    {VERIFICATION_STATES.map(v => (
                      <option key={v.value} value={v.value}>{v.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: 15 PUBLICATION */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="admin-card" style={{ borderTop: '4px solid var(--accent)' }}>
              <div className="eyebrow" style={{ color: '#d4af37' }}>SECTION 15</div>
              <h3 style={{ fontSize: '1.1rem', margin: '4px 0 16px 0', fontWeight: 800 }}>
                PUBLICATION CONTROL
              </h3>

              <div style={{ marginBottom: 16 }}>
                <label className="form-label">Editorial Visibility</label>
                <select
                  value={contentState}
                  onChange={e => setContentState(e.target.value as any)}
                  style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                >
                  <option value="draft">Draft (Internal Research Only)</option>
                  <option value="published">Published (Public Profile Live)</option>
                </select>
              </div>

              <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: 20, lineHeight: 1.5 }}>
                Published projects appear immediately on the public platform with verified consortium credits. Internal research notes remain protected.
              </p>

              <button
                type="submit"
                disabled={notice.type === 'loading'}
                className="action-btn primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.85rem', fontWeight: 800 }}
              >
                {notice.type === 'loading' ? 'Recording Project...' : 'SAVE PROJECT DOSSIER →'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
