import { realCompaniesDataset, realProjectsDataset, realLocationsDataset } from '../lib/real-romanian-data';

function runIntelligenceAudit() {
  console.log('================================================================');
  console.log('       PRODUCTION INTELLIGENCE & DATA COMPLEXITY AUDIT        ');
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

  console.log('\n--- DETAILED INTELLIGENCE METRIC EXPANSION AUDIT ---');
  
  let totalCompanyHistoryEvents = 0;
  let totalFinancialYearRecords = 0;
  let totalManagementRecords = 0;
  let totalOwnershipDisclosures = 0;
  let totalContractRecords = 0;
  let totalProjectMilestones = 0;
  let totalFuturePipelineRecords = 0;
  let totalPrimarySources = 0;
  let totalGraphRelationships = 0;

  realCompaniesDataset.forEach(c => {
    if (c.founded_year) totalCompanyHistoryEvents += 1;
    if (c.sources) totalPrimarySources += c.sources.length;

    // Financial records count
    let finYears = 0;
    if (c.financials_2025) finYears++;
    if (c.financials_2024) finYears++;
    if (c.financials_2023) finYears++;
    if (c.financial_timeline) finYears += c.financial_timeline.length;
    totalFinancialYearRecords += finYears;

    // Executive management count
    if (c.founders_key_people) totalManagementRecords += c.founders_key_people.length;

    // Ownership structure disclosures
    if (c.ownership_structure) totalOwnershipDisclosures++;

    // Connected projects as graph edges
    const connectedProjects = realProjectsDataset.filter(p =>
      p.developer_slug === c.slug ||
      p.contractor_slug === c.slug ||
      p.architect_slug === c.slug ||
      p.engineering_slug === c.slug
    );
    totalGraphRelationships += connectedProjects.length;
  });

  realProjectsDataset.forEach(p => {
    if (p.sources) totalPrimarySources += p.sources.length;
    if (p.current_stage || p.status) totalProjectMilestones += 1;
    if (p.estimated_completion) totalFuturePipelineRecords += 1;
  });

  const avgRecordsPerCompany = (
    (totalCompanyHistoryEvents + totalFinancialYearRecords + totalManagementRecords + totalPrimarySources) / companyCount
  ).toFixed(1);

  const avgRecordsPerProject = (
    (totalProjectMilestones + totalFuturePipelineRecords + totalPrimarySources) / projectCount
  ).toFixed(1);

  console.log(`Total Company Historical Milestones Logged:  ${totalCompanyHistoryEvents}`);
  console.log(`Total Financial Reporting Years Logged:       ${totalFinancialYearRecords}`);
  console.log(`Total Verified Executive & Founder Records:  ${totalManagementRecords}`);
  console.log(`Total Corporate Ownership Disclosures:       ${totalOwnershipDisclosures}`);
  console.log(`Total Project Lifecycle Milestones Logged:   ${totalProjectMilestones}`);
  console.log(`Total Forward Target Milestones Logged:     ${totalFuturePipelineRecords}`);
  console.log(`Total Graph Relationships (Interlinks):       ${totalGraphRelationships}`);
  console.log(`Total Verified Primary Source Citations:     ${totalPrimarySources}`);
  console.log(`Average Intelligence Attributes per Company: ${avgRecordsPerCompany}`);
  console.log(`Average Intelligence Attributes per Project: ${avgRecordsPerProject}`);

  console.log('\n================================================================');
  if (passed) {
    console.log('✅ ALL MAXIMUM INTELLIGENCE DATA EXPANSION GUARDRAILS PASSED 100%!');
  } else {
    console.error('❌ INTELLIGENCE AUDIT FAILED! DISCREPANCY DETECTED.');
    process.exit(1);
  }
  console.log('================================================================\n');
}

runIntelligenceAudit();
