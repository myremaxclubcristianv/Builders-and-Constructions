import { requireAdmin } from '@/lib/admin-auth';
import { adminCommercialCommandCenter } from '@/lib/admin-data';
import { CommercialCommandCenterView } from '@/components/CommercialCommandCenterView';

export default async function CommercialCommandCenterPage() {
  await requireAdmin('admin', 'sales');
  const data = await adminCommercialCommandCenter();

  return <CommercialCommandCenterView {...data} />;
}
