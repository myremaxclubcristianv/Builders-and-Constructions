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
  surface_area?: number;
  unit_count?: number;
  developer?: string;
  image?: string;
  description?: string;
  is_featured?: boolean;
  content_state?: string;
  published_at?: string | null;
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
  projects?: number;
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
  image?: string;
  verified_at?: string | null;
};

export type ConnectedCompany = {
  id: string;
  name: string;
  slug: string;
  role: string;
  type: string;
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

// Local development demonstration fallbacks (ONLY used when Supabase is completely unconfigured in DEVELOPMENT)
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
    projects: 0,
    status: 'Profile opportunity',
    specialism: 'General construction'
  },
  {
    name: 'Developer Profile',
    slug: 'developer-profile-demo',
    type: 'Developer',
    location: 'Romania',
    description: 'Demonstration profile for a developer and its connected project portfolio.',
    projects: 0,
    status: 'Profile opportunity',
    specialism: 'Residential & mixed-use'
  },
  {
    name: 'Engineering Profile',
    slug: 'engineering-profile-demo',
    type: 'Engineering',
    location: 'Cluj-Napoca',
    description: 'Demonstration profile for an engineering practice with work worth discovering.',
    projects: 0,
    status: 'Profile opportunity',
    specialism: 'Structures & MEP'
  }
];

export const projects = demoProjects;
export const companies = demoCompanies;

/**
 * Check if demo fallback is permitted.
 * Demo fallback is strictly prohibited in PRODUCTION or when Supabase is configured.
 */
function canUseDemoFallback(): boolean {
  if (isProductionEnvironment()) return false;
  if (isSupabaseConfigured()) return false;
  return getAppEnvironment() === 'DEVELOPMENT';
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

  return data.map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    type: c.type?.replaceAll('_', ' '),
    location: c.locations?.name ? `${c.locations.name}${c.locations.county ? ` · ${c.locations.county}` : ''}` : 'Romania',
    description: c.description || '',
    website: c.website,
    founded_year: c.founded_year,
    specializations: c.specializations,
    services: c.services,
    markets: c.markets,
    certifications: c.certifications,
    status: c.website_verification === 'verified' ? 'Verified Partner' : 'Registered Profile',
    specialism: c.specializations?.[0] || c.services?.[0] || c.type?.replaceAll('_', ' ') || 'General Construction',
    is_featured: c.is_featured,
    website_verification: c.website_verification,
    content_state: c.content_state,
    published_at: c.published_at
  }));
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

  // Fetch connected projects
  const { data: relData, error: relError } = await client
    .from('project_companies')
    .select('role, verified_at, projects(id, name, slug, status, project_type, published_at)')
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

  return {
    company: {
      id: company.id,
      name: company.name,
      slug: company.slug,
      type: company.type?.replaceAll('_', ' '),
      location: company.locations?.name ? `${company.locations.name}${company.locations.county ? ` · ${company.locations.county}` : ''}` : 'Romania',
      description: company.description || '',
      website: company.website,
      founded_year: company.founded_year,
      specializations: company.specializations || [],
      services: company.services || [],
      markets: company.markets || [],
      certifications: company.certifications || [],
      status: company.website_verification === 'verified' ? 'Verified Partner' : 'Registered Profile',
      specialism: company.specializations?.[0] || company.services?.[0] || company.type?.replaceAll('_', ' '),
      is_featured: company.is_featured,
      website_verification: company.website_verification,
      content_state: company.content_state,
      published_at: company.published_at
    },
    builtProjects,
    buildingProjects,
    upcomingProjects,
    timeline: timeline || [],
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
    .select('*, locations(name,county)')
    .not('published_at', 'is', null)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Data error fetching published projects:', error.message);
    return [];
  }

  if (!data || !data.length) return [];

  return data.map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    location: p.locations?.name ? `${p.locations.name}${p.locations.county ? ` · ${p.locations.county}` : ''}` : 'Romania',
    type: p.project_type || 'Development',
    status: p.status === 'under_construction' ? 'Under construction' : p.status === 'completed' ? 'Completed' : 'Upcoming',
    completion: p.estimated_completion ? `Est. ${p.estimated_completion}` : undefined,
    developer: 'Verified Developer',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=85',
    description: p.description || '',
    is_featured: p.is_featured,
    content_state: p.content_state,
    published_at: p.published_at
  }));
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
    .select('role, verified_at, companies(id, name, slug, type, published_at)')
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

  // Fetch related articles
  let articleQuery = client.from('editorial_content').select('*').contains('related_projects', [project.id]);
  if (!preview) {
    articleQuery = articleQuery.not('published_at', 'is', null);
  }
  const { data: articles } = await articleQuery.order('published_at', { ascending: false }).limit(6);

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
      surface_area: project.surface_area,
      unit_count: project.unit_count,
      developer: team.find(t => t.role === 'developer')?.name || 'Featured Developer',
      image: heroMedia ? heroMedia.storage_key : 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=85',
      description: project.description || '',
      is_featured: project.is_featured,
      content_state: project.content_state,
      published_at: project.published_at
    },
    team,
    media: media || [],
    heroMedia,
    progress,
    latestProgress,
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

export async function searchGlobal(term: string) {
  const client = getServiceClient();
  if (!client) {
    if (!canUseDemoFallback()) return { matchingCompanies: [], matchingProjects: [], matchingArticles: [] };
    const matchingCompanies = term ? demoCompanies.filter(c => `${c.name} ${c.type} ${c.location} ${c.specialism}`.toLowerCase().includes(term.toLowerCase())) : [];
    const matchingProjects = term ? demoProjects.filter(p => `${p.name} ${p.type} ${p.location} ${p.developer}`.toLowerCase().includes(term.toLowerCase())) : [];
    return { matchingCompanies, matchingProjects, matchingArticles: [] };
  }

  const cleanTerm = term.trim();
  if (!cleanTerm) return { matchingCompanies: [], matchingProjects: [], matchingArticles: [] };

  const [{ data: cData }, { data: pData }, { data: aData }] = await Promise.all([
    client
      .from('companies')
      .select('id, name, slug, type, locations(name, county), description')
      .not('published_at', 'is', null)
      .ilike('name', `%${cleanTerm}%`)
      .limit(15),
    client
      .from('projects')
      .select('id, name, slug, status, project_type, locations(name, county)')
      .not('published_at', 'is', null)
      .ilike('name', `%${cleanTerm}%`)
      .limit(15),
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

  const matchingArticles = (aData || []).map((a: any) => ({
    title: a.title,
    slug: a.slug,
    category: a.category || 'Editorial',
    excerpt: a.excerpt || ''
  }));

  return { matchingCompanies, matchingProjects, matchingArticles };
}
