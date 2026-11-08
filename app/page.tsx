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
          name: 'Romania'
        }
      }
    ]
  };

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen selection:bg-[#C9A227] selection:text-[#050505]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(homepageJsonLd) }}
      />
      <SiteHeader />

      <main className="pt-20">
        {/* 01 — HERO EXPERIENCE */}
        <section className="relative pt-12 pb-16 md:pt-24 md:pb-28 overflow-hidden border-b border-[#1A1D1B]">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
            <div className="max-w-3xl space-y-6 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] border border-[#C9A227]/30 rounded-full text-[10px] font-mono tracking-widest text-[#C9A227] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse" />
                Inteligență în Construcții &amp; Real Estate pentru România
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
                INTELIGENȚĂ ÎN CONSTRUCȚII <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F3F1EB] to-[#C9A227]">
                  PENTRU ROMÂNIA
                </span>
              </h1>

              <p className="text-sm md:text-base text-[#D4D2C8] leading-relaxed max-w-2xl font-normal">
                Platformă independentă de analiză și transparență în construcții dedicată cumpărătorilor, investitorilor instituționali, antreprenorilor generali și furnizorilor de materiale din România. Rigoare documentară și verificare faptică, fără date speculative sau afirmații comerciale neacoperite.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/projects"
                  className="px-6 py-3.5 bg-[#C9A227] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#E4C58F] active:scale-95 transition-all text-center min-w-[140px]"
                >
                  Explorează Proiecte ({projectCount})
                </Link>
                <Link
                  href="/companies"
                  className="px-6 py-3.5 bg-[#111111] border border-[#1A1D1B] text-white font-mono text-xs font-semibold uppercase tracking-wider rounded-lg hover:border-[#C9A227]/50 active:scale-95 transition-all text-center min-w-[140px]"
                >
                  Verifică o Companie ({companyList.length})
                </Link>
                <Link
                  href="/methodology"
                  className="px-4 py-3.5 text-[#C9A227] hover:text-[#E4C58F] font-mono text-xs font-medium uppercase tracking-wider transition-colors flex items-center gap-1"
                >
                  <span>Metodologia Noastră</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* THREE CORE ENTRANCE PATHWAYS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12 mt-12 border-t border-[#1A1D1B]">
              <div className="p-6 bg-[#0E0E0E] border border-[#1A1D1B] rounded-2xl flex flex-col justify-between space-y-4 hover:border-[#C9A227]/40 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">01 · CUMPĂRĂTORI & INVESTITORI</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Cercetare Pre-Achiziție</h3>
                  <p className="text-xs text-[#A0A0A0] leading-relaxed">
                    Verifică istoricul dezvoltatorului, autorizațiile, stadiul real de execuție pe șantier și riscurile documentate înainte de un angajament financiar.
                  </p>
                </div>
                <Link href="/projects" className="text-xs font-mono font-bold text-[#C9A227] hover:underline flex items-center gap-1">
                  <span>Explorează Proiecte</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="p-6 bg-[#0E0E0E] border border-[#1A1D1B] rounded-2xl flex flex-col justify-between space-y-4 hover:border-[#C9A227]/40 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#38bdf8]">02 · COMPANII DIN CONSTRUCȚII</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Dosare & Oportunități</h3>
                  <p className="text-xs text-[#A0A0A0] leading-relaxed">
                    Consultă profiluri tehnice verificate, cifre financiare, portofolii de proiecte și solicită actualizarea sau revendicarea profilului companiei.
                  </p>
                </div>
                <Link href="/companies" className="text-xs font-mono font-bold text-[#38bdf8] hover:underline flex items-center gap-1">
                  <span>Verifică Companii</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="p-6 bg-[#0E0E0E] border border-[#1A1D1B] rounded-2xl flex flex-col justify-between space-y-4 hover:border-[#C9A227]/40 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#22c55e]">03 · FURNIZORI & PROFESIONIȘTI</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Rețea & Parteneri</h3>
                  <p className="text-xs text-[#A0A0A0] leading-relaxed">
                    Identifică șantiere active în execuție, proiectanți structurali, ingineri de instalații și antreprenori generali pentru parteneriate comerciale.
                  </p>
                </div>
                <Link href="/network" className="text-xs font-mono font-bold text-[#22c55e] hover:underline flex items-center gap-1">
                  <span>Descoperă Rețeaua</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 02 — THE CONSTRUCTION & REAL ESTATE MARKET (DYNAMIC CATEGORY CARDS) */}
        <section className="bg-[#0B0B0B] border-b border-[#1A1D1B] py-10">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">
                PIAȚA DE CONSTRUCȚII &amp; REAL ESTATE
              </span>
              <span className="text-[10px] font-mono text-[#888888]">
                {realCompaniesDataset.length} ENTITĂȚI VERIFICATE INDEXATE
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link
                href="/developers"
                className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col justify-between hover:border-[#C9A227]/50 transition-all group"
              >
                <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider group-hover:text-[#C9A227]">DEZVOLTATORI</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{devCount}</span>
                  <span className="text-[10px] font-mono text-[#C9A227]">DEZV →</span>
                </div>
              </Link>

              <Link
                href="/contractors"
                className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col justify-between hover:border-[#C9A227]/50 transition-all group"
              >
                <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider group-hover:text-[#C9A227]">CONSTRUCTORI</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{contractorCount}</span>
                  <span className="text-[10px] font-mono text-[#C9A227]">CONSTR →</span>
                </div>
              </Link>

              <Link
                href="/architects"
                className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col justify-between hover:border-[#C9A227]/50 transition-all group"
              >
                <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider group-hover:text-[#C9A227]">ARHITECȚI</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{architectCount}</span>
                  <span className="text-[10px] font-mono text-[#C9A227]">PROIECT →</span>
                </div>
              </Link>

              <Link
                href="/engineers"
                className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col justify-between hover:border-[#C9A227]/50 transition-all group"
              >
                <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider group-hover:text-[#C9A227]">INGINERI</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{engineerCount}</span>
                  <span className="text-[10px] font-mono text-[#C9A227]">ING →</span>
                </div>
              </Link>

              <Link
                href="/agencies"
                className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col justify-between hover:border-[#C9A227]/50 transition-all group"
              >
                <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider group-hover:text-[#C9A227]">AGENȚII</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{agencyCount}</span>
                  <span className="text-[10px] font-mono text-[#C9A227]">CONSULT →</span>
                </div>
              </Link>

              <Link
                href="/projects"
                className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col justify-between hover:border-[#C9A227]/50 transition-all group"
              >
                <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider group-hover:text-[#C9A227]">PROIECTE</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{projectCount}</span>
                  <span className="text-[10px] font-mono text-[#C9A227]">ȘANTIERE →</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* 03 — MARKET INTELLIGENCE DASHBOARD (FACTUAL VERIFIED METRICS) */}
        <section className="py-10 bg-[#070707] border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
                  Panou de Piață
                </span>
                <h2 className="text-lg md:text-2xl font-bold text-white tracking-tight mt-0.5">
                  METRICI DE PIAȚĂ DOCUMENTATE
                </h2>
              </div>
              <Link href="/rankings" className="text-xs font-mono text-[#C9A227] hover:underline">
                Clasament Complet →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Projects by Surface Area */}
              <div className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-3">
                <span className="text-[10px] font-mono uppercase text-[#888888] tracking-widest block">
                  CELE MAI MARI PROIECTE INDEXATE (SUPRAFAȚĂ CONSTRUITĂ)
                </span>
                <div className="space-y-2">
                  {topProjectsByArea.map((p, idx) => (
                    <div key={p.slug} className="flex items-center justify-between p-2.5 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-xs">
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="font-mono text-[#C9A227] font-bold">0{idx + 1}</span>
                        <Link href={`/projects/${p.slug}`} className="font-semibold text-white hover:text-[#C9A227] truncate">
                          {p.name}
                        </Link>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-[#F3F1EB]">
                          {p.surface_area ? `${p.surface_area.toLocaleString()} m²` : 'NEDIVULGAT OFICIAL'}
                        </span>
                        <span className="block text-[9px] font-mono text-[#888888]">{p.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Regional Hubs */}
              <div className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-3">
                <span className="text-[10px] font-mono uppercase text-[#888888] tracking-widest block">
                  POLI REGIONALI DE DEZVOLTARE ACTIVI
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {verifiedHubStats.slice(0, 4).map(hub => (
                    <Link
                      key={hub.slug}
                      href={`/cities/${hub.slug}`}
                      className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg hover:border-[#C9A227]/50 transition-all flex flex-col justify-between"
                    >
                      <span className="text-xs font-bold text-white">{hub.name}</span>
                      <span className="text-[10px] font-mono text-[#C9A227] mt-1">{hub.indexedCount} PROIECTE INDEXATE →</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04 — FEATURED PROJECTS */}
        <section className="py-12 md:py-20 border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-1">
                  Dosare de Proiect
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                  DOSARE DE CONSTRUCȚII REPREZENTATIVE
                </h2>
              </div>
              <Link href="/projects" className="text-xs font-mono text-[#C9A227] hover:text-[#E4C58F] uppercase tracking-wider flex items-center gap-1">
                <span>Vezi toate cele {projectCount} proiecte</span>
                <span>→</span>
              </Link>
            </div>

            <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto pb-4 lg:pb-0 scrollbar-none snap-x snap-mandatory">
              {featuredProjects.map(p => (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="min-w-[85vw] sm:min-w-[400px] lg:min-w-0 snap-center bg-[#111111] border border-[#1A1D1B] rounded-2xl overflow-hidden group hover:border-[#C9A227]/50 transition-all flex flex-col"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#0B0B0B]">
                    {p.image && (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80" />
                    <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                      <span className="px-2.5 py-1 bg-[#050505]/80 backdrop-blur-md border border-[#1A1D1B] rounded-md text-[10px] font-mono text-white uppercase tracking-wider">
                        {p.status}
                      </span>
                      <span className="px-2 py-1 bg-[#C9A227]/20 border border-[#C9A227]/40 rounded-md text-[9px] font-mono text-[#C9A227] uppercase tracking-wider font-semibold">
                        DOSAR VERIFICAT
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#C9A227] transition-colors line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="text-xs text-[#A0A0A0] mt-1 font-medium">
                        {p.location}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1A1D1B] flex items-center justify-between text-[11px] font-mono text-[#888888]">
                      <span>{p.developer || 'Dezvoltator Divulgat'}</span>
                      <span className="text-[#C9A227]">DOSAR →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 05 — EXPLORE BY INTELLIGENCE */}
        <section className="py-12 md:py-20 bg-[#0B0B0B] border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="mb-8">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-1">
                Director de Navigare
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                EXPLOREAZĂ INTELIGENȚA DE PIAȚĂ
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/projects"
                className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl hover:border-[#C9A227]/50 transition-all group flex flex-col justify-between h-36"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#C9A227]">01 / DOSARE</span>
                  <span className="text-xs text-[#888888] group-hover:text-[#C9A227] transition-colors">→</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#C9A227] transition-colors">Proiecte</h3>
                  <p className="text-xs text-[#888888] mt-0.5">{projectCount} Proiecte Indexate</p>
                </div>
              </Link>

              <Link
                href="/companies"
                className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl hover:border-[#C9A227]/50 transition-all group flex flex-col justify-between h-36"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#C9A227]">02 / COMPANII</span>
                  <span className="text-xs text-[#888888] group-hover:text-[#C9A227] transition-colors">→</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#C9A227] transition-colors">Companii</h3>
                  <p className="text-xs text-[#888888] mt-0.5">{realCompaniesDataset.length} Profiluri Documentate</p>
                </div>
              </Link>

              <Link
                href="/cities"
                className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl hover:border-[#C9A227]/50 transition-all group flex flex-col justify-between h-36"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#C9A227]">03 / GEOGRAFIE</span>
                  <span className="text-xs text-[#888888] group-hover:text-[#C9A227] transition-colors">→</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#C9A227] transition-colors">Poli Regionali</h3>
                  <p className="text-xs text-[#888888] mt-0.5">{verifiedHubStats.length} Centre Urbane Active</p>
                </div>
              </Link>

              <Link
                href="/rankings"
                className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl hover:border-[#C9A227]/50 transition-all group flex flex-col justify-between h-36"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#C9A227]">04 / CLASAMENTE</span>
                  <span className="text-xs text-[#888888] group-hover:text-[#C9A227] transition-colors">→</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#C9A227] transition-colors">Clasamente Eșantion</h3>
                  <p className="text-xs text-[#888888] mt-0.5">Lideri din Eșantionul Verificat</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* 06 — FEATURED COMPANIES */}
        <section className="py-12 md:py-20 border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-1">
                  Dosare Executive
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                  COMPANII &amp; ENTITĂȚI INDEXATE
                </h2>
              </div>
              <Link href="/companies" className="text-xs font-mono text-[#C9A227] hover:text-[#E4C58F] uppercase tracking-wider flex items-center gap-1">
                <span>Vezi toate cele {realCompaniesDataset.length} companii</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCompanies.map((c, idx) => (
                <div
                  key={c.slug}
                  className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl flex flex-col justify-between space-y-4 hover:border-[#C9A227]/50 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#888888]">0{idx + 1} · {c.type}</span>
                      <span className="px-2 py-0.5 bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30 rounded text-[9px] font-mono uppercase">
                        PROFIL DOCUMENTAT
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white">
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
                        <Link href={`/companies/${c.slug}`} className="hover:text-[#C9A227] transition-colors">
                          {c.name}
                        </Link>
                      </CompanyIntelligencePreview>
                    </h3>

                    <p className="text-xs text-[#A0A0A0] line-clamp-3 leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#1A1D1B] flex items-center justify-between text-xs">
                    <span className="text-[#888888] font-mono text-[11px]">{c.location}</span>
                    <Link
                      href={`/companies/${c.slug}`}
                      className="font-mono text-xs font-semibold text-[#C9A227] hover:text-[#E4C58F] tracking-wider"
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
        <section className="py-12 md:py-16 bg-[#070707] border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1A1D1B] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-1">
                  Inteligență Geografică Națională
                </span>
                <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">
                  POLI DE CONSTRUCȚII &amp; DENSITATE ȘANTIERE
                </h2>
              </div>
              <Link
                href="/map"
                className="text-xs font-mono text-[#C9A227] hover:underline flex items-center gap-1"
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
                  className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl hover:border-[#C9A227]/40 transition-all group"
                >
                  <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider block truncate group-hover:text-[#C9A227]">
                    {hub.name}
                  </span>
                  <div className="text-2xl font-bold font-mono text-white mt-1">
                    {hub.indexedCount}
                  </div>
                  <div className="text-[10px] font-mono text-[#22c55e] mt-0.5">
                    {hub.activeCount} {hub.activeCount === 1 ? 'Șantier Activ' : 'Șantiere Active'}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 07 — LATEST ACTIVITY FEED */}
        <section className="py-12 md:py-20 bg-[#0B0B0B] border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="mb-8">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-1">
                Arhivă Documentară Verificată · Ultimul Semnal Înregistrat: 24 August 2026
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                SEMNALE DE PIAȚĂ VERIFICATE
              </h2>
            </div>

            <div className="space-y-3">
              {marketActivity.slice(0, 5).map((act, i) => (
                <div
                  key={i}
                  className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#C9A227]/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
                    <div>
                      <h4 className="text-sm font-semibold text-white">{act.title}</h4>
                      <p className="text-xs text-[#888888] mt-0.5">{act.summary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-[#888888]">
                    <span>{act.event_date}</span>
                    <span className="px-2 py-0.5 bg-[#050505] border border-[#1A1D1B] rounded text-[10px] text-[#C9A227]">
                      {act.signal_type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FROM THE CONSTRUCTIONS DESK — EDITORIAL VIDEO SHOWCASE */}
        <section className="py-12 md:py-20 bg-[#050505] border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-1">
                  Studio Editorial Media · Conținut de Opinie &amp; Documentar Șantier
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                  PERSPECTIVE EDITORIALE CONSTRUCTIONS
                </h2>
                <p className="text-xs text-[#888888] mt-1 max-w-2xl">
                  Perspective video, analize de piață și vizite pe șantier realizate de echipa editorială. Conținut analitic distinct de registrele primare oficiale.
                </p>
              </div>
              <Link
                href="/video"
                className="text-xs font-mono text-[#C9A227] hover:text-[#E4C58F] uppercase tracking-wider flex items-center gap-1"
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
        <section className="py-12 border-b border-[#1A1D1B] bg-[#0A0B0A]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <NewsletterSubscription />
          </div>
        </section>

        {/* 09 — FINAL CONVERSION CTA */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-[#111111] via-[#0B0B0B] to-[#050505]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 text-center space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">
              PARTENERIATE &amp; INTEGRARE
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
              COLABORARE CU PLATFORMA CONSTRUCTIONS
            </h2>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-xl mx-auto">
              Explorează soluțiile de parteneriat corporativ, cercetare de piață, rapoarte instituționale și prezentare verificată a proiectelor pentru sectorul construcțiilor din România.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/work-with-us"
                className="px-6 py-3.5 bg-[#C9A227] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#E4C58F] active:scale-95 transition-all"
              >
                Inițiază Parteneriat
              </Link>
              <Link
                href="/sample-report"
                className="px-6 py-3.5 bg-[#141715] border border-[#C9A227]/40 text-[#C9A227] font-mono text-xs font-semibold uppercase tracking-wider rounded-lg hover:border-[#C9A227] active:scale-95 transition-all"
              >
                Raport Demonstrativ de Piață →
              </Link>
              <Link
                href="/report-error"
                className="px-6 py-3.5 bg-[#111111] border border-[#1A1D1B] text-white font-mono text-xs font-semibold uppercase tracking-wider rounded-lg hover:border-[#C9A227]/50 active:scale-95 transition-all"
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
