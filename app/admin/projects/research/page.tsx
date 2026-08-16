import { requireAdmin } from '@/lib/admin-auth';
import { getServiceClient } from '@/lib/supabase';
import { ProjectResearchWorkstation } from '@/components/ProjectResearchWorkstation';

export default async function ProjectResearchPage() {
  await requireAdmin('admin', 'editor');
  const client = getServiceClient();

  let companies: any[] = [];
  if (client) {
    const { data } = await client.from('companies').select('id, name, type').order('name');
    companies = data || [];
  }

  return <ProjectResearchWorkstation companies={companies} />;
}
