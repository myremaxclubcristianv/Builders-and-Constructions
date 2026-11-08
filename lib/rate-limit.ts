/**
 * Production Rate-Limiting Engine for CONSTRUCTIONS by AiXLuxury.
 * Supports genuine distributed serverless rate limiting via Upstash Redis REST API
 * and an explicitly controlled local sliding-window in-memory fallback.
 *
 * Implements:
 * - Atomic Redis Lua scripting for race-condition-free sliding-window rate limiting
 * - Cloudflare Worker environment & Node.js dual runtime credential extraction
 * - Cryptographic IP salt hashing (raw IPs are never stored in Redis)
 * - Automatic TTL expiration on all Redis keys
 * - Fail-closed enforcement on security-critical routes (/admin/session, /subscribe, /intake)
 * - Fail-open preservation on non-critical visitor telemetry (/telemetry/events)
 * - Zero credential leakage in logs, errors, or API responses
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
  /** Explicitly require distributed Upstash backend and forbid local memory fallback */
  requireDistributed?: boolean;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
  limit: number;
  backend: 'distributed_upstash' | 'in_memory_container';
  reason?: string;
  status: number;
}

export type RateLimitReturn = Promise<RateLimitResult> & RateLimitResult;

// Basic IPv4 / IPv6 validation regex to prevent header manipulation attacks
const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const IPV6_REGEX = /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$|^::1$/;

/**
 * Extracts the most trustworthy client IP address from request headers in Vercel / Cloudflare runtime.
 * Prioritizes platform-authenticated headers (cf-connecting-ip, x-real-ip, x-vercel-ip).
 * Strips client spoofing attempts from arbitrary headers.
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;

  // 1. CF-Connecting-IP (Cloudflare)
  const cfIp = headers.get('cf-connecting-ip')?.trim();
  if (cfIp && (IPV4_REGEX.test(cfIp) || IPV6_REGEX.test(cfIp))) {
    return cfIp;
  }

  // 2. Vercel / Edge trusted headers
  const realIp = headers.get('x-real-ip')?.trim();
  if (realIp && (IPV4_REGEX.test(realIp) || IPV6_REGEX.test(realIp))) {
    return realIp;
  }

  const vercelIp = headers.get('x-vercel-ip')?.trim();
  if (vercelIp && (IPV4_REGEX.test(vercelIp) || IPV6_REGEX.test(vercelIp))) {
    return vercelIp;
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

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isProduction(): boolean {
  const env = (process.env.APP_ENV || process.env.NODE_ENV || '').toLowerCase();
  return env === 'production';
}

/**
 * Explicit documented development-only fallback salt.
 * Strictly forbidden in production; active only during local testing / offline dev.
 */
const DEV_ONLY_FALLBACK_SALT = 'aix-dev-rate-limit-salt-local-only-not-for-prod';

/**
 * Extracts the dedicated server-side RATE_LIMIT_SALT across Cloudflare Worker runtime context
 * and Node.js environment variables.
 *
 * Security rules:
 * - In production: returns the configured secret or undefined if missing. NEVER uses a public fallback.
 * - In non-production: returns the development fallback if RATE_LIMIT_SALT is absent.
 */
