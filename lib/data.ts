import { getServiceClient, isSupabaseConfigured, isProductionEnvironment, getAppEnvironment } from '@/lib/supabase';

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

export const demoProjects: Project[] = [
  {
    name: 'Riverside Quarter',
    slug: 'riverside-quarter-demo',
    location: 'Bucharest · Romania',
    type: 'Mixed-use',
    status: 'Under construction',
    completion: 'Completion date to be confirmed',
    developer: 'Featured developer profile',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=85',
    description: 'Sample project profile demonstrating the platform format.'
  },
  {
    name: 'Nord Gateway',
    slug: 'nord-gateway-demo',
    location: 'Pipera · Romania',
    type: 'Office',
    status: 'Upcoming',
    developer: 'Featured developer profile',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85',
    description: 'Sample project profile. Verified details are added by the editorial team.'
  },
  {
    name: 'Atelier Residence',
    slug: 'atelier-residence-demo',
    location: 'Cluj-Napoca · Romania',
    type: 'Residential',
    status: 'Completed',
    developer: 'Featured developer profile',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
    description: 'Sample project profile.'
  }
];

export const demoCompanies: Company[] = [
  {
    name: 'Your Company Profile',
    slug: 'your-company-profile-demo',
    type: 'Construction Company',
    location: 'Bucharest',
    description: 'A premium profile can turn an established body of work into a clearer commercial story.',
    projects: null,
    status: 'Profile opportunity',
    specialism: 'General construction'
  },
  {
    name: 'Developer Profile',
    slug: 'developer-profile-demo',
    type: 'Developer',
    location: 'Romania',
    description: 'Demonstration profile for a developer and its connected project portfolio.',
    projects: null,
    status: 'Profile opportunity',
    specialism: 'Residential & mixed-use'
  },
  {
    name: 'Engineering Profile',
    slug: 'engineering-profile-demo',
    type: 'Engineering',
    location: 'Cluj-Napoca',
    description: 'Demonstration profile for an engineering practice with work worth discovering.',
    projects: null,
    status: 'Profile opportunity',
    specialism: 'Structures & MEP'
  }
];

export const projects = demoProjects;
export const companies = demoCompanies;

function canUseDemoFallback(): boolean {
  if (isProductionEnvironment()) return false;
  if (isSupabaseConfigured()) return false;
  return getAppEnvironment() === 'DEVELOPMENT';
}

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
    return canUseDemoFallback() ? demoCompanies : [];
  }

  const { data, error } = await client
    .from('companies')
    .select('*, locations(name,county)')
    .not('published_at', 'is', null)
    .order('is_featured', { ascending: false })
    .order('name');

  if (error) {
    console.error('Data error fetching published companies:', error.message);
    return [];
  }

  if (!data || !data.length) return [];

  // Fetch connected projects count and latest signals per company
  const companyIds = data.map((c: any) => c.id);
  const [{ data: rels }, { data: signals }] = await Promise.all([
    client.from('project_companies').select('company_id, project_id').in('company_id', companyIds),
    client.from('market_activity_signals').select('company_id, event_date, created_at, title').in('company_id', companyIds).order('created_at', { ascending: false })
  ]);

  const projCountMap = new Map<string, number>();
  (rels || []).forEach((r: any) => {
    projCountMap.set(r.company_id, (projCountMap.get(r.company_id) || 0) + 1);
  });

  const latestSignalMap = new Map<string, { date: string; title: string }>();
  (signals || []).forEach((s: any) => {
    if (!latestSignalMap.has(s.company_id)) {
      latestSignalMap.set(s.company_id, {
        date: s.event_date || s.created_at,
        title: s.title
      });
    }
  });

  return data.map((c: any) => {
    const sigInfo = latestSignalMap.get(c.id);
    const hasProjects = projCountMap.has(c.id);
    const projectCount = hasProjects ? projCountMap.get(c.id)! : (c.projects_count !== undefined && c.projects_count !== null ? c.projects_count : null);
    const freshness = calculateSignalFreshness(sigInfo?.date);

    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      type: c.type?.replaceAll('_', ' '),
      location: c.locations?.name ? `${c.locations.name}${c.locations.county ? ` · ${c.locations.county}` : ''}` : c.location || 'Romania',
      description: c.description || '',
      website: c.website,
      founded_year: c.founded_year,
      cui_cif: c.cui_cif || null,
      verification_level: c.verification_level || (c.website_verification === 'verified' ? 'PUBLICLY_VERIFIED' : 'IDENTIFIED'),
      specializations: c.specializations || [],
      services: c.services || [],
      markets: c.markets || [],
      certifications: c.certifications || [],
      projects: projectCount,
      active_projects_count: projectCount,
      market_signals_count: (signals || []).filter((s: any) => s.company_id === c.id).length || null,
      last_activity_date: sigInfo?.date || c.updated_at || c.created_at || null,
      signal_freshness: freshness,
      latest_signal: sigInfo?.title || null,
      status: c.website_verification === 'verified' ? 'Verified Partner' : 'Registered Profile',
      specialism: c.specializations?.[0] || c.services?.[0] || c.type?.replaceAll('_', ' ') || 'General Construction',
      is_featured: c.is_featured,
      website_verification: c.website_verification,
      content_state: c.content_state,
      published_at: c.published_at
    };
  });
}

