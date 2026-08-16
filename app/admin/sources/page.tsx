import { requireAdmin } from '@/lib/admin-auth';
import { adminDiscoverySources } from '@/lib/admin-data';
import { SourceRegistryView } from '@/components/SourceRegistryView';

export default async function SourceRegistryPage() {
  await requireAdmin('admin', 'editor');
  const sources = await adminDiscoverySources();

  return <SourceRegistryView sources={sources} />;
}
