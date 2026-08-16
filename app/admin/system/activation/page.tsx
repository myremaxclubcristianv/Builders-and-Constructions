import { requireAdmin } from '@/lib/admin-auth';
import { adminSystemActivationLogs } from '@/lib/admin-data';
import { SystemActivationLogView } from '@/components/SystemActivationLogView';

export default async function AdminSystemActivationPage() {
  await requireAdmin('admin');
  const logs = await adminSystemActivationLogs(100);

  return <SystemActivationLogView logs={logs as any} />;
}
