import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getAllMaterialComparisons } from "@/lib/knowledge-data";

export const metadata = {
  title: "Material Engineering Comparisons & Trade-off Matrix | CONSTRUCTIONS",
  description: "Factual comparative analysis of building materials: EPS vs XPS vs Rock Wool, Clay Brick vs AAC (BCA), and Waterproofing Bituminous vs PVC/TPO membranes.",
  alternates: {
    canonical: "https://constructions.cristianvaduva.com/knowledge/compare"
  }
};

export default function MaterialComparePage() {
  const comparisons = getAllMaterialComparisons();

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
              <span className="text-[#C9A227]">MATERIAL COMPARISONS</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#C9A227]">
              <span className="px-2.5 py-1 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded">
                OBJECTIVE MATERIAL INTELLIGENCE
              </span>
              <span>•</span>
              <span className="px-2.5 py-1 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] rounded">
                NO UNIVERSAL WINNER POLICY
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              MATERIAL COMPARISON WORKSTATION
            </h1>
            <p className="text-sm md:text-base text-[#B0B0B0] max-w-4xl leading-relaxed">
              Objective side-by-side engineering comparison across density, thermal conductivity ($lambda$), compressive strength, water absorption, fire Euroclass reaction (A1–F), and acoustic behavior.
            </p>
          </div>
        </section>

        {/* Comparisons List */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 space-y-12">
          {comparisons.map((comp) => (
            <div
              key={comp.id}
              className="p-6 md:p-8 bg-[#0B0C0B] border border-[#1A1D1B] rounded-2xl space-y-6"
            >
              <div className="border-b border-[#1A1D1B] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] px-2.5 py-1 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded">
                    CATEGORY: {comp.category}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-white mt-2">
                    {comp.title}
                  </h2>
                </div>
                <div className="text-xs font-mono text-[#777777]">
                  Ref: {comp.standardReference}
                </div>
              </div>

              {/* Side-by-side Cards / Responsive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {comp.materials.map((mat, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-5 bg-[#111211] border border-[#1E201E] rounded-xl flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-white font-mono">
                          {mat.name}
                        </h3>
                        <span className="text-[10px] font-mono text-[#C9A227] px-2 py-0.5 bg-[#C9A227]/10 rounded">
                          {mat.fireReactionClass}
                        </span>
                      </div>

                      {/* Specs */}
                      <div className="space-y-1.5 text-xs font-mono border-t border-b border-[#1A1D1B] py-3">
                        <div className="flex justify-between">
                          <span className="text-[#777777]">Density:</span>
                          <span className="text-white">{mat.density}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#777777]">Thermal Cond. (λ):</span>
                          <span className="text-[#C9A227] font-bold">{mat.thermalConductivity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#777777]">Compressive Str.:</span>
                          <span className="text-white">{mat.compressiveStrength}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#777777]">Water Absorption:</span>
                          <span className="text-white">{mat.waterAbsorption}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#777777]">Acoustics:</span>
                          <span className="text-white">{mat.acousticPerformance}</span>
                        </div>
                      </div>

                      {/* Best used for */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#10B981] font-bold uppercase">Optimal Applications:</span>
                        <ul className="space-y-1 text-xs text-[#BBBBBB]">
                          {mat.bestUsedFor.map((app, aIdx) => (
                            <li key={aIdx} className="flex items-start gap-1">
                              <span className="text-[#10B981]">✓</span>
                              <span>{app}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Critical Limitation */}
                    <div className="p-3 bg-[#171111] border border-[#EF4444]/30 rounded-lg text-xs space-y-1">
                      <span className="text-[10px] font-mono text-[#EF4444] font-bold uppercase">Critical Limitation:</span>
                      <p className="text-[#DDAAAA] text-[11px] leading-relaxed">
                        {mat.criticalLimitation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Engineering Verdict Box */}
              <div className="p-5 bg-[#141514] border border-[#C9A227]/30 rounded-xl space-y-2">
                <span className="text-xs font-mono font-bold text-[#C9A227] uppercase tracking-wider block">
                  ENGINEERING SELECTION PRINCIPLE
                </span>
                <p className="text-xs md:text-sm text-[#CCCCCC] leading-relaxed">
                  {comp.engineeringVerdict}
                </p>
              </div>
            </div>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
