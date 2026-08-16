/**
 * Executive Verdict Engine
 * CONSTRUCTIONS by AiXLuxury — Phase 17
 *
 * Produces exactly one unequivocal executive verdict for any company:
 * - CONTACT NOW
 * - RESEARCH REQUIRED
 * - DO NOT CONTACT
 */

export type ExecutiveVerdict = 'CONTACT NOW' | 'RESEARCH REQUIRED' | 'DO NOT CONTACT';

export type ExecutiveVerdictInput = {
  companyVerified: boolean;
  hasVerifiedRelationship: boolean;
  hasVerifiedDecisionMaker: boolean;
  priorityScore: number;
  isNotAFit?: boolean;
  activeCooldown?: boolean;
  isArchived?: boolean;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'DISQUALIFIED';
};

export function evaluateExecutiveVerdict(input: ExecutiveVerdictInput): {
  verdict: ExecutiveVerdict;
  reason: string;
} {
  if (input.isNotAFit || input.activeCooldown || input.isArchived || input.confidence === 'DISQUALIFIED') {
    return {
      verdict: 'DO NOT CONTACT',
      reason: 'Company is disqualified, archived, or in an active contact cooling period.'
    };
  }

  if (!input.companyVerified || !input.hasVerifiedRelationship || !input.hasVerifiedDecisionMaker) {
    return {
      verdict: 'RESEARCH REQUIRED',
      reason: 'Critical evidence missing: company identity, project relationship, or executive contact.'
    };
  }

  if (input.priorityScore >= 70 && (input.confidence === 'HIGH' || input.confidence === 'MEDIUM')) {
    return {
      verdict: 'CONTACT NOW',
      reason: `High priority opportunity (${input.priorityScore}/100) with verified decision maker and active projects.`
    };
  }

  return {
    verdict: 'RESEARCH REQUIRED',
    reason: 'Opportunity score below active threshold; pending further commercial intelligence.'
  };
}
