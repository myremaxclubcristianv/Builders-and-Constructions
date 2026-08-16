-- Migration 011: Live Market Acquisition, Golden Dataset Execution & Revenue Activation
-- CONSTRUCTIONS by AiXLuxury — Phase 15

-- 1. Revenue Attribution Table
CREATE TABLE IF NOT EXISTS public.revenue_attributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    proposal_id UUID REFERENCES public.proposals(id) ON DELETE SET NULL,
    sales_activity_id UUID REFERENCES public.sales_activities(id) ON DELETE SET NULL,
    signal_id UUID REFERENCES public.market_activity_signals(id) ON DELETE SET NULL,
    deal_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    won_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    service_key TEXT NOT NULL DEFAULT 'WEBSITE',
    city TEXT,
    county TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Outreach Drafts Provenance & Audit Extensions
ALTER TABLE public.outreach_drafts
ADD COLUMN IF NOT EXISTS facts_used JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS evidence_ids JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS message_hash TEXT,
ADD COLUMN IF NOT EXISTS approval_version INTEGER DEFAULT 1;

-- 3. Data Export Audit Logging Table
CREATE TABLE IF NOT EXISTS public.data_export_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor TEXT NOT NULL,
    dataset_name TEXT NOT NULL,
    record_count INTEGER NOT NULL DEFAULT 0,
    filters JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for high-performance executive queries
CREATE INDEX IF NOT EXISTS idx_revenue_attributions_company ON public.revenue_attributions(company_id);
CREATE INDEX IF NOT EXISTS idx_revenue_attributions_won_at ON public.revenue_attributions(won_at DESC);
CREATE INDEX IF NOT EXISTS idx_revenue_attributions_service ON public.revenue_attributions(service_key);
CREATE INDEX IF NOT EXISTS idx_data_export_logs_created ON public.data_export_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.revenue_attributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_export_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Revenue Attributions
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins and Sales can read revenue attributions' AND tablename = 'revenue_attributions') THEN
        CREATE POLICY "Admins and Sales can read revenue attributions" ON public.revenue_attributions
            FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'sales') OR auth.role() = 'service_role');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins and Sales can insert revenue attributions' AND tablename = 'revenue_attributions') THEN
        CREATE POLICY "Admins and Sales can insert revenue attributions" ON public.revenue_attributions
            FOR INSERT WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'sales') OR auth.role() = 'service_role');
    END IF;
END $$;

-- RLS Policies for Data Export Logs
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage data export logs' AND tablename = 'data_export_logs') THEN
        CREATE POLICY "Admins can manage data export logs" ON public.data_export_logs
            FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');
    END IF;
END $$;
