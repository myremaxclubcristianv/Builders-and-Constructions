import { requireAdmin } from '@/lib/admin-auth';
import { adminResearchQueue } from '@/lib/admin-data';
import { ResearchQueueView } from '@/components/ResearchQueueView';

export default async function ResearchQueuePage() {
  await requireAdmin('admin', 'editor', 'sales');
  const data = await adminResearchQueue();

  return <ResearchQueueView {...data} />;
}
