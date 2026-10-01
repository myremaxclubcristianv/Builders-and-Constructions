import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getAllConstructionSystems } from "@/lib/knowledge-data";

export const metadata = {
  title: "Construction Systems & Structural Principles | CONSTRUCTIONS Knowledge Base",
  description: "Structural engineering systems: reinforced concrete frames, structural steel, confined masonry (ZNA), prefabricated modular, cross-laminated timber (CLT), and seismic performance under Romanian Code P100-1/2013.",
  alternates: {
    canonical: "https://constructions.cristianvaduva.com/knowledge/systems"
  }
};

export default function StructuralSystemsPage() {
  const systems = getAllConstructionSystems();

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
              <span className="text-[#C9A227]">STRUCTURAL SYSTEMS</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#C9A227]">
              <span className="px-2.5 py-1 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded">
                ROMANIAN SEISMIC CODE P100-1/2013
              </span>
              <span>•</span>
              <span className="px-2.5 py-1 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] rounded">
                EUROCODES 1 - 8
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              STRUCTURAL ENGINEERING SYSTEMS
            </h1>
            <p className="text-sm md:text-base text-[#B0B0B0] max-w-4xl leading-relaxed">
              Comparative analysis of primary structural typologies in civil and industrial construction. Analysis includes load-bearing mechanics, seismic ductility ($q$-factor), typical applications, and lifecycle durability under Romanian Vrancea intermediate-depth seismic hazard.
            </p>
          </div>
        </section>

        {/* Systems List */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 space-y-8">
          {systems.map((sys, idx) => (
            <div
              key={sys.id}
              className="p-6 md:p-8 bg-[#0B0C0B] border border-[#1A1D1B] rounded-2xl space-y-6 hover:border-[#C9A227]/30 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1A1D1B] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#C9A227] font-bold">SYSTEM {String(idx + 1).padStart(2, "0")}</span>
                    <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
                      STATUS: {sys.sourceStatus}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                    {sys.name}
                  </h2>
                  <p className="text-xs font-mono text-[#888888] mt-0.5">RO: {sys.romanianName}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 self-start md:self-auto">
                  {sys.designCodes.map((code, cIdx) => (
                    <span key={cIdx} className="px-2.5 py-1 bg-[#141514] border border-[#222222] text-[11px] font-mono text-[#C9A227] rounded">
                      {code}
                    </span>
                  ))}
                </div>
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-[#C9A227] uppercase tracking-wider">
                      Structural Principle & Load Path
                    </h3>
                    <p className="text-xs md:text-sm text-[#CCCCCC] leading-relaxed mt-1">
                      {sys.structuralPrinciple}
                    </p>
                  </div>

                  <div className="p-4 bg-[#111211] border border-[#1A1D1B] rounded-xl space-y-1">
                    <h3 className="text-xs font-mono font-bold text-[#4ADE80] uppercase tracking-wider">
                      Seismic Behavior (P100-1/2013)
                    </h3>
                    <p className="text-xs text-[#BBBBBB] leading-relaxed">
                      {sys.seismicBehavior}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#111211] border border-[#10B981]/20 rounded-xl space-y-2">
                      <h4 className="text-xs font-mono font-bold text-[#10B981] uppercase">Advantages</h4>
                      <ul className="space-y-1 text-xs text-[#BBBBBB]">
                        {sys.advantages.map((adv, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-1.5">
                            <span className="text-[#10B981]">✓</span>
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-[#111211] border border-[#EF4444]/20 rounded-xl space-y-2">
                      <h4 className="text-xs font-mono font-bold text-[#EF4444] uppercase">Limitations</h4>
                      <ul className="space-y-1 text-xs text-[#BBBBBB]">
                        {sys.limitations.map((lim, lIdx) => (
                          <li key={lIdx} className="flex items-start gap-1.5">
                            <span className="text-[#EF4444]">⚠</span>
                            <span>{lim}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="text-xs text-[#888888] font-mono">
                    <span className="text-[#666666] block uppercase text-[10px]">Typical Applications:</span>
                    <span className="text-[#CCCCCC]">{sys.typicalApplications.join(", ")}</span>
                  </div>
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
