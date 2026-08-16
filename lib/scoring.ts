/**
 * Scoring & Completeness Engine for CONSTRUCTIONS by AiXLuxury
 * Calculates transparent opportunity scores (0-100) and profile completeness (0-100%).
 */

export const OPPORTUNITY_SIGNAL_WEIGHTS: Record<string, { weight: number; reason: string }> = {
  'No website': { weight: 25, reason: 'No corporate website found (+25)' },
  'Outdated website': { weight: 15, reason: 'Outdated web presence (+15)' },
  'Weak website': { weight: 15, reason: 'Sub-par digital experience (+15)' },
  'No project portfolio': { weight: 15, reason: 'No digital showcase of past work (+15)' },
  'Weak project presentation': { weight: 10, reason: 'Poor project documentation (+10)' },
  'No social presence': { weight: 10, reason: 'Zero social media presence (+10)' },
  'Weak social presence': { weight: 8, reason: 'Inactive social channels (+8)' },
  'No SEO': { weight: 10, reason: 'Zero search engine visibility (+10)' },
  'Weak SEO': { weight: 8, reason: 'Low organic reach (+8)' },
  'No lead generation': { weight: 10, reason: 'No inbound conversion funnel (+10)' },
  'No clear CTA': { weight: 8, reason: 'Missing commercial call to action (+8)' },
  'No project photography': { weight: 10, reason: 'Lacks architectural photography (+10)' },
  'No video': { weight: 8, reason: 'No video / drone assets (+8)' },
  'Weak branding': { weight: 10, reason: 'Generic visual branding (+10)' },
  'Strong portfolio': { weight: 15, reason: 'Extensive real-world construction portfolio (+15)' },
  'High project activity': { weight: 15, reason: 'High active project volume (+15)' }
};

export function calculateOpportunityScore(
  signals: string[] = [],
  activeProjectsCount = 0
): { score: number; level: 'high' | 'medium' | 'low'; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  signals.forEach(sig => {
    const config = OPPORTUNITY_SIGNAL_WEIGHTS[sig];
    if (config) {
      score += config.weight;
      reasons.push(config.reason);
    }
  });

  if (activeProjectsCount >= 3) {
    score += 10;
    reasons.push(`High active pipeline (${activeProjectsCount} projects) (+10)`);
  } else if (activeProjectsCount >= 1) {
    score += 5;
    reasons.push(`Active construction underway (${activeProjectsCount} project) (+5)`);
  }

  // Cap score at 100
  score = Math.min(100, Math.max(0, score));

  let level: 'high' | 'medium' | 'low' = 'low';
  if (score >= 61) level = 'high';
  else if (score >= 31) level = 'medium';

  return { score, level, reasons };
}

export function calculateCompanyCompleteness(company: {
  name?: string | null;
  type?: string | null;
  description?: string | null;
  website?: string | null;
  founded_year?: number | null;
  specializations?: string[] | null;
  services?: string[] | null;
  projectsCount?: number;
  mediaCount?: number;
  hasHero?: boolean;
  timelineCount?: number;
  sourcesCount?: number;
}): { percentage: number; missing: string[] } {
  let points = 0;
  const missing: string[] = [];

  if (company.name) points += 10;
  else missing.push('Company name');

  if (company.type) points += 10;
  else missing.push('Company type classification');

  if (company.description && company.description.length > 30) points += 15;
  else missing.push('Detailed company narrative');

  if (company.website) points += 10;
  else missing.push('Official website link');

  if (company.founded_year) points += 5;
  else missing.push('Founding year');

  if ((company.specializations && company.specializations.length > 0) || (company.services && company.services.length > 0)) {
    points += 10;
  } else {
    missing.push('Specializations and service scope');
  }

  if (company.projectsCount && company.projectsCount > 0) points += 20;
  else missing.push('Connected project associations');

  if (company.mediaCount && company.mediaCount > 0) points += 10;
  else missing.push('Visual media & assets');

  if (company.timelineCount && company.timelineCount > 0) points += 10;
  else missing.push('Verified corporate timeline milestones');

  const percentage = Math.min(100, points);
  return { percentage, missing };
}

export function calculateProjectCompleteness(project: {
  name?: string | null;
  location?: string | null;
  project_type?: string | null;
  status?: string | null;
  description?: string | null;
  surface_area?: number | null;
  estimated_completion?: string | null;
  teamCount?: number;
  hasDeveloper?: boolean;
  hasContractor?: boolean;
  hasArchitect?: boolean;
  mediaCount?: number;
  hasHero?: boolean;
  progressCount?: number;
}): { percentage: number; missing: string[] } {
  let points = 0;
  const missing: string[] = [];

  if (project.name && project.location) points += 15;
  else missing.push('Project name and location');

  if (project.project_type && project.status) points += 15;
  else missing.push('Project classification and status');

  if (project.description && project.description.length > 30) points += 15;
  else missing.push('Editorial project overview');

  if (project.surface_area || project.estimated_completion) points += 10;
  else missing.push('Specifications (area or estimated completion)');

  if (project.hasDeveloper) points += 10;
  else missing.push('Developer attribution');

  if (project.hasContractor || project.hasArchitect) points += 10;
  else missing.push('General contractor or architect');

  if (project.mediaCount && project.mediaCount > 0) points += 15;
  else missing.push('Gallery imagery');

  if (project.progressCount && project.progressCount > 0) points += 10;
  else missing.push('Verified progress milestone');

  const percentage = Math.min(100, points);
  return { percentage, missing };
}

