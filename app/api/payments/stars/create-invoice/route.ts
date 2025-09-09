import { NextRequest } from 'next/server';
import { supabaseService } from '@/lib/supabase';
import { verifyInitData, getUserFromInitData } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  const { initData } = await req.json();
  const dev = process.env.NEXT_PUBLIC_DEV_MODE === '1';
  const sb = supabaseService();

  let verified = verifyInitData(initData);
  if (!verified && dev) verified = true;

  if (!verified) return new Response('invalid initData', { status: 401 });
  const u = getUserFromInitData(initData) || (dev ? { id: 12345 } : null);
  if (!u) return new Response('no user', { status: 400 });

  let price = 25;
  const { data: s } = await sb.from('settings').select('value_json').eq('key','price_per_play').maybeSingle();
  if (s?.value_json) price = Number(s.value_json) || 25;

  const provider_token = process.env.TELEGRAM_STARS_PROVIDER_TOKEN!;
  const botToken = process.env.TELEGRAM_BOT_TOKEN!;
  const payload = `play_${u.id}_${Date.now()}`;
  const title = 'Подарочная хватайка';
  const description = 'Одна попытка';
  const prices = [{ label: 'Play', amount: price * 100 }];

  const resp = await fetch(`https://api.telegram.org/bot${botToken}/createInvoiceLink`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ title, description, payload, provider_token, currency:'XTR', prices })
  });
  const json = await resp.json();
  if (!json.ok) return new Response(JSON.stringify(json), { status: 502 });

  return Response.json({ ok: true, invoiceLink: json.result });
}
