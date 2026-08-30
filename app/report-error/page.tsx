'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export default function ReportErrorPage() {
  const [formData, setFormData] = useState({
    entityType: 'Company',
    entityName: '',
    fieldToCorrect: '',
    currentValue: '',
    proposedValue: '',
    sourceCitation: '',
    contactName: '',
    contactEmail: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'report_error',
          company: formData.entityName,
          name: formData.contactName,
          email: formData.contactEmail,
          requestType: 'Profile Correction',
          message: `CORRECTION REQUEST: Entity: ${formData.entityName} (${formData.entityType}) | Field: ${formData.fieldToCorrect} | Current: ${formData.currentValue} | Proposed: ${formData.proposedValue} | Source: ${formData.sourceCitation} | Notes: ${formData.notes}`,
          leadType: 'correction_request'
        })
      });
      const data = await response.json().catch(() => null);

      if (response.ok && data?.ok) {
        setSubmitted(true);
      } else {
        setErrorMessage(data?.error || "We couldn't submit the request right now. Please try again shortly.");
      }
    } catch {
      setErrorMessage("We couldn't submit the request right now. Please try again shortly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />
      <main className="max-w-[800px] mx-auto px-4 md:px-8 pt-32 pb-24 space-y-8">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">
            PUBLIC PROVENANCE & CORRECTION DESK
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
            REQUEST FACTUAL DATA CORRECTION
          </h1>
          <p className="text-xs text-[#A0A0A0] mt-2 leading-relaxed">
            Company information and project metrics are compiled from public records and official disclosures. Representatives or independent researchers may submit primary-source evidence for correction or updates. Factual corrections are evaluated solely against documentary proof.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 bg-[#111111] border border-[#86efac]/40 rounded-2xl space-y-4 text-center">
            <span className="text-3xl">✅</span>
            <h2 className="text-xl font-bold text-white">Correction Request Submitted</h2>
            <p className="text-xs text-[#A0A0A0] max-w-md mx-auto">
              Your request has been routed to our research verification queue. Proposed updates will be evaluated against primary records within 2 business days.
            </p>
            <Link href="/" className="inline-block mt-4 text-xs font-mono text-[#C9A227] hover:underline">
              Return to Homepage →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 bg-[#111111] border border-[#1A1D1B] rounded-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#888888] mb-1">Entity Type</label>
                <select
                  value={formData.entityType}
                  onChange={e => setFormData({ ...formData, entityType: e.target.value })}
                  className="w-full p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-sm text-white focus:border-[#C9A227] outline-none"
                >
                  <option value="Company">Company / Corporate Entity</option>
                  <option value="Project">Construction Project</option>
                  <option value="Location">City / Regional Hub</option>
                  <option value="Contractor">Contractor Profile</option>
                  <option value="Architect">Architect Profile</option>
                  <option value="Engineer">Engineer Profile</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#888888] mb-1">Entity Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. One United Properties"
                  value={formData.entityName}
                  onChange={e => setFormData({ ...formData, entityName: e.target.value })}
                  className="w-full p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-sm text-white focus:border-[#C9A227] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#888888] mb-1">Field Requiring Correction *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Built Area / TurnOver 2025"
                  value={formData.fieldToCorrect}
                  onChange={e => setFormData({ ...formData, fieldToCorrect: e.target.value })}
                  className="w-full p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-sm text-white focus:border-[#C9A227] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#888888] mb-1">Current Displayed Value</label>
                <input
                  type="text"
                  placeholder="e.g. 50,000 sqm"
                  value={formData.currentValue}
                  onChange={e => setFormData({ ...formData, currentValue: e.target.value })}
                  className="w-full p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-sm text-white focus:border-[#C9A227] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#888888] mb-1">Proposed Corrected Value *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 62,000 sqm"
                  value={formData.proposedValue}
                  onChange={e => setFormData({ ...formData, proposedValue: e.target.value })}
                  className="w-full p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-sm text-white focus:border-[#C9A227] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#888888] mb-1">Supporting Source / Primary Document URL *</label>
              <input
                type="url"
                required
                placeholder="https://mfinante.gov.ro or official PDF release URL"
                value={formData.sourceCitation}
                onChange={e => setFormData({ ...formData, sourceCitation: e.target.value })}
                className="w-full p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-sm text-white focus:border-[#C9A227] outline-none font-mono"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#888888] mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Official Representative / Researcher Name"
                  value={formData.contactName}
                  onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-sm text-white focus:border-[#C9A227] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#888888] mb-1">Corporate / Contact Email *</label>
                <input
                  type="email"
                  required
                  placeholder="representative@company.com"
                  value={formData.contactEmail}
                  onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-sm text-white focus:border-[#C9A227] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#888888] mb-1">Additional Context / Notes</label>
              <textarea
                rows={3}
                placeholder="Provide cadastre permit numbers or relevant filing registration dates..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-sm text-white focus:border-[#C9A227] outline-none resize-none"
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-950/50 border border-red-800 text-red-200 text-xs font-mono rounded">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#C9A227] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#E4C58F] active:scale-98 transition-all disabled:opacity-50"
            >
              {submitting ? 'Submitting Verification Request...' : 'Submit Correction Request →'}
            </button>
          </form>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
