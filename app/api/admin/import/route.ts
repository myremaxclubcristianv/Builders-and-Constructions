import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getServiceClient } from '@/lib/supabase';

function normalize(str?: string | null) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function POST(request: Request) {
  try {
    await requireAdmin('admin', 'editor');
    const body = await request.json();
    const { entityType, rawRows, action } = body;

    if (!entityType || !Array.isArray(rawRows)) {
      return NextResponse.json({ error: 'entityType and rawRows are required' }, { status: 400 });
    }

    const client = getServiceClient();

    // Fetch existing entities to check duplicates
    let existingCompanies: any[] = [];
    let existingProjects: any[] = [];

    if (client) {
      if (entityType === 'company') {
        const { data } = await client.from('companies').select('id, name, slug, website');
        existingCompanies = data || [];
      } else {
        const { data } = await client.from('projects').select('id, name, slug, location');
        existingProjects = data || [];
      }
    }

    const validatedRows = rawRows.map((row: any, idx: number) => {
      const name = (row.name || row.Name || row.company_name || row.project_name || '').trim();
      const type = (row.type || row.Type || row.company_type || row.project_type || 'General Contractor').trim();
      const location = (row.location || row.Location || row.city || 'Bucharest').trim();
      const website = (row.website || row.Website || row.url || '').trim();
      const description = (row.description || row.Description || '').trim();
      const status = (row.status || row.Status || 'Under construction').trim();

      const errors: string[] = [];
      const warnings: string[] = [];
      let duplicateMatch: any = null;

      if (!name) {
        errors.push('Missing name');
      }

      const generatedSlug = name ? slugify(name) : `item-${idx}`;

      if (entityType === 'company') {
        // Check duplicate
        const normName = normalize(name);
        duplicateMatch = existingCompanies.find(c => {
          if (normalize(c.name) === normName) return true;
          if (c.slug === generatedSlug) return true;
          if (website && c.website && normalize(c.website) === normalize(website)) return true;
          return false;
        });

        if (duplicateMatch) {
          warnings.push(`Possible duplicate of existing company: "${duplicateMatch.name}"`);
        }
      } else {
        // Project duplicate check
        const normName = normalize(name);
        duplicateMatch = existingProjects.find(p => {
          if (normalize(p.name) === normName && normalize(p.location) === normalize(location)) return true;
          if (p.slug === generatedSlug) return true;
          return false;
        });

        if (duplicateMatch) {
          warnings.push(`Possible duplicate of existing project: "${duplicateMatch.name}" (${duplicateMatch.location})`);
        }
      }

      let rowStatus: 'valid' | 'warning' | 'error' | 'duplicate' = 'valid';
      if (errors.length > 0) rowStatus = 'error';
      else if (duplicateMatch) rowStatus = 'duplicate';
      else if (warnings.length > 0) rowStatus = 'warning';

      return {
        rowIndex: idx + 1,
        name,
        slug: generatedSlug,
        type,
        location,
        website,
        description,
        status,
        rowStatus,
        errors,
        warnings,
        duplicateMatch: duplicateMatch ? { id: duplicateMatch.id, name: duplicateMatch.name } : null
      };
    });

    // If action is preview, just return validated list
    if (action === 'preview') {
      return NextResponse.json({
        total: validatedRows.length,
        validCount: validatedRows.filter(r => r.rowStatus === 'valid').length,
        warningCount: validatedRows.filter(r => r.rowStatus === 'warning').length,
        duplicateCount: validatedRows.filter(r => r.rowStatus === 'duplicate').length,
        errorCount: validatedRows.filter(r => r.rowStatus === 'error').length,
        rows: validatedRows
      });
    }

    // If action is confirm, insert the records as draft / unresearched
    if (action === 'confirm' && client) {
      const recordsToInsert = validatedRows
        .filter(r => r.rowStatus !== 'error')
        .map(r => {
          if (entityType === 'company') {
            return {
              name: r.name,
              slug: r.slug,
              type: r.type,
              location: r.location,
              website: r.website || null,
              description: r.description || null,
              content_state: 'draft',
              research_state: 'unresearched',
              website_verification: 'unverified'
            };
          } else {
            return {
              name: r.name,
              slug: r.slug,
              type: r.type,
              location: r.location,
              status: r.status,
              description: r.description || null,
              content_state: 'draft',
              research_state: 'unresearched',
              status_verification: 'unverified'
            };
          }
        });

      if (recordsToInsert.length > 0) {
        const table = entityType === 'company' ? 'companies' : 'projects';
        const { error: insertErr } = await client.from(table).insert(recordsToInsert);
        if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });
      }

      return NextResponse.json({
        ok: true,
        importedCount: recordsToInsert.length
      });
    }

    return NextResponse.json({ ok: true, importedCount: validatedRows.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}
