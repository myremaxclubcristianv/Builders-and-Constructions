import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset } from '@/lib/real-romanian-data';
import { safeJsonLdStringify } from '@/lib/sanitize';
import { LocationPinIcon, CogIcon } from '@/components/icons/NavIcons';

export const metadata: Metadata = {
  title: 'Consultanți în Inginerie & Proiectare Structurală · CONSTRUCTIONS by AiXLuxury',
  description: 'Catalog verificat din surse publice al consultanților de inginerie structurală, proiectanților de instalații MEP, experților tehnici și proiectanților civili din România.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/engineers'
  }
};

export default function EngineersPage() {
  const engineers = realCompaniesDataset.filter(
    c => c.type === 'engineering' || c.type === 'structural_engineering' || c.type === 'mep'
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Director Inginerie & Consultanță România',
    description: 'Catalog verificat de companii de inginerie și proiectare structurală din România.',
    url: 'https://constructions.cristianvaduva.com/engineers',
    numberOfItems: engineers.length
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-amber-100 selection:text-amber-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
      />
      <SiteHeader />

      <main className="pt-24 pb-20">
        <section className="border-b border-slate-200 bg-slate-50/70 py-12 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-800 font-bold">
              <span>TAXONOMIE DE PIAȚĂ</span>
              <span>·</span>
              <span className="text-slate-900 font-bold">{engineers.length} SPECIALIȘTI VERIFICAȚI</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-950 tracking-tight">
              INGINERIE STRUCTURALĂ &amp; INSTALAȚII MEP
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-3xl leading-relaxed font-sans">
              Director independent ce acoperă firme de proiectare structurală, rezistență, instalații sanitare, termice și electrice (MEP), verificatori atestați și experți în inginerie seismică din România.
            </p>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-4 md:px-8 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {engineers.map(eng => (
              <div
                key={eng.id}
                className="bg-white border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all rounded-2xl p-6 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono font-bold uppercase rounded-md shadow-xs">
                      INGINERIE &amp; STRUCTURĂ
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Fondat în {eng.founded_year || 'N/A'}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-amber-800 transition-colors leading-snug">
                    <Link href={`/companies/${eng.slug}`}>
                      {eng.name}
                    </Link>
                  </h2>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {eng.description}
                  </p>

                  <div className="pt-2 text-xs font-mono text-slate-500 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <LocationPinIcon className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span className="text-slate-700">{eng.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CogIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Proiecte Verificate: <span className="text-slate-900 font-bold">{eng.projects_count}</span></span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">{(eng as any).market_tier || 'INGINER'}</span>
                  <Link
                    href={`/companies/${eng.slug}`}
                    className="text-amber-800 font-bold hover:text-amber-950"
                  >
                    DESCHIDE DOSAR →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
