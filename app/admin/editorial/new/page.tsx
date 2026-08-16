import {requireAdmin} from '@/lib/admin-auth';
import {getServiceClient} from '@/lib/supabase';
import {EditorialEditor} from '@/components/EditorialEditor';

export default async function NewEditorialArticle(){
  await requireAdmin('admin','editor');
  const client=getServiceClient();
  let companies: {id:string; name:string}[]=[];
  let projects: {id:string; name:string}[]=[];
  if(client){
    const [{data:cData},{data:pData}]=await Promise.all([
      client.from('companies').select('id,name').order('name'),
      client.from('projects').select('id,name').order('name')
    ]);
    companies=cData||[];
    projects=pData||[];
  }
  return <EditorialEditor companies={companies} projects={projects}/>;
}