export async function getCompanyBySlug(slug: string, preview = false) {
  const client = getServiceClient();
  if (!client) {
    if (!canUseDemoFallback()) return null;
    const found = demoCompanies.find(x => x.slug === slug);
    if (!found) return null;
    return {
      company: found,
      builtProjects: [] as ConnectedProject[],
      buildingProjects: [] as ConnectedProject[],
      upcomingProjects: [] as ConnectedProject[],
      timeline: [],
      signals: [] as MarketSignalItem[],
      media: [] as MediaAsset[],
      articles: [] as EditorialArticle[]
    };
  }

  let query = client.from('companies').select('*, locations(name,county)').eq('slug', slug);
  if (!preview) {
    query = query.not('published_at', 'is', null);
  }

  const { data: company, error } = await query.maybeSingle();
  if (error) {
    console.error('Data error fetching company by slug:', error.message);
    return null;
  }
  if (!company) return null;

  // Fetch connected projects with extended attributes
  const { data: relData, error: relError } = await client
    .from('project_companies')
    .select('role, verified_at, projects(id, name, slug, status, project_type, surface_area, unit_count, published_at)')
    .eq('company_id', company.id);

  if (relError) {
    console.error('Data error fetching company projects:', relError.message);
  }

  const connectedProjects: ConnectedProject[] = (relData || [])
    .filter((r: any) => r.projects && (preview || r.projects.published_at))
    .map((r: any) => ({
      id: r.projects.id,
      name: r.projects.name,
      slug: r.projects.slug,
      role: r.role,
      status: r.projects.status,
      project_type: r.projects.project_type,
      surface_area: r.projects.surface_area || null,
      unit_count: r.projects.unit_count || null,
      verified_at: r.verified_at
    }));

  const builtProjects = connectedProjects.filter(p => p.status === 'completed');
  const buildingProjects = connectedProjects.filter(p => p.status === 'under_construction');
  const upcomingProjects = connectedProjects.filter(p => p.status === 'upcoming');

  // Fetch verified timeline
  let timelineQuery = client.from('company_timeline').select('*').eq('company_id', company.id);
  if (!preview) {
    timelineQuery = timelineQuery.not('verified_at', 'is', null);
  }
  const { data: timeline } = await timelineQuery.order('event_year', { ascending: false });

  // Fetch market signals
  const { data: signalRecords } = await client
    .from('market_activity_signals')
    .select('*, projects(name, slug)')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const signals: MarketSignalItem[] = (signalRecords || []).map((s: any) => ({
    id: s.id,
    signal_type: s.signal_type || 'MARKET_ACTIVITY',
    title: s.title,
    event_date: s.event_date || s.created_at,
    summary: s.summary || s.notes || null,
    source_url: s.source_url || null,
    source_tier: s.source_tier || 'PRIMARY',
    verification_state: s.verification_state || 'VERIFIED',
    commercial_relevance: s.commercial_relevance || 'MEDIUM',
    company_id: company.id,
    company_name: company.name,
    company_slug: company.slug,
    project_id: s.project_id || null,
    project_name: s.projects?.name || null,
    project_slug: s.projects?.slug || null,
    location: company.locations?.name || company.location || 'Romania',
    why_it_matters: s.commercial_relevance === 'CRITICAL' ? 'Critical commercial trigger detected' : 'Verified construction milestone',
    created_at: s.created_at
  }));

  // Fetch media
  const { data: media } = await client
    .from('media')
    .select('*')
    .eq('company_id', company.id)
    .order('is_hero', { ascending: false })
    .order('sort_order', { ascending: true });

  // Fetch related articles
  let articleQuery = client.from('editorial_content').select('*').contains('related_companies', [company.id]);
  if (!preview) {
    articleQuery = articleQuery.not('published_at', 'is', null);
  }
  const { data: articles } = await articleQuery.order('published_at', { ascending: false }).limit(6);

  const lastActDate = signals[0]?.event_date || company.updated_at || company.created_at || null;
  const freshness = calculateSignalFreshness(lastActDate);

  return {
    company: {
      id: company.id,
      name: company.name,
      slug: company.slug,
      type: company.type?.replaceAll('_', ' '),
      location: company.locations?.name ? `${company.locations.name}${company.locations.county ? ` · ${company.locations.county}` : ''}` : company.location || 'Romania',
      description: company.description || '',
      website: company.website,
      founded_year: company.founded_year,
      cui_cif: company.cui_cif || null,
      verification_level: company.verification_level || (company.website_verification === 'verified' ? 'PUBLICLY_VERIFIED' : 'IDENTIFIED'),
      specializations: company.specializations || [],
      services: company.services || [],
      markets: company.markets || [],
      certifications: company.certifications || [],
      status: company.website_verification === 'verified' ? 'Verified Partner' : 'Registered Profile',
      specialism: company.specializations?.[0] || company.services?.[0] || company.type?.replaceAll('_', ' '),
      is_featured: company.is_featured,
      website_verification: company.website_verification,
      content_state: company.content_state,
      published_at: company.published_at,
      active_projects_count: connectedProjects.length || null,
      market_signals_count: signals.length || null,
      last_activity_date: lastActDate,
      signal_freshness: freshness,
      latest_signal: signals[0]?.title || null
    },
    builtProjects,
    buildingProjects,
    upcomingProjects,
    timeline: timeline || [],
    signals,
    media: media || [],
    articles: articles || []
  };
}

