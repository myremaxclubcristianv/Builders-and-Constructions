import { requireAdmin } from '@/lib/admin-auth';
import { adminDiscoverySources } from '@/lib/admin-data';
import { LiveMarketDiscoveryView } from '@/components/LiveMarketDiscoveryView';

export default async function AdminLiveMarketDiscoveryPage() {
  await requireAdmin('admin', 'editor', 'sales');
  const sources = await adminDiscoverySources();

  return <LiveMarketDiscoveryView registeredSources={sources as any} />;
}
