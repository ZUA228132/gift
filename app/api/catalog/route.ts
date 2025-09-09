export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { supabaseService } from '@/lib/supabase';

export async function GET() {
  try {
    const sb = supabaseService();
    const { data, error } = await sb
      .from('catalog_view')
      .select('external_gift_id,title,rarity,weight,image_url,available');
    if (error) return new Response(error.message, { status: 500 });
    return Response.json({ ok: true, items: data ?? [] });
  } catch (e: any) {
    return new Response(e?.message || 'Internal error', { status: 500 });
  }
}
