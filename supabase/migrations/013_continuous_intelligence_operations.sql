-- Migration 013: Continuous Intelligence, Autonomous Pipeline & Commercial Operations
-- CONSTRUCTIONS by AiXLuxury — Phase 18

-- 1. Market Change Events Table
CREATE TABLE IF NOT EXISTS public.market_change_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    change_category TEXT NOT NULL,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    source_url TEXT NOT NULL,
    source_tier TEXT NOT NULL DEFAULT 'PRIMARY',
    previous_state JSONB DEFAULT '{}'::jsonb,
    new_state JSONB DEFAULT '{}'::jsonb,
    previous_priority INTEGER NOT NULL DEFAULT 50,
    new_priority INTEGER NOT NULL DEFAULT 50,
    score_delta INTEGER NOT NULL DEFAULT 0,
    commercial_relevance TEXT NOT NULL DEFAULT 'HIGH',
    recommended_action TEXT NOT NULL,
    event_timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Why Now Snapshots Table
CREATE TABLE IF NOT EXISTS public.why_now_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    primary_reason TEXT NOT NULL,
    supporting_reasons JSONB DEFAULT '[]'::jsonb,
    evidence_citations JSONB DEFAULT '[]'::jsonb,
    confidence TEXT NOT NULL DEFAULT 'HIGH',
    urgency TEXT NOT NULL DEFAULT 'HIGH',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Revenue Attribution Chains Table
CREATE TABLE IF NOT EXISTS public.revenue_attribution_chains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    proposal_id UUID REFERENCES public.proposals(id) ON DELETE SET NULL,
    sales_activity_id UUID REFERENCES public.sales_activities(id) ON DELETE SET NULL,
    originating_signal_id UUID REFERENCES public.market_signal_events(id) ON DELETE SET NULL,
    deal_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    service_key TEXT NOT NULL,
    territory TEXT NOT NULL,
    signal_date DATE NOT NULL,
    first_contact_date DATE,
    meeting_date DATE,
    proposal_date DATE,
    won_date DATE NOT NULL,
    days_to_close INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for fast executive dashboard queries
CREATE INDEX IF NOT EXISTS idx_market_change_events_company ON public.market_change_events(company_id);
CREATE INDEX IF NOT EXISTS idx_market_change_events_time ON public.market_change_events(event_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_why_now_snapshots_company ON public.why_now_snapshots(company_id);
CREATE INDEX IF NOT EXISTS idx_rev_chains_company ON public.revenue_attribution_chains(company_id);
CREATE INDEX IF NOT EXISTS idx_rev_chains_won_date ON public.revenue_attribution_chains(won_date DESC);

-- Enable RLS
ALTER TABLE public.market_change_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.why_now_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_attribution_chains ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins and Sales can read market change events' AND tablename = 'market_change_events') THEN
        CREATE POLICY "Admins and Sales can read market change events" ON public.market_change_events
            FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'sales') OR auth.role() = 'service_role');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins and Sales can read why now snapshots' AND tablename = 'why_now_snapshots') THEN
        CREATE POLICY "Admins and Sales can read why now snapshots" ON public.why_now_snapshots
            FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'sales') OR auth.role() = 'service_role');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins and Sales can read revenue attribution chains' AND tablename = 'revenue_attribution_chains') THEN
        CREATE POLICY "Admins and Sales can read revenue attribution chains" ON public.revenue_attribution_chains
            FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'sales') OR auth.role() = 'service_role');
    END IF;
END $$;
