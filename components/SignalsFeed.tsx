'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { BuildingIcon, CraneIcon, LocationPinIcon, SearchIcon } from '@/components/icons/NavIcons';

export interface SignalItem {
  id: string;
  title: string;
  signal_type: string;
  event_date: string;
  publication_date?: string;
  data_period?: string;
  summary: string;
  source_url?: string;
  source_name?: string;
  evidence_classification?: string;
  verification_state?: string;
  commercial_relevance?: string;
  why_it_matters?: string;
  company_name?: string;
  company_slug?: string;
  project_name?: string;
  project_slug?: string;
  location?: string;
  city?: string;
  last_verified_at?: string;
  cadence?: string;
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
    { label: 'TOATE SEMNALELE', key: 'ALL' },
    { label: 'DEZVOLTATORI', key: 'DEVELOPER' },
    { label: 'CONSTRUCTORI', key: 'CONTRACTOR' },
    { label: 'PROIECTE', key: 'PROJECT' },
    { label: 'INFRASTRUCTURĂ', key: 'INFRASTRUCTURE' },
    { label: 'INVESTIȚII', key: 'INVESTMENT' },
    { label: 'RAPOARTE CORPORATE', key: 'OFFICIAL_DISCLOSURE' },
    { label: 'AUTORIZAȚII & PUZ', key: 'PLANNING_PERMIT' },
    { label: 'EXECUȚIE & ȘANTIER', key: 'CONSTRUCTION_MILESTONE' }
  ];

  // Extract unique cities and signal types
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    signals.forEach(s => {
      if (s.city) {
        set.add(s.city);
      } else if (s.location) {
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
        if (activeCategory === 'DEVELOPER' && (!sig.company_name || sig.signal_type.includes('INFRASTRUCTURĂ'))) return false;
        if (activeCategory === 'CONTRACTOR' && !(sig.summary.toLowerCase().includes('contractor') || sig.summary.toLowerCase().includes('construct') || sig.signal_type.includes('STRUCTUR') || sig.signal_type.includes('EXECUȚIE'))) return false;
        if (activeCategory === 'PROJECT' && !sig.project_name) return false;
        if (activeCategory === 'INFRASTRUCTURE' && !sig.signal_type.includes('INFRASTRUCTURĂ') && !sig.summary.toLowerCase().includes('centur') && !sig.summary.toLowerCase().includes('autostrad')) return false;
        if (activeCategory === 'INVESTMENT' && !sig.signal_type.includes('INVESTIȚ') && !sig.signal_type.includes('PREÎNCHIRIERE') && !sig.signal_type.includes('DEZVOLTARE')) return false;
        if (activeCategory === 'OFFICIAL_DISCLOSURE' && !sig.evidence_classification?.includes('SURSĂ OFICIALĂ') && !sig.evidence_classification?.includes('CORPORATE')) return false;
        if (activeCategory === 'PLANNING_PERMIT' && !sig.signal_type.includes('AUTORIZAȚ') && !sig.signal_type.includes('PUZ')) return false;
        if (activeCategory === 'CONSTRUCTION_MILESTONE' && !sig.signal_type.includes('STRUCTUR') && !sig.signal_type.includes('ȘANTIER') && !sig.signal_type.includes('EXECUȚIE')) return false;
      }

      // Signal Type Filter
      if (signalTypeFilter !== 'ALL') {
        if (sig.signal_type !== signalTypeFilter) return false;
      }

      // City Filter
      if (cityFilter !== 'ALL') {
        const loc = sig.city || sig.location || '';
        if (!normalizeDiacritics(loc).includes(normalizeDiacritics(cityFilter))) return false;
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
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider shrink-0 transition-all ${
              activeCategory === cat.key
                ? 'bg-[#b45309] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
        {/* Search */}
        <div>
          <label className="text-slate-500 block mb-1 font-bold">CAUTĂ SEMNALE</label>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Companie, proiect, cuvânt-cheie..."
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-[#b45309] focus:ring-1 focus:ring-[#b45309] outline-none"
          />
        </div>

        {/* City Filter */}
        <div>
          <label className="text-slate-500 block mb-1 font-bold">ORAȘ / POL REGIONAL</label>
          <select
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-[#b45309] focus:ring-1 focus:ring-[#b45309] outline-none"
          >
            <option value="ALL">Toate Orașele ({availableCities.length})</option>
            {availableCities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Signal Type Filter */}
        <div>
          <label className="text-slate-500 block mb-1 font-bold">TIP DE SEMNAL</label>
          <select
            value={signalTypeFilter}
            onChange={e => setSignalTypeFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-[#b45309] focus:ring-1 focus:ring-[#b45309] outline-none"
          >
            <option value="ALL">Toate Tipurile</option>
            {availableSignalTypes.map(st => (
              <option key={st} value={st}>{st.replaceAll('_', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="text-slate-500 block mb-1 font-bold">ORDONARE DATĂ</label>
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value as 'NEWEST' | 'OLDEST')}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-[#b45309] focus:ring-1 focus:ring-[#b45309] outline-none"
          >
            <option value="NEWEST">Cele mai recente mai întâi</option>
            <option value="OLDEST">Cele mai vechi mai întâi</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-500">
        <span>
          AFIȘARE: {filteredSignals.length} SEMNALE DE PIAȚĂ DOCUMENTATE
        </span>
        <span className="text-[#b45309] font-medium">
          DOCUMENTE &amp; SURSE VERIFICATE · ULTIMA ACTUALIZARE: 8 NOIEMBRIE 2026
        </span>
      </div>

      {/* Signal Stream */}
      <div className="space-y-4">
        {filteredSignals.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono space-y-3">
            <div className="flex justify-center">
              <SearchIcon className="w-8 h-8 text-[#b45309] opacity-80" />
            </div>
            <div className="text-sm font-bold text-slate-900 uppercase">NICIUN SEMNAL GĂSIT</div>
            <p className="text-xs text-slate-600 max-w-md mx-auto font-sans leading-relaxed">
              Niciun semnal de piață verificat nu corespunde filtrelor selectate. Resetați filtrele pentru a vizualiza întregul flux documentar.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setActiveCategory('ALL');
                  setSignalTypeFilter('ALL');
                  setCityFilter('ALL');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#b45309] text-white font-mono text-xs font-bold rounded-lg hover:bg-[#92400e] transition-colors"
              >
                RESETEAZĂ TOATE FILTRELE →
              </button>
            </div>
          </div>
        ) : (
          filteredSignals.map(act => (
            <div
              key={act.id}
              className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-amber-400 hover:shadow-md transition-all"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 flex-wrap font-mono">
                  <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-[#b45309] rounded-md text-[10px] uppercase font-bold">
                    {act.signal_type.replaceAll('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    DATĂ: {act.event_date}
                  </span>
                  {act.cadence && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[9px] font-bold uppercase">
                      {act.cadence}
                    </span>
                  )}
                  {act.evidence_classification && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[9px] font-bold uppercase">
                      {act.evidence_classification}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                  {act.title}
                </h2>

                <p className="text-sm text-slate-600 leading-relaxed font-sans">
                  {act.summary}
                </p>

                {act.why_it_matters && (
                  <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl text-xs text-amber-900 font-sans leading-relaxed">
                    <span className="font-bold text-[#b45309] font-mono block text-[11px] mb-0.5 uppercase tracking-wide">
                      💡 Relevanță pentru Piață
                    </span>
                    {act.why_it_matters}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-mono text-slate-500">
                  {act.company_slug && (
                    <Link href={`/companies/${act.company_slug}`} className="text-[#b45309] font-medium hover:underline flex items-center gap-1.5">
                      <BuildingIcon className="w-3.5 h-3.5 text-[#b45309] shrink-0" />
                      <span>{act.company_name}</span>
                    </Link>
                  )}
                  {act.project_slug && (
                    <Link href={`/projects/${act.project_slug}`} className="text-blue-600 font-medium hover:underline flex items-center gap-1.5">
                      <CraneIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{act.project_name}</span>
                    </Link>
                  )}
                  {act.location && (
                    <span className="flex items-center gap-1.5">
                      <LocationPinIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{act.location}</span>
                    </span>
                  )}
                </div>
              </div>

              {act.source_url && (
                <div className="shrink-0 self-start md:self-start pt-1">
                  <a
                    href={act.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 rounded-lg hover:border-amber-400 hover:text-[#b45309] hover:bg-amber-50/40 transition-all font-semibold"
                  >
                    <span>Sursă Directă</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                  {act.source_name && (
                    <span className="block text-[10px] font-mono text-slate-400 mt-1 max-w-[150px] truncate">
                      {act.source_name}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Independent Platform Disclosure */}
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-500 leading-relaxed">
        <strong className="text-slate-800">DECLARAȚIE DE INDEPENDENȚĂ EDITORIALĂ:</strong> CONSTRUCTIONS by AiXLuxury este o platformă independentă de intelligence și analiză de piață. Semnalele sunt compilate exclusiv din autorizații oficiale de construire, comunicate corporative verificate, date din registre publice și surse de presă economică documentate. Nu sunt incluse date speculative sau afirmații comerciale neconfirmate.
      </div>
    </div>
  );
}
