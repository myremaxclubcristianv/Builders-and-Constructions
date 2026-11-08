'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { BookIcon, ShieldIcon, CraneIcon, BuildingIcon, SearchIcon } from '@/components/icons/NavIcons';

export interface RegulatoryStandard {
  identifier: string;
  officialTitle: string;
  romanianTitle: string;
  issuingBody: string;
  regulatoryLevel: 'LEGISLAȚIE NAȚIONALĂ' | 'REGULAMENT TEHNIC / COD' | 'STANDARD EUROPEAN (EN)' | 'GHID DE BUNE PRACTICI';
  edition: string;
  effectiveDate: string;
  status: 'ÎN VIGOARE' | 'ACTUALIZAT 2024' | 'REVIZUIT';
  sourceUrl: string;
  lastVerifiedAt: string;
  stages: string[];
  materials: string[];
  projectCategories: string[];
  relevantCompanies: { name: string; slug: string; role: string }[];
  summary: string;
}

export const TECHNICAL_STANDARDS: RegulatoryStandard[] = [
  {
    identifier: 'P 100-1/2013 (cu revizuirile în vigoare)',
    officialTitle: 'Cod de proiectare seismică - Partea I: Prevederi de proiectare pentru clădiri',
    romanianTitle: 'Normativul Seismic P100-1',
    issuingBody: 'MDLPA (Ministerul Dezvoltării, Lucrărilor Publice și Administrației)',
    regulatoryLevel: 'REGULAMENT TEHNIC / COD',
    edition: 'Ediția 2013 cu completările 2019-2024',
    effectiveDate: '2014-01-01',
    status: 'ÎN VIGOARE',
    sourceUrl: 'https://www.mdlpa.ro',
    lastVerifiedAt: '2026-08-28',
    stages: ['Proiectare Structurală', 'Fundații', 'Structură de Rezistență'],
    materials: ['Beton Armat', 'Oțel Beton B500B', 'Profil Oțel Structural'],
    projectCategories: ['Office', 'Residential', 'Mixed-use', 'Infrastructure'],
    relevantCompanies: [
      { name: "Bog'Art", slug: 'bog-art', role: 'General Contractor' },
      { name: 'Construcții Erbașu', slug: 'constructii-erbasu', role: 'General Contractor' },
      { name: 'Plan31 Architecture & Engineering', slug: 'plan31-architecture', role: 'Structural Engineering' }
    ],
    summary: 'Stabilește valorile de calcul ale accelerației terenului pentru proiectare (ag = 0.20g - 0.40g în funcție de zonă, București ag = 0.30g, Tc = 1.6s) și cerințele fundamentale de siguranță structurală la acțiuni seismice.'
  },
  {
    identifier: 'NE 012-1:2022',
    officialTitle: 'Normativ pentru producerea betonului și executarea lucrărilor din beton, beton armat și beton precomprimat - Partea 1: Producerea betonului',
    romanianTitle: 'Codul Național al Betonului NE 012-1',
    issuingBody: 'MDLPA / ASRO',
    regulatoryLevel: 'REGULAMENT TEHNIC / COD',
    edition: 'Revizia 2022 (aliniată la SR EN 206+A2:2021)',
    effectiveDate: '2022-09-15',
    status: 'ÎN VIGOARE',
    sourceUrl: 'https://www.asro.ro',
    lastVerifiedAt: '2026-08-28',
    stages: ['Fundații', 'Structură de Rezistență', 'Pardoseli Industriale'],
    materials: ['C25/30', 'C30/37', 'C35/45', 'C50/60', 'Ciment CEM I / CEM II'],
    projectCategories: ['Office', 'Industrial/Logistics', 'Residential', 'Infrastructure'],
    relevantCompanies: [
      { name: 'Concelex', slug: 'concelex', role: 'General Contractor' },
      { name: 'Teratest Geotehnica Cluj', slug: 'teratest-geotehnica-cluj', role: 'Geotechnical Engineering' },
      { name: "Bog'Art", slug: 'bog-art', role: 'General Contractor' }
    ],
    summary: 'Reglementează clasele de rezistență la compresiune, clasele de expunere la mediu (XC, XD, XS, XF, XA), raportul maxim apă/ciment (A/C) și conținutul minim de ciment pentru durabilitatea elementelor monolite.'
  },
  {
    identifier: 'SR EN 1990:2004 / A1:2006 (Eurocode 0)',
    officialTitle: 'Eurocode: Bazele proiectării structurilor',
    romanianTitle: 'Eurocod 0: Bazele calculului structural',
    issuingBody: 'CEN (European Committee for Standardization) / ASRO',
    regulatoryLevel: 'STANDARD EUROPEAN (EN)',
    edition: 'SR EN 1990 + Anexa Națională SR EN 1990/NA',
    effectiveDate: '2006-11-30',
    status: 'ÎN VIGOARE',
    sourceUrl: 'https://www.asro.ro',
    lastVerifiedAt: '2026-08-28',
    stages: ['Proiectare Structurală', 'Calcule Statice'],
    materials: ['Beton', 'Oțel', 'Lemn', 'Zidărie'],
    projectCategories: ['Office', 'Residential', 'Industrial/Logistics', 'Infrastructure'],
    relevantCompanies: [
      { name: 'Cumulus Architecture', slug: 'cumulus-architecture', role: 'Lead Architect' },
      { name: 'Plan31 Architecture & Engineering', slug: 'plan31-architecture', role: 'Structural Engineering' }
    ],
    summary: 'Definește principiile și cerințele privind siguranța, exploatabilitatea și durabilitatea structurilor, precum și combinațiile de încărcări fundamentale și accidentale.'
  },
  {
    identifier: 'NP 112-2014',
    officialTitle: 'Normativ privind proiectarea fundațiilor de suprafață',
    romanianTitle: 'Normativ Fundații Directe NP 112',
    issuingBody: 'MDLPA',
    regulatoryLevel: 'REGULAMENT TEHNIC / COD',
    edition: 'Ediția 2014',
    effectiveDate: '2015-03-01',
    status: 'ÎN VIGOARE',
    sourceUrl: 'https://www.mdlpa.ro',
    lastVerifiedAt: '2026-08-28',
    stages: ['Fundații', 'Terasamente', 'Infrastructură Subterană'],
    materials: ['Beton C20/25', 'C25/30', 'Piloți Forați', 'Radier General'],
    projectCategories: ['Residential', 'Office', 'Industrial/Logistics'],
    relevantCompanies: [
      { name: 'Teratest Geotehnica Cluj', slug: 'teratest-geotehnica-cluj', role: 'Geotechnical Engineering' },
      { name: 'Construcții Erbașu', slug: 'constructii-erbasu', role: 'General Contractor' }
    ],
    summary: 'Stabilește metodologiile de calcul geotehnic la stări limită ultime (STR/GEO) și de exploatare (SLS) pentru radiere generale, tălpi izolate și rețele de grinzi de fundare.'
  },
  {
    identifier: 'C 107-2005 (cu revizuirile 2023 nZEB)',
    officialTitle: 'Normativ privind calculul termotehnic al elementelor de construcție ale clădirilor',
    romanianTitle: 'Cod Termotehnică & Clădiri nZEB C 107',
    issuingBody: 'MDLPA / Legea 372/2005 republicată',
    regulatoryLevel: 'REGULAMENT TEHNIC / COD',
    edition: 'Revizuit conform standardelor europene nZEB (Nearly Zero Energy Buildings)',
    effectiveDate: '2023-01-01',
    status: 'ACTUALIZAT 2024',
    sourceUrl: 'https://www.mdlpa.ro',
    lastVerifiedAt: '2026-08-28',
    stages: ['Anvelopă Clădire', 'Instalații MEP', 'Finisaje'],
    materials: ['Vată Bazaltică', 'Panouri Termoizolante PIR', 'Geam Tripan Low-E', 'Pompe de Căldură'],
    projectCategories: ['Office', 'Residential', 'Mixed-use'],
    relevantCompanies: [
      { name: 'Vital Engineering MEP', slug: 'vital-engineering-mep', role: 'MEP Engineering' },
      { name: 'Cumulus Architecture', slug: 'cumulus-architecture', role: 'Lead Architect' }
    ],
    summary: 'Obligativitatea standardului nZEB pentru toate clădirile noi autorizate: consum maxim de energie primară din surse fosile și minim 30% energie din surse regenerabile pe amplasament.'
  }
];

