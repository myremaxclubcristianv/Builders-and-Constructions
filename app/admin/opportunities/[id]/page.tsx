import {notFound} from 'next/navigation';
import {requireAdmin} from '@/lib/admin-auth';
import {getOpportunityDetail} from '@/lib/admin-data';
import {OpportunityDetailView} from '@/components/OpportunityDetailView';

export default async function OpportunityDetailPage({params}:{params:Promise<{id:string}>}){
  await requireAdmin('admin','sales');
  const {id}=await params;
  const {opportunity,company,projects,activities,leads,proposals}=await getOpportunityDetail(id);
  if(!company)notFound();

  return (
    <OpportunityDetailView
      company={company}
      initialOpportunity={opportunity}
      projects={projects}
      activities={activities}
      leads={leads}
      proposals={proposals}
    />
  );
}
