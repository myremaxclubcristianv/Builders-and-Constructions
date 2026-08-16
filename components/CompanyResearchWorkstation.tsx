'use client';

import { FormEvent, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { calculateOpportunityScore, OPPORTUNITY_SIGNAL_WEIGHTS } from '@/lib/scoring';
import { calculateDeterministicAcquisitionPriority } from '@/lib/acquisition';

const ALL_SIGNALS = Object.keys(OPPORTUNITY_SIGNAL_WEIGHTS);

const ALL_SERVICES = [
  'Website',
  'Branding',
  'Project Marketing',
  'Photography',
  'Video',
  'SEO',
  'Social Media',
  'Lead Generation',
  'Paid Advertising'
];

const COMPANY_TYPES = [
  { value: 'General Contractor', label: 'General Contractor' },
  { value: 'Developer', label: 'Developer' },
  { value: 'Subcontractor', label: 'Specialist Subcontractor' },
  { value: 'Architect', label: 'Architecture & Design' },
  { value: 'Engineering', label: 'Engineering & Structural' },
  { value: 'Project Management', label: 'Project Management' },
  { value: 'Infrastructure', label: 'Infrastructure & Civil' }
];

const ROMANIAN_COUNTIES = [
  'Bucharest', 'Ilfov', 'Cluj', 'Timiș', 'Iași', 'Brașov', 'Constanța', 'Sibiu', 'Prahova',
  'Bihor', 'Arad', 'Dolj', 'Galați', 'Bacău', 'Mureș', 'Argeș', 'Suceava', 'Dâmbovița'
];

const VERIFICATION_STATES = [
  { value: 'unverified', label: '01 · UNVERIFIED (Internal draft only)' },
  { value: 'publicly_verified', label: '02 · PUBLICLY VERIFIED (Public sources / registry)' },
  { value: 'company_verified', label: '03 · COMPANY VERIFIED (Official domain / tender filing)' },
  { value: 'confirmed_by_contact', label: '04 · CONFIRMED BY CONTACT (Direct executive contact)' }
];

const SOURCE_TYPES = [
  'Official Company Website',
  'Official Project Website',
  'Developer Press Release',
  'Ministry / Public Institution / SEAP',
  'Trade Register / ONRC / Official Registry',
  'Corporate LinkedIn / Social Channel',
  'Credible Construction Publication'
];

export function CompanyResearchWorkstation() {
  const router = useRouter();

  // 01 IDENTITY
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [legalName, setLegalName] = useState('');
  const [cuiCif, setCuiCif] = useState('');
  const [foundedYear, setFoundedYear] = useState<number | ''>('');
  const [positioning, setPositioning] = useState('');
  const [description, setDescription] = useState('');

  // 02 CLASSIFICATION
  const [type, setType] = useState('General Contractor');
  const [specialism, setSpecialism] = useState('');

  // 03 GEOGRAPHY
  const [county, setCounty] = useState('Bucharest');
  const [city, setCity] = useState('Bucharest');
  const [addressStreet, setAddressStreet] = useState('');

  // 04 OFFICIAL WEBSITE
  const [website, setWebsite] = useState('');
  const [websiteStatus, setWebsiteStatus] = useState('none');
  const [websiteVerification, setWebsiteVerification] = useState<'verified' | 'unverified'>('verified');

  // 05 DIGITAL PRESENCE
  const [mobileExperience, setMobileExperience] = useState('needs_improvement');
  const [socialPresence, setSocialPresence] = useState('none');
  const [seoStatus, setSeoStatus] = useState('poor');
  const [leadGenStatus, setLeadGenStatus] = useState('missing');

  // 06 PROJECT PORTFOLIO
  const [portfolioQuality, setPortfolioQuality] = useState('outdated');
  const [connectedProjectsNotes, setConnectedProjectsNotes] = useState('');

  // 07 CONSTRUCTION ACTIVITY
  const [activeSitesCount, setActiveSitesCount] = useState<number>(1);
  const [recentMilestone, setRecentMilestone] = useState('');

  // 08 DECISION MAKERS
  const [primaryDmName, setPrimaryDmName] = useState('');
  const [primaryDmRole, setPrimaryDmRole] = useState('CEO / Managing Director');
  const [primaryDmContact, setPrimaryDmContact] = useState('');
  const [primaryDmVerified, setPrimaryDmVerified] = useState('publicly_verified');

  // 09 SOURCES
  const [sourceType, setSourceType] = useState(SOURCE_TYPES[0]);
  const [sourceUrl, setSourceUrl] = useState('');
  const [verificationEvidence, setVerificationEvidence] = useState('');
  const [overallVerification, setOverallVerification] = useState('publicly_verified');

  // 10 COMMERCIAL GAP & 11 OPPORTUNITY
  const [signals, setSignals] = useState<string[]>(['No website', 'Strong portfolio']);
  const [services, setServices] = useState<string[]>(['Website', 'Project Marketing']);
  const [salesNotes, setSalesNotes] = useState('');

  // 12 PUBLICATION
  const [contentState, setContentState] = useState<'draft' | 'published'>('draft');

  const [notice, setNotice] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; msg: string }>({
    type: 'idle',
    msg: ''
  });

  function handleNameChange(newName: string) {
    setName(newName);
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
      setSlug(newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }

  function toggleSignal(item: string) {
    if (signals.includes(item)) setSignals(signals.filter(s => s !== item));
    else setSignals([...signals, item]);
  }

  function toggleService(item: string) {
    if (services.includes(item)) setServices(services.filter(s => s !== item));
    else setServices([...services, item]);
  }

  // Real-time opportunity score calculation
  const { score, level, reasons } = useMemo(() => {
    return calculateOpportunityScore(signals, 0);
  }, [signals]);

  // Real-time deterministic acquisition priority
  const priorityResult = useMemo(() => {
    return calculateDeterministicAcquisitionPriority({
      companyId: 'new-research',
      companyName: name || 'New Prospect',
      companyType: type,
      city,
      county,
      website,
      websiteStatus,
      websiteVerification,
      activeProjects: activeSitesCount > 0 ? Array.from({ length: activeSitesCount }, (_, i) => ({
        id: `site-${i}`,
        name: `Active Site #${i + 1}`,
        status: 'under_construction'
      })) : [],
      baseOpportunityScore: score,
      opportunitySignals: signals,
      primaryDecisionMaker: primaryDmName ? {
        name: primaryDmName,
        role: primaryDmRole,
        verificationState: primaryDmVerified,
        email: primaryDmContact.includes('@') ? primaryDmContact : null,
        phone: !primaryDmContact.includes('@') ? primaryDmContact : null
      } : null
    });
  }, [name, type, city, county, website, websiteStatus, websiteVerification, activeSitesCount, score, signals, primaryDmName, primaryDmRole, primaryDmContact, primaryDmVerified]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setNotice({ type: 'error', msg: 'Company name is required.' });
      return;
    }

    setNotice({ type: 'loading', msg: 'Recording researched company dossier & verification proofs…' });
    try {
      // 1. Create company record
      const compRes = await fetch('/api/admin/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          legal_name: legalName.trim() || null,
          cui_cif: cuiCif.trim() || null,
          type,
          county,
          city: city.trim() || county,
          location: `${city.trim() || county}, ${county}`,
          address_street: addressStreet.trim() || null,
          founded_year: foundedYear ? Number(foundedYear) : null,
          positioning: positioning.trim() || null,
          description: description.trim() || null,
          specialism: specialism.trim() || null,
          website: website.trim() || null,
          website_verification: websiteVerification,
          content_state: contentState,
          research_state: 'researched',
          verification_evidence: verificationEvidence.trim() || null,
          last_researched_at: new Date().toISOString(),
          digital_audit_data: {
            websiteStatus,
            mobileExperience,
            socialPresence,
            seoStatus,
            leadGenStatus,
            portfolioQuality,
            connectedProjectsNotes
          }
        })
      });

      if (!compRes.ok) {
        const err = await compRes.json();
        throw new Error(err.error || 'Failed to save company record');
      }

      const createdComp = await compRes.json();
      const compId = createdComp.id;

      // 2. Record source attribution if URL provided
      if (sourceUrl.trim()) {
        await fetch('/api/admin/sources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `${sourceType} for ${name}`,
            url: sourceUrl.trim(),
            source_type: sourceType,
            verification_state: overallVerification,
            target_entity_type: 'company',
            target_entity_id: compId
          })
        }).catch(() => null);
      }

      // 3. Record primary decision maker if provided
      if (primaryDmName.trim()) {
        await fetch('/api/admin/decision-makers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company_id: compId,
            name: primaryDmName.trim(),
            role: primaryDmRole.trim(),
            email: primaryDmContact.includes('@') ? primaryDmContact.trim() : null,
            phone: !primaryDmContact.includes('@') ? primaryDmContact.trim() : null,
            verification_state: primaryDmVerified,
            is_primary: true
          })
        }).catch(() => null);
      }

      // 4. Save opportunity score and acquisition priority
      await fetch(`/api/admin/companies/${compId}/relationships`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upsert_opportunity_score',
          opportunityScore: {
            opportunity_score: score,
            priority_level: level,
            signals,
            recommended_services: services,
            score_reasons: reasons,
            acquisition_priority: priorityResult.score
          }
        })
      }).catch(() => null);

      setNotice({ type: 'success', msg: `Dossier saved for "${name}". Redirecting…` });
      setTimeout(() => {
        router.push(`/admin/companies/${compId}/acquisition`);
      }, 1000);
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'An error occurred during submission.' });
    }
  }

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            PROFESSIONAL RESEARCH WORKSTATION · PHASE 11
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            COMPANY INTELLIGENCE & ACQUISITION DOSSIER
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Structured 12-section research protocol. Every factual record must be accompanied by explicit source attribution and verification state.
          </p>
        </div>

        <Link href="/admin/companies" className="action-btn secondary">
          ← Back to Companies
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

            {/* 01 IDENTITY */}
            <section className="admin-card">
              <div className="eyebrow" style={{ color: '#d4af37' }}>SECTION 01</div>
              <h2 style={{ fontSize: '1.1rem', margin: '4px 0 16px 0', fontWeight: 700 }}>COMPANY IDENTITY</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Brand / Operating Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => handleNameChange(e.target.value)}
                    placeholder="e.g. Bog'Art, Erbașu Construcții, One United Properties"
                    required
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div>
                  <label className="form-label">Legal Name (ONRC)</label>
                  <input
                    type="text"
                    value={legalName}
                    onChange={e => setLegalName(e.target.value)}
                    placeholder="e.g. BOG'ART S.R.L."
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div>
                  <label className="form-label">CUI / CIF Identifier</label>
                  <input
                    type="text"
                    value={cuiCif}
                    onChange={e => setCuiCif(e.target.value)}
                    placeholder="e.g. RO 1234567"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div>
                  <label className="form-label">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    placeholder="slug-identifier"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div>
                  <label className="form-label">Founded Year</label>
                  <input
                    type="number"
                    value={foundedYear}
                    onChange={e => setFoundedYear(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 1991"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Executive Positioning</label>
                  <input
                    type="text"
                    value={positioning}
                    onChange={e => setPositioning(e.target.value)}
                    placeholder="e.g. Tier 1 Institutional General Contractor with multidisciplinary delivery capacity"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Factual Overview & History</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Provide verified company background, operational footprint, and track record."
                    rows={4}
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>
              </div>
            </section>

            {/* 02 CLASSIFICATION & 03 GEOGRAPHY */}
            <section className="admin-card">
              <div className="eyebrow" style={{ color: '#d4af37' }}>SECTIONS 02 & 03</div>
              <h2 style={{ fontSize: '1.1rem', margin: '4px 0 16px 0', fontWeight: 700 }}>CLASSIFICATION & GEOGRAPHY</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="form-label">Primary Sector Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  >
                    {COMPANY_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Specialism Scope</label>
                  <input
                    type="text"
                    value={specialism}
                    onChange={e => setSpecialism(e.target.value)}
                    placeholder="e.g. High-Rise Commercial, Infrastructure, Luxury Residential"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

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
                    placeholder="e.g. Bucharest, Sector 1"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Headquarters Street Address</label>
                  <input
                    type="text"
                    value={addressStreet}
                    onChange={e => setAddressStreet(e.target.value)}
                    placeholder="e.g. Str. Aviatorilor 42"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>
              </div>
            </section>

            {/* 04 OFFICIAL WEBSITE & 05 DIGITAL PRESENCE */}
            <section className="admin-card">
              <div className="eyebrow" style={{ color: '#d4af37' }}>SECTIONS 04 & 05</div>
              <h2 style={{ fontSize: '1.1rem', margin: '4px 0 16px 0', fontWeight: 700 }}>OFFICIAL WEBSITE & DIGITAL MATURITY</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Official Website URL</label>
                  <input
                    type="url"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="https://company.ro"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div>
                  <label className="form-label">Website Status</label>
                  <select
                    value={websiteStatus}
                    onChange={e => setWebsiteStatus(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  >
                    <option value="none">No Website Available</option>
                    <option value="broken">Broken / Under Construction</option>
                    <option value="outdated">Outdated / Legacy Non-Responsive</option>
                    <option value="basic">Basic Template</option>
                    <option value="modern">Modern & Fast</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Website Verification</label>
                  <select
                    value={websiteVerification}
                    onChange={e => setWebsiteVerification(e.target.value as any)}
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  >
                    <option value="verified">Verified Official Domain</option>
                    <option value="unverified">Unverified / Pending Check</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Mobile Experience</label>
                  <select
                    value={mobileExperience}
                    onChange={e => setMobileExperience(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  >
                    <option value="missing">Missing / Broken</option>
                    <option value="poor">Poor (Non-Responsive)</option>
                    <option value="needs_improvement">Needs Improvement</option>
                    <option value="good">Good Mobile UX</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Lead Generation Architecture</label>
                  <select
                    value={leadGenStatus}
                    onChange={e => setLeadGenStatus(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  >
                    <option value="missing">Missing (Mailto only / No CTA)</option>
                    <option value="weak">Weak (Static Form)</option>
                    <option value="active">Active Multi-Step Intake</option>
                  </select>
                </div>
              </div>
            </section>

            {/* 06 PORTFOLIO & 07 CONSTRUCTION ACTIVITY */}
            <section className="admin-card">
              <div className="eyebrow" style={{ color: '#d4af37' }}>SECTIONS 06 & 07</div>
              <h2 style={{ fontSize: '1.1rem', margin: '4px 0 16px 0', fontWeight: 700 }}>PORTFOLIO PRESENTATION & CONSTRUCTION ACTIVITY</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="form-label">Portfolio Quality</label>
                  <select
                    value={portfolioQuality}
                    onChange={e => setPortfolioQuality(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  >
                    <option value="missing">No Public Portfolio</option>
                    <option value="outdated">Outdated / Low-Res Phone Photos</option>
                    <option value="moderate">Moderate Portfolio</option>
                    <option value="high_end">High-End Architectural Media</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Active Construction Sites Count</label>
                  <input
                    type="number"
                    min={0}
                    value={activeSitesCount}
                    onChange={e => setActiveSitesCount(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Recent Verified Milestone / Signal</label>
                  <input
                    type="text"
                    value={recentMilestone}
                    onChange={e => setRecentMilestone(e.target.value)}
                    placeholder="e.g. Awarded general contractor contract for Riverside Quarter (Phase 2)"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Connected Projects & Role Attribution Notes</label>
                  <textarea
                    value={connectedProjectsNotes}
                    onChange={e => setConnectedProjectsNotes(e.target.value)}
                    placeholder="List verified project associations and their evidence source."
                    rows={2}
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>
              </div>
            </section>

            {/* 08 DECISION MAKERS */}
            <section className="admin-card">
              <div className="eyebrow" style={{ color: '#d4af37' }}>SECTION 08</div>
              <h2 style={{ fontSize: '1.1rem', margin: '4px 0 16px 0', fontWeight: 700 }}>PRIMARY DECISION MAKER</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="form-label">Executive Name *</label>
                  <input
                    type="text"
                    value={primaryDmName}
                    onChange={e => setPrimaryDmName(e.target.value)}
                    placeholder="e.g. Cristian Erbașu, Dan Boghiu"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div>
                  <label className="form-label">Executive Role</label>
                  <input
                    type="text"
                    value={primaryDmRole}
                    onChange={e => setPrimaryDmRole(e.target.value)}
                    placeholder="e.g. CEO, Managing Director, Commercial Director"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div>
                  <label className="form-label">Direct Contact (Email or Phone)</label>
                  <input
                    type="text"
                    value={primaryDmContact}
                    onChange={e => setPrimaryDmContact(e.target.value)}
                    placeholder="executive@company.ro or +40..."
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div>
                  <label className="form-label">Contact Verification State</label>
                  <select
                    value={primaryDmVerified}
                    onChange={e => setPrimaryDmVerified(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  >
                    {VERIFICATION_STATES.map(v => (
                      <option key={v.value} value={v.value}>{v.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* 09 SOURCES & VERIFICATION */}
            <section className="admin-card">
              <div className="eyebrow" style={{ color: '#d4af37' }}>SECTION 09</div>
              <h2 style={{ fontSize: '1.1rem', margin: '4px 0 16px 0', fontWeight: 700 }}>SOURCES & AUDIT TRAIL</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="form-label">Source Type</label>
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
                  <label className="form-label">Verification Evidence & Notes</label>
                  <input
                    type="text"
                    value={verificationEvidence}
                    onChange={e => setVerificationEvidence(e.target.value)}
                    placeholder="Verified via ONRC registry filing and official company website header"
                    style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                  />
                </div>

                <div>
                  <label className="form-label">Overall Dossier Verification State</label>
                  <select
                    value={overallVerification}
                    onChange={e => setOverallVerification(e.target.value)}
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

          {/* RIGHT COLUMN: 10 COMMERCIAL GAP, 11 OPPORTUNITY & 12 PUBLICATION */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Opportunity & Acquisition Priority Panel */}
            <div className="admin-card" style={{ borderTop: '4px solid var(--accent)' }}>
              <div className="eyebrow" style={{ color: '#d4af37' }}>SECTIONS 10 & 11</div>
              <h3 style={{ fontSize: '1.1rem', margin: '4px 0 16px 0', fontWeight: 800 }}>
                ACQUISITION PRIORITY
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Opportunity Index</span>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: score >= 60 ? '#22c55e' : '#eab308' }}>
                    {score}/100
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Priority Tier</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: priorityResult.tier === 'HIGH' ? '#22c55e' : '#eab308' }}>
                    {priorityResult.tier} ({priorityResult.score} pts)
                  </div>
                </div>
              </div>

              {/* Signals */}
              <div style={{ marginBottom: 16 }}>
                <label className="form-label" style={{ marginBottom: 8, display: 'block' }}>Commercial Gap Signals</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {ALL_SIGNALS.map(sig => {
                    const active = signals.includes(sig);
                    return (
                      <button
                        type="button"
                        key={sig}
                        onClick={() => toggleSignal(sig)}
                        style={{
                          fontSize: '0.7rem',
                          padding: '4px 8px',
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: active ? '#d4af37' : 'rgba(255,255,255,0.1)',
                          background: active ? '#d4af3722' : '#0d0f0e',
                          color: active ? '#d4af37' : '#888',
                          cursor: 'pointer'
                        }}
                      >
                        {sig}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recommended Services */}
              <div style={{ marginBottom: 16 }}>
                <label className="form-label" style={{ marginBottom: 8, display: 'block' }}>Recommended Service Suite</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {ALL_SERVICES.map(srv => {
                    const active = services.includes(srv);
                    return (
                      <button
                        type="button"
                        key={srv}
                        onClick={() => toggleService(srv)}
                        style={{
                          fontSize: '0.7rem',
                          padding: '4px 8px',
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: active ? '#22c55e' : 'rgba(255,255,255,0.1)',
                          background: active ? '#22c55e22' : '#0d0f0e',
                          color: active ? '#22c55e' : '#888',
                          cursor: 'pointer'
                        }}
                      >
                        {srv}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="form-label">Private Sales Notes (Internal Only)</label>
                <textarea
                  value={salesNotes}
                  onChange={e => setSalesNotes(e.target.value)}
                  placeholder="Specific sales angle, budget estimation, or verified relationship context."
                  rows={3}
                  style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                />
              </div>
            </div>

            {/* 12 PUBLICATION CONTROL */}
            <div className="admin-card">
              <div className="eyebrow" style={{ color: '#d4af37' }}>SECTION 12</div>
              <h3 style={{ fontSize: '1.1rem', margin: '4px 0 16px 0', fontWeight: 800 }}>
                PUBLICATION CONTROL
              </h3>

              <div style={{ marginBottom: 16 }}>
                <label className="form-label">Editorial Content State</label>
                <select
                  value={contentState}
                  onChange={e => setContentState(e.target.value as any)}
                  style={{ width: '100%', padding: '10px', background: '#0d0f0e', border: '1px solid var(--line)', color: '#fff', borderRadius: 4 }}
                >
                  <option value="draft">Draft (Internal Research Only)</option>
                  <option value="published">Published (Live Editorial Index)</option>
                </select>
              </div>

              <div style={{ fontSize: '0.72rem', color: '#888', marginBottom: 20 }}>
                {contentState === 'published'
                  ? 'Record will be visible in public search and editorial index with strictly factual details.'
                  : 'Record is completely private and only accessible to verified administrators and sales operators.'}
              </div>

              <button
                type="submit"
                disabled={notice.type === 'loading'}
                className="action-btn primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.85rem', fontWeight: 800 }}
              >
                {notice.type === 'loading' ? 'Saving Record...' : 'SAVE RESEARCH DOSSIER →'}
              </button>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}
