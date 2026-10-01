const fs = require('fs');
const path = require('path');

const materialSlugPage = `import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getAllMaterials, getMaterialBySlug } from "@/lib/knowledge-data";

export async function generateStaticParams() {
  const materials = getAllMaterials();
  return materials.map((m) => ({
    slug: m.slug,
  }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const material = getMaterialBySlug(params.slug);
  if (!material) return { title: "Material Not Found | CONSTRUCTIONS" };

  return {
    title: \`\${material.name} (\${material.romanianName}) - Construction Material Intelligence | CONSTRUCTIONS\`,
    description: \`Technical properties, European Eurocodes and Romanian standards (\${material.governingStandards.join(", ")}), advantages and applications for \${material.name}.\`,
    alternates: {
      canonical: \`https://constructions.cristianvaduva.com/knowledge/materials/\${material.slug}\`,
    },
  };
}

export default async function MaterialDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const material = getMaterialBySlug(params.slug);
  if (!material) notFound();

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": \`\${material.name} - Technical Material Intelligence Dossier\`,
    "description": material.summary,
    "inLanguage": "en-US",
    "author": {
      "@type": "Organization",
      "name": "CONSTRUCTIONS by AiXLuxury"
    },
    "publisher": {
      "@type": "Organization",
      "name": "CONSTRUCTIONS Intelligence Platform",
      "url": "https://constructions.cristianvaduva.com"
    },
    "about": {
      "@type": "Product",
      "name": material.name,
      "category": material.categoryName
    }
  };

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="pt-20 pb-20">
        {/* Breadcrumb & Hero */}
        <section className="py-8 md:py-12 border-b border-[#1A1D1B] bg-gradient-to-b from-[#0C0D0C] to-[#050505]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#888888] flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">HOME</Link>
              <span>/</span>
              <Link href="/knowledge" className="hover:text-white transition-colors">KNOWLEDGE</Link>
              <span>/</span>
              <Link href="/knowledge/materials" className="hover:text-white transition-colors">MATERIALS</Link>
              <span>/</span>
              <span className="text-[#C9A227]">{material.name.toUpperCase()}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2.5 py-1 bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] text-[10px] font-mono uppercase tracking-widest rounded">
                {material.categoryName}
              </span>
              <span className="px-2.5 py-1 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-[10px] font-mono uppercase tracking-widest rounded flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                STATUS: {material.sourceStatus}
              </span>
              <span className="text-[11px] font-mono text-[#777777]">
                TIER: {material.sourceTier}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              {material.name}
            </h1>
            <p className="text-sm font-mono text-[#C9A227]">
              Romanian Technical Denomination: <span className="text-white font-semibold">{material.romanianName}</span>
            </p>
            <p className="text-sm md:text-base text-[#B0B0B0] max-w-4xl leading-relaxed">
              {material.summary}
            </p>
          </div>
        </section>

        {/* Dual-Level Material Dossier: Executive View & Technical View */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main 2-column content */}
          <div className="lg:col-span-2 space-y-8">
            {/* LEVEL 1: QUICK UNDERSTANDING (EXPLAIN LIKE A PROFESSIONAL) */}
            <section className="p-6 md:p-8 bg-[#0E0F0E] border border-[#C9A227]/30 rounded-2xl space-y-5">
              <div className="border-b border-[#1A1D1B] pb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#C9A227] font-mono tracking-wider uppercase">
                  LEVEL 1: QUICK UNDERSTANDING (EXECUTIVE SUMMARY)
                </h2>
                <span className="text-[10px] font-mono text-[#888888]">INVESTORS & DEVELOPERS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-[#141514] rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-[#C9A227] block font-bold uppercase">What is it?</span>
                  <p className="text-[#CCCCCC] leading-relaxed">{material.summary}</p>
                </div>

                <div className="p-3.5 bg-[#141514] rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-[#10B981] block font-bold uppercase">Where is it used?</span>
                  <p className="text-[#CCCCCC] leading-relaxed">{material.typicalApplications.slice(0, 2).join(", ")}</p>
                </div>
              </div>
            </section>

            {/* LEVEL 2: TECHNICAL DEEP DIVE */}
            <section className="p-6 md:p-8 bg-[#0B0C0B] border border-[#1A1D1B] rounded-2xl space-y-4">
              <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2 border-b border-[#1A1D1B] pb-3">
                <span className="text-[#C9A227]">01.</span> TECHNICAL OVERVIEW & ENGINEERING CHARACTERISTICS
              </h2>
              <p className="text-sm text-[#CCCCCC] leading-relaxed">
                {material.technicalDescription}
              </p>
            </section>

            {/* Constituents & Manufacturing */}
            <section className="p-6 md:p-8 bg-[#0B0C0B] border border-[#1A1D1B] rounded-2xl space-y-4">
              <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2 border-b border-[#1A1D1B] pb-3">
                <span className="text-[#C9A227]">02.</span> CONSTITUENTS & MANUFACTURING SPECIFICATION
              </h2>
              <ul className="space-y-2.5 text-sm text-[#CCCCCC]">
                {material.compositionAndManufacture.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-[#C9A227] font-mono text-xs mt-1">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Advantages & Limitations Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <section className="p-6 bg-[#0B0C0B] border border-[#10B981]/20 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-[#10B981] font-mono flex items-center gap-2">
                  <span>✓</span> ADVANTAGES & STRENGTHS
                </h3>
                <ul className="space-y-2 text-xs text-[#CCCCCC]">
                  {material.advantages.map((adv, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#10B981]">•</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="p-6 bg-[#0B0C0B] border border-[#EF4444]/20 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-[#EF4444] font-mono flex items-center gap-2">
                  <span>⚠</span> LIMITATIONS & RISK FACTORS
                </h3>
                <ul className="space-y-2 text-xs text-[#CCCCCC]">
                  {material.limitations.map((lim, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#EF4444]">•</span>
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Applications */}
            <section className="p-6 md:p-8 bg-[#0B0C0B] border border-[#1A1D1B] rounded-2xl space-y-4">
              <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2 border-b border-[#1A1D1B] pb-3">
                <span className="text-[#C9A227]">03.</span> ARCHITECTURAL & STRUCTURAL USE CASES
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {material.typicalApplications.map((app, idx) => (
                  <div key={idx} className="p-3.5 bg-[#111111] border border-[#1A1D1B] rounded-xl flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]"></span>
                    <span className="text-[#DDDDDD]">{app}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar: Verified Physical Properties & Standards */}
          <div className="space-y-6">
            {/* Physical Properties Table */}
            <div className="p-6 bg-[#0E0F0E] border border-[#C9A227]/30 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
                <h3 className="text-sm font-bold text-white font-mono">
                  PHYSICAL & MECHANICAL PROPERTIES
                </h3>
                <span className="text-[10px] font-mono text-[#C9A227]">STANDARDIZED</span>
              </div>

              <div className="space-y-3">
                {material.keyProperties.map((prop, idx) => (
                  <div key={idx} className="p-3 bg-[#141514] border border-[#1E201E] rounded-xl space-y-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-xs text-[#888888] font-mono">{prop.label}</span>
                      <span className="text-[9px] font-mono text-[#4ADE80] bg-[#4ADE80]/10 px-1.5 py-0.5 rounded">
                        {prop.status}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white font-mono">
                      {prop.value} {prop.unit && <span className="text-xs text-[#C9A227] font-normal">{prop.unit}</span>}
                    </div>
                    {prop.standardReference && (
                      <div className="text-[10px] text-[#666666] font-mono">
                        Ref: {prop.standardReference}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Governing Standards Registry Box */}
            <div className="p-6 bg-[#0B0C0B] border border-[#1A1D1B] rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white font-mono border-b border-[#1A1D1B] pb-3">
                GOVERNING NORMATIVES & EUROCODES
              </h3>
              <div className="space-y-2">
                {material.governingStandards.map((std, idx) => (
                  <div key={idx} className="p-2.5 bg-[#121312] border border-[#1E201E] rounded-lg text-xs font-mono text-[#C9A227] flex items-center gap-2">
                    <span>§</span>
                    <span>{std}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Source Truth & Verification Metadata */}
            <div className="p-5 bg-[#090A09] border border-[#1A1D1B] rounded-2xl space-y-3 text-xs font-mono">
              <div className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">
                SOURCE TRUTH & VERIFICATION
              </div>
              <div className="text-[#AAAAAA] space-y-1">
                <div><span className="text-[#666666]">Primary Ref:</span> {material.primaryReference}</div>
                <div><span className="text-[#666666]">Verified Date:</span> {material.verifiedAt}</div>
                <div><span className="text-[#666666]">Hierarchy:</span> {material.sourceTier}</div>
              </div>
            </div>

            {/* Back Button */}
            <Link
              href="/knowledge/materials"
              className="w-full py-3 bg-[#141514] border border-[#222222] hover:border-[#C9A227] text-white text-center rounded-xl text-xs font-mono block transition-colors"
            >
              ← RETURN TO MATERIALS CATALOG
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
`;

fs.writeFileSync(path.join(process.cwd(), "app/knowledge/materials/[slug]/page.tsx"), materialSlugPage);
console.log("Updated materials/[slug]/page.tsx with dual view");
