import { requireAdmin } from '@/lib/admin-auth';
import { adminMarketCoverage } from '@/lib/admin-data';
import { MarketCoverageView } from '@/components/MarketCoverageView';

export default async function MarketCoveragePage() {
  await requireAdmin('admin', 'sales', 'editor');
  const data = await adminMarketCoverage();

  return <MarketCoverageView {...data} />;
}
