-- CONSTRUCTIONS by AiXLuxury: Migration 006 - Real-World Construction Intelligence, Sources & Research Queue
-- Additive, idempotent and backward-compatible.

-- 1. Research State & Assignment on Companies
alter table companies add column if not exists research_state text default 'unresearched' check (research_state in ('unresearched', 'researching', 'researched', 'verifying', 'ready'));
alter table companies add column if not exists assigned_researcher_id text;
alter table companies add column if not exists assigned_researcher_email text;
alter table companies add column if not exists country text default 'Romania';
alter table companies add column if not exists county text;
alter table companies add column if not exists city text;
alter table companies add column if not exists region text;
alter table companies add column if not exists research_notes text;
alter table companies add column if not exists not_a_fit boolean default false;
alter table companies add column if not exists not_a_fit_reason text;

-- 2. Research State & Assignment on Projects
alter table projects add column if not exists research_state text default 'unresearched' check (research_state in ('unresearched', 'researching', 'researched', 'verifying', 'ready'));
alter table projects add column if not exists assigned_researcher_id text;
alter table projects add column if not exists assigned_researcher_email text;
alter table projects add column if not exists country text default 'Romania';
alter table projects add column if not exists county text;
alter table projects add column if not exists city text;
alter table projects add column if not exists region text;
alter table projects add column if not exists research_notes text;
alter table projects add column if not exists project_activity_score integer default 50;

-- 3. Reusable Multi-Source Attribution Table
create table if not exists entity_sources (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('company', 'project')),
  entity_id uuid not null,
  source_url text not null,
  source_title text not null,
  source_type text not null check (source_type in ('OFFICIAL_WEBSITE', 'OFFICIAL_PROJECT_PAGE', 'OFFICIAL_SOCIAL', 'GOVERNMENT', 'PUBLIC_INSTITUTION', 'PRESS_RELEASE', 'INDUSTRY_PUBLICATION', 'NEWS', 'OTHER')),
  source_tier text not null default 'primary' check (source_tier in ('primary', 'secondary', 'tertiary')),
  publication_date date,
  access_date date default current_date,
  verification_status text not null default 'verified' check (verification_status in ('verified', 'unverified')),
  notes text,
  created_at timestamptz not null default now()
);

alter table entity_sources enable row level security;

-- Public can read verified sources on published records
create policy "public can view verified sources" on entity_sources
  for select using (verification_status = 'verified');

-- Admin & Editor can manage all sources
create policy "admin and editor can manage entity_sources" on entity_sources
  for all using (
    exists (
      select 1 from admin_profiles
      where admin_profiles.user_id = auth.uid()
      and admin_profiles.role in ('admin', 'editor')
    )
  );

-- 4. Decision Makers & Legitimate Executive Contacts
create table if not exists decision_makers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  role text not null,
  email text,
  phone text,
  linkedin_url text,
  notes text,
  is_primary boolean default false,
  created_at timestamptz not null default now()
);

alter table decision_makers enable row level security;

create policy "admin and sales can manage decision makers" on decision_makers
  for all using (
    exists (
      select 1 from admin_profiles
      where admin_profiles.user_id = auth.uid()
      and admin_profiles.role in ('admin', 'sales', 'editor')
    )
  );

-- 5. Target Campaigns
create table if not exists target_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  target_type text,
  target_criteria jsonb default '{}'::jsonb,
  target_city text,
  target_country text default 'Romania',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table target_campaigns enable row level security;

create policy "admin and sales can manage target campaigns" on target_campaigns
  for all using (
    exists (
      select 1 from admin_profiles
      where admin_profiles.user_id = auth.uid()
      and admin_profiles.role in ('admin', 'sales')
    )
  );

-- Indexes for rapid queue and prospect query performance
create index if not exists entity_sources_entity_idx on entity_sources(entity_type, entity_id);
create index if not exists companies_research_state_idx on companies(research_state);
create index if not exists projects_research_state_idx on projects(research_state);
create index if not exists decision_makers_company_idx on decision_makers(company_id);
