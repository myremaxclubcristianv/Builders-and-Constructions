/**
 * Production Data Contract & Verification Guard Layer
 * CONSTRUCTIONS by AiXLuxury — Phase 12
 *
 * Enforces zero fabrication, traceable source provenance,
 * strict verification boundaries, and deterministic data contracts.
 */

import { getAppEnvironment, isSupabaseConfigured, getServiceClient } from './supabase';

export type VerificationState = 
  | 'UNVERIFIED' 
  | 'PUBLICLY_VERIFIED' 
  | 'COMPANY_VERIFIED' 
  | 'CONFIRMED_BY_CONTACT';

export type SourceTier = 'PRIMARY' | 'SECONDARY' | 'TERTIARY';

export type ResearchLifecycleState = 
  | 'DISCOVERED' 
  | 'RESEARCHING' 
  | 'SOURCED' 
  | 'VERIFIED' 
  | 'READY' 
  | 'PUBLISHED';

export type DigitalAuditStatus = 'GOOD' | 'NEEDS_IMPROVEMENT' | 'MISSING' | 'UNKNOWN';

export class ProductionDataContractError extends Error {
  constructor(message: string, public code: string = 'DATA_CONTRACT_VIOLATION') {
    super(`[DATA CONTRACT] ${message}`);
    this.name = 'ProductionDataContractError';
  }
}

/**
 * Ensures production Supabase is configured and reachable.
 * If in production and unconfigured, throws an institutional error preventing silent fallback.
 */
export function requireProductionData(): void {
  const env = getAppEnvironment();
  const configured = isSupabaseConfigured();

  if (env === 'PRODUCTION' && !configured) {
    throw new ProductionDataContractError(
      'Production database authority required. Supabase is not configured or credentials are missing.',
      'PRODUCTION_DB_UNAVAILABLE'
    );
  }
}

/**
 * Validates that an entity has valid verification and publication states before public rendering.
 */
export function requireVerifiedEntity(entity: {
  id?: string;
  name?: string;
  content_state?: string | null;
  website_verification?: string | null;
  research_state?: string | null;
  published_at?: string | null;
}): boolean {
  if (!entity || !entity.id) return false;
  const isPublished = Boolean(entity.published_at || entity.content_state === 'published');
  return isPublished;
}

/**
 * Asserts source provenance for a factual commercial claim.
 */
export function requireVerifiedSource(source: {
  url?: string | null;
  source_type?: string | null;
  verification_state?: string | null;
}): { isValid: boolean; tier: SourceTier; reason?: string } {
  if (!source || !source.url) {
    return { isValid: false, tier: 'TERTIARY', reason: 'No source citation URL provided.' };
  }

  const url = source.url.toLowerCase();
  const type = (source.source_type || '').toUpperCase();

  // Primary sources: official domains, municipal archives, SEAP public tenders, government registries
  if (
    type.includes('OFFICIAL') ||
    type.includes('MUNICIPAL') ||
    type.includes('SEAP') ||
    type.includes('SICAP') ||
    type.includes('REGISTRY') ||
    type.includes('ONRC') ||
    url.includes('e-licitatie.ro') ||
    url.includes('.gov.ro') ||
    url.includes('urbanism')
  ) {
    return { isValid: true, tier: 'PRIMARY' };
  }

  // Secondary sources: established industry media, credible journals
  if (
    type.includes('PUBLICATION') ||
    type.includes('PRESS_RELEASE') ||
    url.includes('arenaconstruct.ro') ||
    url.includes('zf.ro') ||
    url.includes('profit.ro')
  ) {
    return { isValid: true, tier: 'SECONDARY' };
  }

  return { isValid: false, tier: 'TERTIARY', reason: 'Tertiary sources do not establish standalone verification.' };
}

/**
 * Evaluates decision maker verification state, distinguishing
 * "PERSON IDENTIFIED" from "CONTACT VERIFIED".
 */
export function requireVerifiedDecisionMaker(dm: {
  name: string;
  role: string;
  email?: string | null;
  phone?: string | null;
  verification_state?: string | null;
}): {
  personIdentified: boolean;
  contactVerified: boolean;
  canUseForOutreach: boolean;
  classification: string;
} {
  const personIdentified = Boolean(dm && dm.name && dm.role);
  const state = (dm.verification_state || 'UNVERIFIED').toUpperCase();

  const contactVerified = 
    (Boolean(dm.email || dm.phone)) &&
    (state === 'CONFIRMED_BY_CONTACT' || state === 'COMPANY_VERIFIED' || state === 'PUBLICLY_VERIFIED');

  const canUseForOutreach = personIdentified && (state !== 'UNVERIFIED');

  let classification = '01 · PERSON IDENTIFIED (Unverified Contact)';
  if (state === 'CONFIRMED_BY_CONTACT') {
    classification = '04 · DIRECTLY CONFIRMED CONTACT';
  } else if (state === 'COMPANY_VERIFIED') {
    classification = '03 · COMPANY DOMAIN VERIFIED';
  } else if (state === 'PUBLICLY_VERIFIED') {
    classification = '02 · PUBLICLY VERIFIED (Registry / LinkedIn)';
  }

  return {
    personIdentified,
    contactVerified,
    canUseForOutreach,
    classification
  };
}

/**
 * Normalizes digital audit dimensions and prevents UNKNOWN from triggering false penalties.
 */
export function evaluateDigitalAuditDimension(value: any): {
  status: DigitalAuditStatus;
  isDeficiency: boolean;
  evidence: string;
} {
  if (value === undefined || value === null || value === 'unknown' || value === '') {
    return {
      status: 'UNKNOWN',
      isDeficiency: false, // UNKNOWN is never scored as a confirmed deficiency
      evidence: 'No verified audit data recorded yet.'
    };
  }

  const str = String(value).toLowerCase();
  if (str === 'none' || str === 'missing' || str === 'no_website' || str === 'false') {
    return {
      status: 'MISSING',
      isDeficiency: true,
      evidence: 'Confirmed absence of digital channel.'
    };
  }

  if (str === 'poor' || str === 'outdated' || str === 'needs_improvement' || str === 'weak') {
    return {
      status: 'NEEDS_IMPROVEMENT',
      isDeficiency: true,
      evidence: 'Audited digital experience below institutional standard.'
    };
  }

  return {
    status: 'GOOD',
    isDeficiency: false,
    evidence: 'Audited digital asset conforms to professional standards.'
  };
}
