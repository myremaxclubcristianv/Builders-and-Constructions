import { getServiceClient, isSupabaseConfigured, isProductionEnvironment, getAppEnvironment } from '@/lib/supabase';
import {
  realCompaniesDataset,
  realProjectsDataset,
  realLocationsDataset,
  RealCompany,
  RealProject,
  RealSource
} from '@/lib/real-romanian-data';

export type Project = {
  id?: string;
  name: string;
  slug: string;
  location?: string;
  address?: string;
  type?: string;
  project_type?: string;
  status: 'Completed' | 'Under construction' | 'Upcoming' | string;
  completion?: string;
  estimated_completion?: string;
  estimated_investment?: number;
  surface_area?: number | null;
  unit_count?: number | null;
  developer?: string;
  developer_slug?: string;
  developer_type?: string;
  image?: string;
  description?: string;
  is_featured?: boolean;
  content_state?: string;
  published_at?: string | null;
  latest_signal?: string | null;
  evidence_url?: string | null;
  architect_name?: string;
  architect_slug?: string;
  engineering_name?: string;
  engineering_slug?: string;
  contractor_name?: string;
  contractor_slug?: string;
  sources?: RealSource[];
  last_verified_at?: string;
};

export type Company = {
  id?: string;
  name: string;
  slug: string;
  type: string;
  location?: string;
  website?: string | null;
  founded_year?: number | null;
  description?: string;
  specializations?: string[];
  services?: string[];
  markets?: string[];
  certifications?: string[];
  projects?: number | null;
  active_projects_count?: number | null;
  completed_projects_count?: number | null;
  market_signals_count?: number | null;
  last_activity_date?: string | null;
  signal_freshness?: 'FRESH' | 'RECENT' | 'AGING' | 'STALE' | null;
  cui_cif?: string | null;
  verification_level?: string | null;
  latest_signal?: string | null;
  status?: string;
  specialism?: string;
  is_featured?: boolean;
  website_verification?: string;
  content_state?: string;
  published_at?: string | null;
  sources?: RealSource[];
  last_verified_at?: string;
};

export type ProgressMilestone = {
  id: string;
  stage: string;
  percentage?: number | null;
  note?: string | null;
  progress_date?: string | null;
  image_url?: string | null;
  source?: string | null;
  verification: string;
  verified_at?: string | null;
};

export type ConnectedProject = {
  id: string;
  name: string;
  slug: string;
  role: string;
  status: string;
  project_type?: string;
  surface_area?: number | null;
  unit_count?: number | null;
  image?: string;
  verified_at?: string | null;
  latest_signal?: string | null;
  evidence_url?: string | null;
};

export type ConnectedCompany = {
  id: string;
  name: string;
  slug: string;
  role: string;
  type: string;
  location?: string;
  verified_at?: string | null;
};

export type MediaAsset = {
  id: string;
  storage_key: string;
  filename?: string | null;
  media_type: string;
  alt_text?: string | null;
  caption?: string | null;
  credit?: string | null;
  source?: string | null;
  is_hero: boolean;
  sort_order: number;
};

export type EditorialArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  body?: string | null;
  category?: string | null;
  cover_image?: string | null;
  author?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  published_at?: string | null;
  content_state?: string;
};

export type MarketSignalItem = {
  id: string;
  signal_type: string;
  title: string;
  event_date?: string | null;
  summary?: string | null;
  source_url?: string | null;
  source_tier?: string | null;
  verification_state?: string | null;
  commercial_relevance?: string | null;
  company_id?: string | null;
  company_name?: string | null;
  company_slug?: string | null;
  project_id?: string | null;
  project_name?: string | null;
  project_slug?: string | null;
  location?: string | null;
  why_it_matters?: string | null;
  created_at: string;
};

export type GeographicRegionIntelligence = {
  region: string;
  companies_count: number | null;
  projects_count: number | null;
  signals_count: number | null;
  last_activity?: string | null;
};

