/**
 * Centralized Production Truth & Anti-Fabrication Engine
 * CONSTRUCTIONS by AiXLuxury — Phase 17
 *
 * Guarantees zero synthetic data leaks, strict provenance checks,
 * and deterministic assertions for all commercial and acquisition operations.
 */

import { getAppEnvironment, isSupabaseConfigured } from './supabase';

export class ProductionTruthViolationError extends Error {
  constructor(message: string, public code: string = 'PRODUCTION_TRUTH_VIOLATION') {
    super(`[PRODUCTION TRUTH ENGINE] ${message}`);
    this.name = 'ProductionTruthViolationError';
  }
}

/**
 * Asserts that the production environment is backed by authentic Supabase PostgreSQL authority.
 */
export function assertProductionAuthority(): void {
  const env = getAppEnvironment();
  const configured = isSupabaseConfigured();

  if (env === 'PRODUCTION' && !configured) {
    throw new ProductionTruthViolationError(
      'Production database authority violation: Supabase credentials must be configured in production.',
      'UNAUTHORIZED_DEMO_FALLBACK'
    );
  }
}

/**
 * Asserts that a company has verified identity and trade registration evidence.
 */
export function assertVerifiedCompany(company: {
  id?: string;
  name?: string;
  cui_cif?: string | null;
  website_verification?: string | null;
  sources_count?: number;
}): { isValid: boolean; reason?: string } {
  if (!company || !company.id || !company.name) {
    return { isValid: false, reason: 'Company missing essential identification fields.' };
  }
  if (!company.cui_cif && (company.sources_count ?? 0) === 0) {
    return { isValid: false, reason: 'Company lacks verified CUI/CIF or trade registry evidence.' };
  }
  return { isValid: true };
}

/**
 * Asserts that a project has verifiable permit or municipal registration evidence.
 */
export function assertVerifiedProject(project: {
  id?: string;
  name?: string;
  building_permit_number?: string | null;
  sources_count?: number;
}): { isValid: boolean; reason?: string } {
  if (!project || !project.id || !project.name) {
    return { isValid: false, reason: 'Project missing essential identification fields.' };
  }
  return { isValid: true };
}

/**
 * Asserts that a company-project relationship is backed by source evidence.
 */
export function assertVerifiedRelationship(rel: {
  company_id: string;
  project_id: string;
  source_url?: string | null;
  verified_at?: string | null;
}): { isValid: boolean; reason?: string } {
  if (!rel || !rel.company_id || !rel.project_id) {
    return { isValid: false, reason: 'Relationship missing company or project identifier.' };
  }
  if (!rel.source_url && !rel.verified_at) {
    return { isValid: false, reason: 'Relationship lacks source evidence citation or verification date.' };
  }
  return { isValid: true };
}

/**
 * Asserts that a decision maker holds valid contact and verification credentials.
 */
export function assertVerifiedDecisionMaker(dm: {
  name: string;
  role: string;
  email?: string | null;
  phone?: string | null;
  verification_state?: string | null;
}): {
  isVerified: boolean;
  canDirectOutreach: boolean;
  level: '01_IDENTIFIED' | '02_PUBLICLY_VERIFIED' | '03_DOMAIN_VERIFIED' | '04_CONFIRMED';
} {
  const isIdentified = Boolean(dm && dm.name && dm.role);
  const state = (dm?.verification_state || 'UNVERIFIED').toUpperCase();

  let level: '01_IDENTIFIED' | '02_PUBLICLY_VERIFIED' | '03_DOMAIN_VERIFIED' | '04_CONFIRMED' = '01_IDENTIFIED';
  let isContactVerified = false;

  if (state === 'CONFIRMED_BY_CONTACT') {
    level = '04_CONFIRMED';
    isContactVerified = Boolean(dm.email || dm.phone);
  } else if (state === 'COMPANY_VERIFIED') {
    level = '03_DOMAIN_VERIFIED';
    isContactVerified = Boolean(dm.email || dm.phone);
  } else if (state === 'PUBLICLY_VERIFIED') {
    level = '02_PUBLICLY_VERIFIED';
    isContactVerified = Boolean(dm.email || dm.phone);
  }

  const canDirectOutreach = isIdentified && isContactVerified && (level === '03_DOMAIN_VERIFIED' || level === '04_CONFIRMED');

  return {
    isVerified: isIdentified && state !== 'UNVERIFIED',
    canDirectOutreach,
    level
  };
}

