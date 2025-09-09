# Claw Machine Fixes Patch (v3)

This patch archive contains files and configuration updates to fix the issues with the
Telegram Gift Claw mini‑app project. These files implement the missing API routes,
catalog page, bootstrap handler and Stars integration, and ensure that they run
on the Node.js runtime with dynamic rendering disabled on Vercel. It also sets
up TypeScript path aliases via `tsconfig.json` so that imports such as `@/lib/*`
work correctly.

## Contents

| Path | Description |
| --- | --- |
| `lib/supabase.ts` | Helper functions to create anonymous and service Supabase clients. |
| `lib/telegram.ts` | Functions to verify Telegram WebApp `initData` and extract the user. |
| `app/api/catalog/route.ts` | Server route that returns the catalog of available items from the `catalog_view`. |
| `app/api/app/bootstrap/route.ts` | Server route that validates `initData`, upserts users and returns the price per play. |
| `app/api/payments/stars/create-invoice/route.ts` | Server route to create a Stars invoice via the Telegram Bot API. |
| `app/api/tg/webhook/route.ts` | Server route to handle Telegram bot webhooks and record successful payments. |
| `app/catalog/page.tsx` | A page that fetches the catalog from the API and renders a grid of items. |
| `tsconfig.json` | Configuration enabling `@/*` import aliases. |

All API routes specify `runtime = 'nodejs'` and `dynamic = 'force-dynamic'` to ensure
they run in the Node.js runtime on Vercel and are not statically cached.

## Installation

1. Unzip this archive into the root of your Next.js project. Ensure that the
   nested directories (`lib/` and `app/`) merge with the existing ones.
2. Commit the changes to your repository and redeploy the project on Vercel.
3. Verify that the routes `/api/catalog` and `/api/app/bootstrap` return data
   without errors. The page `/catalog` should display the available prizes.
4. Check that your environment variables are correctly set in Vercel. See the
   project documentation for required variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE`, `APP_BASE_URL`, `TELEGRAM_BOT_TOKEN`,
   `TELEGRAM_BOT_SECRET`, `TELEGRAM_STARS_PROVIDER_TOKEN`).
5. Optionally add `NEXT_PUBLIC_DEV_MODE=1` to your Vercel environment if you
   want to test the app outside of Telegram using the `?dev=1` URL parameter.
