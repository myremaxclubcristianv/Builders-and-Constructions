import {NextResponse} from 'next/server';
import {requireAdmin} from '@/lib/admin-auth';
import {getServiceClient} from '@/lib/supabase';
import {VALID_ROLES} from '@/lib/roles';

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const actor=await requireAdmin('admin','editor');
    const {id}=await params;
    const body=await request.json();
    if(!body.companyId||!VALID_ROLES.includes(body.role)){
      return NextResponse.json({error:'Select a company and a valid role.'},{status:400});
    }
    const client=getServiceClient();
    if(!client)return NextResponse.json({error:'Supabase is not configured.'},{status:503});

    const {error}=await client.from('project_companies').insert({
      project_id:id,
      company_id:body.companyId,
      role:body.role,
      verified_at:body.verified?new Date().toISOString():null
    });

    if(error){
      return NextResponse.json({
        error:error.code==='23505'?'This company already has that role on the project.':error.message
      },{status:400});
    }

    await client.from('audit_log').insert({
      actor_id:actor.id,
      action:'relationship_created',
      entity_type:'project',
      entity_id:id
    });

    return NextResponse.json({ok:true},{status:201});
  }catch{
    return NextResponse.json({error:'Not authorized.'},{status:403});
  }
}

export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const actor=await requireAdmin('admin','editor');
    const {id}=await params;
    const body=await request.json();
    const {companyId, oldRole, newRole, verified}=body;
    if(!companyId || !oldRole || !newRole || !VALID_ROLES.includes(newRole)){
      return NextResponse.json({error:'Invalid role update payload.'},{status:400});
    }
    const client=getServiceClient();
    if(!client)return NextResponse.json({error:'Supabase is not configured.'},{status:503});

    // Delete old role and insert new role to preserve primary key constraints
    const {error:delErr}=await client.from('project_companies').delete().eq('project_id',id).eq('company_id',companyId).eq('role',oldRole);
    if(delErr)return NextResponse.json({error:delErr.message},{status:400});

    const {error:insErr}=await client.from('project_companies').insert({
      project_id:id,
      company_id:companyId,
      role:newRole,
      verified_at:verified?new Date().toISOString():null
    });
    if(insErr)return NextResponse.json({error:insErr.message},{status:400});

    await client.from('audit_log').insert({
      actor_id:actor.id,
      action:'relationship_updated',
      entity_type:'project',
      entity_id:id
    });

    return NextResponse.json({ok:true});
  }catch{
    return NextResponse.json({error:'Not authorized.'},{status:403});
  }
}

export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const actor=await requireAdmin('admin','editor');
    const {id}=await params;
    const {companyId,role}=await request.json();
    const client=getServiceClient();
    if(!client)return NextResponse.json({error:'Supabase is not configured.'},{status:503});
    const {error}=await client.from('project_companies').delete().eq('project_id',id).eq('company_id',companyId).eq('role',role);
    if(error)return NextResponse.json({error:error.message},{status:400});
    await client.from('audit_log').insert({
      actor_id:actor.id,
      action:'relationship_removed',
      entity_type:'project',
      entity_id:id
    });
    return NextResponse.json({ok:true});
  }catch{
    return NextResponse.json({error:'Not authorized.'},{status:403});
  }
}
