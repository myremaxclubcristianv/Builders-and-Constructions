import {notFound} from 'next/navigation';
import {requireAdmin} from '@/lib/admin-auth';
import {getLeadWithNotes} from '@/lib/admin-data';
import {LeadDetailView} from '@/components/LeadDetailView';

export default async function LeadDetailPage({params}:{params:Promise<{id:string}>}){
  await requireAdmin('admin','sales');
  const {id}=await params;
  const {lead,notes,connectedCompany,connectedOpportunity}=await getLeadWithNotes(id);
  if(!lead)notFound();

  return (
    <LeadDetailView
      initialLead={lead}
      initialNotes={notes}
      connectedCompany={connectedCompany}
      connectedOpportunity={connectedOpportunity}
    />
  );
}
