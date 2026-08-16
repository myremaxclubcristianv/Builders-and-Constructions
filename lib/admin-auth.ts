import { cookies, headers } from 'next/headers';
import { getServiceClient } from '@/lib/supabase';

export type AdminRole = 'admin' | 'editor' | 'sales';
export type AdminIdentity = { id:string; email:string; role:AdminRole };

export async function getAdminIdentity():Promise<AdminIdentity | null>{
  const token=(await headers()).get('authorization')?.replace(/^Bearer\s+/i,'') || (await cookies()).get('aix_admin_session')?.value;
  const client=getServiceClient(); if(!token||!client)return null;
  const {data:{user}}=await client.auth.getUser(token); if(!user)return null;
  const {data:profile}=await client.from('admin_profiles').select('role').eq('id',user.id).maybeSingle();
  if(!profile||!['admin','editor','sales'].includes(profile.role))return null;
  return {id:user.id,email:user.email || '',role:profile.role as AdminRole};
}
export async function requireAdmin(...roles:ReadonlyArray<AdminRole>){const identity=await getAdminIdentity();if(!identity||roles.length&&!roles.includes(identity.role))throw new Error('UNAUTHORIZED');return identity;}
export async function requireAdminOrRole(roles: ReadonlyArray<AdminRole>){return requireAdmin(...roles);}
