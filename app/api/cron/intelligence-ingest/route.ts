import { NextResponse } from 'next/server';
import { executeOperationalPipeline } from '@/lib/operational-pipeline';

/**
 * Scheduled Intelligence Ingestion Endpoint
 * Protected via CRON_SECRET authorization header
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Secure authentication check: If CRON_SECRET is configured, require exact Bearer token
    if (cronSecret) {
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized scheduled job request' }, { status: 401 });
      }
    } else if (process.env.NODE_ENV === 'production') {
      // In production, CRON_SECRET must be configured to prevent unauthorized trigger
      return NextResponse.json({ error: 'Scheduled execution not configured' }, { status: 503 });
    }

    const nowIso = new Date().toISOString();

    // Scheduled Ingestion Observation for YouTube Official Channel Sync
    const pipelineResult = await executeOperationalPipeline({
      sourceName: 'Official YouTube Channel Sync',
      sourceType: 'OFFICIAL',
      sourceUrl: 'https://youtube.com/@CristianVaduvaCV',
      triggerType: 'SCHEDULED',
      entityNameCandidate: 'AiXLuxury',
      eventType: 'MARKET_ACTIVITY_CHANGE',
      evidenceText: 'Scheduled intelligence pipeline synchronization executed.',
      commercialRelevance: 'MEDIUM',
      rawPayload: {
        channelId: 'UC_CristianVaduvaCV',
        scheduledExecutionAt: nowIso,
        syncMode: 'AUTOMATED_CRON'
      }
    });

    return NextResponse.json({
      ok: true,
      message: 'Scheduled intelligence ingestion job completed successfully',
      result: pipelineResult
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Scheduled job execution failed' }, { status: 500 });
  }
}
