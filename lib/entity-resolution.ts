/**
 * Deterministic Entity Resolution Engine
 * CONSTRUCTIONS by AiXLuxury — Phase 19
 *
 * Resolves multiple market references to canonical production entities.
 * Hierarchy:
 * 1. CUI / CIF
 * 2. Exact legal entity name
 * 3. Verified official domain
 * 4. Normalized company identity
 * 5. Secondary corroboration
 */

import { normalizeCuiCif, normalizeDomain, normalizeCompanyName } from './normalization';

export type EntityResolutionCandidate = {
  rawName: string;
  rawCui?: string | null;
  rawDomain?: string | null;
  sourceUrl?: string | null;
};

export type CanonicalEntity = {
  id: string;
  name: string;
  cui_cif?: string | null;
  official_website?: string | null;
};

export type EntityResolutionResult = {
  canonicalId: string | null;
  canonicalName: string | null;
  confidence: number;
  resolutionMethod: 'CUI_MATCH' | 'DOMAIN_MATCH' | 'NORMALIZED_NAME_MATCH' | 'UNRESOLVED';
  isDuplicate: boolean;
  notes: string;
};

export function resolveCompanyEntity(
  candidate: EntityResolutionCandidate,
  canonicalList: CanonicalEntity[]
): EntityResolutionResult {
  const normCuiObj = candidate.rawCui ? normalizeCuiCif(candidate.rawCui) : null;
  const normCuiDigits = normCuiObj?.isValid ? normCuiObj.digits : null;
  const normDom = candidate.rawDomain ? normalizeDomain(candidate.rawDomain) : null;
  const normName = normalizeCompanyName(candidate.rawName);

  // 1. CUI Match
  if (normCuiDigits) {
    const cuiMatch = canonicalList.find(c => c.cui_cif && normalizeCuiCif(c.cui_cif).digits === normCuiDigits);
    if (cuiMatch) {
      return {
        canonicalId: cuiMatch.id,
        canonicalName: cuiMatch.name,
        confidence: 1.0,
        resolutionMethod: 'CUI_MATCH',
        isDuplicate: true,
        notes: `Exact trade register CUI match: ${normCuiDigits}`
      };
    }
  }

  // 2. Verified Domain Match
  if (normDom) {
    const domMatch = canonicalList.find(c => c.official_website && normalizeDomain(c.official_website) === normDom);
    if (domMatch) {
      return {
        canonicalId: domMatch.id,
        canonicalName: domMatch.name,
        confidence: 0.95,
        resolutionMethod: 'DOMAIN_MATCH',
        isDuplicate: true,
        notes: `Exact corporate domain match: ${normDom}`
      };
    }
  }

  // 3. Normalized Name Match
  if (normName) {
    const nameMatch = canonicalList.find(c => normalizeCompanyName(c.name) === normName);
    if (nameMatch) {
      return {
        canonicalId: nameMatch.id,
        canonicalName: nameMatch.name,
        confidence: 0.90,
        resolutionMethod: 'NORMALIZED_NAME_MATCH',
        isDuplicate: true,
        notes: `Normalized corporate name match: ${normName}`
      };
    }
  }

  return {
    canonicalId: null,
    canonicalName: null,
    confidence: 0.0,
    resolutionMethod: 'UNRESOLVED',
    isDuplicate: false,
    notes: 'No existing canonical entity match; eligible for distinct verified creation.'
  };
}
