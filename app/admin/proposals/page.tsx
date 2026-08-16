import { requireAdmin } from '@/lib/admin-auth';
import { adminProposalsList } from '@/lib/admin-data';
import { ProposalsExecutionView } from '@/components/ProposalsExecutionView';

export default async function AdminProposalsPage() {
  await requireAdmin('admin', 'sales');
  const proposals = await adminProposalsList();

  return <ProposalsExecutionView proposals={proposals as any} />;
}
