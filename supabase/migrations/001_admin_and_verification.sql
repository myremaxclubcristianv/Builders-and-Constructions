-- Additive migration: roles, verification/source attribution, workflow states and secure storage.
create type admin_role as enum ('admin','editor','sales');
create type content_state as enum ('demo','draft','research','verification','ready','published','archived');
create type verification_status as enum ('unknown','unverified','verified');
create type source_type as enum ('official_website','company_submission','public_registry','press_release','news_article','planning_document','admin_research','other');
create type claim_status as enum ('new','under_review','approved','rejected');
alter type company_type add value if not exists 'engineering';
create table admin_profiles (id uuid primary key references auth.users on delete cascade, role admin_role not null, display_name text, created_at timestamptz not null default now());
alter table companies add column if not exists content_state content_state not null default 'draft', add column if not exists website_verification verification_status not null default 'unknown', add column if not exists founded_verification verification_status not null default 'unknown', add column if not exists archived_at timestamptz;
alter table projects add column if not exists content_state content_state not null default 'draft', add column if not exists completion_verification verification_status not null default 'unknown', add column if not exists archived_at timestamptz;
alter table project_progress add column if not exists verification verification_status not null default 'unverified', add column if not exists progress_date date;
alter table media add column if not exists filename text, add column if not exists caption text, add column if not exists credit text, add column if not exists uploaded_by uuid references auth.users, add column if not exists is_public boolean not null default false;
create table factual_sources (id uuid primary key default gen_random_uuid(), company_id uuid references companies on delete cascade, project_id uuid references projects on delete cascade, field_name text not null, source_url text, source_title text not null, source_type source_type not null, source_date date, verified_by uuid references auth.users, verified_at timestamptz, created_at timestamptz not null default now(), check(company_id is not null or project_id is not null));
alter table profile_claims add column if not exists claim_status claim_status not null default 'new';
alter table private_opportunity_scores add column if not exists pipeline_status text not null default 'new' check(pipeline_status in ('new','contacted','not_interested','follow_up','converted')), add column if not exists recommended_services text[] not null default '{}';
create index if not exists companies_admin_state_idx on companies(content_state, created_at desc); create index if not exists projects_admin_state_idx on projects(content_state, created_at desc); create index if not exists opportunity_pipeline_idx on private_opportunity_scores(opportunity,pipeline_status);
alter table admin_profiles enable row level security; alter table factual_sources enable row level security;
-- Authorization is enforced through server-side service-role calls in the application. No public policies are granted to these tables.
insert into storage.buckets (id,name,public) values ('company-media','company-media',false),('project-media','project-media',false),('editorial-media','editorial-media',false) on conflict (id) do nothing;
