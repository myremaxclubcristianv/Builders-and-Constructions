import { requireAdmin } from '@/lib/admin-auth';
import { adminCommercialAnalyticsOverviewData } from '@/lib/admin-data';
import { CommercialAnalyticsOverviewView } from '@/components/CommercialAnalyticsOverviewView';

export default async function AdminCommercialAnalyticsPage() {
  await requireAdmin('admin', 'sales');
  const data = await adminCommercialAnalyticsOverviewData();

  return <CommercialAnalyticsOverviewView data={data as any} />;
}
