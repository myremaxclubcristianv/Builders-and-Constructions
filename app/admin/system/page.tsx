import { requireAdminOrRole } from '@/lib/admin-auth';
import { adminSystemHealthProbes } from '@/lib/admin-data';
import { SystemHealthDashboardView } from '@/components/SystemHealthDashboardView';

export default async function AdminSystemPage() {
  await requireAdminOrRole(['admin']);
  const healthData = await adminSystemHealthProbes();

  return <SystemHealthDashboardView initialData={healthData as any} />;
}
