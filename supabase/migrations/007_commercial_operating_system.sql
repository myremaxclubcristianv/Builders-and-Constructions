-- CONSTRUCTIONS by AiXLuxury: Migration 007 - Commercial Operating System & Market Intelligence
-- Additive, idempotent and backward-compatible.

-- 1. Sales Activities Outcome & Rescheduling Extensions
alter table sales_activities add column if not exists outcome text check (outcome in ('connected', 'no_answer', 'call_back', 'interested', 'not_interested', 'meeting_booked', 'proposal_requested', 'wrong_contact', 'not_a_fit', 'no_response'));
alter table sales_activities add column if not exists rescheduled_date date;

-- 2. Proposals Table Extensions & View Tracking
alter table proposals add column if not exists bundle_type text;
alter table proposals add column if not exists sent_at timestamptz;
alter table proposals add column if not exists opened_at timestamptz;
alter table proposals add column if not exists last_viewed_at timestamptz;
alter table proposals add column if not exists loss_reason text check (loss_reason in ('price', 'timing', 'no_need', 'competitor', 'internal', 'no_response', 'not_a_fit', 'other'));
alter table proposals add column if not exists loss_notes text;

-- 3. Private Opportunity Scores Extensions
alter table private_opportunity_scores add column if not exists priority_score integer default 50;
alter table private_opportunity_scores add column if not exists priority_reasons text[];
alter table private_opportunity_scores add column if not exists revenue_estimate numeric default 0;
alter table private_opportunity_scores add column if not exists loss_reason text;
alter table private_opportunity_scores add column if not exists loss_notes text;

-- Indexes for rapid daily queue and market queries
create index if not exists sales_activities_outcome_idx on sales_activities(outcome);
create index if not exists proposals_viewed_idx on proposals(last_viewed_at);
create index if not exists opportunity_priority_idx on private_opportunity_scores(priority_score desc);
