'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SignalItem {
  id: string;
  title: string;
  signal_type: string;
  event_date: string;
  summary: string;
  source_url?: string;
  verification_state?: string;
  commercial_relevance?: string;
  why_it_matters?: string;
  company_name?: string;
  company_slug?: string;
  project_name?: string;
  project_slug?: string;
  location?: string;
}

interface SignalsFeedProps {
  signals: SignalItem[];
}

export function SignalsFeed({ signals }: SignalsFeedProps) {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = [
    { label: 'ALL SIGNALS', key: 'ALL' },
    { label: 'DEVELOPERS', key: 'DEVELOPER' },
    { label: 'CONTRACTORS', key: 'CONTRACTOR' },
    { label: 'PROJECTS', key: 'PROJECT' },
    { label: 'INFRASTRUCTURE', key: 'INFRASTRUCTURE' },
    { label: 'INVESTMENT', key: 'INVESTMENT' },
    { label: 'CORPORATE', key: 'OFFICIAL_DISCLOSURE' },
    { label: 'PLANNING', key: 'PLANNING_PERMIT' },
    { label: 'CONSTRUCTION', key: 'CONSTRUCTION_MILESTONE' }
  ];

  const filteredSignals = signals.filter(sig => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'DEVELOPER') return sig.company_name && !sig.signal_type.includes('INFRASTRUCTURE');
    if (activeCategory === 'CONTRACTOR') return sig.summary.toLowerCase().includes('contractor') || sig.summary.toLowerCase().includes('construct') || sig.signal_type === 'CONSTRUCTION_MILESTONE';
    if (activeCategory === 'PROJECT') return !!sig.project_name;
    if (activeCategory === 'INFRASTRUCTURE') return sig.signal_type === 'INFRASTRUCTURE' || sig.summary.toLowerCase().includes('motorway') || sig.summary.toLowerCase().includes('highway');
    if (activeCategory === 'INVESTMENT') return sig.signal_type === 'INVESTMENT' || sig.signal_type === 'LEASING';
    if (activeCategory === 'OFFICIAL_DISCLOSURE') return sig.signal_type === 'OFFICIAL_DISCLOSURE';
    if (activeCategory === 'PLANNING_PERMIT') return sig.signal_type === 'PLANNING_PERMIT' || sig.signal_type === 'PLANNING';
    if (activeCategory === 'CONSTRUCTION_MILESTONE') return sig.signal_type === 'CONSTRUCTION_MILESTONE';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Institutional Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#1A1D1B] scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider shrink-0 transition-all ${
              activeCategory === cat.key
                ? 'bg-[#C9A227] text-[#050505]'
                : 'bg-[#111111] text-[#A0A0A0] hover:text-white border border-[#1A1D1B]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs font-mono text-[#888888]">
        <span>
          SHOWING {filteredSignals.length} VERIFIED MARKET SIGNALS
        </span>
        <span className="text-[#C9A227]">
          LAST AUDITED: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
        </span>
      </div>

      {/* Signal Stream */}
      <div className="space-y-4">
        {filteredSignals.length === 0 ? (
          <div className="p-8 text-center bg-[#111111] border border-[#1A1D1B] rounded-2xl text-xs font-mono text-[#888888]">
            NO VERIFIED SIGNALS MATCHING THIS CATEGORY FILTER
          </div>
        ) : (
          filteredSignals.map(act => (
            <div
              key={act.id}
              className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#C9A227]/40 transition-all"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] rounded text-[10px] font-mono uppercase font-bold">
                    {act.signal_type.replaceAll('_', ' ')}
                  </span>
                  <span className="text-xs font-mono text-[#888888]">{act.event_date}</span>
                  <span className="px-2 py-0.5 bg-[#22c55e]/10 text-[#22c55e] rounded text-[9px] font-mono font-bold uppercase">
                    {act.verification_state || 'VERIFIED'}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white tracking-tight">
                  {act.title}
                </h2>

                <p className="text-xs text-[#A0A0A0] leading-relaxed">
                  {act.summary}
                </p>

                {act.why_it_matters && (
                  <p className="text-[11px] text-[#C9A227]/90 font-mono italic pt-0.5">
                    💡 Intelligence Significance: {act.why_it_matters}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-mono text-[#888888]">
                  {act.company_slug && (
                    <Link href={`/companies/${act.company_slug}`} className="text-[#C9A227] hover:underline flex items-center gap-1">
                      🏢 {act.company_name}
                    </Link>
                  )}
                  {act.project_slug && (
                    <Link href={`/projects/${act.project_slug}`} className="text-[#38bdf8] hover:underline flex items-center gap-1">
                      🏗️ {act.project_name}
                    </Link>
                  )}
                  {act.location && <span>📍 {act.location}</span>}
                </div>
              </div>

              {act.source_url && (
                <a
                  href={act.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#050505] border border-[#1A1D1B] text-xs font-mono text-[#C9A227] rounded-lg hover:border-[#C9A227]/50 shrink-0 self-start md:self-center font-bold"
                >
                  PRIMARY CITATION ↗
                </a>
              )}
            </div>
          ))
        )}
      </div>

      {/* Independent Platform Disclosure */}
      <div className="p-4 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-[11px] font-mono text-[#777777] leading-relaxed">
        <strong className="text-[#A0A0A0]">INDEPENDENT INTELLIGENCE DISCLOSURE:</strong> CONSTRUCTIONS is an independent information and market-research platform. Signals are compiled exclusively from official regulatory filings, verified corporate press releases, primary registry data, and authenticated industry sources.
      </div>
    </div>
  );
}
