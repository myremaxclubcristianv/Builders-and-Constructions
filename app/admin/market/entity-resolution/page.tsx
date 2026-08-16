import { requireAdmin } from '@/lib/admin-auth';
import { adminEntityResolutionData } from '@/lib/admin-data';
import { EntityResolutionView } from '@/components/EntityResolutionView';

export default async function AdminEntityResolutionPage() {
  await requireAdmin('admin', 'sales', 'editor');
  const resolutions = await adminEntityResolutionData();

  return <EntityResolutionView resolutions={resolutions as any} />;
}
