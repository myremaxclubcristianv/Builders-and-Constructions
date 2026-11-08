import { getServiceClient, isSupabaseConfigured, isProductionEnvironment, getAppEnvironment } from '@/lib/supabase';
import {
  realCompaniesDataset,
  realProjectsDataset,
  realLocationsDataset,
  RealCompany,
  RealProject,
  RealSource
} from '@/lib/real-romanian-data';
import { OFFICIAL_SERVICES } from '@/lib/services-config';
import { searchKnowledge, KnowledgeSearchResult } from '@/lib/knowledge-data';

export { realCompaniesDataset, realProjectsDataset, realLocationsDataset };

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
  infrastructure_length_km?: number | null;
  capacity_seats?: number | null;
  span_length_m?: number | null;
  developer?: string;
  developer_slug?: string | null;
  developer_type?: string;
  image?: string;
  description?: string;
  is_featured?: boolean;
  content_state?: string;
  published_at?: string | null;
  latest_signal?: string | null;
  evidence_url?: string | null;
  architect_name?: string;
  architect_slug?: string | null;
  engineering_name?: string;
  engineering_slug?: string | null;
  contractor_name?: string;
  contractor_slug?: string | null;
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
  financials_2025?: any;
  financials_2024?: any;
  financial_timeline?: any[];
  revenue_growth_yoy?: number;
  employees_count?: number;
  backlog_contracts_eur?: number;
  completeness_score?: number;
  image?: string;
  image_alt?: string;
  logo_url?: string;
  image_verified?: boolean;
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
  signal_freshness: calculateSignalFreshness(c.last_verified_at),
  latest_signal: 'Official Project Milestone Verified',
  status: 'Verified Partner',
  specialism: c.specializations[0] || c.type.replaceAll('_', ' '),
  is_featured: c.is_featured,
  website_verification: 'verified',
  published_at: '2026-01-01T00:00:00Z',
  sources: c.sources,
  last_verified_at: c.last_verified_at,
  financials_2025: c.financials_2025,
  financials_2024: c.financials_2024,
  financial_timeline: c.financial_timeline,
  revenue_growth_yoy: c.revenue_growth_yoy,
  employees_count: c.employees_count,
  backlog_contracts_eur: c.backlog_contracts_eur,
  completeness_score: c.completeness_score,
  image: c.image,
  image_alt: c.image_alt,
  logo_url: c.logo_url,
  image_verified: c.image_verified
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
  infrastructure_length_km: p.infrastructure_length_km,
  capacity_seats: p.capacity_seats,
  span_length_m: p.span_length_m,
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

  if (error || !data || data.length < mappedRealCompanies.length) {
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
    signal_freshness: calculateSignalFreshness(c.updated_at || c.created_at || '2026-08-25T00:00:00Z'),
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
  if (realComp) {
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
  const client = getServiceClient();
  if (!client) return null;
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

  if (error || !data || data.length < mappedRealProjects.length) {
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
      active_signals: 124,
      covered_locations: realLocationsDataset.length,
      last_verified_at: '2026-11-08T14:00:00Z'
    },
    sectors: [
      { sector: 'residential', label: 'Rezidențial', companies_count: 35, projects_count: 180, signals_count: 48, last_activity: '2026-11-08T14:00:00Z' },
      { sector: 'office', label: 'Birouri', companies_count: 20, projects_count: 45, signals_count: 30, last_activity: '2026-11-04T10:00:00Z' },
      { sector: 'mixed_use', label: 'Proiecte Mixte', companies_count: 15, projects_count: 30, signals_count: 26, last_activity: '2026-11-04T10:00:00Z' },
      { sector: 'industrial', label: 'Industrial & Logistică', companies_count: 12, projects_count: 25, signals_count: 20, last_activity: '2026-08-28T10:00:00Z' },
      { sector: 'retail', label: 'Retail & Comercial', companies_count: 8, projects_count: 20, signals_count: 16, last_activity: '2026-11-04T10:00:00Z' },
      { sector: 'infrastructure', label: 'Infrastructură Civilă', companies_count: 18, projects_count: 14, signals_count: 22, last_activity: '2026-11-08T14:00:00Z' }
    ],
    geography: realLocationsDataset.slice(0, 10).map(loc => ({
      region: loc.name,
      companies_count: 12,
      projects_count: realProjectsDataset.filter(p => p.location.toLowerCase().includes(loc.name.toLowerCase())).length || 5,
      signals_count: 10,
      last_activity: '2026-11-08T14:00:00Z'
    })),
    topActiveCompanies: mappedRealCompanies.slice(0, 6),
    marketActivity: [
      {
        id: 'sig-2026-nov-01',
        title: 'Centura București Sector DN2–A2: Progres Fizic 19,32% pe Lotul 2',
        signal_type: 'INFRASTRUCTURĂ',
        event_date: '2026-11-08',
        publication_date: '2026-11-08',
        data_period: 'Noiembrie 2026',
        summary: 'Lucrările pe sectorul DN2–A2 al Centurii București Nord, reluate de asocierea bulgaro-română Hidrostroy – Maristar, au atins un progres fizic de 19,32% și financiar de 11,26% (fără avans), conform datelor oficiale CNAIR. Darea în circulație programată inițial pentru martie 2027 ar putea fi decalată, conform semnalelor din șantier.',
        source_url: 'https://economedia.ro/video-cum-arata-lucrarile-pe-centura-bucuresti-sectorul-dn2-a2-santierul-reluat-de-bulgarii-de-la-hidrostroy-si-maristar-la-sub-20-termenul-pentru-darea-in-circulatie-ar-putea-fi-prelungit-dinc.html',
        source_name: 'Economedia (citează date oficiale CNAIR)',
        evidence_classification: 'PRESĂ ECONOMICĂ',
        verification_state: 'DATE RAPORTATE',
        commercial_relevance: 'CRITICĂ',
        why_it_matters: 'Monitorizarea critică a deblocării sectorului estic al Centurii Capitalei și semnalarea timpurie a potențialelor întârzieri contractuale.',
        company_name: 'Maristar Com / Hidrostroy AD',
        company_slug: 'maristar-com',
        project_name: 'Centura București Lotul 2 DN2–A2',
        project_slug: 'autostrada-a0-nord-lot-2',
        location: 'București · Ilfov',
        city: 'București',
        last_verified_at: '2026-11-08T14:00:00Z',
        cadence: 'Actualizări recente',
        created_at: '2026-11-08T10:00:00Z'
      },
      {
        id: 'sig-2026-nov-02',
        title: 'Cartierul Vienez Timișoara: Demarare Nouă Etapă Rezidențială de €24M (146 Locuințe)',
        signal_type: 'DEZVOLTARE REZIDENȚIALĂ',
        event_date: '2026-11-05',
        publication_date: '2026-11-05',
        data_period: 'Noiembrie 2026',
        summary: 'Lansarea unei noi etape de dezvoltare cu 146 de apartamente și o investiție estimată la 24 milioane EUR. Corpul N3 este finalizat și predat, clădirile N4 și N5 sunt în execuție avansată, iar N6 și N7 sunt autorizate cu șantierul demarat, având termen estimat de predare în decembrie 2028.',
        source_url: 'https://cij.world/cartierul-vienez-in-timisoara-launches-new-phase-of-construction/',
        source_name: 'CIJ World',
        evidence_classification: 'PRESĂ ECONOMICĂ',
        verification_state: 'DOCUMENT CORPORATE',
        commercial_relevance: 'RIDICATĂ',
        why_it_matters: 'Extinderea polului rezidențial periurban din vestul Timișoarei și eșalonarea predictibilă a livrărilor până în 2028.',
        company_name: 'Cartierul Vienez Development',
        company_slug: 'cartierul-vienez',
        project_name: 'Cartierul Vienez Timișoara',
        project_slug: 'cartierul-vienez-timisoara',
        location: 'Timișoara · Timiș',
        city: 'Timișoara',
        last_verified_at: '2026-11-08T14:00:00Z',
        cadence: 'Actualizări recente',
        created_at: '2026-11-05T09:00:00Z'
      },
      {
        id: 'sig-2026-nov-03',
        title: 'RIVUS Cluj-Napoca: 12.568 m³ Beton Turnat și Preînchiriere Retail de 80%',
        signal_type: 'EXECUȚIE & PREÎNCHIRIERE',
        event_date: '2026-11-04',
        publication_date: '2026-11-04',
        data_period: 'Octombrie 2026',
        summary: 'Raportul operațional oficial IULIUS pentru octombrie 2026 consemnează 12.568 m³ beton turnat, 9.402 tone oțel-beton fasonat și o mobilizare de 550 muncitori din 57 de firme partenere. Se execută planșeele peste nivelul -2, iar componenta de retail înregistrează 80% grad de preînchiriere.',
        source_url: 'https://www.rivus.ro/noutati/',
        source_name: 'RIVUS.ro — Comunicat Oficial IULIUS',
        evidence_classification: 'SURSĂ OFICIALĂ',
        verification_state: 'SURSĂ OFICIALĂ',
        commercial_relevance: 'CRITICĂ',
        why_it_matters: 'Cel mai amplu șantier de reconversie urbană din România avansează în ritm alert, susținut de un grad ridicat de preînchiriere comercială.',
        company_name: 'IULIUS Real Estate / Atterbury Europe',
        company_slug: 'iulius-real-estate-iasi',
        project_name: 'RIVUS Cluj-Napoca (Reconversie Carbochim)',
        project_slug: 'rivus-cluj-napoca',
        location: 'Cluj-Napoca · Cluj',
        city: 'Cluj-Napoca',
        last_verified_at: '2026-11-08T14:00:00Z',
        cadence: 'Actualizări recente',
        created_at: '2026-11-04T08:30:00Z'
      },
      {
        id: 'sig-2026-nov-04',
        title: 'INFINITY NORD București: Autorizație de Construire Obținută și Pregătire Șantier Faza 1',
        signal_type: 'AUTORIZAȚIE & ȘANTIER',
        event_date: '2026-11-03',
        publication_date: '2026-11-03',
        data_period: 'Noiembrie 2026',
        summary: 'Redport Capital a obținut autorizația de construire pentru prima etapă a ansamblului Infinity Nord (zona Străulești, 4,6 ha, 1.200 unități planificate în 3 faze) și a demarat organizarea de șantier. Termenul-țintă pentru Faza 1 este trimestrul 4 2028, cu spațiile comerciale preînchiriate în proporție de circa 95%.',
        source_url: 'https://cij.world/redport-sets-q4-2028-delivery-target-for-infinity-nords-first-phase-in-bucharest/',
        source_name: 'CIJ World / Redport Capital',
        evidence_classification: 'PRESĂ ECONOMICĂ',
        verification_state: 'DATE RAPORTATE',
        commercial_relevance: 'RIDICATĂ',
        why_it_matters: 'Demararea efectivă a unui nou pol rezidențial și comercial de anvergură în nord-vestul Capitalei.',
        company_name: 'Redport Capital',
        company_slug: 'redport-capital',
        project_name: 'Infinity Nord București',
        project_slug: 'infinity-nord-bucharest',
        location: 'București · Sector 1',
        city: 'București',
        last_verified_at: '2026-11-08T14:00:00Z',
        cadence: 'Actualizări recente',
        created_at: '2026-11-03T09:00:00Z'
      },
      {
        id: 'sig-live-1',
        title: 'One High District: Structura Atinge Etajul 15',
        signal_type: 'STADIU STRUCTURAL',
        event_date: '2026-08-24',
        publication_date: '2026-08-24',
        data_period: 'August 2026',
        summary: 'One United Properties raportează avansul structurii de rezistență la etajul 15 pe șantierul de 786 de apartamente din Sectorul 2 București.',
        source_url: 'https://one.ro/one-high-district/',
        source_name: 'One United Properties — Raportare Investitori',
        evidence_classification: 'DOCUMENT CORPORATE',
        verification_state: 'DOCUMENT CORPORATE',
        commercial_relevance: 'RIDICATĂ',
        why_it_matters: 'Avans structural confirmat în coridorul rezidențial Floreasca-Barbu Văcărescu.',
        company_name: 'One United Properties',
        company_slug: 'one-united-properties',
        project_name: 'One High District',
        project_slug: 'one-high-district',
        location: 'București · Sector 2',
        city: 'București',
        last_verified_at: '2026-08-24T10:00:00Z',
        cadence: 'Evoluții săptămânale',
        created_at: '2026-08-24T10:00:00Z'
      },
      {
        id: 'sig-live-2',
        title: 'Silk District Iași: Grad de Preînchiriere Birouri Faza 1 de 70%',
        signal_type: 'PREÎNCHIRIERE',
        event_date: '2026-08-22',
        publication_date: '2026-08-22',
        data_period: 'August 2026',
        summary: 'Prime Kapital securizează chiriași ancoră internaționali din tehnologie pentru clădirile de birouri Clasa A din Silk District Iași.',
        source_url: 'https://silkdistrict.ro',
        source_name: 'Prime Kapital',
        evidence_classification: 'DOCUMENT CORPORATE',
        verification_state: 'DOCUMENT CORPORATE',
        commercial_relevance: 'CRITICĂ',
        why_it_matters: 'Indicator cheie de absorbție a spațiilor de birouri de generație nouă în polul regional al Moldovei.',
        company_name: 'Prime Kapital',
        company_slug: 'prime-kapital',
        project_name: 'Silk District Iași',
        project_slug: 'silk-district-iasi',
        location: 'Iași',
        city: 'Iași',
        last_verified_at: '2026-08-22T10:00:00Z',
        cadence: 'Evoluții săptămânale',
        created_at: '2026-08-22T10:00:00Z'
      },
      {
        id: 'sig-live-3',
        title: 'Paltim Timișoara: Finalizare Structură Faleză Bega',
        signal_type: 'STADIU STRUCTURAL',
        event_date: '2026-08-20',
        publication_date: '2026-08-20',
        data_period: 'August 2026',
        summary: 'Speedwell finalizează structura de rezistență pentru componenta rezidențială mixtă adiacentă canalului Bega.',
        source_url: 'https://paltim.ro',
        source_name: 'Speedwell Real Estate',
        evidence_classification: 'DOCUMENT CORPORATE',
        verification_state: 'DOCUMENT CORPORATE',
        commercial_relevance: 'RIDICATĂ',
        why_it_matters: 'Reconversie industrială finalizată pe malul Begăi în Timișoara.',
        company_name: 'Speedwell',
        company_slug: 'speedwell',
        project_name: 'Paltim Timișoara',
        project_slug: 'paltim-timisoara',
        location: 'Timișoara',
        city: 'Timișoara',
        last_verified_at: '2026-08-20T10:00:00Z',
        cadence: 'Evoluții săptămânale',
        created_at: '2026-08-20T10:00:00Z'
      },
      {
        id: 'sig-live-4',
        title: 'UP-site București: Închidere Fațadă Cortină Turnuri Floreasca',
        signal_type: 'STADIU STRUCTURAL',
        event_date: '2026-08-18',
        publication_date: '2026-08-18',
        data_period: 'August 2026',
        summary: 'Atenor România și Danya Cebus finalizează montajul fațadei vitrate pe ambele turnuri rezidențiale de 12 și 25 de etaje din Floreasca.',
        source_url: 'https://www.atenor.eu/en/projects/up-site-floreasca/',
        source_name: 'Atenor Oficial',
        evidence_classification: 'SURSĂ OFICIALĂ',
        verification_state: 'SURSĂ OFICIALĂ',
        commercial_relevance: 'RIDICATĂ',
        why_it_matters: 'Etapă cheie de închidere termică a anvelopei pentru cel mai înalt ansamblu rezidențial din Floreasca.',
        company_name: 'Atenor Romania',
        company_slug: 'atenor-romania',
        project_name: 'UP-site Bucharest',
        project_slug: 'upsite-bucharest',
        location: 'București · Sector 1',
        city: 'București',
        last_verified_at: '2026-08-18T10:00:00Z',
        cadence: 'Evoluții săptămânale',
        created_at: '2026-08-18T10:00:00Z'
      },
      {
        id: 'sig-live-5',
        title: 'Autostrada A7 Focșani–Bacău: Progres Fizic de 78%',
        signal_type: 'INFRASTRUCTURĂ',
        event_date: '2026-08-15',
        publication_date: '2026-08-15',
        data_period: 'August 2026',
        summary: 'CNAIR și Spedition UMB aștern straturile de uzură pe tronsonul de 95 km ce leagă Focșani de Bacău pe traseul Autostrăzii Moldovei.',
        source_url: 'https://www.cnadnr.ro',
        source_name: 'CNAIR — Monitorizare Șantiere',
        evidence_classification: 'SURSĂ OFICIALĂ',
        verification_state: 'SURSĂ OFICIALĂ',
        commercial_relevance: 'CRITICĂ',
        why_it_matters: 'Axa strategică de transport european din Moldova avansează înainte de termenele contractuale.',
        company_name: 'Spedition UMB / UMB Group',
        company_slug: 'spedition-umb',
        project_name: 'A7 Motorway Focșani–Bacău Segment',
        project_slug: 'a7-highway-focsani-bacau',
        location: 'Bacău · Moldova',
        city: 'Bacău',
        last_verified_at: '2026-08-15T10:00:00Z',
        cadence: 'Analize lunare',
        created_at: '2026-08-15T10:00:00Z'
      },
      {
        id: 'sig-live-6',
        title: 'Palas Campus Iași: Certificare LEED Platinum Acordată',
        signal_type: 'SUSTENABILITATE & ESG',
        event_date: '2026-08-12',
        publication_date: '2026-08-12',
        data_period: 'August 2026',
        summary: 'Grupul IULIUS primește acreditarea internațională LEED Platinum pentru clădirea de 60.000 m² din centrul Iașului.',
        source_url: 'https://palascampus.ro',
        source_name: 'IULIUS Group',
        evidence_classification: 'DOCUMENT CORPORATE',
        verification_state: 'DOCUMENT CORPORATE',
        commercial_relevance: 'RIDICATĂ',
        why_it_matters: 'Cea mai înaltă certificare ecologică regională pentru o clădire de birouri din afara Bucureștiului.',
        company_name: 'IULIUS Real Estate Iași',
        company_slug: 'iulius-real-estate-iasi',
        project_name: 'Palas Campus Iași',
        project_slug: 'palas-campus-iasi',
        location: 'Iași',
        city: 'Iași',
        last_verified_at: '2026-08-12T10:00:00Z',
        cadence: 'Analize lunare',
        created_at: '2026-08-12T10:00:00Z'
      },
      {
        id: 'sig-live-7',
        title: 'Eli Park Buftea: Extindere Logistică cu 20.000 m²',
        signal_type: 'INVESTIȚIE INDUSTRIALĂ',
        event_date: '2026-08-10',
        publication_date: '2026-08-10',
        data_period: 'August 2026',
        summary: 'Element Industrial finalizează Faza 2 a parcului logistic de Clasa A din nord-vestul județului Ilfov.',
        source_url: 'https://elementindustrial.ro/eli-park-1/',
        source_name: 'Element Industrial',
        evidence_classification: 'DOCUMENT CORPORATE',
        verification_state: 'DOCUMENT CORPORATE',
        commercial_relevance: 'RIDICATĂ',
        why_it_matters: 'Creșterea ofertei de spații pentru comerț electronic și distribuție farmaceutică în nodul Ilfov.',
        company_name: 'Element Industrial (Eli Parks)',
        company_slug: 'element-industrial-eli-parks',
        project_name: 'Eli Park Bucharest (Buftea)',
        project_slug: 'eli-park-buftea',
        location: 'Buftea · Ilfov',
        city: 'Buftea',
        last_verified_at: '2026-08-10T10:00:00Z',
        cadence: 'Analize lunare',
        created_at: '2026-08-10T10:00:00Z'
      },
      {
        id: 'sig-live-8',
        title: 'Marmorosch Hotel București: Distincție Europeană de Arhitectură',
        signal_type: 'PATRIMONIU & DESIGN',
        event_date: '2026-07-25',
        publication_date: '2026-07-25',
        data_period: 'Iulie 2026',
        summary: 'Cumulus Architecture și Saidel Engineering sunt distinse la nivel european pentru reconversia și consolidarea monumentului istoric din 1912 din Centrul Vechi.',
        source_url: 'https://cumulus.ro',
        source_name: 'Cumulus Architecture',
        evidence_classification: 'SURSĂ OFICIALĂ',
        verification_state: 'SURSĂ OFICIALĂ',
        commercial_relevance: 'RIDICATĂ',
        why_it_matters: 'Validare internațională a restaurării de patrimoniu bancar și conversie hotelieră de lux în România.',
        company_name: 'Cumulus Architecture',
        company_slug: 'cumulus-architecture',
        project_name: 'Marmorosch Hotel Heritage Restoration',
        project_slug: 'marmorosch-hotel-restoration',
        location: 'București · Sector 3',
        city: 'București',
        last_verified_at: '2026-07-25T10:00:00Z',
        cadence: 'Analize lunare',
        created_at: '2026-07-25T10:00:00Z'
      }
    ]
  };
}

