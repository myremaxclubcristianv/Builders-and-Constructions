import { execSync } from 'child_process';
import fs from 'fs';

async function consolidate() {
  const commits = execSync('git log --format="%H" -- lib/real-romanian-data.ts').toString().trim().split('\n');

  const companyMap = new Map<string, any>();
  const projectMap = new Map<string, any>();

  for (const commit of commits) {
    try {
      const code = execSync(`git show ${commit}:lib/real-romanian-data.ts`).toString();
      fs.writeFileSync('/tmp/temp_data.ts', code);
      delete require.cache[require.resolve('/tmp/temp_data')];
      const { realCompaniesDataset, realProjectsDataset } = require('/tmp/temp_data');
      if (Array.isArray(realCompaniesDataset)) {
        for (const c of realCompaniesDataset) {
          if (c.slug && !companyMap.has(c.slug)) {
            companyMap.set(c.slug, c);
          }
        }
      }
      if (Array.isArray(realProjectsDataset)) {
        for (const p of realProjectsDataset) {
          if (p.slug && !projectMap.has(p.slug)) {
            projectMap.set(p.slug, p);
          }
        }
      }
    } catch {
      // ignore
    }
  }

  console.log(`Extracted ${companyMap.size} unique companies and ${projectMap.size} unique projects.`);

  const companies = Array.from(companyMap.values());
  const projects = Array.from(projectMap.values());

  const fileContent = `/* eslint-disable @typescript-eslint/no-explicit-any */
export type SourceType = 'OFFICIAL' | 'PUBLIC_RECORD' | 'COMPANY_REPORT' | 'INDUSTRY_SOURCE' | 'NEWS' | 'FINANCIAL_STATEMENT';

export interface RealSource {
  url: string;
  title: string;
  type: SourceType;
  verified_at: string;
}

export interface FinancialYearData {
  year: number;
  revenue_eur: number;
  net_profit_eur: number;
  employees: number;
  source: string;
  status: 'REPORTED' | 'ANNOUNCED' | 'ESTIMATE' | 'NOT DISCLOSED';
}

export interface RealCompany {
  id: string;
  name: string;
  slug: string;
  type: 'developer' | 'general_contractor' | 'construction_company' | 'infrastructure' | 'architecture' | 'engineering' | 'structural_engineering' | 'mep';
  location: string;
  description: string;
  website: string;
  founded_year: number;
  cui_cif?: string;
  verification_level: 'OFFICIAL_REGISTRY_VERIFIED' | 'ANNUAL_FINANCIAL_VERIFIED' | 'MARKET_DISCLOSURE_VERIFIED';
  specializations: string[];
  services: string[];
  markets: string[];
  certifications: string[];
  projects_count: number;
  active_projects_count: number;
  completed_projects_count: number;
  is_featured: boolean;
  last_verified_at: string;
  financials_2025?: FinancialYearData;
  financials_2024?: FinancialYearData;
  financial_timeline?: FinancialYearData[];
  revenue_growth_yoy?: number;
  employees_count?: number;
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
  address?: string;
  project_type: 'Residential' | 'Office' | 'Mixed-use' | 'Industrial/Logistics' | 'Civil Infrastructure' | 'Healthcare Infrastructure' | 'Retail';
  status: 'under_construction' | 'completed' | 'upcoming';
  status_display: 'Under Construction' | 'Delivered' | 'Permitting / Planning';
  current_stage: 'planning' | 'permits' | 'foundation' | 'structure' | 'facade' | 'mep' | 'finishing' | 'delivered';
  investment_eur: number;
  surface_area_sqm?: number;
  unit_count?: number;
  estimated_completion?: string;
  actual_delivery?: string;
  description: string;
  image: string;
  is_featured: boolean;
  last_verified_at: string;
  sources: RealSource[];
}

export interface RealLocation {
  city: string;
  county: string;
  projects_count: number;
  active_sites_count: number;
  developers_count: number;
}

export const realCompaniesDataset: RealCompany[] = ${JSON.stringify(companies, null, 2)};

export const realProjectsDataset: RealProject[] = ${JSON.stringify(projects, null, 2)};

export const realLocationsDataset: RealLocation[] = [
  { city: 'Bucharest', county: 'București', projects_count: 24, active_sites_count: 14, developers_count: 18 },
  { city: 'Cluj-Napoca', county: 'Cluj', projects_count: 8, active_sites_count: 5, developers_count: 6 },
  { city: 'Timișoara', county: 'Timiș', projects_count: 5, active_sites_count: 3, developers_count: 4 },
  { city: 'Iași', county: 'Iași', projects_count: 4, active_sites_count: 3, developers_count: 3 },
  { city: 'Brașov', county: 'Brașov', projects_count: 4, active_sites_count: 2, developers_count: 4 },
  { city: 'Constanța', county: 'Constanța', projects_count: 3, active_sites_count: 2, developers_count: 3 },
  { city: 'Sibiu', county: 'Sibiu', projects_count: 2, active_sites_count: 2, developers_count: 2 },
  { city: 'Oradea', county: 'Bihor', projects_count: 2, active_sites_count: 1, developers_count: 2 },
  { city: 'Ploiești', county: 'Prahova', projects_count: 1, active_sites_count: 1, developers_count: 1 },
  { city: 'Pitești', county: 'Argeș', projects_count: 1, active_sites_count: 1, developers_count: 1 },
  { city: 'Craiova', county: 'Dolj', projects_count: 1, active_sites_count: 1, developers_count: 1 },
  { city: 'Brăila', county: 'Brăila', projects_count: 1, active_sites_count: 1, developers_count: 1 }
];
`;

  fs.writeFileSync('./lib/real-romanian-data.ts', fileContent);
  console.log('Successfully wrote consolidated lib/real-romanian-data.ts!');
}

consolidate();
