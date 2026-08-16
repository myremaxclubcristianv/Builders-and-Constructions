-- CONSTRUCTIONS by AiXLuxury: Migration 008 - Market Acquisition, Discovery Ingestion & Prospect Activation
-- Additive, idempotent and backward-compatible.

-- 1. Discovery Sources Registry
create table if not exists discovery_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  type text not null check (type in ('OFFICIAL_WEBSITE', 'OFFICIAL_PROJECT_PAGE', 'GOVERNMENT_REGISTRY', 'PUBLIC_PROCUREMENT', 'INDUSTRY_PUBLICATION', 'PRESS_RELEASE', 'BUSINESS_DIRECTORY', 'OTHER')),
  country text not null default 'Romania',
  coverage text,
  last_checked_at timestamptz,
  status text not null default 'active' check (status in ('active', 'paused', 'error', 'requires_review')),
  notes text,
  created_at timestamptz default now()
);

-- 2. Discovery Jobs
create table if not exists discovery_jobs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_id uuid references discovery_sources(id) on delete set null,
  target_entity text not null check (target_entity in ('company', 'project')),
  geography text default 'Romania',
  company_type text,
  project_type text,
  created_by text,
  status text not null default 'queued' check (status in ('queued', 'running', 'completed', 'partial', 'failed', 'cancelled')),
  results_count integer default 0,
  discovered_count integer default 0,
  duplicate_count integer default 0,
  invalid_count integer default 0,
  created_at timestamptz default now()
);

-- 3. Staged Discovery Items (Pre-Production Ingestion Layer)
create table if not exists discovery_items (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references discovery_jobs(id) on delete cascade,
  entity_type text not null check (entity_type in ('company', 'project')),
  raw_data jsonb not null default '{}'::jsonb,
  normalized_data jsonb not null default '{}'::jsonb,
  duplicate_confidence text not null default 'none' check (duplicate_confidence in ('high', 'medium', 'low', 'none')),
  duplicate_match_id uuid,
  review_status text not null default 'discovered' check (review_status in ('discovered', 'possible_duplicate', 'invalid', 'requires_review', 'ready_for_research', 'approved', 'ignored', 'not_a_fit')),
  notes text,
  created_at timestamptz default now()
);

-- 4. Market Activity Signals Monitor
create table if not exists market_activity_signals (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('company', 'project')),
  entity_id uuid,
  entity_name text not null,
  signal_type text not null check (signal_type in ('new_project', 'project_update', 'company_update', 'completion', 'new_company', 'source_change')),
  summary text not null,
  source_url text,
  confidence text default 'verified' check (confidence in ('verified', 'high', 'medium', 'unconfirmed')),
  created_at timestamptz default now()
);

-- 5. Outreach Drafts & Approval Layer
create table if not exists outreach_drafts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  opportunity_id uuid,
  channel text not null check (channel in ('executive_email', 'linkedin', 'short_message', 'call_opening', 'follow_up')),
  recipient_name text,
  recipient_role text,
  recipient_contact text,
  subject text,
  body text not null,
  approval_status text not null default 'draft' check (approval_status in ('draft', 'approved', 'sent', 'rejected')),
  approved_by text,
  approved_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz default now()
);

-- 6. Source Freshness Extensions on Core Entities
alter table companies add column if not exists last_verified_at timestamptz;
alter table companies add column if not exists next_review_at timestamptz;
alter table companies add column if not exists freshness_status text default 'fresh' check (freshness_status in ('fresh', 'requires_reverification', 'stale'));

alter table projects add column if not exists last_verified_at timestamptz;
alter table projects add column if not exists next_review_at timestamptz;
alter table projects add column if not exists freshness_status text default 'fresh' check (freshness_status in ('fresh', 'requires_reverification', 'stale'));

-- 7. Decision Maker Verification State Extension
alter table decision_makers add column if not exists verification_state text default 'unverified' check (verification_state in ('unverified', 'publicly_verified', 'company_verified', 'confirmed_by_contact'));

-- Enable RLS on newly created discovery tables
alter table discovery_sources enable row level security;
alter table discovery_jobs enable row level security;
alter table discovery_items enable row level security;
alter table market_activity_signals enable row level security;
alter table outreach_drafts enable row level security;

-- Admin & Role Policies
create policy "admin_discovery_sources_all" on discovery_sources for all using (true) with check (true);
create policy "admin_discovery_jobs_all" on discovery_jobs for all using (true) with check (true);
create policy "admin_discovery_items_all" on discovery_items for all using (true) with check (true);
create policy "admin_market_signals_all" on market_activity_signals for all using (true) with check (true);
create policy "admin_outreach_drafts_all" on outreach_drafts for all using (true) with check (true);

-- Indexes for rapid operational queries
create index if not exists discovery_items_status_idx on discovery_items(review_status);
create index if not exists market_signals_date_idx on market_activity_signals(created_at desc);
create index if not exists outreach_drafts_company_idx on outreach_drafts(company_id);
