import { requireAdmin } from '@/lib/admin-auth';
import { adminScoreHistoryData } from '@/lib/admin-data';
import { ScoreHistoryView } from '@/components/ScoreHistoryView';

export default async function AdminScoreHistoryPage() {
  await requireAdmin('admin', 'sales');
  const history = await adminScoreHistoryData();

  return <ScoreHistoryView history={history as any} />;
}
