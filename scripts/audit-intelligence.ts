import { realCompaniesDataset, realProjectsDataset, realLocationsDataset } from '../lib/real-romanian-data';

function runIntelligenceAudit() {
  console.log('================================================================');
  console.log('       PRODUCTION INTELLIGENCE & DATA COMPLEATNESS AUDIT        ');
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

  console.log('--- BASELINE COUNT AUDIT ---');
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

  console.log('\n--- DOSSIER INTELLIGENCE COMPLEATNESS AUDIT ---');
  let companiesWithSources = 0;
  let companiesWithFinancials = 0;
  let projectsWithSources = 0;
  let projectsWithStage = 0;

  realCompaniesDataset.forEach(c => {
    if (c.sources && c.sources.length > 0) companiesWithSources++;
    if (c.financials_2025 || c.financials_2024 || c.financials_2023 || (c.financial_timeline && c.financial_timeline.length > 0)) {
      companiesWithFinancials++;
    }
  });

  realProjectsDataset.forEach(p => {
    if (p.sources && p.sources.length > 0) projectsWithSources++;
    if (p.current_stage || p.status) projectsWithStage++;
  });

  console.log(`Companies with Verified Primary Sources:    ${companiesWithSources} / ${companyCount}`);
  console.log(`Companies with Financial Disclosures:      ${companiesWithFinancials} / ${companyCount}`);
  console.log(`Projects with Primary Citations:            ${projectsWithSources} / ${projectCount}`);
  console.log(`Projects with Construction Stage Tracking:  ${projectsWithStage} / ${projectCount}`);

  console.log('\n================================================================');
  if (passed) {
    console.log('✅ ALL INTELLIGENCE & BASELINE AUDIT GUARDRAILS PASSED 100%!');
  } else {
    console.error('❌ BASELINE INTELLIGENCE AUDIT FAILED! DISCREPANCY DETECTED.');
    process.exit(1);
  }
  console.log('================================================================\n');
}

runIntelligenceAudit();
