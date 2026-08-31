'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export interface DocumentedChangeItem {
  id: string;
  date: string;
  change_type: string;
  entity_name: string;
  entity_type: 'Company' | 'Project';
  entity_slug: string;
  entity_category?: string; // Developer, Contractor, Architect, Engineer, Project
  city?: string;
  summary: string;
  previous_state?: string;
  new_state?: string;
  source_url?: string;
  source_title?: string;
  verification_state: string;
}

interface MarketChangesTerminalProps {
  initialChanges: DocumentedChangeItem[];
  availableCities: string[];
}

export function MarketChangesTerminal({ initialChanges, availableCities }: MarketChangesTerminalProps) {
  const [entityFilter, setEntityFilter] = useState<string>('ALL');
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [changeTypeFilter, setChangeTypeFilter] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST'>('NEWEST');

  // Extract change types dynamically
  const availableChangeTypes = useMemo(() => {
    const set = new Set<string>();
    initialChanges.forEach(c => set.add(c.change_type));
    return Array.from(set).sort();
  }, [initialChanges]);

  // Filter & Sort Changes
  const filteredChanges = useMemo(() => {
    const list = initialChanges.filter(chg => {
      // Entity Filter
      if (entityFilter !== 'ALL') {
        if (entityFilter === 'Project' && chg.entity_type !== 'Project') return false;
        if (entityFilter !== 'Project' && chg.entity_category !== entityFilter && chg.entity_type !== 'Company') return false;
      }

      // City Filter
      if (cityFilter !== 'ALL') {
        if (!chg.city || !chg.city.toLowerCase().includes(cityFilter.toLowerCase())) return false;
      }

      // Change Type Filter
      if (changeTypeFilter !== 'ALL') {
        if (chg.change_type !== changeTypeFilter) return false;
      }

      return true;
    });

    // Sorting
    return list.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortOrder === 'NEWEST' ? timeB - timeA : timeA - timeB;
    });
  }, [initialChanges, entityFilter, cityFilter, changeTypeFilter, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Interactive Filter Panel */}
      <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
          <span className="text-[#C9A227] font-bold uppercase tracking-wider">
            FACTUAL CHANGE AUDIT TERMINAL FILTERS
          </span>
          <span className="text-[#888888]">100% FACTUAL PROVENANCE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* ENTITY TYPE FILTER */}
          <div>
            <label className="text-[#888888] block mb-1 font-bold">ENTITY TAXONOMY</label>
            <select
              value={entityFilter}
              onChange={e => setEntityFilter(e.target.value)}
              className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-white focus:border-[#C9A227] outline-none"
            >
              <option value="ALL">All Entities & Projects</option>
              <option value="Developer">Developers</option>
              <option value="Contractor">Contractors</option>
              <option value="Architect">Architects</option>
              <option value="Engineer">Engineers</option>
              <option value="Project">Projects Only</option>
            </select>
          </div>

          {/* CITY / HUB FILTER */}
          <div>
            <label className="text-[#888888] block mb-1 font-bold">CITY / REGIONAL HUB</label>
            <select
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-white focus:border-[#C9A227] outline-none"
            >
              <option value="ALL">All Regional Hubs</option>
              {availableCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* CHANGE TYPE FILTER */}
          <div>
            <label className="text-[#888888] block mb-1 font-bold">CHANGE TYPE</label>
            <select
              value={changeTypeFilter}
              onChange={e => setChangeTypeFilter(e.target.value)}
              className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-white focus:border-[#C9A227] outline-none"
            >
              <option value="ALL">All Change Types</option>
              {availableChangeTypes.map(ct => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>
          </div>

          {/* SORT ORDER */}
          <div>
            <label className="text-[#888888] block mb-1 font-bold">CHRONOLOGICAL ORDER</label>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as 'NEWEST' | 'OLDEST')}
              className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-white focus:border-[#C9A227] outline-none"
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count Header */}
      <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3 text-xs font-mono">
        <span className="text-white font-bold">
          SHOWING {filteredChanges.length} AUDITED CHANGES
        </span>
        <span className="text-[#C9A227]">
          VERIFICATION: OFFICIAL DISCLOSURES & PERMITS
        </span>
      </div>

      {/* Audit Feed */}
      <div className="space-y-4">
        {filteredChanges.length === 0 ? (
          <div className="p-8 text-center bg-[#111111] border border-[#1A1D1B] rounded-2xl text-xs font-mono text-[#888888]">
            NO VERIFIED CHANGES MATCHING THIS AUDIT FILTER
          </div>
        ) : (
          filteredChanges.map(chg => (
            <div
              key={chg.id}
              className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#C9A227]/40 transition-all font-mono"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="px-2.5 py-1 bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] rounded text-[10px] font-bold uppercase">
                    {chg.change_type}
                  </span>
                  <span className="text-[#888888]">{chg.date}</span>
                  <span className="px-2 py-0.5 bg-[#86efac]/10 text-[#86efac] border border-[#86efac]/30 rounded text-[9px] font-bold uppercase">
                    {chg.verification_state || 'VERIFIED'}
                  </span>
                  {chg.city && <span className="text-[#888888]">📍 {chg.city}</span>}
                </div>

                <h2 className="text-lg font-bold text-white tracking-tight">
                  {chg.entity_type === 'Company' ? (
                    <Link href={`/companies/${chg.entity_slug}`} className="hover:text-[#C9A227] transition-colors">
                      🏢 {chg.entity_name}
                    </Link>
                  ) : (
                    <Link href={`/projects/${chg.entity_slug}`} className="hover:text-[#38bdf8] transition-colors">
                      🏗️ {chg.entity_name}
                    </Link>
                  )}
                </h2>

                <p className="text-xs text-[#A0A0A0] leading-relaxed font-sans">
                  {chg.summary}
                </p>

                {(chg.previous_state || chg.new_state) && (
                  <div className="flex items-center gap-3 text-[11px] text-[#888888] pt-1">
                    {chg.previous_state && <span>Prev State: <strong className="text-white">{chg.previous_state}</strong></span>}
                    {chg.previous_state && chg.new_state && <span>→</span>}
                    {chg.new_state && <span>New State: <strong className="text-[#C9A227]">{chg.new_state}</strong></span>}
                  </div>
                )}
              </div>

              {chg.source_url && (
                <a
                  href={chg.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#050505] border border-[#1A1D1B] text-xs text-[#C9A227] rounded-lg hover:border-[#C9A227]/50 shrink-0 self-start md:self-center font-bold"
                >
                  {chg.source_title || 'PRIMARY CITATION'} ↗
                </a>
              )}
            </div>
          ))
        )}
      </div>

      {/* Policy Banner */}
      <div className="p-4 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-[11px] font-mono text-[#777777] leading-relaxed">
        <strong className="text-[#A0A0A0]">CHANGE DETECTION POLICY:</strong> Changes are published only when verified by official building permits, primary trade registry statements, or authenticated corporate filings. Private internal notes and unverified rumors are strictly excluded.
      </div>
    </div>
  );
}
