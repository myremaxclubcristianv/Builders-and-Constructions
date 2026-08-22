/**
 * Centralized Direct Contact Firewall
 * CONSTRUCTIONS by AiXLuxury — Phase 48
 *
 * Enforces unified authorization rules for rendering "CALL NOW" vs "CONTACT VERIFICATION REQUIRED"
 * across all commercial UI components, server functions, and API execution paths.
 */

export type ContactFirewallInput = {
  phone?: string | null;
  contactLevel?: 'LEVEL_01' | 'LEVEL_02' | 'LEVEL_03' | 'LEVEL_04' | string | null;
  role?: string | null;
  hasProvenance?: boolean;
  verificationSource?: string | null;
  isCommerciallyEligible?: boolean;
  isNotAFit?: boolean;
  isDisqualified?: boolean;
  activeCooling?: boolean;
  doNotContact?: boolean;
};

export type ContactFirewallResult = {
  canCall: boolean;
  label: 'CALL NOW' | 'CONTACT VERIFICATION REQUIRED';
  reason: string;
};

export function canExecuteCallNow(input: ContactFirewallInput): ContactFirewallResult {
  // 1. Phone requirement
  if (!input.phone || input.phone.trim().length === 0) {
    return {
      canCall: false,
      label: 'CONTACT VERIFICATION REQUIRED',
      reason: 'No direct contact phone number registered.'
    };
  }

  // 2. Do Not Contact block
  if (input.doNotContact) {
    return {
      canCall: false,
      label: 'CONTACT VERIFICATION REQUIRED',
      reason: 'Company or decision maker is under explicit DO NOT CONTACT restriction.'
    };
  }

  // 3. Active Cooling block
  if (input.activeCooling) {
    return {
      canCall: false,
      label: 'CONTACT VERIFICATION REQUIRED',
      reason: 'Active contact cooling period prevents immediate telephone outreach.'
    };
  }

  // 4. Commercial Eligibility block
  if (input.isNotAFit || input.isDisqualified || input.isCommerciallyEligible === false) {
    return {
      canCall: false,
      label: 'CONTACT VERIFICATION REQUIRED',
      reason: 'Opportunity is commercially ineligible or marked as Not a Fit.'
    };
  }

  // 5. Verification Level requirement (Level 03 or Level 04 required)
  const isLevel03Or04 =
    input.contactLevel === 'LEVEL_03' ||
    input.contactLevel === 'LEVEL_04' ||
    (input.role &&
      (input.role.toLowerCase().includes('director') ||
        input.role.toLowerCase().includes('ceo') ||
        input.role.toLowerCase().includes('head') ||
        input.role.toLowerCase().includes('managing') ||
        input.role.toLowerCase().includes('executive') ||
        input.role.toLowerCase().includes('administrator') ||
        input.role.toLowerCase().includes('manager')));

  if (!isLevel03Or04) {
    return {
      canCall: false,
      label: 'CONTACT VERIFICATION REQUIRED',
      reason: 'Contact verification level is below LEVEL_03 threshold. Level 04 enrichment required.'
    };
  }

  // 6. Provenance / Evidence requirement
  const hasValidProvenance =
    input.hasProvenance === true ||
    (Boolean(input.verificationSource) && input.verificationSource !== 'UNVERIFIED' && input.verificationSource !== 'GENERIC_SWITCHBOARD');

  if (!hasValidProvenance) {
    return {
      canCall: false,
      label: 'CONTACT VERIFICATION REQUIRED',
      reason: 'Contact lacks direct confirmed primary source provenance.'
    };
  }

  return {
    canCall: true,
    label: 'CALL NOW',
    reason: 'Contact is Level 03+ verified with valid provenance, direct phone, and commercial eligibility.'
  };
}
