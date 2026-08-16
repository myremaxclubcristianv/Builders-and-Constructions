/**
 * Structured Sales Service Catalog for CONSTRUCTIONS by AiXLuxury
 * Deterministic service recommendations based strictly on verified company data and digital gap audits.
 */

export type ServiceKey = 
  | 'WEBSITE'
  | 'BRANDING'
  | 'PROJECT_MARKETING'
  | 'PHOTOGRAPHY'
  | 'VIDEO'
  | 'SEO'
  | 'SOCIAL_MEDIA'
  | 'LEAD_GENERATION'
  | 'PAID_ADVERTISING'
  | 'CONTENT';

export type ServiceDefinition = {
  key: ServiceKey;
  name: string;
  category: 'Digital Experience' | 'Brand Authority' | 'Media Production' | 'Growth';
  priority: 'high' | 'medium' | 'low';
  description: string;
  typicalDeliverables: string[];
  baseEstimatedValue: number; // in EUR
};

export const SALES_SERVICE_CATALOG: Record<string, ServiceDefinition> = {
  WEBSITE: {
    key: 'WEBSITE',
    name: 'High-Performance Architectural Website',
    category: 'Digital Experience',
    priority: 'high',
    description: 'Custom bespoke corporate website showcasing verified projects, team expertise, and engineering capabilities.',
    typicalDeliverables: ['Custom responsive Next.js design', 'Project showcase architecture', 'Lead capture funnel', 'Sub-second load speed'],
    baseEstimatedValue: 8500
  },
  BRANDING: {
    key: 'BRANDING',
    name: 'Institutional Brand Identity',
    category: 'Brand Authority',
    priority: 'medium',
    description: 'Refined visual identity, typography, corporate decks, and stationery tailored for institutional trust.',
    typicalDeliverables: ['Brand guidelines', 'Investor pitch deck templates', 'Typography & color system', 'Corporate signage'],
    baseEstimatedValue: 4500
  },
  PROJECT_MARKETING: {
    key: 'PROJECT_MARKETING',
    name: 'Development & Project Marketing',
    category: 'Growth',
    priority: 'high',
    description: 'End-to-end commercial presentation for landmark active or upcoming developments.',
    typicalDeliverables: ['Dedicated project presentation microsite', 'Brochures & sales collateral', 'Milestone press campaign', 'Targeted investor reach'],
    baseEstimatedValue: 6500
  },
  PHOTOGRAPHY: {
    key: 'PHOTOGRAPHY',
    name: 'Architectural & Site Photography',
    category: 'Media Production',
    priority: 'high',
    description: 'Professional high-resolution architectural photography of completed assets and active jobsites.',
    typicalDeliverables: ['Interior & exterior photoshoot', 'Golden hour & dusk architectural captures', 'Color-graded high-res asset pack'],
    baseEstimatedValue: 3200
  },
  VIDEO: {
    key: 'VIDEO',
    name: 'Cinematic Drone & Progress Video',
    category: 'Media Production',
    priority: 'high',
    description: 'Licensed 4K drone cinematography and construction milestone documentary films.',
    typicalDeliverables: ['Monthly drone construction update', '4K master video showcase', 'Social reels & short-form video'],
    baseEstimatedValue: 4000
  },
  SEO: {
    key: 'SEO',
    name: 'Search Authority & Organic Ranking',
    category: 'Digital Experience',
    priority: 'medium',
    description: 'Targeted search engine optimization to capture institutional procurement and developer queries.',
    typicalDeliverables: ['Keyword strategy for construction niches', 'Schema markup & local SEO', 'Authority backlink acquisition'],
    baseEstimatedValue: 2800
  },
  SOCIAL_MEDIA: {
    key: 'SOCIAL_MEDIA',
    name: 'Executive & LinkedIn Management',
    category: 'Growth',
    priority: 'low',
    description: 'Curated corporate positioning across LinkedIn and architectural channels.',
    typicalDeliverables: ['Executive thought leadership', 'Weekly verified project updates', 'B2B audience growth'],
    baseEstimatedValue: 2400
  },
  LEAD_GENERATION: {
    key: 'LEAD_GENERATION',
    name: 'High-Intent Inbound Lead Funnel',
    category: 'Growth',
    priority: 'high',
    description: 'Streamlined commercial inquiry workflows that route private developers and investors directly.',
    typicalDeliverables: ['High-converting inquiry forms', 'Automated instant notifications', 'CRM lead routing'],
    baseEstimatedValue: 3500
  },
  PAID_ADVERTISING: {
    key: 'PAID_ADVERTISING',
    name: 'Targeted B2B Investor Media',
    category: 'Growth',
    priority: 'medium',
    description: 'Precise ad campaigns targeting decision-makers at real estate development funds and general contractors.',
    typicalDeliverables: ['LinkedIn B2B campaigns', 'Google Search ads for high-intent keywords', 'Campaign ROI reports'],
    baseEstimatedValue: 3000
  },
  CONTENT: {
    key: 'CONTENT',
    name: 'Editorial Spotlight & Case Studies',
    category: 'Brand Authority',
    priority: 'medium',
    description: 'In-depth editorial articles and engineering case studies published on CONSTRUCTIONS by AiXLuxury.',
    typicalDeliverables: ['Featured editorial story', 'Engineering methodology deep-dive', 'Newsletter spotlight'],
    baseEstimatedValue: 2000
  }
};