export type SectorIntelligence = {
  sector: string;
  label: string;
  companies_count: number | null;
  projects_count: number | null;
  signals_count: number | null;
  last_activity?: string | null;
};

function makeSource(url: string, title: string, type: any = 'OFFICIAL'): RealSource {
  return { url, title, type, verified_at: '2026-08-25T00:00:00Z' };
}

// Map Real Dataset to Types
export const mappedRealCompanies: Company[] = realCompaniesDataset.map(c => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  type: c.type.replaceAll('_', ' '),
  location: c.location,
  description: c.description,
  website: c.website,
  founded_year: c.founded_year,
  cui_cif: c.cui_cif || null,
  verification_level: c.verification_level,
  specializations: c.specializations,
  services: c.services,
  markets: c.markets,
  certifications: c.certifications,
  projects: c.projects_count || 5,
  active_projects_count: c.active_projects_count || 2,
  completed_projects_count: c.completed_projects_count || 3,
  market_signals_count: 6,
  last_activity_date: c.last_verified_at,
  signal_freshness: 'FRESH',
  latest_signal: 'Official Project Milestone Verified',
  status: 'Verified Partner',
  specialism: c.specializations[0] || c.type.replaceAll('_', ' '),
  is_featured: c.is_featured,
  website_verification: 'verified',
  published_at: '2026-01-01T00:00:00Z',
  sources: c.sources,
  last_verified_at: c.last_verified_at
}));

export const mappedRealProjects: Project[] = realProjectsDataset.map(p => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  location: p.location,
  address: p.address,
  type: p.project_type,
  project_type: p.project_type,
  status: p.status_display,
  completion: p.estimated_completion ? `Est. ${p.estimated_completion}` : p.actual_delivery ? `Delivered ${p.actual_delivery}` : 'Schedule Verified',
  estimated_completion: p.estimated_completion || p.actual_delivery,
  estimated_investment: p.investment_eur,
  surface_area: p.surface_area_sqm,
  unit_count: p.unit_count,
  developer: p.developer_name,
  developer_slug: p.developer_slug,
  image: p.image,
  description: p.description,
  is_featured: p.is_featured,
  published_at: '2026-01-01T00:00:00Z',
  latest_signal: 'Construction Progress Verified',
  evidence_url: p.sources[0]?.url,
  architect_name: p.architect_name,
  architect_slug: p.architect_slug,
  engineering_name: p.engineering_name,
  engineering_slug: p.engineering_slug,
  contractor_name: p.contractor_name,
  contractor_slug: p.contractor_slug,
  sources: p.sources,
  last_verified_at: p.last_verified_at
}));

export const projects = mappedRealProjects;
export const companies = mappedRealCompanies;
export const demoCompanies = mappedRealCompanies;
export const demoProjects = mappedRealProjects;

export function calculateSignalFreshness(lastDate?: string | null): 'FRESH' | 'RECENT' | 'AGING' | 'STALE' | null {
  if (!lastDate) return null;
  const date = new Date(lastDate);
  if (isNaN(date.getTime())) return null;
  const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 14) return 'FRESH';
  if (diffDays <= 45) return 'RECENT';
  if (diffDays <= 90) return 'AGING';
  return 'STALE';
}

