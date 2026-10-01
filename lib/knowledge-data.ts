/**
 * Construction Industry Knowledge Base & Material Intelligence
 * CONSTRUCTIONS by AiXLuxury
 *
 * Factually verified technical reference data adhering strictly to European Norms (EN/Eurocodes)
 * and Romanian Technical Codes (NE 012-1:2022, P100-1/2013, CR 6-2013, C 107, NP 112-2014, SR EN 206, SR EN 197-1).
 *
 * Source Status Taxonomy:
 * - VERIFIED: Backed by published European/Romanian Norms or Official Regulatory Standards.
 * - DOCUMENTED: Sourced from accredited technical institutions, Eurocodes, or manufacturer technical dossiers.
 * - OBSERVED: Empirically documented on site.
 * - NOT DISCLOSED / UNAVAILABLE: When specific proprietary formulations or properties are unpublished.
 * - NOT YET VERIFIED: Under technical review.
 */

export type SourceStatus = "VERIFIED" | "DOCUMENTED" | "OBSERVED" | "NOT DISCLOSED" | "NOT YET VERIFIED";
export type SourceTier = "TIER 1 (Official Standard / Eurocode)" | "TIER 2 (Technical Institution / ASRO / AICPS)" | "TIER 3 (Manufacturer Technical Dossier)" | "TIER 4 (Industry Consensus)";

export interface StandardReference {
  code: string;
  title: string;
  organization: string;
  scope: string;
  year: number;
  tier: SourceTier;
  url?: string;
}

export interface MaterialProperty {
  label: string;
  value: string;
  unit?: string;
  standardReference?: string;
  status: SourceStatus;
}

export interface MaterialItem {
  id: string;
  slug: string;
  name: string;
  romanianName: string;
  category: KnowledgeCategoryId;
  categoryName: string;
  summary: string;
  technicalDescription: string;
  compositionAndManufacture: string[];
  keyProperties: MaterialProperty[];
  typicalApplications: string[];
  advantages: string[];
  limitations: string[];
  governingStandards: string[];
  sourceTier: SourceTier;
  sourceStatus: SourceStatus;
  primaryReference: string;
  relatedSystems?: string[];
  relatedCompanies?: string[];
  verifiedAt: string;
}

export interface ConcreteClass {
  designation: string; // e.g. "C25/30"
  cylinderStrengthMpa: number; // fck,cyl [N/mm2]
  cubeStrengthMpa: number; // fck,cube [N/mm2]
  characteristicStrengthLabel: string;
  minCementContentKgM3: string; // e.g. "280 - 320"
  maxWaterCementRatio: string; // e.g. "0.50 - 0.55"
  typicalApplications: string;
  exposureClasses: string[]; // e.g. ["XC1", "XC2", "XC3", "XC4", "XF1"]
  standardReference: string; // "SR EN 206:2021 + NE 012-1:2022"
  status: SourceStatus;
}

export interface ConstructionSystem {
  id: string;
  slug: string;
  name: string;
  romanianName: string;
  structuralPrinciple: string;
  seismicBehavior: string; // Specific to Romanian seismic zone Vrancea (ag = 0.20g - 0.40g)
  designCodes: string[];
  typicalApplications: string[];
  advantages: string[];
  limitations: string[];
  materialDependencies: string[];
  lifecycleAndDurability: string;
  sourceStatus: SourceStatus;
  verifiedAt: string;
}

export interface ConstructionProcess {
  stepNumber: number;
  slug: string;
  name: string;
  romanianName: string;
  phase: "SUBSTRUCTURE" | "SUPERSTRUCTURE" | "ENVELOPE & ROOFING" | "MEP & FINISHES" | "COMMISSIONING";
  description: string;
  criticalQualityControls: string[];
  normativeRequirements: string[];
  typicalDurationEstimate: string;
  deliverablesAndReception: string; // e.g. "Proces Verbal de Lucrari Ascunse (PVLA)"
  sourceStatus: SourceStatus;
}

export interface GlossaryTerm {
  slug: string;
  term: string;
  fullAcronymName?: string;
  romanianTerm: string;
  category: "URBANISM & PERMITTING" | "STRUCTURAL ENGINEERING" | "MATERIALS & TESTING" | "ENERGY & BUILDING PHYSICS" | "EXECUTION & SITE MANAGEMENT";
  definition: string;
  practicalApplication: string;
  regulatoryContext?: string; // e.g. "Legea 50/1991", "P100-1/2013", "Legea 372/2005"
  sourceStatus: SourceStatus;
}

export interface MaterialComparison {
  id: string;
  slug: string;
  title: string;
  category: string;
  materials: {
    name: string;
    slug: string;
    density: string;
    thermalConductivity: string; // W/(m*K)
    compressiveStrength: string;
    waterAbsorption: string;
    fireReactionClass: string; // Euroclass A1 - F
    acousticPerformance: string;
    durabilityLifespan: string;
    bestUsedFor: string[];
    criticalLimitation: string;
    standards: string[];
  }[];
  engineeringVerdict: string;
  standardReference: string;
}

export type KnowledgeCategoryId =
  | "structural-materials"
  | "masonry"
  | "insulation"
  | "waterproofing"
  | "finishes"
  | "facade-systems"
  | "roofing"
  | "windows-glass"
  | "infrastructure-materials"
  | "installations-mep";

export interface KnowledgeCategory {
  id: KnowledgeCategoryId;
  slug: string;
  name: string;
  romanianName: string;
  icon: string;
  shortDescription: string;
  detailedOverview: string;
  keyGoverningStandards: string[];
  itemCount: number;
}

export const knowledgeCategories: KnowledgeCategory[] = [
  {
    id: "structural-materials",
    slug: "structural-materials",
    name: "Structural Materials",
    romanianName: "Materiale Structurale",
    icon: "🏗️",
    shortDescription: "Concrete, reinforcing steel, structural steel, timber, and aggregates forming the primary load-bearing skeleton.",
    detailedOverview: "Governed by Eurocodes EN 1990-1999 and Romanian codes NE 012-1:2022 and P100-1/2013. Defines compressive strength, ductility, modulus of elasticity, and fire resistance.",
    keyGoverningStandards: ["SR EN 206:2021", "NE 012-1:2022", "SR EN 1992-1-1", "SR EN 1993-1-1", "SR EN 10080"],
    itemCount: 4
  },
  {
    id: "masonry",
    slug: "masonry",
    name: "Masonry & Walling",
    romanianName: "Zidărie și Compartimentări",
    icon: "🧱",
    shortDescription: "Ceramic blocks, AAC (BCA), concrete masonry units, structural and non-structural infill systems.",
    detailedOverview: "Regulated by Romanian code CR 6-2013 and SR EN 771. Evaluates normalized compressive strength, thermal resistance, acoustic insulation, and seismic shear performance.",
    keyGoverningStandards: ["CR 6-2013", "SR EN 771-1:2015", "SR EN 771-4:2015", "SR EN 998-2"],
    itemCount: 3
  },
  {
    id: "insulation",
    slug: "insulation",
    name: "Thermal & Acoustic Insulation",
    romanianName: "Termoizolații și Fonoizolații",
    icon: "🧊",
    shortDescription: "Expanded Polystyrene (EPS), Extruded Polystyrene (XPS), Rock Wool, Glass Wool, PIR/PUR.",
    detailedOverview: "Standardized under Normativ C 107 and SR EN 13162-13165. Governs thermal conductivity (λ), compressive strength at 10% deformation, vapor permeability, and reaction to fire (Euroclass A1-F).",
    keyGoverningStandards: ["Normativ C 107", "SR EN 13162:2015", "SR EN 13163:2015", "SR EN 13164:2015"],
    itemCount: 4
  },
  {
    id: "waterproofing",
    slug: "waterproofing",
    name: "Waterproofing & Protection",
    romanianName: "Hidroizolații și Protecții",
    icon: "💧",
    shortDescription: "Bituminous membranes (SBS/APP), PVC/TPO synthetic liners, EPDM, liquid polyurethane, and cementitious barriers.",
    detailedOverview: "Governed by Normativ NP 121 and SR EN 13707/13956. Essential for basement sub-structures, raft foundations, terraces, green roofs, and wet rooms.",
    keyGoverningStandards: ["Normativ NP 121", "SR EN 13707", "SR EN 13956", "SR EN 14891"],
    itemCount: 3
  },
  {
    id: "finishes",
    slug: "finishes",
    name: "Finishes, Plasters & Screeds",
    romanianName: "Finisaje, Tencuieli și Șape",
    icon: "🎨",
    shortDescription: "Internal and external plasters, screeds, tile adhesives, grouts, specialized resin floors, and paints.",
    detailedOverview: "Compliant with SR EN 998-1, SR EN 13813, and SR EN 12004. Determines bonding strength, crack bridging, drying shrinkage, and leveling tolerances.",
    keyGoverningStandards: ["SR EN 998-1", "SR EN 13813", "SR EN 12004", "NE 001-1996"],
    itemCount: 3
  },
  {
    id: "facade-systems",
    slug: "facade-systems",
    name: "Facade Systems & Envelopes",
    romanianName: "Sisteme de Fațadă și Anvelope",
    icon: "🏢",
    shortDescription: "ETICS external insulation, ventilated facades (ceramic, HPL, fiber cement, metal), and curtain walls.",
    detailedOverview: "Regulated by ETAG 004 / EAD 040083-00-0404 and SR EN 13830. Combines hygrothermal durability, wind load resistance, seismic movement allowance, and fire spread prevention.",
    keyGoverningStandards: ["EAD 040083-00-0404 (ETICS)", "SR EN 13830 (Curtain Wall)", "Normativ P118/2"],
    itemCount: 2
  },
  {
    id: "roofing",
    slug: "roofing",
    name: "Roofing Systems & Drainage",
    romanianName: "Învelitori și Sisteme de Acoperiș",
    icon: "🏠",
    shortDescription: "Ceramic and concrete tiles, standing seam metal roofs, bituminous shingles, flat roof assemblies, and rainwater drainage.",
    detailedOverview: "Regulated by SR EN 1304, SR EN 490, and SR EN 508-1. Focuses on water tightness, mechanical resistance against snow and wind suction, and thermal expansion management.",
    keyGoverningStandards: ["SR EN 1304", "SR EN 490", "SR EN 508-1", "Normativ NP 068-02"],
    itemCount: 2
  },
  {
    id: "windows-glass",
    slug: "windows-glass",
    name: "Windows, Doors & Architectural Glass",
    romanianName: "Tâmplărie și Geamuri Termoizolante",
    icon: "🪟",
    shortDescription: "PVC, aluminium, and timber joinery paired with double/triple insulated glazing (Low-E, solar control, laminated).",
    detailedOverview: "Governed by SR EN 14351-1 and SR EN 1279. Measures overall heat transfer coefficient (Uw-value), acoustic attenuation (Rw), air permeability, and wind tightness.",
    keyGoverningStandards: ["SR EN 14351-1:2016", "SR EN 1279-1:2018", "SR EN ISO 10077-1"],
    itemCount: 2
  },
  {
    id: "infrastructure-materials",
    slug: "infrastructure-materials",
    name: "Infrastructure & Earthworks Materials",
    romanianName: "Materiale de Infrastructură și Terasamente",
    icon: "🛣️",
    shortDescription: "Asphalt mixtures, road bitumen, geotextiles, geogrids, crushed aggregates, and soil stabilization binders.",
    detailedOverview: "Standardized by SR EN 13108, AND 552/605, and SR EN 13242. Designed for heavy dynamic traffic loads, rutting resistance, subgrade reinforcement, and drainage.",
    keyGoverningStandards: ["SR EN 13108-1", "AND 605-2016", "SR EN 13242", "SR EN 13249"],
    itemCount: 2
  },
  {
    id: "installations-mep",
    slug: "installations-mep",
    name: "Building Installations & MEP",
    romanianName: "Instalații și Echipamente Tehnice",
    icon: "⚡",
    shortDescription: "Plumbing, HVAC heating/cooling, heat pumps, ventilation with heat recovery, electrical distribution, fire protection, and automation.",
    detailedOverview: "Compliant with Romanian normatives I7 (Electrical), I9 (Sanitary), I13 (Thermal), and P118 (Fire safety).",
    keyGoverningStandards: ["Normativ I7-2011", "Normativ I9-2015", "Normativ I13-2015", "Normativ P118-99"],
    itemCount: 2
  }
];

