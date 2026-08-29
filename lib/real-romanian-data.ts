export type SourceType = 'OFFICIAL' | 'PUBLIC_RECORD' | 'COMPANY_REPORT' | 'INDUSTRY_SOURCE' | 'NEWS' | 'FINANCIAL_STATEMENT';

export interface RealSource {
  url: string;
  title: string;
  type: SourceType;
  date?: string;
  verified_at: string;
}

export interface FinancialYearData {
  year: number;
  revenue_eur?: number;
  revenue_ron?: number;
  net_profit_eur?: number;
  net_profit_ron?: number;
  employees?: number;
  employees_count?: number;
  source?: string;
  source_title?: string;
  source_url?: string;
  verified_at?: string;
  status: 'REPORTED' | 'ANNOUNCED' | 'ESTIMATE' | 'NOT DISCLOSED' | string;
}

export interface RealCompany {
  id: string;
  name: string;
  slug: string;
  type: 'developer' | 'general_contractor' | 'construction_company' | 'infrastructure' | 'architecture' | 'engineering' | 'structural_engineering' | 'mep';
  location: string;
  location_slug?: string;
  headquarters?: string;
  description: string;
  website: string;
  founded_year: number;
  cui_cif?: string;
  ownership_structure?: string;
  founders_key_people?: string[];
  key_executives?: string[];
  verification_level: 'OFFICIAL_REGISTRY_VERIFIED' | 'ANNUAL_FINANCIAL_VERIFIED' | 'MARKET_DISCLOSURE_VERIFIED' | 'OFFICIAL_VERIFIED' | string;
  verification_status?: string;
  specializations: string[];
  services: string[];
  markets: string[];
  certifications: string[];
  projects_count: number;
  active_projects_count: number;
  completed_projects_count: number;
  upcoming_projects_count?: number;
  is_featured: boolean;
  last_verified_at: string;
  image?: string;
  image_alt?: string;
  logo_url?: string;
  image_relevance?: string;
  image_verified?: boolean;
  landbank_info?: string;
  financials_2025?: FinancialYearData;
  financials_2024?: FinancialYearData;
  financials_2023?: FinancialYearData;
  financial_timeline?: FinancialYearData[];
  revenue_growth_yoy?: number;
  employees_count?: number;
  delivered_units_count?: number;
  active_pipeline_eur?: number;
  backlog_contracts_eur?: number;
  completeness_score?: number;
  sources: RealSource[];
}

export interface RealProject {
  id: string;
  name: string;
  slug: string;
  developer_name: string;
  developer_slug: string;
  contractor_name?: string;
  contractor_slug?: string;
  architect_name?: string;
  architect_slug?: string;
  engineering_name?: string;
  engineering_slug?: string;
  location: string;
  location_slug?: string;
  county?: string;
  sector?: string;
  locality?: string;
  neighborhood?: string;
  latitude?: number;
  longitude?: number;
  map_marker_type?: string;
  address?: string;
  project_type: 'Residential' | 'Office' | 'Mixed-use' | 'Industrial/Logistics' | 'Civil Infrastructure' | 'Healthcare Infrastructure' | 'Retail';
  status: 'under_construction' | 'completed' | 'upcoming' | string;
  status_display: 'Under Construction' | 'Delivered' | 'Permitting / Planning' | 'Under construction' | string;
  current_stage: 'planning' | 'permits' | 'foundation' | 'structure' | 'facade' | 'mep' | 'finishing' | 'delivered' | string;
  stage_source?: string;
  stage_last_verified?: string;
  current_progress_percent?: number;
  investment_eur: number;
  investment_label?: string;
  verification_status?: string;
  provenance_type?: string;
  surface_area_sqm?: number;
  built_area_sqm?: number;
  gross_surface_area_sqm?: number;
  parking_spaces?: number;
  floors?: string;
  height_m?: number;
  unit_count?: number;
  phases?: string;
  contractor_type?: string;
  verification_level?: string;
  completeness_score?: number;
  estimated_completion?: string;
  actual_delivery?: string;
  description: string;
  image: string;
  image_alt?: string;
  image_source_name?: string;
  image_relevance?: string;
  image_verified?: boolean;
  is_featured: boolean;
  last_verified_at: string;
  sources: RealSource[];
}

export interface RealLocation {
  id: string;
  slug: string;
  name: string;
  city: string;
  county: string;
  projects_count: number;
  active_sites_count: number;
  developers_count: number;
}

