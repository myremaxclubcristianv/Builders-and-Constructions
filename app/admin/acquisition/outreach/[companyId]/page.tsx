import { notFound } from 'next/navigation';
import { requireAdminOrRole } from '@/lib/admin-auth';
import { adminCompanyAcquisitionProfile } from '@/lib/admin-data';
import { OutreachDraftingWorkstation } from '@/components/OutreachDraftingWorkstation';

export default async function AdminOutreachWorkstationPage({
  params
}: {
  params: Promise<{ companyId: string }>;
}) {
  await requireAdminOrRole(['admin', 'sales']);
  const { companyId } = await params;

  const profile = await adminCompanyAcquisitionProfile(companyId);
  if (!profile) {
    notFound();
  }

  return (
    <OutreachDraftingWorkstation
      company={profile.company as any}
      initialDrafts={profile.outreachDrafts as any}
      savedDrafts={profile.savedDrafts as any}
    />
  );
}
