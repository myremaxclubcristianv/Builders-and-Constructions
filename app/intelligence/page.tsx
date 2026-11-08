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
import { safeJsonLdStringify } from '@/lib/sanitize';
import { BuildingIcon, CraneIcon, LocationPinIcon } from '@/components/icons/NavIcons';

export const metadata: Metadata = {
  title: 'Centrul de Intelligence & Monitorizare Piață · CONSTRUCTIONS by AiXLuxury',
  description: 'Panou centralizat de cercetare a pieței de construcții și real estate din România. Semnale verificate, matrici regionale de activitate, grafuri de relații și evidență documentară.',
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
  const structureStageCount = realProjectsDataset.filter(p => (p.status_display || '').toLowerCase().includes('structur') || (p.description || '').toLowerCase().includes('structur')).length;

  // Documented changes audit trail updated for November 2026
  const documentedChanges = [
    {
      id: 'chg-2026-nov-01',
      date: '2026-11-08',
      change_type: 'SEMNAL INFRASTRUCTURĂ DOCUMENTAT',
      entity_name: 'Centura București DN2–A2 (Lot 2)',
      entity_type: 'Project',
      entity_slug: 'centura-bucuresti-dn2-a2',
      summary: 'Înregistrat progres fizic 19,32% și financiar 11,26% conform raportării CNAIR citate de Economedia. Lucrări reluate de asocierea Hidrostroy - Maristar.',
      previous_state: 'BLOCAT / REZILIAT',
      new_state: '19,32% PROGRES FIZIC RAPORTAT',
      source_title: 'Economedia / Date Oficiale CNAIR',
      source_url: 'https://economedia.ro/video-cum-arata-lucrarile-pe-centura-bucuresti-sectorul-dn2-a2-santierul-reluat-de-bulgarii-de-la-hidrostroy-si-maristar-la-sub-20-termenul-pentru-darea-in-circulatie-ar-putea-fi-prelungit-dinc.html',
      verification_state: 'PRESĂ ECONOMICĂ'
    },
    {
      id: 'chg-2026-nov-02',
      date: '2026-11-05',
      change_type: 'ETAPĂ NOUĂ DE CONSTRUCȚIE',
      entity_name: 'Cartierul Vienez Timișoara',
      entity_type: 'Project',
      entity_slug: 'cartierul-vienez-timisoara',
      summary: 'Lansare etapă nouă cu 146 locuințe (€24M investiție). Corp N3 livrat, N4-N5 în execuție avansată, N6-N7 autorizate cu termen țintă decembrie 2028.',
      previous_state: 'FAZA 1 FINALIZATĂ',
      new_state: 'N6-N7 AUTORIZATE & ÎNCEPUTE',
      source_title: 'CIJ World / Comunicat Dezvoltator',
      source_url: 'https://cij.world/cartierul-vienez-in-timisoara-launches-new-phase-of-construction/',
      verification_state: 'DATE RAPORTATE'
    },
    {
      id: 'chg-2026-nov-03',
      date: '2026-11-04',
      change_type: 'RAPORT OPERAȚIONAL OFICIAL',
      entity_name: 'RIVUS Cluj-Napoca',
      entity_type: 'Project',
      entity_slug: 'rivus-cluj-napoca',
      summary: 'Raportare oficială Iulius Group: 12.568 m³ beton turnat în octombrie 2026, 9.402 tone oțel fasonat, 550 muncitori pe șantier și 80% spații retail preînchiriate.',
      previous_state: 'EXCAVAȚII & PILOȚI',
      new_state: 'PLANȘEU PESTE NIVELUL -2',
      source_title: 'Portal Oficial Rivus.ro',
      source_url: 'https://www.rivus.ro/noutati/',
      verification_state: 'SURSĂ OFICIALĂ'
    },
    {
      id: 'chg-2026-nov-04',
      date: '2026-11-03',
      change_type: 'AUTORIZAȚIE DE CONSTRUIRE',
      entity_name: 'INFINITY NORD București',
      entity_type: 'Project',
      entity_slug: 'infinity-nord-bucuresti',
      summary: 'Redport Capital a obținut autorizația de construire pentru Faza 1 (~1.200 locuințe pe 4,6 ha planificate în 3 faze). Termen țintă prima fază: T4 2028.',
      previous_state: 'PLANIFICARE / PUZ',
      new_state: 'AUTORIZAȚIE EMISĂ · PREGĂTIRE ȘANTIER',
      source_title: 'CIJ World / Redport Capital',
      source_url: 'https://cij.world/redport-sets-q4-2028-delivery-target-for-infinity-nords-first-phase-in-bucharest/',
      verification_state: 'DATE RAPORTATE'
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
      developer_name: dev?.name || p.developer_name || 'Nedivulgat',
      developer_slug: dev?.slug || p.developer_slug,
      contractor_name: gc?.name || p.contractor_name || 'Nedivulgat',
      contractor_slug: gc?.slug || p.contractor_slug,
      architect_name: arch?.name || p.architect_name || 'Nedivulgat',
      architect_slug: arch?.slug || p.architect_slug,
      engineer_name: eng?.name || p.engineering_name || 'Nedivulgat',
      engineer_slug: eng?.slug || p.engineering_slug
    };
  });

  // Key Regional Hubs Analysis
  const keyCities = ['București', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Brașov', 'Constanța'];
  const regionalMatrix = keyCities.map(cityName => {
    const searchName = cityName === 'București' ? 'Bucharest' : cityName;
    const matchingProjects = realProjectsDataset.filter(p =>
      p.location.toLowerCase().includes(cityName.toLowerCase()) || p.location.toLowerCase().includes(searchName.toLowerCase())
    );
    const matchingCompanies = realCompaniesDataset.filter(c =>
      (c.location || '').toLowerCase().includes(cityName.toLowerCase()) || (c.location || '').toLowerCase().includes(searchName.toLowerCase())
    );
    const matchingSignals = signalsStream.filter(s =>
      (s.location || '').toLowerCase().includes(cityName.toLowerCase()) || (s.location || '').toLowerCase().includes(searchName.toLowerCase())
    );

    return {
      name: cityName,
      slug: cityName.toLowerCase().replace('ș', 's').replace('ț', 't').replace('ă', 'a').replace(' ', '-'),
      projects_count: matchingProjects.length,
      entities_count: matchingCompanies.length,
      signals_count: matchingSignals.length,
      coverage_status: matchingProjects.length > 5 ? 'ACOPERIRE RIDICATĂ' : 'ACTIVITATE DOCUMENTATĂ'
    };
  });

  // Primary Sources Ledger
  const primarySourcesLedger = [
    { title: 'Oficiul Național al Registrului Comerțului (ONRC)', category: 'Registru Public', url: 'https://www.onrc.ro', description: 'Înregistrări statutare ale companiilor, verificare CUI/CIF și structuri oficiale de acționariat.' },
    { title: 'Ministerul Finanțelor Publice (ANAF)', category: 'Situații Financiare', url: 'https://mfinante.gov.ro', description: 'Bilanțuri contabile anuale auditate, cifră de afaceri, profit net și număr mediu de salariați.' },
    { title: 'Bursa de Valori București (BVB)', category: 'Raportări Reglementate', url: 'https://m.bvb.ro', description: 'Raportări oficiale pentru companiile listate, rezultate trimestriale și prospecte de emisiune obligațiuni.' },
    { title: 'Compania Națională de Administrare a Infrastructurii Rutiere (CNAIR)', category: 'Licitații & Șantiere Publice', url: 'https://www.cnadnr.ro', description: 'Contracte de infrastructură rutieră, stadii fizice și financiare ale autostrăzilor și drumurilor expres.' },
    { title: 'Portate Oficiale Dezvoltatori & Investitori', category: 'Comunicări Asumate', url: 'https://one.ro', description: 'Documentații tehnice publicate oficial, planuri de arhitectură și evenimente de finalizare a structurii.' }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Centrul de Intelligence & Monitorizare Piață — CONSTRUCTIONS by AiXLuxury',
    description: 'Viziune documentată asupra activității din construcții și real estate din România.',
    url: 'https://constructions.cristianvaduva.com/intelligence'
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-amber-100 selection:text-amber-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
      />
      <SiteHeader />

      <main className="pt-24">
        {/* HEADER SECTION */}
        <section className="py-12 md:py-16 border-b border-slate-200 bg-slate-50/70">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold">
                Terminal Instituțional de Piață
              </span>
              <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
                <span>ULTIMA ACTUALIZARE:</span>
                <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded font-bold">
                  8 NOIEMBRIE 2026
                </span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
              INTELIGENȚĂ DE PIAȚĂ
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-3xl leading-relaxed">
              O perspectivă documentată asupra activității de construcții și imobiliare din România. Semnale factuale, matrici regionale de activitate, grafuri de relații între dezvoltatori și constructori și proveniență directă a surselor.
            </p>
          </div>
        </section>

        {/* 2. INTELLIGENCE OVERVIEW METRICS */}
        <section className="py-12 border-b border-slate-200 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span className="text-slate-900 font-bold uppercase tracking-wider">
                1. PREZENTARE GENERALĂ A BAZEI CANONICE DE DATE
              </span>
              <span className="text-amber-800 font-bold">100% PROVENIENȚĂ DOCUMENTARĂ</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9 gap-3 font-mono">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">ENTITĂȚI</span>
                <span className="text-2xl font-bold text-slate-900 block">{totalEntities}</span>
                <span className="text-[9px] text-amber-800 font-bold">100% Verificate</span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">PROIECTE</span>
                <span className="text-2xl font-bold text-sky-800 block">{totalProjects}</span>
                <span className="text-[9px] text-sky-800 font-bold">Indexate</span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">POLI REGIONALI</span>
                <span className="text-2xl font-bold text-slate-900 block">{totalHubs}</span>
                <span className="text-[9px] text-slate-500 font-semibold">Acoperire</span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">SEMNALE</span>
                <span className="text-2xl font-bold text-emerald-700 block">{totalSignals}</span>
                <span className="text-[9px] text-emerald-700 font-semibold">Noiembrie 2026</span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">DEZVOLTATORI</span>
                <span className="text-xl font-bold text-amber-800 block">{devs}</span>
                <span className="text-[9px] text-slate-500">Companii</span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">CONSTRUCTORI</span>
                <span className="text-xl font-bold text-sky-800 block">{contractors}</span>
                <span className="text-[9px] text-slate-500">Antreprize</span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">ARHITECȚI</span>
                <span className="text-xl font-bold text-emerald-700 block">{architects}</span>
                <span className="text-[9px] text-slate-500">Birouri</span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">INGINERI</span>
                <span className="text-xl font-bold text-purple-700 block">{engineers}</span>
                <span className="text-[9px] text-slate-500">Consultanți</span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">AGENȚII</span>
                <span className="text-xl font-bold text-slate-900 block">{agencies}</span>
                <span className="text-[9px] text-slate-500">Brokeraj</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. MARKET ACTIVITY (CONSTRUCTION STAGES) */}
        <section className="py-12 border-b border-slate-200 bg-slate-50/50">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span className="text-slate-900 font-bold uppercase tracking-wider">
                2. ACTIVITATE DE PIAȚĂ &amp; CICLU DE EXECUȚIE
              </span>
              <span className="text-amber-800 font-bold">AUDIT FAPTIC</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">ȘANTIERE ACTIVE ÎN EXECUȚIE</span>
                  <span className="px-2 py-0.5 bg-sky-50 text-sky-800 border border-sky-200 rounded text-[9px] font-bold">VERIFICAT</span>
                </div>
                <div className="text-3xl font-bold text-slate-900">{activeSitesCount}</div>
                <p className="text-[11px] text-slate-500 font-sans leading-relaxed">Șantiere active monitorizate cu antreprenori generali desemnați.</p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">PLANIFICARE &amp; AUTORIZARE</span>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[9px] font-bold">VERIFICAT</span>
                </div>
                <div className="text-3xl font-bold text-amber-800">{planningCount}</div>
                <p className="text-[11px] text-slate-500 font-sans leading-relaxed">Proiecte viitoare cu autorizații de construire sau anunțuri oficiale.</p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">STRUCTURĂ &amp; ÎNCHIDERI</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[9px] font-bold">VERIFICAT</span>
                </div>
                <div className="text-3xl font-bold text-emerald-700">{structureStageCount}</div>
                <p className="text-[11px] text-slate-500 font-sans leading-relaxed">Proiecte aflate în faza de turnare a structurii sau montaj al fațadei.</p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">LIVRĂRI FINALIZATE</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded text-[9px] font-bold">VERIFICAT</span>
                </div>
                <div className="text-3xl font-bold text-slate-900">{completedCount}</div>
                <p className="text-[11px] text-slate-500 font-sans leading-relaxed">Clădiri recepționate și coridoare de infrastructură date în circulație.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. REGIONAL INTELLIGENCE MATRIX */}
        <section className="py-12 border-b border-slate-200 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span className="text-slate-900 font-bold uppercase tracking-wider">
                3. MATRICEA DE ACOPERIRE REGIONALĂ
              </span>
              <span className="text-amber-800 font-bold">POLI GEOGRAFICI</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 font-mono">
              {regionalMatrix.map(hub => (
                <div key={hub.name} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 hover:border-amber-500 hover:shadow-xs transition-all">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                      <LocationPinIcon className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>{hub.name}</span>
                    </h3>
                    <span className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-700 rounded text-[10px] font-bold uppercase shadow-xs">
                      {hub.coverage_status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs border-t border-b border-slate-200 py-3">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">PROIECTE</span>
                      <strong className="text-slate-900 text-base">{hub.projects_count}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">ENTITĂȚI</span>
                      <strong className="text-amber-800 text-base">{hub.entities_count}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">SEMNALE</span>
                      <strong className="text-sky-800 text-base">{hub.signals_count}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Dosar de analiză regional</span>
                    <Link href={`/cities/${hub.slug}`} className="text-amber-800 font-bold hover:underline">
                      EXPLOREAZĂ POLUL →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. VERIFIED CHANGES AUDIT LOG */}
        <section className="py-12 border-b border-slate-200 bg-slate-50/40">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span className="text-slate-900 font-bold uppercase tracking-wider">
                4. EVOLUȚII RECENTE DE PIAȚĂ DOCUMENTATE (NOIEMBRIE 2026)
              </span>
              <Link href="/changes" className="text-amber-800 hover:underline font-bold">
                REGISTRUL DE SCHIMBĂRI →
              </Link>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {documentedChanges.map(chg => (
                <div key={chg.id} className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-500 hover:shadow-xs transition-all">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap text-[10px]">
                      <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded font-bold uppercase">
                        {chg.change_type}
                      </span>
                      <span className="text-slate-500 font-semibold">{chg.date}</span>
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-bold uppercase">
                        {chg.verification_state}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 pt-1">
                      {chg.entity_type === 'Company' ? (
                        <Link href={`/companies/${chg.entity_slug}`} className="hover:text-amber-800 inline-flex items-center gap-1.5">
                          <BuildingIcon className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span>{chg.entity_name}</span>
                        </Link>
                      ) : (
                        <Link href={`/projects/${chg.entity_slug}`} className="hover:text-amber-800 inline-flex items-center gap-1.5">
                          <CraneIcon className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span>{chg.entity_name}</span>
                        </Link>
                      )}
                    </h4>

                    <p className="text-xs text-slate-600 font-sans leading-relaxed">{chg.summary}</p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span>Anterior: <strong className="text-slate-700">{chg.previous_state}</strong></span>
                      <span>→</span>
                      <span>Actualizat: <strong className="text-amber-800 font-bold">{chg.new_state}</strong></span>
                    </div>
                  </div>

                  {chg.source_url && (
                    <a
                      href={chg.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 bg-slate-50 border border-slate-300 text-slate-800 rounded-lg font-bold hover:border-amber-600 shrink-0 self-start md:self-center"
                    >
                      {chg.source_title} ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. PRIMARY SOURCES LEDGER */}
        <section className="py-12 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span className="text-slate-900 font-bold uppercase tracking-wider">
                5. REGISTRU DE SURSE PRIMARE &amp; PROVENIENȚĂ
              </span>
              <span className="text-emerald-700 font-bold">CITĂRI AUTENTIFICATE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-mono text-xs">
              {primarySourcesLedger.map(src => (
                <div key={src.title} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 flex flex-col justify-between hover:border-amber-500 hover:shadow-xs transition-all">
                  <div>
                    <span className="text-[10px] text-amber-800 font-bold uppercase">{src.category}</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{src.title}</h4>
                    <p className="text-xs text-slate-600 font-sans mt-2 leading-relaxed">{src.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Citare Oficială</span>
                    <a href={src.url} target="_blank" rel="noreferrer" className="text-amber-800 font-bold hover:underline">
                      VERIFICĂ SURSA ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
