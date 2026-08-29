import { getServiceClient } from '../lib/supabase';

async function checkSupabase() {
  const client = getServiceClient();
  if (!client) {
    console.log('Supabase client NOT configured.');
    return;
  }

  const { data: companies, error: compErr } = await client.from('companies').select('id, slug, name, type');
  console.log('Supabase Companies count:', companies?.length || 0, compErr ? compErr.message : 'OK');
  if (companies?.length) {
    companies.forEach(c => console.log('  Comp:', c.slug, c.name, c.type));
  }

  const { data: projects, error: projErr } = await client.from('projects').select('id, slug, name, status');
  console.log('Supabase Projects count:', projects?.length || 0, projErr ? projErr.message : 'OK');
  if (projects?.length) {
    projects.forEach(p => console.log('  Proj:', p.slug, p.name));
  }
}

checkSupabase();