export const constructionMaterialsDataset: MaterialItem[] = [
  {
    id: "mat-concrete-structural",
    slug: "structural-concrete",
    name: "Structural Ready-Mix Concrete",
    romanianName: "Beton Marfă Structural",
    category: "structural-materials",
    categoryName: "Structural Materials",
    summary: "Engineered composite material comprising hydraulic cement, mineral aggregates (0-31.5mm), water, and chemical admixtures, delivering high compressive strength in reinforced concrete frames and foundations.",
    technicalDescription: "Structural concrete is the primary load-bearing material in Romanian civil engineering. Formulated in accordance with SR EN 206:2021 and national code NE 012-1:2022. Compressive strength classes range from C8/10 for lean concrete to C50/60 for high-load columns. Characterized by excellent compressive load bearing, high fire resistance (Euroclass A1), and significant thermal mass, but requires steel reinforcement to withstand tensile, flexural, and shear stresses.",
    compositionAndManufacture: [
      "Hydraulic Cement (CEM I / CEM II compliant with SR EN 197-1)",
      "Graded natural or crushed mineral aggregates (sand 0-4mm, gravel 4-8mm, 8-16mm, 16-31.5mm compliant with SR EN 12620)",
      "Potable mixing water (SR EN 1008)",
      "Chemical admixtures: Polycarboxylate superplasticizers for water reduction, air entrainers (XF exposure), retarders/accelerators (SR EN 934-2)"
    ],
    keyProperties: [
      { label: "Characteristic Compressive Strength (fck,cyl)", value: "20 - 50", unit: "N/mm² (MPa)", standardReference: "SR EN 206:2021", status: "VERIFIED" },
      { label: "Density (Normal Weight)", value: "2300 - 2450", unit: "kg/m³", standardReference: "NE 012-1:2022", status: "VERIFIED" },
      { label: "Modulus of Elasticity (Ecm)", value: "30,000 - 37,000", unit: "N/mm²", standardReference: "SR EN 1992-1-1", status: "VERIFIED" },
      { label: "Thermal Conductivity (λ)", value: "1.65 - 2.00", unit: "W/(m·K)", standardReference: "Normativ C 107", status: "VERIFIED" },
      { label: "Reaction to Fire", value: "Class A1 (Non-combustible)", standardReference: "Decizia CE 96/603/CE", status: "VERIFIED" }
    ],
    typicalApplications: [
      "Cast-in-place foundations, continuous footings, and general raft foundations (radiere)",
      "Reinforced concrete structural frames (columns, shear walls, beams, slabs)",
      "Retaining walls and underground infrastructure basements",
      "Bridge piers, decks, and civil engineering infrastructure"
    ],
    advantages: [
      "Outstanding compressive strength and long-term durability when properly cured",
      "High fluidity and pumpability enabling complex architectural geometries",
      "Inherent non-combustibility and high fire resistance rating (REI up to 240 mins)",
      "High thermal inertia dampening indoor temperature fluctuations"
    ],
    limitations: [
      "Negligible tensile strength (approx. 10% of compressive strength), necessitating steel reinforcement",
      "Vulnerable to shrinkage cracking and carbonation if water-cement ratio is excessive (>0.55)",
      "Requires strict on-site curing protocols (minimum 7 days moisture retention) per NE 012-1:2022",
      "High embodied carbon footprint primarily associated with Portland cement clinker manufacturing"
    ],
    governingStandards: ["SR EN 206:2021 + A2:2021", "NE 012-1:2022", "SR EN 1992-1-1 (Eurocode 2)", "SR EN 12620"],
    sourceTier: "TIER 1 (Official Standard / Eurocode)",
    sourceStatus: "VERIFIED",
    primaryReference: "SR EN 206:2021 & NE 012-1:2022 National Code for Concrete Execution",
    relatedSystems: ["sys-rc-frame", "sys-rc-shearwall"],
    relatedCompanies: ["porr-construct-romania", "strabag-romania", "erbasu-constructii"],
    verifiedAt: "2026-03-01"
  },
  {
    id: "mat-reinforcing-steel",
    slug: "reinforcing-steel",
    name: "Reinforcing Steel (Rebar / B500B / BST500S)",
    romanianName: "Oțel Beton Fasonat (BST500S / B500B)",
    category: "structural-materials",
    categoryName: "Structural Materials",
    summary: "High-ductility ribbed carbon steel bars embedded in concrete to absorb tensile, shear, and seismic bending forces.",
    technicalDescription: "Reinforcing steel provides the tensile and ductile capacity that plain concrete lacks. Under Romanian seismic code P100-1/2013 and Eurocode 2 (SR EN 1992-1-1), high ductility class B or C steel (such as BST500S / B500B / B500C) is strictly mandated for structures in seismic zones (ag ≥ 0.20g). Ribbed surface geometry ensures mechanical bond adhesion with the surrounding cement matrix.",
    compositionAndManufacture: [
      "Hot-rolled micro-alloyed carbon steel or tempcore heat-treated steel",
      "Controlled carbon equivalent value (CEV ≤ 0.50%) ensuring high weldability",
      "Ribbed surface profile according to SR 438-1 / SR EN 10080"
    ],
    keyProperties: [
      { label: "Characteristic Yield Strength (fyk)", value: "500", unit: "N/mm² (MPa)", standardReference: "SR EN 10080", status: "VERIFIED" },
      { label: "Tensile / Yield Strength Ratio (ft/fy)", value: "≥ 1.08 (Class B) / ≥ 1.15 (Class C)", unit: "ratio", standardReference: "SR EN 1992-1-1", status: "VERIFIED" },
      { label: "Elongation at Maximum Force (Agt)", value: "≥ 5.0% (Class B) / ≥ 7.5% (Class C)", unit: "%", standardReference: "P100-1/2013", status: "VERIFIED" },
      { label: "Modulus of Elasticity (Es)", value: "200,000", unit: "N/mm²", standardReference: "SR EN 1992-1-1", status: "VERIFIED" },
      { label: "Density", value: "7850", unit: "kg/m³", standardReference: "Eurocode 3", status: "VERIFIED" }
    ],
    typicalApplications: [
      "Longitudinal reinforcement in concrete columns, beams, and foundations",
      "Transverse confinement stirrups (etrieri) for shear and seismic ductility",
      "Welded wire mesh (plase sudate) in slabs, screeds, and industrial pavements"
    ],
    advantages: [
      "High yield strength (500 MPa) coupled with critical plastic elongation ductility",
      "Identical thermal expansion coefficient to concrete (approx. 10×10⁻⁶ K⁻¹), eliminating internal thermal shear",
      "Fully weldable (tempcore process) with certified chemical composition",
      "100% recyclable material with high scrap circularity"
    ],
    limitations: [
      "Susceptible to rapid corrosion if concrete cover is insufficient (<25-50mm depending on exposure class)",
      "Severe loss of yield strength at temperatures above 500°C without adequate concrete fire cover",
      "Requires certified bending schedules (fasonare) to avoid micro-fractures at tight bend radii"
    ],
    governingStandards: ["SR EN 10080:2006", "SR 438-1:2012", "SR EN 1992-1-1 (Eurocode 2)", "P100-1/2013 Annex H"],
    sourceTier: "TIER 1 (Official Standard / Eurocode)",
    sourceStatus: "VERIFIED",
    primaryReference: "SR EN 10080:2006 & Romanian Seismic Norm P100-1/2013",
    relatedSystems: ["sys-rc-frame", "sys-rc-shearwall"],
    relatedCompanies: ["porr-construct-romania", "bogart-construct", "erbasu-constructii"],
    verifiedAt: "2026-03-01"
  },
  {
    id: "mat-structural-steel",
    slug: "structural-steel",
    name: "Structural Steel Sections (S275 / S355)",
    romanianName: "Profile Metalice Structurale (S275 / S355)",
    category: "structural-materials",
    categoryName: "Structural Materials",
    summary: "Hot-rolled standardized steel profiles (HEA, HEB, IPE, UNP, RHS/SHS) providing exceptional strength-to-weight ratio for long spans and industrial frames.",
    technicalDescription: "Structural steel manufactured per SR EN 10025-2 in grades S235, S275, and S355. Offers isotropic mechanical properties, predictable elastic-plastic behavior, and fast prefabricated erection. Extensively utilized in industrial logistics centers, large-span sports halls, and high-rise commercial frameworks under Eurocode 3 (SR EN 1993) and Eurocode 8 (SR EN 1998).",
    compositionAndManufacture: [
      "Hot-rolled structural non-alloy steel according to SR EN 10025-2",
      "Standard cross-section geometries: HEA, HEB, HEM, IPE, UPN, hollow tubular SHS/RHS (SR EN 10210)"
    ],
    keyProperties: [
      { label: "Nominal Yield Strength (fy for t ≤ 16mm)", value: "275 / 355", unit: "N/mm² (MPa)", standardReference: "SR EN 10025-2", status: "VERIFIED" },
      { label: "Ultimate Tensile Strength (fu)", value: "430 - 630", unit: "N/mm² (MPa)", standardReference: "SR EN 10025-2", status: "VERIFIED" },
      { label: "Modulus of Elasticity (E)", value: "210,000", unit: "N/mm²", standardReference: "SR EN 1993-1-1", status: "VERIFIED" },
      { label: "Density", value: "7850", unit: "kg/m³", standardReference: "Eurocode 3", status: "VERIFIED" },
      { label: "Impact Energy Charpy V-notch (KV at +20°C / 0°C / -20°C)", value: "≥ 27", unit: "Joules (J)", standardReference: "SR EN 10025-2", status: "VERIFIED" }
    ],
    typicalApplications: [
      "Heavy industrial logistics warehouses and production halls",
      "Long-span roof trusses, space frames, and stadium structures",
      "High-rise commercial office frames and composite steel-concrete slabs"
    ],
    advantages: [
      "Highest strength-to-weight ratio among structural materials, minimizing foundation loads",
      "High precision off-site prefabrication and rapid on-site bolted/welded assembly",
      "Excellent ductility and seismic energy dissipation when designed with plastic hinge zones",
      "100% recyclable with minimal degradation of metallurgical properties"
    ],
    limitations: [
      "Requires certified intumescent paint or mineral casing for fire protection (critical loss of strength at >550°C)",
      "Susceptible to atmospheric corrosion requiring multi-layer epoxy/polyurethane coating or hot-dip galvanizing",
      "Higher initial material cost per ton compared to cast-in-place concrete"
    ],
    governingStandards: ["SR EN 10025-2:2019", "SR EN 1993-1-1 (Eurocode 3)", "SR EN 1090-2 (Execution of Steel Structures)"],
    sourceTier: "TIER 1 (Official Standard / Eurocode)",
    sourceStatus: "VERIFIED",
    primaryReference: "SR EN 10025-2 & SR EN 1993-1-1 (Eurocode 3)",
    relatedSystems: ["sys-steel-frame", "sys-hybrid-composite"],
    relatedCompanies: ["strabag-romania", "porr-construct-romania"],
    verifiedAt: "2026-03-01"
  },
  {
    id: "mat-clt-timber",
    slug: "cross-laminated-timber",
    name: "Cross-Laminated Timber (CLT)",
    romanianName: "Lemn Lamelat Încrucișat (CLT)",
    category: "structural-materials",
    categoryName: "Structural Materials",
    summary: "Engineered solid wood panel product manufactured by gluing orthogonal layers of structural timber boards, offering high rigidity and carbon sequestration.",
    technicalDescription: "Cross-Laminated Timber (CLT) is an engineered wood product manufactured in accordance with SR EN 16351. Consists of 3, 5, or 7 orthogonally stacked kiln-dried softwood boards bonded under pressure with structural polyurethane adhesives. Delivers bi-directional load bearing, high in-plane shear capacity, predictable charring rate in fire conditions, and negative embodied carbon.",
    compositionAndManufacture: [
      "C24 strength-graded softwood boards (spruce/fir) kiln-dried to 12% ± 2% moisture content",
      "Formaldehyde-free 1-component polyurethane (1K PUR) or EPI structural adhesives (SR EN 15425)"
    ],
    keyProperties: [
      { label: "Bending Strength (fm,k)", value: "24", unit: "N/mm² (MPa)", standardReference: "SR EN 16351", status: "VERIFIED" },
      { label: "Modulus of Elasticity (E0,mean)", value: "11,000 - 12,000", unit: "N/mm²", standardReference: "SR EN 16351", status: "VERIFIED" },
      { label: "Density (Mean)", value: "450 - 500", unit: "kg/m³", standardReference: "SR EN 1995-1-1", status: "VERIFIED" },
      { label: "Thermal Conductivity (λ)", value: "0.12 - 0.13", unit: "W/(m·K)", standardReference: "SR EN ISO 10456", status: "VERIFIED" },
      { label: "Charring Rate (β0 in fire)", value: "0.65", unit: "mm/min", standardReference: "SR EN 1995-1-2", status: "VERIFIED" }
    ],
    typicalApplications: [
      "Multi-story residential and commercial timber buildings (up to 8-12 stories)",
      "Structural floor slabs and shear wall assemblies",
      "Low-carbon and nZEB architectural developments"
    ],
    advantages: [
      "Negative embodied carbon (sequesters ~1 ton of CO2 per cubic meter of timber)",
      "Lightweight structure (approx. 1/5th weight of concrete), drastically reducing seismic inertial forces",
      "Exceptional dimensional stability due to orthogonal cross-lamination",
      "Predictable charring rate providing natural fire protection to interior wood core"
    ],
    limitations: [
      "Strict moisture protection required during transportation, storage, and erection",
      "Requires acoustic decoupling membranes to mitigate low-frequency impact sound transmission",
      "Emerging supply chain in Romania with higher dependence on central European manufacturing"
    ],
    governingStandards: ["SR EN 16351:2021", "SR EN 1995-1-1 (Eurocode 5)", "SR EN 1995-1-2 (Timber Fire Design)"],
    sourceTier: "TIER 1 (Official Standard / Eurocode)",
    sourceStatus: "VERIFIED",
    primaryReference: "SR EN 16351 & SR EN 1995-1-1 (Eurocode 5)",
    relatedSystems: ["sys-clt-timber"],
    verifiedAt: "2026-03-01"
  },
  {
    id: "mat-ceramic-blocks",
    slug: "ceramic-blocks",
    name: "Ceramic Hollow Blocks (Porotherm / Brikston)",
    romanianName: "Blocuri Ceramice cu Goluri Verticale",
    category: "masonry",
    categoryName: "Masonry & Walling",
    summary: "Fired clay masonry units with vertical perforations and tongue-and-groove interlocking profiles for exterior structural and infill envelope walls.",
    technicalDescription: "Ceramic hollow blocks manufactured in accordance with SR EN 771-1:2015 and Romanian Masonry Code CR 6-2013. Available in thicknesses from 115mm (interior non-structural partitions) to 380mm (exterior load-bearing / infill walls). Designed with vertical voids (perforations typically 45-55%) to optimize thermal insulation while maintaining adequate normalized compressive strength (fb ≥ 10-15 N/mm²).",
    compositionAndManufacture: [
      "Natural refined alluvial clay and mineral pore-forming additives (sawdust / polystyrene beads)",
      "Extruded, dried, and kiln-fired at 900°C - 1050°C",
      "Tongue-and-groove (nut-feder) lateral joint profiles"
    ],
    keyProperties: [
      { label: "Normalized Compressive Strength (fb)", value: "10.0 - 15.0", unit: "N/mm² (MPa)", standardReference: "SR EN 771-1:2015", status: "VERIFIED" },
      { label: "Gross Dry Density", value: "750 - 850", unit: "kg/m³", standardReference: "SR EN 771-1:2015", status: "VERIFIED" },
      { label: "Equivalent Thermal Conductivity (λ10,dry)", value: "0.14 - 0.20", unit: "W/(m·K)", standardReference: "SR EN 1745", status: "VERIFIED" },
      { label: "Water Vapor Diffusion Coefficient (μ)", value: "5 / 10", unit: "dimensionless", standardReference: "SR EN 1745", status: "VERIFIED" },
      { label: "Reaction to Fire", value: "Class A1 (Non-combustible)", standardReference: "Decizia CE 96/603/CE", status: "VERIFIED" }
    ],
    typicalApplications: [
      "Confined masonry load-bearing exterior and interior walls (CR 6-2013)",
      "Infill exterior masonry walls in reinforced concrete framed structures",
      "Acoustic and fire separation partition walls in residential developments"
    ],
    advantages: [
      "Excellent thermal inertia dampening daily temperature swings",
      "Outstanding fire resistance (Euroclass A1, walls achieve EI 180 to REI 240)",
      "High vapor permeability allowing building envelope breathability",
      "High mechanical durability and chemical inertness"
    ],
    limitations: [
      "Brittle material behavior vulnerable to shear cracking in high-seismic zones if unconfined",
      "Requires specialized rotary drilling without hammer action to prevent internal void collapse during fixing installation",
      "Thermal conductivity (0.14-0.20 W/mK) still requires supplementary exterior insulation (ETICS/MW) to meet Romanian nZEB limits"
    ],
    governingStandards: ["SR EN 771-1:2015", "CR 6-2013 (Romanian Masonry Code)", "SR EN 1996-1-1 (Eurocode 6)", "Normativ C 107"],
    sourceTier: "TIER 1 (Official Standard / Eurocode)",
    sourceStatus: "VERIFIED",
    primaryReference: "SR EN 771-1:2015 & Romanian National Masonry Code CR 6-2013",
    relatedSystems: ["sys-confined-masonry", "sys-rc-frame"],
    verifiedAt: "2026-03-01"
  },
  {
    id: "mat-aac-bca",
    slug: "autoclaved-aerated-concrete",
    name: "Autoclaved Aerated Concrete (AAC / BCA)",
    romanianName: "Beton Celular Autoclavizat (BCA)",
    category: "masonry",
    categoryName: "Masonry & Walling",
    summary: "Precast lightweight cellular masonry material produced by autoclaving a mix of quartz sand, cement, lime, water, and aluminum foaming agent.",
    technicalDescription: "Autoclaved Aerated Concrete (AAC / BCA in Romania) compliant with SR EN 771-4:2015. Contains millions of closed microscopic air pores (up to 80% porosity by volume), delivering superior thermal insulation (λ = 0.09 - 0.12 W/mK) at very low bulk densities (400-500 kg/m³). Widely used for non-load-bearing infill walls in high-rise RC frames.",
    compositionAndManufacture: [
      "Finely ground quartz sand (SiO2), Portland cement (CEM I), quicklime (CaO), gypsum, and water",
      "Aluminum powder foaming agent creating cellular hydrogen pore network",
      "High-pressure steam autoclaving at 190°C and 12 bar pressure for 10-12 hours"
    ],
    keyProperties: [
      { label: "Normalized Compressive Strength (fb)", value: "2.5 - 5.0", unit: "N/mm² (MPa)", standardReference: "SR EN 771-4:2015", status: "VERIFIED" },
      { label: "Dry Bulk Density", value: "400 - 550", unit: "kg/m³", standardReference: "SR EN 771-4:2015", status: "VERIFIED" },
      { label: "Thermal Conductivity (λ10,dry)", value: "0.09 - 0.12", unit: "W/(m·K)", standardReference: "SR EN 1745", status: "VERIFIED" },
      { label: "Water Vapor Diffusion (μ)", value: "5 / 10", unit: "dimensionless", standardReference: "SR EN 1745", status: "VERIFIED" },
      { label: "Reaction to Fire", value: "Class A1 (Non-combustible)", standardReference: "Decizia CE 96/603/CE", status: "VERIFIED" }
    ],
    typicalApplications: [
      "Infill perimeter walls in reinforced concrete multi-story frames",
      "Interior dividing and compartmentation walls",
      "Fire separation walls in commercial and industrial developments"
    ],
    advantages: [
      "Lightweight material (400-500 kg/m³), reducing seismic dead weight on structural columns and foundations",
      "Superior thermal insulation compared to heavy ceramic blocks (reduces thermal bridging)",
      "Precise dimensional tolerances (±1.5mm) enabling thin-bed adhesive mortar application (1-2mm joints)",
      "Effortless workability (can be cut, grooved, and shaped with standard hand or band saws)"
    ],
    limitations: [
      "Lower compressive strength (2.5-5.0 MPa) restricting use to infill or low-rise confined masonry",
      "Higher hygroscopic water absorption if exposed directly to driving rain without rendering",
      "Lower acoustic mass attenuation compared to solid masonry of equivalent thickness"
    ],
    governingStandards: ["SR EN 771-4:2015", "CR 6-2013", "SR EN 1996-1-1 (Eurocode 6)", "Normativ C 107"],
    sourceTier: "TIER 1 (Official Standard / Eurocode)",
    sourceStatus: "VERIFIED",
    primaryReference: "SR EN 771-4:2015 & Romanian Code CR 6-2013",
    relatedSystems: ["sys-rc-frame"],
    verifiedAt: "2026-03-01"
  },
  {
    id: "mat-eps-insulation",
    slug: "expanded-polystyrene-eps",
    name: "Expanded Polystyrene (EPS / Graphite EPS)",
    romanianName: "Polistiren Expandat (EPS / EPS Grafitat)",
    category: "insulation",
    categoryName: "Thermal & Acoustic Insulation",
    summary: "Rigid cellular plastic insulation material manufactured from expanded polystyrene beads containing 98% trapped air or infrared-reflecting graphite.",
    technicalDescription: "Expanded Polystyrene (EPS) compliant with SR EN 13163:2015. The standard ETICS facade insulation solution in Romania. Standard white EPS (EPS 80 / EPS 100) delivers thermal conductivity of 0.038-0.040 W/mK. Graphite-enhanced EPS incorporates infrared absorbers/reflectors, reducing thermal conductivity to 0.030-0.032 W/mK (20% superior thermal efficiency at identical thickness).",
    compositionAndManufacture: [
      "Polymerized polystyrene beads with pentane blowing agent",
      "Steam expansion process fusing beads into closed-cell block matrix",
      "Graphite particle infusion for graphite EPS variant"
    ],
    keyProperties: [
      { label: "Thermal Conductivity (λD - White EPS)", value: "0.038 - 0.040", unit: "W/(m·K)", standardReference: "SR EN 13163", status: "VERIFIED" },
      { label: "Thermal Conductivity (λD - Graphite EPS)", value: "0.030 - 0.032", unit: "W/(m·K)", standardReference: "SR EN 13163", status: "VERIFIED" },
      { label: "Compressive Stress at 10% Deformation (CS(10))", value: "≥ 80 (EPS 80) / ≥ 100 (EPS 100)", unit: "kPa", standardReference: "SR EN 826", status: "VERIFIED" },
      { label: "Tensile Strength Perpendicular to Faces (TR)", value: "≥ 100 - 150", unit: "kPa", standardReference: "SR EN 1607", status: "VERIFIED" },
      { label: "Reaction to Fire (Euroclass)", value: "Class E (Combustible with flame retardant)", standardReference: "SR EN 13501-1", status: "VERIFIED" }
    ],
    typicalApplications: [
      "ETICS external wall thermal insulation systems (termosistem)",
      "Pitched roof rafters insulation and attic floor thermal layering",
      "Floating floor acoustic impact insulation (EPS-T)"
    ],
    advantages: [
      "Excellent thermal performance per unit cost",
      "Extremely lightweight (15-20 kg/m³), placing negligible structural load on building envelope",
      "High dimensional stability and easy cutting on site",
      "Resistant to moisture damage in non-submerged facade applications"
    ],
    limitations: [
      "Combustible (Euroclass E); requires mineral wool fire barriers (brâuri din vată minerală) per Romanian Normativ P118/2",
      "Poor acoustic sound insulation performance compared to mineral wool",
      "Vulnerable to UV degradation and extreme surface solar overheating during installation (especially graphite EPS)"
    ],
    governingStandards: ["SR EN 13163:2015", "Normativ C 107", "Normativ P118/2 (Fire Safety)", "EAD 040083-00-0404 (ETICS)"],
    sourceTier: "TIER 1 (Official Standard / Eurocode)",
    sourceStatus: "VERIFIED",
    primaryReference: "SR EN 13163:2015 & Romanian Normativ C 107",
    relatedSystems: ["sys-rc-frame", "sys-confined-masonry"],
    verifiedAt: "2026-03-01"
  },
  {
    id: "mat-xps-insulation",
    slug: "extruded-polystyrene-xps",
    name: "Extruded Polystyrene (XPS)",
    romanianName: "Polistiren Extrudat (XPS)",
    category: "insulation",
    categoryName: "Thermal & Acoustic Insulation",
    summary: "High-density rigid foam insulation with 100% closed-cell structure delivering exceptional compressive strength and near-zero water absorption.",
    technicalDescription: "Extruded Polystyrene (XPS) compliant with SR EN 13164:2015. Continuous extrusion process creates a uniform closed-cell structure devoid of voids between beads. Delivers high compressive strength (300 to 700 kPa at 10% deformation) and extraordinary resistance to water absorption by total immersion (≤ 0.7% vol). Essential for below-grade foundation basements, inverted flat roofs, and perimeter plinth zones (soclu).",
    compositionAndManufacture: [
      "Extruded melted polystyrene resin with blowing agents",
      "Continuous extrusion and calibration into high-density closed-cell boards with smooth or waffle-embossed skins"
    ],
    keyProperties: [
      { label: "Thermal Conductivity (λD)", value: "0.033 - 0.036", unit: "W/(m·K)", standardReference: "SR EN 13164", status: "VERIFIED" },
      { label: "Compressive Stress at 10% Strain (CS(10/Y))", value: "300 - 700", unit: "kPa", standardReference: "SR EN 826", status: "VERIFIED" },
      { label: "Long-Term Water Absorption by Total Immersion (WL(T))", value: "≤ 0.7", unit: "% by volume", standardReference: "SR EN 12087", status: "VERIFIED" },
      { label: "Freeze-Thaw Resistance (FTCD)", value: "≤ 1.0 (after 300 cycles)", unit: "% volume change", standardReference: "SR EN 12091", status: "VERIFIED" },
      { label: "Reaction to Fire", value: "Class E", standardReference: "SR EN 13501-1", status: "VERIFIED" }
    ],
    typicalApplications: [
      "Exterior foundation walls, basement perimeter insulation, and under-raft slab insulation",
      "Inverted flat roofs (acoperiș terasă inversată) and green roof assemblies",
      "Perimeter plinth thermal insulation (soclu) subjected to splash water and mechanical impacts",
      "Industrial cold storage floors and heavy-load vehicle parking decks"
    ],
    advantages: [
      "Near-zero water absorption under direct contact with moist soil and ground water",
      "Extreme compressive load resistance (up to 70 tons/m²)",
      "Maintains thermal insulation R-value even in wet, high-humidity subterranean environments",
      "Immune to freeze-thaw degradation cycles"
    ],
    limitations: [
      "Higher material cost compared to standard EPS",
      "Combustible (Euroclass E); not permitted for full-height high-rise facade envelopes",
      "Very low vapor permeability (μ = 80-250), acting as a vapor barrier that can trap moisture if misused on internal walls"
    ],
    governingStandards: ["SR EN 13164:2015", "Normativ C 107", "Normativ NP 112-2014 (Foundations)"],
    sourceTier: "TIER 1 (Official Standard / Eurocode)",
    sourceStatus: "VERIFIED",
    primaryReference: "SR EN 13164:2015 & Romanian Normativ C 107",
    relatedSystems: ["sys-rc-frame", "sys-rc-shearwall"],
    verifiedAt: "2026-03-01"
  },
  {
    id: "mat-rock-wool",
    slug: "rock-mineral-wool",
    name: "Rock Mineral Wool Insulation",
    romanianName: "Vată Minerală Bazaltică",
    category: "insulation",
    categoryName: "Thermal & Acoustic Insulation",
    summary: "Non-combustible stone wool insulation produced from volcanic basalt rock, delivering Class A1 fire protection, thermal insulation, and sound absorption.",
    technicalDescription: "Rock Mineral Wool compliant with SR EN 13162:2015. Manufactured by spinning molten volcanic basalt rock at 1500°C into fine fibrous mats bonded with thermosetting resins. Delivers Euroclass A1 non-combustibility (melting point > 1000°C), superior acoustic sound absorption, high vapor breathability (μ = 1), and thermal conductivity of 0.034-0.038 W/mK. Mandated for ventilated facades, tall buildings, and fire barriers under Romanian Normativ P118/2.",
    compositionAndManufacture: [
      "Volcanic basalt rock, dolomite, and bauxite melted in cupola furnaces at 1500°C",
      "Centrifugal fiber spinning with water-repellent (hydrophobic) additives and organic binders"
    ],
    keyProperties: [
      { label: "Thermal Conductivity (λD)", value: "0.034 - 0.038", unit: "W/(m·K)", standardReference: "SR EN 13162", status: "VERIFIED" },
      { label: "Reaction to Fire", value: "Class A1 (Non-combustible)", standardReference: "SR EN 13501-1", status: "VERIFIED" },
      { label: "Melting Point Temperature", value: "> 1000", unit: "°C", standardReference: "DIN 4102-17", status: "VERIFIED" },
      { label: "Water Vapor Diffusion Coefficient (μ)", value: "1 (Open to diffusion)", unit: "dimensionless", standardReference: "SR EN 12086", status: "VERIFIED" },
      { label: "Tensile Strength Perpendicular to Faces (TR for Facade)", value: "≥ 7.5 - 15", unit: "kPa", standardReference: "SR EN 1607", status: "VERIFIED" }
    ],
    typicalApplications: [
      "Ventilated facade insulation and high-rise ETICS building envelopes",
      "Fire-rated perimeter bands (brâuri rezistente la foc) in EPS facade systems",
      "Acoustic partition walls and intermediate concrete floor soundproofing",
      "Flat roof thermal insulation under single-ply or bituminous waterproofing"
    ],
    advantages: [
      "Completely non-combustible (Class A1), acting as a fire barrier that prevents vertical flame spread",
      "Outstanding acoustic sound attenuation (airborne and impact sound absorption)",
      "Maximum water vapor permeability (μ = 1), completely eliminating risk of interstitial condensation in breathable walls",
      "Dimensional stability immune to thermal expansion or contraction"
    ],
    limitations: [
      "Higher weight (80-150 kg/m³ for facade boards) requiring heavy-duty mechanical anchor dowels",
      "Higher material and installation cost compared to standard EPS",
      "Must be protected from continuous liquid water soaking during on-site storage and installation"
    ],
    governingStandards: ["SR EN 13162:2015", "Normativ P118/2 (Romanian Fire Code)", "Normativ C 107"],
    sourceTier: "TIER 1 (Official Standard / Eurocode)",
    sourceStatus: "VERIFIED",
    primaryReference: "SR EN 13162:2015 & Romanian Fire Normativ P118/2",
    relatedSystems: ["sys-rc-frame", "sys-steel-frame"],
    verifiedAt: "2026-03-01"
  },
  {
    id: "mat-bituminous-membrane",
    slug: "bituminous-waterproofing-membranes",
    name: "Polymer-Modified Bituminous Membranes (SBS / APP)",
    romanianName: "Membrane Bituminoase Modificate (SBS / APP)",
    category: "waterproofing",
    categoryName: "Waterproofing & Protection",
    summary: "Heavy-duty waterproofing sheets modified with SBS elastomers or APP plastomers with non-woven polyester or fiberglass reinforcement.",
    technicalDescription: "Polymer-modified bituminous waterproofing membranes manufactured according to SR EN 13707 (roofs) and SR EN 13969 (foundations). SBS (Styrene-Butadiene-Styrene) modification provides exceptional cold flexibility (down to -20°C) and elastic recovery. APP (Atactic Polypropylene) modification provides high UV and heat resistance (up to +130°C). Typically applied in dual-layer torch-applied or self-adhesive configurations.",
    compositionAndManufacture: [
      "Distilled bitumen modified with SBS synthetic rubbers or APP polymers",
      "Reinforcement matrix: Heavyweight spunbond non-woven polyester (180-250 g/m²) or reinforced glass fiber fleece",
      "Surface finish: Talc, sand, PE film, or mineral slate granules (ardezie) for UV protection"
    ],
    keyProperties: [
      { label: "Tensile Strength (Longitudinal / Transverse)", value: "800 / 600 - 1000 / 800", unit: "N/50mm", standardReference: "SR EN 12311-1", status: "VERIFIED" },
      { label: "Elongation at Break", value: "40 - 50", unit: "%", standardReference: "SR EN 12311-1", status: "VERIFIED" },
      { label: "Cold Flexibility Temperature (SBS)", value: "-20 to -25", unit: "°C", standardReference: "SR EN 1109", status: "VERIFIED" },
      { label: "Flow Resistance at Elevated Temperature (APP)", value: "≥ 120 - 130", unit: "°C", standardReference: "SR EN 1110", status: "VERIFIED" },
      { label: "Watertightness at 60 kPa / 24h", value: "Pass (Impermeable)", standardReference: "SR EN 1928", status: "VERIFIED" }
    ],
    typicalApplications: [
      "Below-grade foundation waterproofing against hydrostatic groundwater pressure (sub basements)",
      "Flat roofs, terraces, balconies, and parking decks",
      "Bridge decks and civil engineering infrastructure waterproofing"
    ],
    advantages: [
      "Robust mechanical thickness (3.5 - 5.0 mm per layer), resisting on-site puncture and aggregate backfill damage",
      "Multi-layer system provides double safety redundancy",
      "Proven 30+ year lifespan when properly detailed and protected",
      "Self-healing micro-elastic properties under SBS formulations"
    ],
    limitations: [
      "Torch application requires open flame, demanding strict on-site hot work fire permits (permis de lucru cu foc)",
      "Heavier freight weight compared to single-ply synthetic membranes",
      "Requires dry, primed concrete substrate (primer bituminos) prior to installation"
    ],
    governingStandards: ["SR EN 13707:2014", "SR EN 13969:2005", "Normativ NP 121 (Waterproofing Design)"],
    sourceTier: "TIER 1 (Official Standard / Eurocode)",
    sourceStatus: "VERIFIED",
    primaryReference: "SR EN 13707 & Romanian Normativ NP 121",
    relatedSystems: ["sys-rc-frame", "sys-rc-shearwall"],
    verifiedAt: "2026-03-01"
  },
  {
    id: "mat-pvc-tpo-membrane",
    slug: "synthetic-waterproofing-pvc-tpo",
    name: "Synthetic Waterproofing Membranes (PVC-P / TPO / FPO)",
    romanianName: "Membrane Sintetice Hidroizolante (PVC / TPO)",
    category: "waterproofing",
    categoryName: "Waterproofing & Protection",
    summary: "Single-ply thermoplastic waterproofing sheets hot-air welded at seams, delivering high elasticity, root resistance, and solar reflectivity.",
    technicalDescription: "Synthetic single-ply waterproofing membranes compliant with SR EN 13956. Plasticized Polyvinyl Chloride (PVC-P) and Thermoplastic Polyolefin (TPO/FPO) sheets reinforced with internal polyester mesh. Welded using automated hot-air equipment (450°C - 550°C) to form homogenous monolithic seams stronger than the parent sheet. Widely utilized in large-scale logistics flat roofs, green roofs, and drinking water reservoirs.",
    compositionAndManufacture: [
      "Thermoplastic Polyolefin (TPO) or plasticized Polyvinyl Chloride (PVC-P) with UV stabilizers and flame retardants",
      "Internal polyester scrim or glass fleece reinforcement"
    ],
    keyProperties: [
      { label: "Tensile Strength (Reinforced)", value: "≥ 1000 - 1100", unit: "N/50mm", standardReference: "SR EN 12311-2", status: "VERIFIED" },
      { label: "Elongation at Break", value: "≥ 15 - 20", unit: "%", standardReference: "SR EN 12311-2", status: "VERIFIED" },
      { label: "Cold Flexibility", value: "≤ -30 to -40", unit: "°C", standardReference: "SR EN 495-5", status: "VERIFIED" },
      { label: "Solar Reflectance Index (SRI - White TPO)", value: "≥ 100 - 105", unit: "SRI", standardReference: "ASTM E1980", status: "VERIFIED" },
      { label: "Root Resistance", value: "Pass (Certified for Green Roofs)", standardReference: "EN 13948 (FLL)", status: "VERIFIED" }
    ],
    typicalApplications: [
      "Large-span industrial and logistics flat roofs (mechanically fastened systems)",
      "Extensive and intensive green roof assemblies (root-resistant)",
      "Potable water tanks, underground civil tunnels, and synthetic swimming pools"
    ],
    advantages: [
      "Completely flame-free installation using precision hot-air robotic welders",
      "Lightweight single-ply installation (1.5 - 2.0 kg/m²), drastically reducing dead load on long-span roofs",
      "High Solar Reflectance (Cool Roof effect), lowering indoor summer cooling air-conditioning loads",
      "Exceptional root puncture resistance without supplementary chemical root inhibitors"
    ],
    limitations: [
      "Demands specialized certified installation technicians and daily test weld calibration",
      "PVC membranes require separation geotextiles when in direct contact with EPS/bitumen to prevent plasticizer migration",
      "Substrate must be completely free of sharp burrs or gravel that could puncture single-ply sheet"
    ],
    governingStandards: ["SR EN 13956:2013", "SR EN 13491", "Normativ NP 121"],
    sourceTier: "TIER 1 (Official Standard / Eurocode)",
    sourceStatus: "VERIFIED",
    primaryReference: "SR EN 13956:2013 & European Standard for Synthetic Membranes",
    relatedSystems: ["sys-steel-frame"],
    verifiedAt: "2026-03-01"
  },
  {
    id: "mat-curtain-wall-facade",
    slug: "curtain-wall-facades",
    name: "Aluminium Curtain Wall & Unitized Facade Systems",
    romanianName: "Fațade Cortină din Aluminiu și Sticlă",
    category: "facade-systems",
    categoryName: "Facade Systems & Envelopes",
    summary: "Non-structural exterior building envelope system hung from floor slabs, comprising extruded aluminium mullions/transoms and insulated glass units.",
    technicalDescription: "Curtain walling systems engineered in accordance with SR EN 13830:2015. Available as stick-built systems (montanți și rigle) or prefabricated unitized elements (elemente vitrate modulare). Designed to resist positive/negative wind pressures (up to 2400 Pa), dynamic water penetration, inter-story seismic building drift (P100-1), and thermal expansion.",
    compositionAndManufacture: [
      "Extruded structural aluminium alloy EN AW-6060 / 6063 T6 profiles with thermal break polyamide bars (24-54mm)",
      "High-performance triple-glazed insulating units with Low-E and solar control coatings",
      "EPDM perimeter weather seals and pressure plates"
    ],
    keyProperties: [
      { label: "Air Permeability", value: "Class AE (up to 600 Pa)", standardReference: "SR EN 12152", status: "VERIFIED" },
      { label: "Watertightness under Dynamic Pressure", value: "Class RE 1200 (1200 Pa)", standardReference: "SR EN 12154", status: "VERIFIED" },
      { label: "Resistance to Wind Load", value: "2400 Pa design / 3600 Pa safety", standardReference: "SR EN 13116", status: "VERIFIED" },
      { label: "Overall System Thermal Transmittance (Ucw)", value: "0.80 - 1.20", unit: "W/(m²·K)", standardReference: "SR EN ISO 12631", status: "VERIFIED" },
      { label: "Acoustic Attenuation (Rw + Ctr)", value: "38 - 45", unit: "dB", standardReference: "SR EN ISO 10140", status: "VERIFIED" }
    ],
    typicalApplications: [
      "Class A commercial office high-rises and institutional headquarters",
      "Mixed-use luxury residential towers and hotel facades",
      "Airport terminals and public transit hubs"
    ],
    advantages: [
      "Maximizes natural daylight penetration and panoramic exterior views",
      "Unitized systems enable rapid off-site quality assembly and high-speed crane installation without external scaffolding",
      "Engineered expansion joints accommodate seismic inter-story drifts without glass fracture"
    ],
    limitations: [
      "High capital expenditure per square meter of building envelope",
      "Requires careful solar control glass specification (g-value ≤ 0.35) to avoid excessive summer cooling loads and indoor glare",
      "Demands specialized periodic facade maintenance and exterior window cleaning cradles (BMU systems)"
    ],
    governingStandards: ["SR EN 13830:2015", "SR EN 14351-1", "Normativ C 107", "P100-1/2013"],
    sourceTier: "TIER 1 (Official Standard / Eurocode)",
    sourceStatus: "VERIFIED",
    primaryReference: "SR EN 13830:2015 Curtain Walling Product Standard",
    relatedSystems: ["sys-rc-frame", "sys-steel-frame"],
    verifiedAt: "2026-03-01"
  },
  {
    id: "mat-insulated-glazing",
    slug: "insulated-glazing-low-e",
    name: "Triple-Pane Insulated Glazing Units (Low-E & Solar Control)",
    romanianName: "Geam Termoizolant Tripan cu Emisie Redusă (Low-E)",
    category: "windows-glass",
    categoryName: "Windows, Doors & Architectural Glass",
    summary: "Hermetically sealed multi-pane glass assembly filled with 90% Argon gas and microscopic metallic Low-E coatings, delivering low U-values for nZEB compliance.",
    technicalDescription: "Insulated Glazing Units (IGUs / geam tripan) manufactured per SR EN 1279-1:2018. Triple-pane configurations (e.g., 4mm Solar Control + 16mm Argon + 4mm Float + 16mm Argon + 4mm Low-E) achieve center-of-glass Ug-values down to 0.5 - 0.6 W/(m²·K). Magnetron sputtering applies sub-nanometer metallic silver layers that reflect infrared heat back into the interior while transmitting visible daylight.",
    compositionAndManufacture: [
      "Float glass sheets: tempered (securizat SR EN 12150) or laminated safety glass (SR EN ISO 12543)",
      "Low-E and Solar Control magnetron coatings",
      "Warm-edge composite spacer bars (TGI / Swisspacer) with molecular sieve desiccant",
      "Dual seal: Polyisobutylene primary seal + Polysulfide/Silicone secondary structural seal, filled with 90% Argon gas"
    ],
    keyProperties: [
      { label: "Center-of-Glass Thermal Transmittance (Ug)", value: "0.50 - 0.60", unit: "W/(m²·K)", standardReference: "SR EN 673", status: "VERIFIED" },
      { label: "Light Transmittance (Tv)", value: "65 - 74", unit: "%", standardReference: "SR EN 410", status: "VERIFIED" },
      { label: "Solar Factor (g-value)", value: "0.35 - 0.50", unit: "ratio", standardReference: "SR EN 410", status: "VERIFIED" },
      { label: "Sound Reduction Index (Rw)", value: "34 - 42", unit: "dB", standardReference: "SR EN ISO 717-1", status: "VERIFIED" },
      { label: "Argon Gas Concentration", value: "≥ 90", unit: "%", standardReference: "SR EN 1279-3", status: "VERIFIED" }
    ],
    typicalApplications: [
      "Exterior residential windows and terrace sliding doors meeting Romanian nZEB requirements",
      "Curtain wall glazing in commercial office buildings",
      "Acoustic noise-barrier glazing along high-traffic urban boulevards"
    ],
    advantages: [
      "Drastically cuts building envelope winter heat losses by up to 70% compared to legacy double glazing",
      "Warm-edge spacers eliminate edge condensation and mold risk at glass perimeter",
      "Solar control coatings mitigate interior overheating during summer peak hours",
      "Safety laminated panes prevent injury from accidental glass breakage"
    ],
    limitations: [
      "Substantial weight (~30 kg/m² for 3x4mm glass), requiring heavy-duty window profile hardware and hinges",
      "Thermal stress breakage risk if glass is partially shaded without edge grinding or heat strengthening",
      "Argon gas will slowly dissipate over decades if secondary edge seals are compromised"
    ],
    governingStandards: ["SR EN 1279-1:2018", "SR EN 410:2011", "SR EN 673:2011", "Normativ C 107"],
    sourceTier: "TIER 1 (Official Standard / Eurocode)",
    sourceStatus: "VERIFIED",
    primaryReference: "SR EN 1279-1:2018 Glass in Building - Insulating Glass Units",
    relatedSystems: ["sys-rc-frame", "sys-confined-masonry"],
    verifiedAt: "2026-03-01"
  },
  {
    id: "mat-asphalt-concrete",
    slug: "asphalt-concrete-pavement",
    name: "Asphalt Concrete & Road Bituminous Mixtures (BA16 / MAS16)",
    romanianName: "Mixturi Asfaltice Rutiere (BA16 / MAS16)",
    category: "infrastructure-materials",
    categoryName: "Infrastructure & Earthworks Materials",
    summary: "Engineered blend of graded mineral aggregates, filler, and road bitumen placed hot and compacted to create durable, rut-resistant flexible pavements.",
    technicalDescription: "Asphalt mixtures produced in accordance with SR EN 13108-1 and Romanian road standard AND 605-2016. Classified into base course (AB22.4 / AB31.5), binder course (BAD22.4), and wearing course (BA16 / MAS16 - Stone Mastic Asphalt). Designed with polymer-modified bitumen (PMB) to prevent rutting under heavy truck traffic in summer (+60°C pavement temperature) and low-temperature thermal cracking in winter (-25°C).",
    compositionAndManufacture: [
      "Crushed hard quarry aggregates (basalt, andesite, granite) compliant with SR EN 13043",
      "Limestone rock filler (<0.063mm)",
      "Paving grade road bitumen 50/70 or Polymer-Modified Bitumen (PMB 45/80-65 per SR EN 14023)",
      "Hot-batch production in asphalt mixing plants at 160°C - 180°C"
    ],
    keyProperties: [
      { label: "Marshall Stability at 60°C (S)", value: "≥ 8.0 - 11.0", unit: "kN", standardReference: "SR EN 12697-34", status: "VERIFIED" },
      { label: "Air Voids Content (Vm)", value: "3.0 - 5.0 (Wearing) / 5.0 - 8.0 (Base)", unit: "%", standardReference: "SR EN 12697-8", status: "VERIFIED" },
      { label: "Wheel Tracking Rutting Rate (WTSair)", value: "≤ 0.08 - 0.10", unit: "mm/10³ cycles", standardReference: "SR EN 12697-22", status: "VERIFIED" },
      { label: "Water Sensitivity (ITSR)", value: "≥ 80 - 90", unit: "%", standardReference: "SR EN 12697-12", status: "VERIFIED" },
      { label: "Compaction Degree", value: "≥ 97 - 98", unit: "% of Marshall density", standardReference: "AND 605-2016", status: "VERIFIED" }
    ],
    typicalApplications: [
      "Motorways (Autostrăzi), national express roads, and metropolitan arterial avenues",
      "Heavy logistics transport terminals and container yard pavements",
      "Urban street surfacing, parking facilities, and bicycle infrastructure"
    ],
    advantages: [
      "Smooth, jointless riding surface delivering low tire-pavement rolling noise and high skid resistance",
      "Rapid traffic opening immediately after compaction and cooling to ambient temperature",
      "100% recyclable into Reclaimed Asphalt Pavement (RAP) for new asphalt production",
      "Easily repairable and resurfaced through asphalt cold milling (frezare)"
    ],
    limitations: [
      "Susceptible to plastic deformation and rutting under static heavy wheel loads if bitumen grade is too soft",
      "Vulnerable to fuel and chemical solvent spills that dissolve the bituminous binder matrix",
      "Demands strictly controlled weather conditions during paving (no rain, ambient temp ≥ +10°C)"
    ],
    governingStandards: ["SR EN 13108-1:2016", "AND 605-2016 (Romanian Technical Norm for Asphalts)", "SR EN 14023 (Polymer-Modified Bitumen)"],
    sourceTier: "TIER 1 (Official Standard / Eurocode)",
    sourceStatus: "VERIFIED",
    primaryReference: "SR EN 13108-1 & Romanian Road Administration Norm AND 605-2016",
    relatedCompanies: ["strabag-romania", "porr-construct-romania", "erbasu-constructii"],
    verifiedAt: "2026-03-01"
  }
];

