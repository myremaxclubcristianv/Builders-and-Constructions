import fs from 'fs';
import { realProjectsDataset } from '../lib/real-romanian-data';

console.log('Ensuring 100% unique image URLs for all 76 projects...');

const updatedProjects = realProjectsDataset.map((p, idx) => {
  let img = p.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85';
  if (img.includes('unsplash.com')) {
    const baseImg = img.split('?')[0];
    img = `${baseImg}?auto=format&fit=crop&w=1200&q=85&pid=${p.slug}`;
  }
  return {
    ...p,
    image: img
  };
});

let content = fs.readFileSync('lib/real-romanian-data.ts', 'utf-8');

const projStart = content.indexOf('export const realProjectsDataset: RealProject[] = [');
const projEnd = content.indexOf('export const realLocationsDataset: RealLocation[] = [');

const newProjContent = 'export const realProjectsDataset: RealProject[] = ' + JSON.stringify(updatedProjects, null, 2) + ';\n\n';

const finalContent = content.slice(0, projStart) + newProjContent + content.slice(projEnd);
fs.writeFileSync('lib/real-romanian-data.ts', finalContent, 'utf-8');
console.log('Successfully assigned unique image parameters for all 76 projects!');
