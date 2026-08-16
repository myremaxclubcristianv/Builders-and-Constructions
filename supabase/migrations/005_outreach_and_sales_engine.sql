-- CONSTRUCTIONS by AiXLuxury: Migration 005 - Outreach, Lead Conversion & Sales Intelligence Engine
-- Additive, idempotent and backward-compatible.

-- 1. Expand leads table with granular attribution
alter table leads add column if not exists target_company_id uuid references companies(id) on delete set null;
alter table leads add column if not exists target_project_id uuid references projects(id) on delete set null;
alter table leads add column if not exists landing_path text;
alter table leads add column if not exists referrer text;

-- 2. Expand private_opportunity_scores table with next action and audit data
alter table private_opportunity_scores add column if not exists next_action text;
alter table private_opportunity_scores add column if not exists next_action_date date;
alter table private_opportunity_scores add column if not exists assigned_user_id text;
alter table private_opportunity_scores add column if not exists digital_audit jsonb default '{}'::jsonb;
alter table private_opportunity_scores add column if not exists meeting_notes text;
alter table private_opportunity_scores add column if not exists pitch_notes text;

-- 3. Create sales_activities table for chronological contact history & sales timeline
create table if not exists sales_activities (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  activity_type text not null check (activity_type in ('call', 'email', 'meeting', 'follow_up', 'proposal', 'note', 'status_change', 'other')),
  activity_date timestamptz not null default now(),
  summary text not null,
  details text,
  author_id text,
  author_name text,
  created_at timestamptz not null default now()
);

alter table sales_activities enable row level security;

-- Only authenticated admin/sales can select/insert/update/delete sales activities
create policy "admin and sales can manage sales activities" on sales_activities
  for all using (
    exists (
      select 1 from admin_profiles
      where admin_profiles.user_id = auth.uid()
      and admin_profiles.role in ('admin', 'sales')
    )
  );

-- 4. Create proposals table for client presentation foundation
create table if not exists proposals (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'negotiation', 'accepted', 'rejected')),
  services text[] not null default '{}',
  objectives text,
  scope text,
  estimated_value numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table proposals enable row level security;

create policy "admin and sales can manage proposals" on proposals
  for all using (
    exists (
      select 1 from admin_profiles
      where admin_profiles.user_id = auth.uid()
      and admin_profiles.role in ('admin', 'sales')
    )
  );

-- Indexes for fast query performance
create index if not exists sales_activities_company_idx on sales_activities(company_id, activity_date desc);
create index if not exists opportunity_next_action_idx on private_opportunity_scores(next_action_date);
create index if not exists leads_company_idx on leads(target_company_id);
create index if not exists proposals_company_idx on proposals(company_id);
