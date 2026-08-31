'use client';

import { useState, useMemo } from 'react';
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

function normalizeDiacritics(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ș/g, 's')
    .replace(/ț/g, 't')
    .replace(/ă/g, 'a')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i');
}

export function SignalsFeed({ signals }: SignalsFeedProps) {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [signalTypeFilter, setSignalTypeFilter] = useState<string>('ALL');
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST'>('NEWEST');

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

  // Extract unique cities and signal types
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    signals.forEach(s => {
      if (s.location) {
        const parts = s.location.split('·')[0].trim();
        if (parts) set.add(parts);
      }
    });
    return Array.from(set).sort();
  }, [signals]);

  const availableSignalTypes = useMemo(() => {
    const set = new Set<string>();
    signals.forEach(s => set.add(s.signal_type));
    return Array.from(set).sort();
  }, [signals]);

  const normalizedSearch = useMemo(() => normalizeDiacritics(searchQuery.trim()), [searchQuery]);

  const filteredSignals = useMemo(() => {
    const list = signals.filter(sig => {
      // Category Filter
      if (activeCategory !== 'ALL') {
        if (activeCategory === 'DEVELOPER' && (!sig.company_name || sig.signal_type.includes('INFRASTRUCTURE'))) return false;
        if (activeCategory === 'CONTRACTOR' && !(sig.summary.toLowerCase().includes('contractor') || sig.summary.toLowerCase().includes('construct') || sig.signal_type === 'CONSTRUCTION_MILESTONE')) return false;
        if (activeCategory === 'PROJECT' && !sig.project_name) return false;
        if (activeCategory === 'INFRASTRUCTURE' && sig.signal_type !== 'INFRASTRUCTURE' && !sig.summary.toLowerCase().includes('motorway') && !sig.summary.toLowerCase().includes('highway')) return false;
        if (activeCategory === 'INVESTMENT' && sig.signal_type !== 'INVESTMENT' && sig.signal_type !== 'LEASING') return false;
        if (activeCategory === 'OFFICIAL_DISCLOSURE' && sig.signal_type !== 'OFFICIAL_DISCLOSURE') return false;
        if (activeCategory === 'PLANNING_PERMIT' && sig.signal_type !== 'PLANNING_PERMIT' && sig.signal_type !== 'PLANNING') return false;
        if (activeCategory === 'CONSTRUCTION_MILESTONE' && sig.signal_type !== 'CONSTRUCTION_MILESTONE') return false;
      }

      // Signal Type Filter
      if (signalTypeFilter !== 'ALL') {
        if (sig.signal_type !== signalTypeFilter) return false;
      }

      // City Filter
      if (cityFilter !== 'ALL') {
        if (!normalizeDiacritics(sig.location || '').includes(normalizeDiacritics(cityFilter))) return false;
      }

      // Diacritic-insensitive Search Query
      if (normalizedSearch) {
        const titleNorm = normalizeDiacritics(sig.title);
        const summaryNorm = normalizeDiacritics(sig.summary || '');
        const compNorm = normalizeDiacritics(sig.company_name || '');
        const projNorm = normalizeDiacritics(sig.project_name || '');
        const locNorm = normalizeDiacritics(sig.location || '');

        const matches = (
          titleNorm.includes(normalizedSearch) ||
          summaryNorm.includes(normalizedSearch) ||
          compNorm.includes(normalizedSearch) ||
          projNorm.includes(normalizedSearch) ||
          locNorm.includes(normalizedSearch)
        );
        if (!matches) return false;
      }

      return true;
    });

    // Sorting
    return list.sort((a, b) => {
      const timeA = new Date(a.event_date).getTime();
      const timeB = new Date(b.event_date).getTime();
      return sortOrder === 'NEWEST' ? timeB - timeA : timeA - timeB;
    });
  }, [signals, activeCategory, signalTypeFilter, cityFilter, normalizedSearch, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
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

      {/* Advanced Filter Toolbar */}
      <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
        {/* Search */}
        <div>
          <label className="text-[#888888] block mb-1 font-bold">SEARCH SIGNALS</label>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Entity, project, keyword..."
            className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-white focus:border-[#C9A227] outline-none"
          />
        </div>

        {/* City Filter */}
        <div>
          <label className="text-[#888888] block mb-1 font-bold">CITY / HUB</label>
          <select
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
            className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-white focus:border-[#C9A227] outline-none"
          >
            <option value="ALL">All Cities ({availableCities.length})</option>
            {availableCities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Signal Type Filter */}
        <div>
          <label className="text-[#888888] block mb-1 font-bold">SIGNAL TYPE</label>
          <select
            value={signalTypeFilter}
            onChange={e => setSignalTypeFilter(e.target.value)}
            className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-white focus:border-[#C9A227] outline-none"
          >
            <option value="ALL">All Signal Types</option>
            {availableSignalTypes.map(st => (
              <option key={st} value={st}>{st.replaceAll('_', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="text-[#888888] block mb-1 font-bold">DATE ORDER</label>
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

      <div className="flex items-center justify-between text-xs font-mono text-[#888888]">
        <span>
          SHOWING {filteredSignals.length} VERIFIED MARKET SIGNALS
        </span>
        <span className="text-[#C9A227]">
          VERIFICATION: VERIFIED / DOCUMENTED
        </span>
      </div>

      {/* Signal Stream */}
      <div className="space-y-4">
        {filteredSignals.length === 0 ? (
          <div className="p-12 text-center bg-[#111111] border border-[#1A1D1B] rounded-2xl text-xs font-mono space-y-3">
            <span className="text-2xl">🔍</span>
            <div className="text-sm font-bold text-white uppercase">NO VERIFIED RESULTS</div>
            <p className="text-xs text-[#888888] max-w-md mx-auto font-sans leading-relaxed">
              No verified market signals matched your filter criteria. Reset the category or search terms to view all documented signals.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setActiveCategory('ALL');
                  setSignalTypeFilter('ALL');
                  setCityFilter('ALL');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#C9A227] text-[#050505] font-mono text-xs font-bold rounded-lg hover:bg-[#E4C58F]"
              >
                RESET ALL SIGNAL FILTERS →
              </button>
            </div>
          </div>
        ) : (
          filteredSignals.map(act => (
            <div
              key={act.id}
              className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#C9A227]/40 transition-all"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap font-mono">
                  <span className="px-2 py-0.5 bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] rounded text-[10px] uppercase font-bold">
                    {act.signal_type.replaceAll('_', ' ')}
                  </span>
                  <span className="text-xs text-[#888888]">{act.event_date}</span>
                  <span className="px-2 py-0.5 bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30 rounded text-[9px] font-bold uppercase">
                    {act.verification_state || 'VERIFIED'}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white tracking-tight">
                  {act.title}
                </h2>

                <p className="text-xs text-[#A0A0A0] leading-relaxed font-sans">
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
