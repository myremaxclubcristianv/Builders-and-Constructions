import { requireAdmin } from '@/lib/admin-auth';
import { adminDataQualityReport } from '@/lib/admin-data';
import { DataQualityDashboardView } from '@/components/DataQualityDashboardView';

export default async function DataQualityPage() {
  await requireAdmin('admin', 'editor');
  const report = await adminDataQualityReport();

  return <DataQualityDashboardView {...report} />;
}
