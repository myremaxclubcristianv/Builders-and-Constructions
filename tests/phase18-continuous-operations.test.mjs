/**
 * Phase 18 Continuous Market Intelligence & Autonomous Operations Test Suite
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
  assertPublishability
} from '../lib/production-truth.ts';

import {
  generateDeterministicWhyNow
} from '../lib/why-now.ts';

import {
  calculateNextBestAction
} from '../lib/next-best-action.ts';

import {
  ingestAndProcessContinuousEvent
} from '../lib/continuous-intelligence.ts';

import {
  calculateDeterministicDealSize
} from '../lib/deal-sizing.ts';

import {
  evaluateCommercialGap
} from '../lib/commercial-gap.ts';

import {
  recommendServicesFromGaps
} from '../lib/service-recommendations.ts';

import {
  evaluateExecutiveVerdict
} from '../lib/executive-verdict.ts';

test('1. Why Now Engine: Deterministic Trigger Reasons', () => {
  const permitWhyNow = generateDeterministicWhyNow({
    companyName: 'Erbașu Construcții',
    latestPermit: {
      permitNumber: 'AC 84/2025',
      projectName: 'Clinical Hospital Complex',
      issueDate: '2026-08-14'
    },
    verifiedCommercialGap: 'Outdated corporate website portfolio'
  });

  assert.ok(permitWhyNow.primaryReason.includes('AC 84/2025'));
  assert.strictEqual(permitWhyNow.urgency, 'HIGH');
  assert.ok(permitWhyNow.evidenceCitations.includes('Building Permit AC 84/2025'));
  assert.ok(permitWhyNow.supportingReasons.some(r => r.includes('Outdated corporate website portfolio')));
});

test('2. Next Best Action 2.0: Urgency, Due Date & Channel Calculation', () => {
  const proposalAction = calculateNextBestAction({
    pipelineStatus: 'proposal_sent'
  });
  assert.strictEqual(proposalAction.action, 'FOLLOW UP');
  assert.strictEqual(proposalAction.urgency, 'CRITICAL');
  assert.strictEqual(proposalAction.recommendedChannel, 'PHONE');
  assert.ok(proposalAction.dueDate.length > 0);

  const permitCallAction = calculateNextBestAction({
    pipelineStatus: 'discovered',
    hasActivePermit: true,
    hasVerifiedPhone: true
  });
  assert.strictEqual(permitCallAction.action, 'CALL NOW');
  assert.strictEqual(permitCallAction.recommendedChannel, 'PHONE');
  assert.strictEqual(permitCallAction.urgency, 'HIGH');
});

test('3. Continuous Intelligence: Market Event Pipeline Execution', async () => {
  const result = await ingestAndProcessContinuousEvent({
    companyId: 'co-erbasu',
    changeCategory: 'BUILDING_PERMIT',
    title: 'AC 84/2025 Hospital Facility Superstructure',
    location: 'Bucharest Sector 1',
    sourceUrl: 'https://sector1urbanism.ro/permits/2025-08',
    sourceTier: 'PRIMARY',
    commercialRelevance: 'CRITICAL',
    previousPriority: 76
  });

  assert.strictEqual(result.success, true);
  assert.strictEqual(result.scoreDelta, 18, 'CRITICAL permit change must produce +18 delta');
  assert.strictEqual(result.newPriority, 94);
  assert.ok(result.whyNow.includes('AC 84/2025'));
  assert.strictEqual(result.nextBestAction, 'CALL NOW');
});

test('4. Deal Sizing Determinism & Range Consistency', () => {
  const deal = calculateDeterministicDealSize({
    companyType: 'General Contractor',
    activeProjectsCount: 4,
    hasVerifiedWebsiteGap: true,
    hasVerifiedMediaGap: true
  });

  assert.ok(deal.estimatedMin >= 18000);
  assert.ok(deal.estimatedMax >= 30000);
  assert.strictEqual(deal.currency, 'EUR');
  assert.strictEqual(deal.confidence, 'HIGH');
  assert.ok(deal.factors.length >= 3);
});

test('5. Anti-Fabrication & Strict Production Truth Firewall', () => {
  assert.doesNotThrow(() => {
    assertProductionAuthority();
  });

  const validRel = assertVerifiedRelationship({
    company_id: 'co-1',
    project_id: 'proj-1',
    source_url: 'https://e-licitatie.ro/100234',
    verified_at: '2026-08-16'
  });
  assert.strictEqual(validRel.isValid, true);

  const unverifiedRel = assertVerifiedRelationship({
    company_id: 'co-1',
    project_id: 'proj-1',
    source_url: null,
    verified_at: null
  });
  assert.strictEqual(unverifiedRel.isValid, false);
});

test('6. Commercial Gap Snapshot State Evaluation', () => {
  const gap = evaluateCommercialGap('LEAD_GENERATION', 'WEAK', 'No investor inquiry portal', 'https://erbasu.ro');
  assert.strictEqual(gap.status, 'VERIFIED_GAP');
  assert.strictEqual(gap.commercialRelevance, 'CRITICAL');
});

test('7. Service Package Recommendation From Multi-Gap Portfolio', () => {
  const gaps = [
    evaluateCommercialGap('WEBSITE', 'WEAK', 'Outdated layout', 'https://erbasu.ro'),
    evaluateCommercialGap('PHOTOGRAPHY', 'WEAK', 'Low-res project images', 'https://erbasu.ro')
  ];
  const recs = recommendServicesFromGaps(gaps, 3);
  assert.ok(recs.some(r => r.serviceKey === 'CORPORATE_WEB_ARCHITECTURE'));
  assert.ok(recs.some(r => r.serviceKey === 'INSTITUTIONAL_MEDIA_PRODUCTION'));
  assert.ok(recs.some(r => r.serviceKey === 'PROJECT_SHOWCASE_PORTAL'));
});

test('8. Next Best Action Cooling Period Enforcement', () => {
  const coolAction = calculateNextBestAction({
    coolingPeriodActive: true
  });
  assert.strictEqual(coolAction.action, 'DO NOT CONTACT');
  assert.ok(coolAction.rationale.includes('cooling period'));
});

test('9. Executive Verdict Engine Full Coverage', () => {
  const v1 = evaluateExecutiveVerdict({
    companyVerified: true,
    hasVerifiedRelationship: true,
    hasVerifiedDecisionMaker: true,
    priorityScore: 92,
    confidence: 'HIGH'
  });
  assert.strictEqual(v1.verdict, 'YES');

  const v2 = evaluateExecutiveVerdict({
    companyVerified: true,
    hasVerifiedRelationship: false,
    hasVerifiedDecisionMaker: true,
    priorityScore: 92,
    confidence: 'MEDIUM'
  });
  assert.strictEqual(v2.verdict, 'WAIT');
});

test('10. Level 04 Directly Confirmed Decision Maker Verification', () => {
  const dm = assertVerifiedDecisionMaker({
    name: 'Cristian Erbașu',
    role: 'CEO',
    phone: '+40 21 232 3000',
    verification_state: 'CONFIRMED_BY_CONTACT'
  });
  assert.strictEqual(dm.isVerified, true);
  assert.strictEqual(dm.canDirectOutreach, true);
  assert.strictEqual(dm.level, '04_CONFIRMED');
});

test('11. Project Publication Boundary Enforcement', () => {
  const publishedProj = assertPublishability({
    id: 'p-1',
    name: 'Hospital Complex',
    content_state: 'published'
  });
  assert.strictEqual(publishedProj, true);

  const draftProj = assertPublishability({
    id: 'p-2',
    name: 'Draft Project',
    content_state: 'draft'
  });
  assert.strictEqual(draftProj, false);
});

test('12. Commercial Eligibility Guard', () => {
  const eligible = assertCommercialEligibility({ is_not_a_fit: false, active_cooling: false });
  assert.strictEqual(eligible.isEligible, true);

  const disqualified = assertCommercialEligibility({ is_not_a_fit: true });
  assert.strictEqual(disqualified.isEligible, false);
});

test('13. Outreach Eligibility Guard', () => {
  const outEligible = assertOutreachEligibility({
    companyVerified: true,
    hasVerifiedDecisionMaker: true,
    isNotAFit: false
  });
  assert.strictEqual(outEligible.eligible, true);

  const outBlocked = assertOutreachEligibility({
    companyVerified: false,
    hasVerifiedDecisionMaker: true
  });
  assert.strictEqual(outBlocked.eligible, false);
});

test('14. Market Signal Validation Guard', () => {
  const sigValid = assertVerifiedMarketSignal({
    event_type: 'BUILDING_PERMIT',
    source_url: 'https://sector1urbanism.ro/ac-84'
  });
  assert.strictEqual(sigValid.isValid, true);

  const sigInvalid = assertVerifiedMarketSignal({
    event_type: 'BUILDING_PERMIT',
    source_url: null
  });
  assert.strictEqual(sigInvalid.isValid, false);
});

test('15. Verified Digital Audit Deficiency Handling', () => {
  const auditDeficiency = assertVerifiedDigitalAudit('website', 'WEAK');
  assert.strictEqual(auditDeficiency.isDeficiency, true);
  assert.strictEqual(auditDeficiency.status, 'VERIFIED_GAP');

  const auditUnknown = assertVerifiedDigitalAudit('photography', 'UNKNOWN');
  assert.strictEqual(auditUnknown.isDeficiency, false);
  assert.strictEqual(auditUnknown.status, 'UNKNOWN');
});
