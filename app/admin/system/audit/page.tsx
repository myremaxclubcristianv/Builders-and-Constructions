import { requireAdmin } from '@/lib/admin-auth';
import { adminAuditLogsList } from '@/lib/admin-data';
import { AuditLogsView } from '@/components/AuditLogsView';

export default async function AdminAuditLogsPage() {
  await requireAdmin('admin');
  const logs = await adminAuditLogsList(100);

  return <AuditLogsView logs={logs as any} />;
}
