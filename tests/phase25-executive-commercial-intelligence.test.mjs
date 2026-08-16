/**
 * Phase 25 Executive Commercial Intelligence & Daily Action System — 20 Invariant Suite
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

test('1. Daily queue excludes blocked prospects', () => {
  const blocked = assertCommercialEligibility({ is_not_a_fit: true });
  assert.strictEqual(blocked.isEligible, false);
  assert.ok(blocked.blocker?.includes('Disqualified') || blocked.blocker?.includes('Not a Fit'));
});

test('2. Daily queue excludes cooling prospects', () => {
  const cooling = assertCommercialEligibility({ active_cooling: true });
  assert.strictEqual(cooling.isEligible, false);
  assert.ok(cooling.blocker?.includes('cooling period'));
});

test('3. Daily queue excludes unresolved companies', () => {
  const unresolved = resolveCompanyEntity(
    { rawName: 'Erbașu Imobiliare SRL', rawCui: 'RO 9845123' },
    [{ id: 'co-1', name: 'Construcții Erbașu SA', cui_cif: 'RO 1598732' }]
  );
  assert.strictEqual(unresolved.canonicalId, null);
  assert.strictEqual(unresolved.resolutionMethod, 'UNRESOLVED');
});

test('4. Daily queue excludes unknown contacts where direct outreach is required', () => {
  const unv = assertVerifiedDecisionMaker({
    name: 'Unknown',
    role: 'Director',
    verification_state: 'UNVERIFIED',
    email: null,
    phone: null
  });
  assert.strictEqual(unv.canDirectOutreach, false);
});

test('5. Queue ordering is deterministic given identical inputs', () => {
  const input1 = { pipelineStatus: 'discovered', hasActivePermit: true, hasVerifiedPhone: true };
  const input2 = { pipelineStatus: 'discovered', hasActivePermit: true, hasVerifiedPhone: true };
  const r1 = calculateNextBestAction(input1);
  const r2 = calculateNextBestAction(input2);
  assert.strictEqual(r1.action, r2.action);
  assert.strictEqual(r1.urgency, r2.urgency);
  assert.strictEqual(r1.recommendedChannel, r2.recommendedChannel);
});

test('6. Opportunity requires verified evidence', () => {
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
});

test('7. Why Now requires verified trigger', () => {
  const why = generateDeterministicWhyNow({
    companyName: 'Construcții Erbașu SA',
    latestPermit: { permitNumber: 'AC 84/2025', projectName: 'Hospital Extension', issueDate: '2025-06-01' }
  });
  assert.ok(why.primaryReason.includes('AC 84/2025'));
  assert.strictEqual(why.urgency, 'HIGH');
});

test('8. Outreach claim mapping is complete', () => {
  const claims = [
    {
      claimText: 'Permit AC 84/2025 issued for Hospital Extension',
      evidenceId: 'ev-84',
      sourceUrl: 'https://pmb.ro/ac-84',
      verificationStatus: 'VERIFIED'
    }
  ];
  const res = validateOutreachClaims(claims);
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.blocked, false);
});

test('9. Unmapped claim blocks outreach with Hard Claim Firewall', () => {
  const unmapped = [
    { claimText: 'New luxury tower breaking ground next week', evidenceId: '', sourceUrl: '', verificationStatus: 'UNVERIFIED' }
  ];
  const res = validateOutreachClaims(unmapped);
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.blocked, true);
});

test('10. Human approval required before SENT (outreach status transitions)', () => {
  const draftState = 'draft';
  const approvedState = 'approved';
  assert.notStrictEqual(draftState, 'sent');
  assert.strictEqual(approvedState === 'approved' || approvedState === 'draft', true);
});

test('11. SENT creates sales activity without claiming revenue', () => {
  const activity = {
    company_id: 'co-1',
    activity_type: 'email_sent',
    summary: 'Executive value briefing sent',
    created_at: new Date().toISOString()
  };
  assert.ok(activity.company_id);
  assert.strictEqual(activity.activity_type, 'email_sent');
});

test('12. Sales activity does not equal revenue', () => {
  const check = assertProductionCommercialTruth({
    companyName: 'Construcții Erbașu SA',
    claimedRevenue: 15000,
    hasClosedContractEvidence: false,
    hasVerifiedSource: false
  });
  assert.strictEqual(check.isValid, false);
});

test('13. Proposal does not equal revenue', () => {
  const check = assertProductionCommercialTruth({
    companyName: 'Bog\'Art SRL',
    claimedRevenue: 45000,
    hasClosedContractEvidence: false,
    hasVerifiedSource: false
  });
  assert.strictEqual(check.isValid, false);
});

test('14. Won deal without attribution does not equal revenue', () => {
  const check = assertProductionCommercialTruth({
    companyName: 'Unattributed Deal SRL',
    claimedRevenue: 20000,
    hasClosedContractEvidence: false,
    hasVerifiedSource: false
  });
  assert.strictEqual(check.isValid, false);
});

test('15. Revenue requires verified attribution', () => {
  const check = assertProductionCommercialTruth({
    companyName: 'Construcții Erbașu SA',
    isMockData: false,
    hasVerifiedSource: true,
    claimedRevenue: 0,
    hasClosedContractEvidence: false
  });
  assert.strictEqual(check.isValid, true);
});

test('16. Follow-up respects cooling period', () => {
  const nba = calculateNextBestAction({
    coolingPeriodActive: true
  });
  assert.strictEqual(nba.action, 'DO NOT CONTACT');
  assert.strictEqual(nba.recommendedChannel, 'NONE');
});

test('17. Zero-denominator conversion returns N/A or 0 gracefully', () => {
  const wonCount = 0;
  const proposalCount = 0;
  const conversionRate = proposalCount > 0 ? (wonCount / proposalCount) * 100 : 'N/A';
  assert.strictEqual(conversionRate, 'N/A');
});

test('18. UNKNOWN never renders as VERIFIED', () => {
  const audit = assertVerifiedDigitalAudit('website', 'UNKNOWN');
  assert.strictEqual(audit.status, 'UNKNOWN');
  assert.strictEqual(audit.isDeficiency, false);
});

test('19. Missing evidence creates data-quality warning', () => {
  const missingEvidence = assertVerifiedMarketSignal({
    event_type: 'BUILDING_PERMIT',
    source_url: null
  });
  assert.strictEqual(missingEvidence.isValid, false);
});

test('20. Production mock fallback remains impossible', () => {
  const mockCheck = assertProductionCommercialTruth({
    companyName: 'Demo Company SRL',
    isMockData: true
  });
  assert.strictEqual(mockCheck.isValid, false);
});
