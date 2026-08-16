import {notFound} from 'next/navigation';
import {requireAdmin} from '@/lib/admin-auth';
import {adminRecord, companyRelationships, entityMediaList} from '@/lib/admin-data';
import {AdminRecordEditor} from '@/components/AdminRecordEditor';
import {CompanyProjectsEditor} from '@/components/CompanyProjectsEditor';
import {MediaManager} from '@/components/MediaManager';

export default async function EditCompany({params}:{params:Promise<{id:string}>}){
  await requireAdmin('admin','editor');
  const {id}=await params;
  const record=await adminRecord('companies',id);
  if(!record)notFound();
  const [{projects,relations}, media]=await Promise.all([
    companyRelationships(id),
    entityMediaList({companyId:id})
  ]);
  return (
    <>
      <AdminRecordEditor resource="companies" record={record}/>
      <CompanyProjectsEditor companyId={id} projects={projects} relations={relations}/>
      <MediaManager entityType="companies" entityId={id} initialMedia={media}/>
    </>
  );
}
