# CONSTRUCTIONS by AiXLuxury

Premium discovery, media and lead-generation platform for the built environment.

## Start locally

```bash
npm install
npm run dev
```

## Product foundation

- Next.js App Router with responsive server-rendered public pages
- Company and project profile routes with future-safe slugs
- Explicitly marked demonstration data only; no fabricated company/project claims
- Search, company claims, company inquiry, company onboarding and project-promotion journeys
- Server-side lead and claim API routes that persist to Supabase when configured
- `supabase/schema.sql` defines public data, team graph, progress updates, lead CRM, claims, media, editorial content and private opportunity records with RLS enabled

## Recommended next implementation steps

1. Create a Supabase project and apply `supabase/schema.sql`.
2. Replace `lib/data.ts` with server-side Supabase queries and a content review workflow.
3. Add authenticated `/admin` CRUD for companies, projects, relationships, media, articles and lead status.
4. Add bot protection and attribution to the API routes.
5. Add Mapbox or Google Maps behind a `ProjectMapProvider` interface, using `projects.latitude` and `projects.longitude`.

## Environment variables

`NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are required for inquiry and claim persistence. Keep the service-role key server-only; do not expose it to the browser.
