'use client';

import { FormEvent, useState, useMemo } from 'react';
import Link from 'next/link';
import { calculateOpportunityScore, OPPORTUNITY_SIGNAL_WEIGHTS } from '@/lib/scoring';
import { evaluateExecutiveVerdict } from '@/lib/executive-verdict';
import { SALES_SERVICE_CATALOG, ALL_SERVICES_LIST } from '@/lib/services';

type Company = {
  id: string;
  name: string;
  slug: string;
  type: string;
  cui_cif?: string | null;
  verification_status?: string | null;
  location?: string | null;
  website?: string | null;
  website_status?: string | null;
  website_quality_score?: number | null;
  social_presence?: string | null;
  seo_status?: string | null;
  lead_generation_status?: string | null;
  description?: string | null;
  founded_year?: number | null;
  content_state?: string | null;
};

type Opportunity = {
  company_id: string;
  opportunity?: 'high' | 'medium' | 'low' | null;
  opportunity_score?: number | null;
  score_reasons?: string[] | null;
  pipeline_status?: string | null;
  signals?: string[] | null;
  recommended_services?: string[] | null;
  notes?: string | null;
  owner_id?: string | null;
  last_contacted_at?: string | null;
  next_action?: string | null;
  next_action_date?: string | null;
  next_follow_up_at?: string | null;
  digital_audit?: Record<string, { status: 'good' | 'needs_improvement' | 'missing'; recommendation?: string }> | null;
  meeting_notes?: string | null;
  pitch_notes?: string | null;
};

type Activity = {
  id: string;
  activity_type: string;
  activity_date: string;
  summary: string;
  details?: string | null;
  author_name?: string | null;
};

type Proposal = {
  id: string;
  title: string;
  status: string;
  services: string[];
  estimated_value?: number | null;
  scope?: string | null;
  created_at: string;
};

const ALL_SIGNALS = Object.keys(OPPORTUNITY_SIGNAL_WEIGHTS);

const PIPELINE_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'researching', label: 'Researching' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
  { value: 'not_a_fit', label: 'Not a Fit' }
];

const AUDIT_DIMENSIONS = [
  { key: 'website', label: 'Website & Digital Experience' },
  { key: 'social', label: 'Social & Industry Presence' },
  { key: 'seo', label: 'Search Engine Visibility' },
  { key: 'project_presentation', label: 'Project Portfolio Presentation' },
  { key: 'photography', label: 'Architectural & Jobsite Photography' },
  { key: 'video', label: 'Drone & Progress Video' },
  { key: 'lead_gen', label: 'Inbound Lead Generation' },
  { key: 'branding', label: 'Brand Authority & Collateral' }
];

const NEXT_ACTION_PRESETS = [
  'Call Company Decision Maker',
  'Send Personalized Outreach Email',
  'Connect & Message on LinkedIn',
  'Research Completed Projects',
  'Prepare Commercial Proposal',
  'Send Architectural Portfolio Sample',
  'Schedule Discovery Call / Meeting',
  'Follow Up on Proposal'
];

