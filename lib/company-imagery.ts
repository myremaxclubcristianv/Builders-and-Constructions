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
  const isGenuineVerifiedImage = (url?: string, isVerified?: boolean) => {
    if (!url || typeof url !== 'string' || !url.startsWith('http')) return false;
    // Reject Unsplash and known generic stock repositories
    if (url.includes('unsplash.com') || url.includes('stock') || url.includes('shutterstock') || url.includes('getty')) {
      return false;
    }
    return isVerified !== false;
  };

  if (!company) {
    return {
      url: null,
      status: 'NOT_DISCLOSED_FALLBACK',
      sourceTier: 'F',
      sourceTitle: 'N/A — Fără imagine publică verificată',
      caption: 'STATUT VIZUAL: FOTOGRAFIE INDISPONIBILĂ ÎN SURSE OFICIALE (NOT DISCLOSED)',
      isFallback: true
    };
  }

  // Priority 1: Official Corporate Source Image (strictly non-stock)
  if (isGenuineVerifiedImage(company.image, company.image_verified)) {
    return {
      url: company.image,
      status: 'VERIFIED_CORPORATE_IMAGE',
      sourceTier: 'B',
      sourceTitle: company.image_source || 'Fotografie Oficială Companie / Sediu Central',
      sourceUrl: company.website || undefined,
      caption: company.image_alt || `Sediu Central — ${company.name}`,
      isFallback: false
    };
  }

  // Priority 2: Official Verified Project Source Image (strictly non-stock)
  const projectWithImage = connectedProjects.find(
    p => p && isGenuineVerifiedImage(p.image, p.image_verified)
  );

  if (projectWithImage) {
    return {
      url: projectWithImage.image,
      status: 'VERIFIED_PROJECT_IMAGE',
      sourceTier: 'B',
      sourceTitle: `Sursă Oficială Proiect Verificat — ${projectWithImage.name}`,
      sourceUrl: projectWithImage.evidence_url || `/projects/${projectWithImage.slug}`,
      caption: `Proiect Verificat — ${projectWithImage.name} (${projectWithImage.location || 'România'})`,
      isFallback: false
    };
  }

  // Priority 3: Neutral Fallback (No generic stock photos pretending to be corporate headquarters)
  return {
    url: null,
    status: 'NOT_DISCLOSED_FALLBACK',
    sourceTier: 'F',
    sourceTitle: 'N/A — Fără imagine publică verificată a companiei',
    caption: 'STATUT VIZUAL: FOTOGRAFIE INDISPONIBILĂ ÎN SURSE OFICIALE (NOT DISCLOSED)',
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
