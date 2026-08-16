import { requireAdmin } from '@/lib/admin-auth';
import { adminMarketActivationTrackerData } from '@/lib/admin-data';
import { MarketActivationTrackerView } from '@/components/MarketActivationTrackerView';

export default async function AdminMarketActivationPage() {
  await requireAdmin('admin', 'sales', 'editor');
  const items = await adminMarketActivationTrackerData();

  return <MarketActivationTrackerView items={items as any} />;
}
