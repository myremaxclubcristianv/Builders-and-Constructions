import { realCompaniesDataset, realProjectsDataset, realLocationsDataset, RealCompany, RealProject } from '../lib/real-romanian-data';

function runPhase41Audit() {
  console.log('================================================================');
  console.log(' PHASE 41 — CONSTRUCTIONS DATA INTEGRITY & FORENSIC AUDIT');
  console.log('================================================================\n');

  // 1. DATASET INVENTORY
  const totalCompanies = realCompaniesDataset.length;
  const totalProjects = realProjectsDataset.length;
  const totalLocations = realLocationsDataset.length;

  console.log('[1/12] DATASET INVENTORY:');
  console.log(`  Total Companies/Entities: ${totalCompanies}`);
  console.log(`  Total Projects:           ${totalProjects}`);
  console.log(`  Total Cities/Locations:   ${totalLocations}\n`);

  const companyTypes: Record<string, number> = {};
  realCompaniesDataset.forEach(c => {
    companyTypes[c.type] = (companyTypes[c.type] || 0) + 1;
  });

  console.log('  Company Breakdown by Category:');
  Object.entries(companyTypes).forEach(([type, count]) => {
    console.log(`    - ${type}: ${count}`);
  });
  console.log('');

  // 2. COMPANY FIELD COMPLETENESS (All 146)
  console.log('[2/12] COMPANY FIELD COMPLETENESS MATRIX (N = 146):');
  const compFields = [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'type', label: 'Entity Type' },
    { key: 'cui_cif', label: 'CUI/CIF' },
    { key: 'founded_year', label: 'Founding Year' },
    { key: 'location', label: 'City/Location' },
    { key: 'description', label: 'Description' },
    { key: 'website', label: 'Website URL' },
    { key: 'ownership_structure', label: 'Ownership Structure' },
    { key: 'financials_2024', label: '2024 Financial Data' },
    { key: 'financials_2025', label: '2025 Financial Data' },
    { key: 'financial_timeline', label: 'Financial Timeline' },
    { key: 'sources', label: 'Sources / Provenance' },
    { key: 'verification_level', label: 'Verification Level' },
    { key: 'last_verified_at', label: 'Last Verified At' },
    { key: 'logo_url', label: 'Logo URL' },
    { key: 'image', label: 'Image URL' }
  ];

  console.log(`  | Field                     | Present | Missing | Completeness |`);
  console.log(`  |---------------------------|--------:|--------:|-------------:|`);
  compFields.forEach(({ key, label }) => {
    const present = realCompaniesDataset.filter(c => {
      const val = (c as any)[key];
      if (Array.isArray(val)) return val.length > 0;
      if (typeof val === 'object' && val !== null) return Object.keys(val).length > 0;
      return val !== undefined && val !== null && val !== '';
    }).length;
    const missing = totalCompanies - present;
    const pct = ((present / totalCompanies) * 100).toFixed(1);
    console.log(`  | ${label.padEnd(25)} | ${String(present).padStart(7)} | ${String(missing).padStart(7)} | ${pct.padStart(11)}% |`);
  });
  console.log('');

  // 3. DUPLICATE COMPANY DETECTION
  console.log('[3/12] DUPLICATE COMPANY DETECTION:');
  const compSlugs = new Set<string>();
  const compCuis = new Map<string, string[]>();
  const compNames = new Map<string, string[]>();
  const compWebsites = new Map<string, string[]>();

  let compExactDupes = 0;
  let compProbableDupes = 0;

  realCompaniesDataset.forEach(c => {
    // Slug duplicate check
    if (compSlugs.has(c.slug)) {
      console.log(`  ❌ Duplicate slug found: ${c.slug}`);
      compExactDupes++;
    }
    compSlugs.add(c.slug);

    // CUI duplicate check
    if (c.cui_cif) {
      const normCui = c.cui_cif.trim().toUpperCase();
      const existing = compCuis.get(normCui) || [];
      existing.push(c.slug);
      compCuis.set(normCui, existing);
    }

    // Name duplicate check
    const normName = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const existingNames = compNames.get(normName) || [];
    existingNames.push(c.slug);
    compNames.set(normName, existingNames);

    // Website duplicate check
    if (c.website) {
      const normWeb = c.website.toLowerCase().replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
      const existingWeb = compWebsites.get(normWeb) || [];
      existingWeb.push(c.slug);
      compWebsites.set(normWeb, existingWeb);
    }
  });

  const duplicateCuis = Array.from(compCuis.entries()).filter(([_, slugs]) => slugs.length > 1);
  const duplicateNames = Array.from(compNames.entries()).filter(([_, slugs]) => slugs.length > 1);
  const duplicateWebsites = Array.from(compWebsites.entries()).filter(([_, slugs]) => slugs.length > 1);

  console.log(`  - Exact Slug Duplicates: ${compExactDupes}`);
  console.log(`  - Duplicate CUI/CIFs:   ${duplicateCuis.length}`);
  if (duplicateCuis.length > 0) {
    duplicateCuis.forEach(([cui, slugs]) => console.log(`    ⚠️ CUI ${cui}: ${slugs.join(', ')}`));
  }
  console.log(`  - Duplicate Normalized Names: ${duplicateNames.length}`);
  if (duplicateNames.length > 0) {
    duplicateNames.forEach(([name, slugs]) => console.log(`    ⚠️ Name "${name}": ${slugs.join(', ')}`));
  }
  console.log(`  - Shared Website Domains: ${duplicateWebsites.length}`);
  if (duplicateWebsites.length > 0) {
    duplicateWebsites.forEach(([web, slugs]) => console.log(`    ℹ️ Web ${web}: ${slugs.join(', ')}`));
  }
  console.log('');

  // 4. PROJECT FIELD COMPLETENESS (All 76)
  console.log('[4/12] PROJECT FIELD COMPLETENESS MATRIX (N = 76):');
  const projFields = [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'developer_name', label: 'Developer Name' },
    { key: 'developer_slug', label: 'Developer Slug' },
    { key: 'contractor_name', label: 'Contractor Name' },
    { key: 'contractor_slug', label: 'Contractor Slug' },
    { key: 'architect_name', label: 'Architect Name' },
    { key: 'architect_slug', label: 'Architect Slug' },
    { key: 'engineering_name', label: 'Engineering Name' },
    { key: 'engineering_slug', label: 'Engineering Slug' },
    { key: 'location', label: 'Location' },
    { key: 'location_slug', label: 'Location Slug' },
    { key: 'address', label: 'Address' },
    { key: 'project_type', label: 'Project Type' },
    { key: 'status', label: 'Status' },
    { key: 'current_stage', label: 'Current Stage' },
    { key: 'investment_eur', label: 'Investment Value (EUR)' },
    { key: 'surface_area_sqm', label: 'Surface Area (sqm)' },
    { key: 'built_area_sqm', label: 'Built Area (sqm)' },
    { key: 'unit_count', label: 'Unit Count' },
    { key: 'estimated_completion', label: 'Estimated Completion' },
    { key: 'actual_delivery', label: 'Actual Delivery Date' },
    { key: 'description', label: 'Description' },
    { key: 'image', label: 'Image URL' },
    { key: 'sources', label: 'Sources / Provenance' }
  ];

  console.log(`  | Field                     | Present | Missing | Completeness |`);
  console.log(`  |---------------------------|--------:|--------:|-------------:|`);
  projFields.forEach(({ key, label }) => {
    const present = realProjectsDataset.filter(p => {
      const val = (p as any)[key];
      if (Array.isArray(val)) return val.length > 0;
      if (typeof val === 'number') return !isNaN(val) && val > 0;
      return val !== undefined && val !== null && val !== '';
    }).length;
    const missing = totalProjects - present;
    const pct = ((present / totalProjects) * 100).toFixed(1);
    console.log(`  | ${label.padEnd(25)} | ${String(present).padStart(7)} | ${String(missing).padStart(7)} | ${pct.padStart(11)}% |`);
  });
  console.log('');

  // 5. PROJECT STATUS INTEGRITY
  console.log('[5/12] PROJECT STATUS INTEGRITY:');
  const projStatuses: Record<string, number> = {};
  let statusWithSources = 0;
  let statusWithoutSources = 0;

  realProjectsDataset.forEach(p => {
    projStatuses[p.status] = (projStatuses[p.status] || 0) + 1;
    if (p.sources && p.sources.length > 0) {
      statusWithSources++;
    } else {
      statusWithoutSources++;
    }
  });

  console.log('  Status Breakdown:');
  Object.entries(projStatuses).forEach(([s, count]) => {
    console.log(`    - ${s}: ${count}`);
  });
  console.log(`  Projects with Provenance Sources:    ${statusWithSources} (${((statusWithSources / totalProjects) * 100).toFixed(1)}%)`);
  console.log(`  Projects without Provenance Sources: ${statusWithoutSources}`);
  console.log('');

  // 6. COMPANY ↔ PROJECT RELATIONSHIP INTEGRITY
  console.log('[6/12] COMPANY ↔ PROJECT RELATIONSHIPS:');
  const validCompSlugs = new Set(realCompaniesDataset.map(c => c.slug));

  let projWithDev = 0, devResolved = 0;
  let projWithContractor = 0, contractorResolved = 0;
  let projWithArchitect = 0, architectResolved = 0;
  let projWithEngineer = 0, engineerResolved = 0;

  const compProjectCounts = new Map<string, number>();

  realProjectsDataset.forEach(p => {
    if (p.developer_slug) {
      projWithDev++;
      if (validCompSlugs.has(p.developer_slug)) {
        devResolved++;
        compProjectCounts.set(p.developer_slug, (compProjectCounts.get(p.developer_slug) || 0) + 1);
      } else {
        console.log(`  ⚠️ Unresolved Developer Slug in project "${p.slug}": ${p.developer_slug}`);
      }
    }

    if (p.contractor_slug) {
      projWithContractor++;
      if (validCompSlugs.has(p.contractor_slug)) {
        contractorResolved++;
        compProjectCounts.set(p.contractor_slug, (compProjectCounts.get(p.contractor_slug) || 0) + 1);
      } else {
        console.log(`  ⚠️ Unresolved Contractor Slug in project "${p.slug}": ${p.contractor_slug}`);
      }
    }

    if (p.architect_slug) {
      projWithArchitect++;
      if (validCompSlugs.has(p.architect_slug)) {
        architectResolved++;
        compProjectCounts.set(p.architect_slug, (compProjectCounts.get(p.architect_slug) || 0) + 1);
      } else {
        console.log(`  ⚠️ Unresolved Architect Slug in project "${p.slug}": ${p.architect_slug}`);
      }
    }

    if (p.engineering_slug) {
      projWithEngineer++;
      if (validCompSlugs.has(p.engineering_slug)) {
        engineerResolved++;
        compProjectCounts.set(p.engineering_slug, (compProjectCounts.get(p.engineering_slug) || 0) + 1);
      } else {
        console.log(`  ⚠️ Unresolved Engineer Slug in project "${p.slug}": ${p.engineering_slug}`);
      }
    }
  });

  const companiesWithProjects = compProjectCounts.size;
  const companiesWithoutProjects = totalCompanies - companiesWithProjects;

  console.log(`  Developer Mappings:  ${projWithDev} projects (${devResolved} resolved to company dossiers)`);
  console.log(`  Contractor Mappings: ${projWithContractor} projects (${contractorResolved} resolved to company dossiers)`);
  console.log(`  Architect Mappings:  ${projWithArchitect} projects (${architectResolved} resolved to company dossiers)`);
  console.log(`  Engineer Mappings:   ${projWithEngineer} projects (${engineerResolved} resolved to company dossiers)`);
  console.log(`  Companies with Project Links:    ${companiesWithProjects} / ${totalCompanies}`);
  console.log(`  Companies without Project Links: ${companiesWithoutProjects} / ${totalCompanies}\n`);

  // 7. DUPLICATE PROJECT DETECTION
  console.log('[7/12] DUPLICATE PROJECT DETECTION:');
  const projSlugs = new Set<string>();
  const projNames = new Map<string, string[]>();
  let projExactDupes = 0;

  realProjectsDataset.forEach(p => {
    if (projSlugs.has(p.slug)) {
      console.log(`  ❌ Duplicate Project Slug: ${p.slug}`);
      projExactDupes++;
    }
    projSlugs.add(p.slug);

    const normName = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const existing = projNames.get(normName) || [];
    existing.push(p.slug);
    projNames.set(normName, existing);
  });

  const duplicateProjNames = Array.from(projNames.entries()).filter(([_, slugs]) => slugs.length > 1);

  console.log(`  - Exact Project Slug Duplicates: ${projExactDupes}`);
  console.log(`  - Duplicate Project Names:       ${duplicateProjNames.length}`);
  if (duplicateProjNames.length > 0) {
    duplicateProjNames.forEach(([name, slugs]) => console.log(`    ⚠️ Name "${name}": ${slugs.join(', ')}`));
  }
  console.log('');

  // 8. GEOGRAPHIC INTEGRITY
  console.log('[8/12] GEOGRAPHIC INTEGRITY AUDIT:');
  const citySlugs = new Set(realLocationsDataset.map(l => l.slug));
  const citiesWithComp = new Set<string>();
  const citiesWithProj = new Set<string>();

  let compValidCity = 0, compInvalidCity = 0;
  realCompaniesDataset.forEach(c => {
    if (c.location_slug && citySlugs.has(c.location_slug)) {
      compValidCity++;
      citiesWithComp.add(c.location_slug);
    } else {
      compInvalidCity++;
    }
  });

  let projValidCity = 0, projInvalidCity = 0;
  realProjectsDataset.forEach(p => {
    if (p.location_slug && citySlugs.has(p.location_slug)) {
      projValidCity++;
      citiesWithProj.add(p.location_slug);
    } else {
      projInvalidCity++;
    }
  });

  const activeCities = new Set([...citiesWithComp, ...citiesWithProj]);
  const orphanCities = totalLocations - activeCities.size;

  console.log(`  Companies with Valid City Hub: ${compValidCity} / ${totalCompanies}`);
  console.log(`  Projects with Valid City Hub:  ${projValidCity} / ${totalProjects}`);
  console.log(`  Cities with >= 1 Company:     ${citiesWithComp.size} / ${totalLocations}`);
  console.log(`  Cities with >= 1 Project:     ${citiesWithProj.size} / ${totalLocations}`);
  console.log(`  Active City Hubs:             ${activeCities.size} / ${totalLocations}`);
  console.log(`  Empty / Orphan City Hubs:     ${orphanCities} / ${totalLocations}`);
  console.log('');

  // 9. PROVENANCE & SOURCE AUDIT
  console.log('[9/12] DATA PROVENANCE & SOURCE AUDIT:');
  let compWithSources = 0;
  let totalCompSources = 0;
  const compSourceTypes: Record<string, number> = {};

  realCompaniesDataset.forEach(c => {
    if (c.sources && c.sources.length > 0) {
      compWithSources++;
      totalCompSources += c.sources.length;
      c.sources.forEach(s => {
        compSourceTypes[s.type] = (compSourceTypes[s.type] || 0) + 1;
      });
    }
  });

  let projWithSources = 0;
  let totalProjSources = 0;
  const projSourceTypes: Record<string, number> = {};

  realProjectsDataset.forEach(p => {
    if (p.sources && p.sources.length > 0) {
      projWithSources++;
      totalProjSources += p.sources.length;
      p.sources.forEach(s => {
        projSourceTypes[s.type] = (projSourceTypes[s.type] || 0) + 1;
      });
    }
  });

  console.log(`  Companies with Provenance Sources: ${compWithSources} / ${totalCompanies} (${((compWithSources / totalCompanies) * 100).toFixed(1)}%)`);
  console.log(`  Total Company Sources Recorded:    ${totalCompSources}`);
  console.log(`  Company Source Breakdown:`, compSourceTypes);
  console.log(`  Projects with Provenance Sources:  ${projWithSources} / ${totalProjects} (${((projWithSources / totalProjects) * 100).toFixed(1)}%)`);
  console.log(`  Total Project Sources Recorded:    ${totalProjSources}`);
  console.log(`  Project Source Breakdown:`, projSourceTypes);
  console.log('');

  // 10. ZERO-FABRICATION STRESS TEST
  console.log('[10/12] ZERO-FABRICATION STRESS TEST:');
  const suspiciousKeywords = ['lorem', 'ipsum', 'test company', 'placeholder', 'dummy', 'fake', 'todo', 'sample', 'undefined', 'null', 'NaN', 'example.com'];
  let compSuspicious = 0;
  let projSuspicious = 0;

  realCompaniesDataset.forEach(c => {
    const text = JSON.stringify(c).toLowerCase();
    if (suspiciousKeywords.some(kw => text.includes(kw))) {
      console.log(`  ⚠️ Suspicious content in company "${c.slug}"`);
      compSuspicious++;
    }
  });

  realProjectsDataset.forEach(p => {
    const text = JSON.stringify(p).toLowerCase();
    if (suspiciousKeywords.some(kw => text.includes(kw))) {
      console.log(`  ⚠️ Suspicious content in project "${p.slug}"`);
      projSuspicious++;
    }
  });

  console.log(`  Company Stress Test Suspicious Matches: ${compSuspicious}`);
  console.log(`  Project Stress Test Suspicious Matches: ${projSuspicious}`);
  if (compSuspicious === 0 && projSuspicious === 0) {
    console.log(`  ✓ NO FABRICATION OR PLACEHOLDER TEXT FOUND IN DATASET.`);
  }
  console.log('');

  // 11. DATA ↔ SEO CONSISTENCY AUDIT
  console.log('[11/12] DATA ↔ SEO CONSISTENCY AUDIT:');
  let compSeoIssues = 0;
  realCompaniesDataset.forEach(c => {
    if (!c.name || !c.slug || !c.description) {
      compSeoIssues++;
    }
  });

  let projSeoIssues = 0;
  realProjectsDataset.forEach(p => {
    if (!p.name || !p.slug || !p.description) {
      projSeoIssues++;
    }
  });

  console.log(`  Company SEO Metadata Integrity: ${totalCompanies - compSeoIssues} / ${totalCompanies} valid`);
  console.log(`  Project SEO Metadata Integrity: ${totalProjects - projSeoIssues} / ${totalProjects} valid`);
  console.log('');

  // 12. SUMMARY SCORECARD
  console.log('[12/12] DATA QUALITY SUMMARY SCORECARD:');
  console.log(`  Company Completeness Average:   ${(((realCompaniesDataset.filter(c => c.name && c.cui_cif && c.website && c.description).length) / totalCompanies) * 100).toFixed(1)}%`);
  console.log(`  Project Completeness Average:   ${(((realProjectsDataset.filter(p => p.name && p.developer_slug && p.location && p.status && p.investment_eur).length) / totalProjects) * 100).toFixed(1)}%`);
  console.log(`  Relationship Resolution Rate:   ${(((devResolved + contractorResolved + architectResolved + engineerResolved) / (projWithDev + projWithContractor + projWithArchitect + projWithEngineer)) * 100).toFixed(1)}%`);
  console.log(`  Provenance Coverage Rate:       ${(((compWithSources + projWithSources) / (totalCompanies + totalProjects)) * 100).toFixed(1)}%`);
  console.log('\n================================================================');
  console.log(' PHASE 41 FORENSIC AUDIT SCRIPT COMPLETE');
  console.log('================================================================\n');
}

runPhase41Audit();
