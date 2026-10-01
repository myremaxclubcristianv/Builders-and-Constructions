import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getAllStandards, getAllEurocodes } from "@/lib/knowledge-data";

export const metadata = {
  title: "Eurocodes (EN 1990 - EN 1999) & Romanian Technical Standards Registry | CONSTRUCTIONS",
  description: "Official repository of governing engineering standards in Romania: Ten Eurocode Families (EN 1990 to EN 1999), 2nd Generation Eurocodes roadmap, CPR 2024 regulation, NE 012-1:2022 concrete code, and P100-1/2013 seismic code.",
  alternates: {
    canonical: "https://constructions.cristianvaduva.com/knowledge/standards"
  }
};

export default function StandardsRegistryPage() {
  const nationalStandards = getAllStandards();
  const eurocodes = getAllEurocodes();

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
              <span className="text-[#C9A227]">STANDARDS & EUROCODES</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#C9A227]">
              <span className="px-2.5 py-1 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded">
                THE 10 EUROCODE FAMILIES (EN 1990 - EN 1999)
              </span>
              <span>•</span>
              <span className="px-2.5 py-1 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] rounded">
                CPR 2024 (REGULATION 2024/3110)
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              EUROCODES & ROMANIAN CONSTRUCTION NORMATIVES
            </h1>
            <p className="text-sm md:text-base text-[#B0B0B0] max-w-4xl leading-relaxed">
              Official regulatory architecture governing structural reliability, seismic actions, fire design, materials conformity, and environmental performance across European and Romanian civil engineering.
            </p>
          </div>
        </section>

        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 space-y-12">
          {/* CPR 2024 Regulatory Callout */}
          <section className="p-6 md:p-8 bg-[#0B0C0B] border border-[#C9A227]/40 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1A1D1B] pb-3">
              <span className="text-xs font-mono text-[#C9A227] font-bold">
                REGULATORY STATUS AS OF 2026
              </span>
              <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
                GENERAL APPLICABILITY: 8 JANUARY 2026
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white">
              Construction Products Regulation (CPR 2024 - Regulation EU 2024/3110)
            </h2>
            <p className="text-xs md:text-sm text-[#CCCCCC] leading-relaxed">
              The revised CPR 2024 modernizes the 2011 framework by establishing harmonized environmental performance declarations (EPD), life-cycle carbon assessment, digital product passports, and reinforced market surveillance while coexisting with CPR 2011 during the standard transition period.
            </p>
          </section>

          {/* 1. Ten Eurocode Families */}
          <section className="space-y-6">
            <div className="border-b border-[#1A1D1B] pb-3">
              <h2 className="text-xl md:text-2xl font-bold text-white font-mono flex items-center gap-2">
                <span className="text-[#C9A227]">01.</span> THE 10 EUROCODE SUITES (EN 1990 – EN 1999)
              </h2>
              <p className="text-xs text-[#888888] mt-1">
                European Commission & CEN harmonized structural design codes. Tracking 1st Generation active standards and 2nd Generation transition programs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {eurocodes.map((ec) => (
                <div key={ec.code} className="p-6 bg-[#0B0C0B] border border-[#1A1D1B] rounded-2xl space-y-4 hover:border-[#C9A227]/40 transition-all duration-300">
                  <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-2">
                    <span className="text-base font-bold font-mono text-[#C9A227]">{ec.code}</span>
                    <span className="text-[9px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
                      {ec.generationStatus}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{ec.title}</h3>
                    <p className="text-xs text-[#888888] font-mono mt-0.5">Family: {ec.family}</p>
                  </div>

                  <p className="text-xs text-[#CCCCCC] leading-relaxed">{ec.scope}</p>

                  <div className="p-3 bg-[#111211] rounded-xl text-xs space-y-1">
                    <span className="text-[10px] font-mono text-[#C9A227] block font-bold uppercase">Romanian National Annex:</span>
                    <p className="text-[#AAAAAA] text-[11px] leading-relaxed">{ec.romanianAdoption}</p>
                  </div>

                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-mono text-[#777777] block uppercase">Key Parts:</span>
                    <div className="flex flex-wrap gap-1">
                      {ec.keyParts.slice(0, 3).map((part, idx) => (
                        <span key={idx} className="text-[10px] font-mono bg-[#141514] text-[#AAAAAA] px-2 py-0.5 rounded">
                          {part}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Romanian National Normatives */}
          <section className="space-y-6">
            <div className="border-b border-[#1A1D1B] pb-3">
              <h2 className="text-xl md:text-2xl font-bold text-white font-mono flex items-center gap-2">
                <span className="text-[#C9A227]">02.</span> ROMANIAN TECHNICAL NORMATIVES (MDLPA / ISC)
              </h2>
              <p className="text-xs text-[#888888] mt-1">
                Mandatory national technical codes regulating seismic resistance, concrete execution, masonry, thermal performance, and construction quality.
              </p>
            </div>

            <div className="space-y-4">
              {nationalStandards.map((std, idx) => (
                <div key={idx} className="p-5 md:p-6 bg-[#0B0C0B] border border-[#1A1D1B] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold font-mono text-[#C9A227]">{std.code}</span>
                      <span className="text-[10px] font-mono text-[#888888] px-2 py-0.5 bg-[#141514] rounded">
                        {std.organization} ({std.year})
                      </span>
                      <span className="text-[9px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
                        {std.tier}
                      </span>
                    </div>

                    <h3 className="text-sm md:text-base font-bold text-white">{std.title}</h3>
                    <p className="text-xs text-[#AAAAAA] leading-relaxed">{std.scope}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
