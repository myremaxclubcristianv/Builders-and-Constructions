import { realCompaniesDataset, realProjectsDataset } from '../lib/real-romanian-data';

console.log('=== CURRENT DATASET STATS ===');
console.log('Total Companies:', realCompaniesDataset.length);
console.log('Total Projects:', realProjectsDataset.length);

const types: Record<string, number> = {};
for (const c of realCompaniesDataset) {
  types[c.type] = (types[c.type] || 0) + 1;
}

console.log('\nBreakdown by Type:');
for (const [type, count] of Object.entries(types)) {
  console.log(`  ${type}: ${count}`);
}

console.log('\nCompany Names & Slugs:');
for (const c of realCompaniesDataset) {
  console.log(`  [${c.type}] ${c.name} (${c.slug})`);
}
