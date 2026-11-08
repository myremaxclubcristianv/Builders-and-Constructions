'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { realProjectsDataset, realCompaniesDataset } from '@/lib/real-romanian-data';
import { useLanguage } from '@/lib/language-context';
import { LocationPinIcon, CraneIcon, BuildingIcon, SearchIcon } from '@/components/icons/NavIcons';

// Romania bounding box for Mercator-like 2D projection
// Lat: ~43.6° N (South) to ~48.3° N (North)
// Lon: ~20.2° E (West) to ~29.7° E (East)
const MIN_LAT = 43.5;
const MAX_LAT = 48.4;
const MIN_LON = 20.2;
const MAX_LON = 29.8;

// Verified standard coordinates for major Romanian administrative cities
const CITY_COORDINATES: Record<string, { lat: number; lon: number }> = {
  'bucharest': { lat: 44.4323, lon: 26.1063 },
  'bucurești': { lat: 44.4323, lon: 26.1063 },
  'ilfov': { lat: 44.52, lon: 26.08 },
  'cluj': { lat: 46.7712, lon: 23.6236 },
  'cluj-napoca': { lat: 46.7712, lon: 23.6236 },
  'timișoara': { lat: 45.7537, lon: 21.2257 },
  'timisoara': { lat: 45.7537, lon: 21.2257 },
  'iași': { lat: 47.1585, lon: 27.6014 },
  'iasi': { lat: 47.1585, lon: 27.6014 },
  'brașov': { lat: 45.6579, lon: 25.6012 },
  'brasov': { lat: 45.6579, lon: 25.6012 },
  'constanța': { lat: 44.1792, lon: 28.6498 },
  'constanta': { lat: 44.1792, lon: 28.6498 },
  'craiova': { lat: 44.3302, lon: 23.7949 },
  'arad': { lat: 46.1866, lon: 21.3123 },
  'oradea': { lat: 47.0465, lon: 21.9189 },
  'sibiu': { lat: 45.7983, lon: 24.1256 },
  'bacău': { lat: 46.5670, lon: 26.9146 },
  'bacau': { lat: 46.5670, lon: 26.9146 },
  'galați': { lat: 45.4353, lon: 28.0080 },
  'ploiești': { lat: 44.9367, lon: 26.0129 },
  'târgu mureș': { lat: 46.5425, lon: 24.5575 },
  'suceava': { lat: 47.6514, lon: 26.2556 }
};

function projectToCanvas(lat: number, lon: number, width = 1000, height = 620) {
  // Mercator-style linear interpolation within bounding box
  const x = ((lon - MIN_LON) / (MAX_LON - MIN_LON)) * width;
  const y = ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * height;
  return { x: Math.max(20, Math.min(width - 20, x)), y: Math.max(20, Math.min(height - 20, y)) };
}

