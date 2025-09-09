// lib/supabase-browser.ts
import { createClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client for use in the browser. It uses the NEXT_PUBLIC
 * environment variables so that the keys are exposed during build.
 */
export function supabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, anon, { auth: { persistSession: true } });
}
