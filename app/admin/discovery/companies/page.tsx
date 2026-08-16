import { requireAdmin } from '@/lib/admin-auth';
import { adminDiscoveryJobs } from '@/lib/admin-data';
import { DiscoveryJobsView } from '@/components/DiscoveryJobsView';

export default async function DiscoveryCompaniesPage() {
  await requireAdmin('admin', 'editor');
  const data = await adminDiscoveryJobs();

  return <DiscoveryJobsView {...data} />;
}