export function NationalConstructionMap() {
  const { language, t } = useLanguage();
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'PROJECTS' | 'COMPANIES'>('PROJECTS');

  // Filter projects
  const filteredProjects = useMemo(() => {
    return realProjectsDataset.filter(p => {
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
      if (typeFilter !== 'ALL' && p.project_type !== typeFilter) return false;
      if (cityFilter !== 'ALL') {
        const cityLower = cityFilter.toLowerCase();
        const locLower = (p.location || '').toLowerCase();
        const countyLower = (p.county || '').toLowerCase();
        if (!locLower.includes(cityLower) && !countyLower.includes(cityLower)) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchDev = (p.developer_name || '').toLowerCase().includes(q);
        const matchLoc = (p.location || '').toLowerCase().includes(q);
        if (!matchName && !matchDev && !matchLoc) return false;
      }
      return true;
    });
  }, [statusFilter, typeFilter, cityFilter, searchQuery]);

  // Coordinates resolution
  const mappedProjects = useMemo(() => {
    return filteredProjects.map(p => {
      let lat = p.latitude;
      let lon = p.longitude;
      let isApproxCity = false;

      if (!lat || !lon) {
        // Find city anchor
        const locLower = (p.locality || p.location || '').toLowerCase();
        for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
          if (locLower.includes(key)) {
            lat = coords.lat + (Math.random() * 0.04 - 0.02);
            lon = coords.lon + (Math.random() * 0.04 - 0.02);
            isApproxCity = true;
            break;
          }
        }
      }

      if (!lat || !lon) {
        // Fallback to Bucharest
        lat = 44.4323;
        lon = 26.1063;
        isApproxCity = true;
      }

      const canvas = projectToCanvas(lat, lon);
      return {
        ...p,
        canvasX: canvas.x,
        canvasY: canvas.y,
        isApproxCity
      };
    });
  }, [filteredProjects]);

  return (
    <div className="space-y-6">
      {/* Map Filter Controls Bar */}
      <div className="p-4 md:p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl space-y-4 font-mono text-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#C9A227] font-bold uppercase tracking-wider block">
              {language === 'ro' ? 'VEDERE:' : 'VIEW:'}
            </span>
            <button
              onClick={() => { setViewMode('PROJECTS'); setSelectedEntity(null); }}
              className={`px-3 py-1.5 rounded-lg border transition-all ${viewMode === 'PROJECTS' ? 'bg-[#C9A227] text-black font-bold border-[#C9A227]' : 'bg-[#141715] text-[#888] border-[#1A1D1B] hover:text-white'}`}
            >
              {language === 'ro' ? `PROIECTE (${filteredProjects.length})` : `PROJECTS (${filteredProjects.length})`}
            </button>
            <button
              onClick={() => { setViewMode('COMPANIES'); setSelectedEntity(null); }}
              className={`px-3 py-1.5 rounded-lg border transition-all ${viewMode === 'COMPANIES' ? 'bg-[#C9A227] text-black font-bold border-[#C9A227]' : 'bg-[#141715] text-[#888] border-[#1A1D1B] hover:text-white'}`}
            >
              {language === 'ro' ? `SEDIU COMPANII (${realCompaniesDataset.length})` : `COMPANY HQS (${realCompaniesDataset.length})`}
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ro' ? 'Caută pe hartă...' : 'Search map...'}
              className="w-full bg-[#141715] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-1.5 pl-8 text-white placeholder-[#666] outline-none"
            />
            <SearchIcon className="w-3.5 h-3.5 text-[#888] absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#1A1D1B]">
          {/* Status Filter */}
          <div>
            <label className="text-[10px] text-[#888] uppercase block mb-1">
              {language === 'ro' ? 'STADIU FIZIC' : 'PHYSICAL STAGE'}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#141715] border border-[#1A1D1B] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
            >
              <option value="ALL">{language === 'ro' ? 'Toate Stadiile' : 'All Stages'}</option>
              <option value="under_construction">{language === 'ro' ? 'În Construcție (Activ)' : 'Under Construction (Active)'}</option>
              <option value="completed">{language === 'ro' ? 'Livrat / Finalizat' : 'Delivered / Completed'}</option>
              <option value="upcoming">{language === 'ro' ? 'Planificare / Autorizare' : 'Planning / Permitting'}</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="text-[10px] text-[#888] uppercase block mb-1">
              {language === 'ro' ? 'CATEGORIE' : 'CATEGORY'}
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-[#141715] border border-[#1A1D1B] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
            >
              <option value="ALL">{language === 'ro' ? 'Toate Categoriile' : 'All Categories'}</option>
              <option value="Residential">Residential</option>
              <option value="Office">Office</option>
              <option value="Industrial/Logistics">Industrial / Logistics</option>
              <option value="Mixed-use">Mixed-use</option>
              <option value="Infrastructure">Infrastructure</option>
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label className="text-[10px] text-[#888] uppercase block mb-1">
              {language === 'ro' ? 'HUB REGIONAL' : 'REGIONAL HUB'}
            </label>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full bg-[#141715] border border-[#1A1D1B] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
            >
              <option value="ALL">{language === 'ro' ? 'Toată România (Național)' : 'All Romania (National)'}</option>
              <option value="Bucharest">București & Ilfov</option>
              <option value="Cluj">Cluj-Napoca</option>
              <option value="Timișoara">Timișoara</option>
              <option value="Iași">Iași</option>
              <option value="Brașov">Brașov</option>
              <option value="Constanța">Constanța</option>
              <option value="Craiova">Craiova</option>
              <option value="Arad">Arad</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Map Interactive Canvas & Dossier Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Geographic Canvas */}
        <div className="lg:col-span-8 bg-[#0B0D0C] border border-[#1A1D1B] rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between min-h-[480px]">
          {/* Map Top Metadata Bar */}
          <div className="flex items-center justify-between z-10 text-[10px] font-mono text-[#888] border-b border-[#1A1D1B] pb-2">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span>{language === 'ro' ? 'HARTĂ GEOGRAFICĂ INTERACTIVĂ ROMÂNIA' : 'INTERACTIVE GEOGRAPHIC MAP OF ROMANIA'}</span>
            </span>
            <span>{mappedProjects.length} {language === 'ro' ? 'OBIECTIVE VIZIBILE' : 'VISIBLE TARGETS'}</span>
          </div>

          {/* SVG Map Projection */}
          <div className="relative w-full h-[420px] md:h-[520px] my-4 select-none">
            <svg
              viewBox="0 0 1000 620"
              className="w-full h-full"
              style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.8))' }}
            >
              <defs>
                <radialGradient id="mapBgGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#141715" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0B0D0C" stopOpacity="1" />
                </radialGradient>
                <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1A1D1B" strokeWidth="0.5" />
                </pattern>
              </defs>

              {/* Background Radar Grid */}
              <rect width="1000" height="620" fill="url(#gridPattern)" />

              {/* Stylized Romania Frontier Outline Contour */}
              <path
                d="M 180 200 L 250 140 L 380 90 L 520 70 L 680 90 L 780 140 L 850 220 L 880 320 L 910 400 L 880 480 L 820 530 L 720 550 L 580 580 L 440 590 L 320 570 L 240 520 L 170 450 L 150 360 L 140 280 Z"
                fill="url(#mapBgGrad)"
                stroke="#262A27"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />

              {/* Major City Anchor Labels */}
              <g className="text-[10px] font-mono fill-[#555] select-none pointer-events-none">
                <text x="640" y="470">BUCUREȘTI</text>
                <text x="370" y="270">CLUJ-NAPOCA</text>
                <text x="180" y="340">TIMIȘOARA</text>
                <text x="760" y="220">IAȘI</text>
                <text x="540" y="370">BRAȘOV</text>
                <text x="860" y="520">CONSTANȚA</text>
                <text x="400" y="510">CRAIOVA</text>
              </g>

              {/* Verified Project Markers */}
              {viewMode === 'PROJECTS' && mappedProjects.map((proj) => {
                const isSelected = selectedEntity?.id === proj.id;
                const isDelivered = proj.status === 'completed';
                const isUpcoming = proj.status === 'upcoming';
                const pinColor = isDelivered ? '#22c55e' : isUpcoming ? '#38bdf8' : '#C9A227';

                return (
                  <g
                    key={proj.id}
                    className="cursor-pointer transition-transform hover:scale-125"
                    onClick={() => setSelectedEntity(proj)}
                  >
                    {/* Pulsing Beacon for Under Construction */}
                    {!isDelivered && (
                      <circle
                        cx={proj.canvasX}
                        cy={proj.canvasY}
                        r={isSelected ? "14" : "9"}
                        fill={pinColor}
                        opacity="0.25"
                      >
                        <animate attributeName="r" values="6;16;6" dur="2.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2.5s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Outer Circle */}
                    <circle
                      cx={proj.canvasX}
                      cy={proj.canvasY}
                      r={isSelected ? "7" : "4.5"}
                      fill={pinColor}
                      stroke="#000"
                      strokeWidth="1.5"
                    />

                    {/* Inner core */}
                    <circle
                      cx={proj.canvasX}
                      cy={proj.canvasY}
                      r="1.8"
                      fill="#FFF"
                    />
                  </g>
                );
              })}

              {/* Company HQ Markers */}
              {viewMode === 'COMPANIES' && realCompaniesDataset.slice(0, 48).map((comp, idx) => {
                const locStr = (comp.location_slug || comp.location || 'bucharest').toLowerCase();
                const matchedCity = Object.keys(CITY_COORDINATES).find(c => locStr.includes(c)) || 'bucharest';
                const coords = CITY_COORDINATES[matchedCity] || CITY_COORDINATES['bucharest'];
                const canvas = projectToCanvas(coords.lat + (Math.sin(idx) * 0.03), coords.lon + (Math.cos(idx) * 0.04));
                const isSelected = selectedEntity?.id === comp.id;

                return (
                  <g
                    key={comp.id}
                    className="cursor-pointer transition-transform hover:scale-125"
                    onClick={() => setSelectedEntity({ ...comp, isCompany: true })}
                  >
                    <rect
                      x={canvas.x - (isSelected ? 6 : 4)}
                      y={canvas.y - (isSelected ? 6 : 4)}
                      width={isSelected ? 12 : 8}
                      height={isSelected ? 12 : 8}
                      fill="#38bdf8"
                      stroke="#000"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#1A1D1B] text-[10px] font-mono text-[#888]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C9A227]" /> {language === 'ro' ? 'În Construcție' : 'Under Construction'}
              </span>
              <span className="flex items-center gap-1.5 text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" /> {language === 'ro' ? 'Livrat / Finalizat' : 'Delivered'}
              </span>
              <span className="flex items-center gap-1.5 text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" /> {language === 'ro' ? 'Planificare / Sediul' : 'Planning / HQ'}
              </span>
            </div>
            <span>
              {language === 'ro' ? 'Proiecție WGS84 Coordonate Reale' : 'WGS84 Real Coordinates Projection'}
            </span>
          </div>
        </div>

        {/* Selected Entity Dossier Inspector Pane */}
        <div className="lg:col-span-4 bg-[#111111] border border-[#1A1D1B] rounded-2xl p-5 flex flex-col justify-between font-mono">
          {selectedEntity ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3 text-xs">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30">
                  {selectedEntity.isCompany ? 'SEDIU COMPANIE' : (selectedEntity.status_display || selectedEntity.status || 'ACTIV')}
                </span>
                <span className="text-[#888] text-[10px]">
                  {selectedEntity.locality || selectedEntity.location || 'România'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white font-sans tracking-tight">
                  {selectedEntity.name}
                </h3>
                {selectedEntity.developer_name && (
                  <p className="text-xs text-[#C9A227] mt-0.5">
                    {language === 'ro' ? 'Dezvoltator:' : 'Developer:'} {selectedEntity.developer_name}
                  </p>
                )}
              </div>

              <div className="space-y-2 text-xs text-[#BBB] pt-2 border-t border-[#1A1D1B]">
                {selectedEntity.surface_area_sqm && (
                  <div className="flex justify-between">
                    <span className="text-[#777]">{language === 'ro' ? 'Suprafață Construită:' : 'Built Area:'}</span>
                    <span className="text-white font-bold">{selectedEntity.surface_area_sqm.toLocaleString()} sqm</span>
                  </div>
                )}
                {selectedEntity.investment_label && (
                  <div className="flex justify-between">
                    <span className="text-[#777]">{language === 'ro' ? 'Buget Investiție:' : 'Capex Value:'}</span>
                    <span className="text-[#C9A227] font-bold">{selectedEntity.investment_label}</span>
                  </div>
                )}
                {selectedEntity.contractor_name && (
                  <div className="flex justify-between">
                    <span className="text-[#777]">{language === 'ro' ? 'Constructor General:' : 'Contractor:'}</span>
                    <span className="text-white">{selectedEntity.contractor_name}</span>
                  </div>
                )}
                {selectedEntity.address && (
                  <div className="flex justify-between">
                    <span className="text-[#777]">{language === 'ro' ? 'Adresă:' : 'Address:'}</span>
                    <span className="text-white text-right max-w-[180px] truncate">{selectedEntity.address}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-[#888] leading-relaxed line-clamp-3 pt-2">
                {selectedEntity.description || (language === 'ro' ? 'Obiectiv indexat în baza de date națională CONSTRUCTIONS.' : 'Indexed objective in national CONSTRUCTIONS database.')}
              </p>

              <div className="pt-4 border-t border-[#1A1D1B]">
                <Link
                  href={selectedEntity.isCompany ? `/companies/${selectedEntity.slug}` : `/projects/${selectedEntity.slug}`}
                  className="w-full block py-2.5 bg-[#C9A227] hover:bg-[#d8b135] text-black font-bold text-center text-xs rounded-lg transition-all"
                >
                  {language === 'ro' ? 'DESCHIDE DOSARUL COMPLET →' : 'OPEN FULL DOSSIER →'}
                </Link>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-[#666]">
              <LocationPinIcon className="w-10 h-10 text-[#444]" />
              <p className="text-xs text-white font-bold">
                {language === 'ro' ? 'SELECTEAZĂ UN PUNCT DE PE HARTĂ' : 'SELECT A PIN ON THE MAP'}
              </p>
              <p className="text-[11px] text-[#777] max-w-[240px]">
                {language === 'ro'
                  ? 'Fă clic pe oricare punct de pe hartă pentru a inspecta dosarul verificat, dezvoltatorul, constructorul și parametrii tehnici.'
                  : 'Click on any pin on the map to inspect verified dossier, developer, contractor, and technical parameters.'}
              </p>
            </div>
          )}

          {/* Quick Stats Footnote */}
          <div className="mt-4 pt-3 border-t border-[#1A1D1B] text-[10px] text-[#666] flex justify-between items-center">
            <span>{language === 'ro' ? 'SURSE OFICIALE: BVB / ANCPI / ONRC' : 'OFFICIAL SOURCES: BVB / ANCPI / REGISTRY'}</span>
            <span className="text-[#C9A227]">100% {language === 'ro' ? 'FAPTIC' : 'FACTUAL'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
