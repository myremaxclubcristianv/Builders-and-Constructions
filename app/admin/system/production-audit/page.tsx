import { requireAdmin } from '@/lib/admin-auth';
import { adminProductionSystemAuditData } from '@/lib/admin-data';
import { ProductionSystemAuditView } from '@/components/ProductionSystemAuditView';

export default async function AdminProductionSystemAuditPage() {
  await requireAdmin('admin');
  const data = await adminProductionSystemAuditData();

  return <ProductionSystemAuditView data={data as any} />;
}
