-- CONSTRUCTIONS by AiXLuxury: Migration 003 - Operational Layer
-- Additive, idempotent and backward-compatible.

-- 1. Expand company_project_role enum if values do not exist
alter type company_project_role add value if not exists 'construction_company';
alter type company_project_role add value if not exists 'structural_engineer';

-- 2. Enhance media table for hero designation, ordering, attribution, article association
alter table media add column if not exists is_hero boolean not null default false;
alter table media add column if not exists source text;
alter table media add column if not exists article_id uuid references editorial_content on delete cascade;
alter table media add column if not exists file_type text;
alter table media add column if not exists file_size integer;

-- Ensure check constraint on media allows article_id as well
alter table media drop constraint if exists media_check;
alter table media add constraint media_check check (company_id is not null or project_id is not null or article_id is not null);

-- 3. Enhance project_progress for rich updates (image, source)
alter table project_progress add column if not exists image_url text;
alter table project_progress add column if not exists source text;

-- 4. Enhance leads & lead_notes
alter table leads add column if not exists last_contacted_at timestamptz;
alter table leads add column if not exists next_action text;

alter table lead_notes add column if not exists author_name text;
alter table lead_notes add column if not exists updated_at timestamptz not null default now();

-- 5. Enhance profile_claims for review notes & company connection
alter table profile_claims add column if not exists company_id uuid references companies on delete set null;
alter table profile_claims add column if not exists reviewer_notes text;

-- 6. Enhance private_opportunity_scores for signals and flexible pipeline
alter table private_opportunity_scores add column if not exists signals text[] not null default '{}';
-- Allow wider pipeline statuses (new, researching, contacted, follow_up, proposal, won, lost, not_a_fit, converted, not_interested)
alter table private_opportunity_scores drop constraint if exists private_opportunity_scores_pipeline_status_check;

-- 7. Enhance editorial_content for full CMS functionality
alter table editorial_content add column if not exists content_state content_state not null default 'draft';
alter table editorial_content add column if not exists cover_image text;
alter table editorial_content add column if not exists author text;
alter table editorial_content add column if not exists seo_title text;
alter table editorial_content add column if not exists seo_description text;
alter table editorial_content add column if not exists related_companies uuid[] not null default '{}';
alter table editorial_content add column if not exists related_projects uuid[] not null default '{}';
alter table editorial_content add column if not exists archived_at timestamptz;
alter table editorial_content add column if not exists updated_at timestamptz not null default now();

-- 8. Indexes for performance & public filtering
create index if not exists media_sort_idx on media(company_id, project_id, article_id, sort_order);
create index if not exists media_hero_idx on media(is_hero) where is_hero is true;
create index if not exists project_progress_verified_idx on project_progress(project_id, verification, created_at desc);
create index if not exists editorial_content_state_idx on editorial_content(content_state, published_at desc);
create index if not exists lead_notes_lead_idx on lead_notes(lead_id, created_at desc);

-- 9. RLS Policies refinement
-- Allow public select on verified progress of published projects
create policy "verified progress of published projects is readable" on project_progress
  for select using (
    verification = 'verified' and exists (
      select 1 from projects where projects.id = project_progress.project_id and projects.published_at is not null
    )
  );

-- Allow public select on public media for published entities
create policy "public media is readable" on media
  for select using (
    is_public = true or exists (
      select 1 from companies where companies.id = media.company_id and companies.published_at is not null
    ) or exists (
      select 1 from projects where projects.id = media.project_id and projects.published_at is not null
    ) or exists (
      select 1 from editorial_content where editorial_content.id = media.article_id and editorial_content.published_at is not null
    )
  );

-- Allow public select on project_companies for published projects & companies
create policy "project companies of published items are readable" on project_companies
  for select using (
    exists (select 1 from projects where projects.id = project_companies.project_id and projects.published_at is not null)
    and exists (select 1 from companies where companies.id = project_companies.company_id and companies.published_at is not null)
  );
