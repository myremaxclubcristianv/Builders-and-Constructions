-- CONSTRUCTIONS by AiXLuxury: Migration 010 - Production Data Activation & Real Market Intelligence
-- Additive, idempotent, backward-compatible, and safe against existing production records.

-- 1. Romanian Counties & Geographic Coverage Registry
create table if not exists geographic_regions (
  id uuid primary key default gen_random_uuid(),
  county_code text not null unique,
  county_name text not null,
  region text not null, -- Muntenia, Transilvania, Moldova, Banat, Dobrogea, Oltenia, Crisana, Maramures
  tier integer not null default 2, -- Tier 1 (Bucharest, Cluj, Timis, Iasi, Brasov, Constanta), Tier 2, Tier 3
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Seed primary Romanian regions if empty
insert into geographic_regions (county_code, county_name, region, tier) values
  ('B', 'Bucharest', 'Muntenia', 1),
  ('IF', 'Ilfov', 'Muntenia', 1),
  ('CJ', 'Cluj', 'Transilvania', 1),
  ('TM', 'Timiș', 'Banat', 1),
  ('IS', 'Iași', 'Moldova', 1),
  ('BV', 'Brașov', 'Transilvania', 1),
  ('CT', 'Constanța', 'Dobrogea', 1),
  ('SB', 'Sibiu', 'Transilvania', 1),
  ('PH', 'Prahova', 'Muntenia', 1),
  ('BH', 'Bihor', 'Crișana', 2),
  ('AR', 'Arad', 'Banat', 2),
  ('DJ', 'Dolj', 'Oltenia', 2),
  ('GL', 'Galați', 'Moldova', 2),
  ('BC', 'Bacău', 'Moldova', 2),
  ('MS', 'Mureș', 'Transilvania', 2),
  ('AG', 'Argeș', 'Muntenia', 2),
  ('SV', 'Suceava', 'Moldova', 2),
  ('DB', 'Dâmbovița', 'Muntenia', 2),
  ('VL', 'Vâlcea', 'Oltenia', 2),
  ('HD', 'Hunedoara', 'Transilvania', 2),
  ('AL', 'Alba', 'Transilvania', 2)
on conflict (county_code) do nothing;

-- 2. Extended Company Research & Verification Fields
alter table companies add column if not exists legal_name text;
alter table companies add column if not exists cui_cif text;
alter table companies add column if not exists registration_number text;
alter table companies add column if not exists address_street text;
alter table companies add column if not exists verified_source_id uuid references entity_sources(id) on delete set null;
alter table companies add column if not exists digital_audit_data jsonb not null default '{}'::jsonb;
alter table companies add column if not exists verification_evidence text;
alter table companies add column if not exists last_researched_at timestamptz;
alter table companies add column if not exists duplicate_of_id uuid references companies(id) on delete set null;

-- 3. Extended Project Research & Discipline Attribution
alter table projects add column if not exists structural_engineer text;
alter table projects add column if not exists mep_engineer text;
alter table projects add column if not exists building_permit_number text;
alter table projects add column if not exists building_permit_date date;
alter table projects add column if not exists address_street text;
alter table projects add column if not exists cadastre_number text;
alter table projects add column if not exists verified_source_id uuid references entity_sources(id) on delete set null;
alter table projects add column if not exists last_researched_at timestamptz;
alter table projects add column if not exists duplicate_of_id uuid references projects(id) on delete set null;

-- 4. Market Activity Signals Extension
alter table market_activity_signals add column if not exists company_id uuid references companies(id) on delete set null;
alter table market_activity_signals add column if not exists project_id uuid references projects(id) on delete set null;
alter table market_activity_signals add column if not exists source_type text default 'OFFICIAL_WEBSITE';
alter table market_activity_signals add column if not exists commercial_relevance text default 'HIGH';
alter table market_activity_signals add column if not exists event_date date default current_date;

-- 5. Data Quality & Duplicate Candidate Tracking
create table if not exists duplicate_candidates (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('company', 'project')),
  primary_id uuid not null,
  duplicate_id uuid not null,
  confidence text not null check (confidence in ('high', 'medium', 'low')),
  match_reasons text[] not null default '{}',
  review_status text not null default 'pending' check (review_status in ('pending', 'confirmed_duplicate', 'merged', 'rejected_false_positive')),
  reviewed_by text,
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

alter table duplicate_candidates enable row level security;

create policy "admin_duplicate_candidates_all" on duplicate_candidates
  for all using (
    exists (
      select 1 from admin_profiles
      where admin_profiles.user_id = auth.uid()
      and admin_profiles.role in ('admin', 'editor')
    )
  );

-- 6. Production Subsystem Diagnostic Log Table Extension
alter table system_health_logs add column if not exists latency_ms integer;
alter table system_health_logs add column if not exists query_name text;
alter table system_health_logs add column if not exists error_classification text;

-- Indexes for rapid production filtering & quality audits
create index if not exists companies_county_idx on companies(county);
create index if not exists companies_cui_idx on companies(cui_cif);
create index if not exists projects_county_idx on projects(county);
create index if not exists market_activity_signals_company_idx on market_activity_signals(company_id, created_at desc);
create index if not exists market_activity_signals_project_idx on market_activity_signals(project_id, created_at desc);
create index if not exists duplicate_candidates_status_idx on duplicate_candidates(review_status, entity_type);
create index if not exists geographic_regions_tier_idx on geographic_regions(tier, is_active);
