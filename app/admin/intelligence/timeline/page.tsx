import { requireAdmin } from '@/lib/admin-auth';
import { adminMarketChangesData } from '@/lib/admin-data';
import { IntelligenceTimelineView } from '@/components/IntelligenceTimelineView';

export default async function AdminIntelligenceTimelinePage() {
  await requireAdmin('admin', 'sales', 'editor');
  const events = await adminMarketChangesData();

  return <IntelligenceTimelineView events={events as any} />;
}