export function calculateDailyPriorityScore(params: {
  opportunityScore: number;
  activeProjectsCount: number;
  nextActionDate?: string | null;
  pipelineStatus?: string | null;
  lastContactedAt?: string | null;
  hasInboundLead?: boolean;
}): { score: number; reasons: string[] } {
  let score = Math.round(params.opportunityScore * 0.4);
  const reasons: string[] = [];

  reasons.push(`Base opportunity potential (${params.opportunityScore}/100)`);

  if (params.activeProjectsCount >= 3) {
    score += 20;
    reasons.push(`High construction activity (${params.activeProjectsCount} active projects) (+20)`);
  } else if (params.activeProjectsCount >= 1) {
    score += 10;
    reasons.push(`Active construction underway (${params.activeProjectsCount} project) (+10)`);
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  if (params.nextActionDate) {
    if (params.nextActionDate === todayStr) {
      score += 25;
      reasons.push('Scheduled follow-up due today (+25)');
    } else if (params.nextActionDate < todayStr) {
      score += 35;
      reasons.push('Overdue follow-up action (+35)');
    }
  }

  if (params.hasInboundLead) {
    score += 20;
    reasons.push('Inbound commercial inquiry received (+20)');
  }

  if (params.pipelineStatus === 'won' || params.pipelineStatus === 'lost' || params.pipelineStatus === 'not_a_fit') {
    score = 0;
    reasons.push(`Inactive pipeline state (${params.pipelineStatus})`);
  }

  score = Math.min(100, Math.max(0, score));
  return { score, reasons };
}

export function normalizeEntityData(raw: Record<string, any>, entityType: 'company' | 'project') {
  const name = (raw.name || raw.company_name || raw.project_name || '').trim();
  const rawUrl = (raw.website || raw.url || '').trim();
  let normalizedUrl = rawUrl;
  if (rawUrl && !rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
    normalizedUrl = `https://${rawUrl}`;
  }

  const rawPhone = (raw.phone || '').trim();
  let normalizedPhone = rawPhone;
  if (rawPhone.startsWith('0') && rawPhone.length === 10) {
    normalizedPhone = `+40 ${rawPhone.slice(1, 4)} ${rawPhone.slice(4, 7)} ${rawPhone.slice(7)}`;
  }

  const city = (raw.city || raw.location || 'Bucharest').trim();
  const normalizedCity = city.charAt(0).toUpperCase() + city.slice(1);

  if (entityType === 'company') {
    const rawType = (raw.type || raw.company_type || 'General Contractor').trim();
    return {
      raw,
      normalized: {
        name,
        type: rawType,
        website: normalizedUrl || null,
        phone: normalizedPhone || null,
        city: normalizedCity,
        country: 'Romania',
        description: (raw.description || '').trim() || null
      }
    };
  } else {
    const rawStatus = (raw.status || 'Under construction').trim();
    const rawType = (raw.type || raw.project_type || 'Mixed-Use').trim();
    return {
      raw,
      normalized: {
        name,
        type: rawType,
        status: rawStatus,
        location: `${normalizedCity}, Romania`,
        city: normalizedCity,
        country: 'Romania',
        description: (raw.description || '').trim() || null
      }
    };
  }
}

export function calculateContactReadiness(params: {
  isCompanyVerified: boolean;
  hasConnectedProjects: boolean;
  hasDecisionMaker: boolean;
  isDecisionMakerConfirmed?: boolean;
  hasDigitalAudit: boolean;
  opportunityScore: number;
  hasOutreachDraft: boolean;
  isNotAFit?: boolean;
  lastContactedAt?: string | null;
  pipelineStatus?: string | null;
}): { percentage: number; isBlocked: boolean; blockReason: string | null; readinessFactors: string[] } {
  const readinessFactors: string[] = [];

  // Check blocking rules
  if (params.isNotAFit) {
    return { percentage: 0, isBlocked: true, blockReason: 'Marked as Not a Fit', readinessFactors: [] };
  }
  if (params.pipelineStatus === 'won') {
    return { percentage: 0, isBlocked: true, blockReason: 'Already Won Client', readinessFactors: [] };
  }
  if (params.pipelineStatus === 'proposal') {
    return { percentage: 0, isBlocked: true, blockReason: 'Active Proposal in Discussion', readinessFactors: [] };
  }

  if (params.lastContactedAt) {
    const daysSinceContact = Math.floor((Date.now() - new Date(params.lastContactedAt).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceContact < 5) {
      return {
        percentage: 30,
        isBlocked: true,
        blockReason: `Recently contacted ${daysSinceContact} day(s) ago (Cooldown active)`,
        readinessFactors: ['Recent outreach in progress']
      };
    }
  }

  let points = 0;

  if (params.isCompanyVerified) {
    points += 20;
    readinessFactors.push('Company identity verified via primary source (+20%)');
  }
  if (params.hasConnectedProjects) {
    points += 20;
    readinessFactors.push('Landmark construction project identified (+20%)');
  }
  if (params.hasDecisionMaker) {
    points += 25;
    readinessFactors.push('Executive decision maker identified (+25%)');
  }
  if (params.hasDigitalAudit) {
    points += 15;
    readinessFactors.push('Digital presence gap audit completed (+15%)');
  }
  if (params.opportunityScore >= 60) {
    points += 10;
    readinessFactors.push('High commercial opportunity potential (+10%)');
  }
  if (params.hasOutreachDraft) {
    points += 10;
    readinessFactors.push('Personalized fact-based outreach message ready (+10%)');
  }

  const percentage = Math.min(100, points);
  return {
    percentage,
    isBlocked: false,
    blockReason: null,
    readinessFactors
  };
}
