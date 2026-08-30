'use client';

import { useState } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export default function ResearchRequestPage() {
  const [category, setCategory] = useState<string>('Company');
  const [targetEntity, setTargetEntity] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [objective, setObjective] = useState<string>('');
  const [geography, setGeography] = useState<string>('Bucharest & Ilfov');
  const [timeframe, setTimeframe] = useState<string>('Immediate (1-3 Business Days)');
  const [outputFormat, setOutputFormat] = useState<string>('Structured PDF & TXT Brief');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company: targetEntity,
          requestType: category,
          message: `[RESEARCH REQUEST] Category: ${category} | Target: ${targetEntity} | Geo: ${geography} | Timeframe: ${timeframe} | Format: ${outputFormat} | Details: ${objective}`,
          source: 'research_request_form',
          leadType: 'research_request'
        })
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setSubmitted(true);

      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'RESEARCH_REQUEST_SUBMITTED', category, targetEntity, geography })
      }).catch(() => {});
    } catch {
      setErrorMsg("We couldn't submit the research request right now. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
              Independent Commercial Research Services
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              REQUEST INSTITUTIONAL RESEARCH
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Commission bespoke, evidence-backed market research, competitive landscape analysis, or developer pipeline audits from audited primary sources.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 max-w-3xl space-y-6">
            {/* MANDATORY SECTION 4 DISCLOSURE BANNER */}
            <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl text-xs font-mono text-[#A0A0A0] leading-relaxed">
              <strong className="text-[#C9A227] block mb-1">INDEPENDENT PLATFORM DISCLOSURE:</strong>
              Your request is submitted to the CONSTRUCTIONS research team for review. CONSTRUCTIONS is an independent research platform and does not represent the company or entity referenced in your request.
            </div>

            {submitted ? (
              <div className="p-8 bg-[#111111] border border-[#C9A227] rounded-xl space-y-4 text-center font-mono">
                <span className="text-3xl">✅</span>
                <h2 className="text-2xl font-bold text-white">RESEARCH REQUEST SUBMITTED</h2>
                <p className="text-sm text-[#A0A0A0] leading-relaxed">
                  Request received. The CONSTRUCTIONS research team will review it.
                </p>
                <div className="p-3 bg-[#050505] border border-[#1A1D1B] rounded text-xs text-[#888888]">
                  WORKFLOW STAGE: <span className="text-[#C9A227] font-bold">TRIAGED</span> → RESEARCHING → QA REVIEW → READY → DELIVERED
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 bg-[#C9A227] text-[#050505] font-mono font-bold text-xs rounded hover:bg-[#E4C58F] transition-all"
                  >
                    SUBMIT ANOTHER REQUEST →
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 md:p-8 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-6">
                <div className="border-b border-[#1A1D1B] pb-4 space-y-1">
                  <h2 className="text-lg font-bold text-white">CUSTOM RESEARCH SCOPE & PARAMETERS</h2>
                  <p className="text-xs text-[#888888]">
                    Submitted directly to the CONSTRUCTIONS research desk.
                  </p>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#888888] block mb-1 font-bold">YOUR NAME *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your full name"
                        required
                        className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3.5 py-2.5 text-white focus:border-[#C9A227] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[#888888] block mb-1 font-bold">BUSINESS EMAIL *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        required
                        className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3.5 py-2.5 text-white focus:border-[#C9A227] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#888888] block mb-1 font-bold">RESEARCH CATEGORY</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3.5 py-2.5 text-white focus:border-[#C9A227] outline-none"
                    >
                      <option value="Company">Company — Developer Portfolio & Profile Research</option>
                      <option value="Project">Project — Technical Due Diligence & Progress Verification</option>
                      <option value="Market">Market — Regional Supply & Concentration Analysis</option>
                      <option value="Competitive">Competitive — Developer Benchmarking & Market Positioning</option>
                      <option value="Contractor">Contractor — General Contractor Track Record & Capacity</option>
                      <option value="Developer Pipeline">Developer Pipeline — Multi-Site Expansion Audit</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[#888888] block mb-1 font-bold">TARGET ENTITY OR SUBJECT *</label>
                    <input
                      type="text"
                      value={targetEntity}
                      onChange={e => setTargetEntity(e.target.value)}
                      placeholder="e.g. One United Properties, Metropolitan Viilor, or Regional Sector"
                      required
                      className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3.5 py-2.5 text-white focus:border-[#C9A227] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#888888] block mb-1 font-bold">TARGET GEOGRAPHY</label>
                      <input
                        type="text"
                        value={geography}
                        onChange={e => setGeography(e.target.value)}
                        className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3.5 py-2.5 text-white focus:border-[#C9A227] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[#888888] block mb-1 font-bold">DESIRED TIMEFRAME</label>
                      <select
                        value={timeframe}
                        onChange={e => setTimeframe(e.target.value)}
                        className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3.5 py-2.5 text-white focus:border-[#C9A227] outline-none"
                      >
                        <option value="Immediate (1-3 Business Days)">Immediate (1-3 Business Days)</option>
                        <option value="Standard (5 Business Days)">Standard (5 Business Days)</option>
                        <option value="Deep-Dive (10 Business Days)">Deep-Dive (10 Business Days)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[#888888] block mb-1 font-bold">RESEARCH OBJECTIVES & SPECIFIC QUESTIONS *</label>
                    <textarea
                      value={objective}
                      onChange={e => setObjective(e.target.value)}
                      placeholder="Detail specific questions, required surface metrics, site permit checks, or primary source disclosures needed..."
                      rows={4}
                      required
                      className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3.5 py-2.5 text-white focus:border-[#C9A227] outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[#888888] block mb-1 font-bold">REQUESTED DELIVERABLE FORMAT</label>
                    <select
                      value={outputFormat}
                      onChange={e => setOutputFormat(e.target.value)}
                      className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3.5 py-2.5 text-white focus:border-[#C9A227] outline-none"
                    >
                      <option value="Structured PDF & TXT Brief">Executive Research Brief (.TXT / .PDF)</option>
                      <option value="Raw CSV Ledger">Raw Factual Dataset & Provenance Ledger (.CSV)</option>
                      <option value="Institutional Dossier Presentation">Institutional Research Dossier</option>
                    </select>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-950/50 border border-red-800 text-red-200 text-xs font-mono rounded">
                    {errorMsg}
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <span className="text-[10px] font-mono text-[#888888]">
                    SUBMITTED TO CONSTRUCTIONS RESEARCH DESK · ZERO PII EXPOSURE
                  </span>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-3 bg-[#C9A227] text-[#050505] font-mono font-bold text-xs rounded-lg hover:bg-[#E4C58F] transition-all disabled:opacity-50"
                  >
                    {loading ? 'SUBMITTING…' : 'SUBMIT RESEARCH REQUEST →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
