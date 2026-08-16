import { requireAdminOrRole } from '@/lib/admin-auth';
import { adminMarketOpportunityRadar } from '@/lib/admin-data';
import { MarketOpportunityRadarView } from '@/components/MarketOpportunityRadarView';

export default async function AdminAcquisitionRadarPage() {
  await requireAdminOrRole(['admin', 'sales']);
  const radarData = await adminMarketOpportunityRadar();

  return <MarketOpportunityRadarView initialData={radarData as any} />;
}
