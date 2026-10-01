/**
 * CONSTRUCTIONS by AiXLuxury — Official Services & Intelligent Intake Specification
 * 
 * 13 Official Services categorized into:
 * 1. CONSTRUCTION / TECHNICAL (7)
 * 2. COMMERCIAL / BUSINESS (2)
 * 3. FINANCIAL / INSURANCE (2)
 * 4. REAL ESTATE (2)
 */

export type ServiceCategory = 
  | "CONSTRUCTION_TECHNICAL"
  | "COMMERCIAL_BUSINESS"
  | "FINANCIAL_INSURANCE"
  | "REAL_ESTATE";

export interface ServiceDefinition {
  id: string;
  slug: string;
  title: string;
  category: ServiceCategory;
  categoryLabel: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  badge: string;
  deliverables: string[];
  applicableStandards: string[];
  targetAudience: string[];
  specificQuestionnaireId: string;
}

export const OFFICIAL_SERVICES: ServiceDefinition[] = [
  // 1. CONSTRUCTION / TECHNICAL
  {
    id: "calitate-constructii",
    slug: "calitate-constructii",
    title: "Servicii de calitate în construcții",
    category: "CONSTRUCTION_TECHNICAL",
    categoryLabel: "Construcții / Tehnic",
    shortDescription: "Managementul integrat al calității conform Legii 10/1995, proceduri de control, audit tehnic și conformitate pe șantiere civile și industriale.",
    fullDescription: "Pachet complet de servicii specializate pentru asigurarea calității lucrărilor de construcții: implementare sistem de management al calității, elaborare PCCVI (Plan de Control al Calității, Verificări și Încercări), asistență la faze determinante și verificare conformitate normativă.",
    icon: "🛡️",
    badge: "LEGEA 10/1995",
    deliverables: [
      "Elaborare și avizare PCCVI",
      "Asistență tehnică la faze determinante cu ISC / Diriginte",
      "Audituri de calitate pe faze de execuție",
      "Rapoarte de neconformitate (RNC) și acțiuni corective",
      "Gestiunea dosarelor de calitate pe specialități"
    ],
    applicableStandards: ["Legea 10/1995", "HG 766/1997", "SR EN ISO 9001:2015", "Normativ C56"],
    targetAudience: ["Dezvoltatori imobiliari", "Antreprenori generali", "Investitori instituționali", "Project Manageri"],
    specificQuestionnaireId: "calitate_constructii"
  },
  {
    id: "controlul-calitatii",
    slug: "controlul-calitatii",
    title: "Controlul calității",
    category: "CONSTRUCTION_TECHNICAL",
    categoryLabel: "Construcții / Tehnic",
    shortDescription: "Inspecții tehnice riguroase pe șantier, verificări încrucișate de armare, cofrare, turnare beton, suduri și finisaje.",
    fullDescription: "Servicii operative de control al calității în șantier pentru prevenirea și remedierea neconformităților structurale și nestructurale. Inspecție vizuală, dimensională, prelevare probe și auditare documente de calitate la punerea în operă.",
    icon: "🔍",
    badge: "INSPECȚIE ȘANTIER",
    deliverables: [
      "Inspecții pe șantier înainte de betonare (armare, cofrare)",
      "Verificare certificate de conformitate și declarații de performanță",
      "Rapoarte foto de inspecție tehnică detaliată",
      "Registru de neconformități și monitorizare remediere",
      "Verificare parametri de montaj și execuție"
    ],
    applicableStandards: ["NE 012-1:2022", "SR EN 13670", "SR EN 1992", "P100-1/2013"],
    targetAudience: ["Antreprenori generali", "Dezvoltatori", "Beneficiari", "Șefi de șantier"],
    specificQuestionnaireId: "controlul_calitatii"
  },
  {
    id: "manager-calitate",
    slug: "manager-calitate",
    title: "Manager calitate",
    category: "CONSTRUCTION_TECHNICAL",
    categoryLabel: "Construcții / Tehnic",
    shortDescription: "Externalizare sau integrare Responsabil Tehnic cu Calitatea (RTE/CQ) și Manager Calitate dedicat pentru proiecte de anvergură.",
    fullDescription: "Furnizare de personal tehnic specializat (Manager Calitate / Responsabil CQ) autorizat pentru conducerea departamentului de calitate pe proiecte complexe, coordonarea subcontractorilor și relația cu autoritățile de control.",
    icon: "👔",
    badge: "MANAGEMENT DE PROIECT",
    deliverables: [
      "Alocare Manager Calitate dedicat pe proiect",
      "Supervizare integrată a tuturor subcontractorilor",
      "Coordonarea procedurilor de recepție internă",
      "Interfață cu Inspectoratul de Stat în Construcții (ISC)",
      "Digitalizarea fluxurilor de aprobare și calitate"
    ],
    applicableStandards: ["SR EN ISO 9001", "Legea 10/1995", "HG 925/1995"],
    targetAudience: ["Dezvoltatori", "Companii de construcții", "Antreprenori generali", "Fonduri de investiții"],
    specificQuestionnaireId: "manager_calitate"
  },
  {
    id: "cartea-tehnica",
    slug: "cartea-tehnica",
    title: "Cartea Tehnică a Construcției",
    category: "CONSTRUCTION_TECHNICAL",
    categoryLabel: "Construcții / Tehnic",
    shortDescription: "Întocmire, verificare, completare, digitalizare și arhivare conformă a Cărții Tehnice conform HG 273/1994.",
    fullDescription: "Serviciu exhaustiv de reconstituire, redactare și structurare a Cărții Tehnice a Construcției (Capitolele A, B, C, D) conform normativelor legale în vigoare, esențială pentru recepția la terminarea lucrărilor și recepția finală.",
    icon: "📚",
    badge: "HG 273/1994",
    deliverables: [
      "Structurarea dosarelor Cap. A (Proiectare), B (Execuție), C (Recepție), D (Urmărire în timp)",
      "Centralizarea și scanarea tuturor proceselor-verbale (PVLA, PVFD, PVRC)",
      "Audit documentar și identificare acte lipsă",
      "Format fizic legat conform normelor + arhivă digitală structurată",
      "Pregătire dosar complet pentru comisia de recepție"
    ],
    applicableStandards: ["HG 273/1994", "HG 343/2017", "Legea 10/1995", "Normativ P130"],
    targetAudience: ["Dezvoltatori", "Proprietari de clădiri", "Antreprenori", "Administratori de patrimoniu"],
    specificQuestionnaireId: "cartea_tehnica"
  },
  {
    id: "ssm",
    slug: "ssm",
    title: "Inspector SSM",
    category: "CONSTRUCTION_TECHNICAL",
    categoryLabel: "Construcții / Tehnic",
    shortDescription: "Servicii complete de Securitate și Sănătate în Muncă (SSM) și Situații de Urgență (SU) pe șantiere conform Legii 319/2006 și HG 300/2006.",
    fullDescription: "Coordonare SSM pe șantier, elaborare Plan General de Securitate și Sănătate (PGSS), instruiri periodice, audituri de conformitate, elaborare convenții SSM cu subcontractorii și asistență la controale ITM.",
    icon: "⛑️",
    badge: "LEGEA 319/2006",
    deliverables: [
      "Elaborare Plan General de Securitate și Sănătate (PGSS)",
      "Coordonator SSM pe durata proiectării și execuției (HG 300/2006)",
      "Audituri periodice de siguranță pe șantier",
      "Instruire introductiv-generală și la locul de muncă",
      "Gestionare registre SSM și documentație echipamente"
    ],
    applicableStandards: ["Legea 319/2006", "HG 300/2006", "HG 1425/2006", "HG 1091/2006"],
    targetAudience: ["Antreprenori generali", "Subantreprenori", "Dezvoltatori", "Șefi de punct de lucru"],
    specificQuestionnaireId: "inspector_ssm"
  },
  {
    id: "proiecte",
    slug: "proiecte",
    title: "Proiecte",
    category: "CONSTRUCTION_TECHNICAL",
    categoryLabel: "Construcții / Tehnic",
    shortDescription: "Proiectare completă și integrată: arhitectură, structură de rezistență, instalații MEP, drumuri și infrastructură.",
    fullDescription: "Elaborare documentații tehnice complete pentru toate fazele de proiectare: Tema de Proiectare, Concept, Studiu de Fezabilitate (SF/DALI), DTAC (Documentație Tehnică pentru Autorizație de Construire), Proiect Tehnic (PT) și Detalii de Execuție (DDE).",
    icon: "📐",
    badge: "PROIECTARE INTEGRATĂ",
    deliverables: [
      "Documentație completă DTAC / DTOE",
      "Proiect Tehnic de Execuție (PT + DDE)",
      "Memorii tehnice și breviare de calcul structural (Eurocod)",
      "Planșe MEP (Instalații Sanitare, Termice, Electrice, HVAC)",
      "Urmărire de șantier pe durata execuției"
    ],
    applicableStandards: ["Eurocodes (EN 1990-1999)", "P100-1/2013", "I7-2011", "I9-2015", "I13-2015"],
    targetAudience: ["Dezvoltatori", "Investitori", "Persoane fizice", "Companii private"],
    specificQuestionnaireId: "proiecte"
  },
  {
    id: "arhitecti",
    slug: "arhitecti",
    title: "Arhitecți",
    category: "CONSTRUCTION_TECHNICAL",
    categoryLabel: "Construcții / Tehnic",
    shortDescription: "Servicii de arhitectură, concept volumetric, autorizare, urbanism (PUZ/PUD) și parteneriate profesionale de proiectare.",
    fullDescription: "Servicii de creație arhitecturală, studii de însorire, randări 3D fotorealiste, întocmire documentații de urbanism (PUD, PUZ), expertize și parteneriate de colaborare cu birouri de arhitectură.",
    icon: "🏛️",
    badge: "CONCEPT & URBANISM",
    deliverables: [
      "Concept arhitectural și studii volumetrice",
      "Elaborare documentații PUD / PUZ",
      "Proiectare de arhitectură pentru autorizare și execuție",
      "Vizualizări 3D și dosar de prezentare",
      "Parteneriate profesionale de subcontractare proiectare"
    ],
    applicableStandards: ["Legea 50/1991", "Legea 350/2001", "Ghiduri OAR / RUR"],
    targetAudience: ["Investitori", "Dezvoltatori", "Proprietari de terenuri", "Birouri de arhitectură"],
    specificQuestionnaireId: "arhitecti"
  },

  // 2. COMMERCIAL / BUSINESS
  {
    id: "publicitate",
    slug: "publicitate",
    title: "Publicitate",
    category: "COMMERCIAL_BUSINESS",
    categoryLabel: "Comercial / Business",
    shortDescription: "Promovare targetată pentru companii de construcții, ansambluri rezidențiale, parcuri logistice și branduri industriale.",
    fullDescription: "Campanii de marketing B2B și B2C specializate pentru industria construcțiilor și real estate: vizibilitate strategică, generare lead-uri calificate, poziționare de brand, producție media foto/video/dronă și distribuție în rețeaua AiXLuxury.",
    icon: "📢",
    badge: "MARKET REACH",
    deliverables: [
      "Campanii dedicate de generare lead-uri comerciale",
      "Profile de companie și proiecte promovate în rețea",
      "Producție foto / video / aeriană pe șantier",
      "Rapoarte de impact, audiență și interacțiuni",
      "Articole editoriale și dosare de presă tehnică"
    ],
    applicableStandards: ["Standarde de transparență AiXLuxury", "Codul de Conduită Publicitară"],
    targetAudience: ["Dezvoltatori imobiliari", "Producători de materiale", "Companii de construcții", "Furnizori de echipamente"],
    specificQuestionnaireId: "publicitate"
  },
  {
    id: "inchirieri-utilaje",
    slug: "inchirieri-utilaje",
    title: "Închirieri utilaje",
    category: "COMMERCIAL_BUSINESS",
    categoryLabel: "Comercial / Business",
    shortDescription: "Preluare și centralizare cereri de închiriere utilaje grele, macarale, excavatoare, pompe de beton și platforme.",
    fullDescription: "Sistem centralizat de conectare a cererilor de utilaje pentru șantiere cu disponibilitățile din piață: utilaje terasiere, ridicare, transport și utilaje specializate, cu sau fără deservent autorizat ISCIR.",
    icon: "🚜",
    badge: "PARC UTILAJE",
    deliverables: [
      "Preluare cereri specifice (capacitate, tonaj, perioadă)",
      "Opțiuni cu sau fără operator autorizat ISCIR",
      "Coordonare logistică pentru transport pe șantier",
      "Confirmare disponibilitate regională"
    ],
    applicableStandards: ["Prescripții Tehnice ISCIR", "Norme de siguranță rutieră și șantier"],
    targetAudience: ["Antreprenori generali", "Subantreprenori de terasamente", "Instalatori infrastructură"],
    specificQuestionnaireId: "inchirieri_utilaje"
  },

  // 3. FINANCIAL / INSURANCE
  {
    id: "asigurari",
    slug: "asigurari",
    title: "Intermediere asigurări",
    category: "FINANCIAL_INSURANCE",
    categoryLabel: "Financiar / Asigurări",
    shortDescription: "Polițe specializate CAR (Contractor All Risks), EAR, răspundere civilă profesională, utilaje (CPM) și asigurări de garanție.",
    fullDescription: "Consultanță și intermediere pentru acoperirea riscurilor specifice activității de construcții: polițe CAR/EAR pentru șantiere, răspundere profesională pentru arhitecți și ingineri, asigurări de utilaje și scrisori de garanție bancară/asigurare.",
    icon: "📑",
    badge: "MANAGEMENT DE RISC",
    deliverables: [
      "Structurare cerere de ofertă pentru polițe CAR / EAR",
      "Asigurări de răspundere civilă profesională (Arhitecți, Ingineri, RTE, CQ)",
      "Asigurări utilaje și parcuri auto (CPM / CASCO / RCA)",
      "Garanții de participare la licitație și de bună execuție"
    ],
    applicableStandards: ["Norme ASF", "Condiții standard Munich Re / CAR Clauses"],
    targetAudience: ["Dezvoltatori", "Constructori", "Birouri de proiectare", "Subcontractori"],
    specificQuestionnaireId: "asigurari"
  },
  {
    id: "credite",
    slug: "credite",
    title: "Credite / finanțare",
    category: "FINANCIAL_INSURANCE",
    categoryLabel: "Financiar / Asigurări",
    shortDescription: "Soluții de finanțare pentru dezvoltare imobiliară, achiziții terenuri, linii de credit capital de lucru și leasing utilaje.",
    fullDescription: "Preluare și structurare solicitări de creditare comercială și dezvoltare de proiecte: credite de investiții, finanțare punte (bridge loans), factoring pentru facturi de situații de lucrări și leasing financiar pentru utilaje.",
    icon: "💳",
    badge: "STRUCTURARE FINANȚARE",
    deliverables: [
      "Identificare tipologie optimă de finanțare",
      "Structurare date proiect pentru dosar bancar / fonduri",
      "Analiză preliminară indicatori de solvabilitate și garanții",
      "Orientare către parteneri financiari adecvați scalei proiectului"
    ],
    applicableStandards: ["Regulamente BNR", "Practici bancare de analiză de risc"],
    targetAudience: ["Dezvoltatori imobiliari", "Investitori", "Companii de construcții", "Persoane fizice"],
    specificQuestionnaireId: "credite"
  },

  // 4. REAL ESTATE
  {
    id: "vanzari-real-estate",
    slug: "vanzari-real-estate",
    title: "Vânzări real estate",
    category: "REAL_ESTATE",
    categoryLabel: "Real Estate",
    shortDescription: "Reprezentare exclusivă sau vânzare pentru proprietăți rezidențiale, comerciale, clădiri de birouri, spații logistice și terenuri.",
    fullDescription: "Servicii profesionale de promovare și valorificare a activelor imobiliare: analiză comparativă de piață, pregătire dosar de vânzare, promovare către investitori calificați și negociere structurată.",
    icon: "🏢",
    badge: "VALORIFICARE ACTIVE",
    deliverables: [
      "Evaluare și poziționare de preț pe piață",
      "Elaborare memorandum de prezentare și broșură tehnică",
      "Expunere către rețeaua privată de investitori AiXLuxury",
      "Filtrare și calificare cumpărători potențiali",
      "Asistență la încheierea tranzacției"
    ],
    applicableStandards: ["Standarde ANEVAR", "Bune practici imobiliare internaționale"],
    targetAudience: ["Proprietari de clădiri", "Dezvoltatori cu stocuri disponibile", "Investitori", "Companii în restructurare"],
    specificQuestionnaireId: "vanzari_real_estate"
  },
  {
    id: "imobiliare",
    slug: "imobiliare",
    title: "Imobiliare",
    category: "REAL_ESTATE",
    categoryLabel: "Real Estate",
    shortDescription: "Căutare personalizată de proprietăți, terenuri de dezvoltare, spații comerciale sau oportunități de investiție imobiliară.",
    fullDescription: "Mandat de căutare dedicat pentru investitori și companii în căutare de terenuri pentru dezvoltare rezidențială/industrială, clădiri de birouri, spații de depozitare sau active generatoare de randament.",
    icon: "🎯",
    badge: "MANDAT CĂUTARE",
    deliverables: [
      "Filtrare riguroasă a pieței după criterii de suprafață, zonă și buget",
      "Verificare preliminară a regimului urbanistic (PUG/PUZ)",
      "Prezentare dosare comparative de oportunitate",
      "Asistență la due diligence tehnic și juridic"
    ],
    applicableStandards: ["Standarde de diligență tehnică și urbanistică"],
    targetAudience: ["Investitori privați", "Fonduri de investiții", "Companii în expansiune", "Dezvoltatori"],
    specificQuestionnaireId: "imobiliare"
  }
];

