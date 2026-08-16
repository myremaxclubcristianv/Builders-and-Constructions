import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-auth';
import { getOpportunityDetail } from '@/lib/admin-data';
import { CompanyDigitalAuditView } from '@/components/CompanyDigitalAuditView';

export default async function CompanyAuditReportPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin('admin', 'sales', 'editor');
  const { id } = await params;
  const { company, opportunity } = await getOpportunityDetail(id);

  if (!company) notFound();

  return <CompanyDigitalAuditView company={company} opportunity={opportunity} />;
}