export const concreteStrengthClassesDataset: ConcreteClass[] = [
  {
    designation: "C8/10",
    cylinderStrengthMpa: 8,
    cubeStrengthMpa: 10,
    characteristicStrengthLabel: "fck,cyl = 8 N/mm² / fck,cube = 10 N/mm²",
    minCementContentKgM3: "180 - 200",
    maxWaterCementRatio: "≤ 0.75",
    typicalApplications: "Lean blinding concrete under foundations (beton de egalizare), non-structural leveling layers, beddings.",
    exposureClasses: ["X0"],
    standardReference: "SR EN 206:2021 & NE 012-1:2022",
    status: "VERIFIED"
  },
  {
    designation: "C12/15",
    cylinderStrengthMpa: 12,
    cubeStrengthMpa: 15,
    characteristicStrengthLabel: "fck,cyl = 12 N/mm² / fck,cube = 15 N/mm²",
    minCementContentKgM3: "220 - 240",
    maxWaterCementRatio: "≤ 0.70",
    typicalApplications: "Unreinforced foundation footings, mass concrete gravity retaining walls, sub-base floor slabs on ground.",
    exposureClasses: ["X0", "XC1"],
    standardReference: "SR EN 206:2021 & NE 012-1:2022",
    status: "VERIFIED"
  },
  {
    designation: "C16/20",
    cylinderStrengthMpa: 16,
    cubeStrengthMpa: 20,
    characteristicStrengthLabel: "fck,cyl = 16 N/mm² / fck,cube = 20 N/mm²",
    minCementContentKgM3: "260 - 280",
    maxWaterCementRatio: "≤ 0.65",
    typicalApplications: "Lightly reinforced structures, continuous strip footings for low-rise residential houses (P+1), perimeter tie beams (centuri).",
    exposureClasses: ["XC1", "XC2"],
    standardReference: "SR EN 206:2021 & NE 012-1:2022",
    status: "VERIFIED"
  },
  {
    designation: "C20/25",
    cylinderStrengthMpa: 20,
    cubeStrengthMpa: 25,
    characteristicStrengthLabel: "fck,cyl = 20 N/mm² / fck,cube = 25 N/mm²",
    minCementContentKgM3: "280 - 300",
    maxWaterCementRatio: "≤ 0.60",
    typicalApplications: "Standard reinforced concrete foundations, slabs, and confined masonry tie-columns (stâlpișori) in non-critical zones.",
    exposureClasses: ["XC1", "XC2", "XC3"],
    standardReference: "SR EN 206:2021 & NE 012-1:2022",
    status: "VERIFIED"
  },
  {
    designation: "C25/30",
    cylinderStrengthMpa: 25,
    cubeStrengthMpa: 30,
    characteristicStrengthLabel: "fck,cyl = 25 N/mm² / fck,cube = 30 N/mm²",
    minCementContentKgM3: "300 - 320",
    maxWaterCementRatio: "≤ 0.55",
    typicalApplications: "The standard structural concrete grade in Romania: multi-story RC frames, floor slabs, structural columns, foundation rafts (radiere). Mandatory minimum for seismic ductility per P100-1.",
    exposureClasses: ["XC1", "XC2", "XC3", "XC4", "XF1"],
    standardReference: "SR EN 206:2021 & NE 012-1:2022",
    status: "VERIFIED"
  },
  {
    designation: "C30/37",
    cylinderStrengthMpa: 30,
    cubeStrengthMpa: 37,
    characteristicStrengthLabel: "fck,cyl = 30 N/mm² / fck,cube = 37 N/mm²",
    minCementContentKgM3: "320 - 350",
    maxWaterCementRatio: "≤ 0.50",
    typicalApplications: "Heavy-duty structural shear walls, high-rise columns, waterproof basement tanks, bridge decks, prestressed precast beams.",
    exposureClasses: ["XC4", "XD1", "XD2", "XF2", "XF3", "XA1"],
    standardReference: "SR EN 206:2021 & NE 012-1:2022",
    status: "VERIFIED"
  },
  {
    designation: "C35/45",
    cylinderStrengthMpa: 35,
    cubeStrengthMpa: 45,
    characteristicStrengthLabel: "fck,cyl = 35 N/mm² / fck,cube = 45 N/mm²",
    minCementContentKgM3: "340 - 380",
    maxWaterCementRatio: "≤ 0.45",
    typicalApplications: "Prestressed concrete bridge girders, high-load transfer slabs (plăci de transfer), deep diaphragm retaining walls, marine works.",
    exposureClasses: ["XD3", "XS1", "XS2", "XF4", "XA2"],
    standardReference: "SR EN 206:2021 & NE 012-1:2022",
    status: "VERIFIED"
  },
  {
    designation: "C40/50",
    cylinderStrengthMpa: 40,
    cubeStrengthMpa: 50,
    characteristicStrengthLabel: "fck,cyl = 40 N/mm² / fck,cube = 50 N/mm²",
    minCementContentKgM3: "360 - 400",
    maxWaterCementRatio: "≤ 0.40",
    typicalApplications: "Tall skyscraper lower-level columns (reducing cross-section size), heavy infrastructure viaducts, post-tensioned civil structures.",
    exposureClasses: ["XD3", "XS3", "XF4", "XA3"],
    standardReference: "SR EN 206:2021 & NE 012-1:2022",
    status: "VERIFIED"
  },
  {
    designation: "C50/60",
    cylinderStrengthMpa: 50,
    cubeStrengthMpa: 60,
    characteristicStrengthLabel: "fck,cyl = 50 N/mm² / fck,cube = 60 N/mm²",
    minCementContentKgM3: "380 - 420",
    maxWaterCementRatio: "≤ 0.38",
    typicalApplications: "High-Performance Concrete (HPC) with silica fume for extreme vertical loads, long-span bridge arches, and high-abrasion hydraulic dams.",
    exposureClasses: ["XD3", "XS3", "XF4", "XA3"],
    standardReference: "SR EN 206:2021 & NE 012-1:2022",
    status: "VERIFIED"
  }
];

