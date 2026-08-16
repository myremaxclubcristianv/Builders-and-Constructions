import { requireAdmin } from '@/lib/admin-auth';
import { adminCampaignsList } from '@/lib/admin-data';
import { CampaignsDashboardView } from '@/components/CampaignsDashboardView';

export default async function CampaignsPage() {
  await requireAdmin('admin', 'sales');
  const campaigns = await adminCampaignsList();

  return <CampaignsDashboardView campaigns={campaigns} />;
}
