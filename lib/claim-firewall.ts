/**
 * Hard Claim Firewall for Fact-Based Outreach
 * CONSTRUCTIONS by AiXLuxury — Phase 19
 *
 * Enforces that every single factual assertion in an outreach draft
 * maps directly to a verified evidence record in the production database.
 */

export type ClaimMapping = {
  claimText: string;
  evidenceId: string;
  sourceUrl: string;
  verificationStatus: 'VERIFIED' | 'UNVERIFIED' | 'INVALID';
};

export type ClaimValidationResult = {
  isValid: boolean;
  blocked: boolean;
  totalClaims: number;
  verifiedClaims: number;
  unverifiedClaims: string[];
  rejectionReason?: string;
};

export function validateOutreachClaims(
  claims: ClaimMapping[]
): ClaimValidationResult {
  if (!claims || claims.length === 0) {
    return {
      isValid: false,
      blocked: true,
      totalClaims: 0,
      verifiedClaims: 0,
      unverifiedClaims: [],
      rejectionReason: 'No evidence-backed claims provided in outreach draft.'
    };
  }

  const unverified = claims.filter(c => c.verificationStatus !== 'VERIFIED' || !c.sourceUrl || !c.evidenceId);

  if (unverified.length > 0) {
    return {
      isValid: false,
      blocked: true,
      totalClaims: claims.length,
      verifiedClaims: claims.length - unverified.length,
      unverifiedClaims: unverified.map(u => u.claimText),
      rejectionReason: `Outreach contains ${unverified.length} unsupported factual claim(s). Blocked by Claim Firewall.`
    };
  }

  return {
    isValid: true,
    blocked: false,
    totalClaims: claims.length,
    verifiedClaims: claims.length,
    unverifiedClaims: []
  };
}
