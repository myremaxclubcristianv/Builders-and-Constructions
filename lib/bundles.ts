/**
 * Structured Commercial Service Bundles for CONSTRUCTIONS by AiXLuxury
 */

export type ServiceBundle = {
  key: string;
  name: string;
  tagline: string;
  services: string[];
  recommendedFor: string;
  defaultEstimatedValue: number;
  deliverables: string[];
};

export const SERVICE_BUNDLES: Record<string, ServiceBundle> = {
  DIGITAL_FOUNDATION: {
    key: 'DIGITAL_FOUNDATION',
    name: 'Digital Foundation Bundle',
    tagline: 'Institutional web presence, brand typography, and search visibility.',
    services: ['WEBSITE', 'BRANDING', 'SEO'],
    recommendedFor: 'Established contractors and engineering firms with outdated or missing websites.',
    defaultEstimatedValue: 4500,
    deliverables: [
      'Bespoke architectural responsive website',
      'Refined visual brand identity & typography system',
      'Search engine optimization for institutional procurement terms'
    ]
  },
  PROJECT_VISIBILITY: {
    key: 'PROJECT_VISIBILITY',
    name: 'Project Visibility & Media Bundle',
    tagline: 'Showcase landmark active and completed developments to institutional investors.',
    services: ['PROJECT_MARKETING', 'PHOTOGRAPHY', 'VIDEO', 'CONTENT'],
    recommendedFor: 'Developers and general contractors with high-profile active job sites.',
    defaultEstimatedValue: 6500,
    deliverables: [
      'Dedicated project microsite and masterplan showcase',
      'High-resolution architectural & site photoshoot',
      '4K licensed drone progress video documentation',
      'Featured editorial article on CONSTRUCTIONS by AiXLuxury'
    ]
  },
  LEAD_ENGINE: {
    key: 'LEAD_ENGINE',
    name: 'Commercial Lead Engine Bundle',
    tagline: 'High-intent private developer & investor inquiry capture funnel.',
    services: ['WEBSITE', 'SEO', 'LEAD_GENERATION', 'PAID_ADVERTISING'],
    recommendedFor: 'Commercial contractors and specialist engineering practices looking for new project tenders.',
    defaultEstimatedValue: 7500,
    deliverables: [
      'Conversion-optimized procurement lead funnel',
      'Direct CRM routing and instant notification workflows',
      'Targeted B2B LinkedIn & Google Search campaigns',
      'Quarterly conversion analytics reports'
    ]
  },
  EXECUTIVE_PRESENCE: {
    key: 'EXECUTIVE_PRESENCE',
    name: 'Executive & Brand Authority Bundle',
    tagline: 'Position corporate leadership at the forefront of Romania’s built environment.',
    services: ['BRANDING', 'WEBSITE', 'SOCIAL_MEDIA', 'CONTENT'],
    recommendedFor: 'Architecture firms and project management practices seeking high-prestige positioning.',
    defaultEstimatedValue: 5000,
    deliverables: [
      'Corporate brand guidelines and deck templates',
      'Executive LinkedIn thought leadership program',
      'Bespoke practice portfolio website',
      'In-depth engineering leadership spotlight story'
    ]
  },
  FULL_COMMERCIAL_SUITE: {
    key: 'FULL_COMMERCIAL_SUITE',
    name: 'Master Market Leadership Suite',
    tagline: 'Comprehensive digital, media, and marketing transformation for industry leaders.',
    services: ['WEBSITE', 'BRANDING', 'PROJECT_MARKETING', 'PHOTOGRAPHY', 'VIDEO', 'SEO', 'LEAD_GENERATION', 'CONTENT'],
    recommendedFor: 'Tier-1 General Contractors and Landmark Real Estate Developers.',
    defaultEstimatedValue: 12000,
    deliverables: [
      'Full bespoke corporate website + 3 dedicated project portals',
      'Complete brand identity overhaul & investor presentation decks',
      'Monthly drone video and professional site photography package',
      'Inbound procurement lead generation engine & SEO dominance',
      'Verified permanent editorial presence on CONSTRUCTIONS platform'
    ]
  }
};

export const ALL_BUNDLES_LIST = Object.values(SERVICE_BUNDLES);