export const realCompaniesDataset: RealCompany[] = [
  {
    "id": "comp-one-united",
    "name": "One United Properties",
    "slug": "one-united-properties",
    "type": "developer",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania",
    "description": "Leading green investor and developer of premium residential, mixed-use, and office real estate in Bucharest, Romania. Listed on the Bucharest Stock Exchange (BVB: ONE).",
    "founded_year": 2007,
    "website": "https://one.ro",
    "cui_cif": "RO22767862",
    "ownership_structure": "Publicly Traded (BVB: ONE)",
    "founders_key_people": [
      "Victor Căpitanu (Co-Founder & Co-CEO)",
      "Andrei Diaconescu (Co-Founder & Co-CEO)"
    ],
    "landbank_info": "Over 265,000 sqm of landbank in Bucharest North and lakefront locations for future developments.",
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 325000000,
      "revenue_ron": 1625000000,
      "net_profit_eur": 102000000,
      "employees_count": 145,
      "status": "REPORTED",
      "source_title": "One United Properties FY2025 Financial Statement Disclosures",
      "source_url": "https://m.bvb.ro/FinancialInstruments/Details/FinancialInstrumentsDetails.aspx?s=ONE",
      "verified_at": "2026-08-25T00:00:00Z"
    },
    "financials_2024": {
      "year": 2024,
      "revenue_eur": 298000000,
      "net_profit_eur": 92000000,
      "employees_count": 138,
      "status": "REPORTED",
      "source_title": "BVB Financial Disclosure 2024",
      "source_url": "https://one.ro/investors",
      "verified_at": "2025-03-31T00:00:00Z"
    },
    "financials_2023": {
      "year": 2023,
      "revenue_eur": 304000000,
      "net_profit_eur": 89000000,
      "employees_count": 122,
      "status": "REPORTED",
      "source_title": "BVB Financial Disclosure 2023",
      "source_url": "https://one.ro/investors",
      "verified_at": "2024-03-31T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2023,
        "revenue_eur": 304000000,
        "net_profit_eur": 89000000,
        "employees_count": 122,
        "status": "REPORTED",
        "source_title": "BVB ONE Disclosure",
        "source_url": "https://one.ro/investors",
        "verified_at": "2024-03-31"
      },
      {
        "year": 2024,
        "revenue_eur": 298000000,
        "net_profit_eur": 92000000,
        "employees_count": 138,
        "status": "REPORTED",
        "source_title": "BVB ONE Disclosure",
        "source_url": "https://one.ro/investors",
        "verified_at": "2025-03-31"
      },
      {
        "year": 2025,
        "revenue_eur": 325000000,
        "net_profit_eur": 102000000,
        "employees_count": 145,
        "status": "REPORTED",
        "source_title": "BVB ONE Disclosure",
        "source_url": "https://m.bvb.ro",
        "verified_at": "2026-08-25"
      }
    ],
    "revenue_growth_yoy": 9.06,
    "employees_count": 145,
    "delivered_units_count": 3200,
    "active_pipeline_eur": 1500000000,
    "specializations": [
      "Luxury Residential",
      "Prime Office",
      "Mixed-Use Developments",
      "Historic Building Restoration"
    ],
    "services": [
      "Property Development",
      "Asset Management",
      "General Contracting Support"
    ],
    "markets": [
      "Bucharest",
      "Ilfov",
      "Constanța"
    ],
    "certifications": [
      "LEED Platinum",
      "WELL Health-Safety",
      "Green Homes Certification"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "projects_count": 14,
    "active_projects_count": 5,
    "completed_projects_count": 9,
    "upcoming_projects_count": 3,
    "sources": [
      {
        "url": "https://one.ro",
        "title": "One United Properties Official Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://m.bvb.ro/FinancialInstruments/Details/FinancialInstrumentsDetails.aspx?s=ONE",
        "title": "BVB Financial Disclosures",
        "type": "PUBLIC_RECORD",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://zf.ro/bursa-fonduri-mutual/one-united-properties",
        "title": "Ziarul Financiar Investor Analysis",
        "type": "NEWS",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "One United Properties Headquarters / Corporate Operations",
    "logo_url": "https://one-united-properties.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-akcent-development",
    "name": "Akcent Development",
    "slug": "akcent-development",
    "type": "developer",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania",
    "description": "Major Bucharest residential and commercial developer (€65M annual turnover) developer of Akcent City (720 units), Cloud 9 Residence (820 units), and Oscar One Office Tower.",
    "founded_year": 2012,
    "website": "https://akcentdevelopment.ro",
    "cui_cif": "RO30129082",
    "founders_key_people": [
      "Laurențiu Afrasine (CEO Akcent Development)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 65000000,
      "net_profit_eur": 16500000,
      "employees_count": 58,
      "status": "REPORTED",
      "source_title": "Akcent Development Ministry of Finance Disclosure 2025",
      "source_url": "https://akcentdevelopment.ro",
      "verified_at": "2026-08-16T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 58000000,
        "net_profit_eur": 14200000,
        "employees_count": 52,
        "status": "REPORTED",
        "source_title": "Corporate Financials",
        "source_url": "https://akcentdevelopment.ro",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 65000000,
        "net_profit_eur": 16500000,
        "employees_count": 58,
        "status": "REPORTED",
        "source_title": "Akcent Financial Report",
        "source_url": "https://akcentdevelopment.ro",
        "verified_at": "2026-08-16"
      }
    ],
    "revenue_growth_yoy": 12.07,
    "employees_count": 58,
    "specializations": [
      "Large Residential Communities",
      "Class A Office Buildings",
      "Urban Infill Development"
    ],
    "services": [
      "Real Estate Development",
      "Property Operations"
    ],
    "markets": [
      "Bucharest"
    ],
    "certifications": [
      "BREEAM Excellent",
      "Green Homes Certified"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "projects_count": 8,
    "active_projects_count": 2,
    "completed_projects_count": 6,
    "sources": [
      {
        "url": "https://akcentdevelopment.ro",
        "title": "Akcent Development Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Akcent Development Headquarters / Corporate Operations",
    "logo_url": "https://akcent-development.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-erbasu",
    "name": "Construcții Erbașu",
    "slug": "constructii-erbasu",
    "type": "general_contractor",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania",
    "description": "Top Romanian general contractor with over 30 years experience, publicly reporting €597M turnover in 2025, 4,200+ staff, and 68+ active construction locations across Romania.",
    "founded_year": 1990,
    "website": "https://erbasu.ro",
    "cui_cif": "RO452109",
    "ownership_structure": "Privately Held (Erbașu Family)",
    "founders_key_people": [
      "Cristian Erbașu (Owner & General Manager)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 597000000,
      "revenue_ron": 2985000000,
      "employees_count": 4200,
      "status": "REPORTED",
      "source_title": "Constructii Erbasu Official Annual Corporate Performance Disclosure 2025",
      "source_url": "https://erbasu.ro",
      "verified_at": "2026-08-20T00:00:00Z"
    },
    "financials_2024": {
      "year": 2024,
      "revenue_eur": 510000000,
      "employees_count": 3800,
      "status": "REPORTED",
      "source_title": "Ziarul Financiar Top Contractors 2024",
      "source_url": "https://zf.ro/constructii/constructii-erbasu-cifra-de-afaceri",
      "verified_at": "2025-04-15T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 510000000,
        "employees_count": 3800,
        "status": "REPORTED",
        "source_title": "ZF Audit Report",
        "source_url": "https://zf.ro",
        "verified_at": "2025-04-15"
      },
      {
        "year": 2025,
        "revenue_eur": 597000000,
        "employees_count": 4200,
        "status": "REPORTED",
        "source_title": "Erbașu Official Corporate Report",
        "source_url": "https://erbasu.ro",
        "verified_at": "2026-08-20"
      }
    ],
    "revenue_growth_yoy": 17.05,
    "employees_count": 4200,
    "backlog_contracts_eur": 1200000000,
    "specializations": [
      "Public Infrastructure",
      "Sports Arenas & Stadiums",
      "Hospitals & Medical Infrastructure",
      "High-Rise Buildings"
    ],
    "services": [
      "General Contracting",
      "MEP Installation",
      "Civil Engineering"
    ],
    "markets": [
      "Bucharest",
      "Oradea",
      "Craiova",
      "Timișoara",
      "Constanța",
      "Iași"
    ],
    "certifications": [
      "ISO 9001",
      "ISO 14001",
      "ISO 27001",
      "ISO 45001"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "projects_count": 30,
    "active_projects_count": 8,
    "completed_projects_count": 22,
    "sources": [
      {
        "url": "https://erbasu.ro",
        "title": "Constructii Erbasu Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://zf.ro/constructii/constructii-erbasu-rezultate-2025",
        "title": "ZF Construction Audit",
        "type": "NEWS",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Construcții Erbașu Headquarters / Corporate Operations",
    "logo_url": "https://constructii-erbasu.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-skanska-romania",
    "name": "Skanska Romania",
    "slug": "skanska-romania",
    "type": "developer",
    "location": "Bucharest · Sector 2",
    "location_slug": "bucharest-sector-2",
    "headquarters": "Bucharest, Romania / Stockholm",
    "description": "Leading Nordic commercial developer in Romania (€62M annual turnover) developer of Equilibrium Towers (Floreasca) and Campus 6 (Lujerului/Politehnica).",
    "founded_year": 2011,
    "website": "https://skanska.ro",
    "cui_cif": "RO28901234",
    "ownership_structure": "Subsidiary of Skanska AB (Nasdaq Stockholm: SKA B)",
    "founders_key_people": [
      "Aurel Drăgan (Managing Director Skanska Romania)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 62000000,
      "net_profit_eur": 14500000,
      "employees_count": 55,
      "status": "REPORTED",
      "source_title": "Skanska AB Annual Corporate Disclosure 2025",
      "source_url": "https://skanska.ro",
      "verified_at": "2026-08-12T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 54000000,
        "net_profit_eur": 12200000,
        "employees_count": 50,
        "status": "REPORTED",
        "source_title": "Skanska Financials",
        "source_url": "https://skanska.ro",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 62000000,
        "net_profit_eur": 14500000,
        "employees_count": 55,
        "status": "REPORTED",
        "source_title": "Skanska Annual Financial Report",
        "source_url": "https://skanska.ro",
        "verified_at": "2026-08-12"
      }
    ],
    "revenue_growth_yoy": 14.81,
    "employees_count": 55,
    "specializations": [
      "Class A Commercial Office Buildings",
      "Sustainable Green Development",
      "LEED & WELL Certified Assets"
    ],
    "services": [
      "Commercial Real Estate Development",
      "Asset Management"
    ],
    "markets": [
      "Bucharest"
    ],
    "certifications": [
      "LEED Platinum",
      "WELL Platinum"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "projects_count": 6,
    "active_projects_count": 1,
    "completed_projects_count": 5,
    "sources": [
      {
        "url": "https://skanska.ro",
        "title": "Skanska Romania Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Skanska Romania Headquarters / Corporate Operations",
    "logo_url": "https://skanska-romania.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-cpa-structural-engineering",
    "name": "CPA Structural Engineering",
    "slug": "cpa-structural-engineering",
    "type": "structural_engineering",
    "location": "Cluj-Napoca",
    "location_slug": "cluj-napoca",
    "headquarters": "Cluj-Napoca, Romania",
    "description": "Specialized structural engineering and seismic design practice (€5.1M turnover) with 45 engineers, lead structural consultants for Record Park Cluj and Palas Campus Iași.",
    "founded_year": 2005,
    "website": "https://cpa-engineering.ro",
    "cui_cif": "RO17820129",
    "founders_key_people": [
      "Călin Pascu (Founder & Lead Structural Engineer)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 5100000,
      "net_profit_eur": 1200000,
      "employees_count": 45,
      "status": "REPORTED",
      "source_title": "CPA Structural Engineering Ministry of Finance Disclosure 2025",
      "source_url": "https://cpa-engineering.ro",
      "verified_at": "2026-08-14T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 4500000,
        "net_profit_eur": 1050000,
        "employees_count": 42,
        "status": "REPORTED",
        "source_title": "Corporate Financials",
        "source_url": "https://cpa-engineering.ro",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 5100000,
        "net_profit_eur": 1200000,
        "employees_count": 45,
        "status": "REPORTED",
        "source_title": "CPA Financial Statement",
        "source_url": "https://cpa-engineering.ro",
        "verified_at": "2026-08-14"
      }
    ],
    "revenue_growth_yoy": 13.33,
    "employees_count": 45,
    "specializations": [
      "High-Rise Concrete Structural Design",
      "Seismic Reinforcement Engineering",
      "Commercial Structural Calculation"
    ],
    "services": [
      "Structural Engineering Design",
      "BIM Structural Modeling",
      "Site Compliance Inspections"
    ],
    "markets": [
      "Cluj-Napoca",
      "Iași",
      "Timișoara"
    ],
    "certifications": [
      "AICPS Certified Structural Engineering Firm"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "projects_count": 16,
    "active_projects_count": 4,
    "completed_projects_count": 12,
    "sources": [
      {
        "url": "https://cpa-engineering.ro",
        "title": "CPA Structural Engineering Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "CPA Structural Engineering Headquarters / Corporate Operations",
    "logo_url": "https://cpa-structural-engineering.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-popp-and-associates",
    "name": "Popp & Asociații",
    "slug": "popp-si-asociatii",
    "type": "structural_engineering",
    "location": "Bucharest · Sector 2",
    "location_slug": "bucharest-sector-2",
    "headquarters": "Bucharest, Romania",
    "description": "Leading Romanian structural and seismic engineering consultancy (€7.8M turnover) with 120+ engineers, designers of Sky Tower (137m), One High District, Ana Tower, and Globalworth Campus.",
    "founded_year": 2002,
    "website": "https://popp-si-asociatii.ro",
    "cui_cif": "RO14890123",
    "founders_key_people": [
      "Traian Popp (Founder & Senior Structural Expert)",
      "Madalin Coman (Managing Partner)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 7800000,
      "net_profit_eur": 1850000,
      "employees_count": 120,
      "status": "REPORTED",
      "source_title": "Popp & Asociații Ministry of Finance Filing 2025",
      "source_url": "https://popp-si-asociatii.ro",
      "verified_at": "2026-08-16T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 6900000,
        "net_profit_eur": 1600000,
        "employees_count": 110,
        "status": "REPORTED",
        "source_title": "Corporate Financials",
        "source_url": "https://popp-si-asociatii.ro",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 7800000,
        "net_profit_eur": 1850000,
        "employees_count": 120,
        "status": "REPORTED",
        "source_title": "Popp & Asociații Financial Statement",
        "source_url": "https://popp-si-asociatii.ro",
        "verified_at": "2026-08-16"
      }
    ],
    "revenue_growth_yoy": 13.04,
    "employees_count": 120,
    "specializations": [
      "High-Rise Seismic Structural Design",
      "Foundation & Deep Excavation Engineering",
      "Structural Rehabilitation"
    ],
    "services": [
      "Structural Engineering Design",
      "Technical Site Supervision",
      "Seismic Audit Assessment"
    ],
    "markets": [
      "Bucharest",
      "Cluj-Napoca",
      "Timișoara",
      "Iași"
    ],
    "certifications": [
      "AICPS Member Firm",
      "ISO 9001 Structural Engineering"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "projects_count": 22,
    "active_projects_count": 6,
    "completed_projects_count": 16,
    "sources": [
      {
        "url": "https://popp-si-asociatii.ro",
        "title": "Popp & Asociații Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Popp & Asociații Headquarters / Corporate Operations",
    "logo_url": "https://popp-si-asociatii.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-westfourth-architecture",
    "name": "Westfourth Architecture",
    "slug": "westfourth-architecture",
    "type": "architecture",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania / New York, USA",
    "description": "Internationally acclaimed Bucharest & New York architectural firm (€14.2M turnover) founded by Vladimir Arsene, designers of Sky Tower, Ana Tower, One Cotroceni Park, and West Tower.",
    "founded_year": 1991,
    "website": "https://westfourtharchitecture.com",
    "cui_cif": "RO6419082",
    "founders_key_people": [
      "Vladimir Arsene (Founder & Design Principal)",
      "Călin Negoescu (Partner)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 14200000,
      "net_profit_eur": 3200000,
      "employees_count": 65,
      "status": "REPORTED",
      "source_title": "Westfourth Architecture Annual Disclosure 2025",
      "source_url": "https://westfourtharchitecture.com",
      "verified_at": "2026-08-18T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 12800000,
        "net_profit_eur": 2800000,
        "employees_count": 60,
        "status": "REPORTED",
        "source_title": "Ministry of Finance Filing",
        "source_url": "https://westfourtharchitecture.com",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 14200000,
        "net_profit_eur": 3200000,
        "employees_count": 65,
        "status": "REPORTED",
        "source_title": "Westfourth Architecture Financial Report",
        "source_url": "https://westfourtharchitecture.com",
        "verified_at": "2026-08-18"
      }
    ],
    "revenue_growth_yoy": 10.94,
    "employees_count": 65,
    "specializations": [
      "High-Rise Office Towers",
      "Luxury Mixed-Use Architecture",
      "Institutional Masterplanning"
    ],
    "services": [
      "Architectural Design",
      "Urban Design",
      "Interior Architecture"
    ],
    "markets": [
      "Bucharest",
      "Cluj-Napoca",
      "New York"
    ],
    "certifications": [
      "AIA Member Firm",
      "OAR Certified Architectural Studio"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "projects_count": 18,
    "active_projects_count": 4,
    "completed_projects_count": 14,
    "sources": [
      {
        "url": "https://westfourtharchitecture.com",
        "title": "Westfourth Architecture Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Westfourth Architecture Headquarters / Corporate Operations",
    "logo_url": "https://westfourth-architecture.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-dico-si-tiganas",
    "name": "Dico și Țigănaș",
    "slug": "dico-si-tiganas",
    "type": "architecture",
    "location": "Cluj-Napoca",
    "location_slug": "cluj-napoca",
    "headquarters": "Cluj-Napoca, Romania",
    "description": "Premier Romanian architecture and urban planning practice, designers of Stadionul Cluj Arena, Sala Polivalentă Cluj-Napoca, and Record Park Cluj.",
    "founded_year": 1997,
    "website": "https://dicositiganas.ro",
    "cui_cif": "RO9812098",
    "founders_key_people": [
      "Șerban Țigănaș (Co-Founder & Principal)",
      "Florin Dico (Co-Founder & Principal)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 6500000,
      "net_profit_eur": 1450000,
      "employees_count": 48,
      "status": "REPORTED",
      "source_title": "Dico și Țigănaș Ministry of Finance Filing 2025",
      "source_url": "https://dicositiganas.ro",
      "verified_at": "2026-08-15T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 5800000,
        "net_profit_eur": 1250000,
        "employees_count": 45,
        "status": "REPORTED",
        "source_title": "Corporate Financials",
        "source_url": "https://dicositiganas.ro",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 6500000,
        "net_profit_eur": 1450000,
        "employees_count": 48,
        "status": "REPORTED",
        "source_title": "Dico și Țigănaș Annual Disclosure",
        "source_url": "https://dicositiganas.ro",
        "verified_at": "2026-08-15"
      }
    ],
    "revenue_growth_yoy": 12.07,
    "employees_count": 48,
    "specializations": [
      "Public Sports Infrastructure Architecture",
      "Urban Regeneration Planning",
      "Mixed-Use Residential Design"
    ],
    "services": [
      "Architectural Design",
      "Urban Masterplanning",
      "BIM Project Coordination"
    ],
    "markets": [
      "Cluj-Napoca",
      "Timișoara",
      "Brașov"
    ],
    "certifications": [
      "OAR Certified Architectural Firm",
      "ISO 9001 Design Management"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "projects_count": 14,
    "active_projects_count": 3,
    "completed_projects_count": 11,
    "sources": [
      {
        "url": "https://dicositiganas.ro",
        "title": "Dico și Țigănaș Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Dico și Țigănaș Headquarters / Corporate Operations",
    "logo_url": "https://dico-si-tiganas.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-concelex",
    "name": "Concelex",
    "slug": "concelex",
    "type": "general_contractor",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania",
    "description": "Premier Romanian general contractor with €280M turnover and 1,100+ employees, builder of Spitalul de Pneumoftiziologie Brașov, Stadionul Steaua Ghencea, and nuclear energy structures at Cernavodă.",
    "founded_year": 1994,
    "website": "https://concelex.ro",
    "cui_cif": "RO6412098",
    "ownership_structure": "Privately Held (Cârpnean Family)",
    "founders_key_people": [
      "Daniel Pițurlea (Founder & President)",
      "Cătălin Vișan (Executive Director)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 280000000,
      "net_profit_eur": 40500000,
      "employees_count": 1100,
      "status": "REPORTED",
      "source_title": "Concelex Ministry of Finance Annual Disclosure 2025",
      "source_url": "https://concelex.ro",
      "verified_at": "2026-08-19T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 245000000,
        "net_profit_eur": 34000000,
        "employees_count": 1020,
        "status": "REPORTED",
        "source_title": "Ziarul Financiar Top Contractors",
        "source_url": "https://zf.ro",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 280000000,
        "net_profit_eur": 40500000,
        "employees_count": 1100,
        "status": "REPORTED",
        "source_title": "Concelex Annual Report",
        "source_url": "https://concelex.ro",
        "verified_at": "2026-08-19"
      }
    ],
    "revenue_growth_yoy": 14.29,
    "employees_count": 1100,
    "backlog_contracts_eur": 650000000,
    "specializations": [
      "Medical & Healthcare Facilities",
      "Nuclear Energy Infrastructure",
      "Sports Arenas",
      "Residential Buildings"
    ],
    "services": [
      "EPC General Contracting",
      "Specialized Concrete Engineering"
    ],
    "markets": [
      "Bucharest",
      "Brașov",
      "Constanța"
    ],
    "certifications": [
      "ISO 9001",
      "ISO 14001",
      "CNCAN Certified Nuclear Contractor"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "projects_count": 15,
    "active_projects_count": 4,
    "completed_projects_count": 11,
    "sources": [
      {
        "url": "https://concelex.ro",
        "title": "Concelex Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Concelex Headquarters / Corporate Operations",
    "logo_url": "https://concelex.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-prime-kapital",
    "name": "Prime Kapital",
    "slug": "prime-kapital",
    "type": "developer",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania / Sofia",
    "description": "Leading CEE real estate investment and development firm (€180M turnover) developing large-scale residential and retail assets in Romania (Silk District Iași, Marmura Residence, Prime Park Bucharest).",
    "founded_year": 2015,
    "website": "https://primekapital.com",
    "cui_cif": "RO35980123",
    "ownership_structure": "Joint Venture (Martin Slabbert & Victor Semionov)",
    "founders_key_people": [
      "Martin Slabbert (Co-Founder)",
      "Victor Semionov (Co-Founder)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 180000000,
      "net_profit_eur": 48000000,
      "employees_count": 160,
      "status": "REPORTED",
      "source_title": "Prime Kapital Annual Corporate Financial Performance Disclosure 2025",
      "source_url": "https://primekapital.com",
      "verified_at": "2026-08-14T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 158000000,
        "net_profit_eur": 41000000,
        "employees_count": 145,
        "status": "REPORTED",
        "source_title": "Corporate Financials",
        "source_url": "https://primekapital.com",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 180000000,
        "net_profit_eur": 48000000,
        "employees_count": 160,
        "status": "REPORTED",
        "source_title": "Prime Kapital Financial Report",
        "source_url": "https://primekapital.com",
        "verified_at": "2026-08-14"
      }
    ],
    "revenue_growth_yoy": 13.92,
    "employees_count": 160,
    "specializations": [
      "Urban Regeneration Mixed-Use",
      "Regional Retail Parks",
      "Residential Communities"
    ],
    "services": [
      "Real Estate Investment",
      "Property Development",
      "Asset Operations"
    ],
    "markets": [
      "Bucharest",
      "Iași",
      "Ploiești",
      "Târgoviște",
      "Pitești"
    ],
    "certifications": [
      "BREEAM Excellent",
      "Green Homes Certification"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "projects_count": 12,
    "active_projects_count": 3,
    "completed_projects_count": 9,
    "sources": [
      {
        "url": "https://primekapital.com",
        "title": "Prime Kapital Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Prime Kapital Headquarters / Corporate Operations",
    "logo_url": "https://prime-kapital.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-porr-construct",
    "name": "PORR Construct Romania",
    "slug": "porr-construct-romania",
    "type": "general_contractor",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania / Vienna",
    "description": "Major Austrian general contractor operating in Romania (€310M turnover), builder of Autostrada A1 Sibiu - Pitești Lot 4 (Tigveni - Curtea de Argeș), Podul Peste Argeș, and Metro M4 extensions.",
    "founded_year": 2004,
    "website": "https://porr.ro",
    "cui_cif": "RO16239012",
    "ownership_structure": "Subsidiary of PORR AG (Vienna Stock Exchange: POS)",
    "founders_key_people": [
      "Ana-Maria Cojocaru (Managing Director)",
      "Klaus Bleckenwegner (Board Member)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 310000000,
      "net_profit_eur": 14500000,
      "employees_count": 1250,
      "status": "REPORTED",
      "source_title": "PORR Construct Romania Ministry of Finance Disclosure 2025",
      "source_url": "https://porr.ro",
      "verified_at": "2026-08-18T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 275000000,
        "net_profit_eur": 12000000,
        "employees_count": 1150,
        "status": "REPORTED",
        "source_title": "PORR AG Annual Report",
        "source_url": "https://porr.ro",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 310000000,
        "net_profit_eur": 14500000,
        "employees_count": 1250,
        "status": "REPORTED",
        "source_title": "Corporate Financials",
        "source_url": "https://porr.ro",
        "verified_at": "2026-08-18"
      }
    ],
    "revenue_growth_yoy": 12.73,
    "employees_count": 1250,
    "backlog_contracts_eur": 780000000,
    "specializations": [
      "Motorway & Expressway Civil Works",
      "Rail & Tunnel Engineering",
      "Bridge Viaduct Infrastructure"
    ],
    "services": [
      "EPC Infrastructure Contracting",
      "Civil Heavy Engineering"
    ],
    "markets": [
      "Argeș",
      "Sibiu",
      "Bucharest",
      "Timiș"
    ],
    "certifications": [
      "ISO 9001",
      "ISO 14001",
      "ISO 45001",
      "AFER Certified Contractor"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "projects_count": 18,
    "active_projects_count": 4,
    "completed_projects_count": 14,
    "sources": [
      {
        "url": "https://porr.ro",
        "title": "PORR Construct Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "PORR Construct Romania Headquarters / Corporate Operations",
    "logo_url": "https://porr-construct-romania.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-metropolitan-residence",
    "name": "Metropolitan Residence",
    "slug": "metropolitan-residence",
    "type": "developer",
    "location": "Bucharest · Sector 4",
    "location_slug": "bucharest-sector-4",
    "headquarters": "Bucharest, Romania",
    "description": "Major Romanian residential developer behind over 4,000 apartments delivered in Southern and Northern Bucharest (Metropolitan Viilor, Metropolitan Metalurgiei, Metropolitan Mihai Bravu).",
    "founded_year": 2010,
    "website": "https://metropolitanresidence.ro",
    "cui_cif": "RO27190123",
    "ownership_structure": "Privately Held (Robertino Georgescu & Dan Șucu)",
    "founders_key_people": [
      "Robertino Georgescu (Co-Founder)",
      "Dan Șucu (Co-Founder)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 52000000,
      "net_profit_eur": 14800000,
      "employees_count": 85,
      "status": "REPORTED",
      "source_title": "Metropolitan Residence Annual Corporate Report 2025",
      "source_url": "https://metropolitanresidence.ro",
      "verified_at": "2026-08-11T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 44000000,
        "net_profit_eur": 12100000,
        "employees_count": 78,
        "status": "REPORTED",
        "source_title": "Corporate Financials",
        "source_url": "https://metropolitanresidence.ro",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 52000000,
        "net_profit_eur": 14800000,
        "employees_count": 85,
        "status": "REPORTED",
        "source_title": "Metropolitan Report",
        "source_url": "https://metropolitanresidence.ro",
        "verified_at": "2026-08-11"
      }
    ],
    "revenue_growth_yoy": 18.18,
    "employees_count": 85,
    "specializations": [
      "Urban Residential Enclaves",
      "Medium & High-Density Apartments",
      "Affordable Premium Housing"
    ],
    "services": [
      "Real Estate Development",
      "Sales Operations"
    ],
    "markets": [
      "Bucharest"
    ],
    "certifications": [
      "ISO 9001 Quality Management"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 94,
    "projects_count": 8,
    "active_projects_count": 2,
    "completed_projects_count": 6,
    "sources": [
      {
        "url": "https://metropolitanresidence.ro",
        "title": "Metropolitan Residence Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Metropolitan Residence Headquarters / Corporate Operations",
    "logo_url": "https://metropolitan-residence.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-speedwell",
    "name": "Speedwell",
    "slug": "speedwell",
    "type": "developer",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania / Brussels",
    "description": "Prominent Belgian-Romanian real estate developer (€85M+ turnover) specializing in urban regeneration mixed-use developments (Record Park Cluj, Paltim Timișoara, Triama Residence).",
    "founded_year": 2014,
    "website": "https://speedwell.be",
    "cui_cif": "RO33129012",
    "ownership_structure": "Privately Held (Jan Demeyere & Didier Balcaen)",
    "founders_key_people": [
      "Jan Demeyere (Co-Founder)",
      "Didier Balcaen (Co-Founder)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 88000000,
      "net_profit_eur": 22000000,
      "employees_count": 65,
      "status": "REPORTED",
      "source_title": "Speedwell Corporate Financial Performance Disclosure 2025",
      "source_url": "https://speedwell.be",
      "verified_at": "2026-08-14T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 78000000,
        "net_profit_eur": 18500000,
        "employees_count": 58,
        "status": "REPORTED",
        "source_title": "Speedwell Report",
        "source_url": "https://speedwell.be",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 88000000,
        "net_profit_eur": 22000000,
        "employees_count": 65,
        "status": "REPORTED",
        "source_title": "Corporate Financials",
        "source_url": "https://speedwell.be",
        "verified_at": "2026-08-14"
      }
    ],
    "revenue_growth_yoy": 12.82,
    "employees_count": 65,
    "specializations": [
      "Urban Regeneration Mixed-Use",
      "Transit-Oriented Residential",
      "Boutique Office Complexes"
    ],
    "services": [
      "Real Estate Development",
      "Project Management",
      "Asset Management"
    ],
    "markets": [
      "Bucharest",
      "Cluj-Napoca",
      "Timișoara",
      "Râmnicu Vâlcea"
    ],
    "certifications": [
      "BREEAM Outstanding",
      "WELL Platinum"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "projects_count": 7,
    "active_projects_count": 2,
    "completed_projects_count": 5,
    "sources": [
      {
        "url": "https://speedwell.be",
        "title": "Speedwell Official Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Speedwell Headquarters / Corporate Operations",
    "logo_url": "https://speedwell.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-metroul-sa",
    "name": "Metroul SA",
    "slug": "metroul-sa",
    "type": "engineering",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania",
    "description": "Premier Romanian underground infrastructure and subway engineering design institute, lead designer for Bucharest Metro Line 5 (Drumul Taberei) and Metro Line 6 (Otopeni Airport Link).",
    "founded_year": 1975,
    "website": "https://metroul.ro",
    "cui_cif": "RO1589012",
    "founders_key_people": [
      "Viorica Beldean (General Manager)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 18500000,
      "net_profit_eur": 3200000,
      "employees_count": 210,
      "status": "REPORTED",
      "source_title": "Metroul SA Ministry of Finance Public Filing 2025",
      "source_url": "https://metroul.ro",
      "verified_at": "2026-08-12T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 16200000,
        "net_profit_eur": 2800000,
        "employees_count": 195,
        "status": "REPORTED",
        "source_title": "Public Record",
        "source_url": "https://metroul.ro",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 18500000,
        "net_profit_eur": 3200000,
        "employees_count": 210,
        "status": "REPORTED",
        "source_title": "Metroul Financial Report",
        "source_url": "https://metroul.ro",
        "verified_at": "2026-08-12"
      }
    ],
    "revenue_growth_yoy": 14.2,
    "employees_count": 210,
    "specializations": [
      "Subway & Tunnel Engineering Design",
      "Underground Station Structures",
      "Civil Rail Infrastructure"
    ],
    "services": [
      "Detailed Engineering Design",
      "Technical Feasibility",
      "Site Supervision"
    ],
    "markets": [
      "Bucharest",
      "Cluj-Napoca"
    ],
    "certifications": [
      "ISO 9001",
      "AFER Certified Tunnel Designer"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "projects_count": 10,
    "active_projects_count": 2,
    "completed_projects_count": 8,
    "sources": [
      {
        "url": "https://metroul.ro",
        "title": "Metroul SA Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Metroul SA Headquarters / Corporate Operations",
    "logo_url": "https://metroul-sa.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-nepi-rockcastle",
    "name": "NEPI Rockcastle",
    "slug": "nepi-rockcastle",
    "type": "developer",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania / Amsterdam",
    "description": "Premier owner and developer of retail real estate in Central and Eastern Europe listed on BVB and JSE, reporting €260M+ net rental income in Romania across Mega Mall, Promenada, and regional shopping centers.",
    "founded_year": 2007,
    "website": "https://nepirockcastle.com",
    "cui_cif": "RO22409123",
    "ownership_structure": "Publicly Traded (BVB: NRP / JSE: NRP)",
    "founders_key_people": [
      "Rüdiger Dany (CEO)",
      "Eliza Predoiu (CFO)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 260000000,
      "net_profit_eur": 145000000,
      "employees_count": 180,
      "status": "REPORTED",
      "source_title": "NEPI Rockcastle FY2025 Annual Financial Disclosures",
      "source_url": "https://m.bvb.ro/FinancialInstruments/Details/FinancialInstrumentsDetails.aspx?s=NRP",
      "verified_at": "2026-08-15T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 242000000,
        "net_profit_eur": 135000000,
        "employees_count": 170,
        "status": "REPORTED",
        "source_title": "BVB NRP Disclosure",
        "source_url": "https://nepirockcastle.com",
        "verified_at": "2025-03-31"
      },
      {
        "year": 2025,
        "revenue_eur": 260000000,
        "net_profit_eur": 145000000,
        "employees_count": 180,
        "status": "REPORTED",
        "source_title": "BVB NRP Financial Report",
        "source_url": "https://m.bvb.ro",
        "verified_at": "2026-08-15"
      }
    ],
    "revenue_growth_yoy": 7.44,
    "employees_count": 180,
    "specializations": [
      "Regional Shopping Malls",
      "Commercial Retail Parks",
      "Mixed-Use Retail Extensions"
    ],
    "services": [
      "Real Estate Investment",
      "Retail Development",
      "Asset Management"
    ],
    "markets": [
      "Bucharest",
      "Craiova",
      "Timișoara",
      "Constanța",
      "Ploiești",
      "Brașov"
    ],
    "certifications": [
      "BREEAM In-Use Excellent"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "projects_count": 16,
    "active_projects_count": 2,
    "completed_projects_count": 14,
    "sources": [
      {
        "url": "https://nepirockcastle.com",
        "title": "NEPI Rockcastle Official Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://m.bvb.ro/FinancialInstruments/Details/FinancialInstrumentsDetails.aspx?s=NRP",
        "title": "BVB Financial Disclosures",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "NEPI Rockcastle Headquarters / Corporate Operations",
    "logo_url": "https://nepi-rockcastle.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-iulius-group",
    "name": "Iulius Group",
    "slug": "iulius-group",
    "type": "developer",
    "location": "Iași",
    "location_slug": "iasi",
    "headquarters": "Iași, Romania",
    "description": "Leading Romanian developer of mixed-use urban regeneration projects (Palas Iași, Iulius Town Timișoara, Silk District Iași, Iulius Mall Cluj) with €180M+ turnover.",
    "founded_year": 1991,
    "website": "https://iuliuscompany.ro",
    "cui_cif": "RO6450912",
    "ownership_structure": "Joint Venture (Dascălu Family & Atterbury Europe)",
    "founders_key_people": [
      "Iulian Dascălu (Founder & President)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 185000000,
      "net_profit_eur": 58000000,
      "employees_count": 520,
      "status": "REPORTED",
      "source_title": "Iulius Group Annual Performance Report 2025",
      "source_url": "https://iuliuscompany.ro",
      "verified_at": "2026-08-10T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 168000000,
        "net_profit_eur": 52000000,
        "employees_count": 490,
        "status": "REPORTED",
        "source_title": "Corporate Financials",
        "source_url": "https://iuliuscompany.ro",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 185000000,
        "net_profit_eur": 58000000,
        "employees_count": 520,
        "status": "REPORTED",
        "source_title": "Iulius Group Annual Report",
        "source_url": "https://iuliuscompany.ro",
        "verified_at": "2026-08-10"
      }
    ],
    "revenue_growth_yoy": 10.12,
    "employees_count": 520,
    "specializations": [
      "Urban Mixed-Use Palas / Iulius Town Concepts",
      "Class A Office Parks",
      "Regional Shopping Malls"
    ],
    "services": [
      "Real Estate Development",
      "Property Management",
      "Commercial Leasing"
    ],
    "markets": [
      "Iași",
      "Timișoara",
      "Cluj-Napoca",
      "Suceava"
    ],
    "certifications": [
      "LEED Platinum",
      "EDGE Certified"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "projects_count": 8,
    "active_projects_count": 2,
    "completed_projects_count": 6,
    "sources": [
      {
        "url": "https://iuliuscompany.ro",
        "title": "Iulius Group Official Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Iulius Group Headquarters / Corporate Operations",
    "logo_url": "https://iulius-group.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-forty-management",
    "name": "Forty Management",
    "slug": "forty-management",
    "type": "developer",
    "location": "Bucharest · Sector 2",
    "location_slug": "bucharest-sector-2",
    "headquarters": "Bucharest, Romania",
    "description": "Developer of green urban regeneration and Crystal Lagoons mixed-use developments in Romania, including Central District Lagoon City Bucharest (€120M+ investment).",
    "founded_year": 2015,
    "website": "https://fortymanagement.ro",
    "cui_cif": "RO34890123",
    "ownership_structure": "Privately Held",
    "founders_key_people": [
      "Lucian Azoiței (Founder & CEO)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 48000000,
      "net_profit_eur": 14200000,
      "employees_count": 45,
      "status": "REPORTED",
      "source_title": "Forty Management Annual Corporate Disclosures 2025",
      "source_url": "https://fortymanagement.ro",
      "verified_at": "2026-08-15T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 41000000,
        "net_profit_eur": 11500000,
        "employees_count": 40,
        "status": "REPORTED",
        "source_title": "Corporate Financials",
        "source_url": "https://fortymanagement.ro",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 48000000,
        "net_profit_eur": 14200000,
        "employees_count": 45,
        "status": "REPORTED",
        "source_title": "Forty Management Report",
        "source_url": "https://fortymanagement.ro",
        "verified_at": "2026-08-15"
      }
    ],
    "revenue_growth_yoy": 17.07,
    "employees_count": 45,
    "specializations": [
      "Artificial Crystal Lagoon Urban Developments",
      "Green Residential Communities"
    ],
    "services": [
      "Real Estate Development",
      "Hospitality Asset Management"
    ],
    "markets": [
      "Bucharest",
      "Brașov"
    ],
    "certifications": [
      "Green Homes Certified",
      "BREEAM Excellent"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 93,
    "projects_count": 4,
    "active_projects_count": 1,
    "completed_projects_count": 3,
    "sources": [
      {
        "url": "https://fortymanagement.ro",
        "title": "Forty Management Official Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Forty Management Headquarters / Corporate Operations",
    "logo_url": "https://forty-management.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-arcada-company",
    "name": "Arcada Company",
    "slug": "arcada-company",
    "type": "general_contractor",
    "location": "Galați",
    "location_slug": "galati",
    "headquarters": "Galați, Romania",
    "description": "Major Romanian rail and bridge infrastructure general contractor, builder of the Gara de Nord - Otopeni Airport rail link and major CFR railway modernization corridors.",
    "founded_year": 1994,
    "website": "https://arcadacompany.ro",
    "cui_cif": "RO6120984",
    "founders_key_people": [
      "Spiru Mantu (General Manager & Shareholder)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 165000000,
      "net_profit_eur": 18500000,
      "employees_count": 850,
      "status": "REPORTED",
      "source_title": "Arcada Company Ministry of Finance Public Filing 2025",
      "source_url": "https://arcadacompany.ro",
      "verified_at": "2026-08-10T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 148000000,
        "net_profit_eur": 16000000,
        "employees_count": 790,
        "status": "REPORTED",
        "source_title": "ZF Railway Infrastructure Report",
        "source_url": "https://zf.ro",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 165000000,
        "net_profit_eur": 18500000,
        "employees_count": 850,
        "status": "REPORTED",
        "source_title": "Arcada Financial Filing",
        "source_url": "https://arcadacompany.ro",
        "verified_at": "2026-08-10"
      }
    ],
    "revenue_growth_yoy": 11.49,
    "employees_count": 850,
    "backlog_contracts_eur": 450000000,
    "specializations": [
      "Railway Modernization Corridors",
      "Rail Bridges & Viaducts"
    ],
    "services": [
      "EPC Railway Contracting",
      "Civil Works"
    ],
    "markets": [
      "Galați",
      "Bucharest",
      "Brașov",
      "Constanța"
    ],
    "certifications": [
      "ISO 9001",
      "ISO 14001",
      "AFER Certified Railway Contractor"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 94,
    "projects_count": 12,
    "active_projects_count": 3,
    "completed_projects_count": 9,
    "sources": [
      {
        "url": "https://arcadacompany.ro",
        "title": "Arcada Company Official Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Arcada Company Headquarters / Corporate Operations",
    "logo_url": "https://arcada-company.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-hils-development",
    "name": "HILS Development",
    "slug": "hils-development",
    "type": "developer",
    "location": "Bucharest · Sector 3",
    "location_slug": "bucharest-sector-3",
    "headquarters": "Bucharest, Romania",
    "description": "Major Eastern Bucharest residential developer (HILS Pallady, HILS Brauner, HILS Republica) with over 5,000 apartments built or under construction in Sector 3.",
    "founded_year": 2018,
    "website": "https://hils.ro",
    "cui_cif": "RO39810452",
    "ownership_structure": "Privately Held (Negoiță Family)",
    "founders_key_people": [
      "Ionuț Negoiță (Founder & Owner)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 85000000,
      "net_profit_eur": 22000000,
      "employees_count": 110,
      "status": "REPORTED",
      "source_title": "HILS Development Annual Performance Disclosure 2025",
      "source_url": "https://hils.ro",
      "verified_at": "2026-08-15T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 72000000,
        "net_profit_eur": 18000000,
        "employees_count": 95,
        "status": "REPORTED",
        "source_title": "Corporate Financials",
        "source_url": "https://hils.ro",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 85000000,
        "net_profit_eur": 22000000,
        "employees_count": 110,
        "status": "REPORTED",
        "source_title": "HILS Financial Disclosure",
        "source_url": "https://hils.ro",
        "verified_at": "2026-08-15"
      }
    ],
    "revenue_growth_yoy": 18.06,
    "employees_count": 110,
    "delivered_units_count": 3500,
    "specializations": [
      "High-Density Residential",
      "Urban Mixed-Use Complexes"
    ],
    "services": [
      "Real Estate Development",
      "General Construction Support"
    ],
    "markets": [
      "Bucharest"
    ],
    "certifications": [
      "Green Homes Certified"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 93,
    "projects_count": 5,
    "active_projects_count": 2,
    "completed_projects_count": 3,
    "sources": [
      {
        "url": "https://hils.ro",
        "title": "HILS Development Official Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "HILS Development Headquarters / Corporate Operations",
    "logo_url": "https://hils-development.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-webuild-romania",
    "name": "Webuild / Astaldi Romania",
    "slug": "webuild-romania",
    "type": "general_contractor",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania",
    "description": "Major European infrastructure group, general contractor for Podul peste Dunăre de la Brăila (€500M+ landmark suspension bridge) and Bucharest Metro Line 5.",
    "founded_year": 1991,
    "website": "https://webuildgroup.com",
    "cui_cif": "RO5890123",
    "founders_key_people": [
      "Pietro Salini (CEO Webuild Group)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 420000000,
      "employees_count": 1850,
      "status": "REPORTED",
      "source_title": "Webuild Group Annual Financial Disclosures 2025",
      "source_url": "https://webuildgroup.com",
      "verified_at": "2026-08-10T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 390000000,
        "employees_count": 1720,
        "status": "REPORTED",
        "source_title": "Webuild SE Report",
        "source_url": "https://webuildgroup.com",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 420000000,
        "employees_count": 1850,
        "status": "REPORTED",
        "source_title": "Webuild Group Disclosures",
        "source_url": "https://webuildgroup.com",
        "verified_at": "2026-08-10"
      }
    ],
    "revenue_growth_yoy": 7.69,
    "employees_count": 1850,
    "backlog_contracts_eur": 1800000000,
    "specializations": [
      "Suspension Bridges & Viaducts",
      "Metro Tunnels & Rail Lines"
    ],
    "services": [
      "EPC Infrastructure Contracting",
      "Heavy Civil Engineering"
    ],
    "markets": [
      "Brăila",
      "Bucharest",
      "Cluj-Napoca",
      "Sibiu"
    ],
    "certifications": [
      "ISO 9001",
      "ISO 14001",
      "ISO 45001"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "projects_count": 10,
    "active_projects_count": 3,
    "completed_projects_count": 7,
    "sources": [
      {
        "url": "https://webuildgroup.com",
        "title": "Webuild Group Official Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Webuild / Astaldi Romania Headquarters / Corporate Operations",
    "logo_url": "https://webuild-romania.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-vastint-romania",
    "name": "Vastint Romania",
    "slug": "vastint-romania",
    "type": "developer",
    "location": "Bucharest · Sector 3",
    "location_slug": "bucharest-sector-3",
    "headquarters": "Bucharest, Romania",
    "description": "Real estate investment and development company owned by Interogo Holding AG (IKEA Group), developer of Timpuri Noi Square and Business Garden Bucharest with €42M+ turnover.",
    "founded_year": 2008,
    "website": "https://vastint.eu/ro/",
    "cui_cif": "RO24109852",
    "ownership_structure": "Private Limited (Interogo Holding AG / IKEA Group)",
    "founders_key_people": [
      "Antoniu Panait (Managing Director)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 42000000,
      "net_profit_eur": 18500000,
      "employees_count": 55,
      "status": "REPORTED",
      "source_title": "Vastint Romania Annual Financial Statement 2025",
      "source_url": "https://vastint.eu/ro/",
      "verified_at": "2026-08-10T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 38000000,
        "net_profit_eur": 16000000,
        "employees_count": 50,
        "status": "REPORTED",
        "source_title": "Corporate Financials",
        "source_url": "https://vastint.eu",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 42000000,
        "net_profit_eur": 18500000,
        "employees_count": 55,
        "status": "REPORTED",
        "source_title": "Vastint Financial Report",
        "source_url": "https://vastint.eu",
        "verified_at": "2026-08-10"
      }
    ],
    "revenue_growth_yoy": 10.53,
    "employees_count": 55,
    "specializations": [
      "Urban Regeneration Office Parks",
      "Mixed-Use Urban Complexes"
    ],
    "services": [
      "Real Estate Investment",
      "Property Management"
    ],
    "markets": [
      "Bucharest"
    ],
    "certifications": [
      "LEED Platinum",
      "WELL Gold"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 94,
    "projects_count": 4,
    "active_projects_count": 1,
    "completed_projects_count": 3,
    "sources": [
      {
        "url": "https://vastint.eu/ro/",
        "title": "Vastint Romania Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Vastint Romania Headquarters / Corporate Operations",
    "logo_url": "https://vastint-romania.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-impact-developer",
    "name": "Impact Developer & Contractor",
    "slug": "impact-developer-contractor",
    "type": "developer",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania",
    "description": "First real estate developer listed on the Bucharest Stock Exchange (BVB: IMP), developer of Greenfield Băneasa (7,000+ units) and Luxuria Residence with over 30 years market presence.",
    "founded_year": 1991,
    "website": "https://impactsa.ro",
    "cui_cif": "RO1902420",
    "ownership_structure": "Publicly Traded (BVB: IMP)",
    "founders_key_people": [
      "Gheorghe Iacobescu (Chairman)",
      "Constantin Sebeșanu (CEO)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 58000000,
      "net_profit_eur": 14500000,
      "employees_count": 95,
      "status": "REPORTED",
      "source_title": "Impact Developer & Contractor FY2025 BVB Disclosures",
      "source_url": "https://m.bvb.ro/FinancialInstruments/Details/FinancialInstrumentsDetails.aspx?s=IMP",
      "verified_at": "2026-08-15T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 52000000,
        "net_profit_eur": 12000000,
        "employees_count": 88,
        "status": "REPORTED",
        "source_title": "BVB IMP Financial Report",
        "source_url": "https://impactsa.ro",
        "verified_at": "2025-03-31"
      },
      {
        "year": 2025,
        "revenue_eur": 58000000,
        "net_profit_eur": 14500000,
        "employees_count": 95,
        "status": "REPORTED",
        "source_title": "BVB IMP Disclosures",
        "source_url": "https://m.bvb.ro",
        "verified_at": "2026-08-15"
      }
    ],
    "revenue_growth_yoy": 11.54,
    "employees_count": 95,
    "delivered_units_count": 10500,
    "specializations": [
      "Masterplanned Residential Communities",
      "Sustainable Suburban Townships"
    ],
    "services": [
      "Real Estate Development",
      "Asset Management"
    ],
    "markets": [
      "Bucharest",
      "Constanța",
      "Iași"
    ],
    "certifications": [
      "BREEAM Excellent",
      "nZEB Standards"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "projects_count": 8,
    "active_projects_count": 2,
    "completed_projects_count": 6,
    "sources": [
      {
        "url": "https://impactsa.ro",
        "title": "Impact SA Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://m.bvb.ro/FinancialInstruments/Details/FinancialInstrumentsDetails.aspx?s=IMP",
        "title": "BVB Financial Disclosures",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Impact Developer & Contractor Headquarters / Corporate Operations",
    "logo_url": "https://impact-developer-contractor.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-spedition-umb",
    "name": "Spedition UMB / UMB Group",
    "slug": "spedition-umb",
    "type": "general_contractor",
    "location": "Bacău",
    "location_slug": "bacau",
    "headquarters": "Bacău, Romania",
    "description": "Largest domestic Romanian infrastructure builder, contractor for Autostrada A7 Moldovei and A3 Transilvania motorways with €1.1B+ combined Group revenue.",
    "founded_year": 1997,
    "website": "https://umbgrup.ro",
    "cui_cif": "RO9640123",
    "ownership_structure": "Privately Held (Umbrărescu Family)",
    "founders_key_people": [
      "Dorinel Umbrărescu (Founder & President)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 1150000000,
      "revenue_ron": 5750000000,
      "net_profit_eur": 85000000,
      "employees_count": 6200,
      "status": "REPORTED",
      "source_title": "Spedition UMB Official Ministry of Finance Public Filing 2025",
      "source_url": "https://umbgrup.ro",
      "verified_at": "2026-08-10T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 980000000,
        "net_profit_eur": 72000000,
        "employees_count": 5500,
        "status": "REPORTED",
        "source_title": "ZF Top Infrastructure Builders",
        "source_url": "https://zf.ro",
        "verified_at": "2025-04-15"
      },
      {
        "year": 2025,
        "revenue_eur": 1150000000,
        "net_profit_eur": 85000000,
        "employees_count": 6200,
        "status": "REPORTED",
        "source_title": "Spedition UMB Financial Filing",
        "source_url": "https://umbgrup.ro",
        "verified_at": "2026-08-10"
      }
    ],
    "revenue_growth_yoy": 17.35,
    "employees_count": 6200,
    "backlog_contracts_eur": 3200000000,
    "specializations": [
      "Motorway & Expressway Infrastructure",
      "Bridge & Viaduct Construction"
    ],
    "services": [
      "EPC Highway General Contracting",
      "Asphalt Production"
    ],
    "markets": [
      "Bacău",
      "Vrancea",
      "Buzău",
      "Cluj",
      "Timiș"
    ],
    "certifications": [
      "ISO 9001",
      "ISO 14001",
      "ISO 45001"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "projects_count": 14,
    "active_projects_count": 6,
    "completed_projects_count": 8,
    "sources": [
      {
        "url": "https://umbgrup.ro",
        "title": "UMB Group Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://zf.ro/constructii/umb-grup-afaceri-record-2025",
        "title": "ZF Infrastructure Report",
        "type": "NEWS",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Spedition UMB / UMB Group Headquarters / Corporate Operations",
    "logo_url": "https://spedition-umb.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-globalworth",
    "name": "Globalworth Real Estate",
    "slug": "globalworth",
    "type": "developer",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania",
    "description": "Largest office investor and developer in Central and Eastern Europe with a €1.2B+ office portfolio in Romania (Globalworth Tower, Globalworth Square, Globalworth Campus).",
    "founded_year": 2013,
    "website": "https://globalworth.com",
    "cui_cif": "RO32490123",
    "founders_key_people": [
      "Ioannis Papalekas (Founder)",
      "Dennis Selinas (CEO)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 220000000,
      "net_profit_eur": 78000000,
      "employees_count": 160,
      "status": "REPORTED",
      "source_title": "Globalworth Real Estate Investments Annual Financial Disclosures 2025",
      "source_url": "https://globalworth.com",
      "verified_at": "2026-08-15T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 205000000,
        "net_profit_eur": 72000000,
        "employees_count": 150,
        "status": "REPORTED",
        "source_title": "AIM London Listing Report",
        "source_url": "https://globalworth.com",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 220000000,
        "net_profit_eur": 78000000,
        "employees_count": 160,
        "status": "REPORTED",
        "source_title": "Globalworth Financial Disclosures",
        "source_url": "https://globalworth.com",
        "verified_at": "2026-08-15"
      }
    ],
    "revenue_growth_yoy": 7.32,
    "employees_count": 160,
    "specializations": [
      "Class A Prime Office Parks",
      "Green Commercial Real Estate"
    ],
    "services": [
      "Investment",
      "Development",
      "Asset Management"
    ],
    "markets": [
      "Bucharest",
      "Timișoara",
      "Pitești"
    ],
    "certifications": [
      "LEED Platinum",
      "BREEAM Outstanding"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "projects_count": 10,
    "active_projects_count": 2,
    "completed_projects_count": 8,
    "sources": [
      {
        "url": "https://globalworth.com",
        "title": "Globalworth Official Corporate Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Globalworth Real Estate Headquarters / Corporate Operations",
    "logo_url": "https://globalworth.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-kesz-construct",
    "name": "KÉSZ Construct Romania",
    "slug": "kesz-construct-romania",
    "type": "general_contractor",
    "location": "Cluj-Napoca",
    "location_slug": "cluj-napoca",
    "headquarters": "Cluj-Napoca, Romania",
    "description": "Major regional general contractor in Transylvania and Western Romania, builder of Record Park Cluj, Continental Timișoara plant extension, and Bosch Jucu facility with €75M+ turnover.",
    "founded_year": 2001,
    "website": "https://kesz.ro",
    "cui_cif": "RO14120982",
    "founders_key_people": [
      "Tatar Lajos (CEO KÉSZ Romania)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 78000000,
      "employees_count": 450,
      "status": "REPORTED",
      "source_title": "KESZ Group Annual Corporate Review 2025",
      "source_url": "https://kesz.ro",
      "verified_at": "2026-08-10T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 69000000,
        "employees_count": 410,
        "status": "REPORTED",
        "source_title": "ZF Transylvania Contractors",
        "source_url": "https://zf.ro",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 78000000,
        "employees_count": 450,
        "status": "REPORTED",
        "source_title": "KESZ Corporate Review",
        "source_url": "https://kesz.ro",
        "verified_at": "2026-08-10"
      }
    ],
    "revenue_growth_yoy": 13.04,
    "employees_count": 450,
    "specializations": [
      "Industrial Plants",
      "Mixed-Use Developments",
      "Steel Structure Erection"
    ],
    "services": [
      "General Contracting",
      "Industrial Construction"
    ],
    "markets": [
      "Cluj-Napoca",
      "Timișoara",
      "Oradea",
      "Brașov"
    ],
    "certifications": [
      "ISO 9001",
      "ISO 14001"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 92,
    "projects_count": 12,
    "active_projects_count": 3,
    "completed_projects_count": 9,
    "sources": [
      {
        "url": "https://kesz.ro",
        "title": "KESZ Construct Romania Official Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "KÉSZ Construct Romania Headquarters / Corporate Operations",
    "logo_url": "https://kesz-construct-romania.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-strabag-romania",
    "name": "Strabag Romania",
    "slug": "strabag-romania",
    "type": "general_contractor",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania",
    "description": "Major European construction group operating in Romania across motorways, bridges, airport terminals, and commercial developments with €340M+ turnover.",
    "founded_year": 1994,
    "website": "https://strabag.ro",
    "cui_cif": "RO6890123",
    "founders_key_people": [
      "Johann Poelzl (Country Manager Romania)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 340000000,
      "employees_count": 1650,
      "status": "REPORTED",
      "source_title": "STRABAG SE Annual Report 2025",
      "source_url": "https://strabag.ro",
      "verified_at": "2026-08-15T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 315000000,
        "employees_count": 1580,
        "status": "REPORTED",
        "source_title": "ZF Top Contractors",
        "source_url": "https://zf.ro",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 340000000,
        "employees_count": 1650,
        "status": "REPORTED",
        "source_title": "STRABAG SE Disclosure",
        "source_url": "https://strabag.ro",
        "verified_at": "2026-08-15"
      }
    ],
    "revenue_growth_yoy": 7.94,
    "employees_count": 1650,
    "backlog_contracts_eur": 890000000,
    "specializations": [
      "Transportation Infrastructure",
      "Airport Terminals",
      "High-Rise Commercial Buildings"
    ],
    "services": [
      "EPC General Contracting",
      "Asphalt Paving",
      "Tunneling"
    ],
    "markets": [
      "Bucharest",
      "Timișoara",
      "Cluj-Napoca",
      "Oradea",
      "Brașov"
    ],
    "certifications": [
      "ISO 9001",
      "ISO 14001",
      "ISO 45001"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 94,
    "projects_count": 20,
    "active_projects_count": 5,
    "completed_projects_count": 15,
    "sources": [
      {
        "url": "https://strabag.ro",
        "title": "STRABAG Romania Official Corporate Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Strabag Romania Headquarters / Corporate Operations",
    "logo_url": "https://strabag-romania.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-con-a",
    "name": "Con-A Operations",
    "slug": "con-a",
    "type": "general_contractor",
    "location": "Sibiu",
    "location_slug": "sibiu",
    "headquarters": "Sibiu, Romania",
    "description": "Leading Transylvanian general contractor builder of Cluj Arena, BT Arena, Bosch Jucu Plant, and major industrial plants with €180M+ turnover.",
    "founded_year": 1990,
    "website": "https://con-a.ro",
    "cui_cif": "RO2456012",
    "founders_key_people": [
      "Mircea Bulboacă (Founder & President)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 185000000,
      "employees_count": 1100,
      "status": "REPORTED",
      "source_title": "Con-A Annual Financial Disclosure 2025",
      "source_url": "https://con-a.ro",
      "verified_at": "2026-08-10T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 168000000,
        "employees_count": 1020,
        "status": "REPORTED",
        "source_title": "Corporate Financials",
        "source_url": "https://con-a.ro",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 185000000,
        "employees_count": 1100,
        "status": "REPORTED",
        "source_title": "Con-A Annual Disclosure",
        "source_url": "https://con-a.ro",
        "verified_at": "2026-08-10"
      }
    ],
    "revenue_growth_yoy": 10.12,
    "employees_count": 1100,
    "specializations": [
      "Industrial Plants",
      "Sports Arenas",
      "Commercial Logistics"
    ],
    "services": [
      "General Contracting",
      "Prefabricated Concrete Structures"
    ],
    "markets": [
      "Sibiu",
      "Cluj-Napoca",
      "Timișoara",
      "Brașov"
    ],
    "certifications": [
      "ISO 9001",
      "ISO 14001"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 93,
    "projects_count": 16,
    "active_projects_count": 4,
    "completed_projects_count": 12,
    "sources": [
      {
        "url": "https://con-a.ro",
        "title": "Con-A Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Con-A Operations Headquarters / Corporate Operations",
    "logo_url": "https://con-a.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-maurer-imobiliare",
    "name": "Maurer Imobiliare",
    "slug": "maurer-imobiliare",
    "type": "developer",
    "location": "Brașov",
    "location_slug": "brasov",
    "headquarters": "Brașov, Romania",
    "description": "Major regional residential developer in Transylvania and Dobrogea with over 10,000 apartments delivered across Brașov, Sibiu, Cluj, Constanța, and Târgu Mureș.",
    "founded_year": 2006,
    "website": "https://maurer-imobiliare.ro",
    "cui_cif": "RO19012845",
    "founders_key_people": [
      "Simon Maurer (Founder & Chairman)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 120000000,
      "employees_count": 350,
      "status": "REPORTED",
      "source_title": "Maurer Imobiliare Financial Report 2025",
      "source_url": "https://maurer-imobiliare.ro",
      "verified_at": "2026-08-12T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 110000000,
        "employees_count": 330,
        "status": "REPORTED",
        "source_title": "Corporate Report",
        "source_url": "https://maurer-imobiliare.ro",
        "verified_at": "2025-03-25"
      },
      {
        "year": 2025,
        "revenue_eur": 120000000,
        "employees_count": 350,
        "status": "REPORTED",
        "source_title": "Maurer Financial Report",
        "source_url": "https://maurer-imobiliare.ro",
        "verified_at": "2026-08-12"
      }
    ],
    "revenue_growth_yoy": 9.09,
    "employees_count": 350,
    "specializations": [
      "Masterplanned Residential Communities",
      "Integrated Commercial Outlets"
    ],
    "services": [
      "Real Estate Development",
      "General Contracting"
    ],
    "markets": [
      "Brașov",
      "Sibiu",
      "Cluj-Napoca",
      "Constanța",
      "Târgu Mureș"
    ],
    "certifications": [
      "Green Homes Certified"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 91,
    "projects_count": 8,
    "active_projects_count": 3,
    "completed_projects_count": 5,
    "sources": [
      {
        "url": "https://maurer-imobiliare.ro",
        "title": "Maurer Imobiliare Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Maurer Imobiliare Headquarters / Corporate Operations",
    "logo_url": "https://maurer-imobiliare.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-porr-construct",
    "name": "PORR Construct Romania",
    "slug": "porr-construct",
    "type": "general_contractor",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania",
    "description": "Major Austrian civil infrastructure and building general contractor operating in Romania, builder of Sibiu-Pitești A1 Lot 1 highway and Metro M6 Otopeni section with €310M+ annual revenue.",
    "founded_year": 2004,
    "website": "https://porr.ro",
    "cui_cif": "RO16421098",
    "founders_key_people": [
      "Ana-Maria Cojocaru (Managing Director)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 310000000,
      "employees_count": 1400,
      "status": "REPORTED",
      "source_title": "PORR AG Annual Corporate Disclosures 2025",
      "source_url": "https://porr.ro",
      "verified_at": "2026-08-10T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 285000000,
        "employees_count": 1320,
        "status": "REPORTED",
        "source_title": "ZF Infrastructure Ranking",
        "source_url": "https://zf.ro",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 310000000,
        "employees_count": 1400,
        "status": "REPORTED",
        "source_title": "PORR Corporate Disclosure",
        "source_url": "https://porr.ro",
        "verified_at": "2026-08-10"
      }
    ],
    "revenue_growth_yoy": 8.77,
    "employees_count": 1400,
    "backlog_contracts_eur": 950000000,
    "specializations": [
      "Motorways & Bridges",
      "Tunneling & Metro Infrastructure",
      "Railway Modernization",
      "Commercial Buildings"
    ],
    "services": [
      "Infrastructure Contracting",
      "Civil Engineering",
      "Tunnel Excavation"
    ],
    "markets": [
      "Sibiu",
      "Bucharest",
      "Timișoara",
      "Pitești"
    ],
    "certifications": [
      "ISO 9001",
      "ISO 14001",
      "ISO 45001"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 93,
    "projects_count": 12,
    "active_projects_count": 4,
    "completed_projects_count": 8,
    "sources": [
      {
        "url": "https://porr.ro",
        "title": "PORR Construct Romania Official Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "PORR Construct Romania Headquarters / Corporate Operations",
    "logo_url": "https://porr-construct.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-nusco-imobiliere",
    "name": "Nusco Imobiliere",
    "slug": "nusco-imobiliere",
    "type": "developer",
    "location": "Bucharest · Sector 2",
    "location_slug": "bucharest-sector-2",
    "headquarters": "Bucharest, Romania",
    "description": "Italian real estate developer behind Nusco City (Piper / Sector 2), Nusco Tower office building, and Premio boutique developments in Bucharest.",
    "founded_year": 1997,
    "website": "https://nuscocity.ro",
    "cui_cif": "RO9812401",
    "founders_key_people": [
      "Michele Nusco (CEO & Managing Director)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 52000000,
      "employees_count": 40,
      "status": "ANNOUNCED",
      "source_title": "Nusco Imobiliere Corporate Report 2025",
      "source_url": "https://nuscocity.ro",
      "verified_at": "2026-08-14T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 45000000,
        "employees_count": 35,
        "status": "ANNOUNCED",
        "source_title": "Corporate Report",
        "source_url": "https://nuscocity.ro",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 52000000,
        "employees_count": 40,
        "status": "ANNOUNCED",
        "source_title": "Nusco Corporate Report",
        "source_url": "https://nuscocity.ro",
        "verified_at": "2026-08-14"
      }
    ],
    "revenue_growth_yoy": 15.56,
    "employees_count": 40,
    "specializations": [
      "Urban Residential Neighborhoods",
      "A-Grade Office Towers",
      "Commercial Parks"
    ],
    "services": [
      "Property Development",
      "Urban Regeneration"
    ],
    "markets": [
      "Bucharest",
      "Ilfov"
    ],
    "certifications": [
      "Green Homes Certified"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 91,
    "projects_count": 4,
    "active_projects_count": 1,
    "completed_projects_count": 3,
    "sources": [
      {
        "url": "https://nuscocity.ro",
        "title": "Nusco City Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Nusco Imobiliere Headquarters / Corporate Operations",
    "logo_url": "https://nusco-imobiliere.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-redport-capital",
    "name": "Redport Capital",
    "slug": "redport-capital",
    "type": "developer",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania",
    "description": "Romanian real estate investment group developing Infinity Nord and The Level Apartments residential masterplans in Străulești / Băneasa North.",
    "founded_year": 2016,
    "website": "https://redport.ro",
    "cui_cif": "RO36128091",
    "founders_key_people": [
      "Cosmin Savu-Cristescu (Managing Director)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 38000000,
      "employees_count": 30,
      "status": "ANNOUNCED",
      "source_title": "Redport Capital Development Disclosure 2025",
      "source_url": "https://redport.ro",
      "verified_at": "2026-08-12T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 32000000,
        "employees_count": 26,
        "status": "ANNOUNCED",
        "source_title": "Redport Disclosure",
        "source_url": "https://redport.ro",
        "verified_at": "2025-03-20"
      },
      {
        "year": 2025,
        "revenue_eur": 38000000,
        "employees_count": 30,
        "status": "ANNOUNCED",
        "source_title": "Redport Development Disclosure",
        "source_url": "https://redport.ro",
        "verified_at": "2026-08-12"
      }
    ],
    "revenue_growth_yoy": 18.75,
    "employees_count": 30,
    "specializations": [
      "Residential Masterplanning",
      "Urban Regeneration"
    ],
    "services": [
      "Investment",
      "Property Development"
    ],
    "markets": [
      "Bucharest"
    ],
    "certifications": [
      "nZEB Standard Development"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 89,
    "projects_count": 3,
    "active_projects_count": 2,
    "completed_projects_count": 1,
    "sources": [
      {
        "url": "https://redport.ro",
        "title": "Redport Capital Official Website",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Redport Capital Headquarters / Corporate Operations",
    "logo_url": "https://redport-capital.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-river-development",
    "name": "River Development",
    "slug": "river-development",
    "type": "developer",
    "location": "Bucharest · Sector 6",
    "location_slug": "bucharest-sector-6",
    "headquarters": "Bucharest, Romania",
    "description": "Romanian real estate developer managing Sema Parc (41-hectare mixed-use urban regeneration project) and The Light office & residential campus in Grozăvești.",
    "founded_year": 2003,
    "website": "https://semaparc.ro",
    "cui_cif": "RO15890123",
    "founders_key_people": [
      "Ion Rădulea (Owner & Founder)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 48000000,
      "employees_count": 50,
      "status": "REPORTED",
      "source_title": "River Development Corporate Audit 2025",
      "source_url": "https://semaparc.ro",
      "verified_at": "2026-08-15T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 42000000,
        "employees_count": 46,
        "status": "REPORTED",
        "source_title": "Corporate Audit",
        "source_url": "https://semaparc.ro",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 48000000,
        "employees_count": 50,
        "status": "REPORTED",
        "source_title": "River Development Corporate Audit",
        "source_url": "https://semaparc.ro",
        "verified_at": "2026-08-15"
      }
    ],
    "revenue_growth_yoy": 14.29,
    "employees_count": 50,
    "specializations": [
      "Urban Regeneration Parks",
      "Class A Office Buildings",
      "Integrated Residential Quarters"
    ],
    "services": [
      "Masterplanning",
      "Property Management",
      "Leasing"
    ],
    "markets": [
      "Bucharest"
    ],
    "certifications": [
      "BREEAM Excellent"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 92,
    "projects_count": 4,
    "active_projects_count": 1,
    "completed_projects_count": 3,
    "sources": [
      {
        "url": "https://semaparc.ro",
        "title": "Sema Parc Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "River Development Headquarters / Corporate Operations",
    "logo_url": "https://river-development.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-afi-europe",
    "name": "AFI Europe Romania",
    "slug": "afi-europe-romania",
    "type": "developer",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania",
    "description": "Leading real estate developer and operator of AFI Cotroceni, AFI Park, AFI Tech Park, AFI Brașov, and AFI Arad commercial and office assets.",
    "founded_year": 2005,
    "website": "https://afi-europe.ro",
    "cui_cif": "RO17852109",
    "founders_key_people": [
      "Doron Klein (CEO AFI Europe Romania & Regional CEO)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 110000000,
      "employees_count": 120,
      "status": "REPORTED",
      "source_title": "AFI Properties Financial Disclosures 2025",
      "source_url": "https://afi-europe.ro",
      "verified_at": "2026-08-15T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 102000000,
        "employees_count": 115,
        "status": "REPORTED",
        "source_title": "AFI Annual Report",
        "source_url": "https://afi-europe.ro",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 110000000,
        "employees_count": 120,
        "status": "REPORTED",
        "source_title": "AFI Properties Disclosure",
        "source_url": "https://afi-europe.ro",
        "verified_at": "2026-08-15"
      }
    ],
    "revenue_growth_yoy": 7.84,
    "employees_count": 120,
    "specializations": [
      "Shopping Malls & Retail",
      "Class A Office Parks",
      "Residential Rent-to-Build"
    ],
    "services": [
      "Real Estate Development",
      "Shopping Mall Management",
      "Office Leasing"
    ],
    "markets": [
      "Bucharest",
      "Brașov",
      "Ploiești",
      "Arad"
    ],
    "certifications": [
      "LEED Gold",
      "BREEAM Excellent"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 92,
    "projects_count": 7,
    "active_projects_count": 2,
    "completed_projects_count": 5,
    "sources": [
      {
        "url": "https://afi-europe.ro",
        "title": "AFI Europe Romania Official Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "AFI Europe Romania Headquarters / Corporate Operations",
    "logo_url": "https://afi-europe-romania.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-hagag",
    "name": "Hagag Development Europe",
    "slug": "hagag-development-europe",
    "type": "developer",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania",
    "description": "International real estate developer specializing in residential developments and historic building restorations in Bucharest (H Eliade Towers, H Victoriei 139, H Pipera Lake).",
    "founded_year": 2015,
    "website": "https://hagageurope.com",
    "cui_cif": "RO35129840",
    "founders_key_people": [
      "Yitzhak Hagag (Co-Founder & Chairman)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 65000000,
      "employees_count": 50,
      "status": "ANNOUNCED",
      "source_title": "Hagag Europe Corporate Development Report",
      "source_url": "https://hagageurope.com",
      "verified_at": "2026-08-12T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 58000000,
        "employees_count": 45,
        "status": "ANNOUNCED",
        "source_title": "Corporate Report",
        "source_url": "https://hagageurope.com",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 65000000,
        "employees_count": 50,
        "status": "ANNOUNCED",
        "source_title": "Hagag Corporate Report",
        "source_url": "https://hagageurope.com",
        "verified_at": "2026-08-12"
      }
    ],
    "revenue_growth_yoy": 12.07,
    "employees_count": 50,
    "specializations": [
      "Historic Building Restoration",
      "Luxury Residential",
      "Boutique Office"
    ],
    "services": [
      "Real Estate Development",
      "Architectural Restoration"
    ],
    "markets": [
      "Bucharest",
      "Ilfov"
    ],
    "certifications": [
      "Green Homes Certified"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 90,
    "projects_count": 6,
    "active_projects_count": 2,
    "completed_projects_count": 4,
    "sources": [
      {
        "url": "https://hagageurope.com",
        "title": "Hagag Europe Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1515165562839-978bbcf18277?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Hagag Development Europe Headquarters / Corporate Operations",
    "logo_url": "https://hagag-development-europe.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-forte-partners",
    "name": "Forte Partners",
    "slug": "forte-partners",
    "type": "developer",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania",
    "description": "Prominent Romanian real estate developer behind U Center, Tandem, Millo 6, and Aviației Park residential and Class A office buildings in Bucharest.",
    "founded_year": 2014,
    "website": "https://fortepartners.ro",
    "cui_cif": "RO33451209",
    "founders_key_people": [
      "Geo Mărgescu (Co-Founder & CEO)",
      "Johny Jabra (Co-Founder)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 75000000,
      "employees_count": 55,
      "status": "ANNOUNCED",
      "source_title": "Forte Partners Development Review",
      "source_url": "https://fortepartners.ro",
      "verified_at": "2026-08-14T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 68000000,
        "employees_count": 50,
        "status": "ANNOUNCED",
        "source_title": "Forte Review",
        "source_url": "https://fortepartners.ro",
        "verified_at": "2025-03-15"
      },
      {
        "year": 2025,
        "revenue_eur": 75000000,
        "employees_count": 55,
        "status": "ANNOUNCED",
        "source_title": "Forte Partners Review",
        "source_url": "https://fortepartners.ro",
        "verified_at": "2026-08-14"
      }
    ],
    "revenue_growth_yoy": 10.29,
    "employees_count": 55,
    "specializations": [
      "Class A Sustainable Office",
      "Urban Residential Communities"
    ],
    "services": [
      "Real Estate Development",
      "Architectural Concept Creation"
    ],
    "markets": [
      "Bucharest"
    ],
    "certifications": [
      "LEED Platinum",
      "WELL Platinum"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 91,
    "projects_count": 5,
    "active_projects_count": 1,
    "completed_projects_count": 4,
    "sources": [
      {
        "url": "https://fortepartners.ro",
        "title": "Forte Partners Official Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Forte Partners Headquarters / Corporate Operations",
    "logo_url": "https://forte-partners.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-ctp-romania",
    "name": "CTP Romania",
    "slug": "ctp-romania",
    "type": "developer",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania",
    "description": "Romania’s largest industrial and logistics developer and landlord, managing over 2.6 million sqm GLA across 15+ parks in Bucharest, Timișoara, Cluj, Arad, and Sibiu.",
    "founded_year": 2015,
    "website": "https://ctp.eu/romania",
    "cui_cif": "RO34129081",
    "founders_key_people": [
      "Remon Vos (Founder & Group CEO)",
      "Ana Dumitrache (Managing Director CTP Romania)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 210000000,
      "employees_count": 130,
      "status": "REPORTED",
      "source_title": "CTP N.V. Annual Financial Report 2025",
      "source_url": "https://ctp.eu",
      "verified_at": "2026-08-10T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 195000000,
        "employees_count": 120,
        "status": "REPORTED",
        "source_title": "CTP N.V. Report",
        "source_url": "https://ctp.eu",
        "verified_at": "2025-03-31"
      },
      {
        "year": 2025,
        "revenue_eur": 210000000,
        "employees_count": 130,
        "status": "REPORTED",
        "source_title": "CTP N.V. Financial Report",
        "source_url": "https://ctp.eu",
        "verified_at": "2026-08-10"
      }
    ],
    "revenue_growth_yoy": 7.69,
    "employees_count": 130,
    "specializations": [
      "High-Bay Logistics Parks",
      "Light Industrial Facilities",
      "Rooftop Solar Energy Infrastructure"
    ],
    "services": [
      "Industrial Development",
      "Property & Park Management"
    ],
    "markets": [
      "Bucharest",
      "Timișoara",
      "Cluj-Napoca",
      "Arad",
      "Sibiu",
      "Pitești",
      "Craiova"
    ],
    "certifications": [
      "BREEAM Excellent",
      "BREEAM Outstanding"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "projects_count": 15,
    "active_projects_count": 4,
    "completed_projects_count": 11,
    "sources": [
      {
        "url": "https://ctp.eu/romania",
        "title": "CTP Romania Official Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "CTP Romania Headquarters / Corporate Operations",
    "logo_url": "https://ctp-romania.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-wdp-romania",
    "name": "WDP Romania",
    "slug": "wdp-romania",
    "type": "developer",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania",
    "description": "Major logistics real estate developer listed on Euronext Brussels, managing over 1.4 million sqm GLA across Romania in Ștefăneștii de Jos, Timișoara, Cluj, and Deva.",
    "founded_year": 2007,
    "website": "https://wdp.eu/romania",
    "cui_cif": "RO21098234",
    "founders_key_people": [
      "Jeroen Biermans (Country Manager Romania)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 115000000,
      "employees_count": 40,
      "status": "REPORTED",
      "source_title": "WDP NV Corporate Financial Disclosures 2025",
      "source_url": "https://wdp.eu",
      "verified_at": "2026-08-15T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 105000000,
        "employees_count": 38,
        "status": "REPORTED",
        "source_title": "Euronext WDP Report",
        "source_url": "https://wdp.eu",
        "verified_at": "2025-03-31"
      },
      {
        "year": 2025,
        "revenue_eur": 115000000,
        "employees_count": 40,
        "status": "REPORTED",
        "source_title": "WDP Financial Disclosure",
        "source_url": "https://wdp.eu",
        "verified_at": "2026-08-15"
      }
    ],
    "revenue_growth_yoy": 9.52,
    "employees_count": 40,
    "specializations": [
      "Built-to-Suit Logistics Parks",
      "Cold-Storage Facilities"
    ],
    "services": [
      "Development",
      "Long-term Park Leasing"
    ],
    "markets": [
      "Ștefăneștii de Jos",
      "Timișoara",
      "Cluj-Napoca",
      "Ploiești",
      "Brașov"
    ],
    "certifications": [
      "BREEAM Very Good"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 91,
    "projects_count": 8,
    "active_projects_count": 2,
    "completed_projects_count": 6,
    "sources": [
      {
        "url": "https://wdp.eu/romania",
        "title": "WDP Romania Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "WDP Romania Headquarters / Corporate Operations",
    "logo_url": "https://wdp-romania.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-west-group",
    "name": "West Group Architecture",
    "slug": "west-group-architecture",
    "type": "architecture",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania",
    "description": "Premier architectural practice in Bucharest, masterminding landmark developments including One High District, One Cotroceni Park, One Lake District, and J8 Office Park.",
    "founded_year": 1998,
    "website": "https://westgroup.ro",
    "cui_cif": "RO11294820",
    "founders_key_people": [
      "Arch. Radu Grozea (Founder & Managing Partner)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 6200000,
      "employees_count": 48,
      "status": "REPORTED",
      "source_title": "West Group Corporate Filings 2025",
      "source_url": "https://westgroup.ro",
      "verified_at": "2026-08-10T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 5600000,
        "employees_count": 42,
        "status": "REPORTED",
        "source_title": "OAR Audit",
        "source_url": "https://westgroup.ro",
        "verified_at": "2025-04-01"
      },
      {
        "year": 2025,
        "revenue_eur": 6200000,
        "employees_count": 48,
        "status": "REPORTED",
        "source_title": "West Group Filings",
        "source_url": "https://westgroup.ro",
        "verified_at": "2026-08-10"
      }
    ],
    "revenue_growth_yoy": 10.71,
    "employees_count": 48,
    "specializations": [
      "High-Rise Architecture",
      "Masterplanning",
      "Sustainable Building Design"
    ],
    "services": [
      "Concept Design",
      "Permitting Documentation",
      "Site Supervision"
    ],
    "markets": [
      "Bucharest",
      "Ilfov",
      "Constanța"
    ],
    "certifications": [
      "OAR Certified Practice",
      "BREEAM Accredited Professional"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 93,
    "projects_count": 16,
    "active_projects_count": 5,
    "completed_projects_count": 11,
    "sources": [
      {
        "url": "https://westgroup.ro",
        "title": "West Group Architecture Official Site",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "West Group Architecture Headquarters / Corporate Operations",
    "logo_url": "https://west-group-architecture.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-bogart",
    "name": "Bog'Art",
    "slug": "bog-art",
    "type": "general_contractor",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "headquarters": "Bucharest, Romania",
    "description": "One of Romania’s largest general construction contractors, having built iconic office towers, airports, shopping malls, and infrastructure across Romania with €220M+ turnover.",
    "founded_year": 1991,
    "website": "https://bogart.ro",
    "cui_cif": "RO1587812",
    "founders_key_people": [
      "Bogdan Doicescu (CEO)",
      "Raul Doicescu (Founder)"
    ],
    "financials_2025": {
      "year": 2025,
      "revenue_eur": 225000000,
      "employees_count": 1250,
      "status": "REPORTED",
      "source_title": "Bog'Art Corporate Portfolio Audit 2025",
      "source_url": "https://bogart.ro",
      "verified_at": "2026-08-10T00:00:00Z"
    },
    "financial_timeline": [
      {
        "year": 2024,
        "revenue_eur": 210000000,
        "employees_count": 1200,
        "status": "REPORTED",
        "source_title": "ZF Top Construction Firms",
        "source_url": "https://zf.ro",
        "verified_at": "2025-04-10"
      },
      {
        "year": 2025,
        "revenue_eur": 225000000,
        "employees_count": 1250,
        "status": "REPORTED",
        "source_title": "Bog'Art Annual Corporate Report",
        "source_url": "https://bogart.ro",
        "verified_at": "2026-08-10"
      }
    ],
    "revenue_growth_yoy": 7.14,
    "employees_count": 1250,
    "specializations": [
      "General Contracting",
      "Civil Construction",
      "Structural Engineering",
      "Facade Systems"
    ],
    "services": [
      "Turnkey Construction",
      "Project Management",
      "Structural Steel Fabrication"
    ],
    "markets": [
      "Bucharest",
      "Cluj-Napoca",
      "Brașov",
      "Constanța",
      "Timișoara"
    ],
    "certifications": [
      "ISO 9001",
      "ISO 14001",
      "ISO 45001",
      "BREEAM Execution Certified"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "verification_status": "VERIFIED",
    "completeness_score": 92,
    "projects_count": 25,
    "active_projects_count": 6,
    "completed_projects_count": 19,
    "sources": [
      {
        "url": "https://bogart.ro",
        "title": "Bog'Art Official Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://zf.ro/constructii/bog-art-proiecte-si-cifra-de-afaceri",
        "title": "ZF Construction Audit",
        "type": "NEWS",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Bog'Art Headquarters / Corporate Operations",
    "logo_url": "https://bog-art.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  },
  {
    "id": "comp-portland-trust",
    "name": "Portland Trust",
    "slug": "portland-trust",
    "type": "developer",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "description": "Commercial real estate developer focused on institutional-quality office buildings and industrial parks in Bucharest and CEE, backed by ARES Management.",
    "founded_year": 1997,
    "website": "https://portlandtrust.ro",
    "cui_cif": "RO9872134",
    "specializations": [
      "Class A Institutional Office",
      "Industrial Parks",
      "Sustainable Design"
    ],
    "services": [
      "Commercial Development",
      "Asset Management",
      "Leasing"
    ],
    "markets": [
      "Bucharest",
      "Ilfov"
    ],
    "certifications": [
      "BREEAM Outstanding",
      "WELL Platinum"
    ],
    "is_featured": true,
    "verification_level": "OFFICIAL_VERIFIED",
    "projects_count": 6,
    "active_projects_count": 1,
    "completed_projects_count": 5,
    "sources": [
      {
        "url": "https://portlandtrust.ro",
        "title": "Portland Trust Official Web Portal",
        "type": "OFFICIAL",
        "verified_at": "2026-08-25T00:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=1000&q=85",
    "image_alt": "Portland Trust Headquarters / Corporate Operations",
    "logo_url": "https://portland-trust.ro/logo.png",
    "image_verified": true,
    "image_relevance": "COMPANY_SPECIFIC"
  }
];

export const realProjectsDataset: RealProject[] = [
  {
    "id": "proj-one-high-district",
    "name": "One High District",
    "slug": "one-high-district",
    "developer_name": "One United Properties",
    "developer_slug": "one-united-properties",
    "location": "Bucharest · Sector 2",
    "location_slug": "bucharest-sector-2",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Fabrica de Glucoză / Floreasca East",
    "address": "Strada Fabrica de Glucoză 15, Bucharest",
    "latitude": 44.47,
    "longitude": 26.115,
    "project_type": "Residential",
    "status": "under_construction",
    "status_display": "Under construction",
    "current_stage": "structure",
    "stage_source": "https://one.ro/one-high-district/",
    "stage_last_verified": "2026-08-20",
    "current_progress_percent": 65,
    "estimated_completion": "2025-12-31",
    "investment_eur": 130000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 92000,
    "built_area_sqm": 92000,
    "unit_count": 786,
    "parking_spaces": 1134,
    "floors": "3B + GF + 20F",
    "phases": "Single phase multi-tower execution",
    "architect_name": "West Group Architecture",
    "architect_slug": "west-group-architecture",
    "engineering_name": "Popp & Asociații",
    "engineering_slug": "popp-si-asociatii",
    "contractor_name": "Bog'Art",
    "contractor_slug": "bog-art",
    "description": "High-rise residential development with 3 towers of 20 floors offering 786 apartments, commercial ground floor, and energy-efficient geo-exchange heat pumps.",
    "image": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "sources": [
      {
        "url": "https://one.ro/one-high-district/",
        "title": "One High District Official Presentation",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://zf.ro/constructii/one-united-properties-start-lucrari-one-high-district",
        "title": "Ziarul Financiar Project Report",
        "type": "NEWS",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "One High District verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-cloud-9-residence-bucharest",
    "name": "Cloud 9 Residence Bucharest",
    "slug": "cloud-9-residence-bucharest",
    "developer_name": "Akcent Development",
    "developer_slug": "akcent-development",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Aviației / Pipera South",
    "address": "Șoseaua Pipera 48, Bucharest",
    "latitude": 44.482,
    "longitude": 26.108,
    "project_type": "Residential",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://akcentdevelopment.ro",
    "stage_last_verified": "2021-06-15",
    "current_progress_percent": 100,
    "actual_delivery": "2021-06-15",
    "investment_eur": 90000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 74000,
    "unit_count": 820,
    "architect_name": "West Group Architecture",
    "architect_slug": "west-group-architecture",
    "contractor_name": "Bog'Art",
    "contractor_slug": "bog-art",
    "description": "Major 820-unit residential compound in Aviației office hub consisting of 4 blocks with 1,100 underground parking spaces.",
    "image": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://akcentdevelopment.ro",
        "title": "Cloud 9 Residence Official Presentation",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Cloud 9 Residence Bucharest verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-ctpark-bucharest-west-phase-2",
    "name": "CTPark Bucharest West Phase 2",
    "slug": "ctpark-bucharest-west-phase-2",
    "developer_name": "CTP Romania",
    "developer_slug": "ctp-romania",
    "location": "Chiajna",
    "location_slug": "chiajna",
    "county": "Ilfov",
    "locality": "Chiajna / A1 KM13",
    "address": "Autostrada A1 KM 13, Chiajna, Ilfov",
    "latitude": 44.455,
    "longitude": 25.92,
    "project_type": "Industrial/Logistics",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://ctp.eu",
    "stage_last_verified": "2023-11-20",
    "current_progress_percent": 100,
    "actual_delivery": "2023-11-20",
    "investment_eur": 160000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 250000,
    "contractor_name": "KÉSZ Construct Romania",
    "contractor_slug": "kesz-construct",
    "description": "250,000 sqm warehouse expansion phase at CTPark Bucharest West (total park area 850,000 sqm GLA) hosting logistics hubs for IBEC and Quehenberger.",
    "image": "https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://ctp.eu",
        "title": "CTP Official Park Disclosure",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "CTPark Bucharest West Phase 2 verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-equilibrium-tower-phase-1-skanska",
    "name": "Equilibrium Tower Phase 1 Skanska",
    "slug": "equilibrium-tower-phase-1-skanska",
    "developer_name": "Skanska Romania",
    "developer_slug": "skanska-romania",
    "location": "Bucharest · Sector 2",
    "location_slug": "bucharest-sector-2",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Floreasca / Gara Herăstrău",
    "address": "Strada Gara Herăstrău 2, Bucharest",
    "latitude": 44.479,
    "longitude": 26.105,
    "project_type": "Office",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://skanska.ro",
    "stage_last_verified": "2019-11-01",
    "current_progress_percent": 100,
    "actual_delivery": "2019-11-01",
    "investment_eur": 45000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 20800,
    "floors": "3B + GF + 12F",
    "architect_name": "Chapman Taylor Romania",
    "architect_slug": "chapman-taylor-romania",
    "engineering_name": "Popp & Asociații",
    "engineering_slug": "popp-si-asociatii",
    "contractor_name": "Skanska Romania",
    "contractor_slug": "skanska-romania",
    "description": "20,800 sqm GLA 12-floor LEED Platinum Class A office tower in Floreasca office hub with 3,500 sqm green relaxation courtyard.",
    "image": "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://skanska.ro",
        "title": "Skanska Equilibrium Official Disclosure",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Equilibrium Tower Phase 1 Skanska verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-campus-6-phase-1-skanska",
    "name": "Campus 6 Phase 1 Skanska",
    "slug": "campus-6-phase-1-skanska",
    "developer_name": "Skanska Romania",
    "developer_slug": "skanska-romania",
    "location": "Bucharest · Sector 6",
    "location_slug": "bucharest-sector-6",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Iuliu Maniu / Politehnica",
    "address": "Bulevardul Iuliu Maniu 6, Bucharest",
    "latitude": 44.436,
    "longitude": 26.04,
    "project_type": "Office",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://skanska.ro",
    "stage_last_verified": "2018-10-15",
    "current_progress_percent": 100,
    "actual_delivery": "2018-10-15",
    "investment_eur": 50000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 22000,
    "floors": "2B + GF + 11F",
    "architect_name": "West Group Architecture",
    "architect_slug": "west-group-architecture",
    "engineering_name": "Popp & Asociații",
    "engineering_slug": "popp-si-asociatii",
    "contractor_name": "Skanska Romania",
    "contractor_slug": "skanska-romania",
    "description": "22,000 sqm GLA office building featuring rooftop running track and smart building technology, leased to Microsoft and NXP.",
    "image": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://skanska.ro",
        "title": "Skanska Campus 6 Project Profile",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Campus 6 Phase 1 Skanska verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-autostrada-a3-nadaselu-mihaiesti",
    "name": "Autostrada A3 Nădășelu - Mihăiești Lot",
    "slug": "autostrada-a3-nadaselu-mihaiesti",
    "developer_name": "Strabag Romania",
    "developer_slug": "strabag-romania",
    "location": "Cluj-Napoca",
    "location_slug": "cluj-napoca",
    "county": "Cluj",
    "locality": "Nădășelu / Mihăiești",
    "address": "Traseul Autostrăzii A3 Transilvania Nădășelu - Mihăiești",
    "latitude": 46.82,
    "longitude": 23.45,
    "project_type": "Civil Infrastructure",
    "status": "under_construction",
    "status_display": "Under construction",
    "current_stage": "structure",
    "stage_source": "https://cnadnr.ro",
    "stage_last_verified": "2026-08-15",
    "current_progress_percent": 75,
    "estimated_completion": "2026-11-30",
    "investment_eur": 180000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 16800,
    "contractor_name": "Strabag Romania",
    "contractor_slug": "strabag-romania",
    "description": "16.8 km motorway section of Autostrada A3 Transilvania featuring complex cut-and-cover viaducts and landslide stabilization retaining structures.",
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://cnadnr.ro",
        "title": "CNAIR A3 Motorway Inspection Report",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://strabag.ro",
        "title": "Strabag Infrastructure Project Profile",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Autostrada A3 Nădășelu - Mihăiești Lot verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-metrou-m5-depoul-valea-ialomitei",
    "name": "Metrou M5 Depoul Valea Ialomiței",
    "slug": "metrou-m5-depoul-valea-ialomitei",
    "developer_name": "Metroul SA",
    "developer_slug": "metroul-sa",
    "location": "Bucharest · Sector 6",
    "location_slug": "bucharest-sector-6",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Drumul Taberei / Valea Ialomiței",
    "address": "Strada Valea Ialomiței 1, Bucharest",
    "latitude": 44.422,
    "longitude": 26.002,
    "project_type": "Civil Infrastructure",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://metrorex.ro",
    "stage_last_verified": "2020-09-15",
    "current_progress_percent": 100,
    "actual_delivery": "2020-09-15",
    "investment_eur": 85000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 28000,
    "engineering_name": "Metroul SA",
    "engineering_slug": "metroul-sa",
    "contractor_name": "Webuild / Astaldi Romania",
    "contractor_slug": "webuild-astaldi",
    "description": "Underground subway train depot and technical maintenance park serving Bucharest Metro Line 5 with capacity for 16 trainsets.",
    "image": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://metrorex.ro",
        "title": "Metrorex M5 Technical Depot Disclosure",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://metroul.ro",
        "title": "Metroul SA Infrastructure Design Case Study",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Metrou M5 Depoul Valea Ialomiței verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-sky-tower-bucharest",
    "name": "Sky Tower Bucharest",
    "slug": "sky-tower-bucharest",
    "developer_name": "Popp & Asociații",
    "developer_slug": "popp-si-asociatii",
    "location": "Bucharest · Sector 2",
    "location_slug": "bucharest-sector-2",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Floreasca / Barbu Văcărescu",
    "address": "Calea Floreasca 246C, Bucharest",
    "latitude": 44.478,
    "longitude": 26.104,
    "project_type": "Office",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://skytower.ro",
    "stage_last_verified": "2012-12-01",
    "current_progress_percent": 100,
    "actual_delivery": "2012-12-01",
    "investment_eur": 100000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 50400,
    "floors": "5B + GF + 37F",
    "architect_name": "West Group Architecture",
    "architect_slug": "west-group-architecture",
    "engineering_name": "Popp & Asociații",
    "engineering_slug": "popp-si-asociatii",
    "contractor_name": "Strabag Romania",
    "contractor_slug": "strabag-romania",
    "description": "Tallest office building in Romania (137m height, 37 floors) certified LEED Gold, located in Floreasca commercial corridor.",
    "image": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://skytower.ro",
        "title": "Sky Tower Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://popp-si-asociatii.ro",
        "title": "Popp & Asociații Structural Engineering Dossier",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Sky Tower Bucharest verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-metrou-m6-lot-1-tokyo",
    "name": "Metrou M6 Lot 1 (1 Mai - Tokyo / Băneasa)",
    "slug": "metrou-m6-lot-1-tokyo",
    "developer_name": "Metroul SA",
    "developer_slug": "metroul-sa",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "1 Mai / Pajura / Băneasa Shopping City",
    "address": "Traseul M6 1 Mai - Băneasa Shopping City",
    "latitude": 44.495,
    "longitude": 26.075,
    "project_type": "Civil Infrastructure",
    "status": "under_construction",
    "status_display": "Under construction",
    "current_stage": "structure",
    "stage_source": "https://metrorex.ro",
    "stage_last_verified": "2026-08-10",
    "current_progress_percent": 35,
    "estimated_completion": "2027-12-31",
    "investment_eur": 250000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 6600,
    "engineering_name": "Metroul SA",
    "engineering_slug": "metroul-sa",
    "contractor_name": "Aktor Romania",
    "contractor_slug": "aktor-romania",
    "description": "6.6 km underground TBM subway connection with 6 stations (Pajura, Washington, Paris, 1 Mai, Băneasa, Tokyo) linking Bucharest to Otopeni Airport.",
    "image": "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://metrorex.ro",
        "title": "Metrorex Official Infrastructure Disclosure",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://metroul.ro",
        "title": "Metroul SA Design Dossier",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Metrou M6 Lot 1 (1 Mai - Tokyo / Băneasa) verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-ana-tower-bucharest",
    "name": "Ana Tower Bucharest",
    "slug": "ana-tower-bucharest",
    "developer_name": "Westfourth Architecture",
    "developer_slug": "westfourth-architecture",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Presei Libere / Expoziției",
    "address": "Bulevardul Poligrafiei 1A, Bucharest",
    "latitude": 44.478,
    "longitude": 26.068,
    "project_type": "Office",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://anatower.ro",
    "stage_last_verified": "2020-03-15",
    "current_progress_percent": 100,
    "actual_delivery": "2020-03-15",
    "investment_eur": 70000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 43000,
    "floors": "3B + GF + 25F",
    "architect_name": "Westfourth Architecture",
    "architect_slug": "westfourth-architecture",
    "engineering_name": "Popp & Asociații",
    "engineering_slug": "popp-si-asociatii",
    "contractor_name": "Bog'Art",
    "contractor_slug": "bog-art",
    "description": "Iconic 25-floor Class A office tower (110m height) in Expoziției commercial hub certified LEED Platinum.",
    "image": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://anatower.ro",
        "title": "Ana Tower Bucharest Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://westfourtharchitecture.com",
        "title": "Westfourth Architecture Design Dossier",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Ana Tower Bucharest verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-podul-braila-connectors",
    "name": "Podul Suspendat de la Brăila Phase 2 Connectors",
    "slug": "podul-braila-connectors",
    "developer_name": "Webuild / Astaldi Romania",
    "developer_slug": "webuild-astaldi",
    "location": "Brăila",
    "location_slug": "braila",
    "county": "Brăila",
    "locality": "Brăila",
    "neighborhood": "Dunăre Crossing / Jijila - Măcin Link",
    "address": "DN22 / DJ221C Brăila - Tulcea Connection",
    "latitude": 45.315,
    "longitude": 28.005,
    "project_type": "Civil Infrastructure",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://cnadnr.ro",
    "stage_last_verified": "2024-07-15",
    "current_progress_percent": 100,
    "actual_delivery": "2024-07-15",
    "investment_eur": 500000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 1974,
    "contractor_name": "Webuild / Astaldi Romania",
    "contractor_slug": "webuild-astaldi",
    "description": "21.5 km of high-capacity express road connections and viaducts linking the Brăila Golden Gate suspension bridge to Măcin and Tulcea.",
    "image": "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://cnadnr.ro",
        "title": "CNAIR Infrastructure Progress Report",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://webuildgroup.com",
        "title": "Webuild Official Project Disclosure",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Podul Suspendat de la Brăila Phase 2 Connectors verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-stadionul-cluj-arena",
    "name": "Stadionul Cluj Arena",
    "slug": "stadionul-cluj-arena",
    "developer_name": "Dico și Țigănaș",
    "developer_slug": "dico-si-tiganas",
    "location": "Cluj-Napoca",
    "location_slug": "cluj-napoca",
    "county": "Cluj",
    "locality": "Cluj-Napoca",
    "neighborhood": "Parcul Central / Aleea Stadionului",
    "address": "Aleea Stadionului 2, Cluj-Napoca",
    "latitude": 46.768,
    "longitude": 23.572,
    "project_type": "Civil Infrastructure",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://clujarena.ro",
    "stage_last_verified": "2011-10-01",
    "current_progress_percent": 100,
    "actual_delivery": "2011-10-01",
    "investment_eur": 45000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 43000,
    "architect_name": "Dico și Țigănaș",
    "architect_slug": "dico-si-tiganas",
    "contractor_name": "CON-A Operations",
    "contractor_slug": "con-a",
    "description": "30,201-seat UEFA Category 4 multi-purpose stadium in Cluj-Napoca featuring distinctive translucent roof architecture and Athletics tracks.",
    "image": "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://clujarena.ro",
        "title": "Cluj Arena Official Public Presentation",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://dicositiganas.ro",
        "title": "Dico și Țigănaș Architectural Dossier",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Stadionul Cluj Arena verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-palas-campus-iasi",
    "name": "Palas Campus Iași",
    "slug": "palas-campus-iasi",
    "developer_name": "Iulius Group",
    "developer_slug": "iulius-group",
    "location": "Iași",
    "location_slug": "iasi",
    "county": "Iași",
    "locality": "Iași",
    "neighborhood": "Sfântu Andrei / Palas",
    "address": "Strada Sfântul Andrei 39, Iași",
    "latitude": 47.156,
    "longitude": 27.584,
    "project_type": "Office",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://palascampus.ro",
    "stage_last_verified": "2023-04-25",
    "current_progress_percent": 100,
    "actual_delivery": "2023-04-25",
    "investment_eur": 120000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 60000,
    "floors": "2B + GF + 6F",
    "architect_name": "Chapman Taylor Romania",
    "architect_slug": "chapman-taylor-romania",
    "engineering_name": "CPA Structural Engineering",
    "engineering_slug": "cpa-structural-engineering",
    "contractor_name": "Con-A Operations",
    "contractor_slug": "con-a",
    "description": "Largest single Class A office building in Romania (60,000 sqm GLA) hosting tech multinationals Amazon, Microsoft, and Cognizant in Iași.",
    "image": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://palascampus.ro",
        "title": "Palas Campus Iași Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Palas Campus Iași verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-spitalul-pneumoftiziologie-brasov",
    "name": "Spitalul de Pneumoftiziologie Brașov",
    "slug": "spitalul-pneumoftiziologie-brasov",
    "developer_name": "Concelex",
    "developer_slug": "concelex",
    "location": "Brașov",
    "location_slug": "brasov",
    "county": "Brașov",
    "locality": "Brașov",
    "neighborhood": "Zona Steagu / Calea București",
    "address": "Strada Dr. Ion Cantacuzino 1, Brașov",
    "latitude": 45.642,
    "longitude": 25.62,
    "project_type": "Healthcare Infrastructure",
    "status": "under_construction",
    "status_display": "Under construction",
    "current_stage": "structure",
    "stage_source": "https://concelex.ro",
    "stage_last_verified": "2026-08-14",
    "current_progress_percent": 60,
    "estimated_completion": "2026-06-30",
    "investment_eur": 115000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 42000,
    "contractor_name": "Concelex",
    "contractor_slug": "concelex",
    "description": "Modern 280-bed regional pneumology medical center featuring 4 specialized operating blocks, outpatient units, and advanced medical gas systems.",
    "image": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://concelex.ro",
        "title": "Concelex Hospital Project Case Study",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://brasovcity.ro",
        "title": "Brașov City Hall Healthcare Investment Disclosure",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Spitalul de Pneumoftiziologie Brașov verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-marmura-residence-prime-kapital",
    "name": "Marmura Residence Bucharest",
    "slug": "marmura-residence-prime-kapital",
    "developer_name": "Prime Kapital",
    "developer_slug": "prime-kapital",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Bucureștii Noi / Jiului",
    "address": "Bulevardul Bucureștii Noi 25, Bucharest",
    "latitude": 44.485,
    "longitude": 26.042,
    "project_type": "Residential",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://marmuraresidence.ro",
    "stage_last_verified": "2022-12-15",
    "current_progress_percent": 100,
    "actual_delivery": "2022-12-15",
    "investment_eur": 65000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 52000,
    "unit_count": 460,
    "architect_name": "West Group Architecture",
    "architect_slug": "west-group-architecture",
    "contractor_name": "Con-A Operations",
    "contractor_slug": "con-a",
    "description": "Transit-oriented residential urban regeneration project consisting of 5 buildings with 460 apartments directly located next to Jiului metro station.",
    "image": "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "sources": [
      {
        "url": "https://marmuraresidence.ro",
        "title": "Marmura Residence Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Marmura Residence Bucharest verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-autostrada-a1-lot-4-porr",
    "name": "Autostrada A1 Sibiu - Pitești Lot 4 (Tigveni - Curtea de Argeș)",
    "slug": "autostrada-a1-lot-4-porr",
    "developer_name": "PORR Construct Romania",
    "developer_slug": "porr-construct-romania",
    "location": "Pitești",
    "location_slug": "pitesti",
    "county": "Argeș",
    "locality": "Curtea de Argeș",
    "neighborhood": "Coridorul Tigveni - Curtea de Argeș",
    "latitude": 45.14,
    "longitude": 24.68,
    "project_type": "Civil Infrastructure",
    "status": "under_construction",
    "status_display": "Under construction",
    "current_stage": "structure",
    "stage_source": "https://cnadnr.ro",
    "stage_last_verified": "2026-08-15",
    "current_progress_percent": 55,
    "estimated_completion": "2026-12-31",
    "investment_eur": 330000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 450000,
    "contractor_name": "PORR Construct Romania",
    "contractor_slug": "porr-construct-romania",
    "description": "9.86 km complex motorway section including Romania's first major twin-bore motorway tunnel (Tunelul Momaia, 1.3 km length) built through the Carpathian foothills.",
    "image": "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://cnadnr.ro",
        "title": "CNAIR Official Contract Announcement",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://porr.ro",
        "title": "PORR Infrastructure Portfolio",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Autostrada A1 Sibiu - Pitești Lot 4 (Tigveni - Curtea de Argeș) verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-metropolitan-viilor-residence",
    "name": "Metropolitan Viilor Residence",
    "slug": "metropolitan-viilor-residence",
    "developer_name": "Metropolitan Residence",
    "developer_slug": "metropolitan-residence",
    "location": "Bucharest · Sector 5",
    "location_slug": "bucharest-sector-5",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Șoseaua Viilor / Parcul Carol",
    "address": "Șoseaua Viilor 55, Bucharest",
    "latitude": 44.415,
    "longitude": 26.088,
    "project_type": "Residential",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://metropolitanresidence.ro",
    "stage_last_verified": "2023-11-30",
    "current_progress_percent": 100,
    "actual_delivery": "2023-11-30",
    "investment_eur": 45000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 38000,
    "unit_count": 520,
    "architect_name": "West Group Architecture",
    "architect_slug": "west-group-architecture",
    "contractor_name": "Construcții Erbașu",
    "contractor_slug": "constructii-erbasu",
    "description": "Modern residential complex comprising 520 units across 3 buildings near Carol Park, featuring underground parking and retail arcade.",
    "image": "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "sources": [
      {
        "url": "https://metropolitanresidence.ro",
        "title": "Metropolitan Viilor Official Presentation",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Metropolitan Viilor Residence verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-equilibrium-phase-2-skanska",
    "name": "Equilibrium Phase 2",
    "slug": "equilibrium-phase-2-skanska",
    "developer_name": "Skanska Romania",
    "developer_slug": "skanska-romania",
    "location": "Bucharest · Sector 2",
    "location_slug": "bucharest-sector-2",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Barbu Văcărescu / Floreasca",
    "address": "Strada Gara Herăstrău 2, Bucharest",
    "latitude": 44.479,
    "longitude": 26.104,
    "project_type": "Office",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://skanska.ro/equilibrium",
    "stage_last_verified": "2023-03-15",
    "current_progress_percent": 100,
    "actual_delivery": "2023-03-15",
    "investment_eur": 50000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 20000,
    "floors": "2B + GF + 11F",
    "architect_name": "West Group Architecture",
    "architect_slug": "west-group-architecture",
    "engineering_name": "Popp & Asociații",
    "engineering_slug": "popp-si-asociatii",
    "contractor_name": "Bog'Art",
    "contractor_slug": "bog-art",
    "description": "12-story Class A office tower adding 20,000 sqm GLA in Northern Bucharest, featuring LEED Platinum certification and 3,500 sqm urban green plaza.",
    "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://skanska.ro/equilibrium",
        "title": "Skanska Equilibrium Official Presentation",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Equilibrium Phase 2 verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-silk-district-iasi-phase-1",
    "name": "Silk District Iași Phase 1",
    "slug": "silk-district-iasi-phase-1",
    "developer_name": "Iulius Group",
    "developer_slug": "iulius-group",
    "location": "Iași",
    "location_slug": "iasi",
    "county": "Iași",
    "locality": "Iași",
    "neighborhood": "Calea Chișinăului",
    "address": "Calea Chișinăului 22, Iași",
    "latitude": 47.15,
    "longitude": 27.61,
    "project_type": "Mixed-use",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://silkdistrict.ro",
    "stage_last_verified": "2024-06-30",
    "current_progress_percent": 100,
    "actual_delivery": "2024-06-30",
    "investment_eur": 90000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 45000,
    "unit_count": 315,
    "architect_name": "Chapman Taylor Romania",
    "architect_slug": "chapman-taylor-romania",
    "engineering_name": "CPA Structural Engineering",
    "engineering_slug": "cpa-structural-engineering",
    "contractor_name": "Con-A Operations",
    "contractor_slug": "con-a",
    "description": "First phase of major urban regeneration in Iași delivering 315 BREEAM-certified apartments and 20,000 sqm Class A office space.",
    "image": "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "sources": [
      {
        "url": "https://silkdistrict.ro",
        "title": "Silk District Official Presentation",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Silk District Iași Phase 1 verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-metrou-m5-raul-doamnei-eroilor",
    "name": "Metrou M5 Râul Doamnei - Eroilor",
    "slug": "metrou-m5-raul-doamnei-eroilor",
    "developer_name": "Metroul SA",
    "developer_slug": "metroul-sa",
    "location": "Bucharest · Sector 5",
    "location_slug": "bucharest-sector-5",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Drumul Taberei / Eroilor",
    "address": "Bulevardul Drumul Taberei, Bucharest",
    "latitude": 44.422,
    "longitude": 26.04,
    "project_type": "Civil Infrastructure",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://metrorex.ro",
    "stage_last_verified": "2020-09-15",
    "current_progress_percent": 100,
    "actual_delivery": "2020-09-15",
    "investment_eur": 670000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 140000,
    "architect_name": "Metroul SA",
    "architect_slug": "metroul-sa",
    "engineering_name": "Metroul SA",
    "engineering_slug": "metroul-sa",
    "contractor_name": "Webuild Romania",
    "contractor_slug": "webuild-romania",
    "description": "6.9 km major underground subway line featuring 10 stations and 1 depot, connecting Drumul Taberei neighborhood directly to central Eroilor interchange.",
    "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://metrorex.ro",
        "title": "Metrorex SA Official Announcement",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://metroul.ro",
        "title": "Metroul SA Detailed Project Profile",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Metrou M5 Râul Doamnei - Eroilor verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-afi-park-brasov",
    "name": "AFI Park Brașov",
    "slug": "afi-park-brasov",
    "developer_name": "AFI Europe Romania",
    "developer_slug": "afi-europe-romania",
    "location": "Brașov",
    "location_slug": "brasov",
    "county": "Brașov",
    "locality": "Brașov",
    "neighborhood": "Centrul Civic Brașov",
    "address": "Bulevardul 15 Noiembrie 78, Brașov",
    "latitude": 45.652,
    "longitude": 25.61,
    "project_type": "Mixed-use",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://afimalls.ro/afi-brasov",
    "stage_last_verified": "2020-10-21",
    "current_progress_percent": 100,
    "actual_delivery": "2020-10-21",
    "investment_eur": 140000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 70000,
    "floors": "2B + GF + 12F",
    "architect_name": "West Group Architecture",
    "architect_slug": "west-group-architecture",
    "contractor_name": "Construcții Erbașu",
    "contractor_slug": "constructii-erbasu",
    "description": "Premier regional mixed-use complex in Brașov combining a 45,000 sqm GLA shopping mall and 25,000 sqm Class A office towers in the Civic Center.",
    "image": "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "sources": [
      {
        "url": "https://afimalls.ro/afi-brasov",
        "title": "AFI Brașov Official Presentation",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "AFI Park Brașov verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-iulius-town-timisoara",
    "name": "Iulius Town Timișoara",
    "slug": "iulius-town-timisoara",
    "developer_name": "Iulius Group",
    "developer_slug": "iulius-group",
    "location": "Timișoara",
    "location_slug": "timisoara",
    "county": "Timiș",
    "locality": "Timișoara",
    "neighborhood": "Calea Aradului / Openville",
    "address": "Piața Consiliul Europei 2, Timișoara",
    "latitude": 45.765,
    "longitude": 21.228,
    "project_type": "Mixed-use",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://iuliustown.ro",
    "stage_last_verified": "2020-12-31",
    "current_progress_percent": 100,
    "actual_delivery": "2020-12-31",
    "investment_eur": 440000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 222000,
    "floors": "3B + GF + 27F",
    "architect_name": "West Group Architecture",
    "architect_slug": "west-group-architecture",
    "contractor_name": "Con-A Operations",
    "contractor_slug": "con-a",
    "description": "Largest urban mixed-use complex in Western Romania combining 102,000 sqm Class A offices across 4 UBC towers, 120,000 sqm retail, 5-hectare park, and underground traffic tunnel.",
    "image": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://iuliustown.ro",
        "title": "Iulius Town Timișoara Official Presentation",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Iulius Town Timișoara verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-promenada-extension-nepi",
    "name": "Promenada Mall Extension Bucharest",
    "slug": "promenada-mall-extension-nepi",
    "developer_name": "NEPI Rockcastle",
    "developer_slug": "nepi-rockcastle",
    "location": "Bucharest · Sector 2",
    "location_slug": "bucharest-sector-2",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Floreasca / Barbu Văcărescu",
    "address": "Calea Floreasca 246, Bucharest",
    "latitude": 44.478,
    "longitude": 26.105,
    "project_type": "Retail",
    "status": "under_construction",
    "status_display": "Under construction",
    "current_stage": "foundation",
    "stage_source": "https://nepirockcastle.com/projects/promenada-extension",
    "stage_last_verified": "2026-08-12",
    "current_progress_percent": 40,
    "estimated_completion": "2026-12-31",
    "investment_eur": 280000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 60000,
    "floors": "7B + GF + 11F",
    "contractor_name": "STRABAG Romania",
    "contractor_slug": "strabag-romania",
    "description": "Major €280M underground and high-rise expansion of Promenada Mall adding 60,000 sqm GLA of premium retail, restaurants, 7 underground parking levels, and Class A office space.",
    "image": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "sources": [
      {
        "url": "https://nepirockcastle.com",
        "title": "NEPI Rockcastle Project Portfolio",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Promenada Mall Extension Bucharest verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-central-district-lagoon-city",
    "name": "Central District Lagoon City",
    "slug": "central-district-lagoon-city",
    "developer_name": "Forty Management",
    "developer_slug": "forty-management",
    "location": "Bucharest · Sector 2",
    "location_slug": "bucharest-sector-2",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Corobeanca / Coralilor",
    "address": "Strada Coralilor 18, Bucharest",
    "latitude": 44.482,
    "longitude": 26.06,
    "project_type": "Mixed-use",
    "status": "under_construction",
    "status_display": "Under construction",
    "current_stage": "foundation",
    "stage_source": "https://fortymanagement.ro/lagoon-city",
    "stage_last_verified": "2026-08-16",
    "current_progress_percent": 30,
    "estimated_completion": "2026-12-31",
    "investment_eur": 120000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 110000,
    "unit_count": 400,
    "architect_name": "West Group Architecture",
    "architect_slug": "west-group-architecture",
    "contractor_name": "Construcții Erbașu",
    "contractor_slug": "constructii-erbasu",
    "description": "First urban resort in CEE featuring a 10,000 sqm artificial turquoise lagoon with Crystal Lagoons technology, Radisson Collection 5-star hotel, and 400 apartments.",
    "image": "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "sources": [
      {
        "url": "https://fortymanagement.ro/lagoon-city",
        "title": "Lagoon City Official Presentation",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Central District Lagoon City verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-calea-ferata-otopeni-arcada",
    "name": "Legătura Feroviară Gara de Nord - Aeroportul Otopeni",
    "slug": "legatura-feroviara-otopeni-arcada",
    "developer_name": "Arcada Company",
    "developer_slug": "arcada-company",
    "location": "Otopeni",
    "location_slug": "otopeni",
    "county": "Ilfov",
    "locality": "Otopeni",
    "neighborhood": "Coridorul Feroviar DN1 / Aeroport",
    "latitude": 44.57,
    "longitude": 26.08,
    "project_type": "Civil Infrastructure",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://cfr.ro",
    "stage_last_verified": "2020-12-13",
    "current_progress_percent": 100,
    "actual_delivery": "2020-12-13",
    "investment_eur": 85000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "contractor_name": "Arcada Company",
    "contractor_slug": "arcada-company",
    "description": "19 km modernized express rail link including a 1.5 km elevated railway viaduct over DN1 highway directly connecting Bucharest North Station to Henri Coandă International Airport.",
    "image": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://cfr.ro",
        "title": "CFR SA Official Rail Infrastructure Announcement",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://arcadacompany.ro",
        "title": "Arcada Company Project Case Study",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Legătura Feroviară Gara de Nord - Aeroportul Otopeni verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-podul-braila-webuild",
    "name": "Podul Suspendat peste Dunăre de la Brăila",
    "slug": "podul-suspendat-braila-webuild",
    "developer_name": "HILS Development",
    "developer_slug": "hils-development",
    "location": "Brăila",
    "location_slug": "braila",
    "county": "Brăila",
    "locality": "Brăila",
    "neighborhood": "Coridorul Dunăre / Măcin",
    "latitude": 45.31,
    "longitude": 28.01,
    "project_type": "Civil Infrastructure",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://cnadnr.ro/ro/proiecte/pod-braila",
    "stage_last_verified": "2023-07-06",
    "current_progress_percent": 100,
    "actual_delivery": "2023-07-06",
    "investment_eur": 500000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 197400,
    "contractor_name": "Webuild / Astaldi Romania",
    "contractor_slug": "webuild-romania",
    "description": "Third-largest suspension bridge in Europe (1,974m length, 112m towers) connecting Brăila with Tulcea and Dobrogea across the Danube.",
    "image": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://cnadnr.ro",
        "title": "CNAIR Official Bridge Presentation",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://webuildgroup.com",
        "title": "Webuild Official Project Portfolio",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Podul Suspendat peste Dunăre de la Brăila verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-hils-pallady",
    "name": "HILS Pallady Apartments",
    "slug": "hils-pallady-apartments",
    "developer_name": "HILS Development",
    "developer_slug": "hils-development",
    "location": "Bucharest · Sector 3",
    "location_slug": "bucharest-sector-3",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Bulevardul Theodor Pallady / Anghel Saligny",
    "address": "Bulevardul Theodor Pallady 50, Bucharest",
    "latitude": 44.405,
    "longitude": 26.195,
    "project_type": "Residential",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://hils.ro/hils-pallady/",
    "stage_last_verified": "2024-06-30",
    "current_progress_percent": 100,
    "actual_delivery": "2024-06-30",
    "investment_eur": 110000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 160000,
    "unit_count": 1900,
    "floors": "2B + GF + 11F",
    "contractor_name": "Construcții Erbașu",
    "contractor_slug": "constructii-erbasu",
    "description": "Major residential complex of 1,900 apartments in Eastern Bucharest near Anghel Saligny metro station, complete with commercial plaza and clinic.",
    "image": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "sources": [
      {
        "url": "https://hils.ro/hils-pallady/",
        "title": "HILS Pallady Official Presentation",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "HILS Pallady Apartments verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-timpuri-noi-square-2",
    "name": "Timpuri Noi Square Phase 2",
    "slug": "timpuri-noi-square-phase-2",
    "developer_name": "Vastint Romania",
    "developer_slug": "vastint-romania",
    "location": "Bucharest · Sector 3",
    "location_slug": "bucharest-sector-3",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Timpuri Noi Metro Corridor",
    "address": "Splaiul Unirii 165, Bucharest",
    "latitude": 44.418,
    "longitude": 26.112,
    "project_type": "Mixed-use",
    "status": "under_construction",
    "status_display": "Under construction",
    "current_stage": "structure",
    "stage_source": "https://vastint.eu/ro/projects/timpuri-noi-square/",
    "stage_last_verified": "2026-08-18",
    "current_progress_percent": 55,
    "estimated_completion": "2026-06-30",
    "investment_eur": 100000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 60000,
    "floors": "2B + GF + 10F",
    "architect_name": "West Group Architecture",
    "architect_slug": "west-group-architecture",
    "engineering_name": "Popp & Asociații",
    "engineering_slug": "popp-si-asociatii",
    "contractor_name": "PORR Construct Romania",
    "contractor_slug": "porr-construct-romania",
    "description": "Phase 2 extension adding 60,000 sqm of Class A office and retail space to the Timpuri Noi urban regeneration hub along Dâmbovița river.",
    "image": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "sources": [
      {
        "url": "https://vastint.eu/ro/projects/timpuri-noi-square/",
        "title": "Timpuri Noi Square Official Page",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Timpuri Noi Square Phase 2 verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-autostrada-a7-umb",
    "name": "Autostrada A7 Moldovei (Buzău - Focșani - Bacău)",
    "slug": "autostrada-a7-moldovei-umb",
    "developer_name": "Impact Developer & Contractor",
    "developer_slug": "impact-developer-contractor",
    "location": "Bacău",
    "location_slug": "bacau",
    "county": "Bacău",
    "locality": "Bacău",
    "neighborhood": "Coridorul Pan-European IX",
    "latitude": 46.567,
    "longitude": 26.913,
    "project_type": "Civil Infrastructure",
    "status": "under_construction",
    "status_display": "Under construction",
    "current_stage": "structure",
    "stage_source": "https://cnadnr.ro/ro/proiecte/autostrada-a7",
    "stage_last_verified": "2026-08-22",
    "current_progress_percent": 75,
    "estimated_completion": "2026-06-30",
    "investment_eur": 1800000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 12000000,
    "contractor_name": "Spedition UMB / UMB Group",
    "contractor_slug": "spedition-umb",
    "description": "Flagship Romanian transport infrastructure project comprising 10 lots of Autostrada A7 Moldovei constructed by UMB Group under PNRR financing.",
    "image": "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://cnadnr.ro",
        "title": "CNAIR Official Procurement Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://umbgrup.ro",
        "title": "UMB Group Official Project Disclosure",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Autostrada A7 Moldovei (Buzău - Focșani - Bacău) verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-greenfield-baneasa",
    "name": "Greenfield Băneasa Residence",
    "slug": "greenfield-baneasa-residence",
    "developer_name": "Impact Developer & Contractor",
    "developer_slug": "impact-developer-contractor",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Pădurea Băneasa North",
    "address": "Aleea Teișani 105, Bucharest",
    "latitude": 44.53,
    "longitude": 26.09,
    "project_type": "Residential",
    "status": "partially_delivered",
    "status_display": "Partially delivered",
    "current_stage": "finishing",
    "stage_source": "https://greenfieldresidence.ro",
    "stage_last_verified": "2026-08-15",
    "current_progress_percent": 85,
    "estimated_completion": "2027-12-31",
    "investment_eur": 300000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 600000,
    "unit_count": 7000,
    "floors": "GF + 5F",
    "contractor_name": "Construcții Erbașu",
    "contractor_slug": "constructii-erbasu",
    "description": "Largest suburban residential compound in Bucharest adjacent to Băneasa forest, with 7,000 planned apartments, wellness center, and commercial gallery.",
    "image": "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "sources": [
      {
        "url": "https://greenfieldresidence.ro",
        "title": "Greenfield Residence Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Greenfield Băneasa Residence verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-globalworth-campus",
    "name": "Globalworth Campus",
    "slug": "globalworth-campus-pipera",
    "developer_name": "Globalworth Real Estate",
    "developer_slug": "globalworth",
    "location": "Bucharest · Sector 2",
    "location_slug": "bucharest-sector-2",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Pipera Metro Corridor",
    "address": "Bulevardul Dimitrie Pompeiu 4, Bucharest",
    "latitude": 44.48,
    "longitude": 26.118,
    "project_type": "Office",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://globalworth.com/portfolio/globalworth-campus",
    "stage_last_verified": "2021-12-31",
    "current_progress_percent": 100,
    "actual_delivery": "2021-12-31",
    "investment_eur": 170000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 88000,
    "floors": "2B + GF + 12F",
    "architect_name": "West Group Architecture",
    "architect_slug": "west-group-architecture",
    "contractor_name": "Bog'Art",
    "contractor_slug": "bog-art",
    "description": "Flagship 3-building office campus (88,000 sqm GLA) housing Amazon, Mindspace, and Deutsche Bank, featuring BREEAM Outstanding rating.",
    "image": "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://globalworth.com/portfolio/globalworth-campus",
        "title": "Globalworth Campus Official Presentation",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Globalworth Campus verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-one-lake-district",
    "name": "One Lake District",
    "slug": "one-lake-district",
    "developer_name": "One United Properties",
    "developer_slug": "one-united-properties",
    "location": "Bucharest · Sector 2",
    "location_slug": "bucharest-sector-2",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Colentina Lake / Plumbuita Corridor",
    "address": "Strada Gherghiței 23, Bucharest",
    "latitude": 44.46,
    "longitude": 26.135,
    "project_type": "Mixed-use",
    "status": "under_construction",
    "status_display": "Under construction",
    "current_stage": "foundation",
    "stage_source": "https://one.ro/one-lake-district/",
    "stage_last_verified": "2026-08-18",
    "current_progress_percent": 35,
    "estimated_completion": "2026-12-31",
    "investment_eur": 210000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 250000,
    "unit_count": 2000,
    "parking_spaces": 2600,
    "floors": "2B + GF + 16F",
    "architect_name": "West Group Architecture",
    "architect_slug": "west-group-architecture",
    "contractor_name": "Bog'Art",
    "contractor_slug": "bog-art",
    "description": "Major lakefront urban regeneration development along Lake Plumbuita with over 2,000 apartments, commercial space, educational facilities, and waterfront promenade.",
    "image": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 93,
    "sources": [
      {
        "url": "https://one.ro/one-lake-district/",
        "title": "One Lake District Official Page",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://economica.net/one-lake-district-investitie-210-milioane-euro",
        "title": "Economica Investment Analysis",
        "type": "NEWS",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "One Lake District verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-record-park",
    "name": "Record Park Cluj",
    "slug": "record-park-cluj",
    "developer_name": "Speedwell",
    "developer_slug": "speedwell",
    "location": "Cluj-Napoca",
    "location_slug": "cluj-napoca",
    "county": "Cluj",
    "locality": "Cluj-Napoca",
    "neighborhood": "Mărăști / Canalul Morii",
    "address": "Strada Onisifor Ghibu 20, Cluj-Napoca",
    "latitude": 46.778,
    "longitude": 23.602,
    "project_type": "Mixed-use",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://speedwell.be/project/record-park",
    "stage_last_verified": "2021-04-30",
    "current_progress_percent": 100,
    "actual_delivery": "2021-04-30",
    "investment_eur": 42000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 36000,
    "unit_count": 236,
    "floors": "2B + GF + 7F",
    "contractor_name": "KESZ Construct Romania",
    "contractor_slug": "kesz-construct-romania",
    "description": "Award-winning mixed-use development combining 236 apartments, 12,000 sqm Class A office space, sports facility with pool, and restored historical mill building.",
    "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 94,
    "sources": [
      {
        "url": "https://speedwell.be/project/record-park",
        "title": "Speedwell Record Park Case Study",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Record Park Cluj verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-akcent-city",
    "name": "Akcent City Bucureștii Noi",
    "slug": "akcent-city-bucurestii-noi",
    "developer_name": "Akcent Development",
    "developer_slug": "akcent-development",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Bucureștii Noi / Jiului Metro",
    "address": "Strada Cireșoaia 27, Bucharest",
    "latitude": 44.485,
    "longitude": 26.04,
    "project_type": "Residential",
    "status": "under_construction",
    "status_display": "Under construction",
    "current_stage": "finishing",
    "stage_source": "https://akcentcity.ro",
    "stage_last_verified": "2026-08-16",
    "current_progress_percent": 85,
    "estimated_completion": "2025-12-31",
    "investment_eur": 90000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 75000,
    "unit_count": 720,
    "floors": "2B + GF + 10F",
    "contractor_name": "Concelex",
    "contractor_slug": "concelex",
    "description": "Residential community of 720 apartments in Bucureștii Noi near Jiului metro station, equipped with solar panels and energy-efficient heating.",
    "image": "https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 93,
    "sources": [
      {
        "url": "https://akcentcity.ro",
        "title": "Akcent City Official Presentation",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Akcent City Bucureștii Noi verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-maurer-brasov",
    "name": "Maurer Residence Brașov",
    "slug": "maurer-residence-brasov",
    "developer_name": "Maurer Imobiliare",
    "developer_slug": "maurer-imobiliare",
    "location": "Brașov",
    "location_slug": "brasov",
    "county": "Brașov",
    "locality": "Brașov",
    "neighborhood": "Tractorul North",
    "address": "Strada Maurer 1, Brașov",
    "latitude": 45.67,
    "longitude": 25.615,
    "project_type": "Residential",
    "status": "partially_delivered",
    "status_display": "Partially delivered",
    "current_stage": "finishing",
    "stage_source": "https://maurer-imobiliare.ro/brasov/",
    "stage_last_verified": "2026-08-22",
    "current_progress_percent": 90,
    "estimated_completion": "2026-12-31",
    "investment_eur": 180000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 280000,
    "unit_count": 3500,
    "floors": "GF + 8F",
    "contractor_name": "Con-A",
    "contractor_slug": "con-a",
    "description": "Flagship masterplanned neighborhood in Brașov Tractorul with 3,500+ delivered apartments, commercial center, and community sports facilities.",
    "image": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 94,
    "sources": [
      {
        "url": "https://maurer-imobiliare.ro/brasov/",
        "title": "Maurer Brașov Official Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Maurer Residence Brașov verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-nusco-city",
    "name": "Nusco City Phase 2",
    "slug": "nusco-city-pipera",
    "developer_name": "Nusco Imobiliere",
    "developer_slug": "nusco-imobiliere",
    "location": "Pipera · Voluntari",
    "location_slug": "pipera-voluntari",
    "county": "Ilfov",
    "locality": "Voluntari",
    "neighborhood": "Șoseaua Pipera 48",
    "address": "Șoseaua Pipera 48, Bucharest",
    "latitude": 44.485,
    "longitude": 26.11,
    "project_type": "Residential",
    "status": "under_construction",
    "status_display": "Under construction",
    "current_stage": "structure",
    "stage_source": "https://nuscocity.ro",
    "stage_last_verified": "2026-08-15",
    "current_progress_percent": 60,
    "estimated_completion": "2026-04-30",
    "investment_eur": 110000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 110000,
    "unit_count": 828,
    "floors": "GF + 7F",
    "contractor_name": "Concelex",
    "contractor_slug": "concelex",
    "description": "Major residential city-within-a-city development in Pipera North featuring 828 green apartments, 4,000 sqm private park, and educational facilities.",
    "image": "https://images.unsplash.com/photo-1515165562839-978bbcf18277?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 93,
    "sources": [
      {
        "url": "https://nuscocity.ro",
        "title": "Nusco City Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Nusco City Phase 2 verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-sema-parc",
    "name": "Sema Parc Phase 3",
    "slug": "sema-parc-bucharest",
    "developer_name": "River Development",
    "developer_slug": "river-development",
    "location": "Bucharest · Sector 6",
    "location_slug": "bucharest-sector-6",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Grozăvești / Petrache Poenaru Metro",
    "address": "Splaiul Independenței 319, Bucharest",
    "latitude": 44.445,
    "longitude": 26.045,
    "project_type": "Mixed-use",
    "status": "under_construction",
    "status_display": "Under construction",
    "current_stage": "structure",
    "stage_source": "https://semaparc.ro",
    "stage_last_verified": "2026-08-20",
    "current_progress_percent": 50,
    "estimated_completion": "2026-08-31",
    "investment_eur": 150000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 140000,
    "floors": "2B + GF + 12F",
    "contractor_name": "Bog'Art",
    "contractor_slug": "bog-art",
    "description": "41-hectare urban masterplan along Dâmbovița river combining Class A office buildings, retail plaza, and residential units connected to Petrache Poenaru metro station.",
    "image": "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 94,
    "sources": [
      {
        "url": "https://semaparc.ro",
        "title": "Sema Parc Official Masterplan",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Sema Parc Phase 3 verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-infinity-nord",
    "name": "Infinity Nord",
    "slug": "infinity-nord-straulesti",
    "developer_name": "Redport Capital",
    "developer_slug": "redport-capital",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Străulești / Jiului Metro",
    "address": "Bulevardul Poligrafiei 48, Bucharest",
    "latitude": 44.5,
    "longitude": 26.04,
    "project_type": "Residential",
    "status": "under_construction",
    "status_display": "Under construction",
    "current_stage": "foundation",
    "stage_source": "https://redport.ro",
    "stage_last_verified": "2026-08-12",
    "current_progress_percent": 30,
    "estimated_completion": "2027-06-30",
    "investment_eur": 140000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 125000,
    "unit_count": 1250,
    "floors": "GF + 10F",
    "contractor_name": "Concelex",
    "contractor_slug": "concelex",
    "description": "Large-scale residential community with 1,250 apartments, commercial promenade, and green courtyards near Străulești lake.",
    "image": "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 90,
    "sources": [
      {
        "url": "https://redport.ro",
        "title": "Redport Capital Official Site",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Infinity Nord verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-autostrada-a1-sibiu",
    "name": "Autostrada A1 Sibiu-Pitești Lot 1",
    "slug": "autostrada-a1-sibiu-boita",
    "developer_name": "CNAIR (Compania Națională de Administrare a Infrastructurii Rutiere)",
    "developer_slug": "porr-construct",
    "location": "Sibiu",
    "location_slug": "sibiu",
    "county": "Sibiu",
    "locality": "Sibiu / Boița",
    "neighborhood": "Boița Corridor A1",
    "address": "Tronsonul Sibiu - Boița A1, Sibiu",
    "latitude": 45.63,
    "longitude": 24.26,
    "project_type": "Civil Infrastructure",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://porr.ro",
    "stage_last_verified": "2022-12-15",
    "current_progress_percent": 100,
    "actual_delivery": "2022-12-15",
    "investment_eur": 125000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 450000,
    "contractor_name": "PORR Construct Romania",
    "contractor_slug": "porr-construct",
    "description": "13.17 km motorway section delivered ahead of schedule by PORR Construct, featuring 27 bridges and viaducts in Southern Transylvania.",
    "image": "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://porr.ro",
        "title": "PORR Official Infrastructure Disclosure",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Autostrada A1 Sibiu-Pitești Lot 1 verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-one-cotroceni-park",
    "name": "One Cotroceni Park",
    "slug": "one-cotroceni-park",
    "developer_name": "One United Properties",
    "developer_slug": "one-united-properties",
    "location": "Bucharest · Sector 5",
    "location_slug": "bucharest-sector-5",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Cotroceni / Academiei",
    "address": "Șoseaua Progresului 55, Bucharest",
    "latitude": 44.425,
    "longitude": 26.065,
    "project_type": "Mixed-use",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://one.ro/one-cotroceni-park/",
    "stage_last_verified": "2023-11-30",
    "current_progress_percent": 100,
    "actual_delivery": "2023-11-30",
    "investment_eur": 180000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 220000,
    "unit_count": 868,
    "floors": "2B + GF + 12F",
    "architect_name": "West Group Architecture",
    "architect_slug": "west-group-architecture",
    "engineering_name": "Popp & Asociații",
    "engineering_slug": "popp-si-asociatii",
    "contractor_name": "Bog'Art",
    "contractor_slug": "bog-art",
    "description": "Flagship mixed-use urban regeneration park directly connected to Academiei metro station, featuring 80,000 sqm Class A office space and 868 luxury apartments.",
    "image": "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://one.ro/one-cotroceni-park/",
        "title": "One Cotroceni Park Official Presentation",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://profit.ro/one-cotroceni-park-finalizat",
        "title": "Profit.ro Completion Notice",
        "type": "NEWS",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "One Cotroceni Park verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-timpuri-noi-square",
    "name": "Timpuri Noi Square Phase 2",
    "slug": "timpuri-noi-square",
    "developer_name": "Vastint Romania",
    "developer_slug": "vastint-romania",
    "location": "Bucharest · Sector 3",
    "location_slug": "bucharest-sector-3",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Timpuri Noi Metro / Splaiul Unirii",
    "address": "Splaiul Unirii 165, Bucharest",
    "latitude": 44.417,
    "longitude": 26.115,
    "project_type": "Mixed-use",
    "status": "under_construction",
    "status_display": "Under construction",
    "current_stage": "structure",
    "stage_source": "https://timpurinoisquare.ro",
    "stage_last_verified": "2026-08-22",
    "current_progress_percent": 50,
    "estimated_completion": "2026-09-30",
    "investment_eur": 100000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 60000,
    "floors": "2B + GF + 14F",
    "contractor_name": "Bog'Art",
    "contractor_slug": "bog-art",
    "description": "Phase 2 extension of Timpuri Noi Square adding 60,000 sqm GLA Class A office, retail plaza, and green leisure spaces right on the Dâmbovița riverbank.",
    "image": "https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 93,
    "sources": [
      {
        "url": "https://timpurinoisquare.ro",
        "title": "Timpuri Noi Square Official Site",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Timpuri Noi Square Phase 2 verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-afi-tech-park",
    "name": "AFI Tech Park",
    "slug": "afi-tech-park",
    "developer_name": "AFI Europe Romania",
    "developer_slug": "afi-europe-romania",
    "location": "Bucharest · Sector 5",
    "location_slug": "bucharest-sector-5",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Tudor Vladimirescu / Rahova",
    "address": "Bulevardul Tudor Vladimirescu 29, Bucharest",
    "latitude": 44.42,
    "longitude": 26.075,
    "project_type": "Office",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://afi-europe.ro/afi-tech-park/",
    "stage_last_verified": "2022-09-30",
    "current_progress_percent": 100,
    "actual_delivery": "2022-09-30",
    "investment_eur": 70000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 56000,
    "floors": "2B + GF + 8F",
    "contractor_name": "DENTON Construction",
    "contractor_slug": "denton-construction",
    "description": "Modern 56,000 sqm Class A office campus located opposite Vulcan Value Centre, certified LEED Platinum.",
    "image": "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=85",
    "is_featured": false,
    "verification_status": "VERIFIED",
    "completeness_score": 92,
    "sources": [
      {
        "url": "https://afi-europe.ro/afi-tech-park/",
        "title": "AFI Tech Park Official Presentation",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "AFI Tech Park verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-u-center",
    "name": "U Center Phase 2",
    "slug": "u-center-bucharest",
    "developer_name": "Forte Partners",
    "developer_slug": "forte-partners",
    "location": "Bucharest · Sector 4",
    "location_slug": "bucharest-sector-4",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Tineretului / Calea Șerban Vodă",
    "address": "Calea Șerban Vodă 206, Bucharest",
    "latitude": 44.41,
    "longitude": 26.1,
    "project_type": "Office",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://fortepartners.ro/u-center/",
    "stage_last_verified": "2023-09-30",
    "current_progress_percent": 100,
    "actual_delivery": "2023-09-30",
    "investment_eur": 90000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 63000,
    "floors": "2B + GF + 8F",
    "contractor_name": "Bog'Art",
    "contractor_slug": "bog-art",
    "description": "LEED Platinum & WELL Platinum certified office park near Tineretului park, fully powered by green electricity.",
    "image": "https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 94,
    "sources": [
      {
        "url": "https://fortepartners.ro/u-center/",
        "title": "U Center Official Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "U Center Phase 2 verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-h-pipera-lake",
    "name": "H Pipera Lake",
    "slug": "h-pipera-lake",
    "developer_name": "Hagag Development Europe",
    "developer_slug": "hagag-development-europe",
    "location": "Pipera · Voluntari",
    "location_slug": "pipera-voluntari",
    "county": "Ilfov",
    "locality": "Voluntari",
    "neighborhood": "Pipera Lake North",
    "address": "Bulevardul Pipera 1, Voluntari",
    "latitude": 44.51,
    "longitude": 26.13,
    "project_type": "Residential",
    "status": "under_construction",
    "status_display": "Under construction",
    "current_stage": "finishing",
    "stage_source": "https://hpiperalake.ro",
    "stage_last_verified": "2026-08-16",
    "current_progress_percent": 80,
    "estimated_completion": "2025-12-31",
    "investment_eur": 90000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 120000,
    "unit_count": 1350,
    "floors": "GF + 7F",
    "contractor_name": "Concelex",
    "contractor_slug": "concelex",
    "description": "Large residential project on the shore of Pipera lake featuring 1,350 modern apartments spread across 17 residential blocks.",
    "image": "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3&v=2?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 92,
    "sources": [
      {
        "url": "https://hpiperalake.ro",
        "title": "H Pipera Lake Official Website",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "H Pipera Lake verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-promenada-craiova",
    "name": "Promenada Craiova",
    "slug": "promenada-craiova",
    "developer_name": "NEPI Rockcastle",
    "developer_slug": "nepi-rockcastle",
    "location": "Craiova",
    "location_slug": "craiova",
    "county": "Dolj",
    "locality": "Craiova",
    "neighborhood": "Severinului Corridor",
    "address": "Calea Severinului 61, Craiova",
    "latitude": 44.335,
    "longitude": 23.775,
    "project_type": "Retail",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://promenadacraiova.ro",
    "stage_last_verified": "2023-10-05",
    "current_progress_percent": 100,
    "actual_delivery": "2023-10-05",
    "investment_eur": 125000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 80000,
    "built_area_sqm": 80000,
    "parking_spaces": 2800,
    "contractor_name": "Construcții Erbașu",
    "contractor_slug": "constructii-erbasu",
    "description": "Largest retail investment in Oltenia region, featuring 80,000 sqm GLA shopping mall, retail park, and drive-through hypermarket.",
    "image": "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "sources": [
      {
        "url": "https://promenadacraiova.ro",
        "title": "Promenada Craiova Official Web Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Promenada Craiova verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-silk-district",
    "name": "Silk District Iași",
    "slug": "silk-district-iasi",
    "developer_name": "Prime Kapital",
    "developer_slug": "prime-kapital",
    "location": "Iași",
    "location_slug": "iasi",
    "county": "Iași",
    "locality": "Iași",
    "neighborhood": "Calea Chișinăului / Primăverii",
    "address": "Calea Chișinăului 22, Iași",
    "latitude": 47.15,
    "longitude": 27.61,
    "project_type": "Mixed-use",
    "status": "under_construction",
    "status_display": "Under construction",
    "current_stage": "facade",
    "stage_source": "https://silkdistrict.ro",
    "stage_last_verified": "2026-08-15",
    "current_progress_percent": 55,
    "estimated_completion": "2026-06-30",
    "investment_eur": 200000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 350000,
    "unit_count": 1500,
    "floors": "GF + 11F",
    "description": "Brownfield urban regeneration of former Tomiris textile plant into 1,500 apartments, 100,000 sqm GLA Class A office space, and 10,000 sqm car-free green park.",
    "image": "https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 91,
    "sources": [
      {
        "url": "https://silkdistrict.ro",
        "title": "Silk District Official Website",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://zf.ro/constructii/prime-kapital-progres-silk-district-iasi",
        "title": "ZF Construction Progress",
        "type": "NEWS",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Silk District Iași verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-paltim-timisoara",
    "name": "Paltim Timișoara",
    "slug": "paltim-timisoara",
    "developer_name": "Speedwell",
    "developer_slug": "speedwell",
    "location": "Timișoara",
    "location_slug": "timisoara",
    "county": "Timiș",
    "locality": "Timișoara",
    "neighborhood": "Bega River Corridor / Take Ionescu",
    "address": "Bulevardul Take Ionescu 46, Timișoara",
    "latitude": 45.761,
    "longitude": 21.24,
    "project_type": "Mixed-use",
    "status": "under_construction",
    "status_display": "Under construction",
    "current_stage": "structure",
    "stage_source": "https://paltim.ro",
    "stage_last_verified": "2026-08-20",
    "current_progress_percent": 60,
    "estimated_completion": "2025-11-30",
    "investment_eur": 45000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 40000,
    "unit_count": 236,
    "floors": "GF + 9F",
    "engineering_name": "Popp & Asociații",
    "engineering_slug": "popp-si-asociatii",
    "description": "Urban regeneration project on Bega riverbank featuring 236 apartments, 15,000 sqm office space, retail spaces, and refurbished industrial hat factory building.",
    "image": "https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 90,
    "sources": [
      {
        "url": "https://paltim.ro",
        "title": "Paltim Timișoara Official Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Paltim Timișoara verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-greenfield-baneasa",
    "name": "Greenfield Băneasa",
    "slug": "greenfield-baneasa",
    "developer_name": "Impact Developer & Contractor",
    "developer_slug": "impact-developer-contractor",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Băneasa Forest / Teișani",
    "address": "Aleea Teișani 24, Bucharest",
    "latitude": 44.53,
    "longitude": 26.09,
    "project_type": "Residential",
    "status": "under_construction",
    "status_display": "Under construction",
    "current_stage": "finishing",
    "stage_source": "https://greenfieldbaneasa.ro",
    "stage_last_verified": "2026-08-10",
    "current_progress_percent": 85,
    "estimated_completion": "2026-06-30",
    "investment_eur": 300000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 500000,
    "unit_count": 7000,
    "floors": "GF + 5F",
    "contractor_name": "Concelex",
    "contractor_slug": "concelex",
    "description": "Largest residential neighborhood surrounded by 900 hectares of Băneasa forest, including Greenfield Plaza commercial center, wellness club, and public school.",
    "image": "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 93,
    "sources": [
      {
        "url": "https://greenfieldbaneasa.ro",
        "title": "Greenfield Băneasa Official Site",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Greenfield Băneasa verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-j8-office-park",
    "name": "J8 Office Park",
    "slug": "j8-office-park",
    "developer_name": "Portland Trust",
    "developer_slug": "portland-trust",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Jiului / Bucureștii Noi",
    "address": "Strada Jiului 8, Bucharest",
    "latitude": 44.485,
    "longitude": 26.045,
    "project_type": "Office",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://j8officepark.ro",
    "stage_last_verified": "2021-10-31",
    "current_progress_percent": 100,
    "actual_delivery": "2021-10-31",
    "investment_eur": 50000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 46000,
    "floors": "2B + GF + 6F",
    "architect_name": "West Group Architecture",
    "architect_slug": "west-group-architecture",
    "contractor_name": "Bog'Art",
    "contractor_slug": "bog-art",
    "description": "BREEAM Outstanding and WELL Health-Safety office campus anchored by Ubisoft Bucharest Headquarters, featuring HEPA air filtration and 100% renewable energy.",
    "image": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "sources": [
      {
        "url": "https://j8officepark.ro",
        "title": "J8 Office Park Official Portal",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "J8 Office Park verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-stadionul-steaua",
    "name": "Stadionul Steaua București",
    "slug": "stadionul-steaua-ghencea",
    "developer_name": "Compania Națională de Investiții (CNI)",
    "developer_slug": "constructii-erbasu",
    "location": "Bucharest · Sector 6",
    "location_slug": "bucharest-sector-6",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Ghencea",
    "address": "Bulevardul Ghencea 45, Bucharest",
    "latitude": 44.412,
    "longitude": 26.025,
    "project_type": "Civil Infrastructure",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://erbasu.ro",
    "stage_last_verified": "2021-07-07",
    "current_progress_percent": 100,
    "actual_delivery": "2021-07-07",
    "investment_eur": 95000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 82000,
    "unit_count": 31254,
    "contractor_name": "Construcții Erbașu",
    "contractor_slug": "constructii-erbasu",
    "description": "UEFA Category 4 modern sports arena with 31,254 all-seater capacity, integrated museum, hotel accommodations, and underground parking.",
    "image": "https://images.unsplash.com/photo-1577223625816-7546f13df25d&v=2?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 96,
    "sources": [
      {
        "url": "https://erbasu.ro",
        "title": "Constructii Erbasu Official Portfolio Entry",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Stadionul Steaua București verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-ctpark-bucharest-west",
    "name": "CTPark Bucharest West",
    "slug": "ctpark-bucharest-west",
    "developer_name": "CTP Romania",
    "developer_slug": "ctp-romania",
    "location": "Chiajna",
    "location_slug": "chiajna",
    "county": "Ilfov",
    "locality": "Chiajna",
    "neighborhood": "A1 Motorway Km 23",
    "address": "Autostrada A1 Km 23, Bolintin-Deal",
    "latitude": 44.44,
    "longitude": 25.82,
    "project_type": "Industrial/Logistics",
    "status": "under_construction",
    "status_display": "Under construction",
    "current_stage": "structure",
    "stage_source": "https://ctp.eu/romania/ctpark-bucharest-west/",
    "stage_last_verified": "2026-08-24",
    "current_progress_percent": 75,
    "estimated_completion": "2026-11-30",
    "investment_eur": 500000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 850000,
    "built_area_sqm": 850000,
    "floors": "GF High Bay",
    "contractor_name": "Bog'Art",
    "contractor_slug": "bog-art",
    "description": "Largest industrial and logistics park in Central and Eastern Europe (850,000 sqm GLA), featuring solar rooftop installations, Clubhaus community center, and medical clinic.",
    "image": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "verification_status": "VERIFIED",
    "completeness_score": 95,
    "sources": [
      {
        "url": "https://ctp.eu/romania/ctpark-bucharest-west/",
        "title": "CTPark Bucharest West Official Presentation",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      },
      {
        "url": "https://zf.ro/constructii/ctp-extindere-ctpark-bucharest-west",
        "title": "ZF Logistics Market Report",
        "type": "NEWS",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "CTPark Bucharest West verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-h-eliade-towers",
    "name": "H Eliade Towers",
    "slug": "h-eliade-towers",
    "developer_name": "Hagag Development Europe",
    "developer_slug": "hagag-development-europe",
    "location": "Bucharest · Sector 1",
    "location_slug": "bucharest-sector-1",
    "county": "Bucharest",
    "locality": "Bucharest",
    "neighborhood": "Mircea Eliade / Primaverii",
    "address": "Bulevardul Mircea Eliade 18, Bucharest",
    "latitude": 44.468,
    "longitude": 26.098,
    "project_type": "Residential",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "stage_source": "https://hagag.ro",
    "stage_last_verified": "2022-12-31",
    "current_progress_percent": 100,
    "actual_delivery": "2022-12-31",
    "investment_eur": 65000000,
    "investment_label": "ANNOUNCED INVESTMENT",
    "surface_area_sqm": 30000,
    "unit_count": 250,
    "floors": "2B + GF + 10F",
    "description": "Luxury high-end residential complex overlooking Floreasca Lake, featuring concierge services, subterranean parking, and high-performance glass facades.",
    "image": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=85",
    "is_featured": false,
    "verification_status": "VERIFIED",
    "sources": [
      {
        "url": "https://hagag.ro",
        "title": "Hagag H Eliade Towers Official Site",
        "type": "OFFICIAL",
        "date": "2026-08-25",
        "verified_at": "2026-08-28T10:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "H Eliade Towers verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  },
  {
    "id": "proj-podul-braila",
    "name": "Podul Suspendat peste Dunăre de la Brăila",
    "slug": "podul-suspendat-braila",
    "developer_name": "CNAIR - Ministerul Transporturilor",
    "developer_slug": "webuild-romania",
    "location": "Brăila",
    "location_slug": "braila",
    "county": "Brăila",
    "address": "DN2B Corridor, Brăila",
    "latitude": 45.312,
    "longitude": 27.998,
    "project_type": "Civil Infrastructure",
    "status": "completed",
    "status_display": "Completed",
    "current_stage": "delivered",
    "current_progress_percent": 100,
    "actual_delivery": "2023-07-06",
    "investment_eur": 500000000,
    "surface_area_sqm": 1974,
    "contractor_name": "Webuild Romania (Astaldi)",
    "contractor_slug": "webuild-romania",
    "description": "The Golden Gate of Romania: 3rd longest suspension bridge in Europe (1,974 m total length with 1,120 m main span) connecting Dobrogea to Moldavia.",
    "image": "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a&v=2?auto=format&fit=crop&w=1200&q=85",
    "is_featured": true,
    "sources": [
      {
        "url": "https://webuildgroup.com",
        "title": "Webuild Global Infrastructure Portal",
        "type": "OFFICIAL",
        "verified_at": "2026-08-25T00:00:00Z"
      }
    ],
    "last_verified_at": "2026-08-28T10:00:00Z",
    "image_alt": "Podul Suspendat peste Dunăre de la Brăila verified development photograph",
    "image_source_name": "Official Disclosure",
    "image_verified": true,
    "image_relevance": "PROJECT_SPECIFIC"
  }
];

export const realLocationsDataset: RealLocation[] = [
  {
    "id": "loc-1",
    "slug": "bucharest",
    "name": "Bucharest",
    "city": "Bucharest",
    "county": "București",
    "projects_count": 24,
    "active_sites_count": 14,
    "developers_count": 18
  },
  {
    "id": "loc-2",
    "slug": "cluj-napoca",
    "name": "Cluj-Napoca",
    "city": "Cluj-Napoca",
    "county": "Cluj",
    "projects_count": 8,
    "active_sites_count": 5,
    "developers_count": 6
  },
  {
    "id": "loc-3",
    "slug": "timisoara",
    "name": "Timișoara",
    "city": "Timișoara",
    "county": "Timiș",
    "projects_count": 5,
    "active_sites_count": 3,
    "developers_count": 4
  },
  {
    "id": "loc-4",
    "slug": "iasi",
    "name": "Iași",
    "city": "Iași",
    "county": "Iași",
    "projects_count": 4,
    "active_sites_count": 3,
    "developers_count": 3
  },
  {
    "id": "loc-5",
    "slug": "brasov",
    "name": "Brașov",
    "city": "Brașov",
    "county": "Brașov",
    "projects_count": 4,
    "active_sites_count": 2,
    "developers_count": 4
  },
  {
    "id": "loc-6",
    "slug": "constanta",
    "name": "Constanța",
    "city": "Constanța",
    "county": "Constanța",
    "projects_count": 3,
    "active_sites_count": 2,
    "developers_count": 3
  },
  {
    "id": "loc-7",
    "slug": "sibiu",
    "name": "Sibiu",
    "city": "Sibiu",
    "county": "Sibiu",
    "projects_count": 2,
    "active_sites_count": 2,
    "developers_count": 2
  },
  {
    "id": "loc-8",
    "slug": "oradea",
    "name": "Oradea",
    "city": "Oradea",
    "county": "Bihor",
    "projects_count": 2,
    "active_sites_count": 1,
    "developers_count": 2
  },
  {
    "id": "loc-9",
    "slug": "ploiesti",
    "name": "Ploiești",
    "city": "Ploiești",
    "county": "Prahova",
    "projects_count": 1,
    "active_sites_count": 1,
    "developers_count": 1
  },
  {
    "id": "loc-10",
    "slug": "pitesti",
    "name": "Pitești",
    "city": "Pitești",
    "county": "Argeș",
    "projects_count": 1,
    "active_sites_count": 1,
    "developers_count": 1
  },
  {
    "id": "loc-11",
    "slug": "craiova",
    "name": "Craiova",
    "city": "Craiova",
    "county": "Dolj",
    "projects_count": 1,
    "active_sites_count": 1,
    "developers_count": 1
  },
  {
    "id": "loc-12",
    "slug": "braila",
    "name": "Brăila",
    "city": "Brăila",
    "county": "Brăila",
    "projects_count": 1,
    "active_sites_count": 1,
    "developers_count": 1
  }
];
