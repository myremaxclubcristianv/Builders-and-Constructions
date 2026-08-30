import fs from 'fs';
import { realProjectsDataset } from '../lib/real-romanian-data';

console.log('Fixing project investment labels across dataset...');

let fixedCount = 0;
const updatedProjects = realProjectsDataset.map(p => {
  let label = p.investment_label;
  if (!label || label.toUpperCase() === 'ANNOUNCED INVESTMENT' || label.toUpperCase() === 'ANNOUNCED') {
    label = p.investment_eur && p.investment_eur > 0 ? `€${(p.investment_eur / 1000000).toFixed(1)}M EUR` : 'ANNOUNCED — AMOUNT NOT DISCLOSED';
    fixedCount++;
  }
  return {
    ...p,
    investment_label: label
  };
});

let content = fs.readFileSync('lib/real-romanian-data.ts', 'utf-8');

const projStart = content.indexOf('export const realProjectsDataset: RealProject[] = [');
const projEnd = content.indexOf('export const realLocationsDataset: RealLocation[] = [');

const newProjContent = 'export const realProjectsDataset: RealProject[] = ' + JSON.stringify(updatedProjects, null, 2) + ';\n\n';

const finalContent = content.slice(0, projStart) + newProjContent + content.slice(projEnd);
fs.writeFileSync('lib/real-romanian-data.ts', finalContent, 'utf-8');
console.log(`Successfully fixed ${fixedCount} project investment labels in lib/real-romanian-data.ts!`);