export async function getPublishedProjects(): Promise<Project[]> {
  const client = getServiceClient();
  if (!client) {
    return canUseDemoFallback() ? demoProjects : [];
  }

  const { data, error } = await client
    .from('projects')
    .select('*, locations(name,county), project_companies(role, companies(name, slug, type))')
    .not('published_at', 'is', null)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Data error fetching published projects:', error.message);
    return [];
  }

  if (!data || !data.length) return [];

  return data.map((p: any) => {
    const devRel = (p.project_companies || []).find((pc: any) => pc.role === 'developer' || pc.role === 'general_contractor');
    const devCompany = devRel?.companies;

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      location: p.locations?.name ? `${p.locations.name}${p.locations.county ? ` · ${p.locations.county}` : ''}` : p.address || 'Romania',
      type: p.project_type || 'Development',
      project_type: p.project_type,
      status: p.status === 'under_construction' ? 'Under construction' : p.status === 'completed' ? 'Completed' : 'Upcoming',
      completion: p.estimated_completion ? `Est. ${p.estimated_completion}` : undefined,
      surface_area: p.surface_area || null,
      unit_count: p.unit_count || null,
      developer: devCompany?.name || 'Verified Developer',
      developer_slug: devCompany?.slug || undefined,
      developer_type: devCompany?.type?.replaceAll('_', ' ') || undefined,
      image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=85',
      description: p.description || '',
      is_featured: p.is_featured,
      content_state: p.content_state,
      published_at: p.published_at
    };
  });
}

