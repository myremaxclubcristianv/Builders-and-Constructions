import { requireAdmin } from '@/lib/admin-auth';
import { adminMarketActivationTrackerData } from '@/lib/admin-data';
import { GoldenDatasetExecutionBoardView } from '@/components/GoldenDatasetExecutionBoardView';

export default async function AdminGoldenDatasetExecutionPage() {
  await requireAdmin('admin', 'sales', 'editor');
  const items = await adminMarketActivationTrackerData();

  return <GoldenDatasetExecutionBoardView items={items as any} />;
}
