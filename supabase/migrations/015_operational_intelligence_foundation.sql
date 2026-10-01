-- Migration 015: Operational Intelligence Foundation & End-to-End Lineage
-- CONSTRUCTIONS by AiXLuxury — Phase 44

-- 1. Persistent Raw Observations Table
CREATE TABLE IF NOT EXISTS public.intelligence_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id text,
  source_type text NOT NULL,
  source_name text NOT NULL,
  source_url text NOT NULL,
  retrieved_at timestamptz NOT NULL DEFAULT now(),
  observed_at timestamptz NOT NULL DEFAULT now(),
  content_type text NOT NULL DEFAULT 'application/json',
  raw_payload jsonb NOT NULL,
  normalized_payload jsonb,
  content_hash text NOT NULL,
  source_document_hash text,
  parser_version text NOT NULL DEFAULT '1.0',
  ingestion_job_id uuid,
  entity_id uuid,
  entity_type text,
  resolution_confidence numeric(3,2),
  verification_status text NOT NULL DEFAULT 'UNVERIFIED',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for observation deduplication & lineage lookup
CREATE INDEX IF NOT EXISTS idx_intel_obs_content_hash ON public.intelligence_observations(content_hash);
CREATE INDEX IF NOT EXISTS idx_intel_obs_source_url ON public.intelligence_observations(source_url);
CREATE INDEX IF NOT EXISTS idx_intel_obs_entity_id ON public.intelligence_observations(entity_id);

-- 2. Durable Ingestion Job Execution Table
CREATE TABLE IF NOT EXISTS public.intelligence_ingestion_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name text NOT NULL,
  source_type text NOT NULL,
  trigger_type text NOT NULL CHECK (trigger_type IN ('MANUAL', 'API', 'SCHEDULED', 'WEBHOOK', 'SYSTEM')),
  status text NOT NULL DEFAULT 'QUEUED' CHECK (status IN ('QUEUED', 'RUNNING', 'COMPLETED', 'PARTIAL', 'FAILED')),
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  records_seen integer NOT NULL DEFAULT 0,
  records_created integer NOT NULL DEFAULT 0,
  records_updated integer NOT NULL DEFAULT 0,
  duplicate_count integer NOT NULL DEFAULT 0,
  error_message text,
  execution_metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Intelligence-Driven Opportunity Candidates Table
CREATE TABLE IF NOT EXISTS public.intelligence_opportunity_candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id uuid,
  change_event_id uuid,
  observation_id uuid REFERENCES public.intelligence_observations(id) ON DELETE SET NULL,
  company_id uuid,
  project_id uuid,
  company_name text NOT NULL,
  reason text NOT NULL,
  commercial_score numeric(5,2) NOT NULL DEFAULT 60.00,
  urgency text NOT NULL DEFAULT 'MEDIUM' CHECK (urgency IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
  evidence text,
  status text NOT NULL DEFAULT 'CANDIDATE' CHECK (status IN ('CANDIDATE', 'REVIEW', 'QUALIFIED', 'REJECTED', 'CONVERTED')),
  generated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_intel_opp_candidates_company ON public.intelligence_opportunity_candidates(company_id);
CREATE INDEX IF NOT EXISTS idx_intel_opp_candidates_status ON public.intelligence_opportunity_candidates(status);

-- 4. Operational Commercial Outcome Tracking Table
CREATE TABLE IF NOT EXISTS public.intelligence_outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid REFERENCES public.intelligence_opportunity_candidates(id) ON DELETE SET NULL,
  company_id uuid,
  status text NOT NULL DEFAULT 'NOT_CONTACTED' CHECK (status IN ('NOT_CONTACTED', 'CONTACTED', 'REPLIED', 'MEETING', 'PROPOSAL', 'WON', 'LOST', 'DISQUALIFIED')),
  deal_value_eur numeric(12,2),
  outcome_date timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on all 4 new tables
ALTER TABLE public.intelligence_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligence_ingestion_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligence_opportunity_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligence_outcomes ENABLE ROW LEVEL SECURITY;

-- Read policies for authenticated admin profiles or service role
CREATE POLICY "Admins can view intelligence_observations"
  ON public.intelligence_observations FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can view intelligence_ingestion_jobs"
  ON public.intelligence_ingestion_jobs FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can view intelligence_opportunity_candidates"
  ON public.intelligence_opportunity_candidates FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can view intelligence_outcomes"
  ON public.intelligence_outcomes FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));