export function OpportunityDetailView({
  company,
  initialOpportunity,
  projects = [],
  activities = [],
  leads = [],
  proposals = []
}: {
  company: Company;
  initialOpportunity: Opportunity | null;
  projects?: any[];
  activities?: Activity[];
  leads?: any[];
  proposals?: Proposal[];
}) {
  const [opp, setOpp] = useState<Opportunity>(
    initialOpportunity || {
      company_id: company.id,
      opportunity: 'high',
      opportunity_score: 75,
      score_reasons: [],
      pipeline_status: 'new',
      signals: ['No website', 'Strong portfolio', 'High project activity'],
      recommended_services: ['WEBSITE', 'PROJECT_MARKETING'],
      notes: ''
    }
  );

  const [signals, setSignals] = useState<string[]>(opp.signals || []);
  const [services, setServices] = useState<string[]>(opp.recommended_services || []);
  const [status, setStatus] = useState<string>(opp.pipeline_status || 'new');
  const [notes, setNotes] = useState<string>(opp.notes || '');
  const [nextAction, setNextAction] = useState<string>(opp.next_action || 'Send Personalized Outreach Email');
  const [nextActionDate, setNextActionDate] = useState<string>(opp.next_action_date || new Date().toISOString().slice(0, 10));

  // Website presence
  const [websiteUrl, setWebsiteUrl] = useState<string>(company.website || '');
  const [websiteStatus, setWebsiteStatus] = useState<string>(company.website_status || 'unknown');

  // Digital audit dimensions state
  const [audit, setAudit] = useState<Record<string, { status: 'good' | 'needs_improvement' | 'missing'; recommendation?: string }>>(
    opp.digital_audit || {
      website: { status: websiteUrl ? 'needs_improvement' : 'missing', recommendation: 'Build bespoke architectural web presence.' },
      social: { status: 'missing', recommendation: 'Establish active corporate LinkedIn channel.' },
      seo: { status: 'missing', recommendation: 'Target high-value construction search terms.' },
      project_presentation: { status: 'needs_improvement', recommendation: 'Present full verified project portfolio.' },
      photography: { status: 'missing', recommendation: 'Schedule jobsite architectural photoshoot.' },
      video: { status: 'missing', recommendation: 'Produce 4K drone progress documentaries.' },
      lead_gen: { status: 'missing', recommendation: 'Deploy high-intent procurement inquiry funnel.' },
      branding: { status: 'needs_improvement', recommendation: 'Refine visual brand guidelines.' }
    }
  );

  // Activities state
  const [activityList, setActivityList] = useState<Activity[]>(activities);
  const [activityType, setActivityType] = useState<string>('call');
  const [activitySummary, setActivitySummary] = useState<string>('');
  const [activityDetails, setActivityDetails] = useState<string>('');

  // Proposals state
  const [proposalList, setProposalList] = useState<Proposal[]>(proposals);
  const [newProposalTitle, setNewProposalTitle] = useState(`Digital Presence & Project Marketing — ${company.name}`);
  const [newProposalScope, setNewProposalScope] = useState('Full bespoke corporate website, 3 landmark project showcases, drone video, and verified editorial coverage.');
  const [newProposalValue, setNewProposalValue] = useState('6500');

  // UI state
  const [activeTab, setActiveTab] = useState<'workstation' | 'audit_preview' | 'outreach' | 'proposals'>('workstation');
  const [outreachFormat, setOutreachFormat] = useState<'email' | 'linkedin' | 'whatsapp' | 'call_script'>('email');

  const [notice, setNotice] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; msg: string }>({
    type: 'idle',
    msg: ''
  });

  // Calculate live transparent score
  const { score: liveScore, level: liveLevel, reasons: liveReasons } = useMemo(() => {
    return calculateOpportunityScore(signals, projects.length);
  }, [signals, projects.length]);

  function toggleSignal(item: string) {
    if (signals.includes(item)) setSignals(signals.filter(s => s !== item));
    else setSignals([...signals, item]);
  }

  function toggleService(itemKey: string) {
    if (services.includes(itemKey)) setServices(services.filter(s => s !== itemKey));
    else setServices([...services, itemKey]);
  }

  function updateAuditDimension(key: string, newStatus: 'good' | 'needs_improvement' | 'missing', recommendation?: string) {
    setAudit({
      ...audit,
      [key]: {
        status: newStatus,
        recommendation: recommendation !== undefined ? recommendation : audit[key]?.recommendation || ''
      }
    });
  }

  async function handleQuickStatusChange(newStatus: string) {
    setStatus(newStatus);
    setNotice({ type: 'loading', msg: 'Updating pipeline status…' });
    try {
      const res = await fetch(`/api/admin/private_opportunity_scores/${company.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pipeline_status: newStatus,
          opportunity_score: liveScore,
          score_reasons: liveReasons,
          last_contacted_at:
            newStatus === 'contacted' || newStatus === 'follow_up' ? new Date().toISOString() : opp.last_contacted_at
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: 'error', msg: data.error || 'Failed to update pipeline.' });
        return;
      }
      setOpp({ ...opp, ...data });

      // Log status change activity
      const actRes = await fetch('/api/admin/sales-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: company.id,
          activity_type: 'status_change',
          summary: `Pipeline status moved to ${newStatus.toUpperCase().replace('_', ' ')}`
        })
      });
      if (actRes.ok) {
        const newAct = await actRes.json();
        setActivityList([newAct, ...activityList]);
      }

      setNotice({ type: 'success', msg: `Pipeline updated to ${newStatus.toUpperCase().replace('_', ' ')}.` });
    } catch {
      setNotice({ type: 'error', msg: 'Network error updating pipeline.' });
    }
  }

  async function handleAddActivity(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!activitySummary.trim()) return;

    setNotice({ type: 'loading', msg: 'Logging sales activity…' });
    try {
      const res = await fetch('/api/admin/sales-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: company.id,
          activity_type: activityType,
          summary: activitySummary.trim(),
          details: activityDetails.trim() || null
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: 'error', msg: data.error || 'Failed to save activity.' });
        return;
      }
      setActivityList([data, ...activityList]);
      setActivitySummary('');
      setActivityDetails('');
      setNotice({ type: 'success', msg: 'Sales activity logged to timeline.' });
    } catch {
      setNotice({ type: 'error', msg: 'Network error saving activity.' });
    }
  }

  async function handleCreateProposal(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newProposalTitle.trim()) return;

    setNotice({ type: 'loading', msg: 'Creating proposal draft…' });
    try {
      const res = await fetch('/api/admin/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: company.id,
          title: newProposalTitle.trim(),
          services,
          scope: newProposalScope.trim(),
          estimated_value: newProposalValue ? Number(newProposalValue) : null,
          status: 'draft'
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: 'error', msg: data.error || 'Failed to create proposal.' });
        return;
      }
      setProposalList([data, ...proposalList]);
      setStatus('proposal');
      setNotice({ type: 'success', msg: 'Proposal created and pipeline updated to PROPOSAL.' });
    } catch {
      setNotice({ type: 'error', msg: 'Failed to create proposal.' });
    }
  }

  async function handleSaveFull(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNotice({ type: 'loading', msg: 'Saving sales opportunity workstation intelligence…' });
    try {
      // 1. Company website updates
      await fetch(`/api/admin/companies/${company.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          website: websiteUrl || null,
          website_status: websiteStatus
        })
      });

      // 2. Opportunity record
      const res = await fetch(`/api/admin/private_opportunity_scores/${company.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunity: liveLevel,
          opportunity_score: liveScore,
          score_reasons: liveReasons,
          pipeline_status: status,
          signals,
          recommended_services: services,
          notes,
          next_action: nextAction,
          next_action_date: nextActionDate || null,
          digital_audit: audit
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: 'error', msg: data.error || 'Failed to save opportunity.' });
        return;
      }
      setOpp({ ...opp, ...data });
      setNotice({ type: 'success', msg: 'Opportunity workstation data saved.' });
    } catch {
      setNotice({ type: 'error', msg: 'Network error saving opportunity.' });
    }
  }

  // Generated Outreach Copy Helper
  const outreachTemplates = useMemo(() => {
    const serviceNames = services.map(k => SALES_SERVICE_CATALOG[k]?.name || k).join(', ');
    const projectNames = projects.map(p => p.project?.name).filter(Boolean).slice(0, 2).join(' and ');

    return {
      email: {
        subject: `Digital Presentation & Project Showcase — ${company.name}`,
        body: `Dear Leadership Team at ${company.name},

I have been following your impressive construction delivery track record${projectNames ? `, particularly your work on ${projectNames}` : ''}. Your engineering execution is undeniable.

However, when prospective institutional developers, investors, and procurement teams research your practice online, your current digital presence does not reflect the true scale of your built work.

On CONSTRUCTIONS by AiXLuxury, we have established a dedicated verified profile for ${company.name}. We specialize in transforming construction practices into high-authority digital brands through ${serviceNames || 'bespoke architectural web presence, verified project portfolios, and 4K progress documentation'}.

Would you be open to a 10-minute briefing this week to review our digital presence audit for ${company.name}?

Best regards,
CONSTRUCTIONS by AiXLuxury Editorial & Commercial Team
https://constructions.aixluxury.com`
      },
      linkedin: `Hello Team ${company.name},

Admiring your recent construction milestones${projectNames ? ` on ${projectNames}` : ''}. 

We've prepared an executive digital presence audit on CONSTRUCTIONS by AiXLuxury showing how your verified projects and engineering capabilities can be presented directly to institutional developers and private investors.

Would you be open to reviewing the audit this week?`,
      whatsapp: `Hello! This is from CONSTRUCTIONS by AiXLuxury regarding ${company.name}. We've documented your project portfolio on our industry platform and would love to share our complimentary digital presence audit with your executive team. When is a good time for a brief 5-minute call?`,
      call_script: `1. INTRODUCTION: "Hello, my name is [Name] from CONSTRUCTIONS by AiXLuxury. I'm calling regarding your construction delivery track record${projectNames ? ` on projects like ${projectNames}` : ''}."
2. OBSERVATION: "We noticed that while your engineering execution is exceptional, your online project presentation and lead funnel are currently missing key institutional touchpoints."
3. VALUE PROPOSITION: "We document and elevate leading construction companies with verified project portfolios, drone progress media, and direct procurement lead routing."
4. CALL TO ACTION: "Can we schedule a 10-minute video walkthrough on Thursday to show you what we've prepared for ${company.name}?"`
    };
  }, [company.name, services, projects]);

  return (
    <div>
      {/* Header Navigation */}
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <Link href="/admin/opportunities" className="btn">
          ← Back to Sales Dashboard
        </Link>
        <div style={{ display: 'flex', gap: 10 }}>
          <a
            href={`/companies/${company.slug}`}
            target="_blank"
            rel="noreferrer"
            className="btn fill"
            style={{ background: '#d4af37', color: '#000', fontWeight: 700 }}
          >
            VIEW PUBLIC PROFILE ↗
          </a>
        </div>
      </div>

      <div className="eyebrow" style={{ color: '#d4af37' }}>
        Commercial Sales Workstation & Conversion Engine
      </div>
      <h1 className="admin-title" style={{ marginBottom: 6 }}>
        {company.name.toUpperCase()}
      </h1>
      <p style={{ color: '#aaa9a1', fontSize: 14, marginBottom: 24 }}>
        Type: {company.type} {company.location ? `· ${company.location}` : ''} {websiteUrl ? `· Website: ${websiteUrl}` : '· (No official website)'}
      </p>

      {notice.msg && (
        <div
          style={{
            padding: '10px 14px',
            marginBottom: 16,
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

      {/* Quick Sales Actions Bar */}
      <section className="admin-panel" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="eyebrow">Quick Sales Actions</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn"
                onClick={() => handleQuickStatusChange('contacted')}
                style={{ background: status === 'contacted' ? '#d4af37' : '#141715', color: status === 'contacted' ? '#000' : '#fff' }}
              >
                Mark Contacted
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => handleQuickStatusChange('follow_up')}
                style={{ background: status === 'follow_up' ? '#d4af37' : '#141715', color: status === 'follow_up' ? '#000' : '#fff' }}
              >
                Schedule Follow-Up
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => handleQuickStatusChange('proposal')}
                style={{ background: status === 'proposal' ? '#d4af37' : '#141715', color: status === 'proposal' ? '#000' : '#fff' }}
              >
                Move to Proposal
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => handleQuickStatusChange('won')}
                style={{ background: status === 'won' ? '#86efac' : '#141715', color: status === 'won' ? '#000' : '#86efac', borderColor: '#86efac' }}
              >
                Mark Won
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => handleQuickStatusChange('lost')}
                style={{ background: status === 'lost' ? '#fca5a5' : '#141715', color: status === 'lost' ? '#000' : '#fca5a5', borderColor: '#fca5a5' }}
              >
                Mark Lost
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="eyebrow">Current Stage</span>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', textTransform: 'uppercase', marginTop: 4 }}>
              {status.replaceAll('_', ' ')}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button
          type="button"
          className="btn"
          style={{ background: activeTab === 'workstation' ? '#d4af37' : '#141715', color: activeTab === 'workstation' ? '#000' : '#fff', fontWeight: 700 }}
          onClick={() => setActiveTab('workstation')}
        >
          Workstation & Audit
        </button>
        <button
          type="button"
          className="btn"
          style={{ background: activeTab === 'outreach' ? '#d4af37' : '#141715', color: activeTab === 'outreach' ? '#000' : '#fff', fontWeight: 700 }}
          onClick={() => setActiveTab('outreach')}
        >
          Outreach Message Builder
        </button>
        <button
          type="button"
          className="btn"
          style={{ background: activeTab === 'audit_preview' ? '#d4af37' : '#141715', color: activeTab === 'audit_preview' ? '#000' : '#fff', fontWeight: 700 }}
          onClick={() => setActiveTab('audit_preview')}
        >
          Client Audit Preview
        </button>
        <button
          type="button"
          className="btn"
          style={{ background: activeTab === 'proposals' ? '#d4af37' : '#141715', color: activeTab === 'proposals' ? '#000' : '#fff', fontWeight: 700 }}
          onClick={() => setActiveTab('proposals')}
        >
          Proposals ({proposalList.length})
        </button>
      </div>

      {activeTab === 'workstation' && (
        <>
          {/* 1. EVIDENCE-FIRST COMMERCIAL DOSSIER (FIRST VIEWPORT) */}
          <section className="admin-panel" style={{ marginBottom: 24, border: '1px solid rgba(199,166,117,0.4)', background: 'rgba(13,16,15,0.95)', padding: 24 }}>
            {(() => {
              const executiveVerdictResult = evaluateExecutiveVerdict({
                companyVerified: Boolean(company.verification_status && company.verification_status !== 'UNVERIFIED'),
                hasVerifiedRelationship: projects.length > 0,
                hasVerifiedDecisionMaker: Boolean(opp.owner_id || leads.length > 0),
                contactLevel: opp.owner_id ? 'LEVEL_03' : 'LEVEL_01',
                priorityScore: liveScore,
                isNotAFit: status === 'not_a_fit' || status === 'lost',
                activeCooldown: status === 'follow_up' && opp.next_follow_up_at ? new Date(opp.next_follow_up_at) > new Date() : false
              });

              const verdictBadgeBg =
                executiveVerdictResult.verdict === 'YES'
                  ? '#22c55e'
                  : executiveVerdictResult.verdict === 'COOLING'
                  ? '#38bdf8'
                  : executiveVerdictResult.verdict === 'WAIT'
                  ? '#eab308'
                  : '#ef4444';

              const whyNowTrigger =
                signals.length > 0
                  ? `Verified market activity signal "${signals[0]}" recorded for active project execution.`
                  : projects.length > 0
                  ? `Verified construction activity linked to ${projects[0]?.project?.name || 'active developments'}.`
                  : 'Company identity registered in market intelligence platform.';

              const contactLevelLabel = opp.owner_id ? 'LEVEL 03 (DIRECT CONTACT)' : 'LEVEL 01 (UNVERIFIED DOMAIN)';

              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            padding: '4px 12px',
                            borderRadius: 4,
                            background: verdictBadgeBg,
                            color: '#070908',
                            letterSpacing: '0.08em'
                          }}
                        >
                          VERDICT: {executiveVerdictResult.verdict}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#c7a675', fontFamily: 'DM Mono', fontWeight: 700 }}>
                          [CONFIDENCE: {liveLevel.toUpperCase()}]
                        </span>
                      </div>

                      <h2 style={{ fontSize: '1.25rem', margin: 0, color: '#f3f1eb', fontWeight: 800 }}>
                        {company.name}
                      </h2>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(243,241,235,0.6)', marginTop: 4 }}>
                        CUI/CIF: {company.cui_cif || 'CUI / REGISTRATION EVIDENCE NOT AVAILABLE'} · {company.type} · {company.location || 'Romania'}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className="eyebrow" style={{ color: '#c7a675', display: 'block', marginBottom: 4 }}>DOMINANT NEXT ACTION</span>
                      {executiveVerdictResult.verdict === 'YES' ? (
                        <a
                          href={`tel:${company.website || ''}`}
                          className="action-btn primary"
                          style={{ padding: '8px 18px', fontSize: '0.8rem', fontWeight: 800, background: '#22c55e', color: '#000', textDecoration: 'none', display: 'inline-block' }}
                        >
                          📞 CALL NOW
                        </a>
                      ) : (
                        <Link
                          href={`/admin/companies/${company.id}/decision-makers`}
                          className="action-btn secondary"
                          style={{ padding: '8px 18px', fontSize: '0.78rem', fontWeight: 700, color: '#eab308', borderColor: '#eab308', textDecoration: 'none', display: 'inline-block' }}
                        >
                          CONTACT VERIFICATION REQUIRED
                        </Link>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 6, border: '1px solid rgba(244,242,235,0.08)' }}>
                    <div>
                      <span style={{ fontSize: '0.6rem', color: '#c7a675', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em', display: 'block' }}>
                        WHY NOW?
                      </span>
                      <div style={{ fontSize: '0.78rem', color: '#f3f1eb', marginTop: 2, lineHeight: 1.4 }}>
                        {whyNowTrigger}
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.6rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em', display: 'block' }}>
                        VERIFIED PROJECT RELATIONSHIP
                      </span>
                      <div style={{ fontSize: '0.78rem', color: '#f3f1eb', marginTop: 2, lineHeight: 1.4 }}>
                        {projects.length > 0
                          ? `${projects[0]?.project?.name || 'Landmark Project'} (${projects[0]?.role || 'General Contractor'})`
                          : 'INSUFFICIENT DATA (0 Connected Projects)'}
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.6rem', color: '#a855f7', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em', display: 'block' }}>
                        CONTACT VERIFICATION STATUS
                      </span>
                      <div style={{ fontSize: '0.78rem', color: '#f3f1eb', marginTop: 2, lineHeight: 1.4 }}>
                        <span className="status-pill" style={{ fontSize: '0.65rem' }}>{contactLevelLabel}</span>
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.6rem', color: '#22c55e', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em', display: 'block' }}>
                        SCORE & RATIONALE
                      </span>
                      <div style={{ fontSize: '0.78rem', color: '#22c55e', marginTop: 2, fontWeight: 700 }}>
                        {liveScore}/100 — {executiveVerdictResult.reason}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </section>

          {/* 2. COMMERCIAL EXECUTION PANEL (BELOW FIRST FOLD) */}
          <section className="admin-panel" style={{ marginBottom: 24, border: '1px solid #38bdf8', background: 'rgba(13,16,15,0.95)', padding: 24 }}>
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 800, letterSpacing: '0.1em', marginBottom: 4 }}>
              COMMERCIAL EXECUTION ENGINE · STAGE DISCIPLINE
            </div>
            <h2 style={{ fontSize: '1.25rem', margin: '0 0 16px 0', fontWeight: 800, color: '#f3f1eb' }}>
              COMMERCIAL EXECUTION & CONVERSION DIAGNOSTICS
            </h2>

            {(() => {
              const hasLevel04Contact = Boolean(opp.owner_id);
              const hasOutreachDraft = proposalList.length > 0 || activityList.length > 0;
              const hasProposal = proposalList.length > 0;
              const isCooling = status === 'follow_up' && opp.next_follow_up_at ? new Date(opp.next_follow_up_at) > new Date() : false;

              let dominantAction = 'VERIFY LEVEL 04 CONTACT';
              let dominantActionHref = `/admin/companies/${company.id}/decision-makers`;
              let dominantActionColor = '#eab308';
              let blockerText = 'Level 04 contact verification gap (missing direct phone/email).';

              if (status === 'won') {
                dominantAction = 'CLIENT WON';
                dominantActionHref = `/companies/${company.slug}`;
                dominantActionColor = '#22c55e';
                blockerText = 'None — Contract verified and attributed.';
              } else if (hasLevel04Contact && !isCooling) {
                dominantAction = 'CALL NOW';
                dominantActionHref = `tel:${company.website || ''}`;
                dominantActionColor = '#22c55e';
                blockerText = 'None — Level 03+ verified direct contact ready.';
              } else if (hasProposal) {
                dominantAction = 'PREPARE PROPOSAL NEGOTIATION';
                dominantActionHref = `/proposal/${proposalList[0]?.id}`;
                dominantActionColor = '#eab308';
                blockerText = 'Active proposal negotiation pending client contract signing.';
              } else if (hasOutreachDraft) {
                dominantAction = 'LOG OUTCOME / RESPONSE';
                dominantActionHref = `/admin/acquisition/outreach/${company.id}`;
                dominantActionColor = '#38bdf8';
                blockerText = 'Outreach sent — awaiting client commercial response.';
              } else if (isCooling) {
                dominantAction = 'WAIT (ACTIVE COOLING)';
                dominantActionHref = '#';
                dominantActionColor = '#38bdf8';
                blockerText = 'Contact cooling period active until scheduled follow-up.';
              }

              return (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 4, border: '1px solid rgba(244,242,235,0.06)' }}>
                      <span style={{ fontSize: '0.6rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 800 }}>PIPELINE STAGE</span>
                      <div style={{ fontSize: '0.9rem', color: '#f3f1eb', fontWeight: 800, marginTop: 2, textTransform: 'uppercase' }}>{status.replaceAll('_', ' ')}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 4, border: '1px solid rgba(244,242,235,0.06)' }}>
                      <span style={{ fontSize: '0.6rem', color: '#c7a675', textTransform: 'uppercase', fontWeight: 800 }}>CONTACT LEVEL</span>
                      <div style={{ fontSize: '0.9rem', color: '#f3f1eb', fontWeight: 800, marginTop: 2 }}>{hasLevel04Contact ? 'LEVEL 03+' : 'LEVEL 01-02'}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 4, border: '1px solid rgba(244,242,235,0.06)' }}>
                      <span style={{ fontSize: '0.6rem', color: '#22c55e', textTransform: 'uppercase', fontWeight: 800 }}>OUTREACH READINESS</span>
                      <div style={{ fontSize: '0.9rem', color: '#22c55e', fontWeight: 800, marginTop: 2 }}>{hasLevel04Contact ? '100% (READY)' : '45% (ENRICHMENT GAP)'}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 4, border: '1px solid rgba(244,242,235,0.06)' }}>
                      <span style={{ fontSize: '0.6rem', color: '#a855f7', textTransform: 'uppercase', fontWeight: 800 }}>PROPOSAL STATUS</span>
                      <div style={{ fontSize: '0.9rem', color: '#f3f1eb', fontWeight: 800, marginTop: 2 }}>{hasProposal ? `${proposalList.length} Proposal(s)` : 'NOT SENT'}</div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.4)', padding: 14, borderRadius: 6, border: '1px solid rgba(244,242,235,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <span style={{ fontSize: '0.6rem', color: '#ef4444', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>COMMERCIAL BLOCKER</span>
                      <div style={{ fontSize: '0.78rem', color: '#f3f1eb', marginTop: 2 }}>{blockerText}</div>
                    </div>

                    <Link
                      href={dominantActionHref}
                      className="action-btn primary"
                      style={{ padding: '8px 16px', fontSize: '0.78rem', fontWeight: 800, background: dominantActionColor, color: '#070908', minHeight: 44 }}
                    >
                      {dominantAction} →
                    </Link>
                  </div>
                </div>
              );
            })()}
          </section>

          {/* Digital Presence Audit Grid */}
          <section className="admin-panel" style={{ marginBottom: 24 }}>
            <div className="eyebrow">Internal Digital Presence Audit (8 Dimensions)</div>
            <h2 style={{ fontSize: 20, margin: '6px 0 16px 0' }}>WEAKNESS AUDIT & TRANSFORMATION BLUEPRINT</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              {AUDIT_DIMENSIONS.map(dim => {
                const dimState = audit[dim.key] || { status: 'missing', recommendation: '' };
                return (
                  <div
                    key={dim.key}
                    style={{
                      background: '#0d0f0e',
                      border: '1px solid #222',
                      borderRadius: 6,
                      padding: 16
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{dim.label}</span>
                      <select
                        value={dimState.status}
                        onChange={e => updateAuditDimension(dim.key, e.target.value as any)}
                        style={{
                          fontSize: 11,
                          padding: '3px 6px',
                          background:
                            dimState.status === 'good'
                              ? 'rgba(16,185,129,0.2)'
                              : dimState.status === 'needs_improvement'
                              ? 'rgba(253,224,71,0.2)'
                              : 'rgba(239,68,68,0.2)',
                          color:
                            dimState.status === 'good'
                              ? '#86efac'
                              : dimState.status === 'needs_improvement'
                              ? '#fde047'
                              : '#fca5a5',
                          border: '1px solid #333'
                        }}
                      >
                        <option value="good">Good</option>
                        <option value="needs_improvement">Needs Improvement</option>
                        <option value="missing">Missing</option>
                      </select>
                    </div>

                    <input
                      style={{ marginTop: 10, width: '100%', fontSize: 12, padding: 8, background: '#141715', border: '1px solid #262927', color: '#ccc' }}
                      value={dimState.recommendation || ''}
                      onChange={e => updateAuditDimension(dim.key, dimState.status, e.target.value)}
                      placeholder="What we would transform / improve…"
                    />
                  </div>
                );
              })}
            </div>
          </section>

          {/* Structured Service Catalog Selection */}
          <section className="admin-panel" style={{ marginBottom: 24 }}>
            <div className="eyebrow">Structured Sales Service Catalog</div>
            <h2 style={{ fontSize: 20, margin: '6px 0 16px 0' }}>RECOMMENDED UPGRADE SERVICES</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
              {ALL_SERVICES_LIST.map(srv => {
                const checked = services.includes(srv.key);
                return (
                  <div
                    key={srv.key}
                    onClick={() => toggleService(srv.key)}
                    style={{
                      padding: 16,
                      borderRadius: 6,
                      background: checked ? 'rgba(212, 175, 55, 0.12)' : '#0d0f0e',
                      border: checked ? '1px solid #d4af37' : '1px solid #222',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#d4af37', fontWeight: 600 }}>
                          {srv.category}
                        </span>
                        <input type="checkbox" checked={checked} onChange={() => {}} />
                      </div>
                      <h4 style={{ margin: '6px 0 4px 0', fontSize: 14, color: '#fff' }}>{srv.name}</h4>
                      <p style={{ fontSize: 12, color: '#aaa9a1', margin: 0, lineHeight: 1.4 }}>{srv.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Next Action & Meeting Brief Form */}
          <form onSubmit={handleSaveFull} className="form-grid admin-panel" style={{ marginBottom: 24 }}>
            <div className="full">
              <div className="eyebrow">Follow-Up & Sales Strategy</div>
              <h2 style={{ fontSize: 20, margin: '6px 0 12px 0' }}>NEXT ACTION & PITCH NOTES</h2>
            </div>

            <label>
              <span className="form-label">Next Action Task</span>
              <input
                value={nextAction}
                onChange={e => setNextAction(e.target.value)}
                placeholder="e.g. Schedule discovery call"
              />
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                {NEXT_ACTION_PRESETS.slice(0, 4).map(p => (
                  <button
                    key={p}
                    type="button"
                    className="btn"
                    style={{ padding: '3px 7px', fontSize: 10 }}
                    onClick={() => setNextAction(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </label>

            <label>
              <span className="form-label">Action Due Date</span>
              <input
                type="date"
                value={nextActionDate}
                onChange={e => setNextActionDate(e.target.value)}
              />
            </label>

            <label className="full">
              <span className="form-label">Meeting Brief & Strategic Questions</span>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Questions to ask: How are you currently promoting active developments? Who manages your jobsite photography?…"
                rows={4}
              />
            </label>

            <div className="full">
              <button type="submit" className="btn fill" disabled={notice.type === 'loading'}>
                {notice.type === 'loading' ? 'Saving Workstation…' : 'Save Workstation & Audit Strategy'}
              </button>
            </div>
          </form>

          {/* Chronological Sales Timeline */}
          <section className="admin-panel" style={{ marginBottom: 24 }}>
            <div className="eyebrow">Chronological Activity History</div>
            <h2 style={{ fontSize: 20, margin: '6px 0 16px 0' }}>SALES TIMELINE & CONTACT ACTIVITIES</h2>

            {/* Log activity form */}
            <form onSubmit={handleAddActivity} style={{ background: '#0d0f0e', padding: 16, borderRadius: 6, marginBottom: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr auto', gap: 10, alignItems: 'center' }}>
                <select value={activityType} onChange={e => setActivityType(e.target.value)} className="field">
                  <option value="call">Phone Call</option>
                  <option value="email">Email Sent</option>
                  <option value="meeting">Meeting Held</option>
                  <option value="follow_up">Follow Up</option>
                  <option value="proposal">Proposal Sent</option>
                  <option value="note">Internal Note</option>
                </select>
                <input
                  className="field"
                  placeholder="Summary (e.g. Spoke with Managing Director regarding project showcase)…"
                  value={activitySummary}
                  onChange={e => setActivitySummary(e.target.value)}
                  required
                />
                <button type="submit" className="btn fill" disabled={!activitySummary.trim()}>
                  + Log Activity
                </button>
              </div>
            </form>

            {/* Activity Feed */}
            {activityList.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {activityList.map(act => (
                  <div
                    key={act.id}
                    style={{
                      background: '#141715',
                      border: '1px solid #262927',
                      borderRadius: 6,
                      padding: 14,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 12
                    }}
                  >
                    <div>
                      <span className="badge" style={{ textTransform: 'uppercase', color: '#d4af37' }}>
                        {act.activity_type.replaceAll('_', ' ')}
                      </span>
                      <h4 style={{ margin: '6px 0 4px 0', fontSize: 14, color: '#fff' }}>{act.summary}</h4>
                      {act.details && <p style={{ margin: 0, fontSize: 12, color: '#aaa9a1' }}>{act.details}</p>}
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>
                      {new Date(act.activity_date).toLocaleString()}
                      {act.author_name && <div>by {act.author_name}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty">No sales activities logged for this company yet.</div>
            )}
          </section>

          {/* Connected Leads History */}
          {leads.length > 0 && (
            <section className="admin-panel" style={{ marginBottom: 24 }}>
              <div className="eyebrow">Inbound Conversion History</div>
              <h2 style={{ fontSize: 20, margin: '6px 0 16px 0' }}>CONNECTED INBOUND LEADS ({leads.length})</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {leads.map((ld: any) => (
                  <div key={ld.id} style={{ padding: 12, background: '#0d0f0e', border: '1px solid #222', borderRadius: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ color: '#fff' }}>{ld.name}</strong> ({ld.email})
                      <div style={{ fontSize: 12, color: '#888' }}>Source: {ld.source} · Message: {ld.message || 'No note'}</div>
                    </div>
                    <Link href={`/admin/leads/${ld.id}`} className="link-arrow">
                      View Lead →
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Outreach Message Builder */}
      {activeTab === 'outreach' && (
        <section className="admin-panel">
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            Tailored Outreach Draft Generator
          </div>
          <h2 style={{ fontSize: 22, margin: '6px 0 16px 0' }}>HIGH-CONVERTING OUTREACH BUILDER</h2>
          <p style={{ color: '#aaa9a1', fontSize: 13, marginBottom: 20 }}>
            Structured, non-spam drafts built from verified company facts, active construction developments, and identified digital gaps.
          </p>

          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <button
              type="button"
              className="btn"
              style={{ background: outreachFormat === 'email' ? '#d4af37' : '#141715', color: outreachFormat === 'email' ? '#000' : '#fff' }}
              onClick={() => setOutreachFormat('email')}
            >
              Email Pitch
            </button>
            <button
              type="button"
              className="btn"
              style={{ background: outreachFormat === 'linkedin' ? '#d4af37' : '#141715', color: outreachFormat === 'linkedin' ? '#000' : '#fff' }}
              onClick={() => setOutreachFormat('linkedin')}
            >
              LinkedIn Message
            </button>
            <button
              type="button"
              className="btn"
              style={{ background: outreachFormat === 'whatsapp' ? '#d4af37' : '#141715', color: outreachFormat === 'whatsapp' ? '#000' : '#fff' }}
              onClick={() => setOutreachFormat('whatsapp')}
            >
              WhatsApp / Short Message
            </button>
            <button
              type="button"
              className="btn"
              style={{ background: outreachFormat === 'call_script' ? '#d4af37' : '#141715', color: outreachFormat === 'call_script' ? '#000' : '#fff' }}
              onClick={() => setOutreachFormat('call_script')}
            >
              Call Script
            </button>
          </div>

          {outreachFormat === 'email' && (
            <div>
              <label>
                <span className="form-label">Subject Line</span>
                <input readOnly value={outreachTemplates.email.subject} style={{ marginBottom: 12 }} />
              </label>
              <label>
                <span className="form-label">Email Draft Body</span>
                <textarea rows={12} defaultValue={outreachTemplates.email.body} style={{ fontFamily: 'monospace', fontSize: 13 }} />
              </label>
            </div>
          )}

          {outreachFormat === 'linkedin' && (
            <label>
              <span className="form-label">LinkedIn Direct Message Draft</span>
              <textarea rows={8} defaultValue={outreachTemplates.linkedin} style={{ fontFamily: 'monospace', fontSize: 13 }} />
            </label>
          )}

          {outreachFormat === 'whatsapp' && (
            <label>
              <span className="form-label">Short Message Draft</span>
              <textarea rows={6} defaultValue={outreachTemplates.whatsapp} style={{ fontFamily: 'monospace', fontSize: 13 }} />
            </label>
          )}

          {outreachFormat === 'call_script' && (
            <label>
              <span className="form-label">Executive Cold Call Flow</span>
              <textarea rows={10} defaultValue={outreachTemplates.call_script} style={{ fontFamily: 'monospace', fontSize: 13 }} />
            </label>
          )}
        </section>
      )}

      {/* Client Audit Preview */}
      {activeTab === 'audit_preview' && (
        <section className="admin-panel" style={{ background: '#0a0c0b', border: '1px solid #d4af37', padding: 32, borderRadius: 8 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div className="eyebrow" style={{ color: '#d4af37' }}>
              CONSTRUCTIONS by AiXLuxury · Digital Presence Audit
            </div>
            <h2 style={{ fontSize: 28, letterSpacing: '-0.03em', margin: '8px 0' }}>
              EXECUTIVE DIGITAL AUDIT — {company.name.toUpperCase()}
            </h2>
            <p style={{ color: '#aaa9a1', fontSize: 14, maxWidth: 600, margin: '0 auto' }}>
              Prepared for corporate leadership. A strategic overview of current market visibility and high-value digital transformation opportunities.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {AUDIT_DIMENSIONS.map(dim => {
              const dimState = audit[dim.key] || { status: 'missing', recommendation: 'Opportunity identified' };
              const badgeColor = dimState.status === 'good' ? '#86efac' : dimState.status === 'needs_improvement' ? '#fde047' : '#fca5a5';

              return (
                <div key={dim.key} style={{ background: '#141715', padding: 20, borderRadius: 6, border: '1px solid #262927' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: 15, color: '#fff' }}>{dim.label}</h4>
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: badgeColor }}>
                      {dimState.status.replaceAll('_', ' ')}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#d1cfc7', marginTop: 10, marginBottom: 0, lineHeight: 1.5 }}>
                    {dimState.recommendation || 'Standard digital enhancement recommended.'}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Proposals Section */}
      {activeTab === 'proposals' && (
        <section className="admin-panel">
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            Commercial Proposals
          </div>
          <h2 style={{ fontSize: 22, margin: '6px 0 16px 0' }}>PROPOSALS & SCOPE SPECIFICATIONS</h2>

          {/* Proposal Creator */}
          <form onSubmit={handleCreateProposal} className="form-grid" style={{ background: '#0d0f0e', padding: 20, borderRadius: 6, marginBottom: 24 }}>
            <div className="full">
              <span className="form-label">Proposal Title</span>
              <input value={newProposalTitle} onChange={e => setNewProposalTitle(e.target.value)} required />
            </div>

            <div>
              <span className="form-label">Estimated Engagement Value (€)</span>
              <input type="number" value={newProposalValue} onChange={e => setNewProposalValue(e.target.value)} />
            </div>

            <div className="full">
              <span className="form-label">Scope of Work</span>
              <textarea value={newProposalScope} onChange={e => setNewProposalScope(e.target.value)} rows={3} />
            </div>

            <div className="full">
              <button type="submit" className="btn fill" disabled={notice.type === 'loading'}>
                + Generate Proposal Draft
              </button>
            </div>
          </form>

          {/* Existing proposals */}
          {proposalList.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {proposalList.map(p => (
                <div key={p.id} style={{ background: '#141715', border: '1px solid #262927', padding: 18, borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="badge" style={{ textTransform: 'uppercase', color: '#86efac' }}>{p.status}</span>
                    <h3 style={{ fontSize: 18, margin: '6px 0 4px 0', color: '#fff' }}>{p.title}</h3>
                    {p.estimated_value && <div style={{ fontSize: 14, color: '#d4af37', fontWeight: 700 }}>€{p.estimated_value.toLocaleString()}</div>}
                    {p.scope && <p style={{ fontSize: 12, color: '#aaa9a1', margin: '4px 0 0 0' }}>{p.scope}</p>}
                  </div>
                  <Link href={`/proposal/${p.id}`} target="_blank" className="btn">
                    Client Preview ↗
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">No proposals generated for this company yet.</div>
          )}
        </section>
      )}
    </div>
  );
}
