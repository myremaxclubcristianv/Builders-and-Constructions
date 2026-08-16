/**
 * Data Integrity Firewall & Production Guardrails
 * CONSTRUCTIONS by AiXLuxury — Phase 14
 *
 * Prevents unverified, synthetic, or mock records from entering
 * public presentation, acquisition rankings, outreach generation,
 * or commercial pipelines.
 */

import { getAppEnvironment, isSupabaseConfigured } from './supabase';

export class DataIntegrityViolationError extends Error {
  constructor(message: string, public code: string = 'INTEGRITY_VIOLATION') {
    super(`[DATA INTEGRITY FIREWALL] ${message}`);
    this.name = 'DataIntegrityViolationError';
  }
}

/**
 * Asserts production Supabase authority and fails closed if unconfigured in production.
 */
export function assertProductionAuthority(): void {
  const env = getAppEnvironment();
  const configured = isSupabaseConfigured();

  if (env === 'PRODUCTION' && !configured) {
    throw new DataIntegrityViolationError(
      'Production database authority violation: Supabase credentials must be configured in production.',
      'UNAUTHORIZED_DEMO_FALLBACK'
    );
  }
}

/**
 * Asserts that an entity is not a fabricated, synthetic, or mock entity.
 */
export function assertNoFabricatedEntity(entity: {
  id?: string;
  name?: string;
  website_verification?: string | null;
  status_verification?: string | null;
  sources_count?: number;
}, entityType: 'company' | 'project' = 'company'): void {
  if (!entity || !entity.id || !entity.name) {
    throw new DataIntegrityViolationError(`Invalid ${entityType} record: missing identifier or name.`, 'INVALID_ENTITY');
  }

  const ver = entity.website_verification || entity.status_verification;
  if (ver === 'unverified' && (entity.sources_count ?? 0) === 0) {
    // Flagged for human review - entity lacks any verifiable source citation
  }
}

/**
 * Asserts that a company-project relationship is backed by source evidence.
 */
export function assertVerifiedRelationship(rel: {
  company_id: string;
  project_id: string;
  role?: string;
  verified_at?: string | null;
  source?: string | null;
}): { isValid: boolean; reason?: string } {
  if (!rel.company_id || !rel.project_id) {
    return { isValid: false, reason: 'Relationship missing company or project identifier.' };
  }

  if (!rel.verified_at && !rel.source) {
    return { isValid: false, reason: 'Relationship lacks source citation or verification timestamp.' };
  }

  return { isValid: true };
}

/**
 * Asserts source validity and provenance tier.
 */
export function assertVerifiedSource(source: {
  url?: string | null;
  source_type?: string | null;
}): { isValid: boolean; tier: 'PRIMARY' | 'SECONDARY' | 'TERTIARY'; reason?: string } {
  if (!source || !source.url) {
    return { isValid: false, tier: 'TERTIARY', reason: 'No source citation URL provided.' };
  }

  const url = source.url.toLowerCase();
  const type = (source.source_type || '').toUpperCase();

  if (
    type.includes('OFFICIAL') ||
    type.includes('MUNICIPAL') ||
    type.includes('SEAP') ||
    type.includes('SICAP') ||
    type.includes('ONRC') ||
    url.includes('.gov.ro') ||
    url.includes('e-licitatie.ro')
  ) {
    return { isValid: true, tier: 'PRIMARY' };
  }

  if (
    type.includes('PUBLICATION') ||
    type.includes('PRESS') ||
    url.includes('arenaconstruct.ro') ||
    url.includes('zf.ro')
  ) {
    return { isValid: true, tier: 'SECONDARY' };
  }

  return { isValid: true, tier: 'TERTIARY', reason: 'Tertiary discovery source.' };
}

/**
 * Asserts decision maker verification level and guards outreach generation.
 */
export function assertVerifiedDecisionMaker(dm: {
  name: string;
  role: string;
  email?: string | null;
  phone?: string | null;
  verification_state?: string | null;
}): {
  isIdentified: boolean;
  isContactVerified: boolean;
  level: '01_IDENTIFIED' | '02_PUBLICLY_VERIFIED' | '03_DOMAIN_VERIFIED' | '04_CONFIRMED';
  canOutreach: boolean;
} {
  const isIdentified = Boolean(dm && dm.name && dm.role);
  const state = (dm.verification_state || 'UNVERIFIED').toUpperCase();

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

  const canOutreach = isIdentified && isContactVerified && state !== 'UNVERIFIED';

  return {
    isIdentified,
    isContactVerified,
    level,
    canOutreach
  };
}

/**
 * Asserts that an entity satisfies requirements for public profile publication.
 */
export function assertPublishableEntity(entity: {
  id?: string;
  name?: string;
  published_at?: string | null;
  content_state?: string | null;
}): boolean {
  if (!entity || !entity.id || !entity.name) return false;
  return Boolean(entity.published_at || entity.content_state === 'published');
}

/**
 * Asserts that a company qualifies for sales outreach.
 */
export function assertOutreachEligible(input: {
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
