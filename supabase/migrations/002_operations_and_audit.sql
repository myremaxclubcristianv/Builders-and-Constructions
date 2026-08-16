-- Additive operational controls for the admin workspace.
create table audit_log (id uuid primary key default gen_random_uuid(), actor_id uuid references auth.users, action text not null, entity_type text not null, entity_id uuid not null, created_at timestamptz not null default now());
alter table audit_log enable row level security;
create index audit_log_entity_idx on audit_log(entity_type,entity_id,created_at desc);
alter table private_opportunity_scores add column if not exists owner_id uuid references auth.users, add column if not exists last_contacted_at timestamptz, add column if not exists next_follow_up_at date;
-- Storage remains private. The application uses server-authorized operations; no anonymous object policies are granted.