export async function getProjectBySlug(slug: string, preview = false) {
  const client = getServiceClient();
  if (!client) {
    if (!canUseDemoFallback()) return null;
    const found = demoProjects.find(x => x.slug === slug);
    if (!found) return null;
    return {
      project: found,
      team: [] as ConnectedCompany[],
      media: [] as MediaAsset[],
      heroMedia: null as MediaAsset | null,
      progress: [] as ProgressMilestone[],
      latestProgress: null as ProgressMilestone | null,
      signals: [] as MarketSignalItem[],
      articles: [] as EditorialArticle[]
    };
  }

  let query = client.from('projects').select('*, locations(name,county)').eq('slug', slug);
  if (!preview) {
    query = query.not('published_at', 'is', null);
  }

  const { data: project, error } = await query.maybeSingle();
  if (error) {
    console.error('Data error fetching project by slug:', error.message);
    return null;
  }
  if (!project) return null;

  // Fetch project team (connected companies)
  const { data: teamRel, error: teamError } = await client
    .from('project_companies')
    .select('role, verified_at, companies(id, name, slug, type, locations(name), published_at)')
    .eq('project_id', project.id);

  if (teamError) {
    console.error('Data error fetching project team:', teamError.message);
  }

  const team: ConnectedCompany[] = (teamRel || [])
    .filter((r: any) => r.companies && (preview || r.companies.published_at))
    .map((r: any) => ({
      id: r.companies.id,
      name: r.companies.name,
      slug: r.companies.slug,
      role: r.role,
      type: r.companies.type?.replaceAll('_', ' '),
      location: r.companies.locations?.name || undefined,
      verified_at: r.verified_at
    }));

  // Fetch media
  const { data: media } = await client
    .from('media')
    .select('*')
    .eq('project_id', project.id)
    .order('is_hero', { ascending: false })
    .order('sort_order', { ascending: true });

  const heroMedia = (media || []).find((m: any) => m.is_hero) || (media || [])[0] || null;

  // Fetch verified progress updates
  let progressQuery = client.from('project_progress').select('*').eq('project_id', project.id);
  if (!preview) {
    progressQuery = progressQuery.eq('verification', 'verified');
  }
  const { data: progressData } = await progressQuery
    .order('progress_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  const progress: ProgressMilestone[] = (progressData || []).map((p: any) => ({
    id: p.id,
    stage: p.stage,
    percentage: p.percentage,
    note: p.note,
    progress_date: p.progress_date,
    image_url: p.image_url,
    source: p.source,
    verification: p.verification,
    verified_at: p.verified_at
  }));

  const latestProgress = progress[0] || null;

  // Fetch project market signals
  const { data: pSignals } = await client
    .from('market_activity_signals')
    .select('*, companies(name, slug)')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false });

  const signals: MarketSignalItem[] = (pSignals || []).map((s: any) => ({
    id: s.id,
    signal_type: s.signal_type || 'PROJECT_MILESTONE',
    title: s.title,
    event_date: s.event_date || s.created_at,
    summary: s.summary || s.notes || null,
    source_url: s.source_url || null,
    source_tier: s.source_tier || 'PRIMARY',
    verification_state: s.verification_state || 'VERIFIED',
    commercial_relevance: s.commercial_relevance || 'MEDIUM',
    company_id: s.company_id || null,
    company_name: s.companies?.name || null,
    company_slug: s.companies?.slug || null,
    project_id: project.id,
    project_name: project.name,
    project_slug: project.slug,
    location: project.locations?.name || project.address || 'Romania',
    why_it_matters: 'Verified project activity event',
    created_at: s.created_at
  }));

  // Fetch related articles
  let articleQuery = client.from('editorial_content').select('*').contains('related_projects', [project.id]);
  if (!preview) {
    articleQuery = articleQuery.not('published_at', 'is', null);
  }
  const { data: articles } = await articleQuery.order('published_at', { ascending: false }).limit(6);

  const developerEntity = team.find(t => t.role === 'developer' || t.role === 'general_contractor');

  return {
    project: {
      id: project.id,
      name: project.name,
      slug: project.slug,
      location: project.locations?.name ? `${project.locations.name}${project.locations.county ? ` · ${project.locations.county}` : ''}` : project.address || 'Romania',
      address: project.address,
      type: project.project_type || 'Development',
      project_type: project.project_type,
      status: project.status === 'under_construction' ? 'Under construction' : project.status === 'completed' ? 'Completed' : 'Upcoming',
      completion: project.estimated_completion ? `Est. ${project.estimated_completion}` : undefined,
      estimated_investment: project.estimated_investment,
      surface_area: project.surface_area || null,
      unit_count: project.unit_count || null,
      developer: developerEntity?.name || 'Verified Developer',
      developer_slug: developerEntity?.slug || undefined,
      developer_type: developerEntity?.type || undefined,
      image: heroMedia ? heroMedia.storage_key : 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=85',
      description: project.description || '',
      is_featured: project.is_featured,
      content_state: project.content_state,
      published_at: project.published_at,
      latest_signal: signals[0]?.title || latestProgress?.note || null,
      evidence_url: signals[0]?.source_url || latestProgress?.source || null
    },
    team,
    media: media || [],
    heroMedia,
    progress,
    latestProgress,
    signals,
    articles: articles || []
  };
}

