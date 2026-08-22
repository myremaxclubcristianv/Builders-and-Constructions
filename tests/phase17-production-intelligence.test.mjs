/**
 * Phase 17 Production Intelligence & Revenue OS Test Suite
 * CONSTRUCTIONS by AiXLuxury
 */

import assert from 'node:assert';
import test from 'node:test';

import {
  assertProductionAuthority,
  assertVerifiedCompany,
  assertVerifiedProject,
  assertVerifiedRelationship,
  assertVerifiedDecisionMaker,
  assertVerifiedMarketSignal,
  assertVerifiedDigitalAudit,
  assertCommercialEligibility,
  assertOutreachEligibility
} from '../lib/production-truth.ts';

import {
  ingestLiveMarketSignal
} from '../lib/live-intelligence.ts';

import {
  evaluateExecutiveVerdict
} from '../lib/executive-verdict.ts';

import {
  calculateNextBestAction
} from '../lib/next-best-action.ts';

import {
  evaluateCommercialGap
} from '../lib/commercial-gap.ts';

import {
  recommendServicesFromGaps
} from '../lib/service-recommendations.ts';

import {
  calculateDeterministicDealSize
} from '../lib/deal-sizing.ts';

test('1. Production Truth: Authority & Entity Verification', () => {
  assert.doesNotThrow(() => {
    assertProductionAuthority();
  });

  const validCo = assertVerifiedCompany({
    id: 'co-1',
    name: 'Erbașu Construcții',
    cui_cif: 'RO 1598732'
  });
  assert.strictEqual(validCo.isValid, true);

  const invalidCo = assertVerifiedCompany({ id: 'co-2', name: 'Unknown SRL', cui_cif: null, sources_count: 0 });
  assert.strictEqual(invalidCo.isValid, false);
});

test('2. Production Truth: 4-Level Decision Maker Direct Outreach Governance', () => {
  const level1 = assertVerifiedDecisionMaker({
    name: 'Dan Boghiu',
    role: 'Commercial Director',
    verification_state: 'UNVERIFIED'
  });
  assert.strictEqual(level1.canDirectOutreach, false);

  const level3 = assertVerifiedDecisionMaker({
    name: 'Dan Boghiu',
    role: 'Commercial Director',
    email: 'dan.boghiu@bogart.ro',
    verification_state: 'COMPANY_VERIFIED'
  });
  assert.strictEqual(level3.canDirectOutreach, true);
  assert.strictEqual(level3.level, '03_DOMAIN_VERIFIED');
});

test('3. Live Market Intelligence Signal Ingestion & Audit Delta', async () => {
  const res = await ingestLiveMarketSignal({
    eventType: 'BUILDING_PERMIT',
    eventDate: '2026-08-16',
    companyId: 'co-erbasu',
    sourceUrl: 'https://sector1urbanism.ro/ac-84-2025',
    sourceTier: 'PRIMARY',
    evidence: 'AC 84/2025 issued for Clinical Hospital complex',
    confidence: 'HIGH',
    commercialRelevance: 'CRITICAL'
  });

  assert.strictEqual(res.success, true);
  assert.strictEqual(res.scoreDelta, 20, 'CRITICAL signal must generate +20 delta');
  assert.ok(res.reason.includes('BUILDING_PERMIT'));
});

test('4. Executive Verdict Engine: Unambiguous Decision', () => {
  const readyVerdict = evaluateExecutiveVerdict({
    companyVerified: true,
    hasVerifiedRelationship: true,
    hasVerifiedDecisionMaker: true,
    priorityScore: 88,
    confidence: 'HIGH'
  });
  assert.strictEqual(readyVerdict.verdict, 'YES');

  const researchVerdict = evaluateExecutiveVerdict({
    companyVerified: true,
    hasVerifiedRelationship: false,
    hasVerifiedDecisionMaker: false,
    priorityScore: 88,
    confidence: 'MEDIUM'
  });
  assert.strictEqual(researchVerdict.verdict, 'WAIT');

  const blockedVerdict = evaluateExecutiveVerdict({
    companyVerified: true,
    hasVerifiedRelationship: true,
    hasVerifiedDecisionMaker: true,
    priorityScore: 88,
    isNotAFit: true,
    confidence: 'DISQUALIFIED'
  });
  assert.strictEqual(blockedVerdict.verdict, 'NO');
});

test('5. Next Best Action Engine', () => {
  const callAction = calculateNextBestAction({
    pipelineStatus: 'discovered',
    hasActivePermit: true,
    hasVerifiedPhone: true
  });
  assert.strictEqual(callAction.action, 'CALL NOW');
  assert.strictEqual(callAction.recommendedChannel, 'PHONE');

  const followUpAction = calculateNextBestAction({
    pipelineStatus: 'proposal_sent'
  });
  assert.strictEqual(followUpAction.action, 'FOLLOW UP');
});

test('6. Commercial Gap Engine: UNKNOWN != WEAK', () => {
  const unknownGap = evaluateCommercialGap('SEO', 'UNKNOWN');
  assert.strictEqual(unknownGap.status, 'UNKNOWN');

  const verifiedGap = evaluateCommercialGap('WEBSITE', 'WEAK', 'Outdated corporate website', 'https://company.ro');
  assert.strictEqual(verifiedGap.status, 'VERIFIED_GAP');
});

test('7. Service Recommendations & Deterministic Deal Sizing', () => {
  const gaps = [
    evaluateCommercialGap('WEBSITE', 'WEAK', 'Outdated corporate website', 'https://company.ro'),
    evaluateCommercialGap('VIDEO', 'MISSING', 'No drone milestone media', 'https://company.ro')
  ];

  const recs = recommendServicesFromGaps(gaps, 2);
  assert.ok(recs.length >= 2);
  assert.ok(recs.some(r => r.serviceKey === 'CORPORATE_WEB_ARCHITECTURE'));

  const dealSize = calculateDeterministicDealSize({
    companyType: 'General Contractor',
    activeProjectsCount: 3,
    hasVerifiedWebsiteGap: true,
    hasVerifiedMediaGap: true
  });

  assert.ok(dealSize.estimatedMin >= 18000, 'Must reflect comprehensive GC scale');
  assert.ok(dealSize.estimatedMax >= 30000);
  assert.strictEqual(dealSize.currency, 'EUR');
});
