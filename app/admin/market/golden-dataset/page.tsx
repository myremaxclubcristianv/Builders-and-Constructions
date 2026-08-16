import { requireAdmin } from '@/lib/admin-auth';
import { adminMarketActivationTrackerData } from '@/lib/admin-data';
import { GoldenDatasetActivationView } from '@/components/GoldenDatasetActivationView';

export default async function AdminGoldenDatasetPage() {
  await requireAdmin('admin', 'sales', 'editor');
  const items = await adminMarketActivationTrackerData();

  return <GoldenDatasetActivationView items={items as any} />;
}
