import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getConcreteClasses, getAllStandards } from "@/lib/knowledge-data";

export const metadata = {
  title: "Concrete Engineering & Cement Chemistry | CONSTRUCTIONS Knowledge Base",
  description: "Comprehensive technical reference on concrete strength classes (C8/10 to C50/60), cement types (CEM I - CEM V), exposure classes (XC, XD, XS, XF, XA), water/cement ratio, and curing rules under SR EN 206:2021 and NE 012-1:2022.",
  alternates: {
    canonical: "https://constructions.cristianvaduva.com/knowledge/concrete"
  }
};

export default function ConcreteDeepDivePage() {
  const concreteClasses = getConcreteClasses();
  const allStandards = getAllStandards().filter(s => s.code.includes("EN 206") || s.code.includes("NE 012") || s.code.includes("EN 197"));

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20 pb-20">
        {/* Breadcrumb & Hero */}
        <section className="py-8 md:py-16 border-b border-[#1A1D1B] bg-gradient-to-b from-[#0E100E] to-[#050505]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#888888] flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">HOME</Link>
              <span>/</span>
              <Link href="/knowledge" className="hover:text-white transition-colors">KNOWLEDGE</Link>
              <span>/</span>
              <span className="text-[#C9A227]">CONCRETE & CEMENT TECHNOLOGY</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#C9A227]">
              <span className="px-2.5 py-1 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded">
                SR EN 206:2021 + A2:2021
              </span>
              <span>•</span>
              <span className="px-2.5 py-1 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] rounded">
                NE 012-1:2022 NATIONAL CODE
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
              CONCRETE & CEMENT ENGINEERING
            </h1>
            <p className="text-sm md:text-base text-[#B0B0B0] max-w-4xl leading-relaxed">
              Standardized compressive strength classes (C8/10 to C50/60), cement hydration chemistry, water-cement ratios ($w/c$), environmental exposure classes (XC, XD, XS, XF, XA), and mandatory site curing protocols under Romanian and European civil engineering codes.
            </p>
          </div>
        </section>

        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 space-y-12">
          {/* Section 1: Fundamental Composition & Role of Components */}
          <section className="space-y-6">
            <div className="border-b border-[#1A1D1B] pb-4">
              <h2 className="text-xl md:text-2xl font-bold text-white font-mono flex items-center gap-2">
                <span className="text-[#C9A227]">01.</span> CONCRETE COMPOSITION & THE 4 FUNDAMENTAL PILLARS
              </h2>
              <p className="text-xs md:text-sm text-[#888888] mt-1">
                Concrete is an engineered composite material created by the hydration reaction of cementitious binder binding coarse and fine mineral aggregates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-[#0E0F0E] border border-[#1A1D1B] rounded-xl space-y-2">
                <span className="text-xs font-mono text-[#C9A227] block font-bold">1. HYDRAULIC CEMENT</span>
                <p className="text-xs text-[#CCCCCC] leading-relaxed">
                  Portland cement clinker (alite $C3S$, belite $C2S$, aluminate $C3A$, ferrite $C4AF$) reacting with water to form Calcium-Silicate-Hydrate ($C-S-H$) gel, providing mechanical adhesion and compressive load resistance.
                </p>
              </div>

              <div className="p-5 bg-[#0E0F0E] border border-[#1A1D1B] rounded-xl space-y-2">
                <span className="text-xs font-mono text-[#C9A227] block font-bold">2. GRADED AGGREGATES</span>
                <p className="text-xs text-[#CCCCCC] leading-relaxed">
                  Comprising 70–80% of total concrete volume. Sand (0–4mm), gravel (4–16mm), and crushed rock (16–31.5mm) providing structural volume stability, wear resistance, and minimizing drying shrinkage.
                </p>
              </div>

              <div className="p-5 bg-[#0E0F0E] border border-[#1A1D1B] rounded-xl space-y-2">
                <span className="text-xs font-mono text-[#C9A227] block font-bold">3. MIXING WATER & W/C RATIO</span>
                <p className="text-xs text-[#CCCCCC] leading-relaxed">
                  Potable water compliant with SR EN 1008. The Water-to-Cement ratio ($w/c$) is the governing determinant of durability and compressive strength: lower $w/c$ (&lt; 0.45) dramatically reduces capillary porosity.
                </p>
              </div>

              <div className="p-5 bg-[#0E0F0E] border border-[#1A1D1B] rounded-xl space-y-2">
                <span className="text-xs font-mono text-[#C9A227] block font-bold">4. CHEMICAL ADMIXTURES</span>
                <p className="text-xs text-[#CCCCCC] leading-relaxed">
                  Superplasticizers (polycarboxylates for high workability without extra water), air-entraining agents for freeze-thaw protection (XF classes), set accelerators/retarders, and silica fume for high-performance concrete (HPC).
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Interactive/Structured Concrete Strength Classes Matrix */}
          <section className="space-y-6">
            <div className="border-b border-[#1A1D1B] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white font-mono flex items-center gap-2">
                  <span className="text-[#C9A227]">02.</span> CONCRETE STRENGTH CLASSES (SR EN 206 & NE 012-1:2022)
                </h2>
                <p className="text-xs md:text-sm text-[#888888] mt-1">
                  Designation format <span className="text-white font-mono font-bold">CXX/YY</span> indicates: f_ck,cyl (cylinder strength in $N/mm^2$) / f_ck,cube (cube strength in $N/mm^2$) measured at 28 days.
                </p>
              </div>
              <span className="text-xs font-mono text-[#10B981] px-3 py-1 bg-[#10B981]/10 border border-[#10B981]/30 rounded self-start md:self-auto">
                100% FACTUAL NORMATIVE VALUES
              </span>
            </div>

            {/* Desktop Table / Mobile Responsive Cards */}
            <div className="hidden md:block overflow-x-auto border border-[#1A1D1B] rounded-xl">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="bg-[#111111] text-[#C9A227] border-b border-[#1A1D1B]">
                  <tr>
                    <th className="p-3.5">CLASS (CXX/YY)</th>
                    <th className="p-3.5">f_ck,cyl (N/mm²)</th>
                    <th className="p-3.5">f_ck,cube (N/mm²)</th>
                    <th className="p-3.5">MAX w/c</th>
                    <th className="p-3.5">MIN CEMENT (kg/m³)</th>
                    <th className="p-3.5">EXPOSURE CLASSES</th>
                    <th className="p-3.5">TYPICAL APPLICATION IN ROMANIA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1D1B] text-[#CCCCCC]">
                  {concreteClasses.map((cls, idx) => (
                    <tr key={idx} className="hover:bg-[#0E0F0E] transition-colors">
                      <td className="p-3.5 font-bold text-white bg-[#141514]">{cls.designation}</td>
                      <td className="p-3.5 text-[#C9A227]">{cls.cylinderStrengthMpa}</td>
                      <td className="p-3.5 text-[#C9A227]">{cls.cubeStrengthMpa}</td>
                      <td className="p-3.5">{cls.maxWaterCementRatio}</td>
                      <td className="p-3.5">{cls.minCementContentKgM3}</td>
                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1">
                          {cls.exposureClasses.map((exp, eIdx) => (
                            <span key={eIdx} className="px-1.5 py-0.5 bg-[#1C1D1C] rounded text-[10px] text-[#A0A0A0]">
                              {exp}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3.5 text-[11px] text-[#AAAAAA]">{cls.typicalApplications}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards (Visible only on mobile/small tablets) */}
            <div className="md:hidden space-y-3">
              {concreteClasses.map((cls, idx) => (
                <div key={idx} className="p-4 bg-[#0E0F0E] border border-[#1A1D1B] rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-2">
                    <span className="text-base font-bold text-[#C9A227] font-mono">{cls.designation}</span>
                    <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
                      SR EN 206
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 bg-[#141514] rounded">
                      <span className="text-[10px] text-[#777777] block">Cylinder f_ck,cyl:</span>
                      <span className="text-white font-bold">{cls.cylinderStrengthMpa} N/mm²</span>
                    </div>
                    <div className="p-2 bg-[#141514] rounded">
                      <span className="text-[10px] text-[#777777] block">Cube f_ck,cube:</span>
                      <span className="text-white font-bold">{cls.cubeStrengthMpa} N/mm²</span>
                    </div>
                    <div className="p-2 bg-[#141514] rounded">
                      <span className="text-[10px] text-[#777777] block">Max w/c ratio:</span>
                      <span className="text-[#C9A227] font-bold">{cls.maxWaterCementRatio}</span>
                    </div>
                    <div className="p-2 bg-[#141514] rounded">
                      <span className="text-[10px] text-[#777777] block">Min Cement:</span>
                      <span className="text-white font-bold">{cls.minCementContentKgM3} kg/m³</span>
                    </div>
                  </div>

                  <div className="text-xs text-[#AAAAAA]">
                    <span className="text-[10px] font-mono text-[#777777] block uppercase">Applications:</span>
                    <p className="mt-0.5">{cls.typicalApplications}</p>
                  </div>

                  <div className="pt-2 border-t border-[#1A1D1B] flex flex-wrap gap-1 items-center">
                    <span className="text-[10px] font-mono text-[#666666]">Exposures:</span>
                    {cls.exposureClasses.map((exp, eIdx) => (
                      <span key={eIdx} className="px-1.5 py-0.5 bg-[#1A1D1B] text-[#C9A227] text-[10px] font-mono rounded">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Cement Chemistry & European Standard EN 197-1 */}
          <section className="space-y-6">
            <div className="border-b border-[#1A1D1B] pb-4">
              <h2 className="text-xl md:text-2xl font-bold text-white font-mono flex items-center gap-2">
                <span className="text-[#C9A227]">03.</span> CEMENT CLASSIFICATION (SR EN 197-1)
              </h2>
              <p className="text-xs md:text-sm text-[#888888] mt-1">
                Cement is NOT concrete. Cement is the hydraulic binder constituent. European standard SR EN 197-1 defines 5 common cement types:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-5 bg-[#0E0F0E] border border-[#1A1D1B] rounded-xl space-y-2">
                <span className="text-xs font-mono text-[#C9A227] block font-bold">CEM I — PORTLAND CEMENT</span>
                <p className="text-xs text-[#CCCCCC] leading-relaxed">
                  Contains $ge 95%$ Portland clinker. Rapid early strength gain, high heat of hydration. Ideal for precast elements, prestressed concrete, and cold-weather execution.
                </p>
              </div>

              <div className="p-5 bg-[#0E0F0E] border border-[#1A1D1B] rounded-xl space-y-2">
                <span className="text-xs font-mono text-[#C9A227] block font-bold">CEM II — COMPOSITE PORTLAND</span>
                <p className="text-xs text-[#CCCCCC] leading-relaxed">
                  Contains 65–94% clinker blended with limestone (LL), silica fume (D), blast furnace slag (S), or pozzolana (V). The most widely used commercial cement in Romania (e.g., CEM II/A-LL 42.5 R).
                </p>
              </div>

              <div className="p-5 bg-[#0E0F0E] border border-[#1A1D1B] rounded-xl space-y-2">
                <span className="text-xs font-mono text-[#C9A227] block font-bold">CEM III — BLAST FURNACE CEMENT</span>
                <p className="text-xs text-[#CCCCCC] leading-relaxed">
                  Contains 36–95% granulated blast-furnace slag. Low hydration heat, high sulfate resistance, superior impermeability for mass foundations, dams, and maritime works.
                </p>
              </div>

              <div className="p-5 bg-[#0E0F0E] border border-[#1A1D1B] rounded-xl space-y-2">
                <span className="text-xs font-mono text-[#C9A227] block font-bold">CEM IV — POZZOLANIC CEMENT</span>
                <p className="text-xs text-[#CCCCCC] leading-relaxed">
                  Contains natural pozzolanas or fly ash. Exceptional resistance to chemical attack and aggressive groundwater environments.
                </p>
              </div>

              <div className="p-5 bg-[#0E0F0E] border border-[#1A1D1B] rounded-xl space-y-2">
                <span className="text-xs font-mono text-[#C9A227] block font-bold">CEM V — COMPOSITE CEMENT</span>
                <p className="text-xs text-[#CCCCCC] leading-relaxed">
                  Blend of clinker (20–64%), blast-furnace slag (18–50%), and pozzolana/fly ash. Tailored for heavy civil infrastructure with strict environmental durability limits.
                </p>
              </div>

              <div className="p-5 bg-[#0E0F0E] border border-[#1A1D1B] rounded-xl space-y-2">
                <span className="text-xs font-mono text-[#C9A227] block font-bold">STRENGTH SUB-CLASSES (N / R)</span>
                <p className="text-xs text-[#CCCCCC] leading-relaxed">
                  Cement is graded into 32.5, 42.5, and 52.5 MPa with notation <span className="text-white font-semibold">N</span> (Ordinary early strength) or <span className="text-white font-semibold">R</span> (Rapid early strength).
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Exposure Classes (XC, XD, XS, XF, XA) */}
          <section className="space-y-6">
            <div className="border-b border-[#1A1D1B] pb-4">
              <h2 className="text-xl md:text-2xl font-bold text-white font-mono flex items-center gap-2">
                <span className="text-[#C9A227]">04.</span> DURABILITY EXPOSURE CLASSES (SR EN 206)
              </h2>
              <p className="text-xs md:text-sm text-[#888888] mt-1">
                Environmental degradation mechanisms governing concrete cover thickness and minimum cement content:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 bg-[#0E0F0E] border border-[#1A1D1B] rounded-xl space-y-1.5">
                <span className="text-[#C9A227] font-bold text-sm block">XC1 – XC4 (Carbonation)</span>
                <p className="text-[#CCCCCC] font-sans text-xs">Corrosion induced by carbonation ($CO2$ neutralising concrete alkalinity pH &lt; 9). XC1: dry interior; XC4: cyclic wet and dry exterior surfaces.</p>
              </div>

              <div className="p-4 bg-[#0E0F0E] border border-[#1A1D1B] rounded-xl space-y-1.5">
                <span className="text-[#C9A227] font-bold text-sm block">XF1 – XF4 (Freeze/Thaw)</span>
                <p className="text-[#CCCCCC] font-sans text-xs">Frost and ice attack with or without de-icing salts. XF3/XF4 require mandatory air entrainment ($ge 4.5%$) to absorb water expansion.</p>
              </div>

              <div className="p-4 bg-[#0E0F0E] border border-[#1A1D1B] rounded-xl space-y-1.5">
                <span className="text-[#C9A227] font-bold text-sm block">XA1 – XA3 (Chemical Attack)</span>
                <p className="text-[#CCCCCC] font-sans text-xs">Aggressive chemical soil and groundwater environments (sulfate attack, acidic pH). Requires sulfate-resisting cement (SR) and low $w/c$.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
