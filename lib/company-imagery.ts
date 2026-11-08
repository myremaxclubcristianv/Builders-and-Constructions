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
  imageBadge?: string;
}

export type ImageBadgeType =
  | 'Fotografie oficială'
  | 'Randare oficială'
  | 'Fotografie din sursă editorială'
  | 'Imagine indisponibilă în surse verificabile';

export interface VisualProvenanceBadge {
  label: ImageBadgeType;
  badgeClass: string;
  isNotFound: boolean;
  code: 'OFFICIAL_PHOTO' | 'OFFICIAL_RENDER' | 'EDITORIAL_PRESS' | 'NOT_FOUND';
}

/**
 * Returns the exact user-mandated badge classification:
 * - Fotografie oficială
 * - Randare oficială
 * - Fotografie din sursă editorială
 * - Imagine indisponibilă în surse verificabile
 */
export function resolveVisualProvenanceBadge(item: {
  image?: string | null;
  image_type?: string | null;
  image_status?: string | null;
  image_source_name?: string | null;
  provenance_type?: string | null;
}): VisualProvenanceBadge {
  const url = item.image;

  if (!url || typeof url !== 'string' || url.trim() === '' || url.includes('unsplash.com') || item.image_status === 'NOT_FOUND') {
    return {
      label: 'Imagine indisponibilă în surse verificabile',
      badgeClass: 'bg-slate-100 text-slate-600 border border-slate-200',
      isNotFound: true,
      code: 'NOT_FOUND'
    };
  }

  const type = (item.image_type || item.provenance_type || '').toUpperCase();
  const source = (item.image_source_name || '').toUpperCase();

  if (type.includes('RENDER') || source.includes('RENDER') || type === 'OFFICIAL_RENDER') {
    return {
      label: 'Randare oficială',
      badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200',
      isNotFound: false,
      code: 'OFFICIAL_RENDER'
    };
  }

  if (type.includes('EDITORIAL') || type.includes('PRESS') || source.includes('ECONOMEDIA') || source.includes('CIJ') || type === 'EDITORIAL_PRESS') {
    return {
      label: 'Fotografie din sursă editorială',
      badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200',
      isNotFound: false,
      code: 'EDITORIAL_PRESS'
    };
  }

  return {
    label: 'Fotografie oficială',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    isNotFound: false,
    code: 'OFFICIAL_PHOTO'
  };
}

export function resolveCompanyImage(company: any, connectedProjects: any[] = []): CompanyImageResolution {
  const isGenuineVerifiedImage = (url?: string, isVerified?: boolean) => {
    if (!url || typeof url !== 'string' || !url.startsWith('http')) return false;
    // Reject Unsplash and known generic stock repositories
    if (url.includes('unsplash.com') || url.includes('stock') || url.includes('shutterstock') || url.includes('getty') || url.includes('pexels') || url.includes('pixabay')) {
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
      caption: 'Imagine indisponibilă în surse verificabile (NOT DISCLOSED)',
      isFallback: true,
      imageBadge: 'Imagine indisponibilă în surse verificabile'
    };
  }

  // Priority 1: Official Corporate Source Image (strictly non-stock)
  if (isGenuineVerifiedImage(company.image, company.image_verified)) {
    const badge = resolveVisualProvenanceBadge({
      image: company.image,
      image_type: company.image_type || 'OFFICIAL_PHOTO',
      image_status: 'VERIFIED_OFFICIAL'
    });
    return {
      url: company.image,
      status: 'VERIFIED_CORPORATE_IMAGE',
      sourceTier: 'B',
      sourceTitle: company.image_source || 'Fotografie Oficială Companie / Sediu Central',
      sourceUrl: company.website || undefined,
      caption: company.image_alt || `Sediu Central — ${company.name}`,
      isFallback: false,
      imageBadge: badge.label
    };
  }

  // Priority 2: Official Verified Project Source Image (strictly non-stock)
  const projectWithImage = connectedProjects.find(
    p => p && isGenuineVerifiedImage(p.image, p.image_verified)
  );

  if (projectWithImage) {
    const badge = resolveVisualProvenanceBadge({
      image: projectWithImage.image,
      image_type: projectWithImage.image_type || 'OFFICIAL_PHOTO',
      image_status: 'VERIFIED_OFFICIAL'
    });
    return {
      url: projectWithImage.image,
      status: 'VERIFIED_PROJECT_IMAGE',
      sourceTier: 'B',
      sourceTitle: `Sursă Oficială Proiect Verificat — ${projectWithImage.name}`,
      sourceUrl: projectWithImage.evidence_url || `/projects/${projectWithImage.slug}`,
      caption: `Proiect Verificat — ${projectWithImage.name} (${projectWithImage.location || 'România'})`,
      isFallback: false,
      imageBadge: badge.label
    };
  }

  // Priority 3: Neutral Fallback (No generic stock photos pretending to be corporate headquarters)
  return {
    url: null,
    status: 'NOT_DISCLOSED_FALLBACK',
    sourceTier: 'F',
    sourceTitle: 'N/A — Fără imagine publică verificată a companiei',
    caption: 'Imagine indisponibilă în surse verificabile (NOT DISCLOSED)',
    isFallback: true,
    imageBadge: 'Imagine indisponibilă în surse verificabile'
  };
}

/**
 * Returns role-specific portfolio section titles and verification badges
 */
export function getCompanyRolePortfolioMetadata(companyType: string = 'developer') {
  switch (companyType) {
    case 'developer':
      return {
        sectionTitle: 'PROIECTE DEZVOLTATE',
        roleBadgeLabel: 'DEZVOLTATOR IMOBILIAR / DEVELOPER — VERIFICAT',
        roleDescription: 'Entitate verificată oficial cu rol de dezvoltator imobiliar principal / investitor.'
      };
    case 'general_contractor':
    case 'infrastructure':
    case 'construction_company':
      return {
        sectionTitle: 'CONTRACTE & LUCRĂRI DE EXECUȚIE',
        roleBadgeLabel: 'ANTREPRENOR GENERAL / CONTRACTOR — VERIFICAT',
        roleDescription: 'Entitate verificată oficial în execuția lucrărilor de construcții civile și infrastructură.'
      };
    case 'architecture':
      return {
        sectionTitle: 'PROIECTE ARHITECTURALE & URBANISM',
        roleBadgeLabel: 'ARHITECT & URBANIST / ARCHITECT — VERIFICAT',
        roleDescription: 'Birou de arhitectură verificat oficial în proiectare generală și concept urbanistic.'
      };
    case 'engineering':
    case 'structural_engineering':
    case 'mep':
      return {
        sectionTitle: 'CONTRACTE DE INGINERIE STRUCTURALĂ & MEP',
        roleBadgeLabel: 'INGINERIE & CONSULTANȚĂ / ENGINEERING — VERIFICAT',
        roleDescription: 'Companie de inginerie specializată în proiectare structurală, rezistență și instalații MEP.'
      };
    case 'real_estate_agency':
      return {
        sectionTitle: 'PORTOFOLIU PROIECTE REPREZENTATE',
        roleBadgeLabel: 'AGENȚIE IMOBILIARĂ / SALES AGENCY — VERIFICAT',
        roleDescription: 'Agenție imobiliară și brokeraj autorizat pentru reprezentare comercială și vânzări.'
      };
    default:
      return {
        sectionTitle: 'PROIECTE ȘI CONTRACTE ASOCIATE',
        roleBadgeLabel: 'ROL ÎN PROIECT / TRACKED ENTITY — VERIFICAT',
        roleDescription: 'Relație corporativă documentată în baza de date canonică.'
      };
  }
}
