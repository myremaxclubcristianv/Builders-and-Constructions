import { requireAdmin } from '@/lib/admin-auth';
import { adminProspectActivation } from '@/lib/admin-data';
import { ProspectActivationView } from '@/components/ProspectActivationView';

export default async function ProspectActivationPage() {
  await requireAdmin('admin', 'sales');
  const data = await adminProspectActivation();

  return <ProspectActivationView {...data} />;
}
