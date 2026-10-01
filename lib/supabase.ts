import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Ensure Node < 22 does not throw error when RealtimeClient checks for WebSocket constructor
if (typeof globalThis !== 'undefined' && !globalThis.WebSocket) {
  // @ts-expect-error fallback dummy class for server-side REST only usage
  globalThis.WebSocket = class DummyWebSocket {};
}

export type AppEnvironment = 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT';

export function getAppEnvironment(): AppEnvironment {
  const env = (process.env.APP_ENV || process.env.NODE_ENV || 'development').toLowerCase();
  if (env === 'production') return 'PRODUCTION';
  if (env === 'staging') return 'STAGING';
  return 'DEVELOPMENT';
}

export function isProductionEnvironment(): boolean {
  return getAppEnvironment() === 'PRODUCTION';
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(url && key && url.trim() !== '' && key.trim() !== '');
}

let cachedServiceClient: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url.trim() === '' || key.trim() === '') return null;
  
  if (!cachedServiceClient) {
    try {
      cachedServiceClient = createClient(url, key, {
        auth: { persistSession: false }
      });
    } catch (err) {
      console.warn('[Supabase Service Client Initialization Error]', err);
      return null;
    }
  }
  return cachedServiceClient;
}

export function getPublicClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey || url.trim() === '' || anonKey.trim() === '') return null;
  try {
    return createClient(url, anonKey, {
      auth: { persistSession: false }
    });
  } catch {
    return null;
  }
}
