/**
 * "Why Now?" Deterministic Timing & Trigger Engine
 * CONSTRUCTIONS by AiXLuxury — Phase 18
 *
 * Compiles evidence-backed explanations answering why an acquisition
 * contact must occur today, strictly avoiding speculative or AI-style claims.
 */

export type WhyNowInput = {
  companyName: string;
  activeProjectsCount?: number;
  latestPermit?: { permitNumber: string; projectName: string; issueDate: string } | null;
  latestSignal?: { eventType: string; title: string; eventDate: string } | null;
  verifiedCommercialGap?: string | null;
  decisionMakerName?: string | null;
  decisionMakerRole?: string | null;
  proposalDue?: boolean;
};

export type WhyNowResult = {
  primaryReason: string;
  supportingReasons: string[];
  evidenceCitations: string[];
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
};

export function generateDeterministicWhyNow(input: WhyNowInput): WhyNowResult {
  const supportingReasons: string[] = [];
  const evidenceCitations: string[] = [];
  let primaryReason = '';
  let urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';

  if (input.proposalDue) {
    primaryReason = 'Commercial proposal review window active; executive follow-up due.';
    urgency = 'CRITICAL';
    supportingReasons.push('Proposal pending executive decision.');
  } else if (input.latestPermit) {
    primaryReason = `New building permit ${input.latestPermit.permitNumber} verified for ${input.latestPermit.projectName}.`;
    urgency = 'HIGH';
    supportingReasons.push(`Permit issued on ${input.latestPermit.issueDate}; construction procurement phase active.`);
    evidenceCitations.push(`Building Permit ${input.latestPermit.permitNumber}`);
  } else if (input.latestSignal) {
    primaryReason = `Verified market signal: ${input.latestSignal.title} (${input.latestSignal.eventType}).`;
    urgency = 'HIGH';
    supportingReasons.push(`Event recorded on ${input.latestSignal.eventDate}.`);
    evidenceCitations.push(input.latestSignal.title);
  } else if ((input.activeProjectsCount ?? 0) >= 2) {
    primaryReason = `${input.activeProjectsCount} verified active construction developments underway.`;
    urgency = 'HIGH';
    supportingReasons.push('Substantial on-site structural activity verified.');
  } else {
    primaryReason = 'Verified corporate entity with active market presence in Romania.';
    urgency = 'MEDIUM';
  }

  if (input.verifiedCommercialGap) {
    supportingReasons.push(`Digital audit confirmed deficiency: ${input.verifiedCommercialGap}.`);
  }

  if (input.decisionMakerName && input.decisionMakerRole) {
    supportingReasons.push(`Primary decision maker identified: ${input.decisionMakerName} (${input.decisionMakerRole}).`);
  }

  return {
    primaryReason,
    supportingReasons,
    evidenceCitations,
    urgency
  };
}
