'use client';

import { useState, useMemo, useEffect } from "react";
import { trackSiteSearch } from "@/lib/visitor-tracker";
import { searchKnowledge } from "@/lib/knowledge-data";
import { ServiceDefinition } from "@/lib/services-config";
import { SearchIcon, BookIcon, BriefcaseIcon, ShieldIcon } from "@/components/icons/NavIcons";
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
  services?: ServiceDefinition[];
  signals: Signal[];
  locations: { name: string; slug: string; region?: string; county?: string }[];
}

function normalizeDiacritics(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
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
  services = [],
  signals,
  locations,
}: SearchDiscoveryTerminalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [entityFilter, setEntityFilter] = useState<string>("ALL");
  const [cityFilter, setCityFilter] = useState<string>("ALL");
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>("ALL");

  const normalizedQuery = useMemo(() => normalizeDiacritics(query.trim()), [query]);

  // Synchronize state from URL parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const urlQ = sp.get('q');
      const urlEntity = sp.get('entity');
      const urlCity = sp.get('city');
      const urlType = sp.get('type');
      if (urlQ && !query) setQuery(urlQ);
      if (urlEntity) setEntityFilter(urlEntity);
      if (urlCity) setCityFilter(urlCity);
      if (urlType) setProjectTypeFilter(urlType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update URL search parameters whenever filter states change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams();
      if (query.trim()) sp.set('q', query.trim());
      if (entityFilter !== 'ALL') sp.set('entity', entityFilter);
      if (cityFilter !== 'ALL') sp.set('city', cityFilter);
      if (projectTypeFilter !== 'ALL') sp.set('type', projectTypeFilter);
      const newQuery = sp.toString();
      const newUrl = newQuery ? `${window.location.pathname}?${newQuery}` : window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    }
  }, [query, entityFilter, cityFilter, projectTypeFilter]);

  const clearAllFilters = () => {
    setQuery('');
    setEntityFilter('ALL');
    setCityFilter('ALL');
    setProjectTypeFilter('ALL');
  };

  // Search Technical Construction Knowledge Base
  const matchingKnowledge = useMemo(() => {
    if (entityFilter !== "ALL" && entityFilter !== "KNOWLEDGE") return [];
    if (!normalizedQuery) return [];
    return searchKnowledge(normalizedQuery);
  }, [normalizedQuery, entityFilter]);

  // Filter Companies
  const matchingCompanies = useMemo(() => {
    if (entityFilter === "SERVICES" || entityFilter === "KNOWLEDGE" || entityFilter === "PROJECT") {
      return [];
    }

    return companies.filter((c) => {
      // Entity type filtering
      if (entityFilter === "DEVELOPER" && c.type !== "developer") return false;
      if (
        entityFilter === "CONTRACTOR" &&
        c.type !== "general_contractor" &&
        c.type !== "construction_company" &&
        c.type !== "infrastructure"
      ) {
        return false;
      }
      if (entityFilter === "ARCHITECT" && c.type !== "architecture") return false;
      if (
        entityFilter === "ENGINEER" &&
        c.type !== "engineering" &&
        c.type !== "structural_engineering" &&
        c.type !== "mep"
      ) {
        return false;
      }

      // City filter
      if (cityFilter !== "ALL" && !c.location.toLowerCase().includes(cityFilter.toLowerCase())) {
        return false;
      }

      // Text query match
      if (!normalizedQuery) return true;

      const normName = normalizeDiacritics(c.name);
      const normLoc = normalizeDiacritics(c.location);
      const normDesc = normalizeDiacritics(c.description || "");
      const normSpecs = (c.specializations || []).map(normalizeDiacritics).join(" ");

      return (
        normName.includes(normalizedQuery) ||
        normLoc.includes(normalizedQuery) ||
        normDesc.includes(normalizedQuery) ||
        normSpecs.includes(normalizedQuery)
      );
    });
  }, [companies, entityFilter, cityFilter, normalizedQuery]);

  // Filter Projects
  const matchingProjects = useMemo(() => {
    if (entityFilter === "SERVICES" || entityFilter === "KNOWLEDGE" || entityFilter === "DEVELOPER" || entityFilter === "CONTRACTOR" || entityFilter === "ARCHITECT" || entityFilter === "ENGINEER") {
      return [];
    }

    return projects.filter((p) => {
      // City filter
      if (cityFilter !== "ALL" && !p.location.toLowerCase().includes(cityFilter.toLowerCase())) {
        return false;
      }

      // Project type filter
      if (projectTypeFilter !== "ALL" && !p.project_type.toLowerCase().includes(projectTypeFilter.toLowerCase())) {
        return false;
      }

      // Text query match
      if (!normalizedQuery) return true;

      const normName = normalizeDiacritics(p.name);
      const normLoc = normalizeDiacritics(p.location);
      const normDev = normalizeDiacritics(p.developer_name || "");
      const normContr = normalizeDiacritics(p.contractor_name || "");
      const normArch = normalizeDiacritics(p.architect_name || "");
      const normType = normalizeDiacritics(p.project_type);

      return (
        normName.includes(normalizedQuery) ||
        normLoc.includes(normalizedQuery) ||
        normDev.includes(normalizedQuery) ||
        normContr.includes(normalizedQuery) ||
        normArch.includes(normalizedQuery) ||
        normType.includes(normalizedQuery)
      );
    });
  }, [projects, entityFilter, cityFilter, projectTypeFilter, normalizedQuery]);

  // Filter Services
  const matchingServices = useMemo(() => {
    if (entityFilter !== "ALL" && entityFilter !== "SERVICES") return [];
    if (cityFilter !== "ALL" || projectTypeFilter !== "ALL") return [];

    if (!normalizedQuery) return services;

    return services.filter((s) => {
      const normTitle = normalizeDiacritics(s.title);
      const normShort = normalizeDiacritics(s.shortDescription);
      const normLong = normalizeDiacritics(s.fullDescription || "");
      const normCat = normalizeDiacritics(s.categoryLabel);
      const normDeliverables = (s.deliverables || []).map(normalizeDiacritics).join(" ");

      return (
        normTitle.includes(normalizedQuery) ||
        normShort.includes(normalizedQuery) ||
        normLong.includes(normalizedQuery) ||
        normCat.includes(normalizedQuery) ||
        normDeliverables.includes(normalizedQuery)
      );
    });
  }, [services, entityFilter, cityFilter, projectTypeFilter, normalizedQuery]);

  // Filter Signals
  const matchingSignals = useMemo(() => {
    if (entityFilter === "SERVICES" || entityFilter === "KNOWLEDGE") return [];

    return signals.filter((s) => {
      if (cityFilter !== "ALL" && s.location && !s.location.toLowerCase().includes(cityFilter.toLowerCase())) {
        return false;
      }

      if (!normalizedQuery) return true;

      const normTitle = normalizeDiacritics(s.title);
      const normSummary = normalizeDiacritics(s.summary);
      const normType = normalizeDiacritics(s.signal_type);
      const normComp = normalizeDiacritics(s.company_name || "");
      const normProj = normalizeDiacritics(s.project_name || "");

      return (
        normTitle.includes(normalizedQuery) ||
        normSummary.includes(normalizedQuery) ||
        normType.includes(normalizedQuery) ||
        normComp.includes(normalizedQuery) ||
        normProj.includes(normalizedQuery)
      );
    });
  }, [signals, entityFilter, cityFilter, normalizedQuery]);

  // Available cities list for dropdown
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    locations.forEach((l) => set.add(l.name));
    companies.forEach((c) => {
      const parts = c.location.split(",");
      if (parts[0]) set.add(parts[0].trim());
    });
    projects.forEach((p) => {
      const parts = p.location.split(",");
      if (parts[0]) set.add(parts[0].trim());
    });
    return Array.from(set).sort();
  }, [locations, companies, projects]);

  const totalResults =
    matchingCompanies.length +
    matchingProjects.length +
    matchingServices.length +
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
      <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-3.5 text-slate-400 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-slate-400" />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Caută companii, proiecte, servicii oficiale, materiale (beton, EPS), normative (NE 012)..."
              className="w-full h-12 pl-12 pr-14 bg-white border border-slate-300 rounded-xl text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 font-sans min-h-[48px]"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-800 font-mono px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                ȘTERGE ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200/80 text-xs font-mono">
          {/* Entity Type Filter */}
          <div>
            <label className="text-slate-600 block mb-1 font-bold uppercase tracking-wider">
              Domeniu &amp; Taxonomie
            </label>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:border-amber-600 outline-none min-h-[44px]"
            >
              <option value="ALL">Toate Categoriile &amp; Baza Tehnică</option>
              <option value="SERVICES">Servicii Tehnice &amp; Consultanță Oficială ({matchingServices.length})</option>
              <option value="KNOWLEDGE">Bază de Cunoștințe Tehnice ({matchingKnowledge.length})</option>
              <option value="DEVELOPER">Dezvoltatori Imobiliari ({companies.filter((c) => c.type === "developer").length})</option>
              <option value="CONTRACTOR">Constructori Generali ({companies.filter((c) => c.type === "general_contractor" || c.type === "construction_company" || c.type === "infrastructure").length})</option>
              <option value="PROJECT">Doar Proiecte ({projects.length})</option>
              <option value="ARCHITECT">Birouri de Arhitectură ({companies.filter((c) => c.type === "architecture").length})</option>
              <option value="ENGINEER">Inginerie Structurală &amp; MEP ({companies.filter((c) => c.type === "engineering" || c.type === "structural_engineering" || c.type === "mep").length})</option>
            </select>
          </div>

          {/* City / Location Filter */}
          <div>
            <label className="text-slate-600 block mb-1 font-bold uppercase tracking-wider">
              Oraș / Hub Regional
            </label>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:border-amber-600 outline-none min-h-[44px]"
            >
              <option value="ALL">Toate Hub-urile Regionale ({locations.length})</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Project Type Filter */}
          <div>
            <label className="text-slate-600 block mb-1 font-bold uppercase tracking-wider">
              Tipologie Activ Imobiliar
            </label>
            <select
              value={projectTypeFilter}
              onChange={(e) => setProjectTypeFilter(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:border-amber-600 outline-none min-h-[44px]"
            >
              <option value="ALL">Toate Tipurile de Active</option>
              <option value="Residential">Rezidențial</option>
              <option value="Office">Birouri</option>
              <option value="Mixed-use">Multifuncțional</option>
              <option value="Industrial">Industrial &amp; Logistică</option>
            </select>
          </div>
        </div>

        {(query || entityFilter !== 'ALL' || cityFilter !== 'ALL' || projectTypeFilter !== 'ALL') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-[11px] font-mono">
            <span className="text-amber-800 font-bold">FILTRE ACTIVE SELECTATE</span>
            <button
              onClick={clearAllFilters}
              className="text-slate-500 hover:text-rose-600 transition-colors underline cursor-pointer"
            >
              Resetează toate filtrele ✕
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs font-mono">
        <span className="text-slate-600">
          AU FOST GĂSITE <span className="text-amber-800 font-bold">{totalResults}</span> ÎNREGISTRĂRI
        </span>
        {query && (
          <span className="text-slate-500">
            TERMEN: &ldquo;<span className="text-slate-900 font-semibold">{query}</span>&rdquo;
          </span>
        )}
      </div>

      {/* 1. MATCHING KNOWLEDGE BASE RESULTS */}
      {matchingKnowledge.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-widest text-amber-800 font-bold flex items-center gap-2">
              <BookIcon className="w-4 h-4 text-amber-700" />
              <span>CUNOȘTINȚE TEHNICE &amp; MATERIALE DE CONSTRUCȚII ({matchingKnowledge.length})</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
              DATE TEHNICE VERIFICATE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingKnowledge.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="p-5 bg-white border border-slate-200 hover:border-amber-500 hover:shadow-md rounded-xl space-y-3 transition-all duration-300 group block"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-amber-800 px-2 py-0.5 bg-amber-50 rounded truncate font-semibold">
                    {item.category}
                  </span>
                  <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0 font-semibold">
                    {item.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-950 group-hover:text-amber-800 transition-colors">
                    {item.title}
                  </h4>
                  {item.romanianTitle && (
                    <p className="text-xs font-mono text-slate-500 mt-0.5">RO: {item.romanianTitle}</p>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.snippet}
                </p>

                <div className="text-[11px] font-mono text-amber-800 flex items-center gap-1 pt-2 border-t border-slate-100 font-bold">
                  <span>DESCHIDE DOSAR TEHNIC</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 2. MATCHING OFFICIAL SERVICES */}
      {matchingServices.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-widest text-amber-800 font-bold flex items-center gap-2">
              <ShieldIcon className="w-4 h-4 text-amber-700" />
              <span>SERVICII OFICIALE DE CONSULTANȚĂ &amp; ASISTENȚĂ TEHNICĂ ({matchingServices.length})</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
              SPECIFICAȚIE VERIFICATĂ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingServices.map((srv) => (
              <Link
                key={srv.slug}
                href={`/services/${srv.slug}`}
                className="p-5 bg-white border border-slate-200 hover:border-amber-500 hover:shadow-md rounded-xl space-y-3 transition-all duration-300 group block"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-amber-800 px-2 py-0.5 bg-amber-50 rounded truncate font-semibold">
                    {srv.categoryLabel}
                  </span>
                  <span className="text-[9px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded shrink-0 font-medium">
                    {srv.badge}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-950 group-hover:text-amber-800 transition-colors">
                    {srv.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-1">
                    {srv.shortDescription}
                  </p>
                </div>

                {srv.deliverables && srv.deliverables.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] font-mono text-slate-500 block mb-1 font-bold">Livrabile Cheie:</span>
                    <ul className="text-[11px] text-slate-600 space-y-0.5 list-disc list-inside">
                      {srv.deliverables.slice(0, 2).map((d, dIdx) => (
                        <li key={dIdx} className="truncate">{d}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="text-[11px] font-mono text-amber-800 flex items-center gap-1 pt-2 border-t border-slate-100 font-bold">
                  <span>VEZI SPECIFICAȚIA SERVICIULUI</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 3. MATCHING COMPANIES */}
      {matchingCompanies.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-600 font-bold">
            ENTITĂȚI CORPORATIVE VERIFICATE ({matchingCompanies.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingCompanies.map((c) => (
              <Link
                key={c.slug}
                href={`/companies/${c.slug}`}
                className="p-5 bg-white border border-slate-200 hover:border-amber-500 hover:shadow-md rounded-xl space-y-3 transition-all duration-300 group block"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{c.type.replace(/_/g, " ")}</span>
                  <span className="text-[10px] font-mono text-amber-800 font-semibold">{c.location}</span>
                </div>
                <h4 className="text-base font-bold text-slate-950 group-hover:text-amber-800 transition-colors">
                  {c.name}
                </h4>
                {c.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{c.description}</p>
                )}
                {c.specializations && c.specializations.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {c.specializations.slice(0, 3).map((s, sIdx) => (
                      <span key={sIdx} className="text-[9px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
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

      {/* 4. MATCHING PROJECTS */}
      {matchingProjects.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-600 font-bold">
            PROIECTE DE CONSTRUCȚII &amp; DEZVOLTARE ({matchingProjects.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingProjects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="p-5 bg-white border border-slate-200 hover:border-amber-500 hover:shadow-md rounded-xl space-y-3 transition-all duration-300 group block"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{p.project_type}</span>
                  <span className="text-[10px] font-mono text-emerald-800 font-semibold">{p.status_display || p.status}</span>
                </div>
                <h4 className="text-base font-bold text-slate-950 group-hover:text-amber-800 transition-colors">
                  {p.name}
                </h4>
                <div className="text-xs font-mono text-slate-600 space-y-1">
                  <div>Locație: <span className="text-slate-900 font-semibold">{p.location}</span></div>
                  {p.developer_name && <div>Dezvoltator: <span className="text-slate-700">{p.developer_name}</span></div>}
                  {p.contractor_name && <div>Constructor: <span className="text-amber-800 font-semibold">{p.contractor_name}</span></div>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 5. MATCHING SIGNALS */}
      {matchingSignals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-600 font-bold">
            SEMNE DE PIAȚĂ DOCUMENTATE ({matchingSignals.length})
          </h3>
          <div className="space-y-3">
            {matchingSignals.map((s) => (
              <div
                key={s.id}
                className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 text-xs shadow-xs"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="text-amber-800 font-bold">{s.signal_type}</span>
                  <span>{s.event_date}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-950">{s.title}</h4>
                <p className="text-slate-600 leading-relaxed">{s.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalResults === 0 && (
        <div className="py-16 text-center space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-8">
          <div className="flex justify-center">
            <SearchIcon className="w-10 h-10 text-amber-700 opacity-80" />
          </div>
          <h3 className="text-lg font-bold text-slate-950">Nicio înregistrare nu corespunde căutării</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Încearcă să extinzi căutarea (de ex. &ldquo;Beton&rdquo;, &ldquo;NE 012&rdquo;, &ldquo;One United&rdquo;, &ldquo;București&rdquo;, &ldquo;EPS&rdquo;, &ldquo;POT&rdquo;).
          </p>
        </div>
      )}
    </div>
  );
}
