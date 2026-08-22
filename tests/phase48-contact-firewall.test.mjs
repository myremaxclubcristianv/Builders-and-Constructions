import test from 'node:test';
import assert from 'node:assert/strict';
import { canExecuteCallNow } from '../lib/contact-firewall.ts';

test('1. Direct Contact Firewall: Valid Level 03 + phone + provenance is ALLOWED', () => {
  const result = canExecuteCallNow({
    phone: '+40 722 000 000',
    contactLevel: 'LEVEL_03',
    hasProvenance: true,
    isCommerciallyEligible: true,
    activeCooling: false,
    doNotContact: false
  });
  assert.equal(result.canCall, true);
  assert.equal(result.label, 'CALL NOW');
});

test('2. Direct Contact Firewall: Valid Level 04 + phone + provenance is ALLOWED', () => {
  const result = canExecuteCallNow({
    phone: '+40 722 000 000',
    contactLevel: 'LEVEL_04',
    hasProvenance: true,
    isCommerciallyEligible: true,
    activeCooling: false,
    doNotContact: false
  });
  assert.equal(result.canCall, true);
  assert.equal(result.label, 'CALL NOW');
});

test('3. Direct Contact Firewall: Level 02 + phone is BLOCKED', () => {
  const result = canExecuteCallNow({
    phone: '+40 722 000 000',
    contactLevel: 'LEVEL_02',
    hasProvenance: true,
    isCommerciallyEligible: true
  });
  assert.equal(result.canCall, false);
  assert.equal(result.label, 'CONTACT VERIFICATION REQUIRED');
});

test('4. Direct Contact Firewall: Level 03 without phone is BLOCKED', () => {
  const result = canExecuteCallNow({
    phone: null,
    contactLevel: 'LEVEL_03',
    hasProvenance: true,
    isCommerciallyEligible: true
  });
  assert.equal(result.canCall, false);
  assert.equal(result.label, 'CONTACT VERIFICATION REQUIRED');
});

test('5. Direct Contact Firewall: Level 03 without provenance is BLOCKED', () => {
  const result = canExecuteCallNow({
    phone: '+40 722 000 000',
    contactLevel: 'LEVEL_03',
    hasProvenance: false,
    verificationSource: 'UNVERIFIED',
    isCommerciallyEligible: true
  });
  assert.equal(result.canCall, false);
  assert.equal(result.label, 'CONTACT VERIFICATION REQUIRED');
});

test('6. Direct Contact Firewall: Active cooling blocks CALL NOW', () => {
  const result = canExecuteCallNow({
    phone: '+40 722 000 000',
    contactLevel: 'LEVEL_03',
    hasProvenance: true,
    isCommerciallyEligible: true,
    activeCooling: true
  });
  assert.equal(result.canCall, false);
  assert.equal(result.label, 'CONTACT VERIFICATION REQUIRED');
});

test('7. Direct Contact Firewall: Do Not Contact state blocks CALL NOW', () => {
  const result = canExecuteCallNow({
    phone: '+40 722 000 000',
    contactLevel: 'LEVEL_03',
    hasProvenance: true,
    isCommerciallyEligible: true,
    doNotContact: true
  });
  assert.equal(result.canCall, false);
  assert.equal(result.label, 'CONTACT VERIFICATION REQUIRED');
});

test('8. Direct Contact Firewall: Commercially ineligible company is BLOCKED', () => {
  const result = canExecuteCallNow({
    phone: '+40 722 000 000',
    contactLevel: 'LEVEL_03',
    hasProvenance: true,
    isNotAFit: true
  });
  assert.equal(result.canCall, false);
  assert.equal(result.label, 'CONTACT VERIFICATION REQUIRED');
});
