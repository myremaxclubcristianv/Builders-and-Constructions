/**
 * Acquisition Priority Governance & Explainability Engine
 * CONSTRUCTIONS by AiXLuxury — Phase 15
 *
 * Full mathematical transparency, confidence governance, and hard blocker enforcement.
 * Guarantees that no acquisition score operates as an opaque black box.
 */

import { AcquisitionEntityInput, calculateProductionAcquisitionPriority, ProductionPriorityResult } from './acquisition';
import { RecommendedServiceItem } from './services';

export type AcquisitionConfidenceTier = 'HIGH' | 'MEDIUM' | 'LOW' | 'DISQUALIFIED';

export type GovernedPriorityScore = {
  totalScore: number; // 0 - 100
  tier: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: AcquisitionConfidenceTier;
  factors: {
    constructionActivity: number; // max 25
    opportunity: number; // max 25
    digitalGap: number; // max 20
    contactReadiness: number; // max 15
    timing: number; // max 15
    penalties: number;
  };
  penalties: string[];
  evidence: Array<{ fact: string; confidence: 'VERIFIED' | 'PARTIAL' | 'UNKNOWN' }>;
  reasons: string[];
  commercialGap: string;
  recommendedServices: RecommendedServiceItem[];
  estimatedDealSize: number;
  verdict: 'YES — CONTACT NOW' | 'WAIT — RESEARCH REQUIRED' | 'NO — DO NOT CONTACT';
};

/**
 * Deterministically calculates and governs acquisition priority with complete factor explainability.
 */
export function governAcquisitionPriority(input: AcquisitionEntityInput): GovernedPriorityScore {
  const prodResult: ProductionPriorityResult = calculateProductionAcquisitionPriority(input);

  let verdict: 'YES — CONTACT NOW' | 'WAIT — RESEARCH REQUIRED' | 'NO — DO NOT CONTACT' = 'WAIT — RESEARCH REQUIRED';
  if (prodResult.confidence === 'DISQUALIFIED' || prodResult.score === 0) {
    verdict = 'NO — DO NOT CONTACT';
  } else if (prodResult.score >= 70 && prodResult.confidence === 'HIGH') {
    verdict = 'YES — CONTACT NOW';
  } else if (prodResult.score >= 60 && prodResult.confidence === 'MEDIUM') {
    verdict = 'YES — CONTACT NOW';
  }

  return {
    totalScore: prodResult.score,
    tier: prodResult.tier,
    confidence: prodResult.confidence,
    factors: {
      constructionActivity: prodResult.factors.constructionActivity,
      opportunity: prodResult.factors.opportunity,
      digitalGap: prodResult.factors.digitalGap,
      contactReadiness: prodResult.factors.contactReadiness,
      timing: prodResult.factors.timing,
      penalties: prodResult.factors.penalties
    },
    penalties: prodResult.penalties,
    evidence: prodResult.evidence,
    reasons: prodResult.reasons,
    commercialGap: prodResult.commercialGap,
    recommendedServices: prodResult.recommendedServices,
    estimatedDealSize: prodResult.estimatedDealSize,
    verdict
  };
}
