import { requireAdmin } from '@/lib/admin-auth';
import { adminRevenueAttributionChainData } from '@/lib/admin-data';
import { RevenueAttributionExecutiveView } from '@/components/RevenueAttributionExecutiveView';

export default async function AdminRevenueAttributionPage() {
  await requireAdmin('admin', 'sales');
  const chains = await adminRevenueAttributionChainData();

  return <RevenueAttributionExecutiveView chains={chains as any} />;
}
