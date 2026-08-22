import { requireAdmin } from '@/lib/admin-auth';
import { adminContactIntelligenceMatrixData } from '@/lib/admin-data';
import { ContactIntelligenceView } from '@/components/ContactIntelligenceView';

export default async function AdminMarketCoveragePage() {
  await requireAdmin('admin', 'sales', 'editor');
  const contacts = await adminContactIntelligenceMatrixData();

  return <ContactIntelligenceView contacts={contacts as any} />;
}
