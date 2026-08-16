import {notFound} from 'next/navigation';
import Link from 'next/link';
import {requireAdmin} from '@/lib/admin-auth';
import {adminRecord, projectProgressHistory} from '@/lib/admin-data';
import {ProjectProgressEditor} from '@/components/ProjectProgressEditor';

export default async function ProjectProgressPage({params}:{params:Promise<{id:string}>}){
  await requireAdmin('admin','editor');
  const {id}=await params;
  const project=await adminRecord('projects',id);
  if(!project)notFound();

  const history=await projectProgressHistory(id);

  return (
    <>
      <div style={{marginBottom: 20}}>
        <Link href={`/admin/projects/${id}/edit`} className="btn">
          ← Back to Project Details
        </Link>
      </div>

      <div className="eyebrow">Project Progress History</div>
      <h1 className="admin-title">{String(project.name).toUpperCase()}</h1>

      <ProjectProgressEditor projectId={id} initialHistory={history}/>
    </>
  );
}
