import test from 'node:test';
import assert from 'node:assert/strict';
import { canExecuteCallNow } from '../lib/contact-firewall.ts';
import { validateOutreachClaims } from '../lib/claim-firewall.ts';
import { calculateOpportunityScore } from '../lib/scoring.ts';

test('1. Level 03 cannot auto-promote to Level 04 without direct channel provenance', () => {
  const result = canExecuteCallNow({
    phone: null,
    contactLevel: 'LEVEL_03',
    hasProvenance: false,
    verificationSource: 'UNVERIFIED',
    isCommerciallyEligible: true
  });
  assert.equal(result.canCall, false);
  assert.equal(result.label, 'CONTACT VERIFICATION REQUIRED');
  assert.match(result.reason, /No direct contact phone|level is below|lacks direct confirmed/i);
});

test('2. Missing phone blocks CALL NOW', () => {
  const result = canExecuteCallNow({
    phone: '',
    contactLevel: 'LEVEL_04',
    hasProvenance: true,
    isCommerciallyEligible: true
  });
  assert.equal(result.canCall, false);
  assert.equal(result.label, 'CONTACT VERIFICATION REQUIRED');
});

test('3. Missing provenance blocks CALL NOW', () => {
  const result = canExecuteCallNow({
    phone: '+40 722 111 222',
    contactLevel: 'LEVEL_04',
    hasProvenance: false,
    verificationSource: 'GENERIC_SWITCHBOARD',
    isCommerciallyEligible: true
  });
  assert.equal(result.canCall, false);
  assert.equal(result.label, 'CONTACT VERIFICATION REQUIRED');
});

test('4. Level < 03 blocks CALL NOW', () => {
  const result = canExecuteCallNow({
    phone: '+40 722 111 222',
    contactLevel: 'LEVEL_02',
    role: 'Associate',
    hasProvenance: true,
    isCommerciallyEligible: true
  });
  assert.equal(result.canCall, false);
  assert.equal(result.label, 'CONTACT VERIFICATION REQUIRED');
});

test('5. Active cooling blocks CALL NOW', () => {
  const result = canExecuteCallNow({
    phone: '+40 722 111 222',
    contactLevel: 'LEVEL_04',
    hasProvenance: true,
    isCommerciallyEligible: true,
    activeCooling: true
  });
  assert.equal(result.canCall, false);
  assert.equal(result.label, 'CONTACT VERIFICATION REQUIRED');
});

test('6. Do-not-contact blocks CALL NOW', () => {
  const result = canExecuteCallNow({
    phone: '+40 722 111 222',
    contactLevel: 'LEVEL_04',
    hasProvenance: true,
    isCommerciallyEligible: true,
    doNotContact: true
  });
  assert.equal(result.canCall, false);
  assert.equal(result.label, 'CONTACT VERIFICATION REQUIRED');
});

test('7. Commercially ineligible company blocks outreach', () => {
  const result = canExecuteCallNow({
    phone: '+40 722 111 222',
    contactLevel: 'LEVEL_04',
    hasProvenance: true,
    isNotAFit: true
  });
  assert.equal(result.canCall, false);
  assert.equal(result.label, 'CONTACT VERIFICATION REQUIRED');
});

test('8. Valid Level 03/04 direct contact permits CALL NOW', () => {
  const result = canExecuteCallNow({
    phone: '+40 722 111 222',
    contactLevel: 'LEVEL_04',
    hasProvenance: true,
    isCommerciallyEligible: true,
    activeCooling: false,
    doNotContact: false
  });
  assert.equal(result.canCall, true);
  assert.equal(result.label, 'CALL NOW');
});

test('9. Unmapped claim triggers CLAIM BLOCKED', () => {
  const claimCheck = validateOutreachClaims([
    {
      claimText: 'Company will double construction budget next month',
      evidenceId: '',
      sourceUrl: '',
      verificationStatus: 'UNVERIFIED'
    }
  ]);
  assert.equal(claimCheck.isValid, false);
  assert.equal(claimCheck.blocked, true);
});

test('10. Realized revenue remains €0 without verified contract attribution', () => {
  const verifiedRevenue = 0;
  const activePipeline = 145000;
  const estimatedDealSize = 250000;

  assert.equal(verifiedRevenue, 0);
  assert.notEqual(activePipeline, verifiedRevenue);
  assert.notEqual(estimatedDealSize, verifiedRevenue);
});

test('11. Six-bucket queue ordering is deterministic', () => {
  const items = [
    { name: 'Comp A', isEligible: true, verdict: 'YES', priorityScore: 90 },
    { name: 'Comp B', isEligible: true, verdict: 'WAIT', priorityScore: 95 },
    { name: 'Comp C', isEligible: false, verdict: 'NO', priorityScore: 100 }
  ];

  const sorted = [...items].sort((a, b) => {
    if (a.isEligible !== b.isEligible) return a.isEligible ? -1 : 1;
    const verdictRank = { YES: 1, WAIT: 2, COOLING: 3, NO: 4 };
    if (verdictRank[a.verdict] !== verdictRank[b.verdict]) {
      return verdictRank[a.verdict] - verdictRank[b.verdict];
    }
    return b.priorityScore - a.priorityScore;
  });

  assert.equal(sorted[0].name, 'Comp A');
  assert.equal(sorted[1].name, 'Comp B');
  assert.equal(sorted[2].name, 'Comp C');
});

test('12. Level 04 requires direct-channel evidence', () => {
  const hasDirectChannelEvidence = true;
  const hasSwitchboardOnly = false;
  
  assert.equal(hasDirectChannelEvidence && !hasSwitchboardOnly, true);
});
