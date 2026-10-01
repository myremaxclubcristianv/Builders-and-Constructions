import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getAllConstructionProcesses } from "@/lib/knowledge-data";

export const metadata = {
  title: "15-Stage Construction Execution Lifecycle & Quality Control | CONSTRUCTIONS",
  description: "Official execution lifecycle for Romanian civil engineering: from geotechnical excavation and foundation pouring to structural frame, envelope, MEP commissioning, and reception protocol (PVLA / Carte Tehnica).",
  alternates: {
    canonical: "https://constructions.cristianvaduva.com/knowledge/processes"
  }
};

export default function ConstructionProcessesPage() {
  const processes = getAllConstructionProcesses();

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20 pb-20">
        {/* Hero */}
        <section className="py-8 md:py-14 border-b border-[#1A1D1B] bg-gradient-to-b from-[#0C0D0C] to-[#050505]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#888888] flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">HOME</Link>
              <span>/</span>
              <Link href="/knowledge" className="hover:text-white transition-colors">KNOWLEDGE</Link>
              <span>/</span>
              <span className="text-[#C9A227]">EXECUTION PROCESSES</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#C9A227]">
              <span className="px-2.5 py-1 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded">
                LEGEA 10/1995 PRIVIND CALITATEA IN CONSTRUCTII
              </span>
              <span>•</span>
              <span className="px-2.5 py-1 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] rounded">
                15 STANDARDIZED EXECUTION PHASES
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              15-STAGE CONSTRUCTION EXECUTION LIFECYCLE
            </h1>
            <p className="text-sm md:text-base text-[#B0B0B0] max-w-4xl leading-relaxed">
              Step-by-step technical requirements, mandatory quality control checkpoints (Procese Verbale de Lucrari Ascunse - PVLA), normative inspection standards, and technical dossier (Cartea Tehnica a Constructiei) milestones.
            </p>
          </div>
        </section>

        {/* Timeline / Sequential Process Cards */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 space-y-6">
          {processes.map((proc) => (
            <div
              key={proc.stepNumber}
              className="p-6 bg-[#0B0C0B] border border-[#1A1D1B] rounded-2xl space-y-4 hover:border-[#C9A227]/40 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1A1D1B] pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#C9A227] text-black font-mono font-bold flex items-center justify-center text-sm shrink-0">
                    {proc.stepNumber}
                  </span>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-white">
                      {proc.name}
                    </h2>
                    <span className="text-xs font-mono text-[#888888]">RO: {proc.romanianName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] px-2.5 py-1 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded">
                    PHASE: {proc.phase}
                  </span>
                  <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
                    {proc.sourceStatus}
                  </span>
                </div>
              </div>

              <p className="text-xs md:text-sm text-[#CCCCCC] leading-relaxed">
                {proc.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Critical Controls */}
                <div className="p-4 bg-[#111211] border border-[#1A1D1B] rounded-xl space-y-2">
                  <h3 className="text-xs font-mono font-bold text-[#C9A227] uppercase">
                    Mandatory Quality Checkpoints
                  </h3>
                  <ul className="space-y-1.5 text-xs text-[#BBBBBB]">
                    {proc.criticalQualityControls.map((ctrl, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-1.5">
                        <span className="text-[#C9A227] mt-0.5">•</span>
                        <span>{ctrl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Normative Requirements */}
                <div className="p-4 bg-[#111211] border border-[#1A1D1B] rounded-xl space-y-2">
                  <h3 className="text-xs font-mono font-bold text-[#4ADE80] uppercase">
                    Governing Normatives
                  </h3>
                  <ul className="space-y-1.5 text-xs text-[#BBBBBB]">
                    {proc.normativeRequirements.map((req, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-1.5 font-mono text-[11px]">
                        <span className="text-[#4ADE80]">§</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Deliverables / Reception */}
                <div className="p-4 bg-[#111211] border border-[#1A1D1B] rounded-xl space-y-2 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-white uppercase">
                      Mandatory Reception Act
                    </h3>
                    <p className="text-xs font-mono text-[#C9A227] mt-1">
                      {proc.deliverablesAndReception}
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-[#777777] border-t border-[#1A1D1B] pt-2">
                    Est. Duration: <span className="text-[#CCCCCC]">{proc.typicalDurationEstimate}</span>
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
