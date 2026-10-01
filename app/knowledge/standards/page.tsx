import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getAllStandards } from "@/lib/knowledge-data";

export const metadata = {
  title: "European Eurocodes & Romanian Construction Normatives Registry | CONSTRUCTIONS",
  description: "Official repository of governing engineering standards in Romania: SR EN 1990 to SR EN 1998, NE 012-1:2022 concrete code, P100-1/2013 seismic code, CR 6-2013 masonry code, Normativ C 107 thermal performance.",
  alternates: {
    canonical: "https://constructions.cristianvaduva.com/knowledge/standards"
  }
};

export default function StandardsRegistryPage() {
  const standards = getAllStandards();

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20 pb-20">
        {/* Breadcrumb & Hero */}
        <section className="py-8 md:py-14 border-b border-[#1A1D1B] bg-gradient-to-b from-[#0C0D0C] to-[#050505]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#888888] flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">HOME</Link>
              <span>/</span>
              <Link href="/knowledge" className="hover:text-white transition-colors">KNOWLEDGE</Link>
              <span>/</span>
              <span className="text-[#C9A227]">STANDARDS & NORMATIVES</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#C9A227]">
              <span className="px-2.5 py-1 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded">
                TIER 1 & TIER 2 OFFICIAL STANDARDS REGISTRY
              </span>
              <span>•</span>
              <span className="px-2.5 py-1 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] rounded">
                ASRO & MDLPA COMPLIANT
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              EUROCODES & ROMANIAN CONSTRUCTION NORMATIVES
            </h1>
            <p className="text-sm md:text-base text-[#B0B0B0] max-w-4xl leading-relaxed">
              Official regulatory framework governing structural design, material certification, fire protection, and energy performance across Romanian civil, industrial, and infrastructure engineering projects.
            </p>
          </div>
        </section>

        {/* Standards Table / Mobile Cards */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-10">
          <div className="space-y-4">
            {standards.map((std, idx) => (
              <div
                key={idx}
                className="p-5 md:p-6 bg-[#0B0C0B] border border-[#1A1D1B] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#C9A227]/30 transition-all duration-300"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold font-mono text-[#C9A227]">
                      {std.code}
                    </span>
                    <span className="text-[10px] font-mono text-[#888888] px-2 py-0.5 bg-[#141514] border border-[#222222] rounded">
                      {std.organization} ({std.year})
                    </span>
                    <span className="text-[9px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
                      {std.tier}
                    </span>
                  </div>

                  <h2 className="text-sm md:text-base font-bold text-white">
                    {std.title}
                  </h2>

                  <p className="text-xs text-[#AAAAAA] leading-relaxed">
                    <span className="text-[#666666] font-mono uppercase text-[10px] mr-1">Scope:</span>
                    {std.scope}
                  </p>
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
