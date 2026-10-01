import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getAllEngineeringDomains } from "@/lib/knowledge-data";

export const metadata = {
  title: "Building Physics, Geotechnical & Fire Engineering | CONSTRUCTIONS",
  description: "Advanced engineering intelligence: soil mechanics (Terzaghi), building physics (U-value, thermal bridges, vapor Glaser method), fire safety (reaction vs. resistance REI), and building acoustics (Rw, Ln,w).",
  alternates: {
    canonical: "https://constructions.cristianvaduva.com/knowledge/engineering"
  }
};

export default function EngineeringDomainsPage() {
  const domains = getAllEngineeringDomains();

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20 pb-20">
        <section className="py-8 md:py-14 border-b border-[#1A1D1B] bg-gradient-to-b from-[#0C0D0C] to-[#050505]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#888888] flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">HOME</Link>
              <span>/</span>
              <Link href="/knowledge" className="hover:text-white transition-colors">KNOWLEDGE</Link>
              <span>/</span>
              <span className="text-[#C9A227]">ENGINEERING DOMAINS</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#C9A227]">
              <span className="px-2.5 py-1 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded">
                GEOTECHNICAL, BUILDING PHYSICS, FIRE & ACOUSTICS
              </span>
              <span>•</span>
              <span className="px-2.5 py-1 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] rounded">
                SCIENTIFIC & REGULATORY PRINCIPLES
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              BUILDING PHYSICS & SPECIALIST ENGINEERING
            </h1>
            <p className="text-sm md:text-base text-[#B0B0B0] max-w-4xl leading-relaxed">
              Scientific laws, governing equations, failure modes, and mitigation standards across soil mechanics, hygrothermal envelope dynamics, structural fire resistance, and acoustic attenuation.
            </p>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 space-y-8">
          {domains.map((dom) => (
            <div
              key={dom.id}
              className="p-6 md:p-8 bg-[#0B0C0B] border border-[#1A1D1B] rounded-2xl space-y-6 hover:border-[#C9A227]/40 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1A1D1B] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#C9A227] uppercase tracking-widest px-2.5 py-1 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded">
                    FIELD: {dom.domainType.replace(/_/g, " ")}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-white mt-2">
                    {dom.title}
                  </h2>
                  <p className="text-xs font-mono text-[#888888] mt-0.5">RO: {dom.romanianTitle}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 self-start md:self-auto">
                  {dom.standardsAndCodes.map((std, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-[#141514] border border-[#222222] text-[11px] font-mono text-[#C9A227] rounded">
                      {std}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs md:text-sm text-[#CCCCCC] leading-relaxed">
                {dom.summary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                <div className="p-4 bg-[#111211] border border-[#1A1D1B] rounded-xl space-y-2">
                  <h3 className="text-xs font-mono font-bold text-[#C9A227] uppercase">
                    Core Engineering Principles
                  </h3>
                  <ul className="space-y-1.5 text-xs text-[#BBBBBB]">
                    {dom.corePrinciples.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#C9A227] mt-0.5">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-[#111211] border border-[#1A1D1B] rounded-xl space-y-2">
                  <h3 className="text-xs font-mono font-bold text-[#4ADE80] uppercase">
                    Governing Metrics & Units
                  </h3>
                  <ul className="space-y-1.5 text-xs font-mono text-[#BBBBBB]">
                    {dom.governingEquationsOrMetrics.map((eq, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#4ADE80]">§</span>
                        <span>{eq}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-[#111211] border border-[#EF4444]/20 rounded-xl space-y-2">
                  <h3 className="text-xs font-mono font-bold text-[#EF4444] uppercase">
                    Critical Failure Risks & Mitigations
                  </h3>
                  <ul className="space-y-1.5 text-xs text-[#BBBBBB]">
                    {dom.commonFailuresAndMitigations.map((fail, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#EF4444] mt-0.5">⚠</span>
                        <span>{fail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
