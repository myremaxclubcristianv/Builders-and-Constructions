import { requireAdmin } from '@/lib/admin-auth';
import { adminMarketChangesData } from '@/lib/admin-data';
import { MarketChangeDetectionView } from '@/components/MarketChangeDetectionView';

export default async function AdminMarketChangesPage() {
  await requireAdmin('admin', 'sales', 'editor');
  const changes = await adminMarketChangesData();

  return <MarketChangeDetectionView changes={changes as any} />;
}
