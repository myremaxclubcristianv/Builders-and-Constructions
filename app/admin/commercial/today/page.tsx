import { requireAdmin } from '@/lib/admin-auth';
import { adminDailySalesQueue } from '@/lib/admin-data';
import { DailySalesQueueView } from '@/components/DailySalesQueueView';

export default async function DailySalesQueuePage() {
  await requireAdmin('admin', 'sales');
  const queue = await adminDailySalesQueue();

  return <DailySalesQueueView {...queue} />;
}
