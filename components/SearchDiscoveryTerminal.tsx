'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface Company {
  name: string;
  slug: string;
  type: string;
  location: string;
  description?: string;
  specializations?: string[];
}

interface Project {
  name: string;
  slug: string;
  project_type: string;
  status: string;
  status_display: string;
  location: string;
  developer_name?: string;
  contractor_name?: string;
  architect_name?: string;
}

interface Signal {
  id: string;
  title: string;
  signal_type: string;
  event_date: string;
  summary: string;
  source_url?: string;
  company_name?: string;
  company_slug?: string;
  project_name?: string;
  project_slug?: string;
  location?: string;
}

interface SearchDiscoveryTerminalProps {
  initialQuery: string;
  companies: Company[];
  projects: Project[];
  signals: Signal[];
  locations: { name: string; slug: string; region?: string; county?: string }[];
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

export function SearchDiscoveryTerminal({
  initialQuery,
  companies,
  projects,
  signals,
  locations
}: SearchDiscoveryTerminalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [entityFilter, setEntityFilter] = useState<string>('ALL');
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>('ALL');

  const normalizedQuery = useMemo(() => normalizeDiacritics(query.trim()), [query]);

  // Filter Companies
  const matchingCompanies = useMemo(() => {
    return companies.filter(c => {
      // Entity type filter
      if (entityFilter !== 'ALL') {
        if (entityFilter === 'DEVELOPER' && c.type !== 'developer') return false;
        if (entityFilter === 'AGENCY' && c.type !== 'real_estate_agency') return false;
        if (entityFilter === 'CONTRACTOR' && c.type !== 'general_contractor' && c.type !== 'construction_company' && c.type !== 'infrastructure') return false;
        if (entityFilter === 'ARCHITECT' && c.type !== 'architecture') return false;
        if (entityFilter === 'ENGINEER' && c.type !== 'engineering' && c.type !== 'structural_engineering' && c.type !== 'mep') return false;
      }

      // City filter
      if (cityFilter !== 'ALL') {
        if (!normalizeDiacritics(c.location).includes(normalizeDiacritics(cityFilter))) return false;
      }

      if (!normalizedQuery) return true;

      const nameNorm = normalizeDiacritics(c.name);
      const descNorm = normalizeDiacritics(c.description || '');
      const locNorm = normalizeDiacritics(c.location || '');
      const typeNorm = normalizeDiacritics(c.type || '');
      const specsNorm = (c.specializations || []).map(normalizeDiacritics);

      return (
        nameNorm.includes(normalizedQuery) ||
        descNorm.includes(normalizedQuery) ||
        locNorm.includes(normalizedQuery) ||
        typeNorm.includes(normalizedQuery) ||
        specsNorm.some(s => s.includes(normalizedQuery))
      );
    });
  }, [companies, normalizedQuery, entityFilter, cityFilter]);

  // Filter Projects
  const matchingProjects = useMemo(() => {
    return projects.filter(p => {
      if (entityFilter !== 'ALL' && entityFilter !== 'PROJECT') return false;

      // City filter
      if (cityFilter !== 'ALL') {
        if (!normalizeDiacritics(p.location).includes(normalizeDiacritics(cityFilter))) return false;
      }

      // Project Type filter
      if (projectTypeFilter !== 'ALL') {
        if (normalizeDiacritics(p.project_type) !== normalizeDiacritics(projectTypeFilter)) return false;
      }

      if (!normalizedQuery) return true;

      const nameNorm = normalizeDiacritics(p.name);
      const locNorm = normalizeDiacritics(p.location || '');
      const typeNorm = normalizeDiacritics(p.project_type || '');
      const devNorm = normalizeDiacritics(p.developer_name || '');
      const gcNorm = normalizeDiacritics(p.contractor_name || '');
      const archNorm = normalizeDiacritics(p.architect_name || '');

      return (
        nameNorm.includes(normalizedQuery) ||
        locNorm.includes(normalizedQuery) ||
        typeNorm.includes(normalizedQuery) ||
        devNorm.includes(normalizedQuery) ||
        gcNorm.includes(normalizedQuery) ||
        archNorm.includes(normalizedQuery)
      );
    });
  }, [projects, normalizedQuery, entityFilter, cityFilter, projectTypeFilter]);

  // Filter Signals
  const matchingSignals = useMemo(() => {
    return signals.filter(s => {
      if (entityFilter !== 'ALL' && entityFilter !== 'SIGNAL') return false;

      if (cityFilter !== 'ALL') {
        if (!normalizeDiacritics(s.location || '').includes(normalizeDiacritics(cityFilter))) return false;
      }

      if (!normalizedQuery) return true;

      const titleNorm = normalizeDiacritics(s.title);
      const summaryNorm = normalizeDiacritics(s.summary || '');
      const compNorm = normalizeDiacritics(s.company_name || '');
      const projNorm = normalizeDiacritics(s.project_name || '');

      return (
        titleNorm.includes(normalizedQuery) ||
        summaryNorm.includes(normalizedQuery) ||
        compNorm.includes(normalizedQuery) ||
        projNorm.includes(normalizedQuery)
      );
    });
  }, [signals, normalizedQuery, entityFilter, cityFilter]);

  // Unique cities from dataset
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    locations.forEach(l => set.add(l.name));
    return Array.from(set).sort();
  }, [locations]);

  const totalResults = matchingCompanies.length + matchingProjects.length + matchingSignals.length;

  return (
    <div className="space-y-8">
      {/* Search Input Terminal */}
      <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-3.5 text-base">🔍</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search company, CUI, project name, city, contractor, signal..."
              className="w-full h-12 pl-11 pr-4 bg-[#050505] border border-[#1A1D1B] rounded-xl text-base text-white placeholder-[#666666] focus:outline-none focus:border-[#C9A227]/50 font-sans"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-3.5 text-xs text-[#888888] hover:text-white font-mono"
              >
                CLEAR ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#1A1D1B] text-xs font-mono">
          {/* Entity Type Filter */}
          <div>
            <label className="text-[#888888] block mb-1 font-bold">ENTITY TAXONOMY</label>
            <select
              value={entityFilter}
              onChange={e => setEntityFilter(e.target.value)}
              className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-white focus:border-[#C9A227] outline-none"
            >
              <option value="ALL">All Entity Types</option>
              <option value="DEVELOPER">Developers ({companies.filter(c => c.type === 'developer').length})</option>
              <option value="CONTRACTOR">Contractors ({companies.filter(c => c.type === 'general_contractor' || c.type === 'construction_company' || c.type === 'infrastructure').length})</option>
              <option value="AGENCY">Real Estate Agencies ({companies.filter(c => c.type === 'real_estate_agency').length})</option>
              <option value="ARCHITECT">Architects ({companies.filter(c => c.type === 'architecture').length})</option>
              <option value="ENGINEER">Engineers ({companies.filter(c => c.type === 'engineering' || c.type === 'structural_engineering' || c.type === 'mep').length})</option>
              <option value="PROJECT">Projects Only ({projects.length})</option>
            </select>
          </div>

          {/* City / Location Filter */}
          <div>
            <label className="text-[#888888] block mb-1 font-bold">CITY / REGIONAL HUB</label>
            <select
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-white focus:border-[#C9A227] outline-none"
            >
              <option value="ALL">All Regional Hubs ({locations.length})</option>
              {availableCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Project Type Filter */}
          <div>
            <label className="text-[#888888] block mb-1 font-bold">PROJECT ASSET CLASS</label>
            <select
              value={projectTypeFilter}
              onChange={e => setProjectTypeFilter(e.target.value)}
              className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-white focus:border-[#C9A227] outline-none"
            >
              <option value="ALL">All Asset Classes</option>
              <option value="Residential">Residential</option>
              <option value="Office">Office</option>
              <option value="Mixed-use">Mixed-use</option>
              <option value="Industrial/Logistics">Industrial / Logistics</option>
              <option value="Civil Infrastructure">Civil Infrastructure</option>
              <option value="Retail">Retail</option>
              <option value="Hospitality">Hospitality</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3 text-xs font-mono">
        <span className="text-white font-bold">
          SEARCH RESULTS ({totalResults})
        </span>
        <span className="text-[#C9A227]">
          DIACRITIC NORMALIZATION: ACTIVE
        </span>
      </div>

      {totalResults === 0 ? (
        <div className="p-12 text-center bg-[#111111] border border-[#1A1D1B] rounded-2xl space-y-4">
          <span className="text-3xl">🔍</span>
          <h2 className="text-xl font-bold text-white">No Direct Matches Found</h2>
          <p className="text-xs text-[#A0A0A0] max-w-md mx-auto leading-relaxed">
            No indexed market entities, projects, or signals matched your search criteria. Try adjusting your query or resetting the entity filters.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setQuery('');
                setEntityFilter('ALL');
                setCityFilter('ALL');
                setProjectTypeFilter('ALL');
              }}
              className="px-4 py-2 bg-[#C9A227] text-[#050505] text-xs font-mono font-bold rounded-lg hover:bg-[#E4C58F]"
            >
              RESET ALL SEARCH FILTERS →
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Companies Section */}
          {matchingCompanies.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-mono text-[#C9A227] uppercase tracking-widest font-bold flex items-center justify-between">
                <span>COMPANIES & MARKET ENTITIES ({matchingCompanies.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {matchingCompanies.map(c => (
                  <div key={c.slug} className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col justify-between space-y-3 hover:border-[#C9A227]/40 transition-all">
                    <div>
                      <span className="text-[10px] font-mono text-[#C9A227] font-bold uppercase">{c.type.replaceAll('_', ' ')}</span>
                      <h4 className="text-base font-bold text-white mt-1">
                        <Link href={`/companies/${c.slug}`} className="hover:text-[#C9A227] transition-colors">
                          {c.name}
                        </Link>
                      </h4>
                      <p className="text-xs text-[#A0A0A0] line-clamp-2 mt-1">{c.description}</p>
                    </div>
                    <div className="pt-3 border-t border-[#1A1D1B] flex items-center justify-between text-xs font-mono">
                      <span className="text-[#888888]">{c.location}</span>
                      <Link href={`/companies/${c.slug}`} className="text-[#C9A227] font-bold">
                        DOSSIER →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {matchingProjects.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest font-bold flex items-center justify-between">
                <span>CONSTRUCTION PROJECTS ({matchingProjects.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {matchingProjects.map(p => (
                  <div key={p.slug} className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col justify-between space-y-3 hover:border-[#38bdf8]/40 transition-all">
                    <div>
                      <span className="text-[10px] font-mono text-[#38bdf8] font-bold uppercase">{p.status_display}</span>
                      <h4 className="text-base font-bold text-white mt-1">
                        <Link href={`/projects/${p.slug}`} className="hover:text-[#38bdf8] transition-colors">
                          {p.name}
                        </Link>
                      </h4>
                      <p className="text-xs text-[#A0A0A0] mt-1 font-mono">{p.project_type} · {p.location}</p>
                      {p.developer_name && (
                        <p className="text-[11px] text-[#888888] font-mono mt-1">Dev: {p.developer_name}</p>
                      )}
                    </div>
                    <div className="pt-3 border-t border-[#1A1D1B] flex items-center justify-between text-xs font-mono">
                      <span className="text-[#888888]">{p.location}</span>
                      <Link href={`/projects/${p.slug}`} className="text-[#38bdf8] font-bold">
                        PROJECT DOSSIER →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signals Section */}
          {matchingSignals.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-mono text-[#86efac] uppercase tracking-widest font-bold">
                VERIFIED MARKET SIGNALS ({matchingSignals.length})
              </h3>
              <div className="space-y-3">
                {matchingSignals.map(s => (
                  <div key={s.id} className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono text-[#86efac] font-bold uppercase">{s.signal_type.replaceAll('_', ' ')} · {s.event_date}</span>
                      <h4 className="text-sm font-semibold text-white mt-0.5">{s.title}</h4>
                      {s.summary && <p className="text-xs text-[#888888] mt-1">{s.summary}</p>}
                    </div>
                    {s.source_url && (
                      <a href={s.source_url} target="_blank" rel="noreferrer" className="text-xs font-mono text-[#C9A227] hover:underline shrink-0 font-bold">
                        CITATION ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
