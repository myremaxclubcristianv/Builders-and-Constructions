/**
 * Executive Verdict Engine
 * CONSTRUCTIONS by AiXLuxury — Phase 17
 *
 * Produces exactly one unequivocal executive verdict for any company:
 * - CONTACT NOW
 * - RESEARCH REQUIRED
 * - DO NOT CONTACT
 */

export type ExecutiveVerdict = 'YES' | 'WAIT' | 'NO' | 'COOLING';

export type ExecutiveVerdictInput = {
  companyVerified?: boolean;
  hasVerifiedRelationship?: boolean;
  hasVerifiedDecisionMaker?: boolean;
  contactLevel?: 'LEVEL_01' | 'LEVEL_02' | 'LEVEL_03' | 'LEVEL_04' | string;
  priorityScore?: number;
  isNotAFit?: boolean;
  activeCooldown?: boolean;
  isArchived?: boolean;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW' | 'DISQUALIFIED' | string;
};

export function evaluateExecutiveVerdict(input: ExecutiveVerdictInput): {
  verdict: ExecutiveVerdict;
  reason: string;
} {
  if (input.activeCooldown) {
    return {
      verdict: 'COOLING',
      reason: 'Active contact cooling period prevents immediate outreach.'
    };
  }

  if (input.isNotAFit || input.isArchived || input.confidence === 'DISQUALIFIED') {
    return {
      verdict: 'NO',
      reason: 'Company is disqualified, archived, or not a commercial fit.'
    };
  }

  const isContactReady = Boolean(
    input.hasVerifiedDecisionMaker ||
    input.contactLevel === 'LEVEL_03' ||
    input.contactLevel === 'LEVEL_04'
  );

  if (!input.companyVerified || !input.hasVerifiedRelationship || !isContactReady) {
    return {
      verdict: 'WAIT',
      reason: 'Critical evidence missing: contact verification (Level 03+) or verified project relationship required.'
    };
  }

  if ((input.priorityScore ?? 0) >= 50) {
    return {
      verdict: 'YES',
      reason: `Verified opportunity (${input.priorityScore}/100) with verified decision maker and active project activity.`
    };
  }

  return {
    verdict: 'WAIT',
    reason: 'Opportunity score pending further market activity signals.'
  };
}

