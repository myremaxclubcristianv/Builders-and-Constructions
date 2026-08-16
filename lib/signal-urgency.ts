/**
 * Signal Urgency & Temporal Decay Engine
 * CONSTRUCTIONS by AiXLuxury — Phase 19
 *
 * Deterministically evaluates market signal urgency based on event type,
 * age in days, and temporal relevance decay.
 */

export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

export type SignalUrgencyInput = {
  eventType: string;
  eventDate: string;
  hasVerifiedSource?: boolean;
};

export type SignalUrgencyResult = {
  urgency: UrgencyLevel;
  reason: string;
  ageDays: number;
  decayFactor: number;
  isActionable: boolean;
};

export function calculateSignalUrgency(input: SignalUrgencyInput): SignalUrgencyResult {
  const eventTime = new Date(input.eventDate).getTime();
  const now = Date.now();
  const ageDays = Math.max(0, Math.floor((now - eventTime) / (1000 * 60 * 60 * 24)));

  // Calculate temporal decay factor: 1.0 (0-7 days) -> 0.8 (8-30 days) -> 0.5 (31-90 days) -> 0.2 (90+ days)
  let decayFactor = 1.0;
  if (ageDays > 90) decayFactor = 0.2;
  else if (ageDays > 30) decayFactor = 0.5;
  else if (ageDays > 7) decayFactor = 0.8;

  const ev = (input.eventType || '').toUpperCase();

  let baseUrgency: UrgencyLevel = 'MEDIUM';
  let reason = 'Standard market activity.';

  if (ev === 'BUILDING_PERMIT' || ev === 'PERMIT_ISSUED') {
    baseUrgency = ageDays <= 14 ? 'CRITICAL' : ageDays <= 45 ? 'HIGH' : 'MEDIUM';
    reason = 'Municipal building permit issuance initiates active procurement window.';
  } else if (ev === 'TENDER_AWARDED' || ev === 'CONTRACT_AWARDED') {
    baseUrgency = ageDays <= 14 ? 'CRITICAL' : ageDays <= 60 ? 'HIGH' : 'MEDIUM';
    reason = 'Public procurement or general contract award signed.';
  } else if (ev === 'CONSTRUCTION_STARTED' || ev === 'PROJECT_EXPANSION') {
    baseUrgency = ageDays <= 30 ? 'HIGH' : 'MEDIUM';
    reason = 'Physical groundworks or structural phase initiated.';
  } else if (ev === 'STRUCTURAL_PROGRESS' || ev === 'PROJECT_MILESTONE') {
    baseUrgency = 'MEDIUM';
    reason = 'Verified milestone progress inspection completed.';
  } else if (ev === 'DIGITAL_CHANGE' || ev === 'VERIFIED_DIGITAL_GAP') {
    baseUrgency = 'MEDIUM';
    reason = 'Commercial digital presentation deficiency confirmed.';
  } else {
    baseUrgency = ageDays > 60 ? 'LOW' : 'MEDIUM';
    reason = 'General market signal.';
  }

  // Adjust urgency with decay factor
  let finalUrgency: UrgencyLevel = baseUrgency;
  if (decayFactor <= 0.2 && baseUrgency !== 'CRITICAL') {
    finalUrgency = 'LOW';
  }

  return {
    urgency: finalUrgency,
    reason,
    ageDays,
    decayFactor,
    isActionable: finalUrgency !== 'LOW' && (finalUrgency as string) !== 'NONE'
  };
}
