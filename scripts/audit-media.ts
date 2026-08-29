import { realCompaniesDataset, realProjectsDataset, realLocationsDataset } from '../lib/real-romanian-data';

export function auditMediaForensic() {
  console.log('================================================================');
  console.log('       PRODUCTION MEDIA & DATA-PRESERVATION FORENSIC AUDIT       ');
  console.log('================================================================');

  // 1. DATA INTEGRITY GUARDRAILS
  const companyCount = realCompaniesDataset.length;
  const projectCount = realProjectsDataset.length;
  const locationCount = realLocationsDataset.length;

  const contractors = realCompaniesDataset.filter(c => c.type === 'general_contractor' || c.type === 'construction_company' || (c.services && c.services.includes('General Contracting')));
  const architects = realCompaniesDataset.filter(c => c.type === 'architecture' || (c.specializations && c.specializations.includes('Architecture')));
  const engineers = realCompaniesDataset.filter(c => c.type === 'engineering' || c.type === 'structural_engineering' || (c.specializations && (c.specializations.includes('Engineering') || c.specializations.includes('Structural Design'))));

  console.log('\n--- DATASET BASELINE AUDIT ---');
  console.log(`Companies Baseline Count:   ${companyCount} / 40 (MIN EXPECTED: 40)`);
  console.log(`Projects Baseline Count:    ${projectCount} / 53 (MIN EXPECTED: 53)`);
  console.log(`Locations Baseline Count:   ${locationCount} / 36 (MIN EXPECTED: 36)`);
  console.log(`Contractors Count:          ${contractors.length} / 11 (MIN EXPECTED: 11)`);
  console.log(`Architects Count:           ${architects.length} / 3  (MIN EXPECTED: 3)`);
  console.log(`Engineers Count:            ${engineers.length} / 3  (MIN EXPECTED: 3)`);

  if (companyCount < 40 || projectCount < 53 || locationCount < 36 || contractors.length < 11 || architects.length < 3 || engineers.length < 3) {
    console.error('\n🚨 DATA TRUNCATION FAILURE: Dataset counts are below mandatory baseline threshold!');
    process.exit(1);
  }

  // 2. PROJECT MEDIA AUDIT
  const exactProjectUrls = new Set<string>();
  const normalizedProjectUrls = new Set<string>();
  const baseProjectUrls = new Set<string>();
  let projectMissingImages = 0;
  let projectSemanticMismatches = 0;

  realProjectsDataset.forEach((p, idx) => {
    const rawUrl = p.image || '';
    if (!rawUrl.trim()) {
      projectMissingImages++;
      return;
    }
    const normUrl = rawUrl.toLowerCase().trim();
    const baseUrl = rawUrl.split('?')[0].toLowerCase().trim();

    exactProjectUrls.add(rawUrl);
    normalizedProjectUrls.add(normUrl);
    baseProjectUrls.add(baseUrl);

    // Semantic matching check
    const pType = (p.project_type || '').toLowerCase();
    const alt = (p.image_alt || '').toLowerCase();
    if (pType.includes('residential') && (alt.includes('bridge') || alt.includes('highway') || alt.includes('hospital'))) {
      projectSemanticMismatches++;
    }
    if (pType.includes('infrastructure') && (alt.includes('residential') || alt.includes('apartment'))) {
      projectSemanticMismatches++;
    }
  });

  const projectExactDupes = projectCount - projectMissingImages - exactProjectUrls.size;
  const projectNormalizedDupes = projectCount - projectMissingImages - normalizedProjectUrls.size;
  const projectBaseDupes = projectCount - projectMissingImages - baseProjectUrls.size;

  // 3. COMPANY MEDIA AUDIT
  const exactCompanyUrls = new Set<string>();
  const normalizedCompanyUrls = new Set<string>();
  const baseCompanyUrls = new Set<string>();
  let companyMissingImages = 0;

  realCompaniesDataset.forEach(c => {
    const rawUrl = c.image || (c as any).logo_url || '';
    if (!rawUrl.trim()) {
      companyMissingImages++;
      return;
    }
    const normUrl = rawUrl.toLowerCase().trim();
    const baseUrl = rawUrl.split('?')[0].toLowerCase().trim();

    exactCompanyUrls.add(rawUrl);
    normalizedCompanyUrls.add(normUrl);
    baseCompanyUrls.add(baseUrl);
  });

  const companyExactDupes = companyCount - companyMissingImages - exactCompanyUrls.size;
  const companyNormalizedDupes = companyCount - companyMissingImages - normalizedCompanyUrls.size;
  const companyBaseDupes = companyCount - companyMissingImages - baseCompanyUrls.size;

  console.log('\n--- PROJECT MEDIA AUDIT ---');
  console.log(`Assigned Primary Images:    ${projectCount - projectMissingImages} / ${projectCount}`);
  console.log(`Missing Images:             ${projectMissingImages}`);
  console.log(`Exact URL Duplicates:       ${projectExactDupes}`);
  console.log(`Normalized URL Duplicates:  ${projectNormalizedDupes}`);
  console.log(`Base URL Duplicates:        ${projectBaseDupes}`);
  console.log(`Semantic Mismatches:        ${projectSemanticMismatches}`);

  console.log('\n--- COMPANY MEDIA AUDIT ---');
  console.log(`Assigned Primary Images:    ${companyCount - companyMissingImages} / ${companyCount}`);
  console.log(`Missing Images:             ${companyMissingImages}`);
  console.log(`Exact URL Duplicates:       ${companyExactDupes}`);
  console.log(`Normalized URL Duplicates:  ${companyNormalizedDupes}`);
  console.log(`Base URL Duplicates:        ${companyBaseDupes}`);

  const totalMissing = projectMissingImages + companyMissingImages;
  const totalExactDupes = projectExactDupes + companyExactDupes;
  const totalNormalizedDupes = projectNormalizedDupes + companyNormalizedDupes;
  const totalBaseDupes = projectBaseDupes + companyBaseDupes;

  console.log('\n================================================================');
  console.log(`TOTAL ASSIGNED IMAGES:      ${(projectCount - projectMissingImages) + (companyCount - companyMissingImages)} / ${projectCount + companyCount}`);
  console.log(`TOTAL MISSING IMAGES:       ${totalMissing}`);
  console.log(`TOTAL BASE DUPES:           ${totalBaseDupes}`);
  console.log(`TOTAL SEMANTIC MISMATCHES:  ${projectSemanticMismatches}`);
  console.log('================================================================');

  if (totalMissing > 0 || totalExactDupes > 0 || totalNormalizedDupes > 0 || totalBaseDupes > 0 || projectSemanticMismatches > 0) {
    console.error('\n🚨 MEDIA FORENSIC FAILURE: Duplicates, missing images, or semantic mismatches detected!');
    process.exit(1);
  }

  console.log('\n✅ MEDIA & DATA INTEGRITY GUARDRAILS PASSED 100%!');
}

if (require.main === module) {
  auditMediaForensic();
}
