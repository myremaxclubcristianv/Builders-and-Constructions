import { requireAdmin } from '@/lib/admin-auth';
import { AdminExportWorkstationView } from '@/components/AdminExportWorkstationView';

export default async function AdminExportPage() {
  await requireAdmin('admin', 'editor', 'sales');
  return <AdminExportWorkstationView />;
}