export function getServiceBySlug(slug: string): ServiceDefinition | undefined {
  return OFFICIAL_SERVICES.find(s => s.slug === slug || s.id === slug);
}

export const ROLES_LIST = [
  "Dezvoltator",
  "Constructor",
  "Companie de construcții",
  "Investitor",
  "Proprietar",
  "Arhitect",
  "Inginer",
  "Project Manager",
  "Manager de calitate",
  "Responsabil SSM",
  "Antreprenor",
  "Subantreprenor",
  "Furnizor",
  "Administrator / reprezentant companie",
  "Persoană fizică",
  "Alt rol"
] as const;

export const PROJECT_TYPES_LIST = [
  "Rezidențial",
  "Comercial",
  "Industrial",
  "Logistic",
  "Office",
  "Hotelier",
  "Medical",
  "Educațional",
  "Retail",
  "Infrastructură",
  "Public",
  "Mixed-use",
  "Renovare / reconversie",
  "Altul"
] as const;

export const PROJECT_STAGES_LIST = [
  "Idee / concept",
  "Teren identificat",
  "Achiziție teren",
  "Studiu de fezabilitate",
  "Certificat de urbanism",
  "PUZ",
  "PUD",
  "DTAC",
  "Proiectare",
  "Autorizație de construire",
  "Licitație / ofertare",
  "Contractare",
  "Execuție",
  "Execuție în desfășurare",
  "Controlul calității",
  "Recepție",
  "Cartea Tehnică",
  "Finalizat",
  "Renovare / intervenție",
  "Nu știu încă"
] as const;