export const ALL_SERVICES_LIST = Object.values(SALES_SERVICE_CATALOG);

export type RecommendedServiceItem = {
  serviceKey: ServiceKey;
  name: string;
  category: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  estimatedValue: number;
};

export function getRecommendedServiceSuite(params: {
  signals?: string[];
  websiteStatus?: string | null;
  hasWebsite?: boolean;
  activeProjectsCount?: number;
  completedProjectsCount?: number;
  digitalAudit?: Record<string, any>;
}): {
  recommendedServices: RecommendedServiceItem[];
  totalEstimatedValue: number;
  primaryPackageName: string;
} {
  const {
    signals = [],
    websiteStatus,
    hasWebsite = true,
    activeProjectsCount = 0,
    completedProjectsCount = 0,
    digitalAudit = {}
  } = params;

  const recMap = new Map<ServiceKey, RecommendedServiceItem>();

  const signalSet = new Set(signals);

  // 1. Website Checks
  if (websiteStatus === 'no_website' || !hasWebsite || signalSet.has('No website')) {
    recMap.set('WEBSITE', {
      serviceKey: 'WEBSITE',
      name: SALES_SERVICE_CATALOG.WEBSITE.name,
      category: SALES_SERVICE_CATALOG.WEBSITE.category,
      reason: 'No official corporate website found to showcase capabilities and project portfolio.',
      priority: 'high',
      estimatedValue: SALES_SERVICE_CATALOG.WEBSITE.baseEstimatedValue
    });
  } else if (websiteStatus === 'outdated' || websiteStatus === 'weak' || signalSet.has('Outdated website') || signalSet.has('Weak website')) {
    recMap.set('WEBSITE', {
      serviceKey: 'WEBSITE',
      name: SALES_SERVICE_CATALOG.WEBSITE.name,
      category: SALES_SERVICE_CATALOG.WEBSITE.category,
      reason: 'Current website does not meet modern institutional standards or mobile responsiveness.',
      priority: 'high',
      estimatedValue: SALES_SERVICE_CATALOG.WEBSITE.baseEstimatedValue
    });
  }

  // 2. Project Presentation & Marketing
  if (
    signalSet.has('Weak project presentation') ||
    signalSet.has('No project portfolio') ||
    (activeProjectsCount >= 2 && !signalSet.has('Modern project presentation'))
  ) {
    recMap.set('PROJECT_MARKETING', {
      serviceKey: 'PROJECT_MARKETING',
      name: SALES_SERVICE_CATALOG.PROJECT_MARKETING.name,
      category: SALES_SERVICE_CATALOG.PROJECT_MARKETING.category,
      reason: `${activeProjectsCount > 0 ? `${activeProjectsCount} active projects` : 'Active construction'} lack institutional project presentations and investor collateral.`,
      priority: 'high',
      estimatedValue: SALES_SERVICE_CATALOG.PROJECT_MARKETING.baseEstimatedValue
    });
  }

  // 3. Photography & Media
  if (signalSet.has('No project photography') || completedProjectsCount >= 1 || activeProjectsCount >= 1) {
    recMap.set('PHOTOGRAPHY', {
      serviceKey: 'PHOTOGRAPHY',
      name: SALES_SERVICE_CATALOG.PHOTOGRAPHY.name,
      category: SALES_SERVICE_CATALOG.PHOTOGRAPHY.category,
      reason: 'Lacks high-resolution architectural photography of completed assets and active jobsites.',
      priority: activeProjectsCount > 0 ? 'high' : 'medium',
      estimatedValue: SALES_SERVICE_CATALOG.PHOTOGRAPHY.baseEstimatedValue
    });
  }

  // 4. Video & Drone
  if (signalSet.has('No video') || activeProjectsCount >= 2) {
    recMap.set('VIDEO', {
      serviceKey: 'VIDEO',
      name: SALES_SERVICE_CATALOG.VIDEO.name,
      category: SALES_SERVICE_CATALOG.VIDEO.category,
      reason: 'No cinematic drone progress videos or milestone showcases captured for active sites.',
      priority: activeProjectsCount >= 3 ? 'high' : 'medium',
      estimatedValue: SALES_SERVICE_CATALOG.VIDEO.baseEstimatedValue
    });
  }

  // 5. SEO
  if (signalSet.has('No SEO') || signalSet.has('Weak SEO') || digitalAudit.seo_score < 50) {
    recMap.set('SEO', {
      serviceKey: 'SEO',
      name: SALES_SERVICE_CATALOG.SEO.name,
      category: SALES_SERVICE_CATALOG.SEO.category,
      reason: 'Low organic reach on search engines for high-intent construction and procurement terms.',
      priority: 'medium',
      estimatedValue: SALES_SERVICE_CATALOG.SEO.baseEstimatedValue
    });
  }

  // 6. Lead Generation Funnel
  if (signalSet.has('No lead generation') || signalSet.has('No clear CTA') || digitalAudit.has_lead_funnel === false) {
    recMap.set('LEAD_GENERATION', {
      serviceKey: 'LEAD_GENERATION',
      name: SALES_SERVICE_CATALOG.LEAD_GENERATION.name,
      category: SALES_SERVICE_CATALOG.LEAD_GENERATION.category,
      reason: 'Missing structured commercial inquiry funnel to capture developers, architects, and investors.',
      priority: 'high',
      estimatedValue: SALES_SERVICE_CATALOG.LEAD_GENERATION.baseEstimatedValue
    });
  }

  // 7. Branding
  if (signalSet.has('Weak branding')) {
    recMap.set('BRANDING', {
      serviceKey: 'BRANDING',
      name: SALES_SERVICE_CATALOG.BRANDING.name,
      category: SALES_SERVICE_CATALOG.BRANDING.category,
      reason: 'Generic visual identity does not reflect the scale or prestige of real-world construction capabilities.',
      priority: 'medium',
      estimatedValue: SALES_SERVICE_CATALOG.BRANDING.baseEstimatedValue
    });
  }

  // 8. Social Media
  if (signalSet.has('No social presence') || signalSet.has('Weak social presence')) {
    recMap.set('SOCIAL_MEDIA', {
      serviceKey: 'SOCIAL_MEDIA',
      name: SALES_SERVICE_CATALOG.SOCIAL_MEDIA.name,
      category: SALES_SERVICE_CATALOG.SOCIAL_MEDIA.category,
      reason: 'Inactive or non-existent corporate presence across executive channels (LinkedIn).',
      priority: 'low',
      estimatedValue: SALES_SERVICE_CATALOG.SOCIAL_MEDIA.baseEstimatedValue
    });
  }

  // Default fallback if no specific gap signals provided: standard digital foundation
  if (recMap.size === 0) {
    recMap.set('WEBSITE', {
      serviceKey: 'WEBSITE',
      name: SALES_SERVICE_CATALOG.WEBSITE.name,
      category: SALES_SERVICE_CATALOG.WEBSITE.category,
      reason: 'Standard architectural presentation suite.',
      priority: 'high',
      estimatedValue: SALES_SERVICE_CATALOG.WEBSITE.baseEstimatedValue
    });
    recMap.set('PROJECT_MARKETING', {
      serviceKey: 'PROJECT_MARKETING',
      name: SALES_SERVICE_CATALOG.PROJECT_MARKETING.name,
      category: SALES_SERVICE_CATALOG.PROJECT_MARKETING.category,
      reason: 'Dedicated project presentation collateral.',
      priority: 'medium',
      estimatedValue: SALES_SERVICE_CATALOG.PROJECT_MARKETING.baseEstimatedValue
    });
  }

  const recommendedServices = Array.from(recMap.values()).sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  const totalEstimatedValue = recommendedServices.reduce((sum, item) => sum + item.estimatedValue, 0);

  let primaryPackageName = 'Digital Foundation Package';
  if (recommendedServices.some(s => s.serviceKey === 'WEBSITE') && recommendedServices.some(s => s.serviceKey === 'PROJECT_MARKETING') && recommendedServices.some(s => s.serviceKey === 'PHOTOGRAPHY')) {
    primaryPackageName = 'Full Commercial & Visibility Suite';
  } else if (recommendedServices.some(s => s.serviceKey === 'PROJECT_MARKETING')) {
    primaryPackageName = 'Project Visibility & Acquisition Suite';
  }

  return {
    recommendedServices,
    totalEstimatedValue,
    primaryPackageName
  };
}
