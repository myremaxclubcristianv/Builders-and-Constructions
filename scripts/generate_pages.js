const fs = require('fs');
const path = require('path');

// 1. app/knowledge/infrastructure/page.tsx
const infraPage = `import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getAllInfrastructure } from "@/lib/knowledge-data";

export const metadata = {
  title: "Civil Infrastructure Intelligence: Roads, Bridges, Tunnels & Utilities | CONSTRUCTIONS",
  description: "Technical intelligence on civil infrastructure in Romania: flexible asphalt highways (AND 605), prestressed bridges, underground TBM/NATM tunnels, railway permanent way, and municipal utility networks.",
  alternates: {
    canonical: "https://constructions.cristianvaduva.com/knowledge/infrastructure"
  }
};

export default function InfrastructureKnowledgePage() {
  const infraItems = getAllInfrastructure();

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
              <span className="text-[#C9A227]">CIVIL INFRASTRUCTURE</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#C9A227]">
              <span className="px-2.5 py-1 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded">
                HIGHWAY, RAIL, BRIDGES & MUNICIPAL SYSTEMS
              </span>
              <span>•</span>
              <span className="px-2.5 py-1 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] rounded">
                TIER 1 CNAIR & CFR NORMATIVES
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              CIVIL INFRASTRUCTURE & HEAVY ENGINEERING
            </h1>
            <p className="text-sm md:text-base text-[#B0B0B0] max-w-4xl leading-relaxed">
              Technical specifications, multi-layered pavement hierarchies, structural bridge spans, mechanized tunnel linings, and municipal utility networks governing transportation and public works.
            </p>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 space-y-8">
          {infraItems.map((item) => (
            <div
              key={item.id}
              className="p-6 md:p-8 bg-[#0B0C0B] border border-[#1A1D1B] rounded-2xl space-y-6 hover:border-[#C9A227]/40 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1A1D1B] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#C9A227] uppercase tracking-widest px-2.5 py-1 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded">
                    DOMAIN: {item.domain}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-white mt-2">
                    {item.title}
                  </h2>
                  <p className="text-xs font-mono text-[#888888] mt-0.5">RO: {item.romanianTitle}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 self-start md:self-auto">
                  {item.designStandards.map((std, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-[#141514] border border-[#222222] text-[11px] font-mono text-[#C9A227] rounded">
                      {std}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs md:text-sm text-[#CCCCCC] leading-relaxed">
                  {item.technicalDescription}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="p-4 bg-[#111211] border border-[#1A1D1B] rounded-xl space-y-2">
                  <h3 className="text-xs font-mono font-bold text-[#C9A227] uppercase">
                    Key Engineered Components
                  </h3>
                  <ul className="space-y-1.5 text-xs text-[#BBBBBB]">
                    {item.keyComponents.map((comp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#C9A227] mt-0.5">▸</span>
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-[#111211] border border-[#10B981]/20 rounded-xl space-y-2">
                  <h3 className="text-xs font-mono font-bold text-[#10B981] uppercase">
                    Mandatory Quality & Proof Testing
                  </h3>
                  <ul className="space-y-1.5 text-xs text-[#BBBBBB]">
                    {item.criticalQualityControls.map((qc, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#10B981] mt-0.5">✓</span>
                        <span>{qc}</span>
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
`;

// 2. app/knowledge/engineering/page.tsx
const engPage = `import Link from "next/link";
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
`;

// 3. app/knowledge/lifecycle/page.tsx
const lifecyclePage = `import Link from "next/link";
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
`;

// 4. app/knowledge/sources/page.tsx
const sourcesPage = `import Link from "next/link";
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
`;

fs.writeFileSync(path.join(process.cwd(), "app/knowledge/infrastructure/page.tsx"), infraPage);
fs.writeFileSync(path.join(process.cwd(), "app/knowledge/engineering/page.tsx"), engPage);
fs.writeFileSync(path.join(process.cwd(), "app/knowledge/lifecycle/page.tsx"), lifecyclePage);
fs.writeFileSync(path.join(process.cwd(), "app/knowledge/sources/page.tsx"), sourcesPage);

console.log("Successfully generated infrastructure, engineering, lifecycle, and sources pages!");
