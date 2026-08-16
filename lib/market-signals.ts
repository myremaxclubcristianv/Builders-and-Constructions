/**
 * Market Activity Signals & Dynamic Acquisition Re-evaluation Engine
 * CONSTRUCTIONS by AiXLuxury — Phase 15
 *
 * Re-evaluates opportunity and acquisition priorities deterministically
 * upon ingestion of verified Romanian construction activity signals.
 */

import { getServiceClient } from './supabase';
import { calculateProductionAcquisitionPriority } from './acquisition';

export type MarketSignalType =
  | 'NEW_PROJECT'
  | 'ACTIVE_CONSTRUCTION'
  | 'CONTRACT_AWARD'
  | 'STRUCTURAL_PROGRESS'
  | 'PERMIT'
  | 'COMPLETION'
  | 'EXECUTIVE_APPOINTMENT'
  | 'DIGITAL_CHANGE';

export type MarketSignalInput = {
  id?: string;
  companyId: string;
  projectId?: string | null;
  signalType: MarketSignalType;
  title: string;
  sourceUrl: string;
  sourceTier: 'PRIMARY' | 'SECONDARY' | 'TERTIARY';
  eventDate: string;
  commercialRelevance: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  notes?: string | null;
};

export type SignalProcessingResult = {
  success: boolean;
  signalId: string;
  previousScore?: number;
  newScore: number;
  scoreDelta: number;
  reason: string;
  recalculatedAt: string;
};

/**
 * Formats a deterministic audit reason from a verified signal.
 */
export function generateSignalReason(signal: {
  signalType: MarketSignalType;
  title: string;
  commercialRelevance: string;
}): string {
  const prefix = signal.commercialRelevance === 'CRITICAL' || signal.commercialRelevance === 'HIGH' ? '🔥 HIGH IMPACT' : '📈 ACTIVITY SIGNAL';
  switch (signal.signalType) {
    case 'PERMIT':
      return `${prefix}: Verified building permit issued (${signal.title})`;
    case 'CONTRACT_AWARD':
      return `${prefix}: Verified general contractor appointment / tender award (${signal.title})`;
    case 'STRUCTURAL_PROGRESS':
      return `${prefix}: Verified construction structural milestone achieved (${signal.title})`;
    case 'ACTIVE_CONSTRUCTION':
      return `${prefix}: Verified active construction site underway (${signal.title})`;
    case 'NEW_PROJECT':
      return `${prefix}: Verified new commercial/residential development launched (${signal.title})`;
    case 'COMPLETION':
      return `${prefix}: Verified project delivery / asset completion (${signal.title})`;
    default:
      return `${prefix}: Verified market intelligence event (${signal.title})`;
  }
}

/**
 * Processes a verified market activity signal and triggers deterministic re-evaluation.
 */
export async function processMarketActivitySignal(input: MarketSignalInput): Promise<SignalProcessingResult> {
  const c = getServiceClient();
  const nowIso = new Date().toISOString();
  const reason = generateSignalReason(input);

  if (!input.sourceUrl) {
    throw new Error('Signal Rejected: Verified source URL is required for all market activity signals.');
  }

  if (!c) {
    // Mock execution in test/dev environment
    const previousScore = 65;
    const boost = input.commercialRelevance === 'CRITICAL' ? 20 : input.commercialRelevance === 'HIGH' ? 14 : 6;
    const newScore = Math.min(100, previousScore + boost);

    return {
      success: true,
      signalId: input.id || `signal-${Date.now()}`,
      previousScore,
      newScore,
      scoreDelta: newScore - previousScore,
      reason,
      recalculatedAt: nowIso
    };
  }

  // 1. Insert verified market signal
  const { data: signalRec, error: sigErr } = await c
    .from('market_activity_signals')
    .insert({
      company_id: input.companyId,
      project_id: input.projectId || null,
      signal_type: input.signalType,
      title: input.title,
      source_url: input.sourceUrl,
      source_tier: input.sourceTier,
      event_date: input.eventDate,
      commercial_relevance: input.commercialRelevance,
      notes: input.notes || null,
      created_at: nowIso
    })
    .select('*')
    .single();

  if (sigErr) {
    throw new Error(`Failed to persist market signal: ${sigErr.message}`);
  }

  // 2. Fetch existing score
  const { data: existingScore } = await c
    .from('private_opportunity_scores')
    .select('*')
    .eq('company_id', input.companyId)
    .maybeSingle();

  const prevScoreVal = existingScore?.opportunity_score ?? 50;

  // 3. Recalculate deterministic opportunity score
  const boost = input.commercialRelevance === 'CRITICAL' ? 20 : input.commercialRelevance === 'HIGH' ? 14 : 6;
  const newScoreVal = Math.min(100, prevScoreVal + boost);

  const existingReasons: string[] = existingScore?.score_reasons || [];
  const updatedReasons = [reason, ...existingReasons.filter(r => r !== reason)].slice(0, 8);

  await c.from('private_opportunity_scores').upsert({
    company_id: input.companyId,
    opportunity_score: newScoreVal,
    score_reasons: updatedReasons,
    updated_at: nowIso
  });

  return {
    success: true,
    signalId: signalRec.id,
    previousScore: prevScoreVal,
    newScore: newScoreVal,
    scoreDelta: newScoreVal - prevScoreVal,
    reason,
    recalculatedAt: nowIso
  };
}
