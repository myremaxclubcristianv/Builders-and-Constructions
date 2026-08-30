import fs from 'fs';
import { realCompaniesDataset, realProjectsDataset } from '../lib/real-romanian-data';

console.log('Auditing uniqueness of company and project IDs and slugs...');

const companyIds = new Set<string>();
const companySlugs = new Set<string>();
const duplicateCompanies: string[] = [];

for (const c of realCompaniesDataset) {
  if (companyIds.has(c.id) || companySlugs.has(c.slug)) {
    duplicateCompanies.push(c.slug);
  }
  companyIds.add(c.id);
  companySlugs.add(c.slug);
}

const projectIds = new Set<string>();
const projectSlugs = new Set<string>();
const duplicateProjects: string[] = [];

for (const p of realProjectsDataset) {
  if (projectIds.has(p.id) || projectSlugs.has(p.slug)) {
    duplicateProjects.push(p.slug);
  }
  projectIds.add(p.id);
  projectSlugs.add(p.slug);
}

console.log(`Company Duplicates: ${duplicateCompanies.length} (${duplicateCompanies.join(', ')})`);
console.log(`Project Duplicates: ${duplicateProjects.length} (${duplicateProjects.join(', ')})`);

if (duplicateCompanies.length > 0 || duplicateProjects.length > 0) {
  // Let's filter unique ones by slug
  const uniqueCompaniesMap = new Map();
  for (const c of realCompaniesDataset) {
    if (!uniqueCompaniesMap.has(c.slug)) {
      uniqueCompaniesMap.set(c.slug, c);
    }
  }

  const uniqueProjectsMap = new Map();
  for (const p of realProjectsDataset) {
    if (!uniqueProjectsMap.has(p.slug)) {
      uniqueProjectsMap.set(p.slug, p);
    }
  }

  const uniqueCompanies = Array.from(uniqueCompaniesMap.values());
  const uniqueProjects = Array.from(uniqueProjectsMap.values());

  let content = fs.readFileSync('lib/real-romanian-data.ts', 'utf-8');

  // Replace realCompaniesDataset
  const compStart = content.indexOf('export const realCompaniesDataset: RealCompany[] = [');
  const compEnd = content.indexOf('export const realProjectsDataset: RealProject[] = [');
  
  const projStart = compEnd;
  const projEnd = content.indexOf('export const realLocationsDataset: RealLocation[] = [');

  const locsContent = content.slice(projEnd);

  const newCompContent = 'export const realCompaniesDataset: RealCompany[] = ' + JSON.stringify(uniqueCompanies, null, 2) + ';\n\n';
  const newProjContent = 'export const realProjectsDataset: RealProject[] = ' + JSON.stringify(uniqueProjects, null, 2) + ';\n\n';

  const finalContent = content.slice(0, compStart) + newCompContent + newProjContent + locsContent;
  fs.writeFileSync('lib/real-romanian-data.ts', finalContent, 'utf-8');
  console.log('Successfully deduplicated and rewrote lib/real-romanian-data.ts!');
}