export function TechnicalCrossReference() {
  const { language } = useLanguage();
  const [selectedStandard, setSelectedStandard] = useState<RegulatoryStandard | null>(TECHNICAL_STANDARDS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');

  const filteredStandards = useMemo(() => {
    return TECHNICAL_STANDARDS.filter(s => {
      if (stageFilter !== 'ALL' && !s.stages.includes(stageFilter)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = s.identifier.toLowerCase().includes(q);
        const matchTitle = s.romanianTitle.toLowerCase().includes(q) || s.officialTitle.toLowerCase().includes(q);
        const matchMat = s.materials.some(m => m.toLowerCase().includes(q));
        if (!matchId && !matchTitle && !matchMat) return false;
      }
      return true;
    });
  }, [stageFilter, searchQuery]);

  return (
    <div className="space-y-8 font-mono">
      {/* Disclaimer Box */}
      <div className="p-4 bg-[#141715] border border-[#C9A227]/40 rounded-xl flex items-start gap-3">
        <ShieldIcon className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
        <div className="text-xs text-[#AAA] leading-relaxed">
          <strong className="text-white block mb-0.5 font-bold uppercase tracking-wider">
            {language === 'ro' ? 'NOTĂ LEGALĂ DE CONFORMITATE TEHNICĂ:' : 'LEGAL NOTICE ON TECHNICAL COMPLIANCE:'}
          </strong>
          {language === 'ro'
            ? 'Cunoștințele tehnice și trimiterile la standarde au caracter strict informativ și consultativ de sinteză. Nu reproduc standardele protejate de drepturi de autor în integralitate și nu substituie proiectul tehnic (PTh/DDE), memoriul tehnic de rezistență sau verificarea de către verificatori de proiecte autorizați MDLPA conform Legii 10/1995 privind calitatea în construcții.'
            : 'Technical knowledge and standards cross-references are strictly informational summaries. They do not reproduce full copyrighted standards and do not replace certified technical projects, structural engineering calculations, or mandatory regulatory verifications under Law 10/1995 on quality in construction.'}
        </div>
      </div>

      {/* Cross-Reference Matrix Controls */}
      <div className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-2xl space-y-4 text-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <span className="text-[#C9A227] font-bold uppercase tracking-widest text-sm font-sans">
            {language === 'ro' ? 'MATRICE TEHNICĂ: ETAPE ➔ NORMATIVE ➔ MATERIALE ➔ COMPANII' : 'TECHNICAL MATRIX: STAGES ➔ CODES ➔ MATERIALS ➔ COMPANIES'}
          </span>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ro' ? 'Caută normativ, material...' : 'Search code, material...'}
              className="w-full bg-[#141715] border border-[#1A1D1B] rounded-lg px-3 py-1.5 pl-8 text-white placeholder-[#666] outline-none focus:border-[#C9A227]"
            />
            <SearchIcon className="w-3.5 h-3.5 text-[#888] absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Stage Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1A1D1B]">
          <span className="text-[10px] text-[#888] uppercase mr-1">
            {language === 'ro' ? 'ETAPĂ DE EXECUȚIE:' : 'STAGE:'}
          </span>
          {['ALL', 'Proiectare Structurală', 'Fundații', 'Structură de Rezistență', 'Anvelopă Clădire', 'Instalații MEP'].map(stage => (
            <button
              key={stage}
              onClick={() => setStageFilter(stage)}
              className={`px-2.5 py-1 rounded text-[11px] transition-all border ${stageFilter === stage ? 'bg-[#C9A227] text-black font-bold border-[#C9A227]' : 'bg-[#141715] text-[#888] border-[#1A1D1B] hover:text-white'}`}
            >
              {stage === 'ALL' ? (language === 'ro' ? 'Toate Etapele' : 'All Stages') : stage}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Master-Detail Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Standards List Column */}
        <div className="lg:col-span-5 space-y-3">
          {filteredStandards.map(std => {
            const isSelected = selectedStandard?.identifier === std.identifier;
            return (
              <div
                key={std.identifier}
                onClick={() => setSelectedStandard(std)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-[#141715] border-[#C9A227] shadow-lg' : 'bg-[#0B0B0B] border-[#1A1D1B] hover:border-[#333]'}`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#C9A227]/10 text-[#C9A227] font-bold">
                    {std.regulatoryLevel}
                  </span>
                  <span className="text-[#22c55e] font-bold">{std.status}</span>
                </div>
                <h4 className="text-sm font-bold text-white font-sans">{std.romanianTitle}</h4>
                <p className="text-xs text-[#888] mt-1">{std.identifier}</p>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {std.materials.slice(0, 3).map(m => (
                    <span key={m} className="px-1.5 py-0.5 bg-[#1C1F1D] rounded text-[10px] text-[#CCC]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Standard Deep Cross-Reference Card */}
        <div className="lg:col-span-7">
          {selectedStandard ? (
            <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl space-y-6">
              <div className="border-b border-[#1A1D1B] pb-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#C9A227] font-bold uppercase tracking-wider">
                    {selectedStandard.issuingBody}
                  </span>
                  <span className="text-[#888] text-[10px]">
                    {language === 'ro' ? 'Verificat:' : 'Verified:'} {selectedStandard.lastVerifiedAt}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white font-sans">
                  {selectedStandard.romanianTitle}
                </h3>
                <p className="text-xs text-[#AAA] italic">
                  {selectedStandard.officialTitle}
                </p>
              </div>

              {/* Technical Parameters Table */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-[#0B0B0B] p-4 rounded-xl border border-[#1A1D1B]">
                <div>
                  <span className="text-[10px] text-[#777] uppercase block">{language === 'ro' ? 'IDENTIFICATOR OFICIAL' : 'OFFICIAL CODE'}</span>
                  <span className="text-white font-bold">{selectedStandard.identifier}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#777] uppercase block">{language === 'ro' ? 'EDIȚIE / REVIZIE' : 'EDITION / REVISION'}</span>
                  <span className="text-white">{selectedStandard.edition}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#777] uppercase block">{language === 'ro' ? 'DATA INTRĂRII ÎN VIGOARE' : 'EFFECTIVE DATE'}</span>
                  <span className="text-white">{selectedStandard.effectiveDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#777] uppercase block">{language === 'ro' ? 'SURSA OFICIALĂ' : 'OFFICIAL SOURCE'}</span>
                  <a
                    href={selectedStandard.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C9A227] hover:underline"
                  >
                    {selectedStandard.issuingBody} ↗
                  </a>
                </div>
              </div>

              {/* Technical Summary */}
              <div>
                <h5 className="text-[11px] text-[#C9A227] uppercase tracking-wider mb-1 font-bold">
                  {language === 'ro' ? 'REZUMAT TEHNIC & DOMENIU DE APLICARE:' : 'TECHNICAL SUMMARY & SCOPE:'}
                </h5>
                <p className="text-xs text-[#CCC] leading-relaxed">
                  {selectedStandard.summary}
                </p>
              </div>

              {/* Cross-Referenced Materials & Systems */}
              <div>
                <h5 className="text-[11px] text-[#C9A227] uppercase tracking-wider mb-2 font-bold">
                  {language === 'ro' ? 'MATERIALE & SISTEME GUVERNATE:' : 'GOVERNED MATERIALS & SYSTEMS:'}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedStandard.materials.map(mat => (
                    <span key={mat} className="px-2.5 py-1 bg-[#141715] border border-[#222] rounded-lg text-xs text-white">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cross-Referenced Verified Companies */}
              <div className="pt-4 border-t border-[#1A1D1B]">
                <h5 className="text-[11px] text-[#C9A227] uppercase tracking-wider mb-3 font-bold">
                  {language === 'ro' ? 'COMPANII VERIFICATE CU EXPERTIZĂ PE ACEST NORMATIV:' : 'VERIFIED COMPANIES OPERATING UNDER THIS CODE:'}
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedStandard.relevantCompanies.map(comp => (
                    <Link
                      key={comp.slug}
                      href={`/companies/${comp.slug}`}
                      className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] hover:border-[#C9A227]/50 rounded-xl transition-all flex items-center justify-between group"
                    >
                      <div>
                        <h6 className="text-xs font-bold text-white group-hover:text-[#C9A227] transition-colors">{comp.name}</h6>
                        <p className="text-[10px] text-[#777]">{comp.role}</p>
                      </div>
                      <span className="text-[#C9A227] text-xs font-bold">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#777] bg-[#111] rounded-2xl border border-[#1A1D1B]">
              {language === 'ro' ? 'Selectează un normativ din listă.' : 'Select a standard from the list.'}
            </div>
          )}
        </div>
      </div>

      {/* Official Legal & Engineering Disclaimer */}
      <div className="p-4 bg-[#0E0F0E] border border-[#1A1D1B] rounded-xl text-xs text-[#888] font-sans leading-relaxed">
        <strong className="text-white uppercase font-mono block text-[10px] text-[#C9A227] mb-1">
          {language === 'ro' ? 'AVIZ JURIDIC ȘI TEHNIC' : 'LEGAL & TECHNICAL DISCLAIMER'}
        </strong>
        {language === 'ro'
          ? 'Informațiile prezentate au caracter exclusiv informativ și de documentare. Acestea nu înlocuiesc proiectarea autorizată, expertizele tehnice de specialitate elaborate de ingineri atestați sau consultanța structurală oficială.'
          : 'The technical regulations and standards provided are strictly for informational and documentation purposes. They do not substitute for official structural engineering design, certified inspections, or licensed consulting.'}
      </div>
    </div>
  );
}
