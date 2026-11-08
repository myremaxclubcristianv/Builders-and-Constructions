# Supabase Row Level Security (RLS) Forensic Verification Plan

**Project**: CONSTRUCTIONS by AiXLuxury  
**Status**: Ready for Authorized Offline / Staging Execution  
**Restrictions**: Read-Only. No production database access or modifications.

---

## 1. Local Schema RLS Audit Summary

Offline inspection of `supabase/schema.sql` and migrations `001_admin_and_verification.sql` through `016_visitor_intelligence.sql` verifies that **all 29 database tables** include explicit `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` definitions:

| Table Category | Tables | RLS Statement Location | Public Access Policy |
| :--- | :--- | :--- | :--- |
| **Public Catalog** | `companies`, `projects`, `locations`, `editorial_content` | `schema.sql:26-30` | `SELECT` allowed ONLY when `published_at IS NOT NULL` (except `locations` which is world-readable). |
| **Verification & Media** | `factual_sources`, `media`, `project_progress`, `company_timeline` | `schema.sql:26`, `001:17`, `003:59` | `SELECT` allowed for verified media and verified progress belonging to published projects. |
| **Private Leads & CRM** | `leads`, `lead_notes`, `profile_claims`, `audit_log`, `sales_activities`, `proposals` | `schema.sql:26`, `002:3`, `005:31,58` | **ZERO PUBLIC POLICIES**. Accessible strictly via server-side service role client (`getServiceClient()`). |
| **Intelligence Engine** | `market_signal_events`, `intelligence_observations`, `next_best_actions`, `revenue_attribution_chains` | `012:91-96`, `013:65-67`, `015:85-88` | **ZERO PUBLIC POLICIES**. Bounded to authenticated admin roles. |
| **Telemetry & Sessions** | `visitor_sessions`, `visitor_events`, `analytics_events` | `004:28`, `016:101-102` | Server-side write only; zero public read policies. |

---

## 2. Safe Production RLS Verification SQL Script

When authorized by the project owner in a connected staging or production environment, run this non-destructive query to verify that live PostgreSQL catalogs enforce RLS across every table:

```sql
-- 1. Verify RLS is enabled on all tables in public schema
SELECT 
    schemaname, 
    tablename, 
    rowsecurity AS rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2. List all active RLS policies per table, command, and role
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 3. Assert zero sensitive tables grant public (anon) access
SELECT tablename, policyname, roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('leads', 'lead_notes', 'profile_claims', 'admin_profiles', 'audit_log', 'sales_activities', 'proposals')
  AND ('anon' = ANY(roles) OR 'public' = ANY(roles));
-- EXPECTED: 0 rows returned.
```
