import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { adminSystemHealthProbes } from '@/lib/admin-data';

export async function GET() {
  try {
    await requireAdmin('admin');
    const health = await adminSystemHealthProbes();
    return NextResponse.json(health);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}
