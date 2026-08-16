/**
 * Phase 13 Automated Validation Suite
 * CONSTRUCTIONS by AiXLuxury
 */

import assert from 'node:assert';
import test from 'node:test';

import {
  normalizeRomanianPhone,
  normalizeDomain,
  normalizeCuiCif,
  calculateContactReadiness
} from '../lib/normalization.ts';

import {
  evaluateDigitalAuditDimension,
  requireVerifiedDecisionMaker,
  requireVerifiedSource
} from '../lib/data-contract.ts';

import {
  calculateDeterministicAcquisitionPriority,
  generateFactBasedOutreach
} from '../lib/acquisition.ts';

test('1. Romanian Phone Normalization', () => {
  assert.strictEqual(normalizeRomanianPhone('0722 123 456').normalized, '+40722123456');
  assert.strictEqual(normalizeRomanianPhone('0722 123 456').isValid, true);
  assert.strictEqual(normalizeRomanianPhone('0722 123 456').type, 'MOBILE');

  assert.strictEqual(normalizeRomanianPhone('021 232 3000').normalized, '+40212323000');
  assert.strictEqual(normalizeRomanianPhone('021 232 3000').type, 'LANDLINE');

  assert.strictEqual(normalizeRomanianPhone('0040 722 123 456').normalized, '+40722123456');
  assert.strictEqual(normalizeRomanianPhone('+40 722 123 456').normalized, '+40722123456');
});

test('2. Corporate Domain Normalization', () => {
  assert.strictEqual(normalizeDomain('https://www.erbasu.ro/'), 'erbasu.ro');
  assert.strictEqual(normalizeDomain('http://bogart.ro/projects/riverside?id=1'), 'bogart.ro');
  assert.strictEqual(normalizeDomain('WWW.STRABAG.RO'), 'strabag.ro');
});

test('3. Romanian CUI/CIF Normalization', () => {
  const cui1 = normalizeCuiCif('RO 1598732');
  assert.strictEqual(cui1.formatted, 'RO 1598732');
  assert.strictEqual(cui1.digits, '1598732');
  assert.strictEqual(cui1.isValid, true);

  const cui2 = normalizeCuiCif('1582910');
  assert.strictEqual(cui2.digits, '1582910');
  assert.strictEqual(cui2.isValid, true);
});

test('4. Digital Audit UNKNOWN handling (UNKNOWN != WEAK)', () => {
  const unknownEval = evaluateDigitalAuditDimension('unknown');
  assert.strictEqual(unknownEval.status, 'UNKNOWN');
  assert.strictEqual(unknownEval.isDeficiency, false);

  const missingEval = evaluateDigitalAuditDimension('no_website');
  assert.strictEqual(missingEval.status, 'MISSING');
  assert.strictEqual(missingEval.isDeficiency, true);

  const goodEval = evaluateDigitalAuditDimension('good');
  assert.strictEqual(goodEval.status, 'GOOD');
  assert.strictEqual(goodEval.isDeficiency, false);
});

test('5. Decision Maker Verification Level Classification', () => {
  const dm1 = requireVerifiedDecisionMaker({
    name: 'Cristian Erbașu',
    role: 'CEO',
    phone: '+40 21 232 3000',
    verification_state: 'company_verified'
  });
  assert.strictEqual(dm1.personIdentified, true);
  assert.strictEqual(dm1.contactVerified, true);
  assert.strictEqual(dm1.canUseForOutreach, true);

  const dm2 = requireVerifiedDecisionMaker({
    name: 'Unverified Contact',
    role: 'Manager',
    verification_state: 'UNVERIFIED'
  });
  assert.strictEqual(dm2.canUseForOutreach, false);
});

test('6. Contact Readiness Multi-Factor Calculation', () => {
  const readyResult = calculateContactReadiness({
    isCompanyVerified: true,
    projectsCount: 3,
    hasDecisionMaker: true,
    isDecisionMakerContactVerified: true,
    isDigitalAuditCompleted: true,
    opportunityScore: 85
  });
  assert.strictEqual(readyResult.isReady, true);
  assert.strictEqual(readyResult.tier, 'READY');
  assert.strictEqual(readyResult.missingRequirements.length, 0);

  const blockedResult = calculateContactReadiness({
    isCompanyVerified: true,
    projectsCount: 3,
    hasDecisionMaker: true,
    isDecisionMakerContactVerified: true,
    isDigitalAuditCompleted: true,
    opportunityScore: 85,
    isNotAFit: true
  });
  assert.strictEqual(blockedResult.isReady, false);
  assert.strictEqual(blockedResult.tier, 'BLOCKED');
});

test('7. Deterministic Scoring Reproducibility Test', () => {
  const candidateInput = {
    companyId: 'test-co-1',
    companyName: 'Erbașu Construcții',
    companyType: 'General Contractor',
    city: 'Bucharest',
    county: 'Bucharest',
    website: 'https://erbasu.ro',
    websiteStatus: 'active',
    activeProjects: [
      { id: 'p1', name: 'Hospital Facility', status: 'under_construction' },
      { id: 'p2', name: 'Campus Expansion', status: 'under_construction' }
    ],
    primaryDecisionMaker: {
      name: 'Cristian Erbașu',
      role: 'CEO',
      phone: '+40 21 232 3000',
      email: 'office@erbasu.ro',
      verificationState: 'company_verified'
    },
    baseOpportunityScore: 85,
    opportunitySignals: ['Weak project presentation', 'No lead generation']
  };

  const runA = calculateDeterministicAcquisitionPriority(candidateInput);
  const runB = calculateDeterministicAcquisitionPriority(candidateInput);

  assert.strictEqual(runA.score, runB.score, 'Scores must be strictly identical');
  assert.strictEqual(runA.tier, runB.tier, 'Tiers must be strictly identical');
  assert.deepStrictEqual(runA.reasons, runB.reasons, 'Reasons must be strictly identical');
  assert.strictEqual(runA.estimatedCommercialValue, runB.estimatedCommercialValue, 'Deal size must be identical');
});

test('8. Fact-Based Outreach Generation', () => {
  const drafts = generateFactBasedOutreach({
    companyId: 'test-co-1',
    companyName: 'Bog\'Art',
    city: 'Bucharest',
    activeProjects: [{ id: 'p1', name: 'Riverside Quarter', status: 'under_construction' }],
    primaryDecisionMaker: {
      name: 'Dan Boghiu',
      role: 'Commercial Director',
      verificationState: 'company_verified',
      source: 'Official Press Registry'
    }
  });

  assert.ok(drafts.executive_email.message.includes('Dan Boghiu'), 'Must include decision maker name');
  assert.ok(drafts.executive_email.message.includes('Bog\'Art'), 'Must include company name');
  assert.ok(drafts.executive_email.message.includes('Riverside Quarter'), 'Must cite active verified project');
});
