import {notFound} from 'next/navigation';
import {requireAdmin} from '@/lib/admin-auth';
import {getClaimDetail} from '@/lib/admin-data';
import {ClaimDetailView} from '@/components/ClaimDetailView';

export default async function ClaimDetailPage({params}:{params:Promise<{id:string}>}){
  await requireAdmin('admin','sales');
  const {id}=await params;
  const {claim,company}=await getClaimDetail(id);
  if(!claim)notFound();

  return <ClaimDetailView initialClaim={claim} company={company}/>;
}
