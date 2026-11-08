import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  getAllKnowledgeCategories,
  getAllMaterials,
  getConcreteClasses,
  getAllConstructionSystems,
  getAllGlossaryTerms,
  getAllStandards,
  getAllInfrastructure,
  getAllEngineeringDomains
} from "@/lib/knowledge-data";
import { BuildingIcon, ShieldIcon, CraneIcon, TruckIcon, CogIcon, DocumentCheckIcon, BookIcon, LandmarkIcon } from "@/components/icons/NavIcons";
import { TechnicalCrossReference } from "@/components/TechnicalCrossReference";

export const metadata = {
  title: "Construction Knowledge Base & Materials Intelligence | CONSTRUCTIONS by AiXLuxury",
  description: "Comprehensive construction intelligence: structural materials, European Eurocodes (EN 1990-1999), CPR 2024, Romanian seismic norm P100-1, NE 012-1:2022 concrete matrix, civil infrastructure, and building physics.",
  alternates: {
    canonical: "https://constructions.cristianvaduva.com/knowledge"
  }
};

export default function KnowledgeHubPage() {
  const categories = getAllKnowledgeCategories();
  const materials = getAllMaterials();
  const concreteClasses = getConcreteClasses();
  const systems = getAllConstructionSystems();
  const glossary = getAllGlossaryTerms();
  const standards = getAllStandards();
  const infrastructure = getAllInfrastructure();
  const engineering = getAllEngineeringDomains();

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20 pb-20">
        {/* Hero Section */}
        <section className="py-12 md:py-20 border-b border-[#1A1D1B] bg-gradient-to-b from-[#0B0B0B] to-[#050505]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">
              <span className="px-2.5 py-1 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded">
                TECHNICAL INTELLIGENCE PLATFORM
              </span>
              <span>•</span>
              <span className="text-[#888888]">EUROCODES EN 1990-1999 & CPR 2024 COMPLIANT</span>
            </div>

            <div className="max-w-4xl space-y-4">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
                CONSTRUCTION KNOWLEDGE & MATERIALS INTELLIGENCE
              </h1>
              <p className="text-sm md:text-base text-[#A0A0A0] leading-relaxed">
                A rigorous, fact-based engineering knowledge system connecting structural materials, building systems, civil infrastructure, building physics, regulatory standards, execution processes, and urbanism across Romania’s built environment.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-6 border-t border-[#1A1D1B] text-xs font-mono">
              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl">
                <span className="text-[10px] text-[#888888] block uppercase">MASTER CATEGORIES</span>
                <span className="text-xl font-bold text-[#C9A227]">{categories.length} Families</span>
              </div>
              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl">
                <span className="text-[10px] text-[#888888] block uppercase">MATERIALS</span>
                <span className="text-xl font-bold text-white">{materials.length} Dossiers</span>
              </div>
              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl">
                <span className="text-[10px] text-[#888888] block uppercase">CONCRETE CLASSES</span>
                <span className="text-xl font-bold text-[#10B981]">{concreteClasses.length} Grades</span>
              </div>
              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl">
                <span className="text-[10px] text-[#888888] block uppercase">SYSTEMS</span>
                <span className="text-xl font-bold text-white">{systems.length} Types</span>
              </div>
              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl">
                <span className="text-[10px] text-[#888888] block uppercase">INFRASTRUCTURE</span>
                <span className="text-xl font-bold text-[#C9A227]">{infrastructure.length} Domains</span>
              </div>
              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl">
                <span className="text-[10px] text-[#888888] block uppercase">GLOSSARY</span>
                <span className="text-xl font-bold text-white">{glossary.length} Terms</span>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Cross-Reference Matrix */}
        <section className="py-12 border-b border-[#1A1D1B] bg-[#070807]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
            <div>
              <span className="text-[10px] font-mono text-[#C9A227] uppercase tracking-widest block font-bold">
                CONFORMITATE & CORELAȚIE REGLEMENTARĂ
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
                MATRICEA DE CORELARE TEHNICĂ: ETAPE, NORMATIVE & COMPANII
              </h2>
            </div>
            <TechnicalCrossReference />
          </div>
        </section>

        {/* Dedicated Sections Navigation Cards */}
        <section className="py-12 max-w-[1440px] mx-auto px-4 md:px-8 space-y-12">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white font-mono flex items-center gap-2">
              <span className="text-[#C9A227]">01.</span> KNOWLEDGE DIRECTORY & SPECIALIZED PORTALS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <Link
                href="/knowledge/materials"
                className="p-6 bg-[#0E0F0E] border border-[#1A1D1B] hover:border-[#C9A227]/40 rounded-2xl space-y-3 transition-all duration-300 group block"
              >
                <div className="flex items-center justify-between">
                  <BuildingIcon className="w-6 h-6 text-[#C9A227]" />
                  <span className="text-[10px] font-mono text-[#C9A227]">SPECS</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#C9A227] transition-colors">
                  Materials Catalog
                </h3>
                <p className="text-xs text-[#AAAAAA] leading-relaxed">
                  Deep technical dossiers covering concrete, steel, CLT timber, ceramic blocks, AAC, EPS/XPS, mineral wool, and membranes.
                </p>
                <div className="text-xs font-mono text-[#C9A227] pt-2">EXPLORE MATERIALS →</div>
              </Link>

              <Link
                href="/knowledge/concrete"
                className="p-6 bg-[#0E0F0E] border border-[#1A1D1B] hover:border-[#C9A227]/40 rounded-2xl space-y-3 transition-all duration-300 group block"
              >
                <div className="flex items-center justify-between">
                  <ShieldIcon className="w-6 h-6 text-[#10B981]" />
                  <span className="text-[10px] font-mono text-[#10B981]">SR EN 206</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#C9A227] transition-colors">
                  Concrete &amp; Cement
                </h3>
                <p className="text-xs text-[#AAAAAA] leading-relaxed">
                  Strength classes C8/10 to C50/60, cement hydration chemistry, w/c ratios, and exposure classes XC, XD, XS, XF, XA.
                </p>
                <div className="text-xs font-mono text-[#C9A227] pt-2">VIEW CONCRETE MATRIX →</div>
              </Link>

              <Link
                href="/knowledge/systems"
                className="p-6 bg-[#0E0F0E] border border-[#1A1D1B] hover:border-[#C9A227]/40 rounded-2xl space-y-3 transition-all duration-300 group block"
              >
                <div className="flex items-center justify-between">
                  <CraneIcon className="w-6 h-6 text-[#C9A227]" />
                  <span className="text-[10px] font-mono text-[#C9A227]">P100-1 SEISMIC</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#C9A227] transition-colors">
                  Structural Systems
                </h3>
                <p className="text-xs text-[#AAAAAA] leading-relaxed">
                  RC frame mechanics, shear walls (diafragme), steel frames, confined masonry (ZNA), and CLT mass timber systems.
                </p>
                <div className="text-xs font-mono text-[#C9A227] pt-2">ANALYSIS &amp; DUCTILITY →</div>
              </Link>

              <Link
                href="/knowledge/infrastructure"
                className="p-6 bg-[#0E0F0E] border border-[#1A1D1B] hover:border-[#C9A227]/40 rounded-2xl space-y-3 transition-all duration-300 group block"
              >
                <div className="flex items-center justify-between">
                  <TruckIcon className="w-6 h-6 text-[#C9A227]" />
                  <span className="text-[10px] font-mono text-[#C9A227]">CIVIL WORKS</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#C9A227] transition-colors">
                  Civil Infrastructure
                </h3>
                <p className="text-xs text-[#AAAAAA] leading-relaxed">
                  Highways &amp; flexible asphalt pavements (AND 605), long-span bridges, underground tunnels, and railway track systems.
                </p>
                <div className="text-xs font-mono text-[#C9A227] pt-2">HEAVY INFRASTRUCTURE →</div>
              </Link>

              <Link
                href="/knowledge/engineering"
                className="p-6 bg-[#0E0F0E] border border-[#1A1D1B] hover:border-[#C9A227]/40 rounded-2xl space-y-3 transition-all duration-300 group block"
              >
                <div className="flex items-center justify-between">
                  <CogIcon className="w-6 h-6 text-[#C9A227]" />
                  <span className="text-[10px] font-mono text-[#C9A227]">PHYSICS</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#C9A227] transition-colors">
                  Building Physics &amp; Fire
                </h3>
                <p className="text-xs text-[#AAAAAA] leading-relaxed">
                  Geotechnical mechanics, U-values &amp; thermal bridges, fire safety (reaction A1-F vs. resistance REI), and acoustics (Rw).
                </p>
                <div className="text-xs font-mono text-[#C9A227] pt-2">ENGINEERING PRINCIPLES →</div>
              </Link>

              <Link
                href="/knowledge/processes"
                className="p-6 bg-[#0E0F0E] border border-[#1A1D1B] hover:border-[#C9A227]/40 rounded-2xl space-y-3 transition-all duration-300 group block"
              >
                <div className="flex items-center justify-between">
                  <DocumentCheckIcon className="w-6 h-6 text-[#C9A227]" />
                  <span className="text-[10px] font-mono text-[#C9A227]">PVLA / CARTE</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#C9A227] transition-colors">
                  15-Stage Execution
                </h3>
                <p className="text-xs text-[#AAAAAA] leading-relaxed">
                  Sequential execution guide from geotechnical excavation to superstructure framing, MEP rough-in, and reception under Legea 10/1995.
                </p>
                <div className="text-xs font-mono text-[#C9A227] pt-2">VIEW EXECUTION PHASES →</div>
              </Link>

              <Link
                href="/knowledge/standards"
                className="p-6 bg-[#0E0F0E] border border-[#1A1D1B] hover:border-[#C9A227]/40 rounded-2xl space-y-3 transition-all duration-300 group block"
              >
                <div className="flex items-center justify-between">
                  <BookIcon className="w-6 h-6 text-[#10B981]" />
                  <span className="text-[10px] font-mono text-[#10B981]">EN 1990 - 1999</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#C9A227] transition-colors">
                  Standards &amp; Eurocodes
                </h3>
                <p className="text-xs text-[#AAAAAA] leading-relaxed">
                  The 10 Eurocode families, 2nd Gen transition roadmap, CPR 2024 regulation, and Romanian national normatives.
                </p>
                <div className="text-xs font-mono text-[#C9A227] pt-2">STANDARDS REGISTRY →</div>
              </Link>

              <Link
                href="/knowledge/lifecycle"
                className="p-6 bg-[#0E0F0E] border border-[#1A1D1B] hover:border-[#C9A227]/40 rounded-2xl space-y-3 transition-all duration-300 group block"
              >
                <div className="flex items-center justify-between">
                  <LandmarkIcon className="w-6 h-6 text-[#C9A227]" />
                  <span className="text-[10px] font-mono text-[#C9A227]">DELIVERY</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#C9A227] transition-colors">
                  Lifecycle &amp; Machinery
                </h3>
                <p className="text-xs text-[#AAAAAA] leading-relaxed">
                  Development delivery lifecycle (hard vs. soft costs, permitting) and heavy construction equipment technical capacities.
                </p>
                <div className="text-xs font-mono text-[#C9A227] pt-2">LIFECYCLE &amp; EQUIPMENT →</div>
              </Link>
            </div>
          </div>

          {/* Master Categories Grid */}
          <div className="space-y-6 pt-6 border-t border-[#1A1D1B]">
            <div className="border-b border-[#1A1D1B] pb-3">
              <h2 className="text-xl md:text-2xl font-bold text-white font-mono flex items-center gap-2">
                <span className="text-[#C9A227]">02.</span> MASTER MATERIAL FAMILIES
              </h2>
              <p className="text-xs text-[#888888] mt-1">
                Standardized classification across civil engineering and building envelope technologies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => (
                <div key={cat.id} className="p-6 bg-[#0B0C0B] border border-[#1A1D1B] rounded-2xl space-y-4 hover:border-[#C9A227]/40 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <BuildingIcon className="w-5 h-5 text-[#C9A227]" />
                    <span className="text-[10px] font-mono text-[#C9A227]">FAMILY</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">{cat.name}</h3>
                    <p className="text-xs font-mono text-[#888888] mt-0.5">RO: {cat.romanianName}</p>
                  </div>

                  <p className="text-xs text-[#AAAAAA] leading-relaxed">{cat.shortDescription}</p>

                  <div className="pt-2 border-t border-[#1A1D1B] flex items-center justify-between">
                    <Link
                      href={`/knowledge/materials?category=${cat.id}`}
                      className="text-xs font-mono text-[#C9A227] hover:underline"
                    >
                      VIEW DOSSIERS →
                    </Link>
                    <span className="text-[10px] font-mono text-[#666666]">
                      {cat.keyGoverningStandards[0]}
                    </span>
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
