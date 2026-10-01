const fs = require('fs');
const path = require('path');

// 1. GENERATE LIB/KNOWLEDGE-DATA.TS
const knowledgeDataCode = `/**
 * Construction Industry Knowledge Base & Material Intelligence
 * CONSTRUCTIONS by AiXLuxury
 *
 * Factually verified technical reference data adhering strictly to European Norms (EN/Eurocodes),
 * Construction Products Regulation (CPR 2011 / CPR 2024), and Romanian Technical Codes
 * (NE 012-1:2022, P100-1/2013, CR 6-2013, C 107, NP 112-2014, SR EN 206, SR EN 197-1).
 *
 * Source Status Taxonomy:
 * - VERIFIED: Backed by published European/Romanian Norms or Official Regulatory Standards.
 * - DOCUMENTED: Sourced from accredited technical institutions, Eurocodes, or manufacturer technical dossiers.
 * - OBSERVED: Empirically documented on site.
 * - NOT DISCLOSED / UNAVAILABLE: When specific proprietary formulations or properties are unpublished.
 * - NOT YET VERIFIED: Under technical review.
 * - OUTDATED: Replaced by newer edition or transitioning under CPR 2024.
 */

export type SourceStatus = "VERIFIED" | "DOCUMENTED" | "OBSERVED" | "NOT DISCLOSED" | "NOT YET VERIFIED" | "OUTDATED";
export type SourceTier =
  | "TIER 1 (Official / Regulatory - EU / MDLPA / ASRO)"
  | "TIER 2 (Standards & Technical Bodies - Eurocodes / CEN / JRC)"
  | "TIER 3 (Manufacturer Technical Dossier / DoP / EPD)"
  | "TIER 4 (Professional Industry Literature)";

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
  quickUnderstanding: {
    whatIsIt: string;
    whatIsItMadeFrom: string;
    whereIsItUsed: string;
    whyItMatters: string;
  };
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
  designation: string;
  cylinderStrengthMpa: number;
  cubeStrengthMpa: number;
  characteristicStrengthLabel: string;
  minCementContentKgM3: string;
  maxWaterCementRatio: string;
  typicalApplications: string;
  exposureClasses: string[];
  standardReference: string;
  status: SourceStatus;
}

export interface ConstructionSystem {
  id: string;
  slug: string;
  name: string;
  romanianName: string;
  category: "STRUCTURAL" | "ENVELOPE" | "CIVIL";
  quickUnderstanding: {
    whatIsIt: string;
    howItWorks: string;
    keyBenefit: string;
  };
  structuralPrinciple: string;
  loadPath: string;
  seismicBehavior: string;
  layerStructure?: string[];
  designCodes: string[];
  typicalApplications: string[];
  advantages: string[];
  limitations: string[];
  materialDependencies: string[];
  lifecycleAndDurability: string;
  sourceStatus: SourceStatus;
  verifiedAt: string;
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

export interface ConstructionProcess {
  stepNumber: number;
  slug: string;
  name: string;
  romanianName: string;
  phase: "PRE-CONSTRUCTION" | "SUBSTRUCTURE" | "SUPERSTRUCTURE" | "ENVELOPE & ROOFING" | "MEP & FINISHES" | "COMMISSIONING";
  description: string;
  criticalQualityControls: string[];
  normativeRequirements: string[];
  typicalDurationEstimate: string;
  deliverablesAndReception: string;
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

export interface GlossaryTerm {
  slug: string;
  term: string;
  fullAcronymName?: string;
  romanianTerm: string;
  category: "URBANISM & PERMITTING" | "STRUCTURAL ENGINEERING" | "MATERIALS & TESTING" | "ENERGY & BUILDING PHYSICS" | "EXECUTION & SITE MANAGEMENT" | "FIRE & ACOUSTICS" | "PROJECT DELIVERY & COST";
  quickDefinition: string;
  definition: string;
  practicalApplication: string;
  regulatoryContext?: string;
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
    thermalConductivity: string;
    compressiveStrength: string;
    waterAbsorption: string;
    fireReactionClass: string;
    acousticPerformance: string;
    durabilityLifespan: string;
    bestUsedFor: string[];
    criticalLimitation: string;
    standards: string[];
  }[];
  engineeringVerdict: string;
  standardReference: string;
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
  | "installations-mep"
  | "timber-engineered"
  | "metals-nonferrous";

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
    detailedOverview: "Standardized under Normativ C 107 and SR EN 13162-13165. Governs thermal conductivity, compressive strength at 10% deformation, vapor permeability, and reaction to fire.",
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
    detailedOverview: "Governed by SR EN 14351-1 and SR EN 1279. Measures overall heat transfer coefficient (Uw), acoustic attenuation (Rw), air permeability, and wind tightness.",
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
  },
  {
    id: "timber-engineered",
    slug: "timber-engineered",
    name: "Timber & Engineered Wood",
    romanianName: "Lemn Structural și Produse Derivate",
    icon: "🌲",
    shortDescription: "Solid graded timber (C24), Cross-Laminated Timber (CLT), Glulam (GL24/GL28), LVL, and structural wood panels.",
    detailedOverview: "Regulated under Eurocode 5 (SR EN 1995-1-1) and SR EN 16351. Emphasizes carbon sequestration, biophilic design, and predictable fire charring rates.",
    keyGoverningStandards: ["SR EN 1995-1-1", "SR EN 16351", "SR EN 14080"],
    itemCount: 2
  },
  {
    id: "metals-nonferrous",
    slug: "metals-nonferrous",
    name: "Architectural & MEP Non-Ferrous Metals",
    romanianName: "Metale Neferoase (Aluminiu, Cupru, Zinc)",
    icon: "🔩",
    shortDescription: "Aluminium architectural profiles, copper piping and electrical conductors, titanium-zinc roofing sheets.",
    detailedOverview: "Standardized under SR EN 573-3, SR EN 1057, and SR EN 988. High corrosion resistance, electrical/thermal conductivity, and infinite recyclability.",
    keyGoverningStandards: ["SR EN 573-3", "SR EN 1057", "SR EN 988"],
    itemCount: 2
  }
];

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
    reliabilityTier: "TIER 1 (Official / Regulatory - EU / MDLPA / ASRO)",
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
    reliabilityTier: "TIER 1 (Official / Regulatory - EU / MDLPA / ASRO)",
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
    reliabilityTier: "TIER 1 (Official / Regulatory - EU / MDLPA / ASRO)",
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
    reliabilityTier: "TIER 2 (Standards & Technical Bodies - Eurocodes / CEN / JRC)",
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
    reliabilityTier: "TIER 1 (Official / Regulatory - EU / MDLPA / ASRO)",
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
    reliabilityTier: "TIER 1 (Official / Regulatory - EU / MDLPA / ASRO)",
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
    reliabilityTier: "TIER 2 (Standards & Technical Bodies - Eurocodes / CEN / JRC)",
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
    reliabilityTier: "TIER 1 (Official / Regulatory - EU / MDLPA / ASRO)",
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
    technicalDescription: "Engineered highway pavement cross-section comprising: (1) Compacted subgrade (patul drumului), (2) Granular sub-base (strat de formă / balast), (3) Crushed stone base (strat de piatră spartă / AB22.4), (4) Asphalt binder course (BAD22.4), and (5) High-friction wearing course (BA16 / MAS16 Stone Mastic Asphalt). Compliant with SR EN 13108-1 and Romanian Normativ AND 605-2016.",
    keyComponents: [
      "Subgrade soil stabilization with lime and hydraulic road binders (SR EN 14227)",
      "High-modulus asphalt concrete base layers (AB22.4 / AB31.5)",
      "Polymer-Modified Bitumen (PMB 45/80-65) wearing course for rutting resistance",
      "Geocomposite interlayer reinforcement grids for anti-reflective cracking"
    ],
    designStandards: ["SR EN 13108-1:2016", "AND 605-2016 (Normativ Mixturi Asfaltice)", "PD 177 (Normativ Dimensionare Structuri Rutiere)"],
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
    technicalDescription: "Bridge engineering systems: (1) Cast-in-place prestressed concrete box girders (grinzi casetate precomprimate), (2) Precast prestressed beams with composite deck slabs, (3) Steel-concrete composite trusses, and (4) Cable-stayed bridges. Engineered under Eurocodes EN 1991-2 (Traffic actions), EN 1992-2 (Concrete bridges), EN 1993-2 (Steel bridges), and EN 1998-2 (Seismic bridge design).",
    keyComponents: [
      "Deep foundation bored piles (Ø 1000mm - 2000mm) and reinforced concrete piers (pile)",
      "Elastomeric laminated bearings with PTFE sliding plates (aparate de reazem din neopren)",
      "Watertight modular finger expansion joints (rosturi de dilatație multielement)",
      "Continuous bridge deck waterproofing membranes with mastic asphalt protection"
    ],
    designStandards: ["SR EN 1991-2 (Traffic loads)", "SR EN 1992-2", "SR EN 1998-2 (Seismic Bridges)", "Normativ AND 522"],
    criticalQualityControls: [
      "Static and dynamic proof load testing (încercarea podurilor cu convoaie de camioane etalon) per STAS 12504",
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
    technicalDescription: "Underground engineering requires equilibrium between ground geostatic stress, groundwater pressure, and tunnel structural support. Mechanisms include: (1) TBM mechanised shield tunneling with bolted precast fiber-reinforced concrete rings (bolțari), (2) NATM sequential excavation with rock bolts, steel arches, and shotcrete primary lining, and (3) Cut-and-cover (săpătură deschisă) with diaphragm retaining walls.",
    keyComponents: [
      "High-precision precast concrete segmental lining rings with EPDM elastomeric gaskets",
      "Continuous drainage and pressurized synthetic waterproofing membranes (PVC-P / TPO)",
      "Automated jet-fan longitudinal ventilation and emergency smoke extraction dampers",
      "Emergency cross-passage escape tunnels (galerii de evacuare) every 250-500m"
    ],
    designStandards: ["SR EN 1997-1 (Eurocode 7)", "Directiva 2004/54/CE (Tunnel Safety)", "Normativ NP 045 (Proiectare Tuneluri)"],
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
    technicalDescription: "Permanent way (cale ferată) structural hierarchy: (1) Prepared subgrade with non-woven geotextile and geogrid reinforcement, (2) Graded crushed stone ballast bed (piatră spartă de carieră dură 31.5-63mm per SR EN 13450), (3) Prestressed monoblock concrete sleepers (traverse din beton precomprimat B70), and (4) Vignole 60E1 / 60E2 continuous welded steel rails (șine sudate continuu).",
    keyComponents: [
      "Continuously Welded Rail (CWR / cale fără joante) with aluminothermic field welds",
      "Elastic rail fastening systems (Vossloh W14 / Pandrol Fastclip) absorbing vibration",
      "Overhead 25 kV AC 50 Hz catenary electrification system (linie de contact)",
      "European Rail Traffic Management System (ERTMS / ETCS Level 2) signalling"
    ],
    designStandards: ["SR EN 13450 (Ballast)", "SR EN 13230 (Concrete Sleepers)", "SR EN 13674-1 (Rails)", "Specificații Tehnice CFR"],
    criticalQualityControls: [
      "Track geometry recording cars (vagoane de verificare geometrie cale) measuring gauge, cant, and twist",
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
    technicalDescription: "Municipal water distribution uses High-Density Polyethylene (HDPE 100-RC) or Ductile Iron (fontă ductilă) pipes PN10/PN16 with electrofusion joints. Wastewater and stormwater gravity networks use structured-wall Polypropylene (PP) or Corrugated High-Density Polyethylene (PEHD corugat) SN8/SN16 pipes or reinforced concrete pipes (tuburi prefabricate din beton).",
    keyComponents: [
      "HDPE 100-RC crack-resistant pressure pipes with automated butt-fusion welding",
      "Precast polymer-concrete and concrete inspection manholes (cămine de vizitare)",
      "Stormwater underground attenuation retention tanks (bazine de retenție)",
      "Automated pressure-reducing valves (PRVs) and acoustic leak detection sensors"
    ],
    designStandards: ["SR EN 12201 (Plastics piping - Water)", "SR EN 1852 (Sewer PP)", "SR EN 752 (Drain and sewer systems)", "Normativ NP 133"],
    criticalQualityControls: [
      "Hydrostatic pressure testing (proba de presiune) of water pipelines per SR EN 805",
      "CCTV robotic camera pipe inspection for sewer alignment and joint defects (SR EN 13508-2)",
      "Trench bedding compaction testing with light falling weight deflectometer (LFWD)"
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
      "Linear Thermal Transmittance: Ψ (psi) [W/(m·K)]",
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
      "Reaction to Fire (Reacție la Foc): How a material contributes to fire development (combustibility, smoke s1-s3, flaming droplets d0-d2 per SR EN 13501-1)",
      "Fire Resistance (Rezistență la Foc): Ability of a structural element to maintain load-bearing capacity (R), integrity (E), and insulation (I) for specified duration in minutes per SR EN 13501-2",
      "Fire Compartmentation: Dividing buildings into fire-resistant zones to contain smoke and flame spread for safe occupant evacuation",
      "Active Systems: Automatic sprinklers, smoke and heat evacuation systems (desfumare), and alarm detection"
    ],
    governingEquationsOrMetrics: [
      "Euroclass Reaction: Class A1, A2-s1,d0, B, C, D, E, F",
      "Fire Resistance Rating: R / RE / REI [15, 30, 60, 90, 120, 180, 240 minutes]",
      "Critical steel temperature: θ_cr ≈ 500°C - 550°C"
    ],
    standardsAndCodes: ["Normativ P118/1-99 & P118/2 (Siguranță la Foc)", "SR EN 13501-1", "SR EN 13501-2", "Eurocodes 1-2 to 9-2"],
    commonFailuresAndMitigations: [
      "Inferring structural REI rating from a single material A1 rating → Never assume; REI depends on full assembly thickness and load level",
      "Unsealed MEP pipe penetrations across firewalls → Mitigated by certified intumescent firestop collars (manșoane antifoc)"
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
      "Acoustic flanking transmission (transmisie indirectă prin căi laterale) control at slab-wall junctions"
    ],
    governingEquationsOrMetrics: [
      "Weighted Sound Reduction Index: Rw + C / Rw + Ctr [dB]",
      "Weighted Normalized Impact Sound Pressure Level: L'n,w [dB] (Lower is better, residential norm L'n,w ≤ 53 - 58 dB)",
      "Reverberation Time: T60 [s]"
    ],
    standardsAndCodes: ["SR EN ISO 717-1 (Airborne)", "SR EN ISO 717-2 (Impact)", "Normativ C 125 (Acustică în Construcții)"],
    commonFailuresAndMitigations: [
      "Rigid bridges in floating floor screeds (touching perimeter walls) → Mitigated by continuous vertical perimeter acoustic edge strips",
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
      "Underground utility clearance (cabluri electrice, conducte de gaz) with radar locators before digging",
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
    name: "Urban Planning & Permitting (Certificat Urbanism / PUG / PUZ / DTAC)",
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
    stakeholdersInvolved: ["General Contractor", "Diriginte de Șantier", "RTE (Responsabil Tehnic cu Execuția)", "Proiectant", "ISC"]
  },
  {
    stageNumber: 5,
    slug: "commissioning-reception-and-operation",
    name: "Commissioning, Handover Reception & Asset Operation",
    romanianName: "Punere în Funcțiune, Recepție la Terminare (PVRTL) și Exploatare",
    keyMilestones: ["Probe funcționale și audit energetic", "Autorizație ISU de securitate la incendiu", "Recepție la Terminarea Lucrărilor (PVRTL)", "Completare Cartea Tehnică"],
    economicConsiderations: "Transition from construction financing to long-term operational asset management, leasing, or unit condominium handovers.",
    stakeholdersInvolved: ["Reception Committee (Comisie Recepție)", "Investor / Property Manager", "ISU Inspectors", "Facility Management Team"]
  }
];

// Re-export existing datasets from comprehensive definitions
export * from "./knowledge-data-existing";
`;

console.log("Saving full code...");
fs.writeFileSync(path.join(process.cwd(), "scripts/generated_knowledge_code.txt"), knowledgeDataCode);
console.log("Generated code written to txt");
