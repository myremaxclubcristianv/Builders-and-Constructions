import { requireAdmin } from '@/lib/admin-auth';
import { adminMarketCoverageExecutiveData } from '@/lib/admin-data';
import { MarketCoverageExecutiveView } from '@/components/MarketCoverageExecutiveView';

export default async function AdminMarketCoveragePage() {
  await requireAdmin('admin', 'sales', 'editor');
  const data = await adminMarketCoverageExecutiveData();

  return <MarketCoverageExecutiveView data={data as any} />;
}
