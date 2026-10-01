import { getServiceClient } from './supabase';
import { processRawSourcePayload, RawObservationInput } from './source-adapters';
import { normalizeCompanyName, normalizeCuiCif, normalizeDomain } from './normalization';
import { resolveCompanyEntity, CanonicalEntity } from './entity-resolution';
import { ingestAndProcessContinuousEvent } from './continuous-intelligence';
import { ingestLiveMarketSignal } from './live-intelligence';
import { generateDeterministicWhyNow } from './why-now';
import { calculateOpportunityScore } from './scoring';
import { sendTelegramNotification } from './telegram';
import { realCompaniesDataset } from './real-romanian-data';

export type PipelineExecutionInput = RawObservationInput & {
  triggerType?: 'MANUAL' | 'API' | 'SCHEDULED' | 'WEBHOOK' | 'SYSTEM';
  entityNameCandidate?: string;
  cuiCandidate?: string;
  domainCandidate?: string;
  eventType?: string;
  evidenceText?: string;
  commercialRelevance?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
};

export type PipelineExecutionResult = {
  success: boolean;
  jobId: string;
  observationId?: string;
  isDuplicateObservation: boolean;
  resolvedEntityId: string | null;
  resolvedEntityName: string | null;
  resolutionMethod: string;
  changeEventId?: string;
  signalId?: string;
  whyNowReason?: string;
  opportunityCandidateId?: string;
  telegramAlertSent: boolean;
  executedAt: string;
  error?: string;
};

/**
 * Executes the complete Level 3 Operational Intelligence Pipeline end-to-end.
 */
