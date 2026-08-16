import { requireAdmin } from '@/lib/admin-auth';
import { adminMarketActivationTrackerData } from '@/lib/admin-data';
import { GoldenDatasetQualityGateView } from '@/components/GoldenDatasetQualityGateView';

export default async function AdminGoldenDatasetQualityPage() {
  await requireAdmin('admin', 'sales', 'editor');
  const items = await adminMarketActivationTrackerData();

  return <GoldenDatasetQualityGateView items={items as any} />;
}
