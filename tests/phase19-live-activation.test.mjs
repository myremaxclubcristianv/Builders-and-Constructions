/**
 * Phase 19 Live Romanian Construction Intelligence Activation Test Suite
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

test('1. Real Production Authority Guard', () => {
  assert.doesNotThrow(() => {
    assertProductionAuthority();
  });
});

test('2. Global Production Commercial Truth Firewall Rejects Mock Contamination', () => {
  const mockCheck = assertProductionCommercialTruth({
    companyName: 'Sample Demo Entity SRL',
    isMockData: true
  });
  assert.strictEqual(mockCheck.isValid, false);
  assert.ok(mockCheck.violationReason?.includes('Mock data contamination'));
});

test('3. Duplicate Company Resolution by Trade Register CUI/CIF', () => {
  const canonicalList = [
    { id: 'co-1', name: 'Construcții Erbașu SA', cui_cif: 'RO 1598732', official_website: 'https://erbasu.ro' }
  ];

  const match = resolveCompanyEntity(
    { rawName: 'Erbașu Construcții SRL', rawCui: '1598732' },
    canonicalList
  );

  assert.strictEqual(match.canonicalId, 'co-1');
  assert.strictEqual(match.resolutionMethod, 'CUI_MATCH');
  assert.strictEqual(match.confidence, 1.0);
  assert.strictEqual(match.isDuplicate, true);
});

test('4. Duplicate Company Resolution by Verified Official Domain', () => {
  const canonicalList = [
    { id: 'co-2', name: 'Bog\'Art SRL', cui_cif: 'RO 1582319', official_website: 'https://bogart.ro' }
  ];

  const match = resolveCompanyEntity(
    { rawName: 'Bogart Building Management', rawDomain: 'www.bogart.ro' },
    canonicalList
  );

  assert.strictEqual(match.canonicalId, 'co-2');
  assert.strictEqual(match.resolutionMethod, 'DOMAIN_MATCH');
  assert.strictEqual(match.confidence, 0.95);
});

test('5. Unresolved New Entity Is Not Falsely Merged', () => {
  const canonicalList = [
    { id: 'co-1', name: 'Construcții Erbașu SA', cui_cif: 'RO 1598732' }
  ];

  const match = resolveCompanyEntity(
    { rawName: 'Strabag Romania SRL', rawCui: 'RO 6734120' },
    canonicalList
  );

  assert.strictEqual(match.canonicalId, null);
  assert.strictEqual(match.resolutionMethod, 'UNRESOLVED');
  assert.strictEqual(match.isDuplicate, false);
});

test('6. Signal Urgency & Temporal Decay Factor Calculation', () => {
  const today = new Date().toISOString().slice(0, 10);
  const freshPermit = calculateSignalUrgency({
    eventType: 'BUILDING_PERMIT',
    eventDate: today
  });

  assert.strictEqual(freshPermit.urgency, 'CRITICAL');
  assert.strictEqual(freshPermit.decayFactor, 1.0);
  assert.strictEqual(freshPermit.isActionable, true);

  const oldSignal = calculateSignalUrgency({
    eventType: 'GENERAL_NOTICE',
    eventDate: '2025-01-01'
  });

  assert.strictEqual(oldSignal.urgency, 'LOW');
  assert.strictEqual(oldSignal.decayFactor, 0.2);
});

test('7. Hard Claim Firewall Blocks Unmapped Factual Assertions', () => {
  const invalidClaims = [
    { claimText: 'AC 84/2025 issued for Hospital', evidenceId: '', sourceUrl: '', verificationStatus: 'UNVERIFIED' }
  ];

  const res = validateOutreachClaims(invalidClaims);
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.blocked, true);
  assert.ok(res.rejectionReason?.includes('Claim Firewall'));
});

test('8. Hard Claim Firewall Passes Verified Evidence Mappings', () => {
  const validClaims = [
    {
      claimText: 'Building Permit AC 84/2025 verified for Clinical Hospital complex',
      evidenceId: 'ev-pmb-84',
      sourceUrl: 'https://pmb.ro/urbanism/ac-84-2025',
      verificationStatus: 'VERIFIED'
    }
  ];

  const res = validateOutreachClaims(validClaims);
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.blocked, false);
  assert.strictEqual(res.verifiedClaims, 1);
});

test('9. Production Relationship Graph 8-Node Provenance Verification', () => {
  const graph = buildCompanyRelationshipGraph({
    companyId: 'co-erbasu',
    companyName: 'Construcții Erbașu SA',
    cui: 'RO 1598732',
    projects: [{ id: 'p-1', name: 'Clinical Hospital', isVerified: true, sourceUrl: 'https://pmb.ro' }],
    signals: [{ id: 's-1', title: 'Permit AC 84/2025', isVerified: true, sourceUrl: 'https://pmb.ro' }],
    decisionMakers: [{ id: 'dm-1', name: 'Cristian Erbașu', role: 'CEO', verificationLevel: '04_CONFIRMED' }],
    gaps: [{ dimension: 'WEBSITE', status: 'VERIFIED_GAP' }],
    outreachDrafts: [{ id: 'o-1', status: 'approved' }],
    proposals: [{ id: 'pr-1', totalAmount: 18500, status: 'won' }],
    revenue: [{ id: 'rev-1', dealAmount: 18500 }]
  });

  assert.strictEqual(graph.overallIntegrity, 'VERIFIED_CHAIN');
  assert.strictEqual(graph.nodes.length, 8);
  assert.ok(graph.nodes.every(n => n.status === 'VERIFIED'));
});

test('10. Next Best Action 2.0 Hard Blocker Integrity', () => {
  const blocked = calculateNextBestAction({
    isNotAFit: true
  });
  assert.strictEqual(blocked.action, 'DO NOT CONTACT');
  assert.strictEqual(blocked.recommendedChannel, 'NONE');
});

test('11. Why Now Engine Evidence-Citation Consistency', () => {
  const whyNow = generateDeterministicWhyNow({
    companyName: 'Bog\'Art',
    latestPermit: {
      permitNumber: 'AC 19/2024',
      projectName: 'Riverside Quarter',
      issueDate: '2026-08-10'
    }
  });

  assert.ok(whyNow.primaryReason.includes('AC 19/2024'));
  assert.strictEqual(whyNow.urgency, 'HIGH');
  assert.strictEqual(whyNow.evidenceCitations.length, 1);
});

test('12. Deal Sizing Estimator Confidence Gating', () => {
  const deal = calculateDeterministicDealSize({
    companyType: 'Real Estate Developer',
    activeProjectsCount: 2,
    hasVerifiedWebsiteGap: true
  });

  assert.ok(deal.estimatedMin >= 12000);
  assert.ok(deal.estimatedMax >= 20000);
  assert.strictEqual(deal.confidence, 'HIGH');
});

test('13. Decision Maker 4-Level Governance', () => {
  const l1 = assertVerifiedDecisionMaker({ name: 'Dan Popescu', role: 'Manager', verification_state: 'UNVERIFIED' });
  assert.strictEqual(l1.level, '01_IDENTIFIED');
  assert.strictEqual(l1.canDirectOutreach, false);

  const l4 = assertVerifiedDecisionMaker({
    name: 'Dan Popescu',
    role: 'Managing Director',
    phone: '+40 21 200 0000',
    verification_state: 'CONFIRMED_BY_CONTACT'
  });
  assert.strictEqual(l4.level, '04_CONFIRMED');
  assert.strictEqual(l4.canDirectOutreach, true);
});

test('14. Commercial Eligibility Exclusion Enforcement', () => {
  const coolingActive = assertCommercialEligibility({ active_cooling: true });
  assert.strictEqual(coolingActive.isEligible, false);
  assert.ok(coolingActive.blocker?.includes('cooling period'));
});

test('15. Zero Fabrication Global Commercial Guard', () => {
  const validPayload = assertProductionCommercialTruth({
    companyName: 'Bog\'Art SRL',
    isMockData: false,
    hasVerifiedSource: true,
    claimedRevenue: 22000,
    hasClosedContractEvidence: true
  });
  assert.strictEqual(validPayload.isValid, true);

  const invalidRevenue = assertProductionCommercialTruth({
    companyName: 'Bog\'Art SRL',
    isMockData: false,
    hasVerifiedSource: false,
    claimedRevenue: 22000,
    hasClosedContractEvidence: false
  });
  assert.strictEqual(invalidRevenue.isValid, false);
  assert.ok(invalidRevenue.violationReason?.includes('Revenue claimed without verified closed contract'));
});
