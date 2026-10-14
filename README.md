# TicketSwap

TicketSwap helps IE students resell event tickets they can't use so they don't lose their money.

Next.js (App Router) + Supabase Auth + Supabase Postgres with Row Level Security.

## Run locally

1. `npm install`
2. Make sure `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
3. Run `supabase/schema.sql` once in Supabase → SQL Editor.
4. In Supabase → Authentication → Sign In / Providers → Email, turn **off** "Confirm email".
5. `npm run dev` and open http://localhost:3000

## Deploy (Vercel)

Add the same two environment variables in Vercel → Project → Settings → Environment Variables.
