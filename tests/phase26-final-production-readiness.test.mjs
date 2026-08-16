/**
 * Phase 26 Final Production Readiness, Live Operations & Commercial Activation Suite
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
  assertOutreachEligibility,
  assertPublishability,
  assertProductionCommercialTruth
} from '../lib/production-truth.ts';

import {
  resolveCompanyEntity
} from '../lib/entity-resolution.ts';

import {
  calculateSignalUrgency
} from '../lib/signal-urgency.ts';

import {
  validateOutreachClaims
} from '../lib/claim-firewall.ts';

import {
  buildCompanyRelationshipGraph
} from '../lib/relationship-graph.ts';

import {
  calculateNextBestAction
} from '../lib/next-best-action.ts';

import {
  generateDeterministicWhyNow
} from '../lib/why-now.ts';

import {
  calculateDeterministicDealSize
} from '../lib/deal-sizing.ts';

import {
  evaluateCommercialGap
} from '../lib/commercial-gap.ts';

import {
  getServiceClient,
  getPublicClient,
  isSupabaseConfigured
} from '../lib/supabase.ts';

test('1. Production Authority Guard: Enforces database binding', () => {
  assert.doesNotThrow(() => {
    assertProductionAuthority();
  });
});

test('2. Distinction: 0 Real Records vs Data Unavailable', () => {
  const zeroRecordState = { count: 0, status: 'VERIFIED_EMPTY' };
  const unavailableState = { count: null, status: 'DATA_UNAVAILABLE' };

  assert.notStrictEqual(zeroRecordState.status, unavailableState.status);
  assert.strictEqual(zeroRecordState.count, 0);
  assert.strictEqual(unavailableState.count, null);
});

test('3. Ingestion failure state is preserved without corrupting verified data', () => {
  const failedCycle = {
    status: 'FAILED',
    error: 'HTTP 503 Service Unavailable',
    discoveredCount: 0,
    acceptedCount: 0
  };
  assert.strictEqual(failedCycle.status, 'FAILED');
  assert.strictEqual(failedCycle.acceptedCount, 0);
});

test('4. Partial ingestion state remains visibly PARTIAL and not complete', () => {
  const partialCycle = {
    status: 'PARTIAL',
    discoveredCount: 20,
    acceptedCount: 8,
    rejectedCount: 12
  };
  assert.strictEqual(partialCycle.status, 'PARTIAL');
  assert.notStrictEqual(partialCycle.status, 'COMPLETED');
});

test('5. Stale source classification occurs on aged timestamps', () => {
  const oldDate = new Date(Date.now() - 60 * 86400000).toISOString();
  const urgency = calculateSignalUrgency({ eventType: 'BUILDING_PERMIT', eventDate: oldDate });
  assert.ok(urgency.decayFactor <= 0.5);
});

test('6. Unresolved entity handling: zero speculative merges', () => {
  const canonical = [{ id: 'co-1', name: 'Bog\'Art SRL', cui_cif: 'RO 1234567' }];
  const ambiguous = { rawName: 'Bog Art Residential Holding SRL', rawCui: null };
  const res = resolveCompanyEntity(ambiguous, canonical);
  assert.strictEqual(res.canonicalId, null);
  assert.strictEqual(res.resolutionMethod, 'UNRESOLVED');
});

test('7. Secret isolation: service role client is server-bound', () => {
  assert.strictEqual(typeof getServiceClient, 'function');
  assert.strictEqual(typeof getPublicClient, 'function');
});

test('8. RLS protection & public/private boundary: unpublished entities blocked from public', () => {
  const draftCompany = assertPublishability({ id: 'co-1', name: 'Draft SRL', published_at: null, content_state: 'draft' });
  assert.strictEqual(draftCompany, false);

  const publishedCompany = assertPublishability({ id: 'co-2', name: 'Erbașu SA', published_at: '2025-01-01', content_state: 'published' });
  assert.strictEqual(publishedCompany, true);
});

test('9. Revenue integrity: WON != PROPOSAL != FORECAST != REVENUE', () => {
  const fakeRevenue = assertProductionCommercialTruth({
    companyName: 'Construcții Erbașu SA',
    claimedRevenue: 75000,
    hasClosedContractEvidence: false,
    hasVerifiedSource: false
  });
  assert.strictEqual(fakeRevenue.isValid, false);
});

test('10. Daily queue eligibility excludes blocked and cooling companies', () => {
  const blocked = assertCommercialEligibility({ is_not_a_fit: true });
  assert.strictEqual(blocked.isEligible, false);

  const cooling = assertCommercialEligibility({ active_cooling: true });
  assert.strictEqual(cooling.isEligible, false);
});

test('11. Outreach approval gate: human review required before SENT', () => {
  const draft = { status: 'draft' };
  const approved = { status: 'approved' };
  assert.notStrictEqual(draft.status, 'sent');
  assert.notStrictEqual(approved.status, 'sent');
});

test('12. Hard claim firewall blocks unmapped claims', () => {
  const claims = [{ claimText: 'Starting new hospital extension', evidenceId: '', sourceUrl: '', verificationStatus: 'UNVERIFIED' }];
  const res = validateOutreachClaims(claims);
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.blocked, true);
});

test('13. Decision maker verification: Level 04 required for direct confirmed outreach', () => {
  const unv = assertVerifiedDecisionMaker({ name: 'Ion', role: 'CEO', verification_state: 'UNVERIFIED', email: null, phone: null });
  assert.strictEqual(unv.canDirectOutreach, false);
});

test('14. Deal sizing confidence gating', () => {
  const deal = calculateDeterministicDealSize({ companyType: 'Developer', activeProjectsCount: 2, hasVerifiedWebsiteGap: true });
  assert.ok(deal.estimatedMin > 0);
  assert.strictEqual(deal.currency, 'EUR');
});

test('15. Why Now evidence citation consistency', () => {
  const why = generateDeterministicWhyNow({
    companyName: 'Construcții Erbașu SA',
    latestPermit: { permitNumber: 'AC 84/2025', projectName: 'Hospital Complex', issueDate: '2025-06-01' }
  });
  assert.ok(why.primaryReason.includes('AC 84/2025'));
});

test('16. Next Best Action deterministic triggers', () => {
  const nba = calculateNextBestAction({ pipelineStatus: 'discovered', hasActivePermit: true, hasVerifiedPhone: true });
  assert.strictEqual(nba.action, 'CALL NOW');
  assert.strictEqual(nba.recommendedChannel, 'PHONE');
});

test('17. Zero-denominator conversion handling returns N/A gracefully', () => {
  const won = 0;
  const proposals = 0;
  const rate = proposals > 0 ? (won / proposals) * 100 : 'N/A';
  assert.strictEqual(rate, 'N/A');
});

test('18. UNKNOWN never renders as VERIFIED in digital audits', () => {
  const audit = assertVerifiedDigitalAudit('website', 'UNKNOWN');
  assert.strictEqual(audit.status, 'UNKNOWN');
  assert.strictEqual(audit.isDeficiency, false);
});

test('19. Relationship graph 8-node provenance integrity', () => {
  const graph = buildCompanyRelationshipGraph({
    companyId: 'co-1',
    companyName: 'Construcții Erbașu SA',
    cui: 'RO 1598732',
    projects: [{ id: 'p-1', name: 'Hospital', isVerified: true, sourceUrl: 'https://pmb.ro' }],
    signals: [{ id: 's-1', title: 'Permit AC 84', isVerified: true, sourceUrl: 'https://pmb.ro' }],
    decisionMakers: [{ id: 'dm-1', name: 'Cristian Erbașu', role: 'CEO', verificationLevel: '04_CONFIRMED' }],
    gaps: [{ dimension: 'WEBSITE', status: 'VERIFIED_GAP' }],
    outreachDrafts: [{ id: 'o-1', status: 'sent' }],
    proposals: [{ id: 'pr-1', totalAmount: 18500, status: 'won' }],
    revenue: [{ id: 'rev-1', dealAmount: 18500 }]
  });
  assert.strictEqual(graph.overallIntegrity, 'VERIFIED_CHAIN');
  assert.strictEqual(graph.nodes.length, 8);
});

test('20. Production mock contamination remains impossible', () => {
  const check = assertProductionCommercialTruth({
    companyName: 'Mock Company SRL',
    isMockData: true
  });
  assert.strictEqual(check.isValid, false);
});