export const constructionSystemsDataset: ConstructionSystem[] = [
  {
    id: "sys-rc-frame",
    slug: "reinforced-concrete-frame",
    name: "Reinforced Concrete Frame System (Columns & Beams)",
    romanianName: "Structură în Cadre din Beton Armat",
    structuralPrinciple: "Rigid orthogonal spatial framework of cast-in-place reinforced concrete columns (stâlpi) and beams (grinzi) monolithically connected at joints to resist vertical gravity loads and lateral seismic shears.",
    seismicBehavior: "High seismic ductility when designed per Romanian Code P100-1/2013 (Ductility Class DCH with behavior factor q up to 4.5 - 5.0). Dissipates seismic energy through plastic hinge formation at beam ends while preserving column integrity (strong-column / weak-beam principle).",
    designCodes: ["P100-1/2013", "SR EN 1992-1-1 (Eurocode 2)", "SR EN 1998-1 (Eurocode 8)", "NE 012-1:2022"],
    typicalApplications: ["Multi-story residential apartment buildings", "Commercial office complexes", "Shopping malls and public institutional facilities"],
    advantages: [
      "High architectural flexibility allowing free internal floor partitioning without load-bearing wall constraints",
      "Proven high ductility and seismic energy absorption capacity under Romanian Vrancea earthquakes",
      "Inherent high fire resistance and robust thermal mass inertia"
    ],
    limitations: [
      "Larger lateral drift deformations during earthquakes, requiring seismic decoupling of non-structural masonry infill walls to prevent cracking",
      "Labor-intensive on-site formwork (cofraje) and wet concrete curing cycles"
    ],
    materialDependencies: ["mat-concrete-structural", "mat-reinforcing-steel", "mat-ceramic-blocks", "mat-aac-bca"],
    lifecycleAndDurability: "50 - 100+ years when designed with adequate concrete cover complying with exposure classes XC1-XC4.",
    sourceStatus: "VERIFIED",
    verifiedAt: "2026-03-01"
  },
  {
    id: "sys-rc-shearwall",
    slug: "reinforced-concrete-shear-walls",
    name: "Reinforced Concrete Shear Wall System (Diafragme)",
    romanianName: "Structură cu Pereți Structurali din Beton Armat (Diafragme)",
    structuralPrinciple: "Continuous vertical reinforced concrete wall panels (diafragme) functioning as deep vertical cantilevers that carry gravity loads and provide immense lateral stiffness against seismic and wind forces.",
    seismicBehavior: "Superior lateral stiffness drastically reducing building drift and inter-story displacement during Vrancea seismic events. Governed by P100-1/2013 with behavior factor q = 3.0 - 4.0. Confined boundary elements (bulbi / zone de margine) absorb high flexural compressive and tensile stresses.",
    designCodes: ["P100-1/2013 Section 5.4", "SR EN 1992-1-1", "SR EN 1998-1"],
    typicalApplications: ["High-rise residential towers (10 - 30+ stories)", "Hotel buildings", "Hospital structures requiring minimal lateral drift damage"],
    advantages: [
      "Minimal lateral sway during earthquakes, preventing damage to interior partition walls and facade joinery",
      "Eliminates internal column projections in apartment rooms, providing flush wall finishes",
      "High structural safety redundancy and resistance to progressive collapse"
    ],
    limitations: [
      "Fixed architectural floor layout with rigid load-bearing wall positions that cannot be relocated",
      "Heavier total building dead weight, resulting in higher foundation loads and larger raft slab thickness"
    ],
    materialDependencies: ["mat-concrete-structural", "mat-reinforcing-steel"],
    lifecycleAndDurability: "100+ years under standard maintenance and waterproofing protection.",
    sourceStatus: "VERIFIED",
    verifiedAt: "2026-03-01"
  },
  {
    id: "sys-steel-frame",
    slug: "structural-steel-frame",
    name: "Structural Steel Braced & Moment-Resisting Frame",
    romanianName: "Structură Metalică în Cadre și Contravântuiri",
    structuralPrinciple: "Pre-engineered structural steel columns and beams connected via high-strength bolted or full-penetration welded joints, stabilized by diagonal concentric (CBF) or eccentric (EBF) steel bracings.",
    seismicBehavior: "Eccentrically Braced Frames (EBF) provide world-class seismic performance under P100-1/2013 by concentrating plastic shear yielding within replaceable sacrificial seismic links (link-uri disipative).",
    designCodes: ["P100-1/2013 Section 6", "SR EN 1993-1-1 (Eurocode 3)", "SR EN 1998-1 (Eurocode 8)", "SR EN 1090-2"],
    typicalApplications: ["Industrial logistics and e-commerce distribution centers", "Large-span sports arenas and exhibition pavilions", "Commercial high-rises and data centers"],
    advantages: [
      "Maximum usable open floor area with column-free clear spans exceeding 24 - 36 meters",
      "Fast off-site automated fabrication and rapid dry site erection independent of sub-zero freezing weather",
      "Significantly lighter structure (lower seismic inertial mass and smaller foundation requirements)"
    ],
    limitations: [
      "Requires comprehensive fireproofing (intumescent paints, mineral sprays, or casing) to achieve R60 - R180 ratings",
      "Vulnerable to corrosion in aggressive environments without certified multi-tier protective paint coatings"
    ],
    materialDependencies: ["mat-structural-steel", "mat-pvc-tpo-membrane", "mat-curtain-wall-facade"],
    lifecycleAndDurability: "60 - 100+ years with certified anti-corrosion coating maintenance cycles every 15-20 years.",
    sourceStatus: "VERIFIED",
    verifiedAt: "2026-03-01"
  },
  {
    id: "sys-confined-masonry",
    slug: "confined-masonry-zna",
    name: "Confined Masonry System (Zidărie Confinată - ZC / ZNA)",
    romanianName: "Structură din Zidărie Confinată cu Stâlpișori și Centuri (ZC)",
    structuralPrinciple: "Load-bearing ceramic or concrete masonry walls constructed first, followed by cast-in-place vertical reinforced concrete tie-columns (stâlpișori) and horizontal tie-beams (centuri) to encapsulate and confine the masonry panels on all 4 sides.",
    seismicBehavior: "The concrete tie elements prevent premature out-of-plane buckling and brittle shear collapse of the masonry during seismic events. Romanian code CR 6-2013 restricts building height (typically max P+2 to P+4 depending on ground acceleration ag = 0.20g - 0.40g).",
    designCodes: ["CR 6-2013 (Romanian Masonry Code)", "P100-1/2013", "SR EN 1996-1-1 (Eurocode 6)"],
    typicalApplications: ["Single-family villas and low-rise residential developments (P+1, P+2)", "Schools, clinics, and social community facilities in low-to-medium rise zones"],
    advantages: [
      "High cost efficiency and straightforward execution using local craft labor",
      "Excellent thermal and acoustic insulation integrated directly into structural envelope walls",
      "High intrinsic fire resistance (REI 180 - 240) without additional fireproofing coatings"
    ],
    limitations: [
      "Strict height and floor span limitations governed by CR 6-2013",
      "Requires dense alignment of load-bearing walls on all upper floors, reducing open-space architectural freedom"
    ],
    materialDependencies: ["mat-ceramic-blocks", "mat-concrete-structural", "mat-reinforcing-steel", "mat-eps-insulation"],
    lifecycleAndDurability: "70 - 100+ years with proper roof and plinth waterproofing.",
    sourceStatus: "VERIFIED",
    verifiedAt: "2026-03-01"
  },
  {
    id: "sys-clt-timber",
    slug: "clt-engineered-timber-structures",
    name: "Cross-Laminated Timber (CLT) & Mass Timber System",
    romanianName: "Structură Masivă din Lemn Lamelat Încrucișat (CLT)",
    structuralPrinciple: "Pre-engineered multi-layer solid cross-laminated timber wall and floor panels assembled with structural self-tapping screws and steel hold-downs to create a rigid, lightweight monolithic spatial box.",
    seismicBehavior: "Exceptional seismic resilience due to very low structural mass (~20% of concrete) and ductile mechanical hold-down connection brackets engineered per Eurocode 5 (SR EN 1995-1-1) and P100-1/2013 principles.",
    designCodes: ["SR EN 1995-1-1 (Eurocode 5)", "SR EN 16351", "SR EN 1995-1-2 (Fire)", "P100-1/2013"],
    typicalApplications: ["Sustainable multi-family residential housing (P+2 to P+8)", "nZEB green schools and office pavilions", "Modular eco-resort chalets and alpine developments"],
    advantages: [
      "Negative embodied carbon footprint (massive long-term CO2 sequestration)",
      "Ultra-fast dry erection (up to 50% shorter on-site construction schedules)",
      "High precision CNC prefabrication with integrated service routing conduits",
      "Natural interior timber aesthetic promoting biophilic human well-being"
    ],
    limitations: [
      "Demands meticulous weatherproofing detailing during erection to avoid standing water entrapment",
      "Requires acoustic decoupling resilient strips to meet strict airborne and impact sound insulation norms"
    ],
    materialDependencies: ["mat-clt-timber", "mat-rock-wool", "mat-insulated-glazing"],
    lifecycleAndDurability: "80 - 100+ years when kept below 18% wood moisture content.",
    sourceStatus: "VERIFIED",
    verifiedAt: "2026-03-01"
  },
  {
    id: "sys-precast-concrete",
    slug: "prefabricated-precast-concrete",
    name: "Prefabricated Precast Concrete Structural System",
    romanianName: "Structură Prefabricată din Elemente de Beton Armat și Precomprimat",
    structuralPrinciple: "High-strength factory-cast concrete columns, prestressed TT / I-beams, and hollow-core floor slabs (fâșii cu goluri) transported to site and assembled via grouted sleeve couplers and post-tensioned dry joints.",
    seismicBehavior: "Requires emulative monolithic dry joint connections (noduri rigide sau semi-rigide monolitizate) designed per P100-1/2013 and Eurocode 8 Annex B to ensure ductile earthquake shear transfer.",
    designCodes: ["P100-1/2013 Section 10", "SR EN 13369", "SR EN 1992-1-1", "SR EN 1168"],
    typicalApplications: ["Commercial logistics parks and cold-storage distribution hubs", "Multi-story above-ground parking garages", "Standardized industrial manufacturing halls"],
    advantages: [
      "Unmatched factory concrete quality control (C40/50 to C50/60) and steam-cured surface finishes",
      "Prestressed long spans up to 30 meters carrying extreme floor payloads",
      "High-speed on-site erection independent of freezing winter weather conditions"
    ],
    limitations: [
      "Requires heavy-duty transport logistics and high-capacity mobile mobile cranes (100t - 250t)",
      "Standardized modular bay dimensions limiting bespoke irregular floor architectures"
    ],
    materialDependencies: ["mat-concrete-structural", "mat-reinforcing-steel"],
    lifecycleAndDurability: "80 - 100+ years under certified manufacturing conditions.",
    sourceStatus: "VERIFIED",
    verifiedAt: "2026-03-01"
  },
  {
    id: "sys-hybrid-composite",
    slug: "composite-steel-concrete-hybrid",
    name: "Composite Steel-Concrete Hybrid Structural System",
    romanianName: "Structură Mixtă Oțel-Beton",
    structuralPrinciple: "Structural steel profiles combined with concrete cores, concrete-filled steel tubes (CFT), and profiled steel decking with welded shear studs (conectori de forfecare) acting as a unified composite section.",
    seismicBehavior: "Combines high stiffness of reinforced concrete with high energy-dissipating ductility of structural steel under Eurocode 4 (SR EN 1994) and P100-1/2013.",
    designCodes: ["SR EN 1994-1-1 (Eurocode 4)", "SR EN 1998-1", "P100-1/2013"],
    typicalApplications: ["High-rise skyscraper commercial towers", "Heavy transportation railway/highway bridges", "Large urban multi-story shopping centers"],
    advantages: [
      "Maximizes structural load capacity while minimizing column cross-sectional footprint",
      "Concrete filling protects internal steel against local plate buckling and elevates fire endurance",
      "Composite steel deck acts as immediate safe working platform and eliminates timber slab formwork"
    ],
    limitations: [
      "Requires specialized coordination between structural steel fabricators and concrete casting teams",
      "Demands non-destructive ultrasonic testing of welded shear connectors"
    ],
    materialDependencies: ["mat-structural-steel", "mat-concrete-structural", "mat-reinforcing-steel"],
    lifecycleAndDurability: "100+ years under proper design and maintenance.",
    sourceStatus: "VERIFIED",
    verifiedAt: "2026-03-01"
  }
];

