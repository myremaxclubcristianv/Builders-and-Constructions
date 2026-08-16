import { requireAdmin } from '@/lib/admin-auth';
import { adminExecutiveDailyBriefingData } from '@/lib/admin-data';
import { ExecutiveDailyBriefingView } from '@/components/ExecutiveDailyBriefingView';

export default async function AdminExecutivePage() {
  await requireAdmin('admin', 'sales');
  const data = await adminExecutiveDailyBriefingData();

  return <ExecutiveDailyBriefingView data={data as any} />;
}