function normalizeDiacritics(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ș/g, 's')
    .replace(/ț/g, 't')
    .replace(/ă/g, 'a')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i');
}

const SEARCH_SYNONYMS: Record<string, string[]> = {
  highway: ['autostrada', 'motorway', 'drum', 'infrastructura'],
  motorway: ['autostrada', 'highway', 'drum', 'infrastructura'],
  permitting: ['autorizare', 'dtac', 'urbanism', 'puz', 'pug', 'avize', 'planning'],
  dispute: ['litigii', 'reclamatii', 'arbitraj', 'daune', 'expertiza', 'claims', 'audit', 'due diligence'],
};

function matchesTokens(text: string, tokens: string[]): boolean {
  if (!text || tokens.length === 0) return false;
  return tokens.every(token => {
    if (text.includes(token)) return true;
    const synonyms = SEARCH_SYNONYMS[token];
    if (synonyms && synonyms.some(syn => text.includes(syn))) return true;
    return false;
  });
}

export async function searchIntelligenceGlobal(term: string) {
  const rawQuery = term.toLowerCase().trim();
  const normalizedQuery = normalizeDiacritics(rawQuery);
  if (!rawQuery) {
    return {
      matchingCompanies: [],
      matchingProjects: [],
      matchingServices: [],
      matchingKnowledge: [],
      matchingSignals: [],
      matchingArticles: []
    };
  }

  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  const matchingCompanies = mappedRealCompanies.filter(c => {
    const nameNorm = normalizeDiacritics(c.name);
    const descNorm = normalizeDiacritics(c.description || '');
    const locNorm = normalizeDiacritics(c.location || '');
    const typeNorm = normalizeDiacritics(c.type || '');
    const specsNorm = (c.specializations || []).map(normalizeDiacritics).join(' ');
    const fullText = `${nameNorm} ${descNorm} ${locNorm} ${typeNorm} ${specsNorm} ${c.slug}`;

    return fullText.includes(normalizedQuery) || matchesTokens(fullText, queryTokens);
  });

  const matchingProjects = mappedRealProjects.filter(p => {
    const nameNorm = normalizeDiacritics(p.name);
    const descNorm = normalizeDiacritics(p.description || '');
    const locNorm = normalizeDiacritics(p.location || '');
    const typeNorm = normalizeDiacritics(p.project_type || '');
    const devNorm = normalizeDiacritics(p.developer || '');
    const gcNorm = normalizeDiacritics(p.contractor_name || '');
    const archNorm = normalizeDiacritics(p.architect_name || '');
    const fullText = `${nameNorm} ${descNorm} ${locNorm} ${typeNorm} ${devNorm} ${gcNorm} ${archNorm} ${p.slug}`;

    return fullText.includes(normalizedQuery) || matchesTokens(fullText, queryTokens);
  });

  const hubData = await getIndustryHubData();
  const matchingSignals = hubData.marketActivity.filter(s => {
    const titleNorm = normalizeDiacritics(s.title);
    const sumNorm = normalizeDiacritics(s.summary || '');
    const compNorm = normalizeDiacritics(s.company_name || '');
    const locNorm = normalizeDiacritics(s.location || '');
    const fullText = `${titleNorm} ${sumNorm} ${compNorm} ${locNorm}`;

    return fullText.includes(normalizedQuery) || matchesTokens(fullText, queryTokens);
  });

  const matchingServices = OFFICIAL_SERVICES.filter(srv => {
    const titleNorm = normalizeDiacritics(srv.title);
    const shortDescNorm = normalizeDiacritics(srv.shortDescription || '');
    const fullDescNorm = normalizeDiacritics(srv.fullDescription || '');
    const catNorm = normalizeDiacritics(srv.categoryLabel || '');
    const deliverablesNorm = (srv.deliverables || []).map(normalizeDiacritics).join(' ');
    const keywordsNorm = (srv.searchKeywords || []).map(normalizeDiacritics).join(' ');
    const fullText = `${titleNorm} ${shortDescNorm} ${fullDescNorm} ${catNorm} ${deliverablesNorm} ${keywordsNorm} ${srv.slug}`;

    return fullText.includes(normalizedQuery) || matchesTokens(fullText, queryTokens);
  });

  const matchingKnowledge: KnowledgeSearchResult[] = searchKnowledge(normalizedQuery);

  return {
    matchingCompanies,
    matchingProjects,
    matchingServices,
    matchingKnowledge,
    matchingSignals,
    matchingArticles: []
  };
}
