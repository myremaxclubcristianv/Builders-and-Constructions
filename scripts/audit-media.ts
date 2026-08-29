import { realCompaniesDataset, realProjectsDataset } from '../lib/real-romanian-data';

export function auditMedia() {
  console.log('=== MEDIA AUDIT START ===');
  console.log(`Total Companies: ${realCompaniesDataset.length}`);
  console.log(`Total Projects: ${realProjectsDataset.length}`);

  // Project Image Audit
  const projectImageMap = new Map<string, string[]>();
  let projectsWithImage = 0;
  let projectsWithoutImage = 0;

  for (const p of realProjectsDataset) {
    if (p.image && p.image.trim().length > 0) {
      projectsWithImage++;
      const list = projectImageMap.get(p.image) || [];
      list.push(`${p.name} (${p.slug})`);
      projectImageMap.set(p.image, list);
    } else {
      projectsWithoutImage++;
    }
  }

  // Find Duplicate Project Images across UNRELATED projects
  const duplicateProjectImages: Array<{ url: string; count: number; projects: string[] }> = [];
  projectImageMap.forEach((projects, url) => {
    if (projects.length > 1) {
      duplicateProjectImages.push({ url, count: projects.length, projects });
    }
  });

  console.log('\n--- PROJECT IMAGE AUDIT ---');
  console.log(`Projects with Image: ${projectsWithImage}/${realProjectsDataset.length}`);
  console.log(`Projects without Image: ${projectsWithoutImage}/${realProjectsDataset.length}`);
  console.log(`Unique Project Images: ${projectImageMap.size}`);
  console.log(`Duplicate Image URLs across Projects: ${duplicateProjectImages.length}`);

  if (duplicateProjectImages.length > 0) {
    console.log('\nDuplicate Project Image details:');
    duplicateProjectImages.forEach((dup, i) => {
      console.log(`  ${i + 1}. URL: ${dup.url}`);
      console.log(`     Used by (${dup.count} projects): ${dup.projects.join(' | ')}`);
    });
  }

  // Company Image Audit
  const companyImageMap = new Map<string, string[]>();
  let companiesWithImage = 0;
  let companiesWithoutImage = 0;

  for (const c of realCompaniesDataset) {
    const img = (c as any).image || (c as any).logo_url;
    if (img && img.trim().length > 0) {
      companiesWithImage++;
      const list = companyImageMap.get(img) || [];
      list.push(`${c.name} (${c.slug})`);
      companyImageMap.set(img, list);
    } else {
      companiesWithoutImage++;
    }
  }

  const duplicateCompanyImages: Array<{ url: string; count: number; companies: string[] }> = [];
  companyImageMap.forEach((companies, url) => {
    if (companies.length > 1) {
      duplicateCompanyImages.push({ url, count: companies.length, companies });
    }
  });

  console.log('\n--- COMPANY IMAGE AUDIT ---');
  console.log(`Companies with Image: ${companiesWithImage}/${realCompaniesDataset.length}`);
  console.log(`Companies without Image: ${companiesWithoutImage}/${realCompaniesDataset.length}`);
  console.log(`Unique Company Images: ${companyImageMap.size}`);
  console.log(`Duplicate Image URLs across Companies: ${duplicateCompanyImages.length}`);

  if (duplicateCompanyImages.length > 0) {
    console.log('\nDuplicate Company Image details:');
    duplicateCompanyImages.forEach((dup, i) => {
      console.log(`  ${i + 1}. URL: ${dup.url}`);
      console.log(`     Used by (${dup.count} companies): ${dup.companies.join(' | ')}`);
    });
  }

  console.log('\n=== MEDIA AUDIT END ===');
  return {
    projectsWithImage,
    projectsWithoutImage,
    uniqueProjectImages: projectImageMap.size,
    duplicateProjectImagesCount: duplicateProjectImages.length,
    companiesWithImage,
    companiesWithoutImage,
    uniqueCompanyImages: companyImageMap.size,
    duplicateCompanyImagesCount: duplicateCompanyImages.length
  };
}

if (require.main === module) {
  auditMedia();
}
