import { requireAdminOrRole } from '@/lib/admin-auth';
import { adminDailySalesQueue } from '@/lib/admin-data';
import { DailyAcquisitionQueueView } from '@/components/DailyAcquisitionQueueView';

export default async function AdminAcquisitionTodayPage() {
  await requireAdminOrRole(['admin', 'sales']);
  const queueData = await adminDailySalesQueue();

  return <DailyAcquisitionQueueView initialData={queueData as any} />;
}
