'use client';

import { FormEvent, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { calculateOpportunityScore, OPPORTUNITY_SIGNAL_WEIGHTS } from '@/lib/scoring';

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
  { value: 'construction_company', label: 'Construction Company' },
  { value: 'developer', label: 'Developer' },
  { value: 'general_contractor', label: 'General Contractor' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'project_management', label: 'Project Management' },
  { value: 'specialized_contractor', label: 'Specialist Contractor' },
  { value: 'infrastructure', label: 'Infrastructure & Civil' }
];

const SOURCE_TYPES = [
  'Official Company Website',
  'Official Project Website',
  'Developer Press Release',
  'Ministry / Public Institution',
  'Industry Publication / Registry',
  'Corporate Social Media Channel',
  'Other Verified Source'
];

export function CompanyResearchWorkstation() {
  const router = useRouter();

  // Basic Information
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState('construction_company');
  const [location, setLocation] = useState('Bucharest');
  const [foundedYear, setFoundedYear] = useState<number | ''>('');
  const [positioning, setPositioning] = useState('');
  const [description, setDescription] = useState('');
  const [specialism, setSpecialism] = useState('');

  // Digital Presence
  const [website, setWebsite] = useState('');
  const [websiteStatus, setWebsiteStatus] = useState('unknown');
  const [socialPresence, setSocialPresence] = useState('unknown');
  const [seoStatus, setSeoStatus] = useState('unknown');
  const [leadGenStatus, setLeadGenStatus] = useState('unknown');

  // Source Attribution
  const [sourceType, setSourceType] = useState(SOURCE_TYPES[0]);
  const [sourceUrl, setSourceUrl] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'verified' | 'unverified'>('verified');

  // Signals & Services
  const [signals, setSignals] = useState<string[]>(['No website', 'Strong portfolio']);
  const [services, setServices] = useState<string[]>(['Website', 'Project Marketing']);
  const [pipelineStatus, setPipelineStatus] = useState('researching');
  const [notes, setNotes] = useState('');

  // Content State
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

  // Real-time calculation
  const { score, level, reasons } = useMemo(() => {
    return calculateOpportunityScore(signals, 0);
  }, [signals]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setNotice({ type: 'error', msg: 'Company name is required.' });
      return;
    }

    setNotice({ type: 'loading', msg: 'Saving researched company profile & opportunity score…' });
    try {
      // 1. Create company record
      const compRes = await fetch('/api/admin/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          type,
          location,
          founded_year: foundedYear ? Number(foundedYear) : null,
          positioning_statement: positioning || null,
          description,
          specialism,
          website: website || null,
          website_status: websiteStatus,
          social_presence: socialPresence,
          seo_status: seoStatus,
          lead_generation_status: leadGenStatus,
          website_verification: verificationStatus,
          content_state: contentState,
          source_type: sourceType,
          source_url: sourceUrl || null
        })
      });

      const compData = await compRes.json();
      if (!compRes.ok) {
        setNotice({ type: 'error', msg: compData.error || 'Failed to create company.' });
        return;
      }

      const companyId = compData.id;

      // 2. Initialize private opportunity score
      await fetch(`/api/admin/private_opportunity_scores/${companyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunity: level,
          opportunity_score: score,
          score_reasons: reasons,
          pipeline_status: pipelineStatus,
          signals,
          recommended_services: services,
          notes
        })
      });

      setNotice({ type: 'success', msg: 'Company intake complete. Redirecting to portfolio & media manager…' });
      setTimeout(() => {
        router.push(`/admin/companies/${companyId}/edit`);
      }, 1000);
    } catch {
      setNotice({ type: 'error', msg: 'Network error submitting research intake.' });
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin/companies" className="btn">
          ← Back to Companies Directory
        </Link>
      </div>

      <div className="eyebrow" style={{ color: '#d4af37' }}>
        Structured Intake & Intelligence
      </div>
      <h1 className="admin-title" style={{ marginBottom: 8 }}>
        COMPANY RESEARCH WORKSTATION
      </h1>
      <p style={{ color: '#aaa9a1', fontSize: 14, marginBottom: 28, maxWidth: 700 }}>
        Follow this 8-step workstation to rapidly document a real-world contractor, developer, or engineering practice, audit their digital footprint, and score the commercial upsell opportunity.
      </p>

      {notice.msg && (
        <div
          style={{
            padding: '12px 16px',
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

      {/* Live Calculated Opportunity Card */}
      <section
        className="admin-panel"
        style={{
          marginBottom: 28,
          background: '#141715',
          border: '1px solid #d4af37',
          borderRadius: 8,
          padding: 24
        }}
      >
        <div className="eyebrow" style={{ color: '#d4af37' }}>
          Real-Time Commercial Opportunity Scoring
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              textTransform: 'uppercase',
              padding: '4px 10px',
              borderRadius: 4,
              background: level === 'high' ? '#86efac' : level === 'medium' ? '#fde047' : '#94a3b8',
              color: '#000'
            }}
          >
            {level.toUpperCase()} OPPORTUNITY
          </span>
          <span style={{ fontSize: 32, fontWeight: 800, color: '#fff' }}>
            {score} <span style={{ fontSize: 16, color: '#888', fontWeight: 400 }}>/ 100</span>
          </span>
        </div>
        <div style={{ marginTop: 12 }}>
          <span style={{ fontSize: 11, color: '#aaa9a1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Breakdown:
          </span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
            {reasons.map((r, i) => (
              <span key={i} className="badge" style={{ borderColor: '#555', color: '#d4af37' }}>
                {r}
              </span>
            ))}
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="form-grid admin-panel" style={{ gap: 20 }}>
        {/* Step 1: Corporate Basics */}
        <div className="full">
          <div className="eyebrow">Step 1 of 8</div>
          <h2 style={{ fontSize: 20, margin: '4px 0 12px 0' }}>CORPORATE IDENTITY</h2>
        </div>

        <label>
          <span className="form-label">Official Company Name *</span>
          <input
            value={name}
            onChange={e => handleNameChange(e.target.value)}
            placeholder="e.g. Bog'Art, Strabag, Erbasu…"
            required
          />
        </label>

        <label>
          <span className="form-label">URL Slug</span>
          <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="bog-art" />
        </label>

        <label>
          <span className="form-label">Company Type Classification</span>
          <select value={type} onChange={e => setType(e.target.value)}>
            {COMPANY_TYPES.map(t => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="form-label">Headquarters Location</span>
          <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Bucharest, Romania" />
        </label>

        <label>
          <span className="form-label">Founding Year</span>
          <input
            type="number"
            value={foundedYear}
            onChange={e => setFoundedYear(e.target.value ? Number(e.target.value) : '')}
            placeholder="1991"
          />
        </label>

        <label>
          <span className="form-label">Primary Specialization</span>
          <input
            value={specialism}
            onChange={e => setSpecialism(e.target.value)}
            placeholder="General Construction · High-Rise · Infrastructure"
          />
        </label>

        <label className="full">
          <span className="form-label">Positioning Statement (1-2 sentences)</span>
          <input
            value={positioning}
            onChange={e => setPositioning(e.target.value)}
            placeholder="One of Romania's leading general contracting and civil engineering firms."
          />
        </label>

        <label className="full">
          <span className="form-label">Company Narrative & Editorial Overview</span>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Provide verified background regarding corporate history, delivery track record, and practice areas…"
            rows={4}
          />
        </label>

        {/* Step 2: Digital Presence */}
        <div className="full" style={{ borderTop: '1px solid var(--line)', paddingTop: 20, marginTop: 10 }}>
          <div className="eyebrow">Step 2 of 8</div>
          <h2 style={{ fontSize: 20, margin: '4px 0 12px 0' }}>WEBSITE & DIGITAL AUDIT</h2>
        </div>

        <label>
          <span className="form-label">Official Website URL</span>
          <input
            type="url"
            value={website}
            onChange={e => setWebsite(e.target.value)}
            placeholder="https://company.ro"
          />
        </label>

        <label>
          <span className="form-label">Website Status</span>
          <select value={websiteStatus} onChange={e => setWebsiteStatus(e.target.value)}>
            <option value="unknown">Unknown</option>
            <option value="no_website">No Website Found</option>
            <option value="outdated">Outdated / Legacy</option>
            <option value="active">Active & Modern</option>
            <option value="under_construction">Under Construction</option>
          </select>
        </label>

        <label>
          <span className="form-label">Social Media Presence</span>
          <select value={socialPresence} onChange={e => setSocialPresence(e.target.value)}>
            <option value="unknown">Unknown</option>
            <option value="none">No Social Presence</option>
            <option value="weak">Weak / Inactive Channels</option>
            <option value="active">Active Channels</option>
          </select>
        </label>

        <label>
          <span className="form-label">SEO & Organic Visibility</span>
          <select value={seoStatus} onChange={e => setSeoStatus(e.target.value)}>
            <option value="unknown">Unknown</option>
            <option value="none">Zero Search Visibility</option>
            <option value="weak">Weak / Generic Indexing</option>
            <option value="strong">Established Search Presence</option>
          </select>
        </label>

        <label>
          <span className="form-label">Inbound Lead Generation Funnel</span>
          <select value={leadGenStatus} onChange={e => setLeadGenStatus(e.target.value)}>
            <option value="unknown">Unknown</option>
            <option value="none">No Inbound Lead Form</option>
            <option value="weak">Generic Email Link Only</option>
            <option value="active">Active Funnel</option>
          </select>
        </label>

        {/* Step 3: Source Attribution */}
        <div className="full" style={{ borderTop: '1px solid var(--line)', paddingTop: 20, marginTop: 10 }}>
          <div className="eyebrow">Step 3 of 8</div>
          <h2 style={{ fontSize: 20, margin: '4px 0 12px 0' }}>SOURCE ATTRIBUTION & FACTUAL PROOF</h2>
        </div>

        <label>
          <span className="form-label">Primary Source Type</span>
          <select value={sourceType} onChange={e => setSourceType(e.target.value)}>
            {SOURCE_TYPES.map(st => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="form-label">Source URL / Reference Document</span>
          <input
            value={sourceUrl}
            onChange={e => setSourceUrl(e.target.value)}
            placeholder="https://official-registry.ro/entry or company press release"
          />
        </label>

        <label>
          <span className="form-label">Verification State</span>
          <select
            value={verificationStatus}
            onChange={e => setVerificationStatus(e.target.value as 'verified' | 'unverified')}
          >
            <option value="verified">Verified (Confirmed with primary source)</option>
            <option value="unverified">Unverified (Pending confirmation)</option>
          </select>
        </label>

        {/* Step 4: Digital Opportunity Weakness Signals */}
        <div className="full" style={{ borderTop: '1px solid var(--line)', paddingTop: 20, marginTop: 10 }}>
          <div className="eyebrow">Step 4 of 8</div>
          <h2 style={{ fontSize: 20, margin: '4px 0 12px 0' }}>DIGITAL WEAKNESS SIGNALS</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginTop: 8 }}>
            {ALL_SIGNALS.map(s => {
              const checked = signals.includes(s);
              return (
                <label
                  key={s}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    background: checked ? 'rgba(212, 175, 55, 0.12)' : '#141715',
                    border: checked ? '1px solid #d4af37' : '1px solid #262927',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 13
                  }}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggleSignal(s)} />
                  <span style={{ color: checked ? '#fff' : '#aaa9a1' }}>{s}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Step 5: Recommended Upsell Services */}
        <div className="full" style={{ borderTop: '1px solid var(--line)', paddingTop: 20, marginTop: 10 }}>
          <div className="eyebrow">Step 5 of 8</div>
          <h2 style={{ fontSize: 20, margin: '4px 0 12px 0' }}>RECOMMENDED SERVICES TO PITCH</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginTop: 8 }}>
            {ALL_SERVICES.map(srv => {
              const checked = services.includes(srv);
              return (
                <label
                  key={srv}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    background: checked ? 'rgba(16, 185, 129, 0.12)' : '#141715',
                    border: checked ? '1px solid #10b981' : '1px solid #262927',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 13
                  }}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggleService(srv)} />
                  <span style={{ color: checked ? '#fff' : '#aaa9a1' }}>{srv}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Step 6: Pipeline & Notes */}
        <div className="full" style={{ borderTop: '1px solid var(--line)', paddingTop: 20, marginTop: 10 }}>
          <div className="eyebrow">Step 6 of 8</div>
          <h2 style={{ fontSize: 20, margin: '4px 0 12px 0' }}>SALES PIPELINE & PITCH STRATEGY</h2>
        </div>

        <label>
          <span className="form-label">Initial Pipeline Stage</span>
          <select value={pipelineStatus} onChange={e => setPipelineStatus(e.target.value)}>
            <option value="new">New</option>
            <option value="researching">Researching</option>
            <option value="contacted">Contacted</option>
            <option value="follow_up">Follow Up</option>
          </select>
        </label>

        <label className="full">
          <span className="form-label">Internal Pitch Strategy & Research Notes</span>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Record decision maker contacts, key pitch points, and current commercial status…"
            rows={3}
          />
        </label>

        {/* Step 7 & 8: Publication Lifecycle */}
        <div className="full" style={{ borderTop: '1px solid var(--line)', paddingTop: 20, marginTop: 10 }}>
          <div className="eyebrow">Step 7 & 8 of 8</div>
          <h2 style={{ fontSize: 20, margin: '4px 0 12px 0' }}>EDITORIAL LIFECYCLE</h2>
        </div>

        <label>
          <span className="form-label">Profile Publishing Status</span>
          <select
            value={contentState}
            onChange={e => setContentState(e.target.value as 'draft' | 'published')}
          >
            <option value="draft">Draft (Private to Admin / Sales)</option>
            <option value="published">Published (Live on Public Platform)</option>
          </select>
        </label>

        <div className="full" style={{ marginTop: 20 }}>
          <button type="submit" className="btn fill" style={{ padding: '16px 28px', fontSize: 13 }} disabled={notice.type === 'loading'}>
            {notice.type === 'loading' ? 'Saving Research Intake…' : 'Complete Intake & Open Project Portfolio →'}
          </button>
        </div>
      </form>
    </div>
  );
}
