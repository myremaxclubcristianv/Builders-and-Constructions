import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getServiceClient } from '@/lib/supabase';
import { adminLogAuditEvent } from '@/lib/admin-data';

export async function GET(request: Request) {
  try {
    await requireAdmin('admin', 'sales');
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    const client = getServiceClient();
    if (!client) {
      return NextResponse.json([]);
    }

    let q = client.from('outreach_drafts').select('*').order('created_at', { ascending: false });
    if (companyId) q = q.eq('company_id', companyId);

    const { data, error } = await q;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin('admin', 'sales');
    const body = await request.json();
    const {
      id,
      company_id,
      opportunity_id,
      channel,
      recipient_name,
      recipient_role,
      recipient_contact,
      subject,
      body: messageBody,
      approval_state = 'draft',
      metadata = {}
    } = body;

    if (!company_id || !channel || !messageBody) {
      return NextResponse.json({ error: 'company_id, channel, and body are required' }, { status: 400 });
    }

    const client = getServiceClient();
    const nowIso = new Date().toISOString();

    if (!client) {
      const mockResult = {
        id: id || `mock-draft-${Date.now()}`,
        company_id,
        opportunity_id: opportunity_id || null,
        channel,
        recipient_name: recipient_name?.trim() || null,
        recipient_role: recipient_role?.trim() || null,
        recipient_contact: recipient_contact?.trim() || null,
        subject: subject?.trim() || null,
        body: messageBody.trim(),
        approval_state,
        approved_by: approval_state === 'approved' ? admin.email : null,
        approved_at: approval_state === 'approved' ? nowIso : null,
        sent_at: approval_state === 'sent' ? nowIso : null,
        metadata,
        created_at: nowIso
      };
      return NextResponse.json(mockResult, { status: 201 });
    }

    let resultData: any = null;

    // Check existing record if updating
    let existingRecord: any = null;
    if (id) {
      const { data: ex } = await client.from('outreach_drafts').select('*').eq('id', id).maybeSingle();
      existingRecord = ex;
    }

    // STRICT APPROVAL BARRIER:
    // Only messages previously APPROVED can be marked SENT.
    if (approval_state === 'sent') {
      if (!existingRecord || (existingRecord.approval_state !== 'approved' && existingRecord.approval_status !== 'approved')) {
        // If not already approved, allow only if user is an admin explicitly approving & sending
        if (admin.role !== 'admin') {
          return NextResponse.json({
            error: 'Approval Barrier: Outreach message must be explicitly APPROVED before it can be marked as SENT.'
          }, { status: 403 });
        }
      }
    }

    const updatePayload: Record<string, any> = {
      company_id,
      opportunity_id: opportunity_id || null,
      channel,
      recipient_name: recipient_name?.trim() || null,
      recipient_role: recipient_role?.trim() || null,
      recipient_contact: recipient_contact?.trim() || null,
      subject: subject?.trim() || null,
      body: messageBody.trim(),
      approval_state,
      metadata
    };

    if (approval_state === 'approved') {
      updatePayload.approved_by = admin.email;
      updatePayload.approved_at = nowIso;
    } else if (approval_state === 'sent') {
      updatePayload.sent_at = nowIso;
      if (!existingRecord?.approved_by) {
        updatePayload.approved_by = admin.email;
        updatePayload.approved_at = nowIso;
      }
    }

    if (id) {
      const { data, error } = await client
        .from('outreach_drafts')
        .update(updatePayload)
        .eq('id', id)
        .select('*')
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      resultData = data;
    } else {
      const { data, error } = await client
        .from('outreach_drafts')
        .insert(updatePayload)
        .select('*')
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      resultData = data;
    }

    // If marked as SENT, automatically log to sales_activities and update last_contacted_at
    if (approval_state === 'sent') {
      await client.from('sales_activities').insert({
        company_id,
        activity_type: channel === 'executive_email' ? 'email' : channel === 'phone' ? 'call' : 'other',
        summary: `Sent ${channel.replace('_', ' ')} outreach`,
        details: subject ? `Subject: ${subject}\n\n${messageBody}` : messageBody,
        author_name: admin.email,
        activity_date: nowIso
      });

      await client.from('private_opportunity_scores').update({
        last_contacted_at: nowIso,
        pipeline_status: 'contacted'
      }).eq('company_id', company_id);

      await adminLogAuditEvent({
        actor: admin.email,
        actorRole: admin.role,
        action: 'SENT_OUTREACH',
        entityType: 'outreach_draft',
        entityId: resultData.id,
        metadata: { channel, company_id, recipient_name }
      });
    } else {
      await adminLogAuditEvent({
        actor: admin.email,
        actorRole: admin.role,
        action: `OUTREACH_${approval_state.toUpperCase()}`,
        entityType: 'outreach_draft',
        entityId: resultData.id,
        metadata: { channel, company_id, approval_state }
      });
    }

    return NextResponse.json(resultData, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}
