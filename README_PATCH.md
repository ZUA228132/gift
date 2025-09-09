# Patch v4 — Tailwind & Supabase Browser Fix

This patch adds Tailwind as a PostCSS plugin and introduces a separate Supabase client for the browser. It also provides an optional dev‑mode to preview the app outside Telegram. Follow these steps after applying the patch.

## 1. Tailwind configuration (no CDN)

- **Remove** any `<script src="https://cdn.tailwindcss.com">` from your React/Next pages or layout. Tailwind should not be loaded from a CDN in production.
- Install Tailwind via npm (already in your `package.json` devDependencies in this patch). Make sure to run `npm install` or `pnpm install`.
- Use `tailwind.config.ts` and `postcss.config.js` from this patch. The build will automatically pick them up.
- Include the global CSS file (`app/globals.css`) in your `app/layout.tsx`:
  ```tsx
  import './globals.css';
  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (<html lang="en"><body>{children}</body></html>);
  }
  ```

## 2. Supabase browser client

- Use the provided `lib/supabase-browser.ts` in any client component (files with `'use client'`). It reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Do not** import `supabaseService` on the client; that's only for server code.

## 3. Environment variables

Add these **public** variables alongside your existing Supabase variables in Vercel (Production & Preview):
```
NEXT_PUBLIC_SUPABASE_URL=<same as SUPABASE_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<same as SUPABASE_ANON_KEY>
```
Keep your server variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE`) unchanged. Also set `NEXT_PUBLIC_DEV_MODE=1` if you want to test outside Telegram using `?dev=1`.

## 4. What's included

- `tailwind.config.ts` — default Tailwind config.
- `postcss.config.js` — config for PostCSS with Tailwind.
- `app/globals.css` — imports Tailwind base, components and utilities; you can add custom styles here.
- `lib/supabase-browser.ts` — browser client setup.

After unzipping this patch, commit and redeploy. Tailwind will compile properly and the Supabase client in the browser will use the correct keys.