export async function executeOperationalPipeline(
  input: PipelineExecutionInput
): Promise<PipelineExecutionResult> {
  const client = getServiceClient();
  const nowIso = new Date().toISOString();
  const trigger = input.triggerType || 'SYSTEM';

  // 1. Validate & Hash Raw Source Payload
  const adapterResult = processRawSourcePayload(input);
  if (!adapterResult.isValid) {
    return {
      success: false,
      jobId: `job-failed-${Date.now()}`,
      isDuplicateObservation: false,
      resolvedEntityId: null,
      resolvedEntityName: null,
      resolutionMethod: 'REJECTED',
      telegramAlertSent: false,
      executedAt: nowIso,
      error: adapterResult.rejectionReason
    };
  }

  // 2. Start Ingestion Job
  let jobId = `job-${Date.now()}`;
  if (client) {
    const { data: jobRec } = await client
      .from('intelligence_ingestion_jobs')
      .insert({
        source_name: input.sourceName,
        source_type: input.sourceType,
        trigger_type: trigger,
        status: 'RUNNING',
        started_at: nowIso,
        records_seen: 1
      })
      .select('id')
      .single();
    if (jobRec) jobId = jobRec.id;
  }

  // 3. Deduplicate & Persist Raw Observation
  let observationId = `obs-${Date.now()}`;
  let isDuplicate = false;

  if (client) {
    // Check content hash
    const { data: existingObs } = await client
      .from('intelligence_observations')
      .select('id')
      .eq('content_hash', adapterResult.contentHash)
      .maybeSingle();

    if (existingObs) {
      isDuplicate = true;
      observationId = existingObs.id;

      // Update job as duplicate completed
      await client
        .from('intelligence_ingestion_jobs')
        .update({
          status: 'COMPLETED',
          completed_at: nowIso,
          duplicate_count: 1
        })
        .eq('id', jobId);

      return {
        success: true,
        jobId,
        observationId,
        isDuplicateObservation: true,
        resolvedEntityId: null,
        resolvedEntityName: null,
        resolutionMethod: 'DUPLICATE_OBSERVATION',
        telegramAlertSent: false,
        executedAt: nowIso
      };
    }

    // Insert new raw observation
    const { data: obsRec } = await client
      .from('intelligence_observations')
      .insert({
        source_id: input.sourceName,
        source_type: input.sourceType,
        source_name: input.sourceName,
        source_url: input.sourceUrl,
        retrieved_at: adapterResult.retrievedAt,
        observed_at: adapterResult.observedAt,
        raw_payload: adapterResult.rawPayload,
        content_hash: adapterResult.contentHash,
        ingestion_job_id: jobId,
        verification_status: 'VERIFIED'
      })
      .select('id')
      .single();

    if (obsRec) observationId = obsRec.id;
  }

  // 4. Entity Resolution (CUI -> Domain -> Name)
  const canonicalList: CanonicalEntity[] = realCompaniesDataset.map(c => ({
    id: c.id,
    name: c.name,
    cui_cif: c.cui_cif,
    official_website: c.website
  }));

  const resolutionResult = resolveCompanyEntity(
    {
      rawName: input.entityNameCandidate || input.sourceName,
      rawCui: input.cuiCandidate,
      rawDomain: input.domainCandidate,
      sourceUrl: input.sourceUrl
    },
    canonicalList
  );

  const resolvedCompany = realCompaniesDataset.find(c => c.id === resolutionResult.canonicalId);

  // 5. Change Detection Engine
  const changeInput = {
    companyId: resolutionResult.canonicalId || 'unresolved-company',
    changeCategory: input.eventType || 'MARKET_ACTIVITY_CHANGE',
    title: `${input.eventType || 'Market Event'}: ${input.entityNameCandidate || input.sourceName}`,
    location: resolvedCompany?.location || 'Romania',
    sourceUrl: input.sourceUrl,
    sourceTier: 'PRIMARY' as const,
    commercialRelevance: input.commercialRelevance || 'HIGH'
  };

  const changeResult = await ingestAndProcessContinuousEvent(changeInput);

  // 6. Market Signal Generation
  const signalInput = {
    eventType: (input.eventType as any) || 'MARKET_ACTIVITY_CHANGE',
    eventDate: nowIso.slice(0, 10),
    companyId: resolutionResult.canonicalId || 'unresolved-company',
    sourceUrl: input.sourceUrl,
    sourceTier: 'PRIMARY' as const,
    evidence: input.evidenceText || `Verified market event for ${input.entityNameCandidate || input.sourceName}`,
    confidence: 'HIGH' as const,
    commercialRelevance: input.commercialRelevance || 'HIGH'
  };

  const signalResult = await ingestLiveMarketSignal(signalInput);

  // 7. Deterministic "Why-Now" Trigger Calculation
  const whyNowResult = generateDeterministicWhyNow({
    companyName: resolutionResult.canonicalName || input.entityNameCandidate || input.sourceName,
    activeProjectsCount: resolvedCompany?.active_projects_count || 1,
    latestSignal: {
      eventType: signalInput.eventType,
      title: signalInput.evidence,
      eventDate: signalInput.eventDate
    }
  });

  // 8. Opportunity Candidate Persistence
  let opportunityCandidateId: string | undefined;
  if (client && resolutionResult.canonicalId) {
    const oppSignals: string[] = [];
    if (!resolvedCompany?.website) oppSignals.push('No website');
    if ((resolvedCompany?.active_projects_count || 0) >= 3) oppSignals.push('High project activity');
    else if ((resolvedCompany?.active_projects_count || 0) >= 1) oppSignals.push('Strong portfolio');

    const oppScore = calculateOpportunityScore(oppSignals, resolvedCompany?.active_projects_count || 0);

    const { data: oppRec } = await client
      .from('intelligence_opportunity_candidates')
      .insert({
        signal_id: signalResult.signalId.startsWith('sig-') ? null : signalResult.signalId,
        change_event_id: changeResult.eventId.startsWith('change-') ? null : changeResult.eventId,
        observation_id: observationId.startsWith('obs-') ? null : observationId,
        company_id: resolutionResult.canonicalId,
        company_name: resolutionResult.canonicalName || input.sourceName,
        reason: whyNowResult.primaryReason,
        commercial_score: oppScore.score,
        urgency: whyNowResult.urgency,
        evidence: signalInput.evidence,
        status: 'CANDIDATE'
      })
      .select('id')
      .single();

    if (oppRec) opportunityCandidateId = oppRec.id;
  }

  // 9. Real-time Commercial Executive Alert (Telegram)
  let telegramSent = false;
  if (input.commercialRelevance === 'CRITICAL' || input.sourceType === 'FORM_SUBMISSION') {
    const alertMsg = [
      `<b>⚡ OPERATIONAL INTELLIGENCE ALERT</b>`,
      `<b>Source:</b> ${input.sourceName}`,
      `<b>Entity:</b> ${resolutionResult.canonicalName || input.entityNameCandidate || 'Unresolved'}`,
      `<b>Resolution Method:</b> ${resolutionResult.resolutionMethod}`,
      `<b>Why-Now:</b> ${whyNowResult.primaryReason}`,
      `<b>Urgency:</b> ${whyNowResult.urgency}`,
      `<b>URL:</b> ${input.sourceUrl}`
    ].join('\n');

    telegramSent = await sendTelegramNotification(alertMsg);
  }

  // 10. Complete Ingestion Job Record
  if (client) {
    await client
      .from('intelligence_ingestion_jobs')
      .update({
        status: 'COMPLETED',
        completed_at: nowIso,
        records_seen: 1,
        records_created: 1
      })
      .eq('id', jobId);
  }

  return {
    success: true,
    jobId,
    observationId,
    isDuplicateObservation: false,
    resolvedEntityId: resolutionResult.canonicalId,
    resolvedEntityName: resolutionResult.canonicalName,
    resolutionMethod: resolutionResult.resolutionMethod,
    changeEventId: changeResult.eventId,
    signalId: signalResult.signalId,
    whyNowReason: whyNowResult.primaryReason,
    opportunityCandidateId,
    telegramAlertSent: telegramSent,
    executedAt: nowIso
  };
}
