import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getAllProjectLifecycleStages, getAllConstructionEquipment } from "@/lib/knowledge-data";

export const metadata = {
  title: "Project Delivery Lifecycle, Economics & Construction Equipment | CONSTRUCTIONS",
  description: "End-to-end development lifecycle: land acquisition, permitting (CU/DTAC), hard/soft cost structures, contractor procurement, and heavy construction equipment (tower cranes, concrete pumps, pavers).",
  alternates: {
    canonical: "https://constructions.cristianvaduva.com/knowledge/lifecycle"
  }
};

export default function LifecycleAndEquipmentPage() {
  const stages = getAllProjectLifecycleStages();
  const equipment = getAllConstructionEquipment();

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
              <span className="text-[#C9A227]">LIFECYCLE & EQUIPMENT</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#C9A227]">
              <span className="px-2.5 py-1 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded">
                PROJECT DELIVERY & DEVELOPMENT ECONOMICS
              </span>
              <span>•</span>
              <span className="px-2.5 py-1 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] rounded">
                HEAVY SITE MACHINERY
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              PROJECT DELIVERY, ECONOMICS & MACHINERY
            </h1>
            <p className="text-sm md:text-base text-[#B0B0B0] max-w-4xl leading-relaxed">
              Factual framework covering development budget breakdown (hard costs vs. soft costs), permitting gates, and heavy construction equipment operation (tower cranes, batching pumps, pavers).
            </p>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 space-y-12">
          {/* Project Lifecycle */}
          <div className="space-y-6">
            <div className="border-b border-[#1A1D1B] pb-3">
              <h2 className="text-xl md:text-2xl font-bold text-white font-mono flex items-center gap-2">
                <span className="text-[#C9A227]">01.</span> THE 5-STAGE DEVELOPMENT DELIVERY LIFECYCLE
              </h2>
              <p className="text-xs text-[#888888] mt-1">
                Sequential progression of institutional real estate and civil engineering projects in Romania.
              </p>
            </div>

            <div className="space-y-4">
              {stages.map((stg) => (
                <div key={stg.stageNumber} className="p-6 bg-[#0B0C0B] border border-[#1A1D1B] rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[#C9A227] text-black font-mono font-bold flex items-center justify-center text-sm">
                        {stg.stageNumber}
                      </span>
                      <div>
                        <h3 className="text-base md:text-lg font-bold text-white">{stg.name}</h3>
                        <span className="text-xs font-mono text-[#888888]">RO: {stg.romanianName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3.5 bg-[#111211] rounded-xl space-y-1.5">
                      <span className="text-[10px] font-mono text-[#C9A227] block font-bold uppercase">Key Milestones:</span>
                      <ul className="space-y-1 text-[#CCCCCC]">
                        {stg.keyMilestones.map((m, idx) => (
                          <li key={idx}>• {m}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 bg-[#111211] rounded-xl space-y-1.5">
                      <span className="text-[10px] font-mono text-[#10B981] block font-bold uppercase">Economic Allocation:</span>
                      <p className="text-[#CCCCCC] leading-relaxed">{stg.economicConsiderations}</p>
                    </div>

                    <div className="p-3.5 bg-[#111211] rounded-xl space-y-1.5">
                      <span className="text-[10px] font-mono text-white block font-bold uppercase">Key Stakeholders:</span>
                      <p className="text-[#AAAAAA]">{stg.stakeholdersInvolved.join(", ")}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Construction Machinery & Equipment */}
          <div className="space-y-6">
            <div className="border-b border-[#1A1D1B] pb-3">
              <h2 className="text-xl md:text-2xl font-bold text-white font-mono flex items-center gap-2">
                <span className="text-[#C9A227]">02.</span> CONSTRUCTION EQUIPMENT & HEAVY MACHINERY
              </h2>
              <p className="text-xs text-[#888888] mt-1">
                Technical capacity, operational limits, and safety standards for primary site machinery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {equipment.map((eq) => (
                <div key={eq.id} className="p-6 bg-[#0B0C0B] border border-[#1A1D1B] rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-2">
                    <span className="text-[10px] font-mono text-[#C9A227] px-2 py-0.5 bg-[#C9A227]/10 rounded">
                      CATEGORY: {eq.category}
                    </span>
                    <span className="text-[10px] font-mono text-[#10B981]">STATUS: {eq.sourceStatus}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">{eq.name}</h3>
                    <p className="text-xs font-mono text-[#888888]">RO: {eq.romanianName}</p>
                  </div>

                  <p className="text-xs text-[#CCCCCC] leading-relaxed">{eq.purpose}</p>

                  <div className="p-3 bg-[#141514] rounded-xl text-xs font-mono text-[#C9A227]">
                    <span className="text-[10px] text-[#777777] block">Typical Capacity / Output:</span>
                    {eq.typicalCapacity}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-white block font-bold uppercase">Safety & Operational Limits:</span>
                    <ul className="space-y-1 text-xs text-[#AAAAAA]">
                      {eq.safetyAndOperationalConsiderations.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#C9A227]">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
