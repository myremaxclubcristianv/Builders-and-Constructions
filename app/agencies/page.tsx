import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset } from '@/lib/real-romanian-data';
import { safeJsonLdStringify } from '@/lib/sanitize';
import { LocationPinIcon, BriefcaseIcon } from '@/components/icons/NavIcons';

export const metadata: Metadata = {
  title: 'Director Agenții Imobiliare & Consultanță · CONSTRUCTIONS by AiXLuxury',
  description: 'Catalog verificat din surse publice al agențiilor imobiliare, brokerajului comercial, consultanților de investiții și reprezentanților de vânzări din România.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/agencies'
  }
};

export default function AgenciesPage() {
  const agencies = realCompaniesDataset.filter(c => c.type === 'real_estate_agency');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Director Agenții Imobiliare România',
    description: 'Catalog verificat de agenții imobiliare și brokeraj din România.',
    url: 'https://constructions.cristianvaduva.com/agencies',
    numberOfItems: agencies.length
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
              <span className="text-slate-900 font-bold">{agencies.length} AGENȚII VERIFICATE</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-950 tracking-tight">
              AGENȚII IMOBILIARE &amp; BROKERAJ
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-3xl leading-relaxed font-sans">
              Director de piață ce documentează companiile de consultanță imobiliară comercială, reprezentanții exclusivi de vânzări pentru ansambluri rezidențiale și specialiștii în piețe de capital din România.
            </p>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-4 md:px-8 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencies.map(agency => (
              <div
                key={agency.id}
                className="bg-white border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all rounded-2xl p-6 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono font-bold uppercase rounded-md shadow-xs">
                      AGENȚIE IMOBILIARĂ
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Fondată în {agency.founded_year || 'N/A'}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-amber-800 transition-colors leading-snug">
                    <Link href={`/companies/${agency.slug}`}>
                      {agency.name}
                    </Link>
                  </h2>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {agency.description}
                  </p>

                  <div className="pt-2 text-xs font-mono text-slate-500 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <LocationPinIcon className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span className="text-slate-700">{agency.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BriefcaseIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Proiecte Reprezentate: <span className="text-slate-900 font-bold">{agency.projects_count}</span></span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">{(agency as any).market_tier || 'AGENȚIE IMOBILIARĂ'}</span>
                  <Link
                    href={`/companies/${agency.slug}`}
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