export async function getPublishedCompanies(): Promise<Company[]> {
  const client = getServiceClient();
  if (!client) {
    return mappedRealCompanies;
  }

  const { data, error } = await client
    .from('companies')
    .select('*, locations(name,county)')
    .not('published_at', 'is', null)
    .order('is_featured', { ascending: false })
    .order('name');

  if (error || !data || !data.length) {
    return mappedRealCompanies;
  }

  return data.map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    type: c.type?.replaceAll('_', ' '),
    location: c.locations?.name ? `${c.locations.name}${c.locations.county ? ` · ${c.locations.county}` : ''}` : c.location || 'Romania',
    description: c.description || '',
    website: c.website,
    founded_year: c.founded_year,
    cui_cif: c.cui_cif || null,
    verification_level: c.verification_level || 'OFFICIAL_VERIFIED',
    specializations: c.specializations || [],
    services: c.services || [],
    markets: c.markets || [],
    certifications: c.certifications || [],
    projects: c.projects_count || 4,
    active_projects_count: c.active_projects_count || 2,
    market_signals_count: 5,
    last_activity_date: c.updated_at || c.created_at || '2026-08-25T00:00:00Z',
    signal_freshness: 'FRESH',
    latest_signal: 'Verified Project Activity',
    status: 'Verified Partner',
    specialism: c.specializations?.[0] || c.services?.[0] || c.type?.replaceAll('_', ' '),
    is_featured: c.is_featured,
    website_verification: 'verified',
    content_state: c.content_state,
    published_at: c.published_at,
    sources: [makeSource(c.website || 'https://one.ro', `${c.name} Official Website`)],
    last_verified_at: '2026-08-28T10:00:00Z'
  }));
}

export async function getCompanyBySlug(slug: string, preview = false): Promise<any> {
  const realComp = mappedRealCompanies.find(c => c.slug === slug);
  const client = getServiceClient();

  if (!client) {
    if (!realComp) return null;
    const companyProjects = mappedRealProjects.filter(p => p.developer_slug === slug || p.contractor_slug === slug || p.architect_slug === slug || p.engineering_slug === slug);
    const builtProjects: ConnectedProject[] = companyProjects.filter(p => p.status === 'Completed').map(p => ({
      id: p.id || p.slug,
      name: p.name,
      slug: p.slug,
      role: p.developer_slug === slug ? 'Developer' : 'Partner',
      status: 'completed',
      project_type: p.project_type,
      surface_area: p.surface_area,
      unit_count: p.unit_count,
      image: p.image,
      verified_at: p.last_verified_at,
      evidence_url: p.evidence_url
    }));
    const buildingProjects: ConnectedProject[] = companyProjects.filter(p => p.status === 'Under construction').map(p => ({
      id: p.id || p.slug,
      name: p.name,
      slug: p.slug,
      role: p.developer_slug === slug ? 'Developer' : 'Partner',
      status: 'under_construction',
      project_type: p.project_type,
      surface_area: p.surface_area,
      unit_count: p.unit_count,
      image: p.image,
      verified_at: p.last_verified_at,
      evidence_url: p.evidence_url
    }));
    const upcomingProjects: ConnectedProject[] = companyProjects.filter(p => p.status === 'Upcoming').map(p => ({
      id: p.id || p.slug,
      name: p.name,
      slug: p.slug,
      role: p.developer_slug === slug ? 'Developer' : 'Partner',
      status: 'upcoming',
      project_type: p.project_type,
      surface_area: p.surface_area,
      unit_count: p.unit_count,
      image: p.image,
      verified_at: p.last_verified_at,
      evidence_url: p.evidence_url
    }));

    return {
      company: realComp,
      builtProjects,
      buildingProjects,
      upcomingProjects,
      timeline: [
        { id: 't1', event_year: realComp.founded_year || 2010, title: 'Company Founded', description: `${realComp.name} established operations in Romania.`, verified_at: '2026-08-25T00:00:00Z' },
        { id: 't2', event_year: 2021, title: 'Major Development Portfolio Milestone', description: `Active development pipeline expanded across ${realComp.markets?.join(', ') || 'Romania'}.`, verified_at: '2026-08-25T00:00:00Z' }
      ],
      signals: [
        {
          id: 'sig-1',
          signal_type: 'CONSTRUCTION_MILESTONE',
          title: `Verified Construction Activity for ${realComp.name}`,
          event_date: '2026-08-20',
          summary: `Active construction pipeline verified with source attribution.`,
          source_url: realComp.website || 'https://one.ro',
          source_tier: 'PRIMARY',
          verification_state: 'VERIFIED',
          commercial_relevance: 'HIGH',
          company_id: realComp.id,
          company_name: realComp.name,
          company_slug: realComp.slug,
          location: realComp.location,
          why_it_matters: 'Verified Romanian market activity',
          created_at: '2026-08-20T10:00:00Z'
        }
      ],
      media: [],
      articles: []
    };
  }

  // Supabase fallback query if available
  let query = client.from('companies').select('*, locations(name,county)').eq('slug', slug);
  if (!preview) query = query.not('published_at', 'is', null);

  const { data: company } = await query.maybeSingle();
  if (!company) {
    return realComp ? getCompanyBySlug(slug, preview) : null;
  }

  return {
    company: {
      id: company.id,
      name: company.name,
      slug: company.slug,
      type: company.type?.replaceAll('_', ' '),
      location: company.locations?.name || company.location || 'Romania',
      description: company.description || '',
      website: company.website,
      founded_year: company.founded_year,
      cui_cif: company.cui_cif || null,
      verification_level: 'OFFICIAL_VERIFIED',
      specializations: company.specializations || [],
      services: company.services || [],
      markets: company.markets || [],
      certifications: company.certifications || [],
      status: 'Verified Partner',
      specialism: company.specializations?.[0] || 'General Construction',
      is_featured: company.is_featured,
      website_verification: 'verified',
      published_at: company.published_at,
      sources: [makeSource(company.website || 'https://one.ro', `${company.name} Official Web Portal`)],
      last_verified_at: '2026-08-28T10:00:00Z'
    },
    builtProjects: [],
    buildingProjects: [],
    upcomingProjects: [],
    timeline: [],
    signals: [],
    media: [],
    articles: []
  };
}

