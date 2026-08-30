import { getServiceClient, isSupabaseConfigured } from '../lib/supabase';

async function testSupabase() {
  console.log('Supabase configured:', isSupabaseConfigured());
  console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'PRESENT' : 'MISSING');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'PRESENT' : 'MISSING');

  const client = getServiceClient();
  if (!client) {
    console.log('Client null');
    return;
  }

  const { data, error } = await client.from('leads').select('*').limit(1);
  console.log('Leads table query:', { count: data?.length, error });
}

testSupabase();
