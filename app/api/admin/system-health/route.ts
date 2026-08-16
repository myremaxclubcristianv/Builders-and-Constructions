import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { adminSystemHealthProbes, adminProductionDataHealthProbes } from '@/lib/admin-data';

export async function GET(request: Request) {
  try {
    await requireAdmin('admin');
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'data') {
      const dataHealth = await adminProductionDataHealthProbes();
      return NextResponse.json(dataHealth);
    }

    const health = await adminSystemHealthProbes();
    return NextResponse.json(health);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}