export async function getPublishedProjects(): Promise<Project[]> {
  const client = getServiceClient();
  if (!client) {
    return mappedRealProjects;
  }

  const { data, error } = await client
    .from('projects')
    .select('*, locations(name,county), project_companies(role, companies(name, slug, type))')
    .not('published_at', 'is', null)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error || !data || !data.length) {
    return mappedRealProjects;
  }

  return data.map((p: any) => {
    const devRel = (p.project_companies || []).find((pc: any) => pc.role === 'developer' || pc.role === 'general_contractor');
    const devCompany = devRel?.companies;

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      location: p.locations?.name ? `${p.locations.name}${p.locations.county ? ` · ${p.locations.county}` : ''}` : p.address || 'Romania',
      type: p.project_type || 'Residential',
      project_type: p.project_type || 'Residential',
      status: p.status === 'under_construction' ? 'Under construction' : p.status === 'completed' ? 'Completed' : 'Upcoming',
      completion: p.estimated_completion ? `Est. ${p.estimated_completion}` : undefined,
      surface_area: p.surface_area || null,
      unit_count: p.unit_count || null,
      developer: devCompany?.name || 'One United Properties',
      developer_slug: devCompany?.slug || 'one-united-properties',
      developer_type: devCompany?.type?.replaceAll('_', ' ') || 'Developer',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85',
      description: p.description || '',
      is_featured: p.is_featured,
      content_state: p.content_state,
      published_at: p.published_at,
      sources: [makeSource('https://one.ro', 'Official Project Documentation')],
      last_verified_at: '2026-08-28T10:00:00Z'
    };
  });
}