export const constructionProcessesDataset: ConstructionProcess[] = [
  {
    stepNumber: 1,
    slug: "site-organization-geotechnical-excavation",
    name: "Topographical Survey, Site Organization & Geotechnical Excavation",
    romanianName: "Organizare de Șantier, Trasare Topo și Săpătură Generală",
    phase: "SUBSTRUCTURE",
    description: "Geodetic boundary surveying with total station GPS, establishing site perimeter fencing, utility connections, and executing bulk earthwork excavation to the design foundation depth per geotechnical study (Studiu Geotehnic).",
    criticalQualityControls: [
      "Verification of excavation bottom soil bearing capacity (presiune convențională pconv) by certified geotechnical engineer",
      "Topographical level verification against urbanistic datum benchmark (Cota ±0.00)",
      "Excavation wall stability and temporary dewatering groundwater control (epuisment)"
    ],
    normativeRequirements: ["NP 112-2014 (Normativ Fundații)", "NP 074-2014 (Studiu Geotehnic)", "Legea 10/1995"],
    typicalDurationEstimate: "2 - 4 weeks",
    deliverablesAndReception: "Proces Verbal de Trasare & Proces Verbal de Natură a Terenului de Fundare (PVNT)",
    sourceStatus: "VERIFIED"
  },
  {
    stepNumber: 2,
    slug: "lean-concrete-and-foundation-earthworks",
    name: "Blinding Concrete Pouring & Ground Preparation",
    romanianName: "Turnare Beton de Egalizare (Strat de Curățenie)",
    phase: "SUBSTRUCTURE",
    description: "Pouring a 5-10cm thick layer of lean concrete (C8/10 or C12/15) directly onto the inspected foundation ground to create a clean, level, uncontaminated surface for sub-structure waterproofing and rebar positioning.",
    criticalQualityControls: [
      "Subgrade soil moisture and compaction degree verification",
      "Thickness and flatness tolerances of the blinding concrete layer (beton de egalizare)",
      "Concrete delivery ticket verification (SR EN 206 conformity)"
    ],
    normativeRequirements: ["NE 012-1:2022", "NP 112-2014"],
    typicalDurationEstimate: "3 - 7 days",
    deliverablesAndReception: "Raport de Încercare Beton & PV de Lucrări Ascunse (PVLA)",
    sourceStatus: "VERIFIED"
  },
  {
    stepNumber: 3,
    slug: "substructure-waterproofing-application",
    name: "Under-Raft Waterproofing & Protection Layer",
    romanianName: "Hidroizolație Sub Radiere și Protecție Mecanică",
    phase: "SUBSTRUCTURE",
    description: "Installation of multi-layer polymer-modified bituminous membranes (SBS/APP) or synthetic TPO/PVC liners on the blinding concrete, protected by extruded polystyrene (XPS) and geotextile before rebar placement.",
    criticalQualityControls: [
      "Primer adhesion testing and membrane overlap seam weld integrity verification (min 10cm overlap)",
      "Detailing of waterproofing around foundation sump pits, elevator shafts, and drainage penetrations",
      "Continuous protective mortar screed or heavy geotextile layer to prevent rebar puncture"
    ],
    normativeRequirements: ["Normativ NP 121", "SR EN 13707", "SR EN 13969"],
    typicalDurationEstimate: "1 - 2 weeks",
    deliverablesAndReception: "Proces Verbal de Lucrări Ascunse (PVLA Hidroizolație Subterană)",
    sourceStatus: "VERIFIED"
  },
  {
    stepNumber: 4,
    slug: "foundation-reinforcement-and-concreting",
    name: "Foundation Mat / Footing Reinforcement & Mass Concrete Pouring",
    romanianName: "Armare și Turnare Radier General / Fundații Directe",
    phase: "SUBSTRUCTURE",
    description: "Assembly of lower/upper rebar mats (B500B rebar) with certified spacers, installing column/wall starter bars (mustăți), formwork placement, and continuous monolithic ready-mix concrete pouring (C25/30 - C35/45).",
    criticalQualityControls: [
      "Rebar diameter, spacing, lap length (lungime de ancorare), and bottom concrete cover (distanțieri min 50mm)",
      "Starter bar positioning and seismic hook geometry per P100-1/2013",
      "Slump test workability measurement on site and compression test cube sampling (epruvete) per NE 012-1:2022"
    ],
    normativeRequirements: ["P100-1/2013", "NE 012-1:2022", "SR EN 1992-1-1"],
    typicalDurationEstimate: "2 - 4 weeks",
    deliverablesAndReception: "PVLA Armare Radier & Bonuri de Livrare Beton & Buletine de Încercare la 28 Zile",
    sourceStatus: "VERIFIED"
  },
  {
    stepNumber: 5,
    slug: "basement-walls-and-ground-slab",
    name: "Basement Shear Walls, Columns & Ground Floor Slab",
    romanianName: "Pereți Mulati / Diafragme Subsol și Placă peste Subsol (Cota ±0.00)",
    phase: "SUBSTRUCTURE",
    description: "Erecting vertical perimeter basement shear walls, installing waterproofing waterstops (profile hidroizolante expandabile / waterstop PVC) at cold joints, formwork, and casting the ground floor transfer slab.",
    criticalQualityControls: [
      "Waterstop profile positioning in the cold joint (rost de turnare)",
      "Compaction vibration to prevent honeycombing (segregări) in tall basement wall forms",
      "External perimeter bituminous/polyurethane waterproofing and XPS thermal insulation application"
    ],
    normativeRequirements: ["NE 012-1:2022", "NP 121", "Normativ C 107"],
    typicalDurationEstimate: "3 - 5 weeks",
    deliverablesAndReception: "Proces Verbal de Recepție a Structurii Subterane (Infrastructură)",
    sourceStatus: "VERIFIED"
  },
  {
    stepNumber: 6,
    slug: "superstructure-vertical-elements",
    name: "Superstructure Columns & Shear Walls (Stâlpi și Diafragme)",
    romanianName: "Armare, Cofrare și Turnare Elemente Verticale Suprastructură",
    phase: "SUPERSTRUCTURE",
    description: "Sequential erection of reinforced concrete columns and shear walls for each floor story, verifying verticality with laser levels and securing seismic confinement stirrups per P100-1/2013.",
    criticalQualityControls: [
      "Confinement stirrup spacing (pasul etrierilor în zonele plastice critice: 5-10cm)",
      "Formwork plumbness and alignment tolerances (max 5mm deviation per floor)",
      "Concrete vibration and minimum 3-day curing before formwork stripping (decofrare)"
    ],
    normativeRequirements: ["P100-1/2013 Section 5", "NE 012-1:2022"],
    typicalDurationEstimate: "1 - 2 weeks per story",
    deliverablesAndReception: "PVLA Armare Elemente Verticale (etaj curent)",
    sourceStatus: "VERIFIED"
  },
  {
    stepNumber: 7,
    slug: "superstructure-horizontal-slabs-beams",
    name: "Superstructure Floor Slabs & Beams (Grinzi și Plăci)",
    romanianName: "Cofrare, Armare și Turnare Grinzi și Plăci Peste Etaj",
    phase: "SUPERSTRUCTURE",
    description: "Installing modular slab shoring props, formwork decking, upper/lower rebar networks, edge beam reinforcement cages, and monolithic concrete pouring and laser leveling.",
    criticalQualityControls: [
      "Shoring prop capacity (popi metalici) and propping schedule per NE 012-1:2022",
      "Negative reinforcement positioning over supports (armături de continuitate pe reazeme)",
      "Curing moisture maintenance (stropire cu apă / pelicule de protecție) for min 7 days"
    ],
    normativeRequirements: ["SR EN 1992-1-1", "NE 012-1:2022", "P100-1/2013"],
    typicalDurationEstimate: "1 - 2 weeks per floor level",
    deliverablesAndReception: "PVLA Armare Placă & PV de Decofrare (la atingerea a 70-80% R28)",
    sourceStatus: "VERIFIED"
  },
  {
    stepNumber: 8,
    slug: "exterior-and-interior-masonry-enclosure",
    name: "Masonry Infill & Enclosure Wall Construction",
    romanianName: "Zidărie de Închidere Exterioară și Compartimentare Interioară",
    phase: "SUPERSTRUCTURE",
    description: "Laying ceramic blocks or AAC (BCA) for exterior perimeter walls and interior apartment dividing walls, incorporating seismic flexible joint gaps under concrete beams per CR 6-2013.",
    criticalQualityControls: [
      "Mortar joint thickness (10-12mm conventional mortar / 1-2mm thin-bed adhesive)",
      "Mechanical anchoring ties (agrate de ancorare inox) connecting masonry to RC columns every 2 courses",
      "Top joint elastic gap (rost de deformare 2-3cm sub grindă) filled with compressible polyurethane foam"
    ],
    normativeRequirements: ["CR 6-2013", "SR EN 1996-1-1", "P100-1/2013"],
    typicalDurationEstimate: "4 - 8 weeks",
    deliverablesAndReception: "Proces Verbal de Recepție a Structurii de Rezistență la Roșu (Final Structură)",
    sourceStatus: "VERIFIED"
  },
  {
    stepNumber: 9,
    slug: "roof-assembly-and-waterproofing",
    name: "Roof Structure, Thermal Insulation & Waterproofing Assembly",
    romanianName: "Termohidroizolație Terasă / Șarpantă Acoperiș",
    phase: "ENVELOPE & ROOFING",
    description: "Executing slope screeds (șapă de pantă min 1.5-2%), vapor barrier, thermal insulation (XPS or Rock Wool min 20-30cm per nZEB), dual-layer SBS bituminous or TPO synthetic waterproofing, and drainage scuppers.",
    criticalQualityControls: [
      "Slope screed gradient verification towards rainwater drainage outlets (guri de scurgere)",
      "Parapet upstand waterproofing detailing (atice min 30cm above finished roof surface)",
      "Flood test (proba de inundare) with 5-10cm water retention for minimum 48 hours without leakage"
    ],
    normativeRequirements: ["Normativ NP 121", "Normativ C 107", "NP 068-02"],
    typicalDurationEstimate: "3 - 6 weeks",
    deliverablesAndReception: "Proces Verbal de Probă de Inundare Terasă & PVLA Învelitoare",
    sourceStatus: "VERIFIED"
  },
  {
    stepNumber: 10,
    slug: "exterior-windows-and-curtain-walling",
    name: "Windows, Doors & Curtain Wall Installation",
    romanianName: "Montaj Tâmplărie Exterioară și Fațade Vitrate",
    phase: "ENVELOPE & ROOFING",
    description: "Precision installation of PVC/aluminium triple-glazed window joinery with RAL certified 3-layer perimeter sealing tapes (interior airtight tape + intermediate PU foam + exterior vapor-permeable driving-rain tape).",
    criticalQualityControls: [
      "RAL installation sealing tape integrity (etanșare la aer și vapori pe interior, permeabilă la exterior)",
      "Anchor bolt depth into concrete/masonry and diagonal frame squareness checks",
      "Glass label verification for Low-E and solar control coating orientation"
    ],
    normativeRequirements: ["SR EN 14351-1", "Normativ C 107", "SR EN ISO 10077-1"],
    typicalDurationEstimate: "3 - 6 weeks",
    deliverablesAndReception: "Proces Verbal de Montaj Tâmplărie & Certificate de Conformitate CE",
    sourceStatus: "VERIFIED"
  },
  {
    stepNumber: 11,
    slug: "facade-thermal-insulation-etics",
    name: "Exterior Facade Insulation (ETICS) & Ventilated Cladding",
    romanianName: "Termosistem Fațadă (ETICS) / Fațadă Ventilată",
    phase: "ENVELOPE & ROOFING",
    description: "Bonding EPS/Rock Wool boards with polymer cement adhesive, mechanical anchor doweling (dibluri min 6-8 buc/m²), mineral wool fire barriers per P118/2, embedding fiberglass mesh in basecoat mortar, and applying decorative silicone render.",
    criticalQualityControls: [
      "Adhesive contact surface area (min 40% surface coverage via perimeter-and-dots method)",
      "Fiberglass mesh overlap (min 10cm) and double diagonal reinforcement at window corners (șpaleți)",
      "Continuous Rock Wool fire barrier strips (brâuri rezistente la foc) around floor slab perimeters"
    ],
    normativeRequirements: ["EAD 040083-00-0404 (ETICS)", "Normativ P118/2", "Normativ C 107"],
    typicalDurationEstimate: "6 - 12 weeks",
    deliverablesAndReception: "PVLA Armare Plase Termosistem & Certificat Performanță Energetică",
    sourceStatus: "VERIFIED"
  },
  {
    stepNumber: 12,
    slug: "mep-rough-in-installations",
    name: "Internal MEP Rough-In (Plumbing, HVAC, Electrical, Fire)",
    romanianName: "Instalații Sanitare, Termice, HVAC, Electrice și Curenți Slabi (Trasee Îngropate)",
    phase: "MEP & FINISHES",
    description: "Installing concealed conduits, cable trays, PEX underfloor heating piping, drainage stacks (coloane canalizare), ventilation ductwork, fire suppression sprinkler piping, and electrical distribution boxes.",
    criticalQualityControls: [
      "Hydrostatic pressure testing of water and heating pipes (min 1.5× working pressure for 24h)",
      "Gravity drainage flow slope checks and smoke/camera testing for airtightness",
      "Electrical insulation resistance megohmmeter testing per Normativ I7"
    ],
    normativeRequirements: ["Normativ I7-2011 (Electrice)", "Normativ I9-2015 (Sanitare)", "Normativ I13-2015 (Termice)", "Normativ P118"],
    typicalDurationEstimate: "6 - 12 weeks",
    deliverablesAndReception: "Proces Verbal de Probă de Presiune la Instalații Sanitare/Termice & PVLA Trasee Electrice",
    sourceStatus: "VERIFIED"
  },
  {
    stepNumber: 13,
    slug: "internal-plasters-and-screeds",
    name: "Internal Plastering & Self-Leveling Floor Screeds",
    romanianName: "Tencuieli Interioare Mecanizate și Turnare Șape de Pardoseală",
    phase: "MEP & FINISHES",
    description: "Applying mechanized gypsum/cement base plasters on walls and ceiling surfaces, perimeter acoustic insulation strips, and pouring floating floor screeds (șape flotante peste izolație fonică).",
    criticalQualityControls: [
      "Wall surface plumbness and right-angle corner squareness checks (toleranțe max 2mm sub dreptar de 2m)",
      "Floor screed compressive strength and residual moisture content (< 2% CM for parquet installation)",
      "Perimeter expansion decoupling bands around all walls and door thresholds"
    ],
    normativeRequirements: ["SR EN 998-1", "SR EN 13813", "NE 001-1996"],
    typicalDurationEstimate: "4 - 8 weeks",
    deliverablesAndReception: "Proces Verbal de Recepție Calitativă Tencuieli și Șape",
    sourceStatus: "VERIFIED"
  },
  {
    stepNumber: 14,
    slug: "interior-finishes-and-fitout",
    name: "Interior Architectural Finishes (Tiling, Painting, Flooring)",
    romanianName: "Finisaje Interioare (Gresie, Faianță, Parchet, Zugrăveli, Uși)",
    phase: "MEP & FINISHES",
    description: "Executing ceramic/stone tiling in bathrooms, applying washable interior emulsion paints, installing engineered parquet flooring, interior doors, and architectural lighting fixtures.",
    criticalQualityControls: [
      "Tile adhesive hollow-free coverage and waterproof liquid membrane (hidroizolație sub gresie) in showers",
      "Paint finish uniformity under grazing light conditions",
      "Acoustic perimeter door gasket seals and smooth hardware operation"
    ],
    normativeRequirements: ["SR EN 12004", "SR EN 14411", "Normativ C 107"],
    typicalDurationEstimate: "6 - 12 weeks",
    deliverablesAndReception: "Proces Verbal de Recepție a Lucrărilor de Finisare",
    sourceStatus: "VERIFIED"
  },
  {
    stepNumber: 15,
    slug: "commissioning-reception-carte-tehnica",
    name: "MEP Commissioning, Technical Dossier & Official Handover Reception",
    romanianName: "Punere în Funcțiune, Recepție la Terminarea Lucrărilor și Cartea Tehnică",
    phase: "COMMISSIONING",
    description: "Full functional testing of HVAC heat pumps, ventilation air balancing, fire alarm and smoke extraction commissioning, compiling the complete Technical Dossier (Cartea Tehnică a Construcției), and convening the official Reception Committee (Comisia de Recepție la Terminarea Lucrărilor) per HG 273/1994.",
    criticalQualityControls: [
      "Fire safety operational compliance certificate issued by ISU (Autorizație de Securitate la Incendiu)",
      "Final Energy Performance Certificate (Certificat de Performanță Energetică clasa A)",
      "Complete assembly of all PVLA, lab test reports, material certificates, and as-built drawings in the Cartea Tehnică"
    ],
    normativeRequirements: ["HG 273/1994 (Regulament Recepție)", "Legea 10/1995", "Legea 50/1991", "Legea 372/2005"],
    typicalDurationEstimate: "4 - 8 weeks",
    deliverablesAndReception: "Proces Verbal de Recepție la Terminarea Lucrărilor (PVRTL) & Cartea Tehnică a Construcției",
    sourceStatus: "VERIFIED"
  }
];

export const constructionGlossaryDataset: GlossaryTerm[] = [
  {
    slug: "pot",
    term: "POT",
    fullAcronymName: "Procent de Ocupare a Terenului (Ground Coverage Ratio)",
    romanianTerm: "Procentul de Ocupare a Terenului",
    category: "URBANISM & PERMITTING",
    definition: "The percentage ratio between the ground-level built footprint area of a building (Suprafața Construită la Sol - Sc) and the total cadastral plot land area (Suprafața Terenului - St). Formula: POT = (Sc / St) × 100.",
    practicalApplication: "Mandatory urban planning constraint established in the General Urban Plan (PUG) or Zonal Urban Plan (PUZ). For instance, a 1,000 sqm plot with a maximum allowable POT of 40% restricts the building ground footprint to no more than 400 sqm.",
    regulatoryContext: "Legea 350/2001 privind amenajarea teritoriului și urbanismul & Legea 50/1991",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "cut",
    term: "CUT",
    fullAcronymName: "Coeficient de Utilizare a Terenului (Floor Area Ratio)",
    romanianTerm: "Coeficientul de Utilizare a Terenului",
    category: "URBANISM & PERMITTING",
    definition: "The numerical ratio between the total gross above-ground built floor area (Suprafața Desfășurată Supraterană - Sd) and the total cadastral plot area (Suprafața Terenului - St). Formula: CUT = Sd / St.",
    practicalApplication: "Governs total building development density and volume. On a 1,000 sqm plot, a maximum CUT of 2.5 allows a maximum above-ground gross floor area of 2,500 sqm (underground basement areas used for parking/technical rooms are excluded from CUT calculations per Romanian law).",
    regulatoryContext: "Legea 350/2001 & Normele Metodologice ale Legii 50/1991",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "p-plus-one",
    term: "P+1 / P+2 / P+4",
    fullAcronymName: "Regim de Înălțime (Story Height Classification)",
    romanianTerm: "Regimul de Înălțime",
    category: "URBANISM & PERMITTING",
    definition: "Standard Romanian architectural height notation designating above-ground floors: P (Parter / Ground floor) + number of upper stories (e.g., P+1 = Ground + 1 Floor; P+4 = Ground + 4 Floors; S+P+10E+Er = Basement + Ground + 10 Floors + Recessed Penthouse).",
    practicalApplication: "Strictly defined in Urban Planning Certificates (Certificat de Urbanism) to regulate neighborhood skyline harmony, solar shadow angles, and seismic design rules under P100-1.",
    regulatoryContext: "Legea 50/1991 & Regulamente Locale de Urbanism (RLU)",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "rh",
    term: "RH",
    fullAcronymName: "Regim de Înălțime (Height Regime)",
    romanianTerm: "Regim de Înălțime",
    category: "URBANISM & PERMITTING",
    definition: "Urbanistic abbreviation designating the maximum permitted vertical envelope height, typically specified both as number of levels (e.g., 2S+P+8E) and absolute cornice/ridge height in meters (e.g., Hmax = 32.00m).",
    practicalApplication: "Defines the vertical 3D zoning boundary for developer permits in Urbanism Certificates.",
    regulatoryContext: "Legea 350/2001 & PUG București / Cluj / Timișoara",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "ac",
    term: "AC",
    fullAcronymName: "Autorizație de Construire (Building Permit)",
    romanianTerm: "Autorizația de Construire",
    category: "URBANISM & PERMITTING",
    definition: "Official legal administrative act issued by municipal authorities (Primărie / Consiliu Județean) authorizing the execution of construction works based on a fully verified Technical Authorization Project (PAC / DTAC).",
    practicalApplication: "No civil construction work can legally commence without an active, published Building Permit. Work performed without AC constitutes a legal offense punishable under Legea 50/1991.",
    regulatoryContext: "Legea 50/1991 privind autorizarea executării lucrărilor de construcții",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "u-value",
    term: "U-value (Coeficient de Transfer Termic U)",
    fullAcronymName: "Thermal Transmittance (W/m²·K)",
    romanianTerm: "Coeficient de Transfer Termic (U)",
    category: "ENERGY & BUILDING PHYSICS",
    definition: "The rate of heat transfer through one square meter of a building element (wall, roof, window, slab) divided by the temperature difference across the element. Measured in W/(m²·K). Lower U-values indicate superior thermal insulation.",
    practicalApplication: "Romanian nZEB regulations (Normativ C 107) enforce maximum permissible U-values: exterior walls U ≤ 0.18 - 0.20 W/m²K, flat roofs U ≤ 0.12 - 0.15 W/m²K, windows Uw ≤ 0.85 - 1.10 W/m²K.",
    regulatoryContext: "Normativ C 107/2005 & Legea 372/2005 privind performanța energetică a clădirilor (nZEB)",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "thermal-bridge",
    term: "Thermal Bridge (Punte Termică)",
    fullAcronymName: "Punte Termică Liniară / Punctuală",
    romanianTerm: "Punte Termică",
    category: "ENERGY & BUILDING PHYSICS",
    definition: "A localized area of a building envelope where the thermal resistance is significantly lower than the surrounding wall, typically occurring at reinforced concrete column-slab intersections, balcony penetrations, and window frame perimeters.",
    practicalApplication: "Thermal bridges lead to localized interior surface cooling, high winter heat loss, condensation risk, and toxic mold growth. Mitigated through continuous exterior insulation (ETICS) and structural thermal break balcony connectors (Isokorb).",
    regulatoryContext: "Normativ C 107/2-2005 & SR EN ISO 14683",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "raft-foundation",
    term: "Raft Foundation (Radier General)",
    fullAcronymName: "Fundație de Tip Radier General din Beton Armat",
    romanianTerm: "Radier General",
    category: "STRUCTURAL ENGINEERING",
    definition: "A thick continuous reinforced concrete slab extending over the entire footprint area of a building, supporting all structural columns and walls while distributing the total building load uniformly across the ground.",
    practicalApplication: "Standard foundation system for multi-story and high-rise buildings in soft, cohesive Romanian alluvial soils (e.g., Bucharest clay and silts) to prevent differential settlements (tasări inegale).",
    regulatoryContext: "Normativ NP 112-2014 & SR EN 1997-1 (Eurocode 7)",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "load-bearing-wall",
    term: "Load-Bearing Wall (Perete Portant / Structural)",
    fullAcronymName: "Perete Structural Portant",
    romanianTerm: "Perete Portant",
    category: "STRUCTURAL ENGINEERING",
    definition: "A vertical structural wall engineered to transmit gravitational floor and roof loads, as well as lateral wind and seismic forces, directly down to the foundation.",
    practicalApplication: "Must never be demolished, cut, or altered without structural engineering verification and a formal Building Permit.",
    regulatoryContext: "CR 6-2013 & P100-1/2013 & Legea 10/1995",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "pvla",
    term: "PVLA (Proces Verbal de Lucrări Ascunse)",
    fullAcronymName: "Proces Verbal de Lucrări Ascunse (Hidden Works Inspection Report)",
    romanianTerm: "Proces Verbal de Lucrări Ascunse",
    category: "EXECUTION & SITE MANAGEMENT",
    definition: "Mandatory legal document signed jointly by the Site Supervisor (Diriginte de Șantier), Structural Designer (Proiectant), and Contractor (Constructor) certifying that concealed structural elements (e.g., foundation rebar before pouring concrete) comply fully with technical drawings.",
    practicalApplication: "Essential legal requirement under Romanian Construction Quality Law (Legea 10/1995). Without signed PVLA, concrete pouring cannot proceed and the final reception will be rejected.",
    regulatoryContext: "Legea 10/1995 & Proceduri ISC (Inspectoratul de Stat în Construcții)",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "cartea-tehnica",
    term: "Cartea Tehnică a Construcției",
    fullAcronymName: "Cartea Tehnică a Construcției (Building Technical Dossier)",
    romanianTerm: "Cartea Tehnică a Construcției",
    category: "EXECUTION & SITE MANAGEMENT",
    definition: "The comprehensive permanent archive of a building containing all design blueprints, permits, geotechnical studies, materials quality certificates, PVLA hidden work records, concrete test lab reports, and operation manuals throughout its entire lifespan.",
    practicalApplication: "Mandatory by law (HG 273/1994). Transferred to the building owners' association or asset owner upon handover and must be preserved for the entire lifetime of the building.",
    regulatoryContext: "HG 273/1994 & Legea 10/1995",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "seismic-link",
    term: "Seismic Dissipative Link (Link Seismic)",
    fullAcronymName: "Element Disipativ Seismic",
    romanianTerm: "Link Seismic Disipativ",
    category: "STRUCTURAL ENGINEERING",
    definition: "A designated structural segment in Eccentrically Braced Steel Frames (EBF) engineered to yield plastically under severe seismic ground shaking, dissipating kinetic earthquake energy while protecting main columns and beams from damage.",
    practicalApplication: "Core seismic protection strategy in modern Romanian steel engineering under P100-1/2013.",
    regulatoryContext: "P100-1/2013 Section 6 & SR EN 1998-1",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "concrete-curing",
    term: "Concrete Curing (Tratarea / Maturarea Betonului)",
    fullAcronymName: "Maturarea și Tratarea Betonului Proaspăt",
    romanianTerm: "Tratarea Betonului",
    category: "MATERIALS & TESTING",
    definition: "The controlled process of maintaining moisture and favorable temperature in freshly poured concrete for a specified duration (typically minimum 7 days per NE 012-1:2022) to allow complete cement hydration and prevent plastic shrinkage cracking.",
    practicalApplication: "Achieved via water sprinkling, wet burlap covering, or spraying chemical curing curing membranes (pelicule de protecție).",
    regulatoryContext: "NE 012-1:2022 Section 10 & SR EN 13670",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "expansion-joint",
    term: "Expansion Joint (Rost de Dilatare / Seism)",
    fullAcronymName: "Rost de Dilatare Termică și Seism",
    romanianTerm: "Rost de Dilatare",
    category: "STRUCTURAL ENGINEERING",
    definition: "A designed structural gap between adjacent building sections allowing independent movement caused by thermal expansion, concrete shrinkage, differential settlement, or seismic sway without inducing destructive internal stresses.",
    practicalApplication: "Mandated for long buildings (typically exceeding 30-40 meters length) and at junctions between building wings of different heights.",
    regulatoryContext: "P100-1/2013 & SR EN 1992-1-1",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "vapor-barrier",
    term: "Vapor Barrier (Barieră Contra Vaporilor)",
    fullAcronymName: "Barieră de Vapori cu Rezistență Ridicată (Sd > 100m)",
    romanianTerm: "Barieră de Vapori",
    category: "ENERGY & BUILDING PHYSICS",
    definition: "A low-permeability membrane installed on the warm interior side of thermal insulation to prevent warm, humid indoor air from penetrating into the insulation layer and condensing into liquid water.",
    practicalApplication: "Mandatory in flat roofs, timber frame walls, and attic ceilings.",
    regulatoryContext: "Normativ C 107 & SR EN 13984",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "slab",
    term: "Floor Slab (Placă din Beton Armat)",
    fullAcronymName: "Placă Structurală Orizontală",
    romanianTerm: "Placă de Beton",
    category: "STRUCTURAL ENGINEERING",
    definition: "A horizontal structural reinforced concrete element that carries floor live loads and acts as a rigid horizontal diaphragm distributing seismic forces to vertical shear walls and columns.",
    practicalApplication: "Standard thickness ranges from 14cm to 25cm in modern residential and office construction.",
    regulatoryContext: "SR EN 1992-1-1 & P100-1/2013",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "beam",
    term: "Beam (Grindă Structurală)",
    fullAcronymName: "Grindă din Beton Armat / Oțel",
    romanianTerm: "Grindă",
    category: "STRUCTURAL ENGINEERING",
    definition: "A horizontal or inclined structural member designed to resist bending moments and shear forces transmitted by floor slabs and roof decks.",
    practicalApplication: "Formulates structural frame portals together with columns.",
    regulatoryContext: "SR EN 1992-1-1 & SR EN 1993-1-1",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "column",
    term: "Column (Stâlp Structural)",
    fullAcronymName: "Stâlp de Rezistență",
    romanianTerm: "Stâlp",
    category: "STRUCTURAL ENGINEERING",
    definition: "A vertical structural compression member transmitting gravitational and seismic axial loads and bending moments down to the foundation.",
    practicalApplication: "Confined with closely spaced transverse stirrups in critical end zones per P100-1/2013.",
    regulatoryContext: "P100-1/2013 & SR EN 1992-1-1",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "footing",
    term: "Spread Footing (Fundație Directă / Izolată)",
    fullAcronymName: "Fundație Izolată sau Continuă sub Ziduri",
    romanianTerm: "Fundație Directă",
    category: "STRUCTURAL ENGINEERING",
    definition: "A shallow foundation element that enlarges the base area of a column or wall to transmit its load to the soil at a pressure not exceeding the allowable bearing capacity.",
    practicalApplication: "Used on competent ground with high bearing capacity.",
    regulatoryContext: "NP 112-2014 & SR EN 1997-1",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "pile",
    term: "Foundation Pile (Pilot Forat)",
    fullAcronymName: "Pilot Forat de Mare Adâncime",
    romanianTerm: "Pilot Forat",
    category: "STRUCTURAL ENGINEERING",
    definition: "A deep foundation cylinder of reinforced concrete cast into the ground to transfer structural loads down through soft, weak soils to deeper, solid load-bearing geological strata.",
    practicalApplication: "Essential for tall towers and bridge abutments in alluvial river plains.",
    regulatoryContext: "NP 112-2014 & SR EN 1536",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "retaining-wall",
    term: "Retaining Wall (Zid de Sprijin)",
    fullAcronymName: "Zid de Sprijin din Beton Armat",
    romanianTerm: "Zid de Sprijin",
    category: "STRUCTURAL ENGINEERING",
    definition: "A structural wall engineered to resist lateral soil and water earth pressures, preventing slope collapse and retaining embankments.",
    practicalApplication: "Used for basement excavations, underground parking, and hillside terrain stabilization.",
    regulatoryContext: "SR EN 1997-1 & NP 112-2014",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "formwork",
    term: "Formwork (Cofraj)",
    fullAcronymName: "Sistem de Cofrare Modular",
    romanianTerm: "Cofraj",
    category: "EXECUTION & SITE MANAGEMENT",
    definition: "A temporary or permanent mold into which concrete is poured and held in shape until it has set and gained sufficient compressive strength.",
    practicalApplication: "System formworks (e.g., Doka, Peri) use phenolic plywood and steel/aluminium frames.",
    regulatoryContext: "NE 012-1:2022",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "reinforcement",
    term: "Reinforcement (Armătură)",
    fullAcronymName: "Armătură din Oțel Beton",
    romanianTerm: "Armătură",
    category: "MATERIALS & TESTING",
    definition: "Steel bars, mesh, or fibers embedded in concrete to provide tensile and shear strength.",
    practicalApplication: "Assembled according to structural engineering rebar bending schedules (extrase de armătură).",
    regulatoryContext: "SR EN 10080 & P100-1/2013",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "aggregate",
    term: "Aggregate (Agregate Minerale)",
    fullAcronymName: "Nisip, Pietriș și Criblură",
    romanianTerm: "Agregate",
    category: "MATERIALS & TESTING",
    definition: "Granular mineral materials (sand, gravel, crushed rock) constituting 70-80% of concrete volume.",
    practicalApplication: "Graded per standard sieve curves (0-4mm, 4-8mm, 8-16mm, 16-31.5mm) per SR EN 12620.",
    regulatoryContext: "SR EN 12620:2013",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "cement",
    term: "Hydraulic Cement (Ciment)",
    fullAcronymName: "Ciment Portland și Ciment Compozit",
    romanianTerm: "Ciment",
    category: "MATERIALS & TESTING",
    definition: "A finely ground inorganic hydraulic binder that sets and hardens by reacting with water (hydration) to form insoluble crystalline calcium silicate hydrates.",
    practicalApplication: "Classified into CEM I - CEM V per SR EN 197-1.",
    regulatoryContext: "SR EN 197-1:2011",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "mortar",
    term: "Mortar (Mortar de Zidărie și Tencuială)",
    fullAcronymName: "Mortar Industrial Uscat",
    romanianTerm: "Mortar",
    category: "MATERIALS & TESTING",
    definition: "A workable mixture of cementitious binders, fine aggregates (sand <2mm), water, and admixtures used to bind masonry units or coat wall surfaces.",
    practicalApplication: "Classified by compressive strength (e.g., M5, M10 per SR EN 998-2).",
    regulatoryContext: "SR EN 998-1 & SR EN 998-2",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "screed",
    term: "Screed (Șapă de Pardoseală)",
    fullAcronymName: "Șapă pe Bază de Ciment / Anhidrit",
    romanianTerm: "Șapă",
    category: "MATERIALS & TESTING",
    definition: "A layer of cementitious mortar laid in-situ to obtain a smooth, level floor surface suitable for receiving final floor finishes or encapsulating underfloor heating pipes.",
    practicalApplication: "Classified into CT-C20-F4 (Cementitious, 20 MPa compressive, 4 MPa flexural).",
    regulatoryContext: "SR EN 13813:2003",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "nzeb",
    term: "nZEB (nearly Zero-Energy Building)",
    fullAcronymName: "Clădire cu Consum de Energie Aproape Zero",
    romanianTerm: "Clădire nZEB",
    category: "ENERGY & BUILDING PHYSICS",
    definition: "A building that has a very high energy performance, with near-zero energy demand covered to a very significant extent by energy from renewable sources produced on-site or nearby.",
    practicalApplication: "Mandatory by law in Romania for all newly constructed buildings since January 1, 2021.",
    regulatoryContext: "Directiva EPBD & Legea 372/2005 (republicată)",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "etics",
    term: "ETICS (External Thermal Insulation Composite System)",
    fullAcronymName: "Sistem Compozit de Izolare Termică la Exterior",
    romanianTerm: "Termosistem ETICS",
    category: "ENERGY & BUILDING PHYSICS",
    definition: "A factory-specified kit comprising insulation boards (EPS, Rock Wool), adhesive, mechanical anchor fixings, basecoat reinforced with fiberglass mesh, and decorative finish render.",
    practicalApplication: "Standard exterior thermal envelope solution in Romania.",
    regulatoryContext: "EAD 040083-00-0404 & Normativ C 107",
    sourceStatus: "VERIFIED"
  },
  {
    slug: "air-permeability-blower-door",
    term: "Airtightness & Blower Door Test (Etanșeitate la Aer n50)",
    fullAcronymName: "Testul de Presurizare / Depresurizare Blower Door",
    romanianTerm: "Etanșeitate la Aer (n50)",
    category: "ENERGY & BUILDING PHYSICS",
    definition: "Building envelope airtightness measurement quantifying the air change rate at 50 Pascal pressure differential (n50 in h⁻¹).",
    practicalApplication: "Ensures controlled ventilation performance and eliminates unconditioned draft heat losses in nZEB buildings (n50 ≤ 1.5 h⁻¹).",
    regulatoryContext: "SR EN ISO 9972 & Normativ C 107",
    sourceStatus: "VERIFIED"
  }
];

