import { requireAdmin } from '@/lib/admin-auth';
import { adminCommercialAnalytics } from '@/lib/admin-data';
import { CommercialAnalyticsView } from '@/components/CommercialAnalyticsView';

export default async function AdminAnalyticsPage() {
  await requireAdmin('admin', 'sales');
  const data = await adminCommercialAnalytics();

  return <CommercialAnalyticsView {...data} />;
}
