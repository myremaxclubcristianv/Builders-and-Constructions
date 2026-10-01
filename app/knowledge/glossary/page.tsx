import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getAllGlossaryTerms } from "@/lib/knowledge-data";

export const metadata = {
  title: "Construction & Urbanism Glossary | CONSTRUCTIONS Knowledge Base",
  description: "Official engineering and urban planning terminology in Romanian and European practice: POT, CUT, P+1, RH, AC, U-value, thermal bridge, raft foundation, PVLA, Carte Tehnica.",
  alternates: {
    canonical: "https://constructions.cristianvaduva.com/knowledge/glossary"
  }
};

export default async function GlossaryPage(props: {
  searchParams?: Promise<{ q?: string; category?: string }>;
}) {
  const searchParams = await props.searchParams;
  const allTerms = getAllGlossaryTerms();
  const query = searchParams?.q?.toLowerCase() || "";
  const selectedCat = searchParams?.category || "";

  const filteredTerms = allTerms.filter((term) => {
    const matchesQuery =
      !query ||
      term.term.toLowerCase().includes(query) ||
      term.romanianTerm.toLowerCase().includes(query) ||
      (term.fullAcronymName && term.fullAcronymName.toLowerCase().includes(query)) ||
      term.definition.toLowerCase().includes(query);

    const matchesCat = !selectedCat || term.category === selectedCat;

    return matchesQuery && matchesCat;
  });

  const categories = [
    "URBANISM & PERMITTING",
    "STRUCTURAL ENGINEERING",
    "MATERIALS & TESTING",
    "ENERGY & BUILDING PHYSICS",
    "EXECUTION & SITE MANAGEMENT",
  ];

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
              <span className="text-[#C9A227]">TECHNICAL GLOSSARY</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#C9A227]">
              <span className="px-2.5 py-1 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded">
                TECHNICAL DICTIONARY ({allTerms.length} TERMS)
              </span>
              <span>•</span>
              <span className="px-2.5 py-1 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] rounded">
                REGULATORY & STRUCTURAL DEFINITIONS
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              CONSTRUCTION & URBAN PLANNING GLOSSARY
            </h1>
            <p className="text-sm md:text-base text-[#B0B0B0] max-w-4xl leading-relaxed">
              Standardized architectural, structural, and regulatory definitions. Clarifies essential abbreviations (POT, CUT, RH, AC), building physics metrics (U-value, thermal bridges), and Romanian construction law frameworks (Legea 50/1991, Legea 10/1995).
            </p>

            {/* Filter pills */}
            <div className="pt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <Link
                href="/knowledge/glossary"
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all border ${
                  !selectedCat
                    ? "bg-[#C9A227] text-black border-[#C9A227] font-semibold"
                    : "bg-[#111111] text-[#A0A0A0] border-[#1A1D1B] hover:text-white hover:border-[#333333]"
                }`}
              >
                ALL ({allTerms.length})
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/knowledge/glossary?category=${encodeURIComponent(cat)}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all border ${
                    selectedCat === cat
                      ? "bg-[#C9A227] text-black border-[#C9A227] font-semibold"
                      : "bg-[#111111] text-[#A0A0A0] border-[#1A1D1B] hover:text-white hover:border-[#333333]"
                  }`}
                >
                  {cat} ({allTerms.filter((t) => t.category === cat).length})
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Glossary Terms Grid */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTerms.map((t) => (
              <div
                key={t.slug}
                className="p-5 bg-[#0B0C0B] border border-[#1A1D1B] rounded-xl flex flex-col justify-between space-y-4 hover:border-[#C9A227]/40 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-[#C9A227] px-2 py-0.5 bg-[#C9A227]/10 border border-[#C9A227]/20 rounded truncate">
                      {t.category}
                    </span>
                    <span className="text-[9px] font-mono text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded shrink-0">
                      {t.sourceStatus}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-white font-mono flex items-baseline gap-2">
                      <span>{t.term}</span>
                      {t.fullAcronymName && (
                        <span className="text-xs text-[#888888] font-normal font-sans">
                          ({t.fullAcronymName})
                        </span>
                      )}
                    </h2>
                    <p className="text-xs font-mono text-[#AAAAAA] mt-0.5">RO: {t.romanianTerm}</p>
                  </div>

                  <p className="text-xs text-[#CCCCCC] leading-relaxed">
                    {t.definition}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-[#1A1D1B] text-xs">
                  <div className="p-2.5 bg-[#111211] rounded-lg space-y-1">
                    <span className="text-[10px] font-mono text-[#C9A227] block font-bold uppercase">
                      Practical Application:
                    </span>
                    <p className="text-[#AAAAAA] text-[11px] leading-relaxed">
                      {t.practicalApplication}
                    </p>
                  </div>

                  {t.regulatoryContext && (
                    <div className="text-[10px] font-mono text-[#666666]">
                      Legal Ref: <span className="text-[#888888]">{t.regulatoryContext}</span>
                    </div>
                  )}
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
