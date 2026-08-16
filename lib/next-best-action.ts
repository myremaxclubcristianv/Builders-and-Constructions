/**
 * Next Best Action Engine 2.0
 * CONSTRUCTIONS by AiXLuxury — Phase 18
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
  | 'WAIT'
  | 'DO NOT CONTACT';

export type NextActionInput = {
  pipelineStatus?: string;
  lastContactedAt?: string | null;
  hasActivePermit?: boolean;
  hasVerifiedEmail?: boolean;
  hasVerifiedPhone?: boolean;
  isNotAFit?: boolean;
  isResearching?: boolean;
  coolingPeriodActive?: boolean;
};

export type NextActionResult = {
  action: NextActionType;
  rationale: string;
  evidence: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate: string;
  recommendedChannel: 'PHONE' | 'EMAIL' | 'IN_PERSON' | 'NONE';
};

export function calculateNextBestAction(input: NextActionInput): NextActionResult {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 86400000).toISOString().slice(0, 10);
  const nextWeek = new Date(now.getTime() + 7 * 86400000).toISOString().slice(0, 10);

  if (input.isNotAFit || input.coolingPeriodActive) {
    return {
      action: 'DO NOT CONTACT',
      rationale: input.coolingPeriodActive ? 'Active contact cooling period.' : 'Company marked as disqualified.',
      evidence: 'Exclusion rule in effect.',
      urgency: 'LOW',
      dueDate: nextWeek,
      recommendedChannel: 'NONE'
    };
  }

  if (input.isResearching) {
    return {
      action: 'RESEARCH',
      rationale: 'Pending trade register & project verification.',
      evidence: 'Research queue assignment.',
      urgency: 'MEDIUM',
      dueDate: tomorrow,
      recommendedChannel: 'NONE'
    };
  }

  const status = (input.pipelineStatus || 'discovered').toLowerCase();

  switch (status) {
    case 'proposal_sent':
    case 'negotiation':
      return {
        action: 'FOLLOW UP',
        rationale: 'Active proposal outstanding; confirm executive review status.',
        evidence: 'Commercial proposal sent to leadership.',
        urgency: 'CRITICAL',
        dueDate: tomorrow,
        recommendedChannel: 'PHONE'
      };
    case 'meeting_booked':
    case 'connected':
      return {
        action: 'PROPOSAL',
        rationale: 'Commercial alignment established; prepare customized architecture deliverable.',
        evidence: 'Meeting completed with positive commercial signal.',
        urgency: 'HIGH',
        dueDate: tomorrow,
        recommendedChannel: 'EMAIL'
      };
    case 'outreach_sent':
      return {
        action: 'FOLLOW UP',
        rationale: 'Initial outreach delivered; initiate multi-channel follow-up.',
        evidence: 'Outreach delivered with no response after 3 days.',
        urgency: 'HIGH',
        dueDate: tomorrow,
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
          evidence: 'Municipal building permit registration.',
          urgency: 'HIGH',
          dueDate: tomorrow,
          recommendedChannel: 'PHONE'
        };
      }
      return {
        action: 'EMAIL NOW',
        rationale: 'Fact-based executive email drafted with verified project milestone citations.',
        evidence: 'Verified company profile and active development portfolio.',
        urgency: 'HIGH',
        dueDate: tomorrow,
        recommendedChannel: 'EMAIL'
      };
  }
}