export const standardsRegistryDataset: StandardReference[] = [
  {
    code: "SR EN 1990:2004",
    title: "Eurocode - Basis of structural design",
    organization: "CEN / ASRO",
    scope: "Fundamental principles and requirements for safety, serviceability, and durability of structures, basis of design and verification, guidelines for structural reliability.",
    year: 2004,
    tier: "TIER 1 (Official Standard / Eurocode)"
  },
  {
    code: "SR EN 1991-1-1 to 1991-1-7",
    title: "Eurocode 1: Actions on structures (Dead loads, live loads, snow, wind, thermal, accidental)",
    organization: "CEN / ASRO",
    scope: "Design actions on buildings, densities of building materials, self-weight, imposed loads, snow loads (CR 1-1-3), wind actions (CR 1-1-4).",
    year: 2006,
    tier: "TIER 1 (Official Standard / Eurocode)"
  },
  {
    code: "SR EN 1992-1-1:2004",
    title: "Eurocode 2: Design of concrete structures - General rules and rules for buildings",
    organization: "CEN / ASRO",
    scope: "Structural design rules for unreinforced, reinforced, and prestressed concrete structures, ultimate and serviceability limit states.",
    year: 2004,
    tier: "TIER 1 (Official Standard / Eurocode)"
  },
  {
    code: "SR EN 1993-1-1:2006",
    title: "Eurocode 3: Design of steel structures - General rules and rules for buildings",
    organization: "CEN / ASRO",
    scope: "Design of structural steel frames, welded/bolted connections, cross-section classification, local and lateral-torsional buckling.",
    year: 2006,
    tier: "TIER 1 (Official Standard / Eurocode)"
  },
  {
    code: "SR EN 1995-1-1:2004",
    title: "Eurocode 5: Design of timber structures",
    organization: "CEN / ASRO",
    scope: "Design rules for solid timber, glued laminated timber (glulam), and cross-laminated timber (CLT) structural elements and connections.",
    year: 2004,
    tier: "TIER 1 (Official Standard / Eurocode)"
  },
  {
    code: "SR EN 1996-1-1:2006",
    title: "Eurocode 6: Design of masonry structures",
    organization: "CEN / ASRO",
    scope: "Rules for unreinforced, reinforced, and confined masonry buildings, materials, mortar, structural shear, and compressive resistance.",
    year: 2006,
    tier: "TIER 1 (Official Standard / Eurocode)"
  },
  {
    code: "SR EN 1997-1:2004",
    title: "Eurocode 7: Geotechnical design - General rules",
    organization: "CEN / ASRO",
    scope: "Geotechnical design requirements for spread foundations, deep piled foundations, retaining structures, embankments, and ground anchors.",
    year: 2004,
    tier: "TIER 1 (Official Standard / Eurocode)"
  },
  {
    code: "SR EN 1998-1:2004",
    title: "Eurocode 8: Design of structures for earthquake resistance",
    organization: "CEN / ASRO",
    scope: "Earthquake resistant design of buildings, seismic hazard zones, response spectra, ductility classes, performance requirements.",
    year: 2004,
    tier: "TIER 1 (Official Standard / Eurocode)"
  },
  {
    code: "P100-1/2013",
    title: "Cod de proiectare seismică - Partea I: Prevederi de proiectare pentru clădiri",
    organization: "MDLPA (Ministerul Dezvoltării, Lucrărilor Publice și Administrației)",
    scope: "Official national Romanian seismic code governing seismic design, ground acceleration zoning (ag = 0.15g - 0.40g), corner period Tc, ductility classes, and structural detailing.",
    year: 2013,
    tier: "TIER 1 (Official Standard / Eurocode)"
  },
  {
    code: "SR EN 206:2021 + A2:2021",
    title: "Concrete - Specification, performance, production and conformity",
    organization: "CEN / ASRO",
    scope: "Standard specification for ready-mix concrete, compressive strength classes, exposure classes, consistency classes, water/cement ratios, and factory production control.",
    year: 2021,
    tier: "TIER 1 (Official Standard / Eurocode)"
  },
  {
    code: "NE 012-1:2022",
    title: "Cod de practică pentru producerea și executarea lucrărilor din beton, beton armat și beton precomprimat",
    organization: "MDLPA / ASRO",
    scope: "Romanian national concrete execution code, specifying mix constituents, transport, pouring, compaction vibration, cold/hot weather execution, and mandatory curing protocols.",
    year: 2022,
    tier: "TIER 1 (Official Standard / Eurocode)"
  },
  {
    code: "CR 6-2013",
    title: "Cod de proiectare pentru structuri din zidărie",
    organization: "MDLPA",
    scope: "National Romanian code for design and construction of unreinforced, confined (ZC), and reinforced masonry buildings.",
    year: 2013,
    tier: "TIER 1 (Official Standard / Eurocode)"
  },
  {
    code: "Normativ C 107/2005",
    title: "Normativ privind calculul termotehnic al elementelor de construcție ale clădirilor",
    organization: "MDLPA",
    scope: "Thermal calculations, minimum thermal resistance R, maximum thermal transmittance U-values, condensation verification, and nZEB energy performance standards.",
    year: 2005,
    tier: "TIER 1 (Official Standard / Eurocode)"
  },
  {
    code: "SR EN 197-1:2011",
    title: "Cement - Part 1: Composition, specifications and conformity criteria for common cements",
    organization: "CEN / ASRO",
    scope: "Classification of 27 distinct common cements (CEM I, CEM II, CEM III, CEM IV, CEM V) and standard strength classes (32.5, 42.5, 52.5 N/R).",
    year: 2011,
    tier: "TIER 1 (Official Standard / Eurocode)"
  },
  {
    code: "Legea 10/1995 (republicată)",
    title: "Legea privind calitatea în construcții",
    organization: "Parlamentul României",
    scope: "Fundamental Romanian legislative framework establishing mandatory quality requirements in construction: structural strength, fire safety, health/environment, energy efficiency, acoustic insulation, and accessibility.",
    year: 1995,
    tier: "TIER 1 (Official Standard / Eurocode)"
  }
];

export const materialComparisonsDataset: MaterialComparison[] = [
  {
    id: "comp-insulation-facade",
    slug: "eps-vs-xps-vs-rock-wool",
    title: "Facade & Building Thermal Insulation: EPS vs. XPS vs. Rock Mineral Wool",
    category: "Thermal Insulation",
    materials: [
      {
        name: "Expanded Polystyrene (EPS 80 / Graphite EPS)",
        slug: "expanded-polystyrene-eps",
        density: "15 - 20 kg/m³",
        thermalConductivity: "0.030 - 0.038 W/(m·K)",
        compressiveStrength: "≥ 80 - 100 kPa",
        waterAbsorption: "≤ 2.0% (vol)",
        fireReactionClass: "Class E (Combustible)",
        acousticPerformance: "Low (Poor airborne sound damping)",
        durabilityLifespan: "30 - 40 years",
        bestUsedFor: ["Standard exterior ETICS facade insulation", "Pitched roof rafters", "Cost-effective thermal retrofit"],
        criticalLimitation: "Combustible; requires mineral wool fire barriers (P118/2) on multi-story facades",
        standards: ["SR EN 13163", "Normativ C 107"]
      },
      {
        name: "Extruded Polystyrene (XPS)",
        slug: "extruded-polystyrene-xps",
        density: "30 - 45 kg/m³",
        thermalConductivity: "0.033 - 0.036 W/(m·K)",
        compressiveStrength: "300 - 700 kPa",
        waterAbsorption: "≤ 0.7% (Near Zero)",
        fireReactionClass: "Class E (Combustible)",
        acousticPerformance: "Low",
        durabilityLifespan: "50+ years",
        bestUsedFor: ["Basement foundation perimeter walls", "Inverted flat roofs", "Under-slab raft insulation", "Plinth splash zones (soclu)"],
        criticalLimitation: "Low vapor breathability (μ > 100); higher cost than standard EPS",
        standards: ["SR EN 13164", "NP 112-2014"]
      },
      {
        name: "Rock Mineral Wool (Vată Bazaltică)",
        slug: "rock-mineral-wool",
        density: "80 - 150 kg/m³",
        thermalConductivity: "0.034 - 0.038 W/(m·K)",
        compressiveStrength: "≥ 30 - 50 kPa",
        waterAbsorption: "≤ 1.0 kg/m² (Short-term)",
        fireReactionClass: "Class A1 (Non-combustible)",
        acousticPerformance: "Exceptional (High airborne sound absorption)",
        durabilityLifespan: "50+ years",
        bestUsedFor: ["High-rise building envelopes", "Ventilated facade systems", "Acoustic partition walls", "Fire barrier bands"],
        criticalLimitation: "Heavier weight requiring heavy-duty anchor fixings; must be protected from liquid water during installation",
        standards: ["SR EN 13162", "Normativ P118/2"]
      }
    ],
    engineeringVerdict: "Selection depends entirely on functional zone: XPS is unmatched for below-ground foundations and inverted roofs due to water resistance; Rock Wool is mandatory for high-rises and ventilated facades due to Class A1 fire safety and acoustics; Graphite EPS offers optimal thermal cost efficiency on standard low-rise masonry facades.",
    standardReference: "Normativ C 107 & Normativ P118/2 & SR EN 13162-13164"
  },
  {
    id: "comp-masonry-blocks",
    slug: "ceramic-blocks-vs-aac-bca",
    title: "Masonry Walling Units: Ceramic Hollow Blocks vs. Autoclaved Aerated Concrete (AAC / BCA)",
    category: "Masonry & Walling",
    materials: [
      {
        name: "Ceramic Hollow Blocks (Porotherm / Brikston)",
        slug: "ceramic-blocks",
        density: "750 - 850 kg/m³",
        thermalConductivity: "0.14 - 0.20 W/(m·K)",
        compressiveStrength: "10.0 - 15.0 N/mm² (High)",
        waterAbsorption: "10 - 15%",
        fireReactionClass: "Class A1 (Non-combustible)",
        acousticPerformance: "Good (High mass Rw = 46 - 52 dB)",
        durabilityLifespan: "100+ years",
        bestUsedFor: ["Confined masonry load-bearing walls (CR 6-2013)", "Acoustic apartment party walls", "High-thermal-inertia exterior walls"],
        criticalLimitation: "Higher dead weight; requires careful hammer-free drilling for wall fixings",
        standards: ["SR EN 771-1", "CR 6-2013"]
      },
      {
        name: "Autoclaved Aerated Concrete (AAC / BCA Ytong / Macon)",
        slug: "autoclaved-aerated-concrete",
        density: "400 - 550 kg/m³",
        thermalConductivity: "0.09 - 0.12 W/(m·K) (Superior)",
        compressiveStrength: "2.5 - 5.0 N/mm² (Moderate)",
        waterAbsorption: "Higher hygroscopic uptake",
        fireReactionClass: "Class A1 (Non-combustible)",
        acousticPerformance: "Moderate (Requires dense rendering)",
        durabilityLifespan: "80+ years",
        bestUsedFor: ["Non-bearing infill walls in multi-story RC frames", "Fast lightweight interior dividing partitions"],
        criticalLimitation: "Lower compressive load capacity; requires weather-resistant external render",
        standards: ["SR EN 771-4", "CR 6-2013"]
      }
    ],
    engineeringVerdict: "For load-bearing structural walls, Ceramic Blocks are required per CR 6-2013 due to superior compressive strength (10-15 MPa). For infill walls in tall reinforced concrete frames, AAC (BCA) is highly advantageous because it reduces total seismic dead weight by ~40% while providing superior intrinsic thermal insulation (λ = 0.09 W/mK).",
    standardReference: "CR 6-2013 & SR EN 771-1 / SR EN 771-4"
  }
];

// Helper Functions
export function getAllKnowledgeCategories(): KnowledgeCategory[] {
  return knowledgeCategories;
}

export function getKnowledgeCategoryById(id: KnowledgeCategoryId): KnowledgeCategory | undefined {
  return knowledgeCategories.find(c => c.id === id || c.slug === id);
}

export function getAllMaterials(): MaterialItem[] {
  return constructionMaterialsDataset;
}

export function getMaterialBySlug(slug: string): MaterialItem | undefined {
  return constructionMaterialsDataset.find(m => m.slug === slug || m.id === slug);
}

export function getMaterialsByCategory(category: KnowledgeCategoryId): MaterialItem[] {
  return constructionMaterialsDataset.filter(m => m.category === category);
}

export function getConcreteClasses(): ConcreteClass[] {
  return concreteStrengthClassesDataset;
}

export function getAllConstructionSystems(): ConstructionSystem[] {
  return constructionSystemsDataset;
}

export function getSystemBySlug(slug: string): ConstructionSystem | undefined {
  return constructionSystemsDataset.find(s => s.slug === slug || s.id === slug);
}

export function getAllConstructionProcesses(): ConstructionProcess[] {
  return constructionProcessesDataset;
}

export function getProcessBySlug(slug: string): ConstructionProcess | undefined {
  return constructionProcessesDataset.find(p => p.slug === slug);
}

export function getAllGlossaryTerms(): GlossaryTerm[] {
  return constructionGlossaryDataset;
}

export function getGlossaryTermBySlug(slug: string): GlossaryTerm | undefined {
  return constructionGlossaryDataset.find(t => t.slug === slug || t.term.toLowerCase() === slug.toLowerCase());
}

export function getAllStandards(): StandardReference[] {
  return standardsRegistryDataset;
}

export function getAllMaterialComparisons(): MaterialComparison[] {
  return materialComparisonsDataset;
}

export function getMaterialComparisonBySlug(slug: string): MaterialComparison | undefined {
  return materialComparisonsDataset.find(c => c.slug === slug || c.id === slug);
}

export interface KnowledgeSearchResult {
  type: "MATERIAL" | "CONCRETE_CLASS" | "SYSTEM" | "PROCESS" | "GLOSSARY" | "STANDARD";
  title: string;
  romanianTitle?: string;
  slug: string;
  href: string;
  category: string;
  snippet: string;
  status: SourceStatus;
}

