/**
 * Phase 21 Production Truth & Live Market Verification Test Suite
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

test('1. Production Authority Guard Enforces Authentic PostgreSQL Binding', () => {
  assert.doesNotThrow(() => {
    assertProductionAuthority();
  });
});

test('2. Zero Fabrication: Unverified Companies Cannot Be Claimed as Verified', () => {
  const invalidCompany = assertVerifiedCompany({ id: 'co-anon', name: 'Unknown Entity SRL', cui_cif: null, sources_count: 0 });
  assert.strictEqual(invalidCompany.isValid, false);
  assert.ok(invalidCompany.reason?.includes('lacks verified CUI/CIF'));

  const validCompany = assertVerifiedCompany({ id: 'co-real', name: 'Construcții Erbașu SA', cui_cif: 'RO 1598732', sources_count: 3 });
  assert.strictEqual(validCompany.isValid, true);
});

test('3. Relationship Provenance: Unbacked Relationships Are Rejected', () => {
  const unbackedRel = assertVerifiedRelationship({ company_id: 'co-1', project_id: 'p-1', source_url: null, verified_at: null });
  assert.strictEqual(unbackedRel.isValid, false);
  assert.ok(unbackedRel.reason?.includes('lacks source evidence'));

  const verifiedRel = assertVerifiedRelationship({ company_id: 'co-1', project_id: 'p-1', source_url: 'https://pmb.ro/autorizatii/2025', verified_at: '2025-06-01' });
  assert.strictEqual(verifiedRel.isValid, true);
});

test('4. Hard Claim Firewall Blocks Unmapped Claims in Outreach', () => {
  const fabricatedClaims = [
    { claimText: 'AC 99/2025 approved for Sky Tower extension', evidenceId: '', sourceUrl: '', verificationStatus: 'UNVERIFIED' }
  ];
  const res = validateOutreachClaims(fabricatedClaims);
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.blocked, true);
  assert.ok(res.rejectionReason?.includes('Blocked by Claim Firewall'));
});

test('5. Entity Resolution Prevents Accidental False Merges', () => {
  const canonical = [
    { id: 'co-1', name: 'Construcții Erbașu SA', cui_cif: 'RO 1598732', official_website: 'https://erbasu.ro' },
    { id: 'co-2', name: 'Bog\'Art SRL', cui_cif: 'RO 1582312', official_website: 'https://bogart.ro' }
  ];

  const candidate = { rawName: 'Strabag Romania SRL', rawCui: 'RO 6734123', rawDomain: 'strabag.ro' };
  const match = resolveCompanyEntity(candidate, canonical);
  assert.strictEqual(match.canonicalId, null);
  assert.strictEqual(match.isDuplicate, false);
  assert.strictEqual(match.resolutionMethod, 'UNRESOLVED');
});

test('6. Temporal Decay on Signals Is Strictly Deterministic', () => {
  const today = new Date().toISOString().slice(0, 10);
  const freshSignal = calculateSignalUrgency({ eventType: 'BUILDING_PERMIT', eventDate: today });
  assert.strictEqual(freshSignal.urgency, 'CRITICAL');
  assert.strictEqual(freshSignal.decayFactor, 1.0);

  const oldSignal = calculateSignalUrgency({ eventType: 'BUILDING_PERMIT', eventDate: '2023-01-01' });
  assert.strictEqual(oldSignal.urgency, 'LOW');
  assert.strictEqual(oldSignal.decayFactor, 0.2);
});

test('7. 8-Node Provenance Graph Completeness & Integrity', () => {
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
  assert.strictEqual(graph.nodes[0].type, 'COMPANY');
  assert.strictEqual(graph.nodes[7].type, 'REVENUE');
});

test('8. Commercial Eligibility Rejects Disqualified / Out-of-Fit Companies', () => {
  const disq = assertCommercialEligibility({ is_not_a_fit: true });
  assert.strictEqual(disq.isEligible, false);
  assert.ok(disq.blocker?.includes('Not a Fit'));

  const cooling = assertCommercialEligibility({ active_cooling: true });
  assert.strictEqual(cooling.isEligible, false);
  assert.ok(cooling.blocker?.includes('cooling period'));
});