export async function getArticleBySlug(slug: string, preview = false) {
  const client = getServiceClient();
  if (!client) return null;

  let query = client.from('editorial_content').select('*').eq('slug', slug);
  if (!preview) {
    query = query.not('published_at', 'is', null);
  }

  const { data: article, error } = await query.maybeSingle();
  if (error || !article) return null;

  let relatedCompanyRecords: any[] = [];
  if (article.related_companies?.length) {
    const { data: cData } = await client.from('companies').select('id, name, slug, type').in('id', article.related_companies);
    relatedCompanyRecords = cData || [];
  }

  let relatedProjectRecords: any[] = [];
  if (article.related_projects?.length) {
    const { data: pData } = await client.from('projects').select('id, name, slug, status').in('id', article.related_projects);
    relatedProjectRecords = pData || [];
  }

  return {
    article,
    relatedCompanies: relatedCompanyRecords,
    relatedProjects: relatedProjectRecords
  };
}

export async function getIndustryHubData() {
  const client = getServiceClient();
  if (!client) {
    return {
      metrics: {
        verified_companies: isProductionEnvironment() ? null : demoCompanies.length,
        verified_projects: isProductionEnvironment() ? null : demoProjects.length,
        active_signals: isProductionEnvironment() ? null : 0,
        covered_locations: isProductionEnvironment() ? null : 3,
        last_verified_at: new Date().toISOString()
      },
      marketActivity: [] as MarketSignalItem[],
      sectors: [] as SectorIntelligence[],
      geography: [] as GeographicRegionIntelligence[],
      topActiveCompanies: [] as Company[]
    };
  }

  const [
    { count: compCount },
    { count: projCount },
    { count: sigCount },
    { count: locCount },
    { data: recentSignals },
    { data: companies },
    { data: projectsData }
  ] = await Promise.all([
    client.from('companies').select('*', { count: 'exact', head: true }).not('published_at', 'is', null),
    client.from('projects').select('*', { count: 'exact', head: true }).not('published_at', 'is', null),
    client.from('market_activity_signals').select('*', { count: 'exact', head: true }),
    client.from('locations').select('*', { count: 'exact', head: true }),
    client.from('market_activity_signals').select('*, companies(name, slug, type), projects(name, slug)').order('created_at', { ascending: false }).limit(12),
    client.from('companies').select('id, name, slug, type, specializations, locations(name, county), published_at').not('published_at', 'is', null),
    client.from('projects').select('id, name, slug, project_type, status, locations(name, county), published_at').not('published_at', 'is', null)
  ]);

  const marketActivity: MarketSignalItem[] = (recentSignals || []).map((s: any) => ({
    id: s.id,
    signal_type: s.signal_type || 'MARKET_SIGNAL',
    title: s.title,
    event_date: s.event_date || s.created_at,
    summary: s.notes || s.summary || 'Verified Romanian construction activity signal.',
    source_url: s.source_url || null,
    source_tier: s.source_tier || 'PRIMARY',
    verification_state: 'VERIFIED',
    commercial_relevance: s.commercial_relevance || 'MEDIUM',
    company_id: s.company_id || null,
    company_name: s.companies?.name || null,
    company_slug: s.companies?.slug || null,
    project_id: s.project_id || null,
    project_name: s.projects?.name || null,
    project_slug: s.projects?.slug || null,
    location: s.companies?.locations?.name || 'Romania',
    why_it_matters: s.commercial_relevance === 'CRITICAL' ? 'High-impact commercial milestone' : 'Verified market progress',
    created_at: s.created_at
  }));

  // Sector breakdown based on production projects and companies
  const sectorList = [
    { sector: 'residential', label: 'Residential Development' },
    { sector: 'office', label: 'Office & Workspace' },
    { sector: 'commercial', label: 'Retail & Commercial' },
    { sector: 'industrial', label: 'Industrial & Manufacturing' },
    { sector: 'logistics', label: 'Logistics & Warehousing' },
    { sector: 'hospitality', label: 'Hospitality & Hotels' },
    { sector: 'mixed_use', label: 'Mixed-Use Developments' },
    { sector: 'infrastructure', label: 'Infrastructure & Public Works' }
  ];

  const sectors: SectorIntelligence[] = sectorList.map(sec => {
    const matchingComp = (companies || []).filter((c: any) =>
      c.type?.toLowerCase().includes(sec.sector) ||
      (c.specializations || []).some((sp: string) => sp.toLowerCase().includes(sec.sector))
    ).length;

    const matchingProj = (projectsData || []).filter((p: any) =>
      p.project_type?.toLowerCase().includes(sec.sector)
    ).length;

    const matchingSig = (recentSignals || []).filter((s: any) =>
      s.signal_type?.toLowerCase().includes(sec.sector) ||
      s.title?.toLowerCase().includes(sec.sector)
    ).length;

    return {
      sector: sec.sector,
      label: sec.label,
      companies_count: matchingComp > 0 ? matchingComp : null,
      projects_count: matchingProj > 0 ? matchingProj : null,
      signals_count: matchingSig > 0 ? matchingSig : null,
      last_activity: matchingSig > 0 ? new Date().toISOString() : null
    };
  });

  // Geographic intelligence breakdown
  const knownRegions = ['Bucharest', 'Ilfov', 'Cluj', 'Timiș', 'Iași', 'Brașov', 'Constanța'];
  const geography: GeographicRegionIntelligence[] = knownRegions.map(reg => {
    const matchingComp = (companies || []).filter((c: any) =>
      c.locations?.name?.toLowerCase().includes(reg.toLowerCase()) ||
      c.locations?.county?.toLowerCase().includes(reg.toLowerCase())
    ).length;

    const matchingProj = (projectsData || []).filter((p: any) =>
      p.locations?.name?.toLowerCase().includes(reg.toLowerCase()) ||
      p.locations?.county?.toLowerCase().includes(reg.toLowerCase())
    ).length;

    const matchingSig = (recentSignals || []).filter((s: any) =>
      s.companies?.locations?.name?.toLowerCase().includes(reg.toLowerCase())
    ).length;

    return {
      region: reg,
      companies_count: matchingComp > 0 ? matchingComp : null,
      projects_count: matchingProj > 0 ? matchingProj : null,
      signals_count: matchingSig > 0 ? matchingSig : null,
      last_activity: (matchingComp > 0 || matchingProj > 0 || matchingSig > 0) ? new Date().toISOString() : null
    };
  });

  const topActiveCompanies = await getPublishedCompanies();

  return {
    metrics: {
      verified_companies: compCount ?? null,
      verified_projects: projCount ?? null,
      active_signals: sigCount ?? null,
      covered_locations: locCount ?? null,
      last_verified_at: recentSignals?.[0]?.created_at || new Date().toISOString()
    },
    marketActivity,
    sectors,
    geography,
    topActiveCompanies: topActiveCompanies.slice(0, 8)
  };
}

