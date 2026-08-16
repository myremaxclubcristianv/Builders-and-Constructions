import { notFound } from 'next/navigation';
import { requireAdminOrRole } from '@/lib/admin-auth';
import { getServiceClient } from '@/lib/supabase';
import { adminDecisionMakersList } from '@/lib/admin-data';
import { DecisionMakersManager } from '@/components/DecisionMakersManager';

export default async function AdminCompanyDecisionMakersPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminOrRole(['admin', 'sales', 'editor']);
  const { id } = await params;

  const c = getServiceClient();
  let companyData: any = null;

  if (c) {
    const { data } = await c.from('companies').select('id, name, slug, city, location').eq('id', id).maybeSingle();
    companyData = data;
  } else {
    // Demonstration fallback for local preview
    companyData = { id, name: 'Erbașu Construcții', slug: 'erbasu-demo', city: 'Bucharest' };
  }

  if (!companyData) {
    notFound();
  }

  const decisionMakers = await adminDecisionMakersList(id);

  return (
    <DecisionMakersManager
      company={companyData}
      initialDecisionMakers={decisionMakers as any}
    />
  );
}
