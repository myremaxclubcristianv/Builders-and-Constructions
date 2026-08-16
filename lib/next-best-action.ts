/**
 * Next Best Action Engine
 * CONSTRUCTIONS by AiXLuxury — Phase 17
 *
 * Deterministically determines the next optimal sales action based on
 * commercial lifecycle state, verified signals, and past touchpoints.
 */

export type NextActionType =
  | 'CALL NOW'
  | 'EMAIL NOW'
  | 'FOLLOW UP'
  | 'MEETING'
  | 'PROPOSAL'
  | 'RESEARCH'
  | 'DO NOT CONTACT';

export type NextActionInput = {
  pipelineStatus?: string;
  lastContactedAt?: string | null;
  hasActivePermit?: boolean;
  hasVerifiedEmail?: boolean;
  hasVerifiedPhone?: boolean;
  isNotAFit?: boolean;
  isResearching?: boolean;
};

export function calculateNextBestAction(input: NextActionInput): {
  action: NextActionType;
  rationale: string;
  recommendedChannel: 'PHONE' | 'EMAIL' | 'IN_PERSON' | 'NONE';
} {
  if (input.isNotAFit) {
    return { action: 'DO NOT CONTACT', rationale: 'Company marked as disqualified.', recommendedChannel: 'NONE' };
  }

  if (input.isResearching) {
    return { action: 'RESEARCH', rationale: 'Pending trade register & project verification.', recommendedChannel: 'NONE' };
  }

  const status = (input.pipelineStatus || 'discovered').toLowerCase();

  switch (status) {
    case 'proposal_sent':
    case 'negotiation':
      return {
        action: 'FOLLOW UP',
        rationale: 'Active proposal outstanding; confirm executive review status.',
        recommendedChannel: 'PHONE'
      };
    case 'meeting_booked':
    case 'connected':
      return {
        action: 'PROPOSAL',
        rationale: 'Commercial alignment established; prepare customized architecture deliverable.',
        recommendedChannel: 'EMAIL'
      };
    case 'outreach_sent':
      return {
        action: 'FOLLOW UP',
        rationale: 'Initial outreach delivered; initiate multi-channel follow-up.',
        recommendedChannel: input.hasVerifiedPhone ? 'PHONE' : 'EMAIL'
      };
    case 'ready':
    case 'qualified':
    case 'discovered':
    default:
      if (input.hasActivePermit && input.hasVerifiedPhone) {
        return {
          action: 'CALL NOW',
          rationale: 'Active construction permit verified; initiate direct executive briefing call.',
          recommendedChannel: 'PHONE'
        };
      }
      return {
        action: 'EMAIL NOW',
        rationale: 'Fact-based executive email drafted with verified project milestone citations.',
        recommendedChannel: 'EMAIL'
      };
  }
}
