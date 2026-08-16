import {notFound} from 'next/navigation';
import {requireAdmin} from '@/lib/admin-auth';
import {adminRecord, entityMediaList} from '@/lib/admin-data';
import {getServiceClient} from '@/lib/supabase';
import {EditorialEditor} from '@/components/EditorialEditor';
import {MediaManager} from '@/components/MediaManager';

export default async function EditEditorialArticle({params}:{params:Promise<{id:string}>}){
  await requireAdmin('admin','editor');
  const {id}=await params;
  const article=await adminRecord('editorial_content',id);
  if(!article)notFound();

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

  const media=await entityMediaList({articleId:id});

  return (
    <>
      <EditorialEditor initialArticle={article} companies={companies} projects={projects}/>
      <MediaManager entityType="editorial" entityId={id} initialMedia={media}/>
    </>
  );
}
