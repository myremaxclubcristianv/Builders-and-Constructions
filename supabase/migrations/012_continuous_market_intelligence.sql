-- Migration 012: Continuous Market Intelligence, Lead Generation & Revenue OS
-- CONSTRUCTIONS by AiXLuxury — Phase 17

-- 1. Market Signal Events Table
CREATE TABLE IF NOT EXISTS public.market_signal_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    source_id UUID REFERENCES public.discovery_sources(id) ON DELETE SET NULL,
    source_url TEXT NOT NULL,
    source_tier TEXT NOT NULL DEFAULT 'PRIMARY',
    event_date DATE NOT NULL DEFAULT CURRENT_DATE,
    verification_state TEXT NOT NULL DEFAULT 'VERIFIED',
    evidence TEXT NOT NULL,
    confidence TEXT NOT NULL DEFAULT 'HIGH',
    commercial_relevance TEXT NOT NULL DEFAULT 'HIGH',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Priority Recalculation Events Table
CREATE TABLE IF NOT EXISTS public.priority_recalculation_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    triggering_signal_id UUID REFERENCES public.market_signal_events(id) ON DELETE SET NULL,
    previous_score INTEGER NOT NULL,
    new_score INTEGER NOT NULL,
    score_delta INTEGER NOT NULL,
    reasons_added JSONB DEFAULT '[]'::jsonb,
    reasons_removed JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Next Best Actions Table
CREATE TABLE IF NOT EXISTS public.next_best_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    reason TEXT NOT NULL,
    due_date TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Commercial Gap Snapshots Table
CREATE TABLE IF NOT EXISTS public.commercial_gap_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    dimension TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'UNKNOWN',
    evidence TEXT,
    source_url TEXT,
    confidence TEXT NOT NULL DEFAULT 'MEDIUM',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Deal Size Snapshots Table
CREATE TABLE IF NOT EXISTS public.deal_size_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    estimated_min NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    estimated_max NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'EUR',
    confidence TEXT NOT NULL DEFAULT 'HIGH',
    factors JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Revenue Origin Events Table
CREATE TABLE IF NOT EXISTS public.revenue_origin_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    proposal_id UUID REFERENCES public.proposals(id) ON DELETE SET NULL,
    signal_id UUID REFERENCES public.market_signal_events(id) ON DELETE SET NULL,
    deal_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    service_key TEXT NOT NULL,
    origin_description TEXT NOT NULL,
    won_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_market_signal_events_company ON public.market_signal_events(company_id);
CREATE INDEX IF NOT EXISTS idx_priority_recalc_company ON public.priority_recalculation_events(company_id);
CREATE INDEX IF NOT EXISTS idx_next_best_actions_company ON public.next_best_actions(company_id);
CREATE INDEX IF NOT EXISTS idx_commercial_gap_company ON public.commercial_gap_snapshots(company_id);
CREATE INDEX IF NOT EXISTS idx_revenue_origin_company ON public.revenue_origin_events(company_id);

-- Enable RLS
ALTER TABLE public.market_signal_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.priority_recalculation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.next_best_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commercial_gap_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_size_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_origin_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins and Sales can read market intelligence events' AND tablename = 'market_signal_events') THEN
        CREATE POLICY "Admins and Sales can read market intelligence events" ON public.market_signal_events
            FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'sales') OR auth.role() = 'service_role');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins and Sales can read priority recalc events' AND tablename = 'priority_recalculation_events') THEN
        CREATE POLICY "Admins and Sales can read priority recalc events" ON public.priority_recalculation_events
            FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'sales') OR auth.role() = 'service_role');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins and Sales can read next best actions' AND tablename = 'next_best_actions') THEN
        CREATE POLICY "Admins and Sales can read next best actions" ON public.next_best_actions
            FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'sales') OR auth.role() = 'service_role');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins and Sales can read revenue origin events' AND tablename = 'revenue_origin_events') THEN
        CREATE POLICY "Admins and Sales can read revenue origin events" ON public.revenue_origin_events
            FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'sales') OR auth.role() = 'service_role');
    END IF;
END $$;
