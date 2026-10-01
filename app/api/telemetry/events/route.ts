import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { IncomingVisitorEvent, processVisitorIntelligenceEvent } from "@/lib/visitor-intelligence";

const MAX_PAYLOAD_BYTES = 64 * 1024; // 64 KB

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Protection (120 telemetry pings / minute per client IP)
    const rateLimit = checkRateLimit(request, "telemetry_events", {
      maxRequests: 120,
      windowMs: 60 * 1000
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { ok: false, error: "Rate limit exceeded." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) }
        }
      );
    }

    // 2. Payload size guard
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ ok: false, error: "Payload too large." }, { status: 413 });
    }

    let body: any = null;
    try {
      body = await request.json();
    } catch {
      try {
        const text = await request.text();
        if (text) body = JSON.parse(text);
      } catch {
        body = null;
      }
    }
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
    }

    const events: IncomingVisitorEvent[] = Array.isArray(body.events)
      ? body.events
      : Array.isArray(body)
      ? body
      : [body];

    if (events.length === 0 || events.length > 25) {
      return NextResponse.json({ ok: false, error: "Invalid events count (1-25 allowed)." }, { status: 400 });
    }

    const clientIp = getClientIp(request);
    let processedCount = 0;

    for (const ev of events) {
      if (
        !ev ||
        typeof ev.sessionId !== "string" ||
        typeof ev.visitorId !== "string" ||
        typeof ev.eventType !== "string" ||
        typeof ev.path !== "string"
      ) {
        continue;
      }

      // Process event asynchronously
      await processVisitorIntelligenceEvent(ev, request.headers, clientIp);
      processedCount++;
    }

    return NextResponse.json({
      ok: true,
      processed: processedCount,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("[Telemetry Events Intake Error]", err);
    return NextResponse.json(
      { ok: false, error: "Telemetry intake error." },
      { status: 500 }
    );
  }
}
