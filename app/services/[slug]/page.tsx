import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { OFFICIAL_SERVICES, getServiceBySlug } from '@/lib/services-config';
import { IntelligentIntakeFlow } from '@/components/IntelligentIntakeFlow';

export async function generateStaticParams() {
  return OFFICIAL_SERVICES.map(s => ({
    slug: s.slug
  }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const service = getServiceBySlug(params.slug);
  if (!service) return { title: 'Serviciu Negăsit' };

  return {
    title: `${service.title} · Servicii CONSTRUCTIONS by AiXLuxury`,
    description: service.shortDescription
  };
}

export default async function ServiceDossierPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const service = getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  const relatedServices = OFFICIAL_SERVICES.filter(
    s => s.category === service.category && s.slug !== service.slug
  );

  return (
    <>
      <SiteHeader />
      <main className="shell pt-28 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#888888] mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-white transition-colors">Servicii</Link>
          <span>/</span>
          <span className="text-[#C9A227]">{service.title}</span>
        </div>

        {/* Hero Section */}
        <section className="bg-[#0B0D0C] border border-[#1A1D1B] rounded-2xl p-6 sm:p-10 mb-12 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{service.icon}</span>
              <span className="text-xs font-mono px-3 py-1 bg-[#111412] text-[#C9A227] rounded-full border border-[#C9A227]/30 font-bold">
                {service.badge}
              </span>
              <span className="text-xs font-mono text-[#666666]">
                {service.categoryLabel}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              {service.title}
            </h1>

            <p className="text-base sm:text-lg text-[#C5C5C5] leading-relaxed mb-6 font-light">
              {service.fullDescription}
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#intake"
                className="px-8 py-3.5 bg-[#C9A227] hover:bg-[#d8b135] text-black font-extrabold text-xs font-mono uppercase tracking-wider rounded-lg transition-all shadow-lg"
              >
                Configurează Solicitarea Online ↓
              </a>
              <Link
                href="/services"
                className="px-6 py-3.5 bg-[#111412] hover:bg-[#1A1D1B] border border-[#1A1D1B] text-white text-xs font-mono rounded-lg transition-all"
              >
                Vezi toate cele 13 servicii
              </Link>
            </div>
          </div>
        </section>

        {/* Technical Specification Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Deliverables */}
          <div className="bg-[#0B0D0C] border border-[#1A1D1B] rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-mono text-[#C9A227] uppercase tracking-wider font-bold flex items-center gap-2">
              <span>📋</span> Livrabile & Rezultate
            </h3>
            <ul className="space-y-2.5 text-xs text-[#A0A0A0]">
              {service.deliverables.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#C9A227] font-bold">✓</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Applicable Standards */}
          <div className="bg-[#0B0D0C] border border-[#1A1D1B] rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-mono text-[#C9A227] uppercase tracking-wider font-bold flex items-center gap-2">
              <span>⚖️</span> Standarde & Cadru Legal
            </h3>
            <ul className="space-y-2.5 text-xs text-[#A0A0A0]">
              {service.applicableStandards.map((std, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#888888] font-mono">§</span>
                  <span className="leading-relaxed text-white font-medium">{std}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Target Audience */}
          <div className="bg-[#0B0D0C] border border-[#1A1D1B] rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-mono text-[#C9A227] uppercase tracking-wider font-bold flex items-center gap-2">
              <span>🎯</span> Cui se Adresează
            </h3>
            <ul className="space-y-2.5 text-xs text-[#A0A0A0]">
              {service.targetAudience.map((aud, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#C9A227]">→</span>
                  <span className="leading-relaxed">{aud}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Embedded Dedicated Smart Intake Flow */}
        <section id="intake" className="max-w-4xl mx-auto pt-8 scroll-mt-24 mb-16">
          <div className="text-center mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C9A227] font-bold">
              TRANSMITE O SOLICITARE DEDICATĂ
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Formular Inteligent: {service.title}
            </h2>
            <p className="text-xs text-[#888888] mt-2 max-w-lg mx-auto">
              Completează datele preliminare pentru ca departamentul tehnic să poată evalua cerințele înainte de contact.
            </p>
          </div>

          <IntelligentIntakeFlow
            initialServiceSlug={service.slug}
            sourceContext={`service_${service.slug}`}
          />
        </section>

        {/* Related Services in Same Category */}
        {relatedServices.length > 0 && (
          <section className="pt-12 border-t border-[#1A1D1B]">
            <span className="text-xs font-mono uppercase tracking-widest text-[#888888] block mb-4">
              ALTE SERVICII DIN DIVIZIA {service.categoryLabel.toUpperCase()}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedServices.map(rel => (
                <Link
                  key={rel.slug}
                  href={`/services/${rel.slug}`}
                  className="p-4 bg-[#0B0D0C] border border-[#1A1D1B] hover:border-[#C9A227] rounded-xl transition-all block group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{rel.icon}</span>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#C9A227] transition-colors">
                      {rel.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#888888] line-clamp-2">
                    {rel.shortDescription}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
