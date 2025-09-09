import { supabaseService } from '@/lib/supabase';
import { verifyInitData, getUserFromInitData } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const { initData } = await req.json();
    const sb = supabaseService();

    let verified = verifyInitData(initData);
    const dev = process.env.NEXT_PUBLIC_DEV_MODE === '1';
    if (!verified && dev) verified = true;

    let userId: string | null = null;
    if (verified) {
      const u = getUserFromInitData(initData) || (dev ? { id: 12345, username: 'dev_user' } : null);
      if (u) {
        userId = String(u.id);
        await sb.from('users').upsert({
          tg_user_id: userId,
          username: u.username || null,
        }, { onConflict: 'tg_user_id' });
      }
    }

    let price = 25;
    const { data: s } = await sb.from('settings').select('value_json').eq('key', 'price_per_play').maybeSingle();
    if (s?.value_json) price = Number(s.value_json) || 25;

    return Response.json({ ok: true, verified, userId, pricePerPlay: price });
  } catch (e: any) {
    return new Response(e?.message || 'Internal error', { status: 500 });
  }
}
