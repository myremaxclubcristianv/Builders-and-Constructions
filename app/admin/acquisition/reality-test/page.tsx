import { requireAdmin } from '@/lib/admin-auth';
import { adminAcquisitionRealityTestData } from '@/lib/admin-data';
import { AcquisitionRealityTestView } from '@/components/AcquisitionRealityTestView';

export default async function AdminAcquisitionRealityTestPage() {
  await requireAdmin('admin', 'sales');
  const candidates = await adminAcquisitionRealityTestData();

  return <AcquisitionRealityTestView candidates={candidates as any} />;
}
