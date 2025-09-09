# Patch: Telegram Gifts Claw — missing routes & dev-mode

This patch adds the missing routes and pages so that:
- `/api/catalog` returns the prize list from `catalog_view`
- `/catalog` renders the catalog UI
- `/api/app/bootstrap` validates Telegram initData (or allows dev fallback)
- (Optionally) Stars: `/api/payments/stars/create-invoice`
- Telegram webhook: `/api/tg/webhook`

It also documents minimal env vars.

## What to do

1. Unzip this archive into the root of your Next.js **App Router** project.
   - It will create/overwrite the `app/api/...`, `app/catalog/`, and `lib/` files shown below.
2. Ensure dependencies in `package.json` (add if missing):
   ```jsonc
   {
     "dependencies": {
       "@supabase/supabase-js": "^2.45.0",
       "@telegram-apps/sdk": "^1.0.0",
       "clsx": "^2.1.1"
     }
   }
   ```
3. Set env on Vercel (Production/Preview/Dev):
   ```
   SUPABASE_URL=...
   SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE=...
   APP_BASE_URL=https://<your>.vercel.app

   JWT_SECRET=...
   TELEGRAM_BOT_SECRET=...

   TELEGRAM_BOT_TOKEN=...
   TELEGRAM_BOT_USERNAME=@your_bot
   TELEGRAM_MINIAPP_BOT_USERNAME=@your_bot
   TELEGRAM_STARS_PROVIDER_TOKEN=...

   NEXT_PUBLIC_DEV_MODE=1  # optional, to preview outside Telegram with ?dev=1
   ```

4. Deploy. Then set webhook (replace tokens/secrets):
   ```bash
   curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook"      -H "Content-Type: application/json"      -d '{"url":"'$APP_BASE_URL'/api/tg/webhook","secret_token":"'$TELEGRAM_BOT_SECRET'"}'
   ```

## Files added by this patch

- `lib/supabase.ts`
- `lib/telegram.ts`
- `app/api/catalog/route.ts`
- `app/catalog/page.tsx`
- `app/api/app/bootstrap/route.ts`
- `app/api/payments/stars/create-invoice/route.ts`
- `app/api/tg/webhook/route.ts`

All files are server-safe and require Node runtime (Next.js default).
