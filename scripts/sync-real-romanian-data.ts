import { getServiceClient } from '../lib/supabase';
import { realCompaniesDataset, realProjectsDataset } from '../lib/real-romanian-data';

export async function syncRealRomanianDataToSupabase() {
  const client = getServiceClient();
  if (!client) {
    console.log('[SYNC] Supabase service client unavailable. Skipping database sync.');
    return { synced: false, reason: 'Supabase client unavailable' };
  }

  console.log(`[SYNC] Starting synchronization of ${realCompaniesDataset.length} companies and ${realProjectsDataset.length} projects into Supabase...`);

  // 1. Sync Companies
  let compCount = 0;
  for (const c of realCompaniesDataset) {
    const payload = {
      slug: c.slug,
      name: c.name,
      type: c.type,
      location: c.location,
      description: c.description,
      website: c.website,
      founded_year: c.founded_year,
      cui_cif: c.cui_cif || null,
      verification_level: c.verification_level,
      specializations: c.specializations,
      services: c.services,
      markets: c.markets,
      certifications: c.certifications,
      projects_count: c.projects_count,
      active_projects_count: c.active_projects_count,
      completed_projects_count: c.completed_projects_count,
      is_featured: c.is_featured,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error } = await client.from('companies').upsert(payload, { onConflict: 'slug' });
    if (error) {
      console.warn(`[SYNC] Company warning for ${c.slug}:`, error.message);
    } else {
      compCount++;
    }
  }

  // 2. Sync Projects
  let projCount = 0;
  for (const p of realProjectsDataset) {
    const payload = {
      slug: p.slug,
      name: p.name,
      project_type: p.project_type,
      status: p.status,
      current_stage: p.current_stage,
      investment_eur: p.investment_eur,
      surface_area_sqm: p.surface_area_sqm || null,
      unit_count: p.unit_count || null,
      estimated_completion: p.estimated_completion || null,
      actual_delivery: p.actual_delivery || null,
      description: p.description,
      image: p.image,
      is_featured: p.is_featured,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error } = await client.from('projects').upsert(payload, { onConflict: 'slug' });
    if (error) {
      console.warn(`[SYNC] Project warning for ${p.slug}:`, error.message);
    } else {
      projCount++;
    }
  }

  console.log(`[SYNC] Successfully synchronized ${compCount}/${realCompaniesDataset.length} companies and ${projCount}/${realProjectsDataset.length} projects.`);
  return { synced: true, compCount, projCount };
}

if (require.main === module) {
  syncRealRomanianDataToSupabase();
}
