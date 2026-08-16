import { requireAdmin } from '@/lib/admin-auth';
import { adminLiveMarketActivationSummary } from '@/lib/admin-data';
import { LiveMarketActivationView } from '@/components/LiveMarketActivationView';

export default async function AdminLiveMarketActivationPage() {
  await requireAdmin('admin', 'sales', 'editor');
  const data = await adminLiveMarketActivationSummary();

  return <LiveMarketActivationView data={data as any} />;
}
