/**
 * Company Imagery & Portfolio Relationship Intelligence Engine
 * Handles entity-specific image resolution, source provenance attribution,
 * and neutral fallback rendering without fake stock image contamination.
 */

export interface CompanyImageResolution {
  url: string | null;
  status: 'VERIFIED_CORPORATE_IMAGE' | 'VERIFIED_PROJECT_IMAGE' | 'NOT_DISCLOSED_FALLBACK';
  sourceTier: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  sourceTitle: string;
  sourceUrl?: string;
  caption: string;
  isFallback: boolean;
}

export function resolveCompanyImage(company: any, connectedProjects: any[] = []): CompanyImageResolution {
  if (!company) {
    return {
      url: null,
      status: 'NOT_DISCLOSED_FALLBACK',
      sourceTier: 'F',
      sourceTitle: 'N/A — No Verified Public Image Available',
      caption: 'IMAGE STATUS: NOT DISCLOSED IN PUBLIC BASELINE',
      isFallback: true
    };
  }

  // Priority 1: Official Corporate Source Image
  if (company.image && typeof company.image === 'string' && company.image.startsWith('http')) {
    return {
      url: company.image,
      status: 'VERIFIED_CORPORATE_IMAGE',
      sourceTier: 'B',
      sourceTitle: company.image_source || 'Official Company Media / Corporate Headquarters',
      sourceUrl: company.website || undefined,
      caption: company.image_alt || `${company.name} Corporate Headquarters`,
      isFallback: false
    };
  }

  // Priority 2: Official Verified Project Source Image
  const projectWithImage = connectedProjects.find(
    p => p && p.image && typeof p.image === 'string' && p.image.startsWith('http')
  );

  if (projectWithImage) {
    return {
      url: projectWithImage.image,
      status: 'VERIFIED_PROJECT_IMAGE',
      sourceTier: 'B',
      sourceTitle: `Official Verified Project Source — ${projectWithImage.name}`,
      sourceUrl: projectWithImage.evidence_url || `/projects/${projectWithImage.slug}`,
      caption: `Official Verified Development — ${projectWithImage.name} (${projectWithImage.location || 'Romania'})`,
      isFallback: false
    };
  }

  // Priority 4: Neutral Fallback (No generic stock photos pretending to be corporate headquarters)
  return {
    url: null,
    status: 'NOT_DISCLOSED_FALLBACK',
    sourceTier: 'F',
    sourceTitle: 'N/A — No Verified Public Corporate Image Available',
    caption: 'IMAGE STATUS: NOT DISCLOSED IN PUBLIC BASELINE',
    isFallback: true
  };
}

/**
 * Returns role-specific portfolio section titles and verification badges
 */
export function getCompanyRolePortfolioMetadata(companyType: string = 'developer') {
  switch (companyType) {
    case 'developer':
      return {
        sectionTitle: 'PROJECTS DEVELOPED',
        roleBadgeLabel: 'DEVELOPER — VERIFIED',
        roleDescription: 'Officially verified entity acting as primary real estate developer / sponsor.'
      };
    case 'general_contractor':
    case 'infrastructure':
      return {
        sectionTitle: 'CONTRACTS & CONSTRUCTION PROJECTS',
        roleBadgeLabel: 'GENERAL CONTRACTOR — VERIFIED',
        roleDescription: 'Officially verified entity executing general construction or civil infrastructure works.'
      };
    case 'architecture':
      return {
        sectionTitle: 'ARCHITECTURAL PROJECTS & DESIGNS',
        roleBadgeLabel: 'ARCHITECT — VERIFIED',
        roleDescription: 'Officially verified entity acting as master architect / lead designer.'
      };
    case 'engineering':
    case 'structural_engineering':
    case 'mep':
      return {
        sectionTitle: 'ENGINEERING & CONSULTANCY CONTRACTS',
        roleBadgeLabel: 'ENGINEERING ROLE — VERIFIED',
        roleDescription: 'Officially verified entity providing structural, civil, or MEP engineering solutions.'
      };
    case 'real_estate_agency':
      return {
        sectionTitle: 'MARKETED PROJECTS & DEVELOPMENTS',
        roleBadgeLabel: 'MARKETING / SALES AGENCY — VERIFIED',
        roleDescription: 'Officially verified entity acting as exclusive or commercial sales agency.'
      };
    default:
      return {
        sectionTitle: 'CONNECTED PROJECTS & CONTRACTS',
        roleBadgeLabel: 'TRACKED ENTITY ROLE — VERIFIED',
        roleDescription: 'Officially verified corporate relationship.'
      };
  }
}
