import {NextResponse} from 'next/server';
import {requireAdmin} from '@/lib/admin-auth';
import {getServiceClient} from '@/lib/supabase';
import {VALID_ROLES} from '@/lib/roles';

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const actor=await requireAdmin('admin','editor');
    const {id:companyId}=await params;
    const body=await request.json();
    if(!body.projectId||!VALID_ROLES.includes(body.role)){
      return NextResponse.json({error:'Select a project and a valid role.'},{status:400});
    }
    const client=getServiceClient();
    if(!client)return NextResponse.json({error:'Supabase is not configured.'},{status:503});

    const {error}=await client.from('project_companies').insert({
      company_id:companyId,
      project_id:body.projectId,
      role:body.role,
      verified_at:body.verified?new Date().toISOString():null
    });

    if(error){
      return NextResponse.json({
        error:error.code==='23505'?'This project already has that role for this company.':error.message
      },{status:400});
    }

    await client.from('audit_log').insert({
      actor_id:actor.id,
      action:'relationship_created',
      entity_type:'company',
      entity_id:companyId
    });

    return NextResponse.json({ok:true},{status:201});
  }catch{
    return NextResponse.json({error:'Not authorized.'},{status:403});
  }
}

export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const actor=await requireAdmin('admin','editor');
    const {id:companyId}=await params;
    const body=await request.json();
    const {projectId, oldRole, newRole, verified}=body;
    if(!projectId || !oldRole || !newRole || !VALID_ROLES.includes(newRole)){
      return NextResponse.json({error:'Invalid role update payload.'},{status:400});
    }
    const client=getServiceClient();
    if(!client)return NextResponse.json({error:'Supabase is not configured.'},{status:503});

    const {error:delErr}=await client.from('project_companies').delete().eq('company_id',companyId).eq('project_id',projectId).eq('role',oldRole);
    if(delErr)return NextResponse.json({error:delErr.message},{status:400});

    const {error:insErr}=await client.from('project_companies').insert({
      company_id:companyId,
      project_id:projectId,
      role:newRole,
      verified_at:verified?new Date().toISOString():null
    });
    if(insErr)return NextResponse.json({error:insErr.message},{status:400});

    await client.from('audit_log').insert({
      actor_id:actor.id,
      action:'relationship_updated',
      entity_type:'company',
      entity_id:companyId
    });

    return NextResponse.json({ok:true});
  }catch{
    return NextResponse.json({error:'Not authorized.'},{status:403});
  }
}

export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const actor=await requireAdmin('admin','editor');
    const {id:companyId}=await params;
    const {projectId,role}=await request.json();
    const client=getServiceClient();
    if(!client)return NextResponse.json({error:'Supabase is not configured.'},{status:503});
    const {error}=await client.from('project_companies').delete().eq('company_id',companyId).eq('project_id',projectId).eq('role',role);
    if(error)return NextResponse.json({error:error.message},{status:400});
    await client.from('audit_log').insert({
      actor_id:actor.id,
      action:'relationship_removed',
      entity_type:'company',
      entity_id:companyId
    });
    return NextResponse.json({ok:true});
  }catch{
    return NextResponse.json({error:'Not authorized.'},{status:403});
  }
}
