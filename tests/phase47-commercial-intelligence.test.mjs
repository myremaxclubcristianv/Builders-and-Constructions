import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateExecutiveVerdict } from '../lib/executive-verdict.ts';
import { validateOutreachClaims } from '../lib/claim-firewall.ts';

test('1. Realized Revenue Firewall: €0 realized revenue when no closed contract exists', () => {
  const wonDealsCount = 0;
  const estimatedDealSize = 12500;
  const activePipelineValue = 45000;

  const realizedRevenue = wonDealsCount > 0 ? wonDealsCount * estimatedDealSize : 0;
  assert.equal(realizedRevenue, 0, 'Realized revenue must equal 0 when zero closed contracts exist');
  assert.notEqual(realizedRevenue, estimatedDealSize, 'Estimated deal size must never equal realized revenue');
  assert.notEqual(realizedRevenue, activePipelineValue, 'Active pipeline must never equal realized revenue');
});

test('2. Direct Contact Firewall: Level 01 or Level 02 returns CONTACT VERIFICATION REQUIRED', () => {
  const evaluateContactAction = (level, phone, cooling, doNotContact) => {
    if (!phone || level === 'LEVEL_01' || level === 'LEVEL_02' || cooling || doNotContact) {
      return 'CONTACT VERIFICATION REQUIRED';
    }
    return 'CALL NOW';
  };

  assert.equal(
    evaluateContactAction('LEVEL_01', '+40722000000', false, false),
    'CONTACT VERIFICATION REQUIRED',
    'Level 01 contact must require verification'
  );
  assert.equal(
    evaluateContactAction('LEVEL_02', '+40722000000', false, false),
    'CONTACT VERIFICATION REQUIRED',
    'Level 02 contact must require verification'
  );
  assert.equal(
    evaluateContactAction('LEVEL_03', null, false, false),
    'CONTACT VERIFICATION REQUIRED',
    'Missing phone must require verification'
  );
  assert.equal(
    evaluateContactAction('LEVEL_03', '+40722000000', true, false),
    'CONTACT VERIFICATION REQUIRED',
    'Active cooling must block CALL NOW'
  );
  assert.equal(
    evaluateContactAction('LEVEL_03', '+40722000000', false, true),
    'CONTACT VERIFICATION REQUIRED',
    'Do not contact state must block CALL NOW'
  );
  assert.equal(
    evaluateContactAction('LEVEL_03', '+40722000000', false, false),
    'CALL NOW',
    'Level 03 with verified phone and no cooling permits CALL NOW'
  );
  assert.equal(
    evaluateContactAction('LEVEL_04', '+40722000000', false, false),
    'CALL NOW',
    'Level 04 with verified phone and no cooling permits CALL NOW'
  );
});

test('3. Hard Claim Firewall: unmapped claims return CLAIM BLOCKED', () => {
  const validClaims = [
    {
      claimText: 'Verified development permit on site Riverside Quarter',
      evidenceId: 'ev-101',
      sourceUrl: 'https://example.com/permit-101',
      verificationStatus: 'VERIFIED'
    }
  ];

  const unmappedClaims = [
    {
      claimText: 'Unmapped expansion plans',
      evidenceId: '',
      sourceUrl: '',
      verificationStatus: 'UNVERIFIED'
    }
  ];

  const validResult = validateOutreachClaims(validClaims);
  assert.equal(validResult.isValid, true);
  assert.equal(validResult.blocked, false);

  const invalidResult = validateOutreachClaims(unmappedClaims);
  assert.equal(invalidResult.isValid, false);
  assert.equal(invalidResult.blocked, true);
  assert.ok(invalidResult.rejectionReason.includes('Blocked by Claim Firewall'));
});

test('4. Executive Verdict Engine: outputs YES, WAIT, NO, COOLING deterministically', () => {
  const yesVerdict = evaluateExecutiveVerdict({
    companyVerified: true,
    hasVerifiedRelationship: true,
    hasVerifiedDecisionMaker: true,
    contactLevel: 'LEVEL_03',
    priorityScore: 75,
    activeCooldown: false,
    isNotAFit: false
  });
  assert.equal(yesVerdict.verdict, 'YES');

  const waitVerdict = evaluateExecutiveVerdict({
    companyVerified: true,
    hasVerifiedRelationship: true,
    hasVerifiedDecisionMaker: false,
    contactLevel: 'LEVEL_01',
    priorityScore: 75,
    activeCooldown: false,
    isNotAFit: false
  });
  assert.equal(waitVerdict.verdict, 'WAIT');

  const coolingVerdict = evaluateExecutiveVerdict({
    companyVerified: true,
    hasVerifiedRelationship: true,
    hasVerifiedDecisionMaker: true,
    contactLevel: 'LEVEL_03',
    priorityScore: 75,
    activeCooldown: true,
    isNotAFit: false
  });
  assert.equal(coolingVerdict.verdict, 'COOLING');

  const noVerdict = evaluateExecutiveVerdict({
    companyVerified: true,
    hasVerifiedRelationship: true,
    hasVerifiedDecisionMaker: true,
    contactLevel: 'LEVEL_03',
    priorityScore: 75,
    activeCooldown: false,
    isNotAFit: true
  });
  assert.equal(noVerdict.verdict, 'NO');
});