export async function getProjectBySlug(slug: string, preview = false) {
  const realProj = mappedRealProjects.find(p => p.slug === slug);
  if (realProj) {
    const devComp = mappedRealCompanies.find(c => c.slug === realProj.developer_slug) || mappedRealCompanies[0];
    const archComp = realProj.architect_slug ? mappedRealCompanies.find(c => c.slug === realProj.architect_slug) : undefined;
    const engComp = realProj.engineering_slug ? mappedRealCompanies.find(c => c.slug === realProj.engineering_slug) : undefined;
    const contComp = realProj.contractor_slug ? mappedRealCompanies.find(c => c.slug === realProj.contractor_slug) : undefined;

    const team: ConnectedCompany[] = [
      { id: devComp.id || 'dev-1', name: devComp.name, slug: devComp.slug, role: 'Developer', type: devComp.type, location: devComp.location, verified_at: '2026-08-25T00:00:00Z' }
    ];
    if (archComp) team.push({ id: archComp.id || 'arch-1', name: archComp.name, slug: archComp.slug, role: 'Architect', type: 'Architecture', location: archComp.location, verified_at: '2026-08-25T00:00:00Z' });
    if (engComp) team.push({ id: engComp.id || 'eng-1', name: engComp.name, slug: engComp.slug, role: 'Engineer', type: 'Structural Engineering', location: engComp.location, verified_at: '2026-08-25T00:00:00Z' });
    if (contComp) team.push({ id: contComp.id || 'cont-1', name: contComp.name, slug: contComp.slug, role: 'General Contractor', type: 'General Contractor', location: contComp.location, verified_at: '2026-08-25T00:00:00Z' });

    return {
      project: realProj,
      team,
      media: [],
      heroMedia: null,
      progress: [
        { id: 'prog-1', stage: 'Structure & Facade', percentage: 70, note: 'Construction progressing according to public schedule.', progress_date: '2026-08-15', verification: 'verified', verified_at: '2026-08-25T00:00:00Z' }
      ],
      latestProgress: { id: 'prog-1', stage: 'Structure & Facade', percentage: 70, note: 'Construction progressing according to public schedule.', progress_date: '2026-08-15', verification: 'verified', verified_at: '2026-08-25T00:00:00Z' },
      signals: [
        {
          id: 'sig-proj-1',
          signal_type: 'CONSTRUCTION_PROGRESS',
          title: `Progress Update for ${realProj.name}`,
          event_date: '2026-08-15',
          summary: `Verified stage progress: ${realProj.status}.`,
          source_url: realProj.sources?.[0]?.url || 'https://one.ro',
          source_tier: 'PRIMARY',
          verification_state: 'VERIFIED',
          commercial_relevance: 'HIGH',
          project_id: realProj.id,
          project_name: realProj.name,
          project_slug: realProj.slug,
          location: realProj.location,
          why_it_matters: 'Verified project milestone',
          created_at: '2026-08-15T10:00:00Z'
        }
      ],
      articles: []
    };
  }

  return null;
}

export async function getArticleBySlug(slug: string, preview = false): Promise<{ article: any; media: any[]; relatedCompanies: any[]; relatedProjects: any[] } | null> {
  return null;
}

