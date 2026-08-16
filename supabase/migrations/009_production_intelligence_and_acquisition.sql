-- CONSTRUCTIONS by AiXLuxury: Migration 009 - Production Intelligence, Acquisition & System Integrity
-- Additive, idempotent, backward-compatible, preserving strict RLS and zero data fabrication.

-- 1. Extend decision_makers table for verified attribution and status
alter table decision_makers add column if not exists source text;
alter table decision_makers add column if not exists source_url text;
alter table decision_makers add column if not exists verified_at timestamptz;
alter table decision_makers add column if not exists notes text;
alter table decision_makers add column if not exists status text not null default 'active' check (status in ('active', 'archived'));
alter table decision_makers add column if not exists verification_state text not null default 'unverified' check (verification_state in ('unverified', 'publicly_verified', 'company_verified', 'confirmed_by_contact'));

-- 2. Extend outreach_drafts table for strict approval lifecycle & metadata
alter table outreach_drafts add column if not exists approval_state text not null default 'draft' check (approval_state in ('draft', 'ready_for_review', 'approved', 'sent', 'cancelled'));
alter table outreach_drafts add column if not exists approved_by text;
alter table outreach_drafts add column if not exists approved_at timestamptz;
alter table outreach_drafts add column if not exists sent_at timestamptz;
alter table outreach_drafts add column if not exists metadata jsonb not null default '{}'::jsonb;

-- Channel constraint verification (supports executive_email, linkedin, whatsapp, phone, short_message, call_opening, follow_up)
-- Ensure channel column exists and allows new channels
alter table outreach_drafts drop constraint if exists outreach_drafts_channel_check;
alter table outreach_drafts add constraint outreach_drafts_channel_check check (channel in ('executive_email', 'linkedin', 'whatsapp', 'phone', 'short_message', 'call_opening', 'follow_up'));

-- 3. Comprehensive Audit Infrastructure
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor text not null default 'system',
  actor_role text default 'admin',
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table audit_logs enable row level security;

create policy "admin_audit_logs_read" on audit_logs
  for select using (
    exists (
      select 1 from admin_profiles
      where admin_profiles.user_id = auth.uid()
      and admin_profiles.role in ('admin', 'sales', 'editor')
    )
  );

create policy "admin_audit_logs_insert" on audit_logs
  for insert with check (true);

-- 4. System Health & Operational Diagnostics Table
create table if not exists system_health_logs (
  id uuid primary key default gen_random_uuid(),
  service text not null,
  status text not null check (status in ('HEALTHY', 'WARNING', 'ERROR', 'NOT CONFIGURED')),
  environment text not null default 'PRODUCTION',
  details jsonb not null default '{}'::jsonb,
  checked_at timestamptz not null default now()
);

alter table system_health_logs enable row level security;

create policy "admin_system_health_all" on system_health_logs
  for all using (
    exists (
      select 1 from admin_profiles
      where admin_profiles.user_id = auth.uid()
      and admin_profiles.role = 'admin'
    )
  );

-- Indexes for lightning fast acquisition, queue, and security lookups
create index if not exists decision_makers_company_active_idx on decision_makers(company_id, status);
create index if not exists decision_makers_verification_idx on decision_makers(verification_state);
create index if not exists outreach_drafts_approval_idx on outreach_drafts(approval_state, company_id);
create index if not exists audit_logs_entity_idx on audit_logs(entity_type, entity_id, created_at desc);
create index if not exists audit_logs_action_idx on audit_logs(action, created_at desc);
create index if not exists system_health_service_idx on system_health_logs(service, checked_at desc);
