/**
 * Phase 20 Mobile Executive Experience & Production Completion Test Suite
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
  evaluateExecutiveVerdict
} from '../lib/executive-verdict.ts';

test('1. Production Authority Verification', () => {
  assert.doesNotThrow(() => {
    assertProductionAuthority();
  });
});

test('2. Mobile Rendering State Distinction (UNKNOWN != WEAK != BLOCKED)', () => {
  const unknownAudit = assertVerifiedDigitalAudit('website', 'UNKNOWN');
  assert.strictEqual(unknownAudit.status, 'UNKNOWN');
  assert.strictEqual(unknownAudit.isDeficiency, false);

  const weakAudit = assertVerifiedDigitalAudit('website', 'WEAK');
  assert.strictEqual(weakAudit.status, 'VERIFIED_GAP');
  assert.strictEqual(weakAudit.isDeficiency, true);

  const blockedCompany = assertCommercialEligibility({ is_not_a_fit: true });
  assert.strictEqual(blockedCompany.isEligible, false);
  assert.ok(blockedCompany.blocker?.includes('Not a Fit'));
});

test('3. Next Best Action Determinism on Mobile Action Queue', () => {
  const permitAction = calculateNextBestAction({
    pipelineStatus: 'discovered',
    hasActivePermit: true,
    hasVerifiedPhone: true
  });
  assert.strictEqual(permitAction.action, 'CALL NOW');
  assert.strictEqual(permitAction.recommendedChannel, 'PHONE');
  assert.strictEqual(permitAction.urgency, 'HIGH');

  const coolAction = calculateNextBestAction({
    coolingPeriodActive: true
  });
  assert.strictEqual(coolAction.action, 'DO NOT CONTACT');
  assert.strictEqual(coolAction.recommendedChannel, 'NONE');
});

test('4. Signal Urgency & Temporal Decay on Live Feeds', () => {
  const today = new Date().toISOString().slice(0, 10);
  const criticalPermit = calculateSignalUrgency({
    eventType: 'PERMIT_ISSUED',
    eventDate: today
  });
  assert.strictEqual(criticalPermit.urgency, 'CRITICAL');
  assert.strictEqual(criticalPermit.decayFactor, 1.0);

  const staleNotice = calculateSignalUrgency({
    eventType: 'GENERAL_NOTICE',
    eventDate: '2024-01-01'
  });
  assert.strictEqual(staleNotice.urgency, 'LOW');
  assert.strictEqual(staleNotice.decayFactor, 0.2);
});

test('5. Hard Claim Firewall Blocks Unmapped Claims in Outreach', () => {
  const invalidClaims = [
    { claimText: 'AC 84/2025 issued for Hospital', evidenceId: '', sourceUrl: '', verificationStatus: 'UNVERIFIED' }
  ];
  const res = validateOutreachClaims(invalidClaims);
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.blocked, true);

  const validClaims = [
    {
      claimText: 'Building Permit AC 84/2025 verified for Clinical Hospital complex',
      evidenceId: 'ev-pmb-84',
      sourceUrl: 'https://pmb.ro/urbanism/ac-84-2025',
      verificationStatus: 'VERIFIED'
    }
  ];
  const validRes = validateOutreachClaims(validClaims);
  assert.strictEqual(validRes.isValid, true);
  assert.strictEqual(validRes.blocked, false);
});

test('6. Entity Resolution Hierarchy: CUI > Domain > Normalized Name', () => {
  const canonical = [
    { id: 'co-1', name: 'Construcții Erbașu SA', cui_cif: 'RO 1598732', official_website: 'https://erbasu.ro' }
  ];

  const cuiMatch = resolveCompanyEntity({ rawName: 'Erbașu SRL', rawCui: '1598732' }, canonical);
  assert.strictEqual(cuiMatch.canonicalId, 'co-1');
  assert.strictEqual(cuiMatch.resolutionMethod, 'CUI_MATCH');

  const domMatch = resolveCompanyEntity({ rawName: 'Erbașu General', rawDomain: 'erbasu.ro' }, canonical);
  assert.strictEqual(domMatch.canonicalId, 'co-1');
  assert.strictEqual(domMatch.resolutionMethod, 'DOMAIN_MATCH');
});

test('7. Relationship Graph 8-Node Provenance Chain', () => {
  const graph = buildCompanyRelationshipGraph({
    companyId: 'co-1',
    companyName: 'Construcții Erbașu SA',
    cui: 'RO 1598732',
    projects: [{ id: 'p-1', name: 'Clinical Hospital', isVerified: true, sourceUrl: 'https://pmb.ro' }],
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

test('8. Global Production Commercial Truth Guard', () => {
  const mockCheck = assertProductionCommercialTruth({
    companyName: 'Sample Fake Entity SRL',
    isMockData: true
  });
  assert.strictEqual(mockCheck.isValid, false);

  const authenticCheck = assertProductionCommercialTruth({
    companyName: 'Construcții Erbașu SA',
    isMockData: false,
    hasVerifiedSource: true,
    claimedRevenue: 18500,
    hasClosedContractEvidence: true
  });
  assert.strictEqual(authenticCheck.isValid, true);
});
