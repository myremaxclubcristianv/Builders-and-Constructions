import { requireAdminOrRole } from '@/lib/admin-auth';
import { adminAcquisitionCommandCenter } from '@/lib/admin-data';
import { AcquisitionCommandCenterView } from '@/components/AcquisitionCommandCenterView';

export default async function AdminAcquisitionPage() {
  await requireAdminOrRole(['admin', 'sales']);
  const data = await adminAcquisitionCommandCenter();

  return <AcquisitionCommandCenterView initialData={data as any} />;
}
