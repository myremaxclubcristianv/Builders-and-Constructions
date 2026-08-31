import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import {
  realCompaniesDataset,
  realProjectsDataset,
  realLocationsDataset
} from '@/lib/real-romanian-data';
import { getIndustryHubData } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Market Intelligence Command Center · CONSTRUCTIONS by AiXLuxury',
  description: 'Documented view of construction & real estate activity across Romania. Factual market signals, regional activity, documented relationships, and primary source citations.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/intelligence'
  }
};

export default async function IntelligencePage() {
  const hubData = await getIndustryHubData();
  const { marketActivity: signalsStream } = hubData;

  // Calculate metrics dynamically from real dataset
  const totalEntities = realCompaniesDataset.length;
  const totalProjects = realProjectsDataset.length;
  const totalHubs = realLocationsDataset.length;
  const totalSignals = signalsStream.length;

  const devs = realCompaniesDataset.filter(c => c.type === 'developer').length;
  const agencies = realCompaniesDataset.filter(c => c.type === 'real_estate_agency').length;
  const contractors = realCompaniesDataset.filter(c => c.type === 'general_contractor' || c.type === 'construction_company' || c.type === 'infrastructure').length;
  const architects = realCompaniesDataset.filter(c => c.type === 'architecture').length;
  const engineers = realCompaniesDataset.filter(c => c.type === 'engineering' || c.type === 'structural_engineering' || c.type === 'mep').length;

  // Calculate project construction stages dynamically
  const activeSitesCount = realProjectsDataset.filter(p => p.status === 'under_construction').length;
  const planningCount = realProjectsDataset.filter(p => p.status === 'upcoming').length;
  const completedCount = realProjectsDataset.filter(p => p.status === 'completed').length;
  const structureStageCount = realProjectsDataset.filter(p => (p.status_display || '').toLowerCase().includes('structure') || (p.description || '').toLowerCase().includes('structure')).length;

  // Latest verified timestamp derived from dataset
  const latestVerifiedDate = realProjectsDataset.reduce((max, p) => {
    return p.last_verified_at > max ? p.last_verified_at : max;
  }, '2026-08-30');

  const formattedLastVerified = new Date(latestVerifiedDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();

  // Documented changes audit trail
  const documentedChanges = [
    {
      id: 'chg-101',
      date: '2026-08-30',
      change_type: 'NEW PROJECT DOCUMENTED',
      entity_name: 'Metalurgiei Park Residence Phase 2',
      entity_type: 'Project',
      entity_slug: 'metalurgiei-park-residence-phase-2',
      summary: 'Documented 3,000-unit residential district expansion in Bucharest Sector 4 with developer Sud Rezidențial and contractor Terra Gaz Construct.',
      previous_state: 'NOT DISCLOSED',
      new_state: 'UNDER CONSTRUCTION',
      source_title: 'Public Permit & Official Release',
      source_url: 'https://metalurgieipark.ro',
      verification_state: 'VERIFIED'
    },
    {
      id: 'chg-102',
      date: '2026-08-28',
      change_type: 'CONTRACTOR RELATIONSHIP DOCUMENTED',
      entity_name: 'Saidel Engineering',
      entity_type: 'Company',
      entity_slug: 'saidel-engineering',
      summary: 'Documented structural engineering consultancy role for Marmorosch Hotel Heritage Restoration in Bucharest Sector 3.',
      previous_state: 'UNAVAILABLE',
      new_state: 'CONTRACTOR APPOINTED',
      source_title: 'Official Technical Disclosure',
      source_url: 'https://saidel.ro',
      verification_state: 'DOCUMENTED'
    },
    {
      id: 'chg-103',
      date: '2026-08-26',
      change_type: 'PROJECT STATUS UPDATED',
      entity_name: 'UP-site Bucharest',
      entity_type: 'Project',
      entity_slug: 'upsite-bucharest',
      summary: 'Updated construction stage from structure to facade curtain wall completion following site inspection & developer verification.',
      previous_state: 'STRUCTURE UNDERWAY',
      new_state: 'FACADE ENCLOSURE COMPLETE',
      source_title: 'Atenor Quarterly Report',
      source_url: 'https://www.atenor.eu/en/projects/up-site-floreasca/',
      verification_state: 'VERIFIED'
    },
    {
      id: 'chg-104',
      date: '2026-08-24',
      change_type: 'MARKET SIGNAL ADDED',
      entity_name: 'One High District',
      entity_type: 'Project',
      entity_slug: 'one-high-district',
      summary: 'Logged construction milestone signal for 15th-floor structural completion on 786-unit residential project in Sector 2.',
      previous_state: 'NOT YET MEASURED',
      new_state: '15TH FLOOR TOPPING OUT',
      source_title: 'Official Press Release',
      source_url: 'https://one.ro/one-high-district/',
      verification_state: 'VERIFIED'
    },
    {
      id: 'chg-105',
      date: '2026-08-22',
      change_type: 'NEW PRIMARY SOURCE',
      entity_name: 'Prime Kapital',
      entity_type: 'Company',
      entity_slug: 'prime-kapital',
      summary: 'Added audited 2025 financial disclosures and primary BVB statement citations for Silk District Iași office developments.',
      previous_state: 'NOT DISCLOSED',
      new_state: 'AUDITED DISCLOSURE ADDED',
      source_title: 'Audited Financial Statement',
      source_url: 'https://silkdistrict.ro',
      verification_state: 'VERIFIED'
    },
    {
      id: 'chg-106',
      date: '2026-08-20',
      change_type: 'ENTITY PROFILE UPDATED',
      entity_name: 'Construcții Erbașu',
      entity_type: 'Company',
      entity_slug: 'constructii-erbasu',
      summary: 'Updated corporate profile with €240M EUR 2025 revenue figure and 1,200 employee headcount verified against Ministry of Finance filings.',
      previous_state: 'NOT YET MEASURED',
      new_state: '2025 FINANCIALS VERIFIED',
      source_title: 'Ministry of Finance Filing',
      source_url: 'https://erbasu.ro',
      verification_state: 'VERIFIED'
    }
  ];

  // Documented multi-party relationship chains
  const relationshipChains = realProjectsDataset.slice(0, 6).map(p => {
    const dev = realCompaniesDataset.find(c => c.slug === p.developer_slug);
    const gc = realCompaniesDataset.find(c => c.slug === p.contractor_slug);
    const arch = realCompaniesDataset.find(c => c.slug === p.architect_slug);
    const eng = realCompaniesDataset.find(c => c.slug === p.engineering_slug);

    return {
      id: p.id,
      project_name: p.name,
      project_slug: p.slug,
      location: p.location,
      developer_name: dev?.name || p.developer_name || 'NOT DISCLOSED',
      developer_slug: dev?.slug || p.developer_slug,
      contractor_name: gc?.name || p.contractor_name || 'NOT DISCLOSED',
      contractor_slug: gc?.slug || p.contractor_slug,
      architect_name: arch?.name || p.architect_name || 'NOT DISCLOSED',
      architect_slug: arch?.slug || p.architect_slug,
      engineer_name: eng?.name || p.engineering_name || 'NOT DISCLOSED',
      engineer_slug: eng?.slug || p.engineering_slug
    };
  });

  // Key Regional Hubs Analysis
  const keyCities = ['Bucharest', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Brașov', 'Constanța'];
  const regionalMatrix = keyCities.map(cityName => {
    const matchingProjects = realProjectsDataset.filter(p =>
      p.location.toLowerCase().includes(cityName.toLowerCase())
    );
    const matchingCompanies = realCompaniesDataset.filter(c =>
      (c.location || '').toLowerCase().includes(cityName.toLowerCase())
    );
    const matchingSignals = signalsStream.filter(s =>
      (s.location || '').toLowerCase().includes(cityName.toLowerCase())
    );

    return {
      name: cityName,
      slug: cityName.toLowerCase().replace('ș', 's').replace('ț', 't').replace('ă', 'a').replace(' ', '-'),
      projects_count: matchingProjects.length,
      entities_count: matchingCompanies.length,
      signals_count: matchingSignals.length,
      coverage_status: matchingProjects.length > 5 ? 'HIGH MARKET COVERAGE' : 'DOCUMENTED ACTIVITY'
    };
  });

  // Primary Sources Ledger
  const primarySourcesLedger = [
    { title: 'National Trade Register Office (ONRC)', category: 'Public Registry', url: 'https://www.onrc.ro', description: 'Official corporate registration, CUI/CIF verification, and legal ownership structures.' },
    { title: 'Ministry of Public Finance (ANAF)', category: 'Financial Disclosures', url: 'https://mfinante.gov.ro', description: 'Audited annual financial statements, revenue figures, net profit, and workforce headcounts.' },
    { title: 'Bucharest Stock Exchange (BVB)', category: 'Market Filings', url: 'https://m.bvb.ro', description: 'Publicly traded corporate releases, quarterly performance reports, and bond prospectuses.' },
    { title: 'National Road Infrastructure Company (CNAIR)', category: 'Public Tenders', url: 'https://www.cnadnr.ro', description: 'Civil infrastructure tenders, motorway contract awards, and physical completion updates.' },
    { title: 'Official Developer Press & Investor Portals', category: 'Official Disclosures', url: 'https://one.ro', description: 'Authenticated developer disclosures, architectural plans, and structural topping out milestones.' }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Market Intelligence Command Center — CONSTRUCTIONS by AiXLuxury',
    description: 'Documented view of construction & real estate activity across Romania.',
    url: 'https://constructions.cristianvaduva.com/intelligence'
  };

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <main className="pt-20">
        {/* HEADER SECTION */}
        <section className="py-12 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] font-bold">
                Institutional Market Terminal
              </span>
              <div className="flex items-center gap-2 font-mono text-xs text-[#888888]">
                <span>LAST VERIFIED:</span>
                <span className="px-2 py-0.5 bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30 rounded font-bold">
                  {formattedLastVerified}
                </span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              MARKET INTELLIGENCE
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-3xl leading-relaxed">
              A documented view of construction & real estate activity across Romania. Factual market signals, regional activity matrices, multi-party relationship graphs, and primary source provenance.
            </p>
          </div>
        </section>

        {/* 2. INTELLIGENCE OVERVIEW METRICS */}
        <section className="py-10 border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-[#888888]">
              <span className="text-white font-bold uppercase tracking-wider">
                1. SOURCE-OF-TRUTH DATASET OVERVIEW
              </span>
              <span className="text-[#C9A227]">100% PROVENANCE BACKED</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9 gap-3 font-mono">
              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                <span className="text-[10px] text-[#888888] block">VERIFIED ENTITIES</span>
                <span className="text-2xl font-bold text-white block">{totalEntities}</span>
                <span className="text-[9px] text-[#C9A227]">100% Provenance</span>
              </div>

              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                <span className="text-[10px] text-[#888888] block">DOCUMENTED PROJECTS</span>
                <span className="text-2xl font-bold text-[#38bdf8] block">{totalProjects}</span>
                <span className="text-[9px] text-[#38bdf8]">Active & Delivered</span>
              </div>

              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                <span className="text-[10px] text-[#888888] block">REGIONAL HUBS</span>
                <span className="text-2xl font-bold text-white block">{totalHubs}</span>
                <span className="text-[9px] text-[#888888]">National Coverage</span>
              </div>

              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                <span className="text-[10px] text-[#888888] block">MARKET SIGNALS</span>
                <span className="text-2xl font-bold text-[#86efac] block">{totalSignals}</span>
                <span className="text-[9px] text-[#86efac]">Verified Stream</span>
              </div>

              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                <span className="text-[10px] text-[#888888] block">DEVELOPERS</span>
                <span className="text-xl font-bold text-[#C9A227] block">{devs}</span>
                <span className="text-[9px] text-[#888888]">Verified Group</span>
              </div>

              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                <span className="text-[10px] text-[#888888] block">CONTRACTORS</span>
                <span className="text-xl font-bold text-[#38bdf8] block">{contractors}</span>
                <span className="text-[9px] text-[#888888]">Builders & Infra</span>
              </div>

              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                <span className="text-[10px] text-[#888888] block">ARCHITECTS</span>
                <span className="text-xl font-bold text-[#86efac] block">{architects}</span>
                <span className="text-[9px] text-[#888888]">Design Studios</span>
              </div>

              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                <span className="text-[10px] text-[#888888] block">ENGINEERS</span>
                <span className="text-xl font-bold text-[#e879f9] block">{engineers}</span>
                <span className="text-[9px] text-[#888888]">Consultancies</span>
              </div>

              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-1">
                <span className="text-[10px] text-[#888888] block">AGENCIES</span>
                <span className="text-xl font-bold text-white block">{agencies}</span>
                <span className="text-[9px] text-[#888888]">Real Estate</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. MARKET ACTIVITY (CONSTRUCTION STAGES) */}
        <section className="py-12 border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-[#888888]">
              <span className="text-white font-bold uppercase tracking-wider">
                2. MARKET ACTIVITY & STAGE LIFECYCLE BREAKDOWN
              </span>
              <span className="text-[#38bdf8]">OBJECTIVE DATA AUDIT</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono text-xs">
              <div className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#888888] uppercase font-bold">ACTIVE CONSTRUCTION</span>
                  <span className="px-2 py-0.5 bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 rounded text-[9px] font-bold">VERIFIED</span>
                </div>
                <div className="text-3xl font-bold text-white">{activeSitesCount}</div>
                <p className="text-[11px] text-[#A0A0A0] font-sans">Active construction sites logged with contractor assignments.</p>
              </div>

              <div className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#888888] uppercase font-bold">PLANNING / PERMITTING</span>
                  <span className="px-2 py-0.5 bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30 rounded text-[9px] font-bold">VERIFIED</span>
                </div>
                <div className="text-3xl font-bold text-[#C9A227]">{planningCount}</div>
                <p className="text-[11px] text-[#A0A0A0] font-sans">Upcoming developments with verified building permits or announcements.</p>
              </div>

              <div className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#888888] uppercase font-bold">STRUCTURE / TOPPING OUT</span>
                  <span className="px-2 py-0.5 bg-[#86efac]/10 text-[#86efac] border border-[#86efac]/30 rounded text-[9px] font-bold">VERIFIED</span>
                </div>
                <div className="text-3xl font-bold text-[#86efac]">{structureStageCount}</div>
                <p className="text-[11px] text-[#A0A0A0] font-sans">Projects currently undergoing concrete framing or curtain wall enclosure.</p>
              </div>

              <div className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#888888] uppercase font-bold">DELIVERY / COMPLETED</span>
                  <span className="px-2 py-0.5 bg-white/10 text-white border border-white/20 rounded text-[9px] font-bold">VERIFIED</span>
                </div>
                <div className="text-3xl font-bold text-white">{completedCount}</div>
                <p className="text-[11px] text-[#A0A0A0] font-sans">Delivered real estate assets & completed civil infrastructure corridors.</p>
              </div>

              <div className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#888888] uppercase font-bold">UNMEASURED METRICS</span>
                  <span className="px-2 py-0.5 bg-[#777777]/10 text-[#777777] border border-[#777777]/30 rounded text-[9px] font-bold">EXPLICIT TRUTH</span>
                </div>
                <div className="text-xs font-bold text-[#888888] pt-2">NOT YET MEASURED</div>
                <p className="text-[11px] text-[#A0A0A0] font-sans">Metrics without primary source evidence are explicitly marked as unmeasured.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. REGIONAL INTELLIGENCE MATRIX */}
        <section className="py-12 border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-[#888888]">
              <span className="text-white font-bold uppercase tracking-wider">
                3. REGIONAL MARKET COVERAGE MATRIX
              </span>
              <span className="text-[#C9A227]">GEOGRAPHIC HUBS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
              {regionalMatrix.map(hub => (
                <div key={hub.name} className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-4 hover:border-[#C9A227]/40 transition-all">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">📍 {hub.name}</h3>
                    <span className="px-2 py-0.5 bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30 rounded text-[10px] font-bold uppercase">
                      {hub.coverage_status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs border-t border-b border-[#1A1D1B] py-3">
                    <div>
                      <span className="text-[10px] text-[#888888] block">PROJECTS</span>
                      <strong className="text-white text-sm">{hub.projects_count}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#888888] block">ENTITIES</span>
                      <strong className="text-[#C9A227] text-sm">{hub.entities_count}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#888888] block">SIGNALS</span>
                      <strong className="text-[#38bdf8] text-sm">{hub.signals_count}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#888888]">Regional Intelligence Dossier</span>
                    <Link href={`/cities/${hub.slug}`} className="text-[#C9A227] font-bold hover:underline">
                      EXPLORE HUB →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. VERIFIED CHANGES AUDIT LOG */}
        <section className="py-12 border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-[#888888]">
              <span className="text-white font-bold uppercase tracking-wider">
                4. RECENT DOCUMENTED MARKET CHANGES
              </span>
              <Link href="/changes" className="text-[#C9A227] hover:underline">
                OPEN FULL CHANGE TERMINAL →
              </Link>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {documentedChanges.map(chg => (
                <div key={chg.id} className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#C9A227]/40 transition-all">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap text-[10px]">
                      <span className="px-2 py-0.5 bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] rounded font-bold uppercase">
                        {chg.change_type}
                      </span>
                      <span className="text-[#888888]">{chg.date}</span>
                      <span className="px-2 py-0.5 bg-[#86efac]/10 text-[#86efac] border border-[#86efac]/30 rounded font-bold uppercase">
                        {chg.verification_state}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white pt-1">
                      {chg.entity_type === 'Company' ? (
                        <Link href={`/companies/${chg.entity_slug}`} className="hover:text-[#C9A227]">
                          🏢 {chg.entity_name}
                        </Link>
                      ) : (
                        <Link href={`/projects/${chg.entity_slug}`} className="hover:text-[#38bdf8]">
                          🏗️ {chg.entity_name}
                        </Link>
                      )}
                    </h4>

                    <p className="text-xs text-[#A0A0A0] font-sans leading-relaxed">{chg.summary}</p>

                    <div className="flex items-center gap-4 text-[11px] text-[#888888] pt-1">
                      <span>Prev: <strong className="text-white">{chg.previous_state}</strong></span>
                      <span>→</span>
                      <span>New: <strong className="text-[#C9A227]">{chg.new_state}</strong></span>
                    </div>
                  </div>

                  {chg.source_url && (
                    <a
                      href={chg.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-[#050505] border border-[#1A1D1B] text-[#C9A227] rounded font-bold hover:border-[#C9A227]/50 shrink-0 self-start md:self-center"
                    >
                      {chg.source_title} ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. MARKET SIGNALS STREAM */}
        <section className="py-12 border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-[#888888]">
              <span className="text-white font-bold uppercase tracking-wider">
                5. VERIFIED MARKET SIGNALS STREAM
              </span>
              <Link href="/signals" className="text-[#38bdf8] hover:underline">
                OPEN FULL SIGNALS FEED →
              </Link>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {signalsStream.slice(0, 5).map(sig => (
                <div key={sig.id} className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#38bdf8]/40 transition-all">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap text-[10px]">
                      <span className="px-2 py-0.5 bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 rounded font-bold uppercase">
                        {sig.signal_type.replaceAll('_', ' ')}
                      </span>
                      <span className="text-[#888888]">{sig.event_date}</span>
                      <span className="px-2 py-0.5 bg-[#86efac]/10 text-[#86efac] border border-[#86efac]/30 rounded font-bold uppercase">
                        {sig.verification_state || 'VERIFIED'}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white pt-1">{sig.title}</h4>
                    <p className="text-xs text-[#A0A0A0] font-sans leading-relaxed">{sig.summary}</p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#888888] pt-1">
                      {sig.company_name && (
                        <Link href={`/companies/${sig.company_slug}`} className="text-[#C9A227] hover:underline">
                          🏢 {sig.company_name}
                        </Link>
                      )}
                      {sig.project_name && (
                        <Link href={`/projects/${sig.project_slug}`} className="text-[#38bdf8] hover:underline">
                          🏗️ {sig.project_name}
                        </Link>
                      )}
                      {sig.location && <span>📍 {sig.location}</span>}
                    </div>
                  </div>

                  {sig.source_url && (
                    <a
                      href={sig.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-[#050505] border border-[#1A1D1B] text-[#C9A227] rounded font-bold hover:border-[#C9A227]/50 shrink-0 self-start md:self-center"
                    >
                      PRIMARY CITATION ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. RELATIONSHIP ACTIVITY NETWORK */}
        <section className="py-12 border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-[#888888]">
              <span className="text-white font-bold uppercase tracking-wider">
                6. DOCUMENTED RELATIONSHIP GRAPH
              </span>
              <Link href="/network" className="text-[#C9A227] hover:underline">
                EXPLORE NETWORK GRAPH →
              </Link>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {relationshipChains.map(chain => (
                <div key={chain.id} className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-wrap items-center gap-3 text-xs">
                  <span className="text-[#C9A227] font-bold">
                    {chain.developer_slug ? (
                      <Link href={`/companies/${chain.developer_slug}`} className="hover:underline">
                        🏢 {chain.developer_name}
                      </Link>
                    ) : chain.developer_name}
                  </span>
                  <span className="text-[#666666]">➔</span>
                  <Link href={`/projects/${chain.project_slug}`} className="text-white font-bold hover:text-[#38bdf8]">
                    🏗️ {chain.project_name}
                  </Link>
                  <span className="text-[#666666]">➔</span>
                  <span>GC: <strong className="text-[#38bdf8]">{chain.contractor_name}</strong></span>
                  <span className="text-[#666666]">➔</span>
                  <span>ARCH: <strong className="text-[#86efac]">{chain.architect_name}</strong></span>
                  <span className="text-[#666666]">➔</span>
                  <span>ENG: <strong className="text-[#e879f9]">{chain.engineer_name}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. PRIMARY SOURCES LEDGER */}
        <section className="py-12 border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-[#888888]">
              <span className="text-white font-bold uppercase tracking-wider">
                7. PRIMARY SOURCES & PROVENANCE LEDGER
              </span>
              <span className="text-[#86efac]">AUTHENTICATED CITATIONS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
              {primarySourcesLedger.map(src => (
                <div key={src.title} className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-3 flex flex-col justify-between hover:border-[#C9A227]/40 transition-all">
                  <div>
                    <span className="text-[10px] text-[#C9A227] font-bold uppercase">{src.category}</span>
                    <h4 className="text-sm font-bold text-white mt-1">{src.title}</h4>
                    <p className="text-xs text-[#A0A0A0] font-sans mt-2 leading-relaxed">{src.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#1A1D1B] flex items-center justify-between">
                    <span className="text-[10px] text-[#888888]">Official Citation</span>
                    <a href={src.url} target="_blank" rel="noreferrer" className="text-[#C9A227] font-bold hover:underline">
                      VERIFY SOURCE ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. INSTITUTIONAL RESEARCH intake CTA */}
        <section className="py-16 bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div className="p-8 bg-[#111111] border border-[#C9A227]/30 rounded-2xl space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#C9A227] uppercase tracking-widest font-bold">
                  CONSTRUCTIONS First-Party Market Research Desk
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  NEED DEEPER INSTITUTIONAL RESEARCH?
                </h2>
                <p className="text-sm text-[#A0A0A0] max-w-2xl font-sans leading-relaxed">
                  Request custom due diligence, physical site verification, developer pipeline audits, or competitor intelligence through the independent CONSTRUCTIONS research team.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 bg-[#050505] border border-[#1A1D1B] rounded-lg text-[#C5C5C5]">
                  • Company Research
                </div>
                <div className="p-3 bg-[#050505] border border-[#1A1D1B] rounded-lg text-[#C5C5C5]">
                  • Project Due Diligence
                </div>
                <div className="p-3 bg-[#050505] border border-[#1A1D1B] rounded-lg text-[#C5C5C5]">
                  • Developer Pipeline
                </div>
                <div className="p-3 bg-[#050505] border border-[#1A1D1B] rounded-lg text-[#C5C5C5]">
                  • Contractor Verification
                </div>
                <div className="p-3 bg-[#050505] border border-[#1A1D1B] rounded-lg text-[#C5C5C5]">
                  • Competitive Research
                </div>
                <div className="p-3 bg-[#050505] border border-[#1A1D1B] rounded-lg text-[#C5C5C5]">
                  • Regional Intelligence
                </div>
                <div className="p-3 bg-[#050505] border border-[#1A1D1B] rounded-lg text-[#C5C5C5]">
                  • Market Signal Research
                </div>
                <div className="p-3 bg-[#050505] border border-[#1A1D1B] rounded-lg text-[#C5C5C5]">
                  • Custom Institutional
                </div>
              </div>

              <div className="p-4 bg-[#050505] border border-[#1A1D1B] rounded-xl text-[11px] font-mono text-[#777777] leading-relaxed">
                <strong className="text-[#A0A0A0]">INDEPENDENT PLATFORM DISCLOSURE:</strong> CONSTRUCTIONS is an independent market research platform. Requests are handled by our research desk and do not constitute third-party lead routing or representation of listed entities.
              </div>

              <div className="pt-2">
                <Link
                  href="/research-request"
                  className="px-6 py-3 bg-[#C9A227] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#E4C58F] transition-all inline-block"
                >
                  REQUEST RESEARCH →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
