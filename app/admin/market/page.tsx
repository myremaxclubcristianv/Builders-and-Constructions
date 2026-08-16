import { requireAdmin } from '@/lib/admin-auth';
import { adminMarketIntelligence } from '@/lib/admin-data';
import { MarketIntelligenceView } from '@/components/MarketIntelligenceView';

export default async function MarketIntelligencePage() {
  await requireAdmin('admin', 'sales');
  const data = await adminMarketIntelligence();

  return <MarketIntelligenceView {...data} />;
}