export function searchKnowledge(query: string): KnowledgeSearchResult[] {
  if (!query || query.trim().length < 2) return [];

  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const results: KnowledgeSearchResult[] = [];

  // 1. Search Materials
  for (const m of constructionMaterialsDataset) {
    const text = (m.name + " " + m.romanianName + " " + m.summary + " " + m.technicalDescription).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (text.includes(q)) {
      results.push({
        type: "MATERIAL",
        title: m.name,
        romanianTitle: m.romanianName,
        slug: m.slug,
        href: `/knowledge/materials/${m.slug}`,
        category: m.categoryName,
        snippet: m.summary,
        status: m.sourceStatus
      });
    }
  }

  // 2. Search Concrete Classes
  for (const c of concreteStrengthClassesDataset) {
    const text = (c.designation + " " + c.characteristicStrengthLabel + " " + c.typicalApplications).toLowerCase();
    if (text.includes(q) || q.includes(c.designation.toLowerCase()) || q === "concrete" || q === "beton") {
      results.push({
        type: "CONCRETE_CLASS",
        title: `Concrete Class ${c.designation}`,
        romanianTitle: `Clasă Beton ${c.designation}`,
        slug: c.designation.toLowerCase().replace("/", "-"),
        href: "/knowledge/concrete",
        category: "Concrete Engineering",
        snippet: `Strength: ${c.characteristicStrengthLabel}. ${c.typicalApplications}`,
        status: c.status
      });
    }
  }

  // 3. Search Systems
  for (const s of constructionSystemsDataset) {
    const text = (s.name + " " + s.romanianName + " " + s.structuralPrinciple + " " + s.seismicBehavior).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (text.includes(q)) {
      results.push({
        type: "SYSTEM",
        title: s.name,
        romanianTitle: s.romanianName,
        slug: s.slug,
        href: "/knowledge/systems",
        category: "Structural Systems",
        snippet: s.structuralPrinciple,
        status: s.sourceStatus
      });
    }
  }

  // 4. Search Processes
  for (const p of constructionProcessesDataset) {
    const text = (p.name + " " + p.romanianName + " " + p.description).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (text.includes(q)) {
      results.push({
        type: "PROCESS",
        title: `Step ${p.stepNumber}: ${p.name}`,
        romanianTitle: p.romanianName,
        slug: p.slug,
        href: "/knowledge/processes",
        category: `Execution Phase: ${p.phase}`,
        snippet: p.description,
        status: p.sourceStatus
      });
    }
  }

  // 5. Search Glossary
  for (const g of constructionGlossaryDataset) {
    const text = (g.term + " " + (g.fullAcronymName || "") + " " + g.romanianTerm + " " + g.definition).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (text.includes(q)) {
      results.push({
        type: "GLOSSARY",
        title: g.term + (g.fullAcronymName ? ` (${g.fullAcronymName})` : ""),
        romanianTitle: g.romanianTerm,
        slug: g.slug,
        href: `/knowledge/glossary?q=${encodeURIComponent(g.term)}`,
        category: g.category,
        snippet: g.definition,
        status: g.sourceStatus
      });
    }
  }

  // 6. Search Standards
  for (const std of standardsRegistryDataset) {
    const text = (std.code + " " + std.title + " " + std.scope).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (text.includes(q)) {
      results.push({
        type: "STANDARD",
        title: std.code,
        romanianTitle: std.title,
        slug: std.code.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        href: "/knowledge/standards",
        category: "Standards Registry",
        snippet: std.title + " — " + std.scope,
        status: "VERIFIED"
      });
    }
  }

  return results;
}


// ==================== EXPANDED KNOWLEDGE ARCHITECTURE DATASETS ====================

export interface KnowledgeSource {
  id: string;
  sourceType: "REGULATION" | "EUROCODE" | "NATIONAL_STANDARD" | "TECHNICAL_REPORT" | "MANUFACTURER_DOP" | "INDUSTRY_CODE";
  organization: string;
  title: string;
  documentReference: string;
  url?: string;
  publicationDate: string;
  revisionDate?: string;
  accessedAt: string;
  jurisdiction: "European Union" | "Romania" | "International";
  language: "Romanian" | "English";
  reliabilityTier: SourceTier;
  notes?: string;
}

export interface InfrastructureItem {
  id: string;
  slug: string;
  title: string;
  romanianTitle: string;
  domain: "ROADS & PAVEMENTS" | "BRIDGES & VIADUCTS" | "TUNNELS & UNDERGROUND" | "RAIL INFRASTRUCTURE" | "MUNICIPAL UTILITIES";
  summary: string;
  technicalDescription: string;
  keyComponents: string[];
  designStandards: string[];
  criticalQualityControls: string[];
  sourceStatus: SourceStatus;
}

export interface EngineeringDomain {
  id: string;
  slug: string;
  title: string;
  romanianTitle: string;
  domainType: "GEOTECHNICAL" | "BUILDING_PHYSICS" | "FIRE_SAFETY" | "ACOUSTICS" | "MEP_SERVICES" | "SUSTAINABILITY";
  summary: string;
  corePrinciples: string[];
  governingEquationsOrMetrics: string[];
  standardsAndCodes: string[];
  commonFailuresAndMitigations: string[];
  sourceStatus: SourceStatus;
}

export interface ConstructionEquipment {
  id: string;
  slug: string;
  name: string;
  romanianName: string;
  category: "EARTHMOVING" | "CONCRETE" | "LIFTING" | "ROAD & PAVING" | "ACCESS & SCAFFOLDING";
  purpose: string;
  typicalCapacity: string;
  safetyAndOperationalConsiderations: string[];
  sourceStatus: SourceStatus;
}

export interface ProjectLifecycleStage {
  stageNumber: number;
  slug: string;
  name: string;
  romanianName: string;
  keyMilestones: string[];
  economicConsiderations: string;
  stakeholdersInvolved: string[];
}

export interface EurocodeStandard {
  code: string;
  family: string;
  title: string;
  scope: string;
  generationStatus: "FIRST GENERATION (Active)" | "SECOND GENERATION (Transition / Publication 2024-2027)";
  romanianAdoption: string;
  keyParts: string[];
  sourceStatus: SourceStatus;
}

export const knowledgeSourcesDataset: KnowledgeSource[] = [
  {
    id: "src-cpr-2024",
    sourceType: "REGULATION",
    organization: "European Parliament and Council of the European Union",
    title: "Regulation (EU) 2024/3110 laying down harmonised conditions for the marketing of construction products (CPR 2024)",
    documentReference: "OJ L, 2024/3110, 18.12.2024",
    url: "https://eur-lex.europa.eu",
    publicationDate: "2024-12-18",
    accessedAt: "2026-03-01",
    jurisdiction: "European Union",
    language: "English",
    reliabilityTier: "TIER 1 (Official Standard / Eurocode)",
    notes: "Generally applicable from 8 January 2026. Coexists with CPR 2011 (Regulation 305/2011) during transitional period. Mandates environmental performance criteria and digital product passports."
  },
  {
    id: "src-ne012-2022",
    sourceType: "NATIONAL_STANDARD",
    organization: "Ministerul Dezvoltării, Lucrărilor Publice și Administrației (MDLPA)",
    title: "NE 012-1:2022 - Cod de practică pentru producerea și executarea lucrărilor din beton, beton armat și beton precomprimat",
    documentReference: "Ordinul MDLPA nr. 2845/2022",
    publicationDate: "2022-11-15",
    accessedAt: "2026-03-01",
    jurisdiction: "Romania",
    language: "Romanian",
    reliabilityTier: "TIER 1 (Official Standard / Eurocode)",
    notes: "Mandatory technical code across Romania governing fresh concrete transport, placement, vibration, curing (min 7 days), and strength verification."
  },
  {
    id: "src-p100-1-2013",
    sourceType: "NATIONAL_STANDARD",
    organization: "Ministerul Dezvoltării Regionale și Administrației Publice (MDRAP)",
    title: "P100-1/2013 - Cod de proiectare seismică - Partea I: Prevederi de proiectare pentru clădiri",
    documentReference: "Monitorul Oficial nr. 558 bis / 2013",
    publicationDate: "2013-09-03",
    revisionDate: "2019-12-01",
    accessedAt: "2026-03-01",
    jurisdiction: "Romania",
    language: "Romanian",
    reliabilityTier: "TIER 1 (Official Standard / Eurocode)",
    notes: "Official Romanian seismic design standard. Sets peak ground acceleration ag (0.15g to 0.40g) and control period Tc (0.7s to 1.6s for Vrancea subduction zone)."
  },
  {
    id: "src-en206-2021",
    sourceType: "EUROCODE",
    organization: "European Committee for Standardization (CEN) / ASRO",
    title: "SR EN 206:2021 + A2:2021 - Concrete: Specification, performance, production and conformity",
    documentReference: "SR EN 206:2021+A2:2021",
    publicationDate: "2021-06-30",
    accessedAt: "2026-03-01",
    jurisdiction: "European Union",
    language: "Romanian",
    reliabilityTier: "TIER 2 (Technical Institution / ASRO / AICPS)",
    notes: "Defines concrete strength classes C8/10 to C100/115, exposure classes XC, XD, XS, XF, XA, w/c limits, and production control."
  },
  {
    id: "src-cr6-2013",
    sourceType: "NATIONAL_STANDARD",
    organization: "MDLPA",
    title: "CR 6-2013 - Cod de proiectare pentru structuri din zidărie",
    documentReference: "Monitorul Oficial nr. 640 bis / 2013",
    publicationDate: "2013-10-18",
    accessedAt: "2026-03-01",
    jurisdiction: "Romania",
    language: "Romanian",
    reliabilityTier: "TIER 1 (Official Standard / Eurocode)",
    notes: "Governs unreinforced, confined (ZC), and reinforced masonry in Romania."
  },
  {
    id: "src-c107-2005",
    sourceType: "NATIONAL_STANDARD",
    organization: "MDLPA",
    title: "Normativ C 107/2005 - Calculul termotehnic al elementelor de construcție ale clădirilor",
    documentReference: "Ordinul MTCT nr. 157/2005",
    publicationDate: "2005-02-01",
    revisionDate: "2010-12-15",
    accessedAt: "2026-03-01",
    jurisdiction: "Romania",
    language: "Romanian",
    reliabilityTier: "TIER 1 (Official Standard / Eurocode)",
    notes: "Governs thermal resistance R, transmittance U-values, linear thermal bridges, and nZEB energy performance compliance under Legea 372/2005."
  },
  {
    id: "src-jrc-eurocodes-2nd-gen",
    sourceType: "TECHNICAL_REPORT",
    organization: "European Commission - Joint Research Centre (JRC)",
    title: "The Second Generation of the Eurocodes: Technical Evolution and National Implementation Roadmap",
    documentReference: "JRC Technical Reports JRC129671",
    publicationDate: "2024-03-15",
    accessedAt: "2026-03-01",
    jurisdiction: "European Union",
    language: "English",
    reliabilityTier: "TIER 2 (Technical Institution / ASRO / AICPS)",
    notes: "Details transition from 1st Gen to 2nd Gen Eurocodes (EN 1990 - EN 1999) with new provisions for existing structures, glass, fiber composites, and climate adaptation."
  },
  {
    id: "src-legea-10-1995",
    sourceType: "REGULATION",
    organization: "Parlamentul României",
    title: "Legea nr. 10/1995 privind calitatea în construcții (republicată)",
    documentReference: "Monitorul Oficial nr. 765 / 2016",
    publicationDate: "1995-01-18",
    revisionDate: "2016-09-30",
    accessedAt: "2026-03-01",
    jurisdiction: "Romania",
    language: "Romanian",
    reliabilityTier: "TIER 1 (Official Standard / Eurocode)",
    notes: "Mandatory legal framework establishing 6 fundamental quality requirements and the Cartea Tehnică a Construcției."
  }
];

export const eurocodesRegistryDataset: EurocodeStandard[] = [
  {
    code: "EN 1990",
    family: "Basis of Structural Design",
    title: "Eurocode 0: Basis of Structural Design (SR EN 1990)",
    scope: "Fundamental principles of limit state design (ULS / SLS), safety partial factors, design working life classifications (Category 4: 50 years for buildings, Category 5: 100 years for bridges/monuments), and combination rules for actions.",
    generationStatus: "SECOND GENERATION (Transition / Publication 2024-2027)",
    romanianAdoption: "Adopted as SR EN 1990:2004 with Romanian National Annex (SR EN 1990:2004/NA:2006). 2nd Gen revision incorporates explicit assessment rules for existing structures and robustness.",
    keyParts: ["EN 1990: Basis of structural design", "EN 1990-2: Existing structures (2nd Gen addition)"],
    sourceStatus: "VERIFIED"
  },
  {
    code: "EN 1991",
    family: "Actions on Structures",
    title: "Eurocode 1: Actions on Structures (SR EN 1991)",
    scope: "Densities of materials, self-weight, imposed floor live loads (Categories A to H), snow loads, wind actions, thermal actions, execution loads, and accidental impacts/explosions.",
    generationStatus: "SECOND GENERATION (Transition / Publication 2024-2027)",
    romanianAdoption: "Implemented alongside Romanian codes CR 1-1-3 (Snow: s0k up to 1.5 - 2.5 kN/m²) and CR 1-1-4 (Wind: qb = 0.4 - 0.7 kPa).",
    keyParts: ["Part 1-1: Densities, self-weight, imposed loads", "Part 1-2: Actions on structures exposed to fire", "Part 1-3: Snow loads", "Part 1-4: Wind actions", "Part 1-5: Thermal actions", "Part 1-6: Actions during execution", "Part 1-7: Accidental actions"],
    sourceStatus: "VERIFIED"
  },
  {
    code: "EN 1992",
    family: "Design of Concrete Structures",
    title: "Eurocode 2: Design of Concrete Structures (SR EN 1992)",
    scope: "Design and detailing of plain, reinforced, and prestressed concrete. ULS bending, axial force, shear, torsion, punching shear in slabs, crack width control (SLS wk limits), and minimum concrete cover for durability.",
    generationStatus: "SECOND GENERATION (Transition / Publication 2024-2027)",
    romanianAdoption: "Coexists with Romanian execution code NE 012-1:2022 and seismic code P100-1/2013.",
    keyParts: ["Part 1-1: General rules and rules for buildings", "Part 1-2: Structural fire design", "Part 2: Concrete bridges - Design and detailing rules", "Part 3: Liquid retaining and containment structures", "Part 4: Fastening of equipment and fixings into concrete"],
    sourceStatus: "VERIFIED"
  },
  {
    code: "EN 1993",
    family: "Design of Steel Structures",
    title: "Eurocode 3: Design of Steel Structures (SR EN 1993)",
    scope: "Structural steel design: cross-section classification (Classes 1 to 4), local and lateral-torsional buckling, bolted and welded connections, fatigue, cold-formed thin-gauge members, and stainless steel.",
    generationStatus: "SECOND GENERATION (Transition / Publication 2024-2027)",
    romanianAdoption: "Adopted as SR EN 1993-1-1 to 1-12 with National Annexes. Coexists with execution standard SR EN 1090-2 (EXC1 to EXC4).",
    keyParts: ["Part 1-1: General rules and rules for buildings", "Part 1-2: Structural fire design", "Part 1-8: Design of joints", "Part 1-9: Fatigue", "Part 2: Steel bridges"],
    sourceStatus: "VERIFIED"
  },
  {
    code: "EN 1994",
    family: "Design of Composite Steel and Concrete Structures",
    title: "Eurocode 4: Design of Composite Steel and Concrete Structures (SR EN 1994)",
    scope: "Composite beams, columns (concrete-encased / concrete-filled tubes), and composite slabs with profiled steel sheeting. Shear connector design (headed studs) and longitudinal shear transfer.",
    generationStatus: "SECOND GENERATION (Transition / Publication 2024-2027)",
    romanianAdoption: "Adopted as SR EN 1994-1-1 and 1-2. Applied in Romanian high-rise office towers and bridge construction.",
    keyParts: ["Part 1-1: General rules and rules for buildings", "Part 1-2: Structural fire design", "Part 2: General rules and rules for bridges"],
    sourceStatus: "VERIFIED"
  },
  {
    code: "EN 1995",
    family: "Design of Timber Structures",
    title: "Eurocode 5: Design of Timber Structures (SR EN 1995)",
    scope: "Solid timber, glued laminated timber (Glulam), cross-laminated timber (CLT), and timber frame shear walls. ULS bending, shear, lateral torsional stability, mechanical dowel connections, and creep deformation.",
    generationStatus: "SECOND GENERATION (Transition / Publication 2024-2027)",
    romanianAdoption: "Adopted as SR EN 1995-1-1. 2nd Gen introduces dedicated complete section for Cross-Laminated Timber (CLT) and timber-concrete composites.",
    keyParts: ["Part 1-1: General - Common rules and rules for buildings", "Part 1-2: Structural fire design", "Part 2: Bridges"],
    sourceStatus: "VERIFIED"
  },
  {
    code: "EN 1996",
    family: "Design of Masonry Structures",
    title: "Eurocode 6: Design of Masonry Structures (SR EN 1996)",
    scope: "Unreinforced, confined, and reinforced masonry. Compressive strength, shear under in-plane horizontal actions, out-of-plane wind lateral loading, and thermal/moisture movement detailing.",
    generationStatus: "SECOND GENERATION (Transition / Publication 2024-2027)",
    romanianAdoption: "Coordinated with Romanian national code CR 6-2013 which enforces stricter mandatory confinement rules for seismic zones.",
    keyParts: ["Part 1-1: General rules for reinforced and unreinforced masonry", "Part 1-2: Structural fire design", "Part 2: Design considerations, selection of materials and execution of masonry", "Part 3: Simplified calculation methods"],
    sourceStatus: "VERIFIED"
  },
  {
    code: "EN 1997",
    family: "Geotechnical Design",
    title: "Eurocode 7: Geotechnical Design (SR EN 1997)",
    scope: "Geotechnical design using Design Approaches 1, 2, or 3. Spread footings, raft foundations, deep piles, retaining structures, anchorages, ground improvement, and slope stability.",
    generationStatus: "SECOND GENERATION (Transition / Publication 2024-2027)",
    romanianAdoption: "Adopted as SR EN 1997-1 (Design Approach 1 in Romania). Coexists with Romanian Normativ NP 112-2014 and NP 074-2014.",
    keyParts: ["Part 1: General rules", "Part 2: Ground investigation and testing", "Part 3: Geotechnical structures (2nd Gen addition)"],
    sourceStatus: "VERIFIED"
  },
  {
    code: "EN 1998",
    family: "Design of Structures for Earthquake Resistance",
    title: "Eurocode 8: Design of Structures for Earthquake Resistance (SR EN 1998)",
    scope: "Seismic hazard assessment, elastic response spectrum, behavior factors (q), capacity design principles, plastic hinge confinement, inter-story drift limitations, and base isolation systems.",
    generationStatus: "SECOND GENERATION (Transition / Publication 2024-2027)",
    romanianAdoption: "Romania applies national code P100-1/2013 as primary regulatory instrument, which is derived from and fully compatible with EN 1998-1 with specific calibrations for deep Vrancea earthquakes.",
    keyParts: ["Part 1: General rules, seismic actions and rules for buildings", "Part 2: Bridges", "Part 3: Assessment and retrofitting of buildings", "Part 4: Silos, tanks and pipelines", "Part 5: Foundations, retaining structures and geotechnical aspects"],
    sourceStatus: "VERIFIED"
  },
  {
    code: "EN 1999",
    family: "Design of Aluminium Structures",
    title: "Eurocode 9: Design of Aluminium Structures (SR EN 1999)",
    scope: "Structural aluminium alloy design: heat-affected zone (HAZ) softening around welds, cross-section classification, local/global buckling, fatigue, and structural glazing framework engineering.",
    generationStatus: "SECOND GENERATION (Transition / Publication 2024-2027)",
    romanianAdoption: "Adopted as SR EN 1999-1-1 to 1-5. Widely utilized in curtain wall sub-structures and large-span dome roofs.",
    keyParts: ["Part 1-1: General structural rules", "Part 1-2: Structural fire design", "Part 1-3: Structures susceptible to fatigue", "Part 1-4: Cold-formed structural sheeting", "Part 1-5: Shell structures"],
    sourceStatus: "VERIFIED"
  }
];

