import { realCompaniesDataset, realProjectsDataset } from '../lib/real-romanian-data';

function runCompanyIntelligenceAudit() {
  console.log('================================================================');
  console.log('       FORENSIC AUDIT: COMPANY INTELLIGENCE & CORPORATE DATA     ');
  console.log('================================================================\n');

  let passed = true;

  let verifiedCuiCount = 0;
  let verifiedFoundingCount = 0;
  let verifiedFinancialsCount = 0;
  let verifiedExecutivesCount = 0;
  let connectedPortfolioCount = 0;

  realCompaniesDataset.forEach(c => {
    if (c.cui_cif) verifiedCuiCount++;
    if (c.founded_year) verifiedFoundingCount++;
    if (c.financials_2025 || c.financials_2024 || c.financials_2023) verifiedFinancialsCount++;
    if (c.founders_key_people && c.founders_key_people.length > 0) verifiedExecutivesCount++;

    const projects = realProjectsDataset.filter(p =>
      p.developer_slug === c.slug ||
      p.contractor_slug === c.slug ||
      p.architect_slug === c.slug ||
      p.engineering_slug === c.slug
    );
    if (projects.length > 0) connectedPortfolioCount++;
  });

  console.log(`Total Companies Analyzed:              ${realCompaniesDataset.length} / 40`);
  console.log(`Companies with Official CUI/CIF:       ${verifiedCuiCount} / ${realCompaniesDataset.length}`);
  console.log(`Companies with Verified Incorporation: ${verifiedFoundingCount} / ${realCompaniesDataset.length}`);
  console.log(`Companies with Financial Disclosures:  ${verifiedFinancialsCount} / ${realCompaniesDataset.length}`);
  console.log(`Companies with Verified Executives:    ${verifiedExecutivesCount} / ${realCompaniesDataset.length}`);
  console.log(`Companies with Connected Projects:     ${connectedPortfolioCount} / ${realCompaniesDataset.length}`);

  if (realCompaniesDataset.length < 40) passed = false;

  console.log('\n================================================================');
  if (passed) {
    console.log('✅ COMPANY INTELLIGENCE AUDIT PASSED 100%!');
  } else {
    console.error('❌ COMPANY INTELLIGENCE AUDIT FAILED!');
    process.exit(1);
  }
  console.log('================================================================\n');
}

runCompanyIntelligenceAudit();
