/**
 * Romanian Market Data Normalization & Contact Readiness Engine
 * CONSTRUCTIONS by AiXLuxury — Phase 13
 *
 * Strict, deterministic data normalization for Romanian market entities.
 * Never manufactures digits or assumptions.
 */

/**
 * Normalizes Romanian telephone numbers to canonical international format (+40...)
 * Handles mobile (07xx), landline (02xx / 03xx), and international prefixes without inventing digits.
 */
export function normalizeRomanianPhone(raw: string): {
  normalized: string;
  isValid: boolean;
  type: 'MOBILE' | 'LANDLINE' | 'SPECIAL' | 'UNKNOWN';
} {
  if (!raw) return { normalized: '', isValid: false, type: 'UNKNOWN' };

  // Remove spaces, dots, dashes, parentheses, slashes
  let clean = raw.trim().replace(/[\s\.\-\(\)\/]/g, '');

  // Convert 0040 to +40
  if (clean.startsWith('0040')) {
    clean = '+' + clean.slice(2);
  }

  // Handle local mobile numbers starting with 07... (10 digits)
  if (/^07\d{8}$/.test(clean)) {
    return {
      normalized: '+40' + clean.slice(1),
      isValid: true,
      type: 'MOBILE'
    };
  }

  // Handle local landlines starting with 02... or 03... (10 digits)
  if (/^(02|03)\d{8}$/.test(clean)) {
    return {
      normalized: '+40' + clean.slice(1),
      isValid: true,
      type: 'LANDLINE'
    };
  }

  // Handle already prefixed +40 7... (12 chars: +407xxxxxxxx)
  if (/^\+407\d{8}$/.test(clean)) {
    return {
      normalized: clean,
      isValid: true,
      type: 'MOBILE'
    };
  }

  // Handle already prefixed +40 2... or +40 3... (12 chars)
  if (/^\+40(2|3)\d{8}$/.test(clean)) {
    return {
      normalized: clean,
      isValid: true,
      type: 'LANDLINE'
    };
  }

  // Return clean string as-is without inventing digits
  return {
    normalized: clean,
    isValid: clean.length >= 6 && clean.length <= 15,
    type: 'UNKNOWN'
  };
}

/**
 * Normalizes corporate website domains to canonical form (e.g. "erbasu.ro")
 */
