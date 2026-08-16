/**
 * Live Market Signal Intelligence & Event Stream Processor
 * CONSTRUCTIONS by AiXLuxury — Phase 17
 *
 * Normalizes, verifies, and processes verified market events from legitimate Romanian public sources.
 */

import { getServiceClient } from './supabase';
import { assertVerifiedMarketSignal } from './production-truth';

export type NormalizedMarketEventType =
  | 'NEW_PROJECT'
  | 'BUILDING_PERMIT'
  | 'TENDER_AWARDED'
  | 'CONTRACT_AWARDED'
  | 'CONSTRUCTION_STARTED'
  | 'STRUCTURAL_PROGRESS'
  | 'PROJECT_MILESTONE'
  | 'PROJECT_EXPANSION'
  | 'NEW_PHASE'
  | 'PROJECT_COMPLETION'
  | 'COMPANY_EXPANSION'
  | 'NEW_EXECUTIVE'
  | 'COMPANY_DIGITAL_CHANGE'
  | 'WEBSITE_LAUNCH'
  | 'WEBSITE_GAP_CONFIRMED'
  | 'MARKET_ACTIVITY_CHANGE';

export type LiveMarketSignalRecord = {
  id?: string;
  eventType: NormalizedMarketEventType;
  eventDate: string;
  companyId: string;
  projectId?: string | null;
  sourceUrl: string;
  sourceTier: 'PRIMARY' | 'SECONDARY' | 'TERTIARY';
  evidence: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  commercialRelevance: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
};

export type SignalIngestionResponse = {
  success: boolean;
  signalId: string;
  eventType: string;
  scoreDelta: number;
  reason: string;
  ingestedAt: string;
};

/**
 * Normalizes and processes a live market event.
 */
export async function ingestLiveMarketSignal(input: LiveMarketSignalRecord): Promise<SignalIngestionResponse> {
  const signalCheck = assertVerifiedMarketSignal({
    event_type: input.eventType,
    source_url: input.sourceUrl,
    source_tier: input.sourceTier
  });

  if (!signalCheck.isValid) {
    throw new Error(`Signal Ingestion Rejected: ${signalCheck.reason}`);
  }

  const c = getServiceClient();
  const nowIso = new Date().toISOString();

  let delta = 6;
  if (input.commercialRelevance === 'CRITICAL') delta = 20;
  else if (input.commercialRelevance === 'HIGH') delta = 14;
  else if (input.commercialRelevance === 'MEDIUM') delta = 8;

  const reason = `[${input.eventType}] ${input.evidence} (Source: ${input.sourceTier})`;

  if (!c) {
    return {
      success: true,
      signalId: input.id || `sig-${Date.now()}`,
      eventType: input.eventType,
      scoreDelta: delta,
      reason,
      ingestedAt: nowIso
    };
  }

  // 1. Ingest market signal event
  const { data: sigRec, error: sigErr } = await c
    .from('market_signal_events')
    .insert({
      event_type: input.eventType,
      company_id: input.companyId,
      project_id: input.projectId || null,
      source_url: input.sourceUrl,
      source_tier: input.sourceTier,
      event_date: input.eventDate,
      verification_state: 'VERIFIED',
      evidence: input.evidence,
      confidence: input.confidence,
      commercial_relevance: input.commercialRelevance,
      created_at: nowIso
    })
    .select('*')
    .single();

  if (sigErr) {
    throw new Error(`Failed to persist market signal event: ${sigErr.message}`);
  }

  // 2. Fetch existing score & update delta
  const { data: scoreRec } = await c
    .from('private_opportunity_scores')
    .select('*')
    .eq('company_id', input.companyId)
    .maybeSingle();

  const prevScore = scoreRec?.opportunity_score ?? 50;
  const newScore = Math.min(100, prevScore + delta);

  await c.from('private_opportunity_scores').upsert({
    company_id: input.companyId,
    opportunity_score: newScore,
    score_reasons: [reason, ...(scoreRec?.score_reasons || [])].slice(0, 8),
    updated_at: nowIso
  });

  // 3. Log priority recalculation event
  await c.from('priority_recalculation_events').insert({
    company_id: input.companyId,
    triggering_signal_id: sigRec.id,
    previous_score: prevScore,
    new_score: newScore,
    score_delta: delta,
    reasons_added: [reason],
    reasons_removed: [],
    created_at: nowIso
  });

  return {
    success: true,
    signalId: sigRec.id,
    eventType: input.eventType,
    scoreDelta: delta,
    reason,
    ingestedAt: nowIso
  };
}
