import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { OFFICIAL_SERVICES, ServiceCategory } from '@/lib/services-config';

export const metadata = {
  title: 'Servicii Oficiale în Construcții · CONSTRUCTIONS by AiXLuxury',
  description: 'Catalogul complet al celor 13 servicii oficiale: calitate în construcții, controlul calității, cartea tehnică, SSM, utilaje, asigurări, credite, real estate și proiectare.'
};

const CATEGORIES: { key: ServiceCategory; title: string; desc: string; count: number }[] = [
  {
    key: 'CONSTRUCTION_TECHNICAL',
    title: 'Construcții & Consultanță Tehnică',
    desc: 'Audituri de calitate, verificări pe șantier, cartea tehnică conform HG 273/1994, SSM și proiectare structurală.',
    count: 7
  },
  {
    key: 'COMMERCIAL_BUSINESS',
    title: 'Comercial & Parc Utilaje',
    desc: 'Promovare strategică de companii și proiecte, închiriere utilaje grele pentru infrastructură și terasamente.',
    count: 2
  },
  {
    key: 'FINANCIAL_INSURANCE',
    title: 'Financiar & Asigurări',
    desc: 'Polițe CAR/EAR, asigurări de răspundere profesională, structurare credite și finanțare proiecte.',
    count: 2
  },
  {
    key: 'REAL_ESTATE',
    title: 'Real Estate & Investiții',
    desc: 'Valorificare active imobiliare, reprezentare la vânzare, identificare terenuri și proprietăți de investiție.',
    count: 2
  }
];

export default function ServicesPage() {
  return (
    <>
      <SiteHeader />
      <main className="shell pt-28 pb-20">
        <section className="page-hero mb-12">
          <div className="eyebrow">OFFICIAL SERVICE DIVISIONS</div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-2 mb-4 text-white">
            SERVICII OFICIALE CONSTRUCȚII
          </h1>
          <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-[#A0A0A0]">
            Descoperă cele 13 divizii de servicii dedicate dezvoltatorilor, constructorilor, proiectanților și investitorilor din piața de construcții și real estate din România.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="px-6 py-3 bg-[#C9A227] hover:bg-[#d8b135] text-black font-bold text-xs font-mono rounded-lg transition-all"
            >
              Lansează o Solicitare Rapidă →
            </Link>
          </div>
        </section>

        {/* Categories & Service Cards */}
        <div className="space-y-16">
          {CATEGORIES.map(cat => {
            const servicesInCat = OFFICIAL_SERVICES.filter(s => s.category === cat.key);
            return (
              <section key={cat.key} className="space-y-6">
                <div className="border-b border-[#1A1D1B] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-[#C9A227] uppercase tracking-widest font-bold block">
                      DIVIZIA
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                      {cat.title}
                    </h2>
                    <p className="text-xs text-[#888888] mt-1 max-w-xl">
                      {cat.desc}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#C9A227] px-3 py-1 bg-[#1A1D1B] rounded border border-[#C9A227]/20 self-start sm:self-auto">
                    {servicesInCat.length} SERVICII ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {servicesInCat.map(srv => (
                    <div
                      key={srv.slug}
                      className="bg-[#0B0D0C] border border-[#1A1D1B] hover:border-[#C9A227]/40 rounded-2xl p-6 transition-all flex flex-col justify-between group shadow-xl hover:shadow-[#C9A227]/5"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl">{srv.icon}</span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#111412] text-[#C9A227] border border-[#C9A227]/20 font-bold">
                            {srv.badge}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white group-hover:text-[#C9A227] transition-colors mb-2">
                          {srv.title}
                        </h3>

                        <p className="text-xs text-[#A0A0A0] leading-relaxed mb-4">
                          {srv.shortDescription}
                        </p>

                        <div className="space-y-1.5 mb-6">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#666666] block">
                            Livrabile & Standarde:
                          </span>
                          <ul className="text-[11px] text-[#888888] space-y-1">
                            {srv.deliverables.slice(0, 3).map((d, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-[#C9A227]">✓</span>
                                <span className="line-clamp-1">{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#1A1D1B] flex items-center justify-between">
                        <Link
                          href={`/services/${srv.slug}`}
                          className="text-xs font-mono text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center gap-1 font-semibold"
                        >
                          <span>Dossier Detaliat</span>
                          <span>→</span>
                        </Link>
                        <Link
                          href={`/services/${srv.slug}#intake`}
                          className="px-3 py-1.5 bg-[#1A1D1B] hover:bg-[#C9A227] text-[#C9A227] hover:text-black text-[11px] font-mono rounded font-bold transition-all"
                        >
                          Solicită
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
