-- CONSTRUCTIONS by AiXLuxury: Migration 004 - Prospecting Engine & Commercial Conversion
-- Additive, idempotent and backward-compatible.

-- 1. Enhance companies table for website presence and positioning
alter table companies add column if not exists website_status text default 'unknown';
alter table companies add column if not exists website_quality_score smallint check(website_quality_score between 1 and 5);
alter table companies add column if not exists social_presence text default 'unknown';
alter table companies add column if not exists seo_status text default 'unknown';
alter table companies add column if not exists lead_generation_status text default 'unknown';
alter table companies add column if not exists positioning_statement text;

-- 2. Enhance private_opportunity_scores for numerical transparent scoring & breakdown
alter table private_opportunity_scores add column if not exists opportunity_score integer check(opportunity_score between 0 and 100);
alter table private_opportunity_scores add column if not exists score_reasons text[] not null default '{}';

-- 3. Create anonymous analytics_events table for commercial funnel tracking
create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  entity_type text,
  entity_id text,
  entity_slug text,
  source text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table analytics_events enable row level security;

-- Allow anonymous inserts for public event logging
create policy "anonymous can insert analytics events" on analytics_events
  for insert with check (true);

-- Indexes for performance & sales intelligence
create index if not exists analytics_events_type_created_idx on analytics_events(event_type, created_at desc);
create index if not exists analytics_events_slug_idx on analytics_events(entity_slug, event_type);
create index if not exists opportunity_score_idx on private_opportunity_scores(opportunity_score desc);
