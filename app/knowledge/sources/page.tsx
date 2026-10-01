import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getAllKnowledgeSources } from "@/lib/knowledge-data";

export const metadata = {
  title: "Official Sources, Eurocodes & Regulatory Registry | CONSTRUCTIONS",
  description: "Complete transparent registry of Tier 1 to Tier 4 technical sources supporting all construction intelligence: European Commission, EUR-Lex, MDLPA, ASRO, CEN Eurocodes, and Notified Bodies.",
  alternates: {
    canonical: "https://constructions.cristianvaduva.com/knowledge/sources"
  }
};

export default function SourcesRegistryPage() {
  const sources = getAllKnowledgeSources();

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
              <span className="text-[#C9A227]">SOURCES REGISTRY</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#C9A227]">
              <span className="px-2.5 py-1 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded">
                TIER 1 - TIER 4 SOURCE TRUTH HIERARCHY
              </span>
              <span>•</span>
              <span className="px-2.5 py-1 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] rounded">
                ZERO FABRICATION GUARANTEE
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              KNOWLEDGE SOURCES & REGULATORY TRACEABILITY
            </h1>
            <p className="text-sm md:text-base text-[#B0B0B0] max-w-4xl leading-relaxed">
              Every technical claim, strength class, and material performance metric on CONSTRUCTIONS is traceable to official EU regulations, CEN Eurocodes, Romanian technical norms (MDLPA), or certified manufacturer Declarations of Performance (DoP).
            </p>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 space-y-6">
          {sources.map((src) => (
            <div
              key={src.id}
              className="p-6 bg-[#0B0C0B] border border-[#1A1D1B] rounded-2xl space-y-4 hover:border-[#C9A227]/40 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#1A1D1B] pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-[#C9A227] font-bold">
                    {src.organization}
                  </span>
                  <span className="text-[10px] font-mono text-[#888888] px-2 py-0.5 bg-[#141514] rounded">
                    {src.jurisdiction}
                  </span>
                  <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
                    {src.reliabilityTier}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#666666]">
                  Verified: {src.accessedAt}
                </div>
              </div>

              <div>
                <h2 className="text-base md:text-lg font-bold text-white">
                  {src.title}
                </h2>
                <div className="text-xs font-mono text-[#C9A227] mt-1">
                  Document Ref: <span className="text-white">{src.documentReference}</span>
                </div>
              </div>

              {src.notes && (
                <p className="text-xs text-[#CCCCCC] leading-relaxed bg-[#111211] p-3 rounded-xl">
                  {src.notes}
                </p>
              )}

              {src.url && (
                <div className="pt-2">
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono text-[#C9A227] hover:underline"
                  >
                    <span>OFFICIAL REPOSITORY LINK</span>
                    <span>↗</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
