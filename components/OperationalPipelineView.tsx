'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export type IngestionJob = {
  id: string;
  source_name: string;
  source_type: string;
  trigger_type: string;
  status: string;
  started_at: string;
  completed_at?: string;
  records_seen: number;
  records_created: number;
  duplicate_count: number;
  error_message?: string;
};

export type ObservationRecord = {
  id: string;
  source_name: string;
  source_type: string;
  source_url: string;
  content_hash: string;
  observed_at: string;
  verification_status: string;
};

export type OpportunityCandidate = {
  id: string;
  company_name: string;
  reason: string;
  commercial_score: number;
  urgency: string;
  status: string;
  generated_at: string;
};

export function OperationalPipelineView() {
  const [jobs, setJobs] = useState<IngestionJob[]>([]);
  const [observations, setObservations] = useState<ObservationRecord[]>([]);
  const [candidates, setCandidates] = useState<OpportunityCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  async function fetchPipelineData() {
    try {
      const res = await fetch('/api/admin/pipeline');
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
        setObservations(data.observations || []);
        setCandidates(data.opportunityCandidates || []);
      }
    } catch (err) {
      console.error('Failed to fetch operational pipeline data', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPipelineData();
  }, []);

  async function handleManualTrigger(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTriggering(true);
    setStatusMsg('');

    const form = new FormData(event.currentTarget);
    const payload = {
      sourceName: String(form.get('sourceName')),
      sourceType: String(form.get('sourceType')),
      sourceUrl: String(form.get('sourceUrl')),
      entityNameCandidate: String(form.get('entityNameCandidate')),
      eventType: String(form.get('eventType')),
      commercialRelevance: String(form.get('commercialRelevance')),
      evidenceText: String(form.get('evidenceText')),
      rawPayload: {
        submittedByAdmin: true,
        sourceName: String(form.get('sourceName')),
        evidence: String(form.get('evidenceText')),
        timestamp: new Date().toISOString()
      }
    };

    try {
      const res = await fetch('/api/admin/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const body = await res.json();
        setStatusMsg(`✅ Pipeline Executed: Job ${body.result.jobId} (Resolved: ${body.result.resolvedEntityName || 'Unresolved'})`);
        fetchPipelineData();
        (event.target as HTMLFormElement).reset();
      } else {
        const errBody = await res.json();
        setStatusMsg(`❌ Pipeline Trigger Rejected: ${errBody.error || 'Server error'}`);
      }
    } catch {
      setStatusMsg('❌ Failed to communicate with operational pipeline.');
    } finally {
      setTriggering(false);
    }
  }

  return (
    <div style={{ background: '#0c0e0c', color: '#fff', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, borderBottom: '1px solid #262927', paddingBottom: 16 }}>
          <div>
            <span style={{ color: '#c7a675', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              CONSTRUCTIONS OPERATIONAL INTELLIGENCE
            </span>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: '4px 0 0 0', color: '#fff' }}>
              Level 3 Operational Ingestion & Lineage Pipeline
            </h1>
          </div>
          <Link href="/admin" className="btn outline sm" style={{ color: '#c7a675', borderColor: '#c7a675' }}>
            ← Executive Dashboard
          </Link>
        </div>

        {/* MANUAL TRIGGER FORM */}
        <div style={{ background: '#141715', border: '1px solid #262927', borderRadius: 8, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px 0', color: '#c7a675' }}>
            ⚡ Trigger Operational Ingestion Pipeline
          </h2>

          {statusMsg && (
            <div style={{ padding: '12px 16px', borderRadius: 4, background: statusMsg.startsWith('✅') ? '#143818' : '#381414', border: statusMsg.startsWith('✅') ? '1px solid #86efac' : '1px solid #f87171', color: '#fff', fontSize: 13, marginBottom: 16 }}>
              {statusMsg}
            </div>
          )}

          <form onSubmit={handleManualTrigger} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#a1a1aa', marginBottom: 4 }}>
                Source Name *
              </label>
              <input name="sourceName" required defaultValue="SEAP Public Procurement Notice" style={{ width: '100%', background: '#0c0e0c', border: '1px solid #262927', color: '#fff', padding: '8px 12px', borderRadius: 4, fontSize: 13 }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#a1a1aa', marginBottom: 4 }}>
                Source URL (Must be Allowlisted) *
              </label>
              <input name="sourceUrl" required defaultValue="https://seap.ro/notice/contract-award-2026" style={{ width: '100%', background: '#0c0e0c', border: '1px solid #262927', color: '#fff', padding: '8px 12px', borderRadius: 4, fontSize: 13 }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#a1a1aa', marginBottom: 4 }}>
                Source Type
              </label>
              <select name="sourceType" style={{ width: '100%', background: '#0c0e0c', border: '1px solid #262927', color: '#fff', padding: '8px 12px', borderRadius: 4, fontSize: 13 }}>
                <option value="PUBLIC_REGISTRY">PUBLIC_REGISTRY</option>
                <option value="OFFICIAL">OFFICIAL</option>
                <option value="NEWS">NEWS</option>
                <option value="COMPANY_DISCLOSURE">COMPANY_DISCLOSURE</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#a1a1aa', marginBottom: 4 }}>
                Entity Name Candidate
              </label>
              <input name="entityNameCandidate" defaultValue="Bog'Art Building Management" style={{ width: '100%', background: '#0c0e0c', border: '1px solid #262927', color: '#fff', padding: '8px 12px', borderRadius: 4, fontSize: 13 }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#a1a1aa', marginBottom: 4 }}>
                Event Type
              </label>
              <select name="eventType" style={{ width: '100%', background: '#0c0e0c', border: '1px solid #262927', color: '#fff', padding: '8px 12px', borderRadius: 4, fontSize: 13 }}>
                <option value="TENDER_AWARDED">TENDER_AWARDED</option>
                <option value="BUILDING_PERMIT">BUILDING_PERMIT</option>
                <option value="CONSTRUCTION_STARTED">CONSTRUCTION_STARTED</option>
                <option value="NEW_PROJECT">NEW_PROJECT</option>
                <option value="PROJECT_COMPLETION">PROJECT_COMPLETION</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#a1a1aa', marginBottom: 4 }}>
                Commercial Relevance
              </label>
              <select name="commercialRelevance" style={{ width: '100%', background: '#0c0e0c', border: '1px solid #262927', color: '#fff', padding: '8px 12px', borderRadius: 4, fontSize: 13 }}>
                <option value="CRITICAL">CRITICAL (Triggers Telegram Exec Alert)</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
              </select>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#a1a1aa', marginBottom: 4 }}>
                Evidence Text
              </label>
              <input name="evidenceText" defaultValue="Verified public contracting award notice for structural civil works." style={{ width: '100%', background: '#0c0e0c', border: '1px solid #262927', color: '#fff', padding: '8px 12px', borderRadius: 4, fontSize: 13 }} />
            </div>

            <div style={{ gridColumn: 'span 2', textAlign: 'right' }}>
              <button disabled={triggering} style={{ background: '#c7a675', color: '#000', border: 'none', padding: '10px 24px', fontWeight: 700, borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>
                {triggering ? 'Executing Operational Pipeline…' : 'Execute Operational Pipeline'}
              </button>
            </div>
          </form>
        </div>

        {/* PIPELINE DATA SECTIONS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          {/* INGESTION JOBS LOG */}
          <div style={{ background: '#141715', border: '1px solid #262927', borderRadius: 8, padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px 0', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Durable Ingestion Jobs</span>
              <span style={{ fontSize: 11, background: '#262927', padding: '2px 8px', borderRadius: 10, color: '#c7a675' }}>{jobs.length} Jobs</span>
            </h3>

            {loading ? (
              <p style={{ color: '#71717a', fontSize: 13 }}>Loading jobs…</p>
            ) : jobs.length === 0 ? (
              <p style={{ color: '#71717a', fontSize: 13 }}>No ingestion jobs recorded yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {jobs.map(j => (
                  <div key={j.id} style={{ background: '#0c0e0c', border: '1px solid #262927', padding: 12, borderRadius: 4, fontSize: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                      <span>{j.source_name}</span>
                      <span style={{ color: j.status === 'COMPLETED' ? '#86efac' : '#f87171' }}>{j.status}</span>
                    </div>
                    <div style={{ color: '#71717a', fontSize: 11 }}>
                      Trigger: {j.trigger_type} | Records: {j.records_created} created, {j.duplicate_count} dupes | Started: {new Date(j.started_at).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* OPPORTUNITY CANDIDATES */}
          <div style={{ background: '#141715', border: '1px solid #262927', borderRadius: 8, padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px 0', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Generated Opportunity Candidates</span>
              <span style={{ fontSize: 11, background: '#262927', padding: '2px 8px', borderRadius: 10, color: '#c7a675' }}>{candidates.length} Candidates</span>
            </h3>

            {loading ? (
              <p style={{ color: '#71717a', fontSize: 13 }}>Loading candidates…</p>
            ) : candidates.length === 0 ? (
              <p style={{ color: '#71717a', fontSize: 13 }}>No opportunity candidates generated yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {candidates.map(c => (
                  <div key={c.id} style={{ background: '#0c0e0c', border: '1px solid #262927', padding: 12, borderRadius: 4, fontSize: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                      <span>{c.company_name}</span>
                      <span style={{ color: '#c7a675' }}>Score: {c.commercial_score} ({c.urgency})</span>
                    </div>
                    <div style={{ color: '#a1a1aa', fontSize: 11, marginBottom: 4 }}>
                      Reason: {c.reason}
                    </div>
                    <div style={{ color: '#71717a', fontSize: 10 }}>
                      Status: {c.status} | Generated: {new Date(c.generated_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
