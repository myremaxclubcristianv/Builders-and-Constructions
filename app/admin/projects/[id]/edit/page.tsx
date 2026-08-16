import {notFound} from 'next/navigation';
import {requireAdmin} from '@/lib/admin-auth';
import {adminRecord, projectRelationships, entityMediaList} from '@/lib/admin-data';
import {AdminRecordEditor} from '@/components/AdminRecordEditor';
import {RelationshipEditor} from '@/components/RelationshipEditor';
import {MediaManager} from '@/components/MediaManager';
import Link from 'next/link';

export default async function EditProject({params}:{params:Promise<{id:string}>}){
  await requireAdmin('admin','editor');
  const {id}=await params;
  const record=await adminRecord('projects',id);
  if(!record)notFound();
  const [{companies,relations}, media]=await Promise.all([
    projectRelationships(id),
    entityMediaList({projectId:id})
  ]);
  return (
    <>
      <div style={{marginBottom: 16, display: 'flex', gap: 12}}>
        <Link href={`/admin/projects/${id}/progress`} className="btn">
          View / Manage Project Progress History →
        </Link>
      </div>
      <AdminRecordEditor resource="projects" record={record}/>
      <RelationshipEditor projectId={id} companies={companies} relations={relations}/>
      <MediaManager entityType="projects" entityId={id} initialMedia={media}/>
    </>
  );
}