export const CONTACT_PREFERENCES = [
  "Telefon",
  "WhatsApp",
  "Email",
  "Telegram",
  "Nu contează"
] as const;

export const CONTACT_TIME_INTERVALS = [
  "Dimineața",
  "Prânz",
  "După-amiaza",
  "Seara"
] as const;

export const URGENCY_LEVELS = [
  "Normal",
  "Important",
  "Urgent"
] as const;

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "IN_PROGRESS"
  | "QUOTE_REQUESTED"
  | "PROPOSAL_SENT"
  | "WON"
  | "LOST"
  | "NOT_RELEVANT"
  | "ARCHIVED";

export interface IntakeSubmissionPayload {
  role: string;
  customRole?: string;
  serviceId: string;
  serviceName: string;
  isCompany: boolean;
  companyName?: string;
  cui?: string;
  companyWebsite?: string;
  companyRole?: string;
  employeeCount?: string;
  industryField?: string;
  companyLocation?: string;
  linkedinProfile?: string;
  isProjectRelated: "yes" | "no" | "planning";
  projectName?: string;
  projectCity?: string;
  projectCounty?: string;
  projectAddress?: string;
  projectType?: string;
  landArea?: string;
  builtArea?: string;
  grossArea?: string;
  buildingCount?: string;
  unitCount?: string;
  projectStage?: string;
  serviceSpecificData: Record<string, any>;
  message?: string;
  urgency: "Normal" | "Important" | "Urgent";
  fullName: string;
  email: string;
  phone?: string;
  preferredContact: string;
  preferredInterval?: string;
  consent: boolean;
  source?: string;
  landingPath?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  visitorId?: string;
  sessionId?: string;
  website_hp?: string;
}
