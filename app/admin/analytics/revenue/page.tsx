import { requireAdmin } from '@/lib/admin-auth';
import { adminCommercialRevenueData } from '@/lib/admin-data';
import { CommercialRevenueAttributionView } from '@/components/CommercialRevenueAttributionView';

export default async function AdminCommercialRevenuePage() {
  await requireAdmin('admin', 'sales');
  const data = await adminCommercialRevenueData();

  return <CommercialRevenueAttributionView data={data as any} />;
}
