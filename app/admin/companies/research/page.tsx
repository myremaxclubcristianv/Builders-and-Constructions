import { requireAdmin } from '@/lib/admin-auth';
import { CompanyResearchWorkstation } from '@/components/CompanyResearchWorkstation';

export default async function CompanyResearchPage() {
  await requireAdmin('admin', 'editor', 'sales');
  return <CompanyResearchWorkstation />;
}