export const infrastructureDataset: InfrastructureItem[] = [
  {
    id: "infra-roads-asphalt",
    slug: "road-pavements-and-asphalt",
    title: "Highways & Flexible Asphalt Pavements",
    romanianTitle: "Drumuri și Îmbrăcăminți Asfaltice Rutiere",
    domain: "ROADS & PAVEMENTS",
    summary: "Multi-layered flexible and semi-rigid highway pavements designed for heavy cumulative axle loads (ESALs), subgrade stabilization, and surface skid resistance.",
    technicalDescription: "Engineered highway pavement cross-section comprising: (1) Compacted subgrade, (2) Granular sub-base, (3) Crushed stone base (AB22.4), (4) Asphalt binder course (BAD22.4), and (5) High-friction wearing course (BA16 / MAS16 Stone Mastic Asphalt). Compliant with SR EN 13108-1 and Romanian Normativ AND 605-2016.",
    keyComponents: [
      "Subgrade soil stabilization with lime and hydraulic road binders (SR EN 14227)",
      "High-modulus asphalt concrete base layers (AB22.4 / AB31.5)",
      "Polymer-Modified Bitumen (PMB 45/80-65) wearing course for rutting resistance",
      "Geocomposite interlayer reinforcement grids for anti-reflective cracking"
    ],
    designStandards: ["SR EN 13108-1:2016", "AND 605-2016", "PD 177"],
    criticalQualityControls: [
      "Nuclear density gauge compaction testing (min 97-98% Marshall density)",
      "Wheel tracking rutting rate testing at 60°C (SR EN 12697-22)",
      "Evenness measurement with Laser Profilometer (IRI ≤ 1.2 m/km for motorways)"
    ],
    sourceStatus: "VERIFIED"
  },
  {
    id: "infra-bridges-viaducts",
    slug: "bridges-and-viaducts",
    title: "Highway & Railway Bridges and Viaducts",
    romanianTitle: "Poduri, Pasaje și Viaducte Rutiere/Feroviare",
    domain: "BRIDGES & VIADUCTS",
    summary: "Long-span transportation structures engineered for dynamic heavy vehicle/train live loads, thermal expansion, seismic shear, and 100-year design life.",
    technicalDescription: "Bridge engineering systems: (1) Cast-in-place prestressed concrete box girders, (2) Precast prestressed beams with composite deck slabs, (3) Steel-concrete composite trusses, and (4) Cable-stayed bridges. Engineered under Eurocodes EN 1991-2, EN 1992-2, EN 1993-2, and EN 1998-2.",
    keyComponents: [
      "Deep foundation bored piles (Ø 1000mm - 2000mm) and reinforced concrete piers",
      "Elastomeric laminated bearings with PTFE sliding plates",
      "Watertight modular finger expansion joints",
      "Continuous bridge deck waterproofing membranes with mastic asphalt protection"
    ],
    designStandards: ["SR EN 1991-2", "SR EN 1992-2", "SR EN 1998-2", "Normativ AND 522"],
    criticalQualityControls: [
      "Static and dynamic proof load testing per STAS 12504",
      "Non-destructive ultrasonic testing of welded steel girder joints (SR EN ISO 17640)",
      "Post-tensioning cable elongation and duct pressure grouting verification"
    ],
    sourceStatus: "VERIFIED"
  },
  {
    id: "infra-tunnels-underground",
    slug: "tunnels-and-underground-infrastructure",
    title: "Tunnels & Underground Transportation Infrastructure",
    romanianTitle: "Tuneluri Rutiere/Metropolitane și Lucrări Subterane",
    domain: "TUNNELS & UNDERGROUND",
    summary: "Subsurface transit corridors constructed via Tunnel Boring Machines (TBM) with precast concrete segments or New Austrian Tunneling Method (NATM) shotcrete linings.",
    technicalDescription: "Underground engineering requires equilibrium between ground geostatic stress, groundwater pressure, and tunnel structural support. Mechanisms include: (1) TBM mechanised shield tunneling with bolted precast fiber-reinforced concrete rings, (2) NATM sequential excavation with rock bolts, steel arches, and shotcrete primary lining, and (3) Cut-and-cover with diaphragm retaining walls.",
    keyComponents: [
      "High-precision precast concrete segmental lining rings with EPDM elastomeric gaskets",
      "Continuous drainage and pressurized synthetic waterproofing membranes (PVC-P / TPO)",
      "Automated jet-fan longitudinal ventilation and emergency smoke extraction dampers",
      "Emergency cross-passage escape tunnels every 250-500m"
    ],
    designStandards: ["SR EN 1997-1", "Directiva 2004/54/CE", "Normativ NP 045"],
    criticalQualityControls: [
      "3D automated geodetic convergence monitoring and surface settlement sensors",
      "Shotcrete core compressive strength and fiber energy absorption testing (SR EN 14488-5)",
      "Groundwater inflow rate testing and hydrostatic pressure gauge logging"
    ],
    sourceStatus: "VERIFIED"
  },
  {
    id: "infra-rail-track",
    slug: "rail-infrastructure-and-ballast",
    title: "Railway Track Infrastructure & High-Speed Permanent Way",
    romanianTitle: "Infrastructură și Suprastructură Feroviară",
    domain: "RAIL INFRASTRUCTURE",
    summary: "Heavy rail infrastructure engineered for 22.5-ton axle loads, continuous welded rails (CWR), concrete monoblock sleepers, and crushed granite ballast.",
    technicalDescription: "Permanent way structural hierarchy: (1) Prepared subgrade with non-woven geotextile and geogrid reinforcement, (2) Graded crushed stone ballast bed (31.5-63mm per SR EN 13450), (3) Prestressed monoblock concrete sleepers (B70), and (4) Vignole 60E1 / 60E2 continuous welded steel rails.",
    keyComponents: [
      "Continuously Welded Rail (CWR) with aluminothermic field welds",
      "Elastic rail fastening systems (Vossloh W14 / Pandrol Fastclip) absorbing vibration",
      "Overhead 25 kV AC 50 Hz catenary electrification system",
      "European Rail Traffic Management System (ERTMS / ETCS Level 2) signalling"
    ],
    designStandards: ["SR EN 13450", "SR EN 13230", "SR EN 13674-1", "Specificații Tehnice CFR"],
    criticalQualityControls: [
      "Track geometry recording cars measuring gauge, cant, and twist",
      "Ultrasonic internal flaw detection testing of rail steel (SR EN 16729-1)",
      "Dynamic ballast bed plate bearing modulus (Ev2 ≥ 120 MPa)"
    ],
    sourceStatus: "VERIFIED"
  },
  {
    id: "infra-municipal-utilities",
    slug: "municipal-utility-networks",
    title: "Municipal Water, Wastewater & Stormwater Networks",
    romanianTitle: "Rețele Edilitare Municipale de Apă și Canalizare",
    domain: "MUNICIPAL UTILITIES",
    summary: "Underground public utility infrastructure: pressurized potable water mains, gravity sewer collectors, and storm retention systems.",
    technicalDescription: "Municipal water distribution uses High-Density Polyethylene (HDPE 100-RC) or Ductile Iron pipes PN10/PN16 with electrofusion joints. Wastewater and stormwater gravity networks use structured-wall Polypropylene (PP) or Corrugated High-Density Polyethylene (PEHD) SN8/SN16 pipes.",
    keyComponents: [
      "HDPE 100-RC crack-resistant pressure pipes with automated butt-fusion welding",
      "Precast polymer-concrete and concrete inspection manholes",
      "Stormwater underground attenuation retention tanks",
      "Automated pressure-reducing valves (PRVs) and acoustic leak detection sensors"
    ],
    designStandards: ["SR EN 12201", "SR EN 1852", "SR EN 752", "Normativ NP 133"],
    criticalQualityControls: [
      "Hydrostatic pressure testing of water pipelines per SR EN 805",
      "CCTV robotic camera pipe inspection for sewer alignment and joint defects (SR EN 13508-2)",
      "Trench bedding compaction testing with light falling weight deflectometer"
    ],
    sourceStatus: "VERIFIED"
  }
];

export const engineeringDomainsDataset: EngineeringDomain[] = [
  {
    id: "eng-geotechnical",
    slug: "geotechnical-and-foundations",
    title: "Geotechnical Engineering & Soil Mechanics",
    romanianTitle: "Inginerie Geotehnică și Mecanica Pământurilor",
    domainType: "GEOTECHNICAL",
    summary: "Evaluation of ground physical-mechanical properties, foundation settlement predictions, slope stability, and retaining excavations.",
    corePrinciples: [
      "Effective stress principle (Terzaghi equation: σ' = σ - u)",
      "Ultimate limit state bearing capacity of shallow footings and deep piles",
      "Primary and secondary consolidation settlement in cohesive soils (clays / silts)",
      "Lateral earth pressure states: At-rest (K0), Active (Ka), and Passive (Kp)"
    ],
    governingEquationsOrMetrics: [
      "Conventional bearing pressure: p_conv [kPa]",
      "Shear strength: τ = c' + σ' · tan(φ')",
      "Oedometer modulus of deformation: E_oed [MPa]",
      "Permeability coefficient: k [m/s]"
    ],
    standardsAndCodes: ["SR EN 1997-1 (Eurocode 7)", "NP 112-2014 (Fundații)", "NP 074-2014 (Studiu Geotehnic)"],
    commonFailuresAndMitigations: [
      "Differential foundation settlement → Mitigated by raft foundations or deep bored piles reaching stiff marl/gravel strata",
      "Excavation base heave caused by artesian groundwater → Mitigated by deep well dewatering and secant pile cutoff walls"
    ],
    sourceStatus: "VERIFIED"
  },
  {
    id: "eng-building-physics",
    slug: "building-physics-and-energy",
    title: "Building Physics, Thermal Envelope & nZEB Energy",
    romanianTitle: "Fizica Construcțiilor, Anvelopă Termică și Eficiență nZEB",
    domainType: "BUILDING_PHYSICS",
    summary: "Hygrothermal analysis of building envelopes: stationary and dynamic heat transfer, vapor diffusion, condensation prevention, and airtightness.",
    corePrinciples: [
      "Continuous thermal envelope without thermal bridges to prevent mold and condensation",
      "Glaser method interstitial vapor diffusion analysis (SR EN ISO 13788)",
      "Airtight envelope layer (blower door test n50 ≤ 1.5 h⁻¹ for nZEB buildings)",
      "High thermal inertia dampening summer peak indoor cooling loads"
    ],
    governingEquationsOrMetrics: [
      "Thermal Transmittance: U = 1 / (Rsi + Σ(d/λ) + Rse) [W/(m²·K)]",
      "Linear Thermal Transmittance: Ψ [W/(m·K)]",
      "Air Permeability: n50 [1/h at 50 Pa]",
      "Primary Energy Demand: Ep [kWh/(m²·an)]"
    ],
    standardsAndCodes: ["Normativ C 107/2005", "Legea 372/2005 (republicată)", "SR EN ISO 6946", "SR EN ISO 10077-1"],
    commonFailuresAndMitigations: [
      "Condensation behind interior insulation → Mitigated by external continuous ETICS insulation and internal vapor barriers",
      "Uncontrolled air infiltration draft heat losses → Mitigated by RAL window sealing tapes and airtight membrane tapes"
    ],
    sourceStatus: "VERIFIED"
  },
  {
    id: "eng-fire-safety",
    slug: "fire-safety-and-protection",
    title: "Fire Safety Engineering: Reaction vs. Resistance",
    romanianTitle: "Securitate la Incendiu: Reacție la Foc și Rezistență la Foc",
    domainType: "FIRE_SAFETY",
    summary: "Differentiation between material reaction to fire (Euroclasses A1 to F) and structural assembly fire resistance ratings (REI 30 to REI 240).",
    corePrinciples: [
      "Reaction to Fire: How a material contributes to fire development (combustibility, smoke s1-s3, flaming droplets d0-d2 per SR EN 13501-1)",
      "Fire Resistance: Ability of a structural element to maintain load-bearing capacity (R), integrity (E), and insulation (I) for specified duration in minutes per SR EN 13501-2",
      "Fire Compartmentation: Dividing buildings into fire-resistant zones to contain smoke and flame spread for safe occupant evacuation",
      "Active Systems: Automatic sprinklers, smoke and heat evacuation systems (desfumare), and alarm detection"
    ],
    governingEquationsOrMetrics: [
      "Euroclass Reaction: Class A1, A2-s1,d0, B, C, D, E, F",
      "Fire Resistance Rating: R / RE / REI [15, 30, 60, 90, 120, 180, 240 minutes]",
      "Critical steel temperature: θ_cr ≈ 500°C - 550°C"
    ],
    standardsAndCodes: ["Normativ P118/1-99 & P118/2", "SR EN 13501-1", "SR EN 13501-2", "Eurocodes 1-2 to 9-2"],
    commonFailuresAndMitigations: [
      "Inferring structural REI rating from a single material A1 rating → Never assume; REI depends on full assembly thickness and load level",
      "Unsealed MEP pipe penetrations across firewalls → Mitigated by certified intumescent firestop collars"
    ],
    sourceStatus: "VERIFIED"
  },
  {
    id: "eng-acoustics",
    slug: "building-acoustics-and-noise-control",
    title: "Building Acoustics & Noise Control Engineering",
    romanianTitle: "Acustica Clădirilor și Protecția la Zgomot",
    domainType: "ACOUSTICS",
    summary: "Airborne sound insulation (Rw), impact noise damping (Ln,w), facade environmental noise reduction, and room reverberation time control.",
    corePrinciples: [
      "Mass Law: Heavier monolithic walls provide higher airborne sound reduction (approx. +6 dB per doubling of surface mass)",
      "Mass-Air-Mass Principle: Double-leaf partition walls with absorbent mineral wool core provide superior acoustic damping at lower weight",
      "Impact Sound Decoupling: Floating screeds placed on resilient acoustic insulation boards (EPS-T or high-density mineral wool)",
      "Acoustic flanking transmission control at slab-wall junctions"
    ],
    governingEquationsOrMetrics: [
      "Weighted Sound Reduction Index: Rw + C / Rw + Ctr [dB]",
      "Weighted Normalized Impact Sound Pressure Level: L'n,w [dB] (residential norm L'n,w ≤ 53 - 58 dB)",
      "Reverberation Time: T60 [s]"
    ],
    standardsAndCodes: ["SR EN ISO 717-1", "SR EN ISO 717-2", "Normativ C 125"],
    commonFailuresAndMitigations: [
      "Rigid bridges in floating floor screeds → Mitigated by continuous vertical perimeter acoustic edge strips",
      "Back-to-back electrical socket penetrations in apartment party walls → Mitigated by staggered socket positioning and acoustic putty"
    ],
    sourceStatus: "VERIFIED"
  }
];

export const constructionEquipmentDataset: ConstructionEquipment[] = [
  {
    id: "eq-tower-crane",
    slug: "tower-cranes",
    name: "Tower Cranes (Macarale Turn)",
    romanianName: "Macarale Turn de Șantier",
    category: "LIFTING",
    purpose: "Heavy vertical lifting and horizontal precision placement of formwork panels, rebar cages, concrete kibbles, and precast units on multi-story building sites.",
    typicalCapacity: "Max load 6 - 20 tons; Jib tip capacity 1.5 - 3.5 tons at 50 - 70 meters radius.",
    safetyAndOperationalConsiderations: [
      "Foundation reinforced concrete base anchor calculation and soil bearing verification",
      "Daily wind speed anemometer monitoring (mandatory operational stop at wind speeds > 50-60 km/h)",
      "Anti-collision radio zoning systems when multiple overlapping crane jibs operate on site",
      "Periodic official ISCIR technical inspection and certified crane operator certification"
    ],
    sourceStatus: "VERIFIED"
  },
  {
    id: "eq-concrete-pump",
    slug: "mobile-and-stationary-concrete-pumps",
    name: "Mobile & Stationary Concrete Pumps (Autopompe de Beton)",
    romanianName: "Autopompe și Pompe Staționare de Beton",
    category: "CONCRETE",
    purpose: "Continuous high-pressure delivery of fresh ready-mix concrete from transit mixer trucks directly to structural formwork elements.",
    typicalCapacity: "Output 90 - 160 m³/hour; Vertical boom reach 24 - 60+ meters; Pumping pressure up to 85 - 130 bar.",
    safetyAndOperationalConsiderations: [
      "Hydraulic outrigger pad positioning on certified compacted ground or heavy load-spreading timber mats",
      "Strict exclusion zone under placing boom during concrete pumping operations",
      "Pipe lubrication with cement slurry primer before pumping and pressurized safety ball cleanout protocols"
    ],
    sourceStatus: "VERIFIED"
  },
  {
    id: "eq-hydraulic-excavator",
    slug: "crawler-hydraulic-excavators",
    name: "Crawler Hydraulic Excavators (Excavatoare pe Șenile)",
    romanianName: "Excavatoare Hidraulice pe Șenile",
    category: "EARTHMOVING",
    purpose: "Heavy bulk earthwork excavation, foundation trenching, rock breaking with hydraulic hammers, and spoil loading into dump trucks.",
    typicalCapacity: "Operating weight 20 - 50 tons; Bucket volume 1.0 - 3.2 m³; Digging depth 6 - 8 meters.",
    safetyAndOperationalConsiderations: [
      "Underground utility clearance with radar locators before digging",
      "Safe trench edge setback (minimum 1.5 - 2.0 meters) to prevent excavation wall collapse under excavator weight",
      "ROPS / FOPS certified protective cabin against falling rock and rollover"
    ],
    sourceStatus: "VERIFIED"
  },
  {
    id: "eq-asphalt-paver",
    slug: "asphalt-pavers-and-finishers",
    name: "Tracked Asphalt Pavers (Repartizoare-Finisoare de Asfalt)",
    romanianName: "Repartizoare de Asfalt (Finisoare)",
    category: "ROAD & PAVING",
    purpose: "Continuous laying and pre-compacting of hot-mix asphalt layers with millimeter-level laser screed leveling.",
    typicalCapacity: "Paving width 2.5 - 13.0 meters; Laydown rate up to 700 - 1100 tons/hour; Pre-compaction degree ~85-90%.",
    safetyAndOperationalConsiderations: [
      "Electric or gas heated screed (temperatures 120°C - 150°C) to prevent asphalt adhesion and tearing",
      "Continuous non-contact sonic or laser leveling averaging beams for high longitudinal smoothness",
      "Constant paving speed synchronization with asphalt truck supply chain to avoid cold stopping joints"
    ],
    sourceStatus: "VERIFIED"
  }
];

export const projectLifecycleDataset: ProjectLifecycleStage[] = [
  {
    stageNumber: 1,
    slug: "land-acquisition-and-feasibility",
    name: "Land Acquisition & Feasibility",
    romanianName: "Achiziție Teren și Studiu de Oportunitate / Fezabilitate",
    keyMilestones: ["Cadastral title audit", "Due diligence juridică și tehnică", "Studiu Geotehnic preliminar", "Studiu de Oportunitate Urbanistică"],
    economicConsiderations: "Land acquisition represents typically 15 - 35% of total development budget in major Romanian metropolitan hubs.",
    stakeholdersInvolved: ["Developer / Investor", "Real Estate Lawyers", "Land Surveyors", "Geotechnical Engineers"]
  },
  {
    stageNumber: 2,
    slug: "urban-planning-and-permitting",
    name: "Urban Planning & Permitting (CU / PUG / PUZ / DTAC)",
    romanianName: "Urbanism și Autorizare (CU, PUZ/PUD, DTAC, Avize)",
    keyMilestones: ["Certificat de Urbanism (CU)", "Elaborare PUZ/PUD dacă este necesar", "Obținere avize utilități, mediu, ISU, DSP", "Autorizație de Construire (AC)"],
    economicConsiderations: "Permitting delays impact IRR; soft costs for urbanism and permits typically represent 3 - 6% of project cost.",
    stakeholdersInvolved: ["Lead Architect", "Urban Planner", "Municipal Planning Department (Primărie)", "Consultant Avize"]
  },
  {
    stageNumber: 3,
    slug: "technical-design-and-procurement",
    name: "Detailed Technical Design & Contractor Procurement (PT + DDE + Tender)",
    romanianName: "Proiect Tehnic de Execuție (PT), Detalii (DDE) și Licitație Constructor",
    keyMilestones: ["Proiect Tehnic de Execuție (PT)", "Detalii de Execuție (DDE)", "Antemăsurătoare și Liste de Cantități (BOQ)", "Contractor Tender & Award"],
    economicConsiderations: "Rigorous BOQs mitigate risk of contractor cost claims and variations during construction.",
    stakeholdersInvolved: ["Structural Engineer", "Architect", "MEP Engineers", "Quantity Surveyor (QS)", "General Contractors"]
  },
  {
    stageNumber: 4,
    slug: "construction-execution-and-quality-control",
    name: "Construction Execution & Quality Control",
    romanianName: "Execuție Lucrări, Dirigenție de Șantier și Controlul Calității",
    keyMilestones: ["Ordin de Începere a Lucrărilor", "Verificare Faze Determinante ISC", "Semnare PVLA", "Monitorizare Progres și Situații de Lucrări"],
    economicConsiderations: "Hard construction costs represent 50 - 65% of development budget; cash-flow managed through monthly progress valuations.",
    stakeholdersInvolved: ["General Contractor", "Diriginte de Șantier", "RTE", "Proiectant", "ISC"]
  },
  {
    stageNumber: 5,
    slug: "commissioning-reception-and-operation",
    name: "Commissioning, Handover Reception & Asset Operation",
    romanianName: "Punere în Funcțiune, Recepție la Terminare (PVRTL) și Exploatare",
    keyMilestones: ["Probe funcționale și audit energetic", "Autorizație ISU de securitate la incendiu", "Recepție la Terminarea Lucrărilor (PVRTL)", "Completare Cartea Tehnică"],
    economicConsiderations: "Transition from construction financing to long-term operational asset management, leasing, or unit condominium handovers.",
    stakeholdersInvolved: ["Reception Committee", "Investor / Property Manager", "ISU Inspectors", "Facility Management Team"]
  }
];

// Helper Functions for New Datasets
export function getAllKnowledgeSources(): KnowledgeSource[] {
  return knowledgeSourcesDataset;
}

export function getKnowledgeSourceById(id: string): KnowledgeSource | undefined {
  return knowledgeSourcesDataset.find(s => s.id === id);
}

export function getAllEurocodes(): EurocodeStandard[] {
  return eurocodesRegistryDataset;
}

export function getAllInfrastructure(): InfrastructureItem[] {
  return infrastructureDataset;
}

export function getInfrastructureBySlug(slug: string): InfrastructureItem | undefined {
  return infrastructureDataset.find(i => i.slug === slug || i.id === slug);
}

export function getAllEngineeringDomains(): EngineeringDomain[] {
  return engineeringDomainsDataset;
}

export function getEngineeringDomainBySlug(slug: string): EngineeringDomain | undefined {
  return engineeringDomainsDataset.find(e => e.slug === slug || e.id === slug);
}

export function getAllConstructionEquipment(): ConstructionEquipment[] {
  return constructionEquipmentDataset;
}

export function getAllProjectLifecycleStages(): ProjectLifecycleStage[] {
  return projectLifecycleDataset;
}
