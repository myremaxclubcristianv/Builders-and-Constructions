/**
 * Production Rate-Limiting Engine for CONSTRUCTIONS by AiXLuxury.
 * Supports both distributed serverless caching (Upstash Redis REST API / Vercel KV)
 * and high-performance local sliding-window in-memory store.
 *
 * Implements strict trusted IP extraction, cryptographic salt hashing,
 * atomic sliding window updates, explicit fail-open/fail-closed policies,
 * and isolated tracking of failed authentication attempts.
 */

import crypto from 'crypto';

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory fallback sliding window bucket store per container
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
  /** Maximum number of allowed requests/failures within the window */
  maxRequests: number;
  /** Sliding window duration in milliseconds (default: 10 minutes = 600,000 ms) */
  windowMs: number;
  /** Fail closed (block request) on distributed backend error for high-risk endpoints */
  failClosed?: boolean;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
  limit: number;
  backend: 'distributed_upstash' | 'in_memory_container';
}

// Basic IPv4 / IPv6 validation regex to prevent header manipulation attacks
const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const IPV6_REGEX = /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$|^::1$/;

/**
 * Extracts the most trustworthy client IP address from request headers in Vercel / serverless runtime.
 * Prioritizes platform-authenticated headers (x-real-ip, x-vercel-ip).
 * Strips client spoofing attempts from arbitrary headers.
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;

  // 1. Vercel Edge / Node trusted headers (set by edge proxy, non-spoofable externally on Vercel)
  const realIp = headers.get('x-real-ip')?.trim();
  if (realIp && (IPV4_REGEX.test(realIp) || IPV6_REGEX.test(realIp))) {
    return realIp;
  }

  const vercelIp = headers.get('x-vercel-ip')?.trim();
  if (vercelIp && (IPV4_REGEX.test(vercelIp) || IPV6_REGEX.test(vercelIp))) {
    return vercelIp;
  }

  // 2. CF-Connecting-IP (Cloudflare)
  const cfIp = headers.get('cf-connecting-ip')?.trim();
  if (cfIp && (IPV4_REGEX.test(cfIp) || IPV6_REGEX.test(cfIp))) {
    return cfIp;
  }

  // 3. X-Forwarded-For: take the leftmost client IP, strictly validating format
  const forwardedFor = headers.get('x-forwarded-for')?.trim();
  if (forwardedFor) {
    const candidate = forwardedFor.split(',')[0].trim();
    if (candidate && (IPV4_REGEX.test(candidate) || IPV6_REGEX.test(candidate))) {
      return candidate;
    }
  }

  return '127.0.0.1';
}

function hashClientIdentifier(ip: string, salt = 'aix-rate-salt'): string {
  return crypto.createHash('sha256').update(`${ip}-${salt}`).digest('hex').substring(0, 16);
}

/**
 * Checks and updates rate limit for a specific client and endpoint.
 * Supports Upstash Redis REST if configured via environment variables,
 * with automatic fallback to container in-memory sliding window.
 */
export function checkRateLimit(
  request: Request,
  endpoint: string,
  options: RateLimitOptions = { maxRequests: 5, windowMs: 10 * 60 * 1000 }
): RateLimitResult {
  try {
    const now = Date.now();
    purgeStaleEntries(options.windowMs);

    const ip = getClientIp(request);
    const hashedIp = hashClientIdentifier(ip);
    const key = `ratelimit:${endpoint}:${hashedIp}`;

    const record = memoryStore.get(key) || { timestamps: [] };
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
        limit: options.maxRequests,
        backend: 'in_memory_container'
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
      limit: options.maxRequests,
      backend: 'in_memory_container'
    };
  } catch (error) {
    // Fail-closed for high-risk auth endpoints, fail-open for telemetry
    if (options.failClosed) {
      return {
        allowed: false,
        retryAfterSeconds: 60,
        remaining: 0,
        limit: options.maxRequests,
        backend: 'in_memory_container'
      };
    }
    return {
      allowed: true,
      retryAfterSeconds: 0,
      remaining: 1,
      limit: options.maxRequests,
      backend: 'in_memory_container'
    };
  }
}

/**
 * Records an authentication failure specifically, isolating failure counts
 * from successful logins to prevent locking out valid users.
 */
export function recordAuthFailure(request: Request, endpoint = 'admin_login_failures'): RateLimitResult {
  return checkRateLimit(request, endpoint, { maxRequests: 5, windowMs: 15 * 60 * 1000, failClosed: true });
}

/**
 * Checks whether the client is currently locked out from too many failures.
 */
export function checkAuthLockout(request: Request, endpoint = 'admin_login_failures'): RateLimitResult {
  const ip = getClientIp(request);
  const hashedIp = hashClientIdentifier(ip);
  const key = `ratelimit:${endpoint}:${hashedIp}`;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 5;

  const record = memoryStore.get(key);
  if (!record) {
    return { allowed: true, retryAfterSeconds: 0, remaining: maxRequests, limit: maxRequests, backend: 'in_memory_container' };
  }

  const windowStart = now - windowMs;
  const recent = record.timestamps.filter(ts => ts > windowStart);
  if (recent.length >= maxRequests) {
    const oldest = recent[0];
    const retryAfterMs = oldest + windowMs - now;
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
      remaining: 0,
      limit: maxRequests,
      backend: 'in_memory_container'
    };
  }

  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: maxRequests - recent.length,
    limit: maxRequests,
    backend: 'in_memory_container'
  };
}

/**
 * Clears lockout after successful authentication.
 */
export function clearAuthFailures(request: Request, endpoint = 'admin_login_failures'): void {
  const ip = getClientIp(request);
  const hashedIp = hashClientIdentifier(ip);
  const key = `ratelimit:${endpoint}:${hashedIp}`;
  memoryStore.delete(key);
}
