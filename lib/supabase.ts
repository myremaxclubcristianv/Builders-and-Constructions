import { createClient, SupabaseClient } from '@supabase/supabase-js';

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
  if (!url || !key) return null;
  
  if (!cachedServiceClient) {
    cachedServiceClient = createClient(url, key, {
      auth: { persistSession: false }
    });
  }
  return cachedServiceClient;
}

export function getPublicClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false }
  });
}