export function getRateLimitSalt(): string | undefined {
  let cfEnv: Record<string, any> | undefined;
  try {
    const cf = require('@opennextjs/cloudflare');
    if (typeof cf?.getCloudflareContext === 'function') {
      const ctx = cf.getCloudflareContext();
      if (ctx && ctx.env) {
        cfEnv = ctx.env;
      }
    }
  } catch {
    // Outside of Cloudflare Worker request context
  }

  const rawSalt = cfEnv?.RATE_LIMIT_SALT || process.env.RATE_LIMIT_SALT;
  const salt = typeof rawSalt === 'string' ? rawSalt.trim().replace(/^["']|["']$/g, '') : undefined;

  if (salt) {
    return salt;
  }

  if (isProduction()) {
    return undefined; // Strictly no public fallback in production
  }

  return DEV_ONLY_FALLBACK_SALT;
}

/**
 * Computes an HMAC-SHA256 signature using the standard Web Crypto API (crypto.subtle),
 * natively available in Cloudflare Workers and modern Node.js environments.
 * Produces a 64-character hexadecimal digest (256-bit hash, cryptographically collision-resistant).
 */
export async function computeHmacSha256WebCrypto(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const keyData = enc.encode(secret);
  const msgData = enc.encode(message);

  const subtle = (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle)
    ? globalThis.crypto.subtle
    : (await import('crypto')).webcrypto.subtle;

  const cryptoKey = await subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await subtle.sign('HMAC', cryptoKey, msgData);
  const hashBytes = new Uint8Array(signature);
  let hex = '';
  for (let i = 0; i < hashBytes.length; i++) {
    hex += hashBytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * Synchronous equivalent of HMAC-SHA256 for local synchronous in-memory rate limiting.
 * Produces the identical 64-character digest byte-for-byte as Web Crypto (cryptographically collision-resistant).
 */
export function computeHmacSha256Sync(secret: string, message: string): string {
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

/**
 * Hashes client IP using HMAC-SHA256 with RATE_LIMIT_SALT via Web Crypto APIs (crypto.subtle).
 *
 * Privacy & Security Guarantees:
 * - Uses Web Crypto API compatible with Cloudflare Workers.
 * - Output is 64 hexadecimal characters (256 bits, cryptographically collision-resistant).
 * - Never exposes the salt or raw IP in keys, logs, responses, or telemetry.
 * - In production: throws if RATE_LIMIT_SALT is missing.
 * - In non-production: uses the documented development-only fallback if unconfigured.
 * - Salt rotation consequence: rotating RATE_LIMIT_SALT changes the derived Redis keys,
 *   making previous active buckets inaccessible until their TTL naturally expires.
 */
export async function hashClientIdentifier(ip: string, customSecret?: string): Promise<string> {
  const secret = customSecret !== undefined ? customSecret : getRateLimitSalt();
  if (!secret) {
    if (isProduction()) {
      throw new Error('RATE_LIMIT_SALT_MISSING_IN_PRODUCTION');
    }
    return computeHmacSha256WebCrypto(DEV_ONLY_FALLBACK_SALT, ip);
  }
  return computeHmacSha256WebCrypto(secret, ip);
}

/**
 * Synchronous helper for local in-memory fallback execution in tests and offline dev.
 * STRICTLY FORBIDDEN IN PRODUCTION: Throws immediately if invoked in production to guarantee
 * that production rate limiting cannot bypass the asynchronous Web Crypto implementation.
 */
export function hashClientIdentifierSync(ip: string, customSecret?: string): string {
  if (isProduction()) {
    throw new Error('SYNCHRONOUS_HMAC_FORBIDDEN_IN_PRODUCTION: Production rate limiting must use asynchronous Web Crypto');
  }
  const secret = customSecret !== undefined ? customSecret : getRateLimitSalt();
  if (!secret) {
    return computeHmacSha256Sync(DEV_ONLY_FALLBACK_SALT, ip);
  }
  return computeHmacSha256Sync(secret, ip);
}

/**
 * Sanitizes sensitive tokens and salts from error messages before exposure.
 */
function sanitizeErrorMessage(rawMsg: string, token?: string, salt?: string): string {
  let safeMsg = rawMsg || 'Upstash request failed';
  if (token) {
    safeMsg = safeMsg.replace(new RegExp(escapeRegex(token), 'g'), '[REDACTED_TOKEN]');
  }
  if (salt) {
    safeMsg = safeMsg.replace(new RegExp(escapeRegex(salt), 'g'), '[REDACTED_SALT]');
  }
  return safeMsg;
}

/**
 * Extracts Upstash Redis credentials across Cloudflare Worker runtime context
 * and Node.js environment variables.
 */
export function getUpstashCredentials(): { url?: string; token?: string } {
  let cfEnv: Record<string, any> | undefined;
  try {
    // Dynamic access to Cloudflare Worker bindings in OpenNext runtime
    const cf = require('@opennextjs/cloudflare');
    if (typeof cf?.getCloudflareContext === 'function') {
      const ctx = cf.getCloudflareContext();
      if (ctx && ctx.env) {
        cfEnv = ctx.env;
      }
    }
  } catch {
    // Outside of Cloudflare Worker request context (e.g. Node tests / build)
  }

  const rawUrl = cfEnv?.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL;
  const rawToken = cfEnv?.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  const url = typeof rawUrl === 'string' ? rawUrl.trim().replace(/^["']|["']$/g, '') : undefined;
  const token = typeof rawToken === 'string' ? rawToken.trim().replace(/^["']|["']$/g, '') : undefined;

  return { url: url || undefined, token: token || undefined };
}

/**
 * Executes a Redis command against the Upstash REST API with bounded timeout
 * and complete credential sanitization on error.
 */
async function callUpstashRedis(
  url: string,
  token: string,
  command: (string | number)[],
  salt?: string
): Promise<any> {
  const cleanUrl = url.endsWith('/') ? url : `${url}/`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000); // 2-second bounded timeout

  try {
    const response = await fetch(cleanUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(command),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Upstash HTTP Error ${response.status}`);
    }

    const data = await response.json();
    if (data && typeof data === 'object' && 'error' in data) {
      throw new Error(`Upstash Redis Error: ${data.error}`);
    }

    return data?.result;
  } catch (err: any) {
    clearTimeout(timeoutId);
    const rawMsg = err?.message || 'Upstash request failed';
    const safeMsg = sanitizeErrorMessage(rawMsg, token, salt);
    throw new Error(safeMsg);
  }
}

/**
 * Atomic sliding window Lua script for Upstash Redis.
 *
 * KEYS[1]: Redis rate limit key (e.g. ratelimit:endpoint:hashed_ip)
 * ARGV[1]: Current unix timestamp in milliseconds
 * ARGV[2]: Window duration in milliseconds
 * ARGV[3]: Maximum allowed requests within the window
 *
 * Returns: [allowed (1 or 0), remaining_count, retry_after_seconds]
 */
const LUA_SLIDING_WINDOW_SCRIPT = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local max = tonumber(ARGV[3])
local clearBefore = now - window

redis.call('ZREMRANGEBYSCORE', key, '-inf', clearBefore)
local current = redis.call('ZCARD', key)

if current < max then
    local seq = redis.call('INCR', key .. ':seq')
    local member = tostring(now) .. ':' .. tostring(seq)
    redis.call('ZADD', key, now, member)
    local expireSec = math.ceil((window / 1000) + 5)
    redis.call('EXPIRE', key, expireSec)
    redis.call('EXPIRE', key .. ':seq', expireSec)
    return {1, max - current - 1, 0}
else
    local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
    local retryAfter = 1
    if oldest and #oldest >= 2 then
        local oldestScore = tonumber(oldest[2])
        if oldestScore then
            local retryMs = oldestScore + window - now
            retryAfter = math.ceil(retryMs / 1000)
            if retryAfter < 1 then retryAfter = 1 end
        end
    end
    return {0, 0, retryAfter}
end
`.trim();

/**
 * Atomic lockout inspection Lua script (does not increment count).
 */
const LUA_CHECK_LOCKOUT_SCRIPT = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local max = tonumber(ARGV[3])
local clearBefore = now - window

redis.call('ZREMRANGEBYSCORE', key, '-inf', clearBefore)
local current = redis.call('ZCARD', key)

if current >= max then
    local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
    local retryAfter = 1
    if oldest and #oldest >= 2 then
        local oldestScore = tonumber(oldest[2])
        if oldestScore then
            local retryMs = oldestScore + window - now
            retryAfter = math.ceil(retryMs / 1000)
            if retryAfter < 1 then retryAfter = 1 end
        end
    end
    return {0, 0, retryAfter}
else
    return {1, max - current, 0}
end
`.trim();

/**
 * Helper to construct a result that is both a Promise and immediately exposes properties
 * for synchronous in-memory callers in unit test harnesses.
 */
function createThenableResult(result: RateLimitResult): RateLimitReturn {
  const promise = Promise.resolve(result);
  return Object.assign(promise, result) as RateLimitReturn;
}

/**
 * In-memory sliding window fallback execution.
 */
function executeInMemoryRateLimit(
  key: string,
  now: number,
  options: RateLimitOptions
): RateLimitResult {
  purgeStaleEntries(options.windowMs);

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
      backend: 'in_memory_container',
      status: 429
    };
  }

  recentTimestamps.push(now);
  record.timestamps = recentTimestamps;
  memoryStore.set(key, record);

  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: Math.max(0, options.maxRequests - recentTimestamps.length),
    limit: options.maxRequests,
    backend: 'in_memory_container',
    status: 200
  };
}

/**
 * Checks and updates rate limit for a specific client and endpoint.
 *
 * Behavior:
 * 1. If Upstash Redis credentials exist: executes atomic sliding window Lua script via Upstash REST.
 * 2. If credentials are missing:
 *    - In production on critical endpoints (failClosed=true or requireDistributed=true): fails closed with HTTP 503.
 *    - In local development/test: falls back to in-memory sliding window, accurately reporting backend.
 * 3. On Upstash network/HTTP error:
 *    - If failClosed=true: fails closed with HTTP 503 and 60s retry-after.
 *    - If failClosed=false: fails open for non-critical telemetry.
 */
export function checkRateLimit(
  request: Request,
  endpoint: string,
  options: RateLimitOptions = { maxRequests: 5, windowMs: 10 * 60 * 1000 }
): RateLimitReturn {
  const ip = getClientIp(request);
  const salt = getRateLimitSalt();
  const credentials = getUpstashCredentials();
  const now = Date.now();

  // 1. Production Fail-Closed Gate: Missing RATE_LIMIT_SALT in production -> HTTP 503 Configuration Failure
  if (isProduction() && !salt) {
    if (options.failClosed || options.requireDistributed) {
      const result: RateLimitResult = {
        allowed: false,
        retryAfterSeconds: 60,
        remaining: 0,
        limit: options.maxRequests,
        backend: credentials.url && credentials.token ? 'distributed_upstash' : 'in_memory_container',
        reason: 'RATE_LIMIT_SALT_MISSING_FAIL_CLOSED',
        status: 503
      };
      return createThenableResult(result);
    }
    const result: RateLimitResult = {
      allowed: true,
      retryAfterSeconds: 0,
      remaining: 1,
      limit: options.maxRequests,
      backend: credentials.url && credentials.token ? 'distributed_upstash' : 'in_memory_container',
      reason: 'RATE_LIMIT_SALT_MISSING_FAIL_OPEN',
      status: 200
    };
    return createThenableResult(result);
  }

  // 2. Real Distributed Upstash Backend
  if (credentials.url && credentials.token) {
    const asyncPromise = (async (): Promise<RateLimitResult> => {
      try {
        const hashedIp = await hashClientIdentifier(ip, salt);
        const redisKey = `ratelimit:${endpoint}:${hashedIp}`;

        const rawResult = await callUpstashRedis(credentials.url!, credentials.token!, [
          'EVAL',
          LUA_SLIDING_WINDOW_SCRIPT,
          1,
          redisKey,
          String(now),
          String(options.windowMs),
          String(options.maxRequests)
        ], salt);

        if (Array.isArray(rawResult) && rawResult.length >= 3) {
          const allowed = Number(rawResult[0]) === 1;
          const remaining = Math.max(0, Number(rawResult[1]) || 0);
          const retryAfterSeconds = Math.max(0, Number(rawResult[2]) || 0);

          return {
            allowed,
            retryAfterSeconds,
            remaining,
            limit: options.maxRequests,
            backend: 'distributed_upstash',
            status: allowed ? 200 : 429
          };
        }

        throw new Error('Malformed Redis response shape');
      } catch (err: any) {
        if (options.failClosed) {
          return {
            allowed: false,
            retryAfterSeconds: 60,
            remaining: 0,
            limit: options.maxRequests,
            backend: 'distributed_upstash',
            reason: 'UPSTASH_ERROR_FAIL_CLOSED',
            status: 503
          };
        }
        return {
          allowed: true,
          retryAfterSeconds: 0,
          remaining: 1,
          limit: options.maxRequests,
          backend: 'distributed_upstash',
          reason: 'UPSTASH_ERROR_FAIL_OPEN',
          status: 200
        };
      }
    })();

    return asyncPromise as RateLimitReturn;
  }

  // 3. Production Fail-Closed Gate: When Upstash is missing in production on critical routes -> HTTP 503
  if (isProduction() && (options.failClosed || options.requireDistributed)) {
    const result: RateLimitResult = {
      allowed: false,
      retryAfterSeconds: 60,
      remaining: 0,
      limit: options.maxRequests,
      backend: 'in_memory_container',
      reason: 'UPSTASH_CREDENTIALS_MISSING_FAIL_CLOSED',
      status: 503
    };
    return createThenableResult(result);
  }

  // 4. Production Fail-Open Gate for Non-Critical Routes (e.g. Telemetry):
  // Never fall back to in-memory rate limiting in production.
  if (isProduction()) {
    const result: RateLimitResult = {
      allowed: true,
      retryAfterSeconds: 0,
      remaining: 1,
      limit: options.maxRequests,
      backend: 'in_memory_container',
      reason: 'UPSTASH_CREDENTIALS_MISSING_FAIL_OPEN',
      status: 200
    };
    return createThenableResult(result);
  }

  // 5. Local Development / Non-Production In-Memory Fallback
  const hashedIp = hashClientIdentifierSync(ip, salt);
  const redisKey = `ratelimit:${endpoint}:${hashedIp}`;
  const inMemoryResult = executeInMemoryRateLimit(redisKey, now, options);
  return createThenableResult(inMemoryResult);
}

/**
 * Records an authentication failure specifically, isolating failure counts
 * from successful logins to prevent locking out valid users.
 */
export function recordAuthFailure(
  request: Request,
  endpoint = 'admin_login_failures'
): RateLimitReturn {
  return checkRateLimit(request, endpoint, {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
    failClosed: true
  });
}

/**
 * Checks whether the client is currently locked out from too many failures.
 */
export function checkAuthLockout(
  request: Request,
  endpoint = 'admin_login_failures'
): RateLimitReturn {
  const ip = getClientIp(request);
  const salt = getRateLimitSalt();
  const credentials = getUpstashCredentials();
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 5;

  // 1. Missing RATE_LIMIT_SALT in production -> HTTP 503 Configuration Failure
  if (isProduction() && !salt) {
    const result: RateLimitResult = {
      allowed: false,
      retryAfterSeconds: 60,
      remaining: 0,
      limit: maxRequests,
      backend: credentials.url && credentials.token ? 'distributed_upstash' : 'in_memory_container',
      reason: 'RATE_LIMIT_SALT_MISSING_FAIL_CLOSED',
      status: 503
    };
    return createThenableResult(result);
  }

  // 2. Distributed Upstash Lockout Check
  if (credentials.url && credentials.token) {
    const asyncPromise = (async (): Promise<RateLimitResult> => {
      try {
        const hashedIp = await hashClientIdentifier(ip, salt);
        const redisKey = `ratelimit:${endpoint}:${hashedIp}`;

        const rawResult = await callUpstashRedis(credentials.url!, credentials.token!, [
          'EVAL',
          LUA_CHECK_LOCKOUT_SCRIPT,
          1,
          redisKey,
          String(now),
          String(windowMs),
          String(maxRequests)
        ], salt);

        if (Array.isArray(rawResult) && rawResult.length >= 3) {
          const allowed = Number(rawResult[0]) === 1;
          const remaining = Math.max(0, Number(rawResult[1]) || 0);
          const retryAfterSeconds = Math.max(0, Number(rawResult[2]) || 0);

          return {
            allowed,
            retryAfterSeconds,
            remaining,
            limit: maxRequests,
            backend: 'distributed_upstash',
            status: allowed ? 200 : 429
          };
        }

        throw new Error('Malformed Redis lockout response');
      } catch {
        return {
          allowed: false,
          retryAfterSeconds: 60,
          remaining: 0,
          limit: maxRequests,
          backend: 'distributed_upstash',
          reason: 'UPSTASH_LOCKOUT_ERROR_FAIL_CLOSED',
          status: 503
        };
      }
    })();

    return asyncPromise as RateLimitReturn;
  }

  // 3. Production Fail-Closed Gate: When Upstash is missing in production on auth endpoints -> HTTP 503
  if (isProduction()) {
    const result: RateLimitResult = {
      allowed: false,
      retryAfterSeconds: 60,
      remaining: 0,
      limit: maxRequests,
      backend: 'in_memory_container',
      reason: 'UPSTASH_CREDENTIALS_MISSING_FAIL_CLOSED',
      status: 503
    };
    return createThenableResult(result);
  }

  // 4. Local In-Memory Lockout Check
  const hashedIp = hashClientIdentifierSync(ip, salt);
  const redisKey = `ratelimit:${endpoint}:${hashedIp}`;
  const record = memoryStore.get(redisKey);
  if (!record) {
    return createThenableResult({
      allowed: true,
      retryAfterSeconds: 0,
      remaining: maxRequests,
      limit: maxRequests,
      backend: 'in_memory_container',
      status: 200
    });
  }

  const windowStart = now - windowMs;
  const recent = record.timestamps.filter((ts) => ts > windowStart);
  if (recent.length >= maxRequests) {
    const oldest = recent[0];
    const retryAfterMs = oldest + windowMs - now;
    return createThenableResult({
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
      remaining: 0,
      limit: maxRequests,
      backend: 'in_memory_container',
      status: 429
    });
  }

  return createThenableResult({
    allowed: true,
    retryAfterSeconds: 0,
    remaining: maxRequests - recent.length,
    limit: maxRequests,
    backend: 'in_memory_container',
    status: 200
  });
}

/**
 * Clears lockout counter after successful authentication.
 */
export function clearAuthFailures(
  request: Request,
  endpoint = 'admin_login_failures'
): Promise<void> | void {
  const ip = getClientIp(request);
  const salt = getRateLimitSalt();
  const credentials = getUpstashCredentials();

  // In non-production, delete from local memory store
  if (!isProduction()) {
    const hashedIpSync = hashClientIdentifierSync(ip, salt);
    const memKey = `ratelimit:${endpoint}:${hashedIpSync}`;
    memoryStore.delete(memKey);
    memoryStore.delete(`${memKey}:seq`);
  }

  // In distributed Redis mode, delete keys asynchronously via Upstash REST
  if (credentials.url && credentials.token && salt) {
    return (async () => {
      try {
        const hashedIp = await hashClientIdentifier(ip, salt);
        const redisKey = `ratelimit:${endpoint}:${hashedIp}`;
        await callUpstashRedis(credentials.url!, credentials.token!, [
          'DEL',
          redisKey,
          `${redisKey}:seq`
        ], salt);
      } catch {
        // Defensive no-op on Redis DEL failure
      }
    })();
  }
}


