import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getServiceClient } from '@/lib/supabase';
import { adminLogAuditEvent } from '@/lib/admin-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) return NextResponse.json({ error: 'companyId is required' }, { status: 400 });

    const client = getServiceClient();
    if (!client) return NextResponse.json([]);

    const { data, error } = await client
      .from('decision_makers')
      .select('*')
      .eq('company_id', companyId)
      .eq('status', 'active')
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error fetching decision makers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin('admin', 'sales', 'editor');
    const body = await request.json();
    const {
      id,
      company_id,
      name,
      role,
      email,
      phone,
      linkedin_url,
      source,
      source_url,
      verification_state = 'unverified',
      verified_at,
      notes,
      is_primary = false,
      status = 'active'
    } = body;

    if (!company_id || !name || !role) {
      return NextResponse.json({ error: 'company_id, name, and role are required.' }, { status: 400 });
    }

    const client = getServiceClient();
    if (!client) {
      return NextResponse.json({
        id: id || `mock-dm-${Date.now()}`,
        company_id,
        name,
        role,
        email: email || null,
        phone: phone || null,
        linkedin_url: linkedin_url || null,
        source: source || null,
        source_url: source_url || null,
        verification_state,
        verified_at: verified_at || (verification_state !== 'unverified' ? new Date().toISOString() : null),
        notes: notes || null,
        is_primary: Boolean(is_primary),
        status,
        created_at: new Date().toISOString()
      }, { status: 201 });
    }

    // If setting as primary, clear primary flag for other decision makers of this company
    if (is_primary) {
      await client
        .from('decision_makers')
        .update({ is_primary: false })
        .eq('company_id', company_id);
    }

    let resultData = null;

    if (id) {
      // Update existing
      const { data, error } = await client
        .from('decision_makers')
        .update({
          name: name.trim(),
          role: role.trim(),
          email: email?.trim() || null,
          phone: phone?.trim() || null,
          linkedin_url: linkedin_url?.trim() || null,
          source: source?.trim() || null,
          source_url: source_url?.trim() || null,
          verification_state,
          verified_at: verified_at || (verification_state !== 'unverified' ? new Date().toISOString() : null),
          notes: notes?.trim() || null,
          is_primary: Boolean(is_primary),
          status
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      resultData = data;

      await adminLogAuditEvent({
        actor: admin.email,
        actorRole: admin.role,
        action: 'UPDATE_DECISION_MAKER',
        entityType: 'decision_maker',
        entityId: id,
        metadata: { name, role, verification_state, status, company_id }
      });
    } else {
      // Insert new
      const { data, error } = await client
        .from('decision_makers')
        .insert({
          company_id,
          name: name.trim(),
          role: role.trim(),
          email: email?.trim() || null,
          phone: phone?.trim() || null,
          linkedin_url: linkedin_url?.trim() || null,
          source: source?.trim() || null,
          source_url: source_url?.trim() || null,
          verification_state,
          verified_at: verified_at || (verification_state !== 'unverified' ? new Date().toISOString() : null),
          notes: notes?.trim() || null,
          is_primary: Boolean(is_primary),
          status
        })
        .select('*')
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      resultData = data;

      await adminLogAuditEvent({
        actor: admin.email,
        actorRole: admin.role,
        action: 'CREATE_DECISION_MAKER',
        entityType: 'decision_maker',
        entityId: resultData.id,
        metadata: { name, role, verification_state, company_id }
      });
    }

    return NextResponse.json(resultData, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdmin('admin', 'sales', 'editor');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Decision maker ID is required' }, { status: 400 });

    const client = getServiceClient();
    if (client) {
      await client.from('decision_makers').update({ status: 'archived' }).eq('id', id);
      await adminLogAuditEvent({
        actor: admin.email,
        actorRole: admin.role,
        action: 'ARCHIVE_DECISION_MAKER',
        entityType: 'decision_maker',
        entityId: id
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}
