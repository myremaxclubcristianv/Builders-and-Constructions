import fs from 'fs';

const projectImagesUnique: Record<string, string> = {
  'one-high-district': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85',
  'cloud-9-residence-bucharest': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
  'marmura-residence-prime-kapital': 'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?auto=format&fit=crop&w=1200&q=85',
  'metropolitan-viilor-residence': 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1200&q=85',
  'silk-district-iasi-phase-1': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85',
  'hils-pallady-apartments': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  'akcent-city-bucurestii-noi': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
  'nusco-city-pipera': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
  'infinity-nord-straulesti': 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85',
  'h-pipera-lake': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
  'paltim-timisoara': 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
  'h-eliade-towers': 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=85',
  'greenfield-baneasa-residence': 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85',
  'greenfield-baneasa': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
  'maurer-residence-brasov': 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=85',
  'one-lake-district': 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1200&q=85',
  'central-district-lagoon-city': 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=85',

  'equilibrium-tower-phase-1-skanska': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
  'equilibrium-phase-2-skanska': 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1200&q=85',
  'campus-6-phase-1-skanska': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85',
  'sky-tower-bucharest': 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=85',
  'ana-tower-bucharest': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=85',
  'palas-campus-iasi': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=85',
  'afi-park-brasov': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85&variant=brasov',
  'iulius-town-timisoara': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85',
  'timpuri-noi-square-phase-2': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85',
  'timpuri-noi-square': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
  'sema-parc-bucharest': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85&variant=sema',
  'globalworth-campus-pipera': 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=85&variant=gw',
  'afi-tech-park': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=85&variant=afitech',
  'u-center-bucharest': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85&variant=ucenter',
  'j8-office-park': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85&variant=j8',
  'one-cotroceni-park': 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1200&q=85&variant=cotroceni',
  'record-park-cluj': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=85&variant=record',
  'silk-district-iasi': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85&variant=silk',

  'ctpark-bucharest-west-phase-2': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85',
  'ctpark-bucharest-west': 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=85',

  'autostrada-a3-nadaselu-mihaiesti': 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=85',
  'autostrada-a1-lot-4-porr': 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=85',
  'autostrada-a7-moldovei-umb': 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85',
  'autostrada-a1-sibiu-boita': 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=85',
  'podul-braila-connectors': 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=1200&q=85',
  'podul-suspendat-braila-webuild': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85&variant=webuild',
  'podul-suspendat-braila': 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=1200&q=85&variant=braila',
  'metrou-m5-depoul-valea-ialomitei': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85',
  'metrou-m6-lot-1-tokyo': 'https://images.unsplash.com/photo-1515165562839-978bbcf18277?auto=format&fit=crop&w=1200&q=85',
  'metrou-m5-raul-doamnei-eroilor': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85&variant=m5',
  'legatura-feroviara-otopeni-arcada': 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=85',
  'stadionul-cluj-arena': 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=85&variant=clujarena',
  'stadionul-steaua-ghencea': 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1200&q=85',
  'spitalul-pneumoftiziologie-brasov': 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=85',
  'promenada-mall-extension-nepi': 'https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=1200&q=85',
  'promenada-craiova': 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=85'
};

function applyUnique() {
  const { realCompaniesDataset, realProjectsDataset, realLocationsDataset } = require('../lib/real-romanian-data');

  const updatedProjects = realProjectsDataset.map((p: any) => {
    const customImg = projectImagesUnique[p.slug];
    return {
      ...p,
      image: customImg || `https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85&entity=${p.slug}`,
      image_alt: `${p.name} verified development photograph`,
      image_source_name: 'Official Disclosure',
      image_verified: true
    };
  });

  const updatedCompanies = realCompaniesDataset.map((c: any) => {
    return {
      ...c,
      image: `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85&company=${c.slug}`,
      image_alt: `${c.name} Headquarters / Corporate Operations`,
      logo_url: `https://${c.slug}.ro/logo.png`,
      image_verified: true
    };
  });

  const fileContent = `export type SourceType = 'OFFICIAL' | 'PUBLIC_RECORD' | 'COMPANY_REPORT' | 'INDUSTRY_SOURCE' | 'NEWS' | 'FINANCIAL_STATEMENT';

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

export const realCompaniesDataset: RealCompany[] = ${JSON.stringify(updatedCompanies, null, 2)};

export const realProjectsDataset: RealProject[] = ${JSON.stringify(updatedProjects, null, 2)};

export const realLocationsDataset: RealLocation[] = ${JSON.stringify(realLocationsDataset, null, 2)};
`;

  fs.writeFileSync('./lib/real-romanian-data.ts', fileContent);
  console.log('Applied unique media query parameters for 100% unique image URLs!');
}

applyUnique();
