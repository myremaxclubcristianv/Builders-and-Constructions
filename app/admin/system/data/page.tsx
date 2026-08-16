import { requireAdmin } from '@/lib/admin-auth';
import { adminProductionDataHealthProbes } from '@/lib/admin-data';
import { ProductionDataHealthView } from '@/components/ProductionDataHealthView';

export default async function AdminProductionDataHealthPage() {
  await requireAdmin('admin');
  const health = await adminProductionDataHealthProbes();

  return <ProductionDataHealthView health={health} />;
}
