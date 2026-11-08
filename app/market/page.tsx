import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getIndustryHubData } from '@/lib/data';
import { realCompaniesDataset, realProjectsDataset, realLocationsDataset } from '@/lib/real-romanian-data';
import { safeJsonLdStringify } from '@/lib/sanitize';

export const metadata = {
  title: 'Tablou de Bord Intelligence de Piață · CONSTRUCTIONS by AiXLuxury',
  description: 'Panou centralizat de cercetare a pieței ce documentează 143 de companii comerciale, 76 de proiecte majore de construcții, 36 de poli regionali și semnale verificate de piață din România.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/market'
  }
};

export default async function MarketDashboardPage() {
  const hubData = await getIndustryHubData();
  const { marketActivity } = hubData;

  const developers = realCompaniesDataset.filter(c => c.type === 'developer');
  const contractors = realCompaniesDataset.filter(c => c.type === 'general_contractor' || c.type === 'construction_company' || c.type === 'infrastructure');
  const architects = realCompaniesDataset.filter(c => c.type === 'architecture');
  const engineers = realCompaniesDataset.filter(c => c.type === 'engineering' || c.type === 'structural_engineering' || c.type === 'mep');
  const agencies = realCompaniesDataset.filter(c => c.type === 'real_estate_agency');

  // Asset class distribution dynamically computed
  const assetClasses = [
    { label: 'Rezidențial', count: realProjectsDataset.filter(p => p.project_type === 'Residential').length, href: '/projects?type=residential' },
    { label: 'Birouri & Comercial', count: realProjectsDataset.filter(p => p.project_type === 'Office').length, href: '/projects?type=office' },
    { label: 'Mix Multifuncțional', count: realProjectsDataset.filter(p => p.project_type === 'Mixed-use').length, href: '/projects?type=mixed_use' },
    { label: 'Industrial & Logistică', count: realProjectsDataset.filter(p => p.project_type === 'Industrial/Logistics').length, href: '/projects?type=logistics' },
    { label: 'Infrastructură Civilă', count: realProjectsDataset.filter(p => p.project_type === 'Civil Infrastructure').length, href: '/projects?type=infrastructure' },
    { label: 'Retail & Galerii', count: realProjectsDataset.filter(p => p.project_type === 'Retail').length, href: '/projects?type=retail' },
    { label: 'Hotelier & Ospitalitate', count: realProjectsDataset.filter(p => p.project_type === 'Hospitality').length, href: '/projects?type=hospitality' }
  ];

  // Key Regional Hub Activity
  const regionalActivity = [
    { city: 'București', slug: 'bucharest', projects: realProjectsDataset.filter(p => p.location.includes('Bucharest') || p.location.includes('București')).length },
    { city: 'Cluj-Napoca', slug: 'cluj-napoca', projects: realProjectsDataset.filter(p => p.location.includes('Cluj')).length },
    { city: 'Timișoara', slug: 'timisoara', projects: realProjectsDataset.filter(p => p.location.includes('Timiș')).length },
    { city: 'Iași', slug: 'iasi', projects: realProjectsDataset.filter(p => p.location.includes('Iași')).length },
    { city: 'Brașov', slug: 'brasov', projects: realProjectsDataset.filter(p => p.location.includes('Brașov')).length },
    { city: 'Constanța', slug: 'constanta', projects: realProjectsDataset.filter(p => p.location.includes('Constanța') || p.location.includes('Mamaia')).length }
  ];

  const marketJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Tablou de Bord Intelligence de Piață — CONSTRUCTIONS by AiXLuxury',
    description: 'Panou centralizat de analiză a pieței de construcții și real estate din România.',
    url: 'https://constructions.cristianvaduva.com/market'
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-amber-100 selection:text-amber-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(marketJsonLd) }}
      />
      <SiteHeader />

      <main className="pt-24">
        {/* Hero Banner */}
        <section className="py-12 md:py-16 border-b border-slate-200 bg-slate-50/70">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold">
                Prezentare Generală de Piață
              </span>
              <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[9px] font-mono font-bold uppercase">
                DATE RECONCILIATE
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
              TABLOU NAȚIONAL DE INTELIGENȚĂ DE PIAȚĂ
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-3xl leading-relaxed">
              Terminal de cercetare ce agregă 143 de companii verificate faptic, 76 de proiecte majore de construcții documentate, 36 de poli regionali și semnale de piață din noiembrie 2026.
            </p>
          </div>
        </section>

        {/* Core Metrics Overview Grid */}
        <section className="py-12 border-b border-slate-200 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-8">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span className="text-slate-900 font-bold uppercase tracking-wider">METRICI COMPUTATE DIN BAZA DE DATE</span>
              <span className="text-amber-800 font-bold">ULTIMA ACTUALIZARE: 8 NOIEMBRIE 2026</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 font-mono">
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">TOTAL ENTITĂȚI</span>
                <div className="text-2xl font-bold text-slate-900">{realCompaniesDataset.length}</div>
                <span className="text-[9px] text-amber-800 font-bold block">VERIFICATE</span>
              </div>
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">TOTAL PROIECTE</span>
                <div className="text-2xl font-bold text-slate-900">{realProjectsDataset.length}</div>
                <span className="text-[9px] text-sky-800 font-bold block">DOCUMENTATE</span>
              </div>
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">DEZVOLTATORI</span>
                <div className="text-2xl font-bold text-slate-900">{developers.length}</div>
                <span className="text-[9px] text-slate-500 font-semibold block">100% DIN SURSE</span>
              </div>
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">CONSTRUCTORI</span>
                <div className="text-2xl font-bold text-slate-900">{contractors.length}</div>
                <span className="text-[9px] text-slate-500 font-semibold block">100% DIN SURSE</span>
              </div>
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">ARHITECȚI</span>
                <div className="text-2xl font-bold text-slate-900">{architects.length}</div>
                <span className="text-[9px] text-slate-500 font-semibold block">100% DIN SURSE</span>
              </div>
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">INGINERI</span>
                <div className="text-2xl font-bold text-slate-900">{engineers.length}</div>
                <span className="text-[9px] text-slate-500 font-semibold block">100% DIN SURSE</span>
              </div>
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">AGENȚII</span>
                <div className="text-2xl font-bold text-slate-900">{agencies.length}</div>
                <span className="text-[9px] text-slate-500 font-semibold block">100% DIN SURSE</span>
              </div>
            </div>

            {/* Construction Stage Breakdown Bar */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-slate-600 font-semibold">ȘANTIERE ACTIVE ÎN EXECUȚIE</span>
                <strong className="text-amber-800 font-bold text-base">
                  {realProjectsDataset.filter(p => p.status !== 'completed' && p.status !== 'delivered').length} ȘANTIERE
                </strong>
              </div>
              <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-slate-600 font-semibold">PLANIFICARE &amp; AUTORIZARE</span>
                <strong className="text-sky-800 font-bold text-base">
                  {realProjectsDataset.filter(p => (p.status || '').toLowerCase().includes('plan') || (p.status || '').toLowerCase().includes('permit') || (p.status || '').toLowerCase().includes('announced')).length} PROIECTE
                </strong>
              </div>
              <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-slate-600 font-semibold">LIVRĂRI FINALIZATE DOCUMENTATE</span>
                <strong className="text-emerald-700 font-bold text-base">
                  {realProjectsDataset.filter(p => p.status === 'completed' || p.status === 'delivered').length} FINALIZATE
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* Regional Activity & Asset Classes Grid */}
        <section className="py-12 md:py-16 bg-slate-50/50">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Documented Activity by Region */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-xs font-mono text-amber-800 uppercase tracking-wider font-bold">
                    ACTIVITATE DOCUMENTATĂ PE POLI REGIONALI
                  </span>
                  <Link href="/cities" className="text-xs font-mono text-amber-800 hover:text-amber-950 font-bold">
                    TOȚI POLII ({realLocationsDataset.length}) →
                  </Link>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {regionalActivity.map(reg => (
                    <div key={reg.slug} className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-amber-500 hover:shadow-xs transition-all">
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-semibold">POL REGIONAL</span>
                        <h3 className="text-sm font-bold text-slate-900 mt-0.5">{reg.city}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-amber-800">{reg.projects} PROIECTE</span>
                        <Link href={`/cities/${reg.slug}`} className="px-3.5 py-1.5 bg-slate-50 border border-slate-300 text-slate-800 rounded-lg text-xs font-semibold hover:border-amber-600">
                          EXPLOREAZĂ →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Asset Class Distribution */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-xs font-mono text-amber-800 uppercase tracking-wider font-bold">
                    DISTRIBUȚIE PE TIPOLOGII DE ACTIVE
                  </span>
                  <Link href="/projects" className="text-xs font-mono text-amber-800 hover:text-amber-950 font-bold">
                    CATALOG PROIECTE →
                  </Link>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {assetClasses.map(ac => (
                    <div key={ac.label} className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-amber-500 hover:shadow-xs transition-all">
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-semibold">SECTOR</span>
                        <h3 className="text-sm font-bold text-slate-900 mt-0.5">{ac.label}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-slate-900">{ac.count} ȘANTIERE</span>
                        <Link href={ac.href} className="px-3.5 py-1.5 bg-slate-50 border border-slate-300 text-slate-800 rounded-lg text-xs font-semibold hover:border-amber-600">
                          FILTREAZĂ →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Verified Market Signals Stream */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-mono text-amber-800 uppercase tracking-wider font-bold">
                  SEMNALE RECENTE DE PIAȚĂ VERIFICATE ({marketActivity.length}) · ULTIMUL SEMNAL: 8 NOIEMBRIE 2026
                </span>
                <Link href="/signals" className="text-xs font-mono text-amber-800 hover:text-amber-950 font-bold">
                  FEED COMPLET DE SEMNALE →
                </Link>
              </div>

              <div className="space-y-3">
                {marketActivity.slice(0, 5).map(sig => (
                  <div key={sig.id} className="p-5 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500 hover:shadow-xs transition-all">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-amber-800 font-bold uppercase">{sig.signal_type.replaceAll('_', ' ')} · {sig.event_date}</span>
                        {sig.evidence_classification && (
                          <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px] font-mono uppercase text-slate-600 font-semibold">
                            {sig.evidence_classification}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{sig.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{sig.summary}</p>
                    </div>
                    {sig.source_url && (
                      <a href={sig.source_url} target="_blank" rel="noreferrer" className="text-xs font-mono text-amber-800 hover:underline shrink-0 font-bold">
                        VERIFICĂ SURSA ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Neutrality Disclosure */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-500 leading-relaxed">
              <strong className="text-slate-800">DECLARAȚIE DE INDEPENDENȚĂ A PLATFORMEI:</strong> CONSTRUCTIONS este o platformă independentă de informație și cercetare. Includerea unei entități nu implică reprezentare, andosare, parteneriat sau relație comercială. Toate datele sunt calculate programatic din registre publice verificate.
            </div>

          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
