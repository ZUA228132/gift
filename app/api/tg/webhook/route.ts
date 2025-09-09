import { NextRequest } from 'next/server';
import { supabaseService } from '@/lib/supabase';

function verifyTelegramSignature(req: NextRequest) {
  const secret = process.env.TELEGRAM_BOT_SECRET!;
  const got = req.headers.get('x-telegram-bot-api-secret-token');
  return !!secret && !!got && got === secret;
}

export async function POST(req: NextRequest) {
  if (!verifyTelegramSignature(req)) return new Response('forbidden', { status: 403 });
  const body = await req.json();
  const sb = supabaseService();

  const sp = body?.message?.successful_payment;
  if (sp) {
    const uid = String(body?.message?.from?.id ?? '');
    const chargeId = String(sp.telegram_payment_charge_id ?? body?.update_id);
    const amount = Number(sp.total_amount ?? 0);

    await sb.from('payments').upsert({
      user_id: uid,
      external_id: chargeId,
      amount,
      provider: 'stars',
      status: 'paid',
      payload: body,
    }, { onConflict: 'external_id' });

    return Response.json({ ok: true });
  }

  await sb.from('imports').insert({ source: 'tg_update', status: 'ok', stats_json: body }).select();
  return Response.json({ ok: true });
}
