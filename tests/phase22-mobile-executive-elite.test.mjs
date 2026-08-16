/**
 * Phase 22 Mobile Executive Elite Test Suite
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
  calculateNextBestAction
} from '../lib/next-best-action.ts';

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
  resolveCompanyEntity
} from '../lib/entity-resolution.ts';

test('1. Mobile Executive Terminal: Authority Assertion', () => {
  assert.doesNotThrow(() => {
    assertProductionAuthority();
  });
});

test('2. Strict Status Pill Distinction: UNKNOWN != PARTIAL != VERIFIED != REJECTED', () => {
  const unknownAudit = assertVerifiedDigitalAudit('website', 'UNKNOWN');
  assert.strictEqual(unknownAudit.status, 'UNKNOWN');
  assert.strictEqual(unknownAudit.isDeficiency, false);

  const partialAudit = assertVerifiedDigitalAudit('website', 'PENDING');
  assert.strictEqual(partialAudit.status, 'UNKNOWN');

  const gapAudit = assertVerifiedDigitalAudit('website', 'WEAK');
  assert.strictEqual(gapAudit.status, 'VERIFIED_GAP');
  assert.strictEqual(gapAudit.isDeficiency, true);

  const blockedEntity = assertCommercialEligibility({ is_not_a_fit: true });
  assert.strictEqual(blockedEntity.isEligible, false);
});

test('3. Progressive Disclosure on Mobile Opportunities: Clean Action Model', () => {
  const nba = calculateNextBestAction({
    pipelineStatus: 'discovered',
    hasActivePermit: true,
    hasVerifiedPhone: true
  });

  assert.strictEqual(nba.action, 'CALL NOW');
  assert.strictEqual(nba.recommendedChannel, 'PHONE');
  assert.strictEqual(nba.urgency, 'HIGH');
  assert.ok(nba.rationale.includes('permit') || nba.evidence.includes('permit'));
});

test('4. Relationship Timeline 8-Node Provenance with Explicit Status Codes', () => {
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
  assert.strictEqual(graph.nodes[0].status, 'VERIFIED');
});

test('5. Hard Claim Firewall on Fact-Based Executive Outreach', () => {
  const verifiedClaims = [
    {
      claimText: 'Building Permit AC 84/2025 issued for Clinical Hospital complex',
      evidenceId: 'ev-84',
      sourceUrl: 'https://pmb.ro/autorizatii/ac-84-2025',
      verificationStatus: 'VERIFIED'
    }
  ];
  const validRes = validateOutreachClaims(verifiedClaims);
  assert.strictEqual(validRes.isValid, true);
  assert.strictEqual(validRes.blocked, false);

  const unverifiedClaims = [
    { claimText: 'New 20-story tower announced', evidenceId: '', sourceUrl: '', verificationStatus: 'UNVERIFIED' }
  ];
  const blockedRes = validateOutreachClaims(unverifiedClaims);
  assert.strictEqual(blockedRes.isValid, false);
  assert.strictEqual(blockedRes.blocked, true);
});

test('6. Zero Fabrication Commercial Truth Invariant', () => {
  const truthfulResult = assertProductionCommercialTruth({
    companyName: 'Construcții Erbașu SA',
    isMockData: false,
    hasVerifiedSource: true,
    claimedRevenue: 0,
    hasClosedContractEvidence: false
  });
  assert.strictEqual(truthfulResult.isValid, true);

  const fakeRevenueResult = assertProductionCommercialTruth({
    companyName: 'Sample Company SRL',
    isMockData: true,
    hasVerifiedSource: false,
    claimedRevenue: 50000,
    hasClosedContractEvidence: false
  });
  assert.strictEqual(fakeRevenueResult.isValid, false);
});