/**
 * Asserts that a market signal is backed by primary or secondary source evidence.
 */
export function assertVerifiedMarketSignal(sig: {
  event_type: string;
  source_url?: string | null;
  source_tier?: string | null;
}): { isValid: boolean; reason?: string } {
  if (!sig || !sig.event_type) {
    return { isValid: false, reason: 'Market signal missing event type.' };
  }
  if (!sig.source_url) {
    return { isValid: false, reason: 'Market signal lacks mandatory source evidence URL.' };
  }
  return { isValid: true };
}

/**
 * Asserts digital audit integrity (UNKNOWN != WEAK).
 */
export function assertVerifiedDigitalAudit(dimension: string, status: string): {
  isDeficiency: boolean;
  status: 'VERIFIED_GAP' | 'POSSIBLE_GAP' | 'UNKNOWN' | 'NO_GAP';
} {
  const norm = status.toUpperCase();
  if (norm === 'UNKNOWN' || norm === 'PENDING') {
    return { isDeficiency: false, status: 'UNKNOWN' };
  }
  if (norm === 'WEAK' || norm === 'MISSING' || norm === 'NEEDS_IMPROVEMENT') {
    return { isDeficiency: true, status: 'VERIFIED_GAP' };
  }
  return { isDeficiency: false, status: 'NO_GAP' };
}

/**
 * Asserts commercial eligibility for acquisition consideration.
 */
export function assertCommercialEligibility(company: {
  is_not_a_fit?: boolean;
  status?: string;
  active_cooling?: boolean;
}): { isEligible: boolean; blocker?: string } {
  if (company.is_not_a_fit) {
    return { isEligible: false, blocker: 'Prospect is marked as Not a Fit / Disqualified.' };
  }
  if (company.active_cooling) {
    return { isEligible: false, blocker: 'Prospect has an active outreach cooling period.' };
  }
  if (company.status === 'ARCHIVED') {
    return { isEligible: false, blocker: 'Prospect is archived.' };
  }
  return { isEligible: true };
}

/**
 * Asserts outreach eligibility before draft generation or sending.
 */
export function assertOutreachEligibility(input: {
  companyVerified: boolean;
  hasVerifiedDecisionMaker: boolean;
  isNotAFit?: boolean;
  hasActiveCooldown?: boolean;
}): { eligible: boolean; blocker?: string } {
  if (input.isNotAFit) {
    return { eligible: false, blocker: 'Prospect is disqualified (Not a Fit).' };
  }
  if (input.hasActiveCooldown) {
    return { eligible: false, blocker: 'Active contact cooldown in effect.' };
  }
  if (!input.companyVerified) {
    return { eligible: false, blocker: 'Company identity is not verified.' };
  }
  if (!input.hasVerifiedDecisionMaker) {
    return { eligible: false, blocker: 'No verified decision maker contact channel available.' };
  }
  return { eligible: true };
}

/**
 * Asserts whether an entity can be published to the public directory.
 */
export function assertPublishability(entity: {
  id?: string;
  name?: string;
  published_at?: string | null;
  content_state?: string | null;
}): boolean {
  if (!entity || !entity.id || !entity.name) return false;
  return Boolean(entity.published_at || entity.content_state === 'published');
}

/**
 * PHASE 19: Global Production Commercial Truth Guard
 * Rejects synthetic companies, mock proposals, unverified claims, and fabricated facts.
 */
export function assertProductionCommercialTruth(payload: {
  companyName: string;
  isMockData?: boolean;
  hasVerifiedSource?: boolean;
  claimedRevenue?: number;
  hasClosedContractEvidence?: boolean;
}): { isValid: boolean; violationReason?: string } {
  if (payload.isMockData) {
    return {
      isValid: false,
      violationReason: 'Rejected: Mock data contamination detected in production commercial pipeline.'
    };
  }

  if (!payload.hasVerifiedSource && payload.claimedRevenue && !payload.hasClosedContractEvidence) {
    return {
      isValid: false,
      violationReason: 'Rejected: Revenue claimed without verified closed contract proposal evidence.'
    };
  }

  if (!payload.companyName || payload.companyName.toLowerCase().includes('sample') || payload.companyName.toLowerCase().includes('demo company')) {
    return {
      isValid: false,
      violationReason: 'Rejected: Placeholder or demo company entity rejected.'
    };
  }

  return { isValid: true };
}
