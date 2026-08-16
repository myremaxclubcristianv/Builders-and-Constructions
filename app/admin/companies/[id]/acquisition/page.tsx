import { notFound } from 'next/navigation';
import { requireAdminOrRole } from '@/lib/admin-auth';
import { adminCompanyAcquisitionProfile } from '@/lib/admin-data';
import { CompanyAcquisitionProfileView } from '@/components/CompanyAcquisitionProfileView';

export default async function AdminCompanyAcquisitionPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminOrRole(['admin', 'sales']);
  const { id } = await params;

  const profile = await adminCompanyAcquisitionProfile(id);
  if (!profile) {
    notFound();
  }

  return <CompanyAcquisitionProfileView profile={profile as any} />;
}
