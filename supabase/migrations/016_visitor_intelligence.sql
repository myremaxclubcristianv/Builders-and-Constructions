-- Migration 016: Production-Grade Visitor Intelligence & Operational Telemetry
-- CONSTRUCTIONS by AiXLuxury

-- 1. Visitor Sessions Table
CREATE TABLE IF NOT EXISTS public.visitor_sessions (
  id text PRIMARY KEY,
  visitor_id text NOT NULL,
  is_returning boolean NOT NULL DEFAULT false,
  session_number integer NOT NULL DEFAULT 1,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  duration_seconds integer NOT NULL DEFAULT 0,
  pageview_count integer NOT NULL DEFAULT 0,
  event_count integer NOT NULL DEFAULT 0,
  landing_path text,
  exit_path text,
  referrer text,
  referring_domain text,
  source text,
  medium text,
  campaign text,
  term text,
  content text,
  channel text NOT NULL DEFAULT 'DIRECT',
  device_category text NOT NULL DEFAULT 'Desktop',
  operating_system text,
  browser text,
  browser_version text,
  viewport text,
  screen text,
  language text,
  timezone text,
  country text,
  region text,
  city text,
  ip_hash text,
  high_value_actions_count integer NOT NULL DEFAULT 0,
  entities_viewed jsonb NOT NULL DEFAULT '[]'::jsonb,
  searches_performed jsonb NOT NULL DEFAULT '[]'::jsonb,
  navigation_path jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_visitor_sessions_visitor_id ON public.visitor_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_last_seen ON public.visitor_sessions(last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_channel ON public.visitor_sessions(channel);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_country ON public.visitor_sessions(country);

-- 2. Structured Visitor Events Table
CREATE TABLE IF NOT EXISTS public.visitor_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  visitor_id text NOT NULL,
  event_type text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  sequence integer NOT NULL DEFAULT 1,
  path text NOT NULL,
  page_title text,
  page_type text NOT NULL DEFAULT 'OTHER',
  entity_type text,
  entity_id text,
  entity_name text,
  entity_slug text,
  entity_metadata jsonb,
  search_query text,
  search_results_count integer,
  search_selected_result text,
  interaction_name text,
  interaction_target text,
  time_spent_seconds integer,
  scroll_depth_percent integer,
  source text,
  medium text,
  campaign text,
  referrer text,
  device_category text,
  operating_system text,
  browser text,
  viewport text,
  language text,
  timezone text,
  country text,
  region text,
  city text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  telegram_notified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_visitor_events_session_id ON public.visitor_events(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_events_visitor_id ON public.visitor_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_events_occurred_at ON public.visitor_events(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_events_event_type ON public.visitor_events(event_type);
CREATE INDEX IF NOT EXISTS idx_visitor_events_entity_name ON public.visitor_events(entity_name);
CREATE INDEX IF NOT EXISTS idx_visitor_events_path ON public.visitor_events(path);

-- Enable RLS on both tables
ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_events ENABLE ROW LEVEL SECURITY;

-- Read policies for authenticated admin profiles or service role
CREATE POLICY "Admins can view visitor_sessions"
  ON public.visitor_sessions FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can view visitor_events"
  ON public.visitor_events FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));
