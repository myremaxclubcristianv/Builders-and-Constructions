'use client';

import { useState, useMemo, useEffect } from "react";
import { trackSiteSearch } from "@/lib/visitor-tracker";
import { searchKnowledge, KnowledgeSearchResult } from "@/lib/knowledge-data";
import Link from "next/link";

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
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ș/g, "s")
    .replace(/ț/g, "t")
    .replace(/ă/g, "a")
    .replace(/â/g, "a")
    .replace(/î/g, "i");
}

export function SearchDiscoveryTerminal({
  initialQuery,
  companies,
  projects,
  signals,
  locations,
}: SearchDiscoveryTerminalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [entityFilter, setEntityFilter] = useState<string>("ALL");
  const [cityFilter, setCityFilter] = useState<string>("ALL");
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>("ALL");

  const normalizedQuery = useMemo(() => normalizeDiacritics(query.trim()), [query]);

  // Search Technical Construction Knowledge Base
  const matchingKnowledge = useMemo(() => {
    if (!normalizedQuery || normalizedQuery.length < 2) return [];
    if (entityFilter !== "ALL" && entityFilter !== "KNOWLEDGE") return [];
    return searchKnowledge(normalizedQuery);
  }, [normalizedQuery, entityFilter]);

  // Filter Companies
  const matchingCompanies = useMemo(() => {
    if (entityFilter === "KNOWLEDGE") return [];
    return companies.filter((c) => {
      // Entity type filter
      if (entityFilter !== "ALL") {
        if (entityFilter === "DEVELOPER" && c.type !== "developer") return false;
        if (entityFilter === "AGENCY" && c.type !== "real_estate_agency") return false;
        if (
          entityFilter === "CONTRACTOR" &&
          c.type !== "general_contractor" &&
          c.type !== "construction_company" &&
          c.type !== "infrastructure"
        )
          return false;
        if (entityFilter === "ARCHITECT" && c.type !== "architecture") return false;
        if (
          entityFilter === "ENGINEER" &&
          c.type !== "engineering" &&
          c.type !== "structural_engineering" &&
          c.type !== "mep"
        )
          return false;
      }

      // City filter
      if (cityFilter !== "ALL") {
        if (!normalizeDiacritics(c.location).includes(normalizeDiacritics(cityFilter))) return false;
      }

      if (!normalizedQuery) return true;

      const nameNorm = normalizeDiacritics(c.name);
      const descNorm = normalizeDiacritics(c.description || "");
      const locNorm = normalizeDiacritics(c.location || "");
      const typeNorm = normalizeDiacritics(c.type || "");
      const specsNorm = (c.specializations || []).map(normalizeDiacritics);

      return (
        nameNorm.includes(normalizedQuery) ||
        descNorm.includes(normalizedQuery) ||
        locNorm.includes(normalizedQuery) ||
        typeNorm.includes(normalizedQuery) ||
        specsNorm.some((s) => s.includes(normalizedQuery))
      );
    });
  }, [companies, normalizedQuery, entityFilter, cityFilter]);

  // Filter Projects
  const matchingProjects = useMemo(() => {
    if (entityFilter === "KNOWLEDGE") return [];
    return projects.filter((p) => {
      if (entityFilter !== "ALL" && entityFilter !== "PROJECT") return false;

      // City filter
      if (cityFilter !== "ALL") {
        if (!normalizeDiacritics(p.location).includes(normalizeDiacritics(cityFilter))) return false;
      }

      // Project Type filter
      if (projectTypeFilter !== "ALL") {
        if (normalizeDiacritics(p.project_type) !== normalizeDiacritics(projectTypeFilter)) return false;
      }

      if (!normalizedQuery) return true;

      const nameNorm = normalizeDiacritics(p.name);
      const locNorm = normalizeDiacritics(p.location || "");
      const typeNorm = normalizeDiacritics(p.project_type || "");
      const devNorm = normalizeDiacritics(p.developer_name || "");
      const gcNorm = normalizeDiacritics(p.contractor_name || "");
      const archNorm = normalizeDiacritics(p.architect_name || "");

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
    if (entityFilter === "KNOWLEDGE") return [];
    return signals.filter((s) => {
      if (entityFilter !== "ALL" && entityFilter !== "SIGNAL") return false;

      if (cityFilter !== "ALL") {
        if (!normalizeDiacritics(s.location || "").includes(normalizeDiacritics(cityFilter))) return false;
      }

      if (!normalizedQuery) return true;

      const titleNorm = normalizeDiacritics(s.title);
      const summaryNorm = normalizeDiacritics(s.summary || "");
      const compNorm = normalizeDiacritics(s.company_name || "");
      const projNorm = normalizeDiacritics(s.project_name || "");

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
    locations.forEach((l) => set.add(l.name));
    return Array.from(set).sort();
  }, [locations]);

  const totalResults =
    matchingCompanies.length +
    matchingProjects.length +
    matchingSignals.length +
    matchingKnowledge.length;

  useEffect(() => {
    if (!query || query.trim().length < 2) return;
    const timer = setTimeout(() => {
      trackSiteSearch(query.trim(), totalResults);
    }, 800);
    return () => clearTimeout(timer);
  }, [query, totalResults]);

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
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies, projects, materials (concrete, EPS, steel), standards (NE 012), glossary (POT, CUT)..."
              className="w-full h-12 pl-11 pr-4 bg-[#050505] border border-[#1A1D1B] rounded-xl text-sm sm:text-base text-white placeholder-[#666666] focus:outline-none focus:border-[#C9A227]/50 font-sans min-h-[48px]"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-3.5 text-xs text-[#888888] hover:text-white font-mono p-1"
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
            <label className="text-[#888888] block mb-1 font-bold">TAXONOMY SCOPE</label>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-white focus:border-[#C9A227] outline-none min-h-[44px]"
            >
              <option value="ALL">All Categories & Knowledge</option>
              <option value="KNOWLEDGE">Construction Knowledge Base ({matchingKnowledge.length})</option>
              <option value="DEVELOPER">Developers ({companies.filter((c) => c.type === "developer").length})</option>
              <option value="CONTRACTOR">Contractors ({companies.filter((c) => c.type === "general_contractor" || c.type === "construction_company" || c.type === "infrastructure").length})</option>
              <option value="PROJECT">Projects Only ({projects.length})</option>
              <option value="ARCHITECT">Architects ({companies.filter((c) => c.type === "architecture").length})</option>
              <option value="ENGINEER">Engineers ({companies.filter((c) => c.type === "engineering" || c.type === "structural_engineering" || c.type === "mep").length})</option>
            </select>
          </div>

          {/* City / Location Filter */}
          <div>
            <label className="text-[#888888] block mb-1 font-bold">CITY / REGIONAL HUB</label>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-white focus:border-[#C9A227] outline-none min-h-[44px]"
            >
              <option value="ALL">All Regional Hubs ({locations.length})</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Project Type Filter */}
          <div>
            <label className="text-[#888888] block mb-1 font-bold">PROJECT ASSET CLASS</label>
            <select
              value={projectTypeFilter}
              onChange={(e) => setProjectTypeFilter(e.target.value)}
              className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-white focus:border-[#C9A227] outline-none min-h-[44px]"
            >
              <option value="ALL">All Asset Classes</option>
              <option value="Residential">Residential</option>
              <option value="Office">Office</option>
              <option value="Mixed-use">Mixed-use</option>
              <option value="Industrial">Industrial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3 text-xs font-mono">
        <span className="text-[#888888]">
          FOUND <span className="text-[#C9A227] font-bold">{totalResults}</span> MATCHING RECORDS
        </span>
        {query && (
          <span className="text-[#666666]">
            QUERY: &ldquo;<span className="text-white">{query}</span>&rdquo;
          </span>
        )}
      </div>

      {/* 1. MATCHING KNOWLEDGE BASE RESULTS */}
      {matchingKnowledge.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#C9A227] font-bold flex items-center gap-2">
              <span>📚</span> CONSTRUCTION KNOWLEDGE & MATERIALS INTELLIGENCE ({matchingKnowledge.length})
            </h3>
            <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
              VERIFIED TECHNICAL DATA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingKnowledge.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="p-5 bg-[#0B0C0B] border border-[#C9A227]/30 hover:border-[#C9A227] rounded-xl space-y-3 transition-all duration-300 group block"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-[#C9A227] px-2 py-0.5 bg-[#C9A227]/10 rounded truncate">
                    {item.category}
                  </span>
                  <span className="text-[9px] font-mono text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded shrink-0">
                    {item.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-[#C9A227] transition-colors">
                    {item.title}
                  </h4>
                  {item.romanianTitle && (
                    <p className="text-xs font-mono text-[#888888]">RO: {item.romanianTitle}</p>
                  )}
                </div>

                <p className="text-xs text-[#AAAAAA] line-clamp-3 leading-relaxed">
                  {item.snippet}
                </p>

                <div className="text-[11px] font-mono text-[#C9A227] flex items-center gap-1 pt-2 border-t border-[#1A1D1B]">
                  <span>OPEN TECHNICAL DOSSIER</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 2. MATCHING COMPANIES */}
      {matchingCompanies.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#888888] font-bold">
            CORPORATE ENTITIES ({matchingCompanies.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingCompanies.map((c) => (
              <Link
                key={c.slug}
                href={`/companies/${c.slug}`}
                className="p-5 bg-[#0E0F0E] border border-[#1A1D1B] hover:border-[#C9A227]/40 rounded-xl space-y-3 transition-all duration-300 group block"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#888888] uppercase">{c.type.replace(/_/g, " ")}</span>
                  <span className="text-[10px] font-mono text-[#C9A227]">{c.location}</span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-[#C9A227] transition-colors">
                  {c.name}
                </h4>
                {c.description && (
                  <p className="text-xs text-[#AAAAAA] line-clamp-2 leading-relaxed">{c.description}</p>
                )}
                {c.specializations && c.specializations.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {c.specializations.slice(0, 3).map((s, sIdx) => (
                      <span key={sIdx} className="text-[9px] font-mono bg-[#141514] text-[#888888] px-1.5 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 3. MATCHING PROJECTS */}
      {matchingProjects.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#888888] font-bold">
            CONSTRUCTION & DEVELOPMENT PROJECTS ({matchingProjects.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingProjects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="p-5 bg-[#0E0F0E] border border-[#1A1D1B] hover:border-[#C9A227]/40 rounded-xl space-y-3 transition-all duration-300 group block"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#888888] uppercase">{p.project_type}</span>
                  <span className="text-[10px] font-mono text-[#10B981]">{p.status_display || p.status}</span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-[#C9A227] transition-colors">
                  {p.name}
                </h4>
                <div className="text-xs font-mono text-[#777777] space-y-0.5">
                  <div>Location: <span className="text-white">{p.location}</span></div>
                  {p.developer_name && <div>Developer: <span className="text-[#AAAAAA]">{p.developer_name}</span></div>}
                  {p.contractor_name && <div>Contractor: <span className="text-[#AAAAAA]">{p.contractor_name}</span></div>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 4. MATCHING SIGNALS */}
      {matchingSignals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#888888] font-bold">
            DOCUMENTED MARKET SIGNALS ({matchingSignals.length})
          </h3>
          <div className="space-y-3">
            {matchingSignals.map((s) => (
              <div
                key={s.id}
                className="p-4 bg-[#0E0F0E] border border-[#1A1D1B] rounded-xl space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[#888888]">
                  <span className="text-[#C9A227]">{s.signal_type}</span>
                  <span>{s.event_date}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{s.title}</h4>
                <p className="text-[#AAAAAA] leading-relaxed">{s.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalResults === 0 && (
        <div className="py-16 text-center space-y-4 bg-[#0B0C0B] border border-[#1A1D1B] rounded-2xl p-8">
          <span className="text-3xl">🔍</span>
          <h3 className="text-lg font-bold text-white">No records matching your search</h3>
          <p className="text-xs text-[#888888] max-w-md mx-auto">
            Try broadening your search term (e.g. &ldquo;Concrete&rdquo;, &ldquo;NE 012&rdquo;, &ldquo;One United&rdquo;, &ldquo;Bucharest&rdquo;, &ldquo;EPS&rdquo;, &ldquo;POT&rdquo;).
          </p>
        </div>
      )}
    </div>
  );
}
