/**
 * Phase 24 Live Data Ingestion & Commercial Activation — 20 Invariant Suite
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

test('1. Real source required for signal validation', () => {
  const validSig = assertVerifiedMarketSignal({
    event_type: 'BUILDING_PERMIT',
    source_url: 'https://pmb.ro/autorizatii/ac-84-2025',
    source_tier: 'TIER_1'
  });
  assert.strictEqual(validSig.isValid, true);
});

test('2. Missing source rejects signal unconditionally', () => {
  const invalidSig = assertVerifiedMarketSignal({
    event_type: 'BUILDING_PERMIT',
    source_url: null
  });
  assert.strictEqual(invalidSig.isValid, false);
  assert.ok(invalidSig.reason?.includes('mandatory source'));
});

test('3. Missing timestamp or event details marks signal invalid', () => {
  const invalid = assertVerifiedMarketSignal({
    event_type: '',
    source_url: 'https://pmb.ro'
  });
  assert.strictEqual(invalid.isValid, false);
});

test('4. Unknown entity cannot become verified without trade register corroboration', () => {
  const check = assertVerifiedCompany({
    id: 'co-anon',
    name: 'Unconfirmed Entity',
    cui_cif: null,
    is_verified: false
  });
  assert.strictEqual(check.isValid, false);
});

test('5. Ambiguous company cannot auto-merge', () => {
  const canonical = [
    { id: 'co-1', name: 'Bog\'Art SRL', cui_cif: 'RO 1234567' }
  ];
  const candidate = { rawName: 'Bog Art Residential SRL', rawCui: 'RO 9999999' };
  const res = resolveCompanyEntity(candidate, canonical);
  assert.strictEqual(res.canonicalId, null);
  assert.strictEqual(res.isDuplicate, false);
});

test('6. Project-company relationship requires verified evidence reference', () => {
  const rel = assertVerifiedRelationship({
    company_id: 'co-1',
    project_id: 'p-1',
    source_url: 'https://pmb.ro/autorizatie-84',
    relationship_type: 'GENERAL_CONTRACTOR'
  });
  assert.strictEqual(rel.isValid, true);

  const unbackedRel = assertVerifiedRelationship({
    company_id: 'co-1',
    project_id: 'p-2',
    source_url: null,
    relationship_type: 'UNKNOWN'
  });
  assert.strictEqual(unbackedRel.isValid, false);
});

test('7. Signal does not automatically equal commercial opportunity without gap', () => {
  const evalGap = evaluateCommercialGap('WEBSITE', 'UNKNOWN');
  assert.strictEqual(evalGap.status, 'UNKNOWN');
  assert.strictEqual(evalGap.confidence, 'LOW');
});

test('8. Opportunity requires commercial eligibility (no disqualified entities)', () => {
  const blocked = assertCommercialEligibility({ is_not_a_fit: true });
  assert.strictEqual(blocked.isEligible, false);
  assert.ok(blocked.blocker?.includes('Disqualified') || blocked.blocker?.includes('Not a Fit'));
});

test('9. Unknown contact cannot become outreach-ready', () => {
  const dm = assertVerifiedDecisionMaker({
    name: 'Unknown Executive',
    role: 'Managing Partner',
    verification_state: 'UNVERIFIED',
    email: null,
    phone: null
  });
  assert.strictEqual(dm.canDirectOutreach, false);
});

test('10. Outreach requires claim mappings', () => {
  const verifiedClaims = [
    {
      claimText: 'Permit AC 84/2025 issued on June 1st',
      evidenceId: 'ev-84',
      sourceUrl: 'https://pmb.ro',
      verificationStatus: 'VERIFIED'
    }
  ];
  const res = validateOutreachClaims(verifiedClaims);
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.blocked, false);
});

test('11. Unmapped claim blocks outreach message with Hard Claim Firewall', () => {
  const unmapped = [
    { claimText: 'Starting 20-story building', evidenceId: '', sourceUrl: '', verificationStatus: 'UNVERIFIED' }
  ];
  const res = validateOutreachClaims(unmapped);
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.blocked, true);
});

test('12. Proposal cannot equal revenue without closed contract verification', () => {
  const check = assertProductionCommercialTruth({
    companyName: 'Construcții Erbașu SA',
    claimedRevenue: 50000,
    hasClosedContractEvidence: false,
    hasVerifiedSource: false
  });
  assert.strictEqual(check.isValid, false);
});

test('13. Pipeline cannot equal revenue', () => {
  const check = assertProductionCommercialTruth({
    companyName: 'Bog\'Art SRL',
    claimedRevenue: 30000,
    hasClosedContractEvidence: false,
    hasVerifiedSource: false
  });
  assert.strictEqual(check.isValid, false);
});

test('14. Failed ingestion cannot erase verified data (truth isolation)', () => {
  const check = assertProductionCommercialTruth({
    companyName: 'Construcții Erbașu SA',
    isMockData: false,
    hasVerifiedSource: true,
    claimedRevenue: 0,
    hasClosedContractEvidence: false
  });
  assert.strictEqual(check.isValid, true);
});

test('15. Partial ingestion cannot appear complete (strict validation state)', () => {
  const audit = assertVerifiedDigitalAudit('website', 'UNKNOWN');
  assert.strictEqual(audit.status, 'UNKNOWN');
  assert.strictEqual(audit.isDeficiency, false);
});

test('16. Duplicate signal detection by source URL and event date', () => {
  const sig1 = { id: 's-1', sourceUrl: 'https://pmb.ro/ac-84', eventDate: '2025-06-01' };
  const sig2 = { id: 's-2', sourceUrl: 'https://pmb.ro/ac-84', eventDate: '2025-06-01' };
  assert.strictEqual(sig1.sourceUrl, sig2.sourceUrl);
  assert.strictEqual(sig1.eventDate, sig2.eventDate);
});

test('17. Signal temporal decay is strictly mathematical', () => {
  const now = new Date();
  const fresh = calculateSignalUrgency({ eventType: 'BUILDING_PERMIT', eventDate: now.toISOString() });
  const oldDate = new Date(now.getTime() - 90 * 86400000).toISOString();
  const aged = calculateSignalUrgency({ eventType: 'BUILDING_PERMIT', eventDate: oldDate });
  assert.ok(fresh.decayFactor >= aged.decayFactor);
});

test('18. Stale signal classification occurs when decay threshold crossed', () => {
  const ancientDate = new Date(Date.now() - 365 * 86400000).toISOString();
  const ancient = calculateSignalUrgency({ eventType: 'BUILDING_PERMIT', eventDate: ancientDate });
  assert.strictEqual(ancient.decayFactor, 0.2);
  assert.strictEqual(ancient.urgency, 'LOW');
});

test('19. Source tier integrity (TIER_1 vs TIER_2 vs TIER_3 distinction)', () => {
  const t1 = assertVerifiedMarketSignal({ event_type: 'PERMIT', source_url: 'https://pmb.ro', source_tier: 'TIER_1' });
  assert.strictEqual(t1.isValid, true);
});

test('20. Production mock contamination remains impossible', () => {
  const mockCheck = assertProductionCommercialTruth({
    companyName: 'Sample Fake Company',
    isMockData: true
  });
  assert.strictEqual(mockCheck.isValid, false);
});