export function normalizeDomain(rawUrl: string): string {
  if (!rawUrl) return '';
  let domain = rawUrl.trim().toLowerCase();

  // Strip protocol
  domain = domain.replace(/^https?:\/\//, '');

  // Strip www.
  domain = domain.replace(/^www\./, '');

  // Strip path, query params, hash, and trailing slash
  domain = domain.split('/')[0].split('?')[0].split('#')[0];

  return domain;
}

/**
 * Normalizes Romanian CUI/CIF tax identifiers (e.g. "RO 1598732" -> "RO 1598732")
 */
export function normalizeCuiCif(raw: string): {
  formatted: string;
  digits: string;
  hasRoPrefix: boolean;
  isValid: boolean;
} {
  if (!raw) return { formatted: '', digits: '', hasRoPrefix: false, isValid: false };

  const clean = raw.trim().toUpperCase().replace(/[\s\.\-]/g, '');
  const hasRoPrefix = clean.startsWith('RO');
  const digits = hasRoPrefix ? clean.slice(2) : clean;

  const isValid = /^\d{2,10}$/.test(digits);
  const formatted = isValid ? (hasRoPrefix ? `RO ${digits}` : digits) : raw.trim();

  return {
    formatted,
    digits,
    hasRoPrefix,
    isValid
  };
}

/**
 * Normalizes Romanian company names by stripping legal forms (SRL, SA, etc.) and diacritics.
 */
export function normalizeCompanyName(name: string): string {
  if (!name) return '';
  let clean = name.trim().toLowerCase();

  // Normalize Romanian diacritics
  clean = clean
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ș/g, 's')
    .replace(/ț/g, 't')
    .replace(/ă/g, 'a')
    .replace(/î/g, 'i')
    .replace(/â/g, 'a');

  // Strip legal suffixes
  clean = clean.replace(/\b(srl|sa|s\.r\.l\.|s\.a\.|s\.c\.|sc|grup|group)\b/gi, '');

  // Strip punctuation and multi-spaces
  clean = clean.replace(/[\.,\-_'"`]/g, ' ').replace(/\s+/g, ' ').trim();

  return clean;
}

export type ContactReadinessInput = {
  isCompanyVerified: boolean;
  projectsCount: number;
  hasDecisionMaker: boolean;
  isDecisionMakerContactVerified: boolean;
  isDigitalAuditCompleted: boolean;
  opportunityScore: number;
  isNotAFit?: boolean;
  hasActiveCooldown?: boolean;
};

export type ContactReadinessResult = {
  score: number; // 0 - 100
  isReady: boolean; // true if >= 70
  tier: 'READY' | 'ALMOST_READY' | 'INCOMPLETE' | 'BLOCKED';
  factors: {
    companyVerification: number; // max 20
    projectEvidence: number; // max 20
    decisionMakerVerification: number; // max 25
    digitalAudit: number; // max 15
    opportunityScore: number; // max 10
    outreachReadiness: number; // max 10
  };
  missingRequirements: string[];
};

/**
 * Deterministically calculates contact readiness and exposes exact missing requirements.
 */
export function calculateContactReadiness(input: ContactReadinessInput): ContactReadinessResult {
  const missingRequirements: string[] = [];

  if (input.isNotAFit) {
    return {
      score: 0,
      isReady: false,
      tier: 'BLOCKED',
      factors: { companyVerification: 0, projectEvidence: 0, decisionMakerVerification: 0, digitalAudit: 0, opportunityScore: 0, outreachReadiness: 0 },
      missingRequirements: ['Company is marked as Not a Fit / Disqualified']
    };
  }

  // 1. Company Verification (max 20 pts)
  let compPts = 0;
  if (input.isCompanyVerified) {
    compPts = 20;
  } else {
    compPts = 8;
    missingRequirements.push('Company identity not fully verified against official registry');
  }

  // 2. Project Evidence (max 20 pts)
  let projPts = 0;
  if (input.projectsCount >= 2) {
    projPts = 20;
  } else if (input.projectsCount === 1) {
    projPts = 12;
    missingRequirements.push('Only 1 project linked (additional portfolio evidence recommended)');
  } else {
    projPts = 0;
    missingRequirements.push('No verified construction projects or developments linked');
  }

  // 3. Decision Maker Verification (max 25 pts)
  let dmPts = 0;
  if (input.isDecisionMakerContactVerified) {
    dmPts = 25;
  } else if (input.hasDecisionMaker) {
    dmPts = 12;
    missingRequirements.push('Executive identified but direct email / phone channel unverified');
  } else {
    dmPts = 0;
    missingRequirements.push('No primary executive decision maker identified');
  }

  // 4. Digital Audit (max 15 pts)
  let auditPts = 0;
  if (input.isDigitalAuditCompleted) {
    auditPts = 15;
  } else {
    auditPts = 5;
    missingRequirements.push('Digital audit incomplete (website/mobile/media evaluation pending)');
  }

  // 5. Opportunity Score (max 10 pts)
  let oppPts = 0;
  if (input.opportunityScore >= 70) {
    oppPts = 10;
  } else if (input.opportunityScore >= 40) {
    oppPts = 6;
  } else {
    oppPts = 2;
  }

  // 6. Outreach Readiness (max 10 pts)
  let outreachPts = 10;
  if (input.hasActiveCooldown) {
    outreachPts = 0;
    missingRequirements.push('Active sales contact cooldown in effect');
  }

  const rawSum = compPts + projPts + dmPts + auditPts + oppPts + outreachPts;
  const score = Math.max(0, Math.min(100, rawSum));
  const isReady = score >= 70 && !input.hasActiveCooldown;

  let tier: 'READY' | 'ALMOST_READY' | 'INCOMPLETE' | 'BLOCKED' = 'INCOMPLETE';
  if (input.hasActiveCooldown) tier = 'BLOCKED';
  else if (score >= 70) tier = 'READY';
  else if (score >= 45) tier = 'ALMOST_READY';

  return {
    score,
    isReady,
    tier,
    factors: {
      companyVerification: compPts,
      projectEvidence: projPts,
      decisionMakerVerification: dmPts,
      digitalAudit: auditPts,
      opportunityScore: oppPts,
      outreachReadiness: outreachPts
    },
    missingRequirements
  };
}
