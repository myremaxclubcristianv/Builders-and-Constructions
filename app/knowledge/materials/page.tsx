import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getAllMaterials, getAllKnowledgeCategories, KnowledgeCategoryId } from "@/lib/knowledge-data";

export const metadata = {
  title: "Construction Materials Catalog | CONSTRUCTIONS by AiXLuxury",
  description: "Comprehensive technical catalog of construction materials: structural concrete, steel, timber, ceramic blocks, AAC, EPS/XPS insulation, mineral wool, waterproofing membranes, facade systems.",
  alternates: {
    canonical: "https://constructions.cristianvaduva.com/knowledge/materials"
  }
};

export default async function MaterialsCatalogPage(props: {
  searchParams?: Promise<{ category?: string }>;
}) {
  const searchParams = await props.searchParams;
  const allMaterials = getAllMaterials();
  const categories = getAllKnowledgeCategories();
  const selectedCategory = searchParams?.category as KnowledgeCategoryId | undefined;

  const filteredMaterials = selectedCategory
    ? allMaterials.filter((m) => m.category === selectedCategory)
    : allMaterials;

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20 pb-20">
        {/* Header Breadcrumb */}
        <section className="py-8 md:py-12 border-b border-[#1A1D1B] bg-gradient-to-b from-[#0C0D0C] to-[#050505]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#888888]">
              <Link href="/" className="hover:text-white transition-colors">HOME</Link>
              <span>/</span>
              <Link href="/knowledge" className="hover:text-white transition-colors">KNOWLEDGE</Link>
              <span>/</span>
              <span className="text-[#C9A227]">MATERIALS CATALOG</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              CONSTRUCTION MATERIALS CATALOG
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-3xl leading-relaxed">
              Technical specifications, physical properties, standard governing codes, and architectural applications for major construction materials verified under European (EN) and Romanian (NE/CR/C) norms.
            </p>

            {/* Category Filter Pills (Mobile Scrollable) */}
            <div className="pt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <Link
                href="/knowledge/materials"
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all border ${
                  !selectedCategory
                    ? "bg-[#C9A227] text-black border-[#C9A227] font-semibold"
                    : "bg-[#111111] text-[#A0A0A0] border-[#1A1D1B] hover:text-white hover:border-[#333333]"
                }`}
              >
                ALL MATERIALS ({allMaterials.length})
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/knowledge/materials?category=${cat.id}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all border ${
                    selectedCategory === cat.id
                      ? "bg-[#C9A227] text-black border-[#C9A227] font-semibold"
                      : "bg-[#111111] text-[#A0A0A0] border-[#1A1D1B] hover:text-white hover:border-[#333333]"
                  }`}
                >
                  {cat.name.toUpperCase()} ({allMaterials.filter((m) => m.category === cat.id).length})
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Materials Grid */}
        <section className="py-8 max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMaterials.map((mat) => (
              <div
                key={mat.id}
                className="group flex flex-col justify-between p-6 bg-[#0E0F0E] border border-[#1A1D1B] hover:border-[#C9A227]/40 rounded-xl transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] px-2 py-0.5 bg-[#C9A227]/10 border border-[#C9A227]/20 rounded">
                      {mat.categoryName}
                    </span>
                    <span className="text-[10px] font-mono text-[#4ADE80] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse"></span>
                      {mat.sourceStatus}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white group-hover:text-[#C9A227] transition-colors">
                      <Link href={`/knowledge/materials/${mat.slug}`}>
                        {mat.name}
                      </Link>
                    </h2>
                    <p className="text-xs text-[#888888] font-mono mt-0.5">RO: {mat.romanianName}</p>
                  </div>

                  <p className="text-xs text-[#A0A0A0] leading-relaxed line-clamp-3">
                    {mat.summary}
                  </p>

                  {/* Key Properties Snapshot */}
                  <div className="space-y-1.5 pt-2 border-t border-[#1A1D1B] text-xs font-mono">
                    {mat.keyProperties.slice(0, 3).map((prop, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px]">
                        <span className="text-[#777777] truncate pr-2">{prop.label}:</span>
                        <span className="text-white font-medium text-right shrink-0">{prop.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-[#1A1D1B] flex items-center justify-between">
                  <div className="text-[10px] font-mono text-[#666666]">
                    STANDARDS: <span className="text-[#888888]">{mat.governingStandards[0] || "EN / Eurocode"}</span>
                  </div>
                  <Link
                    href={`/knowledge/materials/${mat.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-mono text-[#C9A227] hover:underline"
                  >
                    DOSSIER →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