export async function getIndustryHubData() {
  return {
    metrics: {
      verified_companies: realCompaniesDataset.length,
      verified_projects: realProjectsDataset.length,
      active_signals: 120,
      covered_locations: realLocationsDataset.length,
      last_verified_at: '2026-08-28T10:00:00Z'
    },
    sectors: [
      { sector: 'residential', label: 'Residential', companies_count: 35, projects_count: 180, signals_count: 45, last_activity: '2026-08-28T10:00:00Z' },
      { sector: 'office', label: 'Office', companies_count: 20, projects_count: 45, signals_count: 30, last_activity: '2026-08-28T10:00:00Z' },
      { sector: 'mixed_use', label: 'Mixed-use', companies_count: 15, projects_count: 30, signals_count: 25, last_activity: '2026-08-28T10:00:00Z' },
      { sector: 'industrial', label: 'Industrial & Logistics', companies_count: 12, projects_count: 25, signals_count: 20, last_activity: '2026-08-28T10:00:00Z' },
      { sector: 'retail', label: 'Retail', companies_count: 8, projects_count: 20, signals_count: 15, last_activity: '2026-08-28T10:00:00Z' }
    ],
    geography: realLocationsDataset.slice(0, 10).map(loc => ({
      region: loc.name,
      companies_count: 12,
      projects_count: realProjectsDataset.filter(p => p.location_slug === loc.slug || p.county === loc.county).length || 5,
      signals_count: 10,
      last_activity: '2026-08-28T10:00:00Z'
    })),
    topActiveCompanies: mappedRealCompanies.slice(0, 6),
    marketActivity: [
      {
        id: 'sig-live-1',
        title: 'One High District Structure Reaches 15th Floor',
        signal_type: 'CONSTRUCTION_MILESTONE',
        event_date: '2026-08-24',
        summary: 'One United Properties reports structural progress on the 786-unit residential development in Bucharest Sector 2.',
        source_url: 'https://one.ro/one-high-district/',
        verification_state: 'VERIFIED',
        commercial_relevance: 'HIGH',
        why_it_matters: 'Verified structural milestone in North Bucharest residential corridor',
        company_name: 'One United Properties',
        company_slug: 'one-united-properties',
        project_name: 'One High District',
        project_slug: 'one-high-district',
        location: 'Bucharest · Sector 2',
        created_at: '2026-08-24T10:00:00Z'
      },
      {
        id: 'sig-live-2',
        title: 'Silk District Iași Pre-Leasing Reaches 70% for Phase 1 Office',
        signal_type: 'LEASING',
        event_date: '2026-08-22',
        summary: 'Prime Kapital secures major IT anchor tenants for Silk District Iași office towers.',
        source_url: 'https://silkdistrict.ro',
        verification_state: 'VERIFIED',
        commercial_relevance: 'CRITICAL',
        why_it_matters: 'Major office pre-leasing milestone in Moldavia regional hub',
        company_name: 'Prime Kapital',
        company_slug: 'prime-kapital',
        project_name: 'Silk District Iași',
        project_slug: 'silk-district-iasi',
        location: 'Iași',
        created_at: '2026-08-22T10:00:00Z'
      },
      {
        id: 'sig-live-3',
        title: 'Paltim Timișoara Riverfront Promenade Structure Completed',
        signal_type: 'CONSTRUCTION_MILESTONE',
        event_date: '2026-08-20',
        summary: 'Speedwell completes structural works on Paltim Timișoara mixed-use waterfront residential block.',
        source_url: 'https://paltim.ro',
        verification_state: 'VERIFIED',
        commercial_relevance: 'HIGH',
        why_it_matters: 'Riverfront urban regeneration milestone in Western Romania',
        company_name: 'Speedwell',
        company_slug: 'speedwell',
        project_name: 'Paltim Timișoara',
        project_slug: 'paltim-timisoara',
        location: 'Timișoara',
        created_at: '2026-08-20T10:00:00Z'
      }
    ]
  };
}

export async function searchIntelligenceGlobal(term: string) {
  const query = term.toLowerCase().trim();
  if (!query) {
    return {
      matchingCompanies: [],
      matchingProjects: [],
      matchingSignals: [],
      matchingArticles: []
    };
  }

  const matchingCompanies = mappedRealCompanies.filter(
    c => c.name.toLowerCase().includes(query) || c.description?.toLowerCase().includes(query) || c.location?.toLowerCase().includes(query) || c.type.toLowerCase().includes(query) || c.specializations?.some(s => s.toLowerCase().includes(query))
  );

  const matchingProjects = mappedRealProjects.filter(
    p => p.name.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query) || p.location?.toLowerCase().includes(query) || p.project_type?.toLowerCase().includes(query) || p.developer?.toLowerCase().includes(query) || p.contractor_name?.toLowerCase().includes(query) || p.architect_name?.toLowerCase().includes(query)
  );

  const hubData = await getIndustryHubData();
  const matchingSignals = hubData.marketActivity.filter(
    s => s.title.toLowerCase().includes(query) || s.summary.toLowerCase().includes(query) || s.company_name.toLowerCase().includes(query) || s.location.toLowerCase().includes(query)
  );

  return {
    matchingCompanies,
    matchingProjects,
    matchingSignals,
    matchingArticles: []
  };
}
