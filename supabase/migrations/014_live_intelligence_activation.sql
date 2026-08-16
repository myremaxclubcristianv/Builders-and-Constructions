-- Migration 014: Live Romanian Construction Intelligence Activation
-- CONSTRUCTIONS by AiXLuxury — Phase 19

-- 1. Ingestion Jobs Table
CREATE TABLE IF NOT EXISTS public.ingestion_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name TEXT NOT NULL,
    source_tier TEXT NOT NULL DEFAULT 'PRIMARY',
    source_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'COMPLETED',
    records_discovered INTEGER NOT NULL DEFAULT 0,
    records_accepted INTEGER NOT NULL DEFAULT 0,
    records_rejected INTEGER NOT NULL DEFAULT 0,
    verification_failures INTEGER NOT NULL DEFAULT 0,
    duplicate_candidates INTEGER NOT NULL DEFAULT 0,
    duration_ms INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Entity Resolution Logs Table
CREATE TABLE IF NOT EXISTS public.entity_resolution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical_company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    matched_candidate_name TEXT NOT NULL,
    matched_cui TEXT,
    matched_domain TEXT,
    resolution_method TEXT NOT NULL,
    confidence NUMERIC(4, 2) NOT NULL DEFAULT 0.95,
    merge_decision TEXT NOT NULL DEFAULT 'CANONICAL_MATCH',
    rejection_reason TEXT,
    evidence_ids JSONB DEFAULT '[]'::jsonb,
    resolved_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Signal Urgency Snapshots Table
CREATE TABLE IF NOT EXISTS public.signal_urgency_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    signal_id UUID REFERENCES public.market_signal_events(id) ON DELETE SET NULL,
    urgency TEXT NOT NULL DEFAULT 'HIGH',
    reason TEXT NOT NULL,
    signal_date DATE NOT NULL,
    age_days INTEGER NOT NULL DEFAULT 0,
    decay_factor NUMERIC(3, 2) NOT NULL DEFAULT 1.00,
    evidence_citations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Outreach Claim Mappings Table
CREATE TABLE IF NOT EXISTS public.outreach_claim_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    draft_id UUID NOT NULL REFERENCES public.outreach_drafts(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    claim_text TEXT NOT NULL,
    evidence_id TEXT NOT NULL,
    evidence_source_url TEXT NOT NULL,
    verification_status TEXT NOT NULL DEFAULT 'VERIFIED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ingestion_jobs_status ON public.ingestion_jobs(status);
CREATE INDEX IF NOT EXISTS idx_ingestion_jobs_time ON public.ingestion_jobs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_entity_res_canonical ON public.entity_resolution_logs(canonical_company_id);
CREATE INDEX IF NOT EXISTS idx_signal_urgency_comp ON public.signal_urgency_snapshots(company_id);
CREATE INDEX IF NOT EXISTS idx_claim_map_draft ON public.outreach_claim_mappings(draft_id);

-- Enable RLS
ALTER TABLE public.ingestion_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entity_resolution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signal_urgency_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_claim_mappings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins and Sales can read ingestion jobs' AND tablename = 'ingestion_jobs') THEN
        CREATE POLICY "Admins and Sales can read ingestion jobs" ON public.ingestion_jobs
            FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'sales', 'editor') OR auth.role() = 'service_role');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins and Sales can read entity resolution logs' AND tablename = 'entity_resolution_logs') THEN
        CREATE POLICY "Admins and Sales can read entity resolution logs" ON public.entity_resolution_logs
            FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'sales', 'editor') OR auth.role() = 'service_role');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins and Sales can read signal urgency snapshots' AND tablename = 'signal_urgency_snapshots') THEN
        CREATE POLICY "Admins and Sales can read signal urgency snapshots" ON public.signal_urgency_snapshots
            FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'sales') OR auth.role() = 'service_role');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins and Sales can read outreach claim mappings' AND tablename = 'outreach_claim_mappings') THEN
        CREATE POLICY "Admins and Sales can read outreach claim mappings" ON public.outreach_claim_mappings
            FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'sales') OR auth.role() = 'service_role');
    END IF;
END $$;
