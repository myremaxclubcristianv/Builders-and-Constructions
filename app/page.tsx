import Link from 'next/link';
import Image from 'next/image';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getPublishedCompanies, getPublishedProjects, getIndustryHubData } from '@/lib/data';
import { CompanyIntelligencePreview } from '@/components/CompanyIntelligencePreview';
import { REAL_CONSTRUCTIONS_VIDEOS } from '@/lib/video-data';
import { VideoCard } from '@/components/VideoCard';
import { safeJsonLdStringify } from '@/lib/sanitize';
import { NewsletterSubscription } from '@/components/NewsletterSubscription';
import { resolveVisualProvenanceBadge } from '@/lib/company-imagery';

import { realCompaniesDataset, realProjectsDataset, getVerifiedHubStatistics } from '@/lib/real-romanian-data';

export default async function Home() {
  const [companyList, projectList, industryData] = await Promise.all([
    getPublishedCompanies(),
    getPublishedProjects(),
    getIndustryHubData()
  ]);

  const featuredProjects = projectList.slice(0, 6);
  const featuredCompanies = companyList.slice(0, 6);
  const { marketActivity } = industryData;

  // Real verified statistics derived strictly from dataset
  const devCount = realCompaniesDataset.filter(c => c.type === 'developer').length;
  const contractorCount = realCompaniesDataset.filter(c => c.type === 'general_contractor' || c.type === 'construction_company' || c.type === 'infrastructure').length;
  const architectCount = realCompaniesDataset.filter(c => c.type === 'architecture').length;
  const engineerCount = realCompaniesDataset.filter(c => c.type === 'engineering' || c.type === 'structural_engineering' || c.type === 'mep').length;
  const agencyCount = realCompaniesDataset.filter(c => c.type === 'real_estate_agency').length;
  const projectCount = realProjectsDataset.length;
  const verifiedHubStats = getVerifiedHubStatistics();

  const topProjectsByArea = [...projectList]
    .filter(p => p.surface_area)
    .sort((a, b) => (b.surface_area || 0) - (a.surface_area || 0))
    .slice(0, 4);

  const homepageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://constructions.cristianvaduva.com/#website',
        url: 'https://constructions.cristianvaduva.com',
        name: 'CONSTRUCTIONS by AiXLuxury',
        description: 'Platformă independentă de cercetare și inteligență de piață pentru sectorul construcțiilor din România.',
        inLanguage: 'ro-RO'
      },
      {
        '@type': 'Organization',
        '@id': 'https://constructions.cristianvaduva.com/#organization',
        name: 'CONSTRUCTIONS by AiXLuxury',
        url: 'https://constructions.cristianvaduva.com',
        description: 'Platformă independentă de cercetare de piață pentru dezvoltatori, antreprenori generali, ingineri proiectanți și birouri de arhitectură din România.',
        areaServed: {
          '@type': 'Country',
          name: 'România'
        }
      }
    ]
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-amber-100 selection:text-amber-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(homepageJsonLd) }}
      />
      <SiteHeader />

      <main className="pt-20">
        {/* 01 — HERO EXPERIENCE (PREMIUM WHITE & SPACIOUS) */}
        <section className="relative pt-12 pb-16 md:pt-24 md:pb-28 overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50/80 via-white to-white">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-full text-[11px] font-mono tracking-wider text-amber-800 uppercase font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                Inteligență în Construcții &amp; Real Estate pentru România
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.05]">
                INTELIGENȚĂ ÎN CONSTRUCȚII <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-amber-800 to-amber-600">
                  PENTRU ROMÂNIA
                </span>
              </h1>

              <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                Platformă independentă de analiză și transparență în construcții dedicată cumpărătorilor, investitorilor instituționali, antreprenorilor generali și furnizorilor de materiale din România. Rigoare documentară și verificare faptică, fără date speculative sau afirmații comerciale neacoperite.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/projects"
                  className="px-6 py-3.5 bg-slate-950 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-800 active:scale-95 transition-all text-center min-w-[140px] shadow-sm"
                >
                  Explorează Proiecte ({projectCount})
                </Link>
                <Link
                  href="/companies"
                  className="px-6 py-3.5 bg-white border border-slate-300 text-slate-800 font-mono text-xs font-semibold uppercase tracking-wider rounded-lg hover:border-amber-600 hover:text-amber-800 active:scale-95 transition-all text-center min-w-[140px] shadow-sm"
                >
                  Verifică o Companie ({companyList.length})
                </Link>
                <Link
                  href="/methodology"
                  className="px-4 py-3.5 text-amber-800 hover:text-amber-950 font-mono text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                >
                  <span>Metodologia Noastră</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* THREE CORE ENTRANCE PATHWAYS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 mt-12 border-t border-slate-200">
              <div className="p-6 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4 hover:border-amber-500 hover:shadow-md transition-all">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 font-bold">01 · CUMPĂRĂTORI & INVESTITORI</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Cercetare Pre-Achiziție</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Verifică istoricul dezvoltatorului, autorizațiile, stadiul real de execuție pe șantier și riscurile documentate înainte de un angajament financiar.
                  </p>
                </div>
                <Link href="/projects" className="text-xs font-mono font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1">
                  <span>Explorează Proiecte</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4 hover:border-sky-500 hover:shadow-md transition-all">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-sky-800 font-bold">02 · COMPANII DIN CONSTRUCȚII</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Dosare & Oportunități</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Consultă profiluri tehnice verificate, cifre financiare, portofolii de proiecte și solicită actualizarea sau revendicarea profilului companiei.
                  </p>
                </div>
                <Link href="/companies" className="text-xs font-mono font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1">
                  <span>Verifică Companii</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4 hover:border-emerald-500 hover:shadow-md transition-all">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold">03 · FURNIZORI & PROFESIONIȘTI</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Rețea & Parteneri</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Identifică șantiere active în execuție, proiectanți structurali, ingineri de instalații și antreprenori generali pentru parteneriate comerciale.
                  </p>
                </div>
                <Link href="/network" className="text-xs font-mono font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1">
                  <span>Descoperă Rețeaua</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 02 — THE CONSTRUCTION & REAL ESTATE MARKET (DYNAMIC CATEGORY CARDS) */}
        <section className="bg-slate-50/70 border-b border-slate-200 py-12">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold">
                PIAȚA DE CONSTRUCȚII &amp; REAL ESTATE
              </span>
              <span className="text-xs font-mono text-slate-500 font-medium">
                {realCompaniesDataset.length} ENTITĂȚI VERIFICATE INDEXATE
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link
                href="/developers"
                className="p-5 bg-white border border-slate-200 rounded-xl flex flex-col justify-between hover:border-amber-500 hover:shadow-sm transition-all group"
              >
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold group-hover:text-amber-800">DEZVOLTATORI</span>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">{devCount}</span>
                  <span className="text-[10px] font-mono text-amber-700 font-bold">DEZV →</span>
                </div>
              </Link>

              <Link
                href="/contractors"
                className="p-5 bg-white border border-slate-200 rounded-xl flex flex-col justify-between hover:border-amber-500 hover:shadow-sm transition-all group"
              >
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold group-hover:text-amber-800">CONSTRUCTORI</span>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">{contractorCount}</span>
                  <span className="text-[10px] font-mono text-amber-700 font-bold">CONSTR →</span>
                </div>
              </Link>

              <Link
                href="/architects"
                className="p-5 bg-white border border-slate-200 rounded-xl flex flex-col justify-between hover:border-amber-500 hover:shadow-sm transition-all group"
              >
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold group-hover:text-amber-800">ARHITECȚI</span>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">{architectCount}</span>
                  <span className="text-[10px] font-mono text-amber-700 font-bold">PROIECT →</span>
                </div>
              </Link>

              <Link
                href="/engineers"
                className="p-5 bg-white border border-slate-200 rounded-xl flex flex-col justify-between hover:border-amber-500 hover:shadow-sm transition-all group"
              >
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold group-hover:text-amber-800">INGINERI</span>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">{engineerCount}</span>
                  <span className="text-[10px] font-mono text-amber-700 font-bold">ING →</span>
                </div>
              </Link>

              <Link
                href="/agencies"
                className="p-5 bg-white border border-slate-200 rounded-xl flex flex-col justify-between hover:border-amber-500 hover:shadow-sm transition-all group"
              >
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold group-hover:text-amber-800">AGENȚII</span>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">{agencyCount}</span>
                  <span className="text-[10px] font-mono text-amber-700 font-bold">CONSULT →</span>
                </div>
              </Link>

              <Link
                href="/projects"
                className="p-5 bg-white border border-slate-200 rounded-xl flex flex-col justify-between hover:border-amber-500 hover:shadow-sm transition-all group"
              >
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold group-hover:text-amber-800">PROIECTE</span>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">{projectCount}</span>
                  <span className="text-[10px] font-mono text-amber-700 font-bold">ȘANTIERE →</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* 03 — MARKET INTELLIGENCE DASHBOARD (FACTUAL VERIFIED METRICS) */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold block">
                  Panou de Piață
                </span>
                <h2 className="text-xl md:text-3xl font-extrabold text-slate-950 tracking-tight mt-1">
                  METRICI DE PIAȚĂ DOCUMENTATE
                </h2>
              </div>
              <Link href="/rankings" className="text-xs font-mono font-semibold text-amber-800 hover:text-amber-950 hover:underline">
                Clasament Complet →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Projects by Surface Area */}
              <div className="p-6 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-4">
                <span className="text-[11px] font-mono uppercase text-slate-500 tracking-wider font-bold block">
                  CELE MAI MARI PROIECTE INDEXATE (SUPRAFAȚĂ CONSTRUITĂ)
                </span>
                <div className="space-y-2.5">
                  {topProjectsByArea.map((p, idx) => (
                    <div key={p.slug} className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl text-xs shadow-xs">
                      <div className="flex items-center gap-3 truncate">
                        <span className="font-mono text-amber-700 font-bold">0{idx + 1}</span>
                        <Link href={`/projects/${p.slug}`} className="font-semibold text-slate-900 hover:text-amber-700 truncate">
                          {p.name}
                        </Link>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-slate-950">
                          {p.surface_area ? `${p.surface_area.toLocaleString()} m²` : 'NEDIVULGAT OFICIAL'}
                        </span>
                        <span className="block text-[10px] font-mono text-slate-500">{p.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Regional Hubs */}
              <div className="p-6 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-4">
                <span className="text-[11px] font-mono uppercase text-slate-500 tracking-wider font-bold block">
                  POLI REGIONALI DE DEZVOLTARE ACTIVI
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {verifiedHubStats.slice(0, 4).map(hub => (
                    <Link
                      key={hub.slug}
                      href={`/cities/${hub.slug}`}
                      className="p-4 bg-white border border-slate-200 rounded-xl hover:border-amber-500 hover:shadow-xs transition-all flex flex-col justify-between"
                    >
                      <span className="text-sm font-bold text-slate-900">{hub.name}</span>
                      <span className="text-[11px] font-mono text-amber-700 font-semibold mt-2">{hub.indexedCount} PROIECTE INDEXATE →</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04 — FEATURED PROJECTS (AUTHENTIC IMAGERY WITH TAXONOMY BADGES) */}
        <section className="py-14 md:py-24 border-b border-slate-200 bg-slate-50/50">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold block mb-1">
                  Dosare de Proiect
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-slate-950 tracking-tight">
                  DOSARE DE CONSTRUCȚII REPREZENTATIVE
                </h2>
              </div>
              <Link href="/projects" className="text-xs font-mono font-semibold text-amber-800 hover:text-amber-950 uppercase tracking-wider flex items-center gap-1">
                <span>Vezi toate cele {projectCount} proiecte</span>
                <span>→</span>
              </Link>
            </div>

            <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto pb-4 lg:pb-0 scrollbar-none snap-x snap-mandatory">
              {featuredProjects.map(p => {
                const provenance = resolveVisualProvenanceBadge(p);
                const hasImage = Boolean(p.image && !p.image.includes('unsplash.com'));

                return (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className="min-w-[85vw] sm:min-w-[400px] lg:min-w-0 snap-center bg-white border border-slate-200 rounded-2xl overflow-hidden group hover:border-amber-500 hover:shadow-lg transition-all flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      {hasImage && p.image ? (
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-100 text-center border-b border-slate-200">
                          <svg className="w-10 h-10 text-slate-400 mb-2 stroke-[1.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 2" />
                            <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
                          </svg>
                          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                            DOSAR TEHNIC VERIFICAT
                          </span>
                        </div>
                      )}
                      
                      {/* Discrete Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md border border-slate-200 rounded-md text-[10px] font-mono font-semibold text-slate-800 uppercase tracking-wider shadow-xs">
                          {p.status}
                        </span>
                        <span className={`px-2 py-1 rounded-md text-[9px] font-mono uppercase tracking-wider font-bold shadow-xs ${provenance.badgeClass}`}>
                          {provenance.label}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                          {p.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          {p.location}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                        <span className="truncate max-w-[200px]">{p.developer || 'Dezvoltator Divulgat'}</span>
                        <span className="text-amber-700 font-bold shrink-0">DOSAR →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 05 — EXPLORE BY INTELLIGENCE */}
        <section className="py-14 md:py-20 bg-white border-b border-slate-200">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="mb-8">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold block mb-1">
                Director de Navigare
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-950 tracking-tight">
                EXPLOREAZĂ INTELIGENȚA DE PIAȚĂ
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/projects"
                className="p-6 bg-slate-50/70 border border-slate-200 rounded-xl hover:border-amber-500 hover:shadow-xs transition-all group flex flex-col justify-between h-40"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-amber-800 font-bold">01 / DOSARE</span>
                  <span className="text-xs text-slate-400 group-hover:text-amber-800 transition-colors">→</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors">Proiecte</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{projectCount} Proiecte Indexate</p>
                </div>
              </Link>

              <Link
                href="/companies"
                className="p-6 bg-slate-50/70 border border-slate-200 rounded-xl hover:border-amber-500 hover:shadow-xs transition-all group flex flex-col justify-between h-40"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-amber-800 font-bold">02 / COMPANII</span>
                  <span className="text-xs text-slate-400 group-hover:text-amber-800 transition-colors">→</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors">Companii</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{realCompaniesDataset.length} Profiluri Documentate</p>
                </div>
              </Link>

              <Link
                href="/cities"
                className="p-6 bg-slate-50/70 border border-slate-200 rounded-xl hover:border-amber-500 hover:shadow-xs transition-all group flex flex-col justify-between h-40"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-amber-800 font-bold">03 / GEOGRAFIE</span>
                  <span className="text-xs text-slate-400 group-hover:text-amber-800 transition-colors">→</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors">Poli Regionali</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{verifiedHubStats.length} Centre Urbane Active</p>
                </div>
              </Link>

              <Link
                href="/rankings"
                className="p-6 bg-slate-50/70 border border-slate-200 rounded-xl hover:border-amber-500 hover:shadow-xs transition-all group flex flex-col justify-between h-40"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-amber-800 font-bold">04 / CLASAMENTE</span>
                  <span className="text-xs text-slate-400 group-hover:text-amber-800 transition-colors">→</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors">Clasamente Eșantion</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Lideri din Eșantionul Verificat</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* 06 — FEATURED COMPANIES */}
        <section className="py-14 md:py-24 border-b border-slate-200 bg-slate-50/40">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold block mb-1">
                  Dosare Executive
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-slate-950 tracking-tight">
                  COMPANII &amp; ENTITĂȚI INDEXATE
                </h2>
              </div>
              <Link href="/companies" className="text-xs font-mono font-semibold text-amber-800 hover:text-amber-950 uppercase tracking-wider flex items-center gap-1">
                <span>Vezi toate cele {realCompaniesDataset.length} companii</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCompanies.map((c, idx) => (
                <div
                  key={c.slug}
                  className="p-6 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4 hover:border-amber-500 hover:shadow-md transition-all"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500 font-semibold">0{idx + 1} · {c.type}</span>
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-[9px] font-mono uppercase font-bold">
                        PROFIL DOCUMENTAT
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      <CompanyIntelligencePreview
                        company={{
                          name: c.name,
                          slug: c.slug,
                          type: c.type,
                          location: c.location,
                          active_projects_count: c.active_projects_count,
                          market_signals_count: c.market_signals_count,
                          last_activity_date: c.last_activity_date,
                          signal_freshness: c.signal_freshness
                        }}
                      >
                        <Link href={`/companies/${c.slug}`} className="hover:text-amber-700 transition-colors">
                          {c.name}
                        </Link>
                      </CompanyIntelligencePreview>
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono text-[11px]">{c.location}</span>
                    <Link
                      href={`/companies/${c.slug}`}
                      className="font-mono text-xs font-bold text-amber-800 hover:text-amber-950 tracking-wider"
                    >
                      DOSAR EXECUTIV →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NATIONAL CONSTRUCTION MAP PREVIEW */}
        <section className="py-14 md:py-20 bg-white border-b border-slate-200">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold block mb-1">
                  Inteligență Geografică Națională
                </span>
                <h2 className="text-xl md:text-3xl font-extrabold text-slate-950 tracking-tight">
                  POLI DE CONSTRUCȚII &amp; DENSITATE ȘANTIERE
                </h2>
              </div>
              <Link
                href="/map"
                className="text-xs font-mono font-semibold text-amber-800 hover:text-amber-950 hover:underline flex items-center gap-1"
              >
                <span>Deschide Harta Interactivă Completă</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {verifiedHubStats.map(hub => (
                <Link
                  key={hub.name}
                  href={`/projects?q=${hub.query}`}
                  className="p-5 bg-slate-50/70 border border-slate-200 rounded-xl hover:border-amber-500 hover:shadow-xs transition-all group"
                >
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block truncate group-hover:text-amber-800 font-semibold">
                    {hub.name}
                  </span>
                  <div className="text-2xl font-bold font-mono text-slate-900 mt-1.5">
                    {hub.indexedCount}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-700 font-medium mt-1">
                    {hub.activeCount} {hub.activeCount === 1 ? 'Șantier Activ' : 'Șantiere Active'}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 07 — LATEST ACTIVITY FEED (LIVE MARKET SIGNALS NOVEMBER 2026) */}
        <section className="py-14 md:py-24 bg-slate-50/60 border-b border-slate-200">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold block mb-1">
                  Arhivă Documentară Verificată · Ultimul Semnal Înregistrat: 8 Noiembrie 2026
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-slate-950 tracking-tight">
                  SEMNALE DE PIAȚĂ VERIFICATE
                </h2>
              </div>
              <Link href="/signals" className="text-xs font-mono font-semibold text-amber-800 hover:text-amber-950 uppercase tracking-wider flex items-center gap-1">
                <span>Toate Semnalele de Piață</span>
                <span>→</span>
              </Link>
            </div>

            <div className="space-y-3.5">
              {marketActivity.slice(0, 5).map((act, i) => (
                <div
                  key={act.id || i}
                  className="p-5 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500 hover:shadow-xs transition-all"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0 mt-1 sm:mt-0" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{act.title}</h4>
                        {act.evidence_classification && (
                          <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px] font-mono uppercase text-slate-600 font-semibold">
                            {act.evidence_classification}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{act.summary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-500 shrink-0">
                    <span>{act.event_date}</span>
                    <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded text-[10px] font-semibold">
                      {act.signal_type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FROM THE CONSTRUCTIONS DESK — EDITORIAL VIDEO SHOWCASE */}
        <section className="py-14 md:py-24 bg-white border-b border-slate-200">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold block mb-1">
                  Studio Editorial Media · Conținut de Opinie &amp; Documentar Șantier
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-slate-950 tracking-tight">
                  PERSPECTIVE EDITORIALE CONSTRUCTIONS
                </h2>
                <p className="text-xs text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
                  Perspective video, analize de piață și vizite pe șantier realizate de echipa editorială. Conținut analitic distinct de registrele primare oficiale.
                </p>
              </div>
              <Link
                href="/video"
                className="text-xs font-mono font-semibold text-amber-800 hover:text-amber-950 uppercase tracking-wider flex items-center gap-1"
              >
                <span>TOATE MATERIALELE VIDEO</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {REAL_CONSTRUCTIONS_VIDEOS.slice(0, 3).map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        </section>

        {/* 08 — NEWSLETTER SUBSCRIPTION */}
        <section className="py-12 border-b border-slate-200 bg-slate-50/70">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <NewsletterSubscription />
          </div>
        </section>

        {/* 09 — FINAL CONVERSION CTA (CRISP & MODERN) */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 text-center space-y-6">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold">
              PARTENERIATE &amp; INTEGRARE
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight max-w-3xl mx-auto leading-tight">
              COLABORARE CU PLATFORMA CONSTRUCTIONS
            </h2>
            <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Explorează soluțiile de parteneriat corporativ, cercetare de piață, rapoarte instituționale și prezentare verificată a proiectelor pentru sectorul construcțiilor din România.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/work-with-us"
                className="px-6 py-3.5 bg-slate-950 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-800 active:scale-95 transition-all shadow-sm"
              >
                Inițiază Parteneriat
              </Link>
              <Link
                href="/sample-report"
                className="px-6 py-3.5 bg-white border border-amber-300 text-amber-800 font-mono text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-amber-50 active:scale-95 transition-all shadow-sm"
              >
                Raport Demonstrativ de Piață →
              </Link>
              <Link
                href="/report-error"
                className="px-6 py-3.5 bg-white border border-slate-300 text-slate-800 font-mono text-xs font-semibold uppercase tracking-wider rounded-lg hover:border-slate-500 active:scale-95 transition-all shadow-sm"
              >
                Solicită Actualizare Profil
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
