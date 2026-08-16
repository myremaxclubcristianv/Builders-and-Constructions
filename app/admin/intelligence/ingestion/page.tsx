import { requireAdmin } from '@/lib/admin-auth';
import { adminIngestionJobsData } from '@/lib/admin-data';
import { IntelligenceIngestionView } from '@/components/IntelligenceIngestionView';

export default async function AdminIntelligenceIngestionPage() {
  await requireAdmin('admin', 'sales', 'editor');
  const jobs = await adminIngestionJobsData();

  return <IntelligenceIngestionView jobs={jobs as any} />;
}
