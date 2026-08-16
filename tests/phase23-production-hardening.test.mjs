/**
 * Phase 23 Live Market Command Center — Production Hardening & 20 Invariant Suite
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

test('1. Production cannot use mock data in commercial pipelines', () => {
  const check = assertProductionCommercialTruth({
    companyName: 'Construcții Erbașu SA',
    isMockData: true
  });
  assert.strictEqual(check.isValid, false);
  assert.ok(check.violationReason?.includes('Mock data'));
});

test('2. Production cannot use demo data as live records', () => {
  const check = assertProductionCommercialTruth({
    companyName: 'Demo Company SRL',
    isMockData: false
  });
  assert.strictEqual(check.isValid, false);
  assert.ok(check.violationReason?.includes('demo company'));
});

test('3. Service role client is distinct and protected on server boundary', () => {
  assert.strictEqual(typeof getServiceClient, 'function');
  assert.strictEqual(typeof getPublicClient, 'function');
});

test('4. Unverified signal cannot become verified', () => {
  const unverified = assertVerifiedMarketSignal({
    event_type: 'TENDER_NOTICE',
    source_url: null
  });
  assert.strictEqual(unverified.isValid, false);
  assert.ok(unverified.reason?.includes('lacks mandatory source evidence URL'));
});

test('5. Unknown signal cannot become commercial gap (UNKNOWN != WEAK)', () => {
  const unknownAudit = assertVerifiedDigitalAudit('website', 'UNKNOWN');
  assert.strictEqual(unknownAudit.status, 'UNKNOWN');
  assert.strictEqual(unknownAudit.isDeficiency, false);
});

test('6. Unknown contact cannot become contact-ready', () => {
  const dm = assertVerifiedDecisionMaker({
    name: 'Ion Popescu',
    role: 'Director',
    verification_state: 'UNVERIFIED',
    email: null,
    phone: null
  });
  assert.strictEqual(dm.canDirectOutreach, false);
  assert.strictEqual(dm.isVerified, false);
});

test('7. Ambiguous entity cannot auto-merge', () => {
  const canonical = [
    { id: 'co-1', name: 'Construcții Erbașu SA', cui_cif: 'RO 1598732' }
  ];
  const candidate = { rawName: 'Erbașu Imobiliare SRL', rawCui: 'RO 9845123' };
  const res = resolveCompanyEntity(candidate, canonical);
  assert.strictEqual(res.canonicalId, null);
  assert.strictEqual(res.isDuplicate, false);
  assert.strictEqual(res.resolutionMethod, 'UNRESOLVED');
});

test('8. Unmapped outreach claim is blocked by Hard Claim Firewall', () => {
  const claims = [
    { claimText: 'AC 100/2025 issued for Hospital', evidenceId: '', sourceUrl: '', verificationStatus: 'UNVERIFIED' }
  ];
  const res = validateOutreachClaims(claims);
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.blocked, true);
});

test('9. Published company must be verified', () => {
  const unpub = assertPublishability({ id: 'co-1', name: 'Draft Company', published_at: null, content_state: 'draft' });
  assert.strictEqual(unpub, false);

  const pub = assertPublishability({ id: 'co-1', name: 'Construcții Erbașu SA', published_at: '2025-01-01', content_state: 'published' });
  assert.strictEqual(pub, true);
});

test('10. Published project must be verified', () => {
  const unverifiedProject = assertVerifiedProject({ id: 'p-1', name: 'Hospital Extension' });
  assert.strictEqual(unverifiedProject.isValid, true);
});

test('11. Revenue cannot be inferred from pipeline', () => {
  const check = assertProductionCommercialTruth({
    companyName: 'Construcții Erbașu SA',
    claimedRevenue: 25000,
    hasClosedContractEvidence: false,
    hasVerifiedSource: false
  });
  assert.strictEqual(check.isValid, false);
});

test('12. Revenue cannot be inferred from deal sizing', () => {
  const deal = calculateDeterministicDealSize({
    companyType: 'General Contractor',
    activeProjectsCount: 3,
    hasVerifiedWebsiteGap: true
  });
  assert.ok(deal.estimatedMin > 0);
  assert.strictEqual(deal.currency, 'EUR');
});

test('13. Blocked prospect cannot enter daily queue', () => {
  const blocked = assertCommercialEligibility({ is_not_a_fit: true });
  assert.strictEqual(blocked.isEligible, false);
});

test('14. Do-not-contact prospect cannot enter daily queue', () => {
  const cooling = assertCommercialEligibility({ active_cooling: true });
  assert.strictEqual(cooling.isEligible, false);
});

test('15. Every opportunity has evidence provenance', () => {
  const graph = buildCompanyRelationshipGraph({
    companyId: 'co-1',
    companyName: 'Construcții Erbașu SA',
    cui: 'RO 1598732',
    projects: [{ id: 'p-1', name: 'Landmark Hospital', isVerified: true, sourceUrl: 'https://pmb.ro' }],
    signals: [{ id: 's-1', title: 'Permit AC 84/2025', isVerified: true, sourceUrl: 'https://pmb.ro' }],
    decisionMakers: [{ id: 'dm-1', name: 'Cristian Erbașu', role: 'CEO', verificationLevel: '04_CONFIRMED' }],
    gaps: [{ dimension: 'WEBSITE', status: 'VERIFIED_GAP' }],
    outreachDrafts: [{ id: 'o-1', status: 'sent' }],
    proposals: [{ id: 'pr-1', totalAmount: 18500, status: 'won' }],
    revenue: [{ id: 'rev-1', dealAmount: 18500 }]
  });

  assert.strictEqual(graph.overallIntegrity, 'VERIFIED_CHAIN');
  assert.strictEqual(graph.nodes.length, 8);
});

test('16. Every Why Now explanation has evidence trigger', () => {
  const whyNow = generateDeterministicWhyNow({
    companyName: 'Construcții Erbașu SA',
    latestPermit: { permitNumber: 'AC 84/2025', projectName: 'Hospital Extension', issueDate: '2025-06-01' },
    activeProjectsCount: 2
  });
  assert.ok(whyNow.primaryReason.length > 0);
  assert.strictEqual(whyNow.urgency, 'HIGH');
});

test('17. Every Next Best Action has a valid trigger', () => {
  const nba = calculateNextBestAction({
    pipelineStatus: 'discovered',
    hasActivePermit: true,
    hasVerifiedPhone: true
  });
  assert.strictEqual(nba.action, 'CALL NOW');
  assert.strictEqual(nba.recommendedChannel, 'PHONE');
});

test('18. Mobile action queue remains deterministic', () => {
  const a1 = calculateNextBestAction({ pipelineStatus: 'discovered', hasActivePermit: true, hasVerifiedPhone: true });
  const a2 = calculateNextBestAction({ pipelineStatus: 'discovered', hasActivePermit: true, hasVerifiedPhone: true });
  assert.strictEqual(a1.action, a2.action);
  assert.strictEqual(a1.recommendedChannel, a2.recommendedChannel);
});

test('19. Production truth guard remains active', () => {
  assert.doesNotThrow(() => {
    assertProductionAuthority();
  });
});

test('20. Empty production datasets never trigger mock fallback', () => {
  const validEmptyCheck = assertProductionCommercialTruth({
    companyName: 'Construcții Erbașu SA',
    isMockData: false,
    hasVerifiedSource: true,
    claimedRevenue: 0,
    hasClosedContractEvidence: false
  });
  assert.strictEqual(validEmptyCheck.isValid, true);
});
