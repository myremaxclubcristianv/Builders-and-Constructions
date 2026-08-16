import { requireAdmin } from '@/lib/admin-auth';
import { adminContactIntelligenceMatrixData } from '@/lib/admin-data';
import { ContactIntelligenceView } from '@/components/ContactIntelligenceView';

export default async function AdminContactIntelligencePage() {
  await requireAdmin('admin', 'sales');
  const contacts = await adminContactIntelligenceMatrixData();

  return <ContactIntelligenceView contacts={contacts as any} />;
}
