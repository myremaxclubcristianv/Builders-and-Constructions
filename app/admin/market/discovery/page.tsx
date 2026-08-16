import { requireAdmin } from '@/lib/admin-auth';
import { adminDiscoverySources, adminDiscoveryJobs } from '@/lib/admin-data';
import { MarketDiscoveryExecutionView } from '@/components/MarketDiscoveryExecutionView';

export default async function AdminMarketDiscoveryPage() {
  await requireAdmin('admin', 'editor');
  const [sources, jobsData] = await Promise.all([
    adminDiscoverySources(),
    adminDiscoveryJobs()
  ]);

  return (
    <MarketDiscoveryExecutionView
      sources={sources as any}
      jobs={jobsData.jobs as any}
      companyItems={jobsData.companyItems as any}
      projectItems={jobsData.projectItems as any}
    />
  );
}
