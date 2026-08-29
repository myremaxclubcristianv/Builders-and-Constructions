import { realCompaniesDataset, realProjectsDataset, realLocationsDataset } from '../lib/real-romanian-data';

function runIntelligenceDepthAudit() {
  console.log('================================================================');
  console.log('       PRODUCTION INTELLIGENCE DEPTH & ATTRIBUTE AUDIT V2       ');
  console.log('================================================================\n');

  let passed = true;

  const minCompanies = 40;
  const minProjects = 53;
  const minLocations = 36;
  const minContractors = 11;
  const minArchitects = 3;
  const minEngineers = 3;

  const companyCount = realCompaniesDataset.length;
  const projectCount = realProjectsDataset.length;
  const locationCount = realLocationsDataset.length;

  const contractorsCount = realCompaniesDataset.filter(c => c.type === 'general_contractor' || c.type === 'infrastructure' || c.type === 'construction_company').length;
  const architectsCount = realCompaniesDataset.filter(c => c.type === 'architecture').length;
  const engineersCount = realCompaniesDataset.filter(c => c.type === 'engineering' || c.type === 'structural_engineering' || c.type === 'mep').length;

  console.log('--- BASELINE INTEGRITY AUDIT ---');
  console.log(`Companies Count:     ${companyCount} / ${minCompanies} (MIN: ${minCompanies})`);
  console.log(`Projects Count:      ${projectCount} / ${minProjects} (MIN: ${minProjects})`);
  console.log(`Locations Count:     ${locationCount} / ${minLocations} (MIN: ${minLocations})`);
  console.log(`Contractors Count:    ${contractorsCount} / ${minContractors} (MIN: ${minContractors})`);
  console.log(`Architects Count:     ${architectsCount} / ${minArchitects} (MIN: ${minArchitects})`);
  console.log(`Engineers Count:      ${engineersCount} / ${minEngineers} (MIN: ${minEngineers})`);

  if (companyCount < minCompanies) passed = false;
  if (projectCount < minProjects) passed = false;
  if (locationCount < minLocations) passed = false;
  if (contractorsCount < minContractors) passed = false;
  if (architectsCount < minArchitects) passed = false;
  if (engineersCount < minEngineers) passed = false;

  console.log('\n--- QUANTITATIVE ATTRIBUTE & STATUS DISCLOSURE AUDIT ---');

  let totalCompanyAttributes = 0;
  let totalProjectAttributes = 0;
  let reportedCount = 0;
  let announcedCount = 0;
  let calculatedCount = 0;
  let notDisclosedCount = 0;

  realCompaniesDataset.forEach(c => {
    let companyAttrs = 0;
    if (c.name) companyAttrs++;
    if (c.cui_cif) { companyAttrs++; reportedCount++; } else { notDisclosedCount++; }
    if (c.founded_year) { companyAttrs++; reportedCount++; }
    if (c.location) companyAttrs++;
    if (c.description) companyAttrs++;
    if (c.website) companyAttrs++;
    if (c.ownership_structure) { companyAttrs++; reportedCount++; }
    if (c.founders_key_people) companyAttrs += c.founders_key_people.length;

    // Financial reporting years
    if (c.financials_2025) { companyAttrs += 4; reportedCount++; }
    if (c.financials_2024) { companyAttrs += 4; reportedCount++; }
    if (c.financials_2023) { companyAttrs += 4; reportedCount++; }

    // Calculated fields
    if (c.revenue_growth_yoy !== undefined) { companyAttrs++; calculatedCount++; }
    if (c.completeness_score !== undefined) { companyAttrs++; calculatedCount++; }

    if (c.sources) companyAttrs += c.sources.length;

    totalCompanyAttributes += companyAttrs;
  });

  realProjectsDataset.forEach(p => {
    let projectAttrs = 0;
    if (p.name) projectAttrs++;
    if (p.developer_name) projectAttrs++;
    if (p.location) projectAttrs++;
    if (p.project_type) projectAttrs++;
    if (p.status_display) projectAttrs++;
    if (p.current_stage) projectAttrs++;
    if (p.investment_eur) { projectAttrs++; announcedCount++; }
    if (p.surface_area_sqm) { projectAttrs++; reportedCount++; } else { notDisclosedCount++; }
    if (p.unit_count) { projectAttrs++; reportedCount++; } else { notDisclosedCount++; }
    if (p.parking_spaces) { projectAttrs++; reportedCount++; } else { notDisclosedCount++; }
    if (p.estimated_completion) { projectAttrs++; announcedCount++; }
    if (p.contractor_name) projectAttrs++;
    if (p.architect_name) projectAttrs++;
    if (p.engineering_name) projectAttrs++;

    if (p.sources) projectAttrs += p.sources.length;

    totalProjectAttributes += projectAttrs;
  });

  const avgCompanyAttrs = (totalCompanyAttributes / companyCount).toFixed(1);
  const avgProjectAttrs = (totalProjectAttributes / projectCount).toFixed(1);

  console.log(`Total Company Attributes Recorded:   ${totalCompanyAttributes}`);
  console.log(`Total Project Attributes Recorded:   ${totalProjectAttributes}`);
  console.log(`Average Attributes per Company:      ${avgCompanyAttrs}`);
  console.log(`Average Attributes per Project:      ${avgProjectAttrs}`);
  console.log(`Tagged REPORTED Statements:         ${reportedCount}`);
  console.log(`Tagged ANNOUNCED Statements:        ${announcedCount}`);
  console.log(`Tagged CALCULATED Derived Metrics:   ${calculatedCount}`);
  console.log(`Explicit NOT DISCLOSED Markers:      ${notDisclosedCount}`);

  console.log('\n================================================================');
  if (passed) {
    console.log('✅ ALL INTELLIGENCE DEPTH & BASELINE GUARDRAILS PASSED 100%!');
  } else {
    console.error('❌ INTELLIGENCE DEPTH AUDIT FAILED! DISCREPANCY DETECTED.');
    process.exit(1);
  }
  console.log('================================================================\n');
}

runIntelligenceDepthAudit();
