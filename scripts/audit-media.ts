import { realCompaniesDataset, realProjectsDataset } from '../lib/real-romanian-data';

export function auditMediaDetailed() {
  console.log('====================================================');
  console.log('       MEDIA FORENSIC AUDIT - RELEVANCE & UNIQUE');
  console.log('====================================================');
  console.log(`Total Companies Evaluated: ${realCompaniesDataset.length}`);
  console.log(`Total Projects Evaluated:  ${realProjectsDataset.length}`);

  // Project Audit
  const projectImageSet = new Set<string>();
  const projectDupes: string[] = [];
  const projectCategoryMismatch: string[] = [];
  let projectSpecificCount = 0;
  let categoryRepCount = 0;

  realProjectsDataset.forEach((p, idx) => {
    const url = p.image || '';
    // Normalize URL base without query parameters
    const urlBase = url.split('?')[0];

    if (projectImageSet.has(urlBase)) {
      projectDupes.push(`[Dup Base] Project ${idx + 1}: ${p.name} (${p.slug}) -> ${urlBase}`);
    } else {
      projectImageSet.add(urlBase);
    }

    if (p.image_relevance === 'PROJECT_SPECIFIC' || (p as any).provenance_type === 'VERIFIED_OFFICIAL') {
      projectSpecificCount++;
    } else {
      categoryRepCount++;
    }

    // Category Semantic Validation
    const type = (p.project_type || '').toLowerCase();
    const alt = (p.image_alt || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();

    if (type.includes('residential') && (alt.includes('highway') || alt.includes('bridge') || alt.includes('subway') || alt.includes('hospital'))) {
      projectCategoryMismatch.push(`Project ${p.slug}: Category is Residential but alt text is ${p.image_alt}`);
    }
    if (type.includes('infrastructure') && (alt.includes('apartment') || alt.includes('residential') || alt.includes('shopping'))) {
      projectCategoryMismatch.push(`Project ${p.slug}: Category is Infrastructure but alt text is ${p.image_alt}`);
    }
  });

  // Company Audit
  const companyImageSet = new Set<string>();
  const companyDupes: string[] = [];

  realCompaniesDataset.forEach((c, idx) => {
    const url = c.image || (c as any).logo_url || '';
    const urlBase = url.split('?')[0];

    if (companyImageSet.has(urlBase)) {
      companyDupes.push(`[Dup Base] Company ${idx + 1}: ${c.name} (${c.slug}) -> ${urlBase}`);
    } else {
      companyImageSet.add(urlBase);
    }
  });

  console.log('\n--- PROJECT MEDIA RESULTS ---');
  console.log(`Assigned Primary Images:    ${realProjectsDataset.length}/${realProjectsDataset.length}`);
  console.log(`Unique Image Base URLs:     ${projectImageSet.size}/${realProjectsDataset.length}`);
  console.log(`Base URL Duplicates:        ${projectDupes.length}`);
  console.log(`Category Semantic Mismatches: ${projectCategoryMismatch.length}`);

  if (projectDupes.length > 0) {
    console.log('\nProject Base URL Duplicates:');
    projectDupes.forEach(d => console.log('  ', d));
  }

  console.log('\n--- COMPANY MEDIA RESULTS ---');
  console.log(`Assigned Primary Images:    ${realCompaniesDataset.length}/${realCompaniesDataset.length}`);
  console.log(`Unique Image Base URLs:     ${companyImageSet.size}/${realCompaniesDataset.length}`);
  console.log(`Base URL Duplicates:        ${companyDupes.length}`);

  if (companyDupes.length > 0) {
    console.log('\nCompany Base URL Duplicates:');
    companyDupes.forEach(d => console.log('  ', d));
  }

  console.log('\n====================================================');
  return {
    projectsCount: realProjectsDataset.length,
    companiesCount: realCompaniesDataset.length,
    projectUniqueBaseUrls: projectImageSet.size,
    projectBaseDupesCount: projectDupes.length,
    companyUniqueBaseUrls: companyImageSet.size,
    companyBaseDupesCount: companyDupes.length
  };
}

if (require.main === module) {
  auditMediaDetailed();
}
