/**
 * Commercial Gap Engine v2
 * CONSTRUCTIONS by AiXLuxury — Phase 17
 *
 * Audits only evidence-backed deficiencies across 12 digital maturity dimensions.
 * Strictly guarantees that UNKNOWN != VERIFIED_GAP.
 */

export type CommercialGapDimension =
  | 'WEBSITE'
  | 'MOBILE_EXPERIENCE'
  | 'SEO'
  | 'PROJECT_PRESENTATION'
  | 'PHOTOGRAPHY'
  | 'VIDEO'
  | 'BRANDING'
  | 'LEAD_GENERATION'
  | 'PROJECT_MARKETING'
  | 'PROPERTY_MARKETING'
  | 'CONTENT'
  | 'DIGITAL_AUTHORITY';

export type CommercialGapState = 'VERIFIED_GAP' | 'POSSIBLE_GAP' | 'UNKNOWN' | 'NO_GAP';

export type CommercialGapItem = {
  dimension: CommercialGapDimension;
  status: CommercialGapState;
  evidence: string;
  sourceUrl?: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  commercialRelevance: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
};

export function evaluateCommercialGap(
  dimension: CommercialGapDimension,
  rawStatus?: string,
  evidenceText?: string,
  sourceUrl?: string
): CommercialGapItem {
  const norm = (rawStatus || 'UNKNOWN').toUpperCase();

  let status: CommercialGapState = 'UNKNOWN';
  let confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  let commercialRelevance: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';

  if (norm === 'UNKNOWN' || norm === 'PENDING' || !rawStatus) {
    status = 'UNKNOWN';
    confidence = 'LOW';
  } else if (norm === 'WEAK' || norm === 'MISSING' || norm === 'NEEDS_IMPROVEMENT') {
    status = 'VERIFIED_GAP';
    confidence = sourceUrl ? 'HIGH' : 'MEDIUM';
    commercialRelevance = dimension === 'WEBSITE' || dimension === 'LEAD_GENERATION' ? 'CRITICAL' : 'HIGH';
  } else if (norm === 'ADEQUATE' || norm === 'STRONG' || norm === 'GOOD') {
    status = 'NO_GAP';
    confidence = 'HIGH';
    commercialRelevance = 'LOW';
  } else {
    status = 'POSSIBLE_GAP';
    confidence = 'MEDIUM';
  }

  return {
    dimension,
    status,
    evidence: evidenceText || (status === 'UNKNOWN' ? 'Audit pending.' : 'Digital audit verified.'),
    sourceUrl,
    confidence,
    commercialRelevance
  };
}
