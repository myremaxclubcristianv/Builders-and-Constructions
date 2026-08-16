/**
 * Deal Sizing Engine
 * CONSTRUCTIONS by AiXLuxury — Phase 17
 *
 * Deterministically estimates contract value ranges based on
 * company classification, active project volume, and verified services.
 */

export type DealSizeEstimate = {
  estimatedMin: number;
  estimatedMax: number;
  currency: 'EUR';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNAVAILABLE';
  factors: string[];
};

export type DealSizeInput = {
  companyType?: string;
  activeProjectsCount?: number;
  hasVerifiedWebsiteGap?: boolean;
  hasVerifiedMediaGap?: boolean;
  hasVerifiedLeadFunnelGap?: boolean;
  territory?: string;
};

export function calculateDeterministicDealSize(input: DealSizeInput): DealSizeEstimate {
  const activeCount = input.activeProjectsCount || 0;
  const isGeneralContractor = (input.companyType || '').toLowerCase().includes('general') || (input.companyType || '').toLowerCase().includes('contractor');
  const isDeveloper = (input.companyType || '').toLowerCase().includes('developer');

  let baseMin = 6500;
  let baseMax = 14000;
  const factors: string[] = [];

  if (isGeneralContractor) {
    baseMin += 4000;
    baseMax += 8000;
    factors.push('General Contractor scale (+€4,000–€8,000)');
  } else if (isDeveloper) {
    baseMin += 3000;
    baseMax += 6000;
    factors.push('Real Estate Developer scale (+€3,000–€6,000)');
  }

  if (activeCount >= 3) {
    baseMin += 5000;
    baseMax += 10000;
    factors.push(`Multi-site portfolio (${activeCount} active projects: +€5,000–€10,000)`);
  } else if (activeCount >= 1) {
    baseMin += 2000;
    baseMax += 4000;
    factors.push(`1-2 active sites under construction (+€2,000–€4,000)`);
  }

  if (input.hasVerifiedWebsiteGap) {
    baseMin += 3500;
    baseMax += 7000;
    factors.push('Verified corporate web architecture deficiency (+€3,500–€7,000)');
  }

  if (input.hasVerifiedMediaGap) {
    baseMin += 2500;
    baseMax += 5000;
    factors.push('Verified 4K construction milestone media gap (+€2,500–€5,000)');
  }

  return {
    estimatedMin: baseMin,
    estimatedMax: baseMax,
    currency: 'EUR',
    confidence: activeCount > 0 ? 'HIGH' : 'MEDIUM',
    factors
  };
}
