import { requireAdmin } from '@/lib/admin-auth';
import { adminMarketActivityFeed } from '@/lib/admin-data';
import { MarketActivityFeedView } from '@/components/MarketActivityFeedView';

export default async function MarketActivityPage() {
  await requireAdmin('admin', 'sales', 'editor');
  const signals = await adminMarketActivityFeed();

  return <MarketActivityFeedView signals={signals} />;
}