export async function searchGlobal(term: string) {
  return searchIntelligenceGlobal(term);
}

export async function searchIntelligenceGlobal(term: string) {
  const client = getServiceClient();
  if (!client) {
    if (!canUseDemoFallback()) return { matchingCompanies: [], matchingProjects: [], matchingSignals: [], matchingArticles: [] };
    const matchingCompanies = term ? demoCompanies.filter(c => `${c.name} ${c.type} ${c.location} ${c.specialism}`.toLowerCase().includes(term.toLowerCase())) : [];
    const matchingProjects = term ? demoProjects.filter(p => `${p.name} ${p.type} ${p.location} ${p.developer}`.toLowerCase().includes(term.toLowerCase())) : [];
    return { matchingCompanies, matchingProjects, matchingSignals: [], matchingArticles: [] };
  }

  const cleanTerm = term.trim();
  if (!cleanTerm) return { matchingCompanies: [], matchingProjects: [], matchingSignals: [], matchingArticles: [] };

  const [{ data: cData }, { data: pData }, { data: sData }, { data: aData }] = await Promise.all([
    client
      .from('companies')
      .select('id, name, slug, type, locations(name, county), description, published_at')
      .not('published_at', 'is', null)
      .ilike('name', `%${cleanTerm}%`)
      .limit(15),
    client
      .from('projects')
      .select('id, name, slug, status, project_type, locations(name, county), published_at')
      .not('published_at', 'is', null)
      .ilike('name', `%${cleanTerm}%`)
      .limit(15),
    client
      .from('market_activity_signals')
      .select('id, title, signal_type, event_date, source_url, notes, companies(name, slug), projects(name, slug)')
      .ilike('title', `%${cleanTerm}%`)
      .limit(10),
    client
      .from('editorial_content')
      .select('id, title, slug, excerpt, category, published_at')
      .not('published_at', 'is', null)
      .ilike('title', `%${cleanTerm}%`)
      .limit(10)
  ]);

  const matchingCompanies = (cData || []).map((c: any) => ({
    name: c.name,
    slug: c.slug,
    type: c.type?.replaceAll('_', ' '),
    location: c.locations?.name || 'Romania',
    description: c.description || ''
  }));

  const matchingProjects = (pData || []).map((p: any) => ({
    name: p.name,
    slug: p.slug,
    status: p.status === 'under_construction' ? 'Under construction' : p.status === 'completed' ? 'Completed' : 'Upcoming',
    type: p.project_type || 'Development',
    location: p.locations?.name || 'Romania'
  }));

  const matchingSignals: MarketSignalItem[] = (sData || []).map((s: any) => ({
    id: s.id,
    signal_type: s.signal_type || 'MARKET_SIGNAL',
    title: s.title,
    event_date: s.event_date,
    summary: s.notes || null,
    source_url: s.source_url || null,
    company_name: s.companies?.name || null,
    company_slug: s.companies?.slug || null,
    project_name: s.projects?.name || null,
    project_slug: s.projects?.slug || null,
    created_at: s.event_date || new Date().toISOString()
  }));

  const matchingArticles = (aData || []).map((a: any) => ({
    title: a.title,
    slug: a.slug,
    category: a.category || 'Editorial',
    excerpt: a.excerpt || ''
  }));

  return { matchingCompanies, matchingProjects, matchingSignals, matchingArticles };
}
