import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import {
  getAllKnowledgeCategories,
  getAllMaterials,
  getConcreteClasses,
  getAllConstructionSystems,
  getAllGlossaryTerms,
  getAllStandards
} from '@/lib/knowledge-data';

export const metadata = {
  title: 'Construction Knowledge Base & Materials Intelligence | CONSTRUCTIONS by AiXLuxury',
  description: 'Factually verified construction engineering knowledge, structural materials, European & Romanian standards (Eurocodes, NE 012-1:2022, P100-1/2013), concrete strength classes, and technical glossary.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/knowledge'
  }
};

export default function KnowledgeHubPage() {
  const categories = getAllKnowledgeCategories();
  const materials = getAllMaterials();
  const concreteClasses = getConcreteClasses();
  const systems = getAllConstructionSystems();
  const glossary = getAllGlossaryTerms();
  const standards = getAllStandards();

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20 pb-20">
        {/* Hero Section */}
        <section className="py-12 md:py-20 border-b border-[#1A1D1B] bg-gradient-to-b from-[#0B0B0B] to-[#050505]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">
              <span className="px-2.5 py-1 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded">
                TECHNICAL INTELLIGENCE
              </span>
              <span>•</span>
              <span className="text-[#888888]">EUROCODES & NE 012-1:2022 COMPLIANT</span>
            </div>

            <div className="max-w-4xl space-y-4">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
                CONSTRUCTION KNOWLEDGE & MATERIALS INTELLIGENCE
              </h1>
              <p className="text-sm md:text-base text-[#A0A0A0] leading-relaxed">
                A rigorous, fact-based engineering knowledge layer covering the major structural materials, construction systems, standard classifications, execution lifecycles, and urban planning terminology across Romania’s built environment.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#1A1D1B] text-xs font-mono">
              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl">
                <span className="text-[10px] text-[#888888] block uppercase">MASTER CATEGORIES</span>
                <span className="text-xl md:text-2xl font-bold text-[#C9A227]">{categories.length} Families</span>
              </div>
              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl">
                <span className="text-[10px] text-[#888888] block uppercase">CONCRETE CLASSES</span>
                <span className="text-xl md:text-2xl font-bold text-[#38bdf8]">{concreteClasses.length} Grades (C8–C50)</span>
              </div>
              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl">
                <span className="text-[10px] text-[#888888] block uppercase">TECHNICAL GLOSSARY</span>
                <span className="text-xl md:text-2xl font-bold text-[#86efac]">{glossary.length} Verified Terms</span>
              </div>
              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl">
                <span className="text-[10px] text-[#888888] block uppercase">STANDARDS & CODES</span>
                <span className="text-xl md:text-2xl font-bold text-[#f59e0b]">{standards.length} Norms (Tier 1)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Primary Navigation Hub Modules */}
        <section className="py-12 md:py-16 border-b border-[#1A1D1B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#C9A227] uppercase tracking-widest block font-bold">
                  TECHNICAL SECTIONS
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
                  KNOWLEDGE BASE DIRECTORY
                </h2>
              </div>
              <Link
                href="/knowledge/compare"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#111111] hover:bg-[#1A1D1B] border border-[#C9A227]/40 text-[#C9A227] rounded-lg text-xs font-mono font-bold transition-colors w-fit"
              >
                <span>COMPARE MATERIALS</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: Concrete Section */}
              <Link
                href="/knowledge/concrete"
                className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl hover:border-[#38bdf8]/50 transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-2xl">
                    🏗️
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                    Concrete & Cement Engineering
                  </h3>
                  <p className="text-xs text-[#A0A0A0] leading-relaxed">
                    Comprehensive breakdown of concrete chemistry, water-cement ratios, workability classes (S1–S5), environmental exposure classes (XC, XD, XS, XF, XA), and the official strength class matrix (C8/10 to C50/60).
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1A1D1B] flex items-center justify-between text-xs font-mono text-[#38bdf8]">
                  <span>EXPLORE CONCRETE DOSSIER</span>
                  <span>→</span>
                </div>
              </Link>

              {/* Card 2: Materials Catalog */}
              <Link
                href="/knowledge/materials"
                className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl hover:border-[#C9A227]/50 transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-center justify-center text-2xl">
                    🧱
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#C9A227] transition-colors">
                    Materials Master Catalog
                  </h3>
                  <p className="text-xs text-[#A0A0A0] leading-relaxed">
                    Detailed technical dossiers across all 10 material categories: Structural Steel (BST 500S/B500C), Graphite EPS, Rock Mineral Wool, XPS, Ceramic Blocks, AAC/BCA, and Bituminous SBS/APP Membranes.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1A1D1B] flex items-center justify-between text-xs font-mono text-[#C9A227]">
                  <span>VIEW ALL MATERIALS ({materials.length})</span>
                  <span>→</span>
                </div>
              </Link>

              {/* Card 3: Construction Systems */}
              <Link
                href="/knowledge/systems"
                className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl hover:border-[#86efac]/50 transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#86efac]/10 border border-[#86efac]/30 flex items-center justify-center text-2xl">
                    🏢
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#86efac] transition-colors">
                    Construction Systems & Structural Principles
                  </h3>
                  <p className="text-xs text-[#A0A0A0] leading-relaxed">
                    Structural mechanics and Romanian seismic behavior (P100-1): Ductile Moment Frames, Shear Wall Systems (Diafragme), Confined Masonry (ZC), and Prefabricated Steel Frames.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1A1D1B] flex items-center justify-between text-xs font-mono text-[#86efac]">
                  <span>INSPECT STRUCTURAL SYSTEMS ({systems.length})</span>
                  <span>→</span>
                </div>
              </Link>

              {/* Card 4: Construction Processes */}
              <Link
                href="/knowledge/processes"
                className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl hover:border-[#f59e0b]/50 transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center text-2xl">
                    📋
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#f59e0b] transition-colors">
                    15-Stage Construction Process
                  </h3>
                  <p className="text-xs text-[#A0A0A0] leading-relaxed">
                    The complete building lifecycle from Geotechnical Excavation and Raft Foundations through Superstructure Pouring, Envelope ETICS, MEP Rough-in, to Blower Door nZEB Commissioning and ISC Reception.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1A1D1B] flex items-center justify-between text-xs font-mono text-[#f59e0b]">
                  <span>VIEW 15-STAGE LIFECYCLE</span>
                  <span>→</span>
                </div>
              </Link>

              {/* Card 5: Glossary */}
              <Link
                href="/knowledge/glossary"
                className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl hover:border-[#a855f7]/50 transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#a855f7]/10 border border-[#a855f7]/30 flex items-center justify-center text-2xl">
                    📖
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#a855f7] transition-colors">
                    Technical Glossary & Urbanism
                  </h3>
                  <p className="text-xs text-[#A0A0A0] leading-relaxed">
                    Clear, legally sourced definitions of Romanian urban planning & engineering terms: POT, CUT, AC, CU, RH (P+4/P+10), U-values, Thermal Bridges, Raft Foundations, and ETICS.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1A1D1B] flex items-center justify-between text-xs font-mono text-[#a855f7]">
                  <span>BROWSE GLOSSARY ({glossary.length} TERMS)</span>
                  <span>→</span>
                </div>
              </Link>

              {/* Card 6: Standards Registry */}
              <Link
                href="/knowledge/standards"
                className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-2xl hover:border-[#ec4899]/50 transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#ec4899]/10 border border-[#ec4899]/30 flex items-center justify-center text-2xl">
                    🏛️
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#ec4899] transition-colors">
                    Standards & Regulatory Lineage
                  </h3>
                  <p className="text-xs text-[#A0A0A0] leading-relaxed">
                    Official Tier 1 European Norms (Eurocodes EN 1990–1999, EN 206, EN 197-1) and Romanian Technical Regulations (NE 012-1, P100-1, CR 6, C 107, Legea 10/1995).
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1A1D1B] flex items-center justify-between text-xs font-mono text-[#ec4899]">
                  <span>VIEW STANDARDS REGISTRY</span>
                  <span>→</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Master Categories Grid */}
        <section className="py-12 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-8">
            <div>
              <span className="text-[10px] font-mono text-[#C9A227] uppercase tracking-widest block font-bold">
                MATERIAL DOMAINS
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
                10 MASTER MATERIAL CATEGORIES
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(cat => (
                <div
                  key={cat.id}
                  className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-[10px] font-mono text-[#888888] uppercase bg-[#1A1D1B] px-2 py-0.5 rounded">
                        {cat.itemCount} Verified Materials
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] font-mono text-[#C9A227]">
                      {cat.romanianName}
                    </p>
                    <p className="text-xs text-[#A0A0A0] leading-relaxed line-clamp-3">
                      {cat.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#1A1D1B] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#888888] text-[10px] truncate max-w-[180px]">
                      {cat.keyGoverningStandards[0]}
                    </span>
                    <Link
                      href={`/knowledge/materials?category=${cat.id}`}
                      className="text-[#C9A227] font-bold hover:underline shrink-0"
                    >
                      DOSSIERS →
                    </Link>
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
