import { realCompaniesDataset, realProjectsDataset, realLocationsDataset } from '@/lib/real-romanian-data';

export interface EntityResolutionResult {
  isResolvable: boolean;
  type: 'company' | 'project' | 'city';
  canonicalSlug: string;
  href: string;
  name: string;
  statusDisplay: string;
  locationDisplay: string;
  verificationLevel: string;
  latestChange: string;
  latestSignal: string;
  isRemapped?: boolean;
  remappedFrom?: string;
}

// Legacy / Stale slug remapping dictionary
const LEGACY_SLUG_MAPPINGS: Record<string, { targetSlug: string; targetType: 'company' | 'project' | 'city' }> = {
  'ctpark-cluj': { targetSlug: 'ctpark-cluj-logistics', targetType: 'project' },
  'comp-ctp-cluj-development': { targetSlug: 'ctp-romania', targetType: 'company' },
  'speedwell-riverside-arad': { targetSlug: 'speedwell-riverside-arad-site', targetType: 'project' },
  'comp-speedwell-riverside-arad': { targetSlug: 'speedwell', targetType: 'company' },
  'porr-construct': { targetSlug: 'porr-construct-romania', targetType: 'company' },
  'comp-porr-construct': { targetSlug: 'porr-construct-romania', targetType: 'company' }
};

export function resolveEntityRoute(
  rawType: string,
  rawSlug: string,
  fallbackName?: string
): EntityResolutionResult {
  let type = (rawType || '').toLowerCase().trim();
  let slug = (rawSlug || '').trim();

  // Normalize company type synonyms
  if (['developer', 'general_contractor', 'contractor', 'architect', 'architecture', 'engineering', 'mep', 'real_estate_agency', 'agency', 'infrastructure_contractor'].includes(type)) {
    type = 'company';
  }

  let isRemapped = false;
  let remappedFrom: string | undefined = undefined;

  // Check legacy mapping
  if (LEGACY_SLUG_MAPPINGS[slug]) {
    const mapping = LEGACY_SLUG_MAPPINGS[slug];
    remappedFrom = slug;
    slug = mapping.targetSlug;
    type = mapping.targetType;
    isRemapped = true;
  }

  // 1. Try resolving as company
  if (type === 'company') {
    const comp = realCompaniesDataset.find(c => c.slug === slug);
    if (comp) {
      return {
        isResolvable: true,
        type: 'company',
        canonicalSlug: comp.slug,
        href: `/companies/${comp.slug}`,
        name: comp.name,
        statusDisplay: comp.verification_level || 'OFFICIAL_CORPORATE_VERIFIED',
        locationDisplay: comp.location || 'Romania',
        verificationLevel: 'VERIFIED',
        latestChange: comp.last_verified_at ? `Profile verified ${comp.last_verified_at.slice(0, 10)}` : 'Verified Corporate Profile',
        latestSignal: comp.sources?.[0]?.title ? `Citation: ${comp.sources[0].title}` : 'Corporate Register Filing',
        isRemapped,
        remappedFrom
      };
    }
  }

  // 2. Try resolving as project
  if (type === 'project') {
    const proj = realProjectsDataset.find(p => p.slug === slug);
    if (proj) {
      return {
        isResolvable: true,
        type: 'project',
        canonicalSlug: proj.slug,
        href: `/projects/${proj.slug}`,
        name: proj.name,
        statusDisplay: proj.status_display || proj.status || 'UNDER CONSTRUCTION',
        locationDisplay: proj.location || 'Romania',
        verificationLevel: 'VERIFIED',
        latestChange: proj.last_verified_at ? `Stage verified ${proj.last_verified_at.slice(0, 10)}` : 'Milestone Logged',
        latestSignal: proj.sources?.[0]?.title ? `Source: ${proj.sources[0].title}` : 'Official Permit Citation',
        isRemapped,
        remappedFrom
      };
    }
  }

  // 3. Try resolving as city
  if (type === 'city' || type === 'location') {
    const loc = realLocationsDataset.find(l => l.slug === slug);
    if (loc) {
      return {
        isResolvable: true,
        type: 'city',
        canonicalSlug: loc.slug,
        href: `/cities/${loc.slug}`,
        name: loc.name,
        statusDisplay: 'DOCUMENTED HUB',
        locationDisplay: loc.county ? `${loc.name} · ${loc.county}` : loc.name,
        verificationLevel: 'DOCUMENTED',
        latestChange: 'Regional Intelligence Active',
        latestSignal: 'Hub Dataset Coverage Verified',
        isRemapped,
        remappedFrom
      };
    }
  }

  // 4. Cross-check fallback: what if slug exists as company but type was passed as project or vice-versa?
  const crossComp = realCompaniesDataset.find(c => c.slug === slug);
  if (crossComp) {
    return {
      isResolvable: true,
      type: 'company',
      canonicalSlug: crossComp.slug,
      href: `/companies/${crossComp.slug}`,
      name: crossComp.name,
      statusDisplay: crossComp.verification_level || 'OFFICIAL_CORPORATE_VERIFIED',
      locationDisplay: crossComp.location || 'Romania',
      verificationLevel: 'VERIFIED',
      latestChange: crossComp.last_verified_at ? `Profile verified ${crossComp.last_verified_at.slice(0, 10)}` : 'Verified Corporate Profile',
      latestSignal: crossComp.sources?.[0]?.title ? `Citation: ${crossComp.sources[0].title}` : 'Corporate Register Filing',
      isRemapped: true,
      remappedFrom: `${rawType}/${rawSlug}`
    };
  }

  const crossProj = realProjectsDataset.find(p => p.slug === slug);
  if (crossProj) {
    return {
      isResolvable: true,
      type: 'project',
      canonicalSlug: crossProj.slug,
      href: `/projects/${crossProj.slug}`,
      name: crossProj.name,
      statusDisplay: crossProj.status_display || crossProj.status || 'UNDER CONSTRUCTION',
      locationDisplay: crossProj.location || 'Romania',
      verificationLevel: 'VERIFIED',
      latestChange: crossProj.last_verified_at ? `Stage verified ${crossProj.last_verified_at.slice(0, 10)}` : 'Milestone Logged',
      latestSignal: crossProj.sources?.[0]?.title ? `Source: ${crossProj.sources[0].title}` : 'Official Permit Citation',
      isRemapped: true,
      remappedFrom: `${rawType}/${rawSlug}`
    };
  }

  const crossLoc = realLocationsDataset.find(l => l.slug === slug);
  if (crossLoc) {
    return {
      isResolvable: true,
      type: 'city',
      canonicalSlug: crossLoc.slug,
      href: `/cities/${crossLoc.slug}`,
      name: crossLoc.name,
      statusDisplay: 'DOCUMENTED HUB',
      locationDisplay: crossLoc.county ? `${crossLoc.name} · ${crossLoc.county}` : crossLoc.name,
      verificationLevel: 'DOCUMENTED',
      latestChange: 'Regional Intelligence Active',
      latestSignal: 'Hub Dataset Coverage Verified',
      isRemapped: true,
      remappedFrom: `${rawType}/${rawSlug}`
    };
  }

  // Unresolvable state
  return {
    isResolvable: false,
    type: (['company', 'project', 'city'].includes(type) ? type : 'company') as 'company' | 'project' | 'city',
    canonicalSlug: slug,
    href: '',
    name: fallbackName || slug || 'Unknown Entity',
    statusDisplay: 'ENTITY UNAVAILABLE',
    locationDisplay: 'Romania',
    verificationLevel: 'UNAVAILABLE',
    latestChange: 'Entity Record Not Found',
    latestSignal: 'Unmapped Entity'
  };
}
