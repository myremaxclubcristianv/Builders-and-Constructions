/**
 * Production rate-limiting utility for public API mutation endpoints.
 * Implements a sliding-window tracker with client IP resolution tailored for Vercel / serverless infrastructure.
 */

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory sliding window bucket store per container
const memoryStore = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes to prevent memory unbounded growth
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function purgeStaleEntries(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  const threshold = now - windowMs;
  for (const [key, record] of memoryStore.entries()) {
    const valid = record.timestamps.filter((ts) => ts > threshold);
    if (valid.length === 0) {
      memoryStore.delete(key);
    } else {
      record.timestamps = valid;
    }
  }
}

export interface RateLimitOptions {
  /** Maximum number of allowed requests within the window */
  maxRequests: number;
  /** Sliding window duration in milliseconds (default: 10 minutes = 600,000 ms) */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
  limit: number;
}

/**
 * Extracts the most trustworthy client IP address from request headers in Vercel / Node runtime.
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  // Vercel Edge / Node trusted headers
  const realIp = headers.get('x-real-ip');
  if (realIp && realIp.trim()) return realIp.trim();

  const vercelIp = headers.get('x-vercel-ip');
  if (vercelIp && vercelIp.trim()) return vercelIp.trim();

  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor && forwardedFor.trim()) {
    // Take the leftmost IP in the forwarded chain
    const clientIp = forwardedFor.split(',')[0].trim();
    if (clientIp) return clientIp;
  }

  return '127.0.0.1';
}

/**
 * Checks and updates rate limit for a specific client and endpoint.
 */
export function checkRateLimit(
  request: Request,
  endpoint: string,
  options: RateLimitOptions = { maxRequests: 5, windowMs: 10 * 60 * 1000 }
): RateLimitResult {
  const now = Date.now();
  purgeStaleEntries(options.windowMs);

  const ip = getClientIp(request);
  const key = `${endpoint}:${ip}`;

  const record = memoryStore.get(key) || { timestamps: [] };
  // Filter out timestamps outside the sliding window
  const windowStart = now - options.windowMs;
  const recentTimestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (recentTimestamps.length >= options.maxRequests) {
    const oldest = recentTimestamps[0];
    const retryAfterMs = oldest + options.windowMs - now;
    const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));

    return {
      allowed: false,
      retryAfterSeconds,
      remaining: 0,
      limit: options.maxRequests
    };
  }

  // Record this valid request timestamp
  recentTimestamps.push(now);
  record.timestamps = recentTimestamps;
  memoryStore.set(key, record);

  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: Math.max(0, options.maxRequests - recentTimestamps.length),
    limit: options.maxRequests
  };
}
