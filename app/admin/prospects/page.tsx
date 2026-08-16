import { requireAdmin } from '@/lib/admin-auth';
import { adminProspectsList } from '@/lib/admin-data';
import { ProspectsListView } from '@/components/ProspectsListView';

export default async function ProspectsPage() {
  await requireAdmin('admin', 'sales');
  const data = await adminProspectsList();

  return <ProspectsListView {...data} />;
}
